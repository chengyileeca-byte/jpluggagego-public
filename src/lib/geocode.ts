import "server-only";
import { extractPostalFromText, lookupPostal } from "./postal-lookup";
import { PREFECTURES } from "./japan";

// JIS 2-digit code → 都道府県 name. ISO 3166-2:JP uses the same numbering
// (e.g. JP-13 = 東京都), so we reuse PREFECTURES.code as the lookup key.
const PREF_BY_CODE = new Map<string, string>(
  PREFECTURES.map((p) => [p.code, p.name]),
);
const PREF_NAMES = PREFECTURES.map((p) => p.name);

// Pull a canonical 都道府県 name out of a Nominatim-style address block + its
// display_name. Nominatim for Japan doesn't populate a `state` field reliably,
// but it does set `ISO3166-2-lvl4` (JP-NN). As a fallback, we scan
// display_name for any PREFECTURES.name substring.
function resolveJpPrefecture(
  address: Record<string, string | undefined> | undefined,
  displayName: string | undefined,
): string | undefined {
  if (address) {
    const iso = address["ISO3166-2-lvl4"];
    if (typeof iso === "string" && iso.startsWith("JP-")) {
      const code = iso.slice(3);
      const name = PREF_BY_CODE.get(code);
      if (name) return name;
    }
    for (const key of ["state", "province", "region"] as const) {
      const v = address[key];
      if (v && PREF_NAMES.includes(v)) return v;
    }
  }
  if (displayName) {
    for (const name of PREF_NAMES) {
      if (displayName.includes(name)) return name;
    }
  }
  return undefined;
}

// Nominatim usage policy: max 1 req/sec, valid User-Agent required, no heavy
// commercial use. We add a module-level in-memory cache so repeat lookups
// within a warm server don't re-hit Nominatim.
//
// Japanese address matching is tricky:
//   1. Kyoto-style 通り名 addresses ("四条通新町東入") are not in OSM.
//   2. Long tail of block-level detail (丁目・番地) often misses.
// So we try progressively coarser candidates until one hits.

const UA = "jpluggagego/1.0 (+https://jpluggagego.com)";
const ENDPOINT = "https://nominatim.openstreetmap.org/search";
// 国土地理院 (GSI) address search — free, no API key, covers JP down to 番地.
// Rejects romaji (returns spurious matches), so only used when the query
// contains CJK characters.
const GSI_ENDPOINT = "https://msearch.gsi.go.jp/address-search/AddressSearch";

// True only if the query is predominantly Japanese script. A romaji address
// with a trailing "日本" (2 kanji chars) doesn't count — GSI will hallucinate
// a match on the 2-char suffix alone (e.g. "...日本" → 「新潟県上越市二」).
// Threshold: ≥50% of non-space chars must be Hiragana/Katakana/Kanji.
function isMostlyJapanese(s: string): boolean {
  const noSpace = s.replace(/\s/g, "");
  if (!noSpace) return false;
  const jp = noSpace.match(/[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FFF]/g);
  return (jp?.length ?? 0) / noSpace.length >= 0.5;
}

// POI / landmark suffixes. GSI 地図検索 only indexes administrative addresses,
// so "大阪駅" won't match the actual 大阪駅 — it will fuzzy-match the closest
// kanji fragment it knows ("大坂" in 福島県). Route POI-shaped queries to
// Nominatim first to avoid that.
const POI_SUFFIX_RE =
  /(?:駅|空港|港|停留所|図書館|美術館|博物館|水族館|動物園|公園|神社|寺|大社|城|ホテル|旅館|センター|大学|病院|スタジアム|タワー|ビル|会館|駐車場|支店|店|モール)$/;
function isLikelyPOI(s: string): boolean {
  return POI_SUFFIX_RE.test(s.trim());
}

export interface GeocodeResult {
  lat: number;
  lon: number;
  display_name: string;
  matched_query: string; // which candidate actually matched
  fallback_level: number; // 0 = original, N = Nth coarser attempt
  address?: {
    country_code?: string;
    state?: string;
    province?: string;
    prefecture?: string;
    city?: string;
    postcode?: string;
  };
}

const cache = new Map<string, { at: number; ttl: number; value: GeocodeResult | null }>();
// Precise hits (fallback_level=0) cache 24h; imprecise falls back cache only
// 10m so pipeline changes or newly-imported postal data pick up quickly.
const TTL_PRECISE = 1000 * 60 * 60 * 24;
const TTL_LOOSE = 1000 * 60 * 10;
const TTL_NULL = 1000 * 60 * 5;

// "京都市下京区四条通新町東入八百屋町 2" → drop trailing street-name block.
// Kyoto 通り名 pattern: 「X通Y(東|西|上|下)(入|ル|る)」. Stripping this leaves
// 「京都市下京区」+ 町名 which Nominatim can match.
function stripKyotoStreetName(s: string): string | null {
  const m = s.match(/^(.+?[市区町村])(.*?通.+?(?:東入|西入|上る|下る|上ル|下ル|入る|入ル))(.*)$/);
  if (!m) return null;
  const rest = (m[1] + m[3]).trim();
  return rest !== s ? rest : null;
}

// Strip trailing house numbers / 丁目 / block numbers.
// 「京都市下京区八百屋町 2」 → 「京都市下京区八百屋町」
function stripBlockNumber(s: string): string | null {
  const out = s
    .replace(/[\s ]*[\d０-９]+(?:[-ー－]?[\d０-９]+)*[\s ]*$/, "")
    .replace(/[\s ]*[\d０-９]+丁目.*$/, "")
    .trim();
  return out && out !== s ? out : null;
}

// Truncate to "〇〇市〇〇区" / "〇〇市" / "〇〇町" / "〇〇村".
// Picks the *last* admin-unit token, preserving prefecture prefix if present.
function truncateToAdminUnit(s: string): string | null {
  const m = s.match(/^(.*?(?:市[^市区町村]*?区|市|町|村))/);
  if (!m) return null;
  const out = m[1].trim();
  return out && out !== s ? out : null;
}

// Google-Maps-style romaji addresses end with either "Japan" / "日本" and/or
// a "123-4567" or 7-digit postcode. Strip both so later steps can work on
// "<street>, <ward>, <city>, <prefecture>" cleanly.
function stripRomajiTail(s: string): string | null {
  const out = s
    .replace(/[,\s]*日本\s*$/, "")
    .replace(/[,\s]*Japan\s*$/i, "")
    .replace(/[,\s]*\d{3}[-ー－]?\d{4}\s*$/, "")
    .trim();
  return out && out !== s ? out : null;
}

// For romaji / mixed addresses: after stripping country+postcode, take the
// last N comma-separated parts. Google Maps copy-paste is typically
// "<street>, <ward>, <city>, <prefecture>"; the last 2 ("Koriyama, Fukushima")
// is what Nominatim can actually match; the last 1 is a safe final fallback.
function truncateToLastCommaParts(s: string, keep: number): string | null {
  const stripped = stripRomajiTail(s) ?? s;
  if (!stripped.includes(",")) return null;
  const parts = stripped
    .split(/[,、]/)
    .map((p) => p.trim())
    .filter(Boolean);
  if (parts.length <= keep) return null;
  const out = parts.slice(-keep).join(" ");
  return out && out !== s ? out : null;
}

// Build ordered fallback candidates (dedup preserved order).
function fallbackCandidates(raw: string): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  const push = (v: string | null | undefined) => {
    if (!v) return;
    const t = v.trim();
    if (!t || seen.has(t)) return;
    seen.add(t);
    out.push(t);
  };

  push(raw);
  push(stripRomajiTail(raw));
  push(stripKyotoStreetName(raw));
  push(stripBlockNumber(raw));
  // Apply both strips together for the nastiest case.
  const ks = stripKyotoStreetName(raw);
  if (ks) push(stripBlockNumber(ks));
  push(truncateToAdminUnit(raw));
  // Romaji/Google-Maps fallbacks — tighten progressively.
  push(truncateToLastCommaParts(raw, 2));
  push(truncateToLastCommaParts(raw, 1));
  return out;
}

// GSI returns an array of GeoJSON-ish features; [lng, lat] order.
// Example: [{"geometry":{"coordinates":[135.755, 34.995],"type":"Point"},
//            "properties":{"title":"京都府京都市下京区八百屋町"}}]
async function tryGSI(q: string): Promise<GeocodeResult | null> {
  const url = `${GSI_ENDPOINT}?q=${encodeURIComponent(q)}`;
  const res = await fetch(url, {
    headers: { "User-Agent": UA, Accept: "application/json" },
    signal: AbortSignal.timeout(10_000),
  });
  if (!res.ok) return null;
  const json = (await res.json()) as Array<{
    geometry?: { coordinates: [number, number] };
    properties?: { title?: string };
  }>;
  if (!json.length || !json[0].geometry) return null;
  const [lon, lat] = json[0].geometry.coordinates;
  const title = json[0].properties?.title ?? q;
  const prefecture = resolveJpPrefecture(undefined, title);
  return {
    lat,
    lon,
    display_name: title,
    matched_query: q,
    fallback_level: 0,
    address: prefecture ? { country_code: "jp", prefecture } : undefined,
  };
}

async function tryNominatim(q: string): Promise<GeocodeResult | null> {
  const url = new URL(ENDPOINT);
  url.searchParams.set("q", q);
  url.searchParams.set("format", "json");
  url.searchParams.set("limit", "1");
  url.searchParams.set("addressdetails", "1");
  url.searchParams.set("countrycodes", "jp");
  url.searchParams.set("accept-language", "ja");

  const res = await fetch(url.toString(), {
    headers: { "User-Agent": UA, Accept: "application/json" },
    signal: AbortSignal.timeout(10_000),
  });
  if (!res.ok) return null;
  const json = (await res.json()) as Array<{
    lat: string;
    lon: string;
    display_name: string;
    address?: Record<string, string | undefined>;
  }>;
  if (!json.length) return null;
  const top = json[0];
  const prefecture = resolveJpPrefecture(top.address, top.display_name);
  const merged: GeocodeResult["address"] = {
    ...top.address,
    prefecture,
  };
  return {
    lat: Number(top.lat),
    lon: Number(top.lon),
    display_name: top.display_name,
    matched_query: q,
    fallback_level: 0,
    address: merged,
  };
}

export async function geocodeAddress(
  address: string,
): Promise<GeocodeResult | null> {
  const raw = address.trim();
  if (!raw) return null;
  const cacheKey = raw.toLowerCase();
  const cached = cache.get(cacheKey);
  if (cached && Date.now() - cached.at < cached.ttl) return cached.value;

  // If the input is romaji-dominant but contains a postal code, the richest
  // signal is the postal → Japanese address mapping. Insert it at the top of
  // the candidate list so GSI can resolve it to 町名 precision.
  const extraTop: string[] = [];
  if (!isMostlyJapanese(raw)) {
    const zip = extractPostalFromText(raw);
    if (zip) {
      const p = await lookupPostal(zip);
      if (p) {
        extraTop.push(`${p.prefecture}${p.city}${p.town}`);
        extraTop.push(`${p.prefecture}${p.city}`);
      }
    }
  }

  const candidates = [...extraTop, ...fallbackCandidates(raw)];

  for (let i = 0; i < candidates.length; i++) {
    const q = candidates[i];
    const jp = isMostlyJapanese(q);
    const poi = isLikelyPOI(q);
    // POIs ("大阪駅" / "関西空港") aren't in GSI's 住所 index — it will
    // fuzzy-match to unrelated kanji. Nominatim has OSM POI data, so we
    // flip the provider order for likely-POI Japanese queries.
    // Plain Japanese addresses: GSI first (番地 precision), then Nominatim.
    // Romaji queries: GSI returns spurious matches, skip it.
    const providers: Array<{ name: string; fn: (q: string) => Promise<GeocodeResult | null> }> =
      !jp
        ? [{ name: "nominatim", fn: tryNominatim }]
        : poi
          ? [
              { name: "nominatim", fn: tryNominatim },
              { name: "gsi", fn: tryGSI },
            ]
          : [
              { name: "gsi", fn: tryGSI },
              { name: "nominatim", fn: tryNominatim },
            ];

    for (const p of providers) {
      try {
        const r = await p.fn(q);
        if (r) {
          const final = { ...r, fallback_level: i };
          const ttl = i === 0 ? TTL_PRECISE : TTL_LOOSE;
          cache.set(cacheKey, { at: Date.now(), ttl, value: final });
          return final;
        }
      } catch (err) {
        console.error(`[geocode:${p.name}] ${q} error`, err);
      }
    }
    // Respect Nominatim 1 req/sec between retries. GSI has no stated limit,
    // but keep the delay to be polite.
    if (i < candidates.length - 1) {
      await new Promise((r) => setTimeout(r, 1100));
    }
  }

  cache.set(cacheKey, { at: Date.now(), ttl: TTL_NULL, value: null });
  return null;
}

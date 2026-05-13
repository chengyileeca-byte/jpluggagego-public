// Scrape Japanese 郵便局 (post office) master list from OpenStreetMap via
// Overpass API. ODbL-licensed, community-maintained, ~21,500 nodes as of
// 2026-04. Attribution required on the UI: "地図データ © OpenStreetMap
// contributors, ODbL".
//
// Usage:
//   npm run scrape:yuu-post:dry           # parse only
//   npm run scrape:yuu-post:dry -- --limit 20
//   npm run scrape:yuu-post               # full upsert
//
// Runtime: one Overpass query, ~30-60s, ~30MB JSON.

import { config as loadEnv } from "dotenv";
loadEnv({ path: ".env.local" });

import { PREFECTURES } from "./lib/japan-prefectures";
import { createAdminClient } from "../src/lib/supabase/admin";

const ENDPOINTS = [
  "https://overpass-api.de/api/interpreter",
  "https://overpass.kumi.systems/api/interpreter",
  "https://overpass.openstreetmap.ru/api/interpreter",
];

const QUERY = `
[out:json][timeout:180];
area["ISO3166-1"="JP"][boundary=administrative]->.jp;
node(area.jp)["amenity"="post_office"];
out body;
`.trim();

interface OverpassNode {
  type: "node";
  id: number;
  lat: number;
  lon: number;
  tags?: Record<string, string>;
}

interface OverpassResponse {
  version: number;
  generator: string;
  osm3s: { timestamp_osm_base: string; copyright: string };
  elements: OverpassNode[];
}

interface PostOfficeRow {
  osm_id: number;
  name_jp: string;
  name_en: string | null;
  address_jp: string | null;
  prefecture: string | null;
  postal_code: string | null;
  phone: string | null;
  opening_hours: string | null;
  website: string | null;
  lat: number;
  lon: number;
  raw_tags: Record<string, string>;
}

function normalizePostal(v: string | undefined): string | null {
  if (!v) return null;
  const digits = v.replace(/[^0-9]/g, "");
  return digits.length === 7 ? digits : null;
}

function prefectureOf(tags: Record<string, string>): string | null {
  // OSM tagging convention varies; try several keys in order.
  const candidates = [
    tags["is_in:state"],
    tags["addr:province"],
    tags["addr:state"],
    tags["addr:full"],
    tags["addr:city"],
  ];
  for (const c of candidates) {
    if (!c) continue;
    for (const p of PREFECTURES) {
      if (c.startsWith(p.name) || c.includes(p.name)) return p.name;
    }
  }
  return null;
}

function composeAddress(tags: Record<string, string>): string | null {
  if (tags["addr:full"]) return tags["addr:full"];
  const parts = [
    tags["addr:province"] ?? tags["addr:state"] ?? tags["is_in:state"],
    tags["addr:city"],
    tags["addr:quarter"],
    tags["addr:neighbourhood"],
    tags["addr:block_number"],
    tags["addr:housenumber"],
  ].filter(Boolean);
  return parts.length ? parts.join("") : null;
}

function toRow(n: OverpassNode): PostOfficeRow | null {
  if (!Number.isFinite(n.lat) || !Number.isFinite(n.lon)) return null;
  const tags = n.tags ?? {};
  const name = tags["name:ja"] ?? tags["name"];
  if (!name) return null; // anonymous nodes — skip, not useful for UI

  return {
    osm_id: n.id,
    name_jp: name.trim(),
    name_en: (tags["name:en"] ?? "").trim() || null,
    address_jp: composeAddress(tags),
    prefecture: prefectureOf(tags),
    postal_code: normalizePostal(tags["addr:postcode"]),
    phone: (tags["phone"] ?? tags["contact:phone"] ?? "").trim() || null,
    opening_hours: (tags["opening_hours"] ?? "").trim() || null,
    website: (tags["website"] ?? tags["contact:website"] ?? "").trim() || null,
    lat: n.lat,
    lon: n.lon,
    raw_tags: tags,
  };
}

async function fetchOverpass(): Promise<OverpassResponse> {
  let lastErr: unknown = null;
  for (const url of ENDPOINTS) {
    try {
      console.log(`[osm-post] fetching from ${url}`);
      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          "User-Agent": "jpluggagego-scraper/1.0 (+https://jpluggagego.com)",
        },
        body: new URLSearchParams({ data: QUERY }).toString(),
      });
      if (!res.ok) {
        console.warn(`  HTTP ${res.status} — trying next endpoint`);
        lastErr = new Error(`HTTP ${res.status} from ${url}`);
        continue;
      }
      const json = (await res.json()) as OverpassResponse;
      return json;
    } catch (err) {
      console.warn(`  ${(err as Error).message} — trying next endpoint`);
      lastErr = err;
    }
  }
  throw lastErr ?? new Error("all Overpass endpoints failed");
}

async function main() {
  const args = process.argv.slice(2);
  const dryRun = args.includes("--dry-run");
  const limitIdx = args.indexOf("--limit");
  const limit =
    limitIdx >= 0 && args[limitIdx + 1] ? Number(args[limitIdx + 1]) : undefined;

  console.log(
    `[osm-post] ${dryRun ? "DRY RUN" : "WILL UPSERT"}${limit ? ` limit=${limit}` : ""}`,
  );

  const resp = await fetchOverpass();
  console.log(
    `[osm-post] OSM snapshot ${resp.osm3s.timestamp_osm_base} — ${resp.elements.length} nodes`,
  );

  const elements = limit ? resp.elements.slice(0, limit) : resp.elements;

  const dedupe = new Map<number, PostOfficeRow>();
  let droppedNoName = 0;
  let droppedBadCoord = 0;
  for (const n of elements) {
    if (n.type !== "node") continue;
    const row = toRow(n);
    if (!row) {
      if (!Number.isFinite(n.lat) || !Number.isFinite(n.lon)) droppedBadCoord++;
      else droppedNoName++;
      continue;
    }
    dedupe.set(row.osm_id, row);
  }
  const rows = [...dedupe.values()];

  let withPref = 0,
    withAddr = 0,
    withHours = 0,
    withPhone = 0;
  const byPref = new Map<string, number>();
  for (const r of rows) {
    if (r.prefecture) {
      withPref++;
      byPref.set(r.prefecture, (byPref.get(r.prefecture) ?? 0) + 1);
    }
    if (r.address_jp) withAddr++;
    if (r.opening_hours) withHours++;
    if (r.phone) withPhone++;
  }

  console.log(
    `\n[osm-post] Summary: kept=${rows.length} dropped_no_name=${droppedNoName} dropped_bad_coord=${droppedBadCoord}`,
  );
  console.log(
    `  field coverage: address=${withAddr} prefecture=${withPref} hours=${withHours} phone=${withPhone} (of ${rows.length})`,
  );
  console.log(`\n[osm-post] Samples:`);
  for (const r of rows.slice(0, 5)) {
    console.log(
      `  ${r.osm_id}  ${r.prefecture ?? "(no-pref)"}  ${r.name_jp.padEnd(20)} ${r.opening_hours ?? "-"}  ${r.address_jp ?? "-"}`,
    );
  }
  const prefSummary = [...byPref.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 15)
    .map(([k, v]) => `${k}:${v}`)
    .join("  ");
  console.log(`\n[osm-post] Top 15 prefectures:\n  ${prefSummary}`);

  if (dryRun) {
    console.log(`\n[osm-post] DRY RUN — no DB writes.`);
    return;
  }

  const supabase = createAdminClient();
  const CHUNK = 500;
  let written = 0;
  for (let i = 0; i < rows.length; i += CHUNK) {
    const batch = rows.slice(i, i + CHUNK);
    const { error } = await supabase
      .from("yuu_post_offices")
      .upsert(batch, { onConflict: "osm_id" });
    if (error) {
      console.error("[osm-post] upsert error:", error);
      process.exit(1);
    }
    written += batch.length;
    process.stdout.write(`\r[osm-post] upsert: ${written}/${rows.length}`);
  }
  process.stdout.write("\n");
  console.log(`[osm-post] Done — ${written} rows upserted.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

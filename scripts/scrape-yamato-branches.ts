// Scrape Yamato 営業所 (branch) master list via the Zenrin-backed
// nkyoten.cgi endpoint proxied through zdcemaphttp.cgi. We iterate
// JAPAN_GRID centroids, paginate, dedupe by branch_code, and upsert.
//
// Response format (EUC-JP, JSONP-ish):
//   ZdcEmapHttpResult[1] = '<status>\t<returned>\t<requested>\r\n\t0\t0...\n<record>\n...';
// `\t`/`\n`/`\r`/`\\` are literal 2-char escapes inside the JS string.
//
// Usage:
//   npm run scrape:yamato-branches:dry            # parse only, no DB write
//   npm run scrape:yamato-branches:dry -- --limit 2
//   npm run scrape:yamato-branches                # full upsert
//
// Runtime: ~5-10 min for 65 grid points × polite 3-5s delay, single-page
// per point; longer for dense metros that need multi-page pagination.

import { config as loadEnv } from "dotenv";
loadEnv({ path: ".env.local" });

import { politeFetch } from "./lib/polite-fetch";
import { JAPAN_GRID, type GridPoint } from "./lib/japan-grid";
import { PREFECTURES } from "./lib/japan-prefectures";
import { createAdminClient } from "../src/lib/supabase/admin";

const STATIC_KEY =
  "53nQ2P9tlg4vBGnAjvBvnAqf9FmgbPB5idj5SdXuomA4fhEzTErxAzTjrxpzThngszFIlgrnFDng0z46oRAL0ungdzFblg3nFengVz57oRuLTE";

const PROXY_HOST = "https://locations.kuronekoyamato.co.jp/p/yamato01/zdcemaphttp.cgi";
const PAGE_SIZE = 1000;

interface RawRecord {
  branch_code: string;
  lat: number;
  lon: number;
  distance_m: number;
  name_jp: string;
  address_jp: string;
  hours_weekday: string | null;
  last_accept_weekday: string | null;
  hours_saturday: string | null;
  last_accept_saturday: string | null;
  hours_sunday_holiday: string | null;
  last_accept_sunday_holiday: string | null;
  postal_code: string | null;
  phone: string | null;
  grade: string | null;
  flags_raw: string;
}

function buildUrl(p: GridPoint, pos: number): string {
  const inner =
    `http://127.0.0.1/cgi/nkyoten.cgi?&key=${STATIC_KEY}` +
    `&cid=yamato01&opt=yamato01` +
    `&pos=${pos}&cnt=${PAGE_SIZE}` +
    `&enc=EUC&lat=${p.lat}&lon=${p.lon}&latlon=` +
    `&rad=${p.radius_m}&knsu=${PAGE_SIZE}` +
    `&exkid=&hour=1&cust=&exarea=&polycol=&jkn=COL_01:1`;
  const encoded = encodeURIComponent(inner);
  return `${PROXY_HOST}?target=${encoded}&zdccnt=1&enc=EUC&encodeflg=0`;
}

function decodeEucJp(buf: ArrayBuffer): string {
  return new TextDecoder("euc-jp").decode(buf);
}

// Strip the `ZdcEmapHttpResult[N] = '...';` wrapper and unescape `\t \n \r \\`.
function unwrapAndUnescape(raw: string): string {
  const openIdx = raw.indexOf("= '");
  const closeIdx = raw.lastIndexOf("';");
  if (openIdx < 0 || closeIdx <= openIdx) {
    throw new Error(
      `unexpected response shape (first 120 chars): ${raw.slice(0, 120)}`,
    );
  }
  const body = raw.slice(openIdx + 3, closeIdx);
  // Literal 2-char escapes: \\, \t, \n, \r
  // Order matters: handle \\ last so we don't double-unescape.
  return body
    .replace(/\\t/g, "\t")
    .replace(/\\n/g, "\n")
    .replace(/\\r/g, "\r")
    .replace(/\\\\/g, "\\");
}

function prefectureOf(address: string): string | null {
  for (const p of PREFECTURES) {
    if (address.startsWith(p.name)) return p.name;
  }
  return null;
}

function normalizeHours(s: string): string | null {
  const t = s.trim();
  if (!t) return null;
  if (t.includes("お問い合わせ") || t.includes("要問合せ")) return null;
  // "09:00　〜　20:00" (full-width space + ～) → "09:00-20:00"
  return t.replace(/\s+/g, "").replace(/[〜～]/g, "-");
}

function normalizeLastAccept(s: string): string | null {
  const t = s.trim();
  return t ? t : null;
}

function parseRecords(text: string, point: GridPoint): {
  records: RawRecord[];
  returned: number;
  requested: number;
  status: string;
} {
  // Split on real newline after unescape
  const lines = text.split("\n");
  if (lines.length < 1) {
    throw new Error(`empty response body for ${point.label}`);
  }
  const [status, returnedStr, requestedStr] = lines[0].split("\t");
  const returned = Number(returnedStr);
  const requested = Number(requestedStr);
  const records: RawRecord[] = [];

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    if (!line) continue;
    const f = line.split("\t");
    // First real field is branch_code. Phantom/header rows have empty first col.
    if (!f[0]) continue;
    // Icon filter: `jkn=COL_01:1` already restricts to 営業所 (YTC), but guard anyway.
    const iconType = f[3];
    if (iconType !== "YTC") continue;

    const flags = f.slice(34, 44).map((v) => (v === "" ? "0" : v)).join(",");

    records.push({
      branch_code: f[0],
      lat: Number(f[1]),
      lon: Number(f[2]),
      distance_m: Number(f[4] ?? "0"),
      name_jp: (f[6] ?? "").trim(),
      address_jp: (f[7] ?? "").trim(),
      hours_weekday: normalizeHours(f[9] ?? ""),
      last_accept_weekday: normalizeLastAccept(f[10] ?? ""),
      hours_saturday: normalizeHours(f[11] ?? ""),
      last_accept_saturday: normalizeLastAccept(f[12] ?? ""),
      hours_sunday_holiday: normalizeHours(f[13] ?? ""),
      last_accept_sunday_holiday: normalizeLastAccept(f[14] ?? ""),
      postal_code: (f[15] ?? "").trim() || null,
      phone: (f[16] ?? "").trim() || null,
      grade: (f[17] ?? "").trim() || null,
      flags_raw: flags,
    });
  }

  return { records, returned, requested, status };
}

// Fetch one page at a fixed lat/lon/radius. The server caps at ~cnt records
// per query regardless of `pos`; pagination past that just returns a
// 1-record overflow hint. Single page is enough.
async function fetchOne(
  label: string,
  lat: number,
  lon: number,
  radius_m: number,
): Promise<{ records: RawRecord[]; saturated: boolean }> {
  const dummy: GridPoint = { label, lat, lon, radius_m };
  const url = buildUrl(dummy, 0);
  const res = await politeFetch(url, { respectJstPeak: false });
  if (!res.ok) {
    console.warn(`  [${label}] HTTP ${res.status} — skipping`);
    return { records: [], saturated: false };
  }
  const buf = await res.arrayBuffer();
  const utf8 = decodeEucJp(buf);
  const body = unwrapAndUnescape(utf8);
  const { records, returned } = parseRecords(body, dummy);
  // Saturated ≈ the API returned a full page — likely more records exist.
  return { records, saturated: returned >= PAGE_SIZE };
}

// Query a grid point. If the API saturates (~1000 cap hit), do ONE bounded
// level of 9-cell subdivision at r/2 (centre + 8 compass). Do not recurse
// further — worst-case density (dense-metro central-Tokyo) stays within cap
// at 30km radius, and depth-2 recursion blows the runtime budget.
async function fetchGridPoint(p: GridPoint): Promise<RawRecord[]> {
  const all: RawRecord[] = [];

  const root = await fetchOne(p.label, p.lat, p.lon, p.radius_m);
  all.push(...root.records);
  if (!root.saturated) return all;

  console.log(
    `  [${p.label}] SATURATED at r=${p.radius_m / 1000}km — splitting into 9 sub-queries`,
  );
  const halfR = p.radius_m / 2;
  const offsetDegLat = halfR / 111_000;
  const lonCos = Math.cos((p.lat * Math.PI) / 180);
  const offsetDegLon = offsetDegLat / lonCos;
  const offsets: Array<[number, number, string]> = [
    [0, 0, "C"],
    [+offsetDegLat, 0, "N"],
    [-offsetDegLat, 0, "S"],
    [0, +offsetDegLon, "E"],
    [0, -offsetDegLon, "W"],
    [+offsetDegLat, +offsetDegLon, "NE"],
    [+offsetDegLat, -offsetDegLon, "NW"],
    [-offsetDegLat, +offsetDegLon, "SE"],
    [-offsetDegLat, -offsetDegLon, "SW"],
  ];
  for (const [dLat, dLon, tag] of offsets) {
    const subLat = p.lat + dLat;
    const subLon = p.lon + dLon;
    const sub = await fetchOne(`${p.label} ${tag}`, subLat, subLon, halfR);
    all.push(...sub.records);
    if (sub.saturated) {
      console.warn(
        `  [${p.label} ${tag}] still saturated at r=${halfR / 1000}km — some records may be missed`,
      );
    }
  }
  return all;
}

interface BranchRow {
  branch_code: string;
  name_jp: string;
  address_jp: string;
  prefecture: string;
  postal_code: string | null;
  phone: string | null;
  lat: number;
  lon: number;
  grade: string | null;
  hours_weekday: string | null;
  last_accept_weekday: string | null;
  hours_saturday: string | null;
  last_accept_saturday: string | null;
  hours_sunday_holiday: string | null;
  last_accept_sunday_holiday: string | null;
  flags_raw: string;
}

function toRow(r: RawRecord): BranchRow | null {
  if (!r.branch_code || !r.name_jp || !r.address_jp) return null;
  if (!Number.isFinite(r.lat) || !Number.isFinite(r.lon)) return null;
  const pref = prefectureOf(r.address_jp);
  if (!pref) {
    console.warn(`  [no pref match] ${r.branch_code} ${r.address_jp}`);
    return null;
  }
  return {
    branch_code: r.branch_code,
    name_jp: r.name_jp,
    address_jp: r.address_jp,
    prefecture: pref,
    postal_code: r.postal_code,
    phone: r.phone,
    lat: r.lat,
    lon: r.lon,
    grade: r.grade,
    hours_weekday: r.hours_weekday,
    last_accept_weekday: r.last_accept_weekday,
    hours_saturday: r.hours_saturday,
    last_accept_saturday: r.last_accept_saturday,
    hours_sunday_holiday: r.hours_sunday_holiday,
    last_accept_sunday_holiday: r.last_accept_sunday_holiday,
    flags_raw: r.flags_raw,
  };
}

async function main() {
  const args = process.argv.slice(2);
  const dryRun = args.includes("--dry-run");
  const limitIdx = args.indexOf("--limit");
  const limit =
    limitIdx >= 0 && args[limitIdx + 1] ? Number(args[limitIdx + 1]) : undefined;

  const grid = limit ? JAPAN_GRID.slice(0, limit) : JAPAN_GRID;
  console.log(
    `[yamato-branches] ${grid.length}/${JAPAN_GRID.length} grid points — ${dryRun ? "DRY RUN" : "WILL UPSERT"}`,
  );

  const dedupe = new Map<string, BranchRow>();
  let seenRaw = 0;
  let droppedNoPref = 0;

  for (let i = 0; i < grid.length; i++) {
    const p = grid[i];
    process.stdout.write(
      `[${String(i + 1).padStart(2, "0")}/${grid.length}] ${p.label} (r=${p.radius_m / 1000}km)… `,
    );
    try {
      const raws = await fetchGridPoint(p);
      seenRaw += raws.length;
      let added = 0;
      for (const r of raws) {
        const row = toRow(r);
        if (!row) {
          if (r.branch_code) droppedNoPref++;
          continue;
        }
        if (!dedupe.has(row.branch_code)) {
          dedupe.set(row.branch_code, row);
          added++;
        }
      }
      console.log(`raw=${raws.length} new=${added} total_uniq=${dedupe.size}`);
    } catch (err) {
      console.log(`ERROR: ${(err as Error).message}`);
    }
  }

  console.log(
    `\n[yamato-branches] Summary: seen_raw=${seenRaw} dropped_no_pref=${droppedNoPref} unique=${dedupe.size}`,
  );

  const rows = [...dedupe.values()];
  console.log(`\n[yamato-branches] Samples:`);
  for (const r of rows.slice(0, 5)) {
    console.log(
      `  ${r.branch_code}  ${r.prefecture}  ${r.name_jp.padEnd(24)} ${r.hours_weekday ?? "-"}  ${r.address_jp}`,
    );
  }

  const byPref = new Map<string, number>();
  for (const r of rows) byPref.set(r.prefecture, (byPref.get(r.prefecture) ?? 0) + 1);
  const prefSummary = [...byPref.entries()]
    .sort((a, b) => b[1] - a[1])
    .map(([k, v]) => `${k}:${v}`)
    .join("  ");
  console.log(`\n[yamato-branches] By prefecture:\n  ${prefSummary}`);

  if (dryRun) {
    console.log(`\n[yamato-branches] DRY RUN — no DB writes.`);
    return;
  }

  const supabase = createAdminClient();
  const CHUNK = 500;
  let written = 0;
  for (let i = 0; i < rows.length; i += CHUNK) {
    const batch = rows.slice(i, i + CHUNK);
    const { error } = await supabase
      .from("yamato_branches")
      .upsert(batch, { onConflict: "branch_code" });
    if (error) {
      console.error("[yamato-branches] upsert error:", error);
      process.exit(1);
    }
    written += batch.length;
    process.stdout.write(`\r[yamato-branches] upsert: ${written}/${rows.length}`);
  }
  process.stdout.write("\n");
  console.log(`[yamato-branches] Done — ${written} rows upserted.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

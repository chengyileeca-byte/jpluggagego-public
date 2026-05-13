// verify-place-fields の report を読んで、安全な fix を自動適用する。
//
// 適用 rule:
//   - seed_official_url_missing → external_urls.official = google_website
//   - lat_lon_drift_>1km        → lat = google_lat, lon = google_lng
//   - seed_lat_lon_missing      → lat = google_lat, lon = google_lng
//   - url_host_mismatch         → 適用しない(seed と Google どちらが正しいか不明)
//   - place_id_not_found        → 適用しない
//   - closed_permanently_*      → 適用しない(refresh-business-status の責務)
//
// Usage:
//   npm run apply:place-enrichment:dry   # 適用候補件数のみ印
//   npm run apply:place-enrichment       # JSON 書込

import { config as loadEnv } from "dotenv";
loadEnv({ path: ".env.local" });

import {
  readFileSync,
  writeFileSync,
  mkdirSync,
  existsSync,
  readdirSync,
} from "fs";
import { join, dirname } from "path";

const DATA_DIR = "public/data";
const ENTRIES_JSON = join(DATA_DIR, "japan_entries.json");
const BY_PREF_DIR = join(DATA_DIR, "by-pref");
const REPORT_JSON = join(DATA_DIR, "verification/place-fields-report.json");

function readAllEntries(): Record<string, unknown>[] {
  if (existsSync(ENTRIES_JSON)) {
    return JSON.parse(readFileSync(ENTRIES_JSON, "utf8")) as Record<
      string,
      unknown
    >[];
  }
  if (!existsSync(BY_PREF_DIR)) return [];
  const all: Record<string, unknown>[] = [];
  for (const d of readdirSync(BY_PREF_DIR)) {
    const f = join(BY_PREF_DIR, d, "japan_entries.json");
    if (existsSync(f))
      all.push(...(JSON.parse(readFileSync(f, "utf8")) as Record<string, unknown>[]));
  }
  return all;
}

function writeAll(entries: Record<string, unknown>[]) {
  mkdirSync(dirname(ENTRIES_JSON), { recursive: true });
  writeFileSync(ENTRIES_JSON, JSON.stringify(entries, null, 2) + "\n");
  const buckets = new Map<string, Record<string, unknown>[]>();
  for (const e of entries) {
    const p = (e.prefecture_ja as string) || "_no_pref";
    const arr = buckets.get(p) ?? [];
    arr.push(e);
    buckets.set(p, arr);
  }
  for (const [p, arr] of buckets) {
    const dir = join(BY_PREF_DIR, encodeURIComponent(p));
    mkdirSync(dir, { recursive: true });
    writeFileSync(
      join(dir, "japan_entries.json"),
      JSON.stringify(arr, null, 2) + "\n",
    );
  }
}

interface Flag {
  slug: string;
  google_place_id: string;
  flags: string[];
  diff: {
    seed_lat?: number | null;
    seed_lon?: number | null;
    google_lat?: number;
    google_lng?: number;
    distance_m?: number;
    seed_official?: string | null;
    google_website?: string | null;
  };
}

interface Report {
  flagged: Flag[];
}

function main() {
  const dry = process.argv.includes("--dry");
  if (!existsSync(REPORT_JSON)) {
    console.error(`[apply] report 無し: ${REPORT_JSON}`);
    console.error(`[apply] 先に 'npm run verify:place-fields' を走らせる`);
    process.exit(1);
  }
  const report: Report = JSON.parse(readFileSync(REPORT_JSON, "utf8"));
  const all = readAllEntries();
  const bySlug = new Map<string, Record<string, unknown>>();
  for (const e of all) bySlug.set(e.slug as string, e);

  let urlAdded = 0;
  let latLonUpgraded = 0;
  let latLonAdded = 0;
  let skipped = 0;

  for (const f of report.flagged) {
    const target = bySlug.get(f.slug);
    if (!target) {
      skipped++;
      continue;
    }
    const hasUrlMissing = f.flags.includes("seed_official_url_missing");
    const driftFlag = f.flags.find((t) => t.startsWith("lat_lon_drift_"));
    const hasLatLonMissing = f.flags.includes("seed_lat_lon_missing");

    if (hasUrlMissing && f.diff.google_website) {
      const ext =
        (target.external_urls as Record<string, string> | undefined) ?? {};
      target.external_urls = { ...ext, official: f.diff.google_website };
      urlAdded++;
    }
    if (driftFlag && typeof f.diff.google_lat === "number" && typeof f.diff.google_lng === "number") {
      target.lat = f.diff.google_lat;
      target.lon = f.diff.google_lng;
      latLonUpgraded++;
    }
    if (hasLatLonMissing && typeof f.diff.google_lat === "number" && typeof f.diff.google_lng === "number") {
      target.lat = f.diff.google_lat;
      target.lon = f.diff.google_lng;
      latLonAdded++;
    }
  }

  console.log(
    `[apply] enrichment 候補: url=${urlAdded} latLonUpgrade=${latLonUpgraded} latLonAdd=${latLonAdded} skipped=${skipped} ${dry ? "(dry-run, 未書込)" : ""}`,
  );

  if (!dry) {
    writeAll(all);
    console.log(`[apply] 書込完了: ${ENTRIES_JSON} + by-pref/`);
  }
}

main();

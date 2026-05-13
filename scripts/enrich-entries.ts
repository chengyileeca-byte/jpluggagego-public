// Phase 2: 用 Wikipedia 日本語 API + OpenStreetMap Nominatim
// 對 entries 補:
//   - external_urls.wikipedia_ja (確認真實性)
//   - external_urls.osm (地理編碼來源)
//   - lat/lon (Nominatim 真實位置,如果原本是市中心 fallback)
// $0 cost, rate-limited 1 req/sec

import { readFileSync, writeFileSync } from "fs";
import { setTimeout as sleep } from "timers/promises";

interface SeedRow {
  id?: number;
  slug: string;
  title_ja: string;
  title_zh: string;
  prefecture_ja: string;
  municipality_ja: string | null;
  lat: number;
  lon: number;
  external_urls: Record<string, string>;
  tags?: string[];
}

const UA = "jpluggagego-enrich/1.0 (https://github.com/chengyileeca-byte/jpluggagego)";

async function wikipediaJa(title: string) {
  const url = `https://ja.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`;
  try {
    const r = await fetch(url, { headers: { "User-Agent": UA, "Accept": "application/json" } });
    if (!r.ok) return null;
    const j: any = await r.json();
    if (j.type === "disambiguation" || j.type === "https://mediawiki.org/wiki/HyperSwitch/errors/not_found") return null;
    return {
      url: j.content_urls?.desktop?.page ?? null,
      lat: j.coordinates?.lat ?? null,
      lon: j.coordinates?.lon ?? null,
      extract: j.extract?.slice(0, 200) ?? null,
    };
  } catch {
    return null;
  }
}

async function nominatim(title: string, prefecture: string, municipality: string | null) {
  const parts = [title, municipality, prefecture, "Japan"].filter(Boolean);
  const q = parts.join(", ");
  const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(q)}&format=json&limit=1&countrycodes=jp`;
  try {
    const r = await fetch(url, { headers: { "User-Agent": UA } });
    if (!r.ok) return null;
    const j: any[] = await r.json();
    if (!j.length) return null;
    return {
      lat: parseFloat(j[0].lat),
      lon: parseFloat(j[0].lon),
      osm: `https://www.openstreetmap.org/${j[0].osm_type}/${j[0].osm_id}`,
      display: j[0].display_name,
    };
  } catch {
    return null;
  }
}

async function enrichRow(row: SeedRow): Promise<{ changed: boolean; report: string }> {
  const reports: string[] = [];
  let changed = false;

  // Try Wikipedia (only if no wikipedia URL yet). No rate limit needed for wiki summary API.
  if (!row.external_urls.wikipedia_ja && !row.external_urls.wikipedia) {
    const wiki = await wikipediaJa(row.title_ja);
    if (wiki?.url) {
      row.external_urls.wikipedia_ja = wiki.url;
      changed = true;
      reports.push("wiki");
    }
    await sleep(150); // gentle pause to Wikipedia
  }

  // Try Nominatim (always, may correct lat/lon)
  const osm = await nominatim(row.title_ja, row.prefecture_ja, row.municipality_ja);
  if (osm) {
    // Sanity check: must be in Japan bounding box (lat 24-46, lon 122-146)
    const inJapan = osm.lat >= 24 && osm.lat <= 46 && osm.lon >= 122 && osm.lon <= 146;
    if (inJapan) {
      if (!row.external_urls.osm) {
        row.external_urls.osm = osm.osm;
        changed = true;
        reports.push("osm");
      }
      // For rows with existing coord: only override if distance > 200m
      // For rows without coord (lat=0): always accept
      if (!row.lat || row.lat === 0) {
        row.lat = osm.lat;
        row.lon = osm.lon;
        changed = true;
        reports.push("coord(new)");
      } else {
        const distMeters = haversine(row.lat, row.lon, osm.lat, osm.lon);
        if (distMeters > 200 && distMeters < 200000) {
          // Within prefecture-scale range (max 200km)
          row.lat = osm.lat;
          row.lon = osm.lon;
          changed = true;
          reports.push(`coord(${Math.round(distMeters)}m)`);
        }
      }
    } else {
      reports.push("osm-outside-jp");
    }
  }
  await sleep(1100); // Nominatim hard rate limit: 1 req/sec

  return { changed, report: reports.join("+") || "no-change" };
}

function haversine(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371000;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

// ── Main ──
// usage: enrich-entries.ts [pref|all] [limit] [--skip-touched]
//   --skip-touched: skip rows that already have osm URL (resume mode)
async function main() {
  const ARG_PREF = process.argv[2];
  const ARG_LIMIT = process.argv[3] && !process.argv[3].startsWith("--") ? parseInt(process.argv[3]) : Infinity;
  const SKIP_TOUCHED = process.argv.includes("--skip-touched");

  const MAIN = "public/data/japan_entries.json";
  const data: SeedRow[] = JSON.parse(readFileSync(MAIN, "utf8"));

  let targets: SeedRow[];
  if (ARG_PREF && ARG_PREF !== "all") {
    targets = data.filter((r) => r.prefecture_ja === ARG_PREF);
    console.log(`Filtered to ${ARG_PREF}: ${targets.length} entries`);
  } else {
    targets = data;
    console.log(`All entries: ${targets.length}`);
  }

  if (SKIP_TOUCHED) {
    const beforeSkip = targets.length;
    targets = targets.filter((r) => !r.external_urls.osm);
    console.log(`Skip-touched: ${beforeSkip} → ${targets.length}`);
  }
  if (process.argv.includes("--no-coord-only")) {
    const beforeFilter = targets.length;
    targets = targets.filter((r) => !r.lat || r.lat === 0);
    console.log(`No-coord-only: ${beforeFilter} → ${targets.length}`);
  }

  targets = targets.slice(0, ARG_LIMIT);
  console.log(`Processing: ${targets.length} entries`);

  let processed = 0;
  let changes = 0;
  const startTime = Date.now();

  for (const row of targets) {
    processed++;
    const { changed, report } = await enrichRow(row);
    if (changed) changes++;
    if (processed % 10 === 0 || changed) {
      console.log(`[${processed}/${targets.length}] ${row.slug} ${report}`);
    }

    // Save every 50 entries
    if (processed % 50 === 0) {
      writeFileSync(MAIN, JSON.stringify(data, null, 2));
      console.log(`  ↳ checkpoint (${changes} changes, ${((Date.now() - startTime) / 1000).toFixed(0)}s elapsed)`);
    }
  }

  writeFileSync(MAIN, JSON.stringify(data, null, 2));
  const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
  console.log(`\nDone. Processed=${processed}, Changed=${changes}, Elapsed=${elapsed}s`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

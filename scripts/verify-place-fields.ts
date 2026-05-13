// 一次性 verification — google_place_id を持つ entry に対し
// Place Details(geometry + website + opening_hours + business_status)を取得し、
// seed が書いた lat/lon・external_urls.official 等と diff、疑わしい差分を report する。
//
// 出力: public/data/verification/place-fields-report.json
//   - lat/lon 1km+ 乖離(seed が市中心 lat/lon を置いてる時、実 place が他地点)
//   - external_urls.official が空 + Google website あり → seed に追加候補
//   - external_urls.official ≠ Google website ホスト → 配対誤り or seed 古い URL
//   - business_status が CLOSED_PERMANENTLY だが entry がまだ feature_rank > 0 → 警告
//   - opening_hours.weekday_text を生で保存(seed の closed_days 検証材料)
//
// Usage:
//   npm run verify:place-fields:dry        # 印 query、不打 API、不寫
//   npm run verify:place-fields:dry -- 50  # 前 50 筆実打 API、報告へ書く
//   npm run verify:place-fields            # 全 entries 実打 API
//
// 計費:Place Details(Basic + Contact)~$20/1000。5239 entries ≈ $105、
// $200 free credit 内。

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
import { getPlaceDetailsFull, sleep } from "../src/lib/google-places";

const DATA_DIR = "public/data";
const ENTRIES_JSON = join(DATA_DIR, "japan_entries.json");
const BY_PREF_DIR = join(DATA_DIR, "by-pref");
const REPORT_DIR = join(DATA_DIR, "verification");
const REPORT_JSON = join(REPORT_DIR, "place-fields-report.json");

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
    if (existsSync(f)) {
      const arr = JSON.parse(readFileSync(f, "utf8")) as Record<
        string,
        unknown
      >[];
      all.push(...arr);
    }
  }
  return all;
}

// Haversine distance (meters)
function distanceMeters(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
): number {
  const R = 6371000;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(a));
}

function hostOf(u: string | null | undefined): string | null {
  if (!u) return null;
  try {
    return new URL(u).host.replace(/^www\./, "").toLowerCase();
  } catch {
    return null;
  }
}

interface Flag {
  slug: string;
  prefecture_ja: string;
  title_ja: string | null;
  title_zh: string;
  google_place_id: string;
  google_name?: string;
  google_address?: string;
  flags: string[];
  diff: {
    seed_lat?: number | null;
    seed_lon?: number | null;
    google_lat?: number;
    google_lng?: number;
    distance_m?: number;
    seed_official?: string | null;
    google_website?: string | null;
    google_maps_url?: string;
    seed_closed_days?: string[];
    google_weekday_text?: string[];
    business_status?: string;
    feature_rank?: number;
  };
}

async function main() {
  const dry = process.argv.includes("--dry");
  const limitArg = process.argv.find((a) => /^\d+$/.test(a));
  const limit = limitArg ? Number(limitArg) : null;

  const allEntries = readAllEntries();
  const targets = allEntries.filter((e) => e.google_place_id);
  const sliced = limit ? targets.slice(0, limit) : targets;

  console.log(
    `[verify] ${sliced.length} 筆 verification 開始 ${dry && !limit ? "(dry-run, 只印 query)" : ""}`,
  );

  // distance threshold:1km。市中心 lat/lon と実 place が 1km 以上ずれるなら要注意
  const DIST_THRESHOLD_M = 1000;

  const flagged: Flag[] = [];
  const noFlagOk: string[] = []; // slug only
  let processed = 0;
  let zero = 0;
  let failed = 0;
  let written = 0;
  const FLUSH_EVERY = 50;

  const flushReport = () => {
    if (dry && !limit) return;
    mkdirSync(REPORT_DIR, { recursive: true });
    const payload = {
      generated_at: new Date().toISOString(),
      total_processed: processed,
      total_flagged: flagged.length,
      total_zero_results: zero,
      total_failed: failed,
      total_clean: noFlagOk.length,
      threshold_distance_m: DIST_THRESHOLD_M,
      flagged,
    };
    writeFileSync(REPORT_JSON, JSON.stringify(payload, null, 2) + "\n");
    written = flagged.length;
  };

  for (const entry of sliced) {
    const slug = entry.slug as string;
    const placeId = entry.google_place_id as string;
    const seedLat = entry.lat as number | null | undefined;
    const seedLon = entry.lon as number | null | undefined;
    const externalUrls = (entry.external_urls as Record<string, string>) ?? {};
    const seedOfficial = externalUrls.official ?? null;
    const seedClosedDays = (entry.closed_days as string[]) ?? [];
    const featureRank = (entry.feature_rank as number) ?? 0;

    const query = `${entry.title_ja || entry.title_zh} ${entry.municipality_ja || entry.prefecture_ja}`;

    if (dry && !limit) {
      console.log(`  ${slug.padEnd(50)} ← ${placeId} (${query})`);
      continue;
    }

    try {
      const details = await getPlaceDetailsFull(placeId);
      processed++;

      if (details === "NOT_FOUND" || !details) {
        zero++;
        flagged.push({
          slug,
          prefecture_ja: entry.prefecture_ja as string,
          title_ja: (entry.title_ja as string | null) ?? null,
          title_zh: entry.title_zh as string,
          google_place_id: placeId,
          flags: ["place_id_not_found"],
          diff: {},
        });
        continue;
      }

      const flags: string[] = [];
      const diff: Flag["diff"] = {
        seed_lat: seedLat ?? null,
        seed_lon: seedLon ?? null,
        seed_official: seedOfficial,
        google_website: details.website ?? null,
        google_maps_url: details.url,
        business_status: details.business_status,
        feature_rank: featureRank,
      };

      const gLat = details.geometry?.location.lat;
      const gLng = details.geometry?.location.lng;
      diff.google_lat = gLat;
      diff.google_lng = gLng;

      if (typeof seedLat === "number" && typeof seedLon === "number" && typeof gLat === "number" && typeof gLng === "number") {
        const dist = distanceMeters(seedLat, seedLon, gLat, gLng);
        diff.distance_m = Math.round(dist);
        if (dist > DIST_THRESHOLD_M) {
          flags.push(`lat_lon_drift_${Math.round(dist)}m`);
        }
      } else if (typeof gLat === "number" && (seedLat == null || seedLon == null)) {
        flags.push("seed_lat_lon_missing");
      }

      const seedHost = hostOf(seedOfficial);
      const gHost = hostOf(details.website ?? null);
      if (!seedHost && gHost) {
        flags.push("seed_official_url_missing");
      } else if (seedHost && gHost && seedHost !== gHost) {
        flags.push(`url_host_mismatch:${seedHost}_vs_${gHost}`);
      }

      if (details.business_status === "CLOSED_PERMANENTLY" && featureRank > 0) {
        flags.push("closed_permanently_but_feature_rank_positive");
      }

      if (details.opening_hours?.weekday_text) {
        diff.google_weekday_text = details.opening_hours.weekday_text;
        if (seedClosedDays.length > 0) {
          diff.seed_closed_days = seedClosedDays;
        }
      }

      if (flags.length > 0) {
        flagged.push({
          slug,
          prefecture_ja: entry.prefecture_ja as string,
          title_ja: (entry.title_ja as string | null) ?? null,
          title_zh: entry.title_zh as string,
          google_place_id: placeId,
          google_name: details.name,
          google_address: details.formatted_address,
          flags,
          diff,
        });
      } else {
        noFlagOk.push(slug);
      }

      if (processed % FLUSH_EVERY === 0) flushReport();
    } catch (err) {
      console.error(
        `  FAIL  ${slug.padEnd(50)} (${(err as Error).message})`,
      );
      failed++;
    }

    await sleep(200);
  }

  flushReport();

  console.log(
    `\n[verify] 結束:processed=${processed} flagged=${flagged.length} clean=${noFlagOk.length} zero=${zero} fail=${failed}`,
  );
  if (!dry || limit) {
    console.log(`[verify] レポート → ${REPORT_JSON}`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

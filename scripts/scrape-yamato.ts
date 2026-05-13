// Scrape Yamato (黒猫宅急便) cross-prefecture fares from their public
// simulator JSON endpoint.
//
//   https://www.kuronekoyamato.co.jp/ytc/search/payment/simulation_files/json/TK.json
//
// The JSON is indexed by region-pair × size. We expand it to 47 × 47 × 8
// prefecture-level rows so the product can query "Tokyo → Osaka, 120 size".
//
// Usage:
//   npm run scrape:yamato:dry     # print stats, no DB write
//   npm run scrape:yamato         # full upsert to Supabase

import { config as loadEnv } from "dotenv";
loadEnv({ path: ".env.local" });

import { politeFetch } from "./lib/polite-fetch";
import { PREFECTURES, REGIONS, type Region } from "./lib/japan-prefectures";
import { createAdminClient } from "../src/lib/supabase/admin";

const TK_JSON_URL =
  "https://www.kuronekoyamato.co.jp/ytc/search/payment/simulation_files/json/TK.json?v=2";

const SIZE_CODES = ["60", "80", "100", "120", "140", "160", "180", "200"] as const;
type SizeCode = (typeof SIZE_CODES)[number];

type RegionFares = Record<SizeCode, number>;
type RegionMatrix = Record<Region, Record<Region, RegionFares>>;

// 同一都道府県内運賃 (cash). TK.json's region-diagonal encodes the
// cross-prefecture-within-region rate, not the same-prefecture rate — so
// 東京→東京 must override matrix["関東"]["関東"] (which is the 東京→神奈川 rate).
// Source: yamato 料金検索 modal (pricelist HTML), ytc/customer/send/services/takkyubin/
const SAME_PREF_FARES: RegionFares = {
  "60": 790,
  "80": 1090,
  "100": 1410,
  "120": 1730,
  "140": 2090,
  "160": 2410,
  "180": 3030,
  "200": 3690,
};

interface FareRow {
  from_pref: string;
  to_pref: string;
  size_code: string;
  price_jpy: number;
}

async function fetchTK(): Promise<RegionMatrix> {
  console.log(`[yamato] GET ${TK_JSON_URL}`);
  const res = await politeFetch(TK_JSON_URL, { respectJstPeak: false });
  if (!res.ok) throw new Error(`TK.json fetch failed: ${res.status}`);
  const text = await res.text();
  // File has BOM → strip before parsing.
  const json = JSON.parse(text.replace(/^\uFEFF/, "")) as RegionMatrix;

  const missing: string[] = [];
  for (const from of REGIONS) {
    if (!json[from]) {
      missing.push(from);
      continue;
    }
    for (const to of REGIONS) {
      if (!json[from][to]) missing.push(`${from}→${to}`);
    }
  }
  if (missing.length)
    console.warn(`[yamato] missing region cells: ${missing.join(", ")}`);

  return json;
}

function expandToPrefectureRows(matrix: RegionMatrix): FareRow[] {
  const rows: FareRow[] = [];
  for (const fromPref of PREFECTURES) {
    for (const toPref of PREFECTURES) {
      const samePref = fromPref.code === toPref.code;
      const cell = samePref
        ? SAME_PREF_FARES
        : matrix[fromPref.region]?.[toPref.region];
      if (!cell) continue;
      for (const size of SIZE_CODES) {
        const price = cell[size];
        if (typeof price !== "number") continue;
        rows.push({
          from_pref: fromPref.name,
          to_pref: toPref.name,
          size_code: size,
          price_jpy: price,
        });
      }
    }
  }
  return rows;
}

async function main() {
  const dryRun = process.argv.includes("--dry-run");

  const matrix = await fetchTK();
  const rows = expandToPrefectureRows(matrix);

  console.log(`[yamato] Generated ${rows.length} (from_pref, to_pref, size) rows`);
  console.log(`[yamato] Expected: 47 × 47 × 8 = 17,672; got ${rows.length}`);

  // Quick sanity samples
  const samples = [
    ["東京都", "大阪府"],
    ["東京都", "北海道"],
    ["沖縄県", "北海道"],
    ["東京都", "東京都"], // same-pref override → 60:¥790
    ["大阪府", "大阪府"], // same-pref override → 60:¥790
    ["東京都", "神奈川県"], // intra-関東 cross-pref → TK.json 関東→関東
  ];
  console.log(`\n[yamato] Samples:`);
  for (const [from, to] of samples) {
    const subset = rows.filter((r) => r.from_pref === from && r.to_pref === to);
    const compact = subset
      .map((r) => `${r.size_code}:¥${r.price_jpy}`)
      .join("  ");
    console.log(`  ${from} → ${to}   ${compact}`);
  }

  if (dryRun) {
    console.log(`\n[yamato] DRY RUN — no DB writes.`);
    return;
  }

  const supabase = createAdminClient();
  // Single timestamp for this run — feeds both yamato_fares.scraped_at
  // (so UI "最終更新" shows the real re-scrape time, not the original INSERT)
  // and fare_history.captured_at (append-only snapshot time series).
  const capturedAt = new Date().toISOString();
  const CHUNK = 1000;
  let written = 0;
  for (let i = 0; i < rows.length; i += CHUNK) {
    const batch = rows
      .slice(i, i + CHUNK)
      .map((r) => ({ ...r, scraped_at: capturedAt }));
    const { error } = await supabase.from("yamato_fares").upsert(batch, {
      onConflict: "from_pref,to_pref,size_code",
    });
    if (error) {
      console.error("[yamato] upsert error:", error);
      process.exit(1);
    }
    written += batch.length;
    process.stdout.write(`\r[yamato] upsert progress: ${written}/${rows.length}`);
  }
  process.stdout.write("\n");
  console.log(`[yamato] Done — ${written} fare rows upserted.`);

  // Append-only snapshot to fare_history (same capturedAt as above).
  const historyRows = rows.map((r) => ({
    carrier: "yamato" as const,
    ...r,
    captured_at: capturedAt,
  }));
  let historyWritten = 0;
  for (let i = 0; i < historyRows.length; i += CHUNK) {
    const batch = historyRows.slice(i, i + CHUNK);
    const { error } = await supabase.from("fare_history").insert(batch);
    if (error) {
      console.error("[yamato] fare_history insert error:", error);
      process.exit(1);
    }
    historyWritten += batch.length;
    process.stdout.write(
      `\r[yamato] fare_history progress: ${historyWritten}/${historyRows.length}`,
    );
  }
  process.stdout.write("\n");
  console.log(
    `[yamato] fare_history snapshot — ${historyWritten} rows @ ${capturedAt}`,
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

// scrape-tenki-sakura — tenki.jp 都道府縣級櫻花前線 daily sync (Stage C MVP)
//
// 流程:
//   1. GET https://tenki.jp/sakura/ 取都道府縣索引(49 筆:43 縣 + 北海道 4 地方 + 2 例外)
//   2. GET 每個都道府縣頁,解析 <table class="expectation-table"> 的 rows
//      - 每 row = 該縣一個觀測點(市 or 市:公園),含開花/満開予想日
//      - cell 帶 class="sakura-bloom-color" 表示已觀測(同時寫到 observed_*)
//   3. UPSERT 到 public.japan_sakura_forecast (on spot_id)
//
// spot_id 格式: <regionCode>_<prefCode>_<spotName>,例 "3_14_さいたま市:大宮公園"
//
// 本 script 依賴 tenki.jp 的 SSR HTML 結構。若 expectation-table 不存在,
// 該縣回 0 筆並印 WARN。若全國 < 80 筆則會觸發整體 warn(正常約 150 筆)。
//
// 使用 scripts/lib/polite-fetch.ts 的 politeFetch:內建 3-5s jitter + 429 back-off。
// 49 縣 × ~4s ≈ 3-5 分鐘。建議 JST 凌晨跑。
//
// Usage:
//   npm run scrape:tenki-probe           # 先 probe 幾個頁面找 selector
//   npm run scrape:sakura:dry            # 只 parse 不寫 DB(可跑多次驗證)
//   npm run scrape:sakura                # 正式 UPSERT
//   npm run scrape:sakura -- --prefecture=北海道  # 單縣
//   npm run scrape:sakura -- --limit=5            # 只跑前 5 個縣(testing)

import { config as loadEnv } from "dotenv";
loadEnv({ path: ".env.local" });

import { parse } from "node-html-parser";
import { politeFetch } from "./lib/polite-fetch";
import { createAdminClient } from "../src/lib/supabase/admin";

type Region =
  | "hokkaido"
  | "tohoku"
  | "kanto"
  | "chubu"
  | "kansai"
  | "chugoku"
  | "shikoku"
  | "kyushu"
  | "okinawa";

// tenki.jp URL 第一段數字 (region code) → 我們的 region enum
// tenki.jp 把中部細分為 4 北陸信越 / 5 東海,我們 schema 只有 chubu,故兩者都對到 chubu。
// 沖繩沒有桜前線頁(當地是寒緋桜,時序不同),所以 9 是 kyushu 不是 okinawa。
const REGION_BY_CODE: Record<string, Region> = {
  "1": "hokkaido", // 北海道(道北/道東/道央/道南)
  "2": "tohoku",   // 東北
  "3": "kanto",    // 関東甲信
  "4": "chubu",    // 北陸信越(富山/石川/福井/新潟/長野)
  "5": "chubu",    // 東海(愛知/岐阜/静岡/三重)
  "6": "kansai",   // 近畿
  "7": "chugoku",  // 中国
  "8": "shikoku",  // 四国
  "9": "kyushu",   // 九州
};

const INDEX_URL = "https://tenki.jp/sakura/";

interface PrefectureIndexEntry {
  url: string;
  prefecture_ja: string;
  region: Region;
}

interface SpotRow {
  spot_id: string;
  spot_name_ja: string;
  prefecture_ja: string;
  region: Region;
  forecast_first_bloom: string | null; // YYYY-MM-DD
  forecast_full_bloom: string | null;
  observed_first_bloom: string | null;
  observed_full_bloom: string | null;
  source_url: string;
}

// 把「3月25日」或「03/25」之類的日文日期正規化為 YYYY-MM-DD(使用當前年度)
function parseJpDate(text: string, year: number): string | null {
  if (!text) return null;
  const trimmed = text.replace(/\s+/g, "").replace(/[()（）]/g, "");
  // 3月25日
  let m = /^(\d{1,2})月(\d{1,2})日/.exec(trimmed);
  if (m) {
    const mm = m[1].padStart(2, "0");
    const dd = m[2].padStart(2, "0");
    return `${year}-${mm}-${dd}`;
  }
  // 03/25
  m = /^(\d{1,2})\/(\d{1,2})/.exec(trimmed);
  if (m) {
    const mm = m[1].padStart(2, "0");
    const dd = m[2].padStart(2, "0");
    return `${year}-${mm}-${dd}`;
  }
  return null;
}

async function fetchIndex(): Promise<PrefectureIndexEntry[]> {
  const res = await politeFetch(INDEX_URL);
  if (!res.ok) {
    throw new Error(`index_fetch_failed: ${res.status}`);
  }
  const html = await res.text();
  const root = parse(html);

  // 尋找所有 /sakura/<regionCode>/<prefCode>/ 的連結
  const anchors = root.querySelectorAll("a");
  const seen = new Set<string>();
  const out: PrefectureIndexEntry[] = [];
  for (const a of anchors) {
    const href = a.getAttribute("href") ?? "";
    const m = /^\/sakura\/(\d)\/(\d+)\/$/.exec(href);
    if (!m) continue;
    const regionCode = m[1];
    const region = REGION_BY_CODE[regionCode];
    if (!region) continue;
    const url = new URL(href, INDEX_URL).toString();
    if (seen.has(url)) continue;
    seen.add(url);
    const name = a.text.trim();
    // tenki.jp 索引頁 anchor text 通常就是「北海道」「青森県」等
    if (!name || name.length > 10) continue;
    out.push({
      url,
      prefecture_ja: name,
      region,
    });
  }
  return out;
}

async function fetchPrefectureSpots(
  entry: PrefectureIndexEntry,
  year: number,
): Promise<SpotRow[]> {
  const res = await politeFetch(entry.url);
  if (!res.ok) {
    console.warn(`[sakura] ${entry.prefecture_ja} fetch failed: ${res.status}`);
    return [];
  }
  const html = await res.text();
  const root = parse(html);

  // tenki.jp 都道府縣頁的開花/満開予想唯一權威表格是 <table class="expectation-table">
  // 結構:
  //   <tr><th>都道府県</th><th>地点</th><th>開花予想日</th><th>満開予想日</th></tr>
  //   <tr><td>道北</td><td>稚内市</td><td>05/04</td><td>05/06</td></tr>
  //   <tr><td>埼玉県</td><td>さいたま市:大宮公園</td>
  //       <td class="sakura-bloom-color">03/19</td><td>---</td></tr>
  //
  // 規則:
  //   - 「地点」可能是純市名(稚内市)或 市:景點(さいたま市:大宮公園)
  //   - 日期格式 MM/DD,"---" 表示尚未預測
  //   - class="sakura-bloom-color" 的 cell 表示「已觀測」(官方宣言),
  //     同一 cell 值同時寫到 forecast_* 與 observed_* 欄位
  //
  // 另有 <ul class="sakura-entries"> お花見名所列表(400+ 筆)但只有見頃範圍文字,
  // 沒有精確開花日,故 MVP 不抓。若未來要做人氣景點,可補第二個 scraper 打 detail 頁。

  const table = root.querySelector("table.expectation-table");
  if (!table) return [];

  // 從 entry.url 反推 regionCode / prefCode,用於生成 spot_id
  const urlMatch = /\/sakura\/(\d)\/(\d+)\//.exec(entry.url);
  if (!urlMatch) return [];
  const regionCode = urlMatch[1];
  const prefCode = urlMatch[2];

  const rows = table.querySelectorAll("tr");
  const out: SpotRow[] = [];
  for (const row of rows) {
    const tds = row.querySelectorAll("td");
    if (tds.length < 4) continue; // header 行是 <th>,略過

    const prefName = tds[0].text.trim();
    const spotName = tds[1].text.trim();
    if (!prefName || !spotName) continue;

    const firstCell = tds[2];
    const fullCell = tds[3];
    const forecast_first = parseJpDate(firstCell.text, year);
    const forecast_full = parseJpDate(fullCell.text, year);

    const firstObserved = firstCell.classList.contains("sakura-bloom-color");
    const fullObserved = fullCell.classList.contains("sakura-bloom-color");

    const spot_id = `${regionCode}_${prefCode}_${spotName}`;

    out.push({
      spot_id,
      spot_name_ja: spotName,
      prefecture_ja: prefName,
      region: entry.region,
      forecast_first_bloom: forecast_first,
      forecast_full_bloom: forecast_full,
      observed_first_bloom: firstObserved ? forecast_first : null,
      observed_full_bloom: fullObserved ? forecast_full : null,
      source_url: entry.url,
    });
  }

  return out;
}

async function upsertSpots(rows: SpotRow[]): Promise<void> {
  if (rows.length === 0) return;
  const sb = createAdminClient();
  // Supabase 單次 upsert 上限很寬鬆(~1000 rows),但我們一縣最多 ~20 筆,直接全縣批次即可。
  const { error } = await sb
    .from("japan_sakura_forecast")
    .upsert(rows, { onConflict: "spot_id" });
  if (error) throw new Error(`upsert_failed: ${error.message}`);
}

function parseArgs(argv: string[]): {
  dryRun: boolean;
  prefecture: string | null;
  limit: number | null;
} {
  let dryRun = false;
  let prefecture: string | null = null;
  let limit: number | null = null;
  for (const arg of argv) {
    if (arg === "--dry-run" || arg === "--dry") dryRun = true;
    else if (arg.startsWith("--prefecture=")) {
      prefecture = arg.slice("--prefecture=".length);
    } else if (arg.startsWith("--limit=")) {
      const n = Number(arg.slice("--limit=".length));
      if (Number.isInteger(n) && n > 0) limit = n;
    }
  }
  return { dryRun, prefecture, limit };
}

async function main() {
  const { dryRun, prefecture, limit } = parseArgs(process.argv.slice(2));
  console.log(
    `[sakura] mode=${dryRun ? "DRY-RUN" : "WRITE"} prefecture=${prefecture ?? "all"} limit=${limit ?? "all"}`,
  );

  const year = new Date().getFullYear();

  let index = await fetchIndex();
  console.log(`[sakura] 索引頁取得 ${index.length} 個都道府縣連結`);

  if (index.length === 0) {
    throw new Error(
      "索引頁 0 筆 — 可能 tenki.jp HTML 結構改變,請先跑 scrape:tenki-probe 人工檢查。",
    );
  }

  if (prefecture) {
    index = index.filter((e) => e.prefecture_ja === prefecture);
    if (index.length === 0) {
      throw new Error(`找不到符合 --prefecture=${prefecture} 的項目`);
    }
  }
  if (limit !== null) index = index.slice(0, limit);

  let totalSpots = 0;
  let totalWrote = 0;
  let prefFail = 0;

  for (const entry of index) {
    console.log(`[sakura] ${entry.prefecture_ja}(${entry.region}) ${entry.url}`);
    let spots: SpotRow[] = [];
    try {
      spots = await fetchPrefectureSpots(entry, year);
    } catch (e) {
      console.error(`       ✗ parse error: ${(e as Error).message}`);
      prefFail += 1;
      continue;
    }
    console.log(`       → 解析 ${spots.length} 個觀測點`);
    if (spots.length === 0) {
      console.warn(
        `       ⚠ ${entry.prefecture_ja} 0 筆 — 可能 HTML 結構變化或該縣無觀測點`,
      );
    }
    totalSpots += spots.length;
    if (!dryRun && spots.length > 0) {
      try {
        await upsertSpots(spots);
        totalWrote += spots.length;
      } catch (e) {
        console.error(`       ✗ upsert error: ${(e as Error).message}`);
        prefFail += 1;
      }
    }
  }

  console.log(
    `\n[sakura] 完成: prefectures=${index.length - prefFail}/${index.length} spots=${totalSpots} wrote=${totalWrote}${dryRun ? " (dry-run)" : ""}`,
  );
  if (prefFail > 0) process.exit(1);
  if (!dryRun && totalWrote < 50) {
    // 全國都道府縣級開花觀測點實測 ~68 筆(多數縣 1 筆,部分縣 2-3 筆,北海道分 4 地方)
    console.warn(
      `[sakura] ⚠ 只寫入 ${totalWrote} 筆,預期 60+。考慮檢查失敗的縣。`,
    );
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

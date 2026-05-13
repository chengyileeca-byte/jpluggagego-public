// 郵便局 国際料金(第 1 地帯 = 台湾・韓国・中国)爬蟲
//
// Source pages:
//   https://www.post.japanpost.jp/int/charge/list/ems1.html       EMS
//   https://www.post.japanpost.jp/int/charge/list/parcel1.html    国際小包 × 3 服務(航空 / SAL / 船便)
//
// 預計產出:
//   EMS:           ~41 筆 weight 階
//   parcel_air:    ~30 筆
//   parcel_sal:    ~30 筆
//   parcel_surface:~30 筆
//   合計 ~131 筆 × 國家數(初期只台灣 = 131 筆)
//
// 之後擴其他 Zone 1 國家(HK/KR/CN)時,改 CountriesOfZone1 常數加進去即可。
//
// Usage:
//   npm run scrape:yuu-intl:dry
//   npm run scrape:yuu-intl

import { config as loadEnv } from "dotenv";
loadEnv({ path: ".env.local" });

import { parse, type HTMLElement } from "node-html-parser";
import { politeFetch, sleep, jitteredDelayMs } from "./lib/polite-fetch";
import { createAdminClient } from "../src/lib/supabase/admin";

const EMS_URL = "https://www.post.japanpost.jp/int/charge/list/ems1.html";
const PARCEL_URL = "https://www.post.japanpost.jp/int/charge/list/parcel1.html";

// Zone 1 在日本郵便官方表中即中国・韓国・台湾。Hong Kong 屬 Zone 2。
const ZONE_1_COUNTRIES = ["TW", "KR", "CN"] as const;

type ServiceType =
  | "ems"
  | "parcel_air"
  | "parcel_sal"
  | "parcel_surface";

interface FareRow {
  service_type: ServiceType;
  zone: string;
  country_iso2: string;
  weight_grams: number;
  price_jpy: number;
  max_weight_kg: number;
}

// ------------------------------------------------------------
// 解析工具:把 "500gまで" / "1.0kgまで" / "30.0kg" 轉成公克
// Japan Post 料金表實際寫 "500gまで" / "1.0kgまで",「まで」= "以下"
// ------------------------------------------------------------
function parseWeightToGrams(raw: string): number | null {
  const cleaned = raw.replace(/\s+/g, "").replace(/,/g, "").replace(/まで$/, "");
  const kg = /^(\d+(?:\.\d+)?)kg$/i.exec(cleaned);
  if (kg) return Math.round(parseFloat(kg[1]) * 1000);
  const g = /^(\d+(?:\.\d+)?)g$/i.exec(cleaned);
  if (g) return Math.round(parseFloat(g[1]));
  return null;
}

// "22,600" / "¥22,600" → 22600
function parsePriceToJpy(raw: string): number | null {
  const cleaned = raw.replace(/[^\d]/g, "");
  if (!cleaned) return null;
  const n = parseInt(cleaned, 10);
  return Number.isFinite(n) && n > 0 ? n : null;
}

// ------------------------------------------------------------
// 從一張 <table> 抽出所有 (重量, 料金) 配對
// ------------------------------------------------------------
function extractFaresFromTable(
  tbl: HTMLElement,
): Array<{ grams: number; priceJpy: number }> {
  const rows: Array<{ grams: number; priceJpy: number }> = [];
  const trs = tbl.querySelectorAll("tr");
  for (const tr of trs) {
    const cells = tr.querySelectorAll("td, th");
    // 標準表頭/資料列至少 2 欄;若超過,第一欄通常是重量、最後一欄通常是料金。
    if (cells.length < 2) continue;
    const weightText = cells[0].text.trim();
    const priceText = cells[cells.length - 1].text.trim();
    const grams = parseWeightToGrams(weightText);
    const priceJpy = parsePriceToJpy(priceText);
    if (grams === null || priceJpy === null) continue;
    if (grams <= 0 || priceJpy < 100) continue; // sanity
    rows.push({ grams, priceJpy });
  }
  return rows;
}

// ------------------------------------------------------------
// 取得 EMS 料金(單表單服務)
// ------------------------------------------------------------
async function fetchEMS(): Promise<Array<{ grams: number; priceJpy: number }>> {
  console.log(`[yuu-intl] GET ${EMS_URL}`);
  const res = await politeFetch(EMS_URL, { respectJstPeak: false });
  if (!res.ok) throw new Error(`${EMS_URL} → HTTP ${res.status}`);
  const html = await res.text();
  const root = parse(html);

  // 找所有 table,取料金 row 數最多的那張(料金表 30+ 行,其他 table 通常 < 5 行)
  const tables = root.querySelectorAll("table");
  let best: { count: number; rows: Array<{ grams: number; priceJpy: number }> } = {
    count: 0,
    rows: [],
  };
  for (const tbl of tables) {
    const rows = extractFaresFromTable(tbl);
    if (rows.length > best.count) best = { count: rows.length, rows };
  }
  if (best.count < 20) {
    throw new Error(
      `[yuu-intl] EMS page 解析異常:最大 table 只取到 ${best.count} 筆料金(期望 ≥ 20)`,
    );
  }
  return best.rows;
}

// ------------------------------------------------------------
// 取得 国際小包 3 服務料金
// 策略:掃描 HTML 中每個 data table 前最近的 <h2>...</h2> 文字來辨識
// 服務類別(航空便 / 船便 / エコノミー航空（SAL）便)。
// 官方頁面順序為 航空 → 船便 → SAL,但此作法對順序不敏感。
// ------------------------------------------------------------
async function fetchParcel(): Promise<{
  air: Array<{ grams: number; priceJpy: number }>;
  sal: Array<{ grams: number; priceJpy: number }>;
  surface: Array<{ grams: number; priceJpy: number }>;
}> {
  console.log(`[yuu-intl] GET ${PARCEL_URL}`);
  const res = await politeFetch(PARCEL_URL, { respectJstPeak: false });
  if (!res.ok) throw new Error(`${PARCEL_URL} → HTTP ${res.status}`);
  const html = await res.text();

  // 切段:按 <h2> 出現位置把 HTML 切成「每個 section = h2 + 後接的 data table」
  // regex:抓 h2 的文字 + 直到下個 h2 或文件結尾的區塊
  const sectionRe = /<h2[^>]*>([\s\S]*?)<\/h2>([\s\S]*?)(?=<h2[^>]*>|$)/g;
  const out = {
    air: [] as Array<{ grams: number; priceJpy: number }>,
    sal: [] as Array<{ grams: number; priceJpy: number }>,
    surface: [] as Array<{ grams: number; priceJpy: number }>,
  };

  let m: RegExpExecArray | null;
  while ((m = sectionRe.exec(html)) !== null) {
    const headerText = m[1].replace(/<[^>]+>/g, "").trim();
    const sectionBody = m[2];
    // 在此 section 內找第一張 data table
    const tblMatch = /<table[^>]*class="data[^"]*"[^>]*>([\s\S]*?)<\/table>/.exec(
      sectionBody,
    );
    if (!tblMatch) continue;
    const tblHtml = `<table>${tblMatch[1]}</table>`;
    const tblNode = parse(tblHtml).querySelector("table");
    if (!tblNode) continue;
    const rows = extractFaresFromTable(tblNode);
    if (rows.length < 20) continue;

    if (/SAL|エコノミー/i.test(headerText)) {
      out.sal = rows;
    } else if (/航空/.test(headerText)) {
      out.air = rows;
    } else if (/船便|surface|sea/i.test(headerText)) {
      out.surface = rows;
    }
  }

  if (out.air.length === 0 || out.surface.length === 0) {
    throw new Error(
      `[yuu-intl] parcel 分類失敗:航空=${out.air.length} / SAL=${out.sal.length} / 船便=${out.surface.length}`,
    );
  }

  return out;
}

// ------------------------------------------------------------
// 組裝成 FareRow[](擴展到所有 Zone 1 國家)
// ------------------------------------------------------------
function buildRows(
  emsRows: Array<{ grams: number; priceJpy: number }>,
  parcelAir: Array<{ grams: number; priceJpy: number }>,
  parcelSal: Array<{ grams: number; priceJpy: number }>,
  parcelSurface: Array<{ grams: number; priceJpy: number }>,
): FareRow[] {
  const out: FareRow[] = [];
  const ZONE = "1";
  const MAX_KG = 30;

  for (const country of ZONE_1_COUNTRIES) {
    for (const r of emsRows) {
      out.push({
        service_type: "ems",
        zone: ZONE,
        country_iso2: country,
        weight_grams: r.grams,
        price_jpy: r.priceJpy,
        max_weight_kg: MAX_KG,
      });
    }
    for (const r of parcelAir) {
      out.push({
        service_type: "parcel_air",
        zone: ZONE,
        country_iso2: country,
        weight_grams: r.grams,
        price_jpy: r.priceJpy,
        max_weight_kg: MAX_KG,
      });
    }
    for (const r of parcelSal) {
      out.push({
        service_type: "parcel_sal",
        zone: ZONE,
        country_iso2: country,
        weight_grams: r.grams,
        price_jpy: r.priceJpy,
        max_weight_kg: MAX_KG,
      });
    }
    for (const r of parcelSurface) {
      out.push({
        service_type: "parcel_surface",
        zone: ZONE,
        country_iso2: country,
        weight_grams: r.grams,
        price_jpy: r.priceJpy,
        max_weight_kg: MAX_KG,
      });
    }
  }
  return out;
}

// ------------------------------------------------------------
// main
// ------------------------------------------------------------
async function main() {
  const dryRun = process.argv.includes("--dry-run");

  const ems = await fetchEMS();
  await sleep(jitteredDelayMs());
  const parcel = await fetchParcel();

  console.log(
    `[yuu-intl] EMS ${ems.length} 階 | 航空 ${parcel.air.length} | SAL ${parcel.sal.length} | 船便 ${parcel.surface.length}`,
  );

  const rows = buildRows(ems, parcel.air, parcel.sal, parcel.surface);
  console.log(
    `[yuu-intl] 產出 ${rows.length} 筆(${ZONE_1_COUNTRIES.length} 國 × ${
      ems.length + parcel.air.length + parcel.sal.length + parcel.surface.length
    } 階)`,
  );

  console.log(`\n[yuu-intl] 台灣樣本:`);
  const samples: Array<[ServiceType, number]> = [
    ["ems", 1000],
    ["ems", 20000],
    ["parcel_air", 20000],
    ["parcel_sal", 20000],
    ["parcel_surface", 20000],
    ["parcel_surface", 30000],
  ];
  for (const [svc, g] of samples) {
    const row = rows.find(
      (r) =>
        r.country_iso2 === "TW" &&
        r.service_type === svc &&
        r.weight_grams === g,
    );
    console.log(
      `  TW ${svc.padEnd(15, " ")} ${String(g).padStart(6, " ")}g → ${row ? `¥${row.price_jpy}` : "(缺)"}`,
    );
  }

  if (dryRun) {
    console.log(`\n[yuu-intl] DRY RUN — no DB writes.`);
    return;
  }

  const supabase = createAdminClient();
  const capturedAt = new Date().toISOString();
  const rowsWithTs = rows.map((r) => ({ ...r, scraped_at: capturedAt }));
  const CHUNK = 500;
  let written = 0;
  for (let i = 0; i < rowsWithTs.length; i += CHUNK) {
    const batch = rowsWithTs.slice(i, i + CHUNK);
    const { error } = await supabase
      .from("yuu_intl_fares")
      .upsert(batch, { onConflict: "service_type,country_iso2,weight_grams" });
    if (error) {
      console.error("[yuu-intl] upsert error:", error);
      process.exit(1);
    }
    written += batch.length;
    process.stdout.write(`\r[yuu-intl] upsert 進度 ${written}/${rowsWithTs.length}`);
  }
  process.stdout.write("\n");
  console.log(`[yuu-intl] ✓ ${written} 筆已寫入 yuu_intl_fares (scraped_at=${capturedAt})`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

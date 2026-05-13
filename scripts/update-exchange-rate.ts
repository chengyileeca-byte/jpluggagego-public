// 從台銀 CSV 抓 JPY 即期賣出,寫回 src/lib/exchange-rate.ts。
// 由 GitHub Actions 每日自動執行;手動也可:npm run update:rate

import { readFile, writeFile } from "node:fs/promises";

const CSV_URL = "https://rate.bot.com.tw/xrt/flcsv/0/day/JPY";
const UA = "JPLuggageGoBot/0.1 (+https://jpluggagego.com/bot)";
const FILE = "src/lib/exchange-rate.ts";

async function fetchSpotSell(): Promise<number> {
  const res = await fetch(CSV_URL, {
    headers: { "User-Agent": UA },
    signal: AbortSignal.timeout(15_000),
  });
  if (!res.ok) throw new Error(`台銀 CSV HTTP ${res.status}`);
  const text = await res.text();
  // 去 BOM
  const lines = text.replace(/^\uFEFF/, "").split("\n");
  const jpy = lines.find((l) => l.startsWith("JPY,"));
  if (!jpy) throw new Error("CSV 無 JPY 列");
  // 格式:JPY,本行買入,現金買入,即期買入,遠10,遠30,遠60,遠90,遠120,遠150,遠180,本行賣出,現金賣出,即期賣出,...
  //      idx 0    1       2       3       4   5   6   7   8    9    10   11      12      13
  const cols = jpy.split(",");
  const v = parseFloat(cols[13]);
  if (!Number.isFinite(v) || v < 0.1 || v > 0.5) {
    throw new Error(`即期賣出解析失敗或超出合理範圍 [0.1, 0.5]: ${cols[13]}`);
  }
  return v;
}

function todayTaipei(): string {
  // UTC+8
  const t = new Date(Date.now() + 8 * 3600 * 1000);
  return t.toISOString().slice(0, 10);
}

async function main() {
  const rate = await fetchSpotSell();
  const date = todayTaipei();
  console.log(`[rate] 台銀 JPY 即期賣出 = ${rate} (${date})`);

  const file = await readFile(FILE, "utf-8");
  const next = file
    .replace(
      /export const JPY_TO_TWD = [\d.]+;/,
      `export const JPY_TO_TWD = ${rate};`,
    )
    .replace(
      /export const JPY_TO_TWD_VERIFIED_AT = "[^"]+";/,
      `export const JPY_TO_TWD_VERIFIED_AT = "${date}";`,
    );

  if (next === file) {
    console.log("[rate] 無變化,跳過寫入。");
    return;
  }
  await writeFile(FILE, next, "utf-8");
  console.log(`[rate] 已更新 ${FILE}`);
}

main().catch((e) => {
  console.error("[rate] 失敗:", e);
  process.exit(1);
});

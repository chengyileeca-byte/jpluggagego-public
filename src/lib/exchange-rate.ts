// JPY → TWD 匯率(台銀 即期賣出)。
//
// 由 .github/workflows/exchange-rate-daily.yml 每日 21:00 Taipei 自動更新,
// 抓 https://rate.bot.com.tw/xrt/flcsv/0/day/JPY 的 JPY 即期賣出欄位回寫。
// 不要手改這兩個常數 — commit 會被下次 workflow 覆蓋。
//
// 本數字僅用於「清關估算器」把日圓運費預估成 TWD,供 CIF 計算。
// 實際海關採用申報當日的關務署匯率(旬匯率),誤差 ±2% 屬正常。

export const JPY_TO_TWD = 0.2041;

export const JPY_TO_TWD_VERIFIED_AT = "2026-05-04";

/** 日圓 → 台幣(四捨五入到整數) */
export function jpyToTwd(jpy: number): number {
  return Math.round(jpy * JPY_TO_TWD);
}

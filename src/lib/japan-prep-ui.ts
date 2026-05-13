// JapanPrep UI helpers — 季節時序比對、日期顯示。
//
// season_start / season_end 以 YYYY-MM-DD 儲存但**年份無意義**(慣例使用 2000),
// 比對時僅看月日,並處理跨年(雪季 11 月 - 4 月)。

export interface SeasonRange {
  start: string | null; // YYYY-MM-DD
  end: string | null;
}

// 將 "YYYY-MM-DD" 轉為 MMDD 數字(4/22 → 422)方便比對。
function toMD(dateStr: string): number {
  const m = dateStr.match(/^\d{4}-(\d{2})-(\d{2})$/);
  if (!m) return NaN;
  return Number(m[1]) * 100 + Number(m[2]);
}

// 今日是否落在季節區間內;支援跨年(如 11/25 - 4/5)。
export function isInSeason(range: SeasonRange, today: Date = new Date()): boolean {
  if (!range.start || !range.end) return false;
  const startMD = toMD(range.start);
  const endMD = toMD(range.end);
  if (!Number.isFinite(startMD) || !Number.isFinite(endMD)) return false;
  const todayMD = (today.getMonth() + 1) * 100 + today.getDate();
  if (startMD <= endMD) return todayMD >= startMD && todayMD <= endMD;
  // 跨年
  return todayMD >= startMD || todayMD <= endMD;
}

// 到季節起的天數(負 = 已過、正 = 尚未);跨年處理:取最近的下一個 startMD。
export function daysUntilSeasonStart(
  range: SeasonRange,
  today: Date = new Date(),
): number | null {
  if (!range.start) return null;
  const startMD = toMD(range.start);
  if (!Number.isFinite(startMD)) return null;
  const startMonth = Math.floor(startMD / 100);
  const startDay = startMD % 100;
  const y = today.getFullYear();
  let startThisYear = new Date(y, startMonth - 1, startDay);
  if (startThisYear < today) startThisYear = new Date(y + 1, startMonth - 1, startDay);
  return Math.ceil(
    (startThisYear.getTime() - today.getTime()) / 86_400_000,
  );
}

// 顯示 "4/25 - 5/10" 或 "11/25 - 4/5"
export function formatSeasonRange(range: SeasonRange): string | null {
  if (!range.start || !range.end) return null;
  const s = range.start.match(/^\d{4}-(\d{2})-(\d{2})$/);
  const e = range.end.match(/^\d{4}-(\d{2})-(\d{2})$/);
  if (!s || !e) return null;
  return `${Number(s[1])}/${Number(s[2])} – ${Number(e[1])}/${Number(e[2])}`;
}

// 星期對照(closed_days 用)。
export const WEEKDAY_LABEL_ZH: Record<string, string> = {
  mon: "週一",
  tue: "週二",
  wed: "週三",
  thu: "週四",
  fri: "週五",
  sat: "週六",
  sun: "週日",
};

// 價位標記(price_tier 0-5 → 文字)。
export function priceTierLabel(tier: number | null): string | null {
  if (tier === null || tier === undefined) return null;
  if (tier === 0) return "免費";
  return "¥".repeat(Math.max(1, Math.min(5, tier)));
}

// 把 YYYY-MM-DD 或 ISO 時間戳轉「4/22(三)」風格。
export function formatDateShort(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  const days = ["日", "一", "二", "三", "四", "五", "六"];
  return `${d.getMonth() + 1}/${d.getDate()}(${days[d.getDay()]})`;
}

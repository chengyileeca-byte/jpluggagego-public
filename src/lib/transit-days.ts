// Simplified transit-day estimator for Yamato 宅急便 / ゆうパック.
//
// Based on Yamato "お届け予定日数" + ゆうパック "お届け日数表":
//   - Most mainland-to-mainland routes arrive next day (+1).
//   - Anything involving 沖縄県 adds a day (+2) due to air transit schedules.
//   - Hokkaido to 九州/沖縄 (and reverse) is also +2.
//   - Hokkaido-internal and Okinawa-internal are still next-day (+1).
//   - 離島 (remote islands inside prefectures) can be +3 but we can't detect that
//     from prefecture alone — we flag it to the caller via `warnRemote`.
//
// The real carriers have hour-of-day cutoffs (16:00 typical) and postal code
// distinctions; this helper intentionally collapses those for quote-page UX.

const OKINAWA = "沖縄県";
const HOKKAIDO = "北海道";

// 九州 7 prefectures
const KYUSHU = new Set([
  "福岡県",
  "佐賀県",
  "長崎県",
  "熊本県",
  "大分県",
  "宮崎県",
  "鹿児島県",
]);

export interface TransitEstimate {
  /** days after ship_date the parcel arrives (1 = next day) */
  yamato: number;
  yuu: number;
  /** whether one of the prefectures commonly has 離島 surcharges / extra day */
  warnRemote: boolean;
}

export function estimateTransit(fromPref: string, toPref: string): TransitEstimate {
  const bothHokkaido = fromPref === HOKKAIDO && toPref === HOKKAIDO;
  const bothOkinawa = fromPref === OKINAWA && toPref === OKINAWA;
  const involvesOkinawa = fromPref === OKINAWA || toPref === OKINAWA;
  const involvesHokkaido = fromPref === HOKKAIDO || toPref === HOKKAIDO;
  const involvesKyushu = KYUSHU.has(fromPref) || KYUSHU.has(toPref);

  let days = 1;

  if (bothHokkaido || bothOkinawa) {
    days = 1;
  } else if (involvesOkinawa) {
    days = 2;
  } else if (involvesHokkaido && involvesKyushu) {
    days = 2;
  } else if (involvesHokkaido) {
    // Hokkaido ↔ 本州 is mostly +1 for Yamato, +1~2 for ゆうパック.
    days = 1;
  }

  return {
    yamato: days,
    yuu: days,
    warnRemote: involvesOkinawa || involvesHokkaido,
  };
}

const MS_PER_DAY = 1000 * 60 * 60 * 24;

export function addDays(iso: string, days: number): Date {
  const d = new Date(`${iso}T00:00:00`);
  d.setDate(d.getDate() + days);
  return d;
}

export function formatArrival(d: Date): string {
  const weekday = ["日", "一", "二", "三", "四", "五", "六"][d.getDay()];
  return `${d.getMonth() + 1}/${d.getDate()} (${weekday})`;
}

export function isValidIsoDate(s: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(s)) return false;
  const d = new Date(`${s}T00:00:00`);
  return !Number.isNaN(d.getTime());
}

export function daysBetween(fromIso: string, toDate: Date): number {
  const from = new Date(`${fromIso}T00:00:00`);
  return Math.round((toDate.getTime() - from.getTime()) / MS_PER_DAY);
}

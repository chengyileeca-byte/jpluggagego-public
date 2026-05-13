// Yamato 空港宅急便 各カウンターの受付時間 / 電話
// Source: https://www.kuronekoyamato.co.jp/ytc/customer/send/services/airport/pdf/airportcounter_jp.pdf
// (2025年4月 改訂版。PDF 更新頻度はほぼ四半期に一度。更新時はこのファイルを手動で差し替える。)
//
// Keyed by (airport_name_jp, service_type) which is the yamato_airport_counters
// upsert conflict key. Missing entries fall back to null (the UI will hide hours).
//
// Last verified: 2026-04-19

export interface YamatoAirportCounterHours {
  hours: string;                // "07:00-21:30"
  phone: string | null;         // "0476-33-5000" or null (no direct line published)
  note: string | null;          // free-form supplement, e.g. "当日発送締切 17:00"
}

const H: Record<string, YamatoAirportCounterHours> = {
  // CTS 新千歳
  "新千歳空港（国内線）|受取・発送": { hours: "07:00-20:00", phone: "0123-46-5429", note: null },
  "新千歳空港（国内線）|発送": { hours: "07:30-20:00", phone: "0123-46-2145", note: null },
  "新千歳空港（国際線ターミナルビル）|発送": {
    hours: "11:00-14:00",
    phone: "0123-46-2104",
    note: "電話受付 7:30-19:00(火・金 昼12:00-15:00)",
  },

  // SDJ 仙台
  "仙台国際空港|受取・発送": { hours: "08:00-18:00", phone: "080-5045-2850", note: null },

  // FKS 福島
  "福島空港|受取・発送": { hours: "07:00-18:00", phone: null, note: null },

  // NRT 成田
  "成田空港第1ターミナル（北ウイング）|受取": { hours: "07:00-21:30", phone: "0476-33-5000", note: null },
  "成田空港第1ターミナル（北ウイング）|発送": { hours: "06:30-22:30", phone: "0476-33-5000", note: null },
  "成田空港第1ターミナル（南ウイング）|受取": { hours: "07:00-21:30", phone: "0476-33-5000", note: null },
  "成田空港第1ターミナル（南ウイング）|発送": { hours: "06:30-22:30", phone: "0476-33-5000", note: null },
  "成田空港第2ターミナル|受取": { hours: "07:00-21:30", phone: "0476-33-5000", note: null },
  "成田空港第2ターミナル|発送": { hours: "06:30-22:30", phone: "0476-33-5000", note: null },
  "成田空港第3ターミナル|受取・発送": { hours: "06:30-22:30", phone: "0476-33-5000", note: null },

  // HND 羽田
  "羽田空港第1旅客ターミナル|受取・発送": {
    hours: "07:00-21:00",
    phone: "03-5757-9267",
    note: "南ウィング到着出口 2 番脇",
  },
  "羽田空港第2旅客ターミナル（国内線）|受取・発送": {
    hours: "07:00-21:00",
    phone: "03-5757-6166",
    note: null,
  },
  "羽田空港第2旅客ターミナル（国際線）|受取": {
    hours: "05:45-23:00",
    phone: "03-6756-7174",
    note: "ウェルカムセンター内 手荷物カウンター",
  },
  "羽田空港第2旅客ターミナル（国際線）|発送": {
    hours: "05:45-23:00",
    phone: "03-6756-7174",
    note: null,
  },
  "羽田空港第3旅客ターミナル|受取": {
    hours: "06:00-23:00",
    phone: "03-6428-0669",
    note: "受取は出発時刻の 3 時間前から",
  },
  "羽田空港第3旅客ターミナル|発送": {
    hours: "05:00-23:00",
    phone: "03-6428-0661",
    note: null,
  },

  // KIJ 新潟
  "新潟空港|受取・発送": { hours: "09:30-13:30", phone: "025-333-2222", note: null },

  // KMQ 小松
  "小松空港|受取・発送": { hours: "08:00-17:30", phone: "0761-21-9004", note: null },

  // NGO 中部国際
  "中部国際空港第1ターミナル|受取": {
    hours: "06:30-21:30",
    phone: "0569-38-8562",
    note: "3 階 出発ロビー",
  },
  "中部国際空港第1ターミナル|発送": {
    hours: "07:00-22:00",
    phone: "0569-38-8562",
    note: "2 階 到着ロビー",
  },
  "中部国際空港第2ターミナル|受取・発送": {
    hours: "11:00-18:00",
    phone: "0569-38-8562",
    note: "航空便出発時間により受付停止の場合あり",
  },

  // ITM 伊丹
  "大阪国際（伊丹）空港（中央エリア）|受取・発送": {
    hours: "07:00-21:00",
    phone: null,
    note: null,
  },

  // KIX 関西国際
  "関西国際空港第1ターミナルビル|受取": {
    hours: "06:30-22:30",
    phone: "072-455-3454",
    note: "JAL ABC カウンター",
  },
  "関西国際空港第1ターミナルビル|発送": {
    hours: "06:30-22:30",
    phone: "072-455-3454",
    note: "JAL ABC カウンター",
  },

  // OKJ 岡山
  "岡山桃太郎空港|受取・発送": { hours: "09:00-20:00", phone: null, note: null },

  // HIJ 広島
  "広島空港|受取・発送": { hours: "08:30-18:30", phone: null, note: null },

  // KKJ 北九州
  "北九州空港|受取・発送": { hours: "10:00-15:00", phone: null, note: null },

  // FUK 福岡
  "福岡空港（国内線）|受取・発送": {
    hours: "07:00-21:00",
    phone: null,
    note: "当日発送締切 18:00",
  },
  "福岡空港（国際線）|受取・発送": {
    hours: "07:30-20:00",
    phone: null,
    note: "当日発送締切 17:00",
  },

  // NGS 長崎
  "長崎空港|受取・発送": { hours: "08:00-20:00", phone: "080-6699-9796", note: null },

  // KOJ 鹿児島
  "鹿児島空港|受取・発送": { hours: "07:30-20:30", phone: null, note: null },
};

/** Shared Yamato-wide navi-dial. Falls back to this when a counter has no direct number. */
export const YAMATO_NAVI_DIAL = "0570-200-000";

export function yamatoAirportHours(
  airportNameJp: string,
  serviceType: string,
): YamatoAirportCounterHours | null {
  return H[`${airportNameJp}|${serviceType}`] ?? null;
}

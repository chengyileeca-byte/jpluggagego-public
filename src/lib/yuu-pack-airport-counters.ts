// 空港ゆうパック 取扱空港カウンター一覧
// Source: https://www.post.japanpost.jp/service/you_pack/airpo/ichiran.html
// (Hand-curated snapshot — this list changes rarely, ~once per few years.
// When the source page updates, refresh this file manually.)
//
// Last verified: 2026-04-19

export interface YuuPackAirportCounter {
  airport_iata: string;
  airport_name_jp: string; // as shown on the official page
  prefecture: string;
  counter_name_jp: string; // e.g. JAL ABC 宅配カウンター(第1ターミナル南ウィング)
  terminal: string | null; // T1南 / T2 / 国内線 / 国際線 etc.
  hours_jst: string;
  phone: string;
  note: string | null;
}

export const YUU_PACK_AIRPORT_COUNTERS: readonly YuuPackAirportCounter[] = [
  {
    airport_iata: "CTS",
    airport_name_jp: "新千歳空港",
    prefecture: "北海道",
    counter_name_jp: "手荷物一時預り所(国内線)",
    terminal: "国内線",
    hours_jst: "7:00-20:00",
    phone: "0123-46-5429",
    note: "JAL側手荷物一時預り所",
  },
  {
    airport_iata: "CTS",
    airport_name_jp: "新千歳空港",
    prefecture: "北海道",
    counter_name_jp: "手荷物一時預り所(国際線)",
    terminal: "国際線",
    hours_jst: "11:00-14:00",
    phone: "0123-46-2104",
    note: "国際線での受取は不可(発送のみ)",
  },
  {
    airport_iata: "SDJ",
    airport_name_jp: "仙台空港",
    prefecture: "宮城県",
    counter_name_jp: "宅配サービスカウンター",
    terminal: null,
    hours_jst: "8:00-18:00",
    phone: "0120-01-9625",
    note: "ターミナル2F",
  },
  {
    airport_iata: "KIJ",
    airport_name_jp: "新潟空港",
    prefecture: "新潟県",
    counter_name_jp: "手荷物宅配カウンター",
    terminal: null,
    hours_jst: "9:30-13:30",
    phone: "025-270-8822",
    note: "ターミナル1F",
  },
  {
    airport_iata: "NRT",
    airport_name_jp: "成田国際空港",
    prefecture: "千葉県",
    counter_name_jp: "JAL ABC 宅配カウンター (第1ターミナル南ウィング)",
    terminal: "T1南",
    hours_jst: "発送 7:00-21:00 / 受取 6:30-最終便到着1時間後",
    phone: "0476-33-2915",
    note: "4F出発ロビー・1F到着ロビー",
  },
  {
    airport_iata: "NRT",
    airport_name_jp: "成田国際空港",
    prefecture: "千葉県",
    counter_name_jp: "JAL ABC 宅配カウンター (第1ターミナル北ウィング)",
    terminal: "T1北",
    hours_jst: "発送 7:00-21:00 / 受取 6:30-最終便到着1時間後",
    phone: "0476-32-8290",
    note: "4F出発ロビー・1F到着ロビー",
  },
  {
    airport_iata: "NRT",
    airport_name_jp: "成田国際空港",
    prefecture: "千葉県",
    counter_name_jp: "JAL ABC 宅配カウンター (第2ターミナル)",
    terminal: "T2",
    hours_jst: "発送 7:00-21:00 / 受取 6:30-最終便到着1時間後",
    phone: "0476-34-8490",
    note: "3F出発ロビー・1F到着ロビー",
  },
  {
    airport_iata: "HND",
    airport_name_jp: "東京国際空港 (羽田)",
    prefecture: "東京都",
    counter_name_jp: "JAL ABC 宅配カウンター (第3ターミナル)",
    terminal: "T3",
    hours_jst: "発送 24時間 / 受取 4:00-25:00",
    phone: "03-6428-0665",
    note: "3F出発ロビー・2F到着ロビー (国際線)",
  },
  {
    airport_iata: "NGO",
    airport_name_jp: "中部国際空港",
    prefecture: "愛知県",
    counter_name_jp: "手荷物宅配カウンター",
    terminal: "T1",
    hours_jst: "発送 6:30-21:30 / 受取 7:00-22:00",
    phone: "0569-38-8562",
    note: "第1ターミナル 3F出発・2F到着(最終便に合わせて変動)",
  },
  {
    airport_iata: "KIX",
    airport_name_jp: "関西国際空港",
    prefecture: "大阪府",
    counter_name_jp: "関西エアポートバゲージサービス",
    terminal: null,
    hours_jst: "発送 7:00-21:00 / 受取 6:30-22:30",
    phone: "072-456-8701",
    note: "4F国際線出発ロビー・1F国際線到着ロビー",
  },
  {
    airport_iata: "KIX",
    airport_name_jp: "関西国際空港",
    prefecture: "大阪府",
    counter_name_jp: "JAL ABC 宅配カウンター",
    terminal: null,
    hours_jst: "6:30-22:30",
    phone: "072-455-3454",
    note: "4F国際線出発ロビー・1F国際線到着ロビー",
  },
  {
    airport_iata: "FUK",
    airport_name_jp: "福岡空港",
    prefecture: "福岡県",
    counter_name_jp: "宅配カウンター (国際線)",
    terminal: "国際線",
    hours_jst: "7:30-20:00",
    phone: "092-477-7567",
    note: "国際線ターミナル1F到着ロビー",
  },
  {
    airport_iata: "FUK",
    airport_name_jp: "福岡空港",
    prefecture: "福岡県",
    counter_name_jp: "宅配カウンター (国内線)",
    terminal: "国内線",
    hours_jst: "7:00-21:00",
    phone: "092-627-2270",
    note: "第2ターミナル1F",
  },
];

export const YUU_PACK_AIRPORT_LIST_URL =
  "https://www.post.japanpost.jp/service/you_pack/airpo/ichiran.html";

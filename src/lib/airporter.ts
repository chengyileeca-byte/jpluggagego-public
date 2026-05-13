// Airporter 同日配送 (same-day luggage delivery) coverage map.
//
// Airporter 是日本同日行李配送的代表業者,服務範圍有限但勝過 Yamato 翌日送達 ——
// 觀光客剛下飛機想當日 check-in 前拿到行李,只有 Airporter 可以做到。
//
// 資料源 (2026-04 查):
//   - https://airporter.co.jp/
//   - https://about.airporter.co.jp/for-visitors
//   - Klook / Rakuten Travel Experiences listing (交叉核對)
//
// 注意:
//   - 料金起價 ¥2,000/件,依尺寸/時段浮動,實際以官網為準
//   - NRT 僅限 Terminal 2 取件 (T1/T3 要另外 shuttle 過去)
//   - 須於當日 09:00 前在飯店櫃台投單,才能保證當日下午/晚間到達
//   - 範圍外無此服務,需用 Yamato 翌日 or JAL ABC

export interface AirporterCoverage {
  /** service airports (IATA) */
  airports: string[];
  /** 都道府県 range that Airporter delivers to from the listed airports */
  toPrefectures: string[];
  /** notable cities/areas (for display) */
  cities: string[];
  /** i18n key for extra note shown in UI */
  noteKey?: string;
}

// Coverage rows — one per city cluster.
export const AIRPORTER_ROUTES: AirporterCoverage[] = [
  {
    airports: ["NRT", "HND"],
    toPrefectures: ["東京都", "千葉県"],
    cities: ["東京 23 区", "千葉県 浦安市 (Disney)"],
    noteKey: "airporter.note.nrt_t2",
  },
  {
    airports: ["KIX", "ITM"],
    toPrefectures: ["大阪府", "京都府"],
    cities: ["大阪市内", "京都市内"],
  },
  {
    airports: ["CTS"],
    toPrefectures: ["北海道"],
    cities: ["札幌市内"],
  },
  {
    airports: ["FUK"],
    toPrefectures: ["福岡県"],
    cities: ["福岡市内"],
  },
  {
    airports: ["OKA"],
    toPrefectures: ["沖縄県"],
    cities: ["那覇市内"],
  },
];

export const AIRPORTER_URL = "https://airporter.co.jp/";

export const AIRPORTER_PRICE_NOTE_KEY = "airporter.price_note";
export const AIRPORTER_SAMEDAY_WINDOW_KEY = "airporter.sameday_window";

export function airporterCoverage(
  airportIata: string,
  toPref: string,
): AirporterCoverage | null {
  return (
    AIRPORTER_ROUTES.find(
      (r) => r.airports.includes(airportIata) && r.toPrefectures.includes(toPref),
    ) ?? null
  );
}

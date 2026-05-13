// Yamato 國際宅急便(UGX)台灣向け料金表
//
// Source: https://date.kuronekoyamato.co.jp/date/KokusaiTakkyubin?ACTID=J_RKWTJS0020&SEARCH_ID=01&LAND_CD=TW
// Consumer landing: https://www.kuronekoyamato.co.jp/ytc/customer/send/services/oversea/
//
// Yamato 不公開標準爬蟲 API,且國別頁為 session-driven,故採人肉維護。
// 每季(1/1, 4/1, 7/1, 10/1)作者手動校對一次;大規模運價調整(如 2023 年漲價)另行補。
//
// Last verified: 2026-04-20

export interface YamatoIntlFare {
  /** size_code: 'b4_doc' | '60' | '80' | '100' | '120' | '140' | '160' */
  sizeCode: string;
  /** 同 size_code 內的重量上限(kg) */
  maxWeightKg: number;
  /** 日圓,含日本側輸出通関與台灣側簡易通関,不含關稅與保險 */
  priceJpy: number;
}

export const YAMATO_INTL_TAIWAN: YamatoIntlFare[] = [
  { sizeCode: "b4_doc", maxWeightKg: 1, priceJpy: 1300 },
  { sizeCode: "60", maxWeightKg: 2, priceJpy: 2750 },
  { sizeCode: "80", maxWeightKg: 5, priceJpy: 4650 },
  { sizeCode: "100", maxWeightKg: 10, priceJpy: 8700 },
  { sizeCode: "120", maxWeightKg: 15, priceJpy: 14800 },
  { sizeCode: "140", maxWeightKg: 20, priceJpy: 20200 },
  { sizeCode: "160", maxWeightKg: 25, priceJpy: 25600 },
];

export const YAMATO_INTL_TAIWAN_VERIFIED_AT = "2026-04-20T00:00:00Z";

export const YAMATO_INTL_TAIWAN_META = {
  countryIso2: "TW",
  transitDays: "+5~+6",
  maxWeightKg: 25,
  /** 禁寄類別(Yamato 自家規定,非法規)。UI 顯示用。 */
  prohibitedJa: [
    "食品",
    "医薬品・医療機器(薬効をうたう化粧水も含む)",
    "香水・香料・ネイル液・除光液・染髪剤",
    "引火性のある化粧品(アルコール入り化粧水含む)",
    "爆発物・危険物・スプレー缶",
    "通信機器(未開封新品の携帯電話等)",
    "オーディオ機器",
    "マスクなど防疫用品",
  ],
  /** 依《快遞貨物通關辦法》法定分界:CIF ≤ TWD 50,000 可走簡易申報(X2 免稅 ≤ 2,000 / X3 應稅 2,001~50,000),> 50,000 強制 G1 正式報關(須紙本委任書 + 身分證影本)。 */
  formalCustomsThresholdTwd: 50_000,
  /** 台灣海關化妝品 / 保健品 總量限制(按件):單一品項 ≤ 12 件,合計 ≤ 36 件。超量會被視為商業用途要求正式報關。 */
  cosmeticQtyLimit: { perItem: 12, total: 36 },
  /** 台灣雅瑪多國際物流股份有限公司(Taiwan Yamato International Logistics Inc.)— Yamato Holdings 1984 年成立的台灣 100% 子公司,台北事務所 02-2700-9605 / 高雄事務所 07-262-0729。 */
  taiwanAgent: {
    nameZh: "台灣雅瑪多國際物流股份有限公司",
    nameEn: "Taiwan Yamato International Logistics Inc.",
    taipeiTel: "02-2700-9605",
    kaohsiungTel: "07-262-0729",
  },
} as const;

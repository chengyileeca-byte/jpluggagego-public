/**
 * 新手友善分店白名單(人工 curation)。
 *
 * 選擇標準:
 * 1. 大型分店 / 中央郵便局,窗口數 3+,國際業務熟
 * 2. 平日開到 19:00 以上,週六也有營業
 * 3. 位於主要車站 / 機場周邊,英語指示明確
 * 4. 一般外國觀光客常用 — 經驗上扣關少、對外帳單熟悉
 *
 * 不含 Google Place rating — 目前 schema 沒存。下一輪再補。
 *
 * Each `googleMapsUrl` is a search, not a place_id pin — safer when
 * 店舗因維修/搬遷 place_id 變更,依然能抵達該郵便局/営業所。
 */

export interface CarrierBranch {
  kind: "yuu" | "yamato";
  nameJp: string;
  addressJp: string;
  hoursWeekday: string;
  hoursWeekend: string;
  phoneHint?: string;
  whyGood: string[];
}

export interface NewcomerFriendlyArea {
  key: string;
  label: string;
  prefecture: string;
  nearestAirports?: string[];
  branches: CarrierBranch[];
}

function gmaps(q: string): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q)}`;
}

export function branchGmapsUrl(b: CarrierBranch): string {
  return gmaps(`${b.nameJp} ${b.addressJp}`);
}

export const NEWCOMER_FRIENDLY: NewcomerFriendlyArea[] = [
  // ===== 東京圏 =====
  {
    key: "tokyo-shinjuku",
    label: "東京都 · 新宿 / 西新宿",
    prefecture: "東京都",
    nearestAirports: ["HND", "NRT"],
    branches: [
      {
        kind: "yuu",
        nameJp: "新宿郵便局",
        addressJp: "東京都新宿区西新宿1-8-8",
        hoursWeekday: "09:00-21:00",
        hoursWeekend: "土 09:00-17:00 / 日祝 09:00-12:30",
        whyGood: [
          "新宿駅西口徒歩 5 分,大型,国際窓口專櫃",
          "EMS / 航空小包 / 船便 全部可受理",
          "英語窗口標示,外國人常用",
        ],
      },
      {
        kind: "yamato",
        nameJp: "ヤマト運輸 新宿支店",
        addressJp: "東京都新宿区新宿5-4-1",
        hoursWeekday: "07:00-21:00",
        hoursWeekend: "土日祝 08:00-19:00",
        whyGood: [
          "平日到 21:00,午后閒逛後也能寄",
          "国際宅急便受付可,台湾便熟",
        ],
      },
    ],
  },
  {
    key: "tokyo-central",
    label: "東京都 · 丸の内 / 東京駅",
    prefecture: "東京都",
    nearestAirports: ["HND", "NRT"],
    branches: [
      {
        kind: "yuu",
        nameJp: "東京中央郵便局",
        addressJp: "東京都千代田区丸の内2-7-2 KITTE 1F",
        hoursWeekday: "09:00-21:00",
        hoursWeekend: "土日祝 09:00-21:00",
        whyGood: [
          "KITTE 商業大樓內,東京駅直結",
          "365 日営業,夜間窗口開到 21:00",
          "EMS 熟,台灣方向處理量大",
        ],
      },
    ],
  },
  {
    key: "tokyo-haneda",
    label: "東京都 · 羽田空港",
    prefecture: "東京都",
    nearestAirports: ["HND"],
    branches: [
      {
        kind: "yamato",
        nameJp: "ヤマト運輸 羽田空港カウンター(第1/2/3T)",
        addressJp: "東京都大田区羽田空港 各ターミナル到着ロビー",
        hoursWeekday: "07:00-22:00(ターミナル別)",
        hoursWeekend: "07:00-22:00",
        whyGood: [
          "入境動線上,不用出機場",
          "英語 / 中文對應窗口有(第3T 國際線尤其多)",
          "紙箱 / 梱包材 現場販售",
        ],
      },
    ],
  },
  {
    key: "tokyo-narita",
    label: "千葉県 · 成田空港",
    prefecture: "千葉県",
    nearestAirports: ["NRT"],
    branches: [
      {
        kind: "yamato",
        nameJp: "ヤマト運輸 成田空港カウンター(第1/2/3T)",
        addressJp: "千葉県成田市成田空港内",
        hoursWeekday: "07:00-21:00(ターミナル別)",
        hoursWeekend: "07:00-21:00",
        whyGood: [
          "第2T 到着ロビー櫃台,入境後直接寄",
          "国際宅急便 / 空港宅急便 兩邊都能辦",
          "多語対応,首訪旅客最穩",
        ],
      },
    ],
  },

  // ===== 関西圏 =====
  {
    key: "osaka-umeda",
    label: "大阪府 · 梅田 / 大阪駅",
    prefecture: "大阪府",
    nearestAirports: ["KIX", "ITM"],
    branches: [
      {
        kind: "yuu",
        nameJp: "大阪中央郵便局",
        addressJp: "大阪府大阪市北区梅田3-2-4",
        hoursWeekday: "09:00-21:00",
        hoursWeekend: "土日祝 09:00-21:00",
        whyGood: [
          "大阪駅徒歩 3 分,365 日開",
          "国際郵便物扱い量 関西最大",
          "英語窗口標示、EMS 熟",
        ],
      },
      {
        kind: "yamato",
        nameJp: "ヤマト運輸 大阪主管支店",
        addressJp: "大阪府大阪市北区大淀南",
        hoursWeekday: "08:00-21:00",
        hoursWeekend: "土日祝 09:00-19:00",
        whyGood: ["梅田圏最大分店,国際宅急便受付可"],
      },
    ],
  },
  {
    key: "kix-airport",
    label: "大阪府 · 関西国際空港",
    prefecture: "大阪府",
    nearestAirports: ["KIX"],
    branches: [
      {
        kind: "yamato",
        nameJp: "ヤマト運輸 関西空港カウンター",
        addressJp: "大阪府泉佐野市泉州空港北 第1ターミナル",
        hoursWeekday: "07:00-22:00",
        hoursWeekend: "07:00-22:00",
        whyGood: [
          "第1T 到着ロビー,台灣旅客常走這線",
          "英語・中文対応,台灣便流量大",
        ],
      },
    ],
  },
  {
    key: "kyoto-station",
    label: "京都府 · 京都駅周辺",
    prefecture: "京都府",
    branches: [
      {
        kind: "yuu",
        nameJp: "京都中央郵便局",
        addressJp: "京都府京都市下京区東塩小路町843-12",
        hoursWeekday: "09:00-21:00",
        hoursWeekend: "土日祝 09:00-21:00",
        whyGood: [
          "京都駅前徒歩 1 分,365 日営業",
          "觀光客密度高,国際窓口熟",
          "EMS / 航空 / 船便 全可",
        ],
      },
    ],
  },

  // ===== 中部 =====
  {
    key: "nagoya-station",
    label: "愛知県 · 名古屋駅周辺",
    prefecture: "愛知県",
    nearestAirports: ["NGO"],
    branches: [
      {
        kind: "yuu",
        nameJp: "名古屋中央郵便局",
        addressJp: "愛知県名古屋市中村区名駅1-1-1",
        hoursWeekday: "09:00-21:00",
        hoursWeekend: "土日祝 09:00-17:00",
        whyGood: [
          "JR 名古屋駅直結(桜通口)",
          "国際郵便熟,EMS / 航空 / 船便 全可",
        ],
      },
    ],
  },
  {
    key: "ngo-airport",
    label: "愛知県 · 中部国際空港(セントレア)",
    prefecture: "愛知県",
    nearestAirports: ["NGO"],
    branches: [
      {
        kind: "yamato",
        nameJp: "ヤマト運輸 中部空港カウンター",
        addressJp: "愛知県常滑市セントレア1-1 中部国際空港",
        hoursWeekday: "07:30-21:30",
        hoursWeekend: "07:30-21:30",
        whyGood: [
          "到着ロビー 2F 中央,視線上即看到",
          "空港宅急便 + 国際宅急便 兼辦",
        ],
      },
    ],
  },

  // ===== 北海道 =====
  {
    key: "sapporo-station",
    label: "北海道 · 札幌駅周辺",
    prefecture: "北海道",
    nearestAirports: ["CTS"],
    branches: [
      {
        kind: "yuu",
        nameJp: "札幌中央郵便局",
        addressJp: "北海道札幌市東区北6条東1-2-1",
        hoursWeekday: "09:00-21:00",
        hoursWeekend: "土日祝 09:00-19:00",
        whyGood: [
          "札幌駅北口徒歩 5 分",
          "北海道最大,国際 / 離島配送熟",
        ],
      },
    ],
  },
  {
    key: "cts-airport",
    label: "北海道 · 新千歳空港",
    prefecture: "北海道",
    nearestAirports: ["CTS"],
    branches: [
      {
        kind: "yamato",
        nameJp: "ヤマト運輸 新千歳空港カウンター",
        addressJp: "北海道千歳市美々 新千歳空港国内線ターミナル",
        hoursWeekday: "08:00-20:30",
        hoursWeekend: "08:00-20:30",
        whyGood: [
          "国内線 2F 到着ロビー",
          "滑雪季節特別忙,建議早班進去",
        ],
      },
    ],
  },

  // ===== 九州 =====
  {
    key: "fukuoka-hakata",
    label: "福岡県 · 博多駅 / 福岡空港",
    prefecture: "福岡県",
    nearestAirports: ["FUK"],
    branches: [
      {
        kind: "yuu",
        nameJp: "博多郵便局",
        addressJp: "福岡県福岡市博多区博多駅中央街9-1",
        hoursWeekday: "09:00-21:00",
        hoursWeekend: "土日祝 09:00-19:00",
        whyGood: [
          "博多駅徒歩 2 分",
          "ゆうゆう窓口 24 時間(急件可)",
          "国際郵便物多,EMS 熟",
        ],
      },
      {
        kind: "yamato",
        nameJp: "ヤマト運輸 福岡空港カウンター",
        addressJp: "福岡県福岡市博多区下臼井 福岡空港国内線2F",
        hoursWeekday: "07:00-21:00",
        hoursWeekend: "07:00-21:00",
        whyGood: ["国内線 2F 到着ロビー,入境後直達"],
      },
    ],
  },

  // ===== 沖縄 =====
  {
    key: "naha-airport",
    label: "沖縄県 · 那覇空港 / 那覇市中心",
    prefecture: "沖縄県",
    nearestAirports: ["OKA"],
    branches: [
      {
        kind: "yuu",
        nameJp: "那覇中央郵便局",
        addressJp: "沖縄県那覇市壺川3-3-5",
        hoursWeekday: "09:00-21:00",
        hoursWeekend: "土日祝 09:00-17:00",
        whyGood: [
          "ゆいレール壺川駅徒歩 3 分",
          "離島便處理多,經驗老到",
        ],
      },
      {
        kind: "yamato",
        nameJp: "ヤマト運輸 那覇空港カウンター",
        addressJp: "沖縄県那覇市鏡水 那覇空港1F",
        hoursWeekday: "08:00-21:00",
        hoursWeekend: "08:00-21:00",
        whyGood: [
          "到着ロビー 1F",
          "離島(石垣/宮古)行き 事前確認必須",
        ],
      },
    ],
  },
];

// 9 大地區 prefecture mapping(用於 /japan 地區瀏覽頁等所有「以 9 region 看日本」的地方)。
// 注意:src/lib/japan.ts 的 PREFECTURES.region 是 Yamato TK.json 的 12-region scheme
// (北東北/南東北/信越/北陸 分開),那是用來算運費的。本檔案是觀光・地理常用的 9-region 分組,
// 與 japan_entries.region enum 對齊。
//
// 山梨県:行政上是中部,但観光便宜上常列入関東(富士山在山梨)。本表沿用 japan_entries.region
// enum 的選擇:山梨 → 中部(學術正統),と矛盾なし。

import type { Region } from "./japan-entries";

export interface Prefecture {
  code: string; // JIS X 0401 (01-47)
  name_ja: string; // 都道府縣名(日文)
  name_zh: string; // 簡稱(中文)
  romaji: string; // 羅馬字
}

export const REGION_PREFECTURES: Record<Region, Prefecture[]> = {
  hokkaido: [
    { code: "01", name_ja: "北海道", name_zh: "北海道", romaji: "Hokkaidō" },
  ],
  tohoku: [
    { code: "02", name_ja: "青森県", name_zh: "青森", romaji: "Aomori" },
    { code: "03", name_ja: "岩手県", name_zh: "岩手", romaji: "Iwate" },
    { code: "04", name_ja: "宮城県", name_zh: "宮城", romaji: "Miyagi" },
    { code: "05", name_ja: "秋田県", name_zh: "秋田", romaji: "Akita" },
    { code: "06", name_ja: "山形県", name_zh: "山形", romaji: "Yamagata" },
    { code: "07", name_ja: "福島県", name_zh: "福島", romaji: "Fukushima" },
  ],
  kanto: [
    { code: "08", name_ja: "茨城県", name_zh: "茨城", romaji: "Ibaraki" },
    { code: "09", name_ja: "栃木県", name_zh: "栃木", romaji: "Tochigi" },
    { code: "10", name_ja: "群馬県", name_zh: "群馬", romaji: "Gunma" },
    { code: "11", name_ja: "埼玉県", name_zh: "埼玉", romaji: "Saitama" },
    { code: "12", name_ja: "千葉県", name_zh: "千葉", romaji: "Chiba" },
    { code: "13", name_ja: "東京都", name_zh: "東京", romaji: "Tōkyō" },
    { code: "14", name_ja: "神奈川県", name_zh: "神奈川", romaji: "Kanagawa" },
  ],
  chubu: [
    { code: "15", name_ja: "新潟県", name_zh: "新潟", romaji: "Niigata" },
    { code: "16", name_ja: "富山県", name_zh: "富山", romaji: "Toyama" },
    { code: "17", name_ja: "石川県", name_zh: "石川", romaji: "Ishikawa" },
    { code: "18", name_ja: "福井県", name_zh: "福井", romaji: "Fukui" },
    { code: "19", name_ja: "山梨県", name_zh: "山梨", romaji: "Yamanashi" },
    { code: "20", name_ja: "長野県", name_zh: "長野", romaji: "Nagano" },
    { code: "21", name_ja: "岐阜県", name_zh: "岐阜", romaji: "Gifu" },
    { code: "22", name_ja: "静岡県", name_zh: "靜岡", romaji: "Shizuoka" },
    { code: "23", name_ja: "愛知県", name_zh: "愛知", romaji: "Aichi" },
  ],
  kansai: [
    { code: "24", name_ja: "三重県", name_zh: "三重", romaji: "Mie" },
    { code: "25", name_ja: "滋賀県", name_zh: "滋賀", romaji: "Shiga" },
    { code: "26", name_ja: "京都府", name_zh: "京都", romaji: "Kyōto" },
    { code: "27", name_ja: "大阪府", name_zh: "大阪", romaji: "Ōsaka" },
    { code: "28", name_ja: "兵庫県", name_zh: "兵庫", romaji: "Hyōgo" },
    { code: "29", name_ja: "奈良県", name_zh: "奈良", romaji: "Nara" },
    { code: "30", name_ja: "和歌山県", name_zh: "和歌山", romaji: "Wakayama" },
  ],
  chugoku: [
    { code: "31", name_ja: "鳥取県", name_zh: "鳥取", romaji: "Tottori" },
    { code: "32", name_ja: "島根県", name_zh: "島根", romaji: "Shimane" },
    { code: "33", name_ja: "岡山県", name_zh: "岡山", romaji: "Okayama" },
    { code: "34", name_ja: "広島県", name_zh: "廣島", romaji: "Hiroshima" },
    { code: "35", name_ja: "山口県", name_zh: "山口", romaji: "Yamaguchi" },
  ],
  shikoku: [
    { code: "36", name_ja: "徳島県", name_zh: "德島", romaji: "Tokushima" },
    { code: "37", name_ja: "香川県", name_zh: "香川", romaji: "Kagawa" },
    { code: "38", name_ja: "愛媛県", name_zh: "愛媛", romaji: "Ehime" },
    { code: "39", name_ja: "高知県", name_zh: "高知", romaji: "Kōchi" },
  ],
  kyushu: [
    { code: "40", name_ja: "福岡県", name_zh: "福岡", romaji: "Fukuoka" },
    { code: "41", name_ja: "佐賀県", name_zh: "佐賀", romaji: "Saga" },
    { code: "42", name_ja: "長崎県", name_zh: "長崎", romaji: "Nagasaki" },
    { code: "43", name_ja: "熊本県", name_zh: "熊本", romaji: "Kumamoto" },
    { code: "44", name_ja: "大分県", name_zh: "大分", romaji: "Ōita" },
    { code: "45", name_ja: "宮崎県", name_zh: "宮崎", romaji: "Miyazaki" },
    { code: "46", name_ja: "鹿児島県", name_zh: "鹿兒島", romaji: "Kagoshima" },
  ],
  okinawa: [
    { code: "47", name_ja: "沖縄県", name_zh: "沖繩", romaji: "Okinawa" },
  ],
};

// 9 大地區的展示順序(由北至南)
export const REGION_ORDER: Region[] = [
  "hokkaido",
  "tohoku",
  "kanto",
  "chubu",
  "kansai",
  "chugoku",
  "shikoku",
  "kyushu",
  "okinawa",
];

// 中文標籤 — 観光的常用書き方
export const REGION_LABEL_ZH_LONG: Record<Region, string> = {
  hokkaido: "北海道",
  tohoku: "東北",
  kanto: "關東",
  chubu: "中部",
  kansai: "關西",
  chugoku: "中國",
  shikoku: "四國",
  kyushu: "九州",
  okinawa: "沖繩",
};

export const REGION_LABEL_JA: Record<Region, string> = {
  hokkaido: "北海道",
  tohoku: "東北",
  kanto: "関東",
  chubu: "中部",
  kansai: "関西",
  chugoku: "中国",
  shikoku: "四国",
  kyushu: "九州",
  okinawa: "沖縄",
};

export const REGION_LABEL_ROMAJI: Record<Region, string> = {
  hokkaido: "Hokkaidō",
  tohoku: "Tōhoku",
  kanto: "Kantō",
  chubu: "Chūbu",
  kansai: "Kansai",
  chugoku: "Chūgoku",
  shikoku: "Shikoku",
  kyushu: "Kyūshū",
  okinawa: "Okinawa",
};

// 漢數字編號(零一 ~ 零九)— 番付・古版風
export const REGION_NUMERAL: Record<Region, string> = {
  hokkaido: "零一",
  tohoku: "零二",
  kanto: "零三",
  chubu: "零四",
  kansai: "零五",
  chugoku: "零六",
  shikoku: "零七",
  kyushu: "零八",
  okinawa: "零九",
};

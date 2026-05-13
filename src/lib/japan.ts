// Canonical 47 都道府県 with region mapping used by Yamato pricing.
// Yamato's TK.json buckets prefectures into 12 regions instead of 47 units.

export const REGIONS = [
  "北海道",
  "北東北",
  "南東北",
  "関東",
  "信越",
  "北陸",
  "中部",
  "関西",
  "中国",
  "四国",
  "九州",
  "沖縄",
] as const;

export type Region = (typeof REGIONS)[number];

export interface Prefecture {
  name: string; // e.g. "東京都"
  code: string; // JIS X 0401 2-digit (01-47), e.g. "13"
  region: Region;
  kana: string;
}

export const PREFECTURES: Prefecture[] = [
  { code: "01", name: "北海道", region: "北海道", kana: "ほっかいどう" },
  { code: "02", name: "青森県", region: "北東北", kana: "あおもりけん" },
  { code: "03", name: "岩手県", region: "北東北", kana: "いわてけん" },
  { code: "04", name: "宮城県", region: "南東北", kana: "みやぎけん" },
  { code: "05", name: "秋田県", region: "北東北", kana: "あきたけん" },
  { code: "06", name: "山形県", region: "南東北", kana: "やまがたけん" },
  { code: "07", name: "福島県", region: "南東北", kana: "ふくしまけん" },
  { code: "08", name: "茨城県", region: "関東", kana: "いばらきけん" },
  { code: "09", name: "栃木県", region: "関東", kana: "とちぎけん" },
  { code: "10", name: "群馬県", region: "関東", kana: "ぐんまけん" },
  { code: "11", name: "埼玉県", region: "関東", kana: "さいたまけん" },
  { code: "12", name: "千葉県", region: "関東", kana: "ちばけん" },
  { code: "13", name: "東京都", region: "関東", kana: "とうきょうと" },
  { code: "14", name: "神奈川県", region: "関東", kana: "かながわけん" },
  { code: "15", name: "新潟県", region: "信越", kana: "にいがたけん" },
  { code: "16", name: "富山県", region: "北陸", kana: "とやまけん" },
  { code: "17", name: "石川県", region: "北陸", kana: "いしかわけん" },
  { code: "18", name: "福井県", region: "北陸", kana: "ふくいけん" },
  { code: "19", name: "山梨県", region: "関東", kana: "やまなしけん" },
  { code: "20", name: "長野県", region: "信越", kana: "ながのけん" },
  { code: "21", name: "岐阜県", region: "中部", kana: "ぎふけん" },
  { code: "22", name: "静岡県", region: "中部", kana: "しずおかけん" },
  { code: "23", name: "愛知県", region: "中部", kana: "あいちけん" },
  { code: "24", name: "三重県", region: "中部", kana: "みえけん" },
  { code: "25", name: "滋賀県", region: "関西", kana: "しがけん" },
  { code: "26", name: "京都府", region: "関西", kana: "きょうとふ" },
  { code: "27", name: "大阪府", region: "関西", kana: "おおさかふ" },
  { code: "28", name: "兵庫県", region: "関西", kana: "ひょうごけん" },
  { code: "29", name: "奈良県", region: "関西", kana: "ならけん" },
  { code: "30", name: "和歌山県", region: "関西", kana: "わかやまけん" },
  { code: "31", name: "鳥取県", region: "中国", kana: "とっとりけん" },
  { code: "32", name: "島根県", region: "中国", kana: "しまねけん" },
  { code: "33", name: "岡山県", region: "中国", kana: "おかやまけん" },
  { code: "34", name: "広島県", region: "中国", kana: "ひろしまけん" },
  { code: "35", name: "山口県", region: "中国", kana: "やまぐちけん" },
  { code: "36", name: "徳島県", region: "四国", kana: "とくしまけん" },
  { code: "37", name: "香川県", region: "四国", kana: "かがわけん" },
  { code: "38", name: "愛媛県", region: "四国", kana: "えひめけん" },
  { code: "39", name: "高知県", region: "四国", kana: "こうちけん" },
  { code: "40", name: "福岡県", region: "九州", kana: "ふくおかけん" },
  { code: "41", name: "佐賀県", region: "九州", kana: "さがけん" },
  { code: "42", name: "長崎県", region: "九州", kana: "ながさきけん" },
  { code: "43", name: "熊本県", region: "九州", kana: "くまもとけん" },
  { code: "44", name: "大分県", region: "九州", kana: "おおいたけん" },
  { code: "45", name: "宮崎県", region: "九州", kana: "みやざきけん" },
  { code: "46", name: "鹿児島県", region: "九州", kana: "かごしまけん" },
  { code: "47", name: "沖縄県", region: "沖縄", kana: "おきなわけん" },
];

export const PREFECTURES_BY_REGION: Record<Region, Prefecture[]> = REGIONS.reduce(
  (acc, region) => {
    acc[region] = PREFECTURES.filter((p) => p.region === region);
    return acc;
  },
  {} as Record<Region, Prefecture[]>,
);

export function regionOf(prefName: string): Region | null {
  return PREFECTURES.find((p) => p.name === prefName)?.region ?? null;
}

// Sorted longest-first so 神奈川県 wins against shorter substrings (e.g. a
// stray "川県" appearing in a city name won't false-match).
const PREFECTURES_BY_NAME_LEN = [...PREFECTURES].sort(
  (a, b) => b.name.length - a.name.length,
);

// Find the first 都道府県 name that appears as a substring of `s`.
// Used to pull the prefecture out of a geocoder display_name / address field
// without needing a nearest-branch lookup.
export function findPrefectureIn(s: string | null | undefined): string | null {
  if (!s) return null;
  return PREFECTURES_BY_NAME_LEN.find((p) => s.includes(p.name))?.name ?? null;
}

// 郵便局 (ゆうパック) uses a different 11-region scheme than Yamato's 12.
// Main differences: 北東北/南東北 are merged into 東北; 中部 is split into
// 信越/北陸/東海; 山梨 stays in 関東 (per 南関東支社).
export const JP_POST_REGIONS = [
  "北海道",
  "東北",
  "関東",
  "信越",
  "北陸",
  "東海",
  "近畿",
  "中国",
  "四国",
  "九州",
  "沖縄",
] as const;

export type JpPostRegion = (typeof JP_POST_REGIONS)[number];

export const JP_POST_REGION_OF: Record<string, JpPostRegion> = {
  北海道: "北海道",
  青森県: "東北",
  岩手県: "東北",
  宮城県: "東北",
  秋田県: "東北",
  山形県: "東北",
  福島県: "東北",
  茨城県: "関東",
  栃木県: "関東",
  群馬県: "関東",
  埼玉県: "関東",
  千葉県: "関東",
  東京都: "関東",
  神奈川県: "関東",
  山梨県: "関東",
  新潟県: "信越",
  長野県: "信越",
  富山県: "北陸",
  石川県: "北陸",
  福井県: "北陸",
  岐阜県: "東海",
  静岡県: "東海",
  愛知県: "東海",
  三重県: "東海",
  滋賀県: "近畿",
  京都府: "近畿",
  大阪府: "近畿",
  兵庫県: "近畿",
  奈良県: "近畿",
  和歌山県: "近畿",
  鳥取県: "中国",
  島根県: "中国",
  岡山県: "中国",
  広島県: "中国",
  山口県: "中国",
  徳島県: "四国",
  香川県: "四国",
  愛媛県: "四国",
  高知県: "四国",
  福岡県: "九州",
  佐賀県: "九州",
  長崎県: "九州",
  熊本県: "九州",
  大分県: "九州",
  宮崎県: "九州",
  鹿児島県: "九州",
  沖縄県: "沖縄",
};

// Short-form prefecture names as they appear on ゆうパック fare pages
// (e.g. "東京" → "東京都", "大阪" → "大阪府"). 北海道 has no long form.
export const JP_POST_PREF_ALIAS: Record<string, string> = {
  北海道: "北海道",
  青森: "青森県",
  岩手: "岩手県",
  宮城: "宮城県",
  秋田: "秋田県",
  山形: "山形県",
  福島: "福島県",
  茨城: "茨城県",
  栃木: "栃木県",
  群馬: "群馬県",
  埼玉: "埼玉県",
  千葉: "千葉県",
  東京: "東京都",
  神奈川: "神奈川県",
  山梨: "山梨県",
  新潟: "新潟県",
  長野: "長野県",
  富山: "富山県",
  石川: "石川県",
  福井: "福井県",
  岐阜: "岐阜県",
  静岡: "静岡県",
  愛知: "愛知県",
  三重: "三重県",
  滋賀: "滋賀県",
  京都: "京都府",
  大阪: "大阪府",
  兵庫: "兵庫県",
  奈良: "奈良県",
  和歌山: "和歌山県",
  鳥取: "鳥取県",
  島根: "島根県",
  岡山: "岡山県",
  広島: "広島県",
  山口: "山口県",
  徳島: "徳島県",
  香川: "香川県",
  愛媛: "愛媛県",
  高知: "高知県",
  福岡: "福岡県",
  佐賀: "佐賀県",
  長崎: "長崎県",
  熊本: "熊本県",
  大分: "大分県",
  宮崎: "宮崎県",
  鹿児島: "鹿児島県",
  沖縄: "沖縄県",
};

export const PREFS_BY_JP_POST_REGION: Record<JpPostRegion, string[]> =
  JP_POST_REGIONS.reduce(
    (acc, r) => {
      acc[r] = Object.entries(JP_POST_REGION_OF)
        .filter(([, region]) => region === r)
        .map(([pref]) => pref);
      return acc;
    },
    {} as Record<JpPostRegion, string[]>,
  );

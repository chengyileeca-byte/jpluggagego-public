// Seed 長崎県 · 住類 R2 條目 → public.japan_entries(Sprint 21.2)
// 長崎都市ホテル + 諫早 + 佐世保 + 島原温泉老舗
//
// 5 筆構成:
//   1. 長崎マリオット 2024(国際ブランド最新)
//   2. グローバルビュー 2017(駅前中規模)
//   3. モントレ長崎 1995(南山手・南欧テイスト)
//   4. リッチモンド佐世保(駅前 2002)
//   5. 島原温泉 東洋館 1932(島原老舗)

import { config as loadEnv } from "dotenv";
loadEnv({ path: ".env.local" });

import { createAdminClient } from "../src/lib/supabase/admin";

const DRY = process.argv.includes("--dry-run");

type SubType =
  | "luxury_hotel"
  | "budget_hotel_chain"
  | "onsen_ryokan";

interface SeedRow {
  slug: string;
  category: "lodging";
  sub_type: SubType;
  title_zh: string;
  title_ja: string | null;
  romaji: string | null;
  summary_zh: string;
  content_md: string | null;
  region: "kyushu";
  prefecture_ja: "長崎県";
  gun_ja: string | null;
  municipality_ja: string | null;
  lg_code: string | null;
  area_types: string[];
  lat: number | null;
  lon: number | null;
  season_start: string | null;
  season_end: string | null;
  event_start: string | null;
  event_end: string | null;
  price_tier: number | null;
  booking_window_days: number | null;
  closed_days: string[];
  external_urls: Record<string, string>;
  tags: string[];
  source: "manual";
}

const rows: SeedRow[] = [
  {
    slug: "nagasaki-marriott-2024",
    category: "lodging",
    sub_type: "luxury_hotel",
    title_zh: "長崎マリオット(2024 開業・JR 長崎駅 直結・西九州新幹線時代の最新国際ブランド・207 室)",
    title_ja: "長崎マリオット",
    romaji: "Nagasaki Marriott",
    summary_zh: "**長崎マリオットは 2024 年 1 月開業の最新国際ブランドホテル**(JR 長崎駅直結 11-16 階・207 室)。マリオット系列の九州 5 番目進出、西九州新幹線開業(2022)+ 駅周辺再開発(アミュ増床+ ヒルトン 2021)に続く長崎駅前ハイエンド集積の最新参入。客室は長崎港+ 稲佐山ビュー、バー・ラウンジ・フィットネス完備。",
    content_md: "- 開業:2024 年 1 月 19 日\n- 立地:JR 長崎駅 駅ビル 11-16 階(駅直結)\n- 室数:207 室(全室 30 m² 以上)\n- ブランド:マリオット(本格 international 4 つ星)\n- 眺望:長崎港+ 稲佐山+ 三菱造船所(全室)\n- 施設:ラウンジ + バー+ レストラン+ フィットネス\n- 料金目安:¥30000-50000/泊(ツインルーム)\n- 隣接:アミュプラザ長崎+ ヒルトン長崎(2021)\n- アクセス:JR 長崎駅 直結",
    region: "kyushu",
    prefecture_ja: "長崎県",
    gun_ja: null,
    municipality_ja: "長崎市",
    lg_code: "42201",
    area_types: ["urban_central"],
    lat: 32.7544,
    lon: 129.8714,
    season_start: null,
    season_end: null,
    event_start: null,
    event_end: null,
    price_tier: 4,
    booking_window_days: 30,
    closed_days: [],
    external_urls: { official: "https://www.marriott.com/" },
    tags: ["luxury_hotel", "marriott", "2024", "station_direct", "207_rooms"],
    source: "manual",
  },
  {
    slug: "globalview-nagasaki-2017",
    category: "lodging",
    sub_type: "budget_hotel_chain",
    title_zh: "ザ・グローバルビュー長崎(2017 開業・浦上駅 1 分・原爆資料館 7 分・コスパ良駅前ホテル)",
    title_ja: "ザ・グローバルビュー長崎",
    romaji: "The Global View Nagasaki",
    summary_zh: "**ザ・グローバルビュー長崎は 2017 年開業の駅前中規模ホテル**(浦上駅 徒歩 1 分・236 室)。原爆資料館+ 平和公園エリアに立地、観光客+ 平和学習目的の宿泊客に人気。最上階展望大浴場(無料)+ 朝食ビュッフェ充実、コスパが評価高。長崎駅まで電車 5 分・路面電車 10 分。",
    content_md: "- 開業:2017 年(平成 29)\n- 立地:JR 浦上駅 徒歩 1 分(浦上電停 徒歩 5 分)\n- 室数:236 室\n- 施設:展望大浴場(最上階・無料)+ 朝食ビュッフェ+ コインランドリー\n- 料金目安:¥7000-12000/泊(ツインルーム)\n- 隣接:長崎原爆資料館(徒歩 7 分)+ 平和公園(徒歩 12 分)+ 浦上天主堂(徒歩 15 分)\n- アクセス:JR 浦上駅 徒歩 1 分(長崎駅から 1 駅・5 分)",
    region: "kyushu",
    prefecture_ja: "長崎県",
    gun_ja: null,
    municipality_ja: "長崎市",
    lg_code: "42201",
    area_types: ["urban_central"],
    lat: 32.7517,
    lon: 129.8731,
    season_start: null,
    season_end: null,
    event_start: null,
    event_end: null,
    price_tier: 2,
    booking_window_days: 14,
    closed_days: [],
    external_urls: {},
    tags: ["budget_hotel_chain", "global_view", "2017", "urakami", "236_rooms"],
    source: "manual",
  },
  {
    slug: "hotel-monterey-nagasaki-1995",
    category: "lodging",
    sub_type: "budget_hotel_chain",
    title_zh: "ホテルモントレ長崎(1995 開業・大浦居留地・南欧スタイル・洋館街並みに溶け込む 175 室)",
    title_ja: "ホテルモントレ長崎",
    romaji: "Hotel Monterey Nagasaki",
    summary_zh: "**ホテルモントレ長崎は南欧スタイルの中規模ホテル**(長崎市大浦町・1995 開業・175 室)。大浦居留地+ グラバー園周辺の洋館街並みに溶け込むデザイン、南欧調のインテリア+ 港眺望。長崎電軌「大浦海岸通り」電停 徒歩 1 分の好立地、観光客+ ビジネス両方利用。",
    content_md: "- 開業:1995 年(平成 7)\n- 立地:長崎市大浦町(居留地・グラバー園隣接)\n- 室数:175 室\n- 様式:南欧スタイル(イタリア・スペイン調)\n- 眺望:長崎港+ 三菱造船所\n- 料金目安:¥9000-14000/泊\n- 隣接:大浦天主堂(徒歩 5 分)+ グラバー園(徒歩 10 分)+ 出島(徒歩 12 分)\n- アクセス:長崎電軌「大浦海岸通り」電停 徒歩 1 分",
    region: "kyushu",
    prefecture_ja: "長崎県",
    gun_ja: null,
    municipality_ja: "長崎市",
    lg_code: "42201",
    area_types: ["urban_central"],
    lat: 32.7375,
    lon: 129.8689,
    season_start: null,
    season_end: null,
    event_start: null,
    event_end: null,
    price_tier: 2,
    booking_window_days: 14,
    closed_days: [],
    external_urls: { official: "https://www.hotelmonterey.co.jp/nagasaki/" },
    tags: ["budget_hotel_chain", "monterey", "1995", "ouratei", "south_european_style"],
    source: "manual",
  },
  {
    slug: "richmond-sasebo-2002",
    category: "lodging",
    sub_type: "budget_hotel_chain",
    title_zh: "リッチモンドホテル佐世保駅前(2002 開業・佐世保駅 1 分・四ヶ町商店街徒歩・コスパ良 234 室)",
    title_ja: "リッチモンドホテル佐世保駅前",
    romaji: "Richmond Hotel Sasebo",
    summary_zh: "**リッチモンドホテル佐世保駅前は佐世保駅徒歩 1 分の中規模ホテル**(2002 開業・234 室)。四ヶ町商店街+ 玉屋+ 5 番街+ 米軍基地+ 九十九島へ徒歩・短距離アクセス、観光+ ビジネス兼用。コスパ・朝食・立地のバランスで佐世保宿泊定番、HTB 旅行者の前後泊にも便利(JR で 30 分)。",
    content_md: "- 開業:2002 年(平成 14)\n- 立地:JR 佐世保駅 徒歩 1 分\n- 室数:234 室\n- 系列:アールエヌティーホテルズ(リッチモンド)\n- 朝食:¥1500(ビュッフェ)\n- 料金目安:¥8000-12000/泊\n- 隣接:四ヶ町商店街(徒歩 5 分)+ 玉屋(徒歩 8 分)+ 5 番街(徒歩 1 分)\n- アクセス:JR 佐世保駅 徒歩 1 分(博多から特急 2 時間)",
    region: "kyushu",
    prefecture_ja: "長崎県",
    gun_ja: null,
    municipality_ja: "佐世保市",
    lg_code: "42202",
    area_types: ["urban_central"],
    lat: 33.1614,
    lon: 129.7261,
    season_start: null,
    season_end: null,
    event_start: null,
    event_end: null,
    price_tier: 2,
    booking_window_days: 14,
    closed_days: [],
    external_urls: {},
    tags: ["budget_hotel_chain", "richmond", "2002", "sasebo_station", "234_rooms"],
    source: "manual",
  },
  {
    slug: "shimabara-toyokan-1932",
    category: "lodging",
    sub_type: "onsen_ryokan",
    title_zh: "島原温泉 東洋館(1932 創業・島原市内老舗・90 年・湧水+ 武家屋敷+ 鯉の泳ぐまち徒歩)",
    title_ja: "島原温泉 東洋館",
    romaji: "Shimabara Toyokan",
    summary_zh: "**島原温泉 東洋館は 1932 創業の島原市内老舗旅館**(90 年)。島原温泉(海岸温泉+ 雲仙地獄温泉系)+ 島原湧水(名水百選)を活かした宿、武家屋敷+ 鯉の泳ぐまち+ 島原城へ徒歩 5-10 分の街中立地。木造数寄屋風の昭和初期建築+ 大浴場+ 郷土料理「具雑煮」(島原の乱起源料理)で人気。",
    content_md: "- 創業:1932 年(昭和 7)・90 年\n- 立地:島原市新町(武家屋敷+ 鯉の泳ぐまち隣接)\n- 室数:約 20 室(中規模・木造数寄屋風)\n- 温泉:島原温泉+ 島原湧水利用\n- 料理:郷土料理「具雑煮」(島原の乱・天草四郎発祥)+ 季節地魚\n- 料金目安:¥12000-20000/泊(2 食付)\n- 隣接:武家屋敷(徒歩 3 分)+ 鯉の泳ぐまち(徒歩 5 分)+ 島原城(徒歩 10 分)\n- アクセス:島原鉄道 島原駅 徒歩 8 分",
    region: "kyushu",
    prefecture_ja: "長崎県",
    gun_ja: null,
    municipality_ja: "島原市",
    lg_code: "42203",
    area_types: ["onsen_field"],
    lat: 32.7822,
    lon: 130.3667,
    season_start: null,
    season_end: null,
    event_start: null,
    event_end: null,
    price_tier: 3,
    booking_window_days: 14,
    closed_days: [],
    external_urls: {},
    tags: ["onsen_ryokan", "toyokan", "1932", "shimabara_yusui", "gu_zoni"],
    source: "manual",
  },
];

async function main() {
  if (rows.length === 0) {
    console.log("[nagasaki-lodging-r2] 尚無條目");
    return;
  }
  console.log(`[nagasaki-lodging-r2] ${rows.length} 筆 ${DRY ? "(dry-run)" : ""}`);
  if (DRY) return;
  const sb = createAdminClient();
  const { error } = await sb.from("japan_entries").upsert(rows, { onConflict: "slug" });
  if (error) {
    console.error("[nagasaki-lodging-r2] upsert failed:", error);
    process.exit(1);
  }
  console.log(`[nagasaki-lodging-r2] Done — ${rows.length} rows.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

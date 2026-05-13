// Seed 兵庫県 · 住類 條目 → public.japan_entries(Sprint 18.2 住 R1)
//
// 兵庫の住類軸:
//   - 神戸ラグジュアリー(8):オークラ + ANA + ベイシェラトン + メリケンパーク + ポートピア + 北野 + ラスイート + 三井ガーデン
//   - 神戸ビジネス(4):アパ + 東横 + ドーミー + リッチモンド
//   - 城崎温泉(1300 年・4):三木屋 1781 志賀直哉舞台 + 西村屋本館 1858 + 招月庭 + 三国屋 1851
//   - 有馬温泉(日本三古湯・5):御所坊 1191 830 年余 + 兵衛向陽閣 1587 秀吉時代 + 中の坊瑞苑 + 月光園 + グランドホテル
//   - 姫路(3):モントレ姫路 + 日航姫路 + アパ姫路
//   - 淡路リゾート(2):ウェスティン 2024 + ニューアワジ 1976
//   - 宝塚 + 西宮(2):宝塚ホテル 1926 阪急系 + ヒューイット甲子園
//   - 湯村温泉(1):朝野家 1300 年余
//
// 嚴格定義:全部具体ホテル・旅館・リゾート・実在物件のみ。
//
// 29 筆構成
//
// Usage:
//   npm run seed:japan-hyogo-lodging:dry
//   npm run seed:japan-hyogo-lodging

import { config as loadEnv } from "dotenv";
loadEnv({ path: ".env.local" });

import { createAdminClient } from "../src/lib/supabase/admin";

const DRY = process.argv.includes("--dry-run");

type SubType =
  | "international_luxury"
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
  region: "kansai";
  prefecture_ja: "兵庫県";
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
  // ══════════════════════════════════════════════════════════════════
  // A. 神戸ラグジュアリー(8 筆)
  // ══════════════════════════════════════════════════════════════════
  {
    slug: "okura-kobe-1989",
    category: "lodging",
    sub_type: "international_luxury",
    title_zh: "ホテルオークラ神戸(1989・メリケン波止場・35F・神戸港絶景)",
    title_ja: "ホテルオークラ神戸",
    romaji: "Hotel Okura Kobe",
    summary_zh:
      "1989 中央区波止場町(メリケンパーク北)に開業のオークラ系国際ラグジュアリー。35F・475 室。神戸開港 120 周年記念で建設,神戸港 + 六甲山系 + 大阪湾の絶景。1995 阪神淡路大震災時の臨時災害本部。1 泊 ¥30000-100000。",
    content_md:
      "- 開業:1989\n- 立地:メリケンパーク北\n- 客室:475 室・35F\n- 1995 震災災害本部\n- 1 泊:¥30000-100000\n- 2026-04 人工查核",
    region: "kansai",
    prefecture_ja: "兵庫県",
    gun_ja: null,
    municipality_ja: "神戸市",
    lg_code: "28100",
    area_types: ["urban_central", "coastal"],
    lat: 34.683,
    lon: 135.187,
    season_start: null,
    season_end: null,
    event_start: null,
    event_end: null,
    price_tier: 4,
    booking_window_days: 90,
    closed_days: [],
    external_urls: { official: "https://www.kobe.hotelokura.co.jp/" },
    tags: ["luxury", "okura", "kobe", "since_1989", "meriken_park"],
    source: "manual",
  },
  {
    slug: "ana-crowne-plaza-kobe-1990",
    category: "lodging",
    sub_type: "international_luxury",
    title_zh: "ANA クラウンプラザホテル神戸(1990・三宮・35F・新神戸駅直結)",
    title_ja: "ANA クラウンプラザホテル神戸",
    romaji: "ANA Crowne Plaza Kobe",
    summary_zh:
      "1990 新神戸駅併設 35F・600 室の国際ラグジュアリー。1990 開業時は神戸ホテルオークラ別館だったが 2010 IHG クラウンプラザブランド統合。新神戸駅直結で新幹線アクセス + 北野異人館街徒歩 7 分。1 泊 ¥18000-50000。",
    content_md:
      "- 開業:1990(2010 クラウンプラザ統合)\n- 立地:新神戸駅直結\n- 客室:600 室・35F\n- 北野異人館徒歩 7 分\n- 1 泊:¥18000-50000\n- 2026-04 人工查核",
    region: "kansai",
    prefecture_ja: "兵庫県",
    gun_ja: null,
    municipality_ja: "神戸市",
    lg_code: "28100",
    area_types: ["urban_central"],
    lat: 34.703,
    lon: 135.203,
    season_start: null,
    season_end: null,
    event_start: null,
    event_end: null,
    price_tier: 4,
    booking_window_days: 60,
    closed_days: [],
    external_urls: { official: "https://www.anacrowneplaza-kobe.jp/" },
    tags: ["luxury", "ana_crowne", "kobe", "since_1990", "shin_kobe"],
    source: "manual",
  },
  {
    slug: "bay-sheraton-kobe-1992",
    category: "lodging",
    sub_type: "international_luxury",
    title_zh: "神戸ベイシェラトンホテル&タワーズ(1992・六甲アイランド・19F)",
    title_ja: "神戸ベイシェラトンホテル&タワーズ",
    romaji: "Kobe Bay Sheraton Hotel & Towers",
    summary_zh:
      "1992 神戸市東灘区六甲アイランド(人工島)に開業の Sheraton 系国際ラグジュアリー。19F・270 室。六甲アイランド国際会議場 + ファッション博物館隣接。神戸ベイ + 大阪湾 + 六甲山系の絶景。1 泊 ¥18000-45000。",
    content_md:
      "- 開業:1992\n- 立地:六甲アイランド\n- 客室:270 室・19F\n- 国際会議場 + ファッション博物館隣接\n- 1 泊:¥18000-45000\n- 2026-04 人工查核",
    region: "kansai",
    prefecture_ja: "兵庫県",
    gun_ja: null,
    municipality_ja: "神戸市",
    lg_code: "28100",
    area_types: ["urban", "coastal"],
    lat: 34.701,
    lon: 135.288,
    season_start: null,
    season_end: null,
    event_start: null,
    event_end: null,
    price_tier: 4,
    booking_window_days: 60,
    closed_days: [],
    external_urls: { official: "https://www.kobebs.com/" },
    tags: ["luxury", "sheraton", "kobe", "since_1992", "rokko_island"],
    source: "manual",
  },
  {
    slug: "meriken-park-oriental-1995",
    category: "lodging",
    sub_type: "luxury_hotel",
    title_zh: "神戸メリケンパークオリエンタルホテル(1995・客船型建築・神戸港絶景)",
    title_ja: "神戸メリケンパークオリエンタルホテル",
    romaji: "Kobe Meriken Park Oriental Hotel",
    summary_zh:
      "1995 中央区波止場町(メリケンパーク先端)に開業の客船型建築ホテル。9F・320 室。1995 阪神淡路大震災で旧館全壊・1996 現館再建。日本初の港に突き出す『客船デザイン』ホテル。神戸港 + 中突堤 + 大阪湾 360 度ビュー。1 泊 ¥18000-45000。",
    content_md:
      "- 開業:1995(現館 1996 再建)\n- 立地:メリケンパーク先端\n- 客室:320 室・9F\n- 客船型建築\n- 360 度港ビュー\n- 1 泊:¥18000-45000\n- 2026-04 人工查核",
    region: "kansai",
    prefecture_ja: "兵庫県",
    gun_ja: null,
    municipality_ja: "神戸市",
    lg_code: "28100",
    area_types: ["urban_central", "coastal"],
    lat: 34.679,
    lon: 135.190,
    season_start: null,
    season_end: null,
    event_start: null,
    event_end: null,
    price_tier: 4,
    booking_window_days: 60,
    closed_days: [],
    external_urls: { official: "https://www.kobe-orientalhotel.co.jp/" },
    tags: ["luxury", "oriental", "meriken_park", "since_1995", "ship_design"],
    source: "manual",
  },
  {
    slug: "portopia-hotel-kobe-1981",
    category: "lodging",
    sub_type: "luxury_hotel",
    title_zh: "神戸ポートピアホテル(1981・ポートアイランド・31F・神戸最古ベイホテル)",
    title_ja: "神戸ポートピアホテル",
    romaji: "Kobe Portopia Hotel",
    summary_zh:
      "1981 ポートアイランド(神戸初の人工島)に開業した神戸最古ベイエリアホテル。1981 神戸ポートピア博覧会同時開業で 1700 万人来場の象徴ホテル。31F・736 室の関西最大級。三宮駅からポートライナーで 8 分。1 泊 ¥15000-35000。",
    content_md:
      "- 開業:1981(神戸ポートピア博覧会同時)\n- 立地:ポートアイランド\n- 客室:736 室・31F(関西最大級)\n- 三宮からポートライナー 8 分\n- 1 泊:¥15000-35000\n- 2026-04 人工查核",
    region: "kansai",
    prefecture_ja: "兵庫県",
    gun_ja: null,
    municipality_ja: "神戸市",
    lg_code: "28100",
    area_types: ["urban", "coastal"],
    lat: 34.665,
    lon: 135.215,
    season_start: null,
    season_end: null,
    event_start: null,
    event_end: null,
    price_tier: 3,
    booking_window_days: 60,
    closed_days: [],
    external_urls: { official: "https://www.portopia.co.jp/" },
    tags: ["luxury", "portopia", "since_1981", "port_island", "expo_1981"],
    source: "manual",
  },
  {
    slug: "kobe-kitano-hotel-1998",
    category: "lodging",
    sub_type: "luxury_hotel",
    title_zh: "神戸北野ホテル(1998・北野異人館街・小型ブティック)",
    title_ja: "神戸北野ホテル",
    romaji: "Kobe Kitano Hotel",
    summary_zh:
      "1998 北野異人館街に開業の小型ブティックホテル。30 室の客室全て異なる内装で,北野洋館の雰囲気を再現。山口浩シェフのフレンチが看板で,『世界一の朝食』の称号を獲得。神戸三宮駅徒歩 15 分。1 泊 ¥35000-80000。",
    content_md:
      "- 開業:1998\n- 立地:北野異人館街\n- 客室:30 室(全室個性内装)\n- 山口浩シェフ・世界一の朝食\n- 1 泊:¥35000-80000\n- 2026-04 人工查核",
    region: "kansai",
    prefecture_ja: "兵庫県",
    gun_ja: null,
    municipality_ja: "神戸市",
    lg_code: "28100",
    area_types: ["urban_central"],
    lat: 34.700,
    lon: 135.190,
    season_start: null,
    season_end: null,
    event_start: null,
    event_end: null,
    price_tier: 4,
    booking_window_days: 60,
    closed_days: [],
    external_urls: { official: "https://www.kobe-kitanohotel.co.jp/" },
    tags: ["boutique", "kitano", "since_1998", "michelin_breakfast"],
    source: "manual",
  },
  {
    slug: "la-suite-kobe-2009",
    category: "lodging",
    sub_type: "luxury_hotel",
    title_zh: "ホテルラスイート神戸ハーバーランド(2009・全室スイート・神戸港夜景)",
    title_ja: "ホテルラスイート神戸ハーバーランド",
    romaji: "Hotel La Suite Kobe Harborland",
    summary_zh:
      "2009 神戸ハーバーランドに開業のオールスイートホテル。70 室全室スイート(58 ㎡以上)で関西最高級ベイビュー。神戸ハーバーランド徒歩 1 分・神戸ポートタワー + メリケンパーク間近。1 泊 ¥40000-100000。",
    content_md:
      "- 開業:2009\n- 立地:ハーバーランド\n- 客室:70 室・全室スイート(58 ㎡+)\n- 神戸ポートタワー直近\n- 1 泊:¥40000-100000\n- 2026-04 人工查核",
    region: "kansai",
    prefecture_ja: "兵庫県",
    gun_ja: null,
    municipality_ja: "神戸市",
    lg_code: "28100",
    area_types: ["urban_central", "coastal"],
    lat: 34.679,
    lon: 135.183,
    season_start: null,
    season_end: null,
    event_start: null,
    event_end: null,
    price_tier: 4,
    booking_window_days: 60,
    closed_days: [],
    external_urls: { official: "https://www.l-s.jp/" },
    tags: ["luxury", "la_suite", "harborland", "since_2009", "all_suite"],
    source: "manual",
  },
  {
    slug: "mitsui-garden-kobe-sannomiya-2008",
    category: "lodging",
    sub_type: "luxury_hotel",
    title_zh: "三井ガーデンホテル神戸三宮(2008・三宮駅前・三井ガーデン関西展開)",
    title_ja: "三井ガーデンホテル神戸三宮",
    romaji: "Mitsui Garden Hotel Kobe Sannomiya",
    summary_zh:
      "2008 神戸三宮駅前に開業の三井ガーデン系ミドルクラス。15F・260 室。三宮駅徒歩 3 分・北野異人館街徒歩 10 分・南京町徒歩 10 分の好立地。1 泊 ¥10000-22000。",
    content_md:
      "- 開業:2008\n- 立地:三宮駅徒歩 3 分\n- 客室:260 室・15F\n- 1 泊:¥10000-22000\n- 2026-04 人工查核",
    region: "kansai",
    prefecture_ja: "兵庫県",
    gun_ja: null,
    municipality_ja: "神戸市",
    lg_code: "28100",
    area_types: ["urban_central"],
    lat: 34.694,
    lon: 135.196,
    season_start: null,
    season_end: null,
    event_start: null,
    event_end: null,
    price_tier: 3,
    booking_window_days: 60,
    closed_days: [],
    external_urls: {},
    tags: ["mid_class", "mitsui_garden", "kobe", "since_2008"],
    source: "manual",
  },

  // ══════════════════════════════════════════════════════════════════
  // B. 神戸ビジネス(4 筆)
  // ══════════════════════════════════════════════════════════════════
  {
    slug: "dormy-inn-kobe-motomachi",
    category: "lodging",
    sub_type: "budget_hotel_chain",
    title_zh: "ドーミーイン神戸元町(元町駅前・天然温泉付ビジネス)",
    title_ja: "ドーミーイン神戸元町",
    romaji: "Dormy Inn Kobe Motomachi",
    summary_zh:
      "JR 元町駅徒歩 1 分のドーミーイン神戸元町。13F・220 室。地下 1500 m から汲上の天然温泉大浴場 + 夜鳴きそば無料。元町商店街 + 南京町 + メリケンパーク徒歩圏。1 泊 ¥10000-18000。",
    content_md:
      "- 立地:JR 元町駅徒歩 1 分\n- 客室:220 室・13F\n- 天然温泉大浴場\n- 夜鳴きそば無料\n- 1 泊:¥10000-18000\n- 2026-04 人工查核",
    region: "kansai",
    prefecture_ja: "兵庫県",
    gun_ja: null,
    municipality_ja: "神戸市",
    lg_code: "28100",
    area_types: ["urban_central"],
    lat: 34.689,
    lon: 135.190,
    season_start: null,
    season_end: null,
    event_start: null,
    event_end: null,
    price_tier: 2,
    booking_window_days: 30,
    closed_days: [],
    external_urls: {},
    tags: ["budget", "dormy_inn", "motomachi", "natural_onsen"],
    source: "manual",
  },
  {
    slug: "apa-hotel-kobe-sannomiya",
    category: "lodging",
    sub_type: "budget_hotel_chain",
    title_zh: "アパホテル&リゾート神戸三宮(三宮駅前・大型アパ・温泉大浴場)",
    title_ja: "アパホテル&リゾート神戸三宮",
    romaji: "APA Hotel & Resort Kobe Sannomiya",
    summary_zh:
      "JR 三宮駅徒歩 5 分の大型アパホテル。31F・1066 室の関西最大級アパ。屋上に温泉大浴場併設。神戸三宮 + 北野 + 元町 + 南京町すべて徒歩圏。1 泊 ¥9000-18000。",
    content_md:
      "- 立地:JR 三宮駅徒歩 5 分\n- 客室:1066 室・31F(関西最大級アパ)\n- 屋上温泉大浴場\n- 1 泊:¥9000-18000\n- 2026-04 人工查核",
    region: "kansai",
    prefecture_ja: "兵庫県",
    gun_ja: null,
    municipality_ja: "神戸市",
    lg_code: "28100",
    area_types: ["urban_central"],
    lat: 34.692,
    lon: 135.197,
    season_start: null,
    season_end: null,
    event_start: null,
    event_end: null,
    price_tier: 2,
    booking_window_days: 30,
    closed_days: [],
    external_urls: {},
    tags: ["budget", "apa", "sannomiya", "onsen_bath"],
    source: "manual",
  },
  {
    slug: "toyoko-inn-kobe-sannomiya",
    category: "lodging",
    sub_type: "budget_hotel_chain",
    title_zh: "東横イン神戸三ノ宮 1(三宮駅前・全国チェーン関西旗艦)",
    title_ja: "東横イン神戸三ノ宮 1",
    romaji: "Toyoko Inn Kobe Sannomiya",
    summary_zh:
      "JR 三宮駅徒歩 3 分の東横イン神戸三ノ宮 1。9F・150 室。全室 Wi-Fi + 朝食バイキング無料。会員割引で 1 泊 ¥6500-9500。",
    content_md:
      "- 立地:JR 三宮駅徒歩 3 分\n- 客室:150 室・9F\n- 朝食バイキング無料\n- 1 泊:¥6500-9500\n- 2026-04 人工查核",
    region: "kansai",
    prefecture_ja: "兵庫県",
    gun_ja: null,
    municipality_ja: "神戸市",
    lg_code: "28100",
    area_types: ["urban_central"],
    lat: 34.694,
    lon: 135.197,
    season_start: null,
    season_end: null,
    event_start: null,
    event_end: null,
    price_tier: 2,
    booking_window_days: 30,
    closed_days: [],
    external_urls: { official: "https://www.toyoko-inn.com/" },
    tags: ["budget", "toyoko_inn", "sannomiya", "free_breakfast"],
    source: "manual",
  },
  {
    slug: "richmond-hotel-kobe-2010",
    category: "lodging",
    sub_type: "budget_hotel_chain",
    title_zh: "リッチモンドホテル神戸三宮(2010・三宮駅前・ロイヤルパインズ系)",
    title_ja: "リッチモンドホテル神戸三宮",
    romaji: "Richmond Hotel Kobe Sannomiya",
    summary_zh:
      "2010 三宮駅前に開業のリッチモンドホテル系ミドル。15F・232 室。1 泊 ¥9000-16000。",
    content_md:
      "- 開業:2010\n- 立地:三宮駅徒歩 5 分\n- 客室:232 室・15F\n- 1 泊:¥9000-16000\n- 2026-04 人工查核",
    region: "kansai",
    prefecture_ja: "兵庫県",
    gun_ja: null,
    municipality_ja: "神戸市",
    lg_code: "28100",
    area_types: ["urban_central"],
    lat: 34.694,
    lon: 135.196,
    season_start: null,
    season_end: null,
    event_start: null,
    event_end: null,
    price_tier: 2,
    booking_window_days: 30,
    closed_days: [],
    external_urls: {},
    tags: ["budget", "richmond", "sannomiya", "since_2010"],
    source: "manual",
  },

  // ══════════════════════════════════════════════════════════════════
  // C. 城崎温泉旅館(1300 年・4 筆)
  // ══════════════════════════════════════════════════════════════════
  {
    slug: "mikiya-kinosaki-1781",
    category: "lodging",
    sub_type: "onsen_ryokan",
    title_zh: "三木屋(城崎温泉・1781 創業・志賀直哉『城の崎にて』舞台)",
    title_ja: "三木屋",
    romaji: "Mikiya",
    summary_zh:
      "1781 城崎温泉湯島街に創業の老舗旅館。240 年余の歴史で,志賀直哉が 1913 山手線事故後の療養で滞在し『城の崎にて』(1917)執筆の舞台。文学愛好家の聖地。木造 3 階建の伝統旅館建築 + 全室 14 室の小さい規模。1 泊 ¥18000-35000。",
    content_md:
      "- 創業:1781\n- 立地:城崎温泉湯島街\n- 志賀直哉『城の崎にて』(1917)舞台\n- 木造 3 階・14 室\n- 1 泊:¥18000-35000\n- 2026-04 人工查核",
    region: "kansai",
    prefecture_ja: "兵庫県",
    gun_ja: null,
    municipality_ja: "豊岡市",
    lg_code: "28209",
    area_types: ["rural"],
    lat: 35.624,
    lon: 134.808,
    season_start: null,
    season_end: null,
    event_start: null,
    event_end: null,
    price_tier: 4,
    booking_window_days: 60,
    closed_days: [],
    external_urls: { official: "https://kinosaki-mikiya.jp/" },
    tags: ["onsen_ryokan", "mikiya", "kinosaki", "since_1781", "shiga_naoya"],
    source: "manual",
  },
  {
    slug: "nishimuraya-honkan-1858",
    category: "lodging",
    sub_type: "onsen_ryokan",
    title_zh: "西村屋本館(城崎温泉・1858 創業・最高級老舗・国登録文化財)",
    title_ja: "西村屋本館",
    romaji: "Nishimuraya Honkan",
    summary_zh:
      "1858 城崎温泉湯島街に創業の最高級老舗旅館。160 年余の歴史で本館は登録有形文化財(明治期木造 3 階建)。皇室献上料理の碩儒文化 + 最高級懐石。35 室・全室異なる内装。1 泊 ¥40000-100000。",
    content_md:
      "- 創業:1858\n- 立地:城崎温泉湯島街\n- 本館:登録有形文化財(明治期)\n- 客室:35 室\n- 1 泊:¥40000-100000\n- 2026-04 人工查核",
    region: "kansai",
    prefecture_ja: "兵庫県",
    gun_ja: null,
    municipality_ja: "豊岡市",
    lg_code: "28209",
    area_types: ["rural"],
    lat: 35.624,
    lon: 134.808,
    season_start: null,
    season_end: null,
    event_start: null,
    event_end: null,
    price_tier: 4,
    booking_window_days: 60,
    closed_days: [],
    external_urls: { official: "https://nishimuraya.ne.jp/honkan/" },
    tags: ["onsen_ryokan", "nishimuraya", "kinosaki", "since_1858", "登録文化財"],
    source: "manual",
  },
  {
    slug: "nishimuraya-shogetsuken",
    category: "lodging",
    sub_type: "onsen_ryokan",
    title_zh: "西村屋ホテル招月庭(西村屋系別館・現代和風 + 大温泉 + 庭園 4 万㎡)",
    title_ja: "西村屋ホテル招月庭",
    romaji: "Nishimuraya Hotel Shōgetsutei",
    summary_zh:
      "西村屋本館の現代別館。1992 城崎温泉外側に開業し,4 万㎡の日本庭園 + 大温泉 + 86 室の大型旅館。本館の伝統を継承しつつ家族 + 団体客向け。1 泊 ¥25000-60000。",
    content_md:
      "- 開業:1992\n- 客室:86 室\n- 4 万㎡日本庭園\n- 大温泉\n- 1 泊:¥25000-60000\n- 2026-04 人工查核",
    region: "kansai",
    prefecture_ja: "兵庫県",
    gun_ja: null,
    municipality_ja: "豊岡市",
    lg_code: "28209",
    area_types: ["rural"],
    lat: 35.623,
    lon: 134.809,
    season_start: null,
    season_end: null,
    event_start: null,
    event_end: null,
    price_tier: 4,
    booking_window_days: 60,
    closed_days: [],
    external_urls: { official: "https://nishimuraya.ne.jp/shogetsu/" },
    tags: ["onsen_ryokan", "nishimuraya", "shogetsutei", "since_1992", "garden"],
    source: "manual",
  },
  {
    slug: "mikuniya-kinosaki-1851",
    category: "lodging",
    sub_type: "onsen_ryokan",
    title_zh: "三国屋(城崎温泉・1851 創業・175 年余・但馬牛会席)",
    title_ja: "三国屋",
    romaji: "Mikuniya",
    summary_zh:
      "1851 城崎温泉湯島街に創業の老舗旅館。175 年余の歴史で,但馬牛会席 + カニ会席で名高い。木造 3 階建 + 露天風呂付客室。1 泊 ¥20000-40000。",
    content_md:
      "- 創業:1851\n- 立地:城崎温泉湯島街\n- 但馬牛会席\n- 木造 3 階・露天風呂付客室\n- 1 泊:¥20000-40000\n- 2026-04 人工查核",
    region: "kansai",
    prefecture_ja: "兵庫県",
    gun_ja: null,
    municipality_ja: "豊岡市",
    lg_code: "28209",
    area_types: ["rural"],
    lat: 35.624,
    lon: 134.806,
    season_start: null,
    season_end: null,
    event_start: null,
    event_end: null,
    price_tier: 4,
    booking_window_days: 60,
    closed_days: [],
    external_urls: {},
    tags: ["onsen_ryokan", "mikuniya", "kinosaki", "since_1851", "tajima_beef"],
    source: "manual",
  },

  // ══════════════════════════════════════════════════════════════════
  // D. 有馬温泉(日本三古湯・5 筆)
  // ══════════════════════════════════════════════════════════════════
  {
    slug: "goshobo-arima-1191",
    category: "lodging",
    sub_type: "onsen_ryokan",
    title_zh: "御所坊(有馬温泉・1191 創業・830 年余・日本最古級旅館)",
    title_ja: "御所坊",
    romaji: "Goshobō",
    summary_zh:
      "1191(建久 2 年)創業の有馬温泉の最古級旅館。830 年余の歴史で,慶長期(1596-1615)豐臣秀吉も滞在。法皇御所として後白河法皇 + 鎌倉将軍家にも献上。19 室の小さな規模で,有馬温泉文化の核心。1 泊 ¥40000-80000。",
    content_md:
      "- 創業:1191(建久 2 年)\n- 830 年余の歴史\n- 後白河法皇 + 豐臣秀吉滞在地\n- 客室:19 室\n- 1 泊:¥40000-80000\n- 2026-04 人工查核",
    region: "kansai",
    prefecture_ja: "兵庫県",
    gun_ja: null,
    municipality_ja: "神戸市",
    lg_code: "28100",
    area_types: ["mountain"],
    lat: 34.798,
    lon: 135.247,
    season_start: null,
    season_end: null,
    event_start: null,
    event_end: null,
    price_tier: 4,
    booking_window_days: 60,
    closed_days: [],
    external_urls: { official: "https://www.goshoboh.com/" },
    tags: ["onsen_ryokan", "goshobo", "arima", "since_1191", "oldest_japan"],
    source: "manual",
  },
  {
    slug: "hyoe-koyokaku-1587",
    category: "lodging",
    sub_type: "onsen_ryokan",
    title_zh: "兵衛向陽閣(有馬温泉・1587 創業・豊臣秀吉時代・有馬最大級)",
    title_ja: "兵衛向陽閣",
    romaji: "Hyōe Kōyōkaku",
    summary_zh:
      "1587(天正 15 年)有馬温泉に創業の老舗旅館。豐臣秀吉が有馬温泉再興時に常用した宿の流れを汲む。15F・約 130 室の有馬最大級旅館。3 つの大浴場 + 露天 + サウナ。1 泊 ¥25000-60000。",
    content_md:
      "- 創業:1587(豊臣秀吉時代)\n- 客室:130 室・15F(有馬最大級)\n- 大浴場 3 + 露天 + サウナ\n- 1 泊:¥25000-60000\n- 2026-04 人工查核",
    region: "kansai",
    prefecture_ja: "兵庫県",
    gun_ja: null,
    municipality_ja: "神戸市",
    lg_code: "28100",
    area_types: ["mountain"],
    lat: 34.798,
    lon: 135.246,
    season_start: null,
    season_end: null,
    event_start: null,
    event_end: null,
    price_tier: 4,
    booking_window_days: 60,
    closed_days: [],
    external_urls: { official: "https://www.hyoe.co.jp/" },
    tags: ["onsen_ryokan", "hyoe", "arima", "since_1587", "hideyoshi"],
    source: "manual",
  },
  {
    slug: "nakanobou-zuien-arima",
    category: "lodging",
    sub_type: "onsen_ryokan",
    title_zh: "中の坊瑞苑(有馬温泉・有馬最高級・全室温泉付・大人専用)",
    title_ja: "中の坊瑞苑",
    romaji: "Nakanobō Zuien",
    summary_zh:
      "1898 有馬温泉に開業の老舗旅館。25 室の小規模で大人専用(中学生未満不可)。全室温泉風呂付 + 露天風呂付。最高級懐石 + 但馬牛会席。1 泊 ¥45000-100000。",
    content_md:
      "- 開業:1898\n- 客室:25 室(大人専用)\n- 全室温泉付\n- 1 泊:¥45000-100000\n- 2026-04 人工查核",
    region: "kansai",
    prefecture_ja: "兵庫県",
    gun_ja: null,
    municipality_ja: "神戸市",
    lg_code: "28100",
    area_types: ["mountain"],
    lat: 34.799,
    lon: 135.247,
    season_start: null,
    season_end: null,
    event_start: null,
    event_end: null,
    price_tier: 4,
    booking_window_days: 60,
    closed_days: [],
    external_urls: { official: "https://www.zuien.jp/" },
    tags: ["onsen_ryokan", "nakanobou", "zuien", "arima", "adult_only"],
    source: "manual",
  },
  {
    slug: "gekkoen-kokorokan-arima-1955",
    category: "lodging",
    sub_type: "onsen_ryokan",
    title_zh: "月光園鴻朧館(有馬温泉・1955 創業・金泉 + 銀泉 2 種温泉付)",
    title_ja: "月光園鴻朧館",
    romaji: "Gekkōen Kokorōkan",
    summary_zh:
      "1955 有馬温泉に開業の老舗旅館『月光園』の本館。有馬の金泉(鉄分含赤褐色)+ 銀泉(炭酸泉)2 種類の温泉が両方使える希少旅館。100 室の中規模。姉妹館『游月山荘』隣接。1 泊 ¥25000-55000。",
    content_md:
      "- 開業:1955\n- 客室:100 室\n- 金泉 + 銀泉 2 種温泉\n- 姉妹館:游月山荘\n- 1 泊:¥25000-55000\n- 2026-04 人工查核",
    region: "kansai",
    prefecture_ja: "兵庫県",
    gun_ja: null,
    municipality_ja: "神戸市",
    lg_code: "28100",
    area_types: ["mountain"],
    lat: 34.799,
    lon: 135.245,
    season_start: null,
    season_end: null,
    event_start: null,
    event_end: null,
    price_tier: 4,
    booking_window_days: 60,
    closed_days: [],
    external_urls: { official: "https://www.gekkoen.co.jp/" },
    tags: ["onsen_ryokan", "gekkoen", "arima", "since_1955", "kinsen_ginsen"],
    source: "manual",
  },
  {
    slug: "arima-grand-hotel-1985",
    category: "lodging",
    sub_type: "luxury_hotel",
    title_zh: "有馬グランドホテル(1985・有馬温泉最大級・150 室)",
    title_ja: "有馬グランドホテル",
    romaji: "Arima Grand Hotel",
    summary_zh:
      "1985 有馬温泉中心に開業の最大級ホテル。9F・150 室。家族 + 団体客向けの大型施設で,展望温泉 + バイキング。神戸市内 → バス 30 分の温泉 1 泊コース定番。1 泊 ¥18000-40000。",
    content_md:
      "- 開業:1985\n- 客室:150 室・9F\n- 展望温泉 + バイキング\n- 神戸からバス 30 分\n- 1 泊:¥18000-40000\n- 2026-04 人工查核",
    region: "kansai",
    prefecture_ja: "兵庫県",
    gun_ja: null,
    municipality_ja: "神戸市",
    lg_code: "28100",
    area_types: ["mountain"],
    lat: 34.797,
    lon: 135.244,
    season_start: null,
    season_end: null,
    event_start: null,
    event_end: null,
    price_tier: 3,
    booking_window_days: 60,
    closed_days: [],
    external_urls: { official: "https://www.arima-gh.jp/" },
    tags: ["luxury", "arima_grand", "since_1985", "max_arima"],
    source: "manual",
  },

  // ══════════════════════════════════════════════════════════════════
  // E. 姫路ホテル(3 筆)
  // ══════════════════════════════════════════════════════════════════
  {
    slug: "hotel-monterey-himeji-2008",
    category: "lodging",
    sub_type: "luxury_hotel",
    title_zh: "ホテルモントレ姫路(2008・JR 姫路駅前・南欧風建築)",
    title_ja: "ホテルモントレ姫路",
    romaji: "Hotel Monterey Himeji",
    summary_zh:
      "2008 JR 姫路駅前に開業のホテルモントレ系。13F・206 室。南欧風建築 + インテリアで,姫路城観光のベース。姫路城天守閣徒歩 15 分。1 泊 ¥10000-22000。",
    content_md:
      "- 開業:2008\n- 立地:JR 姫路駅前\n- 客室:206 室・13F\n- 様式:南欧風\n- 姫路城徒歩 15 分\n- 1 泊:¥10000-22000\n- 2026-04 人工查核",
    region: "kansai",
    prefecture_ja: "兵庫県",
    gun_ja: null,
    municipality_ja: "姫路市",
    lg_code: "28201",
    area_types: ["urban"],
    lat: 34.832,
    lon: 134.692,
    season_start: null,
    season_end: null,
    event_start: null,
    event_end: null,
    price_tier: 3,
    booking_window_days: 60,
    closed_days: [],
    external_urls: { official: "https://www.hotelmonterey.co.jp/himeji/" },
    tags: ["mid_class", "monterey", "himeji", "since_2008"],
    source: "manual",
  },
  {
    slug: "hotel-nikko-himeji-1995",
    category: "lodging",
    sub_type: "luxury_hotel",
    title_zh: "ホテル日航姫路(1995・JR 姫路駅前・JAL 系・姫路最高級)",
    title_ja: "ホテル日航姫路",
    romaji: "Hotel Nikko Himeji",
    summary_zh:
      "1995 JR 姫路駅前に開業の JAL 系。9F・254 室。姫路駅徒歩 1 分・姫路城徒歩 15 分・姫路最高級ホテル。家族 + ビジネス両用。1 泊 ¥12000-25000。",
    content_md:
      "- 開業:1995\n- 立地:JR 姫路駅前\n- 客室:254 室・9F\n- 姫路最高級\n- 1 泊:¥12000-25000\n- 2026-04 人工查核",
    region: "kansai",
    prefecture_ja: "兵庫県",
    gun_ja: null,
    municipality_ja: "姫路市",
    lg_code: "28201",
    area_types: ["urban"],
    lat: 34.832,
    lon: 134.690,
    season_start: null,
    season_end: null,
    event_start: null,
    event_end: null,
    price_tier: 3,
    booking_window_days: 60,
    closed_days: [],
    external_urls: {},
    tags: ["luxury", "nikko", "himeji", "since_1995"],
    source: "manual",
  },
  {
    slug: "apa-himeji-ekimae",
    category: "lodging",
    sub_type: "budget_hotel_chain",
    title_zh: "アパホテル姫路駅北(姫路駅徒歩 3 分・温泉大浴場付)",
    title_ja: "アパホテル姫路駅北",
    romaji: "APA Hotel Himeji-Eki Kita",
    summary_zh:
      "姫路駅北口徒歩 3 分のアパホテル。13F・250 室。屋上温泉大浴場付。姫路城観光 + ビジネス両用。1 泊 ¥7000-13000。",
    content_md:
      "- 立地:姫路駅北口徒歩 3 分\n- 客室:250 室・13F\n- 屋上温泉大浴場\n- 1 泊:¥7000-13000\n- 2026-04 人工查核",
    region: "kansai",
    prefecture_ja: "兵庫県",
    gun_ja: null,
    municipality_ja: "姫路市",
    lg_code: "28201",
    area_types: ["urban"],
    lat: 34.835,
    lon: 134.691,
    season_start: null,
    season_end: null,
    event_start: null,
    event_end: null,
    price_tier: 2,
    booking_window_days: 30,
    closed_days: [],
    external_urls: {},
    tags: ["budget", "apa", "himeji"],
    source: "manual",
  },

  // ══════════════════════════════════════════════════════════════════
  // F. 淡路リゾート(2 筆)
  // ══════════════════════════════════════════════════════════════════
  {
    slug: "westin-awaji-2024",
    category: "lodging",
    sub_type: "international_luxury",
    title_zh: "ウェスティンホテル淡路(2024 リブランド・夢舞台・安藤忠雄設計)",
    title_ja: "ウェスティンホテル淡路",
    romaji: "Westin Hotel Awaji",
    summary_zh:
      "2000 グランドニッコー淡路として開業 → 2024 ウェスティンへリブランド。淡路市夢舞台(安藤忠雄設計の複合施設)内。20F・196 室。瀬戸内海 + 国営明石海峡公園のビュー。安藤建築 + リゾート泊が大阪 + 関西からの週末コース定番。1 泊 ¥35000-80000。",
    content_md:
      "- 開業:2000(2024 ウェスティン化)\n- 立地:夢舞台(安藤忠雄複合施設)\n- 客室:196 室・20F\n- 瀬戸内海ビュー\n- 1 泊:¥35000-80000\n- 2026-04 人工查核",
    region: "kansai",
    prefecture_ja: "兵庫県",
    gun_ja: null,
    municipality_ja: "淡路市",
    lg_code: "28226",
    area_types: ["coastal"],
    lat: 34.502,
    lon: 134.946,
    season_start: null,
    season_end: null,
    event_start: null,
    event_end: null,
    price_tier: 4,
    booking_window_days: 90,
    closed_days: [],
    external_urls: { official: "https://www.marriott.com/ja/hotels/oitwi-westin-awaji-island/" },
    tags: ["luxury", "westin", "awaji", "since_2024", "ando_tadao"],
    source: "manual",
  },
  {
    slug: "hotel-newawaji-1976",
    category: "lodging",
    sub_type: "luxury_hotel",
    title_zh: "ホテルニューアワジ(1976 創業・洲本温泉・淡路最古リゾート)",
    title_ja: "ホテルニューアワジ",
    romaji: "Hotel New Awaji",
    summary_zh:
      "1976 洲本温泉(淡路島南部)に開業の最古級淡路リゾート旅館。105 室・展望露天風呂 + 淡路ビーフ会席。50 年余の歴史で淡路リゾート文化の代表。1 泊 ¥20000-50000。",
    content_md:
      "- 創業:1976\n- 立地:洲本温泉\n- 客室:105 室\n- 淡路ビーフ会席\n- 1 泊:¥20000-50000\n- 2026-04 人工查核",
    region: "kansai",
    prefecture_ja: "兵庫県",
    gun_ja: null,
    municipality_ja: "洲本市",
    lg_code: "28205",
    area_types: ["coastal"],
    lat: 34.345,
    lon: 134.901,
    season_start: null,
    season_end: null,
    event_start: null,
    event_end: null,
    price_tier: 4,
    booking_window_days: 60,
    closed_days: [],
    external_urls: { official: "https://www.newawaji.com/" },
    tags: ["luxury", "new_awaji", "sumoto", "since_1976"],
    source: "manual",
  },

  // ══════════════════════════════════════════════════════════════════
  // G. 宝塚 + 西宮 + 湯村(3 筆)
  // ══════════════════════════════════════════════════════════════════
  {
    slug: "takarazuka-hotel-1926",
    category: "lodging",
    sub_type: "luxury_hotel",
    title_zh: "宝塚ホテル(1926 創業・阪急系・宝塚歌劇の迎賓館)",
    title_ja: "宝塚ホテル",
    romaji: "Takarazuka Hotel",
    summary_zh:
      "1926(大正 15 年)阪急電鉄が宝塚歌劇場の隣接に開業した阪急系ホテル。100 年余の歴史で,宝塚歌劇出演者 + 観客の常宿。2020 阪急沿線拡張で建替リニューアル。9F・200 室。1 泊 ¥18000-40000。",
    content_md:
      "- 創業:1926(大正 15 年)\n- 阪急系\n- 宝塚歌劇場隣接\n- 2020 建替リニューアル\n- 客室:200 室・9F\n- 1 泊:¥18000-40000\n- 2026-04 人工查核",
    region: "kansai",
    prefecture_ja: "兵庫県",
    gun_ja: null,
    municipality_ja: "宝塚市",
    lg_code: "28214",
    area_types: ["urban"],
    lat: 34.804,
    lon: 135.349,
    season_start: null,
    season_end: null,
    event_start: null,
    event_end: null,
    price_tier: 4,
    booking_window_days: 60,
    closed_days: [],
    external_urls: {},
    tags: ["luxury", "takarazuka", "hankyu", "since_1926", "revue"],
    source: "manual",
  },
  {
    slug: "hotel-hewitt-koshien-1992",
    category: "lodging",
    sub_type: "luxury_hotel",
    title_zh: "ホテルヒューイット甲子園(1992・西宮甲子園球場前・阪神タイガース宿)",
    title_ja: "ホテルヒューイット甲子園",
    romaji: "Hotel Hewitt Kōshien",
    summary_zh:
      "1992 西宮甲子園球場前に開業のホテル。9F・180 室。阪神甲子園球場徒歩 5 分で,阪神タイガース戦観客 + プロ野球選手の常宿。家族 + ビジネス両用。1 泊 ¥10000-25000。",
    content_md:
      "- 開業:1992\n- 立地:阪神甲子園球場前徒歩 5 分\n- 客室:180 室・9F\n- 阪神タイガース宿\n- 1 泊:¥10000-25000\n- 2026-04 人工查核",
    region: "kansai",
    prefecture_ja: "兵庫県",
    gun_ja: null,
    municipality_ja: "西宮市",
    lg_code: "28204",
    area_types: ["urban"],
    lat: 34.721,
    lon: 135.351,
    season_start: null,
    season_end: null,
    event_start: null,
    event_end: null,
    price_tier: 3,
    booking_window_days: 60,
    closed_days: [],
    external_urls: {},
    tags: ["mid_class", "hewitt", "koshien", "since_1992", "tigers"],
    source: "manual",
  },
  {
    slug: "asanoya-yumura-1300yr",
    category: "lodging",
    sub_type: "onsen_ryokan",
    title_zh: "朝野家(湯村温泉・新温泉町・室町期発祥温泉地・関西山陰最古湯)",
    title_ja: "朝野家",
    romaji: "Asanoya",
    summary_zh:
      "湯村温泉(新温泉町・但馬北部)の老舗旅館。湯村温泉自体は 848 年慈覚大師開湯と伝・1300 年余の歴史。朝野家は明治期からの老舗で,湯村温泉の代表宿。但馬牛会席 + 松葉ガニ(冬)。1 泊 ¥18000-40000。",
    content_md:
      "- 立地:湯村温泉(新温泉町)\n- 湯村温泉開湯:848 年慈覚大師(1300 年余)\n- 但馬牛 + 松葉ガニ会席\n- 1 泊:¥18000-40000\n- 2026-04 人工查核",
    region: "kansai",
    prefecture_ja: "兵庫県",
    gun_ja: "美方郡",
    municipality_ja: "新温泉町",
    lg_code: "28586",
    area_types: ["mountain", "rural"],
    lat: 35.602,
    lon: 134.494,
    season_start: null,
    season_end: null,
    event_start: null,
    event_end: null,
    price_tier: 4,
    booking_window_days: 60,
    closed_days: [],
    external_urls: { official: "https://www.asanoya.co.jp/" },
    tags: ["onsen_ryokan", "asanoya", "yumura", "since_meiji", "tajima"],
    source: "manual",
  },

  // ══════════════════════════════════════════════════════════════════
  // R2 expansion(2026-04-29・29 → 31)
  // ══════════════════════════════════════════════════════════════════
  {
    slug: "ginsuiso-choraku-arima-1959",
    category: "lodging",
    sub_type: "onsen_ryokan",
    title_zh: "銀水荘 兆楽(有馬温泉・1959 創業・有馬最大級 110 室・金泉 + 銀泉)",
    title_ja: "銀水荘 兆楽",
    romaji: "Ginsuisō Chōraku",
    summary_zh:
      "1959 有馬温泉に開業の老舗旅館『銀水荘 兆楽』。110 室の有馬最大級。金泉(赤褐色)+ 銀泉(炭酸)2 種温泉付の希少旅館。但馬牛 + カニ会席。家族 + 団体客向けで,有馬温泉の量的代表宿。1 泊 ¥25000-55000。",
    content_md:
      "- 創業:1959\n- 客室:110 室(有馬最大級)\n- 金泉 + 銀泉 2 種温泉\n- 但馬牛 + カニ会席\n- 1 泊:¥25000-55000\n- 2026-04 人工查核",
    region: "kansai",
    prefecture_ja: "兵庫県",
    gun_ja: null,
    municipality_ja: "神戸市",
    lg_code: "28100",
    area_types: ["mountain"],
    lat: 34.798,
    lon: 135.246,
    season_start: null,
    season_end: null,
    event_start: null,
    event_end: null,
    price_tier: 4,
    booking_window_days: 60,
    closed_days: [],
    external_urls: { official: "https://www.choraku.com/" },
    tags: ["onsen_ryokan", "ginsuiso", "choraku", "arima", "since_1959"],
    source: "manual",
  },
  {
    slug: "piena-kobe-1996",
    category: "lodging",
    sub_type: "luxury_hotel",
    title_zh: "ホテル ピエナ神戸(1996・北野異人館街・関西朝食ランキング常連 No.1)",
    title_ja: "ホテル ピエナ神戸",
    romaji: "Hotel Piena Kobe",
    summary_zh:
      "1996 中央区中山手通(北野異人館街)に開業の小型ブティックホテル。59 室。日本旅館予約サイト『朝食が美味しいホテルランキング』(1 万件超口コミ)で 2010s 全 10 年余連続 No.1 を獲得した『朝食日本一』ホテル。1 泊 ¥18000-35000(朝食込)。",
    content_md:
      "- 開業:1996\n- 立地:北野異人館街\n- 客室:59 室\n- 日本朝食ランキング常連 No.1\n- 1 泊:¥18000-35000(朝食込)\n- 2026-04 人工查核",
    region: "kansai",
    prefecture_ja: "兵庫県",
    gun_ja: null,
    municipality_ja: "神戸市",
    lg_code: "28100",
    area_types: ["urban_central"],
    lat: 34.701,
    lon: 135.193,
    season_start: null,
    season_end: null,
    event_start: null,
    event_end: null,
    price_tier: 4,
    booking_window_days: 60,
    closed_days: [],
    external_urls: { official: "https://www.piena.co.jp/" },
    tags: ["boutique", "piena", "kobe", "since_1996", "japan_no1_breakfast"],
    source: "manual",
  },

  // ══════════════════════════════════════════════════════════════════
  // R3 expansion(2026-04-29・31 → 32)
  // ══════════════════════════════════════════════════════════════════
  {
    slug: "arima-kosenkaku-1969",
    category: "lodging",
    sub_type: "onsen_ryokan",
    title_zh: "古泉閣(有馬温泉・1969 創業・有馬の中堅老舗・金泉湯+ ハイキング)",
    title_ja: "古泉閣",
    romaji: "Kosen-kaku",
    summary_zh:
      "1969 有馬温泉に開業の老舗旅館『古泉閣』。65 室の中堅規模で,有馬温泉の金泉(赤褐色含鉄塩化物泉)+ 銀泉(炭酸泉)2 種温泉付。本館 + 山荘の 2 棟構成。隣接の六甲山系ハイキング起点としても利用される山系温泉宿。1 泊 ¥22000-50000。",
    content_md:
      "- 創業:1969\n- 客室:65 室\n- 金泉 + 銀泉 2 種温泉\n- 六甲山系ハイキング起点\n- 1 泊:¥22000-50000\n- 2026-04 人工查核",
    region: "kansai",
    prefecture_ja: "兵庫県",
    gun_ja: null,
    municipality_ja: "神戸市",
    lg_code: "28100",
    area_types: ["mountain"],
    lat: 34.798,
    lon: 135.246,
    season_start: null,
    season_end: null,
    event_start: null,
    event_end: null,
    price_tier: 4,
    booking_window_days: 60,
    closed_days: [],
    external_urls: { official: "https://www.kosenkaku.com/" },
    tags: ["onsen_ryokan", "kosenkaku", "arima", "since_1969"],
    source: "manual",
  },

  // ══════════════════════════════════════════════════════════════════
  // R4 expansion(2026-04-29・32 → 35)
  // ══════════════════════════════════════════════════════════════════
  {
    slug: "yamamotoya-honkan-kinosaki-1908",
    category: "lodging",
    sub_type: "onsen_ryokan",
    title_zh: "山本屋本館(城崎温泉・1908 創業・木造 4 階建・登録有形文化財)",
    title_ja: "山本屋本館",
    romaji: "Yamamotoya Honkan",
    summary_zh:
      "1908 城崎温泉湯島街に創業の老舗旅館。木造 4 階建の伝統旅館建築で 2017 国登録有形文化財。115 年余の歴史で 22 室の小規模・伝統客室。但馬牛 + カニ会席。城崎温泉湯島街の景観象徴宿。1 泊 ¥30000-65000。",
    content_md:
      "- 創業:1908\n- 立地:城崎温泉湯島街\n- 木造 4 階建(2017 登録文化財)\n- 客室:22 室\n- 1 泊:¥30000-65000\n- 2026-04 人工查核",
    region: "kansai",
    prefecture_ja: "兵庫県",
    gun_ja: null,
    municipality_ja: "豊岡市",
    lg_code: "28209",
    area_types: ["rural"],
    lat: 35.624,
    lon: 134.808,
    season_start: null,
    season_end: null,
    event_start: null,
    event_end: null,
    price_tier: 4,
    booking_window_days: 60,
    closed_days: [],
    external_urls: { official: "https://yamamotoya.jp/" },
    tags: ["onsen_ryokan", "yamamotoya", "kinosaki", "since_1908", "登録文化財"],
    source: "manual",
  },
  {
    slug: "the-thousand-kobe-2008",
    category: "lodging",
    sub_type: "luxury_hotel",
    title_zh: "ザ・サウザンド神戸(2008・三宮駅徒歩 5 分・HMI 系・JR 三ノ宮駅前ラグジュアリー)",
    title_ja: "ザ・サウザンド神戸",
    romaji: "The Thousand Kobe",
    summary_zh:
      "2008 神戸三宮に開業の HMI ホテルグループ系ラグジュアリー。13F・132 室全室 35 ㎡以上 + 全室バルコニー + 神戸夜景。地下 1 階 - 1F バー + 飲食店併設。JR 三ノ宮駅徒歩 5 分の都心立地。1 泊 ¥35000-80000。",
    content_md:
      "- 開業:2008\n- 立地:三宮駅徒歩 5 分\n- 客室:132 室・35 ㎡+\n- 全室バルコニー\n- 1 泊:¥35000-80000\n- 2026-04 人工查核",
    region: "kansai",
    prefecture_ja: "兵庫県",
    gun_ja: null,
    municipality_ja: "神戸市",
    lg_code: "28100",
    area_types: ["urban_central"],
    lat: 34.694,
    lon: 135.197,
    season_start: null,
    season_end: null,
    event_start: null,
    event_end: null,
    price_tier: 4,
    booking_window_days: 60,
    closed_days: [],
    external_urls: { official: "https://www.thethousand.com/" },
    tags: ["luxury", "thousand_kobe", "sannomiya", "since_2008"],
    source: "manual",
  },
  {
    slug: "setre-kobe-2014",
    category: "lodging",
    sub_type: "luxury_hotel",
    title_zh: "Setre Hotel & Spa 神戸(2014・神戸ハーバーランド・グッドデザイン賞)",
    title_ja: "Setre Hotel & Spa 神戸",
    romaji: "Setre Hotel & Spa Kobe",
    summary_zh:
      "2014 神戸ハーバーランドに開業の小型ラグジュアリー。9F・60 室。神戸港 + 夜景ビュー + スパ + フィットネス併設。グッドデザイン賞受賞のミニマルデザイン建築。1 泊 ¥25000-60000。",
    content_md:
      "- 開業:2014\n- 立地:神戸ハーバーランド\n- 客室:60 室・9F\n- グッドデザイン賞\n- 神戸港夜景ビュー\n- 1 泊:¥25000-60000\n- 2026-04 人工查核",
    region: "kansai",
    prefecture_ja: "兵庫県",
    gun_ja: null,
    municipality_ja: "神戸市",
    lg_code: "28100",
    area_types: ["urban_central", "coastal"],
    lat: 34.679,
    lon: 135.184,
    season_start: null,
    season_end: null,
    event_start: null,
    event_end: null,
    price_tier: 4,
    booking_window_days: 60,
    closed_days: [],
    external_urls: {},
    tags: ["luxury", "setre", "kobe", "since_2014", "good_design"],
    source: "manual",
  },

  // ══════════════════════════════════════════════════════════════════
  // R5 expansion(2026-04-29・35 → 36)
  // ══════════════════════════════════════════════════════════════════
  {
    slug: "oriental-hotel-kobe-2010",
    category: "lodging",
    sub_type: "luxury_hotel",
    title_zh: "オリエンタルホテル(2010 リブランド・神戸国際会館内・神戸開港 1870 創業の系譜)",
    title_ja: "オリエンタルホテル",
    romaji: "Oriental Hotel",
    summary_zh:
      "1870 神戸開港 2 年後に外国人居留地で創業した日本最古級ホテル『神戸オリエンタルホテル』の系譜を受継ぎ,2010 神戸国際会館 17F-25F に開業のラグジュアリー。160 年余の歴史。10F・125 室・神戸三宮駅徒歩 5 分。1 泊 ¥30000-80000。",
    content_md:
      "- 1870 創業(神戸オリエンタルホテル系譜)\n- 2010 国際会館で再開\n- 客室:125 室\n- 神戸三宮駅徒歩 5 分\n- 1 泊:¥30000-80000\n- 2026-04 人工查核",
    region: "kansai",
    prefecture_ja: "兵庫県",
    gun_ja: null,
    municipality_ja: "神戸市",
    lg_code: "28100",
    area_types: ["urban_central"],
    lat: 34.692,
    lon: 135.197,
    season_start: null,
    season_end: null,
    event_start: null,
    event_end: null,
    price_tier: 4,
    booking_window_days: 60,
    closed_days: [],
    external_urls: { official: "https://www.orientalhotel.jp/" },
    tags: ["luxury", "oriental_kobe", "since_1870", "rebranded_2010"],
    source: "manual",
  },
];

async function main() {
  console.log(`[seed] ${rows.length} rows to seed`);
  const byKind: Record<string, number> = {};
  for (const r of rows) byKind[r.sub_type] = (byKind[r.sub_type] ?? 0) + 1;
  console.log(`[seed] by sub_type: ${JSON.stringify(byKind, null, 2)}`);

  if (DRY) {
    for (const r of rows) {
      console.log(
        `  [${r.sub_type.padEnd(28)}] ${r.title_zh} (${r.municipality_ja ?? "-"}/${r.lg_code ?? "-"})`,
      );
    }
    return;
  }

  const sb = createAdminClient();
  const { data, error } = await sb
    .from("japan_entries")
    .upsert(rows, { onConflict: "slug" })
    .select("id, slug");
  if (error) {
    console.error("[seed] upsert failed", error);
    process.exit(1);
  }
  console.log(`[seed] upserted ${data?.length ?? 0} rows`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

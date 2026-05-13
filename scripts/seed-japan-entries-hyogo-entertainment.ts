// Seed 兵庫県 · 樂類 條目 → public.japan_entries(Sprint 18.4 樂 R1)
//
// 兵庫の樂類軸:
//   - 神戸ベイエリア:ハーバーランド(1992) + モザイク + átoa(2021 新型水族館)
//   - 有馬温泉(日本三古湯・公衆湯):金の湯 + 銀の湯 + 炭酸泉源公園
//   - 桜・紅葉:姫路城桜 + 有馬紅葉 + 書写山圓教寺紅葉
//   - 花畑:淡路夢舞台 100 段苑(安藤忠雄)+ 花さじき + 布引ハーブ園
//   - 花火・イルミ:みなとこうべ海上花火 + 神戸ルミナリエ(1995 震災追悼)
//   - 動物園・水族館:王子動物園(パンダ)+ átoa
//   - スポーツ:阪神甲子園球場(1924・最古現役)+ 神戸マラソン
//   - 鳴門渦潮:鳴門観潮船 + 鳴門大橋(1985)
//   - 神戸夜景:六甲山 + 摩耶山掬星台(1000 万ドル夜景・日本三大)
//   - 季節食材:松葉ガニ + 但馬牛 + 淡路玉ねぎ
//
// 30 筆構成
//
// Usage:
//   npm run seed:japan-hyogo-entertainment:dry
//   npm run seed:japan-hyogo-entertainment

import { config as loadEnv } from "dotenv";
loadEnv({ path: ".env.local" });

import { createAdminClient } from "../src/lib/supabase/admin";

const DRY = process.argv.includes("--dry-run");

type SubType =
  | "theme_park"
  | "sakura"
  | "momiji"
  | "firework_festival"
  | "illumination"
  | "flower_field"
  | "aquarium_zoo"
  | "sports_spectate"
  | "seasonal_food"
  | "hyogo_kobe_night_view"
  | "hyogo_arima_yu";

interface SeedRow {
  slug: string;
  category: "entertainment";
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
  // A. 神戸ベイエリア(3 筆)
  // ══════════════════════════════════════════════════════════════════
  {
    slug: "kobe-harborland-1992",
    category: "entertainment",
    sub_type: "theme_park",
    title_zh: "神戸ハーバーランド(1992 開業・神戸港観光複合・umie + モザイク)",
    title_ja: "神戸ハーバーランド",
    romaji: "Kobe Harborland",
    summary_zh:
      "1992 神戸港(中央区東川崎町)の旧国鉄湊川駅貨物ヤード跡地再開発で開業した観光複合エリア。umie(モール)+ モザイク + アンパンマンこどもミュージアム + ホテルラスイート + 神戸ポートタワー対岸の総合観光地。神戸港夜景 + 観覧車 + クルーズ船発着。",
    content_md:
      "- 開業:1992(旧国鉄湊川駅貨物ヤード跡)\n- 主要施設:umie + モザイク + アンパンマン\n- 神戸港夜景 + 観覧車 + クルーズ\n- アクセス:JR 神戸駅徒歩 5 分\n- 2026-04 人工查核",
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
    price_tier: 0,
    booking_window_days: null,
    closed_days: [],
    external_urls: { official: "https://www.harborland.co.jp/" },
    tags: ["bay_area", "harborland", "since_1992", "kobe_port"],
    source: "manual",
  },
  {
    slug: "mosaic-kobe-1992",
    category: "entertainment",
    sub_type: "theme_park",
    title_zh: "神戸モザイク + 観覧車(1992・ハーバーランド・神戸港夜景の象徴)",
    title_ja: "神戸モザイク",
    romaji: "Kobe Mosaic",
    summary_zh:
      "1992 神戸ハーバーランド内に開業した港町テイストの商業 + アミューズメント施設。屋上の大観覧車(高 50 m・カラー LED ライトアップ)が神戸港夜景の象徴。神戸ポートタワー対岸の絶景ポイントで,SNS 撮影スポット No.1。",
    content_md:
      "- 開業:1992\n- 屋上観覧車:高 50 m カラー LED\n- 神戸港夜景の象徴\n- ポートタワー対岸\n- 観覧車:¥800\n- 営業:11:00-22:00\n- 2026-04 人工查核",
    region: "kansai",
    prefecture_ja: "兵庫県",
    gun_ja: null,
    municipality_ja: "神戸市",
    lg_code: "28100",
    area_types: ["urban_central", "coastal"],
    lat: 34.680,
    lon: 135.183,
    season_start: null,
    season_end: null,
    event_start: null,
    event_end: null,
    price_tier: 1,
    booking_window_days: null,
    closed_days: [],
    external_urls: { official: "https://kobe-mosaic.com/" },
    tags: ["mall", "mosaic", "ferris_wheel", "since_1992", "harborland"],
    source: "manual",
  },
  {
    slug: "atoa-kobe-2021",
    category: "entertainment",
    sub_type: "aquarium_zoo",
    title_zh: "átoa(2021 開業・神戸新港町・劇場型新型水族館・アート + 海洋融合)",
    title_ja: "átoa",
    romaji: "atoa",
    summary_zh:
      "2021 神戸中央区新港町に開業した劇場型新型水族館『átoa』(aquarium × art の造語)。デジタルアート + 生態展示融合の革新的水族館で,プロジェクションマッピング + 巨大球体水槽 + ブリッジビューが特色。建築家小堀哲夫設計。神戸ハーバーランド徒歩 10 分。",
    content_md:
      "- 開業:2021\n- 立地:神戸新港町\n- コンセプト:aquarium × art\n- 設計:小堀哲夫\n- 巨大球体水槽 + プロジェクションマッピング\n- 入館:¥2400\n- 2026-04 人工查核",
    region: "kansai",
    prefecture_ja: "兵庫県",
    gun_ja: null,
    municipality_ja: "神戸市",
    lg_code: "28100",
    area_types: ["urban_central", "coastal"],
    lat: 34.683,
    lon: 135.193,
    season_start: null,
    season_end: null,
    event_start: null,
    event_end: null,
    price_tier: 3,
    booking_window_days: null,
    closed_days: [],
    external_urls: { official: "https://atoa-kobe.jp/" },
    tags: ["aquarium", "atoa", "since_2021", "art_aquarium", "kobe"],
    source: "manual",
  },

  // ══════════════════════════════════════════════════════════════════
  // B. 有馬温泉 公衆湯(3 筆)
  // ══════════════════════════════════════════════════════════════════
  {
    slug: "arima-kin-no-yu",
    category: "entertainment",
    sub_type: "hyogo_arima_yu",
    title_zh: "有馬温泉 金の湯(赤褐色含鉄ナトリウム塩化物泉・公衆温泉)",
    title_ja: "金の湯",
    romaji: "Kin no Yu",
    summary_zh:
      "有馬温泉の代表公衆温泉。赤褐色の金泉(鉄分 + 塩化物含有)で,湯に浸かると鉄分が酸化し赤褐色になる珍しい泉質。有馬温泉のシンボル。日帰り入浴 ¥650。1999 改装で現代的施設に。",
    content_md:
      "- 泉質:赤褐色含鉄ナトリウム塩化物泉(金泉)\n- 入浴:¥650\n- 営業:8:00-22:00 第 2 + 第 4 火曜休\n- 2026-04 人工查核",
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
    price_tier: 1,
    booking_window_days: null,
    closed_days: [],
    external_urls: {},
    tags: ["onsen", "arima", "kinsen", "public_bath"],
    source: "manual",
  },
  {
    slug: "arima-gin-no-yu",
    category: "entertainment",
    sub_type: "hyogo_arima_yu",
    title_zh: "有馬温泉 銀の湯(炭酸泉 + ラジウム泉・有馬の銀泉公衆湯)",
    title_ja: "銀の湯",
    romaji: "Gin no Yu",
    summary_zh:
      "有馬温泉のもう一つの公衆温泉。銀泉(無色透明の炭酸泉 + ラジウム泉)で,金の湯と対をなす。炭酸の効果で美肌湯と称される。日帰り入浴 ¥550。",
    content_md:
      "- 泉質:炭酸泉 + ラジウム泉(銀泉)\n- 入浴:¥550\n- 営業:9:00-21:00 第 1 + 第 3 火曜休\n- 2026-04 人工查核",
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
    price_tier: 1,
    booking_window_days: null,
    closed_days: [],
    external_urls: {},
    tags: ["onsen", "arima", "ginsen", "tansan", "public_bath"],
    source: "manual",
  },
  {
    slug: "arima-tansan-park-1925",
    category: "entertainment",
    sub_type: "hyogo_arima_yu",
    title_zh: "炭酸泉源公園(有馬温泉・1925・天然炭酸水湧出地・温泉名所巡り)",
    title_ja: "炭酸泉源公園",
    romaji: "Tansansen-gen Kōen",
    summary_zh:
      "有馬温泉湯本街の天然炭酸泉湧出地公園。1925 整備で,日本の炭酸飲料文化発祥地のひとつ。温泉名所巡り(金の湯 + 銀の湯 + 炭酸泉源公園 + 太閤の湯殿館)の中核。湧き水は飲用可・無料。観覧無料。",
    content_md:
      "- 整備:1925\n- 天然炭酸泉湧出地\n- 飲用可・無料\n- 観覧無料\n- 2026-04 人工查核",
    region: "kansai",
    prefecture_ja: "兵庫県",
    gun_ja: null,
    municipality_ja: "神戸市",
    lg_code: "28100",
    area_types: ["mountain"],
    lat: 34.800,
    lon: 135.247,
    season_start: null,
    season_end: null,
    event_start: null,
    event_end: null,
    price_tier: 0,
    booking_window_days: null,
    closed_days: [],
    external_urls: {},
    tags: ["onsen_park", "arima", "tansan", "since_1925", "free"],
    source: "manual",
  },

  // ══════════════════════════════════════════════════════════════════
  // C. 桜・紅葉(3 筆)
  // ══════════════════════════════════════════════════════════════════
  {
    slug: "himeji-jo-sakura",
    category: "entertainment",
    sub_type: "sakura",
    title_zh: "姫路城 桜(西の丸 1000 本・国宝白鷺城との春景)",
    title_ja: "姫路城 桜",
    romaji: "Himeji-jō Sakura",
    summary_zh:
      "姫路城内 1000 本の桜(ソメイヨシノ + シダレザクラ + 八重桜)。3 月末 - 4 月初開花。国宝白鷺城の白漆喰天守と桜のコラボが日本一の桜名所(日本桜名所 100 選)。西の丸庭園 + 三の丸広場 + 好古園との組合せ観桜定番。夜桜ライトアップ(3 月末)。",
    content_md:
      "- 規模:1000 本\n- 開花:3 月末 - 4 月初\n- 日本桜名所 100 選\n- 国宝白鷺城バックドロップ\n- 夜桜:3 月末 18:00-21:00\n- 入場:姫路城 ¥1000\n- 2026-04 人工查核",
    region: "kansai",
    prefecture_ja: "兵庫県",
    gun_ja: null,
    municipality_ja: "姫路市",
    lg_code: "28201",
    area_types: ["urban"],
    lat: 34.839,
    lon: 134.694,
    season_start: "2026-03-25",
    season_end: "2026-04-10",
    event_start: null,
    event_end: null,
    price_tier: 2,
    booking_window_days: null,
    closed_days: [],
    external_urls: {},
    tags: ["sakura", "himeji_jo", "world_heritage_view", "sakura_100"],
    source: "manual",
  },
  {
    slug: "arima-onsen-momiji",
    category: "entertainment",
    sub_type: "momiji",
    title_zh: "有馬温泉 紅葉(瑞宝寺公園・1300 年湯里・11 月下旬最盛)",
    title_ja: "有馬温泉 紅葉",
    romaji: "Arima Onsen Kōyō",
    summary_zh:
      "有馬温泉中心の瑞宝寺公園を中心とする紅葉。3000 本余のモミジ + イチョウが 11 月中旬 - 12 月初紅葉。有馬温泉宿泊 + 紅葉観賞の関西温泉紅葉定番。神戸からバス 30 分のアクセス。",
    content_md:
      "- 規模:3000 本余(モミジ + イチョウ)\n- 開葉:11 月中旬 - 12 月初\n- 立地:瑞宝寺公園\n- 神戸からバス 30 分\n- 入園:24h 無料\n- 2026-04 人工查核",
    region: "kansai",
    prefecture_ja: "兵庫県",
    gun_ja: null,
    municipality_ja: "神戸市",
    lg_code: "28100",
    area_types: ["mountain"],
    lat: 34.794,
    lon: 135.250,
    season_start: "2026-11-15",
    season_end: "2026-12-05",
    event_start: null,
    event_end: null,
    price_tier: 0,
    booking_window_days: null,
    closed_days: [],
    external_urls: {},
    tags: ["momiji", "arima", "zuihouji_park", "autumn"],
    source: "manual",
  },
  {
    slug: "shoshazan-engyoji-momiji",
    category: "entertainment",
    sub_type: "momiji",
    title_zh: "書写山圓教寺 紅葉(姫路・966 創建・国宝大講堂と紅葉のコラボ)",
    title_ja: "書写山圓教寺 紅葉",
    romaji: "Shoshazan Engyō-ji Kōyō",
    summary_zh:
      "書写山圓教寺(966 創建・天台宗別格本山・西国 27 番)の境内紅葉。国宝大講堂 + 食堂 + 常行堂(室町期)の三之堂と紅葉のコラボが映画『ラストサムライ』(2003)ロケ地としても知名。11 月中旬 - 12 月初紅葉。ロープウェイで山上アクセス。",
    content_md:
      "- 開葉:11 月中旬 - 12 月初\n- 国宝大講堂 + 食堂 + 常行堂\n- 映画『ラストサムライ』ロケ地\n- ロープウェイ:¥1300\n- 2026-04 人工查核",
    region: "kansai",
    prefecture_ja: "兵庫県",
    gun_ja: null,
    municipality_ja: "姫路市",
    lg_code: "28201",
    area_types: ["mountain"],
    lat: 34.866,
    lon: 134.643,
    season_start: "2026-11-15",
    season_end: "2026-12-05",
    event_start: null,
    event_end: null,
    price_tier: 2,
    booking_window_days: null,
    closed_days: [],
    external_urls: {},
    tags: ["momiji", "engyoji", "shoshazan", "kokuho", "last_samurai"],
    source: "manual",
  },

  // ══════════════════════════════════════════════════════════════════
  // D. 花畑(3 筆)
  // ══════════════════════════════════════════════════════════════════
  {
    slug: "awaji-yumebutai-2000",
    category: "entertainment",
    sub_type: "flower_field",
    title_zh: "淡路夢舞台 100 段苑(2000・安藤忠雄設計・100 段の花壇 + 花博跡地)",
    title_ja: "淡路夢舞台 100 段苑",
    romaji: "Awaji Yumebutai 100 Dan-en",
    summary_zh:
      "2000 安藤忠雄設計の淡路夢舞台(2000 淡路花博跡地)内『100 段苑』。100 段の階段花壇 + 1000 種の花を季節毎に植替え。3 月-11 月に花暦が続く関西最大級花畑。瀬戸内海ビュー + 安藤建築のコラボ。隣接にウェスティンホテル淡路 + 国営明石海峡公園。",
    content_md:
      "- 開園:2000(淡路花博跡)\n- 設計:安藤忠雄\n- 規模:100 段花壇 + 1000 種花\n- 期間:3-11 月\n- 入園:¥600\n- 2026-04 人工查核",
    region: "kansai",
    prefecture_ja: "兵庫県",
    gun_ja: null,
    municipality_ja: "淡路市",
    lg_code: "28226",
    area_types: ["coastal"],
    lat: 34.502,
    lon: 134.946,
    season_start: "2026-03-01",
    season_end: "2026-11-30",
    event_start: null,
    event_end: null,
    price_tier: 1,
    booking_window_days: null,
    closed_days: [],
    external_urls: { official: "https://www.yumebutai.co.jp/" },
    tags: ["flower_field", "yumebutai", "ando_tadao", "since_2000", "100stages"],
    source: "manual",
  },
  {
    slug: "awaji-hanasajiki-1998",
    category: "entertainment",
    sub_type: "flower_field",
    title_zh: "あわじ花さじき(1998・15 ha 花畑・春菜の花 + 夏ひまわり + 秋コスモス)",
    title_ja: "あわじ花さじき",
    romaji: "Awaji Hanasajiki",
    summary_zh:
      "1998 兵庫県が淡路市東浦に整備した 15 ha の花畑公園。春菜の花(4 月)+ 夏ひまわり(7-8 月)+ 秋コスモス(10-11 月)+ 冬大根菜の年中花暦。瀬戸内海ビュー + 大阪湾を背景にした絶景花畑。入園無料。",
    content_md:
      "- 整備:1998\n- 規模:15 ha\n- 花暦:菜の花(春)+ ひまわり(夏)+ コスモス(秋)\n- 入園:無料\n- 営業:9:00-17:00\n- 2026-04 人工查核",
    region: "kansai",
    prefecture_ja: "兵庫県",
    gun_ja: null,
    municipality_ja: "淡路市",
    lg_code: "28226",
    area_types: ["coastal"],
    lat: 34.541,
    lon: 134.948,
    season_start: null,
    season_end: null,
    event_start: null,
    event_end: null,
    price_tier: 0,
    booking_window_days: null,
    closed_days: [],
    external_urls: { official: "https://awajihanasajiki.jp/" },
    tags: ["flower_field", "hanasajiki", "awaji", "since_1998", "free"],
    source: "manual",
  },
  {
    slug: "nunobiki-herb-park-1991",
    category: "entertainment",
    sub_type: "flower_field",
    title_zh: "布引ハーブ園(1991・新神戸ロープウェイ・西日本最大級ハーブ園)",
    title_ja: "布引ハーブ園",
    romaji: "Nunobiki Herb Park",
    summary_zh:
      "1991 新神戸駅近くの布引山に開園した西日本最大級ハーブ園。新神戸ロープウェイ(山頂駅)直結で,200 種 75000 株のハーブ + 季節の花。神戸市街 + 大阪湾の眺望も特色。ロープウェイ往復 + 入園 ¥2000。",
    content_md:
      "- 開園:1991\n- 規模:200 種 75000 株(西日本最大級)\n- アクセス:新神戸ロープウェイ\n- 神戸市街 + 大阪湾眺望\n- 入園:¥2000(ロープウェイ込)\n- 2026-04 人工查核",
    region: "kansai",
    prefecture_ja: "兵庫県",
    gun_ja: null,
    municipality_ja: "神戸市",
    lg_code: "28100",
    area_types: ["mountain"],
    lat: 34.713,
    lon: 135.196,
    season_start: null,
    season_end: null,
    event_start: null,
    event_end: null,
    price_tier: 2,
    booking_window_days: null,
    closed_days: [],
    external_urls: { official: "https://www.kobeherb.com/" },
    tags: ["flower_field", "herb_park", "nunobiki", "since_1991", "ropeway"],
    source: "manual",
  },

  // ══════════════════════════════════════════════════════════════════
  // E. 花火 + イルミ(3 筆)
  // ══════════════════════════════════════════════════════════════════
  {
    slug: "minato-kobe-fireworks",
    category: "entertainment",
    sub_type: "firework_festival",
    title_zh: "みなとこうべ海上花火大会(1971 創始・8 月・15000 発・神戸港最大花火)",
    title_ja: "みなとこうべ海上花火大会",
    romaji: "Minato Kōbe Kaijō Hanabi Taikai",
    summary_zh:
      "1971 創始の神戸港最大花火大会。毎年 8 月最終土曜 19:30-20:30 神戸ハーバーランド + メリケンパーク間の海上で打上げ 15000 発。動員 30 万人。船上クルーズ観覧 + 陸上観覧両方で楽しめる。",
    content_md:
      "- 創始:1971\n- 開催:8 月最終土曜 19:30-20:30\n- 規模:15000 発\n- 場所:神戸ハーバーランド + メリケンパーク間海上\n- 動員:30 万人\n- 2026-04 人工查核",
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
    event_start: "2026-08-29",
    event_end: "2026-08-29",
    price_tier: 0,
    booking_window_days: 60,
    closed_days: [],
    external_urls: {},
    tags: ["fireworks", "kobe_port", "since_1971", "august"],
    source: "manual",
  },
  {
    slug: "kobe-luminarie-1995",
    category: "entertainment",
    sub_type: "illumination",
    title_zh: "神戸ルミナリエ(1995 阪神淡路大震災追悼開始・12 月・震災鎮魂イルミ)",
    title_ja: "神戸ルミナリエ",
    romaji: "Kobe Luminarie",
    summary_zh:
      "1995/12 阪神淡路大震災(1995/1/17・死者 6434 名)からの 11 ヶ月後復興 + 鎮魂祭として始まった追悼イルミネーション。12 月初 - 中旬約 10 日間,神戸三宮 - 元町 - 旧居留地のメイン通りを 30 万球 + イタリアンプロデュース光の建築装飾で彩る。動員 300 万人余。震災記念意義の光。",
    content_md:
      "- 創始:1995/12(震災 11 ヶ月後)\n- 開催:12 月初 - 中旬 約 10 日間\n- 規模:LED 30 万球\n- 場所:三宮 - 元町 - 旧居留地\n- 動員:300 万人余\n- 入場無料\n- 2026-04 人工查核",
    region: "kansai",
    prefecture_ja: "兵庫県",
    gun_ja: null,
    municipality_ja: "神戸市",
    lg_code: "28100",
    area_types: ["urban_central"],
    lat: 34.687,
    lon: 135.193,
    season_start: "2026-12-04",
    season_end: "2026-12-13",
    event_start: null,
    event_end: null,
    price_tier: 0,
    booking_window_days: null,
    closed_days: [],
    external_urls: { official: "https://kobe-luminarie.jp/" },
    tags: ["illumination", "luminarie", "since_1995", "earthquake_memorial"],
    source: "manual",
  },
  {
    slug: "himeji-castle-night-illumi",
    category: "entertainment",
    sub_type: "illumination",
    title_zh: "姫路城 ライトアップ(通年・国宝白鷺城夜景・夜桜 + 紅葉特別ライトアップ)",
    title_ja: "姫路城 ライトアップ",
    romaji: "Himeji-jō Light-up",
    summary_zh:
      "姫路城天守閣の通年ライトアップ(日没 - 23:00)。普段は白漆喰の壁を白色 LED で照射,春桜 + 秋紅葉 + クリスマス + 夏祭りで季節色変り。世界遺産夜景として SNS 大人気。観覧無料。",
    content_md:
      "- 開催:通年(日没 - 23:00)\n- 季節色:春桜 + 秋紅葉 + クリスマス\n- 観覧無料\n- 2026-04 人工查核",
    region: "kansai",
    prefecture_ja: "兵庫県",
    gun_ja: null,
    municipality_ja: "姫路市",
    lg_code: "28201",
    area_types: ["urban"],
    lat: 34.839,
    lon: 134.694,
    season_start: null,
    season_end: null,
    event_start: null,
    event_end: null,
    price_tier: 0,
    booking_window_days: null,
    closed_days: [],
    external_urls: {},
    tags: ["illumination", "himeji_jo", "lightup", "world_heritage_night"],
    source: "manual",
  },

  // ══════════════════════════════════════════════════════════════════
  // F. テーマパーク(2 筆)
  // ══════════════════════════════════════════════════════════════════
  {
    slug: "kobe-fruit-flower-park-1991",
    category: "entertainment",
    sub_type: "theme_park",
    title_zh: "神戸フルーツ・フラワーパーク(1991・北区・果実狩 + 温泉 + ホテル)",
    title_ja: "神戸フルーツ・フラワーパーク",
    romaji: "Kobe Fruit Flower Park",
    summary_zh:
      "1991 神戸市北区大沢町に開園した複合テーマパーク。果実狩(春いちご + 夏ぶどう + 秋りんご・なし)+ 花畑 + 温泉 + ホテル + 大沢温泉郷。神戸からバス 60 分でアクセス可能な郊外型レジャー施設。",
    content_md:
      "- 開園:1991\n- 立地:神戸北区大沢町\n- 構成:果実狩 + 花畑 + 温泉 + ホテル\n- 神戸からバス 60 分\n- 入園:¥500\n- 2026-04 人工查核",
    region: "kansai",
    prefecture_ja: "兵庫県",
    gun_ja: null,
    municipality_ja: "神戸市",
    lg_code: "28100",
    area_types: ["mountain", "rural"],
    lat: 34.832,
    lon: 135.118,
    season_start: null,
    season_end: null,
    event_start: null,
    event_end: null,
    price_tier: 1,
    booking_window_days: null,
    closed_days: [],
    external_urls: {},
    tags: ["theme_park", "fruit_flower", "since_1991", "kita_kobe"],
    source: "manual",
  },
  {
    slug: "kobe-anpanman-museum-2013",
    category: "entertainment",
    sub_type: "theme_park",
    title_zh: "神戸アンパンマンこどもミュージアム&モール(2013・ハーバーランド・家族向け)",
    title_ja: "神戸アンパンマンこどもミュージアム&モール",
    romaji: "Kobe Anpanman Children's Museum",
    summary_zh:
      "2013 神戸ハーバーランドに開業のアンパンマンテーマパーク。やなせたかし原作のアニメキャラクター展示 + 体験 + ステージショー + フードコート。0-6 歳家族向けで関西家族 1 日コース。",
    content_md:
      "- 開業:2013\n- 立地:ハーバーランド\n- 対象:0-6 歳家族\n- 入館:¥2200\n- 営業:10:00-18:00\n- 2026-04 人工查核",
    region: "kansai",
    prefecture_ja: "兵庫県",
    gun_ja: null,
    municipality_ja: "神戸市",
    lg_code: "28100",
    area_types: ["urban_central", "coastal"],
    lat: 34.681,
    lon: 135.183,
    season_start: null,
    season_end: null,
    event_start: null,
    event_end: null,
    price_tier: 3,
    booking_window_days: 14,
    closed_days: [],
    external_urls: { official: "https://www.kobe-anpanman.jp/" },
    tags: ["theme_park", "anpanman", "since_2013", "harborland", "kids"],
    source: "manual",
  },

  // ══════════════════════════════════════════════════════════════════
  // G. 動物園(1 筆)
  // ══════════════════════════════════════════════════════════════════
  {
    slug: "kobe-oji-zoo-1951",
    category: "entertainment",
    sub_type: "aquarium_zoo",
    title_zh: "神戸市立王子動物園(1951・パンダ + コアラ + 王子公園)",
    title_ja: "神戸市立王子動物園",
    romaji: "Kobe Oji Zoo",
    summary_zh:
      "1951 神戸市灘区王子町に開園の市立動物園。日本でも数少ないジャイアントパンダ飼育園(タンタン・1995-2024)+ コアラ + ホッキョクグマ + ライオン等 130 種 750 点。王子公園内で家族向け定番。",
    content_md:
      "- 開園:1951\n- 立地:灘区王子公園内\n- 種数:130 種 750 点\n- 名物:パンダ(タンタン 2024 中国返還)\n- 入園:9:00-17:00 水曜休 ¥600\n- 2026-04 人工查核",
    region: "kansai",
    prefecture_ja: "兵庫県",
    gun_ja: null,
    municipality_ja: "神戸市",
    lg_code: "28100",
    area_types: ["urban"],
    lat: 34.711,
    lon: 135.203,
    season_start: null,
    season_end: null,
    event_start: null,
    event_end: null,
    price_tier: 1,
    booking_window_days: null,
    closed_days: ["wed"],
    external_urls: { official: "https://www.kobe-ojizoo.jp/" },
    tags: ["zoo", "oji_zoo", "since_1951", "panda", "koala"],
    source: "manual",
  },

  // ══════════════════════════════════════════════════════════════════
  // H. スポーツ(2 筆)
  // ══════════════════════════════════════════════════════════════════
  {
    slug: "hanshin-koshien-stadium-1924",
    category: "entertainment",
    sub_type: "sports_spectate",
    title_zh: "阪神甲子園球場(1924・日本最古現役大型球場・阪神タイガース本拠 + 高校野球聖地)",
    title_ja: "阪神甲子園球場",
    romaji: "Hanshin Kōshien Stadium",
    summary_zh:
      "1924 阪神電気鉄道が西宮甲子園に開設した日本最古の現役大型球場。100 年余の歴史で,阪神タイガース本拠地(プロ野球) + 春のセンバツ(1924-) + 夏の選手権(1924-) 高校野球聖地。収容 47000 席。隣接の甲子園歴史館 + ホテルヒューイット甲子園。",
    content_md:
      "- 開業:1924\n- 収容:47000 席\n- 阪神タイガース本拠\n- 春センバツ + 夏選手権高校野球聖地\n- 100 年余の歴史\n- 2026-04 人工查核",
    region: "kansai",
    prefecture_ja: "兵庫県",
    gun_ja: null,
    municipality_ja: "西宮市",
    lg_code: "28204",
    area_types: ["urban"],
    lat: 34.721,
    lon: 135.361,
    season_start: null,
    season_end: null,
    event_start: null,
    event_end: null,
    price_tier: 3,
    booking_window_days: 60,
    closed_days: [],
    external_urls: { official: "https://www.hanshin.co.jp/koshien/" },
    tags: ["baseball", "koshien", "tigers", "since_1924", "high_school"],
    source: "manual",
  },
  {
    slug: "kobe-marathon-2011",
    category: "entertainment",
    sub_type: "sports_spectate",
    title_zh: "神戸マラソン(2011 創始・11 月開催・神戸復興記念市民マラソン)",
    title_ja: "神戸マラソン",
    romaji: "Kobe Marathon",
    summary_zh:
      "2011 創始の神戸市内シティマラソン(フルマラソン 42.195 km)。1995 阪神淡路大震災 16 周年 + 神戸復興 + 国際感謝の象徴イベント。毎年 11 月第 3 日曜開催で,神戸ハーバーランド → ポートアイランドの周回コース。約 2 万人参加。観戦無料。",
    content_md:
      "- 創始:2011(震災 16 周年復興記念)\n- 開催:11 月第 3 日曜\n- 規模:約 2 万人\n- コース:ハーバーランド → ポートアイランド\n- 観戦無料\n- 2026-04 人工查核",
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
    event_start: "2026-11-15",
    event_end: "2026-11-15",
    price_tier: 0,
    booking_window_days: null,
    closed_days: [],
    external_urls: { official: "https://kobe-marathon.net/" },
    tags: ["marathon", "kobe", "since_2011", "earthquake_recovery"],
    source: "manual",
  },

  // ══════════════════════════════════════════════════════════════════
  // I. 鳴門渦潮(2 筆)
  // ══════════════════════════════════════════════════════════════════
  {
    slug: "naruto-uzunoki-cruise",
    category: "entertainment",
    sub_type: "theme_park",
    title_zh: "鳴門観潮船(南あわじ福良・春秋大潮で世界最大級うずしお)",
    title_ja: "鳴門観潮船",
    romaji: "Naruto Kanchōsen",
    summary_zh:
      "南あわじ市福良港から鳴門海峡(淡路島南部 + 徳島鳴門間)へ向かう観潮船。世界最大級の渦潮(直径 30 m・春秋大潮で最大)を間近で見れる体験。咸臨丸 + 日本丸の 2 船で運行。1 日 8-10 便・¥2500-3000。春秋大潮日(満月新月前後)が最大渦潮日。",
    content_md:
      "- 立地:南あわじ市福良港\n- 渦潮:直径 30 m(世界最大級)\n- 春秋大潮で最大\n- 1 日:8-10 便\n- 価格:¥2500-3000\n- 2026-04 人工查核",
    region: "kansai",
    prefecture_ja: "兵庫県",
    gun_ja: null,
    municipality_ja: "南あわじ市",
    lg_code: "28224",
    area_types: ["coastal"],
    lat: 34.249,
    lon: 134.717,
    season_start: null,
    season_end: null,
    event_start: null,
    event_end: null,
    price_tier: 3,
    booking_window_days: 14,
    closed_days: [],
    external_urls: { official: "https://www.uzu-shio.com/" },
    tags: ["sightseeing_boat", "naruto_uzunoki", "minamiawaji", "world_largest"],
    source: "manual",
  },
  {
    slug: "naruto-bridge-1985",
    category: "entertainment",
    sub_type: "theme_park",
    title_zh: "大鳴門橋(1985 開通・南あわじ - 徳島鳴門・1.6 km 吊橋・本州四国連絡橋)",
    title_ja: "大鳴門橋",
    romaji: "Ōnaruto-bashi",
    summary_zh:
      "1985 開通の本州四国連絡橋(神戸鳴門ルート)の鳴門海峡を渡る吊橋。淡路島南端 - 徳島鳴門間 1.6 km。橋下渦潮を上から見る『渦の道』(遊歩道・¥510)で,世界最大級渦潮を上下から見る稀有の体験。",
    content_md:
      "- 開通:1985\n- 全長:1.6 km(吊橋)\n- 渦の道:遊歩道 + 渦潮上空ガラス窓\n- 入場:¥510\n- 2026-04 人工查核",
    region: "kansai",
    prefecture_ja: "兵庫県",
    gun_ja: null,
    municipality_ja: "南あわじ市",
    lg_code: "28224",
    area_types: ["coastal"],
    lat: 34.236,
    lon: 134.643,
    season_start: null,
    season_end: null,
    event_start: null,
    event_end: null,
    price_tier: 1,
    booking_window_days: null,
    closed_days: [],
    external_urls: { official: "https://www.uzunomichi.jp/" },
    tags: ["bridge", "naruto", "since_1985", "minamiawaji", "uzu_no_michi"],
    source: "manual",
  },

  // ══════════════════════════════════════════════════════════════════
  // J. 神戸夜景(2 筆)
  // ══════════════════════════════════════════════════════════════════
  {
    slug: "mt-rokko-nightview",
    category: "entertainment",
    sub_type: "hyogo_kobe_night_view",
    title_zh: "六甲山 天覧台(夜景・神戸三大夜景 + 日本三大夜景・標高 888 m)",
    title_ja: "六甲山 天覧台",
    romaji: "Mt. Rokko Tenrandai",
    summary_zh:
      "標高 888 m 六甲山頂上の天覧台展望台。神戸市街 + 大阪湾 + 関西国際空港 + 大阪大都市圏一望の絶景。1981 昭和天皇行幸時に建てられた展望台名前が天覧台。日本三大夜景(函館 + 長崎 + 神戸)の神戸代表。アクセス:六甲ケーブル + 六甲山上バス + 摩耶ケーブル経由。",
    content_md:
      "- 標高:888 m\n- 神戸三大夜景 + 日本三大夜景\n- 1981 昭和天皇行幸命名\n- 観覧無料\n- 2026-04 人工查核",
    region: "kansai",
    prefecture_ja: "兵庫県",
    gun_ja: null,
    municipality_ja: "神戸市",
    lg_code: "28100",
    area_types: ["mountain"],
    lat: 34.766,
    lon: 135.260,
    season_start: null,
    season_end: null,
    event_start: null,
    event_end: null,
    price_tier: 0,
    booking_window_days: null,
    closed_days: [],
    external_urls: {},
    tags: ["night_view", "rokko", "japan_3_great", "tenrandai"],
    source: "manual",
  },
  {
    slug: "mt-maya-1000man-night",
    category: "entertainment",
    sub_type: "hyogo_kobe_night_view",
    title_zh: "摩耶山 掬星台(1000 万ドルの夜景発祥地・1958 命名・夜景百選)",
    title_ja: "摩耶山 掬星台",
    romaji: "Mt. Maya Kikuseidai",
    summary_zh:
      "標高 700 m 摩耶山中腹の掬星台展望台。1958 関西電力会長の発言で『1000 万ドルの夜景』と称された名所。神戸 + 大阪一望で,六甲山天覧台と並ぶ神戸 2 大夜景。摩耶ケーブル + 摩耶ロープウェイで山頂アクセス。観覧無料。",
    content_md:
      "- 標高:700 m\n- 1000 万ドルの夜景発祥地(1958)\n- 夜景百選\n- アクセス:摩耶ケーブル + ロープウェイ\n- 観覧無料\n- 2026-04 人工查核",
    region: "kansai",
    prefecture_ja: "兵庫県",
    gun_ja: null,
    municipality_ja: "神戸市",
    lg_code: "28100",
    area_types: ["mountain"],
    lat: 34.732,
    lon: 135.232,
    season_start: null,
    season_end: null,
    event_start: null,
    event_end: null,
    price_tier: 0,
    booking_window_days: null,
    closed_days: [],
    external_urls: {},
    tags: ["night_view", "maya", "kikuseidai", "1000man_dollar", "since_1958"],
    source: "manual",
  },

  // ══════════════════════════════════════════════════════════════════
  // K. 季節食材(3 筆)
  // ══════════════════════════════════════════════════════════════════
  {
    slug: "kinosaki-matsuba-gani-winter",
    category: "entertainment",
    sub_type: "seasonal_food",
    title_zh: "城崎温泉 松葉ガニ(11 月-3 月・但馬カニ食体験・温泉旅館宿泊コース)",
    title_ja: "城崎温泉 松葉ガニ",
    romaji: "Kinosaki Matsuba-gani",
    summary_zh:
      "11 月初 - 3 月末の解禁期に城崎温泉旅館で食べる松葉ガニ(雄ズワイガニ)料理。津居山港 + 香住港 + 浜坂港の但馬 3 港揚げの最高ブランド。1 泊 2 食でカニ会席 ¥30000-80000。冬の山陰側関西温泉旅行の定番。",
    content_md:
      "- 期間:11 月初 - 3 月末\n- 立地:城崎温泉旅館各館\n- 但馬 3 港:津居山 + 香住 + 浜坂\n- カニ会席:¥30000-80000(1 泊 2 食)\n- 2026-04 人工查核",
    region: "kansai",
    prefecture_ja: "兵庫県",
    gun_ja: null,
    municipality_ja: "豊岡市",
    lg_code: "28209",
    area_types: ["rural"],
    lat: 35.624,
    lon: 134.808,
    season_start: "2026-11-01",
    season_end: "2027-03-31",
    event_start: null,
    event_end: null,
    price_tier: 4,
    booking_window_days: 60,
    closed_days: [],
    external_urls: {},
    tags: ["seasonal_food", "matsuba_gani", "kinosaki", "winter", "tajima"],
    source: "manual",
  },
  {
    slug: "tajima-beef-tour",
    category: "entertainment",
    sub_type: "seasonal_food",
    title_zh: "但馬牛食体験(豊岡・養父・1300 年血統・神戸牛のルーツ)",
    title_ja: "但馬牛食体験",
    romaji: "Tajima-gyū Tour",
    summary_zh:
      "但馬地域(豊岡・養父・朝来 + 美方郡)で食べる但馬牛(神戸牛 + 松阪牛 + 近江牛のルーツ・1300 年血統)。各 旅館 + 専門店で焼肉 + ステーキ + すき焼き等の但馬牛会席。年中体験可能,城崎温泉宿泊と組合せ定番。",
    content_md:
      "- 立地:但馬地域(豊岡 + 養父 + 朝来)\n- 1300 年血統(神戸牛のルーツ)\n- 但馬牛会席:¥10000-30000\n- 年中体験可能\n- 2026-04 人工查核",
    region: "kansai",
    prefecture_ja: "兵庫県",
    gun_ja: null,
    municipality_ja: "豊岡市",
    lg_code: "28209",
    area_types: ["rural"],
    lat: 35.625,
    lon: 134.806,
    season_start: null,
    season_end: null,
    event_start: null,
    event_end: null,
    price_tier: 4,
    booking_window_days: 30,
    closed_days: [],
    external_urls: {},
    tags: ["seasonal_food", "tajima_beef", "kobe_origin", "1300yr_blood"],
    source: "manual",
  },
  {
    slug: "awaji-onion-summer",
    category: "entertainment",
    sub_type: "seasonal_food",
    title_zh: "淡路玉ねぎ食体験(5-7 月・全国 No.1 玉ねぎ・新玉ねぎサラダ + 玉ねぎ焼)",
    title_ja: "淡路玉ねぎ食体験",
    romaji: "Awaji Onion",
    summary_zh:
      "5-7 月収穫期の淡路玉ねぎ(全国生産 No.1)を食べる体験。新玉ねぎサラダ + 玉ねぎ焼 + 玉ねぎスープ + 玉ねぎソフトクリーム等の淡路島郷土料理。淡路島内 100 軒余の玉ねぎ料理店で年中提供だが,5-7 月新玉が最盛期。",
    content_md:
      "- 期間:5-7 月(新玉ねぎ最盛期)\n- 全国生産 No.1\n- 料理:サラダ + 玉ねぎ焼 + スープ + ソフトクリーム\n- 淡路島内 100 軒余\n- 2026-04 人工查核",
    region: "kansai",
    prefecture_ja: "兵庫県",
    gun_ja: null,
    municipality_ja: "淡路市",
    lg_code: "28226",
    area_types: ["rural", "coastal"],
    lat: 34.502,
    lon: 134.946,
    season_start: "2026-05-01",
    season_end: "2026-07-31",
    event_start: null,
    event_end: null,
    price_tier: 1,
    booking_window_days: null,
    closed_days: [],
    external_urls: {},
    tags: ["seasonal_food", "awaji_onion", "no1_japan", "summer"],
    source: "manual",
  },

  // ══════════════════════════════════════════════════════════════════
  // L. 神戸クルーズ・ロープウェイ(2 筆)
  // ══════════════════════════════════════════════════════════════════
  {
    slug: "shin-kobe-ropeway",
    category: "entertainment",
    sub_type: "theme_park",
    title_zh: "新神戸ロープウェイ(1991・新神戸 → 布引ハーブ園・神戸夜景)",
    title_ja: "新神戸ロープウェイ",
    romaji: "Shin-Kobe Ropeway",
    summary_zh:
      "1991 開業の新神戸駅 → 布引ハーブ園を結ぶロープウェイ。全長 1.46 km・所要 10 分。神戸市街 + 大阪湾の眺望が特色,夜は神戸夜景観賞ライドとして 21:00 までナイトロープウェイ運行。布引ハーブ園 + ロープウェイ往復 ¥2000。",
    content_md:
      "- 開業:1991\n- 全長:1.46 km・所要 10 分\n- 営業:9:30-21:00\n- 往復 + 入園:¥2000\n- 2026-04 人工查核",
    region: "kansai",
    prefecture_ja: "兵庫県",
    gun_ja: null,
    municipality_ja: "神戸市",
    lg_code: "28100",
    area_types: ["mountain"],
    lat: 34.708,
    lon: 135.197,
    season_start: null,
    season_end: null,
    event_start: null,
    event_end: null,
    price_tier: 2,
    booking_window_days: null,
    closed_days: [],
    external_urls: { official: "https://www.kobeherb.com/ropeway/" },
    tags: ["ropeway", "shin_kobe", "since_1991", "night_view"],
    source: "manual",
  },
  {
    slug: "kobe-bay-concerto-cruise",
    category: "entertainment",
    sub_type: "theme_park",
    title_zh: "神戸ベイクルーズ コンチェルト(1995・神戸港クルーズ + ディナーレストラン船)",
    title_ja: "神戸ベイクルーズ コンチェルト",
    romaji: "Kobe Bay Cruise Concerto",
    summary_zh:
      "1995 神戸メリケンパーク発の双胴客船型レストラン船。神戸港 + 明石海峡まで 2 時間クルーズ + フルコースディナー(¥10000-20000)+ ジャズ生演奏。神戸港夜景 + 明石海峡大橋ライトアップを船内ディナーで楽しむ高級体験。",
    content_md:
      "- 開業:1995\n- 出航:神戸メリケンパーク\n- 2 時間クルーズ + フルコース\n- 神戸港 + 明石海峡夜景\n- 価格:¥10000-20000(ディナー込)\n- 2026-04 人工查核",
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
    booking_window_days: 30,
    closed_days: [],
    external_urls: { official: "https://thekobecruise.com/concerto/" },
    tags: ["cruise", "concerto", "since_1995", "dinner_cruise"],
    source: "manual",
  },

  // ══════════════════════════════════════════════════════════════════
  // M. 竹田城雲海(1 筆)
  // ══════════════════════════════════════════════════════════════════
  {
    slug: "takeda-jo-unkai-autumn",
    category: "entertainment",
    sub_type: "theme_park",
    title_zh: "竹田城跡 雲海(秋早朝 9 月-12 月・天空の城絶景)",
    title_ja: "竹田城跡 雲海",
    romaji: "Takeda-jō Unkai",
    summary_zh:
      "竹田城跡(朝来市)の秋早朝(9 月-12 月・特に 11 月)の雲海絶景。山頂と雲海の標高差で『雲海に浮かぶ天空の城』が SNS 大ブーム。立雲峡(雲海展望台・竹田城向い側山)から見る構図が定番。早朝 5:00-7:00 がベストタイム。",
    content_md:
      "- 期間:9 月-12 月(11 月最盛)\n- 早朝:5:00-7:00\n- 立雲峡(展望台)から眺望\n- 入山:¥500\n- 2026-04 人工查核",
    region: "kansai",
    prefecture_ja: "兵庫県",
    gun_ja: null,
    municipality_ja: "朝来市",
    lg_code: "28225",
    area_types: ["mountain"],
    lat: 35.301,
    lon: 134.831,
    season_start: "2026-09-15",
    season_end: "2026-12-15",
    event_start: null,
    event_end: null,
    price_tier: 1,
    booking_window_days: null,
    closed_days: [],
    external_urls: {},
    tags: ["unkai", "takeda_jo", "autumn", "tenkuu_no_shiro", "sea_of_clouds"],
    source: "manual",
  },

  // ══════════════════════════════════════════════════════════════════
  // R2 expansion(2026-04-29・30 → 32)
  // ══════════════════════════════════════════════════════════════════
  {
    slug: "mt-rokko-cable-1932",
    category: "entertainment",
    sub_type: "theme_park",
    title_zh: "六甲ケーブル(1932 開業・現役最古ケーブル・六甲山頂アクセス)",
    title_ja: "六甲ケーブル",
    romaji: "Rokko Cable",
    summary_zh:
      "1932 開業の六甲山頂アクセスケーブルカー。日本現役最古ケーブルカーの一つで,93 年余の歴史。六甲ケーブル下駅 - 六甲山上駅の 1.7 km・標高差 493 m。1995 阪神淡路大震災で被災 → 1996 復旧。レトロデザイン車両で観光ライド体験。1 日乗車券 ¥1300。",
    content_md:
      "- 開業:1932(現役最古)\n- 区間:六甲ケーブル下 - 六甲山上\n- 全長:1.7 km・標高差 493 m\n- 1996 震災復旧\n- 1 日券:¥1300\n- 2026-04 人工查核",
    region: "kansai",
    prefecture_ja: "兵庫県",
    gun_ja: null,
    municipality_ja: "神戸市",
    lg_code: "28100",
    area_types: ["mountain"],
    lat: 34.726,
    lon: 135.250,
    season_start: null,
    season_end: null,
    event_start: null,
    event_end: null,
    price_tier: 2,
    booking_window_days: null,
    closed_days: [],
    external_urls: { official: "https://koberope.jp/rokko/" },
    tags: ["cable_car", "rokko", "since_1932", "oldest_japan"],
    source: "manual",
  },
  {
    slug: "maya-cable-1925",
    category: "entertainment",
    sub_type: "theme_park",
    title_zh: "摩耶ケーブル(1925 開業・日本最古現役ケーブル・摩耶山掬星台アクセス)",
    title_ja: "摩耶ケーブル",
    romaji: "Maya Cable",
    summary_zh:
      "1925 開業の摩耶山アクセス用ケーブルカー。日本最古の現役ケーブルカーで 100 年余の歴史。摩耶ケーブル駅 - 虹の駅 0.965 km・標高差 313 m。摩耶山掬星台(1000 万ドル夜景)アクセスのメイン交通。1995 震災で長期運休 → 2001 復旧。",
    content_md:
      "- 開業:1925(日本最古現役)\n- 区間:摩耶ケーブル駅 - 虹の駅\n- 全長:0.965 km・標高差 313 m\n- 1995 震災 → 2001 復旧\n- 摩耶山掬星台アクセス\n- 2026-04 人工查核",
    region: "kansai",
    prefecture_ja: "兵庫県",
    gun_ja: null,
    municipality_ja: "神戸市",
    lg_code: "28100",
    area_types: ["mountain"],
    lat: 34.711,
    lon: 135.218,
    season_start: null,
    season_end: null,
    event_start: null,
    event_end: null,
    price_tier: 2,
    booking_window_days: null,
    closed_days: [],
    external_urls: { official: "https://koberope.jp/maya/" },
    tags: ["cable_car", "maya", "since_1925", "oldest_japan_cable", "kikuseidai"],
    source: "manual",
  },

  // ══════════════════════════════════════════════════════════════════
  // R3 expansion(2026-04-29・32 → 33)
  // ══════════════════════════════════════════════════════════════════
  {
    slug: "kobe-doubutsu-okoku-2014",
    category: "entertainment",
    sub_type: "aquarium_zoo",
    title_zh: "神戸どうぶつ王国(2014・ポートアイランド・花鳥園 + 動物体験・神戸花鳥園リブランド)",
    title_ja: "神戸どうぶつ王国",
    romaji: "Kobe Animal Kingdom",
    summary_zh:
      "2014 ポートアイランドに開業の体験型動物園(前身は 2006 神戸花鳥園・2014 リブランド)。鳥(ペンギン + フクロウ + オウム)+ 哺乳類(カピバラ + アルパカ + ナマケモノ)の触れ合い + 餌やり体験。屋内型でも全天候型。三宮 → ポートライナー 16 分。家族向け。",
    content_md:
      "- 開業:2014(2006 神戸花鳥園リブランド)\n- 立地:ポートアイランド\n- 形式:屋内全天候 + 触れ合い\n- 入園:¥2200\n- 2026-04 人工查核",
    region: "kansai",
    prefecture_ja: "兵庫県",
    gun_ja: null,
    municipality_ja: "神戸市",
    lg_code: "28100",
    area_types: ["urban", "coastal"],
    lat: 34.660,
    lon: 135.221,
    season_start: null,
    season_end: null,
    event_start: null,
    event_end: null,
    price_tier: 3,
    booking_window_days: null,
    closed_days: [],
    external_urls: { official: "https://www.kobe-oukoku.com/" },
    tags: ["zoo", "kobe_okoku", "port_island", "since_2014", "family"],
    source: "manual",
  },

  // ══════════════════════════════════════════════════════════════════
  // R4 expansion(2026-04-29・33 → 34)
  // ══════════════════════════════════════════════════════════════════
  {
    slug: "mt-rokko-ranch-1976",
    category: "entertainment",
    sub_type: "theme_park",
    title_zh: "六甲山牧場(1976・六甲山頂・羊 + 馬 + チーズ館・標高 800 m 高原牧場)",
    title_ja: "六甲山牧場",
    romaji: "Mt. Rokko Ranch",
    summary_zh:
      "1976 六甲山頂(標高 800 m)に開園の都市近郊高原牧場。羊 + 馬 + 山羊 + 牛 + アヒル等の飼育 + 触れ合い + 乗馬 + チーズ館(自家製チーズ製造見学)+ ソフトクリーム。神戸からバス 30 分でアクセス可能の家族向け。",
    content_md:
      "- 開園:1976\n- 立地:六甲山頂(標高 800 m)\n- 動物:羊 + 馬 + 山羊 + 牛 + アヒル\n- チーズ館 + ソフトクリーム\n- 入園:¥600\n- 2026-04 人工查核",
    region: "kansai",
    prefecture_ja: "兵庫県",
    gun_ja: null,
    municipality_ja: "神戸市",
    lg_code: "28100",
    area_types: ["mountain"],
    lat: 34.766,
    lon: 135.243,
    season_start: null,
    season_end: null,
    event_start: null,
    event_end: null,
    price_tier: 1,
    booking_window_days: null,
    closed_days: [],
    external_urls: { official: "https://www.rokkosan.net/" },
    tags: ["ranch", "rokko", "since_1976", "highland", "family"],
    source: "manual",
  },

  // ══════════════════════════════════════════════════════════════════
  // R5 expansion(2026-04-29・34 → 36)
  // ══════════════════════════════════════════════════════════════════
  {
    slug: "mt-rokko-snow-park",
    category: "entertainment",
    sub_type: "theme_park",
    title_zh: "六甲山スノーパーク(冬期 12-3 月・関西最近のスキー + そり場・神戸からバス 30 分)",
    title_ja: "六甲山スノーパーク",
    romaji: "Mt. Rokko Snow Park",
    summary_zh:
      "六甲山頂に冬期(12 月初 - 3 月末)開設のスキー + そり遊び場。関西都心から最近(神戸三宮からバス 30 分)のスキー場で,人工雪と自然雪の併用。スキー教室 + そり遊び広場 + ソリ + 雪遊び。家族・ビギナー向け。",
    content_md:
      "- 期間:12 月初 - 3 月末\n- 立地:六甲山頂\n- 神戸からバス 30 分(関西最近)\n- 入場:¥1500-3000\n- 2026-04 人工查核",
    region: "kansai",
    prefecture_ja: "兵庫県",
    gun_ja: null,
    municipality_ja: "神戸市",
    lg_code: "28100",
    area_types: ["mountain"],
    lat: 34.776,
    lon: 135.252,
    season_start: "2026-12-01",
    season_end: "2027-03-31",
    event_start: null,
    event_end: null,
    price_tier: 2,
    booking_window_days: null,
    closed_days: [],
    external_urls: { official: "https://www.rokkosan.com/ski/" },
    tags: ["ski_resort", "rokko", "snow_park", "winter_kansai_nearest"],
    source: "manual",
  },
  {
    slug: "takarazuka-grand-theater-1924",
    category: "entertainment",
    sub_type: "theme_park",
    title_zh: "宝塚大劇場(1924 創建・現館 1993 再建・宝塚歌劇のメイン・全国唯一の女性のみ歌劇団)",
    title_ja: "宝塚大劇場",
    romaji: "Takarazuka Grand Theater",
    summary_zh:
      "1914 阪急電鉄創業者小林一三が創設の宝塚歌劇のメイン劇場。1924 大劇場建設 → 1993 全面建替で現館(2553 席)。年中『花・月・雪・星・宙』5 組編成で年中公演。世界唯一の女性のみ大歌劇団。年間 130 万人観劇。",
    content_md:
      "- 1914 創設(阪急小林一三)\n- 1993 現館再建\n- 収容:2553 席\n- 5 組:花月雪星宙\n- 年間動員:130 万人\n- 観劇:¥3500-12000\n- 2026-04 人工查核",
    region: "kansai",
    prefecture_ja: "兵庫県",
    gun_ja: null,
    municipality_ja: "宝塚市",
    lg_code: "28214",
    area_types: ["urban"],
    lat: 34.808,
    lon: 135.349,
    season_start: null,
    season_end: null,
    event_start: null,
    event_end: null,
    price_tier: 3,
    booking_window_days: 60,
    closed_days: [],
    external_urls: { official: "https://kageki.hankyu.co.jp/theater/index.html" },
    tags: ["theater", "takarazuka", "since_1914", "all_female", "kobayashi_ichizo"],
    source: "manual",
  },

  // ══════════════════════════════════════════════════════════════════
  // R6 expansion(2026-04-29・36 → 37)
  // ══════════════════════════════════════════════════════════════════
  {
    slug: "kasai-flower-center-1985",
    category: "entertainment",
    sub_type: "flower_field",
    title_zh: "兵庫県立フラワーセンター(1985・加西・年中花暦・西日本最大級植物園)",
    title_ja: "兵庫県立フラワーセンター",
    romaji: "Hyōgo Furitsu Flower Center",
    summary_zh:
      "1985 加西市豊倉町に開園の兵庫県立植物園。31 ha の広大敷地で年中花暦展開。春チューリップ(20 万球)+ 夏ひまわり + 秋コスモス(15 万本)+ 冬ロウバイ。温室 + 池 + フラワーロードの構成で関西屈指の花の名所。",
    content_md:
      "- 開園:1985\n- 立地:加西市豊倉町\n- 面積:31 ha\n- 春チューリップ:20 万球\n- 秋コスモス:15 万本\n- 入園:¥520\n- 2026-04 人工查核",
    region: "kansai",
    prefecture_ja: "兵庫県",
    gun_ja: null,
    municipality_ja: "加西市",
    lg_code: "28220",
    area_types: ["rural"],
    lat: 34.917,
    lon: 134.799,
    season_start: null,
    season_end: null,
    event_start: null,
    event_end: null,
    price_tier: 1,
    booking_window_days: null,
    closed_days: ["tue"],
    external_urls: { official: "https://flower-center.com/" },
    tags: ["flower_field", "kasai_flower", "since_1985", "tulip", "cosmos"],
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

// Seed 兵庫 R3 + 静岡 R8 補完(10 筆 / Sprint 29.x)
//
// 兵庫 +5:三田牛・たつの皮革・神戸マリオット 2024・出石城跡・有馬湯巡り
// 静岡 +5:田子の浦港・沼津港料理・下田黒船クルーズ・静岡浅間神社・静岡市歴史博物館 2023

import { config as loadEnv } from "dotenv";
loadEnv({ path: ".env.local" });

import { createAdminClient } from "../src/lib/supabase/admin";

const DRY = process.argv.includes("--dry-run");

interface SeedRow {
  slug: string;
  category: string;
  sub_type: string;
  title_zh: string;
  title_ja: string | null;
  romaji: string | null;
  summary_zh: string;
  content_md: string | null;
  region: string;
  prefecture_ja: string;
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
  // ════════════════════════════════════════════════════════════════════
  // 兵庫 R3 (5)
  // ════════════════════════════════════════════════════════════════════
  {
    slug: "sanda-gyu-overview",
    category: "food",
    sub_type: "local_specialty",
    title_zh: "三田牛(神戸牛元祖系統・三田市・但馬牛子牛 → 三田肥育・年 200 頭限定の超希少和牛)",
    title_ja: "三田牛",
    romaji: "Sanda Gyu",
    summary_zh: "**三田牛は神戸牛+ 但馬牛と並ぶ兵庫高級和牛の一つ**(三田市)。但馬牛の子牛を三田で肥育する伝統製法で、**年間 200 頭程度しか生産されない超希少和牛**。神戸牛の前身的存在で、明治期に「神戸ビーフ」と呼ばれ西洋人を虜にした原型。三田市内のステーキハウス+ 鉄板焼で提供、知る人ぞ知る最高級和牛。",
    content_md: "- 産地:三田市(但馬牛子牛 → 三田肥育)\n- 年間生産:約 200 頭(超希少)\n- 史的価値:神戸牛の前身・明治期「神戸ビーフ」の原型\n- 提供店:三田市内 ステーキハウス+ 鉄板焼\n- 価格目安:ステーキ ¥8000-+ ディナー ¥15000-\n- アクセス:JR 福知山線 三田駅 徒歩 / 車",
    region: "kansai",
    prefecture_ja: "兵庫県",
    gun_ja: null,
    municipality_ja: "三田市",
    lg_code: "28219",
    area_types: ["restaurant_traditional"],
    lat: 34.8867,
    lon: 135.2278,
    season_start: null,
    season_end: null,
    event_start: null,
    event_end: null,
    price_tier: 4,
    booking_window_days: 7,
    closed_days: [],
    external_urls: {},
    tags: ["local_specialty", "sanda_gyu", "kobe_beef_origin", "200_per_year", "tajima_calf"],
    source: "manual",
  },
  {
    slug: "tatsuno-leather-overview",
    category: "fashion",
    sub_type: "craft_goods",
    title_zh: "たつの皮革(全国 8 割生産・1860 年代起源・揖保川氾濫原+ 軟水で皮革加工に最適)",
    title_ja: "たつの皮革",
    romaji: "Tatsuno Leather",
    summary_zh: "**たつのは全国皮革加工 8 割を占める最大産地**(たつの市)。1860 年代から揖保川氾濫原+ 軟水で皮革加工が発展、現代も国内革製品の大半が当地で加工。**履物+ ベルト+ バッグ+ ランドセル革** が主力、皮革専門店+ 工房見学+ 革製品ファクトリーアウトレット可能。",
    content_md: "- 産地:たつの市(全国皮革加工 80%+)\n- 起源:1860 年代(揖保川氾濫原+ 軟水)\n- 主要製品:履物+ ベルト+ バッグ+ ランドセル革\n- 工房見学:複数事業者(要予約)\n- 価格帯:革製品 ¥5000-50000\n- 営業:店舗による(10:00-18:00 が標準)\n- アクセス:JR 姫新線 本竜野駅 徒歩 / 車",
    region: "kansai",
    prefecture_ja: "兵庫県",
    gun_ja: null,
    municipality_ja: "たつの市",
    lg_code: "28229",
    area_types: ["historic_district"],
    lat: 34.8581,
    lon: 134.5478,
    season_start: null,
    season_end: null,
    event_start: null,
    event_end: null,
    price_tier: 3,
    booking_window_days: null,
    closed_days: [],
    external_urls: {},
    tags: ["craft_goods", "tatsuno_leather", "national_80_percent", "1860s_origin", "soft_water"],
    source: "manual",
  },
  {
    slug: "kobe-marriott-2024",
    category: "lodging",
    sub_type: "luxury_hotel",
    title_zh: "コートヤード神戸三宮(2024 開業・JR 三宮駅徒歩 5 分・マリオット系列・138 室)",
    title_ja: "コートヤード神戸三宮",
    romaji: "Courtyard Kobe Sannomiya",
    summary_zh: "**コートヤード神戸三宮は 2024 年 5 月開業の最新マリオット系列ホテル**(神戸市中央区・138 室)。JR 三宮駅徒歩 5 分の好立地、コートヤード(マリオット中堅クラス)で R1 既出の ana-crowne-plaza-kobe-1990 + bay-sheraton-kobe-1992 に並ぶ国際ブランド神戸の最新参入。観光+ ビジネス両用、駅前再開発の象徴。",
    content_md: "- 開業:2024 年 5 月\n- 立地:神戸市中央区(JR 三宮駅 徒歩 5 分)\n- 室数:138 室\n- ブランド:コートヤード(マリオット中堅)\n- 料金目安:¥18000-32000/泊\n- 隣接:旧居留地+ 元町商店街+ 南京町(R2 衣)\n- アクセス:JR 三宮駅 徒歩 5 分",
    region: "kansai",
    prefecture_ja: "兵庫県",
    gun_ja: null,
    municipality_ja: "神戸市",
    lg_code: "28100",
    area_types: ["urban_central"],
    lat: 34.6906,
    lon: 135.1956,
    season_start: null,
    season_end: null,
    event_start: null,
    event_end: null,
    price_tier: 3,
    booking_window_days: 30,
    closed_days: [],
    external_urls: { official: "https://www.marriott.com/" },
    tags: ["luxury_hotel", "courtyard_kobe", "2024", "marriott", "138_rooms"],
    source: "manual",
  },
  {
    slug: "izushi-castle-1604",
    category: "culture",
    sub_type: "history_site_castle",
    title_zh: "出石城跡(豊岡市・1604 小出吉政築城・続日本 100 名城・但馬の小京都の象徴)",
    title_ja: "出石城跡",
    romaji: "Izushi Jou Ato",
    summary_zh: "**出石城跡は但馬の小京都「出石」の城跡**(豊岡市出石町・1604 築城・続日本 100 名城)。**小出吉政築城**、廃藩置県(1871)で廃城・現存は石垣+ 隅櫓のみ。**辰鼓楼**(1871・出石町中心) + 出石そば(R2 食 izushi-soba-tachibanaya-1924)+ 出石永楽館(R1 既出 eirakukan-izushi-1901)と一体の城下町散策。",
    content_md: "- 築城:1604 年(慶長 9)・小出吉政\n- 廃城:1871 年(明治 4)\n- 続日本 100 名城:第 161 番(2018 選定)\n- 現存:石垣+ 隅櫓+ 辰鼓楼(1871 隣接)\n- 入場:無料(常時)\n- 隣接:辰鼓楼+ 出石そば老舗(R2 食 tachibanaya)+ 出石永楽館(R1)\n- アクセス:JR 山陰本線 豊岡駅 から バス 30 分・出石下車",
    region: "kansai",
    prefecture_ja: "兵庫県",
    gun_ja: null,
    municipality_ja: "豊岡市",
    lg_code: "28209",
    area_types: ["history_site_castle"],
    lat: 35.4583,
    lon: 134.8722,
    season_start: null,
    season_end: null,
    event_start: null,
    event_end: null,
    price_tier: 1,
    booking_window_days: null,
    closed_days: [],
    external_urls: {},
    tags: ["history_site_castle", "izushi_jou", "1604", "100_castles_2", "tajima_kyoto"],
    source: "manual",
  },
  {
    slug: "arima-yumeguri-tour",
    category: "entertainment",
    sub_type: "hyogo_arima_yu",
    title_zh: "有馬温泉湯巡り(R1 既出 金の湯+ 銀の湯 公衆湯+ 私湯巡り・3 大古泉本場体験)",
    title_ja: "有馬温泉湯巡り",
    romaji: "Arima Yumeguri",
    summary_zh: "**有馬温泉湯巡りは三大古泉本場の温泉体験**(神戸市北区有馬町)。R1 既出 arima-kin-no-yu(金の湯)+ arima-gin-no-yu(銀の湯)の公衆湯 + 私湯(各旅館の日帰り入浴)を巡る半日コース。**金泉+ 銀泉の両浴**(金泉=含鉄塩化物・茶褐色 / 銀泉=炭酸+ ラジウム・透明)で泉質の違いを体感。",
    content_md: "- 立地:神戸市北区有馬町\n- 公衆湯 2 ヶ所:金の湯(¥650)+ 銀の湯(¥550)\n- 私湯巡り:各旅館の日帰り入浴(¥1000-2500)\n- 金泉:含鉄塩化物泉(茶褐色)\n- 銀泉:炭酸+ ラジウム泉(透明)\n- 半日コース:金 → 私湯 → 銀(2-3 時間)\n- 主要旅館:R1 御所坊・R2 月光園游月山荘 等\n- アクセス:神鉄有馬温泉駅 徒歩 5 分",
    region: "kansai",
    prefecture_ja: "兵庫県",
    gun_ja: null,
    municipality_ja: "神戸市",
    lg_code: "28100",
    area_types: ["onsen_field"],
    lat: 34.7975,
    lon: 135.2467,
    season_start: null,
    season_end: null,
    event_start: null,
    event_end: null,
    price_tier: 2,
    booking_window_days: null,
    closed_days: [],
    external_urls: {},
    tags: ["hyogo_arima_yu", "yumeguri", "kin_gin_sen", "3_kosen", "half_day_course"],
    source: "manual",
  },

  // ════════════════════════════════════════════════════════════════════
  // 静岡 R8 (5)
  // ════════════════════════════════════════════════════════════════════
  {
    slug: "tagonoura-port-fuji",
    category: "entertainment",
    sub_type: "shizuoka_fujisan_view",
    title_zh: "田子の浦港(富士市・富士山+ 駿河湾シラス漁港+ サンセット絶景・万葉集和歌「田子の浦ゆ」舞台)",
    title_ja: "田子の浦港",
    romaji: "Tagonoura Port",
    summary_zh: "**田子の浦港は万葉集名所+ 富士山絶景漁港**(富士市)。山部赤人「田子の浦ゆ うち出でて見れば真白にぞ 富士の高嶺に雪は降りける」の和歌舞台、駿河湾シラス漁港でもある。**富士山+ 駿河湾+ 漁港の三位一体絶景**、夕陽時刻+ 早朝シラス漁観察が最ベスト。",
    content_md: "- 立地:富士市(駿河湾沿岸)\n- 万葉集:山部赤人「田子の浦ゆ うち出でて見れば真白にぞ 富士の高嶺に雪は降りける」\n- 漁業:駿河湾シラス漁港\n- 眺望:富士山+ 駿河湾+ 漁港(三位一体)\n- ベスト時間:早朝(漁業)+ 夕陽\n- 入場:無料(常時)\n- 隣接:富士市街+ 富士川河口\n- アクセス:JR 東海道本線 吉原駅 徒歩 / 車 10 分",
    region: "chubu",
    prefecture_ja: "静岡県",
    gun_ja: null,
    municipality_ja: "富士市",
    lg_code: "22210",
    area_types: ["scenic_spot", "fishing_port"],
    lat: 35.1389,
    lon: 138.6939,
    season_start: null,
    season_end: null,
    event_start: null,
    event_end: null,
    price_tier: 1,
    booking_window_days: null,
    closed_days: [],
    external_urls: {},
    tags: ["shizuoka_fujisan_view", "tagonoura_port", "manyoshu_yamabe", "shirasu_port", "sunset_spot"],
    source: "manual",
  },
  {
    slug: "numazu-port-cuisine-area",
    category: "food",
    sub_type: "local_specialty",
    title_zh: "沼津港食堂街(駿河湾深海魚+ シラス・タチウオ・キンメダイ・全国屈指食堂集積)",
    title_ja: "沼津港食堂街",
    romaji: "Numazu Port Cuisine",
    summary_zh: "**沼津港は駿河湾深海魚の宝庫+ 食堂集積エリア**(沼津市・R1 既出 numazu-shinkai-aquarium 隣接)。駿河湾は日本一深い湾で **タカアシガニ+ キンメダイ+ シラス+ アジ+ サクラエビ等の深海+ 沿岸魚介を 1 か所で**、港隣の沼津港大型観覧車「びゅうお」+ 港食堂街で観光客に人気。",
    content_md: "- 立地:沼津市(駿河湾岸沼津港)\n- 主要魚介:タカアシガニ+ キンメダイ+ シラス+ アジ+ サクラエビ\n- 食堂数:30+ 軒(港隣)\n- 名物:深海魚刺身+ 海鮮丼+ アジフライ+ シラス丼\n- 価格目安:海鮮丼 ¥1500-3500・コース ¥3500-8000\n- 営業:店舗による(10:00-21:00 が標準)\n- 隣接:沼津港大型水族館(R1)+ 沼津港大型観覧車びゅうお\n- アクセス:JR 沼津駅 から バス 15 分・沼津港下車",
    region: "chubu",
    prefecture_ja: "静岡県",
    gun_ja: null,
    municipality_ja: "沼津市",
    lg_code: "22203",
    area_types: ["restaurant_traditional", "fishing_port"],
    lat: 35.0883,
    lon: 138.8650,
    season_start: null,
    season_end: null,
    event_start: null,
    event_end: null,
    price_tier: 3,
    booking_window_days: null,
    closed_days: [],
    external_urls: {},
    tags: ["local_specialty", "numazu_port", "deep_sea_fish", "30_restaurants", "takaashi_kani"],
    source: "manual",
  },
  {
    slug: "shimoda-bay-cruise",
    category: "entertainment",
    sub_type: "shizuoka_nature_spot",
    title_zh: "下田黒船クルーズ(下田港・1853 ペリー来航地・サスケハナ号復元船+ 50 分湾内クルーズ)",
    title_ja: "下田黒船クルーズ",
    romaji: "Shimoda Black Ship Cruise",
    summary_zh: "**下田黒船クルーズはペリー来航地の歴史テーマ船**(下田市・1853 ペリー来航 場所)。**サスケハナ号復元船**(全長 27 m)で下田湾内 50 分クルーズ、ペリーロード+ 開国記念碑+ 寝姿山+ 弁天島等を海上から観賞。R1 既出 shimoda-perry-road + shimoda-kurofune-matsuri-1934 と併せた下田開国観光ハイライト。",
    content_md: "- 運営:伊豆クルーズ(株)\n- 船:サスケハナ号復元船(全長 27 m)\n- 所要:50 分(下田湾周遊)\n- 料金:¥1500(大人・子供 ¥800)\n- 出発地:下田港(下田駅 徒歩 15 分)\n- 1 日本数:5-6 便\n- 主要見所:ペリーロード(R1)+ 開国記念碑+ 寝姿山+ 弁天島\n- アクセス:伊豆急 下田駅 徒歩 15 分",
    region: "chubu",
    prefecture_ja: "静岡県",
    gun_ja: null,
    municipality_ja: "下田市",
    lg_code: "22219",
    area_types: ["activity_water"],
    lat: 34.6794,
    lon: 138.9447,
    season_start: null,
    season_end: null,
    event_start: null,
    event_end: null,
    price_tier: 2,
    booking_window_days: 7,
    closed_days: [],
    external_urls: { official: "https://izu-kamori.jp/izu-cruise/" },
    tags: ["shizuoka_nature_spot", "shimoda_kurofune_cruise", "1853_perry", "susquehanna", "50min"],
    source: "manual",
  },
  {
    slug: "shizuoka-asama-jinja-3sha",
    category: "culture",
    sub_type: "shizuoka_tokugawa",
    title_zh: "静岡浅間神社三社(神部神社+ 大歳御祖神社+ 浅間神社・徳川家康元服祭祀地・国重文 13 棟)",
    title_ja: "静岡浅間神社",
    romaji: "Shizuoka Asama Jinja",
    summary_zh: "**静岡浅間神社は徳川家康元服祭祀地+ 国重要文化財 13 棟の神社群**(静岡市・3 社一体)。**神部神社+ 大歳御祖神社+ 浅間神社の 3 社が同境内に並立**、徳川家康が幼少時(駿府)+ 元服(1556)祭祀した家康ゆかりの神社。境内の本殿+ 拝殿+ 楼門等 13 棟が国指定重要文化財、駿府城+ 久能山東照宮(R7 育)と並ぶ徳川家康関連 3 大社。",
    content_md: "- 構成:神部神社+ 大歳御祖神社+ 浅間神社(3 社一体)\n- 史的価値:徳川家康幼少+ 元服(1556)祭祀地\n- 国指定重要文化財:13 棟(本殿+ 拝殿+ 楼門+ 舞殿 等)\n- 立地:静岡市葵区宮ヶ崎町\n- 祭礼:5/5 元服式・10/4-6 浅間神社秋祭\n- 入場:無料\n- 隣接:駿府城公園(R1)+ 久能山東照宮(R7・車 30 分)\n- アクセス:JR 静岡駅 から バス 10 分・赤鳥居公園入口下車",
    region: "chubu",
    prefecture_ja: "静岡県",
    gun_ja: null,
    municipality_ja: "静岡市",
    lg_code: "22100",
    area_types: ["shrine_temple"],
    lat: 34.9856,
    lon: 138.3719,
    season_start: null,
    season_end: null,
    event_start: null,
    event_end: null,
    price_tier: 1,
    booking_window_days: null,
    closed_days: [],
    external_urls: {},
    tags: ["shizuoka_tokugawa", "shizuoka_asama_jinja", "3_shrines", "13_cultural_property", "ieyasu_genpuku"],
    source: "manual",
  },
  {
    slug: "shizuoka-rekishi-bunkakan-2023",
    category: "culture",
    sub_type: "museum_art",
    title_zh: "静岡市歴史博物館(2023 開館・駿府城跡隣接・徳川家康+ 駿府城下町総合・新規 hub)",
    title_ja: "静岡市歴史博物館",
    romaji: "Shizuoka Rekishi Bunkakan",
    summary_zh: "**静岡市歴史博物館は 2023 年 1 月開館の最新博物館**(静岡市・駿府城跡隣接)。**徳川家康+ 駿府城下町+ 静岡近代史を体系的に展示**、戦国-江戸-明治の連続性を示す。家康ゆかり地ツアー(久能山東照宮 R7+ 静岡浅間神社 R8)の起点 hub、駿府城公園+ 静岡県立美術館と一体の歴史散策コース。",
    content_md: "- 開館:2023 年(令和 5)1 月 13 日\n- 立地:静岡市葵区追手町(駿府城跡隣接)\n- 主要展示:徳川家康+ 駿府城下町+ 静岡近代史\n- 入館料:¥600\n- 営業:9:00-18:00(月曜定休)\n- 隣接:駿府城公園(R1)+ 静岡浅間神社(R8 育・車 5 分)+ 久能山東照宮(R7 育・車 30 分)\n- アクセス:JR 静岡駅 徒歩 15 分(車 5 分)",
    region: "chubu",
    prefecture_ja: "静岡県",
    gun_ja: null,
    municipality_ja: "静岡市",
    lg_code: "22100",
    area_types: ["museum_art"],
    lat: 34.9806,
    lon: 138.3833,
    season_start: null,
    season_end: null,
    event_start: null,
    event_end: null,
    price_tier: 1,
    booking_window_days: null,
    closed_days: ["mon"],
    external_urls: { official: "https://scmh.jp/" },
    tags: ["museum_art", "shizuoka_rekishi", "2023_open", "ieyasu_sumpu", "newest_museum"],
    source: "manual",
  },
];

async function main() {
  if (rows.length === 0) {
    console.log("[hyogo-r3-shizuoka-r8] 尚無條目");
    return;
  }
  console.log(`[hyogo-r3-shizuoka-r8] ${rows.length} 筆 ${DRY ? "(dry-run)" : ""}`);
  if (DRY) {
    const byPref = new Map<string, number>();
    for (const r of rows) byPref.set(r.prefecture_ja, (byPref.get(r.prefecture_ja) ?? 0) + 1);
    for (const [k, v] of [...byPref.entries()].sort()) {
      console.log(`  ${k.padEnd(8)} ${v}`);
    }
    return;
  }
  const sb = createAdminClient();
  const CHUNK = 50;
  let written = 0;
  for (let i = 0; i < rows.length; i += CHUNK) {
    const batch = rows.slice(i, i + CHUNK);
    const { error } = await sb.from("japan_entries").upsert(batch as any, { onConflict: "slug" });
    if (error) {
      console.error("[hyogo-r3-shizuoka-r8] upsert failed:", error);
      process.exit(1);
    }
    written += batch.length;
    process.stdout.write(`\r[hyogo-r3-shizuoka-r8] upsert: ${written}/${rows.length}`);
  }
  process.stdout.write("\n");
  console.log(`[hyogo-r3-shizuoka-r8] Done — ${written} rows.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

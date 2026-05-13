// Seed 長崎県 · 樂類 R2 條目 → public.japan_entries(Sprint 21.5)
// 季節祭礼 + 観潮船 + ロープウェイ自然
//
// 5 筆構成:
//   1. 島原水まつり(8 月)
//   2. 五島椿まつり(2 月)
//   3. 平戸おくんち(10 月・国重要民俗 1991)
//   4. 西海橋大渦観潮船(春秋)
//   5. 雲仙ロープウェイ(年中)

import { config as loadEnv } from "dotenv";
loadEnv({ path: ".env.local" });

import { createAdminClient } from "../src/lib/supabase/admin";

const DRY = process.argv.includes("--dry-run");

type SubType =
  | "nagasaki_lantern_fest"
  | "nagasaki_kujukushima_marine"
  | "nagasaki_unzen_jigoku"
  | "flower_field"
  | "ancient_festival";

interface SeedRow {
  slug: string;
  category: "entertainment";
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
    slug: "shimabara-mizu-matsuri-aug",
    category: "entertainment",
    sub_type: "nagasaki_lantern_fest",
    title_zh: "島原水まつり(8 月第 1 週末・島原湧水祭+ 鯉の泳ぐまち+ 子どもびっくり水合戦)",
    title_ja: "島原水まつり",
    romaji: "Shimabara Mizu Matsuri",
    summary_zh: "**島原水まつりは島原湧水文化を祝う夏祭り**(8 月第 1 週末・島原市)。**島原は名水百選** + 街中の用水路を鯉が泳ぐ「鯉の泳ぐまち」が有名、その水文化を祝う 2 日間。子どもびっくり水合戦+ 流しそうめん+ 湧水バー+ ステージイベント等。武家屋敷+ 鯉の泳ぐまちエリアが主会場。",
    content_md: "- 開催:8 月第 1 週末(土日・2 日間)\n- 主会場:島原市新町+ 鯉の泳ぐまち+ 武家屋敷エリア\n- 主要イベント:子どもびっくり水合戦+ 流しそうめん+ 湧水バー+ ステージ\n- 文化背景:島原湧水(名水百選 1985)+ 鯉の泳ぐまち\n- 入場:無料(イベント+ 一部体験有料)\n- 隣接:島原城(徒歩 8 分)+ 島原温泉\n- アクセス:島原鉄道 島原駅 徒歩 5 分",
    region: "kyushu",
    prefecture_ja: "長崎県",
    gun_ja: null,
    municipality_ja: "島原市",
    lg_code: "42203",
    area_types: ["festival_event"],
    lat: 32.7867,
    lon: 130.3611,
    season_start: null,
    season_end: null,
    event_start: "2026-08-01",
    event_end: "2026-08-02",
    price_tier: 1,
    booking_window_days: null,
    closed_days: [],
    external_urls: { official: "https://www.city.shimabara.lg.jp/" },
    tags: ["nagasaki_lantern_fest", "shimabara_yusui", "august", "water_war", "meisui_100"],
    source: "manual",
  },
  {
    slug: "goto-tsubaki-fest-feb",
    category: "entertainment",
    sub_type: "flower_field",
    title_zh: "五島椿まつり(2 月下旬-3 月上旬・福江島+ 久賀島+ 奈留島椿祭・椿油+ 椿染体験)",
    title_ja: "五島椿まつり",
    romaji: "Goto Tsubaki Matsuri",
    summary_zh: "**五島椿まつりは五島列島の椿文化を祝う早春祭**(2 月下旬-3 月上旬・五島市)。五島は **国内屈指の椿生産地**(全国 3 位・約 2 万本ヤブツバキ)、特に久賀島・奈留島・福江島で野生椿が見事。椿油搾り体験+ 椿染体験+ 椿スイーツ+ 椿園ガイドツアー等多数イベント。",
    content_md: "- 開催:2 月下旬-3 月上旬(2 週間)\n- 主会場:五島市福江島+ 久賀島+ 奈留島\n- 五島椿:全国 3 位(約 2 万本ヤブツバキ)・国内屈指\n- 主要体験:椿油搾り(¥1500)+ 椿染(¥3000)+ 椿園ガイドツアー(無料-)+ 椿スイーツ\n- 椿園:鬼岳椿園(無料)+ 椿の里(玉之浦)\n- 入場:多くは無料・体験別料金\n- 隣接:鬼岳(R1 樂)+ 福江城跡\n- アクセス:長崎港 から ジェットフォイル 1 時間 25 分・福江港 徒歩 / レンタカー",
    region: "kyushu",
    prefecture_ja: "長崎県",
    gun_ja: null,
    municipality_ja: "五島市",
    lg_code: "42211",
    area_types: ["festival_event", "flower_field"],
    lat: 32.6938,
    lon: 128.8336,
    season_start: null,
    season_end: null,
    event_start: "2026-02-21",
    event_end: "2026-03-08",
    price_tier: 2,
    booking_window_days: 30,
    closed_days: [],
    external_urls: { official: "https://goto.nagasaki-tabinet.com/" },
    tags: ["flower_field", "tsubaki_fest", "february", "20000_camellias", "national_3rd"],
    source: "manual",
  },
  {
    slug: "hirado-okuncchi-oct",
    category: "entertainment",
    sub_type: "ancient_festival",
    title_zh: "平戸おくんち(亀岡神社例大祭・10 月 26 日・国指定無形民俗文化財 1991・平戸城下練り歩き)",
    title_ja: "平戸おくんち",
    romaji: "Hirado Okuncchi",
    summary_zh: "**平戸おくんちは亀岡神社例大祭+ 国指定重要無形民俗文化財**(10 月 24-27 日・平戸市・1991 指定)。長崎くんち(諏訪神社)とは別系統の平戸城下祭、**ジャンガラ踊り**(国指定 1987)+ 大名行列+ 神輿渡御+ 獅子舞 等。長崎くんち(都市中華風)に対し平戸おくんち(城下武家風)で対比、地元民信仰深く独特の落ち着き。",
    content_md: "- 開催:10 月 24-27 日(4 日間)\n- 神社:亀岡神社(平戸城内)\n- 認定:国指定重要無形民俗文化財(1991 年・本祭+ ジャンガラ踊りは 1987 別途指定)\n- 演目:ジャンガラ踊り+ 大名行列+ 神輿渡御+ 獅子舞+ 舞踊奉納\n- 比較:長崎くんち(都市中華風)vs 平戸おくんち(城下武家風)\n- 入場:無料(平戸城下+ 亀岡神社境内)\n- 隣接:平戸城(徒歩 1 分)+ 松浦史料博物館(徒歩 5 分)\n- アクセス:松浦鉄道 たびら平戸口駅 から バス 30 分・平戸桟橋 徒歩 10 分",
    region: "kyushu",
    prefecture_ja: "長崎県",
    gun_ja: null,
    municipality_ja: "平戸市",
    lg_code: "42207",
    area_types: ["festival_event"],
    lat: 33.3683,
    lon: 129.5497,
    season_start: null,
    season_end: null,
    event_start: "2026-10-24",
    event_end: "2026-10-27",
    price_tier: 1,
    booking_window_days: 30,
    closed_days: [],
    external_urls: {},
    tags: ["ancient_festival", "hirado_okuncchi", "national_intangible_cultural_property", "1991", "kameoka_shrine"],
    source: "manual",
  },
  {
    slug: "saikai-uzu-spring-tour",
    category: "entertainment",
    sub_type: "nagasaki_kujukushima_marine",
    title_zh: "西海橋大渦観潮船(3-4 月+9-10 月大潮・直径 5m 級渦潮・うずしお観潮船 30 分)",
    title_ja: "西海橋うずしお観潮船",
    romaji: "Saikai Uzushio Cruise",
    summary_zh: "**西海橋大渦観潮船は針尾瀬戸の大渦を間近で観賞する遊覧船**(西海市・春+秋大潮限定)。直径 5 m 級の渦潮+ 西海橋(1955)+ 新西海橋(2006)を真下から見上げる迫力。所要 30 分・¥1500、満潮+ 干潮の前後 1 時間が最ベスト。3-4 月+ 9-10 月の大潮日のみ運航(月により 4-8 日)。",
    content_md: "- 期間:3-4 月+ 9-10 月の大潮日のみ\n- 所要:30 分\n- 料金:¥1500(大人・子供 ¥750)\n- 出発地:西海橋公園内 観潮船桟橋\n- ベスト:満潮+ 干潮の前後 1 時間(海況により変動)\n- 渦規模:直径 5 m 級(春秋大潮時)\n- 観覧:橋上+ 公園展望台 から 無料・船で渦の真上が最迫力\n- 注意:海況不良時欠航・予備日推奨\n- アクセス:佐世保駅 から バス 50 分・西海橋公園下車",
    region: "kyushu",
    prefecture_ja: "長崎県",
    gun_ja: null,
    municipality_ja: "西海市",
    lg_code: "42212",
    area_types: ["activity_water"],
    lat: 33.0411,
    lon: 129.7681,
    season_start: "2026-03-01",
    season_end: "2026-10-31",
    event_start: null,
    event_end: null,
    price_tier: 2,
    booking_window_days: 7,
    closed_days: [],
    external_urls: { official: "https://saikaibashi.com/" },
    tags: ["nagasaki_kujukushima_marine", "uzushio", "spring_autumn_tide", "5m_uzu", "30min"],
    source: "manual",
  },
  {
    slug: "unzen-ropeway-1957",
    category: "entertainment",
    sub_type: "nagasaki_unzen_jigoku",
    title_zh: "雲仙ロープウェイ(1957 開業・仁田峠-妙見岳 3 分・標高 1330m・360 度パノラマ)",
    title_ja: "雲仙ロープウェイ",
    romaji: "Unzen Ropeway",
    summary_zh: "**雲仙ロープウェイは仁田峠-妙見岳を 3 分で結ぶ観光索道**(雲仙市・1957 開業)。仁田峠駅(1080 m)から妙見岳駅(1330 m)へ、終点から平成新山+ 普賢岳+ 諫早湾+ 有明海の 360 度パノラマ。**春ミヤマキリシマ(5 月中旬)・秋紅葉(10 月下旬)・冬樹氷(1-2 月)** の 3 大季節観光、年間を通じて運行。",
    content_md: "- 開業:1957 年(昭和 32)\n- 区間:仁田峠駅(1080 m)→ 妙見岳駅(1330 m)\n- 所要:3 分\n- 料金:往復 ¥1290(片道 ¥730)\n- 営業:8:30-17:30(冬季 17:00)\n- 季節観光:春ミヤマキリシマ(5 月中旬)+ 秋紅葉(10 月下旬・R1 出済)+ 冬樹氷(1-2 月)\n- 妙見岳駅:展望デッキ+ 売店・360 度パノラマ\n- 登山:妙見岳駅 から 普賢岳(1359 m・1.5 時間)\n- 駐車場:無料 600 台(仁田峠循環道路通行料 ¥520)\n- アクセス:雲仙温泉 から 車 15 分",
    region: "kyushu",
    prefecture_ja: "長崎県",
    gun_ja: null,
    municipality_ja: "雲仙市",
    lg_code: "42213",
    area_types: ["national_park", "mountain_village"],
    lat: 32.7611,
    lon: 130.2622,
    season_start: null,
    season_end: null,
    event_start: null,
    event_end: null,
    price_tier: 2,
    booking_window_days: null,
    closed_days: [],
    external_urls: { official: "https://unzen-ropeway.com/" },
    tags: ["nagasaki_unzen_jigoku", "ropeway", "1957", "1330m", "year_round"],
    source: "manual",
  },
];

async function main() {
  if (rows.length === 0) {
    console.log("[nagasaki-entertainment-r2] 尚無條目");
    return;
  }
  console.log(`[nagasaki-entertainment-r2] ${rows.length} 筆 ${DRY ? "(dry-run)" : ""}`);
  if (DRY) return;
  const sb = createAdminClient();
  const { error } = await sb.from("japan_entries").upsert(rows, { onConflict: "slug" });
  if (error) {
    console.error("[nagasaki-entertainment-r2] upsert failed:", error);
    process.exit(1);
  }
  console.log(`[nagasaki-entertainment-r2] Done — ${rows.length} rows.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

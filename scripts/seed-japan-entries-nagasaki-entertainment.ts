// Seed 長崎県 · 樂類 條目 → public.japan_entries(Sprint 20.5 楽 R1)
//
// 長崎 = 異国の坂・出島の章 + 夜景王国 + 西海国立公園 + 春節アジア祭:
//   - 稲佐山世界新三大夜景(2012)・鍋冠山・グラバー園夜+港クルーズ
//   - ハウステンボス(1992 開業・152 ha・国内最大級テーマパーク・光の王国 1300 万球)
//   - 九十九島+西海国立公園(208 島・パールシップ・西海橋大渦・伊王島リゾート)
//   - 雲仙地獄+仁田峠ロープウェイ(1934 国立公園第 1 号)+ 小浜温泉ほっとふっと 105(全国最長 105m 足湯)
//   - 長崎ペンギン水族館(全 9 種国内最多)・長崎バイオパーク(諫早・接触型)
//   - 大村公園(2000 本桜・国名勝・桜名所 100 選)・田平町桜並木(平戸 1500 本)
//   - 仁田峠紅葉(雲仙ロープウェイ・10 月)
//   - 長崎ランタンフェスティバル(2/1-15・1.5 万個ランタン・春節中華街)
//   - 長崎ペーロン選手権(7 月・1655 中国伝来)・精霊流し(8/15 故人初盆送魂)
//   - みなとながさき水辺の花火大会(7 月)
//   - 離島マリン:壱岐イルカ+五島鬼岳サンセット+対馬浅茅湾リアス
//
// 嚴格定義:全部具体観光地・実在祭り・実在体験スポットのみ。
//
// 25 筆構成:
//   Phase A 夜景 3(稲佐山世界三大・鍋冠山・グラバー園夜)
//   Phase B HTB 3(概論・光の王国・花の街)
//   Phase C 九十九島・西海 3(九十九島本体・西海橋桜・パールシップ)
//   Phase D 雲仙 2(地獄めぐり・仁田峠紅葉)
//   Phase E 動物・水族 2(ペンギン水族館・バイオパーク)
//   Phase F 桜 2(大村公園・田平町)
//   Phase G 祭礼 4(ランタン春節・ペーロン・精霊流し・港花火)
//   Phase H 離島・リゾート 4(伊王島・壱岐イルカ・五島鬼岳・対馬浅茅湾)
//   Phase I 温泉楽 + 港夜クルーズ 2(小浜全国最長足湯・港ナイトクルーズ)
//
// Usage:
//   npx tsx scripts/seed-japan-entries-nagasaki-entertainment.ts --dry-run
//   npx tsx scripts/seed-japan-entries-nagasaki-entertainment.ts

import { config as loadEnv } from "dotenv";
loadEnv({ path: ".env.local" });

import { createAdminClient } from "../src/lib/supabase/admin";

const DRY = process.argv.includes("--dry-run");

type SubType =
  | "nagasaki_night_view"
  | "nagasaki_kujukushima_marine"
  | "nagasaki_unzen_jigoku"
  | "nagasaki_lantern_fest"
  | "theme_park"
  | "illumination"
  | "flower_field"
  | "sakura"
  | "momiji"
  | "aquarium_zoo"
  | "firework_festival";

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
  // ════════════════════════════════════════════════════════════════════
  // Phase A — 夜景(3 筆)
  // ════════════════════════════════════════════════════════════════════
  {
    slug: "inasayama-night-1000man",
    category: "entertainment",
    sub_type: "nagasaki_night_view",
    title_zh: "稲佐山夜景(世界新三大夜景 2012・1000 万ドル夜景・標高 333m・ロープウェイ 5 分)",
    title_ja: "稲佐山展望台",
    romaji: "Inasayama Tenboudai",
    summary_zh: "**稲佐山は 2012 年「世界新三大夜景」認定**(モナコ+香港+長崎)+ 日本三大夜景(神戸+函館+長崎)。標高 333 m から長崎港+市街+斜面住宅街の重層的夜景、家々の灯りが宝石箱のように見える独特の光景。山頂展望台は無料 24 時間開放、ロープウェイ(¥1250 往復・5 分)+ 路線バスでアクセス可。日没後 30 分が最ゴールデン。",
    content_md: "- 認定:世界新三大夜景(2012・モナコ+香港+長崎)+ 日本三大夜景(2008-)\n- 標高:333 m\n- 展望台:屋上 360 度展望(無料・24 時間)\n- アクセス手段:稲佐山ロープウェイ(往復 ¥1250・5 分)+ 稲佐山スロープカー(往復 ¥500・3 分)+ 路線バス(¥210)\n- ロープウェイ営業:9:00-22:00(下り最終 22:00)\n- ベスト時間:日没後 30 分(マジックアワー)\n- ポイント:長崎港+ 斜面住宅街の宝石箱のような光景\n- 隣接:稲佐山公園+稲佐山温泉ホテル(当日帰り入浴可)\n- 駐車場:無料 800 台(山頂)+ 麓 100 台\n- 注意:風速 15m 超でロープウェイ運休",
    region: "kyushu",
    prefecture_ja: "長崎県",
    gun_ja: null,
    municipality_ja: "長崎市",
    lg_code: "42201",
    area_types: ["night_view", "observation"],
    lat: 32.7475,
    lon: 129.8478,
    season_start: null,
    season_end: null,
    event_start: null,
    event_end: null,
    price_tier: 1,
    booking_window_days: null,
    closed_days: [],
    external_urls: {},
    tags: ["nagasaki_night_view", "world_top_3", "1000_man_dollar", "333m", "ropeway"],
    source: "manual",
  },
  {
    slug: "nabekanmuriyama-park-night",
    category: "entertainment",
    sub_type: "nagasaki_night_view",
    title_zh: "鍋冠山公園展望台(無料・標高 169m・グラバー園裏山・港+稲佐山一望の穴場)",
    title_ja: "鍋冠山公園",
    romaji: "Nabekanmuriyama Koen",
    summary_zh: "**鍋冠山公園は無料の長崎夜景穴場スポット**(長崎市出雲町・標高 169 m)。グラバー園裏山に位置、港+稲佐山+市街地の対岸夜景を一望できる立地。2015 リニューアルで展望台拡張+休憩スペース整備。観光客が稲佐山に集中するため空いており、地元定番。徒歩 + 車両アクセス可・無料 30 台駐車場。日没後の青みがかった「ブルーアワー」が最美。",
    content_md: "- 標高:169 m\n- 入場料:無料(24 時間開放)\n- リニューアル:2015 年(展望台拡張+休憩棟整備)\n- 立地:グラバー園+大浦天主堂の裏山\n- 眺望:長崎港+稲佐山(対岸)+ 市街地+ 客船+ 三菱造船所\n- ベスト時間:日没後 30 分の「ブルーアワー」\n- ポイント:稲佐山と対面、稲佐山自体を眺望対象に取り込める\n- アクセス:長崎電気軌道「大浦天主堂」電停 徒歩 25 分(急坂) or 車 10 分\n- 駐車場:無料 30 台\n- 注意:坂道急峻・夜は街灯少ない区間あり",
    region: "kyushu",
    prefecture_ja: "長崎県",
    gun_ja: null,
    municipality_ja: "長崎市",
    lg_code: "42201",
    area_types: ["night_view", "park_garden"],
    lat: 32.7297,
    lon: 129.8714,
    season_start: null,
    season_end: null,
    event_start: null,
    event_end: null,
    price_tier: 1,
    booking_window_days: null,
    closed_days: [],
    external_urls: {},
    tags: ["nagasaki_night_view", "free", "169m", "blue_hour", "local_secret"],
    source: "manual",
  },
  {
    slug: "glover-garden-night-illumination",
    category: "entertainment",
    sub_type: "nagasaki_night_view",
    title_zh: "グラバー園ライトアップ(春・夏・秋・冬の限定夜間開園・洋館 9 棟+夜景同時体験)",
    title_ja: "グラバー園ライトアップ",
    romaji: "Glover Garden Light-up",
    summary_zh: "**グラバー園ライトアップは春・夏・秋・冬限定の夜間開園**(長崎市南山手町)。世遺・国重文洋館 9 棟をブルー+イエロー光で照らし、坂上から長崎港夜景も同時体験。春(GW)+ 夏(7-8 月)+ 秋(10 月)+ 冬(12 月)の年 4 回・各 2-3 週間。ハート石(縁結び)+ 旧グラバー住宅(国重文 1863 現存最古洋館)が SNS 映え。日没-21:30。",
    content_md: "- 期間:春(GW)+ 夏(7 月下旬-8 月)+ 秋(10 月)+ 冬(12 月)の年 4 回\n- 営業:21:30 まで延長(通常 18:00 閉園)\n- 入園料:¥620(夜間も同額)\n- 施設:洋館 9 棟(グラバー住宅+リンガー+オルト+三菱第 2 ドックハウス+ウォーカー邸 等)+ ハート石 2 個\n- 眺望:長崎港+ 鍋冠山+ 稲佐山(対岸)\n- 撮影スポット:旧グラバー住宅階段+ 大浦天主堂方向\n- 隣接:大浦天主堂(国宝・徒歩 3 分)+ 鍋冠山公園(徒歩 25 分)\n- アクセス:長崎電気軌道「大浦天主堂」電停 徒歩 7 分\n- 注意:夜間は閉鎖区間あり",
    region: "kyushu",
    prefecture_ja: "長崎県",
    gun_ja: null,
    municipality_ja: "長崎市",
    lg_code: "42201",
    area_types: ["night_view", "historic_district"],
    lat: 32.7344,
    lon: 129.8702,
    season_start: null,
    season_end: null,
    event_start: null,
    event_end: null,
    price_tier: 1,
    booking_window_days: null,
    closed_days: [],
    external_urls: { official: "https://www.glover-garden.jp/" },
    tags: ["nagasaki_night_view", "illumination", "9_yokan", "heart_stone"],
    source: "manual",
  },

  // ════════════════════════════════════════════════════════════════════
  // Phase B — ハウステンボス(3 筆)
  // ════════════════════════════════════════════════════════════════════
  {
    slug: "huis-ten-bosch-theme-park-1992",
    category: "entertainment",
    sub_type: "theme_park",
    title_zh: "ハウステンボス(1992 開業・152 ha・国内最大級テーマパーク・オランダ街並み再現)",
    title_ja: "ハウステンボス",
    romaji: "Huis Ten Bosch",
    summary_zh: "**ハウステンボスは国内最大級のテーマパーク**(佐世保市・1992 開業・152 ha)。オランダ女王宮殿「ハウステンボス」(森の家)を中心に、運河+チューリップ+風車+欧風建築の街並みを再現。アトラクション 50+ 件・年間 290 万人来場。光の王国(11-5 月・1300 万球)・花の街(年中)・VR ワールド・各種ホテル併設。九州最重要観光地の 1。",
    content_md: "- 開業:1992 年(平成 4)3 月 25 日\n- 規模:152 ha(東京ディズニーランド 3 個分)・国内最大級\n- 構想:オランダ・ハウステンボス宮殿(女王宮殿)を中心とする欧風街並み\n- 来場:年間 290 万人(2019 年 PRE COVID)\n- 入場料:1DAY パス ¥7400(大人)・2DAY ¥12900\n- 営業:9:00-22:00(イベント期間で変動)\n- ホテル:5 棟併設(ホテルヨーロッパ+アムステルダム+デンハーグ+フォレストヴィラ+ロッテルダム)\n- アトラクション:VR ワールド+ハウステンボス美術館+チョコレートハウス+花の街+運河クルーズ 等 50+\n- 季節イベント:チューリップ祭(2-4 月)+ ばら祭(5 月)+ 花火 + 光の王国(11-5 月)\n- アクセス:JR ハウステンボス駅 徒歩 5 分(博多から特急 1 時間 50 分)",
    region: "kyushu",
    prefecture_ja: "長崎県",
    gun_ja: null,
    municipality_ja: "佐世保市",
    lg_code: "42202",
    area_types: ["theme_park", "resort"],
    lat: 33.0850,
    lon: 129.7900,
    season_start: null,
    season_end: null,
    event_start: null,
    event_end: null,
    price_tier: 4,
    booking_window_days: 30,
    closed_days: [],
    external_urls: { official: "https://www.huistenbosch.co.jp/" },
    tags: ["theme_park", "1992", "152_ha", "national_largest", "european_townscape"],
    source: "manual",
  },
  {
    slug: "htb-illumination-kingdom-of-light",
    category: "entertainment",
    sub_type: "illumination",
    title_zh: "HTB 光の王国(11-5 月・1300 万球・国内最大級イルミネーション・光の運河+花火)",
    title_ja: "ハウステンボス 光の王国",
    romaji: "HTB Hikari no Oukoku",
    summary_zh: "**HTB 光の王国は国内最大級のイルミネーション**(11 月-翌 5 月・1300 万球)。日本夜景遺産+「日本三大イルミネーション」3 年連続 1 位(2014-2016)。光の運河(運河+宮殿の水面反射)+ 光の滝(高さ 14 m)+ 花火+ 光の動物園+ 宮殿プロジェクションマッピング 等多数。HTB の冬看板コンテンツで日没-22:00 公開。",
    content_md: "- 期間:11 月初旬-翌 5 月初旬(約 6 ヶ月・国内最長級)\n- 球数:1300 万球(国内最大級)\n- 認定:日本三大イルミネーション 3 年連続 1 位(2014-2016)+ 日本夜景遺産\n- 主要演出:光の運河(運河+水面反射)+ 光の滝(高さ 14 m・幅 70 m)+ 光の動物園+ 宮殿プロジェクションマッピング+ 花火\n- 入場:HTB パス内含む(別料金不要)\n- 点灯時間:日没(17:00 頃)-22:00\n- ベストエリア:アムステルダム広場+ ハーバータウン+ アートガーデン\n- 注意:11 月+12 月+1 月は寒風強・防寒重要\n- アクセス:JR ハウステンボス駅 徒歩 5 分",
    region: "kyushu",
    prefecture_ja: "長崎県",
    gun_ja: null,
    municipality_ja: "佐世保市",
    lg_code: "42202",
    area_types: ["theme_park", "illumination"],
    lat: 33.0830,
    lon: 129.7895,
    season_start: "2026-11-01",
    season_end: "2027-05-08",
    event_start: null,
    event_end: null,
    price_tier: 4,
    booking_window_days: 30,
    closed_days: [],
    external_urls: {},
    tags: ["illumination", "13_million_bulbs", "japan_top3_3y", "11_to_5_month", "national_largest"],
    source: "manual",
  },
  {
    slug: "htb-flower-festival",
    category: "entertainment",
    sub_type: "flower_field",
    title_zh: "HTB 花の街(年中・チューリップ 100 万本 2-4 月+ ばら 130 万輪 5-6 月+ アジサイ+ ヒマワリ)",
    title_ja: "ハウステンボス 花の街",
    romaji: "HTB Hana no Machi",
    summary_zh: "**HTB は「花の街」称号で年中花が咲くテーマパーク**。**チューリップ祭 2-4 月 100 万本(国内最多級)**+ **ばら祭 5-6 月 2000 種 130 万輪**+ アジサイ祭 6-7 月+ ヒマワリ祭 7-8 月+ コスモス 9-10 月+ シクラメン 11-1 月。広大な花畑+ 風車+ 運河の組み合わせは日本最大級・写真映え・年間花テーマで通年集客。",
    content_md: "- 構想:オランダ国花チューリップを中心とした「花の街」\n- チューリップ祭:2-4 月・100 万本(国内最多級)\n- ばら祭:5-6 月・2000 種 130 万輪\n- アジサイ祭:6-7 月・1000 株 11 万輪\n- ヒマワリ祭:7-8 月\n- コスモス祭:9-10 月\n- シクラメン展:11-1 月\n- ベストエリア:アートガーデン+ チューリップ畑(水車横)+ ハーバータウン\n- 観覧:HTB パス内含む(別料金不要)\n- 撮影:風車+チューリップの組み合わせが定番\n- アクセス:JR ハウステンボス駅 徒歩 5 分",
    region: "kyushu",
    prefecture_ja: "長崎県",
    gun_ja: null,
    municipality_ja: "佐世保市",
    lg_code: "42202",
    area_types: ["theme_park", "flower_field"],
    lat: 33.0840,
    lon: 129.7882,
    season_start: null,
    season_end: null,
    event_start: null,
    event_end: null,
    price_tier: 4,
    booking_window_days: 30,
    closed_days: [],
    external_urls: {},
    tags: ["flower_field", "tulip_1m", "rose_1.3m", "year_round", "national_largest"],
    source: "manual",
  },

  // ════════════════════════════════════════════════════════════════════
  // Phase C — 九十九島・西海(3 筆)
  // ════════════════════════════════════════════════════════════════════
  {
    slug: "kujukushima-208-islands",
    category: "entertainment",
    sub_type: "nagasaki_kujukushima_marine",
    title_zh: "九十九島(西海国立公園・208 島・複雑なリアス式海岸・展望+遊覧船+カヤック)",
    title_ja: "九十九島",
    romaji: "Kujukushima",
    summary_zh: "**九十九島は 1955 西海国立公園指定の海域**(佐世保市+平戸市・208 島)。「九十九」は「数えきれないほど多い」の意で実際 208 島。日本最大級のリアス式海岸+多島海景観、海上遊覧船(パールクィーン+海王 等)・カヤック・SUP 体験+ 展望台(船越+ 鯨瀬+ 海きらら)で楽しむ。国内屈指の絶景観光地+ ミシュラン・グリーンガイド 3 つ星。",
    content_md: "- 立地:佐世保市+平戸市の沿岸(全長 25 km)\n- 規模:208 島(うち有人島 4)\n- 認定:1955 西海国立公園+ ミシュラン・グリーンガイド 3 つ星(2009)\n- 主要展望台:展海峰(無料)+ 船越展望所+ 鯨瀬鼻\n- 遊覧船:パールクィーン(¥2200・50 分)+ 海王(¥3000・60 分)+ ナイトクルーズ\n- 体験:シーカヤック+ SUP+ ヨット+ 釣り\n- 隣接:九十九島水族館「海きらら」(¥1470・全国唯一の人工真珠貝展示)\n- アクセス:佐世保駅 から バス 25 分・パールシー下車\n- 撮影:夕日の時間帯が最美(海+島影+空のコントラスト)",
    region: "kyushu",
    prefecture_ja: "長崎県",
    gun_ja: null,
    municipality_ja: "佐世保市",
    lg_code: "42202",
    area_types: ["national_park", "coast_seaside"],
    lat: 33.1969,
    lon: 129.6961,
    season_start: null,
    season_end: null,
    event_start: null,
    event_end: null,
    price_tier: 2,
    booking_window_days: null,
    closed_days: [],
    external_urls: {},
    tags: ["nagasaki_kujukushima_marine", "saikai_national_park", "208_islands", "michelin_3star", "1955"],
    source: "manual",
  },
  {
    slug: "saikai-bridge-park-sakura",
    category: "entertainment",
    sub_type: "sakura",
    title_zh: "西海橋公園(国指定名勝・桜 1000 本+大渦+西海橋 1955・春秋限定渦潮)",
    title_ja: "西海橋公園",
    romaji: "Saikai Bashi Koen",
    summary_zh: "**西海橋公園は桜+大渦+橋の三重絶景**(西海市・佐世保市)。針尾瀬戸の急流による日本最大級の渦潮(春・秋大潮時に直径 5 m 級)、西海橋(1955 完成・国登録)+ 新西海橋(2006・歩道付)双橋を見上げる、公園内桜 1000 本(3 月下旬-4 月上旬)。ハイシーズンは渦+桜の同時鑑賞可。",
    content_md: "- 立地:西海市西彼町+佐世保市針尾町(針尾瀬戸)\n- 規模:公園 16 ha・桜 1000 本(主に染井吉野)\n- 桜時期:3 月下旬-4 月 5 日頃\n- 西海橋:1955 完成(全長 316 m)・国登録有形文化財\n- 新西海橋:2006 完成(歩道+遊歩道付)\n- 大渦:春+秋の大潮時(満潮+干潮の前後 1 時間)・直径 5 m 級・日本最大級\n- 渦潮見学:橋上+ 公園展望台 from 無料\n- 入場料:無料\n- 営業:24 時間\n- アクセス:佐世保駅 から バス 50 分・西海橋公園下車",
    region: "kyushu",
    prefecture_ja: "長崎県",
    gun_ja: null,
    municipality_ja: "西海市",
    lg_code: "42212",
    area_types: ["park_garden", "scenic_spot"],
    lat: 33.0411,
    lon: 129.7681,
    season_start: "2026-03-25",
    season_end: "2026-04-05",
    event_start: null,
    event_end: null,
    price_tier: 1,
    booking_window_days: null,
    closed_days: [],
    external_urls: { official: "https://saikaibashi.com/" },
    tags: ["sakura", "1000_trees", "saikai_bridge_1955", "uzu_potential", "national_scenic"],
    source: "manual",
  },
  {
    slug: "pearl-ship-cruise-sasebo",
    category: "entertainment",
    sub_type: "nagasaki_kujukushima_marine",
    title_zh: "パールクィーン九十九島遊覧船(50 分・佐世保港-九十九島・最ポピュラー海上アクセス)",
    title_ja: "パールクィーン",
    romaji: "Pearl Queen",
    summary_zh: "**パールクィーンは九十九島巡り最人気の遊覧船**(佐世保市・パールシーリゾート発着)。50 分で 208 島の代表的な無人島群を周遊、ガイド放送付・カモメへの餌やり可能。所要 50 分・乗船 ¥2200・1 日 7-8 便。同港から大型船「海王」(60 分・¥3000)も運行、ナイトクルーズ夏季限定。九十九島の象徴的観光体験。",
    content_md: "- 運営:九十九島パールシーリゾート(佐世保市)\n- 所要:50 分(港往復)\n- 料金:¥2200(大人・子供 ¥1100)\n- 出航:1 日 7-8 便(11:00 / 12:00 / 13:00 / 14:00 / 15:00 等・季節により増減)\n- 大型船「海王」:1 日 1 便・60 分・¥3000(週末限定)\n- ナイトクルーズ:夏季のみ・夕日鑑賞 + 星空+ 港夜景\n- 体験:カモメへの餌やり(船尾デッキ)+ ガイド放送\n- 出発地:佐世保 パールシーリゾート(無料駐車場 350 台)\n- 隣接:九十九島水族館「海きらら」(セット券あり)\n- アクセス:JR 佐世保駅 から バス 25 分・パールシー下車",
    region: "kyushu",
    prefecture_ja: "長崎県",
    gun_ja: null,
    municipality_ja: "佐世保市",
    lg_code: "42202",
    area_types: ["activity_water", "national_park"],
    lat: 33.1639,
    lon: 129.7339,
    season_start: null,
    season_end: null,
    event_start: null,
    event_end: null,
    price_tier: 2,
    booking_window_days: 7,
    closed_days: [],
    external_urls: {},
    tags: ["nagasaki_kujukushima_marine", "pearl_queen", "50min_cruise", "kujukushima_tour"],
    source: "manual",
  },

  // ════════════════════════════════════════════════════════════════════
  // Phase D — 雲仙(2 筆)
  // ════════════════════════════════════════════════════════════════════
  {
    slug: "unzen-jigoku-walk",
    category: "entertainment",
    sub_type: "nagasaki_unzen_jigoku",
    title_zh: "雲仙地獄めぐり(雲仙温泉中心・蒸気+硫黄+遊歩道 30 種・1934 国立公園第 1 号)",
    title_ja: "雲仙地獄",
    romaji: "Unzen Jigoku",
    summary_zh: "**雲仙地獄は日本初の国立公園第 1 号(1934 雲仙国立公園・現雲仙天草国立公園)の象徴的観光地**(雲仙市)。30 種の地獄が集中、白い蒸気+硫黄臭+岩肌の景観で「お糸地獄」「八幡地獄」「真知子岩」等命名。江戸期キリシタン処刑の地でもあり史跡の側面。整備された遊歩道(2 周コース・各 30-40 分)で安全に体感可、入場無料。",
    content_md: "- 認定:1934 雲仙国立公園(日本初の国立公園・第 1 号 1934-03-16)→ 現雲仙天草国立公園\n- 立地:雲仙市小浜町雲仙温泉中心\n- 地獄数:30 種(お糸地獄+ 八幡地獄+ 真知子岩+ 大叫喚地獄 等)\n- 遊歩道:2 周コース(各 30-40 分)・木道整備\n- 入場料:無料(常時公開)\n- 蒸気温度:約 100 ℃(柵内立入禁止)\n- 史跡側面:江戸期キリシタン迫害+処刑(温湯処刑)\n- 隣接:雲仙温泉街+ 雲仙お山の情報館(無料)+ 仁田峠(車 15 分)\n- アクセス:諫早駅 から バス 80 分・雲仙下車\n- 注意:硫黄臭強・喘息持ちは注意",
    region: "kyushu",
    prefecture_ja: "長崎県",
    gun_ja: null,
    municipality_ja: "雲仙市",
    lg_code: "42213",
    area_types: ["national_park", "onsen_field"],
    lat: 32.7458,
    lon: 130.2592,
    season_start: null,
    season_end: null,
    event_start: null,
    event_end: null,
    price_tier: 1,
    booking_window_days: null,
    closed_days: [],
    external_urls: { official: "https://www.unzen.org/" },
    tags: ["nagasaki_unzen_jigoku", "1934_first_national_park", "30_jigoku", "free", "sulfur"],
    source: "manual",
  },
  {
    slug: "unzen-fugendake-nita-momiji",
    category: "entertainment",
    sub_type: "momiji",
    title_zh: "仁田峠紅葉(雲仙ロープウェイ・10 月下旬-11 月上旬・標高 1080m・普賢岳眺望)",
    title_ja: "仁田峠紅葉",
    romaji: "Nita Toge Momiji",
    summary_zh: "**仁田峠は雲仙岳ロープウェイ起点+紅葉の名所**(雲仙市・標高 1080 m)。10 月下旬-11 月上旬の紅葉ピーク時、ドウダンツツジ+モミジ+ナナカマドの赤・黄・橙が混ざり山肌全体が燃える光景。雲仙ロープウェイ(¥1290 往復・3 分)で妙見岳駅(1330 m)へ、平成新山+普賢岳の眺望抜群。GW 後半のミヤマキリシマ(ピンク)も有名。",
    content_md: "- 標高:仁田峠 1080 m + 妙見岳駅 1330 m\n- 紅葉時期:10 月下旬-11 月上旬\n- 主な樹種:ドウダンツツジ+ モミジ+ ナナカマド+ ヤマザクラ\n- ロープウェイ:雲仙ロープウェイ(往復 ¥1290・3 分)\n- 営業:8:30-17:30(冬季 17:00)\n- 周辺登山:普賢岳(1359 m・1.5 時間)+ 国見岳(1347 m・2 時間)+ 平成新山(立入禁止だが眺望)\n- ミヤマキリシマ(ツツジ):5 月中旬-6 月初\n- 平成新山:1990-1995 雲仙普賢岳噴火で形成された新山(立入禁止・眺望のみ)\n- 駐車場:無料 600 台(仁田峠循環道路通行料 ¥520)\n- アクセス:雲仙温泉 から 車 15 分",
    region: "kyushu",
    prefecture_ja: "長崎県",
    gun_ja: null,
    municipality_ja: "雲仙市",
    lg_code: "42213",
    area_types: ["national_park", "mountain_village"],
    lat: 32.7600,
    lon: 130.2611,
    season_start: "2026-10-25",
    season_end: "2026-11-10",
    event_start: null,
    event_end: null,
    price_tier: 2,
    booking_window_days: null,
    closed_days: [],
    external_urls: { official: "https://unzen-ropeway.com/" },
    tags: ["momiji", "nita_toge", "1080m", "ropeway", "fugendake"],
    source: "manual",
  },

  // ════════════════════════════════════════════════════════════════════
  // Phase E — 動物・水族(2 筆)
  // ════════════════════════════════════════════════════════════════════
  {
    slug: "nagasaki-penguin-aquarium",
    category: "entertainment",
    sub_type: "aquarium_zoo",
    title_zh: "長崎ペンギン水族館(国内最多 9 種 180 羽・キングペンギン散歩・ふれあい体験)",
    title_ja: "長崎ペンギン水族館",
    romaji: "Nagasaki Penguin Aquarium",
    summary_zh: "**長崎ペンギン水族館は世界 18 種中 9 種・180 羽飼育の国内最多ペンギン施設**(長崎市・1959 開館・2001 リニューアル)。キングペンギンの散歩イベント(土日祝・無料追加)+ ペンギンタッチング体験(¥500・要予約)+ ペンギン餌やり(¥100)。水深 4 m の大水槽で水中泳ぎが見られる。家族向け+SNS 映えで根強い人気。",
    content_md: "- 開館:1959 年 → 2001 年リニューアル(現名称)\n- 飼育種:9 種 180 羽(国内最多種数)・キング+ジェンツー+マカロニ+フンボルト+ロイヤル+ヒゲ+イワトビ+アデリー+ケープ\n- イベント:キングペンギン散歩(土日祝 11:00 / 14:00・追加無料)+ タッチング(¥500 / 要予約)+ 餌やり(¥100)\n- 水深 4 m 大水槽:水中泳ぎ展示\n- 入館料:¥520(中学生以上)・小学生 ¥310\n- 営業:9:00-17:00(年中無休)\n- ふれあいビーチ(無料):ペンギンと同じビーチで遊泳観察\n- 駐車場:無料 240 台\n- アクセス:長崎駅 から バス 30 分・ペンギン水族館前下車",
    region: "kyushu",
    prefecture_ja: "長崎県",
    gun_ja: null,
    municipality_ja: "長崎市",
    lg_code: "42201",
    area_types: ["aquarium_zoo"],
    lat: 32.7269,
    lon: 129.9425,
    season_start: null,
    season_end: null,
    event_start: null,
    event_end: null,
    price_tier: 1,
    booking_window_days: null,
    closed_days: [],
    external_urls: { official: "https://penguin-aqua.jp/" },
    tags: ["aquarium_zoo", "9_species_180_penguins", "national_largest", "king_walk", "1959"],
    source: "manual",
  },
  {
    slug: "nagasaki-bio-park-isahaya",
    category: "entertainment",
    sub_type: "aquarium_zoo",
    title_zh: "長崎バイオパーク(諫早市・接触型動物園・カピバラ温泉+カンガルー放牧+リスザル肩乗り)",
    title_ja: "長崎バイオパーク",
    romaji: "Nagasaki Bio Park",
    summary_zh: "**長崎バイオパークは接触型動物園**(諫早市飯盛町・1980 開園・48 ha)。カンガルー+カピバラ+ヤギ+リスザル+ワオキツネザル等 200 種 2000 匹の多くが放し飼い、来園者が直接触れたり餌やり可能。冬季はカピバラ温泉(露天風呂入浴姿)が SNS 名物。動物園+植物園+ふれあい体験を兼備。",
    content_md: "- 開園:1980 年(昭和 55)\n- 規模:48 ha(東京ドーム 10 個分)\n- 飼育数:200 種 2000 匹\n- 体験:カンガルー+カピバラ+ヤギ+リスザル+ワオキツネザル等 多くが放し飼い+直接触れ可能\n- カピバラ温泉:11-3 月・露天風呂入浴姿(SNS 名物)\n- 餌やり:カピバラ+カンガルー+ヤギ等(¥100)\n- 入園料:¥1900(大人)・小学生 ¥1100\n- 営業:10:00-17:00(年中無休)\n- 駐車場:無料 1500 台\n- アクセス:JR 諫早駅 から バス 35 分・バイオパーク前下車",
    region: "kyushu",
    prefecture_ja: "長崎県",
    gun_ja: null,
    municipality_ja: "諫早市",
    lg_code: "42204",
    area_types: ["aquarium_zoo"],
    lat: 32.8556,
    lon: 129.8367,
    season_start: null,
    season_end: null,
    event_start: null,
    event_end: null,
    price_tier: 2,
    booking_window_days: null,
    closed_days: [],
    external_urls: { official: "https://www.biopark.co.jp/" },
    tags: ["aquarium_zoo", "200_species", "free_range", "capybara_onsen", "1980"],
    source: "manual",
  },

  // ════════════════════════════════════════════════════════════════════
  // Phase F — 桜(2 筆)
  // ════════════════════════════════════════════════════════════════════
  {
    slug: "omura-park-sakura-2000",
    category: "entertainment",
    sub_type: "sakura",
    title_zh: "大村公園(2000 本桜・国指定名勝・「日本さくら名所 100 選」・大村城址)",
    title_ja: "大村公園",
    romaji: "Omura Koen",
    summary_zh: "**大村公園は「日本さくら名所 100 選」+ 国指定名勝(2014)** の桜名所(大村市)。約 2000 本(染井吉野+里桜「クシマザクラ」+大村桜+八重桜)、開花リレーで 3 月下旬-4 月下旬の長期間楽しめる。大村城址(玖島城・1599)+ 板敷櫓+ 城内堀の組み合わせで桜+城+水鏡の景観。夜間ライトアップ(3/20-4/20)も人気。",
    content_md: "- 認定:日本さくら名所 100 選(1990)+ 国指定名勝(2014)\n- 桜本数:約 2000 本(染井吉野+ クシマザクラ+ 大村桜+ 八重桜)\n- 開花リレー:染井吉野(3 月下旬)→ 大村桜・里桜(4 月上旬)→ 八重桜(4 月中旬-下旬)\n- 城跡:大村城(玖島城・1599 大村喜前築城・1871 廃城)+ 板敷櫓(1992 復元)\n- 夜間ライトアップ:3/20-4/20(無料・19:00-22:00)\n- 入場料:無料(常時)\n- 大村桜:大村独自品種(国指定天然記念物)\n- 駐車場:無料 600 台\n- アクセス:JR 大村駅 から 徒歩 25 分(車 5 分)",
    region: "kyushu",
    prefecture_ja: "長崎県",
    gun_ja: null,
    municipality_ja: "大村市",
    lg_code: "42205",
    area_types: ["park_garden", "history_site_castle"],
    lat: 32.8950,
    lon: 129.9683,
    season_start: "2026-03-25",
    season_end: "2026-04-25",
    event_start: null,
    event_end: null,
    price_tier: 1,
    booking_window_days: null,
    closed_days: [],
    external_urls: {},
    tags: ["sakura", "2000_trees", "100_meishou", "national_scenic", "kushima_castle"],
    source: "manual",
  },
  {
    slug: "tabira-cherry-hirado-1500",
    category: "entertainment",
    sub_type: "sakura",
    title_zh: "田平公園(平戸市・1500 本桜・春の絶景・サンセット観桜)",
    title_ja: "田平公園",
    romaji: "Tabira Koen",
    summary_zh: "**田平公園は平戸大橋を一望する桜名所**(平戸市田平町・1500 本)。3 月下旬-4 月上旬の桜時期、平戸瀬戸+平戸大橋(1977)+ 平戸島の景観に桜のピンクが重なる絶景。サンセットの時間帯+夜桜が特に評価高、地元穴場で混雑少ない。隣接:田平天主堂(国重文 1918・潜伏キリシタン関連)。",
    content_md: "- 立地:平戸市田平町(平戸瀬戸対岸)\n- 桜本数:約 1500 本(主に染井吉野)\n- 桜時期:3 月下旬-4 月上旬\n- 眺望:平戸大橋(1977)+ 平戸瀬戸+ 平戸島\n- サンセット:18:30 頃(春)・桜+ 夕日のコラボ\n- 隣接:田平天主堂(国重文 1918・徒歩 5 分)\n- 入場料:無料(常時)\n- 駐車場:無料 200 台\n- 観覧穴場:地元客中心・観光客少なめ\n- アクセス:松浦鉄道 たびら平戸口駅 徒歩 10 分",
    region: "kyushu",
    prefecture_ja: "長崎県",
    gun_ja: null,
    municipality_ja: "平戸市",
    lg_code: "42207",
    area_types: ["park_garden", "scenic_spot"],
    lat: 33.3781,
    lon: 129.5803,
    season_start: "2026-03-25",
    season_end: "2026-04-08",
    event_start: null,
    event_end: null,
    price_tier: 1,
    booking_window_days: null,
    closed_days: [],
    external_urls: { official: "https://www.city.hirado.nagasaki.jp/kanko/" },
    tags: ["sakura", "1500_trees", "hirado_bridge", "sunset", "local_secret"],
    source: "manual",
  },

  // ════════════════════════════════════════════════════════════════════
  // Phase G — 祭礼(4 筆)
  // ════════════════════════════════════════════════════════════════════
  {
    slug: "nagasaki-lantern-festival",
    category: "entertainment",
    sub_type: "nagasaki_lantern_fest",
    title_zh: "長崎ランタンフェスティバル(2/1-15・1.5 万個ランタン・春節・新地中華街+湊公園)",
    title_ja: "長崎ランタンフェスティバル",
    romaji: "Nagasaki Lantern Festival",
    summary_zh: "**長崎ランタンフェスティバルは中華街春節祭+全国最大級ランタン祭**(2/1-15・約 15 日間)。1994 年地元華僑+商工会で開始、現在は 1.5 万個のランタン+ 巨大オブジェ(龍踊+獅子+ 媽祖)で街全体を彩る、来場 100 万人。会場は新地中華街+ 湊公園+ 中央公園+ 興福寺+ 崇福寺+ 唐人屋敷+ 浜の町。皇帝パレード+ 媽祖行列+ 龍踊+ 二胡演奏 等イベント連発。",
    content_md: "- 開催:2 月 1 日-15 日(15 日間・春節期間)\n- 開始:1994 年(地元華僑+商工会)\n- 規模:ランタン 1.5 万個・来場 100 万人(国内最大級アジア祭)\n- 主要会場:新地中華街+ 湊公園(メイン)+ 中央公園+ 興福寺+ 崇福寺+ 唐人屋敷+ 浜の町アーケード\n- 主要イベント:皇帝パレード(土日祝・15:00 / 18:00)+ 媽祖行列+ 龍踊+ 獅子舞+ 二胡演奏+ 中国雑技\n- ベスト時間:点灯後 17:30-(街全体が幻想的)\n- 入場:無料(イベント+ 会場)\n- 隣接:四福寺(崇福寺+ 興福寺+ 福済寺+ 聖福寺)+ 中華街グルメ\n- 注意:週末は混雑+ ホテル早期予約必要\n- アクセス:長崎電気軌道「築町」電停 徒歩 1 分(湊公園)",
    region: "kyushu",
    prefecture_ja: "長崎県",
    gun_ja: null,
    municipality_ja: "長崎市",
    lg_code: "42201",
    area_types: ["festival_event", "illumination"],
    lat: 32.7397,
    lon: 129.8742,
    season_start: null,
    season_end: null,
    event_start: "2026-02-01",
    event_end: "2026-02-15",
    price_tier: 1,
    booking_window_days: 60,
    closed_days: [],
    external_urls: { official: "https://nagasaki-lantern.com/" },
    tags: ["nagasaki_lantern_fest", "spring_festival", "1994", "15000_lanterns", "1m_visitors"],
    source: "manual",
  },
  {
    slug: "nagasaki-peron-championship",
    category: "entertainment",
    sub_type: "nagasaki_lantern_fest",
    title_zh: "長崎ペーロン選手権大会(7 月最終日曜・1655 中国伝来・全国最古龍舟競漕・港頭「地区祭」国家無形民俗候補)",
    title_ja: "長崎ペーロン選手権大会",
    romaji: "Nagasaki Peron",
    summary_zh: "**長崎ペーロンは 1655 年中国伝来の日本最古の龍舟競漕**(長崎港・7 月最終日曜)。「白龍」(中国語)が訛って「ペーロン」、長崎在住中国人が安政期に祭事として持ち込み 30 m の龍舟+ 30 名乗組+ 太鼓・銅鑼の伴奏で激しく競漕。長崎ペーロン選手権大会(7 月最終日曜)+ 各地区祭(港頭+ 茂木+ 香焼 等)で開催、地区祭は 5-9 月分散。長崎の夏の風物詩。",
    content_md: "- 起源:1655 年(明暦 1)清国福建出身の唐人が長崎で開催(国内最古龍舟記録)\n- 「ペーロン」:中国語「白龍」(バイロン)の訛り\n- 大会:長崎ペーロン選手権大会(7 月最終日曜・長崎港)+ 各地区祭(5-9 月分散)\n- 競漕:30 m 龍舟+ 30 名乗組(漕手 26 + 太鼓 1 + 銅鑼 1 + 舵取 1 + 配置調整 1)\n- 距離:1150 m コース(海上)\n- 応援:岸+ 港湾+ 観覧船(¥3000)\n- 観覧:長崎港+ 大波止+ 出島・無料\n- 隣接:港頭ペーロン(7/15)・茂木ペーロン(8 月)・香焼ペーロン(8 月)\n- アクセス:長崎電気軌道「大波止」電停 徒歩 5 分",
    region: "kyushu",
    prefecture_ja: "長崎県",
    gun_ja: null,
    municipality_ja: "長崎市",
    lg_code: "42201",
    area_types: ["festival_event", "activity_water"],
    lat: 32.7444,
    lon: 129.8675,
    season_start: null,
    season_end: null,
    event_start: "2026-07-26",
    event_end: "2026-07-26",
    price_tier: 1,
    booking_window_days: 30,
    closed_days: [],
    external_urls: {},
    tags: ["nagasaki_lantern_fest", "1655_oldest", "dragon_boat", "30m_boat", "summer"],
    source: "manual",
  },
  {
    slug: "shoryo-nagashi-815",
    category: "entertainment",
    sub_type: "nagasaki_lantern_fest",
    title_zh: "精霊流し(8/15・故人初盆送魂・船型山車+爆竹+鉦・さだまさし「精霊流し」歌の故郷)",
    title_ja: "精霊流し",
    romaji: "Shoryo Nagashi",
    summary_zh: "**精霊流しは故人初盆の送魂行事**(長崎市+雲仙+島原+諫早等・8/15 夕方-夜)。江戸期から続く長崎独自の盆送り、故人ゆかりの船型山車(竹+紙+造花)を遺族が町中を練り歩き、最後に港(長崎港)に流す(現在は燃やすか解体)。爆竹+鉦+ 提灯で激しく華やか、悲しみより派手な見送り。さだまさし 1974 年の同名曲で全国知名度。",
    content_md: "- 開催日:8 月 15 日(故人初盆の年のみ・遺族の慣習)\n- 時刻:16:00 頃出発-22:00 頃終了\n- 主要会場:長崎市内全域(中心:大波止+ 浜の町)+ 諫早+ 島原+ 雲仙\n- 山車:竹+ 紙+ 造花の船型山車(全長 2-15 m・故人位牌+ 写真+ 名前)\n- 演出:爆竹(数千-数万発)+ 鉦+ 提灯+ 盆唄\n- 終着:長崎港 大波止(現在は燃やすか解体・流すは禁止 1949)\n- 文化:派手な見送り(故人を笑顔で送る)\n- 観覧:無料(街中歩行+ 大波止見物)\n- さだまさし:1974 年「精霊流し」(レコード大賞作詞賞)\n- 注意:爆竹音 100 dB 超・耳栓推奨\n- アクセス:長崎電気軌道「大波止」電停",
    region: "kyushu",
    prefecture_ja: "長崎県",
    gun_ja: null,
    municipality_ja: "長崎市",
    lg_code: "42201",
    area_types: ["festival_event"],
    lat: 32.7444,
    lon: 129.8675,
    season_start: null,
    season_end: null,
    event_start: "2026-08-15",
    event_end: "2026-08-15",
    price_tier: 1,
    booking_window_days: null,
    closed_days: [],
    external_urls: {},
    tags: ["nagasaki_lantern_fest", "obon", "8_15", "first_obon", "sada_masashi"],
    source: "manual",
  },
  {
    slug: "minato-nagasaki-mizube-firework",
    category: "entertainment",
    sub_type: "firework_festival",
    title_zh: "みなとながさき水辺の花火大会(7 月下旬・長崎港・海上花火 8000 発・港夜景+花火同時)",
    title_ja: "みなとながさき水辺の花火大会",
    romaji: "Minato Nagasaki Mizube Hanabi",
    summary_zh: "**みなとながさき水辺の花火大会は長崎港+ 稲佐山夜景の絶景花火大会**(7 月下旬・8000 発)。出島ワーフ+ 大波止+ 水辺の森公園+ 稲佐山中腹+ 鍋冠山公園 から多角度観覧、海上打ち上げで反射が美しい。1948 年港まつり時起源、「みなとフェスティバル」で 1990 年代より独立、現在の規模は 2010 年代以後。",
    content_md: "- 開催日:7 月下旬(2026 年 7 月 25 日予定)\n- 時刻:20:00-21:00(60 分・8000 発)\n- 起源:1948 港まつり → 1990 年代独立 → 2010 年代規模拡大\n- 主要観覧地:出島ワーフ+ 大波止+ 水辺の森公園+ 鍋冠山+ 稲佐山中腹\n- 観覧穴場:鍋冠山公園(無料・上から)+ 稲佐山スロープカー(¥500)\n- 有料席:水辺の森公園 ¥3000-(駐車場+ 椅子付)\n- 海上 + 陸上ハイブリッド:港の海上から打ち上げ・反射が美しい\n- 隣接:長崎みなとまつり(7 月最終週末・各種イベント+ 屋台)\n- 注意:花火大会日は中心部交通規制+ ホテル早期予約\n- アクセス:長崎電気軌道「大波止」電停 徒歩 5 分",
    region: "kyushu",
    prefecture_ja: "長崎県",
    gun_ja: null,
    municipality_ja: "長崎市",
    lg_code: "42201",
    area_types: ["festival_event", "firework"],
    lat: 32.7400,
    lon: 129.8728,
    season_start: null,
    season_end: null,
    event_start: "2026-07-25",
    event_end: "2026-07-25",
    price_tier: 2,
    booking_window_days: 30,
    closed_days: [],
    external_urls: {},
    tags: ["firework_festival", "8000_shells", "summer_july", "port_view", "60_min"],
    source: "manual",
  },

  // ════════════════════════════════════════════════════════════════════
  // Phase H — 離島・リゾート(4 筆)
  // ════════════════════════════════════════════════════════════════════
  {
    slug: "iojima-resort-iland",
    category: "entertainment",
    sub_type: "nagasaki_kujukushima_marine",
    title_zh: "伊王島 i+Land NAGASAKI(長崎市離島・橋連結 2011・温泉+ビーチ+リゾート・市内 30 分)",
    title_ja: "i+Land NAGASAKI",
    romaji: "iLand Nagasaki",
    summary_zh: "**伊王島は長崎市から車 30 分の橋連結離島リゾート**(長崎市伊王島町)。2011 伊王島大橋連結、現在は **i+Land NAGASAKI** 統合リゾート(2018 リブランド・温泉+ビーチ+ホテル+結婚式場)。アイランドルミナス・夜の光体験(2018 開始・モンウシン社)で 8 km の幻想光ロード+ ビーチで全国級リゾート体験。日帰り温泉+ 海水浴+ プール+ サンセット鑑賞 オールイン。",
    content_md: "- 立地:長崎市伊王島町(伊王島大橋連結 2011)\n- 距離:長崎市内から 車 30 分(15 km)\n- リゾート:i+Land NAGASAKI(2018 リブランド・元 やすらぎ伊王島)\n- 施設:ホテル 5 棟+ 温泉(露天オーシャンビュー)+ 結婚式場+ ビーチ+ プール+ レストラン+ アイランドルミナス\n- 入場:日帰り温泉 ¥1500+ アイランドルミナス ¥2400(夜光体験)\n- 営業:24 時間(ホテル)・温泉 11:00-23:00\n- ビーチ:イオウジマビーチ(7-8 月解放・無料)\n- 隣接:伊王島灯台(国登録有形文化財)\n- 駐車場:無料 500 台\n- アクセス:長崎駅 から バス 50 分・伊王島下車",
    region: "kyushu",
    prefecture_ja: "長崎県",
    gun_ja: null,
    municipality_ja: "長崎市",
    lg_code: "42201",
    area_types: ["resort", "coast_seaside"],
    lat: 32.6736,
    lon: 129.7717,
    season_start: null,
    season_end: null,
    event_start: null,
    event_end: null,
    price_tier: 3,
    booking_window_days: 14,
    closed_days: [],
    external_urls: { official: "https://www.islandnagasaki.jp/" },
    tags: ["nagasaki_kujukushima_marine", "iojima", "2011_bridge", "iland_resort", "30min_from_city"],
    source: "manual",
  },
  {
    slug: "iki-marine-summer",
    category: "entertainment",
    sub_type: "nagasaki_kujukushima_marine",
    title_zh: "壱岐マリン体験(玄界灘透明度 + イルカパーク+ 海水浴 5 ビーチ+ サンセット夕陽が丘)",
    title_ja: "壱岐マリン体験",
    romaji: "Iki Marine",
    summary_zh: "**壱岐は玄界灘の透明度高い離島マリン体験の宝庫**(壱岐市)。海水透明度 全国級+ 5 大ビーチ(筒城浜+ 錦浜+ 大浜+ 清石浜+ 串山浜)・**壱岐イルカパーク**(湾を囲んだ自然形ファミリー型・1995 開園)+ サンセット名所「夕陽が丘」(国境)等。SUP・シュノーケル・釣り・ダイビング 体験施設多数、夏の家族旅行人気。",
    content_md: "- 立地:壱岐市(芦辺・郷ノ浦・勝本+島内全域)\n- 海水透明度:玄界灘 国内屈指(透明度 20-30 m)\n- 5 大ビーチ:筒城浜(芦辺)+ 錦浜+ 大浜(郷ノ浦)+ 清石浜+ 串山浜\n- イルカパーク:湾を囲んだ自然形(1995 開園)・¥520・触れ合い体験 ¥4000\n- サンセット:夕陽が丘(郷ノ浦) + 鬼の岩屋\n- マリン体験:SUP+ シュノーケル+ 釣り+ ダイビング(複数事業者)\n- 釣り船:複数業者(¥10000-15000・半日)\n- 海水浴期間:7 月-8 月\n- アクセス:博多港 から ジェットフォイル 1 時間 5 分(¥4000-5000)\n- 注意:離島レンタカー早期予約必要(夏ピーク時不足)",
    region: "kyushu",
    prefecture_ja: "長崎県",
    gun_ja: null,
    municipality_ja: "壱岐市",
    lg_code: "42210",
    area_types: ["coast_seaside", "activity_water"],
    lat: 33.7531,
    lon: 129.6650,
    season_start: "2026-07-15",
    season_end: "2026-08-31",
    event_start: null,
    event_end: null,
    price_tier: 3,
    booking_window_days: 30,
    closed_days: [],
    external_urls: { official: "https://www.ikikankou.com/" },
    tags: ["nagasaki_kujukushima_marine", "iki_island", "5_beaches", "dolphin_park", "20m_transparency"],
    source: "manual",
  },
  {
    slug: "goto-onibire-volcano",
    category: "entertainment",
    sub_type: "nagasaki_kujukushima_marine",
    title_zh: "鬼岳(五島福江・標高 315m・芝生火山・サンセット+ 星空+ パラグライダー・国名勝)",
    title_ja: "鬼岳",
    romaji: "Onidake",
    summary_zh: "**鬼岳は五島福江島の象徴的火山**(五島市・標高 315 m)。約 4 万年前の噴火で形成、全山が芝生に覆われた美しい円錐形(寝てる女性)+ 360 度展望でサンセット+星空観察+ パラグライダー人気。県指定天然記念物、夕方カップル+ 家族で賑わう。隣接の鬼岳天文台で星空観察会(土曜・無料)、五島観光のハイライト。",
    content_md: "- 立地:五島市(福江島中央・空港隣接)\n- 標高:315 m\n- 形成:約 4 万年前の噴火・スコリア丘\n- 認定:県指定天然記念物\n- 特徴:全山が芝生に覆われた美しい円錐形(寝てる女性)\n- 展望:360 度パノラマ(東シナ海+ 福江島市街+ 久賀島+ 奈留島)\n- アクティビティ:登山(20 分・歩道整備)+ パラグライダー(複数業者)\n- 鬼岳天文台:鬼岳頂上付近・無料・土曜 19:30-21:30 星空観察会\n- 入場料:無料(常時)\n- サンセット名所:18:30 頃(夏)・19:00 頃(春秋)\n- アクセス:五島福江空港 徒歩 15 分・市街 から 車 10 分",
    region: "kyushu",
    prefecture_ja: "長崎県",
    gun_ja: null,
    municipality_ja: "五島市",
    lg_code: "42211",
    area_types: ["mountain_village", "scenic_spot"],
    lat: 32.6933,
    lon: 128.8275,
    season_start: null,
    season_end: null,
    event_start: null,
    event_end: null,
    price_tier: 1,
    booking_window_days: null,
    closed_days: [],
    external_urls: {},
    tags: ["nagasaki_kujukushima_marine", "goto_fukue", "315m", "scoria_cone", "sunset_spot"],
    source: "manual",
  },
  {
    slug: "tsushima-aso-bay-cruise",
    category: "entertainment",
    sub_type: "nagasaki_kujukushima_marine",
    title_zh: "浅茅湾(対馬・複雑なリアス式・国境離島最大絶景・遊覧船+ シーカヤック)",
    title_ja: "浅茅湾",
    romaji: "Asou Wan",
    summary_zh: "**浅茅湾は対馬中央部の巨大リアス式海湾**(対馬市・東西 25 km × 南北 13 km)。日本屈指の複雑な海岸線+ 200+ の入江+ 多数の島嶼で「日本のフィヨルド」とも称される。シーカヤック+ 遊覧船+ 釣り+ 国境離島の絶景体験で人気、対馬観光のハイライト。展望台「白嶽」(519 m)から全景眺望可。",
    content_md: "- 立地:対馬市(対馬中央部)\n- 規模:東西 25 km × 南北 13 km\n- 特徴:日本屈指の複雑なリアス式海岸+ 200+ 入江+ 数十島嶼\n- 認定:壱岐対馬国定公園(1968)\n- 体験:シーカヤック(複数業者・¥6000-)+ 遊覧船(対馬観光物産協会・¥3000)+ 釣り船\n- 展望:白嶽(519 m・登山 2 時間)+ 烏帽子岳(176 m・展望デッキ)\n- 文化遺産:和多都美神社(海神神社・対馬一宮・浅茅湾沿岸)+ 古代山城金田城跡\n- 海上タクシー:厳原 + 美津島 + 上対馬 各港から運行\n- 隣接:対馬野生生物保護センター(ツシマヤマネコ展示)\n- アクセス:対馬空港 から 車 30 分(美津島町中心)\n- 注意:GW + 夏休みは早期予約必要",
    region: "kyushu",
    prefecture_ja: "長崎県",
    gun_ja: null,
    municipality_ja: "対馬市",
    lg_code: "42209",
    area_types: ["coast_seaside", "scenic_spot"],
    lat: 34.3500,
    lon: 129.3000,
    season_start: null,
    season_end: null,
    event_start: null,
    event_end: null,
    price_tier: 2,
    booking_window_days: 14,
    closed_days: [],
    external_urls: { official: "https://www.tsushima-net.org/" },
    tags: ["nagasaki_kujukushima_marine", "aso_bay", "ria_coast", "japan_fjord", "iki_tsushima_park"],
    source: "manual",
  },

  // ════════════════════════════════════════════════════════════════════
  // Phase I — 温泉楽 + 港夜クルーズ(2 筆)
  // ════════════════════════════════════════════════════════════════════
  {
    slug: "obama-asia-longest-footbath",
    category: "entertainment",
    sub_type: "nagasaki_unzen_jigoku",
    title_zh: "小浜温泉ほっとふっと 105(全国最長 105m 足湯・無料・橘湾サンセット同時鑑賞)",
    title_ja: "ほっとふっと 105",
    romaji: "Hot Foot 105",
    summary_zh: "**ほっとふっと 105 は全国最長 105 m の足湯**(雲仙市小浜温泉・2010 完成)。湧出量・温度共に全国屈指の小浜温泉(105 ℃源泉)を使用、橘湾を望む海岸沿いに 105 m の足湯施設を建設(数字 105 = 源泉温度+足湯長さ両方)。無料 24 時間+ サンセット時刻が日本一美しい西海岸足湯。地元有志運営。",
    content_md: "- 完成:2010 年(平成 22)\n- 全長:105 m(全国最長足湯)\n- 名前由来:数字 105 = 源泉温度 105 ℃ + 足湯長さ 105 m\n- 入場料:無料(24 時間)\n- 立地:雲仙市小浜町・小浜温泉海岸沿い(橘湾沿岸)\n- 源泉温度:105 ℃(湧出時)・足湯部分は適温\n- サンセット:18:30 頃(夏)・19:00 頃(春)・橘湾全域\n- 隣接:小浜温泉街+ 小浜歴史資料館+ 小浜マリーナ\n- 駐車場:無料 30 台(隣接観光案内所)\n- アクセス:諫早駅 から 車 35 分(小浜バスセンター 徒歩 5 分)",
    region: "kyushu",
    prefecture_ja: "長崎県",
    gun_ja: null,
    municipality_ja: "雲仙市",
    lg_code: "42213",
    area_types: ["onsen_field"],
    lat: 32.7322,
    lon: 130.1894,
    season_start: null,
    season_end: null,
    event_start: null,
    event_end: null,
    price_tier: 1,
    booking_window_days: null,
    closed_days: [],
    external_urls: { official: "https://obama.or.jp/" },
    tags: ["nagasaki_unzen_jigoku", "obama_onsen", "105m_longest", "free", "sunset"],
    source: "manual",
  },
  {
    slug: "nagasaki-port-cruise-night",
    category: "entertainment",
    sub_type: "nagasaki_night_view",
    title_zh: "長崎湾ナイトクルーズ(港 + 軍艦島 + 稲佐山夜景同時・60 分・出島ワーフ発)",
    title_ja: "長崎湾ナイトクルーズ",
    romaji: "Nagasaki Bay Night Cruise",
    summary_zh: "**長崎湾ナイトクルーズは港+ 稲佐山夜景+ 三菱造船所夜景の海上体験**(出島ワーフ発・60 分)。やまさ海運運営、19:00 頃出航で日没-夜景の遷移を体感+ 三菱造船所の夜景(産業夜景)が独特。世界三大夜景を「海上から」見る稀有な体験。¥3500・1 日 1 便・週末中心運航。",
    content_md: "- 運営:やまさ海運(株)\n- 所要:60 分\n- 料金:¥3500(大人・子供 ¥1750)\n- 出航:19:00 頃(夏季 19:30・冬季 18:30)\n- 出発地:出島ワーフ\n- ルート:出島ワーフ → 大波止 → 三菱造船所沖 → 軍艦島方向 → 戻り\n- ハイライト:稲佐山夜景(海上から)+ 三菱造船所夜景(産業夜景)+ 大型客船岸壁\n- 営業:週末中心(月-木曜運休が多い)・要事前予約\n- 隣接:出島ワーフ(レストラン+ バー集合)\n- 注意:海況により欠航・防寒衣類必須(冬)\n- アクセス:長崎電気軌道「出島」電停 徒歩 5 分",
    region: "kyushu",
    prefecture_ja: "長崎県",
    gun_ja: null,
    municipality_ja: "長崎市",
    lg_code: "42201",
    area_types: ["night_view", "activity_water"],
    lat: 32.7444,
    lon: 129.8675,
    season_start: null,
    season_end: null,
    event_start: null,
    event_end: null,
    price_tier: 3,
    booking_window_days: 7,
    closed_days: ["mon", "tue", "wed", "thu"],
    external_urls: {},
    tags: ["nagasaki_night_view", "night_cruise", "60min", "industrial_view", "yamasa"],
    source: "manual",
  },
];

async function main() {
  if (rows.length === 0) {
    console.log("[nagasaki-entertainment] 尚無條目");
    return;
  }
  console.log(`[nagasaki-entertainment] ${rows.length} 筆 ${DRY ? "(dry-run)" : ""}`);
  if (DRY) {
    const bySub = new Map<string, number>();
    for (const r of rows) bySub.set(r.sub_type, (bySub.get(r.sub_type) ?? 0) + 1);
    for (const [k, v] of [...bySub.entries()].sort()) {
      console.log(`  ${k.padEnd(32)} ${v}`);
    }
    return;
  }
  const sb = createAdminClient();
  const CHUNK = 50;
  let written = 0;
  for (let i = 0; i < rows.length; i += CHUNK) {
    const batch = rows.slice(i, i + CHUNK);
    const { error } = await sb.from("japan_entries").upsert(batch, { onConflict: "slug" });
    if (error) {
      console.error("[nagasaki-entertainment] upsert failed:", error);
      process.exit(1);
    }
    written += batch.length;
    process.stdout.write(`\r[nagasaki-entertainment] upsert: ${written}/${rows.length}`);
  }
  process.stdout.write("\n");
  console.log(`[nagasaki-entertainment] Done — ${written} rows.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

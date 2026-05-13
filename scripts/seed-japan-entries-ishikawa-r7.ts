// Seed 石川県 R7 補完(11 筆 / Sprint 45.x)
//
// 食 3 / 住 1 / 育 5 / 楽 2 = 11

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
  region: "chubu";
  prefecture_ja: "石川県";
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
  // 食 R7 (3) — 加賀牛 + 鮨めくみ + 能美ぶどう
  // ════════════════════════════════════════════════════════════════════
  {
    slug: "kaga-gyu-overview",
    category: "food",
    sub_type: "ishikawa_noto_san",
    title_zh: "加賀牛(加賀地方ブランド和牛+ R6 食 能登牛と並ぶ石川 2 大和牛+ 黒毛和種)",
    title_ja: "加賀牛",
    romaji: "Kaga Gyu",
    summary_zh: "**加賀牛は加賀地方ブランド和牛**(石川県南部・**黒毛和種**)。**R6 食既出 能登牛(GI 2007)と並ぶ石川 2 大和牛**、加賀地方の畜産農家で生産、霜降り 4-5 等級中心、R1 食既出 加賀料理 + 加賀温泉郷で提供される高級食材。",
    content_md: "- 産地:石川県南部(加賀地方)\n- 種類:**黒毛和種**\n- 等級:**A4-A5 中心**\n- 並列:R6 食 能登牛(GI 2007)= 石川 2 大和牛\n- 並列観光:R1 食 加賀料理 + R1 住 加賀温泉郷で提供\n- 価格:ステーキ 1 人前 ¥5,000-12,000\n- 提供:加賀温泉郷高級宿 + 金沢市内高級料亭",
    region: "chubu",
    prefecture_ja: "石川県",
    gun_ja: null,
    municipality_ja: "加賀市",
    lg_code: "17206",
    area_types: ["restaurant_traditional"],
    lat: 36.3056,
    lon: 136.4556,
    season_start: null,
    season_end: null,
    event_start: null,
    event_end: null,
    price_tier: 5,
    booking_window_days: null,
    closed_days: [],
    external_urls: {},
    tags: ["kaga_gyu", "kaga_district_wagyu", "kuroge_wasshu", "A4_A5"],
    source: "manual",
  },
  {
    slug: "mekumi-zushi-1973-nonoichi",
    category: "food",
    sub_type: "ishikawa_kanazawa_sushi",
    title_zh: "鮨めくみ(野々市市・1973 創業・52 年+ 国際美食評価+ ミシュラン 2 つ星 2024-2025+ 北陸最高級鮨)",
    title_ja: "鮨めくみ",
    romaji: "Sushi Mekumi",
    summary_zh: "**鮨めくみは北陸最高級鮨店**(野々市市・**1973 創業・52 年**)。**ミシュラン 2 つ星 2024-2025**、R1 食既出 廻る金沢回転寿司 + もりもり寿司とは別軸の最高峰、北陸新幹線 2015 開業後の国際美食評価先駆者、予約困難な隠れた名店。",
    content_md: "- 創業:**1973 年・52 年**\n- 立地:野々市市三日市(金沢市隣接)\n- 評価:**ミシュランガイド 2 つ星 2024-2025**\n- 全国順位:**北陸最高級鮨**\n- 並列:R1 食 廻る金沢 + もりもり寿司 = 北陸新幹線後の鮨ブームの中核\n- 価格:**おまかせコース ¥30,000-60,000**\n- 予約:**3-6 ヶ月前推奨**\n- アクセス:北鉄バス 三日市 徒歩 10 分",
    region: "chubu",
    prefecture_ja: "石川県",
    gun_ja: null,
    municipality_ja: "野々市市",
    lg_code: "17212",
    area_types: ["restaurant_traditional"],
    lat: 36.5161,
    lon: 136.6097,
    season_start: null,
    season_end: null,
    event_start: null,
    event_end: null,
    price_tier: 5,
    booking_window_days: 90,
    closed_days: [],
    external_urls: {},
    tags: ["mekumi_zushi", "1973", "52_years", "michelin_2_stars", "hokuriku_premium_sushi"],
    source: "manual",
  },
  {
    slug: "nomi-budou-overview",
    category: "food",
    sub_type: "ishikawa_kaga_ryori",
    title_zh: "能美ぶどう(能美市・甲州 + シャインマスカット + ピオーネ + 加賀地方ぶどう郷+ R1 衣 九谷焼寺井産地隣接)",
    title_ja: "能美ぶどう",
    romaji: "Nomi Budou",
    summary_zh: "**能美ぶどうは加賀地方ぶどう郷**(能美市・**甲州 + シャインマスカット + ピオーネ**)。**R1 衣既出 九谷焼寺井産地(能美市)で工芸 + 食農業 2 大柱**、8-9 月旬+ ぶどう狩り体験、R1 食 加賀棒茶 + R6 衣 山中漆器 等加賀地方産業群の食 angle。",
    content_md: "- 産地:能美市(加賀地方)\n- 主要品種:**甲州 + シャインマスカット + ピオーネ + 加賀紫**\n- 季節:**8 月-9 月旬**\n- 並列:**R1 衣 九谷焼寺井産地(同市)= 工芸 + 食農業 2 大柱**\n- 並列食:R1 食 加賀棒茶 + 加賀料理\n- 体験:ぶどう狩り(数農園)\n- 価格:1kg ¥1,500-3,500\n- アクセス:JR 北陸新幹線小松駅 → 車 15 分",
    region: "chubu",
    prefecture_ja: "石川県",
    gun_ja: null,
    municipality_ja: "能美市",
    lg_code: "17211",
    area_types: ["farm_field"],
    lat: 36.4519,
    lon: 136.4569,
    season_start: "2026-08-01",
    season_end: "2026-09-30",
    event_start: null,
    event_end: null,
    price_tier: 2,
    booking_window_days: 7,
    closed_days: [],
    external_urls: {},
    tags: ["nomi_budou", "kaga_district_grape", "shine_muscat_pione", "kutaniyaki_terai_adjacent"],
    source: "manual",
  },

  // ════════════════════════════════════════════════════════════════════
  // 住 R7 (1) — 雄山閣
  // ════════════════════════════════════════════════════════════════════
  {
    slug: "yusankaku-yamashiro-1898",
    category: "lodging",
    sub_type: "ishikawa_kaga_onsen_classic",
    title_zh: "雄山閣(加賀市山代温泉・1898 創業・127 年+ 山代温泉中堅老舗+ 加賀料理懐石+ R3 育 魯山人ゆかり地区)",
    title_ja: "雄山閣",
    romaji: "Yusankaku",
    summary_zh: "**雄山閣は山代温泉中堅老舗**(加賀市・**1898 創業・127 年**)。**R1 住既出 あらや滔々庵 1624(山代代表)+ R2 住 花紫 1872 と並ぶ山代温泉老舗 3 大柱**、R3 育 魯山人寓居跡(同地区)の文化文脈、加賀料理懐石提供。",
    content_md: "- 創業:**1898 年(明治 31)・127 年**\n- 立地:加賀市山代温泉\n- 並列:R1 住 あらや滔々庵 1624(401 年)+ R2 住 花紫 1872(153 年)= 山代温泉老舗 3 大\n- 並列文化:R3 育 魯山人寓居跡 1915-1916(同地区)\n- 食事:加賀料理懐石\n- 価格:1 泊 2 食 ¥25,000-50,000/人\n- アクセス:JR 加賀温泉駅 → 送迎 7 分",
    region: "chubu",
    prefecture_ja: "石川県",
    gun_ja: null,
    municipality_ja: "加賀市",
    lg_code: "17206",
    area_types: ["onsen_field"],
    lat: 36.2922,
    lon: 136.3886,
    season_start: null,
    season_end: null,
    event_start: null,
    event_end: null,
    price_tier: 4,
    booking_window_days: 30,
    closed_days: [],
    external_urls: {},
    tags: ["yusankaku", "1898", "127_years", "yamashiro_meiji", "kaga_kaiseki"],
    source: "manual",
  },

  // ════════════════════════════════════════════════════════════════════
  // 育 R7 (5) — 明治記念之標 + 小松天満宮 + 中村美術 + 前田土佐守 + 能登観音霊場
  // ════════════════════════════════════════════════════════════════════
  {
    slug: "meiji-kinen-no-hyou-1880-kenrokuen",
    category: "culture",
    sub_type: "history_site_castle",
    title_zh: "明治記念之標(金沢市・兼六園内・1880 建立・145 年+ 西南戦争慰霊+ 日本最古銅像の 1+ 日本武尊像)",
    title_ja: "明治記念之標",
    romaji: "Meiji Kinen no Hyou",
    summary_zh: "**明治記念之標は日本最古銅像の 1**(金沢市・**兼六園内・1880 建立・145 年**)。**1877 西南戦争石川県戦死者慰霊碑+ 日本武尊像が日本最古級銅像**、R1 育既出 兼六園 1822 内立地、加賀百万石明治期の文化遺産代表。",
    content_md: "- 建立:**1880 年(明治 13)・145 年**\n- 立地:**金沢市兼六園内**(R1 育 兼六園内)\n- 性格:**1877 西南戦争石川県戦死者慰霊碑**\n- 銅像:**日本武尊像(日本最古級銅像の 1)**\n- 並列:R1 育 兼六園 1822 + R1 育 金沢神社 1794(同園内)\n- 入場:**兼六園入園料込**(¥320)\n- アクセス:JR 金沢駅 → バス 6 分(兼六園下)",
    region: "chubu",
    prefecture_ja: "石川県",
    gun_ja: null,
    municipality_ja: "金沢市",
    lg_code: "17201",
    area_types: ["historic_district", "scenic_spot"],
    lat: 36.5622,
    lon: 136.6622,
    season_start: null,
    season_end: null,
    event_start: null,
    event_end: null,
    price_tier: 1,
    booking_window_days: null,
    closed_days: [],
    external_urls: {},
    tags: ["meiji_kinen", "1880", "145_years", "satsuma_rebellion_memorial", "yamato_takeru_oldest_bronze"],
    source: "manual",
  },
  {
    slug: "komatsu-tenmangu-1683",
    category: "culture",
    sub_type: "temple_shrine",
    title_zh: "小松天満宮(小松市・1683 創建・342 年+ 前田利常造営+ 国指定重要文化財 1968+ 加賀藩武家文化象徴神社)",
    title_ja: "小松天満宮",
    romaji: "Komatsu Tenmangu",
    summary_zh: "**小松天満宮は前田利常造営の藩主神社**(小松市・**1683 創建・342 年・国指定重要文化財 1968**)。**3 代藩主前田利常隠居所の小松城に併設**、菅原道真公祭神、R1 育既出 那谷寺 717 + R5 育 安宅住吉神社と並ぶ小松市文化遺産 3 大柱、加賀藩武家文化の象徴神社。",
    content_md: "- 創建:**1683 年(天和 3)・342 年**\n- 創建者:**前田利常**(3 代藩主・隠居後)\n- 立地:**小松市天神町**\n- 文化財:**国指定重要文化財 1968**(本殿+ 拝殿+ 神門)\n- 主祭神:**菅原道真公**\n- 並列:R1 育 那谷寺 717 + R5 育 安宅住吉神社 = 小松市文化遺産 3 大柱\n- 信仰:学業成就 + 受験生人気\n- 入場:**無料**(24h 開放)\n- アクセス:JR 小松駅 → バス 8 分",
    region: "chubu",
    prefecture_ja: "石川県",
    gun_ja: null,
    municipality_ja: "小松市",
    lg_code: "17203",
    area_types: ["shrine_temple"],
    lat: 36.4044,
    lon: 136.4456,
    season_start: null,
    season_end: null,
    event_start: null,
    event_end: null,
    price_tier: 1,
    booking_window_days: null,
    closed_days: [],
    external_urls: {},
    tags: ["komatsu_tenmangu", "1683", "342_years", "maeda_toshitsune", "national_jukubun_1968"],
    source: "manual",
  },
  {
    slug: "nakamura-bijutsukan-kanazawa-1966",
    category: "culture",
    sub_type: "museum_art",
    title_zh: "中村記念美術館(金沢市本多町・1966 開館・59 年+ 茶道美術専門+ 中村栄俊氏寄贈コレクション+ 国宝 + 重文多数)",
    title_ja: "中村記念美術館",
    romaji: "Nakamura Memorial Museum",
    summary_zh: "**中村記念美術館は茶道美術専門館**(金沢市本多町・**1966 開館・59 年**)。**中村栄俊氏寄贈の茶道具 + 古美術コレクション**、国宝 + 重要文化財多数、R1 育既出 R3 育 鈴木大拙館 + 西田哲学館と並ぶ金沢禅 + 茶文化文脈、谷口吉郎設計の建物自体も評価。",
    content_md: "- 開館:**1966 年・59 年**\n- 立地:金沢市本多町(R1 育 鈴木大拙館 + 国立工芸館 隣接)\n- 性格:**茶道美術専門**\n- 由来:**中村栄俊氏寄贈コレクション**\n- 主要展示:茶道具 + 古美術(国宝 + 重要文化財多数)\n- 設計:**谷口吉郎**(R3 育 谷口建築館 系譜)\n- 並列:R1 育 鈴木大拙館 + R3 育 西田哲学館 = 金沢禅 + 茶文化\n- 開館:9:30-17:00(月休)\n- 入館:大人 320 円\n- アクセス:JR 金沢駅 → バス 8 分(本多町)",
    region: "chubu",
    prefecture_ja: "石川県",
    gun_ja: null,
    municipality_ja: "金沢市",
    lg_code: "17201",
    area_types: ["museum_art"],
    lat: 36.5614,
    lon: 136.6664,
    season_start: null,
    season_end: null,
    event_start: null,
    event_end: null,
    price_tier: 1,
    booking_window_days: null,
    closed_days: ["mon"],
    external_urls: {},
    tags: ["nakamura_kinen", "1966", "59_years", "sado_arts", "taniguchi_yoshiro_design"],
    source: "manual",
  },
  {
    slug: "maeda-tosanokami-museum-2002",
    category: "culture",
    sub_type: "museum_art",
    title_zh: "前田土佐守家史料館(金沢市片町・2002 開館・23 年+ 加賀藩 8 家家老前田土佐守家史料展示)",
    title_ja: "前田土佐守家史料館",
    romaji: "Maeda Tosanokami Museum",
    summary_zh: "**前田土佐守家史料館は加賀藩家老史料館**(金沢市片町・**2002 開館・23 年**)。**加賀藩 8 家家老の 1 前田土佐守家(本家とは別系統)の史料展示**、R1 衣既出 長町武家屋敷跡 + R3 育 野村家武家屋敷と並ぶ加賀藩武家文化拠点、R1 楽 片町徒歩 5 分。",
    content_md: "- 開館:**2002 年・23 年**\n- 立地:金沢市片町(R1 楽 片町繁華街内)\n- 系譜:**加賀藩 8 家家老の 1 前田土佐守家**(本家とは別系統)\n- 並列:**R1 衣 長町武家屋敷跡 1583 + R3 育 野村家武家屋敷**= 加賀藩武家 3 大\n- 並列観光:R1 楽 片町繁華街 徒歩 5 分\n- 開館:9:30-17:00\n- 入館:大人 310 円\n- アクセス:北鉄バス 香林坊 徒歩 5 分",
    region: "chubu",
    prefecture_ja: "石川県",
    gun_ja: null,
    municipality_ja: "金沢市",
    lg_code: "17201",
    area_types: ["museum_art", "historic_district"],
    lat: 36.5631,
    lon: 136.6553,
    season_start: null,
    season_end: null,
    event_start: null,
    event_end: null,
    price_tier: 1,
    booking_window_days: null,
    closed_days: [],
    external_urls: {},
    tags: ["maeda_tosanokami", "2002", "23_years", "kaga_8_karoke", "katamachi"],
    source: "manual",
  },
  {
    slug: "noto-kannon-pilgrimage-overview",
    category: "culture",
    sub_type: "temple_shrine",
    title_zh: "能登 33 観音霊場(能登半島・郷土巡礼路+ 古代-近世の観音信仰+ 能登半島観光ルート)",
    title_ja: "能登観音霊場",
    romaji: "Noto Kannon Reijou",
    summary_zh: "**能登観音霊場は能登半島郷土巡礼路**(能登半島全域・**33 寺院巡礼**)。**古代-近世の観音信仰由来+ R6 育 総持寺祖院 1321 + R6 育 本興寺 1334 等の能登古寺を含む巡礼ルート**、R1 食既出 能登道の駅 + R3 行 のと里山海道で巡る能登観光と一体。",
    content_md: "- 範囲:**能登半島全域**(輪島市 + 珠洲市 + 七尾市 + 能登町 + 穴水町)\n- 規模:**33 寺院巡礼路**\n- 系譜:**古代-近世の観音信仰**\n- 並列:**R6 育 總持寺祖院 1321 + 本興寺 1334 + 山の寺寺院群 1581** = 能登古寺文化\n- 並列:R3 行 のと里山海道(2013 無料化)+ R4 行 能登道の駅 = 能登観光ルート\n- 災害:**2024 元日地震で多数被災**(復興中)\n- アクセス:車推奨(能登半島内移動)",
    region: "chubu",
    prefecture_ja: "石川県",
    gun_ja: null,
    municipality_ja: "輪島市",
    lg_code: "17204",
    area_types: ["shrine_temple"],
    lat: 37.3917,
    lon: 136.9008,
    season_start: null,
    season_end: null,
    event_start: null,
    event_end: null,
    price_tier: 2,
    booking_window_days: null,
    closed_days: [],
    external_urls: {},
    tags: ["noto_kannon_pilgrimage", "33_temples", "ancient_kannon_faith", "noto_peninsula_route"],
    source: "manual",
  },

  // ════════════════════════════════════════════════════════════════════
  // 楽 R7 (2) — 奥能登国際芸術祭 + 浅野川灯ろう流し
  // ════════════════════════════════════════════════════════════════════
  {
    slug: "oku-noto-art-festival-2017",
    category: "entertainment",
    sub_type: "ishikawa_noto_play",
    title_zh: "奥能登国際芸術祭(珠洲市・2017 開始+ 3 年ごと+ 北川フラム総合プロデューサー+ 大地の芸術祭系列)",
    title_ja: "奥能登国際芸術祭",
    romaji: "Oku Noto International Art Festival",
    summary_zh: "**奥能登国際芸術祭は能登半島代表アートフェス**(珠洲市・**2017 開始・3 年ごと開催**)。**北川フラム総合プロデューサー(大地の芸術祭・瀬戸内国際芸術祭の系列)**、R1 楽既出 聖域の岬 + R1 食 珠洲塩 揚浜式 350 年+ R6 食 宗玄酒造 1768 と並ぶ珠洲文化観光中核。**2024 地震で 2026 開催調整中**。",
    content_md: "- 開始:**2017 年・8 年**(初回)\n- 立地:**珠洲市全域**\n- 開催頻度:**3 年ごと**(2017 + 2020 → 2023 + 予定 2026)\n- プロデューサー:**北川フラム**(大地の芸術祭 + 瀬戸内国際芸術祭の系列)\n- 並列:**R1 楽 聖域の岬 + R1 食 珠洲塩 揚浜式 350 年 + R6 食 宗玄酒造 1768**\n- 災害:**2024 元日地震で 2026 開催調整中**\n- 入場:**作品鑑賞パスポート ¥3,000 前後**\n- アクセス:JR 七尾線 → 車 2.5 時間(復旧状況要確認)",
    region: "chubu",
    prefecture_ja: "石川県",
    gun_ja: null,
    municipality_ja: "珠洲市",
    lg_code: "17205",
    area_types: ["festival_event"],
    lat: 37.4339,
    lon: 137.1581,
    season_start: null,
    season_end: null,
    event_start: null,
    event_end: null,
    price_tier: 3,
    booking_window_days: 60,
    closed_days: [],
    external_urls: {},
    tags: ["oku_noto_art_fes", "2017", "every_3_years", "kitagawa_furam", "echigo_setouchi_series"],
    source: "manual",
  },
  {
    slug: "asanogawa-toro-nagashi-summer",
    category: "entertainment",
    sub_type: "ishikawa_kanazawa_play",
    title_zh: "浅野川灯ろう流し(金沢市・夏夜開催+ R1 育 ひがし茶屋街 + 主計町茶屋街 沿い+ 加賀夏の風物詩)",
    title_ja: "浅野川灯ろう流し",
    romaji: "Asanogawa Toro Nagashi",
    summary_zh: "**浅野川灯ろう流しは加賀夏の風物詩**(金沢市・**8 月夜開催**)。**R1 育既出 ひがし茶屋街 + 主計町茶屋街沿いの浅野川**、R4 楽 浅野川友禅流し(5 月)に対する夏版、R1 楽 浅野川河畔桜(春)+ R3 楽 浅野川河畔桜(春版)+ 浅野川友禅流し(5 月)+ 浅野川灯ろう流し(夏)の浅野川 4 季行事の柱。",
    content_md: "- 開催:**8 月の夜**(年により変動)\n- 立地:金沢市浅野川河畔(R1 育 ひがし茶屋街 + 主計町茶屋街 沿い)\n- 性格:**加賀夏の風物詩**\n- 並列:**R1 楽 浅野川河畔桜(春)+ R4 楽 浅野川友禅流し(5 月)+ R7 楽 浅野川灯ろう流し(夏)** = 浅野川 4 季行事\n- 並列観光:R1 育 ひがし茶屋街 + R1 住 主計町茶屋街町家泊\n- 入場:**無料**(沿道観覧)\n- アクセス:北鉄バス 橋場町 徒歩 5 分",
    region: "chubu",
    prefecture_ja: "石川県",
    gun_ja: null,
    municipality_ja: "金沢市",
    lg_code: "17201",
    area_types: ["festival_event"],
    lat: 36.5722,
    lon: 136.6675,
    season_start: null,
    season_end: null,
    event_start: "2026-08-08",
    event_end: "2026-08-08",
    price_tier: 1,
    booking_window_days: null,
    closed_days: [],
    external_urls: {},
    tags: ["asanogawa_toro_nagashi", "summer_night", "kaga_summer_tradition", "chayagai_nightside"],
    source: "manual",
  },
];

async function main() {
  if (rows.length === 0) {
    console.log("[ishikawa-r7] 尚無條目");
    return;
  }
  console.log(`[ishikawa-r7] ${rows.length} 筆 ${DRY ? "(dry-run)" : ""}`);
  if (DRY) {
    const byCat = new Map<string, number>();
    for (const r of rows) byCat.set(r.category, (byCat.get(r.category) ?? 0) + 1);
    for (const [k, v] of [...byCat.entries()].sort()) {
      console.log(`  ${k.padEnd(15)} ${v}`);
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
      console.error("[ishikawa-r7] upsert failed:", error);
      process.exit(1);
    }
    written += batch.length;
    process.stdout.write(`\r[ishikawa-r7] upsert: ${written}/${rows.length}`);
  }
  process.stdout.write("\n");
  console.log(`[ishikawa-r7] Done — ${written} rows.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

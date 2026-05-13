// Seed 長崎県 · 住類 條目 → public.japan_entries(Sprint 20.2 住 R1)
//
// 長崎 = 異国の坂 + 温泉郷 + 離島宿:
//   - 雲仙温泉(1934 日本初の国立公園):雲仙観光ホテル 1935 国登録文化財・富貴屋 1730・九州ホテル 1917
//   - 小浜温泉(海岸):春陽館 1926 国登録・100m 足湯
//   - 長崎市内:ANA グラバーヒル(1956 系)・ガーデンテラス長崎 2009(隈研吾)・ニュー長崎(駅前)
//   - ハウステンボス(1992):ヨーロッパ・アムステルダム(欧風最高級)・オークラ JR
//   - 平戸:海上ホテル(平戸城前)+ 国際観光ホテル
//   - 五島列島:カンパーナ福江・五島コンカナ王国・教会群民宿
//   - 壱岐:壱岐リトリート海里村上(2016・全国級高級宿)
//   - 対馬:対馬グランド・厳原 旅館
//   - 島原:温泉ホテル南風楼
//
// 25 筆構成:
//   Phase A 長崎市 5(ANA グラバー・ガーデンテラス・ベルビュー出島・ニュー長崎・清風 1955)
//   Phase B 雲仙温泉 4(観光ホテル 1935・富貴屋 1730・九州 1917・半水盧)
//   Phase C 小浜温泉 2(春陽館 1926・伊勢屋)
//   Phase D ハウステンボス 3(ヨーロッパ・アムステルダム・オークラ JR HTB)
//   Phase E 平戸 2(海上ホテル・国際観光)
//   Phase F 五島列島 3(カンパーナ福江・コンカナ王国・新上五島ペンション)
//   Phase G 壱岐 2(海里村上 2016・平山旅館)
//   Phase H 対馬 2(対馬グランド・厳原旅館)
//   Phase I 島原 2(南風楼・島原温泉概論)
//
// Usage:
//   npx tsx scripts/seed-japan-entries-nagasaki-lodging.ts --dry-run
//   npx tsx scripts/seed-japan-entries-nagasaki-lodging.ts

import { config as loadEnv } from "dotenv";
loadEnv({ path: ".env.local" });

import { createAdminClient } from "../src/lib/supabase/admin";

const DRY = process.argv.includes("--dry-run");

type SubType =
  | "nagasaki_unzen_classical"
  | "nagasaki_huis_ten_bosch"
  | "nagasaki_island_lodging"
  | "onsen_ryokan"
  | "luxury_hotel"
  | "budget_hotel_chain"
  | "rural_minshuku";

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
  // ════════════════════════════════════════════════════════════════════
  // Phase A — 長崎市ホテル 5 筆
  // ════════════════════════════════════════════════════════════════════
  {
    slug: "ana-crowne-plaza-nagasaki-glover",
    category: "lodging",
    sub_type: "luxury_hotel",
    title_zh: "ANA クラウンプラザ長崎グラバーヒル(グラバー園隣接・長崎港 view・観光中心地)",
    title_ja: "ANA クラウンプラザ ホテル長崎グラバーヒル",
    romaji: "ANA Crowne Plaza Nagasaki",
    summary_zh: "**ANA クラウンプラザ長崎グラバーヒルは長崎観光の中心ホテル**(グラバー園隣接・大浦天主堂徒歩 5 分)。IHG 系列、長崎港 + 出島 view の上層階客室、グラバー邸 + 大浦天主堂 + 新地中華街 全部徒歩圏。217 室・レストラン 4 軒・1F に長崎銘菓ショップ併設。",
    content_md: "- 系列:ANA + IHG クラウンプラザ\n- 立地:長崎市南山手町(グラバー園 + 大浦天主堂 隣接)\n- 客室:217 室・長崎港 view 客室あり\n- 食事:中華料理 + 鉄板焼 + 和食 + 朝食ビュッフェ\n- 観光圏:グラバー園 徒歩 5 分・大浦天主堂 徒歩 5 分・出島 徒歩 15 分・新地中華街 徒歩 12 分\n- 価格帯:1 泊朝食付 ¥18000-40000/人\n- アクセス:長崎電気軌道 大浦天主堂電停 徒歩 1 分",
    region: "kyushu",
    prefecture_ja: "長崎県",
    gun_ja: null,
    municipality_ja: "長崎市",
    lg_code: "42201",
    area_types: ["urban_central", "luxury_resort"],
    lat: 32.738,
    lon: 129.866,
    season_start: null,
    season_end: null,
    event_start: null,
    event_end: null,
    price_tier: 4,
    booking_window_days: 30,
    closed_days: [],
    external_urls: {},
    tags: ["luxury_hotel", "ana_crowne_plaza", "glover_park", "ihg"],
    source: "manual",
  },
  {
    slug: "garden-terrace-nagasaki-2009-kuma",
    category: "lodging",
    sub_type: "luxury_hotel",
    title_zh: "ガーデンテラス長崎(2009 開業・隈研吾設計・稲佐山中腹・全長崎眺望ホテル)",
    title_ja: "ガーデンテラス長崎ホテル&リゾート",
    romaji: "Garden Terrace Nagasaki",
    summary_zh: "**ガーデンテラス長崎は隈研吾設計のラグジュアリーリゾート**(2009 開業)。稲佐山中腹 海抜 200m に建つ建築、長崎市街地 + 長崎港 + 軍艦島 まで一望。全 41 室・全室テラス付・夜景は「世界新三大夜景」(長崎)の中心 view。客室別棟 + メインダイニング + 庭園の隈研吾木造建築群。",
    content_md: "- 開業:2009 年(平成21)長崎\n- 設計:隈研吾(代表的ホテル設計作品の 1)\n- 立地:長崎市秋月町(稲佐山 中腹・海抜 200m)\n- 客室:全 41 室・全室テラス + 長崎眺望\n- 隈研吾建築:客室別棟 8 棟 + メインダイニング + 庭園(全木造現代建築)\n- 夜景:世界新三大夜景(長崎)の中心 view・「1000 万ドルの夜景」\n- 食事:フランス料理 + 和食会席\n- 価格帯:1 泊 2 食 ¥40000-100000/人\n- アクセス:JR 長崎駅 から車 10 分・送迎あり",
    region: "kyushu",
    prefecture_ja: "長崎県",
    gun_ja: null,
    municipality_ja: "長崎市",
    lg_code: "42201",
    area_types: ["luxury_resort", "urban_central"],
    lat: 32.755,
    lon: 129.851,
    season_start: null,
    season_end: null,
    event_start: null,
    event_end: null,
    price_tier: 5,
    booking_window_days: 60,
    closed_days: [],
    external_urls: { official: "https://www.gt-nagasaki.jp/" },
    tags: ["luxury_hotel", "garden_terrace", "2009", "kuma_kengo", "world_3_night_views"],
    source: "manual",
  },
  {
    slug: "hotel-bellview-nagasaki-dejima",
    category: "lodging",
    sub_type: "luxury_hotel",
    title_zh: "ホテルベルビュー長崎出島(出島隣接・長崎駅 + 中華街徒歩圏・観光客中堅級)",
    title_ja: "ホテルベルビュー長崎出島",
    romaji: "Hotel Bellview Nagasaki Dejima",
    summary_zh: "**ホテルベルビュー長崎出島は出島隣接の中堅ホテル**(長崎市出島町)。出島 → 新地中華街 → 大浦天主堂 への観光導線の中心、JR 長崎駅 徒歩 12 分の駅近。150 室・コスパ重視の中堅価格 ¥10000-20000/人。",
    content_md: "- 立地:長崎市出島町(出島隣接)\n- 客室:約 150 室\n- 観光圏:出島 徒歩 0 分・新地中華街 徒歩 5 分・大浦天主堂 徒歩 18 分\n- 食事:朝食ビュッフェ + 1F レストラン\n- 価格帯:1 泊朝食付 ¥10000-20000/人\n- 客層:観光客 + ビジネス客\n- アクセス:長崎電気軌道 出島電停 徒歩 1 分・JR 長崎駅 徒歩 12 分",
    region: "kyushu",
    prefecture_ja: "長崎県",
    gun_ja: null,
    municipality_ja: "長崎市",
    lg_code: "42201",
    area_types: ["urban_central", "historic_district"],
    lat: 32.744,
    lon: 129.870,
    season_start: null,
    season_end: null,
    event_start: null,
    event_end: null,
    price_tier: 3,
    booking_window_days: 30,
    closed_days: [],
    external_urls: {},
    tags: ["luxury_hotel", "hotel_bellview", "dejima", "nagasaki_city"],
    source: "manual",
  },
  {
    slug: "hotel-new-nagasaki-station",
    category: "lodging",
    sub_type: "luxury_hotel",
    title_zh: "ホテルニュー長崎(JR 長崎駅前・1980 開業・地元代表上級ホテル)",
    title_ja: "ホテルニュー長崎",
    romaji: "Hotel New Nagasaki",
    summary_zh: "**ホテルニュー長崎は JR 長崎駅前の地元代表上級ホテル**(1980 開業)。アミュプラザ長崎(駅ビル)隣接、駅徒歩 1 分の最強アクセス。150 室、長崎市内主要観光地への市電 + バス hub も駅前で完結。1F 「ヘンリーマンセル ガーデン」(レストラン)が地元結婚式 + 会食定番。",
    content_md: "- 開業:1980 年(昭和55)長崎\n- 立地:JR 長崎駅 前(徒歩 1 分・アミュプラザ長崎隣接)\n- 客室:約 150 室\n- レストラン:ヘンリーマンセル ガーデン(地元結婚式 + 会食定番)\n- 価格帯:1 泊朝食付 ¥10000-22000/人\n- 客層:出張族 + 観光客 + 結婚式参列\n- アクセス:JR 長崎駅 徒歩 1 分",
    region: "kyushu",
    prefecture_ja: "長崎県",
    gun_ja: null,
    municipality_ja: "長崎市",
    lg_code: "42201",
    area_types: ["urban_central"],
    lat: 32.752,
    lon: 129.875,
    season_start: null,
    season_end: null,
    event_start: null,
    event_end: null,
    price_tier: 3,
    booking_window_days: 30,
    closed_days: [],
    external_urls: { official: "https://www.newnaga.com/" },
    tags: ["luxury_hotel", "hotel_new_nagasaki", "1980", "station_front"],
    source: "manual",
  },
  {
    slug: "nagasaki-hotel-seifu-1955",
    category: "lodging",
    sub_type: "luxury_hotel",
    title_zh: "長崎ホテル清風(1955 創業・思案橋・地元老舗・グラバー園+中華街導線)",
    title_ja: "長崎ホテル 清風",
    romaji: "Nagasaki Hotel Seifu",
    summary_zh: "**長崎ホテル清風は地元老舗ホテル**(1955 創業)。70 年余、長崎市思案橋エリア、グラバー園 + 大浦天主堂 + 中華街 への観光導線立地。全 80 室の中規模、コスパ重視の中堅価格。",
    content_md: "- 創業:1955 年(昭和30)長崎\n- 立地:長崎市本石灰町(思案橋電停近く)\n- 客室:約 80 室\n- 観光圏:グラバー園 徒歩 8 分・大浦天主堂 徒歩 8 分・新地中華街 徒歩 4 分\n- 食事:朝食ビュッフェ\n- 価格帯:1 泊朝食付 ¥9000-18000/人\n- アクセス:長崎電気軌道 思案橋電停 徒歩 1 分",
    region: "kyushu",
    prefecture_ja: "長崎県",
    gun_ja: null,
    municipality_ja: "長崎市",
    lg_code: "42201",
    area_types: ["urban_central", "historic_district"],
    lat: 32.745,
    lon: 129.876,
    season_start: null,
    season_end: null,
    event_start: null,
    event_end: null,
    price_tier: 2,
    booking_window_days: 30,
    closed_days: [],
    external_urls: {},
    tags: ["luxury_hotel", "hotel_seifu", "1955", "shianbashi"],
    source: "manual",
  },

  // ════════════════════════════════════════════════════════════════════
  // Phase B — 雲仙温泉 4 筆
  // ════════════════════════════════════════════════════════════════════
  {
    slug: "unzen-kanko-hotel-1935",
    category: "lodging",
    sub_type: "nagasaki_unzen_classical",
    title_zh: "雲仙観光ホテル(1935 開業・国登録有形文化財・クラシックホテル代表・国立公園第 1 号)",
    title_ja: "雲仙観光ホテル",
    romaji: "Unzen Kanko Hotel",
    summary_zh: "**雲仙観光ホテルは日本のクラシックホテル代表**(昭和10年/1935 開業)。雲仙国立公園(1934 日本最初の国立公園)指定の翌年に開業、外国人客向けの欧風リゾートホテルとして建造。スイス風山荘建築 + 90 年保存の本館は国登録有形文化財(2003)。日光金谷ホテル + 富士屋ホテル と並ぶ「日本三大クラシックホテル」の 1。",
    content_md: "- 開業:1935 年(昭和10)雲仙\n- 雲仙国立公園:1934 日本最初の国立公園(瀬戸内海・霧島と同年指定)\n- 認定:国登録有形文化財(2003 本館)\n- 全国位置:日光金谷 + 富士屋 + 雲仙観光 = 日本三大クラシックホテル\n- 建築:スイス風山荘 + 切妻屋根 + 暖炉ロビー\n- 客室:約 40 室・全館クラシック家具\n- 風呂:雲仙温泉自家源泉 + 大浴場 + 露天\n- 食事:フランス料理 + 和食会席\n- 価格帯:1 泊 2 食 ¥30000-60000/人\n- アクセス:JR 諫早駅 から バス 80 分・雲仙温泉下車",
    region: "kyushu",
    prefecture_ja: "長崎県",
    gun_ja: null,
    municipality_ja: "雲仙市",
    lg_code: "42213",
    area_types: ["onsen_town", "luxury_resort", "historic_district"],
    lat: 32.732,
    lon: 130.262,
    season_start: null,
    season_end: null,
    event_start: null,
    event_end: null,
    price_tier: 5,
    booking_window_days: 60,
    closed_days: [],
    external_urls: { official: "https://www.unzenkankohotel.com/" },
    tags: ["nagasaki_unzen_classical", "unzen_kanko", "1935", "registered_cultural_property", "japan_3_classic_hotels"],
    source: "manual",
  },
  {
    slug: "unzen-fukiya-1730",
    category: "lodging",
    sub_type: "nagasaki_unzen_classical",
    title_zh: "富貴屋(雲仙温泉最古旅館・1730 創業・290 年伝統・湯元別館)",
    title_ja: "富貴屋(ふきや)",
    romaji: "Fukiya",
    summary_zh: "**富貴屋は雲仙温泉現存最古の旅館**(享保15年/1730 創業)。290 年余、雲仙温泉郷で家業 12 代目継承。雲仙地獄真上の湯元、自家源泉 + 露天 + 別館「湯元」の 3 棟体制。観光ホテル 1935 のような欧風ではなく、純和風老舗温泉宿として温泉郷文化の継承役。",
    content_md: "- 創業:1730 年(享保15)雲仙\n- 当主:富貴屋家(12 代目)\n- 立地:雲仙市雲仙温泉(雲仙地獄真上)\n- 客室:全 28 室・純和風\n- 風呂:自家源泉 大浴場 + 露天 + 貸切\n- 食事:卓袱料理 + 雲仙地獄料理\n- 価格帯:1 泊 2 食 ¥18000-40000/人\n- アクセス:JR 諫早駅 から バス 80 分・雲仙温泉下車",
    region: "kyushu",
    prefecture_ja: "長崎県",
    gun_ja: null,
    municipality_ja: "雲仙市",
    lg_code: "42213",
    area_types: ["onsen_town", "historic_district"],
    lat: 32.732,
    lon: 130.260,
    season_start: null,
    season_end: null,
    event_start: null,
    event_end: null,
    price_tier: 4,
    booking_window_days: 30,
    closed_days: [],
    external_urls: {},
    tags: ["nagasaki_unzen_classical", "fukiya", "1730", "290_years"],
    source: "manual",
  },
  {
    slug: "unzen-kyushu-hotel-1917",
    category: "lodging",
    sub_type: "nagasaki_unzen_classical",
    title_zh: "雲仙九州ホテル(1917 開業・大正期建築・「雲仙の隠れ家」)",
    title_ja: "雲仙九州ホテル",
    romaji: "Unzen Kyushu Hotel",
    summary_zh: "**雲仙九州ホテルは大正期開業の中堅老舗**(大正6年/1917 開業)。雲仙観光ホテル 1935 より早い 100 年余の歴史、温泉郷の「隠れ家」的存在。客室 19 室の小規模・全室温泉付という上級設定で、観光ホテル(欧風)+ 富貴屋(和風)とは異なる「現代和風モダン」のニッチ。",
    content_md: "- 開業:1917 年(大正6)雲仙\n- 立地:雲仙市雲仙温泉(温泉郷の閑静な側)\n- 客室:全 19 室(全室温泉付)\n- 風呂:全室温泉 + 共用展望大浴場\n- 食事:和食会席 + 卓袱風料理\n- 価格帯:1 泊 2 食 ¥35000-70000/人\n- 客層:カップル + 大人の隠れ家利用\n- アクセス:JR 諫早駅 から バス 80 分・雲仙温泉下車",
    region: "kyushu",
    prefecture_ja: "長崎県",
    gun_ja: null,
    municipality_ja: "雲仙市",
    lg_code: "42213",
    area_types: ["onsen_town", "historic_district"],
    lat: 32.732,
    lon: 130.262,
    season_start: null,
    season_end: null,
    event_start: null,
    event_end: null,
    price_tier: 5,
    booking_window_days: 60,
    closed_days: [],
    external_urls: { official: "https://www.kyushuhtl.co.jp/" },
    tags: ["nagasaki_unzen_classical", "kyushu_hotel", "1917", "taisho_era"],
    source: "manual",
  },
  {
    slug: "unzen-hansuiroh",
    category: "lodging",
    sub_type: "nagasaki_unzen_classical",
    title_zh: "雲仙温泉 半水盧(現代高級和風旅館・全室源泉露天・小規模ラグジュアリー)",
    title_ja: "半水盧(はんすいろ)",
    romaji: "Hansuiroh",
    summary_zh: "**半水盧は雲仙温泉の現代高級和風旅館**。客室 14 室の小規模、全室源泉掛け流し露天風呂付の上級設計。富貴屋 1730 + 観光ホテル 1935 + 九州 1917 の老舗 3 強と異なる「現代ラグジュアリー」枠で、Relais & Chateaux 系の感覚。",
    content_md: "- 立地:雲仙市雲仙温泉\n- 客室:14 室・全室源泉掛け流し露天風呂付\n- 風呂:客室付露天 + 共用大浴場\n- 食事:雲仙地獄料理 + 山海会席\n- 価格帯:1 泊 2 食 ¥45000-90000/人\n- 客層:大人カップル + 海外客\n- アクセス:JR 諫早駅 から バス 80 分・雲仙温泉下車",
    region: "kyushu",
    prefecture_ja: "長崎県",
    gun_ja: null,
    municipality_ja: "雲仙市",
    lg_code: "42213",
    area_types: ["onsen_town", "luxury_resort"],
    lat: 32.732,
    lon: 130.262,
    season_start: null,
    season_end: null,
    event_start: null,
    event_end: null,
    price_tier: 5,
    booking_window_days: 60,
    closed_days: [],
    external_urls: {},
    tags: ["nagasaki_unzen_classical", "hansuiroh", "modern_luxury"],
    source: "manual",
  },

  // ════════════════════════════════════════════════════════════════════
  // Phase C — 小浜温泉 2 筆
  // ════════════════════════════════════════════════════════════════════
  {
    slug: "obama-shunyokan-1926",
    category: "lodging",
    sub_type: "onsen_ryokan",
    title_zh: "旅館春陽館(小浜温泉・1926 開業・国登録有形文化財・橘湾絶景)",
    title_ja: "旅館 春陽館",
    romaji: "Ryokan Shunyokan",
    summary_zh: "**春陽館は小浜温泉の老舗旅館**(大正15年/1926 開業)。100 年弱の木造 2 階建て本館は国登録有形文化財(2007)、橘湾の夕陽絶景立地。湯量豊富な小浜温泉(105°C+ 高温泉)を引き湯、伝統的な海岸温泉宿の佇まい。",
    content_md: "- 開業:1926 年(大正15)小浜\n- 認定:国登録有形文化財(2007 本館)\n- 立地:雲仙市小浜温泉(橘湾沿い)\n- 客室:約 18 室・木造 2 階建て本館\n- 風呂:小浜温泉引き湯(105°C+ 高温源泉・希釈)・大浴場 + 露天\n- 食事:海鮮会席(橘湾魚介)\n- 価格帯:1 泊 2 食 ¥18000-35000/人\n- アクセス:JR 諫早駅 から バス 60 分・小浜温泉下車",
    region: "kyushu",
    prefecture_ja: "長崎県",
    gun_ja: null,
    municipality_ja: "雲仙市",
    lg_code: "42213",
    area_types: ["onsen_town", "fishing_port"],
    lat: 32.722,
    lon: 130.197,
    season_start: null,
    season_end: null,
    event_start: null,
    event_end: null,
    price_tier: 3,
    booking_window_days: 30,
    closed_days: [],
    external_urls: {},
    tags: ["onsen_ryokan", "shunyokan", "1926", "registered_cultural_property", "obama"],
    source: "manual",
  },
  {
    slug: "obama-onsen-iseya",
    category: "lodging",
    sub_type: "onsen_ryokan",
    title_zh: "伊勢屋旅館(小浜温泉・足湯ほっとふっと 105 隣接・橘湾夕陽絶景)",
    title_ja: "伊勢屋旅館",
    romaji: "Iseya Ryokan",
    summary_zh: "**伊勢屋旅館は小浜温泉の中堅宿**。日本一長い足湯「ほっとふっと 105」(全長 105m・2010 開設)隣接、橘湾の夕陽絶景立地。客室 30 室・露天風呂 + 足湯利用込みのコスパ重視の温泉宿、家族 + カップルの幅広い客層。",
    content_md: "- 立地:雲仙市小浜温泉(橘湾沿い・足湯隣接)\n- 客室:約 30 室\n- 風呂:小浜温泉自家源泉 + 露天風呂\n- 隣接施設:ほっとふっと 105(全長 105m 日本一の足湯・2010 開設)\n- 食事:橘湾海鮮会席\n- 価格帯:1 泊 2 食 ¥12000-25000/人\n- アクセス:JR 諫早駅 から バス 60 分・小浜温泉下車",
    region: "kyushu",
    prefecture_ja: "長崎県",
    gun_ja: null,
    municipality_ja: "雲仙市",
    lg_code: "42213",
    area_types: ["onsen_town", "fishing_port"],
    lat: 32.722,
    lon: 130.197,
    season_start: null,
    season_end: null,
    event_start: null,
    event_end: null,
    price_tier: 3,
    booking_window_days: 30,
    closed_days: [],
    external_urls: {},
    tags: ["onsen_ryokan", "iseya", "obama", "hotfoot_105"],
    source: "manual",
  },

  // ════════════════════════════════════════════════════════════════════
  // Phase D — ハウステンボス 3 筆
  // ════════════════════════════════════════════════════════════════════
  {
    slug: "hotel-europa-htb",
    category: "lodging",
    sub_type: "nagasaki_huis_ten_bosch",
    title_zh: "ホテルヨーロッパ(HTB 内最高級・1992 開業・運河沿い・欧風建築)",
    title_ja: "ホテルヨーロッパ",
    romaji: "Hotel Europa",
    summary_zh: "**ホテルヨーロッパはハウステンボス内の最高級ホテル**(1992 HTB 開園同期開業)。ハウステンボスの運河沿い、17 世紀オランダ宮殿風建築、ロビー + 客室 + 庭園が完全な欧風リゾート空間。VIP / 海外客向け、客室 297 室。HTB チケットなしでも宿泊可能。",
    content_md: "- 開業:1992 年(平成4)HTB 開園同期\n- 系列:ハウステンボス株式会社\n- 立地:ハウステンボス内(運河沿い・タワーシティ近く)\n- 客室:297 室・全室欧風内装\n- 建築:17 世紀オランダ宮殿風\n- 客層:VIP + 海外客 + 結婚式参列\n- 食事:フランス料理 + 鉄板焼 + 和食 + バー\n- HTB パスポート:宿泊客 1 日券特典あり\n- 価格帯:1 泊朝食付 ¥30000-80000/人\n- アクセス:JR ハウステンボス駅 から場内クルーザー or 場内バス",
    region: "kyushu",
    prefecture_ja: "長崎県",
    gun_ja: null,
    municipality_ja: "佐世保市",
    lg_code: "42202",
    area_types: ["luxury_resort"],
    lat: 33.083,
    lon: 129.789,
    season_start: null,
    season_end: null,
    event_start: null,
    event_end: null,
    price_tier: 5,
    booking_window_days: 60,
    closed_days: [],
    external_urls: {},
    tags: ["nagasaki_huis_ten_bosch", "hotel_europa", "1992", "luxury_dutch"],
    source: "manual",
  },
  {
    slug: "hotel-amsterdam-htb",
    category: "lodging",
    sub_type: "nagasaki_huis_ten_bosch",
    title_zh: "ホテルアムステルダム(HTB 内・1992 開業・市民広場前・観光導線中心)",
    title_ja: "ホテルアムステルダム",
    romaji: "Hotel Amsterdam",
    summary_zh: "**ホテルアムステルダムは HTB 場内中型ホテル**(1992 同期開業)。場内アムステルダム広場前の最強立地、HTB 観光客向けのフラッグシップ。234 室、ヨーロッパ(最高級)より手の届く価格 ¥18000-35000、家族客中心。",
    content_md: "- 開業:1992 年(平成4)HTB 同期\n- 立地:HTB 場内アムステルダム広場前\n- 客室:234 室\n- 客層:家族 + カップル + 友人グループ\n- 食事:バイキング + コース + ラウンジ\n- HTB パスポート:宿泊客 1 日券特典あり\n- 価格帯:1 泊朝食付 ¥18000-35000/人\n- アクセス:JR ハウステンボス駅 場内バス 5 分",
    region: "kyushu",
    prefecture_ja: "長崎県",
    gun_ja: null,
    municipality_ja: "佐世保市",
    lg_code: "42202",
    area_types: ["luxury_resort"],
    lat: 33.082,
    lon: 129.788,
    season_start: null,
    season_end: null,
    event_start: null,
    event_end: null,
    price_tier: 4,
    booking_window_days: 30,
    closed_days: [],
    external_urls: {},
    tags: ["nagasaki_huis_ten_bosch", "hotel_amsterdam", "1992"],
    source: "manual",
  },
  {
    slug: "hotel-okura-jr-huis-ten-bosch-1992",
    category: "lodging",
    sub_type: "nagasaki_huis_ten_bosch",
    title_zh: "ホテルオークラ JR ハウステンボス(1992 開業・JR 駅直結・HTB 隣接)",
    title_ja: "ホテルオークラ JR ハウステンボス",
    romaji: "Hotel Okura JR Huis Ten Bosch",
    summary_zh: "**ホテルオークラ JR ハウステンボスは HTB 隣接の上級ホテル**(1992 開業・オークラ + JR 共同)。JR ハウステンボス駅 徒歩 1 分の駅近、HTB 場外だが場内連絡橋でアクセス便利。300 室、運河 view 客室あり、HTB ホテル群より価格手頃。",
    content_md: "- 開業:1992 年(平成4)\n- 系列:ホテルオークラ + JR 九州\n- 立地:JR ハウステンボス駅 徒歩 1 分(場外・連絡橋でアクセス可)\n- 客室:300 室\n- 風呂:展望大浴場(関西人客には嬉しい温泉風)\n- 食事:バイキング + 中華 + 和食 + 鉄板焼\n- HTB パスポート:宿泊客特典あり\n- 価格帯:1 泊朝食付 ¥15000-32000/人\n- アクセス:JR ハウステンボス駅 徒歩 1 分",
    region: "kyushu",
    prefecture_ja: "長崎県",
    gun_ja: null,
    municipality_ja: "佐世保市",
    lg_code: "42202",
    area_types: ["luxury_resort", "urban_central"],
    lat: 33.080,
    lon: 129.786,
    season_start: null,
    season_end: null,
    event_start: null,
    event_end: null,
    price_tier: 3,
    booking_window_days: 30,
    closed_days: [],
    external_urls: { official: "https://www.jrhtb.hotelokura.co.jp/" },
    tags: ["nagasaki_huis_ten_bosch", "hotel_okura_jr", "1992", "station_direct"],
    source: "manual",
  },

  // ════════════════════════════════════════════════════════════════════
  // Phase E — 平戸 2 筆
  // ════════════════════════════════════════════════════════════════════
  {
    slug: "hirado-kaijo-hotel",
    category: "lodging",
    sub_type: "onsen_ryokan",
    title_zh: "平戸海上ホテル(平戸城前・温泉付・南蛮貿易の地で泊まる)",
    title_ja: "平戸海上ホテル",
    romaji: "Hirado Kaijo Hotel",
    summary_zh: "**平戸海上ホテルは平戸島の代表温泉ホテル**。平戸城前 + 平戸瀬戸 view・温泉 + 海鮮会席で平戸南蛮貿易の歴史地で泊まる体験。客室 50 室、平戸大橋 + 平戸城 + ザビエル記念聖堂 が徒歩圏。",
    content_md: "- 立地:平戸市岩の上町(平戸城前・平戸瀬戸沿い)\n- 客室:約 50 室\n- 風呂:平戸温泉自家源泉 + 露天\n- 食事:平戸魚介(ヒラメ・伊勢海老)+ 平戸和牛\n- 観光圏:平戸城 徒歩 5 分・ザビエル記念聖堂 徒歩 8 分\n- 価格帯:1 泊 2 食 ¥18000-35000/人\n- アクセス:松浦鉄道 たびら平戸口駅 から バス 5 分",
    region: "kyushu",
    prefecture_ja: "長崎県",
    gun_ja: null,
    municipality_ja: "平戸市",
    lg_code: "42207",
    area_types: ["onsen_town", "historic_district"],
    lat: 33.371,
    lon: 129.553,
    season_start: null,
    season_end: null,
    event_start: null,
    event_end: null,
    price_tier: 3,
    booking_window_days: 30,
    closed_days: [],
    external_urls: { official: "https://www.kaijo.co.jp/" },
    tags: ["onsen_ryokan", "hirado_kaijo", "hirado"],
    source: "manual",
  },
  {
    slug: "hirado-kankou-hotel",
    category: "lodging",
    sub_type: "onsen_ryokan",
    title_zh: "平戸国際観光ホテル旗松亭(温泉ホテル・平戸全景眺望)",
    title_ja: "平戸国際観光ホテル 旗松亭",
    romaji: "Hirado International Kishotei",
    summary_zh: "**平戸国際観光ホテル旗松亭は平戸の高台温泉ホテル**。平戸瀬戸 + 平戸大橋 + 平戸城 を一望する高台立地、客室 60 室、温泉 + 海鮮会席。客室から平戸城のライトアップ夜景が楽しめる、平戸観光のハイエンド宿。",
    content_md: "- 立地:平戸市岩の上町(高台・平戸全景眺望)\n- 客室:約 60 室\n- 風呂:平戸温泉自家源泉 + 露天(展望)\n- 食事:平戸魚介会席\n- 価格帯:1 泊 2 食 ¥20000-40000/人\n- アクセス:松浦鉄道 たびら平戸口駅 から バス 7 分",
    region: "kyushu",
    prefecture_ja: "長崎県",
    gun_ja: null,
    municipality_ja: "平戸市",
    lg_code: "42207",
    area_types: ["onsen_town", "luxury_resort"],
    lat: 33.371,
    lon: 129.553,
    season_start: null,
    season_end: null,
    event_start: null,
    event_end: null,
    price_tier: 4,
    booking_window_days: 30,
    closed_days: [],
    external_urls: {},
    tags: ["onsen_ryokan", "kishotei", "hirado_international"],
    source: "manual",
  },

  // ════════════════════════════════════════════════════════════════════
  // Phase F — 五島列島 3 筆
  // ════════════════════════════════════════════════════════════════════
  {
    slug: "campana-hotel-fukue",
    category: "lodging",
    sub_type: "nagasaki_island_lodging",
    title_zh: "カンパーナホテル(五島市福江島・1992 開業・教会群+椿+ビーチ拠点)",
    title_ja: "カンパーナホテル",
    romaji: "Campana Hotel",
    summary_zh: "**カンパーナホテルは五島市福江島の代表ホテル**(1992 開業)。下五島観光の中心拠点、福江島内のキリシタン教会群 + 鬼岳 + 高浜ビーチ アクセス起点。客室 130 室、五島魚介 + 五島うどん + 五島牛 のコース。",
    content_md: "- 開業:1992 年(平成4)五島市福江島\n- 立地:五島市末広町(福江港 徒歩 8 分)\n- 客室:約 130 室\n- 食事:五島魚介(あご + 平鯵 + マグロ)+ 五島うどん地獄炊き + 五島牛\n- 観光起点:堂崎天主堂・水ノ浦教会・鬼岳・高浜ビーチ アクセス\n- 価格帯:1 泊 2 食 ¥15000-32000/人\n- アクセス:福江港(博多+長崎+佐世保 からフェリー)or 福江空港(JTA + ANA)",
    region: "kyushu",
    prefecture_ja: "長崎県",
    gun_ja: null,
    municipality_ja: "五島市",
    lg_code: "42211",
    area_types: ["luxury_resort", "fishing_port"],
    lat: 32.696,
    lon: 128.842,
    season_start: null,
    season_end: null,
    event_start: null,
    event_end: null,
    price_tier: 3,
    booking_window_days: 60,
    closed_days: [],
    external_urls: {},
    tags: ["nagasaki_island_lodging", "campana", "fukue", "1992"],
    source: "manual",
  },
  {
    slug: "goto-conkana-1980s",
    category: "lodging",
    sub_type: "nagasaki_island_lodging",
    title_zh: "五島コンカナ王国(五島市・コテージリゾート・温泉+キャンプ)",
    title_ja: "五島コンカナ王国 ワイナリー&リゾート",
    romaji: "Goto Conkana Kingdom",
    summary_zh: "**五島コンカナ王国は五島市の総合リゾート**。コテージ 35 棟 + 温泉 + ワイナリー + キャンプ場 + テニス + ビーチアクセス を擁する、家族 + グループ向けの 1 日完結型リゾート。下五島の自然+ アウトドアを楽しむ拠点として人気。",
    content_md: "- 立地:五島市籠淵町(下五島・福江島東部)\n- 構成:コテージ 35 棟 + 温泉 + ワイナリー + キャンプ場 + テニス\n- ワイナリー:五島ワイン製造(島産ぶどう)\n- 客層:家族 + グループ\n- 価格帯:1 棟 2 食付 ¥40000-80000(最大 6 名)\n- アクセス:福江空港 + 福江港 から車 25 分",
    region: "kyushu",
    prefecture_ja: "長崎県",
    gun_ja: null,
    municipality_ja: "五島市",
    lg_code: "42211",
    area_types: ["luxury_resort", "rural_townscape"],
    lat: 32.692,
    lon: 128.882,
    season_start: null,
    season_end: null,
    event_start: null,
    event_end: null,
    price_tier: 4,
    booking_window_days: 60,
    closed_days: [],
    external_urls: { official: "https://www.conkana.jp/" },
    tags: ["nagasaki_island_lodging", "conkana", "fukue", "winery_resort"],
    source: "manual",
  },
  {
    slug: "shinkamigoto-pension-zone",
    category: "lodging",
    sub_type: "rural_minshuku",
    title_zh: "新上五島町ペンション + 民宿群(上五島・教会群アクセス・小規模家族経営)",
    title_ja: "新上五島町 ペンション + 民宿エリア",
    romaji: "Shinkamigoto Pension Zone",
    summary_zh: "**新上五島町は上五島の民宿エリア**(南松浦郡)。世界遺産「長崎と天草地方の潜伏キリシタン関連遺産」(2018 登録)構成資産の頭ヶ島天主堂 + 旧野首教会 等の教会群アクセス起点、約 30 軒の家族経営民宿 + ペンション。観光客より巡礼者中心、五島うどん発祥地の食材も体験可能。",
    content_md: "- エリア:南松浦郡新上五島町(中通島・若松島 等)\n- 民宿数:約 30 軒(家族経営)\n- 価格帯:1 泊 2 食 ¥8000-15000/人(民宿水準)\n- 観光圏:頭ヶ島天主堂(世界遺産・徒歩 + 車)・旧野首教会・大曽教会・青砂ヶ浦天主堂\n- 食事:五島魚介 + 五島うどん地獄炊き + あご出汁\n- 主民宿:民宿 山口屋・五島民宿 すずらん・上五島民宿 ぶし 等\n- アクセス:有川港 or 奈良尾港(博多+長崎 からフェリー)",
    region: "kyushu",
    prefecture_ja: "長崎県",
    gun_ja: "南松浦郡",
    municipality_ja: "新上五島町",
    lg_code: "42411",
    area_types: ["fishing_port", "rural_townscape"],
    lat: 32.961,
    lon: 129.078,
    season_start: null,
    season_end: null,
    event_start: null,
    event_end: null,
    price_tier: 2,
    booking_window_days: 60,
    closed_days: [],
    external_urls: {},
    tags: ["rural_minshuku", "shinkamigoto", "world_heritage_2018", "kirishitan_pilgrim"],
    source: "manual",
  },

  // ════════════════════════════════════════════════════════════════════
  // Phase G — 壱岐 2 筆
  // ════════════════════════════════════════════════════════════════════
  {
    slug: "iki-retreat-kairi-2016",
    category: "lodging",
    sub_type: "nagasaki_island_lodging",
    title_zh: "壱岐リトリート海里村上(2016 開業・全国級高級宿・海眺絶景・全室海+源泉)",
    title_ja: "壱岐リトリート 海里村上",
    romaji: "Iki Retreat Kairi Murakami",
    summary_zh: "**壱岐リトリート海里村上は壱岐島の全国級高級宿**(2016 開業)。海眺絶景立地・客室 17 室・全室源泉掛け流し露天風呂付の上級設定。一の宮温泉郷の代表、海里村上家(壱岐の老舗料亭)が現代的にリブランド。Relais & Chateaux 級の評価で、東京 + 海外からの飛行客が増加。",
    content_md: "- 開業:2016 年(平成28)壱岐\n- 当主:村上家(壱岐老舗料亭の現代化)\n- 立地:壱岐市勝本町(海岸絶景)\n- 客室:17 室・全室源泉掛け流し露天風呂付\n- 風呂:客室付露天 + 共用大浴場(海眺)\n- 食事:壱岐魚介(ふぐ・あんこう)+ 麦焼酎ペアリング\n- 価格帯:1 泊 2 食 ¥45000-100000/人\n- アクセス:壱岐空港 + 郷ノ浦港(博多港から フェリー 1.5 時間)",
    region: "kyushu",
    prefecture_ja: "長崎県",
    gun_ja: null,
    municipality_ja: "壱岐市",
    lg_code: "42210",
    area_types: ["luxury_resort", "fishing_port"],
    lat: 33.842,
    lon: 129.715,
    season_start: null,
    season_end: null,
    event_start: null,
    event_end: null,
    price_tier: 5,
    booking_window_days: 90,
    closed_days: [],
    external_urls: { official: "https://kairi-murakami.com/" },
    tags: ["nagasaki_island_lodging", "iki_retreat_kairi", "2016", "luxury_island"],
    source: "manual",
  },
  {
    slug: "iki-hirayama-ryokan",
    category: "lodging",
    sub_type: "nagasaki_island_lodging",
    title_zh: "平山旅館(壱岐温泉・湯本温泉・1700s 創業老舗・海眺)",
    title_ja: "平山旅館",
    romaji: "Hirayama Ryokan",
    summary_zh: "**平山旅館は壱岐湯本温泉の老舗**(1700s 創業・正確な年不明)。壱岐唯一の温泉郷「湯本温泉」(古代から知られる海辺温泉)で 300 年余の家業継承。客室 30 室、家族経営の温泉旅館で、海里村上(現代高級)とは異なる「伝統的離島宿」を体験。",
    content_md: "- 創業:1700s 壱岐(正確な年不明)\n- 立地:壱岐市勝本町湯本(壱岐唯一の湯本温泉郷)\n- 客室:約 30 室\n- 風呂:湯本温泉自家源泉 + 露天\n- 食事:壱岐魚介会席\n- 価格帯:1 泊 2 食 ¥15000-28000/人\n- アクセス:郷ノ浦港 から車 25 分",
    region: "kyushu",
    prefecture_ja: "長崎県",
    gun_ja: null,
    municipality_ja: "壱岐市",
    lg_code: "42210",
    area_types: ["onsen_town", "fishing_port"],
    lat: 33.842,
    lon: 129.715,
    season_start: null,
    season_end: null,
    event_start: null,
    event_end: null,
    price_tier: 3,
    booking_window_days: 30,
    closed_days: [],
    external_urls: {},
    tags: ["nagasaki_island_lodging", "hirayama", "iki_yumoto", "1700s"],
    source: "manual",
  },

  // ════════════════════════════════════════════════════════════════════
  // Phase H — 対馬 2 筆
  // ════════════════════════════════════════════════════════════════════
  {
    slug: "tsushima-grand-hotel",
    category: "lodging",
    sub_type: "nagasaki_island_lodging",
    title_zh: "対馬グランドホテル(厳原・対馬最大・国境離島観光ハブ)",
    title_ja: "対馬グランドホテル",
    romaji: "Tsushima Grand Hotel",
    summary_zh: "**対馬グランドホテルは対馬最大級ホテル**(厳原町)。対馬市の中心地厳原の港湾隣接、対馬観光のハブ。客室 80 室、対馬魚介(とらふぐ・ぶり・あんこう)+ 朝鮮通信使中継地の歴史を反映する韓国食 + 和食。",
    content_md: "- 立地:対馬市厳原町(厳原港 徒歩 5 分)\n- 客室:約 80 室\n- 食事:対馬魚介(とらふぐ + あんこう + ぶり)+ 韓国食 + 和食\n- 客層:観光客 + ビジネス客 + 韓国観光客\n- 価格帯:1 泊朝食付 ¥10000-22000/人\n- アクセス:対馬空港(JTA・大阪伊丹 + 福岡)+ 厳原港(博多港から フェリー 5 時間)",
    region: "kyushu",
    prefecture_ja: "長崎県",
    gun_ja: null,
    municipality_ja: "対馬市",
    lg_code: "42209",
    area_types: ["urban_central", "fishing_port"],
    lat: 34.198,
    lon: 129.291,
    season_start: null,
    season_end: null,
    event_start: null,
    event_end: null,
    price_tier: 3,
    booking_window_days: 30,
    closed_days: [],
    external_urls: {},
    tags: ["nagasaki_island_lodging", "tsushima_grand", "izuhara", "border_island"],
    source: "manual",
  },
  {
    slug: "tsushima-ryokan-onsen-area",
    category: "lodging",
    sub_type: "rural_minshuku",
    title_zh: "対馬厳原町 旅館 + 民宿エリア(対馬中心地・国境離島の小規模宿群)",
    title_ja: "対馬厳原町 旅館 + 民宿エリア",
    romaji: "Tsushima Izuhara Ryokan Zone",
    summary_zh: "**対馬厳原町は対馬市の中心地**(対馬市役所所在)。対馬グランドホテル(80 室大型)以外に、約 20 軒の家族経営旅館 + 民宿が厳原町内に点在。価格 ¥8000-15000 の手の届く価格で、対馬魚介 + 国境離島の素朴な雰囲気を体験可能。",
    content_md: "- エリア:対馬市厳原町(対馬市の中心)\n- 旅館・民宿数:約 20 軒\n- 価格帯:1 泊 2 食 ¥8000-15000/人(民宿水準)\n- 食事:対馬魚介(とらふぐ + あんこう・季節)\n- 主要宿:民宿 たかみ・対馬厳原温泉旅館・対馬民宿 ふじや 等\n- アクセス:厳原港 徒歩 5-15 分(各宿)",
    region: "kyushu",
    prefecture_ja: "長崎県",
    gun_ja: null,
    municipality_ja: "対馬市",
    lg_code: "42209",
    area_types: ["urban_central", "fishing_port"],
    lat: 34.198,
    lon: 129.291,
    season_start: null,
    season_end: null,
    event_start: null,
    event_end: null,
    price_tier: 2,
    booking_window_days: 30,
    closed_days: [],
    external_urls: {},
    tags: ["rural_minshuku", "tsushima_izuhara", "border_island_minshuku"],
    source: "manual",
  },

  // ════════════════════════════════════════════════════════════════════
  // Phase I — 島原 2 筆
  // ════════════════════════════════════════════════════════════════════
  {
    slug: "shimabara-nampuro",
    category: "lodging",
    sub_type: "onsen_ryokan",
    title_zh: "島原温泉ホテル南風楼(島原観光中心・有明海絶景・島原温泉自家源泉)",
    title_ja: "ホテル南風楼(なんぷうろう)",
    romaji: "Hotel Nampuro",
    summary_zh: "**ホテル南風楼は島原温泉の代表ホテル**。島原市の有明海沿いの大型温泉ホテル、客室 110 室・全室海眺・島原温泉自家源泉。展望大浴場 + 露天風呂 + 屋外プール(夏季)で家族 + グループ向けリゾート機能。",
    content_md: "- 立地:島原市弁天町(有明海沿い)\n- 客室:約 110 室・全室海眺\n- 風呂:島原温泉自家源泉 + 展望大浴場 + 露天\n- 食事:有明海魚介(穴子・蛤)+ 島原素麺会席\n- プール:夏季屋外プール\n- 価格帯:1 泊 2 食 ¥15000-32000/人\n- アクセス:島原鉄道 島原駅 から車 5 分",
    region: "kyushu",
    prefecture_ja: "長崎県",
    gun_ja: null,
    municipality_ja: "島原市",
    lg_code: "42203",
    area_types: ["onsen_town", "fishing_port"],
    lat: 32.787,
    lon: 130.366,
    season_start: null,
    season_end: null,
    event_start: null,
    event_end: null,
    price_tier: 3,
    booking_window_days: 30,
    closed_days: [],
    external_urls: { official: "https://www.nampuro.com/" },
    tags: ["onsen_ryokan", "nampuro", "shimabara"],
    source: "manual",
  },
  {
    slug: "shimabara-onsen-overview",
    category: "lodging",
    sub_type: "onsen_ryokan",
    title_zh: "島原温泉郷概論(島原市内 5+ 軒・有明海沿い・湧水都市と組合せ)",
    title_ja: "島原温泉郷",
    romaji: "Shimabara Onsen",
    summary_zh: "**島原温泉郷は島原市の温泉ホテル群**。有明海沿いの 5+ 軒の温泉ホテル(南風楼・島原温泉湯之本観光ホテル・指月荘 等)+ 湧水都市島原(名水百選)+ 島原城 + 寒晒し甘味の組合せ観光。雲仙温泉(山間)と異なる「海岸+湧水」温泉郷。",
    content_md: "- 立地:島原市内(有明海沿い+ 城下町)\n- ホテル数:5+ 軒(南風楼・湯之本観光・指月荘・島原温泉観光ホテル 等)\n- 観光圏:島原城 + 武家屋敷 + 湧水通り(名水百選)+ 寒晒し店\n- 雲仙温泉との対比:雲仙=山間+クラシック / 島原=海岸+城下町\n- 価格帯:1 泊 2 食 ¥12000-32000/人(ホテル別)\n- アクセス:島原鉄道 島原駅 + 諫早駅 から バス",
    region: "kyushu",
    prefecture_ja: "長崎県",
    gun_ja: null,
    municipality_ja: "島原市",
    lg_code: "42203",
    area_types: ["onsen_town", "urban_central"],
    lat: 32.787,
    lon: 130.366,
    season_start: null,
    season_end: null,
    event_start: null,
    event_end: null,
    price_tier: 3,
    booking_window_days: 30,
    closed_days: [],
    external_urls: {},
    tags: ["onsen_ryokan", "shimabara_onsen", "ariake_kai", "yusui_100"],
    source: "manual",
  },
];

async function main() {
  if (rows.length === 0) {
    console.log("[nagasaki-lodging] 尚無條目");
    return;
  }
  console.log(`[nagasaki-lodging] ${rows.length} 筆 ${DRY ? "(dry-run)" : ""}`);
  if (DRY) {
    const bySub = new Map<string, number>();
    for (const r of rows) bySub.set(r.sub_type, (bySub.get(r.sub_type) ?? 0) + 1);
    for (const [k, v] of [...bySub.entries()].sort()) {
      console.log(`  ${k.padEnd(28)} ${v}`);
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
      console.error("[nagasaki-lodging] upsert failed:", error);
      process.exit(1);
    }
    written += batch.length;
    process.stdout.write(`\r[nagasaki-lodging] upsert: ${written}/${rows.length}`);
  }
  process.stdout.write("\n");
  console.log(`[nagasaki-lodging] Done — ${written} rows.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

// Seed 静岡県 R7 補完(12 筆 / Sprint 28.x)
//
// 食 +3 / 住 +2 / 衣 +2 / 育 +3 / 楽 +1 / 行 +1 = 12
//
// 食:焼津まぐろ港・清水寿司・浜松餃子(全国 1 位)
// 住:今井浜温泉・修善寺新井近接
// 衣:由比港さくらえび土産・三島駅前商店街
// 育:来宮神社大楠 2000 年・伊豆半島ジオパーク 2018・久能山東照宮 1617(国宝)
// 楽:城ヶ崎海岸(国指定名勝)
// 行:伊豆東海バス

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
  prefecture_ja: "静岡県";
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
  // 食 R7 (3)
  // ════════════════════════════════════════════════════════════════════
  {
    slug: "yaizu-maguro-port-overview",
    category: "food",
    sub_type: "local_specialty",
    title_zh: "焼津港まぐろ(全国 1 位 鰹+ まぐろ水揚港・1949 開港・水揚高 600 億円・市場見学+ 食堂)",
    title_ja: "焼津港まぐろ",
    romaji: "Yaizu Maguro",
    summary_zh: "**焼津港は全国 1 位の鰹+ まぐろ水揚港**(焼津市・1949 開港)。水揚高 600 億円規模、**冷凍まぐろ全国 1 位+ 鰹節原料 全国シェア 60%**。さかなセンター(2003 開設)+ 焼津港まぐろ館で市場直営食堂+ 直販・新鮮まぐろ料理が観光客に人気、清水(R1 既出)と並ぶ静岡の魚港。",
    content_md: "- 開港:1949 年(昭和 24)\n- 水揚:全国 1 位 鰹+ まぐろ(水揚高 600 億円)\n- 鰹節原料:全国シェア 60%\n- さかなセンター:2003 開設・市場+ 食堂\n- まぐろ館:港隣・直営食堂+ 直販\n- 価格目安:まぐろ丼 ¥1500-3000・食堂セット ¥2000-3500\n- 営業:9:00-17:00(火曜定休)\n- アクセス:JR 焼津駅 徒歩 15 分(車 5 分)",
    region: "chubu",
    prefecture_ja: "静岡県",
    gun_ja: null,
    municipality_ja: "焼津市",
    lg_code: "22212",
    area_types: ["restaurant_traditional", "fishing_port"],
    lat: 34.8650,
    lon: 138.3289,
    season_start: null,
    season_end: null,
    event_start: null,
    event_end: null,
    price_tier: 2,
    booking_window_days: null,
    closed_days: ["tue"],
    external_urls: { official: "https://www.yaizu.gr.jp/" },
    tags: ["local_specialty", "yaizu_maguro", "1949_port", "national_top_tuna", "katsuobushi_60"],
    source: "manual",
  },
  {
    slug: "shimizu-sushi-overview",
    category: "food",
    sub_type: "local_specialty",
    title_zh: "清水寿司(駿河湾魚介・特に冷凍まぐろ寿司・清水港のまぐろ大水揚地+ 寿司激戦区)",
    title_ja: "清水寿司",
    romaji: "Shimizu Sushi",
    summary_zh: "**清水寿司は冷凍まぐろ寿司の聖地**(静岡市清水区)。**清水港は冷凍まぐろ国内 1 位水揚地**(R1 河岸の市)、駿河湾魚介+ 黒潮+ 寒流の好漁場で寿司ネタが豊富。清水駅周辺+ 河岸の市内に寿司激戦区、まぐろの大トロ・中トロ握り中心の本格江戸前+ 静岡独自スタイル。",
    content_md: "- 立地:静岡市清水区(清水駅周辺+ 河岸の市)\n- 特徴:冷凍まぐろ国内 1 位水揚港の本場寿司\n- ネタ:大トロ・中トロ・赤身+ 駿河湾地魚\n- 価格目安:にぎり寿司 1 貫 ¥200-1200・コース ¥3500-8000\n- 主要集積:清水駅 から 徒歩圏+ 河岸の市内\n- 営業:店舗による(11:00-21:00 が標準)\n- 隣接:清水港+ 河岸の市(R1 既出)\n- アクセス:JR 清水駅 徒歩 5-15 分",
    region: "chubu",
    prefecture_ja: "静岡県",
    gun_ja: null,
    municipality_ja: "静岡市",
    lg_code: "22100",
    area_types: ["restaurant_traditional"],
    lat: 35.0167,
    lon: 138.4889,
    season_start: null,
    season_end: null,
    event_start: null,
    event_end: null,
    price_tier: 3,
    booking_window_days: 7,
    closed_days: [],
    external_urls: {},
    tags: ["local_specialty", "shimizu_sushi", "frozen_tuna_top", "edo_mae", "kashi_no_ichi"],
    source: "manual",
  },
  {
    slug: "hamamatsu-gyoza-overview",
    category: "food",
    sub_type: "local_specialty",
    title_zh: "浜松餃子(全国 1 位消費都市・宇都宮と毎年争う・1950s ヤマト製餃子起源・もやし添え)",
    title_ja: "浜松餃子",
    romaji: "Hamamatsu Gyoza",
    summary_zh: "**浜松餃子は全国 1 位消費都市の郷土食**(浜松市)。1950s 戦後ヤマト製餃子(現:石松)起源、宇都宮と毎年「全国餃子購入額 1 位」を争う。**もやし添え+ 円形に並べた焼き餃子**が独特、市内に浜松餃子専門店 300+ 軒。観光客は **石松+ むつぎく+ 福みつ** 等の老舗で食べ比べが定番。",
    content_md: "- 産地:浜松市(全国 1 位餃子消費都市)\n- 起源:1950s 戦後ヤマト製餃子(現:石松)\n- 特徴:もやし添え+ 円形焼き+ あっさり豚肉餡\n- 専門店数:市内 300+ 軒\n- 主要老舗:石松(1953)+ むつぎく+ 福みつ\n- 価格目安:餃子 1 人前 ¥600-1000\n- 営業:店舗による(11:00-22:00 が標準)\n- アクセス:JR 浜松駅 徒歩 5-15 分(複数店)",
    region: "chubu",
    prefecture_ja: "静岡県",
    gun_ja: null,
    municipality_ja: "浜松市",
    lg_code: "22130",
    area_types: ["restaurant_chinese"],
    lat: 34.7036,
    lon: 137.7339,
    season_start: null,
    season_end: null,
    event_start: null,
    event_end: null,
    price_tier: 1,
    booking_window_days: null,
    closed_days: [],
    external_urls: {},
    tags: ["local_specialty", "hamamatsu_gyoza", "national_top_consumption", "1950s_origin", "moyashi_circle"],
    source: "manual",
  },

  // ════════════════════════════════════════════════════════════════════
  // 住 R7 (2)
  // ════════════════════════════════════════════════════════════════════
  {
    slug: "imaihama-onsen-overview",
    category: "lodging",
    sub_type: "shizuoka_izu_classic",
    title_zh: "今井浜温泉(伊豆東海岸・河津町・1933 発見・透明度高い海+ 温泉湯+ 太平洋眺望)",
    title_ja: "今井浜温泉",
    romaji: "Imaihama Onsen",
    summary_zh: "**今井浜温泉は伊豆東海岸の海岸温泉地**(賀茂郡河津町・1933 発見)。今井浜駅 徒歩 1 分の好アクセス、**透明度高い今井浜海岸+ 太平洋眺望+ 海岸温泉湯** の三拍子。河津桜(R1 既出 kawazu-zakura-matsuri)+ 河津七滝(R1 既出 kawazu-nanadaru-7falls)併せた 2 月-3 月の伊豆観光のベース宿エリア。",
    content_md: "- 発見:1933 年(昭和 8)\n- 立地:賀茂郡河津町(伊豆東海岸)\n- 規模:中規模温泉地・10+ 軒の旅館\n- 特徴:海岸温泉+ 太平洋眺望+ 透明度高い今井浜海岸\n- 主要温泉宿:今井荘+ 福寿園+ 蓮華\n- 料金目安:¥15000-25000/泊(2 食付・標準クラス)\n- 隣接:河津桜並木(2 月)+ 河津七滝(車 15 分)\n- アクセス:伊豆急今井浜海岸駅 徒歩 1 分",
    region: "chubu",
    prefecture_ja: "静岡県",
    gun_ja: "賀茂郡",
    municipality_ja: "河津町",
    lg_code: "22305",
    area_types: ["onsen_field", "coast_seaside"],
    lat: 34.7506,
    lon: 138.9853,
    season_start: null,
    season_end: null,
    event_start: null,
    event_end: null,
    price_tier: 3,
    booking_window_days: 14,
    closed_days: [],
    external_urls: {},
    tags: ["shizuoka_izu_classic", "imaihama_onsen", "1933", "izukyu_station_1min", "kawazu_zakura_base"],
    source: "manual",
  },
  {
    slug: "izunokuni-bay-resort-2010s",
    category: "lodging",
    sub_type: "shizuoka_fuji_resort",
    title_zh: "伊豆の国市バイプロード温泉宿群(2010s 整備・修善寺隣接・狩野川沿い・モダン宿群)",
    title_ja: "伊豆の国市 温泉宿",
    romaji: "Izunokuni Bay Resort",
    summary_zh: "**伊豆の国市は修善寺(R1 既出)隣接の現代温泉地**(伊豆の国市・2010s 整備)。狩野川沿岸+ 韮山反射炉(R1 育)+ 江川邸(R1 育)観光と一体の宿泊エリア、現代モダン温泉宿が増加。修善寺の老舗とは異なるカジュアル+ 中規模価格帯で家族連れ+ ビジネス利用に人気。",
    content_md: "- 整備:2010 年代(現代温泉地)\n- 立地:伊豆の国市(修善寺隣接・狩野川沿岸)\n- 主要宿:伊豆長岡温泉+ 中島湯本+ 別所温泉\n- 料金目安:¥12000-20000/泊(2 食付・カジュアル)\n- 隣接観光:韮山反射炉(R1 育)+ 江川邸(R1 育)+ 修善寺(車 10 分)\n- アクセス:伊豆箱根鉄道 伊豆長岡駅 徒歩 5-10 分",
    region: "chubu",
    prefecture_ja: "静岡県",
    gun_ja: null,
    municipality_ja: "伊豆の国市",
    lg_code: "22225",
    area_types: ["onsen_field"],
    lat: 35.0289,
    lon: 138.9358,
    season_start: null,
    season_end: null,
    event_start: null,
    event_end: null,
    price_tier: 3,
    booking_window_days: 14,
    closed_days: [],
    external_urls: {},
    tags: ["shizuoka_fuji_resort", "izunokuni_2010s", "modern_onsen", "kano_river", "shuzenji_adjacent"],
    source: "manual",
  },

  // ════════════════════════════════════════════════════════════════════
  // 衣 R7 (2)
  // ════════════════════════════════════════════════════════════════════
  {
    slug: "yui-port-sakuraebi-souvenir",
    category: "fashion",
    sub_type: "shopping_district_local",
    title_zh: "由比港 さくらえび土産(国内唯一の桜えび漁港・春秋漁期の生+ 干し+ かき揚げ加工)",
    title_ja: "由比港 さくらえび土産",
    romaji: "Yui Sakura Ebi Souvenir",
    summary_zh: "**由比港は国内唯一の桜えび漁港**(静岡市清水区由比町)。**春漁(3-6 月)+ 秋漁(10-12 月)の年 2 シーズン**(R1 既出 yui-sakura-ebi-port)、漁港隣に **生さくらえび+ 干し+ かき揚げ加工品** の土産店集積。お土産+ 観光客向け。",
    content_md: "- 立地:静岡市清水区由比港町(国内唯一の桜えび漁港)\n- 漁期:春漁 3-6 月+ 秋漁 10-12 月\n- 主要商品:生桜えび(冷凍)+ 干し桜えび+ かき揚げ+ 桜えびせんべい\n- 価格目安:1 袋 ¥800-2500\n- 主要販売:由比港 産直+ 道の駅 由比+ 沿道土産店\n- 営業:9:00-17:00(店舗による)\n- 隣接:由比宿(東海道広重)+ 蒲原港(R1 既出 kambara-sakura-ebi-port)\n- アクセス:JR 東海道本線 由比駅 徒歩 10 分",
    region: "chubu",
    prefecture_ja: "静岡県",
    gun_ja: null,
    municipality_ja: "静岡市",
    lg_code: "22100",
    area_types: ["shopping_district_local", "fishing_port"],
    lat: 35.1006,
    lon: 138.5639,
    season_start: null,
    season_end: null,
    event_start: null,
    event_end: null,
    price_tier: 2,
    booking_window_days: null,
    closed_days: [],
    external_urls: {},
    tags: ["shopping_district_local", "yui_port", "national_only_sakura_ebi", "spring_autumn", "souvenir"],
    source: "manual",
  },
  {
    slug: "mishima-station-shotengai",
    category: "fashion",
    sub_type: "shopping_district_local",
    title_zh: "三島駅前商店街+ 三島スカイウォーク経由 BUS terminal(2015 観光商業化・お土産+ 軽食)",
    title_ja: "三島駅前商店街",
    romaji: "Mishima Station Shotengai",
    summary_zh: "**三島駅前商店街は新幹線駅前の観光商業エリア**(三島市)。R1 既出 mishima-skywalk-2015 + mishima-rakujuen-1890 + mishima-taisha-ichinomiya 観光客の起点 hub、地元食品+ お土産+ 軽食店が集積。三島スカイウォーク行 BUS terminal も併設、新幹線+ 観光連絡の便利エリア。",
    content_md: "- 立地:三島市(JR 三島駅前)\n- 主要構成:お土産店+ 軽食+ コンビニ+ BUS terminal\n- 三島スカイウォーク行 BUS:駅前発(¥500・15 分)\n- 隣接観光:三嶋大社(徒歩 15 分)+ 楽寿園(徒歩 5 分)\n- 営業:9:00-21:00(店舗による)\n- アクセス:JR 三島駅 徒歩 1 分",
    region: "chubu",
    prefecture_ja: "静岡県",
    gun_ja: null,
    municipality_ja: "三島市",
    lg_code: "22206",
    area_types: ["shopping_district_local", "transit_hub"],
    lat: 35.1267,
    lon: 138.9100,
    season_start: null,
    season_end: null,
    event_start: null,
    event_end: null,
    price_tier: 1,
    booking_window_days: null,
    closed_days: [],
    external_urls: {},
    tags: ["shopping_district_local", "mishima_station", "skywalk_bus_terminal", "tourist_hub"],
    source: "manual",
  },

  // ════════════════════════════════════════════════════════════════════
  // 育 R7 (3)
  // ════════════════════════════════════════════════════════════════════
  {
    slug: "atami-kinomiya-jinja",
    category: "culture",
    sub_type: "temple_shrine",
    title_zh: "来宮神社(熱海市・710 創建・大楠樹齢 2100 年+ 国指定天然記念物・熱海温泉守護神)",
    title_ja: "来宮神社",
    romaji: "Kinomiya Jinja",
    summary_zh: "**来宮神社は熱海温泉守護神**(熱海市西山町・710 創建)。**境内の大楠は樹齢 2100 年+ 幹周 24 m の国指定天然記念物**、全国 6 番目の巨樹。「大楠を 1 周すると寿命が 1 年延びる」伝承で観光客に人気、近年 SNS 映え+ パワースポット観光地として急上昇。熱海温泉観光の必訪。",
    content_md: "- 創建:710 年(和銅 3)\n- 立地:熱海市西山町\n- 大楠:樹齢 2100 年+ 幹周 24 m(国指定天然記念物)\n- 全国巨樹ランキング:第 6 位(全国)\n- 伝承:大楠を 1 周すると寿命 1 年延びる\n- 主祭神:大己貴命+ 五十猛命\n- 入場:無料(常時)\n- カフェ「茶寮 鈴木屋」併設\n- 隣接:熱海温泉 から 車 5 分(熱海駅 徒歩 20 分)\n- アクセス:JR 来宮駅 徒歩 5 分",
    region: "chubu",
    prefecture_ja: "静岡県",
    gun_ja: null,
    municipality_ja: "熱海市",
    lg_code: "22205",
    area_types: ["shrine_temple"],
    lat: 35.1006,
    lon: 139.0594,
    season_start: null,
    season_end: null,
    event_start: null,
    event_end: null,
    price_tier: 1,
    booking_window_days: null,
    closed_days: [],
    external_urls: { official: "https://kinomiya.or.jp/" },
    tags: ["temple_shrine", "kinomiya_jinja", "710", "2100yr_camphor", "national_natural_monument"],
    source: "manual",
  },
  {
    slug: "izu-geopark-2018",
    category: "culture",
    sub_type: "history_site_castle",
    title_zh: "伊豆半島ジオパーク(2018 ユネスコ世界ジオパーク認定・15 市町・火山+ 海岸地形)",
    title_ja: "伊豆半島ユネスコ世界ジオパーク",
    romaji: "Izu Geopark",
    summary_zh: "**伊豆半島ジオパークは 2018 年ユネスコ世界ジオパーク認定**(伊豆半島 15 市町)。**1500 万年前の海底火山が陸化して伊豆半島形成** という地質史を体感できる地形+ 自然遺産、城ヶ崎海岸(R7 楽)+ 河津七滝(R1 既出)+ 三島スカイウォーク(R1 既出)等を含む包括認定。",
    content_md: "- 認定:2018 年 4 月(ユネスコ世界ジオパーク)\n- 範囲:伊豆半島 15 市町(熱海+ 伊東+ 下田+ 伊豆+ 河津+ 函南+ 沼津 等)\n- 地質史:1500 万年前 海底火山 → 100 万年前 陸化 → 伊豆半島形成\n- 主要 site:大室山+ 城ヶ崎海岸(R7 楽)+ 河津七滝(R1)+ 三島溶岩流+ 田牛サンドスキー\n- ガイダンス:ジオパークビジターセンター(各市)+ 各 spot 案内板\n- 入場:多くは無料\n- アクセス:伊豆各地(レンタカー推奨)",
    region: "chubu",
    prefecture_ja: "静岡県",
    gun_ja: null,
    municipality_ja: "伊豆市",
    lg_code: "22222",
    area_types: ["history_site_castle", "scenic_spot"],
    lat: 34.9750,
    lon: 138.9456,
    season_start: null,
    season_end: null,
    event_start: null,
    event_end: null,
    price_tier: 1,
    booking_window_days: null,
    closed_days: [],
    external_urls: { official: "https://izugeopark.org/" },
    tags: ["history_site_castle", "izu_geopark", "unesco_2018", "15_municipalities", "submarine_volcano"],
    source: "manual",
  },
  {
    slug: "kunouzan-toshogu-1617",
    category: "culture",
    sub_type: "shizuoka_tokugawa",
    title_zh: "久能山東照宮(国宝 1617 創建・徳川家康初葬地・国宝本殿+ 楼門+ 17 棟・標高 270m)",
    title_ja: "久能山東照宮",
    romaji: "Kunouzan Toshogu",
    summary_zh: "**久能山東照宮は徳川家康の初葬地**(静岡市駿河区根古屋・1617 創建)。家康(1542-1616)が亡くなった翌年に造営、**本殿+ 石の間+ 拝殿は国宝指定 2010**。標高 270 m の山頂に鎮座、家康公遺品+ 江戸期献納品の宝物殿併設。日光東照宮(1636 移葬)に対し、こちらは初葬地として徳川家康ゆかりの最重要地。",
    content_md: "- 創建:1617 年(元和 3)\n- 国宝指定:本殿+ 石の間+ 拝殿(2010 年)\n- 標高:270 m(久能山頂)\n- 史的意義:徳川家康初葬地(1616 没・1617 造営・1636 日光移葬)\n- 構造:17 棟+ 楼門+ 五重塔跡\n- 宝物殿:家康公遺品+ 江戸期献納品\n- 入場料:¥800(博物館込)\n- 営業:9:00-17:00(年中無休)\n- アクセス手段:日本平ロープウェイ(¥1100 往復・5 分)+ 久能山下 1159 段石段(徒歩 1 時間)\n- アクセス:JR 静岡駅 から バス 50 分・日本平下車",
    region: "chubu",
    prefecture_ja: "静岡県",
    gun_ja: null,
    municipality_ja: "静岡市",
    lg_code: "22100",
    area_types: ["shrine_temple", "history_site_castle"],
    lat: 34.9706,
    lon: 138.4406,
    season_start: null,
    season_end: null,
    event_start: null,
    event_end: null,
    price_tier: 1,
    booking_window_days: null,
    closed_days: [],
    external_urls: { official: "https://www.toshogu.or.jp/" },
    tags: ["shizuoka_tokugawa", "kunouzan_toshogu", "1617", "national_treasure_2010", "ieyasu_first_burial"],
    source: "manual",
  },

  // ════════════════════════════════════════════════════════════════════
  // 楽 R7 (1)
  // ════════════════════════════════════════════════════════════════════
  {
    slug: "izu-jogasaki-coast",
    category: "entertainment",
    sub_type: "shizuoka_nature_spot",
    title_zh: "城ヶ崎海岸(伊東市・国指定名勝・4000 年前火山溶岩流+ 吊り橋+ 海蝕台地・ジオパーク)",
    title_ja: "城ヶ崎海岸",
    romaji: "Jogasaki Coast",
    summary_zh: "**城ヶ崎海岸は伊豆東海岸の絶景海岸+ 国指定名勝**(伊東市・国指定名勝 1962)。**4000 年前大室山噴火の溶岩流+ 海蝕で形成された 9 km の絶壁海岸**、門脇吊り橋(全長 48 m × 高さ 23 m)+ 海蝕台地のスリル+ ピクニック+ ハイキング体験。伊豆ジオパーク(R7 育)主要 site。",
    content_md: "- 立地:伊東市(伊豆半島東岸)\n- 認定:国指定名勝(1962)+ 伊豆ジオパーク主要 site\n- 形成:4000 年前 大室山噴火の溶岩流+ 海蝕\n- 全長:9 km(海岸沿い遊歩道)\n- 主要施設:門脇吊り橋(全長 48 m × 高さ 23 m・無料)+ 門脇灯台(¥100)\n- 入場:無料(灯台のみ ¥100)\n- 営業:常時(灯台 9:00-16:30)\n- アクセス手段:JR 伊東駅 から バス 30 分・城ヶ崎口下車",
    region: "chubu",
    prefecture_ja: "静岡県",
    gun_ja: null,
    municipality_ja: "伊東市",
    lg_code: "22208",
    area_types: ["scenic_spot", "coast_seaside"],
    lat: 34.9089,
    lon: 139.1394,
    season_start: null,
    season_end: null,
    event_start: null,
    event_end: null,
    price_tier: 1,
    booking_window_days: null,
    closed_days: [],
    external_urls: {},
    tags: ["shizuoka_nature_spot", "jogasaki_coast", "1962_meishou", "4000yr_lava", "kadowaki_bridge"],
    source: "manual",
  },

  // ════════════════════════════════════════════════════════════════════
  // 行 R7 (1)
  // ════════════════════════════════════════════════════════════════════
  {
    slug: "tokai-bus-izu-overview",
    category: "transport",
    sub_type: "shizuoka_izu_access",
    title_zh: "東海バス伊豆観光網(伊豆半島巡回・主要観光地+ 温泉地連絡・1 日券 ¥1500・伊豆観光必須)",
    title_ja: "東海バス伊豆",
    romaji: "Tokai Bus Izu",
    summary_zh: "**東海バスは伊豆半島観光のメインバス会社**(東海自動車・全社網)。**1 日券「伊豆フリーパス」¥1500** で熱海+ 伊東+ 下田+ 修善寺+ 河津 等の主要観光地を巡回、レンタカー以外の観光客の生命線。R1 既出 izukyu-line-1961(伊豆急行線・鉄道)に対し、バスは細かい温泉地+ 山間部アクセス対応。",
    content_md: "- 運営:東海自動車(株)\n- 主要 hub:熱海駅+ 伊東駅+ 下田駅+ 修善寺駅+ 河津駅\n- 1 日券「伊豆フリーパス」:¥1500\n- 観光連絡:熱海温泉+ 伊東温泉+ 下田開国跡+ 修善寺+ 河津桜+ 城ヶ崎海岸(R7 楽)\n- 路線数:50+ 路線\n- 1 日本数:1 路線あたり 4-15 便/日\n- 予約:不要(自由乗車・IC カード可)\n- 比較:伊豆急行線(鉄道)vs 東海バス(細かいアクセス)\n- アクセス:JR 熱海+ 伊東+ 下田+ 修善寺+ 河津 各駅",
    region: "chubu",
    prefecture_ja: "静岡県",
    gun_ja: null,
    municipality_ja: "伊豆市",
    lg_code: "22222",
    area_types: ["transit_hub"],
    lat: 34.9750,
    lon: 138.9456,
    season_start: null,
    season_end: null,
    event_start: null,
    event_end: null,
    price_tier: 1,
    booking_window_days: null,
    closed_days: [],
    external_urls: { official: "https://www.tokaibus.jp/" },
    tags: ["shizuoka_izu_access", "tokai_bus", "1500yen_pass", "50_routes", "izu_essential"],
    source: "manual",
  },
];

async function main() {
  if (rows.length === 0) {
    console.log("[shizuoka-r7] 尚無條目");
    return;
  }
  console.log(`[shizuoka-r7] ${rows.length} 筆 ${DRY ? "(dry-run)" : ""}`);
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
      console.error("[shizuoka-r7] upsert failed:", error);
      process.exit(1);
    }
    written += batch.length;
    process.stdout.write(`\r[shizuoka-r7] upsert: ${written}/${rows.length}`);
  }
  process.stdout.write("\n");
  console.log(`[shizuoka-r7] Done — ${written} rows.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

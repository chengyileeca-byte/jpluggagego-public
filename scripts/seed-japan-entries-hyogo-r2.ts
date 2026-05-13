// Seed 兵庫県 R2 補完(15 筆 / Sprint 27.x)
//
// 食 +4 / 住 +3 / 衣 +2 / 育 +3 / 楽 +1 / 行 +2 = 15
//
// 食:赤穂塩・丹波黒豆・姫路あなご・出石そば橘屋
// 住:城崎三木屋 1758・武田尾温泉・有馬夢花
// 衣:神戸真珠・神戸中華街土産
// 育:西宮戎神社・篠山城跡・赤穂歴史博物館
// 楽:尼崎運河
// 行:JR 播但線・JR 山陰本線兵庫区間

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
  // ════════════════════════════════════════════════════════════════════
  // 食 R2 (4)
  // ════════════════════════════════════════════════════════════════════
  {
    slug: "ako-shio-overview",
    category: "food",
    sub_type: "local_specialty",
    title_zh: "赤穂塩(1645 浅野氏入封後発展・全国産塩 5 大都・国指定塩・全国最古級製塩地)",
    title_ja: "赤穂塩",
    romaji: "Ako Shio",
    summary_zh: "**赤穂塩は全国 5 大製塩地の 1**(赤穂市・1645 浅野氏入封後発展)。瀬戸内の好塩田条件+ 良質海水で **国指定塩生産地**、現代も赤穂海塩+ 赤穂天塩等のブランド維持。R1 既出の赤穂義士+ 大石神社+ 赤穂城跡と並び、塩文化が赤穂のもう 1 つの顔。お土産+ 料理用 staple。",
    content_md: "- 産地:赤穂市(瀬戸内沿岸塩田)\n- 由来:1645 年浅野長直入封後の塩田開発\n- 全国 5 大製塩地:赤穂+ 三田尻(山口)+ 行徳(千葉)+ 加唐島(佐賀)+ 馬見塚(岡山)\n- 主要ブランド:赤穂海塩+ 赤穂天塩+ あら塩\n- 価格目安:50 g ¥300-1500\n- 販売:赤穂市内 道の駅+ 産直+ お土産店\n- 隣接観光:赤穂城跡+ 大石神社\n- アクセス:JR 赤穂線 播州赤穂駅 徒歩 / 車 5 分",
    region: "kansai",
    prefecture_ja: "兵庫県",
    gun_ja: null,
    municipality_ja: "赤穂市",
    lg_code: "28212",
    area_types: ["agriculture_orchard"],
    lat: 34.7531,
    lon: 134.3956,
    season_start: null,
    season_end: null,
    event_start: null,
    event_end: null,
    price_tier: 1,
    booking_window_days: null,
    closed_days: [],
    external_urls: {},
    tags: ["local_specialty", "ako_shio", "1645", "japan_5_top_salt", "ako_kaiгen"],
    source: "manual",
  },
  {
    slug: "tanba-kuromame-overview",
    category: "food",
    sub_type: "local_specialty",
    title_zh: "丹波篠山黒大豆(全国最高級ブランド・大粒甘味+ 高蛋白・お正月料理 staple)",
    title_ja: "丹波篠山黒大豆",
    romaji: "Tanba Sasayama Kuromame",
    summary_zh: "**丹波篠山黒大豆は全国最高級ブランド大豆**(篠山市・丹波市)。粒が大きく+ 甘味が濃く、お正月料理(煮豆)の最高級素材。**1 粒 8-10 円の高級品**、日本料理界+ 高級スーパーで確固たる地位。秋の収穫時期(11 月)に最盛期、丹波篠山+ 丹波市の道の駅+ 産直で購入可。",
    content_md: "- 産地:丹波篠山市+ 丹波市(全国最大級生産地)\n- 評価:全国最高級ブランド大豆\n- 特徴:粒大きく+ 甘味濃く+ 高蛋白\n- 旬:11 月(秋収穫)\n- 価格目安:1 kg ¥3000-8000(高級品)\n- 用途:お正月煮豆+ 料亭料理+ 黒豆茶+ 黒豆スイーツ\n- 販売:丹波篠山市内 道の駅+ 産直+ ネット\n- アクセス:JR 福知山線 篠山口駅 から バス 30 分・篠山下車",
    region: "kansai",
    prefecture_ja: "兵庫県",
    gun_ja: null,
    municipality_ja: "丹波篠山市",
    lg_code: "28221",
    area_types: ["agriculture_orchard"],
    lat: 35.0683,
    lon: 135.2200,
    season_start: "2026-11-01",
    season_end: "2026-12-31",
    event_start: null,
    event_end: null,
    price_tier: 3,
    booking_window_days: null,
    closed_days: [],
    external_urls: {},
    tags: ["local_specialty", "tanba_kuromame", "japan_top_brand", "november_harvest", "osechi_staple"],
    source: "manual",
  },
  {
    slug: "himeji-anago-overview",
    category: "food",
    sub_type: "local_specialty",
    title_zh: "姫路あなご(瀬戸内海産・5-9 月旬・あなご丼+ あなご茶漬け・姫路駅周辺老舗多数)",
    title_ja: "姫路あなご",
    romaji: "Himeji Anago",
    summary_zh: "**姫路あなごは瀬戸内海産の代表海産物**(姫路市・5-9 月旬)。瀬戸内海の好漁場で獲れる脂のよく乗ったあなご、姫路では **あなご丼+ あなご茶漬け+ あなご白焼き** が郷土料理。姫路駅周辺+ 姫路城下に老舗あなご料理店が集積、姫路観光の食ハイライト。1 杯 ¥2500-4000。",
    content_md: "- 産地:瀬戸内海(姫路港+ 飾磨港)\n- 旬:5-9 月\n- 食べ方:あなご丼+ あなご茶漬け+ 白焼き+ 蒲焼き\n- 価格目安:1 杯 ¥2500-4000\n- 主要店集積:姫路駅周辺+ 姫路城下\n- 隣接観光:姫路城\n- アクセス:JR 姫路駅 徒歩 5-15 分(複数店)",
    region: "kansai",
    prefecture_ja: "兵庫県",
    gun_ja: null,
    municipality_ja: "姫路市",
    lg_code: "28201",
    area_types: ["restaurant_traditional"],
    lat: 34.8331,
    lon: 134.6939,
    season_start: "2026-05-01",
    season_end: "2026-09-30",
    event_start: null,
    event_end: null,
    price_tier: 3,
    booking_window_days: null,
    closed_days: [],
    external_urls: {},
    tags: ["local_specialty", "himeji_anago", "seto_inland_sea", "may_sep", "anago_don"],
    source: "manual",
  },
  {
    slug: "izushi-soba-tachibanaya-1924",
    category: "food",
    sub_type: "local_specialty",
    title_zh: "出石そば 橘屋(1924 創業・出石そば 5 皿そば伝統・出石城下町・100 年老舗)",
    title_ja: "橘屋",
    romaji: "Tachibanaya",
    summary_zh: "**橘屋は出石そば老舗**(豊岡市出石町・1924 創業・100 年)。**出石そば**は江戸期信州そば伝来の在来そば、皿そば形式(小皿 5 枚 1 人前+ 薬味)で食べる独特の伝統。出石城下町に老舗多数、橘屋は中堅の代表店。1 人前 ¥1200-1800、出石観光の郷土食。",
    content_md: "- 創業:1924 年(大正 13)・100 年\n- 立地:豊岡市出石町(出石城下町)\n- 名物:皿そば(小皿 5 枚+ 薬味)¥1200-1800\n- 由来:江戸期信州そば伝来の在来そば\n- 営業:11:00-15:00 / 17:00-19:30(月曜定休)\n- 隣接:出石城跡+ 辰鼓楼(出石町中心)\n- アクセス:JR 山陰本線 豊岡駅 から バス 30 分・出石下車",
    region: "kansai",
    prefecture_ja: "兵庫県",
    gun_ja: null,
    municipality_ja: "豊岡市",
    lg_code: "28209",
    area_types: ["restaurant_traditional"],
    lat: 35.4583,
    lon: 134.8722,
    season_start: null,
    season_end: null,
    event_start: null,
    event_end: null,
    price_tier: 2,
    booking_window_days: null,
    closed_days: ["mon"],
    external_urls: {},
    tags: ["local_specialty", "tachibanaya", "1924", "izushi_soba", "100_years"],
    source: "manual",
  },

  // ════════════════════════════════════════════════════════════════════
  // 住 R2 (3)
  // ════════════════════════════════════════════════════════════════════
  {
    slug: "kinosaki-mikiya-1758",
    category: "lodging",
    sub_type: "onsen_ryokan",
    title_zh: "三木屋(城崎温泉・1758 創業・267 年・志賀直哉「城の崎にて」舞台・国登録有形文化財)",
    title_ja: "三木屋",
    romaji: "Mikiya",
    summary_zh: "**三木屋は城崎温泉の代表老舗旅館**(豊岡市城崎町・1758 創業・267 年)。**志賀直哉「城の崎にて」(1917)の舞台旅館** として国民的に有名、現存建物も国登録有形文化財。城崎温泉七湯巡り+ 文豪文化体験で観光客に人気、和室ベース 16 室の中規模、料金 ¥25000-45000(2 食付)。",
    content_md: "- 創業:1758 年(宝暦 8)・267 年\n- 立地:豊岡市城崎町湯島(城崎温泉中心部)\n- 文豪縁:志賀直哉「城の崎にて」(1917)の舞台\n- 国登録有形文化財:現存建物\n- 室数:16 室(和室ベース)\n- 温泉:城崎温泉(7 湯巡り無料)\n- 料金目安:¥25000-45000/泊(2 食付)\n- 隣接:城崎温泉駅(徒歩 5 分)+ 城崎温泉七湯\n- アクセス:JR 山陰本線 城崎温泉駅 徒歩 5 分",
    region: "kansai",
    prefecture_ja: "兵庫県",
    gun_ja: null,
    municipality_ja: "豊岡市",
    lg_code: "28209",
    area_types: ["onsen_field"],
    lat: 35.6228,
    lon: 134.8061,
    season_start: null,
    season_end: null,
    event_start: null,
    event_end: null,
    price_tier: 4,
    booking_window_days: 30,
    closed_days: [],
    external_urls: {},
    tags: ["onsen_ryokan", "mikiya", "1758", "267_years", "shiga_naoya"],
    source: "manual",
  },
  {
    slug: "takedao-onsen-1718",
    category: "lodging",
    sub_type: "onsen_ryokan",
    title_zh: "武田尾温泉(神戸近郊・1718 開湯・宝塚市山間・武庫川渓谷の秘境湯・1 軒宿)",
    title_ja: "武田尾温泉",
    romaji: "Takedao Onsen",
    summary_zh: "**武田尾温泉は神戸近郊の山間秘境温泉**(宝塚市・1718 開湯・300 年)。武庫川渓谷沿いの 1 軒宿の温泉地、神戸+ 大阪 から 車 1 時間の隠れ家。**JR 福知山線「武田尾駅」徒歩 5 分** の好アクセス、紅葉時期(11 月)+ 桜時期(4 月)が特に絶景の渓谷温泉。",
    content_md: "- 開湯:1718 年(享保 3)・300 年\n- 立地:宝塚市玉瀬(武庫川渓谷)\n- 規模:1 軒宿(マル宝湯)\n- 周辺:武庫川渓谷+ 武田尾廃線跡(ハイキングコース)\n- 紅葉:11 月\n- 桜:4 月\n- 料金目安:¥18000-30000/泊(2 食付)・日帰り入浴 ¥1000\n- アクセス:JR 福知山線 武田尾駅 徒歩 5 分(神戸 から 1 時間)",
    region: "kansai",
    prefecture_ja: "兵庫県",
    gun_ja: null,
    municipality_ja: "宝塚市",
    lg_code: "28214",
    area_types: ["onsen_field"],
    lat: 34.8889,
    lon: 135.2722,
    season_start: null,
    season_end: null,
    event_start: null,
    event_end: null,
    price_tier: 3,
    booking_window_days: 14,
    closed_days: [],
    external_urls: {},
    tags: ["onsen_ryokan", "takedao_onsen", "1718", "300_years", "mukogawa_valley"],
    source: "manual",
  },
  {
    slug: "arima-yumebana-modern",
    category: "lodging",
    sub_type: "onsen_ryokan",
    title_zh: "有馬温泉 月光園游月山荘(中堅老舗・三大古泉本場・金泉+ 銀泉両浴・25 室)",
    title_ja: "月光園游月山荘",
    romaji: "Gekkoen Yugetsu Sanso",
    summary_zh: "**月光園游月山荘は有馬温泉中堅老舗**(神戸市北区有馬町・25 室)。**三大古泉(R1 既出 goshobo-arima-1191・有馬・道後・白浜)** の本場で、金泉+ 銀泉両方の温泉湯巡り体験可。神戸市内から 30 分のアクセス利便+ 中規模価格帯で家族連れ+ 観光客に人気。R1 既出の gekkoen-kokorokan-arima-1955 とは別棟。",
    content_md: "- 立地:神戸市北区有馬町(有馬温泉)\n- 室数:25 室(中規模)\n- 温泉:金泉(含鉄塩化物泉)+ 銀泉(炭酸泉+ ラジウム泉)両浴\n- 三大古泉:有馬+ 道後+ 白浜\n- 料金目安:¥18000-32000/泊(2 食付)\n- 隣接:R1 住 goshobo-arima-1191(姉妹館の御所坊)+ 有馬温泉街\n- アクセス:神鉄有馬温泉駅 徒歩 5 分(神戸三宮 から 30 分)",
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
    price_tier: 3,
    booking_window_days: 14,
    closed_days: [],
    external_urls: {},
    tags: ["onsen_ryokan", "gekkoen", "arima", "kin_gin_sen", "modern_classical"],
    source: "manual",
  },

  // ════════════════════════════════════════════════════════════════════
  // 衣 R2 (2)
  // ════════════════════════════════════════════════════════════════════
  {
    slug: "kobe-pearl-overview",
    category: "fashion",
    sub_type: "craft_goods",
    title_zh: "神戸真珠(全国真珠加工 70%+ シェア・1900s 真珠養殖発祥+ 神戸港輸出・三宮真珠街)",
    title_ja: "神戸真珠",
    romaji: "Kobe Pearl",
    summary_zh: "**神戸真珠は全国真珠加工 70%+ シェア**(神戸市)。1893 御木本幸吉真珠養殖発明後、神戸が真珠輸出 hub として発展、現在も全国加工の 7 割が神戸。三宮+ 元町に真珠専門店多数、ミキモト+ TASAKI 等の本店+ 加工工場見学可能、神戸の隠れた産業文化。",
    content_md: "- 立地:神戸市三宮+ 元町\n- シェア:全国真珠加工 70%+\n- 由来:1893 御木本幸吉真珠養殖発明後の神戸港輸出 hub\n- 主要店:ミキモト+ TASAKI+ 神戸真珠+ 個別加工店多数\n- 価格目安:イヤリング ¥10000-50000+ ネックレス ¥30000-200000\n- アクセス:JR 三宮駅 徒歩 3-10 分(複数店)",
    region: "kansai",
    prefecture_ja: "兵庫県",
    gun_ja: null,
    municipality_ja: "神戸市",
    lg_code: "28100",
    area_types: ["historic_district"],
    lat: 34.6906,
    lon: 135.1956,
    season_start: null,
    season_end: null,
    event_start: null,
    event_end: null,
    price_tier: 4,
    booking_window_days: null,
    closed_days: [],
    external_urls: {},
    tags: ["craft_goods", "kobe_pearl", "70_percent_share", "1893_mikimoto", "sannomiya"],
    source: "manual",
  },
  {
    slug: "kobe-nankin-machi-souvenir",
    category: "fashion",
    sub_type: "shopping_district_urban",
    title_zh: "神戸南京町中華街土産(1868 開設・全国 3 大中華街・点心+ 雑貨+ 神戸土産・元町)",
    title_ja: "神戸南京町",
    romaji: "Kobe Nankin Machi",
    summary_zh: "**神戸南京町は 1868 開設の全国 3 大中華街**(神戸市元町・横浜+ 長崎+ 神戸)。**東西 200 m × 南北 110 m** の歩行者専用区画、点心+ 中華雑貨+ 神戸土産が集積。春節祭(2 月)が特に賑わう、神戸観光の食散策必訪エリア。R1 既出の former-foreign-settlement-15 と並ぶ神戸異国情緒の 2 大エリア。",
    content_md: "- 開設:1868 年(明治 1・神戸開港同年)\n- 規模:東西 200 m × 南北 110 m\n- 全国 3 大中華街:横浜+ 長崎(R1 育)+ 神戸\n- 主要販売:点心+ 中華雑貨+ 神戸土産\n- 春節祭:1 月下旬-2 月中旬(神戸ランタン)\n- 営業:店舗による(10:00-22:00 が標準)\n- 隣接:旧居留地+ 元町商店街\n- アクセス:JR 元町駅 徒歩 3 分・JR 三宮駅 徒歩 10 分",
    region: "kansai",
    prefecture_ja: "兵庫県",
    gun_ja: null,
    municipality_ja: "神戸市",
    lg_code: "28100",
    area_types: ["shopping_district_urban", "historic_district"],
    lat: 34.6889,
    lon: 135.1872,
    season_start: null,
    season_end: null,
    event_start: null,
    event_end: null,
    price_tier: 1,
    booking_window_days: null,
    closed_days: [],
    external_urls: {},
    tags: ["shopping_district_urban", "kobe_nankin_machi", "1868", "japan_3_chinatown", "spring_festival"],
    source: "manual",
  },

  // ════════════════════════════════════════════════════════════════════
  // 育 R2 (3)
  // ════════════════════════════════════════════════════════════════════
  {
    slug: "nishinomiya-ebisu-jinja",
    category: "culture",
    sub_type: "temple_shrine",
    title_zh: "西宮戎神社(全国戎総本宮・1622 創建・1/9-11 福男選び+ 大阪商業の守護神・延喜式内社)",
    title_ja: "西宮戎神社",
    romaji: "Nishinomiya Ebisu Jinja",
    summary_zh: "**西宮戎神社は全国戎神社の総本宮**(西宮市・1622 創建)。**1/10 十日戎の福男選び**(走り参り 230 m の競争で有名)で全国的知名度、大阪商業の守護神として商人+ ビジネスマンの信仰深い。延喜式内社+ 国指定重要文化財(本殿)、阪神西宮駅徒歩 5 分の好立地。",
    content_md: "- 創建:1622 年(元和 8)\n- 社格:延喜式内社+ 全国戎神社総本宮\n- 主祭神:蛭子大神(エビス)\n- 福男選び:1/10 朝 6 時開門 → 230 m 走り参り(全国中継)\n- 国重文:本殿\n- 入場:無料\n- 営業:24 時間(社務所 9:00-17:00)\n- 隣接:西宮神社の南 20 m に阪神西宮駅\n- アクセス:阪神西宮駅 徒歩 5 分(JR 西宮駅 徒歩 15 分)",
    region: "kansai",
    prefecture_ja: "兵庫県",
    gun_ja: null,
    municipality_ja: "西宮市",
    lg_code: "28204",
    area_types: ["shrine_temple"],
    lat: 34.7414,
    lon: 135.3414,
    season_start: null,
    season_end: null,
    event_start: "2026-01-10",
    event_end: "2026-01-10",
    price_tier: 1,
    booking_window_days: null,
    closed_days: [],
    external_urls: { official: "https://nishinomiya-ebisu.com/" },
    tags: ["temple_shrine", "nishinomiya_ebisu", "1622", "japan_ebisu_souhonguu", "fukuotoko"],
    source: "manual",
  },
  {
    slug: "tamba-sasayama-jo",
    category: "culture",
    sub_type: "history_site_castle",
    title_zh: "篠山城跡(国指定史跡・1609 徳川家康築城・天下普請名城・続日本 100 名城)",
    title_ja: "篠山城跡",
    romaji: "Sasayama Jou Ato",
    summary_zh: "**篠山城跡は徳川家康天下普請の名城**(丹波篠山市・1609 築城・国指定史跡 1956)。築城の名手藤堂高虎縄張り+ 15 大名による天下普請、徳川家康が大坂方包囲のため築城。**続日本 100 名城**+ 大書院(復元 2000)が見所、城下町と一体の保存状態が秀逸。",
    content_md: "- 築城:1609 年(慶長 14)\n- 築城主:徳川家康(天下普請・15 大名動員)\n- 縄張り:藤堂高虎\n- 国指定史跡:1956 年\n- 続日本 100 名城:第 162 番(2018 選定)\n- 大書院:2000 年復元\n- 入場料:¥600(大書院)\n- 営業:9:00-17:00(月曜定休)\n- 隣接:丹波篠山城下町(伝統的建造物群保存地区)\n- アクセス:JR 福知山線 篠山口駅 から バス 25 分・篠山下車",
    region: "kansai",
    prefecture_ja: "兵庫県",
    gun_ja: null,
    municipality_ja: "丹波篠山市",
    lg_code: "28221",
    area_types: ["history_site_castle"],
    lat: 35.0750,
    lon: 135.2200,
    season_start: null,
    season_end: null,
    event_start: null,
    event_end: null,
    price_tier: 1,
    booking_window_days: null,
    closed_days: ["mon"],
    external_urls: {},
    tags: ["history_site_castle", "sasayama_jou", "1609", "tokugawa_ieyasu", "100_castles_2"],
    source: "manual",
  },
  {
    slug: "ako-rekishi-hakubutsukan",
    category: "culture",
    sub_type: "museum_art",
    title_zh: "赤穂市立歴史博物館(忠臣蔵+ 赤穂塩文化総合・1989 開館・赤穂城跡 隣接・大石神社徒歩)",
    title_ja: "赤穂市立歴史博物館",
    romaji: "Ako Rekishi Hakubutsukan",
    summary_zh: "**赤穂市立歴史博物館は忠臣蔵+ 赤穂塩文化の総合館**(赤穂市・1989 開館)。R1 既出 ako-jo-ato(赤穂城跡)+ ako-oishi-jinja-1900(大石神社)に併設、47 義士の関連史料+ 赤穂塩製造史+ 浅野氏入封後の発展史を展示。**赤穂義士関連必訪施設**、赤穂観光の起点。",
    content_md: "- 開館:1989 年(平成 1)\n- 立地:赤穂市上仮屋(赤穂城跡 三の丸内)\n- 主要展示:忠臣蔵 47 義士関連+ 赤穂塩製造史+ 浅野氏入封史\n- 入館料:¥200\n- 営業:9:00-17:00(火曜定休)\n- 隣接:赤穂城跡(R1 育・徒歩 1 分)+ 大石神社(R1 育・徒歩 5 分)\n- アクセス:JR 赤穂線 播州赤穂駅 徒歩 15 分",
    region: "kansai",
    prefecture_ja: "兵庫県",
    gun_ja: null,
    municipality_ja: "赤穂市",
    lg_code: "28212",
    area_types: ["museum_art"],
    lat: 34.7456,
    lon: 134.3878,
    season_start: null,
    season_end: null,
    event_start: null,
    event_end: null,
    price_tier: 1,
    booking_window_days: null,
    closed_days: ["tue"],
    external_urls: { official: "https://ako-rekishi.jp/" },
    tags: ["museum_art", "ako_rekishi", "1989", "47_ronin", "ako_shio_history"],
    source: "manual",
  },

  // ════════════════════════════════════════════════════════════════════
  // 楽 R2 (1)
  // ════════════════════════════════════════════════════════════════════
  {
    slug: "amagasaki-shinkawa-canal",
    category: "entertainment",
    sub_type: "illumination",
    title_zh: "尼崎運河+ あまがさき西宮整備(国土省「運河の街」+ 桜並木+ 工業遺産景観・夜間ライトアップ)",
    title_ja: "尼崎運河",
    romaji: "Amagasaki Shinkawa",
    summary_zh: "**尼崎運河は阪神工業地帯の運河文化景観**(尼崎市)。1920 年代築造の工業運河+ 桜並木+ 旧工場群が独特な工業遺産景観を形成、近年は夜間ライトアップ+ 桜並木サイクリング+ クルーズで観光化。神戸+ 大阪 から 30 分のアクセス、関西工業文化体験スポット。",
    content_md: "- 築造:1920 年代(阪神工業地帯整備)\n- 立地:尼崎市内+ 西宮市\n- 桜並木:4 月初\n- ライトアップ:夜間(スポットによる)\n- 体験:運河クルーズ(¥1500)+ サイクリング+ 散策\n- 入場:無料(運河沿い散策)\n- アクセス:阪神尼崎駅 徒歩 10 分(JR 尼崎駅 徒歩 15 分)",
    region: "kansai",
    prefecture_ja: "兵庫県",
    gun_ja: null,
    municipality_ja: "尼崎市",
    lg_code: "28202",
    area_types: ["scenic_spot"],
    lat: 34.7333,
    lon: 135.4133,
    season_start: null,
    season_end: null,
    event_start: null,
    event_end: null,
    price_tier: 1,
    booking_window_days: null,
    closed_days: [],
    external_urls: {},
    tags: ["scenic_spot", "amagasaki_shinkawa", "1920s", "industrial_heritage", "sakura_canal"],
    source: "manual",
  },

  // ════════════════════════════════════════════════════════════════════
  // 行 R2 (2)
  // ════════════════════════════════════════════════════════════════════
  {
    slug: "jr-bantan-line",
    category: "transport",
    sub_type: "hyogo_private_rail",
    title_zh: "JR 播但線(姫路-和田山 65.7km・1894 開通・但馬地方アクセス幹線・観光列車「うみ風」運行)",
    title_ja: "JR 播但線",
    romaji: "JR Bantan Line",
    summary_zh: "**JR 播但線は姫路-和田山を結ぶ但馬地方アクセス幹線**(全長 65.7 km・1894 開通)。**観光列車「うみ風」**(2024 開業・JR 西日本)+ 普通電車運行、生野銀山+ 出石+ 城崎温泉(R2 住 mikiya)等の但馬観光のメインアクセス。山陰本線への接続で兵庫県内陸 - 山陰の動脈。",
    content_md: "- 開通:1894 年(明治 27)\n- 全長:65.7 km(姫路-和田山)\n- 観光列車:うみ風(2024 開業・JR 西日本)\n- 接続:山陰本線(和田山駅)\n- 沿線観光:生野銀山(国指定史跡)+ 出石町+ 城崎温泉(乗換)\n- 普通列車:1 時間に 1-2 本\n- 料金:姫路-和田山 ¥1340(普通)\n- アクセス:JR 姫路駅 が起点",
    region: "kansai",
    prefecture_ja: "兵庫県",
    gun_ja: null,
    municipality_ja: "姫路市",
    lg_code: "28201",
    area_types: ["transit_hub"],
    lat: 34.8331,
    lon: 134.6939,
    season_start: null,
    season_end: null,
    event_start: null,
    event_end: null,
    price_tier: 1,
    booking_window_days: null,
    closed_days: [],
    external_urls: {},
    tags: ["hyogo_private_rail", "jr_bantan_line", "1894", "65_7km", "umikaze_2024"],
    source: "manual",
  },
  {
    slug: "jr-sanin-honsen-hyogo",
    category: "transport",
    sub_type: "hyogo_private_rail",
    title_zh: "JR 山陰本線兵庫区間(和田山-居組 79.7km・但馬地方+ 城崎温泉アクセス幹線・「はまかぜ」特急)",
    title_ja: "JR 山陰本線兵庫区間",
    romaji: "JR San-in Honsen Hyogo",
    summary_zh: "**JR 山陰本線兵庫区間は但馬地方+ 城崎温泉アクセス幹線**(和田山-居組 79.7 km)。**特急「はまかぜ」**(大阪-鳥取・1972 運行開始・キハ 189 系)+ 普通電車運行、城崎温泉駅(R2 住 mikiya 至近)+ 餘部鉄橋(撮影名所)+ 香住等の沿線観光ハイライト。",
    content_md: "- 区間:和田山-居組(兵庫県内 79.7 km)\n- 特急:はまかぜ(大阪-鳥取・1972 開始)\n- 車両:キハ 189 系\n- 沿線観光:城崎温泉(R2 住 mikiya)+ 餘部鉄橋(写真名所)+ 香住+ 浜坂\n- 普通列車:1 時間に 1 本(地方区間は 1.5-2 時間 1 本)\n- 料金:大阪-城崎温泉 自由席 ¥4080(はまかぜ)\n- アクセス:大阪駅+ JR 山陰本線(乗換 和田山経由)",
    region: "kansai",
    prefecture_ja: "兵庫県",
    gun_ja: null,
    municipality_ja: "豊岡市",
    lg_code: "28209",
    area_types: ["transit_hub"],
    lat: 35.6228,
    lon: 134.8061,
    season_start: null,
    season_end: null,
    event_start: null,
    event_end: null,
    price_tier: 2,
    booking_window_days: null,
    closed_days: [],
    external_urls: {},
    tags: ["hyogo_private_rail", "jr_sanin_honsen", "79_7km", "hamakaze_express", "amaru_bridge"],
    source: "manual",
  },
];

async function main() {
  if (rows.length === 0) {
    console.log("[hyogo-r2] 尚無條目");
    return;
  }
  console.log(`[hyogo-r2] ${rows.length} 筆 ${DRY ? "(dry-run)" : ""}`);
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
      console.error("[hyogo-r2] upsert failed:", error);
      process.exit(1);
    }
    written += batch.length;
    process.stdout.write(`\r[hyogo-r2] upsert: ${written}/${rows.length}`);
  }
  process.stdout.write("\n");
  console.log(`[hyogo-r2] Done — ${written} rows.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

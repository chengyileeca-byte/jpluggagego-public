// Seed 長崎県 · 行類 條目 → public.japan_entries(Sprint 20.6 行 R1)
//
// 長崎 = 異国の坂・離島県・西九州新幹線終着:
//   - 西九州新幹線(2022/9/23 開業・武雄温泉-長崎 66 km・部分開業・5 駅)
//   - リレーかもめ(博多-武雄温泉乗換・対面乗換 3 分)
//   - JR 在来線:長崎本線(博多-長崎)+ 佐世保線(肥前山口-佐世保)+ 大村線(早岐-諫早)
//   - 観光特急「ふたつ星 4047」(2022 開業・JR 九州 D&S・武雄温泉-長崎)
//   - 長崎電気軌道(路面電車 1915・5 系統・¥140 均一・国登録 19 系車両)
//   - 私鉄:松浦鉄道西九州線(1988・佐世保-伊万里 93 km)+ 島原鉄道(1908・諫早-島原港 43 km)
//   - 離島航路:九州商船(長崎-五島)+ 九州郵船(博多-壱岐対馬)+ JR 九州高速船ヴィーナス
//   - 軍艦島ツアー船:やまさ海運+軍艦島コンシェルジュ+第七ゑびす丸
//   - 空港:長崎空港(1975 大村湾・国内最初の海上空港・国際線)+ 県内離島 3 空港(福江+対馬+壱岐)
//   - バス:長崎バス+西肥バス+県営バス+九州号高速バス
//   - 道路橋:長崎自動車道+平戸大橋(1977)+西海橋(1955)+伊王島大橋(2011)
//
// 嚴格定義:具体路線/事業者/駅/橋/空港のみ。概念ガイドは不採用。
//
// 25 筆構成:
//   Phase A 西九州新幹線 4(本体・リレーかもめ・新大村駅・長崎駅 2020 リニューアル)
//   Phase B JR 在来 + 観光特急 4(長崎本線・佐世保線・大村線・ふたつ星 4047)
//   Phase C 路面電車・私鉄 3(長崎電軌 1915・松浦鉄道 1988・島原鉄道 1908)
//   Phase D 離島フェリー・船 4(九州商船・九州郵船・JR 高速船・やまさ軍艦島)
//   Phase E 空港 2(長崎空港+県内離島空港統合)
//   Phase F バス 3(長崎バス・西肥バス・九州号高速バス)
//   Phase G 道路・橋 3(長崎自動車道・平戸大橋 1977・伊王島大橋 2011)
//   Phase H 乗車券 + レンタカー 2(長崎電軌 1 日券・離島レンタカー注意)
//
// Usage:
//   npx tsx scripts/seed-japan-entries-nagasaki-transport.ts --dry-run
//   npx tsx scripts/seed-japan-entries-nagasaki-transport.ts

import { config as loadEnv } from "dotenv";
loadEnv({ path: ".env.local" });

import { createAdminClient } from "../src/lib/supabase/admin";

const DRY = process.argv.includes("--dry-run");

type SubType =
  | "nagasaki_west_kyushu_shinkansen"
  | "nagasaki_jr_line"
  | "nagasaki_streetcar_1915"
  | "nagasaki_island_routes"
  | "sightseeing_train"
  | "airport_access"
  | "ticket_promo"
  | "rental_car_tips"
  | "route_map_urban"
  | "area_access_guide";

interface SeedRow {
  slug: string;
  category: "transport";
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
  // Phase A — 西九州新幹線(4 筆)
  // ════════════════════════════════════════════════════════════════════
  {
    slug: "nishi-kyushu-shinkansen-2022",
    category: "transport",
    sub_type: "nagasaki_west_kyushu_shinkansen",
    title_zh: "西九州新幹線(2022/9/23 開業・武雄温泉-長崎 66 km・部分開業・5 駅・所要 30 分)",
    title_ja: "西九州新幹線",
    romaji: "Nishi Kyushu Shinkansen",
    summary_zh: "**西九州新幹線は 2022 年 9 月 23 日開業の最新新幹線**(武雄温泉-長崎 66 km・5 駅・部分開業)。所要 30 分で長崎まで、車両は N700S(かもめ)。佐賀県内未開業区間(新鳥栖-武雄温泉)はリレーかもめで対面乗換 3 分接続、博多-長崎間 1 時間 20 分。長崎駅は 2020 高架化リニューアル、新大村駅+嬉野温泉駅+諫早駅+武雄温泉駅と長崎を結ぶ。",
    content_md: "- 開業:2022 年 9 月 23 日\n- 区間:武雄温泉-長崎(66 km・5 駅)\n- 駅:武雄温泉(乗換)→ 嬉野温泉(新設)→ 新大村(新設)→ 諫早 → 長崎\n- 所要:武雄温泉-長崎 30 分(最速)\n- 車両:N700S(かもめ)6 両編成\n- 部分開業:新鳥栖-武雄温泉間は未開業(整備計画中)\n- 接続:リレーかもめ(博多-武雄温泉特急・対面乗換 3 分)\n- 博多-長崎総所要:1 時間 20 分(従来 2 時間 → 30 分短縮)\n- 料金:博多-長崎自由席 ¥6050(乗継割引含)\n- 1 日本数:25 往復(2026 年 4 月時点)",
    region: "kyushu",
    prefecture_ja: "長崎県",
    gun_ja: null,
    municipality_ja: "長崎市",
    lg_code: "42201",
    area_types: ["transit_hub"],
    lat: 32.7536,
    lon: 129.8717,
    season_start: null,
    season_end: null,
    event_start: null,
    event_end: null,
    price_tier: 3,
    booking_window_days: 30,
    closed_days: [],
    external_urls: {},
    tags: ["nagasaki_west_kyushu_shinkansen", "2022_opening", "66km_5stations", "n700s_kamome", "30min"],
    source: "manual",
  },
  {
    slug: "relay-kamome-rinkan",
    category: "transport",
    sub_type: "nagasaki_west_kyushu_shinkansen",
    title_zh: "リレーかもめ(博多-武雄温泉特急・対面乗換 3 分・新幹線連絡・1 日 25 往復)",
    title_ja: "リレーかもめ",
    romaji: "Relay Kamome",
    summary_zh: "**リレーかもめは博多-武雄温泉間の新幹線接続特急**(2022/9/23 西九州新幹線開業同時)。787 系電車利用、博多-武雄温泉 1 時間 20 分・武雄温泉駅で西九州新幹線「かもめ」に対面乗換 3 分。新鳥栖-武雄温泉の在来線特急区間+ 武雄温泉-長崎の新幹線区間の組み合わせで博多-長崎 1 時間 20 分のシームレス移動。",
    content_md: "- 開業:2022 年 9 月 23 日(西九州新幹線同時)\n- 区間:博多-武雄温泉(91 km)+ 武雄温泉-長崎(新幹線・66 km)\n- 所要:博多-長崎 1 時間 20 分(リレー込)\n- 接続:武雄温泉駅で対面乗換 3 分(同一ホーム・反対側)\n- 車両:787 系(在来線特急・リクライニング普通車+グリーン車)\n- 1 日本数:25 往復\n- 料金:博多-長崎自由席 ¥6050\n- 名前:「リレー」=新幹線への接続役\n- 「かもめ」:長崎の県鳥",
    region: "kyushu",
    prefecture_ja: "長崎県",
    gun_ja: null,
    municipality_ja: "長崎市",
    lg_code: "42201",
    area_types: ["transit_hub"],
    lat: 32.7536,
    lon: 129.8717,
    season_start: null,
    season_end: null,
    event_start: null,
    event_end: null,
    price_tier: 3,
    booking_window_days: 30,
    closed_days: [],
    external_urls: {},
    tags: ["nagasaki_west_kyushu_shinkansen", "relay", "787_series", "3min_transfer", "25_round_trips"],
    source: "manual",
  },
  {
    slug: "shin-omura-station-2022",
    category: "transport",
    sub_type: "nagasaki_west_kyushu_shinkansen",
    title_zh: "新大村駅(西九州新幹線新設駅・2022/9/23 開業・大村空港アクセス強化・諫早-長崎中間)",
    title_ja: "新大村駅",
    romaji: "Shin Omura Station",
    summary_zh: "**新大村駅は西九州新幹線開業同時に新設された駅**(大村市・2022/9/23 開業)。長崎県中央部の交通結節点として整備、長崎空港(車 10 分)+ 在来線大村線連絡で航空+ 鉄道の hub 機能。駅周辺再開発進行中(2030 年代完成予定)、ホテル+ 商業施設+ 住宅地。新幹線かもめ全停車。",
    content_md: "- 開業:2022 年 9 月 23 日(西九州新幹線同時)\n- 立地:大村市植松\n- 在来線連絡:JR 大村線「新大村駅」(同名・接続)\n- 長崎空港アクセス:車 10 分(リムジンバス連絡)\n- 新幹線停車:全列車かもめ停車(1 日 25 往復)\n- 駅周辺再開発:2026 年現在進行中(2030 年代完成予定)\n- 構造:高架駅・2 面 2 線\n- 料金:長崎-新大村 ¥1980(自由席)\n- 駐車場:有料 800 台\n- 隣接:大村公園(車 10 分・桜名所)+ 長崎空港(車 10 分)",
    region: "kyushu",
    prefecture_ja: "長崎県",
    gun_ja: null,
    municipality_ja: "大村市",
    lg_code: "42205",
    area_types: ["transit_hub"],
    lat: 32.9075,
    lon: 129.9656,
    season_start: null,
    season_end: null,
    event_start: null,
    event_end: null,
    price_tier: 2,
    booking_window_days: null,
    closed_days: [],
    external_urls: { official: "https://www.jrkyushu.co.jp/railway/station/?ekiCode=2200" },
    tags: ["nagasaki_west_kyushu_shinkansen", "shin_omura_2022", "airport_hub", "shinkansen_full_stop"],
    source: "manual",
  },
  {
    slug: "nagasaki-station-2020-renewal",
    category: "transport",
    sub_type: "nagasaki_west_kyushu_shinkansen",
    title_zh: "JR 長崎駅(2020 高架化リニューアル・西九州新幹線終着駅・アミュプラザ長崎+ヒルトン併設)",
    title_ja: "JR 長崎駅",
    romaji: "JR Nagasaki Eki",
    summary_zh: "**JR 長崎駅は西九州新幹線の終着駅+ 長崎観光の玄関口**(2020 高架化リニューアル・2022 新幹線開業)。地上駅から高架駅化、新幹線+在来線+ 路面電車の 3 重結節点。**アミュプラザ長崎(2000 / 2023 増床)+ ヒルトン長崎(2021 開業)+ JR ホテル** 等が駅直結、商業+宿泊+交通の総合 hub。長崎電気軌道「長崎駅前」電停 徒歩 2 分。",
    content_md: "- 高架化完成:2020 年 3 月\n- 西九州新幹線開業:2022 年 9 月 23 日\n- 構造:高架駅・新幹線 2 面 4 線+在来線 4 面 8 線\n- 駅直結商業:アミュプラザ長崎(2000・2023 増床)+ JR 長崎ステーションホテル+ ヒルトン長崎(2021 開業)\n- 在来線:JR 長崎本線(博多方面)\n- 路面電車連絡:長崎電気軌道「長崎駅前」電停 徒歩 2 分\n- 高速バス:バス停「長崎駅前」(高速九州号 等)\n- 1 日乗車人員:約 2 万人(2023 年)\n- 隣接:出島ワーフ(徒歩 8 分)+ 長崎港ターミナル(徒歩 10 分)\n- アクセス:博多-長崎 1 時間 20 分(リレーかもめ + 西九州新幹線)",
    region: "kyushu",
    prefecture_ja: "長崎県",
    gun_ja: null,
    municipality_ja: "長崎市",
    lg_code: "42201",
    area_types: ["transit_hub"],
    lat: 32.7536,
    lon: 129.8717,
    season_start: null,
    season_end: null,
    event_start: null,
    event_end: null,
    price_tier: 1,
    booking_window_days: null,
    closed_days: [],
    external_urls: { official: "https://www.jrkyushu.co.jp/railway/station/?ekiCode=23800" },
    tags: ["nagasaki_west_kyushu_shinkansen", "nagasaki_station", "2020_highrise", "amuplaza_hilton"],
    source: "manual",
  },

  // ════════════════════════════════════════════════════════════════════
  // Phase B — JR 在来 + 観光特急(4 筆)
  // ════════════════════════════════════════════════════════════════════
  {
    slug: "jr-nagasaki-honsen",
    category: "transport",
    sub_type: "nagasaki_jr_line",
    title_zh: "JR 長崎本線(門司港-鳥栖-長崎 152 km・1898 全通・在来線大動脈・新幹線並走区間有)",
    title_ja: "JR 長崎本線",
    romaji: "JR Nagasaki Honsen",
    summary_zh: "**JR 長崎本線は門司港から長崎までの大動脈**(全長 152 km・1898 全通)。新幹線開業前の特急かもめ(博多-長崎 1 時間 50 分)が走った路線、現在は普通+ 一部特急のみ運行(諫早-長崎区間)。沿線:佐賀県内(肥前鹿島+肥前山口)+長崎県内(諫早+喜々津+浦上)。普通列車で長崎観光の地方部アクセスに使用、新幹線開業で長距離特急は廃止。",
    content_md: "- 全通:1898 年(明治 31)\n- 全長:152 km(門司港-長崎)\n- 県内区間:諫早-長崎(約 25 km)\n- 主要駅(県内):諫早+喜々津+浦上+長崎\n- 列車種別:普通+ 一部特急かもめ(博多-肥前鹿島区間のみ・長崎県内非乗入)\n- 新幹線並走:大村線+西九州新幹線が新ルート、本線は迂回ルート\n- 普通列車:817 系電車\n- 諫早-長崎:1 時間に 1-2 本\n- 料金:諫早-長崎 ¥460(普通)\n- 役割:沿線の地域住民+観光客の長崎-佐賀間移動",
    region: "kyushu",
    prefecture_ja: "長崎県",
    gun_ja: null,
    municipality_ja: "諫早市",
    lg_code: "42204",
    area_types: ["transit_hub"],
    lat: 32.8425,
    lon: 130.0644,
    season_start: null,
    season_end: null,
    event_start: null,
    event_end: null,
    price_tier: 1,
    booking_window_days: null,
    closed_days: [],
    external_urls: { official: "https://www.jrkyushu.co.jp/railway/" },
    tags: ["nagasaki_jr_line", "1898", "152km", "main_line", "post_shinkansen"],
    source: "manual",
  },
  {
    slug: "jr-sasebo-line",
    category: "transport",
    sub_type: "nagasaki_jr_line",
    title_zh: "JR 佐世保線(肥前山口-佐世保 49 km・特急みどり・1898 開業・佐世保観光大動脈)",
    title_ja: "JR 佐世保線",
    romaji: "JR Sasebo Line",
    summary_zh: "**JR 佐世保線は肥前山口(佐賀)-佐世保 49 km の路線**(1898 開業)。特急「みどり」(博多-佐世保・1 時間 56 分)が主力、九十九島+ HTB+ 佐世保観光のメインアクセス。普通+ 特急混合運行、HTB 駅は HTB 専用駅(駅徒歩 5 分)。沿線:肥前山口+武雄温泉+有田+早岐+佐世保。",
    content_md: "- 開業:1898 年(明治 31)\n- 全長:49 km(肥前山口-佐世保)\n- 県内区間:早岐-佐世保(約 12 km)\n- 主要駅(県内):有田-早岐-ハウステンボス-佐世保\n- 列車種別:特急「みどり」(博多-佐世保・1 時間 56 分・1 日 14 往復)+ 普通+ ふたつ星 4047(観光特急)\n- 特急車両:885 系・787 系\n- HTB 駅:HTB 専用駅(駅徒歩 5 分)・特急全停車\n- 料金:博多-佐世保自由席 ¥3940\n- 普通:1 時間に 1-2 本\n- 観光要素:武雄温泉(乗換)+ 有田陶器市(陶器の里)+ HTB+ 九十九島(佐世保)",
    region: "kyushu",
    prefecture_ja: "長崎県",
    gun_ja: null,
    municipality_ja: "佐世保市",
    lg_code: "42202",
    area_types: ["transit_hub"],
    lat: 33.1597,
    lon: 129.7236,
    season_start: null,
    season_end: null,
    event_start: null,
    event_end: null,
    price_tier: 2,
    booking_window_days: null,
    closed_days: [],
    external_urls: { official: "https://www.jrkyushu.co.jp/railway/" },
    tags: ["nagasaki_jr_line", "1898", "49km", "midori_express", "htb_access"],
    source: "manual",
  },
  {
    slug: "jr-omura-line",
    category: "transport",
    sub_type: "nagasaki_jr_line",
    title_zh: "JR 大村線(早岐-諫早 47 km・1898 開業・大村湾沿岸絶景路線・新幹線並走区間)",
    title_ja: "JR 大村線",
    romaji: "JR Omura Line",
    summary_zh: "**JR 大村線は早岐(佐世保)-諫早 47 km の路線**(1898 開業)。大村湾沿岸を走る絶景路線、観光特急「ふたつ星 4047」+ 普通電車運行。HTB-佐世保-大村-諫早の都市間移動+ 海の景色を楽しむ路線、駅:早岐-ハウステンボス-川棚-松原-千綿-彼杵-大村-諫早。新幹線開業後も並走、海岸景観で観光価値高。",
    content_md: "- 開業:1898 年(明治 31)\n- 全長:47 km(早岐-諫早)\n- 県内全駅:早岐+ハウステンボス+南風崎+小串郷+川棚+彼杵+千綿+松原+竹松+諏訪+新大村+大村+岩松+諫早\n- 観光特急:ふたつ星 4047(2022 開業・武雄温泉発長崎行・南行)\n- 普通:817 系・YC1 系(2018 ハイブリッド)\n- 大村湾車窓:千綿駅 + 松原駅周辺が絶景(海すれすれ走行)\n- 千綿駅:大村湾沿岸の無人駅・木造駅舎・絶景地撮影スポット\n- 普通列車:1 時間に 1-2 本\n- 料金:佐世保-諫早 ¥1130(普通)\n- 観光要素:HTB+ 大村公園+ 千綿駅(写真名所)",
    region: "kyushu",
    prefecture_ja: "長崎県",
    gun_ja: null,
    municipality_ja: "大村市",
    lg_code: "42205",
    area_types: ["transit_hub"],
    lat: 32.9075,
    lon: 129.9656,
    season_start: null,
    season_end: null,
    event_start: null,
    event_end: null,
    price_tier: 1,
    booking_window_days: null,
    closed_days: [],
    external_urls: { official: "https://www.jrkyushu.co.jp/railway/" },
    tags: ["nagasaki_jr_line", "1898", "47km", "omura_bay_view", "chiwata_station"],
    source: "manual",
  },
  {
    slug: "futatsu-boshi-4047-2022",
    category: "transport",
    sub_type: "sightseeing_train",
    title_zh: "観光特急「ふたつ星 4047」(2022 開業・JR 九州 D&S・武雄温泉-長崎・午前佐世保線+午後大村線)",
    title_ja: "ふたつ星 4047",
    romaji: "Futatsu Boshi 4047",
    summary_zh: "**ふたつ星 4047 は西九州新幹線開業同時運行の観光特急**(2022/9/23 開業)。「ふたつ星」=長崎県+佐賀県の 2 県、「4047」=キハ 47+40 形改造車両。1 日 1 往復、午前は武雄温泉発佐世保線経由長崎、午後は長崎発大村線経由武雄温泉、湾沿いを走る景色+ 車内 lounge+ 食事サービス。事前予約必要(JR 九州ネット予約)・全車指定。",
    content_md: "- 開業:2022 年 9 月 23 日(西九州新幹線同時)\n- 「4047」:キハ 47 形+キハ 40 形改造車両(D&S 5 番目の車両)\n- 「ふたつ星」:長崎+佐賀の 2 県\n- 運行:1 日 1 往復・全車指定\n- 午前(往路):武雄温泉発 → 佐世保線経由 → 長崎着(11:00 出発・12:55 着)\n- 午後(復路):長崎発 → 大村線経由 → 武雄温泉着(13:30 出発・15:46 着)\n- 車両:3 両編成・lounge カー+ 食事サービス\n- 料金:特急料金+ 指定席料金(¥1660 + 別途乗車券)\n- 予約:JR 九州ネット予約(発売 1 ヶ月前)\n- 乗車記念グッズあり",
    region: "kyushu",
    prefecture_ja: "長崎県",
    gun_ja: null,
    municipality_ja: "長崎市",
    lg_code: "42201",
    area_types: ["sightseeing_train"],
    lat: 32.7536,
    lon: 129.8717,
    season_start: null,
    season_end: null,
    event_start: null,
    event_end: null,
    price_tier: 3,
    booking_window_days: 30,
    closed_days: [],
    external_urls: {},
    tags: ["sightseeing_train", "2022_opening", "ds_train", "1_round_trip", "kiha_4047"],
    source: "manual",
  },

  // ════════════════════════════════════════════════════════════════════
  // Phase C — 路面電車・私鉄(3 筆)
  // ════════════════════════════════════════════════════════════════════
  {
    slug: "nagasaki-tram-1915",
    category: "transport",
    sub_type: "nagasaki_streetcar_1915",
    title_zh: "長崎電気軌道(路面電車・1915 開業・5 系統・¥140 均一・国登録 19 系車両・観光主要交通)",
    title_ja: "長崎電気軌道",
    romaji: "Nagasaki Densha",
    summary_zh: "**長崎電気軌道は長崎市内観光の主要交通**(1915 開業・5 系統・¥140 均一)。総延長 11.5 km、5 系統(1 / 3 / 4 / 5 / の 4 系統+土日祝の 9)で主要観光地(出島+ 大浦天主堂+ 平和公園+ 諏訪神社+ 浦上)をカバー。**国登録有形文化財の 19 系車両**(1911 製造・現役最古級)も運行、ICカード(SUGOCA / nimoca)対応。1 日乗車券 ¥600。",
    content_md: "- 開業:1915 年(大正 4)\n- 営業距離:11.5 km\n- 系統:1 系統(赤迫-崇福寺)+ 3 系統(蛍茶屋-赤迫)+ 4 系統(蛍茶屋-石橋・廃止)+ 5 系統(蛍茶屋-石橋・経由 大浦海岸通り)\n- 運賃:¥140 均一(2024-12 改定)\n- 1 日乗車券:¥600(おとな・5 系統乗り放題)\n- IC カード:SUGOCA / nimoca / Suica 等全国相互利用対応\n- 国登録有形文化財:160 形 (1911 製造) + 168 形 (1950 改造) + 西鉄 700 形 (1953)\n- 営業時間:5:30-23:30(系統で異なる)\n- 主要観光地カバー:出島+ 大浦天主堂+ 平和公園+ 諏訪神社+ 中華街\n- 周遊推奨:長崎駅前 → 平和公園 → 出島 → 中華街 → 大浦天主堂 → グラバー園",
    region: "kyushu",
    prefecture_ja: "長崎県",
    gun_ja: null,
    municipality_ja: "長崎市",
    lg_code: "42201",
    area_types: ["transit_hub"],
    lat: 32.7536,
    lon: 129.8717,
    season_start: null,
    season_end: null,
    event_start: null,
    event_end: null,
    price_tier: 1,
    booking_window_days: null,
    closed_days: [],
    external_urls: { official: "https://www.naga-den.com/" },
    tags: ["nagasaki_streetcar_1915", "1915", "5_lines", "140yen_uniform", "registered_cultural_property"],
    source: "manual",
  },
  {
    slug: "matsuura-railway-1988",
    category: "transport",
    sub_type: "nagasaki_streetcar_1915",
    title_zh: "松浦鉄道西九州線(1988 第三セクター・佐世保-伊万里-有田 93 km・国内最西端駅+海岸絶景)",
    title_ja: "松浦鉄道",
    romaji: "Matsuura Tetsudou",
    summary_zh: "**松浦鉄道西九州線は 1988 年 JR 九州から第三セクター化された地方鉄道**(佐世保-伊万里-有田・93 km・57 駅)。**国内最西端駅「たびら平戸口駅」**(北緯 33.4°)+ 海岸絶景区間で観光価値高。日に 30 往復+ 観光列車「未来 1 号」運行。佐世保(SSK 駅)から平戸+ 田平+ 松浦+ 伊万里+ 有田まで、JR と有田駅で接続。",
    content_md: "- 第三セクター化:1988 年 4 月(JR 九州松浦線 → 松浦鉄道)\n- 全長:93 km・57 駅\n- 起点:佐世保駅(JR と接続)\n- 終点:有田駅(JR 佐世保線・JR 九州大村線と接続)\n- 「たびら平戸口駅」:北緯 33.4° 国内最西端駅(駅標+ 記念撮影スポット)\n- 海岸絶景:江迎-松浦-伊万里区間が玄界灘沿岸\n- 車両:MR-600 形 ディーゼルカー\n- 運賃:全線通し ¥1700\n- 観光列車:未来 1 号(週末運行)\n- 隣接観光地:平戸城+ 田平天主堂+ 平戸オランダ商館",
    region: "kyushu",
    prefecture_ja: "長崎県",
    gun_ja: null,
    municipality_ja: "佐世保市",
    lg_code: "42202",
    area_types: ["transit_hub"],
    lat: 33.1597,
    lon: 129.7236,
    season_start: null,
    season_end: null,
    event_start: null,
    event_end: null,
    price_tier: 2,
    booking_window_days: null,
    closed_days: [],
    external_urls: { official: "https://matsutetsu.com/" },
    tags: ["nagasaki_streetcar_1915", "1988_3rd_sector", "93km", "westernmost_station", "tabira_hirado"],
    source: "manual",
  },
  {
    slug: "shimabara-railway-1908",
    category: "transport",
    sub_type: "nagasaki_streetcar_1915",
    title_zh: "島原鉄道(諫早-島原港 43 km・1908 開業・島原半島東岸縦貫・1991 雲仙噴火耐え運行)",
    title_ja: "島原鉄道",
    romaji: "Shimabara Tetsudou",
    summary_zh: "**島原鉄道は島原半島東岸を縦貫する民営鉄道**(1908 開業・諫早-島原港 43 km・25 駅)。雲仙岳噴火(1990-1995)で一部区間被災も復旧運行。**有明海の絶景+ 島原温泉+ 島原城+ 雲仙地獄アクセス** で観光価値高。「雲仙踊り」と地元呼ばれる景観区間あり、有明海+ 普賢岳+ 島原城+ 干潟の絶景。",
    content_md: "- 開業:1908 年(明治 41)\n- 全長:43 km(諫早-島原港)\n- 駅数:25 駅\n- 雲仙噴火被災:1990-1995 平成新山噴火で一部区間被害+ 復旧\n- 観光要素:有明海絶景+ 島原温泉+ 島原城+ 雲仙地獄(バス連絡)+ 干潟\n- 車両:キハ 2500 形 ディーゼルカー\n- 運賃:諫早-島原港 ¥1500\n- 乗車時間:1 時間 7 分(普通)\n- 観光列車「ながさきリゾートカフェ」:不定期運行\n- 隣接観光地:島原城+ 島原温泉+ 雲仙地獄(車 30 分)+ 諫早天明干拓堤防",
    region: "kyushu",
    prefecture_ja: "長崎県",
    gun_ja: null,
    municipality_ja: "島原市",
    lg_code: "42203",
    area_types: ["transit_hub"],
    lat: 32.7811,
    lon: 130.3700,
    season_start: null,
    season_end: null,
    event_start: null,
    event_end: null,
    price_tier: 2,
    booking_window_days: null,
    closed_days: [],
    external_urls: { official: "https://www.shimatetsu.co.jp/" },
    tags: ["nagasaki_streetcar_1915", "1908", "43km", "shimabara_peninsula", "post_eruption"],
    source: "manual",
  },

  // ════════════════════════════════════════════════════════════════════
  // Phase D — 離島フェリー・船(4 筆)
  // ════════════════════════════════════════════════════════════════════
  {
    slug: "kyushu-shosen-goto-fukue",
    category: "transport",
    sub_type: "nagasaki_island_routes",
    title_zh: "九州商船 五島航路(長崎港-福江港・ジェットフォイル 1h25m+ フェリー 3h10m)",
    title_ja: "九州商船 五島航路",
    romaji: "Kyushu Shosen Goto Route",
    summary_zh: "**九州商船は長崎-五島メイン海運会社**(長崎港-福江港・1 日 6-7 便)。**ジェットフォイル**(高速船・1 時間 25 分・¥6800)+ **フェリー**(3 時間 10 分・¥3590)の 2 タイプ。福江港到着後の島内+ 久賀島+ 奈留島連絡船(同社運営)も運行、五島列島観光の最重要海上アクセス。長崎港ターミナル発着で出島ワーフ+ 駅前から徒歩 10 分。",
    content_md: "- 運営:九州商船(株)\n- 主要航路:長崎港-福江港(五島市)\n- ジェットフォイル:1 時間 25 分・¥6800(大人片道)\n- フェリー:3 時間 10 分・¥3590(2 等)\n- 1 日本数:ジェットフォイル 4-5 便+フェリー 2 便\n- 連絡:長崎港-久賀島(田ノ浦港)+ 長崎港-奈留島-福江(中間寄港)\n- 上五島(中通島):長崎-鯛ノ浦+ 佐世保-奈良尾\n- 出航時間:6:00-19:00 帯\n- 予約:電話 + ネット予約(jrkyushufiri.co.jp)\n- 出発地:長崎港ターミナル(出島ワーフ隣)・徒歩 駅前から 10 分\n- 注意:海況により欠航多い(冬季+台風時期)",
    region: "kyushu",
    prefecture_ja: "長崎県",
    gun_ja: null,
    municipality_ja: "長崎市",
    lg_code: "42201",
    area_types: ["ferry_terminal"],
    lat: 32.7444,
    lon: 129.8675,
    season_start: null,
    season_end: null,
    event_start: null,
    event_end: null,
    price_tier: 3,
    booking_window_days: 14,
    closed_days: [],
    external_urls: { official: "https://kyusho.co.jp/" },
    tags: ["nagasaki_island_routes", "kyushu_shosen", "goto_fukue", "jetfoil_1h25m", "ferry_3h10m"],
    source: "manual",
  },
  {
    slug: "kyushu-yusen-iki-tsushima",
    category: "transport",
    sub_type: "nagasaki_island_routes",
    title_zh: "九州郵船 壱岐対馬航路(博多港・唐津港 → 壱岐・対馬・フェリー 2h-4h45m)",
    title_ja: "九州郵船 壱岐対馬航路",
    romaji: "Kyushu Yusen Iki Tsushima",
    summary_zh: "**九州郵船は壱岐対馬への主要海運会社**(博多港+ 唐津港発)。**博多-壱岐(郷ノ浦)**:フェリー 2 時間 5 分・¥2800・1 日 4 便。**博多-対馬(厳原)**:フェリー 4 時間 45 分・¥4960・1 日 1 便+ 比田勝経由便。**唐津-壱岐(印通寺)**:フェリー 1 時間 40 分・¥2300・1 日 4 便。観光客は JR 九州高速船との併用が一般的。",
    content_md: "- 運営:九州郵船(株)\n- 博多港-壱岐(郷ノ浦):フェリー 2 時間 5 分・¥2800・1 日 4 便\n- 博多港-対馬(厳原):フェリー 4 時間 45 分・¥4960・1 日 1 便\n- 博多港-対馬(比田勝):フェリー 5 時間 30 分・¥4960\n- 唐津港-壱岐(印通寺):フェリー 1 時間 40 分・¥2300・1 日 4 便\n- 車両搭載:可能(別料金)\n- 出発地:博多港(福岡市博多区)+ 唐津港(佐賀県)\n- 予約:電話 + ネット(www.kyu-you.co.jp)\n- 注意:冬季+ 台風時期欠航多い・離島急ぎなら高速船併用\n- アクセス:博多港ターミナル(地下鉄中洲川端から バス 10 分)",
    region: "kyushu",
    prefecture_ja: "長崎県",
    gun_ja: null,
    municipality_ja: "壱岐市",
    lg_code: "42210",
    area_types: ["ferry_terminal"],
    lat: 33.7333,
    lon: 129.6794,
    season_start: null,
    season_end: null,
    event_start: null,
    event_end: null,
    price_tier: 2,
    booking_window_days: 14,
    closed_days: [],
    external_urls: { official: "https://www.kyu-you.co.jp/" },
    tags: ["nagasaki_island_routes", "kyushu_yusen", "iki_tsushima", "hakata_karatsu", "vehicle_capable"],
    source: "manual",
  },
  {
    slug: "jr-kyushu-jetfoil-iki",
    category: "transport",
    sub_type: "nagasaki_island_routes",
    title_zh: "JR 九州高速船「ヴィーナス」(博多-壱岐 1h5m + 対馬 2h15m・1 日 1 往復・観光客主流)",
    title_ja: "JR 九州高速船 ヴィーナス",
    romaji: "JR Kyushu Jetfoil Venus",
    summary_zh: "**JR 九州高速船「ヴィーナス」は博多-壱岐対馬の高速船**(博多港-壱岐 1 時間 5 分・対馬 2 時間 15 分)。ボーイング・ジェットフォイル使用の 国内最速級海上移動、観光客の壱岐対馬日帰り+ 1 泊圏内化を可能にした。1 日 1 往復(夏 2 往復)・¥4500-5500。フェリーの 1/3-1/2 の所要時間で離島観光ハードル低下。",
    content_md: "- 運営:JR 九州高速船(株)\n- 船型:ボーイング・ジェットフォイル(水中翼船)\n- 速度:時速 80 km(国内最速級)\n- 博多港-壱岐(芦辺港):1 時間 5 分・¥4500\n- 博多港-対馬(比田勝港):2 時間 15 分・¥5500(壱岐経由便)\n- 1 日本数:1 往復(夏 6 月-9 月は 2 往復)\n- 出発地:博多港ターミナル(国際線+九郵船と同地)\n- 予約:JR 九州ネット予約(www.jrbeetle.co.jp・以前ビートル便も同社)\n- 注意:海況に左右・冬季欠航率高\n- 観光価値:博多発日帰り壱岐+ 1 泊対馬が可能",
    region: "kyushu",
    prefecture_ja: "長崎県",
    gun_ja: null,
    municipality_ja: "壱岐市",
    lg_code: "42210",
    area_types: ["ferry_terminal"],
    lat: 33.7531,
    lon: 129.7186,
    season_start: null,
    season_end: null,
    event_start: null,
    event_end: null,
    price_tier: 3,
    booking_window_days: 14,
    closed_days: [],
    external_urls: {},
    tags: ["nagasaki_island_routes", "jr_kyushu_venus", "boeing_jetfoil", "fastest_marine", "iki_tsushima"],
    source: "manual",
  },
  {
    slug: "yamasa-gunkanjima-cruise",
    category: "transport",
    sub_type: "nagasaki_island_routes",
    title_zh: "やまさ海運 軍艦島クルーズ(長崎港-端島・上陸ツアー込・1 日 2 便・¥4500)",
    title_ja: "やまさ海運 軍艦島クルーズ",
    romaji: "Yamasa Gunkanjima Cruise",
    summary_zh: "**やまさ海運は軍艦島(端島)上陸ツアー大手 3 社の 1**(長崎港発・1 日 2 便)。9:00 / 13:00 出航・所要 2 時間 30 分(船+上陸 60 分)。**ガイド付・上陸料込 ¥4500**。海況により上陸不可の場合(成功率約 65%)もあるが船からの撮影+ 周辺クルーズで返金なし。同社系の他に **軍艦島コンシェルジュ・第七ゑびす丸** が運営、要事前予約。",
    content_md: "- 運営:やまさ海運(株)\n- 出航:1 日 2 便(9:00 / 13:00)\n- 所要:2 時間 30 分(船 1 時間 30 分+上陸 60 分)\n- 料金:¥4500(船+上陸料込)\n- 上陸成功率:約 65%(海況・季節で変動)\n- 出発地:長崎港ターミナル\n- 予約:電話 + ネット(www.yamasa-kaiun.net)・1 ヶ月前推奨\n- 同業:軍艦島コンシェルジュ+ 第七ゑびす丸+ シーマン商会(計 4 社)\n- 注意:強風+ 高波で欠航多い・予備日推奨\n- ガイド:産業遺産+ 構造物詳細解説付き",
    region: "kyushu",
    prefecture_ja: "長崎県",
    gun_ja: null,
    municipality_ja: "長崎市",
    lg_code: "42201",
    area_types: ["ferry_terminal"],
    lat: 32.7444,
    lon: 129.8675,
    season_start: null,
    season_end: null,
    event_start: null,
    event_end: null,
    price_tier: 3,
    booking_window_days: 30,
    closed_days: [],
    external_urls: { official: "https://www.yamasa-kaiun.net/" },
    tags: ["nagasaki_island_routes", "yamasa_kaiun", "gunkanjima", "2_per_day", "65_percent_success"],
    source: "manual",
  },

  // ════════════════════════════════════════════════════════════════════
  // Phase E — 空港(2 筆)
  // ════════════════════════════════════════════════════════════════════
  {
    slug: "nagasaki-airport-1975",
    category: "transport",
    sub_type: "airport_access",
    title_zh: "長崎空港(大村湾人工島・1975 移転・国内最初の本格的海上空港・国際線+国内 6 路線)",
    title_ja: "長崎空港",
    romaji: "Nagasaki Airport",
    summary_zh: "**長崎空港は国内最初の本格的海上空港**(大村市・1975 移転)。大村湾の人工島(箕島)に建設、国内 6 路線(東京+大阪+名古屋+神戸+沖縄+鹿児島)+国際線(上海+ソウル等)。長崎市内アクセス:リムジンバス 50 分(¥1200)+ 諫早駅経由電車。新大村駅(西九州新幹線)から車 10 分、新幹線+空港の連絡向上。",
    content_md: "- 開港:1975 年(昭和 50)5 月 1 日(海上移転)\n- 立地:大村市箕島町(大村湾人工島・国内最初の海上空港)\n- 国内路線:東京(羽田・成田)+ 大阪(伊丹・関西)+ 名古屋(中部)+ 神戸+ 沖縄(那覇)+ 鹿児島\n- 国際線:上海(東方航空)+ ソウル(LCC)+ 香港(LCC・季節運航)等\n- 長崎市内アクセス:リムジンバス 50 分・¥1200\n- 諫早駅アクセス:県営バス 30 分・¥730\n- 新大村駅(西九州新幹線):車 10 分・タクシー ¥1500\n- 駐車場:有料 1500 台\n- 隣接:ハウステンボス(車 30 分・リムジンバス連絡)+ 大村公園(車 15 分)",
    region: "kyushu",
    prefecture_ja: "長崎県",
    gun_ja: null,
    municipality_ja: "大村市",
    lg_code: "42205",
    area_types: ["airport"],
    lat: 32.9167,
    lon: 129.9136,
    season_start: null,
    season_end: null,
    event_start: null,
    event_end: null,
    price_tier: 1,
    booking_window_days: null,
    closed_days: [],
    external_urls: { official: "https://nagasaki-airport.jp/" },
    tags: ["airport_access", "1975_offshore", "first_marine_airport", "6_domestic_routes", "international"],
    source: "manual",
  },
  {
    slug: "nagasaki-island-airports",
    category: "transport",
    sub_type: "airport_access",
    title_zh: "長崎県内離島 3 空港(福江+対馬+壱岐・ORC + JAL + ANA・福岡-長崎発離島便)",
    title_ja: "長崎県内離島空港",
    romaji: "Nagasaki Island Airports",
    summary_zh: "**長崎県は国内屈指の離島空港県・3 空港**。**福江空港(五島)**:長崎-福江(ORC・25 分・1 日 3 便)+ 福岡-福江(ORC・40 分・1 日 1 便)。**対馬空港**:福岡-対馬(JAL/ORC・35 分・1 日 4 便)+ 長崎-対馬(ORC・40 分・1 日 1 便)。**壱岐空港**:福岡-壱岐(ORC・30 分・1 日 2 便)。離島観光の時間短縮 + 急ぎ向け、フェリーより高価だが圧倒的に速い。",
    content_md: "- 福江空港(五島市):長崎-福江(ORC 25 分・3 便/日)+ 福岡-福江(ORC 40 分・1 便/日)\n- 対馬空港:福岡-対馬(JAL/ORC 35 分・4 便/日)+ 長崎-対馬(ORC 40 分・1 便/日)\n- 壱岐空港:福岡-壱岐(ORC 30 分・2 便/日)\n- 主要航空会社:ORC(オリエンタルエアブリッジ・日本最小航空会社・本社大村)+ JAL+ ANA\n- 機材:ボンバルディア DHC-8(40-50 席)\n- 料金:長崎-福江 ¥17000-(早期割引で半額)\n- 福岡-対馬:¥18000-\n- 福岡-壱岐:¥15000-\n- 予約:JAL/ORC ネット予約(www.orc-air.co.jp)\n- 利点:海況に左右されない・高速移動",
    region: "kyushu",
    prefecture_ja: "長崎県",
    gun_ja: null,
    municipality_ja: "五島市",
    lg_code: "42211",
    area_types: ["airport"],
    lat: 32.6661,
    lon: 128.8328,
    season_start: null,
    season_end: null,
    event_start: null,
    event_end: null,
    price_tier: 4,
    booking_window_days: 60,
    closed_days: [],
    external_urls: { official: "https://www.orc-air.co.jp/" },
    tags: ["airport_access", "3_island_airports", "orc_jal_ana", "fukue_tsushima_iki", "minimum_dhc8"],
    source: "manual",
  },

  // ════════════════════════════════════════════════════════════════════
  // Phase F — バス(3 筆)
  // ════════════════════════════════════════════════════════════════════
  {
    slug: "nagasaki-city-bus",
    category: "transport",
    sub_type: "route_map_urban",
    title_zh: "長崎バス(長崎市内+周辺 60+ 路線・路面電車補完・観光地連絡・主要 hub 長崎駅前)",
    title_ja: "長崎バス",
    romaji: "Nagasaki Bus",
    summary_zh: "**長崎バスは長崎市内+周辺市町を結ぶ路線バス会社**(長崎自動車・1939 創業)。市内 60+ 路線、路面電車が通らないエリア(稲佐山+ 神ノ島+ 四杖+ 茂木+ 戸町)を補完、観光地連絡(平和公園+ 大浦+ 長崎港+ 茂木+ 軍艦島ツアー埠頭)で重要。長崎駅前バスターミナルが主要 hub・¥160-$420 区間制+ IC カード対応。",
    content_md: "- 運営:長崎自動車(株)・1939 創業\n- 路線数:60+(長崎市内+周辺市町)\n- 主要 hub:長崎駅前バスターミナル(駅前+大波止)+ 中央橋+ 県庁前\n- 観光連絡:平和公園+ 大浦+ 長崎港+ 茂木+ 戸町+ 神ノ島\n- 稲佐山アクセス:長崎駅前-稲佐山ロープウェイ前(¥230・25 分)\n- 路面電車補完:電軌が通らないエリア\n- 運賃:¥160-$420(区間制)\n- IC カード:nimoca / SUGOCA / Suica 等全国対応\n- 1 日乗車券:長崎電気軌道+長崎バス共通券 ¥800(観光客向け)\n- 営業時間:5:30-23:30",
    region: "kyushu",
    prefecture_ja: "長崎県",
    gun_ja: null,
    municipality_ja: "長崎市",
    lg_code: "42201",
    area_types: ["transit_hub"],
    lat: 32.7536,
    lon: 129.8717,
    season_start: null,
    season_end: null,
    event_start: null,
    event_end: null,
    price_tier: 1,
    booking_window_days: null,
    closed_days: [],
    external_urls: { official: "https://www.nagasaki-bus.co.jp/" },
    tags: ["route_map_urban", "nagasaki_bus", "60_lines", "tram_complement", "1939"],
    source: "manual",
  },
  {
    slug: "saihi-bus-sasebo",
    category: "transport",
    sub_type: "area_access_guide",
    title_zh: "西肥バス(佐世保エリア大手・九十九島+HTB+平戸アクセス・市内+市町間+佐世保駅 hub)",
    title_ja: "西肥自動車",
    romaji: "Saihi Bus",
    summary_zh: "**西肥バスは佐世保+ 県北部の主要バス会社**(西肥自動車・1907 創業)。佐世保駅前バスセンターを hub に、九十九島(パールシー)+HTB+平戸+佐々町+小佐々町を結ぶ。HTB-佐世保駅 30 分(¥430)+ 平戸口-佐世保 60 分等の観光連絡 + 市内路線。長距離高速バス(博多+福岡空港)も運行、佐世保観光の必須交通。",
    content_md: "- 運営:西肥自動車(株)・1907 創業\n- 主要 hub:佐世保駅前バスセンター\n- 観光連絡:九十九島パールシー(¥260・25 分)+ HTB(¥430・30 分)+ 平戸口(¥1180・60 分)\n- 市町間連絡:佐々町+ 小佐々町+ 佐世保市内全域\n- 高速バス:佐世保-福岡(¥2570・2 時間)+ 佐世保-福岡空港(¥2570)\n- 運賃:¥150-$1180(区間制)\n- IC カード:nimoca + SUGOCA + Suica 全国対応\n- 1 日乗車券:佐世保市内 ¥600(観光客向け)\n- 営業時間:5:30-23:00\n- 注意:夜間+早朝便少ない・タクシー併用必要",
    region: "kyushu",
    prefecture_ja: "長崎県",
    gun_ja: null,
    municipality_ja: "佐世保市",
    lg_code: "42202",
    area_types: ["transit_hub"],
    lat: 33.1597,
    lon: 129.7236,
    season_start: null,
    season_end: null,
    event_start: null,
    event_end: null,
    price_tier: 1,
    booking_window_days: null,
    closed_days: [],
    external_urls: {},
    tags: ["area_access_guide", "saihi_bus", "1907", "sasebo_kujukushima", "htb_hirado"],
    source: "manual",
  },
  {
    slug: "nagasaki-highway-bus-fukuoka",
    category: "transport",
    sub_type: "area_access_guide",
    title_zh: "九州号高速バス(長崎-福岡・西鉄+九州急行+JR バス・所要 2h25m・¥2900・1 日 30 往復)",
    title_ja: "九州号高速バス",
    romaji: "Kyushu Go Highway Bus",
    summary_zh: "**九州号は長崎-福岡の主力高速バス**(西鉄バス+九州急行バス+JR 九州バス共同運行)。**所要 2 時間 25 分・¥2900・1 日 30 往復(早朝-深夜)**。新幹線(¥6050・1h20m)より約半額・1 時間遅、夜行便(深夜 2 便)もあり LCC 利用者に人気。長崎駅前+ 中央橋+ 大波止+ 浦上駅前の各停留所、福岡側は天神+ 博多駅+ 福岡空港。",
    content_md: "- 共同運行:西鉄バス+ 九州急行バス+ JR 九州バス\n- 所要:2 時間 25 分(高速ノンストップ)\n- 料金:¥2900(片道)+ 往復 ¥5400\n- 1 日本数:30 往復(早朝 5:30-深夜 23:50)\n- 夜行便:深夜 2 便(0:30 + 1:30 出発)\n- 長崎側停留所:長崎駅前+ 中央橋+ 大波止+ 浦上駅前\n- 福岡側停留所:天神高速バスターミナル+ 博多バスターミナル+ 福岡空港(国内+国際)\n- 比較:新幹線 ¥6050・1h20m vs 高速バス ¥2900・2h25m\n- 予約:電話 + ネット(www.atbus-de.com)+ 当日窓口可\n- 利点:福岡空港直結(国際線含む)・空港便の長距離乗車割安",
    region: "kyushu",
    prefecture_ja: "長崎県",
    gun_ja: null,
    municipality_ja: "長崎市",
    lg_code: "42201",
    area_types: ["transit_hub"],
    lat: 32.7536,
    lon: 129.8717,
    season_start: null,
    season_end: null,
    event_start: null,
    event_end: null,
    price_tier: 2,
    booking_window_days: 30,
    closed_days: [],
    external_urls: { official: "https://www.atbus-de.com/" },
    tags: ["area_access_guide", "kyushu_go", "30_round_trips", "2900yen_2h25m", "fukuoka_airport"],
    source: "manual",
  },

  // ════════════════════════════════════════════════════════════════════
  // Phase G — 道路・橋(3 筆)
  // ════════════════════════════════════════════════════════════════════
  {
    slug: "nagasaki-expressway",
    category: "transport",
    sub_type: "rental_car_tips",
    title_zh: "長崎自動車道(鳥栖 JCT-長崎 IC・130 km・1990 全通・諫早 IC + 長崎多良見 IC + 長崎芒塚 IC)",
    title_ja: "長崎自動車道",
    romaji: "Nagasaki Doh",
    summary_zh: "**長崎自動車道は九州自動車道(鳥栖 JCT)から長崎までの高速道路**(全長 130 km・1990 全通)。佐賀県内通過後、武雄北方 IC 経由で長崎県突入、東そのぎ IC + 諫早 IC + 長崎多良見 IC + 長崎芒塚 IC で県内をカバー。レンタカーでの観光に必須、福岡から長崎まで 2 時間程度。HTB+ 長崎市内+ 雲仙の移動に重要。",
    content_md: "- 全通:1990 年(平成 2)\n- 全長:130 km(鳥栖 JCT-長崎 IC)\n- 県内 IC:東そのぎ IC + 大村 IC + 諫早 IC + 長崎多良見 IC + 長崎芒塚 IC + 長崎 IC\n- 接続:九州自動車道(鳥栖 JCT)+ 西九州自動車道(武雄 JCT)\n- 制限速度:80-100 km/h\n- 料金(普通車):福岡-長崎 ¥3950(ETC ¥3300)\n- 所要:福岡-長崎 約 2 時間\n- レンタカー:長崎駅前+ 長崎空港+ HTB 駅前で手配可\n- 観光連絡:HTB(東そのぎ IC 5 分)+ 長崎市内(長崎芒塚 IC 10 分)+ 雲仙(諫早 IC 30 分)+ 大村空港(大村 IC 5 分)\n- 注意:冬季雪+ 凍結注意(2 月)",
    region: "kyushu",
    prefecture_ja: "長崎県",
    gun_ja: null,
    municipality_ja: "長崎市",
    lg_code: "42201",
    area_types: ["road_route"],
    lat: 32.7558,
    lon: 129.8964,
    season_start: null,
    season_end: null,
    event_start: null,
    event_end: null,
    price_tier: 2,
    booking_window_days: null,
    closed_days: [],
    external_urls: { official: "https://www.w-nexco.co.jp/" },
    tags: ["rental_car_tips", "nagasaki_expressway", "1990", "130km", "9_ic"],
    source: "manual",
  },
  {
    slug: "hirado-ohashi-1977",
    category: "transport",
    sub_type: "rental_car_tips",
    title_zh: "平戸大橋(1977 開通・全長 665m・平戸島連絡・1977 まで離島 → 連結化・桜+夕陽の名所)",
    title_ja: "平戸大橋",
    romaji: "Hirado Ohashi",
    summary_zh: "**平戸大橋は平戸島と九州本土を結ぶ吊橋**(平戸市・1977 開通・全長 665 m)。1977 年完成までは平戸島は離島で渡し船のみ、開通で本土と完全連結化された記念碑的橋。深紅の塗装+ 平戸瀬戸の急流+ 桜並木(田平公園) + 夕陽の名所として観光地化、車+ 徒歩で渡れる。",
    content_md: "- 開通:1977 年(昭和 52)4 月 4 日\n- 全長:665 m(吊橋部分 465 m)\n- 連絡:平戸島(平戸市) ↔ 九州本土(田平町)\n- 構造:斜張橋(吊橋)・主塔高 100 m\n- 通行:車道(無料 1992 年から)+ 歩道\n- 制限速度:60 km/h\n- 観光要素:深紅塗装+ 平戸瀬戸急流+ 田平公園桜+ 夕陽\n- 隣接観光:平戸城+ 平戸オランダ商館+ 田平天主堂(国重文)\n- 撮影スポット:川内港地区+ 田平公園+ 平戸大橋公園\n- アクセス:松浦鉄道 たびら平戸口駅 徒歩 5 分(田平側)",
    region: "kyushu",
    prefecture_ja: "長崎県",
    gun_ja: null,
    municipality_ja: "平戸市",
    lg_code: "42207",
    area_types: ["road_route", "scenic_spot"],
    lat: 33.3614,
    lon: 129.5697,
    season_start: null,
    season_end: null,
    event_start: null,
    event_end: null,
    price_tier: 1,
    booking_window_days: null,
    closed_days: [],
    external_urls: { official: "https://www.city.hirado.nagasaki.jp/kanko/" },
    tags: ["rental_car_tips", "hirado_ohashi", "1977", "665m", "former_isolated_island"],
    source: "manual",
  },
  {
    slug: "iojima-ohashi-2011",
    category: "transport",
    sub_type: "rental_car_tips",
    title_zh: "伊王島大橋(2011 開通・全長 876m・長崎市離島伊王島連結・i+Land リゾート急成長要因)",
    title_ja: "伊王島大橋",
    romaji: "Iojima Ohashi",
    summary_zh: "**伊王島大橋は長崎市離島の伊王島と本土を結ぶ橋**(2011 開通・全長 876 m)。架橋まで連絡船のみだった伊王島が車 30 分の身近な離島へ変身、**i+Land NAGASAKI(リゾート)** 急成長の最大要因。橋上から長崎港+ 軍艦島方向の絶景、徒歩+ 自転車も通行可。",
    content_md: "- 開通:2011 年(平成 23)3 月 27 日\n- 全長:876 m(主橋 326 m)\n- 構造:斜張橋\n- 連絡:伊王島町(長崎市)↔ 香焼町(長崎市本土側)\n- 通行料:無料\n- 通行:車+ 徒歩+ 自転車可\n- 影響:伊王島が車 30 分の身近な離島化 → i+Land NAGASAKI リゾート急成長\n- 撮影:橋上から長崎港+ 軍艦島(端島)方向\n- 隣接観光:i+Land NAGASAKI(温泉+ ビーチ+ アイランドルミナス)+ 伊王島灯台\n- アクセス:長崎駅 から バス 50 分・伊王島下車・徒歩 / レンタカー 30 分",
    region: "kyushu",
    prefecture_ja: "長崎県",
    gun_ja: null,
    municipality_ja: "長崎市",
    lg_code: "42201",
    area_types: ["road_route"],
    lat: 32.6830,
    lon: 129.7800,
    season_start: null,
    season_end: null,
    event_start: null,
    event_end: null,
    price_tier: 1,
    booking_window_days: null,
    closed_days: [],
    external_urls: {},
    tags: ["rental_car_tips", "iojima_ohashi", "2011", "876m", "iland_resort_catalyst"],
    source: "manual",
  },

  // ════════════════════════════════════════════════════════════════════
  // Phase H — 乗車券 + レンタカー(2 筆)
  // ════════════════════════════════════════════════════════════════════
  {
    slug: "nagasaki-tram-1day-pass",
    category: "transport",
    sub_type: "ticket_promo",
    title_zh: "長崎電気軌道 1 日乗車券(¥600・5 系統乗り放題・主要観光地カバー・観光案内所+電停で販売)",
    title_ja: "長崎電気軌道 1 日乗車券",
    romaji: "Nagasaki Densha 1 Day Pass",
    summary_zh: "**長崎電気軌道 1 日乗車券は観光客の必須アイテム**(¥600・5 系統乗り放題)。1 回 ¥140 × 5 回以上で元取り、5 系統で主要観光地(出島+ 中華街+ 大浦天主堂+ 平和公園+ 諏訪神社+ 浜の町)全カバー。長崎駅観光案内所+ 主要電停+ 駅前商業施設で販売。スマホアプリ版「長崎スマホ Pass」(¥800・電車+バス共通)も人気。",
    content_md: "- 料金:大人 ¥600・小学生 ¥300(2024-12 改定)\n- 利用範囲:全 5 系統乗り放題\n- 元取り:1 日 5 回以上乗車で得\n- 販売所:長崎駅観光案内所+ 主要電停(築町+ 観光通り+ 平和公園 等)+ ホテル+ 駅前商業施設\n- 通常運賃:1 回 ¥140 均一\n- スマホ Pass:長崎電気軌道+長崎バス共通 ¥800\n- 観光カバー:出島+ 中華街+ 大浦天主堂+ グラバー園+ 平和公園+ 浦上+ 諏訪神社+ 浜の町\n- 営業時間:5:30-23:30(電車運行時間)\n- 推奨周遊:長崎駅前 → 出島 → 大浦天主堂 → グラバー園 → 浜の町 → 平和公園 → 諏訪神社 → 駅前\n- 注意:1 日券は使用日のみ有効・購入日刻印",
    region: "kyushu",
    prefecture_ja: "長崎県",
    gun_ja: null,
    municipality_ja: "長崎市",
    lg_code: "42201",
    area_types: ["transit_hub"],
    lat: 32.7536,
    lon: 129.8717,
    season_start: null,
    season_end: null,
    event_start: null,
    event_end: null,
    price_tier: 1,
    booking_window_days: null,
    closed_days: [],
    external_urls: { official: "https://www.naga-den.com/publics/index/35/" },
    tags: ["ticket_promo", "1day_pass", "600yen", "5_lines", "smartphone_app"],
    source: "manual",
  },
  {
    slug: "nagasaki-rental-car-area",
    category: "transport",
    sub_type: "rental_car_tips",
    title_zh: "長崎県レンタカー戦略(離島+ 山間部レンタカー必須・長崎駅前+ 長崎空港+ 五島対馬空港 hub)",
    title_ja: "長崎県レンタカー",
    romaji: "Nagasaki Rental Car",
    summary_zh: "**長崎県は離島+ 山間部観光でレンタカーがほぼ必須**。長崎市内は路面電車+ バスで完結、しかし**雲仙+ 平戸+ 五島(福江島)+ 対馬+ 壱岐**は公共交通粗で車推奨。**長崎駅前+ 長崎空港+ 福江空港+ 対馬空港+ 壱岐空港** に主要レンタカー店(トヨタ+ 日産+ ニッポン+ オリックス)立地、離島は早期予約必須(夏ピーク不足)。",
    content_md: "- 必須エリア:雲仙+ 平戸+ 五島(福江島)+ 対馬+ 壱岐\n- 不要エリア:長崎市内(路面電車+ バスで完結)+ 佐世保市内\n- 主要 hub:長崎駅前+ 長崎空港+ 福江空港+ 対馬空港+ 壱岐空港+ HTB 駅前\n- 主要会社:トヨタレンタカー+ 日産レンタカー+ ニッポンレンタカー+ オリックスレンタカー+ タイムズレンタカー\n- 料金目安:軽自動車 1 日 ¥5000-+ コンパクト 1 日 ¥6500-+ ガソリン代 別\n- 離島料金:本土比 1.5-2 倍(車輸送代含)\n- 早期予約:夏ピーク(7-9 月) 1 ヶ月前必須(離島は不足リスク高)\n- ハイブリッド推奨:山間部(雲仙)+ 離島(燃料効率)\n- 注意:対馬+ 五島は雪+ 凍結区間有(冬・1-2 月)\n- 国際免許:必要(海外免許の人)",
    region: "kyushu",
    prefecture_ja: "長崎県",
    gun_ja: null,
    municipality_ja: "長崎市",
    lg_code: "42201",
    area_types: ["transit_hub"],
    lat: 32.7536,
    lon: 129.8717,
    season_start: null,
    season_end: null,
    event_start: null,
    event_end: null,
    price_tier: 3,
    booking_window_days: 30,
    closed_days: [],
    external_urls: {},
    tags: ["rental_car_tips", "island_essential", "5_airports_hub", "summer_book_early", "nagasaki_unzen_hirado_goto"],
    source: "manual",
  },
];

async function main() {
  if (rows.length === 0) {
    console.log("[nagasaki-transport] 尚無條目");
    return;
  }
  console.log(`[nagasaki-transport] ${rows.length} 筆 ${DRY ? "(dry-run)" : ""}`);
  if (DRY) {
    const bySub = new Map<string, number>();
    for (const r of rows) bySub.set(r.sub_type, (bySub.get(r.sub_type) ?? 0) + 1);
    for (const [k, v] of [...bySub.entries()].sort()) {
      console.log(`  ${k.padEnd(36)} ${v}`);
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
      console.error("[nagasaki-transport] upsert failed:", error);
      process.exit(1);
    }
    written += batch.length;
    process.stdout.write(`\r[nagasaki-transport] upsert: ${written}/${rows.length}`);
  }
  process.stdout.write("\n");
  console.log(`[nagasaki-transport] Done — ${written} rows.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

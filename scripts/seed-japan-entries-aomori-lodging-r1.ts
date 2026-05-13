// Seed 青森県 住 R1(20 筆 / Sprint 1.3)
//
// 八甲田秘湯 4 / 浅虫+大鰐 3 / 黒石温泉郷 2 / 下北温泉 2 / 海岸温泉 2 /
// 十和田 2 / 都市ホテル 3 / 民宿+山ロッジ 2 = 20
//
// sub_type +8:aomori_hakkoda_onsen / aomori_asamushi_owani_onsen /
// aomori_kuroishi_onsen / aomori_shimokita_onsen / aomori_coastal_onsen /
// aomori_towada_lodge / aomori_city_hotel / aomori_minshuku

import { config as loadEnv } from "dotenv";
loadEnv({ path: ".env.local" });

import { createAdminClient } from "../src/lib/supabase/admin";

const DRY = process.argv.includes("--dry-run");

interface SeedRow {
  slug: string;
  category: "lodging";
  sub_type: string;
  title_zh: string;
  title_ja: string | null;
  romaji: string | null;
  summary_zh: string;
  content_md: string | null;
  region: "tohoku";
  prefecture_ja: "青森県";
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
  // 八甲田秘湯 (4) — 国民保養温泉地第 1 号 + 青森三大秘湯
  // ════════════════════════════════════════════════════════════════════
  {
    slug: "sukayu-onsen-hakkoda",
    category: "lodging",
    sub_type: "aomori_hakkoda_onsen",
    title_zh: "酸ヶ湯温泉旅館(八甲田・1684 開湯 341 年+ 国民保養温泉地第 1 号 1954+ 千人風呂(混浴ヒバ千人風呂・160 畳大浴槽)+ pH 1.7 強酸性硫黄泉+ 標高 925m)",
    title_ja: "酸ヶ湯温泉旅館",
    romaji: "Sukayu Onsen",
    summary_zh: "**酸ヶ湯温泉是青森代表秘湯**(青森市八甲田・**1684 開湯 341 年・国民保養温泉地第 1 号 1954**)。**ヒバ千人風呂(160 畳混浴大浴槽・80 人同時入浴可)+ pH 1.7 強酸性硫黄泉 + 標高 925m**、八甲田登山+冬樹氷観賞 拠点、湯治宿として 17 世紀から繁盛、現代も湯治連泊客多数。",
    content_md: "- 立地:**青森市荒川南荒川山国有林酸湯沢 50**(標高 925m・八甲田中腹)\n- 開湯:**1684 年・341 年**\n- 認定:**国民保養温泉地第 1 号 1954**(全国 79 ヶ所中の最初)\n- 名物:**ヒバ千人風呂**(160 畳・混浴・80 人同時入浴可)\n- 泉質:**pH 1.7 強酸性硫黄泉**(神経痛+ 皮膚病効能)\n- 並列観光:**八甲田ロープウェー(冬樹氷)+ 八甲田大岳登山**\n- アクセス:JR 青森駅 → JR バス十和田北 約 70 分\n- 価格:1 泊 2 食 ¥12,000-22,000",
    region: "tohoku",
    prefecture_ja: "青森県",
    gun_ja: null,
    municipality_ja: "青森市",
    lg_code: "02201",
    area_types: ["onsen_field", "mountain_village"],
    lat: 40.6586,
    lon: 140.8514,
    season_start: null,
    season_end: null,
    event_start: null,
    event_end: null,
    price_tier: 3,
    booking_window_days: 60,
    closed_days: [],
    external_urls: { official: "https://www.sukayu.jp/" },
    tags: ["sukayu", "1684", "national_health_spa_no1", "sennin_buro", "ph_1_7"],
    source: "manual",
  },
  {
    slug: "tsuta-onsen-oirase",
    category: "lodging",
    sub_type: "aomori_hakkoda_onsen",
    title_zh: "蔦温泉旅館(十和田市奥入瀬+ 1147 開湯 878 年+ 大町桂月終焉地 1925+ 「久安の湯」源泉湧出+ 蔦沼紅葉名所+ 一軒宿秘湯)",
    title_ja: "蔦温泉旅館",
    romaji: "Tsuta Onsen",
    summary_zh: "**蔦温泉旅館是奥入瀬の一軒宿秘湯**(十和田市・**1147 開湯 878 年・東北最古級**)。**大町桂月(明治詩人・「酒と温泉の歌人」)1925 終焉地**、**「久安の湯」源泉が浴槽底から直接湧出**(全国希少)、本館 1918 建築の木造旅館、蔦沼(秋紅葉名所)徒歩 5 分。",
    content_md: "- 立地:**十和田市奥瀬蔦野湯 1**(奥入瀬 + 蔦沼隣接)\n- 開湯:**1147 年(平安末期)・878 年・東北最古級**\n- 文学史:**大町桂月 終焉地 1925 年**(蔦温泉に永住・本館に記念室)\n- 名物:**「久安の湯」源泉浴槽底湧出**(全国希少)\n- 並列観光:**蔦沼(秋紅葉名所)+ 奥入瀬渓流 + 十和田湖**\n- アクセス:JR 八戸駅 → JR バスみずうみ号 約 80 分\n- 価格:1 泊 2 食 ¥18,000-35,000",
    region: "tohoku",
    prefecture_ja: "青森県",
    gun_ja: null,
    municipality_ja: "十和田市",
    lg_code: "02206",
    area_types: ["onsen_field", "scenic_spot"],
    lat: 40.5158,
    lon: 140.9572,
    season_start: null,
    season_end: null,
    event_start: null,
    event_end: null,
    price_tier: 4,
    booking_window_days: 60,
    closed_days: [],
    external_urls: { official: "https://www.tsutaonsen.com/" },
    tags: ["tsuta_onsen", "1147", "ohmachi_keigetsu_1925", "kyuan_no_yu"],
    source: "manual",
  },
  {
    slug: "yachi-onsen-hakkoda",
    category: "lodging",
    sub_type: "aomori_hakkoda_onsen",
    title_zh: "谷地温泉(十和田市+ 開湯 400 年+ 青森三大秘湯+ 上下 2 段独立浴槽 38 + 42℃ 二色併浴+ 一軒宿+ 八甲田南麓)",
    title_ja: "谷地温泉",
    romaji: "Yachi Onsen",
    summary_zh: "**谷地温泉是青森三大秘湯**(十和田市・**開湯 400 年・八甲田南麓**)。**酸ヶ湯+蔦温泉+谷地温泉=青森三大秘湯**、**上下 2 段の独立浴槽が珍しく上 38℃ 下 42℃ で二色併浴**、白濁硫黄泉、一軒宿の秘湯らしさで湯治+登山客に愛され、八甲田登山+奥入瀬+十和田湖と組合せ可。",
    content_md: "- 立地:**十和田市法量谷地 1**(八甲田南麓・標高 720m)\n- 開湯:**400 年前**\n- 認定:**青森三大秘湯**(酸ヶ湯 + 蔦温泉 + 谷地温泉)\n- 名物:**上下 2 段浴槽**(上 38℃ぬる湯 + 下 42℃あつ湯・併浴)\n- 泉質:白濁硫黄泉(高血圧 + 神経痛)\n- 並列観光:**八甲田登山 + 奥入瀬 + 十和田湖** 拠点\n- アクセス:JR 八戸駅 → JR バスみずうみ号 約 70 分\n- 価格:1 泊 2 食 ¥10,500-15,000",
    region: "tohoku",
    prefecture_ja: "青森県",
    gun_ja: null,
    municipality_ja: "十和田市",
    lg_code: "02206",
    area_types: ["onsen_field", "mountain_village"],
    lat: 40.6175,
    lon: 140.9225,
    season_start: null,
    season_end: null,
    event_start: null,
    event_end: null,
    price_tier: 3,
    booking_window_days: 60,
    closed_days: [],
    external_urls: { official: "https://yachionsen.com/" },
    tags: ["yachi_onsen", "aomori_3_hito", "2_layer_bath", "400_years"],
    source: "manual",
  },
  {
    slug: "hakkoda-hotel-aomori",
    category: "lodging",
    sub_type: "aomori_hakkoda_onsen",
    title_zh: "八甲田ホテル(青森市八甲田・1995 開業+ 八甲田ロープウェー麓+ 八甲田登山+ 樹氷観賞 拠点+ ヨーロピアン木造ホテル+ 100% 源泉掛け流し)",
    title_ja: "八甲田ホテル",
    romaji: "Hakkōda Hotel",
    summary_zh: "**八甲田ホテルは八甲田登山+樹氷観賞拠点**(青森市八甲田・**1995 開業 30 年・八甲田ロープウェー山麓駅徒歩 1 分**)。**ヨーロピアン木造ホテル + 100% 源泉掛け流し + 全室バス付**、酸ヶ湯のような秘湯ではなく現代ホテル設備、冬の樹氷ツアー+夏の八甲田登山と組合せ最便利。",
    content_md: "- 立地:**青森市荒川字南荒川山国有林酸湯沢国有林内**(八甲田ロープウェー山麓駅徒歩 1 分)\n- 開業:**1995 年・30 年**\n- 規模:**全 73 室**(全室バス付・洋室+和室)\n- 温泉:**100% 源泉掛け流し**(露天 + 内湯 + 大理石風呂)\n- 並列観光:**八甲田ロープウェー(樹氷観賞)+ 八甲田大岳登山**\n- 並列宿:R1 住 酸ヶ湯 = 秘湯系 / 八甲田ホテル = 現代ホテル系 と差別化\n- 価格:1 泊 2 食 ¥18,000-35,000",
    region: "tohoku",
    prefecture_ja: "青森県",
    gun_ja: null,
    municipality_ja: "青森市",
    lg_code: "02201",
    area_types: ["onsen_field", "mountain_village"],
    lat: 40.6644,
    lon: 140.8567,
    season_start: null,
    season_end: null,
    event_start: null,
    event_end: null,
    price_tier: 4,
    booking_window_days: 60,
    closed_days: [],
    external_urls: { official: "https://www.hakkodahotel.co.jp/" },
    tags: ["hakkoda_hotel", "1995", "ropeway_base", "european_wood"],
    source: "manual",
  },

  // ════════════════════════════════════════════════════════════════════
  // 浅虫+大鰐 (3) — 津軽奥座敷+津軽藩主湯治場
  // ════════════════════════════════════════════════════════════════════
  {
    slug: "asamushi-onsen-overview",
    category: "lodging",
    sub_type: "aomori_asamushi_owani_onsen",
    title_zh: "浅虫温泉郷(青森市浅虫・1190 開湯 835 年+ 「青森の奥座敷」+ 青森湾沿岸+ 青い森鉄道浅虫温泉駅徒歩+ 14 軒旅館 + 海水浴+水族館組合せ)",
    title_ja: "浅虫温泉",
    romaji: "Asamushi Onsen",
    summary_zh: "**浅虫温泉是青森奥座敷**(青森市浅虫・**1190 開湯 835 年・円光大師伝説**)。**青森駅から青い森鉄道 25 分で「浅虫温泉駅」直結**、**青森湾沿岸 + 浅虫水族館徒歩 + 海水浴場 + 14 軒旅館**、青森市内観光と組合せ最便利の温泉地、椿館 1925 創業 100 年が代表老舗。",
    content_md: "- 立地:**青森市浅虫**(青森湾沿岸 + 青森市東 17km)\n- 開湯:**1190 年・835 年**(円光大師伝説)\n- アクセス:**青い森鉄道 浅虫温泉駅徒歩**(青森駅から 25 分・¥320)\n- 規模:**14 軒旅館** + 共同浴場 4 軒\n- 並列観光:**浅虫水族館** + **海水浴場(夏)** + 椿山(展望)\n- 代表老舗:**椿館 1925 創業 100 年**(浅虫最大級)\n- 価格:1 泊 2 食 ¥10,000-25,000",
    region: "tohoku",
    prefecture_ja: "青森県",
    gun_ja: null,
    municipality_ja: "青森市",
    lg_code: "02201",
    area_types: ["onsen_field", "coastal"],
    lat: 40.8919,
    lon: 140.8589,
    season_start: null,
    season_end: null,
    event_start: null,
    event_end: null,
    price_tier: 3,
    booking_window_days: 60,
    closed_days: [],
    external_urls: { official: "https://www.asamushi.com/" },
    tags: ["asamushi", "1190", "aomori_okuzashiki", "14_ryokans"],
    source: "manual",
  },
  {
    slug: "tsubaki-kan-asamushi",
    category: "lodging",
    sub_type: "aomori_asamushi_owani_onsen",
    title_zh: "椿館(浅虫温泉・1925 創業 100 年+ 浅虫最大級老舗旅館+ 全 96 室+ 大浴場 + 露天 + 青森湾望み+ 青い森鉄道浅虫温泉駅徒歩 5 分)",
    title_ja: "椿館",
    romaji: "Tsubaki-kan",
    summary_zh: "**椿館是浅虫温泉最大級老舗旅館**(青森市浅虫・**1925 創業 100 年**)。**全 96 室・大浴場 + 露天 + 青森湾望み + 大宴会場**、椿の湯 + 屋上展望露天が名物、椿の名前は浅虫椿山由来、家族+ 団体客に対応大型旅館、青い森鉄道 浅虫温泉駅 徒歩 5 分。",
    content_md: "- 立地:**青森市浅虫蛍谷 31**(浅虫温泉駅 徒歩 5 分)\n- 創業:**1925 年・100 年**\n- 規模:**全 96 室**(和室 + 和洋室 + 大宴会場)\n- 温泉:**大浴場 + 屋上展望露天 (青森湾望み)**\n- 並列観光:**浅虫水族館 + 海水浴場 (夏) + 椿山ハイキング**\n- 価格:1 泊 2 食 ¥13,000-25,000",
    region: "tohoku",
    prefecture_ja: "青森県",
    gun_ja: null,
    municipality_ja: "青森市",
    lg_code: "02201",
    area_types: ["onsen_field", "coastal"],
    lat: 40.8923,
    lon: 140.8581,
    season_start: null,
    season_end: null,
    event_start: null,
    event_end: null,
    price_tier: 3,
    booking_window_days: 60,
    closed_days: [],
    external_urls: { official: "https://tsubakikan.co.jp/" },
    tags: ["tsubaki_kan", "1925", "asamushi_largest"],
    source: "manual",
  },
  {
    slug: "owani-onsen-overview",
    category: "lodging",
    sub_type: "aomori_asamushi_owani_onsen",
    title_zh: "大鰐温泉郷(南津軽郡大鰐町・1190 開湯 835 年+ 津軽藩主湯治場+ 大鰐スキー場+ もやしラーメン名物+ JR 奥羽本線大鰐温泉駅 + 弘南鉄道大鰐駅)",
    title_ja: "大鰐温泉",
    romaji: "Ōwani Onsen",
    summary_zh: "**大鰐温泉是津軽藩主湯治場由来の歴史温泉**(南津軽郡大鰐町・**1190 開湯 835 年**)。**津軽 4 代藩主信政の湯治場**、**冬は大鰐温泉スキー場 (1990 開業)・夏は大鰐もやしラーメン名物**、JR 奥羽本線「大鰐温泉駅」+ 弘南鉄道「大鰐駅」直結、弘前から 1 駅 13 分。",
    content_md: "- 立地:**南津軽郡大鰐町**(弘前市から JR 13 分)\n- 開湯:**1190 年・835 年**(津軽藩主信政の湯治場由来)\n- アクセス:**JR 奥羽本線 大鰐温泉駅 + 弘南鉄道 大鰐駅**(弘前から 13 分)\n- 冬:**大鰐温泉スキー場 1990 開業**\n- 名物:**大鰐温泉もやし**(温泉熱で栽培の伝統もやし・350+ 年)\n- 規模:**12 軒旅館** + 共同浴場\n- 並列:R1 住 浅虫 + 大鰐 = 津軽奥座敷 2 大\n- 価格:1 泊 2 食 ¥9,500-22,000",
    region: "tohoku",
    prefecture_ja: "青森県",
    gun_ja: "南津軽郡",
    municipality_ja: "大鰐町",
    lg_code: "02362",
    area_types: ["onsen_field"],
    lat: 40.5217,
    lon: 140.5839,
    season_start: null,
    season_end: null,
    event_start: null,
    event_end: null,
    price_tier: 3,
    booking_window_days: 60,
    closed_days: [],
    external_urls: {},
    tags: ["owani_onsen", "1190", "tsugaru_han_yujiba", "moyashi_350_years"],
    source: "manual",
  },

  // ════════════════════════════════════════════════════════════════════
  // 黒石温泉郷 (2) — 4 湯+青荷ランプの宿
  // ════════════════════════════════════════════════════════════════════
  {
    slug: "kuroishi-onsen-kyo",
    category: "lodging",
    sub_type: "aomori_kuroishi_onsen",
    title_zh: "黒石温泉郷(黒石市・温湯+板留+落合+青荷 4 湯総称+ 江戸期黒石津軽家湯治場+ 中町こみせ通り重要伝統的建造物群保存地区組合せ)",
    title_ja: "黒石温泉郷",
    romaji: "Kuroishi Onsen-kyō",
    summary_zh: "**黒石温泉郷是津軽中央山間の 4 湯総称**(黒石市・**温湯 + 板留 + 落合 + 青荷 4 湯**)。**江戸期 黒石津軽家湯治場 + 庶民共同浴場 + 1 軒宿秘湯**、4 湯それぞれに性格(板留=共同湯文化+落合=家族向け+青荷=ランプ宿)、**黒石中町こみせ通り(重伝建)**観光と組合せ可、弘南鉄道弘南線で弘前から 30 分。",
    content_md: "- 立地:**黒石市内 4 湯**(温湯 + 板留 + 落合 + 青荷)\n- 起源:**江戸期 黒石津軽家湯治場**\n- 4 湯性格:\n  - **温湯(ぬるゆ)**:共同浴場文化・湯治宿が共同湯利用\n  - **板留(いたどめ)**:家族向け宿\n  - **落合(おちあい)**:中規模旅館\n  - **青荷(あおに)**:ランプの宿(電気なし秘湯・1929 開業)\n- 並列観光:**黒石中町こみせ通り**(国重要伝統的建造物群保存地区 2005)\n- アクセス:弘南鉄道弘南線 黒石駅 → 各湯バス\n- 価格:1 泊 2 食 ¥9,500-18,000",
    region: "tohoku",
    prefecture_ja: "青森県",
    gun_ja: null,
    municipality_ja: "黒石市",
    lg_code: "02204",
    area_types: ["onsen_field", "historic_district"],
    lat: 40.6431,
    lon: 140.5867,
    season_start: null,
    season_end: null,
    event_start: null,
    event_end: null,
    price_tier: 2,
    booking_window_days: 30,
    closed_days: [],
    external_urls: {},
    tags: ["kuroishi_onsen_kyo", "4_yu", "kuroishi_tsugaru_han"],
    source: "manual",
  },
  {
    slug: "aoni-onsen-lamp",
    category: "lodging",
    sub_type: "aomori_kuroishi_onsen",
    title_zh: "青荷温泉 ランプの宿(黒石市青荷・1929 開業 96 年+ 電気なし全館ランプ照明+ 青森三大秘湯候補+ 山中一軒宿+ 11 月-3 月雪深い秘湯+ 携帯圏外)",
    title_ja: "青荷温泉",
    romaji: "Aoni Onsen",
    summary_zh: "**青荷温泉「ランプの宿」是電気なし全館ランプ照明の伝説秘湯**(黒石市青荷・**1929 開業 96 年・現代も電気なし**)。**山中一軒宿 + 全室+食堂+脱衣場 ランプ照明 + 携帯圏外 + 11 月-3 月豪雪期は送迎雪上車**、青森秘湯の代表的存在、要事前予約 (繁忙期 2-3 ヶ月前)。",
    content_md: "- 立地:**黒石市沖浦字青荷沢滝の上 1-7**(山中一軒宿)\n- 開業:**1929 年・96 年**(2025 現在電気なし)\n- 特色:**全館ランプ照明 + 携帯圏外 + テレビなし**\n- 浴場:**4 つの浴場**(本館内湯 + 健六の湯 + 滝見の湯 + 露天)\n- 冬期:**11 月-3 月雪上車送迎**(個人車不可)\n- 予約:**2-3 ヶ月前推奨**(繁忙期早期満員)\n- アクセス:弘南鉄道 黒石駅 → 弘南バス 約 50 分 + 旅館送迎\n- 価格:1 泊 2 食 ¥12,500-18,000",
    region: "tohoku",
    prefecture_ja: "青森県",
    gun_ja: null,
    municipality_ja: "黒石市",
    lg_code: "02204",
    area_types: ["onsen_field", "mountain_village"],
    lat: 40.6731,
    lon: 140.6519,
    season_start: null,
    season_end: null,
    event_start: null,
    event_end: null,
    price_tier: 3,
    booking_window_days: 90,
    closed_days: [],
    external_urls: { official: "https://www.aoni.jp/" },
    tags: ["aoni_lamp_yado", "1929", "no_electricity", "secret_hot_spring"],
    source: "manual",
  },

  // ════════════════════════════════════════════════════════════════════
  // 下北温泉 (2) — 本州最北温泉郷+薬研奥薬研
  // ════════════════════════════════════════════════════════════════════
  {
    slug: "shimofuro-onsen-shimokita",
    category: "lodging",
    sub_type: "aomori_shimokita_onsen",
    title_zh: "下風呂温泉郷(下北郡風間浦村・本州最北温泉郷+ 室町期 1452 開湯記録+ 共同浴場「大湯」「新湯」2 軒+ 津軽海峡望み + 大間鮪+下北観光中継+ 5 軒旅館)",
    title_ja: "下風呂温泉",
    romaji: "Shimofuro Onsen",
    summary_zh: "**下風呂温泉是本州最北温泉郷**(下北郡風間浦村・**室町期 1452 開湯記録・573 年**)。**津軽海峡望み + 5 軒旅館 + 共同浴場「大湯」「新湯」2 軒**、井上靖小説『海峡』の舞台、大間鮪+下北観光中継地、JR 大湊駅(むつ市)から下北交通バス約 60 分。",
    content_md: "- 立地:**下北郡風間浦村**(津軽海峡側・大間町手前)\n- 開湯:**室町期 1452 開湯記録・573 年**\n- 規模:**5 軒旅館 + 共同浴場 2 軒**(大湯 + 新湯)\n- 文学史:**井上靖『海峡』(1980)舞台**\n- 並列観光:**大間鮪 + 仏ヶ浦遊覧 + 恐山霊場(車 1 時間)**\n- アクセス:JR 大湊駅(むつ市) → 下北交通バス 約 60 分\n- 価格:1 泊 2 食 ¥10,000-22,000",
    region: "tohoku",
    prefecture_ja: "青森県",
    gun_ja: "下北郡",
    municipality_ja: "風間浦村",
    lg_code: "02425",
    area_types: ["onsen_field", "coastal"],
    lat: 41.4725,
    lon: 140.9772,
    season_start: null,
    season_end: null,
    event_start: null,
    event_end: null,
    price_tier: 3,
    booking_window_days: 60,
    closed_days: [],
    external_urls: {},
    tags: ["shimofuro_onsen", "1452", "honshu_northernmost_onsen", "inoue_yasushi_kaikyo"],
    source: "manual",
  },
  {
    slug: "yagen-onsen-shimokita",
    category: "lodging",
    sub_type: "aomori_shimokita_onsen",
    title_zh: "薬研温泉(むつ市大畑+奥薬研・恐山近郊+ 室町期 1450 開湯記録+ 露天「かっぱの湯」混浴無料+ 蓮華寺由来 +カッパ伝説+ 下北半島内陸秘湯)",
    title_ja: "薬研温泉",
    romaji: "Yagen Onsen",
    summary_zh: "**薬研温泉是下北半島内陸秘湯**(むつ市大畑薬研・**室町期 1450 開湯記録・575 年・恐山霊場 北 20km**)。**奥薬研の露天「かっぱの湯」混浴無料**、蓮華寺由来 + カッパ伝説、薬草効能で知られる、3-4 軒旅館 + 共同露天、下北半島の縦断ドライブ中継地、レンタカーがあると便利。",
    content_md: "- 立地:**むつ市大畑町薬研**(下北半島内陸・恐山霊場北 20km)\n- 開湯:**室町期 1450 開湯記録・575 年**\n- 名物:**「かっぱの湯」混浴露天無料**(奥薬研・自然渓流沿)\n- 由来:**蓮華寺 + カッパ伝説**\n- 規模:**3-4 軒旅館 + 共同露天**\n- 並列観光:**恐山霊場(車 30 分) + 大間崎(車 60 分) + 仏ヶ浦遊覧**\n- アクセス:**レンタカー推奨**(JR 下北駅から 40 分)\n- 価格:1 泊 2 食 ¥9,500-18,000",
    region: "tohoku",
    prefecture_ja: "青森県",
    gun_ja: null,
    municipality_ja: "むつ市",
    lg_code: "02208",
    area_types: ["onsen_field", "mountain_village"],
    lat: 41.4156,
    lon: 141.1414,
    season_start: null,
    season_end: null,
    event_start: null,
    event_end: null,
    price_tier: 2,
    booking_window_days: 30,
    closed_days: [],
    external_urls: {},
    tags: ["yagen_onsen", "1450", "kappa_no_yu", "renge_ji"],
    source: "manual",
  },

  // ════════════════════════════════════════════════════════════════════
  // 海岸温泉 (2) — 不老ふ死+古牧青森屋
  // ════════════════════════════════════════════════════════════════════
  {
    slug: "furofushi-onsen-fukaura",
    category: "lodging",
    sub_type: "aomori_coastal_onsen",
    title_zh: "黄金崎不老ふ死温泉(深浦町・1970 開業 55 年+ 日本海絶景露天+ 鉄鉱泉 茶褐色+ 五能線リゾートしらかみ + 千畳敷海岸+ 夕陽絶景)",
    title_ja: "黄金崎不老ふ死温泉",
    romaji: "Koganezaki Furōfushi Onsen",
    summary_zh: "**黄金崎不老ふ死温泉是日本海絶景露天宿**(西津軽郡深浦町・**1970 開業 55 年**)。**日本海岸壁直近の鉄鉱泉露天(茶褐色) + 夕陽絶景**、五能線リゾートしらかみ「ウェスパ椿山駅」徒歩 15 分(送迎あり)、千畳敷海岸+ 五能線旅行と組合せの代表宿。",
    content_md: "- 立地:**西津軽郡深浦町舮作下清滝 15**(日本海岸壁直近)\n- 開業:**1970 年・55 年**\n- 名物:**日本海岸壁露天 (鉄鉱泉 茶褐色) + 夕陽絶景**\n- 並列観光:**五能線リゾートしらかみ + 千畳敷海岸 + 行合崎**\n- アクセス:**JR ウェスパ椿山駅 徒歩 15 分**(送迎あり)\n- 価格:1 泊 2 食 ¥15,000-28,000",
    region: "tohoku",
    prefecture_ja: "青森県",
    gun_ja: "西津軽郡",
    municipality_ja: "深浦町",
    lg_code: "02323",
    area_types: ["onsen_field", "coastal", "scenic_spot"],
    lat: 40.6803,
    lon: 139.9181,
    season_start: null,
    season_end: null,
    event_start: null,
    event_end: null,
    price_tier: 4,
    booking_window_days: 60,
    closed_days: [],
    external_urls: { official: "https://www.furofushi.com/" },
    tags: ["furofushi", "1970", "iron_onsen", "japan_sea_sunset"],
    source: "manual",
  },
  {
    slug: "hoshino-aomoriya-misawa",
    category: "lodging",
    sub_type: "aomori_coastal_onsen",
    title_zh: "星野リゾート 青森屋(三沢市・古牧温泉発祥+ 星野リゾート 2009 引継ぎ+ 「ねぶり流し灯篭流し」演出+ ねぶた祭体験+ 青森民俗総合体験リゾート)",
    title_ja: "星野リゾート 青森屋",
    romaji: "Hoshino Aomoriya",
    summary_zh: "**星野リゾート 青森屋是青森民俗総合体験リゾート**(三沢市・**旧古牧温泉が経営破綻+ 星野リゾート 2009 引継ぎ再生**)。**「ねぶり流し灯篭流し」夜演出 + ねぶた祭体験 + 古牧温泉源泉**、青森民俗を凝縮体験できる施設、JR 三沢駅 徒歩 5 分(送迎あり)、現代家族旅行向けの完成度高い。",
    content_md: "- 立地:**三沢市古間木山 56**(JR 三沢駅 徒歩 5 分)\n- 経歴:**旧古牧温泉(1924 開湯)→ 経営破綻 → 星野リゾート 2009 再生**\n- 体験:**「ねぶり流し灯篭流し」夜演出 + ねぶた祭体験 + 津軽三味線**\n- 温泉:**古牧温泉源泉**(露天 + 大浴場)\n- 規模:**全 234 室**(大型リゾート)\n- 並列観光:**寺山修司記念館 + 三沢航空科学館 + 八甲田登山**\n- 価格:1 泊 2 食 ¥18,000-45,000",
    region: "tohoku",
    prefecture_ja: "青森県",
    gun_ja: null,
    municipality_ja: "三沢市",
    lg_code: "02207",
    area_types: ["onsen_field"],
    lat: 40.6845,
    lon: 141.3650,
    season_start: null,
    season_end: null,
    event_start: null,
    event_end: null,
    price_tier: 4,
    booking_window_days: 60,
    closed_days: [],
    external_urls: { official: "https://hoshinoresorts.com/ja/hotels/aomoriya/" },
    tags: ["hoshino_aomoriya", "furumaki_1924", "hoshino_2009", "nebuta_experience"],
    source: "manual",
  },

  // ════════════════════════════════════════════════════════════════════
  // 十和田 (2) — 奥入瀬+湖畔
  // ════════════════════════════════════════════════════════════════════
  {
    slug: "oirase-keiryu-hotel",
    category: "lodging",
    sub_type: "aomori_towada_lodge",
    title_zh: "星野リゾート 奥入瀬渓流ホテル(十和田市奥入瀬・1939 開業 86 年+ 星野リゾート 2005 引継ぎ+ 奥入瀬渓流唯一隣接ホテル+ 苔玉ロビー+ 全室温泉)",
    title_ja: "星野リゾート 奥入瀬渓流ホテル",
    romaji: "Hoshino Oirase Keiryū Hotel",
    summary_zh: "**奥入瀬渓流ホテル是奥入瀬唯一隣接ホテル**(十和田市奥瀬+ **1939 開業 86 年・星野リゾート 2005 引継ぎ**)。**苔玉巨大ロビー(国岡本太郎制作の暖炉)+ 全室温泉 + 奥入瀬渓流に窓直近**、5-11 月の渓流散策(石ヶ戸+雲井の滝+銚子大滝)拠点、冬は閉鎖期間あり、家族+カップル人気。",
    content_md: "- 立地:**十和田市奥瀬栃久保 231**(奥入瀬渓流隣接)\n- 経歴:**1939 開業・1981 西武系・2005 星野リゾート**\n- 名物:**国岡本太郎暖炉 + 苔玉巨大ロビー**\n- 全室温泉:**奥入瀬温泉源泉**(露天 + 内湯)\n- 並列観光:**奥入瀬渓流散策 (5-11 月) + 十和田湖 + 八甲田**\n- 注意:**冬期営業形態は要確認**(積雪期短縮あり)\n- アクセス:JR 八戸駅 → JR バスみずうみ号 約 110 分\n- 価格:1 泊 2 食 ¥25,000-55,000",
    region: "tohoku",
    prefecture_ja: "青森県",
    gun_ja: null,
    municipality_ja: "十和田市",
    lg_code: "02206",
    area_types: ["onsen_field", "scenic_spot"],
    lat: 40.5236,
    lon: 140.9569,
    season_start: null,
    season_end: null,
    event_start: null,
    event_end: null,
    price_tier: 4,
    booking_window_days: 60,
    closed_days: [],
    external_urls: { official: "https://hoshinoresorts.com/ja/hotels/oirase/" },
    tags: ["hoshino_oirase", "1939", "okamoto_taro_hearth", "moss_lobby"],
    source: "manual",
  },
  {
    slug: "towada-lakeside-lodge",
    category: "lodging",
    sub_type: "aomori_towada_lodge",
    title_zh: "十和田湖畔旅館群(十和田湖休屋エリア・約 10 軒湖畔旅館+ 十和田湖遊覧船発着+ 国立公園地+ 5-11 月営業中心+ 12-3 月減便+冬閉鎖宿多数)",
    title_ja: "十和田湖畔旅館群",
    romaji: "Towada Lakeside Lodges",
    summary_zh: "**十和田湖畔旅館群是十和田湖休屋エリアの宿泊集約地**(十和田市・秋田県境湖畔・**約 10 軒湖畔旅館**)。**遊覧船発着+ 乙女像 + 国立公園地**、5-11 月営業中心、十和田プリンスホテル+十和田湖荘+とわだこ遊月+ 等代表、JR バス十和田北線 + 八戸線で青森+八戸からアクセス可能。",
    content_md: "- 立地:**十和田市奥瀬十和田湖畔休屋**(秋田県境湖畔)\n- 規模:**約 10 軒湖畔旅館**\n- 主要宿:**十和田プリンスホテル + 十和田湖荘 + とわだこ遊月 + 山喜旅館**\n- 並列観光:**十和田湖遊覧船 + 乙女像 + 十和田神社 + 奥入瀬渓流**\n- 営業期:**5-11 月営業中心**(12-3 月減便+ 冬閉鎖宿多数)\n- アクセス:**JR バスみずうみ号**(青森+八戸+ 弘前から)\n- 価格:1 泊 2 食 ¥12,000-25,000",
    region: "tohoku",
    prefecture_ja: "青森県",
    gun_ja: null,
    municipality_ja: "十和田市",
    lg_code: "02206",
    area_types: ["scenic_spot"],
    lat: 40.4636,
    lon: 140.8825,
    season_start: "2026-05-01",
    season_end: "2026-11-30",
    event_start: null,
    event_end: null,
    price_tier: 3,
    booking_window_days: 60,
    closed_days: [],
    external_urls: {},
    tags: ["towada_lakeside", "yasumiya", "may_november"],
    source: "manual",
  },

  // ════════════════════════════════════════════════════════════════════
  // 都市ホテル (3) — 青森+弘前+八戸
  // ════════════════════════════════════════════════════════════════════
  {
    slug: "hotel-aomori-city",
    category: "lodging",
    sub_type: "aomori_city_hotel",
    title_zh: "ホテル青森(青森市堤町・青森市内最上位クラス+ 全 184 室+ JR 青森駅徒歩 15 分+ 青森ベイ望み+ ねぶた祭時期予約激戦+ 八甲田丸+アスパム近隣)",
    title_ja: "ホテル青森",
    romaji: "Hotel Aomori",
    summary_zh: "**ホテル青森是青森市内最上位ホテル**(青森市堤町・**青森駅徒歩 15 分**)。**全 184 室+ 青森ベイ望み + 全室バス付**、青森ねぶた祭(8 月 2-7 日)時期予約激戦、八甲田丸 + アスパム + 青森ベイブリッジ近隣、結婚式+ ビジネス+ 観光対応の総合ホテル。",
    content_md: "- 立地:**青森市堤町 1-1-23**(JR 青森駅 徒歩 15 分・タクシー 5 分)\n- 規模:**全 184 室**(シングル + ツイン + スイート)\n- 設備:**全室バス付 + 屋内プール + フィットネス + レストラン 5 軒**\n- 並列観光:**八甲田丸 + アスパム + ねぶたの家ワ・ラッセ**\n- 繁忙期:**青森ねぶた祭 8/2-7 予約 6 ヶ月前**\n- 価格:1 泊素泊 ¥12,000-25,000 / 1 泊 2 食 ¥18,000-35,000",
    region: "tohoku",
    prefecture_ja: "青森県",
    gun_ja: null,
    municipality_ja: "青森市",
    lg_code: "02201",
    area_types: ["urban", "transit_hub"],
    lat: 40.8175,
    lon: 140.7444,
    season_start: null,
    season_end: null,
    event_start: null,
    event_end: null,
    price_tier: 4,
    booking_window_days: 180,
    closed_days: [],
    external_urls: { official: "https://www.hotelaomori.co.jp/" },
    tags: ["hotel_aomori", "city_top_class", "184_rooms", "nebuta_book_180_days"],
    source: "manual",
  },
  {
    slug: "art-hotel-hirosaki-city",
    category: "lodging",
    sub_type: "aomori_city_hotel",
    title_zh: "アートホテル弘前シティ(弘前駅前・全 134 室+ JR 弘前駅徒歩 1 分+ 弘前桜祭+ねぷた祭時期予約激戦+ 中三 + 弘前公園 アクセス便利)",
    title_ja: "アートホテル弘前シティ",
    romaji: "Art Hotel Hirosaki City",
    summary_zh: "**アートホテル弘前シティ是弘前駅前主力ビジネスホテル**(弘前市・**JR 弘前駅 徒歩 1 分**)。**全 134 室+ 中三百貨店徒歩+ 弘前公園バスアクセス**、弘前さくらまつり(4 月下-5 月初)+ 弘前ねぷたまつり(8 月 1-7 日)時期予約激戦、観光+ ビジネス両用、津軽塗物販店も近隣。",
    content_md: "- 立地:**弘前市大町 1-1-2**(JR 弘前駅 徒歩 1 分)\n- 規模:**全 134 室**(シングル + ツイン)\n- 並列観光:**弘前公園バス 7 分 + 中三百貨店徒歩 1 分 + 田中屋徒歩 5 分**\n- 繁忙期:**弘前さくらまつり 4/下-5/上 + 弘前ねぷた 8/1-7 予約 6 ヶ月前**\n- 価格:1 泊素泊 ¥9,000-18,000(時期変動大)",
    region: "tohoku",
    prefecture_ja: "青森県",
    gun_ja: null,
    municipality_ja: "弘前市",
    lg_code: "02202",
    area_types: ["urban", "transit_hub"],
    lat: 40.5728,
    lon: 140.4711,
    season_start: null,
    season_end: null,
    event_start: null,
    event_end: null,
    price_tier: 3,
    booking_window_days: 180,
    closed_days: [],
    external_urls: { official: "https://www.art-hirosaki-city.com/" },
    tags: ["art_hotel_hirosaki", "station_front", "sakura_neputa_peak"],
    source: "manual",
  },
  {
    slug: "daiwa-roynet-hachinohe",
    category: "lodging",
    sub_type: "aomori_city_hotel",
    title_zh: "ダイワロイネットホテル八戸(八戸市番町・JR 本八戸駅徒歩 6 分+ 全 195 室+ 八戸三社大祭時期予約激戦+ 三日町商店街中心+ さくら野百貨店徒歩)",
    title_ja: "ダイワロイネットホテル八戸",
    romaji: "Daiwa Roynet Hachinohe",
    summary_zh: "**ダイワロイネットホテル八戸是八戸中心市街地主力ビジネスホテル**(八戸市番町・**JR 本八戸駅徒歩 6 分**)。**全 195 室+ 三日町商店街中心+ さくら野百貨店徒歩 5 分**、八戸三社大祭(7 月 31 日-8 月 4 日)+ 八戸えんぶり(2 月 17-20 日)時期予約激戦、観光+ ビジネス両用大型ホテル。",
    content_md: "- 立地:**八戸市番町 8-1**(JR 本八戸駅 徒歩 6 分)\n- 規模:**全 195 室**(シングル + ツイン + ダブル)\n- 並列観光:**三日町商店街 + さくら野百貨店 + 八戸ポータルミュージアムはっち**\n- 繁忙期:**八戸三社大祭 7/31-8/4 + 八戸えんぶり 2/17-20**\n- 価格:1 泊素泊 ¥9,000-18,000(時期変動大)",
    region: "tohoku",
    prefecture_ja: "青森県",
    gun_ja: null,
    municipality_ja: "八戸市",
    lg_code: "02203",
    area_types: ["urban", "transit_hub"],
    lat: 40.5142,
    lon: 141.4889,
    season_start: null,
    season_end: null,
    event_start: null,
    event_end: null,
    price_tier: 3,
    booking_window_days: 180,
    closed_days: [],
    external_urls: { official: "https://www.daiwaroynet.jp/hachinohe/" },
    tags: ["daiwa_roynet_hachinohe", "honhachinohe_station", "sansha_taisai_enburi"],
    source: "manual",
  },

  // ════════════════════════════════════════════════════════════════════
  // 民宿+山ロッジ (2) — 大間+白神山地
  // ════════════════════════════════════════════════════════════════════
  {
    slug: "oma-minshuku-cluster",
    category: "lodging",
    sub_type: "aomori_minshuku",
    title_zh: "大間漁港民宿群(下北郡大間町・本州最北端 約 15 軒民宿+ 大間鮪料理付プラン+ 1 月豊洲初競り時期予約激戦+ 朝食鮪+夕食鮪刺身鍋+ レンタカー必須)",
    title_ja: "大間民宿",
    romaji: "Ōma Minshuku",
    summary_zh: "**大間漁港民宿群是本州最北端の漁村民宿**(下北郡大間町・**約 15 軒民宿+ 大間鮪料理付プラン**)。**朝食 鮪+ 夕食 鮪刺身鍋 + 漁師まかない**、1 月豊洲初競り後の鮪繁忙期(1-3 月)予約激戦、JR 下北駅から下北交通バス 約 100 分(レンタカー推奨)、家族経営密着型。",
    content_md: "- 立地:**下北郡大間町**(本州最北端・大間崎周辺)\n- 規模:**約 15 軒民宿**(家族経営密着型)\n- 食事:**朝食 鮪 + 夕食 鮪刺身鍋 + 漁師まかない**\n- 主要民宿:民宿たまや + 民宿うるしや + 民宿福寿草 等\n- アクセス:**JR 下北駅 → 下北交通バス 約 100 分**(レンタカー推奨)\n- 繁忙期:**1-3 月鮪盛期 + 1 月豊洲初競り直後**(2-3 ヶ月前予約)\n- 価格:1 泊 2 食 ¥9,000-18,000(鮪量で変動)",
    region: "tohoku",
    prefecture_ja: "青森県",
    gun_ja: "下北郡",
    municipality_ja: "大間町",
    lg_code: "02423",
    area_types: ["coastal"],
    lat: 41.5286,
    lon: 140.9094,
    season_start: null,
    season_end: null,
    event_start: null,
    event_end: null,
    price_tier: 2,
    booking_window_days: 90,
    closed_days: [],
    external_urls: {},
    tags: ["oma_minshuku", "honshu_north", "tuna_meals", "fisherman_makanai"],
    source: "manual",
  },
  {
    slug: "shirakami-aqua-green-village",
    category: "lodging",
    sub_type: "aomori_minshuku",
    title_zh: "アクアグリーンビレッジ ANMON(西目屋村・白神山地世遺玄関+ コテージ + キャンプ + 大浴場+ 暗門の滝徒歩 90 分+ 5-10 月営業中心 11-4 月閉鎖)",
    title_ja: "アクアグリーンビレッジ ANMON",
    romaji: "Aqua Green Village Anmon",
    summary_zh: "**アクアグリーンビレッジ ANMON 是白神山地世遺玄関の村営宿泊複合**(中津軽郡西目屋村・**5-10 月営業中心 11-4 月積雪閉鎖**)。**コテージ + キャンプ場 + 大浴場 + 暗門の滝徒歩 90 分登山口**、白神山地登山+ ブナ原生林散策の本格拠点、弘前から弘南バス西目屋線 約 60 分。",
    content_md: "- 立地:**中津軽郡西目屋村川原平 1-2**(白神山地玄関口)\n- 構成:**コテージ + キャンプ場 + 大浴場 + レストラン**\n- 並列観光:**暗門の滝(徒歩 90 分・3 つの滝)+ ブナ原生林散策**\n- 営業期:**5-10 月中心**(11-4 月積雪閉鎖)\n- アクセス:**弘前駅 → 弘南バス西目屋線 約 60 分**\n- 価格:コテージ 1 棟 ¥15,000-30,000 / キャンプ ¥1,500-3,500/サイト",
    region: "tohoku",
    prefecture_ja: "青森県",
    gun_ja: "中津軽郡",
    municipality_ja: "西目屋村",
    lg_code: "02343",
    area_types: ["mountain_village", "scenic_spot"],
    lat: 40.5306,
    lon: 140.2611,
    season_start: "2026-05-01",
    season_end: "2026-10-31",
    event_start: null,
    event_end: null,
    price_tier: 2,
    booking_window_days: 60,
    closed_days: [],
    external_urls: {},
    tags: ["aqua_green_anmon", "shirakami_world_heritage", "anmon_falls", "may_october"],
    source: "manual",
  },
];

async function main() {
  if (rows.length === 0) {
    console.log("[aomori-lodging-r1] 尚無條目");
    return;
  }
  console.log(`[aomori-lodging-r1] ${rows.length} 筆 ${DRY ? "(dry-run)" : ""}`);
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
    const { error } = await sb.from("japan_entries").upsert(batch as any, { onConflict: "slug" });
    if (error) {
      console.error("[aomori-lodging-r1] upsert failed:", error);
      process.exit(1);
    }
    written += batch.length;
    process.stdout.write(`\r[aomori-lodging-r1] upsert: ${written}/${rows.length}`);
  }
  process.stdout.write("\n");
  console.log(`[aomori-lodging-r1] Done — ${written} rows.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

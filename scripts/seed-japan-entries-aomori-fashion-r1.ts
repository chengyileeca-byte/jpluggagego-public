// Seed 青森県 衣 R1(18 筆 / Sprint 1.2)
//
// 津軽塗 4 / こぎん刺し 3 / 南部菱刺し 2 / 南部裂織 2 / 津軽びいどろ 2 /
// 百貨店 2 / 民芸 3 = 18
//
// sub_type +7:aomori_tsugaru_nuri / aomori_kogin_zashi / aomori_nanbu_sashiko /
// aomori_nanbu_sakiori / aomori_tsugaru_vidro / aomori_dept_store / aomori_folk_craft

import { config as loadEnv } from "dotenv";
loadEnv({ path: ".env.local" });

import { createAdminClient } from "../src/lib/supabase/admin";

const DRY = process.argv.includes("--dry-run");

interface SeedRow {
  slug: string;
  category: "fashion";
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
  // 津軽塗 (4) — 経産省指定伝統的工芸品 1975 / 弘前藩 1646 起源
  // ════════════════════════════════════════════════════════════════════
  {
    slug: "tsugaru-nuri-overview",
    category: "fashion",
    sub_type: "aomori_tsugaru_nuri",
    title_zh: "津軽塗(経産省指定伝統的工芸品 1975+ 弘前藩 1646 招聘江戸塗師起源+ 4 技法 唐塗 + 七子塗 + 紋紗塗 + 錦塗+ 48 工程 半年間)",
    title_ja: "津軽塗",
    romaji: "Tsugaru Nuri",
    summary_zh: "**津軽塗是青森唯一の経産省指定伝統的工芸品 1975**(弘前 + 黒石市 + 平川市・**弘前藩 4 代藩主 津軽信政 1646 江戸塗師招聘起源**)。**唐塗 + 七子塗 + 紋紗塗 + 錦塗 4 技法**、**48 工程 + 半年間**の手作業、漆器の中で最複雑な仕上げ、漆 30-50 層研出しで独特の斑紋を出す。",
    content_md: "- 起源:**弘前藩 1646 4 代信政が江戸塗師 池田源兵衛 招聘**\n- 認定:**経済産業大臣指定伝統的工芸品 1975**(青森県唯一)\n- 工程:**約 48 工程 + 半年間**(漆 30-50 層 + 研出し)\n- 4 技法:\n  - **唐塗(からぬり)**:7 色色漆を彩流模様で配置・代表技法\n  - **七子塗(ななこぬり)**:菜種を撒いて凸凹の輪紋を出す\n  - **紋紗塗(もんしゃぬり)**:籾殻炭を撒いて渋い艶消し\n  - **錦塗(にしきぬり)**:七子の上に唐草+花弁を加える最高級\n- 産地:**弘前市 + 黒石市 + 平川市**(津軽圏)\n- 価格:箸 1 膳 ¥3,000-15,000 / 椀 ¥10,000-100,000",
    region: "tohoku",
    prefecture_ja: "青森県",
    gun_ja: null,
    municipality_ja: "弘前市",
    lg_code: "02202",
    area_types: ["craft_workshop", "shopping_district"],
    lat: 40.6063,
    lon: 140.4641,
    season_start: null,
    season_end: null,
    event_start: null,
    event_end: null,
    price_tier: 3,
    booking_window_days: null,
    closed_days: [],
    external_urls: { official: "https://tsugarunuri.org/" },
    tags: ["tsugaru_nuri", "1975_designated", "1646_origin", "4_techniques", "kararu_nanako_monsha_nishiki"],
    source: "manual",
  },
  {
    slug: "tsugaru-nuri-kaikan-hirosaki",
    category: "fashion",
    sub_type: "aomori_tsugaru_nuri",
    title_zh: "津軽塗会館 たくみ(弘前市・津軽塗協同組合運営+ 4 技法 全種展示物販+ 工程実演+ 体験工房 + 弘前駅徒歩圏購入拠点)",
    title_ja: "津軽塗会館 たくみ",
    romaji: "Tsugaru Nuri Kaikan Takumi",
    summary_zh: "**津軽塗会館 たくみは津軽塗協同組合運営の物販+体験拠点**(弘前市富田・**津軽塗 4 技法 全種展示物販**)。**漆器商品 1,000 点+ 工程実演 + 体験コーナー(¥1,500-3,500/箸研出し体験)**、弘前駅から徒歩 25 分 or 弘南バス 約 7 分、津軽塗を一括見比べる青森唯一の会館。",
    content_md: "- 立地:**弘前市富田 1-1-2**(弘前駅 徒歩 25 分 / 弘南バス 約 7 分)\n- 運営:**青森県漆器協同組合連合会**\n- 展示物販:**唐塗 + 七子塗 + 紋紗塗 + 錦塗 全種**(1,000 点+)\n- 体験:**箸研出し体験 ¥1,500-3,500**(要予約・所要 60-90 分)\n- 工程実演:漆塗職人による実演(平日中心)\n- 並列:R1 衣 津軽塗 概説 + R1 衣 こぎん刺し研究所 = 弘前工芸 2 大\n- 営業:9:00-17:00",
    region: "tohoku",
    prefecture_ja: "青森県",
    gun_ja: null,
    municipality_ja: "弘前市",
    lg_code: "02202",
    area_types: ["craft_workshop", "shopping_district"],
    lat: 40.6028,
    lon: 140.4675,
    season_start: null,
    season_end: null,
    event_start: null,
    event_end: null,
    price_tier: 3,
    booking_window_days: 7,
    closed_days: [],
    external_urls: {},
    tags: ["tsugaru_nuri_kaikan", "takumi", "experience_chopsticks"],
    source: "manual",
  },
  {
    slug: "tsugaru-nuri-tanaka-hirosaki",
    category: "fashion",
    sub_type: "aomori_tsugaru_nuri",
    title_zh: "田中屋 弘前店(弘前市百石町・津軽塗 + 仏具 + 漆器老舗+ 唐塗作品多数+ 弘前城下町中心+ 弘南鉄道 中央弘前駅徒歩圏)",
    title_ja: "田中屋",
    romaji: "Tanaka-ya",
    summary_zh: "**田中屋是弘前城下町の津軽塗 + 漆器老舗**(弘前市百石町・**百石町商店街内**)。**唐塗 + 七子塗作品多数+ 進物用箸+椀+重箱+茶器+ 仏壇仏具**、弘前城下町散策時の津軽塗購入拠点、弘南鉄道 中央弘前駅 徒歩 5 分、弘前公園徒歩 10 分。",
    content_md: "- 立地:**弘前市百石町 9**(弘前城下町・百石町商店街)\n- 取扱:**唐塗 + 七子塗 + 進物用箸/椀/重箱/茶器 + 仏壇仏具**\n- アクセス:**弘南鉄道 中央弘前駅 徒歩 5 分** / 弘前公園 徒歩 10 分\n- 並列観光:**弘前公園 + 弘前城天守 + 百石町商店街**\n- 価格:箸 ¥3,000-+ / 椀 ¥10,000-50,000\n- 営業:10:00-18:00",
    region: "tohoku",
    prefecture_ja: "青森県",
    gun_ja: null,
    municipality_ja: "弘前市",
    lg_code: "02202",
    area_types: ["shopping_district", "historic_district"],
    lat: 40.6066,
    lon: 140.4715,
    season_start: null,
    season_end: null,
    event_start: null,
    event_end: null,
    price_tier: 3,
    booking_window_days: null,
    closed_days: [],
    external_urls: {},
    tags: ["tanaka_ya", "hirosaki_castle_town", "hyakkokumachi"],
    source: "manual",
  },
  {
    slug: "tsugaru-nuri-experience-overview",
    category: "fashion",
    sub_type: "aomori_tsugaru_nuri",
    title_zh: "津軽塗体験工房群(弘前+黒石+平川 体験施設+ 箸研出し ¥1,500- + 椀研出し ¥3,000- + 90-180 分所要+ 半年漆乾燥仕上は後日郵送)",
    title_ja: "津軽塗体験工房",
    romaji: "Tsugaru Nuri Taiken",
    summary_zh: "**津軽塗体験工房群は弘前+黒石+平川の体験施設**(津軽圏・**箸研出し体験 ¥1,500-3,500 が代表**)。**90-180 分所要+ 既塗箸/椀/コースターの最後の研出し工程のみ体験**、本格的な漆塗りは半年要するため、研出しは「色を出す」最終工程として代表体験、要事前予約。",
    content_md: "- 体験内容:**箸/椀/コースター研出し体験**(下塗+ 色漆塗装済の最終仕上げ研出し)\n- 所要時間:**90-180 分**(箸 90 分 / 椀 180 分)\n- 価格:**箸 ¥1,500-3,500** / 椀 ¥3,000-8,000\n- 主要工房:**津軽塗会館たくみ**(弘前)+ **小山陶器店**(黒石)+ **小笠原漆器店**(平川)\n- 予約:**3-7 日前予約推奨**(夏休み + GW は早期満員)\n- 注意:**漆乾燥+仕上げ完成は半年後郵送**(漆塗本来の所要時間)",
    region: "tohoku",
    prefecture_ja: "青森県",
    gun_ja: null,
    municipality_ja: "弘前市",
    lg_code: "02202",
    area_types: ["craft_workshop"],
    lat: 40.6063,
    lon: 140.4641,
    season_start: null,
    season_end: null,
    event_start: null,
    event_end: null,
    price_tier: 2,
    booking_window_days: 7,
    closed_days: [],
    external_urls: {},
    tags: ["tsugaru_nuri_experience", "togi_dashi", "90_180_min"],
    source: "manual",
  },

  // ════════════════════════════════════════════════════════════════════
  // こぎん刺し (3) — 津軽農民の麻布補強刺繍・全国手芸ブーム
  // ════════════════════════════════════════════════════════════════════
  {
    slug: "kogin-zashi-overview",
    category: "fashion",
    sub_type: "aomori_kogin_zashi",
    title_zh: "津軽こぎん刺し(津軽農民麻布補強刺繍+ 江戸期 絹禁令対応起源+ 1962 弘前こぎん研究所 横島直道再評価+ 全国手芸ブーム+ 重要無形民俗文化財)",
    title_ja: "津軽こぎん刺し",
    romaji: "Tsugaru Kogin Zashi",
    summary_zh: "**津軽こぎん刺しは津軽農民の麻布補強伝統刺繍**(津軽全域・**江戸期 弘前藩農民への 絹禁令 1724 への対応起源**)。**麻布の縦糸に対して横糸を奇数目で拾う独特技法 + 幾何文様 (モドコ) 30+ 種類**、明治以降衰退、**1932 民芸運動 + 1962 弘前こぎん研究所(横島直道)再評価**、現代全国手芸ブーム。",
    content_md: "- 起源:**江戸期 弘前藩農民の絹禁令 1724 への麻布補強策**\n- 技法:**縦糸に対し横糸奇数目拾い**(縦糸 1/3/5/7 本拾う)+ 幾何文様\n- 文様:**モドコ(基礎模様) 30+ 種類**(マメコ + 紗綾形 + 猫足 等)\n- 復興:**1932 民芸運動の柳宗悦再評価** → **1962 弘前こぎん研究所(横島直道)設立**\n- 現代:**全国手芸ブーム**(本+ キット+ ワークショップ全国展開)\n- 並列:R1 衣 南部菱刺し = 同性質の南部地方刺繍\n- 価格:キット ¥1,500-3,500 / 完成品 巾着 ¥4,500-8,000",
    region: "tohoku",
    prefecture_ja: "青森県",
    gun_ja: null,
    municipality_ja: "弘前市",
    lg_code: "02202",
    area_types: ["craft_workshop"],
    lat: 40.6063,
    lon: 140.4641,
    season_start: null,
    season_end: null,
    event_start: null,
    event_end: null,
    price_tier: 2,
    booking_window_days: null,
    closed_days: [],
    external_urls: {},
    tags: ["kogin_zashi", "1724_silk_ban", "1962_research_inst", "minge_movement", "modoko_30_patterns"],
    source: "manual",
  },
  {
    slug: "hirosaki-kogin-research-institute",
    category: "fashion",
    sub_type: "aomori_kogin_zashi",
    title_zh: "弘前こぎん研究所(弘前市在府町・1962 横島直道創立+ こぎん刺し復興拠点+ 物販 + ワークショップ + 文様史料+ 弘前駅徒歩圏)",
    title_ja: "弘前こぎん研究所",
    romaji: "Hirosaki Kogin Kenkyusho",
    summary_zh: "**弘前こぎん研究所是こぎん刺し復興の本山**(弘前市在府町・**1962 横島直道創立**)。**物販 + ワークショップ + 文様史料展示**、3 階建洋館が研究所兼ショールーム、巾着 + テーブルランナー + 巾着 + 名刺入れ等完成品多数、文様 30+ 種を活字化したのも本研究所、弘前駅徒歩 15 分。",
    content_md: "- 立地:**弘前市在府町 61**(弘前駅 徒歩 15 分)\n- 創立:**1962 年・横島直道**(こぎん研究の第一人者)\n- 役割:**こぎん文様 30+ 種類の活字記録 + 復興拠点**\n- 構成:**物販ショールーム + 史料展示 + ワークショップ**\n- 商品:巾着 + テーブルランナー + 巾着 + 名刺入れ + ブックカバー\n- ワークショップ:**コースター ¥2,500 + 巾着 ¥5,500**(要予約・1 日体験)\n- 営業:9:00-17:30 / 日曜+祝日休",
    region: "tohoku",
    prefecture_ja: "青森県",
    gun_ja: null,
    municipality_ja: "弘前市",
    lg_code: "02202",
    area_types: ["craft_workshop", "museum_art"],
    lat: 40.6018,
    lon: 140.4675,
    season_start: null,
    season_end: null,
    event_start: null,
    event_end: null,
    price_tier: 3,
    booking_window_days: 7,
    closed_days: ["sun", "holiday"],
    external_urls: { official: "https://tsugaru-kogin.jp/" },
    tags: ["hirosaki_kogin", "1962_yokoshima_naomichi", "research_institute"],
    source: "manual",
  },
  {
    slug: "kogin-experience-workshops",
    category: "fashion",
    sub_type: "aomori_kogin_zashi",
    title_zh: "こぎん刺し体験工房群(弘前 + 青森市 体験施設+ コースター 2,000- + 巾着 5,000- + 90-180 分所要+ 完成品 持ち帰り 即日)",
    title_ja: "こぎん刺し体験",
    romaji: "Kogin Zashi Taiken",
    summary_zh: "**こぎん刺し体験工房群は弘前+青森市の体験施設**(津軽全域・**コースター ¥2,000-3,500 が代表**)。**90-180 分所要+ 完成品即日持帰り**(漆塗のような半年待ちなし)、布+ 糸+ 図案+ 針 を貸出 + 講師指導付、本格的な巾着は 360 分要、要事前予約。",
    content_md: "- 体験内容:**コースター + 巾着 + ブックカバー + 名刺入れ**\n- 所要時間:**90-360 分**(コースター 90 / 巾着 360 分)\n- 価格:**コースター ¥2,000-3,500** / 巾着 ¥5,500-9,000\n- 主要工房:**弘前こぎん研究所** + **しまや旅館 体験工房**(青森市)+ **アスパム文化交流館**(青森市)\n- 完成:**即日持ち帰り**(津軽塗と違って漆乾燥不要)\n- 予約:**3-7 日前予約推奨**(GW + 夏休み 早期満員)",
    region: "tohoku",
    prefecture_ja: "青森県",
    gun_ja: null,
    municipality_ja: "弘前市",
    lg_code: "02202",
    area_types: ["craft_workshop"],
    lat: 40.6063,
    lon: 140.4641,
    season_start: null,
    season_end: null,
    event_start: null,
    event_end: null,
    price_tier: 2,
    booking_window_days: 7,
    closed_days: [],
    external_urls: {},
    tags: ["kogin_experience", "coaster_kinchaku", "instant_takeaway"],
    source: "manual",
  },

  // ════════════════════════════════════════════════════════════════════
  // 南部菱刺し (2) — 八戸地方の麻布補強刺繍
  // ════════════════════════════════════════════════════════════════════
  {
    slug: "nanbu-hishizashi-overview",
    category: "fashion",
    sub_type: "aomori_nanbu_sashiko",
    title_zh: "南部菱刺し(八戸 + 三戸郡農民麻布刺繍+ 偶数目拾い菱形文様+ こぎん奇数目との対比+ 県重要無形民俗文化財+ 1980 年代復興)",
    title_ja: "南部菱刺し",
    romaji: "Nanbu Hishizashi",
    summary_zh: "**南部菱刺しは八戸+三戸郡農民の麻布補強刺繍**(南部地方・**江戸期-明治期 農村女性の労働着 補強伝統**)。**偶数目拾いで菱形 (ひし) 文様を出す**(津軽こぎんの奇数目とは対照的)、文様は **40+ 種類**、1980 年代に **南部菱刺し研究会** 復興、県重要無形民俗文化財。",
    content_md: "- 起源:**江戸期-明治期 八戸+三戸郡農民の麻布労働着補強**\n- 対比:**偶数目拾い + 菱形文様**(津軽こぎん刺しは奇数目+幾何)\n- 文様:**40+ 種類**(縦菱 + 横菱 + 流れ菱 + 八重菱 等)\n- 復興:**1980 年代 南部菱刺し研究会 + 八戸地方民芸品**\n- 認定:**県重要無形民俗文化財**\n- 並列:R1 衣 こぎん刺し = 同性質の津軽地方刺繍\n- 価格:キット ¥1,500-4,000 / 完成品 巾着 ¥5,000-12,000",
    region: "tohoku",
    prefecture_ja: "青森県",
    gun_ja: null,
    municipality_ja: "八戸市",
    lg_code: "02203",
    area_types: ["craft_workshop"],
    lat: 40.5121,
    lon: 141.4884,
    season_start: null,
    season_end: null,
    event_start: null,
    event_end: null,
    price_tier: 2,
    booking_window_days: null,
    closed_days: [],
    external_urls: {},
    tags: ["nanbu_hishizashi", "even_thread_pickup", "diamond_pattern", "1980s_revival"],
    source: "manual",
  },
  {
    slug: "hachinohe-hishizashi-shops",
    category: "fashion",
    sub_type: "aomori_nanbu_sashiko",
    title_zh: "八戸南部菱刺し物販+体験(八戸ポータルミュージアム はっち + 八戸地方民芸品店+ 体験工房+ 八戸三社大祭+ 八食センター近隣)",
    title_ja: "八戸菱刺し体験",
    romaji: "Hachinohe Hishizashi Taiken",
    summary_zh: "**八戸南部菱刺し物販+体験は八戸ポータルミュージアム「はっち」+ 民芸品店中心**(八戸市・**八戸ポータルミュージアム はっち 2011 開館**)。**菱刺し物販 + ワークショップ 月数回開催**、八戸三社大祭の山車が常時展示される複合文化施設、JR 本八戸駅 徒歩 10 分、八食センターと組合せ観光可能。",
    content_md: "- 主要施設:**八戸ポータルミュージアム「はっち」**(2011 開館)\n- 立地:**八戸市三日町 11-1**(JR 本八戸駅 徒歩 10 分)\n- 取扱:**菱刺し巾着 + ブックカバー + 名刺入れ**\n- ワークショップ:**月数回開催**(コースター ¥2,500 + 巾着 ¥5,500)\n- 並列展示:**八戸三社大祭 山車実物**(ユネスコ無形 2016)\n- 並列観光:R1 食 八戸せんべい汁 + 八食センター + 八戸三社大祭",
    region: "tohoku",
    prefecture_ja: "青森県",
    gun_ja: null,
    municipality_ja: "八戸市",
    lg_code: "02203",
    area_types: ["craft_workshop", "museum_art"],
    lat: 40.5125,
    lon: 141.4889,
    season_start: null,
    season_end: null,
    event_start: null,
    event_end: null,
    price_tier: 2,
    booking_window_days: 14,
    closed_days: [],
    external_urls: { official: "https://hacchi.jp/" },
    tags: ["hachinohe_hishizashi", "hacchi_2011", "nanbu_sashiko_workshop"],
    source: "manual",
  },

  // ════════════════════════════════════════════════════════════════════
  // 南部裂織 (2) — 八戸地方の古布再織伝統技法
  // ════════════════════════════════════════════════════════════════════
  {
    slug: "nanbu-sakiori-overview",
    category: "fashion",
    sub_type: "aomori_nanbu_sakiori",
    title_zh: "南部裂織(さきおり)(八戸 + 三戸郡農村古布再織伝統+ 江戸期 寒冷地 布貴重期の循環民芸+ 経糸麻 + 緯糸古布細裂き+ 県指定無形民俗文化財)",
    title_ja: "南部裂織",
    romaji: "Nanbu Sakiori",
    summary_zh: "**南部裂織は八戸+三戸郡農村の古布再織伝統**(南部地方・**江戸期 寒冷地 布貴重期の循環民芸**)。**経糸=麻+緯糸=古布細裂き**、丈夫+保温性高く農作業着+座布団+敷物に活用、現代は**ファッション小物 + マフラー + バッグ**へ展開、県指定無形民俗文化財。",
    content_md: "- 起源:**江戸期 八戸 + 三戸郡 寒冷地農村の古布再織**\n- 技法:**経糸 = 麻** + **緯糸 = 古布細裂き**\n- 用途:農作業着 + 座布団 + 敷物 + 帯(現代はマフラー + バッグ)\n- 認定:**県指定無形民俗文化財**\n- 並列:R1 衣 こぎん + 菱刺し = 「補強刺繍」 vs 裂織 = 「古布再織」 = 北東北民芸 2 系統\n- 価格:マフラー ¥6,000-15,000 / バッグ ¥10,000-30,000",
    region: "tohoku",
    prefecture_ja: "青森県",
    gun_ja: null,
    municipality_ja: "八戸市",
    lg_code: "02203",
    area_types: ["craft_workshop"],
    lat: 40.5121,
    lon: 141.4884,
    season_start: null,
    season_end: null,
    event_start: null,
    event_end: null,
    price_tier: 3,
    booking_window_days: null,
    closed_days: [],
    external_urls: {},
    tags: ["nanbu_sakiori", "old_cloth_reweave", "edo_period", "asa_warp_furugiri_weft"],
    source: "manual",
  },
  {
    slug: "sakiori-experience-hachinohe",
    category: "fashion",
    sub_type: "aomori_nanbu_sakiori",
    title_zh: "南部裂織体験工房群(八戸 + 三戸郡 体験施設 + 八戸地方歴史民俗資料館+ コースター ¥2,000- + 機織体験 90-180 分+ 民芸品店物販)",
    title_ja: "南部裂織体験",
    romaji: "Nanbu Sakiori Taiken",
    summary_zh: "**南部裂織体験工房群は八戸+三戸郡の体験施設**(南部地方・**機織体験 90-180 分**)。**コースター ¥2,000- + マフラー ¥6,000-** 体験、八戸地方歴史民俗資料館で展示見学+体験予約可、伝統技法を受け継ぐ女性職人が指導、要事前予約、商品は道の駅+民芸品店で物販。",
    content_md: "- 主要施設:**八戸地方歴史民俗資料館**(八戸市鮫町)+ 民芸工房数件\n- 体験:**コースター 90 分 ¥2,000** + **マフラー 180 分 ¥6,000**\n- 物販:**道の駅なんごう** + **道の駅さんのへ** + 八戸ポータルミュージアム\n- 予約:**7 日前予約推奨**(週末早期満員)\n- 並列:R1 衣 南部菱刺し体験 + 南部裂織体験 = 八戸民芸 2 大",
    region: "tohoku",
    prefecture_ja: "青森県",
    gun_ja: null,
    municipality_ja: "八戸市",
    lg_code: "02203",
    area_types: ["craft_workshop", "museum_art"],
    lat: 40.5295,
    lon: 141.5638,
    season_start: null,
    season_end: null,
    event_start: null,
    event_end: null,
    price_tier: 2,
    booking_window_days: 7,
    closed_days: [],
    external_urls: {},
    tags: ["sakiori_experience", "hachinohe_minzoku_museum"],
    source: "manual",
  },

  // ════════════════════════════════════════════════════════════════════
  // 津軽びいどろ (2) — 北洋硝子 1949 創業・1973 から青森ご当地ガラス
  // ════════════════════════════════════════════════════════════════════
  {
    slug: "tsugaru-vidro-hokuyo-glass",
    category: "fashion",
    sub_type: "aomori_tsugaru_vidro",
    title_zh: "津軽びいどろ(北洋硝子・青森市 1949 創業 76 年+ 1973 から青森ご当地ガラス開発+ 100 色+ 季節 motif + 県伝統工芸品+ A-Factory + 全国百貨店物販)",
    title_ja: "津軽びいどろ",
    romaji: "Tsugaru Vidro",
    summary_zh: "**津軽びいどろは北洋硝子の青森ご当地ガラス**(青森市・**北洋硝子 1949 創業 76 年・1973 から津軽びいどろ開発**)。**100 色+ 四季 motif (桜+ 夏海 + 紅葉 + 雪)+ ねぶた + 林檎+ 岩木山 design**、青森空港+A-FACTORY+全国百貨店物販、青森色彩ガラスとして観光土産代表。",
    content_md: "- 製造:**北洋硝子株式会社**(青森市富田・**1949 創業 76 年**)\n- 起源:**1973 から「津軽びいどろ」ブランド開発**(漁網用浮玉製造業者から転換)\n- 特色:**100 色+ 四季 motif (桜+ 夏海 + 紅葉 + 雪)** + ねぶた + 林檎 design\n- 認定:**県伝統工芸品**\n- 主要 line:**ねぶた + 春の彩 + 夏の彩 + 秋の彩 + 冬の彩 + 月読**\n- 物販:**A-FACTORY** + **青森空港** + **全国百貨店**\n- 価格:小皿 ¥1,500-3,500 / 一輪挿し ¥4,500-12,000 / グラス ¥3,500-8,000",
    region: "tohoku",
    prefecture_ja: "青森県",
    gun_ja: null,
    municipality_ja: "青森市",
    lg_code: "02201",
    area_types: ["craft_workshop", "shopping_district"],
    lat: 40.8128,
    lon: 140.7344,
    season_start: null,
    season_end: null,
    event_start: null,
    event_end: null,
    price_tier: 3,
    booking_window_days: null,
    closed_days: [],
    external_urls: { official: "https://tsugaruvidro.jp/" },
    tags: ["tsugaru_vidro", "hokuyo_glass_1949", "1973_brand", "100_colors", "4_seasons"],
    source: "manual",
  },
  {
    slug: "tsugaru-vidro-experience-hokuyo",
    category: "fashion",
    sub_type: "aomori_tsugaru_vidro",
    title_zh: "津軽びいどろ吹きガラス体験(北洋硝子 北洋硝子 工場見学+ 体験コーナー+ ¥3,300- 一輪挿し + ¥4,400- グラス + 90 分所要+ 完成品翌日宅配)",
    title_ja: "津軽びいどろ吹きガラス体験",
    romaji: "Tsugaru Vidro Glass Blowing",
    summary_zh: "**津軽びいどろ吹きガラス体験は北洋硝子の体験コーナー**(青森市富田・**北洋硝子工場 内設**)。**一輪挿し ¥3,300 + グラス ¥4,400 + 鉢 ¥5,500 等多種**、90 分所要、職人指導の本格吹きガラス体験、完成品は徐冷で翌日仕上げ後 宅配 (¥1,000-)、要事前予約。",
    content_md: "- 立地:**北洋硝子 青森市富田 4-29-13**(青森駅 → 市営バス 約 15 分)\n- 体験:**一輪挿し ¥3,300 + グラス ¥4,400 + 鉢 ¥5,500**(着色追加 +¥500)\n- 所要:**90 分**(うち実体験 15-20 分・残りは説明+選択)\n- 完成:**徐冷で翌日仕上げ → 宅配 ¥1,000-**(その場持ち帰り不可)\n- 予約:**3-7 日前予約**(電話 + Web)\n- 営業:9:30-15:30 / 月曜+祝日休\n- 並列:R1 衣 津軽塗体験 + こぎん刺し体験 + 津軽びいどろ体験 = 津軽工芸 3 大体験",
    region: "tohoku",
    prefecture_ja: "青森県",
    gun_ja: null,
    municipality_ja: "青森市",
    lg_code: "02201",
    area_types: ["craft_workshop"],
    lat: 40.8128,
    lon: 140.7344,
    season_start: null,
    season_end: null,
    event_start: null,
    event_end: null,
    price_tier: 3,
    booking_window_days: 7,
    closed_days: ["mon", "holiday"],
    external_urls: { official: "https://tsugaruvidro.jp/" },
    tags: ["vidro_glass_blowing", "90_min", "next_day_delivery"],
    source: "manual",
  },

  // ════════════════════════════════════════════════════════════════════
  // 百貨店 (2) — 中三弘前 1896 創業老舗 + さくら野百貨店八戸
  // ════════════════════════════════════════════════════════════════════
  {
    slug: "nakasan-hirosaki-dept",
    category: "fashion",
    sub_type: "aomori_dept_store",
    title_zh: "中三 弘前店(弘前市駅前・1896 創業 129 年+ 青森老舗地域百貨店+ 弘前駅徒歩 1 分+ 食料+衣料+ 津軽塗物販店も入る老舗複合)",
    title_ja: "中三 弘前店",
    romaji: "Nakasan Hirosaki",
    summary_zh: "**中三 弘前店是青森地域老舗百貨店**(弘前市駅前・**1896 創業 129 年**)。**JR 弘前駅 徒歩 1 分の駅前ランドマーク**、食料品+衣料+雑貨+ 津軽塗物販コーナー入る複合 5 階建、地元市民向け中価格帯、青森駅前 ロフト+ さくら野系より地元密着型。",
    content_md: "- 立地:**弘前市駅前 1-1-1**(JR 弘前駅 徒歩 1 分)\n- 創業:**1896 年・129 年**(青森地域百貨店最古級)\n- 構成:**5 階建**(食料+衣料+雑貨+地下食品)\n- 特色:**津軽塗 + こぎん刺し物販コーナー**入店\n- 並列:R1 衣 さくら野八戸 + 中三弘前 = 青森百貨店 2 大\n- 営業:10:00-19:00",
    region: "tohoku",
    prefecture_ja: "青森県",
    gun_ja: null,
    municipality_ja: "弘前市",
    lg_code: "02202",
    area_types: ["shopping_district", "transit_hub"],
    lat: 40.5728,
    lon: 140.4711,
    season_start: null,
    season_end: null,
    event_start: null,
    event_end: null,
    price_tier: 2,
    booking_window_days: null,
    closed_days: [],
    external_urls: {},
    tags: ["nakasan", "1896_founded", "hirosaki_station_front", "129_years"],
    source: "manual",
  },
  {
    slug: "sakurano-hachinohe-dept",
    category: "fashion",
    sub_type: "aomori_dept_store",
    title_zh: "さくら野百貨店 八戸店(八戸市三日町・八戸中心市街地最大百貨店+ 八戸地方衣料 hub + JR 本八戸駅徒歩圏+ 八戸三社大祭山車公開時期にぎわい)",
    title_ja: "さくら野百貨店 八戸店",
    romaji: "Sakuranō Hachinohe",
    summary_zh: "**さくら野百貨店 八戸店是八戸中心市街地最大百貨店**(八戸市三日町・**JR 本八戸駅 徒歩 8 分**)。**八戸地方衣料 + 化粧品 + 食料品 hub**、八戸三日町商店街中心、八戸三社大祭(7 月 31 日-8 月 4 日)時期は最も賑わう、地下食料品+ 屋上催事場ある古典的百貨店スタイル。",
    content_md: "- 立地:**八戸市三日町 13**(JR 本八戸駅 徒歩 8 分)\n- 構成:**地下食品 + 1F 化粧品 + 2-4F 衣料 + 5F 催事場**\n- 並列観光:**八戸三日町商店街 + 八戸ポータルミュージアム はっち**\n- 繁忙期:**八戸三社大祭 7/31-8/4**(山車展示時にぎわい)\n- 並列:R1 衣 中三弘前 + さくら野八戸 = 青森百貨店 2 大\n- 営業:10:00-19:00",
    region: "tohoku",
    prefecture_ja: "青森県",
    gun_ja: null,
    municipality_ja: "八戸市",
    lg_code: "02203",
    area_types: ["shopping_district"],
    lat: 40.5125,
    lon: 141.4889,
    season_start: null,
    season_end: null,
    event_start: null,
    event_end: null,
    price_tier: 2,
    booking_window_days: null,
    closed_days: [],
    external_urls: {},
    tags: ["sakurano_hachinohe", "mikkamachi", "hachinohe_dept_largest"],
    source: "manual",
  },

  // ════════════════════════════════════════════════════════════════════
  // 民芸 (3) — 八幡馬 + 下川原焼土人形 + あけび蔓細工
  // ════════════════════════════════════════════════════════════════════
  {
    slug: "yawatauma-hachinohe",
    category: "fashion",
    sub_type: "aomori_folk_craft",
    title_zh: "八幡馬(やわたうま)(八戸郷土玩具+ 八幡神社例祭由来+ 木彫漆塗馬+ 黒+赤+黄極彩色+ 三春駒 + 木下駒 と並ぶ日本三大駒+ 県重要無形民俗文化財)",
    title_ja: "八幡馬",
    romaji: "Yawatauma",
    summary_zh: "**八幡馬は八戸八幡神社由来の郷土玩具**(八戸市・**福島三春駒 + 仙台木下駒と並ぶ日本三大駒**)。**木彫漆塗+黒+赤+黄極彩色+背中に菊+牡丹花弁文様**、八幡神社例祭奉納木馬が起源、現代は土産品として八戸地方代表、県重要無形民俗文化財、八食センター+ 八戸ポータルミュージアムで購入可。",
    content_md: "- 起源:**八戸 櫛引八幡宮例祭奉納木馬**(800 年以上)\n- 製法:**木彫 + 漆塗 + 極彩色**(黒 + 赤 + 黄 + 緑 + 白)\n- 文様:**背中に菊 + 牡丹花弁**(縁起物)\n- 並列:**福島三春駒 + 仙台木下駒 + 青森八幡馬 = 日本三大駒**\n- 認定:**県重要無形民俗文化財**\n- 物販:**八食センター + 八戸ポータルミュージアムはっち + 櫛引八幡宮**\n- 価格:小型 ¥3,500- / 中型 ¥8,000-15,000",
    region: "tohoku",
    prefecture_ja: "青森県",
    gun_ja: null,
    municipality_ja: "八戸市",
    lg_code: "02203",
    area_types: ["craft_workshop", "shrine_temple"],
    lat: 40.5072,
    lon: 141.5183,
    season_start: null,
    season_end: null,
    event_start: null,
    event_end: null,
    price_tier: 2,
    booking_window_days: null,
    closed_days: [],
    external_urls: {},
    tags: ["yawatauma", "japan_3_komas", "kushibiki_hachimangu", "wood_lacquer"],
    source: "manual",
  },
  {
    slug: "shimokawara-yaki-dolls-hirosaki",
    category: "fashion",
    sub_type: "aomori_folk_craft",
    title_zh: "下川原焼土人形(弘前下川原・1804 江戸期津軽藩窯起源+ 鳩笛+ 雛人形+ 干支土人形+ 県重要無形民俗文化財+ 阿保家 9 代 200+ 年継承)",
    title_ja: "下川原焼土人形",
    romaji: "Shimokawara-yaki Tsuchi Ningyō",
    summary_zh: "**下川原焼土人形是弘前下川原の伝統土人形**(弘前市下川原・**1804 江戸後期津軽藩窯起源**)。**阿保家 9 代 200+ 年継承+ 鳩笛 + 雛人形 + 干支土人形**、津軽藩 9 代藩主 寧親(やすちか)が阿保利吉を招聘して焼物業を起こしたのが起源、県重要無形民俗文化財。",
    content_md: "- 起源:**1804 弘前藩 9 代寧親が阿保利吉招聘** → 下川原焼物業創始\n- 継承:**阿保家 9 代・200+ 年**(現代も製作継続)\n- 代表:**鳩笛(はとぶえ)** + **雛人形** + **干支土人形** + 招福だるま\n- 認定:**県重要無形民俗文化財**\n- 立地:**弘前市下川原**(JR 弘前駅 → 弘南バス 約 10 分)\n- 物販:阿保家工房 + 弘前駅売店 + 中三弘前店 + 道の駅\n- 価格:鳩笛 ¥600-1,500 / 干支 ¥1,500-3,500",
    region: "tohoku",
    prefecture_ja: "青森県",
    gun_ja: null,
    municipality_ja: "弘前市",
    lg_code: "02202",
    area_types: ["craft_workshop"],
    lat: 40.5814,
    lon: 140.4583,
    season_start: null,
    season_end: null,
    event_start: null,
    event_end: null,
    price_tier: 1,
    booking_window_days: null,
    closed_days: [],
    external_urls: {},
    tags: ["shimokawara_yaki", "1804_yasuchika", "abo_family_9_gen", "hatobue"],
    source: "manual",
  },
  {
    slug: "akebi-tsuru-saiku-tsugaru",
    category: "fashion",
    sub_type: "aomori_folk_craft",
    title_zh: "あけび蔓細工(津軽地方 + 西目屋村 + 弘前周辺・縄文時代由来 + アケビの蔓編籠細工+ 笊 + 籠 + バッグ+ 高耐久 + 経年美 + 民芸品代表)",
    title_ja: "あけび蔓細工",
    romaji: "Akebi Tsuru Saiku",
    summary_zh: "**あけび蔓細工は津軽地方 + 西目屋村 + 弘前周辺の伝統籠細工**(津軽全域・**縄文時代由来 + アケビ蔓編**)。**笊 + 籠 + バッグ + 花籠 等**、高耐久 + 経年で深い飴色に変化する民芸代表、現代は柳行李の代替+土産籠として活用、白神山地周辺の山菜採り文化と密接、道の駅+民芸品店で物販。",
    content_md: "- 起源:**縄文時代由来 + 津軽地方 山菜採り文化と密接**\n- 産地:**西目屋村 + 弘前周辺 + 黒石市**(白神山地周辺)\n- 素材:**アケビの蔓**(秋採取 + 冬編成 = 季節性あり)\n- 主要品:**買物籠 + 弁当籠 + 花籠 + バッグ**\n- 特色:**高耐久 + 経年で飴色に変化**(50+ 年使用例多い)\n- 物販:**道の駅 津軽白神** + **道の駅 ふかうら** + 弘前民芸品店\n- 価格:小笊 ¥3,500-7,000 / 買物籠 ¥15,000-50,000",
    region: "tohoku",
    prefecture_ja: "青森県",
    gun_ja: "中津軽郡",
    municipality_ja: "西目屋村",
    lg_code: "02343",
    area_types: ["craft_workshop", "mountain_village"],
    lat: 40.5594,
    lon: 140.3372,
    season_start: null,
    season_end: null,
    event_start: null,
    event_end: null,
    price_tier: 3,
    booking_window_days: null,
    closed_days: [],
    external_urls: {},
    tags: ["akebi_tsuru", "shirakami_sanchi", "jomon_origin", "kago_amizaiku"],
    source: "manual",
  },
];

async function main() {
  if (rows.length === 0) {
    console.log("[aomori-fashion-r1] 尚無條目");
    return;
  }
  console.log(`[aomori-fashion-r1] ${rows.length} 筆 ${DRY ? "(dry-run)" : ""}`);
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
      console.error("[aomori-fashion-r1] upsert failed:", error);
      process.exit(1);
    }
    written += batch.length;
    process.stdout.write(`\r[aomori-fashion-r1] upsert: ${written}/${rows.length}`);
  }
  process.stdout.write("\n");
  console.log(`[aomori-fashion-r1] Done — ${written} rows.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

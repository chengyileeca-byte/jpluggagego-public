// Seed 青森県 楽 R1(20 筆 / Sprint 1.5)
//
// ねぶた祭 3 大 / 八戸祭 2 / 弘前さくら 1 / 白神 2 / 奥入瀬+十和田 3 /
// 八甲田 2 / 岩木山 1 / 下北景勝 3 / 観光列車 3 = 20
//
// sub_type +6:aomori_nebuta_festival / aomori_other_festival /
// aomori_shirakami / aomori_oirase_towada / aomori_shimokita_scenic /
// aomori_local_train

import { config as loadEnv } from "dotenv";
loadEnv({ path: ".env.local" });

import { createAdminClient } from "../src/lib/supabase/admin";

const DRY = process.argv.includes("--dry-run");

interface SeedRow {
  slug: string;
  category: "entertainment";
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
  // ねぶた祭 3 大 (3) — 青森+弘前+五所川原
  // ════════════════════════════════════════════════════════════════════
  {
    slug: "aomori-nebuta-festival",
    category: "entertainment",
    sub_type: "aomori_nebuta_festival",
    title_zh: "青森ねぶた祭(青森市・8 月 2-7 日 6 夜+ 国指定重要無形民俗文化財 1980+ 横長 5m × 9m 大型武者灯籠 + 跳人(ハネト)参加可+ 全国最大級夏祭・東北三大祭)",
    title_ja: "青森ねぶた祭",
    romaji: "Aomori Nebuta Matsuri",
    summary_zh: "**青森ねぶた祭是日本最大級夏祭+東北三大祭**(青森市・**8 月 2-7 日 6 夜・国指定重要無形民俗文化財 1980**)。**横長 5m × 9m 大型武者灯籠 22 台 + 跳人(ハネト)1,000-2,000 人/台**、観光客もハネト衣装着用で踊り参加可能、最終日 8/7 海上運行+花火で締め、毎年来訪 270 万人。",
    content_md: "- 開催:**毎年 8 月 2-7 日**(6 夜)\n- 認定:**国指定重要無形民俗文化財 1980**\n- 認定:**東北三大祭**(仙台七夕 + 秋田竿燈 + 青森ねぶた)\n- 名物:**横長 5m × 9m 大型武者灯籠 22 台 + ハネト 1,000-2,000 人/台**\n- 参加:**ハネト衣装着用で誰でも踊り参加可**(衣装レンタル ¥4,000-6,000)\n- 最終日:**8/7 海上運行 + 花火**\n- 来訪:**毎年 270 万人**\n- 並列宿:**ホテル青森 + 浅虫温泉**(6 ヶ月前予約必須)\n- 並列:R1 楽 弘前ねぷた + 五所川原立佞武多 = 青森ねぶた 3 大",
    region: "tohoku",
    prefecture_ja: "青森県",
    gun_ja: null,
    municipality_ja: "青森市",
    lg_code: "02201",
    area_types: ["festival_event"],
    lat: 40.8244,
    lon: 140.7406,
    season_start: null,
    season_end: null,
    event_start: "2026-08-02",
    event_end: "2026-08-07",
    price_tier: 1,
    booking_window_days: 180,
    closed_days: [],
    external_urls: { official: "https://www.nebuta.or.jp/" },
    tags: ["aomori_nebuta", "august_2_7", "1980_designated", "tohoku_3_matsuri", "haneto"],
    source: "manual",
  },
  {
    slug: "hirosaki-neputa-festival",
    category: "entertainment",
    sub_type: "aomori_nebuta_festival",
    title_zh: "弘前ねぷたまつり(弘前市・8 月 1-7 日 7 夜+ 国指定重要無形民俗文化財 1980+ 扇型 8m 高ねぷた 80 台+ 「ヤーヤドー」掛声+ 武者絵 + 鏡絵で構成+ 静寂祭の風情)",
    title_ja: "弘前ねぷたまつり",
    romaji: "Hirosaki Neputa Matsuri",
    summary_zh: "**弘前ねぷたまつりは扇型ねぷたが特徴**(弘前市・**8 月 1-7 日 7 夜・国指定重要無形民俗文化財 1980**)。**扇型 8m 高ねぷた 80 台 + 「ヤーヤドー」掛声 + 武者絵(表)+鏡絵(裏)構成**、青森ねぶたよりも静寂で歴史風情ある祭、観光客は沿道観賞のみ参加不可、毎年来訪 160 万人。",
    content_md: "- 開催:**毎年 8 月 1-7 日**(7 夜)\n- 認定:**国指定重要無形民俗文化財 1980**\n- 名物:**扇型 8m 高ねぷた 80 台**(青森横長 vs 弘前扇型 vs 五所川原立=縦長)\n- 掛声:**「ヤーヤドー」**(青森「ラッセラー」と区別)\n- 図絵:**武者絵(表)+ 鏡絵(裏)**(青森ねぶたは正面のみ)\n- 来訪:**毎年 160 万人**\n- 並列宿:**アートホテル弘前シティ + 大鰐温泉**(6 ヶ月前予約)\n- 注意:**沿道観賞のみ・参加不可**(青森ねぶたと違う)",
    region: "tohoku",
    prefecture_ja: "青森県",
    gun_ja: null,
    municipality_ja: "弘前市",
    lg_code: "02202",
    area_types: ["festival_event"],
    lat: 40.6063,
    lon: 140.4641,
    season_start: null,
    season_end: null,
    event_start: "2026-08-01",
    event_end: "2026-08-07",
    price_tier: 1,
    booking_window_days: 180,
    closed_days: [],
    external_urls: {},
    tags: ["hirosaki_neputa", "august_1_7", "1980_designated", "fan_shape_8m", "ya_ya_do"],
    source: "manual",
  },
  {
    slug: "goshogawara-tachineputa-festival",
    category: "entertainment",
    sub_type: "aomori_nebuta_festival",
    title_zh: "五所川原立佞武多(五所川原市・8 月 4-8 日 5 夜+ 縦長 22-23m 巨大ねぷた 3 台+ 7 階建て高さ+ 「ヤッテマレ」掛声+ 1996 復活祭+ 立佞武多の館展示)",
    title_ja: "五所川原立佞武多",
    romaji: "Goshogawara Tachineputa",
    summary_zh: "**五所川原立佞武多是 縦長 22-23m 巨大ねぷた**(五所川原市・**8 月 4-8 日 5 夜**)。**7 階建て高さ + 「ヤッテマレ」掛声 + 1996 復活祭**(明治期の立佞武多が 1907 火災 + 電線敷設で消滅 → 1996 住民有志が復活)、青森ねぶた + 弘前ねぷた より圧倒的な高さ、立佞武多の館で常設展示も。",
    content_md: "- 開催:**毎年 8 月 4-8 日**(5 夜)\n- 名物:**縦長 22-23m 巨大ねぷた 3 台**(7 階建て高さ)\n- 掛声:**「ヤッテマレ」**\n- 復活史:**明治期 → 1907 火災 + 電線敷設で消滅 → 1996 住民有志復活**\n- 比較:青森(横長 5m)< 弘前(扇 8m)< 五所川原立(縦 22m)\n- 並列観光:**立佞武多の館 + 斜陽館 + 津軽鉄道**(全部金木方面)\n- 並列:R1 楽 青森ねぶた + 弘前ねぷた + 五所川原立 = 青森ねぶた 3 大",
    region: "tohoku",
    prefecture_ja: "青森県",
    gun_ja: null,
    municipality_ja: "五所川原市",
    lg_code: "02205",
    area_types: ["festival_event"],
    lat: 40.8067,
    lon: 140.4419,
    season_start: null,
    season_end: null,
    event_start: "2026-08-04",
    event_end: "2026-08-08",
    price_tier: 1,
    booking_window_days: 180,
    closed_days: [],
    external_urls: { official: "https://www.tachineputa.jp/" },
    tags: ["tachineputa", "august_4_8", "22_23m_height", "1996_revival", "yatte_mare"],
    source: "manual",
  },

  // ════════════════════════════════════════════════════════════════════
  // 八戸祭 (2) — 三社大祭+えんぶり
  // ════════════════════════════════════════════════════════════════════
  {
    slug: "hachinohe-sansha-taisai",
    category: "entertainment",
    sub_type: "aomori_other_festival",
    title_zh: "八戸三社大祭(八戸市・7 月 31 日-8 月 4 日 5 日間+ ユネスコ無形文化遺産 2016+ 国指定重要無形民俗文化財 2004+ 11m 高山車 27 台+ 290+ 年伝統)",
    title_ja: "八戸三社大祭",
    romaji: "Hachinohe Sansha Taisai",
    summary_zh: "**八戸三社大祭是 南部地方最大祭**(八戸市・**7 月 31 日-8 月 4 日 5 日間**)。**ユネスコ無形文化遺産 2016 (山・鉾・屋台) + 国指定重要無形民俗文化財 2004**、**11m 高山車 27 台 + 神輿+ 290+ 年伝統 (1721 起源)**、おがみ神社 + 長者山新羅神社 + 神明宮の三社合同祭、来訪 130 万人。",
    content_md: "- 開催:**毎年 7 月 31 日-8 月 4 日**(5 日間)\n- 認定:**UNESCO 無形文化遺産 2016**(山・鉾・屋台行事)\n- 認定:**国指定重要無形民俗文化財 2004**\n- 起源:**1721 年・290+ 年伝統**\n- 名物:**11m 高山車 27 台 + 神輿**\n- 三社:**おがみ神社 + 長者山新羅神社 + 神明宮**\n- 来訪:**毎年 130 万人**\n- 並列宿:**ダイワロイネット八戸 + さくら野百貨店周辺**(6 ヶ月前予約)\n- 並列:R1 楽 八戸えんぶり = 八戸 2 大祭",
    region: "tohoku",
    prefecture_ja: "青森県",
    gun_ja: null,
    municipality_ja: "八戸市",
    lg_code: "02203",
    area_types: ["festival_event"],
    lat: 40.5121,
    lon: 141.4884,
    season_start: null,
    season_end: null,
    event_start: "2026-07-31",
    event_end: "2026-08-04",
    price_tier: 1,
    booking_window_days: 180,
    closed_days: [],
    external_urls: {},
    tags: ["sansha_taisai", "july31_aug4", "unesco_2016", "11m_dashi", "1721_origin"],
    source: "manual",
  },
  {
    slug: "hachinohe-enburi",
    category: "entertainment",
    sub_type: "aomori_other_festival",
    title_zh: "八戸えんぶり(八戸市・2 月 17-20 日 4 日間+ 国指定重要無形民俗文化財 1979+ 八戸地方豊作祈願春迎祭+ えぼし烏帽子の舞+ 厳冬期 800+ 年伝統)",
    title_ja: "八戸えんぶり",
    romaji: "Hachinohe Enburi",
    summary_zh: "**八戸えんぶりは厳冬期の春迎祭**(八戸市・**2 月 17-20 日 4 日間**)。**国指定重要無形民俗文化財 1979 + 八戸地方豊作祈願春迎祭 + 800+ 年伝統 (鎌倉期源流)**、**えぼし烏帽子被った太夫が摺り(田植え動作)を演じる舞**、雪降る厳冬期の祭で観光客は冬のリピーターに人気、来訪 30 万人。",
    content_md: "- 開催:**毎年 2 月 17-20 日**(4 日間)\n- 認定:**国指定重要無形民俗文化財 1979**\n- 起源:**鎌倉期 (800+ 年前) + 春迎えの豊作祈願**\n- 名物:**えぼし烏帽子被った太夫の摺り(田植え動作)舞**\n- 開催地:**八戸市中心市街地 + 長者山新羅神社 + えんぶり公開**\n- 来訪:**毎年 30 万人**(三社大祭より少なく観光客集中度低い)\n- 並列宿:**ダイワロイネット八戸**(2 月閑散期で予約易い)\n- 並列:R1 楽 八戸三社大祭 = 八戸 2 大祭",
    region: "tohoku",
    prefecture_ja: "青森県",
    gun_ja: null,
    municipality_ja: "八戸市",
    lg_code: "02203",
    area_types: ["festival_event"],
    lat: 40.5121,
    lon: 141.4884,
    season_start: null,
    season_end: null,
    event_start: "2026-02-17",
    event_end: "2026-02-20",
    price_tier: 1,
    booking_window_days: 60,
    closed_days: [],
    external_urls: {},
    tags: ["enburi", "february_17_20", "1979_designated", "eboshi_dayu", "kamakura_origin"],
    source: "manual",
  },

  // ════════════════════════════════════════════════════════════════════
  // 弘前さくらまつり (1) — 日本三大桜+GW 包含
  // ════════════════════════════════════════════════════════════════════
  {
    slug: "hirosaki-sakura-festival",
    category: "entertainment",
    sub_type: "aomori_other_festival",
    title_zh: "弘前さくらまつり(弘前公園・4 月下-5 月上 GW 包含+ 桜 2,600 本日本三大桜+ 1918 第 1 回 100+ 年+ 弘前城天守 + 桜 同時観賞+ 来訪 200 万人)",
    title_ja: "弘前さくらまつり",
    romaji: "Hirosaki Sakura Matsuri",
    summary_zh: "**弘前さくらまつりは 日本三大桜名所の一つ**(弘前公園・**4 月下-5 月上 GW 包含**)。**桜 2,600 本(50+ 品種) + 1918 第 1 回 100+ 年 + 弘前城天守 + 桜 同時観賞**、夜のライトアップ + 花筏 + 桜のトンネル 2.6km、来訪 200 万人、桜の開花は 4 月 20 日前後で年により変動。",
    content_md: "- 開催:**4 月下-5 月上 GW 包含**(年により 4/20-5/5 前後・開花次第)\n- 開始:**1918 年 第 1 回・107 年**\n- 桜:**2,600 本 50+ 品種**(ソメイヨシノ + 八重桜 + シダレザクラ)\n- 認定:**日本三大桜名所**(吉野山+ 高遠城+ 弘前城)\n- 名物:**弘前城天守 + 桜 + 岩木山 同時観賞 + 花筏 + 夜ライトアップ**\n- 来訪:**毎年 200 万人**\n- 並列宿:**アートホテル弘前シティ**(6 ヶ月前予約必須)\n- 入園:**桜まつり期間 ¥320**(本丸+北の郭)",
    region: "tohoku",
    prefecture_ja: "青森県",
    gun_ja: null,
    municipality_ja: "弘前市",
    lg_code: "02202",
    area_types: ["festival_event", "scenic_spot"],
    lat: 40.6075,
    lon: 140.4644,
    season_start: null,
    season_end: null,
    event_start: "2026-04-23",
    event_end: "2026-05-05",
    price_tier: 1,
    booking_window_days: 180,
    closed_days: [],
    external_urls: { official: "https://www.hirosakipark.jp/" },
    tags: ["hirosaki_sakura", "1918_first", "japan_3_sakura", "2600_trees", "gw_peak"],
    source: "manual",
  },

  // ════════════════════════════════════════════════════════════════════
  // 白神山地 (2) — 十二湖+暗門の滝
  // ════════════════════════════════════════════════════════════════════
  {
    slug: "shirakami-juniko",
    category: "entertainment",
    sub_type: "aomori_shirakami",
    title_zh: "十二湖(深浦町・白神山地世遺バッファゾーン+ 33 湖大小+ 「青池」コバルトブルー絶景+ ブナ原生林散策+ 五能線リゾートしらかみ十二湖駅徒歩 + 5-11 月旬)",
    title_ja: "十二湖",
    romaji: "Jūniko",
    summary_zh: "**十二湖是白神山地世遺周辺の湖沼群**(西津軽郡深浦町・**1993 白神山地世遺登録のバッファゾーン**)。**33 湖大小+ 「青池」コバルトブルー絶景 + ブナ原生林散策**、五能線リゾートしらかみ「十二湖駅」徒歩 → 山道散策 60-90 分、5-11 月散策可能、12-4 月積雪閉鎖。",
    content_md: "- 立地:**西津軽郡深浦町松神**(白神山地南西麓)\n- 認定:**白神山地世遺バッファゾーン 1993**\n- 名物:**33 湖大小 + 「青池」コバルトブルー絶景**\n- 散策:**ブナ原生林散策路 60-90 分**\n- アクセス:**五能線リゾートしらかみ 十二湖駅 → 弘南バス 約 15 分**\n- 営業期:**5-11 月**(12-4 月積雪閉鎖)\n- 並列宿:**黄金崎不老ふ死温泉**(車 30 分)",
    region: "tohoku",
    prefecture_ja: "青森県",
    gun_ja: "西津軽郡",
    municipality_ja: "深浦町",
    lg_code: "02323",
    area_types: ["scenic_spot", "mountain_village"],
    lat: 40.5511,
    lon: 139.9842,
    season_start: "2026-05-01",
    season_end: "2026-11-30",
    event_start: null,
    event_end: null,
    price_tier: 1,
    booking_window_days: null,
    closed_days: [],
    external_urls: {},
    tags: ["juniko", "shirakami_buffer", "ao_ike", "33_lakes", "may_november"],
    source: "manual",
  },
  {
    slug: "anmon-falls-shirakami",
    category: "entertainment",
    sub_type: "aomori_shirakami",
    title_zh: "暗門の滝(西目屋村・白神山地世遺コア地+ 三の滝+二の滝+一の滝 3 段+ 上中下 26m+37m+42m+ アクアグリーンビレッジ ANMON 登山口+ 5-10 月)",
    title_ja: "暗門の滝",
    romaji: "Anmon no Taki",
    summary_zh: "**暗門の滝は 白神山地世遺コア地の 3 段瀑布**(中津軽郡西目屋村・**1993 世遺コアゾーン外縁**)。**三の滝(下 26m)+ 二の滝(中 37m)+ 一の滝(上 42m)** 3 段、アクアグリーンビレッジ ANMON 登山口 → 一の滝まで往復 4-5 時間、ブナ原生林沿の本格ハイキング、5-10 月のみ。",
    content_md: "- 立地:**中津軽郡西目屋村**(白神山地世遺コア外縁)\n- 構成:**三の滝(下 26m)+ 二の滝(中 37m)+ 一の滝(上 42m)** 3 段\n- 登山口:**アクアグリーンビレッジ ANMON**(R1 住)\n- 所要:**往復 4-5 時間**(一の滝まで・本格ハイキング)\n- 営業期:**5-10 月**(11-4 月積雪閉鎖)\n- アクセス:**弘前駅 → 弘南バス西目屋線 約 60 分 → ANMON 登山口**\n- 装備:**登山靴+雨具必須**(沢沿い + 急登あり)",
    region: "tohoku",
    prefecture_ja: "青森県",
    gun_ja: "中津軽郡",
    municipality_ja: "西目屋村",
    lg_code: "02343",
    area_types: ["scenic_spot", "mountain_village"],
    lat: 40.5306,
    lon: 140.2611,
    season_start: "2026-05-01",
    season_end: "2026-10-31",
    event_start: null,
    event_end: null,
    price_tier: 1,
    booking_window_days: null,
    closed_days: [],
    external_urls: {},
    tags: ["anmon_no_taki", "shirakami_core", "3_falls", "may_october"],
    source: "manual",
  },

  // ════════════════════════════════════════════════════════════════════
  // 奥入瀬+十和田 (3) — 渓流+湖+蔦沼
  // ════════════════════════════════════════════════════════════════════
  {
    slug: "oirase-keiryu",
    category: "entertainment",
    sub_type: "aomori_oirase_towada",
    title_zh: "奥入瀬渓流(十和田市・十和田湖から流出 14km 渓流+ 銚子大滝 + 雲井の滝+ 阿修羅の流れ等 数 10 滝+ 国特別名勝 + 国天然記念物 1928+ 5-11 月散策旬)",
    title_ja: "奥入瀬渓流",
    romaji: "Oirase Keiryū",
    summary_zh: "**奥入瀬渓流は十和田湖から流出 14km の渓流**(十和田市奥瀬・**国特別名勝 + 国天然記念物 1928**)。**銚子大滝(7m × 20m)+ 雲井の滝 + 阿修羅の流れ + 阿修羅の流れ + 数 10 滝**、5-11 月散策旬(新緑 6 月 + 紅葉 10 月下)、徒歩 + 自転車 + バス散策、紅葉期は道路渋滞激しい。",
    content_md: "- 立地:**十和田市奥瀬**(十和田湖から流出 14km 渓流)\n- 認定:**国特別名勝 + 国天然記念物 1928**\n- 名物:**銚子大滝(7m × 20m)+ 雲井の滝 + 阿修羅の流れ + 数 10 滝**\n- 旬:**5-6 月新緑 + 10 月下-11 月上紅葉**\n- 所要:**全 14km 徒歩 4-5 時間 / 自転車 2 時間 / バス 30 分**\n- 並列宿:**星野奥入瀬渓流ホテル + 蔦温泉旅館**\n- 注意:**紅葉期 (10/下-11/上) 道路渋滞激しい・始発 7-9 時推奨**",
    region: "tohoku",
    prefecture_ja: "青森県",
    gun_ja: null,
    municipality_ja: "十和田市",
    lg_code: "02206",
    area_types: ["scenic_spot"],
    lat: 40.5236,
    lon: 140.9569,
    season_start: "2026-05-01",
    season_end: "2026-11-15",
    event_start: null,
    event_end: null,
    price_tier: 1,
    booking_window_days: null,
    closed_days: [],
    external_urls: {},
    tags: ["oirase_keiryu", "14km", "1928_special_natural", "choshi_otaki", "october_koyo"],
    source: "manual",
  },
  {
    slug: "towada-lake-cruise",
    category: "entertainment",
    sub_type: "aomori_oirase_towada",
    title_zh: "十和田湖遊覧船(十和田湖・休屋-子ノ口 50 分往復+ 二重カルデラ湖+ 国特別名勝 + 国天然記念物+ 高村光太郎「乙女像」+ 4-11 月運航)",
    title_ja: "十和田湖遊覧船",
    romaji: "Towadako Yūransen",
    summary_zh: "**十和田湖遊覧船は 二重カルデラ湖を巡る遊覧船**(十和田市奥瀬・**休屋-子ノ口 50 分往復**)。**二重カルデラ湖 + 国特別名勝 + 国天然記念物**、休屋港に**高村光太郎「乙女像」 1953**、奥入瀬渓流の起点(子ノ口)+ 終点(休屋)で散策と組合せ、4-11 月運航、12-3 月閉鎖。",
    content_md: "- 立地:**十和田市奥瀬・十和田湖**(秋田県境カルデラ湖)\n- 名物:**二重カルデラ湖 + 高村光太郎「乙女像」1953 設置**\n- 認定:**国特別名勝 + 国天然記念物**\n- 航路:**休屋-子ノ口 50 分**(片道 ¥1,650 / 往復 ¥3,100)\n- 営業期:**4 月-11 月**(12-3 月閉鎖)\n- 連結:奥入瀬渓流散策と組合せ(子ノ口=渓流起点)\n- 並列宿:**十和田湖畔旅館群 + 蔦温泉**",
    region: "tohoku",
    prefecture_ja: "青森県",
    gun_ja: null,
    municipality_ja: "十和田市",
    lg_code: "02206",
    area_types: ["scenic_spot"],
    lat: 40.4636,
    lon: 140.8825,
    season_start: "2026-04-01",
    season_end: "2026-11-30",
    event_start: null,
    event_end: null,
    price_tier: 2,
    booking_window_days: null,
    closed_days: [],
    external_urls: { official: "https://www.toutetsu.co.jp/ship.html" },
    tags: ["towada_cruise", "double_caldera", "otome_zo_1953", "april_november"],
    source: "manual",
  },
  {
    slug: "tsuta-numa-koyo",
    category: "entertainment",
    sub_type: "aomori_oirase_towada",
    title_zh: "蔦沼紅葉(十和田市奥瀬・蔦温泉旅館徒歩 5 分+ 10 月下-11 月上 紅葉燃え絶景+ 早朝赤いリフレクション撮影名所+ 蔦の七沼コース)",
    title_ja: "蔦沼",
    romaji: "Tsuta-numa",
    summary_zh: "**蔦沼は 紅葉燃え絶景の沼**(十和田市奥瀬・**蔦温泉旅館徒歩 5 分**)。**10 月下-11 月上 紅葉ピーク + 早朝赤いリフレクション撮影名所**、蔦の七沼コース(1 周 60 分)、紅葉期は早朝 4-5 時撮影者で混雑、整理券制度導入時期もあり、紅葉期間は時刻チェック必要。",
    content_md: "- 立地:**十和田市奥瀬蔦野湯**(蔦温泉旅館徒歩 5 分)\n- 旬:**10 月下-11 月上 紅葉ピーク** (年により変動)\n- 名物:**早朝(4-6 時)赤いリフレクション**\n- 散策:**蔦の七沼コース 1 周 60 分**\n- 注意:**紅葉期 早朝撮影者で混雑 + 整理券制度の年も**\n- 並列宿:**蔦温泉旅館** で前泊推奨\n- アクセス:**JR 八戸駅 → JR バス約 80 分**",
    region: "tohoku",
    prefecture_ja: "青森県",
    gun_ja: null,
    municipality_ja: "十和田市",
    lg_code: "02206",
    area_types: ["scenic_spot"],
    lat: 40.5158,
    lon: 140.9572,
    season_start: "2026-10-15",
    season_end: "2026-11-10",
    event_start: null,
    event_end: null,
    price_tier: 1,
    booking_window_days: null,
    closed_days: [],
    external_urls: {},
    tags: ["tsuta_numa", "october_late_koyo", "early_morning_reflection", "7_numa"],
    source: "manual",
  },

  // ════════════════════════════════════════════════════════════════════
  // 八甲田 (2) — ロープウェー+樹氷
  // ════════════════════════════════════════════════════════════════════
  {
    slug: "hakkoda-ropeway",
    category: "entertainment",
    sub_type: "aomori_hakkoda",
    title_zh: "八甲田ロープウェー(青森市・八甲田山麓駅-山頂駅 10 分+ 標高 660-1,324m+ 1968 開業+ 冬樹氷観賞+ 夏八甲田登山入口+ 紅葉 10 月)",
    title_ja: "八甲田ロープウェー",
    romaji: "Hakkōda Ropeway",
    summary_zh: "**八甲田ロープウェーは八甲田山麓-山頂を結ぶロープウェー**(青森市八甲田・**1968 年開業**)。**山麓駅(660m)-山頂駅(1,324m) 10 分** 、**冬樹氷観賞 + 夏八甲田登山入口 + 紅葉 10 月絶景**、片道 ¥1,650 / 往復 ¥2,000、青森駅から JR バス十和田北線 70 分。",
    content_md: "- 立地:**青森市八甲田**(青森駅 → JR バス十和田北 70 分)\n- 開業:**1968 年・57 年**\n- 標高差:**山麓 660m - 山頂 1,324m**(乗車 10 分)\n- 名物:**冬樹氷観賞(1-3 月)+ 夏八甲田登山+ 紅葉 10 月**\n- 料金:**片道 ¥1,650 / 往復 ¥2,000**\n- 営業期:**通年運行**(暴風雪時運休あり)\n- 並列宿:**八甲田ホテル(山麓駅徒歩 1 分)+ 酸ヶ湯**\n- 並列観光:**酸ヶ湯温泉 + 八甲田大岳登山**",
    region: "tohoku",
    prefecture_ja: "青森県",
    gun_ja: null,
    municipality_ja: "青森市",
    lg_code: "02201",
    area_types: ["scenic_spot", "mountain_village", "transit_hub"],
    lat: 40.6644,
    lon: 140.8567,
    season_start: null,
    season_end: null,
    event_start: null,
    event_end: null,
    price_tier: 2,
    booking_window_days: null,
    closed_days: [],
    external_urls: { official: "https://www.hakkoda-ropeway.jp/" },
    tags: ["hakkoda_ropeway", "1968", "660_to_1324m", "juhyo", "year_round"],
    source: "manual",
  },
  {
    slug: "hakkoda-juhyo-snow-monsters",
    category: "entertainment",
    sub_type: "aomori_hakkoda",
    title_zh: "八甲田樹氷(青森市八甲田・1-3 月厳冬期+ アオモリトドマツに着氷雪の白い巨像+ 山形蔵王 + 八甲田 = 日本二大樹氷+ ロープウェー山頂駅+ 山頂遊歩道散策)",
    title_ja: "八甲田樹氷",
    romaji: "Hakkōda Juhyō",
    summary_zh: "**八甲田樹氷は アオモリトドマツに着氷雪の白い巨像**(青森市八甲田・**1-3 月厳冬期**)。**山形蔵王 + 八甲田 = 日本二大樹氷**、八甲田ロープウェー山頂駅(1,324m)から山頂遊歩道散策で間近観賞、防寒装備必須(氷点下 -10〜-20℃)、ロープウェー往復 ¥2,000 + 樹氷観賞無料。",
    content_md: "- 立地:**青森市八甲田・ロープウェー山頂駅 (1,324m)**\n- 旬:**1-3 月厳冬期**\n- 形成:**アオモリトドマツ (青森椴松) に着氷雪 (海風水蒸気凍結)**\n- 認定:**日本二大樹氷**(山形蔵王 + 青森八甲田)\n- 装備:**防寒着 + 防水ブーツ + ゴーグル必須**(氷点下 -10〜-20℃)\n- アクセス:**ロープウェー往復 ¥2,000 + 樹氷観賞無料**\n- 並列宿:**八甲田ホテル(山麓駅徒歩 1 分)+ 酸ヶ湯**",
    region: "tohoku",
    prefecture_ja: "青森県",
    gun_ja: null,
    municipality_ja: "青森市",
    lg_code: "02201",
    area_types: ["scenic_spot", "mountain_village"],
    lat: 40.6644,
    lon: 140.8567,
    season_start: "2026-01-01",
    season_end: "2026-03-15",
    event_start: null,
    event_end: null,
    price_tier: 2,
    booking_window_days: null,
    closed_days: [],
    external_urls: {},
    tags: ["hakkoda_juhyo", "january_march", "aomori_todomatsu", "japan_2_juhyo"],
    source: "manual",
  },

  // ════════════════════════════════════════════════════════════════════
  // 岩木山 (1) — 津軽富士+登山リフト
  // ════════════════════════════════════════════════════════════════════
  {
    slug: "iwakisan-tsugaru-fuji",
    category: "entertainment",
    sub_type: "aomori_oirase_towada",
    title_zh: "岩木山(津軽富士・1,625m 青森最高峰+ 「お山」津軽信仰山 + 岩木山神社 + 8 合目駐車場 + 9 合目リフト + 山頂往復ハイキング 60 分)",
    title_ja: "岩木山",
    romaji: "Iwakisan",
    summary_zh: "**岩木山は 「津軽富士」と呼ばれる青森最高峰**(弘前市・**1,625m**)。**津軽信仰山「お山」+ 岩木山神社(R1 育)山麓 + 山頂往復ハイキング**、車で 8 合目駐車場まで(津軽岩木スカイライン)+ 9 合目リフト + 山頂往復 60 分、4 月下-10 月運営、登山初心者でも山頂到達可能。",
    content_md: "- 立地:**弘前市岩木**(青森県西部・1,625m 青森最高峰)\n- 別称:**「津軽富士」 + 津軽信仰山「お山」**\n- アクセス:**津軽岩木スカイライン**(車・有料 ¥1,830 + 8 合目駐車場 + 9 合目リフト)\n- 営業期:**4 月下-10 月**(冬期閉鎖)\n- 山頂:**9 合目リフト → 徒歩 30-40 分 → 山頂(片道)**\n- 並列観光:**岩木山神社 + アップル公園 + 嶽きみロード**\n- 並列:R1 育 岩木山神社 = 岩木山セットコース",
    region: "tohoku",
    prefecture_ja: "青森県",
    gun_ja: null,
    municipality_ja: "弘前市",
    lg_code: "02202",
    area_types: ["scenic_spot", "mountain_village"],
    lat: 40.6533,
    lon: 140.3047,
    season_start: "2026-04-25",
    season_end: "2026-10-31",
    event_start: null,
    event_end: null,
    price_tier: 2,
    booking_window_days: null,
    closed_days: [],
    external_urls: {},
    tags: ["iwakisan", "tsugaru_fuji", "1625m", "skyline_lift", "april_october"],
    source: "manual",
  },

  // ════════════════════════════════════════════════════════════════════
  // 下北景勝 (3) — 仏ヶ浦+恐山+尻屋崎
  // ════════════════════════════════════════════════════════════════════
  {
    slug: "hotokegaura-shimokita",
    category: "entertainment",
    sub_type: "aomori_shimokita_scenic",
    title_zh: "仏ヶ浦(下北郡佐井村・国名勝 1934 + 国天然記念物 1941 + 凝灰岩奇岩 2km 海岸+ 仏像連峰名+ 佐井港遊覧船 + 5-10 月運航 + 12-3 月閉鎖)",
    title_ja: "仏ヶ浦",
    romaji: "Hotokegaura",
    summary_zh: "**仏ヶ浦は下北西海岸の凝灰岩奇岩 2km 海岸**(下北郡佐井村・**国名勝 1934 + 国天然記念物 1941**)。**仏像のような白い奇岩 + 海食洞 + 妙縁の松 等 「仏像連峰」名 + 5-10 月遊覧船運航**、佐井港(風間浦村方面隣)から遊覧船 30 分 + 仏ヶ浦上陸 30-50 分、12-3 月閉鎖。",
    content_md: "- 立地:**下北郡佐井村**(下北半島西海岸・本州最北西端)\n- 認定:**国名勝 1934 + 国天然記念物 1941**\n- 名物:**凝灰岩奇岩 2km 海岸 + 「仏像連峰」 + 海食洞**\n- アクセス:**佐井港遊覧船 30 分 + 仏ヶ浦上陸 30-50 分**\n- 営業期:**5-10 月**(12-3 月閉鎖)\n- 料金:**遊覧船往復 ¥2,500-3,500**\n- 並列観光:**大間崎 (車 60 分) + 下風呂温泉 (車 30 分)**",
    region: "tohoku",
    prefecture_ja: "青森県",
    gun_ja: "下北郡",
    municipality_ja: "佐井村",
    lg_code: "02426",
    area_types: ["scenic_spot", "coastal"],
    lat: 41.3464,
    lon: 140.7972,
    season_start: "2026-05-01",
    season_end: "2026-10-31",
    event_start: null,
    event_end: null,
    price_tier: 2,
    booking_window_days: null,
    closed_days: [],
    external_urls: {},
    tags: ["hotokegaura", "1934_meisho", "1941_natural_monument", "tuff_cliffs", "may_october"],
    source: "manual",
  },
  {
    slug: "osorezan-shimokita-spirit",
    category: "entertainment",
    sub_type: "aomori_shimokita_scenic",
    title_zh: "恐山(むつ市・862 慈覚大師円仁開山+ 日本三大霊場 + 比叡山 + 高野山 並ぶ+ 5-10 月開山 + 7 月 20-24 日大祭+ イタコ口寄せ + 賽の河原 + 極楽浜)",
    title_ja: "恐山",
    romaji: "Osorezan",
    summary_zh: "**恐山是 日本三大霊場**(むつ市田名部宇曽利・**862 年 慈覚大師円仁開山・1,160+ 年**)。**比叡山 + 高野山 + 恐山 = 日本三大霊場**、5-10 月開山(冬閉鎖)、**7 月 20-24 日大祭でイタコ(青森巫女)口寄せ + 賽の河原 + 極楽浜 + 三途の川**、入山 ¥500、JR 下北駅 → 下北交通バス約 45 分。",
    content_md: "- 立地:**むつ市田名部宇曽利**(恐山菩提寺・宇曽利湖畔)\n- 開山:**862 年 慈覚大師円仁・1,160+ 年**\n- 認定:**日本三大霊場**(比叡山 + 高野山 + 恐山)\n- 営業期:**5 月 1 日-10 月 31 日**(11-4 月積雪閉鎖)\n- 大祭:**7 月 20-24 日**(イタコ口寄せ + 大法要)\n- 名物:**賽の河原 + 極楽浜 + 三途の川 + 宇曽利湖 + 硫黄泉境内浴**\n- 入山:**¥500**(菩提寺)\n- アクセス:**JR 下北駅 → 下北交通バス 約 45 分**",
    region: "tohoku",
    prefecture_ja: "青森県",
    gun_ja: null,
    municipality_ja: "むつ市",
    lg_code: "02208",
    area_types: ["shrine_temple", "scenic_spot"],
    lat: 41.3247,
    lon: 141.0944,
    season_start: "2026-05-01",
    season_end: "2026-10-31",
    event_start: "2026-07-20",
    event_end: "2026-07-24",
    price_tier: 1,
    booking_window_days: null,
    closed_days: [],
    external_urls: {},
    tags: ["osorezan", "862_ennin", "japan_3_reijo", "itako", "saino_kawara"],
    source: "manual",
  },
  {
    slug: "shiriya-zaki-shimokita",
    category: "entertainment",
    sub_type: "aomori_shimokita_scenic",
    title_zh: "尻屋崎(下北郡東通村・本州最東北端 + 寒立馬(かんだちめ)野生馬群+ 尻屋崎灯台 1876 完成 + 国指定重要文化財 + 4-12 月開放 + 1-3 月閉鎖期あり)",
    title_ja: "尻屋崎",
    romaji: "Shiriyazaki",
    summary_zh: "**尻屋崎は本州最東北端 + 寒立馬野生馬群名所**(下北郡東通村・**本州最東北端**)。**寒立馬(かんだちめ)= 南部馬の血統 + 厳冬期も野放し越冬 + 県天然記念物**、**尻屋崎灯台 1876 + 国指定重要文化財**、JR 下北駅 → 下北交通バス約 60 分、4-12 月公道開放(1-3 月閉鎖)。",
    content_md: "- 立地:**下北郡東通村尻屋**(本州最東北端・太平洋側)\n- 名物:**寒立馬(かんだちめ)野生馬群**(南部馬血統・県天然記念物)\n- 灯台:**尻屋崎灯台 1876 完成 + 国指定重要文化財**(東北最古洋式灯台)\n- 営業期:**4-12 月公道開放**(1-3 月積雪閉鎖)\n- アクセス:**JR 下北駅 → 下北交通バス 約 60 分**\n- 並列観光:**恐山(車 50 分)+ 尻屋崎ウインドーファーム**",
    region: "tohoku",
    prefecture_ja: "青森県",
    gun_ja: "下北郡",
    municipality_ja: "東通村",
    lg_code: "02424",
    area_types: ["scenic_spot", "coastal"],
    lat: 41.4258,
    lon: 141.4556,
    season_start: "2026-04-01",
    season_end: "2026-12-31",
    event_start: null,
    event_end: null,
    price_tier: 1,
    booking_window_days: null,
    closed_days: [],
    external_urls: {},
    tags: ["shiriyazaki", "honshu_northeast_end", "kandachime_horses", "1876_lighthouse"],
    source: "manual",
  },

  // ════════════════════════════════════════════════════════════════════
  // 観光列車 (3) — 五能線+津軽鉄道ストーブ列車+八戸線
  // ════════════════════════════════════════════════════════════════════
  {
    slug: "gono-line-resort-shirakami",
    category: "entertainment",
    sub_type: "aomori_local_train",
    title_zh: "五能線リゾートしらかみ(青森-秋田 5 時間+ 1997 運行開始+ JR東日本+ 日本海沿岸+ 千畳敷+十二湖+ 不老ふ死温泉 アクセス+ 全車指定席+ 全 3 編成)",
    title_ja: "リゾートしらかみ",
    romaji: "Resort Shirakami",
    summary_zh: "**リゾートしらかみは五能線(青森-秋田)の観光列車**(JR東日本・**1997 運行開始 28 年**)。**全車指定席 + 全 3 編成(青池・橅・くまげら)+ 5 時間 全区間 ¥7,400-**、日本海沿岸 + 白神山地 + 千畳敷 + 十二湖 + 不老ふ死温泉アクセス、青森と秋田を結ぶ代表観光列車。",
    content_md: "- 運行:**JR 東日本五能線(青森-秋田 全区間 5 時間)**\n- 開始:**1997 年・28 年**\n- 全 3 編成:**青池 + 橅(ぶな) + くまげら**\n- 沿線:**日本海沿岸 + 白神山地 + 千畳敷 + 十二湖 + 不老ふ死温泉**\n- 料金:**全区間 ¥7,400-**(指定席含む)\n- 全車指定席:**6 ヶ月前予約推奨**(GW + 紅葉期 早期満員)\n- 並列観光:R1 楽 十二湖 + R1 食 深浦マグロ + R1 住 不老ふ死",
    region: "tohoku",
    prefecture_ja: "青森県",
    gun_ja: null,
    municipality_ja: "青森市",
    lg_code: "02201",
    area_types: ["transit_hub", "scenic_spot"],
    lat: 40.8244,
    lon: 140.7406,
    season_start: null,
    season_end: null,
    event_start: null,
    event_end: null,
    price_tier: 3,
    booking_window_days: 180,
    closed_days: [],
    external_urls: { official: "https://www.jreast.co.jp/railway/joyful/shirakami.html" },
    tags: ["resort_shirakami", "1997", "gono_line", "3_compositions", "ao_ike_buna_kumagera"],
    source: "manual",
  },
  {
    slug: "tsugaru-railway-stove-train",
    category: "entertainment",
    sub_type: "aomori_local_train",
    title_zh: "津軽鉄道ストーブ列車(津軽五所川原-津軽中里 21km+ 1930 開業+ 12 月-3 月運行+ 客車内薪ストーブ + するめ焼き + 太宰治『津軽』ゆかり)",
    title_ja: "ストーブ列車",
    romaji: "Stove Train",
    summary_zh: "**ストーブ列車は津軽鉄道の冬限定客車**(五所川原市-中泊町・**12 月-3 月運行**)。**津軽五所川原-津軽中里 21km + 1930 開業 95 年 + 客車内薪ストーブ + するめ焼き(車内売店)**、太宰治『津軽』(1944)の舞台、ストーブ料金 ¥500 別途、JR 五能線 五所川原駅で乗換。",
    content_md: "- 運行:**津軽鉄道線(五所川原市-中泊町 津軽中里 21km)**\n- 開業:**1930 年・95 年**\n- 運行期:**12 月 1 日-3 月 31 日**(冬限定)\n- 名物:**客車内薪ストーブ + するめ焼き(車内売店 ¥400)**\n- 文学:**太宰治『津軽』(1944)+ 斜陽館 (R1 育) と組合せ**\n- 料金:**全区間 ¥870 + ストーブ料金 ¥500**\n- 並列観光:**斜陽館 + 立佞武多の館 + 弘前**",
    region: "tohoku",
    prefecture_ja: "青森県",
    gun_ja: null,
    municipality_ja: "五所川原市",
    lg_code: "02205",
    area_types: ["transit_hub"],
    lat: 40.8067,
    lon: 140.4419,
    season_start: "2026-12-01",
    season_end: "2027-03-31",
    event_start: null,
    event_end: null,
    price_tier: 2,
    booking_window_days: 60,
    closed_days: [],
    external_urls: { official: "https://tsutetsu.com/" },
    tags: ["tsugaru_railway_stove", "december_march", "1930", "surume_yaki", "dazai_tsugaru"],
    source: "manual",
  },
  {
    slug: "hachinohe-line-tanesashi",
    category: "entertainment",
    sub_type: "aomori_local_train",
    title_zh: "八戸線(八戸-久慈 64km+ 三陸海岸沿+ 種差海岸 + 蕪嶋神社 + リゾートうみねこ列車+ 国立公園(三陸復興)+ 八戸駅から地方海岸線旅)",
    title_ja: "八戸線",
    romaji: "Hachinohe Line",
    summary_zh: "**八戸線は八戸-久慈(岩手県)を結ぶ三陸海岸沿の地方線**(JR 東日本・**八戸-久慈 64km**)。**種差海岸(種差海岸線国立公園構成)+ 蕪嶋神社 + リゾートうみねこ列車**、八戸前沖鯖+八戸イカ食事と組合せ可、JR 八戸駅から南下する三陸海岸線旅、リゾートうみねこは要予約 (¥1,300-)。",
    content_md: "- 運行:**JR 東日本八戸線**(八戸-久慈 64km・岩手県境)\n- 沿線:**種差海岸(三陸復興国立公園) + 蕪嶋神社 + 階上岳**\n- 観光列車:**リゾートうみねこ**(土日中心運行・要予約)\n- 並列観光:**蕪嶋神社(海猫繁殖地・国指定天然記念物) + 種差海岸**\n- 料金:**全区間 ¥1,520**\n- 並列食:R1 食 八戸前沖鯖 + 八戸イカ + せんべい汁",
    region: "tohoku",
    prefecture_ja: "青森県",
    gun_ja: null,
    municipality_ja: "八戸市",
    lg_code: "02203",
    area_types: ["transit_hub", "scenic_spot"],
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
    tags: ["hachinohe_line", "tanesashi_kaigan", "kabushima_jinja", "umineko_resort"],
    source: "manual",
  },
];

async function main() {
  if (rows.length === 0) {
    console.log("[aomori-entertainment-r1] 尚無條目");
    return;
  }
  console.log(`[aomori-entertainment-r1] ${rows.length} 筆 ${DRY ? "(dry-run)" : ""}`);
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
      console.error("[aomori-entertainment-r1] upsert failed:", error);
      process.exit(1);
    }
    written += batch.length;
    process.stdout.write(`\r[aomori-entertainment-r1] upsert: ${written}/${rows.length}`);
  }
  process.stdout.write("\n");
  console.log(`[aomori-entertainment-r1] Done — ${written} rows.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

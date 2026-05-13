// Seed 長崎県 · 衣類 條目 → public.japan_entries(Sprint 20.3 衣 R1)
//
// 長崎 = 異国の坂の伝統工芸 + 商業:
//   - 波佐見焼(国指定伝統工芸品 1978・東彼杵郡波佐見町・1599 起源・庶民食器)
//   - 三川内焼(国指定伝統工芸品 1978・佐世保市・1650s 起源・平戸藩窯白磁)
//   - 長崎ビードロ(吹きガラス・南蛮渡来・チロリン)
//   - 長崎べっ甲(鎖国期独占・タイマイ甲細工・高級工芸)
//   - 長崎浜屋百貨店 1880・佐世保玉屋 1806(九州最古百貨店)
//   - 浜の町アーケード(長崎)+ 四ヶ町・三ヶ町(佐世保 1km 級)
//   - 新地中華街土産(チャイナ雑貨)+ 大浦天主堂周辺カトリック土産
//   - 出島土産(蘭学グッズ)+ ハウステンボス土産(欧風)
//
// 25 筆構成:
//   Phase A 伝統工芸 4(波佐見焼・三川内焼・ビードロ・べっ甲)
//   Phase B 波佐見焼具体 2(白山陶器・現代ブランド)
//   Phase C 長崎市百貨店・mall 4(浜屋 1880・アミュプラザ・夢彩都・浜の町)
//   Phase D 佐世保商業 4(玉屋 1806・アミュ佐世保・四ヶ町 1km・5 番街)
//   Phase E 中華街 + 観光商店街 2(新地中華雑貨・島原湧水商店街)
//   Phase F 着物 + くんち装束 2(くんち装束 rental・着物 rental)
//   Phase G 教会群 + 出島土産 3(大浦天主堂・五島教会群・出島)
//   Phase H ハウステンボス + 工芸店 3(HTB 土産・べっ甲店・ビードロ店)
//   Phase I その他 1(雲仙温泉商店街)
//
// Usage:
//   npx tsx scripts/seed-japan-entries-nagasaki-fashion.ts --dry-run
//   npx tsx scripts/seed-japan-entries-nagasaki-fashion.ts

import { config as loadEnv } from "dotenv";
loadEnv({ path: ".env.local" });

import { createAdminClient } from "../src/lib/supabase/admin";

const DRY = process.argv.includes("--dry-run");

type SubType =
  | "nagasaki_hasami_mikawachi"
  | "nagasaki_bidoro_bekko"
  | "nagasaki_dept_arcade"
  | "nagasaki_christian_pilgrim"
  | "shopping_district_urban"
  | "kimono_rental"
  | "craft_goods"
  | "textile_traditional";

interface SeedRow {
  slug: string;
  category: "fashion";
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
  // Phase A — 伝統工芸概論 4 筆
  // ════════════════════════════════════════════════════════════════════
  {
    slug: "hasami-yaki-1599-overview",
    category: "fashion",
    sub_type: "nagasaki_hasami_mikawachi",
    title_zh: "波佐見焼(国指定伝統工芸品 1978・1599 起源・庶民食器代表・全国 5 大磁器産地)",
    title_ja: "波佐見焼",
    romaji: "Hasami Yaki",
    summary_zh: "**波佐見焼は東彼杵郡波佐見町の伝統磁器**(1599 起源)。豊臣秀吉朝鮮出兵従軍の李祐慶ら陶工が定着、慶長期から白磁製造開始。江戸期を通して「くらわんか茶碗」(庶民食器)で全国普及、家庭使い陶磁器の代名詞。経産大臣指定伝統的工芸品(1978)・全国 5 大磁器産地(他は伊万里有田・瀬戸・美濃・九谷)。",
    content_md: "- 起源:1599 年(慶長4)李祐慶ら朝鮮陶工\n- 立地:東彼杵郡波佐見町(中尾山・三股・永尾 等の窯場集積)\n- 認定:経済産業大臣指定伝統的工芸品(1978)\n- 全国位置:全国 5 大磁器産地(伊万里有田・瀬戸・美濃・九谷・波佐見)\n- 庶民食器代名詞:江戸期「くらわんか茶碗」で全国普及\n- 現代:HASAMI ブランド + NATURAL69 + 白山陶器 等 現代食器ブランド多数\n- 波佐見陶器まつり:GW(4/29-5/5)毎年開催・100+ 窯元出店\n- 主要販売所:中尾山交流館 + 西の原(陶磁器集積エリア)\n- 価格帯:茶碗 ¥800-3500・皿 ¥1500-8000\n- アクセス:JR 川棚駅 から バス 20 分・波佐見下車",
    region: "kyushu",
    prefecture_ja: "長崎県",
    gun_ja: "東彼杵郡",
    municipality_ja: "波佐見町",
    lg_code: "42323",
    area_types: ["industrial_heritage", "rural_townscape"],
    lat: 33.151,
    lon: 129.846,
    season_start: null,
    season_end: null,
    event_start: null,
    event_end: null,
    price_tier: 2,
    booking_window_days: null,
    closed_days: [],
    external_urls: { official: "https://hasamiyaki.or.jp/" },
    tags: ["nagasaki_hasami_mikawachi", "hasami_yaki", "1599", "designated_craft_1978", "japan_5_porcelain"],
    source: "manual",
  },
  {
    slug: "mikawachi-yaki-1650s-overview",
    category: "fashion",
    sub_type: "nagasaki_hasami_mikawachi",
    title_zh: "三川内焼(国指定伝統工芸品 1978・佐世保市・平戸藩窯白磁・繊細な細工)",
    title_ja: "三川内焼",
    romaji: "Mikawachi Yaki",
    summary_zh: "**三川内焼は佐世保市の伝統磁器**(1650s 起源)。平戸藩主松浦鎮信が朝鮮陶工巨関を呼んで開窯、繊細な彫刻+細密な手描き染付の白磁で「平戸焼」とも呼ばれた。江戸期から幕府献上品の格・現代も「日本一細い焼物」を追求する技術派工芸。経産大臣指定伝統的工芸品(1978・波佐見焼と同年)。",
    content_md: "- 起源:1650s 平戸藩主松浦鎮信開窯 + 朝鮮陶工巨関\n- 立地:佐世保市三川内町\n- 認定:経済産業大臣指定伝統的工芸品(1978)\n- 別名:平戸焼\n- 特徴:純白磁 + 繊細な彫刻 + 細密な手描き染付\n- 江戸期:幕府献上品(透かし彫り菊細工 等)\n- 現代:三川内陶磁器工業協同組合 + 個別窯元 30+ 軒\n- 主要販売:三川内皿山郷(SARAYAMA・観光集積)\n- 価格帯:小皿 ¥3000-8000・茶碗 ¥5000-15000・大皿 ¥30000-100000\n- アクセス:JR 三河内駅 徒歩 10 分",
    region: "kyushu",
    prefecture_ja: "長崎県",
    gun_ja: null,
    municipality_ja: "佐世保市",
    lg_code: "42202",
    area_types: ["industrial_heritage", "rural_townscape"],
    lat: 33.152,
    lon: 129.778,
    season_start: null,
    season_end: null,
    event_start: null,
    event_end: null,
    price_tier: 3,
    booking_window_days: null,
    closed_days: [],
    external_urls: { official: "https://mikawachi-utsuwa.net/" },
    tags: ["nagasaki_hasami_mikawachi", "mikawachi_yaki", "1650s", "designated_craft_1978", "hirado_ware"],
    source: "manual",
  },
  {
    slug: "nagasaki-bidoro-overview",
    category: "fashion",
    sub_type: "nagasaki_bidoro_bekko",
    title_zh: "長崎ビードロ(吹きガラス・南蛮渡来 16C・チロリン+硝子工芸)",
    title_ja: "長崎ビードロ",
    romaji: "Nagasaki Bidoro",
    summary_zh: "**長崎ビードロは南蛮渡来の吹きガラス**(16 世紀ポルトガル人伝来)。語源はポルトガル語「vidro」(ガラス)、長崎独占の硝子工芸として江戸期に発展。「チロリン」(吹くと キンキンキン音が鳴る玩具)が代表、ステンドグラス + 硝子工芸品 + 食器類は長崎観光の定番土産。",
    content_md: "- 伝来:16 世紀ポルトガル人(イエズス会)\n- 語源:ポルトガル語「vidro」(ガラス)\n- 江戸期:鎖国期も長崎独占の硝子工芸技術\n- 名物:チロリン(吹きガラス玩具・キンキンと音が鳴る)・硝子工芸品 + 食器\n- 主要工房:長崎ビードロ屋・大浦天主堂周辺の硝子工房 + 中華街周辺\n- 体験:吹きガラス体験(¥3000-5000・要予約)\n- 価格帯:チロリン ¥800-2500・グラス ¥3000-15000・大型工芸品 ¥30000+\n- アクセス:長崎市内各地の専門店",
    region: "kyushu",
    prefecture_ja: "長崎県",
    gun_ja: null,
    municipality_ja: "長崎市",
    lg_code: "42201",
    area_types: ["urban_central", "historic_district"],
    lat: 32.738,
    lon: 129.866,
    season_start: null,
    season_end: null,
    event_start: null,
    event_end: null,
    price_tier: 2,
    booking_window_days: null,
    closed_days: [],
    external_urls: {},
    tags: ["nagasaki_bidoro_bekko", "nagasaki_bidoro", "portuguese_16c", "chirorin"],
    source: "manual",
  },
  {
    slug: "nagasaki-bekko-overview",
    category: "fashion",
    sub_type: "nagasaki_bidoro_bekko",
    title_zh: "長崎べっ甲(鎖国期独占・タイマイ甲細工・国指定伝統工芸品候補・高級アクセサリー)",
    title_ja: "長崎べっ甲",
    romaji: "Nagasaki Bekko",
    summary_zh: "**長崎べっ甲は鎖国期独占のタイマイ甲細工**(17 世紀から)。出島貿易で輸入されたタイマイ(海亀)甲を、長崎の職人が琥珀色の透明感を活かしてアクセサリー(櫛・かんざし・帯留め+メガネフレーム)に加工。長崎県指定伝統的工芸品、現代もワシントン条約規制で稀少品扱い。象牙堂 + 江崎べっ甲店 が代表販売。",
    content_md: "- 起源:17 世紀(鎖国期長崎独占)\n- 原料:タイマイ(海亀)甲・出島貿易輸入\n- 製品:櫛 + かんざし + 帯留め + メガネフレーム + ペンダント + ブローチ\n- 認定:長崎県指定伝統的工芸品(国指定はワシントン条約規制で慎重)\n- 規制:ワシントン条約(1992)以後タイマイ甲輸入禁止 → 在庫品 + リサイクル品のみ\n- 主要店:江崎べっ甲店(1709 創業の老舗・諏訪神社近く)・象牙堂・長崎べっ甲組合加盟店\n- 価格帯:櫛 ¥30000-100000・メガネフレーム ¥150000-500000・大型工芸品 ¥500000+\n- 客層:海外客(国際空港免税)+ 国内収集家",
    region: "kyushu",
    prefecture_ja: "長崎県",
    gun_ja: null,
    municipality_ja: "長崎市",
    lg_code: "42201",
    area_types: ["urban_central", "historic_district"],
    lat: 32.747,
    lon: 129.879,
    season_start: null,
    season_end: null,
    event_start: null,
    event_end: null,
    price_tier: 5,
    booking_window_days: null,
    closed_days: [],
    external_urls: {},
    tags: ["nagasaki_bidoro_bekko", "nagasaki_bekko", "edo_17c_monopoly", "tortoise_shell"],
    source: "manual",
  },

  // ════════════════════════════════════════════════════════════════════
  // Phase B — 波佐見焼具体 2 筆
  // ════════════════════════════════════════════════════════════════════
  {
    slug: "hasami-hakusan-toki",
    category: "fashion",
    sub_type: "nagasaki_hasami_mikawachi",
    title_zh: "白山陶器(波佐見焼ブランド・1779 創業・モダン食器代表・国際デザイン賞多数)",
    title_ja: "白山陶器",
    romaji: "Hakusan Toki",
    summary_zh: "**白山陶器は波佐見焼の現代代表ブランド**(1779 創業・東彼杵郡)。240 年余の家業、伝統的波佐見焼に現代デザインを融合させた食器で国際デザイン賞多数(グッドデザイン賞ロングライフ賞 等)。「G 型醤油差し」「平茶碗」等のロングセラー、東京ミッドタウン直営店もあり全国流通。",
    content_md: "- 創業:1779 年(安永8)波佐見\n- 規模:従業員 200+ 名・国内最大級の波佐見焼ブランド\n- 代表作:G 型醤油差し(1958・グッドデザイン賞ロングライフ賞)・平茶碗(1973)・布志名碗\n- 国際デザイン賞:グッドデザイン金賞・iF Design Award 等\n- 直営店:本社ショールーム(波佐見町)・東京ミッドタウン店\n- 価格帯:茶碗 ¥1500-5000・醤油差し ¥2500-4000・大皿 ¥6000-25000\n- アクセス:JR 川棚駅 から バス 20 分・波佐見下車",
    region: "kyushu",
    prefecture_ja: "長崎県",
    gun_ja: "東彼杵郡",
    municipality_ja: "波佐見町",
    lg_code: "42323",
    area_types: ["industrial_heritage", "rural_townscape"],
    lat: 33.157,
    lon: 129.857,
    season_start: null,
    season_end: null,
    event_start: null,
    event_end: null,
    price_tier: 3,
    booking_window_days: null,
    closed_days: [],
    external_urls: { official: "https://www.hakusan-porcelain.co.jp/" },
    tags: ["nagasaki_hasami_mikawachi", "hakusan_toki", "1779", "good_design_long_life"],
    source: "manual",
  },
  {
    slug: "hasami-natural-69-modern",
    category: "fashion",
    sub_type: "nagasaki_hasami_mikawachi",
    title_zh: "NATURAL69(波佐見焼 現代カジュアルブランド・北欧テイストで全国 SNS ヒット)",
    title_ja: "NATURAL69",
    romaji: "Natural 69",
    summary_zh: "**NATURAL69 は波佐見焼の現代カジュアルブランド**。1990s 創立、伝統的波佐見焼+北欧モダンデザインの融合で 2010s SNS ヒット、若年層 + 海外客に新しい波佐見焼のイメージを提供。シンプルパターン+ 親しみやすい価格帯で「日常使いのいい器」として全国普及。",
    content_md: "- 系列:波佐見焼ブランド(個別窯元発)\n- スタイル:北欧モダン + シンプルパターン + 日常使い\n- 価格帯:茶碗 ¥1100-2500・小皿 ¥800-1800・グラス ¥1500-3000\n- 客層:20-40 代女性 + 海外客\n- 流通:全国セレクトショップ + 通販 + 波佐見西の原の直営店\n- 西の原:波佐見焼ブランド集積エリア(波佐見町)\n- アクセス:JR 川棚駅 から バス 25 分・西の原下車",
    region: "kyushu",
    prefecture_ja: "長崎県",
    gun_ja: "東彼杵郡",
    municipality_ja: "波佐見町",
    lg_code: "42323",
    area_types: ["industrial_heritage", "rural_townscape"],
    lat: 33.158,
    lon: 129.858,
    season_start: null,
    season_end: null,
    event_start: null,
    event_end: null,
    price_tier: 2,
    booking_window_days: null,
    closed_days: [],
    external_urls: {},
    tags: ["nagasaki_hasami_mikawachi", "natural_69", "modern_brand", "scandinavian"],
    source: "manual",
  },

  // ════════════════════════════════════════════════════════════════════
  // Phase C — 長崎市百貨店・mall 4 筆
  // ════════════════════════════════════════════════════════════════════
  {
    slug: "hamaya-nagasaki-1880",
    category: "fashion",
    sub_type: "nagasaki_dept_arcade",
    title_zh: "長崎浜屋百貨店(1880 創業・長崎最古老舗百貨店・浜の町中心)",
    title_ja: "長崎浜屋",
    romaji: "Nagasaki Hamaya",
    summary_zh: "**長崎浜屋は長崎最古の百貨店**(明治13年/1880 創業)。145 年余、家業 4 代目。浜の町アーケード中心地、地下食品 + 婦人/紳士ファッション + 8F レストラン街の伝統構成。地元中・上層客の常用、長崎銘菓 + カステラ + 角煮まん 等の長崎土産集積店としても有名。",
    content_md: "- 創業:1880 年(明治13)長崎\n- 立地:長崎市浜町(浜の町アーケード中心)\n- 規模:本館 + 別館・延床面積 約 3 万 m²\n- 構成:B1F 食品(長崎銘菓集積)・1F 化粧品・2-7F ファッション・8F レストラン\n- 客層:地元中・上層客 + 観光客の長崎土産購入\n- 営業:10:00-19:30\n- 定休:不定休\n- 周辺:浜の町アーケード + 銅座 + 思案橋 へ徒歩圏\n- アクセス:長崎電気軌道 観光通電停 徒歩 1 分",
    region: "kyushu",
    prefecture_ja: "長崎県",
    gun_ja: null,
    municipality_ja: "長崎市",
    lg_code: "42201",
    area_types: ["urban_central", "historic_district"],
    lat: 32.744,
    lon: 129.879,
    season_start: null,
    season_end: null,
    event_start: null,
    event_end: null,
    price_tier: 3,
    booking_window_days: null,
    closed_days: [],
    external_urls: {},
    tags: ["nagasaki_dept_arcade", "hamaya", "1880", "nagasaki_oldest_dept"],
    source: "manual",
  },
  {
    slug: "amyu-plaza-nagasaki-2000",
    category: "fashion",
    sub_type: "nagasaki_dept_arcade",
    title_zh: "アミュプラザ長崎(2000 開業・JR 長崎駅ビル直結・新幹線開業 2022 で大幅拡張)",
    title_ja: "アミュプラザ長崎",
    romaji: "Amu Plaza Nagasaki",
    summary_zh: "**アミュプラザ長崎は JR 長崎駅ビル直結の大型商業施設**(2000 開業・JR 九州系)。2022 年西九州新幹線開業 + 駅ビル建替えで「アミュプラザ長崎 新館」(2023 開業)が追加、現在 200+ 店舗の九州最大級駅ビル mall。長崎県観光客の最初/最後の立ち寄り地、長崎銘菓 + ファッション + レストラン集積。",
    content_md: "- 開業:2000 年(平成12)・新館 2023 拡張\n- 系列:JR 九州駅ビルホールディングス\n- 立地:JR 長崎駅 直結\n- 規模:本館 + 新館 = 200+ 店舗\n- 新幹線連動:2022 西九州新幹線開業に合わせ大幅拡張\n- 主要テナント:長崎銘菓集積(福砂屋・松翁軒・文明堂)+ ユニクロ + 無印 + 各種ファッション + レストラン街\n- 営業:10:00-21:00(レストラン 23:00)\n- アクセス:JR 長崎駅 直結",
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
    price_tier: 2,
    booking_window_days: null,
    closed_days: [],
    external_urls: { official: "https://www.amu-n.co.jp/" },
    tags: ["nagasaki_dept_arcade", "amu_plaza_nagasaki", "2000", "shinkansen_2022"],
    source: "manual",
  },
  {
    slug: "yumesaito-nagasaki-1999",
    category: "fashion",
    sub_type: "nagasaki_dept_arcade",
    title_zh: "夢彩都(長崎駅前・1999 開業・複合大型 mall・地元代表)",
    title_ja: "夢彩都(ゆめさいと)",
    romaji: "Yumesaito",
    summary_zh: "**夢彩都は長崎駅前の大型複合 mall**(1999 開業)。JR 長崎駅 徒歩 10 分・地下 1 階~5 階で 80+ 店舗、ファッション + 雑貨 + 食堂 + シネコン + 大型書店「明治屋」等の複合機能。アミュプラザ長崎(駅直結)と異なり、地元客中心の「日常使い」mall。",
    content_md: "- 開業:1999 年(平成11)長崎\n- 立地:長崎市元船町(JR 長崎駅 徒歩 10 分)\n- 規模:地下 1 階~5 階・80+ 店舗\n- 主要テナント:イオン系食品 + ファッション + シネコン + 大型書店\n- 営業:10:00-21:00\n- 駐車場:1500 台\n- 客層:地元客中心\n- アクセス:JR 長崎駅 徒歩 10 分",
    region: "kyushu",
    prefecture_ja: "長崎県",
    gun_ja: null,
    municipality_ja: "長崎市",
    lg_code: "42201",
    area_types: ["urban_central"],
    lat: 32.747,
    lon: 129.870,
    season_start: null,
    season_end: null,
    event_start: null,
    event_end: null,
    price_tier: 2,
    booking_window_days: null,
    closed_days: [],
    external_urls: {},
    tags: ["nagasaki_dept_arcade", "yumesaito", "1999"],
    source: "manual",
  },
  {
    slug: "nagasaki-hamano-machi-arcade",
    category: "fashion",
    sub_type: "nagasaki_dept_arcade",
    title_zh: "浜の町アーケード商店街(長崎中心商店街・観光通り+ベルナード+本通り計 1km)",
    title_ja: "浜の町アーケード",
    romaji: "Hamano-machi Arcade",
    summary_zh: "**浜の町アーケードは長崎市中心商店街**。観光通り + ベルナード観光通り + 本通り の 3 つのアーケードが連続する 約 1 km の商店街集積、200+ 店舗。長崎浜屋百貨店 + ロフト + 各種ブランド店 + ドラッグストア + カフェ + 角煮まん試食 等。中華街(徒歩 5 分)+ 思案橋(夜の街・徒歩 3 分)+ グラバー園(徒歩 15 分)へのハブ。",
    content_md: "- 立地:長崎市浜町(中心商業地)\n- 規模:観光通り + ベルナード + 本通り = 約 1 km\n- 店舗数:200+\n- 主要店:長崎浜屋百貨店 + ロフト + ABC マート + 各種ブランド + 銘菓店\n- 周辺:新地中華街(徒歩 5 分)+ 思案橋(徒歩 3 分)+ 大浦天主堂(徒歩 18 分)\n- 営業:店舗別(平均 10:00-20:00)\n- 雨天可:全長アーケード屋根あり\n- アクセス:長崎電気軌道 観光通電停 徒歩 0 分",
    region: "kyushu",
    prefecture_ja: "長崎県",
    gun_ja: null,
    municipality_ja: "長崎市",
    lg_code: "42201",
    area_types: ["urban_central", "historic_district"],
    lat: 32.744,
    lon: 129.879,
    season_start: null,
    season_end: null,
    event_start: null,
    event_end: null,
    price_tier: 2,
    booking_window_days: null,
    closed_days: [],
    external_urls: {},
    tags: ["nagasaki_dept_arcade", "hamano_machi", "main_arcade"],
    source: "manual",
  },

  // ════════════════════════════════════════════════════════════════════
  // Phase D — 佐世保商業 4 筆
  // ════════════════════════════════════════════════════════════════════
  {
    slug: "sasebo-tamaya-1806",
    category: "fashion",
    sub_type: "nagasaki_dept_arcade",
    title_zh: "佐世保玉屋(1806 創業・九州最古百貨店・四ヶ町商店街隣接)",
    title_ja: "佐世保玉屋",
    romaji: "Sasebo Tamaya",
    summary_zh: "**佐世保玉屋は九州最古の百貨店**(文化3年/1806 創業)。220 年余、家業 8 代目。佐世保市の四ヶ町商店街隣接、地元代表上層客の百貨店。長崎玉屋 + 久留米玉屋 + 福岡玉屋 等の「玉屋系列」(現代各社独立)の本家筋。地下食品 + 婦人/紳士ファッション + 8F レストランの伝統構成。",
    content_md: "- 創業:1806 年(文化3)佐世保\n- 全国位置:九州最古百貨店(現存)\n- 当主:玉屋家(8 代目)\n- 立地:佐世保市栄町(四ヶ町商店街隣接)\n- 規模:本館 + 別館・延床面積 約 4 万 m²\n- 構成:B1F 食品(佐世保バーガー含む)・1F 化粧品・2-7F ファッション・8F レストラン\n- 関連:長崎玉屋(別法人)・久留米玉屋・福岡玉屋(玉屋系列・現代各独立)\n- 営業:10:00-19:30\n- アクセス:JR 佐世保駅 徒歩 5 分",
    region: "kyushu",
    prefecture_ja: "長崎県",
    gun_ja: null,
    municipality_ja: "佐世保市",
    lg_code: "42202",
    area_types: ["urban_central", "historic_district"],
    lat: 33.180,
    lon: 129.717,
    season_start: null,
    season_end: null,
    event_start: null,
    event_end: null,
    price_tier: 3,
    booking_window_days: null,
    closed_days: [],
    external_urls: { official: "https://sasebo-tamaya.co.jp/" },
    tags: ["nagasaki_dept_arcade", "sasebo_tamaya", "1806", "kyushu_oldest_dept"],
    source: "manual",
  },
  {
    slug: "amyu-plaza-sasebo-2000",
    category: "fashion",
    sub_type: "nagasaki_dept_arcade",
    title_zh: "アミュプラザ佐世保(2000 開業・JR 佐世保駅ビル直結・佐世保観光ハブ)",
    title_ja: "アミュプラザ佐世保",
    romaji: "Amu Plaza Sasebo",
    summary_zh: "**アミュプラザ佐世保は JR 佐世保駅ビル**(2000 開業・JR 九州系)。佐世保観光のハブ、120+ 店舗のファッション + 食堂 + 雑貨 + ハウステンボス連絡駅としての機能。佐世保バーガー + 米軍関連グッズ + 長崎銘菓 が揃う。",
    content_md: "- 開業:2000 年(平成12)佐世保\n- 系列:JR 九州駅ビル\n- 立地:JR 佐世保駅 直結\n- 規模:120+ 店舗\n- 特色:佐世保バーガー店 + 米軍関連グッズ + 長崎銘菓\n- 営業:10:00-21:00\n- アクセス:JR 佐世保駅 直結",
    region: "kyushu",
    prefecture_ja: "長崎県",
    gun_ja: null,
    municipality_ja: "佐世保市",
    lg_code: "42202",
    area_types: ["urban_central"],
    lat: 33.171,
    lon: 129.715,
    season_start: null,
    season_end: null,
    event_start: null,
    event_end: null,
    price_tier: 2,
    booking_window_days: null,
    closed_days: [],
    external_urls: {},
    tags: ["nagasaki_dept_arcade", "amu_plaza_sasebo", "2000"],
    source: "manual",
  },
  {
    slug: "sasebo-yonkacho-arcade-1km",
    category: "fashion",
    sub_type: "nagasaki_dept_arcade",
    title_zh: "佐世保四ヶ町・三ヶ町アーケード(全長 1 km・日本最長級アーケード商店街)",
    title_ja: "佐世保四ヶ町・三ヶ町アーケード",
    romaji: "Sasebo Yonkacho Arcade",
    summary_zh: "**佐世保アーケードは日本最長級の屋根付商店街**(全長約 1 km)。「四ヶ町」+「三ヶ町」の 2 セクション連続、佐世保駅~佐世保玉屋方面まで一気通貫。米海軍佐世保基地連動の米国感(ステーキ + バーガー + アメリカ雑貨)が独特、日本国内で唯一の「米軍と共生する商店街」雰囲気。",
    content_md: "- 全長:約 1 km(四ヶ町 + 三ヶ町・日本最長級)\n- 立地:佐世保市栄町~福石町(JR 佐世保駅 徒歩 5 分から始まる)\n- 規模:200+ 店舗\n- 米軍連動:米海軍佐世保基地(隣接)由来の米国感(ステーキ・バーガー・アメリカ雑貨)\n- 主要店:佐世保玉屋(隣接)+ 米軍関連ショップ + 一般ファッション + 銘菓\n- 営業:店舗別(平均 10:00-20:00)\n- アクセス:JR 佐世保駅 徒歩 5 分(始点)",
    region: "kyushu",
    prefecture_ja: "長崎県",
    gun_ja: null,
    municipality_ja: "佐世保市",
    lg_code: "42202",
    area_types: ["urban_central", "historic_district"],
    lat: 33.180,
    lon: 129.717,
    season_start: null,
    season_end: null,
    event_start: null,
    event_end: null,
    price_tier: 2,
    booking_window_days: null,
    closed_days: [],
    external_urls: {},
    tags: ["nagasaki_dept_arcade", "sasebo_yonkacho", "japan_longest_arcade", "us_navy"],
    source: "manual",
  },
  {
    slug: "sasebo-5ban-gai-2013",
    category: "fashion",
    sub_type: "nagasaki_dept_arcade",
    title_zh: "させぼ五番街(2013 開業・JR 佐世保駅前・港湾型大型 mall・佐世保港絶景)",
    title_ja: "させぼ五番街",
    romaji: "Sasebo 5ban-gai",
    summary_zh: "**させぼ五番街は港湾型大型 mall**(2013 開業・JR 佐世保駅前)。佐世保港 + 米軍佐世保基地隣接の立地、海眺レストラン街 + ファッション + ユニクロ + 各種チェーン店。米軍家族客 + 観光客 + 地元客の三層、英語表記が多い独特の商業空間。",
    content_md: "- 開業:2013 年(平成25)佐世保\n- 立地:佐世保市新港町(JR 佐世保駅 徒歩 1 分・佐世保港隣接)\n- 規模:60+ 店舗\n- 客層:米軍家族 + 観光客 + 地元客\n- 特色:港眺レストラン街 + 英語表記対応\n- 営業:10:00-21:00\n- アクセス:JR 佐世保駅 徒歩 1 分",
    region: "kyushu",
    prefecture_ja: "長崎県",
    gun_ja: null,
    municipality_ja: "佐世保市",
    lg_code: "42202",
    area_types: ["urban_central", "fishing_port"],
    lat: 33.171,
    lon: 129.715,
    season_start: null,
    season_end: null,
    event_start: null,
    event_end: null,
    price_tier: 2,
    booking_window_days: null,
    closed_days: [],
    external_urls: {},
    tags: ["nagasaki_dept_arcade", "sasebo_5ban_gai", "2013", "us_navy_port"],
    source: "manual",
  },

  // ════════════════════════════════════════════════════════════════════
  // Phase E — 中華街 + 観光商店街 2 筆
  // ════════════════════════════════════════════════════════════════════
  {
    slug: "nagasaki-shinchi-souvenir",
    category: "fashion",
    sub_type: "shopping_district_urban",
    title_zh: "新地中華街 中華雑貨(チャイナドレス・チャイナ雑貨・中華菓子土産)",
    title_ja: "新地中華街 中華雑貨",
    romaji: "Shinchi Chinese Goods",
    summary_zh: "**新地中華街にはチャイナドレス + チャイナ雑貨 + 中華菓子の土産店多数**。日本三大中華街最古(1689 開設)の土産文化、中国茶 + 中華風アクセサリー + チャイナドレス + ランタンフェスティバル限定品 等。約 10 軒の専門店が中華街内に集積。",
    content_md: "- 立地:長崎市新地町(新地中華街内)\n- 主要取扱:チャイナドレス + 中華風アクセサリー + 中華風生活雑貨 + 中国茶 + 中華菓子\n- 春節祭限定:長崎ランタンフェスティバル(1-2 月)期の限定品\n- 主要店:中国貿易公司 + 中国生活雑貨専門店 等 10+ 軒\n- 価格帯:小物 ¥500-3000・チャイナドレス ¥10000-50000\n- 営業:店舗別(平均 10:00-20:00)\n- アクセス:長崎電気軌道 新地中華街電停 徒歩 1 分",
    region: "kyushu",
    prefecture_ja: "長崎県",
    gun_ja: null,
    municipality_ja: "長崎市",
    lg_code: "42201",
    area_types: ["urban_central", "historic_district"],
    lat: 32.745,
    lon: 129.870,
    season_start: null,
    season_end: null,
    event_start: null,
    event_end: null,
    price_tier: 2,
    booking_window_days: null,
    closed_days: [],
    external_urls: {},
    tags: ["shopping_district_urban", "shinchi_chinese", "china_dress"],
    source: "manual",
  },
  {
    slug: "shimabara-yusui-shotengai",
    category: "fashion",
    sub_type: "shopping_district_urban",
    title_zh: "島原湧水商店街(島原城下・湧水通り・寒晒し甘味+島原素麺+島原地物)",
    title_ja: "島原湧水商店街",
    romaji: "Shimabara Yusui Shotengai",
    summary_zh: "**島原湧水商店街は島原城下の歴史商店街**。「水の都」島原(名水百選)の湧水通り沿いの古典商店街、寒晒し甘味店 + 島原素麺直売店 + 武家屋敷土産 + 地物雑貨。観光客向けに約 30 軒の小規模店、水路と石畳の景観で「水の都の商店街」の風情。",
    content_md: "- 立地:島原市新町・万町(湧水通り)\n- 規模:約 30 軒(湧水沿いの古典商店街)\n- 主要店:寒晒し銀水 1915 + 島原素麺直売店 + 武家屋敷土産 + 雑貨\n- 環境:水路 + 石畳 + 鯉(湧水池に放流)\n- 認定エリア:名水百選(1985)\n- 営業:店舗別(平均 9:00-18:00)\n- アクセス:島原鉄道 島原駅 徒歩 7 分",
    region: "kyushu",
    prefecture_ja: "長崎県",
    gun_ja: null,
    municipality_ja: "島原市",
    lg_code: "42203",
    area_types: ["urban_central", "historic_district"],
    lat: 32.787,
    lon: 130.366,
    season_start: null,
    season_end: null,
    event_start: null,
    event_end: null,
    price_tier: 2,
    booking_window_days: null,
    closed_days: [],
    external_urls: {},
    tags: ["shopping_district_urban", "shimabara_yusui", "yusui_100", "castle_town"],
    source: "manual",
  },

  // ════════════════════════════════════════════════════════════════════
  // Phase F — 着物 + くんち装束 2 筆
  // ════════════════════════════════════════════════════════════════════
  {
    slug: "nagasaki-kunchi-shozoku-rental",
    category: "fashion",
    sub_type: "kimono_rental",
    title_zh: "長崎くんち装束 rental(諏訪神社例大祭 10/7-9・龍踊+傘鉾+船踊衣装)",
    title_ja: "長崎くんち 装束 rental",
    romaji: "Nagasaki Kunchi Costume",
    summary_zh: "**長崎くんち装束は祭礼期限定の rental**。諏訪神社例大祭(10/7-9)で、龍踊 + 傘鉾 + 船踊 + コッコデショ 等の奉納踊で使用される独特装束。祭礼参加者向けが本来用途だが、長崎市内 2-3 軒で観光客向けに「長崎くんち風」記念撮影レンタル(¥3000-5000)も提供。",
    content_md: "- 用途:諏訪神社例大祭(10/7-9)・通称「長崎くんち」\n- 主要装束:\n  - 龍踊衣装(中国舞踏由来・1722 から)\n  - 傘鉾(町ごと独自・装飾華麗)\n  - 船踊・船渡御\n  - コッコデショ(担ぎ太鼓)\n- 観光向け rental:長崎市内 2-3 軒(¥3000-5000・記念撮影向け)\n- 提供期間:祭礼期(10 月)+ 通年観光向け\n- 注意:本物の祭礼装束は地元町内会管理・観光向けは簡易版\n- アクセス:長崎電気軌道 諏訪神社電停 徒歩 5 分",
    region: "kyushu",
    prefecture_ja: "長崎県",
    gun_ja: null,
    municipality_ja: "長崎市",
    lg_code: "42201",
    area_types: ["urban_central", "historic_district"],
    lat: 32.751,
    lon: 129.880,
    season_start: "2026-10-07",
    season_end: "2026-10-09",
    event_start: null,
    event_end: null,
    price_tier: 2,
    booking_window_days: 3,
    closed_days: [],
    external_urls: {},
    tags: ["kimono_rental", "nagasaki_kunchi", "suwa_jinja", "ryu_odori"],
    source: "manual",
  },
  {
    slug: "nagasaki-kimono-rental",
    category: "fashion",
    sub_type: "kimono_rental",
    title_zh: "長崎着物 rental(浜の町 + グラバー園 + 出島の散策用・観光客向け)",
    title_ja: "長崎着物 rental",
    romaji: "Nagasaki Kimono Rental",
    summary_zh: "**長崎着物 rental は観光客向けの散策用着物 rental**。長崎市内 3-5 軒のレンタル店で、浜の町商店街 + グラバー園 + 大浦天主堂 + 出島 + 中華街 散策用に着物 + 浴衣を貸出(¥3500-7000・着付け+小物付)。長崎の異国情緒+ 着物のミックスフォトジェニック。",
    content_md: "- 主要店:長崎市内 3-5 軒(浜の町・グラバー園周辺)\n- レンタル料:¥3500-7000(着付け+小物+草履付)\n- 似合うシーン:グラバー園の洋館 + 着物 + 異国情緒の組合せ・大浦天主堂・出島・中華街\n- 営業:9:00-18:00(返却 17:00 まで)\n- アクセス:長崎市内中心部",
    region: "kyushu",
    prefecture_ja: "長崎県",
    gun_ja: null,
    municipality_ja: "長崎市",
    lg_code: "42201",
    area_types: ["urban_central"],
    lat: 32.744,
    lon: 129.873,
    season_start: null,
    season_end: null,
    event_start: null,
    event_end: null,
    price_tier: 2,
    booking_window_days: 1,
    closed_days: [],
    external_urls: {},
    tags: ["kimono_rental", "nagasaki_kimono", "tourist_rental"],
    source: "manual",
  },

  // ════════════════════════════════════════════════════════════════════
  // Phase G — 教会群 + 出島土産 3 筆
  // ════════════════════════════════════════════════════════════════════
  {
    slug: "oura-tenshudo-shop",
    category: "fashion",
    sub_type: "nagasaki_christian_pilgrim",
    title_zh: "大浦天主堂周辺カトリック土産(国宝 1864 現存日本最古天主堂・キリスト教グッズ)",
    title_ja: "大浦天主堂周辺 カトリック土産",
    romaji: "Oura Tenshudo Shop",
    summary_zh: "**大浦天主堂周辺はカトリック土産集積地**。1864 完成の現存日本最古天主堂(国宝 1933)+ 「長崎と天草地方の潜伏キリシタン関連遺産」(2018 世界遺産)構成資産。周辺の坂道商店街にロザリオ + 聖母像 + キリスト教書籍 + 五島列島教会群グッズ + カステラ等のキリシタン文化記念品多数。",
    content_md: "- 中心施設:大浦天主堂(1864 完成・国宝 1933・世界遺産 2018)\n- 周辺商店街:大浦天主堂下のグラバー園通り(石畳坂道)\n- 主要取扱:ロザリオ + 聖母像 + キリスト教書籍 + 五島教会群グッズ\n- 五島・天草:潜伏キリシタン関連遺産連動商品\n- 価格帯:小物 ¥500-3000・大型品 ¥10000-50000\n- 周辺:グラバー園(徒歩 3 分)+ 25 殉教者像\n- アクセス:長崎電気軌道 大浦天主堂電停 徒歩 5 分",
    region: "kyushu",
    prefecture_ja: "長崎県",
    gun_ja: null,
    municipality_ja: "長崎市",
    lg_code: "42201",
    area_types: ["urban_central", "historic_district"],
    lat: 32.738,
    lon: 129.870,
    season_start: null,
    season_end: null,
    event_start: null,
    event_end: null,
    price_tier: 2,
    booking_window_days: null,
    closed_days: [],
    external_urls: {},
    tags: ["nagasaki_christian_pilgrim", "oura_tenshudo", "national_treasure_1933", "world_heritage_2018"],
    source: "manual",
  },
  {
    slug: "goto-church-pilgrim-shop",
    category: "fashion",
    sub_type: "nagasaki_christian_pilgrim",
    title_zh: "五島教会群 巡礼グッズ(世界遺産 2018・潜伏キリシタン関連・オリジナル土産)",
    title_ja: "五島教会群 巡礼グッズ",
    romaji: "Goto Church Pilgrim",
    summary_zh: "**五島教会群グッズは潜伏キリシタン世界遺産連動土産**。「長崎と天草地方の潜伏キリシタン関連遺産」(2018 世界遺産)構成資産の頭ヶ島天主堂 + 旧野首教会 + 大曽教会 等の五島列島の教会群グッズ。十字架アクセサリー + 聖母メダイ + 教会写真集 + 椿油石鹸 + 五島塩 等。福江市内 + 新上五島町の土産店で販売。",
    content_md: "- 由来:長崎と天草地方の潜伏キリシタン関連遺産(2018 世界遺産)\n- 構成資産(五島列島):頭ヶ島天主堂・旧野首教会・大曽教会・水ノ浦教会・堂崎天主堂\n- 主要グッズ:十字架アクセサリー + 聖母メダイ + 教会写真集 + 椿油石鹸 + 五島塩\n- 主要販売地:五島市福江島(中心地)+ 新上五島町(中通島)\n- 価格帯:小物 ¥500-3000・椿油石鹸 ¥1500・写真集 ¥2500-5000\n- アクセス:福江港 + 福江空港 + 有川港(博多+長崎フェリー)",
    region: "kyushu",
    prefecture_ja: "長崎県",
    gun_ja: null,
    municipality_ja: "五島市",
    lg_code: "42211",
    area_types: ["fishing_port", "rural_townscape"],
    lat: 32.696,
    lon: 128.842,
    season_start: null,
    season_end: null,
    event_start: null,
    event_end: null,
    price_tier: 2,
    booking_window_days: null,
    closed_days: [],
    external_urls: {},
    tags: ["nagasaki_christian_pilgrim", "goto_churches", "world_heritage_2018", "kirishitan"],
    source: "manual",
  },
  {
    slug: "dejima-shop-edo",
    category: "fashion",
    sub_type: "nagasaki_christian_pilgrim",
    title_zh: "出島内土産(蘭学グッズ・オランダ風雑貨・1641-1859 鎖国期記念)",
    title_ja: "出島 内 土産",
    romaji: "Dejima Souvenir",
    summary_zh: "**出島内土産は蘭学+オランダ風記念品**。出島(国指定史跡 1922・復元 2017)内の各復元建物 + 出口の出島土産店で、オランダ風雑貨 + 蘭学グッズ + 出島歴史書籍 + デルフト陶器コラボ品 + 長崎銘菓(オランダ風カステラ含)等を販売。1641-1859 鎖国期 230 年の蘭学窓を記念。",
    content_md: "- 主要販売地:出島内(復元建物・1F 売店)+ 出口商店街\n- 主要取扱:オランダ風雑貨 + 蘭学グッズ + 出島歴史書 + デルフト風陶器 + 長崎銘菓\n- 出島:国指定史跡(1922)+ 復元プロジェクト(1996-2017)\n- 入場料:出島入場 ¥520(土産店 free)\n- 営業:8:00-21:00(夜間ライトアップ時も)\n- アクセス:長崎電気軌道 出島電停 徒歩 3 分",
    region: "kyushu",
    prefecture_ja: "長崎県",
    gun_ja: null,
    municipality_ja: "長崎市",
    lg_code: "42201",
    area_types: ["urban_central", "historic_district"],
    lat: 32.744,
    lon: 129.872,
    season_start: null,
    season_end: null,
    event_start: null,
    event_end: null,
    price_tier: 2,
    booking_window_days: null,
    closed_days: [],
    external_urls: {},
    tags: ["nagasaki_christian_pilgrim", "dejima_shop", "dutch_souvenir", "1641_1859"],
    source: "manual",
  },

  // ════════════════════════════════════════════════════════════════════
  // Phase H — ハウステンボス + 工芸店 3 筆
  // ════════════════════════════════════════════════════════════════════
  {
    slug: "htb-souvenir-european",
    category: "fashion",
    sub_type: "shopping_district_urban",
    title_zh: "ハウステンボス内土産(オランダ風 + チューリップ + チーズ + 欧風雑貨)",
    title_ja: "ハウステンボス 内 土産",
    romaji: "HTB European Souvenir",
    summary_zh: "**HTB 内土産はオランダテーマパーク連動の欧風雑貨**。場内 100+ 軒の専門店で、チューリップ模様 + デルフト陶器 + チーズ + チョコレート + ヨーロッパ風雑貨 + HTB 限定キャラクターグッズ。場外には連動土産も展開、HTB 観光客の必買リスト。",
    content_md: "- 立地:ハウステンボス場内 + 場外連動店\n- 場内店舗:100+ 軒(各ゾーンに専門店)\n- 主要取扱:チューリップ雑貨 + デルフト陶器 + チーズ + チョコ + 欧風雑貨 + HTB キャラクター\n- 限定品:季節限定チューリップ柄 + イルミ限定品(11-3 月)\n- 営業:HTB 営業時間に準ずる(9:00-22:00)\n- アクセス:JR ハウステンボス駅 徒歩 5 分(場内入場後)",
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
    price_tier: 3,
    booking_window_days: null,
    closed_days: [],
    external_urls: {},
    tags: ["shopping_district_urban", "htb_souvenir", "dutch_theme"],
    source: "manual",
  },
  {
    slug: "esaki-bekko-1709",
    category: "fashion",
    sub_type: "nagasaki_bidoro_bekko",
    title_zh: "江崎べっ甲店(1709 創業・長崎べっ甲最古老舗・諏訪神社近く)",
    title_ja: "江崎べっ甲店",
    romaji: "Esaki Bekko",
    summary_zh: "**江崎べっ甲店は長崎べっ甲現存最古老舗**(宝永6年/1709 創業)。315 年余の家業 11 代目、諏訪神社近くの本店で、櫛 + かんざし + 帯留め + メガネフレーム + ペンダント等の高級べっ甲アクセサリー。鎖国期から続く伝統技法 + ワシントン条約以前の在庫品 + 認可リサイクル甲を使用。",
    content_md: "- 創業:1709 年(宝永6)長崎\n- 当主:江崎家(11 代目)\n- 立地:長崎市上西山町(諏訪神社近く)\n- 主力:櫛 + かんざし + 帯留め + メガネフレーム + ペンダント + ブローチ\n- 価格帯:小物 ¥30000-200000・大型品 ¥500000+\n- 規制対応:ワシントン条約以前の在庫 + 認可リサイクル甲使用\n- 営業:9:00-18:00\n- 定休:水曜\n- アクセス:長崎電気軌道 諏訪神社電停 徒歩 5 分",
    region: "kyushu",
    prefecture_ja: "長崎県",
    gun_ja: null,
    municipality_ja: "長崎市",
    lg_code: "42201",
    area_types: ["urban_central", "historic_district"],
    lat: 32.751,
    lon: 129.881,
    season_start: null,
    season_end: null,
    event_start: null,
    event_end: null,
    price_tier: 5,
    booking_window_days: null,
    closed_days: ["wed"],
    external_urls: {},
    tags: ["nagasaki_bidoro_bekko", "esaki_bekko", "1709", "315_years"],
    source: "manual",
  },
  {
    slug: "nagasaki-bidoro-shop",
    category: "fashion",
    sub_type: "nagasaki_bidoro_bekko",
    title_zh: "長崎ビードロ shop 群(浜の町 + グラバー園周辺・吹きガラス工房 + 直販)",
    title_ja: "長崎ビードロ shop 群",
    romaji: "Nagasaki Bidoro Shops",
    summary_zh: "**長崎ビードロ shop 群は浜の町 + グラバー園周辺の専門店集積**。長崎ビードロ屋(代表・浜の町)+ 大浦天主堂下の硝子工房 + 中華街周辺の硝子土産店 等 5+ 軒。チロリン + ガラスペンダント + 食器 + ステンドグラス を販売、吹きガラス体験(¥3000-5000)も提供。",
    content_md: "- 主要立地:浜の町商店街 + 大浦天主堂周辺 + 中華街周辺\n- 店舗数:5+ 軒(専門店 + 工房併設店)\n- 主要店:長崎ビードロ屋・大浦硝子工房・中華街硝子土産\n- 体験:吹きガラス体験 ¥3000-5000(要予約・所要 30 分)\n- 価格帯:チロリン ¥800-2500・グラス ¥3000-15000\n- アクセス:長崎市中心部各所",
    region: "kyushu",
    prefecture_ja: "長崎県",
    gun_ja: null,
    municipality_ja: "長崎市",
    lg_code: "42201",
    area_types: ["urban_central"],
    lat: 32.744,
    lon: 129.873,
    season_start: null,
    season_end: null,
    event_start: null,
    event_end: null,
    price_tier: 2,
    booking_window_days: null,
    closed_days: [],
    external_urls: {},
    tags: ["nagasaki_bidoro_bekko", "bidoro_shops", "glass_workshop"],
    source: "manual",
  },

  // ════════════════════════════════════════════════════════════════════
  // Phase I — その他 1 筆
  // ════════════════════════════════════════════════════════════════════
  {
    slug: "obama-onsen-shotengai",
    category: "fashion",
    sub_type: "shopping_district_urban",
    title_zh: "小浜温泉商店街(雲仙市・浴衣散策 + 温泉土産+足湯併設・橘湾夕陽絶景)",
    title_ja: "小浜温泉商店街",
    romaji: "Obama Onsen Shotengai",
    summary_zh: "**小浜温泉商店街は橘湾沿いの温泉商店街**(雲仙市)。日本一長い足湯「ほっとふっと 105」(105m)隣接、約 20 軒の温泉土産 + 浴衣レンタル + 海鮮干物 + 温泉饅頭 等の小規模商店街。夕陽絶景立地で散策定番、雲仙温泉(山間)とは別の海岸温泉商店街風情。",
    content_md: "- 立地:雲仙市小浜温泉(橘湾沿い)\n- 規模:約 20 軒(小規模温泉商店街)\n- 主要店:温泉土産 + 浴衣レンタル + 海鮮干物 + 温泉饅頭\n- 隣接:ほっとふっと 105(全長 105m 日本一の足湯)\n- 夕陽:橘湾の夕陽絶景\n- 営業:店舗別(平均 10:00-19:00)\n- アクセス:JR 諫早駅 から バス 60 分・小浜温泉下車",
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
    price_tier: 2,
    booking_window_days: null,
    closed_days: [],
    external_urls: {},
    tags: ["shopping_district_urban", "obama_onsen", "hotfoot_105_adjacent"],
    source: "manual",
  },
];

async function main() {
  if (rows.length === 0) {
    console.log("[nagasaki-fashion] 尚無條目");
    return;
  }
  console.log(`[nagasaki-fashion] ${rows.length} 筆 ${DRY ? "(dry-run)" : ""}`);
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
      console.error("[nagasaki-fashion] upsert failed:", error);
      process.exit(1);
    }
    written += batch.length;
    process.stdout.write(`\r[nagasaki-fashion] upsert: ${written}/${rows.length}`);
  }
  process.stdout.write("\n");
  console.log(`[nagasaki-fashion] Done — ${written} rows.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

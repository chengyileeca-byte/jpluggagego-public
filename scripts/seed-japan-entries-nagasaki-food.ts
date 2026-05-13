// Seed 長崎県 · 食類 條目 → public.japan_entries(Sprint 20.1 食 R1)
//
// 長崎 = 異国食文化の融合:
//   - ちゃんぽん + 皿うどん:1899 四海楼(陳平順)発祥・新地中華街
//   - カステラ:ポルトガル伝来 1550s・福砂屋 1624 現存最古老舗
//   - 卓袱料理:中華+和食+蘭学 fusion・花月 1642 最古料亭・円卓食文化
//   - 中華街(新地中華街):1689 開設・日本三大中華街・角煮まん
//   - トルコライス:長崎独自洋食ハイブリッド・ツル茶ん 1925
//   - 島原素麺:全国 3 大素麺(三輪+揖保+島原)
//   - 五島うどん:あごだし発祥・離島伝統
//   - 大村寿司:1573 起源・押し寿司発祥(長崎独自)
//   - 離島産物:対馬とらふぐ・壱岐麦焼酎 GI・五島あご
//   - 温泉食:小浜温泉地獄蒸し料理・雲仙地獄料理
//
// 嚴格定義(大阪食 reform 継承):全部具体餐廳・酒造・実在物件のみ。
// 概論/史観 entries は culture seed file へ(別 sprint)。
//
// 26 筆構成:
//   Phase A 発祥級 6(四海楼1899・福砂屋1624・花月1642・新地中華街1689・福田酒造1688・大村寿司1573)
//   Phase B カステラ系 3(松翁軒1681・文明堂1900・カステラ概論)
//   Phase C 中華+角煮 4(よっそう1866・岩崎本舗・共楽園・蘇州林)
//   Phase D 洋食 2(ツル茶ん1925・トルコライス概論)
//   Phase E 麺類概論 3(島原素麺・五島うどん・卓袱概論)
//   Phase F 離島産物 4(対馬ふぐ・壱岐焼酎GI・五島あご・大村寿司)
//   Phase G 温泉食+銘菓 4(小浜地獄蒸し・寒晒し・雲仙地獄・金平糖伝来1546)
//
// Usage:
//   npx tsx scripts/seed-japan-entries-nagasaki-food.ts --dry-run
//   npx tsx scripts/seed-japan-entries-nagasaki-food.ts

import { config as loadEnv } from "dotenv";
loadEnv({ path: ".env.local" });

import { createAdminClient } from "../src/lib/supabase/admin";

const DRY = process.argv.includes("--dry-run");

type SubType =
  | "nagasaki_champon"
  | "nagasaki_castella"
  | "nagasaki_shippoku"
  | "nagasaki_chuka"
  | "nagasaki_toruko_rice"
  | "nagasaki_men"
  | "nagasaki_shima_san"
  | "local_specialty"
  | "brewery"
  | "seasonal_food";

interface SeedRow {
  slug: string;
  category: "food";
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
  // Phase A — 発祥級 6 筆
  // ════════════════════════════════════════════════════════════════════
  {
    slug: "nagasaki-champon-shikairo-1899",
    category: "food",
    sub_type: "nagasaki_champon",
    title_zh: "四海樓(長崎・1899 創業・ちゃんぽん + 皿うどん 同店発祥・現存最古)",
    title_ja: "四海樓",
    romaji: "Shikairo",
    summary_zh: "**四海樓は長崎ちゃんぽん + 皿うどん 同店発祥**(1899 明治32 創業)。福建省出身の陳平順が中国留学生のために安価で栄養満点の麺料理として「ちゃんぽん」を考案、副産物として皿うどん(揚げた麺に餡)も発祥。126 年余、家業 4 代目。本店は長崎港を望む 5 階建て、1F 売店 + 2-5F レストラン。「ちゃんぽんミュージアム」併設。",
    content_md: "- 創業:1899 年(明治32)長崎・松ヶ枝町\n- 創業者:陳平順(福建省福州出身)\n- 発祥料理:\n  - ちゃんぽん:中国留学生向け安価栄養食として考案\n  - 皿うどん:ちゃんぽん麺を揚げた副産物として誕生\n- 現存最古:長崎ちゃんぽん専門店として現存最古\n- ちゃんぽんミュージアム:店内 5F 併設(無料・歴史展示)\n- 価格帯:ちゃんぽん ¥1320・皿うどん ¥1320・特上 ¥2200\n- 営業:11:30-15:00 / 17:00-20:00\n- 定休:不定休\n- 待ち:平日 30 分・週末 60-90 分\n- 立地:長崎市松ヶ枝町(出島周辺・大浦海岸通)\n- アクセス:長崎電気軌道 大浦海岸通電停 徒歩 1 分",
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
    price_tier: 3,
    booking_window_days: null,
    closed_days: [],
    external_urls: { official: "https://shikairou.com/" },
    tags: ["nagasaki_champon", "shikairo", "1899", "champon_origin", "saraudon_origin"],
    source: "manual",
  },
  {
    slug: "fukusaya-castella-1624",
    category: "food",
    sub_type: "nagasaki_castella",
    title_zh: "福砂屋(長崎・1624 創業・カステラ最古老舗・400 年継承の手作り)",
    title_ja: "福砂屋(ふくさや)",
    romaji: "Fukusaya",
    summary_zh: "**福砂屋はカステラ現存最古の老舗**(寛永元年/1624 創業)。400 年余の歴史、家業 17 代目。1550 年代ポルトガル人宣教師がカステラを長崎に伝え、福砂屋が初めて商品化した(諸説あり・福砂屋公称)。現在も創業以来の手作り製法を守り、ザラメが底に敷かれた福砂屋スタイルが「本物のカステラ」の象徴。",
    content_md: "- 創業:1624 年(寛永元)長崎\n- 当主:福砂屋(17 代目)\n- 由来:1550s ポルトガル人宣教師カステラ伝来 → 福砂屋商品化\n- 製法:手作り(機械化せず)・ザラメを底に敷く独特スタイル\n- 文化:日本のカステラ「本家本元」として全国認知\n- 価格帯:0.6 号 ¥1404・1 号 ¥2376・5 号 ¥10800・特製五三焼 ¥3700+\n- 主要店舗:本店(長崎市船大工町)+ 全国デパート出店多数\n- 営業:9:30-19:00\n- 定休:無休\n- アクセス:長崎電気軌道 思案橋電停 徒歩 1 分",
    region: "kyushu",
    prefecture_ja: "長崎県",
    gun_ja: null,
    municipality_ja: "長崎市",
    lg_code: "42201",
    area_types: ["urban_central", "historic_district"],
    lat: 32.744,
    lon: 129.876,
    season_start: null,
    season_end: null,
    event_start: null,
    event_end: null,
    price_tier: 3,
    booking_window_days: null,
    closed_days: [],
    external_urls: { official: "https://www.castella.co.jp/" },
    tags: ["nagasaki_castella", "fukusaya", "1624", "castella_oldest", "400_years"],
    source: "manual",
  },
  {
    slug: "shippoku-kagetsu-1642",
    category: "food",
    sub_type: "nagasaki_shippoku",
    title_zh: "花月(長崎・1642 創業・卓袱料亭最古・国指定史跡庭園・坂本龍馬来訪)",
    title_ja: "史跡料亭 花月",
    romaji: "Kagetsu",
    summary_zh: "**花月は卓袱料理最古の料亭**(寛永19年/1642 創業)。380 年余の歴史、長崎丸山(花街)の中心に位置する。初期は遊郭「引田屋」、卓袱料理の様式化に貢献し、明治期に料亭「花月」へ。庭園 + 建築は国指定史跡。坂本龍馬・伊藤博文・グラバー・三菱創業者岩崎弥太郎が訪問、坂本龍馬の「梅花の間」刀傷も現存。",
    content_md: "- 創業:1642 年(寛永19)長崎丸山\n- 由来:遊郭「引田屋」→ 1879 料亭「花月」へ転換\n- 認定:国指定史跡(1960 史跡庭園)\n- 名物:卓袱料理(¥16500-44000・要予約・大広間円卓)\n- 文化財:庭園 + 玄関 + 大広間\n- 文人来訪:坂本龍馬・伊藤博文・グラバー・岩崎弥太郎・与謝野晶子\n- 「梅花の間」刀傷:坂本龍馬が酔って柱を切った傷現存\n- 営業:12:00-15:00 / 17:30-21:00\n- 予約:必須(2-3 日前・卓袱は最少 4 名から)\n- 立地:長崎市丸山町\n- アクセス:長崎電気軌道 思案橋電停 徒歩 5 分",
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
    price_tier: 5,
    booking_window_days: 14,
    closed_days: [],
    external_urls: { official: "https://www.ryoutei-kagetsu.co.jp/" },
    tags: ["nagasaki_shippoku", "kagetsu", "1642", "national_historic_site", "ryoma_sword_mark"],
    source: "manual",
  },
  {
    slug: "nagasaki-shinchi-chuka-gai-1689",
    category: "food",
    sub_type: "nagasaki_chuka",
    title_zh: "新地中華街(長崎・1689 開設・日本三大中華街・約 250m + 40 軒)",
    title_ja: "長崎新地中華街",
    romaji: "Nagasaki Shinchi Chukagai",
    summary_zh: "**新地中華街は日本三大中華街の最古**(1689 開設・横浜+神戸より 200 年早い)。元禄2年に造成された人工島「新地」が清国貿易倉庫地として始まり、明治期に華僑住民+店舗街として発展。約 250 m × 200 m の小さな街区に 40+ 軒のちゃんぽん・皿うどん・角煮まん・中華菓子の専門店が集中。",
    content_md: "- 開設:1689 年(元禄2)長崎奉行所造成の人工島「新地」\n- 全国位置:日本三大中華街(長崎新地+横浜+神戸南京町)の最古\n- 規模:東西約 250m + 南北約 200m・約 40 軒\n- 主要店舗:江山楼・蘇州林・四海樓系・中華園・福壽園・雙葉屋・吉宗(卓袱)+ 銘菓店多数\n- 春節祭:1-2 月の中華旧正月期に「長崎ランタンフェスティバル」(2 週間・約 100 万人動員)\n- 営業:店舗別(平均 11:00-21:00)\n- 立地:長崎市新地町\n- アクセス:長崎電気軌道 新地中華街電停 徒歩 1 分",
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
    external_urls: { official: "https://www.nagasaki-chinatown.com/" },
    tags: ["nagasaki_chuka", "shinchi_chukagai", "1689", "japan_3_chinatowns_oldest"],
    source: "manual",
  },
  {
    slug: "fukuda-shuzo-hirado-1688",
    category: "food",
    sub_type: "brewery",
    title_zh: "福田酒造(平戸・1688 創業・現存最古長崎酒蔵・国登録有形文化財)",
    title_ja: "福田酒造",
    romaji: "Fukuda Shuzo",
    summary_zh: "**福田酒造は長崎県現存最古の酒蔵**(元禄元年/1688 創業)。335 年余、家業 17 代目。平戸の南蛮貿易+鎖国期も継続した酒造り、主力銘柄「福鶴」+「長崎美人」。本店建物は江戸期のまま現存、国登録有形文化財(2007)。蔵見学+試飲(要事前予約)で長崎酒文化を体験可能。",
    content_md: "- 創業:1688 年(元禄元)平戸\n- 当主:福田家(17 代目)\n- 主力銘柄:福鶴・長崎美人・本格焼酎(芋・麦・米)\n- 文化財:本店建物 国登録有形文化財(2007)\n- 蔵見学:可(要事前予約・無料・所要 45 分)\n- 試飲:可(蔵直販店併設)\n- 価格帯:純米 ¥1500-3500・大吟醸 ¥3500-8000\n- 立地:平戸市志々伎町\n- 営業:9:00-17:00\n- 定休:日曜・祝日\n- アクセス:松浦鉄道 たびら平戸口駅 から車 30 分",
    region: "kyushu",
    prefecture_ja: "長崎県",
    gun_ja: null,
    municipality_ja: "平戸市",
    lg_code: "42207",
    area_types: ["historic_district", "fishing_port"],
    lat: 33.249,
    lon: 129.469,
    season_start: null,
    season_end: null,
    event_start: null,
    event_end: null,
    price_tier: 3,
    booking_window_days: 7,
    closed_days: ["sun"],
    external_urls: { official: "https://www.fukuda-shuzo.com/" },
    tags: ["brewery", "fukuda_shuzo", "1688", "hirado", "registered_cultural_property"],
    source: "manual",
  },
  {
    slug: "omura-zushi-1573-overview",
    category: "food",
    sub_type: "local_specialty",
    title_zh: "大村寿司(押し寿司発祥・1573 大村喜前公・450 年伝統)",
    title_ja: "大村寿司",
    romaji: "Omura Zushi",
    summary_zh: "**大村寿司は押し寿司の発祥**(天正元年/1573 大村喜前公由来説)。長崎県大村市の郷土料理、戦の手早い兵糧として米+ 魚+ 野菜を木型で押し固めた角型寿司。家庭料理 + 仏事祝事の常備食として 450 年継承、現代では大村市内 10+ 軒の専門店 + 駅弁 + 道の駅で購入可能。「やまと」「たかさご」「松栄堂」等が代表的提供店。",
    content_md: "- 起源:1573 年(天正元)大村喜前公の戦勝祝説 + 諸説\n- 発祥地:長崎県大村市\n- 製法:長方形木型に酢飯+具(穴子・桜でんぶ・錦糸卵・きぬさや・椎茸)を層状に重ねて押し固める\n- 全国位置:押し寿司の最古発祥(諸説で)\n- 食べ方:斜め切りで方形ピース・お祝い + 仏事の常備食\n- 主要店舗:大村寿司の店「やまと」+「たかさご」+「松栄堂」+「やま田」\n- 価格帯:折詰 ¥1200-3500\n- 立地:大村市中心地\n- アクセス:JR 大村駅 から各店徒歩 5-15 分",
    region: "kyushu",
    prefecture_ja: "長崎県",
    gun_ja: null,
    municipality_ja: "大村市",
    lg_code: "42205",
    area_types: ["urban_central", "historic_district"],
    lat: 32.918,
    lon: 129.957,
    season_start: null,
    season_end: null,
    event_start: null,
    event_end: null,
    price_tier: 2,
    booking_window_days: null,
    closed_days: [],
    external_urls: {},
    tags: ["local_specialty", "omura_zushi", "1573", "oshi_zushi_origin", "450_years"],
    source: "manual",
  },

  // ════════════════════════════════════════════════════════════════════
  // Phase B — カステラ系 3 筆
  // ════════════════════════════════════════════════════════════════════
  {
    slug: "shoouken-castella-1681",
    category: "food",
    sub_type: "nagasaki_castella",
    title_zh: "松翁軒(長崎・1681 創業・カステラ三大老舗・チョコラーテ独自・天正乳)",
    title_ja: "松翁軒",
    romaji: "Shoouken",
    summary_zh: "**松翁軒は長崎カステラ三大老舗の 1**(天和元年/1681 創業)。340 年余、家業 13 代目。福砂屋・文明堂と並ぶ長崎カステラの代表格、独自の「チョコラーテ」(チョコ味カステラ)+「天正乳」(乳製品入り)が他店との差別化。長崎中心部の本店 + 店舗内喫茶でカステラ + コーヒーの組合せが定番。",
    content_md: "- 創業:1681 年(天和元)長崎\n- 当主:山口家(13 代目)\n- 主力:カステラ + チョコラーテ(独自・チョコ味)+ 天正乳カステラ\n- 価格帯:0.6 号 ¥1296・1 号 ¥2376・桐箱入 5 号 ¥10800\n- 本店:長崎市魚の町(中央橋電停近く)\n- 店内喫茶:カステラ + コーヒーセット ¥800\n- 営業:9:00-19:30\n- 定休:無休\n- アクセス:長崎電気軌道 公会堂前電停 徒歩 1 分",
    region: "kyushu",
    prefecture_ja: "長崎県",
    gun_ja: null,
    municipality_ja: "長崎市",
    lg_code: "42201",
    area_types: ["urban_central", "historic_district"],
    lat: 32.748,
    lon: 129.879,
    season_start: null,
    season_end: null,
    event_start: null,
    event_end: null,
    price_tier: 2,
    booking_window_days: null,
    closed_days: [],
    external_urls: { official: "https://shooken.com/" },
    tags: ["nagasaki_castella", "shoouken", "1681", "chocolatte", "tensho_milk"],
    source: "manual",
  },
  {
    slug: "bunmei-do-castella-1900",
    category: "food",
    sub_type: "nagasaki_castella",
    title_zh: "文明堂(長崎・1900 創業・カステラ全国普及・「カステラ一番、電話は二番」CM)",
    title_ja: "文明堂",
    romaji: "Bunmei-do",
    summary_zh: "**文明堂は長崎カステラを全国に普及した老舗**(明治33年/1900 創業)。125 年・「カステラ一番、電話は二番、三時のおやつは文明堂」CM ソング(1962-)で全国フレーズ。創業者中川安五郎が長崎福砂屋系統で修業後独立、東京 + 大阪展開で全国ブランドに。本店は長崎市中心地、桐箱詰めギフト + 切り落とし(規格外)バーゲンが人気。",
    content_md: "- 創業:1900 年(明治33)長崎\n- 創業者:中川安五郎(福砂屋系統で修業後独立)\n- 全国展開:1922 東京銀座出店 → 1955 全国大阪展開\n- 文化:CM ソング「カステラ一番、電話は二番、三時のおやつは文明堂」(1962- 全国フレーズ)\n- 主力:カステラ + 千寿カステラ + ハニーカステラ\n- 価格帯:0.6 号 ¥1080・1 号 ¥1620・桐箱詰 5 号 ¥6480\n- 本店:長崎市江戸町(出島近く)\n- 切り落とし:規格外品 ¥500/袋(本店 + 工場直売所限定)\n- 営業:9:00-19:00\n- アクセス:長崎電気軌道 出島電停 徒歩 3 分",
    region: "kyushu",
    prefecture_ja: "長崎県",
    gun_ja: null,
    municipality_ja: "長崎市",
    lg_code: "42201",
    area_types: ["urban_central"],
    lat: 32.744,
    lon: 129.872,
    season_start: null,
    season_end: null,
    event_start: null,
    event_end: null,
    price_tier: 2,
    booking_window_days: null,
    closed_days: [],
    external_urls: { official: "https://www.bunmeido.ne.jp/" },
    tags: ["nagasaki_castella", "bunmei_do", "1900", "national_brand", "cm_song"],
    source: "manual",
  },
  {
    slug: "nagasaki-castella-history-overview",
    category: "food",
    sub_type: "nagasaki_castella",
    title_zh: "長崎カステラ概論(1550s ポルトガル伝来・砂糖文化発祥地・全国普及の出発点)",
    title_ja: "長崎カステラ(概論)",
    romaji: "Nagasaki Castella",
    summary_zh: "**長崎カステラは日本菓子文化の象徴**。1550 年代ポルトガル人宣教師が「pão de Castela」(カスティーリャのパン)として伝来、長崎奉行所周辺の砂糖貿易で量産化、福砂屋 1624 を皮切りに長崎銘菓として確立。江戸期に長崎街道(シュガーロード)で全国へ普及、現代は福砂屋 + 松翁軒 + 文明堂 + 心泉堂 + 杉谷本舗 等の多数老舗が継承。",
    content_md: "- 伝来:1550s ポルトガル人宣教師(イエズス会)\n- 語源:「pão de Castela」(カスティーリャのパン)→ カステラ\n- 砂糖文化発祥地:長崎は鎖国期唯一の砂糖輸入港 → 長崎街道経由全国普及\n- 通称:シュガーロード(長崎 → 小倉 → 飯塚 → 直方 → 鳥栖 → 久留米 → 大宰府)\n- 三大老舗:福砂屋 1624 + 松翁軒 1681 + 文明堂 1900\n- 五三焼:卵黄多めの高級カステラ・最高峰\n- 関連店舗:心泉堂・杉谷本舗・万月堂・カステラ本家須崎屋・須崎商店 等\n- 製法特徴:ザラメを底に敷く(福砂屋系)/ きめ細かい卵黄系(松翁軒系)/ 普及型(文明堂系)\n- 価格目安:1 号 ¥1500-3000(老舗別)",
    region: "kyushu",
    prefecture_ja: "長崎県",
    gun_ja: null,
    municipality_ja: "長崎市",
    lg_code: "42201",
    area_types: ["urban_central", "historic_district"],
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
    tags: ["nagasaki_castella", "castella_overview", "portuguese_1550s", "sugar_road"],
    source: "manual",
  },

  // ════════════════════════════════════════════════════════════════════
  // Phase C — 中華 + 角煮 4 筆
  // ════════════════════════════════════════════════════════════════════
  {
    slug: "yossou-kakuni-man-1866",
    category: "food",
    sub_type: "nagasaki_chuka",
    title_zh: "よっそう(長崎中華街周辺・1866 創業・卓袱料理 + 角煮まん老舗)",
    title_ja: "よっそう",
    romaji: "Yossou",
    summary_zh: "**よっそうは卓袱料理 + 角煮まん老舗**(慶応2年/1866 創業)。160 年余、長崎中華街南側で卓袱料理を提供する一方、土産用「角煮まん」(豚角煮を中華饅頭に挟んだ長崎名物)の元祖店として全国知名。本店ランチ ¥3500-、角煮まん持ち帰り 1 個 ¥520。",
    content_md: "- 創業:1866 年(慶応2)長崎\n- 主力:卓袱料理(店内・¥6600-15400 コース)+ 角煮まん(土産用)\n- 角煮まん:豚バラ角煮を中華饅頭に挟んだ長崎オリジナル土産菓子\n- 価格:角煮まん 1 個 ¥520・5 個入 ¥2600\n- 本店:長崎市浜町\n- 営業:11:00-21:00\n- 定休:無休\n- アクセス:長崎電気軌道 浜町アーケード電停 徒歩 1 分",
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
    price_tier: 4,
    booking_window_days: 7,
    closed_days: [],
    external_urls: { official: "https://yossou.co.jp/" },
    tags: ["nagasaki_chuka", "yossou", "1866", "kakuni_man_origin"],
    source: "manual",
  },
  {
    slug: "iwasakimotoshouten-kakuni",
    category: "food",
    sub_type: "nagasaki_chuka",
    title_zh: "岩崎本舗(長崎角煮まん代表・全国百貨店出店・お土産菓子界の雄)",
    title_ja: "岩崎本舗",
    romaji: "Iwasaki Honpo",
    summary_zh: "**岩崎本舗は角煮まんの全国普及ブランド**(長崎発祥・現代角煮まん市場 No.1)。よっそう 1866 が老舗ベース、岩崎本舗は近代化 + 全国百貨店展開で長崎角煮まんを「全国お土産界」に押し上げた。冷凍便対応 + 通販 + 関東関西の百貨店常設店舗、長崎観光土産の定番。",
    content_md: "- 主力:角煮まん(長崎名物の全国ブランド化)\n- 系列:長崎発祥(具体創業年は近代)\n- 全国展開:百貨店常設店(東京銀座・新宿・大阪・横浜 等)+ 通販\n- 価格帯:1 個 ¥430・5 個入 ¥2160・10 個入 ¥4320\n- 冷凍便:全国対応(クール宅急便)\n- 主要店舗:長崎本店 + 中華街店 + 全国百貨店 30+ 店舗\n- 営業:店舗別(平均 10:00-19:00)\n- アクセス:長崎電気軌道 新地中華街電停 徒歩 2 分(中華街店)",
    region: "kyushu",
    prefecture_ja: "長崎県",
    gun_ja: null,
    municipality_ja: "長崎市",
    lg_code: "42201",
    area_types: ["urban_central"],
    lat: 32.744,
    lon: 129.870,
    season_start: null,
    season_end: null,
    event_start: null,
    event_end: null,
    price_tier: 2,
    booking_window_days: null,
    closed_days: [],
    external_urls: { official: "https://0806.jp/" },
    tags: ["nagasaki_chuka", "iwasaki_honpo", "kakuni_man_modern"],
    source: "manual",
  },
  {
    slug: "koraku-en-1899-shinchi",
    category: "food",
    sub_type: "nagasaki_champon",
    title_zh: "共楽園(新地中華街・1898 創業・ちゃんぽん 名店・四海楼と双璧)",
    title_ja: "共楽園(きょうらくえん)",
    romaji: "Korakuen",
    summary_zh: "**共楽園は新地中華街のちゃんぽん名店**(明治31年/1898 創業)。四海楼 1899 と並ぶちゃんぽん 1 年差の老舗、新地中華街中心部で 125 年余の家業 4 代目継承。四海楼が「観光客向け」なら共楽園は「地元客の本場ちゃんぽん」と位置付け、待ち時間が四海楼より短く、地元定食感が強い。",
    content_md: "- 創業:1898 年(明治31)新地中華街\n- 主力:ちゃんぽん ¥1100・皿うどん ¥1100・特上 ¥1700-2200\n- 立地:長崎市新地町(中華街中心部)\n- 客層:地元客 + 観光客(四海楼ほど混雑せず)\n- 営業:11:30-15:00 / 17:00-20:30\n- 定休:火曜\n- 待ち:平日昼 15-30 分\n- アクセス:長崎電気軌道 新地中華街電停 徒歩 2 分",
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
    closed_days: ["tue"],
    external_urls: {},
    tags: ["nagasaki_champon", "korakuen", "1898", "shinchi_chukagai"],
    source: "manual",
  },
  {
    slug: "soshurin-1985-shinchi",
    category: "food",
    sub_type: "nagasaki_champon",
    title_zh: "蘇州林(新地中華街・1985 創業・現代代表的中華料理店・皿うどん名店)",
    title_ja: "蘇州林(そしゅうりん)",
    romaji: "Soshurin",
    summary_zh: "**蘇州林は新地中華街の現代代表中華料理店**(1985 創業)。長崎華僑の家系が創業、ちゃんぽん + 皿うどん + 中華各種で観光客 + 地元客に幅広く対応。本店は中華街南口の大型店舗、テイクアウト「蘇州林の皿うどん」(冷凍便)が全国通販で長崎中華の代名詞。",
    content_md: "- 創業:1985 年(昭和60)新地中華街\n- 主力:ちゃんぽん ¥1100・皿うどん ¥1100・北京ダック ¥6800\n- 通販:皿うどん冷凍便(全国・¥1200/3 食)\n- 立地:長崎市新地町(中華街南口)\n- 営業:11:00-21:00\n- 定休:無休\n- 客層:観光客中心\n- アクセス:長崎電気軌道 新地中華街電停 徒歩 1 分",
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
    tags: ["nagasaki_champon", "soshurin", "1985", "shinchi_chukagai"],
    source: "manual",
  },

  // ════════════════════════════════════════════════════════════════════
  // Phase D — 洋食 2 筆
  // ════════════════════════════════════════════════════════════════════
  {
    slug: "tsuruchan-toruko-rice-1925",
    category: "food",
    sub_type: "nagasaki_toruko_rice",
    title_zh: "ツル茶ん(浜町・1925 創業・九州最古の純喫茶 + トルコライス代表)",
    title_ja: "ツル茶ん",
    romaji: "Tsuruchan",
    summary_zh: "**ツル茶んは九州最古の純喫茶 + トルコライス代表店**(大正14年/1925 創業)。100 年余、家業 4 代目。長崎独自の「トルコライス」(ピラフ + トンカツ + ナポリタンを 1 皿に盛る洋食ハイブリッド・トルコ無関係)を 1950s に発祥した諸説の店の 1。レトロな喫茶店空間 + ボリューム洋食でカジュアル長崎洋食を体験。",
    content_md: "- 創業:1925 年(大正14)浜町\n- 全国位置:九州最古の純喫茶\n- トルコライス発祥諸説:ツル茶ん発祥説 + バイキング 1950s 説 + 諸説あり\n- 名物:元祖トルコライス ¥1430・大正ハイカラトルコライス ¥1700\n- 価格帯:¥1200-2500\n- レトロ空間:1925 開業時の喫茶店空間を保存\n- 立地:長崎市油屋町(浜町アーケード沿い)\n- 営業:11:00-21:00\n- 定休:無休\n- アクセス:長崎電気軌道 観光通電停 徒歩 1 分",
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
    external_urls: { official: "https://tsuru-chan.com/" },
    tags: ["nagasaki_toruko_rice", "tsuruchan", "1925", "kyushu_oldest_kissaten"],
    source: "manual",
  },
  {
    slug: "nagasaki-toruko-rice-overview",
    category: "food",
    sub_type: "nagasaki_toruko_rice",
    title_zh: "トルコライス概論(長崎独自洋食ハイブリッド・1950s 発祥・3 要素 1 皿)",
    title_ja: "トルコライス(長崎洋食)",
    romaji: "Toruko Rice",
    summary_zh: "**トルコライスは長崎独自の洋食ハイブリッド**(1950s 発祥)。ピラフ(or サフランライス)+ トンカツ + ナポリタンスパゲティ を 1 皿に盛り、ドミグラスソース + カレーソース 等で繋ぐ「3 要素 1 皿」の長崎洋食。トルコ料理とは無関係(語源は『トリコロール』『トリオ』等諸説)。長崎市内 50+ 軒で提供、各店オリジナル展開。",
    content_md: "- 発祥:1950s 長崎(具体的元祖店は諸説・ツル茶ん 1925-1950s 説 + 他多数)\n- 構成:ピラフ + トンカツ + ナポリタン(基本 3 要素)\n- ソース:ドミグラス + カレー + チーズ + デミ など各店オリジナル\n- 語源:トルコ無関係(『トリコロール 3 色』説・『トリオ』説 等)\n- 主要提供店:ツル茶ん 1925・ビストロボルドー・カフェマレ・ベルアルカディア 等 50+ 軒\n- 価格帯:¥1200-2200/皿\n- 文化:長崎観光客の必食料理ランキング上位",
    region: "kyushu",
    prefecture_ja: "長崎県",
    gun_ja: null,
    municipality_ja: "長崎市",
    lg_code: "42201",
    area_types: ["urban_central"],
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
    tags: ["nagasaki_toruko_rice", "toruko_overview", "1950s", "yoshoku_hybrid"],
    source: "manual",
  },

  // ════════════════════════════════════════════════════════════════════
  // Phase E — 麺類 + 卓袱概論 3 筆
  // ════════════════════════════════════════════════════════════════════
  {
    slug: "shimabara-somen-overview",
    category: "food",
    sub_type: "nagasaki_men",
    title_zh: "島原素麺概論(全国 3 大素麺・三輪/揖保と並ぶ・島原半島伝統手延べ)",
    title_ja: "島原素麺",
    romaji: "Shimabara Somen",
    summary_zh: "**島原素麺は全国 3 大素麺**(三輪+揖保乃糸+島原)。江戸期から島原半島(雲仙市・南島原市・島原市)で発展、島原の乱(1637)後に小豆島から移住した職人由来説 + 諸説あり。全国生産量で揖保乃糸に次ぐ 2 位、手延べ素麺の細さ + コシ + 喉ごしで全国普及。代表業者:川上製麺(明治期)+ 兵頭製麺所 等。",
    content_md: "- 産地:島原半島(雲仙市・南島原市・島原市)\n- 全国位置:三輪(奈良)+ 揖保乃糸(兵庫)と並ぶ「日本 3 大素麺」\n- 全国生産量:揖保乃糸に次ぐ 2 位\n- 由来:江戸期から手延べ伝統・島原の乱(1637)後の小豆島移住職人説あり\n- 製法:手延べ(機械成形ではなく手で引き伸ばす)\n- 主要業者:川上製麺・兵頭製麺所・林田製麺・本田製麺 等 80+ 軒\n- 食べ方:冷やし素麺(夏)・にゅうめん(冬)・寒晒し(高級品)\n- 価格帯:1 把 ¥250-500・贈答箱 ¥2500-10000\n- 直販:島原・南島原・雲仙市内の直売店",
    region: "kyushu",
    prefecture_ja: "長崎県",
    gun_ja: null,
    municipality_ja: "南島原市",
    lg_code: "42214",
    area_types: ["rural_townscape", "industrial_heritage"],
    lat: 32.792,
    lon: 130.245,
    season_start: null,
    season_end: null,
    event_start: null,
    event_end: null,
    price_tier: 2,
    booking_window_days: null,
    closed_days: [],
    external_urls: {},
    tags: ["nagasaki_men", "shimabara_somen", "japan_3_somen", "tedori"],
    source: "manual",
  },
  {
    slug: "goto-udon-overview",
    category: "food",
    sub_type: "nagasaki_men",
    title_zh: "五島うどん概論(あごだし発祥・離島伝統手延べ・椿油塗布の独特製法)",
    title_ja: "五島うどん",
    romaji: "Goto Udon",
    summary_zh: "**五島うどんは離島伝統の手延べうどん**(五島列島・新上五島町中心)。江戸期から椿油を塗布する独特の手延べ製法、細麺コシ強・つるつるの食感、「あごだし」(飛魚の焼干だし)が定番つゆで「あごだし発祥地」とされる。代表業者:中本製麺・五島手延うどん協同組合・蛤浜の手延べ家業 30+ 軒。",
    content_md: "- 産地:五島列島(新上五島町中心+ 五島市)\n- 製法:椿油を塗布しての手延べ(全国唯一・他産地と差別化)\n- 麺の特徴:細さ + コシ強 + つるつる食感\n- だし:あごだし(飛魚の焼干)が定番・「あごだし発祥地」とも\n- 認定:長崎県指定伝統的工芸品(食品分野)\n- 主要業者:中本製麺・五島手延うどん協同組合・蛤浜系業者 30+ 軒\n- 食べ方:あごだしの「地獄炊き」(熱湯でさっと茹で・釜揚げ風・五島伝統食法)\n- 価格帯:1 把 ¥350-700・贈答箱 ¥3000-12000\n- 直販:新上五島町内の直売店 + JA 全農長崎",
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
    booking_window_days: null,
    closed_days: [],
    external_urls: {},
    tags: ["nagasaki_men", "goto_udon", "tsubaki_oil", "ago_dashi"],
    source: "manual",
  },
  {
    slug: "nagasaki-shippoku-ryori-overview",
    category: "food",
    sub_type: "nagasaki_shippoku",
    title_zh: "卓袱料理概論(長崎独自 fusion・中華+和食+蘭学・円卓食文化・1700s 確立)",
    title_ja: "卓袱料理(しっぽくりょうり)",
    romaji: "Shippoku Ryori",
    summary_zh: "**卓袱料理は長崎独自の fusion 食文化**(1700s 確立)。鎖国期長崎で中国(明清)+和食(日本)+蘭学(オランダ)の食材+ 調理法が融合、円卓 + 大皿料理 + 同卓喫食(身分関係なく囲む)の独特形式。「お鰭」(吸物)→「小菜」(前菜)→「中鉢」(揚物)→「大鉢」(豚角煮 等)→「点心」(デザート)の順序。料亭花月 1642 + 吉宗 + 銀嶺 + よっそう が代表提供店。",
    content_md: "- 確立:1700s 鎖国期長崎\n- 構成:中華(明清)+ 和食 + 蘭学(オランダ)の fusion\n- 形式:円卓 + 大皿料理 + 同卓喫食(身分関係なく囲む独特の食礼)\n- 順序:お鰭 → 小菜(前菜)→ 中鉢(揚物)→ 大鉢(豚角煮 等)→ 点心\n- 名物料理:豚の角煮(東坡肉系)+ 揚げ物 + 鯨料理 + 唐人料理\n- 「卓袱」語源:中国語「桌袱」(zhuō fú・テーブルクロス・食卓掛け)\n- 主要老舗:花月 1642 + 吉宗 + 銀嶺 + よっそう 1866\n- 価格帯:¥6600-44000/人(コース・店舗別)\n- 予約:必須(2-3 日前・最少 4 名から)\n- 観光客向け:吉宗(浜町・¥3700 ランチコースあり)が手の届く価格",
    region: "kyushu",
    prefecture_ja: "長崎県",
    gun_ja: null,
    municipality_ja: "長崎市",
    lg_code: "42201",
    area_types: ["urban_central", "historic_district"],
    lat: 32.744,
    lon: 129.876,
    season_start: null,
    season_end: null,
    event_start: null,
    event_end: null,
    price_tier: 5,
    booking_window_days: 7,
    closed_days: [],
    external_urls: {},
    tags: ["nagasaki_shippoku", "shippoku_overview", "1700s", "round_table_fusion"],
    source: "manual",
  },

  // ════════════════════════════════════════════════════════════════════
  // Phase F — 離島産物 4 筆
  // ════════════════════════════════════════════════════════════════════
  {
    slug: "tsushima-tora-fugu-overview",
    category: "food",
    sub_type: "nagasaki_shima_san",
    title_zh: "対馬とらふぐ(全国級高級魚・対馬海峡天然+養殖・冬季最盛)",
    title_ja: "対馬とらふぐ",
    romaji: "Tsushima Tora Fugu",
    summary_zh: "**対馬とらふぐは全国級高級魚**(対馬市・対馬海峡天然+養殖)。下関+大分+愛媛と並ぶ全国 4 大とらふぐ産地、特に天然物の対馬産は「絶品」評価。冬季(11-3 月)が最盛、てっさ(刺身)+ てっちり(鍋)+ 唐揚げ + ヒレ酒の伝統食。対馬市内の専門店「対馬ふぐ料理」+ 厳原港周辺の旅館で提供。",
    content_md: "- 産地:対馬市(対馬海峡)\n- 全国位置:下関 + 大分 + 愛媛 + 対馬 の 4 大とらふぐ産地\n- 天然 vs 養殖:天然物の対馬産は「絶品」評価(下関市場経由で全国流通)\n- 漁期:11 月-3 月(冬季最盛)\n- 食べ方:てっさ(刺身)・てっちり(鍋)・唐揚げ・ヒレ酒\n- 価格帯:コース ¥10000-30000(専門店)\n- 主要提供:対馬市厳原町の専門店 + 厳原港周辺の旅館\n- アクセス:対馬空港(JTA)+ 厳原港(博多港からフェリー 5 時間)",
    region: "kyushu",
    prefecture_ja: "長崎県",
    gun_ja: null,
    municipality_ja: "対馬市",
    lg_code: "42209",
    area_types: ["fishing_port", "urban_central"],
    lat: 34.197,
    lon: 129.291,
    season_start: "2026-11-01",
    season_end: "2026-03-31",
    event_start: null,
    event_end: null,
    price_tier: 4,
    booking_window_days: 30,
    closed_days: [],
    external_urls: {},
    tags: ["nagasaki_shima_san", "tsushima_fugu", "japan_4_fugu_origin"],
    source: "manual",
  },
  {
    slug: "iki-mugi-shochu-gi-2005",
    category: "food",
    sub_type: "nagasaki_shima_san",
    title_zh: "壱岐麦焼酎(GI 認定 2005・麦焼酎発祥地・16 世紀から 500 年伝統)",
    title_ja: "壱岐麦焼酎",
    romaji: "Iki Mugi Shochu",
    summary_zh: "**壱岐麦焼酎は世界知的所有権機関 GI 認定の麦焼酎発祥地**(2005 認定・地理的表示)。16 世紀から続く 500 年の伝統、壱岐市内 7 蔵元(玄海酒造・壱岐の蔵酒造・天の川酒造・重家酒造 等)が麦 2/3 + 米麹 1/3 の独自レシピで麦焼酎を醸す。GI 認定により「壱岐」名称は壱岐産のみ使用可能。",
    content_md: "- GI 認定:2005 年(平成17)世界知的所有権機関(WIPO)地理的表示認定\n- 全国位置:麦焼酎発祥地(16 世紀から)・球磨焼酎(米)+ 琉球泡盛 と並ぶ日本 3 大本格焼酎\n- 産地:壱岐市(壱岐島)\n- 蔵元 7 社:玄海酒造 + 壱岐の蔵酒造 + 天の川酒造 + 重家酒造 + 山の守酒造場 + 猿川伊豆酒造 + 壱岐焼酎協業組合\n- レシピ:麦 2/3 + 米麹 1/3(壱岐特有の比率)\n- 主要銘柄:猿川・壱岐スーパーゴールド・壱岐っ娘・天の川・かめ貯蔵\n- 価格帯:720ml ¥1500-3500・貯蔵酒 ¥3000-8000\n- 蔵見学:複数蔵で可・要事前予約\n- アクセス:壱岐空港 + 郷ノ浦港(博多港からフェリー 1.5 時間)",
    region: "kyushu",
    prefecture_ja: "長崎県",
    gun_ja: null,
    municipality_ja: "壱岐市",
    lg_code: "42210",
    area_types: ["industrial_heritage", "fishing_port"],
    lat: 33.749,
    lon: 129.685,
    season_start: null,
    season_end: null,
    event_start: null,
    event_end: null,
    price_tier: 3,
    booking_window_days: null,
    closed_days: [],
    external_urls: {},
    tags: ["nagasaki_shima_san", "iki_shochu", "gi_2005", "mugi_shochu_origin"],
    source: "manual",
  },
  {
    slug: "goto-ago-himono-overview",
    category: "food",
    sub_type: "nagasaki_shima_san",
    title_zh: "五島あご(飛魚干物・あごだし全国普及の起点・五島列島伝統)",
    title_ja: "五島あご(あごだし用飛魚)",
    romaji: "Goto Ago",
    summary_zh: "**五島あごは飛魚の焼干**(五島列島・新上五島町中心)。「あご」は九州方言で「飛魚」を指す、五島では江戸期から飛魚を炭火で焼いて干した「あご焼干」を作り、上品な甘みのある「あごだし」として全国普及の起点。五島うどん + 長崎雑煮 + 福岡うどん 等の九州料理の出汁文化を支える。",
    content_md: "- 産地:五島列島(新上五島町中心+ 五島市)\n- 「あご」=九州方言で飛魚\n- 加工:飛魚を炭火で焼く → 天日干し(夏-秋)\n- 用途:あごだし(出汁素材)・五島うどん「地獄炊き」のつゆ・長崎雑煮\n- 全国普及:九州料理の出汁文化(うどん・雑煮)を支える\n- 主要販売:新上五島町水産業協同組合 + 五島市内の直売店\n- 価格帯:あご 1 尾 ¥150-300・あご出汁パック ¥800-1500\n- 旬:夏-秋(7-10 月の漁・10-12 月の干し)",
    region: "kyushu",
    prefecture_ja: "長崎県",
    gun_ja: "南松浦郡",
    municipality_ja: "新上五島町",
    lg_code: "42411",
    area_types: ["fishing_port", "rural_townscape"],
    lat: 32.961,
    lon: 129.078,
    season_start: "2026-07-01",
    season_end: "2026-10-31",
    event_start: null,
    event_end: null,
    price_tier: 2,
    booking_window_days: null,
    closed_days: [],
    external_urls: {},
    tags: ["nagasaki_shima_san", "goto_ago", "ago_dashi", "kyushu_dashi"],
    source: "manual",
  },
  {
    slug: "obama-jigoku-mushi",
    category: "food",
    sub_type: "local_specialty",
    title_zh: "小浜温泉地獄蒸し(雲仙小浜・100° 蒸気で食材を蒸す独特調理法)",
    title_ja: "小浜温泉 地獄蒸し",
    romaji: "Obama Jigoku Mushi",
    summary_zh: "**小浜温泉地獄蒸しは温泉蒸気を使った独特調理法**(雲仙市小浜温泉)。105°C+ の温泉蒸気を直接食材に当てる「地獄蒸し」で、海産物 + 野菜 + 卵を素材本来の旨味で味わう。海鳥地獄駅前の「小浜ちゃんぽん蒸し器」(2009 公共施設)で 1 人 ¥500 で利用可能、観光客 + 地元客で賑わう。",
    content_md: "- 立地:雲仙市小浜温泉(海岸沿い・橘湾を望む)\n- 調理法:温泉蒸気(105°C+)を直接食材に当てる\n- 食材:海産物(エビ + 蛤 + イカ)+ 野菜(ジャガイモ + サツマイモ + トウモロコシ)+ 卵\n- 公共施設:小浜温泉ちゃんぽん蒸し器(2009 開設・橘湾沿岸)\n- 利用料:¥500/30 分(食材は持参 or 隣接売店で購入)\n- 隣接:小浜温泉足湯「ほっとふっと 105」(全長 105m・日本一長い足湯)\n- 営業:9:00-19:00\n- 定休:無休\n- アクセス:JR 諫早駅 から バス 60 分・小浜温泉下車",
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
    price_tier: 1,
    booking_window_days: null,
    closed_days: [],
    external_urls: {},
    tags: ["local_specialty", "obama_onsen", "jigoku_mushi", "unzen"],
    source: "manual",
  },

  // ════════════════════════════════════════════════════════════════════
  // Phase G — 銘菓・温泉食 + 雲仙(5 筆)
  // ════════════════════════════════════════════════════════════════════
  {
    slug: "shimabara-kanzarashi-traditional",
    category: "food",
    sub_type: "local_specialty",
    title_zh: "島原寒晒し(かんざらし・島原湧水郷の伝統甘味・白玉粉 + 蜜の冷菓)",
    title_ja: "島原 寒晒し(かんざらし)",
    romaji: "Shimabara Kanzarashi",
    summary_zh: "**寒晒しは島原伝統の冷菓**(島原市)。「水の都」島原(湧水百選)の名水で寒さらし(冬の寒気で晒す)した白玉粉を、蜜(砂糖+生姜+蜂蜜)に浮かべる江戸期からの伝統甘味。代表店「銀水」(1915 創業・島原湧水通り)+「ぐるぐる屋」+「猪原金物店」併設甘味処 等。",
    content_md: "- 起源:江戸期島原(湧水文化由来)\n- 製法:白玉粉を寒晒し(冬の寒気で乾燥保存)→ 茹でて湧水で冷やす → 蜜(砂糖+生姜+蜂蜜)に浮かべる\n- 「水の都」:島原市は環境省選定「名水百選」(1985)・湧水群\n- 主要老舗:銀水(1915 創業・島原市新町)+ ぐるぐる屋 + 猪原金物店併設甘味\n- 価格帯:1 杯 ¥400-600\n- 立地:島原市内(湧水通り)\n- アクセス:島原鉄道 島原駅 徒歩 5-10 分(各店)",
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
    price_tier: 1,
    booking_window_days: null,
    closed_days: [],
    external_urls: {},
    tags: ["local_specialty", "shimabara_kanzarashi", "yusui_100", "ginsui_1915"],
    source: "manual",
  },
  {
    slug: "unzen-jigoku-cuisine",
    category: "food",
    sub_type: "local_specialty",
    title_zh: "雲仙地獄料理(雲仙温泉郷・温泉卵 + 雲仙地獄蒸し料理・温泉旅館の名物)",
    title_ja: "雲仙地獄料理",
    romaji: "Unzen Jigoku Cuisine",
    summary_zh: "**雲仙地獄料理は雲仙温泉郷の郷土食**(雲仙市・雲仙温泉)。雲仙地獄(温泉噴出地・国立公園 1934 日本最初の指定)の温泉熱を使った蒸し料理 + 温泉卵 + 雲仙ハム(豚肉燻製)が伝統食。雲仙温泉旅館 30+ 軒の夕食でも提供、観光客の温泉郷宿泊体験の一部。",
    content_md: "- 立地:雲仙市雲仙温泉(雲仙地獄周辺)\n- 雲仙国立公園:1934 年指定(日本最初の国立公園)\n- 主要食:温泉卵(雲仙温泉熱で蒸す)+ 雲仙ハム(豚肉燻製・大正期確立)+ 雲仙茶碗蒸し + 雲仙湯豆腐\n- 提供:雲仙温泉旅館 30+ 軒の夕食 + 雲仙地獄前の食堂街\n- 名物店:雲仙青雲荘・雲仙九州ホテル・雲仙温泉ホテル他\n- 価格帯:旅館夕食内(1 泊 2 食 ¥18000-40000/人)・地獄前食堂単品 ¥800-2500\n- アクセス:島原鉄道 諫早駅 から バス 80 分・雲仙温泉下車",
    region: "kyushu",
    prefecture_ja: "長崎県",
    gun_ja: null,
    municipality_ja: "雲仙市",
    lg_code: "42213",
    area_types: ["onsen_town", "mountain_village"],
    lat: 32.732,
    lon: 130.260,
    season_start: null,
    season_end: null,
    event_start: null,
    event_end: null,
    price_tier: 3,
    booking_window_days: 14,
    closed_days: [],
    external_urls: {},
    tags: ["local_specialty", "unzen_jigoku", "national_park_1934"],
    source: "manual",
  },
  {
    slug: "nagasaki-konfeito-portuguese-1546",
    category: "food",
    sub_type: "nagasaki_castella",
    title_zh: "金平糖(コンフェイト・1546 ポルトガル伝来・南蛮菓子の代表・砂糖文化発祥)",
    title_ja: "金平糖(コンフェイト)",
    romaji: "Konpeito (Confeito)",
    summary_zh: "**金平糖は 1546 年ポルトガル伝来の南蛮菓子**(長崎・古文書では「平戸」とも)。語源はポルトガル語「confeito」、織田信長への 1569 年献上記録あり。長崎の砂糖貿易拠点 + 京都の砂糖菓子文化と組合せて、現代も長崎+京都の和菓子老舗(緑寿庵清水・本家小梅 等)が手作り継承。長崎県内では福砂屋 + 諏訪商店 + 諏訪屋 等が販売。",
    content_md: "- 伝来:1546 年(天文15)ポルトガル人宣教師(諸説 1543-1546)・長崎/平戸\n- 語源:ポルトガル語「confeito」(砂糖菓子)\n- 信長献上:1569 年(永禄12)織田信長への献上記録(イエズス会フロイス『日本史』)\n- 製法:砂糖溶液をゆっくり時間をかけて結晶化(数日-2 週間)\n- 砂糖文化:長崎の鎖国期砂糖貿易と組合せて発展\n- 主要販売(長崎県内):福砂屋系 + 諏訪屋 + 諏訪商店\n- 全国老舗:緑寿庵清水(京都・1847)+ 本家小梅(京都)\n- 価格帯:小袋 ¥500-1500・贈答箱 ¥2000-5000",
    region: "kyushu",
    prefecture_ja: "長崎県",
    gun_ja: null,
    municipality_ja: "長崎市",
    lg_code: "42201",
    area_types: ["urban_central", "historic_district"],
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
    tags: ["nagasaki_castella", "konpeito", "portuguese_1546", "nanban_kashi"],
    source: "manual",
  },
];

async function main() {
  if (rows.length === 0) {
    console.log("[nagasaki-food] 尚無條目");
    return;
  }
  console.log(`[nagasaki-food] ${rows.length} 筆 ${DRY ? "(dry-run)" : ""}`);
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
      console.error("[nagasaki-food] upsert failed:", error);
      process.exit(1);
    }
    written += batch.length;
    process.stdout.write(`\r[nagasaki-food] upsert: ${written}/${rows.length}`);
  }
  process.stdout.write("\n");
  console.log(`[nagasaki-food] Done — ${written} rows.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

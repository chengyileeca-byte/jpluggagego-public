// Seed 長崎県 · 育類 R2 條目 → public.japan_entries(Sprint 21.4)
// 教会 5 + 城 2 + 唐寺 1 + 史跡橋 1 + 美術館 2 + 博物館 1 = 12 件
//
// 12 筆構成:
//   1. 出津教会堂(国重文 1882)
//   2. 大野教会堂(国重文 1893)
//   3. 黒島天主堂(国重文 1902)
//   4. 田平天主堂(国重文 1918)
//   5. 旧野首教会(野崎島・国重文 1908)
//   6. 平戸城(1707・国指定史跡)
//   7. 松浦史料博物館(松浦旧居・国重文)
//   8. 福済寺(1628・万国霊廟長崎観音 1979)
//   9. 諫早眼鏡橋(国重文・1839)
//   10. 島原城(1624・松倉氏)
//   11. 軍艦島デジタルミュージアム(2015・VR 体験)
//   12. 長崎県美術館(2005 隈研吾設計)

import { config as loadEnv } from "dotenv";
loadEnv({ path: ".env.local" });

import { createAdminClient } from "../src/lib/supabase/admin";

const DRY = process.argv.includes("--dry-run");

type SubType =
  | "nagasaki_christian_history"
  | "nagasaki_industrial_revolution"
  | "history_site_castle"
  | "temple_shrine"
  | "museum_art";

interface SeedRow {
  slug: string;
  category: "culture";
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
  {
    slug: "shitsu-tenshudo-1882",
    category: "culture",
    sub_type: "nagasaki_christian_history",
    title_zh: "出津教会堂(長崎市・国重文 1882・ド・ロ神父設計・潜伏キリシタン世遺構成)",
    title_ja: "出津教会堂",
    romaji: "Shitsu Kyoukaidou",
    summary_zh: "**出津教会堂は外海地区の代表教会**(長崎市西出津町・1882 完成・国重文 2011)。**ド・ロ神父**(マルク・マリ・ド・ロ・1840-1914・フランス出身)が建立、外海地区(出津+ 大野+ 黒崎)の潜伏キリシタン解禁後の信仰拠点。レンガ+ 漆喰の白い外観+ ド・ロ神父記念館併設、2018 世界遺産構成資産。",
    content_md: "- 完成:1882 年(明治 15)\n- 設計+ 建立:ド・ロ神父(フランス・パリ外国宣教会)\n- 国指定重要文化財:2011 年\n- 世界遺産:2018 潜伏キリシタン関連 12 構成資産\n- 立地:長崎市西出津町(外海地区)\n- 隣接:ド・ロ神父記念館(¥300・徒歩 1 分)+ 旧出津救助院(国重文)\n- 入場料:¥300(維持寄付金)\n- 営業:9:00-17:00(教会奉仕中除く)\n- アクセス:長崎駅 から バス 70 分・出津文化村下車",
    region: "kyushu",
    prefecture_ja: "長崎県",
    gun_ja: null,
    municipality_ja: "長崎市",
    lg_code: "42201",
    area_types: ["world_heritage", "shrine_temple"],
    lat: 32.8639,
    lon: 129.7458,
    season_start: null,
    season_end: null,
    event_start: null,
    event_end: null,
    price_tier: 1,
    booking_window_days: null,
    closed_days: [],
    external_urls: { official: "https://kirishitan.jp/components/com009" },
    tags: ["nagasaki_christian_history", "world_heritage_2018", "national_important_cultural_property", "1882", "de_rotz"],
    source: "manual",
  },
  {
    slug: "ono-tenshudo-1893",
    category: "culture",
    sub_type: "nagasaki_christian_history",
    title_zh: "大野教会堂(長崎市・国重文 1893・ド・ロ神父設計・玄武岩石造の素朴な巡回教会)",
    title_ja: "大野教会堂",
    romaji: "Ono Kyoukaidou",
    summary_zh: "**大野教会堂は外海地区の小規模巡回教会**(長崎市大野町・1893 完成・国重文 2008)。出津教会堂のド・ロ神父が建立、玄武岩+ 漆喰の素朴な石造、約 25 戸の小集落のための巡回ミサ用。鉛瓦屋根+ 厚さ 70 cm の石壁が特徴的、出津教会堂の補完施設。2018 世界遺産構成資産。",
    content_md: "- 完成:1893 年(明治 26)\n- 設計+ 建立:ド・ロ神父\n- 構造:玄武岩+ 漆喰の石造(石壁厚 70 cm)\n- 国指定重要文化財:2008 年\n- 世界遺産:2018 潜伏キリシタン関連 12 構成資産\n- 立地:長崎市下大野町(出津から 車 10 分)\n- 役割:25 戸小集落のための巡回ミサ用\n- 入場料:無料(維持寄付歓迎)\n- 訪問:外観のみ・内部は事前連絡(長崎教区)\n- アクセス:出津教会堂 から 車 10 分",
    region: "kyushu",
    prefecture_ja: "長崎県",
    gun_ja: null,
    municipality_ja: "長崎市",
    lg_code: "42201",
    area_types: ["world_heritage", "shrine_temple"],
    lat: 32.8569,
    lon: 129.7458,
    season_start: null,
    season_end: null,
    event_start: null,
    event_end: null,
    price_tier: 1,
    booking_window_days: null,
    closed_days: [],
    external_urls: { official: "https://kirishitan.jp/components/com010" },
    tags: ["nagasaki_christian_history", "world_heritage_2018", "national_important_cultural_property", "1893", "basalt_stone"],
    source: "manual",
  },
  {
    slug: "kuroshima-tenshudo-1902",
    category: "culture",
    sub_type: "nagasaki_christian_history",
    title_zh: "黒島天主堂(佐世保市黒島・国重文 1902・レンガ造ロマネスク・島民総出建立 6 年)",
    title_ja: "黒島天主堂",
    romaji: "Kuroshima Tenshudo",
    summary_zh: "**黒島天主堂は佐世保市黒島の代表教会**(1902 完成・国重文 1998)。レンガ 40 万個+ 大理石 25 種を島民が 6 年がかりで運搬・建立、ロマネスク様式の本格的レンガ造教会。マルマン神父(フランス)設計、現存信徒約 80 戸が今も使用する現役教会。2018 世界遺産構成資産。",
    content_md: "- 完成:1902 年(明治 35)\n- 設計:マルマン神父(フランス・パリ外国宣教会)\n- 様式:ロマネスク+ レンガ造\n- 規模:レンガ 40 万個+ 大理石 25 種(島民 6 年がかり建立)\n- 国指定重要文化財:1998 年\n- 世界遺産:2018 潜伏キリシタン関連 12 構成資産\n- 立地:佐世保市黒島町(黒島・有人島)\n- 信徒:現存約 80 戸(島の 8 割がカトリック)\n- アクセス:相浦港 から フェリー 50 分・黒島港 徒歩 15 分(¥620)",
    region: "kyushu",
    prefecture_ja: "長崎県",
    gun_ja: null,
    municipality_ja: "佐世保市",
    lg_code: "42202",
    area_types: ["world_heritage", "shrine_temple"],
    lat: 33.1839,
    lon: 129.5828,
    season_start: null,
    season_end: null,
    event_start: null,
    event_end: null,
    price_tier: 1,
    booking_window_days: null,
    closed_days: [],
    external_urls: { official: "https://kirishitan.jp/components/com011" },
    tags: ["nagasaki_christian_history", "world_heritage_2018", "national_important_cultural_property", "1902", "kuroshima"],
    source: "manual",
  },
  {
    slug: "tabira-tenshudo-1918",
    category: "culture",
    sub_type: "nagasaki_christian_history",
    title_zh: "田平天主堂(平戸市・国重文 1918・鉄川与助設計・レンガ造 4 年がかり建立・西日本初)",
    title_ja: "田平天主堂",
    romaji: "Tabira Tenshudo",
    summary_zh: "**田平天主堂は鉄川与助設計の代表的レンガ造教会**(平戸市田平町・1918 完成・国重文 2003)。**現存する鉄川与助の最高傑作** とされる、4 年がかり建立のレンガ造ロマネスク様式。隣接の田平公園(R2 楽 = 桜名所)+ 平戸大橋徒歩 15 分の絶景立地。世界遺産構成資産ではないが、長崎県内のレンガ教会群の最重要 1。",
    content_md: "- 完成:1918 年(大正 7)・建立 4 年\n- 設計:鉄川与助(西海岸教会建築の名匠)\n- 様式:ロマネスク+ レンガ造\n- 国指定重要文化財:2003 年\n- 評価:鉄川与助の代表作・最高傑作\n- 立地:平戸市田平町(平戸大橋を渡って本土側)\n- 隣接:田平公園(桜 1500 本)+ 平戸大橋(徒歩 15 分)\n- 入場料:無料(維持寄付歓迎)\n- 営業:9:00-17:00\n- アクセス:松浦鉄道 たびら平戸口駅 徒歩 15 分(車 5 分)",
    region: "kyushu",
    prefecture_ja: "長崎県",
    gun_ja: null,
    municipality_ja: "平戸市",
    lg_code: "42207",
    area_types: ["shrine_temple"],
    lat: 33.3719,
    lon: 129.5772,
    season_start: null,
    season_end: null,
    event_start: null,
    event_end: null,
    price_tier: 1,
    booking_window_days: null,
    closed_days: [],
    external_urls: {},
    tags: ["nagasaki_christian_history", "national_important_cultural_property", "1918", "tetsugawa_yosuke", "tabira"],
    source: "manual",
  },
  {
    slug: "nokubi-church-nozakijima",
    category: "culture",
    sub_type: "nagasaki_christian_history",
    title_zh: "旧野首教会(小値賀町野崎島・国重文 1908・無人島の幻教会・世遺構成)",
    title_ja: "旧野首教会",
    romaji: "Kyu Nokubi Kyoukai",
    summary_zh: "**旧野首教会は無人島野崎島に残る神秘の教会**(小値賀町野崎島・1908 完成・国重文 1989)。鉄川与助設計のレンガ造、潜伏キリシタンの末裔約 17 戸が建立したが 1971 全員離島・無人化、現在は無人島に教会のみ残存。2018 世界遺産構成資産、ガイド付ツアーでのみ訪問可。",
    content_md: "- 完成:1908 年(明治 41)\n- 設計:鉄川与助\n- 国指定重要文化財:1989 年\n- 世界遺産:2018 潜伏キリシタン関連 12 構成資産\n- 立地:小値賀町野崎島(無人島)\n- 1971 年:島民全員離島・無人化\n- 訪問:小値賀町ガイド付ツアーのみ可(船+ 徒歩 30 分)\n- ツアー料金:¥6500-(船+ ガイド+ 上陸料込)\n- 予約:小値賀町観光協会(おぢかアイランドツーリズム)\n- アクセス:佐世保港 から 高速船 1 時間 30 分・小値賀港 から 船 30 分",
    region: "kyushu",
    prefecture_ja: "長崎県",
    gun_ja: "北松浦郡",
    municipality_ja: "小値賀町",
    lg_code: "42383",
    area_types: ["world_heritage", "shrine_temple"],
    lat: 33.2197,
    lon: 129.0844,
    season_start: null,
    season_end: null,
    event_start: null,
    event_end: null,
    price_tier: 3,
    booking_window_days: 14,
    closed_days: [],
    external_urls: { official: "https://ojikajima.jp/" },
    tags: ["nagasaki_christian_history", "world_heritage_2018", "national_important_cultural_property", "1908", "nozakijima_uninhabited"],
    source: "manual",
  },
  {
    slug: "hirado-castle-1707",
    category: "culture",
    sub_type: "history_site_castle",
    title_zh: "平戸城(1707・松浦氏築城・国指定史跡・1962 復元・南蛮交易拠点平戸の象徴)",
    title_ja: "平戸城",
    romaji: "Hirado Jou",
    summary_zh: "**平戸城は松浦氏の居城**(平戸市岩の上町・1707 築城)。山鹿流の山城+ 海城の複合形式、1707 年に 31 代藩主松浦棟が現在地に築城(その前は 1599 日之嶽城)。明治期に廃城・1962 鉄筋コンクリートで天守再建、内部は資料館。**国指定史跡 1955** + 続日本 100 名城選定、平戸瀬戸+ 平戸大橋眺望。",
    content_md: "- 築城:1707 年(宝永 4)・松浦棟(31 代藩主)\n- 廃城:1871 年(明治 4)\n- 復元:1962 年 鉄筋コンクリート天守\n- 国指定史跡:1955 年\n- 続日本 100 名城:第 187 番(2018 選定)\n- 構造:山城+ 海城複合(山鹿流軍学)\n- 内部:資料館(松浦氏関連史料展示)\n- 入場料:¥520\n- 営業:8:30-18:00(年中無休)\n- 隣接:松浦史料博物館(徒歩 5 分)+ 平戸オランダ商館(徒歩 10 分)\n- アクセス:松浦鉄道 たびら平戸口駅 から バス 30 分・平戸桟橋 徒歩 10 分",
    region: "kyushu",
    prefecture_ja: "長崎県",
    gun_ja: null,
    municipality_ja: "平戸市",
    lg_code: "42207",
    area_types: ["history_site_castle"],
    lat: 33.3681,
    lon: 129.5511,
    season_start: null,
    season_end: null,
    event_start: null,
    event_end: null,
    price_tier: 1,
    booking_window_days: null,
    closed_days: [],
    external_urls: { official: "https://hirado-castle.jp/" },
    tags: ["history_site_castle", "1707", "matsuura_clan", "national_historic_site", "100_castles"],
    source: "manual",
  },
  {
    slug: "matsuura-museum",
    category: "culture",
    sub_type: "museum_art",
    title_zh: "松浦史料博物館(平戸藩主松浦氏旧居・国登録有形文化財・1893 完成・1955 公開)",
    title_ja: "松浦史料博物館",
    romaji: "Matsuura Shiryou Hakubutsukan",
    summary_zh: "**松浦史料博物館は平戸藩主松浦氏の旧居を活用した私立博物館**(平戸市鏡川町・1893 邸宅完成・1955 公開・国登録有形文化財)。鶴ヶ峯邸として知られる、松浦氏 33 代隆を最後の私邸+ 庭園+ 蔵を保存。**南蛮交易史+ オランダ商館関連史料+ 茶道(鎮信流)茶器** 等多数展示、平戸の歴史を凝縮。茶道体験+ 抹茶接待もあり。",
    content_md: "- 邸宅完成:1893 年(明治 26)鶴ヶ峯邸\n- 公開:1955 年(昭和 30)\n- 国登録有形文化財:邸宅+ 蔵+ 庭園\n- 立地:平戸市鏡川町(平戸城 徒歩 5 分)\n- 主要展示:南蛮交易史料+ オランダ商館関連+ 茶道(鎮信流・松浦氏家伝)\n- 茶道体験:閑雲亭茶室で抹茶接待 ¥600(要予約)\n- 入館料:¥600\n- 営業:8:30-17:00(年中無休)\n- アクセス:松浦鉄道 たびら平戸口駅 から バス 30 分・平戸桟橋 徒歩 10 分",
    region: "kyushu",
    prefecture_ja: "長崎県",
    gun_ja: null,
    municipality_ja: "平戸市",
    lg_code: "42207",
    area_types: ["museum_art", "historic_district"],
    lat: 33.3678,
    lon: 129.5519,
    season_start: null,
    season_end: null,
    event_start: null,
    event_end: null,
    price_tier: 1,
    booking_window_days: null,
    closed_days: [],
    external_urls: { official: "https://www.matsura.or.jp/" },
    tags: ["museum_art", "matsuura_shiryou", "1893_residence", "registered_cultural_property", "chinshin_tea"],
    source: "manual",
  },
  {
    slug: "fukusaiji-1628",
    category: "culture",
    sub_type: "temple_shrine",
    title_zh: "福済寺・万国霊廟長崎観音(1628 創建・四福寺・1979 万国霊廟+18m 観音像・原爆被爆復興)",
    title_ja: "福済寺",
    romaji: "Fukusaiji",
    summary_zh: "**福済寺は長崎四福寺の 1**(長崎市筑後町・1628 創建)。1945 原爆で全壊→1979 再建時に **万国霊廟長崎観音**(高さ 18 m・亀の上に立つ観音像)を新造、観光名所化。原爆+ 戦没者慰霊の意も込めた近代モニュメント。本堂は質素だが観音像のスケール+ 山腹立地で長崎港を見下ろす景観名所。",
    content_md: "- 創建:1628 年(寛永 5)漳州出身唐人\n- 1945 原爆全壊:長崎四福寺で唯一全壊\n- 1979 再建:万国霊廟長崎観音(高さ 18 m・亀の上)\n- 観音像作者:北村西望(平和祈念像と同作家)\n- 立地:長崎市筑後町(山腹・長崎駅徒歩 8 分)\n- 入場料:¥200\n- 営業:7:00-17:00(年中無休)\n- 隣接:聖福寺(徒歩 5 分)+ 長崎駅(徒歩 8 分)\n- アクセス:JR 長崎駅 徒歩 8 分(山腹で坂)",
    region: "kyushu",
    prefecture_ja: "長崎県",
    gun_ja: null,
    municipality_ja: "長崎市",
    lg_code: "42201",
    area_types: ["shrine_temple"],
    lat: 32.7553,
    lon: 129.8742,
    season_start: null,
    season_end: null,
    event_start: null,
    event_end: null,
    price_tier: 1,
    booking_window_days: null,
    closed_days: [],
    external_urls: {},
    tags: ["temple_shrine", "fukusaiji", "1628", "1979_kannon_18m", "kitamura_seibo"],
    source: "manual",
  },
  {
    slug: "isahaya-meganebashi-1839",
    category: "culture",
    sub_type: "history_site_castle",
    title_zh: "諫早眼鏡橋(国指定重文・1839 完成・現存日本最古アーチ石橋・1958 諫早水害後移築保存)",
    title_ja: "諫早眼鏡橋",
    romaji: "Isahaya Megane Bashi",
    summary_zh: "**諫早眼鏡橋は現存日本最古のアーチ式石橋**(諫早市諫早公園・1839 完成・国指定重要文化財 1958)。長崎眼鏡橋(1634)に次いで作られた長崎県の代表的石橋、本明川にかかる二連アーチ。**1957 諫早水害**(死者 539 名)後、保存のため公園内に移築(全国初の橋移築事例)、現在は諫早公園のシンボル。",
    content_md: "- 完成:1839 年(天保 10)\n- 構造:二連アーチ式石橋(全長 49.2 m × 幅 5.5 m)\n- 認定:国指定重要文化財(1958 年)\n- 1957 諫早水害:死者 539 名・橋は持ちこたえる\n- 1959-1961 移築:本明川 → 諫早公園内(全国初の橋移築事例)\n- 立地:諫早公園(諫早駅徒歩 12 分)\n- 入場料:無料(常時公開)\n- 隣接:諫早公園(桜名所・諫早城跡)\n- アクセス:JR 諫早駅 徒歩 12 分・西九州新幹線で福岡から 1 時間",
    region: "kyushu",
    prefecture_ja: "長崎県",
    gun_ja: null,
    municipality_ja: "諫早市",
    lg_code: "42204",
    area_types: ["history_site_castle", "park_garden"],
    lat: 32.8439,
    lon: 130.0508,
    season_start: null,
    season_end: null,
    event_start: null,
    event_end: null,
    price_tier: 1,
    booking_window_days: null,
    closed_days: [],
    external_urls: {},
    tags: ["history_site_castle", "national_important_cultural_property", "1839", "oldest_arch_bridge", "1959_relocation"],
    source: "manual",
  },
  {
    slug: "shimabara-castle-1624",
    category: "culture",
    sub_type: "history_site_castle",
    title_zh: "島原城(1624 築城・松倉重政・1637-38 島原の乱の主因・1964 復元・キリシタン史料館併設)",
    title_ja: "島原城",
    romaji: "Shimabara Jou",
    summary_zh: "**島原城は松倉重政築城の総石垣城**(島原市・1624 完成・1964 復元)。本来 4 万石の松倉氏が 10 万石級の巨大城を築き、過酷な労役+ 重税で島原の乱(1637-38)勃発の主因に。1873 廃城→1964 鉄筋コンクリート天守復元、**キリシタン史料館** 併設(島原の乱+ 潜伏キリシタン関連)。続日本 100 名城選定。",
    content_md: "- 築城:1624 年(寛永 1)・松倉重政\n- 規模:4 万石ながら 10 万石級巨大城(過剰築城)\n- 島原の乱:1637-38(過酷な労役+ 重税が引き金)\n- 廃城:1873 年(明治 6)\n- 復元:1964 年 鉄筋コンクリート天守\n- 続日本 100 名城:第 191 番(2018 選定)\n- 内部:キリシタン史料館+ 民俗史料館+ 西望記念館(北村西望生誕地)\n- 入場料:¥720\n- 営業:9:00-17:30(年中無休)\n- アクセス:島原鉄道 島原駅 徒歩 10 分",
    region: "kyushu",
    prefecture_ja: "長崎県",
    gun_ja: null,
    municipality_ja: "島原市",
    lg_code: "42203",
    area_types: ["history_site_castle"],
    lat: 32.7867,
    lon: 130.3622,
    season_start: null,
    season_end: null,
    event_start: null,
    event_end: null,
    price_tier: 1,
    booking_window_days: null,
    closed_days: [],
    external_urls: { official: "https://shimabarajou.com/" },
    tags: ["history_site_castle", "1624", "matsukura_shigemasa", "shimabara_uprising_cause", "100_castles"],
    source: "manual",
  },
  {
    slug: "gunkanjima-digital-museum-2015",
    category: "culture",
    sub_type: "nagasaki_industrial_revolution",
    title_zh: "軍艦島デジタルミュージアム(2015 開館・出島ワーフ隣・VR 体験+ 大型映像で立入禁止区域再現)",
    title_ja: "軍艦島デジタルミュージアム",
    romaji: "Gunkanjima Digital Museum",
    summary_zh: "**軍艦島デジタルミュージアムは VR + 大型映像で軍艦島(端島)を体感する施設**(長崎市松が枝町・2015 開館)。軍艦島は実上陸ツアーがあるが立入区域は限定的、当ミュージアムでは **立入禁止の建物内部+ 屋上+ 海底坑道** を VR で再現体験可。実上陸できなかった日(海況欠航)の代替+ 上陸前後の理解深化に最適。",
    content_md: "- 開館:2015 年(平成 27)\n- 立地:長崎市松が枝町(出島ワーフ徒歩 5 分)\n- 体験:VR(立入禁止建物+ 海底坑道)+ 大型映像+ ジオラマ+ 模型展示\n- 構成:6 シアター(各 5-10 分)+ VR コーナー\n- 入場料:¥1800(¥3500 セット軍艦島ツアー船付き)\n- 営業:9:00-19:00(年中無休)\n- 上陸代替:海況欠航時の理解+ 上陸前後の体験深化\n- 隣接:出島(徒歩 8 分)+ 大浦天主堂(徒歩 10 分)+ グラバー園(徒歩 12 分)\n- アクセス:長崎電軌「大浦海岸通り」電停 徒歩 3 分",
    region: "kyushu",
    prefecture_ja: "長崎県",
    gun_ja: null,
    municipality_ja: "長崎市",
    lg_code: "42201",
    area_types: ["museum_art"],
    lat: 32.7361,
    lon: 129.8694,
    season_start: null,
    season_end: null,
    event_start: null,
    event_end: null,
    price_tier: 2,
    booking_window_days: null,
    closed_days: [],
    external_urls: { official: "https://www.gdm.nagasaki.jp/" },
    tags: ["nagasaki_industrial_revolution", "digital_museum", "2015", "vr_experience", "alternative_for_failed_landing"],
    source: "manual",
  },
  {
    slug: "nagasaki-prefectural-art-museum-2005",
    category: "culture",
    sub_type: "museum_art",
    title_zh: "長崎県美術館(2005 開館・隈研吾設計・運河を渡る橋型建築・スペイン美術コレクション国内屈指)",
    title_ja: "長崎県美術館",
    romaji: "Nagasaki Kenritsu Bijutsukan",
    summary_zh: "**長崎県美術館は隈研吾設計の現代美術館**(長崎市出島町・2005 開館・水辺の森公園内)。**運河を渡る橋型建築** が建築賞多数受賞、屋上庭園+ オープンカフェ+ 港眺望。常設は **スペイン美術コレクション** 国内屈指(ピカソ・ダリ・ミロ等 750 件)+ 長崎ゆかりの近代美術。出島隣接で長崎観光の動線に組込みやすい。",
    content_md: "- 開館:2005 年(平成 17)\n- 設計:隈研吾(国立競技場・浅草文化観光センター 等)\n- 立地:長崎市出島町(水辺の森公園内・出島隣接)\n- 構造:運河を渡る橋型建築(2 棟+ 連絡橋)\n- 主要収蔵:スペイン美術 750 件(ピカソ+ ダリ+ ミロ+ ゴヤ+ グレコ・国内屈指)+ 長崎近代美術\n- 屋上庭園:無料・港眺望\n- 入館料:¥420(常設)+ 特別展別\n- 営業:10:00-20:00(月曜定休)\n- アクセス:長崎電軌「出島」電停 徒歩 5 分",
    region: "kyushu",
    prefecture_ja: "長崎県",
    gun_ja: null,
    municipality_ja: "長崎市",
    lg_code: "42201",
    area_types: ["museum_art", "park_garden"],
    lat: 32.7367,
    lon: 129.8744,
    season_start: null,
    season_end: null,
    event_start: null,
    event_end: null,
    price_tier: 1,
    booking_window_days: null,
    closed_days: ["mon"],
    external_urls: { official: "https://www.nagasaki-museum.jp/" },
    tags: ["museum_art", "kuma_kengo", "2005", "spanish_art_750", "bridge_architecture"],
    source: "manual",
  },
];

async function main() {
  if (rows.length === 0) {
    console.log("[nagasaki-culture-r2] 尚無條目");
    return;
  }
  console.log(`[nagasaki-culture-r2] ${rows.length} 筆 ${DRY ? "(dry-run)" : ""}`);
  if (DRY) return;
  const sb = createAdminClient();
  const { error } = await sb.from("japan_entries").upsert(rows, { onConflict: "slug" });
  if (error) {
    console.error("[nagasaki-culture-r2] upsert failed:", error);
    process.exit(1);
  }
  console.log(`[nagasaki-culture-r2] Done — ${rows.length} rows.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

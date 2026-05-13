// Seed 兵庫県 · 食類 條目 → public.japan_entries(Sprint 18.1 食 R1)
//
// 兵庫 = 5 國の食地誌:
//   - 摂津(神戸):神戸ステーキ + 神戸スイーツ(モロゾフ 1931 + ユーハイム 1909)+ 南京町中華 + 開港洋食
//   - 摂津(西宮):灘五郷 5 大酒造地(剣菱 1505・菊正宗 1659・白鹿 1662・白鶴 1743・大関 1711)
//   - 播磨:明石焼 + 揖保乃糸 1418 + ヒガシマル醤油 1666 + 姫路おでん + 赤穂塩
//   - 但馬:但馬牛(神戸牛のルーツ・1300 年血統)+ 出石そば 1706 + 松葉ガニ
//   - 丹波:丹波黒豆 + 栗 + 松茸 + 篠山牡丹鍋 + 鳳鳴酒造 1797
//   - 淡路:玉ねぎ全国 No.1 + 淡路ビーフ + 鳴門鯛
//
// 嚴格定義(大阪食 reform 継承):全部具体餐廳・酒造・工場記念館・実在物件のみ。
// 概論/史観 entries は culture seed file へ(separate cycle)。
//
// 26 筆構成
//
// Usage:
//   npm run seed:japan-hyogo-food:dry
//   npm run seed:japan-hyogo-food

import { config as loadEnv } from "dotenv";
loadEnv({ path: ".env.local" });

import { createAdminClient } from "../src/lib/supabase/admin";

const DRY = process.argv.includes("--dry-run");

type SubType =
  | "kobe_steak"
  | "kobe_sweets"
  | "nada_brewery"
  | "harima_local"
  | "tajima_local"
  | "tanba_hyogo_local"
  | "restaurant_recommend"
  | "cafe_wagashi"
  | "ramen_shop";

interface SeedRow {
  slug: string;
  category: "food";
  sub_type: SubType;
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
  // ══════════════════════════════════════════════════════════════════
  // A. 神戸ステーキ(4 筆)
  // ══════════════════════════════════════════════════════════════════
  {
    slug: "mooria-honten-shinkobe",
    category: "food",
    sub_type: "kobe_steak",
    title_zh: "モーリヤ本店(1885 創業・神戸ステーキ最古老舗・三宮)",
    title_ja: "モーリヤ本店",
    romaji: "Moriya Honten",
    summary_zh:
      "1885 神戸三宮で創業した日本最古級の神戸ステーキ専門店。140 年余の歴史で,神戸牛(但馬血統 + 但馬牛のうち神戸基準を満たす最高ランク)の鉄板焼。コース ¥12000-30000・ランチ ¥3500-。本店 + 三宮店 + ハーバーランド店等 5 店舗体制。",
    content_md:
      "- 創業:1885(神戸ステーキ最古級)\n- 立地:神戸三宮\n- 神戸牛鉄板ステーキ\n- コース:¥12000-30000\n- ランチ:¥3500-\n- 5 店舗体制\n- 2026-04 人工查核",
    region: "kansai",
    prefecture_ja: "兵庫県",
    gun_ja: null,
    municipality_ja: "神戸市",
    lg_code: "28100",
    area_types: ["urban_central"],
    lat: 34.692,
    lon: 135.196,
    season_start: null,
    season_end: null,
    event_start: null,
    event_end: null,
    price_tier: 4,
    booking_window_days: 30,
    closed_days: [],
    external_urls: { official: "https://www.mouriya.co.jp/" },
    tags: ["steak", "moriya", "kobe_beef", "since_1885", "sannomiya"],
    source: "manual",
  },
  {
    slug: "wakkoqu-kobe-1962",
    category: "food",
    sub_type: "kobe_steak",
    title_zh: "WAKKOQU 神戸北野本店(1962 創業・神戸ステーキ・北野異人館街)",
    title_ja: "WAKKOQU 神戸北野本店",
    romaji: "WAKKOQU Kobe Kitano",
    summary_zh:
      "1962 神戸北野異人館街に開業の神戸ステーキ専門店『WAKKOQU(和黒)』。神戸牛 + 但馬牛 + 国産黒毛和牛の 3 ランク鉄板焼。北野洋館の中で食べる神戸ステーキとして観光客 + 海外客に人気。コース ¥10000-25000。",
    content_md:
      "- 創業:1962\n- 立地:北野異人館街\n- 神戸牛 + 但馬牛 + 国産黒毛和牛\n- コース:¥10000-25000\n- 2026-04 人工查核",
    region: "kansai",
    prefecture_ja: "兵庫県",
    gun_ja: null,
    municipality_ja: "神戸市",
    lg_code: "28100",
    area_types: ["urban_central"],
    lat: 34.700,
    lon: 135.190,
    season_start: null,
    season_end: null,
    event_start: null,
    event_end: null,
    price_tier: 4,
    booking_window_days: 30,
    closed_days: [],
    external_urls: { official: "https://www.wakkoqu.com/" },
    tags: ["steak", "wakkoqu", "kobe_beef", "since_1962", "kitano"],
    source: "manual",
  },
  {
    slug: "misono-kobe-1945",
    category: "food",
    sub_type: "kobe_steak",
    title_zh: "ミソノ神戸本店(1945 創業・世界初の鉄板焼ステーキ発祥店)",
    title_ja: "ミソノ神戸本店",
    romaji: "Misono Kobe",
    summary_zh:
      "1945 神戸三宮で創業した世界初の鉄板焼(Teppanyaki)発祥店。創業者鎮目伸之助が客の目の前で焼く実演スタイルを発明,後に Benihana(米)+ 全世界の Teppanyaki 文化の起源となった。神戸牛鉄板焼コース ¥10000-30000。本店 + 銀座店 + 京都店等。",
    content_md:
      "- 創業:1945(世界初鉄板焼発祥)\n- 立地:神戸三宮\n- 創業者:鎮目伸之助\n- 影響:Benihana 等世界 Teppanyaki 文化の祖\n- コース:¥10000-30000\n- 2026-04 人工查核",
    region: "kansai",
    prefecture_ja: "兵庫県",
    gun_ja: null,
    municipality_ja: "神戸市",
    lg_code: "28100",
    area_types: ["urban_central"],
    lat: 34.694,
    lon: 135.197,
    season_start: null,
    season_end: null,
    event_start: null,
    event_end: null,
    price_tier: 4,
    booking_window_days: 30,
    closed_days: [],
    external_urls: { official: "https://misono.org/" },
    tags: ["steak", "misono", "teppanyaki_origin", "since_1945", "world_first"],
    source: "manual",
  },
  {
    slug: "kobe-plaisir-toranomon-honten",
    category: "food",
    sub_type: "kobe_steak",
    title_zh: "神戸プレジール 本店(2003 創業・神戸ステーキ・三宮神戸 P&G ビル)",
    title_ja: "神戸プレジール 本店",
    romaji: "Kobe Plaisir Honten",
    summary_zh:
      "2003 神戸三宮(P&G ビル 1F)に開業の神戸牛鉄板焼専門店。神戸牛指定店として認証された 30 軒余の中の上位ブランド。神戸牛 A4-A5 ランクのみ提供で,コース ¥15000-30000。",
    content_md:
      "- 創業:2003\n- 立地:三宮 P&G ビル 1F\n- 神戸牛 A4-A5 限定\n- コース:¥15000-30000\n- 2026-04 人工查核",
    region: "kansai",
    prefecture_ja: "兵庫県",
    gun_ja: null,
    municipality_ja: "神戸市",
    lg_code: "28100",
    area_types: ["urban_central"],
    lat: 34.692,
    lon: 135.193,
    season_start: null,
    season_end: null,
    event_start: null,
    event_end: null,
    price_tier: 4,
    booking_window_days: 30,
    closed_days: [],
    external_urls: { official: "https://kobe-plaisir.jp/" },
    tags: ["steak", "plaisir", "kobe_beef", "a4_a5", "since_2003"],
    source: "manual",
  },

  // ══════════════════════════════════════════════════════════════════
  // B. 神戸スイーツ・ベーカリー(7 筆)
  // ══════════════════════════════════════════════════════════════════
  {
    slug: "morozoff-1931-honten",
    category: "food",
    sub_type: "kobe_sweets",
    title_zh: "モロゾフ 神戸本店(1931 創業・チョコレート + バレンタイン日本初導入)",
    title_ja: "モロゾフ 神戸本店",
    romaji: "Morozoff Kobe Honten",
    summary_zh:
      "1931 神戸三宮で創業のロシア系日本人 フョードル・モロゾフが開いた洋菓子店。1936 日本初の『バレンタインデー』を提唱(英文広告)で日本のバレンタイン文化の起源。チョコレート + プリン + クッキーが看板。神戸 - 阪神間百貨店ブランド。",
    content_md:
      "- 創業:1931 神戸三宮\n- 創業者:フョードル・モロゾフ(白系ロシア)\n- 1936 日本初バレンタイン提唱\n- 名物:チョコレート + プリン\n- 2026-04 人工查核",
    region: "kansai",
    prefecture_ja: "兵庫県",
    gun_ja: null,
    municipality_ja: "神戸市",
    lg_code: "28100",
    area_types: ["urban_central"],
    lat: 34.694,
    lon: 135.197,
    season_start: null,
    season_end: null,
    event_start: null,
    event_end: null,
    price_tier: 2,
    booking_window_days: null,
    closed_days: [],
    external_urls: { official: "https://www.morozoff.co.jp/" },
    tags: ["sweets", "morozoff", "since_1931", "valentine_origin", "russian_origin"],
    source: "manual",
  },
  {
    slug: "juchheim-1909-honten",
    category: "food",
    sub_type: "kobe_sweets",
    title_zh: "ユーハイム 神戸本店(1909 創業・バウムクーヘン日本初導入・カール・ユーハイム)",
    title_ja: "ユーハイム 神戸本店",
    romaji: "Juchheim Kobe Honten",
    summary_zh:
      "1909 ドイツ人カール・ユーハイムが青島(中国)で創業,1922 関東大震災後神戸に移転。1922 日本人初のバウムクーヘン製造販売。神戸三宮元町本店 + 全国百貨店展開。バウムクーヘン + プリン + バターケーキが看板。",
    content_md:
      "- 創業:1909 青島 → 1922 神戸\n- 創業者:カール・ユーハイム(ドイツ)\n- 1922 日本初バウムクーヘン\n- 名物:バウムクーヘン\n- 2026-04 人工查核",
    region: "kansai",
    prefecture_ja: "兵庫県",
    gun_ja: null,
    municipality_ja: "神戸市",
    lg_code: "28100",
    area_types: ["urban_central"],
    lat: 34.689,
    lon: 135.190,
    season_start: null,
    season_end: null,
    event_start: null,
    event_end: null,
    price_tier: 2,
    booking_window_days: null,
    closed_days: [],
    external_urls: { official: "https://www.juchheim.co.jp/" },
    tags: ["sweets", "juchheim", "since_1909", "baumkuchen_origin", "german"],
    source: "manual",
  },
  {
    slug: "goncharoff-1923-honten",
    category: "food",
    sub_type: "kobe_sweets",
    title_zh: "ゴンチャロフ 神戸本店(1923 創業・チョコレート老舗・白系ロシア)",
    title_ja: "ゴンチャロフ 神戸本店",
    romaji: "Goncharoff Kobe Honten",
    summary_zh:
      "1923 白系ロシア人マカロフ・ゴンチャロフが神戸で創業の洋菓子店。チョコレート + クッキー + ケーキで知名。モロゾフ(1931)+ ユーハイム(1909)と並ぶ神戸 3 大洋菓子老舗で,神戸スイーツ文化の創始者。北野異人館近く本店。",
    content_md:
      "- 創業:1923\n- 創業者:マカロフ・ゴンチャロフ(白系ロシア)\n- 神戸 3 大洋菓子(モロゾフ + ユーハイム + ゴンチャロフ)\n- 2026-04 人工查核",
    region: "kansai",
    prefecture_ja: "兵庫県",
    gun_ja: null,
    municipality_ja: "神戸市",
    lg_code: "28100",
    area_types: ["urban_central"],
    lat: 34.693,
    lon: 135.197,
    season_start: null,
    season_end: null,
    event_start: null,
    event_end: null,
    price_tier: 2,
    booking_window_days: null,
    closed_days: [],
    external_urls: { official: "https://www.goncharoff.co.jp/" },
    tags: ["sweets", "goncharoff", "since_1923", "russian_origin", "kobe_3_sweets"],
    source: "manual",
  },
  {
    slug: "donq-1905-kobe-honten",
    category: "food",
    sub_type: "kobe_sweets",
    title_zh: "ドンク 三宮本店(1905 創業・神戸ベーカリー老舗・関西パン文化発祥)",
    title_ja: "ドンク 三宮本店",
    romaji: "Donq Sannomiya Honten",
    summary_zh:
      "1905 神戸三宮で創業のフランス系ベーカリー。1953 日本人初のフランスパン本格製造販売開始,日本のフランスパン文化の起源となった。現在 100 店舗超(関西中心)で,本店は三宮駅前。クロワッサン + バゲット + ペストリーが看板。",
    content_md:
      "- 創業:1905 神戸三宮\n- 1953 日本初本格フランスパン\n- 日本フランスパン文化の起源\n- 現在 100 店舗超\n- 2026-04 人工查核",
    region: "kansai",
    prefecture_ja: "兵庫県",
    gun_ja: null,
    municipality_ja: "神戸市",
    lg_code: "28100",
    area_types: ["urban_central"],
    lat: 34.695,
    lon: 135.196,
    season_start: null,
    season_end: null,
    event_start: null,
    event_end: null,
    price_tier: 1,
    booking_window_days: null,
    closed_days: [],
    external_urls: { official: "https://www.donq.co.jp/" },
    tags: ["bakery", "donq", "since_1905", "french_bread_origin"],
    source: "manual",
  },
  {
    slug: "freundlieb-1924-kobe",
    category: "food",
    sub_type: "kobe_sweets",
    title_zh: "フロインドリーブ(1924 ハインリッヒ創業・教会内ドイツパン店・登録文化財)",
    title_ja: "フロインドリーブ",
    romaji: "Freundlieb",
    summary_zh:
      "1924 ドイツ人ハインリッヒ・フロインドリーブが神戸中山手で創業のドイツパン店。現本店(1929 元ユニオン教会)は登録有形文化財の旧プロテスタント教会建築をリノベ。教会内 cafe + ベーカリー併設で SNS 映え。神戸ドイツパン老舗。",
    content_md:
      "- 創業:1924\n- 創業者:ハインリッヒ・フロインドリーブ\n- 本店:1929 旧ユニオン教会(登録文化財)\n- ドイツパン老舗\n- 営業:10:00-19:00 水曜休\n- 2026-04 人工查核",
    region: "kansai",
    prefecture_ja: "兵庫県",
    gun_ja: null,
    municipality_ja: "神戸市",
    lg_code: "28100",
    area_types: ["urban_central"],
    lat: 34.704,
    lon: 135.190,
    season_start: null,
    season_end: null,
    event_start: null,
    event_end: null,
    price_tier: 1,
    booking_window_days: null,
    closed_days: ["wed"],
    external_urls: { official: "https://www.freundlieb.jp/" },
    tags: ["bakery", "freundlieb", "since_1924", "german", "登録文化財", "church"],
    source: "manual",
  },
  {
    slug: "kobe-fugetsudo-1897",
    category: "food",
    sub_type: "kobe_sweets",
    title_zh: "神戸風月堂 元町本店(1897 創業・ゴーフル発祥・日本最古の薄焼煎餅)",
    title_ja: "神戸風月堂 元町本店",
    romaji: "Kobe Fūgetsudō Motomachi",
    summary_zh:
      "1897 神戸元町で創業の和洋菓子老舗。1927 日本初のゴーフル(薄焼煎餅にクリーム挟んだ洋菓子)発売,以後神戸土産 + 関西銘菓として全国知名。本店 + 神戸三宮 + 大丸百貨店等で展開。ゴーフル ¥1300/缶。",
    content_md:
      "- 創業:1897\n- 1927 ゴーフル発売(日本初)\n- 神戸土産 No.1\n- ゴーフル:¥1300/缶\n- 2026-04 人工查核",
    region: "kansai",
    prefecture_ja: "兵庫県",
    gun_ja: null,
    municipality_ja: "神戸市",
    lg_code: "28100",
    area_types: ["urban_central"],
    lat: 34.689,
    lon: 135.187,
    season_start: null,
    season_end: null,
    event_start: null,
    event_end: null,
    price_tier: 1,
    booking_window_days: null,
    closed_days: [],
    external_urls: { official: "https://www.kobe-fugetsudo.co.jp/" },
    tags: ["sweets", "fugetsudo", "since_1897", "gauffres_origin", "kobe_souvenir"],
    source: "manual",
  },
  {
    slug: "kobe-isuzu-bakery-1946",
    category: "food",
    sub_type: "kobe_sweets",
    title_zh: "イスズベーカリー 三宮本店(1946 創業・神戸食パン・山食パン名物)",
    title_ja: "イスズベーカリー 三宮本店",
    romaji: "Isuzu Bakery Sannomiya",
    summary_zh:
      "1946 神戸三宮で創業の神戸ベーカリー。看板の山食パン(山型食パン・くせ強め発酵バター香)が神戸朝食定番として愛され,神戸 + 阪神間で 50 店舗超展開。本店は三宮南口。",
    content_md:
      "- 創業:1946\n- 立地:三宮南口\n- 名物:山食パン\n- 神戸 + 阪神間 50 店舗\n- 2026-04 人工查核",
    region: "kansai",
    prefecture_ja: "兵庫県",
    gun_ja: null,
    municipality_ja: "神戸市",
    lg_code: "28100",
    area_types: ["urban_central"],
    lat: 34.694,
    lon: 135.195,
    season_start: null,
    season_end: null,
    event_start: null,
    event_end: null,
    price_tier: 1,
    booking_window_days: null,
    closed_days: [],
    external_urls: { official: "https://isuzu-bakery.jp/" },
    tags: ["bakery", "isuzu", "since_1946", "yamashokupan", "sannomiya"],
    source: "manual",
  },

  // ══════════════════════════════════════════════════════════════════
  // C. 灘五郷酒造(6 筆)
  // ══════════════════════════════════════════════════════════════════
  {
    slug: "kenbishi-1505",
    category: "food",
    sub_type: "nada_brewery",
    title_zh: "剣菱酒造(1505 創業・現存最古の日本酒蔵元・伊丹 → 灘)",
    title_ja: "剣菱酒造",
    romaji: "Kenbishi Shuzō",
    summary_zh:
      "1505(永正 2 年)創業の現存最古日本酒蔵元。元々伊丹で創業,後に灘(神戸魚崎)へ移転。500 年余の歴史で,室町期から将軍家 + 公家 + 大名に献上の高級日本酒。剣菱(辛口)+ 黒松剣菱(熟成)で全国知名。蔵見学要予約。",
    content_md:
      "- 創業:1505(現存最古)\n- 起源:伊丹 → 灘移転\n- 500 年余歴史\n- 主要銘柄:剣菱 + 黒松剣菱\n- 蔵見学要予約\n- 2026-04 人工查核",
    region: "kansai",
    prefecture_ja: "兵庫県",
    gun_ja: null,
    municipality_ja: "神戸市",
    lg_code: "28100",
    area_types: ["urban"],
    lat: 34.715,
    lon: 135.245,
    season_start: null,
    season_end: null,
    event_start: null,
    event_end: null,
    price_tier: 3,
    booking_window_days: 30,
    closed_days: [],
    external_urls: { official: "https://www.kenbishi.co.jp/" },
    tags: ["sake_brewery", "kenbishi", "since_1505", "oldest_japan", "nada"],
    source: "manual",
  },
  {
    slug: "kikumasamune-kinenkan-1659",
    category: "food",
    sub_type: "nada_brewery",
    title_zh: "菊正宗酒造記念館(1659 創業・神戸魚崎・無料蔵見学 + 試飲)",
    title_ja: "菊正宗酒造記念館",
    romaji: "Kikumasamune Shuzō Kinenkan",
    summary_zh:
      "1659 創業の灘五郷の主要蔵元『菊正宗』の蔵見学記念館。1995 阪神大震災で旧蔵焼失後再建。江戸期酒造道具(国指定重要有形民俗文化財)展示 + 試飲(辛口『菊正宗』+ 純米吟醸 等)。入館無料。神戸魚崎駅徒歩 10 分。",
    content_md:
      "- 創業:1659\n- 立地:神戸魚崎\n- 重文:江戸期酒造道具\n- 試飲無料\n- 入館無料\n- 営業:9:30-16:30 無休\n- 2026-04 人工查核",
    region: "kansai",
    prefecture_ja: "兵庫県",
    gun_ja: null,
    municipality_ja: "神戸市",
    lg_code: "28100",
    area_types: ["urban"],
    lat: 34.717,
    lon: 135.246,
    season_start: null,
    season_end: null,
    event_start: null,
    event_end: null,
    price_tier: 0,
    booking_window_days: null,
    closed_days: [],
    external_urls: { official: "https://www.kikumasamune.co.jp/kinenkan/" },
    tags: ["sake_brewery", "kikumasamune", "since_1659", "kinenkan", "free_tasting"],
    source: "manual",
  },
  {
    slug: "hakushika-kinenkan-1662",
    category: "food",
    sub_type: "nada_brewery",
    title_zh: "白鹿記念酒造博物館(1662 創業・西宮・酒造文化博物館)",
    title_ja: "白鹿記念酒造博物館",
    romaji: "Hakushika Kinen Shuzō Hakubutsukan",
    summary_zh:
      "1662 創業の灘五郷主要蔵元『白鹿』(辰馬本家酒造)の博物館。1982 開館で,江戸期酒造道具 + 杜氏文化 + 灘五郷史 + 西宮『宮水』(酒造の名水)文化展示。白鹿酒販売 + 蔵見学。西宮・阪神西宮駅徒歩 5 分。",
    content_md:
      "- 創業:1662\n- 開館:1982(博物館)\n- 立地:西宮\n- 展示:酒造道具 + 杜氏文化 + 宮水\n- 入館:¥500\n- 2026-04 人工查核",
    region: "kansai",
    prefecture_ja: "兵庫県",
    gun_ja: null,
    municipality_ja: "西宮市",
    lg_code: "28204",
    area_types: ["urban"],
    lat: 34.722,
    lon: 135.345,
    season_start: null,
    season_end: null,
    event_start: null,
    event_end: null,
    price_tier: 1,
    booking_window_days: null,
    closed_days: ["tue"],
    external_urls: { official: "https://www.hakushika.co.jp/museum/" },
    tags: ["sake_brewery", "hakushika", "since_1662", "kinenkan", "miyamizu"],
    source: "manual",
  },
  {
    slug: "hakutsuru-shiryokan-1743",
    category: "food",
    sub_type: "nada_brewery",
    title_zh: "白鶴酒造資料館(1743 創業・神戸住吉・無料蔵見学+試飲・大正期蔵)",
    title_ja: "白鶴酒造資料館",
    romaji: "Hakutsuru Shuzō Shiryōkan",
    summary_zh:
      "1743 創業の灘五郷主要蔵元『白鶴』の資料館。本館は 1908 大正期建造の旧本蔵を改装,登録有形文化財。江戸-明治期酒造道具実物展示 + 大型酒林(杉玉)+ 試飲。入館無料で人気。神戸住吉駅徒歩 5 分。",
    content_md:
      "- 創業:1743\n- 資料館:1908 旧本蔵改装(登録文化財)\n- 立地:神戸住吉\n- 試飲無料\n- 入館無料\n- 営業:9:30-16:30 無休\n- 2026-04 人工查核",
    region: "kansai",
    prefecture_ja: "兵庫県",
    gun_ja: null,
    municipality_ja: "神戸市",
    lg_code: "28100",
    area_types: ["urban"],
    lat: 34.713,
    lon: 135.250,
    season_start: null,
    season_end: null,
    event_start: null,
    event_end: null,
    price_tier: 0,
    booking_window_days: null,
    closed_days: [],
    external_urls: { official: "https://www.hakutsuru-sake.com/museum/" },
    tags: ["sake_brewery", "hakutsuru", "since_1743", "登録文化財", "free_tasting"],
    source: "manual",
  },
  {
    slug: "ozeki-shuzo-1711",
    category: "food",
    sub_type: "nada_brewery",
    title_zh: "大関酒造(1711 創業・西宮今津・ワンカップ大関 1964 発祥)",
    title_ja: "大関酒造",
    romaji: "Ōzeki Shuzō",
    summary_zh:
      "1711 創業の灘五郷主要蔵元『大関』。看板は 1964 開発の『ワンカップ大関』(日本初のカップ酒)で,1964 東京五輪と同時発売され社会現象に。日本のカップ酒市場の起源。西宮今津本社(阪神今津駅近く)。",
    content_md:
      "- 創業:1711\n- 立地:西宮今津\n- 1964 ワンカップ大関(日本初カップ酒)\n- 2026-04 人工查核",
    region: "kansai",
    prefecture_ja: "兵庫県",
    gun_ja: null,
    municipality_ja: "西宮市",
    lg_code: "28204",
    area_types: ["urban"],
    lat: 34.728,
    lon: 135.349,
    season_start: null,
    season_end: null,
    event_start: null,
    event_end: null,
    price_tier: 1,
    booking_window_days: null,
    closed_days: [],
    external_urls: { official: "https://www.ozeki.co.jp/" },
    tags: ["sake_brewery", "ozeki", "since_1711", "one_cup_origin"],
    source: "manual",
  },
  {
    slug: "sawanotsuru-shiryokan-1717",
    category: "food",
    sub_type: "nada_brewery",
    title_zh: "沢の鶴資料館(1717 創業・神戸魚崎・大正期蔵改装・米米米米)",
    title_ja: "沢の鶴資料館",
    romaji: "Sawanotsuru Shiryōkan",
    summary_zh:
      "1717 創業の灘五郷蔵元『沢の鶴』の資料館。本館は 1925 大正期蔵を改装(国指定重要有形民俗文化財)。社章の『米』4 つで知られる(米米米米)。試飲 + 蔵見学。神戸魚崎駅徒歩 5 分。",
    content_md:
      "- 創業:1717\n- 資料館:1925 旧本蔵(国重文)\n- 社章:米米米米\n- 入館:¥300\n- 2026-04 人工查核",
    region: "kansai",
    prefecture_ja: "兵庫県",
    gun_ja: null,
    municipality_ja: "神戸市",
    lg_code: "28100",
    area_types: ["urban"],
    lat: 34.717,
    lon: 135.244,
    season_start: null,
    season_end: null,
    event_start: null,
    event_end: null,
    price_tier: 1,
    booking_window_days: null,
    closed_days: ["wed"],
    external_urls: {},
    tags: ["sake_brewery", "sawanotsuru", "since_1717", "重要文化財", "kome4"],
    source: "manual",
  },

  // ══════════════════════════════════════════════════════════════════
  // D. 神戸南京町中華・洋食(2 筆)
  // ══════════════════════════════════════════════════════════════════
  {
    slug: "minori-honten-nankinmachi",
    category: "food",
    sub_type: "restaurant_recommend",
    title_zh: "民生 廣東料理店 南京町本店(1958 創業・神戸南京町・北京ダック老舗)",
    title_ja: "民生 廣東料理店 南京町本店",
    romaji: "Minsei Cantonese Restaurant",
    summary_zh:
      "1958 神戸南京町(中華街)で創業の老舗廣東料理店。北京ダック + フカヒレ + 海老チリの本格廣東中華で,神戸開港 1868 から続く南京町中華の代表老舗。コース ¥6000-15000・ランチ ¥1800-。",
    content_md:
      "- 創業:1958\n- 立地:神戸南京町\n- 廣東料理\n- コース:¥6000-15000\n- ランチ:¥1800-\n- 2026-04 人工查核",
    region: "kansai",
    prefecture_ja: "兵庫県",
    gun_ja: null,
    municipality_ja: "神戸市",
    lg_code: "28100",
    area_types: ["urban_central"],
    lat: 34.687,
    lon: 135.187,
    season_start: null,
    season_end: null,
    event_start: null,
    event_end: null,
    price_tier: 3,
    booking_window_days: 14,
    closed_days: ["mon"],
    external_urls: {},
    tags: ["chinese", "minsei", "nankinmachi", "since_1958", "cantonese"],
    source: "manual",
  },
  {
    slug: "grill-ippei-1952-kobe",
    category: "food",
    sub_type: "restaurant_recommend",
    title_zh: "グリル一平 元町本店(1952 創業・神戸オムライス老舗・西洋料理)",
    title_ja: "グリル一平 元町本店",
    romaji: "Grill Ippei Motomachi",
    summary_zh:
      "1952 神戸元町で創業の洋食老舗。看板はデミグラスソース掛けオムライス + 神戸ステーキ + ハンバーグの 3 大洋食。70 年余の歴史で,神戸開港由来の洋食文化を継承。1 食 ¥1500-3500。",
    content_md:
      "- 創業:1952\n- 立地:神戸元町\n- 名物:デミグラオムライス + ハンバーグ\n- 価格:¥1500-3500/食\n- 2026-04 人工查核",
    region: "kansai",
    prefecture_ja: "兵庫県",
    gun_ja: null,
    municipality_ja: "神戸市",
    lg_code: "28100",
    area_types: ["urban_central"],
    lat: 34.688,
    lon: 135.188,
    season_start: null,
    season_end: null,
    event_start: null,
    event_end: null,
    price_tier: 2,
    booking_window_days: null,
    closed_days: ["mon"],
    external_urls: {},
    tags: ["yoshoku", "ippei", "kobe", "since_1952", "omurice"],
    source: "manual",
  },

  // ══════════════════════════════════════════════════════════════════
  // E. 神戸珈琲・洋食追加(2 筆)
  // ══════════════════════════════════════════════════════════════════
  {
    slug: "nishimura-coffee-1948-honten",
    category: "food",
    sub_type: "cafe_wagashi",
    title_zh: "にしむら珈琲 中山手本店(1948 創業・神戸サードウェーブ系老舗・自家焙煎)",
    title_ja: "にしむら珈琲 中山手本店",
    romaji: "Nishimura Coffee Nakayamate",
    summary_zh:
      "1948 神戸中山手で創業の自家焙煎珈琲店『にしむら珈琲』本店。神戸喫茶文化の代表老舗で 70 年余,神戸 + 阪神間で 30 店舗展開。看板は『にしむら ブレンド』(中深煎り)+ チーズトースト + ホットケーキ。1 杯 ¥600-1000。",
    content_md:
      "- 創業:1948\n- 立地:神戸中山手\n- 自家焙煎\n- 神戸 + 阪神間 30 店舗\n- 1 杯:¥600-1000\n- 2026-04 人工查核",
    region: "kansai",
    prefecture_ja: "兵庫県",
    gun_ja: null,
    municipality_ja: "神戸市",
    lg_code: "28100",
    area_types: ["urban_central"],
    lat: 34.700,
    lon: 135.190,
    season_start: null,
    season_end: null,
    event_start: null,
    event_end: null,
    price_tier: 2,
    booking_window_days: null,
    closed_days: [],
    external_urls: { official: "https://www.kobe-nishimura.jp/" },
    tags: ["coffee", "nishimura", "since_1948", "self_roast"],
    source: "manual",
  },
  {
    slug: "tor-road-delicatessen-1957-kobe",
    category: "food",
    sub_type: "restaurant_recommend",
    title_zh: "Tor Road デリカテッセン(1957 創業・神戸ハム + ソーセージ専門店)",
    title_ja: "Tor Road デリカテッセン",
    romaji: "Tor Road Delicatessen",
    summary_zh:
      "1957 神戸トアロード(Tor Road・神戸開港期の外国人居住地)に開業のドイツ系デリカテッセン。ハム + ソーセージ + 燻製の自家製肉加工品で,神戸トアロード食文化(独 + 仏 + 印融合)の代表老舗。サンドイッチ ¥800-1500。",
    content_md:
      "- 創業:1957\n- 立地:神戸トアロード\n- ドイツ系デリ\n- 名物:ハム + ソーセージ\n- サンド ¥800-1500\n- 2026-04 人工查核",
    region: "kansai",
    prefecture_ja: "兵庫県",
    gun_ja: null,
    municipality_ja: "神戸市",
    lg_code: "28100",
    area_types: ["urban_central"],
    lat: 34.694,
    lon: 135.193,
    season_start: null,
    season_end: null,
    event_start: null,
    event_end: null,
    price_tier: 2,
    booking_window_days: null,
    closed_days: [],
    external_urls: {},
    tags: ["deli", "tor_road", "since_1957", "german_ham"],
    source: "manual",
  },

  // ══════════════════════════════════════════════════════════════════
  // F. 播磨郷土(4 筆)
  // ══════════════════════════════════════════════════════════════════
  {
    slug: "akashiyaki-honke-kikuyo-1949",
    category: "food",
    sub_type: "harima_local",
    title_zh: "本家きくよ食堂(1949 創業・明石焼老舗・卵焼出汁つけ発祥地)",
    title_ja: "本家きくよ食堂",
    romaji: "Honke Kikuyo Shokudō",
    summary_zh:
      "1949 明石市港町で創業の明石焼(卵焼)老舗。明石焼は 19 世紀末発祥の郷土料理(出汁につけて食べる卵焼)で,明石海峡蛸 + 鶏卵 + 浮粉の 3 素材。15 個 ¥850 で,本家きくよが明石焼老舗の象徴。",
    content_md:
      "- 創業:1949\n- 立地:明石港町\n- 明石焼老舗\n- 15 個:¥850\n- 2026-04 人工查核",
    region: "kansai",
    prefecture_ja: "兵庫県",
    gun_ja: null,
    municipality_ja: "明石市",
    lg_code: "28203",
    area_types: ["urban", "coastal"],
    lat: 34.643,
    lon: 134.992,
    season_start: null,
    season_end: null,
    event_start: null,
    event_end: null,
    price_tier: 1,
    booking_window_days: null,
    closed_days: ["tue"],
    external_urls: {},
    tags: ["akashiyaki", "kikuyo", "since_1949", "local_food", "akashi"],
    source: "manual",
  },
  {
    slug: "ibonoito-tatsuno-1418-shiryokan",
    category: "food",
    sub_type: "harima_local",
    title_zh: "揖保乃糸資料館 そうめんの里(1418 創業・たつの市・600 年余そうめん老舗)",
    title_ja: "揖保乃糸資料館 そうめんの里",
    romaji: "Ibonoito Shiryōkan",
    summary_zh:
      "1418(室町期 應永 25 年)創業の播州(揖保郡)そうめん『揖保乃糸』の資料館。600 年余の歴史で,日本最古級そうめん組合(揖保乃糸協同組合)が運営。資料館で 600 年史 + そうめん製造工程展示 + 試食 + 売店。たつの市役所近く。",
    content_md:
      "- 創業:1418(600 年余)\n- 立地:たつの市\n- 日本最古級そうめん\n- 資料館:¥300・試食付\n- 2026-04 人工查核",
    region: "kansai",
    prefecture_ja: "兵庫県",
    gun_ja: null,
    municipality_ja: "たつの市",
    lg_code: "28229",
    area_types: ["urban", "rural"],
    lat: 34.866,
    lon: 134.554,
    season_start: null,
    season_end: null,
    event_start: null,
    event_end: null,
    price_tier: 1,
    booking_window_days: null,
    closed_days: ["mon"],
    external_urls: {},
    tags: ["somen", "ibonoito", "since_1418", "tatsuno", "oldest_japan"],
    source: "manual",
  },
  {
    slug: "higashimaru-shoyu-1666",
    category: "food",
    sub_type: "harima_local",
    title_zh: "ヒガシマル醤油 龍野本社(1666 創業・薄口醤油発祥・関西醤油 No.1)",
    title_ja: "ヒガシマル醤油",
    romaji: "Higashimaru Shōyu",
    summary_zh:
      "1666 たつの市(龍野)で創業の薄口醤油発祥蔵元。関西料理(京料理 + 大阪割烹)の薄口醤油標準を確立。1942 ヒガシマル醤油株式会社化,現在関西醤油市場 No.1。本社隣接の醤油資料館で歴史展示。",
    content_md:
      "- 創業:1666\n- 立地:たつの市(龍野)\n- 薄口醤油発祥\n- 関西醤油 No.1\n- 醤油資料館併設\n- 2026-04 人工查核",
    region: "kansai",
    prefecture_ja: "兵庫県",
    gun_ja: null,
    municipality_ja: "たつの市",
    lg_code: "28229",
    area_types: ["urban"],
    lat: 34.870,
    lon: 134.553,
    season_start: null,
    season_end: null,
    event_start: null,
    event_end: null,
    price_tier: 1,
    booking_window_days: null,
    closed_days: [],
    external_urls: { official: "https://www.higashimaru.co.jp/" },
    tags: ["soy_sauce", "higashimaru", "since_1666", "tatsuno", "usukuchi_origin"],
    source: "manual",
  },
  {
    slug: "yamasakamaboko-1916",
    category: "food",
    sub_type: "harima_local",
    title_zh: "ヤマサ蒲鉾(1916 創業・姫路夢前町・関西最大蒲鉾製造)",
    title_ja: "ヤマサ蒲鉾",
    romaji: "Yamasa Kamaboko",
    summary_zh:
      "1916 姫路市夢前町で創業の蒲鉾製造老舗。関西最大蒲鉾メーカー。本社工場隣接の蒲鉾博物館 + 体験施設で蒲鉾製造工程見学 + 蒲鉾作り体験(¥1500-)。姫路土産 + 関西おでん種の代表ブランド。",
    content_md:
      "- 創業:1916\n- 立地:姫路市夢前町\n- 関西最大蒲鉾メーカー\n- 体験施設:蒲鉾作り ¥1500-\n- 2026-04 人工查核",
    region: "kansai",
    prefecture_ja: "兵庫県",
    gun_ja: null,
    municipality_ja: "姫路市",
    lg_code: "28201",
    area_types: ["urban", "rural"],
    lat: 34.876,
    lon: 134.696,
    season_start: null,
    season_end: null,
    event_start: null,
    event_end: null,
    price_tier: 1,
    booking_window_days: 7,
    closed_days: [],
    external_urls: {},
    tags: ["kamaboko", "yamasa", "since_1916", "himeji"],
    source: "manual",
  },

  // ══════════════════════════════════════════════════════════════════
  // G. 丹波兵庫郷土(1 筆)
  // ══════════════════════════════════════════════════════════════════
  {
    slug: "ho-mei-shuzo-1797-sasayama",
    category: "food",
    sub_type: "tanba_hyogo_local",
    title_zh: "鳳鳴酒造(1797 創業・丹波篠山・丹波黒豆 + 山田錦の酒蔵)",
    title_ja: "鳳鳴酒造",
    romaji: "Hōmei Shuzō",
    summary_zh:
      "1797(寛政 9 年)創業の丹波篠山の酒蔵。230 年余の歴史で,丹波の山田錦(酒米最高級)+ 黒豆酒等の地酒。蔵見学 + 試飲 + 酒販売。篠山城跡 + 篠山市街徒歩 5 分の好立地。",
    content_md:
      "- 創業:1797(230 年余)\n- 立地:丹波篠山市\n- 丹波山田錦使用\n- 蔵見学 + 試飲\n- 篠山城徒歩 5 分\n- 2026-04 人工查核",
    region: "kansai",
    prefecture_ja: "兵庫県",
    gun_ja: null,
    municipality_ja: "丹波篠山市",
    lg_code: "28221",
    area_types: ["urban", "rural"],
    lat: 35.077,
    lon: 135.224,
    season_start: null,
    season_end: null,
    event_start: null,
    event_end: null,
    price_tier: 2,
    booking_window_days: null,
    closed_days: [],
    external_urls: { official: "https://www.houmei.com/" },
    tags: ["sake_brewery", "homei", "since_1797", "tanba_sasayama", "yamadanishiki"],
    source: "manual",
  },

  // ══════════════════════════════════════════════════════════════════
  // R2 expansion(2026-04-29・26 → 29)
  // ══════════════════════════════════════════════════════════════════
  {
    slug: "maneki-shokuhin-1888-himeji",
    category: "food",
    sub_type: "harima_local",
    title_zh: "まねき食品(1888 創業・姫路駅・日本初駅弁発祥・えきそば名物)",
    title_ja: "まねき食品",
    romaji: "Maneki Shokuhin",
    summary_zh:
      "1888 姫路駅に開業した日本初の駅弁業者(姫路駅で 5 銭の握り飯 + 沢庵を販売したのが日本駅弁の起源)。140 年余の歴史で,姫路駅構内『えきそば』(中華麺 + 和風出汁の独特スタイル・1949 開発)が看板。姫路駅 + 神戸三宮 + 元町等 30 店舗。",
    content_md:
      "- 創業:1888(日本初駅弁)\n- 立地:姫路駅構内\n- 名物:えきそば(1949・中華麺 + 和出汁)\n- 30 店舗展開\n- 1 食:¥400-1200\n- 2026-04 人工查核",
    region: "kansai",
    prefecture_ja: "兵庫県",
    gun_ja: null,
    municipality_ja: "姫路市",
    lg_code: "28201",
    area_types: ["urban"],
    lat: 34.832,
    lon: 134.692,
    season_start: null,
    season_end: null,
    event_start: null,
    event_end: null,
    price_tier: 1,
    booking_window_days: null,
    closed_days: [],
    external_urls: { official: "https://www.maneki-co.com/" },
    tags: ["bento", "maneki", "since_1888", "ekisoba", "himeji_station"],
    source: "manual",
  },
  {
    slug: "konigskrone-1977-kobe",
    category: "food",
    sub_type: "kobe_sweets",
    title_zh: "ケーニヒスクローネ(1977 創業・神戸老舗洋菓子・くまさんブランド)",
    title_ja: "ケーニヒスクローネ",
    romaji: "Königskrone",
    summary_zh:
      "1977 神戸三宮で創業のドイツ風洋菓子店。創業者大山喬資(神戸生)がドイツ修行後開業。看板はバウムクーヘン + パイ生地ロール + プリン。看板キャラクター『くまさん』(チョコパイのくまアイコン)で全国知名。本店 + 阪神間 30 店舗。",
    content_md:
      "- 創業:1977 神戸三宮\n- 創業者:大山喬資\n- 名物:バウムクーヘン + パイロール\n- 看板キャラ:くまさん\n- 阪神間 30 店舗\n- 2026-04 人工查核",
    region: "kansai",
    prefecture_ja: "兵庫県",
    gun_ja: null,
    municipality_ja: "神戸市",
    lg_code: "28100",
    area_types: ["urban_central"],
    lat: 34.694,
    lon: 135.196,
    season_start: null,
    season_end: null,
    event_start: null,
    event_end: null,
    price_tier: 2,
    booking_window_days: null,
    closed_days: [],
    external_urls: {},
    tags: ["sweets", "konigskrone", "since_1977", "german_style", "kuma_san"],
    source: "manual",
  },
  {
    slug: "fukuya-izushi-soba-honten",
    category: "food",
    sub_type: "tajima_local",
    title_zh: "福屋本店(出石皿そば老舗・1706 信州伝来・小皿 5 枚 1 人前)",
    title_ja: "福屋本店",
    romaji: "Fukuya Honten",
    summary_zh:
      "出石そば(1706 信州伝来発祥)の代表老舗の一つ。出石城下町の旧家屋を活用した店舗で,小皿 5 枚 1 人前の独特スタイル。1 人前 ¥1100-。観光客 + 地元客で連日行列,出石そば文化の象徴店。",
    content_md:
      "- 出石皿そば老舗代表\n- 立地:出石城下町\n- スタイル:小皿 5 枚 1 人前\n- 価格:¥1100-/人前\n- 営業:11:00-17:00 木曜休\n- 2026-04 人工查核",
    region: "kansai",
    prefecture_ja: "兵庫県",
    gun_ja: null,
    municipality_ja: "豊岡市",
    lg_code: "28209",
    area_types: ["rural"],
    lat: 35.456,
    lon: 134.871,
    season_start: null,
    season_end: null,
    event_start: null,
    event_end: null,
    price_tier: 2,
    booking_window_days: null,
    closed_days: ["thu"],
    external_urls: {},
    tags: ["soba", "izushi_sara_soba", "fukuya", "tajima"],
    source: "manual",
  },

  // ══════════════════════════════════════════════════════════════════
  // R3 expansion(2026-04-29・29 → 32)
  // ══════════════════════════════════════════════════════════════════
  {
    slug: "mita-honten-1976",
    category: "food",
    sub_type: "kobe_steak",
    title_zh: "三田屋本店(1976 創業・三田牛 + 但馬牛ステーキ専門・関西最大級店舗)",
    title_ja: "三田屋本店",
    romaji: "Mita-ya Honten",
    summary_zh:
      "1976 三田市に創業の三田牛(神戸牛 + 但馬牛系・三田周辺の三田牛)ステーキ専門店。1 階レストラン + 2 階直販店の総合店舗。三田牛 + 但馬牛のステーキコース ¥6000-15000。関西で『三田屋』ブランドの代表店。",
    content_md:
      "- 創業:1976\n- 立地:三田市\n- 三田牛 + 但馬牛ステーキ専門\n- コース:¥6000-15000\n- 直販店併設\n- 2026-04 人工查核",
    region: "kansai",
    prefecture_ja: "兵庫県",
    gun_ja: null,
    municipality_ja: "三田市",
    lg_code: "28219",
    area_types: ["urban"],
    lat: 34.886,
    lon: 135.224,
    season_start: null,
    season_end: null,
    event_start: null,
    event_end: null,
    price_tier: 4,
    booking_window_days: 14,
    closed_days: [],
    external_urls: {},
    tags: ["steak", "mitaya", "since_1976", "sanda_beef", "tajima_beef"],
    source: "manual",
  },
  {
    slug: "fukuju-shushinkan-1751",
    category: "food",
    sub_type: "nada_brewery",
    title_zh: "福寿(神戸酒心館・1751 創業・2008 ノーベル晩餐会公式酒)",
    title_ja: "福寿",
    romaji: "Fukuju",
    summary_zh:
      "1751 創業の灘五郷蔵元『神戸酒心館』(株式会社神戸酒心館)。看板銘柄『福寿』が 2008 ノーベル賞晩餐会(ストックホルム)公式酒に選定 → 受賞者全員に振舞われ世界知名。270 年余の歴史で,蔵見学 + 試飲 + 直営レストラン併設。神戸魚崎駅徒歩 10 分。",
    content_md:
      "- 創業:1751(270 年余)\n- 銘柄:福寿\n- 2008 ノーベル晩餐会公式酒\n- 蔵見学 + 試飲 + 直営レストラン\n- 2026-04 人工查核",
    region: "kansai",
    prefecture_ja: "兵庫県",
    gun_ja: null,
    municipality_ja: "神戸市",
    lg_code: "28100",
    area_types: ["urban"],
    lat: 34.717,
    lon: 135.245,
    season_start: null,
    season_end: null,
    event_start: null,
    event_end: null,
    price_tier: 3,
    booking_window_days: null,
    closed_days: [],
    external_urls: { official: "https://www.shushinkan.co.jp/" },
    tags: ["sake_brewery", "fukuju", "shushinkan", "since_1751", "nobel_dinner"],
    source: "manual",
  },
  {
    slug: "antenor-1978-kobe",
    category: "food",
    sub_type: "kobe_sweets",
    title_zh: "アンテノール(1978 神戸創業・洋菓子・全国百貨店 100 店舗展開)",
    title_ja: "アンテノール",
    romaji: "Antenor",
    summary_zh:
      "1978 神戸三宮で創業の洋菓子チェーン。創業者ボンルパ社が神戸モロゾフ + ユーハイム後の第 4 世代神戸洋菓子。プリン + ロールケーキ + チーズケーキで全国 100 店舗(全国百貨店中心)展開。本店は神戸三宮そごう跡(現神戸阪急)地下。",
    content_md:
      "- 創業:1978\n- 立地:神戸三宮\n- 全国 100 店舗\n- 名物:プリン + ロールケーキ + チーズケーキ\n- 2026-04 人工查核",
    region: "kansai",
    prefecture_ja: "兵庫県",
    gun_ja: null,
    municipality_ja: "神戸市",
    lg_code: "28100",
    area_types: ["urban_central"],
    lat: 34.694,
    lon: 135.197,
    season_start: null,
    season_end: null,
    event_start: null,
    event_end: null,
    price_tier: 2,
    booking_window_days: null,
    closed_days: [],
    external_urls: { official: "https://www.antenor.jp/" },
    tags: ["sweets", "antenor", "since_1978", "kobe_4th_gen"],
    source: "manual",
  },

  // ══════════════════════════════════════════════════════════════════
  // R4 expansion(2026-04-29・32 → 36)
  // ══════════════════════════════════════════════════════════════════
  {
    slug: "izushi-shuzo-1708",
    category: "food",
    sub_type: "tajima_local",
    title_zh: "出石酒造(1708 創業・但馬唯一の酒蔵・320 年余・楽々鶴銘柄)",
    title_ja: "出石酒造",
    romaji: "Izushi Shuzō",
    summary_zh:
      "1708(宝永 5 年)創業の但馬地域唯一の酒蔵。320 年余の歴史で,主要銘柄『楽々鶴』(出石城下町の銘酒)。出石城下町(但馬の小京都)の中心に立地,蔵見学 + 試飲 + 直販。出石そば + 但馬牛料理に合う地酒として観光客に人気。",
    content_md:
      "- 創業:1708(320 年余)\n- 立地:出石城下町\n- 但馬唯一の酒蔵\n- 銘柄:楽々鶴\n- 蔵見学 + 試飲\n- 2026-04 人工查核",
    region: "kansai",
    prefecture_ja: "兵庫県",
    gun_ja: null,
    municipality_ja: "豊岡市",
    lg_code: "28209",
    area_types: ["rural"],
    lat: 35.456,
    lon: 134.871,
    season_start: null,
    season_end: null,
    event_start: null,
    event_end: null,
    price_tier: 2,
    booking_window_days: null,
    closed_days: [],
    external_urls: {},
    tags: ["sake_brewery", "izushi", "since_1708", "tajima_only"],
    source: "manual",
  },
  {
    slug: "nadakiku-shuzo-1910-himeji",
    category: "food",
    sub_type: "harima_local",
    title_zh: "灘菊酒造(1910 創業・姫路・播磨地酒蔵元・姫路城近 1.5 km)",
    title_ja: "灘菊酒造",
    romaji: "Nadakiku Shuzō",
    summary_zh:
      "1910 姫路市に創業の播磨地酒蔵元。115 年余の歴史で,看板銘柄『灘菊』+『播州一献』。姫路城徒歩 1.5 km の好立地で,蔵見学 + 試飲 + 直営レストラン『酒蔵レストラン 灘菊』併設。播磨地酒文化の代表蔵元。",
    content_md:
      "- 創業:1910\n- 立地:姫路(姫路城徒歩 1.5 km)\n- 銘柄:灘菊 + 播州一献\n- 直営レストラン併設\n- 2026-04 人工查核",
    region: "kansai",
    prefecture_ja: "兵庫県",
    gun_ja: null,
    municipality_ja: "姫路市",
    lg_code: "28201",
    area_types: ["urban"],
    lat: 34.834,
    lon: 134.690,
    season_start: null,
    season_end: null,
    event_start: null,
    event_end: null,
    price_tier: 2,
    booking_window_days: null,
    closed_days: [],
    external_urls: { official: "https://www.nadagiku.co.jp/" },
    tags: ["sake_brewery", "nadakiku", "since_1910", "himeji"],
    source: "manual",
  },
  {
    slug: "mitsumori-honpo-arima-1907",
    category: "food",
    sub_type: "harima_local",
    title_zh: "三津森本舗(1907・有馬温泉・有馬炭酸せんべい本家・温泉土産発祥)",
    title_ja: "三津森本舗",
    romaji: "Mitsumori Honpo",
    summary_zh:
      "1907 有馬温泉湯本街に創業の有馬炭酸せんべい本家。有馬温泉の天然炭酸水を使った薄焼煎餅で,1907 三津森林次郎発明の有馬温泉名物。120 年余の歴史で,有馬土産 No.1。本店で焼立て試食 + 工場見学。",
    content_md:
      "- 創業:1907\n- 立地:有馬温泉湯本街\n- 名物:有馬炭酸せんべい(発祥)\n- 焼立て試食 + 工場見学\n- 有馬土産 No.1\n- 2026-04 人工查核",
    region: "kansai",
    prefecture_ja: "兵庫県",
    gun_ja: null,
    municipality_ja: "神戸市",
    lg_code: "28100",
    area_types: ["mountain"],
    lat: 34.798,
    lon: 135.246,
    season_start: null,
    season_end: null,
    event_start: null,
    event_end: null,
    price_tier: 1,
    booking_window_days: null,
    closed_days: [],
    external_urls: { official: "https://www.mitsumori.co.jp/" },
    tags: ["wagashi", "mitsumori", "arima", "since_1907", "tansan_senbei"],
    source: "manual",
  },
  {
    slug: "kobe-pudding-1991",
    category: "food",
    sub_type: "kobe_sweets",
    title_zh: "神戸プリン(1991 神戸風月堂系・トーラク発売・神戸土産プリン定番)",
    title_ja: "神戸プリン",
    romaji: "Kobe Pudding",
    summary_zh:
      "1991 神戸風月堂系のトーラク株式会社が発売開始した『神戸プリン』(オレンジリキュール風味の濃厚プリン)。神戸土産 No.1 プリンとして全国知名,神戸 + 関西の主要駅売店 + 百貨店 + 空港で販売。1 個 ¥250-350。本社オフィス売店併設。",
    content_md:
      "- 発売:1991(トーラク社・神戸風月堂系)\n- 神戸土産 No.1 プリン\n- 1 個:¥250-350\n- 全国販売(主要駅 + 百貨店 + 空港)\n- 2026-04 人工查核",
    region: "kansai",
    prefecture_ja: "兵庫県",
    gun_ja: null,
    municipality_ja: "神戸市",
    lg_code: "28100",
    area_types: ["urban_central"],
    lat: 34.694,
    lon: 135.196,
    season_start: null,
    season_end: null,
    event_start: null,
    event_end: null,
    price_tier: 1,
    booking_window_days: null,
    closed_days: [],
    external_urls: {},
    tags: ["sweets", "kobe_pudding", "since_1991", "torak", "souvenir"],
    source: "manual",
  },

  // ══════════════════════════════════════════════════════════════════
  // R5 expansion(2026-04-29・36 → 37)
  // ══════════════════════════════════════════════════════════════════
  {
    slug: "hagiwara-coffee-1928-kobe",
    category: "food",
    sub_type: "cafe_wagashi",
    title_zh: "萩原珈琲(1928 神戸創業・神戸最古級喫茶老舗・自家焙煎)",
    title_ja: "萩原珈琲",
    romaji: "Hagiwara Coffee",
    summary_zh:
      "1928 神戸三宮で創業の自家焙煎珈琲店。神戸最古級喫茶老舗で 100 年近い歴史。神戸開港由来の珈琲文化(にしむら 1948 + 萩原 1928)の双璧。本店 + 三宮地下街 + 元町等 5 店舗。レトロ昭和喫茶の雰囲気,神戸珈琲文化の代表。",
    content_md:
      "- 創業:1928(100 年近い)\n- 立地:神戸三宮\n- 自家焙煎\n- 神戸最古級喫茶\n- 5 店舗\n- 1 杯:¥600-900\n- 2026-04 人工查核",
    region: "kansai",
    prefecture_ja: "兵庫県",
    gun_ja: null,
    municipality_ja: "神戸市",
    lg_code: "28100",
    area_types: ["urban_central"],
    lat: 34.694,
    lon: 135.196,
    season_start: null,
    season_end: null,
    event_start: null,
    event_end: null,
    price_tier: 2,
    booking_window_days: null,
    closed_days: [],
    external_urls: {},
    tags: ["coffee", "hagiwara", "since_1928", "kobe_oldest_cafe"],
    source: "manual",
  },
];

async function main() {
  console.log(`[seed] ${rows.length} rows to seed`);
  const byKind: Record<string, number> = {};
  for (const r of rows) byKind[r.sub_type] = (byKind[r.sub_type] ?? 0) + 1;
  console.log(`[seed] by sub_type: ${JSON.stringify(byKind, null, 2)}`);

  if (DRY) {
    for (const r of rows) {
      console.log(
        `  [${r.sub_type.padEnd(28)}] ${r.title_zh} (${r.municipality_ja ?? "-"}/${r.lg_code ?? "-"})`,
      );
    }
    return;
  }

  const sb = createAdminClient();
  const { data, error } = await sb
    .from("japan_entries")
    .upsert(rows, { onConflict: "slug" })
    .select("id, slug");
  if (error) {
    console.error("[seed] upsert failed", error);
    process.exit(1);
  }
  console.log(`[seed] upserted ${data?.length ?? 0} rows`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

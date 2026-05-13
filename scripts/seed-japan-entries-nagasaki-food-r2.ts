// Seed 長崎県 · 食類 R2 條目 → public.japan_entries(Sprint 21.1)
// 角煮まん(R1 2 軒)+ 茶碗むし発祥+ ぶたまん発祥+ 一口餃子発祥+ 中央軒ちゃんぽん老舗+ 平戸地酒
//
// 5 筆構成:
//   1. 茶碗むし 吉宗 1866(国内茶碗むし発祥)
//   2. 桃太呂 1957(ぶたまん発祥)
//   3. 雲龍亭 1955(一口餃子発祥)
//   4. 中央軒 1922(ちゃんぽん老舗・浜の町)
//   5. 山の寿酒造 1830(平戸地酒・五島椿の里)

import { config as loadEnv } from "dotenv";
loadEnv({ path: ".env.local" });

import { createAdminClient } from "../src/lib/supabase/admin";

const DRY = process.argv.includes("--dry-run");

type SubType =
  | "nagasaki_shippoku"
  | "nagasaki_chuka"
  | "nagasaki_champon"
  | "brewery";

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
  {
    slug: "yossou-chawanmushi-1866",
    category: "food",
    sub_type: "nagasaki_shippoku",
    title_zh: "吉宗本店(1866 創業・茶碗蒸し+蒸し寿司発祥・夫婦蒸し定食・国内茶碗蒸し名跡)",
    title_ja: "吉宗本店",
    romaji: "Yossou Honten",
    summary_zh: "**吉宗(よっそう)は 1866 年創業の茶碗蒸し+蒸し寿司発祥店**(長崎市浜町・160 年)。創業者吉田宗吉が江戸期長崎の卓袱料理を庶民向けに改造、巨大茶碗蒸し+穴子・椎茸・蒲鉾・銀杏 等 18 種具材+蒸し寿司の「夫婦蒸し定食」が看板。長崎を代表する伝統食、卓袱料理の入口的位置。",
    content_md: "- 創業:1866 年(慶応 2)・吉田宗吉初代\n- 名物:夫婦蒸し定食(茶碗蒸し+蒸し寿司・¥1850)\n- 茶碗蒸し:巨大サイズ(直径 12 cm)+ 18 種具材\n- 蒸し寿司:錦糸卵+ 穴子+ 椎茸+ 桜でんぶ+ 紅生姜\n- 営業:11:00-21:00(年中無休)\n- アクセス:長崎電軌「観光通り」電停 徒歩 3 分\n- 支店:浜町本店+ アミュプラザ店",
    region: "kyushu",
    prefecture_ja: "長崎県",
    gun_ja: null,
    municipality_ja: "長崎市",
    lg_code: "42201",
    area_types: ["restaurant_traditional"],
    lat: 32.7444,
    lon: 129.8767,
    season_start: null,
    season_end: null,
    event_start: null,
    event_end: null,
    price_tier: 2,
    booking_window_days: 7,
    closed_days: [],
    external_urls: { official: "https://yossou.co.jp/" },
    tags: ["nagasaki_shippoku", "yossou", "1866", "chawanmushi_origin", "160_years"],
    source: "manual",
  },
  {
    slug: "momotaro-butaman-1957",
    category: "food",
    sub_type: "nagasaki_chuka",
    title_zh: "桃太呂(1957 創業・長崎ぶたまん発祥・浜の町本店・1 個 ¥110・小ぶり食感)",
    title_ja: "桃太呂",
    romaji: "Momotaro",
    summary_zh: "**桃太呂(ももたろう)は長崎ぶたまん発祥店**(長崎市浜の町・1957 創業)。中華まんの肉まんとは異なる、小ぶり(直径 5 cm)で 1 個 ¥110 の手頃な「長崎ぶたまん」を発明。豚肉+ 玉ねぎ+ 椎茸+ 醤油の和風餡が特徴、観光客が手軽に食べ歩き可能。長崎駅前+ 浜の町に複数店舗、年中無休営業。",
    content_md: "- 創業:1957 年(昭和 32)\n- 名物:ぶたまん(¥110/個・小ぶり直径 5 cm)\n- 餡:豚肉+ 玉ねぎ+ 椎茸+ 醤油(和風)\n- 通常価格:1 個 ¥110・5 個 ¥550・10 個 ¥1100\n- 営業:9:00-19:00(年中無休)\n- 店舗:浜の町本店+ 長崎駅前+ 思案橋+ 観光通り 4 店\n- アクセス:長崎電軌「観光通り」電停 徒歩 1 分",
    region: "kyushu",
    prefecture_ja: "長崎県",
    gun_ja: null,
    municipality_ja: "長崎市",
    lg_code: "42201",
    area_types: ["restaurant_chinese"],
    lat: 32.7440,
    lon: 129.8761,
    season_start: null,
    season_end: null,
    event_start: null,
    event_end: null,
    price_tier: 1,
    booking_window_days: null,
    closed_days: [],
    external_urls: {},
    tags: ["nagasaki_chuka", "momotaro", "1957", "butaman_origin", "110yen"],
    source: "manual",
  },
  {
    slug: "unryutei-gyoza-1955",
    category: "food",
    sub_type: "nagasaki_chuka",
    title_zh: "雲龍亭(1955 創業・長崎一口餃子発祥・思案橋本店・10 個 ¥600・薄皮焦げ目)",
    title_ja: "雲龍亭",
    romaji: "Unryutei",
    summary_zh: "**雲龍亭は長崎一口餃子発祥店**(長崎市浜の町・1955 創業)。1 口で食べられる小ぶり餃子(直径 3 cm)・薄皮+ 焦げ目+ あっさり餡で **10 個 ¥600** が定番。思案橋横丁+ 浜の町に分店、夜の長崎の定番つまみ。1 人 30 個以上注文するヘビーリピーターも。",
    content_md: "- 創業:1955 年(昭和 30)\n- 名物:一口餃子(直径 3 cm・10 個 ¥600)\n- 特徴:薄皮+ 焦げ目+ あっさり豚肉餡(ニンニク控えめ)\n- 注文:1 人前 10 個・常連は 30 個以上\n- ペアリング:ビール・焼酎・ハイボール\n- 営業:17:00-23:30(月曜定休)\n- 店舗:浜町本店+ 思案橋店+ 駅前店\n- アクセス:長崎電軌「思案橋」電停 徒歩 3 分",
    region: "kyushu",
    prefecture_ja: "長崎県",
    gun_ja: null,
    municipality_ja: "長崎市",
    lg_code: "42201",
    area_types: ["restaurant_chinese", "izakaya"],
    lat: 32.7411,
    lon: 129.8761,
    season_start: null,
    season_end: null,
    event_start: null,
    event_end: null,
    price_tier: 1,
    booking_window_days: null,
    closed_days: ["mon"],
    external_urls: {},
    tags: ["nagasaki_chuka", "unryutei", "1955", "hitokuchi_gyoza_origin", "shianbashi"],
    source: "manual",
  },
  {
    slug: "chuoken-champon-1925",
    category: "food",
    sub_type: "nagasaki_champon",
    title_zh: "中央軒(1925 創業・浜の町ちゃんぽん老舗 100 年・四海楼系・町中華の定番)",
    title_ja: "中央軒",
    romaji: "Chuoken",
    summary_zh: "**中央軒は 1925 年創業の浜の町ちゃんぽん老舗**(長崎市浜の町・100 年)。四海楼直系の伝統系譜を継承、白濁スープ+ ちゃんぽん麺+ 肉魚介野菜の正統派。観光客向けの四海楼に対し、こちらは地元客が多く訪れる町中華の定番。皿うどん+ 中華丼+ 担々麺等のメニューも豊富。",
    content_md: "- 創業:1925 年(大正 14)・100 年\n- 系譜:四海楼系(初代陳平順時代の弟子筋)\n- 名物:ちゃんぽん(¥800)+ 皿うどん(¥850)\n- 特徴:正統派白濁スープ+ 太麺+ 鶏ガラ+ 豚骨\n- 比較:四海楼(観光客)vs 中央軒(地元客)\n- 営業:11:00-21:00(水曜定休)\n- アクセス:長崎電軌「観光通り」電停 徒歩 3 分",
    region: "kyushu",
    prefecture_ja: "長崎県",
    gun_ja: null,
    municipality_ja: "長崎市",
    lg_code: "42201",
    area_types: ["restaurant_chinese"],
    lat: 32.7397,
    lon: 129.8744,
    season_start: null,
    season_end: null,
    event_start: null,
    event_end: null,
    price_tier: 1,
    booking_window_days: null,
    closed_days: ["wed"],
    external_urls: {},
    tags: ["nagasaki_champon", "chuoken", "1925", "100_years", "shikairo_lineage"],
    source: "manual",
  },
  {
    slug: "yamanokotobuki-sake-hirado",
    category: "food",
    sub_type: "brewery",
    title_zh: "山の寿酒造(平戸市・1830 創業・「山の寿」純米酒+ 焼酎・西九州最古級酒蔵)",
    title_ja: "山の寿酒造",
    romaji: "Yamanokotobuki Shuzo",
    summary_zh: "**山の寿酒造は平戸市の老舗酒蔵**(1830 創業・195 年)。代表銘柄「山の寿」純米酒+ 麦焼酎、平戸独特の海沿い気候+ 軟水で醸造する繊細な香り。平戸城下町に立地、見学+ 試飲(¥500・要予約)+ 蔵元直売。R1 福田酒造(1688)に並ぶ平戸の代表酒蔵。",
    content_md: "- 創業:1830 年(天保 1)・195 年\n- 銘柄:山の寿(純米酒+ 純米吟醸)+ 麦焼酎\n- 立地:平戸市岩の上町(平戸城下)\n- 特徴:海沿い気候+ 軟水醸造の繊細な香り\n- 蔵見学:平日 9:00-15:00・要予約・¥500(試飲付)\n- 直売:蔵元店舗 + ネット\n- アクセス:松浦鉄道 たびら平戸口駅 から バス 30 分・平戸桟橋 徒歩 10 分",
    region: "kyushu",
    prefecture_ja: "長崎県",
    gun_ja: null,
    municipality_ja: "平戸市",
    lg_code: "42207",
    area_types: ["restaurant_traditional", "shrine_temple"],
    lat: 33.3644,
    lon: 129.5500,
    season_start: null,
    season_end: null,
    event_start: null,
    event_end: null,
    price_tier: 2,
    booking_window_days: 7,
    closed_days: ["sat", "sun"],
    external_urls: {},
    tags: ["brewery", "yamanokotobuki", "1830", "hirado_kuradaichi", "195_years"],
    source: "manual",
  },
];

async function main() {
  if (rows.length === 0) {
    console.log("[nagasaki-food-r2] 尚無條目");
    return;
  }
  console.log(`[nagasaki-food-r2] ${rows.length} 筆 ${DRY ? "(dry-run)" : ""}`);
  if (DRY) return;
  const sb = createAdminClient();
  const { error } = await sb.from("japan_entries").upsert(rows, { onConflict: "slug" });
  if (error) {
    console.error("[nagasaki-food-r2] upsert failed:", error);
    process.exit(1);
  }
  console.log(`[nagasaki-food-r2] Done — ${rows.length} rows.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

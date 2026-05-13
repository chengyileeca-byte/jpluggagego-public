// Seed 長崎県 · 衣類 R2 條目 → public.japan_entries(Sprint 21.3)
// 波佐見現代ブランド + 三川内具体 + ビードロ専門店
//
// 5 筆構成:
//   1. aiyu(波佐見現代・カラフル食器)
//   2. マルヒロ HASAMI(2010・西の原)
//   3. 平戸藤祥窯(三川内焼具体窯元)
//   4. 三川内焼会館(共同窯元施設・体験)
//   5. 中尾びーどろ(1973・長崎ビードロ専門店)

import { config as loadEnv } from "dotenv";
loadEnv({ path: ".env.local" });

import { createAdminClient } from "../src/lib/supabase/admin";

const DRY = process.argv.includes("--dry-run");

type SubType = "nagasaki_hasami_mikawachi" | "nagasaki_bidoro_bekko";

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
  {
    slug: "hasami-aiyu-modern",
    category: "fashion",
    sub_type: "nagasaki_hasami_mikawachi",
    title_zh: "aiyu(波佐見現代ブランド・カラフル日用食器・国内雑貨店全国展開・若年層支持)",
    title_ja: "aiyu",
    romaji: "Aiyu",
    summary_zh: "**aiyu は波佐見焼の現代ブランド**(東彼杵郡波佐見町・1955 創業の老舗窯元の現代ライン)。**カラフルなマカロンカラー食器+ 北欧テイストの幾何学パターン** で全国の生活雑貨店(無印・ロフト・蔦屋)で展開、若年層に圧倒的人気。代表シリーズ:ティーシリーズ+ こてつ+ atelier RYU+ ジニ。波佐見観光の「西の原」エリアに直営店あり。",
    content_md: "- 設立:1955 年創業の老舗窯元の現代ブランド\n- 特徴:カラフルマカロンカラー+ 北欧幾何学パターン\n- 代表シリーズ:ティーシリーズ+ こてつ+ atelier RYU+ ジニ\n- 流通:無印良品+ ロフト+ 蔦屋+ KEYUCA 等全国\n- 直営店:波佐見町中尾郷(西の原)\n- 価格帯:皿 ¥1000-3000・湯呑 ¥800-2500\n- 営業:10:00-17:00(火・水定休)\n- アクセス:JR 有田駅 から 車 15 分(東彼杵 IC 5 分)",
    region: "kyushu",
    prefecture_ja: "長崎県",
    gun_ja: "東彼杵郡",
    municipality_ja: "波佐見町",
    lg_code: "42323",
    area_types: ["historic_district"],
    lat: 33.1764,
    lon: 129.8639,
    season_start: null,
    season_end: null,
    event_start: null,
    event_end: null,
    price_tier: 2,
    booking_window_days: null,
    closed_days: ["tue", "wed"],
    external_urls: {},
    tags: ["nagasaki_hasami_mikawachi", "aiyu", "modern_brand", "macaron_color", "young_demographic"],
    source: "manual",
  },
  {
    slug: "hasami-maruhiro-2010",
    category: "fashion",
    sub_type: "nagasaki_hasami_mikawachi",
    title_zh: "マルヒロ HASAMI(2010 ブランド立上・「波佐見焼=HASAMI」全国認知の最大功労者・西の原)",
    title_ja: "マルヒロ HASAMI",
    romaji: "Maruhiro HASAMI",
    summary_zh: "**マルヒロは 2010 年「HASAMI」ブランドを立上げ波佐見焼を全国区にした最大功労者**(東彼杵郡波佐見町西の原・1957 創業)。それまで「有田焼」として OEM されていた波佐見焼を独自ブランド「HASAMI」として再発見、波佐見焼ブームの仕掛け人。代表は **HASAMI シーズン 1 ブロックマグ**(2010・全国大ヒット)、現代波佐見焼を象徴。",
    content_md: "- 創業:1957 年(マルヒロ)\n- HASAMI ブランド立上:2010 年(平成 22)\n- 代表作:HASAMI シーズン 1 ブロックマグ(2010・全国大ヒット)\n- 立地:波佐見町中尾郷「西の原」(モダン陶器街・カフェ+ 工房+ ショップ集積)\n- 直営店:HASAMI POTTERS WAREHOUSE\n- 価格帯:マグ ¥1500-3000・皿 ¥2000-5000\n- 営業:11:00-18:00(火曜定休)\n- アクセス:JR 有田駅 から 車 15 分・西の原バス停 徒歩 5 分",
    region: "kyushu",
    prefecture_ja: "長崎県",
    gun_ja: "東彼杵郡",
    municipality_ja: "波佐見町",
    lg_code: "42323",
    area_types: ["historic_district"],
    lat: 33.1750,
    lon: 129.8628,
    season_start: null,
    season_end: null,
    event_start: null,
    event_end: null,
    price_tier: 2,
    booking_window_days: null,
    closed_days: ["tue"],
    external_urls: { official: "https://www.hasamiyaki.jp/" },
    tags: ["nagasaki_hasami_mikawachi", "maruhiro", "2010_hasami_brand", "block_mug", "nishi_no_hara"],
    source: "manual",
  },
  {
    slug: "mikawachi-fujishou-kiln",
    category: "fashion",
    sub_type: "nagasaki_hasami_mikawachi",
    title_zh: "平戸藤祥窯(三川内焼・佐世保市三川内・平戸藩窯系統・透かし彫り技法・宮内庁御用達)",
    title_ja: "平戸藤祥窯",
    romaji: "Hirado Fujishou Kiln",
    summary_zh: "**平戸藤祥窯は三川内焼の代表窯元**(佐世保市三川内町・平戸藩窯系統)。**透かし彫り技法**(器壁を彫り抜く高度な技)+ 細密染付の精緻さで宮内庁御用達指定、皇室献上品多数製作。三川内焼の白磁+ 唐子絵(中国子供絵)+ 朝鮮系青磁の融合、現代も伝統技法を継承する家族経営の窯元。",
    content_md: "- 立地:佐世保市三川内町\n- 系統:平戸藩窯(国指定伝統工芸品 1978)\n- 技法:透かし彫り(器壁を彫り抜く)+ 細密染付+ 唐子絵\n- 認定:宮内庁御用達(皇室献上品多数)\n- 製品:茶碗+ 香炉+ 花瓶+ 抹茶碗\n- 価格帯:小皿 ¥3000-+ 茶碗 ¥10000-+ 抹茶碗 ¥30000-\n- 営業:9:00-17:00(日曜定休)\n- アクセス:JR 三河内駅 徒歩 10 分",
    region: "kyushu",
    prefecture_ja: "長崎県",
    gun_ja: null,
    municipality_ja: "佐世保市",
    lg_code: "42202",
    area_types: ["historic_district"],
    lat: 33.1989,
    lon: 129.7383,
    season_start: null,
    season_end: null,
    event_start: null,
    event_end: null,
    price_tier: 3,
    booking_window_days: null,
    closed_days: ["sun"],
    external_urls: {},
    tags: ["nagasaki_hasami_mikawachi", "fujishou_kiln", "hirado_hanyou", "transparency_carving", "imperial"],
    source: "manual",
  },
  {
    slug: "mikawachi-yaki-bijutsukan",
    category: "fashion",
    sub_type: "nagasaki_hasami_mikawachi",
    title_zh: "三川内焼美術館・三川内焼会館(佐世保市三川内・伝統工芸 50+ 窯元の共同施設・体験+ 直販)",
    title_ja: "三川内焼美術館",
    romaji: "Mikawachi Yaki Bijutsukan",
    summary_zh: "**三川内焼美術館・三川内焼会館は 50+ 窯元が集まる共同施設**(佐世保市三川内町)。三川内焼の歴史展示+ 各窯元代表作品展+ 直販店+ 絵付け体験(¥1500-3500・要予約)。三川内焼陶器市(GW・10 月)の主会場。三川内焼の全体像を 1 か所で把握できる必訪施設、三川内駅徒歩 5 分。",
    content_md: "- 立地:佐世保市三川内町(三川内焼の里中心)\n- 施設:三川内焼美術館(無料)+ 三川内焼会館(直販)\n- 窯元数:50+ 窯元の共同代表施設\n- 体験:絵付け体験 ¥1500-3500・要予約\n- 三川内焼陶器市:GW(4/29-5/5)+ 10 月(秋陶器祭)\n- 入館料:無料\n- 営業:9:00-17:00(火曜定休)\n- アクセス:JR 三河内駅 徒歩 5 分",
    region: "kyushu",
    prefecture_ja: "長崎県",
    gun_ja: null,
    municipality_ja: "佐世保市",
    lg_code: "42202",
    area_types: ["museum_art", "historic_district"],
    lat: 33.2017,
    lon: 129.7375,
    season_start: null,
    season_end: null,
    event_start: null,
    event_end: null,
    price_tier: 1,
    booking_window_days: null,
    closed_days: ["tue"],
    external_urls: { official: "https://www.mikawachi-utsuwa.net/" },
    tags: ["nagasaki_hasami_mikawachi", "mikawachi_kaikan", "50_kilns", "experience", "free_admission"],
    source: "manual",
  },
  {
    slug: "nakao-bidoro-1973",
    category: "fashion",
    sub_type: "nagasaki_bidoro_bekko",
    title_zh: "中尾びーどろ(1973 創業・長崎ビードロ専門店・チロリン+ ガラス工芸+ 体験工房)",
    title_ja: "中尾びーどろ",
    romaji: "Nakao Bidoro",
    summary_zh: "**中尾びーどろは長崎ビードロ専門店**(長崎市中川 2 丁目・1973 創業・50 年)。長崎ビードロ(吹きガラス・南蛮渡来・チロリン)の伝統技法を継承する数少ない専門工房、ガラス器+ アクセサリー+ チロリン(空気を吸って音を出すガラス玩具)等を製作。**吹きガラス体験**(¥3500-・要予約)で観光客に人気、観光通り近接。",
    content_md: "- 創業:1973 年(昭和 48)・50 年\n- 立地:長崎市中川 2 丁目\n- 製品:ガラス器+ アクセサリー+ チロリン+ サンキャッチャー\n- 体験:吹きガラス体験 ¥3500-(要予約・所要 30-60 分)\n- 価格帯:チロリン ¥1500-+ ガラス器 ¥3000-+ アクセ ¥2000-\n- 営業:10:00-18:00(水曜定休)\n- 隣接:諏訪神社(徒歩 8 分)+ 観光通り(徒歩 10 分)\n- アクセス:長崎電軌「諏訪神社」電停 徒歩 5 分",
    region: "kyushu",
    prefecture_ja: "長崎県",
    gun_ja: null,
    municipality_ja: "長崎市",
    lg_code: "42201",
    area_types: ["historic_district"],
    lat: 32.7517,
    lon: 129.8867,
    season_start: null,
    season_end: null,
    event_start: null,
    event_end: null,
    price_tier: 2,
    booking_window_days: 7,
    closed_days: ["wed"],
    external_urls: {},
    tags: ["nagasaki_bidoro_bekko", "nakao_bidoro", "1973", "blow_glass_experience", "chirorin"],
    source: "manual",
  },
];

async function main() {
  if (rows.length === 0) {
    console.log("[nagasaki-fashion-r2] 尚無條目");
    return;
  }
  console.log(`[nagasaki-fashion-r2] ${rows.length} 筆 ${DRY ? "(dry-run)" : ""}`);
  if (DRY) return;
  const sb = createAdminClient();
  const { error } = await sb.from("japan_entries").upsert(rows, { onConflict: "slug" });
  if (error) {
    console.error("[nagasaki-fashion-r2] upsert failed:", error);
    process.exit(1);
  }
  console.log(`[nagasaki-fashion-r2] Done — ${rows.length} rows.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

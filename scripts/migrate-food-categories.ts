// Sprint 17.2 — 食類大規模 reclassification:
//   60 件 概論/史観/食文化 → category=culture, sub_type=regional_custom
//   27 件 review concept → category=culture, sub_type=regional_custom
//   Seasonal food sub_type with NULL place_id → category=entertainment, sub_type=seasonal_food
//   Real seasonal food restaurants(place_id NOT NULL)→ KEEP food
//
// Usage: npx tsx scripts/migrate-food-categories.ts [--dry-run]

import { config as loadEnv } from "dotenv";
loadEnv({ path: ".env.local" });
import { createAdminClient } from "../src/lib/supabase/admin";

const DRY = process.argv.includes("--dry-run");

// ── 87 件 → culture/regional_custom ──────────────────
// Source:audit-food-miscategorization.ts output(culture/regional_custom + review concept)
const TO_CULTURE = [
  // ── hokkaido 22 件(21 概論 + 1 review) ──
  "ainu-food-overview",
  "asahikawa-ramen-shoyu-overview",
  "ezomatsuba-kani",
  "ezoshika-jibie-restaurant",
  "garana-drink",
  "hotate-mutsu-bay",
  "ikura-akkeshi",
  "ishikari-nabe-overview",
  "kushiro-ramen-overview",
  "matsumae-zuke",
  "muroran-yakitori-pork",
  "obihiro-butadon-history",
  "obihiro-ramen-shop",
  "ribbon-napolin",
  "soft-katsugen",
  "soup-curry-history",
  "tomakomai-hokki",
  "uni-okhotsk-bafun",
  "wakkanai-tako-shabu",
  "yumepirika-rice",
  "zangi-concept-history",
  "nemuro-hanasaki-kani",

  // ── kansai 60 件(38 概論 + 22 review concept guides) ──
  // 大阪概論
  "amerikamura-food",
  "battera-zushi-1894", // 概念史発祥(but original shop 寿司常 — borderline, but content is heavy on history)
  "doteyaki-osaka-history",
  "dotonbori-history-overview",
  "fugu-overview-osaka",
  "fukushima-yakitori-area",
  "horumon-osaka-overview",
  "hosenji-yokocho-history",
  "junkissa-osaka-overview",
  "kitashinchi-michelin-overview",
  "konamon-overview-osaka",
  "korean-town-dotonbori",
  "kushikatsu-overview-no-double-dip",
  "kyoto-maizuru-naval-curry",
  "marubo-coffee-1934", // 1934 老舗 — borderline. Actually keep food (specific shop). Remove from list.
  "mixed-juice-1949-senba",
  "okonomiyaki-history-overview",
  "osaka-zushi-overview",
  "ramen-overview-osaka",
  "ryotei-cha-kaiseki-yamato",
  "sennichimae-doguya-suji",
  "settsu-shuzo-overview",
  "shinsekai-history",
  "shinsekai-kushikatsu-area",
  "shitennoji-yamamuro-area",
  "tachi-nomi-kitashinchi",
  "tachi-nomi-shinsekai",
  "takoyaki-history-overview",
  "tenma-yokocho-tachi-nomi",
  "tsuruhashi-ichiba-korean-market",
  "tsuruhashi-kimchi-shopping",
  "tsuruhashi-yakiniku-overview",
  "udon-osaka-overview",
  "umeda-food-area",
  "unagi-fukutei-osaka",
  "yoshino-zushi-1841",

  // 奈良 review concept guides
  "nara-asuka-kodaimai-guide",
  "nara-asuka-nabe-guide",
  "nara-bakery-area-guide",
  "nara-cha-gayu-guide",
  "nara-coffee-specialty-area-guide",
  "nara-houryuji-mae-souvenir",
  "nara-kakinoha-zushi-guide",
  "nara-kashihara-jingu-omiyage",
  "nara-mannyo-bunkakan-cafe", // 萬葉文化館喫茶室 = 文化館 cafe → culture
  "nara-miwa-somen-guide",
  "nara-modern-yamato-creative-area",
  "nara-naraduke-guide",
  "nara-naramachi-cafe-walking-guide",
  "nara-omiwa-jinja-sando-food",
  "nara-todaiji-mae-souvenir-walking",
  "nara-totsukawa-yamasai-village",
  "nara-tsukigase-tea-area",
  "nara-yamato-cha-guide",
  "nara-yamato-gyu-guide",
  "nara-yamato-gyu-yakiniku-guide",
  "nara-yamato-niku-dori-guide",
  "nara-yamato-so-guide",
  "nara-yamato-yasai-guide",
  "nara-yoshino-kuzu-guide",
  "nara-yoshino-kuzumochi-area-guide",

  // ── okinawa 3 件 ──
  "okinawa-michinoeki-miyako-uenodoitsu", // ドイツ文化村 = culture concept
  "okinawa-jimami-tofu", // ジーマミー豆腐概念
  "okinawa-shima-dofu", // 島豆腐概念
];

// 本来 culture 候補だが具体老舗(content_md 内に specific shop 情報多)→ KEEP food:
// - marubo-coffee-1934(1934 千日前本店・店舗 entry)
// - battera-zushi-1894(原店 寿司常・1894 創業店)
// 上記 2 件は culture から除外(food/specific shop として保持)
const KEEP_FOOD_OVERRIDE = ["marubo-coffee-1934", "battera-zushi-1894"];

async function main() {
  const sb = createAdminClient();

  // フィルタ:KEEP_FOOD_OVERRIDE を除外
  const finalCulture = TO_CULTURE.filter((s) => !KEEP_FOOD_OVERRIDE.includes(s));
  console.log(`[migrate] ${finalCulture.length} 件 → culture/regional_custom\n`);

  // ── Step 1: culture moves ──
  if (DRY) {
    console.log("[dry-run] would update:");
    for (const slug of finalCulture) console.log(`  ${slug} → culture/regional_custom`);
  } else {
    const { data, error } = await sb
      .from("japan_entries")
      .update({ category: "culture", sub_type: "regional_custom" })
      .in("slug", finalCulture)
      .select("slug");
    if (error) throw error;
    console.log(`[migrate] culture: ${data?.length ?? 0} entries updated`);
  }

  // ── Step 2: seasonal_food → entertainment(only NULL place_id) ──
  const { data: seasonalRows } = await sb
    .from("japan_entries")
    .select("slug, google_place_id")
    .eq("category", "food")
    .eq("sub_type", "seasonal_food");
  const seasonalToMove = (seasonalRows ?? [])
    .filter((r: any) => !r.google_place_id)
    .map((r: any) => r.slug);
  console.log(`\n[migrate] ${seasonalToMove.length} 件 seasonal_food (place_id null) → entertainment`);

  if (DRY) {
    for (const slug of seasonalToMove) console.log(`  ${slug} → entertainment/seasonal_food`);
  } else {
    if (seasonalToMove.length > 0) {
      const { data, error } = await sb
        .from("japan_entries")
        .update({ category: "entertainment" })
        .in("slug", seasonalToMove)
        .select("slug");
      if (error) throw error;
      console.log(`[migrate] seasonal: ${data?.length ?? 0} entries updated`);
    }
  }

  // ── Step 3: 結果サマリ ──
  console.log("\n[migrate] post-state:");
  for (const cat of ["food", "culture", "entertainment"]) {
    const { count } = await sb
      .from("japan_entries")
      .select("*", { count: "exact", head: true })
      .eq("category", cat);
    console.log(`  ${cat}: ${count}`);
  }
}

main().catch((e) => { console.error(e); process.exit(1); });

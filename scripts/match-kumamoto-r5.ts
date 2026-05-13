// 熊本 R5(20 筆)の Google Place ID 配対。

import { config as loadEnv } from "dotenv";
loadEnv({ path: ".env.local" });

import { createAdminClient } from "../src/lib/supabase/admin";
import { findPlaceByText, sleep } from "../src/lib/google-places";

interface EntryRow {
  id: number;
  slug: string;
  sub_type: string;
  title_ja: string | null;
  title_zh: string;
  municipality_ja: string | null;
  prefecture_ja: string;
}

const R5_SLUGS = [
  "senryu-ramen-1962-tamana",
  "sanzoku-ryorimichi-takamori",
  "kumamoto-tomato-winter-spring",
  "umasakura-basashi-kumamoto",
  "sangen-kurokawa-modern",
  "aso-san-hotel",
  "tsukasa-no-yu-tamana",
  "michi-no-eki-aso-1995",
  "michi-no-eki-tsujun-kyo",
  "kikuchi-jou-7c-special-historic",
  "kusakabe-yoshimi-jinja",
  "yokoi-shonan-memorial",
  "tamana-kofun-gun",
  "tomioka-jou-ato-reihoku-2003",
  "nagabuta-kaishouro-uto",
  "ushibuka-haiya-matsuri-april",
  "nabegataki-falls-oguni",
  "kyushu-expressway-kumamoto-1980",
  "jr-kagoshima-honsen-kumamoto-1909",
  "aso-kumamoto-airport-international",
];

function buildQuery(entry: EntryRow): string {
  const name = entry.title_ja?.trim() || entry.title_zh;
  const where = entry.municipality_ja || entry.prefecture_ja;
  return where ? `${name} ${where}` : name;
}

async function main() {
  const dry = process.argv.includes("--dry");
  const sb = createAdminClient();

  const { data: rawEntries, error } = await sb
    .from("japan_entries")
    .select(
      "id, slug, sub_type, title_ja, title_zh, municipality_ja, prefecture_ja",
    )
    .in("slug", R5_SLUGS)
    .is("google_place_id", null)
    .order("id");

  if (error) {
    console.error("[match-kumamoto-r5] fetch failed:", error);
    process.exit(1);
  }
  if (!rawEntries || rawEntries.length === 0) {
    console.log("[match-kumamoto-r5] 沒有需要配對的 entry");
    return;
  }

  console.log(
    `[match-kumamoto-r5] 共 ${rawEntries.length} 筆待配對${dry ? " (dry-run)" : ""}`,
  );

  let matched = 0;
  let zeroResults = 0;
  let failed = 0;
  for (const entry of rawEntries as EntryRow[]) {
    const query = buildQuery(entry);
    try {
      const result = await findPlaceByText(query);
      if (!result) {
        console.warn(`  ZERO  ${entry.slug.padEnd(50)} ← ${query}`);
        zeroResults++;
        continue;
      }
      console.log(
        `  OK    ${entry.slug.padEnd(50)} ← ${query}  →  ${result.place_id} (${result.name})`,
      );
      matched++;
      if (!dry) {
        const { error: upErr } = await sb
          .from("japan_entries")
          .update({ google_place_id: result.place_id })
          .eq("id", entry.id);
        if (upErr) {
          console.error(`  WRITE FAIL ${entry.slug}:`, upErr.message);
          failed++;
        }
      }
    } catch (err) {
      console.error(
        `  FAIL  ${entry.slug.padEnd(50)} ← ${query}  (${(err as Error).message})`,
      );
      failed++;
    }
    await sleep(200);
  }

  console.log(
    `\n[match-kumamoto-r5] 結束:matched=${matched} zero=${zeroResults} fail=${failed} ${dry ? "(dry-run, 沒寫 DB)" : ""}`,
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

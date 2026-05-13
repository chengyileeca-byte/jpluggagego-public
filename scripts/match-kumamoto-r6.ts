// 熊本 R6(20 筆)の Google Place ID 配対。

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

const R6_SLUGS = [
  "imakin-shokudo-uchinomaki-1925",
  "tsujun-shuzo-yamato-1770",
  "kawazu-shuzo-yamaga-1932",
  "ikoi-ryokan-kurokawa-1956",
  "noshiyu-kurokawa-1980",
  "michi-no-eki-itsuki-2002",
  "aso-jinja-monzen-shopping",
  "eikokuji-hitoyoshi-1408",
  "rengeji-tanjouji-tamana-1956",
  "tatsuda-shizen-koen-hosokawa-tomb",
  "yatsushiro-matsui-jinja-1701",
  "shimo-jinja-aso-1551",
  "tsukimawari-park-takamori",
  "tsuetate-koinobori-april-may",
  "greenpia-minami-aso-1989",
  "aso-volcano-museum-1982",
  "route-218-yamato-takachiho",
  "kumamoto-oita-highway-bus-1985",
  "aso-kumamoto-airport-domestic",
  "yatsushiro-eki-1896",
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
    .in("slug", R6_SLUGS)
    .is("google_place_id", null)
    .order("id");

  if (error) {
    console.error("[match-kumamoto-r6] fetch failed:", error);
    process.exit(1);
  }
  if (!rawEntries || rawEntries.length === 0) {
    console.log("[match-kumamoto-r6] 沒有需要配對的 entry");
    return;
  }

  console.log(
    `[match-kumamoto-r6] 共 ${rawEntries.length} 筆待配對${dry ? " (dry-run)" : ""}`,
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
    `\n[match-kumamoto-r6] 結束:matched=${matched} zero=${zeroResults} fail=${failed} ${dry ? "(dry-run, 沒寫 DB)" : ""}`,
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

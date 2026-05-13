// 熊本 R2(20 筆)の Google Place ID 配対。
// slug list で限定して、SKIP'd な R1 mismatch との衝突を回避。

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

const R2_SLUGS = [
  // 食 3
  "chosen-ame-sonodaya",
  "kaseita-takadaya",
  "homare-no-jindaiko-koubai-1953",
  // 住 3
  "sozankyo-uchinomaki-1933",
  "ryokan-sanga-kurokawa-1947",
  "hirayama-onsen-area-overview",
  // 衣 3
  "yamaga-toro-koubo-overview",
  "kawajiri-hamono-overview",
  "yatsushiro-igusa-tatami-overview",
  // 育 5
  "yatsushiro-jinja-myoken-1186",
  "yatsushiro-myoken-matsuri-unesco-2016",
  "tsujun-kyo-1854-national-treasure-2023",
  "tabaruzaka-1877-seinan-war",
  "kyu-hosokawa-gyobu-tei-1646",
  // 楽 3
  "aso-farmland-1995",
  "kurokawa-nyutou-tegata-1986",
  "ubuyama-bokujo",
  // 行 3
  "yamanami-highway-1964",
  "milk-road-aso-outer-rim",
  "sl-hitoyoshi-2009-2024-retired",
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
    .in("slug", R2_SLUGS)
    .is("google_place_id", null)
    .order("id");

  if (error) {
    console.error("[match-kumamoto-r2] fetch failed:", error);
    process.exit(1);
  }
  if (!rawEntries || rawEntries.length === 0) {
    console.log("[match-kumamoto-r2] 沒有需要配對的 entry");
    return;
  }

  console.log(
    `[match-kumamoto-r2] 共 ${rawEntries.length} 筆待配對${dry ? " (dry-run)" : ""}`,
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
    `\n[match-kumamoto-r2] 結束:matched=${matched} zero=${zeroResults} fail=${failed} ${dry ? "(dry-run, 沒寫 DB)" : ""}`,
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

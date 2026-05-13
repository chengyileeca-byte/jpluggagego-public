// 一次性配對 — 熊本県 entertainment + transport 専用 matcher。
// 通常の match-google-place-ids.ts は Supabase の 1000 行上限に当たって
// 全件取れない事が多い、そこで prefecture + category で絞って小回り。
//
// Usage:
//   npx tsx scripts/match-kumamoto-rakugu.ts --dry   # query 印字のみ
//   npx tsx scripts/match-kumamoto-rakugu.ts         # 実打 + DB 書込

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
    .eq("prefecture_ja", "熊本県")
    .in("category", ["entertainment", "transport"])
    .is("google_place_id", null)
    .order("id");

  if (error) {
    console.error("[match-kumamoto-rakugu] fetch failed:", error);
    process.exit(1);
  }
  if (!rawEntries || rawEntries.length === 0) {
    console.log("[match-kumamoto-rakugu] 沒有需要配對的 entry");
    return;
  }

  console.log(
    `[match-kumamoto-rakugu] 共 ${rawEntries.length} 筆待配對${dry ? " (dry-run)" : ""}`,
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
    `\n[match-kumamoto-rakugu] 結束:matched=${matched} zero=${zeroResults} fail=${failed} ${dry ? "(dry-run, 沒寫 DB)" : ""}`,
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

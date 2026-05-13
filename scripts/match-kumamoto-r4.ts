// 熊本 R4(20 筆)の Google Place ID 配対。

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

const R4_SLUGS = [
  "okashi-no-shiro-musha-gaeshi-1978",
  "aso-torimiya-1925",
  "chiyonosono-shuzo-1896",
  "hitoyoshi-ryokan-1908",
  "suiranrou-hitoyoshi-1925",
  "konohazaru-tomita-kiln",
  "higo-chonkake-koma",
  "kamishikimi-kumano-imasu-jinja",
  "kunizou-jinja",
  "kuma-ken-1991-national-intangible",
  "itsuki-no-komoriuta",
  "enkei-bunsui-yamato-1956",
  "soyokyo-1934-national-meisho",
  "mitsui-greenland-1965-arao",
  "musashi-zuka-park",
  "senzui-kyo-aso-miyama-kirishima",
  "kusamakura-onsen-tensui",
  "kumamoto-dentetsu-1911",
  "sankou-bus-1898",
  "kamikumamoto-eki-1891",
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
    .in("slug", R4_SLUGS)
    .is("google_place_id", null)
    .order("id");

  if (error) {
    console.error("[match-kumamoto-r4] fetch failed:", error);
    process.exit(1);
  }
  if (!rawEntries || rawEntries.length === 0) {
    console.log("[match-kumamoto-r4] 沒有需要配對的 entry");
    return;
  }

  console.log(
    `[match-kumamoto-r4] 共 ${rawEntries.length} 筆待配對${dry ? " (dry-run)" : ""}`,
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
    `\n[match-kumamoto-r4] 結束:matched=${matched} zero=${zeroResults} fail=${failed} ${dry ? "(dry-run, 沒寫 DB)" : ""}`,
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

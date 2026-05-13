// Import Japan Post KEN_ALL 郵便番号 → 住所 mapping.
//
// Source: https://www.post.japanpost.jp/zipcode/dl/kogaki/zip/ken_all.zip
// Format: CSV, shift-jis, no header.
//   Columns we care about:
//     [2] 郵便番号 (7-digit string)
//     [6] 都道府県名 (e.g. 福島県)
//     [7] 市区町村名 (e.g. 郡山市)
//     [8] 町域名 (e.g. 方八町)
//
// Usage:
//   npm run import:postal:dry     # parse only, no upsert
//   npm run import:postal         # full upsert (~123k rows)

import { config as loadEnv } from "dotenv";
loadEnv({ path: ".env.local" });

import { mkdirSync, readFileSync, existsSync } from "node:fs";
import { execSync } from "node:child_process";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { createAdminClient } from "../src/lib/supabase/admin";

const URL = "https://www.post.japanpost.jp/zipcode/dl/kogaki/zip/ken_all.zip";
const DRY = process.argv.includes("--dry-run");
const LIMIT_ARG = process.argv.indexOf("--limit");
const LIMIT = LIMIT_ARG >= 0 ? Number(process.argv[LIMIT_ARG + 1]) : Infinity;

interface Row {
  postal_code: string;
  prefecture: string;
  city: string;
  town: string;
}

// KEN_ALL has quirks: some towns split across multiple rows when 町域 name
// is too long (ends without "(" matching ")"). For our purposes 町名 level
// is enough — we take the PREFIX before any "(" to discard the
// 大字/字/地割 tail that Japan Post uses to subdivide.
function cleanTown(town: string): string {
  // "以下に掲載がない場合" / "～の次に番地がくる場合" → treat as empty (fall
  // back to city-only resolution later).
  if (town.includes("以下に掲載がない場合")) return "";
  if (town.includes("に次に番地がくる場合")) return "";
  if (town.includes("の次に番地がくる場合")) return "";
  // Drop parenthesized subdivision. Strip both half-width "(" and
  // full-width "（".
  const paren = town.search(/[(（]/);
  if (paren > 0) return town.slice(0, paren);
  return town;
}

async function downloadAndExtract(): Promise<Buffer> {
  const cache = join(tmpdir(), "jpluggagego-ken_all");
  mkdirSync(cache, { recursive: true });
  const zipPath = join(cache, "ken_all.zip");
  const csvPath = join(cache, "KEN_ALL.CSV");

  if (!existsSync(csvPath)) {
    if (!existsSync(zipPath)) {
      console.log(`[postal] download ${URL}`);
      execSync(`curl -fsSL -o "${zipPath}" "${URL}"`, { stdio: "inherit" });
    }
    console.log(`[postal] unzip → ${cache}`);
    execSync(`unzip -o -q "${zipPath}" -d "${cache}"`, { stdio: "inherit" });
  } else {
    console.log(`[postal] using cached ${csvPath}`);
  }

  return readFileSync(csvPath);
}

function parseCsv(buf: Buffer): Row[] {
  // Shift-JIS decode
  const text = new TextDecoder("shift-jis").decode(buf);
  const lines = text.split(/\r?\n/);
  const byZip = new Map<string, Row>();
  for (const line of lines) {
    if (!line) continue;
    // Naive CSV parse is fine — ken_all has no embedded commas/quotes inside
    // the fields we read.
    const cells = line.split(",").map((c) => c.replace(/^"|"$/g, ""));
    if (cells.length < 9) continue;
    const zip = cells[2];
    const pref = cells[6];
    const city = cells[7];
    const townRaw = cells[8];
    if (!/^\d{7}$/.test(zip) || !pref || !city) continue;
    const town = cleanTown(townRaw);
    // If we've seen this zip before, keep the shortest town (more canonical).
    const prev = byZip.get(zip);
    if (prev) {
      if (!prev.town && town) prev.town = town;
      else if (town && town.length < prev.town.length) prev.town = town;
      continue;
    }
    byZip.set(zip, { postal_code: zip, prefecture: pref, city, town });
  }
  return [...byZip.values()];
}

async function main() {
  const buf = await downloadAndExtract();
  const rows = parseCsv(buf);
  console.log(`[postal] parsed ${rows.length} unique postal codes`);

  if (DRY) {
    console.log("[postal] --dry-run, samples:");
    for (const r of rows.slice(0, 10)) {
      console.log(
        `  ${r.postal_code}  ${r.prefecture}${r.city}${r.town || "(-)"}`,
      );
    }
    // Also verify the famous one the user tried.
    const hit = rows.find((r) => r.postal_code === "9638811");
    if (hit) console.log(`[postal] 9638811 → ${hit.prefecture}${hit.city}${hit.town}`);
    return;
  }

  const supabase = createAdminClient();
  const BATCH = 1000;
  const take = Math.min(rows.length, LIMIT);
  let done = 0;
  for (let i = 0; i < take; i += BATCH) {
    const slice = rows.slice(i, Math.min(i + BATCH, take));
    const { error } = await supabase
      .from("postal_codes")
      .upsert(slice, { onConflict: "postal_code" });
    if (error) {
      console.error("[postal] upsert error", error);
      process.exit(1);
    }
    done += slice.length;
    if (done % 10_000 === 0 || done === take) {
      console.log(`[postal] upsert ${done}/${take}`);
    }
  }
  console.log(`[postal] Done — ${done} rows upserted`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

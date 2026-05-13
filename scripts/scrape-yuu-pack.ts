// Scrape 郵便局 ゆうパック (Japan Post parcel) fares from the public fare
// tables at /service/you_pack/charge/ichiran/{NN}.html, one page per origin
// prefecture (NN = 01..47 JIS X 0401 code).
//
// Each page has multiple tables grouping destinations:
//   - same-prefecture (e.g. "東京")
//   - specific prefecture (e.g. "北海道", "沖縄")
//   - bundled regions (e.g. "東北 関東 信越 北陸 東海")
// The <small> block inside the bundled header lists the exact member prefs
// as short names ("青森 岩手 ..."), which is our source of truth — we don't
// need the JP_POST_REGION_OF map for expansion.
//
// Dedup rule: earlier tables win, so same-pref (¥820) beats the bundled
// region-rate (¥880) when origin is also in that region.
//
// Expected output: 47 × 47 × 7 = 15,463 rows.
//
// Usage:
//   npm run scrape:yuu-pack:dry
//   npm run scrape:yuu-pack

import { config as loadEnv } from "dotenv";
loadEnv({ path: ".env.local" });

import { politeFetch, sleep, jitteredDelayMs } from "./lib/polite-fetch";
import {
  PREFECTURES,
  JP_POST_PREF_ALIAS,
} from "./lib/japan-prefectures";
import { createAdminClient } from "../src/lib/supabase/admin";

const SIZE_CODES = ["60", "80", "100", "120", "140", "160", "170"] as const;
type SizeCode = (typeof SIZE_CODES)[number];

interface FareRow {
  from_pref: string;
  to_pref: string;
  size_code: string;
  price_jpy: number;
}

function pageUrl(jisCode: string): string {
  return `https://www.post.japanpost.jp/service/you_pack/charge/ichiran/${jisCode}.html`;
}

// Extract every table inside a page. Each table is represented by its
// destination tokens (resolved to full-form pref names) and a size→price map.
interface ParsedTable {
  destPrefs: string[];
  prices: Partial<Record<SizeCode, number>>;
}

function parseTables(html: string): ParsedTable[] {
  const tables: ParsedTable[] = [];
  // Non-greedy match for each <table class="data ...">...</table> block
  const tableRe =
    /<table[^>]*class="data[^"]*"[^>]*>([\s\S]*?)<\/table>/g;
  let m: RegExpExecArray | null;
  while ((m = tableRe.exec(html)) !== null) {
    const body = m[1];

    // Capture the <th class="h1"> header
    const thMatch = /<th[^>]*class="h1"[^>]*>([\s\S]*?)<\/th>/.exec(body);
    if (!thMatch) continue;
    const headerText = thMatch[1]
      .replace(/<[^>]+>/g, " ")
      .replace(/&[a-z]+;/gi, " ")
      .replace(/\s+/g, " ")
      .trim();

    const tokens = headerText.split(/[\s：:、，,]+/);
    const destPrefs: string[] = [];
    const seen = new Set<string>();
    for (const t of tokens) {
      const full = JP_POST_PREF_ALIAS[t];
      if (full && !seen.has(full)) {
        seen.add(full);
        destPrefs.push(full);
      }
    }
    if (destPrefs.length === 0) continue;

    const prices: Partial<Record<SizeCode, number>> = {};
    const rowRe =
      /<tr><td>(\d+)サイズ<\/td><td[^>]*class="fee"[^>]*>([\d,]+)<span>/g;
    let r: RegExpExecArray | null;
    while ((r = rowRe.exec(body)) !== null) {
      const size = r[1] as SizeCode;
      if (!(SIZE_CODES as readonly string[]).includes(size)) continue;
      prices[size] = parseInt(r[2].replace(/,/g, ""), 10);
    }

    tables.push({ destPrefs, prices });
  }
  return tables;
}

async function fetchOrigin(jisCode: string): Promise<ParsedTable[]> {
  const url = pageUrl(jisCode);
  console.log(`[yuu-pack] GET ${url}`);
  const res = await politeFetch(url, { respectJstPeak: false });
  if (!res.ok) throw new Error(`${url} → HTTP ${res.status}`);
  const html = await res.text();
  return parseTables(html);
}

function buildRowsForOrigin(
  originPref: string,
  tables: ParsedTable[],
): FareRow[] {
  // earlier tables win over later ones (same-pref > specific > bundled)
  const map = new Map<string, FareRow>();
  for (const t of tables) {
    for (const dest of t.destPrefs) {
      for (const size of SIZE_CODES) {
        const price = t.prices[size];
        if (typeof price !== "number") continue;
        const key = `${dest}|${size}`;
        if (map.has(key)) continue;
        map.set(key, {
          from_pref: originPref,
          to_pref: dest,
          size_code: size,
          price_jpy: price,
        });
      }
    }
  }
  return [...map.values()];
}

async function main() {
  const dryRun = process.argv.includes("--dry-run");
  const limitArg = process.argv.indexOf("--limit");
  const limit =
    limitArg !== -1 ? parseInt(process.argv[limitArg + 1] ?? "0", 10) : 0;

  const origins = limit > 0 ? PREFECTURES.slice(0, limit) : PREFECTURES;
  console.log(
    `[yuu-pack] fetching ${origins.length} origin pages (${dryRun ? "DRY" : "LIVE"})`,
  );

  const allRows: FareRow[] = [];
  const missingCoverage: string[] = [];

  for (const origin of origins) {
    const tables = await fetchOrigin(origin.code);
    const rows = buildRowsForOrigin(origin.name, tables);
    const distinctDests = new Set(rows.map((r) => r.to_pref));
    if (distinctDests.size !== PREFECTURES.length) {
      missingCoverage.push(
        `${origin.name} covers ${distinctDests.size}/47 dest prefs`,
      );
    }
    allRows.push(...rows);
    await sleep(jitteredDelayMs());
  }

  console.log(
    `\n[yuu-pack] Generated ${allRows.length} rows (expected 47×47×7 = ${47 * 47 * 7})`,
  );
  if (missingCoverage.length)
    console.warn(`[yuu-pack] coverage gaps:\n  ${missingCoverage.join("\n  ")}`);

  const originsHit = new Set(origins.map((p) => p.name));
  const allSamples: Array<[string, string]> = [
    ["東京都", "東京都"],
    ["東京都", "大阪府"],
    ["東京都", "千葉県"],
    ["東京都", "北海道"],
    ["沖縄県", "北海道"],
    ["大阪府", "大阪府"],
    ["北海道", "北海道"],
    ["北海道", "東京都"],
    ["青森県", "東京都"],
  ];
  const samples = allSamples.filter(([from]) => originsHit.has(from));
  console.log(`\n[yuu-pack] Samples:`);
  for (const [from, to] of samples) {
    const subset = allRows.filter(
      (r) => r.from_pref === from && r.to_pref === to,
    );
    const compact = subset
      .map((r) => `${r.size_code}:¥${r.price_jpy}`)
      .join("  ");
    console.log(`  ${from} → ${to}   ${compact || "(none)"}`);
  }

  if (dryRun) {
    console.log(`\n[yuu-pack] DRY RUN — no DB writes.`);
    return;
  }

  const supabase = createAdminClient();
  // Single timestamp for this run — feeds both yuu_pack_fares.scraped_at
  // (UI reads this for "最終更新") and fare_history.captured_at.
  const capturedAt = new Date().toISOString();
  const CHUNK = 1000;
  let written = 0;
  for (let i = 0; i < allRows.length; i += CHUNK) {
    const batch = allRows
      .slice(i, i + CHUNK)
      .map((r) => ({ ...r, scraped_at: capturedAt }));
    const { error } = await supabase.from("yuu_pack_fares").upsert(batch, {
      onConflict: "from_pref,to_pref,size_code",
    });
    if (error) {
      console.error("[yuu-pack] upsert error:", error);
      process.exit(1);
    }
    written += batch.length;
    process.stdout.write(
      `\r[yuu-pack] upsert progress: ${written}/${allRows.length}`,
    );
  }
  process.stdout.write("\n");
  console.log(`[yuu-pack] Done — ${written} rows upserted.`);

  // Append-only snapshot to fare_history — same capturedAt as above.
  const historyRows = allRows.map((r) => ({
    carrier: "yuu_pack" as const,
    ...r,
    captured_at: capturedAt,
  }));
  let historyWritten = 0;
  for (let i = 0; i < historyRows.length; i += CHUNK) {
    const batch = historyRows.slice(i, i + CHUNK);
    const { error } = await supabase.from("fare_history").insert(batch);
    if (error) {
      console.error("[yuu-pack] fare_history insert error:", error);
      process.exit(1);
    }
    historyWritten += batch.length;
    process.stdout.write(
      `\r[yuu-pack] fare_history progress: ${historyWritten}/${historyRows.length}`,
    );
  }
  process.stdout.write("\n");
  console.log(
    `[yuu-pack] fare_history snapshot — ${historyWritten} rows @ ${capturedAt}`,
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

// Wikipedia 年份交叉驗證 — 對 entries 中聲稱有創業/開湯/開園年份的 entry,
// 用 ja.wikipedia.org の article summary を取得し、年份 diff を抽出。
//
// 制限:
//   - Wikipedia article がない entry はスキップ(多くの小規模 entry)
//   - 元号(明治5年・寛政10年)→ 西暦変換は未実装、4 桁年のみ抽出
//   - article matching は fuzzy(title_ja が article 名と一致しない場合 miss)
//
// 出力: public/data/verification/wikipedia-years-report.json
//   - flagged: seed 主張年と Wiki summary 年が異なる
//   - no_wiki: Wikipedia 上に article 無し(疑わしくはない、参考)
//
// Usage:
//   npm run verify:wikipedia        # 全 entry
//   npm run verify:wikipedia:dry    # 印 候補のみ
//
// 計費:Wikipedia REST API は無料(rate limit 200req/sec)
//
// Phase 3(post-Supabase SUNSET, 2026-05-05)

import { config as loadEnv } from "dotenv";
loadEnv({ path: ".env.local" });

import {
  readFileSync,
  writeFileSync,
  mkdirSync,
  existsSync,
  readdirSync,
} from "fs";
import { join } from "path";

const DATA_DIR = "public/data";
const ENTRIES_JSON = join(DATA_DIR, "japan_entries.json");
const BY_PREF_DIR = join(DATA_DIR, "by-pref");
const REPORT_DIR = join(DATA_DIR, "verification");
const REPORT_JSON = join(REPORT_DIR, "wikipedia-years-report.json");

function readAllEntries(): Record<string, unknown>[] {
  if (existsSync(ENTRIES_JSON)) {
    return JSON.parse(readFileSync(ENTRIES_JSON, "utf8")) as Record<
      string,
      unknown
    >[];
  }
  if (!existsSync(BY_PREF_DIR)) return [];
  const all: Record<string, unknown>[] = [];
  for (const d of readdirSync(BY_PREF_DIR)) {
    const f = join(BY_PREF_DIR, d, "japan_entries.json");
    if (existsSync(f)) {
      all.push(...(JSON.parse(readFileSync(f, "utf8")) as Record<string, unknown>[]));
    }
  }
  return all;
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

interface WikiSummary {
  title: string;
  extract: string;
  description?: string;
  type: string;
}

async function fetchWikipediaSummary(
  title: string,
): Promise<WikiSummary | null> {
  const url = `https://ja.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`;
  const res = await fetch(url, {
    headers: { "User-Agent": "jpluggagego-verify/1.0 (chengyilee.ca@gmail.com)" },
    cache: "no-store",
  });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`Wiki summary HTTP ${res.status}`);
  const data = (await res.json()) as WikiSummary;
  // disambiguation pages → skip
  if (data.type === "disambiguation") return null;
  return data;
}

// 4 桁年(西暦範囲 600-2026)を全部抽出
function extractYears(text: string): Set<number> {
  const years = new Set<number>();
  const matches = text.matchAll(/(\d{3,4})\s*年/g);
  for (const m of matches) {
    const y = Number(m[1]);
    if (y >= 600 && y <= 2026) years.add(y);
  }
  return years;
}

interface Flag {
  slug: string;
  prefecture_ja: string;
  title_ja: string | null;
  title_zh: string;
  wiki_title: string;
  wiki_extract_head: string;
  seed_years: number[];
  wiki_years: number[];
  matched_years: number[];
  unmatched_seed_years: number[];
}

async function main() {
  const dry = process.argv.includes("--dry");
  const limitArg = process.argv.find((a) => /^\d+$/.test(a));
  const limit = limitArg ? Number(limitArg) : null;

  const allEntries = readAllEntries();

  // 候選: title_zh OR content_md 含 4 桁年(seed が年份主張)
  const candidates = allEntries.filter((e) => {
    const text =
      (e.title_zh as string) +
      " " +
      ((e.content_md as string | null) ?? "") +
      " " +
      ((e.summary_zh as string | null) ?? "");
    return extractYears(text).size > 0;
  });
  const sliced = limit ? candidates.slice(0, limit) : candidates;

  console.log(
    `[wiki-verify] ${sliced.length} 筆候補(seed に年份主張あり) ${dry && !limit ? "(dry-run)" : ""}`,
  );

  const flagged: Flag[] = [];
  const noWiki: { slug: string; title_ja: string | null }[] = [];
  const cleanMatch: string[] = [];
  let processed = 0;
  let failed = 0;
  const FLUSH_EVERY = 100;

  const flush = () => {
    if (dry && !limit) return;
    mkdirSync(REPORT_DIR, { recursive: true });
    const payload = {
      generated_at: new Date().toISOString(),
      total_processed: processed,
      total_candidates: sliced.length,
      total_flagged: flagged.length,
      total_no_wiki: noWiki.length,
      total_clean_match: cleanMatch.length,
      total_failed: failed,
      flagged,
      no_wiki: noWiki,
    };
    writeFileSync(REPORT_JSON, JSON.stringify(payload, null, 2) + "\n");
  };

  for (const entry of sliced) {
    const slug = entry.slug as string;
    const titleJa = (entry.title_ja as string | null) ?? null;
    const titleZh = entry.title_zh as string;

    // Wiki query — title_ja を優先(英語/中文より精度高)
    const wikiQuery = titleJa?.split(/[+()(\s]/)[0]?.trim() || titleZh;

    if (dry && !limit) {
      console.log(`  ${slug.padEnd(50)} ← ${wikiQuery}`);
      continue;
    }

    try {
      const summary = await fetchWikipediaSummary(wikiQuery);
      processed++;

      if (!summary) {
        noWiki.push({ slug, title_ja: titleJa });
        continue;
      }

      const seedText =
        titleZh + " " + ((entry.content_md as string | null) ?? "");
      const seedYears = [...extractYears(seedText)];
      const wikiYears = [...extractYears(summary.extract)];
      const matched = seedYears.filter((y) => wikiYears.includes(y));
      const unmatched = seedYears.filter((y) => !wikiYears.includes(y));

      // 全 seed years が wiki に出ない → 疑わしい
      if (matched.length === 0 && wikiYears.length > 0) {
        flagged.push({
          slug,
          prefecture_ja: entry.prefecture_ja as string,
          title_ja: titleJa,
          title_zh: titleZh,
          wiki_title: summary.title,
          wiki_extract_head: summary.extract.slice(0, 200),
          seed_years: seedYears,
          wiki_years: wikiYears,
          matched_years: matched,
          unmatched_seed_years: unmatched,
        });
      } else {
        cleanMatch.push(slug);
      }

      if (processed % FLUSH_EVERY === 0) flush();
    } catch (err) {
      console.error(
        `  FAIL  ${slug.padEnd(50)} (${(err as Error).message})`,
      );
      failed++;
    }

    // Wikipedia 200req/sec 上限、200ms 間隔(5 req/s)で十分余裕
    await sleep(200);
  }

  flush();

  console.log(
    `\n[wiki-verify] 結束:processed=${processed} flagged=${flagged.length} clean=${cleanMatch.length} no_wiki=${noWiki.length} fail=${failed}`,
  );
  if (!dry || limit) {
    console.log(`[wiki-verify] レポート → ${REPORT_JSON}`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

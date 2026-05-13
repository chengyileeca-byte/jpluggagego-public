// Sprint 1.5 楽 audit spot-fix:URL 死鏈 2 件。
//   1. chichibu-tetsudo-paleo — sl-paleo/ → /paleo/(子 path 存在せず親 path)
//   2. iruma-koukuu-sai — Wikipedia「入間航空祭」記事なし → 「入間基地」記事に差替
import { promises as fs } from "node:fs";
import path from "node:path";

const DATA_FILE = path.join(
  process.cwd(),
  "public",
  "data",
  "japan_entries.json",
);

async function main() {
  const all = JSON.parse(
    await fs.readFile(DATA_FILE, "utf-8"),
  ) as Array<Record<string, unknown>>;
  const bySlug = new Map(all.map((e) => [e.slug as string, e]));

  const patches: Record<string, Record<string, string>> = {
    "chichibu-tetsudo-paleo": {
      official: "https://www.chichibu-railway.co.jp/paleo/",
    },
    "iruma-koukuu-sai": {
      wikipedia_ja: "https://ja.wikipedia.org/wiki/入間基地",
    },
  };

  for (const [slug, urls] of Object.entries(patches)) {
    const e = bySlug.get(slug);
    if (!e) continue;
    e.external_urls = urls;
    e.updated_at = new Date().toISOString();
    console.log(`[patch] ${slug}`);
  }

  const sorted = [...bySlug.values()].sort(
    (a, b) => (a.id as number) - (b.id as number),
  );
  await fs.writeFile(
    DATA_FILE,
    JSON.stringify(sorted, null, 2) + "\n",
    "utf-8",
  );

  const file = path.join(
    process.cwd(),
    "public",
    "data",
    "by-pref",
    encodeURIComponent("埼玉県"),
    "japan_entries.json",
  );
  const prefRows = sorted.filter((e) => e.prefecture_ja === "埼玉県");
  await fs.writeFile(file, JSON.stringify(prefRows, null, 2) + "\n", "utf-8");
  console.log(`[patch] sync by-pref/埼玉県 (${prefRows.length})`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

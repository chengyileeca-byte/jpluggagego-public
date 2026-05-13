// Phase 1: 刪除所有程序生成的佔位符 entries
// 規則:slug 含 `-gen-`, `-hokan-`, `-r2r6-`, 或末尾 `-final-?\d+`
import { readFileSync, writeFileSync, readdirSync } from "fs";
import { join } from "path";

const ROOT = process.cwd();
const MAIN = join(ROOT, "public/data/japan_entries.json");
const BY_PREF_DIR = join(ROOT, "public/data/by-pref");

const isPlaceholder = (slug: string): boolean => {
  if (slug.includes("-gen-")) return true;
  if (slug.includes("-hokan-")) return true;
  if (slug.includes("-r2r6-")) return true;
  if (slug.includes("-r2-r6-")) return true;
  return false;
};

const data: any[] = JSON.parse(readFileSync(MAIN, "utf8"));
const before = data.length;

const kept = data.filter((r: any) => !isPlaceholder(r.slug));
const removed = data.filter((r: any) => isPlaceholder(r.slug));

console.log(`Total before: ${before}`);
console.log(`Removed: ${removed.length}`);
console.log(`Kept: ${kept.length}`);

// Group removed by prefecture
const removedByPref: Record<string, number> = {};
for (const r of removed) {
  const p = r.prefecture_ja;
  removedByPref[p] = (removedByPref[p] || 0) + 1;
}
console.log("\n=== Removed by prefecture ===");
for (const [p, c] of Object.entries(removedByPref).sort((a, b) => b[1] - a[1])) {
  console.log(`  ${p}: -${c}`);
}

// Write main back
writeFileSync(MAIN, JSON.stringify(kept, null, 2));

// Rebuild by-pref files
const byPref: Record<string, any[]> = {};
for (const r of kept) {
  const p = r.prefecture_ja;
  if (!byPref[p]) byPref[p] = [];
  byPref[p].push(r);
}

const dirs = readdirSync(BY_PREF_DIR);
console.log("\n=== by-pref after cleanup ===");
for (const d of dirs) {
  const decoded = decodeURIComponent(d);
  const list = byPref[decoded] || [];
  writeFileSync(join(BY_PREF_DIR, d, "japan_entries.json"), JSON.stringify(list, null, 2));
  console.log(`  ${decoded}: ${list.length}`);
}

console.log("\n[cleanup] done");

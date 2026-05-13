// Sprint 17.3 — 衣/行 → 育 reclassification:
//
// 衣 → 育 (regional_custom):textile / 染織 / craft 史(具体店ではなく history)
// 行 → 育 (industrial_heritage):廃線跡(現在運行してない、産業遺産)
//
// 既に commit de09639 で食類 migrate 済(migrate-food-categories.ts)。
// 今回は残りの category 跨ぎ移行。

import { config as loadEnv } from "dotenv";
loadEnv({ path: ".env.local" });
import { createAdminClient } from "../src/lib/supabase/admin";

const DRY = process.argv.includes("--dry-run");

// ── 衣 → 育 / regional_custom (textile + craft 史) ──────────────────
const FASHION_TO_CULTURE_REGIONAL: { slug: string; reason: string }[] = [
  { slug: "nara-aizome-craft", reason: "藍染母技法・染織史" },
  { slug: "yoshino-washi-guide", reason: "吉野和紙 1300 年史" },
  { slug: "shosoin-pattern-guide", reason: "正倉院文様史" },
  { slug: "tenpyo-modern-design", reason: "天平モチーフ史" },
  { slug: "hokkaido-folkcraft-overview", reason: "北海道民藝概要" },
  { slug: "yamato-kasuri-guide", reason: "大和絣史" },
];

// ── 行 → 育 / industrial_heritage (廃線跡は産業遺産) ──────────────────
const TRANSPORT_TO_CULTURE_INDUSTRIAL: { slug: string; reason: string }[] = [
  { slug: "yubari-line-haisen", reason: "夕張線・1985 廃線・炭鉱遺産" },
  { slug: "shihoro-line-haisen", reason: "士幌線・タウシュベツ橋梁" },
  { slug: "tenpoku-line-haisen", reason: "天北線・1989 廃線" },
];

async function main() {
  const sb = createAdminClient();

  console.log(`[migrate] Phase A: 衣 → 育 (regional_custom)`);
  for (const item of FASHION_TO_CULTURE_REGIONAL) {
    if (DRY) {
      console.log(`  [dry] ${item.slug} → culture/regional_custom (${item.reason})`);
    } else {
      const { error } = await sb
        .from("japan_entries")
        .update({ category: "culture", sub_type: "regional_custom" })
        .eq("slug", item.slug);
      if (error) console.error(`  ✗ ${item.slug}: ${error.message}`);
      else console.log(`  ✓ ${item.slug} → culture/regional_custom`);
    }
  }

  console.log(`\n[migrate] Phase B: 行 → 育 (industrial_heritage)`);
  for (const item of TRANSPORT_TO_CULTURE_INDUSTRIAL) {
    if (DRY) {
      console.log(`  [dry] ${item.slug} → culture/industrial_heritage (${item.reason})`);
    } else {
      const { error } = await sb
        .from("japan_entries")
        .update({ category: "culture", sub_type: "industrial_heritage" })
        .eq("slug", item.slug);
      if (error) console.error(`  ✗ ${item.slug}: ${error.message}`);
      else console.log(`  ✓ ${item.slug} → culture/industrial_heritage`);
    }
  }

  // ── 結果サマリ ──
  console.log("\n[migrate] post-state:");
  for (const cat of ["fashion", "transport", "culture"]) {
    const { count } = await sb
      .from("japan_entries")
      .select("*", { count: "exact", head: true })
      .eq("category", cat);
    console.log(`  ${cat}: ${count}`);
  }
}

main().catch((e) => { console.error(e); process.exit(1); });

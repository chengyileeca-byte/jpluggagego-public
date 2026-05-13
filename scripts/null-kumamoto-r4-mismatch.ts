// 熊本 R4 配対結果手動確認後の mismatch を NULL 化。

import { config as loadEnv } from "dotenv";
loadEnv({ path: ".env.local" });

import { createAdminClient } from "../src/lib/supabase/admin";

const MISMATCH_SLUGS = [
  "okashi-no-shiro-musha-gaeshi-1978", // お菓子の城 → 香梅 熊本城香梅庵(別ブランド)
  "kuma-ken-1991-national-intangible", // 拳遊び概念 → 恒松酒造本店(全く別カテゴリ)
];

async function main() {
  const sb = createAdminClient();
  const { error, count } = await sb
    .from("japan_entries")
    .update({ google_place_id: null }, { count: "exact" })
    .in("slug", MISMATCH_SLUGS);
  if (error) {
    console.error("[null-kumamoto-r4] failed:", error);
    process.exit(1);
  }
  console.log(`[null-kumamoto-r4] NULL'd ${count ?? 0} entries`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

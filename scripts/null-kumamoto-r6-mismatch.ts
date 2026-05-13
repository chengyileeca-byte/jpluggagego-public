// 熊本 R6 配対結果手動確認後の mismatch を NULL 化。

import { config as loadEnv } from "dotenv";
loadEnv({ path: ".env.local" });

import { createAdminClient } from "../src/lib/supabase/admin";

const MISMATCH_SLUGS = [
  "kawazu-shuzo-yamaga-1932", // 河津酒造 → 千代の園酒造(別ブランド+R4 と dup)
  "kumamoto-oita-highway-bus-1985", // やまびこ号 → 熊本駅(ルート→駅 generic)
];

async function main() {
  const sb = createAdminClient();
  const { error, count } = await sb
    .from("japan_entries")
    .update({ google_place_id: null }, { count: "exact" })
    .in("slug", MISMATCH_SLUGS);
  if (error) {
    console.error("[null-kumamoto-r6] failed:", error);
    process.exit(1);
  }
  console.log(`[null-kumamoto-r6] NULL'd ${count ?? 0} entries`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

// 熊本 R3 配対結果手動確認後の mismatch を NULL 化。

import { config as loadEnv } from "dotenv";
loadEnv({ path: ".env.local" });

import { createAdminClient } from "../src/lib/supabase/admin";

const MISMATCH_SLUGS = [
  "dekopon-shiranui-1972-origin", // 品種概念 → かわの果樹園(単一農園)
  "kumamoto-kagoshima-highway-bus", // ルート概念 → 桜町 BT(generic・別 highway buses も同じ命中)
];

async function main() {
  const sb = createAdminClient();
  const { error, count } = await sb
    .from("japan_entries")
    .update({ google_place_id: null }, { count: "exact" })
    .in("slug", MISMATCH_SLUGS);
  if (error) {
    console.error("[null-kumamoto-r3] failed:", error);
    process.exit(1);
  }
  console.log(`[null-kumamoto-r3] NULL'd ${count ?? 0} entries`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

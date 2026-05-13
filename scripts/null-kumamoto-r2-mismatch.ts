// 熊本 R2 配対結果手動確認後の mismatch を NULL 化。
// 概念 → 単店 / 路線概念 → 路線 1 区間 / 引退 service → 展示館 等。

import { config as loadEnv } from "dotenv";
loadEnv({ path: ".env.local" });

import { createAdminClient } from "../src/lib/supabase/admin";

const MISMATCH_SLUGS = [
  "kaseita-takadaya", // 高田屋 → たかのチェーン田迎店(別店)
  "hirayama-onsen-area-overview", // 概念 → 平山温泉 湯の蔵(単一旅館)
  "yamaga-toro-koubo-overview", // 工房概念 → 山鹿灯籠の店なかしま(単店)
  "kawajiri-hamono-overview", // 概念 → 林刃物製作所(単店)
  "milk-road-aso-outer-rim", // ルート概念 → 北外輪山大津線(1 区間道)
  "sl-hitoyoshi-2009-2024-retired", // 引退 SL → 人吉市 SL 展示館(別場所)
];

async function main() {
  const sb = createAdminClient();
  const { error, count } = await sb
    .from("japan_entries")
    .update({ google_place_id: null }, { count: "exact" })
    .in("slug", MISMATCH_SLUGS);
  if (error) {
    console.error("[null-kumamoto-r2] failed:", error);
    process.exit(1);
  }
  console.log(`[null-kumamoto-r2] NULL'd ${count ?? 0} entries`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

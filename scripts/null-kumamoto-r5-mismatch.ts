// 熊本 R5 配対結果手動確認後の mismatch を NULL 化。

import { config as loadEnv } from "dotenv";
loadEnv({ path: ".env.local" });

import { createAdminClient } from "../src/lib/supabase/admin";

const MISMATCH_SLUGS = [
  "kumamoto-tomato-winter-spring", // 全国 1 位品種概念 → トマリエ農園(単一農園)
  "sangen-kurokawa-modern", // 旅館 → 自然薯料理やまたけ(レストラン・別カテゴリ)
  "aso-san-hotel", // 阿蘇山ホテル → 亀の井ホテル(別ホテル系列)
  "tamana-kofun-gun", // 玉名古墳群 → 石貫ナギノ横穴群(別古墳)
  "ushibuka-haiya-matsuri-april", // 祭礼 → 牛深ハイヤ大橋(別カテゴリ)
  "jr-kagoshima-honsen-kumamoto-1909", // 路線 → 熊本駅(別 entry の dup)
];

async function main() {
  const sb = createAdminClient();
  const { error, count } = await sb
    .from("japan_entries")
    .update({ google_place_id: null }, { count: "exact" })
    .in("slug", MISMATCH_SLUGS);
  if (error) {
    console.error("[null-kumamoto-r5] failed:", error);
    process.exit(1);
  }
  console.log(`[null-kumamoto-r5] NULL'd ${count ?? 0} entries`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

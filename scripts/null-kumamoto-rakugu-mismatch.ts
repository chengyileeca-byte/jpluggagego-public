// 熊本 楽+行 R1 配對結果手動確認後の mismatch を NULL 化。
// 概念 → 単店 / 別事業 / 別施設 への誤配対が中心。
// SKIP_SLUGS にも追加するので、再 match 時に再誤配対しない。

import { config as loadEnv } from "dotenv";
loadEnv({ path: ".env.local" });

import { createAdminClient } from "../src/lib/supabase/admin";

const MISMATCH_SLUGS = [
  // 楽 R1(5 件)— 観光列車 → 駅 / 祭 → 事務所 / 桜 → 商店街
  "a-train-jr-2011", // A 列車 → 熊本駅
  "asobo-i-jr-2011", // あそぼーい → 阿蘇駅
  "kawasemi-yamasemi-jr-2017", // かわせみやませみ → やませみ generic
  "hi-no-kuni-matsuri-aug", // 火の国まつり → YOSAKOI まつり事務局(別行事)
  "kumamoto-jou-cherry-spring", // 熊本城桜 → 城彩苑(商店街)

  // 行 R1(9 件)— 路線 → 駅 / 市電 system → 単停 / concept → 別事業
  "jr-hisatsu-line-2020-suspended", // 肥薩線 → 人吉駅
  "kumamoto-ichi-densha-1924", // 市電 system → 熊本駅前(単一停留所)
  "kumamoto-fukuoka-highway-bus", // 概念 → 九州産交予約センター(別事業)
  "kumamoto-osaka-night-bus", // 概念 → 桜町 BT(generic)
  "kumamoto-airport-limousine", // 概念 → 阿蘇くまもと空港(空港側)
  "kumamoto-rental-car-area", // area 概念 → トヨタレンタカー新幹線口店(単店)
  "kumamoto-tour-taxi", // 概念 → 観光タクシー(generic)
  "kumamoto-bus-1day-pass", // 1 日券 → 熊本市交通局(別)
  "kumamoto-2020-flood-transport-impact", // 2020 水害 advisory → 球磨川くだり(別事業)
];

async function main() {
  const sb = createAdminClient();
  const { error, count } = await sb
    .from("japan_entries")
    .update({ google_place_id: null }, { count: "exact" })
    .in("slug", MISMATCH_SLUGS);
  if (error) {
    console.error("[null-kumamoto-rakugu] failed:", error);
    process.exit(1);
  }
  console.log(`[null-kumamoto-rakugu] NULL'd ${count ?? 0} entries`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

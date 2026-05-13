// Seed 長崎県 · 行類 R2 條目 → public.japan_entries(Sprint 21.6)
// 軍艦島他社 + 諫早駅 2022 リニューアル
//
// 3 筆構成:
//   1. 軍艦島コンシェルジュ(2 大ツアー会社のもう 1 つ)
//   2. 第七ゑびす丸(他ツアー会社)
//   3. 諫早駅(2022 西九州新幹線開業同時リニューアル)

import { config as loadEnv } from "dotenv";
loadEnv({ path: ".env.local" });

import { createAdminClient } from "../src/lib/supabase/admin";

const DRY = process.argv.includes("--dry-run");

type SubType =
  | "nagasaki_island_routes"
  | "nagasaki_west_kyushu_shinkansen";

interface SeedRow {
  slug: string;
  category: "transport";
  sub_type: SubType;
  title_zh: string;
  title_ja: string | null;
  romaji: string | null;
  summary_zh: string;
  content_md: string | null;
  region: "kyushu";
  prefecture_ja: "長崎県";
  gun_ja: string | null;
  municipality_ja: string | null;
  lg_code: string | null;
  area_types: string[];
  lat: number | null;
  lon: number | null;
  season_start: string | null;
  season_end: string | null;
  event_start: string | null;
  event_end: string | null;
  price_tier: number | null;
  booking_window_days: number | null;
  closed_days: string[];
  external_urls: Record<string, string>;
  tags: string[];
  source: "manual";
}

const rows: SeedRow[] = [
  {
    slug: "gunkanjima-concierge",
    category: "transport",
    sub_type: "nagasaki_island_routes",
    title_zh: "軍艦島コンシェルジュ(軍艦島 4 大ツアー会社・常盤桟橋発・1 日 2 便・¥4500)",
    title_ja: "軍艦島コンシェルジュ",
    romaji: "Gunkanjima Concierge",
    summary_zh: "**軍艦島コンシェルジュは軍艦島上陸ツアー 4 大会社の 1**(常盤桟橋発・1 日 2 便)。やまさ海運(R1)に加え、より小規模で詳細ガイド付きツアーを提供。9:10 / 13:00 出航・所要 2 時間 30 分・¥4500(船+上陸料)。元軍艦島居住者+ 専門家ガイドが特徴で深い解説、リピーター多い。常盤 2 号桟橋発、出島ワーフ徒歩 3 分。",
    content_md: "- 運営:軍艦島コンシェルジュ(株)\n- 出航:1 日 2 便(9:10 / 13:00)\n- 所要:2 時間 30 分\n- 料金:¥4500(船+ 上陸料込)\n- 出発地:常盤 2 号桟橋(出島ワーフ徒歩 3 分)\n- 特徴:元軍艦島居住者+ 専門家ガイドの深い解説\n- 上陸成功率:約 65%(海況依存・他社同水準)\n- 予約:電話 + ネット(www.gunkanjima-concierge.com)・1 ヶ月前推奨\n- 同業 4 社:やまさ海運(R1)+ 軍艦島コンシェルジュ+ 第七ゑびす丸+ シーマン商会\n- アクセス:長崎電軌「大波止」電停 徒歩 5 分",
    region: "kyushu",
    prefecture_ja: "長崎県",
    gun_ja: null,
    municipality_ja: "長崎市",
    lg_code: "42201",
    area_types: ["ferry_terminal"],
    lat: 32.7444,
    lon: 129.8675,
    season_start: null,
    season_end: null,
    event_start: null,
    event_end: null,
    price_tier: 3,
    booking_window_days: 30,
    closed_days: [],
    external_urls: { official: "https://www.gunkanjima-concierge.com/" },
    tags: ["nagasaki_island_routes", "gunkanjima_concierge", "tokiwa_pier", "professional_guide"],
    source: "manual",
  },
  {
    slug: "dai7-ebisumaru",
    category: "transport",
    sub_type: "nagasaki_island_routes",
    title_zh: "第七ゑびす丸(軍艦島ツアー他社・元島民ガイド・小規模高品質・¥4000)",
    title_ja: "第七ゑびす丸",
    romaji: "Dai 7 Ebisumaru",
    summary_zh: "**第七ゑびす丸は軍艦島上陸ツアー 4 大会社の 1**(野母崎+ 長崎港発)。1 日 1-2 便の小規模運営、**元軍艦島居住者がガイドする高品質ツアー** で評価高。¥4000・所要 3 時間(野母崎発・長崎港経由)。観光客に人気の正規ツアー、海況の見極めが上手で上陸成功率比較的高め。",
    content_md: "- 運営:第七ゑびす丸(個人事業者)\n- 出航:1 日 1-2 便(便数は要問合わせ)\n- 所要:3 時間(野母崎+ 長崎港経由)\n- 料金:¥4000(船+ 上陸料込)\n- 出発地:野母崎 + 長崎港(便によって異なる)\n- 特徴:元軍艦島居住者ガイド+ 小規模高品質\n- 上陸成功率:約 70%(海況見極め上手)\n- 予約:電話(095-829-0102)・要事前確認\n- 同業 4 社:やまさ海運(R1)+ 軍艦島コンシェルジュ+ 第七ゑびす丸+ シーマン商会\n- アクセス:長崎駅 から バス 50 分・野母崎下車",
    region: "kyushu",
    prefecture_ja: "長崎県",
    gun_ja: null,
    municipality_ja: "長崎市",
    lg_code: "42201",
    area_types: ["ferry_terminal"],
    lat: 32.5806,
    lon: 129.7547,
    season_start: null,
    season_end: null,
    event_start: null,
    event_end: null,
    price_tier: 3,
    booking_window_days: 30,
    closed_days: [],
    external_urls: {},
    tags: ["nagasaki_island_routes", "dai7_ebisumaru", "former_resident_guide", "70_percent_success"],
    source: "manual",
  },
  {
    slug: "isahaya-station-2022-renewal",
    category: "transport",
    sub_type: "nagasaki_west_kyushu_shinkansen",
    title_zh: "JR 諫早駅(2022 西九州新幹線開業同時リニューアル・新幹線+ 在来+ 島原鉄道結節点)",
    title_ja: "JR 諫早駅",
    romaji: "JR Isahaya Eki",
    summary_zh: "**諫早駅は西九州新幹線+ 在来線+ 島原鉄道+ 県営バスの 4 重結節点**(諫早市・2022 開業同時リニューアル)。**3 路線+ バス hub** の長崎県中央交通拠点、駅周辺再開発で商業施設+ ホテル+ 駐車場拡充。新幹線で福岡から 1 時間、在来線で長崎まで 25 分、島原鉄道で島原まで 1 時間 7 分。",
    content_md: "- リニューアル:2022 年 9 月 23 日(西九州新幹線開業同時)\n- 4 重結節:西九州新幹線+ JR 長崎本線+ JR 大村線+ 島原鉄道+ 県営バス\n- 立地:諫早市永昌東町\n- 新幹線:武雄温泉-長崎間で停車\n- 福岡-諫早:約 1 時間(リレーかもめ + 新幹線)\n- 長崎-諫早:在来線 25 分+ 新幹線 8 分\n- 島原-諫早:島原鉄道 1 時間 7 分\n- 駅周辺:商業施設(イオン諫早+ 西友)+ ホテル+ 駐車場拡充\n- 隣接観光:諫早眼鏡橋(徒歩 12 分)+ 諫早公園(徒歩 12 分)",
    region: "kyushu",
    prefecture_ja: "長崎県",
    gun_ja: null,
    municipality_ja: "諫早市",
    lg_code: "42204",
    area_types: ["transit_hub"],
    lat: 32.8425,
    lon: 130.0644,
    season_start: null,
    season_end: null,
    event_start: null,
    event_end: null,
    price_tier: 1,
    booking_window_days: null,
    closed_days: [],
    external_urls: { official: "https://www.jrkyushu.co.jp/railway/station/?ekiCode=22300" },
    tags: ["nagasaki_west_kyushu_shinkansen", "isahaya_station", "2022_renewal", "4_way_hub", "shinkansen_stop"],
    source: "manual",
  },
];

async function main() {
  if (rows.length === 0) {
    console.log("[nagasaki-transport-r2] 尚無條目");
    return;
  }
  console.log(`[nagasaki-transport-r2] ${rows.length} 筆 ${DRY ? "(dry-run)" : ""}`);
  if (DRY) return;
  const sb = createAdminClient();
  const { error } = await sb.from("japan_entries").upsert(rows, { onConflict: "slug" });
  if (error) {
    console.error("[nagasaki-transport-r2] upsert failed:", error);
    process.exit(1);
  }
  console.log(`[nagasaki-transport-r2] Done — ${rows.length} rows.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

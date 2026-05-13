// 診斷 hotels 分佈傾斜 & yuu_post_offices prefecture=null 的實際型態。
// 不動資料,只讀。

import { createAdminClient } from "../src/lib/supabase/admin";

async function fetchAll<T>(
  sb: ReturnType<typeof createAdminClient>,
  table: string,
  cols: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  filter?: (q: any) => any,
): Promise<T[]> {
  const out: T[] = [];
  for (let offset = 0; ; offset += 1000) {
    let q = sb.from(table).select(cols).range(offset, offset + 999);
    if (filter) q = filter(q);
    const { data, error } = await q;
    if (error) throw error;
    if (!data || data.length === 0) break;
    out.push(...(data as T[]));
    if (data.length < 1000) break;
  }
  return out;
}

async function main() {
  const sb = createAdminClient();

  console.log("=== 問題 #2: 千葉/岡山/佐賀/宮城 等低筆數縣 sample ===\n");
  const suspiciousPrefs = [
    "千葉県",
    "岡山県",
    "佐賀県",
    "宮城県",
    "山形県",
    "新潟県",
    "山梨県",
    "沖縄県",
    "秋田県",
    "長崎県",
  ];
  for (const pref of suspiciousPrefs) {
    const rows = await fetchAll<{
      rakuten_hotel_no: number;
      name_jp: string;
      address2: string | null;
    }>(
      sb,
      "hotels",
      "rakuten_hotel_no, name_jp, address2",
      (q) => q.eq("prefecture", pref).order("rakuten_hotel_no"),
    );
    // address2 前 4 字當 "smallClass proxy",統計分佈
    const cityCounts = new Map<string, number>();
    for (const r of rows) {
      const city = (r.address2 ?? "").slice(0, 4);
      cityCounts.set(city, (cityCounts.get(city) ?? 0) + 1);
    }
    const top = [...cityCounts.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([k, v]) => `${k || "(null)"}:${v}`)
      .join(" ");
    console.log(`${pref} — ${rows.length} 筆,top cities: ${top}`);
    for (const r of rows.slice(0, 3)) {
      console.log(`    ${r.rakuten_hotel_no}  ${r.name_jp}  [${r.address2 ?? "-"}]`);
    }
  }

  console.log("\n=== 同樣抓一個健康的縣當對照 ===\n");
  for (const pref of ["東京都", "大阪府"]) {
    const rows = await fetchAll<{
      rakuten_hotel_no: number;
      name_jp: string;
      address2: string | null;
    }>(
      sb,
      "hotels",
      "rakuten_hotel_no, name_jp, address2",
      (q) => q.eq("prefecture", pref).order("rakuten_hotel_no"),
    );
    const cityCounts = new Map<string, number>();
    for (const r of rows) {
      const city = (r.address2 ?? "").slice(0, 4);
      cityCounts.set(city, (cityCounts.get(city) ?? 0) + 1);
    }
    const top = [...cityCounts.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([k, v]) => `${k || "(null)"}:${v}`)
      .join(" ");
    console.log(`${pref} — ${rows.length} 筆,top cities: ${top}`);
  }

  console.log("\n\n=== 問題 #3: yuu_post_offices prefecture=null 欄位覆蓋 ===\n");
  const nullRows = await fetchAll<{
    osm_id: number;
    name_jp: string;
    address_jp: string | null;
    postal_code: string | null;
    raw_tags: Record<string, string>;
  }>(sb, "yuu_post_offices", "osm_id, name_jp, address_jp, postal_code, raw_tags", (q) =>
    q.is("prefecture", null),
  );
  console.log(`null prefecture total: ${nullRows.length}`);
  const withAddr = nullRows.filter((r) => r.address_jp).length;
  const withPostal = nullRows.filter((r) => r.postal_code).length;
  const withEither = nullRows.filter((r) => r.address_jp || r.postal_code).length;
  console.log(`  has address_jp: ${withAddr}`);
  console.log(`  has postal_code: ${withPostal}`);
  console.log(`  has either: ${withEither} (${((withEither / nullRows.length) * 100).toFixed(1)}%)`);

  // 看 raw_tags 裡到底有哪些 key
  const tagKeyFreq = new Map<string, number>();
  for (const r of nullRows) {
    for (const k of Object.keys(r.raw_tags ?? {})) {
      tagKeyFreq.set(k, (tagKeyFreq.get(k) ?? 0) + 1);
    }
  }
  const topTags = [...tagKeyFreq.entries()]
    .filter(([k]) => k.startsWith("addr:") || k.startsWith("is_in") || k.includes("prefecture"))
    .sort((a, b) => b[1] - a[1])
    .slice(0, 25);
  console.log(`\n  raw_tags 相關 key 頻率 (只看 addr:/is_in/prefecture):`);
  for (const [k, n] of topTags) console.log(`    ${k.padEnd(30)} ${n}`);

  console.log(`\n  null prefecture sample 5 筆 (raw_tags 摘要):`);
  for (const r of nullRows.slice(0, 5)) {
    const rt = r.raw_tags ?? {};
    const addrKeys = Object.keys(rt).filter((k) => k.startsWith("addr:") || k.startsWith("is_in"));
    console.log(
      `    ${r.osm_id}  ${r.name_jp}  addr=${r.address_jp ?? "-"}  postal=${r.postal_code ?? "-"}`,
    );
    for (const k of addrKeys.slice(0, 4)) {
      console.log(`        ${k}: ${rt[k]}`);
    }
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

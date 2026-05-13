import { createAdminClient } from "../src/lib/supabase/admin";

// Supabase/PostgREST caps single-select at 1000 rows; paginate with .range().
// `orderBy` is NOT optional — without a stable sort the physical-storage order
// is not guaranteed across separate PostgREST requests, so rows can be skipped
// or double-counted (which is what silently zeroed out 千葉 to 68 before).
async function fetchAll<T>(
  sb: ReturnType<typeof createAdminClient>,
  table: string,
  cols: string,
  orderBy: string,
): Promise<T[]> {
  const out: T[] = [];
  const PAGE = 1000;
  for (let offset = 0; ; offset += PAGE) {
    const { data, error } = await sb
      .from(table)
      .select(cols)
      .order(orderBy)
      .range(offset, offset + PAGE - 1);
    if (error) throw error;
    if (!data || data.length === 0) break;
    out.push(...(data as T[]));
    if (data.length < PAGE) break;
  }
  return out;
}

async function count(
  sb: ReturnType<typeof createAdminClient>,
  table: string,
): Promise<number | string> {
  const { count, error } = await sb
    .from(table)
    .select("*", { count: "exact", head: true });
  if (error) return `ERR ${error.message}`;
  return count ?? 0;
}

async function main() {
  const sb = createAdminClient();

  const tables = [
    "hotels",
    "yamato_branches",
    "yuu_post_offices",
    "ecbo_locations",
    "yamato_airport_counters",
    "postal_codes",
  ];
  console.log("=== Row counts ===");
  for (const t of tables) {
    console.log(`  ${t}: ${await count(sb, t)}`);
  }

  const hotels = await fetchAll<{ brand: string | null; prefecture: string | null }>(
    sb,
    "hotels",
    "brand, prefecture",
    "rakuten_hotel_no",
  );
  let withBrand = 0;
  const byBrand = new Map<string, number>();
  const byPref = new Map<string, number>();
  for (const r of hotels) {
    if (r.brand) {
      withBrand++;
      byBrand.set(r.brand, (byBrand.get(r.brand) ?? 0) + 1);
    }
    const k = r.prefecture ?? "(null)";
    byPref.set(k, (byPref.get(k) ?? 0) + 1);
  }
  console.log(`\n=== hotels brand coverage ===`);
  console.log(
    `  with brand: ${withBrand} / ${hotels.length} (${((withBrand / hotels.length) * 100).toFixed(1)}%)`,
  );
  for (const [b, n] of [...byBrand.entries()].sort((a, b) => b[1] - a[1])) {
    console.log(`    ${b}: ${n}`);
  }

  console.log(`\n=== hotels by prefecture (${byPref.size}/47) ===`);
  for (const [p, n] of [...byPref.entries()].sort((a, b) => b[1] - a[1])) {
    console.log(`  ${p}: ${n}`);
  }

  const yamatoRows = await fetchAll<{ prefecture: string | null }>(
    sb,
    "yamato_branches",
    "prefecture",
    "branch_code",
  );
  const yBy = new Map<string, number>();
  for (const r of yamatoRows) {
    const k = r.prefecture ?? "(null)";
    yBy.set(k, (yBy.get(k) ?? 0) + 1);
  }
  console.log(`\n=== yamato_branches by prefecture (${yBy.size}/47) ===`);
  for (const [p, n] of [...yBy.entries()].sort((a, b) => b[1] - a[1])) {
    console.log(`  ${p}: ${n}`);
  }

  const yuuRows = await fetchAll<{ prefecture: string | null }>(
    sb,
    "yuu_post_offices",
    "prefecture",
    "osm_id",
  );
  const uBy = new Map<string, number>();
  for (const r of yuuRows) {
    const k = r.prefecture ?? "(null)";
    uBy.set(k, (uBy.get(k) ?? 0) + 1);
  }
  console.log(`\n=== yuu_post_offices by prefecture (${uBy.size}/47) ===`);
  for (const [p, n] of [...uBy.entries()].sort((a, b) => b[1] - a[1])) {
    console.log(`  ${p}: ${n}`);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

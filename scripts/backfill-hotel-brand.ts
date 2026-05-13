// Re-apply matchHotelBrand() to every row in public.hotels where `brand`
// is NULL. Needed after fixing normalizeForMatch() to fold 全形 Latin —
// the original scrape missed rows stored as "東横ＩＮＮ" because our
// pattern "東横inn" never matched the full-width stylization.
//
// Safe to re-run: only touches rows where brand is NULL. Idempotent.
//
// Usage:
//   npx tsx scripts/backfill-hotel-brand.ts          # write
//   npx tsx scripts/backfill-hotel-brand.ts --dry    # just count

import { createAdminClient } from "../src/lib/supabase/admin";
import { matchHotelBrand } from "../src/lib/hotel-policies";

const DRY = process.argv.includes("--dry");
const BATCH = 1000;

async function main() {
  const sb = createAdminClient();
  let offset = 0;
  let scanned = 0;
  let matched = 0;
  const byBrand = new Map<
    string,
    { ids: number[]; canSend: string }
  >();

  while (true) {
    const { data, error } = await sb
      .from("hotels")
      .select("rakuten_hotel_no, name_jp")
      .is("brand", null)
      .order("rakuten_hotel_no")
      .range(offset, offset + BATCH - 1);
    if (error) {
      console.error("select error", error);
      process.exit(1);
    }
    if (!data || data.length === 0) break;
    scanned += data.length;

    for (const row of data) {
      const policy = matchHotelBrand(row.name_jp);
      if (!policy) continue;
      matched++;
      const bucket = byBrand.get(policy.name) ?? {
        ids: [],
        canSend: policy.canSend,
      };
      bucket.ids.push(row.rakuten_hotel_no);
      byBrand.set(policy.name, bucket);
    }

    if (data.length < BATCH) break;
    offset += BATCH;
  }

  console.log(`scanned ${scanned} null-brand rows, matched ${matched}`);
  for (const [brandName, { ids }] of byBrand) {
    console.log(`  ${brandName}: ${ids.length}`);
  }

  if (DRY || matched === 0) {
    console.log("dry-run or nothing to update — exit.");
    return;
  }

  // One UPDATE per brand group (16 brands max). `.in()` with a long id list
  // is still one round trip; Supabase/PostgREST handles this fine.
  for (const [brandName, { ids, canSend }] of byBrand) {
    const { error } = await sb
      .from("hotels")
      .update({ brand: brandName, brand_can_send: canSend })
      .in("rakuten_hotel_no", ids);
    if (error) {
      console.error(`update error for ${brandName}`, error);
      continue;
    }
    console.log(`✓ ${brandName}: ${ids.length} rows updated`);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

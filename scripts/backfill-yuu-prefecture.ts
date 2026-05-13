// Backfill public.yuu_post_offices.prefecture for rows where OSM had no
// addr:* / is_in:state tags. 7,432 rows (~35%) missed the scrape-time
// prefectureOf() pass. Fix: take the prefecture of the nearest Yamato 営業所
// (yamato_branches is 100% prefecture-tagged and spans all 47). Yamato only
// covers the same archipelago the post offices live on, so the same reverse
// lookup works whether the post office is in 沖縄 or 北海道.
//
// Distance metric: equirectangular (flat-earth) approximation in degrees,
// scaled for cos(lat). Enough for "find the one closest branch out of 6015"
// — the correct branch always sits an order of magnitude closer than any
// neighbouring-prefecture candidate except on prefecture boundaries, where
// any answer is defensible.
//
// Usage:
//   npx tsx scripts/backfill-yuu-prefecture.ts --dry
//   npx tsx scripts/backfill-yuu-prefecture.ts

import { createAdminClient } from "../src/lib/supabase/admin";

const DRY = process.argv.includes("--dry");

interface YamatoPoint {
  prefecture: string;
  lat: number;
  lon: number;
}

interface NullYuu {
  osm_id: number;
  lat: number;
  lon: number;
}

async function fetchAll<T>(
  sb: ReturnType<typeof createAdminClient>,
  table: string,
  cols: string,
  orderBy: string,
  // Filter callback receives the post-.select/.order/.range builder (filter builder, not query builder).
  // Supabase's generic types make this hard to name precisely in scripts, so we accept `any`.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  filter?: (q: any) => any,
): Promise<T[]> {
  const out: T[] = [];
  for (let offset = 0; ; offset += 1000) {
    let q = sb.from(table).select(cols).order(orderBy).range(offset, offset + 999);
    if (filter) q = filter(q);
    const { data, error } = await q;
    if (error) throw error;
    if (!data || data.length === 0) break;
    out.push(...(data as T[]));
    if (data.length < 1000) break;
  }
  return out;
}

function nearestPrefecture(
  lat: number,
  lon: number,
  yamato: YamatoPoint[],
): string {
  const cosLat = Math.cos((lat * Math.PI) / 180);
  let best = yamato[0];
  let bestD2 = Infinity;
  for (const y of yamato) {
    const dx = (y.lon - lon) * cosLat;
    const dy = y.lat - lat;
    const d2 = dx * dx + dy * dy;
    if (d2 < bestD2) {
      bestD2 = d2;
      best = y;
    }
  }
  return best.prefecture;
}

async function main() {
  const sb = createAdminClient();

  console.log("[yuu-prefbackfill] loading yamato_branches (prefecture, lat, lon)…");
  const yamatoRaw = await fetchAll<{
    prefecture: string | null;
    lat: number | null;
    lon: number | null;
  }>(sb, "yamato_branches", "prefecture, lat, lon", "branch_code");
  const yamato: YamatoPoint[] = yamatoRaw
    .filter(
      (y): y is YamatoPoint =>
        !!y.prefecture && typeof y.lat === "number" && typeof y.lon === "number",
    )
    .map((y) => ({ prefecture: y.prefecture, lat: y.lat, lon: y.lon }));
  console.log(`  loaded ${yamato.length}/${yamatoRaw.length} usable yamato points`);

  console.log("[yuu-prefbackfill] loading yuu_post_offices where prefecture IS NULL…");
  const nullYuu = await fetchAll<NullYuu>(
    sb,
    "yuu_post_offices",
    "osm_id, lat, lon",
    "osm_id",
    (q) => q.is("prefecture", null),
  );
  console.log(`  loaded ${nullYuu.length} null-prefecture rows`);

  // Group assignments by prefecture for batch UPDATE.
  const byPref = new Map<string, number[]>();
  for (const r of nullYuu) {
    const pref = nearestPrefecture(r.lat, r.lon, yamato);
    const arr = byPref.get(pref) ?? [];
    arr.push(r.osm_id);
    byPref.set(pref, arr);
  }

  console.log(`\n[yuu-prefbackfill] assignment preview:`);
  for (const [p, ids] of [...byPref.entries()].sort((a, b) => b[1].length - a[1].length)) {
    console.log(`  ${p}: ${ids.length}`);
  }

  if (DRY) {
    console.log("\n[yuu-prefbackfill] DRY — no writes.");
    return;
  }

  // PostgREST `.in()` URL length cap: split into chunks of 500 osm_ids.
  const CHUNK = 500;
  for (const [pref, ids] of byPref) {
    for (let i = 0; i < ids.length; i += CHUNK) {
      const slice = ids.slice(i, i + CHUNK);
      const { error } = await sb
        .from("yuu_post_offices")
        .update({ prefecture: pref })
        .in("osm_id", slice);
      if (error) {
        console.error(`  update error for ${pref} chunk ${i}:`, error.message);
        process.exit(1);
      }
    }
    console.log(`  ✓ ${pref}: ${ids.length} rows`);
  }

  console.log(`\n[yuu-prefbackfill] DONE.`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

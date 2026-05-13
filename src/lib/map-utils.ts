// Client-safe map/distance helpers. Kept separate from `nearest-branch.ts`
// because that file pulls in `supabase/server.ts` → `next/headers`, which
// Turbopack refuses to bundle into a Client Component's module graph.

export function googleMapsDirectionsUrl(
  lat: number,
  lon: number,
  opts: { name?: string | null; address?: string | null } = {},
): string {
  // /search mode (not /dir): opens a pin on the map instead of planning a
  // route from the user's current location — planners browsing from outside
  // Japan used to get cross-ocean routes with /dir, which looked broken.
  //
  // Query = "<name> <address>" when both exist. The name is the critical
  // anchor: Google's geocoder prioritizes named POIs over address string
  // parsing, so "園部郵便局 京都府南丹市園部町上本町南210" resolves the
  // actual post office even though the bare address "上本町南210" only
  // gets matched to the 字-level polygon (OSM 住所 drops the 番地 keyword,
  // Google doesn't know 210 is a 番地). Address provides location context
  // to disambiguate common 店名.
  //
  // For ヤマト 営業所 the 担当エリア suffix in full-width parens (「広島出
  // 島営業所（広島宇品）」) is informational only — all 5 代号 share the
  // same physical hub. Strip it so Google matches the real hub name.
  const base = "https://www.google.com/maps/search/?api=1&query=";
  const addr = opts.address?.trim() || null;
  const rawName = opts.name?.trim() || null;
  const name = rawName
    ? rawName.replace(/（[^）]*）$/, "").replace(/\([^)]*\)$/, "").trim()
    : null;
  if (name && addr) return base + encodeURIComponent(`${name} ${addr}`);
  if (addr) return base + encodeURIComponent(addr);
  if (name) return base + encodeURIComponent(name);
  return base + `${lat},${lon}`;
}

export function formatDistance(m: number): string {
  if (m < 1000) return `${Math.round(m)} m`;
  return `${(m / 1000).toFixed(1)} km`;
}

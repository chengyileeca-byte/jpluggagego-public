import { promises as fs } from "node:fs";
import path from "node:path";

export interface NearestYamatoBranch {
  branch_code: string;
  name_jp: string;
  address_jp: string;
  prefecture: string;
  postal_code: string | null;
  phone: string | null;
  lat: number;
  lon: number;
  hours_weekday: string | null;
  last_accept_weekday: string | null;
  hours_saturday: string | null;
  hours_sunday_holiday: string | null;
  distance_m: number;
  // 担当エリア suffixes collapsed from duplicate Zenrin rows sharing the same
  // physical hub. Empty when the row is a standalone branch.
  coverage_areas?: string[];
}

export interface NearestYuuPostOffice {
  osm_id: number;
  name_jp: string;
  name_en: string | null;
  address_jp: string | null;
  prefecture: string | null;
  postal_code: string | null;
  phone: string | null;
  opening_hours: string | null;
  website: string | null;
  lat: number;
  lon: number;
  distance_m: number;
}

type RawYamatoBranch = Omit<NearestYamatoBranch, "distance_m" | "coverage_areas">;
type RawYuuPostOffice = Omit<NearestYuuPostOffice, "distance_m">;

let _yamatoCache: RawYamatoBranch[] | null = null;
let _yuuCache: RawYuuPostOffice[] | null = null;

async function loadAllByPref<T>(filename: string): Promise<T[]> {
  const byPrefDir = path.join(process.cwd(), "public", "data", "by-pref");
  let entries: string[];
  try {
    entries = await fs.readdir(byPrefDir);
  } catch {
    return [];
  }
  const all: T[] = [];
  for (const dir of entries) {
    const file = path.join(byPrefDir, dir, filename);
    try {
      const raw = await fs.readFile(file, "utf-8");
      all.push(...(JSON.parse(raw) as T[]));
    } catch {
      // skip missing/corrupt prefecture file
    }
  }
  return all;
}

async function loadAllYamatoBranches(): Promise<RawYamatoBranch[]> {
  if (_yamatoCache) return _yamatoCache;
  _yamatoCache = await loadAllByPref<RawYamatoBranch>("yamato_branches.json");
  return _yamatoCache;
}

async function loadAllYuuPostOffices(): Promise<RawYuuPostOffice[]> {
  if (_yuuCache) return _yuuCache;
  _yuuCache = await loadAllByPref<RawYuuPostOffice>("yuu_post_offices.json");
  return _yuuCache;
}

// Haversine — meters between two coords
function haversineMeters(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
): number {
  const R = 6_371_000;
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.min(1, Math.sqrt(a)));
}

// Collapse Zenrin's one-row-per-担当エリア expansion. A single physical
// Yamato hub (e.g. 広島出島営業所 at 出島１丁目２０－３１) appears up to 5-7
// times, one per sub-territory it covers. Dedupe by (lat, lon) — Zenrin
// returns byte-identical coords within a hub group — strip the 担当 suffix
// from the display name, and keep the first row as representative.
function stripBranchSuffix(name: string): {
  base: string;
  coverage: string | null;
} {
  const m = name.match(/^(.+?)（([^）]+)）$/) ?? name.match(/^(.+?)\(([^)]+)\)$/);
  if (!m) return { base: name.trim(), coverage: null };
  return { base: m[1].trim(), coverage: m[2].trim() };
}

function dedupeYamatoBranches(
  rows: NearestYamatoBranch[],
): NearestYamatoBranch[] {
  const byKey = new Map<string, NearestYamatoBranch & { _cov: string[] }>();
  for (const r of rows) {
    const key = `${r.lat.toFixed(6)},${r.lon.toFixed(6)}`;
    const { base, coverage } = stripBranchSuffix(r.name_jp);
    const existing = byKey.get(key);
    if (existing) {
      if (coverage) existing._cov.push(coverage);
      continue;
    }
    byKey.set(key, {
      ...r,
      name_jp: base,
      _cov: coverage ? [coverage] : [],
    });
  }
  return [...byKey.values()].map(({ _cov, ...rest }) => ({
    ...rest,
    coverage_areas: _cov,
  }));
}

export async function nearestYamatoBranches(
  lat: number,
  lon: number,
  opts: { radiusM?: number; limit?: number } = {},
): Promise<NearestYamatoBranch[]> {
  const { radiusM = 5000, limit = 5 } = opts;
  // Over-fetch 5× so dedupe still yields `limit` unique hubs even in dense
  // metros where a single hub spawns 5-7 Zenrin rows.
  const fetchLimit = Math.min(Math.max(limit * 5, limit), 50);

  const all = await loadAllYamatoBranches();
  const enriched: NearestYamatoBranch[] = [];
  for (const r of all) {
    if (r.lat == null || r.lon == null) continue;
    const distance_m = haversineMeters(lat, lon, r.lat, r.lon);
    if (distance_m > radiusM) continue;
    enriched.push({ ...r, distance_m });
  }
  enriched.sort((a, b) => a.distance_m - b.distance_m);
  return dedupeYamatoBranches(enriched.slice(0, fetchLimit)).slice(0, limit);
}

export async function nearestYuuPostOffices(
  lat: number,
  lon: number,
  opts: { radiusM?: number; limit?: number } = {},
): Promise<NearestYuuPostOffice[]> {
  const { radiusM = 5000, limit = 5 } = opts;

  const all = await loadAllYuuPostOffices();
  const enriched: NearestYuuPostOffice[] = [];
  for (const r of all) {
    if (r.lat == null || r.lon == null) continue;
    const distance_m = haversineMeters(lat, lon, r.lat, r.lon);
    if (distance_m > radiusM) continue;
    enriched.push({ ...r, distance_m });
  }
  enriched.sort((a, b) => a.distance_m - b.distance_m);
  return enriched.slice(0, limit);
}

// Pure helpers moved to `./map-utils` so Client Components can import them
// without dragging the server-only Supabase client into the browser bundle.
// Re-exported here to keep existing call sites (server pages) unchanged.
export { googleMapsDirectionsUrl, formatDistance } from "./map-utils";

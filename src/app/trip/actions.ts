"use server";

import {
  nearestYamatoBranches,
  nearestYuuPostOffices,
  type NearestYamatoBranch,
  type NearestYuuPostOffice,
} from "@/lib/nearest-branch";

export interface StayNearbyResult {
  yamato: NearestYamatoBranch[];
  yuu: NearestYuuPostOffice[];
}

// Server-action args cross the client boundary — the browser can send any
// payload, so validate before passing into the PostGIS RPC. Range covers
// Japan + reasonable buffer; anything outside is bogus input, short-circuit
// with empty results rather than scanning the globe.
function isValidJpCoord(n: unknown, min: number, max: number): n is number {
  return typeof n === "number" && Number.isFinite(n) && n >= min && n <= max;
}

export async function fetchStayNearby(
  lat: number,
  lon: number,
): Promise<StayNearbyResult> {
  if (!isValidJpCoord(lat, 20, 50) || !isValidJpCoord(lon, 120, 155)) {
    return { yamato: [], yuu: [] };
  }
  const [yamato, yuu] = await Promise.all([
    nearestYamatoBranches(lat, lon, { radiusM: 3000, limit: 3 }),
    nearestYuuPostOffices(lat, lon, { radiusM: 3000, limit: 3 }),
  ]);
  return { yamato, yuu };
}

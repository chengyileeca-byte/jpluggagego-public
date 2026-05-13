import "server-only";
import { geocodeAddress, type GeocodeResult } from "./geocode";
import { resolveCoordInput } from "./coord-input";
import {
  nearestYamatoBranches,
  nearestYuuPostOffices,
  type NearestYamatoBranch,
  type NearestYuuPostOffice,
} from "./nearest-branch";

// One-shot resolver for the 地址 mode of /quote (both 出發地 and 送達地).
// Input: a string that may be an address, coord pair, or Google Maps URL.
// Output: geocoded point + nearest Yamato/郵便局 inside radiusM (empty list
// if nothing found).

export interface LocationResolution {
  geo: GeocodeResult;
  yamato: NearestYamatoBranch[];
  yuu: NearestYuuPostOffice[];
}

export async function resolveLocation(
  address: string,
  radiusM: number,
  limit = 5,
): Promise<LocationResolution | null> {
  const s = address.trim();
  if (!s) return null;

  // Pin-accurate fast path: bare coords or Google Maps link.
  const coord = await resolveCoordInput(s);
  const geo: GeocodeResult | null = coord
    ? {
        lat: coord.lat,
        lon: coord.lon,
        display_name:
          coord.source === "pair"
            ? `${coord.lat}, ${coord.lon}`
            : `Google Maps → ${coord.lat}, ${coord.lon}`,
        matched_query: s,
        fallback_level: 0,
      }
    : await geocodeAddress(s);

  if (!geo) return null;

  const [yamato, yuu] = await Promise.all([
    nearestYamatoBranches(geo.lat, geo.lon, { radiusM, limit }),
    nearestYuuPostOffices(geo.lat, geo.lon, { radiusM, limit }),
  ]);
  return { geo, yamato, yuu };
}

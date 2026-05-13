import "server-only";
import { fetchYamatoStatus } from "./yamato";
import { fetchYuuStatus } from "./yuu-pack";
import type { Carrier, TrackingResult } from "./detect";

export type { Carrier, DetectedTracking, TrackingResult } from "./detect";
export { detectTracking, formatYamatoDisplay } from "./detect";

export async function fetchStatus(
  carrier: Carrier,
  tracking_no: string,
): Promise<TrackingResult | null> {
  if (carrier === "yamato") return fetchYamatoStatus(tracking_no);
  if (carrier === "yuu") return fetchYuuStatus(tracking_no);
  return null;
}

import "server-only";

export type Carrier = "yamato" | "yuu";

export interface DetectedTracking {
  carrier: Carrier;
  // Canonical form we store in DB — digits only for Yamato, upper-
  // case alphanumeric for ゆう (international parcels use AB123456789JP).
  tracking_no: string;
}

export interface TrackingResult {
  status: string;
  statusAt: Date | null;
  terminal: boolean;
  notFound: boolean;
}

// Yamato 宅急便 伝票番号 is always 12 digits, commonly displayed as
// 4-4-4 separated by spaces or hyphens. First digit has no check-digit
// meaning we can exploit, so we just match any 12-digit sequence.
const YAMATO_RE = /^\d{4}[\s-]?\d{4}[\s-]?\d{4}$/;

// ゆうパック 追跡番号: 12 digits domestic (3-4-5 or run-on), or an
// international shape like `AA123456789JP` (2 letters + 9 digits +
// country code). Domestic 12-digit overlaps with Yamato's shape — we
// break the tie by looking for typical ゆう prefixes.
const YUU_INTL_RE = /^[A-Z]{2}\d{9}[A-Z]{2}$/;
// Domestic ゆう 12-digit: first 4 digits are the service code; common
// ranges start with 11/12/13 (ゆうパケット), 40/41/42/43 (ゆうパック).
// Yamato伝票 doesn't collide here — its ranges start 4xxx but typed
// differently; ambiguous 12-digit we default to Yamato (more common
// for tourists) and let the lookup fail soft.
const YUU_DOMESTIC_PREFIXES = [
  "40", "41", "42", "43", // ゆうパック
  "11", "12", "13",       // ゆうパケット
];

export function detectTracking(raw: string): DetectedTracking | null {
  const s = raw.trim().toUpperCase();

  if (YUU_INTL_RE.test(s)) {
    return { carrier: "yuu", tracking_no: s };
  }

  if (YAMATO_RE.test(s)) {
    const digits = s.replace(/[\s-]/g, "");
    if (digits.length !== 12) return null;
    const prefix2 = digits.slice(0, 2);
    if (YUU_DOMESTIC_PREFIXES.includes(prefix2)) {
      return { carrier: "yuu", tracking_no: digits };
    }
    return { carrier: "yamato", tracking_no: digits };
  }

  return null;
}

export function formatYamatoDisplay(no: string): string {
  if (no.length !== 12) return no;
  return `${no.slice(0, 4)}-${no.slice(4, 8)}-${no.slice(8, 12)}`;
}

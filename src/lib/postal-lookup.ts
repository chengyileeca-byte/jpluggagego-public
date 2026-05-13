import "server-only";
import { promises as fs } from "node:fs";
import path from "node:path";

// Reverse-lookup a 7-digit Japan postal code to a Japanese-script address.
// Used by the geocoder when the user pastes a romaji address (from Google
// Maps English UI) that happens to include a postal code — we produce a
// Japanese address string that GSI can handle at 町名 precision.

const cache = new Map<string, PostalAddress | null>();
let _index: Map<string, PostalAddress> | null = null;

export interface PostalAddress {
  postal_code: string;
  prefecture: string;
  city: string;
  town: string;
}

// Accepts "123-4567", "1234567", or mixed full-/half-width digits with
// optional full-width hyphen. Returns 7 ASCII digits, or null.
export function normalizePostalCode(raw: string): string | null {
  const ascii = raw.replace(/[０-９]/g, (d) =>
    String.fromCharCode(d.charCodeAt(0) - 0xFEE0),
  );
  const digits = ascii.replace(/[^0-9]/g, "");
  return digits.length === 7 ? digits : null;
}

// Finds first 7-digit Japan postal code in a free-form string. Prefers the
// "xxx-xxxx" form which is near-unambiguous; falls back to bare 7 digits
// only if nothing else hits (risks false positives on phone numbers).
export function extractPostalFromText(s: string): string | null {
  const dashed = s.match(/(?<!\d)(\d{3}[-ー－–—](\d{4}))(?!\d)/);
  if (dashed) return dashed[1].replace(/[-ー－–—]/, "").slice(0, 7);
  const full = s.match(/(?<![\d-])(\d{7})(?![\d-])/);
  if (full) return full[1];
  return null;
}

async function ensureIndex(): Promise<Map<string, PostalAddress>> {
  if (_index) return _index;
  const file = path.join(
    process.cwd(),
    "public",
    "data",
    "postal_codes.json",
  );
  const rows = JSON.parse(await fs.readFile(file, "utf-8")) as PostalAddress[];
  const idx = new Map<string, PostalAddress>();
  for (const r of rows) {
    if (!idx.has(r.postal_code)) idx.set(r.postal_code, r);
  }
  _index = idx;
  return idx;
}

export async function lookupPostal(
  code: string,
): Promise<PostalAddress | null> {
  const zip = normalizePostalCode(code);
  if (!zip) return null;
  if (cache.has(zip)) return cache.get(zip)!;

  const idx = await ensureIndex();
  const out = idx.get(zip) ?? null;
  cache.set(zip, out);
  return out;
}

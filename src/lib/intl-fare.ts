// 國際運費查詢工具。
//
// 郵便局 EMS/国際小包:階梯式料金表,規則為「X 公克まで Y 日圓」—— 使用者
// 給出實際重量 W,回傳「最小的 step 使 step.grams >= W」對應的料金。
//
// Yamato 國際宅急便:size-based。使用者給 size_code,回傳該 size 料金
// (只要不超過 size 的 max_weight_kg)。

import { promises as fs } from "node:fs";
import path from "node:path";

export type YuuServiceType =
  | "ems"
  | "parcel_air"
  | "parcel_sal"
  | "parcel_surface";

export interface YuuFareRow {
  service_type: YuuServiceType;
  country_iso2: string;
  weight_grams: number;
  price_jpy: number;
  max_weight_kg: number | null;
}

export interface YamatoIntlRow {
  country_iso2: string;
  size_code: string;
  max_weight_kg: number;
  price_jpy: number;
}

export interface YuuQuoteResult {
  service: YuuServiceType;
  priceJpy: number;
  /** 這一階的重量上限(公克)— 就是我們用來配這個料金的 step */
  stepGrams: number;
  /** 該服務的最大支援重量(公斤);若 input 超過此值則 priceJpy 為 null */
  maxKg: number;
}

/**
 * 從 YuuFareRow[] 中挑出符合 weightGrams 的最低階料金。
 * 若重量超過此服務的最大階,回傳 null 讓 API 呈現「超重」。
 */
export function pickYuuStep(
  rows: YuuFareRow[],
  weightGrams: number,
): { grams: number; priceJpy: number } | null {
  if (weightGrams <= 0) return null;
  // rows 預期同 service_type + country;按 weight_grams 升冪
  const sorted = [...rows].sort((a, b) => a.weight_grams - b.weight_grams);
  for (const r of sorted) {
    if (r.weight_grams >= weightGrams) {
      return { grams: r.weight_grams, priceJpy: r.price_jpy };
    }
  }
  return null; // 超過最大階
}

/**
 * Yamato size-based 查詢:給 size_code 與 weight(kg),
 * 若不超過該 size 上限回傳料金;若超過建議使用者改選較大 size。
 */
export function pickYamatoBySize(
  rows: YamatoIntlRow[],
  sizeCode: string,
  weightKg: number,
): {
  priceJpy: number | null;
  maxKg: number | null;
  oversize: boolean;
  suggestSizeCode?: string;
} {
  const exact = rows.find((r) => r.size_code === sizeCode);
  if (!exact) return { priceJpy: null, maxKg: null, oversize: false };

  if (weightKg > exact.max_weight_kg) {
    // 找最小的能塞下的 size
    const sorted = [...rows].sort((a, b) => a.max_weight_kg - b.max_weight_kg);
    const next = sorted.find((r) => r.max_weight_kg >= weightKg);
    return {
      priceJpy: null,
      maxKg: exact.max_weight_kg,
      oversize: true,
      suggestSizeCode: next?.size_code,
    };
  }
  return { priceJpy: exact.price_jpy, maxKg: exact.max_weight_kg, oversize: false };
}

type RawYuuFareRow = YuuFareRow & { status?: string };

let _yuuIntlCache: RawYuuFareRow[] | null = null;
let _yamatoIntlCache: YamatoIntlRow[] | null = null;

export async function loadYuuIntlFares(
  countryIso2: string,
): Promise<YuuFareRow[]> {
  if (!_yuuIntlCache) {
    const raw = await fs.readFile(
      path.join(process.cwd(), "public", "data", "yuu_intl_fares.json"),
      "utf-8",
    );
    _yuuIntlCache = JSON.parse(raw) as RawYuuFareRow[];
  }
  return _yuuIntlCache.filter(
    (r) => r.country_iso2 === countryIso2 && (r.status ?? "active") === "active",
  );
}

export async function loadYamatoIntlFares(
  countryIso2: string,
): Promise<YamatoIntlRow[]> {
  if (!_yamatoIntlCache) {
    const raw = await fs.readFile(
      path.join(process.cwd(), "public", "data", "yamato_intl_fares.json"),
      "utf-8",
    );
    _yamatoIntlCache = JSON.parse(raw) as YamatoIntlRow[];
  }
  return _yamatoIntlCache.filter((r) => r.country_iso2 === countryIso2);
}

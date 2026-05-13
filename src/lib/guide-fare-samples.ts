import { promises as fs } from "node:fs";
import path from "node:path";

export type GuideFareSample = {
  label: string;
  fromPref: string;
  toPref: string;
};

export const AIRPORT_SAMPLES: readonly GuideFareSample[] = [
  { label: "東京都内 (都内飯店)", fromPref: "東京都", toPref: "東京都" },
  { label: "東京 → 京都", fromPref: "東京都", toPref: "京都府" },
  { label: "東京 → 大阪", fromPref: "東京都", toPref: "大阪府" },
  { label: "東京 → 北海道", fromPref: "東京都", toPref: "北海道" },
  { label: "東京 → 沖縄", fromPref: "東京都", toPref: "沖縄県" },
] as const;

export const BRANCH_SAMPLES: readonly GuideFareSample[] = [
  { label: "東京 → 京都", fromPref: "東京都", toPref: "京都府" },
  { label: "東京 → 大阪", fromPref: "東京都", toPref: "大阪府" },
  { label: "京都 → 東京", fromPref: "京都府", toPref: "東京都" },
  { label: "大阪 → 東京", fromPref: "大阪府", toPref: "東京都" },
  { label: "東京 → 福岡", fromPref: "東京都", toPref: "福岡県" },
] as const;

export const HOTEL_SAMPLES: readonly GuideFareSample[] = [
  { label: "東京 → 京都", fromPref: "東京都", toPref: "京都府" },
  { label: "京都 → 大阪", fromPref: "京都府", toPref: "大阪府" },
  { label: "東京 → 大阪", fromPref: "東京都", toPref: "大阪府" },
  { label: "京都 → 東京", fromPref: "京都府", toPref: "東京都" },
  { label: "大阪 → 京都", fromPref: "大阪府", toPref: "京都府" },
] as const;

export const GUIDE_SIZES = [
  { code: "100", label: "100", hint: "~21吋" },
  { code: "140", label: "140", hint: "~26吋" },
  { code: "160", label: "160", hint: "~29吋" },
] as const;

export type GuideFareRow = {
  label: string;
  prices: Record<string, number | null>;
};

export type GuideFareTable = {
  rows: GuideFareRow[];
  latestScrapedAt: string | null;
};

type FareRow = {
  from_pref: string;
  to_pref: string;
  size_code: string;
  price_jpy: number;
  scraped_at: string | null;
};

let _yamatoFaresCache: FareRow[] | null = null;

async function loadYamatoFares(): Promise<FareRow[]> {
  if (_yamatoFaresCache) return _yamatoFaresCache;
  const raw = await fs.readFile(
    path.join(process.cwd(), "public", "data", "yamato_fares.json"),
    "utf-8",
  );
  _yamatoFaresCache = JSON.parse(raw) as FareRow[];
  return _yamatoFaresCache;
}

export async function fetchGuideFares(
  samples: readonly GuideFareSample[],
): Promise<GuideFareTable> {
  const all = await loadYamatoFares();
  const fromPrefs = new Set(samples.map((s) => s.fromPref));
  const toPrefs = new Set(samples.map((s) => s.toPref));
  const sizeCodes = new Set<string>(GUIDE_SIZES.map((s) => s.code));

  const priceMap = new Map<string, number>();
  let latestScrapedAt: string | null = null;
  for (const r of all) {
    if (
      !fromPrefs.has(r.from_pref) ||
      !toPrefs.has(r.to_pref) ||
      !sizeCodes.has(r.size_code)
    )
      continue;
    priceMap.set(`${r.from_pref}|${r.to_pref}|${r.size_code}`, r.price_jpy);
    if (r.scraped_at && (!latestScrapedAt || r.scraped_at > latestScrapedAt)) {
      latestScrapedAt = r.scraped_at;
    }
  }

  const rows: GuideFareRow[] = samples.map((s) => ({
    label: s.label,
    prices: Object.fromEntries(
      GUIDE_SIZES.map((sz) => [
        sz.code,
        priceMap.get(`${s.fromPref}|${s.toPref}|${sz.code}`) ?? null,
      ]),
    ),
  }));

  return { rows, latestScrapedAt };
}

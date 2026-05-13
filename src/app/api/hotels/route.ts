import { type NextRequest } from "next/server";
import { promises as fs } from "node:fs";
import path from "node:path";
import { PREFECTURES } from "@/lib/japan";
import { matchHotelBrand } from "@/lib/hotel-policies";

export const dynamic = "force-dynamic";

type HotelRow = {
  rakuten_hotel_no: number;
  name_jp: string;
  prefecture: string;
  address1: string | null;
  address2: string | null;
  lat: number | null;
  lon: number | null;
  brand: string | null;
  brand_can_send: string | null;
  rakuten_url: string | null;
};

const _byPrefCache = new Map<string, HotelRow[]>();
let _allCache: HotelRow[] | null = null;

async function loadPrefHotels(pref: string): Promise<HotelRow[]> {
  const cached = _byPrefCache.get(pref);
  if (cached) return cached;
  const file = path.join(
    process.cwd(),
    "public",
    "data",
    "by-pref",
    encodeURIComponent(pref),
    "hotels.json",
  );
  try {
    const rows = JSON.parse(await fs.readFile(file, "utf-8")) as HotelRow[];
    _byPrefCache.set(pref, rows);
    return rows;
  } catch {
    _byPrefCache.set(pref, []);
    return [];
  }
}

async function loadAllHotels(): Promise<HotelRow[]> {
  if (_allCache) return _allCache;
  const all: HotelRow[] = [];
  for (const p of PREFECTURES) {
    all.push(...(await loadPrefHotels(p.name)));
  }
  _allCache = all;
  return all;
}

function json(body: unknown, status = 200) {
  return Response.json(body, { status });
}

export async function GET(request: NextRequest) {
  const sp = request.nextUrl.searchParams;
  const q = (sp.get("q") ?? "").trim();
  const pref = sp.get("pref") ?? undefined;
  const limitRaw = Number.parseInt(sp.get("limit") ?? "20", 10);
  const limit =
    Number.isFinite(limitRaw) && limitRaw > 0 && limitRaw <= 50 ? limitRaw : 20;

  const letterCount = (q.match(/\p{L}/gu) ?? []).length;
  if (letterCount < 2) {
    return json({ hotels: [] });
  }

  if (pref && !PREFECTURES.some((p) => p.name === pref)) {
    return json({ error: "invalid_pref", value: pref }, 400);
  }

  // Cross-language brand resolution: if the user typed a chain alias in English
  // ("APA", "Prince Hotel") or zh-TW ("東橫", "王子大飯店", "虹夕諾雅"), match
  // against the `brand` column directly — every row was stamped at scrape time
  // by matchHotelBrand(name_jp). Falls back to substring match when no brand
  // hits (user typed a specific property name).
  const brand = matchHotelBrand(q);
  const qLower = q.toLowerCase();

  const source = pref ? await loadPrefHotels(pref) : await loadAllHotels();
  const matches: HotelRow[] = [];
  for (const row of source) {
    if (matches.length >= limit) break;
    if (pref && row.prefecture !== pref) continue;
    if (brand) {
      if (row.brand !== brand.name) continue;
    } else {
      if (!row.name_jp || !row.name_jp.toLowerCase().includes(qLower)) continue;
    }
    matches.push(row);
  }

  return json({ hotels: matches });
}

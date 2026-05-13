// Scrape hotel master list from Rakuten Travel API into public.hotels.
//
//   GetAreaClass/20131024     → discover {region → prefecture} class codes
//   SimpleHotelSearch/20170426 → paginate hotels per prefecture
//
// Hierarchy: largeClass(japan) → middleClass(region, e.g. kanto)
//   → smallClass(prefecture, e.g. tokyo) → detailClass(city).
// We iterate at smallClass level — one call per prefecture, paginate up
// to Rakuten's 100-page × 30-hit ceiling (3000 hotels/prefecture). Very
// dense metros (Tokyo/Osaka) may truncate; warn when that happens.
//
// Rate: Rakuten allows 1 req/sec, 100k/day per app id. We use the
// polite-fetch helper's default 3-5s jitter to stay well clear.
//
// Usage:
//   npm run scrape:rakuten-hotels:dry              # parse only
//   npm run scrape:rakuten-hotels:dry -- --pref 東京都
//   npm run scrape:rakuten-hotels:dry -- --limit 3
//   npm run scrape:rakuten-hotels                  # full upsert

import { config as loadEnv } from "dotenv";
loadEnv({ path: ".env.local" });

import { politeFetch } from "./lib/polite-fetch";
import { matchHotelBrand } from "../src/lib/hotel-policies";
import { createAdminClient } from "../src/lib/supabase/admin";

// New (2025+) Rakuten Web Service host — the old app.rakuten.co.jp/services/api
// redirects/404s. Auth is applicationId (UUID) + accessKey (pk_...) as query
// params, plus a Referer header whose host is on the app's "Allowed websites".
const RAKUTEN_BASE = "https://openapi.rakuten.co.jp/engine/api";
const AREA_CLASS_URL = `${RAKUTEN_BASE}/Travel/GetAreaClass/20131024`;
const HOTEL_SEARCH_URL = `${RAKUTEN_BASE}/Travel/SimpleHotelSearch/20170426`;
const RAKUTEN_ORIGIN = "https://jpluggagego.com";
const RAKUTEN_REFERER = "https://jpluggagego.com/";
// Rakuten's openapi engine enforces a CORS-style allowlist: the app's "Allowed
// websites" must match BOTH Origin and Referer. It also filters bot-looking
// UAs upstream — a browser UA is required or we get HTTP_REFERRER_MISSING
// even when sending a valid Referer.
const RAKUTEN_UA =
  "Mozilla/5.0 (X11; Linux x86_64; JPLuggageGoBot/0.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36";

const HITS_PER_PAGE = 30; // Rakuten max
const MAX_PAGE = 100; // Rakuten max → 3000 hotels/query ceiling

interface HotelBasicInfo {
  hotelNo: number;
  hotelName: string;
  hotelKanaName?: string;
  hotelSpecial?: string;
  hotelMinCharge?: number;
  latitude?: number;
  longitude?: number;
  postalCode?: string;
  address1?: string;
  address2?: string;
  telephoneNo?: string;
  faxNo?: string;
  access?: string;
  parkingInformation?: string;
  nearestStation?: string;
  hotelImageUrl?: string;
  hotelThumbnailUrl?: string;
  roomImageUrl?: string;
  hotelMapImageUrl?: string;
  reviewCount?: number;
  reviewAverage?: number;
  userReview?: string;
  hotelInformationUrl?: string;
  hotelRoomInfoUrl?: string;
  hotelPlanListUrl?: string;
  planListUrl?: string;
  [key: string]: unknown;
}

interface HotelEntry {
  hotel: Array<{ hotelBasicInfo?: HotelBasicInfo }>;
}

interface HotelSearchResponse {
  pagingInfo?: {
    recordCount: number;
    pageCount: number;
    page: number;
    first: number;
    last: number;
  };
  hotels?: HotelEntry[];
  error?: string;
  error_description?: string;
}

interface DetailClass {
  code: string;
  name: string;
}
interface SmallClass {
  code: string;
  name: string;
  detailClasses: DetailClass[]; // optional — empty if smallClass is directly queryable
}
interface PrefectureEntry {
  middleClassCode: string; // prefecture romaji, e.g. "tokyo"
  middleClassName: string; // prefecture JP, e.g. "東京都" (or "北海道")
  smallClasses: SmallClass[]; // city-level drill-down (may nest detailClasses)
}

interface HotelRow {
  rakuten_hotel_no: number;
  name_jp: string;
  name_kana: string | null;
  prefecture: string | null;
  address1: string | null;
  address2: string | null;
  postal_code: string | null;
  phone: string | null;
  lat: number | null;
  lon: number | null;
  brand: string | null;
  brand_can_send: string | null;
  rakuten_url: string | null;
  min_charge_jpy: number | null;
  review_count: number | null;
  review_average: number | null;
  raw: HotelBasicInfo;
}

// Rakuten response arrays mix dict entries with nested wrappers — we scan for
// the first one holding `key`. Not type-safe by construction, hence the cast.
function pickEntry<K extends string>(
  arr: Array<Record<string, unknown>>,
  key: K,
): Record<string, unknown> | undefined {
  return arr.find((x) => x && typeof x === "object" && key in x);
}

async function fetchAreaClasses(
  appId: string,
  accessKey: string,
): Promise<PrefectureEntry[]> {
  const url = new URL(AREA_CLASS_URL);
  url.searchParams.set("applicationId", appId);
  url.searchParams.set("accessKey", accessKey);
  url.searchParams.set("format", "json");
  const res = await politeFetch(url.toString(), {
    delayMs: 1500,
    userAgent: RAKUTEN_UA,
    headers: {
      Referer: RAKUTEN_REFERER,
      Origin: RAKUTEN_ORIGIN,
      Accept: "application/json",
    },
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`GetAreaClass HTTP ${res.status}: ${text.slice(0, 200)}`);
  }
  const data = (await res.json()) as {
    areaClasses?: { largeClasses?: Array<{ largeClass?: unknown[] }> };
    error?: string;
    error_description?: string;
  };
  if (data.error) {
    throw new Error(
      `GetAreaClass API error: ${data.error} — ${data.error_description ?? ""}`,
    );
  }

  const prefectures: PrefectureEntry[] = [];
  const largeBlocks = data.areaClasses?.largeClasses ?? [];
  for (const largeBlock of largeBlocks) {
    const large = (largeBlock.largeClass ?? []) as Array<Record<string, unknown>>;
    const meta = pickEntry(large, "largeClassCode") as
      | { largeClassCode: string }
      | undefined;
    const middleWrap = pickEntry(large, "middleClasses") as
      | { middleClasses: Array<{ middleClass?: unknown[] }> }
      | undefined;
    if (meta?.largeClassCode !== "japan" || !middleWrap) continue;

    for (const midBlock of middleWrap.middleClasses ?? []) {
      const middle = (midBlock.middleClass ?? []) as Array<Record<string, unknown>>;
      const midMeta = pickEntry(middle, "middleClassCode") as
        | { middleClassCode: string; middleClassName: string }
        | undefined;
      if (!midMeta) continue;

      const smallWrap = pickEntry(middle, "smallClasses") as
        | { smallClasses: Array<{ smallClass?: unknown[] }> }
        | undefined;
      const smallClasses: SmallClass[] = [];
      for (const smallBlock of smallWrap?.smallClasses ?? []) {
        const small = (smallBlock.smallClass ?? []) as Array<
          Record<string, unknown>
        >;
        const smMeta = pickEntry(small, "smallClassCode") as
          | { smallClassCode: string; smallClassName: string }
          | undefined;
        if (!smMeta) continue;
        const detailWrap = pickEntry(small, "detailClasses") as
          | { detailClasses: Array<{ detailClass?: Record<string, unknown> }> }
          | undefined;
        const detailClasses: DetailClass[] = [];
        for (const detailBlock of detailWrap?.detailClasses ?? []) {
          const d = detailBlock.detailClass as
            | { detailClassCode?: string; detailClassName?: string }
            | undefined;
          if (d?.detailClassCode && d?.detailClassName) {
            detailClasses.push({ code: d.detailClassCode, name: d.detailClassName });
          }
        }
        smallClasses.push({
          code: smMeta.smallClassCode,
          name: smMeta.smallClassName,
          detailClasses,
        });
      }

      prefectures.push({
        middleClassCode: midMeta.middleClassCode,
        middleClassName: midMeta.middleClassName,
        smallClasses,
      });
    }
  }

  return prefectures;
}

async function fetchHotelsPage(
  appId: string,
  accessKey: string,
  affiliateId: string | undefined,
  middleClassCode: string,
  smallClassCode: string | undefined,
  detailClassCode: string | undefined,
  page: number,
): Promise<HotelSearchResponse> {
  const url = new URL(HOTEL_SEARCH_URL);
  url.searchParams.set("applicationId", appId);
  url.searchParams.set("accessKey", accessKey);
  if (affiliateId) url.searchParams.set("affiliateId", affiliateId);
  url.searchParams.set("format", "json");
  url.searchParams.set("largeClassCode", "japan");
  url.searchParams.set("middleClassCode", middleClassCode);
  if (smallClassCode) url.searchParams.set("smallClassCode", smallClassCode);
  if (detailClassCode) url.searchParams.set("detailClassCode", detailClassCode);
  url.searchParams.set("hits", String(HITS_PER_PAGE));
  url.searchParams.set("page", String(page));

  const res = await politeFetch(url.toString(), {
    delayMs: 1500,
    userAgent: RAKUTEN_UA,
    headers: {
      Referer: RAKUTEN_REFERER,
      Origin: RAKUTEN_ORIGIN,
      Accept: "application/json",
    },
  });
  if (!res.ok) {
    const text = await res.text();
    // Rakuten returns 404 when page > pageCount — treat as "no more"
    if (res.status === 404) {
      return { pagingInfo: { recordCount: 0, pageCount: 0, page, first: 0, last: 0 }, hotels: [] };
    }
    throw new Error(
      `SimpleHotelSearch HTTP ${res.status}: ${text.slice(0, 200)}`,
    );
  }
  return (await res.json()) as HotelSearchResponse;
}

function toRow(info: HotelBasicInfo): HotelRow {
  const brand = matchHotelBrand(info.hotelName);
  return {
    rakuten_hotel_no: info.hotelNo,
    name_jp: info.hotelName,
    name_kana: info.hotelKanaName ?? null,
    prefecture: info.address1 ?? null,
    address1: info.address1 ?? null,
    address2: info.address2 ?? null,
    postal_code: info.postalCode ?? null,
    phone: info.telephoneNo ?? null,
    // Rakuten Travel API returns coords in arc-seconds (秒, JGD2011).
    // Convert to decimal degrees (WGS84-compatible to ~0.00001° in JP).
    lat:
      typeof info.latitude === "number" && Number.isFinite(info.latitude)
        ? info.latitude / 3600
        : null,
    lon:
      typeof info.longitude === "number" && Number.isFinite(info.longitude)
        ? info.longitude / 3600
        : null,
    brand: brand?.name ?? null,
    brand_can_send: brand?.canSend ?? null,
    rakuten_url: info.hotelInformationUrl ?? null,
    min_charge_jpy:
      typeof info.hotelMinCharge === "number" ? info.hotelMinCharge : null,
    review_count:
      typeof info.reviewCount === "number" ? info.reviewCount : null,
    review_average:
      typeof info.reviewAverage === "number" ? info.reviewAverage : null,
    raw: info,
  };
}

async function main() {
  const args = process.argv.slice(2);
  const dryRun = args.includes("--dry-run");
  const limitIdx = args.indexOf("--limit");
  const limit =
    limitIdx >= 0 && args[limitIdx + 1]
      ? Number(args[limitIdx + 1])
      : undefined;
  const prefIdx = args.indexOf("--pref");
  const prefFilter =
    prefIdx >= 0 && args[prefIdx + 1] ? args[prefIdx + 1] : undefined;

  const appId = process.env.RAKUTEN_APPLICATION_ID;
  const accessKey = process.env.RAKUTEN_ACCESS_KEY;
  const affiliateId = process.env.RAKUTEN_AFFILIATE_ID || undefined;
  if (!appId || !accessKey) {
    throw new Error(
      "Missing RAKUTEN_APPLICATION_ID or RAKUTEN_ACCESS_KEY in .env.local",
    );
  }

  console.log(
    `[rakuten-hotels] ${dryRun ? "DRY RUN" : "WILL UPSERT"} limit=${limit ?? "none"} pref=${prefFilter ?? "all"}`,
  );

  console.log(`[rakuten-hotels] fetching area class hierarchy…`);
  const allPrefs = await fetchAreaClasses(appId, accessKey);
  console.log(
    `  got ${allPrefs.length} prefectures (middleClass under largeClass=japan)`,
  );

  let targets = allPrefs;
  if (prefFilter) {
    const stripSuffix = (s: string) => s.replace(/[都道府県]$/, "");
    const needle = stripSuffix(prefFilter);
    targets = allPrefs.filter(
      (a) =>
        stripSuffix(a.middleClassName) === needle ||
        a.middleClassCode === prefFilter.toLowerCase(),
    );
    if (!targets.length) {
      console.error(
        `No prefecture matches "${prefFilter}". Known:\n  ${allPrefs
          .map((a) => `${a.middleClassName}(${a.middleClassCode})`)
          .join(" / ")}`,
      );
      process.exit(1);
    }
  }
  if (limit) targets = targets.slice(0, limit);

  console.log(
    `[rakuten-hotels] iterating ${targets.length} prefecture(s):\n  ${targets
      .map((t) => t.middleClassName)
      .join(" / ")}`,
  );

  const byHotelNo = new Map<number, HotelRow>();
  const truncatedPrefs: string[] = [];

  // Scrape one (middleClass, smallClass, optional detailClass) bucket,
  // paginate to end or MAX_PAGE. Returns {added, recordCount, requiresDetail}
  // so caller can decide whether to fall back to detailClass iteration.
  async function scrapeBucket(
    middleCode: string,
    smallCode: string | undefined,
    detailCode: string | undefined,
    label: string,
  ): Promise<{
    added: number;
    recordCount: number;
    requiresDetail: boolean;
  }> {
    let page = 1;
    let added = 0;
    let recordCount = 0;
    let requiresDetail = false;
    while (page <= MAX_PAGE) {
      let resp: HotelSearchResponse;
      try {
        resp = await fetchHotelsPage(
          appId!,
          accessKey!,
          affiliateId,
          middleCode,
          smallCode,
          detailCode,
          page,
        );
      } catch (err) {
        const msg = (err as Error).message;
        if (msg.includes("specify valid detailClassCode")) {
          requiresDetail = true;
        } else {
          console.warn(`  ${label} page=${page} failed: ${msg}`);
        }
        break;
      }
      if (resp.error) {
        if (
          resp.error === "not_found" ||
          (resp.error_description ?? "").includes("結果が0件")
        ) {
          if (page === 1) console.log(`  ${label} (no hotels found)`);
          break;
        }
        console.warn(
          `  ${label} page=${page} error: ${resp.error} — ${resp.error_description ?? ""}`,
        );
        break;
      }
      const items = (resp.hotels ?? [])
        .flatMap((h) => h.hotel ?? [])
        .filter((h): h is { hotelBasicInfo: HotelBasicInfo } => !!h.hotelBasicInfo);
      for (const entry of items) {
        const prev = byHotelNo.has(entry.hotelBasicInfo.hotelNo);
        byHotelNo.set(entry.hotelBasicInfo.hotelNo, toRow(entry.hotelBasicInfo));
        if (!prev) added++;
      }
      const pageCount = resp.pagingInfo?.pageCount ?? 0;
      recordCount = resp.pagingInfo?.recordCount ?? 0;
      console.log(
        `  ${label} page=${page}/${pageCount} (records=${recordCount}, +${items.length})`,
      );
      if (page >= pageCount) break;
      page++;
    }
    return { added, recordCount, requiresDetail };
  }

  for (const pref of targets) {
    console.log(
      `\n[rakuten-hotels] ${pref.middleClassName} (${pref.middleClassCode}) — ${pref.smallClasses.length} smallClasses`,
    );
    // Rakuten SimpleHotelSearch requires smallClassCode; middle-only queries
    // return wrong_parameter. Dense urban smallClasses (e.g. 東京23区内,
    // 大阪市) additionally require detailClassCode — caught via the
    // requiresDetail flag and retried one detail at a time.
    const before = byHotelNo.size;
    for (const small of pref.smallClasses) {
      const bucket = await scrapeBucket(
        pref.middleClassCode,
        small.code,
        undefined,
        `${pref.middleClassName}/${small.name}`,
      );
      if (bucket.requiresDetail) {
        if (small.detailClasses.length === 0) {
          console.warn(
            `  ⚠ ${pref.middleClassName}/${small.name} requires detailClass but none known — skipping`,
          );
          continue;
        }
        console.log(
          `  ⤷ ${small.name} requires detailClass — iterating ${small.detailClasses.length} details`,
        );
        for (const detail of small.detailClasses) {
          await scrapeBucket(
            pref.middleClassCode,
            small.code,
            detail.code,
            `${pref.middleClassName}/${small.name}/${detail.name}`,
          );
        }
      }
      if (bucket.recordCount > MAX_PAGE * HITS_PER_PAGE) {
        truncatedPrefs.push(
          `${pref.middleClassName}/${small.name} (claimed ${bucket.recordCount} > ceiling ${MAX_PAGE * HITS_PER_PAGE})`,
        );
      }
    }
    console.log(
      `  ✓ ${pref.middleClassName}: +${byHotelNo.size - before} unique hotels`,
    );
  }

  const rows = [...byHotelNo.values()];
  console.log(`\n[rakuten-hotels] total unique hotels: ${rows.length}`);
  if (truncatedPrefs.length) {
    console.log(
      `[rakuten-hotels] ⚠ truncated (>3000, need detailClass drill-down):\n  ${truncatedPrefs.join("\n  ")}`,
    );
  }

  const branded = rows.filter((r) => r.brand).length;
  console.log(
    `  brand-matched: ${branded}/${rows.length} (${rows.length ? ((branded / rows.length) * 100).toFixed(1) : "0"}%)`,
  );

  const brandCounts = new Map<string, number>();
  for (const r of rows) {
    if (r.brand)
      brandCounts.set(r.brand, (brandCounts.get(r.brand) ?? 0) + 1);
  }
  const brandSummary = [...brandCounts.entries()].sort((a, b) => b[1] - a[1]);
  console.log(`\n[rakuten-hotels] brand breakdown (top):`);
  for (const [brand, n] of brandSummary.slice(0, 20))
    console.log(`  ${n.toString().padStart(5)}  ${brand}`);

  const prefCounts = new Map<string, number>();
  for (const r of rows) {
    if (r.prefecture)
      prefCounts.set(r.prefecture, (prefCounts.get(r.prefecture) ?? 0) + 1);
  }
  const prefSummary = [...prefCounts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([k, v]) => `${k}:${v}`)
    .join("  ");
  console.log(`\n[rakuten-hotels] top 10 prefectures:\n  ${prefSummary}`);

  console.log(`\n[rakuten-hotels] samples:`);
  for (const r of rows.slice(0, 6)) {
    console.log(
      `  ${r.rakuten_hotel_no}  ${r.prefecture ?? "-"}  ${r.name_jp} [${r.brand ?? "-"}]`,
    );
  }

  if (dryRun) {
    console.log(`\n[rakuten-hotels] DRY RUN — no DB writes.`);
    return;
  }

  const client = createAdminClient();
  const BATCH = 500;
  for (let i = 0; i < rows.length; i += BATCH) {
    const batch = rows.slice(i, i + BATCH);
    const { error } = await client
      .from("hotels")
      .upsert(batch, { onConflict: "rakuten_hotel_no" });
    if (error) {
      console.error(`upsert failed at batch ${i}: ${error.message}`);
      process.exit(1);
    }
    console.log(`  upsert ${i + batch.length}/${rows.length} ✓`);
  }
  console.log(`\n[rakuten-hotels] DONE. ${rows.length} hotels upserted.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

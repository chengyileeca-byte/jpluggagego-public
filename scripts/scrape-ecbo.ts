// Scrape ecbo cloak locations via the official sitemap.
// Source: https://cloak.ecbo.io/sitemap/locations.xml (robots.txt: Allow: /)
//
// Usage:
//   npx tsx scripts/scrape-ecbo.ts --dry-run        # print first 5, no DB write
//   npx tsx scripts/scrape-ecbo.ts                  # full run, write to Supabase
//   npx tsx scripts/scrape-ecbo.ts --limit 20       # scrape only 20 locations

import { config as loadEnv } from "dotenv";
loadEnv({ path: ".env.local" });

import { XMLParser } from "fast-xml-parser";
import { chromium, type Browser } from "playwright";
import { politeFetch, jitteredDelayMs, sleep } from "./lib/polite-fetch";
import { createAdminClient } from "../src/lib/supabase/admin";

const SITEMAP_URL = "https://cloak.ecbo.io/sitemap/locations.xml";

interface EcboLocation {
  ecbo_id: string;
  slug: string | null;
  name: string;
  address: string | null;
  prefecture: string | null;
  city: string | null;
  lat: number | null;
  lng: number | null;
  price_small_jpy: number | null;
  price_large_jpy: number | null;
  operating_hours: string | null;
  raw: Record<string, unknown>;
  source_url: string;
}

async function fetchSitemap(): Promise<string[]> {
  console.log(`[ecbo] Fetching sitemap: ${SITEMAP_URL}`);
  const res = await politeFetch(SITEMAP_URL, { respectJstPeak: false });
  if (!res.ok) throw new Error(`Sitemap fetch failed: ${res.status}`);

  const xml = await res.text();
  const parser = new XMLParser({ ignoreAttributes: false });
  const parsed = parser.parse(xml);

  const entries = parsed?.urlset?.url ?? [];
  const urls = (Array.isArray(entries) ? entries : [entries])
    .map((entry: { loc?: string }) => entry?.loc)
    .filter((loc: string | undefined): loc is string =>
      Boolean(loc && loc.includes("/locations/")),
    );

  console.log(`[ecbo] Found ${urls.length} location URLs`);
  return urls;
}

function parseIdFromUrl(url: string): { ecbo_id: string; slug: string | null } {
  // Expected patterns:
  //   https://cloak.ecbo.io/ja/locations/abc123
  //   https://cloak.ecbo.io/locations/abc123-pretty-slug
  const match = url.match(/\/locations\/([^/?#]+)/);
  if (!match) return { ecbo_id: url, slug: null };
  const raw = match[1];
  const segments = raw.split("-");
  return { ecbo_id: segments[0], slug: raw };
}

async function scrapeDetail(
  browser: Browser,
  url: string,
): Promise<EcboLocation | null> {
  const { ecbo_id, slug } = parseIdFromUrl(url);
  const page = await browser.newPage({
    userAgent:
      process.env.SCRAPER_USER_AGENT ??
      "JPLuggageGoBot/0.1 (+https://jpluggagego.com/bot)",
    extraHTTPHeaders: { "Accept-Language": "ja,en;q=0.8" },
  });

  try {
    await page.goto(url, { waitUntil: "domcontentloaded", timeout: 30_000 });

    // JSON-LD is the most robust source of structured data on ecbo pages.
    const jsonLd = await page
      .locator('script[type="application/ld+json"]')
      .allTextContents();

    let name = "";
    let address: string | null = null;
    let lat: number | null = null;
    let lng: number | null = null;
    const rawLd: unknown[] = [];

    for (const text of jsonLd) {
      try {
        const data = JSON.parse(text);
        rawLd.push(data);
        const node = Array.isArray(data) ? data[0] : data;
        if (!name && typeof node?.name === "string") name = node.name;
        if (!address) {
          const a = node?.address;
          address =
            typeof a === "string"
              ? a
              : typeof a?.streetAddress === "string"
                ? a.streetAddress
                : null;
        }
        const geo = node?.geo;
        if (geo && lat === null) {
          lat = typeof geo.latitude === "number" ? geo.latitude : parseFloat(geo.latitude) || null;
          lng = typeof geo.longitude === "number" ? geo.longitude : parseFloat(geo.longitude) || null;
        }
      } catch {
        // Skip malformed blocks.
      }
    }

    if (!name) {
      name = (await page.locator("h1").first().textContent())?.trim() ?? "(unknown)";
    }

    const bodyText = await page.locator("body").innerText();
    const priceSmall = parsePrice(bodyText, ["バッグ", "小型", "small", "Bag"]);
    const priceLarge = parsePrice(bodyText, [
      "スーツケース",
      "大型",
      "large",
      "Suitcase",
    ]);
    const hoursMatch = bodyText.match(/\d{1,2}:\d{2}\s*[〜～~\-–]\s*\d{1,2}:\d{2}/);
    const { prefecture, city } = splitAddress(address);

    return {
      ecbo_id,
      slug,
      name,
      address,
      prefecture,
      city,
      lat,
      lng,
      price_small_jpy: priceSmall,
      price_large_jpy: priceLarge,
      operating_hours: hoursMatch?.[0] ?? null,
      raw: { jsonLd: rawLd },
      source_url: url,
    };
  } catch (err) {
    console.warn(`[ecbo] fail ${url}: ${(err as Error).message}`);
    return null;
  } finally {
    await page.close();
  }
}

function parsePrice(text: string, keywords: string[]): number | null {
  for (const kw of keywords) {
    const re = new RegExp(
      `${kw}[^¥円\\d]{0,40}(?:¥|￥)?\\s*(\\d{2,3}(?:[,，]\\d{3})*|\\d+)\\s*円?`,
      "i",
    );
    const m = text.match(re);
    if (m) {
      const n = parseInt(m[1].replace(/[,，]/g, ""), 10);
      if (n >= 100 && n <= 10000) return n;
    }
  }
  return null;
}

function splitAddress(addr: string | null): {
  prefecture: string | null;
  city: string | null;
} {
  if (!addr) return { prefecture: null, city: null };
  const prefMatch = addr.match(/(東京都|北海道|(?:京都|大阪)府|.{2,3}県)/);
  const prefecture = prefMatch?.[1] ?? null;
  let city: string | null = null;
  if (prefecture) {
    const after = addr.slice(addr.indexOf(prefecture) + prefecture.length);
    const cityMatch = after.match(/^([^0-9\-〒\s]{2,10}?(?:市|区|町|村))/);
    city = cityMatch?.[1] ?? null;
  }
  return { prefecture, city };
}

async function main() {
  const args = process.argv.slice(2);
  const dryRun = args.includes("--dry-run");
  const limitIdx = args.indexOf("--limit");
  const limit = limitIdx >= 0 ? parseInt(args[limitIdx + 1], 10) : undefined;

  const urls = await fetchSitemap();
  const targets = limit ? urls.slice(0, limit) : urls;
  console.log(
    `[ecbo] Scraping ${targets.length} locations${dryRun ? " (DRY RUN)" : ""}`,
  );

  const browser = await chromium.launch({ headless: true });
  const results: EcboLocation[] = [];

  try {
    for (let i = 0; i < targets.length; i++) {
      const url = targets[i];
      console.log(`[ecbo] (${i + 1}/${targets.length}) ${url}`);
      const row = await scrapeDetail(browser, url);
      if (row) results.push(row);
      await sleep(jitteredDelayMs());
    }
  } finally {
    await browser.close();
  }

  console.log(`[ecbo] Scraped ${results.length} rows`);

  if (dryRun) {
    console.log(JSON.stringify(results.slice(0, 5), null, 2));
    return;
  }

  const supabase = createAdminClient();
  const { error } = await supabase
    .from("ecbo_locations")
    .upsert(results, { onConflict: "ecbo_id" });

  if (error) {
    console.error("[ecbo] upsert error:", error);
    process.exit(1);
  }
  console.log(`[ecbo] Upserted ${results.length} rows to Supabase.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

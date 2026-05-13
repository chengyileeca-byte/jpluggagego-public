// Quick probe: how does ecbo expose individual location URLs?
// Tries: (1) sitemap retries, (2) rendering /ja/locations via Playwright and
// inspecting outbound href patterns + network XHR.

import { chromium } from "playwright";

const UA = "JPLuggageGoBot/0.1 (+https://jpluggagego.com/bot)";

async function main() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ userAgent: UA });
  const page = await context.newPage();

  const xhrUrls: string[] = [];
  page.on("request", (req) => {
    const url = req.url();
    if (
      req.resourceType() === "xhr" ||
      req.resourceType() === "fetch" ||
      url.includes("/api/") ||
      url.includes("/graphql")
    ) {
      xhrUrls.push(`${req.method()} ${url}`);
    }
  });

  console.log("[probe] loading /ja/locations …");
  await page.goto("https://cloak.ecbo.io/ja/locations", {
    waitUntil: "networkidle",
    timeout: 45_000,
  });
  await page.waitForTimeout(2000);

  const hrefs = await page.evaluate(() => {
    const as = Array.from(document.querySelectorAll("a[href]")) as HTMLAnchorElement[];
    return as
      .map((a) => a.getAttribute("href") ?? "")
      .filter((h) => /\/locations\/[^/?#]+/.test(h));
  });

  console.log(`[probe] location-like <a> hrefs (dedupe first 10):`);
  for (const h of Array.from(new Set(hrefs)).slice(0, 10)) console.log("  ", h);

  console.log(`\n[probe] unique XHR / fetch requests (first 15):`);
  for (const x of Array.from(new Set(xhrUrls)).slice(0, 15)) console.log("  ", x);

  await browser.close();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

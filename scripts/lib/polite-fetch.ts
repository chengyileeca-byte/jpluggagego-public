// Polite HTTP fetcher compliant with 市場驗證.txt §2.8:
// custom UA, 3-5s jittered delay, JST peak avoidance, 429/503 back-off.

const DEFAULT_UA =
  process.env.SCRAPER_USER_AGENT ??
  "JPLuggageGoBot/0.1 (+https://jpluggagego.com/bot)";

export const sleep = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

export function jitteredDelayMs(minSeconds = 3, maxSeconds = 5): number {
  return (minSeconds + Math.random() * (maxSeconds - minSeconds)) * 1000;
}

export function isJstPeak(now = new Date()): boolean {
  // JST = UTC+9
  const jst = new Date(now.getTime() + 9 * 60 * 60 * 1000);
  const h = jst.getUTCHours();
  return (h >= 9 && h < 12) || (h >= 13 && h < 18);
}

export interface PoliteFetchOptions {
  userAgent?: string;
  delayMs?: number;
  maxRetries?: number;
  backoffMs?: number;
  respectJstPeak?: boolean;
  /** Extra request headers (e.g. Referer for Rakuten openapi referer-whitelist). */
  headers?: Record<string, string>;
}

export async function politeFetch(
  url: string,
  options: PoliteFetchOptions = {},
): Promise<Response> {
  const {
    userAgent = DEFAULT_UA,
    delayMs = jitteredDelayMs(),
    maxRetries = 3,
    backoffMs = 2 * 60 * 60 * 1000,
    respectJstPeak = true,
    headers: extraHeaders,
  } = options;

  if (respectJstPeak && isJstPeak()) {
    console.warn(
      `[polite-fetch] JST peak window — consider rescheduling. URL: ${url}`,
    );
  }

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    const res = await fetch(url, {
      headers: {
        "User-Agent": userAgent,
        "Accept-Language": "ja,en;q=0.8,zh-TW;q=0.6",
        ...extraHeaders,
      },
    });

    if (res.status === 429 || res.status === 503) {
      console.warn(
        `[polite-fetch] ${res.status} on ${url} — backing off ${backoffMs}ms (attempt ${attempt}/${maxRetries})`,
      );
      if (attempt === maxRetries) return res;
      await sleep(backoffMs);
      continue;
    }

    await sleep(delayMs);
    return res;
  }

  throw new Error(`[polite-fetch] exhausted retries for ${url}`);
}

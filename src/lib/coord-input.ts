import "server-only";

// Parse a hotel/place location from what Google Maps can hand the user:
//   - Raw coord pair   "35.6762, 139.6503"
//   - Long GMaps URL   ".../@35.6762,139.6503,17z/..."
//   - Long GMaps URL   ".../!3d35.6762!4d139.6503" (higher precision than @)
//   - Query URL        "?q=35.6762,139.6503" / "?ll=35.6762,139.6503"
//   - Short URL        "https://maps.app.goo.gl/XXXX" (follows redirect)
//   - Apple Maps       "https://maps.apple.com/?ll=35.6762,139.6503"
//
// Short-URL follow is SSRF-gated by a domain allowlist — we only fetch from
// Google/Apple Maps hosts, never arbitrary user input.

const SHORT_HOSTS = new Set([
  "maps.app.goo.gl",
  "goo.gl",
  "g.co",
  "maps.google.com",
  "maps.google.co.jp",
  "www.google.com",
  "www.google.co.jp",
  "maps.apple.com",
]);

// Japan bounding box — south Okinawa (~20°N) to north Hokkaido (~46°N),
// west Yonaguni (~122°E) to east Minami-Tori (~154°E). Small slack.
function inJapan(lat: number, lon: number): boolean {
  return lat >= 20 && lat <= 46 && lon >= 122 && lon <= 154;
}

// Extract first lat/lon from known GMaps URL patterns. Prefers !4d (precise
// place coordinate) over @ (map center — can differ from the pin).
function extractFromUrl(url: string): { lat: number; lon: number } | null {
  // !3d<lat>!4d<lon> — place-level precision
  const bang = url.match(/!3d(-?\d+\.\d+)!4d(-?\d+\.\d+)/);
  if (bang) {
    const lat = Number(bang[1]);
    const lon = Number(bang[2]);
    if (inJapan(lat, lon)) return { lat, lon };
  }
  // @<lat>,<lon>[,zoom]
  const at = url.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
  if (at) {
    const lat = Number(at[1]);
    const lon = Number(at[2]);
    if (inJapan(lat, lon)) return { lat, lon };
  }
  // ?q=lat,lon or ?ll=lat,lon or ?query=lat,lon
  try {
    const u = new URL(url);
    for (const key of ["q", "ll", "query", "destination"]) {
      const v = u.searchParams.get(key);
      if (!v) continue;
      const m = v.match(/^(-?\d+\.\d+)\s*,\s*(-?\d+\.\d+)$/);
      if (!m) continue;
      const lat = Number(m[1]);
      const lon = Number(m[2]);
      if (inJapan(lat, lon)) return { lat, lon };
    }
  } catch {
    // not a valid URL — caller will try coord-only parse next
  }
  return null;
}

function extractCoordPair(s: string): { lat: number; lon: number } | null {
  const m = s.match(/^\s*(-?\d{1,3}(?:\.\d+)?)\s*[,\s]\s*(-?\d{1,3}(?:\.\d+)?)\s*$/);
  if (!m) return null;
  const lat = Number(m[1]);
  const lon = Number(m[2]);
  if (!Number.isFinite(lat) || !Number.isFinite(lon)) return null;
  if (!inJapan(lat, lon)) return null;
  return { lat, lon };
}

async function followShortUrl(url: string): Promise<string | null> {
  let host: string;
  try {
    host = new URL(url).hostname;
  } catch {
    return null;
  }
  if (!SHORT_HOSTS.has(host)) return null;
  try {
    // HEAD often returns the redirect Location without fetching body. Some
    // Google endpoints 200 on HEAD with JS redirect — we then GET a small
    // slice and regex out the canonical URL from the HTML.
    const res = await fetch(url, {
      method: "GET",
      redirect: "follow",
      headers: {
        "User-Agent":
          "Mozilla/5.0 (compatible; jpluggagego/1.0; +https://jpluggagego.com)",
      },
      signal: AbortSignal.timeout(8_000),
    });
    // After redirect, `res.url` is the final landing URL.
    if (res.url && res.url !== url) return res.url;
    // Fallback: scrape canonical URL from HTML body.
    const html = (await res.text()).slice(0, 20_000);
    const m = html.match(/https?:\/\/(?:www\.)?google\.(?:com|co\.jp)\/maps[^"'<> ]+/);
    return m ? m[0] : null;
  } catch {
    return null;
  }
}

export interface CoordResolveResult {
  lat: number;
  lon: number;
  source: "pair" | "url" | "short-url";
}

export async function resolveCoordInput(
  raw: string,
): Promise<CoordResolveResult | null> {
  const s = raw.trim();
  if (!s) return null;

  // Bare coord pair
  const pair = extractCoordPair(s);
  if (pair) return { ...pair, source: "pair" };

  // URL — either extract directly or resolve short URL first
  if (/^https?:\/\//i.test(s)) {
    const direct = extractFromUrl(s);
    if (direct) return { ...direct, source: "url" };
    const long = await followShortUrl(s);
    if (long) {
      const via = extractFromUrl(long);
      if (via) return { ...via, source: "short-url" };
    }
  }

  return null;
}

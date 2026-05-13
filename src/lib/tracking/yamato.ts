import "server-only";

/**
 * Yamato 宅急便 status lookup via the public 伝票照会 endpoint.
 * POST to https://toi.kuronekoyamato.co.jp/cgi-bin/tneko with
 * number00=1&number01=<no>, scrape HTML.
 *
 * HTML structure observed against live site (2026-04):
 *   <div class="parts-tracking-invoice-block">
 *     <h3 class="tracking-invoice-block-title">1件目：9999-9999-9999</h3>
 *     <div class="tracking-invoice-block-state [is-urgent-red]">
 *       <h4 class="tracking-invoice-block-state-title">配達完了</h4>
 *       <div class="tracking-invoice-block-state-summary">...</div>
 *     </div>
 *     <!-- success rows presumably include a detail/history section
 *          with dates; we do a best-effort YYYY/MM/DD sweep. -->
 *   </div>
 *
 * Not-found signal: state-title = "伝票番号誤り" (container gets
 * is-urgent-red class). We match on the title text since the class
 * list ordering isn't stable.
 */

import { detectTracking, type TrackingResult } from "./detect";

const YAMATO_URL = "https://toi.kuronekoyamato.co.jp/cgi-bin/tneko";

const YAMATO_TERMINAL = new Set([
  "配達完了",
  "返送完了",
  "持戻",
  "返品",
]);

const YAMATO_NOT_FOUND_TITLES = new Set([
  "伝票番号誤り",
]);

const STATE_TITLE_RE =
  /<h4[^>]*class="[^"]*tracking-invoice-block-state-title[^"]*"[^>]*>\s*([^<]+?)\s*<\/h4>/;

const DATETIME_RE = /(\d{4})\/(\d{1,2})\/(\d{1,2})(?:\s+(\d{1,2}):(\d{2}))?/;

function parseYamatoDatetime(html: string): Date | null {
  const m = html.replace(/\u3000/g, " ").match(DATETIME_RE);
  if (!m) return null;
  const [, y, mo, d, h, mi] = m;
  const iso = `${y}-${mo.padStart(2, "0")}-${d.padStart(2, "0")}T${(h ?? "00").padStart(2, "0")}:${(mi ?? "00").padStart(2, "0")}:00+09:00`;
  const dt = new Date(iso);
  return Number.isNaN(dt.getTime()) ? null : dt;
}

export async function fetchYamatoStatus(
  tracking_no: string,
): Promise<TrackingResult | null> {
  const detected = detectTracking(tracking_no);
  if (!detected || detected.carrier !== "yamato") return null;

  const body = new URLSearchParams();
  body.set("number00", "1");
  body.set("number01", detected.tracking_no);

  const res = await fetch(YAMATO_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      "User-Agent":
        process.env.SCRAPER_USER_AGENT ??
        "JPLuggageGoBot/0.1 (+https://jpluggagego.com/bot)",
      Accept: "text/html,application/xhtml+xml",
    },
    body: body.toString(),
    signal: AbortSignal.timeout(15000),
  });
  if (!res.ok) {
    return { status: "", statusAt: null, terminal: false, notFound: false };
  }

  const html = await res.text();

  const m = html.match(STATE_TITLE_RE);
  if (!m) {
    return { status: "", statusAt: null, terminal: false, notFound: false };
  }
  const status = m[1].replace(/\s+/g, "");

  if (YAMATO_NOT_FOUND_TITLES.has(status)) {
    return { status: "", statusAt: null, terminal: false, notFound: true };
  }

  // Best-effort: scan the invoice block for the first YYYY/MM/DD
  // date. Missing is acceptable — the cron job uses last_checked_at
  // as its primary timing source.
  const blockStart = html.indexOf("parts-tracking-invoice-block");
  const blockSlice = blockStart >= 0 ? html.slice(blockStart) : html;
  const statusAt = parseYamatoDatetime(blockSlice);

  return {
    status,
    statusAt,
    terminal: YAMATO_TERMINAL.has(status),
    notFound: false,
  };
}

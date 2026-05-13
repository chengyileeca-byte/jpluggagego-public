import "server-only";

/**
 * ゆうパック (日本郵便) status lookup via public 追跡サービス
 * GET https://trackings.post.japanpost.jp/services/srv/search/direct
 *     ?reqCodeNo1=<no>&locale=ja
 *
 * HTML structure observed (2026-04):
 *   <table class="tableType01 ..." summary="照会結果">
 *     <tr>
 *       <th ...>お問い合わせ番号</th>
 *       <th ...>商品種別</th>
 *       <th ...>最新年月日</th>
 *       <th ...>最新状態</th>
 *       <th ...>最新取扱局</th>
 *       <th ...>県名等</th>
 *     </tr>
 *     <tr><th ...>郵便番号</th></tr>
 *     <tr>
 *       <td>TRACKING</td>
 *       <td>ゆうパック</td>
 *       <td>2026/04/15</td>
 *       <td>お届け済み</td>
 *       <td>xxx支店</td>
 *       <td>京都府</td>
 *     </tr>
 *     <tr><td>601-0000</td></tr>
 *   </table>
 *
 * Not-found: a single data row with colspan="5" carrying
 *   "お問い合わせ番号が見つかりません".
 */

import { detectTracking, type TrackingResult } from "./detect";

const YUU_URL = "https://trackings.post.japanpost.jp/services/srv/search/direct";

const YUU_TERMINAL = new Set([
  "お届け済み",
  "配達完了",
  "あて所にたずねあたりません",
  "返戻",
]);

const YUU_NOT_FOUND_HINTS = [
  "お問い合わせ番号が見つかりません",
  "お問い合わせ番号の桁数",
];

const RESULT_TABLE_RE =
  /<table[^>]*summary="照会結果"[^>]*>([\s\S]*?)<\/table>/;

// Capture each <tr>...</tr> block inside the result table.
const TR_RE = /<tr[^>]*>([\s\S]*?)<\/tr>/g;

// Extract <td>...</td> sequentially (ignores <th> rows).
const TD_RE = /<td[^>]*>([\s\S]*?)<\/td>/g;

const DATETIME_RE = /(\d{4})\/(\d{1,2})\/(\d{1,2})(?:\s+(\d{1,2}):(\d{2}))?/;

function stripTags(s: string): string {
  return s.replace(/<[^>]+>/g, "").replace(/\s+/g, "").trim();
}

function parseYuuDatetime(raw: string): Date | null {
  const m = raw.replace(/\u3000/g, " ").match(DATETIME_RE);
  if (!m) return null;
  const [, y, mo, d, h, mi] = m;
  const iso = `${y}-${mo.padStart(2, "0")}-${d.padStart(2, "0")}T${(h ?? "00").padStart(2, "0")}:${(mi ?? "00").padStart(2, "0")}:00+09:00`;
  const dt = new Date(iso);
  return Number.isNaN(dt.getTime()) ? null : dt;
}

export async function fetchYuuStatus(
  tracking_no: string,
): Promise<TrackingResult | null> {
  const detected = detectTracking(tracking_no);
  if (!detected || detected.carrier !== "yuu") return null;

  const url = `${YUU_URL}?reqCodeNo1=${encodeURIComponent(detected.tracking_no)}&locale=ja`;
  const res = await fetch(url, {
    headers: {
      "User-Agent":
        process.env.SCRAPER_USER_AGENT ??
        "JPLuggageGoBot/0.1 (+https://jpluggagego.com/bot)",
      Accept: "text/html,application/xhtml+xml",
    },
    signal: AbortSignal.timeout(15000),
  });
  if (!res.ok) {
    return { status: "", statusAt: null, terminal: false, notFound: false };
  }

  const html = await res.text();

  if (YUU_NOT_FOUND_HINTS.some((h) => html.includes(h))) {
    return { status: "", statusAt: null, terminal: false, notFound: true };
  }

  const tableMatch = html.match(RESULT_TABLE_RE);
  if (!tableMatch) {
    return { status: "", statusAt: null, terminal: false, notFound: false };
  }
  const tableInner = tableMatch[1];

  // Walk <tr>s and keep the first one whose <td>s include index 3
  // (最新状態). Header rows use <th> and yield zero tds — they're
  // filtered out naturally.
  TR_RE.lastIndex = 0;
  let statusCell = "";
  let dateCell = "";
  let tr: RegExpExecArray | null;
  while ((tr = TR_RE.exec(tableInner)) !== null) {
    TD_RE.lastIndex = 0;
    const tds: string[] = [];
    let td: RegExpExecArray | null;
    while ((td = TD_RE.exec(tr[1])) !== null) {
      tds.push(td[1]);
    }
    if (tds.length >= 4) {
      dateCell = stripTags(tds[2]);
      statusCell = stripTags(tds[3]);
      break;
    }
  }

  if (!statusCell) {
    return { status: "", statusAt: null, terminal: false, notFound: false };
  }

  return {
    status: statusCell,
    statusAt: parseYuuDatetime(dateCell),
    terminal: YUU_TERMINAL.has(statusCell),
    notFound: false,
  };
}

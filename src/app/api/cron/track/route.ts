import { type NextRequest } from "next/server";
import { timingSafeEqual } from "node:crypto";
import { createAdminClient } from "@/lib/supabase/admin";
import { fetchStatus, formatYamatoDisplay, type Carrier } from "@/lib/tracking";
import { pushLine } from "@/lib/line-push";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

// Soft caps. The real batch size is driven by scheduler frequency
// (30min) × per-run capacity. 100 rows × ~3s each at concurrency 3 =
// ~100s worst-case — well under Vercel Hobby's 10s sync limit would
// be a problem, so we cap tighter.
const MAX_ROWS = 50;
const CONCURRENCY = 3;
const NOT_FOUND_STOP_AT = 3;
const POLL_AGE_MIN = 30; // re-check no sooner than this many minutes

interface ShipmentRow {
  id: number;
  line_user_id: string;
  carrier: Carrier;
  tracking_no: string;
  last_status: string | null;
  not_found_count: number;
}

function bearerMatch(header: string | null, expected: string): boolean {
  if (!header || !expected) return false;
  const prefix = "Bearer ";
  if (!header.startsWith(prefix)) return false;
  const got = Buffer.from(header.slice(prefix.length));
  const want = Buffer.from(expected);
  if (got.length !== want.length) return false;
  return timingSafeEqual(got, want);
}

function displayNo(row: ShipmentRow): string {
  return row.carrier === "yamato"
    ? formatYamatoDisplay(row.tracking_no)
    : row.tracking_no;
}

function carrierLabel(carrier: Carrier): string {
  return carrier === "yamato" ? "Yamato 黒猫" : "ゆうパック";
}

async function processRow(
  row: ShipmentRow,
  sb: ReturnType<typeof createAdminClient>,
): Promise<"pushed" | "unchanged" | "stopped" | "error"> {
  const nowIso = new Date().toISOString();
  const result = await fetchStatus(row.carrier, row.tracking_no).catch(
    () => null,
  );
  if (!result) {
    // Network/parse failure — bump last_checked_at so we don't retry
    // instantly but don't escalate. A single parser break shouldn't
    // kill the shipment.
    await sb
      .from("shipments")
      .update({ last_checked_at: nowIso })
      .eq("id", row.id);
    return "error";
  }

  // notFound: bump the counter, stop at threshold.
  if (result.notFound) {
    const newCount = row.not_found_count + 1;
    if (newCount >= NOT_FOUND_STOP_AT) {
      await sb
        .from("shipments")
        .update({
          not_found_count: newCount,
          last_checked_at: nowIso,
          stopped: true,
          stopped_reason: "invalid",
        })
        .eq("id", row.id);
      await pushLine(
        row.line_user_id,
        `追蹤停止:${carrierLabel(row.carrier)} ${displayNo(row)}\n查無資料 × ${NOT_FOUND_STOP_AT} 次 — 單號可能有誤,或尚未交寄給運送公司。\n若確認單號無誤,請於實際交寄後重新發送。`,
      );
      return "stopped";
    }
    await sb
      .from("shipments")
      .update({ not_found_count: newCount, last_checked_at: nowIso })
      .eq("id", row.id);
    return "unchanged";
  }

  // Known status.
  const statusChanged = !!result.status && result.status !== row.last_status;

  const patch: Record<string, unknown> = { last_checked_at: nowIso };
  if (result.status) patch.last_status = result.status;
  if (result.statusAt) patch.last_status_at = result.statusAt.toISOString();
  // Reset not_found counter if we got a real status back (the package
  // finally showed up after the user mis-guessed for a run or two).
  if (row.not_found_count > 0) patch.not_found_count = 0;

  if (result.terminal) {
    patch.stopped = true;
    patch.stopped_reason = "terminal";
  }

  await sb.from("shipments").update(patch).eq("id", row.id);

  if (statusChanged) {
    const suffix = result.terminal ? "\n(已送達,停止追蹤)" : "";
    await pushLine(
      row.line_user_id,
      `📦 ${carrierLabel(row.carrier)} ${displayNo(row)}\n狀態更新:${result.status}${suffix}`,
    );
    return result.terminal ? "stopped" : "pushed";
  }
  return "unchanged";
}

async function runWithConcurrency<T, R>(
  items: T[],
  limit: number,
  fn: (item: T) => Promise<R>,
): Promise<R[]> {
  const results: R[] = [];
  let i = 0;
  const workers = Array.from({ length: Math.min(limit, items.length) }, async () => {
    while (i < items.length) {
      const idx = i++;
      results[idx] = await fn(items[idx]);
    }
  });
  await Promise.all(workers);
  return results;
}

export async function POST(request: NextRequest) {
  const expected = process.env.CRON_SECRET;
  if (!expected) {
    return Response.json({ error: "CRON_SECRET unset" }, { status: 500 });
  }
  if (!bearerMatch(request.headers.get("authorization"), expected)) {
    return Response.json({ error: "unauthorized" }, { status: 401 });
  }

  const sb = createAdminClient();
  const cutoff = new Date(Date.now() - POLL_AGE_MIN * 60_000).toISOString();

  // due = stopped=false AND (last_checked_at IS NULL OR < cutoff).
  // PostgREST lets us do the null-or-older comparison via .or().
  const { data, error } = await sb
    .from("shipments")
    .select("id, line_user_id, carrier, tracking_no, last_status, not_found_count")
    .eq("stopped", false)
    .or(`last_checked_at.is.null,last_checked_at.lt.${cutoff}`)
    .order("last_checked_at", { ascending: true, nullsFirst: true })
    .limit(MAX_ROWS);

  if (error) {
    console.error("[cron/track] query failed", error);
    return Response.json({ error: "query_failed" }, { status: 500 });
  }

  const rows = (data ?? []) as ShipmentRow[];
  if (rows.length === 0) {
    return Response.json({ due: 0, processed: 0 });
  }

  const outcomes = await runWithConcurrency(rows, CONCURRENCY, (row) =>
    processRow(row, sb),
  );

  const summary = outcomes.reduce<Record<string, number>>((acc, o) => {
    acc[o] = (acc[o] ?? 0) + 1;
    return acc;
  }, {});

  return Response.json({ due: rows.length, processed: outcomes.length, ...summary });
}

// Allow GET so the GitHub Actions curl works without --data. The body
// is empty either way; just flip the handler.
export const GET = POST;

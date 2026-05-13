import "server-only";
import { createAdminClient } from "@/lib/supabase/admin";
import type { Capability } from "@/lib/hotel-policies";

// 服務端 helpers for public.hotel_chain_reports.
//
// RLS 已鎖死(anon/authed 都不可讀寫),所以這裡必定用 service role。
// 聚合時**不要**回傳 line_user_id 或 display_name,以免頁面洩個資。

export type ReportField = "can_receive" | "can_send" | "pre_checkin_hold";

export interface ReportCounts {
  yes: number;
  "case-by-case": number;
  check: number;
}

export interface ChainAggregate {
  can_receive: ReportCounts;
  can_send: ReportCounts;
  pre_checkin_hold: ReportCounts;
}

export interface UserReportEntry {
  chain_code: string;
  field: ReportField;
  value: Capability;
  note: string | null;
  updated_at: string;
}

function emptyCounts(): ReportCounts {
  return { yes: 0, "case-by-case": 0, check: 0 };
}

function emptyAggregate(): ChainAggregate {
  return {
    can_receive: emptyCounts(),
    can_send: emptyCounts(),
    pre_checkin_hold: emptyCounts(),
  };
}

// 撈全部回報,在 server 端聚合回 Map<chain_code, ChainAggregate>。
// 16 家 × 3 欄 × 3 值 = 最多 144 個 counter,規模小,全量 fetch 足夠。
// 真的爆量了再換 SQL GROUP BY view。
export async function listChainAggregates(): Promise<
  Map<string, ChainAggregate>
> {
  const sb = createAdminClient();
  const { data, error } = await sb
    .from("hotel_chain_reports")
    .select("chain_code, field, value");
  if (error) {
    console.error("[hotel-reports] aggregate query failed", error);
    return new Map();
  }
  const out = new Map<string, ChainAggregate>();
  for (const row of (data ?? []) as {
    chain_code: string;
    field: ReportField;
    value: keyof ReportCounts;
  }[]) {
    let agg = out.get(row.chain_code);
    if (!agg) {
      agg = emptyAggregate();
      out.set(row.chain_code, agg);
    }
    agg[row.field][row.value] += 1;
  }
  return out;
}

// 某使用者已回報過的內容。key = `${chain_code}:${field}`,值 = 最新一筆。
export async function listUserReports(
  line_user_id: string,
): Promise<Map<string, UserReportEntry>> {
  const sb = createAdminClient();
  const { data, error } = await sb
    .from("hotel_chain_reports")
    .select("chain_code, field, value, note, updated_at")
    .eq("line_user_id", line_user_id);
  if (error) {
    console.error("[hotel-reports] user query failed", error);
    return new Map();
  }
  const map = new Map<string, UserReportEntry>();
  for (const row of (data ?? []) as UserReportEntry[]) {
    map.set(`${row.chain_code}:${row.field}`, row);
  }
  return map;
}

export interface UpsertReportInput {
  line_user_id: string;
  display_name: string;
  chain_code: string;
  field: ReportField;
  value: Capability;
  note?: string | null;
  branch_name?: string | null;
}

// Upsert 鎖在 (line_user_id, chain_code, field, coalesce(branch_name,'')),
// 與 unique index 一致。重複送就覆蓋舊值。
export async function upsertReport(input: UpsertReportInput): Promise<void> {
  const sb = createAdminClient();
  const { error } = await sb.from("hotel_chain_reports").upsert(
    {
      line_user_id: input.line_user_id,
      display_name: input.display_name,
      chain_code: input.chain_code,
      field: input.field,
      value: input.value,
      note: input.note ?? null,
      branch_name: input.branch_name ?? "",
    },
    {
      onConflict: "line_user_id,chain_code,field,branch_name",
      ignoreDuplicates: false,
    },
  );
  if (error) {
    console.error("[hotel-reports] upsert failed", error);
    throw new Error("upsert_failed");
  }
}

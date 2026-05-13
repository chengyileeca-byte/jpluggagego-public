import "server-only";
import { createAdminClient } from "@/lib/supabase/admin";

// UGC 通用據點回報 — 同時處理 5 種 entity。
// 隱私:不存 / 不回傳 display_name;只保留 line_user_id 用於去重與速率限制。

export const ENTITY_TYPES = [
  "yamato_branch",
  "yuu_post_office",
  "yamato_airport",
  "yuu_pack_airport",
  "hotel_chain",
  "japan_entry",
] as const;
export type EntityType = (typeof ENTITY_TYPES)[number];

// 景點型 entity(/japan/entry)的 success 不需 size/cost/wait,blocked 用景點專屬理由。
// 將來若加更多非快遞 entity,擴這個 set。
export const TOURISM_ENTITY_TYPES = new Set<EntityType>(["japan_entry"]);

export function isTourismEntity(entityType: EntityType): boolean {
  return TOURISM_ENTITY_TYPES.has(entityType);
}

export const REPORT_TYPES = ["success", "blocked", "update"] as const;
export type ReportType = (typeof REPORT_TYPES)[number];

// blocked 的結構化理由。自由文字仍能寫在 note,但聚合只看 reason code。
// 兩組:快遞 entity(寄送拒收)/ 景點 entity(現場資訊不符)。
export const REJECT_REASONS_SHIPPING = [
  "refuse_oversize", // 尺寸超限拒收
  "refuse_overweight", // 重量超限
  "refuse_content", // 內容物拒收(液體、藥品等)
  "closed", // 當天休業 / 早閉
  "queue_too_long", // 排隊太長放棄
  "machine_broken", // 機器故障 / 系統下線
  "staff_refuse", // 店員拒收且原因不明
  "other",
] as const;

export const REJECT_REASONS_TOURISM = [
  "info_wrong", // 資訊不符(時段/票價/路線)
  "closed_today", // 當天臨時休
  "construction", // 整修中 / 不開放
  "crowded_too_long", // 排隊過長放棄
  "entry_restricted", // 入場限制(年齡/服裝/預約制)
  "other",
] as const;

export const REJECT_REASONS = [
  ...REJECT_REASONS_SHIPPING,
  ...REJECT_REASONS_TOURISM,
] as const;
export type RejectReason = (typeof REJECT_REASONS)[number];

export function rejectReasonsFor(
  entityType: EntityType,
): readonly string[] {
  return isTourismEntity(entityType)
    ? REJECT_REASONS_TOURISM
    : REJECT_REASONS_SHIPPING;
}

// update 類型支援的 field。payload 形狀 { field, new_value }。
// 每 entity_type 可支援的欄位不同,由 API 層再做細節 validation。
export const UPDATE_FIELDS = [
  "address",
  "phone",
  "hours",
  "closed_permanently",
  "moved",
  "other",
] as const;
export type UpdateField = (typeof UPDATE_FIELDS)[number];

export interface SuccessPayload {
  size?: string | null; // "60" | "80" | "100" | ... or 自由
  cost_yen?: number | null;
  wait_min?: number | null;
}

export interface BlockedPayload {
  reject_reason: RejectReason;
}

export interface UpdatePayload {
  field: UpdateField;
  new_value: string;
}

export type ReportPayload = SuccessPayload | BlockedPayload | UpdatePayload;

export interface Badge {
  entity_type: EntityType;
  entity_id: string;
  success_12mo: number;
  success_6mo: number;
  blocked_12mo: number;
  last_success_at: string | null;
  last_blocked_at: string | null;
  top_reject_reasons: string[] | null;
}

export interface UpsertInput {
  line_user_id: string;
  entity_type: EntityType;
  entity_id: string;
  report_type: ReportType;
  payload: ReportPayload;
  note?: string | null;
}

export async function upsertLocationReport(input: UpsertInput): Promise<void> {
  const sb = createAdminClient();
  const row = {
    line_user_id: input.line_user_id,
    entity_type: input.entity_type,
    entity_id: input.entity_id,
    report_type: input.report_type,
    payload: input.payload,
    note: input.note ?? null,
    update_status: input.report_type === "update" ? "pending" : null,
  };
  const { error } = await sb.from("location_reports").upsert(row, {
    onConflict: "line_user_id,entity_type,entity_id,report_type",
    ignoreDuplicates: false,
  });
  if (error) {
    // P0001 = rate_limit_exceeded trigger
    if (error.code === "P0001" || error.message?.includes("rate_limit_exceeded")) {
      throw new Error("rate_limit_exceeded");
    }
    console.error("[location-reports] upsert failed", error);
    throw new Error("upsert_failed");
  }
}

// 批次取多個 entity 的徽章(給頁面一次渲染多張卡片用)。
export async function fetchBadges(
  entity_type: EntityType,
  entity_ids: string[],
): Promise<Map<string, Badge>> {
  if (entity_ids.length === 0) return new Map();
  const sb = createAdminClient();
  const { data, error } = await sb
    .from("location_report_badges")
    .select(
      "entity_type, entity_id, success_12mo, success_6mo, blocked_12mo, last_success_at, last_blocked_at, top_reject_reasons",
    )
    .eq("entity_type", entity_type)
    .in("entity_id", entity_ids);
  if (error) {
    console.error("[location-reports] fetchBadges failed", error);
    return new Map();
  }
  const m = new Map<string, Badge>();
  for (const row of (data ?? []) as Badge[]) {
    m.set(row.entity_id, row);
  }
  return m;
}

export interface PendingUpdate {
  id: number;
  entity_type: EntityType;
  entity_id: string;
  payload: UpdatePayload;
  note: string | null;
  reported_at: string;
}

// 使用者自查:列出該 line_user_id 的全部 location_reports。
// 給 /my-reports 頁用。
export interface MyReport {
  id: number;
  entity_type: EntityType;
  entity_id: string;
  report_type: ReportType;
  payload: ReportPayload;
  note: string | null;
  update_status: "pending" | "applied" | "rejected" | null;
  reported_at: string;
  applied_at: string | null;
}

export async function listMyReports(
  line_user_id: string,
  limit = 100,
): Promise<MyReport[]> {
  const sb = createAdminClient();
  const { data, error } = await sb
    .from("location_reports")
    .select(
      "id, entity_type, entity_id, report_type, payload, note, update_status, reported_at, applied_at",
    )
    .eq("line_user_id", line_user_id)
    .order("reported_at", { ascending: false })
    .limit(limit);
  if (error) {
    console.error("[location-reports] listMyReports failed", error);
    return [];
  }
  return (data ?? []) as MyReport[];
}

// 最近 success / blocked 回報(非 update),給 admin 看活動概況用。
// 不含 line_user_id(隱私),不含 update 類型(那由 listPendingUpdates 負責)。
export interface RecentReport {
  id: number;
  entity_type: EntityType;
  entity_id: string;
  report_type: "success" | "blocked";
  payload: SuccessPayload | BlockedPayload;
  reported_at: string;
}

export async function listRecentReports(
  limit = 30,
): Promise<RecentReport[]> {
  const sb = createAdminClient();
  const { data, error } = await sb
    .from("location_reports")
    .select("id, entity_type, entity_id, report_type, payload, reported_at")
    .in("report_type", ["success", "blocked"])
    .order("reported_at", { ascending: false })
    .limit(limit);
  if (error) {
    console.error("[location-reports] listRecentReports failed", error);
    return [];
  }
  return (data ?? []) as RecentReport[];
}

export async function listPendingUpdates(): Promise<PendingUpdate[]> {
  const sb = createAdminClient();
  const { data, error } = await sb
    .from("location_reports")
    .select("id, entity_type, entity_id, payload, note, reported_at")
    .eq("report_type", "update")
    .eq("update_status", "pending")
    .order("reported_at", { ascending: false })
    .limit(200);
  if (error) {
    console.error("[location-reports] listPendingUpdates failed", error);
    return [];
  }
  return (data ?? []) as PendingUpdate[];
}

export async function markUpdateApplied(id: number, admin_user_id: string): Promise<void> {
  const sb = createAdminClient();
  const { error } = await sb
    .from("location_reports")
    .update({
      update_status: "applied",
      applied_at: new Date().toISOString(),
      applied_by: admin_user_id,
    })
    .eq("id", id)
    .eq("report_type", "update");
  if (error) throw new Error("mark_applied_failed");
}

export async function markUpdateRejected(id: number, admin_user_id: string): Promise<void> {
  const sb = createAdminClient();
  const { error } = await sb
    .from("location_reports")
    .update({
      update_status: "rejected",
      applied_at: new Date().toISOString(),
      applied_by: admin_user_id,
    })
    .eq("id", id)
    .eq("report_type", "update");
  if (error) throw new Error("mark_rejected_failed");
}

// Admin 守門:用環境變數指定 LINE userId。未設定 → 完全不給進。
export function isAdmin(line_user_id: string | undefined): boolean {
  const adminId = process.env.ADMIN_LINE_USER_ID;
  if (!adminId) return false;
  return !!line_user_id && line_user_id === adminId;
}

import { type NextRequest } from "next/server";
import { getSession } from "@/lib/session";
import {
  ENTITY_TYPES,
  UPDATE_FIELDS,
  isTourismEntity,
  rejectReasonsFor,
  upsertLocationReport,
  type BlockedPayload,
  type EntityType,
  type ReportType,
  type SuccessPayload,
  type UpdatePayload,
} from "@/lib/location-reports";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

// POST /api/reports/submit
// Body: { entity_type, entity_id, report_type, payload, note? }
//
// 需 LINE Session。payload 形狀依 report_type 分岔驗證。
// reject_reason 依 entity_type 分組(快遞 / 景點),用 rejectReasonsFor 取對應集合。
// 防刷由 DB trigger 處理(7 天 5 筆)。

const ENTITY_SET = new Set<string>(ENTITY_TYPES);
const FIELD_SET = new Set<string>(UPDATE_FIELDS);

function asStr(x: unknown): string | null {
  return typeof x === "string" ? x : null;
}
function asInt(x: unknown): number | null {
  return typeof x === "number" && Number.isFinite(x) && x >= 0 ? Math.floor(x) : null;
}

export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session) {
    return Response.json({ error: "not_authenticated" }, { status: 401 });
  }

  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return Response.json({ error: "invalid_json" }, { status: 400 });
  }

  const entity_type = asStr(body.entity_type);
  const entity_id = asStr(body.entity_id);
  const report_type = asStr(body.report_type);
  const rawPayload = (body.payload ?? {}) as Record<string, unknown>;

  if (!entity_type || !ENTITY_SET.has(entity_type)) {
    return Response.json({ error: "invalid_entity_type" }, { status: 400 });
  }
  if (!entity_id || entity_id.length > 120) {
    return Response.json({ error: "invalid_entity_id" }, { status: 400 });
  }
  if (report_type !== "success" && report_type !== "blocked" && report_type !== "update") {
    return Response.json({ error: "invalid_report_type" }, { status: 400 });
  }

  const typedEntity = entity_type as EntityType;
  const tourism = isTourismEntity(typedEntity);

  let payload: SuccessPayload | BlockedPayload | UpdatePayload;
  if (report_type === "success") {
    // 景點 entity 不收 size/cost/wait — 純記「我去過,資訊正確」
    payload = tourism
      ? {}
      : {
          size: asStr(rawPayload.size)?.slice(0, 20) ?? null,
          cost_yen: asInt(rawPayload.cost_yen),
          wait_min: asInt(rawPayload.wait_min),
        };
  } else if (report_type === "blocked") {
    const reason = asStr(rawPayload.reject_reason);
    const allowed = rejectReasonsFor(typedEntity);
    if (!reason || !allowed.includes(reason)) {
      return Response.json(
        { error: "invalid_reject_reason", allowed },
        { status: 400 },
      );
    }
    payload = { reject_reason: reason as BlockedPayload["reject_reason"] };
  } else {
    const field = asStr(rawPayload.field);
    const new_value = asStr(rawPayload.new_value);
    if (!field || !FIELD_SET.has(field)) {
      return Response.json(
        { error: "invalid_update_field", allowed: UPDATE_FIELDS },
        { status: 400 },
      );
    }
    if (!new_value || new_value.length > 300) {
      return Response.json({ error: "invalid_new_value" }, { status: 400 });
    }
    payload = {
      field: field as UpdatePayload["field"],
      new_value: new_value.trim(),
    };
  }

  const note = asStr(body.note)?.trim().slice(0, 500) || null;

  try {
    await upsertLocationReport({
      line_user_id: session.userId,
      entity_type: typedEntity,
      entity_id,
      report_type: report_type as ReportType,
      payload,
      note,
    });
  } catch (err: unknown) {
    if (err instanceof Error && err.message === "rate_limit_exceeded") {
      return Response.json({ error: "rate_limit_exceeded" }, { status: 429 });
    }
    return Response.json({ error: "upsert_failed" }, { status: 500 });
  }

  return Response.json({ ok: true });
}

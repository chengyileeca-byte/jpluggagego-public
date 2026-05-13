import { type NextRequest } from "next/server";
import { getSession } from "@/lib/session";
import { upsertReport, type ReportField } from "@/lib/hotel-reports";
import { HOTEL_CHAIN_POLICIES, type Capability } from "@/lib/hotel-policies";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

// POST /api/hotel-reports
// Body: { chain_code, field, value, note?, branch_name? }
//
// 必須登入(LINE session)。upsert 鎖在
// (line_user_id, chain_code, field, branch_name='')。
// 回報內容完全不曝露 line_user_id / display_name 回前端。

const VALID_FIELDS = new Set<ReportField>([
  "can_receive",
  "can_send",
  "pre_checkin_hold",
]);
const VALID_VALUES = new Set<Capability>(["yes", "case-by-case", "check"]);
const VALID_CHAIN_CODES = new Set(HOTEL_CHAIN_POLICIES.map((p) => p.code));

interface PostBody {
  chain_code?: unknown;
  field?: unknown;
  value?: unknown;
  note?: unknown;
  branch_name?: unknown;
}

function isString(x: unknown): x is string {
  return typeof x === "string";
}

export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session) {
    return Response.json({ error: "not_authenticated" }, { status: 401 });
  }

  let body: PostBody;
  try {
    body = (await request.json()) as PostBody;
  } catch {
    return Response.json({ error: "invalid_json" }, { status: 400 });
  }

  const { chain_code, field, value } = body;
  if (!isString(chain_code) || !VALID_CHAIN_CODES.has(chain_code)) {
    return Response.json({ error: "invalid_chain_code" }, { status: 400 });
  }
  if (!isString(field) || !VALID_FIELDS.has(field as ReportField)) {
    return Response.json(
      { error: "invalid_field", allowed: [...VALID_FIELDS] },
      { status: 400 },
    );
  }
  if (!isString(value) || !VALID_VALUES.has(value as Capability)) {
    return Response.json(
      { error: "invalid_value", allowed: [...VALID_VALUES] },
      { status: 400 },
    );
  }

  // note / branch_name 是可選,限長以防惡意塞爆 DB
  const note =
    isString(body.note) && body.note.trim() ? body.note.trim().slice(0, 500) : null;
  const branch_name =
    isString(body.branch_name) && body.branch_name.trim()
      ? body.branch_name.trim().slice(0, 120)
      : "";

  try {
    await upsertReport({
      line_user_id: session.userId,
      display_name: session.displayName,
      chain_code,
      field: field as ReportField,
      value: value as Capability,
      note,
      branch_name,
    });
  } catch {
    return Response.json({ error: "upsert_failed" }, { status: 500 });
  }

  return Response.json({ ok: true });
}

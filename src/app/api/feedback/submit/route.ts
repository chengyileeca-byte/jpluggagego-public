import { type NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const FEEDBACK_KINDS = [
  "wrong-info", // 條目資訊有誤
  "branch-update", // 営業所/郵便局 資訊更新
  "hotel-update", // 飯店資訊更新
  "feature-request", // 功能建議
  "general", // 其他
] as const;
type FeedbackKind = (typeof FEEDBACK_KINDS)[number];

const KIND_LABEL_ZH: Record<FeedbackKind, string> = {
  "wrong-info": "資訊有誤",
  "branch-update": "營業所/郵便局資訊更新",
  "hotel-update": "飯店資訊更新",
  "feature-request": "功能建議",
  general: "其他",
};

interface SubmitBody {
  kind?: string;
  title?: string;
  body?: string;
  contact?: string;
  page?: string;
}

// Naive in-memory rate limit. Vercel serverless instances may share or
// reset this between cold starts; for low-volume feedback this is fine
// as a basic abuse mitigation. For higher volume swap to Vercel KV.
const RATE_LIMIT = 5; // submissions
const RATE_WINDOW_MS = 60 * 60 * 1000; // per hour
const recent: Map<string, number[]> = new Map();

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const arr = (recent.get(ip) ?? []).filter((t) => now - t < RATE_WINDOW_MS);
  if (arr.length >= RATE_LIMIT) {
    recent.set(ip, arr);
    return true;
  }
  arr.push(now);
  recent.set(ip, arr);
  return false;
}

function clientIp(req: NextRequest): string {
  const fwd = req.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0].trim();
  return req.headers.get("x-real-ip") ?? "unknown";
}

export async function POST(req: NextRequest) {
  const repo = process.env.GITHUB_FEEDBACK_REPO; // "owner/name"
  const token = process.env.GITHUB_FEEDBACK_TOKEN;
  if (!repo || !token) {
    return NextResponse.json(
      {
        error: "feedback_not_configured",
        message:
          "GITHUB_FEEDBACK_REPO + GITHUB_FEEDBACK_TOKEN env vars must be set on the server.",
      },
      { status: 503 },
    );
  }

  const ip = clientIp(req);
  if (rateLimited(ip)) {
    return NextResponse.json(
      { error: "rate_limited", message: "請稍後再試,每小時最多 5 筆" },
      { status: 429 },
    );
  }

  let body: SubmitBody;
  try {
    body = (await req.json()) as SubmitBody;
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  const kind = body.kind as FeedbackKind | undefined;
  const title = (body.title ?? "").trim();
  const text = (body.body ?? "").trim();
  const contact = (body.contact ?? "").trim().slice(0, 200);
  const page = (body.page ?? "").trim().slice(0, 500);

  if (!kind || !FEEDBACK_KINDS.includes(kind)) {
    return NextResponse.json(
      { error: "invalid_kind", allowed: FEEDBACK_KINDS },
      { status: 400 },
    );
  }
  if (title.length < 2 || title.length > 120) {
    return NextResponse.json(
      { error: "invalid_title", hint: "2–120 字" },
      { status: 400 },
    );
  }
  if (text.length < 5 || text.length > 5000) {
    return NextResponse.json(
      { error: "invalid_body", hint: "5–5000 字" },
      { status: 400 },
    );
  }

  // 防 prompt injection / markdown 越權:body 內容包進 quote block,
  // 不對 GitHub markdown 做轉義(GitHub 不執行任意 code、Issue 視窗 sandbox)。
  // backtick で囲む field (page / contact) は backtick 自体を全角 ` に置換、
  // markdown code 境界の脱出を防ぐ。
  // IP は publicly-readable な Issue body には書かない(privacy)。
  // 必要時は Vercel function logs 経由で rate-limit 解析する。
  const safeBacktick = (s: string) => s.replace(/`/g, "｀");
  const issueBody = [
    `**類型**:${KIND_LABEL_ZH[kind]} (\`${kind}\`)`,
    page ? `**來源頁面**:\`${safeBacktick(page)}\`` : null,
    contact ? `**聯絡方式**:\`${safeBacktick(contact)}\`` : null,
    "",
    "---",
    "",
    text,
  ]
    .filter((x) => x !== null)
    .join("\n");

  const ghRes = await fetch(
    `https://api.github.com/repos/${repo}/issues`,
    {
      method: "POST",
      headers: {
        Accept: "application/vnd.github+json",
        Authorization: `Bearer ${token}`,
        "X-GitHub-Api-Version": "2022-11-28",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: `[${KIND_LABEL_ZH[kind]}] ${title}`,
        body: issueBody,
        labels: ["user-feedback", `kind:${kind}`],
      }),
    },
  );

  if (!ghRes.ok) {
    const detail = await ghRes.text().catch(() => "");
    console.error("[feedback] GitHub API failed:", ghRes.status, detail);
    return NextResponse.json(
      { error: "upstream_failed", status: ghRes.status },
      { status: 502 },
    );
  }

  const issue = (await ghRes.json()) as { number: number; html_url: string };
  return NextResponse.json({
    ok: true,
    issue_number: issue.number,
    issue_url: issue.html_url,
  });
}

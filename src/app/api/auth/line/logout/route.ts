import { type NextRequest } from "next/server";
import { clearSessionCookie } from "@/lib/session";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

// POST /api/auth/line/logout?return=/quote
// Clears the session cookie and redirects back.

function safeReturn(raw: string | null): string {
  if (!raw) return "/";
  if (!raw.startsWith("/") || raw.startsWith("//")) return "/";
  return raw;
}

export async function POST(request: NextRequest) {
  await clearSessionCookie();
  const to = safeReturn(request.nextUrl.searchParams.get("return"));
  return Response.redirect(new URL(to, request.nextUrl.origin), 302);
}

export const GET = POST;

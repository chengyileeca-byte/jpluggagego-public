import { type NextRequest } from "next/server";
import { randomBytes } from "node:crypto";
import { signOAuthState } from "@/lib/session";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

// Kicks off LINE Login OAuth 2.1 flow.
//   /api/auth/line/start?return=/quote?...
// → redirects to LINE authorize, later bouncing to /callback.
//
// We stash a CSRF nonce + returnTo inside a signed state param. No
// server-side session is needed at this point — state validation is
// what the callback uses to pin the request.

const AUTHORIZE_URL = "https://access.line.me/oauth2/v2.1/authorize";

function callbackUrl(req: NextRequest): string {
  return new URL("/api/auth/line/callback", req.nextUrl.origin).toString();
}

function safeReturn(raw: string | null): string {
  // Prevent open-redirect: only allow same-origin paths. Anything
  // else falls back to the root.
  if (!raw) return "/";
  if (!raw.startsWith("/") || raw.startsWith("//")) return "/";
  return raw;
}

export async function GET(request: NextRequest) {
  const channelId = process.env.LINE_LOGIN_CHANNEL_ID;
  if (!channelId) {
    return Response.json({ error: "line_login_not_configured" }, { status: 500 });
  }

  const returnTo = safeReturn(request.nextUrl.searchParams.get("return"));
  const state = signOAuthState({
    n: randomBytes(16).toString("hex"),
    r: returnTo,
  });

  const params = new URLSearchParams({
    response_type: "code",
    client_id: channelId,
    redirect_uri: callbackUrl(request),
    state,
    scope: "profile openid",
  });

  return Response.redirect(`${AUTHORIZE_URL}?${params.toString()}`, 302);
}

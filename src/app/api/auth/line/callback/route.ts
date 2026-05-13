import { type NextRequest } from "next/server";
import { setSessionCookie, verifyOAuthState } from "@/lib/session";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const TOKEN_URL = "https://api.line.me/oauth2/v2.1/token";
const PROFILE_URL = "https://api.line.me/v2/profile";

interface TokenResponse {
  access_token: string;
  expires_in: number;
  id_token?: string;
  refresh_token?: string;
  scope: string;
  token_type: "Bearer";
}

interface ProfileResponse {
  userId: string;
  displayName: string;
  pictureUrl?: string;
}

function callbackUrl(req: NextRequest): string {
  return new URL("/api/auth/line/callback", req.nextUrl.origin).toString();
}

function safeReturn(raw: string | undefined): string {
  if (!raw) return "/";
  if (!raw.startsWith("/") || raw.startsWith("//")) return "/";
  return raw;
}

export async function GET(request: NextRequest) {
  const channelId = process.env.LINE_LOGIN_CHANNEL_ID;
  const channelSecret = process.env.LINE_LOGIN_CHANNEL_SECRET;
  if (!channelId || !channelSecret) {
    return Response.json({ error: "line_login_not_configured" }, { status: 500 });
  }

  const sp = request.nextUrl.searchParams;

  // LINE signals user-cancel via ?error=access_denied. Bounce home.
  if (sp.get("error")) {
    return Response.redirect(new URL("/", request.nextUrl.origin), 302);
  }

  const code = sp.get("code");
  const stateRaw = sp.get("state");
  const state = verifyOAuthState(stateRaw ?? undefined);
  if (!code || !state) {
    return Response.json({ error: "invalid_oauth_callback" }, { status: 400 });
  }

  const body = new URLSearchParams({
    grant_type: "authorization_code",
    code,
    redirect_uri: callbackUrl(request),
    client_id: channelId,
    client_secret: channelSecret,
  });

  const tokenRes = await fetch(TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: body.toString(),
  });
  if (!tokenRes.ok) {
    const detail = await tokenRes.text().catch(() => "");
    console.error("[line-login] token exchange failed", tokenRes.status, detail);
    return Response.json({ error: "token_exchange_failed" }, { status: 502 });
  }
  const token = (await tokenRes.json()) as TokenResponse;

  const profileRes = await fetch(PROFILE_URL, {
    headers: { Authorization: `Bearer ${token.access_token}` },
  });
  if (!profileRes.ok) {
    return Response.json({ error: "profile_fetch_failed" }, { status: 502 });
  }
  const profile = (await profileRes.json()) as ProfileResponse;

  await setSessionCookie({
    userId: profile.userId,
    displayName: profile.displayName,
    pictureUrl: profile.pictureUrl,
  });

  return Response.redirect(
    new URL(safeReturn(state.r), request.nextUrl.origin),
    302,
  );
}

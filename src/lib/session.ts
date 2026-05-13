import "server-only";
import { cookies } from "next/headers";
import { createHmac, timingSafeEqual } from "node:crypto";

// Signed cookie session for LINE Login. We don't need server-side
// storage — the whole user payload is carried in the cookie itself
// and verified with HMAC-SHA256. SESSION_SECRET is required in prod.
//
// Flow:
//   signSession(payload) -> cookie value: base64url(payload).base64url(sig)
//   verifySession(value) -> payload | null
//
// The cookie is httpOnly + sameSite=lax so it survives the OAuth
// redirect round-trip but isn't readable from JS.

const COOKIE_NAME = "session";
const MAX_AGE_SECONDS = 30 * 24 * 60 * 60; // 30 days

export interface SessionPayload {
  userId: string; // LINE userId (Uxxxxxxxx...)
  displayName: string;
  pictureUrl?: string;
  iat: number; // issued-at, unix seconds
}

function b64urlEncode(buf: Buffer): string {
  return buf.toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function b64urlDecode(s: string): Buffer {
  const padded = s.replace(/-/g, "+").replace(/_/g, "/");
  const pad = padded.length % 4 === 0 ? "" : "=".repeat(4 - (padded.length % 4));
  return Buffer.from(padded + pad, "base64");
}

function getSecret(): string {
  const s = process.env.SESSION_SECRET;
  if (!s) throw new Error("SESSION_SECRET is not set");
  return s;
}

function signPayload(body: string): string {
  return b64urlEncode(createHmac("sha256", getSecret()).update(body).digest());
}

export function signSession(payload: Omit<SessionPayload, "iat">): string {
  const full: SessionPayload = { ...payload, iat: Math.floor(Date.now() / 1000) };
  const body = b64urlEncode(Buffer.from(JSON.stringify(full), "utf8"));
  return `${body}.${signPayload(body)}`;
}

export function verifySession(value: string | undefined): SessionPayload | null {
  if (!value) return null;
  const parts = value.split(".");
  if (parts.length !== 2) return null;
  const [body, sig] = parts;
  let expected: string;
  try {
    expected = signPayload(body);
  } catch {
    return null;
  }
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
  try {
    const payload = JSON.parse(b64urlDecode(body).toString("utf8")) as SessionPayload;
    if (!payload?.userId || !payload?.displayName || !payload?.iat) return null;
    if (payload.iat + MAX_AGE_SECONDS < Math.floor(Date.now() / 1000)) return null;
    return payload;
  } catch {
    return null;
  }
}

export async function getSession(): Promise<SessionPayload | null> {
  const c = await cookies();
  return verifySession(c.get(COOKIE_NAME)?.value);
}

export async function setSessionCookie(payload: Omit<SessionPayload, "iat">): Promise<void> {
  const c = await cookies();
  c.set(COOKIE_NAME, signSession(payload), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: MAX_AGE_SECONDS,
  });
}

export async function clearSessionCookie(): Promise<void> {
  const c = await cookies();
  c.delete(COOKIE_NAME);
}

// CSRF state for OAuth round-trip. Embeds an optional returnTo so we
// can send the user back to where they clicked login. Signed the same
// way as the session cookie (cheap to reuse the HMAC helper).
export interface OAuthState {
  n: string; // random nonce
  r?: string; // returnTo path
}

export function signOAuthState(state: OAuthState): string {
  const body = b64urlEncode(Buffer.from(JSON.stringify(state), "utf8"));
  return `${body}.${signPayload(body)}`;
}

export function verifyOAuthState(value: string | undefined): OAuthState | null {
  if (!value) return null;
  const parts = value.split(".");
  if (parts.length !== 2) return null;
  const [body, sig] = parts;
  let expected: string;
  try {
    expected = signPayload(body);
  } catch {
    return null;
  }
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
  try {
    return JSON.parse(b64urlDecode(body).toString("utf8")) as OAuthState;
  } catch {
    return null;
  }
}

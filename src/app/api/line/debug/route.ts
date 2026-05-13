// Local-only debug endpoint: preview what the LINE webhook would reply to a message.
// Usage: curl 'http://localhost:3000/api/line/debug?q=NRT%20東京都%20160' | jq
// Returns 404 in production so nothing leaks.

import { type NextRequest } from "next/server";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  if (process.env.NODE_ENV === "production") {
    return new Response("not found", { status: 404 });
  }
  const q = request.nextUrl.searchParams.get("q");
  if (!q) {
    return Response.json({ usage: "?q=NRT 東京都 160 or ?q=追蹤 1234-5678-9012&user=test-uid" }, { status: 400 });
  }
  // Optional: impersonate a line user for testing the track intent.
  const userId = request.nextUrl.searchParams.get("user") ?? undefined;

  const mod = (await import("../webhook/route")) as unknown as {
    __routeMessage?: (text: string, userId?: string) => Promise<unknown>;
  };
  if (!mod.__routeMessage) {
    return Response.json({ error: "webhook not exporting __routeMessage" }, { status: 500 });
  }
  const reply = await mod.__routeMessage(q, userId);
  return Response.json({ q, reply }, { status: 200 });
}

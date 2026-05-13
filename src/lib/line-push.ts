import "server-only";

/**
 * Push a message to a specific LINE user (requires them to have added
 * the official account as a friend — `userId` comes from
 * `event.source.userId` on any prior webhook event).
 *
 * Free tier LINE Official Account: 1000 push msgs/month. Tracking
 * shipments averages <10 status-change pushes per user per trip, so
 * we'd bust the quota at ~100 active users. Worth watching.
 */
export async function pushLine(
  userId: string,
  text: string,
): Promise<{ ok: boolean; status: number; body: string }> {
  const token = process.env.LINE_CHANNEL_ACCESS_TOKEN;
  if (!token) {
    return { ok: false, status: 0, body: "LINE_CHANNEL_ACCESS_TOKEN missing" };
  }
  const res = await fetch("https://api.line.me/v2/bot/message/push", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      to: userId,
      messages: [{ type: "text", text: text.slice(0, 5000) }],
    }),
  });
  const body = res.ok ? "" : await res.text().catch(() => "");
  return { ok: res.ok, status: res.status, body };
}

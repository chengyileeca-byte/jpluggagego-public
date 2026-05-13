import { createHmac, timingSafeEqual } from "node:crypto";
import { PREFECTURES, JP_POST_PREF_ALIAS } from "@/lib/japan";
import { HOME_SIZES } from "@/lib/home-sizes";
import { yamatoAirportHours, YAMATO_NAVI_DIAL } from "@/lib/yamato-airport-hours";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import {
  detectTracking,
  fetchStatus,
  formatYamatoDisplay,
} from "@/lib/tracking";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const SITE_URL = "https://jpluggagego.com";

const KNOWN_IATAS = [
  "CTS", "SDJ", "FSZ", "NRT", "HND", "KIJ", "KMQ", "NGO",
  "ITM", "KIX", "OKJ", "HIJ", "KKJ", "FUK", "NGS", "KOJ",
] as const;
const KNOWN_IATA_SET = new Set<string>(KNOWN_IATAS);

const ZH_ALIAS: Record<string, string> = {
  "沖繩": "沖縄県",
  "沖繩縣": "沖縄県",
  "鹿兒島": "鹿児島県",
  "鹿兒島縣": "鹿児島県",
};

const PREF_PATTERNS: Array<[string, string]> = (() => {
  const list: Array<[string, string]> = [];
  for (const p of PREFECTURES) list.push([p.name, p.name]);
  for (const [short, long] of Object.entries(JP_POST_PREF_ALIAS)) {
    if (short !== long) list.push([short, long]);
  }
  for (const [zh, ja] of Object.entries(ZH_ALIAS)) list.push([zh, ja]);
  list.sort((a, b) => b[0].length - a[0].length);
  return list;
})();

// -------- LINE message types --------

type LineTextMessage = { type: "text"; text: string };
type LineFlexMessage = { type: "flex"; altText: string; contents: Record<string, unknown> };
type LineMessage = LineTextMessage | LineFlexMessage;

interface LineSource {
  type: "user" | "group" | "room";
  userId?: string;
}
interface LineTextMessageEvent {
  type: "message";
  replyToken: string;
  source: LineSource;
  message: { type: "text"; text: string };
}
interface LineFollowEvent {
  type: "follow";
  replyToken: string;
  source: LineSource;
}
type LineEvent = LineTextMessageEvent | LineFollowEvent | { type: string };

function txt(text: string): LineTextMessage {
  return { type: "text", text: text.slice(0, 5000) };
}

// -------- Signature --------

function verifySignature(secret: string, body: string, signature: string | null): boolean {
  if (!signature) return false;
  const expected = createHmac("sha256", secret).update(body).digest("base64");
  const a = Buffer.from(expected);
  const b = Buffer.from(signature);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

// -------- Fuzzy IATA / prefs --------

function damerauLev(a: string, b: string): number {
  const m = a.length;
  const n = b.length;
  const d: number[][] = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
  for (let i = 0; i <= m; i++) d[i][0] = i;
  for (let j = 0; j <= n; j++) d[0][j] = j;
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + cost);
      if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) {
        d[i][j] = Math.min(d[i][j], d[i - 2][j - 2] + 1);
      }
    }
  }
  return d[m][n];
}

function resolveIata(raw: string): string | null {
  const u = raw.toUpperCase();
  if (KNOWN_IATA_SET.has(u)) return u;
  const near: string[] = [];
  for (const k of KNOWN_IATAS) {
    if (damerauLev(u, k) <= 1) near.push(k);
  }
  return near.length === 1 ? near[0] : null;
}

function scanPrefs(text: string): string[] {
  let t = text;
  const found: string[] = [];
  for (let safety = 0; safety < 10; safety++) {
    let matched = false;
    for (const [pattern, canonical] of PREF_PATTERNS) {
      const idx = t.indexOf(pattern);
      if (idx >= 0) {
        found.push(canonical);
        t = t.slice(0, idx) + t.slice(idx + pattern.length);
        matched = true;
        break;
      }
    }
    if (!matched) break;
  }
  return found;
}

// -------- Intent parsing --------

type QuoteIntent =
  | {
      ok: true;
      fromKind: "airport" | "pref";
      fromIata: string | null;
      fromPref: string;
      toPref: string;
      size: string;
      correctedIata: string | null;
    }
  | { ok: false; hadHints: boolean; error: string };

async function parseQuoteIntent(raw: string): Promise<QuoteIntent> {
  let t = raw.replace(/[→↔⇒➔到至往から]/g, " ").trim();

  let size = "160";
  const sizeM = t.match(/(?<!\d)(60|80|100|120|140|160)(?!\d)/);
  if (sizeM && sizeM.index !== undefined) {
    size = sizeM[1];
    t = t.slice(0, sizeM.index) + " " + t.slice(sizeM.index + sizeM[1].length);
  }

  let iata: string | null = null;
  let iataRaw: string | null = null;
  const iataM = t.match(/\b([A-Za-z]{3})\b/);
  if (iataM && iataM.index !== undefined) {
    iataRaw = iataM[1].toUpperCase();
    const resolved = resolveIata(iataRaw);
    if (resolved) {
      iata = resolved;
      t = t.slice(0, iataM.index) + " " + t.slice(iataM.index + 3);
    }
  }

  const prefs = scanPrefs(t);
  const hadHints = iata !== null || iataRaw !== null || prefs.length > 0;

  if (iata) {
    if (prefs.length === 0) {
      return { ok: false, hadHints: true, error: `找到 ${iata} 但沒有送達地。例: ${iata} 東京都 160` };
    }
    const fromPref = await lookupAirportPref(iata);
    if (!fromPref) {
      return { ok: false, hadHints: true, error: `${iata} 目前沒有 Yamato 空港宅急便資料。支援: ${KNOWN_IATAS.join(" / ")}` };
    }
    return {
      ok: true,
      fromKind: "airport",
      fromIata: iata,
      fromPref,
      toPref: prefs[0],
      size,
      correctedIata: iata !== iataRaw ? iataRaw : null,
    };
  }

  if (iataRaw && prefs.length < 2) {
    return { ok: false, hadHints: true, error: `找不到機場 ${iataRaw}。支援: ${KNOWN_IATAS.join(" / ")}` };
  }

  if (prefs.length < 2) {
    if (prefs.length === 0) {
      return { ok: false, hadHints, error: "看不懂出發地/送達地。例: NRT 東京都 160 或 東京 大阪 140" };
    }
    return { ok: false, hadHints: true, error: `只找到 ${prefs[0]}。再補一個送達地 — 例: ${prefs[0]} 大阪 160` };
  }

  return {
    ok: true,
    fromKind: "pref",
    fromIata: null,
    fromPref: prefs[0],
    toPref: prefs[1],
    size,
    correctedIata: null,
  };
}

async function lookupAirportPref(iata: string): Promise<string | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("yamato_airport_counters")
    .select("prefecture")
    .eq("airport_iata", iata)
    .limit(1)
    .maybeSingle();
  return data?.prefecture ?? null;
}

// -------- Flex builders --------

function buildQuoteFlex(
  intent: Extract<QuoteIntent, { ok: true }>,
  yp: number | null,
  up: number | null,
  sizeLabel: string,
  detailUrl: string,
): LineFlexMessage {
  const diff = yp != null && up != null ? yp - up : null;
  const winner = diff == null ? null : diff < 0 ? "yamato" : diff > 0 ? "yuu" : "tie";
  const originTop = intent.fromIata
    ? `${intent.fromIata} · ${intent.fromPref}`
    : intent.fromPref;
  const altText = `${originTop} → ${intent.toPref} · Yamato ${yp != null ? "¥" + yp.toLocaleString() : "—"} / ゆう ${up != null ? "¥" + up.toLocaleString() : "—"}`;

  const priceCell = (label: string, price: number | null, isWinner: boolean) => ({
    type: "box",
    layout: "vertical",
    flex: 1,
    spacing: "xs",
    contents: [
      { type: "text", text: label, size: "xs", color: "#888888" },
      {
        type: "text",
        text: price != null ? `¥${price.toLocaleString()}` : "—",
        size: "xl",
        weight: "bold",
        color: isWinner ? "#059669" : "#111111",
      },
    ],
  });

  const headerBox = {
    type: "box",
    layout: "vertical",
    spacing: "xs",
    paddingAll: "16px",
    backgroundColor: "#f4f4f5",
    contents: [
      { type: "text", text: `📦 ${originTop}`, size: "sm", color: "#52525b" },
      { type: "text", text: `→ ${intent.toPref}`, size: "xl", weight: "bold", color: "#111111" },
      { type: "text", text: sizeLabel, size: "xs", color: "#71717a" },
      ...(intent.correctedIata
        ? [{ type: "text", text: `（已把 ${intent.correctedIata} 視為 ${intent.fromIata}）`, size: "xxs", color: "#a1a1aa" }]
        : []),
    ],
  };

  const bodyBox = {
    type: "box",
    layout: "horizontal",
    paddingAll: "16px",
    spacing: "md",
    contents: [
      priceCell("Yamato 黒猫", yp, winner === "yamato"),
      { type: "separator" },
      priceCell("ゆうパック", up, winner === "yuu"),
    ],
  };

  const diffLine =
    diff == null
      ? { type: "text", text: "(價格缺資料)", size: "sm", color: "#a1a1aa", align: "center" }
      : diff === 0
        ? { type: "text", text: "同價", size: "sm", color: "#71717a", align: "center" }
        : {
            type: "text",
            text: `${diff < 0 ? "Yamato" : "ゆう"} 省 ¥${Math.abs(diff).toLocaleString()}`,
            size: "sm",
            color: "#059669",
            weight: "bold",
            align: "center",
          };

  const footerBox = {
    type: "box",
    layout: "vertical",
    spacing: "sm",
    paddingAll: "12px",
    contents: [
      diffLine,
      {
        type: "button",
        style: "primary",
        color: "#111111",
        height: "sm",
        action: { type: "uri", label: "可發送櫃台 / 詳細", uri: detailUrl },
      },
    ],
  };

  return {
    type: "flex",
    altText,
    contents: {
      type: "bubble",
      size: "mega",
      body: {
        type: "box",
        layout: "vertical",
        spacing: "none",
        paddingAll: "0px",
        contents: [headerBox, bodyBox, { type: "separator" }, footerBox],
      },
    },
  };
}

interface CounterRow {
  airport_name_jp: string;
  terminal: string | null;
  service_type: string;
  floor: string | null;
}

function buildCountersFlex(iata: string, rows: CounterRow[]): LineFlexMessage {
  const bubbles = rows.slice(0, 12).map((c) => {
    const hrs = yamatoAirportHours(c.airport_name_jp, c.service_type);
    const phone = hrs?.phone ?? YAMATO_NAVI_DIAL;
    const title = `${c.airport_name_jp}${c.terminal ? ` ${c.terminal}` : ""}`;

    const infoRows: Array<Record<string, unknown>> = [
      { type: "text", text: c.service_type, size: "xs", color: "#f59e0b", weight: "bold" },
    ];
    if (c.floor) {
      infoRows.push({ type: "text", text: `場所: ${c.floor}`, size: "xs", color: "#52525b", wrap: true });
    }
    if (hrs) {
      infoRows.push({ type: "text", text: `受付: ${hrs.hours}`, size: "sm", color: "#111111", weight: "bold" });
      if (hrs.note) {
        infoRows.push({ type: "text", text: hrs.note, size: "xxs", color: "#71717a", wrap: true });
      }
    }

    return {
      type: "bubble",
      size: "kilo",
      header: {
        type: "box",
        layout: "vertical",
        paddingAll: "12px",
        backgroundColor: "#f4f4f5",
        contents: [
          { type: "text", text: `✈️ ${iata}`, size: "xs", color: "#71717a" },
          { type: "text", text: title, size: "md", weight: "bold", wrap: true, color: "#111111" },
        ],
      },
      body: {
        type: "box",
        layout: "vertical",
        paddingAll: "12px",
        spacing: "sm",
        contents: infoRows,
      },
      footer: {
        type: "box",
        layout: "vertical",
        paddingAll: "8px",
        spacing: "xs",
        contents: [
          {
            type: "button",
            style: "link",
            height: "sm",
            action: {
              type: "uri",
              label: `撥打 ${phone}`,
              uri: `tel:${phone.replace(/-/g, "")}`,
            },
          },
        ],
      },
    };
  });

  return {
    type: "flex",
    altText: `${iata} Yamato 空港宅急便發送櫃台 (${rows.length} 筆)`,
    contents:
      bubbles.length === 1
        ? bubbles[0]
        : { type: "carousel", contents: bubbles },
  };
}

// -------- Handlers --------

async function handleQuote(rest: string): Promise<LineMessage[]> {
  const intent = await parseQuoteIntent(rest);
  if (!intent.ok) return [txt(intent.error)];

  const supabase = await createClient();
  const [yamato, yuu] = await Promise.all([
    supabase
      .from("yamato_fares")
      .select("price_jpy")
      .eq("from_pref", intent.fromPref)
      .eq("to_pref", intent.toPref)
      .eq("size_code", intent.size)
      .maybeSingle(),
    supabase
      .from("yuu_pack_fares")
      .select("price_jpy")
      .eq("from_pref", intent.fromPref)
      .eq("to_pref", intent.toPref)
      .eq("size_code", intent.size)
      .maybeSingle(),
  ]);

  const yp = yamato.data?.price_jpy ?? null;
  const up = yuu.data?.price_jpy ?? null;
  const sizeLabel = HOME_SIZES.find((s) => s.code === intent.size)?.label ?? intent.size;

  const qs = new URLSearchParams({
    from: intent.fromIata ? `airport:${intent.fromIata}` : `pref:${intent.fromPref}`,
    to_pref: intent.toPref,
    size: intent.size,
  }).toString();
  const detailUrl = `${SITE_URL}/quote?${qs}`;

  return [buildQuoteFlex(intent, yp, up, sizeLabel, detailUrl)];
}

async function handleCounters(rest: string): Promise<LineMessage[]> {
  const m = rest.match(/\b([A-Za-z]{3})\b/);
  if (!m) {
    return [txt(`請附上機場代碼。例: 櫃台 NRT\n支援: ${KNOWN_IATAS.join(" / ")}`)];
  }
  const iata = resolveIata(m[1]);
  if (!iata) {
    return [txt(`找不到 ${m[1].toUpperCase()}。支援: ${KNOWN_IATAS.join(" / ")}`)];
  }

  const supabase = await createClient();
  const { data } = await supabase
    .from("yamato_airport_counters")
    .select("airport_name_jp, terminal, service_type, floor")
    .eq("airport_iata", iata)
    .in("service_type", ["発送", "受取・発送"])
    .order("airport_name_jp");

  if (!data || data.length === 0) {
    return [txt(`找不到 ${iata} 的 Yamato 櫃台資料。支援: ${KNOWN_IATAS.join(" / ")}`)];
  }
  return [buildCountersFlex(iata, data as CounterRow[])];
}

// -------- Track handler --------

async function handleTrack(rest: string, userId: string | undefined): Promise<LineMessage[]> {
  if (!userId) {
    // Only happens if the event came from a group/room where the bot
    // wasn't added as a friend, or the user hasn't authed yet. Tracking
    // can't push without a userId so we refuse.
    return [txt("追蹤需要你先加我為 LINE 好友(群組訊息無法推播)。")];
  }
  // Strip everything non-alphanumeric to accept e.g. "1234-5678-9012".
  const candidate = rest.replace(/[\s-]/g, "");
  if (!candidate) {
    return [txt("請附運單號。例: 追蹤 1234-5678-9012")];
  }
  const detected = detectTracking(candidate);
  if (!detected) {
    return [
      txt(
        `看不懂運單號 "${candidate.slice(0, 30)}"。\nYamato 是 12 位數字(如 1234-5678-9012),ゆうパック 是 12 碼數字或 AB123456789JP 這類國際單。`,
      ),
    ];
  }

  const sb = createAdminClient();
  const display =
    detected.carrier === "yamato"
      ? formatYamatoDisplay(detected.tracking_no)
      : detected.tracking_no;

  // Upsert — repeating the same number is a no-op ack.
  const { data: existing } = await sb
    .from("shipments")
    .select("id, last_status, stopped, stopped_reason")
    .eq("line_user_id", userId)
    .eq("tracking_no", detected.tracking_no)
    .maybeSingle();

  if (existing) {
    const lines = [
      `這張運單已在追蹤中:${display}`,
      existing.last_status ? `最新狀態:${existing.last_status}` : "(還沒有狀態更新)",
    ];
    if (existing.stopped) {
      lines.push(
        existing.stopped_reason === "terminal"
          ? "(已送達,停止追蹤)"
          : existing.stopped_reason === "invalid"
            ? "(查無資料 × 3,已停止追蹤)"
            : "(已停止追蹤)",
      );
    }
    return [txt(lines.join("\n"))];
  }

  // First-time bind: do an immediate status lookup so the user gets
  // concrete feedback, not "OK saved, will tell you later".
  const status = await fetchStatus(detected.carrier, detected.tracking_no).catch(
    () => null,
  );

  const insert = {
    line_user_id: userId,
    carrier: detected.carrier,
    tracking_no: detected.tracking_no,
    last_status: status?.status || null,
    last_status_at: status?.statusAt?.toISOString() ?? null,
    last_checked_at: new Date().toISOString(),
    not_found_count: status?.notFound ? 1 : 0,
    stopped: !!(status?.terminal || (status?.notFound && false)),
    stopped_reason: status?.terminal ? ("terminal" as const) : null,
  };

  const { error } = await sb.from("shipments").insert(insert);
  if (error) {
    console.error("shipments insert failed", error);
    return [txt("加入追蹤失敗,請稍後再試。")];
  }

  const carrierLabel = detected.carrier === "yamato" ? "Yamato 黒猫" : "ゆうパック";
  if (status?.notFound) {
    return [
      txt(
        `已加入追蹤:${carrierLabel} ${display}\n\n目前「查無資料」—— 可能是剛交寄還沒登錄(30 分鐘後再查),或打錯單號。\n連續 3 次查無會自動停止追蹤。`,
      ),
    ];
  }
  if (status?.status) {
    const statusLine = status.terminal
      ? `${status.status}(已送達,停止追蹤)`
      : status.status;
    return [txt(`已加入追蹤:${carrierLabel} ${display}\n目前狀態:${statusLine}`)];
  }
  return [txt(`已加入追蹤:${carrierLabel} ${display}\n狀態變化會推到這個 LINE。`)];
}

// -------- Routing --------

const USAGE = [
  "使用方法 (順序/空格隨便,打錯字也會盡量猜):",
  "① 比價: NRT 東京都 160",
  "   例: 東京→大阪 140 / nrt東京都 / 試算 NTR 東京都 160",
  "② 櫃台: 櫃台 NRT",
  "③ 追蹤: 追蹤 1234-5678-9012(貼單號也可)",
  "",
  "尺寸: 60 / 80 / 100 / 120 / 140 / 160 (預設 160)",
  `網頁版: ${SITE_URL}`,
].join("\n");

function stripPrefix(text: string): { cmd: "quote" | "counter" | "track" | null; rest: string } {
  const patterns: Array<[RegExp, "quote" | "counter" | "track"]> = [
    [/^(?:試算|比價|quote)\s*/i, "quote"],
    [/^(?:櫃台|counters?|カウンター)\s*/i, "counter"],
    [/^(?:追蹤|追跡|track)\s*/i, "track"],
  ];
  for (const [re, cmd] of patterns) {
    const m = text.match(re);
    if (m) return { cmd, rest: text.slice(m[0].length).trim() };
  }
  return { cmd: null, rest: text };
}

export const __routeMessage = (text: string, userId?: string) => routeMessage(text, userId);

async function routeMessage(text: string, userId: string | undefined): Promise<LineMessage[]> {
  const trimmed = text.trim();
  if (!trimmed) return [txt(USAGE)];
  if (trimmed === "help" || trimmed === "?" || trimmed === "說明" || trimmed === "使用") {
    return [txt(USAGE)];
  }

  const { cmd, rest } = stripPrefix(trimmed);
  if (cmd === "counter") return handleCounters(rest);
  if (cmd === "quote") return handleQuote(rest);
  if (cmd === "track") return handleTrack(rest, userId);

  const intent = await parseQuoteIntent(trimmed);
  if (intent.ok) return handleQuote(trimmed);

  const loneIata = trimmed.match(/^([A-Za-z]{3})$/);
  if (loneIata) {
    const resolved = resolveIata(loneIata[1]);
    if (resolved) return handleCounters(resolved);
  }

  // Bare tracking-number shape: 12 digits (optionally grouped) or
  // AB123456789JP. Match AFTER quote intent so "160" size codes and
  // pref names don't get misread as trackings.
  const bare = trimmed.replace(/[\s-]/g, "");
  if (/^\d{12}$/.test(bare) || /^[A-Za-z]{2}\d{9}[A-Za-z]{2}$/.test(bare)) {
    return handleTrack(trimmed, userId);
  }

  if (intent.hadHints) return [txt(`${intent.error}\n\n${USAGE}`)];
  return [txt(`收到: "${trimmed}"\n\n${USAGE}`)];
}

// -------- Delivery --------

async function replyToLine(replyToken: string, messages: LineMessage[], token: string) {
  const res = await fetch("https://api.line.me/v2/bot/message/reply", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ replyToken, messages: messages.slice(0, 5) }),
  });
  if (!res.ok) {
    console.error("LINE reply failed", res.status, await res.text());
  }
}

export async function POST(request: Request) {
  const secret = process.env.LINE_CHANNEL_SECRET;
  const accessToken = process.env.LINE_CHANNEL_ACCESS_TOKEN;
  if (!secret || !accessToken) {
    console.error("LINE env vars missing");
    return new Response("misconfigured", { status: 500 });
  }

  const body = await request.text();
  const signature = request.headers.get("x-line-signature");
  if (!verifySignature(secret, body, signature)) {
    return new Response("bad signature", { status: 401 });
  }

  let payload: { events?: LineEvent[] };
  try {
    payload = JSON.parse(body);
  } catch {
    return new Response("bad json", { status: 400 });
  }

  const events = payload.events ?? [];
  await Promise.all(
    events.map(async (event) => {
      try {
        if (event.type === "message") {
          const ev = event as LineTextMessageEvent;
          if (ev.message?.type !== "text") return;
          const reply = await routeMessage(ev.message.text, ev.source?.userId);
          await replyToLine(ev.replyToken, reply, accessToken);
        } else if (event.type === "follow") {
          const ev = event as LineFollowEvent;
          await replyToLine(
            ev.replyToken,
            [txt(`歡迎加入 JPLuggageGo! 日本飯店間行李寄送比價。\n\n${USAGE}`)],
            accessToken,
          );
        }
      } catch (err) {
        console.error("event handling error", err);
      }
    }),
  );

  return new Response("ok", { status: 200 });
}

// Boundary / fuzz stress on /api/hotels + /trip (GET URL parse path).
// Dev server must be on http://localhost:3000 before running.
//
// Each case declares what "OK" means: allowed HTTP statuses, and strings
// that MUST NOT leak into the response body (stack traces, file paths,
// PostgREST error codes, SQL snippets). Output table flags failures only.
//
// Usage:
//   node --env-file=.env.local node_modules/.bin/tsx scripts/stress-endpoints.ts

const BASE = process.env.STRESS_BASE ?? "http://localhost:3000";

interface Case {
  name: string;
  path: string;
  ok: number[];
  mustNotContain?: string[];
  bodyPreview?: boolean;
}

// Secrets / internals that MUST NOT end up in any client-visible response.
const LEAKS = [
  "PGRST",
  "at Object.",
  "/home/joe/",
  ".next/dev/server",
  "SUPABASE_SERVICE_ROLE",
  "service_role",
  "at async",
  "Error: relation",
  "syntax error at",
];

const HOTEL_CASES: Case[] = [
  // ---- Happy path baselines ----
  { name: "hotels/happy-jp", path: "/api/hotels?q=新宿&limit=3", ok: [200] },
  { name: "hotels/happy-brand-en", path: "/api/hotels?q=APA&limit=3", ok: [200] },
  { name: "hotels/happy-brand-zh", path: "/api/hotels?q=東橫&limit=3", ok: [200] },

  // ---- Length / silent-empty boundaries ----
  { name: "hotels/q-empty", path: "/api/hotels?q=", ok: [200] },
  { name: "hotels/q-1char", path: "/api/hotels?q=新", ok: [200] }, // <2 → []
  { name: "hotels/q-only-space", path: "/api/hotels?q=%20%20%20", ok: [200] },
  {
    name: "hotels/q-1kb",
    path: `/api/hotels?q=${encodeURIComponent("東".repeat(500))}`,
    ok: [200, 414],
  },

  // ---- ILIKE wildcard hostile input (must be escaped, not DoS GIN) ----
  { name: "hotels/q-percent", path: "/api/hotels?q=%25%25%25%25%25", ok: [200] },
  { name: "hotels/q-underscore", path: "/api/hotels?q=____", ok: [200] },
  { name: "hotels/q-backslash", path: "/api/hotels?q=%5C%5C%5C%5C", ok: [200] },

  // ---- SQL-injection shape (PostgREST should treat literally) ----
  {
    name: "hotels/q-sqli",
    path: "/api/hotels?q=" + encodeURIComponent("' OR 1=1 --"),
    ok: [200],
  },
  {
    name: "hotels/q-dbl-quote",
    path: "/api/hotels?q=" + encodeURIComponent('"); DROP TABLE hotels; --'),
    ok: [200],
  },

  // ---- PostgREST .or() separator abuse (we switched to .eq()/.ilike but verify) ----
  {
    name: "hotels/q-or-sep",
    path: "/api/hotels?q=" + encodeURIComponent("aa,bb,cc"),
    ok: [200],
  },
  {
    name: "hotels/q-paren",
    path: "/api/hotels?q=" + encodeURIComponent("(foo)(bar)"),
    ok: [200],
  },

  // ---- Unicode edges ----
  {
    name: "hotels/q-emoji",
    path: "/api/hotels?q=" + encodeURIComponent("🏨🗾🍣"),
    ok: [200],
  },
  {
    name: "hotels/q-null-byte",
    path: "/api/hotels?q=" + encodeURIComponent("新宿\x00DROP"),
    ok: [200, 400],
  },
  {
    name: "hotels/q-rtl",
    path: "/api/hotels?q=" + encodeURIComponent("العربية新宿"),
    ok: [200],
  },
  {
    name: "hotels/q-zalgo",
    path: "/api/hotels?q=" + encodeURIComponent("a̸̧̭̩͓̱̻̙̋"),
    ok: [200],
  },

  // ---- Param spoofing ----
  { name: "hotels/pref-invalid", path: "/api/hotels?q=新宿&pref=臺北市", ok: [400] },
  {
    name: "hotels/pref-sqli",
    path: "/api/hotels?q=新宿&pref=" + encodeURIComponent("東京都' OR '1'='1"),
    ok: [400],
  },
  { name: "hotels/limit-neg", path: "/api/hotels?q=新宿&limit=-5", ok: [200] },
  { name: "hotels/limit-zero", path: "/api/hotels?q=新宿&limit=0", ok: [200] },
  { name: "hotels/limit-huge", path: "/api/hotels?q=新宿&limit=99999", ok: [200] },
  { name: "hotels/limit-nan", path: "/api/hotels?q=新宿&limit=NaN", ok: [200] },
  { name: "hotels/limit-str", path: "/api/hotels?q=新宿&limit=banana", ok: [200] },
  { name: "hotels/limit-float", path: "/api/hotels?q=新宿&limit=3.7", ok: [200] },

  // ---- Repeated params (Next.js takes first, but confirm no crash) ----
  {
    name: "hotels/q-duplicate",
    path: "/api/hotels?q=新宿&q=大阪&limit=3",
    ok: [200],
  },
];

// /trip stays are URL-encoded JSON. parseStays returns null for malformed;
// page.tsx then renders an empty-form state (no plan).
function tripUrl(staysObj: unknown, extra: Record<string, string> = {}): string {
  const p = new URLSearchParams();
  p.set("stays", JSON.stringify(staysObj));
  for (const [k, v] of Object.entries(extra)) p.set(k, v);
  return `/trip?${p.toString()}`;
}

const TRIP_CASES: Case[] = [
  // ---- Happy path ----
  {
    name: "trip/happy",
    path: tripUrl([
      {
        id: "0",
        prefecture: "東京都",
        address: "",
        checkIn: "2026-05-01",
        checkOut: "2026-05-04",
        baggage: [{ size: "M", count: 1 }],
      },
      {
        id: "1",
        prefecture: "京都府",
        address: "",
        checkIn: "2026-05-04",
        checkOut: "2026-05-07",
        baggage: [],
      },
    ]),
    ok: [200],
  },

  // ---- parseStays rejection path (returns null → empty form re-render) ----
  { name: "trip/stays-not-json", path: "/trip?stays=notjson", ok: [200] },
  { name: "trip/stays-string", path: `/trip?stays=${encodeURIComponent('"hi"')}`, ok: [200] },
  { name: "trip/stays-object", path: `/trip?stays=${encodeURIComponent("{}")}`, ok: [200] },
  { name: "trip/stays-null", path: "/trip?stays=null", ok: [200] },
  { name: "trip/stays-empty-arr", path: "/trip?stays=%5B%5D", ok: [200] },

  // Malformed element
  {
    name: "trip/stays-el-null",
    path: tripUrl([null]),
    ok: [200],
  },
  {
    name: "trip/stays-no-pref-no-addr",
    path: tripUrl([
      { id: "0", prefecture: "", address: "", checkIn: "2026-05-01", checkOut: "2026-05-04" },
    ]),
    ok: [200],
  },

  // Invalid date formats
  {
    name: "trip/date-format-bad",
    path: tripUrl([
      {
        id: "0",
        prefecture: "東京都",
        address: "",
        checkIn: "May 1 2026",
        checkOut: "2026-05-04",
      },
    ]),
    ok: [200],
  },
  {
    name: "trip/date-reversed",
    path: tripUrl([
      {
        id: "0",
        prefecture: "東京都",
        address: "",
        checkIn: "2026-05-10",
        checkOut: "2026-05-01",
      },
    ]),
    ok: [200],
  },
  {
    name: "trip/date-same",
    path: tripUrl([
      {
        id: "0",
        prefecture: "東京都",
        address: "",
        checkIn: "2026-05-01",
        checkOut: "2026-05-01",
      },
    ]),
    ok: [200],
  },
  {
    name: "trip/date-feb-30",
    path: tripUrl([
      {
        id: "0",
        prefecture: "東京都",
        address: "",
        checkIn: "2026-02-30",
        checkOut: "2026-03-05",
      },
    ]),
    ok: [200],
  },

  // Prefecture spoofing
  {
    name: "trip/pref-unknown",
    path: tripUrl([
      {
        id: "0",
        prefecture: "臺北市",
        address: "",
        checkIn: "2026-05-01",
        checkOut: "2026-05-04",
      },
    ]),
    ok: [200],
  },
  {
    name: "trip/pref-injection",
    path: tripUrl([
      {
        id: "0",
        prefecture: "東京都'; DROP TABLE hotels; --",
        address: "",
        checkIn: "2026-05-01",
        checkOut: "2026-05-04",
      },
    ]),
    ok: [200],
  },

  // Baggage extremes
  {
    name: "trip/baggage-huge-count",
    path: tripUrl([
      {
        id: "0",
        prefecture: "東京都",
        address: "",
        checkIn: "2026-05-01",
        checkOut: "2026-05-04",
        baggage: [{ size: "L", count: 99999 }],
      },
      {
        id: "1",
        prefecture: "京都府",
        address: "",
        checkIn: "2026-05-04",
        checkOut: "2026-05-07",
      },
    ]),
    ok: [200],
  },
  {
    name: "trip/baggage-neg-count",
    path: tripUrl([
      {
        id: "0",
        prefecture: "東京都",
        address: "",
        checkIn: "2026-05-01",
        checkOut: "2026-05-04",
        baggage: [{ size: "L", count: -3 }],
      },
      {
        id: "1",
        prefecture: "京都府",
        address: "",
        checkIn: "2026-05-04",
        checkOut: "2026-05-07",
      },
    ]),
    ok: [200],
  },
  {
    name: "trip/baggage-bad-size",
    path: tripUrl([
      {
        id: "0",
        prefecture: "東京都",
        address: "",
        checkIn: "2026-05-01",
        checkOut: "2026-05-04",
        baggage: [{ size: "XXXL_MEGA", count: 1 }],
      },
      {
        id: "1",
        prefecture: "京都府",
        address: "",
        checkIn: "2026-05-04",
        checkOut: "2026-05-07",
      },
    ]),
    ok: [200],
  },

  // Scale
  {
    name: "trip/100-stays",
    path: tripUrl(
      Array.from({ length: 100 }, (_, i) => ({
        id: `s${i}`,
        prefecture: "東京都",
        address: "",
        checkIn: `2026-05-${String((i % 28) + 1).padStart(2, "0")}`,
        checkOut: `2026-06-${String((i % 28) + 1).padStart(2, "0")}`,
      })),
    ),
    // 431 = Node HTTP header buffer rejects before Next.js sees the URL.
    // 414 = Next.js's own URL-too-long. Both are clean rejections, no leak.
    ok: [200, 414, 431],
  },

  // Prototype pollution attempt
  {
    name: "trip/proto-pollution",
    path:
      "/trip?stays=" +
      encodeURIComponent(
        JSON.stringify([
          { __proto__: { polluted: true }, id: "0", prefecture: "東京都", checkIn: "2026-05-01", checkOut: "2026-05-04" },
        ]),
      ),
    ok: [200],
  },

  // XSS attempt in label (should be escaped by React)
  {
    name: "trip/xss-label",
    path: tripUrl([
      {
        id: "0",
        prefecture: "東京都",
        label: "<script>alert('xss')</script>",
        address: "",
        checkIn: "2026-05-01",
        checkOut: "2026-05-04",
      },
      {
        id: "1",
        prefecture: "京都府",
        address: "",
        checkIn: "2026-05-04",
        checkOut: "2026-05-07",
      },
    ]),
    ok: [200],
    mustNotContain: ["<script>alert"],
  },

  // Arrival/departure
  {
    name: "trip/arrival-bogus",
    path: tripUrl(
      [
        { id: "0", prefecture: "東京都", address: "", checkIn: "2026-05-01", checkOut: "2026-05-04" },
        { id: "1", prefecture: "京都府", address: "", checkIn: "2026-05-04", checkOut: "2026-05-07" },
      ],
      { arrival: "ZZZ" },
    ),
    ok: [200],
  },
];

async function runOne(c: Case): Promise<{
  status: number;
  bodySnip: string;
  failReasons: string[];
}> {
  const failReasons: string[] = [];
  let status = 0;
  let body = "";
  try {
    const res = await fetch(BASE + c.path, { method: "GET" });
    status = res.status;
    body = await res.text();
  } catch (err) {
    failReasons.push(`fetch-error: ${(err as Error).message}`);
    return { status, bodySnip: "", failReasons };
  }
  if (!c.ok.includes(status)) {
    failReasons.push(`status ${status} not in {${c.ok.join(",")}}`);
  }
  const leaks = [...LEAKS, ...(c.mustNotContain ?? [])].filter((s) =>
    body.includes(s),
  );
  if (leaks.length) failReasons.push(`leaks: ${leaks.join(", ")}`);
  const snip = body.slice(0, 160).replace(/\s+/g, " ");
  return { status, bodySnip: snip, failReasons };
}

async function main() {
  const all = [...HOTEL_CASES, ...TRIP_CASES];
  console.log(`[stress] running ${all.length} cases against ${BASE}\n`);
  const fails: Array<{ case: Case; status: number; reasons: string[]; snip: string }> = [];
  for (const c of all) {
    const r = await runOne(c);
    const ok = r.failReasons.length === 0;
    const tag = ok ? "✓" : "✗";
    console.log(
      `${tag} ${c.name.padEnd(32)} ${String(r.status).padStart(3)}  ${r.failReasons.join(" | ") || ""}`,
    );
    if (!ok) fails.push({ case: c, status: r.status, reasons: r.failReasons, snip: r.bodySnip });
  }

  console.log(`\n[stress] ${all.length - fails.length}/${all.length} ok`);
  if (fails.length) {
    console.log(`\n[stress] FAILING DETAIL:`);
    for (const f of fails) {
      console.log(`\n  ${f.case.name} (${f.status}) — ${f.reasons.join(" | ")}`);
      console.log(`    GET ${f.case.path.slice(0, 200)}`);
      console.log(`    body: ${f.snip}`);
    }
    process.exit(1);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

import type { NextConfig } from "next";

// Security headers — defense-in-depth。
// CSP は Next.js の inline hydration script を許容する都合で 'unsafe-inline' 必要。
// 厳格化したい場合は per-request nonce が必要(複雑性が上がるので保留)。
const SECURITY_HEADERS = [
  // Clickjacking 阻止(全 origin から iframe 拒否)。
  // CSP の frame-ancestors と冗長だが、古いブラウザ互換のため両方付ける。
  { key: "X-Frame-Options", value: "DENY" },
  // MIME sniffing 阻止(misdeclared Content-Type で XSS 化される pattern を切る)。
  { key: "X-Content-Type-Options", value: "nosniff" },
  // Referrer 漏出制限(他サイト遷移時に path / query string を渡さない)。
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // 不要な権限を明示的に拒否(camera / mic / geolocation / FLoC 等)。
  {
    key: "Permissions-Policy",
    value:
      "camera=(), microphone=(), geolocation=(), payment=(), usb=(), interest-cohort=()",
  },
  // HSTS — Vercel もデフォルトで付けるが明示化。
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  // CSP — XSS が万が一混入した場合の second-line mitigation。
  // - 'unsafe-inline' は Next.js hydration / Tailwind が必要
  // - va.vercel-scripts.com は @vercel/analytics
  // - vitals.vercel-insights.com は @vercel/speed-insights の POST 先
  // - https: img/font は OG / 外部参照画像許可
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://va.vercel-scripts.com",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: https:",
      "font-src 'self' data:",
      "connect-src 'self' https://vitals.vercel-insights.com https://va.vercel-scripts.com",
      "frame-ancestors 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "object-src 'none'",
    ].join("; "),
  },
];

// public/data 是 ~79MB の静的 JSON snapshot。Next.js NFT は variable path
// (path.join(..., encodeURIComponent(pref), "x.json")) を見ると保険で
// public/data/by-pref/* を全 include — /quote や /trip が 65MB+ で
// Vercel Hobby 限界に当たる。下記 exclude/include で per-route に絞り込む。
const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/:path*",
        headers: SECURITY_HEADERS,
      },
    ];
  },
  outputFileTracingExcludes: {
    "*": ["public/data/by-pref/**"],
  },
  outputFileTracingIncludes: {
    "/api/hotels": ["public/data/by-pref/*/hotels.json"],
    "/quote": [
      "public/data/by-pref/*/yamato_branches.json",
      "public/data/by-pref/*/yuu_post_offices.json",
    ],
    "/trip": [
      "public/data/by-pref/*/yamato_branches.json",
      "public/data/by-pref/*/yuu_post_offices.json",
    ],
  },
};

export default nextConfig;

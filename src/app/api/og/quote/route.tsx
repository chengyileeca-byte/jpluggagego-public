// Dynamic Open Graph image for /quote?from=...&to_pref=...&size=...
//
// opengraph-image.tsx file convention only receives route `params`, not
// `searchParams` — so we use a route handler and reference its URL from
// /quote's generateMetadata. Social-platform caches will fingerprint by URL,
// so each unique query string becomes its own cached card.

import { ImageResponse } from "next/og";
import type { NextRequest } from "next/server";

export const runtime = "edge";

const SIZE_LABELS: Record<string, string> = {
  "60": "60サイズ · ~2kg",
  "80": "80サイズ · ~5kg",
  "100": "100サイズ · ~10kg · 21吋",
  "120": "120サイズ · ~15kg · 24吋",
  "140": "140サイズ · ~20kg · 26吋",
  "160": "160サイズ · ~25kg · 29吋",
};

function parseFromLabel(raw: string | null): string | null {
  if (!raw) return null;
  if (raw.startsWith("airport:")) return raw.slice("airport:".length);
  if (raw.startsWith("pref:")) return raw.slice("pref:".length);
  return null;
}

export async function GET(req: NextRequest) {
  const sp = req.nextUrl.searchParams;
  const fromLabel = parseFromLabel(sp.get("from"));
  const toPref = sp.get("to_pref");
  const size = sp.get("size");
  const sizeLabel = size ? SIZE_LABELS[size] : null;

  const hasRoute = fromLabel && toPref;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "80px",
          background:
            "linear-gradient(135deg, #0a0a0a 0%, #1a1a2a 50%, #1a2a3a 100%)",
          color: "#ffffff",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            fontSize: 28,
            letterSpacing: "0.3em",
            textTransform: "uppercase",
            color: "#a1a1aa",
          }}
        >
          jpluggagego.com · 料金比價
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
          {hasRoute ? (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 32,
                fontSize: 96,
                fontWeight: 700,
                lineHeight: 1.05,
              }}
            >
              <span>{fromLabel}</span>
              <span style={{ color: "#60a5fa", fontSize: 80 }}>→</span>
              <span>{toPref}</span>
            </div>
          ) : (
            <div style={{ fontSize: 96, fontWeight: 700, lineHeight: 1.05 }}>
              JPLuggageGo
            </div>
          )}
          <div
            style={{
              fontSize: 40,
              lineHeight: 1.3,
              color: "#d4d4d8",
              display: "flex",
              gap: 24,
              flexWrap: "wrap",
            }}
          >
            {sizeLabel && (
              <span
                style={{
                  border: "1px solid #3f3f46",
                  borderRadius: 14,
                  padding: "8px 20px",
                  background: "rgba(255,255,255,0.05)",
                }}
              >
                {sizeLabel}
              </span>
            )}
            <span>Yamato 黒猫宅急便 vs 郵便局 ゆうパック</span>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            gap: 20,
            fontSize: 24,
            color: "#a1a1aa",
          }}
        >
          <div
            style={{
              border: "1px solid #3f3f46",
              borderRadius: 999,
              padding: "8px 20px",
            }}
          >
            47 都道府県
          </div>
          <div
            style={{
              border: "1px solid #3f3f46",
              borderRadius: 999,
              padding: "8px 20px",
            }}
          >
            16 空港
          </div>
          <div
            style={{
              border: "1px solid #3f3f46",
              borderRadius: 999,
              padding: "8px 20px",
              background: "#3b82f6",
              borderColor: "#3b82f6",
              color: "#ffffff",
            }}
          >
            週次更新
          </div>
        </div>
      </div>
    ),
    { width: 1200, height: 630 },
  );
}

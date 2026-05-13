import { ImageResponse } from "next/og";

export const alt =
  "JPLuggageGo — Japan luggage shipping fare comparison (Yamato vs Japan Post)";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
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
          background: "linear-gradient(135deg, #0a0a0a 0%, #1a1a2a 100%)",
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
          jpluggagego.com
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div style={{ fontSize: 96, fontWeight: 700, lineHeight: 1.05 }}>
            JPLuggageGo
          </div>
          <div
            style={{
              fontSize: 40,
              lineHeight: 1.3,
              color: "#d4d4d8",
              maxWidth: "920px",
            }}
          >
            Compare Yamato vs Japan Post luggage shipping
            across all 47 prefectures — airport to hotel, hotel to hotel.
          </div>
        </div>

        <div
          style={{
            display: "flex",
            gap: 20,
            fontSize: 24,
            color: "#71717a",
          }}
        >
          <div
            style={{
              border: "1px solid #3f3f46",
              borderRadius: 999,
              padding: "8px 20px",
            }}
          >
            Yamato 17,672 routes
          </div>
          <div
            style={{
              border: "1px solid #3f3f46",
              borderRadius: 999,
              padding: "8px 20px",
            }}
          >
            Japan Post 15,463 routes
          </div>
          <div
            style={{
              border: "1px solid #3f3f46",
              borderRadius: 999,
              padding: "8px 20px",
            }}
          >
            16 airports
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}

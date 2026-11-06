import { ImageResponse } from "next/og"

export const runtime = "edge"
export const alt = "ClicKonversion — More Visibility. Better Leads. Smarter Growth."
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "#010E25",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          fontFamily: "sans-serif",
        }}
      >
        {/* Logo top-left */}
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div
            style={{
              width: 52,
              height: 52,
              background: "#FE5C02",
              borderRadius: 14,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <span style={{ color: "#fff", fontWeight: 800, fontSize: 28, letterSpacing: "-1px" }}>CK</span>
          </div>
          <span style={{ color: "#FFF8F0", fontWeight: 600, fontSize: 26, letterSpacing: "-0.02em" }}>ClicKonversion</span>
        </div>

        {/* Main text */}
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <span style={{ background: "#D6EBFF", color: "#010E25", fontSize: 15, fontWeight: 600, padding: "6px 14px", borderRadius: 8 }}>[SEO]</span>
            <span style={{ background: "#FFDCC7", color: "#010E25", fontSize: 15, fontWeight: 600, padding: "6px 14px", borderRadius: 8 }}>[ADS]</span>
            <span style={{ background: "#E4DEFF", color: "#010E25", fontSize: 15, fontWeight: 600, padding: "6px 14px", borderRadius: 8 }}>[IA]</span>
            <span style={{ background: "#D3F2E3", color: "#010E25", fontSize: 15, fontWeight: 600, padding: "6px 14px", borderRadius: 8 }}>[WHATSAPP]</span>
          </div>
          <div
            style={{
              fontSize: 68,
              fontWeight: 800,
              color: "#FFF8F0",
              lineHeight: 1.0,
              letterSpacing: "-0.03em",
            }}
          >
            More Visibility.{"\n"}
            <span style={{ color: "#FE5C02" }}>Better Leads.</span>
          </div>
          <p style={{ fontSize: 26, color: "rgba(255,248,240,0.72)", fontWeight: 400, margin: 0 }}>
            SEO · Meta &amp; Google Ads · Agentes IA · WhatsApp · Desarrollo web
          </p>
        </div>

        {/* Bottom URL */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
          <span style={{ color: "#FE5C02", fontWeight: 600, fontSize: 20, letterSpacing: "0.02em" }}>
            clickonversion.com
          </span>
          <div
            style={{
              background: "#FE5C02",
              color: "#fff",
              fontWeight: 700,
              fontSize: 18,
              padding: "14px 28px",
              borderRadius: 12,
            }}
          >
            Hablemos →
          </div>
        </div>
      </div>
    ),
    { ...size }
  )
}

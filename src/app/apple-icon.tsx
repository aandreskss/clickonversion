import { ImageResponse } from "next/og"

export const size        = { width: 180, height: 180 }
export const contentType = "image/png"

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "#010E25",
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: "40px",
        }}
      >
        <div
          style={{
            display: "flex",
            fontFamily: "sans-serif",
            fontWeight: 800,
            fontSize: 72,
            letterSpacing: "-4px",
            color: "#FFF8F0",
          }}
        >
          <span style={{ color: "#FFF8F0" }}>C</span>
          <span style={{ color: "#FE5C02" }}>K</span>
        </div>
      </div>
    ),
    { ...size }
  )
}

const ITEMS = [
  "SEO técnico",
  "Google Ads",
  "Automatización WhatsApp",
  "Agentes IA",
  "Meta Ads",
  "CRM",
  "TikTok Ads",
  "SEO local",
  "Soporte Meta Business",
]

function MarqueeContent() {
  return (
    <>
      {ITEMS.map((item, i) => (
        <span key={i} style={{ display: "inline-flex", alignItems: "center", gap: 24 }}>
          <span>{item}</span>
          <span style={{ color: "#D9FA62", fontSize: 20 }}>●</span>
        </span>
      ))}
    </>
  )
}

export function MarqueeStrip() {
  return (
    <div
      style={{
        background: "#202124",
        color: "#F7F5EF",
        padding: "18px 0",
        overflow: "hidden",
        whiteSpace: "nowrap",
      }}
      aria-hidden="true"
    >
      <div
        className="mk-marquee-track"
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 24,
          fontSize: 28,
          fontWeight: 600,
          letterSpacing: "-.03em",
          fontFamily: "var(--font-mk-sans, 'General Sans', system-ui, sans-serif)",
        }}
      >
        {/* Duplicate for seamless loop */}
        <MarqueeContent />
        <MarqueeContent />
      </div>
    </div>
  )
}

const A = [
  { tag: "[SEO]", t: "SEO y búsqueda en IA" },
  { tag: "[ADS]", t: "Meta, Google y TikTok Ads" },
  { tag: "[IA]", t: "Agentes IA y automatización" },
  { tag: "[CHAT]", t: "WhatsApp y atención" },
  { tag: "[DEV]", t: "Webs, apps y landings" },
  { tag: "[TRACKING]", t: "API de conversiones y píxel" },
]
const B = ["Tecnología precisa", "Trato humano", "Hablas con nosotros, no con un ticket", "Estrategia", "Tecnología", "Crecimiento"]

function Spark() {
  return (
    <svg viewBox="0 0 40 26" width={28} height={18} style={{ overflow: "visible" }}>
      <path d="M7 23 Q5 16 2 12" fill="none" stroke="#010E25" strokeWidth={4.2} strokeLinecap="round" />
      <path d="M20 21 Q19.5 12 21 3" fill="none" stroke="#010E25" strokeWidth={4.2} strokeLinecap="round" />
      <path d="M33 23 Q36 16 38 12" fill="none" stroke="#010E25" strokeWidth={4.2} strokeLinecap="round" />
    </svg>
  )
}

/** Dos franjas cruzadas con texto en movimiento. */
export function MarqueeBands() {
  const a = [...A, ...A, ...A, ...A]
  const b = [...B, ...B, ...B, ...B]
  return (
    <div aria-hidden="true" style={{ position: "relative", height: 210, marginTop: -40 }}>
      <div className="ck-strip" style={{ top: 30, background: "#FE5C02", transform: "rotate(2.6deg)" }}>
        <div className="ck-band ck-band-rev">
          {b.map((m, i) => (
            <span key={i} style={{ display: "inline-flex", alignItems: "center", gap: 28, paddingRight: 28, fontSize: 28, fontWeight: 600, letterSpacing: "-0.03em", color: "#010E25", whiteSpace: "nowrap" }}>{m}<Spark /></span>
          ))}
        </div>
      </div>
      <div className="ck-strip" style={{ top: 78, background: "#010E25", transform: "rotate(-2.2deg)" }}>
        <div className="ck-band">
          {a.map((m, i) => (
            <span key={i} style={{ display: "inline-flex", alignItems: "center", gap: 16, paddingRight: 40, whiteSpace: "nowrap" }}>
              <span className="ck-tag" style={{ color: "#fff", borderColor: "rgba(255,255,255,.5)" }}>{m.tag}</span>
              <span style={{ fontSize: 28, fontWeight: 600, letterSpacing: "-0.03em", color: "#fff" }}>{m.t}</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

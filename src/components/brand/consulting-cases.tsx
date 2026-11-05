import { CONSULTING_CASES } from "@/data/portfolio"

const STEPS = [
  { key: "problem", label: "PROBLEMA" },
  { key: "diagnosis", label: "DIAGNÓSTICO" },
  { key: "solution", label: "SOLUCIÓN" },
] as const

const BG = ["#D3F2E3", "#D6EBFF", "#FFDCC7", "#E4DEFF"]

export function ConsultingCases() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
      <div style={{ display: "flex", flexWrap: "wrap", alignItems: "flex-end", justifyContent: "space-between", gap: 20 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 10, maxWidth: 760 }}>
          <span className="ck-mono" style={{ fontSize: 13, color: "#C94400" }}>CONSULTORÍA TÉCNICA</span>
          <h2 style={{ fontSize: "clamp(32px, 3.8vw, 48px)" }}>Casos de Meta y WhatsApp Business API que resolvimos</h2>
          <p style={{ margin: 0, fontSize: 17 }}>Cuentas que no conectaban, números bloqueados, campañas detenidas. Publicamos el problema y la solución, nunca el nombre del cliente ni datos de sus cuentas.</p>
        </div>
      </div>
      <div className="ck-pf-cases">
        {CONSULTING_CASES.map((c, i) => (
          <article key={c.tag} className="ck-pf-case">
            <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 8 }}>
              <span className="ck-tag" style={{ background: BG[i % BG.length] }}>{c.tag}</span>
              <span className="ck-mono" style={{ fontSize: 11.5, color: "#5A6178" }}>CASO {String(i + 1).padStart(2, "0")}</span>
            </div>
            <h3 style={{ fontSize: 21, letterSpacing: "-0.02em", lineHeight: 1.2 }}>{c.client}</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {STEPS.map((s) => (
                <p key={s.key} className="ck-pf-step" style={{ margin: 0 }}>
                  <span style={s.key === "solution" ? { color: "#1F9D55", fontWeight: 600 } : undefined}>{s.label}</span>
                  <span>{c[s.key]}</span>
                </p>
              ))}
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}

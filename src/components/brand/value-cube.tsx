const VALUES = [
  { n: "01", t: "Cercanía", d: "Hablas con quien hace el trabajo. Siempre las mismas personas.", short: "Hablas con quien hace el trabajo.", face: { background: "#FFDCC7" }, lbl: "#8A3300" },
  { n: "02", t: "Claridad", d: "Si no se entiende, no está terminado. Cero jerga innecesaria.", short: "Si no se entiende, no está terminado.", face: { background: "#fff" }, lbl: "#5A6178" },
  { n: "03", t: "Precisión", d: "Decisiones con datos. Medimos lo que importa: clientes reales.", short: "Decisiones con datos reales.", face: { background: "#010E25", color: "#fff" }, lbl: "rgba(255,255,255,.7)" },
  { n: "04", t: "Honestidad", d: "Si algo no funciona, lo decimos primero. Sin maquillar números.", short: "Sin maquillar números.", face: { background: "#FE5C02" }, lbl: "#010E25" },
]

/** Sección de valores con un cubo 3D que gira cara por cara y resalta la lista en sincronía. */
export function ValueCube({ eyebrow = "04 · Lo que no negociamos" }: { eyebrow?: string }) {
  return (
    <section className="ck-values ck-section">
      <div className="ck-wrap" style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 64 }}>
        <div className="ck-reveal" style={{ flex: "1 1 460px", minWidth: 0, display: "flex", flexDirection: "column", gap: 28 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <span className="ck-eyebrow">{eyebrow}</span>
            <h2 style={{ fontSize: "clamp(38px, 5vw, 64px)" }}>Cuatro cosas que no cambian, <span style={{ color: "#FE5C02" }}>gire como gire</span>.</h2>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {VALUES.map((v, i) => (
              <div key={v.n} className={`ck-vitem${i ? ` ck-vitem-${i + 1}` : ""}`} style={{ borderRadius: 18, padding: "16px 20px", display: "flex", gap: 16, alignItems: "baseline" }}>
                <span className="ck-mono" style={{ fontSize: 13, color: "#C94400" }}>{v.n}</span>
                <span><strong style={{ fontWeight: 600 }}>{v.t}.</strong> <span style={{ color: "#5A6178" }}>{v.d}</span></span>
              </div>
            ))}
          </div>
        </div>
        <div style={{ flex: "1 1 360px", minWidth: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
          <div className="ck-cube-stage" aria-hidden="true">
            <div className="ck-cube">
              {VALUES.map((v, i) => (
                <div key={v.n} className={`ck-face ck-f${i + 1}`} style={v.face}>
                  <span className="ck-mono" style={{ fontSize: 12, letterSpacing: ".08em", color: v.lbl }}>VALOR {v.n}</span>
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    <span style={{ fontSize: 38, fontWeight: 600, letterSpacing: "-0.04em", lineHeight: 1 }}>{v.t}</span>
                    <span style={{ fontSize: 15, lineHeight: 1.4 }}>{v.short}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="ck-cube-shadow" aria-hidden="true" style={{ width: 240, height: 28, borderRadius: "50%", background: "radial-gradient(closest-side, rgba(1,14,37,.35), rgba(1,14,37,0))", marginTop: 24 }} />
        </div>
      </div>
    </section>
  )
}

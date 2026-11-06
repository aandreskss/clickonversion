import Image from "next/image"
import Link from "next/link"
import { waLink } from "@/lib/whatsapp"

const REVIEW = [
  "Estructura de la cuenta y las campañas",
  "Píxel, API de conversiones y eventos",
  "Públicos y segmentación",
  "Anuncios: cuáles funcionan y cuáles no",
  "Presupuesto y puja",
  "Del anuncio al WhatsApp: qué pasa con cada lead",
]

const FINDINGS: [string, string, string][] = [
  ["Píxel + API de conversiones", "eventos duplicados", "#FFDCC7"],
  ["Segmentación", "demasiado amplia", "#FFDCC7"],
  ["Anuncios", "2 de 7 traen mensajes", "#D3F2E3"],
  ["Presupuesto", "repartido en 9 conjuntos", "#FFDCC7"],
]

/** Revisión gratis de cuenta publicitaria, campañas y anuncios. */
export function FreeAuditSection() {
  return (
    <section id="revision-gratis" style={{ padding: "clamp(56px, 7vw, 96px) 16px", scrollMarginTop: 100 }}>
      <div className="ck-promo-audit" style={{ maxWidth: 1240, margin: "0 auto" }}>
        <div style={{ flex: "1 1 480px", minWidth: 0, display: "flex", flexDirection: "column", gap: 20 }}>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, alignItems: "center" }}>
            <span className="ck-tag" style={{ background: "#D3F2E3", fontWeight: 700 }}>GRATIS</span>
            <span className="ck-tag" style={{ background: "#FFDCC7" }}>[META ADS]</span>
            <span className="ck-tag" style={{ background: "#E4DEFF" }}>[TIKTOK ADS]</span>
            <span className="ck-tag" style={{ background: "#D6EBFF" }}>[GOOGLE ADS]</span>
          </div>
          <h2 style={{ fontSize: "clamp(36px, 4.6vw, 62px)" }}>Revisamos tu cuenta, tus campañas y tus anuncios. <span style={{ color: "#FE5C02" }}>Gratis.</span></h2>
          <p style={{ fontSize: 19, margin: 0 }}>¿Pagas anuncios y no sabes si funcionan? Danos acceso de lectura y te decimos qué está fallando y qué cambiaríamos primero, en lenguaje humano.</p>
          <ul className="ck-check" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(250px, 100%), 1fr))", gap: "10px 20px", fontSize: 16 }}>
            {REVIEW.map((r) => <li key={r}>{r}</li>)}
          </ul>
          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 14 }}>
            <a className="ck-btn ck-btn-primary" href={waLink("Hola, quiero la revisión gratis de mi cuenta de anuncios")} target="_blank" rel="noopener noreferrer" style={{ minHeight: 56, fontSize: 17 }}>Pide tu revisión gratis ↗</a>
            <span className="ck-hand" style={{ fontSize: 26, color: "#C94400", transform: "rotate(-3deg)" }}>sin compromiso, te la hacemos nosotros</span>
          </div>
        </div>
        <div style={{ flex: "1 1 380px", minWidth: 0, display: "flex", justifyContent: "center", perspective: 1400 }} aria-hidden="true">
          <div className="ck-promo-report">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10 }}>
              <span className="ck-mono" style={{ fontSize: 12, color: "rgba(255,255,255,.7)" }}>REVISIÓN DE CUENTA</span>
              <span className="ck-mono" style={{ fontSize: 11, color: "#010E25", background: "#FFF8F0", borderRadius: 6, padding: "3px 8px" }}>EJEMPLO</span>
            </div>
            {FINDINGS.map(([k, v, bg]) => (
              <div key={k} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, background: "rgba(255,255,255,.06)", borderRadius: 12, padding: "12px 14px" }}>
                <span style={{ fontSize: 15 }}>{k}</span>
                <span className="ck-mono" style={{ fontSize: 12, background: bg, color: "#010E25", borderRadius: 8, padding: "4px 8px", whiteSpace: "nowrap" }}>{v}</span>
              </div>
            ))}
            <div style={{ background: "#D3F2E3", color: "#010E25", borderRadius: 14, padding: "14px 16px", display: "flex", flexDirection: "column", gap: 4 }}>
              <span className="ck-mono" style={{ fontSize: 11, color: "#1F6B45" }}>LO PRIMERO QUE CAMBIARÍAMOS</span>
              <strong style={{ fontWeight: 600, fontSize: 17 }}>Unir conjuntos y mover el presupuesto a los 2 anuncios que sí venden.</strong>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

const ADS = [
  { src: "/ads/ejemplo-clinica-meta-story.webp", alt: "Anuncio de ejemplo para una clínica dental en Meta", r: -8 },
  { src: "/ads/ejemplo-gimnasio-tiktok.webp", alt: "Anuncio de ejemplo para un gimnasio en TikTok", r: -2 },
  { src: "/ads/ejemplo-restaurante-tiktok.webp", alt: "Anuncio de ejemplo para un restaurante en TikTok", r: 5 },
]

/** Promoción del servicio de creación de anuncios. */
export function AdsSellSection() {
  return (
    <section id="anuncios-que-venden" style={{ padding: "0 16px clamp(56px, 7vw, 96px)", scrollMarginTop: 100 }}>
      <div style={{ maxWidth: 1240, margin: "0 auto", background: "#FFDCC7", border: "1.5px solid #010E25", borderRadius: 44, padding: "clamp(28px, 5vw, 64px)", display: "flex", flexWrap: "wrap-reverse", alignItems: "center", gap: 48, overflow: "hidden" }}>
        <div className="ck-promo-fan" style={{ flex: "1 1 420px", minWidth: 0 }} aria-hidden="true">
          {ADS.map((a, i) => (
            <div key={a.src} className="ck-promo-ad" style={{ ["--r" as string]: `${a.r}deg`, ["--x" as string]: `${i * 31}%` } as React.CSSProperties}>
              <Image src={a.src} alt={a.alt} fill sizes="220px" style={{ objectFit: "cover" }} />
            </div>
          ))}
          <span className="ck-mono" style={{ position: "absolute", left: 0, bottom: -4, fontSize: 11, color: "#8A3300" }}>PIEZAS DE EJEMPLO</span>
        </div>
        <div style={{ flex: "1 1 460px", minWidth: 0, display: "flex", flexDirection: "column", gap: 20 }}>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            <span className="ck-tag" style={{ background: "#fff" }}>[CREATIVOS]</span>
            <span className="ck-tag" style={{ background: "#fff" }}>REELS · STORIES · TIKTOK · CARRUSEL</span>
          </div>
          <h2 style={{ fontSize: "clamp(36px, 4.6vw, 62px)" }}>Creamos anuncios que venden.</h2>
          <p style={{ fontSize: 19, margin: 0, color: "#2A3147" }}>Guion, diseño, edición de video y textos para Meta, TikTok y Google. Cada pieza hecha para su formato, con un gancho en los primeros segundos y un llamado claro a escribirte.</p>
          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 14 }}>
            <a className="ck-btn ck-btn-primary" href={waLink("Hola, quiero anuncios que vendan. ¿Me cuentan cómo trabajan?")} target="_blank" rel="noopener noreferrer" style={{ minHeight: 56, fontSize: 17 }}>Consulta ahora ↗</a>
            <Link className="ck-btn ck-btn-line" href="/projects#anuncios" style={{ minHeight: 56, fontSize: 17 }}>Ver anuncios →</Link>
          </div>
          <span className="ck-mono" style={{ fontSize: 13, color: "#8A3300" }}>PACK DE 4 PIEZAS · $120 PAGO ÚNICO · O INCLUIDO EN LOS PLANES</span>
        </div>
      </div>
    </section>
  )
}

import type { Metadata } from "next"
import Link from "next/link"
import { MarketingLayout } from "@/components/marketing/marketing-layout"
import { ProjectsGrid } from "@/components/brand/projects-grid"
import { ConsultingCases } from "@/components/brand/consulting-cases"
import { waLink } from "@/lib/whatsapp"

export const metadata: Metadata = {
  title: "Proyectos — portafolio web y casos de Meta y WhatsApp API",
  description: "Tiendas en línea, sitios web y plataformas que hicimos para negocios en Venezuela y Colombia, y casos de Meta y WhatsApp Business API que resolvimos.",
  alternates: { canonical: "https://www.clickonversion.com/projects" },
  openGraph: {
    title: "Proyectos | ClicKonversion",
    description: "Sitios, tiendas y plataformas que hemos hecho, con capturas y el detalle de cada proyecto.",
    url: "https://www.clickonversion.com/projects",
    siteName: "ClicKonversion",
    locale: "es_419",
    type: "website",
  },
}

export default function ProjectsPage() {
  return (
    <MarketingLayout active="projects" whatsapp={{ message: "¿Te gustó algún proyecto? Cuéntanos el tuyo y te decimos cómo lo haríamos.", replies: ["Quiero algo parecido", "Quiero ver SyncLead", "Tengo una duda"] }}>
      <section className="ck-dots" style={{ padding: "56px 0 48px" }}>
        <div className="ck-wrap" style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <nav aria-label="Migas de pan"><ol className="ck-crumbs"><li><Link href="/">Inicio</Link></li><li aria-hidden="true">/</li><li aria-current="page" style={{ color: "#010E25", fontWeight: 700 }}>Proyectos</li></ol></nav>
          <h1 style={{ fontSize: "clamp(46px, 6.4vw, 96px)", lineHeight: 0.98, maxWidth: 1000 }}>Lo que hemos <span style={{ color: "#FE5C02" }}>construido</span>.</h1>
          <p style={{ fontSize: "clamp(18px, 1.6vw, 21px)", color: "#3A4158", maxWidth: 720 }}>Tiendas en línea, sitios web y plataformas para negocios en Venezuela y Colombia. Abre cada proyecto para ver capturas, el reto y lo que hicimos. Más abajo, los casos de Meta y WhatsApp Business API que hemos resuelto.</p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}><a className="ck-btn ck-btn-primary" href="#portafolio">Ver portafolio</a><a className="ck-btn ck-btn-line" href="#consultoria">Casos de Meta y WhatsApp</a></div>
        </div>
      </section>

      <section style={{ padding: "0 16px 72px" }}>
        <div style={{ maxWidth: 1240, margin: "0 auto", background: "#010E25", color: "#fff", borderRadius: 44, padding: "clamp(28px, 5vw, 64px)", display: "flex", flexWrap: "wrap", alignItems: "center", gap: 56 }}>
          <div style={{ flex: "1 1 420px", minWidth: 0, display: "flex", flexDirection: "column", gap: 20 }}>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              <span className="ck-tag" style={{ background: "#FE5C02" }}>PRODUCTO PROPIO</span>
              <span className="ck-tag" style={{ color: "#fff", borderColor: "rgba(255,255,255,.55)" }}>[CRM]</span>
              <span className="ck-tag" style={{ color: "#fff", borderColor: "rgba(255,255,255,.55)" }}>[META ADS]</span>
            </div>
            <h2 style={{ fontSize: "clamp(36px, 4.6vw, 62px)", color: "#fff" }}>SyncLead: el CRM que hicimos para los leads de Meta Ads</h2>
            <p style={{ color: "rgba(255,255,255,.82)" }}>Un CRM multiempresa donde los leads de Meta Ads llegan solos, se ordenan por etapa y cada equipo sabe a quién responder primero.</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
              <Link className="ck-btn ck-btn-primary on-dark" href="/apps/synclead">Conocer SyncLead ↗</Link>
            </div>
          </div>
          <div style={{ flex: "1 1 440px", minWidth: 0, display: "flex", justifyContent: "center", perspective: 1400 }} aria-hidden="true">
            <div className="ck-phone" style={{ width: "min(520px, 100%)", background: "#FFF8F0", color: "#010E25", borderRadius: 24, overflow: "hidden", boxShadow: "0 50px 90px -40px rgba(0,0,0,.8)", transform: "rotateY(-16deg) rotateX(8deg)" }}>
              <div style={{ background: "#010E25", borderBottom: "1px solid rgba(255,255,255,.12)", padding: "12px 16px", display: "flex", alignItems: "center", gap: 14, color: "#fff", fontSize: 13 }}>
                <span className="ck-mono" style={{ fontSize: 11, border: "1.5px solid rgba(255,255,255,.5)", borderRadius: 6, padding: "3px 8px" }}>SYNCLEAD</span>
                <span>Panel</span><span style={{ color: "#FE5C02" }}>Leads</span><span>Campañas</span>
              </div>
              <div style={{ padding: 16, display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 10, fontSize: 12.5 }}>
                {[["NUEVOS", "#fff", "Lead nuevo", "META ADS · ahora"], ["CONTACTADOS", "#FFDCC7", "Lead", "WHATSAPP"], ["CLIENTES", "#D3F2E3", "Cliente ✓", "CERRADO"]].map(([h, bg, t, s]) => (
                  <div key={h} style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    <span className="ck-mono" style={{ fontSize: 10.5, color: "#5A6178" }}>{h}</span>
                    <span style={{ background: bg, border: bg === "#fff" ? "1.5px solid #010E25" : undefined, borderRadius: 12, padding: 10, display: "flex", flexDirection: "column", gap: 4 }}><strong style={{ fontWeight: 600 }}>{t}</strong><span className="ck-mono" style={{ fontSize: 10, color: "#C94400" }}>{s}</span></span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="portafolio" style={{ paddingBottom: "clamp(72px, 9vw, 120px)", scrollMarginTop: 100 }}>
        <div className="ck-wrap"><ProjectsGrid /></div>
      </section>

      <section id="consultoria" style={{ paddingBottom: "clamp(80px, 10vw, 140px)", scrollMarginTop: 100 }}>
        <div className="ck-wrap"><ConsultingCases /></div>
      </section>

      <section style={{ padding: "0 16px clamp(48px, 6vw, 80px)" }}>
        <div className="ck-reveal ck-cta-dark" style={{ maxWidth: 1240, margin: "0 auto", background: "#010E25", border: "1.5px solid #010E25", borderRadius: 44, padding: "clamp(32px, 6vw, 80px)", display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 32 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 12, maxWidth: 680 }}>
            <h2 style={{ fontSize: "clamp(36px, 4.6vw, 64px)" }}>¿El próximo proyecto es el tuyo?</h2>
            <p style={{ fontSize: 20 }}>Cuéntanos qué quieres lograr y te decimos cómo lo haríamos.</p>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
            <a className="ck-btn ck-btn-dark" href={waLink("Hola, quiero un proyecto parecido")} target="_blank" rel="noopener noreferrer" style={{ minHeight: 56, fontSize: 17 }}>Escríbenos por WhatsApp ↗</a>
            <Link className="ck-btn ck-btn-line" href="/pricing" style={{ minHeight: 56, fontSize: 17 }}>Ver precios</Link>
          </div>
        </div>
      </section>
    </MarketingLayout>
  )
}

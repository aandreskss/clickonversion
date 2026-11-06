import Link from "next/link"
import { AnimatedLogo } from "@/components/ui/animated-logo"
import { waLink } from "@/lib/whatsapp"

const COLS = [
  {
    title: "SERVICIOS",
    links: [
      { href: "/services#seo", label: "SEO local y técnico" },
      { href: "/services#ads", label: "Meta, Google y TikTok Ads" },
      { href: "/services#creativos", label: "Creación de anuncios" },
      { href: "/services#ia", label: "Agentes IA y automatización" },
      { href: "/services", label: "Webs, apps y landings" },
      { href: "/services", label: "Configuración y medición" },
    ],
  },
  {
    title: "ESTUDIO",
    links: [
      { href: "/about", label: "Quiénes somos" },
      { href: "/projects", label: "Proyectos" },
      { href: "/pricing", label: "Precios" },
      { href: "/apps", label: "Apps · SyncLead" },
      { href: "/blog", label: "Blog" },
      { href: "/resources", label: "Recursos" },
    ],
  },
]

export function Footer() {
  return (
    <footer style={{ padding: "0 16px 16px" }}>
      <div style={{ maxWidth: 1272, margin: "0 auto", background: "#010E25", color: "#fff", borderRadius: 40, padding: "clamp(32px, 5vw, 56px)", display: "flex", flexDirection: "column", gap: 40 }}>
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "flex-end", gap: 28 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <Link href="/" aria-label="ClicKonversion, ir al inicio" style={{ textDecoration: "none" }}>
              <AnimatedLogo size="xl" tone="dark" />
            </Link>
            <span className="ck-mono" style={{ fontSize: 12, letterSpacing: ".32em", color: "rgba(255,255,255,.8)" }}>¡CONVERTIMOS CLICS EN VENTAS!</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 12 }}>
            <span className="ck-hand" style={{ fontSize: 30, color: "#FE5C02", transform: "rotate(-3deg)" }}>¿hablamos? te leemos</span>
            <a className="ck-btn ck-btn-primary on-dark" href={waLink("Hola, quiero hablar con ustedes")} target="_blank" rel="noopener noreferrer">Escríbenos ↗</a>
          </div>
        </div>

        <div style={{ height: 1, background: "rgba(255,255,255,.14)" }} />

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(180px, 100%), 1fr))", gap: 32 }}>
          {COLS.map((c) => (
            <div key={c.title} style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <span className="ck-mono" style={{ fontSize: 12, letterSpacing: ".08em", color: "rgba(255,255,255,.65)" }}>{c.title}</span>
              {c.links.map((l) => (
                <Link key={l.label} className="ck-flink" href={l.href}>{l.label}</Link>
              ))}
            </div>
          ))}
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <span className="ck-mono" style={{ fontSize: 12, letterSpacing: ".08em", color: "rgba(255,255,255,.65)" }}>CONTACTO</span>
            <a className="ck-flink" href={waLink()} target="_blank" rel="noopener noreferrer">WhatsApp ↗</a>
            <a className="ck-flink" href="mailto:hello@clickonversion.com">hello@clickonversion.com</a>
            <a className="ck-flink" href="https://www.linkedin.com/in/arnaldocasadiego/" target="_blank" rel="noopener noreferrer">LinkedIn ↗</a>
            <Link className="ck-flink" href="/portal/login">Portal de clientes</Link>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <span className="ck-mono" style={{ fontSize: 12, letterSpacing: ".08em", color: "rgba(255,255,255,.65)" }}>AHORA MISMO</span>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 8, fontSize: 15 }}><span className="ck-dot" />en línea desde Venezuela</span>
          </div>
        </div>

        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", gap: 12 }}>
          <span className="ck-mono" style={{ fontSize: 12, color: "rgba(255,255,255,.65)" }}>© {new Date().getFullYear()} ClicKonversion · hecho a mano en Venezuela</span>
          <div style={{ display: "flex", gap: 16 }}>
            <Link className="ck-flink ck-mono" href="/privacy" style={{ fontSize: 12 }}>Privacidad</Link>
            <Link className="ck-flink ck-mono" href="/terms" style={{ fontSize: 12 }}>Términos</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

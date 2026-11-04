import type { Metadata } from "next"
import Link from "next/link"
import { MarketingLayout } from "@/components/marketing/marketing-layout"
import { BlogList } from "@/components/brand/blog-list"
import { ResourcesNewsletterForm } from "@/components/marketing/resources-newsletter-form"
import { POSTS, formatDate } from "@/data/blog"

export const metadata: Metadata = {
  title: "Blog de marketing digital: SEO, Ads, IA y WhatsApp explicados en cristiano",
  description: "Guías prácticas de SEO local y técnico, Meta y Google Ads, agentes de IA, WhatsApp, desarrollo web y medición de conversiones para negocios de Latinoamérica.",
  alternates: { canonical: "https://www.clickonversion.com/blog" },
  openGraph: {
    title: "Blog de marketing digital | ClicKonversion",
    description: "SEO, Ads, IA y WhatsApp explicados en cristiano. Sin humo.",
    url: "https://www.clickonversion.com/blog",
    siteName: "ClicKonversion",
    locale: "es_419",
    type: "website",
  },
}

export default function BlogPage() {
  const featured = POSTS.find((p) => p.published)
  return (
    <MarketingLayout active="blog" whatsapp={{ message: "¿Buscas algo que no está en el blog? Pregúntanos: te respondemos nosotros, no un bot.", replies: ["Tengo una pregunta de SEO", "Tengo una pregunta de anuncios", "Tengo una pregunta del píxel"] }}>
      <section className="ck-dots" style={{ padding: "56px 0 48px" }}>
        <div className="ck-wrap" style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <nav aria-label="Migas de pan"><ol className="ck-crumbs"><li><Link href="/">Inicio</Link></li><li aria-hidden="true">/</li><li aria-current="page" style={{ color: "#010E25", fontWeight: 700 }}>Blog</li></ol></nav>
          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "flex-end", justifyContent: "space-between", gap: 24 }}>
            <h1 style={{ fontSize: "clamp(44px, 6vw, 88px)", lineHeight: 0.98, maxWidth: 900 }}>Blog de marketing digital, <span style={{ color: "#FE5C02" }}>explicado en cristiano</span>.</h1>
            <p className="ck-hand" style={{ fontSize: 28, color: "#C94400", transform: "rotate(-3deg)" }}>sin humo, prometido</p>
          </div>
          <p style={{ fontSize: "clamp(18px, 1.6vw, 21px)", color: "#3A4158", maxWidth: 720 }}>Guías prácticas de SEO, Meta y Google Ads, agentes de IA, WhatsApp, desarrollo web y medición de conversiones para negocios de Latinoamérica.</p>
        </div>
      </section>

      {featured && (
        <section style={{ paddingBottom: 64 }}>
          <div className="ck-wrap">
            <Link href={`/blog/${featured.slug}`} className="ck-post" style={{ flexDirection: "row", flexWrap: "wrap", border: "1.5px solid #010E25", borderRadius: 36 }}>
              <div style={{ flex: "1 1 460px", minWidth: 0, background: "#010E25", display: "flex", flexDirection: "column", justifyContent: "center", gap: 12, padding: 40, minHeight: 360 }}>
                <div className="ck-mono" style={{ display: "flex", justifyContent: "space-between", gap: 12, fontSize: 14, padding: "14px 16px", borderRadius: 14, background: "rgba(255,255,255,.08)", color: "#fff" }}><span>Navegador · píxel</span><span style={{ color: "#FFB8B8" }}>bloqueado ✕</span></div>
                <div className="ck-mono" style={{ display: "flex", justifyContent: "space-between", gap: 12, fontSize: 14, padding: "14px 16px", borderRadius: 14, background: "#FE5C02", color: "#010E25", transform: "translateX(16px)" }}><span>Servidor · API de conversiones</span><span>enviado ✓</span></div>
                <div className="ck-mono" style={{ display: "flex", justifyContent: "space-between", gap: 12, fontSize: 14, padding: "14px 16px", borderRadius: 14, background: "#D3F2E3", color: "#010E25" }}><span>Meta · Lead</span><span>deduplicado ✓</span></div>
              </div>
              <div style={{ flex: "1 1 440px", minWidth: 0, padding: "clamp(28px, 4vw, 52px)", display: "flex", flexDirection: "column", justifyContent: "center", gap: 18 }}>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8, alignItems: "center" }}><span className="ck-tag" style={{ background: "#FE5C02" }}>DESTACADO</span><span className="ck-tag">[{featured.cat}]</span><span className="ck-mono" style={{ fontSize: 12, color: "#5A6178" }}>{featured.readMin} MIN DE LECTURA</span></div>
                <h2 style={{ fontSize: "clamp(32px, 3.6vw, 48px)" }}>{featured.title}</h2>
                <p style={{ color: "#3A4158" }}>{featured.excerpt}</p>
                <div style={{ display: "flex", alignItems: "center", gap: 12, fontSize: 15 }}><strong style={{ fontWeight: 600 }}>{featured.author}</strong><span style={{ color: "#5A6178" }}>{formatDate(featured.date)}</span><span style={{ marginLeft: "auto", fontWeight: 600 }}>Leer guía <span className="ck-arrow">→</span></span></div>
              </div>
            </Link>
          </div>
        </section>
      )}

      <section style={{ paddingBottom: "clamp(80px, 10vw, 120px)" }}>
        <div className="ck-wrap"><BlogList /></div>
      </section>

      <section style={{ padding: "0 16px clamp(48px, 6vw, 80px)" }}>
        <div style={{ maxWidth: 1240, margin: "0 auto", background: "#010E25", color: "#fff", borderRadius: 44, padding: "clamp(32px, 6vw, 72px)", display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 32 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 12, maxWidth: 560 }}>
            <span className="ck-mono" style={{ fontSize: 13, letterSpacing: ".08em", color: "rgba(255,255,255,.7)" }}>NEWSLETTER</span>
            <h2 style={{ fontSize: "clamp(34px, 4.2vw, 56px)", color: "#fff" }}>Un correo al mes. Útil, corto, sin humo.</h2>
          </div>
          <div style={{ flex: "1 1 380px", maxWidth: 520 }}><ResourcesNewsletterForm /></div>
        </div>
      </section>
    </MarketingLayout>
  )
}

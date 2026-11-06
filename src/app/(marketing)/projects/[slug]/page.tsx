import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { MarketingLayout } from "@/components/marketing/marketing-layout"
import { PROJECTS, getProject } from "@/data/portfolio"
import { CATEGORY_LABEL, ProjectMedia, StatusTag, hostOf } from "@/components/brand/portfolio-media"
import { waLink } from "@/lib/whatsapp"
import { getGallery } from "@/data/portfolio-gallery"
import { ProjectGallery } from "@/components/brand/project-gallery"

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.clickonversion.com"

type Props = { params: Promise<{ slug: string }> }

export const dynamicParams = false

export function generateStaticParams() {
  return PROJECTS.map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const p = getProject(slug)
  if (!p) return {}
  const url = `${siteUrl}/projects/${p.slug}`
  return {
    title: `${p.name} — proyecto`,
    description: p.summary,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      title: `${p.name} | ClicKonversion`,
      description: p.summary,
      url,
      siteName: "ClicKonversion",
      locale: "es_419",
      ...(p.shots ? { images: [{ url: p.shots.desktop, width: 1440, height: 900, alt: p.name }] } : {}),
    },
  }
}

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params
  const p = getProject(slug)
  if (!p) notFound()

  const idx = PROJECTS.findIndex((x) => x.slug === p.slug)
  const next = PROJECTS[(idx + 1) % PROJECTS.length]
  const isSelf = hostOf(p.url) === "clickonversion.com"
  const linkLabel = p.status === "En línea" ? "Ver sitio en línea" : "Ver vista previa"
  const pageUrl = `${siteUrl}/projects/${p.slug}`

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CreativeWork",
        name: p.name,
        description: p.summary,
        url: pageUrl,
        ...(p.shots ? { image: `${siteUrl}${p.shots.desktop}` } : {}),
        creator: { "@type": "Organization", name: "ClicKonversion", url: siteUrl },
        about: { "@type": "Organization", name: p.client },
        keywords: [p.sector, ...p.stack].join(", "),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Inicio", item: siteUrl },
          { "@type": "ListItem", position: 2, name: "Proyectos", item: `${siteUrl}/projects` },
          { "@type": "ListItem", position: 3, name: p.name, item: pageUrl },
        ],
      },
    ],
  }

  return (
    <MarketingLayout active="projects" whatsapp={{ message: `¿Quieres un proyecto como ${p.client}? Cuéntanos qué necesitas.`, replies: ["Quiero algo parecido", "¿Cuánto cuesta?", "Tengo una duda"] }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />

      <section className="ck-dots" style={{ padding: "56px 0 40px" }}>
        <div className="ck-wrap" style={{ display: "flex", flexDirection: "column", gap: 22 }}>
          <nav aria-label="Migas de pan">
            <ol className="ck-crumbs">
              <li><Link href="/">Inicio</Link></li><li aria-hidden="true">/</li>
              <li><Link href="/projects">Proyectos</Link></li><li aria-hidden="true">/</li>
              <li aria-current="page" style={{ color: "#010E25", fontWeight: 700 }}>{p.client}</li>
            </ol>
          </nav>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            <StatusTag status={p.status} />
            {p.categories.map((c) => <span key={c} className="ck-tag">{CATEGORY_LABEL[c]}</span>)}
          </div>
          <h1 style={{ fontSize: "clamp(42px, 6vw, 88px)", lineHeight: 0.98, maxWidth: 1100 }}>{p.name}</h1>
          <p style={{ fontSize: "clamp(18px, 1.6vw, 21px)", maxWidth: 760, margin: 0 }}>{p.summary}</p>
          <dl style={{ display: "flex", flexWrap: "wrap", gap: "12px 40px", margin: "6px 0 0" }}>
            {[["CLIENTE", p.client], ["SECTOR", p.sector], ["UBICACIÓN", p.location]].map(([k, v]) => (
              <div key={k} style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <dt className="ck-mono" style={{ fontSize: 11.5, color: "#5A6178" }}>{k}</dt>
                <dd style={{ margin: 0, fontWeight: 600 }}>{v}</dd>
              </div>
            ))}
          </dl>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginTop: 6 }}>
            {p.url && !isSelf && <a className="ck-btn ck-btn-primary" href={p.url} target="_blank" rel="noopener noreferrer">{linkLabel} ↗</a>}
            <a className="ck-btn ck-btn-line" href={waLink(`Hola, vi el proyecto ${p.client} y quiero algo parecido`)} target="_blank" rel="noopener noreferrer">Quiero algo parecido</a>
          </div>
        </div>
      </section>

      <section style={{ padding: "0 16px clamp(56px, 7vw, 96px)" }}>
        <div className="ck-pf-hero" style={{ maxWidth: 1240, margin: "0 auto", background: p.cover.bg }}>
          <div className="ck-pf-stage"><ProjectMedia p={p} priority size="hero" /></div>
        </div>
      </section>

      <section style={{ paddingBottom: "clamp(64px, 8vw, 112px)" }}>
        <div className="ck-wrap"><ProjectGallery shots={getGallery(p.slug)} name={p.name} /></div>
      </section>

      <section style={{ paddingBottom: "clamp(64px, 8vw, 112px)" }}>
        <div className="ck-wrap" style={{ display: "flex", flexWrap: "wrap", gap: 48, alignItems: "flex-start" }}>
          <div style={{ flex: "1 1 560px", minWidth: 0, display: "flex", flexDirection: "column", gap: 40 }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <span className="ck-mono" style={{ fontSize: 13, color: "#C94400" }}>01 · EL RETO</span>
              <p style={{ fontSize: "clamp(20px, 2vw, 26px)", lineHeight: 1.4, color: "#010E25", margin: 0, letterSpacing: "-0.01em" }}>{p.challenge}</p>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <span className="ck-mono" style={{ fontSize: 13, color: "#C94400" }}>02 · QUÉ HICIMOS</span>
              <ol style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 12 }}>
                {p.solution.map((s, i) => (
                  <li key={s} style={{ display: "flex", gap: 16, alignItems: "flex-start", background: "#fff", border: "1.5px solid #010E25", borderRadius: 20, padding: "16px 20px" }}>
                    <span className="ck-mono" style={{ flex: "none", width: 30, height: 30, borderRadius: 8, background: "#FE5C02", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 600 }}>{i + 1}</span>
                    <span style={{ color: "#3A4158" }}>{s}</span>
                  </li>
                ))}
              </ol>
            </div>
          </div>

          <aside style={{ flex: "1 1 320px", minWidth: 0, display: "flex", flexDirection: "column", gap: 20, position: "sticky", top: 110 }}>
            <div style={{ background: "#fff", border: "1.5px solid #010E25", borderRadius: 26, padding: 24, display: "flex", flexDirection: "column", gap: 14 }}>
              <span className="ck-mono" style={{ fontSize: 12, color: "#5A6178" }}>ENTREGABLES</span>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 8 }}>
                {p.deliverables.map((d) => <li key={d} style={{ display: "flex", gap: 10 }}><span aria-hidden="true" style={{ color: "#1F9D55", fontWeight: 700 }}>✓</span>{d}</li>)}
              </ul>
            </div>
            <div style={{ background: "#010E25", color: "#fff", borderRadius: 26, padding: 24, display: "flex", flexDirection: "column", gap: 14 }}>
              <span className="ck-mono" style={{ fontSize: 12, color: "rgba(255,255,255,.65)" }}>STACK</span>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {p.stack.map((s) => <span key={s} className="ck-tag" style={{ color: "#fff", borderColor: "rgba(255,255,255,.5)" }}>{s}</span>)}
              </div>
            </div>
            {p.url && !isSelf && (
              <a href={p.url} target="_blank" rel="noopener noreferrer" className="ck-tag" style={{ alignSelf: "flex-start", fontSize: 13, padding: "8px 12px", background: "#FFF8F0" }}>{hostOf(p.url)} ↗</a>
            )}
          </aside>
        </div>
      </section>

      <section style={{ paddingBottom: "clamp(64px, 8vw, 112px)" }}>
        <div className="ck-wrap">
          <Link href={`/projects/${next.slug}`} className="ck-pf-card ck-tilt ck-tilt-l" style={{ flexDirection: "row", flexWrap: "wrap", alignItems: "stretch" }}>
            <div style={{ flex: "1 1 320px", padding: "clamp(24px, 4vw, 44px)", display: "flex", flexDirection: "column", justifyContent: "center", gap: 10 }}>
              <span className="ck-mono" style={{ fontSize: 12, color: "#5A6178" }}>SIGUIENTE PROYECTO</span>
              <strong style={{ fontSize: "clamp(28px, 3.4vw, 44px)", fontWeight: 600, letterSpacing: "-0.04em", lineHeight: 1.05 }}>{next.name} <span aria-hidden="true" style={{ color: "#FE5C02" }}>→</span></strong>
              <span style={{ color: "#5A6178" }}>{next.summary}</span>
            </div>
            <div style={{ flex: "1 1 320px", position: "relative", minHeight: 220, background: next.cover.bg, borderLeft: "1.5px solid #010E25", overflow: "hidden" }}>
              {next.shots
                ? <Image src={next.shots.desktop} alt="" fill sizes="(max-width: 760px) 100vw, 600px" style={{ objectFit: "cover", objectPosition: "top" }} />
                : <span style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", color: next.cover.fg, fontSize: 32, fontWeight: 600, letterSpacing: "-0.04em" }}>{next.client}</span>}
            </div>
          </Link>
        </div>
      </section>

      <section style={{ padding: "0 16px clamp(48px, 6vw, 80px)" }}>
        <div className="ck-reveal ck-cta-dark" style={{ maxWidth: 1240, margin: "0 auto", background: "#010E25", border: "1.5px solid #010E25", borderRadius: 44, padding: "clamp(32px, 6vw, 80px)", display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 32 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 12, maxWidth: 680 }}>
            <h2 style={{ fontSize: "clamp(36px, 4.6vw, 64px)" }}>¿Quieres un proyecto así?</h2>
            <p style={{ fontSize: 20 }}>Cuéntanos qué vendes y a quién. Te decimos cómo lo haríamos y cuánto cuesta.</p>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
            <a className="ck-btn ck-btn-dark" href={waLink(`Hola, quiero un proyecto como ${p.client}`)} target="_blank" rel="noopener noreferrer" style={{ minHeight: 56, fontSize: 17 }}>Escríbenos por WhatsApp ↗</a>
            <Link className="ck-btn ck-btn-line" href="/projects" style={{ minHeight: 56, fontSize: 17 }}>Ver todos los proyectos</Link>
          </div>
        </div>
      </section>
    </MarketingLayout>
  )
}

import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { MarketingLayout } from "@/components/marketing/marketing-layout"
import { POSTS, getPost, formatDate } from "@/data/blog"
import { ApiConversionesMeta, TOC as TOC_CAPI, FAQS as FAQS_CAPI } from "@/components/brand/articles/api-conversiones-meta"

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.clickonversion.com"

// Contenido de cada artículo publicado
const ARTICLES: Record<string, { Body: () => React.ReactElement; toc: { id: string; label: string }[]; faqs: { q: string; a: string }[] }> = {
  "api-de-conversiones-meta": { Body: ApiConversionesMeta, toc: TOC_CAPI, faqs: FAQS_CAPI },
}

type Props = { params: Promise<{ slug: string }> }

export async function generateStaticParams() {
  return POSTS.filter((p) => p.published && ARTICLES[p.slug]).map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const post = getPost(slug)
  if (!post) return {}
  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: `${siteUrl}/blog/${post.slug}` },
    openGraph: { type: "article", title: post.title, description: post.excerpt, url: `${siteUrl}/blog/${post.slug}`, siteName: "ClicKonversion", locale: "es_419", publishedTime: post.date, authors: [post.author] },
  }
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params
  const post = getPost(slug)
  const article = post ? ARTICLES[post.slug] : undefined
  if (!post || !article) notFound()
  const { Body, toc, faqs } = article

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      { "@type": "BlogPosting", headline: post.title, description: post.excerpt, datePublished: post.date, dateModified: post.date, author: { "@type": "Person", name: post.author, url: "https://www.linkedin.com/in/arnaldocasadiego/" }, publisher: { "@id": `${siteUrl}/#organization` }, mainEntityOfPage: `${siteUrl}/blog/${post.slug}`, inLanguage: "es" },
      { "@type": "BreadcrumbList", itemListElement: [
        { "@type": "ListItem", position: 1, name: "Inicio", item: siteUrl },
        { "@type": "ListItem", position: 2, name: "Blog", item: `${siteUrl}/blog` },
        { "@type": "ListItem", position: 3, name: post.title, item: `${siteUrl}/blog/${post.slug}` },
      ] },
      { "@type": "FAQPage", mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) },
    ],
  }
  const related = POSTS.filter((p) => p.slug !== post.slug).slice(0, 3)

  return (
    <MarketingLayout active="blog" whatsapp={{ message: "¿Te trabaste con algún paso? Mándanos una captura y te decimos qué falta.", replies: ["Me trabé en un paso", "Quiero que lo hagan por mí", "Tengo otra duda"] }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="ck-progress" aria-hidden="true" />

      <section style={{ padding: "48px 0 56px" }}>
        <div className="ck-wrap" style={{ display: "flex", flexDirection: "column", gap: 22, maxWidth: 1000, marginLeft: "auto", marginRight: "auto" }}>
          <nav aria-label="Migas de pan"><ol className="ck-crumbs"><li><Link href="/">Inicio</Link></li><li aria-hidden="true">/</li><li><Link href="/blog">Blog</Link></li><li aria-hidden="true">/</li><li aria-current="page" style={{ color: "#010E25" }}>[{post.cat}]</li></ol></nav>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, alignItems: "center" }}><span className="ck-tag" style={{ background: "#fff" }}>[{post.cat}]</span><span className="ck-mono" style={{ fontSize: 12, color: "#5A6178" }}>{post.readMin} MIN DE LECTURA</span></div>
          <h1 style={{ fontSize: "clamp(40px, 5vw, 68px)" }}>{post.title}</h1>
          <p style={{ fontSize: 21, color: "#3A4158" }}>{post.excerpt}</p>
          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "14px 24px" }}>
            <span style={{ display: "flex", flexDirection: "column", lineHeight: 1.3, fontSize: 15 }}><strong style={{ fontWeight: 600 }}>{post.author}</strong><span style={{ color: "#5A6178" }}>ClicKonversion</span></span>
            <span className="ck-mono" style={{ fontSize: 13, color: "#5A6178" }}>PUBLICADO <time dateTime={post.date}>{formatDate(post.date).toUpperCase()}</time></span>
          </div>
        </div>
      </section>

      <div className="ck-wrap" style={{ paddingBottom: 96, display: "flex", flexWrap: "wrap", gap: 56, alignItems: "flex-start" }}>
        <aside aria-label="Contenido del artículo" style={{ flex: "1 1 240px", minWidth: 0, position: "sticky", top: 110, display: "flex", flexDirection: "column", gap: 20 }}>
          <nav className="ck-toc" aria-label="Tabla de contenidos" style={{ background: "#fff", border: "1.5px solid rgba(1,14,37,.12)", borderRadius: 22, padding: 16 }}>
            <span className="ck-eyebrow" style={{ display: "block", padding: "4px 12px 10px" }}>En este artículo</span>
            {toc.map((t) => <a key={t.id} href={`#${t.id}`}>{t.label}</a>)}
          </nav>
          <div style={{ background: "#FFDCC7", borderRadius: 22, padding: 20, display: "flex", flexDirection: "column", gap: 12 }}>
            <span className="ck-hand" style={{ fontSize: 26, color: "#8A3300", lineHeight: 1.1 }}>¿te lo configuramos?</span>
            <p style={{ fontSize: 15, color: "#2A3147" }}>Píxel + API de conversiones, deduplicado y verificado.</p>
            <Link className="ck-btn ck-btn-primary" href="/pricing" style={{ minHeight: 46, fontSize: 15 }}>Ver precios ↗</Link>
          </div>
        </aside>
        <article className="ck-prose" style={{ flex: "999 1 600px", minWidth: 0, maxWidth: 760 }}>
          <Body />
          <div style={{ marginTop: 56, background: "#fff", border: "1.5px solid rgba(1,14,37,.14)", borderRadius: 26, padding: 24, display: "flex", flexWrap: "wrap", gap: 18, alignItems: "center" }}>
            <div style={{ flex: "1 1 300px", display: "flex", flexDirection: "column", gap: 6 }}>
              <span className="ck-eyebrow">Escrito por</span>
              <strong style={{ fontWeight: 600, fontSize: 20 }}>{post.author}</strong>
              <p style={{ margin: 0, fontSize: 16, color: "#5A6178" }}>Licenciado en Mercadeo, con más de 8 años en marketing digital. Formación en Google Ads, SEO + AEO y Meta Ads.</p>
            </div>
            <a href="https://www.linkedin.com/in/arnaldocasadiego/" target="_blank" rel="noopener noreferrer" style={{ fontWeight: 600, fontSize: 15, color: "#C94400" }}>LinkedIn ↗</a>
          </div>
        </article>
      </div>

      <section style={{ paddingBottom: "clamp(72px, 9vw, 120px)" }}>
        <div className="ck-wrap" style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <h2 style={{ fontSize: "clamp(30px, 3.4vw, 44px)" }}>Sigue leyendo</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(300px, 100%), 1fr))", gap: 20 }}>
            {related.map((p) => (
              <Link key={p.slug} href="/blog" className="ck-post" style={{ padding: 22, gap: 10 }}>
                <span className="ck-tag" style={{ alignSelf: "flex-start", background: p.cover.bg === "#010E25" ? "#fff" : p.cover.bg }}>[{p.cat}]</span>
                <h3 style={{ fontSize: 22 }}>{p.title}</h3>
                <span className="ck-mono" style={{ fontSize: 12, color: "#5A6178" }}>{p.readMin} MIN · {formatDate(p.date).toUpperCase()}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </MarketingLayout>
  )
}

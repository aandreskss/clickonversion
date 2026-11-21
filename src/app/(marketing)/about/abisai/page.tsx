/* eslint-disable @next/next/no-img-element */
import type { Metadata } from "next"
import Link from "next/link"
import { MarketingLayout } from "@/components/marketing/marketing-layout"
import { waLink } from "@/lib/whatsapp"
import "@/components/brand/abisai/abisai.css"

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.clickonversion.com"
const url = `${siteUrl}/about/abisai`

export const metadata: Metadata = {
  title: "Abisai Pérez — Meta Ads, redes sociales y landing pages | ClicKonversion",
  description: "Abisai Pérez, licenciado en Mercadeo: campañas en Meta Ads y TikTok, gestión de redes y landing pages. 6+ años con Savaya, 64+ campañas, 9,04M+ impresiones. Cofundador de ClicKonversion.",
  alternates: { canonical: url },
  openGraph: {
    type: "profile",
    title: "Abisai Pérez | ClicKonversion",
    description: "Meta Ads · Redes sociales · TikTok · Landing pages · 6+ años con Savaya.",
    url,
    siteName: "ClicKonversion",
    locale: "es_419",
    images: [{ url: `${siteUrl}/team/abisai/retrato.webp`, width: 792, height: 1080, alt: "Abisai Pérez" }],
  },
}

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      name: "Abisai Pérez",
      jobTitle: "Especialista en Meta Ads y redes sociales",
      url,
      image: `${siteUrl}/team/abisai/retrato.webp`,
      sameAs: ["https://www.instagram.com/abisai.jap"],
      worksFor: [
        { "@type": "Organization", name: "ClicKonversion", url: siteUrl },
        { "@type": "Organization", name: "Savaya" },
      ],
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Inicio", item: siteUrl },
        { "@type": "ListItem", position: 2, name: "Quiénes somos", item: `${siteUrl}/about` },
        { "@type": "ListItem", position: 3, name: "Abisai Pérez", item: url },
      ],
    },
  ],
}

export default function AbisaiPage() {
  return (
    <MarketingLayout active="about" whatsapp={{ message: "¡Hola! Soy Abisai. ¿Hablamos de tus anuncios?", replies: ["Quiero campañas en Meta Ads", "Necesito manejar mis redes", "Quiero una landing page"] }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />

      <main className="ab">

        {/* HERO */}
        <section className="ab-hero">
          <div className="ab-dots" aria-hidden="true"></div>
          <div className="ab-wrap">
            <nav aria-label="Migas de pan">
              <ol className="ck-crumbs ab-crumbs">
                <li><Link href="/">Inicio</Link></li>
                <li aria-hidden="true">/</li>
                <li><Link href="/about">Quiénes somos</Link></li>
                <li aria-hidden="true">/</li>
                <li aria-current="page">Abisai Pérez</li>
              </ol>
            </nav>
            <div className="ab-hero-grid">
              <div className="ab-hero-txt">
                <div className="ab-tags">
                  <span className="ck-tag ab-tag-lt">[META ADS]</span>
                  <span className="ck-tag ab-tag-lt">[REDES SOCIALES]</span>
                  <span className="ck-tag ab-tag-lt">[TIKTOK]</span>
                  <span className="ck-tag ab-tag-lt">[LANDING PAGES]</span>
                </div>
                <p className="ck-hand ab-hola">¡Qué tal, soy Abisai!</p>
                <h1>Abisai <span>Pérez<i>.</i></span></h1>
                <p className="ck-mono ab-role">LICENCIADO EN MERCADEO <b>·</b> META ADS <b>·</b> REDES SOCIALES</p>
                <p className="ab-pitch">Mi trabajo combina estrategia, diseño y datos. No se trata solo de publicar: se trata de construir un sistema que convierta seguidores en clientes.</p>
                <div className="ab-ctas">
                  <a className="ck-btn ck-btn-primary ab-btn-p" href={waLink("Hola Abisai, quiero hacer crecer mi marca")} target="_blank" rel="noopener noreferrer">Hablemos de tu marca ↗</a>
                  <a className="ck-btn ab-btn-ghost" href="#resultados">Ver resultados</a>
                </div>
              </div>
              <div className="ab-hero-vis">
                <div className="ab-glow" aria-hidden="true"></div>
                <div className="ab-dash" aria-label="Resumen de resultados en Meta Ads">
                  <span className="ck-mono ab-dash-h"><i></i> META ADS MANAGER · SAVAYA</span>
                  <b>9,04M+</b>
                  <span>impresiones generadas</span>
                  <div className="ab-bars" aria-hidden="true">
                    <i style={{ height: "38%" }}></i>
                    <i style={{ height: "52%" }}></i>
                    <i style={{ height: "46%" }}></i>
                    <i style={{ height: "68%" }}></i>
                    <i style={{ height: "60%" }}></i>
                    <i style={{ height: "82%" }}></i>
                    <i style={{ height: "100%" }}></i>
                  </div>
                </div>
                <img className="ab-pose-hero" src="/team/abisai/pose-senala-arriba.webp" alt="Abisai sonriendo y señalando hacia arriba con la camiseta de ClicKonversion" width={742} height={1000} />
                <span className="ab-bubble ck-hand ab-b1">los números<br />no mienten</span>
              </div>
            </div>
          </div>
        </section>

        {/* TICKER */}
        <div className="ab-ticker" aria-hidden="true">
          <div className="ab-ticker-in ck-mono">
            <span><b>3,66M+</b> alcance total</span><i>●</i>
            <span><b>9,04M+</b> impresiones</span><i>●</i>
            <span><b>64+</b> campañas gestionadas</span><i>●</i>
            <span><b>6+ años</b> con Savaya</span><i>●</i>
            <span><b>$0,02</b> costo por resultado · Mysk</span><i>●</i>
            <span><b>3,66M+</b> alcance total</span><i>●</i>
            <span><b>9,04M+</b> impresiones</span><i>●</i>
            <span><b>64+</b> campañas gestionadas</span><i>●</i>
            <span><b>6+ años</b> con Savaya</span><i>●</i>
            <span><b>$0,02</b> costo por resultado · Mysk</span><i>●</i>
          </div>
        </div>

        {/* SOBRE MÍ */}
        <section className="ab-sec">
          <div className="ab-wrap ab-about">
            <figure className="ab-portrait">
              <img src="/team/abisai/retrato.webp" alt="Abisai Pérez de brazos cruzados con camisa negra de Savaya" width={792} height={1080} />
              <figcaption>
                <b>Abisai Pérez</b>
                <span className="ck-mono">LICENCIADO EN MERCADEO</span>
              </figcaption>
            </figure>
            <div>
              <span className="ck-eyebrow"><b>01</b> · Sobre mí</span>
              <h2>Experiencia detrás de <span className="ck-hand ab-hl">cada campaña</span>.</h2>
              <p>Soy licenciado en Mercadeo y me dedico a la gestión de redes sociales y campañas publicitarias en Meta Ads.</p>
              <p>Llevo 6 años trabajando con <b>Savaya</b>, marca de calzado y moda con tienda física. Además de redes, anuncios, publicaciones y reels, ayudé a conectar la marca con radios, escuelas de modelaje, patrocinios como el Miss Carabobo y activaciones de calle.</p>
              <p>También manejo las redes de <b>Tulujo Shop VZLA</b> en TikTok, donde creé el logo de la tienda y llevo su contenido audiovisual y sus campañas, y estoy construyendo <b>MYSK</b> desde cero: logo, identidad, nombres de producto y estrategia digital.</p>
              <div className="ab-cert">
                <img src="/team/abisai/insignia-jads.webp" alt="Insignia de certificación en Facebook e Instagram Ads" width={300} height={300} />
                <div>
                  <span className="ck-mono">CERTIFICACIÓN</span>
                  <b>Metodología JADS</b>
                  <span>Facebook e Instagram Ads y Estrategia Avanzada en Publicidad Digital</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* HOY */}
        <section className="ab-sec ab-today-sec">
          <div className="ab-wrap">
            <span className="ck-eyebrow"><b>02</b> · Dónde estoy hoy</span>
            <h2>Cuatro marcas, <span className="ck-hand ab-hl">un mismo método</span>.</h2>
            <div className="ab-today">
              <article className="ab-peach">
                <span className="ck-tag">[COFUNDADOR]</span>
                <h3>ClicKonversion</h3>
                <p>Junto a Arnaldo y Yoli, llevo la parte de anuncios y redes de los negocios que acompañamos.</p>
                <Link href="/about" className="ab-link">Conocer al equipo →</Link>
              </article>
              <article className="ab-navy">
                <span className="ck-tag ab-tag-lt">[ADS · REDES · CONTENIDO]</span>
                <h3>Savaya</h3>
                <p>Gestión publicitaria integral en Meta y TikTok, creación y edición de contenido, y alianzas con eventos.</p>
                <span className="ck-mono ab-now">6+ AÑOS</span>
              </article>
              <article className="ab-sky">
                <span className="ck-tag">[TIKTOK]</span>
                <h3>Tulujo Shop VZLA</h3>
                <p>Creé el logo de la tienda y llevo su contenido audiovisual y sus campañas en TikTok.</p>
                <span className="ck-mono ab-now">HOY</span>
              </article>
              <article className="ab-lav">
                <span className="ck-tag">[MARCA PROPIA]</span>
                <h3>MYSK</h3>
                <p>Una marca construida desde cero: identidad, producto, nombres, bio y campañas activas.</p>
                <span className="ck-mono ab-now">EN CRECIMIENTO</span>
              </article>
            </div>
          </div>
        </section>

        {/* RESULTADOS */}
        <section className="ab-sec" id="resultados">
          <div className="ab-wrap">
            <div className="ab-res-head">
              <div>
                <span className="ck-eyebrow"><b>03</b> · Resultados</span>
                <h2>Trabajo con resultados reales.</h2>
                <p className="ab-lead">Cifras tomadas directamente de Meta Ads Manager. Sin redondeos creativos.</p>
              </div>
              <div className="ab-res-pose">
                <img src="/team/abisai/pose-pulgar.webp" alt="Abisai sonriendo con el pulgar arriba" width={702} height={1000} />
                <span className="ab-bubble ck-hand ab-b2">capturas reales,<br />no promesas</span>
              </div>
            </div>
            <div className="ab-cases">
              <article className="ab-case ab-case-big">
                <div className="ab-case-h">
                  <div>
                    <span className="ck-mono">SAVAYA · @SAVAYAVZLA</span>
                    <h3>Historial completo</h3>
                    <p>Gestión publicitaria integral: Meta, TikTok, creación y edición de contenido, posts.</p>
                  </div>
                  <span className="ck-mono ab-pill">64 CAMPAÑAS · JUL 2023 – AGO 2026</span>
                </div>
                <div className="ab-kpis">
                  <div><b>3,66M+</b><span>alcance</span></div>
                  <div><b>9,04M+</b><span>impresiones</span></div>
                  <div><b>64+</b><span>campañas</span></div>
                  <div><b>70,1 mil</b><span>seguidores en Instagram</span></div>
                </div>
                <figure className="ab-shot">
                  <img src="/team/abisai/ads-savaya.webp" alt="Captura de Meta Ads Manager con el historial de 64 campañas de Savaya" width={1763} height={467} />
                </figure>
              </article>
              <article className="ab-case">
                <div className="ab-case-h">
                  <div>
                    <span className="ck-mono">MYSK · @MYSK.VZLA</span>
                    <h3>Branding desde cero + ads</h3>
                    <p>Identidad, producto, bio y más de 2.400 seguidores.</p>
                  </div>
                </div>
                <div className="ab-kpis">
                  <div><b>$0,02</b><span>costo por resultado</span></div>
                  <div><b>5.385</b><span>visitas al perfil</span></div>
                  <div><b>82.205</b><span>alcance</span></div>
                  <div><b>1,90</b><span>frecuencia</span></div>
                </div>
                <figure className="ab-shot">
                  <img src="/team/abisai/ads-mysk.webp" alt="Captura de Meta Ads Manager de la campaña de Mysk" width={1393} height={365} />
                </figure>
              </article>
              <article className="ab-case">
                <div className="ab-case-h">
                  <div>
                    <span className="ck-mono">BYMARIAGONCALVES · ATELIER</span>
                    <h3>Meta Ads: leads y crecimiento</h3>
                    <p>59,4 mil seguidores. Diseñadora oficial del Miss Venezuela.</p>
                  </div>
                  <span className="ck-mono ab-pill">30 DÍAS</span>
                </div>
                <div className="ab-kpis">
                  <div><b>68.102</b><span>alcance</span></div>
                  <div><b>182.067</b><span>impresiones</span></div>
                  <div><b>$1,28</b><span>CPM promedio</span></div>
                  <div><b>2,67</b><span>frecuencia</span></div>
                </div>
                <figure className="ab-shot">
                  <img src="/team/abisai/ads-atelier.webp" alt="Captura de Meta Ads Manager de los últimos 30 días del atelier" width={1751} height={549} />
                </figure>
              </article>
            </div>
          </div>
        </section>

        {/* LO QUE HAGO */}
        <section className="ab-sec ab-do-sec">
          <div className="ab-wrap ab-do-grid">
            <div className="ab-do-side">
              <img src="/team/abisai/pose-arriba-mira.webp" alt="Abisai mirando hacia arriba y señalando con el dedo" width={1042} height={1000} />
              <span className="ab-bubble ck-hand ab-b3">¡esto es lo<br />que hago!</span>
            </div>
            <div>
              <span className="ck-eyebrow"><b>04</b> · Lo que hago</span>
              <h2>Anuncios, redes y <span className="ck-hand ab-hl">calle</span>.</h2>
              <div className="ab-do">
                <article><span className="ck-mono">01</span><h3>Meta Ads de punta a punta</h3><p>Business Manager, cuenta publicitaria y FB/IG/WhatsApp configurados; campañas de seguidores, reconocimiento y ventas por mensajes; segmentación, optimización y reporte mensual.</p></article>
                <article><span className="ck-mono">02</span><h3>Gestión de redes</h3><p>Publicaciones, reels e historias con calendario de contenido y diseño a la medida de la marca.</p></article>
                <article><span className="ck-mono">03</span><h3>Landing pages que miden</h3><p>Páginas para captar leads: quien se registra llega directo a tu WhatsApp de ventas.</p></article>
                <article><span className="ck-mono">04</span><h3>Branding desde cero</h3><p>Logo, identidad, nombres de producto y estrategia digital, como hice con MYSK.</p></article>
                <article><span className="ck-mono">05</span><h3>TikTok</h3><p>Contenido audiovisual y campañas para marcas que venden en TikTok.</p></article>
                <article><span className="ck-mono">06</span><h3>Activaciones y alianzas</h3><p>Radios, escuelas de modelaje, patrocinios como el Miss Carabobo y activaciones de calle.</p></article>
              </div>
              <p className="ab-do-note">¿Quieres los planes? <Link href="/pricing">Mira los precios de ClicKonversion →</Link></p>
            </div>
          </div>
        </section>

        {/* DE LA PANTALLA A LA CALLE */}
        <section className="ab-sec ab-street-sec">
          <div className="ab-wrap">
            <div className="ab-head-split">
              <div>
                <span className="ck-eyebrow" style={{ color: "rgba(255,248,240,.6)" }}><b>05</b> · De la pantalla a la calle</span>
                <h2>Las marcas también se viven en persona.</h2>
              </div>
              <p>Activaciones, eventos y alianzas que luego se convierten en contenido.</p>
            </div>
            <div className="ab-street">
              <figure className="s1">
                <img src="/team/abisai/miss-carabobo.webp" alt="Abisai y Yoli con candidatas del Miss Carabobo 2024 en la tienda de Savaya" width={720} height={881} />
                <figcaption><span className="ck-mono">PATROCINIO</span>Miss Carabobo 2024 en Savaya</figcaption>
              </figure>
              <figure className="s2">
                <img src="/team/abisai/savaya-evento.webp" alt="Abisai, Yoli y dos modelos junto al pendón de Savaya en un centro comercial" width={800} height={711} />
                <figcaption><span className="ck-mono">ACTIVACIÓN</span>Savaya en el centro comercial</figcaption>
              </figure>
              <figure className="s3">
                <img src="/team/abisai/savaya-navidad.webp" alt="Abisai sonriendo con gorra de Savaya junto a cajas decoradas de Navidad" width={720} height={902} />
                <figcaption><span className="ck-mono">CONTENIDO</span>Campaña de Navidad</figcaption>
              </figure>
            </div>
          </div>
        </section>

        {/* LO QUE ME MUEVE */}
        <section className="ab-sec">
          <div className="ab-wrap">
            <div className="ab-fam">
              <figure className="ab-fam-photo">
                <img src="/team/abisai/vida-familia.webp" alt="Abisai de rodillas besando la barriga de su pareja embarazada junto a un árbol" width={720} height={959} />
              </figure>
              <div className="ab-fam-txt">
                <span className="ck-eyebrow"><b>06</b> · Lo que me mueve</span>
                <h2>Mi familia, <span className="ck-hand ab-hl">mi motor</span>.</h2>
                <p>Detrás de cada campaña hay alguien que trabaja por los suyos. Mi familia es mi motor, y cada logro también es para ellos.</p>
                <span className="ck-hand ab-fam-note">lo más importante ♥</span>
              </div>
            </div>
          </div>
        </section>

        {/* DETRÁS DE LA PANTALLA */}
        <section className="ab-sec ab-life-sec">
          <div className="ab-wrap">
            <div className="ab-head-split">
              <div>
                <span className="ck-eyebrow"><b>07</b> · Detrás de la pantalla</span>
                <h2>Una persona real detrás de cada anuncio.</h2>
              </div>
              <p className="ck-hand ab-note">sí, soy yo el que responde</p>
            </div>
            <div className="ab-polas">
              <figure className="ab-pola p1">
                <img src="/team/abisai/vida-galeria.webp" alt="Abisai de pie en una galería de arte" width={600} height={800} />
                <figcaption className="ck-hand">día de museo</figcaption>
              </figure>
              <figure className="ab-pola p2">
                <img src="/team/abisai/vida-cine.webp" alt="Selfie de Abisai con dos amigas en el cine" width={900} height={675} />
                <figcaption className="ck-hand">plan de cine</figcaption>
              </figure>
              <figure className="ab-pola p3">
                <img src="/team/abisai/vida-paramo.webp" alt="Selfie de Abisai junto a una laguna en la montaña" width={900} height={675} />
                <figcaption className="ck-hand">en el páramo</figcaption>
              </figure>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="ab-cta">
          <div className="ab-wrap ab-cta-grid">
            <div>
              <span className="ck-eyebrow" style={{ color: "rgba(255,248,240,.6)" }}>Hablemos</span>
              <h2>Hagamos crecer tu marca con una estrategia que <span className="ab-o">sí convierte</span>.</h2>
              <p>Cuéntame qué vendes y qué has probado. Te digo cómo lo pondría a trabajar en Meta Ads y en tus redes.</p>
              <div className="ab-ctas">
                <a className="ck-btn ck-btn-primary ab-btn-p" href={waLink("Hola Abisai, quiero hacer crecer mi marca")} target="_blank" rel="noopener noreferrer">Escríbeme por WhatsApp ↗</a>
                <a className="ck-btn ab-btn-ghost" href="https://www.instagram.com/abisai.jap" target="_blank" rel="noopener noreferrer">Instagram @abisai.jap ↗</a>
              </div>
              <p className="ck-hand ab-sign">Un abrazo, Abisai</p>
            </div>
            <div className="ab-cta-pose">
              <img src="/team/abisai/pose-brazos.webp" alt="Abisai de brazos cruzados con la camiseta de ClicKonversion" width={594} height={1000} />
            </div>
          </div>
        </section>

      </main>
    </MarketingLayout>
  )
}

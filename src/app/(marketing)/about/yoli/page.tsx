/* eslint-disable @next/next/no-img-element */
import type { Metadata } from "next"
import Link from "next/link"
import { MarketingLayout } from "@/components/marketing/marketing-layout"
import { Isotipo } from "@/components/brand/isotipo"
import { waLink } from "@/lib/whatsapp"
import "@/components/brand/yoli/yoli.css"

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.clickonversion.com"
const url = `${siteUrl}/about/yoli`

export const metadata: Metadata = {
  title: "Yolimar Padrón — Mercadóloga, estratega digital e IA aplicada al marketing | ClicKonversion",
  description: "Yolimar Padrón (Yoli): estrategia de contenido para TikTok e Instagram, relaciones públicas y eventos, gestión de marcas e IA para marketing. Docente universitaria desde 2007. Cofundadora de ClicKonversion.",
  alternates: { canonical: url },
  openGraph: {
    type: "profile",
    title: "Yolimar Padrón | ClicKonversion",
    description: "Mercadóloga · Estratega digital · IA aplicada al marketing · Docente universitaria desde 2007.",
    url,
    siteName: "ClicKonversion",
    locale: "es_419",
    images: [{ url: `${siteUrl}/team/yoli/retrato.webp`, width: 432, height: 592, alt: "Yolimar Padrón" }],
  },
}

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      name: "Yolimar Padrón",
      jobTitle: "Mercadóloga, Estratega Digital e IA aplicada al Marketing",
      url,
      image: `${siteUrl}/team/yoli/retrato.webp`,
      alumniOf: [
        { "@type": "CollegeOrUniversity", name: "UNESR" },
        { "@type": "CollegeOrUniversity", name: "UPEL" },
        { "@type": "CollegeOrUniversity", name: "Universidad Central de Venezuela" },
      ],
      worksFor: [
        { "@type": "Organization", name: "ClicKonversion", url: siteUrl },
        { "@type": "Organization", name: "Savaya" },
      ],
      address: { "@type": "PostalAddress", addressLocality: "Los Guayos", addressRegion: "Carabobo", addressCountry: "VE" },
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Inicio", item: siteUrl },
        { "@type": "ListItem", position: 2, name: "Quiénes somos", item: `${siteUrl}/about` },
        { "@type": "ListItem", position: 3, name: "Yolimar Padrón", item: url },
      ],
    },
  ],
}

export default function YoliPage() {
  return (
    <MarketingLayout active="about" whatsapp={{ message: "¡Hola! Soy Yoli. ¿Hablamos de tu marca?", replies: ["Quiero contenido para mi marca", "Necesito relaciones públicas", "Quiero un taller de IA"] }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />

      <main className="yo">

        {/* HERO */}
        <section className="yo-hero">
          <div className="yo-wrap">
            <nav aria-label="Migas de pan">
              <ol className="ck-crumbs">
                <li><Link href="/">Inicio</Link></li>
                <li aria-hidden="true">/</li>
                <li><Link href="/about">Quiénes somos</Link></li>
                <li aria-hidden="true">/</li>
                <li aria-current="page" style={{ color: "#010E25", fontWeight: "700" }}>Yolimar Padrón</li>
              </ol>
            </nav>
            <div className="yo-hero-grid">
              <div className="yo-hero-txt">
                <div className="yo-tags">
                  <span className="ck-tag">[MERCADEO]</span>
                  <span className="ck-tag">[CONTENIDO]</span>
                  <span className="ck-tag">[RR. PP.]</span>
                  <span className="ck-tag">[IA]</span>
                  <span className="ck-tag">[DOCENCIA]</span>
                </div>
                <p className="ck-hand yo-hola">¡Hola, soy Yoli!</p>
                <h1>Yolimar <span className="yo-h1-2">Padrón<span className="yo-dot">.</span></span></h1>
                <p className="ck-mono yo-role">MERCADÓLOGA <i>·</i> ESTRATEGA DIGITAL <i>·</i> IA APLICADA AL MARKETING</p>
                <p className="yo-pitch">Convierto marcas en conversación: estrategia de contenido para TikTok e Instagram, relaciones públicas y eventos, y la inteligencia artificial como aliada para crear más y mejor. Enseño marketing en la universidad desde 2007, así que te lo explico claro.</p>
                <div className="yo-ctas">
                  <a className="ck-btn ck-btn-primary" href={waLink("Hola Yoli, quiero hablar de mi marca")} target="_blank" rel="noopener noreferrer">Hablemos de tu marca ↗</a>
                  <a className="ck-btn ck-btn-line" href="#trayectoria">Ver mi trayectoria</a>
                </div>
                <p className="ck-mono yo-loc"><span className="ck-dot"></span> Los Guayos, Carabobo · disponible para trabajo remoto</p>
              </div>
              <div className="yo-hero-vis">
                <img className="yo-pose-hero" src="/team/yoli/pose-arriba.webp" alt="Yoli sonriendo y señalando hacia arriba con la camiseta de ClicKonversion" width={690} height={1000} />
                <span className="yo-iso-bg" aria-hidden="true">
                  <Isotipo color="#FE5C02" width={520} style={{ width: "100%", height: "auto" }} />
                </span>
                <span className="yo-bubble ck-hand yo-b1">te lo explico<br />como en clase</span>
                <div className="yo-float yo-f1">
                  <span className="ck-mono">COMUNIDAD DIGITAL · @SAVAYAVZLA</span>
                  <b>+80%</b>
                  <span>en TikTok e Instagram</span>
                </div>
                <div className="yo-float yo-f2">
                  <span className="ck-mono">DOCENTE DESDE</span>
                  <b>2007</b>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* BANDA */}
        <div className="yo-band" aria-hidden="true">
          <div className="yo-band-in ck-mono">
            <span>Estrategia de contenido</span><i>✦</i>
            <span>TikTok</span><i>✦</i>
            <span>Instagram</span><i>✦</i>
            <span>Relaciones públicas</span><i>✦</i>
            <span>Eventos</span><i>✦</i>
            <span>Gestión de marcas</span><i>✦</i>
            <span>IA para marketing</span><i>✦</i>
            <span>Docencia</span><i>✦</i>
            <span>Locución</span><i>✦</i>
            <span>Estrategia de contenido</span><i>✦</i>
            <span>TikTok</span><i>✦</i>
            <span>Instagram</span><i>✦</i>
            <span>Relaciones públicas</span><i>✦</i>
            <span>Eventos</span><i>✦</i>
            <span>Gestión de marcas</span><i>✦</i>
            <span>IA para marketing</span><i>✦</i>
            <span>Docencia</span><i>✦</i>
            <span>Locución</span><i>✦</i>
          </div>
        </div>

        {/* SOBRE MÍ + LOGROS */}
        <section className="yo-sec">
          <div className="yo-wrap yo-about">
            <div>
              <span className="ck-eyebrow"><b>01</b> · Sobre mí</span>
              <h2>Una marca que <span className="ck-hand yo-hl">habla</span> vende más.</h2>
              <p>Soy licenciada en Administración, mención Mercadeo, con especialización en docencia universitaria y locutora certificada. Combino estrategia, comunicación y tecnología: planifico el contenido, cuido la voz de la marca, la llevo a eventos y medios, y uso herramientas de inteligencia artificial para producir más rápido sin perder lo humano.</p>
              <p>En el aula aprendí a explicar lo complejo con palabras simples. En las marcas aprendí que la constancia y la cercanía construyen comunidad.</p>
            </div>
            <div className="yo-stats">
              <div className="yo-stat yo-lav"><b>+80%</b><span>de crecimiento de la comunidad digital de Savaya en TikTok e Instagram.</span></div>
              <div className="yo-stat yo-peach"><b>+20%</b><span>de reconocimiento de marca durante 2025 con campañas de alto alcance.</span></div>
              <div className="yo-stat yo-mint"><b>10+</b><span>marcas nacionales e internacionales gestionadas como social media manager.</span></div>
              <div className="yo-stat yo-navy"><b>2007</b><span>el año en que empecé a enseñar marketing en la universidad. Sigo haciéndolo.</span></div>
            </div>
          </div>
        </section>

        {/* DÓNDE ESTOY HOY */}
        <section className="yo-sec yo-today-sec">
          <div className="yo-wrap">
            <span className="ck-eyebrow"><b>02</b> · Dónde estoy hoy</span>
            <h2>Tres frentes, <span className="ck-hand yo-hl">una misma voz</span>.</h2>
            <div className="yo-today">
              <article className="yo-card yo-peach">
                <span className="ck-tag">[ESTRATEGA DIGITAL · RR. PP.]</span>
                <h3>Savaya</h3>
                <p>Lidero la estrategia de contenido en TikTok e Instagram y las relaciones públicas de la marca, con presencia en eventos regionales como el Miss Carabobo.</p>
                <span className="ck-mono yo-now">MAR 2024 · HOY</span>
              </article>
              <article className="yo-card yo-lav">
                <span className="ck-tag">[COFUNDADORA]</span>
                <h3>ClicKonversion</h3>
                <p>Junto a Arnaldo y Abisai, aporto la mirada de marca y comunicación: contenido, voz y relaciones públicas para los negocios que acompañamos.</p>
                <Link href="/about" className="yo-link">Conocer al equipo →</Link>
              </article>
              <article className="yo-card yo-sky">
                <span className="ck-tag">[DOCENTE UNIVERSITARIA]</span>
                <h3>Aula virtual y presencial</h3>
                <p>Mercadeo y Comunicación Social en UNITEC, Academia Valencia, UJAP, CEUJAP, UAM y CUAM. Facilito procesos de aprendizaje con herramientas tecnológicas.</p>
                <span className="ck-mono yo-now">2007 · HOY</span>
              </article>
            </div>
          </div>
        </section>

        {/* TRAYECTORIA */}
        <section className="yo-sec" id="trayectoria">
          <div className="yo-wrap yo-tl-grid">
            <div>
              <span className="ck-eyebrow"><b>03</b> · Trayectoria</span>
              <h2>Experiencia de alto impacto.</h2>
              <ol className="yo-tl">
                <li className="cur">
                  <span className="ck-mono yo-when">MAR 2024 – HOY</span>
                  <div>
                    <h3>Estratega digital y relacionista pública <span>· Savaya C.A.</span></h3>
                    <ul>
                      <li>Crecimiento del 80 % de la comunidad digital con estrategias de contenido en TikTok e Instagram.</li>
                      <li>Incremento del 20 % en reconocimiento de marca durante 2025.</li>
                      <li>Presencia estratégica y relaciones públicas en eventos como el Miss Carabobo.</li>
                    </ul>
                  </div>
                </li>
                <li>
                  <span className="ck-mono yo-when">MAY 2020 – DIC 2025</span>
                  <div>
                    <h3>Consultora de estrategia de marketing <span>· ArtMurale (Canadá)</span></h3>
                    <ul>
                      <li>Plan estratégico integral para el lanzamiento y posicionamiento de la marca en el mercado canadiense.</li>
                      <li>Ecosistema de contenidos e identidad digital inicial del proyecto.</li>
                    </ul>
                  </div>
                </li>
                <li>
                  <span className="ck-mono yo-when">2020 – 2025</span>
                  <div>
                    <h3>Gestión de marcas <span>· Social Media Manager</span></h3>
                    <ul>
                      <li>Estrategias on y off line para más de 10 clientes, entre ellos Biosuplisel, Distalim C.A. y el Colegio de Fisioterapeutas de Carabobo.</li>
                    </ul>
                  </div>
                </li>
                <li className="cur">
                  <span className="ck-mono yo-when">2007 – HOY</span>
                  <div>
                    <h3>Docente universitaria y facilitadora bimodal</h3>
                    <ul>
                      <li>Educación virtual y presencial para las carreras de Mercadeo y Comunicación Social.</li>
                      <li>Aprendizaje enfocado en herramientas tecnológicas y marketing tradicional y digital.</li>
                    </ul>
                  </div>
                </li>
              </ol>
            </div>
            <aside className="yo-tl-side">
              <img className="yo-pose-tl" src="/team/yoli/pose-pulgar.webp" alt="Yoli sonriendo y señalando con el pulgar hacia su trayectoria" width={631} height={1000} />
              <span className="yo-bubble ck-hand yo-b2">¡esto sí lo viví!</span>
              <div className="yo-side-card">
                <span className="ck-mono">MARCAS Y EVENTOS</span>
                <div className="yo-chips">
                  <span>Savaya</span>
                  <span>ArtMurale</span>
                  <span>Biosuplisel</span>
                  <span>Distalim C.A.</span>
                  <span>Colegio de Fisioterapeutas de Carabobo</span>
                  <span>Miss Carabobo</span>
                </div>
              </div>
            </aside>
          </div>
        </section>

        {/* LO QUE HAGO */}
        <section className="yo-sec yo-do-sec">
          <div className="yo-wrap">
            <div className="yo-head-split">
              <div>
                <span className="ck-eyebrow"><b>04</b> · Lo que hago</span>
                <h2>Estrategia con voz propia.</h2>
              </div>
              <p>Lo que más me piden las marcas, y lo que hago todos los días.</p>
            </div>
            <div className="yo-do-wrap">
              <div className="yo-do-pose">
                <img src="/team/yoli/pose-senala-lado.webp" alt="Yoli señalando sus servicios" width={664} height={1000} />
                <span className="yo-bubble ck-hand">¡mira!</span>
              </div>
              <div className="yo-do">
                <article className="yo-lav"><span className="ck-mono">01</span><h3>Estrategia de contenido</h3><p>Calendario, formatos y guiones para TikTok e Instagram que hacen crecer la comunidad.</p></article>
                <article className="yo-peach"><span className="ck-mono">02</span><h3>Gestión de marcas</h3><p>Identidad digital, tono y ecosistema de contenidos para marcas nuevas o que se renuevan.</p></article>
                <article className="yo-mint"><span className="ck-mono">03</span><h3>Relaciones públicas y eventos</h3><p>Presencia de marca en eventos, alianzas y medios, de la planificación a la cobertura.</p></article>
                <article className="yo-sky"><span className="ck-mono">04</span><h3>IA para marketing</h3><p>Herramientas de inteligencia artificial para crear contenido y ganar productividad.</p></article>
                <article className="yo-white"><span className="ck-mono">05</span><h3>Formación para equipos</h3><p>Talleres de marketing digital e IA, en modalidad virtual o presencial.</p></article>
                <article className="yo-white"><span className="ck-mono">06</span><h3>Locución y oratoria</h3><p>Voz para piezas de audio y video, y oratoria de alto impacto para presentaciones.</p></article>
              </div>
            </div>
          </div>
        </section>

        {/* FORMACIÓN */}
        <section className="yo-edu-sec">
          <div className="yo-wrap yo-edu-grid">
            <div>
              <span className="ck-eyebrow" style={{ color: "rgba(255,248,240,.6)" }}><b>05</b> · Formación</span>
              <h2>Siempre aprendiendo, <span className="ck-hand yo-hl">siempre enseñando</span>.</h2>
              <ul className="yo-edu">
                <li><span className="ck-mono">2006</span><div><b>Licenciatura en Administración, mención Mercadeo</b><span>UNESR</span></div></li>
                <li><span className="ck-mono">2011</span><div><b>Especialización en Docencia Universitaria</b><span>UPEL</span></div></li>
                <li><span className="ck-mono">2013</span><div><b>Locutora certificada</b><span>Universidad Central de Venezuela</span></div></li>
                <li><span className="ck-mono">DIPLOMADOS</span><div><b>Comunicación Digital · Docente Bimodal</b><span>UAM · CEUJAP</span></div></li>
                <li className="new"><span className="ck-mono">2025</span><div><b>Transinclusión educativa, tecnoeducación e IA</b><span>UNITEC · taller de 60 horas académicas</span></div></li>
              </ul>
            </div>
            <div className="yo-edu-vis">
              <img className="yo-pose-edu" src="/team/yoli/pose-cruzada-senala.webp" alt="Yoli de brazos cruzados señalando su formación" width={589} height={1000} />
              <span className="yo-bubble ck-hand yo-b3">¡nunca dejo<br />de aprender!</span>
              <figure className="yo-cert">
                <img src="/team/yoli/certificado-unitec.webp" alt="Certificado de UNITEC del taller Transinclusión educativa, tecnoeducación e IA" width={650} height={428} />
                <figcaption className="ck-mono">CERTIFICACIÓN UNITEC · 2025</figcaption>
              </figure>
            </div>
          </div>
        </section>

        {/* HERRAMIENTAS */}
        <section className="yo-sec">
          <div className="yo-wrap">
            <div className="yo-tools-head">
              <div>
                <span className="ck-eyebrow"><b>06</b> · Habilidades</span>
                <h2>La caja de herramientas.</h2>
              </div>
              <div className="yo-tools-pose">
                <img src="/team/yoli/pose-brazos-seria.webp" alt="Yoli de brazos cruzados con una sonrisa segura" width={638} height={1000} />
              </div>
            </div>
            <div className="yo-tools">
              <div className="yo-lav">
                <span className="ck-mono">IA PARA MARKETING</span>
                <div className="yo-chips">
                  <span>Creación de contenido con IA</span>
                  <span>Productividad con IA</span>
                </div>
              </div>
              <div className="yo-peach">
                <span className="ck-mono">MARKETING</span>
                <div className="yo-chips">
                  <span>Analítica de métricas</span>
                  <span>Diseño digital</span>
                  <span>Edición de video básica</span>
                  <span>Copywriting</span>
                  <span>TikTok</span>
                  <span>Instagram</span>
                </div>
              </div>
              <div className="yo-mint">
                <span className="ck-mono">HABILIDADES BLANDAS</span>
                <div className="yo-chips">
                  <span>Comunicación asíncrona</span>
                  <span>Gestión de proyectos remotos</span>
                  <span>Oratoria de alto impacto</span>
                  <span>Relaciones públicas</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* DETRÁS DE LA PANTALLA */}
        <section className="yo-sec yo-life-sec">
          <div className="yo-wrap">
            <div className="yo-head-split">
              <div>
                <span className="ck-eyebrow"><b>07</b> · Detrás de la pantalla</span>
                <h2>Una persona real detrás de cada marca.</h2>
              </div>
              <p className="ck-hand yo-note">sí, soy yo la que responde</p>
            </div>
            <div className="yo-polas">
              <figure className="yo-pola p1">
                <img src="/team/yoli/con-abisai-savaya.webp" alt="Yoli y Abisai sonriendo en la oficina de Savaya" width={720} height={792} />
                <figcaption className="ck-hand">con Abisai en Savaya</figcaption>
              </figure>
              <figure className="yo-pola p2">
                <img src="/team/yoli/grado.webp" alt="Yoli con toga y birrete el día de su graduación" width={980} height={720} />
                <figcaption className="ck-hand">día de grado</figcaption>
              </figure>
              <figure className="yo-pola p3">
                <img src="/team/yoli/certificado-unitec.webp" alt="Certificado de UNITEC" width={650} height={428} />
                <figcaption className="ck-hand">IA + educación</figcaption>
              </figure>
              <figure className="yo-pola p4">
                <img src="/team/yoli/con-amiga.webp" alt="Yoli abrazada a una amiga, las dos sonriendo" width={640} height={826} />
                <figcaption className="ck-hand">con mi gente</figcaption>
              </figure>
              <figure className="yo-pola p5">
                <img src="/team/yoli/camisa-verde.webp" alt="Yoli de espaldas con camisa verde y lentes de sol, mirando a cámara" width={640} height={889} />
                <figcaption className="ck-hand">¡modo evento!</figcaption>
              </figure>
            </div>
          </div>
        </section>

        {/* LO QUE ME MUEVE */}
        <section className="yo-sec yo-mom-sec">
          <div className="yo-wrap">
            <div className="yo-mom">
              <div className="yo-mom-art" aria-hidden="true">
                <svg viewBox="0 0 220 200" className="yo-heart">
                  <path d="M110 178 C 52 136, 18 104, 18 66 C 18 38, 40 20, 64 20 C 84 20, 100 32, 110 50 C 120 32, 136 20, 156 20 C 180 20, 202 38, 202 66 C 202 104, 168 136, 110 178 Z" fill="#FFDCC7" stroke="#010E25" strokeWidth="4" strokeLinejoin="round" />
                  <path d="M64 52 C 52 56, 44 66, 44 78" fill="none" stroke="#FE5C02" strokeWidth="5" strokeLinecap="round" />
                </svg>
                <span className="ck-hand yo-mom-note">mi motor</span>
              </div>
              <div className="yo-mom-txt">
                <span className="ck-eyebrow"><b>08</b> · Lo que me mueve</span>
                <h2>Antes que todo, <span className="ck-hand yo-hl">soy mamá</span>.</h2>
                <p>Mi hija es lo que más quiero en el mundo. Por ella me levanto con ganas cada día y le pongo corazón a todo lo que hago: a cada clase, a cada marca y a cada historia que cuento.</p>
                <p>Ser mamá me enseñó paciencia, creatividad y a escuchar de verdad. Eso mismo es lo que traigo a mi trabajo.</p>
                <div className="yo-mom-tags">
                  <span>Mamá de tiempo completo</span>
                  <span>Docente</span>
                  <span>Mercadóloga</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="yo-cta">
          <div className="yo-wrap yo-cta-grid">
            <div>
              <span className="ck-eyebrow" style={{ color: "rgba(255,248,240,.6)" }}>Hablemos</span>
              <h2>¿Tu marca necesita <span className="yo-o">voz</span>?</h2>
              <p>Cuéntame qué vendes, a quién le hablas y dónde te mueves. Te digo por dónde empezaría con tu contenido.</p>
              <div className="yo-ctas">
                <a className="ck-btn ck-btn-primary" href={waLink("Hola Yoli, quiero hablar de mi marca")} target="_blank" rel="noopener noreferrer" style={{ borderColor: "#FFF8F0", boxShadow: "0 4px 0 #FFF8F0" }}>Escríbeme por WhatsApp ↗</a>
                <Link href="/about" className="ck-btn yo-btn-ghost">Ver el equipo</Link>
              </div>
              <p className="ck-hand yo-sign">Un abrazo, Yoli</p>
            </div>
            <div className="yo-cta-pose">
              <img src="/team/yoli/pose-brazos-sonrisa.webp" alt="Yoli sonriendo de brazos cruzados" width={650} height={1000} />
            </div>
          </div>
        </section>

      </main>
    </MarketingLayout>
  )
}

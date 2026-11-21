# Implementar la página de Abisai — /about/abisai (escritorio + móvil)

Este es el único archivo que necesitas. Contiene las instrucciones, el HTML de referencia y el CSS final del diseño aprobado en Claude Design.
Las imágenes ya están en `public/team/abisai/`.

## Instrucciones para Claude Code

Implementa la página de perfil de Abisai Pérez en `/about/abisai`. Debe verse igual que el HTML y el CSS de referencia de abajo, en escritorio y en móvil. Sigue el mismo patrón de `src/app/(marketing)/about/arnaldo/page.tsx` y de `/about/yoli`.

1. **Página:** crea `src/app/(marketing)/about/abisai/page.tsx` como Server Component.
   - Envuélvela en `<MarketingLayout active="about" whatsapp={{ message: "¡Hola! Soy Abisai. ¿Hablamos de tus anuncios?", replies: ["Quiero campañas en Meta Ads", "Necesito manejar mis redes", "Quiero una landing page"] }}>`.
   - Convierte el HTML a JSX: `class` → `className`, estilos en línea → objetos, `<img>` con `width` y `height`. Usa `next/image` donde no rompa el diseño; si no, `<img>` con `/* eslint-disable @next/next/no-img-element */`, como en la página de Arnaldo.
2. **Clases del canvas → clases del sitio:**
   - `tag` → `ck-tag`
   - `eyebrow` → `ck-eyebrow`
   - `crumbs` → `ck-crumbs`
   - `btn` → `ck-btn`
   - `btn-primary` → `ck-btn-primary`
   - `hand` → `ck-hand`
   - `mono` → `ck-mono`

   Las clases `ab-*` se quedan igual.
3. **CSS:** crea `src/components/brand/abisai/abisai.css` con el CSS de referencia e impórtalo desde la página. Reemplaza `.still .ab-ticker-in` por nada. No toques `brand.css`.
4. **Enlaces:**
   - Los `https://wa.me/?text=...` pasan a `waLink("Hola Abisai, quiero hacer crecer mi marca")` de `@/lib/whatsapp`.
   - "Conocer al equipo" va a `/about`.
   - El enlace a precios va a `/pricing`.
   - Instagram va a `https://www.instagram.com/abisai.jap` con `target="_blank" rel="noopener noreferrer"`.
5. **SEO:**
   - `metadata` con title `"Abisai Pérez — Meta Ads, redes sociales y landing pages | ClicKonversion"`.
   - Description: `"Abisai Pérez, licenciado en Mercadeo: campañas en Meta Ads y TikTok, gestión de redes y landing pages. 6+ años con Savaya, 64+ campañas, 9,04M+ impresiones. Cofundador de ClicKonversion."`
   - Canonical `/about/abisai`, Open Graph con `/team/abisai/retrato.webp`.
   - JSON-LD `Person` + `BreadcrumbList` (Inicio › Quiénes somos › Abisai Pérez), escapando `<` como en la página de Arnaldo.
   - En `Person`:
     - `jobTitle`: `"Especialista en Meta Ads y redes sociales"`.
     - `worksFor`: ClicKonversion y Savaya.
     - `sameAs`: `https://www.instagram.com/abisai.jap`.
   - Agrega `/about/abisai` a `src/app/sitemap.ts`.
6. **Tarjeta del equipo:** en `src/data/team.ts`, reemplaza los marcadores de Abisai:
   - name: `"Abisai Pérez"`
   - role: `"META ADS · REDES · LANDING PAGES"`
   - bio: `"Soy licenciado en Mercadeo y llevo 6 años con Savaya. Combino estrategia, diseño y datos para que los seguidores se conviertan en clientes."`
   - years: `"6"`; yearsArea: `"AÑOS CON SAVAYA"`
   - tags: `{ label: "[META ADS]", bg: "#FFDCC7" }`, `{ label: "[TIKTOK]", bg: "#D6EBFF" }`
   - photo: `"/team/abisai/retrato.webp"`
   - cv: `"/about/abisai"`
7. **Móvil:** el CSS ya trae las reglas para ≤ 1040, ≤ 960 y ≤ 640 px. Revisa con Playwright a 360, 390, 768 y 1440 px:
   - Nada provoca scroll horizontal. Las capturas de Ads Manager deslizan dentro de su caja a propósito.
   - Los carruseles deslizan: "Dónde estoy hoy", "De la pantalla a la calle" y las polaroids.
   - Los botones del hero ocupan todo el ancho en móvil.
   - Las burbujas naranjas no tapan la cara de Abisai. Si alguna la tapa, muévela.
   - Las poses recortadas (`pose-*.webp`) tienen fondo transparente, también entre brazo y torso; no les pongas fondo ni borde.
8. **Verificación:** corre `npx tsc --noEmit`, `npx eslint` sobre los archivos nuevos y `npm run build`, y confirma que `/about/abisai` sale estática.

**Reglas de marca:**
- El naranja `#FE5C02` nunca va de fondo de sección; solo en botones, burbujas, isotipo y palabras clave.
- No inventes cifras. Todas salen de su brochure y de las capturas de Meta Ads Manager.
- No muestres su teléfono ni su correo personal; el contacto va por el WhatsApp de la agencia y su Instagram.
- No publiques los precios de su brochure; la página enlaza a `/pricing`.

## Imágenes (ya en `public/team/abisai/`)

| Archivo | Dónde va |
|---------|----------|
| `pose-senala-arriba.webp` | Hero: señala la tarjeta de Meta Ads |
| `pose-pulgar.webp` | Resultados: pulgar arriba |
| `pose-arriba-mira.webp` | «Lo que hago» |
| `pose-brazos.webp` | CTA final |
| `retrato.webp` | «Sobre mí», tarjeta del equipo y Open Graph |
| `insignia-jads.webp` | Certificación JADS |
| `ads-savaya.webp`, `ads-mysk.webp`, `ads-atelier.webp` | Capturas de Meta Ads Manager |
| `miss-carabobo.webp`, `savaya-evento.webp`, `savaya-navidad.webp` | «De la pantalla a la calle» |
| `vida-familia.webp` | «Lo que me mueve» |
| `vida-galeria.webp`, `vida-cine.webp`, `vida-paramo.webp` | Polaroids |

## HTML de referencia

```html
<main class="ab">

<!-- HERO -->
<section class="ab-hero">
<div class="ab-dots" aria-hidden="true"></div>
<div class="ab-wrap">
<nav aria-label="Migas de pan"><ol class="crumbs ab-crumbs"><li><a href="/">Inicio</a></li><li aria-hidden="true">/</li><li><a href="/about">Quiénes somos</a></li><li aria-hidden="true">/</li><li aria-current="page">Abisai Pérez</li></ol></nav>
<div class="ab-hero-grid">
<div class="ab-hero-txt">
<div class="ab-tags"><span class="tag ab-tag-lt">[META ADS]</span><span class="tag ab-tag-lt">[REDES SOCIALES]</span><span class="tag ab-tag-lt">[TIKTOK]</span><span class="tag ab-tag-lt">[LANDING PAGES]</span></div>
<p class="hand ab-hola">¡Qué tal, soy Abisai!</p>
<h1>Abisai <span>Pérez<i>.</i></span></h1>
<p class="mono ab-role">LICENCIADO EN MERCADEO <b>·</b> META ADS <b>·</b> REDES SOCIALES</p>
<p class="ab-pitch">Mi trabajo combina estrategia, diseño y datos. No se trata solo de publicar: se trata de construir un sistema que convierta seguidores en clientes.</p>
<div class="ab-ctas"><a class="btn btn-primary ab-btn-p" href="https://wa.me/?text=Hola%20Abisai%2C%20quiero%20hacer%20crecer%20mi%20marca">Hablemos de tu marca ↗</a><a class="btn ab-btn-ghost" href="#resultados">Ver resultados</a></div>
</div>
<div class="ab-hero-vis">
<div class="ab-glow" aria-hidden="true"></div>
<div class="ab-dash" aria-label="Resumen de resultados en Meta Ads">
<span class="mono ab-dash-h"><i></i> META ADS MANAGER · SAVAYA</span>
<b>9,04M+</b><span>impresiones generadas</span>
<div class="ab-bars" aria-hidden="true"><i style="height:38%"></i><i style="height:52%"></i><i style="height:46%"></i><i style="height:68%"></i><i style="height:60%"></i><i style="height:82%"></i><i style="height:100%"></i></div>
</div>
<img class="ab-pose-hero" src="/team/abisai/pose-senala-arriba.webp" alt="Abisai sonriendo y señalando hacia arriba con la camiseta de ClicKonversion" width="742" height="1000"/>
<span class="ab-bubble hand ab-b1">los números<br/>no mienten</span>
</div>
</div>
</div>
</section>

<!-- TICKER -->
<div class="ab-ticker" aria-hidden="true"><div class="ab-ticker-in mono"><span><b>3,66M+</b> alcance total</span><i>●</i><span><b>9,04M+</b> impresiones</span><i>●</i><span><b>64+</b> campañas gestionadas</span><i>●</i><span><b>6+ años</b> con Savaya</span><i>●</i><span><b>$0,02</b> costo por resultado · Mysk</span><i>●</i><span><b>3,66M+</b> alcance total</span><i>●</i><span><b>9,04M+</b> impresiones</span><i>●</i><span><b>64+</b> campañas gestionadas</span><i>●</i><span><b>6+ años</b> con Savaya</span><i>●</i><span><b>$0,02</b> costo por resultado · Mysk</span><i>●</i></div></div>

<!-- SOBRE MÍ -->
<section class="ab-sec">
<div class="ab-wrap ab-about">
<figure class="ab-portrait"><img src="/team/abisai/retrato.webp" alt="Abisai Pérez de brazos cruzados con camisa negra de Savaya" width="792" height="1080"/><figcaption><b>Abisai Pérez</b><span class="mono">LICENCIADO EN MERCADEO</span></figcaption></figure>
<div>
<span class="eyebrow"><b>01</b> · Sobre mí</span>
<h2>Experiencia detrás de <span class="hand ab-hl">cada campaña</span>.</h2>
<p>Soy licenciado en Mercadeo y me dedico a la gestión de redes sociales y campañas publicitarias en Meta Ads.</p>
<p>Llevo 6 años trabajando con <b>Savaya</b>, marca de calzado y moda con tienda física. Además de redes, anuncios, publicaciones y reels, ayudé a conectar la marca con radios, escuelas de modelaje, patrocinios como el Miss Carabobo y activaciones de calle.</p>
<p>También manejo las redes de <b>Tulujo Shop VZLA</b> en TikTok, donde creé el logo de la tienda y llevo su contenido audiovisual y sus campañas, y estoy construyendo <b>MYSK</b> desde cero: logo, identidad, nombres de producto y estrategia digital.</p>
<div class="ab-cert"><img src="/team/abisai/insignia-jads.webp" alt="Insignia de certificación en Facebook e Instagram Ads" width="300" height="300"/><div><span class="mono">CERTIFICACIÓN</span><b>Metodología JADS</b><span>Facebook e Instagram Ads y Estrategia Avanzada en Publicidad Digital</span></div></div>
</div>
</div>
</section>

<!-- HOY -->
<section class="ab-sec ab-today-sec">
<div class="ab-wrap">
<span class="eyebrow"><b>02</b> · Dónde estoy hoy</span>
<h2>Cuatro marcas, <span class="hand ab-hl">un mismo método</span>.</h2>
<div class="ab-today">
<article class="ab-peach"><span class="tag">[COFUNDADOR]</span><h3>ClicKonversion</h3><p>Junto a Arnaldo y Yoli, llevo la parte de anuncios y redes de los negocios que acompañamos.</p><a class="ab-link" href="/about">Conocer al equipo →</a></article>
<article class="ab-navy"><span class="tag ab-tag-lt">[ADS · REDES · CONTENIDO]</span><h3>Savaya</h3><p>Gestión publicitaria integral en Meta y TikTok, creación y edición de contenido, y alianzas con eventos.</p><span class="mono ab-now">6+ AÑOS</span></article>
<article class="ab-sky"><span class="tag">[TIKTOK]</span><h3>Tulujo Shop VZLA</h3><p>Creé el logo de la tienda y llevo su contenido audiovisual y sus campañas en TikTok.</p><span class="mono ab-now">HOY</span></article>
<article class="ab-lav"><span class="tag">[MARCA PROPIA]</span><h3>MYSK</h3><p>Una marca construida desde cero: identidad, producto, nombres, bio y campañas activas.</p><span class="mono ab-now">EN CRECIMIENTO</span></article>
</div>
</div>
</section>

<!-- RESULTADOS -->
<section class="ab-sec" id="resultados">
<div class="ab-wrap">
<div class="ab-res-head">
<div>
<span class="eyebrow"><b>03</b> · Resultados</span>
<h2>Trabajo con resultados reales.</h2>
<p class="ab-lead">Cifras tomadas directamente de Meta Ads Manager. Sin redondeos creativos.</p>
</div>
<div class="ab-res-pose">
<img src="/team/abisai/pose-pulgar.webp" alt="Abisai sonriendo con el pulgar arriba" width="702" height="1000"/>
<span class="ab-bubble hand ab-b2">capturas reales,<br/>no promesas</span>
</div>
</div>
<div class="ab-cases">
<article class="ab-case ab-case-big">
<div class="ab-case-h"><div><span class="mono">SAVAYA · @SAVAYAVZLA</span><h3>Historial completo</h3><p>Gestión publicitaria integral: Meta, TikTok, creación y edición de contenido, posts.</p></div><span class="mono ab-pill">64 CAMPAÑAS · JUL 2023 – AGO 2026</span></div>
<div class="ab-kpis"><div><b>3,66M+</b><span>alcance</span></div><div><b>9,04M+</b><span>impresiones</span></div><div><b>64+</b><span>campañas</span></div><div><b>70,1 mil</b><span>seguidores en Instagram</span></div></div>
<figure class="ab-shot"><img src="/team/abisai/ads-savaya.webp" alt="Captura de Meta Ads Manager con el historial de 64 campañas de Savaya" width="1763" height="467"/></figure>
</article>
<article class="ab-case">
<div class="ab-case-h"><div><span class="mono">MYSK · @MYSK.VZLA</span><h3>Branding desde cero + ads</h3><p>Identidad, producto, bio y más de 2.400 seguidores.</p></div></div>
<div class="ab-kpis"><div><b>$0,02</b><span>costo por resultado</span></div><div><b>5.385</b><span>visitas al perfil</span></div><div><b>82.205</b><span>alcance</span></div><div><b>1,90</b><span>frecuencia</span></div></div>
<figure class="ab-shot"><img src="/team/abisai/ads-mysk.webp" alt="Captura de Meta Ads Manager de la campaña de Mysk" width="1393" height="365"/></figure>
</article>
<article class="ab-case">
<div class="ab-case-h"><div><span class="mono">BYMARIAGONCALVES · ATELIER</span><h3>Meta Ads: leads y crecimiento</h3><p>59,4 mil seguidores. Diseñadora oficial del Miss Venezuela.</p></div><span class="mono ab-pill">30 DÍAS</span></div>
<div class="ab-kpis"><div><b>68.102</b><span>alcance</span></div><div><b>182.067</b><span>impresiones</span></div><div><b>$1,28</b><span>CPM promedio</span></div><div><b>2,67</b><span>frecuencia</span></div></div>
<figure class="ab-shot"><img src="/team/abisai/ads-atelier.webp" alt="Captura de Meta Ads Manager de los últimos 30 días del atelier" width="1751" height="549"/></figure>
</article>
</div>
</div>
</section>

<!-- LO QUE HAGO -->
<section class="ab-sec ab-do-sec">
<div class="ab-wrap ab-do-grid">
<div class="ab-do-side">
<img src="/team/abisai/pose-arriba-mira.webp" alt="Abisai mirando hacia arriba y señalando con el dedo" width="1042" height="1000"/>
<span class="ab-bubble hand ab-b3">¡esto es lo<br/>que hago!</span>
</div>
<div>
<span class="eyebrow"><b>04</b> · Lo que hago</span>
<h2>Anuncios, redes y <span class="hand ab-hl">calle</span>.</h2>
<div class="ab-do">
<article><span class="mono">01</span><h3>Meta Ads de punta a punta</h3><p>Business Manager, cuenta publicitaria y FB/IG/WhatsApp configurados; campañas de seguidores, reconocimiento y ventas por mensajes; segmentación, optimización y reporte mensual.</p></article>
<article><span class="mono">02</span><h3>Gestión de redes</h3><p>Publicaciones, reels e historias con calendario de contenido y diseño a la medida de la marca.</p></article>
<article><span class="mono">03</span><h3>Landing pages que miden</h3><p>Páginas para captar leads: quien se registra llega directo a tu WhatsApp de ventas.</p></article>
<article><span class="mono">04</span><h3>Branding desde cero</h3><p>Logo, identidad, nombres de producto y estrategia digital, como hice con MYSK.</p></article>
<article><span class="mono">05</span><h3>TikTok</h3><p>Contenido audiovisual y campañas para marcas que venden en TikTok.</p></article>
<article><span class="mono">06</span><h3>Activaciones y alianzas</h3><p>Radios, escuelas de modelaje, patrocinios como el Miss Carabobo y activaciones de calle.</p></article>
</div>
<p class="ab-do-note">¿Quieres los planes? <a href="/pricing">Mira los precios de ClicKonversion →</a></p>
</div>
</div>
</section>

<!-- CALLE -->
<section class="ab-sec ab-street-sec">
<div class="ab-wrap">
<div class="ab-head-split"><div><span class="eyebrow" style="color:rgba(255,248,240,.6)"><b>05</b> · De la pantalla a la calle</span><h2>Las marcas también se viven en persona.</h2></div><p>Activaciones, eventos y alianzas que luego se convierten en contenido.</p></div>
<div class="ab-street">
<figure class="s1"><img src="/team/abisai/miss-carabobo.webp" alt="Abisai y Yoli con candidatas del Miss Carabobo 2024 en la tienda de Savaya" width="720" height="881"/><figcaption><span class="mono">PATROCINIO</span>Miss Carabobo 2024 en Savaya</figcaption></figure>
<figure class="s2"><img src="/team/abisai/savaya-evento.webp" alt="Abisai, Yoli y dos modelos junto al pendón de Savaya en un centro comercial" width="800" height="711"/><figcaption><span class="mono">ACTIVACIÓN</span>Savaya en el centro comercial</figcaption></figure>
<figure class="s3"><img src="/team/abisai/savaya-navidad.webp" alt="Abisai sonriendo con gorra de Savaya junto a cajas decoradas de Navidad" width="720" height="902"/><figcaption><span class="mono">CONTENIDO</span>Campaña de Navidad</figcaption></figure>
</div>
</div>
</section>

<!-- FAMILIA -->
<section class="ab-sec">
<div class="ab-wrap">
<div class="ab-fam">
<figure class="ab-fam-photo"><img src="/team/abisai/vida-familia.webp" alt="Abisai de rodillas besando la barriga de su pareja embarazada junto a un árbol" width="720" height="959"/></figure>
<div class="ab-fam-txt">
<span class="eyebrow"><b>06</b> · Lo que me mueve</span>
<h2>Mi familia, <span class="hand ab-hl">mi motor</span>.</h2>
<p>Detrás de cada campaña hay alguien que trabaja por los suyos. Mi familia es mi motor, y cada logro también es para ellos.</p>
<span class="hand ab-fam-note">lo más importante ♥</span>
</div>
</div>
</div>
</section>

<!-- DETRÁS -->
<section class="ab-sec ab-life-sec">
<div class="ab-wrap">
<div class="ab-head-split"><div><span class="eyebrow"><b>07</b> · Detrás de la pantalla</span><h2>Una persona real detrás de cada anuncio.</h2></div><p class="hand ab-note">sí, soy yo el que responde</p></div>
<div class="ab-polas">
<figure class="ab-pola p1"><img src="/team/abisai/vida-galeria.webp" alt="Abisai de pie en una galería de arte" width="600" height="800"/><figcaption class="hand">día de museo</figcaption></figure>
<figure class="ab-pola p2"><img src="/team/abisai/vida-cine.webp" alt="Selfie de Abisai con dos amigas en el cine" width="900" height="675"/><figcaption class="hand">plan de cine</figcaption></figure>
<figure class="ab-pola p3"><img src="/team/abisai/vida-paramo.webp" alt="Selfie de Abisai junto a una laguna en la montaña" width="900" height="675"/><figcaption class="hand">en el páramo</figcaption></figure>
</div>
</div>
</section>

<!-- CTA -->
<section class="ab-cta">
<div class="ab-wrap ab-cta-grid">
<div>
<span class="eyebrow" style="color:rgba(255,248,240,.6)">Hablemos</span>
<h2>Hagamos crecer tu marca con una estrategia que <span class="ab-o">sí convierte</span>.</h2>
<p>Cuéntame qué vendes y qué has probado. Te digo cómo lo pondría a trabajar en Meta Ads y en tus redes.</p>
<div class="ab-ctas"><a class="btn btn-primary ab-btn-p" href="https://wa.me/?text=Hola%20Abisai%2C%20quiero%20hacer%20crecer%20mi%20marca">Escríbeme por WhatsApp ↗</a><a class="btn ab-btn-ghost" href="https://www.instagram.com/abisai.jap">Instagram @abisai.jap ↗</a></div>
<p class="hand ab-sign">Un abrazo, Abisai</p>
</div>
<div class="ab-cta-pose"><img src="/team/abisai/pose-brazos.webp" alt="Abisai de brazos cruzados con la camiseta de ClicKonversion" width="594" height="1000"/></div>
</div>
</section>

</main>
```

## CSS de referencia → `src/components/brand/abisai/abisai.css`

```css
/* ---------- Página de Abisai (ab-) ---------- */
.ab{--n:#010E25;--n2:#1B2A47;--o:#FE5C02;--od:#C94400;--cr:#FFF8F0;--lav:#E4DEFF;--sky:#D6EBFF;--pe:#FFDCC7;--mi:#D3F2E3;--sl:#5A6178;--bo:#3A4158}
.ab *{box-sizing:border-box}
.ab-wrap{max-width:1240px;margin:0 auto;padding:0 24px;position:relative}
.ab-sec{padding:clamp(64px,8vw,112px) 0}
.ab h2{font-size:clamp(34px,4.4vw,58px);margin-top:10px}
.ab .eyebrow b{color:var(--od)}
.ab-hl{color:var(--o);font-weight:700;font-size:1.18em;letter-spacing:0}
.ab-o{color:var(--o)}
.ab-lead{font-size:17px;color:var(--sl);margin-top:12px !important}
.ab-bubble{position:absolute;z-index:5;background:var(--o);color:#fff;font-size:24px;font-weight:700;line-height:1;padding:10px 16px 11px;border-radius:18px;box-shadow:0 10px 24px rgba(1,14,37,.2)}
.ab-tag-lt{color:var(--cr) !important;border-color:rgba(255,248,240,.45) !important}
.ab-btn-ghost{background:transparent;color:var(--cr);border-color:rgba(255,248,240,.5)}
.ab-btn-ghost:hover{background:var(--cr);color:var(--n)}
.ab-btn-p{border-color:var(--cr);box-shadow:0 4px 0 var(--cr)}
.ab-peach{background:var(--pe)}.ab-sky{background:var(--sky)}.ab-lav{background:var(--lav)}.ab-navy{background:var(--n);color:var(--cr)}
.ab-head-split{display:flex;flex-wrap:wrap;justify-content:space-between;align-items:flex-end;gap:16px 40px;margin-bottom:36px}
.ab-head-split>p{max-width:380px;color:var(--sl);font-size:17px}

/* hero */
.ab-hero{position:relative;background:var(--n);color:var(--cr);padding:40px 0 0;overflow:hidden;border-radius:0 0 48px 48px}
.ab-dots{position:absolute;inset:0;background-image:radial-gradient(rgba(255,248,240,.08) 1.1px,transparent 1.4px);background-size:24px 24px}
.ab-crumbs,.ab-crumbs a{color:rgba(255,248,240,.6) !important}
.ab-crumbs li[aria-current]{color:#fff;font-weight:700}
.ab-hero-grid{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:32px;align-items:end;margin-top:24px}
.ab-hero-txt{padding-bottom:90px}
.ab-tags{display:flex;flex-wrap:wrap;gap:6px}
.ab-hola{font-size:40px;color:var(--o);font-weight:700;margin-top:24px !important;transform:rotate(-2deg);transform-origin:left}
.ab-hero h1{font-size:clamp(56px,8vw,112px);line-height:.88;letter-spacing:-.05em;color:#fff;margin-top:6px}
.ab-hero h1 span{display:block}
.ab-hero h1 i{color:var(--o);font-style:normal}
.ab-role{margin-top:20px !important;font-size:13px;letter-spacing:.08em;color:var(--cr)}
.ab-role b{color:var(--o);margin:0 4px}
.ab-pitch{margin-top:18px !important;font-size:19px;line-height:1.6;color:rgba(255,248,240,.78);max-width:540px}
.ab-ctas{display:flex;flex-wrap:wrap;gap:12px;margin-top:28px}
.ab-hero-vis{position:relative;min-height:640px;display:flex;justify-content:center;align-items:flex-end}
.ab-glow{position:absolute;left:50%;bottom:-80px;width:560px;height:560px;transform:translateX(-50%);border-radius:50%;background:radial-gradient(circle,rgba(255,220,199,.35),rgba(255,220,199,0) 68%)}
.ab-pose-hero{position:relative;z-index:2;height:600px;width:auto;display:block}
.ab-dash{position:absolute;z-index:3;right:0;top:24px;width:250px;background:var(--cr);color:var(--n);border-radius:22px;padding:16px 18px;box-shadow:0 24px 50px -20px rgba(0,0,0,.6);transform:rotate(3deg);display:flex;flex-direction:column;gap:2px}
.ab-dash-h{font-size:9.5px;letter-spacing:.08em;color:var(--sl);display:flex;align-items:center;gap:6px;margin-bottom:6px}
.ab-dash-h i{width:7px;height:7px;border-radius:50%;background:#1F9D55}
.ab-dash b{font-size:42px;line-height:1;letter-spacing:-.04em}
.ab-dash>span:not(.mono){font-size:13px;color:var(--bo)}
.ab-bars{display:flex;align-items:flex-end;gap:5px;height:54px;margin-top:12px}
.ab-bars i{flex:1;background:var(--pe);border-radius:4px 4px 0 0}
.ab-bars i:last-child{background:var(--o)}
.ab-b1{left:0;top:170px;transform:rotate(-6deg)}
.ab-b1::after{content:"";position:absolute;right:-8px;bottom:14px;border:9px solid transparent;border-left-color:var(--o);border-right:0}

/* ticker */
.ab-ticker{background:var(--pe);border-top:2px solid var(--n);border-bottom:2px solid var(--n);overflow:hidden;padding:14px 0;margin-top:28px}
.ab-ticker-in{display:flex;gap:24px;white-space:nowrap;width:max-content;font-size:15px;letter-spacing:.04em;color:var(--n);animation:ab-mq 38s linear infinite}
.ab-ticker-in b{font-weight:700}
.ab-ticker-in i{font-style:normal;color:var(--o)}
@keyframes ab-mq{to{transform:translateX(-50%)}}
.still .ab-ticker-in{animation:none}
@media (prefers-reduced-motion:reduce){.ab-ticker-in{animation:none}}

/* sobre mí */
.ab-about{display:grid;grid-template-columns:minmax(0,.8fr) minmax(0,1.2fr);gap:56px;align-items:center}
.ab-portrait{margin:0;position:relative}
.ab-portrait img{width:100%;height:auto;display:block;border-radius:28px;border:2px solid var(--n);box-shadow:14px 16px 0 var(--pe)}
.ab-portrait figcaption{position:absolute;left:18px;bottom:18px;background:var(--cr);border:1.5px solid var(--n);border-radius:14px;padding:10px 14px;display:flex;flex-direction:column}
.ab-portrait figcaption b{font-size:16px}
.ab-portrait figcaption span{font-size:10.5px;letter-spacing:.08em;color:var(--sl)}
.ab-about p{font-size:17.5px;line-height:1.65;color:var(--bo);margin-top:16px !important}
.ab-about p b{color:var(--n)}
.ab-cert{display:flex;align-items:center;gap:16px;margin-top:26px;background:#fff;border:1.5px solid var(--n);border-radius:22px;padding:14px 18px}
.ab-cert img{width:72px;height:72px;border-radius:50%;flex:none}
.ab-cert div{display:flex;flex-direction:column;gap:2px}
.ab-cert .mono{font-size:10.5px;letter-spacing:.1em;color:var(--od);font-weight:700}
.ab-cert b{font-size:18px}
.ab-cert div span:last-child{font-size:14px;color:var(--sl)}

/* hoy */
.ab-today-sec{background:#fff;border-radius:48px}
.ab-today{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:14px;margin-top:36px}
.ab-today article{border-radius:26px;padding:24px;display:flex;flex-direction:column;gap:10px}
.ab-today .tag{align-self:flex-start;font-size:11px}
.ab-today h3{font-size:26px;margin-top:6px}
.ab-today p{font-size:15px;line-height:1.5;color:var(--bo);flex:1}
.ab-today .ab-navy h3{color:#fff}
.ab-today .ab-navy p{color:rgba(255,248,240,.78)}
.ab-now{font-size:11px;letter-spacing:.08em;color:#1F7A47;font-weight:700}
.ab-navy .ab-now{color:#8EE3B7}
.ab-link{color:var(--od);font-weight:600;text-decoration:none}

/* resultados */
.ab-res-head{display:grid;grid-template-columns:minmax(0,1fr) 300px;gap:24px;align-items:end;position:relative}
.ab-res-pose{position:relative;height:290px}
.ab-res-pose img{position:absolute;right:0;bottom:-40px;height:340px;width:auto;z-index:1}
.ab-b2{left:-40px;top:40px;transform:rotate(-5deg)}
.ab-cases{display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-top:40px;position:relative;z-index:2}
.ab-case{background:#fff;border:1.5px solid var(--n);border-radius:28px;padding:24px;display:flex;flex-direction:column;gap:16px;overflow:hidden}
.ab-case-big{grid-column:1/-1;background:var(--n);color:var(--cr)}
.ab-case-h{display:flex;justify-content:space-between;gap:16px;align-items:flex-start}
.ab-case-h .mono{font-size:11px;letter-spacing:.08em;color:var(--od);font-weight:700}
.ab-case-big .ab-case-h .mono{color:var(--o)}
.ab-case h3{font-size:24px;margin-top:6px}
.ab-case-big h3{color:#fff;font-size:30px}
.ab-case-h p{font-size:15px;color:var(--sl);margin-top:6px !important}
.ab-case-big .ab-case-h p{color:rgba(255,248,240,.7)}
.ab-pill{flex:none;font-size:10.5px !important;letter-spacing:.08em;padding:6px 10px;border-radius:999px;background:var(--pe);color:var(--n) !important}
.ab-kpis{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:10px}
.ab-kpis div{border-left:3px solid var(--o);padding:4px 0 4px 12px;display:flex;flex-direction:column}
.ab-kpis b{font-size:30px;line-height:1.05;letter-spacing:-.03em}
.ab-case-big .ab-kpis b{font-size:40px;color:#fff}
.ab-kpis span{font-size:12.5px;color:var(--sl)}
.ab-case-big .ab-kpis span{color:rgba(255,248,240,.65)}
.ab-shot{margin:0;border-radius:14px;overflow:hidden;border:1px solid rgba(1,14,37,.12);background:#fff}
.ab-shot img{width:100%;height:auto;display:block}

/* lo que hago */
.ab-do-sec{background:var(--pe);border-radius:48px;overflow:hidden}
.ab-do-grid{display:grid;grid-template-columns:minmax(0,.75fr) minmax(0,1.25fr);gap:40px;align-items:end}
.ab-do-side{position:relative;align-self:stretch;min-height:520px}
.ab-do-side img{position:absolute;left:-20px;bottom:calc(-1 * clamp(64px,8vw,112px));width:115%;max-width:none;height:auto}
.ab-b3{right:10px;top:20px;transform:rotate(6deg)}
.ab-do{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-top:28px}
.ab-do article{background:#fff;border:1.5px solid var(--n);border-radius:22px;padding:20px;display:flex;flex-direction:column;gap:6px}
.ab-do .mono{font-size:12px;font-weight:700;color:var(--od)}
.ab-do h3{font-size:20px}
.ab-do p{font-size:14.5px;color:var(--bo);line-height:1.5}
.ab-do-note{margin-top:20px !important;font-size:16px;color:var(--n)}
.ab-do-note a{color:var(--od);font-weight:600}

/* calle */
.ab-street-sec{background:var(--n);color:var(--cr);border-radius:48px;margin-top:clamp(24px,4vw,48px)}
.ab-street-sec h2{color:#fff}
.ab-street-sec .ab-head-split>p{color:rgba(255,248,240,.65)}
.ab-street{display:grid;grid-template-columns:1fr 1.15fr 1fr;gap:18px;align-items:start}
.ab-street figure{margin:0;background:var(--n2);border-radius:24px;overflow:hidden;border:1.5px solid rgba(255,248,240,.14)}
.ab-street img{width:100%;aspect-ratio:4/4.6;object-fit:cover;display:block}
.ab-street .s2{margin-top:40px}
.ab-street .s2 img{aspect-ratio:1/1}
.ab-street figcaption{padding:14px 16px 16px;font-size:16px;font-weight:600;color:#fff;display:flex;flex-direction:column;gap:3px}
.ab-street figcaption .mono{font-size:10.5px;letter-spacing:.1em;color:var(--o);font-weight:700}

/* familia */
.ab-fam{display:grid;grid-template-columns:minmax(0,.8fr) minmax(0,1.2fr);gap:48px;align-items:center;background:var(--lav);border:2px solid var(--n);border-radius:40px;padding:clamp(24px,3.5vw,48px);box-shadow:12px 14px 0 var(--n)}
.ab-fam-photo{margin:0;border-radius:26px;overflow:hidden;border:2px solid var(--n);transform:rotate(-2deg);background:#2a2015}
.ab-fam-photo img{width:100%;height:auto;display:block}
.ab-fam-txt p{font-size:18px;line-height:1.65;color:var(--bo);margin-top:16px !important;max-width:560px}
.ab-fam-note{display:inline-block;margin-top:20px !important;font-size:32px;color:var(--o);font-weight:700;transform:rotate(-3deg)}

/* detrás */
.ab-life-sec{padding-top:0}
.ab-note{font-size:30px;color:var(--o);font-weight:700;transform:rotate(-3deg)}
.ab-polas{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:28px;padding:10px}
.ab-pola{margin:0;background:#fff;padding:12px 12px 14px;box-shadow:0 24px 50px -24px rgba(1,14,37,.5);border:1px solid rgba(1,14,37,.06)}
.ab-pola img{width:100%;aspect-ratio:4/4.4;object-fit:cover;display:block}
.ab-pola figcaption{font-size:24px;font-weight:700;text-align:center;margin-top:8px;color:var(--n)}
.ab-pola.p1{transform:rotate(-3deg)}.ab-pola.p2{transform:rotate(2deg) translateY(18px)}.ab-pola.p3{transform:rotate(-1.5deg)}

/* cta */
.ab-cta{background:var(--n);color:var(--cr);border-radius:48px;margin:clamp(24px,4vw,48px) 0;padding:clamp(56px,7vw,96px) 0 0;overflow:hidden}
.ab-cta-grid{display:grid;grid-template-columns:minmax(0,1.35fr) minmax(0,.65fr);gap:32px;align-items:end}
.ab-cta-grid>div:first-child{padding-bottom:clamp(56px,7vw,96px)}
.ab-cta h2{color:#fff}
.ab-cta p{font-size:18px;color:rgba(255,248,240,.75);margin-top:14px !important;max-width:540px}
.ab-sign{font-size:34px;color:var(--o);font-weight:700;margin-top:20px !important;transform:rotate(-2deg);transform-origin:left}
.ab-cta-pose{display:flex;justify-content:center}
.ab-cta-pose img{height:440px;width:auto;display:block}

/* responsive */
@media (max-width:1040px){
  .ab-today{grid-template-columns:1fr 1fr}
}
@media (max-width:960px){
  .ab-hero-grid,.ab-about,.ab-do-grid,.ab-fam,.ab-cta-grid{grid-template-columns:minmax(0,1fr)}
  .ab-hero-txt{padding-bottom:0}
  .ab-hero-vis{min-height:560px}
  .ab-pose-hero{height:520px}
  .ab-cases{grid-template-columns:1fr}
  .ab-do-side{min-height:0;height:360px;order:2}
  .ab-do-side img{position:absolute;left:50%;transform:translateX(-50%);width:auto;height:420px}
  .ab-street{grid-template-columns:1fr 1fr}
  .ab-street .s2{margin-top:0}
  .ab-cta-grid>div:first-child{padding-bottom:0}
}
@media (max-width:640px){
  .ab-sec{padding:56px 0}
  .ab h2{font-size:32px}
  .ab-hero{padding-top:28px;border-radius:0 0 32px 32px}
  .ab-hola{font-size:32px}
  .ab-hero h1{font-size:60px}
  .ab-role{font-size:11.5px}
  .ab-pitch{font-size:16.5px}
  .ab-ctas{flex-direction:column}
  .ab-ctas .btn{width:100%}
  .ab-hero-vis{min-height:0;padding-top:120px}
  .ab-pose-hero{height:420px}
  .ab-dash{width:200px;top:8px;right:-4px;padding:12px 14px}
  .ab-dash b{font-size:32px}
  .ab-bars{height:36px}
  .ab-b1{font-size:19px;left:-4px;top:150px}
  .ab-glow{width:380px;height:380px}
  .ab-ticker-in{font-size:13px}
  .ab-portrait img{box-shadow:8px 10px 0 var(--pe)}
  .ab-about p{font-size:16px}
  .ab-today-sec,.ab-do-sec,.ab-street-sec,.ab-cta,.ab-fam{border-radius:32px}
  .ab-today{display:flex;overflow-x:auto;scroll-snap-type:x mandatory;gap:12px;margin:24px -24px 0;padding:4px 24px 14px;scrollbar-width:none}
  .ab-today>*{flex:0 0 80%;scroll-snap-align:start}
  .ab-res-head{grid-template-columns:1fr}
  .ab-res-pose{height:250px}
  .ab-res-pose img{right:50%;transform:translateX(50%);height:290px;bottom:-30px}
  .ab-b2{left:0;top:10px;font-size:19px}
  .ab-case{padding:18px;border-radius:22px}
  .ab-case-h{flex-direction:column}
  .ab-kpis{grid-template-columns:1fr 1fr;gap:12px}
  .ab-kpis b,.ab-case-big .ab-kpis b{font-size:26px}
  .ab-shot{overflow-x:auto}
  .ab-shot img{width:640px;max-width:none}
  .ab-do{grid-template-columns:1fr}
  .ab-do-side{height:300px}
  .ab-do-side img{height:340px}
  .ab-b3{font-size:19px;right:0}
  .ab-street{display:flex;overflow-x:auto;scroll-snap-type:x mandatory;gap:14px;margin:0 -24px;padding:4px 24px 14px}
  .ab-street figure{flex:0 0 78%;scroll-snap-align:start}
  .ab-fam{gap:20px;box-shadow:7px 8px 0 var(--n)}
  .ab-fam-txt p{font-size:16px}
  .ab-fam-note{font-size:26px}
  .ab-polas{display:flex;overflow-x:auto;scroll-snap-type:x mandatory;gap:16px;margin:0 -24px;padding:10px 24px 24px}
  .ab-pola{flex:0 0 72%;scroll-snap-align:center}
  .ab-pola.p2{transform:rotate(2deg)}
  .ab-note{font-size:24px}
  .ab-cta-pose img{height:340px}
  .ab-sign{font-size:28px}
}
```

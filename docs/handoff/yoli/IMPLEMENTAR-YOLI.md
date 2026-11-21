# Implementar la página de Yoli — /about/yoli (escritorio + móvil)

Este es el único archivo que necesitas. Contiene las instrucciones, el HTML de referencia y el CSS final del diseño aprobado en Claude Design.
Las imágenes ya están en `public/team/yoli/`.

## Instrucciones para Claude Code

Implementa la página de perfil de Yolimar Padrón ("Yoli") en `/about/yoli`. Debe verse igual que el HTML y el CSS de referencia de abajo, en escritorio y en móvil. Sigue el mismo patrón de `src/app/(marketing)/about/arnaldo/page.tsx`.

1. **Página:** crea `src/app/(marketing)/about/yoli/page.tsx` como Server Component.
   - Envuélvela en `<MarketingLayout active="about" whatsapp={{ message: "¡Hola! Soy Yoli. ¿Hablamos de tu marca?", replies: ["Quiero contenido para mi marca", "Necesito relaciones públicas", "Quiero un taller de IA"] }}>`.
   - Convierte el HTML de referencia a JSX: `class` → `className`, estilos en línea → objetos, `<img>` con `width` y `height`. Usa `next/image` donde no rompa el diseño; si no, `<img>` con `/* eslint-disable @next/next/no-img-element */`, como en la página de Arnaldo.
2. **Clases del canvas → clases del sitio:**
   - `tag` → `ck-tag`
   - `eyebrow` → `ck-eyebrow`
   - `crumbs` → `ck-crumbs`
   - `btn` → `ck-btn`
   - `btn-primary` → `ck-btn-primary`
   - `btn-line` → `ck-btn-line`
   - `dot` → `ck-dot`
   - `hand` → `ck-hand`
   - `mono` → `ck-mono`

   Las clases `yo-*` se quedan igual.
3. **CSS:** crea `src/components/brand/yoli/yoli.css` con el CSS de referencia e impórtalo desde la página.
   - Quita la regla `.btn-line`, que ya existe como `.ck-btn-line`.
   - Reemplaza `.still .yo-band-in` por nada, porque en el sitio no hay clase `still`.
   - No toques `brand.css`.
4. **Enlaces:**
   - Los `href="https://wa.me/?text=..."` pasan a `waLink("Hola Yoli, quiero hablar de mi marca")` de `@/lib/whatsapp`.
   - "Ver el equipo" y "Conocer al equipo" van a `/about`.
   - "Ver mi trayectoria" va a `#trayectoria`.
5. **Claim Publicidad:** quita de la trayectoria el ítem de Claim Publicidad, que tiene `[AÑOS]` y `[Agregar descripción del cargo]`, hasta que Arnaldo confirme los años. No publiques textos entre corchetes.
6. **SEO:**
   - `metadata` con title `"Yolimar Padrón — Mercadóloga, estratega digital e IA aplicada al marketing | ClicKonversion"`.
   - Description: `"Yolimar Padrón (Yoli): estrategia de contenido para TikTok e Instagram, relaciones públicas y eventos, gestión de marcas e IA para marketing. Docente universitaria desde 2007. Cofundadora de ClicKonversion."`
   - Canonical `/about/yoli`, Open Graph con `/team/yoli/retrato.webp`.
   - JSON-LD `Person` + `BreadcrumbList` (Inicio › Quiénes somos › Yolimar Padrón), escapando `<` como en la página de Arnaldo.
   - En `Person`:
     - `alumniOf`: UNESR, UPEL y Universidad Central de Venezuela.
     - `worksFor`: ClicKonversion y Savaya.
     - `address`: Los Guayos, Carabobo, VE.
   - Agrega `/about/yoli` a `src/app/sitemap.ts`.
7. **Tarjeta del equipo:** en `src/data/team.ts`, reemplaza los marcadores de Yoli:
   - name: `"Yolimar Padrón"`
   - role: `"MERCADEO · CONTENIDO · RR. PP. · IA"`
   - bio: `"Soy mercadóloga y docente universitaria desde 2007. Hago crecer comunidades en TikTok e Instagram, llevo la voz de las marcas a eventos y medios, y uso la IA para crear más y mejor."`
   - years: `"19"`; yearsArea: `"AÑOS ENSEÑANDO MARKETING"`
   - tags: `{ label: "[CONTENIDO]", bg: "#E4DEFF" }`, `{ label: "[RR. PP.]", bg: "#FFDCC7" }`
   - photo: `"/team/yoli/retrato.webp"`
   - cv: `"/about/yoli"`
8. **Móvil:** el CSS ya trae las reglas para ≤ 960 px y ≤ 640 px. Revisa con Playwright a 360, 390, 768 y 1440 px:
   - Nada provoca scroll horizontal.
   - Los carruseles deslizan: "Dónde estoy hoy", "Lo que hago", "Herramientas" y las polaroids.
   - Los botones del hero ocupan todo el ancho en móvil.
   - Las burbujas naranjas no tapan la cara de Yoli. Si alguna la tapa, muévela.
   - Las poses recortadas (`pose-*.webp`) tienen fondo transparente; no les pongas fondo ni borde.
9. **Verificación:** corre `npx tsc --noEmit`, `npx eslint` sobre los archivos nuevos y `npm run build`, y confirma que `/about/yoli` sale estática.
10. **Commit:** muéstrame un resumen y haz un commit solo con estos archivos:
    - `src/app/(marketing)/about/yoli/`
    - `src/components/brand/yoli/`
    - `public/team/yoli/`
    - `src/data/team.ts`
    - `src/app/sitemap.ts`
    - este archivo

    Mensaje: `"feat(about): página de Yoli con versión móvil y tarjeta del equipo"`. No incluyas `.gitignore`, `CLAUDE.md` ni la carpeta o el zip "Tres decisiones creativas Click!". No hagas push.

**Reglas de marca:**
- El naranja `#FE5C02` nunca va de fondo de sección; solo en botones, burbujas, isotipo y palabras clave.
- No inventes datos. Las cifras (+80 %, +20 %, 10+ marcas) salen del CV de Yoli.
- La sección «Lo que me mueve» (08, su lado de mamá) va tal cual, sin fotos de su hija ni su nombre.
- No uses fotos con menores de edad ni muestres la cédula, su teléfono ni su correo personal.

## Imágenes (ya en `public/team/yoli/`)

| Archivo | Dónde va |
|---------|----------|
| `pose-arriba.webp` | Hero: Yoli señalando hacia arriba |
| `pose-pulgar.webp` | Trayectoria: señala con el pulgar la línea de tiempo |
| `pose-senala-lado.webp` | «Lo que hago»: señala las tarjetas de servicios |
| `pose-cruzada-senala.webp` | Formación: señala la lista de estudios |
| `pose-brazos-seria.webp` | «La caja de herramientas» |
| `pose-brazos-sonrisa.webp` | CTA final |
| `retrato.webp` | Tarjeta del equipo en Quiénes somos y Open Graph |
| `certificado-unitec.webp` | Certificado UNITEC 2025 (cédula difuminada) |
| `con-abisai-savaya.webp` | Polaroid «con Abisai en Savaya» |
| `grado.webp` | Polaroid «día de grado» |
| `con-amiga.webp` | Polaroid «con mi gente» |
| `camisa-verde.webp` | Polaroid «¡modo evento!» |

## HTML de referencia

En el hero, el isotipo usa el componente `Isotipo` de `src/components/brand/isotipo.tsx` (color `#FE5C02`) en lugar del SVG en línea.

```html
<main class="yo">

<!-- HERO -->
<section class="yo-hero">
<div class="yo-wrap">
<nav aria-label="Migas de pan"><ol class="crumbs"><li><a href="/">Inicio</a></li><li aria-hidden="true">/</li><li><a href="/about">Quiénes somos</a></li><li aria-hidden="true">/</li><li aria-current="page" style="color:#010E25;font-weight:700">Yolimar Padrón</li></ol></nav>
<div class="yo-hero-grid">
<div class="yo-hero-txt">
<div class="yo-tags"><span class="tag">[MERCADEO]</span><span class="tag">[CONTENIDO]</span><span class="tag">[RR. PP.]</span><span class="tag">[IA]</span><span class="tag">[DOCENCIA]</span></div>
<p class="hand yo-hola">¡Hola, soy Yoli!</p>
<h1>Yolimar <span class="yo-h1-2">Padrón<span class="yo-dot">.</span></span></h1>
<p class="mono yo-role">MERCADÓLOGA <i>·</i> ESTRATEGA DIGITAL <i>·</i> IA APLICADA AL MARKETING</p>
<p class="yo-pitch">Convierto marcas en conversación: estrategia de contenido para TikTok e Instagram, relaciones públicas y eventos, y la inteligencia artificial como aliada para crear más y mejor. Enseño marketing en la universidad desde 2007, así que te lo explico claro.</p>
<div class="yo-ctas"><a class="btn btn-primary" href="https://wa.me/?text=Hola%20Yoli%2C%20quiero%20hablar%20de%20mi%20marca">Hablemos de tu marca ↗</a><a class="btn btn-line" href="#trayectoria">Ver mi trayectoria</a></div>
<p class="mono yo-loc"><span class="dot"></span> Los Guayos, Carabobo · disponible para trabajo remoto</p>
</div>
<div class="yo-hero-vis">
<img class="yo-pose-hero" src="/team/yoli/pose-arriba.webp" alt="Yoli sonriendo y señalando hacia arriba con la camiseta de ClicKonversion" width="690" height="1000"/>
<svg class="yo-iso-bg" aria-hidden="true" viewBox="-20 -20 1040 524"><path fill="#FE5C02" fill-rule="evenodd" d="M214.4 477.5 C238.9 474.6 260.5 467.9 281.1 456.7 C303.8 444.4 326.1 424.8 339.9 404.8 C341.3 402.8 342.6 401.2 342.9 401.2 C343.3 401.2 343.6 406.5 343.8 415.7 L344.0 430.3 L347.1 430.1 C355.1 429.7 369.3 425.3 380.8 419.5 C404.3 407.9 421.6 389.5 431.3 365.9 C434.4 358.3 436.3 351.9 437.8 343.8 C438.9 337.8 439.0 335.1 439.3 296.8 C439.7 257.1 439.7 256.1 440.9 251.8 C442.6 245.7 444.0 241.9 446.3 237.8 C455.7 220.5 474.4 209.8 495.0 209.8 C501.8 209.8 506.1 210.4 512.4 212.5 C518.8 214.5 523.8 217.5 529.1 222.5 C536.7 229.7 540.4 236.5 544.8 251.8 C550.8 273.1 571.1 332.3 588.1 378.4 C591.2 386.7 594.8 396.4 596.1 400.1 C602.6 418.3 607.8 428.3 616.8 439.7 C632.3 459.5 654.2 471.9 679.7 475.3 C687.2 476.3 691.8 476.3 699.7 475.3 C720.5 472.7 738.3 464.3 753.6 449.8 C763.0 440.9 768.7 432.2 781.4 407.5 C793.4 384.2 796.3 378.5 810.8 350.6 C825.5 322.4 831.5 311.1 833.7 307.0 C834.8 305.0 838.7 297.7 842.4 290.8 C846.1 283.8 856.9 263.6 866.5 245.7 C876.0 227.9 885.8 209.5 888.3 204.8 C890.7 200.2 894.4 193.2 896.5 189.5 C898.5 185.7 902.1 179.0 904.4 174.6 C906.8 170.2 916.4 152.5 925.7 135.1 C949.7 90.6 954.8 81.1 957.6 75.8 C958.9 73.2 961.5 68.5 963.2 65.3 C965.0 62.2 969.4 53.9 973.1 47.0 C976.8 40.0 983.0 28.4 986.9 21.1 C990.8 13.9 993.9 7.7 993.7 7.4 C993.5 6.6 995.0 6.4 962.7 12.4 C950.1 14.7 938.8 16.8 937.4 17.0 C934.4 17.5 907.1 22.5 869.3 29.4 C853.7 32.2 838.8 35.0 836.1 35.5 C833.3 36.0 830.7 36.8 830.2 37.3 C829.7 37.8 823.7 48.4 816.8 61.0 C810.0 73.5 802.3 87.5 799.8 92.0 C793.1 104.2 770.1 146.4 765.9 154.0 C764.0 157.7 755.8 172.7 747.7 187.5 C729.1 221.6 718.5 241.2 706.6 263.0 C703.8 268.3 698.5 278.0 695.0 284.6 C691.4 291.2 688.2 296.5 687.9 296.4 C687.6 296.3 686.1 292.5 684.6 288.0 C672.3 250.9 651.8 191.3 649.0 184.9 C641.2 166.6 631.5 152.1 617.9 138.6 C606.0 126.7 593.6 118.0 578.0 110.4 C558.4 100.8 540.3 96.1 516.5 94.4 C498.8 93.2 476.9 95.9 458.3 101.5 C419.9 113.1 384.8 138.7 364.5 169.8 C362.0 173.6 359.7 176.8 359.3 176.8 C358.9 176.8 356.4 173.6 353.7 169.5 C318.2 117.1 253.6 88.3 186.4 95.1 C151.5 98.6 115.3 112.7 86.9 134.0 C57.0 156.3 35.4 183.6 21.2 216.6 C11.1 240.4 6.6 262.4 6.6 288.3 C6.6 304.7 8.1 316.8 12.1 332.9 C21.5 370.2 42.4 404.6 71.4 430.2 C102.0 457.3 139.0 473.4 180.1 477.5 C189.9 478.5 206.0 478.5 214.4 477.5Z M187.8 363.5 C182.4 362.8 171.9 360.0 166.7 357.8 C140.7 347.1 121.0 321.3 117.5 293.6 C116.7 286.9 117.1 273.1 118.4 267.4 C120.7 256.8 125.1 246.5 131.3 237.0 C134.9 231.5 146.4 219.9 152.2 215.9 C171.7 202.6 196.1 198.1 218.0 203.6 C228.4 206.3 234.7 209.2 244.7 215.9 C261.6 227.2 274.0 246.3 278.1 267.4 C279.6 274.7 279.8 285.8 278.7 293.1 C277.5 301.3 276.7 304.2 273.5 312.5 C262.9 339.3 238.1 358.9 209.4 363.3 C203.6 364.1 193.6 364.2 187.8 363.5Z"/></svg>
<span class="yo-bubble hand yo-b1">te lo explico<br/>como en clase</span>
<div class="yo-float yo-f1"><span class="mono">COMUNIDAD DIGITAL · @SAVAYAVZLA</span><b>+80%</b><span>en TikTok e Instagram</span></div>
<div class="yo-float yo-f2"><span class="mono">DOCENTE DESDE</span><b>2007</b></div>
</div>
</div>
</div>
</section>

<!-- BANDA -->
<div class="yo-band" aria-hidden="true"><div class="yo-band-in mono"><span>Estrategia de contenido</span><i>✦</i><span>TikTok</span><i>✦</i><span>Instagram</span><i>✦</i><span>Relaciones públicas</span><i>✦</i><span>Eventos</span><i>✦</i><span>Gestión de marcas</span><i>✦</i><span>IA para marketing</span><i>✦</i><span>Docencia</span><i>✦</i><span>Locución</span><i>✦</i><span>Estrategia de contenido</span><i>✦</i><span>TikTok</span><i>✦</i><span>Instagram</span><i>✦</i><span>Relaciones públicas</span><i>✦</i><span>Eventos</span><i>✦</i><span>Gestión de marcas</span><i>✦</i><span>IA para marketing</span><i>✦</i><span>Docencia</span><i>✦</i><span>Locución</span><i>✦</i></div></div>

<!-- SOBRE MÍ + LOGROS -->
<section class="yo-sec">
<div class="yo-wrap yo-about">
<div>
<span class="eyebrow"><b>01</b> · Sobre mí</span>
<h2>Una marca que <span class="hand yo-hl">habla</span> vende más.</h2>
<p>Soy licenciada en Administración, mención Mercadeo, con especialización en docencia universitaria y locutora certificada. Combino estrategia, comunicación y tecnología: planifico el contenido, cuido la voz de la marca, la llevo a eventos y medios, y uso herramientas de inteligencia artificial para producir más rápido sin perder lo humano.</p>
<p>En el aula aprendí a explicar lo complejo con palabras simples. En las marcas aprendí que la constancia y la cercanía construyen comunidad.</p>
</div>
<div class="yo-stats">
<div class="yo-stat yo-lav"><b>+80%</b><span>de crecimiento de la comunidad digital de Savaya en TikTok e Instagram.</span></div>
<div class="yo-stat yo-peach"><b>+20%</b><span>de reconocimiento de marca durante 2025 con campañas de alto alcance.</span></div>
<div class="yo-stat yo-mint"><b>10+</b><span>marcas nacionales e internacionales gestionadas como social media manager.</span></div>
<div class="yo-stat yo-navy"><b>2007</b><span>el año en que empecé a enseñar marketing en la universidad. Sigo haciéndolo.</span></div>
</div>
</div>
</section>

<!-- HOY -->
<section class="yo-sec yo-today-sec">
<div class="yo-wrap">
<span class="eyebrow"><b>02</b> · Dónde estoy hoy</span>
<h2>Tres frentes, <span class="hand yo-hl">una misma voz</span>.</h2>
<div class="yo-today">
<article class="yo-card yo-peach"><span class="tag">[ESTRATEGA DIGITAL · RR. PP.]</span><h3>Savaya</h3><p>Lidero la estrategia de contenido en TikTok e Instagram y las relaciones públicas de la marca, con presencia en eventos regionales como el Miss Carabobo.</p><span class="mono yo-now">MAR 2024 · HOY</span></article>
<article class="yo-card yo-lav"><span class="tag">[COFUNDADORA]</span><h3>ClicKonversion</h3><p>Junto a Arnaldo y Abisai, aporto la mirada de marca y comunicación: contenido, voz y relaciones públicas para los negocios que acompañamos.</p><a class="yo-link" href="/about">Conocer al equipo →</a></article>
<article class="yo-card yo-sky"><span class="tag">[DOCENTE UNIVERSITARIA]</span><h3>Aula virtual y presencial</h3><p>Mercadeo y Comunicación Social en UNITEC, Academia Valencia, UJAP, CEUJAP, UAM y CUAM. Facilito procesos de aprendizaje con herramientas tecnológicas.</p><span class="mono yo-now">2007 · HOY</span></article>
</div>
</div>
</section>

<!-- TRAYECTORIA -->
<section class="yo-sec" id="trayectoria">
<div class="yo-wrap yo-tl-grid">
<div>
<span class="eyebrow"><b>03</b> · Trayectoria</span>
<h2>Experiencia de alto impacto.</h2>
<ol class="yo-tl">
<li class="cur"><span class="mono yo-when">MAR 2024 – HOY</span><div><h3>Estratega digital y relacionista pública <span>· Savaya C.A.</span></h3><ul><li>Crecimiento del 80 % de la comunidad digital con estrategias de contenido en TikTok e Instagram.</li><li>Incremento del 20 % en reconocimiento de marca durante 2025.</li><li>Presencia estratégica y relaciones públicas en eventos como el Miss Carabobo.</li></ul></div></li>
<li><span class="mono yo-when">MAY 2020 – DIC 2025</span><div><h3>Consultora de estrategia de marketing <span>· ArtMurale (Canadá)</span></h3><ul><li>Plan estratégico integral para el lanzamiento y posicionamiento de la marca en el mercado canadiense.</li><li>Ecosistema de contenidos e identidad digital inicial del proyecto.</li></ul></div></li>
<li><span class="mono yo-when">2020 – 2025</span><div><h3>Gestión de marcas <span>· Social Media Manager</span></h3><ul><li>Estrategias on y off line para más de 10 clientes, entre ellos Biosuplisel, Distalim C.A. y el Colegio de Fisioterapeutas de Carabobo.</li></ul></div></li>
<li class="cur"><span class="mono yo-when">2007 – HOY</span><div><h3>Docente universitaria y facilitadora bimodal</h3><ul><li>Educación virtual y presencial para las carreras de Mercadeo y Comunicación Social.</li><li>Aprendizaje enfocado en herramientas tecnológicas y marketing tradicional y digital.</li></ul></div></li>
<li><span class="mono yo-when">[AÑOS]</span><div><h3>Gerente general <span>· Claim Publicidad</span></h3><ul><li>[Agregar descripción del cargo]</li></ul></div></li>
</ol>
</div>
<aside class="yo-tl-side">
<img class="yo-pose-tl" src="/team/yoli/pose-pulgar.webp" alt="Yoli sonriendo y señalando con el pulgar hacia su trayectoria" width="631" height="1000"/>
<span class="yo-bubble hand yo-b2">¡esto sí lo viví!</span>
<div class="yo-side-card"><span class="mono">MARCAS Y EVENTOS</span><div class="yo-chips"><span>Savaya</span><span>ArtMurale</span><span>Biosuplisel</span><span>Distalim C.A.</span><span>Colegio de Fisioterapeutas de Carabobo</span><span>Miss Carabobo</span></div></div>
</aside>
</div>
</section>

<!-- LO QUE HAGO -->
<section class="yo-sec yo-do-sec">
<div class="yo-wrap">
<div class="yo-head-split"><div><span class="eyebrow"><b>04</b> · Lo que hago</span><h2>Estrategia con voz propia.</h2></div><p>Lo que más me piden las marcas, y lo que hago todos los días.</p></div>
<div class="yo-do-wrap"><div class="yo-do-pose"><img src="/team/yoli/pose-senala-lado.webp" alt="Yoli señalando sus servicios" width="664" height="1000"/><span class="yo-bubble hand">¡mira!</span></div>
<div class="yo-do">
<article class="yo-lav"><span class="mono">01</span><h3>Estrategia de contenido</h3><p>Calendario, formatos y guiones para TikTok e Instagram que hacen crecer la comunidad.</p></article>
<article class="yo-peach"><span class="mono">02</span><h3>Gestión de marcas</h3><p>Identidad digital, tono y ecosistema de contenidos para marcas nuevas o que se renuevan.</p></article>
<article class="yo-mint"><span class="mono">03</span><h3>Relaciones públicas y eventos</h3><p>Presencia de marca en eventos, alianzas y medios, de la planificación a la cobertura.</p></article>
<article class="yo-sky"><span class="mono">04</span><h3>IA para marketing</h3><p>Herramientas de inteligencia artificial para crear contenido y ganar productividad.</p></article>
<article class="yo-white"><span class="mono">05</span><h3>Formación para equipos</h3><p>Talleres de marketing digital e IA, en modalidad virtual o presencial.</p></article>
<article class="yo-white"><span class="mono">06</span><h3>Locución y oratoria</h3><p>Voz para piezas de audio y video, y oratoria de alto impacto para presentaciones.</p></article>
</div>
</div>
</div>
</section>

<!-- FORMACIÓN -->
<section class="yo-edu-sec">
<div class="yo-wrap yo-edu-grid">
<div>
<span class="eyebrow" style="color:rgba(255,248,240,.6)"><b>05</b> · Formación</span>
<h2>Siempre aprendiendo, <span class="hand yo-hl">siempre enseñando</span>.</h2>
<ul class="yo-edu">
<li><span class="mono">2006</span><div><b>Licenciatura en Administración, mención Mercadeo</b><span>UNESR</span></div></li>
<li><span class="mono">2011</span><div><b>Especialización en Docencia Universitaria</b><span>UPEL</span></div></li>
<li><span class="mono">2013</span><div><b>Locutora certificada</b><span>Universidad Central de Venezuela</span></div></li>
<li><span class="mono">DIPLOMADOS</span><div><b>Comunicación Digital · Docente Bimodal</b><span>UAM · CEUJAP</span></div></li>
<li class="new"><span class="mono">2025</span><div><b>Transinclusión educativa, tecnoeducación e IA</b><span>UNITEC · taller de 60 horas académicas</span></div></li>
</ul>
</div>
<div class="yo-edu-vis">
<img class="yo-pose-edu" src="/team/yoli/pose-cruzada-senala.webp" alt="Yoli de brazos cruzados señalando su formación" width="589" height="1000"/>
<span class="yo-bubble hand yo-b3">¡nunca dejo<br/>de aprender!</span>
<figure class="yo-cert"><img src="/team/yoli/certificado-unitec.webp" alt="Certificado de UNITEC del taller Transinclusión educativa, tecnoeducación e IA" width="650" height="428"/><figcaption class="mono">CERTIFICACIÓN UNITEC · 2025</figcaption></figure>
</div>
</div>
</section>

<!-- HERRAMIENTAS -->
<section class="yo-sec">
<div class="yo-wrap">
<div class="yo-tools-head"><div><span class="eyebrow"><b>06</b> · Habilidades</span>
<h2>La caja de herramientas.</h2></div><div class="yo-tools-pose"><img src="/team/yoli/pose-brazos-seria.webp" alt="Yoli de brazos cruzados con una sonrisa segura" width="638" height="1000"/></div></div>
<div class="yo-tools">
<div class="yo-lav"><span class="mono">IA PARA MARKETING</span><div class="yo-chips"><span>Creación de contenido con IA</span><span>Productividad con IA</span></div></div>
<div class="yo-peach"><span class="mono">MARKETING</span><div class="yo-chips"><span>Analítica de métricas</span><span>Diseño digital</span><span>Edición de video básica</span><span>Copywriting</span><span>TikTok</span><span>Instagram</span></div></div>
<div class="yo-mint"><span class="mono">HABILIDADES BLANDAS</span><div class="yo-chips"><span>Comunicación asíncrona</span><span>Gestión de proyectos remotos</span><span>Oratoria de alto impacto</span><span>Relaciones públicas</span></div></div>
</div>
</div>
</section>

<!-- DETRÁS -->
<section class="yo-sec yo-life-sec">
<div class="yo-wrap">
<div class="yo-head-split"><div><span class="eyebrow"><b>07</b> · Detrás de la pantalla</span><h2>Una persona real detrás de cada marca.</h2></div><p class="hand yo-note">sí, soy yo la que responde</p></div>
<div class="yo-polas">
<figure class="yo-pola p1"><img src="/team/yoli/con-abisai-savaya.webp" alt="Yoli y Abisai sonriendo en la oficina de Savaya" width="720" height="792"/><figcaption class="hand">con Abisai en Savaya</figcaption></figure>
<figure class="yo-pola p2"><img src="/team/yoli/grado.webp" alt="Yoli con toga y birrete el día de su graduación" width="980" height="720"/><figcaption class="hand">día de grado</figcaption></figure>
<figure class="yo-pola p3"><img src="/team/yoli/certificado-unitec.webp" alt="Certificado de UNITEC" width="650" height="428"/><figcaption class="hand">IA + educación</figcaption></figure>
<figure class="yo-pola p4"><img src="/team/yoli/con-amiga.webp" alt="Yoli abrazada a una amiga, las dos sonriendo" width="640" height="826"/><figcaption class="hand">con mi gente</figcaption></figure>
<figure class="yo-pola p5"><img src="/team/yoli/camisa-verde.webp" alt="Yoli de espaldas con camisa verde y lentes de sol, mirando a cámara" width="640" height="889"/><figcaption class="hand">¡modo evento!</figcaption></figure>
</div>
</div>
</section>

<!-- MAMÁ -->
<section class="yo-sec yo-mom-sec">
<div class="yo-wrap">
<div class="yo-mom">
<div class="yo-mom-art" aria-hidden="true">
<svg viewBox="0 0 220 200" class="yo-heart"><path d="M110 178 C 52 136, 18 104, 18 66 C 18 38, 40 20, 64 20 C 84 20, 100 32, 110 50 C 120 32, 136 20, 156 20 C 180 20, 202 38, 202 66 C 202 104, 168 136, 110 178 Z" fill="#FFDCC7" stroke="#010E25" stroke-width="4" stroke-linejoin="round"/><path d="M64 52 C 52 56, 44 66, 44 78" fill="none" stroke="#FE5C02" stroke-width="5" stroke-linecap="round"/></svg>
<span class="hand yo-mom-note">mi motor</span>
</div>
<div class="yo-mom-txt">
<span class="eyebrow"><b>08</b> · Lo que me mueve</span>
<h2>Antes que todo, <span class="hand yo-hl">soy mamá</span>.</h2>
<p>Mi hija es lo que más quiero en el mundo. Por ella me levanto con ganas cada día y le pongo corazón a todo lo que hago: a cada clase, a cada marca y a cada historia que cuento.</p>
<p>Ser mamá me enseñó paciencia, creatividad y a escuchar de verdad. Eso mismo es lo que traigo a mi trabajo.</p>
<div class="yo-mom-tags"><span>Mamá de tiempo completo</span><span>Docente</span><span>Mercadóloga</span></div>
</div>
</div>
</div>
</section>

<!-- CTA -->
<section class="yo-cta">
<div class="yo-wrap yo-cta-grid">
<div>
<span class="eyebrow" style="color:rgba(255,248,240,.6)">Hablemos</span>
<h2>¿Tu marca necesita <span class="yo-o">voz</span>?</h2>
<p>Cuéntame qué vendes, a quién le hablas y dónde te mueves. Te digo por dónde empezaría con tu contenido.</p>
<div class="yo-ctas"><a class="btn btn-primary" href="https://wa.me/?text=Hola%20Yoli%2C%20quiero%20hablar%20de%20mi%20marca" style="border-color:#FFF8F0;box-shadow:0 4px 0 #FFF8F0">Escríbeme por WhatsApp ↗</a><a class="btn yo-btn-ghost" href="/about">Ver el equipo</a></div>
<p class="hand yo-sign">Un abrazo, Yoli</p>
</div>
<div class="yo-cta-pose"><img src="/team/yoli/pose-brazos-sonrisa.webp" alt="Yoli sonriendo de brazos cruzados" width="650" height="1000"/></div>
</div>
</section>

</main>
```

## CSS de referencia → `src/components/brand/yoli/yoli.css`

```css
/* ---------- Página de Yoli (yo-) ---------- */
.yo{--n:#010E25;--o:#FE5C02;--od:#C94400;--cr:#FFF8F0;--lav:#E4DEFF;--sky:#D6EBFF;--pe:#FFDCC7;--mi:#D3F2E3;--sl:#5A6178;--bo:#3A4158;--ind:#5142EB}
.yo *{box-sizing:border-box}
.yo-wrap{max-width:1240px;margin:0 auto;padding:0 24px}
.yo-sec{padding:clamp(64px,8vw,112px) 0}
.yo h2{font-size:clamp(34px,4.4vw,58px);margin-top:10px}
.yo .eyebrow b{color:var(--od)}
.yo-hl{color:var(--o);font-weight:700;font-size:1.18em;letter-spacing:0}
.yo-o{color:var(--o)}
.yo-bubble{position:absolute;z-index:4;background:var(--o);color:#fff;font-size:24px;font-weight:700;line-height:1;padding:10px 16px 11px;border-radius:18px;box-shadow:0 10px 24px rgba(1,14,37,.18)}
.yo-chips{display:flex;flex-wrap:wrap;gap:6px}
.yo-chips span{font-family:'JetBrains Mono',monospace;font-size:12.5px;background:#fff;border:1.5px solid rgba(1,14,37,.12);border-radius:999px;padding:5px 11px;color:var(--n)}
.yo-lav{background:var(--lav)}.yo-peach{background:var(--pe)}.yo-mint{background:var(--mi)}.yo-sky{background:var(--sky)}.yo-white{background:#fff;border:1.5px solid var(--n)}
.yo-navy{background:var(--n);color:var(--cr)}
.yo-head-split{display:flex;flex-wrap:wrap;justify-content:space-between;align-items:flex-end;gap:16px 40px;margin-bottom:36px}
.yo-head-split>p{max-width:380px;color:var(--sl);font-size:17px}

/* hero */
.yo-hero{padding:40px 0 80px;background:radial-gradient(900px 520px at 80% 35%,rgba(228,222,255,.95),transparent 68%),radial-gradient(600px 400px at 0% 100%,rgba(255,220,199,.7),transparent 70%);overflow:hidden}
.yo-hero-grid{display:grid;grid-template-columns:minmax(0,1.05fr) minmax(0,.95fr);gap:48px;align-items:center;margin-top:28px}
.yo-tags{display:flex;flex-wrap:wrap;gap:6px}
.yo-hola{font-size:40px;color:var(--o);font-weight:700;margin-top:22px !important;transform:rotate(-2deg);transform-origin:left}
.yo-hero h1{font-size:clamp(56px,8vw,112px);line-height:.88;letter-spacing:-.05em;margin-top:4px}
.yo-h1-2{display:block}
.yo-dot{color:var(--o)}
.yo-role{margin-top:20px !important;font-size:13px;letter-spacing:.08em;color:var(--n)}
.yo-role i{font-style:normal;color:var(--o);margin:0 4px}
.yo-pitch{margin-top:18px !important;font-size:19px;line-height:1.6;color:var(--bo);max-width:560px}
.yo-ctas{display:flex;flex-wrap:wrap;gap:12px;margin-top:28px}
.yo-loc{margin-top:18px !important;font-size:12.5px;color:var(--sl);display:flex;align-items:center;gap:8px}
.yo-hero-vis{position:relative;min-height:600px;display:flex;justify-content:center;align-items:flex-end}
.yo-arch{position:relative;z-index:2;width:min(420px,88%);aspect-ratio:432/560;border-radius:220px 220px 32px 32px;overflow:hidden;border:2px solid var(--n);box-shadow:14px 16px 0 var(--n);background:#ddd}
.yo-arch img{width:100%;height:100%;object-fit:cover;object-position:top;display:block}
.yo-iso-bg{position:absolute;z-index:1;width:520px;right:-120px;top:40px;opacity:.95}
.yo-b1{left:0;top:70px;transform:rotate(-6deg)}
.yo-b1::after{content:"";position:absolute;right:-8px;bottom:14px;border:9px solid transparent;border-left-color:var(--o);border-right:0}
.yo-float{position:absolute;z-index:3;background:#fff;border:1.5px solid var(--n);border-radius:20px;padding:14px 16px;display:flex;flex-direction:column;gap:2px;box-shadow:0 18px 40px -20px rgba(1,14,37,.5)}
.yo-float .mono{font-size:10px;letter-spacing:.08em;color:var(--sl)}
.yo-float b{font-size:40px;line-height:1;letter-spacing:-.04em}
.yo-float>span:last-child{font-size:13px;color:var(--bo)}
.yo-f1{left:-10px;bottom:90px;transform:rotate(-3deg)}
.yo-f2{right:0;bottom:30px;background:var(--mi);transform:rotate(4deg)}
.yo-f2 b{font-size:34px}

/* banda */
.yo-band{background:var(--n);color:var(--cr);overflow:hidden;padding:16px 0;transform:rotate(-1.2deg);margin:0 -20px}
.yo-band-in{display:flex;gap:22px;white-space:nowrap;width:max-content;font-size:15px;letter-spacing:.06em;text-transform:uppercase;animation:yo-mq 40s linear infinite}
.yo-band-in i{color:var(--o);font-style:normal}
@keyframes yo-mq{to{transform:translateX(-50%)}}
.still .yo-band-in{animation:none}
@media (prefers-reduced-motion:reduce){.yo-band-in{animation:none}}

/* sobre mí */
.yo-about{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:56px;align-items:center}
.yo-about p{font-size:17.5px;line-height:1.65;color:var(--bo);margin-top:18px !important}
.yo-stats{display:grid;grid-template-columns:1fr 1fr;gap:14px}
.yo-stat{border-radius:26px;padding:24px;display:flex;flex-direction:column;gap:8px;min-height:180px}
.yo-stat b{font-size:56px;line-height:1;letter-spacing:-.05em}
.yo-stat span{font-size:15px;line-height:1.45;color:var(--bo)}
.yo-stat.yo-navy span{color:rgba(255,248,240,.8)}
.yo-stat.yo-navy b{color:var(--o)}

/* hoy */
.yo-today-sec{background:#fff;border-radius:48px}
.yo-today{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:16px;margin-top:36px}
.yo-card{border-radius:28px;padding:26px;display:flex;flex-direction:column;gap:12px;position:relative}
.yo-card .tag{align-self:flex-start}
.yo-card h3{font-size:30px;margin-top:6px}
.yo-card p{font-size:16px;color:var(--bo);line-height:1.55;flex:1}
.yo-now{font-size:11px;letter-spacing:.08em;color:#1F7A47;font-weight:700}
.yo-link{color:var(--od);font-weight:600;text-decoration:none}

/* trayectoria */
.yo-tl-grid{display:grid;grid-template-columns:minmax(0,1.5fr) minmax(0,1fr);gap:48px;align-items:start}
.yo-tl{list-style:none;margin:32px 0 0;padding:0;position:relative}
.yo-tl::before{content:"";position:absolute;left:142px;top:8px;bottom:8px;width:2px;background:rgba(1,14,37,.14)}
.yo-tl>li{display:grid;grid-template-columns:124px 1fr;gap:40px;padding-bottom:28px;position:relative}
.yo-tl>li::after{content:"";position:absolute;left:135px;top:5px;width:16px;height:16px;border-radius:50%;background:var(--cr);border:2.5px solid var(--n)}
.yo-tl>li.cur::after{background:var(--o);border-color:var(--o)}
.yo-when{font-size:11.5px;letter-spacing:.04em;color:var(--sl);text-align:right;padding-top:3px}
.yo-tl>li.cur .yo-when{color:var(--od);font-weight:700}
.yo-tl h3{font-size:21px;letter-spacing:-.02em}
.yo-tl h3 span{font-weight:400;color:var(--sl)}
.yo-tl ul{margin:8px 0 0;padding-left:18px;display:flex;flex-direction:column;gap:5px}
.yo-tl ul li{font-size:15.5px;color:var(--bo);line-height:1.5}
.yo-tl-side{position:sticky;top:110px;display:flex;flex-direction:column;align-items:center;gap:18px}
.yo-st-verde{width:min(360px,100%);height:auto;transform:rotate(-4deg);filter:drop-shadow(0 14px 22px rgba(1,14,37,.15))}
.yo-b2{right:10px;top:-10px;transform:rotate(6deg)}
.yo-side-card{background:var(--lav);border-radius:26px;padding:22px;width:100%}
.yo-side-card>.mono{display:block;font-size:11px;letter-spacing:.08em;color:var(--sl);margin-bottom:12px}

/* lo que hago */
.yo-do-sec{background:var(--cr)}
.yo-do{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:14px}
.yo-do article{border-radius:26px;padding:26px;min-height:200px;display:flex;flex-direction:column;gap:10px}
.yo-do .mono{font-size:13px;font-weight:700;color:var(--od)}
.yo-do h3{font-size:24px}
.yo-do p{font-size:15.5px;color:var(--bo);line-height:1.5}

/* formación */
.yo-edu-sec{background:var(--n);color:var(--cr);border-radius:48px;padding:clamp(64px,8vw,112px) 0}
.yo-edu-sec h2{color:#fff}
.yo-edu-grid{display:grid;grid-template-columns:minmax(0,1.1fr) minmax(0,.9fr);gap:56px;align-items:center}
.yo-edu{list-style:none;margin:30px 0 0;padding:0;display:flex;flex-direction:column}
.yo-edu li{display:grid;grid-template-columns:120px 1fr;gap:18px;padding:16px 0;border-top:1px solid rgba(255,248,240,.14)}
.yo-edu li:last-child{border-bottom:1px solid rgba(255,248,240,.14)}
.yo-edu .mono{font-size:12px;letter-spacing:.06em;color:var(--o);font-weight:700;padding-top:3px}
.yo-edu b{display:block;font-size:18px;color:#fff;font-weight:600}
.yo-edu div span{font-size:14.5px;color:rgba(255,248,240,.65)}
.yo-edu li.new b::after{content:"NUEVO";margin-left:10px;font-family:'JetBrains Mono',monospace;font-size:10px;letter-spacing:.08em;background:var(--mi);color:var(--n);padding:2px 7px;border-radius:6px;vertical-align:3px}
.yo-edu-vis{position:relative;min-height:480px}
.yo-st-grado{position:absolute;right:-10px;top:0;width:78%;height:auto;transform:rotate(5deg);z-index:2;filter:drop-shadow(0 16px 26px rgba(0,0,0,.35))}
.yo-b3{left:10px;top:30px;transform:rotate(-6deg)}
.yo-cert{position:absolute;left:0;bottom:0;width:72%;margin:0;background:#fff;padding:8px 8px 10px;border-radius:6px;transform:rotate(-4deg);box-shadow:0 20px 40px rgba(0,0,0,.4);z-index:3}
.yo-cert img{width:100%;height:auto;display:block}
.yo-cert figcaption{font-size:10.5px;color:var(--sl);letter-spacing:.08em;text-align:center;margin-top:6px}

/* herramientas */
.yo-tools{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:14px;margin-top:32px}
.yo-tools>div{border-radius:26px;padding:24px}
.yo-tools>div>.mono{display:block;font-size:11px;letter-spacing:.1em;margin-bottom:14px;color:var(--n);opacity:.75}

/* detrás */
.yo-life-sec{padding-top:0}
.yo-note{font-size:30px;color:var(--o);font-weight:700;transform:rotate(-3deg)}
.yo-polas{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:28px;padding:10px}
.yo-pola{margin:0;background:#fff;padding:12px 12px 14px;box-shadow:0 24px 50px -24px rgba(1,14,37,.5);border:1px solid rgba(1,14,37,.06)}
.yo-pola img{width:100%;aspect-ratio:4/4.4;object-fit:cover;display:block}
.yo-pola.p3 img{object-fit:contain;background:#F2F1EE}
.yo-pola figcaption{font-size:24px;font-weight:700;text-align:center;margin-top:8px;color:var(--n)}
.yo-pola.p1{transform:rotate(-3deg)}.yo-pola.p2{transform:rotate(2deg) translateY(18px)}.yo-pola.p3{transform:rotate(-1.5deg)}

.yo-polas{display:flex;flex-wrap:wrap;justify-content:center;gap:34px 32px}
.yo-pola{flex:0 0 calc((100% - 64px) / 3)}
.yo-pola.p4{transform:rotate(3deg)}
.yo-pola.p5{transform:rotate(-2.5deg) translateY(12px)}
@media (max-width:960px){.yo-pola{flex-basis:calc((100% - 32px) / 2)}}
@media (max-width:640px){.yo-polas{flex-wrap:nowrap;justify-content:flex-start}.yo-pola{flex:0 0 72%}.yo-pola.p5{transform:rotate(-2.5deg)}}
/* mamá */
.yo-mom-sec{padding-top:0}
.yo-mom{display:grid;grid-template-columns:minmax(0,.7fr) minmax(0,1.3fr);gap:48px;align-items:center;background:var(--lav);border:2px solid var(--n);border-radius:40px;padding:clamp(28px,4vw,56px);box-shadow:12px 14px 0 var(--n)}
.yo-mom-art{position:relative;display:flex;justify-content:center}
.yo-heart{width:min(260px,100%);height:auto;transform:rotate(-6deg)}
.yo-mom-note{position:absolute;left:50%;top:44%;transform:translate(-50%,-50%) rotate(-6deg);font-size:38px;font-weight:700;color:var(--n);white-space:nowrap}
.yo-mom-txt p{font-size:18px;line-height:1.65;color:var(--bo);margin-top:16px !important;max-width:620px}
.yo-mom-tags{display:flex;flex-wrap:wrap;gap:8px;margin-top:22px}
.yo-mom-tags span{font-family:'JetBrains Mono',monospace;font-size:12.5px;padding:6px 12px;border-radius:999px;background:#fff;border:1.5px solid var(--n)}
.yo-mom-tags span:first-child{background:var(--o);color:#fff;border-color:var(--o)}
@media (max-width:760px){.yo-mom{grid-template-columns:1fr;gap:16px;border-radius:28px;box-shadow:7px 8px 0 var(--n)}.yo-heart{width:170px}.yo-mom-note{font-size:28px}.yo-mom-txt p{font-size:16px}}
/* cta */
.yo-cta{background:var(--n);color:var(--cr);border-radius:48px;margin:clamp(24px,4vw,48px) 0;padding:clamp(56px,7vw,96px) 0;overflow:hidden}
.yo-cta-grid{display:grid;grid-template-columns:minmax(0,1.3fr) minmax(0,.7fr);gap:40px;align-items:center}
.yo-cta h2{color:#fff}
.yo-cta p{font-size:18px;color:rgba(255,248,240,.75);margin-top:14px !important;max-width:520px}
.yo-btn-ghost{background:transparent;color:var(--cr);border-color:rgba(255,248,240,.5)}
.yo-btn-ghost:hover{background:var(--cr);color:var(--n)}
.yo-sign{font-size:34px;color:var(--o);font-weight:700;margin-top:20px !important;transform:rotate(-2deg);transform-origin:left}
.yo-cta-photo{justify-self:center;width:min(280px,100%);aspect-ratio:432/540;border-radius:150px 150px 24px 24px;overflow:hidden;border:2px solid var(--cr);box-shadow:10px 12px 0 var(--lav);transform:rotate(3deg)}
.yo-cta-photo img{width:100%;height:100%;object-fit:cover;object-position:top;display:block}

/* responsive */
@media (max-width:960px){
  .yo-hero-grid,.yo-about,.yo-tl-grid,.yo-edu-grid,.yo-cta-grid{grid-template-columns:minmax(0,1fr)}
  .yo-today,.yo-do,.yo-tools{grid-template-columns:1fr 1fr}
  .yo-tl-side{position:static}
  .yo-hero-vis{min-height:540px}
  .yo-edu-vis{min-height:440px;max-width:560px}
}
@media (max-width:640px){
  .yo-sec{padding:56px 0}
  .yo h2{font-size:32px}
  .yo-hero{padding:28px 0 56px}
  .yo-hola{font-size:32px}
  .yo-hero h1{font-size:58px}
  .yo-role{font-size:11.5px}
  .yo-pitch{font-size:16.5px}
  .yo-ctas{flex-direction:column}
  .yo-ctas .btn{width:100%}
  .yo-hero-vis{min-height:0;padding:30px 0 70px}
  .yo-arch{width:78%;box-shadow:8px 10px 0 var(--n)}
  .yo-iso-bg{width:320px;right:-110px;top:10px}
  .yo-b1{font-size:19px;left:-4px;top:12px}
  .yo-f1{left:-6px;bottom:20px;padding:10px 12px}
  .yo-f1 b{font-size:30px}
  .yo-f2{right:-4px;bottom:-6px;padding:10px 12px}
  .yo-f2 b{font-size:26px}
  .yo-stats{gap:10px}
  .yo-stat{padding:16px;min-height:0;border-radius:20px}
  .yo-stat b{font-size:38px}
  .yo-stat span{font-size:13.5px}
  .yo-today-sec,.yo-edu-sec,.yo-cta{border-radius:32px}
  .yo-today,.yo-do,.yo-tools{display:flex;overflow-x:auto;scroll-snap-type:x mandatory;gap:12px;margin-left:-24px;margin-right:-24px;padding:4px 24px 14px;scrollbar-width:none}
  .yo-today>*,.yo-do>*,.yo-tools>*{flex:0 0 82%;scroll-snap-align:start}
  .yo-card h3{font-size:24px}
  .yo-tl::before{left:7px}
  .yo-tl>li{grid-template-columns:1fr;gap:4px;padding-left:30px}
  .yo-tl>li::after{left:0}
  .yo-when{text-align:left}
  .yo-tl h3{font-size:18px}
  .yo-tl ul li{font-size:14.5px}
  .yo-st-verde{width:70%}
  .yo-b2{font-size:19px;right:0}
  .yo-edu li{grid-template-columns:1fr;gap:2px}
  .yo-edu b{font-size:16.5px}
  .yo-edu-vis{min-height:340px}
  .yo-b3{font-size:19px}
  .yo-polas{display:flex;overflow-x:auto;scroll-snap-type:x mandatory;gap:16px;margin:0 -24px;padding:10px 24px 24px}
  .yo-pola{flex:0 0 72%;scroll-snap-align:center}
  .yo-pola.p2{transform:rotate(2deg)}
  .yo-note{font-size:24px}
  .yo-cta-photo{width:200px}
  .yo-sign{font-size:28px}
}


/* ---- poses de Yoli ---- */
.yo-pose-hero{position:relative;z-index:2;height:600px;width:auto;display:block;filter:drop-shadow(0 18px 30px rgba(1,14,37,.18))}
.yo-hero{padding-bottom:0}
.yo-hero-txt{padding-bottom:80px}
.yo-b1{left:-10px;top:24px}
.yo-tl-grid{grid-template-columns:minmax(0,1fr) minmax(0,1.5fr)}
.yo-tl-side{order:-1}
.yo-pose-tl{width:auto;height:470px;max-width:100%;display:block;filter:drop-shadow(0 14px 22px rgba(1,14,37,.15))}
.yo-tl-side .yo-b2{right:auto;left:0;top:30px;transform:rotate(-5deg)}
.yo-edu-grid{grid-template-columns:minmax(0,.9fr) minmax(0,1.1fr)}
.yo-edu-vis{order:-1;min-height:540px}
.yo-pose-edu{position:absolute;right:0;bottom:-24px;height:520px;width:auto;z-index:3;filter:drop-shadow(0 16px 26px rgba(0,0,0,.35))}
.yo-edu-vis .yo-cert{left:0;top:40px;bottom:auto;width:62%;z-index:1}
.yo-edu-vis .yo-b3{left:0;top:auto;bottom:70px;z-index:4}
.yo-do-wrap{display:grid;grid-template-columns:260px minmax(0,1fr);gap:24px;align-items:end}
.yo-do-pose{position:relative;align-self:stretch;min-height:420px}
.yo-do-pose img{position:absolute;left:-10px;bottom:0;height:460px;width:auto}
.yo-do-pose .yo-bubble{left:10px;top:0;transform:rotate(-6deg)}
.yo-tools-head{display:grid;grid-template-columns:minmax(0,1fr) 240px;align-items:end;gap:20px}
.yo-tools-pose{position:relative;height:200px}
.yo-tools-pose img{position:absolute;right:0;bottom:-70px;height:290px;width:auto;z-index:1}
.yo-tools{position:relative;z-index:2}
.yo-cta{padding-bottom:0}
.yo-cta-grid{align-items:end}
.yo-cta-grid>div:first-child{padding-bottom:clamp(56px,7vw,96px)}
.yo-cta-pose{display:flex;justify-content:center}
.yo-cta-pose img{height:440px;width:auto;display:block}
@media (max-width:960px){
  .yo-hero-txt{padding-bottom:0}
  .yo-tl-grid,.yo-edu-grid{grid-template-columns:minmax(0,1fr)}
  .yo-tl-side,.yo-edu-vis{order:0}
  .yo-pose-tl{height:380px}
  .yo-edu-vis{min-height:480px}
  .yo-do-wrap{grid-template-columns:1fr}
  .yo-do-pose{min-height:0;height:300px;order:2}
  .yo-do-pose img{left:50%;transform:translateX(-50%);height:320px;bottom:-56px}
  .yo-cta-grid>div:first-child{padding-bottom:0}
}
@media (max-width:640px){
  .yo-hero-vis{padding:40px 0 0}
  .yo-pose-hero{height:440px}
  .yo-b1{top:0}
  .yo-f1{bottom:60px}
  .yo-f2{bottom:20px}
  .yo-pose-tl{height:320px}
  .yo-edu-vis{min-height:400px}
  .yo-pose-edu{height:360px;bottom:-56px}
  .yo-edu-vis .yo-cert{width:70%;top:10px}
  .yo-edu-vis .yo-b3{bottom:40px}
  .yo-do-pose{height:260px}
  .yo-do-pose img{height:290px}
  .yo-tools-head{grid-template-columns:1fr}
  .yo-tools-pose{height:150px}
  .yo-tools-pose img{right:50%;transform:translateX(50%);height:230px;bottom:-56px}
  .yo-cta-pose img{height:320px}
}
```

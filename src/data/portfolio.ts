// Portafolio de proyectos de ClicKonversion.
// Capturas en /public/portfolio/<slug>/ (portada: d1-hero y m1-hero). La galería completa está en portfolio-gallery.ts.
// Si un proyecto no tiene capturas todavía, deja `shots: null` y se muestra una portada de marca.

export type ProjectCategory = "web" | "ecommerce" | "plataforma"
export type ProjectStatus = "En línea" | "En desarrollo" | "En aprobación" | "Propuesta de rediseño"

export interface PortfolioProject {
  slug: string
  name: string
  client: string
  sector: string
  location: string
  categories: ProjectCategory[]
  status: ProjectStatus
  /** Una línea para la tarjeta */
  summary: string
  challenge: string
  solution: string[]
  deliverables: string[]
  stack: string[]
  url?: string
  shots: { desktop: string; mobile: string } | null
  /** Color de la portada cuando no hay capturas */
  cover: { bg: string; fg: string; accent: string }
}

export const PROJECTS: PortfolioProject[] = [
  {
    slug: "savaya",
    name: "Savaya · tienda en línea",
    client: "Savaya",
    sector: "Calzado venezolano",
    location: "Valencia, Carabobo, Venezuela",
    categories: ["ecommerce", "web"],
    status: "En línea",
    summary: "Tienda en línea de calzado para mujer, hombre y niños, con pagos locales y envíos a toda Venezuela.",
    challenge: "Savaya vendía sobre todo al mayor. Necesitaba vender al detal por color y talla, cobrar con los métodos que usa el cliente venezolano y saber qué leads de sus anuncios terminaban escribiendo por WhatsApp.",
    solution: [
      "Tienda en Next.js con categorías para mujer, hombre y niños, colección VIP, lista de deseos, carrito y cuenta de cliente.",
      "Pagos con Pago Móvil, Zelle, USDT y Binance Pay, y envíos a toda Venezuela desde Valencia.",
      "Código de referencia en el mensaje de WhatsApp para saber qué lead del formulario escribió.",
      "Siguiente fase: conexión con el inventario de Odoo para vender al detal sin duplicar stock.",
    ],
    deliverables: ["Tienda en línea", "Catálogo por categorías", "Checkout con pagos locales", "Plan de integración con Odoo"],
    stack: ["Next.js", "TypeScript", "PostgreSQL (Neon)", "Drizzle", "Vercel"],
    url: "https://www.savayavzla.com",
    shots: { desktop: "/portfolio/savaya/d1-hero.webp", mobile: "/portfolio/savaya/m1-hero.webp" },
    cover: { bg: "#0A0A0A", fg: "#F7F5F0", accent: "#C9A227" },
  },
  {
    slug: "hacienda-los-bucaros",
    name: "Hacienda Hotel Los Búcaros",
    client: "Hacienda Hotel Los Búcaros",
    sector: "Hotelería y turismo",
    location: "Barbosa, Antioquia, Colombia",
    categories: ["web"],
    status: "En aprobación",
    summary: "Sitio para un hotel campestre a 1 hora de Medellín: lago, piscina, pasadías y reservas en un minuto.",
    challenge: "El hotel necesitaba un sitio moderno, rápido y fácil de manejar por su equipo, que transmitiera la calma de la hacienda y llevara a la gente a reservar.",
    solution: [
      "Diseño con los colores pastel del logo y fotos reales del lugar.",
      "Versión preliminar publicada en Netlify para que la clienta la revise y apruebe antes de programar el sitio final.",
      "Estructura pensada para SEO local y reservas por WhatsApp.",
    ],
    deliverables: ["Diseño del sitio", "Versión preliminar en línea", "SEO local"],
    stack: ["Diseño web", "Netlify"],
    url: "https://losbucaros.netlify.app",
    shots: { desktop: "/portfolio/hacienda-los-bucaros/d1-hero.webp", mobile: "/portfolio/hacienda-los-bucaros/m1-hero.webp" },
    cover: { bg: "#E8F1E4", fg: "#2F3B2A", accent: "#E9A6A6" },
  },
  {
    slug: "dr-follicle-solutions",
    name: "Dr. Follicle Solutions",
    client: "Dr. Follicle Solutions",
    sector: "Medicina capilar · trasplante de cabello",
    location: "Medellín, Colombia",
    categories: ["web"],
    status: "Propuesta de rediseño",
    summary: "Rediseño del sitio de una clínica de trasplante capilar, respetando sus colores e imágenes.",
    challenge: "La clínica quería un sitio más claro y que convirtiera mejor, sin perder su identidad ni el enfoque médico que genera confianza en sus pacientes.",
    solution: [
      "Varias versiones de rediseño que respetan los colores e imágenes del sitio actual.",
      "Jerarquía enfocada en el paciente: procedimientos, resultados, preguntas frecuentes y contacto por WhatsApp.",
      "Versiones publicadas en Netlify para que el cliente compare y elija.",
    ],
    deliverables: ["Propuestas de rediseño", "Prototipos en línea"],
    stack: ["HTML / Next.js", "Netlify"],
    url: "https://cheery-croquembouche-a72d65.netlify.app/version-a/?escritorio",
    shots: { desktop: "/portfolio/dr-follicle-solutions/d1-hero.webp", mobile: "/portfolio/dr-follicle-solutions/m1-hero.webp" },
    cover: { bg: "#0E2A3B", fg: "#FFFFFF", accent: "#6FC3D9" },
  },
  {
    slug: "score-music-finance-pro",
    name: "Plataforma SCORE · Music Finance Pro",
    client: "Music Finance Pro",
    sector: "Industria musical",
    location: "Remoto",
    categories: ["plataforma", "web"],
    status: "En desarrollo",
    summary: "MVP de una plataforma de diagnóstico para la industria musical, más su web de lanzamiento.",
    challenge: "Music Finance Pro necesitaba convertir su metodología de diagnóstico para artistas y negocios musicales en una plataforma digital, y una web que la explicara y vendiera con claridad.",
    solution: [
      "MVP de la Plataforma SCORE planificado en 6 productos entregables y 14 semanas.",
      "Web de SCORE en dos versiones: la del mockup del cliente y una propia optimizada para conversión y claridad.",
    ],
    deliverables: ["Propuesta técnica del MVP", "Plataforma SCORE (MVP)", "Web de lanzamiento · versiones A y B"],
    stack: ["Next.js", "TypeScript", "Netlify"],
    url: "https://earnest-kitsune-a6441d.netlify.app/version-a/",
    shots: { desktop: "/portfolio/score-music-finance-pro/d1-hero.webp", mobile: "/portfolio/score-music-finance-pro/m1-hero.webp" },
    cover: { bg: "#151033", fg: "#FFFFFF", accent: "#B89CFF" },
  },
  {
    slug: "zoe-catalogo",
    name: "Zoe · catálogo con pedidos por WhatsApp",
    client: "Zoe Shoes",
    sector: "Zapatería",
    location: "Valencia, Venezuela",
    categories: ["ecommerce", "plataforma"],
    status: "En línea",
    summary: "Catálogo en línea donde el cliente arma su pedido y lo envía por WhatsApp a la sucursal que elija.",
    challenge: "Zoe vendía por WhatsApp sin un catálogo ordenado. Necesitaba mostrar sus productos con precios claros, recibir pedidos organizados por sucursal y usar ese catálogo en sus campañas de Meta Ads.",
    solution: [
      "Catálogo con carrito que envía el pedido por WhatsApp a la sucursal elegida, con respaldo al número principal.",
      "Precios en dólares y bolívares a la vez, con tasa BCV automática y registro de la tasa en cada pedido.",
      "Panel de administración con roles, inventario por sucursal, importación de productos y doble factor de seguridad.",
      "Panel de salud del sistema, registros de errores y guía de lanzamiento.",
    ],
    deliverables: ["Catálogo en línea", "Panel de administración", "Integración con WhatsApp", "Guía de lanzamiento"],
    stack: ["Next.js", "TypeScript", "Supabase", "Vercel", "Vitest", "Playwright"],
    url: "https://zoecatalogo.vercel.app",
    shots: { desktop: "/portfolio/zoe-catalogo/d1-hero.webp", mobile: "/portfolio/zoe-catalogo/m1-hero.webp" },
    cover: { bg: "#3B2416", fg: "#FFF8F0", accent: "#E7B07A" },
  },
  {
    slug: "medallo-futbol-club",
    name: "Medallo Fútbol Club",
    client: "Medallo Fútbol Club",
    sector: "Club de fútbol femenino",
    location: "Medellín, Colombia",
    categories: ["web"],
    status: "En línea",
    summary: "Sitio de un club oficial de fútbol femenino: categorías, horarios, precios e inscripciones en línea.",
    challenge: "El club necesitaba un sitio que transmitiera su propósito, formar jugadoras, líderes y grandes personas, y que las familias pudieran ver categorías, horarios y precios para inscribirse sin escribir primero.",
    solution: [
      "Hero con la identidad del club, «Nacidas en Medallo. Preparadas para el mundo.», y fotos reales de las jugadoras.",
      "Secciones de historia, valores, categorías (Semillero, Formación, Desarrollo y Competencia), horarios, galería y precios.",
      "Botón de inscripción siempre visible y SEO local para «fútbol femenino en Medellín».",
    ],
    deliverables: ["Diseño y desarrollo web", "Página de inscripciones", "SEO local"],
    stack: ["Sitio a medida", "Vercel"],
    url: "https://www.medallofutbolclub.com",
    shots: { desktop: "/portfolio/medallo-futbol-club/d1-hero.webp", mobile: "/portfolio/medallo-futbol-club/m1-hero.webp" },
    cover: { bg: "#0B3D2E", fg: "#FFFFFF", accent: "#FFD23F" },
  },
  {
    slug: "design-by-bc",
    name: "Design by BC",
    client: "Design by BC",
    sector: "Diseño de interiores",
    location: "Chicago, EE. UU.",
    categories: ["web"],
    status: "En línea",
    summary: "Sitio de un estudio de interiorismo en Chicago, con portafolio de proyectos y reserva de consultas.",
    challenge: "El estudio necesitaba un sitio a la altura de su trabajo: elegante, rápido y que convirtiera visitas en consultas, con su galería de proyectos al frente.",
    solution: [
      "Diseño editorial con tipografía serif, fotografía protagonista y paleta cálida.",
      "Galería de proyectos y servicios organizados para que el cliente encuentre lo que busca.",
      "Llamadas a la acción claras para reservar una consulta.",
      "Su marca hermana, Beacon Lighting Designs, se está reconstruyendo con el mismo sistema de diseño y un plan SEO/AEO propio.",
    ],
    deliverables: ["Diseño y desarrollo web", "Galería de proyectos", "SEO"],
    stack: ["Next.js", "Vercel"],
    url: "https://www.designbybc.com",
    shots: { desktop: "/portfolio/design-by-bc/d1-hero.webp", mobile: "/portfolio/design-by-bc/m1-hero.webp" },
    cover: { bg: "#F4EFE8", fg: "#1C1A17", accent: "#C8956B" },
  },
  {
    slug: "clickonversion",
    name: "ClicKonversion · nuestro propio sitio",
    client: "ClicKonversion",
    sector: "Agencia de marketing digital",
    location: "Venezuela · remoto",
    categories: ["web", "ecommerce", "plataforma"],
    status: "En desarrollo",
    summary: "Nuestro sitio: tienda de servicios con carrito y PayPal, portal de clientes, CRM interno y suscripciones a SyncLead.",
    challenge: "Queríamos un sitio que vendiera solo: precios publicados, compra en línea, seguimiento de cada cliente y una marca que se sintiera humana.",
    solution: [
      "Marca nueva aplicada a todo el sitio: marino, naranja, crema y un pastel por servicio.",
      "Tienda de servicios con carrito, paquetes, armador de paquetes y pago con PayPal.",
      "Portal de clientes, panel de administración y CRM interno.",
      "Suscripciones a SyncLead con la API de PayPal y blog optimizado para SEO.",
    ],
    deliverables: ["Identidad de marca", "Sitio web", "Tienda y checkout", "Portal de clientes", "CRM interno", "Blog"],
    stack: ["Next.js 16", "TypeScript", "Tailwind 4", "Neon + Drizzle", "PayPal", "Resend", "Vercel"],
    url: "https://www.clickonversion.com",
    shots: { desktop: "/portfolio/clickonversion/d1-hero.webp", mobile: "/portfolio/clickonversion/m1-hero.webp" },
    cover: { bg: "#010E25", fg: "#FFFFFF", accent: "#FE5C02" },
  },
]

export function getProject(slug: string) {
  return PROJECTS.find((p) => p.slug === slug)
}

/** Casos de consultoría técnica de Meta y WhatsApp Business API (anónimos). */
export interface ConsultingCase {
  tag: string
  client: string
  problem: string
  diagnosis: string
  solution: string
}

export const CONSULTING_CASES: ConsultingCase[] = [
  {
    tag: "[WABA]",
    client: "Negocio que usa una plataforma de agentes de IA",
    problem: "Su cuenta de WhatsApp Business no aparecía al conectarla con la plataforma de agentes de IA.",
    diagnosis: "El número estaba registrado como WhatsApp Business App y no como Cloud API, y la cuenta no tenía método de pago.",
    solution: "Ajustamos el registro, agregamos el método de pago en el Business Manager y completamos la conexión.",
  },
  {
    tag: "[COEXISTENCIA]",
    client: "Negocio que quería seguir usando la app y la API a la vez",
    problem: "El alta en modo coexistencia fallaba al conectar el número.",
    diagnosis: "El flujo de registro no enviaba el parámetro de coexistencia que exige Meta (featureType de onboarding de WhatsApp Business App).",
    solution: "Corregimos la configuración del registro para que el número funcionara en la app y en la API al mismo tiempo.",
  },
  {
    tag: "[REGISTRO]",
    client: "Negocio con número bloqueado para registrarse",
    problem: "El número no podía registrarse en la plataforma de su proveedor.",
    diagnosis: "Tenía activado el etiquetado automático de eventos de WhatsApp Business, que bloqueaba el registro.",
    solution: "Desactivamos el etiquetado automático, liberamos el número y completamos el registro.",
  },
  {
    tag: "[PAGOS]",
    client: "Negocios con mensajes y campañas detenidos",
    problem: "Los mensajes y anuncios dejaron de funcionar de un día para otro.",
    diagnosis: "El método de pago se había desconectado de la cuenta de WhatsApp o de la cuenta publicitaria.",
    solution: "Reconectamos el método de pago en el lugar correcto del Business Manager y verificamos que todo volviera a correr.",
  },
  {
    tag: "[CTWA]",
    client: "Anunciantes con campañas a WhatsApp",
    problem: "Los anuncios de clic a WhatsApp daban error o no se podían publicar.",
    diagnosis: "Revisamos la conexión entre la página, el número de WhatsApp y la cuenta publicitaria, y los permisos de cada una.",
    solution: "Ordenamos los activos del Business Manager y dejamos las campañas publicando hacia el número correcto.",
  },
  {
    tag: "[RESTRICCIÓN]",
    client: "Cuentas de WhatsApp Business restringidas",
    problem: "La cuenta de WhatsApp Business quedó restringida o con límites de envío.",
    diagnosis: "Identificamos qué política o señal de calidad había provocado la restricción.",
    solution: "Preparamos la apelación con la información correcta y ajustamos plantillas y prácticas de envío para evitar que se repita.",
  },
  {
    tag: "[PERMISOS]",
    client: "Empresas que trabajan con un proveedor oficial (BSP)",
    problem: "No podían hacer cambios en su cuenta porque el proveedor tenía los permisos.",
    diagnosis: "Revisamos qué controla el proveedor y qué controla la empresa dentro del Business Manager.",
    solution: "Les explicamos las opciones y los acompañamos a recuperar o compartir el acceso necesario.",
  },
  {
    tag: "[MARKETPLACE]",
    client: "Taller automotriz que vende por Facebook Marketplace",
    problem: "Facebook marcaba sus publicaciones como spam y limitaba sus perfiles.",
    diagnosis: "Analizamos el estado de cada perfil, las apelaciones y la forma en que publicaban.",
    solution: "Diseñamos una metodología de publicación orgánica sin bloqueos, anuncios en Marketplace y un catálogo web propio.",
  },
]

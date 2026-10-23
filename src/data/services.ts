export type ServiceCategory = "seo" | "paid-media" | "automation" | "support"

export interface ServiceFAQ {
  q: string
  a: string
}

export interface ServiceProcessStep {
  step: string
  title: string
  description: string
}

export interface ServicePlan {
  name: string
  price: string
  note: string
  features: string[]
}

export interface ServiceContent {
  name: string
  tagline: string
  description: string
  targetAudience: string
  included: string[]
  notIncluded: string[]
  process: ServiceProcessStep[]
  plans: ServicePlan[]
  faq: ServiceFAQ[]
}

export interface Service {
  slug: string
  category: ServiceCategory
  accent: "mint" | "violet" | "warm" | "orange"
  icon: string
  en: ServiceContent
  es: ServiceContent
}

export const services: Service[] = [
  /* ────────────────────────────── SEO ─────────────────────────────── */
  {
    slug: "seo",
    category: "seo",
    accent: "mint",
    icon: "📈",
    en: {
      name: "SEO",
      tagline: "Rank where your customers search",
      description:
        "A comprehensive SEO strategy that increases organic visibility, drives qualified traffic, and turns search engines into your most reliable lead source.",
      targetAudience:
        "Businesses that want consistent inbound leads from Google without paying per click.",
      included: [
        "Technical SEO audit",
        "Keyword research & content strategy",
        "On-page optimization (meta, headings, structured data)",
        "Link building",
        "Monthly reporting with rankings & traffic data",
        "Google Search Console management",
      ],
      notIncluded: [
        "Paid advertising campaigns",
        "Social media content creation",
        "Web design or development (unless scoped separately)",
      ],
      process: [
        { step: "01", title: "Audit", description: "Full technical and content audit of your current search presence." },
        { step: "02", title: "Strategy", description: "Keyword map, content plan, and 90-day roadmap." },
        { step: "03", title: "Execution", description: "On-page fixes, content production, and link building." },
        { step: "04", title: "Reporting", description: "Monthly calls with rankings, traffic, and next priorities." },
      ],
      plans: [
        {
          name: "Starter",
          price: "From $800/mo",
          note: "Ideal for small businesses entering SEO",
          features: ["10 target keywords", "Monthly content optimizations", "Basic link building", "Monthly report"],
        },
        {
          name: "Growth",
          price: "From $1,800/mo",
          note: "For businesses ready to dominate their category",
          features: ["30+ target keywords", "2 content pieces/month", "Active link building", "Bi-weekly calls"],
        },
        {
          name: "Scale",
          price: "Custom",
          note: "Enterprise SEO programs",
          features: ["Unlimited keywords", "Full content team", "Competitor displacement", "Weekly strategy sessions"],
        },
      ],
      faq: [
        { q: "How long until I see SEO results?", a: "Most clients see measurable ranking improvements in 60–90 days. Significant traffic growth typically comes in months 4–6." },
        { q: "Do you guarantee rankings?", a: "No ethical SEO agency guarantees specific rankings — that's determined by Google's algorithm. We guarantee transparent work, clear reporting, and consistent effort." },
        { q: "What industries do you work with?", a: "We work with service businesses, SaaS companies, e-commerce, and local businesses across multiple markets." },
      ],
    },
    es: {
      name: "SEO",
      tagline: "Aparece donde buscan tus clientes",
      description:
        "Una estrategia SEO integral que aumenta tu visibilidad orgánica, atrae tráfico calificado y convierte a los motores de búsqueda en tu fuente de leads más confiable.",
      targetAudience:
        "Negocios que quieren leads constantes desde Google sin pagar por cada clic.",
      included: [
        "Auditoría técnica SEO",
        "Investigación de palabras clave y estrategia de contenido",
        "Optimización on-page (meta, encabezados, datos estructurados)",
        "Construcción de enlaces",
        "Reportes mensuales con rankings y datos de tráfico",
        "Gestión de Google Search Console",
      ],
      notIncluded: [
        "Campañas de publicidad pagada",
        "Creación de contenido para redes sociales",
        "Diseño o desarrollo web (a menos que se cotice por separado)",
      ],
      process: [
        { step: "01", title: "Auditoría", description: "Análisis técnico y de contenido de tu presencia en búsquedas." },
        { step: "02", title: "Estrategia", description: "Mapa de keywords, plan de contenido y hoja de ruta a 90 días." },
        { step: "03", title: "Ejecución", description: "Correcciones on-page, producción de contenido y link building." },
        { step: "04", title: "Reportes", description: "Reuniones mensuales con rankings, tráfico y próximas prioridades." },
      ],
      plans: [
        {
          name: "Starter",
          price: "Desde $800/mes",
          note: "Ideal para negocios que inician en SEO",
          features: ["10 keywords objetivo", "Optimizaciones mensuales", "Link building básico", "Reporte mensual"],
        },
        {
          name: "Crecimiento",
          price: "Desde $1,800/mes",
          note: "Para negocios listos para dominar su categoría",
          features: ["30+ keywords objetivo", "2 artículos/mes", "Link building activo", "Llamadas quincenales"],
        },
        {
          name: "Escala",
          price: "Personalizado",
          note: "Programas SEO empresariales",
          features: ["Keywords ilimitados", "Equipo de contenido completo", "Desplazamiento de competencia", "Sesiones semanales"],
        },
      ],
      faq: [
        { q: "¿Cuánto tiempo tarda en funcionar el SEO?", a: "La mayoría de los clientes ven mejoras medibles en 60–90 días. El crecimiento significativo de tráfico suele llegar en los meses 4–6." },
        { q: "¿Garantizan posiciones en Google?", a: "Ninguna agencia ética garantiza posiciones específicas — eso lo determina el algoritmo de Google. Garantizamos trabajo transparente, reportes claros y esfuerzo constante." },
        { q: "¿Con qué industrias trabajan?", a: "Trabajamos con negocios de servicios, SaaS, e-commerce y negocios locales en múltiples mercados." },
      ],
    },
  },
  {
    slug: "local-seo",
    category: "seo",
    accent: "mint",
    icon: "📍",
    en: {
      name: "Local SEO",
      tagline: "Own your local market on Google",
      description:
        "Dominate local search results and Google Maps so nearby customers find you first — not your competitors.",
      targetAudience: "Service businesses with a physical presence or local service area.",
      included: [
        "Google Business Profile optimization",
        "Local citation building and cleanup",
        "Local keyword targeting",
        "Review management strategy",
        "Local link building",
        "Map pack ranking tracking",
      ],
      notIncluded: ["National/international SEO (separate scope)", "Paid ads"],
      process: [
        { step: "01", title: "Profile audit", description: "Review your GBP and local listings for gaps and errors." },
        { step: "02", title: "Optimization", description: "Optimize your GBP, NAP consistency, and local citations." },
        { step: "03", title: "Authority building", description: "Local links, reviews strategy, and geo-targeted content." },
        { step: "04", title: "Tracking", description: "Map pack positions, calls, and direction requests tracked monthly." },
      ],
      plans: [
        {
          name: "Local Starter",
          price: "From $500/mo",
          note: "1 location",
          features: ["GBP optimization", "Citation building", "Review strategy", "Monthly report"],
        },
        {
          name: "Multi-Location",
          price: "Custom",
          note: "2+ locations",
          features: ["All locations covered", "Custom content per market", "Competitive analysis", "Bi-weekly calls"],
        },
      ],
      faq: [
        { q: "Do I need a physical address?", a: "No. Service area businesses (plumbers, cleaners, contractors) qualify for GBP with a service area, no storefront required." },
        { q: "How important are reviews?", a: "Critical. Reviews are one of the top 3 local ranking factors. We build a system to generate consistent authentic reviews." },
      ],
    },
    es: {
      name: "SEO Local",
      tagline: "Domina tu mercado local en Google",
      description:
        "Aparece primero en los resultados locales y Google Maps para que los clientes cercanos te encuentren a ti, no a tu competencia.",
      targetAudience: "Negocios de servicios con presencia física o área de servicio local.",
      included: [
        "Optimización de Google Business Profile",
        "Construcción y limpieza de citas locales",
        "Palabras clave geolocalidas",
        "Estrategia de gestión de reseñas",
        "Link building local",
        "Seguimiento de posiciones en el mapa",
      ],
      notIncluded: ["SEO nacional/internacional (scope separado)", "Publicidad pagada"],
      process: [
        { step: "01", title: "Auditoría", description: "Revisión de tu GBP y listados locales para identificar errores y oportunidades." },
        { step: "02", title: "Optimización", description: "Optimización de GBP, consistencia de NAP y citas locales." },
        { step: "03", title: "Autoridad", description: "Links locales, estrategia de reseñas y contenido geodirigido." },
        { step: "04", title: "Seguimiento", description: "Posiciones en el mapa, llamadas y solicitudes de ruta rastreadas mensualmente." },
      ],
      plans: [
        {
          name: "Local Starter",
          price: "Desde $500/mes",
          note: "1 ubicación",
          features: ["Optimización de GBP", "Construcción de citas", "Estrategia de reseñas", "Reporte mensual"],
        },
        {
          name: "Multi-Ubicación",
          price: "Personalizado",
          note: "2+ ubicaciones",
          features: ["Todas las ubicaciones cubiertas", "Contenido por mercado", "Análisis competitivo", "Llamadas quincenales"],
        },
      ],
      faq: [
        { q: "¿Necesito una dirección física?", a: "No. Los negocios de área de servicio (plomeros, limpieza, contratistas) califican para GBP con un área de servicio, sin vitrina requerida." },
        { q: "¿Qué tan importantes son las reseñas?", a: "Críticas. Las reseñas son uno de los 3 principales factores de posicionamiento local. Construimos un sistema para generar reseñas auténticas de forma constante." },
      ],
    },
  },
  {
    slug: "technical-seo",
    category: "seo",
    accent: "mint",
    icon: "⚙️",
    en: {
      name: "Technical SEO",
      tagline: "Fix what's blocking your rankings",
      description:
        "Systematic technical audits and fixes that ensure search engines can crawl, index, and rank your site without friction.",
      targetAudience: "Businesses with existing sites that aren't ranking despite content efforts.",
      included: [
        "Full crawl analysis (Screaming Frog / Sitebulb)",
        "Core Web Vitals audit and optimization",
        "Site architecture and internal linking review",
        "Canonicalization and duplicate content fixes",
        "Structured data implementation",
        "XML sitemap and robots.txt audit",
        "Log file analysis (enterprise)",
      ],
      notIncluded: ["Content creation", "Ongoing monthly SEO (separate retainer)"],
      process: [
        { step: "01", title: "Crawl", description: "Full technical crawl of your site to surface all issues." },
        { step: "02", title: "Prioritize", description: "Issues ranked by impact: critical, high, medium, low." },
        { step: "03", title: "Fix", description: "We fix directly or provide dev-ready specifications." },
        { step: "04", title: "Validate", description: "Re-crawl and GSC monitoring to confirm fixes took effect." },
      ],
      plans: [
        {
          name: "Technical Audit",
          price: "From $1,200 (one-time)",
          note: "Deliverable: prioritized issue list + fix specifications",
          features: ["Full crawl analysis", "CWV audit", "Architecture review", "Action plan document"],
        },
        {
          name: "Audit + Implementation",
          price: "From $2,500 (one-time)",
          note: "We fix it for you",
          features: ["Everything in Audit", "Direct implementation", "Validation crawl", "30-day follow-up"],
        },
      ],
      faq: [
        { q: "Is technical SEO a one-time or ongoing service?", a: "The audit is one-time, but technical health requires ongoing attention. We offer ongoing technical monitoring as part of monthly retainers." },
        { q: "What site builders/CMS do you support?", a: "WordPress, Webflow, Next.js, Shopify, and custom stacks. We provide fix specs for any platform." },
      ],
    },
    es: {
      name: "SEO Técnico",
      tagline: "Elimina lo que bloquea tus rankings",
      description:
        "Auditorías técnicas sistemáticas que aseguran que los motores de búsqueda puedan rastrear, indexar y posicionar tu sitio sin fricción.",
      targetAudience: "Negocios con sitios existentes que no posicionan a pesar de sus esfuerzos de contenido.",
      included: [
        "Análisis de rastreo completo (Screaming Frog / Sitebulb)",
        "Auditoría y optimización de Core Web Vitals",
        "Revisión de arquitectura y enlazado interno",
        "Corrección de canonicalización y contenido duplicado",
        "Implementación de datos estructurados",
        "Auditoría de sitemap XML y robots.txt",
        "Análisis de archivos de log (empresas)",
      ],
      notIncluded: ["Creación de contenido", "SEO mensual continuo (retainer separado)"],
      process: [
        { step: "01", title: "Rastreo", description: "Crawl técnico completo de tu sitio para detectar todos los problemas." },
        { step: "02", title: "Priorizar", description: "Problemas clasificados por impacto: crítico, alto, medio, bajo." },
        { step: "03", title: "Corregir", description: "Corregimos directamente o entregamos especificaciones listas para developers." },
        { step: "04", title: "Validar", description: "Re-crawl y monitoreo en GSC para confirmar que las correcciones funcionaron." },
      ],
      plans: [
        {
          name: "Auditoría Técnica",
          price: "Desde $1,200 (pago único)",
          note: "Entregable: lista de problemas priorizados + especificaciones",
          features: ["Análisis de crawl completo", "Auditoría CWV", "Revisión de arquitectura", "Plan de acción"],
        },
        {
          name: "Auditoría + Implementación",
          price: "Desde $2,500 (pago único)",
          note: "Nosotros lo arreglamos",
          features: ["Todo de la Auditoría", "Implementación directa", "Crawl de validación", "Seguimiento 30 días"],
        },
      ],
      faq: [
        { q: "¿El SEO técnico es un servicio único o continuo?", a: "La auditoría es única, pero la salud técnica requiere atención continua. Ofrecemos monitoreo técnico como parte de retainers mensuales." },
        { q: "¿Qué plataformas/CMS soportan?", a: "WordPress, Webflow, Next.js, Shopify y stacks personalizados. Proveemos especificaciones para cualquier plataforma." },
      ],
    },
  },
  {
    slug: "ecommerce-seo",
    category: "seo",
    accent: "mint",
    icon: "🛒",
    en: {
      name: "Ecommerce SEO",
      tagline: "More product visibility. More sales.",
      description:
        "SEO strategies built for online stores — from category architecture to product page optimization and faceted navigation.",
      targetAudience: "Online stores on Shopify, WooCommerce, or custom platforms.",
      included: [
        "Product & category page optimization",
        "Faceted navigation and crawl budget management",
        "Product schema markup",
        "Competitor keyword gap analysis",
        "Collection page content strategy",
        "Google Shopping feed optimization support",
      ],
      notIncluded: ["Paid shopping campaigns", "Marketplace listings (Amazon, eBay)"],
      process: [
        { step: "01", title: "Store audit", description: "Crawl and revenue analysis to find the highest-impact opportunities." },
        { step: "02", title: "Architecture", description: "Category structure and internal linking optimized for search." },
        { step: "03", title: "Optimization", description: "Product and category pages optimized for buyer-intent queries." },
        { step: "04", title: "Scale", description: "Content clusters and authority building to compound organic traffic." },
      ],
      plans: [
        {
          name: "Growth Store",
          price: "From $1,500/mo",
          note: "Up to 500 products",
          features: ["Category optimization", "Monthly content", "Technical maintenance", "Traffic report"],
        },
        {
          name: "Enterprise Store",
          price: "Custom",
          note: "Large catalogs",
          features: ["Full catalog coverage", "Dedicated content team", "Custom reporting", "CRO included"],
        },
      ],
      faq: [
        { q: "Do you work with Shopify?", a: "Yes. Also WooCommerce, Magento, and custom platforms. We understand the technical nuances of each." },
        { q: "How do you handle thin product descriptions?", a: "We develop a content strategy for product and category pages that differentiates you from competitors and provides search value." },
      ],
    },
    es: {
      name: "SEO Ecommerce",
      tagline: "Más visibilidad de productos. Más ventas.",
      description:
        "Estrategias SEO diseñadas para tiendas online — desde la arquitectura de categorías hasta la optimización de páginas de producto.",
      targetAudience: "Tiendas online en Shopify, WooCommerce o plataformas personalizadas.",
      included: [
        "Optimización de páginas de producto y categoría",
        "Navegación facetada y gestión del crawl budget",
        "Schema markup de producto",
        "Análisis de gap de keywords vs. competidores",
        "Estrategia de contenido para colecciones",
        "Soporte para optimización de feed de Google Shopping",
      ],
      notIncluded: ["Campañas de Shopping pagado", "Listados en marketplaces (Amazon, eBay)"],
      process: [
        { step: "01", title: "Auditoría de tienda", description: "Crawl y análisis de ingresos para encontrar las oportunidades de mayor impacto." },
        { step: "02", title: "Arquitectura", description: "Estructura de categorías y enlazado interno optimizados para búsqueda." },
        { step: "03", title: "Optimización", description: "Páginas de producto y categoría optimizadas para queries de intención de compra." },
        { step: "04", title: "Escala", description: "Clusters de contenido y construcción de autoridad para multiplicar el tráfico orgánico." },
      ],
      plans: [
        {
          name: "Tienda Growth",
          price: "Desde $1,500/mes",
          note: "Hasta 500 productos",
          features: ["Optimización de categorías", "Contenido mensual", "Mantenimiento técnico", "Reporte de tráfico"],
        },
        {
          name: "Tienda Enterprise",
          price: "Personalizado",
          note: "Catálogos grandes",
          features: ["Cobertura de catálogo completo", "Equipo de contenido dedicado", "Reportes personalizados", "CRO incluido"],
        },
      ],
      faq: [
        { q: "¿Trabajan con Shopify?", a: "Sí. También WooCommerce, Magento y plataformas personalizadas. Entendemos los matices técnicos de cada una." },
        { q: "¿Cómo manejan descripciones de producto delgadas?", a: "Desarrollamos una estrategia de contenido para páginas de producto y categoría que te diferencia de competidores y aporta valor a la búsqueda." },
      ],
    },
  },
  {
    slug: "ai-seo",
    category: "seo",
    accent: "mint",
    icon: "🤖",
    en: {
      name: "AI SEO / GEO / AEO",
      tagline: "Get found in AI search results too",
      description:
        "Optimize your brand to appear in AI-powered answers (ChatGPT, Perplexity, Google AI Overviews) and voice search — the next frontier of organic visibility.",
      targetAudience: "Brands that want visibility beyond traditional search rankings.",
      included: [
        "AI Overviews optimization strategy",
        "Generative Engine Optimization (GEO) implementation",
        "Answer Engine Optimization (AEO) for voice/AI",
        "E-E-A-T signal strengthening",
        "Structured Q&A content creation",
        "Brand mentions and entity building",
      ],
      notIncluded: ["Traditional monthly SEO (separate scope)", "PPC campaigns"],
      process: [
        { step: "01", title: "AI audit", description: "Test current brand visibility in ChatGPT, Perplexity, and Google AI." },
        { step: "02", title: "Content strategy", description: "Create authoritative Q&A and expert content that AI systems cite." },
        { step: "03", title: "Entity building", description: "Strengthen brand entity signals across the web." },
        { step: "04", title: "Monitoring", description: "Track brand mentions in AI answers and adjust strategy." },
      ],
      plans: [
        {
          name: "AI Visibility Starter",
          price: "From $900/mo",
          note: "Combined with traditional SEO retainer",
          features: ["AI audit", "GEO content strategy", "E-E-A-T optimization", "Monthly monitoring"],
        },
      ],
      faq: [
        { q: "Is AI SEO different from traditional SEO?", a: "They complement each other. Traditional SEO drives rankings; AI SEO ensures your brand appears in AI-generated answers. Both feed from quality content and authority." },
        { q: "Can I measure AI search visibility?", a: "Yes — through brand mention tracking, AI answer monitoring tools, and Search Console data for AI Overviews." },
      ],
    },
    es: {
      name: "SEO con IA / GEO / AEO",
      tagline: "Aparece también en los resultados de IA",
      description:
        "Optimiza tu marca para aparecer en respuestas de IA (ChatGPT, Perplexity, Google AI Overviews) y búsqueda por voz — la nueva frontera de la visibilidad orgánica.",
      targetAudience: "Marcas que quieren visibilidad más allá de los rankings tradicionales.",
      included: [
        "Estrategia de optimización para AI Overviews",
        "Implementación de Generative Engine Optimization (GEO)",
        "Answer Engine Optimization (AEO) para voz/IA",
        "Fortalecimiento de señales E-E-A-T",
        "Creación de contenido Q&A estructurado",
        "Construcción de menciones y entidad de marca",
      ],
      notIncluded: ["SEO mensual tradicional (scope separado)", "Campañas PPC"],
      process: [
        { step: "01", title: "Auditoría IA", description: "Testea la visibilidad actual de tu marca en ChatGPT, Perplexity y Google AI." },
        { step: "02", title: "Estrategia de contenido", description: "Crea contenido Q&A autoritario que los sistemas de IA citen." },
        { step: "03", title: "Construcción de entidad", description: "Fortalece las señales de entidad de marca en toda la web." },
        { step: "04", title: "Monitoreo", description: "Rastrea menciones de marca en respuestas de IA y ajusta la estrategia." },
      ],
      plans: [
        {
          name: "Visibilidad IA Starter",
          price: "Desde $900/mes",
          note: "Combinado con retainer de SEO tradicional",
          features: ["Auditoría IA", "Estrategia de contenido GEO", "Optimización E-E-A-T", "Monitoreo mensual"],
        },
      ],
      faq: [
        { q: "¿El SEO con IA es diferente al SEO tradicional?", a: "Se complementan. El SEO tradicional impulsa rankings; el SEO con IA asegura que tu marca aparezca en respuestas generadas por IA. Ambos se nutren de contenido de calidad y autoridad." },
        { q: "¿Se puede medir la visibilidad en búsqueda de IA?", a: "Sí — mediante seguimiento de menciones de marca, herramientas de monitoreo de respuestas de IA y datos de Search Console para AI Overviews." },
      ],
    },
  },
  /* ────────────────────────────── PAID MEDIA ──────────────────────── */
  {
    slug: "google-ads",
    category: "paid-media",
    accent: "warm",
    icon: "🎯",
    en: {
      name: "Google Ads",
      tagline: "Ads that generate leads, not just clicks",
      description:
        "Search, Display, and Performance Max campaigns built for conversion — not vanity metrics. Every dollar tracked to actual business outcomes.",
      targetAudience: "Businesses ready to invest in paid traffic with a clear offer.",
      included: [
        "Campaign strategy and structure",
        "Keyword research and negative keyword management",
        "Ad copy creation and A/B testing",
        "Landing page recommendations",
        "Bid strategy and budget optimization",
        "Monthly performance reporting",
        "Conversion tracking setup (GA4 + Google Ads)",
      ],
      notIncluded: ["Landing page development (quoted separately)", "Organic SEO"],
      process: [
        { step: "01", title: "Audit / Setup", description: "Review existing campaigns or build new structure from scratch." },
        { step: "02", title: "Launch", description: "Campaigns go live with proper tracking confirmed." },
        { step: "03", title: "Optimize", description: "Weekly bid adjustments, A/B tests, negative keyword updates." },
        { step: "04", title: "Scale", description: "Increase budgets on winning campaigns, cut losers fast." },
      ],
      plans: [
        {
          name: "Launch",
          price: "$600/mo management + ad spend",
          note: "Min. $1,500/mo ad budget recommended",
          features: ["Up to 2 campaigns", "Ad copy creation", "Monthly report", "Conversion tracking"],
        },
        {
          name: "Growth",
          price: "$1,200/mo management + ad spend",
          note: "Min. $3,000/mo ad budget",
          features: ["Unlimited campaigns", "Weekly optimization", "Landing page CRO", "Bi-weekly calls"],
        },
      ],
      faq: [
        { q: "How much ad budget do I need?", a: "We recommend starting with at least $1,500/month in ad spend. Below that, the data is too thin to optimize effectively." },
        { q: "Do you charge a percentage of ad spend?", a: "No. We charge a flat monthly management fee so our incentives are aligned with your results, not your spend." },
      ],
    },
    es: {
      name: "Google Ads",
      tagline: "Anuncios que generan leads, no solo clics",
      description:
        "Campañas de Search, Display y Performance Max construidas para la conversión, no para métricas de vanidad. Cada dólar rastreado a resultados de negocio reales.",
      targetAudience: "Negocios listos para invertir en tráfico pagado con una oferta clara.",
      included: [
        "Estrategia y estructura de campañas",
        "Investigación de keywords y gestión de negativas",
        "Creación de anuncios y A/B testing",
        "Recomendaciones de landing page",
        "Estrategia de pujas y optimización de presupuesto",
        "Reportes mensuales de rendimiento",
        "Configuración de seguimiento de conversiones (GA4 + Google Ads)",
      ],
      notIncluded: ["Desarrollo de landing pages (cotizado por separado)", "SEO orgánico"],
      process: [
        { step: "01", title: "Auditoría / Configuración", description: "Revisión de campañas existentes o construcción de nueva estructura desde cero." },
        { step: "02", title: "Lanzamiento", description: "Campañas activas con seguimiento de conversiones confirmado." },
        { step: "03", title: "Optimización", description: "Ajustes de puja semanales, A/B tests, actualización de keywords negativas." },
        { step: "04", title: "Escala", description: "Aumentar presupuesto en campañas ganadoras, eliminar rápido las perdedoras." },
      ],
      plans: [
        {
          name: "Lanzamiento",
          price: "$600/mes gestión + presupuesto en anuncios",
          note: "Mínimo $1,500/mes en presupuesto publicitario recomendado",
          features: ["Hasta 2 campañas", "Creación de anuncios", "Reporte mensual", "Seguimiento de conversiones"],
        },
        {
          name: "Crecimiento",
          price: "$1,200/mes gestión + presupuesto en anuncios",
          note: "Mínimo $3,000/mes en presupuesto",
          features: ["Campañas ilimitadas", "Optimización semanal", "CRO de landing page", "Llamadas quincenales"],
        },
      ],
      faq: [
        { q: "¿Cuánto presupuesto necesito para anuncios?", a: "Recomendamos empezar con al menos $1,500/mes en inversión publicitaria. Por debajo de eso, los datos son insuficientes para optimizar efectivamente." },
        { q: "¿Cobran un porcentaje del gasto en anuncios?", a: "No. Cobramos una tarifa mensual fija de gestión para que nuestros incentivos estén alineados con tus resultados, no con tu gasto." },
      ],
    },
  },
  {
    slug: "meta-ads",
    category: "paid-media",
    accent: "warm",
    icon: "📱",
    en: {
      name: "Meta Ads",
      tagline: "Find your customers on Facebook & Instagram",
      description:
        "Targeted campaigns on Meta's platforms that build brand awareness, drive website traffic, and generate quality leads at scale.",
      targetAudience: "Businesses selling to consumers or professionals aged 25–55.",
      included: [
        "Campaign architecture (awareness, consideration, conversion)",
        "Audience research and Custom Audience setup",
        "Creative strategy and ad copy",
        "Pixel and Conversions API setup",
        "Retargeting campaigns",
        "A/B testing framework",
        "Monthly performance reporting",
      ],
      notIncluded: ["Creative production (video, photography)", "Organic social media management"],
      process: [
        { step: "01", title: "Audience research", description: "Define ideal customer profiles and build targeting strategy." },
        { step: "02", title: "Campaign setup", description: "Full-funnel campaigns configured with proper tracking." },
        { step: "03", title: "Creative testing", description: "Multiple ad variations tested to find winning creatives." },
        { step: "04", title: "Scale", description: "Winning audiences and creatives scaled efficiently." },
      ],
      plans: [
        {
          name: "Launch",
          price: "$600/mo management + ad spend",
          note: "Min. $1,500/mo ad budget",
          features: ["Full-funnel setup", "Audience research", "A/B testing", "Monthly report"],
        },
        {
          name: "Growth",
          price: "$1,200/mo management + ad spend",
          note: "Min. $3,000/mo ad budget",
          features: ["Advanced retargeting", "Creative testing system", "CBO campaigns", "Bi-weekly calls"],
        },
      ],
      faq: [
        { q: "Do I need a Facebook Business Manager?", a: "Yes. We'll help you set it up correctly if you don't have one, including pixel and Conversions API configuration." },
        { q: "How do you handle iOS tracking changes?", a: "We implement Conversions API (server-side tracking) as the primary signal, complementing pixel tracking for more accurate attribution." },
      ],
    },
    es: {
      name: "Meta Ads",
      tagline: "Encuentra a tus clientes en Facebook e Instagram",
      description:
        "Campañas segmentadas en las plataformas de Meta que construyen reconocimiento de marca, impulsan tráfico web y generan leads de calidad a escala.",
      targetAudience: "Negocios que venden a consumidores o profesionales de 25–55 años.",
      included: [
        "Arquitectura de campañas (awareness, consideración, conversión)",
        "Investigación de audiencias y configuración de Custom Audiences",
        "Estrategia creativa y copy de anuncios",
        "Configuración de Pixel y Conversions API",
        "Campañas de retargeting",
        "Framework de A/B testing",
        "Reportes mensuales de rendimiento",
      ],
      notIncluded: ["Producción creativa (video, fotografía)", "Gestión de redes sociales orgánicas"],
      process: [
        { step: "01", title: "Investigación de audiencias", description: "Define perfiles de cliente ideal y construye la estrategia de segmentación." },
        { step: "02", title: "Configuración de campañas", description: "Campañas de embudo completo configuradas con seguimiento correcto." },
        { step: "03", title: "Testing de creativos", description: "Múltiples variaciones de anuncio probadas para encontrar los ganadores." },
        { step: "04", title: "Escala", description: "Audiencias y creativos ganadores escalados eficientemente." },
      ],
      plans: [
        {
          name: "Lanzamiento",
          price: "$600/mes gestión + presupuesto",
          note: "Mínimo $1,500/mes en anuncios",
          features: ["Configuración de embudo completo", "Investigación de audiencias", "A/B testing", "Reporte mensual"],
        },
        {
          name: "Crecimiento",
          price: "$1,200/mes gestión + presupuesto",
          note: "Mínimo $3,000/mes en anuncios",
          features: ["Retargeting avanzado", "Sistema de testing creativo", "Campañas CBO", "Llamadas quincenales"],
        },
      ],
      faq: [
        { q: "¿Necesito un Facebook Business Manager?", a: "Sí. Te ayudamos a configurarlo correctamente si no lo tienes, incluyendo la configuración del pixel y la Conversions API." },
        { q: "¿Cómo manejan los cambios de seguimiento de iOS?", a: "Implementamos la Conversions API (seguimiento server-side) como señal principal, complementando el pixel para una atribución más precisa." },
      ],
    },
  },
  {
    slug: "tiktok-ads",
    category: "paid-media",
    accent: "warm",
    icon: "🎵",
    en: {
      name: "TikTok Ads",
      tagline: "Reach the next generation of buyers",
      description:
        "Performance advertising on TikTok's rapidly growing platform — reach younger, high-intent audiences before your competitors do.",
      targetAudience: "Brands targeting 18–34 demographics or testing new acquisition channels.",
      included: [
        "TikTok Business account setup",
        "Audience targeting and interest mapping",
        "Ad creative strategy (UGC-style formats)",
        "Spark Ads setup (boosting organic content)",
        "TikTok Pixel implementation",
        "Monthly performance reporting",
      ],
      notIncluded: ["Video production (quoted separately)", "Organic TikTok content"],
      process: [
        { step: "01", title: "Account setup", description: "TikTok Ads Manager, pixel, and tracking configured." },
        { step: "02", title: "Creative strategy", description: "Define native, UGC-style ad formats that perform on TikTok." },
        { step: "03", title: "Launch & test", description: "Multiple ad angles tested across target audiences." },
        { step: "04", title: "Optimize", description: "Scale winning creatives and audiences based on real data." },
      ],
      plans: [
        {
          name: "TikTok Launch",
          price: "$700/mo management + ad spend",
          note: "Min. $1,500/mo ad budget",
          features: ["Account setup", "Creative strategy", "Audience targeting", "Monthly report"],
        },
      ],
      faq: [
        { q: "Do I need to have TikTok followers?", a: "No. TikTok Ads reach users regardless of your follower count. However, having some organic presence helps with Spark Ads." },
        { q: "What industries work best on TikTok?", a: "Consumer products, beauty, fitness, food, education, entertainment, and increasingly B2B. We'll tell you honestly if TikTok isn't the right channel for your business." },
      ],
    },
    es: {
      name: "TikTok Ads",
      tagline: "Llega a la próxima generación de compradores",
      description:
        "Publicidad de rendimiento en la plataforma de rápido crecimiento de TikTok — alcanza audiencias jóvenes y de alta intención antes que tu competencia.",
      targetAudience: "Marcas que apuntan a demografías de 18–34 años o prueban nuevos canales de adquisición.",
      included: [
        "Configuración de cuenta TikTok Business",
        "Segmentación de audiencias y mapeo de intereses",
        "Estrategia creativa de anuncios (formatos estilo UGC)",
        "Configuración de Spark Ads (impulso de contenido orgánico)",
        "Implementación de TikTok Pixel",
        "Reportes mensuales de rendimiento",
      ],
      notIncluded: ["Producción de video (cotizado por separado)", "Contenido orgánico de TikTok"],
      process: [
        { step: "01", title: "Configuración de cuenta", description: "TikTok Ads Manager, pixel y seguimiento configurados." },
        { step: "02", title: "Estrategia creativa", description: "Define formatos de anuncio nativos, estilo UGC, que funcionan en TikTok." },
        { step: "03", title: "Lanzamiento y testing", description: "Múltiples ángulos de anuncio probados entre audiencias objetivo." },
        { step: "04", title: "Optimización", description: "Escala creativos y audiencias ganadoras basado en datos reales." },
      ],
      plans: [
        {
          name: "TikTok Launch",
          price: "$700/mes gestión + presupuesto",
          note: "Mínimo $1,500/mes en anuncios",
          features: ["Configuración de cuenta", "Estrategia creativa", "Segmentación de audiencias", "Reporte mensual"],
        },
      ],
      faq: [
        { q: "¿Necesito tener seguidores en TikTok?", a: "No. Los TikTok Ads llegan a usuarios independientemente de tu cantidad de seguidores. Sin embargo, tener presencia orgánica ayuda con los Spark Ads." },
        { q: "¿Qué industrias funcionan mejor en TikTok?", a: "Productos de consumo, belleza, fitness, alimentos, educación, entretenimiento y cada vez más B2B. Te diremos honestamente si TikTok no es el canal correcto para tu negocio." },
      ],
    },
  },
  /* ─────────────────────────── AUTOMATION ────────────────────────── */
  {
    slug: "ai-agents",
    category: "automation",
    accent: "violet",
    icon: "🧠",
    en: {
      name: "AI Agents",
      tagline: "Automate complex tasks with intelligent agents",
      description:
        "Custom AI agents that handle repetitive workflows, qualify leads, answer customer inquiries, and integrate with your existing tools — running 24/7 without extra headcount.",
      targetAudience: "Businesses with repetitive customer-facing or internal workflows.",
      included: [
        "Workflow discovery and mapping",
        "Custom AI agent design and development",
        "Integration with CRM, WhatsApp, email, and APIs",
        "Testing and quality assurance",
        "Deployment and monitoring",
        "30-day post-launch support",
      ],
      notIncluded: ["Ongoing maintenance beyond 30 days (quoted separately)"],
      process: [
        { step: "01", title: "Discovery", description: "Map the workflows that waste the most time and money." },
        { step: "02", title: "Design", description: "Design the agent logic, decision trees, and integrations." },
        { step: "03", title: "Build", description: "Develop and test the agent in a staging environment." },
        { step: "04", title: "Deploy", description: "Launch and monitor. Train your team to manage it." },
      ],
      plans: [
        {
          name: "Simple Agent",
          price: "From $1,500 (one-time)",
          note: "1 workflow, 1 integration",
          features: ["Workflow mapping", "Agent development", "1 integration", "30-day support"],
        },
        {
          name: "Custom Agent",
          price: "From $3,000 (one-time)",
          note: "Complex workflows, multiple integrations",
          features: ["Multi-step workflows", "Multiple integrations", "Custom UI", "Extended support"],
        },
      ],
      faq: [
        { q: "Which AI models do you use?", a: "Primarily Claude (Anthropic) and GPT-4. We choose the model that best fits the task — accuracy, cost, and latency matter differently depending on the use case." },
        { q: "Can agents connect to my CRM?", a: "Yes. We integrate with HubSpot, Salesforce, Kommo, Callbell, and most platforms with an API." },
      ],
    },
    es: {
      name: "Agentes IA",
      tagline: "Automatiza tareas complejas con agentes inteligentes",
      description:
        "Agentes IA personalizados que manejan flujos de trabajo repetitivos, califican leads, responden consultas de clientes y se integran con tus herramientas existentes — funcionando 24/7 sin contratar más personal.",
      targetAudience: "Negocios con flujos de trabajo repetitivos de cara al cliente o internos.",
      included: [
        "Descubrimiento y mapeo de flujos de trabajo",
        "Diseño y desarrollo de agente IA personalizado",
        "Integración con CRM, WhatsApp, email y APIs",
        "Testing y control de calidad",
        "Despliegue y monitoreo",
        "Soporte post-lanzamiento de 30 días",
      ],
      notIncluded: ["Mantenimiento continuo más allá de 30 días (cotizado por separado)"],
      process: [
        { step: "01", title: "Descubrimiento", description: "Mapea los flujos de trabajo que más tiempo y dinero te cuestan." },
        { step: "02", title: "Diseño", description: "Diseña la lógica del agente, árboles de decisión e integraciones." },
        { step: "03", title: "Construcción", description: "Desarrolla y prueba el agente en un entorno de staging." },
        { step: "04", title: "Despliegue", description: "Lanza y monitorea. Capacita a tu equipo para gestionarlo." },
      ],
      plans: [
        {
          name: "Agente Simple",
          price: "Desde $1,500 (pago único)",
          note: "1 flujo de trabajo, 1 integración",
          features: ["Mapeo de flujo", "Desarrollo del agente", "1 integración", "Soporte 30 días"],
        },
        {
          name: "Agente Personalizado",
          price: "Desde $3,000 (pago único)",
          note: "Flujos complejos, múltiples integraciones",
          features: ["Flujos de trabajo multi-paso", "Múltiples integraciones", "UI personalizada", "Soporte extendido"],
        },
      ],
      faq: [
        { q: "¿Qué modelos de IA utilizan?", a: "Principalmente Claude (Anthropic) y GPT-4. Elegimos el modelo que mejor se adapta a la tarea — la precisión, el costo y la latencia importan diferente según el caso de uso." },
        { q: "¿Los agentes pueden conectarse a mi CRM?", a: "Sí. Nos integramos con HubSpot, Salesforce, Kommo, Callbell y la mayoría de plataformas con API." },
      ],
    },
  },
  {
    slug: "chatbots",
    category: "automation",
    accent: "violet",
    icon: "💬",
    en: {
      name: "Chatbots",
      tagline: "Conversations that convert around the clock",
      description:
        "Intelligent chatbots for your website, WhatsApp, or Facebook Messenger that qualify leads, answer FAQs, and book appointments — without human intervention.",
      targetAudience: "Businesses that receive repetitive customer inquiries or want to qualify leads automatically.",
      included: [
        "Conversation flow design",
        "Lead qualification logic",
        "FAQ training",
        "CRM integration",
        "Channel setup (web, WhatsApp, Messenger)",
        "Testing and launch",
      ],
      notIncluded: ["Ongoing content updates beyond first 30 days"],
      process: [
        { step: "01", title: "Script design", description: "Map conversation flows based on your most common inquiries." },
        { step: "02", title: "Build", description: "Configure the chatbot on your chosen platform." },
        { step: "03", title: "Train", description: "Train with your FAQs, products, and objection handlers." },
        { step: "04", title: "Launch", description: "Deploy and monitor conversation metrics." },
      ],
      plans: [
        {
          name: "Starter Bot",
          price: "From $800 (one-time)",
          note: "FAQ + lead capture",
          features: ["FAQ automation", "Lead capture form", "1 channel", "Dashboard access"],
        },
        {
          name: "Intelligent Bot",
          price: "From $2,000 (one-time)",
          note: "Multi-step qualification",
          features: ["Lead scoring", "CRM integration", "Multi-channel", "Handoff to human"],
        },
      ],
      faq: [
        { q: "Which platforms do you build chatbots on?", a: "Callbell, Kommo, WATI, B2Chat, Manychat, and custom builds via API depending on your needs." },
        { q: "Can the chatbot hand off to a human?", a: "Yes. We configure handoff triggers so your team takes over when the bot reaches its limits." },
      ],
    },
    es: {
      name: "Chatbots",
      tagline: "Conversaciones que convierten a toda hora",
      description:
        "Chatbots inteligentes para tu web, WhatsApp o Facebook Messenger que califican leads, responden FAQs y agendan citas — sin intervención humana.",
      targetAudience: "Negocios que reciben consultas repetitivas de clientes o quieren calificar leads automáticamente.",
      included: [
        "Diseño de flujos de conversación",
        "Lógica de calificación de leads",
        "Entrenamiento con FAQs",
        "Integración con CRM",
        "Configuración del canal (web, WhatsApp, Messenger)",
        "Testing y lanzamiento",
      ],
      notIncluded: ["Actualizaciones de contenido continuas más allá de los primeros 30 días"],
      process: [
        { step: "01", title: "Diseño de guión", description: "Mapea flujos de conversación basados en tus consultas más frecuentes." },
        { step: "02", title: "Construcción", description: "Configura el chatbot en tu plataforma elegida." },
        { step: "03", title: "Entrenamiento", description: "Entrena con tus FAQs, productos y gestores de objeciones." },
        { step: "04", title: "Lanzamiento", description: "Despliega y monitorea las métricas de conversación." },
      ],
      plans: [
        {
          name: "Bot Starter",
          price: "Desde $800 (pago único)",
          note: "FAQ + captura de leads",
          features: ["Automatización de FAQ", "Formulario de captura", "1 canal", "Acceso a dashboard"],
        },
        {
          name: "Bot Inteligente",
          price: "Desde $2,000 (pago único)",
          note: "Calificación multi-paso",
          features: ["Scoring de leads", "Integración con CRM", "Multi-canal", "Transferencia a humano"],
        },
      ],
      faq: [
        { q: "¿En qué plataformas construyen chatbots?", a: "Callbell, Kommo, WATI, B2Chat, Manychat y builds personalizados vía API según tus necesidades." },
        { q: "¿El chatbot puede transferir a un humano?", a: "Sí. Configuramos triggers de transferencia para que tu equipo tome el control cuando el bot llega a sus límites." },
      ],
    },
  },
  {
    slug: "callbell",
    category: "automation",
    accent: "violet",
    icon: "🔔",
    en: {
      name: "Callbell Setup & Automation",
      tagline: "Organize your WhatsApp team with Callbell",
      description:
        "Professional Callbell implementation — team inbox setup, automation rules, chatbot integration, and CRM connection so your team never loses a conversation.",
      targetAudience: "Teams that manage customer conversations via WhatsApp, Instagram, or Messenger.",
      included: [
        "Callbell account setup and team configuration",
        "Channel connections (WhatsApp, Instagram, Messenger, Telegram)",
        "Automation rules and routing",
        "Chatbot integration",
        "CRM integration",
        "Team training session",
      ],
      notIncluded: ["Callbell subscription fees", "Ongoing management"],
      process: [
        { step: "01", title: "Setup", description: "Configure your Callbell workspace, channels, and team." },
        { step: "02", title: "Automate", description: "Build routing rules, auto-replies, and bot flows." },
        { step: "03", title: "Integrate", description: "Connect to your CRM and other tools." },
        { step: "04", title: "Train", description: "Train your team to use Callbell effectively." },
      ],
      plans: [
        {
          name: "Basic Setup",
          price: "From $600 (one-time)",
          note: "Up to 5 team members",
          features: ["Channel setup", "Basic automations", "Team training", "Documentation"],
        },
        {
          name: "Full Implementation",
          price: "From $1,200 (one-time)",
          note: "Full automation + CRM",
          features: ["Advanced automations", "Chatbot integration", "CRM connection", "Extended training"],
        },
      ],
      faq: [
        { q: "Do I need an existing Callbell subscription?", a: "You'll need to subscribe to Callbell directly. We handle the technical setup and automation as a service." },
        { q: "Can you build chatbots inside Callbell?", a: "Yes. We build conversation flows and automation rules natively in Callbell's platform." },
      ],
    },
    es: {
      name: "Callbell Setup y Automatización",
      tagline: "Organiza tu equipo de WhatsApp con Callbell",
      description:
        "Implementación profesional de Callbell — configuración de bandeja de equipo, reglas de automatización, integración de chatbot y conexión de CRM para que tu equipo nunca pierda una conversación.",
      targetAudience: "Equipos que gestionan conversaciones con clientes vía WhatsApp, Instagram o Messenger.",
      included: [
        "Configuración de cuenta Callbell y equipo",
        "Conexión de canales (WhatsApp, Instagram, Messenger, Telegram)",
        "Reglas de automatización y enrutamiento",
        "Integración de chatbot",
        "Integración de CRM",
        "Sesión de capacitación del equipo",
      ],
      notIncluded: ["Tarifas de suscripción de Callbell", "Gestión continua"],
      process: [
        { step: "01", title: "Configuración", description: "Configura tu workspace de Callbell, canales y equipo." },
        { step: "02", title: "Automatización", description: "Construye reglas de enrutamiento, respuestas automáticas y flujos de bot." },
        { step: "03", title: "Integración", description: "Conecta con tu CRM y otras herramientas." },
        { step: "04", title: "Capacitación", description: "Capacita a tu equipo para usar Callbell eficientemente." },
      ],
      plans: [
        {
          name: "Setup Básico",
          price: "Desde $600 (pago único)",
          note: "Hasta 5 miembros del equipo",
          features: ["Configuración de canales", "Automatizaciones básicas", "Capacitación del equipo", "Documentación"],
        },
        {
          name: "Implementación Completa",
          price: "Desde $1,200 (pago único)",
          note: "Automatización completa + CRM",
          features: ["Automatizaciones avanzadas", "Integración de chatbot", "Conexión de CRM", "Capacitación extendida"],
        },
      ],
      faq: [
        { q: "¿Necesito tener una suscripción de Callbell?", a: "Necesitarás suscribirte a Callbell directamente. Nosotros manejamos la configuración técnica y automatización como servicio." },
        { q: "¿Pueden construir chatbots dentro de Callbell?", a: "Sí. Construimos flujos de conversación y reglas de automatización de forma nativa en la plataforma de Callbell." },
      ],
    },
  },
  {
    slug: "kommo",
    category: "automation",
    accent: "violet",
    icon: "💼",
    en: {
      name: "Kommo CRM Setup",
      tagline: "Sell smarter with Kommo",
      description:
        "Expert Kommo implementation — pipeline configuration, automation rules, WhatsApp integration, and team training so your sales team closes more deals.",
      targetAudience: "Sales teams that need a conversational CRM connected to WhatsApp.",
      included: [
        "Kommo account and pipeline configuration",
        "WhatsApp Business integration",
        "Lead source tracking",
        "Automation rules and triggers",
        "Custom fields and stages",
        "Team training",
      ],
      notIncluded: ["Kommo subscription fees"],
      process: [
        { step: "01", title: "Mapping", description: "Map your sales process to Kommo's pipeline structure." },
        { step: "02", title: "Setup", description: "Configure pipelines, stages, fields, and users." },
        { step: "03", title: "Automate", description: "Build automation rules for follow-ups and notifications." },
        { step: "04", title: "Train", description: "Train your team on daily Kommo workflows." },
      ],
      plans: [
        {
          name: "Basic Setup",
          price: "From $700 (one-time)",
          note: "Up to 3 pipelines",
          features: ["Pipeline setup", "WhatsApp connection", "Basic automations", "Team training"],
        },
        {
          name: "Advanced Setup",
          price: "From $1,500 (one-time)",
          note: "Full automation + integrations",
          features: ["Multi-pipeline", "Advanced automations", "API integrations", "Extended training"],
        },
      ],
      faq: [
        { q: "What makes Kommo different from other CRMs?", a: "Kommo (formerly amoCRM) is built around messaging — WhatsApp, Instagram, and email conversations live inside the CRM, making it ideal for teams that sell via chat." },
        { q: "Can you migrate data from another CRM?", a: "Yes, we handle data migration from most platforms as part of the setup." },
      ],
    },
    es: {
      name: "Kommo CRM Setup",
      tagline: "Vende más inteligente con Kommo",
      description:
        "Implementación experta de Kommo — configuración de pipeline, reglas de automatización, integración de WhatsApp y capacitación del equipo para que tu equipo de ventas cierre más negocios.",
      targetAudience: "Equipos de ventas que necesitan un CRM conversacional conectado a WhatsApp.",
      included: [
        "Configuración de cuenta y pipeline en Kommo",
        "Integración de WhatsApp Business",
        "Seguimiento de fuente de leads",
        "Reglas de automatización y triggers",
        "Campos personalizados y etapas",
        "Capacitación del equipo",
      ],
      notIncluded: ["Tarifas de suscripción de Kommo"],
      process: [
        { step: "01", title: "Mapeo", description: "Mapea tu proceso de ventas a la estructura de pipeline de Kommo." },
        { step: "02", title: "Configuración", description: "Configura pipelines, etapas, campos y usuarios." },
        { step: "03", title: "Automatización", description: "Construye reglas de automatización para seguimientos y notificaciones." },
        { step: "04", title: "Capacitación", description: "Capacita a tu equipo en los flujos de trabajo diarios de Kommo." },
      ],
      plans: [
        {
          name: "Setup Básico",
          price: "Desde $700 (pago único)",
          note: "Hasta 3 pipelines",
          features: ["Configuración de pipeline", "Conexión de WhatsApp", "Automatizaciones básicas", "Capacitación"],
        },
        {
          name: "Setup Avanzado",
          price: "Desde $1,500 (pago único)",
          note: "Automatización completa + integraciones",
          features: ["Multi-pipeline", "Automatizaciones avanzadas", "Integraciones API", "Capacitación extendida"],
        },
      ],
      faq: [
        { q: "¿Qué hace a Kommo diferente de otros CRMs?", a: "Kommo (antes amoCRM) está construido alrededor de la mensajería — conversaciones de WhatsApp, Instagram y email viven dentro del CRM, ideal para equipos que venden por chat." },
        { q: "¿Pueden migrar datos desde otro CRM?", a: "Sí, manejamos la migración de datos desde la mayoría de plataformas como parte del setup." },
      ],
    },
  },
  {
    slug: "wati",
    category: "automation",
    accent: "violet",
    icon: "🟢",
    en: {
      name: "WATI Setup & Automation",
      tagline: "WhatsApp Business API at scale",
      description:
        "Professional WATI implementation for teams that need the official WhatsApp Business API — bulk messaging, chatbots, team inbox, and automation.",
      targetAudience: "Businesses that need to send notifications, campaigns, or manage high-volume WhatsApp conversations.",
      included: [
        "WATI account setup and WABA connection",
        "Message template creation and approval",
        "Chatbot flow setup",
        "Team inbox configuration",
        "Broadcast and campaign setup",
        "API integration with your systems",
      ],
      notIncluded: ["WATI subscription fees", "WhatsApp conversation fees"],
      process: [
        { step: "01", title: "WABA setup", description: "Connect your WhatsApp Business Account to WATI." },
        { step: "02", title: "Templates", description: "Create and submit message templates for WhatsApp approval." },
        { step: "03", title: "Automation", description: "Build chatbot flows and automation for incoming messages." },
        { step: "04", title: "Launch", description: "Train your team and launch your first campaigns." },
      ],
      plans: [
        {
          name: "Basic WATI",
          price: "From $700 (one-time)",
          note: "Inbox + basic automations",
          features: ["WABA connection", "Template setup", "Team inbox", "Basic chatbot"],
        },
        {
          name: "Full WATI",
          price: "From $1,500 (one-time)",
          note: "Full automation + campaigns",
          features: ["Advanced chatbot", "Broadcast setup", "API integration", "Full training"],
        },
      ],
      faq: [
        { q: "What's the difference between WATI and Callbell?", a: "WATI uses the official WhatsApp Business API, better for high-volume and broadcasts. Callbell is more team-inbox focused with broader multi-channel support." },
        { q: "Can WATI send bulk messages?", a: "Yes. WATI supports broadcast messaging to opted-in contacts via approved message templates." },
      ],
    },
    es: {
      name: "WATI Setup y Automatización",
      tagline: "WhatsApp Business API a escala",
      description:
        "Implementación profesional de WATI para equipos que necesitan la API oficial de WhatsApp Business — mensajería masiva, chatbots, bandeja de equipo y automatización.",
      targetAudience: "Negocios que necesitan enviar notificaciones, campañas o gestionar conversaciones de WhatsApp en alto volumen.",
      included: [
        "Configuración de cuenta WATI y conexión WABA",
        "Creación y aprobación de plantillas de mensajes",
        "Configuración de flujos de chatbot",
        "Configuración de bandeja de equipo",
        "Configuración de broadcasts y campañas",
        "Integración API con tus sistemas",
      ],
      notIncluded: ["Tarifas de suscripción de WATI", "Tarifas de conversación de WhatsApp"],
      process: [
        { step: "01", title: "Setup WABA", description: "Conecta tu WhatsApp Business Account a WATI." },
        { step: "02", title: "Plantillas", description: "Crea y envía plantillas de mensajes para aprobación de WhatsApp." },
        { step: "03", title: "Automatización", description: "Construye flujos de chatbot y automatización para mensajes entrantes." },
        { step: "04", title: "Lanzamiento", description: "Capacita a tu equipo y lanza tus primeras campañas." },
      ],
      plans: [
        {
          name: "WATI Básico",
          price: "Desde $700 (pago único)",
          note: "Bandeja + automatizaciones básicas",
          features: ["Conexión WABA", "Setup de plantillas", "Bandeja de equipo", "Chatbot básico"],
        },
        {
          name: "WATI Completo",
          price: "Desde $1,500 (pago único)",
          note: "Automatización completa + campañas",
          features: ["Chatbot avanzado", "Setup de broadcasts", "Integración API", "Capacitación completa"],
        },
      ],
      faq: [
        { q: "¿Cuál es la diferencia entre WATI y Callbell?", a: "WATI usa la API oficial de WhatsApp Business, mejor para alto volumen y broadcasts. Callbell está más enfocado en bandeja de equipo con soporte multi-canal más amplio." },
        { q: "¿WATI puede enviar mensajes masivos?", a: "Sí. WATI soporta mensajería broadcast a contactos que han optado en, vía plantillas de mensajes aprobadas." },
      ],
    },
  },
  {
    slug: "b2chat",
    category: "automation",
    accent: "violet",
    icon: "🔷",
    en: {
      name: "B2Chat Setup",
      tagline: "Multi-channel messaging made simple",
      description:
        "Expert B2Chat implementation connecting your WhatsApp, Instagram, Facebook, and Telegram channels into a single collaborative inbox.",
      targetAudience: "Teams in Latin America managing multi-channel customer conversations.",
      included: [
        "B2Chat account and channel setup",
        "WhatsApp Business API connection",
        "Multi-channel configuration (IG, FB, Telegram)",
        "Bot flows and automation",
        "Team routing and assignment rules",
        "Team training",
      ],
      notIncluded: ["B2Chat subscription fees"],
      process: [
        { step: "01", title: "Setup", description: "Connect all your messaging channels to B2Chat." },
        { step: "02", title: "Organize", description: "Configure teams, routing rules, and assignment logic." },
        { step: "03", title: "Automate", description: "Build bot flows for common inquiries." },
        { step: "04", title: "Train", description: "Train your team to manage conversations efficiently." },
      ],
      plans: [
        {
          name: "B2Chat Setup",
          price: "From $600 (one-time)",
          note: "Up to 3 channels",
          features: ["Multi-channel setup", "Basic automation", "Team training", "Documentation"],
        },
      ],
      faq: [
        { q: "Does B2Chat support the official WhatsApp Business API?", a: "Yes. B2Chat is an official Meta Business Partner and supports the WhatsApp Business API." },
        { q: "Is B2Chat good for Latin American businesses?", a: "Yes — B2Chat was built specifically for the LATAM market and has strong support and compliance for the region." },
      ],
    },
    es: {
      name: "B2Chat Setup",
      tagline: "Mensajería multicanal simplificada",
      description:
        "Implementación experta de B2Chat conectando tus canales de WhatsApp, Instagram, Facebook y Telegram en una sola bandeja colaborativa.",
      targetAudience: "Equipos en América Latina que gestionan conversaciones multicanal con clientes.",
      included: [
        "Configuración de cuenta y canales en B2Chat",
        "Conexión de API de WhatsApp Business",
        "Configuración multicanal (IG, FB, Telegram)",
        "Flujos de bot y automatización",
        "Reglas de enrutamiento y asignación de equipo",
        "Capacitación del equipo",
      ],
      notIncluded: ["Tarifas de suscripción de B2Chat"],
      process: [
        { step: "01", title: "Configuración", description: "Conecta todos tus canales de mensajería a B2Chat." },
        { step: "02", title: "Organizar", description: "Configura equipos, reglas de enrutamiento y lógica de asignación." },
        { step: "03", title: "Automatizar", description: "Construye flujos de bot para consultas frecuentes." },
        { step: "04", title: "Capacitar", description: "Capacita a tu equipo para gestionar conversaciones eficientemente." },
      ],
      plans: [
        {
          name: "B2Chat Setup",
          price: "Desde $600 (pago único)",
          note: "Hasta 3 canales",
          features: ["Configuración multicanal", "Automatización básica", "Capacitación del equipo", "Documentación"],
        },
      ],
      faq: [
        { q: "¿B2Chat soporta la API oficial de WhatsApp Business?", a: "Sí. B2Chat es un Meta Business Partner oficial y soporta la API de WhatsApp Business." },
        { q: "¿Es B2Chat bueno para negocios latinoamericanos?", a: "Sí — B2Chat fue construido específicamente para el mercado LATAM y tiene soporte y cumplimiento sólido para la región." },
      ],
    },
  },
  {
    slug: "automation-tools",
    category: "automation",
    accent: "violet",
    icon: "⚡",
    en: {
      name: "Make, n8n & Zapier",
      tagline: "Connect your tools. Eliminate repetitive work.",
      description:
        "Custom automation workflows using Make (Integromat), n8n, or Zapier to connect your apps, sync data, and eliminate manual repetitive tasks.",
      targetAudience: "Businesses with multiple tools that don't talk to each other.",
      included: [
        "Workflow discovery session",
        "Custom automation design",
        "Platform setup (Make, n8n, or Zapier)",
        "Workflow building and testing",
        "Error handling and monitoring",
        "Documentation and handoff",
      ],
      notIncluded: ["Platform subscription fees", "Ongoing maintenance (quoted separately)"],
      process: [
        { step: "01", title: "Discovery", description: "Map the workflows that cost you the most time." },
        { step: "02", title: "Design", description: "Design automation logic and choose the right platform." },
        { step: "03", title: "Build", description: "Build and test all automations with real data." },
        { step: "04", title: "Handoff", description: "Document everything so your team can manage it." },
      ],
      plans: [
        {
          name: "Simple Automation",
          price: "From $500 (one-time)",
          note: "1–3 workflow automations",
          features: ["3 workflows max", "Platform setup", "Testing", "Documentation"],
        },
        {
          name: "System Automation",
          price: "From $1,500 (one-time)",
          note: "Complex multi-step integrations",
          features: ["Unlimited workflows", "Complex logic", "Error handling", "Extended support"],
        },
      ],
      faq: [
        { q: "Make, n8n, or Zapier — which is better?", a: "It depends on your use case and budget. Zapier is easier to manage; Make is more powerful; n8n can be self-hosted for full control. We recommend the right tool for each client." },
        { q: "Can you automate data between my CRM and WhatsApp?", a: "Yes. This is one of our most common automations — syncing leads from WhatsApp conversations into CRM records automatically." },
      ],
    },
    es: {
      name: "Make, n8n y Zapier",
      tagline: "Conecta tus herramientas. Elimina el trabajo repetitivo.",
      description:
        "Flujos de trabajo de automatización personalizados usando Make (Integromat), n8n o Zapier para conectar tus aplicaciones, sincronizar datos y eliminar tareas manuales repetitivas.",
      targetAudience: "Negocios con múltiples herramientas que no se comunican entre sí.",
      included: [
        "Sesión de descubrimiento de flujos de trabajo",
        "Diseño de automatización personalizada",
        "Configuración de plataforma (Make, n8n o Zapier)",
        "Construcción y testing de flujos de trabajo",
        "Manejo de errores y monitoreo",
        "Documentación y entrega",
      ],
      notIncluded: ["Tarifas de suscripción de la plataforma", "Mantenimiento continuo (cotizado por separado)"],
      process: [
        { step: "01", title: "Descubrimiento", description: "Mapea los flujos de trabajo que más tiempo te cuestan." },
        { step: "02", title: "Diseño", description: "Diseña la lógica de automatización y elige la plataforma correcta." },
        { step: "03", title: "Construcción", description: "Construye y prueba todas las automatizaciones con datos reales." },
        { step: "04", title: "Entrega", description: "Documenta todo para que tu equipo pueda gestionarlo." },
      ],
      plans: [
        {
          name: "Automatización Simple",
          price: "Desde $500 (pago único)",
          note: "1–3 flujos de trabajo automatizados",
          features: ["Máximo 3 flujos", "Configuración de plataforma", "Testing", "Documentación"],
        },
        {
          name: "Automatización de Sistema",
          price: "Desde $1,500 (pago único)",
          note: "Integraciones complejas multi-paso",
          features: ["Flujos ilimitados", "Lógica compleja", "Manejo de errores", "Soporte extendido"],
        },
      ],
      faq: [
        { q: "Make, n8n o Zapier — ¿cuál es mejor?", a: "Depende de tu caso de uso y presupuesto. Zapier es más fácil de gestionar; Make es más potente; n8n puede ser autohospedado para control total. Recomendamos la herramienta correcta para cada cliente." },
        { q: "¿Pueden automatizar datos entre mi CRM y WhatsApp?", a: "Sí. Esta es una de nuestras automatizaciones más comunes — sincronizar leads de conversaciones de WhatsApp en registros del CRM automáticamente." },
      ],
    },
  },
  /* ─────────────────────────── SUPPORT ───────────────────────────── */
  {
    slug: "meta-business",
    category: "support",
    accent: "orange",
    icon: "🏢",
    en: {
      name: "Meta Business Support",
      tagline: "Fix your Meta Business Manager issues",
      description:
        "Expert help for Meta Business Manager problems — account restrictions, ad account suspensions, Business Verification, and BM setup.",
      targetAudience: "Businesses struggling with restricted or suspended Meta ad accounts.",
      included: [
        "Business Manager audit and diagnostics",
        "Account restriction appeal strategy",
        "Business Verification guidance",
        "Ad account recovery support",
        "BM structure optimization",
        "Policy compliance review",
      ],
      notIncluded: ["Meta's decisions on appeals (we can't guarantee outcomes)", "Ongoing ad management"],
      process: [
        { step: "01", title: "Audit", description: "Review your Business Manager setup and identify the root cause." },
        { step: "02", title: "Strategy", description: "Build a recovery and compliance plan." },
        { step: "03", title: "Execute", description: "Submit appeals and implement corrective measures." },
        { step: "04", title: "Stabilize", description: "Set up your BM to minimize future issues." },
      ],
      plans: [
        {
          name: "BM Consultation",
          price: "$200 (one session)",
          note: "90-minute session + recommendations",
          features: ["BM audit", "Issue diagnosis", "Recovery roadmap", "Written recommendations"],
        },
        {
          name: "Full Recovery",
          price: "From $500",
          note: "End-to-end support",
          features: ["Appeal management", "BM restructure", "Policy compliance", "Follow-up support"],
        },
      ],
      faq: [
        { q: "Can you guarantee my account will be recovered?", a: "No. Meta makes the final decision on appeals. We improve your chances significantly by building the correct case and documentation." },
        { q: "How long does recovery take?", a: "Appeals typically take 1–4 weeks. Some restrictions are resolved faster; others require multiple submissions." },
      ],
    },
    es: {
      name: "Soporte Meta Business",
      tagline: "Resuelve tus problemas de Meta Business Manager",
      description:
        "Ayuda experta para problemas de Meta Business Manager — restricciones de cuenta, suspensiones de cuentas publicitarias, Verificación de Negocio y configuración de BM.",
      targetAudience: "Negocios con cuentas publicitarias de Meta restringidas o suspendidas.",
      included: [
        "Auditoría y diagnóstico de Business Manager",
        "Estrategia de apelación de restricciones de cuenta",
        "Guía para Verificación de Negocio",
        "Soporte para recuperación de cuenta publicitaria",
        "Optimización de estructura de BM",
        "Revisión de cumplimiento de políticas",
      ],
      notIncluded: ["Decisiones de Meta sobre apelaciones (no podemos garantizar resultados)", "Gestión continua de anuncios"],
      process: [
        { step: "01", title: "Auditoría", description: "Revisión de tu configuración de Business Manager e identificación de la causa raíz." },
        { step: "02", title: "Estrategia", description: "Construye un plan de recuperación y cumplimiento." },
        { step: "03", title: "Ejecución", description: "Envía apelaciones e implementa medidas correctivas." },
        { step: "04", title: "Estabilización", description: "Configura tu BM para minimizar problemas futuros." },
      ],
      plans: [
        {
          name: "Consultoría BM",
          price: "$200 (una sesión)",
          note: "Sesión de 90 minutos + recomendaciones",
          features: ["Auditoría de BM", "Diagnóstico del problema", "Hoja de ruta de recuperación", "Recomendaciones escritas"],
        },
        {
          name: "Recuperación Completa",
          price: "Desde $500",
          note: "Soporte de extremo a extremo",
          features: ["Gestión de apelaciones", "Reestructuración de BM", "Cumplimiento de políticas", "Soporte de seguimiento"],
        },
      ],
      faq: [
        { q: "¿Pueden garantizar que mi cuenta se recuperará?", a: "No. Meta toma la decisión final sobre las apelaciones. Mejoramos significativamente tus posibilidades construyendo el caso y documentación correctos." },
        { q: "¿Cuánto tiempo tarda la recuperación?", a: "Las apelaciones típicamente tardan 1–4 semanas. Algunas restricciones se resuelven más rápido; otras requieren múltiples envíos." },
      ],
    },
  },
  {
    slug: "whatsapp-business",
    category: "support",
    accent: "orange",
    icon: "📲",
    en: {
      name: "WhatsApp Business Platform",
      tagline: "Set up the official WhatsApp Business API",
      description:
        "End-to-end setup of the official WhatsApp Business API — from business verification to first message sent, with the platform that fits your team.",
      targetAudience: "Businesses ready to scale customer communication on WhatsApp professionally.",
      included: [
        "Meta Business Verification guidance",
        "WhatsApp Business Account (WABA) setup",
        "Platform selection (Callbell, WATI, B2Chat, Kommo)",
        "API connection and configuration",
        "Message template creation",
        "Test and go-live",
      ],
      notIncluded: ["Platform subscription fees", "WhatsApp conversation fees"],
      process: [
        { step: "01", title: "Verify", description: "Complete Meta Business Verification to access the official API." },
        { step: "02", title: "Select platform", description: "Choose the right BSP based on your team size and needs." },
        { step: "03", title: "Connect", description: "Connect your WABA to your chosen platform." },
        { step: "04", title: "Launch", description: "Create templates and send your first messages." },
      ],
      plans: [
        {
          name: "WhatsApp API Setup",
          price: "From $500 (one-time)",
          note: "Includes platform selection and configuration",
          features: ["WABA setup", "Platform connection", "Template creation", "Go-live support"],
        },
      ],
      faq: [
        { q: "Do I need a paid platform to use the WhatsApp API?", a: "Yes. The official WhatsApp Business API requires a Business Solution Provider (BSP) like Callbell, WATI, or B2Chat. There's no free direct API access for most businesses." },
        { q: "How long does WhatsApp API setup take?", a: "Typically 3–10 business days, depending on how quickly Meta approves your Business Verification." },
      ],
    },
    es: {
      name: "WhatsApp Business Platform",
      tagline: "Configura la API oficial de WhatsApp Business",
      description:
        "Configuración de extremo a extremo de la API oficial de WhatsApp Business — desde la verificación del negocio hasta el primer mensaje enviado, con la plataforma que se adapta a tu equipo.",
      targetAudience: "Negocios listos para escalar la comunicación con clientes en WhatsApp de forma profesional.",
      included: [
        "Guía para Verificación de Negocio de Meta",
        "Configuración de WhatsApp Business Account (WABA)",
        "Selección de plataforma (Callbell, WATI, B2Chat, Kommo)",
        "Conexión y configuración de API",
        "Creación de plantillas de mensajes",
        "Testing y lanzamiento",
      ],
      notIncluded: ["Tarifas de suscripción de plataforma", "Tarifas de conversación de WhatsApp"],
      process: [
        { step: "01", title: "Verificación", description: "Completa la Verificación de Negocio de Meta para acceder a la API oficial." },
        { step: "02", title: "Seleccionar plataforma", description: "Elige el BSP correcto según el tamaño de tu equipo y necesidades." },
        { step: "03", title: "Conectar", description: "Conecta tu WABA a la plataforma elegida." },
        { step: "04", title: "Lanzar", description: "Crea plantillas y envía tus primeros mensajes." },
      ],
      plans: [
        {
          name: "Setup API WhatsApp",
          price: "Desde $500 (pago único)",
          note: "Incluye selección y configuración de plataforma",
          features: ["Setup de WABA", "Conexión de plataforma", "Creación de plantillas", "Soporte de lanzamiento"],
        },
      ],
      faq: [
        { q: "¿Necesito una plataforma de pago para usar la API de WhatsApp?", a: "Sí. La API oficial de WhatsApp Business requiere un Business Solution Provider (BSP) como Callbell, WATI o B2Chat. No hay acceso directo gratuito a la API para la mayoría de negocios." },
        { q: "¿Cuánto tiempo tarda la configuración de la API de WhatsApp?", a: "Típicamente 3–10 días hábiles, dependiendo de qué tan rápido Meta apruebe tu Verificación de Negocio." },
      ],
    },
  },
  {
    slug: "troubleshooting",
    category: "support",
    accent: "orange",
    icon: "🔧",
    en: {
      name: "Account Troubleshooting",
      tagline: "Fix connection and integration issues fast",
      description:
        "Expert diagnostics and resolution for WhatsApp API connection issues, platform integration problems, and account errors.",
      targetAudience: "Businesses with broken integrations or WhatsApp connection errors.",
      included: [
        "Diagnostic session",
        "Error identification and root cause analysis",
        "Fix implementation",
        "Testing and validation",
        "Documentation of resolution",
      ],
      notIncluded: ["New platform setup (quoted separately)", "Account restriction appeals (separate service)"],
      process: [
        { step: "01", title: "Diagnose", description: "Screen-share session to identify the exact error." },
        { step: "02", title: "Root cause", description: "Identify whether the issue is API, platform, or configuration." },
        { step: "03", title: "Fix", description: "Implement the fix with proper testing." },
        { step: "04", title: "Validate", description: "Confirm everything works and document the resolution." },
      ],
      plans: [
        {
          name: "Troubleshooting Session",
          price: "$150/hour",
          note: "Min. 1 hour",
          features: ["Screen-share diagnosis", "Fix implementation", "Testing", "Written summary"],
        },
      ],
      faq: [
        { q: "What issues can you fix?", a: "WhatsApp API connection errors, webhook failures, CRM integration problems, message template rejections, BSP configuration issues." },
        { q: "What if you can't fix it in one session?", a: "We'll give you a clear diagnosis and quote for additional work if more time is needed." },
      ],
    },
    es: {
      name: "Resolución de Problemas",
      tagline: "Resuelve errores de conexión e integración rápido",
      description:
        "Diagnóstico experto y resolución de problemas de conexión de API de WhatsApp, errores de integración de plataformas y errores de cuenta.",
      targetAudience: "Negocios con integraciones rotas o errores de conexión de WhatsApp.",
      included: [
        "Sesión de diagnóstico",
        "Identificación de error y análisis de causa raíz",
        "Implementación de la corrección",
        "Testing y validación",
        "Documentación de la resolución",
      ],
      notIncluded: ["Configuración de nueva plataforma (cotizado por separado)", "Apelaciones de restricciones de cuenta (servicio separado)"],
      process: [
        { step: "01", title: "Diagnóstico", description: "Sesión de pantalla compartida para identificar el error exacto." },
        { step: "02", title: "Causa raíz", description: "Identifica si el problema es de API, plataforma o configuración." },
        { step: "03", title: "Corrección", description: "Implementa la corrección con testing apropiado." },
        { step: "04", title: "Validación", description: "Confirma que todo funciona y documenta la resolución." },
      ],
      plans: [
        {
          name: "Sesión de Resolución",
          price: "$150/hora",
          note: "Mínimo 1 hora",
          features: ["Diagnóstico por pantalla compartida", "Implementación de corrección", "Testing", "Resumen escrito"],
        },
      ],
      faq: [
        { q: "¿Qué problemas pueden resolver?", a: "Errores de conexión de API de WhatsApp, fallos de webhook, problemas de integración con CRM, rechazos de plantillas de mensajes, problemas de configuración de BSP." },
        { q: "¿Qué pasa si no pueden resolverlo en una sesión?", a: "Te daremos un diagnóstico claro y un presupuesto para trabajo adicional si se necesita más tiempo." },
      ],
    },
  },
  {
    slug: "consulting",
    category: "support",
    accent: "orange",
    icon: "🎓",
    en: {
      name: "Digital Strategy Consulting",
      tagline: "Expert guidance for complex growth decisions",
      description:
        "One-on-one strategic consulting sessions to plan your digital marketing, technology stack, or growth system — with honest, unbiased recommendations.",
      targetAudience: "Business owners and marketing managers who need expert input before making big decisions.",
      included: [
        "Pre-session questionnaire",
        "90-minute video call",
        "Screen-share working session",
        "Written action plan (PDF)",
        "30-day email follow-up",
      ],
      notIncluded: ["Ongoing implementation (quoted separately)"],
      process: [
        { step: "01", title: "Questionnaire", description: "Complete our pre-session form so we prepare for your specific situation." },
        { step: "02", title: "Session", description: "90-minute deep dive into your strategy, tools, and priorities." },
        { step: "03", title: "Action plan", description: "Receive a clear PDF action plan within 48 hours." },
        { step: "04", title: "Follow-up", description: "30-day email support for questions on implementing the plan." },
      ],
      plans: [
        {
          name: "Single Session",
          price: "$300",
          note: "90 minutes + written action plan",
          features: ["Pre-session questionnaire", "90-min session", "PDF action plan", "30-day follow-up"],
        },
        {
          name: "Monthly Advisory",
          price: "$800/mo",
          note: "4 sessions per month",
          features: ["Weekly 45-min sessions", "Ongoing guidance", "Slack access", "Priority scheduling"],
        },
      ],
      faq: [
        { q: "What topics can we cover in a session?", a: "SEO strategy, paid media planning, tech stack selection, WhatsApp/CRM setup decisions, hiring vs. agency decisions, content strategy, or any combination." },
        { q: "Is this a sales call?", a: "No. These are working sessions where you get actual strategic input. If you want to become a client afterward, great — but it's not the purpose." },
      ],
    },
    es: {
      name: "Consultoría Estratégica Digital",
      tagline: "Guía experta para decisiones de crecimiento complejas",
      description:
        "Sesiones de consultoría estratégica uno a uno para planificar tu marketing digital, stack tecnológico o sistema de crecimiento — con recomendaciones honestas e imparciales.",
      targetAudience: "Dueños de negocios y gerentes de marketing que necesitan input experto antes de tomar grandes decisiones.",
      included: [
        "Cuestionario previo a la sesión",
        "Videollamada de 90 minutos",
        "Sesión de trabajo con pantalla compartida",
        "Plan de acción escrito (PDF)",
        "Seguimiento por email por 30 días",
      ],
      notIncluded: ["Implementación continua (cotizada por separado)"],
      process: [
        { step: "01", title: "Cuestionario", description: "Completa nuestro formulario previo para que nos preparemos para tu situación específica." },
        { step: "02", title: "Sesión", description: "Inmersión profunda de 90 minutos en tu estrategia, herramientas y prioridades." },
        { step: "03", title: "Plan de acción", description: "Recibe un plan de acción claro en PDF en 48 horas." },
        { step: "04", title: "Seguimiento", description: "Soporte por email por 30 días para preguntas sobre la implementación del plan." },
      ],
      plans: [
        {
          name: "Sesión Única",
          price: "$300",
          note: "90 minutos + plan de acción escrito",
          features: ["Cuestionario previo", "Sesión de 90 min", "Plan en PDF", "Seguimiento 30 días"],
        },
        {
          name: "Asesoría Mensual",
          price: "$800/mes",
          note: "4 sesiones por mes",
          features: ["Sesiones semanales de 45 min", "Guía continua", "Acceso a Slack", "Programación prioritaria"],
        },
      ],
      faq: [
        { q: "¿Qué temas podemos cubrir en una sesión?", a: "Estrategia SEO, planificación de paid media, selección de stack tecnológico, decisiones de setup de WhatsApp/CRM, decisiones de contratar vs. agencia, estrategia de contenido, o cualquier combinación." },
        { q: "¿Es esto una llamada de ventas?", a: "No. Estas son sesiones de trabajo donde recibes input estratégico real. Si quieres convertirte en cliente después, genial — pero no es el propósito." },
      ],
    },
  },
]

/* ── Helper utilities ── */

export function getServiceBySlug(slug: string): Service | undefined {
  return services.find((s) => s.slug === slug)
}

export function getServicesByCategory(category: ServiceCategory): Service[] {
  return services.filter((s) => s.category === category)
}

export const serviceCategories = {
  seo: { label: "SEO", labelEs: "SEO", accent: "mint" as const },
  "paid-media": { label: "Paid Media", labelEs: "Paid Media", accent: "warm" as const },
  automation: { label: "AI & Automation", labelEs: "IA y Automatización", accent: "violet" as const },
  support: { label: "Support", labelEs: "Soporte", accent: "orange" as const },
}

export const NAV_SERVICES = {
  seo: [
    { slug: "seo", label: "SEO", labelEs: "SEO" },
    { slug: "local-seo", label: "Local SEO", labelEs: "SEO Local" },
    { slug: "technical-seo", label: "Technical SEO", labelEs: "SEO Técnico" },
    { slug: "ecommerce-seo", label: "Ecommerce SEO", labelEs: "SEO Ecommerce" },
    { slug: "ai-seo", label: "AI SEO / GEO / AEO", labelEs: "SEO con IA / GEO / AEO" },
  ],
  "paid-media": [
    { slug: "google-ads", label: "Google Ads", labelEs: "Google Ads" },
    { slug: "meta-ads", label: "Meta Ads", labelEs: "Meta Ads" },
    { slug: "tiktok-ads", label: "TikTok Ads", labelEs: "TikTok Ads" },
  ],
  automation: [
    { slug: "ai-agents", label: "AI Agents", labelEs: "Agentes IA" },
    { slug: "chatbots", label: "Chatbots", labelEs: "Chatbots" },
    { slug: "callbell", label: "Callbell", labelEs: "Callbell" },
    { slug: "kommo", label: "Kommo CRM", labelEs: "Kommo CRM" },
    { slug: "wati", label: "WATI", labelEs: "WATI" },
    { slug: "b2chat", label: "B2Chat", labelEs: "B2Chat" },
    { slug: "automation-tools", label: "Make / n8n / Zapier", labelEs: "Make / n8n / Zapier" },
  ],
  support: [
    { slug: "meta-business", label: "Meta Business", labelEs: "Meta Business" },
    { slug: "whatsapp-business", label: "WhatsApp Business", labelEs: "WhatsApp Business" },
    { slug: "troubleshooting", label: "Troubleshooting", labelEs: "Resolución de Problemas" },
    { slug: "consulting", label: "Consulting", labelEs: "Consultoría" },
  ],
}

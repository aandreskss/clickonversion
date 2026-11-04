export type BlogCategory = "SEO" | "ADS" | "IA" | "CHAT" | "DEV" | "TRACKING"

export interface BlogPost {
  slug: string
  cat: BlogCategory
  title: string
  excerpt: string
  readMin: number
  author: string
  /** ISO yyyy-mm-dd. Solo los posts con `published: true` tienen página propia. */
  date: string
  published: boolean
  cover: { bg: string; fg: string; glyph: string }
}

export const POSTS: BlogPost[] = [
  { slug: "api-de-conversiones-meta", cat: "TRACKING", title: "API de conversiones de Meta: qué es y cómo configurarla paso a paso", excerpt: "Por qué el píxel solo ya no alcanza, cómo funciona la API de conversiones, cómo evitar eventos duplicados y cómo verificar que todo llega bien.", readMin: 9, author: "Arnaldo Casadiego", date: "2026-11-04", published: true, cover: { bg: "#010E25", fg: "#FFFFFF", glyph: "[CAPI]" } },
  { slug: "seo-local-google-maps-ia", cat: "SEO", title: "SEO local: cómo aparecer en Google Maps y en las respuestas de IA", excerpt: "Google Business, reseñas, citas locales y contenido que los asistentes de IA pueden citar.", readMin: 8, author: "Arnaldo Casadiego", date: "", published: false, cover: { bg: "#D6EBFF", fg: "#010E25", glyph: "[MAPS]" } },
  { slug: "cuanto-invertir-meta-ads", cat: "ADS", title: "Cuánto invertir en Meta Ads si estás empezando (y cómo saber si funciona)", excerpt: "Cómo definir un presupuesto de prueba, qué medir la primera semana y cuándo escalar.", readMin: 7, author: "ClicKonversion", date: "", published: false, cover: { bg: "#FFDCC7", fg: "#010E25", glyph: "[$/DÍA]" } },
  { slug: "agentes-ia-whatsapp", cat: "IA", title: "Agentes de IA para WhatsApp: qué pueden hacer por tu negocio", excerpt: "Qué preguntas puede responder un agente, cuándo debe pasar a una persona y cómo empezar.", readMin: 6, author: "ClicKonversion", date: "", published: false, cover: { bg: "#E4DEFF", fg: "#010E25", glyph: "[24/7]" } },
  { slug: "landing-page-o-pagina-web", cat: "DEV", title: "Landing page o página web: cuál necesitas para vender más", excerpt: "Las diferencias reales, cuándo conviene cada una y qué debe tener una landing que convierte.", readMin: 6, author: "ClicKonversion", date: "", published: false, cover: { bg: "#FFF8F0", fg: "#010E25", glyph: "[LANDING]" } },
  { slug: "pixel-de-tiktok", cat: "TRACKING", title: "Píxel de TikTok: cómo instalarlo y qué eventos medir", excerpt: "Instalación, eventos estándar recomendados y cómo comprobar que llegan bien.", readMin: 7, author: "ClicKonversion", date: "", published: false, cover: { bg: "#FE5C02", fg: "#010E25", glyph: "[PIXEL]" } },
  { slug: "seo-tecnico-errores", cat: "SEO", title: "SEO técnico: los errores más comunes que frenan tu web", excerpt: "Velocidad, indexación, enlaces rotos y datos estructurados: qué revisar primero.", readMin: 9, author: "Arnaldo Casadiego", date: "", published: false, cover: { bg: "#D6EBFF", fg: "#010E25", glyph: "[404]" } },
  { slug: "whatsapp-business-crm", cat: "CHAT", title: "WhatsApp Business y CRM: cómo no perder ni un cliente", excerpt: "Etiquetas, respuestas rápidas y etapas de venta para que ningún mensaje se quede sin respuesta.", readMin: 5, author: "ClicKonversion", date: "", published: false, cover: { bg: "#D3F2E3", fg: "#010E25", glyph: "[CRM]" } },
]

export function getPost(slug: string) {
  return POSTS.find((p) => p.slug === slug && p.published)
}

export function formatDate(iso: string) {
  if (!iso) return "Próximamente"
  return new Date(iso + "T12:00:00Z").toLocaleDateString("es", { day: "numeric", month: "short", year: "numeric" })
}

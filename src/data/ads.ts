// Anuncios creados por ClicKonversion. Archivos en /public/ads/.
// Se muestran sin nombre del cliente: solo el sector, la plataforma y el formato.

export type AdPlatform = "Meta Ads" | "TikTok Ads" | "Google Ads"
export type AdFormat = "Reel" | "Story" | "Post 1:1" | "Post 4:5" | "Carrusel" | "Video" | "Display"

export interface AdCreative {
  id: string
  sector: string
  platform: AdPlatform
  format: AdFormat
  kind: "image" | "video"
  src: string
  /** Primer fotograma para los videos */
  poster?: string
  /** Proporción real del archivo, p. ej. "9 / 16" o "4 / 5" */
  ratio: string
  /** Una línea opcional sobre la idea del anuncio */
  note?: string
  /** Pieza de ejemplo (no es de un cliente). Bórrala cuando subas anuncios reales. */
  example?: boolean
}

// Ejemplos para ver el diseño de la sección. Reemplázalos por anuncios reales.
export const ADS: AdCreative[] = [
  { id: "ej-calzado", sector: "Tienda de calzado", platform: "Meta Ads", format: "Post 4:5", kind: "image", src: "/ads/ejemplo-calzado-meta-post.webp", ratio: "4 / 5", note: "Beneficio claro y pedido directo por WhatsApp.", example: true },
  { id: "ej-clinica", sector: "Clínica dental", platform: "Meta Ads", format: "Story", kind: "image", src: "/ads/ejemplo-clinica-meta-story.webp", ratio: "9 / 16", note: "Pregunta que engancha y oferta de valoración.", example: true },
  { id: "ej-restaurante", sector: "Restaurante", platform: "TikTok Ads", format: "Video", kind: "image", src: "/ads/ejemplo-restaurante-tiktok.webp", ratio: "9 / 16", note: "Formato «POV» nativo de TikTok.", example: true },
  { id: "ej-gimnasio", sector: "Gimnasio", platform: "TikTok Ads", format: "Video", kind: "image", src: "/ads/ejemplo-gimnasio-tiktok.webp", ratio: "9 / 16", note: "Reto de 30 días con clase de prueba.", example: true },
  { id: "ej-inmobiliaria", sector: "Inmobiliaria", platform: "Meta Ads", format: "Carrusel", kind: "image", src: "/ads/ejemplo-inmobiliaria-meta-carrusel.webp", ratio: "1 / 1", note: "Una propiedad, cinco fotos para deslizar.", example: true },
  { id: "ej-academia", sector: "Academia online", platform: "Google Ads", format: "Display", kind: "image", src: "/ads/ejemplo-academia-google-display.webp", ratio: "1 / 1", note: "Mensaje corto para la red de display.", example: true },
]

import type { Metadata } from "next"
import { ManychatPage } from "@/components/brand/crm/manychat-page"

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.clickonversion.com"
const url = `${siteUrl}/services/manychat`

export const metadata: Metadata = {
  title: { absolute: "Implementación de Manychat: automatiza comentarios y DMs de Instagram | ClicKonversion" },
  description: "Convertimos comentarios, respuestas a historias y mensajes directos en leads con Manychat: flujos con IA para Instagram, Messenger y WhatsApp conectados a tu CRM.",
  alternates: { canonical: url },
  openGraph: {
    title: "Manychat: de comentario a cliente en Instagram",
    description: "Convertimos comentarios, respuestas a historias y mensajes directos en leads con Manychat: flujos con IA para Instagram, Messenger y WhatsApp conectados a tu CRM.",
    url,
    siteName: "ClicKonversion",
    locale: "es_419",
    type: "website",
  },
}

export default function Page() {
  return <ManychatPage />
}

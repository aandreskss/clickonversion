import type { Metadata } from "next"
import { CallbellPage } from "@/components/brand/crm/callbell-page"

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.clickonversion.com"
const url = `${siteUrl}/services/callbell`

export const metadata: Metadata = {
  title: { absolute: "Implementación de Callbell: WhatsApp multiagente para tu equipo | ClicKonversion" },
  description: "Instalamos Callbell con la API oficial de WhatsApp o en coexistencia con la app: bandeja compartida, asignación automática, bots e integraciones. Listo en 5 a 10 días hábiles.",
  alternates: { canonical: url },
  openGraph: {
    title: "Callbell: todo tu equipo en un solo WhatsApp",
    description: "Instalamos Callbell con la API oficial de WhatsApp o en coexistencia con la app: bandeja compartida, asignación automática, bots e integraciones. Listo en 5 a 10 días hábiles.",
    url,
    siteName: "ClicKonversion",
    locale: "es_419",
    type: "website",
  },
}

export default function Page() {
  return <CallbellPage />
}

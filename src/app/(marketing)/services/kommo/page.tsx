import type { Metadata } from "next"
import { KommoPage } from "@/components/brand/crm/kommo-page"

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.clickonversion.com"
const url = `${siteUrl}/services/kommo`

export const metadata: Metadata = {
  title: { absolute: "Implementación de Kommo CRM con WhatsApp y Meta Ads | ClicKonversion" },
  description: "Configuramos Kommo con un pipeline a la medida de cómo vendes, WhatsApp en cada ficha, leads de Meta Lead Ads que entran solos, Salesbot y capacitación por rol.",
  alternates: { canonical: url },
  openGraph: {
    title: "Kommo CRM: cada lead en su etapa",
    description: "Configuramos Kommo con un pipeline a la medida de cómo vendes, WhatsApp en cada ficha, leads de Meta Lead Ads que entran solos, Salesbot y capacitación por rol.",
    url,
    siteName: "ClicKonversion",
    locale: "es_419",
    type: "website",
  },
}

export default function Page() {
  return <KommoPage />
}

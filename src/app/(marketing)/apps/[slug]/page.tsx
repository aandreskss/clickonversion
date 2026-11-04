import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { APPS, getApp } from "@/data/apps"
import { SyncLeadPage } from "@/components/apps/synclead-page"

interface Props {
  params: Promise<{ slug: string }>
  searchParams?: Promise<Record<string, string | string[] | undefined>>
}

export async function generateStaticParams() {
  return APPS.map((app) => ({ slug: app.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const app = getApp(slug)
  if (!app) return {}

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.clickonversion.com"

  return {
    title: app.slug === "synclead" ? "SyncLead — CRM para leads de Meta Ads con WhatsApp e IA · Planes y precios" : `${app.name} — Apps`,
    description: app.description,
    alternates: {
      canonical: `${siteUrl}/apps/${app.slug}`,
    },
    openGraph: {
      title: `${app.name} — ${app.tagline}`,
      description: app.description,
      url: `${siteUrl}/apps/${app.slug}`,
      siteName: "ClicKonversion",
      locale: "es_419",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${app.name} — ${app.tagline}`,
      description: app.description,
    },
  }
}

export default async function AppPage({ params, searchParams }: Props) {
  const { slug } = await params
  const sp = (await searchParams) ?? {}
  const app = getApp(slug)
  if (!app) notFound()

  if (app.slug === "synclead") {
    return <SyncLeadPage app={app} cancelled={sp.cancelado === "1"} />
  }

  notFound()
}

import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { APPS, getApp } from "@/data/apps"
import { SyncLeadPage } from "@/components/apps/synclead-page"

interface Props {
  params: Promise<{ slug: string }>
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
    title: `${app.name} — ClicKonversion Apps`,
    description: app.description,
    alternates: {
      canonical: `${siteUrl}/apps/${app.slug}`,
    },
    openGraph: {
      title: `${app.name} — ${app.tagline}`,
      description: app.description,
      url: `${siteUrl}/apps/${app.slug}`,
      siteName: "ClicKonversion",
      locale: "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${app.name} — ${app.tagline}`,
      description: app.description,
    },
  }
}

export default async function AppPage({ params }: Props) {
  const { slug } = await params
  const app = getApp(slug)
  if (!app) notFound()

  if (app.slug === "synclead") {
    return <SyncLeadPage app={app} />
  }

  notFound()
}

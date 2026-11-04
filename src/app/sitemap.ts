import type { MetadataRoute } from "next"
import { APPS } from "@/data/apps"
import { POSTS } from "@/data/blog"

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.clickonversion.com"

export default function sitemap(): MetadataRoute.Sitemap {
  const appEntries: MetadataRoute.Sitemap = APPS
    .filter((app) => app.status === "live" || app.status === "beta" || app.status === "waitlist")
    .map((app) => ({
      url: `${siteUrl}/apps/${app.slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    }))

  return [
    { url: siteUrl,               lastModified: new Date(), changeFrequency: "weekly",  priority: 1.0 },
    { url: `${siteUrl}/audit`,    lastModified: new Date(), changeFrequency: "monthly", priority: 0.9 },
    { url: `${siteUrl}/apps`,     lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    ...appEntries,
    { url: `${siteUrl}/catalog`,  lastModified: new Date(), changeFrequency: "weekly",  priority: 0.7 },
    { url: `${siteUrl}/services`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${siteUrl}/pricing`,  lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${siteUrl}/projects`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    { url: `${siteUrl}/about`,    lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    { url: `${siteUrl}/blog`,     lastModified: new Date(), changeFrequency: "weekly",  priority: 0.7 },
    ...POSTS.filter((p) => p.published).map((p) => ({ url: `${siteUrl}/blog/${p.slug}`, lastModified: new Date(p.date), changeFrequency: "monthly" as const, priority: 0.6 })),
    { url: `${siteUrl}/privacy`,  lastModified: new Date(), changeFrequency: "yearly",  priority: 0.3 },
    { url: `${siteUrl}/terms`,    lastModified: new Date(), changeFrequency: "yearly",  priority: 0.3 },
  ]
}

import type { MetadataRoute } from "next"

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://clicKonversion.com"

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/audit", "/thank-you", "/privacy", "/terms"],
        disallow: ["/app", "/api/", "/login"],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
  }
}

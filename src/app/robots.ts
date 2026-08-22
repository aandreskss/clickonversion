import type { MetadataRoute } from "next"

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.clickonversion.com"

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/audit", "/privacy", "/terms"],
        disallow: ["/app", "/api/", "/login", "/thank-you"],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
  }
}

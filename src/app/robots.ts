import type { MetadataRoute } from "next"

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.clickonversion.com"

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: [
          "/",
          "/services",
          "/services/",
          "/pricing",
          "/projects",
          "/projects/",
          "/apps",
          "/apps/synclead",
          "/about",
          "/about/arnaldo",
          "/blog",
          "/blog/",
          "/audit",
          "/resources",
          "/privacy",
          "/terms",
        ],
        disallow: [
          "/app/",
          "/admin/",
          "/portal/",
          "/api/",
          "/login",
          "/thank-you",
          "/cleaning",
          "/onboarding/",
          "/checkout/",
          "/book/",
          "/catalog/",
        ],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
  }
}

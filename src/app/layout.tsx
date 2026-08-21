import type { Metadata, Viewport } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
})

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://clickonversion.com"
const gaId    = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID
const gscVerify = process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${siteUrl}/#organization`,
      name: "ClicKonversion",
      url: siteUrl,
      logo: { "@type": "ImageObject", url: `${siteUrl}/logo-mark.svg` },
      founder: { "@type": "Person", name: "Arnaldo Casadiego", sameAs: "https://www.linkedin.com/in/arnaldocasadiego/" },
      contactPoint: { "@type": "ContactPoint", email: "hello@clickonversion.com", contactType: "customer support" },
    },
    {
      "@type": "WebSite",
      "@id": `${siteUrl}/#website`,
      url: siteUrl,
      name: "ClicKonversion",
      publisher: { "@id": `${siteUrl}/#organization` },
    },
  ],
}

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "SEO, Google Ads & Growth Systems for Service Businesses | ClicKonversion",
    template: "%s | ClicKonversion",
  },
  description:
    "ClicKonversion connects SEO, paid acquisition, CRO and follow-up into one measurable growth system for local service businesses. Turn search and traffic into customers.",
  keywords: [
    "growth marketing", "local SEO", "lead generation",
    "conversion optimization", "Google Ads", "service business marketing",
    "HVAC marketing", "roofing marketing", "cleaning company marketing",
  ],
  authors: [{ name: "ClicKonversion" }],
  creator: "ClicKonversion",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: "ClicKonversion",
    title: "SEO, Google Ads & Growth Systems for Service Businesses | ClicKonversion",
    description: "We connect SEO, paid acquisition, CRO and follow-up into one measurable growth system for local service businesses.",
  },
  twitter: {
    card: "summary_large_image",
    title: "SEO, Google Ads & Growth Systems for Service Businesses | ClicKonversion",
    description: "We connect SEO, paid acquisition, CRO and follow-up into one measurable growth system for local service businesses.",
  },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
  ...(gscVerify ? { verification: { google: gscVerify } } : {}),
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0B0D0F",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {gaId && (
          <>
            <script async src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`} />
            <script
              dangerouslySetInnerHTML={{
                __html: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${gaId}',{send_page_view:true});`,
              }}
            />
          </>
        )}
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  )
}

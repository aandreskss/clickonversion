import type { Metadata, Viewport } from "next"
import { Inter } from "next/font/google"
import Script from "next/script"
import "./globals.css"

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
})

const siteUrl    = process.env.NEXT_PUBLIC_SITE_URL ?? "https://clickonversion.com"
const gaId       = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID
const gscVerify  = process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${siteUrl}/#organization`,
      name: "ClicKonversion",
      url: siteUrl,
      logo: { "@type": "ImageObject", url: `${siteUrl}/logo-mark.svg` },
      founder: {
        "@type": "Person",
        name: "Arnaldo Casadiego",
        sameAs: "https://www.linkedin.com/in/arnaldocasadiego/",
      },
      contactPoint: {
        "@type": "ContactPoint",
        email: "hello@clickonversion.com",
        contactType: "customer support",
      },
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
    default: "More Qualified Leads for Service Businesses | ClicKonversion",
    template: "%s | ClicKonversion",
  },
  description:
    "ClicKonversion helps service businesses get found on Google, convert more visitors into leads, follow up faster and understand what actually produces customers.",
  keywords: [
    "lead generation for service businesses",
    "local SEO service business",
    "Google Ads cleaning company",
    "growth system service business",
    "conversion optimization",
    "HVAC marketing",
    "roofing marketing",
    "cleaning company marketing",
  ],
  authors: [{ name: "ClicKonversion" }],
  creator: "ClicKonversion",
  alternates: {
    canonical: siteUrl,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: "ClicKonversion",
    title: "More Qualified Leads for Service Businesses | ClicKonversion",
    description:
      "ClicKonversion helps service businesses get found, convert more visitors, follow up faster and understand what actually produces customers.",
  },
  twitter: {
    card: "summary_large_image",
    title: "More Qualified Leads for Service Businesses | ClicKonversion",
    description:
      "ClicKonversion helps service businesses get found, convert more visitors, follow up faster and understand what actually produces customers.",
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
      </head>
      <body className={inter.className}>
        {children}

        {/* GA4 — loads after page is interactive, no render blocking */}
        {gaId && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
              strategy="afterInteractive"
            />
            <Script
              id="gtag-init"
              strategy="afterInteractive"
              dangerouslySetInnerHTML={{
                __html: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${gaId}',{send_page_view:true});`,
              }}
            />
          </>
        )}
      </body>
    </html>
  )
}

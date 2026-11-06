import type { Metadata, Viewport } from "next"
import { Inter, Plus_Jakarta_Sans, Instrument_Serif, JetBrains_Mono, Outfit, Caveat } from "next/font/google"
import Script from "next/script"
import { CartProvider } from "@/components/shop/cart-provider"
import { Providers } from "@/components/providers"
import "./globals.css"
import "./brand.css"

const inter = Inter({ subsets: ["latin"], display: "swap", variable: "--font-inter" })

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-display",
  weight: ["400", "500", "600", "700", "800"],
})

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-instrument-serif",
  style: ["normal", "italic"],
  weight: "400",
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-jetbrains-mono",
  weight: ["400", "500", "700"],
})

// Marca v4 (manual de identidad): Outfit = la voz, Caveat = la mano
const outfit = Outfit({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-outfit",
  weight: ["300", "400", "500", "600", "700", "800"],
})

const caveat = Caveat({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-caveat",
  weight: ["500", "700"],
})

const siteUrl   = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.clickonversion.com"
const gscVerify = process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION
// Validate GA ID format to prevent injection via env var
const rawGaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID ?? ""
const gaId = /^G-[A-Z0-9]{4,12}$/.test(rawGaId) ? rawGaId : undefined

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${siteUrl}/#organization`,
      name: "ClicKonversion",
      url: siteUrl,
      logo: { "@type": "ImageObject", url: `${siteUrl}/brand/clickonversion-logo-color.svg` },
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
    default: "More Visibility. Better Leads. Smarter Growth. | ClicKonversion",
    template: "%s | ClicKonversion",
  },
  description:
    "ClicKonversion builds full-stack growth systems combining SEO, paid media, AI automation, and CRM — for ambitious businesses worldwide.",
  keywords: [
    "digital marketing agency",
    "SEO services",
    "Google Ads management",
    "Meta Ads agency",
    "AI automation",
    "WhatsApp Business",
    "lead generation",
    "growth marketing",
    "SyncLead CRM",
  ],
  authors: [{ name: "ClicKonversion" }],
  creator: "ClicKonversion",
  alternates: {
    canonical: siteUrl,
    languages: {
      "en": siteUrl,
      "es": `${siteUrl}/es`,
      "x-default": siteUrl,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    alternateLocale: ["es_419"],
    url: siteUrl,
    siteName: "ClicKonversion",
    title: "More Visibility. Better Leads. Smarter Growth. | ClicKonversion",
    description:
      "Full-stack growth systems combining SEO, paid media, AI automation, and CRM — for ambitious businesses worldwide.",
    images: [{ url: `${siteUrl}/opengraph-image`, width: 1200, height: 630, alt: "ClicKonversion — More Visibility. Better Leads. Smarter Growth." }],
  },
  twitter: {
    card: "summary_large_image",
    title: "More Visibility. Better Leads. Smarter Growth. | ClicKonversion",
    description: "Full-stack growth systems combining SEO, paid media, AI automation, and CRM.",
    images: [`${siteUrl}/opengraph-image`],
  },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
  ...(gscVerify ? { verification: { google: gscVerify } } : {}),
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#010E25",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${plusJakarta.variable} ${instrumentSerif.variable} ${jetbrainsMono.variable} ${outfit.variable} ${caveat.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
        />
      </head>
      <body style={{ fontFamily: "var(--font-inter, var(--font-sans))" }}>
        <Providers>
        <CartProvider>
        {children}
        </CartProvider>
        </Providers>

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

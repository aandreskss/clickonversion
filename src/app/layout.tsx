import type { Metadata, Viewport } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
})

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://clicKonversion.com"
const gaId    = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID
const gscVerify = process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "ClicKonversion — Growth Systems for Service Businesses",
    template: "%s | ClicKonversion",
  },
  description:
    "ClicKonversion builds growth systems that turn search, traffic and attention into customers. SEO, paid acquisition, CRO and smarter follow-up for local service businesses.",
  keywords: [
    "growth marketing", "local SEO", "lead generation",
    "conversion optimization", "Google Ads", "service business marketing",
  ],
  authors: [{ name: "ClicKonversion" }],
  creator: "ClicKonversion",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: "ClicKonversion",
    title: "ClicKonversion — Growth Systems for Service Businesses",
    description: "We build growth systems that turn search, traffic and attention into customers.",
  },
  twitter: {
    card: "summary_large_image",
    title: "ClicKonversion — Growth Systems for Service Businesses",
    description: "We build growth systems that turn search, traffic and attention into customers.",
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

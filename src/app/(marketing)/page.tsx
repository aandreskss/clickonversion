import type { Metadata } from "next"
import { MarketingLayout } from "@/components/marketing/marketing-layout"
import { Hero } from "@/components/sections/hero"
import { ServicesPreview } from "@/components/sections/services-preview"
import { Methodology } from "@/components/sections/methodology"
import { HowItWorks } from "@/components/sections/how-it-works"
import { WhatsAppSection } from "@/components/sections/whatsapp-section"
import { CaseStudiesPreview } from "@/components/sections/case-studies-preview"
import { SyncLeadSection } from "@/components/sections/synclead-section"
import { Testimonials } from "@/components/sections/testimonials"
import { HomepageFaq } from "@/components/sections/homepage-faq"
import { HomepageCta } from "@/components/sections/homepage-cta"

export const metadata: Metadata = {
  title: "ClicKonversion — SEO, Meta Ads, AI Agents & WhatsApp Business Agency",
  description:
    "SEO, Local SEO, Google Ads, Meta Ads, AI chatbots, AI agents, WhatsApp Business API, and marketing automation — one integrated system that turns visibility into customers.",
  alternates: {
    canonical: "https://www.clickonversion.com",
    languages: {
      "en": "https://www.clickonversion.com",
      "es": "https://www.clickonversion.com/es",
    },
  },
  openGraph: {
    title: "ClicKonversion — SEO, Meta Ads, AI & WhatsApp Business",
    description: "SEO, Meta Ads, AI agents, and WhatsApp Business — one integrated system that turns visibility into customers.",
    url: "https://www.clickonversion.com",
    siteName: "ClicKonversion",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "ClicKonversion — SEO, Meta Ads, AI & WhatsApp Business",
    description: "SEO, Meta Ads, AI agents, and WhatsApp Business — one integrated system that turns visibility into customers.",
  },
}

export default function HomePage() {
  return (
    <MarketingLayout>
      <Hero />
      <ServicesPreview />
      <Methodology />
      <HowItWorks />
      <WhatsAppSection />
      <CaseStudiesPreview />
      <SyncLeadSection />
      <Testimonials />
      <HomepageFaq />
      <HomepageCta />
    </MarketingLayout>
  )
}

import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight, Check } from "lucide-react"
import { MarketingLayout } from "@/components/marketing/marketing-layout"
import { HomepageCta } from "@/components/sections/homepage-cta"
import { services, serviceCategories } from "@/data/services"
import type { ServiceCategory } from "@/data/services"

export const metadata: Metadata = {
  title: "Pricing — Transparent Service Pricing | ClicKonversion",
  description:
    "Transparent pricing for SEO, Meta Ads, Google Ads, AI agents, chatbots, and WhatsApp automation. Starting prices listed — custom quotes for larger scopes.",
  alternates: {
    canonical: "https://www.clickonversion.com/pricing",
  },
  openGraph: {
    title: "Pricing — Transparent Service Pricing | ClicKonversion",
    description:
      "Every service listed with starting prices. Custom quotes for larger scopes — always with a clear scope of work before any commitment.",
    url: "https://www.clickonversion.com/pricing",
    siteName: "ClicKonversion",
    locale: "en_US",
    type: "website",
  },
}

const CATEGORY_ACCENT: Record<ServiceCategory, string> = {
  seo: "#78E6B3",
  "paid-media": "#FFCB86",
  automation: "#7885FF",
  support: "#FF5A1F",
}

const CATEGORY_ORDER: ServiceCategory[] = ["seo", "paid-media", "automation", "support"]

// Services that are one-time/consulting (not recurring)
const ONE_TIME_SLUGS = new Set([
  "technical-seo",
  "ai-agents",
  "chatbots",
  "callbell",
  "kommo",
  "wati",
  "b2chat",
  "automation-tools",
  "meta-business",
  "whatsapp-business",
  "troubleshooting",
  "consulting",
])

export default function PricingPage() {
  return (
    <MarketingLayout>
      {/* Hero */}
      <section className="pt-32 pb-16 bg-[#101827]" aria-label="Pricing overview">
        <div className="container-wide">
          <div className="max-w-3xl">
            <p className="eyebrow text-[#4E5D6E] mb-5">Pricing</p>
            <h1 className="font-display text-[clamp(2.5rem,5vw,3.75rem)] font-extrabold text-white leading-tight mb-6">
              Transparent pricing.{" "}
              <span
                style={{
                  background: "linear-gradient(135deg, #78E6B3 0%, #FFCB86 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                No surprises.
              </span>
            </h1>
            <p className="text-[#7A8799] text-lg leading-relaxed max-w-2xl">
              Every service listed with starting prices. Custom quotes for larger scopes —
              always with a clear scope of work before any commitment.
            </p>
          </div>
        </div>
      </section>

      {/* Recurring / retainer services by category */}
      {CATEGORY_ORDER.map((cat, idx) => {
        const catMeta = serviceCategories[cat]
        const accent = CATEGORY_ACCENT[cat]
        const bg = idx % 2 === 0 ? "bg-[#101827]" : "bg-[#151E2D]"
        const catServices = services.filter(
          (s) => s.category === cat && !ONE_TIME_SLUGS.has(s.slug)
        )
        if (catServices.length === 0) return null

        return (
          <section key={cat} className={`py-20 ${bg}`} aria-label={`${catMeta.label} pricing`}>
            <div className="container-wide">
              <p className="eyebrow mb-3" style={{ color: accent }}>
                {catMeta.label}
              </p>
              <h2 className="font-display text-[clamp(1.5rem,3vw,2rem)] font-bold text-white mb-10">
                {catMeta.label === "SEO" && "Search engine optimization"}
                {catMeta.label === "Paid Media" && "Paid advertising management"}
                {catMeta.label === "AI & Automation" && "AI & automation builds"}
                {catMeta.label === "Support" && "Support & consulting"}
              </h2>

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {catServices.map((service) => {
                  const firstPlan = service.en.plans[0]
                  return (
                    <Link
                      key={service.slug}
                      href={`/services/${service.slug}`}
                      className="group relative rounded-2xl p-6 border border-white/[0.07] bg-white/[0.02] hover:bg-white/[0.04] hover:border-white/[0.12] transition-all duration-200 flex flex-col"
                    >
                      {/* Icon + Name */}
                      <div className="flex items-center gap-3 mb-4">
                        <span className="text-xl">{service.icon}</span>
                        <h3 className="font-display text-base font-bold text-white">
                          {service.en.name}
                        </h3>
                      </div>

                      {/* Tagline */}
                      <p className="text-xs font-medium mb-3" style={{ color: accent }}>
                        {service.en.tagline}
                      </p>

                      {/* Starting price */}
                      <div className="mt-auto pt-4 border-t border-white/[0.06]">
                        <p className="text-xs text-[#4E5D6E] mb-0.5">Starting from</p>
                        <p className="text-lg font-extrabold text-white">
                          {firstPlan.price}
                        </p>
                        <p className="text-xs text-[#4E5D6E] mt-1">{firstPlan.note}</p>
                      </div>

                      {/* First 3 features */}
                      <ul className="mt-4 space-y-1.5">
                        {firstPlan.features.slice(0, 3).map((feat) => (
                          <li key={feat} className="flex items-center gap-2">
                            <Check size={11} style={{ color: accent, flexShrink: 0 }} />
                            <span className="text-xs text-[#7A8799]">{feat}</span>
                          </li>
                        ))}
                        {service.en.plans.length > 1 && (
                          <li className="text-xs text-[#4E5D6E] pt-1 flex items-center gap-1">
                            +{service.en.plans.length - 1} more plan{service.en.plans.length > 2 ? "s" : ""}
                            <ArrowRight size={10} className="transition-transform group-hover:translate-x-0.5" />
                          </li>
                        )}
                      </ul>
                    </Link>
                  )
                })}
              </div>
            </div>
          </section>
        )
      })}

      {/* One-time / Consulting services */}
      <section className="py-20 bg-[#151E2D]" aria-label="One-time services">
        <div className="container-wide">
          <p className="eyebrow text-[#FF5A1F] mb-3">Consulting &amp; One-time</p>
          <h2 className="font-display text-[clamp(1.5rem,3vw,2rem)] font-bold text-white mb-4">
            Setup, implementation &amp; troubleshooting
          </h2>
          <p className="text-[#7A8799] text-sm mb-10 max-w-xl">
            One-time builds and consulting sessions — pay once, keep the result.
          </p>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {services
              .filter((s) => ONE_TIME_SLUGS.has(s.slug))
              .map((service) => {
                const firstPlan = service.en.plans[0]
                const accent = CATEGORY_ACCENT[service.category]
                return (
                  <Link
                    key={service.slug}
                    href={`/services/${service.slug}`}
                    className="group relative rounded-2xl p-6 border border-white/[0.07] bg-white/[0.02] hover:bg-white/[0.04] hover:border-white/[0.12] transition-all duration-200 flex flex-col"
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <span className="text-xl">{service.icon}</span>
                      <h3 className="font-display text-base font-bold text-white">
                        {service.en.name}
                      </h3>
                    </div>

                    <p className="text-xs font-medium mb-3" style={{ color: accent }}>
                      {service.en.tagline}
                    </p>

                    <div className="mt-auto pt-4 border-t border-white/[0.06]">
                      <p className="text-xs text-[#4E5D6E] mb-0.5">Starting from</p>
                      <p className="text-lg font-extrabold text-white">{firstPlan.price}</p>
                      <p className="text-xs text-[#4E5D6E] mt-1">{firstPlan.note}</p>
                    </div>
                  </Link>
                )
              })}
          </div>
        </div>
      </section>

      {/* Pricing note */}
      <section className="py-10 bg-[#101827] border-t border-white/[0.04]" aria-label="Pricing notes">
        <div className="container-wide">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className="space-y-1.5 text-sm text-[#4E5D6E]">
              <p>All prices in USD.</p>
              <p>Management fees do not include ad spend.</p>
              <p>Custom scopes available — always quoted with a clear deliverable list.</p>
            </div>
            <Link
              href="/audit"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#FF5A1F] text-white text-sm font-semibold rounded-xl hover:bg-[#E54A15] transition-colors flex-shrink-0"
            >
              Get a custom quote
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <HomepageCta />
    </MarketingLayout>
  )
}

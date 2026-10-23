import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { MarketingLayout } from "@/components/marketing/marketing-layout"
import { HomepageCta } from "@/components/sections/homepage-cta"
import { services, serviceCategories } from "@/data/services"
import type { ServiceCategory } from "@/data/services"

export const metadata: Metadata = {
  title: "Services — SEO, Meta Ads, AI & WhatsApp | ClicKonversion",
  description:
    "Full-stack growth services: SEO, Local SEO, Google Ads, Meta Ads, AI agents, WhatsApp automation, chatbots, and CRM setup. One integrated system.",
  alternates: {
    canonical: "https://www.clickonversion.com/services",
  },
  openGraph: {
    title: "Services — SEO, Meta Ads, AI & WhatsApp | ClicKonversion",
    description:
      "Full-stack growth services combining SEO, paid media, AI automation, and WhatsApp Business — built to turn visibility into customers.",
    url: "https://www.clickonversion.com/services",
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

const CATEGORY_DESCRIPTIONS: Record<ServiceCategory, string> = {
  seo: "Organic search strategies that build durable visibility and qualified traffic without paying per click.",
  "paid-media": "Paid campaigns built for conversion — every dollar tracked to real business outcomes.",
  automation: "AI agents, chatbots, and workflow automation that run 24/7 without adding headcount.",
  support: "Expert setup, troubleshooting, and strategy sessions for Meta Business and WhatsApp.",
}

export default function ServicesPage() {
  const grouped = CATEGORY_ORDER.reduce<Record<ServiceCategory, typeof services>>((acc, cat) => {
    acc[cat] = services.filter((s) => s.category === cat)
    return acc
  }, {} as Record<ServiceCategory, typeof services>)

  return (
    <MarketingLayout>
      {/* Hero */}
      <section className="pt-32 pb-16 bg-[#101827]" aria-label="Services overview">
        <div className="container-wide">
          <div className="max-w-3xl">
            <p className="eyebrow text-[#4E5D6E] mb-5">What We Do</p>
            <h1 className="font-display text-[clamp(2.5rem,5vw,3.75rem)] font-extrabold text-white leading-tight mb-6">
              Full-stack growth for{" "}
              <span
                style={{
                  background: "linear-gradient(135deg, #78E6B3 0%, #7885FF 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                modern businesses.
              </span>
            </h1>
            <p className="text-[#7A8799] text-lg leading-relaxed max-w-2xl">
              Every service is part of a connected system — not an isolated tactic.
              SEO, paid media, AI automation, and WhatsApp business tools working together
              to turn your digital presence into a consistent source of customers.
            </p>
          </div>
        </div>
      </section>

      {/* Category sections */}
      {CATEGORY_ORDER.map((cat, idx) => {
        const catMeta = serviceCategories[cat]
        const catServices = grouped[cat]
        const accent = CATEGORY_ACCENT[cat]
        const bg = idx % 2 === 0 ? "bg-[#101827]" : "bg-[#151E2D]"

        return (
          <section key={cat} className={`py-20 ${bg}`} aria-label={catMeta.label}>
            <div className="container-wide">
              {/* Category header */}
              <div className="mb-12">
                <p
                  className="eyebrow mb-3"
                  style={{ color: accent }}
                >
                  {catMeta.label}
                </p>
                <div className="flex flex-col sm:flex-row sm:items-end gap-4 justify-between">
                  <h2 className="font-display text-[clamp(1.75rem,3.5vw,2.5rem)] font-bold text-white max-w-xl">
                    {catMeta.label === "SEO" && "Rank where your customers search"}
                    {catMeta.label === "Paid Media" && "Ads that generate leads, not just clicks"}
                    {catMeta.label === "AI & Automation" && "Automate the work that doesn't need humans"}
                    {catMeta.label === "Support" && "Expert help when you're stuck or scaling"}
                  </h2>
                  <p className="text-[#7A8799] text-sm max-w-sm leading-relaxed">
                    {CATEGORY_DESCRIPTIONS[cat]}
                  </p>
                </div>
              </div>

              {/* Service cards grid */}
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {catServices.map((service) => (
                  <article
                    key={service.slug}
                    className="group relative rounded-2xl p-6 border border-white/[0.07] bg-white/[0.02] hover:bg-white/[0.04] hover:border-white/[0.12] transition-all duration-200"
                  >
                    {/* Icon */}
                    <div className="text-2xl mb-4">{service.icon}</div>

                    {/* Name */}
                    <h3 className="font-display text-lg font-bold text-white mb-2">
                      {service.en.name}
                    </h3>

                    {/* Tagline */}
                    <p
                      className="text-sm font-medium mb-3"
                      style={{ color: accent }}
                    >
                      {service.en.tagline}
                    </p>

                    {/* Description */}
                    <p className="text-sm text-[#7A8799] leading-relaxed mb-5 line-clamp-3">
                      {service.en.description}
                    </p>

                    {/* CTA */}
                    <Link
                      href={`/services/${service.slug}`}
                      className="inline-flex items-center gap-1.5 text-sm font-semibold transition-all duration-150 group-hover:gap-2.5"
                      style={{ color: accent }}
                    >
                      Learn more
                      <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
                    </Link>
                  </article>
                ))}
              </div>
            </div>
          </section>
        )
      })}

      {/* Bottom CTA */}
      <HomepageCta />
    </MarketingLayout>
  )
}

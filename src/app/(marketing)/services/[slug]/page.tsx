import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowRight, Check, X } from "lucide-react"
import { MarketingLayout } from "@/components/marketing/marketing-layout"
import { HomepageCta } from "@/components/sections/homepage-cta"
import { ServiceFaq } from "@/components/sections/service-faq"
import { services, getServiceBySlug } from "@/data/services"

const ACCENT_HEX = {
  mint: "#78E6B3",
  violet: "#7885FF",
  warm: "#FFCB86",
  orange: "#FF5A1F",
} as const

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const service = getServiceBySlug(slug)
  if (!service) return {}
  const { en } = service
  return {
    title: `${en.name} — ${en.tagline} | ClicKonversion`,
    description: en.description,
    alternates: {
      canonical: `https://www.clickonversion.com/services/${slug}`,
    },
    openGraph: {
      title: `${en.name} | ClicKonversion`,
      description: en.tagline,
      url: `https://www.clickonversion.com/services/${slug}`,
      siteName: "ClicKonversion",
      locale: "en_US",
      type: "website",
    },
  }
}

export default async function ServiceSlugPage({ params }: Props) {
  const { slug } = await params
  const service = getServiceBySlug(slug)
  if (!service) notFound()

  const { en } = service
  const accent = ACCENT_HEX[service.accent]

  return (
    <MarketingLayout>
      {/* ── Hero ── */}
      <section className="pt-32 pb-20 bg-[#101827]" aria-label="Service overview">
        <div className="container-wide">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-xs text-[#4E5D6E] mb-8" aria-label="Breadcrumb">
            <Link href="/services" className="hover:text-[#A8B3C0] transition-colors">
              Services
            </Link>
            <span>/</span>
            <span className="text-[#A8B3C0]">{en.name}</span>
          </nav>

          <div className="max-w-3xl">
            {/* Icon */}
            <div className="text-4xl mb-6">{service.icon}</div>

            <h1 className="font-display text-[clamp(2.5rem,5vw,3.75rem)] font-extrabold text-white leading-tight mb-4">
              {en.name}
            </h1>

            <p
              className="text-xl font-semibold mb-5"
              style={{ color: accent }}
            >
              {en.tagline}
            </p>

            <p className="text-[#A8B3C0] text-lg leading-relaxed mb-6 max-w-2xl">
              {en.description}
            </p>

            {/* Target audience chip */}
            <div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm border mb-10"
              style={{
                color: accent,
                borderColor: `${accent}30`,
                background: `${accent}10`,
              }}
            >
              <span className="font-medium">Best for:</span>
              <span className="text-white/80">{en.targetAudience}</span>
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap gap-4">
              <Link
                href="/audit"
                className="inline-flex items-center gap-2 px-8 py-4 bg-[#FF5A1F] text-white font-semibold rounded-xl hover:bg-[#E54A15] transition-all duration-150 active:scale-[0.98] shadow-lg shadow-[#FF5A1F]/25"
              >
                Get a Free Audit
                <ArrowRight size={18} />
              </Link>
              <Link
                href="/audit"
                className="inline-flex items-center gap-2 px-8 py-4 text-[#A8B3C0] font-semibold rounded-xl border border-white/10 hover:text-white hover:border-white/20 hover:bg-white/5 transition-all duration-150"
              >
                Talk to us first
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Included / Not Included ── */}
      <section className="py-16 bg-[#151E2D]" aria-label="What's included">
        <div className="container-wide">
          <div className="grid md:grid-cols-2 gap-10">
            {/* Included */}
            <div>
              <h2 className="font-display text-xl font-bold text-white mb-6">
                What&apos;s included
              </h2>
              <ul className="space-y-3">
                {en.included.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <span
                      className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center mt-0.5"
                      style={{ background: `${accent}15`, color: accent }}
                    >
                      <Check size={12} />
                    </span>
                    <span className="text-sm text-[#A8B3C0] leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Not included */}
            <div>
              <h2 className="font-display text-xl font-bold text-white mb-6">
                Not included
              </h2>
              <ul className="space-y-3">
                {en.notIncluded.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center mt-0.5 bg-white/5 text-[#4E5D6E]">
                      <X size={12} />
                    </span>
                    <span className="text-sm text-[#7A8799] leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ── Process ── */}
      <section className="py-16 bg-[#101827]" aria-label="Our process">
        <div className="container-wide">
          <p className="eyebrow mb-3" style={{ color: accent }}>
            How it works
          </p>
          <h2 className="font-display text-[clamp(1.75rem,3.5vw,2.5rem)] font-bold text-white mb-12 max-w-lg">
            A clear process from day one.
          </h2>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {en.process.map((step) => (
              <div
                key={step.step}
                className="relative rounded-2xl p-6 border border-white/[0.07] bg-white/[0.02]"
              >
                <div
                  className="font-display text-3xl font-extrabold mb-4 leading-none"
                  style={{ color: `${accent}30` }}
                >
                  {step.step}
                </div>
                <h3 className="font-display text-base font-bold text-white mb-2">
                  {step.title}
                </h3>
                <p className="text-sm text-[#7A8799] leading-relaxed">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Plans ── */}
      <section className="py-16 bg-[#151E2D]" aria-label="Plans and pricing">
        <div className="container-wide">
          <p className="eyebrow mb-3" style={{ color: accent }}>
            Pricing
          </p>
          <h2 className="font-display text-[clamp(1.75rem,3.5vw,2.5rem)] font-bold text-white mb-12 max-w-lg">
            Transparent pricing. No surprises.
          </h2>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {en.plans.map((plan, idx) => {
              const isFirst = idx === 0
              return (
                <div
                  key={plan.name}
                  className="relative rounded-2xl p-8 border transition-all duration-200"
                  style={{
                    borderColor: isFirst ? `${accent}40` : "rgba(255,255,255,0.07)",
                    background: isFirst ? `${accent}08` : "rgba(255,255,255,0.02)",
                  }}
                >
                  {isFirst && (
                    <div
                      className="absolute top-4 right-4 text-xs font-semibold px-2.5 py-1 rounded-full"
                      style={{ background: `${accent}20`, color: accent }}
                    >
                      Most popular
                    </div>
                  )}

                  <h3 className="font-display text-xl font-bold text-white mb-2">
                    {plan.name}
                  </h3>

                  <p
                    className="text-2xl font-extrabold mb-1"
                    style={{ color: accent }}
                  >
                    {plan.price}
                  </p>

                  <p className="text-xs text-[#4E5D6E] mb-6">{plan.note}</p>

                  <ul className="space-y-2.5 mb-8">
                    {plan.features.map((feat) => (
                      <li key={feat} className="flex items-center gap-2.5">
                        <Check size={13} style={{ color: accent, flexShrink: 0 }} />
                        <span className="text-sm text-[#A8B3C0]">{feat}</span>
                      </li>
                    ))}
                  </ul>

                  <Link
                    href="/audit"
                    className="block text-center py-3 rounded-xl text-sm font-semibold transition-all duration-150 border"
                    style={{
                      borderColor: isFirst ? accent : "rgba(255,255,255,0.1)",
                      color: isFirst ? "#0B0E14" : "#A8B3C0",
                      background: isFirst ? accent : "transparent",
                    }}
                  >
                    Get started
                  </Link>
                </div>
              )
            })}
          </div>

          <p className="mt-8 text-xs text-[#4E5D6E] text-center">
            All prices in USD. Custom scopes available for larger projects — contact us for a tailored quote.
          </p>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="py-16 bg-[#101827]" aria-label="Frequently asked questions">
        <div className="container-wide">
          <p className="eyebrow mb-3 text-center" style={{ color: accent }}>
            FAQ
          </p>
          <h2 className="font-display text-[clamp(1.75rem,3.5vw,2.5rem)] font-bold text-white mb-12 text-center">
            Common questions
          </h2>

          <ServiceFaq faqs={en.faq} accentColor={accent} />

          <div className="mt-12 text-center">
            <p className="text-[#7A8799] text-sm mb-4">Have a question not answered here?</p>
            <Link
              href="/audit"
              className="inline-flex items-center gap-2 text-sm font-semibold transition-colors"
              style={{ color: accent }}
            >
              Ask us directly
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <HomepageCta />
    </MarketingLayout>
  )
}

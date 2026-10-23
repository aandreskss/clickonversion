import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { MarketingLayout } from "@/components/marketing/marketing-layout"
import { HomepageCta } from "@/components/sections/homepage-cta"

export const metadata: Metadata = {
  title: "About ClicKonversion — Growth Marketing Agency",
  description:
    "ClicKonversion is a growth marketing agency combining SEO, paid media, AI automation, and WhatsApp Business to help businesses get more customers across the US, Latin America, and Spain.",
  alternates: {
    canonical: "https://www.clickonversion.com/about",
  },
  openGraph: {
    title: "About ClicKonversion — Growth Marketing Agency",
    description:
      "We build growth systems, not campaigns. SEO, paid media, AI automation, and WhatsApp — one connected system.",
    url: "https://www.clickonversion.com/about",
    siteName: "ClicKonversion",
    locale: "en_US",
    type: "website",
  },
}

const PILLARS = [
  {
    icon: "📈",
    title: "SEO & SEM",
    description:
      "Organic search visibility that compounds over time, plus paid search campaigns built to convert — not just drive clicks.",
    accent: "#78E6B3",
  },
  {
    icon: "📱",
    title: "Meta Ads",
    description:
      "Full-funnel Facebook and Instagram campaigns built around your audience, your offer, and your actual business outcomes.",
    accent: "#FFCB86",
  },
  {
    icon: "🤖",
    title: "AI & WhatsApp",
    description:
      "AI agents, chatbots, and WhatsApp Business API setup that automate conversations and qualification without adding headcount.",
    accent: "#7885FF",
  },
  {
    icon: "⚡",
    title: "Automation",
    description:
      "Make, n8n, Zapier, and CRM integrations that connect your tools, eliminate manual work, and keep your pipeline clean.",
    accent: "#FF5A1F",
  },
]

const MARKETS = [
  { name: "United States", flag: "🇺🇸" },
  { name: "Spain", flag: "🇪🇸" },
  { name: "Mexico", flag: "🇲🇽" },
  { name: "Colombia", flag: "🇨🇴" },
  { name: "Venezuela", flag: "🇻🇪" },
  { name: "Latin America", flag: "🌎" },
]

export default function AboutPage() {
  return (
    <MarketingLayout>
      {/* ── Hero ── */}
      <section className="pt-32 pb-20 bg-[#101827]" aria-label="About ClicKonversion">
        <div className="container-wide">
          <div className="max-w-3xl">
            <p className="eyebrow text-[#4E5D6E] mb-5">About</p>
            <h1 className="font-display text-[clamp(2.5rem,5vw,3.75rem)] font-extrabold text-white leading-tight mb-6">
              We build growth systems,{" "}
              <span
                style={{
                  background: "linear-gradient(135deg, #78E6B3 0%, #7885FF 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                not campaigns.
              </span>
            </h1>
            <p className="text-[#A8B3C0] text-lg leading-relaxed max-w-2xl">
              ClicKonversion is a growth marketing agency that combines SEO, paid media,
              AI automation, and WhatsApp Business into one connected system — built to
              turn your digital presence into a consistent, measurable source of customers.
            </p>
          </div>
        </div>
      </section>

      {/* ── Mission ── */}
      <section className="py-20 bg-[#151E2D]" aria-label="Our mission">
        <div className="container-wide">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <p className="eyebrow text-[#78E6B3] mb-4">Why we exist</p>
              <h2 className="font-display text-[clamp(1.75rem,3.5vw,2.5rem)] font-bold text-white mb-6">
                Most businesses deserve better.
              </h2>
              <div className="space-y-4 text-[#A8B3C0] leading-relaxed">
                <p>
                  We started ClicKonversion because most businesses deserve better than
                  disconnected tools and agencies that can&apos;t explain what they&apos;re doing.
                </p>
                <p>
                  Too many teams are paying for SEO they can&apos;t measure, Meta Ads that burn
                  budget without clear attribution, and CRM tools nobody uses. Each vendor
                  operates in a silo, nobody owns the full picture, and the business owner
                  is left wondering why growth isn&apos;t happening.
                </p>
                <p>
                  We built ClicKonversion to be the agency we wished existed —
                  one that speaks plainly, shows its work, and builds systems
                  that keep working even after the engagement ends.
                </p>
              </div>
            </div>
            <div className="space-y-4">
              {[
                { label: "Transparent reporting", description: "You see the same data we see. No vanity metrics, no hiding underperformance." },
                { label: "Clear scope always", description: "Every engagement starts with a written scope. No ambiguity about what's included." },
                { label: "One integrated system", description: "SEO, ads, automation, and CRM designed to work together — not as separate silos." },
                { label: "Bilingual delivery", description: "We serve clients in English and Spanish without losing nuance in either." },
              ].map((item) => (
                <div
                  key={item.label}
                  className="flex gap-4 p-5 rounded-xl border border-white/[0.07] bg-white/[0.02]"
                >
                  <div
                    className="flex-shrink-0 w-2 h-2 rounded-full mt-2"
                    style={{ background: "#78E6B3" }}
                  />
                  <div>
                    <p className="font-semibold text-white text-sm mb-1">{item.label}</p>
                    <p className="text-sm text-[#7A8799] leading-relaxed">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── What we do ── */}
      <section className="py-20 bg-[#101827]" aria-label="What we do">
        <div className="container-wide">
          <p className="eyebrow text-[#4E5D6E] mb-4">What we do</p>
          <h2 className="font-display text-[clamp(1.75rem,3.5vw,2.5rem)] font-bold text-white mb-4">
            Four disciplines, one system.
          </h2>
          <p className="text-[#7A8799] text-lg mb-12 max-w-xl leading-relaxed">
            Each practice reinforces the others — your SEO generates awareness, your ads capture
            demand, your automation qualifies leads, and your CRM closes them.
          </p>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {PILLARS.map((pillar) => (
              <div
                key={pillar.title}
                className="rounded-2xl p-6 border border-white/[0.07] bg-white/[0.02]"
              >
                <div className="text-3xl mb-5">{pillar.icon}</div>
                <h3
                  className="font-display text-lg font-bold mb-3"
                  style={{ color: pillar.accent }}
                >
                  {pillar.title}
                </h3>
                <p className="text-sm text-[#7A8799] leading-relaxed">{pillar.description}</p>
              </div>
            ))}
          </div>

          <div className="mt-10 text-center">
            <Link
              href="/services"
              className="inline-flex items-center gap-2 text-sm font-semibold text-[#78E6B3] hover:text-white transition-colors"
            >
              See all services
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Markets ── */}
      <section className="py-20 bg-[#151E2D]" aria-label="Markets we serve">
        <div className="container-wide">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <p className="eyebrow text-[#FFCB86] mb-4">Markets</p>
              <h2 className="font-display text-[clamp(1.75rem,3.5vw,2.5rem)] font-bold text-white mb-5">
                We operate in English and Spanish.
              </h2>
              <p className="text-[#A8B3C0] leading-relaxed mb-6">
                Our team delivers across North America, Spain, and Latin America — with the same
                strategic depth in both languages. We understand the nuances of each market:
                search behavior, platform dynamics, and what drives conversions locally.
              </p>
              <p className="text-[#7A8799] text-sm leading-relaxed">
                Whether you&apos;re a US-based service business, a Spanish e-commerce brand,
                or a SaaS company expanding into LATAM — we adapt our approach to your market.
              </p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {MARKETS.map((market) => (
                <div
                  key={market.name}
                  className="flex items-center gap-3 p-4 rounded-xl border border-white/[0.07] bg-white/[0.02]"
                >
                  <span className="text-2xl">{market.flag}</span>
                  <span className="text-sm font-medium text-[#A8B3C0]">{market.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Founder ── */}
      <section className="py-20 bg-[#101827]" aria-label="Founder">
        <div className="container-wide">
          <div className="max-w-3xl">
            <p className="eyebrow text-[#7885FF] mb-4">The team</p>
            <h2 className="font-display text-[clamp(1.75rem,3.5vw,2.5rem)] font-bold text-white mb-8">
              Led by someone who&apos;s done the work.
            </h2>

            <div className="flex flex-col sm:flex-row gap-8 items-start">
              {/* Monogram */}
              <div
                className="flex-shrink-0 w-20 h-20 rounded-2xl flex items-center justify-center text-2xl font-extrabold font-display"
                style={{
                  background: "linear-gradient(135deg, rgba(120,133,255,0.15) 0%, rgba(120,230,179,0.10) 100%)",
                  border: "1px solid rgba(120,133,255,0.25)",
                  color: "#7885FF",
                }}
              >
                A
              </div>

              <div>
                <p className="font-display text-xl font-bold text-white mb-1">Arnaldo</p>
                <p className="text-sm text-[#7885FF] mb-4">Founder &amp; Growth Strategist</p>
                <div className="space-y-3 text-[#A8B3C0] text-sm leading-relaxed">
                  <p>
                    Arnaldo built ClicKonversion around a rare combination: deep technical SEO knowledge,
                    hands-on paid media management, and a genuine understanding of AI and automation tools
                    as they apply to real business workflows.
                  </p>
                  <p>
                    Before starting ClicKonversion, he helped businesses across multiple markets — from
                    local service businesses in the US to SaaS companies in Latin America — get visible,
                    generate leads, and build the systems to handle that growth.
                  </p>
                  <p>
                    He works directly with every client. No handoffs to junior staff,
                    no account managers between you and strategy.
                  </p>
                </div>

                <div className="flex flex-wrap gap-2 mt-5">
                  {["Technical SEO", "Meta Ads", "Google Ads", "AI Agents", "WhatsApp Business", "CRM Setup"].map((skill) => (
                    <span
                      key={skill}
                      className="text-xs px-2.5 py-1 rounded-full border border-white/[0.08] text-[#7A8799] bg-white/[0.02]"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <HomepageCta />
    </MarketingLayout>
  )
}

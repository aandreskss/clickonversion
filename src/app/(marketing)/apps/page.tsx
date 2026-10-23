import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight, Zap } from "lucide-react"
import { MarketingLayout } from "@/components/marketing/marketing-layout"
import { APPS } from "@/data/apps"

export const metadata: Metadata = {
  title: "Apps — ClicKonversion",
  description:
    "Software built by ClicKonversion to help growing businesses manage leads, automate sales, and scale faster. Purpose-built for the channels your customers use.",
  alternates: {
    canonical: "https://www.clickonversion.com/apps",
  },
  openGraph: {
    title: "Apps — ClicKonversion",
    description: "Purpose-built software for lead management and sales automation.",
    url: "https://www.clickonversion.com/apps",
    siteName: "ClicKonversion",
    locale: "en_US",
    type: "website",
  },
}

const STATUS_LABELS: Record<string, { label: string; color: string; bg: string }> = {
  live:           { label: "Live",          color: "text-[#22C55E]", bg: "bg-[#22C55E]/10" },
  beta:           { label: "Beta",          color: "text-[#7885FF]", bg: "bg-[#7885FF]/10" },
  "coming-soon":  { label: "Coming soon",   color: "text-[#7A8799]", bg: "bg-white/[0.05]" },
  waitlist:       { label: "Waitlist open", color: "text-[#FFCB86]", bg: "bg-[#FFCB86]/10" },
}

export default function AppsPage() {
  return (
    <MarketingLayout>
      {/* Hero */}
      <section className="pt-32 pb-16 bg-[#101827]" aria-label="Apps overview">
        <div className="container-wide">
          <div className="max-w-3xl">
            <p className="eyebrow text-[#4E5D6E] mb-5">ClicKonversion Apps</p>
            <h1 className="font-display text-[clamp(2.5rem,5vw,3.75rem)] font-extrabold text-white leading-tight mb-6">
              Software built for{" "}
              <span
                style={{
                  background: "linear-gradient(135deg, #7885FF 0%, #78E6B3 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                the way you sell.
              </span>
            </h1>
            <p className="text-[#7A8799] text-lg leading-relaxed max-w-xl">
              Every tool we build solves a real problem we saw in the businesses we work with.
              No fluff, no bloat — just software that helps you get and manage more customers.
            </p>
          </div>
        </div>
      </section>

      {/* Apps grid */}
      <section className="py-16 bg-[#101827]" aria-label="App catalog">
        <div className="container-wide">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {APPS.map((app) => {
              const status = STATUS_LABELS[app.status]
              return (
                <article
                  key={app.slug}
                  className="group relative rounded-2xl p-8 border transition-all duration-300 hover:scale-[1.01]"
                  style={{
                    background: app.accentMuted,
                    borderColor: app.accentBorder,
                  }}
                >
                  {/* Icon */}
                  <div
                    className="w-14 h-14 rounded-xl flex items-center justify-center mb-5"
                    style={{ background: app.accentMuted, border: `1px solid ${app.accentBorder}` }}
                  >
                    <AppIcon slug={app.icon} color={app.accent} />
                  </div>

                  {/* Status */}
                  <div className="flex items-center gap-2 mb-4">
                    <span
                      className={`text-xs font-semibold px-2.5 py-1 rounded-full ${status.color} ${status.bg}`}
                    >
                      {status.label}
                    </span>
                    {app.includedWithServices && (
                      <span className="text-xs text-[#4E5D6E] bg-white/[0.04] px-2.5 py-1 rounded-full">
                        Included with services
                      </span>
                    )}
                  </div>

                  <p className="eyebrow mb-2" style={{ color: app.accent }}>
                    {app.category}
                  </p>

                  <h2 className="font-display text-xl font-bold text-white mb-3">
                    {app.name}
                  </h2>

                  <p className="text-sm text-[#7A8799] leading-relaxed mb-6">
                    {app.description}
                  </p>

                  {/* Feature pills */}
                  <div className="flex flex-wrap gap-2 mb-8">
                    {app.features.slice(0, 4).map((f) => (
                      <span
                        key={f.title}
                        className="text-xs px-2.5 py-1 rounded-full font-medium"
                        style={{
                          background: app.accentMuted,
                          color: app.accent,
                          border: `1px solid ${app.accentBorder}`,
                        }}
                      >
                        {f.title.split(" ").slice(0, 3).join(" ")}
                      </span>
                    ))}
                  </div>

                  <Link
                    href={`/apps/${app.slug}`}
                    className="inline-flex items-center gap-1.5 text-sm font-semibold transition-colors"
                    style={{ color: app.accent }}
                  >
                    Learn more
                    <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
                  </Link>
                </article>
              )
            })}

            {/* Coming soon placeholder */}
            <div className="rounded-2xl p-8 border border-dashed border-white/[0.06] bg-white/[0.01] flex flex-col items-start justify-between">
              <div className="w-14 h-14 rounded-xl flex items-center justify-center mb-5 bg-white/[0.03] border border-white/[0.06]">
                <Zap size={24} className="text-[#4E5D6E]" />
              </div>
              <div>
                <p className="text-xs text-[#4E5D6E] mb-2">More coming</p>
                <h2 className="font-display text-lg font-bold text-white mb-2">Next product</h2>
                <p className="text-sm text-[#4E5D6E] leading-relaxed">
                  We ship new tools when we solve a problem our clients keep running into.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Built alongside services */}
      <section className="py-20 bg-[#0D1420] border-t border-white/[0.06]" aria-label="Apps and services connection">
        <div className="container-wide">
          <div className="max-w-2xl mx-auto text-center">
            <p className="eyebrow text-[#4E5D6E] mb-4">Not separate products</p>
            <h2 className="font-display text-[clamp(1.75rem,3.5vw,2.5rem)] font-bold text-white mb-5">
              Our apps are built alongside our services.
            </h2>
            <p className="text-[#7A8799] leading-relaxed mb-10">
              Every tool we publish started as something we built to serve our clients better.
              When you work with ClicKonversion, you get access to the same software
              our own team uses — without paying for it separately.
            </p>
            <Link
              href="/audit"
              className="inline-flex items-center gap-2 px-8 py-4 bg-[#FF5A1F] text-white font-semibold rounded-xl hover:bg-[#E54A15] transition-colors text-sm"
            >
              Get a Free Growth Audit
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>
    </MarketingLayout>
  )
}

function AppIcon({ slug, color }: { slug: string; color: string }) {
  if (slug === "synclead") {
    return (
      <svg width="26" height="26" viewBox="0 0 26 26" fill="none">
        <path d="M3 19V13a10 10 0 0120 0v6" stroke={color} strokeWidth="1.75" strokeLinecap="round"/>
        <path d="M2 11h3a1 1 0 011 1v3a1 1 0 01-1 1H3a1 1 0 01-1-1v-3zm18 0h3a1 1 0 011 1v3a1 1 0 01-1 1h-2a1 1 0 01-1-1v-3z" fill={color} opacity=".5"/>
        <circle cx="13" cy="8" r="2" fill={color} opacity=".7"/>
        <path d="M10 13h6" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    )
  }
  return <Zap size={24} style={{ color }} />
}

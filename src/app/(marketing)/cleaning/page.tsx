"use client"

import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { MarketingLayout } from "@/components/marketing/marketing-layout"
import { analytics } from "@/lib/analytics"

const PROBLEMS = [
  {
    tag: "Visibility",
    title: "People search, but competitors show first.",
    body: "If your business isn't visible in Google Maps or organic results, you're invisible to people ready to book right now.",
  },
  {
    tag: "Conversion",
    title: "Ads generate clicks but not enough inquiries.",
    body: "Paid traffic is expensive. Without the right landing experience, clicks don't turn into cleaning requests.",
  },
  {
    tag: "Website",
    title: "Visitors leave without reaching out.",
    body: "Unclear calls to action, slow load times or weak trust signals make potential customers hesitate — and leave.",
  },
  {
    tag: "Follow-up",
    title: "Leads arrive but follow-up is inconsistent.",
    body: "A slow or scattered response process loses qualified leads to competitors who reply faster.",
  },
  {
    tag: "Attribution",
    title: "Nobody knows which channel created the customer.",
    body: "Without proper attribution, there's no clear answer for what's worth investing in and what's wasted budget.",
  },
]

const FLOW_STEPS = [
  { label: "Search",            detail: '"house cleaning near me" or "deep cleaning [city]"' },
  { label: "Visit",             detail: "They find your website or Google Business Profile"   },
  { label: "Cleaning Inquiry",  detail: "They request a quote, call or fill out a form"       },
  { label: "Follow-up",         detail: "You respond fast and book the appointment"           },
  { label: "Booked Customer",   detail: "New recurring or one-time cleaning client"           },
]

const WHAT_WE_IMPROVE = [
  {
    title: "Get found in local search",
    body: "Optimize your Google Business Profile, build a clear service-page structure and fix technical issues that prevent Google from showing your business when people search for cleaning services.",
  },
  {
    title: "Run Google Ads that actually convert",
    body: "Set up and manage search campaigns with the right keywords and landing pages — so you pay for qualified leads, not just clicks from people browsing.",
  },
  {
    title: "Turn more visitors into inquiries",
    body: "Improve your calls to action, quote forms and page messaging so more people who land on your site actually reach out instead of leaving.",
  },
  {
    title: "Follow up before leads go cold",
    body: "Create a simple lead-response structure so no inquiry gets left behind during a busy week. Speed and consistency matter more than most cleaning companies realize.",
  },
  {
    title: "Track what actually creates customers",
    body: "Set up proper attribution so you know which channel, page or campaign is generating real cleaning bookings — not just website sessions.",
  },
]

function CtaButton({ location, label = "Get a Free Growth Audit" }: { location: string; label?: string }) {
  return (
    <Link
      href="/audit"
      onClick={() => analytics.cleaningCtaClick(location)}
      className="inline-flex items-center gap-2 px-7 py-4 bg-[#FF5A1F] text-white font-semibold rounded-lg hover:bg-[#E54A15] transition-colors duration-150 active:scale-[0.98] text-base"
    >
      {label}
      <ArrowRight size={18} />
    </Link>
  )
}

export default function CleaningPage() {
  return (
    <MarketingLayout>

      {/* ── Hero ──────────────────────────────────────────────────────── */}
      <section className="relative section-dark min-h-[80vh] flex items-center pt-28 pb-20 overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
          aria-hidden="true"
        />
        <div
          className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full opacity-[0.06] blur-3xl pointer-events-none"
          style={{ background: "radial-gradient(circle, #FF5A1F, transparent 70%)" }}
          aria-hidden="true"
        />

        <div className="container-wide relative z-10">
          <div className="max-w-3xl flex flex-col gap-8">
            <p className="text-xs font-semibold tracking-widest text-[#FF5A1F] uppercase">
              Growth Systems for Cleaning Companies
            </p>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.1] tracking-tight">
              <span className="text-white">Turn local search into </span>
              <span
                style={{
                  background: "linear-gradient(135deg, #FF5A1F 0%, #FF8A50 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                more cleaning leads.
              </span>
            </h1>
            <p className="text-lg text-[#8A9099] leading-relaxed max-w-2xl">
              ClicKonversion helps cleaning companies improve Google visibility, paid acquisition,
              website conversion and lead follow-up — while tracking what actually generates
              cleaning customers.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 items-start">
              <CtaButton location="hero" />
            </div>
            <p className="text-sm text-[#3D4A5C]">
              See the opportunities before deciding whether to work with us.
            </p>
          </div>
        </div>
      </section>

      {/* ── Problems ──────────────────────────────────────────────────── */}
      <section className="section-surface py-24 lg:py-32">
        <div className="container-wide">
          <div className="max-w-2xl mb-12">
            <p className="text-xs font-semibold tracking-widest text-[#FF5A1F] uppercase mb-4">
              Where Customers Are Lost
            </p>
            <h2 className="text-4xl lg:text-5xl font-bold text-white leading-tight mb-4">
              Where most cleaning businesses lose customers before they ever call.
            </h2>
            <p className="text-lg text-[#8A9099] leading-relaxed">
              These problems are fixable — but they require looking at the full acquisition system,
              not just running ads or doing SEO in isolation.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {PROBLEMS.map((p) => (
              <div
                key={p.title}
                className="rounded-2xl border border-white/8 bg-[#0B0D0F] p-6 hover:border-white/15 transition-colors duration-200"
              >
                <span
                  className="inline-block text-xs font-bold px-2.5 py-1 rounded-md mb-4"
                  style={{ backgroundColor: "rgba(255,90,31,0.1)", color: "#FF5A1F", border: "1px solid rgba(255,90,31,0.2)" }}
                >
                  {p.tag}
                </span>
                <h3 className="text-sm font-bold text-white mb-2">{p.title}</h3>
                <p className="text-sm text-[#546072] leading-relaxed">{p.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── System flow ───────────────────────────────────────────────── */}
      <section className="section-dark py-24 lg:py-32">
        <div className="container-wide">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="flex flex-col gap-6">
              <div>
                <p className="text-xs font-semibold tracking-widest text-[#FF5A1F] uppercase mb-4">
                  The System
                </p>
                <h2 className="text-4xl lg:text-5xl font-bold text-white leading-tight mb-4">
                  From search to booked customer.
                </h2>
                <p className="text-lg text-[#8A9099] leading-relaxed">
                  A cleaning customer&apos;s journey starts with a Google search. ClicKonversion
                  improves every step between that search and a booked appointment.
                </p>
              </div>
              <CtaButton location="system-section" />
            </div>

            <div className="rounded-2xl border border-white/8 bg-[#14171A] p-8">
              <p className="text-xs font-semibold tracking-wider text-[#546072] uppercase mb-6">
                The Growth Journey
              </p>
              <div className="flex flex-col gap-0">
                {FLOW_STEPS.map((step, i) => (
                  <div key={step.label} className="flex items-start gap-4">
                    <div className="flex flex-col items-center flex-shrink-0">
                      <div
                        className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold"
                        style={{
                          background: i === FLOW_STEPS.length - 1
                            ? "linear-gradient(135deg, #FF5A1F, #FF8A50)"
                            : "rgba(255,90,31,0.12)",
                          color:  i === FLOW_STEPS.length - 1 ? "white" : "#FF5A1F",
                          border: i === FLOW_STEPS.length - 1 ? "none" : "1px solid rgba(255,90,31,0.25)",
                        }}
                      >
                        {String(i + 1).padStart(2, "0")}
                      </div>
                      {i < FLOW_STEPS.length - 1 && (
                        <div className="w-px h-8 bg-white/8 mt-1" aria-hidden="true" />
                      )}
                    </div>
                    <div className="pb-5">
                      <p className="text-sm font-bold text-white">{step.label}</p>
                      <p className="text-xs text-[#546072] mt-0.5">{step.detail}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── What we improve ───────────────────────────────────────────── */}
      <section className="section-surface py-24 lg:py-32">
        <div className="container-wide">
          <div className="max-w-2xl mb-12">
            <p className="text-xs font-semibold tracking-widest text-[#FF5A1F] uppercase mb-4">
              What We Improve
            </p>
            <h2 className="text-4xl lg:text-5xl font-bold text-white leading-tight mb-4">
              Practical work across the full acquisition system.
            </h2>
            <p className="text-lg text-[#8A9099] leading-relaxed">
              We start with a Growth Audit to identify where your system is leaking — then
              prioritize the areas most likely to create meaningful improvement.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
            {WHAT_WE_IMPROVE.map((item, i) => (
              <div
                key={item.title}
                className="rounded-2xl border border-white/8 bg-[#0B0D0F] p-6 hover:border-white/15 transition-colors duration-200"
              >
                <span className="text-xs font-bold text-[#3D4A5C] mb-4 block">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="text-sm font-bold text-white mb-2">{item.title}</h3>
                <p className="text-sm text-[#546072] leading-relaxed">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Final CTA ─────────────────────────────────────────────────── */}
      <section className="section-dark py-24 lg:py-32">
        <div className="container-tight">
          <div className="rounded-3xl border border-[#FF5A1F]/20 bg-[#14171A] p-10 lg:p-16 text-center relative overflow-hidden">
            <div
              className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-48 blur-3xl pointer-events-none"
              style={{ background: "radial-gradient(ellipse, rgba(255,90,31,0.08), transparent 70%)" }}
              aria-hidden="true"
            />
            <div className="relative z-10">
              <p className="text-xs font-semibold tracking-widest text-[#FF5A1F] uppercase mb-6">
                Free Growth Audit
              </p>
              <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4 leading-tight">
                Find out where your cleaning business is losing customers before they call.
              </h2>
              <p className="text-lg text-[#8A9099] max-w-xl mx-auto leading-relaxed mb-10">
                We review your search visibility, website, paid acquisition and lead follow-up —
                then show you the highest-value opportunities. No obligation. No pitch deck on the first call.
              </p>
              <CtaButton location="final-cta" label="Get My Free Growth Audit" />
              <div className="flex items-center justify-center gap-6 mt-6 flex-wrap">
                {["No obligation", "Founder-led review", "Response within one business day"].map((item) => (
                  <span key={item} className="text-xs text-[#3D4A5C] flex items-center gap-1.5">
                    <span className="w-1 h-1 rounded-full bg-[#3D4A5C] inline-block" aria-hidden="true" />
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

    </MarketingLayout>
  )
}

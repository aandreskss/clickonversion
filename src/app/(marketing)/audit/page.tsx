import type { Metadata } from "next"
import { MarketingLayout } from "@/components/marketing/marketing-layout"
import { AuditForm }       from "@/components/forms/audit-form"

export const metadata: Metadata = {
  title: "Get a Free Growth Audit",
  description:
    "Find out where your website and marketing system are losing customers. Request your free Growth Audit — we look at search, conversion, acquisition and follow-up.",
}

const VALUE_PROPS = [
  {
    title: "Search visibility",
    body: "We check where you rank for the searches your ideal customers are making — and what's keeping you from showing up.",
  },
  {
    title: "Website & conversion path",
    body: "We review how well your site turns visitors into leads: messaging, calls to action, page speed, and trust signals.",
  },
  {
    title: "Acquisition setup",
    body: "We evaluate your Google Ads, Local Services setup, and any paid channels — what's working, what's wasted spend.",
  },
  {
    title: "Follow-up & CRM",
    body: "We look at what happens after someone reaches out — how fast you respond and how many leads slip through.",
  },
  {
    title: "Tracking & attribution",
    body: "We confirm you can actually tell where your leads come from so decisions are based on data, not guesses.",
  },
]

export default function AuditPage() {
  return (
    <MarketingLayout>
      <section className="section-dark min-h-screen py-24 pt-32">
        <div className="container-wide">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start max-w-6xl mx-auto">

            {/* Left — value props */}
            <div className="lg:sticky lg:top-32">
              <p className="text-xs font-semibold tracking-widest text-[#FF5A1F] uppercase mb-4">
                Free Growth Audit
              </p>
              <h1 className="text-4xl lg:text-5xl font-bold text-white mb-5 leading-tight">
                Find out where your
                <br />
                growth system is leaking.
              </h1>
              <p className="text-lg text-[#8A9099] leading-relaxed mb-10">
                No pitch decks on the first call. We look at your actual setup and tell you what
                the biggest opportunities are — then you decide if you want our help.
              </p>

              <p className="text-xs font-semibold tracking-widest text-[#546072] uppercase mb-5">
                Your audit will cover
              </p>
              <div className="flex flex-col gap-4">
                {VALUE_PROPS.map((vp) => (
                  <div key={vp.title} className="flex items-start gap-3">
                    <div
                      className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                      style={{ background: "rgba(255,90,31,0.12)", border: "1px solid rgba(255,90,31,0.25)" }}
                      aria-hidden="true"
                    >
                      <svg width="9" height="7" viewBox="0 0 9 7" fill="none">
                        <path d="M1 3.5L3.5 6L8 1" stroke="#FF5A1F" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                    <div>
                      <span className="text-sm font-semibold text-white">{vp.title}</span>
                      <p className="text-sm text-[#546072] leading-relaxed mt-0.5">{vp.body}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-[#22C55E]" aria-hidden="true" />
                <span className="text-xs text-[#546072]">
                  We&apos;ll reach out within one business day.
                </span>
              </div>
            </div>

            {/* Right — form */}
            <div>
              <AuditForm />
            </div>
          </div>
        </div>
      </section>
    </MarketingLayout>
  )
}

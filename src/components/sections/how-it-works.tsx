import Link from "next/link"
import { ArrowRight } from "lucide-react"

const STEPS = [
  {
    step: "01",
    title: "Free Growth Audit",
    description:
      "We analyze your search rankings, Meta Ads account, WhatsApp setup, and automation stack to find exactly where growth is being lost. No templates — real analysis of your business.",
    accent: "#78E6B3",
    duration: "45 minutes",
  },
  {
    step: "02",
    title: "Custom Roadmap",
    description:
      "You receive a prioritized action plan — which channels to activate first, which automations to deploy, what to fix in Meta, and what SEO opportunities exist in your market.",
    accent: "#7885FF",
    duration: "48 hours after call",
  },
  {
    step: "03",
    title: "Implementation",
    description:
      "We execute the strategy — SEO, Google Ads, Meta campaigns, WhatsApp Business setup, AI chatbots, AI agents, and workflow automations. Fully managed or alongside your team.",
    accent: "#FFCB86",
    duration: "Ongoing",
  },
  {
    step: "04",
    title: "Measure & Scale",
    description:
      "Monthly reporting with clear metrics tied to leads, conversations, and revenue. What works gets more investment. What doesn't gets cut or adjusted. The system compounds.",
    accent: "#FF5A1F",
    duration: "Monthly reviews",
  },
]

export function HowItWorks() {
  return (
    <section className="py-24 bg-[#101827]" aria-label="How it works">
      <div className="container-wide">
        <div className="text-center mb-16">
          <p className="eyebrow text-[#4E5D6E] mb-4">The process</p>
          <h2 className="font-display text-[clamp(2rem,4vw,3rem)] font-bold text-white mb-4">
            From audit to growth in 4 steps
          </h2>
          <p className="text-[#7A8799] max-w-lg mx-auto">
            Simple, transparent, and designed to show results fast. No 6-month onboarding,
            no unclear deliverables.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {STEPS.map((s, i) => (
            <div key={s.step} className="relative">
              {/* Connector line */}
              {i < STEPS.length - 1 && (
                <div
                  className="absolute top-8 left-[calc(100%+0.5rem)] w-[calc(100%-1rem)] h-px hidden lg:block"
                  style={{ background: "linear-gradient(to right, rgba(255,255,255,0.08), transparent)" }}
                />
              )}

              <div className="card-midnight p-7 h-full flex flex-col">
                {/* Step number */}
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-5 font-display text-sm font-bold"
                  style={{
                    background: `${s.accent}15`,
                    color: s.accent,
                    border: `1px solid ${s.accent}30`,
                  }}
                >
                  {s.step}
                </div>

                <h3 className="font-display text-lg font-bold text-white mb-3">
                  {s.title}
                </h3>

                <p className="text-sm text-[#7A8799] leading-relaxed flex-1 mb-4">
                  {s.description}
                </p>

                <span className="text-xs font-medium" style={{ color: s.accent }}>
                  {s.duration}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center">
          <Link
            href="/audit"
            className="inline-flex items-center gap-2 px-8 py-4 bg-[#FF5A1F] text-white font-semibold rounded-xl hover:bg-[#E54A15] transition-colors shadow-lg shadow-[#FF5A1F]/20 text-base"
          >
            Start with a Free Audit
            <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </section>
  )
}

"use client"

import Link from "next/link"
import { ArrowRight, TrendingUp, Users, DollarSign, Search } from "lucide-react"
import { analytics } from "@/lib/analytics"

const FLOW_STEPS = [
  { label: "Search",      sub: "Someone needs your service" },
  { label: "Visit",       sub: "They find your site"        },
  { label: "Lead",        sub: "They reach out"             },
  { label: "Follow-up",   sub: "You respond fast"           },
  { label: "Customer",    sub: "Deal closed"                },
]

const SAMPLE_METRICS = [
  { icon: Search,    label: "Search Visibility",  value: "+18%",  note: "90 days" },
  { icon: Users,     label: "Qualified Leads",    value: "24/mo", note: "avg"     },
  { icon: TrendingUp,label: "Conversion Rate",    value: "3.8%",  note: "site"    },
  { icon: DollarSign,label: "Pipeline",           value: "$18.4K",note: "active"  },
]

export function Hero() {
  return (
    <section
      className="relative min-h-screen flex items-center pt-24 pb-20 overflow-hidden"
      aria-label="Hero"
    >
      {/* Background grid */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
        aria-hidden="true"
      />
      {/* Brand glow */}
      <div
        className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-[0.07] blur-3xl pointer-events-none"
        style={{ background: "radial-gradient(circle, #FF5A1F, transparent 70%)" }}
        aria-hidden="true"
      />

      <div className="container-wide relative z-10 grid lg:grid-cols-2 gap-16 items-center">

        {/* Left — copy */}
        <div className="flex flex-col gap-8 animate-fade-in-up">
          {/* Eyebrow */}
          <p className="text-xs font-semibold tracking-widest text-[#FF5A1F] uppercase">
            Growth Systems for Service Businesses
          </p>

          {/* Headline */}
          <div className="flex flex-col gap-3">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.1] tracking-tight text-white">
              More than traffic.
            </h1>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.1] tracking-tight">
              <span className="text-[#F7F7F3]">Build a system that turns </span>
              <span
                className="inline-block"
                style={{
                  background: "linear-gradient(135deg, #FF5A1F 0%, #FF8A50 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                attention into customers.
              </span>
            </h2>
          </div>

          {/* Subheadline */}
          <p className="text-lg text-[#8A9099] max-w-xl leading-relaxed">
            ClicKonversion combines search, paid acquisition, conversion strategy and smarter follow-up to help service businesses generate measurable growth.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              href="/audit"
              onClick={() => analytics.primaryCtaClick("hero")}
              className="inline-flex items-center justify-center gap-2 px-7 py-4 bg-[#FF5A1F] text-white font-semibold rounded-lg hover:bg-[#E54A15] transition-colors duration-150 active:scale-[0.98] text-base"
            >
              Get a Growth Audit
              <ArrowRight size={18} />
            </Link>
            <a
              href="#system"
              onClick={() => analytics.serviceCtaClick("system", "hero")}
              className="inline-flex items-center justify-center gap-2 px-7 py-4 text-[#B0B8C1] font-semibold rounded-lg border border-white/12 hover:bg-white/5 hover:text-white transition-all duration-150 text-base"
            >
              See the System
            </a>
          </div>

          {/* Trust tags */}
          <div className="flex flex-wrap gap-2">
            {["SEO", "Paid Acquisition", "CRO", "Analytics", "Follow-up"].map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 text-xs font-medium text-[#546072] border border-white/8 rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Right — system visualization */}
        <div className="relative flex flex-col gap-4 animate-fade-in-up" style={{ animationDelay: "0.15s" }}>
          {/* System flow card */}
          <div className="rounded-2xl border border-white/8 bg-[#14171A] p-6">
            <p className="text-xs font-semibold tracking-wider text-[#546072] uppercase mb-5">
              Example Growth System
            </p>
            <div className="flex flex-col gap-0">
              {FLOW_STEPS.map((step, i) => (
                <div key={step.label} className="flex items-start gap-4">
                  <div className="flex flex-col items-center">
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                      style={{
                        background: i === FLOW_STEPS.length - 1
                          ? "linear-gradient(135deg, #FF5A1F, #FF8A50)"
                          : "rgba(255,90,31,0.12)",
                        color: i === FLOW_STEPS.length - 1 ? "white" : "#FF5A1F",
                        border: i === FLOW_STEPS.length - 1 ? "none" : "1px solid rgba(255,90,31,0.25)",
                      }}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </div>
                    {i < FLOW_STEPS.length - 1 && (
                      <div className="w-px h-8 bg-white/8 mt-1" />
                    )}
                  </div>
                  <div className="pb-4">
                    <p className="text-sm font-semibold text-white leading-none mb-0.5">{step.label}</p>
                    <p className="text-xs text-[#546072]">{step.sub}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Metric cards */}
          <div className="grid grid-cols-2 gap-3">
            {SAMPLE_METRICS.map((m) => {
              const Icon = m.icon
              return (
                <div
                  key={m.label}
                  className="rounded-xl border border-white/8 bg-[#14171A] p-4"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <div className="p-1.5 rounded-md bg-[#FF5A1F]/10">
                      <Icon size={13} className="text-[#FF5A1F]" />
                    </div>
                    <span className="text-xs text-[#546072]">{m.note}</span>
                  </div>
                  <p className="text-xl font-bold text-white">{m.value}</p>
                  <p className="text-xs text-[#546072] mt-0.5">{m.label}</p>
                </div>
              )
            })}
          </div>
          <p className="text-xs text-[#3D4A5C] text-center">
            Sample data — for illustration only
          </p>
        </div>
      </div>
    </section>
  )
}

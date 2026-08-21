"use client"

import Link from "next/link"
import { ArrowRight, AlertCircle } from "lucide-react"
import { analytics } from "@/lib/analytics"

const SCORES = [
  { label: "Local Search",        score: 62, color: "#FF8A50" },
  { label: "Conversion",          score: 48, color: "#FF6B35" },
  { label: "Tracking & Attribution", score: 35, color: "#FF5A1F" },
]

const OPPORTUNITIES = [
  { impact: "High",   effort: "Low",    text: "Missing high-intent service pages" },
  { impact: "High",   effort: "Low",    text: "Conversion path has unnecessary friction" },
  { impact: "High",   effort: "Medium", text: "Weak local landing-page structure" },
  { impact: "Medium", effort: "Low",    text: "Lead attribution is incomplete" },
  { impact: "High",   effort: "High",   text: "Follow-up process is disconnected from leads" },
]

const PRIORITY_FIRST = OPPORTUNITIES.filter(
  (o) => o.impact === "High" && o.effort !== "High"
)
const PRIORITY_LATER = OPPORTUNITIES.filter((o) => o.effort === "High")

export function AuditExampleSection() {
  return (
    <section className="section-dark py-24 lg:py-32">
      <div className="container-wide">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <p className="text-xs font-semibold tracking-widest text-[#FF5A1F] uppercase mb-4">
            Growth Audit
          </p>
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-5 leading-tight">
            See what your audit looks like.
          </h2>
          <p className="text-lg text-[#8A9099]">
            A real audit identifies what&apos;s limiting your growth and ranks what to fix first.
            Here&apos;s an example of the kind of findings it includes.
          </p>
        </div>

        {/* Disclaimer badge */}
        <div className="flex justify-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/20">
            <AlertCircle size={14} className="text-amber-400" aria-hidden="true" />
            <span className="text-xs font-semibold text-amber-400">
              Example only — Sunrise Cleaning Co. · Fictional demonstration
            </span>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 max-w-5xl mx-auto">

          {/* Left — Scores + Opportunities */}
          <div className="rounded-2xl border border-white/8 bg-[#0B0D0F] p-8">
            <p className="text-xs font-semibold tracking-wider text-[#3D4A5C] uppercase mb-6">
              Audit Scores
            </p>
            <div className="flex flex-col gap-6 mb-8">
              {SCORES.map((item) => (
                <div key={item.label}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold text-white">{item.label}</span>
                    <span className="text-sm font-bold tabular-nums" style={{ color: item.color }}>
                      {item.score}
                      <span className="text-xs text-[#3D4A5C] font-normal"> / 100</span>
                    </span>
                  </div>
                  <div className="h-2 rounded-full bg-white/5 overflow-hidden" role="progressbar" aria-valuenow={item.score} aria-valuemin={0} aria-valuemax={100} aria-label={`${item.label}: ${item.score} out of 100`}>
                    <div
                      className="h-full rounded-full"
                      style={{ width: `${item.score}%`, backgroundColor: item.color }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-6 border-t border-white/6">
              <p className="text-xs font-semibold tracking-wider text-[#3D4A5C] uppercase mb-4">
                Opportunities Identified
              </p>
              <div className="flex flex-col gap-3">
                {OPPORTUNITIES.map((opp, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <span className="text-xs font-bold text-[#FF5A1F] w-4 flex-shrink-0 mt-0.5">{i + 1}.</span>
                    <span className="text-sm text-[#8A9099] flex-1">{opp.text}</span>
                    <span
                      className="text-xs font-semibold px-2 py-0.5 rounded flex-shrink-0"
                      style={{
                        backgroundColor: opp.impact === "High" ? "rgba(239,68,68,0.1)" : "rgba(245,158,11,0.1)",
                        color: opp.impact === "High" ? "#F87171" : "#FCD34D",
                      }}
                    >
                      {opp.impact}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right — Priority + CTA */}
          <div className="flex flex-col gap-5">
            <div className="rounded-2xl border border-white/8 bg-[#0B0D0F] p-8 flex-1">
              <p className="text-xs font-semibold tracking-wider text-[#3D4A5C] uppercase mb-5">
                Priority — Fix First
              </p>
              <div className="flex flex-col gap-3 mb-6">
                {PRIORITY_FIRST.map((opp, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-3 p-4 rounded-xl border border-[#FF5A1F]/15 bg-[#FF5A1F]/5"
                  >
                    <div className="w-5 h-5 rounded-full bg-[#FF5A1F] flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs font-bold text-white">{i + 1}</span>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white">{opp.text}</p>
                      <p className="text-xs text-[#546072] mt-0.5">
                        High impact · {opp.effort} effort
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <p className="text-xs font-semibold tracking-wider text-[#3D4A5C] uppercase mb-3">
                Phase Two
              </p>
              <div className="flex flex-col gap-2.5">
                {PRIORITY_LATER.map((opp, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-3 p-3.5 rounded-xl border border-white/6 bg-white/[0.02]"
                  >
                    <div className="w-5 h-5 rounded-full border border-white/15 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs font-bold text-[#3D4A5C]">{PRIORITY_FIRST.length + i + 1}</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-[#546072]">{opp.text}</p>
                      <p className="text-xs text-[#3D4A5C] mt-0.5">
                        High impact · {opp.effort} effort
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Inline CTA */}
            <div className="rounded-2xl border border-[#FF5A1F]/20 bg-[#14171A] p-6 text-center">
              <p className="text-sm font-semibold text-white mb-1">Get this for your business.</p>
              <p className="text-xs text-[#546072] mb-5">
                Personalized findings. Not an automated report.
              </p>
              <Link
                href="/audit"
                onClick={() => analytics.primaryCtaClick("audit-example")}
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#FF5A1F] text-white font-semibold rounded-lg hover:bg-[#E54A15] transition-colors duration-150 active:scale-[0.98] text-sm"
              >
                Get My Free Growth Audit
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

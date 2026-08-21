"use client"

import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { analytics } from "@/lib/analytics"

const STEPS = [
  {
    number: "01",
    title: "Audit",
    description:
      "We look at your search visibility, website, conversion path, paid acquisition, and tracking setup to understand what's working and what isn't.",
  },
  {
    number: "02",
    title: "Prioritize",
    description:
      "Based on the audit, we identify the highest-value growth opportunities — ranked by impact and feasibility, not by what's easiest to sell.",
  },
  {
    number: "03",
    title: "Build",
    description:
      "We implement the strategy. SEO, campaigns, landing pages, CRM structure, tracking — executed as one connected system.",
  },
  {
    number: "04",
    title: "Measure",
    description:
      "We connect marketing activity to actual leads and pipeline. You see what's generating customers, not just what's generating reports.",
  },
]

export function ProcessSection() {
  return (
    <section id="process" className="section-surface py-24 lg:py-32">
      <div className="container-wide">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <p className="text-xs font-semibold tracking-widest text-[#FF5A1F] uppercase mb-4">
            How It Works
          </p>
          <h2 className="text-4xl lg:text-5xl font-bold text-white leading-tight mb-6">
            Audit → Prioritize → Build → Measure
          </h2>
          <p className="text-lg text-[#8A9099]">
            A clear process that starts with understanding and ends with measurable results.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {STEPS.map((step, i) => (
            <div key={step.number} className="relative">
              {/* Connector line */}
              {i < STEPS.length - 1 && (
                <div
                  className="hidden lg:block absolute top-8 left-full w-full h-px z-0"
                  style={{ background: "linear-gradient(90deg, rgba(255,90,31,0.3), rgba(255,90,31,0.05))" }}
                  aria-hidden="true"
                />
              )}
              <div className="relative z-10 rounded-2xl border border-white/8 bg-[#0B0D0F] p-6 h-full hover:border-white/15 transition-colors duration-200">
                <span
                  className="text-4xl font-bold block mb-4"
                  style={{
                    background: "linear-gradient(135deg, #FF5A1F, #FF8A50)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  {step.number}
                </span>
                <h3 className="text-lg font-bold text-white mb-3">{step.title}</h3>
                <p className="text-sm text-[#546072] leading-relaxed">{step.description}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center">
          <Link
            href="/audit"
            onClick={() => analytics.primaryCtaClick("process-section")}
            className="inline-flex items-center gap-2 px-8 py-4 bg-[#FF5A1F] text-white font-semibold rounded-lg hover:bg-[#E54A15] transition-colors duration-150 active:scale-[0.98] text-base"
          >
            Get a Free Growth Audit
            <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </section>
  )
}

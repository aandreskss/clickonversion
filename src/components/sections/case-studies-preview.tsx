import Link from "next/link"
import { ArrowRight } from "lucide-react"

const INDUSTRIES = [
  { label: "E-commerce", color: "#78E6B3" },
  { label: "Professional Services", color: "#7885FF" },
  { label: "Healthcare / Clinics", color: "#FFCB86" },
  { label: "Real Estate", color: "#FF5A1F" },
]

export function CaseStudiesPreview() {
  return (
    <section className="py-24 bg-[#101827]" aria-label="Case studies">
      <div className="container-wide">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-16">
          <div>
            <p className="eyebrow text-[#4E5D6E] mb-4">Results</p>
            <h2 className="font-display text-[clamp(2rem,4vw,3rem)] font-bold text-white">
              Built for growth.<br />
              <span style={{ color: "#78E6B3" }}>Proven by results.</span>
            </h2>
          </div>
          <Link
            href="/case-studies"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#78E6B3] hover:text-white transition-colors shrink-0"
          >
            All case studies
            <ArrowRight size={14} />
          </Link>
        </div>

        {/* Industry filter chips */}
        <div className="flex flex-wrap gap-2 mb-10">
          {INDUSTRIES.map((ind) => (
            <span
              key={ind.label}
              className="text-xs px-3 py-1.5 rounded-full font-medium border"
              style={{
                color: ind.color,
                borderColor: `${ind.color}30`,
                background: `${ind.color}10`,
              }}
            >
              {ind.label}
            </span>
          ))}
        </div>

        {/* Placeholder cards — real case studies will populate this grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-10">
          {[
            {
              accent: "#78E6B3",
              industry: "E-commerce",
              region: "Latin America",
              teaser: "How a regional fashion brand doubled organic traffic in 6 months through a full-funnel SEO + automation strategy.",
              metrics: [
                { label: "Organic traffic", value: "↑ 2×" },
                { label: "Cost per lead", value: "↓ 38%" },
              ],
            },
            {
              accent: "#7885FF",
              industry: "Professional Services",
              region: "United States",
              teaser: "A consulting firm reduced lead response time from hours to minutes using WhatsApp automation and CRM integration.",
              metrics: [
                { label: "Response time", value: "< 5 min" },
                { label: "Qualified leads", value: "↑ 3×" },
              ],
            },
            {
              accent: "#FFCB86",
              industry: "Healthcare",
              region: "Spain",
              teaser: "A private clinic filled its appointment calendar consistently through Local SEO and Google Ads working in parallel.",
              metrics: [
                { label: "Appointments/mo", value: "↑ 60%" },
                { label: "Ad ROAS", value: "4.8×" },
              ],
            },
          ].map((cs) => (
            <article
              key={cs.industry}
              className="card-midnight rounded-2xl p-7 flex flex-col"
              style={{ borderColor: `${cs.accent}20` }}
            >
              <div className="flex items-center justify-between mb-6">
                <span
                  className="text-xs font-semibold px-2.5 py-1 rounded-full"
                  style={{ color: cs.accent, background: `${cs.accent}15`, border: `1px solid ${cs.accent}30` }}
                >
                  {cs.industry}
                </span>
                <span className="text-xs text-[#4E5D6E]">{cs.region}</span>
              </div>

              <p className="text-sm text-[#A8B3C0] leading-relaxed flex-1 mb-6">
                {cs.teaser}
              </p>

              <div className="grid grid-cols-2 gap-3 pt-5 border-t border-white/[0.06]">
                {cs.metrics.map((m) => (
                  <div key={m.label}>
                    <p
                      className="font-display text-xl font-extrabold mb-0.5"
                      style={{ color: cs.accent }}
                    >
                      {m.value}
                    </p>
                    <p className="text-xs text-[#4E5D6E]">{m.label}</p>
                  </div>
                ))}
              </div>
            </article>
          ))}
        </div>

        <p className="text-center text-xs text-[#4E5D6E]">
          Full case studies — with methodology, timeline, and verified outcomes — published as client relationships allow.
        </p>
      </div>
    </section>
  )
}

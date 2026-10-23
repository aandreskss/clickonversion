import Link from "next/link"
import { ArrowRight, Calendar } from "lucide-react"

export function HomepageCta() {
  return (
    <section className="py-24 bg-[#101827]" aria-label="Get started">
      <div className="container-wide">
        <div
          className="relative rounded-3xl overflow-hidden p-12 md:p-16 text-center"
          style={{
            background: "linear-gradient(135deg, rgba(120,230,179,0.08) 0%, rgba(120,133,255,0.06) 50%, rgba(255,90,31,0.06) 100%)",
            border: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          {/* Background glow */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: "radial-gradient(ellipse at 50% 0%, rgba(120,230,179,0.06) 0%, transparent 60%)",
            }}
          />

          {/* Top badge */}
          <div className="relative inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#FF5A1F]/10 border border-[#FF5A1F]/20 text-[#FF5A1F] text-xs font-semibold mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-[#FF5A1F] animate-pulse" />
            Free — no commitment required
          </div>

          <h2 className="relative font-display text-[clamp(2rem,5vw,3.5rem)] font-extrabold text-white leading-tight mb-5 max-w-2xl mx-auto">
            Ready to get more customers from{" "}
            <span
              style={{
                background: "linear-gradient(135deg, #78E6B3 0%, #7885FF 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              every channel?
            </span>
          </h2>

          <p className="relative text-[#7A8799] text-lg max-w-xl mx-auto mb-10">
            Start with a free audit. We review your search presence, Meta Ads account,
            WhatsApp setup, and automation stack — then deliver a prioritized action plan
            specific to your business.
          </p>

          <div className="relative flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/audit"
              className="inline-flex items-center gap-2 px-8 py-4 bg-[#FF5A1F] text-white font-semibold rounded-xl hover:bg-[#E54A15] transition-all duration-150 active:scale-[0.98] text-base shadow-lg shadow-[#FF5A1F]/25"
            >
              Get a Free Audit
              <ArrowRight size={18} />
            </Link>
            <Link
              href="/audit"
              className="inline-flex items-center gap-2 px-8 py-4 text-[#A8B3C0] font-semibold rounded-xl border border-white/10 hover:text-white hover:border-white/20 hover:bg-white/5 transition-all duration-150 text-base"
            >
              <Calendar size={16} />
              Book a Strategy Call
            </Link>
          </div>

          <p className="relative mt-8 text-xs text-[#4E5D6E]">
            Available in English and Spanish · Responds within 4 business hours
          </p>
        </div>
      </div>
    </section>
  )
}

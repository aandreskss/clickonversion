"use client"

import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { analytics } from "@/lib/analytics"

export function AuditCTA() {
  return (
    <section className="section-dark py-24 lg:py-32">
      <div className="container-tight">
        <div className="rounded-3xl border border-[#FF5A1F]/20 bg-[#14171A] p-10 lg:p-16 text-center relative overflow-hidden">
          {/* Background glow */}
          <div
            className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-48 blur-3xl pointer-events-none"
            style={{ background: "radial-gradient(ellipse, rgba(255,90,31,0.08), transparent 70%)" }}
            aria-hidden="true"
          />

          <div className="relative z-10">
            <p className="text-xs font-semibold tracking-widest text-[#FF5A1F] uppercase mb-6">
              Growth Audit
            </p>
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
              Find out where your growth
              <br />
              system is leaking.
            </h2>
            <p className="text-lg text-[#8A9099] max-w-xl mx-auto leading-relaxed mb-10">
              We&apos;ll look at your search visibility, website, conversion path, and acquisition
              setup to identify the biggest opportunities for growth.
            </p>

            <Link
              href="/audit"
              onClick={() => analytics.primaryCtaClick("audit-cta-section")}
              className="inline-flex items-center gap-2 px-8 py-4 bg-[#FF5A1F] text-white font-semibold rounded-lg hover:bg-[#E54A15] transition-colors duration-150 active:scale-[0.98] text-base"
            >
              Get a Free Growth Audit
              <ArrowRight size={18} />
            </Link>

            <div className="flex items-center justify-center gap-6 mt-6 flex-wrap">
              {["No obligation", "No countdown timers", "No fake availability"].map((item) => (
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
  )
}

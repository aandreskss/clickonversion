"use client"

import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { analytics } from "@/lib/analytics"

const PILLARS = [
  {
    title: "Search Visibility",
    description: "Technical SEO, local optimization, Google Business Profile, and a site structure that Google can actually understand.",
    items: ["Technical SEO", "Local SEO", "Google Business Profile", "Service page architecture"],
  },
  {
    title: "Acquisition",
    description: "Campaigns built to generate calls and form submissions, not just clicks. Every ad connects to a landing experience that converts.",
    items: ["Google Ads", "Campaign structure", "Landing pages", "Ad-to-conversion path"],
  },
  {
    title: "Conversion",
    description: "Systematic improvements to the gap between someone's first interest and their decision to contact you.",
    items: ["CRO analysis", "Form optimization", "Call flow", "CTA improvement"],
  },
  {
    title: "Follow-up",
    description: "A structured process to make sure qualified leads don't disappear because of slow or inconsistent outreach.",
    items: ["CRM structure", "Lead-response process", "Basic automation", "Follow-up workflows"],
  },
  {
    title: "Measurement",
    description: "Tracking that tells you what's generating revenue, not just what's generating traffic.",
    items: ["GA4 setup", "Search Console", "Lead attribution", "Pipeline visibility"],
  },
]

export function ServiceSection() {
  return (
    <section id="services" className="section-surface py-24 lg:py-32">
      <div className="container-wide">
        <div className="grid lg:grid-cols-2 gap-16 items-start">

          {/* Left — service intro */}
          <div className="lg:sticky lg:top-32">
            <p className="text-xs font-semibold tracking-widest text-[#FF5A1F] uppercase mb-4">
              Primary Service
            </p>
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
              Local Revenue Engine
            </h2>
            <p className="text-lg text-[#8A9099] leading-relaxed mb-8">
              A focused growth system designed to help service businesses generate more qualified
              opportunities from Google and convert more of that demand into customers.
            </p>
            <p className="text-sm text-[#546072] leading-relaxed mb-4">
              We don&apos;t run a single channel in isolation. Search visibility, paid acquisition,
              conversion, follow-up, and measurement are built and managed as one connected
              system — because that&apos;s how revenue actually works.
            </p>
            <p className="text-sm text-[#546072] leading-relaxed mb-10">
              Your Growth Audit identifies where the acquisition system is leaking first — so we
              prioritize the areas most likely to create meaningful improvement instead of selling
              disconnected marketing tasks.
            </p>
            <Link
              href="/audit"
              onClick={() => analytics.serviceCtaClick("local-revenue-engine", "service-section")}
              className="inline-flex items-center gap-2 px-7 py-4 bg-[#FF5A1F] text-white font-semibold rounded-lg hover:bg-[#E54A15] transition-colors duration-150 active:scale-[0.98]"
            >
              Get a Free Growth Audit
              <ArrowRight size={18} />
            </Link>
            <p className="text-xs text-[#3D4A5C] mt-4">
              No obligation. No pitch deck on the first call.
            </p>
          </div>

          {/* Right — pillars */}
          <div className="flex flex-col gap-6">
            {PILLARS.map((pillar, i) => (
              <div
                key={pillar.title}
                className="rounded-2xl border border-white/8 bg-[#0B0D0F] p-7 hover:border-white/15 transition-colors duration-200"
              >
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-xs font-bold text-[#3D4A5C]">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="text-base font-bold text-white">{pillar.title}</h3>
                </div>
                <p className="text-sm text-[#546072] leading-relaxed mb-4">
                  {pillar.description}
                </p>
                <div className="flex flex-wrap gap-2">
                  {pillar.items.map((item) => (
                    <span
                      key={item}
                      className="px-2.5 py-1 text-xs font-medium text-[#6E7D8F] border border-white/8 rounded-md"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

"use client"

import { useRef, useState, useCallback } from "react"
import Link from "next/link"
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react"
import { analytics } from "@/lib/analytics"

type Service = {
  emoji: string
  title: string
  description: string
  highlights: string[]
  accent: string
}

const SERVICES: Service[] = [
  {
    emoji: "📍",
    title: "SEO & Local Visibility",
    description: "Get found by people already searching for your service — in the cities and markets where you work.",
    highlights: ["Local Search", "Google Business Profile", "Technical SEO"],
    accent: "#FF5A1F",
  },
  {
    emoji: "📈",
    title: "Google Ads",
    description: "Reach high-intent prospects when they're actively looking and turn paid clicks into measurable lead opportunities.",
    highlights: ["Search Campaigns", "Landing Experience", "Conversion Tracking"],
    accent: "#4285F4",
  },
  {
    emoji: "🧩",
    title: "Website Conversion",
    description: "Improve the gap between someone landing on your site and actually reaching out.",
    highlights: ["Landing Pages", "Calls to Action", "Forms & UX"],
    accent: "#8B5CF6",
  },
  {
    emoji: "🤝",
    title: "CRM & Follow-up",
    description: "Build a cleaner process for responding to leads so fewer inquiries fall through the cracks.",
    highlights: ["Lead Management", "Follow-up Process", "Pipeline Visibility"],
    accent: "#10B981",
  },
  {
    emoji: "📊",
    title: "Analytics & Tracking",
    description: "See which channels, pages and campaigns are actually producing leads — so you can invest with confidence.",
    highlights: ["GA4 Setup", "Search Console", "Lead Attribution"],
    accent: "#06B6D4",
  },
  {
    emoji: "⚙️",
    title: "Automation",
    description: "Automate the repetitive parts of your lead process without losing the human side of the conversation.",
    highlights: ["Lead Workflows", "Response Automation", "Scalable Process"],
    accent: "#F59E0B",
  },
  {
    emoji: "🤖",
    title: "AI-Ready Systems",
    description: "Prepare your workflows and data so AI tools can actually improve the business — not just add more noise.",
    highlights: ["Structured Workflows", "Clean Data", "Future-Ready Systems"],
    accent: "#6366F1",
  },
]

export function ServicesSlider() {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [canPrev, setCanPrev] = useState(false)
  const [canNext, setCanNext] = useState(true)

  function getScrollAmount(): number {
    const card = scrollRef.current?.querySelector("[data-card]") as HTMLElement | null
    if (!card) return 336
    const gap = 16
    return card.offsetWidth + gap
  }

  function scroll(dir: "prev" | "next") {
    if (!scrollRef.current) return
    const amount = getScrollAmount()
    scrollRef.current.scrollBy({ left: dir === "next" ? amount : -amount, behavior: "smooth" })
  }

  const onScroll = useCallback(() => {
    const el = scrollRef.current
    if (!el) return
    setCanPrev(el.scrollLeft > 8)
    setCanNext(el.scrollLeft < el.scrollWidth - el.clientWidth - 8)
  }, [])

  return (
    <section className="section-dark py-24 lg:py-32">
      <div className="container-wide">

        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10">
          <div className="max-w-xl">
            <p className="text-xs font-semibold tracking-widest text-[#FF5A1F] uppercase mb-4">
              Services
            </p>
            <h2 className="text-4xl lg:text-5xl font-bold text-white leading-tight mb-4">
              What we help
              <br />
              you improve.
            </h2>
            <p className="text-lg text-[#8A9099] leading-relaxed">
              From search visibility and acquisition to conversion, follow-up and measurement —
              we improve the parts of your growth system that actually drive customers.
            </p>
          </div>

          {/* Desktop nav arrows */}
          <div className="hidden lg:flex gap-2 flex-shrink-0 pb-1" aria-label="Slider controls">
            <button
              onClick={() => scroll("prev")}
              disabled={!canPrev}
              aria-label="Previous services"
              className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-[#546072] hover:border-white/20 hover:text-white disabled:opacity-25 disabled:cursor-not-allowed transition-all duration-150"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={() => scroll("next")}
              disabled={!canNext}
              aria-label="Next services"
              className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-[#546072] hover:border-white/20 hover:text-white disabled:opacity-25 disabled:cursor-not-allowed transition-all duration-150"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        {/* Slider */}
        <div
          ref={scrollRef}
          onScroll={onScroll}
          className="no-scrollbar flex gap-4 overflow-x-auto pb-2 snap-x snap-mandatory"
          role="list"
          aria-label="ClicKonversion services"
          tabIndex={0}
        >
          {SERVICES.map((service) => (
            <article
              key={service.title}
              data-card
              role="listitem"
              className="snap-start flex-shrink-0 w-[280px] sm:w-[320px] rounded-2xl border border-white/8 bg-[#14171A] overflow-hidden hover:border-white/15 transition-colors duration-200 focus-within:border-white/20"
            >
              {/* Visual area */}
              <div
                className="h-40 relative flex items-center justify-center overflow-hidden"
                style={{
                  background: `linear-gradient(135deg, ${service.accent}1A 0%, #0B0D0F 75%)`,
                }}
                aria-hidden="true"
              >
                {/* Dot grid */}
                <div
                  className="absolute inset-0 opacity-[0.05]"
                  style={{
                    backgroundImage: `radial-gradient(circle, ${service.accent} 1px, transparent 1px)`,
                    backgroundSize: "22px 22px",
                  }}
                />
                {/* Soft glow */}
                <div
                  className="absolute w-28 h-28 rounded-full blur-3xl"
                  style={{ background: service.accent, opacity: 0.15 }}
                />
                {/* Emoji */}
                <span
                  className="text-5xl relative z-10 select-none leading-none"
                  role="img"
                  aria-label={service.title}
                >
                  {service.emoji}
                </span>
                {/* Accent corner */}
                <div
                  className="absolute bottom-0 right-0 w-20 h-20 rounded-tl-3xl opacity-[0.06]"
                  style={{ background: service.accent }}
                />
              </div>

              {/* Content */}
              <div className="p-6 flex flex-col gap-4">
                <div>
                  <h3 className="text-base font-bold text-white mb-2">{service.title}</h3>
                  <p className="text-sm text-[#546072] leading-relaxed">{service.description}</p>
                </div>
                <ul className="flex flex-col gap-1.5" aria-label={`${service.title} highlights`}>
                  {service.highlights.map((item) => (
                    <li key={item} className="flex items-center gap-2">
                      <div
                        className="w-1 h-1 rounded-full flex-shrink-0"
                        style={{ background: service.accent }}
                        aria-hidden="true"
                      />
                      <span className="text-xs text-[#3D4A5C]">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
        </div>

        {/* Mobile scroll hint */}
        <p className="lg:hidden text-xs text-[#3D4A5C] text-center mt-4" aria-hidden="true">
          Swipe to see more →
        </p>

        {/* CTA */}
        <div className="mt-12 flex flex-col sm:flex-row items-center gap-4">
          <Link
            href="/audit"
            onClick={() => analytics.primaryCtaClick("services-slider")}
            className="inline-flex items-center gap-2 px-7 py-4 bg-[#FF5A1F] text-white font-semibold rounded-lg hover:bg-[#E54A15] transition-colors duration-150 active:scale-[0.98] text-base"
          >
            Get a Free Growth Audit
            <ArrowRight size={18} />
          </Link>
          <p className="text-sm text-[#3D4A5C]">No obligation. No pitch deck on the first call.</p>
        </div>
      </div>
    </section>
  )
}

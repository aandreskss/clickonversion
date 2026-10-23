import Link from "next/link"
import { ArrowRight, Search, MessageCircle, Bot, Zap } from "lucide-react"

const SERVICE_TAGS = [
  { label: "SEO & Local SEO",   color: "#78E6B3" },
  { label: "Google Ads / SEM",  color: "#FFCB86" },
  { label: "Meta Ads",          color: "#7885FF" },
  { label: "WhatsApp Business", color: "#25D366" },
  { label: "AI Agents",         color: "#FF5A1F" },
  { label: "Automations",       color: "#78E6B3" },
]

const SYSTEM_CARDS = [
  { icon: Search,        label: "SEO & Google Ads",     detail: "Organic + paid search", accent: "#78E6B3" },
  { icon: Zap,           label: "Meta Ads",              detail: "Lead gen + ROAS",        accent: "#FFCB86" },
  { icon: MessageCircle, label: "WhatsApp Business",     detail: "WABA + automation",      accent: "#25D366" },
  { icon: Bot,           label: "AI Agents & Chatbots",  detail: "24/7 lead capture",      accent: "#7885FF" },
]

export function Hero() {
  return (
    <section
      className="relative min-h-screen flex items-center bg-hero-gradient overflow-hidden"
      aria-label="Hero"
    >
      {/* Grid overlay */}
      <div className="absolute inset-0 bg-grid-pattern opacity-100 pointer-events-none" />

      {/* Glow orbs */}
      <div
        className="absolute top-1/4 -left-32 w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(120,230,179,0.07) 0%, transparent 70%)" }}
      />
      <div
        className="absolute top-1/3 right-0 w-[400px] h-[400px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(120,133,255,0.07) 0%, transparent 70%)" }}
      />

      <div className="container-wide relative z-10 pt-28 pb-20">
        <div className="max-w-4xl">
          {/* Eyebrow */}
          <div className="eyebrow text-[#78E6B3] mb-6 animate-fade-in-up">
            <span className="w-2 h-2 rounded-full bg-[#78E6B3] animate-pulse-glow" />
            SEO · Meta Ads · AI · WhatsApp Business
          </div>

          {/* H1 */}
          <h1
            className="font-display text-[clamp(2.75rem,7vw,5.5rem)] font-extrabold text-white leading-[1.05] tracking-tight mb-6 animate-fade-in-up delay-100"
            style={{ letterSpacing: "-0.03em" }}
          >
            More customers from{" "}
            <span
              style={{
                background: "linear-gradient(135deg, #78E6B3 0%, #7885FF 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              search, Meta,
            </span>{" "}
            <br />
            and WhatsApp.
          </h1>

          {/* Description */}
          <p className="text-lg text-[#7A8799] max-w-2xl leading-relaxed mb-10 animate-fade-in-up delay-200">
            We help businesses grow with SEO, Local SEO, Google Ads, Meta Ads, AI chatbots, AI agents,
            WhatsApp Business, and intelligent automation — one connected system that turns
            visibility into customers.
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap items-center gap-4 mb-12 animate-fade-in-up delay-300">
            <Link
              href="/audit"
              className="inline-flex items-center gap-2 px-7 py-4 bg-[#FF5A1F] text-white font-semibold rounded-xl hover:bg-[#E54A15] transition-all duration-150 active:scale-[0.98] text-base shadow-lg shadow-[#FF5A1F]/20"
            >
              Get a Free Audit
              <ArrowRight size={18} />
            </Link>
            <Link
              href="/audit"
              className="inline-flex items-center gap-2 px-7 py-4 text-[#78E6B3] font-semibold rounded-xl hover:text-white transition-colors duration-150 text-base"
            >
              Book a Strategy Call →
            </Link>
          </div>

          {/* Service tags */}
          <div className="flex flex-wrap gap-2 animate-fade-in-up delay-400" role="list" aria-label="Services">
            {SERVICE_TAGS.map((tag) => (
              <span
                key={tag.label}
                role="listitem"
                className="px-3 py-1 text-xs font-medium rounded-full border"
                style={{ color: tag.color, borderColor: `${tag.color}30`, background: `${tag.color}10` }}
              >
                {tag.label}
              </span>
            ))}
          </div>
        </div>

        {/* Floating service cards (desktop) */}
        <div className="hidden lg:flex absolute right-8 top-1/2 -translate-y-1/2 flex-col gap-4 animate-fade-in delay-500">
          {SYSTEM_CARDS.map((card) => {
            const Icon = card.icon
            return (
              <div
                key={card.label}
                className="card-glass px-5 py-4 min-w-[200px]"
                style={{ borderColor: `${card.accent}25` }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <Icon size={14} style={{ color: card.accent }} />
                  <span className="text-xs text-[#4E5D6E]">{card.label}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: card.accent }} />
                  <p className="text-sm font-semibold text-white">{card.detail}</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Bottom fade */}
      <div
        className="absolute bottom-0 inset-x-0 h-32 pointer-events-none"
        style={{ background: "linear-gradient(to top, #101827, transparent)" }}
      />
    </section>
  )
}

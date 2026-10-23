import Link from "next/link"
import { ArrowRight } from "lucide-react"

const PILLARS = [
  {
    accent: "#78E6B3",
    accentMuted: "rgba(120,230,179,0.1)",
    accentBorder: "rgba(120,230,179,0.2)",
    category: "SEO & SEM",
    title: "Get found where your customers are already searching",
    description:
      "From technical SEO and local search optimization to Google Ads campaigns built for leads — sustainable visibility that works 24/7.",
    services: ["SEO General", "Local SEO", "Google Ads / SEM", "Technical SEO", "Google Business Profile"],
    href: "/audit",
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <path d="M11 20a9 9 0 100-18 9 9 0 000 18z" stroke="#78E6B3" strokeWidth="2" strokeLinecap="round"/>
        <path d="M27 27l-6-6" stroke="#78E6B3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M7 11h8M11 7v8" stroke="#78E6B3" strokeWidth="2" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    accent: "#FFCB86",
    accentMuted: "rgba(255,203,134,0.1)",
    accentBorder: "rgba(255,203,134,0.2)",
    category: "Meta Ads",
    title: "Turn Facebook and Instagram into a lead machine",
    description:
      "Campaign strategy, creative, and optimization built around actual conversions. We also fix broken accounts and consult on Meta-specific problems.",
    services: ["Meta Ads Management", "Lead Gen Campaigns", "Retargeting", "Meta Consulting", "Account Troubleshooting"],
    href: "/audit",
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <rect x="2" y="8" width="24" height="16" rx="3" stroke="#FFCB86" strokeWidth="2"/>
        <path d="M2 13h24" stroke="#FFCB86" strokeWidth="2"/>
        <circle cx="7" cy="18" r="2" fill="#FFCB86"/>
        <path d="M19 4l3 4H16l3-4z" fill="#FFCB86"/>
      </svg>
    ),
  },
  {
    accent: "#7885FF",
    accentMuted: "rgba(120,133,255,0.1)",
    accentBorder: "rgba(120,133,255,0.2)",
    category: "AI & WhatsApp",
    title: "Automate conversations, qualify leads, close faster",
    description:
      "Official WhatsApp Business API, AI chatbots, AI agents, and full workflow automation — so your team focuses on closing, not chasing.",
    services: ["WhatsApp Business (WABA)", "AI Chatbots", "AI Agents", "Callbell / WATI / Kommo", "Make / n8n automations"],
    href: "/audit",
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <rect x="8" y="2" width="12" height="10" rx="3" stroke="#7885FF" strokeWidth="2"/>
        <path d="M14 12v4M10 16h8M7 22c0-2.76 3.13-5 7-5s7 2.24 7 5" stroke="#7885FF" strokeWidth="2" strokeLinecap="round"/>
        <circle cx="11" cy="7" r="1.5" fill="#7885FF"/>
        <circle cx="17" cy="7" r="1.5" fill="#7885FF"/>
      </svg>
    ),
  },
]

export function ServicesPreview() {
  return (
    <section className="py-24 bg-[#101827]" aria-label="Services overview">
      <div className="container-wide">
        <div className="text-center mb-16">
          <p className="eyebrow text-[#4E5D6E] mb-4">What we do</p>
          <h2 className="font-display text-[clamp(2rem,4vw,3rem)] font-bold text-white mb-4">
            Three pillars. One integrated system.
          </h2>
          <p className="text-[#7A8799] max-w-xl mx-auto">
            We don&apos;t sell disconnected services. Each pillar feeds the others — more traffic,
            better conversations, faster closes.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {PILLARS.map((pillar) => (
            <article
              key={pillar.category}
              className="group relative rounded-2xl p-8 border transition-all duration-300 hover:scale-[1.01]"
              style={{
                background: pillar.accentMuted,
                borderColor: pillar.accentBorder,
              }}
            >
              {/* Icon */}
              <div
                className="w-14 h-14 rounded-xl flex items-center justify-center mb-6"
                style={{ background: pillar.accentMuted, border: `1px solid ${pillar.accentBorder}` }}
              >
                {pillar.icon}
              </div>

              {/* Category tag */}
              <p className="eyebrow mb-3" style={{ color: pillar.accent }}>
                {pillar.category}
              </p>

              <h3 className="font-display text-xl font-bold text-white mb-3">
                {pillar.title}
              </h3>

              <p className="text-sm text-[#7A8799] leading-relaxed mb-6">
                {pillar.description}
              </p>

              {/* Service pills */}
              <div className="flex flex-wrap gap-2 mb-8">
                {pillar.services.map((s) => (
                  <span
                    key={s}
                    className="text-xs px-2.5 py-1 rounded-full font-medium"
                    style={{ background: pillar.accentMuted, color: pillar.accent, border: `1px solid ${pillar.accentBorder}` }}
                  >
                    {s}
                  </span>
                ))}
              </div>

              <Link
                href={pillar.href}
                className="inline-flex items-center gap-1.5 text-sm font-semibold transition-colors"
                style={{ color: pillar.accent }}
              >
                Get a free audit
                <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

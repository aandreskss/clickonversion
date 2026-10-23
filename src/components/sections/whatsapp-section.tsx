import Link from "next/link"
import { ArrowRight } from "lucide-react"

const TOOLS = [
  { name: "Callbell",  color: "#FF5A1F" },
  { name: "Kommo",     color: "#7885FF" },
  { name: "WATI",      color: "#78E6B3" },
  { name: "B2Chat",    color: "#FFCB86" },
  { name: "Make",      color: "#FF5A1F" },
  { name: "n8n",       color: "#EA4B71" },
]

const CAPABILITIES = [
  "Official WhatsApp Business API (WABA) setup",
  "Multi-agent shared inbox (WA, IG, FB, Telegram)",
  "AI chatbots for lead qualification and support",
  "AI agents that handle conversations autonomously",
  "Automated follow-up sequences and broadcasts",
  "CRM integration and deal tracking",
  "Human handoff logic when the bot can't continue",
  "Full workflow automation with Make / n8n",
]

export function WhatsAppSection() {
  return (
    <section className="py-24 bg-[#151E2D]" aria-label="WhatsApp and automation solutions">
      <div className="container-wide">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left: Content */}
          <div>
            <div className="eyebrow text-[#78E6B3] mb-5">
              <span className="w-2 h-2 rounded-full bg-[#78E6B3]" />
              WhatsApp, AI & Automation
            </div>

            <h2 className="font-display text-[clamp(2rem,4vw,2.75rem)] font-bold text-white mb-5">
              Your customers are on WhatsApp.{" "}
              <span style={{ color: "#78E6B3" }}>
                Your business should respond in seconds.
              </span>
            </h2>

            <p className="text-[#7A8799] text-lg leading-relaxed mb-8">
              We set up the official WhatsApp Business API, build AI chatbots and agents that
              qualify leads automatically, and connect everything to your CRM — so conversations
              become customers without adding headcount.
            </p>

            {/* Capabilities list */}
            <ul className="space-y-3 mb-10">
              {CAPABILITIES.map((cap) => (
                <li key={cap} className="flex items-start gap-3 text-sm text-[#A8B3C0]">
                  <span className="flex-shrink-0 w-5 h-5 rounded-full bg-[#78E6B3]/10 border border-[#78E6B3]/30 flex items-center justify-center mt-0.5">
                    <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                      <path d="M1 4l3 3 5-6" stroke="#78E6B3" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </span>
                  {cap}
                </li>
              ))}
            </ul>

            <div className="flex flex-wrap gap-3">
              <Link
                href="/audit"
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#78E6B3] text-[#101827] font-semibold rounded-xl hover:bg-[#5DDBA4] transition-colors text-sm"
              >
                Set up WhatsApp Business
                <ArrowRight size={15} />
              </Link>
              <Link
                href="/audit"
                className="inline-flex items-center gap-2 px-6 py-3 text-[#78E6B3] font-semibold rounded-xl border border-[#78E6B3]/30 hover:bg-[#78E6B3]/10 transition-colors text-sm"
              >
                All automation services
              </Link>
            </div>
          </div>

          {/* Right: Tool logos + visual */}
          <div className="relative">
            <div className="card-midnight p-8 rounded-2xl" style={{ borderColor: "rgba(120,230,179,0.15)" }}>
              <p className="text-xs font-semibold text-[#4E5D6E] uppercase tracking-widest mb-6">
                Platforms we implement
              </p>
              <div className="grid grid-cols-2 gap-3">
                {TOOLS.map((tool) => (
                  <div
                    key={tool.name}
                    className="flex items-center gap-3 px-4 py-3.5 rounded-xl bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.06] transition-colors"
                  >
                    <div
                      className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                      style={{ backgroundColor: tool.color }}
                    />
                    <span className="text-sm font-medium text-[#A8B3C0]">{tool.name}</span>
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-6 border-t border-white/[0.06]">
                <p className="text-xs text-[#4E5D6E]">
                  We select the right tool for your team size, message volume, and budget.
                  Not every business needs the same stack.
                </p>
              </div>
            </div>

            {/* Floating conversation preview */}
            <div
              className="absolute -bottom-6 -right-4 card-glass px-5 py-4 rounded-2xl max-w-[200px]"
              style={{ borderColor: "rgba(120,230,179,0.2)" }}
            >
              <div className="flex items-center gap-2 mb-2">
                <div className="w-6 h-6 rounded-full bg-[#78E6B3]/20 flex items-center justify-center">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="#78E6B3">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                </div>
                <span className="text-xs text-[#78E6B3] font-medium">Lead qualified by AI</span>
              </div>
              <p className="text-xs text-[#4E5D6E]">Auto-moved to pipeline · 2s ago</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

import Link from "next/link"
import { ArrowRight, Check } from "lucide-react"

const FEATURES = [
  "Auto-import leads from Meta Ads in real time",
  "WhatsApp notification on every new lead",
  "Pipeline with drag-and-drop stages",
  "Lead deduplication and source attribution",
  "Team assignment and follow-up reminders",
  "Export to CSV or push to any CRM via webhook",
]

export function SyncLeadSection() {
  return (
    <section className="py-24 bg-[#0D1420]" aria-label="SyncLead product">
      <div className="container-wide">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left: product preview */}
          <div className="relative order-2 lg:order-1">
            {/* Mock dashboard card */}
            <div className="card-midnight rounded-2xl p-6 border" style={{ borderColor: "rgba(120,133,255,0.2)" }}>
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#7885FF]/20 flex items-center justify-center">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M2 12V8c0-3.31 2.69-6 6-6s6 2.69 6 6v4" stroke="#7885FF" strokeWidth="1.5" strokeLinecap="round"/>
                      <path d="M1 10h2a1 1 0 011 1v2a1 1 0 01-1 1H2a1 1 0 01-1-1v-2zm10 0h2a1 1 0 011 1v2a1 1 0 01-1 1h-1a1 1 0 01-1-1v-2z" fill="#7885FF" opacity=".6"/>
                    </svg>
                  </div>
                  <span className="text-sm font-semibold text-white">SyncLead</span>
                </div>
                <span className="text-xs text-[#78E6B3] font-medium bg-[#78E6B3]/10 px-2 py-0.5 rounded-full">Live</span>
              </div>

              {/* Stat row */}
              <div className="grid grid-cols-3 gap-3 mb-6">
                {[
                  { label: "New today", value: "12", color: "#7885FF" },
                  { label: "In pipeline", value: "47", color: "#FFCB86" },
                  { label: "Closed", value: "8", color: "#78E6B3" },
                ].map((s) => (
                  <div key={s.label} className="bg-white/[0.03] rounded-xl p-3 text-center">
                    <p className="font-display text-2xl font-extrabold mb-0.5" style={{ color: s.color }}>{s.value}</p>
                    <p className="text-xs text-[#4E5D6E]">{s.label}</p>
                  </div>
                ))}
              </div>

              {/* Lead rows */}
              <div className="space-y-2">
                {[
                  { name: "María G.", source: "Meta Ads", stage: "New", stageColor: "#7885FF" },
                  { name: "Carlos R.", source: "Meta Ads", stage: "Contacted", stageColor: "#FFCB86" },
                  { name: "Ana P.", source: "Meta Ads", stage: "Qualified", stageColor: "#78E6B3" },
                ].map((lead) => (
                  <div
                    key={lead.name}
                    className="flex items-center justify-between px-3 py-2.5 rounded-lg bg-white/[0.02] border border-white/[0.04]"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-6 h-6 rounded-full bg-[#7885FF]/20 flex items-center justify-center text-[10px] font-bold text-[#7885FF]">
                        {lead.name[0]}
                      </div>
                      <span className="text-xs text-[#A8B3C0]">{lead.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-[#4E5D6E]">{lead.source}</span>
                      <span
                        className="text-[10px] font-medium px-1.5 py-0.5 rounded-full"
                        style={{ color: lead.stageColor, background: `${lead.stageColor}18` }}
                      >
                        {lead.stage}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Floating notification */}
            <div
              className="absolute -top-4 -right-4 card-glass px-4 py-3 rounded-xl max-w-[190px]"
              style={{ borderColor: "rgba(120,133,255,0.3)" }}
            >
              <p className="text-xs font-medium text-[#7885FF] mb-0.5">New lead synced</p>
              <p className="text-[11px] text-[#4E5D6E]">From Meta Ads · just now</p>
            </div>
          </div>

          {/* Right: content */}
          <div className="order-1 lg:order-2">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold bg-[#7885FF]/10 text-[#7885FF] border border-[#7885FF]/20 mb-5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#7885FF] animate-pulse" />
              Producto propio · Included with services
            </div>

            <h2 className="font-display text-[clamp(2rem,4vw,2.75rem)] font-bold text-white mb-5">
              Stop losing leads{" "}
              <span style={{ color: "#7885FF" }}>between Meta and your team.</span>
            </h2>

            <p className="text-[#7A8799] text-lg leading-relaxed mb-8">
              SyncLead connects Meta Ads directly to your pipeline — no manual exports, no CSV files, no lost leads.
              Every form submission syncs in seconds and notifies your team on WhatsApp.
            </p>

            <ul className="space-y-3 mb-10">
              {FEATURES.map((f) => (
                <li key={f} className="flex items-start gap-3 text-sm text-[#A8B3C0]">
                  <Check size={16} className="text-[#7885FF] flex-shrink-0 mt-0.5" />
                  {f}
                </li>
              ))}
            </ul>

            <div className="flex flex-wrap gap-3">
              <Link
                href="/apps/synclead"
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#7885FF] text-white font-semibold rounded-xl hover:bg-[#6672EE] transition-colors text-sm"
              >
                See SyncLead
                <ArrowRight size={15} />
              </Link>
              <Link
                href="/audit"
                className="inline-flex items-center gap-2 px-6 py-3 text-[#7885FF] font-semibold rounded-xl border border-[#7885FF]/30 hover:bg-[#7885FF]/10 transition-colors text-sm"
              >
                Get it included
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

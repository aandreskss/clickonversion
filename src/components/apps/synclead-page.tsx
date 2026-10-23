"use client"

import { useState } from "react"
import Link from "next/link"
import {
  ArrowRight, Check, ChevronDown, ChevronUp,
  Zap, Users, MessageSquare, BarChart3, Upload,
  RefreshCw, Target, Shield,
} from "lucide-react"
import { MarketingLayout } from "@/components/marketing/marketing-layout"
import type { App } from "@/data/apps"

const ICON_MAP: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  sync:     RefreshCw,
  kanban:   BarChart3,
  whatsapp: MessageSquare,
  ai:       Zap,
  qualify:  Target,
  capi:     Shield,
  team:     Users,
  import:   Upload,
}

const HOW_IT_WORKS = [
  {
    step: "01",
    title: "Connect Meta Ads",
    body: "Link your Meta Business account in minutes. SyncLead pulls all your active lead forms automatically.",
  },
  {
    step: "02",
    title: "Leads appear in your pipeline",
    body: "Every new submission lands in your SyncLead pipeline in real time — no imports, no manual work.",
  },
  {
    step: "03",
    title: "Your team gets notified on WhatsApp",
    body: "The assigned agent gets a WhatsApp notification the moment a lead arrives. Response time drops from hours to seconds.",
  },
  {
    step: "04",
    title: "AI qualifies and engages",
    body: "Your AI agent greets the lead on WhatsApp, asks qualification questions, and escalates hot leads to your sales team.",
  },
  {
    step: "05",
    title: "Confirm sales back to Meta",
    body: "When a lead converts, SyncLead sends a Purchase event to Meta CAPI — so your algorithm optimizes for real buyers.",
  },
]

interface WaitlistFormState {
  status: "idle" | "loading" | "success" | "error"
  message?: string
}

export function SyncLeadPage({ app }: { app: App }) {
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const [email, setEmail] = useState("")
  const [form, setForm] = useState<WaitlistFormState>({ status: "idle" })

  async function handleWaitlist(e: React.FormEvent) {
    e.preventDefault()
    if (!email) return
    setForm({ status: "loading" })

    try {
      const res = await fetch("/api/apps/synclead/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })
      if (res.ok) {
        setForm({ status: "success", message: "You're on the list! We'll reach out before launch." })
        setEmail("")
      } else {
        setForm({ status: "error", message: "Something went wrong. Please try again." })
      }
    } catch {
      setForm({ status: "error", message: "Something went wrong. Please try again." })
    }
  }

  return (
    <MarketingLayout>
      {/* JSON-LD SoftwareApplication */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            name: "SyncLead",
            applicationCategory: "BusinessApplication",
            operatingSystem: "Web",
            description: app.description,
            offers: {
              "@type": "Offer",
              price: "0",
              priceCurrency: "USD",
              availability: "https://schema.org/PreOrder",
            },
            creator: {
              "@type": "Organization",
              name: "ClicKonversion",
              url: "https://www.clickonversion.com",
            },
          }),
        }}
      />

      {/* Hero */}
      <section className="pt-32 pb-20 bg-[#101827]" aria-label="SyncLead hero">
        <div className="container-wide">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left: content */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <Link
                  href="/apps"
                  className="text-xs text-[#4E5D6E] hover:text-[#A8B3C0] transition-colors"
                >
                  Apps
                </Link>
                <span className="text-[#4E5D6E]">/</span>
                <span className="text-xs text-[#7885FF] font-medium">SyncLead</span>
              </div>

              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold bg-[#7885FF]/10 text-[#7885FF] border border-[#7885FF]/20 mb-6">
                <span className="w-1.5 h-1.5 rounded-full bg-[#7885FF] animate-pulse" />
                Private beta · Early access open
              </div>

              <h1 className="font-display text-[clamp(2.25rem,5vw,3.5rem)] font-extrabold text-white leading-tight mb-6">
                {app.tagline}
              </h1>

              <p className="text-[#7A8799] text-lg leading-relaxed mb-10 max-w-lg">
                {app.longDescription}
              </p>

              <div className="flex flex-wrap gap-3">
                <a
                  href="#waitlist"
                  className="inline-flex items-center gap-2 px-7 py-3.5 bg-[#7885FF] text-white font-semibold rounded-xl hover:bg-[#6672EE] transition-colors text-sm shadow-lg shadow-[#7885FF]/20"
                >
                  Request early access
                  <ArrowRight size={15} />
                </a>
                <Link
                  href="/audit"
                  className="inline-flex items-center gap-2 px-7 py-3.5 text-[#7885FF] font-semibold rounded-xl border border-[#7885FF]/30 hover:bg-[#7885FF]/10 transition-colors text-sm"
                >
                  Get it with services
                </Link>
              </div>

              <p className="text-xs text-[#4E5D6E] mt-5">
                Included free with Meta Ads and automation service plans.
              </p>
            </div>

            {/* Right: dashboard mock */}
            <div className="relative">
              <div
                className="rounded-2xl p-6 border"
                style={{
                  background: "rgba(21,30,45,0.95)",
                  borderColor: "rgba(120,133,255,0.2)",
                  backdropFilter: "blur(8px)",
                }}
              >
                {/* Dashboard header */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[#7885FF]/20 flex items-center justify-center">
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path d="M2 12V8c0-3.31 2.69-6 6-6s6 2.69 6 6v4" stroke="#7885FF" strokeWidth="1.5" strokeLinecap="round"/>
                        <path d="M1 10h2a1 1 0 011 1v2a1 1 0 01-1 1H2a1 1 0 01-1-1v-2zm10 0h2a1 1 0 011 1v2a1 1 0 01-1 1h-1a1 1 0 01-1-1v-2z" fill="#7885FF" opacity=".6"/>
                      </svg>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-white">SyncLead</p>
                      <p className="text-[10px] text-[#4E5D6E]">Pipeline overview</p>
                    </div>
                  </div>
                  <span className="text-xs text-[#22C55E] font-medium bg-[#22C55E]/10 px-2 py-0.5 rounded-full">
                    Syncing
                  </span>
                </div>

                {/* Stats row */}
                <div className="grid grid-cols-3 gap-3 mb-6">
                  {[
                    { label: "New leads", value: "24", delta: "+8 today", color: "#7885FF" },
                    { label: "In pipeline", value: "67", delta: "+3 today", color: "#FFCB86" },
                    { label: "Converted", value: "12", delta: "+2 this week", color: "#78E6B3" },
                  ].map((s) => (
                    <div key={s.label} className="bg-white/[0.03] rounded-xl p-3">
                      <p className="font-display text-2xl font-extrabold mb-0.5" style={{ color: s.color }}>
                        {s.value}
                      </p>
                      <p className="text-[10px] text-[#4E5D6E]">{s.label}</p>
                      <p className="text-[10px] font-medium mt-0.5" style={{ color: s.color, opacity: 0.7 }}>
                        {s.delta}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Lead rows */}
                <div className="space-y-2">
                  {[
                    { name: "María González", source: "Meta Ads", stage: "New", temp: "Hot", stageColor: "#7885FF", tempColor: "#EF4444" },
                    { name: "Carlos Rodríguez", source: "Meta Ads", stage: "Contacted", temp: "Warm", stageColor: "#FFCB86", tempColor: "#F59E0B" },
                    { name: "Ana Pérez", source: "Meta Ads", stage: "Qualified", temp: "Warm", stageColor: "#78E6B3", tempColor: "#F59E0B" },
                    { name: "Luis Martínez", source: "CSV import", stage: "New", temp: "Cold", stageColor: "#7885FF", tempColor: "#7A8799" },
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
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] text-[#4E5D6E] hidden sm:inline">{lead.source}</span>
                        <span
                          className="text-[10px] font-medium px-1.5 py-0.5 rounded-full"
                          style={{ color: lead.stageColor, background: `${lead.stageColor}18` }}
                        >
                          {lead.stage}
                        </span>
                        <span
                          className="w-2 h-2 rounded-full"
                          style={{ background: lead.tempColor }}
                          title={lead.temp}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Floating notification */}
              <div
                className="absolute -top-3 -right-3 rounded-xl border px-4 py-3 max-w-[200px]"
                style={{
                  background: "rgba(21,30,45,0.97)",
                  borderColor: "rgba(120,133,255,0.3)",
                  backdropFilter: "blur(8px)",
                }}
              >
                <p className="text-xs font-semibold text-[#7885FF] mb-0.5">New lead synced</p>
                <p className="text-[10px] text-[#4E5D6E]">From Meta Ads · just now</p>
              </div>

              {/* Floating AI badge */}
              <div
                className="absolute -bottom-3 -left-3 rounded-xl border px-4 py-3"
                style={{
                  background: "rgba(21,30,45,0.97)",
                  borderColor: "rgba(120,230,179,0.25)",
                  backdropFilter: "blur(8px)",
                }}
              >
                <p className="text-xs font-semibold text-[#78E6B3] mb-0.5">AI agent replied</p>
                <p className="text-[10px] text-[#4E5D6E]">Qualification started · WhatsApp</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features grid */}
      <section className="py-24 bg-[#0D1420]" aria-label="SyncLead features">
        <div className="container-wide">
          <div className="text-center mb-16">
            <p className="eyebrow text-[#4E5D6E] mb-4">What it does</p>
            <h2 className="font-display text-[clamp(2rem,4vw,3rem)] font-bold text-white mb-4">
              Everything your sales team needs.<br />Nothing they don&apos;t.
            </h2>
            <p className="text-[#7A8799] max-w-xl mx-auto">
              SyncLead focuses on one job: make sure every Meta Ads lead gets contacted quickly and followed up properly.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
            {app.features.map((feature) => {
              const Icon = ICON_MAP[feature.icon] ?? Zap
              return (
                <div
                  key={feature.title}
                  className="rounded-2xl p-6 border"
                  style={{
                    background: "rgba(120,133,255,0.04)",
                    borderColor: "rgba(120,133,255,0.12)",
                  }}
                >
                  <div className="w-10 h-10 rounded-xl bg-[#7885FF]/10 border border-[#7885FF]/20 flex items-center justify-center mb-4">
                    <Icon size={18} className="text-[#7885FF]" />
                  </div>
                  <h3 className="text-sm font-bold text-white mb-2">{feature.title}</h3>
                  <p className="text-xs text-[#7A8799] leading-relaxed">{feature.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-24 bg-[#101827]" aria-label="How SyncLead works">
        <div className="container-wide">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-16">
              <p className="eyebrow text-[#4E5D6E] mb-4">How it works</p>
              <h2 className="font-display text-[clamp(2rem,4vw,3rem)] font-bold text-white">
                Set up in a day. Running from day one.
              </h2>
            </div>

            <div className="space-y-4">
              {HOW_IT_WORKS.map((step, i) => (
                <div
                  key={step.step}
                  className="flex gap-6 p-6 rounded-2xl border"
                  style={{
                    background: "rgba(120,133,255,0.04)",
                    borderColor: i === 0 ? "rgba(120,133,255,0.25)" : "rgba(120,133,255,0.08)",
                  }}
                >
                  <div className="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center font-display text-sm font-extrabold bg-[#7885FF]/10 text-[#7885FF]">
                    {step.step}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white mb-1.5">{step.title}</h3>
                    <p className="text-sm text-[#7A8799] leading-relaxed">{step.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Benefits / why it matters */}
      <section className="py-24 bg-[#0D1420]" aria-label="Why SyncLead">
        <div className="container-wide">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <p className="eyebrow text-[#4E5D6E] mb-4">Why it matters</p>
              <h2 className="font-display text-[clamp(2rem,4vw,2.75rem)] font-bold text-white mb-6">
                Speed to lead is{" "}
                <span style={{ color: "#7885FF" }}>everything in Meta Ads.</span>
              </h2>
              <p className="text-[#7A8799] leading-relaxed mb-8">
                Studies show that the probability of qualifying a lead drops by over 80% if you don&apos;t
                follow up within five minutes. Most businesses take hours — or never call at all.
              </p>
              <ul className="space-y-4">
                {[
                  "Leads synced in real time — not batch at the end of the day",
                  "Team notified via WhatsApp the moment a lead arrives",
                  "AI agent sends the first message before your rep even opens their laptop",
                  "Full conversation history tied to the lead record",
                  "Conversions sent back to Meta so your campaigns optimize for buyers",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm text-[#A8B3C0]">
                    <Check size={16} className="text-[#7885FF] flex-shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Stat cards */}
            <div className="grid grid-cols-2 gap-4">
              {[
                { value: "< 1s", label: "Lead sync time", sub: "from Meta form submit", color: "#7885FF" },
                { value: "24/7", label: "AI agent coverage", sub: "no human needed", color: "#78E6B3" },
                { value: "5×", label: "Faster response", sub: "vs. manual follow-up", color: "#FFCB86" },
                { value: "6+", label: "LLM providers", sub: "Claude, GPT, Gemini…", color: "#7885FF" },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-2xl p-6 border"
                  style={{
                    background: `${stat.color}08`,
                    borderColor: `${stat.color}20`,
                  }}
                >
                  <p
                    className="font-display text-[clamp(2rem,4vw,2.5rem)] font-extrabold mb-1"
                    style={{ color: stat.color }}
                  >
                    {stat.value}
                  </p>
                  <p className="text-sm font-semibold text-white mb-0.5">{stat.label}</p>
                  <p className="text-xs text-[#4E5D6E]">{stat.sub}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Pricing note */}
      <section className="py-20 bg-[#101827] border-t border-white/[0.06]" aria-label="SyncLead pricing">
        <div className="container-wide">
          <div className="max-w-2xl mx-auto">
            <div
              className="rounded-2xl p-8 border text-center"
              style={{
                background: "rgba(120,133,255,0.06)",
                borderColor: "rgba(120,133,255,0.2)",
              }}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold bg-[#7885FF]/10 text-[#7885FF] border border-[#7885FF]/20 mb-5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#7885FF] animate-pulse" />
                Private beta
              </div>
              <h2 className="font-display text-2xl font-bold text-white mb-4">Pricing</h2>
              <p className="text-[#7A8799] text-sm leading-relaxed mb-6">
                {app.pricingNote}
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                <a
                  href="#waitlist"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-[#7885FF] text-white font-semibold rounded-xl hover:bg-[#6672EE] transition-colors text-sm"
                >
                  Join the waitlist
                  <ArrowRight size={15} />
                </a>
                <Link
                  href="/audit"
                  className="inline-flex items-center gap-2 px-6 py-3 text-[#A8B3C0] font-semibold rounded-xl border border-white/10 hover:text-white hover:bg-white/5 transition-colors text-sm"
                >
                  Get it included with services
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24 bg-[#0D1420]" aria-label="SyncLead FAQ">
        <div className="container-wide">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <p className="eyebrow text-[#4E5D6E] mb-4">FAQ</p>
              <h2 className="font-display text-[clamp(2rem,4vw,2.75rem)] font-bold text-white">
                Questions about SyncLead.
              </h2>
            </div>

            <div className="space-y-3">
              {app.faqs.map((faq, i) => {
                const isOpen = openFaq === i
                return (
                  <div
                    key={i}
                    className="rounded-2xl overflow-hidden transition-all duration-200"
                    style={{
                      background: "rgba(21,30,45,0.8)",
                      border: `1px solid ${isOpen ? "rgba(120,133,255,0.25)" : "rgba(255,255,255,0.06)"}`,
                    }}
                  >
                    <button
                      type="button"
                      onClick={() => setOpenFaq(isOpen ? null : i)}
                      className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left"
                      aria-expanded={isOpen}
                    >
                      <span className="text-sm font-semibold text-white">{faq.q}</span>
                      <span className="flex-shrink-0 w-6 h-6 rounded-full bg-white/[0.05] flex items-center justify-center">
                        {isOpen
                          ? <ChevronUp size={12} className="text-[#7885FF]" />
                          : <ChevronDown size={12} className="text-[#4E5D6E]" />
                        }
                      </span>
                    </button>
                    {isOpen && (
                      <div className="px-6 pb-5">
                        <p className="text-sm text-[#7A8799] leading-relaxed">{faq.a}</p>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Waitlist form */}
      <section id="waitlist" className="py-24 bg-[#101827] border-t border-white/[0.06]" aria-label="Join SyncLead waitlist">
        <div className="container-wide">
          <div className="max-w-lg mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold bg-[#7885FF]/10 text-[#7885FF] border border-[#7885FF]/20 mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-[#7885FF] animate-pulse" />
              Early access
            </div>
            <h2 className="font-display text-[clamp(2rem,4vw,2.75rem)] font-bold text-white mb-4">
              Be first when SyncLead launches.
            </h2>
            <p className="text-[#7A8799] mb-10">
              Join the waitlist and get priority access, early-bird pricing, and direct input into the features we build next.
            </p>

            {form.status === "success" ? (
              <div className="rounded-2xl p-6 border border-[#78E6B3]/20 bg-[#78E6B3]/05">
                <Check size={24} className="text-[#78E6B3] mx-auto mb-3" />
                <p className="text-sm font-semibold text-white mb-1">You&apos;re on the list!</p>
                <p className="text-sm text-[#7A8799]">{form.message}</p>
              </div>
            ) : (
              <form onSubmit={handleWaitlist} className="flex flex-col sm:flex-row gap-3">
                <label htmlFor="waitlist-email" className="sr-only">Email address</label>
                <input
                  id="waitlist-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="flex-1 px-4 py-3 rounded-xl bg-white/[0.05] border border-white/[0.1] text-white placeholder:text-[#4E5D6E] text-sm focus:outline-none focus:border-[#7885FF]/40 focus:bg-[#7885FF]/5 transition-all"
                />
                <button
                  type="submit"
                  disabled={form.status === "loading"}
                  className="px-6 py-3 bg-[#7885FF] text-white font-semibold rounded-xl hover:bg-[#6672EE] transition-colors text-sm disabled:opacity-60 flex-shrink-0"
                >
                  {form.status === "loading" ? "Joining…" : "Join waitlist"}
                </button>
              </form>
            )}

            {form.status === "error" && (
              <p className="text-xs text-[#EF4444] mt-3">{form.message}</p>
            )}

            <p className="text-xs text-[#4E5D6E] mt-5">
              No spam. Unsubscribe at any time. Already a ClicKonversion client?{" "}
              <Link href="/audit" className="text-[#7885FF] hover:underline">
                You likely already have access.
              </Link>
            </p>
          </div>
        </div>
      </section>
    </MarketingLayout>
  )
}

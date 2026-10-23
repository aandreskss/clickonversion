"use client"

import { useState } from "react"
import { Plus, Minus } from "lucide-react"

const FAQS = [
  {
    q: "What services does ClicKonversion offer?",
    a: "We offer SEO (general and local), SEM / Google Ads, Meta Ads management and consulting, WhatsApp Business API (WABA) setup, AI chatbots, AI agents, marketing automation, and advisory services for businesses with Meta Ads problems. Everything is available individually or as an integrated system.",
  },
  {
    q: "Can you help if my Meta Ads account has problems or low performance?",
    a: "Yes. We do dedicated Meta Ads audits and consulting — including accounts with billing issues, restricted accounts, low-quality leads, high CPMs, or campaigns that stopped performing. We identify the root cause and give you a clear action plan, whether or not we manage the account.",
  },
  {
    q: "What is WhatsApp Business API (WABA) and why do I need it?",
    a: "The official API gives you capabilities the regular WhatsApp app doesn't: multi-agent shared inboxes, automated sequences, chatbots, AI agents, broadcast campaigns to opted-in contacts, and CRM integration. If WhatsApp is how your customers reach you — or how you want to reach them — the API is the right foundation.",
  },
  {
    q: "What's the difference between a chatbot and an AI agent?",
    a: "A chatbot follows a fixed script — if the user goes off-script, it breaks. An AI agent understands natural language, handles unexpected questions, and can take actions (like booking appointments or querying your CRM) autonomously. We build both, depending on what your use case actually needs.",
  },
  {
    q: "Do you work with businesses outside Latin America?",
    a: "Yes. We work with businesses in the US, Spain, Mexico, Colombia, Venezuela, and across Latin America. Our team operates in English and Spanish, and our services are built for international markets.",
  },
  {
    q: "How quickly will I see results?",
    a: "Meta Ads and Google Ads can show results within the first two weeks. WhatsApp automation and AI chatbots go live in days. SEO takes 3–6 months to compound, but the results are more durable. We always tell you what to expect from each channel before we start.",
  },
  {
    q: "What does SyncLead do?",
    a: "SyncLead automatically imports leads from Meta Ads into a visual pipeline in real time — zero manual exports, no CSV files. Your team gets a WhatsApp notification the moment a lead comes in, so response time drops from hours to seconds. It's included with our Meta Ads and automation services.",
  },
  {
    q: "How do I get started?",
    a: "Request a free growth audit. We review your current situation — ad accounts, search presence, WhatsApp setup, automations — and give you a prioritized roadmap specific to your business. No templates, no generic recommendations.",
  },
]

export function HomepageFaq() {
  const [open, setOpen] = useState<number | null>(null)

  return (
    <section className="py-24 bg-[#101827]" aria-label="Frequently asked questions">
      <div className="container-wide">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-14">
            <p className="eyebrow text-[#4E5D6E] mb-4">FAQ</p>
            <h2 className="font-display text-[clamp(2rem,4vw,3rem)] font-bold text-white">
              Questions we get a lot.
            </h2>
          </div>

          <div className="space-y-3">
            {FAQS.map((faq, i) => {
              const isOpen = open === i
              return (
                <div
                  key={i}
                  className="card-midnight rounded-2xl overflow-hidden transition-all duration-200"
                  style={{ borderColor: isOpen ? "rgba(120,230,179,0.2)" : undefined }}
                >
                  <button
                    type="button"
                    onClick={() => setOpen(isOpen ? null : i)}
                    className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left"
                    aria-expanded={isOpen}
                  >
                    <span className="text-sm font-semibold text-white">{faq.q}</span>
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-white/[0.05] flex items-center justify-center">
                      {isOpen
                        ? <Minus size={12} className="text-[#78E6B3]" />
                        : <Plus size={12} className="text-[#4E5D6E]" />
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
  )
}

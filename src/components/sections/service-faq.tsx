"use client"

import { useState } from "react"
import { ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"
import type { ServiceFAQ } from "@/data/services"

interface ServiceFaqProps {
  faqs: ServiceFAQ[]
  accentColor: string
}

export function ServiceFaq({ faqs, accentColor }: ServiceFaqProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <div className="max-w-3xl mx-auto space-y-3">
      {faqs.map((faq, i) => {
        const isOpen = openIndex === i
        return (
          <div
            key={i}
            className="rounded-xl border border-white/[0.07] bg-white/[0.03] overflow-hidden"
          >
            <button
              onClick={() => setOpenIndex(isOpen ? null : i)}
              className="w-full flex items-center justify-between px-6 py-5 text-left gap-4 group"
              aria-expanded={isOpen}
            >
              <span className="text-white font-medium text-sm leading-relaxed group-hover:text-white/90 transition-colors">
                {faq.q}
              </span>
              <ChevronDown
                size={16}
                className={cn(
                  "flex-shrink-0 text-[#4E5D6E] transition-transform duration-200",
                  isOpen && "rotate-180"
                )}
                style={isOpen ? { color: accentColor } : undefined}
              />
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
  )
}

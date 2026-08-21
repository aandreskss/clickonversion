"use client"

import { useEffect }       from "react"
import Link                from "next/link"
import { CheckCircle, ArrowRight, Calendar } from "lucide-react"
import { MarketingLayout } from "@/components/marketing/marketing-layout"
import { analytics }       from "@/lib/analytics"

const bookingUrl = process.env.NEXT_PUBLIC_BOOKING_URL ?? "#"

export default function ThankYouPage() {
  useEffect(() => { analytics.pageView("/thank-you") }, [])

  return (
    <MarketingLayout>
      <section className="section-dark min-h-screen flex items-center py-24 pt-32">
        <div className="container-tight text-center">
          {/* Icon */}
          <div className="flex justify-center mb-8">
            <div className="w-16 h-16 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center">
              <CheckCircle size={32} className="text-green-400" />
            </div>
          </div>

          <h1 className="text-4xl lg:text-5xl font-bold text-white mb-5 leading-tight">
            Your audit request is in.
          </h1>

          <p className="text-lg text-[#8A9099] max-w-xl mx-auto leading-relaxed mb-10">
            We&apos;ll review your search visibility, website, conversion path, and acquisition setup. Expect to hear from us within one business day.
          </p>

          {/* What happens next */}
          <div className="rounded-2xl border border-white/8 bg-[#14171A] p-8 max-w-lg mx-auto mb-12 text-left">
            <p className="text-xs font-semibold tracking-widest text-[#FF5A1F] uppercase mb-5">
              What happens next
            </p>
            <div className="flex flex-col gap-4">
              {[
                { step: "01", text: "We review your website, search visibility, and conversion setup." },
                { step: "02", text: "We prepare a focused audit with the most impactful findings." },
                { step: "03", text: "We reach out to schedule a 20-minute walk-through call." },
              ].map(({ step, text }) => (
                <div key={step} className="flex items-start gap-3">
                  <span className="text-xs font-bold text-[#FF5A1F] mt-0.5 w-6 flex-shrink-0">{step}</span>
                  <p className="text-sm text-[#8A9099]">{text}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Booking CTA */}
          <div className="rounded-2xl border border-[#FF5A1F]/20 bg-[#FF5A1F]/5 p-8 max-w-lg mx-auto">
            <Calendar size={24} className="text-[#FF5A1F] mx-auto mb-4" />
            <h2 className="text-xl font-bold text-white mb-3">
              Want to walk through it together?
            </h2>
            <p className="text-sm text-[#8A9099] mb-6">
              Book a 20-minute call and we&apos;ll show you exactly what we found and what we&apos;d prioritize first.
            </p>
            <a
              href={bookingUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => analytics.bookingClick("thank-you-page")}
              className="inline-flex items-center gap-2 px-7 py-3.5 bg-[#FF5A1F] text-white font-semibold rounded-lg hover:bg-[#E54A15] transition-colors duration-150 active:scale-[0.98]"
            >
              Book a 20-Minute Growth Call
              <ArrowRight size={18} />
            </a>
          </div>

          <div className="mt-10">
            <Link href="/" className="text-sm text-[#546072] hover:text-white transition-colors">
              ← Back to ClicKonversion
            </Link>
          </div>
        </div>
      </section>
    </MarketingLayout>
  )
}

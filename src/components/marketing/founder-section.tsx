"use client"

import { useState } from "react"
import Image from "next/image"
import { analytics } from "@/lib/analytics"

const FOUNDER = {
  name:     "Arnaldo Casadiego",
  role:     "Founder — ClicKonversion",
  linkedin: "https://www.linkedin.com/in/arnaldocasadiego/",
  photo:    "/founder.jpg",
}

const EXPERTISE = [
  "SEO & Search",
  "Paid Acquisition",
  "CRM & Conversion",
  "AI & Automation",
]

export function FounderSection() {
  const [photoError, setPhotoError] = useState(false)

  return (
    <section className="section-surface py-24 lg:py-32">
      <div className="container-wide">
        <div className="max-w-5xl mx-auto">
          <div className="grid lg:grid-cols-5 gap-12 lg:gap-16 items-center">

            {/* Photo / monogram */}
            <div className="lg:col-span-2 flex justify-center lg:justify-end">
              <div className="relative">
                <div
                  className="w-56 h-56 lg:w-64 lg:h-64 rounded-3xl relative overflow-hidden"
                  style={{ border: "1px solid rgba(255,90,31,0.2)" }}
                >
                  {!photoError ? (
                    <Image
                      src={FOUNDER.photo}
                      alt="Arnaldo Casadiego, Founder of ClicKonversion"
                      fill
                      className="object-cover object-center"
                      sizes="(max-width: 1024px) 224px, 256px"
                      onError={() => setPhotoError(true)}
                    />
                  ) : (
                    <div
                      className="w-full h-full flex items-center justify-center"
                      style={{ background: "linear-gradient(135deg, #14171A 0%, #1C2430 100%)" }}
                    >
                      {/* Geometric accents */}
                      <div
                        className="absolute top-0 right-0 w-24 h-24 opacity-10 rounded-bl-full"
                        style={{ background: "#FF5A1F" }}
                        aria-hidden="true"
                      />
                      <div
                        className="absolute bottom-0 left-0 w-16 h-16 opacity-8 rounded-tr-full"
                        style={{ background: "#FF5A1F" }}
                        aria-hidden="true"
                      />
                      <div className="text-center relative z-10">
                        <span
                          className="block text-8xl font-bold leading-none tracking-tighter"
                          style={{
                            background: "linear-gradient(135deg, #FF5A1F 0%, #FF8A50 100%)",
                            WebkitBackgroundClip: "text",
                            WebkitTextFillColor: "transparent",
                            backgroundClip: "text",
                          }}
                        >
                          AC
                        </span>
                        <div className="mt-3 flex justify-center gap-1" aria-hidden="true">
                          {[0, 1, 2, 3].map((i) => (
                            <div
                              key={i}
                              className={`h-1 rounded-full ${i === 0 ? "w-6 bg-[#FF5A1F]" : "w-1.5 bg-white/10"}`}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Badge */}
                <div className="absolute -bottom-3 -right-3 bg-[#FF5A1F] text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
                  Founder-led
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="lg:col-span-3 flex flex-col gap-6">
              <div>
                <p className="text-xs font-semibold tracking-widest text-[#FF5A1F] uppercase mb-4">
                  Who&apos;s Behind ClicKonversion
                </p>
                <h2 className="text-3xl lg:text-4xl font-bold text-white leading-tight mb-1">
                  {FOUNDER.name}
                </h2>
                <p className="text-sm font-medium text-[#546072] mb-6">{FOUNDER.role}</p>
                <p className="text-base text-[#8A9099] leading-relaxed">
                  ClicKonversion is built around hands-on expertise across SEO, paid acquisition,
                  CRM, conversion strategy, analytics and AI-enabled workflows — applied directly
                  to your business, not delegated to a junior team.
                </p>
              </div>

              {/* Expertise areas */}
              <div className="grid grid-cols-2 gap-2.5">
                {EXPERTISE.map((area) => (
                  <div
                    key={area}
                    className="flex items-center gap-2.5 px-4 py-3 rounded-xl border border-white/8 bg-[#0B0D0F]"
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-[#FF5A1F] flex-shrink-0" aria-hidden="true" />
                    <span className="text-sm font-medium text-[#B0B8C1]">{area}</span>
                  </div>
                ))}
              </div>

              {/* LinkedIn CTA */}
              <div>
                <a
                  href={FOUNDER.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => analytics.founderLinkedInClick()}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border border-white/12 text-[#B0B8C1] text-sm font-medium hover:bg-white/5 hover:text-white transition-all duration-150"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="text-[#0A66C2]" aria-hidden="true">
                    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
                    <rect x="2" y="9" width="4" height="12"/>
                    <circle cx="4" cy="4" r="2"/>
                  </svg>
                  Connect on LinkedIn
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

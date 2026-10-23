export function Testimonials() {
  return (
    <section className="py-24 section-light" aria-label="Client testimonials">
      <div className="container-wide">
        <div className="text-center mb-16">
          <p className="eyebrow text-[#546072] mb-4">What clients say</p>
          <h2 className="font-display text-[clamp(2rem,4vw,3rem)] font-bold text-[#0F172A] mb-4">
            Real outcomes from real partnerships.
          </h2>
          <p className="text-[#475569] max-w-md mx-auto">
            Testimonials are added as client relationships allow. No invented quotes.
          </p>
        </div>

        {/* Placeholder grid — fills with verified testimonials */}
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { accent: "#78E6B3", sector: "E-commerce · Latin America" },
            { accent: "#7885FF", sector: "Professional Services · United States" },
            { accent: "#FFCB86", sector: "Healthcare · Spain" },
          ].map((t) => (
            <div
              key={t.sector}
              className="bg-white rounded-2xl p-8 border border-[#E2E8F0] flex flex-col gap-6"
            >
              {/* Stars */}
              <div className="flex gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <svg key={i} width="16" height="16" viewBox="0 0 16 16" fill={t.accent}>
                    <path d="M8 1l1.85 3.74L14 5.5l-3 2.92.71 4.13L8 10.27 4.29 12.55 5 8.42 2 5.5l4.15-.76L8 1z"/>
                  </svg>
                ))}
              </div>

              {/* Placeholder quote */}
              <div className="space-y-2">
                <div className="h-3 bg-[#F1F5F9] rounded-full w-full" />
                <div className="h-3 bg-[#F1F5F9] rounded-full w-5/6" />
                <div className="h-3 bg-[#F1F5F9] rounded-full w-4/6" />
              </div>

              {/* Author */}
              <div className="flex items-center gap-3 pt-2 border-t border-[#F1F5F9]">
                <div
                  className="w-9 h-9 rounded-full"
                  style={{ background: `${t.accent}20` }}
                />
                <div className="space-y-1.5">
                  <div className="h-2.5 bg-[#F1F5F9] rounded-full w-24" />
                  <p className="text-xs text-[#94A3B8]">{t.sector}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <p className="text-center text-xs text-[#94A3B8] mt-8">
          Verified testimonials are published with client consent. More coming soon.
        </p>
      </div>
    </section>
  )
}

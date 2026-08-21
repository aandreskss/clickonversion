const INDUSTRIES = [
  "Cleaning",
  "Roofing",
  "HVAC",
  "Remodeling",
  "Landscaping",
  "Plumbing",
  "Painting",
  "Pest Control",
]

export function IndustriesSection() {
  return (
    <section className="section-dark py-16 lg:py-20 border-t border-white/6">
      <div className="container-wide">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-xs font-semibold tracking-widest text-[#FF5A1F] uppercase mb-4">
            Who We Work With
          </p>
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-5 leading-tight">
            Built for service businesses.
          </h2>
          <p className="text-base text-[#8A9099] leading-relaxed mb-10 max-w-xl mx-auto">
            If customers search for your service before they call, ClicKonversion can help you
            build a better acquisition system.
          </p>

          <div className="flex flex-wrap justify-center gap-3" role="list" aria-label="Industries served">
            {INDUSTRIES.map((industry) => (
              <div
                key={industry}
                role="listitem"
                className="px-5 py-2.5 rounded-full border border-white/10 bg-white/[0.03] text-sm font-medium text-[#B0B8C1] hover:border-[#FF5A1F]/30 hover:text-white transition-colors duration-150 cursor-default"
              >
                {industry}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

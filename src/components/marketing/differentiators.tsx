const POINTS = [
  {
    heading: "We look beyond traffic.",
    body: "A click has little value if the visitor never becomes a lead. Every engagement starts with understanding the full acquisition path — from search query to signed contract.",
  },
  {
    heading: "Strategy and execution live together.",
    body: "SEO, paid acquisition, conversion, and measurement are considered as one system — not handed off to four different vendors who never talk to each other.",
  },
  {
    heading: "Decisions are based on evidence.",
    body: "Search data, conversion behavior, and pipeline signals determine what gets prioritized. Not what's trendy, not what's comfortable — what the data says has the highest impact.",
  },
  {
    heading: "Built to become smarter.",
    body: "The systems we build now are designed to feed future automation and AI workflows as your business grows. Clean data from day one is the only way to make that work.",
  },
]

export function Differentiators() {
  return (
    <section className="section-dark py-24 lg:py-32">
      <div className="container-wide">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <p className="text-xs font-semibold tracking-widest text-[#FF5A1F] uppercase mb-4">
            Why ClicKonversion
          </p>
          <h2 className="text-4xl lg:text-5xl font-bold text-white leading-tight">
            Senior thinking without
            <br />
            agency bloat.
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {POINTS.map((point, i) => (
            <div
              key={i}
              className="rounded-2xl border border-white/8 bg-[#14171A] p-8 hover:border-white/15 transition-colors duration-200"
            >
              <div className="flex items-start gap-4">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-[#FF5A1F] flex-shrink-0 mt-0.5"
                  style={{ background: "rgba(255,90,31,0.1)", border: "1px solid rgba(255,90,31,0.2)" }}
                >
                  {String(i + 1)}
                </div>
                <div>
                  <h3 className="text-base font-bold text-white mb-3">{point.heading}</h3>
                  <p className="text-sm text-[#546072] leading-relaxed">{point.body}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Founder note */}
        <div className="mt-12 rounded-2xl border border-white/8 bg-[#14171A] p-8 max-w-3xl mx-auto text-center">
          <h3 className="text-lg font-bold text-white mb-3">
            Founder-led. Hands-on. Commercially focused.
          </h3>
          <p className="text-sm text-[#546072] leading-relaxed">
            ClicKonversion is built around direct expertise across SEO, paid acquisition, CRM, conversion strategy, analytics, and AI-enabled workflows — applied directly to your business, not delegated to a junior team.
          </p>
        </div>
      </div>
    </section>
  )
}

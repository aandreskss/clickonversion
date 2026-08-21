const STAGES = [
  {
    number: "01",
    title: "Attract",
    description: "Get discovered by people already searching for your service.",
    tags: ["SEO", "Local Search", "Paid Search"],
    color: "#546072",
  },
  {
    number: "02",
    title: "Capture",
    description: "Turn traffic into measurable opportunities with clear conversion paths.",
    tags: ["Landing Pages", "Calls", "Forms", "CRO"],
    color: "#6E7D8F",
  },
  {
    number: "03",
    title: "Convert",
    description: "Improve the experience between someone's first interest and their decision.",
    tags: ["Messaging", "Offers", "Friction Reduction"],
    color: "#FF8A50",
  },
  {
    number: "04",
    title: "Follow Up",
    description: "Prevent qualified leads from disappearing because of slow or inconsistent outreach.",
    tags: ["CRM", "Lead Workflows", "Automation"],
    color: "#FF6B35",
  },
  {
    number: "05",
    title: "Measure",
    description: "Know exactly which activities produce customers, not just which produce clicks.",
    tags: ["GA4", "Search Console", "Conversion Tracking", "Pipeline"],
    color: "#FF5A1F",
  },
]

export function SystemSection() {
  return (
    <section id="system" className="section-dark py-24 lg:py-32">
      <div className="container-wide">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <p className="text-xs font-semibold tracking-widest text-[#FF5A1F] uppercase mb-4">
            The System
          </p>
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
            One growth system.
            <br />
            Five jobs.
          </h2>
          <p className="text-lg text-[#8A9099]">
            Each stage does a specific job. Together, they turn search visibility into revenue.
          </p>
        </div>

        {/* Desktop: horizontal flow */}
        <div className="hidden lg:flex items-stretch gap-3">
          {STAGES.map((stage, i) => (
            <div key={stage.number} className="flex-1 flex gap-3 items-stretch">
              <div className="flex-1 rounded-2xl border border-white/8 bg-[#14171A] p-6 hover:border-white/15 transition-colors duration-200">
                <div className="flex items-center gap-3 mb-4">
                  <span
                    className="text-2xl font-bold"
                    style={{ color: stage.color }}
                  >
                    {stage.number}
                  </span>
                  <h3 className="text-base font-bold text-white">{stage.title}</h3>
                </div>
                <p className="text-sm text-[#546072] leading-relaxed mb-4">
                  {stage.description}
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {stage.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-0.5 text-xs font-medium rounded-md"
                      style={{
                        backgroundColor: `${stage.color}15`,
                        color: stage.color,
                        border: `1px solid ${stage.color}25`,
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              {i < STAGES.length - 1 && (
                <div className="flex items-center">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                    <path d="M7 10h9M13 7l3 3-3 3" stroke="#2A3340" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Mobile: vertical stack */}
        <div className="lg:hidden flex flex-col gap-4">
          {STAGES.map((stage, i) => (
            <div key={stage.number}>
              <div className="rounded-xl border border-white/8 bg-[#14171A] p-6">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-xl font-bold" style={{ color: stage.color }}>
                    {stage.number}
                  </span>
                  <h3 className="text-base font-bold text-white">{stage.title}</h3>
                </div>
                <p className="text-sm text-[#546072] leading-relaxed mb-3">
                  {stage.description}
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {stage.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-0.5 text-xs font-medium rounded-md"
                      style={{
                        backgroundColor: `${stage.color}15`,
                        color: stage.color,
                        border: `1px solid ${stage.color}25`,
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              {i < STAGES.length - 1 && (
                <div className="flex justify-center py-1" aria-hidden="true">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M10 7v9M7 13l3 3 3-3" stroke="#2A3340" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

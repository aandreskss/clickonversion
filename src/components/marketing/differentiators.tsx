const CHANNELS = [
  {
    label: "SEO",
    role: "Shows what people are actively searching for — the most direct signal of buyer intent.",
  },
  {
    label: "Paid Acquisition",
    role: "Shows what generates demand and conversions quickly, and validates what organic search should target.",
  },
  {
    label: "CRO",
    role: "Shows where visitors become leads or drop — and what's standing between attention and action.",
  },
  {
    label: "CRM",
    role: "Shows whether leads actually turn into opportunities — and where the follow-up breaks down.",
  },
  {
    label: "Analytics",
    role: "Connects acquisition to measurable outcomes — so you know what generates customers, not just clicks.",
  },
]

const PRINCIPLES = [
  {
    heading: "Decisions are based on evidence.",
    body: "Search data, conversion behavior, and pipeline signals determine what gets prioritized. Not what's trendy — what the data says has the highest impact.",
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

        {/* Header */}
        <div className="max-w-3xl mb-16">
          <p className="text-xs font-semibold tracking-widest text-[#FF5A1F] uppercase mb-4">
            Why ClicKonversion
          </p>
          <h2 className="text-4xl lg:text-5xl font-bold text-white leading-tight mb-6">
            Stop paying for
            <br />
            disconnected marketing.
          </h2>
          <p className="text-lg text-[#8A9099] leading-relaxed">
            Most service businesses have SEO running separately from paid, paid running separately
            from their website, and their website disconnected from any follow-up.
            Nobody connects the full picture.
          </p>
        </div>

        {/* How each channel connects */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          {CHANNELS.map((channel) => (
            <div
              key={channel.label}
              className="rounded-2xl border border-white/8 bg-[#14171A] p-6 hover:border-white/15 transition-colors duration-200"
            >
              <span
                className="inline-block text-xs font-bold px-2.5 py-1 rounded-md mb-4"
                style={{ backgroundColor: "rgba(255,90,31,0.1)", color: "#FF5A1F", border: "1px solid rgba(255,90,31,0.2)" }}
              >
                {channel.label}
              </span>
              <p className="text-sm text-[#8A9099] leading-relaxed">{channel.role}</p>
            </div>
          ))}

          {/* Connecting banner spans full row */}
          <div className="md:col-span-2 lg:col-span-3 rounded-2xl border border-[#FF5A1F]/20 bg-[#FF5A1F]/5 p-6 flex items-center justify-center">
            <p className="text-base font-semibold text-white text-center">
              ClicKonversion connects the complete system —
              <span className="text-[#FF5A1F]"> so every channel feeds the next.</span>
            </p>
          </div>
        </div>

        {/* Additional principles */}
        <div className="grid md:grid-cols-2 gap-4 mb-10">
          {PRINCIPLES.map((point, i) => (
            <div
              key={i}
              className="rounded-2xl border border-white/8 bg-[#14171A] p-8 hover:border-white/15 transition-colors duration-200"
            >
              <div className="flex items-start gap-4">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-[#FF5A1F] flex-shrink-0 mt-0.5"
                  style={{ background: "rgba(255,90,31,0.1)", border: "1px solid rgba(255,90,31,0.2)" }}
                  aria-hidden="true"
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
      </div>
    </section>
  )
}

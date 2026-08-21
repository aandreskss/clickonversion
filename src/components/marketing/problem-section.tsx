const DISCONNECTED = [
  { label: "SEO", note: "generates visits" },
  { label: "Ads", note: "generates clicks" },
  { label: "Website", note: "has a contact form" },
  { label: "CRM", note: "has some contacts" },
  { label: "Analytics", note: "reports traffic" },
]

const CONNECTED = [
  { label: "Demand", color: "#546072" },
  { label: "Capture", color: "#6E7D8F" },
  { label: "Convert", color: "#FF8A50" },
  { label: "Follow-up", color: "#FF6B35" },
  { label: "Revenue", color: "#FF5A1F" },
]

export function ProblemSection() {
  return (
    <section id="problem" className="section-surface py-24 lg:py-32">
      <div className="container-wide">
        <div className="max-w-3xl mb-16">
          <p className="text-xs font-semibold tracking-widest text-[#FF5A1F] uppercase mb-4">
            The Problem
          </p>
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
            Traffic isn&apos;t the goal.
            <br />
            <span className="text-[#8A9099]">Revenue is.</span>
          </h2>
          <p className="text-lg text-[#8A9099] leading-relaxed">
            Most service businesses have marketing activities that don&apos;t talk to each other. Clicks happen. Leads disappear. Nobody connects the full picture from search to customer.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 items-center">
          {/* Disconnected */}
          <div className="rounded-2xl border border-white/8 bg-[#0B0D0F] p-8">
            <p className="text-xs font-semibold tracking-wider text-[#3D4A5C] uppercase mb-6">
              The Typical Setup
            </p>
            <div className="flex flex-col gap-3">
              {DISCONNECTED.map((item) => (
                <div
                  key={item.label}
                  className="flex items-center justify-between p-4 rounded-lg border border-white/6 bg-white/[0.02]"
                >
                  <span className="text-sm font-semibold text-[#6E7D8F]">{item.label}</span>
                  <span className="text-xs text-[#3D4A5C]">{item.note}</span>
                </div>
              ))}
              <div className="mt-2 p-4 rounded-lg border border-red-500/15 bg-red-500/5">
                <p className="text-xs text-red-400">
                  Nobody connects them. Leads fall through. Attribution is guesswork.
                </p>
              </div>
            </div>
          </div>

          {/* Connected */}
          <div className="rounded-2xl border border-[#FF5A1F]/20 bg-[#0B0D0F] p-8">
            <p className="text-xs font-semibold tracking-wider text-[#FF5A1F] uppercase mb-6">
              The ClicKonversion System
            </p>
            <div className="flex flex-col gap-0">
              {CONNECTED.map((item, i) => (
                <div key={item.label} className="flex items-center gap-4">
                  <div className="flex flex-col items-center">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                      style={{ backgroundColor: item.color }}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </div>
                    {i < CONNECTED.length - 1 && (
                      <div
                        className="w-0.5 h-8"
                        style={{
                          background: `linear-gradient(${item.color}, ${CONNECTED[i + 1].color})`,
                        }}
                      />
                    )}
                  </div>
                  <p className="text-sm font-semibold text-white py-2">{item.label}</p>
                </div>
              ))}
              <div className="mt-4 p-4 rounded-lg border border-green-500/15 bg-green-500/5">
                <p className="text-xs text-green-400">
                  Every stage connects. You know what generates revenue.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

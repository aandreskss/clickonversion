const PRINCIPLES = [
  {
    number: "01",
    title: "Diagnose before prescribing",
    description:
      "Every engagement starts with a real audit — your ad accounts, search rankings, WhatsApp setup, and automations. We identify what's actually limiting growth before recommending anything.",
    accent: "#78E6B3",
  },
  {
    number: "02",
    title: "Channels that talk to each other",
    description:
      "SEO generates intent. Meta Ads generates demand. WhatsApp captures it. AI qualifies it. We build these channels as one system — not four separate invoices.",
    accent: "#7885FF",
  },
  {
    number: "03",
    title: "No black boxes",
    description:
      "You own your accounts, your data, and your automations. We deliver full transparency on what we build and why — so you're never dependent on any single agency.",
    accent: "#FFCB86",
  },
  {
    number: "04",
    title: "Built to compound",
    description:
      "Good SEO compounds. Good automations scale. Good data improves AI. We build systems designed to get better over time — not campaigns that stop the moment you stop paying.",
    accent: "#FF5A1F",
  },
]

export function Methodology() {
  return (
    <section className="py-24 section-light" aria-label="Why ClicKonversion">
      <div className="container-wide">
        <div className="max-w-2xl mb-16">
          <p className="eyebrow text-[#546072] mb-4">Our approach</p>
          <h2 className="font-display text-[clamp(2rem,4vw,3rem)] font-bold text-[#0F172A] mb-4">
            We don&apos;t just run campaigns.{" "}
            <span
              style={{
                background: "linear-gradient(135deg, #16a34a 0%, #059669 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              We build systems.
            </span>
          </h2>
          <p className="text-[#475569] text-lg">
            The difference between an agency that spends your budget and one that grows your
            business is how they think, not just what they do.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {PRINCIPLES.map((p) => (
            <div
              key={p.number}
              className="bg-white rounded-2xl p-7 border border-[#E2E8F0] hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
            >
              <span
                className="font-display text-5xl font-extrabold block mb-4 leading-none"
                style={{ color: p.accent, opacity: 0.3 }}
              >
                {p.number}
              </span>
              <h3 className="font-display text-lg font-bold text-[#0F172A] mb-3">
                {p.title}
              </h3>
              <p className="text-sm text-[#64748B] leading-relaxed">
                {p.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

import { createClient } from "@/lib/supabase/server"

export default async function SettingsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const ga = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID
  const turnstile = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY
  const booking = process.env.NEXT_PUBLIC_BOOKING_URL

  return (
    <div className="p-6 lg:p-8 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-slate-900 mb-6">Settings</h1>

      {/* Account */}
      <Card title="Account">
        <Row label="Email" value={user?.email ?? "—"} />
        <Row label="Account type" value="Owner" />
      </Card>

      {/* Sales */}
      <Card title="Sales Configuration">
        <Row label="MRR Goal"      value="$2,000 / month" note="Configured in code (Phase 0 default)" />
        <Row label="Currency"      value="USD" />
        <Row label="Booking URL"   value={booking ?? "Not configured"} status={!!booking} />
      </Card>

      {/* Integrations */}
      <Card title="Integrations">
        <Row
          label="Google Analytics 4"
          value={ga ? `Configured (${ga})` : "Not configured"}
          status={!!ga}
          note={ga ? undefined : "Add NEXT_PUBLIC_GA_MEASUREMENT_ID to environment"}
        />
        <Row
          label="Cloudflare Turnstile"
          value={turnstile ? "Configured" : "Not configured (honeypot only)"}
          status={!!turnstile}
          note={turnstile ? undefined : "Add NEXT_PUBLIC_TURNSTILE_SITE_KEY + TURNSTILE_SECRET_KEY for full bot protection"}
        />
        <Row label="Google Search Console" value="Configure via DNS TXT record" note="See docs/DEPLOYMENT.md" />
        <Row label="Booking" value={booking ? "Configured" : "Not configured"} status={!!booking} note={booking ? undefined : "Add NEXT_PUBLIC_BOOKING_URL"} />
      </Card>

      {/* Docs */}
      <Card title="Documentation">
        <div className="flex flex-col gap-2">
          {[
            ["DEPLOYMENT.md",  "Supabase, Vercel, DNS, GA4, Turnstile setup"],
            ["CRM.md",         "Pipeline stages, workflows, metrics"],
            ["BRAND.md",       "Colors, typography, voice, copy rules"],
            ["PHASE-0.md",     "Full Phase 0 scope and architecture"],
          ].map(([file, desc]) => (
            <div key={file} className="flex items-start gap-2">
              <span className="text-xs font-mono text-[#FF5A1F] w-32 flex-shrink-0">{file}</span>
              <span className="text-xs text-slate-500">{desc}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 mb-5">
      <h2 className="text-sm font-semibold text-slate-900 mb-4">{title}</h2>
      <div className="flex flex-col gap-3">{children}</div>
    </div>
  )
}

function Row({
  label, value, note, status,
}: {
  label: string
  value: string
  note?: string
  status?: boolean
}) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div>
        <p className="text-sm text-slate-700">{label}</p>
        {note && <p className="text-xs text-slate-400 mt-0.5">{note}</p>}
      </div>
      <div className="text-right flex-shrink-0">
        <span className="text-sm font-medium text-slate-900">{value}</span>
        {status !== undefined && (
          <span
            className={`ml-2 px-1.5 py-0.5 text-xs font-bold rounded-full ${
              status ? "bg-green-50 text-green-600" : "bg-slate-100 text-slate-400"
            }`}
          >
            {status ? "✓" : "—"}
          </span>
        )}
      </div>
    </div>
  )
}

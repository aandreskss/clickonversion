import type { Metadata } from "next"
import Link from "next/link"
import { getPortalSession } from "@/lib/portal/auth"
import { getRequests } from "@/lib/portal/requests"
import type { PortalRequest } from "@/types/portal"

export const metadata: Metadata = { title: "Requests — Portal" }

const STATUS_CONFIG: Record<PortalRequest["status"], { label: string; dot: string }> = {
  pending_payment:        { label: "Pending payment",       dot: "bg-[#546072]" },
  pending_onboarding:     { label: "Pending onboarding",    dot: "bg-[#F59E0B]" },
  queued:                 { label: "Queued",                dot: "bg-[#3B82F6]" },
  waiting_client:         { label: "Waiting on you",        dot: "bg-[#F59E0B]" },
  consultation_scheduled: { label: "Consultation scheduled", dot: "bg-[#8B5CF6]" },
  in_progress:            { label: "In progress",           dot: "bg-[#FF5A1F]" },
  active:                 { label: "Active",                dot: "bg-[#22C55E]" },
  waiting_third_party:    { label: "Waiting (third party)", dot: "bg-[#F97316]" },
  review:                 { label: "In review",             dot: "bg-[#6366F1]" },
  paused:                 { label: "Paused",                dot: "bg-[#546072]" },
  completed:              { label: "Completed",             dot: "bg-[#78E6B3]" },
  cancelled:              { label: "Cancelled",             dot: "bg-[#EF4444]" },
  refunded:               { label: "Refunded",              dot: "bg-[#3D4A5C]" },
}

export default async function RequestsPage() {
  const session = await getPortalSession()
  if (!session) return null

  const requests = await getRequests(session.orgId)

  return (
    <div className="space-y-6 pb-24 lg:pb-0">
      <div>
        <h1 className="text-2xl font-bold text-white">Requests</h1>
        <p className="text-sm text-[#546072] mt-1">All your contracted services in one place.</p>
      </div>

      {requests.length === 0 ? (
        <div className="rounded-xl border border-white/8 bg-[#14171A] p-12 text-center">
          <p className="text-[#546072]">No requests yet.</p>
          <p className="text-sm text-[#3D4A5C] mt-2">
            Once you purchase a service, it will appear here.
          </p>
          <Link href="/services" className="mt-4 inline-block text-sm text-[#FF5A1F] hover:underline">
            Browse services →
          </Link>
        </div>
      ) : (
        <div className="space-y-2">
          {requests.map((r) => {
            const { label, dot } = STATUS_CONFIG[r.status]
            return (
              <Link
                key={r.id}
                href={`/portal/requests/${r.id}`}
                className="flex items-center justify-between p-4 rounded-xl border border-white/6 bg-[#14171A] hover:border-white/15 transition-colors group"
              >
                <div className="flex items-start gap-4 min-w-0">
                  <div className={`mt-1.5 w-2 h-2 rounded-full shrink-0 ${dot}`} />
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-white truncate">{r.serviceName}</p>
                    {r.scope && (
                      <p className="text-xs text-[#546072] mt-0.5 line-clamp-1">{r.scope}</p>
                    )}
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-xs text-[#546072]">{label}</span>
                      {r.estimatedStart && (
                        <span className="text-xs text-[#3D4A5C]">
                          Est. start: {new Date(r.estimatedStart).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                        </span>
                      )}
                      {r.specialistEmail && (
                        <span className="text-xs text-[#3D4A5C]">· {r.specialistEmail}</span>
                      )}
                    </div>
                  </div>
                </div>
                <span className="text-[#546072] group-hover:text-white transition-colors shrink-0 ml-4">→</span>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}

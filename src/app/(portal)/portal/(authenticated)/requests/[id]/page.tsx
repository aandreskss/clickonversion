import { notFound } from "next/navigation"
import type { Metadata } from "next"
import { getPortalSession } from "@/lib/portal/auth"
import { getRequest, getMilestones, getComments } from "@/lib/portal/requests"
import { getDocuments } from "@/lib/portal/documents"
import { RequestComments } from "@/components/portal/request-comments"
import { DocumentList } from "@/components/portal/document-list"
import { CheckCircle, Circle, Clock, ChevronLeft } from "lucide-react"
import Link from "next/link"
import type { PortalRequest } from "@/types/portal"

interface Props {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  return { title: `Request ${id.slice(0, 8).toUpperCase()} — Portal` }
}

const STATUS_COLORS: Record<PortalRequest["status"], string> = {
  pending_payment:        "text-[#546072] bg-white/5 border-white/10",
  pending_onboarding:     "text-[#F59E0B] bg-[#F59E0B]/10 border-[#F59E0B]/20",
  queued:                 "text-[#3B82F6] bg-[#3B82F6]/10 border-[#3B82F6]/20",
  waiting_client:         "text-[#F59E0B] bg-[#F59E0B]/10 border-[#F59E0B]/20",
  consultation_scheduled: "text-[#8B5CF6] bg-[#8B5CF6]/10 border-[#8B5CF6]/20",
  in_progress:            "text-[#FF5A1F] bg-[#FF5A1F]/10 border-[#FF5A1F]/20",
  active:                 "text-[#22C55E] bg-[#22C55E]/10 border-[#22C55E]/20",
  waiting_third_party:    "text-[#F97316] bg-[#F97316]/10 border-[#F97316]/20",
  review:                 "text-[#6366F1] bg-[#6366F1]/10 border-[#6366F1]/20",
  paused:                 "text-[#8A9099] bg-white/5 border-white/10",
  completed:              "text-[#78E6B3] bg-[#78E6B3]/10 border-[#78E6B3]/20",
  cancelled:              "text-[#EF4444] bg-[#EF4444]/10 border-[#EF4444]/20",
  refunded:               "text-[#3D4A5C] bg-white/5 border-white/10",
}

const STATUS_LABELS: Record<PortalRequest["status"], string> = {
  pending_payment:        "Pending payment",
  pending_onboarding:     "Pending onboarding",
  queued:                 "Queued",
  waiting_client:         "Waiting on you",
  consultation_scheduled: "Consultation scheduled",
  in_progress:            "In progress",
  active:                 "Active",
  waiting_third_party:    "Waiting (third party)",
  review:                 "In review",
  paused:                 "Paused",
  completed:              "Completed",
  cancelled:              "Cancelled",
  refunded:               "Refunded",
}

export default async function RequestDetailPage({ params }: Props) {
  const { id }   = await params
  const session  = await getPortalSession()
  if (!session) return null

  const [request, milestones, comments, documents] = await Promise.all([
    getRequest(id, session.orgId),
    getMilestones(id, session.orgId),
    getComments(id, session.orgId),
    getDocuments(session.orgId, id),
  ])

  if (!request) notFound()

  const completedMilestones = milestones.filter((m) => m.status === "completed").length
  const totalMilestones     = milestones.length

  return (
    <div className="space-y-8 max-w-3xl pb-24 lg:pb-0">
      {/* Back */}
      <Link href="/portal/requests" className="inline-flex items-center gap-1.5 text-sm text-[#546072] hover:text-white transition-colors">
        <ChevronLeft size={14} />
        All requests
      </Link>

      {/* Header */}
      <div className="space-y-3">
        <div className="flex items-start gap-3 flex-wrap">
          <h1 className="text-2xl font-bold text-white flex-1">{request.serviceName}</h1>
          <span className={`text-xs font-semibold px-3 py-1 rounded-full border ${STATUS_COLORS[request.status]}`}>
            {STATUS_LABELS[request.status]}
          </span>
        </div>
        {request.scope && (
          <p className="text-sm text-[#7A8799]">{request.scope}</p>
        )}
      </div>

      {/* Details */}
      <div className="rounded-xl border border-white/8 bg-[#14171A] overflow-hidden">
        <div className="divide-y divide-white/6">
          {[
            { label: "Request ID",       value: id.slice(0, 8).toUpperCase() },
            { label: "Service",          value: request.serviceName },
            { label: "Status",           value: STATUS_LABELS[request.status] },
            { label: "Purchase date",    value: request.createdAt ? new Date(request.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }) : "—" },
            { label: "Specialist",       value: request.specialistEmail ?? "Being assigned" },
            { label: "Estimated start",  value: request.estimatedStart ? new Date(request.estimatedStart).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }) : "—" },
          ].map(({ label, value }) => (
            <div key={label} className="flex items-center justify-between px-5 py-3 text-sm">
              <span className="text-[#546072]">{label}</span>
              <span className="text-white font-medium text-right">{value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Milestones */}
      {milestones.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold text-white">Milestones</h2>
            {totalMilestones > 0 && (
              <span className="text-xs text-[#546072]">{completedMilestones} / {totalMilestones} completed</span>
            )}
          </div>
          <ul className="space-y-2">
            {milestones.map((m) => (
              <li
                key={m.id}
                className={[
                  "flex items-start gap-3 p-4 rounded-xl border",
                  m.status === "completed"
                    ? "border-[#22C55E]/20 bg-[#22C55E]/5"
                    : m.status === "in_progress"
                    ? "border-[#FF5A1F]/20 bg-[#FF5A1F]/5"
                    : "border-white/6 bg-[#14171A]",
                ].join(" ")}
              >
                {m.status === "completed" ? (
                  <CheckCircle size={16} className="text-[#22C55E] mt-0.5 shrink-0" />
                ) : m.status === "in_progress" ? (
                  <Clock size={16} className="text-[#FF5A1F] mt-0.5 shrink-0" />
                ) : (
                  <Circle size={16} className="text-[#3D4A5C] mt-0.5 shrink-0" />
                )}
                <div>
                  <p className={`text-sm font-medium ${m.status === "completed" ? "text-[#78E6B3] line-through" : "text-white"}`}>
                    {m.title}
                  </p>
                  {m.description && (
                    <p className="text-xs text-[#546072] mt-0.5">{m.description}</p>
                  )}
                  {m.completedAt && (
                    <p className="text-xs text-[#3D4A5C] mt-1">
                      Completed {new Date(m.completedAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                    </p>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Documents */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold text-white">Documents</h2>
        </div>
        <DocumentList
          documents={documents}
          requestId={request.id}
          orgId={session.orgId}
        />
      </section>

      {/* Comments */}
      <section>
        <h2 className="text-base font-semibold text-white mb-4">Messages</h2>
        <RequestComments
          requestId={request.id}
          orgId={session.orgId}
          userId={session.userId}
          initialComments={comments}
        />
      </section>
    </div>
  )
}

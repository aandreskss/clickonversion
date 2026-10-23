import type { Metadata } from "next"
import { getPortalSession } from "@/lib/portal/auth"
import { getRequests } from "@/lib/portal/requests"
import { db } from "@/lib/db"
import { pfMeetings, pfOrders } from "@/lib/db/schema"
import { eq, and, inArray, asc, desc, gte } from "drizzle-orm"
import { FileText, CreditCard, Calendar, AlertCircle } from "lucide-react"
import Link from "next/link"
import type { PortalRequest } from "@/types/portal"

export const metadata: Metadata = { title: "Dashboard — Portal" }

function statusLabel(s: PortalRequest["status"]) {
  const map: Record<string, { label: string; color: string }> = {
    pending_onboarding: { label: "Pending onboarding", color: "text-[#F59E0B]" },
    active:             { label: "Active",              color: "text-[#22C55E]" },
    paused:             { label: "Paused",              color: "text-[#8A9099]" },
    completed:          { label: "Completed",           color: "text-[#78E6B3]" },
    cancelled:          { label: "Cancelled",           color: "text-[#EF4444]" },
  }
  return map[s] ?? { label: s, color: "text-white" }
}

export default async function DashboardPage() {
  const session = await getPortalSession()
  if (!session) return null

  const [requests, meetings, orders] = await Promise.all([
    getRequests(session.orgId),
    db
      .select({
        id: pfMeetings.id,
        meetingTypeSlug: pfMeetings.meetingTypeSlug,
        startTime: pfMeetings.startTime,
        videoCallUrl: pfMeetings.videoCallUrl,
        status: pfMeetings.status,
      })
      .from(pfMeetings)
      .where(
        and(
          eq(pfMeetings.clientEmail, session.email),
          inArray(pfMeetings.status, ["scheduled", "rescheduled"] as const),
          gte(pfMeetings.startTime, new Date()),
        )
      )
      .orderBy(asc(pfMeetings.startTime))
      .limit(3),
    db
      .select({
        id: pfOrders.id,
        orderNumber: pfOrders.orderNumber,
        status: pfOrders.status,
        totalUsd: pfOrders.totalUsd,
        createdAt: pfOrders.createdAt,
      })
      .from(pfOrders)
      .where(
        and(
          eq(pfOrders.clientEmail, session.email),
          eq(pfOrders.status, "paid"),
        )
      )
      .orderBy(desc(pfOrders.createdAt))
      .limit(5),
  ])

  const activeRequests    = requests.filter((r) => r.status === "active")
  const pendingOnboarding = requests.filter((r) => r.status === "pending_onboarding")

  const firstName = session.email.split("@")[0]

  return (
    <div className="space-y-8 pb-24 lg:pb-0">
      {/* Greeting */}
      <div>
        <h1 className="text-2xl font-bold text-white">
          Hello, {firstName} 👋
        </h1>
        <p className="text-[#546072] mt-1 text-sm">
          Here&apos;s a summary of your services with ClicKonversion.
        </p>
      </div>

      {/* Required actions */}
      {pendingOnboarding.length > 0 && (
        <div className="rounded-xl border border-[#F59E0B]/30 bg-[#F59E0B]/8 p-4">
          <div className="flex items-start gap-3">
            <AlertCircle size={18} className="text-[#F59E0B] mt-0.5 shrink-0" />
            <div>
              <p className="text-sm font-semibold text-white">
                Action required — {pendingOnboarding.length} service{pendingOnboarding.length > 1 ? "s" : ""} waiting for onboarding
              </p>
              <p className="text-xs text-[#7A8799] mt-0.5">
                Complete your onboarding forms so your specialist can get started.
              </p>
              <Link
                href="/portal/requests"
                className="mt-2 inline-block text-xs text-[#FF5A1F] hover:underline"
              >
                View requests →
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Active services", value: activeRequests.length,    icon: FileText,  href: "/portal/requests" },
          { label: "Total orders",    value: orders.length,             icon: CreditCard, href: "/portal/billing" },
          { label: "Upcoming calls",  value: meetings.length,           icon: Calendar,  href: "/book" },
          { label: "Pending setup",   value: pendingOnboarding.length,  icon: AlertCircle, href: "/portal/requests" },
        ].map(({ label, value, icon: Icon, href }) => (
          <Link
            key={label}
            href={href}
            className="rounded-xl border border-white/8 bg-[#14171A] p-4 hover:border-white/15 transition-colors"
          >
            <Icon size={16} className="text-[#FF5A1F] mb-3" />
            <p className="text-2xl font-bold text-white">{value}</p>
            <p className="text-xs text-[#546072] mt-0.5">{label}</p>
          </Link>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Active requests */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-white">Active requests</h2>
            <Link href="/portal/requests" className="text-xs text-[#FF5A1F] hover:underline">View all</Link>
          </div>
          {activeRequests.length === 0 ? (
            <p className="text-sm text-[#546072] py-4">No active requests yet.</p>
          ) : (
            <ul className="space-y-2">
              {activeRequests.slice(0, 4).map((r) => {
                const { label, color } = statusLabel(r.status)
                return (
                  <li key={r.id}>
                    <Link
                      href={`/portal/requests/${r.id}`}
                      className="flex items-center justify-between p-3 rounded-lg border border-white/6 bg-[#14171A] hover:border-white/15 transition-colors"
                    >
                      <div>
                        <p className="text-sm font-medium text-white truncate max-w-[200px]">{r.serviceName}</p>
                        <p className={`text-xs mt-0.5 ${color}`}>{label}</p>
                      </div>
                      <span className="text-xs text-[#546072]">→</span>
                    </Link>
                  </li>
                )
              })}
            </ul>
          )}
        </section>

        {/* Upcoming meetings */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-white">Upcoming meetings</h2>
            <Link href="/book" className="text-xs text-[#FF5A1F] hover:underline">Book a call</Link>
          </div>
          {meetings.length === 0 ? (
            <p className="text-sm text-[#546072] py-4">No upcoming meetings.</p>
          ) : (
            <ul className="space-y-2">
              {meetings.map((m) => {
                const start = m.startTime ? new Date(m.startTime) : null
                return (
                  <li key={m.id} className="p-3 rounded-lg border border-white/6 bg-[#14171A]">
                    <p className="text-sm font-medium text-white">{m.meetingTypeSlug.replace(/-/g, " ")}</p>
                    {start && (
                      <p className="text-xs text-[#546072] mt-0.5">
                        {start.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}
                        {" · "}
                        {start.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}
                      </p>
                    )}
                    {m.videoCallUrl && (
                      <a
                        href={m.videoCallUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-1 inline-block text-xs text-[#FF5A1F] hover:underline"
                      >
                        Join call →
                      </a>
                    )}
                  </li>
                )
              })}
            </ul>
          )}
        </section>
      </div>
    </div>
  )
}

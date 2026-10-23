import { getClient } from "@/lib/admin/commercial"
import { db } from "@/lib/db"
import { pfOrgMembers, pfPlatformUsers, pfRequests, pfSpecialistProfiles, users } from "@/lib/db/schema"
import { eq, asc, desc } from "drizzle-orm"
import { notFound } from "next/navigation"
import { StatusBadge } from "@/components/admin/status-badge"
import Link from "next/link"
import {
  ArrowLeft,
  Mail,
  Calendar,
  Users,
  Briefcase,
  Activity,
} from "lucide-react"
import type { AdminRequestStatus } from "@/types/admin"
import type { OrgMember } from "@/types/portal"

interface OrgRequest {
  id: string
  serviceName: string
  status: AdminRequestStatus
  createdAt: string
  specialistName: string | null
}

async function getOrgMembers(orgId: string): Promise<OrgMember[]> {
  const rows = await db
    .select({
      id: pfOrgMembers.id,
      orgId: pfOrgMembers.orgId,
      userId: pfOrgMembers.userId,
      role: pfOrgMembers.role,
      invitedBy: pfOrgMembers.invitedBy,
      joinedAt: pfOrgMembers.joinedAt,
      userEmail: users.email,
      userDisplayName: pfPlatformUsers.displayName,
    })
    .from(pfOrgMembers)
    .leftJoin(pfPlatformUsers, eq(pfOrgMembers.userId, pfPlatformUsers.id))
    .leftJoin(users, eq(pfPlatformUsers.id, users.id))
    .where(eq(pfOrgMembers.orgId, orgId))
    .orderBy(asc(pfOrgMembers.joinedAt))

  return rows.map((row) => ({
    id: row.id,
    orgId: row.orgId,
    userId: row.userId,
    role: row.role as OrgMember["role"],
    invitedBy: row.invitedBy ?? null,
    joinedAt: row.joinedAt?.toISOString() ?? "",
    user: row.userEmail
      ? {
          id: row.userId,
          email: row.userEmail,
          fullName: row.userDisplayName ?? null,
          avatarUrl: null,
        }
      : undefined,
  }))
}

async function getOrgRequests(orgId: string): Promise<OrgRequest[]> {
  const rows = await db
    .select({
      id: pfRequests.id,
      serviceName: pfRequests.serviceName,
      status: pfRequests.status,
      createdAt: pfRequests.createdAt,
      specialistName: pfSpecialistProfiles.displayName,
    })
    .from(pfRequests)
    .leftJoin(pfSpecialistProfiles, eq(pfRequests.assignedSpecialistId, pfSpecialistProfiles.id))
    .where(eq(pfRequests.orgId, orgId))
    .orderBy(desc(pfRequests.createdAt))
    .limit(30)

  return rows.map((row) => ({
    id: row.id,
    serviceName: row.serviceName,
    status: row.status as AdminRequestStatus,
    createdAt: row.createdAt?.toISOString() ?? "",
    specialistName: row.specialistName ?? null,
  }))
}

const ACTIVE_STATUSES: AdminRequestStatus[] = [
  "in_progress",
  "active",
  "review",
  "waiting_client",
  "waiting_third_party",
]

const ROLE_LABELS: Record<string, string> = {
  owner: "Propietario",
  admin: "Admin",
  member: "Miembro",
}

export default async function ClientDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const [client, members, orgRequests] = await Promise.all([
    getClient(id),
    getOrgMembers(id),
    getOrgRequests(id),
  ])

  if (!client) notFound()

  const activeCount = orgRequests.filter((r) =>
    ACTIVE_STATUSES.includes(r.status)
  ).length

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <Link
        href="/admin/commercial/clients"
        className="flex items-center gap-1.5 text-[#8A9099] text-sm hover:text-[#F7F7F3] transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Clientes
      </Link>

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-[#F7F7F3]">{client.name}</h1>
        <div className="flex items-center gap-4 mt-2 text-sm text-[#8A9099] flex-wrap">
          {client.billingEmail && (
            <span className="flex items-center gap-1.5">
              <Mail className="w-4 h-4" />
              {client.billingEmail}
            </span>
          )}
          <span className="flex items-center gap-1.5">
            <Calendar className="w-4 h-4" />
            Desde {new Date(client.createdAt).toLocaleDateString("es-ES")}
          </span>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-[#14171A] border border-[#3D4A5C] rounded-xl p-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-1">
            <Users className="w-4 h-4 text-[#546072]" />
            <span className="text-xs text-[#8A9099]">Miembros</span>
          </div>
          <p className="text-2xl font-bold text-[#F7F7F3]">{members.length}</p>
        </div>
        <div className="bg-[#14171A] border border-[#3D4A5C] rounded-xl p-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-1">
            <Briefcase className="w-4 h-4 text-[#546072]" />
            <span className="text-xs text-[#8A9099]">Total solicitudes</span>
          </div>
          <p className="text-2xl font-bold text-[#F7F7F3]">{orgRequests.length}</p>
        </div>
        <div className="bg-[#14171A] border border-[#3D4A5C] rounded-xl p-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-1">
            <Activity className="w-4 h-4 text-[#546072]" />
            <span className="text-xs text-[#8A9099]">Activas</span>
          </div>
          <p className="text-2xl font-bold text-[#FF5A1F]">{activeCount}</p>
        </div>
      </div>

      {/* Grid: Members + Requests */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Members */}
        <div className="bg-[#14171A] border border-[#3D4A5C] rounded-xl overflow-hidden">
          <div className="px-5 py-4 border-b border-[#3D4A5C]">
            <h3 className="text-sm font-semibold text-[#F7F7F3]">Miembros</h3>
          </div>
          {members.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-[#546072] text-sm">Sin miembros</p>
            </div>
          ) : (
            <div className="divide-y divide-[#3D4A5C]">
              {members.map((m) => (
                <div key={m.id} className="flex items-center gap-3 px-5 py-3.5">
                  <div className="w-8 h-8 rounded-full bg-[#3D4A5C] flex items-center justify-center text-[#8A9099] text-sm font-bold flex-shrink-0">
                    {(m.user?.fullName ?? m.user?.email ?? "?")
                      .charAt(0)
                      .toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[#F7F7F3] truncate">
                      {m.user?.fullName ?? m.user?.email ?? "Usuario"}
                    </p>
                    {m.user?.fullName && (
                      <p className="text-xs text-[#546072] truncate">
                        {m.user.email}
                      </p>
                    )}
                  </div>
                  <span className="text-xs text-[#8A9099] bg-[#3D4A5C] px-2 py-0.5 rounded flex-shrink-0">
                    {ROLE_LABELS[m.role] ?? m.role}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Requests */}
        <div className="bg-[#14171A] border border-[#3D4A5C] rounded-xl overflow-hidden">
          <div className="px-5 py-4 border-b border-[#3D4A5C]">
            <h3 className="text-sm font-semibold text-[#F7F7F3]">
              Solicitudes
            </h3>
          </div>
          {orgRequests.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-[#546072] text-sm">Sin solicitudes</p>
            </div>
          ) : (
            <div className="divide-y divide-[#3D4A5C] max-h-[420px] overflow-y-auto">
              {orgRequests.map((req) => (
                <Link
                  key={req.id}
                  href={`/admin/queue/${req.id}`}
                  className="flex items-center gap-3 px-5 py-3.5 hover:bg-[#0B0D0F] transition-colors group"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[#F7F7F3] truncate group-hover:text-[#FF5A1F] transition-colors">
                      {req.serviceName}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-[#546072]">
                        {new Date(req.createdAt).toLocaleDateString("es-ES")}
                      </span>
                      {req.specialistName && (
                        <span className="text-xs text-[#546072]">
                          · {req.specialistName}
                        </span>
                      )}
                    </div>
                  </div>
                  <StatusBadge status={req.status} size="sm" />
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

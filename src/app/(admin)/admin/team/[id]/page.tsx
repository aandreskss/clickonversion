import { getSpecialist } from "@/lib/admin/specialists"
import { getQueue } from "@/lib/admin/queue"
import { notFound } from "next/navigation"
import { SpecialistLoadBar } from "@/components/admin/specialist-load-bar"
import { StatusBadge } from "@/components/admin/status-badge"
import { PriorityBadge } from "@/components/admin/priority-badge"
import { SpecialistEditForm } from "./specialist-edit-form"
import Link from "next/link"
import { ArrowLeft, Building2, Globe, Briefcase } from "lucide-react"

export default async function SpecialistPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const specialist = await getSpecialist(id)
  if (!specialist) notFound()

  // Load assigned requests
  const { items: assignedRequests } = await getQueue({
    specialistId: id,
    status: ["in_progress", "active", "review", "waiting_client", "consultation_scheduled", "waiting_third_party"],
    pageSize: 20,
  })

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <Link
        href="/admin/team"
        className="flex items-center gap-1.5 text-[#8A9099] text-sm hover:text-[#F7F7F3] transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Equipo
      </Link>

      {/* Header */}
      <div className="flex items-start gap-5">
        <div className="w-16 h-16 rounded-full bg-[#FF5A1F]/20 flex items-center justify-center text-[#FF5A1F] font-bold text-2xl flex-shrink-0">
          {specialist.displayName.charAt(0).toUpperCase()}
        </div>
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-[#F7F7F3]">{specialist.displayName}</h1>
            {!specialist.isActive && (
              <span className="text-xs text-[#8A9099] bg-[#3D4A5C] px-2 py-0.5 rounded">
                Inactivo
              </span>
            )}
          </div>
          <p className="text-[#8A9099] text-sm mt-0.5">{specialist.user?.email}</p>
          <div className="flex items-center gap-4 mt-2 text-xs text-[#546072]">
            <span className="flex items-center gap-1">
              <Globe className="w-3.5 h-3.5" />
              {specialist.timezone}
            </span>
            <span className="flex items-center gap-1">
              <Briefcase className="w-3.5 h-3.5" />
              Max {specialist.maxConcurrent} simultáneos
            </span>
          </div>
        </div>
      </div>

      {/* Load bar */}
      <div className="bg-[#14171A] border border-[#3D4A5C] rounded-xl p-5">
        <h3 className="text-sm font-semibold text-[#F7F7F3] mb-3">Carga actual</h3>
        <SpecialistLoadBar
          current={specialist.currentLoad ?? 0}
          max={specialist.maxConcurrent}
          showLabel
        />
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Edit form */}
        <SpecialistEditForm specialist={specialist} />

        {/* Assigned requests */}
        <div className="bg-[#14171A] border border-[#3D4A5C] rounded-xl overflow-hidden">
          <div className="px-5 py-4 border-b border-[#3D4A5C]">
            <h3 className="text-sm font-semibold text-[#F7F7F3]">Solicitudes asignadas</h3>
            <p className="text-xs text-[#8A9099] mt-0.5">
              {assignedRequests.length} activa{assignedRequests.length !== 1 ? "s" : ""}
            </p>
          </div>
          {assignedRequests.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-[#546072] text-sm">Sin solicitudes activas</p>
            </div>
          ) : (
            <div className="divide-y divide-[#3D4A5C]">
              {assignedRequests.map((req) => (
                <Link
                  key={req.id}
                  href={`/admin/queue/${req.id}`}
                  className="flex items-start gap-3 px-5 py-3.5 hover:bg-[#0B0D0F] transition-colors group"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-[#F7F7F3] font-medium truncate group-hover:text-[#FF5A1F] transition-colors">
                      {req.serviceName}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      {req.org && (
                        <span className="flex items-center gap-1 text-xs text-[#546072]">
                          <Building2 className="w-3 h-3" />
                          {req.org.name}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1 flex-shrink-0">
                    <StatusBadge status={req.status} size="sm" />
                    <PriorityBadge priority={req.priority} size="sm" />
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

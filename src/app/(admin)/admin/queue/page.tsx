"use client"

import { useState, useEffect, useCallback } from "react"
import { QueueTable } from "@/components/admin/queue-table"
import type { AdminRequest, QueueFilters, AdminRequestStatus } from "@/types/admin"

interface QueueApiResponse {
  items: AdminRequest[]
  total: number
  page: number
}

const STATUS_GROUPS: { label: string; statuses: AdminRequestStatus[]; color: string }[] = [
  { label: "En cola", statuses: ["queued", "pending_onboarding"], color: "#3B82F6" },
  { label: "En progreso", statuses: ["in_progress", "active"], color: "#FF5A1F" },
  { label: "Esp. cliente", statuses: ["waiting_client"], color: "#F59E0B" },
  { label: "En revisión", statuses: ["review"], color: "#6366F1" },
  { label: "Asesoría", statuses: ["consultation_scheduled"], color: "#8B5CF6" },
]

export default function QueuePage() {
  const [requests, setRequests] = useState<AdminRequest[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [filters, setFilters] = useState<QueueFilters>({})
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (filters.status?.length) params.set("status", filters.status.join(","))
      if (filters.priority?.length) params.set("priority", filters.priority.join(","))
      if (filters.search) params.set("search", filters.search)
      params.set("page", page.toString())
      params.set("pageSize", "20")

      const res = await fetch(`/api/admin/queue?${params.toString()}`)
      if (!res.ok) throw new Error("Error al cargar la cola")
      const data = (await res.json()) as QueueApiResponse
      setRequests(data.items ?? [])
      setTotal(data.total ?? 0)
    } catch {
      setRequests([])
      setTotal(0)
    } finally {
      setLoading(false)
    }
  }, [filters, page])

  useEffect(() => {
    void load()
  }, [load])

  function isGroupActive(group: (typeof STATUS_GROUPS)[number]): boolean {
    if (!filters.status?.length) return false
    return group.statuses.every((s) => filters.status!.includes(s))
  }

  function toggleGroup(group: (typeof STATUS_GROUPS)[number]) {
    const active = isGroupActive(group)
    setFilters((f) => ({ ...f, status: active ? [] : group.statuses }))
    setPage(1)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#F7F7F3]">Cola de Trabajo</h1>
          <p className="text-[#8A9099] text-sm mt-0.5">
            Todas las solicitudes activas del equipo
          </p>
        </div>
        <span className="text-[#8A9099] text-sm">
          {loading ? "…" : `${total} solicitudes`}
        </span>
      </div>

      {/* Status group pills */}
      <div className="flex flex-wrap gap-2">
        {STATUS_GROUPS.map((group) => {
          const active = isGroupActive(group)
          return (
            <button
              key={group.label}
              type="button"
              onClick={() => toggleGroup(group)}
              className="px-3 py-1 rounded-full text-sm border transition-colors"
              style={{
                backgroundColor: active ? `${group.color}33` : "transparent",
                borderColor: group.color,
                color: group.color,
              }}
            >
              {group.label}
            </button>
          )
        })}
        {(filters.status?.length ?? 0) > 0 && (
          <button
            type="button"
            onClick={() => {
              setFilters((f) => ({ ...f, status: [] }))
              setPage(1)
            }}
            className="px-3 py-1 rounded-full text-sm border border-[#3D4A5C] text-[#8A9099] hover:border-[#546072] transition-colors"
          >
            Limpiar
          </button>
        )}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-2 border-[#FF5A1F] border-t-transparent rounded-full animate-spin" />
            <span className="text-[#8A9099] text-sm">Cargando solicitudes…</span>
          </div>
        </div>
      ) : (
        <QueueTable
          requests={requests}
          total={total}
          page={page}
          pageSize={20}
          onFilter={(f) => {
            setFilters((prev) => ({ ...prev, ...f }))
            setPage(1)
          }}
          onPageChange={setPage}
        />
      )}
    </div>
  )
}

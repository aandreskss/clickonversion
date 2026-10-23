"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { useRouter } from "next/navigation"
import {
  Search,
  ChevronDown,
  ChevronRight,
  ChevronLeft,
  ArrowUpDown,
  Check,
  Filter,
} from "lucide-react"
import { StatusBadge } from "./status-badge"
import { PriorityBadge } from "./priority-badge"
import type {
  AdminRequest,
  AdminRequestStatus,
  RequestPriority,
  QueueFilters,
} from "@/types/admin"

interface QueueTableProps {
  requests:      AdminRequest[]
  total:         number
  page:          number
  pageSize:      number
  onFilter?:     (filters: QueueFilters) => void
  onPageChange?: (page: number) => void
}

const ALL_STATUSES: AdminRequestStatus[] = [
  "pending_payment",
  "pending_onboarding",
  "queued",
  "waiting_client",
  "consultation_scheduled",
  "in_progress",
  "active",
  "waiting_third_party",
  "review",
  "paused",
  "completed",
  "cancelled",
  "refunded",
]

const STATUS_LABELS: Record<AdminRequestStatus, string> = {
  pending_payment:        "Pend. pago",
  pending_onboarding:     "En cola (leg.)",
  queued:                 "En cola",
  waiting_client:         "Esp. cliente",
  consultation_scheduled: "Asesoría prog.",
  in_progress:            "En progreso",
  active:                 "Activo (leg.)",
  waiting_third_party:    "Esp. tercero",
  review:                 "En revisión",
  paused:                 "En pausa",
  completed:              "Completado",
  cancelled:              "Cancelado",
  refunded:               "Reembolsado",
}

const PRIORITY_BORDER: Record<RequestPriority, string> = {
  low:    "transparent",
  normal: "#3B82F6",
  high:   "#F97316",
  urgent: "#EF4444",
}

type SortKey = "priority" | "createdAt" | "estimatedStart" | "serviceName"
type SortDir = "asc" | "desc"

const SORT_PRIORITY_ORDER: Record<RequestPriority, number> = {
  urgent: 0,
  high:   1,
  normal: 2,
  low:    3,
}

export function QueueTable({
  requests,
  total,
  page,
  pageSize,
  onFilter,
  onPageChange,
}: QueueTableProps) {
  const router = useRouter()

  const [search, setSearch] = useState("")
  const [selectedStatuses, setSelectedStatuses] = useState<AdminRequestStatus[]>([])
  const [statusDropdownOpen, setStatusDropdownOpen] = useState(false)
  const [sortKey, setSortKey] = useState<SortKey>("priority")
  const [sortDir, setSortDir] = useState<SortDir>("asc")

  const searchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Close dropdown on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setStatusDropdownOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClick)
    return () => document.removeEventListener("mousedown", handleClick)
  }, [])

  // Debounced search
  const handleSearchChange = useCallback(
    (value: string) => {
      setSearch(value)
      if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current)
      searchTimeoutRef.current = setTimeout(() => {
        onFilter?.({ search: value, status: selectedStatuses, page: 1 })
      }, 300)
    },
    [onFilter, selectedStatuses]
  )

  const toggleStatus = useCallback(
    (status: AdminRequestStatus) => {
      setSelectedStatuses((prev) => {
        const next = prev.includes(status)
          ? prev.filter((s) => s !== status)
          : [...prev, status]
        onFilter?.({ search, status: next, page: 1 })
        return next
      })
    },
    [onFilter, search]
  )

  const handleSort = useCallback(
    (key: SortKey) => {
      setSortDir((prev) => (sortKey === key && prev === "asc" ? "desc" : "asc"))
      setSortKey(key)
    },
    [sortKey]
  )

  const totalPages = Math.max(1, Math.ceil(total / pageSize))

  // Client-side sort (server can handle it too via onFilter)
  const sorted = [...requests].sort((a, b) => {
    let cmp = 0
    if (sortKey === "priority") {
      cmp = SORT_PRIORITY_ORDER[a.priority] - SORT_PRIORITY_ORDER[b.priority]
    } else if (sortKey === "createdAt") {
      cmp = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    } else if (sortKey === "estimatedStart") {
      const aDate = a.estimatedStart ? new Date(a.estimatedStart).getTime() : Infinity
      const bDate = b.estimatedStart ? new Date(b.estimatedStart).getTime() : Infinity
      cmp = aDate - bDate
    } else if (sortKey === "serviceName") {
      cmp = a.serviceName.localeCompare(b.serviceName)
    }
    return sortDir === "asc" ? cmp : -cmp
  })

  function SortButton({ colKey, label }: { colKey: SortKey; label: string }) {
    const active = sortKey === colKey
    return (
      <button
        type="button"
        onClick={() => handleSort(colKey)}
        className="flex items-center gap-1 hover:text-[#F7F7F3] transition-colors"
      >
        {label}
        <ArrowUpDown
          className={`w-3.5 h-3.5 ${active ? "text-[#FF5A1F]" : "text-[#546072]"}`}
        />
      </button>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#546072]" />
          <input
            type="text"
            value={search}
            onChange={(e) => handleSearchChange(e.target.value)}
            placeholder="Buscar por servicio o cliente..."
            className="w-full bg-[#14171A] border border-[#3D4A5C] rounded-lg pl-9 pr-4 py-2 text-sm text-[#F7F7F3] placeholder:text-[#546072] focus:outline-none focus:border-[#FF5A1F] transition-colors"
          />
        </div>

        {/* Status filter */}
        <div className="relative" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => setStatusDropdownOpen((v) => !v)}
            className="flex items-center gap-2 bg-[#14171A] border border-[#3D4A5C] rounded-lg px-4 py-2 text-sm text-[#8A9099] hover:border-[#FF5A1F] transition-colors whitespace-nowrap"
          >
            <Filter className="w-4 h-4" />
            Estado
            {selectedStatuses.length > 0 && (
              <span className="bg-[#FF5A1F] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                {selectedStatuses.length}
              </span>
            )}
            <ChevronDown className="w-4 h-4" />
          </button>

          {statusDropdownOpen && (
            <div className="absolute right-0 top-full mt-1 z-50 bg-[#14171A] border border-[#3D4A5C] rounded-lg shadow-xl py-1 min-w-[200px]">
              {ALL_STATUSES.map((status) => (
                <button
                  key={status}
                  type="button"
                  onClick={() => toggleStatus(status)}
                  className="w-full flex items-center gap-3 px-4 py-2 text-sm hover:bg-[#0B0D0F] transition-colors"
                >
                  <div
                    className={`w-4 h-4 rounded border flex items-center justify-center flex-shrink-0 ${
                      selectedStatuses.includes(status)
                        ? "bg-[#FF5A1F] border-[#FF5A1F]"
                        : "border-[#3D4A5C]"
                    }`}
                  >
                    {selectedStatuses.includes(status) && (
                      <Check className="w-3 h-3 text-white" />
                    )}
                  </div>
                  <span className="text-[#F7F7F3]">{STATUS_LABELS[status]}</span>
                </button>
              ))}
              {selectedStatuses.length > 0 && (
                <div className="border-t border-[#3D4A5C] mt-1 pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedStatuses([])
                      onFilter?.({ search, status: [], page: 1 })
                    }}
                    className="w-full text-left px-4 py-2 text-xs text-[#EF4444] hover:bg-[#0B0D0F] transition-colors"
                  >
                    Limpiar filtros
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-[#3D4A5C]">
        <table className="w-full min-w-[780px]">
          <thead>
            <tr className="border-b border-[#3D4A5C] bg-[#14171A]">
              <th className="text-left px-4 py-3 text-xs text-[#8A9099] font-medium">
                <SortButton colKey="priority" label="Prioridad" />
              </th>
              <th className="text-left px-4 py-3 text-xs text-[#8A9099] font-medium">
                <SortButton colKey="serviceName" label="Servicio" />
              </th>
              <th className="text-left px-4 py-3 text-xs text-[#8A9099] font-medium">
                Cliente
              </th>
              <th className="text-left px-4 py-3 text-xs text-[#8A9099] font-medium">
                Estado
              </th>
              <th className="text-left px-4 py-3 text-xs text-[#8A9099] font-medium">
                Especialista
              </th>
              <th className="text-left px-4 py-3 text-xs text-[#8A9099] font-medium">
                <SortButton colKey="estimatedStart" label="Inicio est." />
              </th>
              <th className="text-left px-4 py-3 text-xs text-[#8A9099] font-medium">
                <SortButton colKey="createdAt" label="Creado" />
              </th>
              <th className="w-8" />
            </tr>
          </thead>
          <tbody>
            {sorted.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-4 py-16 text-center">
                  <div className="flex flex-col items-center gap-2">
                    <Search className="w-8 h-8 text-[#3D4A5C]" />
                    <p className="text-[#8A9099] text-sm">
                      No se encontraron solicitudes
                    </p>
                    {(search || selectedStatuses.length > 0) && (
                      <p className="text-[#546072] text-xs">
                        Intenta ajustar los filtros de búsqueda
                      </p>
                    )}
                  </div>
                </td>
              </tr>
            ) : (
              sorted.map((req) => (
                <tr
                  key={req.id}
                  onClick={() => router.push(`/admin/queue/${req.id}`)}
                  className="border-b border-[#3D4A5C] last:border-b-0 hover:bg-[#14171A]/50 cursor-pointer transition-colors group"
                  style={{
                    borderLeft: `3px solid ${PRIORITY_BORDER[req.priority]}`,
                  }}
                >
                  <td className="px-4 py-3">
                    <PriorityBadge priority={req.priority} size="sm" />
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm text-[#F7F7F3] font-medium line-clamp-1">
                      {req.serviceName}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {req.org ? (
                      <div>
                        <p className="text-sm text-[#F7F7F3]">{req.org.name}</p>
                        <p className="text-xs text-[#546072]">{req.org.slug}</p>
                      </div>
                    ) : (
                      <span className="text-xs text-[#546072]">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={req.status} size="sm" />
                  </td>
                  <td className="px-4 py-3">
                    {req.specialist ? (
                      <span className="text-sm text-[#F7F7F3]">
                        {req.specialist.displayName}
                      </span>
                    ) : (
                      <span className="text-xs text-[#546072]">Sin asignar</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {req.estimatedStart ? (
                      <span className="text-sm text-[#8A9099]">
                        {new Date(req.estimatedStart).toLocaleDateString("es-ES")}
                      </span>
                    ) : (
                      <span className="text-xs text-[#546072]">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm text-[#8A9099]">
                      {new Date(req.createdAt).toLocaleDateString("es-ES")}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <ChevronRight className="w-4 h-4 text-[#3D4A5C] group-hover:text-[#8A9099] transition-colors" />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-[#8A9099]">
            Página{" "}
            <span className="text-[#F7F7F3] font-medium">{page}</span> de{" "}
            <span className="text-[#F7F7F3] font-medium">{totalPages}</span>
            {" · "}
            <span className="text-[#546072]">{total} resultado{total !== 1 ? "s" : ""}</span>
          </p>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => onPageChange?.(page - 1)}
              disabled={page <= 1}
              className="flex items-center gap-1 px-3 py-1.5 text-sm border border-[#3D4A5C] rounded-lg text-[#8A9099] hover:border-[#FF5A1F] hover:text-[#F7F7F3] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              Anterior
            </button>
            <button
              type="button"
              onClick={() => onPageChange?.(page + 1)}
              disabled={page >= totalPages}
              className="flex items-center gap-1 px-3 py-1.5 text-sm border border-[#3D4A5C] rounded-lg text-[#8A9099] hover:border-[#FF5A1F] hover:text-[#F7F7F3] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              Siguiente
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

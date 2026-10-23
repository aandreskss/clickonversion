"use client"

import { useState, useEffect, useCallback } from "react"
import { PaymentTable } from "@/components/admin/payment-table"
import {
  AlertTriangle,
  CheckCircle2,
  Loader2,
  ChevronDown,
  Filter,
} from "lucide-react"
import type { UnifiedPayment, ReconciliationRecord } from "@/types/admin"

interface PaymentsResponse {
  items: UnifiedPayment[]
  total: number
  page: number
}

interface DiscrepanciesResponse {
  items: ReconciliationRecord[]
  total: number
  page: number
}

const PROVIDERS = [
  { label: "Todos", value: "" },
  { label: "Stripe", value: "stripe" },
  { label: "PayPal", value: "paypal" },
]

const STATUSES = [
  { label: "Todos", value: "" },
  { label: "Exitoso", value: "succeeded" },
  { label: "Pagado", value: "paid" },
  { label: "Pendiente", value: "pending" },
  { label: "Fallido", value: "failed" },
  { label: "Reembolsado", value: "refunded" },
]

export default function PaymentsPage() {
  // Payments
  const [payments, setPayments] = useState<UnifiedPayment[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [provider, setProvider] = useState("")
  const [status, setStatus] = useState("")
  const [loading, setLoading] = useState(true)

  // Discrepancies
  const [discrepancies, setDiscrepancies] = useState<ReconciliationRecord[]>([])
  const [loadingDiscrepancies, setLoadingDiscrepancies] = useState(true)
  const [resolvingId, setResolvingId] = useState<string | null>(null)

  const loadPayments = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (provider) params.set("provider", provider)
      if (status) params.set("status", status)
      params.set("page", page.toString())
      params.set("pageSize", "20")

      const res = await fetch(`/api/admin/payments?${params.toString()}`)
      if (!res.ok) throw new Error()
      const data = (await res.json()) as PaymentsResponse
      setPayments(data.items ?? [])
      setTotal(data.total ?? 0)
    } catch {
      setPayments([])
    } finally {
      setLoading(false)
    }
  }, [provider, status, page])

  const loadDiscrepancies = useCallback(async () => {
    setLoadingDiscrepancies(true)
    try {
      const res = await fetch("/api/admin/payments/discrepancies")
      if (!res.ok) throw new Error()
      const data = (await res.json()) as DiscrepanciesResponse
      setDiscrepancies(data.items ?? [])
    } catch {
      setDiscrepancies([])
    } finally {
      setLoadingDiscrepancies(false)
    }
  }, [])

  useEffect(() => {
    void loadPayments()
  }, [loadPayments])

  useEffect(() => {
    void loadDiscrepancies()
  }, [loadDiscrepancies])

  async function handleResolve(id: string) {
    setResolvingId(id)
    try {
      await fetch(`/api/admin/payments/discrepancies/${id}/resolve`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notes: "Resuelto manualmente desde el panel" }),
      })
      setDiscrepancies((prev) => prev.filter((d) => d.id !== id))
    } finally {
      setResolvingId(null)
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-[#F7F7F3]">Pagos</h1>
        <p className="text-[#8A9099] text-sm mt-0.5">
          Historial unificado Stripe + PayPal
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        {/* Provider filter */}
        <div className="relative">
          <div className="absolute left-3 top-1/2 -translate-y-1/2">
            <Filter className="w-4 h-4 text-[#546072]" />
          </div>
          <select
            value={provider}
            onChange={(e) => {
              setProvider(e.target.value)
              setPage(1)
            }}
            className="bg-[#14171A] border border-[#3D4A5C] rounded-lg pl-9 pr-8 py-2 text-sm text-[#F7F7F3] focus:outline-none focus:border-[#FF5A1F] transition-colors appearance-none"
          >
            {PROVIDERS.map((p) => (
              <option key={p.value} value={p.value}>
                {p.label}
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-[#546072]" />
        </div>

        {/* Status filter */}
        <div className="relative">
          <select
            value={status}
            onChange={(e) => {
              setStatus(e.target.value)
              setPage(1)
            }}
            className="bg-[#14171A] border border-[#3D4A5C] rounded-lg px-3 pr-8 py-2 text-sm text-[#F7F7F3] focus:outline-none focus:border-[#FF5A1F] transition-colors appearance-none"
          >
            {STATUSES.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-[#546072]" />
        </div>

        <span className="flex items-center text-sm text-[#8A9099]">
          {loading ? "Cargando…" : `${total} pago${total !== 1 ? "s" : ""}`}
        </span>
      </div>

      {/* Payment table */}
      {loading ? (
        <div className="flex items-center justify-center py-16">
          <div className="w-8 h-8 border-2 border-[#FF5A1F] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <PaymentTable
          payments={payments}
          total={total}
          page={page}
          pageSize={20}
          onPageChange={setPage}
        />
      )}

      {/* Discrepancies section */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-[#F59E0B]" />
          <h2 className="text-lg font-semibold text-[#F7F7F3]">Discrepancias</h2>
          {discrepancies.length > 0 && (
            <span className="bg-[#F59E0B]/20 text-[#F59E0B] text-xs font-bold px-2 py-0.5 rounded-full">
              {discrepancies.length}
            </span>
          )}
        </div>

        {loadingDiscrepancies ? (
          <div className="bg-[#14171A] border border-[#3D4A5C] rounded-xl p-8 flex items-center justify-center">
            <Loader2 className="w-6 h-6 text-[#8A9099] animate-spin" />
          </div>
        ) : discrepancies.length === 0 ? (
          <div className="bg-[#14171A] border border-[#3D4A5C] rounded-xl p-8 text-center">
            <CheckCircle2 className="w-8 h-8 text-[#22C55E] mx-auto mb-2" />
            <p className="text-[#8A9099] text-sm">Sin discrepancias pendientes</p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-[#3D4A5C]">
            <table className="w-full min-w-[700px]">
              <thead>
                <tr className="border-b border-[#3D4A5C] bg-[#14171A]">
                  <th className="text-left px-4 py-3 text-xs text-[#8A9099] font-medium">
                    Proveedor
                  </th>
                  <th className="text-left px-4 py-3 text-xs text-[#8A9099] font-medium">
                    Monto proveedor
                  </th>
                  <th className="text-left px-4 py-3 text-xs text-[#8A9099] font-medium">
                    Monto interno
                  </th>
                  <th className="text-left px-4 py-3 text-xs text-[#8A9099] font-medium">
                    Diferencia
                  </th>
                  <th className="text-left px-4 py-3 text-xs text-[#8A9099] font-medium">
                    Estado
                  </th>
                  <th className="text-left px-4 py-3 text-xs text-[#8A9099] font-medium">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody>
                {discrepancies.map((d) => (
                  <tr
                    key={d.id}
                    className="border-b border-[#3D4A5C] last:border-b-0 hover:bg-[#14171A]/50 transition-colors"
                  >
                    <td className="px-4 py-3">
                      <span className="text-sm text-[#F7F7F3] capitalize">{d.provider}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm font-mono text-[#F7F7F3]">
                        ${d.providerAmount.toFixed(2)}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm font-mono text-[#F7F7F3]">
                        ${d.internalAmount.toFixed(2)}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`text-sm font-mono font-bold ${
                          d.discrepancy === 0 ? "text-[#22C55E]" : "text-[#EF4444]"
                        }`}
                      >
                        {d.discrepancy > 0 ? "+" : ""}
                        {d.discrepancy.toFixed(2)}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                          d.status === "discrepancy"
                            ? "bg-[#F59E0B]/20 text-[#F59E0B]"
                            : d.status === "manual_review"
                              ? "bg-[#6366F1]/20 text-[#6366F1]"
                              : "bg-[#22C55E]/20 text-[#22C55E]"
                        }`}
                      >
                        {d.status === "discrepancy"
                          ? "Discrepancia"
                          : d.status === "manual_review"
                            ? "Revisión manual"
                            : d.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        type="button"
                        onClick={() => handleResolve(d.id)}
                        disabled={resolvingId === d.id}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium border border-[#22C55E]/30 text-[#22C55E] rounded-lg hover:bg-[#22C55E]/10 disabled:opacity-50 transition-colors"
                      >
                        {resolvingId === d.id ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <CheckCircle2 className="w-3.5 h-3.5" />
                        )}
                        Marcar resuelto
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  )
}

"use client"

import { ChevronLeft, ChevronRight } from "lucide-react"
import type { UnifiedPayment } from "@/types/admin"

interface PaymentTableProps {
  payments:      UnifiedPayment[]
  total:         number
  page:          number
  pageSize:      number
  onPageChange?: (page: number) => void
}

function formatUsd(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style:    "currency",
    currency: "USD",
  }).format(amount)
}

function ProviderBadge({ provider }: { provider: "stripe" | "paypal" }) {
  if (provider === "stripe") {
    return (
      <span
        className="inline-flex items-center text-xs font-semibold px-2 py-0.5 rounded-full text-white"
        style={{ backgroundColor: "#7C3AED" }}
      >
        Stripe
      </span>
    )
  }
  return (
    <span
      className="inline-flex items-center text-xs font-semibold px-2 py-0.5 rounded-full text-white"
      style={{ backgroundColor: "#0070BA" }}
    >
      PayPal
    </span>
  )
}

function PaymentStatusBadge({ status }: { status: string }) {
  const STATUS_MAP: Record<string, { color: string; label: string }> = {
    succeeded:  { color: "#22C55E", label: "Exitoso" },
    paid:       { color: "#22C55E", label: "Pagado" },
    failed:     { color: "#EF4444", label: "Fallido" },
    pending:    { color: "#F59E0B", label: "Pendiente" },
    refunded:   { color: "#546072", label: "Reembolsado" },
    cancelled:  { color: "#EF4444", label: "Cancelado" },
    canceled:   { color: "#EF4444", label: "Cancelado" },
    processing: { color: "#3B82F6", label: "Procesando" },
    active:     { color: "#22C55E", label: "Activo" },
    past_due:   { color: "#F59E0B", label: "Vencido" },
  }

  const config = STATUS_MAP[status] ?? { color: "#546072", label: status }

  return (
    <span
      className="inline-flex items-center text-xs font-medium px-2 py-0.5 rounded-full"
      style={{
        backgroundColor: `${config.color}22`,
        color: config.color,
        border: `1px solid ${config.color}44`,
      }}
    >
      {config.label}
    </span>
  )
}

function PaymentTypeLabel({ type }: { type: string }) {
  const TYPE_MAP: Record<string, string> = {
    one_time:     "Pago único",
    subscription: "Suscripción",
    invoice:      "Factura",
    setup:        "Setup",
  }
  return (
    <span className="text-sm text-[#8A9099]">
      {TYPE_MAP[type] ?? type}
    </span>
  )
}

export function PaymentTable({
  payments,
  total,
  page,
  pageSize,
  onPageChange,
}: PaymentTableProps) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize))

  return (
    <div className="flex flex-col gap-4">
      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-[#3D4A5C]">
        <table className="w-full min-w-[820px]">
          <thead>
            <tr className="border-b border-[#3D4A5C] bg-[#14171A]">
              <th className="text-left px-4 py-3 text-xs text-[#8A9099] font-medium">
                Proveedor
              </th>
              <th className="text-left px-4 py-3 text-xs text-[#8A9099] font-medium">
                N° Orden
              </th>
              <th className="text-left px-4 py-3 text-xs text-[#8A9099] font-medium">
                Cliente
              </th>
              <th className="text-left px-4 py-3 text-xs text-[#8A9099] font-medium">
                Monto
              </th>
              <th className="text-left px-4 py-3 text-xs text-[#8A9099] font-medium">
                Estado
              </th>
              <th className="text-left px-4 py-3 text-xs text-[#8A9099] font-medium">
                Tipo
              </th>
              <th className="text-left px-4 py-3 text-xs text-[#8A9099] font-medium">
                Fecha
              </th>
            </tr>
          </thead>
          <tbody>
            {payments.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-16 text-center">
                  <p className="text-[#8A9099] text-sm">
                    No se encontraron pagos
                  </p>
                </td>
              </tr>
            ) : (
              payments.map((payment) => (
                <tr
                  key={payment.id}
                  className="border-b border-[#3D4A5C] last:border-b-0 hover:bg-[#14171A]/50 transition-colors"
                >
                  <td className="px-4 py-3">
                    <ProviderBadge provider={payment.provider} />
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm font-mono text-[#F7F7F3]">
                      #{payment.orderNumber}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div>
                      <p className="text-sm text-[#F7F7F3]">{payment.clientName}</p>
                      <p className="text-xs text-[#546072]">{payment.clientEmail}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm font-semibold text-[#F7F7F3]">
                      {formatUsd(payment.amountUsd)}
                    </span>
                    {payment.currency !== "usd" && (
                      <span className="text-xs text-[#546072] ml-1 uppercase">
                        {payment.currency}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <PaymentStatusBadge status={payment.status} />
                  </td>
                  <td className="px-4 py-3">
                    <PaymentTypeLabel type={payment.paymentType} />
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm text-[#8A9099]">
                      {new Date(payment.createdAt).toLocaleDateString("es-ES")}
                    </span>
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
            <span className="text-[#546072]">{total} pago{total !== 1 ? "s" : ""}</span>
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

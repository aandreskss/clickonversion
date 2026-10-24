import { ExternalLink, AlertCircle, FileText } from "lucide-react"
import { listPayPalInvoicesAction } from "./actions"

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  DRAFT: { label: "Borrador", color: "#546072" },
  SENT: { label: "Enviada", color: "#3B82F6" },
  SCHEDULED: { label: "Programada", color: "#8B5CF6" },
  PAYMENT_PENDING: { label: "Pago pendiente", color: "#F59E0B" },
  MARKED_AS_PAID: { label: "Marcada como pagada", color: "#22C55E" },
  PAID: { label: "Pagada", color: "#22C55E" },
  CANCELLED: { label: "Cancelada", color: "#546072" },
  REFUNDED: { label: "Reembolsada", color: "#EF4444" },
  PARTIALLY_PAID: { label: "Pago parcial", color: "#F59E0B" },
  MARKED_AS_REFUNDED: { label: "Reembolsada", color: "#EF4444" },
  UNPAID: { label: "Sin pagar", color: "#F59E0B" },
}

function StatusPill({ status }: { status: string }) {
  const cfg = STATUS_LABELS[status] ?? { label: status, color: "#546072" }
  return (
    <span
      style={{ color: cfg.color, background: `${cfg.color}18` }}
      className="inline-block text-xs font-medium px-2 py-0.5 rounded-full whitespace-nowrap"
    >
      {cfg.label}
    </span>
  )
}

function formatDate(iso?: string) {
  if (!iso) return "—"
  const [y, m, d] = iso.split("-")
  return `${d}/${m}/${y}`
}

export async function InvoicesList() {
  const result = await listPayPalInvoicesAction(1, 50)

  if (result.error) {
    return (
      <div className="flex items-start gap-3 p-4 bg-[#EF4444]/10 border border-[#EF4444]/30 rounded-xl">
        <AlertCircle className="w-5 h-5 text-[#EF4444] flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-medium text-[#F7F7F3]">No se pudo cargar la lista</p>
          <p className="text-xs text-[#8A9099] mt-0.5">{result.error}</p>
        </div>
      </div>
    )
  }

  const invoices = result.invoices ?? []

  if (!invoices.length) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <FileText className="w-10 h-10 text-[#3D4A5C] mb-3" />
        <p className="text-sm text-[#8A9099]">Aún no hay facturas creadas</p>
        <p className="text-xs text-[#546072] mt-1">
          Las facturas que generes aparecerán aquí
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <p className="text-xs text-[#546072]">
          {result.totalItems ?? invoices.length} factura{(result.totalItems ?? invoices.length) !== 1 ? "s" : ""}
        </p>
        <a
          href="https://www.paypal.com/invoice/summary"
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-[#FF5A1F] hover:underline flex items-center gap-1"
        >
          Ver en PayPal
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-[#3D4A5C]">
        <table className="w-full text-sm min-w-[640px]">
          <thead>
            <tr className="border-b border-[#3D4A5C] bg-[#1C2026]">
              <th className="text-left text-xs text-[#546072] font-medium px-4 py-3">N°</th>
              <th className="text-left text-xs text-[#546072] font-medium px-4 py-3">Cliente</th>
              <th className="text-left text-xs text-[#546072] font-medium px-4 py-3">Fecha</th>
              <th className="text-left text-xs text-[#546072] font-medium px-4 py-3">Vence</th>
              <th className="text-right text-xs text-[#546072] font-medium px-4 py-3">Monto</th>
              <th className="text-left text-xs text-[#546072] font-medium px-4 py-3">Estado</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {invoices.map((inv, i) => (
              <tr
                key={inv.id}
                className={`border-b border-[#3D4A5C]/50 last:border-0 ${i % 2 === 0 ? "bg-[#14171A]" : "bg-[#1C2026]/40"}`}
              >
                <td className="px-4 py-3 text-[#8A9099] font-mono text-xs whitespace-nowrap">
                  {inv.invoiceNumber ?? inv.id.slice(-8)}
                </td>
                <td className="px-4 py-3">
                  <p className="text-[#F7F7F3] text-sm leading-tight">
                    {inv.recipientName ?? "—"}
                  </p>
                  <p className="text-xs text-[#546072]">{inv.recipientEmail ?? ""}</p>
                </td>
                <td className="px-4 py-3 text-[#8A9099] text-xs whitespace-nowrap">
                  {formatDate(inv.invoiceDate)}
                </td>
                <td className="px-4 py-3 text-[#8A9099] text-xs whitespace-nowrap">
                  {formatDate(inv.dueDate)}
                </td>
                <td className="px-4 py-3 text-right font-mono text-sm text-[#F7F7F3] whitespace-nowrap">
                  {inv.amount
                    ? `$${parseFloat(inv.amount).toLocaleString("en-US", { minimumFractionDigits: 2 })} ${inv.currency ?? ""}`
                    : "—"}
                </td>
                <td className="px-4 py-3">
                  <StatusPill status={inv.status} />
                </td>
                <td className="px-4 py-3 text-right">
                  <a
                    href={inv.dashboardUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs text-[#8A9099] hover:text-[#FF5A1F] transition-colors whitespace-nowrap"
                  >
                    Ver
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

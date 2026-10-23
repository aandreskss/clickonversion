import { getFunnelMetrics, getRecentEvents } from "@/lib/admin/analytics-admin"
import { ArrowRight, Info } from "lucide-react"
import Link from "next/link"

function FunnelStep({
  label,
  value,
  rate,
  isFirst,
}: {
  label: string
  value: number
  rate?: number
  isFirst?: boolean
}) {
  return (
    <div className="flex items-center gap-3">
      {!isFirst && (
        <ArrowRight className="w-5 h-5 text-[#3D4A5C] flex-shrink-0" />
      )}
      <div className="flex-1 bg-[#14171A] border border-[#3D4A5C] rounded-xl p-4 text-center">
        <p className="text-xs text-[#8A9099] mb-1">{label}</p>
        <p className="text-2xl font-bold text-[#F7F7F3]">{value.toLocaleString("es-ES")}</p>
        {rate !== undefined && (
          <p className="text-xs mt-1.5">
            <span
              className={`font-semibold ${
                rate >= 50 ? "text-[#22C55E]" : rate >= 20 ? "text-[#F59E0B]" : "text-[#EF4444]"
              }`}
            >
              {rate}%
            </span>
            <span className="text-[#546072]"> conversión</span>
          </p>
        )}
      </div>
    </div>
  )
}

const EVENT_LABELS: Record<string, string> = {
  service_viewed: "Servicio visto",
  add_to_cart: "Añadido al carrito",
  checkout_started: "Checkout iniciado",
  purchase_confirmed: "Compra confirmada",
  consultation_booked: "Asesoría agendada",
  service_completed: "Servicio completado",
  repurchase: "Recompra",
}

export default async function AnalyticsPage({
  searchParams,
}: {
  searchParams: Promise<{ from?: string; to?: string }>
}) {
  const { from, to } = await searchParams
  const dateFrom =
    from ??
    new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]
  const dateTo = to ?? new Date().toISOString().split("T")[0]

  const [funnel, { items: recentEvents }] = await Promise.all([
    getFunnelMetrics({ from: dateFrom, to: dateTo }),
    getRecentEvents({ limit: 30 }),
  ])

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#F7F7F3]">Analytics</h1>
          <p className="text-[#8A9099] text-sm mt-0.5">
            Eventos del servidor · {dateFrom} → {dateTo}
          </p>
        </div>

        {/* Date range form */}
        <form method="GET" className="flex items-center gap-2">
          <input
            type="date"
            name="from"
            defaultValue={dateFrom}
            className="bg-[#14171A] border border-[#3D4A5C] rounded-lg px-3 py-2 text-sm text-[#F7F7F3] focus:outline-none focus:border-[#FF5A1F] transition-colors"
          />
          <span className="text-[#546072] text-sm">→</span>
          <input
            type="date"
            name="to"
            defaultValue={dateTo}
            className="bg-[#14171A] border border-[#3D4A5C] rounded-lg px-3 py-2 text-sm text-[#F7F7F3] focus:outline-none focus:border-[#FF5A1F] transition-colors"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-[#FF5A1F] text-white text-sm font-medium rounded-lg hover:bg-[#E44D18] transition-colors"
          >
            Aplicar
          </button>
        </form>
      </div>

      {/* Note */}
      <div className="flex items-start gap-2 p-4 bg-[#14171A] border border-[#3D4A5C] rounded-xl">
        <Info className="w-4 h-4 text-[#546072] flex-shrink-0 mt-0.5" />
        <p className="text-sm text-[#8A9099]">
          Los eventos de comportamiento front-end se registran en GA4. Esta vista muestra solo
          eventos del servidor registrados en la base de datos.
        </p>
      </div>

      {/* Funnel */}
      <section className="space-y-4">
        <h2 className="text-sm font-semibold text-[#8A9099] uppercase tracking-wider">
          Embudo de conversión
        </h2>

        {/* Main funnel steps */}
        <div className="flex items-stretch gap-2 overflow-x-auto pb-2">
          <FunnelStep
            label="Servicio visto"
            value={funnel.serviceViewed}
            isFirst
          />
          <FunnelStep
            label="Al carrito"
            value={funnel.addToCart}
            rate={funnel.cartRate}
          />
          <FunnelStep
            label="Checkout"
            value={funnel.checkoutStarted}
            rate={funnel.checkoutRate}
          />
          <FunnelStep
            label="Compra"
            value={funnel.purchaseConfirmed}
            rate={funnel.purchaseRate}
          />
        </div>

        {/* Secondary metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-[#14171A] border border-[#3D4A5C] rounded-xl p-4">
            <p className="text-xs text-[#8A9099]">Asesorías agendadas</p>
            <p className="text-2xl font-bold text-[#F7F7F3] mt-1">
              {funnel.consultationBooked.toLocaleString("es-ES")}
            </p>
          </div>
          <div className="bg-[#14171A] border border-[#3D4A5C] rounded-xl p-4">
            <p className="text-xs text-[#8A9099]">Servicios completados</p>
            <p className="text-2xl font-bold text-[#F7F7F3] mt-1">
              {funnel.serviceCompleted.toLocaleString("es-ES")}
            </p>
          </div>
          <div className="bg-[#14171A] border border-[#3D4A5C] rounded-xl p-4">
            <p className="text-xs text-[#8A9099]">Recompras</p>
            <p className="text-2xl font-bold text-[#22C55E] mt-1">
              {funnel.repurchase.toLocaleString("es-ES")}
            </p>
          </div>
        </div>
      </section>

      {/* Recent events table */}
      <section className="space-y-4">
        <h2 className="text-sm font-semibold text-[#8A9099] uppercase tracking-wider">
          Eventos recientes (servidor)
        </h2>

        <div className="overflow-x-auto rounded-xl border border-[#3D4A5C]">
          <table className="w-full min-w-[600px]">
            <thead>
              <tr className="border-b border-[#3D4A5C] bg-[#14171A]">
                <th className="text-left px-4 py-3 text-xs text-[#8A9099] font-medium">
                  Evento
                </th>
                <th className="text-left px-4 py-3 text-xs text-[#8A9099] font-medium">
                  Servicio
                </th>
                <th className="text-left px-4 py-3 text-xs text-[#8A9099] font-medium">
                  Org
                </th>
                <th className="text-left px-4 py-3 text-xs text-[#8A9099] font-medium">
                  Fecha
                </th>
              </tr>
            </thead>
            <tbody>
              {recentEvents.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-4 py-12 text-center">
                    <p className="text-[#546072] text-sm">Sin eventos registrados</p>
                  </td>
                </tr>
              ) : (
                recentEvents.map((event) => (
                  <tr
                    key={event.id}
                    className="border-b border-[#3D4A5C] last:border-b-0 hover:bg-[#14171A]/50 transition-colors"
                  >
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center text-xs font-medium px-2 py-0.5 rounded-full bg-[#FF5A1F]/10 text-[#FF5A1F]">
                        {EVENT_LABELS[event.eventName] ?? event.eventName}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm text-[#8A9099]">
                        {event.serviceId ? (
                          <span className="font-mono text-xs">{event.serviceId.slice(0, 8)}…</span>
                        ) : (
                          "—"
                        )}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm text-[#8A9099]">
                        {event.orgId ? (
                          <span className="font-mono text-xs">{event.orgId.slice(0, 8)}…</span>
                        ) : (
                          "—"
                        )}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm text-[#8A9099]">
                        {new Date(event.createdAt).toLocaleString("es-ES", {
                          day: "2-digit",
                          month: "short",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}

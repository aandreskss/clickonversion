import { getDashboardMetrics } from "@/lib/admin/dashboard"
import { MetricCard } from "@/components/admin/metric-card"
import {
  DollarSign,
  RefreshCw,
  Activity,
  AlertTriangle,
  Package,
  Clock,
  Users,
  Calendar,
  CheckCircle2,
  XCircle,
  Hourglass,
} from "lucide-react"

function formatUsd(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value)
}

export default async function AdminDashboardPage() {
  let metrics
  try {
    metrics = await getDashboardMetrics()
  } catch {
    metrics = null
  }

  if (!metrics) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-bold text-[#F7F7F3]">Panel Administrativo</h1>
        <div className="rounded-xl border border-[#F59E0B]/30 bg-[#F59E0B]/10 p-6">
          <p className="text-sm text-[#F59E0B] font-medium mb-1">No se pudo cargar el dashboard</p>
          <p className="text-xs text-[#8A9099]">
            Verifica que las variables de entorno DATABASE_URL y AUTH_SECRET estén correctamente
            configuradas en Vercel y que la base de datos Neon sea accesible.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-[#F7F7F3]">Panel Administrativo</h1>
        <p className="text-[#8A9099] text-sm mt-1">
          Vista operacional en tiempo real — últimos 30 días
        </p>
      </div>

      {/* Revenue & Operations */}
      <section className="space-y-3">
        <h2 className="text-xs font-semibold text-[#8A9099] uppercase tracking-wider">
          Ingresos
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            title="Ingresos cobrados"
            value={metrics.revenue.collected}
            subtitle="últimos 30 días"
            icon={DollarSign}
            variant="success"
            prefix="$"
          />
          <MetricCard
            title="MRR recurrente"
            value={metrics.revenue.recurring}
            subtitle="suscripciones activas"
            icon={RefreshCw}
            prefix="$"
            suffix="/mo"
          />
          <MetricCard
            title="Solicitudes activas"
            value={metrics.requests.active}
            subtitle="en progreso"
            icon={Activity}
            variant="default"
          />
          <MetricCard
            title="Proyectos atrasados"
            value={metrics.requests.overdue}
            subtitle="inicio est. vencido"
            icon={AlertTriangle}
            variant={metrics.requests.overdue > 0 ? "danger" : "default"}
          />
        </div>
      </section>

      {/* Orders & Requests */}
      <section className="space-y-3">
        <h2 className="text-xs font-semibold text-[#8A9099] uppercase tracking-wider">
          Operaciones
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            title="Pedidos nuevos"
            value={metrics.orders.newLast30d}
            subtitle="últimos 30 días"
            icon={Package}
            variant="default"
          />
          <MetricCard
            title="En cola"
            value={metrics.requests.pending}
            subtitle="esperando inicio"
            icon={Clock}
            variant="warning"
          />
          <MetricCard
            title="Esp. cliente"
            value={metrics.requests.waitingClient}
            subtitle="requieren acción"
            icon={Users}
            variant="warning"
          />
          <MetricCard
            title="Asesorías próx."
            value={metrics.consultations.upcoming7d}
            subtitle="próximos 7 días"
            icon={Calendar}
            variant="default"
          />
        </div>
      </section>

      {/* Top Services + Payment Status */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Services */}
        <div className="bg-[#14171A] border border-[#3D4A5C] rounded-xl p-6">
          <h2 className="text-sm font-semibold text-[#F7F7F3] mb-4">
            Servicios más vendidos
          </h2>
          {metrics.topServices.length === 0 ? (
            <p className="text-[#546072] text-sm">Sin datos disponibles</p>
          ) : (
            <ol className="space-y-3">
              {metrics.topServices.map((service, index) => (
                <li key={service.serviceId || index} className="flex items-center gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#FF5A1F]/10 text-[#FF5A1F] text-xs font-bold flex items-center justify-center">
                    {index + 1}
                  </span>
                  <span className="flex-1 text-sm text-[#F7F7F3] truncate">
                    {service.serviceName}
                  </span>
                  <span className="text-sm font-semibold text-[#8A9099]">
                    {service.count}{" "}
                    <span className="text-[#546072] font-normal">
                      {service.count === 1 ? "venta" : "ventas"}
                    </span>
                  </span>
                </li>
              ))}
            </ol>
          )}
        </div>

        {/* Payment Status */}
        <div className="bg-[#14171A] border border-[#3D4A5C] rounded-xl p-6">
          <h2 className="text-sm font-semibold text-[#F7F7F3] mb-4">
            Estado de pagos
          </h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 rounded-lg bg-[#22C55E]/10 border border-[#22C55E]/20">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#22C55E]" />
                <span className="text-sm text-[#F7F7F3]">Pagados</span>
              </div>
              <span className="text-lg font-bold text-[#22C55E]">
                {metrics.paymentStatus.paid}
              </span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-[#F59E0B]/10 border border-[#F59E0B]/20">
              <div className="flex items-center gap-2">
                <Hourglass className="w-4 h-4 text-[#F59E0B]" />
                <span className="text-sm text-[#F7F7F3]">Pendientes</span>
              </div>
              <span className="text-lg font-bold text-[#F59E0B]">
                {metrics.paymentStatus.pending}
              </span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-[#EF4444]/10 border border-[#EF4444]/20">
              <div className="flex items-center gap-2">
                <XCircle className="w-4 h-4 text-[#EF4444]" />
                <span className="text-sm text-[#F7F7F3]">Fallidos</span>
              </div>
              <span className="text-lg font-bold text-[#EF4444]">
                {metrics.paymentStatus.failed}
              </span>
            </div>
          </div>

          {/* Revenue summary footer */}
          <div className="mt-4 pt-4 border-t border-[#3D4A5C]">
            <div className="flex justify-between text-sm">
              <span className="text-[#8A9099]">Total órdenes</span>
              <span className="font-semibold text-[#F7F7F3]">{metrics.orders.total}</span>
            </div>
            <div className="flex justify-between text-sm mt-1.5">
              <span className="text-[#8A9099]">Ingresos proyectados</span>
              <span className="font-semibold text-[#22C55E]">
                {formatUsd(metrics.revenue.projected)}/mo
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

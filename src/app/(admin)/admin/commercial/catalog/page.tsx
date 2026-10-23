import { getServices } from "@/lib/admin/commercial"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { TogglePublishButton } from "./toggle-publish-button"
import type { AdminService } from "@/types/admin"

function formatPrice(service: AdminService): string {
  const active = service.prices.filter((p) => p.isActive)
  if (!active.length) return "Sin precios"
  return active
    .map((p) => {
      const amount =
        p.basePriceUsd !== null ? `$${p.basePriceUsd.toLocaleString("en-US")}` : "Custom"
      const period = p.billingPeriodVal ?? "one-time"
      return `${p.nameEn}: ${amount}/${period}`
    })
    .join(" · ")
}

function CategoryBadge({ category }: { category: string }) {
  return (
    <span className="inline-flex items-center text-xs px-2 py-0.5 rounded-full bg-[#3D4A5C] text-[#8A9099] font-medium capitalize">
      {category}
    </span>
  )
}

export default async function CatalogPage() {
  const services = await getServices()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <Link
          href="/admin/commercial"
          className="flex items-center gap-1.5 text-[#8A9099] text-sm hover:text-[#F7F7F3] transition-colors mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Gestión comercial
        </Link>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-[#F7F7F3]">Catálogo de Servicios</h1>
            <p className="text-[#8A9099] text-sm mt-0.5">
              {services.length} servicio{services.length !== 1 ? "s" : ""} ·{" "}
              {services.filter((s) => s.isPublished).length} publicado
              {services.filter((s) => s.isPublished).length !== 1 ? "s" : ""}
            </p>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-[#3D4A5C]">
        <table className="w-full min-w-[700px]">
          <thead>
            <tr className="border-b border-[#3D4A5C] bg-[#14171A]">
              <th className="text-left px-4 py-3 text-xs text-[#8A9099] font-medium">
                Servicio (EN)
              </th>
              <th className="text-left px-4 py-3 text-xs text-[#8A9099] font-medium">
                Categoría
              </th>
              <th className="text-left px-4 py-3 text-xs text-[#8A9099] font-medium">
                Estado
              </th>
              <th className="text-left px-4 py-3 text-xs text-[#8A9099] font-medium">
                Precios activos
              </th>
              <th className="text-left px-4 py-3 text-xs text-[#8A9099] font-medium">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody>
            {services.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-16 text-center">
                  <p className="text-[#8A9099] text-sm">No hay servicios configurados</p>
                </td>
              </tr>
            ) : (
              services.map((service) => (
                <tr
                  key={service.id}
                  className="border-b border-[#3D4A5C] last:border-b-0 hover:bg-[#14171A]/50 transition-colors"
                >
                  <td className="px-4 py-4">
                    <div>
                      <p className="text-sm font-medium text-[#F7F7F3]">{service.nameEn}</p>
                      {service.nameEs !== service.nameEn && (
                        <p className="text-xs text-[#546072] mt-0.5">{service.nameEs}</p>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <CategoryBadge category={service.category} />
                  </td>
                  <td className="px-4 py-4">
                    {service.isPublished ? (
                      <span className="inline-flex items-center text-xs font-medium px-2 py-0.5 rounded-full bg-[#22C55E]/20 text-[#22C55E] border border-[#22C55E]/30">
                        Publicado
                      </span>
                    ) : (
                      <span className="inline-flex items-center text-xs font-medium px-2 py-0.5 rounded-full bg-[#3D4A5C] text-[#8A9099] border border-[#3D4A5C]">
                        Borrador
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-4">
                    <p className="text-xs text-[#8A9099] max-w-[300px] truncate">
                      {formatPrice(service)}
                    </p>
                  </td>
                  <td className="px-4 py-4">
                    <TogglePublishButton
                      serviceId={service.id}
                      isPublished={service.isPublished}
                    />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

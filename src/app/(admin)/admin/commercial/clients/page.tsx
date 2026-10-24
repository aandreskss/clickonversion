import { getClients } from "@/lib/admin/commercial"
import Link from "next/link"
import { ArrowLeft, Search, Users, ChevronRight } from "lucide-react"
import { NewClientButton, DeleteClientButton } from "./client-actions"

export default async function ClientsPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; page?: string }>
}) {
  const { search, page: pageParam } = await searchParams
  const page = parseInt(pageParam ?? "1", 10)

  const { items: clients, total } = await getClients({
    search: search?.trim() || undefined,
    page,
    pageSize: 20,
  })

  const totalPages = Math.max(1, Math.ceil(total / 20))

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
            <h1 className="text-2xl font-bold text-[#F7F7F3]">Clientes</h1>
            <p className="text-[#8A9099] text-sm mt-0.5">
              {total} organización{total !== 1 ? "es" : ""}
              {search ? ` · Buscando: "${search}"` : ""}
            </p>
          </div>
          <NewClientButton />
        </div>
      </div>

      {/* Search form */}
      <form method="GET" className="flex gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#546072]" />
          <input
            type="text"
            name="search"
            defaultValue={search ?? ""}
            placeholder="Buscar por nombre…"
            className="w-full bg-[#14171A] border border-[#3D4A5C] rounded-lg pl-9 pr-4 py-2 text-sm text-[#F7F7F3] placeholder:text-[#546072] focus:outline-none focus:border-[#FF5A1F] transition-colors"
          />
        </div>
        <button
          type="submit"
          className="px-4 py-2 bg-[#FF5A1F] text-white text-sm font-medium rounded-lg hover:bg-[#E44D18] transition-colors"
        >
          Buscar
        </button>
        {search && (
          <Link
            href="/admin/commercial/clients"
            className="px-4 py-2 border border-[#3D4A5C] text-[#8A9099] text-sm rounded-lg hover:border-[#546072] transition-colors"
          >
            Limpiar
          </Link>
        )}
      </form>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-[#3D4A5C]">
        <table className="w-full min-w-[700px]">
          <thead>
            <tr className="border-b border-[#3D4A5C] bg-[#14171A]">
              <th className="text-left px-4 py-3 text-xs text-[#8A9099] font-medium">
                Organización
              </th>
              <th className="text-left px-4 py-3 text-xs text-[#8A9099] font-medium">
                Email facturación
              </th>
              <th className="text-left px-4 py-3 text-xs text-[#8A9099] font-medium">
                Miembros
              </th>
              <th className="text-left px-4 py-3 text-xs text-[#8A9099] font-medium">
                Solicitudes
              </th>
              <th className="text-left px-4 py-3 text-xs text-[#8A9099] font-medium">
                Activas
              </th>
              <th className="text-left px-4 py-3 text-xs text-[#8A9099] font-medium">
                Desde
              </th>
              <th className="w-8" />
            </tr>
          </thead>
          <tbody>
            {clients.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-16 text-center">
                  <div className="flex flex-col items-center gap-2">
                    <Users className="w-8 h-8 text-[#3D4A5C]" />
                    <p className="text-[#8A9099] text-sm">
                      {search ? `Sin resultados para "${search}"` : "No hay clientes aún"}
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              clients.map((client) => (
                <tr
                  key={client.id}
                  className="border-b border-[#3D4A5C] last:border-b-0 hover:bg-[#14171A]/50 transition-colors group"
                >
                  <td className="px-4 py-3">
                    <div>
                      <p className="text-sm font-medium text-[#F7F7F3]">{client.name}</p>
                      <p className="text-xs text-[#546072]">{client.slug}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm text-[#8A9099]">
                      {client.billingEmail ?? "—"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm text-[#F7F7F3]">{client.memberCount ?? 0}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm text-[#F7F7F3]">{client.requestCount ?? 0}</span>
                  </td>
                  <td className="px-4 py-3">
                    {(client.activeRequests ?? 0) > 0 ? (
                      <span className="inline-flex items-center text-xs font-medium px-2 py-0.5 rounded-full bg-[#FF5A1F]/20 text-[#FF5A1F]">
                        {client.activeRequests}
                      </span>
                    ) : (
                      <span className="text-sm text-[#546072]">0</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm text-[#8A9099]">
                      {new Date(client.createdAt).toLocaleDateString("es-ES")}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <DeleteClientButton client={client} />
                      <Link href={`/admin/commercial/clients/${client.id}`}>
                        <ChevronRight className="w-4 h-4 text-[#3D4A5C] group-hover:text-[#FF5A1F] transition-colors" />
                      </Link>
                    </div>
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
            Página <span className="text-[#F7F7F3] font-medium">{page}</span> de{" "}
            <span className="text-[#F7F7F3] font-medium">{totalPages}</span>
          </p>
          <div className="flex gap-2">
            {page > 1 && (
              <Link
                href={`/admin/commercial/clients?page=${page - 1}${search ? `&search=${encodeURIComponent(search)}` : ""}`}
                className="px-3 py-1.5 text-sm border border-[#3D4A5C] rounded-lg text-[#8A9099] hover:border-[#FF5A1F] hover:text-[#F7F7F3] transition-colors"
              >
                Anterior
              </Link>
            )}
            {page < totalPages && (
              <Link
                href={`/admin/commercial/clients?page=${page + 1}${search ? `&search=${encodeURIComponent(search)}` : ""}`}
                className="px-3 py-1.5 text-sm border border-[#3D4A5C] rounded-lg text-[#8A9099] hover:border-[#FF5A1F] hover:text-[#F7F7F3] transition-colors"
              >
                Siguiente
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

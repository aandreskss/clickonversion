import { getSpecialists } from "@/lib/admin/specialists"
import { SpecialistLoadBar } from "@/components/admin/specialist-load-bar"
import Link from "next/link"

export default async function TeamPage() {
  const specialists = await getSpecialists()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#F7F7F3]">Equipo Interno</h1>
          <p className="text-[#8A9099] text-sm mt-0.5">
            {specialists.length} especialista{specialists.length !== 1 ? "s" : ""} configurado
            {specialists.length !== 1 ? "s" : ""}
          </p>
        </div>
        <Link
          href="/admin/team/new"
          className="bg-[#FF5A1F] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#E44D18] transition-colors"
        >
          + Añadir especialista
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {specialists.length === 0 ? (
          <div className="col-span-3 bg-[#14171A] border border-[#3D4A5C] rounded-xl p-12 text-center">
            <p className="text-[#8A9099]">No hay especialistas configurados</p>
            <Link
              href="/admin/team/new"
              className="inline-block mt-4 text-sm text-[#FF5A1F] hover:underline"
            >
              Añadir el primero
            </Link>
          </div>
        ) : (
          specialists.map((s) => (
            <Link
              href={`/admin/team/${s.id}`}
              key={s.id}
              className="bg-[#14171A] border border-[#3D4A5C] rounded-xl p-5 hover:border-[#FF5A1F] transition-colors group block"
            >
              {/* Header */}
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-[#FF5A1F]/20 flex items-center justify-center text-[#FF5A1F] font-bold text-lg flex-shrink-0">
                  {s.displayName.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-[#F7F7F3] group-hover:text-[#FF5A1F] transition-colors truncate">
                    {s.displayName}
                  </div>
                  <div className="text-xs text-[#8A9099] truncate">{s.user?.email}</div>
                </div>
                {!s.isActive && (
                  <span className="text-xs text-[#8A9099] bg-[#3D4A5C] px-2 py-0.5 rounded flex-shrink-0">
                    Inactivo
                  </span>
                )}
              </div>

              {/* Load bar */}
              <SpecialistLoadBar
                current={s.currentLoad ?? 0}
                max={s.maxConcurrent}
                showLabel
              />

              {/* Timezone */}
              <div className="mt-3 text-xs text-[#546072]">{s.timezone}</div>
            </Link>
          ))
        )}
      </div>
    </div>
  )
}

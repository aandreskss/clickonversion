"use client"

import { useRouter, usePathname } from "next/navigation"
import Link from "next/link"
import { LogOut, ChevronRight } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import type { AdminSession, AdminRole } from "@/types/admin"

interface AdminHeaderProps {
  session: AdminSession
}

const BREADCRUMB_MAP: Record<string, string> = {
  admin:       "Dashboard",
  queue:       "Cola",
  team:        "Equipo",
  commercial:  "Comercial",
  catalog:     "Catálogo",
  quotes:      "Cotizaciones",
  clients:     "Clientes",
  payments:    "Pagos",
  analytics:   "Analítica",
  settings:    "Configuración",
}

const ROLE_STYLES: Record<AdminRole, { label: string; color: string }> = {
  owner:      { label: "Owner",       color: "#F59E0B" },
  admin:      { label: "Admin",       color: "#3B82F6" },
  manager:    { label: "Manager",     color: "#22C55E" },
  specialist: { label: "Especialista", color: "#FF5A1F" },
}

function RoleBadge({ role }: { role: AdminRole | null }) {
  if (!role) return null
  const style = ROLE_STYLES[role]
  return (
    <span
      className="inline-flex items-center text-xs font-semibold px-2.5 py-1 rounded-full"
      style={{
        backgroundColor: `${style.color}22`,
        color: style.color,
        border: `1px solid ${style.color}44`,
      }}
    >
      {style.label}
    </span>
  )
}

function Breadcrumbs({ pathname }: { pathname: string }) {
  // Remove leading /admin and split segments
  const segments = pathname
    .replace(/^\/admin\/?/, "")
    .split("/")
    .filter(Boolean)

  const crumbs: Array<{ label: string; href: string }> = [
    { label: "Dashboard", href: "/admin" },
  ]

  let accumulated = "/admin"
  for (const segment of segments) {
    accumulated += `/${segment}`
    const label = BREADCRUMB_MAP[segment]
    if (label) {
      crumbs.push({ label, href: accumulated })
    } else {
      // Dynamic segment (e.g., an ID) — show truncated
      crumbs.push({ label: segment.slice(0, 8) + "…", href: accumulated })
    }
  }

  return (
    <nav aria-label="Breadcrumb" className="flex items-center gap-1">
      {crumbs.map((crumb, idx) => {
        const isLast = idx === crumbs.length - 1
        return (
          <span key={crumb.href} className="flex items-center gap-1">
            {idx > 0 && (
              <ChevronRight className="w-3.5 h-3.5 text-[#3D4A5C]" aria-hidden="true" />
            )}
            {isLast ? (
              <span className="text-sm font-medium text-[#F7F7F3]">
                {crumb.label}
              </span>
            ) : (
              <Link
                href={crumb.href}
                className="text-sm text-[#8A9099] hover:text-[#F7F7F3] transition-colors"
              >
                {crumb.label}
              </Link>
            )}
          </span>
        )
      })}
    </nav>
  )
}

export function AdminHeader({ session }: AdminHeaderProps) {
  const router = useRouter()
  const pathname = usePathname()

  async function handleLogout() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push("/login")
  }

  return (
    <header className="flex items-center justify-between px-4 lg:px-6 py-3 border-b border-[#3D4A5C] bg-[#0B0D0F] flex-shrink-0">
      {/* Breadcrumb — offset for mobile hamburger */}
      <div className="pl-12 lg:pl-0">
        <Breadcrumbs pathname={pathname} />
      </div>

      {/* Right side */}
      <div className="flex items-center gap-3">
        {/* Link to CRM */}
        <Link
          href="/app"
          className="hidden sm:flex items-center gap-1 text-xs text-[#8A9099] hover:text-[#F7F7F3] transition-colors border border-[#3D4A5C] px-3 py-1.5 rounded-lg hover:border-[#546072]"
        >
          CRM
          <ChevronRight className="w-3.5 h-3.5" />
        </Link>

        {/* User info */}
        <div className="hidden sm:flex items-center gap-2">
          <RoleBadge role={session.adminRole} />
          <span className="text-xs text-[#546072] max-w-[160px] truncate">
            {session.email}
          </span>
        </div>

        {/* Logout */}
        <button
          type="button"
          onClick={handleLogout}
          className="flex items-center justify-center w-8 h-8 rounded-lg border border-[#3D4A5C] text-[#546072] hover:text-[#EF4444] hover:border-[#EF4444]/40 transition-colors"
          aria-label="Cerrar sesión"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </header>
  )
}

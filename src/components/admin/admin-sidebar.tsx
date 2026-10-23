"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  ListChecks,
  Users,
  ShoppingBag,
  CreditCard,
  BarChart2,
  Settings,
  ChevronDown,
  Menu,
  X,
} from "lucide-react"
import type { AdminSession } from "@/types/admin"

interface AdminSidebarProps {
  session: AdminSession
}

interface NavItem {
  label:       string
  href:        string
  icon:        React.ComponentType<{ className?: string }>
  permission?: string
  children?:   Array<{ label: string; href: string }>
}

const NAV_ITEMS: NavItem[] = [
  {
    label: "Dashboard",
    href:  "/admin",
    icon:  LayoutDashboard,
    // always visible for admins — no extra permission check beyond dashboard:read (enforced in layout)
  },
  {
    label:      "Cola",
    href:       "/admin/queue",
    icon:       ListChecks,
    permission: "queue:read",
  },
  {
    label:      "Equipo",
    href:       "/admin/team",
    icon:       Users,
    permission: "team:read",
  },
  {
    label:      "Comercial",
    href:       "/admin/commercial",
    icon:       ShoppingBag,
    permission: "commercial:read",
    children: [
      { label: "Catálogo",     href: "/admin/commercial/catalog" },
      { label: "Cotizaciones", href: "/admin/commercial/quotes" },
      { label: "Clientes",     href: "/admin/commercial/clients" },
    ],
  },
  {
    label:      "Pagos",
    href:       "/admin/payments",
    icon:       CreditCard,
    permission: "payments:read",
  },
  {
    label:      "Analítica",
    href:       "/admin/analytics",
    icon:       BarChart2,
    permission: "analytics:read",
  },
  {
    label:      "Config",
    href:       "/admin/settings",
    icon:       Settings,
    permission: "settings:read",
  },
]

const ROLE_LABELS: Record<string, string> = {
  owner:      "Owner",
  admin:      "Admin",
  manager:    "Manager",
  specialist: "Especialista",
}

const ROLE_COLORS: Record<string, string> = {
  owner:      "#F59E0B",
  admin:      "#3B82F6",
  manager:    "#22C55E",
  specialist: "#FF5A1F",
}

function RoleBadge({ role }: { role: string | null }) {
  if (!role) return null
  const color = ROLE_COLORS[role] ?? "#8A9099"
  return (
    <span
      className="inline-flex items-center text-xs font-medium px-2 py-0.5 rounded-full"
      style={{
        backgroundColor: `${color}22`,
        color,
        border: `1px solid ${color}44`,
      }}
    >
      {ROLE_LABELS[role] ?? role}
    </span>
  )
}

function SidebarContent({
  session,
  onNavigate,
}: {
  session: AdminSession
  onNavigate?: () => void
}) {
  const pathname = usePathname()
  const [commercialOpen, setCommercialOpen] = useState(
    pathname.startsWith("/admin/commercial")
  )

  function isActive(href: string): boolean {
    if (href === "/admin") return pathname === "/admin"
    return pathname.startsWith(href)
  }

  function canSee(item: NavItem): boolean {
    if (!item.permission) return true
    return (session.permissions as string[]).includes(item.permission)
  }

  return (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-[#3D4A5C]">
        <Link
          href="/admin"
          className="flex items-center gap-2"
          onClick={onNavigate}
        >
          <div className="w-8 h-8 bg-[#FF5A1F] rounded-lg flex items-center justify-center flex-shrink-0">
            <span className="text-white font-bold text-sm">CK</span>
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-[#F7F7F3] truncate">
              ClicKonversion
            </p>
            <p className="text-xs text-[#546072]">Admin</p>
          </div>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-4 px-3">
        <ul className="flex flex-col gap-0.5">
          {NAV_ITEMS.filter(canSee).map((item) => {
            const Icon = item.icon
            const active = isActive(item.href)
            const hasChildren = !!item.children

            if (hasChildren) {
              return (
                <li key={item.href}>
                  <button
                    type="button"
                    onClick={() => setCommercialOpen((v) => !v)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                      active
                        ? "text-[#FF5A1F] bg-[#FF5A1F]/10"
                        : "text-[#8A9099] hover:bg-[#14171A] hover:text-[#F7F7F3]"
                    }`}
                  >
                    <Icon className="w-4 h-4 flex-shrink-0" />
                    <span className="flex-1 text-left">{item.label}</span>
                    <ChevronDown
                      className={`w-4 h-4 flex-shrink-0 transition-transform ${
                        commercialOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {commercialOpen && item.children && (
                    <ul className="ml-7 mt-0.5 flex flex-col gap-0.5">
                      {item.children.map((child) => {
                        const childActive = pathname === child.href
                        return (
                          <li key={child.href}>
                            <Link
                              href={child.href}
                              onClick={onNavigate}
                              className={`block px-3 py-2 rounded-lg text-sm transition-colors ${
                                childActive
                                  ? "text-[#FF5A1F] bg-[#FF5A1F]/10"
                                  : "text-[#8A9099] hover:bg-[#14171A] hover:text-[#F7F7F3]"
                              }`}
                            >
                              {child.label}
                            </Link>
                          </li>
                        )
                      })}
                    </ul>
                  )}
                </li>
              )
            }

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={onNavigate}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    active
                      ? "text-[#FF5A1F] bg-[#FF5A1F]/10"
                      : "text-[#8A9099] hover:bg-[#14171A] hover:text-[#F7F7F3]"
                  }`}
                >
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  {item.label}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* User info */}
      <div className="px-5 py-4 border-t border-[#3D4A5C]">
        <div className="flex items-center gap-2 mb-1">
          <RoleBadge role={session.adminRole} />
        </div>
        <p className="text-xs text-[#546072] truncate">{session.email}</p>
      </div>
    </div>
  )
}

export function AdminSidebar({ session }: AdminSidebarProps) {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col w-60 flex-shrink-0 bg-[#0B0D0F] border-r border-[#3D4A5C] h-screen sticky top-0">
        <SidebarContent session={session} />
      </aside>

      {/* Mobile hamburger */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button
          type="button"
          onClick={() => setMobileOpen(true)}
          className="flex items-center justify-center w-10 h-10 bg-[#14171A] border border-[#3D4A5C] rounded-lg text-[#F7F7F3] hover:border-[#FF5A1F] transition-colors"
          aria-label="Abrir menú"
        >
          <Menu className="w-5 h-5" />
        </button>
      </div>

      {/* Mobile sidebar */}
      {mobileOpen && (
        <>
          {/* Overlay */}
          <div
            className="lg:hidden fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
            aria-hidden="true"
          />

          {/* Drawer */}
          <aside className="lg:hidden fixed inset-y-0 left-0 z-50 w-60 bg-[#0B0D0F] border-r border-[#3D4A5C] flex flex-col">
            <div className="flex items-center justify-end px-4 py-3 border-b border-[#3D4A5C]">
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                className="text-[#546072] hover:text-[#F7F7F3] transition-colors"
                aria-label="Cerrar menú"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <SidebarContent
              session={session}
              onNavigate={() => setMobileOpen(false)}
            />
          </aside>
        </>
      )}
    </>
  )
}

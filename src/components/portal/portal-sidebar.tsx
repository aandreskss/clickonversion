"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import {
  LayoutDashboard,
  FileText,
  FolderOpen,
  CreditCard,
  Settings,
  LogOut,
} from "lucide-react"
import { signOut } from "next-auth/react"
import type { OrgMemberRole } from "@/types/portal"

interface PortalSidebarProps {
  orgName:  string
  orgRole:  OrgMemberRole
}

const NAV_ITEMS = [
  { href: "/portal/dashboard",  label: "Dashboard",  icon: LayoutDashboard },
  { href: "/portal/requests",   label: "Requests",   icon: FileText },
  { href: "/portal/documents",  label: "Documents",  icon: FolderOpen },
  { href: "/portal/billing",    label: "Billing",    icon: CreditCard },
  { href: "/portal/settings",   label: "Settings",   icon: Settings },
]

export function PortalSidebar({ orgName, orgRole }: PortalSidebarProps) {
  const pathname = usePathname()
  const router   = useRouter()

  async function handleSignOut() {
    await signOut({ redirect: false })
    router.push("/portal/login")
    router.refresh()
  }

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col w-60 bg-[#0D1117] border-r border-white/6 shrink-0">
        <div className="px-5 py-5 border-b border-white/6">
          <p className="text-xs font-semibold text-[#546072] uppercase tracking-wider mb-0.5">
            {orgRole === "owner" ? "Owner" : orgRole === "admin" ? "Admin" : "Member"}
          </p>
          <p className="text-sm font-semibold text-white truncate">{orgName}</p>
        </div>

        <nav className="flex-1 p-3 space-y-0.5">
          {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
            const active = pathname === href || pathname.startsWith(href + "/")
            return (
              <Link
                key={href}
                href={href}
                className={[
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                  active
                    ? "bg-[#FF5A1F]/15 text-[#FF5A1F]"
                    : "text-[#8A9099] hover:text-white hover:bg-white/5",
                ].join(" ")}
              >
                <Icon size={16} />
                {label}
              </Link>
            )
          })}
        </nav>

        <div className="p-3 border-t border-white/6">
          <button
            onClick={handleSignOut}
            className="flex w-full items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-[#546072] hover:text-white hover:bg-white/5 transition-colors"
          >
            <LogOut size={16} />
            Sign out
          </button>
        </div>
      </aside>

      {/* Mobile — bottom nav */}
      <nav className="fixed bottom-0 inset-x-0 lg:hidden bg-[#0D1117] border-t border-white/6 flex items-center justify-around px-2 py-2 z-50">
        {NAV_ITEMS.slice(0, 4).map(({ href, label, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(href + "/")
          return (
            <Link
              key={href}
              href={href}
              className={[
                "flex flex-col items-center gap-1 px-3 py-1.5 rounded-lg transition-colors text-xs",
                active ? "text-[#FF5A1F]" : "text-[#546072]",
              ].join(" ")}
            >
              <Icon size={18} />
              {label}
            </Link>
          )
        })}
      </nav>
    </>
  )
}

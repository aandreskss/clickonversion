"use client"

import Link         from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Logo }     from "@/components/ui/logo"
import { createClient } from "@/lib/supabase/client"
import { cn }       from "@/lib/utils"
import {
  LayoutDashboard, Building2, GitBranch, CheckSquare,
  Upload, Settings, LogOut, ChevronRight,
} from "lucide-react"

const NAV = [
  { href: "/app",           label: "Dashboard",  icon: LayoutDashboard },
  { href: "/app/companies", label: "Companies",  icon: Building2 },
  { href: "/app/pipeline",  label: "Pipeline",   icon: GitBranch },
  { href: "/app/tasks",     label: "Tasks",      icon: CheckSquare },
  { href: "/app/import",    label: "Import",     icon: Upload },
]

const BOTTOM_NAV = [
  { href: "/app/settings", label: "Settings", icon: Settings },
]

interface AppSidebarProps {
  userEmail: string
}

export function AppSidebar({ userEmail }: AppSidebarProps) {
  const pathname = usePathname()
  const router   = useRouter()
  const supabase = createClient()

  async function handleSignOut() {
    await supabase.auth.signOut()
    router.push("/login")
    router.refresh()
  }

  function isActive(href: string) {
    if (href === "/app") return pathname === "/app"
    return pathname.startsWith(href)
  }

  return (
    <aside
      className="w-60 flex-shrink-0 bg-white border-r border-slate-200 flex flex-col"
      aria-label="CRM navigation"
    >
      {/* Logo */}
      <div className="px-5 py-5 border-b border-slate-100">
        <Link href="/app">
          <Logo variant="dark" size="sm" />
        </Link>
      </div>

      {/* Main nav */}
      <nav className="flex-1 px-3 py-4 flex flex-col gap-0.5" role="navigation">
        {NAV.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors duration-150",
              isActive(href)
                ? "bg-[#FF5A1F]/8 text-[#FF5A1F]"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
            )}
            aria-current={isActive(href) ? "page" : undefined}
          >
            <Icon size={16} />
            {label}
            {isActive(href) && <ChevronRight size={14} className="ml-auto" />}
          </Link>
        ))}
      </nav>

      {/* Bottom */}
      <div className="px-3 py-4 border-t border-slate-100 flex flex-col gap-0.5">
        {BOTTOM_NAV.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors duration-150",
              isActive(href)
                ? "bg-[#FF5A1F]/8 text-[#FF5A1F]"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
            )}
          >
            <Icon size={16} />
            {label}
          </Link>
        ))}

        {/* User */}
        <div className="mt-2 px-3 py-2 rounded-lg bg-slate-50">
          <p className="text-xs text-slate-500 truncate mb-2">{userEmail}</p>
          <button
            onClick={handleSignOut}
            className="flex items-center gap-2 text-xs font-medium text-slate-500 hover:text-slate-900 transition-colors"
          >
            <LogOut size={13} />
            Sign out
          </button>
        </div>
      </div>
    </aside>
  )
}

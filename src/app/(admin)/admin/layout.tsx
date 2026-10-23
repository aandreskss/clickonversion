import { redirect } from "next/navigation"
import { getAdminSession } from "@/lib/admin/auth"
import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { AdminHeader } from "@/components/admin/admin-header"
import type { ReactNode } from "react"

export const metadata = {
  robots: { index: false, follow: false },
}

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const session = await getAdminSession()

  if (!session) redirect("/login?next=/admin")
  if (!session.permissions.includes("dashboard:read")) redirect("/app")

  return (
    <div className="flex h-screen bg-[#0B0D0F] text-[#F7F7F3] overflow-hidden">
      <AdminSidebar session={session} />
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <AdminHeader session={session} />
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  )
}

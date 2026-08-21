import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { AppSidebar }   from "@/components/crm/app-sidebar"

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect("/login")

  return (
    <div className="flex h-screen overflow-hidden bg-[#F7F8FA]">
      <AppSidebar userEmail={user.email ?? ""} />
      <main className="flex-1 overflow-auto" id="main-content">
        {children}
      </main>
    </div>
  )
}

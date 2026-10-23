import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import { AppSidebar } from "@/components/crm/app-sidebar"

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()
  if (!session?.user) redirect("/login")

  return (
    <div className="flex h-screen overflow-hidden bg-[#F7F8FA]">
      <AppSidebar userEmail={session.user.email ?? ""} />
      <main className="flex-1 overflow-auto" id="main-content">
        {children}
      </main>
    </div>
  )
}

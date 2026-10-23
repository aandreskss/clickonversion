import { redirect } from "next/navigation"
import { getPortalSession } from "@/lib/portal/auth"
import { PortalSidebar } from "@/components/portal/portal-sidebar"
import { PortalHeader } from "@/components/portal/portal-header"

export default async function PortalAuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getPortalSession()

  if (!session) {
    redirect("/portal/login")
  }

  return (
    <div className="min-h-screen bg-[#0B0D0F] flex">
      <PortalSidebar orgName={session.org.name} orgRole={session.orgRole} />
      <div className="flex-1 flex flex-col min-w-0">
        <PortalHeader
          userName={session.email}
          orgName={session.org.name}
          orgId={session.orgId}
        />
        <main className="flex-1 p-6 lg:p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  )
}

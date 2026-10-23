import type { Metadata } from "next"
import { getPortalSession } from "@/lib/portal/auth"
import { getDocuments } from "@/lib/portal/documents"
import { DocumentList } from "@/components/portal/document-list"

export const metadata: Metadata = { title: "Documents — Portal" }

export default async function DocumentsPage() {
  const session = await getPortalSession()
  if (!session) return null

  const documents = await getDocuments(session.orgId)

  return (
    <div className="space-y-6 pb-24 lg:pb-0">
      <div>
        <h1 className="text-2xl font-bold text-white">Documents</h1>
        <p className="text-sm text-[#546072] mt-1">Deliverables and files shared with you.</p>
      </div>
      <DocumentList documents={documents} orgId={session.orgId} showRequest />
    </div>
  )
}

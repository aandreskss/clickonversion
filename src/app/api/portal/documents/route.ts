import { NextResponse, type NextRequest } from "next/server"
import { getPortalSession }               from "@/lib/portal/auth"
import { getDocuments, uploadDocument, validateFile } from "@/lib/portal/documents"

export async function GET(req: NextRequest) {
  const session = await getPortalSession()
  if (!session) return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 })

  const orgId = req.nextUrl.searchParams.get("orgId")
  if (orgId && orgId !== session.orgId) {
    return NextResponse.json({ error: "FORBIDDEN" }, { status: 403 })
  }

  const docs = await getDocuments(session.orgId)
  return NextResponse.json(docs)
}

export async function POST(req: NextRequest) {
  const session = await getPortalSession()
  if (!session) return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 })

  const form = await req.formData()
  const file      = form.get("file")
  const orgId     = form.get("orgId")
  const requestId = form.get("requestId")

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No file provided." }, { status: 400 })
  }
  if (typeof orgId !== "string" || orgId !== session.orgId) {
    return NextResponse.json({ error: "FORBIDDEN" }, { status: 403 })
  }

  const validation = validateFile({ name: file.name, size: file.size, type: file.type })
  if (!validation.valid) {
    return NextResponse.json({ error: validation.reason }, { status: 400 })
  }

  const bytes = await file.arrayBuffer()
  const buffer = Buffer.from(bytes)

  try {
    const doc = await uploadDocument({
      orgId,
      requestId:  typeof requestId === "string" ? requestId : null,
      uploadedBy: session.userId,
      fileName:   file.name,
      mimeType:   file.type,
      sizeBytes:  file.size,
      fileBuffer: buffer,
    })
    return NextResponse.json(doc, { status: 201 })
  } catch (err) {
    const message = err instanceof Error ? err.message : "Upload failed."
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

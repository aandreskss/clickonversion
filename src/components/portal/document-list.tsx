"use client"

import { useState, useRef } from "react"
import { FileText, Download, Trash2, Upload, Loader2 } from "lucide-react"
import type { PortalDocument } from "@/types/portal"

interface Props {
  documents:    PortalDocument[]
  orgId:        string
  requestId?:   string
  showRequest?: boolean
}

const MIME_ICONS: Record<string, string> = {
  "application/pdf": "PDF",
  "image/png":       "PNG",
  "image/jpeg":      "JPG",
  "image/webp":      "WEBP",
  "text/csv":        "CSV",
  "application/zip": "ZIP",
}

function mimeLabel(mime: string) {
  for (const [key, val] of Object.entries(MIME_ICONS)) {
    if (mime.startsWith(key) || mime === key) return val
  }
  return "FILE"
}

function formatBytes(bytes: number) {
  if (bytes < 1024)        return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export function DocumentList({ documents: initial, orgId, requestId, showRequest }: Props) {
  const [docs,    setDocs]    = useState<PortalDocument[]>(initial)
  const [uploading, setUploading] = useState(false)
  const [error,   setError]   = useState<string | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  async function handleDownload(docId: string, fileName: string) {
    const res = await fetch(`/api/portal/documents/${docId}?orgId=${orgId}`)
    if (!res.ok) { setError("Could not download file."); return }
    const { url } = await res.json() as { url: string }
    const a = document.createElement("a")
    a.href = url
    a.download = fileName
    a.click()
  }

  async function handleDelete(docId: string) {
    if (!confirm("Delete this document?")) return
    const res = await fetch(`/api/portal/documents/${docId}?orgId=${orgId}`, { method: "DELETE" })
    if (res.ok) {
      setDocs((prev) => prev.filter((d) => d.id !== docId))
    } else {
      setError("Failed to delete document.")
    }
  }

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    setError(null)

    const form = new FormData()
    form.append("file", file)
    form.append("orgId", orgId)
    if (requestId) form.append("requestId", requestId)

    const res = await fetch("/api/portal/documents", {
      method: "POST",
      body:   form,
    })

    if (!res.ok) {
      const data = await res.json() as { error?: string }
      setError(data.error ?? "Upload failed.")
    } else {
      const doc = await res.json() as PortalDocument
      setDocs((prev) => [doc, ...prev])
    }

    setUploading(false)
    if (fileRef.current) fileRef.current.value = ""
  }

  return (
    <div className="space-y-3">
      {/* Upload */}
      <div>
        <input
          ref={fileRef}
          type="file"
          id="doc-upload"
          className="sr-only"
          accept=".pdf,.doc,.docx,.xls,.xlsx,.csv,.png,.jpg,.jpeg,.webp,.zip"
          onChange={handleUpload}
          disabled={uploading}
        />
        <label
          htmlFor="doc-upload"
          className={[
            "flex items-center justify-center gap-2 py-3 px-4 rounded-xl border border-dashed border-white/15 text-sm cursor-pointer transition-colors",
            uploading
              ? "opacity-50 cursor-not-allowed"
              : "hover:border-[#FF5A1F]/40 hover:bg-[#FF5A1F]/5 text-[#546072] hover:text-white",
          ].join(" ")}
        >
          {uploading ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
          {uploading ? "Uploading…" : "Upload file (max 50 MB)"}
        </label>
      </div>

      {error && <p className="text-xs text-red-400">{error}</p>}

      {/* List */}
      {docs.length === 0 ? (
        <p className="text-sm text-[#546072] py-2">No documents yet.</p>
      ) : (
        <ul className="space-y-2">
          {docs.map((doc) => (
            <li
              key={doc.id}
              className="flex items-center gap-3 p-3 rounded-xl border border-white/6 bg-[#14171A]"
            >
              <div className="w-9 h-9 rounded-lg bg-[#FF5A1F]/10 flex items-center justify-center shrink-0">
                <span className="text-[9px] font-bold text-[#FF5A1F]">{mimeLabel(doc.mimeType)}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">{doc.fileName}</p>
                <p className="text-xs text-[#546072]">
                  {formatBytes(doc.fileSizeBytes)}
                  {" · "}
                  {new Date(doc.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                  {doc.uploader && ` · ${doc.uploader.fullName ?? doc.uploader.email}`}
                </p>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <button
                  onClick={() => handleDownload(doc.id, doc.fileName)}
                  aria-label="Download"
                  className="p-2 rounded-lg text-[#546072] hover:text-white hover:bg-white/5 transition-colors"
                >
                  <Download size={15} />
                </button>
                {doc.uploadedBy === doc.id /* placeholder — real check via auth */ && (
                  <button
                    onClick={() => handleDelete(doc.id)}
                    aria-label="Delete"
                    className="p-2 rounded-lg text-[#546072] hover:text-red-400 hover:bg-red-500/5 transition-colors"
                  >
                    <Trash2 size={15} />
                  </button>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

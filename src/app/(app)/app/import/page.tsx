"use client"

import { useState, useRef }   from "react"
import { useRouter }           from "next/navigation"
import Papa                    from "papaparse"
import { createClient }        from "@/lib/supabase/client"
import { normalizeDomain, normalizeName, normalizeEmail } from "@/lib/normalize"
import { Upload, Download, AlertTriangle, CheckCircle, Loader2, X } from "lucide-react"

interface CSVRow {
  company_name?: string
  website?:      string
  city?:         string
  state?:        string
  industry?:     string
  contact_name?: string
  email?:        string
  phone?:        string
  source?:       string
  notes?:        string
  [key: string]: string | undefined
}

interface PreviewRow {
  company_name?: string
  website?:      string
  city?:         string
  state?:        string
  industry?:     string
  contact_name?: string
  email?:        string
  phone?:        string
  source?:       string
  notes?:        string
  _duplicate?:   boolean
  _error?:       string
}

export default function ImportPage() {
  const router   = useRouter()
  const fileRef  = useRef<HTMLInputElement>(null)
  const [preview, setPreview]   = useState<PreviewRow[]>([])
  const [loading, setLoading]   = useState(false)
  const [imported, setImported] = useState<number | null>(null)
  const [errors,   setErrors]   = useState<string[]>([])

  function handleFile(file: File) {
    Papa.parse<CSVRow>(file, {
      header:         true,
      skipEmptyLines: true,
      complete: async (results) => {
        const rows = results.data

        // Load existing domains for duplicate detection
        const supabase = createClient()
        const { data: companies } = await supabase.from("companies").select("normalized_domain")
        const domainSet = new Set(companies?.map((c) => c.normalized_domain).filter(Boolean) as string[])

        const enriched: PreviewRow[] = rows.map((row) => {
          const domain = normalizeDomain(row.website ?? "")
          const preview: PreviewRow = {
            company_name: row.company_name,
            website:      row.website,
            city:         row.city,
            state:        row.state,
            industry:     row.industry,
            contact_name: row.contact_name,
            email:        row.email,
            phone:        row.phone,
            source:       row.source,
            notes:        row.notes,
            _duplicate:   domain ? domainSet.has(domain) : false,
          }
          return preview
        })
        setPreview(enriched)
      },
    })
  }

  function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) handleFile(file)
  }

  function onDrop(e: React.DragEvent) {
    e.preventDefault()
    const file = e.dataTransfer.files?.[0]
    if (file) handleFile(file)
  }

  async function doImport() {
    setLoading(true)
    setErrors([])
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { setLoading(false); return }

    const { data: membership } = await supabase.from("organization_members").select("organization_id").eq("user_id", user.id).single()
    if (!membership) { setLoading(false); return }

    let count  = 0
    const errs: string[] = []

    for (const row of preview.filter((r) => !r._duplicate)) {
      if (!row.company_name) { errs.push(`Row missing company_name`); continue }

      const { data: company, error: cErr } = await supabase.from("companies").insert({
        organization_id:  membership.organization_id,
        name:             row.company_name,
        normalized_name:  normalizeName(row.company_name),
        website:          row.website ?? null,
        normalized_domain: normalizeDomain(row.website ?? ""),
        city:             row.city ?? null,
        state:            row.state ?? null,
        industry:         row.industry ?? null,
        phone:            row.phone ?? null,
        source:           row.source ?? null,
        notes_summary:    row.notes ?? null,
        lifecycle_status: "prospect",
      }).select("id").single()

      if (cErr || !company) { errs.push(`${row.company_name}: ${cErr?.message}`); continue }

      // Contact
      if (row.contact_name || row.email) {
        const [firstName, ...lastParts] = (row.contact_name ?? "").split(" ")
        await supabase.from("contacts").insert({
          organization_id: membership.organization_id,
          company_id:      company.id,
          first_name:      firstName || row.email?.split("@")[0] || "Unknown",
          last_name:       lastParts.join(" ") || null,
          email:           row.email ?? null,
          normalized_email: normalizeEmail(row.email ?? ""),
          phone:           row.phone ?? null,
          is_primary:      true,
        })
      }

      // Opportunity
      await supabase.from("opportunities").insert({
        organization_id: membership.organization_id,
        company_id:      company.id,
        name:            `${row.company_name} — Growth`,
        stage:           "NEW",
        source:          row.source ?? null,
      })

      count++
    }

    setImported(count)
    setErrors(errs)
    setLoading(false)
    if (count > 0) setTimeout(() => router.push("/app/companies"), 2000)
  }

  function downloadTemplate() {
    const csv = "company_name,website,city,state,industry,contact_name,email,phone,source,notes\nSunrise Cleaning Demo,sunrisecleaning.com,Miami,FL,Cleaning,John Smith,john@sunrise.com,,outbound_email,\n"
    const blob = new Blob([csv], { type: "text/csv" })
    const url  = URL.createObjectURL(blob)
    const a    = document.createElement("a")
    a.href = url; a.download = "clickonversion-import-template.csv"; a.click()
    URL.revokeObjectURL(url)
  }

  const validRows     = preview.filter((r) => !r._duplicate).length
  const duplicateRows = preview.filter((r) => r._duplicate).length

  return (
    <div className="p-6 lg:p-8 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Import Prospects</h1>
          <p className="text-sm text-slate-500 mt-1">Upload a CSV to add multiple companies at once.</p>
        </div>
        <button
          onClick={downloadTemplate}
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
        >
          <Download size={15} />
          Download Template
        </button>
      </div>

      {/* Upload zone */}
      {preview.length === 0 && (
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={onDrop}
          onClick={() => fileRef.current?.click()}
          className="border-2 border-dashed border-slate-200 rounded-2xl p-16 text-center cursor-pointer hover:border-[#FF5A1F]/50 hover:bg-[#FF5A1F]/2 transition-colors"
        >
          <Upload size={32} className="text-slate-300 mx-auto mb-4" />
          <p className="font-medium text-slate-700">Drop your CSV here or click to browse</p>
          <p className="text-sm text-slate-400 mt-1">Supports: company_name, website, city, state, industry, contact_name, email, phone, source, notes</p>
          <input ref={fileRef} type="file" accept=".csv" className="hidden" onChange={onFileChange} />
        </div>
      )}

      {/* Preview */}
      {preview.length > 0 && !imported && (
        <div>
          {/* Summary */}
          <div className="flex items-center gap-4 mb-4">
            <div className="flex items-center gap-2 px-4 py-2 bg-green-50 border border-green-200 rounded-lg text-sm text-green-700">
              <CheckCircle size={15} />
              {validRows} to import
            </div>
            {duplicateRows > 0 && (
              <div className="flex items-center gap-2 px-4 py-2 bg-amber-50 border border-amber-200 rounded-lg text-sm text-amber-700">
                <AlertTriangle size={15} />
                {duplicateRows} duplicate (will be skipped)
              </div>
            )}
            <button
              onClick={() => { setPreview([]) }}
              className="ml-auto p-2 text-slate-400 hover:text-slate-700 transition-colors"
            >
              <X size={16} />
            </button>
          </div>

          {/* Table preview */}
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden mb-5">
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="px-3 py-2 text-left font-semibold text-slate-500">Status</th>
                    {["company_name","website","city","state","industry"].map((h) => (
                      <th key={h} className="px-3 py-2 text-left font-semibold text-slate-500">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {preview.slice(0, 10).map((row, i) => (
                    <tr key={i} className={row._duplicate ? "bg-amber-50/50 opacity-60" : ""}>
                      <td className="px-3 py-2">
                        {row._duplicate
                          ? <span className="text-amber-600 font-medium">Duplicate</span>
                          : <span className="text-green-600 font-medium">New</span>
                        }
                      </td>
                      {(["company_name","website","city","state","industry"] as const).map((h) => (
                        <td key={h} className="px-3 py-2 text-slate-700 max-w-[120px] truncate">{row[h] ?? ""}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {preview.length > 10 && (
              <div className="px-4 py-2 text-xs text-slate-400 border-t border-slate-100">
                + {preview.length - 10} more rows
              </div>
            )}
          </div>

          {errors.length > 0 && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              {errors.map((e, i) => <p key={i} className="text-xs text-red-600">{e}</p>)}
            </div>
          )}

          <button
            onClick={doImport}
            disabled={loading || validRows === 0}
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#FF5A1F] text-white text-sm font-semibold rounded-lg hover:bg-[#E54A15] transition-colors disabled:opacity-60"
          >
            {loading && <Loader2 size={15} className="animate-spin" />}
            {loading ? "Importing…" : `Import ${validRows} Companies`}
          </button>
        </div>
      )}

      {/* Success */}
      {imported !== null && (
        <div className="text-center py-16">
          <CheckCircle size={48} className="text-green-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-slate-900 mb-2">Import Complete</h2>
          <p className="text-slate-500">{imported} companies imported. Redirecting to Companies…</p>
        </div>
      )}
    </div>
  )
}

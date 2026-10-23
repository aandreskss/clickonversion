"use client"

import { useState } from "react"
import type { ClientOrg } from "@/types/portal"
import { Loader2, Building2 } from "lucide-react"

interface Props {
  org:     ClientOrg
  canEdit: boolean
}

export function OrgSettingsForm({ org, canEdit }: Props) {
  const [name,    setName]    = useState(org.name)
  const [saving,  setSaving]  = useState(false)
  const [saved,   setSaved]   = useState(false)
  const [error,   setError]   = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const trimmed = name.trim()
    if (!trimmed || trimmed === org.name) return

    setSaving(true)
    setSaved(false)
    setError(null)

    const res = await fetch("/api/portal/org", {
      method:  "PATCH",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify({ name: trimmed }),
    })

    if (!res.ok) {
      const data = await res.json() as { error?: string }
      setError(data.error ?? "Failed to save changes.")
    } else {
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    }

    setSaving(false)
  }

  return (
    <section>
      <div className="flex items-center gap-3 mb-4">
        <div className="w-9 h-9 rounded-xl bg-[#FF5A1F]/10 flex items-center justify-center shrink-0">
          <Building2 size={16} className="text-[#FF5A1F]" />
        </div>
        <div>
          <h2 className="text-base font-semibold text-white">Organization</h2>
          <p className="text-xs text-[#546072]">Your company profile.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 rounded-xl border border-white/8 bg-[#14171A] p-5">
        <div className="space-y-1.5">
          <label htmlFor="org-name" className="text-xs font-medium text-[#8A9099]">
            Organization name
          </label>
          <input
            id="org-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={!canEdit || saving}
            className={[
              "w-full rounded-xl border border-white/10 bg-[#0D1117] text-white placeholder:text-[#546072]",
              "px-4 py-2.5 text-sm",
              "focus:outline-none focus:ring-2 focus:ring-[#FF5A1F]/40 focus:border-[#FF5A1F]/60",
              "disabled:opacity-60 disabled:cursor-not-allowed",
            ].join(" ")}
            maxLength={80}
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-medium text-[#8A9099]">Organization ID</label>
          <p className="px-4 py-2.5 rounded-xl border border-white/6 bg-[#0D1117] text-sm text-[#546072] font-mono select-all">
            {org.id}
          </p>
        </div>

        {canEdit && (
          <div className="flex items-center gap-3 pt-1">
            <button
              type="submit"
              disabled={saving || !name.trim() || name.trim() === org.name}
              className="px-5 py-2 rounded-xl bg-[#FF5A1F] text-white text-sm font-medium hover:bg-[#E54A15] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {saving && <Loader2 size={14} className="animate-spin" />}
              {saving ? "Saving…" : "Save changes"}
            </button>
            {saved && <span className="text-xs text-[#22C55E]">Saved.</span>}
            {error && <span className="text-xs text-red-400">{error}</span>}
          </div>
        )}
      </form>
    </section>
  )
}

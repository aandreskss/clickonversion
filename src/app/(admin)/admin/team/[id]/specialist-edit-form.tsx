"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Save, Loader2, CheckCircle2, XCircle } from "lucide-react"
import type { SpecialistProfile } from "@/types/admin"

const TIMEZONES = [
  "America/New_York",
  "America/Chicago",
  "America/Denver",
  "America/Los_Angeles",
  "America/Phoenix",
  "America/Caracas",
  "America/Bogota",
  "America/Lima",
  "America/Santiago",
  "America/Sao_Paulo",
  "America/Buenos_Aires",
  "America/Mexico_City",
  "Europe/London",
  "Europe/Madrid",
  "Europe/Berlin",
  "UTC",
]

interface SpecialistEditFormProps {
  specialist: SpecialistProfile
}

export function SpecialistEditForm({ specialist }: SpecialistEditFormProps) {
  const router = useRouter()
  const [displayName, setDisplayName] = useState(specialist.displayName)
  const [bio, setBio] = useState(specialist.bio ?? "")
  const [timezone, setTimezone] = useState(specialist.timezone)
  const [maxConcurrent, setMaxConcurrent] = useState(specialist.maxConcurrent)
  const [isActive, setIsActive] = useState(specialist.isActive)
  const [saving, setSaving] = useState(false)
  const [result, setResult] = useState<"success" | "error" | null>(null)
  const [errorMsg, setErrorMsg] = useState("")

  async function handleSave() {
    if (!displayName.trim()) return
    setSaving(true)
    setResult(null)

    try {
      const res = await fetch(`/api/admin/specialists/${specialist.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          displayName: displayName.trim(),
          bio: bio.trim() || null,
          timezone,
          maxConcurrent,
          isActive,
        }),
      })

      if (!res.ok) {
        const body = (await res.json().catch(() => ({}))) as { error?: string }
        throw new Error(body.error ?? "Error al guardar")
      }

      setResult("success")
      setTimeout(() => setResult(null), 3000)
      router.refresh()
    } catch (err: unknown) {
      setResult("error")
      setErrorMsg(err instanceof Error ? err.message : "Error inesperado")
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="bg-[#14171A] border border-[#3D4A5C] rounded-xl p-5">
      <h3 className="text-sm font-semibold text-[#F7F7F3] mb-5">Editar perfil</h3>

      <div className="space-y-4">
        {/* Display name */}
        <div>
          <label
            htmlFor="displayName"
            className="block text-xs text-[#8A9099] mb-1.5"
          >
            Nombre para mostrar
          </label>
          <input
            id="displayName"
            type="text"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            className="w-full bg-[#0B0D0F] border border-[#3D4A5C] rounded-lg px-3 py-2 text-sm text-[#F7F7F3] focus:outline-none focus:border-[#FF5A1F] transition-colors"
          />
        </div>

        {/* Bio */}
        <div>
          <label htmlFor="bio" className="block text-xs text-[#8A9099] mb-1.5">
            Bio <span className="text-[#546072]">(opcional)</span>
          </label>
          <textarea
            id="bio"
            rows={3}
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Descripción breve del especialista…"
            className="w-full bg-[#0B0D0F] border border-[#3D4A5C] rounded-lg px-3 py-2 text-sm text-[#F7F7F3] placeholder:text-[#546072] focus:outline-none focus:border-[#FF5A1F] transition-colors resize-none"
          />
        </div>

        {/* Timezone */}
        <div>
          <label htmlFor="timezone" className="block text-xs text-[#8A9099] mb-1.5">
            Zona horaria
          </label>
          <select
            id="timezone"
            value={timezone}
            onChange={(e) => setTimezone(e.target.value)}
            className="w-full bg-[#0B0D0F] border border-[#3D4A5C] rounded-lg px-3 py-2 text-sm text-[#F7F7F3] focus:outline-none focus:border-[#FF5A1F] transition-colors"
          >
            {TIMEZONES.map((tz) => (
              <option key={tz} value={tz}>
                {tz}
              </option>
            ))}
          </select>
        </div>

        {/* Max concurrent */}
        <div>
          <label htmlFor="maxConcurrent" className="block text-xs text-[#8A9099] mb-1.5">
            Máx. solicitudes simultáneas (1–10)
          </label>
          <input
            id="maxConcurrent"
            type="number"
            min={1}
            max={10}
            value={maxConcurrent}
            onChange={(e) =>
              setMaxConcurrent(Math.min(10, Math.max(1, parseInt(e.target.value, 10) || 1)))
            }
            className="w-full bg-[#0B0D0F] border border-[#3D4A5C] rounded-lg px-3 py-2 text-sm text-[#F7F7F3] focus:outline-none focus:border-[#FF5A1F] transition-colors"
          />
        </div>

        {/* Active toggle */}
        <div className="flex items-center justify-between p-3 bg-[#0B0D0F] rounded-lg border border-[#3D4A5C]">
          <div>
            <p className="text-sm text-[#F7F7F3] font-medium">Estado activo</p>
            <p className="text-xs text-[#8A9099] mt-0.5">
              Los especialistas inactivos no reciben nuevas asignaciones
            </p>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={isActive}
            onClick={() => setIsActive((v) => !v)}
            className={`relative w-12 h-6 rounded-full transition-colors ${
              isActive ? "bg-[#22C55E]" : "bg-[#3D4A5C]"
            }`}
          >
            <span
              className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${
                isActive ? "translate-x-7" : "translate-x-1"
              }`}
            />
          </button>
        </div>

        {/* Result feedback */}
        {result === "success" && (
          <div className="flex items-center gap-2 p-3 bg-[#22C55E]/10 border border-[#22C55E]/30 rounded-lg">
            <CheckCircle2 className="w-4 h-4 text-[#22C55E]" />
            <p className="text-sm text-[#22C55E]">Cambios guardados correctamente</p>
          </div>
        )}
        {result === "error" && (
          <div className="flex items-center gap-2 p-3 bg-[#EF4444]/10 border border-[#EF4444]/30 rounded-lg">
            <XCircle className="w-4 h-4 text-[#EF4444]" />
            <p className="text-sm text-[#EF4444]">{errorMsg}</p>
          </div>
        )}

        {/* Save button */}
        <button
          type="button"
          onClick={handleSave}
          disabled={saving || !displayName.trim()}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-[#FF5A1F] text-white text-sm font-medium rounded-lg hover:bg-[#E44D18] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          {saving ? "Guardando…" : "Guardar cambios"}
        </button>
      </div>
    </div>
  )
}

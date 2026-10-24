"use client"

import { useState, useTransition } from "react"
import { Plus, Trash2, Loader2, X } from "lucide-react"
import { createClientAction, deleteClientAction } from "./actions"
import { useRouter } from "next/navigation"
import type { AdminClient } from "@/types/admin"

// ── Slug generation ───────────────────────────────────────────────────────────

function toSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
}

// ── New Client Button ─────────────────────────────────────────────────────────

export function NewClientButton() {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState("")
  const [slug, setSlug] = useState("")
  const [billingEmail, setBillingEmail] = useState("")
  const [error, setError] = useState("")
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  function handleNameChange(val: string) {
    setName(val)
    setSlug(toSlug(val))
  }

  function handleClose() {
    setOpen(false)
    setName("")
    setSlug("")
    setBillingEmail("")
    setError("")
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")

    const formData = new FormData()
    formData.set("name", name)
    formData.set("slug", slug)
    formData.set("billingEmail", billingEmail)

    startTransition(async () => {
      const result = await createClientAction(formData)
      if (result.error) {
        setError(result.error)
      } else {
        handleClose()
        router.refresh()
      }
    })
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 px-4 py-2 bg-[#FF5A1F] text-white text-sm font-medium rounded-lg hover:bg-[#E54A15] transition-colors"
      >
        <Plus className="w-4 h-4" />
        Nuevo Cliente
      </button>

      {open && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
            onClick={handleClose}
            aria-hidden="true"
          />

          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-[#14171A] border border-[#3D4A5C] rounded-2xl shadow-2xl">
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-[#3D4A5C]">
                <h2 className="text-lg font-semibold text-[#F7F7F3]">Nuevo cliente</h2>
                <button
                  type="button"
                  onClick={handleClose}
                  className="text-[#546072] hover:text-[#F7F7F3] transition-colors"
                  aria-label="Cerrar"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div>
                  <label htmlFor="clientName" className="block text-xs text-[#8A9099] mb-1.5">
                    Nombre de la organización <span className="text-[#EF4444]">*</span>
                  </label>
                  <input
                    id="clientName"
                    type="text"
                    value={name}
                    onChange={(e) => handleNameChange(e.target.value)}
                    required
                    placeholder="Acme Corp"
                    className="w-full bg-[#1C2026] border border-white/10 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF5A1F]/40 placeholder:text-[#546072]"
                  />
                </div>

                <div>
                  <label htmlFor="clientSlug" className="block text-xs text-[#8A9099] mb-1.5">
                    Slug <span className="text-[#EF4444]">*</span>
                  </label>
                  <input
                    id="clientSlug"
                    type="text"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    required
                    placeholder="acme-corp"
                    className="w-full bg-[#1C2026] border border-white/10 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF5A1F]/40 placeholder:text-[#546072]"
                  />
                  <p className="text-xs text-[#546072] mt-1">Solo letras minúsculas, números y guiones</p>
                </div>

                <div>
                  <label htmlFor="clientEmail" className="block text-xs text-[#8A9099] mb-1.5">
                    Email de facturación
                  </label>
                  <input
                    id="clientEmail"
                    type="email"
                    value={billingEmail}
                    onChange={(e) => setBillingEmail(e.target.value)}
                    placeholder="billing@acme.com"
                    className="w-full bg-[#1C2026] border border-white/10 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF5A1F]/40 placeholder:text-[#546072]"
                  />
                </div>

                {error && (
                  <p className="text-sm text-[#EF4444] bg-[#EF4444]/10 border border-[#EF4444]/30 rounded-lg px-3 py-2">
                    {error}
                  </p>
                )}

                <div className="flex gap-3 pt-1">
                  <button
                    type="button"
                    onClick={handleClose}
                    className="flex-1 px-4 py-2.5 border border-[#3D4A5C] text-[#8A9099] text-sm font-medium rounded-lg hover:border-[#546072] hover:text-[#F7F7F3] transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={isPending}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-[#FF5A1F] text-white text-sm font-medium rounded-lg hover:bg-[#E54A15] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                    {isPending ? "Creando…" : "Crear cliente"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </>
      )}
    </>
  )
}

// ── Delete Client Button ──────────────────────────────────────────────────────

export function DeleteClientButton({ client }: { client: AdminClient }) {
  const [confirming, setConfirming] = useState(false)
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState("")
  const router = useRouter()

  function handleDelete() {
    setError("")
    startTransition(async () => {
      const result = await deleteClientAction(client.id)
      if (result.error) {
        setError(result.error)
        setConfirming(false)
      } else {
        router.refresh()
      }
    })
  }

  if (confirming) {
    return (
      <div className="flex items-center gap-1.5">
        {error && <span className="text-xs text-[#EF4444]">{error}</span>}
        <button
          type="button"
          onClick={handleDelete}
          disabled={isPending}
          className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium rounded-lg border border-[#EF4444]/40 text-[#EF4444] hover:bg-[#EF4444]/10 disabled:opacity-50 transition-colors"
        >
          {isPending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : null}
          {isPending ? "Eliminando…" : "Confirmar"}
        </button>
        <button
          type="button"
          onClick={() => setConfirming(false)}
          className="px-2.5 py-1.5 text-xs font-medium rounded-lg border border-[#3D4A5C] text-[#8A9099] hover:text-[#F7F7F3] transition-colors"
        >
          Cancelar
        </button>
      </div>
    )
  }

  return (
    <button
      type="button"
      onClick={() => setConfirming(true)}
      className="flex items-center gap-1.5 p-1.5 text-xs font-medium rounded-lg text-[#546072] hover:text-[#EF4444] transition-colors"
      aria-label={`Eliminar ${client.name}`}
    >
      <Trash2 className="w-4 h-4" />
    </button>
  )
}

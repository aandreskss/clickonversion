"use client"

import { useState, useTransition } from "react"
import { Plus, Pencil, Trash2, Loader2 } from "lucide-react"
import { ServiceForm } from "./service-form"
import { deleteServiceAction } from "./actions"
import { useRouter } from "next/navigation"
import type { AdminService } from "@/types/admin"

// ── New Service Button ────────────────────────────────────────────────────────

export function NewServiceButton() {
  const [open, setOpen] = useState(false)
  const router = useRouter()

  function handleSaved() {
    setOpen(false)
    router.refresh()
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 px-4 py-2 bg-[#FF5A1F] text-white text-sm font-medium rounded-lg hover:bg-[#E54A15] transition-colors"
      >
        <Plus className="w-4 h-4" />
        Nuevo Servicio
      </button>

      {open && (
        <ServiceForm
          onClose={() => setOpen(false)}
          onSaved={handleSaved}
        />
      )}
    </>
  )
}

// ── Edit Service Button ───────────────────────────────────────────────────────

export function EditServiceButton({ service }: { service: AdminService }) {
  const [open, setOpen] = useState(false)
  const router = useRouter()

  function handleSaved() {
    setOpen(false)
    router.refresh()
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-lg border border-[#3D4A5C] text-[#8A9099] hover:border-[#FF5A1F] hover:text-[#FF5A1F] transition-colors"
        aria-label="Editar servicio"
      >
        <Pencil className="w-3.5 h-3.5" />
        Editar
      </button>

      {open && (
        <ServiceForm
          service={service}
          onClose={() => setOpen(false)}
          onSaved={handleSaved}
        />
      )}
    </>
  )
}

// ── Delete Service Button ─────────────────────────────────────────────────────

export function DeleteServiceButton({ service }: { service: AdminService }) {
  const [confirming, setConfirming] = useState(false)
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState("")
  const router = useRouter()

  function handleDelete() {
    setError("")
    startTransition(async () => {
      const result = await deleteServiceAction(service.id)
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
      className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-lg border border-[#3D4A5C] text-[#546072] hover:border-[#EF4444]/40 hover:text-[#EF4444] transition-colors"
      aria-label="Eliminar servicio"
    >
      <Trash2 className="w-3.5 h-3.5" />
      Eliminar
    </button>
  )
}

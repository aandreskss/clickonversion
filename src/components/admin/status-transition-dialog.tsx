"use client"

import { useState } from "react"
import { X, AlertCircle, RefreshCw } from "lucide-react"
import { StatusBadge } from "./status-badge"
import { STATUS_TRANSITIONS } from "@/types/admin"
import type { AdminRequestStatus } from "@/types/admin"

interface StatusTransitionDialogProps {
  requestId:     string
  currentStatus: AdminRequestStatus
  open:          boolean
  onClose:       () => void
  onSuccess?:    () => void
}

const STATUS_LABELS: Record<AdminRequestStatus, string> = {
  pending_payment:        "Pend. pago",
  pending_onboarding:     "En cola (leg.)",
  queued:                 "En cola",
  waiting_client:         "Esp. cliente",
  consultation_scheduled: "Asesoría prog.",
  in_progress:            "En progreso",
  active:                 "Activo (leg.)",
  waiting_third_party:    "Esp. tercero",
  review:                 "En revisión",
  paused:                 "En pausa",
  completed:              "Completado",
  cancelled:              "Cancelado",
  refunded:               "Reembolsado",
}

export function StatusTransitionDialog({
  requestId,
  currentStatus,
  open,
  onClose,
  onSuccess,
}: StatusTransitionDialogProps) {
  const [selectedStatus, setSelectedStatus] = useState<AdminRequestStatus | null>(null)
  const [note, setNote] = useState("")
  const [waitingInfoMessage, setWaitingInfoMessage] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const validTransitions = STATUS_TRANSITIONS[currentStatus] ?? []

  function handleClose() {
    if (loading) return
    setSelectedStatus(null)
    setNote("")
    setWaitingInfoMessage("")
    setError(null)
    onClose()
  }

  async function handleConfirm() {
    if (!selectedStatus) return

    if (selectedStatus === "waiting_client" && !waitingInfoMessage.trim()) {
      setError("El mensaje al cliente es obligatorio para este estado.")
      return
    }

    setError(null)
    setLoading(true)

    try {
      const res = await fetch(`/api/admin/queue/${requestId}/status`, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({
          newStatus: selectedStatus,
          note:      note.trim() || undefined,
          waitingInfoMessage:
            selectedStatus === "waiting_client"
              ? waitingInfoMessage.trim()
              : undefined,
        }),
      })

      if (!res.ok) {
        const body = (await res.json().catch(() => ({}))) as Record<string, unknown>
        throw new Error(
          typeof body.error === "string" ? body.error : "Error al cambiar el estado"
        )
      }

      onSuccess?.()
      handleClose()
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error inesperado")
    } finally {
      setLoading(false)
    }
  }

  if (!open) return null

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
        onClick={handleClose}
        aria-hidden="true"
      />

      {/* Dialog */}
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        role="dialog"
        aria-modal="true"
        aria-labelledby="status-dialog-title"
      >
        <div className="relative w-full max-w-md bg-[#14171A] border border-[#3D4A5C] rounded-2xl shadow-2xl">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-[#3D4A5C]">
            <h2
              id="status-dialog-title"
              className="text-lg font-semibold text-[#F7F7F3]"
            >
              Cambiar estado
            </h2>
            <button
              type="button"
              onClick={handleClose}
              disabled={loading}
              className="text-[#546072] hover:text-[#F7F7F3] transition-colors disabled:opacity-40"
              aria-label="Cerrar"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="px-6 py-5 flex flex-col gap-5">
            {/* Current status */}
            <div>
              <p className="text-xs text-[#8A9099] mb-2">Estado actual</p>
              <StatusBadge status={currentStatus} size="md" />
            </div>

            {/* Valid transitions */}
            <div>
              <p className="text-xs text-[#8A9099] mb-3">Cambiar a</p>
              {validTransitions.length === 0 ? (
                <p className="text-sm text-[#546072] italic">
                  No hay transiciones disponibles desde este estado.
                </p>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  {validTransitions.map((status) => (
                    <button
                      key={status}
                      type="button"
                      onClick={() => setSelectedStatus(status)}
                      className={`flex items-center justify-center px-3 py-2.5 rounded-lg border text-sm font-medium transition-all ${
                        selectedStatus === status
                          ? "border-[#FF5A1F] bg-[#FF5A1F]/10 text-[#FF5A1F]"
                          : "border-[#3D4A5C] text-[#8A9099] hover:border-[#546072] hover:text-[#F7F7F3]"
                      }`}
                    >
                      {STATUS_LABELS[status]}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Waiting client message */}
            {selectedStatus === "waiting_client" && (
              <div>
                <label
                  htmlFor="waiting-msg"
                  className="block text-xs text-[#8A9099] mb-1.5"
                >
                  Mensaje al cliente{" "}
                  <span className="text-[#EF4444]">* requerido</span>
                </label>
                <textarea
                  id="waiting-msg"
                  rows={3}
                  value={waitingInfoMessage}
                  onChange={(e) => setWaitingInfoMessage(e.target.value)}
                  placeholder="Describe qué información o acción necesitas del cliente..."
                  className="w-full bg-[#0B0D0F] border border-[#3D4A5C] rounded-lg px-3 py-2.5 text-sm text-[#F7F7F3] placeholder:text-[#546072] focus:outline-none focus:border-[#FF5A1F] transition-colors resize-none"
                />
              </div>
            )}

            {/* Note */}
            <div>
              <label
                htmlFor="transition-note"
                className="block text-xs text-[#8A9099] mb-1.5"
              >
                Nota interna{" "}
                <span className="text-[#546072]">(opcional)</span>
              </label>
              <textarea
                id="transition-note"
                rows={2}
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Agrega contexto sobre el cambio de estado..."
                className="w-full bg-[#0B0D0F] border border-[#3D4A5C] rounded-lg px-3 py-2.5 text-sm text-[#F7F7F3] placeholder:text-[#546072] focus:outline-none focus:border-[#FF5A1F] transition-colors resize-none"
              />
            </div>

            {/* Error */}
            {error && (
              <div className="flex items-start gap-2 bg-[#EF4444]/10 border border-[#EF4444]/30 rounded-lg px-3 py-2.5">
                <AlertCircle className="w-4 h-4 text-[#EF4444] flex-shrink-0 mt-0.5" />
                <p className="text-sm text-[#EF4444]">{error}</p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex gap-3 px-6 py-4 border-t border-[#3D4A5C]">
            <button
              type="button"
              onClick={handleClose}
              disabled={loading}
              className="flex-1 px-4 py-2.5 text-sm font-medium border border-[#3D4A5C] rounded-lg text-[#8A9099] hover:border-[#546072] hover:text-[#F7F7F3] disabled:opacity-40 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={handleConfirm}
              disabled={!selectedStatus || loading}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium bg-[#FF5A1F] text-white rounded-lg hover:bg-[#FF5A1F]/90 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Guardando…
                </>
              ) : (
                "Confirmar"
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

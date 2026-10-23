"use client"

import { useState, useEffect, useCallback } from "react"
import { X, Loader2, ExternalLink, Save, Link as LinkIcon, ChevronRight } from "lucide-react"
import type { AdminQuote } from "@/types/admin"

// ── Status badges ─────────────────────────────────────────────────────────────

const QUOTE_STATUS: Record<string, { label: string; color: string }> = {
  draft:     { label: "Borrador", color: "#546072" },
  pending:   { label: "Pendiente", color: "#F59E0B" },
  sent:      { label: "Enviada", color: "#3B82F6" },
  accepted:  { label: "Aceptada", color: "#22C55E" },
  rejected:  { label: "Rechazada", color: "#EF4444" },
  expired:   { label: "Expirada", color: "#546072" },
}

function QuoteStatusBadge({ status }: { status: string }) {
  const config = QUOTE_STATUS[status] ?? { label: status, color: "#546072" }
  return (
    <span
      className="inline-flex items-center text-xs font-medium px-2 py-0.5 rounded-full"
      style={{
        backgroundColor: `${config.color}22`,
        color: config.color,
        border: `1px solid ${config.color}44`,
      }}
    >
      {config.label}
    </span>
  )
}

// ── Quote drawer ──────────────────────────────────────────────────────────────

function QuoteDrawer({
  quote,
  onClose,
  onSaved,
}: {
  quote: AdminQuote
  onClose: () => void
  onSaved: () => void
}) {
  const [scope, setScope] = useState(quote.scope ?? "")
  const [proposedPrice, setProposedPrice] = useState<string>(
    quote.proposedPriceUsd !== null ? String(quote.proposedPriceUsd) : ""
  )
  const [proposalNotes, setProposalNotes] = useState(quote.proposalNotes ?? "")
  const [saving, setSaving] = useState(false)
  const [savingLink, setSavingLink] = useState(false)
  const [paymentLink, setPaymentLink] = useState(quote.paymentLink ?? "")
  const [result, setResult] = useState<"saved" | "link_created" | "error" | null>(null)
  const [errorMsg, setErrorMsg] = useState("")

  async function handleSave() {
    setSaving(true)
    setResult(null)
    try {
      const res = await fetch(`/api/admin/commercial/quotes/${quote.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          scope: scope.trim() || null,
          proposedPriceUsd: proposedPrice ? parseFloat(proposedPrice) : null,
          proposalNotes: proposalNotes.trim() || null,
          status: "sent",
          proposalSentAt: new Date().toISOString(),
        }),
      })
      if (!res.ok) throw new Error("Error al guardar")
      setResult("saved")
      setTimeout(() => setResult(null), 2500)
      onSaved()
    } catch (err: unknown) {
      setResult("error")
      setErrorMsg(err instanceof Error ? err.message : "Error inesperado")
    } finally {
      setSaving(false)
    }
  }

  async function handleCreatePaymentLink() {
    if (!proposedPrice) return
    setSavingLink(true)
    setResult(null)
    try {
      const res = await fetch(`/api/admin/commercial/quotes/${quote.id}/payment-link`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amountUsd: parseFloat(proposedPrice),
          description: `Cotización ClicKonversion - ${quote.clientName}`,
        }),
      })
      if (!res.ok) throw new Error("Error al crear el link")
      const data = (await res.json()) as { url: string }
      setPaymentLink(data.url)
      setResult("link_created")
      setTimeout(() => setResult(null), 3000)
    } catch (err: unknown) {
      setResult("error")
      setErrorMsg(err instanceof Error ? err.message : "Error inesperado")
    } finally {
      setSavingLink(false)
    }
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div className="fixed inset-y-0 right-0 z-50 w-full max-w-xl bg-[#14171A] border-l border-[#3D4A5C] shadow-2xl overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 flex items-center justify-between px-6 py-4 border-b border-[#3D4A5C] bg-[#14171A] z-10">
          <div>
            <h2 className="text-lg font-semibold text-[#F7F7F3]">Cotización</h2>
            <p className="text-xs text-[#8A9099]">{quote.clientName}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-[#546072] hover:text-[#F7F7F3] transition-colors"
            aria-label="Cerrar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Client info */}
          <div className="bg-[#0B0D0F] rounded-xl p-4 space-y-2">
            <h3 className="text-xs font-semibold text-[#8A9099] uppercase tracking-wider mb-3">
              Cliente
            </h3>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-xs text-[#546072]">Nombre</p>
                <p className="text-[#F7F7F3] font-medium">{quote.clientName}</p>
              </div>
              <div>
                <p className="text-xs text-[#546072]">Email</p>
                <p className="text-[#F7F7F3]">{quote.clientEmail}</p>
              </div>
              {quote.clientCompany && (
                <div className="col-span-2">
                  <p className="text-xs text-[#546072]">Empresa</p>
                  <p className="text-[#F7F7F3]">{quote.clientCompany}</p>
                </div>
              )}
            </div>
          </div>

          {/* Services requested */}
          {quote.servicesRequested?.length > 0 && (
            <div>
              <h3 className="text-xs font-semibold text-[#8A9099] uppercase tracking-wider mb-3">
                Servicios solicitados
              </h3>
              <div className="space-y-2">
                {quote.servicesRequested.map((srv, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-2 p-3 bg-[#0B0D0F] rounded-lg border border-[#3D4A5C]"
                  >
                    <ChevronRight className="w-4 h-4 text-[#FF5A1F] flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm text-[#F7F7F3]">
                        Servicio: {srv.serviceId}
                      </p>
                      {srv.notes && (
                        <p className="text-xs text-[#8A9099] mt-1">{srv.notes}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Client notes */}
          {quote.clientNotes && (
            <div>
              <h3 className="text-xs font-semibold text-[#8A9099] uppercase tracking-wider mb-2">
                Notas del cliente
              </h3>
              <div className="p-3 bg-[#0B0D0F] rounded-lg border border-[#3D4A5C]">
                <p className="text-sm text-[#F7F7F3] whitespace-pre-wrap">{quote.clientNotes}</p>
              </div>
            </div>
          )}

          {/* Proposal form */}
          <div className="space-y-4">
            <h3 className="text-xs font-semibold text-[#8A9099] uppercase tracking-wider">
              Propuesta
            </h3>

            {/* Scope */}
            <div>
              <label htmlFor="scope" className="block text-xs text-[#8A9099] mb-1.5">
                Alcance
              </label>
              <textarea
                id="scope"
                rows={4}
                value={scope}
                onChange={(e) => setScope(e.target.value)}
                placeholder="Describe el alcance del proyecto para el cliente…"
                className="w-full bg-[#0B0D0F] border border-[#3D4A5C] rounded-lg px-3 py-2.5 text-sm text-[#F7F7F3] placeholder:text-[#546072] focus:outline-none focus:border-[#FF5A1F] transition-colors resize-none"
              />
            </div>

            {/* Price */}
            <div>
              <label htmlFor="price" className="block text-xs text-[#8A9099] mb-1.5">
                Precio propuesto (USD)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-[#546072]">
                  $
                </span>
                <input
                  id="price"
                  type="number"
                  min={0}
                  step={0.01}
                  value={proposedPrice}
                  onChange={(e) => setProposedPrice(e.target.value)}
                  placeholder="0.00"
                  className="w-full bg-[#0B0D0F] border border-[#3D4A5C] rounded-lg pl-7 pr-3 py-2 text-sm text-[#F7F7F3] placeholder:text-[#546072] focus:outline-none focus:border-[#FF5A1F] transition-colors"
                />
              </div>
            </div>

            {/* Proposal notes */}
            <div>
              <label htmlFor="propNotes" className="block text-xs text-[#8A9099] mb-1.5">
                Notas de la propuesta <span className="text-[#546072]">(opcionales)</span>
              </label>
              <textarea
                id="propNotes"
                rows={3}
                value={proposalNotes}
                onChange={(e) => setProposalNotes(e.target.value)}
                placeholder="Condiciones, plazos, entregables adicionales…"
                className="w-full bg-[#0B0D0F] border border-[#3D4A5C] rounded-lg px-3 py-2.5 text-sm text-[#F7F7F3] placeholder:text-[#546072] focus:outline-none focus:border-[#FF5A1F] transition-colors resize-none"
              />
            </div>

            {/* Payment link */}
            {paymentLink ? (
              <div className="flex items-center gap-2 p-3 bg-[#22C55E]/10 border border-[#22C55E]/30 rounded-lg">
                <LinkIcon className="w-4 h-4 text-[#22C55E] flex-shrink-0" />
                <a
                  href={paymentLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-[#22C55E] hover:underline flex items-center gap-1 truncate"
                >
                  Link de pago creado
                  <ExternalLink className="w-3 h-3 flex-shrink-0" />
                </a>
              </div>
            ) : (
              <button
                type="button"
                onClick={handleCreatePaymentLink}
                disabled={!proposedPrice || savingLink}
                className="flex items-center gap-2 w-full px-4 py-2.5 border border-[#3D4A5C] text-[#8A9099] text-sm font-medium rounded-lg hover:border-[#FF5A1F] hover:text-[#FF5A1F] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                {savingLink ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <LinkIcon className="w-4 h-4" />
                )}
                Crear link de pago Stripe
              </button>
            )}

            {/* Feedback */}
            {result === "saved" && (
              <p className="text-sm text-[#22C55E]">Propuesta guardada y marcada como enviada.</p>
            )}
            {result === "link_created" && (
              <p className="text-sm text-[#22C55E]">Link de pago creado correctamente.</p>
            )}
            {result === "error" && (
              <p className="text-sm text-[#EF4444]">{errorMsg}</p>
            )}

            {/* Save button */}
            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="flex items-center justify-center gap-2 w-full px-4 py-2.5 bg-[#FF5A1F] text-white text-sm font-medium rounded-lg hover:bg-[#E44D18] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              {saving ? "Guardando…" : "Guardar propuesta"}
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────

interface QuotesResponse {
  items: AdminQuote[]
  total: number
  page: number
}

export default function QuotesPage() {
  const [quotes, setQuotes] = useState<AdminQuote[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [selectedQuote, setSelectedQuote] = useState<AdminQuote | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/admin/commercial/quotes")
      if (!res.ok) throw new Error()
      const data = (await res.json()) as QuotesResponse
      setQuotes(data.items ?? [])
      setTotal(data.total ?? 0)
    } catch {
      setQuotes([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void load()
  }, [load])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#F7F7F3]">Cotizaciones</h1>
          <p className="text-[#8A9099] text-sm mt-0.5">
            {loading ? "…" : `${total} solicitud${total !== 1 ? "es" : ""}`}
          </p>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <div className="w-8 h-8 border-2 border-[#FF5A1F] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-[#3D4A5C]">
          <table className="w-full min-w-[700px]">
            <thead>
              <tr className="border-b border-[#3D4A5C] bg-[#14171A]">
                <th className="text-left px-4 py-3 text-xs text-[#8A9099] font-medium">Cliente</th>
                <th className="text-left px-4 py-3 text-xs text-[#8A9099] font-medium">Empresa</th>
                <th className="text-left px-4 py-3 text-xs text-[#8A9099] font-medium">Estado</th>
                <th className="text-left px-4 py-3 text-xs text-[#8A9099] font-medium">Precio prop.</th>
                <th className="text-left px-4 py-3 text-xs text-[#8A9099] font-medium">Vence</th>
                <th className="text-left px-4 py-3 text-xs text-[#8A9099] font-medium">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {quotes.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-16 text-center">
                    <p className="text-[#8A9099] text-sm">No hay cotizaciones</p>
                  </td>
                </tr>
              ) : (
                quotes.map((quote) => (
                  <tr
                    key={quote.id}
                    className="border-b border-[#3D4A5C] last:border-b-0 hover:bg-[#14171A]/50 transition-colors"
                  >
                    <td className="px-4 py-3">
                      <div>
                        <p className="text-sm font-medium text-[#F7F7F3]">{quote.clientName}</p>
                        <p className="text-xs text-[#546072]">{quote.clientEmail}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm text-[#8A9099]">
                        {quote.clientCompany ?? "—"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <QuoteStatusBadge status={quote.status} />
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm text-[#F7F7F3]">
                        {quote.proposedPriceUsd !== null
                          ? `$${quote.proposedPriceUsd.toLocaleString("en-US")}`
                          : "—"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm text-[#8A9099]">
                        {quote.expiresAt
                          ? new Date(quote.expiresAt).toLocaleDateString("es-ES")
                          : "—"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        type="button"
                        onClick={() => setSelectedQuote(quote)}
                        className="text-sm text-[#FF5A1F] hover:underline font-medium"
                      >
                        Ver detalle
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Drawer */}
      {selectedQuote && (
        <QuoteDrawer
          quote={selectedQuote}
          onClose={() => setSelectedQuote(null)}
          onSaved={() => {
            setSelectedQuote(null)
            void load()
          }}
        />
      )}
    </div>
  )
}

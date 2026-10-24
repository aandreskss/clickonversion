"use client"

import { useState, useTransition } from "react"
import { X, Loader2, Plus } from "lucide-react"
import { createServiceAction, updateServiceAction } from "./actions"
import type { AdminService } from "@/types/admin"

// ── Slug generation ───────────────────────────────────────────────────────────

function toSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
}

// ── Form Component ────────────────────────────────────────────────────────────

interface ServiceFormProps {
  service?: AdminService
  onClose: () => void
  onSaved: () => void
}

export function ServiceForm({ service, onClose, onSaved }: ServiceFormProps) {
  const isEdit = !!service

  // Get first active price for the form
  const firstPrice = service?.prices?.[0]

  const [nameEn, setNameEn] = useState(service?.nameEn ?? "")
  const [nameEs, setNameEs] = useState(service?.nameEs ?? "")
  const [descriptionEn, setDescriptionEn] = useState(service?.descriptionEn ?? "")
  const [descriptionEs, setDescriptionEs] = useState(service?.descriptionEs ?? "")
  const [category, setCategory] = useState(service?.category ?? "seo")
  const [slug, setSlug] = useState(service?.slug ?? "")
  const [sortOrder, setSortOrder] = useState(String(service?.sortOrder ?? "0"))
  const [priceNameEn, setPriceNameEn] = useState(firstPrice?.nameEn ?? "")
  const [amount, setAmount] = useState(firstPrice?.basePriceUsd != null ? String(firstPrice.basePriceUsd) : "")
  const [billingPeriod, setBillingPeriod] = useState(firstPrice?.billingPeriodVal ?? "one_time")
  const [priceIsActive, setPriceIsActive] = useState(firstPrice?.isActive ?? true)
  const [error, setError] = useState("")
  const [isPending, startTransition] = useTransition()

  function handleNameEnChange(val: string) {
    setNameEn(val)
    if (!isEdit) {
      setSlug(toSlug(val))
    }
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError("")

    const formData = new FormData()
    formData.set("nameEn", nameEn)
    formData.set("nameEs", nameEs)
    formData.set("descriptionEn", descriptionEn)
    formData.set("descriptionEs", descriptionEs)
    formData.set("category", category)
    formData.set("slug", slug)
    formData.set("sortOrder", sortOrder)
    formData.set("priceNameEn", priceNameEn)
    formData.set("amount", amount)
    formData.set("billingPeriod", billingPeriod)
    if (priceIsActive) formData.set("priceIsActive", "on")
    if (isEdit && firstPrice?.id) {
      formData.set("priceId", firstPrice.id)
    }

    startTransition(async () => {
      const result = isEdit
        ? await updateServiceAction(service!.id, formData)
        : await createServiceAction(formData)

      if (result.error) {
        setError(result.error)
      } else {
        onSaved()
      }
    })
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="w-full max-w-2xl bg-[#14171A] border border-[#3D4A5C] rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="sticky top-0 flex items-center justify-between px-6 py-4 border-b border-[#3D4A5C] bg-[#14171A] z-10">
            <h2 className="text-lg font-semibold text-[#F7F7F3]">
              {isEdit ? "Editar servicio" : "Nuevo servicio"}
            </h2>
            <button
              type="button"
              onClick={onClose}
              className="text-[#546072] hover:text-[#F7F7F3] transition-colors"
              aria-label="Cerrar"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            {/* Names */}
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="nameEn" className="block text-xs text-[#8A9099] mb-1.5">
                  Nombre EN <span className="text-[#EF4444]">*</span>
                </label>
                <input
                  id="nameEn"
                  type="text"
                  value={nameEn}
                  onChange={(e) => handleNameEnChange(e.target.value)}
                  required
                  placeholder="e.g. Local SEO"
                  className="w-full bg-[#1C2026] border border-white/10 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF5A1F]/40 placeholder:text-[#546072]"
                />
              </div>
              <div>
                <label htmlFor="nameEs" className="block text-xs text-[#8A9099] mb-1.5">
                  Nombre ES <span className="text-[#EF4444]">*</span>
                </label>
                <input
                  id="nameEs"
                  type="text"
                  value={nameEs}
                  onChange={(e) => setNameEs(e.target.value)}
                  required
                  placeholder="e.g. SEO Local"
                  className="w-full bg-[#1C2026] border border-white/10 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF5A1F]/40 placeholder:text-[#546072]"
                />
              </div>
            </div>

            {/* Descriptions */}
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="descriptionEn" className="block text-xs text-[#8A9099] mb-1.5">
                  Descripción EN
                </label>
                <textarea
                  id="descriptionEn"
                  rows={3}
                  value={descriptionEn}
                  onChange={(e) => setDescriptionEn(e.target.value)}
                  placeholder="Service description in English…"
                  className="w-full bg-[#1C2026] border border-white/10 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF5A1F]/40 placeholder:text-[#546072] resize-none"
                />
              </div>
              <div>
                <label htmlFor="descriptionEs" className="block text-xs text-[#8A9099] mb-1.5">
                  Descripción ES
                </label>
                <textarea
                  id="descriptionEs"
                  rows={3}
                  value={descriptionEs}
                  onChange={(e) => setDescriptionEs(e.target.value)}
                  placeholder="Descripción del servicio en español…"
                  className="w-full bg-[#1C2026] border border-white/10 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF5A1F]/40 placeholder:text-[#546072] resize-none"
                />
              </div>
            </div>

            {/* Category + Slug + Sort */}
            <div className="grid sm:grid-cols-3 gap-4">
              <div>
                <label htmlFor="category" className="block text-xs text-[#8A9099] mb-1.5">
                  Categoría
                </label>
                <select
                  id="category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-[#1C2026] border border-white/10 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF5A1F]/40"
                >
                  <option value="seo">SEO</option>
                  <option value="paid-media">Paid Media</option>
                  <option value="automation">Automation</option>
                  <option value="support">Support</option>
                </select>
              </div>
              <div>
                <label htmlFor="slug" className="block text-xs text-[#8A9099] mb-1.5">
                  Slug <span className="text-[#EF4444]">*</span>
                </label>
                <input
                  id="slug"
                  type="text"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  required
                  placeholder="local-seo"
                  className="w-full bg-[#1C2026] border border-white/10 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF5A1F]/40 placeholder:text-[#546072]"
                />
              </div>
              <div>
                <label htmlFor="sortOrder" className="block text-xs text-[#8A9099] mb-1.5">
                  Orden
                </label>
                <input
                  id="sortOrder"
                  type="number"
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value)}
                  min={0}
                  className="w-full bg-[#1C2026] border border-white/10 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF5A1F]/40"
                />
              </div>
            </div>

            {/* Price section */}
            <div className="border border-[#3D4A5C] rounded-xl p-4 space-y-4">
              <p className="text-xs font-semibold text-[#8A9099] uppercase tracking-wider">
                Precio principal
              </p>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="priceNameEn" className="block text-xs text-[#8A9099] mb-1.5">
                    Nombre del precio (EN)
                  </label>
                  <input
                    id="priceNameEn"
                    type="text"
                    value={priceNameEn}
                    onChange={(e) => setPriceNameEn(e.target.value)}
                    placeholder="e.g. Starter"
                    className="w-full bg-[#1C2026] border border-white/10 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF5A1F]/40 placeholder:text-[#546072]"
                  />
                </div>
                <div>
                  <label htmlFor="amount" className="block text-xs text-[#8A9099] mb-1.5">
                    Precio (USD)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-[#546072]">$</span>
                    <input
                      id="amount"
                      type="number"
                      min={0}
                      step={0.01}
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="0.00"
                      className="w-full bg-[#1C2026] border border-white/10 text-white rounded-lg pl-7 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF5A1F]/40 placeholder:text-[#546072]"
                    />
                  </div>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4 items-end">
                <div>
                  <label htmlFor="billingPeriod" className="block text-xs text-[#8A9099] mb-1.5">
                    Período de facturación
                  </label>
                  <select
                    id="billingPeriod"
                    value={billingPeriod}
                    onChange={(e) => setBillingPeriod(e.target.value)}
                    className="w-full bg-[#1C2026] border border-white/10 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF5A1F]/40"
                  >
                    <option value="one_time">Pago único</option>
                    <option value="monthly">Mensual</option>
                    <option value="quarterly">Trimestral</option>
                    <option value="annual">Anual</option>
                  </select>
                </div>
                <div className="flex items-center gap-2 pb-0.5">
                  <input
                    id="priceIsActive"
                    type="checkbox"
                    checked={priceIsActive}
                    onChange={(e) => setPriceIsActive(e.target.checked)}
                    className="w-4 h-4 accent-[#FF5A1F]"
                  />
                  <label htmlFor="priceIsActive" className="text-sm text-[#8A9099]">
                    Precio activo
                  </label>
                </div>
              </div>
            </div>

            {/* Error */}
            {error && (
              <p className="text-sm text-[#EF4444] bg-[#EF4444]/10 border border-[#EF4444]/30 rounded-lg px-3 py-2">
                {error}
              </p>
            )}

            {/* Actions */}
            <div className="flex gap-3 pt-1">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2.5 border border-[#3D4A5C] text-[#8A9099] text-sm font-medium rounded-lg hover:border-[#546072] hover:text-[#F7F7F3] transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isPending}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-[#FF5A1F] text-white text-sm font-medium rounded-lg hover:bg-[#E54A15] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isPending ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Plus className="w-4 h-4" />
                )}
                {isPending ? "Guardando…" : isEdit ? "Guardar cambios" : "Crear servicio"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}

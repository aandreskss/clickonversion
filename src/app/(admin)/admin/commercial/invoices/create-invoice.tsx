"use client"

import { useState, useTransition } from "react"
import { Plus, Trash2, Loader2, ExternalLink, CheckCircle } from "lucide-react"
import { createPayPalInvoiceAction } from "./actions"

interface InvoiceItem {
  id: string
  name: string
  description: string
  quantity: number
  unitPrice: number
}

function generateId() {
  return Math.random().toString(36).slice(2, 9)
}

export function CreateInvoiceForm() {
  const [clientEmail, setClientEmail] = useState("")
  const [clientName, setClientName] = useState("")
  const [items, setItems] = useState<InvoiceItem[]>([
    { id: generateId(), name: "", description: "", quantity: 1, unitPrice: 0 },
  ])
  const [dueDate, setDueDate] = useState("")
  const [notes, setNotes] = useState("")
  const [currency] = useState("USD")
  const [error, setError] = useState("")
  const [result, setResult] = useState<{ invoiceId?: string; invoiceUrl?: string } | null>(null)
  const [isPending, startTransition] = useTransition()

  function addItem() {
    setItems((prev) => [
      ...prev,
      { id: generateId(), name: "", description: "", quantity: 1, unitPrice: 0 },
    ])
  }

  function removeItem(id: string) {
    setItems((prev) => prev.filter((item) => item.id !== id))
  }

  function updateItem(id: string, field: keyof Omit<InvoiceItem, "id">, value: string | number) {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    )
  }

  const total = items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    setResult(null)

    if (!dueDate) {
      setError("La fecha de vencimiento es requerida.")
      return
    }

    const validItems = items.filter((i) => i.name.trim())
    if (!validItems.length) {
      setError("Agrega al menos un item con nombre.")
      return
    }

    startTransition(async () => {
      const res = await createPayPalInvoiceAction({
        clientEmail,
        clientName,
        items: validItems.map((i) => ({
          name: i.name.trim(),
          description: i.description.trim(),
          quantity: i.quantity,
          unitPrice: i.unitPrice,
        })),
        dueDate,
        notes,
        currency,
      })

      if (res.error && !res.invoiceId) {
        setError(res.error)
      } else {
        setResult({ invoiceId: res.invoiceId, invoiceUrl: res.invoiceUrl })
        if (res.error) {
          setError(res.error) // partial error (created but not sent)
        }
      }
    })
  }

  if (result?.invoiceId) {
    return (
      <div className="bg-[#14171A] border border-[#3D4A5C] rounded-xl p-8 text-center space-y-4">
        <CheckCircle className="w-12 h-12 text-[#22C55E] mx-auto" />
        <div>
          <h3 className="text-lg font-semibold text-[#F7F7F3] mb-1">Factura creada</h3>
          <p className="text-sm text-[#8A9099]">ID: {result.invoiceId}</p>
          {error && (
            <p className="text-sm text-[#F59E0B] mt-2">{error}</p>
          )}
        </div>
        {result.invoiceUrl && (
          <a
            href={result.invoiceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#FF5A1F] text-white text-sm font-medium rounded-lg hover:bg-[#E54A15] transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
            Ver factura en PayPal
          </a>
        )}
        <div>
          <button
            type="button"
            onClick={() => {
              setResult(null)
              setError("")
              setClientEmail("")
              setClientName("")
              setDueDate("")
              setNotes("")
              setItems([{ id: generateId(), name: "", description: "", quantity: 1, unitPrice: 0 }])
            }}
            className="text-sm text-[#8A9099] hover:text-[#F7F7F3] transition-colors"
          >
            Crear otra factura
          </button>
        </div>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Client info */}
      <div className="bg-[#14171A] border border-[#3D4A5C] rounded-xl p-6 space-y-4">
        <h3 className="text-sm font-semibold text-[#F7F7F3]">Datos del cliente</h3>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="invoiceClientEmail" className="block text-xs text-[#8A9099] mb-1.5">
              Email del cliente <span className="text-[#EF4444]">*</span>
            </label>
            <input
              id="invoiceClientEmail"
              type="email"
              value={clientEmail}
              onChange={(e) => setClientEmail(e.target.value)}
              required
              placeholder="cliente@empresa.com"
              className="w-full bg-[#1C2026] border border-white/10 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF5A1F]/40 placeholder:text-[#546072]"
            />
          </div>
          <div>
            <label htmlFor="invoiceClientName" className="block text-xs text-[#8A9099] mb-1.5">
              Nombre del cliente <span className="text-[#EF4444]">*</span>
            </label>
            <input
              id="invoiceClientName"
              type="text"
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              required
              placeholder="Juan García"
              className="w-full bg-[#1C2026] border border-white/10 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF5A1F]/40 placeholder:text-[#546072]"
            />
          </div>
        </div>
      </div>

      {/* Items */}
      <div className="bg-[#14171A] border border-[#3D4A5C] rounded-xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-[#F7F7F3]">Items de la factura</h3>
          <button
            type="button"
            onClick={addItem}
            className="flex items-center gap-1.5 text-xs text-[#FF5A1F] hover:text-[#E54A15] transition-colors font-medium"
          >
            <Plus className="w-3.5 h-3.5" />
            Agregar item
          </button>
        </div>

        {/* Header row */}
        <div className="hidden sm:grid grid-cols-[2fr_2fr_1fr_1fr_auto] gap-2 text-xs text-[#546072] font-medium pb-1 border-b border-[#3D4A5C]">
          <span>Servicio / Descripción</span>
          <span>Notas</span>
          <span>Cantidad</span>
          <span>Precio unitario (USD)</span>
          <span />
        </div>

        {items.map((item) => (
          <div key={item.id} className="grid sm:grid-cols-[2fr_2fr_1fr_1fr_auto] gap-2 items-start">
            <input
              type="text"
              value={item.name}
              onChange={(e) => updateItem(item.id, "name", e.target.value)}
              placeholder="Nombre del servicio"
              className="bg-[#1C2026] border border-white/10 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF5A1F]/40 placeholder:text-[#546072]"
            />
            <input
              type="text"
              value={item.description}
              onChange={(e) => updateItem(item.id, "description", e.target.value)}
              placeholder="Descripción opcional"
              className="bg-[#1C2026] border border-white/10 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF5A1F]/40 placeholder:text-[#546072]"
            />
            <input
              type="number"
              min={1}
              value={item.quantity}
              onChange={(e) => updateItem(item.id, "quantity", parseInt(e.target.value, 10) || 1)}
              className="bg-[#1C2026] border border-white/10 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF5A1F]/40"
            />
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-[#546072]">$</span>
              <input
                type="number"
                min={0}
                step={0.01}
                value={item.unitPrice}
                onChange={(e) => updateItem(item.id, "unitPrice", parseFloat(e.target.value) || 0)}
                className="w-full bg-[#1C2026] border border-white/10 text-white rounded-lg pl-7 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF5A1F]/40"
              />
            </div>
            {items.length > 1 && (
              <button
                type="button"
                onClick={() => removeItem(item.id)}
                className="flex items-center justify-center p-2 text-[#546072] hover:text-[#EF4444] transition-colors"
                aria-label="Eliminar item"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        ))}

        {/* Total */}
        <div className="flex justify-end pt-2 border-t border-[#3D4A5C]">
          <div className="text-right">
            <p className="text-xs text-[#8A9099]">Total</p>
            <p className="text-lg font-semibold text-[#F7F7F3]">
              ${total.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} {currency}
            </p>
          </div>
        </div>
      </div>

      {/* Dates and notes */}
      <div className="bg-[#14171A] border border-[#3D4A5C] rounded-xl p-6 space-y-4">
        <h3 className="text-sm font-semibold text-[#F7F7F3]">Detalles adicionales</h3>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="dueDate" className="block text-xs text-[#8A9099] mb-1.5">
              Fecha de vencimiento <span className="text-[#EF4444]">*</span>
            </label>
            <input
              id="dueDate"
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              required
              className="w-full bg-[#1C2026] border border-white/10 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF5A1F]/40"
            />
          </div>
          <div>
            <label className="block text-xs text-[#8A9099] mb-1.5">Moneda</label>
            <div className="flex items-center h-[38px] px-3 bg-[#1C2026] border border-white/10 rounded-lg">
              <span className="text-sm text-[#8A9099]">USD — Dólar estadounidense</span>
            </div>
          </div>
        </div>
        <div>
          <label htmlFor="invoiceNotes" className="block text-xs text-[#8A9099] mb-1.5">
            Notas para el cliente
          </label>
          <textarea
            id="invoiceNotes"
            rows={3}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Condiciones de pago, instrucciones adicionales…"
            className="w-full bg-[#1C2026] border border-white/10 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF5A1F]/40 placeholder:text-[#546072] resize-none"
          />
        </div>
      </div>

      {error && (
        <p className="text-sm text-[#EF4444] bg-[#EF4444]/10 border border-[#EF4444]/30 rounded-lg px-4 py-3">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-[#FF5A1F] text-white text-sm font-semibold rounded-xl hover:bg-[#E54A15] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {isPending ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : (
          <ExternalLink className="w-5 h-5" />
        )}
        {isPending ? "Generando factura PayPal…" : "Generar factura PayPal y enviar al cliente"}
      </button>
    </form>
  )
}

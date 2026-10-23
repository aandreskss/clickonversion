"use client"

import { useEffect, useRef } from "react"
import Link from "next/link"
import { X, ShoppingCart, Trash2, ArrowRight, MessageSquare } from "lucide-react"
import { useCart } from "./cart-provider"
import { splitCartItems } from "@/lib/orders/splits"
import type { CartItem } from "@/types/catalog"

interface CartDrawerProps {
  open: boolean
  onClose(): void
}

export function CartDrawer({ open, onClose }: CartDrawerProps) {
  const { items, removeItem, count } = useCart()
  const drawerRef = useRef<HTMLDivElement>(null)
  const split = splitCartItems(items)

  const oneTimeTotal   = split.oneTimeItems.reduce((s, i) => s + i.displayPrice * i.quantity, 0)
  const recurringTotal = split.recurringItems.reduce((s, i) => s + i.displayPrice * i.quantity, 0)
  const todayTotal     = oneTimeTotal + recurringTotal

  // Close on Escape
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose()
    }
    document.addEventListener("keydown", onKey)
    return () => document.removeEventListener("keydown", onKey)
  }, [onClose])

  // Trap body scroll when open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : ""
    return () => { document.body.style.overflow = "" }
  }, [open])

  return (
    <>
      {/* Backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Drawer */}
      <div
        ref={drawerRef}
        role="dialog"
        aria-modal="true"
        aria-label="Shopping cart"
        className={`fixed top-0 right-0 h-full w-full max-w-md z-50 flex flex-col transition-transform duration-300 ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
        style={{ background: "#0D1420", borderLeft: "1px solid rgba(255,255,255,0.06)" }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/[0.06]">
          <div className="flex items-center gap-2">
            <ShoppingCart size={18} className="text-[#78E6B3]" />
            <span className="font-display font-bold text-white">
              Cart
              {count > 0 && (
                <span className="ml-2 text-xs bg-[#FF5A1F] text-white rounded-full px-1.5 py-0.5">
                  {count}
                </span>
              )}
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close cart"
            className="w-8 h-8 flex items-center justify-center rounded-lg text-[#4E5D6E] hover:text-white hover:bg-white/5 transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
              <ShoppingCart size={32} className="text-[#4E5D6E]" />
              <p className="text-sm text-[#4E5D6E]">Your cart is empty.</p>
              <Link
                href="/services"
                onClick={onClose}
                className="text-sm text-[#78E6B3] font-semibold hover:underline"
              >
                Browse services
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {/* One-time items */}
              {split.oneTimeItems.length > 0 && (
                <ItemGroup label="One-time" items={split.oneTimeItems} onRemove={removeItem} />
              )}

              {/* Recurring items */}
              {split.recurringItems.length > 0 && (
                <ItemGroup label="Monthly" items={split.recurringItems} onRemove={removeItem} />
              )}

              {/* Quote items */}
              {split.quoteItems.length > 0 && (
                <div className="mt-4">
                  <p className="text-xs font-semibold text-[#FFCB86] uppercase tracking-widest mb-2">
                    Quote required
                  </p>
                  {split.quoteItems.map((item) => (
                    <QuoteItem key={item.key} item={item} onRemove={removeItem} />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-white/[0.06] px-6 py-5 space-y-4">
            {/* Totals */}
            <div className="space-y-1.5">
              {oneTimeTotal > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-[#7A8799]">One-time today</span>
                  <span className="text-white font-semibold">${oneTimeTotal.toFixed(2)}</span>
                </div>
              )}
              {recurringTotal > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-[#7A8799]">Monthly (first payment)</span>
                  <span className="text-white font-semibold">${recurringTotal.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-sm font-bold pt-1 border-t border-white/[0.06]">
                <span className="text-white">Total today</span>
                <span className="text-[#78E6B3]">${todayTotal.toFixed(2)}</span>
              </div>
              {recurringTotal > 0 && (
                <p className="text-xs text-[#4E5D6E]">
                  Then ${recurringTotal.toFixed(2)}/mo from next billing date
                </p>
              )}
              {split.quoteItems.length > 0 && (
                <div className="flex items-start gap-2 text-xs text-[#FFCB86] bg-[#FFCB86]/10 rounded-lg p-2.5 mt-2">
                  <MessageSquare size={12} className="flex-shrink-0 mt-0.5" />
                  {split.quoteItems.length} service{split.quoteItems.length > 1 ? "s" : ""} will go to a quote — no charge now.
                </div>
              )}
            </div>

            <Link
              href="/checkout"
              onClick={onClose}
              className="flex w-full items-center justify-center gap-2 py-3.5 bg-[#FF5A1F] text-white font-semibold rounded-xl hover:bg-[#E54A15] transition-colors shadow-lg shadow-[#FF5A1F]/20 text-sm"
            >
              Proceed to Checkout
              <ArrowRight size={15} />
            </Link>
          </div>
        )}
      </div>
    </>
  )
}

function ItemGroup({
  label,
  items,
  onRemove,
}: {
  label: string
  items: CartItem[]
  onRemove(key: string): void
}) {
  return (
    <div>
      <p className="text-xs font-semibold text-[#4E5D6E] uppercase tracking-widest mb-2">{label}</p>
      <div className="space-y-2">
        {items.map((item) => (
          <div
            key={item.key}
            className="flex items-start justify-between gap-3 px-4 py-3 rounded-xl bg-white/[0.03] border border-white/[0.05]"
          >
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">{item.displayName}</p>
              <p className="text-xs text-[#4E5D6E] mt-0.5">
                ${item.displayPrice.toFixed(2)}
                {item.billingPeriod === "monthly" ? "/mo" : ""}
                {item.quantity > 1 ? ` × ${item.quantity}` : ""}
              </p>
            </div>
            <button
              type="button"
              onClick={() => onRemove(item.key)}
              aria-label={`Remove ${item.displayName}`}
              className="flex-shrink-0 w-7 h-7 flex items-center justify-center rounded-lg text-[#4E5D6E] hover:text-red-400 hover:bg-red-400/10 transition-colors"
            >
              <Trash2 size={13} />
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

function QuoteItem({
  item,
  onRemove,
}: {
  item: CartItem
  onRemove(key: string): void
}) {
  return (
    <div className="flex items-start justify-between gap-3 px-4 py-3 rounded-xl bg-[#FFCB86]/[0.05] border border-[#FFCB86]/20 mb-2">
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-white truncate">{item.displayName}</p>
        <p className="text-xs text-[#FFCB86] mt-0.5">Starting at ${item.displayPrice}</p>
      </div>
      <button
        type="button"
        onClick={() => onRemove(item.key)}
        aria-label={`Remove ${item.displayName}`}
        className="flex-shrink-0 w-7 h-7 flex items-center justify-center rounded-lg text-[#4E5D6E] hover:text-red-400 hover:bg-red-400/10 transition-colors"
      >
        <Trash2 size={13} />
      </button>
    </div>
  )
}

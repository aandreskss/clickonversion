"use client"

import { useState } from "react"
import { ShoppingCart, Check } from "lucide-react"
import { useCart } from "./cart-provider"
import type { CartItem, PriceType, BillingPeriod } from "@/types/catalog"

interface AddToCartProps {
  serviceId: string
  priceId: string
  displayName: string
  displayPrice: number
  priceType: PriceType
  billingPeriod: BillingPeriod | null
  /** Optional label override */
  label?: string
  /** Visual variant */
  variant?: "primary" | "outline"
  className?: string
}

export function AddToCart({
  serviceId,
  priceId,
  displayName,
  displayPrice,
  priceType,
  billingPeriod,
  label,
  variant = "primary",
  className = "",
}: AddToCartProps) {
  const { addItem, hasItem } = useCart()
  const key = `${serviceId}:${priceId}`
  const inCart = hasItem(key)
  const [added, setAdded] = useState(false)

  function handleClick() {
    if (priceType === "CUSTOM_QUOTE" || priceType === "STARTING_AT") return

    const item: CartItem = {
      key,
      serviceId,
      priceId,
      quantity: 1,
      displayName,
      displayPrice,
      priceType,
      billingPeriod,
      currency: "USD",
    }
    addItem(item)
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  const isQuote = priceType === "CUSTOM_QUOTE" || priceType === "STARTING_AT"

  if (isQuote) {
    return (
      <a
        href="/audit"
        className={`inline-flex items-center gap-2 px-6 py-3 font-semibold rounded-xl transition-colors text-sm ${
          variant === "primary"
            ? "bg-[#FF5A1F] text-white hover:bg-[#E54A15]"
            : "border border-[#FF5A1F]/40 text-[#FF5A1F] hover:bg-[#FF5A1F]/10"
        } ${className}`}
      >
        {label ?? "Request Quote"}
      </a>
    )
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`inline-flex items-center gap-2 px-6 py-3 font-semibold rounded-xl transition-all text-sm cursor-pointer ${
        inCart || added
          ? "bg-[#78E6B3]/20 text-[#78E6B3] border border-[#78E6B3]/30"
          : variant === "primary"
          ? "bg-[#FF5A1F] text-white hover:bg-[#E54A15] shadow-lg shadow-[#FF5A1F]/20"
          : "border border-[#FF5A1F]/40 text-[#FF5A1F] hover:bg-[#FF5A1F]/10"
      } ${className}`}
    >
      {added ? (
        <>
          <Check size={15} />
          Added
        </>
      ) : inCart ? (
        <>
          <Check size={15} />
          {label ?? "In Cart"}
        </>
      ) : (
        <>
          <ShoppingCart size={15} />
          {label ?? "Add to Cart"}
        </>
      )}
    </button>
  )
}

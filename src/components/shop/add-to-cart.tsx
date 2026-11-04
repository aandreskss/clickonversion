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
            ? "bg-[#FE5C02] text-white hover:bg-[#C94400]"
            : "border border-[#FE5C02]/40 text-[#FE5C02] hover:bg-[#FE5C02]/10"
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
          ? "bg-[#FE5C02] text-white hover:bg-[#C94400] shadow-lg shadow-[#FE5C02]/20"
          : "border border-[#FE5C02]/40 text-[#FE5C02] hover:bg-[#FE5C02]/10"
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

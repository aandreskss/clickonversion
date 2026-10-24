"use client"

import { useEffect } from "react"
import { useCart } from "@/components/shop/cart-provider"

/**
 * Tiny client component that clears the cart once after a successful
 * PayPal redirect. Mounted inside the Server Component success page.
 */
export function CartCleaner() {
  const { clearCart } = useCart()

  useEffect(() => {
    clearCart()
  }, [clearCart])

  return null
}

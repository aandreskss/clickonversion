"use client"

import React, { createContext, useContext, useEffect, useState, useCallback } from "react"
import type { CartItem, CartState } from "@/types/catalog"

const CART_KEY = "ck_cart_v1"

interface CartContextValue {
  items: CartState
  count: number
  addItem(item: CartItem): void
  removeItem(key: string): void
  updateQuantity(key: string, quantity: number): void
  clearCart(): void
  hasItem(key: string): boolean
}

const CartContext = createContext<CartContextValue | null>(null)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartState>([])
  const [hydrated, setHydrated] = useState(false)

  // Hydrate from localStorage on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem(CART_KEY)
      if (raw) setItems(JSON.parse(raw) as CartState)
    } catch {
      // corrupted storage — start fresh
    }
    setHydrated(true)
  }, [])

  // Persist on change (skip initial render before hydration)
  useEffect(() => {
    if (!hydrated) return
    try {
      localStorage.setItem(CART_KEY, JSON.stringify(items))
    } catch {
      // storage quota exceeded — ignore
    }
  }, [items, hydrated])

  const addItem = useCallback((item: CartItem) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.key === item.key)
      if (existing) {
        return prev.map((i) =>
          i.key === item.key ? { ...i, quantity: i.quantity + item.quantity } : i
        )
      }
      return [...prev, item]
    })
  }, [])

  const removeItem = useCallback((key: string) => {
    setItems((prev) => prev.filter((i) => i.key !== key))
  }, [])

  const updateQuantity = useCallback((key: string, quantity: number) => {
    if (quantity <= 0) {
      setItems((prev) => prev.filter((i) => i.key !== key))
      return
    }
    setItems((prev) =>
      prev.map((i) => (i.key === key ? { ...i, quantity } : i))
    )
  }, [])

  const clearCart = useCallback(() => setItems([]), [])

  const hasItem = useCallback((key: string) => items.some((i) => i.key === key), [items])

  return (
    <CartContext.Provider
      value={{
        items,
        count: items.reduce((sum, i) => sum + i.quantity, 0),
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        hasItem,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error("useCart must be used inside <CartProvider>")
  return ctx
}

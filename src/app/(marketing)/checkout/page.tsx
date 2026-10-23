"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, CreditCard, Lock, AlertCircle, MessageSquare } from "lucide-react"
import { MarketingLayout } from "@/components/marketing/marketing-layout"
import { useCart } from "@/components/shop/cart-provider"
import { splitCartItems } from "@/lib/orders/splits"

type Provider = "stripe" | "paypal"

const formatPrice = (n: number) => `$${n.toFixed(2)}`

export default function CheckoutPage() {
  const router = useRouter()
  const { items, clearCart } = useCart()
  const split = splitCartItems(items)

  const oneTimeTotal   = split.oneTimeItems.reduce((s, i) => s + i.displayPrice * i.quantity, 0)
  const recurringTotal = split.recurringItems.reduce((s, i) => s + i.displayPrice * i.quantity, 0)
  const todayTotal     = oneTimeTotal + recurringTotal

  const [provider, setProvider] = useState<Provider>("paypal")
  const [email,    setEmail]    = useState("")
  const [name,     setName]     = useState("")
  const [company,  setCompany]  = useState("")
  const [error,    setError]    = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  const isMixed = split.oneTimeItems.length > 0 && split.recurringItems.length > 0
  const paypalBlocked = provider === "paypal" && (
    isMixed || split.recurringItems.length > 1
  )

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    if (items.length === 0) {
      setError("Your cart is empty.")
      return
    }

    startTransition(async () => {
      try {
        const res = await fetch("/api/payments/checkout", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            clientEmail:   email,
            clientName:    name,
            clientCompany: company || undefined,
            provider,
            items: items.map((i) => ({
              serviceId: i.serviceId,
              priceId:   i.priceId,
              quantity:  i.quantity,
            })),
          }),
        })

        const data = await res.json() as {
          checkoutUrl?: string
          quoteCreated?: boolean
          orderId?: string
          error?: string
        }

        if (!res.ok) {
          setError(data.error ?? "Checkout failed. Please try again.")
          return
        }

        clearCart()

        if (data.checkoutUrl) {
          window.location.href = data.checkoutUrl
        } else if (data.quoteCreated) {
          router.push(`/checkout/success?quote=true&orderId=${data.orderId}`)
        }
      } catch {
        setError("Network error. Please check your connection and try again.")
      }
    })
  }

  if (items.length === 0) {
    return (
      <MarketingLayout>
        <div className="min-h-screen bg-[#101827] flex items-center justify-center">
          <div className="text-center space-y-4">
            <p className="text-[#7A8799]">Your cart is empty.</p>
            <Link href="/services" className="text-[#78E6B3] font-semibold hover:underline">
              Browse services →
            </Link>
          </div>
        </div>
      </MarketingLayout>
    )
  }

  return (
    <MarketingLayout>
      <div className="min-h-screen bg-[#101827] py-24">
        <div className="container-wide max-w-5xl">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-sm text-[#4E5D6E] hover:text-white mb-8 transition-colors"
          >
            <ArrowLeft size={14} />
            Back
          </Link>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Left: Form */}
            <div>
              <h1 className="font-display text-2xl font-bold text-white mb-8">Checkout</h1>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Contact */}
                <div className="space-y-4">
                  <h2 className="text-xs font-semibold text-[#4E5D6E] uppercase tracking-widest">
                    Contact information
                  </h2>

                  <div>
                    <label htmlFor="email" className="block text-sm text-[#A8B3C0] mb-1.5">
                      Email *
                    </label>
                    <input
                      id="email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@company.com"
                      className="w-full px-4 py-3 bg-white/[0.04] border border-white/[0.08] rounded-xl text-white text-sm placeholder-[#4E5D6E] focus:outline-none focus:border-[#78E6B3]/40 focus:bg-white/[0.06] transition-colors"
                    />
                  </div>

                  <div>
                    <label htmlFor="name" className="block text-sm text-[#A8B3C0] mb-1.5">
                      Full name *
                    </label>
                    <input
                      id="name"
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Jane Smith"
                      className="w-full px-4 py-3 bg-white/[0.04] border border-white/[0.08] rounded-xl text-white text-sm placeholder-[#4E5D6E] focus:outline-none focus:border-[#78E6B3]/40 focus:bg-white/[0.06] transition-colors"
                    />
                  </div>

                  <div>
                    <label htmlFor="company" className="block text-sm text-[#A8B3C0] mb-1.5">
                      Company <span className="text-[#4E5D6E]">(optional)</span>
                    </label>
                    <input
                      id="company"
                      type="text"
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      placeholder="Acme Inc."
                      className="w-full px-4 py-3 bg-white/[0.04] border border-white/[0.08] rounded-xl text-white text-sm placeholder-[#4E5D6E] focus:outline-none focus:border-[#78E6B3]/40 focus:bg-white/[0.06] transition-colors"
                    />
                  </div>
                </div>

                {/* Payment provider */}
                <div className="space-y-3">
                  <h2 className="text-xs font-semibold text-[#4E5D6E] uppercase tracking-widest">
                    Payment method
                  </h2>

                  <div className="grid grid-cols-2 gap-3">
                    {(["paypal", "stripe"] as Provider[]).map((p) => (
                      <button
                        key={p}
                        type="button"
                        onClick={() => setProvider(p)}
                        className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl border text-sm font-medium transition-all ${
                          provider === p
                            ? "border-[#78E6B3]/40 bg-[#78E6B3]/10 text-white"
                            : "border-white/[0.08] text-[#7A8799] hover:border-white/20"
                        }`}
                      >
                        <CreditCard size={14} />
                        {p === "paypal" ? "PayPal" : "Card (Stripe)"}
                      </button>
                    ))}
                  </div>

                  {paypalBlocked && (
                    <div className="flex items-start gap-2 text-xs text-[#FFCB86] bg-[#FFCB86]/10 rounded-lg p-3">
                      <AlertCircle size={12} className="flex-shrink-0 mt-0.5" />
                      PayPal doesn&apos;t support mixed or multiple subscriptions in one checkout.
                      Please use Stripe, or reduce to a single subscription service.
                    </div>
                  )}
                </div>

                {/* Error */}
                {error && (
                  <div className="flex items-start gap-2 text-sm text-red-400 bg-red-400/10 rounded-xl p-4">
                    <AlertCircle size={14} className="flex-shrink-0 mt-0.5" />
                    {error}
                  </div>
                )}

                {/* Quote notice */}
                {split.quoteItems.length > 0 && (
                  <div className="flex items-start gap-2 text-xs text-[#FFCB86] bg-[#FFCB86]/10 rounded-lg p-3">
                    <MessageSquare size={12} className="flex-shrink-0 mt-0.5" />
                    {split.quoteItems.length} service{split.quoteItems.length > 1 ? "s" : ""} require a custom quote.
                    They will be submitted separately — no charge now.
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isPending || paypalBlocked}
                  className="w-full flex items-center justify-center gap-2 py-4 bg-[#FF5A1F] text-white font-semibold rounded-xl hover:bg-[#E54A15] disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-lg shadow-[#FF5A1F]/20"
                >
                  <Lock size={14} />
                  {isPending
                    ? "Redirecting…"
                    : todayTotal > 0
                    ? `Pay ${formatPrice(todayTotal)} securely`
                    : "Submit quote request"}
                </button>

                <p className="text-center text-xs text-[#4E5D6E]">
                  Secured by {provider === "paypal" ? "PayPal" : "Stripe"} · 256-bit TLS
                </p>
              </form>
            </div>

            {/* Right: Order summary */}
            <div>
              <h2 className="text-xs font-semibold text-[#4E5D6E] uppercase tracking-widest mb-4">
                Order summary
              </h2>

              <div className="card-midnight rounded-2xl p-6 space-y-4">
                {/* Items */}
                <div className="space-y-3">
                  {items.map((item) => (
                    <div key={item.key} className="flex justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-white truncate">{item.displayName}</p>
                        <p className="text-xs text-[#4E5D6E]">
                          {item.priceType === "RECURRING" ? "Monthly" : item.priceType === "STARTING_AT" ? "Starting at" : "One-time"}
                          {item.quantity > 1 ? ` × ${item.quantity}` : ""}
                        </p>
                      </div>
                      <span className="text-sm font-medium text-white flex-shrink-0">
                        {item.priceType === "CUSTOM_QUOTE" || item.priceType === "STARTING_AT"
                          ? "Quote"
                          : formatPrice(item.displayPrice * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="border-t border-white/[0.06] pt-4 space-y-2">
                  {oneTimeTotal > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-[#7A8799]">One-time charges</span>
                      <span className="text-white">{formatPrice(oneTimeTotal)}</span>
                    </div>
                  )}
                  {recurringTotal > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-[#7A8799]">Monthly (first invoice)</span>
                      <span className="text-white">{formatPrice(recurringTotal)}</span>
                    </div>
                  )}
                  {split.quoteItems.length > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-[#FFCB86]">Quote request</span>
                      <span className="text-[#FFCB86]">No charge</span>
                    </div>
                  )}
                  <div className="flex justify-between font-bold text-sm border-t border-white/[0.06] pt-2">
                    <span className="text-white">Total today</span>
                    <span className="text-[#78E6B3]">{formatPrice(todayTotal)}</span>
                  </div>
                  {recurringTotal > 0 && (
                    <p className="text-xs text-[#4E5D6E] pt-1">
                      After today: {formatPrice(recurringTotal)}/month, billed on the same date each month.
                    </p>
                  )}
                </div>

                <div className="bg-white/[0.02] rounded-xl p-3 space-y-1">
                  <p className="text-xs text-[#4E5D6E]">
                    ✓ Cancel anytime · No hidden fees
                  </p>
                  <p className="text-xs text-[#4E5D6E]">
                    ✓ Prices are in USD · Tax may apply in some jurisdictions
                  </p>
                  <p className="text-xs text-[#4E5D6E]">
                    ✓ Ad spend is billed separately by Google/Meta/TikTok
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MarketingLayout>
  )
}

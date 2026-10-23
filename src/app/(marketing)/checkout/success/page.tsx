"use client"

import { useEffect, useState, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { CheckCircle, Clock, ArrowRight } from "lucide-react"
import { MarketingLayout } from "@/components/marketing/marketing-layout"

interface OrderStatus {
  orderNumber: string
  status:      string
  totalUsd:    number
}

function SuccessContent() {
  const params   = useSearchParams()
  const orderId  = params.get("orderId")
  const isQuote  = params.get("quote") === "true"
  const sessionId = params.get("session_id")  // Stripe
  const ppOrderId = params.get("paypal_order_id") // PayPal
  const ppSubId   = params.get("subscription_id")  // PayPal subscription

  const [order, setOrder]     = useState<OrderStatus | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!orderId) { setLoading(false); return }

    // For PayPal one-time orders, capture first
    const capture = async () => {
      if (ppOrderId && ppOrderId !== "PAYPAL_ORDER_ID") {
        await fetch("/api/payments/paypal/capture", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ paypalOrderId: ppOrderId, orderId }),
        })
      }
    }

    capture()
      .then(() => fetch(`/api/payments/status/${orderId}`))
      .then((r) => r.json())
      .then((data: { orderNumber: string; status: string; totalUsd: number }) => {
        setOrder(data)
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [orderId, ppOrderId])

  const isPaid = order?.status === "paid" || !!sessionId || !!ppSubId

  return (
    <div className="min-h-screen bg-[#101827] flex items-center justify-center py-24">
      <div className="container-wide max-w-lg text-center">
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6"
          style={{ background: isQuote ? "rgba(255,203,134,0.15)" : "rgba(120,230,179,0.15)" }}
        >
          {isQuote
            ? <Clock size={28} className="text-[#FFCB86]" />
            : <CheckCircle size={28} className="text-[#78E6B3]" />
          }
        </div>

        <h1 className="font-display text-3xl font-extrabold text-white mb-3">
          {isQuote
            ? "Quote submitted!"
            : isPaid || loading
            ? "Payment received!"
            : "Almost there…"}
        </h1>

        <p className="text-[#7A8799] mb-8">
          {isQuote
            ? "We've received your request. You'll receive a custom proposal at your email within 24 hours."
            : isPaid
            ? "Your payment has been confirmed. Check your email for a receipt and next steps."
            : "Your payment is being confirmed. This may take a moment — you'll receive a confirmation email shortly."}
        </p>

        {order && (
          <div className="card-midnight rounded-2xl p-5 text-left mb-8">
            <div className="flex justify-between text-sm">
              <span className="text-[#7A8799]">Order</span>
              <span className="text-white font-medium">{order.orderNumber}</span>
            </div>
            {order.totalUsd > 0 && (
              <div className="flex justify-between text-sm mt-2">
                <span className="text-[#7A8799]">Total charged today</span>
                <span className="text-[#78E6B3] font-semibold">${order.totalUsd}</span>
              </div>
            )}
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          {orderId && isPaid && (
            <Link
              href={`/onboarding/${orderId}`}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#FF5A1F] text-white font-semibold rounded-xl hover:bg-[#E54A15] transition-colors text-sm"
            >
              Complete onboarding
              <ArrowRight size={14} />
            </Link>
          )}
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 text-[#A8B3C0] font-semibold rounded-xl border border-white/10 hover:text-white hover:border-white/20 hover:bg-white/5 transition-colors text-sm"
          >
            Back to home
          </Link>
        </div>
      </div>
    </div>
  )
}

export default function CheckoutSuccessPage() {
  return (
    <MarketingLayout>
      <Suspense fallback={
        <div className="min-h-screen bg-[#101827] flex items-center justify-center">
          <div className="text-[#4E5D6E]">Loading…</div>
        </div>
      }>
        <SuccessContent />
      </Suspense>
    </MarketingLayout>
  )
}

import Link from "next/link"
import { Check, AlertTriangle } from "lucide-react"
import { LogoWordmark } from "@/components/ui/logo-wordmark"
import { capturePayPalOrderAction } from "../actions"
import { CartCleaner } from "./cart-cleaner"

// ── Header ───────────────────────────────────────────────────────────────────

function CheckoutHeader() {
  return (
    <header
      style={{
        background: "#fff",
        borderBottom: "1px solid #E2DED3",
      }}
    >
      <div
        style={{
          maxWidth: 1120,
          margin: "0 auto",
          padding: "16px 24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <LogoWordmark size="sm" />
        <span
          style={{
            fontFamily: "var(--font-mk-mono, 'JetBrains Mono', monospace)",
            fontSize: 12,
            color: "#5F6168",
            display: "flex",
            alignItems: "center",
            gap: 6,
          }}
        >
          <span
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: "#22C55E",
              display: "inline-block",
            }}
          />
          Pago seguro · cifrado SSL
        </span>
      </div>
    </header>
  )
}

// ── Page ─────────────────────────────────────────────────────────────────────

interface SuccessPageProps {
  searchParams: Promise<{
    token?: string      // PayPal order ID
    PayerID?: string    // PayPal payer ID
  }>
}

export default async function CheckoutSuccessPage({ searchParams }: SuccessPageProps) {
  const params = await searchParams
  const token = params.token
  const PayerID = params.PayerID

  let captureError: string | undefined
  let payerEmail: string | undefined
  let totalAmount: string | undefined
  let orderId: string | undefined

  // Only attempt capture when PayPal redirects with both params
  if (token && PayerID) {
    const result = await capturePayPalOrderAction(token)

    if (result.error && !result.success) {
      captureError = result.error
    } else {
      payerEmail = result.payerEmail
      totalAmount = result.totalAmount
      orderId = result.orderId
    }
  }

  const isError = !!captureError

  return (
    <div style={{ minHeight: "100dvh", background: "var(--color-cream, #F7F5EF)" }}>
      <CheckoutHeader />

      {/* Clear cart client-side after successful redirect */}
      {!isError && <CartCleaner />}

      <main
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "calc(100dvh - 57px)",
          padding: "48px 24px",
        }}
      >
        <div
          style={{
            background: "#fff",
            border: "1px solid #E2DED3",
            borderRadius: 20,
            padding: "40px 32px",
            maxWidth: 480,
            width: "100%",
            textAlign: "center",
          }}
        >
          {isError ? (
            <>
              {/* Error state */}
              <div
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: "50%",
                  background: "rgba(245,158,11,0.12)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 20px",
                }}
              >
                <AlertTriangle size={24} color="#F59E0B" />
              </div>

              <h1
                style={{
                  fontFamily: "var(--font-mk-sans)",
                  fontSize: 24,
                  fontWeight: 700,
                  color: "var(--color-ink, #202124)",
                  margin: "0 0 8px",
                }}
              >
                Algo salió mal
              </h1>
              <p
                style={{
                  fontFamily: "var(--font-mk-sans)",
                  fontSize: 14,
                  color: "var(--color-muted-ink, #5F6168)",
                  margin: "0 0 24px",
                  lineHeight: 1.6,
                }}
              >
                No pudimos confirmar tu pago. Si el cargo aparece en tu cuenta, escríbenos a{" "}
                <a href="mailto:arnaldo@clickonversion.com" style={{ color: "#345CFF" }}>
                  arnaldo@clickonversion.com
                </a>{" "}
                y lo resolvemos de inmediato.
              </p>

              <Link
                href="/checkout"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "100%",
                  height: 54,
                  borderRadius: 12,
                  background: "var(--color-cobalt, #345CFF)",
                  color: "#fff",
                  fontFamily: "var(--font-mk-sans)",
                  fontSize: 15,
                  fontWeight: 600,
                  textDecoration: "none",
                }}
              >
                Volver al checkout
              </Link>
            </>
          ) : (
            <>
              {/* Success state */}
              <div
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: "50%",
                  background: "var(--color-lime, #D9FA62)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 20px",
                }}
              >
                <Check size={24} color="#202124" strokeWidth={2.5} />
              </div>

              <h1
                style={{
                  fontFamily: "var(--font-mk-sans)",
                  fontSize: 26,
                  fontWeight: 700,
                  color: "var(--color-ink, #202124)",
                  margin: "0 0 8px",
                }}
              >
                Pedido confirmado
              </h1>

              <p
                style={{
                  fontFamily: "var(--font-mk-sans)",
                  fontSize: 14,
                  color: "var(--color-muted-ink, #5F6168)",
                  margin: "0 0 24px",
                  lineHeight: 1.6,
                }}
              >
                {payerEmail ? (
                  <>
                    Te enviamos el recibo a <strong>{payerEmail}</strong>. En menos de 24 h
                    hábiles te escribimos para agendar el inicio.
                  </>
                ) : (
                  "Hemos recibido tu pedido. En menos de 24 h hábiles te contactamos para agendar el inicio."
                )}
              </p>

              {/* Order detail pill */}
              {(orderId || totalAmount) && (
                <div
                  style={{
                    background: "var(--color-cream, #F7F5EF)",
                    borderRadius: 10,
                    padding: "12px 16px",
                    marginBottom: 24,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: 8,
                  }}
                >
                  {orderId && (
                    <span
                      style={{
                        fontFamily: "var(--font-mk-mono, monospace)",
                        fontSize: 12,
                        color: "var(--color-muted-ink, #5F6168)",
                      }}
                    >
                      N.º {orderId.slice(0, 12).toUpperCase()}
                    </span>
                  )}
                  {totalAmount && (
                    <span
                      style={{
                        fontFamily: "var(--font-mk-sans)",
                        fontSize: 15,
                        fontWeight: 700,
                        color: "var(--color-ink, #202124)",
                      }}
                    >
                      ${totalAmount} USD
                    </span>
                  )}
                </div>
              )}

              <Link
                href="/portal/dashboard"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "100%",
                  height: 54,
                  borderRadius: 12,
                  background: "var(--color-cobalt, #345CFF)",
                  color: "#fff",
                  fontFamily: "var(--font-mk-sans)",
                  fontSize: 15,
                  fontWeight: 600,
                  textDecoration: "none",
                }}
              >
                Ir a mi panel →
              </Link>
            </>
          )}
        </div>
      </main>
    </div>
  )
}

import Link from "next/link"
import { LogoWordmark } from "@/components/ui/logo-wordmark"

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

export default function CheckoutCancelPage() {
  return (
    <div style={{ minHeight: "100dvh", background: "var(--color-cream, #F7F5EF)" }}>
      <CheckoutHeader />

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
            maxWidth: 440,
            width: "100%",
            textAlign: "center",
          }}
        >
          {/* Icon */}
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: "50%",
              background: "rgba(239,68,68,0.08)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 20px",
            }}
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#EF4444"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
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
            Pago cancelado
          </h1>

          <p
            style={{
              fontFamily: "var(--font-mk-sans)",
              fontSize: 14,
              color: "var(--color-muted-ink, #5F6168)",
              margin: "0 0 28px",
              lineHeight: 1.6,
            }}
          >
            Tu carrito sigue guardado. Puedes retomar la compra cuando quieras.
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
              marginBottom: 10,
            }}
          >
            Volver al checkout →
          </Link>

          <Link
            href="/pricing"
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              width: "100%",
              height: 44,
              borderRadius: 12,
              border: "1px solid #E2DED3",
              color: "var(--color-muted-ink, #5F6168)",
              fontFamily: "var(--font-mk-sans)",
              fontSize: 14,
              fontWeight: 500,
              textDecoration: "none",
            }}
          >
            Ver precios
          </Link>
        </div>
      </main>
    </div>
  )
}

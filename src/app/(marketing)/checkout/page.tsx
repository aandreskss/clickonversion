"use client"

import { useState, useTransition } from "react"
import Link from "next/link"
import { ArrowLeft, Check } from "lucide-react"
import { useCart } from "@/components/shop/cart-provider"
import { LogoWordmark } from "@/components/ui/logo-wordmark"
import {
  createPayPalOrderAction,
  sendTransferConfirmationAction,
  type CheckoutItem,
} from "./actions"
import type { CartItem } from "@/types/catalog"

// ── Helpers ──────────────────────────────────────────────────────────────────

function fmt(n: number) {
  return `$${n.toFixed(2)}`
}

function toCheckoutItem(item: CartItem): CheckoutItem {
  return {
    id: item.priceId,
    name: item.displayName,
    price: item.displayPrice * item.quantity,
    type: item.priceType === "RECURRING" ? "mensual" : "único",
  }
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

// ── Types ────────────────────────────────────────────────────────────────────

type PaymentMethod = "card" | "paypal" | "transfer"

// ── Checkout Header ──────────────────────────────────────────────────────────

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

// ── Empty State ──────────────────────────────────────────────────────────────

function EmptyCart() {
  return (
    <div
      style={{
        minHeight: "60vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 16,
        background: "var(--color-cream, #F7F5EF)",
        padding: "48px 24px",
        textAlign: "center",
      }}
    >
      <p
        style={{
          fontFamily: "var(--font-mk-sans)",
          fontSize: 18,
          fontWeight: 600,
          color: "var(--color-ink, #202124)",
        }}
      >
        Tu carrito está vacío
      </p>
      <div style={{ display: "flex", gap: 12 }}>
        <Link
          href="/pricing"
          style={{
            fontFamily: "var(--font-mk-sans)",
            fontSize: 14,
            color: "var(--color-cobalt, #345CFF)",
            textDecoration: "none",
            fontWeight: 500,
          }}
        >
          Ver precios →
        </Link>
      </div>
    </div>
  )
}

// ── Confirmed State ──────────────────────────────────────────────────────────

interface ConfirmedStateProps {
  email: string
  orderId?: string
  totalToday: number
}

function ConfirmedState({ email, orderId, totalToday }: ConfirmedStateProps) {
  return (
    <div
      style={{
        minHeight: "60vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "var(--color-cream, #F7F5EF)",
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
            fontSize: 24,
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
          Te enviamos el recibo a <strong>{email}</strong>. En menos de 24 h
          hábiles te escribimos para agendar el inicio.
        </p>

        {(orderId || totalToday > 0) && (
          <div
            style={{
              background: "var(--color-cream, #F7F5EF)",
              borderRadius: 10,
              padding: "12px 16px",
              marginBottom: 24,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            {orderId && (
              <span
                style={{
                  fontFamily: "var(--font-mk-mono)",
                  fontSize: 12,
                  color: "var(--color-muted-ink, #5F6168)",
                }}
              >
                N.º {orderId.slice(0, 12).toUpperCase()}
              </span>
            )}
            {totalToday > 0 && (
              <span
                style={{
                  fontFamily: "var(--font-mk-sans)",
                  fontSize: 14,
                  fontWeight: 700,
                  color: "var(--color-ink, #202124)",
                }}
              >
                {fmt(totalToday)}
              </span>
            )}
          </div>
        )}

        <Link
          href="/portal/dashboard"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            background: "var(--color-cobalt, #345CFF)",
            color: "#fff",
            borderRadius: 12,
            padding: "14px 28px",
            fontFamily: "var(--font-mk-sans)",
            fontSize: 15,
            fontWeight: 600,
            textDecoration: "none",
            width: "100%",
            justifyContent: "center",
          }}
        >
          Ir a mi panel →
        </Link>
      </div>
    </div>
  )
}

// ── Transfer Confirmed State ─────────────────────────────────────────────────

interface TransferConfirmedProps {
  email: string
}

function TransferConfirmed({ email }: TransferConfirmedProps) {
  return (
    <div
      style={{
        minHeight: "60vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "var(--color-cream, #F7F5EF)",
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
        }}
      >
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

        <h2
          style={{
            fontFamily: "var(--font-mk-sans)",
            fontSize: 22,
            fontWeight: 700,
            color: "var(--color-ink, #202124)",
            margin: "0 0 8px",
            textAlign: "center",
          }}
        >
          Instrucciones enviadas
        </h2>
        <p
          style={{
            fontFamily: "var(--font-mk-sans)",
            fontSize: 14,
            color: "var(--color-muted-ink, #5F6168)",
            margin: "0 0 24px",
            textAlign: "center",
            lineHeight: 1.6,
          }}
        >
          Te hemos enviado las instrucciones por email a{" "}
          <strong>{email}</strong>. Tu servicio comienza al confirmar el pago.
        </p>

        <div
          style={{
            background: "var(--color-cream, #F7F5EF)",
            border: "1px solid #E2DED3",
            borderRadius: 10,
            padding: "16px",
            fontFamily: "var(--font-mk-mono, monospace)",
            fontSize: 13,
            color: "var(--color-ink, #202124)",
            lineHeight: 1.8,
          }}
        >
          <div style={{ color: "#5F6168", fontSize: 11, marginBottom: 8, fontFamily: "var(--font-mk-sans)" }}>
            DATOS BANCARIOS
          </div>
          <div>Banco: <span style={{ color: "#5F6168" }}>Por confirmar</span></div>
          <div>Beneficiario: <strong>Clickonversion</strong></div>
          <div>IBAN/Cuenta: <span style={{ color: "#5F6168" }}>Por confirmar</span></div>
          <div>Referencia: <strong>Tu email ({email})</strong></div>
        </div>

        <Link
          href="/"
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            marginTop: 20,
            background: "var(--color-ink, #202124)",
            color: "#fff",
            borderRadius: 12,
            padding: "14px 28px",
            fontFamily: "var(--font-mk-sans)",
            fontSize: 15,
            fontWeight: 600,
            textDecoration: "none",
            width: "100%",
          }}
        >
          Volver al inicio
        </Link>
      </div>
    </div>
  )
}

// ── Payment Method Selector ──────────────────────────────────────────────────

interface MethodButtonProps {
  id: PaymentMethod
  label: string
  active: boolean
  onClick: () => void
}

function MethodButton({ id, label, active, onClick }: MethodButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        border: active ? "1.5px solid #202124" : "1px solid #D6D2C6",
        background: active ? "#F7F5EF" : "#fff",
        borderRadius: 10,
        padding: "10px 8px",
        fontFamily: "var(--font-mk-sans)",
        fontSize: 13,
        fontWeight: 500,
        color: "var(--color-ink, #202124)",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
        transition: "border-color 0.15s, background 0.15s",
      }}
    >
      <span
        style={{
          width: 8,
          height: 8,
          borderRadius: "50%",
          background: active ? "#345CFF" : "transparent",
          border: active ? "none" : "1.5px solid #D6D2C6",
          flexShrink: 0,
          transition: "background 0.15s",
        }}
      />
      {label}
    </button>
  )
}

// ── Card Fields (UI only) ────────────────────────────────────────────────────

function CardFields() {
  return (
    <div style={{ marginTop: 16, display: "flex", flexDirection: "column", gap: 12 }}>
      <div>
        <label
          htmlFor="card-number"
          style={{
            display: "block",
            fontFamily: "var(--font-mk-sans)",
            fontSize: 13,
            fontWeight: 500,
            color: "var(--color-ink, #202124)",
            marginBottom: 6,
          }}
        >
          Número de tarjeta
        </label>
        <input
          id="card-number"
          type="text"
          disabled
          placeholder="1234 5678 9012 3456"
          style={{
            width: "100%",
            height: 46,
            border: "1px solid #D6D2C6",
            borderRadius: 10,
            padding: "0 14px",
            fontFamily: "var(--font-mk-mono, monospace)",
            fontSize: 14,
            color: "#202124",
            background: "#FAFAFA",
            cursor: "not-allowed",
            boxSizing: "border-box",
          }}
        />
      </div>
      <div>
        <label
          htmlFor="card-name"
          style={{
            display: "block",
            fontFamily: "var(--font-mk-sans)",
            fontSize: 13,
            fontWeight: 500,
            color: "var(--color-ink, #202124)",
            marginBottom: 6,
          }}
        >
          Nombre del titular
        </label>
        <input
          id="card-name"
          type="text"
          disabled
          placeholder="Jane Smith"
          style={{
            width: "100%",
            height: 46,
            border: "1px solid #D6D2C6",
            borderRadius: 10,
            padding: "0 14px",
            fontFamily: "var(--font-mk-sans)",
            fontSize: 14,
            color: "#202124",
            background: "#FAFAFA",
            cursor: "not-allowed",
            boxSizing: "border-box",
          }}
        />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <div>
          <label
            htmlFor="card-expiry"
            style={{
              display: "block",
              fontFamily: "var(--font-mk-sans)",
              fontSize: 13,
              fontWeight: 500,
              color: "var(--color-ink, #202124)",
              marginBottom: 6,
            }}
          >
            Vencimiento
          </label>
          <input
            id="card-expiry"
            type="text"
            disabled
            placeholder="MM/AA"
            style={{
              width: "100%",
              height: 46,
              border: "1px solid #D6D2C6",
              borderRadius: 10,
              padding: "0 14px",
              fontFamily: "var(--font-mk-mono, monospace)",
              fontSize: 14,
              color: "#202124",
              background: "#FAFAFA",
              cursor: "not-allowed",
              boxSizing: "border-box",
            }}
          />
        </div>
        <div>
          <label
            htmlFor="card-cvc"
            style={{
              display: "block",
              fontFamily: "var(--font-mk-sans)",
              fontSize: 13,
              fontWeight: 500,
              color: "var(--color-ink, #202124)",
              marginBottom: 6,
            }}
          >
            CVC
          </label>
          <input
            id="card-cvc"
            type="text"
            disabled
            placeholder="123"
            style={{
              width: "100%",
              height: 46,
              border: "1px solid #D6D2C6",
              borderRadius: 10,
              padding: "0 14px",
              fontFamily: "var(--font-mk-mono, monospace)",
              fontSize: 14,
              color: "#202124",
              background: "#FAFAFA",
              cursor: "not-allowed",
              boxSizing: "border-box",
            }}
          />
        </div>
      </div>
    </div>
  )
}

// ── Form Field ───────────────────────────────────────────────────────────────

interface FormFieldProps {
  id: string
  label: string
  optional?: boolean
  type?: string
  value: string
  onChange: (v: string) => void
  placeholder?: string
  error?: boolean
}

function FormField({
  id,
  label,
  optional,
  type = "text",
  value,
  onChange,
  placeholder,
  error,
}: FormFieldProps) {
  return (
    <div>
      <label
        htmlFor={id}
        style={{
          display: "block",
          fontFamily: "var(--font-mk-sans)",
          fontSize: 13,
          fontWeight: 500,
          color: "var(--color-ink, #202124)",
          marginBottom: 6,
        }}
      >
        {label}
        {optional && (
          <span style={{ color: "#5F6168", fontWeight: 400, marginLeft: 4 }}>
            (opcional)
          </span>
        )}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        style={{
          width: "100%",
          height: 46,
          border: error ? "1.5px solid #EF4444" : "1px solid #D6D2C6",
          borderRadius: 10,
          padding: "0 14px",
          fontFamily: "var(--font-mk-sans)",
          fontSize: 14,
          color: "#202124",
          background: "#fff",
          outline: "none",
          boxSizing: "border-box",
          transition: "border-color 0.15s",
        }}
      />
      {error && (
        <p
          style={{
            fontFamily: "var(--font-mk-sans)",
            fontSize: 12,
            color: "#EF4444",
            marginTop: 4,
          }}
        >
          Email inválido
        </p>
      )}
    </div>
  )
}

// ── Main Component ───────────────────────────────────────────────────────────

export default function CheckoutPage() {
  const { items, removeItem, clearCart } = useCart()

  // Cart calculations
  const onceItems = items.filter((i) => i.priceType === "ONE_TIME")
  const monthlyItems = items.filter((i) => i.priceType === "RECURRING")
  const onceTotal = onceItems.reduce((s, i) => s + i.displayPrice * i.quantity, 0)
  const monthlyTotal = monthlyItems.reduce((s, i) => s + i.displayPrice * i.quantity, 0)
  const totalToday = onceTotal + monthlyTotal

  // Form state
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [emailTouched, setEmailTouched] = useState(false)
  const [company, setCompany] = useState("")
  const [whatsapp, setWhatsapp] = useState("")
  const [method, setMethod] = useState<PaymentMethod>("paypal")
  const [discountCode, setDiscountCode] = useState("")

  // UI state
  const [error, setError] = useState<string | null>(null)
  const [confirmed, setConfirmed] = useState(false)
  const [transferConfirmed, setTransferConfirmed] = useState(false)
  const [confirmedOrderId, setConfirmedOrderId] = useState<string | undefined>()
  const [isPending, startTransition] = useTransition()

  const emailError = emailTouched && email.length > 0 && !isValidEmail(email)
  const formValid = name.trim().length > 0 && isValidEmail(email)
  const payButtonDisabled = isPending || !formValid || method === "card"

  // ── Submit ──────────────────────────────────────────────────────────────────

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setEmailTouched(true)

    if (!formValid) {
      setError("Por favor completa los campos requeridos.")
      return
    }

    const checkoutItems = items.map(toCheckoutItem)

    if (method === "paypal") {
      startTransition(async () => {
        const result = await createPayPalOrderAction({
          items: checkoutItems,
          name,
          email,
          company: company || undefined,
          whatsapp: whatsapp || undefined,
        })

        if (result.error) {
          setError(result.error)
          return
        }

        if (result.approvalUrl) {
          // Clear cart before redirect
          clearCart()
          window.location.href = result.approvalUrl
        }
      })
    } else if (method === "transfer") {
      startTransition(async () => {
        const result = await sendTransferConfirmationAction({
          items: checkoutItems,
          name,
          email,
          company: company || undefined,
          whatsapp: whatsapp || undefined,
          totalToday,
        })

        if (result.error) {
          setError(result.error)
          return
        }

        clearCart()
        setTransferConfirmed(true)
      })
    }
  }

  // ── Render states ───────────────────────────────────────────────────────────

  if (confirmed) {
    return (
      <div style={{ minHeight: "100dvh", background: "var(--color-cream, #F7F5EF)" }}>
        <CheckoutHeader />
        <ConfirmedState email={email} orderId={confirmedOrderId} totalToday={totalToday} />
      </div>
    )
  }

  if (transferConfirmed) {
    return (
      <div style={{ minHeight: "100dvh", background: "var(--color-cream, #F7F5EF)" }}>
        <CheckoutHeader />
        <TransferConfirmed email={email} />
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div style={{ minHeight: "100dvh", background: "var(--color-cream, #F7F5EF)" }}>
        <CheckoutHeader />
        <EmptyCart />
      </div>
    )
  }

  // ── Main Checkout Form ──────────────────────────────────────────────────────

  const cardStyle: React.CSSProperties = {
    background: "#fff",
    border: "1px solid #E2DED3",
    borderRadius: 16,
    padding: 24,
  }

  const sectionTitle: React.CSSProperties = {
    fontFamily: "var(--font-mk-sans)",
    fontSize: 16,
    fontWeight: 700,
    color: "var(--color-ink, #202124)",
    margin: "0 0 16px",
  }

  return (
    <div style={{ minHeight: "100dvh", background: "var(--color-cream, #F7F5EF)" }}>
      <CheckoutHeader />

      <main style={{ maxWidth: 1120, margin: "0 auto", padding: "32px 24px 64px" }}>
        {/* Back link */}
        <Link
          href="/pricing"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            fontFamily: "var(--font-mk-sans)",
            fontSize: 13,
            color: "var(--color-muted-ink, #5F6168)",
            textDecoration: "none",
            marginBottom: 20,
          }}
        >
          <ArrowLeft size={14} /> Seguir eligiendo
        </Link>

        <h1
          style={{
            fontFamily: "var(--font-mk-sans)",
            fontSize: 28,
            fontWeight: 700,
            color: "var(--color-ink, #202124)",
            margin: "0 0 24px",
          }}
        >
          Finalizar compra
        </h1>

        {/* 2-column grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "minmax(0, 1fr) minmax(0, 380px)",
            gap: 24,
            alignItems: "start",
          }}
          className="checkout-grid"
        >
          {/* ── LEFT column ── */}
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {/* Card 1: Datos */}
            <div style={cardStyle}>
              <h2 style={sectionTitle}>1 Tus datos</h2>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 12,
                }}
                className="form-grid"
              >
                <FormField
                  id="checkout-name"
                  label="Nombre completo"
                  value={name}
                  onChange={setName}
                  placeholder="Jane Smith"
                />
                <FormField
                  id="checkout-email"
                  label="Email"
                  type="email"
                  value={email}
                  onChange={setEmail}
                  placeholder="jane@empresa.com"
                  error={emailError}
                />
                <FormField
                  id="checkout-company"
                  label="Empresa"
                  optional
                  value={company}
                  onChange={setCompany}
                  placeholder="Acme Inc."
                />
                <FormField
                  id="checkout-whatsapp"
                  label="WhatsApp"
                  type="tel"
                  value={whatsapp}
                  onChange={setWhatsapp}
                  placeholder="+34 600 000 000"
                />
              </div>
            </div>

            {/* Card 2: Método de pago */}
            <div style={cardStyle}>
              <h2 style={sectionTitle}>2 Método de pago</h2>

              {/* Segmented tabs */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr 1fr",
                  gap: 8,
                  marginBottom: 16,
                }}
              >
                <MethodButton
                  id="card"
                  label="Tarjeta"
                  active={method === "card"}
                  onClick={() => setMethod("card")}
                />
                <MethodButton
                  id="paypal"
                  label="PayPal"
                  active={method === "paypal"}
                  onClick={() => setMethod("paypal")}
                />
                <MethodButton
                  id="transfer"
                  label="Transferencia"
                  active={method === "transfer"}
                  onClick={() => setMethod("transfer")}
                />
              </div>

              {/* Method-specific content */}
              {method === "card" && <CardFields />}

              {method === "paypal" && (
                <p
                  style={{
                    fontFamily: "var(--font-mk-sans)",
                    fontSize: 14,
                    color: "var(--color-muted-ink, #5F6168)",
                    lineHeight: 1.6,
                    margin: 0,
                  }}
                >
                  Al hacer clic te llevaremos a PayPal para completar la compra de forma segura.
                </p>
              )}

              {method === "transfer" && (
                <p
                  style={{
                    fontFamily: "var(--font-mk-sans)",
                    fontSize: 14,
                    color: "var(--color-muted-ink, #5F6168)",
                    lineHeight: 1.6,
                    margin: 0,
                  }}
                >
                  Te enviaremos los datos bancarios por email. El servicio comienza al confirmar el pago.
                </p>
              )}
            </div>

            {/* Error */}
            {error && (
              <div
                style={{
                  background: "rgba(239,68,68,0.08)",
                  border: "1px solid rgba(239,68,68,0.2)",
                  borderRadius: 10,
                  padding: "12px 16px",
                  fontFamily: "var(--font-mk-sans)",
                  fontSize: 13,
                  color: "#EF4444",
                }}
              >
                {error}
              </div>
            )}
          </form>

          {/* ── RIGHT column (sticky) ── */}
          <aside style={{ position: "sticky", top: 24 }}>
            <div style={cardStyle}>
              <h2
                style={{
                  fontFamily: "var(--font-mk-sans)",
                  fontSize: 18,
                  fontWeight: 700,
                  color: "var(--color-ink, #202124)",
                  margin: "0 0 16px",
                }}
              >
                Tu pedido
              </h2>

              {/* Items */}
              <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 16 }}>
                {items.map((item) => (
                  <div
                    key={item.key}
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      justifyContent: "space-between",
                      gap: 12,
                    }}
                  >
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p
                        style={{
                          fontFamily: "var(--font-mk-sans)",
                          fontSize: 14,
                          fontWeight: 500,
                          color: "var(--color-ink, #202124)",
                          margin: 0,
                          lineHeight: 1.4,
                        }}
                      >
                        {item.displayName}
                      </p>
                      <p
                        style={{
                          fontFamily: "var(--font-mk-sans)",
                          fontSize: 12,
                          color: "var(--color-muted-ink, #5F6168)",
                          margin: "2px 0 0",
                        }}
                      >
                        {item.priceType === "RECURRING" ? "mensual" : "único"}
                        {item.quantity > 1 ? ` × ${item.quantity}` : ""}
                      </p>
                    </div>
                    <div style={{ textAlign: "right", flexShrink: 0 }}>
                      <p
                        style={{
                          fontFamily: "var(--font-mk-sans)",
                          fontSize: 14,
                          fontWeight: 600,
                          color: "var(--color-ink, #202124)",
                          margin: 0,
                        }}
                      >
                        {fmt(item.displayPrice * item.quantity)}
                      </p>
                      <button
                        type="button"
                        onClick={() => removeItem(item.key)}
                        style={{
                          fontFamily: "var(--font-mk-sans)",
                          fontSize: 12,
                          color: "var(--color-muted-ink, #5F6168)",
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                          padding: 0,
                          textDecoration: "underline",
                          marginTop: 2,
                        }}
                      >
                        Quitar
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Discount code */}
              <div
                style={{
                  display: "flex",
                  gap: 8,
                  marginBottom: 16,
                  paddingBottom: 16,
                  borderBottom: "1px solid #E2DED3",
                }}
              >
                <input
                  type="text"
                  value={discountCode}
                  onChange={(e) => setDiscountCode(e.target.value)}
                  placeholder="Código de descuento"
                  style={{
                    flex: 1,
                    height: 40,
                    border: "1px solid #D6D2C6",
                    borderRadius: 8,
                    padding: "0 12px",
                    fontFamily: "var(--font-mk-sans)",
                    fontSize: 13,
                    color: "#202124",
                    background: "#fff",
                    outline: "none",
                    boxSizing: "border-box",
                  }}
                />
                <button
                  type="button"
                  style={{
                    height: 40,
                    padding: "0 14px",
                    border: "1px solid #D6D2C6",
                    borderRadius: 8,
                    fontFamily: "var(--font-mk-sans)",
                    fontSize: 13,
                    fontWeight: 500,
                    color: "var(--color-ink, #202124)",
                    background: "#fff",
                    cursor: "pointer",
                    whiteSpace: "nowrap",
                  }}
                >
                  Aplicar
                </button>
              </div>

              {/* Summary */}
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {onceTotal > 0 && (
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span
                      style={{
                        fontFamily: "var(--font-mk-sans)",
                        fontSize: 13,
                        color: "var(--color-muted-ink, #5F6168)",
                      }}
                    >
                      Pagos únicos
                    </span>
                    <span
                      style={{
                        fontFamily: "var(--font-mk-sans)",
                        fontSize: 13,
                        color: "var(--color-ink, #202124)",
                      }}
                    >
                      {fmt(onceTotal)}
                    </span>
                  </div>
                )}
                {monthlyTotal > 0 && (
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span
                      style={{
                        fontFamily: "var(--font-mk-sans)",
                        fontSize: 13,
                        color: "var(--color-muted-ink, #5F6168)",
                      }}
                    >
                      Primer mes de servicios mensuales
                    </span>
                    <span
                      style={{
                        fontFamily: "var(--font-mk-sans)",
                        fontSize: 13,
                        color: "var(--color-ink, #202124)",
                      }}
                    >
                      {fmt(monthlyTotal)}
                    </span>
                  </div>
                )}

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    borderTop: "1px solid #E2DED3",
                    paddingTop: 10,
                    marginTop: 4,
                  }}
                >
                  <span
                    style={{
                      fontFamily: "var(--font-mk-sans)",
                      fontSize: 15,
                      fontWeight: 700,
                      color: "var(--color-ink, #202124)",
                    }}
                  >
                    Total hoy
                  </span>
                  <span
                    style={{
                      fontFamily: "var(--font-mk-sans)",
                      fontSize: 18,
                      fontWeight: 700,
                      color: "var(--color-ink, #202124)",
                    }}
                  >
                    {fmt(totalToday)} USD
                  </span>
                </div>

                {monthlyTotal > 0 && (
                  <p
                    style={{
                      fontFamily: "var(--font-mk-sans)",
                      fontSize: 12,
                      color: "var(--color-muted-ink, #5F6168)",
                      margin: "2px 0 0",
                    }}
                  >
                    Luego {fmt(monthlyTotal)}/mes. Cancela cuando quieras.
                  </p>
                )}
              </div>

              {/* Pay button */}
              <button
                type="submit"
                form={undefined}
                onClick={handleSubmit}
                disabled={payButtonDisabled}
                style={{
                  width: "100%",
                  height: 54,
                  borderRadius: 12,
                  border: "none",
                  background: payButtonDisabled ? "#D6D2C6" : "var(--color-cobalt, #345CFF)",
                  color: payButtonDisabled ? "#8A8A8A" : "#fff",
                  fontFamily: "var(--font-mk-sans)",
                  fontSize: 16,
                  fontWeight: 700,
                  cursor: payButtonDisabled ? "not-allowed" : "pointer",
                  marginTop: 16,
                  transition: "background 0.15s, color 0.15s",
                }}
              >
                {isPending
                  ? "Procesando…"
                  : method === "card"
                  ? "Próximamente"
                  : `Pagar ${fmt(totalToday)}`}
              </button>

              <p
                style={{
                  fontFamily: "var(--font-mk-sans)",
                  fontSize: 11,
                  color: "var(--color-muted-ink, #5F6168)",
                  textAlign: "center",
                  marginTop: 10,
                  lineHeight: 1.5,
                }}
              >
                Al pagar aceptas los{" "}
                <Link href="/terms" style={{ color: "inherit", textDecoration: "underline" }}>
                  Términos de servicio
                </Link>
              </p>
            </div>
          </aside>
        </div>
      </main>

      {/* Responsive styles */}
      <style>{`
        @media (max-width: 768px) {
          .checkout-grid {
            grid-template-columns: 1fr !important;
          }
          .form-grid {
            grid-template-columns: 1fr !important;
          }
        }
        @media (prefers-reduced-motion: reduce) {
          * { transition: none !important; }
        }
      `}</style>
    </div>
  )
}

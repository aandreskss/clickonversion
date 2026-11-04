import { Navbar } from "./navbar"
import { Footer } from "./footer"
import { WhatsAppWidget, type WhatsAppWidgetProps } from "./whatsapp-widget"

interface MarketingLayoutProps {
  children: React.ReactNode
  active?: string
  /** Mensaje y respuestas rápidas del widget de WhatsApp para esta página */
  whatsapp?: WhatsAppWidgetProps
}

export function MarketingLayout({ children, active, whatsapp }: MarketingLayoutProps) {
  return (
    <div className="ck" style={{ minHeight: "100vh" }}>
      <Navbar active={active} />
      <main id="main-content" tabIndex={-1}>
        {children}
      </main>
      <Footer />
      <WhatsAppWidget {...whatsapp} />
    </div>
  )
}

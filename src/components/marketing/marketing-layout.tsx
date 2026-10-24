import { Navbar } from "./navbar"
import { Footer } from "./footer"

interface MarketingLayoutProps {
  children: React.ReactNode
  active?: string
}

export function MarketingLayout({ children, active }: MarketingLayoutProps) {
  return (
    <div style={{ background: "#F7F5EF", minHeight: "100vh" }}>
      <Navbar active={active} />
      <main id="main-content" tabIndex={-1}>
        {children}
      </main>
      <Footer />
    </div>
  )
}

"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Logo } from "@/components/ui/logo"
import { Menu, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { analytics } from "@/lib/analytics"

const NAV_LINKS = [
  { href: "#system",   label: "The System" },
  { href: "#services", label: "Services" },
  { href: "#process",  label: "Process" },
  { href: "/audit",    label: "Growth Audit" },
]

export function Navbar() {
  const [open, setOpen]           = useState(false)
  const [scrolled, setScrolled]   = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  // Close on route change (hash link clicks)
  const handleLinkClick = () => setOpen(false)

  return (
    <header
      className={cn(
        "fixed top-0 inset-x-0 z-50 transition-all duration-300",
        scrolled
          ? "bg-[#0B0D0F]/95 backdrop-blur-md border-b border-white/8 py-3"
          : "bg-transparent py-5"
      )}
      role="banner"
    >
      <div className="container-wide flex items-center justify-between">
        {/* Logo */}
        <Link href="/" aria-label="ClicKonversion home">
          <Logo size="sm" />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8" aria-label="Primary navigation">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-[#B0B8C1] hover:text-white transition-colors duration-150 font-medium"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Desktop CTA */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            href="/audit"
            onClick={() => analytics.primaryCtaClick("navbar")}
            className="px-5 py-2.5 bg-[#FF5A1F] text-white text-sm font-semibold rounded-lg hover:bg-[#E54A15] transition-colors duration-150 active:scale-[0.98]"
          >
            Get a Growth Audit
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden text-[#B0B8C1] hover:text-white p-2 -mr-2 rounded-lg transition-colors"
          aria-label={open ? "Close navigation" : "Open navigation"}
          aria-expanded={open}
          aria-controls="mobile-nav"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile nav */}
      <div
        id="mobile-nav"
        className={cn(
          "md:hidden transition-all duration-200 overflow-hidden",
          open ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        )}
        aria-hidden={!open}
      >
        <nav
          className="container-wide flex flex-col gap-1 pb-4 pt-2 border-t border-white/8"
          aria-label="Mobile navigation"
        >
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={handleLinkClick}
              className="text-[#B0B8C1] hover:text-white py-2.5 text-sm font-medium transition-colors"
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/audit"
            onClick={() => { handleLinkClick(); analytics.primaryCtaClick("mobile-nav") }}
            className="mt-3 px-5 py-3 bg-[#FF5A1F] text-white text-sm font-semibold rounded-lg hover:bg-[#E54A15] transition-colors text-center"
          >
            Get a Growth Audit
          </Link>
        </nav>
      </div>
    </header>
  )
}

"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { Logo } from "@/components/ui/logo"
import { Menu, X, ChevronDown, ArrowRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { NAV_SERVICES } from "@/data/services"

const MAIN_NAV = [
  { href: "/services", label: "Services" },
  { href: "/apps",     label: "Apps" },
  { href: "/pricing",  label: "Pricing" },
  { href: "/about",    label: "About" },
]

const CATEGORY_META: Record<string, { label: string; color: string; bg: string }> = {
  seo:          { label: "SEO",              color: "text-[#78E6B3]", bg: "bg-[#78E6B3]/10" },
  "paid-media": { label: "Paid Media",       color: "text-[#FFCB86]", bg: "bg-[#FFCB86]/10" },
  automation:   { label: "AI & Automation",  color: "text-[#7885FF]", bg: "bg-[#7885FF]/10" },
  support:      { label: "Support",          color: "text-[#FF5A1F]", bg: "bg-[#FF5A1F]/10" },
}

export function Navbar() {
  const [open, setOpen]         = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [dropdown, setDropdown] = useState(false)
  const [mobileServices, setMobileServices] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  useEffect(() => {
    function onOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdown(false)
      }
    }
    document.addEventListener("mousedown", onOutside)
    return () => document.removeEventListener("mousedown", onOutside)
  }, [])

  return (
    <header
      className={cn(
        "fixed top-0 inset-x-0 z-50 transition-all duration-300",
        scrolled
          ? "bg-[#101827]/96 backdrop-blur-xl border-b border-white/[0.07] py-3"
          : "bg-transparent py-5"
      )}
      role="banner"
    >
      <div className="container-wide flex items-center justify-between gap-8">
        {/* Logo */}
        <Link href="/" aria-label="ClicKonversion home" className="flex-shrink-0">
          <Logo size="sm" variant="light" />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center gap-1" aria-label="Primary navigation">
          {/* Services megamenu trigger */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setDropdown(!dropdown)}
              onMouseEnter={() => setDropdown(true)}
              className={cn(
                "flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-150",
                dropdown
                  ? "text-white bg-white/8"
                  : "text-[#A8B3C0] hover:text-white hover:bg-white/5"
              )}
              aria-expanded={dropdown}
              aria-haspopup="true"
            >
              Services
              <ChevronDown
                size={14}
                className={cn("transition-transform duration-200", dropdown && "rotate-180")}
              />
            </button>

            {/* Megamenu */}
            {dropdown && (
              <div
                className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-[720px] rounded-2xl border border-white/[0.07] bg-[#151E2D]/98 backdrop-blur-xl shadow-2xl overflow-hidden"
                onMouseLeave={() => setDropdown(false)}
              >
                <div className="grid grid-cols-2 gap-0 p-6">
                  {(Object.entries(NAV_SERVICES) as [string, typeof NAV_SERVICES.seo][]).map(([cat, items]) => {
                    const meta = CATEGORY_META[cat]
                    return (
                      <div key={cat} className="space-y-1">
                        <p className={cn("eyebrow px-3 py-1.5 mb-2 rounded-md w-fit", meta.color, meta.bg)}>
                          {meta.label}
                        </p>
                        {items.map((item) => (
                          <Link
                            key={item.slug}
                            href={`/services/${item.slug}`}
                            onClick={() => setDropdown(false)}
                            className="flex items-center justify-between px-3 py-2 rounded-lg text-sm text-[#A8B3C0] hover:text-white hover:bg-white/5 transition-all duration-100 group"
                          >
                            {item.label}
                            <ArrowRight size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                          </Link>
                        ))}
                      </div>
                    )
                  })}
                </div>
                <div className="border-t border-white/[0.06] px-6 py-4 bg-white/[0.02] flex items-center justify-between">
                  <p className="text-xs text-[#4E5D6E]">Not sure where to start?</p>
                  <Link
                    href="/audit"
                    onClick={() => setDropdown(false)}
                    className="text-xs font-semibold text-[#78E6B3] hover:text-white transition-colors flex items-center gap-1"
                  >
                    Get a free audit <ArrowRight size={11} />
                  </Link>
                </div>
              </div>
            )}
          </div>

          {MAIN_NAV.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="px-4 py-2 rounded-lg text-sm font-medium text-[#A8B3C0] hover:text-white hover:bg-white/5 transition-all duration-150"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Desktop CTAs */}
        <div className="hidden lg:flex items-center gap-3 flex-shrink-0">
          <Link
            href="/es"
            className="text-xs font-medium text-[#4E5D6E] hover:text-[#A8B3C0] transition-colors px-2"
            aria-label="Español"
          >
            ES
          </Link>
          <Link
            href="/audit"
            className="px-5 py-2.5 bg-[#FF5A1F] text-white text-sm font-semibold rounded-xl hover:bg-[#E54A15] transition-colors duration-150 active:scale-[0.98]"
          >
            Get a Free Audit
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          onClick={() => setOpen(!open)}
          className="lg:hidden text-[#A8B3C0] hover:text-white p-2 -mr-2 rounded-xl transition-colors"
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
          "lg:hidden transition-all duration-300 overflow-hidden",
          open ? "max-h-[85vh] opacity-100" : "max-h-0 opacity-0"
        )}
        aria-hidden={!open}
      >
        <nav
          className="container-wide flex flex-col gap-1 pb-6 pt-3 border-t border-white/[0.07]"
          aria-label="Mobile navigation"
        >
          {/* Services accordion */}
          <button
            onClick={() => setMobileServices(!mobileServices)}
            className="flex items-center justify-between px-3 py-3 text-sm font-medium text-[#A8B3C0] hover:text-white transition-colors"
          >
            Services
            <ChevronDown
              size={14}
              className={cn("transition-transform duration-200", mobileServices && "rotate-180")}
            />
          </button>

          {mobileServices && (
            <div className="ml-3 mb-2 space-y-4 pl-3 border-l border-white/[0.07]">
              {(Object.entries(NAV_SERVICES) as [string, typeof NAV_SERVICES.seo][]).map(([cat, items]) => {
                const meta = CATEGORY_META[cat]
                return (
                  <div key={cat}>
                    <p className={cn("eyebrow mb-2", meta.color)}>{meta.label}</p>
                    <div className="space-y-0.5">
                      {items.map((item) => (
                        <Link
                          key={item.slug}
                          href={`/services/${item.slug}`}
                          onClick={() => setOpen(false)}
                          className="block py-1.5 text-sm text-[#7A8799] hover:text-white transition-colors"
                        >
                          {item.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
          )}

          {MAIN_NAV.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="px-3 py-3 text-sm font-medium text-[#A8B3C0] hover:text-white transition-colors"
            >
              {link.label}
            </Link>
          ))}

          <div className="mt-4 flex flex-col gap-2">
            <Link
              href="/audit"
              onClick={() => setOpen(false)}
              className="px-5 py-3.5 bg-[#FF5A1F] text-white text-sm font-semibold rounded-xl hover:bg-[#E54A15] transition-colors text-center"
            >
              Get a Free Audit
            </Link>
            <Link
              href="/es"
              onClick={() => setOpen(false)}
              className="py-2 text-xs font-medium text-[#4E5D6E] hover:text-[#A8B3C0] text-center transition-colors"
            >
              Ver en Español
            </Link>
          </div>
        </nav>
      </div>
    </header>
  )
}

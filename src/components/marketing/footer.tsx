import Link from "next/link"
import { Logo } from "@/components/ui/logo"

const FOUNDER_LINKEDIN = "https://www.linkedin.com/in/arnaldocasadiego/"

const FOOTER_NAV = [
  { href: "/audit",    label: "Growth Audit" },
  { href: "/privacy",  label: "Privacy"      },
  { href: "/terms",    label: "Terms"        },
]

export function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="section-dark border-t border-white/8 py-16" role="contentinfo">
      <div className="container-wide">
        <div className="grid md:grid-cols-3 gap-10 mb-12">

          {/* Brand */}
          <div className="flex flex-col gap-4">
            <Logo size="sm" />
            <p className="text-sm text-[#546072] leading-relaxed max-w-xs">
              Growth systems built to convert.
            </p>
            <a
              href="mailto:hello@clickonversion.com"
              className="text-sm text-[#8A9099] hover:text-white transition-colors"
            >
              hello@clickonversion.com
            </a>
            <a
              href={FOUNDER_LINKEDIN}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-[#546072] hover:text-white transition-colors inline-flex items-center gap-1.5"
              aria-label="ClicKonversion on LinkedIn"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
                <rect x="2" y="9" width="4" height="12"/>
                <circle cx="4" cy="4" r="2"/>
              </svg>
              LinkedIn
            </a>
          </div>

          {/* Navigation */}
          <div>
            <p className="text-xs font-semibold tracking-widest text-[#3D4A5C] uppercase mb-5">
              Quick Links
            </p>
            <nav className="flex flex-col gap-3" aria-label="Footer navigation">
              <Link href="/#system" className="text-sm text-[#546072] hover:text-white transition-colors">
                The System
              </Link>
              <Link href="/#services" className="text-sm text-[#546072] hover:text-white transition-colors">
                Services
              </Link>
              <Link href="/#process" className="text-sm text-[#546072] hover:text-white transition-colors">
                Process
              </Link>
              {FOOTER_NAV.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm text-[#546072] hover:text-white transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* CTA */}
          <div>
            <p className="text-xs font-semibold tracking-widest text-[#3D4A5C] uppercase mb-5">
              Get Started
            </p>
            <div className="rounded-xl border border-[#FF5A1F]/15 bg-[#FF5A1F]/5 p-5">
              <p className="text-sm font-semibold text-white mb-2">
                Ready to build a better system?
              </p>
              <p className="text-xs text-[#546072] mb-4 leading-relaxed">
                Start with a free Growth Audit — no obligation, no pitch deck on the first call.
              </p>
              <Link
                href="/audit"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#FF5A1F] hover:text-white transition-colors"
              >
                Get a Free Growth Audit →
              </Link>
            </div>
          </div>
        </div>

        <div className="border-t border-white/6 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-[#3D4A5C]">
            © {year} ClicKonversion. All rights reserved.
          </p>
          <p className="text-xs text-[#3D4A5C]">
            Built for service businesses that want more customers.
          </p>
        </div>
      </div>
    </footer>
  )
}

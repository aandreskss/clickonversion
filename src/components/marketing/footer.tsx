import Link from "next/link"
import { Logo } from "@/components/ui/logo"

const FOOTER_NAV = [
  { href: "#system",   label: "The System"   },
  { href: "#services", label: "Services"      },
  { href: "#process",  label: "Process"       },
  { href: "/audit",    label: "Growth Audit"  },
  { href: "/privacy",  label: "Privacy"       },
  { href: "/terms",    label: "Terms"         },
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
              Growth systems built to turn search, traffic and attention into customers for service businesses.
            </p>
            <a
              href="mailto:hello@clicKonversion.com"
              className="text-sm text-[#8A9099] hover:text-white transition-colors"
            >
              hello@clicKonversion.com
            </a>
          </div>

          {/* Navigation */}
          <div>
            <p className="text-xs font-semibold tracking-widest text-[#3D4A5C] uppercase mb-5">
              Navigation
            </p>
            <nav className="flex flex-col gap-3" aria-label="Footer navigation">
              {FOOTER_NAV.slice(0, 4).map((link) => (
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

          {/* Legal + Tagline */}
          <div>
            <p className="text-xs font-semibold tracking-widest text-[#3D4A5C] uppercase mb-5">
              Legal
            </p>
            <nav className="flex flex-col gap-3">
              {FOOTER_NAV.slice(4).map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm text-[#546072] hover:text-white transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            <div className="mt-8 p-4 rounded-xl border border-[#FF5A1F]/15 bg-[#FF5A1F]/5">
              <p className="text-xs text-[#FF5A1F] font-semibold mb-1">Turn clicks into customers.</p>
              <p className="text-xs text-[#3D4A5C]">Growth systems built to convert.</p>
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

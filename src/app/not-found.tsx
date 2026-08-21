import Link from "next/link"
import { Logo } from "@/components/ui/logo"

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#0B0D0F] flex items-center justify-center px-4">
      <div className="text-center">
        <Link href="/" className="flex justify-center mb-8">
          <Logo size="sm" />
        </Link>
        <h1 className="text-7xl font-bold text-white mb-4">404</h1>
        <p className="text-xl text-[#8A9099] mb-8">This page doesn&apos;t exist.</p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 bg-[#FF5A1F] text-white font-semibold rounded-lg hover:bg-[#E54A15] transition-colors"
        >
          Back to ClicKonversion
        </Link>
      </div>
    </div>
  )
}

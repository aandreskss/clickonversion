import Link from "next/link"
import { XCircle, ArrowLeft, RotateCcw } from "lucide-react"
import { MarketingLayout } from "@/components/marketing/marketing-layout"

export default function CheckoutCancelPage() {
  return (
    <MarketingLayout>
      <div className="min-h-screen bg-[#101827] flex items-center justify-center py-24">
        <div className="container-wide max-w-lg text-center">
          <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 bg-red-500/10">
            <XCircle size={28} className="text-red-400" />
          </div>

          <h1 className="font-display text-3xl font-extrabold text-white mb-3">
            Payment cancelled
          </h1>

          <p className="text-[#7A8799] mb-8">
            No charges were made. Your cart items are still saved — you can try again whenever you&apos;re ready.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/checkout"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#FF5A1F] text-white font-semibold rounded-xl hover:bg-[#E54A15] transition-colors text-sm"
            >
              <RotateCcw size={14} />
              Try again
            </Link>
            <Link
              href="/services"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 text-[#A8B3C0] font-semibold rounded-xl border border-white/10 hover:text-white hover:border-white/20 hover:bg-white/5 transition-colors text-sm"
            >
              <ArrowLeft size={14} />
              Browse services
            </Link>
          </div>
        </div>
      </div>
    </MarketingLayout>
  )
}

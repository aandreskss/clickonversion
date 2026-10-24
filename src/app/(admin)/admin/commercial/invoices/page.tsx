import { Suspense } from "react"
import Link from "next/link"
import { ArrowLeft, FileText, Loader2 } from "lucide-react"
import { CreateInvoiceForm } from "./create-invoice"
import { InvoicesList } from "./invoices-list"

export default function InvoicesPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <Link
          href="/admin/commercial"
          className="flex items-center gap-1.5 text-[#8A9099] text-sm hover:text-[#F7F7F3] transition-colors mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Gestión comercial
        </Link>
        <h1 className="text-2xl font-bold text-[#F7F7F3]">Facturas PayPal</h1>
        <p className="text-[#8A9099] text-sm mt-0.5">
          Crea y envía facturas. El cliente las recibe por email y paga desde PayPal.
        </p>
      </div>

      {/* Invoice list */}
      <div className="bg-[#14171A] border border-[#3D4A5C] rounded-xl p-6 space-y-4">
        <h2 className="text-sm font-semibold text-[#F7F7F3] flex items-center gap-2">
          <FileText className="w-4 h-4 text-[#FF5A1F]" />
          Facturas enviadas
        </h2>
        <Suspense
          fallback={
            <div className="flex items-center gap-2 py-8 justify-center text-[#546072]">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span className="text-sm">Cargando facturas…</span>
            </div>
          }
        >
          <InvoicesList />
        </Suspense>
      </div>

      {/* Create form */}
      <div className="space-y-4">
        <h2 className="text-sm font-semibold text-[#F7F7F3]">Nueva factura</h2>
        <CreateInvoiceForm />
      </div>
    </div>
  )
}

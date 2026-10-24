import Link from "next/link"
import { ArrowLeft, FileText } from "lucide-react"
import { CreateInvoiceForm } from "./create-invoice"

export default function InvoicesPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <Link
          href="/admin/commercial"
          className="flex items-center gap-1.5 text-[#8A9099] text-sm hover:text-[#F7F7F3] transition-colors mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Gestión comercial
        </Link>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-[#F7F7F3]">Facturas</h1>
            <p className="text-[#8A9099] text-sm mt-0.5">
              Genera facturas PayPal y envíalas directamente al cliente
            </p>
          </div>
        </div>
      </div>

      {/* Info banner */}
      <div className="flex items-start gap-3 p-4 bg-[#FF5A1F]/10 border border-[#FF5A1F]/20 rounded-xl">
        <FileText className="w-5 h-5 text-[#FF5A1F] flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-medium text-[#F7F7F3]">Integración PayPal Invoicing</p>
          <p className="text-xs text-[#8A9099] mt-0.5">
            Las facturas se crean vía PayPal Invoicing API y se envían automáticamente al email del
            cliente. El cliente puede pagar directamente desde el link de PayPal.
          </p>
        </div>
      </div>

      {/* Create invoice form */}
      <CreateInvoiceForm />
    </div>
  )
}

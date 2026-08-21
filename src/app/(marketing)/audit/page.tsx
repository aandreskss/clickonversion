import type { Metadata } from "next"
import { MarketingLayout } from "@/components/marketing/marketing-layout"
import { AuditForm }       from "@/components/forms/audit-form"

export const metadata: Metadata = {
  title: "Get a Free Growth Audit",
  description:
    "Find out where your website and marketing system are losing customers. Request your free Growth Audit — we look at search, conversion, acquisition and follow-up.",
}

export default function AuditPage() {
  return (
    <MarketingLayout>
      <section className="section-dark min-h-screen py-24 pt-32">
        <div className="container-tight">
          <div className="text-center mb-12">
            <p className="text-xs font-semibold tracking-widest text-[#FF5A1F] uppercase mb-4">
              Free Growth Audit
            </p>
            <h1 className="text-4xl lg:text-5xl font-bold text-white mb-5 leading-tight">
              What&apos;s stopping your website
              <br />
              from generating more customers?
            </h1>
            <p className="text-lg text-[#8A9099] max-w-xl mx-auto leading-relaxed">
              We&apos;ll review your search visibility, website, conversion path, and acquisition setup — and show you where the biggest opportunities are.
            </p>
          </div>
          <AuditForm />
        </div>
      </section>
    </MarketingLayout>
  )
}

import type { Metadata }   from "next"
import { MarketingLayout } from "@/components/marketing/marketing-layout"

export const metadata: Metadata = {
  title: "Terms of Service",
  robots: { index: true, follow: false },
}

export default function TermsPage() {
  return (
    <MarketingLayout>
      <section className="section-dark py-24 pt-32 min-h-screen">
        <div className="container-tight">
          <div className="max-w-2xl mx-auto">
            <h1 className="text-4xl font-bold text-white mb-3">Terms of Service</h1>
            <p className="text-sm text-[#546072] mb-10">Last updated: {new Date().getFullYear()}</p>

            <div className="prose prose-sm max-w-none text-[#8A9099] space-y-8">
              <section>
                <h2 className="text-lg font-bold text-white mb-3">Services</h2>
                <p>ClicKonversion provides growth marketing consulting and execution services to service businesses. The scope of services for each engagement is defined in a separate statement of work or service agreement.</p>
              </section>

              <section>
                <h2 className="text-lg font-bold text-white mb-3">Growth Audit</h2>
                <p>The Growth Audit is a complimentary review of your search visibility, website, conversion path, and acquisition setup. Submitting an audit request does not create a contractual obligation on either party.</p>
              </section>

              <section>
                <h2 className="text-lg font-bold text-white mb-3">No Guarantees</h2>
                <p>ClicKonversion does not guarantee specific rankings, leads, revenue, or return on ad spend. Marketing outcomes depend on many factors including your market, competition, website, and service quality. We commit to applying expertise, evidence-based strategy, and transparent measurement — not specific outcomes.</p>
              </section>

              <section>
                <h2 className="text-lg font-bold text-white mb-3">Intellectual Property</h2>
                <p>All content, strategies, and deliverables produced by ClicKonversion become the property of the client upon full payment, unless otherwise specified in the service agreement.</p>
              </section>

              <section>
                <h2 className="text-lg font-bold text-white mb-3">Limitation of Liability</h2>
                <p>ClicKonversion shall not be liable for indirect, incidental, or consequential damages arising from the use of our services. Our maximum liability shall not exceed the fees paid for the relevant service in the prior 30 days.</p>
              </section>

              <section>
                <h2 className="text-lg font-bold text-white mb-3">Contact</h2>
                <p>Questions? Email <a href="mailto:hello@clicKonversion.com" className="text-[#FF5A1F] hover:underline">hello@clicKonversion.com</a>.</p>
              </section>
            </div>
          </div>
        </div>
      </section>
    </MarketingLayout>
  )
}

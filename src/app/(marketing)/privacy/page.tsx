import type { Metadata }    from "next"
import { MarketingLayout }  from "@/components/marketing/marketing-layout"

export const metadata: Metadata = {
  title: "Privacy Policy",
  robots: { index: true, follow: false },
}

export default function PrivacyPage() {
  return (
    <MarketingLayout>
      <section className="section-dark py-24 pt-32 min-h-screen">
        <div className="container-tight">
          <div className="max-w-2xl mx-auto">
            <h1 className="text-4xl font-bold text-white mb-3">Privacy Policy</h1>
            <p className="text-sm text-[#546072] mb-10">Last updated: {new Date().getFullYear()}</p>

            <div className="prose prose-sm max-w-none text-[#8A9099] space-y-8">
              <section>
                <h2 className="text-lg font-bold text-white mb-3">Information We Collect</h2>
                <p>When you submit a Growth Audit request, we collect: your name, work email, company name, website URL, service type, city, primary goal, and optionally your phone number, marketing budget range, and a description of your challenge.</p>
                <p className="mt-2">We also automatically collect attribution data (UTM parameters, referring page) to understand how you found us. This helps us evaluate our marketing effectiveness.</p>
              </section>

              <section>
                <h2 className="text-lg font-bold text-white mb-3">How We Use Your Information</h2>
                <p>We use the information you provide to:</p>
                <ul className="list-disc pl-5 mt-2 space-y-1">
                  <li>Prepare and deliver your Growth Audit</li>
                  <li>Contact you about your audit results</li>
                  <li>Manage our relationship with you as a prospective or current client</li>
                  <li>Improve our services</li>
                </ul>
                <p className="mt-2">We do not sell your personal information. We do not use it for advertising targeting on social platforms or Google.</p>
              </section>

              <section>
                <h2 className="text-lg font-bold text-white mb-3">Analytics</h2>
                <p>We use Google Analytics 4 to understand how visitors interact with our website. GA4 collects anonymized behavioral data. We do not send personally identifiable information (names, emails) to GA4.</p>
              </section>

              <section>
                <h2 className="text-lg font-bold text-white mb-3">Data Storage</h2>
                <p>Your information is stored securely using Supabase (a managed PostgreSQL database hosted on AWS). Access is restricted to authorized ClicKonversion personnel only.</p>
              </section>

              <section>
                <h2 className="text-lg font-bold text-white mb-3">Your Rights</h2>
                <p>You may request to view, update, or delete the personal information we hold about you at any time by emailing <a href="mailto:hello@clicKonversion.com" className="text-[#FF5A1F] hover:underline">hello@clicKonversion.com</a>.</p>
              </section>

              <section>
                <h2 className="text-lg font-bold text-white mb-3">Contact</h2>
                <p>Questions about this policy? Email us at <a href="mailto:hello@clicKonversion.com" className="text-[#FF5A1F] hover:underline">hello@clicKonversion.com</a>.</p>
              </section>
            </div>
          </div>
        </div>
      </section>
    </MarketingLayout>
  )
}

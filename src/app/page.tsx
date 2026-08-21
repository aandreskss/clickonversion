import { MarketingLayout }       from "@/components/marketing/marketing-layout"
import { Hero }                   from "@/components/marketing/hero"
import { ProblemSection }         from "@/components/marketing/problem-section"
import { SystemSection }          from "@/components/marketing/system-section"
import { ServiceSection }         from "@/components/marketing/service-section"
import { Differentiators }        from "@/components/marketing/differentiators"
import { ServicesSlider }         from "@/components/marketing/services-slider"
import { IndustriesSection }      from "@/components/marketing/industries-section"
import { ProcessSection }         from "@/components/marketing/process-section"
import { AuditExampleSection }    from "@/components/marketing/audit-example-section"
import { FounderSection }         from "@/components/marketing/founder-section"
import { AuditCTA }               from "@/components/marketing/audit-cta"

export default function HomePage() {
  return (
    <MarketingLayout>
      <Hero />
      <ProblemSection />
      <SystemSection />
      <ServiceSection />
      <Differentiators />
      <ServicesSlider />
      <IndustriesSection />
      <ProcessSection />
      <AuditExampleSection />
      <FounderSection />
      <AuditCTA />
    </MarketingLayout>
  )
}

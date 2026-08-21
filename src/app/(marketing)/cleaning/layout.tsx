import type { Metadata } from "next"

// Outbound landing page — not indexed during initial outreach phase.
// Revisit for indexing once content is validated and sufficiently unique.
export const metadata: Metadata = {
  robots: { index: false, follow: false },
}

export default function CleaningLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}

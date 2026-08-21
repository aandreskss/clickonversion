// Passthrough — marketing pages use the MarketingLayout component directly
// to avoid route conflicts with app/page.tsx
export default function MarketingGroupLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}

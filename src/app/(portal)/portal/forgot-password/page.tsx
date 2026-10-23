"use client"

import { useState } from "react"
import Link from "next/link"
import { Loader2 } from "lucide-react"
import { Logo } from "@/components/ui/logo"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const res = await fetch("/api/portal/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: email.trim().toLowerCase() }),
    })

    if (!res.ok) {
      setError("Something went wrong. Please try again.")
      setLoading(false)
      return
    }

    setSent(true)
  }

  if (sent) {
    return (
      <Wrapper>
        <h1 className="text-xl font-bold text-white mb-1">Email sent</h1>
        <p className="text-sm text-[#7A8799] mb-6">
          Check <strong className="text-white">{email}</strong> for a password reset link.
          The link expires in 1 hour.
        </p>
        <Link
          href="/portal/login"
          className="block w-full text-center py-3 px-5 bg-[#1C2026] text-white rounded-lg hover:bg-white/10 transition-colors text-sm font-medium"
        >
          Back to sign in
        </Link>
      </Wrapper>
    )
  }

  return (
    <Wrapper>
      <h1 className="text-xl font-bold text-white mb-1">Reset password</h1>
      <p className="text-sm text-[#546072] mb-6">Enter your email and we&apos;ll send a reset link.</p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="email" className="text-sm font-medium text-[#B0B8C1]">Email</label>
          <input
            id="email" type="email" required
            value={email} onChange={(e) => setEmail(e.target.value)}
            placeholder="you@company.com"
            className={inputClass}
          />
        </div>

        {error && (
          <div className="rounded-lg border border-red-500/20 bg-red-500/8 px-4 py-3">
            <p className="text-sm text-red-400">{error}</p>
          </div>
        )}

        <button
          type="submit" disabled={loading}
          className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 bg-[#FF5A1F] text-white font-semibold rounded-lg hover:bg-[#E54A15] transition-colors disabled:opacity-60"
        >
          {loading && <Loader2 size={18} className="animate-spin" />}
          {loading ? "Sending…" : "Send reset link"}
        </button>

        <p className="text-center text-sm text-[#546072]">
          Remember it?{" "}
          <Link href="/portal/login" className="text-[#FF5A1F] hover:underline">Sign in</Link>
        </p>
      </form>
    </Wrapper>
  )
}

function Wrapper({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#0B0D0F] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="flex justify-center mb-10"><Logo size="md" /></div>
        <div className="rounded-2xl border border-white/8 bg-[#14171A] p-8">{children}</div>
      </div>
    </div>
  )
}

const inputClass = [
  "w-full rounded-lg border border-white/10 bg-[#1C2026] text-white placeholder:text-[#546072]",
  "px-3.5 py-2.5 text-sm transition-colors",
  "focus:outline-none focus:ring-2 focus:ring-[#FF5A1F]/40 focus:border-[#FF5A1F]/60",
  "hover:border-white/20",
].join(" ")

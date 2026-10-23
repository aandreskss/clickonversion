"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Loader2 } from "lucide-react"
import { Logo } from "@/components/ui/logo"

export default function PortalRegisterPage() {
  const router = useRouter()

  const [fullName, setFullName] = useState("")
  const [orgName, setOrgName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    if (password.length < 8) {
      setError("Password must be at least 8 characters.")
      return
    }

    setLoading(true)

    const res = await fetch("/api/portal/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fullName: fullName.trim(),
        orgName: orgName.trim(),
        email: email.trim().toLowerCase(),
        password,
      }),
    })

    const body = await res.json()

    if (!res.ok) {
      setError(body.error ?? "Registration failed. Please try again.")
      setLoading(false)
      return
    }

    setSent(true)
  }

  if (sent) {
    return (
      <div className="min-h-screen bg-[#0B0D0F] flex items-center justify-center px-4">
        <div className="w-full max-w-sm text-center space-y-4">
          <div className="flex justify-center mb-6"><Logo size="md" /></div>
          <div className="rounded-2xl border border-white/8 bg-[#14171A] p-8 space-y-4">
            <div className="w-12 h-12 rounded-full bg-[#FF5A1F]/15 flex items-center justify-center mx-auto">
              <span className="text-2xl">✉️</span>
            </div>
            <h1 className="text-xl font-bold text-white">Check your email</h1>
            <p className="text-sm text-[#7A8799]">
              We sent a confirmation link to <strong className="text-white">{email}</strong>.
              Click the link to activate your account.
            </p>
            <p className="text-xs text-[#546072]">
              Didn&apos;t receive it? Check your spam folder.
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0B0D0F] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="flex justify-center mb-10"><Logo size="md" /></div>
        <div className="rounded-2xl border border-white/8 bg-[#14171A] p-8">
          <h1 className="text-xl font-bold text-white mb-1">Create account</h1>
          <p className="text-sm text-[#546072] mb-6">Access your client portal</p>

          <form onSubmit={handleRegister} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="full_name" className="text-sm font-medium text-[#B0B8C1]">Full name</label>
              <input
                id="full_name" type="text" required
                value={fullName} onChange={(e) => setFullName(e.target.value)}
                placeholder="Jane Smith"
                className={inputClass}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="org_name" className="text-sm font-medium text-[#B0B8C1]">Company name</label>
              <input
                id="org_name" type="text" required
                value={orgName} onChange={(e) => setOrgName(e.target.value)}
                placeholder="Acme Inc."
                className={inputClass}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="email" className="text-sm font-medium text-[#B0B8C1]">Work email</label>
              <input
                id="email" type="email" autoComplete="email" required
                value={email} onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                className={inputClass}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="password" className="text-sm font-medium text-[#B0B8C1]">Password</label>
              <input
                id="password" type="password" required minLength={8}
                value={password} onChange={(e) => setPassword(e.target.value)}
                placeholder="Min. 8 characters"
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
              className="mt-2 w-full inline-flex items-center justify-center gap-2 px-5 py-3 bg-[#FF5A1F] text-white font-semibold rounded-lg hover:bg-[#E54A15] transition-colors disabled:opacity-60"
            >
              {loading && <Loader2 size={18} className="animate-spin" />}
              {loading ? "Creating account…" : "Create account"}
            </button>
          </form>

          <p className="text-center text-sm text-[#546072] mt-5">
            Already have an account?{" "}
            <Link href="/portal/login" className="text-[#FF5A1F] hover:underline font-medium">
              Sign in
            </Link>
          </p>
        </div>
        <p className="text-center text-xs text-[#3D4A5C] mt-6">
          By creating an account you agree to our{" "}
          <Link href="/terms" className="hover:underline">Terms of Service</Link>.
        </p>
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

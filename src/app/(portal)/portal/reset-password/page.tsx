"use client"

import { useState, useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Loader2 } from "lucide-react"
import { Logo } from "@/components/ui/logo"
import Link from "next/link"

function ResetPasswordForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get("token")

  const [password,  setPassword]  = useState("")
  const [confirm,   setConfirm]   = useState("")
  const [error,     setError]     = useState<string | null>(null)
  const [loading,   setLoading]   = useState(false)
  const [done,      setDone]      = useState(false)

  useEffect(() => {
    if (!token) setError("Missing or invalid reset link. Please request a new one.")
  }, [token])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    if (password.length < 8) {
      setError("Password must be at least 8 characters.")
      return
    }
    if (password !== confirm) {
      setError("Passwords do not match.")
      return
    }
    if (!token) {
      setError("Invalid reset link.")
      return
    }

    setLoading(true)

    const res = await fetch("/api/portal/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, password }),
    })

    if (!res.ok) {
      const data = await res.json().catch(() => ({}))
      setError(data.error ?? "Something went wrong. Please try again.")
      setLoading(false)
      return
    }

    setDone(true)
    setTimeout(() => router.push("/portal/login"), 2000)
  }

  if (done) {
    return (
      <div className="text-center space-y-3">
        <div className="w-12 h-12 rounded-full bg-green-500/15 flex items-center justify-center mx-auto">
          <span className="text-2xl">✓</span>
        </div>
        <h1 className="text-xl font-bold text-white">Password updated</h1>
        <p className="text-sm text-[#7A8799]">Redirecting you to sign in…</p>
      </div>
    )
  }

  return (
    <>
      <h1 className="text-xl font-bold text-white mb-1">Set new password</h1>
      <p className="text-sm text-[#546072] mb-6">Choose a password with at least 8 characters.</p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="password" className="text-sm font-medium text-[#B0B8C1]">New password</label>
          <input
            id="password" type="password" required minLength={8}
            value={password} onChange={(e) => setPassword(e.target.value)}
            className={inputClass}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="confirm" className="text-sm font-medium text-[#B0B8C1]">Confirm password</label>
          <input
            id="confirm" type="password" required
            value={confirm} onChange={(e) => setConfirm(e.target.value)}
            className={inputClass}
          />
        </div>

        {error && (
          <div className="rounded-lg border border-red-500/20 bg-red-500/8 px-4 py-3">
            <p className="text-sm text-red-400">{error}</p>
          </div>
        )}

        <button
          type="submit" disabled={loading || !token}
          className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 bg-[#FF5A1F] text-white font-semibold rounded-lg hover:bg-[#E54A15] transition-colors disabled:opacity-60"
        >
          {loading && <Loader2 size={18} className="animate-spin" />}
          {loading ? "Updating…" : "Update password"}
        </button>

        <p className="text-center text-sm text-[#546072]">
          <Link href="/portal/login" className="text-[#FF5A1F] hover:underline">Back to sign in</Link>
        </p>
      </form>
    </>
  )
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen bg-[#0B0D0F] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="flex justify-center mb-10"><Logo size="md" /></div>
        <div className="rounded-2xl border border-white/8 bg-[#14171A] p-8">
          <Suspense fallback={<div className="text-white text-sm">Loading…</div>}>
            <ResetPasswordForm />
          </Suspense>
        </div>
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

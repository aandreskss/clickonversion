"use client"

import { useState, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Loader2 } from "lucide-react"
import { signIn } from "next-auth/react"
import { Logo } from "@/components/ui/logo"

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const nextPath = searchParams.get("next") ?? "/portal/dashboard"
  const errorParam = searchParams.get("error")

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(errorParam ? "Incorrect email or password." : null)
  const [loading, setLoading] = useState(false)

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const result = await signIn("credentials", {
      email: email.trim().toLowerCase(),
      password,
      redirect: false,
    })

    if (result?.error) {
      setError("Incorrect email or password.")
      setLoading(false)
      return
    }

    router.push(nextPath)
    router.refresh()
  }

  return (
    <form onSubmit={handleLogin} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <label htmlFor="email" className="text-sm font-medium text-[#B0B8C1]">Email</label>
        <input
          id="email" type="email" autoComplete="email" required
          value={email} onChange={(e) => setEmail(e.target.value)}
          placeholder="you@company.com"
          className={inputClass}
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between">
          <label htmlFor="password" className="text-sm font-medium text-[#B0B8C1]">Password</label>
          <Link href="/portal/forgot-password" className="text-xs text-[#FF5A1F] hover:underline">
            Forgot password?
          </Link>
        </div>
        <input
          id="password" type="password" autoComplete="current-password" required
          value={password} onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          className={inputClass}
        />
      </div>

      {error && (
        <div className="rounded-lg border border-red-500/20 bg-red-500/8 px-4 py-3" role="alert">
          <p className="text-sm text-red-400">{error}</p>
        </div>
      )}

      <button
        type="submit" disabled={loading}
        className="mt-2 w-full inline-flex items-center justify-center gap-2 px-5 py-3 bg-[#FF5A1F] text-white font-semibold rounded-lg hover:bg-[#E54A15] transition-colors disabled:opacity-60"
      >
        {loading && <Loader2 size={18} className="animate-spin" />}
        {loading ? "Signing in…" : "Sign in to portal"}
      </button>

      <p className="text-center text-sm text-[#546072]">
        Don&apos;t have an account?{" "}
        <Link href="/portal/register" className="text-[#FF5A1F] hover:underline font-medium">
          Create one
        </Link>
      </p>
    </form>
  )
}

export default function PortalLoginPage() {
  return (
    <div className="min-h-screen bg-[#0B0D0F] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="flex justify-center mb-10">
          <Logo size="md" />
        </div>
        <div className="rounded-2xl border border-white/8 bg-[#14171A] p-8">
          <h1 className="text-xl font-bold text-white mb-1">Client portal</h1>
          <p className="text-sm text-[#546072] mb-6">Sign in to manage your services</p>
          <Suspense fallback={<div className="h-52 animate-pulse rounded-lg bg-white/5" />}>
            <LoginForm />
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

"use client"

import { useState, Suspense }  from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Logo }                from "@/components/ui/logo"
import { Loader2 }             from "lucide-react"
import { createClient }        from "@/lib/supabase/client"

function LoginForm() {
  const router       = useRouter()
  const searchParams = useSearchParams()
  const nextPath     = searchParams.get("next") ?? "/app"

  const [email,    setEmail]    = useState("")
  const [password, setPassword] = useState("")
  const [error,    setError]    = useState<string | null>(null)
  const [loading,  setLoading]  = useState(false)

  const supabase = createClient()

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const { error: authError } = await supabase.auth.signInWithPassword({
      email:    email.trim().toLowerCase(),
      password,
    })

    if (authError) {
      setError("Invalid email or password.")
      setLoading(false)
      return
    }

    router.push(nextPath)
    router.refresh()
  }

  const inputClass = [
    "w-full rounded-lg border border-white/10 bg-[#1C2026] text-white placeholder:text-[#546072]",
    "px-3.5 py-2.5 text-sm transition-colors duration-150",
    "focus:outline-none focus:ring-2 focus:ring-[#FF5A1F]/40 focus:border-[#FF5A1F]/60",
    "hover:border-white/20",
  ].join(" ")

  return (
    <form onSubmit={handleLogin} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <label htmlFor="email" className="text-sm font-medium text-[#B0B8C1]">
          Email
        </label>
        <input
          id="email"
          type="email"
          className={inputClass}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="hello@clicKonversion.com"
          autoComplete="email"
          required
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <label htmlFor="password" className="text-sm font-medium text-[#B0B8C1]">
          Password
        </label>
        <input
          id="password"
          type="password"
          className={inputClass}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          autoComplete="current-password"
          required
        />
      </div>

      {error && (
        <div className="rounded-lg border border-red-500/20 bg-red-500/8 px-4 py-3" role="alert">
          <p className="text-sm text-red-400">{error}</p>
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="mt-2 w-full inline-flex items-center justify-center gap-2 px-5 py-3 bg-[#FF5A1F] text-white font-semibold rounded-lg hover:bg-[#E54A15] transition-colors duration-150 disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {loading ? <Loader2 size={18} className="animate-spin" /> : null}
        {loading ? "Signing in…" : "Sign In"}
      </button>
    </form>
  )
}

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-[#0B0D0F] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="flex justify-center mb-10">
          <Logo size="md" />
        </div>

        <div className="rounded-2xl border border-white/8 bg-[#14171A] p-8">
          <h1 className="text-xl font-bold text-white mb-1">Sign in</h1>
          <p className="text-sm text-[#546072] mb-6">Internal CRM access</p>

          <Suspense fallback={<div className="h-40 animate-pulse rounded-lg bg-white/5" />}>
            <LoginForm />
          </Suspense>
        </div>

        <p className="text-center text-xs text-[#3D4A5C] mt-6">
          Account access is by invitation only.
        </p>
      </div>
    </div>
  )
}

"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { useSession } from "next-auth/react"
import { Loader2 } from "lucide-react"
import { Logo } from "@/components/ui/logo"

export default function AcceptInvitePage() {
  const { token } = useParams() as { token: string }
  const router    = useRouter()
  const { data: session, status: sessionStatus } = useSession()

  const [status,  setStatus]  = useState<"loading" | "ready" | "needsAuth" | "error" | "done">("loading")
  const [message, setMessage] = useState("")
  const [orgName, setOrgName] = useState("")

  useEffect(() => {
    if (sessionStatus === "loading") return

    async function checkInvite() {
      // Validate token via API
      const res = await fetch(`/api/portal/org/accept-invite?token=${token}`)
      const data = await res.json() as { valid?: boolean; email?: string; orgName?: string; error?: string }

      if (!res.ok || !data.valid) {
        setMessage(data.error ?? "This invitation is invalid or has expired.")
        setStatus("error")
        return
      }

      setOrgName(data.orgName ?? "your team")

      if (session) {
        // User is already logged in — accept directly
        await acceptNow(token)
      } else {
        // User needs to sign in or create an account
        setMessage(`You've been invited to join ${data.orgName ?? "your team"}`)
        setStatus("needsAuth")
      }
    }

    checkInvite()
  }, [token, session, sessionStatus]) // eslint-disable-line react-hooks/exhaustive-deps

  async function acceptNow(t: string) {
    const res = await fetch("/api/portal/org/accept-invite", {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify({ token: t }),
    })
    if (res.ok) {
      setStatus("done")
      setTimeout(() => router.push("/portal/dashboard"), 1500)
    } else {
      const data = await res.json() as { error?: string }
      setMessage(data.error ?? "Failed to accept invitation.")
      setStatus("error")
    }
  }

  if (status === "loading" || sessionStatus === "loading") {
    return (
      <Wrapper>
        <div className="flex items-center justify-center py-8">
          <Loader2 size={24} className="animate-spin text-[#FF5A1F]" />
        </div>
      </Wrapper>
    )
  }

  if (status === "done") {
    return (
      <Wrapper>
        <div className="text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-green-500/15 flex items-center justify-center mx-auto text-2xl">✓</div>
          <h1 className="text-xl font-bold text-white">Invitation accepted!</h1>
          <p className="text-sm text-[#7A8799]">Redirecting to your portal…</p>
        </div>
      </Wrapper>
    )
  }

  if (status === "error") {
    return (
      <Wrapper>
        <h1 className="text-xl font-bold text-white mb-3">Invitation expired</h1>
        <p className="text-sm text-[#7A8799] mb-5">{message}</p>
        <a href="/portal/login" className="block text-center text-sm text-[#FF5A1F] hover:underline">
          Go to sign in
        </a>
      </Wrapper>
    )
  }

  if (status === "ready") {
    return (
      <Wrapper>
        <h1 className="text-xl font-bold text-white mb-2">Almost there</h1>
        <p className="text-sm text-[#7A8799]">{message}</p>
      </Wrapper>
    )
  }

  // needsAuth — prompt to sign in or create account
  return (
    <Wrapper>
      <h1 className="text-xl font-bold text-white mb-1">Accept invitation</h1>
      <p className="text-sm text-[#7A8799] mb-6">
        You&apos;ve been invited to join <strong className="text-white">{orgName}</strong>.
        Sign in or create an account to accept.
      </p>

      <div className="flex flex-col gap-3">
        <a
          href={`/portal/login?next=/portal/accept-invite/${token}`}
          className="w-full inline-flex items-center justify-center px-5 py-3 bg-[#FF5A1F] text-white font-semibold rounded-lg hover:bg-[#E54A15] transition-colors"
        >
          Sign in to accept
        </a>
        <a
          href={`/portal/register?next=/portal/accept-invite/${token}`}
          className="w-full inline-flex items-center justify-center px-5 py-3 border border-white/10 text-white font-semibold rounded-lg hover:bg-white/5 transition-colors"
        >
          Create an account
        </a>
      </div>
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

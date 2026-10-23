"use client"

import { useState } from "react"
import type { Comment } from "@/types/portal"
import { Loader2, Send } from "lucide-react"

interface Props {
  requestId:       string
  orgId:           string
  userId:          string
  initialComments: Comment[]
}

function Avatar({ name, email }: { name: string | null | undefined; email: string }) {
  const initials = (name ?? email).slice(0, 2).toUpperCase()
  return (
    <div className="w-8 h-8 rounded-full bg-[#FF5A1F]/20 flex items-center justify-center shrink-0 text-xs font-bold text-[#FF5A1F]">
      {initials}
    </div>
  )
}

export function RequestComments({ requestId, orgId, userId, initialComments }: Props) {
  const [comments, setComments] = useState<Comment[]>(initialComments)
  const [body,     setBody]     = useState("")
  const [loading,  setLoading]  = useState(false)
  const [error,    setError]    = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const trimmed = body.trim()
    if (!trimmed) return

    setLoading(true)
    setError(null)

    const res = await fetch(`/api/portal/requests/${requestId}/comments`, {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify({ body: trimmed, orgId }),
    })

    if (!res.ok) {
      const data = await res.json() as { error?: string }
      setError(data.error ?? "Failed to send message.")
      setLoading(false)
      return
    }

    const newComment = await res.json() as Comment
    setComments((prev) => [...prev, newComment])
    setBody("")
    setLoading(false)
  }

  return (
    <div className="space-y-4">
      {/* Thread */}
      {comments.length === 0 ? (
        <p className="text-sm text-[#546072] py-4">No messages yet. Start the conversation.</p>
      ) : (
        <ul className="space-y-4">
          {comments.map((c) => {
            const isOwn = c.authorId === userId
            return (
              <li key={c.id} className={`flex gap-3 ${isOwn ? "flex-row-reverse" : ""}`}>
                <Avatar name={c.author?.fullName} email={c.author?.email ?? c.authorId} />
                <div className={`max-w-[75%] ${isOwn ? "items-end" : "items-start"} flex flex-col gap-1`}>
                  <div className={[
                    "px-4 py-2.5 rounded-2xl text-sm leading-relaxed",
                    isOwn
                      ? "bg-[#FF5A1F]/20 text-white rounded-tr-sm"
                      : "bg-[#1C2026] text-[#C8D0DA] rounded-tl-sm",
                  ].join(" ")}>
                    {c.body}
                  </div>
                  <span className="text-[10px] text-[#3D4A5C] px-1">
                    {isOwn ? "You" : (c.author?.fullName ?? c.authorRole)}
                    {" · "}
                    {new Date(c.createdAt).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}
                    {" · "}
                    {new Date(c.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                  </span>
                </div>
              </li>
            )
          })}
        </ul>
      )}

      {/* Input */}
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="Write a message…"
          className={[
            "flex-1 rounded-xl border border-white/10 bg-[#1C2026] text-white placeholder:text-[#546072]",
            "px-4 py-2.5 text-sm",
            "focus:outline-none focus:ring-2 focus:ring-[#FF5A1F]/40 focus:border-[#FF5A1F]/60",
          ].join(" ")}
          disabled={loading}
          maxLength={2000}
        />
        <button
          type="submit"
          disabled={loading || !body.trim()}
          aria-label="Send message"
          className="px-4 py-2.5 rounded-xl bg-[#FF5A1F] text-white hover:bg-[#E54A15] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
        </button>
      </form>

      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  )
}

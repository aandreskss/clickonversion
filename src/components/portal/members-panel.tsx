"use client"

import { useState } from "react"
import type { OrgMember, OrgInvitation, OrgMemberRole } from "@/types/portal"
import { Loader2, UserPlus, Trash2, Crown, Shield, User } from "lucide-react"

interface Props {
  orgId:              string
  currentUserId:      string
  currentRole:        OrgMemberRole
  members:            Array<{
    id:   string
    role: string
    joined_at: string
    pf_platform_users: { id: string; email: string; full_name: string | null; avatar_url: string | null } | null
  }>
  pendingInvitations: Array<{
    id:         string
    email:      string
    role:       string
    status:     string
    expires_at: string
    created_at: string
  }>
  canManage: boolean
}

const ROLE_ICONS: Record<string, React.ReactNode> = {
  owner:  <Crown  size={12} className="text-[#F59E0B]" />,
  admin:  <Shield size={12} className="text-[#60A5FA]" />,
  member: <User   size={12} className="text-[#8A9099]"  />,
}

function Avatar({ name, email }: { name: string | null; email: string }) {
  const initials = (name ?? email).slice(0, 2).toUpperCase()
  return (
    <div className="w-8 h-8 rounded-full bg-[#FF5A1F]/20 flex items-center justify-center text-xs font-bold text-[#FF5A1F] shrink-0">
      {initials}
    </div>
  )
}

export function MembersPanel({
  orgId, currentUserId, currentRole, members: initialMembers,
  pendingInvitations: initialInvites, canManage,
}: Props) {
  const [members,  setMembers]  = useState(initialMembers)
  const [invites,  setInvites]  = useState(initialInvites)
  const [email,    setEmail]    = useState("")
  const [role,     setRole]     = useState<"admin" | "member">("member")
  const [inviting, setInviting] = useState(false)
  const [error,    setError]    = useState<string | null>(null)
  const [success,  setSuccess]  = useState<string | null>(null)

  async function handleInvite(e: React.FormEvent) {
    e.preventDefault()
    const trimmed = email.trim().toLowerCase()
    if (!trimmed) return

    setInviting(true)
    setError(null)
    setSuccess(null)

    const res = await fetch("/api/portal/org/invite", {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify({ email: trimmed, role }),
    })

    const data = await res.json() as { error?: string; id?: string; email?: string; role?: string; status?: string; expires_at?: string; created_at?: string }

    if (!res.ok) {
      setError(data.error ?? "Failed to send invitation.")
    } else {
      setSuccess(`Invitation sent to ${trimmed}.`)
      setEmail("")
      const newInvite = data as { id: string; email: string; role: string; status: string; expires_at: string; created_at: string }
      setInvites((prev) => [newInvite, ...prev.filter((i) => i.email !== trimmed)])
    }

    setInviting(false)
  }

  async function handleRemoveMember(memberId: string) {
    if (!confirm("Remove this member from the organization?")) return
    const res = await fetch(`/api/portal/org/members?memberId=${memberId}`, { method: "DELETE" })
    if (res.ok) {
      setMembers((prev) => prev.filter((m) => m.id !== memberId))
    } else {
      const data = await res.json() as { error?: string }
      setError(data.error ?? "Failed to remove member.")
    }
  }

  const isOwner = currentRole === "owner"

  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-base font-semibold text-white">Team members</h2>
        <p className="text-xs text-[#546072] mt-0.5">People with access to this organization.</p>
      </div>

      {/* Member list */}
      <div className="rounded-xl border border-white/8 bg-[#14171A] divide-y divide-white/6">
        {members.map((m) => {
          const user = m.pf_platform_users
          const isCurrentUser = user?.id === currentUserId
          const canRemove = canManage && !isCurrentUser && m.role !== "owner" && isOwner

          return (
            <div key={m.id} className="flex items-center gap-3 px-5 py-3.5">
              <Avatar name={user?.full_name ?? null} email={user?.email ?? "?"} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <p className="text-sm font-medium text-white truncate">
                    {user?.full_name ?? user?.email ?? "Unknown"}
                  </p>
                  {isCurrentUser && <span className="text-[10px] text-[#546072]">(you)</span>}
                </div>
                <p className="text-xs text-[#546072] truncate">{user?.email}</p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-white/5 border border-white/6">
                  {ROLE_ICONS[m.role] ?? ROLE_ICONS.member}
                  <span className="text-[11px] text-[#8A9099] capitalize">{m.role}</span>
                </div>
                {canRemove && (
                  <button
                    onClick={() => handleRemoveMember(m.id)}
                    aria-label="Remove member"
                    className="p-1.5 rounded-lg text-[#546072] hover:text-red-400 hover:bg-red-500/5 transition-colors"
                  >
                    <Trash2 size={13} />
                  </button>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Pending invitations */}
      {invites.length > 0 && (
        <div>
          <p className="text-xs font-medium text-[#546072] mb-2">Pending invitations</p>
          <div className="rounded-xl border border-white/6 bg-[#0D1117] divide-y divide-white/4">
            {invites.map((inv) => (
              <div key={inv.id} className="flex items-center justify-between px-5 py-3">
                <div>
                  <p className="text-sm text-white">{inv.email}</p>
                  <p className="text-xs text-[#546072] mt-0.5">
                    <span className="capitalize">{inv.role}</span>
                    {" · expires "}
                    {new Date(inv.expires_at).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                  </p>
                </div>
                <span className="text-[10px] text-[#F59E0B] bg-[#F59E0B]/10 px-2 py-0.5 rounded-full">Pending</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Invite form */}
      {canManage && (
        <div className="rounded-xl border border-white/8 bg-[#14171A] p-5 space-y-4">
          <div className="flex items-center gap-2">
            <UserPlus size={15} className="text-[#FF5A1F]" />
            <h3 className="text-sm font-semibold text-white">Invite a teammate</h3>
          </div>
          <form onSubmit={handleInvite} className="flex gap-2">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="colleague@company.com"
              disabled={inviting}
              required
              className={[
                "flex-1 rounded-xl border border-white/10 bg-[#0D1117] text-white placeholder:text-[#546072]",
                "px-4 py-2.5 text-sm",
                "focus:outline-none focus:ring-2 focus:ring-[#FF5A1F]/40 focus:border-[#FF5A1F]/60",
                "disabled:opacity-60",
              ].join(" ")}
            />
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as "admin" | "member")}
              disabled={inviting}
              className={[
                "rounded-xl border border-white/10 bg-[#0D1117] text-white",
                "px-3 py-2.5 text-sm",
                "focus:outline-none focus:ring-2 focus:ring-[#FF5A1F]/40",
                "disabled:opacity-60",
              ].join(" ")}
            >
              <option value="member">Member</option>
              <option value="admin">Admin</option>
            </select>
            <button
              type="submit"
              disabled={inviting || !email.trim()}
              className="px-4 py-2.5 rounded-xl bg-[#FF5A1F] text-white text-sm font-medium hover:bg-[#E54A15] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shrink-0"
            >
              {inviting ? <Loader2 size={14} className="animate-spin" /> : <UserPlus size={14} />}
              {inviting ? "Sending…" : "Invite"}
            </button>
          </form>
          {error   && <p className="text-xs text-red-400">{error}</p>}
          {success && <p className="text-xs text-[#22C55E]">{success}</p>}
        </div>
      )}
    </section>
  )
}

"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Bell, ChevronRight } from "lucide-react"
import type { PortalNotification } from "@/types/portal"

interface PortalHeaderProps {
  userName: string
  orgName:  string
  orgId:    string
}

export function PortalHeader({ userName, orgName }: PortalHeaderProps) {
  const [notifications, setNotifications] = useState<PortalNotification[]>([])
  const [open, setOpen]                   = useState(false)

  useEffect(() => {
    fetch("/api/portal/notifications")
      .then((r) => r.json())
      .then((data: PortalNotification[]) => setNotifications(data))
      .catch(() => {/* non-fatal */})
  }, [])

  const unreadCount = notifications.filter((n) => !n.isRead).length

  async function handleBellClick() {
    setOpen((o) => !o)
    if (unreadCount > 0) {
      await fetch("/api/portal/notifications", { method: "PATCH" })
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })))
    }
  }

  return (
    <header className="sticky top-0 z-40 bg-[#0B0D0F]/80 backdrop-blur border-b border-white/6 flex items-center justify-between px-6 h-14">
      <p className="text-sm text-[#546072] hidden sm:block">
        {orgName}
      </p>

      <div className="relative ml-auto">
        <button
          onClick={handleBellClick}
          aria-label="Notifications"
          className="relative flex items-center justify-center w-9 h-9 rounded-lg text-[#8A9099] hover:text-white hover:bg-white/5 transition-colors"
        >
          <Bell size={18} />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#FF5A1F]" />
          )}
        </button>

        {open && notifications.length > 0 && (
          <div className="absolute right-0 mt-2 w-80 bg-[#14171A] border border-white/10 rounded-xl shadow-xl overflow-hidden z-50">
            <div className="px-4 py-3 border-b border-white/6 flex items-center justify-between">
              <span className="text-sm font-semibold text-white">Notifications</span>
              <button onClick={() => setOpen(false)} className="text-xs text-[#546072] hover:text-white">Dismiss</button>
            </div>
            <ul className="divide-y divide-white/5 max-h-72 overflow-y-auto">
              {notifications.slice(0, 10).map((n) => (
                <li key={n.id}>
                  {n.link ? (
                    <Link
                      href={n.link}
                      onClick={() => setOpen(false)}
                      className="flex items-start gap-3 px-4 py-3 hover:bg-white/4 transition-colors"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-white font-medium truncate">{n.title}</p>
                        <p className="text-xs text-[#546072] truncate">{n.body}</p>
                      </div>
                      <ChevronRight size={14} className="text-[#546072] mt-0.5 shrink-0" />
                    </Link>
                  ) : (
                    <div className="flex items-start gap-3 px-4 py-3">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-white font-medium truncate">{n.title}</p>
                        <p className="text-xs text-[#546072] truncate">{n.body}</p>
                      </div>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </header>
  )
}

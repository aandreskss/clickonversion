"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Loader2, Eye, EyeOff } from "lucide-react"

interface TogglePublishButtonProps {
  serviceId: string
  isPublished: boolean
}

export function TogglePublishButton({ serviceId, isPublished }: TogglePublishButtonProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [current, setCurrent] = useState(isPublished)

  async function handleToggle() {
    setLoading(true)
    try {
      const res = await fetch(`/api/admin/commercial/catalog/${serviceId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isPublished: !current }),
      })
      if (res.ok) {
        setCurrent((v) => !v)
        router.refresh()
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      type="button"
      onClick={handleToggle}
      disabled={loading}
      className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors disabled:opacity-50 ${
        current
          ? "border-[#EF4444]/30 text-[#EF4444] hover:bg-[#EF4444]/10"
          : "border-[#22C55E]/30 text-[#22C55E] hover:bg-[#22C55E]/10"
      }`}
    >
      {loading ? (
        <Loader2 className="w-3.5 h-3.5 animate-spin" />
      ) : current ? (
        <EyeOff className="w-3.5 h-3.5" />
      ) : (
        <Eye className="w-3.5 h-3.5" />
      )}
      {current ? "Despublicar" : "Publicar"}
    </button>
  )
}

"use client"

import { useState }     from "react"
import { useRouter }    from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Check, Loader2 } from "lucide-react"

export function TaskActions({ taskId }: { taskId: string }) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function complete() {
    setLoading(true)
    const supabase = createClient()
    await supabase
      .from("tasks")
      .update({ completed_at: new Date().toISOString() })
      .eq("id", taskId)
    setLoading(false)
    router.refresh()
  }

  return (
    <button
      onClick={complete}
      disabled={loading}
      className="w-5 h-5 rounded border-2 border-slate-300 hover:border-green-400 hover:bg-green-50 flex items-center justify-center flex-shrink-0 mt-0.5 transition-colors"
      aria-label="Mark task complete"
    >
      {loading
        ? <Loader2 size={11} className="text-slate-400 animate-spin" />
        : <Check size={11} className="text-transparent hover:text-green-500" />
      }
    </button>
  )
}

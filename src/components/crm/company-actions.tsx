"use client"

import { useState }     from "react"
import { useRouter }    from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { MoreHorizontal, CheckCircle, XCircle, Edit2, Loader2 } from "lucide-react"
import type { Company } from "@/types/database"

interface Props {
  company:       Company
  opportunityId?: string
}

export function CompanyActions({ company, opportunityId }: Props) {
  const [open,    setOpen]    = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  async function markWon() {
    if (!opportunityId) return
    setLoading(true)
    await supabase.from("opportunities").update({ stage: "WON", won_at: new Date().toISOString() }).eq("id", opportunityId)
    await supabase.from("companies").update({ lifecycle_status: "active_client" }).eq("id", company.id)
    await supabase.from("activities").insert({
      company_id:    company.id,
      opportunity_id: opportunityId,
      activity_type: "system",
      title:         "Opportunity marked Won",
    })
    setLoading(false)
    setOpen(false)
    router.refresh()
  }

  async function markLost() {
    if (!opportunityId) return
    setLoading(true)
    await supabase.from("opportunities").update({ stage: "LOST", lost_at: new Date().toISOString() }).eq("id", opportunityId)
    await supabase.from("activities").insert({
      company_id:    company.id,
      opportunity_id: opportunityId,
      activity_type: "system",
      title:         "Opportunity marked Lost",
    })
    setLoading(false)
    setOpen(false)
    router.refresh()
  }

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        disabled={loading}
        className="p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
        aria-label="Company actions"
        aria-expanded={open}
      >
        {loading ? <Loader2 size={18} className="animate-spin" /> : <MoreHorizontal size={18} />}
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-full mt-1 w-44 bg-white border border-slate-200 rounded-xl shadow-lg z-20 py-1">
            {opportunityId && (
              <>
                <button
                  onClick={markWon}
                  className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-green-600 hover:bg-green-50 transition-colors"
                >
                  <CheckCircle size={15} />
                  Mark Won
                </button>
                <button
                  onClick={markLost}
                  className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors"
                >
                  <XCircle size={15} />
                  Mark Lost
                </button>
                <div className="border-t border-slate-100 my-1" />
              </>
            )}
            <button
              onClick={() => setOpen(false)}
              className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-50 transition-colors"
            >
              <Edit2 size={15} />
              Edit (coming soon)
            </button>
          </div>
        </>
      )}
    </div>
  )
}

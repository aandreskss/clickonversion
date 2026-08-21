"use client"

import { useState }     from "react"
import { useRouter }    from "next/navigation"
import { useForm }      from "react-hook-form"
import { zodResolver }  from "@hookform/resolvers/zod"
import { activitySchema, type ActivityInput } from "@/lib/validations"
import { createClient } from "@/lib/supabase/client"
import { formatRelativeDate } from "@/lib/utils"
import { Plus, Loader2, FileText, Phone, Mail, Video, Users } from "lucide-react"
import type { Activity, ActivityType } from "@/types/database"

const TYPE_ICONS: Record<ActivityType, React.ElementType> = {
  note:     FileText,
  email:    Mail,
  call:     Phone,
  linkedin: Users,
  instagram: Users,
  loom:     Video,
  audit:    FileText,
  meeting:  Users,
  proposal: FileText,
  system:   FileText,
}

const TYPE_OPTIONS: { value: ActivityType; label: string }[] = [
  { value: "note",     label: "Note"     },
  { value: "email",    label: "Email"    },
  { value: "call",     label: "Call"     },
  { value: "linkedin", label: "LinkedIn" },
  { value: "loom",     label: "Loom"     },
  { value: "meeting",  label: "Meeting"  },
  { value: "proposal", label: "Proposal" },
]

interface Props {
  activities:    Activity[]
  companyId:     string
  opportunityId?: string
}

export function ActivityTimeline({ activities, companyId, opportunityId }: Props) {
  const [showForm, setShowForm] = useState(false)
  const [error,    setError]    = useState<string | null>(null)
  const router = useRouter()

  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<ActivityInput>({
    resolver: zodResolver(activitySchema),
    defaultValues: { activity_type: "note" },
  })

  async function onSubmit(data: ActivityInput) {
    setError(null)
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { data: membership } = await supabase
      .from("organization_members")
      .select("organization_id")
      .eq("user_id", user.id)
      .single()
    if (!membership) return

    const { error: insertErr } = await supabase.from("activities").insert({
      organization_id: membership.organization_id,
      company_id:      companyId,
      opportunity_id:  opportunityId ?? null,
      activity_type:   data.activity_type,
      title:           data.title,
      body:            data.body ?? null,
      occurred_at:     data.occurred_at ?? new Date().toISOString(),
      created_by:      user.id,
    })

    if (insertErr) { setError("Failed to save activity."); return }
    reset()
    setShowForm(false)
    router.refresh()
  }

  const inputClass = "w-full rounded-lg border border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 px-3.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF5A1F]/30 focus:border-[#FF5A1F]/60"

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-semibold text-slate-900">Activity Timeline</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-[#FF5A1F] text-white rounded-lg hover:bg-[#E54A15] transition-colors"
        >
          <Plus size={13} />
          Log Activity
        </button>
      </div>

      {/* Add form */}
      {showForm && (
        <form onSubmit={handleSubmit(onSubmit)} className="mb-5 p-4 rounded-lg border border-slate-200 bg-slate-50">
          <div className="grid gap-3">
            <div className="grid grid-cols-2 gap-3">
              <select {...register("activity_type")} className={`${inputClass} appearance-none cursor-pointer`}>
                {TYPE_OPTIONS.map((t) => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>
              <input type="datetime-local" {...register("occurred_at")} className={inputClass} />
            </div>
            <input {...register("title")} placeholder="Summary" className={inputClass} required />
            <textarea {...register("body")} rows={2} placeholder="Details (optional)" className={`${inputClass} resize-none`} />
            {error && <p className="text-xs text-red-500">{error}</p>}
            <div className="flex gap-2">
              <button type="submit" disabled={isSubmitting} className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold bg-[#FF5A1F] text-white rounded-lg hover:bg-[#E54A15] disabled:opacity-60">
                {isSubmitting && <Loader2 size={12} className="animate-spin" />}
                Save
              </button>
              <button type="button" onClick={() => { setShowForm(false); reset() }} className="px-4 py-2 text-xs font-medium text-slate-500 border border-slate-200 rounded-lg hover:bg-slate-50">
                Cancel
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Timeline */}
      {activities.length === 0 ? (
        <p className="text-sm text-slate-400 text-center py-8">No activity logged yet.</p>
      ) : (
        <div className="flex flex-col gap-4">
          {activities.map((activity, i) => {
            const Icon = TYPE_ICONS[activity.activity_type] ?? FileText
            return (
              <div key={activity.id} className="flex gap-3">
                <div className="flex flex-col items-center">
                  <div className="w-7 h-7 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center flex-shrink-0">
                    <Icon size={12} className="text-slate-500" />
                  </div>
                  {i < activities.length - 1 && <div className="w-px flex-1 bg-slate-100 mt-1" />}
                </div>
                <div className="pb-4">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-slate-900">{activity.title}</p>
                    <span className="text-xs text-slate-400">{formatRelativeDate(activity.occurred_at)}</span>
                  </div>
                  {activity.body && (
                    <p className="text-sm text-slate-600 mt-1 whitespace-pre-wrap">{activity.body}</p>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

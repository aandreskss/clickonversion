"use client"

import { useState }     from "react"
import { useRouter }    from "next/navigation"
import { useForm }      from "react-hook-form"
import { zodResolver }  from "@hookform/resolvers/zod"
import { companySchema, type CompanyInput } from "@/lib/validations"
import { createClient } from "@/lib/supabase/client"
import { normalizeDomain, normalizeName } from "@/lib/normalize"
import { ArrowLeft, Loader2 } from "lucide-react"
import Link from "next/link"

const INDUSTRIES = [
  "Cleaning", "Roofing", "HVAC", "Remodeling", "Landscaping",
  "Plumbing", "Pest Control", "Painting", "Electrical", "Other",
]

const SOURCES = [
  { value: "outbound_email", label: "Outbound Email" },
  { value: "linkedin",       label: "LinkedIn"        },
  { value: "instagram",      label: "Instagram"       },
  { value: "referral",       label: "Referral"        },
  { value: "organic_search", label: "Organic Search"  },
  { value: "google_ads",     label: "Google Ads"      },
  { value: "meta_ads",       label: "Meta Ads"        },
  { value: "growth_audit",   label: "Growth Audit"    },
  { value: "direct",         label: "Direct"          },
  { value: "other",          label: "Other"           },
]

export default function NewCompanyPage() {
  const router  = useRouter()
  const [error, setError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CompanyInput>({ resolver: zodResolver(companySchema) })

  async function onSubmit(data: CompanyInput) {
    setError(null)
    const supabase = createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { setError("Not authenticated"); return }

    // Get organization
    const { data: membership } = await supabase
      .from("organization_members")
      .select("organization_id")
      .eq("user_id", user.id)
      .single()
    if (!membership) { setError("No organization found"); return }

    const { data: company, error: insertError } = await supabase
      .from("companies")
      .insert({
        organization_id:  membership.organization_id,
        name:             data.name,
        normalized_name:  normalizeName(data.name),
        website:          data.website ?? null,
        normalized_domain: data.website ? normalizeDomain(data.website) : null,
        city:             data.city ?? null,
        state:            data.state ?? null,
        industry:         data.industry ?? null,
        phone:            data.phone ?? null,
        source:           data.source ?? null,
        lifecycle_status: data.lifecycle_status ?? "prospect",
        notes_summary:    data.notes_summary ?? null,
      })
      .select("id")
      .single()

    if (insertError || !company) {
      setError("Failed to create company. Please try again.")
      return
    }

    // Create opportunity automatically
    await supabase.from("opportunities").insert({
      organization_id: membership.organization_id,
      company_id:      company.id,
      name:            `${data.name} — Growth`,
      stage:           "NEW",
      source:          data.source ?? null,
    })

    router.push(`/app/companies/${company.id}`)
  }

  const inputClass = "w-full rounded-lg border border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF5A1F]/30 focus:border-[#FF5A1F]/60 hover:border-slate-300 transition-colors"

  return (
    <div className="p-6 lg:p-8 max-w-2xl mx-auto">
      <div className="mb-6">
        <Link href="/app/companies" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900 transition-colors mb-4">
          <ArrowLeft size={14} />
          Back to Companies
        </Link>
        <h1 className="text-2xl font-bold text-slate-900">Add Company</h1>
        <p className="text-sm text-slate-500 mt-1">Create a new prospect. An opportunity will be added automatically.</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-xl border border-slate-200 p-6">
        <div className="grid gap-5">
          {/* Name */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="name" className="text-sm font-medium text-slate-700">
              Company name <span className="text-[#FF5A1F]">*</span>
            </label>
            <input id="name" className={inputClass} placeholder="Sunrise Roofing" {...register("name")} />
            {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
          </div>

          {/* Website */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="website" className="text-sm font-medium text-slate-700">Website</label>
            <input id="website" className={inputClass} placeholder="sunriseroofing.com" {...register("website")} />
          </div>

          {/* City + State */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="city" className="text-sm font-medium text-slate-700">City</label>
              <input id="city" className={inputClass} placeholder="Miami" {...register("city")} />
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="state" className="text-sm font-medium text-slate-700">State</label>
              <input id="state" className={inputClass} placeholder="FL" maxLength={2} {...register("state")} />
            </div>
          </div>

          {/* Industry + Source */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="industry" className="text-sm font-medium text-slate-700">Industry</label>
              <select id="industry" className={`${inputClass} appearance-none cursor-pointer`} {...register("industry")}>
                <option value="">Select industry</option>
                {INDUSTRIES.map((i) => <option key={i} value={i}>{i}</option>)}
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="source" className="text-sm font-medium text-slate-700">Lead source</label>
              <select id="source" className={`${inputClass} appearance-none cursor-pointer`} {...register("source")}>
                <option value="">Select source</option>
                {SOURCES.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
              </select>
            </div>
          </div>

          {/* Phone */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="phone" className="text-sm font-medium text-slate-700">Phone</label>
            <input id="phone" type="tel" className={inputClass} placeholder="+1 (305) 000-0000" {...register("phone")} />
          </div>

          {/* Notes */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="notes_summary" className="text-sm font-medium text-slate-700">Initial notes</label>
            <textarea id="notes_summary" rows={3} className={`${inputClass} resize-none`} placeholder="Initial observations, context, or research summary…" {...register("notes_summary")} />
          </div>

          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-[#FF5A1F] text-white text-sm font-semibold rounded-lg hover:bg-[#E54A15] transition-colors disabled:opacity-60"
            >
              {isSubmitting && <Loader2 size={14} className="animate-spin" />}
              {isSubmitting ? "Creating…" : "Create Company"}
            </button>
            <Link
              href="/app/companies"
              className="px-5 py-2.5 text-sm font-medium text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
            >
              Cancel
            </Link>
          </div>
        </div>
      </form>
    </div>
  )
}

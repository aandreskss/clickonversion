"use client"

import { useState, useEffect } from "react"
import { useForm }   from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter }   from "next/navigation"
import Script from "next/script"
import { ArrowRight, Loader2 } from "lucide-react"
import { auditFormSchema, type AuditFormInput, BUDGET_RANGES, PRIMARY_GOALS } from "@/lib/validations"
import { analytics } from "@/lib/analytics"

const TURNSTILE_SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY

declare global {
  interface Window {
    onTurnstileToken?: (token: string) => void
  }
}

function getUTMParams() {
  if (typeof window === "undefined") return {}
  const sp = new URLSearchParams(window.location.search)
  return {
    utm_source:   sp.get("utm_source")   ?? undefined,
    utm_medium:   sp.get("utm_medium")   ?? undefined,
    utm_campaign: sp.get("utm_campaign") ?? undefined,
    utm_content:  sp.get("utm_content")  ?? undefined,
    utm_term:     sp.get("utm_term")     ?? undefined,
    landing_page: window.location.href,
    referrer:     document.referrer || undefined,
  }
}

export function AuditForm() {
  const router  = useRouter()
  const [serverError, setServerError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
  } = useForm<AuditFormInput>({
    resolver: zodResolver(auditFormSchema),
    defaultValues: { primary_goal: "" },
  })

  // Capture UTM params after mount
  useEffect(() => {
    const params = getUTMParams()
    Object.entries(params).forEach(([k, v]) => {
      if (v) setValue(k as keyof AuditFormInput, v)
    })
    analytics.auditStarted()
  }, [setValue])

  // Register Turnstile callback so the widget can set the token
  useEffect(() => {
    if (!TURNSTILE_SITE_KEY) return
    window.onTurnstileToken = (token: string) => {
      setValue("cf_turnstile_response", token)
    }
    return () => { delete window.onTurnstileToken }
  }, [setValue])

  async function onSubmit(data: AuditFormInput) {
    setServerError(null)
    try {
      const res = await fetch("/api/audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        setServerError((body as { error?: string }).error ?? "Submission failed. Please try again.")
        return
      }
      analytics.auditSubmitted()
      router.push("/thank-you")
    } catch {
      setServerError("Network error. Please check your connection and try again.")
    }
  }

  const inputClass = [
    "w-full rounded-lg border border-white/10 bg-[#1C2026] text-white placeholder:text-[#546072]",
    "px-3.5 py-2.5 text-sm transition-colors duration-150",
    "focus:outline-none focus:ring-2 focus:ring-[#FF5A1F]/40 focus:border-[#FF5A1F]/60",
    "hover:border-white/20",
  ].join(" ")

  return (
    <div className="max-w-2xl mx-auto">
      {TURNSTILE_SITE_KEY && (
        <Script
          src="https://challenges.cloudflare.com/turnstile/v0/api.js"
          strategy="lazyOnload"
        />
      )}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="rounded-2xl border border-white/8 bg-[#14171A] p-8 lg:p-10"
        noValidate
      >
        {/* Honeypot — hidden from humans, bots fill it */}
        <div className="hidden" aria-hidden="true">
          <label htmlFor="_hp">Leave this empty</label>
          <input id="_hp" tabIndex={-1} autoComplete="off" {...register("_hp")} />
        </div>

        {/* Hidden UTM fields */}
        <input type="hidden" {...register("utm_source")} />
        <input type="hidden" {...register("utm_medium")} />
        <input type="hidden" {...register("utm_campaign")} />
        <input type="hidden" {...register("utm_content")} />
        <input type="hidden" {...register("utm_term")} />
        <input type="hidden" {...register("landing_page")} />
        <input type="hidden" {...register("referrer")} />

        <div className="grid gap-5">
          {/* Name + Email */}
          <div className="grid sm:grid-cols-2 gap-5">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="first_name" className="text-sm font-medium text-[#B0B8C1]">
                First name <span className="text-[#FF5A1F]">*</span>
              </label>
              <input
                id="first_name"
                className={inputClass}
                placeholder="Alex"
                {...register("first_name")}
              />
              {errors.first_name && (
                <p className="text-xs text-red-400" role="alert">{errors.first_name.message}</p>
              )}
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="email" className="text-sm font-medium text-[#B0B8C1]">
                Email <span className="text-[#FF5A1F]">*</span>
              </label>
              <input
                id="email"
                type="email"
                className={inputClass}
                placeholder="alex@gmail.com"
                {...register("email")}
              />
              {errors.email && (
                <p className="text-xs text-red-400" role="alert">{errors.email.message}</p>
              )}
            </div>
          </div>

          {/* Company + Website */}
          <div className="grid sm:grid-cols-2 gap-5">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="company_name" className="text-sm font-medium text-[#B0B8C1]">
                Company name <span className="text-[#FF5A1F]">*</span>
              </label>
              <input
                id="company_name"
                className={inputClass}
                placeholder="Sunrise Cleaning Co."
                {...register("company_name")}
              />
              {errors.company_name && (
                <p className="text-xs text-red-400" role="alert">{errors.company_name.message}</p>
              )}
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="website_url" className="text-sm font-medium text-[#B0B8C1]">
                Website <span className="text-[#FF5A1F]">*</span>
              </label>
              <input
                id="website_url"
                type="url"
                className={inputClass}
                placeholder="yourcompany.com"
                {...register("website_url")}
              />
              {errors.website_url && (
                <p className="text-xs text-red-400" role="alert">{errors.website_url.message}</p>
              )}
            </div>
          </div>

          {/* Service + City */}
          <div className="grid sm:grid-cols-2 gap-5">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="main_service" className="text-sm font-medium text-[#B0B8C1]">
                Main service <span className="text-[#FF5A1F]">*</span>
              </label>
              <input
                id="main_service"
                className={inputClass}
                placeholder="HVAC, Roofing, Cleaning…"
                {...register("main_service")}
              />
              {errors.main_service && (
                <p className="text-xs text-red-400" role="alert">{errors.main_service.message}</p>
              )}
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="city" className="text-sm font-medium text-[#B0B8C1]">
                City / primary market <span className="text-[#FF5A1F]">*</span>
              </label>
              <input
                id="city"
                className={inputClass}
                placeholder="Miami, FL"
                {...register("city")}
              />
              {errors.city && (
                <p className="text-xs text-red-400" role="alert">{errors.city.message}</p>
              )}
            </div>
          </div>

          {/* Primary goal */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="primary_goal" className="text-sm font-medium text-[#B0B8C1]">
              Primary goal <span className="text-[#FF5A1F]">*</span>
            </label>
            <select
              id="primary_goal"
              className={`${inputClass} appearance-none cursor-pointer`}
              {...register("primary_goal")}
            >
              <option value="" disabled>Select your main goal</option>
              {PRIMARY_GOALS.map((g) => (
                <option key={g} value={g}>{g}</option>
              ))}
            </select>
            {errors.primary_goal && (
              <p className="text-xs text-red-400" role="alert">{errors.primary_goal.message}</p>
            )}
          </div>

          {/* Optional: Phone + Budget */}
          <div className="grid sm:grid-cols-2 gap-5">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="phone" className="text-sm font-medium text-[#B0B8C1]">
                Phone <span className="text-[#546072] font-normal">(optional)</span>
              </label>
              <input
                id="phone"
                type="tel"
                className={inputClass}
                placeholder="+1 (305) 000-0000"
                {...register("phone")}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="budget_range" className="text-sm font-medium text-[#B0B8C1]">
                Monthly marketing budget <span className="text-[#546072] font-normal">(optional)</span>
              </label>
              <select
                id="budget_range"
                className={`${inputClass} appearance-none cursor-pointer`}
                {...register("budget_range")}
              >
                <option value="">Select a range</option>
                {BUDGET_RANGES.map((r) => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Current challenge */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="current_challenge" className="text-sm font-medium text-[#B0B8C1]">
              Describe your biggest marketing challenge <span className="text-[#546072] font-normal">(optional)</span>
            </label>
            <textarea
              id="current_challenge"
              rows={3}
              className={`${inputClass} resize-none`}
              placeholder="E.g. we get traffic but almost no calls, or our Google Ads are expensive with few results…"
              {...register("current_challenge")}
            />
          </div>

          {/* Error */}
          {serverError && (
            <div className="rounded-lg border border-red-500/20 bg-red-500/8 px-4 py-3" role="alert">
              <p className="text-sm text-red-400">{serverError}</p>
            </div>
          )}

          {/* Turnstile bot challenge */}
          {TURNSTILE_SITE_KEY && (
            <div
              className="cf-turnstile"
              data-sitekey={TURNSTILE_SITE_KEY}
              data-callback="onTurnstileToken"
              data-theme="dark"
            />
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full inline-flex items-center justify-center gap-2 px-7 py-4 bg-[#FF5A1F] text-white font-semibold rounded-lg hover:bg-[#E54A15] transition-colors duration-150 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed text-base"
          >
            {isSubmitting ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Sending…
              </>
            ) : (
              <>
                Get My Free Growth Audit
                <ArrowRight size={18} />
              </>
            )}
          </button>
          <p className="text-xs text-[#3D4A5C] text-center">
            No spam. No obligation. We&apos;ll reach out within one business day.
          </p>
        </div>
      </form>
    </div>
  )
}

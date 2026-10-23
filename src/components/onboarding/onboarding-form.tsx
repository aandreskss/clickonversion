"use client"

import { useState } from "react"
import { CheckCircle } from "lucide-react"
import type { PreBriefField } from "@/types/meetings"

interface OnboardingFormProps {
  orderId:     string
  serviceId:   string
  clientEmail: string
  fields:      PreBriefField[]
  serviceName: string
  lang?:       "en" | "es"
}

type FormValues = Record<string, string | boolean>

export function OnboardingForm({
  orderId,
  serviceId,
  clientEmail,
  fields,
  serviceName,
  lang = "en",
}: OnboardingFormProps) {
  const [values, setValues]       = useState<FormValues>({})
  const [errors, setErrors]       = useState<Record<string, string>>({})
  const [loading, setLoading]     = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  function set(key: string, value: string | boolean) {
    setValues((prev) => ({ ...prev, [key]: value }))
    setErrors((prev) => { const next = { ...prev }; delete next[key]; return next })
  }

  function validate(): boolean {
    const next: Record<string, string> = {}
    for (const f of fields) {
      if (f.required && !values[f.key]) {
        next[f.key] = lang === "es" ? "Requerido" : "Required"
      }
    }
    setErrors(next)
    return Object.keys(next).length === 0
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!validate()) return

    setLoading(true)
    setSubmitError(null)

    try {
      const res = await fetch("/api/onboarding/submit", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ orderId, serviceId, clientEmail, responses: values }),
      })
      const data = await res.json() as { error?: string }
      if (!res.ok) {
        setSubmitError(data.error ?? (lang === "es" ? "Error al enviar" : "Submission failed"))
        return
      }
      setSubmitted(true)
    } catch {
      setSubmitError(lang === "es" ? "Error de red" : "Network error")
    } finally {
      setLoading(false)
    }
  }

  if (submitted) {
    return (
      <div className="flex flex-col items-center gap-4 py-12 text-center">
        <CheckCircle size={48} className="text-[--color-brand]" />
        <h2 className="text-xl font-semibold text-[--color-warm-white]">
          {lang === "es" ? "¡Formulario enviado!" : "Onboarding submitted!"}
        </h2>
        <p className="text-sm text-[--color-muted] max-w-sm">
          {lang === "es"
            ? "Nuestro equipo revisará tu información y se pondrá en contacto contigo pronto."
            : "Our team will review your information and reach out shortly."}
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6" noValidate>
      <div>
        <h2 className="text-xl font-semibold text-[--color-warm-white]">
          {lang === "es" ? `Onboarding: ${serviceName}` : `Onboarding: ${serviceName}`}
        </h2>
        <p className="mt-1 text-sm text-[--color-muted]">
          {lang === "es"
            ? "Responde las siguientes preguntas para que podamos empezar lo antes posible."
            : "Answer the following questions so we can get started as quickly as possible."}
        </p>
      </div>

      {fields.map((f) => {
        const label       = lang === "es" ? f.labelEs : f.labelEn
        const placeholder = lang === "es" ? f.placeholderEs : f.placeholderEn
        const error       = errors[f.key]

        if (f.type === "checkbox") {
          return (
            <div key={f.key} className="flex items-start gap-3">
              <input
                id={f.key}
                type="checkbox"
                checked={Boolean(values[f.key])}
                onChange={(e) => set(f.key, e.target.checked)}
                className="mt-0.5 w-4 h-4 rounded border-white/20 bg-white/5 accent-[--color-brand]"
              />
              <label htmlFor={f.key} className="text-sm text-[--color-warm-white] cursor-pointer">
                {label}
              </label>
            </div>
          )
        }

        return (
          <div key={f.key} className="space-y-1.5">
            <label htmlFor={f.key} className="block text-sm font-medium text-[--color-warm-white]">
              {label}
              {f.required && <span className="text-[--color-brand] ml-1">*</span>}
            </label>

            {f.type === "select" && f.options ? (
              <select
                id={f.key}
                value={String(values[f.key] ?? "")}
                onChange={(e) => set(f.key, e.target.value)}
                className={inputClass(!!error)}
              >
                <option value="">{lang === "es" ? "Selecciona..." : "Select..."}</option>
                {f.options.map((o) => (
                  <option key={o.value} value={o.value}>
                    {lang === "es" ? o.labelEs : o.labelEn}
                  </option>
                ))}
              </select>
            ) : f.type === "textarea" ? (
              <textarea
                id={f.key}
                rows={4}
                value={String(values[f.key] ?? "")}
                onChange={(e) => set(f.key, e.target.value)}
                placeholder={placeholder}
                className={inputClass(!!error)}
              />
            ) : (
              <input
                id={f.key}
                type={f.type === "url" ? "url" : f.type === "number" ? "number" : "text"}
                value={String(values[f.key] ?? "")}
                onChange={(e) => set(f.key, e.target.value)}
                placeholder={placeholder}
                className={inputClass(!!error)}
              />
            )}

            {error && <p className="text-xs text-[--color-danger]">{error}</p>}
          </div>
        )
      })}

      {submitError && (
        <p className="text-sm text-[--color-danger] bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-3">
          {submitError}
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full py-3 px-6 bg-[--color-brand] text-white font-semibold rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50"
      >
        {loading
          ? (lang === "es" ? "Enviando..." : "Submitting...")
          : (lang === "es" ? "Enviar onboarding →" : "Submit onboarding →")}
      </button>
    </form>
  )
}

function inputClass(hasError: boolean) {
  return [
    "w-full px-4 py-2.5 rounded-lg text-sm",
    "bg-white/5 border text-[--color-warm-white]",
    "placeholder:text-[--color-muted]",
    "focus:outline-none focus:ring-2 focus:ring-[--color-brand]/50",
    hasError ? "border-[--color-danger]" : "border-white/10",
  ].join(" ")
}

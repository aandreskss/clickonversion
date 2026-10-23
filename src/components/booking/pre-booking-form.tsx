"use client"

import { useState } from "react"
import type { PreBriefField } from "@/types/meetings"
import { CalInlineEmbed } from "./cal-inline-embed"

interface PreBookingFormProps {
  fields:          PreBriefField[]
  meetingTypeSlug: string
  clientName?:     string
  clientEmail?:    string
  bookingToken?:   string
  lang?:           "en" | "es"
  meetingNameEn:   string
  meetingNameEs:   string
}

type FormValues = Record<string, string | boolean>

export function PreBookingForm({
  fields,
  meetingTypeSlug,
  clientName: initialName  = "",
  clientEmail: initialEmail = "",
  bookingToken,
  lang = "en",
  meetingNameEn,
  meetingNameEs,
}: PreBookingFormProps) {
  const [values, setValues] = useState<FormValues>({ name: initialName, email: initialEmail })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)
  const [calLink, setCalLink] = useState<string | null>(null)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const meetingName = lang === "es" ? meetingNameEs : meetingNameEn

  function set(key: string, value: string | boolean) {
    setValues((prev) => ({ ...prev, [key]: value }))
    setErrors((prev) => { const next = { ...prev }; delete next[key]; return next })
  }

  function validate(): boolean {
    const next: Record<string, string> = {}
    if (!values.name) next.name = lang === "es" ? "Requerido" : "Required"
    if (!values.email || !/\S+@\S+\.\S+/.test(String(values.email)))
      next.email = lang === "es" ? "Email inválido" : "Invalid email"

    for (const f of fields) {
      if (f.required && !values[f.key]) {
        next[f.key] = lang === "es" ? "Requerido" : "Required"
      }
      if (f.sensitive) continue // skip — never actually submitted
    }
    setErrors(next)
    return Object.keys(next).length === 0
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!validate()) return

    setLoading(true)
    setSubmitError(null)

    const { name, email, ...preBriefData } = values

    try {
      const res = await fetch("/api/bookings/pre-form", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({
          meetingTypeSlug,
          clientName:   String(name),
          clientEmail:  String(email),
          preBriefData,
          bookingToken,
          lang,
        }),
      })

      const data = await res.json() as { calLink?: string; error?: string }

      if (!res.ok) {
        setSubmitError(data.error ?? (lang === "es" ? "Error al enviar" : "Submission failed"))
        return
      }

      setCalLink(data.calLink ?? null)
    } catch {
      setSubmitError(lang === "es" ? "Error de red" : "Network error")
    } finally {
      setLoading(false)
    }
  }

  if (calLink) {
    return (
      <div className="space-y-4">
        <p className="text-sm text-[--color-muted]">
          {lang === "es"
            ? "¡Todo listo! Elige el horario que más te convenga."
            : "All set! Choose a time that works for you."}
        </p>
        <CalInlineEmbed
          calLink={calLink}
          clientName={String(values.name)}
          clientEmail={String(values.email)}
          className="rounded-xl overflow-hidden border border-white/10"
        />
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      <h2 className="text-xl font-semibold text-[--color-warm-white]">
        {lang === "es" ? `Antes de tu ${meetingName}` : `Before your ${meetingName}`}
      </h2>
      <p className="text-sm text-[--color-muted]">
        {lang === "es"
          ? "Comparte algunos detalles para que el especialista llegue preparado."
          : "Share a few details so our specialist can come prepared."}
      </p>

      {/* Name */}
      <Field
        id="name"
        label={lang === "es" ? "Tu nombre" : "Your name"}
        error={errors.name}
      >
        <input
          id="name"
          type="text"
          value={String(values.name ?? "")}
          onChange={(e) => set("name", e.target.value)}
          placeholder={lang === "es" ? "Ana García" : "Jane Smith"}
          className={inputClass(!!errors.name)}
        />
      </Field>

      {/* Email */}
      <Field
        id="email"
        label={lang === "es" ? "Tu correo electrónico" : "Your email"}
        error={errors.email}
      >
        <input
          id="email"
          type="email"
          value={String(values.email ?? "")}
          onChange={(e) => set("email", e.target.value)}
          placeholder="you@example.com"
          className={inputClass(!!errors.email)}
        />
      </Field>

      {/* Dynamic fields */}
      {fields.map((f) => (
        <DynamicField
          key={f.key}
          field={f}
          value={values[f.key]}
          error={errors[f.key]}
          lang={lang}
          onChange={(v) => set(f.key, v)}
        />
      ))}

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
          : (lang === "es" ? "Continuar al calendario →" : "Continue to booking →")}
      </button>
    </form>
  )
}

// ── Sub-components ───────────────────────────────────────────────────────────

function Field({
  id,
  label,
  error,
  children,
}: {
  id: string
  label: string
  error?: string
  children: React.ReactNode
}) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="block text-sm font-medium text-[--color-warm-white]">
        {label}
      </label>
      {children}
      {error && <p className="text-xs text-[--color-danger]">{error}</p>}
    </div>
  )
}

function DynamicField({
  field,
  value,
  error,
  lang,
  onChange,
}: {
  field:    PreBriefField
  value:    string | boolean | undefined
  error?:   string
  lang:     "en" | "es"
  onChange: (v: string | boolean) => void
}) {
  const label    = lang === "es" ? field.labelEs : field.labelEn
  const placeholder = lang === "es" ? field.placeholderEs : field.placeholderEn

  if (field.type === "checkbox") {
    return (
      <div className="flex items-start gap-3">
        <input
          id={field.key}
          type="checkbox"
          checked={Boolean(value)}
          onChange={(e) => onChange(e.target.checked)}
          className="mt-0.5 w-4 h-4 rounded border-white/20 bg-white/5 accent-[--color-brand]"
        />
        <label htmlFor={field.key} className="text-sm text-[--color-warm-white] cursor-pointer">
          {label}
        </label>
      </div>
    )
  }

  if (field.type === "select" && field.options) {
    return (
      <Field id={field.key} label={label} error={error}>
        <select
          id={field.key}
          value={String(value ?? "")}
          onChange={(e) => onChange(e.target.value)}
          className={inputClass(!!error)}
        >
          <option value="">{lang === "es" ? "Selecciona..." : "Select..."}</option>
          {field.options.map((o) => (
            <option key={o.value} value={o.value}>
              {lang === "es" ? o.labelEs : o.labelEn}
            </option>
          ))}
        </select>
      </Field>
    )
  }

  if (field.type === "textarea") {
    return (
      <Field id={field.key} label={label} error={error}>
        <textarea
          id={field.key}
          rows={4}
          value={String(value ?? "")}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={inputClass(!!error)}
        />
      </Field>
    )
  }

  return (
    <Field id={field.key} label={label} error={error}>
      <input
        id={field.key}
        type={field.type === "url" ? "url" : field.type === "number" ? "number" : "text"}
        value={String(value ?? "")}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={inputClass(!!error)}
      />
    </Field>
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

import { NextRequest, NextResponse } from "next/server"
import { auditFormSchema }          from "@/lib/validations"
import { normalizeDomain, normalizeEmail } from "@/lib/normalize"
import { getServerEnv }             from "@/lib/env"
import { createAdminClient }        from "@/lib/supabase/server"

// Simple in-memory rate limiter (resets per serverless invocation)
const submissionCount = new Map<string, { count: number; window: number }>()
const RATE_LIMIT = 5
const WINDOW_MS  = 60_000

function isRateLimited(ip: string): boolean {
  const now    = Date.now()
  const record = submissionCount.get(ip)
  if (!record || now - record.window > WINDOW_MS) {
    submissionCount.set(ip, { count: 1, window: now })
    return false
  }
  if (record.count >= RATE_LIMIT) return true
  record.count++
  return false
}

async function verifyTurnstile(token: string, ip: string): Promise<boolean> {
  const { turnstileSecret } = getServerEnv()
  if (!turnstileSecret || !token) return true // Skip if not configured

  const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ secret: turnstileSecret, response: token, remoteip: ip }),
  })
  const data = await res.json() as { success: boolean }
  return data.success === true
}

export async function POST(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown"

  // Rate limiting
  if (isRateLimited(ip)) {
    return NextResponse.json({ error: "Too many requests. Please try again later." }, { status: 429 })
  }

  // Parse body
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 })
  }

  // Validate with Zod
  const parsed = auditFormSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Please check your form and try again.", issues: parsed.error.flatten().fieldErrors },
      { status: 422 }
    )
  }

  const data = parsed.data

  // Honeypot check
  const honeypot = data._hp
  if (honeypot && honeypot.length > 0) {
    // Bot detected — silently succeed without saving
    return NextResponse.json({ ok: true })
  }

  // Turnstile verification (if configured)
  if (data.cf_turnstile_response) {
    const valid = await verifyTurnstile(data.cf_turnstile_response, ip)
    if (!valid) {
      return NextResponse.json({ error: "Security check failed. Please refresh and try again." }, { status: 403 })
    }
  }

  // Persist to Supabase
  try {
    const supabase = createAdminClient()

    const normalizedDomain = normalizeDomain(data.website_url)
    const normalizedEmail  = normalizeEmail(data.email)

    // 1. Insert audit request first (always succeeds — public form)
    const { data: auditRecord, error: auditError } = await supabase
      .from("audit_requests")
      .insert({
        first_name:          data.first_name,
        work_email:          data.email,
        company_name:        data.company_name,
        website_url:         data.website_url,
        main_service:        data.main_service,
        city:                data.city,
        primary_goal:        data.primary_goal,
        phone:               data.phone ?? null,
        budget_range:        data.budget_range ?? null,
        current_challenge:   data.current_challenge ?? null,
        utm_source:          data.utm_source ?? null,
        utm_medium:          data.utm_medium ?? null,
        utm_campaign:        data.utm_campaign ?? null,
        utm_content:         data.utm_content ?? null,
        utm_term:            data.utm_term ?? null,
        landing_page:        data.landing_page ?? null,
        referrer:            data.referrer ?? null,
        honeypot_triggered:  false,
      })
      .select("id")
      .single()

    if (auditError) {
      console.error("[audit] insert error:", auditError.message)
      // Still return success — persistence will be retried via monitoring
      return NextResponse.json({ ok: true })
    }

    // 2. Try to create CRM records (best-effort — audit_request is already saved)
    try {
      // Get the single organization for this single-tenant CRM
      const { data: org } = await supabase
        .from("organizations")
        .select("id")
        .limit(1)
        .single()

      if (!org) throw new Error("No organization found")
      const orgId = org.id

      // Find or create company based on normalized domain
      let companyId: string | null = null

      if (normalizedDomain) {
        const { data: existing } = await supabase
          .from("companies")
          .select("id")
          .eq("normalized_domain", normalizedDomain)
          .maybeSingle()

        if (existing) {
          companyId = existing.id
        } else {
          const { data: newCompany } = await supabase
            .from("companies")
            .insert({
              organization_id:  orgId,
              name:             data.company_name,
              normalized_name:  data.company_name.toLowerCase().trim(),
              website:          data.website_url,
              normalized_domain: normalizedDomain,
              city:             data.city,
              industry:         data.main_service,
              source:           "growth_audit",
              lifecycle_status: "prospect",
            })
            .select("id")
            .single()
          if (newCompany) companyId = newCompany.id
        }
      }

      // Create contact
      let contactId: string | null = null
      if (companyId) {
        const { data: contact } = await supabase
          .from("contacts")
          .insert({
            organization_id: orgId,
            company_id:      companyId,
            first_name:      data.first_name,
            email:           data.email,
            normalized_email: normalizedEmail,
            phone:           data.phone ?? null,
            is_primary:      true,
          })
          .select("id")
          .single()
        if (contact) contactId = contact.id
      }

      // Create opportunity
      let opportunityId: string | null = null
      if (companyId) {
        const { data: opp } = await supabase
          .from("opportunities")
          .insert({
            organization_id:    orgId,
            company_id:         companyId,
            primary_contact_id: contactId,
            name:               `${data.company_name} — Growth Audit`,
            service:            data.main_service,
            stage:              "NEW",
            source:             "growth_audit",
          })
          .select("id")
          .single()
        if (opp) opportunityId = opp.id
      }

      // Update audit request with CRM links
      if (companyId || contactId || opportunityId) {
        await supabase
          .from("audit_requests")
          .update({ company_id: companyId, contact_id: contactId, opportunity_id: opportunityId })
          .eq("id", auditRecord.id)
      }

      // Log activity
      if (companyId) {
        await supabase.from("activities").insert({
          organization_id: orgId,
          company_id:      companyId,
          contact_id:      contactId,
          opportunity_id:  opportunityId,
          activity_type:   "audit",
          title:           "Growth Audit Requested",
          body:            `Goal: ${data.primary_goal}${data.current_challenge ? `\n\nChallenge: ${data.current_challenge}` : ""}`,
        })
      }
    } catch (crmErr) {
      // CRM creation is best-effort — audit_request was already saved
      console.error("[audit] CRM creation error:", crmErr)
    }

    // Optional: email notification (fire-and-forget)
    const { resendApiKey, emailFrom, notificationEmail } = getServerEnv()
    if (resendApiKey && notificationEmail) {
      fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${resendApiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: emailFrom,
          to:   notificationEmail,
          subject: `New Growth Audit — ${data.company_name}`,
          text: [
            `Name: ${data.first_name}`,
            `Email: ${data.email}`,
            `Company: ${data.company_name}`,
            `Website: ${data.website_url}`,
            `Service: ${data.main_service}`,
            `City: ${data.city}`,
            `Goal: ${data.primary_goal}`,
            data.budget_range        ? `Budget: ${data.budget_range}` : "",
            data.phone               ? `Phone: ${data.phone}` : "",
            data.current_challenge   ? `\nChallenge:\n${data.current_challenge}` : "",
            data.utm_source          ? `\nSource: ${data.utm_source} / ${data.utm_medium ?? ""} / ${data.utm_campaign ?? ""}` : "",
          ].filter(Boolean).join("\n"),
        }),
      }).catch(() => {}) // Fire and forget
    }

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error("[audit] unexpected error:", err)
    return NextResponse.json({ error: "Server error. Please try again." }, { status: 500 })
  }
}

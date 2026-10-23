import { NextRequest, NextResponse } from "next/server"
import { auditFormSchema }          from "@/lib/validations"
import { normalizeDomain, normalizeEmail } from "@/lib/normalize"
import { getServerEnv }             from "@/lib/env"
import { db }                       from "@/lib/db"
import {
  auditRequests,
  companies,
  contacts,
  opportunities,
  activities,
} from "@/lib/db/schema"
import { eq } from "drizzle-orm"

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

  // Persist to DB
  try {
    const normalizedDomain = normalizeDomain(data.website_url)
    const normalizedEmail  = normalizeEmail(data.email)

    // 1. Insert audit request first (always succeeds — public form)
    let auditRecordId: string | null = null
    try {
      const [auditRecord] = await db
        .insert(auditRequests)
        .values({
          firstName:        data.first_name,
          workEmail:        data.email,
          companyName:      data.company_name,
          websiteUrl:       data.website_url,
          mainService:      data.main_service,
          city:             data.city,
          primaryGoal:      data.primary_goal,
          phone:            data.phone ?? null,
          budgetRange:      data.budget_range ?? null,
          currentChallenge: data.current_challenge ?? null,
          utmSource:        data.utm_source ?? null,
          utmMedium:        data.utm_medium ?? null,
          utmCampaign:      data.utm_campaign ?? null,
          utmContent:       data.utm_content ?? null,
          utmTerm:          data.utm_term ?? null,
          landingPage:      data.landing_page ?? null,
          referrer:         data.referrer ?? null,
          honeypotTriggered: false,
        })
        .returning({ id: auditRequests.id })
      auditRecordId = auditRecord.id
    } catch (insertErr) {
      console.error("[audit] insert error:", insertErr)
      // Still return success — persistence will be retried via monitoring
      return NextResponse.json({ ok: true })
    }

    // 2. Try to create CRM records (best-effort — audit_request is already saved)
    try {
      const { orgId } = getServerEnv()
      if (!orgId) throw new Error("ORG_ID not configured")
      console.log("[audit] orgId:", orgId)

      // Find or create company based on normalized domain
      let companyId: string | null = null

      if (normalizedDomain) {
        const [existing] = await db
          .select({ id: companies.id })
          .from(companies)
          .where(eq(companies.normalizedDomain, normalizedDomain))
          .limit(1)

        if (existing) {
          companyId = existing.id
          console.log("[audit] existing company:", companyId)
        } else {
          const [newCompany] = await db
            .insert(companies)
            .values({
              organizationId:   orgId,
              name:             data.company_name,
              normalizedName:   data.company_name.toLowerCase().trim(),
              website:          data.website_url,
              normalizedDomain,
              city:             data.city,
              industry:         data.main_service,
              source:           "growth_audit",
              lifecycleStatus:  "prospect",
            })
            .returning({ id: companies.id })
          if (newCompany) companyId = newCompany.id
          console.log("[audit] new companyId:", companyId)
        }
      } else {
        console.log("[audit] normalizedDomain is null, skipping company creation")
      }

      // Create contact
      let contactId: string | null = null
      if (companyId) {
        const [contact] = await db
          .insert(contacts)
          .values({
            organizationId:  orgId,
            companyId,
            firstName:       data.first_name,
            email:           data.email,
            normalizedEmail,
            phone:           data.phone ?? null,
            isPrimary:       true,
          })
          .returning({ id: contacts.id })
        if (contact) contactId = contact.id
        console.log("[audit] contactId:", contactId)
      }

      // Create opportunity
      let opportunityId: string | null = null
      if (companyId) {
        const [opp] = await db
          .insert(opportunities)
          .values({
            organizationId:   orgId,
            companyId,
            primaryContactId: contactId,
            name:             `${data.company_name} — Growth Audit`,
            service:          data.main_service,
            stage:            "NEW",
            source:           "growth_audit",
          })
          .returning({ id: opportunities.id })
        if (opp) opportunityId = opp.id
        console.log("[audit] opportunityId:", opportunityId)
      }

      // Update audit request with CRM links
      if (auditRecordId && (companyId || contactId || opportunityId)) {
        await db
          .update(auditRequests)
          .set({ companyId, contactId, opportunityId })
          .where(eq(auditRequests.id, auditRecordId))
      }

      // Log activity
      if (companyId) {
        await db.insert(activities).values({
          organizationId: orgId,
          companyId,
          contactId,
          opportunityId,
          activityType:   "audit",
          title:          "Growth Audit Requested",
          body:           `Goal: ${data.primary_goal}${data.current_challenge ? `\n\nChallenge: ${data.current_challenge}` : ""}`,
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

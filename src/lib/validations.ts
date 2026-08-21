import { z } from "zod"

// ── Audit Form ───────────────────────────────────────────────────────────────

export const auditFormSchema = z.object({
  first_name:    z.string().min(1, "First name is required").max(80).trim(),
  email:         z.string().email("Enter a valid email").max(254).trim().toLowerCase(),
  company_name:  z.string().min(1, "Company name is required").max(200).trim(),
  website_url:   z.string().min(1, "Website URL is required").max(500).trim(),
  main_service:  z.string().min(1, "Main service is required").max(100).trim(),
  city:          z.string().min(1, "City / market is required").max(100).trim(),
  primary_goal:  z.string().min(1, "Primary goal is required"),
  phone:         z.string().max(30).trim().optional(),
  budget_range:  z.string().optional(),
  current_challenge: z.string().max(1000).trim().optional(),
  // Honeypot — must be empty
  _hp:           z.string().max(0, "Invalid submission").optional(),
  // Attribution (captured client-side)
  utm_source:    z.string().max(200).optional(),
  utm_medium:    z.string().max(200).optional(),
  utm_campaign:  z.string().max(200).optional(),
  utm_content:   z.string().max(200).optional(),
  utm_term:      z.string().max(200).optional(),
  landing_page:  z.string().max(500).optional(),
  referrer:      z.string().max(500).optional(),
  // Turnstile token (if configured)
  cf_turnstile_response: z.string().optional(),
})

export type AuditFormInput = z.infer<typeof auditFormSchema>

export const BUDGET_RANGES = [
  "Not currently investing",
  "Under $1,000/mo",
  "$1,000–$3,000/mo",
  "$3,000–$10,000/mo",
  "$10,000+/mo",
] as const

export const PRIMARY_GOALS = [
  "More calls / leads",
  "Better Google visibility",
  "Improve Google Ads",
  "Improve website conversion",
  "Improve follow-up",
  "Understand what is not working",
  "Other",
] as const

// ── Company (CRM) ────────────────────────────────────────────────────────────

export const companySchema = z.object({
  name:     z.string().min(1, "Company name required").max(200).trim(),
  website:  z.string().max(500).trim().optional(),
  city:     z.string().max(100).trim().optional(),
  state:    z.string().max(100).trim().optional(),
  industry: z.string().max(100).trim().optional(),
  phone:    z.string().max(30).trim().optional(),
  source:   z.string().max(50).optional(),
  lifecycle_status: z.enum(["prospect","active_client","past_client","disqualified"]).optional(),
  notes_summary: z.string().max(2000).trim().optional(),
})

export type CompanyInput = z.infer<typeof companySchema>

// ── Opportunity (CRM) ────────────────────────────────────────────────────────

export const opportunitySchema = z.object({
  name:            z.string().min(1).max(200).trim(),
  service:         z.string().max(100).trim().optional(),
  stage:           z.enum(["NEW","QUALIFIED","CONTACTED","REPLIED","AUDIT_SENT","CALL_BOOKED","PROPOSAL","WON","LOST","NURTURE"]),
  source:          z.string().max(50).optional(),
  estimated_value: z.coerce.number().min(0).max(99999999).optional(),
  mrr_value:       z.coerce.number().min(0).max(99999).optional(),
  probability:     z.coerce.number().min(0).max(100).optional(),
  next_action:     z.string().max(500).trim().optional(),
  next_action_at:  z.string().optional(),
  audit_url:       z.string().max(500).optional(),
  loom_url:        z.string().max(500).optional(),
  proposal_url:    z.string().max(500).optional(),
  lost_reason:     z.string().max(500).trim().optional(),
  expected_close_date: z.string().optional(),
})

export type OpportunityInput = z.infer<typeof opportunitySchema>

// ── Contact (CRM) ────────────────────────────────────────────────────────────

export const contactSchema = z.object({
  first_name:    z.string().min(1).max(80).trim(),
  last_name:     z.string().max(80).trim().optional(),
  email:         z.string().email().max(254).trim().toLowerCase().optional().or(z.literal("")),
  phone:         z.string().max(30).trim().optional(),
  job_title:     z.string().max(100).trim().optional(),
  linkedin_url:  z.string().max(500).optional(),
  instagram_url: z.string().max(500).optional(),
  is_primary:    z.boolean().optional(),
})

export type ContactInput = z.infer<typeof contactSchema>

// ── Activity (CRM) ───────────────────────────────────────────────────────────

export const activitySchema = z.object({
  activity_type: z.enum(["note","email","call","linkedin","instagram","loom","audit","meeting","proposal","system"]),
  title:         z.string().min(1).max(300).trim(),
  body:          z.string().max(5000).trim().optional(),
  occurred_at:   z.string().optional(),
})

export type ActivityInput = z.infer<typeof activitySchema>

// ── Task (CRM) ───────────────────────────────────────────────────────────────

export const taskSchema = z.object({
  title:       z.string().min(1).max(300).trim(),
  description: z.string().max(2000).trim().optional(),
  due_at:      z.string().optional(),
  priority:    z.enum(["low","normal","high"]).default("normal"),
})

export type TaskInput = z.infer<typeof taskSchema>

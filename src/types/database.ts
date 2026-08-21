export type Json = string | number | boolean | null | { [key: string]: Json } | Json[]

export type OpportunityStage =
  | "NEW" | "QUALIFIED" | "CONTACTED" | "REPLIED"
  | "AUDIT_SENT" | "CALL_BOOKED" | "PROPOSAL"
  | "WON" | "LOST" | "NURTURE"

export type LifecycleStatus = "prospect" | "active_client" | "past_client" | "disqualified"
export type OrgRole = "owner" | "admin" | "member"
export type ActivityType = "note" | "email" | "call" | "linkedin" | "instagram" | "loom" | "audit" | "meeting" | "proposal" | "system"
export type TaskPriority = "low" | "normal" | "high"

export type LeadSource =
  | "outbound_email" | "linkedin" | "instagram" | "referral"
  | "organic_search" | "google_ads" | "meta_ads" | "growth_audit"
  | "partner" | "direct" | "other"

export interface Organization {
  id: string
  name: string
  slug: string
  created_at: string
  updated_at: string
}

export interface OrganizationMember {
  organization_id: string
  user_id: string
  role: OrgRole
  created_at: string
}

export interface Company {
  id: string
  organization_id: string
  name: string
  normalized_name: string | null
  website: string | null
  normalized_domain: string | null
  phone: string | null
  industry: string | null
  city: string | null
  state: string | null
  country: string
  source: string | null
  lifecycle_status: LifecycleStatus
  google_reviews_count: number | null
  notes_summary: string | null
  created_at: string
  updated_at: string
}

export interface Contact {
  id: string
  organization_id: string
  company_id: string | null
  first_name: string
  last_name: string | null
  job_title: string | null
  email: string | null
  normalized_email: string | null
  phone: string | null
  linkedin_url: string | null
  instagram_url: string | null
  is_primary: boolean
  created_at: string
  updated_at: string
}

export interface Opportunity {
  id: string
  organization_id: string
  company_id: string
  primary_contact_id: string | null
  name: string
  service: string | null
  stage: OpportunityStage
  source: string | null
  estimated_value: number | null
  mrr_value: number | null
  probability: number | null
  first_contacted_at: string | null
  last_contacted_at: string | null
  next_action: string | null
  next_action_at: string | null
  audit_url: string | null
  loom_url: string | null
  proposal_url: string | null
  proposal_sent_at: string | null
  expected_close_date: string | null
  won_at: string | null
  lost_at: string | null
  lost_reason: string | null
  created_at: string
  updated_at: string
}

export interface Activity {
  id: string
  organization_id: string
  company_id: string | null
  contact_id: string | null
  opportunity_id: string | null
  activity_type: ActivityType
  title: string
  body: string | null
  occurred_at: string
  created_by: string | null
  created_at: string
}

export interface Task {
  id: string
  organization_id: string
  company_id: string | null
  opportunity_id: string | null
  title: string
  description: string | null
  due_at: string | null
  completed_at: string | null
  priority: TaskPriority
  assigned_to: string | null
  created_at: string
}

export interface AuditRequest {
  id: string
  organization_id: string | null
  first_name: string
  work_email: string
  company_name: string
  website_url: string
  main_service: string
  city: string
  primary_goal: string
  phone: string | null
  budget_range: string | null
  current_challenge: string | null
  utm_source: string | null
  utm_medium: string | null
  utm_campaign: string | null
  utm_content: string | null
  utm_term: string | null
  landing_page: string | null
  referrer: string | null
  honeypot_triggered: boolean
  company_id: string | null
  contact_id: string | null
  opportunity_id: string | null
  created_at: string
}

export interface ProspectResearch {
  id: string
  organization_id: string
  company_id: string
  seo_issues: string | null
  google_business_issues: string | null
  ads_issues: string | null
  website_issues: string | null
  conversion_issues: string | null
  opportunity_summary: string | null
  personalization_notes: string | null
  created_at: string
  updated_at: string
}

// Rich join types used in UI
export interface CompanyWithOpportunity extends Company {
  opportunities?: Opportunity[]
  primary_contact?: Contact | null
}

export interface OpportunityWithCompany extends Opportunity {
  company: Company
  primary_contact?: Contact | null
}

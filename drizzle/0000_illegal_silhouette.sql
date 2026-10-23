CREATE TYPE "public"."admin_role" AS ENUM('owner', 'admin', 'manager', 'specialist');--> statement-breakpoint
CREATE TYPE "public"."platform_role" AS ENUM('admin', 'staff', 'client');--> statement-breakpoint
CREATE TYPE "public"."billing_period" AS ENUM('monthly', 'quarterly', 'annual', 'one_time');--> statement-breakpoint
CREATE TYPE "public"."price_type" AS ENUM('ONE_TIME', 'RECURRING', 'STARTING_AT', 'CUSTOM_QUOTE');--> statement-breakpoint
CREATE TYPE "public"."service_category" AS ENUM('seo', 'paid-media', 'automation', 'support');--> statement-breakpoint
CREATE TYPE "public"."order_status" AS ENUM('draft', 'pending_payment', 'partially_paid', 'paid', 'quote_pending', 'cancelled', 'refunded');--> statement-breakpoint
CREATE TYPE "public"."payment_provider" AS ENUM('stripe', 'paypal');--> statement-breakpoint
CREATE TYPE "public"."payment_status" AS ENUM('pending', 'processing', 'succeeded', 'failed', 'cancelled', 'refunded', 'partially_refunded');--> statement-breakpoint
CREATE TYPE "public"."payment_type_enum" AS ENUM('one_time', 'subscription_initial', 'subscription_renewal');--> statement-breakpoint
CREATE TYPE "public"."quote_status" AS ENUM('pending', 'in_review', 'proposal_sent', 'accepted', 'declined', 'expired');--> statement-breakpoint
CREATE TYPE "public"."subscription_status" AS ENUM('trialing', 'active', 'past_due', 'cancelled', 'unpaid', 'paused');--> statement-breakpoint
CREATE TYPE "public"."invitation_status" AS ENUM('pending', 'accepted', 'expired', 'cancelled');--> statement-breakpoint
CREATE TYPE "public"."org_member_role" AS ENUM('owner', 'admin', 'member');--> statement-breakpoint
CREATE TYPE "public"."milestone_status" AS ENUM('pending', 'in_progress', 'completed', 'cancelled');--> statement-breakpoint
CREATE TYPE "public"."request_priority" AS ENUM('low', 'normal', 'high', 'urgent');--> statement-breakpoint
CREATE TYPE "public"."request_status" AS ENUM('pending_onboarding', 'active', 'paused', 'completed', 'cancelled', 'pending_payment', 'queued', 'waiting_client', 'consultation_scheduled', 'in_progress', 'waiting_third_party', 'review', 'refunded');--> statement-breakpoint
CREATE TYPE "public"."document_category" AS ENUM('deliverable', 'attachment', 'contract', 'report', 'other');--> statement-breakpoint
CREATE TYPE "public"."booking_right_status" AS ENUM('unused', 'reserved', 'used', 'expired', 'cancelled');--> statement-breakpoint
CREATE TYPE "public"."meeting_status" AS ENUM('pending', 'scheduled', 'rescheduled', 'cancelled', 'completed', 'no_show');--> statement-breakpoint
CREATE TYPE "public"."onboarding_status" AS ENUM('pending', 'submitted', 'reviewed', 'complete');--> statement-breakpoint
CREATE TYPE "public"."reconciliation_status" AS ENUM('matched', 'discrepancy', 'manual_review', 'resolved');--> statement-breakpoint
CREATE TABLE "account" (
	"userId" text NOT NULL,
	"type" text NOT NULL,
	"provider" text NOT NULL,
	"providerAccountId" text NOT NULL,
	"refresh_token" text,
	"access_token" text,
	"expires_at" integer,
	"token_type" text,
	"scope" text,
	"id_token" text,
	"session_state" text,
	CONSTRAINT "account_provider_providerAccountId_pk" PRIMARY KEY("provider","providerAccountId")
);
--> statement-breakpoint
CREATE TABLE "session" (
	"sessionToken" text PRIMARY KEY NOT NULL,
	"userId" text NOT NULL,
	"expires" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text,
	"email" text NOT NULL,
	"emailVerified" timestamp,
	"image" text,
	"password" text,
	CONSTRAINT "user_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "verificationToken" (
	"identifier" text NOT NULL,
	"token" text NOT NULL,
	"expires" timestamp NOT NULL,
	CONSTRAINT "verificationToken_identifier_token_pk" PRIMARY KEY("identifier","token")
);
--> statement-breakpoint
CREATE TABLE "activities" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"organization_id" uuid NOT NULL,
	"company_id" uuid,
	"contact_id" uuid,
	"opportunity_id" uuid,
	"activity_type" text NOT NULL,
	"title" text NOT NULL,
	"body" text,
	"occurred_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_by" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "audit_requests" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"organization_id" uuid,
	"first_name" text NOT NULL,
	"work_email" text NOT NULL,
	"company_name" text NOT NULL,
	"website_url" text NOT NULL,
	"main_service" text NOT NULL,
	"city" text NOT NULL,
	"primary_goal" text NOT NULL,
	"phone" text,
	"budget_range" text,
	"current_challenge" text,
	"utm_source" text,
	"utm_medium" text,
	"utm_campaign" text,
	"utm_content" text,
	"utm_term" text,
	"landing_page" text,
	"referrer" text,
	"honeypot_triggered" boolean DEFAULT false NOT NULL,
	"company_id" uuid,
	"contact_id" uuid,
	"opportunity_id" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "companies" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"organization_id" uuid NOT NULL,
	"name" text NOT NULL,
	"normalized_name" text,
	"website" text,
	"normalized_domain" text,
	"phone" text,
	"industry" text,
	"city" text,
	"state" text,
	"country" text DEFAULT 'US' NOT NULL,
	"source" text,
	"lifecycle_status" text DEFAULT 'prospect' NOT NULL,
	"google_reviews_count" integer,
	"notes_summary" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "contacts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"organization_id" uuid NOT NULL,
	"company_id" uuid,
	"first_name" text NOT NULL,
	"last_name" text,
	"job_title" text,
	"email" text,
	"normalized_email" text,
	"phone" text,
	"linkedin_url" text,
	"instagram_url" text,
	"is_primary" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "opportunities" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"organization_id" uuid NOT NULL,
	"company_id" uuid NOT NULL,
	"primary_contact_id" uuid,
	"name" text NOT NULL,
	"service" text,
	"stage" text DEFAULT 'NEW' NOT NULL,
	"source" text,
	"estimated_value" numeric(12, 2),
	"mrr_value" numeric(12, 2),
	"probability" integer,
	"first_contacted_at" timestamp with time zone,
	"last_contacted_at" timestamp with time zone,
	"next_action" text,
	"next_action_at" timestamp with time zone,
	"audit_url" text,
	"loom_url" text,
	"proposal_url" text,
	"proposal_sent_at" timestamp with time zone,
	"expected_close_date" date,
	"won_at" timestamp with time zone,
	"lost_at" timestamp with time zone,
	"lost_reason" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "organization_members" (
	"organization_id" uuid NOT NULL,
	"user_id" text NOT NULL,
	"role" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "organization_members_organization_id_user_id_pk" PRIMARY KEY("organization_id","user_id")
);
--> statement-breakpoint
CREATE TABLE "organizations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"slug" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "organizations_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "prospect_research" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"organization_id" uuid NOT NULL,
	"company_id" uuid NOT NULL,
	"seo_issues" text,
	"google_business_issues" text,
	"ads_issues" text,
	"website_issues" text,
	"conversion_issues" text,
	"opportunity_summary" text,
	"personalization_notes" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "prospect_research_company_id_unique" UNIQUE("company_id")
);
--> statement-breakpoint
CREATE TABLE "tasks" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"organization_id" uuid NOT NULL,
	"company_id" uuid,
	"opportunity_id" uuid,
	"title" text NOT NULL,
	"description" text,
	"due_at" timestamp with time zone,
	"completed_at" timestamp with time zone,
	"priority" text DEFAULT 'normal' NOT NULL,
	"assigned_to" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "pf_platform_users" (
	"id" text PRIMARY KEY NOT NULL,
	"platform_role" "platform_role" DEFAULT 'client' NOT NULL,
	"admin_role" "admin_role",
	"display_name" text,
	"phone" text,
	"timezone" text DEFAULT 'America/New_York' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "pf_catalog_price_history" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"service_id" uuid NOT NULL,
	"price_id" uuid,
	"old_price_usd" numeric(10, 2),
	"new_price_usd" numeric(10, 2),
	"changed_by" text,
	"changed_by_email" text,
	"effective_date" text DEFAULT 'CURRENT_DATE' NOT NULL,
	"note" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "pf_service_catalog" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" text NOT NULL,
	"category" "service_category" NOT NULL,
	"name_en" text NOT NULL,
	"name_es" text NOT NULL,
	"description_en" text DEFAULT '' NOT NULL,
	"description_es" text DEFAULT '' NOT NULL,
	"is_published" boolean DEFAULT false NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"deliverables" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"requirements" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"onboarding_fields" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "pf_service_catalog_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "pf_service_prices" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"service_id" uuid NOT NULL,
	"name_en" text NOT NULL,
	"name_es" text NOT NULL,
	"price_type" "price_type" NOT NULL,
	"base_price_usd" numeric(10, 2),
	"billing_period_val" "billing_period",
	"stripe_price_id" text,
	"paypal_plan_id" text,
	"is_active" boolean DEFAULT true NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"creates_booking_right" boolean DEFAULT false NOT NULL,
	"booking_meeting_type_slug" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "pf_order_items" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"order_id" uuid NOT NULL,
	"service_id" uuid NOT NULL,
	"price_id" uuid,
	"quantity" numeric DEFAULT '1' NOT NULL,
	"unit_price_usd" numeric(10, 2) NOT NULL,
	"line_total_usd" numeric(10, 2) NOT NULL,
	"price_type" "price_type" NOT NULL,
	"billing_period_val" "billing_period",
	"service_name" text NOT NULL,
	"price_tier_name" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "pf_orders" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"order_number" text NOT NULL,
	"client_email" text NOT NULL,
	"client_name" text NOT NULL,
	"client_company" text,
	"user_id" text,
	"status" "order_status" DEFAULT 'draft' NOT NULL,
	"currency" text DEFAULT 'USD' NOT NULL,
	"subtotal_usd" numeric(10, 2) DEFAULT '0' NOT NULL,
	"tax_usd" numeric(10, 2) DEFAULT '0' NOT NULL,
	"total_usd" numeric(10, 2) DEFAULT '0' NOT NULL,
	"recurring_total_usd" numeric(10, 2) DEFAULT '0' NOT NULL,
	"items_snapshot" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"metadata" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "pf_orders_order_number_unique" UNIQUE("order_number")
);
--> statement-breakpoint
CREATE TABLE "pf_payment_audit" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"entity_type" text NOT NULL,
	"entity_id" uuid NOT NULL,
	"action" text NOT NULL,
	"actor" text,
	"previous_state" jsonb,
	"new_state" jsonb,
	"metadata" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "pf_payments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"order_id" uuid NOT NULL,
	"provider" "payment_provider" NOT NULL,
	"provider_payment_id" text,
	"provider_checkout_id" text,
	"amount_usd" numeric(10, 2) NOT NULL,
	"currency" text DEFAULT 'USD' NOT NULL,
	"status" "payment_status" DEFAULT 'pending' NOT NULL,
	"payment_type" "payment_type_enum" NOT NULL,
	"failure_code" text,
	"failure_message" text,
	"metadata" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "pf_quotes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"order_id" uuid,
	"client_email" text NOT NULL,
	"client_name" text NOT NULL,
	"client_company" text,
	"services_requested" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"status" "quote_status" DEFAULT 'pending' NOT NULL,
	"client_notes" text,
	"scope" text,
	"proposed_price_usd" numeric(10, 2),
	"proposal_notes" text,
	"payment_link" text,
	"proposal_sent_at" timestamp with time zone,
	"accepted_at" timestamp with time zone,
	"expires_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "pf_subscriptions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"order_id" uuid NOT NULL,
	"order_item_id" uuid NOT NULL,
	"provider" "payment_provider" NOT NULL,
	"provider_subscription_id" text NOT NULL,
	"status" "subscription_status" DEFAULT 'active' NOT NULL,
	"current_period_start" timestamp with time zone,
	"current_period_end" timestamp with time zone,
	"cancelled_at" timestamp with time zone,
	"metadata" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "pf_webhook_events" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"provider" "payment_provider" NOT NULL,
	"event_id" text NOT NULL,
	"event_type" text NOT NULL,
	"payload" jsonb NOT NULL,
	"processed" boolean DEFAULT false NOT NULL,
	"processed_at" timestamp with time zone,
	"error" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "pf_client_orgs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"slug" text NOT NULL,
	"logo_url" text,
	"billing_email" text,
	"stripe_customer_id" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "pf_client_orgs_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "pf_org_invitations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"org_id" uuid NOT NULL,
	"email" text NOT NULL,
	"role" "org_member_role" DEFAULT 'member' NOT NULL,
	"token" text NOT NULL,
	"invited_by" text,
	"status" "invitation_status" DEFAULT 'pending' NOT NULL,
	"accepted_at" timestamp with time zone,
	"expires_at" timestamp with time zone NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "pf_org_invitations_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "pf_org_members" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"org_id" uuid NOT NULL,
	"user_id" text NOT NULL,
	"role" "org_member_role" DEFAULT 'member' NOT NULL,
	"invited_by" text,
	"joined_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "pf_specialist_profiles" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"display_name" text NOT NULL,
	"bio" text,
	"timezone" text DEFAULT 'America/New_York' NOT NULL,
	"max_concurrent" integer DEFAULT 3 NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "pf_specialist_profiles_user_id_unique" UNIQUE("user_id")
);
--> statement-breakpoint
CREATE TABLE "pf_specialist_services" (
	"specialist_id" uuid NOT NULL,
	"service_id" uuid NOT NULL,
	"enabled" boolean DEFAULT true NOT NULL
);
--> statement-breakpoint
CREATE TABLE "pf_comments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"request_id" uuid NOT NULL,
	"author_id" text NOT NULL,
	"author_role" text NOT NULL,
	"body" text NOT NULL,
	"is_internal" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "pf_request_milestones" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"request_id" uuid NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"is_client_visible" boolean DEFAULT true NOT NULL,
	"status" "milestone_status" DEFAULT 'pending' NOT NULL,
	"due_date" date,
	"completed_at" timestamp with time zone,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "pf_request_status_log" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"request_id" uuid NOT NULL,
	"from_status" "request_status",
	"to_status" "request_status" NOT NULL,
	"changed_by" text,
	"changed_by_email" text,
	"note" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "pf_requests" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"org_id" uuid NOT NULL,
	"order_id" uuid,
	"order_item_id" uuid,
	"service_id" uuid,
	"service_name" text NOT NULL,
	"scope" text,
	"status" "request_status" DEFAULT 'pending_onboarding' NOT NULL,
	"priority" "request_priority" DEFAULT 'normal' NOT NULL,
	"assigned_specialist_id" uuid,
	"specialist_email" text,
	"blocked_reason" text,
	"waiting_info_message" text,
	"estimated_start" date,
	"started_at" timestamp with time zone,
	"completed_at" timestamp with time zone,
	"cancelled_at" timestamp with time zone,
	"refunded_at" timestamp with time zone,
	"internal_notes" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "pf_documents" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"org_id" uuid NOT NULL,
	"request_id" uuid,
	"storage_path" text NOT NULL,
	"file_name" text NOT NULL,
	"file_size_bytes" text NOT NULL,
	"mime_type" text NOT NULL,
	"uploaded_by" text NOT NULL,
	"is_client_visible" boolean DEFAULT true NOT NULL,
	"category" "document_category" DEFAULT 'other' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "pf_notifications" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"type" text NOT NULL,
	"title" text NOT NULL,
	"body" text NOT NULL,
	"link" text,
	"is_read" boolean DEFAULT false NOT NULL,
	"entity_type" text,
	"entity_id" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "pf_booking_rights" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"order_id" uuid NOT NULL,
	"order_item_id" uuid NOT NULL,
	"service_id" uuid NOT NULL,
	"meeting_type_slug" text NOT NULL,
	"client_email" text NOT NULL,
	"client_name" text NOT NULL,
	"token" text NOT NULL,
	"status" "booking_right_status" DEFAULT 'unused' NOT NULL,
	"max_uses" integer DEFAULT 1 NOT NULL,
	"uses_count" integer DEFAULT 0 NOT NULL,
	"meeting_id" uuid,
	"expires_at" timestamp with time zone NOT NULL,
	"used_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "pf_booking_rights_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "pf_meetings" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"booking_right_id" uuid,
	"order_id" uuid,
	"meeting_type_slug" text NOT NULL,
	"calcom_booking_uid" text,
	"calcom_event_type_id" integer,
	"client_email" text NOT NULL,
	"client_name" text NOT NULL,
	"client_timezone" text,
	"specialist_email" text,
	"start_time" timestamp with time zone,
	"end_time" timestamp with time zone,
	"video_call_url" text,
	"status" "meeting_status" DEFAULT 'pending' NOT NULL,
	"pre_brief_data" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"cancellation_reason" text,
	"rescheduled_from_id" uuid,
	"calcom_payload" jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "pf_meetings_calcom_booking_uid_unique" UNIQUE("calcom_booking_uid")
);
--> statement-breakpoint
CREATE TABLE "pf_onboarding_responses" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"order_id" uuid NOT NULL,
	"order_item_id" uuid,
	"service_id" uuid NOT NULL,
	"client_email" text NOT NULL,
	"responses" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"status" "onboarding_status" DEFAULT 'pending' NOT NULL,
	"submitted_at" timestamp with time zone,
	"reviewed_at" timestamp with time zone,
	"reviewed_by" text,
	"notes" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "pf_analytics_events" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"event_name" text NOT NULL,
	"user_id" text,
	"org_id" uuid,
	"order_id" uuid,
	"service_id" uuid,
	"session_id" text,
	"properties" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "pf_payment_reconciliation" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"order_id" uuid NOT NULL,
	"payment_id" uuid,
	"provider" "payment_provider" NOT NULL,
	"provider_amount" numeric(10, 2) NOT NULL,
	"internal_amount" numeric(10, 2) NOT NULL,
	"currency" text DEFAULT 'USD' NOT NULL,
	"discrepancy" numeric(10, 2) GENERATED ALWAYS AS (provider_amount - internal_amount) STORED,
	"status" "reconciliation_status" DEFAULT 'matched' NOT NULL,
	"notes" text,
	"resolved_by" text,
	"resolved_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "pf_app_waitlist" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" text NOT NULL,
	"app_slug" text DEFAULT 'synclead' NOT NULL,
	"source" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "account" ADD CONSTRAINT "account_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "session" ADD CONSTRAINT "session_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "activities" ADD CONSTRAINT "activities_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "activities" ADD CONSTRAINT "activities_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "activities" ADD CONSTRAINT "activities_contact_id_contacts_id_fk" FOREIGN KEY ("contact_id") REFERENCES "public"."contacts"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "activities" ADD CONSTRAINT "activities_opportunity_id_opportunities_id_fk" FOREIGN KEY ("opportunity_id") REFERENCES "public"."opportunities"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "activities" ADD CONSTRAINT "activities_created_by_user_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "audit_requests" ADD CONSTRAINT "audit_requests_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "audit_requests" ADD CONSTRAINT "audit_requests_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "audit_requests" ADD CONSTRAINT "audit_requests_contact_id_contacts_id_fk" FOREIGN KEY ("contact_id") REFERENCES "public"."contacts"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "audit_requests" ADD CONSTRAINT "audit_requests_opportunity_id_opportunities_id_fk" FOREIGN KEY ("opportunity_id") REFERENCES "public"."opportunities"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "companies" ADD CONSTRAINT "companies_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "contacts" ADD CONSTRAINT "contacts_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "contacts" ADD CONSTRAINT "contacts_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "opportunities" ADD CONSTRAINT "opportunities_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "opportunities" ADD CONSTRAINT "opportunities_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "opportunities" ADD CONSTRAINT "opportunities_primary_contact_id_contacts_id_fk" FOREIGN KEY ("primary_contact_id") REFERENCES "public"."contacts"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "organization_members" ADD CONSTRAINT "organization_members_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "organization_members" ADD CONSTRAINT "organization_members_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "prospect_research" ADD CONSTRAINT "prospect_research_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "prospect_research" ADD CONSTRAINT "prospect_research_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_opportunity_id_opportunities_id_fk" FOREIGN KEY ("opportunity_id") REFERENCES "public"."opportunities"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_assigned_to_user_id_fk" FOREIGN KEY ("assigned_to") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pf_platform_users" ADD CONSTRAINT "pf_platform_users_id_user_id_fk" FOREIGN KEY ("id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pf_catalog_price_history" ADD CONSTRAINT "pf_catalog_price_history_service_id_pf_service_catalog_id_fk" FOREIGN KEY ("service_id") REFERENCES "public"."pf_service_catalog"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pf_catalog_price_history" ADD CONSTRAINT "pf_catalog_price_history_price_id_pf_service_prices_id_fk" FOREIGN KEY ("price_id") REFERENCES "public"."pf_service_prices"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pf_catalog_price_history" ADD CONSTRAINT "pf_catalog_price_history_changed_by_pf_platform_users_id_fk" FOREIGN KEY ("changed_by") REFERENCES "public"."pf_platform_users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pf_service_prices" ADD CONSTRAINT "pf_service_prices_service_id_pf_service_catalog_id_fk" FOREIGN KEY ("service_id") REFERENCES "public"."pf_service_catalog"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pf_order_items" ADD CONSTRAINT "pf_order_items_order_id_pf_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."pf_orders"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pf_order_items" ADD CONSTRAINT "pf_order_items_service_id_pf_service_catalog_id_fk" FOREIGN KEY ("service_id") REFERENCES "public"."pf_service_catalog"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pf_order_items" ADD CONSTRAINT "pf_order_items_price_id_pf_service_prices_id_fk" FOREIGN KEY ("price_id") REFERENCES "public"."pf_service_prices"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pf_orders" ADD CONSTRAINT "pf_orders_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pf_payments" ADD CONSTRAINT "pf_payments_order_id_pf_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."pf_orders"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pf_quotes" ADD CONSTRAINT "pf_quotes_order_id_pf_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."pf_orders"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pf_subscriptions" ADD CONSTRAINT "pf_subscriptions_order_id_pf_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."pf_orders"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pf_subscriptions" ADD CONSTRAINT "pf_subscriptions_order_item_id_pf_order_items_id_fk" FOREIGN KEY ("order_item_id") REFERENCES "public"."pf_order_items"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pf_org_invitations" ADD CONSTRAINT "pf_org_invitations_org_id_pf_client_orgs_id_fk" FOREIGN KEY ("org_id") REFERENCES "public"."pf_client_orgs"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pf_org_invitations" ADD CONSTRAINT "pf_org_invitations_invited_by_pf_platform_users_id_fk" FOREIGN KEY ("invited_by") REFERENCES "public"."pf_platform_users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pf_org_members" ADD CONSTRAINT "pf_org_members_org_id_pf_client_orgs_id_fk" FOREIGN KEY ("org_id") REFERENCES "public"."pf_client_orgs"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pf_org_members" ADD CONSTRAINT "pf_org_members_user_id_pf_platform_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."pf_platform_users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pf_org_members" ADD CONSTRAINT "pf_org_members_invited_by_pf_platform_users_id_fk" FOREIGN KEY ("invited_by") REFERENCES "public"."pf_platform_users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pf_specialist_profiles" ADD CONSTRAINT "pf_specialist_profiles_user_id_pf_platform_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."pf_platform_users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pf_specialist_services" ADD CONSTRAINT "pf_specialist_services_specialist_id_pf_specialist_profiles_id_fk" FOREIGN KEY ("specialist_id") REFERENCES "public"."pf_specialist_profiles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pf_specialist_services" ADD CONSTRAINT "pf_specialist_services_service_id_pf_service_catalog_id_fk" FOREIGN KEY ("service_id") REFERENCES "public"."pf_service_catalog"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pf_comments" ADD CONSTRAINT "pf_comments_request_id_pf_requests_id_fk" FOREIGN KEY ("request_id") REFERENCES "public"."pf_requests"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pf_comments" ADD CONSTRAINT "pf_comments_author_id_pf_platform_users_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."pf_platform_users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pf_request_milestones" ADD CONSTRAINT "pf_request_milestones_request_id_pf_requests_id_fk" FOREIGN KEY ("request_id") REFERENCES "public"."pf_requests"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pf_request_status_log" ADD CONSTRAINT "pf_request_status_log_request_id_pf_requests_id_fk" FOREIGN KEY ("request_id") REFERENCES "public"."pf_requests"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pf_request_status_log" ADD CONSTRAINT "pf_request_status_log_changed_by_pf_platform_users_id_fk" FOREIGN KEY ("changed_by") REFERENCES "public"."pf_platform_users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pf_requests" ADD CONSTRAINT "pf_requests_org_id_pf_client_orgs_id_fk" FOREIGN KEY ("org_id") REFERENCES "public"."pf_client_orgs"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pf_requests" ADD CONSTRAINT "pf_requests_order_id_pf_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."pf_orders"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pf_requests" ADD CONSTRAINT "pf_requests_order_item_id_pf_order_items_id_fk" FOREIGN KEY ("order_item_id") REFERENCES "public"."pf_order_items"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pf_requests" ADD CONSTRAINT "pf_requests_service_id_pf_service_catalog_id_fk" FOREIGN KEY ("service_id") REFERENCES "public"."pf_service_catalog"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pf_requests" ADD CONSTRAINT "pf_requests_assigned_specialist_id_pf_specialist_profiles_id_fk" FOREIGN KEY ("assigned_specialist_id") REFERENCES "public"."pf_specialist_profiles"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pf_documents" ADD CONSTRAINT "pf_documents_org_id_pf_client_orgs_id_fk" FOREIGN KEY ("org_id") REFERENCES "public"."pf_client_orgs"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pf_documents" ADD CONSTRAINT "pf_documents_request_id_pf_requests_id_fk" FOREIGN KEY ("request_id") REFERENCES "public"."pf_requests"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pf_documents" ADD CONSTRAINT "pf_documents_uploaded_by_pf_platform_users_id_fk" FOREIGN KEY ("uploaded_by") REFERENCES "public"."pf_platform_users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pf_notifications" ADD CONSTRAINT "pf_notifications_user_id_pf_platform_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."pf_platform_users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pf_booking_rights" ADD CONSTRAINT "pf_booking_rights_order_id_pf_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."pf_orders"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pf_booking_rights" ADD CONSTRAINT "pf_booking_rights_order_item_id_pf_order_items_id_fk" FOREIGN KEY ("order_item_id") REFERENCES "public"."pf_order_items"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pf_booking_rights" ADD CONSTRAINT "pf_booking_rights_service_id_pf_service_catalog_id_fk" FOREIGN KEY ("service_id") REFERENCES "public"."pf_service_catalog"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pf_meetings" ADD CONSTRAINT "pf_meetings_booking_right_id_pf_booking_rights_id_fk" FOREIGN KEY ("booking_right_id") REFERENCES "public"."pf_booking_rights"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pf_meetings" ADD CONSTRAINT "pf_meetings_order_id_pf_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."pf_orders"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pf_onboarding_responses" ADD CONSTRAINT "pf_onboarding_responses_order_id_pf_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."pf_orders"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pf_onboarding_responses" ADD CONSTRAINT "pf_onboarding_responses_order_item_id_pf_order_items_id_fk" FOREIGN KEY ("order_item_id") REFERENCES "public"."pf_order_items"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pf_onboarding_responses" ADD CONSTRAINT "pf_onboarding_responses_service_id_pf_service_catalog_id_fk" FOREIGN KEY ("service_id") REFERENCES "public"."pf_service_catalog"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pf_analytics_events" ADD CONSTRAINT "pf_analytics_events_user_id_pf_platform_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."pf_platform_users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pf_analytics_events" ADD CONSTRAINT "pf_analytics_events_org_id_pf_client_orgs_id_fk" FOREIGN KEY ("org_id") REFERENCES "public"."pf_client_orgs"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pf_analytics_events" ADD CONSTRAINT "pf_analytics_events_order_id_pf_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."pf_orders"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pf_analytics_events" ADD CONSTRAINT "pf_analytics_events_service_id_pf_service_catalog_id_fk" FOREIGN KEY ("service_id") REFERENCES "public"."pf_service_catalog"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pf_payment_reconciliation" ADD CONSTRAINT "pf_payment_reconciliation_order_id_pf_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."pf_orders"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pf_payment_reconciliation" ADD CONSTRAINT "pf_payment_reconciliation_payment_id_pf_payments_id_fk" FOREIGN KEY ("payment_id") REFERENCES "public"."pf_payments"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pf_payment_reconciliation" ADD CONSTRAINT "pf_payment_reconciliation_resolved_by_pf_platform_users_id_fk" FOREIGN KEY ("resolved_by") REFERENCES "public"."pf_platform_users"("id") ON DELETE no action ON UPDATE no action;
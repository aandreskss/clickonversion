# ClicKonversion — Deployment Guide

## Overview

ClicKonversion deploys to:
- **Marketing site + CRM app**: Vercel (production URL: `clicKonversion.com` / app at `app.clicKonversion.com` or `/app` route)
- **Database + Auth**: Supabase (managed PostgreSQL + GoTrue auth)
- **DNS**: Cloudflare (recommended) or your registrar

This guide covers the complete process from zero to a live, production deployment.

---

## Prerequisites

Before starting, ensure you have:

- [ ] Node.js 20+ installed
- [ ] pnpm installed (`npm install -g pnpm`)
- [ ] Git repository initialized and pushed to GitHub/GitLab
- [ ] Domain purchased: `clickonversion.com` (verify exact spelling)
- [ ] Accounts created: Supabase, Vercel, Cloudflare (or registrar DNS access)
- [ ] Optional: Cal.com or Calendly account for booking link
- [ ] Optional: Google account for GA4 + Search Console
- [ ] Optional: Cloudflare Turnstile account for form protection

---

## 1. Supabase Setup

### 1.1 Create a New Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign in
2. Click **New Project**
3. Choose your organization
4. Fill in:
   - **Name**: `clickonversion-production`
   - **Database Password**: Generate a strong password and save it in your password manager
   - **Region**: `us-east-1` (or `us-west-2` depending on client base location)
5. Click **Create new project** and wait ~2 minutes for provisioning

### 1.2 Collect Connection Details

After provisioning, go to **Project Settings → API**:

| Value | Location | Variable Name |
|---|---|---|
| Project URL | API Settings → Project URL | `NEXT_PUBLIC_SUPABASE_URL` |
| `anon` public key | API Settings → Project API Keys | `NEXT_PUBLIC_SUPABASE_ANON_KEY` |
| `service_role` key | API Settings → Project API Keys | `SUPABASE_SERVICE_ROLE_KEY` |
| JWT Secret | API Settings → JWT Settings | `SUPABASE_JWT_SECRET` |
| Database password | Set during creation | `SUPABASE_DB_PASSWORD` |

> WARNING: Never expose `SUPABASE_SERVICE_ROLE_KEY` to the client. It bypasses RLS.

### 1.3 Run Database Migrations

Install the Supabase CLI if not already installed:
```bash
pnpm add -D supabase
```

Link your project:
```bash
pnpm supabase login
pnpm supabase link --project-ref YOUR_PROJECT_REF
```

The `PROJECT_REF` is found in Supabase Dashboard → Project Settings → General → Reference ID.

Push all migrations:
```bash
pnpm supabase db push
```

Verify in Supabase Dashboard → Table Editor that all tables are created with correct columns.

### 1.4 Create the First User (Admin)

The CRM is invite-only — no public sign-up page. Create the first user via the Supabase Dashboard:

1. Go to **Authentication → Users** in the Supabase Dashboard
2. Click **Invite user**
3. Enter your email address
4. Click **Send invitation**
5. Check your email and set a password

Alternatively, use the Supabase CLI:
```bash
# This creates a user directly without sending an email
pnpm supabase auth user create --email your@email.com --password 'YourSecurePassword123!'
```

### 1.5 Create the Organization Seed Record

After the first user is created, seed the organization record. Run this SQL in Supabase Dashboard → SQL Editor:

```sql
-- Replace values with your actual user ID and organization details
INSERT INTO organizations (
  id,
  name,
  slug,
  owner_id,
  booking_url
) VALUES (
  gen_random_uuid(),
  'ClicKonversion',
  'clickonversion',
  (SELECT id FROM auth.users WHERE email = 'your@email.com'),
  'https://cal.com/yourname/30min'  -- replace with your actual booking URL
);
```

Verify the insert worked:
```sql
SELECT * FROM organizations;
```

### 1.6 Verify RLS Policies

Test that RLS is working correctly. In SQL Editor, run:

```sql
-- This should return 0 rows (no authenticated user context)
SELECT * FROM companies;
```

If it returns data, RLS is not enabled properly. Check migrations.

### 1.7 Configure Auth Settings

In Supabase Dashboard → **Authentication → Settings**:

- **Site URL**: `https://clicKonversion.com`
- **Redirect URLs**: Add:
  - `https://clicKonversion.com/auth/callback`
  - `https://app.clicKonversion.com/auth/callback`
  - `http://localhost:3000/auth/callback` (for local development)
- **Email confirmations**: Set to **Required** for production
- **Disable sign-ups**: Set to **Enabled** (only invited users can create accounts)

---

## 2. Environment Variables

### 2.1 Complete Variable Reference

Create a `.env.local` file in the project root for local development. Never commit this file.

```bash
# =============================================================================
# SUPABASE (Required)
# =============================================================================

# Public URL and anon key — safe to expose to browser
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Service role key — NEVER use NEXT_PUBLIC_ prefix, NEVER expose to client
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# =============================================================================
# SITE (Required)
# =============================================================================

# The public URL of the site — no trailing slash
NEXT_PUBLIC_SITE_URL=https://clicKonversion.com

# =============================================================================
# ANALYTICS (Required for production, optional for dev)
# =============================================================================

# Google Analytics 4 Measurement ID (format: G-XXXXXXXXXX)
NEXT_PUBLIC_GA4_MEASUREMENT_ID=G-XXXXXXXXXX

# =============================================================================
# FORM PROTECTION (Recommended for production)
# =============================================================================

# Cloudflare Turnstile — Site Key (safe to expose)
NEXT_PUBLIC_TURNSTILE_SITE_KEY=0x4AAAAAAA...

# Cloudflare Turnstile — Secret Key (server-side only, never NEXT_PUBLIC_)
TURNSTILE_SECRET_KEY=0x4AAAAAAA...

# =============================================================================
# EMAIL NOTIFICATIONS (Optional — for audit request notifications)
# =============================================================================

# Resend API key for transactional email
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxx

# Where audit request notifications are sent (your email)
ADMIN_NOTIFICATION_EMAIL=your@email.com

# =============================================================================
# BOOKING (Optional — used in /thank-you page)
# =============================================================================

# Cal.com or Calendly URL shown after audit form submission
NEXT_PUBLIC_BOOKING_URL=https://cal.com/yourname/30min
```

### 2.2 Variable Classification

| Variable | Client | Server | Required |
|---|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Yes | Yes | Yes |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Yes | Yes | Yes |
| `SUPABASE_SERVICE_ROLE_KEY` | No | Yes | Yes |
| `NEXT_PUBLIC_SITE_URL` | Yes | Yes | Yes |
| `NEXT_PUBLIC_GA4_MEASUREMENT_ID` | Yes | No | Production |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | Yes | No | Recommended |
| `TURNSTILE_SECRET_KEY` | No | Yes | Recommended |
| `RESEND_API_KEY` | No | Yes | Optional |
| `ADMIN_NOTIFICATION_EMAIL` | No | Yes | Optional |
| `NEXT_PUBLIC_BOOKING_URL` | Yes | No | Optional |

---

## 3. Vercel Deployment

### 3.1 Install and Configure Vercel CLI

```bash
pnpm add -D vercel
pnpm vercel login
```

### 3.2 Link the Project to Vercel

```bash
pnpm vercel link
```

Follow the prompts:
- Set up and deploy? **Y**
- Which scope? Select your account or team
- Link to existing project? **N** (first time)
- Project name: `clickonversion`
- Directory: `./` (root of the project)

### 3.3 Add Environment Variables to Vercel

Add all production environment variables via the Vercel Dashboard or CLI.

**Via CLI (recommended for scripting):**
```bash
# Add each variable — Vercel will prompt for the value
pnpm vercel env add NEXT_PUBLIC_SUPABASE_URL production
pnpm vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production
pnpm vercel env add SUPABASE_SERVICE_ROLE_KEY production
pnpm vercel env add NEXT_PUBLIC_SITE_URL production
pnpm vercel env add NEXT_PUBLIC_GA4_MEASUREMENT_ID production
pnpm vercel env add NEXT_PUBLIC_TURNSTILE_SITE_KEY production
pnpm vercel env add TURNSTILE_SECRET_KEY production
pnpm vercel env add RESEND_API_KEY production
pnpm vercel env add ADMIN_NOTIFICATION_EMAIL production
pnpm vercel env add NEXT_PUBLIC_BOOKING_URL production
```

**Via Dashboard:**
1. Go to [vercel.com](https://vercel.com) → your project → **Settings → Environment Variables**
2. Add each variable with its value
3. Set environment scope: `Production` for live keys, `Preview` for test keys

### 3.4 Deploy to Production

```bash
pnpm vercel --prod
```

Or trigger via Git: push to your `main` branch — Vercel auto-deploys on push if connected to GitHub.

### 3.5 Verify the Deployment

1. Open the Vercel deployment URL (e.g., `https://clickonversion-git-main-yourteam.vercel.app`)
2. Check that the homepage loads
3. Check that `/audit` form renders correctly
4. Attempt to access `/app` — should redirect to `/login`
5. Log in with your Supabase credentials — should reach the CRM dashboard

---

## 4. Domain Configuration

### 4.1 Add Domains to Vercel

In Vercel Dashboard → your project → **Settings → Domains**:

Add the following domains:
- `clicKonversion.com` (primary)
- `www.clicKonversion.com` (redirect to apex)
- `app.clicKonversion.com` (if using subdomain for CRM)

Vercel will show you the DNS records needed for each domain.

### 4.2 DNS Records (Cloudflare Setup)

Log in to Cloudflare → select your domain → **DNS → Records**.

Add the following records:

#### Apex domain (`clicKonversion.com`)
| Type | Name | Content | Proxy |
|---|---|---|---|
| `A` | `@` | `76.76.21.21` | Proxied (orange cloud) |

Or use CNAME flattening:
| Type | Name | Content | Proxy |
|---|---|---|---|
| `CNAME` | `@` | `cname.vercel-dns.com` | Proxied |

#### WWW subdomain
| Type | Name | Content | Proxy |
|---|---|---|---|
| `CNAME` | `www` | `cname.vercel-dns.com` | Proxied |

#### App subdomain (if using `app.clicKonversion.com`)
| Type | Name | Content | Proxy |
|---|---|---|---|
| `CNAME` | `app` | `cname.vercel-dns.com` | Proxied |

> Note: Cloudflare proxy (`Proxied` / orange cloud) provides DDoS protection and hides your origin IP. Keep it enabled for all public-facing domains.

> Note: Vercel provides free SSL certificates via Let's Encrypt. With Cloudflare proxy enabled, set Cloudflare SSL mode to **Full (strict)** to avoid redirect loops.

### 4.3 SSL Configuration in Cloudflare

Go to Cloudflare → **SSL/TLS → Overview**:
- Set encryption mode to: **Full (strict)**

This ensures end-to-end encryption: browser → Cloudflare → Vercel.

### 4.4 Verify Domain Propagation

After adding DNS records, verify propagation (can take 1–48 hours, usually minutes with Cloudflare):

```bash
# Check A record
nslookup clicKonversion.com

# Check CNAME
nslookup www.clicKonversion.com

# Test HTTPS
curl -I https://clicKonversion.com
```

---

## 5. Google Analytics 4 Setup

### 5.1 Create GA4 Property

1. Go to [analytics.google.com](https://analytics.google.com)
2. Click **Admin** → **Create** → **Property**
3. Fill in:
   - Property name: `ClicKonversion`
   - Reporting time zone: `United States - Eastern Time` (or your local timezone)
   - Currency: `US Dollar`
4. Business details:
   - Industry: `Business and Industrial Markets`
   - Business size: `Small`
5. Business objectives: Select **Examine user behavior**
6. Click **Create** → accept terms

### 5.2 Get the Measurement ID

1. In GA4 → Admin → **Data Streams** → **Add stream** → **Web**
2. Enter:
   - Website URL: `https://clicKonversion.com`
   - Stream name: `ClicKonversion Web`
3. Click **Create stream**
4. Copy the **Measurement ID** (format: `G-XXXXXXXXXX`)
5. Add to Vercel env: `NEXT_PUBLIC_GA4_MEASUREMENT_ID=G-XXXXXXXXXX`

### 5.3 Events to Track

Implement these GA4 custom events in the application:

| Event Name | Trigger | Parameters |
|---|---|---|
| `audit_form_view` | User views `/audit` page | `page_location` |
| `audit_form_start` | User focuses on first field | — |
| `audit_form_submit` | Successful form submission | `industry`, `state` |
| `booking_link_click` | User clicks booking URL on `/thank-you` | — |
| `crm_opportunity_won` | Stage changed to WON | `mrr_value` (do NOT send PII) |
| `crm_stage_change` | Any pipeline stage change | `from_stage`, `to_stage` |

> CRITICAL: Never send PII (name, email, phone, company name) to GA4 events. Only send aggregate or categorical data.

### 5.4 Configure Conversion Events

In GA4 → Admin → **Conversions**:

Mark `audit_form_submit` and `booking_link_click` as conversion events.

---

## 6. Google Search Console Setup

### 6.1 Add Property

1. Go to [search.google.com/search-console](https://search.google.com/search-console)
2. Click **Add property**
3. Select **Domain** property type
4. Enter: `clicKonversion.com`

### 6.2 Verify Ownership via DNS

Google will provide a TXT record. Add it in Cloudflare:

| Type | Name | Content | Proxy |
|---|---|---|---|
| `TXT` | `@` | `google-site-verification=xxxxx...` | DNS only (gray cloud) |

Wait 1–5 minutes, then click **Verify** in Search Console.

### 6.3 Submit Sitemap

After the site is live:
1. In Search Console → **Sitemaps**
2. Enter: `https://clicKonversion.com/sitemap.xml`
3. Click **Submit**

The sitemap is auto-generated by Next.js via `src/app/sitemap.ts`.

---

## 7. Cloudflare Turnstile Setup

Turnstile protects the `/audit` form from bot submissions without requiring a CAPTCHA challenge for real users.

### 7.1 Create a Turnstile Widget

1. Go to [dash.cloudflare.com](https://dash.cloudflare.com) → **Turnstile**
2. Click **Add site**
3. Fill in:
   - Site name: `ClicKonversion Audit Form`
   - Domain: `clicKonversion.com`
   - Widget type: **Managed** (recommended — invisible for most users)
4. Click **Create**
5. Copy:
   - **Site Key** → `NEXT_PUBLIC_TURNSTILE_SITE_KEY`
   - **Secret Key** → `TURNSTILE_SECRET_KEY`

### 7.2 Implementation Notes

The Turnstile widget renders invisibly on the `/audit` form. On submission:
1. Client receives a token from Turnstile
2. Token is included in the form POST payload
3. Server Action verifies the token against `https://challenges.cloudflare.com/turnstile/v0/siteverify`
4. If verification fails, the form submission is rejected with a 403

Never skip server-side verification — client-only Turnstile can be bypassed.

---

## 8. Booking URL Configuration

### 8.1 Cal.com Setup (Recommended)

1. Sign up at [cal.com](https://cal.com)
2. Create an event type:
   - Name: `Growth Strategy Call`
   - Duration: `30 minutes`
   - Description: "Let's review your audit findings and map out a growth system for your business."
   - Location: Google Meet or Zoom
3. Copy your booking link (e.g., `https://cal.com/yourname/growth-strategy`)
4. Add to Vercel env: `NEXT_PUBLIC_BOOKING_URL=https://cal.com/yourname/growth-strategy`

### 8.2 Calendly Alternative

If using Calendly:
1. Sign up at [calendly.com](https://calendly.com)
2. Create a `30 Minute Meeting` event
3. Copy the URL (e.g., `https://calendly.com/yourname/30min`)
4. Add to Vercel env: `NEXT_PUBLIC_BOOKING_URL=https://calendly.com/yourname/30min`

The booking URL is displayed on `/thank-you` after a successful audit form submission and referenced in Supabase org settings (`organizations.booking_url`).

---

## 9. Post-Deploy Checklist

Run through this checklist after every production deployment and on initial launch.

### Functionality

- [ ] Homepage (`/`) loads in under 2 seconds
- [ ] Audit form (`/audit`) submits successfully — check Supabase `audit_requests` table
- [ ] `/thank-you` shows booking link
- [ ] `/login` renders and accepts valid credentials
- [ ] CRM dashboard (`/app`) loads with correct MRR display
- [ ] Pipeline board shows stage columns
- [ ] Creating a new company works
- [ ] Creating a new opportunity works
- [ ] Stage transitions work (drag or dropdown)
- [ ] Task creation and completion work
- [ ] Activity logging works
- [ ] `/privacy` and `/terms` render correctly

### Security

- [ ] Accessing `/app` without a session redirects to `/login`
- [ ] Supabase RLS is enabled on all tables (verify in Dashboard → Table Editor → RLS enabled badge)
- [ ] `SUPABASE_SERVICE_ROLE_KEY` is NOT in any `NEXT_PUBLIC_` variable
- [ ] Audit form validates with Turnstile (test with intentional bot-like behavior)
- [ ] No sensitive data appears in browser network tab responses for unauthenticated requests

### SEO & Analytics

- [ ] `<title>` tag is set correctly on homepage
- [ ] `meta description` is set on homepage and `/audit`
- [ ] OG image renders correctly (test at [opengraph.xyz](https://opengraph.xyz))
- [ ] GA4 is receiving events — check Realtime view in GA4 Dashboard
- [ ] `audit_form_submit` event fires on form submission
- [ ] Sitemap is accessible at `/sitemap.xml`
- [ ] Robots.txt is accessible at `/robots.txt`
- [ ] Search Console shows domain as verified

### Performance

- [ ] Run [PageSpeed Insights](https://pagespeed.web.dev) on homepage
  - LCP < 2.5 seconds
  - CLS < 0.1
  - INP < 200ms
- [ ] Run PageSpeed on `/audit`
- [ ] Images are served in WebP/AVIF format
- [ ] Fonts are loaded with `font-display: swap`

### Content

- [ ] Hero headline and subheadline are correct
- [ ] CTA buttons link to `/audit`
- [ ] All navigation links work
- [ ] Privacy Policy is up to date and includes: data collection, Supabase, GA4, Cloudflare Turnstile
- [ ] Terms of Service is up to date
- [ ] Contact information (email) is correct throughout

---

## 10. Local Development Setup

For reference when onboarding future contributors or after a fresh machine setup.

```bash
# Clone the repo
git clone https://github.com/yourusername/clickonversion.git
cd clickonversion

# Install dependencies
pnpm install

# Copy env file and fill in values
cp .env.example .env.local

# Start Supabase locally (optional — can point to remote in dev)
pnpm supabase start

# Run migrations against local Supabase
pnpm supabase db push

# Start the dev server
pnpm dev
```

Development server runs at `http://localhost:3000`.

Supabase local studio (if using local Supabase) runs at `http://localhost:54323`.

---

## 11. Rollback Procedure

If a deployment causes issues:

```bash
# List recent deployments
pnpm vercel ls

# Roll back to a specific deployment
pnpm vercel rollback [deployment-url]
```

Or in the Vercel Dashboard: **Deployments → find previous deployment → Promote to Production**.

Database rollbacks require restoring from Supabase's automatic daily backups (available in Supabase Dashboard → Backups). Write rollback SQL in each migration file and keep it in a comment at the top.

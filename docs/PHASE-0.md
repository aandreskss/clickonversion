# ClicKonversion — Phase 0: The Sales Machine

## Phase Objective

**Acquire the first 2–3 paying clients and reach $2,000 MRR.**

Phase 0 is not about building a product. It is about building the machine that sells the product — a credible marketing site that converts cold traffic into booked calls, and a lightweight CRM that ensures every prospect is tracked from first contact to signed agreement.

Everything built in Phase 0 must directly serve one of three functions:
1. **Acquisition** — bring prospects to the site and turn them into leads
2. **Sales management** — track every deal from first contact to close
3. **Measurement** — know what is working and optimize accordingly

If a feature does not serve one of these three functions, it is not Phase 0.

---

## Success Metrics

| Metric | Target |
|---|---|
| Monthly Recurring Revenue (MRR) | $2,000 |
| Paying clients | 2–3 |
| Time to first paid client | ≤ 60 days from launch |
| Growth Audits requested | ≥ 10 in first 30 days |
| Audit-to-call conversion rate | ≥ 40% |
| Call-to-proposal conversion rate | ≥ 60% |
| Proposal-to-close conversion rate | ≥ 33% |

---

## Tech Stack

### Core Framework
| Layer | Technology | Version | Notes |
|---|---|---|---|
| Framework | Next.js | 16 | App Router, Server Components by default |
| Language | TypeScript | 5.x | Strict mode — `"strict": true` in tsconfig, no `any` |
| Styling | Tailwind CSS | 4 | CSS-first config via `@theme` in globals.css |
| Database | Supabase | — | PostgreSQL + Auth + Storage + Realtime |
| Auth adapter | `@supabase/ssr` | latest | NOT deprecated `auth-helpers-nextjs` |
| Validation | Zod | 3.x | All form input and API payloads |
| Package manager | pnpm | 9.x | Workspaces config in `pnpm-workspace.yaml` |
| Hosting | Vercel | — | Preview + Production deployments |

### Rationale for Stack Choices
- **Next.js 16 App Router**: Server Components reduce client JS; Server Actions simplify API layer for a solo builder.
- **TypeScript strict**: Catches integration bugs (Supabase types, Zod schemas) before runtime.
- **Tailwind 4 CSS-first**: No `tailwind.config.js` — all tokens in `globals.css` under `@theme`. Faster iteration, cleaner diffs.
- **Supabase**: Handles auth, database, and row-level security in one managed service. No backend servers to operate.
- **`@supabase/ssr`**: The correct adapter for App Router. Handles cookie-based auth for both Server and Client components.
- **Zod**: Single source of truth for data shapes — used in Server Actions, API routes, and form validation.
- **pnpm**: Faster installs, strict dependency isolation, monorepo-ready for future packages.

### What Is NOT in the Stack (Phase 0)
- No ORM (Drizzle, Prisma) — raw Supabase client with generated types is sufficient
- No state management library (Zustand, Redux) — React state + Server Components cover Phase 0 needs
- No third-party component library (shadcn, Radix) — custom components built to brand spec
- No email sending library — handled manually + Resend (optional, post-audit workflow)
- No testing framework — focus is speed to market, not coverage

---

## Application Routes

### Public Routes (Marketing Site)

| Route | Purpose | Key Conversion Element |
|---|---|---|
| `/` | Homepage / landing page | CTA → `/audit` |
| `/audit` | Growth audit request form | Lead capture form with honeypot |
| `/thank-you` | Post-audit confirmation | Booking link (Cal.com / Calendly) |
| `/privacy` | Privacy policy | Legal compliance |
| `/terms` | Terms of service | Legal compliance |

### Protected Routes (CRM — `/app`)

| Route | Purpose |
|---|---|
| `/login` | Email + password login (Supabase Auth) |
| `/app` | CRM dashboard — pipeline overview, MRR, key metrics |
| `/app/pipeline` | Kanban-style pipeline board (all stages) |
| `/app/companies` | Company list with search, filter, pagination |
| `/app/companies/[id]` | Company detail — contacts, opportunities, activities |
| `/app/contacts` | Contact list |
| `/app/contacts/[id]` | Contact detail — linked company, activities, timeline |
| `/app/opportunities` | Opportunity list — filterable by stage, source, value |
| `/app/opportunities/[id]` | Opportunity detail — full timeline, stage history |
| `/app/activities` | Activity log (all calls, emails, notes) |
| `/app/tasks` | Task list — overdue, today, upcoming |
| `/app/audit-requests` | Inbound audit requests from public form |
| `/app/research` | Prospect research notes |
| `/app/settings` | Organization settings, booking URL, preferences |

### Route Protection Strategy
- Middleware at `src/middleware.ts` reads Supabase session cookie
- Any `/app/*` route without a valid session redirects to `/login`
- `/login` with active session redirects to `/app`
- Public routes have no auth dependency — they must load fast

---

## Database Schema

All tables use UUID primary keys, `created_at` and `updated_at` timestamps, and row-level security (RLS). No table is accessible without RLS policies.

### Core Tables

#### `organizations`
The multi-tenancy anchor. Every CRM record belongs to an organization.
```sql
id              uuid PRIMARY KEY DEFAULT gen_random_uuid()
name            text NOT NULL
slug            text UNIQUE NOT NULL
owner_id        uuid REFERENCES auth.users(id)
booking_url     text                          -- Cal.com / Calendly link
logo_url        text
created_at      timestamptz DEFAULT now()
updated_at      timestamptz DEFAULT now()
```

#### `companies`
Prospect or client businesses.
```sql
id              uuid PRIMARY KEY DEFAULT gen_random_uuid()
org_id          uuid REFERENCES organizations(id) ON DELETE CASCADE
name            text NOT NULL
website         text
industry        text                          -- cleaning, roofing, hvac, etc.
city            text
state           text(2)                       -- US state code: FL, TX, CA
phone           text
email           text
employee_count  integer
annual_revenue  text                          -- range: '100k-500k', '500k-1m', etc.
source          text                          -- outbound_email, referral, etc.
notes           text
created_at      timestamptz DEFAULT now()
updated_at      timestamptz DEFAULT now()
```

#### `contacts`
Individual people at a company.
```sql
id              uuid PRIMARY KEY DEFAULT gen_random_uuid()
org_id          uuid REFERENCES organizations(id) ON DELETE CASCADE
company_id      uuid REFERENCES companies(id) ON DELETE SET NULL
first_name      text NOT NULL
last_name       text
title           text
email           text
phone           text
linkedin_url    text
is_primary      boolean DEFAULT false
notes           text
created_at      timestamptz DEFAULT now()
updated_at      timestamptz DEFAULT now()
```

#### `opportunities`
A sales deal being pursued. One company can have multiple opportunities.
```sql
id              uuid PRIMARY KEY DEFAULT gen_random_uuid()
org_id          uuid REFERENCES organizations(id) ON DELETE CASCADE
company_id      uuid REFERENCES companies(id) ON DELETE CASCADE
contact_id      uuid REFERENCES contacts(id) ON DELETE SET NULL
title           text NOT NULL                 -- "SEO + Ads Package — Sunrise Roofing"
stage           text NOT NULL DEFAULT 'NEW'   -- see Pipeline Stages below
source          text                          -- where this lead came from
mrr_value       numeric(10,2) DEFAULT 0       -- proposed monthly value in USD
one_time_value  numeric(10,2) DEFAULT 0       -- setup fee or one-time project
probability     integer DEFAULT 20            -- 0–100, updated by stage
expected_close  date
lost_reason     text                          -- only filled when stage = LOST
notes           text
created_at      timestamptz DEFAULT now()
updated_at      timestamptz DEFAULT now()
stage_changed_at timestamptz DEFAULT now()
```

#### `activities`
Log of every interaction: calls, emails, meetings, notes.
```sql
id              uuid PRIMARY KEY DEFAULT gen_random_uuid()
org_id          uuid REFERENCES organizations(id) ON DELETE CASCADE
opportunity_id  uuid REFERENCES opportunities(id) ON DELETE CASCADE
contact_id      uuid REFERENCES contacts(id) ON DELETE SET NULL
company_id      uuid REFERENCES companies(id) ON DELETE SET NULL
type            text NOT NULL                 -- call, email, meeting, note, linkedin_dm, audit_sent, proposal_sent
subject         text
body            text
outcome         text                          -- positive, neutral, negative, no_answer
duration_min    integer                       -- for calls
logged_at       timestamptz DEFAULT now()
created_at      timestamptz DEFAULT now()
```

#### `tasks`
Next actions tied to opportunities or contacts.
```sql
id              uuid PRIMARY KEY DEFAULT gen_random_uuid()
org_id          uuid REFERENCES organizations(id) ON DELETE CASCADE
opportunity_id  uuid REFERENCES opportunities(id) ON DELETE SET NULL
contact_id      uuid REFERENCES contacts(id) ON DELETE SET NULL
title           text NOT NULL
due_date        date NOT NULL
priority        text DEFAULT 'medium'         -- low, medium, high
status          text DEFAULT 'open'           -- open, done, skipped
created_at      timestamptz DEFAULT now()
updated_at      timestamptz DEFAULT now()
```

#### `audit_requests`
Leads submitted through the public `/audit` form.
```sql
id              uuid PRIMARY KEY DEFAULT gen_random_uuid()
org_id          uuid REFERENCES organizations(id) ON DELETE CASCADE
business_name   text NOT NULL
contact_name    text NOT NULL
email           text NOT NULL
phone           text
website         text
industry        text
city            text
state           text(2)
monthly_ad_spend text
biggest_challenge text
status          text DEFAULT 'new'            -- new, reviewed, converted, spam
converted_to_company_id uuid REFERENCES companies(id) ON DELETE SET NULL
ip_address      inet                          -- for spam detection
user_agent      text
created_at      timestamptz DEFAULT now()
```

#### `prospect_research`
Structured research notes on target companies.
```sql
id              uuid PRIMARY KEY DEFAULT gen_random_uuid()
org_id          uuid REFERENCES organizations(id) ON DELETE CASCADE
company_id      uuid REFERENCES companies(id) ON DELETE CASCADE
google_rating   numeric(2,1)
google_review_count integer
has_google_ads  boolean
has_facebook_ads boolean
website_score   integer                       -- 1–10 subjective quality score
seo_issues      text[]                        -- array of identified issues
ad_issues       text[]
opportunities   text[]                        -- growth opportunities identified
research_date   date DEFAULT CURRENT_DATE
researcher_notes text
created_at      timestamptz DEFAULT now()
```

### Migrations Strategy
- All schema changes are managed through numbered SQL migration files in `supabase/migrations/`
- No manual changes through the Supabase dashboard — dashboard is read-only for schema
- Migration file naming: `YYYYMMDDHHMMSS_description.sql`
- Always include a rollback comment at the top of each migration

---

## Pipeline Stages

### Stage Definitions

| Stage | Description | Default Probability |
|---|---|---|
| `NEW` | Lead identified, not yet contacted | 10% |
| `QUALIFIED` | Research done, confirmed they fit ICP | 20% |
| `CONTACTED` | First outreach sent (email, LinkedIn, cold call) | 25% |
| `REPLIED` | Prospect responded — any response | 35% |
| `AUDIT_SENT` | Growth audit delivered to prospect | 50% |
| `CALL_BOOKED` | Discovery or strategy call is scheduled | 65% |
| `PROPOSAL` | Written proposal sent | 75% |
| `WON` | Client signed / paid first invoice | 100% |
| `LOST` | Deal dead — requires `lost_reason` | 0% |
| `NURTURE` | Not ready now — follow up in 30–90 days | 15% |

### Stage Transition Rules
- Moving a deal **forward** should auto-create a follow-up task
- Moving to `LOST` requires selecting a `lost_reason` from a dropdown
- Moving to `WON` triggers MRR counter update
- `NURTURE` deals surface in a separate queue with a next-contact date

### Lost Reason Options
- `price` — Budget or pricing objection
- `timing` — Not ready right now
- `competitor` — Chose another agency or service
- `no_response` — Ghosted after multiple follow-ups
- `not_qualified` — Not a fit after deeper discovery
- `internal` — Decided to handle in-house
- `other` — Free text required

---

## MRR Calculation

MRR is the single most important metric in Phase 0.

**Formula:**
```
MRR = SUM(mrr_value) WHERE stage = 'WON' AND org_id = current_org
```

This is the live sum of `mrr_value` across all opportunities in the `WON` stage. It is calculated in real time from the database — no separate counter table.

**Rules:**
- Only `WON` opportunities count toward MRR
- `mrr_value` represents the recurring monthly contract value (not one-time fees)
- One-time fees (setup, audit) are tracked in `one_time_value` — displayed separately
- If a client churns (future phase), the opportunity is moved to a `CHURNED` stage (Phase 1+)
- MRR is displayed prominently on the `/app` dashboard — it is the north star metric

**Dashboard Display:**
```
Current MRR: $X,XXX
Target:      $2,000
Progress:    XX%
```

---

## What Is NOT in Phase 0

The following features are explicitly excluded from Phase 0 scope. Adding them before reaching $2,000 MRR is scope creep.

| Feature | Why Excluded | Future Phase |
|---|---|---|
| Billing / payments (Stripe) | No paying clients to bill yet | Phase 1 |
| Email automation / sequences | Manual outreach is more effective at this scale | Phase 1 |
| AI-powered outreach or enrichment | Complexity not justified until pipeline is validated | Phase 1 |
| Social media scheduler | Not part of the sales motion in Phase 0 | Phase 2 |
| Client portal (client-facing) | No clients yet | Phase 1 |
| Learning Management System (LMS) | Education product comes after delivery is proven | Phase 2+ |
| Multi-user / team roles | Single operator in Phase 0; roles add auth complexity | Phase 1 |
| Reporting / analytics exports | Manual review is sufficient at small pipeline size | Phase 1 |
| Lead scoring algorithm | Not enough data to train on | Phase 1 |
| Zapier / webhook integrations | No integration demand from 0 clients | Phase 1 |
| Mobile app (native) | Responsive web is sufficient for Phase 0 | Phase 2+ |
| Custom domain email (Resend) | Nice to have, not a blocker | Phase 1 |

---

## Phase 1 Roadmap (Post-$2K MRR)

Once the $2,000 MRR target is hit, Phase 1 can begin. These are ideas only — they will be scoped properly before any code is written.

- **AI outreach assistant**: Draft personalized cold emails using company research data
- **Automated follow-up sequences**: Trigger email sequences based on pipeline stage
- **Client portal**: Give clients read-only visibility into their campaign metrics
- **Billing integration**: Stripe invoices tied to WON opportunities
- **Education library**: Basic playbooks and SOPs for onboarded clients
- **Multi-user support**: Invite team members with role-based access
- **Lead enrichment**: Clearbit or Hunter.io integration for contact data
- **Performance reports**: PDF/email monthly reports for clients
- **Referral tracking**: Track which clients send referrals and reward them

---

## Definition of "Done" for Phase 0

Phase 0 is complete when:

1. Marketing site (`/`, `/audit`, `/thank-you`) is live at `clicKonversion.com`
2. CRM is live at `app.clicKonversion.com` (or `clicKonversion.com/app`) behind auth
3. Audit form is receiving real submissions and triggering email notification
4. Pipeline is tracking at least 10 prospects across various stages
5. MRR dashboard shows at least $2,000 from WON opportunities
6. GA4 is tracking: page views, audit form submissions, and key CRM events
7. All pages have correct meta titles, descriptions, and OG images
8. Site passes Core Web Vitals (LCP < 2.5s, CLS < 0.1, INP < 200ms)

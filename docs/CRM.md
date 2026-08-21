# ClicKonversion — CRM Reference

## Purpose

The ClicKonversion CRM is not a generic contact manager. It is a focused sales tool with one job: **help close the first 3 clients and reach $2,000 MRR**.

Every design decision in the CRM flows from this purpose. If a feature doesn't help move a deal forward or measure progress toward $2K MRR, it doesn't belong here in Phase 0.

---

## Pipeline Philosophy

> **"No lead without a next move."**

Every opportunity in the pipeline must have:
1. A current stage (where it is now)
2. An open task (what happens next and when)
3. A contact associated (who you're talking to)

An opportunity with no open task is a deal that is quietly dying. The CRM must make this visible — a "no next action" state should be visually flagged on the pipeline board.

---

## Pipeline Stage Definitions

### `NEW`
**Meaning:** A potential prospect has been identified but no outreach has been sent yet.

**Entry criteria:**
- Company name and contact information are known
- Company has been confirmed as a fit (local service business, US-based, right revenue range)

**Exit criteria:**
- First outreach attempt has been made (→ `CONTACTED`)
- Research reveals they are not a fit (→ `LOST` with reason `not_qualified`)

**Required fields:** `company_id`, `title`, `source`
**Default probability:** 10%
**Typical time in stage:** 1–3 days

---

### `QUALIFIED`
**Meaning:** Research has been completed. The prospect fits the ICP. Outreach strategy has been chosen.

**Entry criteria:**
- Industry, revenue range, and location verified
- Website and ad presence reviewed (prospect_research record created)
- Decision maker identified

**Exit criteria:**
- Outreach sent (→ `CONTACTED`)

**Required fields:** `contact_id`, research notes in `prospect_research`
**Default probability:** 20%
**Typical time in stage:** 1–5 days

---

### `CONTACTED`
**Meaning:** At least one outreach attempt has been made. Waiting for a response.

**Entry criteria:**
- Cold email, LinkedIn DM, or cold call placed
- Activity log updated with outcome (`no_answer`, `neutral`)

**Exit criteria:**
- Prospect responds in any form (→ `REPLIED`)
- No response after defined follow-up sequence (→ `NURTURE` or `LOST`)

**Required fields:** At least one `activity` of type `email`, `linkedin_dm`, or `call`
**Default probability:** 25%
**Typical time in stage:** 3–14 days

---

### `REPLIED`
**Meaning:** The prospect has responded. The conversation has started, even if they pushed back.

**Entry criteria:**
- Any response received: interested, skeptical, asking questions, or requesting information

**Exit criteria:**
- Audit requested or offered (→ `AUDIT_SENT`)
- Call scheduled (→ `CALL_BOOKED`, skipping audit if appropriate)
- Prospect says no or goes silent (→ `LOST` or `NURTURE`)

**Required fields:** Activity log showing reply
**Default probability:** 35%
**Typical time in stage:** 1–5 days

---

### `AUDIT_SENT`
**Meaning:** A Growth Audit (custom analysis of their ads, SEO, website, and lead flow) has been delivered.

**Entry criteria:**
- Audit document or report has been sent via email or shared link
- Prospect has been notified and asked for a call to review it

**Exit criteria:**
- Call booked to review audit findings (→ `CALL_BOOKED`)
- No response to audit (→ `NURTURE`)
- Declined to move forward (→ `LOST`)

**Required fields:** Activity of type `audit_sent`, audit content referenced in notes
**Default probability:** 50%
**Typical time in stage:** 3–7 days

---

### `CALL_BOOKED`
**Meaning:** A discovery or strategy call is confirmed on the calendar.

**Entry criteria:**
- Calendar event exists (via Cal.com / Calendly)
- Prospect confirmed attendance

**Exit criteria:**
- Call completed, proposal requested (→ `PROPOSAL`)
- Call completed, not a fit (→ `LOST`)
- Call no-show — reschedule attempted (→ `REPLIED` or `NURTURE`)

**Required fields:** Activity of type `meeting` with date and time
**Default probability:** 65%
**Typical time in stage:** 1–7 days

---

### `PROPOSAL`
**Meaning:** A written proposal has been sent and is awaiting a decision.

**Entry criteria:**
- Proposal document sent (PDF or link)
- Price, scope, and start date are in the proposal
- Follow-up task is set for 48 hours after sending

**Exit criteria:**
- Prospect accepts (→ `WON`)
- Prospect declines or goes silent (→ `LOST` or `NURTURE`)
- Negotiation opens (stay in `PROPOSAL`, log activity)

**Required fields:** Activity of type `proposal_sent`, `mrr_value` and `one_time_value` set
**Default probability:** 75%
**Typical time in stage:** 3–14 days

---

### `WON`
**Meaning:** The client has committed. Agreement signed or first payment received.

**Entry criteria:**
- Verbal or written confirmation
- First invoice sent or signed agreement received

**Impact:**
- `mrr_value` is added to the live MRR counter
- A new `task` is created for client onboarding
- Activity log records close date and deal terms summary

**Required fields:** `mrr_value` must be > 0, close date recorded
**Default probability:** 100%

---

### `LOST`
**Meaning:** This deal will not close. Not permanently — lost today, re-engage in future if circumstances change.

**Entry criteria:**
- Prospect explicitly declined
- No response after full follow-up sequence
- Deal is fundamentally not a fit

**Required fields:** `lost_reason` must be selected

**Lost reason options:**
| Code | Meaning |
|---|---|
| `price` | Budget or pricing objection |
| `timing` | Not ready right now |
| `competitor` | Chose another provider |
| `no_response` | Ghosted despite follow-ups |
| `not_qualified` | Not a fit after research |
| `internal` | Decided to handle in-house |
| `other` | Free text explanation required |

**Default probability:** 0%

---

### `NURTURE`
**Meaning:** Prospect is interested but not buying now. Worth following up in 30–90 days.

**Entry criteria:**
- Prospect said "not now" but didn't close the door
- Prospect is mid-contract with another provider

**Required fields:** A `task` with `due_date` set for future follow-up
**Default probability:** 15%

---

## Lead Sources

All opportunities must have a `source` value. This is mandatory for measuring which acquisition channels produce the best results.

| Source Code | Description |
|---|---|
| `outbound_email` | Cold email outreach sent by ClicKonversion |
| `linkedin` | LinkedIn DM or connection outreach |
| `instagram` | Instagram DM or comment-to-DM |
| `referral` | Referred by an existing client or partner |
| `organic_search` | Found the site through Google search (non-paid) |
| `google_ads` | Came through a Google Ads campaign |
| `meta_ads` | Came through Facebook or Instagram Ads |
| `growth_audit` | Requested the free Growth Audit (inbound) |
| `partner` | Introduced through a strategic partner or affiliate |
| `direct` | Typed the URL directly or unknown source |
| `other` | None of the above — note required |

**Source reporting use case:** At any point, you should be able to answer "Which source produces deals that close fastest?" and "Which source produces the highest average MRR?" The `source` field enables these queries.

---

## Sales Metrics

The CRM dashboard surfaces the following metrics, calculated in real time.

### Primary Metrics (Dashboard Top Row)

| Metric | Formula | Target |
|---|---|---|
| **Current MRR** | `SUM(mrr_value) WHERE stage = 'WON'` | $2,000 |
| **Pipeline Value** | `SUM(mrr_value * probability/100) WHERE stage NOT IN ('WON','LOST')` | — |
| **Open Opportunities** | `COUNT(*) WHERE stage NOT IN ('WON','LOST','NURTURE')` | — |
| **Overdue Tasks** | `COUNT(*) WHERE status='open' AND due_date < today` | 0 |

### Conversion Funnel Metrics (Last 90 Days)

| Metric | Formula |
|---|---|
| **Response Rate** | `(REPLIED + AUDIT_SENT + CALL_BOOKED + PROPOSAL + WON) / CONTACTED * 100` |
| **Call Booking Rate** | `CALL_BOOKED / REPLIED * 100` |
| **Proposal Rate** | `PROPOSAL / CALL_BOOKED * 100` |
| **Close Rate** | `WON / PROPOSAL * 100` |
| **Audit Conversion Rate** | `CALL_BOOKED / AUDIT_SENT * 100` |
| **Overall Win Rate** | `WON / (WON + LOST) * 100` |

### Deal Metrics

| Metric | Formula |
|---|---|
| **Average MRR per Client** | `SUM(mrr_value) / COUNT(*) WHERE stage = 'WON'` |
| **Average Sales Cycle** | `AVG(stage_changed_at[WON] - created_at)` for WON deals |
| **Best Source by MRR** | `source GROUP BY source, SUM(mrr_value) WHERE stage = 'WON'` |

### Phase 0 Benchmarks (Targets to Beat)
| Metric | Target |
|---|---|
| Response Rate | > 15% |
| Audit-to-Call Rate | > 40% |
| Proposal Rate | > 60% |
| Close Rate | > 33% |
| Average MRR per Client | > $650 |

---

## Data Model Relationships

```
organizations (1)
    ├── companies (many)
    │     ├── contacts (many)
    │     ├── opportunities (many)
    │     │     ├── activities (many)
    │     │     └── tasks (many)
    │     └── prospect_research (one)
    ├── audit_requests (many)
    │     └── → converts to → companies
    └── tasks (many, also org-level without opportunity)
```

### Key Relationships
- Every `company` belongs to one `organization`
- A `company` can have many `contacts` and many `opportunities`
- An `opportunity` belongs to one `company` and optionally one `contact` (the primary point of contact for this deal)
- An `activity` is always tied to an `opportunity` (and optionally to a `contact` and `company` for denormalized querying)
- A `task` is always tied to an `opportunity` or a `contact` — never orphaned
- An `audit_request` is the raw inbound form submission — when reviewed and qualified, it is **converted** into a `company` + `opportunity`

### Soft Deletes
Phase 0 does not implement soft deletes. Records can be hard-deleted with a confirmation dialog. This simplifies queries and avoids `WHERE deleted_at IS NULL` boilerplate throughout the codebase.

---

## Key Workflows

### Workflow 1: Cold Outbound → Audit → Close

```
1. Research prospect
   - Create company record
   - Find and add primary contact
   - Fill prospect_research record
   - Create opportunity (stage: NEW → QUALIFIED)

2. Send outreach
   - Log activity (type: email or linkedin_dm)
   - Move opportunity to CONTACTED
   - Create follow-up task (+3 days)

3. Prospect replies
   - Log activity with reply content
   - Move to REPLIED
   - Offer Growth Audit if appropriate

4. Send audit
   - Prepare audit document (external: Google Slides or Notion)
   - Log activity (type: audit_sent)
   - Move to AUDIT_SENT
   - Create follow-up task (+2 days): "Did you get a chance to review the audit?"

5. Book call
   - Prospect agrees to call
   - Send booking link (Cal.com / Calendly)
   - Move to CALL_BOOKED when confirmed
   - Create prep task: review audit, prepare questions

6. Discovery/strategy call
   - Log call activity with outcome and notes
   - Determine if proposal makes sense
   - Move to PROPOSAL or LOST/NURTURE

7. Send proposal
   - Log activity (type: proposal_sent)
   - Ensure mrr_value and one_time_value are set
   - Move to PROPOSAL
   - Create follow-up task (+48 hours)

8. Close
   - Log final activity with terms summary
   - Move to WON
   - MRR counter updates automatically
   - Create onboarding task
```

---

### Workflow 2: Inbound Audit Request → Qualify → Convert

```
1. Audit request arrives via /audit form
   - Record saved to audit_requests table
   - Email notification sent to ClicKonversion admin

2. Review request (within 24 hours)
   - Read submission in /app/audit-requests
   - Determine if they fit ICP

3a. If qualified:
   - Click "Convert to Company" button
   - System creates: company record, primary contact, opportunity (stage: REPLIED)
   - Research prospect (fill prospect_research)
   - Prepare custom audit

3b. If not qualified:
   - Mark audit_request.status = 'spam' or add notes
   - Politely decline via email (manual)

4. Continue with Workflow 1 from step 4 (Send audit)
```

---

### Workflow 3: Daily CRM Routine

```
Morning (10–15 minutes):
1. Open /app dashboard
2. Check MRR counter — note progress toward $2K
3. Review overdue tasks — address each one
4. Review today's tasks — schedule blocks for calls/emails

During the day:
5. Log every outreach attempt as an activity
6. Update opportunity stages immediately after any response
7. Add tasks for every next step before closing the record

End of day (5 minutes):
8. Ensure no open opportunities have zero tasks
9. Review CALL_BOOKED opportunities — prep for upcoming calls
10. Check audit_requests — any new submissions?
```

---

## CSV Import / Export

### Import (Bulk Prospect Upload)

The CRM supports importing companies and contacts from a CSV file via `/app/companies/import`.

**Required CSV columns for companies:**
```
name, website, industry, city, state, source
```

**Optional columns:**
```
phone, email, employee_count, annual_revenue, notes
```

**Import behavior:**
- Validates each row with Zod before inserting
- Skips rows with missing required fields (reports skipped count)
- Checks for duplicate `website` values within the org — warns but does not block
- Creates a `NEW` opportunity for each imported company if `create_opportunity=true` flag is passed

**Use case:** Bulk upload of 50–100 prospects scraped from Google Maps, Apollo, or a list provider.

---

### Export

The CRM supports exporting the full contact and opportunity database as CSV.

**Export endpoints:**
- `/app/companies/export` — All companies with last activity date
- `/app/opportunities/export` — All opportunities with stage, MRR, source, close date
- `/app/activities/export` — Full activity log (date range selectable)

**Export use cases:**
- Backup before destructive operations
- Analysis in Google Sheets
- Handoff data to a future team member

---

## RLS Policy Summary

All tables require the following RLS pattern:

```sql
-- Enable RLS
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;

-- Read: only members of the organization can see records
CREATE POLICY "org_members_can_read"
  ON companies FOR SELECT
  USING (org_id = get_user_org_id());

-- Insert: only org members can create records
CREATE POLICY "org_members_can_insert"
  ON companies FOR INSERT
  WITH CHECK (org_id = get_user_org_id());

-- Update: only org members can update their records
CREATE POLICY "org_members_can_update"
  ON companies FOR UPDATE
  USING (org_id = get_user_org_id());

-- Delete: only org members can delete
CREATE POLICY "org_members_can_delete"
  ON companies FOR DELETE
  USING (org_id = get_user_org_id());
```

`get_user_org_id()` is a Supabase database function that reads `org_id` from the `organizations` table for the currently authenticated user.

---

## UI Conventions

### Pipeline Board
- Columns = stages (left to right, NEW → WON)
- Each card shows: company name, contact name, MRR value, days in stage, next task due
- Cards with overdue tasks show a red indicator
- Cards with no tasks show an orange warning icon ("needs next action")
- Drag-and-drop to change stage (with confirmation for LOST and WON transitions)

### Company / Contact Detail Page
- Timeline view showing all activities in reverse chronological order
- Inline task creation — type and press enter
- Quick stage change selector at top of page
- "Log Activity" button always visible without scrolling

### Dashboard
- MRR counter is the largest element on the screen
- Progress bar toward $2K target
- Funnel chart showing stage distribution
- 5 most recent activities
- Overdue tasks highlighted in red with count

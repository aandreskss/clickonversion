# Bookings & Advisory Sessions — Setup Guide

## Overview

The booking system integrates Cal.com for calendar scheduling with a booking rights layer that
enforces payment before paid sessions can be scheduled.

**Flow:**
1. Client visits `/book` → sees available meeting types
2. Free calls: fill pre-brief form → Cal.com embed appears → schedule
3. Paid calls: purchase on `/checkout` → webhook creates booking right → email with token → `/book/[slug]?token=...` → pre-brief form → Cal.com embed
4. Cal.com fires webhook → meeting record confirmed → email notifications sent

---

## Environment Variables

Add to Vercel → Settings → Environment Variables:

```
# Cal.com (server-only)
CAL_API_KEY=cal_live_xxx          # From Cal.com → Settings → API Keys
CALCOM_WEBHOOK_SECRET=xxx         # From Cal.com → Settings → Webhooks → Secret

# Cal.com username (public — used to build embed links)
NEXT_PUBLIC_CAL_USERNAME=clickonversion
```

---

## Cal.com Dashboard Setup

### 1. Create event types

Create one event type per meeting type slug in `src/lib/meetings/config.ts`:

| Slug | Cal.com event slug | Duration |
|---|---|---|
| discovery | `discovery-15min` | 15 min |
| meta-advisory-basic | `meta-advisory-45min` | 45 min |
| meta-advisory-specialized | `meta-advisory-60min` | 60 min |
| technical-diagnosis | `technical-diagnosis` | 60 min |
| onboarding-kickoff | `onboarding-kickoff` | 30 min |
| project-followup | `project-followup` | 30 min |

**Important:** Set the event type URL slug to match exactly — it becomes `cal.com/clickonversion/<slug>`.

### 2. Connect a video conferencing integration

Settings → Integrations → Google Meet / Zoom. Cal.com will auto-include the video link in the webhook payload.

### 3. Configure availability

Settings → Availability → set your working hours and time zone.

### 4. Set up the webhook

Settings → Webhooks → Add webhook:

- URL: `https://www.clickonversion.com/api/webhooks/calcom`
- Events: `BOOKING_CREATED`, `BOOKING_RESCHEDULED`, `BOOKING_CANCELLED`, `BOOKING_CONFIRMED`
- Active: ✅
- Secret: copy to `CALCOM_WEBHOOK_SECRET`

---

## Booking Rights

Booking rights are single-use tokens generated when a payment webhook fires (`checkout_completed`).

### Service → Meeting type mapping

Configured in `supabase/migrations/008_meetings.sql`:

```sql
UPDATE pf_service_prices
SET creates_booking_right = true, booking_meeting_type_slug = 'meta-advisory-basic'
WHERE ... ;
```

To add a new service → session mapping, update the migration or run a manual UPDATE.

### Token structure

- 48-character hex string (`gen_random_bytes(24)` → hex)
- Expires in 90 days
- `max_uses = 1` by default
- Single-use: status transitions `unused → reserved → used`
- Cancellation resets: `used/reserved → unused` (client can rebook)

### Booking URL format

```
https://www.clickonversion.com/book/meta-advisory-basic?token=<48-char-token>
```

Sent via email using the `bookingRightGrantedEmail` template.

---

## Pre-Brief Forms

Forms are defined in `src/lib/meetings/config.ts` → `PRE_BRIEF_FORMS` keyed by `PreBriefCategory`.

**Security rule:** Never add `sensitive: true` fields to forms. The `sensitive` flag exists to mark fields that should be skipped during submission. Never ask for passwords, API tokens, or security credentials in pre-brief forms.

### Adding a new form field

```typescript
// In PRE_BRIEF_FORMS.meta (for example)
{
  key:      "pixel_id",
  labelEn:  "Meta Pixel ID (optional)",
  labelEs:  "ID del Pixel de Meta (opcional)",
  type:     "text",
  required: false,
  // No sensitive: true — pixel IDs are not security credentials
}
```

---

## Free Call Rate Limiting

Configured per meeting type in `freeLimit`:

```typescript
freeLimit: { count: 1, periodDays: 30 }
```

The `/api/bookings/pre-form` route enforces this before creating a pending meeting. The check counts `pf_meetings` rows where:
- `client_email = <email>`
- `meeting_type_slug = <slug>`
- `status != 'cancelled'`
- `created_at >= now() - periodDays`

To change limits, update `config.ts` — no migration needed.

---

## Email Notifications

All emails sent via Resend (`src/lib/email/service.ts`). Falls back to `console.log` in dev if `RESEND_API_KEY` is not set.

| Trigger | Template | Recipients |
|---|---|---|
| Booking confirmed (EN) | `bookingConfirmedEmail` | Client |
| Booking confirmed (ES) | `bookingConfirmedEmailEs` | Client |
| New meeting booked | `meetingBookedAdminEmail` | Specialist / admin |
| Booking right granted | `bookingRightGrantedEmail` | Client |
| Rescheduled | `bookingRescheduledEmail` | Client |
| Cancelled | `bookingCancelledEmail` | Client |
| Onboarding submitted | `onboardingSubmittedAdminEmail` | Admin |
| Onboarding confirmed | `onboardingConfirmedClientEmail` | Client |

Language is determined by `payload.metadata.lang` from Cal.com. Pass `lang=es` in the Cal.com embed config to route to Spanish templates.

---

## Local Development

Cal.com webhooks require a public URL. Use [ngrok](https://ngrok.com) or [localtunnel](https://theboroer.github.io/localtunnel-www/):

```bash
# Install ngrok
npm i -g ngrok

# Start Next.js dev server
pnpm dev

# In another terminal
ngrok http 3000
```

Set the ngrok HTTPS URL as the webhook URL in Cal.com dashboard (update each session since free ngrok URLs expire).

Set `CALCOM_WEBHOOK_SECRET` to whatever secret Cal.com generates for your webhook.

For testing without real Cal.com:

```bash
# Simulate a BOOKING_CREATED webhook
curl -X POST http://localhost:3000/api/webhooks/calcom \
  -H "Content-Type: application/json" \
  -d '{
    "triggerEvent": "BOOKING_CREATED",
    "createdAt": "2026-10-21T10:00:00Z",
    "payload": {
      "uid": "test-uid-001",
      "title": "Free Growth Audit Call",
      "startTime": "2026-10-28T14:00:00Z",
      "endTime": "2026-10-28T14:15:00Z",
      "attendees": [{ "email": "client@example.com", "name": "Test Client", "timeZone": "America/Caracas" }],
      "organizer": { "email": "arnaldo@clickonversion.com", "name": "Arnaldo", "timeZone": "America/Caracas" },
      "eventTypeSlug": "discovery-15min",
      "metadata": { "lang": "en" }
    }
  }'
```

Note: Without `CALCOM_WEBHOOK_SECRET` set, the signature check is skipped in development.

---

## Production Checklist

- [ ] `CAL_API_KEY` set in Vercel
- [ ] `CALCOM_WEBHOOK_SECRET` set in Vercel and matches Cal.com webhook config
- [ ] `NEXT_PUBLIC_CAL_USERNAME` set to `clickonversion` (or your Cal.com handle)
- [ ] All 6 event types created in Cal.com dashboard with correct slugs
- [ ] Webhook URL set to `https://www.clickonversion.com/api/webhooks/calcom`
- [ ] Video conferencing integration connected (Google Meet / Zoom)
- [ ] Availability configured in Cal.com
- [ ] `RESEND_API_KEY` set (so booking confirmation emails send)
- [ ] `EMAIL_FROM` and `NOTIFICATION_EMAIL` set
- [ ] Test end-to-end: book a discovery call, confirm email received

---

## Database Tables

| Table | Purpose |
|---|---|
| `pf_booking_rights` | Single-use tokens created after payment; status: unused → used |
| `pf_meetings` | Meeting records; updated by Cal.com webhooks |
| `pf_onboarding_responses` | Post-purchase onboarding form responses |

All tables have RLS enabled (migration `009_rls_meetings.sql`).

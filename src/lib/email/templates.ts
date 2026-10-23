import { SITE_URL } from "@/lib/env"

const BRAND = {
  name:    "ClicKonversion",
  color:   "#FF5A1F",
  mint:    "#78E6B3",
  dark:    "#101827",
  muted:   "#7A8799",
  email:   "hello@clickonversion.com",
  logoUrl: `${SITE_URL}/logos/01_logo_horizontal_claro.png`,
}

function layout(content: string, subject: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${subject}</title>
  <style>
    body { margin:0; padding:0; background:#f5f5f5; font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif; }
    .container { max-width:600px; margin:32px auto; background:#ffffff; border-radius:12px; overflow:hidden; box-shadow:0 1px 4px rgba(0,0,0,0.08); }
    .header { background:${BRAND.dark}; padding:28px 32px; }
    .header img { height:36px; }
    .body { padding:32px; }
    .footer { background:#f9f9f9; padding:20px 32px; border-top:1px solid #e5e7eb; }
    h1 { font-size:22px; font-weight:700; color:#111827; margin:0 0 12px; }
    p { font-size:15px; color:#374151; line-height:1.6; margin:0 0 16px; }
    .btn { display:inline-block; padding:12px 24px; background:${BRAND.color}; color:#ffffff !important; font-weight:600; font-size:14px; border-radius:8px; text-decoration:none; }
    .detail-box { background:#f9fafb; border:1px solid #e5e7eb; border-radius:8px; padding:16px; margin:20px 0; }
    .detail-row { display:flex; justify-content:space-between; padding:6px 0; border-bottom:1px solid #f3f4f6; font-size:14px; }
    .detail-row:last-child { border-bottom:none; }
    .label { color:#6b7280; }
    .value { color:#111827; font-weight:500; text-align:right; }
    .tag { display:inline-block; padding:3px 10px; border-radius:100px; font-size:12px; font-weight:600; }
    .tag-green { background:#d1fae5; color:#065f46; }
    .tag-orange { background:#ffedd5; color:#9a3412; }
    .note { font-size:13px; color:#6b7280; }
    .divider { border:none; border-top:1px solid #e5e7eb; margin:24px 0; }
  </style>
</head>
<body>
<div class="container">
  <div class="header">
    <img src="${BRAND.logoUrl}" alt="ClicKonversion" />
  </div>
  <div class="body">
    ${content}
  </div>
  <div class="footer">
    <p class="note" style="margin:0">
      This email was sent by ${BRAND.name} · <a href="mailto:${BRAND.email}" style="color:${BRAND.color}">${BRAND.email}</a>
    </p>
  </div>
</div>
</body>
</html>`
}

// ── 1. Booking confirmation (to client) ──────────────────────────────────────

export function bookingConfirmedEmail(params: {
  clientName: string
  meetingName: string
  startTime: string     // human-readable, already formatted
  clientTimezone: string
  videoCallUrl?: string
  meetingTypeSlug: string
}): { subject: string; html: string } {
  const subject = `Your ${params.meetingName} is confirmed — ${params.startTime}`
  const html = layout(`
    <h1>Your booking is confirmed ✓</h1>
    <p>Hi ${params.clientName},</p>
    <p>Your <strong>${params.meetingName}</strong> has been confirmed. Here are the details:</p>
    <div class="detail-box">
      <div class="detail-row">
        <span class="label">Session</span>
        <span class="value">${params.meetingName}</span>
      </div>
      <div class="detail-row">
        <span class="label">Date &amp; time</span>
        <span class="value">${params.startTime}</span>
      </div>
      <div class="detail-row">
        <span class="label">Your timezone</span>
        <span class="value">${params.clientTimezone}</span>
      </div>
      ${params.videoCallUrl ? `
      <div class="detail-row">
        <span class="label">Video call</span>
        <span class="value"><a href="${params.videoCallUrl}" style="color:${BRAND.color}">Join link</a></span>
      </div>` : ""}
    </div>
    ${params.videoCallUrl ? `<p><a href="${params.videoCallUrl}" class="btn">Join the call</a></p>` : ""}
    <hr class="divider" />
    <p class="note">You will receive a reminder 24 hours and 1 hour before the call. Need to reschedule? Use the link in your calendar invite.</p>
  `, subject)

  return { subject, html }
}

// ── 2. Booking confirmation (Spanish variant) ────────────────────────────────

export function bookingConfirmedEmailEs(params: {
  clientName: string
  meetingName: string
  startTime: string
  clientTimezone: string
  videoCallUrl?: string
}): { subject: string; html: string } {
  const subject = `Tu ${params.meetingName} está confirmada — ${params.startTime}`
  const html = layout(`
    <h1>Tu reserva está confirmada ✓</h1>
    <p>Hola ${params.clientName},</p>
    <p>Tu <strong>${params.meetingName}</strong> ha sido confirmada. Aquí están los detalles:</p>
    <div class="detail-box">
      <div class="detail-row">
        <span class="label">Sesión</span>
        <span class="value">${params.meetingName}</span>
      </div>
      <div class="detail-row">
        <span class="label">Fecha y hora</span>
        <span class="value">${params.startTime}</span>
      </div>
      <div class="detail-row">
        <span class="label">Tu zona horaria</span>
        <span class="value">${params.clientTimezone}</span>
      </div>
      ${params.videoCallUrl ? `
      <div class="detail-row">
        <span class="label">Videollamada</span>
        <span class="value"><a href="${params.videoCallUrl}" style="color:${BRAND.color}">Enlace de acceso</a></span>
      </div>` : ""}
    </div>
    ${params.videoCallUrl ? `<p><a href="${params.videoCallUrl}" class="btn">Unirse a la llamada</a></p>` : ""}
    <hr class="divider" />
    <p class="note">Recibirás un recordatorio 24 horas y 1 hora antes de la llamada. ¿Necesitas reprogramar? Usa el enlace en tu invitación de calendario.</p>
  `, subject)

  return { subject, html }
}

// ── 3. Booking right granted (after payment) ────────────────────────────────

export function bookingRightGrantedEmail(params: {
  clientName: string
  meetingName: string
  bookingUrl: string
  expiresAt: string
}): { subject: string; html: string } {
  const subject = `Your ${params.meetingName} session is ready to book`
  const html = layout(`
    <h1>Your session is ready to book</h1>
    <p>Hi ${params.clientName},</p>
    <p>Your payment for <strong>${params.meetingName}</strong> has been confirmed. Use the link below to schedule your session at a time that works for you.</p>
    <p><a href="${params.bookingUrl}" class="btn">Schedule your session →</a></p>
    <p class="note">This booking link is valid for one session and expires on ${params.expiresAt}.</p>
    <hr class="divider" />
    <p class="note">If you have any questions before scheduling, reply to this email and we'll get back to you.</p>
  `, subject)

  return { subject, html }
}

// ── 4. Booking cancelled ─────────────────────────────────────────────────────

export function bookingCancelledEmail(params: {
  clientName: string
  meetingName: string
  startTime: string
  reason?: string
  rescheduleUrl?: string
}): { subject: string; html: string } {
  const subject = `Your ${params.meetingName} has been cancelled`
  const html = layout(`
    <h1>Session cancelled</h1>
    <p>Hi ${params.clientName},</p>
    <p>Your <strong>${params.meetingName}</strong> scheduled for ${params.startTime} has been cancelled.</p>
    ${params.reason ? `<p><strong>Reason:</strong> ${params.reason}</p>` : ""}
    ${params.rescheduleUrl ? `
    <p>Need to reschedule? Use the link below:</p>
    <p><a href="${params.rescheduleUrl}" class="btn">Reschedule →</a></p>
    ` : ""}
    <p class="note">If you have questions, reply to this email or contact us at <a href="mailto:${BRAND.email}" style="color:${BRAND.color}">${BRAND.email}</a>.</p>
  `, subject)

  return { subject, html }
}

// ── 5. Booking rescheduled ───────────────────────────────────────────────────

export function bookingRescheduledEmail(params: {
  clientName: string
  meetingName: string
  newStartTime: string
  clientTimezone: string
  videoCallUrl?: string
}): { subject: string; html: string } {
  const subject = `Your ${params.meetingName} has been rescheduled — ${params.newStartTime}`
  const html = layout(`
    <h1>Session rescheduled</h1>
    <p>Hi ${params.clientName},</p>
    <p>Your <strong>${params.meetingName}</strong> has been rescheduled to:</p>
    <div class="detail-box">
      <div class="detail-row">
        <span class="label">New date &amp; time</span>
        <span class="value">${params.newStartTime}</span>
      </div>
      <div class="detail-row">
        <span class="label">Your timezone</span>
        <span class="value">${params.clientTimezone}</span>
      </div>
      ${params.videoCallUrl ? `
      <div class="detail-row">
        <span class="label">Video call</span>
        <span class="value"><a href="${params.videoCallUrl}" style="color:${BRAND.color}">Join link</a></span>
      </div>` : ""}
    </div>
    ${params.videoCallUrl ? `<p><a href="${params.videoCallUrl}" class="btn">Join the call</a></p>` : ""}
  `, subject)

  return { subject, html }
}

// ── 6. Onboarding submitted (to admin) ───────────────────────────────────────

export function onboardingSubmittedAdminEmail(params: {
  clientName: string
  clientEmail: string
  serviceName: string
  orderId: string
  reviewUrl: string
}): { subject: string; html: string } {
  const subject = `[ClicKonversion] New onboarding: ${params.serviceName} — ${params.clientName}`
  const html = layout(`
    <h1>New client onboarding submitted</h1>
    <div class="detail-box">
      <div class="detail-row">
        <span class="label">Client</span>
        <span class="value">${params.clientName}</span>
      </div>
      <div class="detail-row">
        <span class="label">Email</span>
        <span class="value">${params.clientEmail}</span>
      </div>
      <div class="detail-row">
        <span class="label">Service</span>
        <span class="value">${params.serviceName}</span>
      </div>
      <div class="detail-row">
        <span class="label">Order</span>
        <span class="value">${params.orderId}</span>
      </div>
    </div>
    <p><a href="${params.reviewUrl}" class="btn">Review onboarding →</a></p>
  `, subject)

  return { subject, html }
}

// ── 7. Onboarding confirmation (to client) ───────────────────────────────────

export function onboardingConfirmedClientEmail(params: {
  clientName: string
  serviceName: string
  nextSteps: string[]
  kickoffBookingUrl?: string
}): { subject: string; html: string } {
  const subject = `Your ${params.serviceName} onboarding is complete — here's what's next`
  const html = layout(`
    <h1>Onboarding complete — we're getting started</h1>
    <p>Hi ${params.clientName},</p>
    <p>Thank you for completing your onboarding for <strong>${params.serviceName}</strong>. Our team has everything they need to get started.</p>
    <p><strong>What happens next:</strong></p>
    <ul style="padding-left:20px">
      ${params.nextSteps.map((step) => `<li style="margin-bottom:8px;font-size:15px;color:#374151">${step}</li>`).join("")}
    </ul>
    ${params.kickoffBookingUrl ? `
    <hr class="divider" />
    <p>Schedule your kickoff call to align on goals and timeline:</p>
    <p><a href="${params.kickoffBookingUrl}" class="btn">Schedule kickoff call →</a></p>
    ` : ""}
    <hr class="divider" />
    <p class="note">Have a question? Reply to this email or reach us at <a href="mailto:${BRAND.email}" style="color:${BRAND.color}">${BRAND.email}</a>.</p>
  `, subject)

  return { subject, html }
}

// ── 8. Admin notification: meeting booked ────────────────────────────────────

export function meetingBookedAdminEmail(params: {
  clientName: string
  clientEmail: string
  meetingName: string
  startTime: string
  clientTimezone: string
  preBriefSummary: string
}): { subject: string; html: string } {
  const subject = `[ClicKonversion] New booking: ${params.meetingName} — ${params.clientName}`
  const html = layout(`
    <h1>New meeting booked</h1>
    <div class="detail-box">
      <div class="detail-row">
        <span class="label">Client</span>
        <span class="value">${params.clientName}</span>
      </div>
      <div class="detail-row">
        <span class="label">Email</span>
        <span class="value">${params.clientEmail}</span>
      </div>
      <div class="detail-row">
        <span class="label">Session</span>
        <span class="value">${params.meetingName}</span>
      </div>
      <div class="detail-row">
        <span class="label">Time</span>
        <span class="value">${params.startTime} (${params.clientTimezone})</span>
      </div>
    </div>
    <p><strong>Pre-brief submitted:</strong></p>
    <div class="detail-box" style="white-space:pre-wrap;font-size:13px;color:#374151">${params.preBriefSummary}</div>
  `, subject)

  return { subject, html }
}

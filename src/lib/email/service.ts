import { getServerEnv, SITE_URL } from "@/lib/env"

interface SendEmailParams {
  to: string
  subject: string
  html: string
  replyTo?: string
}

/**
 * Send a transactional email via Resend.
 * Falls back to a console log in development when RESEND_API_KEY is not set.
 */
export async function sendEmail(params: SendEmailParams): Promise<void> {
  const { resendApiKey, emailFrom } = getServerEnv()

  if (!resendApiKey) {
    if (process.env.NODE_ENV === "development") {
      console.log("[email] DEV — would send to:", params.to, "subject:", params.subject)
    }
    return
  }

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${resendApiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from:     emailFrom ?? "ClicKonversion <notifications@clickonversion.com>",
      to:       params.to,
      subject:  params.subject,
      html:     params.html,
      reply_to: params.replyTo ?? "hello@clickonversion.com",
    }),
  })

  if (!res.ok) {
    const text = await res.text()
    console.error("[email] Resend error:", text)
    // Don't throw — email failure should not break the booking flow
  }
}

/** Send a password reset email with the given reset URL */
export async function sendPasswordResetEmail({ to, resetUrl }: { to: string; resetUrl: string }): Promise<void> {
  await sendEmail({
    to,
    subject: "Reset your ClicKonversion password",
    html: `
      <p>Hi,</p>
      <p>You requested a password reset. Click the link below to choose a new password:</p>
      <p><a href="${resetUrl}">Reset my password</a></p>
      <p>This link expires in 1 hour. If you didn't request this, you can ignore this email.</p>
      <p>— The ClicKonversion team</p>
    `,
  })
}

/** Send to both client (primary) and admin notification copy */
export async function sendEmailWithAdminCopy(params: {
  clientEmail: string
  subject: string
  html: string
  adminSubject?: string
  adminHtml?: string
}): Promise<void> {
  const { notificationEmail } = getServerEnv()

  await Promise.allSettled([
    sendEmail({ to: params.clientEmail, subject: params.subject, html: params.html }),
    notificationEmail
      ? sendEmail({
          to:      notificationEmail,
          subject: params.adminSubject ?? `[Admin copy] ${params.subject}`,
          html:    params.adminHtml ?? params.html,
        })
      : Promise.resolve(),
  ])
}

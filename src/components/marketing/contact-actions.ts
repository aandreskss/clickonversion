"use server"

export interface ContactData {
  name: string
  email: string
  needs: string[]
  message: string
}

export async function sendContactAction(data: ContactData): Promise<{ ok: boolean }> {
  const { name, email, needs, message } = data

  const html = `
    <h2>Nuevo mensaje de contacto</h2>
    <p><strong>Nombre:</strong> ${name}</p>
    <p><strong>Email:</strong> ${email}</p>
    <p><strong>Necesita:</strong> ${needs.length > 0 ? needs.join(", ") : "No especificado"}</p>
    <p><strong>Mensaje:</strong></p>
    <blockquote style="border-left:3px solid #345CFF;padding-left:12px;color:#3A3B40">${message || "(sin mensaje adicional)"}</blockquote>
  `

  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    // Dev mode: log only
    console.log("[Contact form] Would send email:", { name, email, needs, message })
    return { ok: true }
  }

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: process.env.EMAIL_FROM ?? "ClicKonversion <notifications@clickonversion.com>",
      to: ["arnaldo@clickonversion.com"],
      subject: `Nuevo mensaje de contacto de ${name}`,
      html,
      reply_to: email,
    }),
  })

  if (!res.ok) {
    const err = await res.text().catch(() => "unknown")
    console.error("[Contact form] Resend error:", err)
    throw new Error("Failed to send email")
  }

  return { ok: true }
}

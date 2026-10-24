"use server"

import { db } from "@/lib/db"
import { pfClientOrgs } from "@/lib/db/schema"
import { eq } from "drizzle-orm"
import { revalidatePath } from "next/cache"

// ── Create Client ─────────────────────────────────────────────────────────────

export async function createClientAction(formData: FormData): Promise<{ error?: string }> {
  try {
    const name = (formData.get("name") as string | null)?.trim() ?? ""
    const slug = (formData.get("slug") as string | null)?.trim() ?? ""
    const billingEmail = (formData.get("billingEmail") as string | null)?.trim() ?? ""

    if (!name || !slug) {
      return { error: "Nombre y slug son requeridos." }
    }

    // Basic slug validation
    if (!/^[a-z0-9-]+$/.test(slug)) {
      return { error: "Slug solo puede contener letras minúsculas, números y guiones." }
    }

    await db.insert(pfClientOrgs).values({
      name,
      slug,
      billingEmail: billingEmail || null,
    })

    revalidatePath("/admin/commercial/clients")
    return {}
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Error inesperado"
    if (msg.includes("unique")) return { error: "Ya existe un cliente con ese slug." }
    return { error: msg }
  }
}

// ── Delete Client ─────────────────────────────────────────────────────────────

export async function deleteClientAction(id: string): Promise<{ error?: string }> {
  try {
    await db.delete(pfClientOrgs).where(eq(pfClientOrgs.id, id))
    revalidatePath("/admin/commercial/clients")
    return {}
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Error inesperado"
    return { error: msg }
  }
}

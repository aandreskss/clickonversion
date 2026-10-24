"use server"

import { db } from "@/lib/db"
import { pfServiceCatalog, pfServicePrices } from "@/lib/db/schema"
import { eq } from "drizzle-orm"
import { revalidatePath } from "next/cache"

// ── Create Service ────────────────────────────────────────────────────────────

export async function createServiceAction(formData: FormData): Promise<{ error?: string }> {
  try {
    const nameEn = (formData.get("nameEn") as string | null)?.trim() ?? ""
    const nameEs = (formData.get("nameEs") as string | null)?.trim() ?? ""
    const descriptionEn = (formData.get("descriptionEn") as string | null)?.trim() ?? ""
    const descriptionEs = (formData.get("descriptionEs") as string | null)?.trim() ?? ""
    const category = (formData.get("category") as string | null) ?? "seo"
    const slug = (formData.get("slug") as string | null)?.trim() ?? ""
    const sortOrder = parseInt((formData.get("sortOrder") as string | null) ?? "0", 10)

    // Price fields
    const priceNameEn = (formData.get("priceNameEn") as string | null)?.trim() ?? ""
    const amountStr = (formData.get("amount") as string | null)?.trim() ?? ""
    const billingPeriod = (formData.get("billingPeriod") as string | null) ?? "one_time"
    const priceIsActive = formData.get("priceIsActive") === "on"

    if (!nameEn || !nameEs || !slug) {
      return { error: "Name EN, Name ES y Slug son requeridos." }
    }

    const validCategories = ["seo", "paid-media", "automation", "support"] as const
    if (!validCategories.includes(category as (typeof validCategories)[number])) {
      return { error: "Categoría inválida." }
    }

    const inserted = await db
      .insert(pfServiceCatalog)
      .values({
        slug,
        category: category as "seo" | "paid-media" | "automation" | "support",
        nameEn,
        nameEs,
        descriptionEn,
        descriptionEs,
        isPublished: false,
        sortOrder: isNaN(sortOrder) ? 0 : sortOrder,
      })
      .returning()

    if (!inserted[0]) {
      return { error: "No se pudo crear el servicio." }
    }

    const serviceId = inserted[0].id

    // Insert price if name provided
    if (priceNameEn) {
      const amount = amountStr ? parseFloat(amountStr) : null
      const validPeriods = ["monthly", "quarterly", "annual", "one_time"] as const
      const normalizedPeriod = billingPeriod === "yearly" ? "annual" : billingPeriod
      const finalPeriod = validPeriods.includes(normalizedPeriod as (typeof validPeriods)[number])
        ? (normalizedPeriod as (typeof validPeriods)[number])
        : "one_time"

      const priceType = finalPeriod === "one_time" ? "ONE_TIME" : "RECURRING"

      await db.insert(pfServicePrices).values({
        serviceId,
        nameEn: priceNameEn,
        nameEs: priceNameEn, // default to EN if not provided
        priceType: priceType as "ONE_TIME" | "RECURRING" | "STARTING_AT" | "CUSTOM_QUOTE",
        basePriceUsd: amount !== null ? String(amount) : null,
        billingPeriodVal: finalPeriod,
        isActive: priceIsActive,
        sortOrder: 0,
      })
    }

    revalidatePath("/admin/commercial/catalog")
    return {}
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Error inesperado"
    if (msg.includes("unique")) return { error: "Ya existe un servicio con ese slug." }
    return { error: msg }
  }
}

// ── Update Service ────────────────────────────────────────────────────────────

export async function updateServiceAction(
  id: string,
  formData: FormData
): Promise<{ error?: string }> {
  try {
    const nameEn = (formData.get("nameEn") as string | null)?.trim() ?? ""
    const nameEs = (formData.get("nameEs") as string | null)?.trim() ?? ""
    const descriptionEn = (formData.get("descriptionEn") as string | null)?.trim() ?? ""
    const descriptionEs = (formData.get("descriptionEs") as string | null)?.trim() ?? ""
    const category = (formData.get("category") as string | null) ?? "seo"
    const slug = (formData.get("slug") as string | null)?.trim() ?? ""
    const sortOrder = parseInt((formData.get("sortOrder") as string | null) ?? "0", 10)

    // Price fields
    const priceId = (formData.get("priceId") as string | null)?.trim() ?? ""
    const priceNameEn = (formData.get("priceNameEn") as string | null)?.trim() ?? ""
    const amountStr = (formData.get("amount") as string | null)?.trim() ?? ""
    const billingPeriod = (formData.get("billingPeriod") as string | null) ?? "one_time"
    const priceIsActive = formData.get("priceIsActive") === "on"

    if (!nameEn || !nameEs || !slug) {
      return { error: "Name EN, Name ES y Slug son requeridos." }
    }

    const validCategories = ["seo", "paid-media", "automation", "support"] as const
    if (!validCategories.includes(category as (typeof validCategories)[number])) {
      return { error: "Categoría inválida." }
    }

    await db
      .update(pfServiceCatalog)
      .set({
        slug,
        category: category as "seo" | "paid-media" | "automation" | "support",
        nameEn,
        nameEs,
        descriptionEn,
        descriptionEs,
        sortOrder: isNaN(sortOrder) ? 0 : sortOrder,
        updatedAt: new Date(),
      })
      .where(eq(pfServiceCatalog.id, id))

    // Update or insert price
    if (priceNameEn) {
      const amount = amountStr ? parseFloat(amountStr) : null
      const validPeriods = ["monthly", "quarterly", "annual", "one_time"] as const
      const normalizedPeriod = billingPeriod === "yearly" ? "annual" : billingPeriod
      const finalPeriod = validPeriods.includes(normalizedPeriod as (typeof validPeriods)[number])
        ? (normalizedPeriod as (typeof validPeriods)[number])
        : "one_time"

      const priceType = finalPeriod === "one_time" ? "ONE_TIME" : "RECURRING"

      if (priceId) {
        await db
          .update(pfServicePrices)
          .set({
            nameEn: priceNameEn,
            basePriceUsd: amount !== null ? String(amount) : null,
            billingPeriodVal: finalPeriod,
            priceType: priceType as "ONE_TIME" | "RECURRING" | "STARTING_AT" | "CUSTOM_QUOTE",
            isActive: priceIsActive,
            updatedAt: new Date(),
          })
          .where(eq(pfServicePrices.id, priceId))
      } else {
        await db.insert(pfServicePrices).values({
          serviceId: id,
          nameEn: priceNameEn,
          nameEs: priceNameEn,
          priceType: priceType as "ONE_TIME" | "RECURRING" | "STARTING_AT" | "CUSTOM_QUOTE",
          basePriceUsd: amount !== null ? String(amount) : null,
          billingPeriodVal: finalPeriod,
          isActive: priceIsActive,
          sortOrder: 0,
        })
      }
    }

    revalidatePath("/admin/commercial/catalog")
    return {}
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Error inesperado"
    if (msg.includes("unique")) return { error: "Ya existe un servicio con ese slug." }
    return { error: msg }
  }
}

// ── Delete Service ────────────────────────────────────────────────────────────

export async function deleteServiceAction(id: string): Promise<{ error?: string }> {
  try {
    await db.delete(pfServiceCatalog).where(eq(pfServiceCatalog.id, id))
    revalidatePath("/admin/commercial/catalog")
    return {}
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Error inesperado"
    return { error: msg }
  }
}

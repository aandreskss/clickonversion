import { createAdminClient } from "@/lib/supabase/server"
import type { SpecialistProfile } from "@/types/admin"

// Active request statuses that count toward a specialist's load
const ACTIVE_STATUSES = [
  "in_progress",
  "active",
  "consultation_scheduled",
  "waiting_third_party",
  "review",
] as const

// ── Public API ────────────────────────────────────────────────────────────────

export async function getSpecialists(): Promise<SpecialistProfile[]> {
  const supabase = createAdminClient()

  const { data, error } = await supabase
    .from("pf_specialist_profiles")
    .select(
      `
      *,
      pf_platform_users ( id, email, full_name, avatar_url )
    `
    )
    .order("display_name", { ascending: true })

  if (error) throw new Error(error.message)

  const profiles = data ?? []

  // Compute current load for each specialist in parallel
  const loadResults = await Promise.allSettled(
    profiles.map((profile) =>
      supabase
        .from("pf_requests")
        .select("id", { count: "exact", head: true })
        .eq("assigned_specialist_id", profile.id as string)
        .in("status", ACTIVE_STATUSES)
    )
  )

  return profiles.map((profile, i) => {
    const rawUser = profile.pf_platform_users
    const user = Array.isArray(rawUser) ? rawUser[0] : rawUser

    const loadResult = loadResults[i]
    const currentLoad =
      loadResult.status === "fulfilled" ? (loadResult.value.count ?? 0) : 0

    return mapSpecialistProfile(
      profile as Record<string, unknown>,
      user as Record<string, unknown> | null,
      currentLoad,
      undefined
    )
  })
}

export async function getSpecialist(id: string): Promise<SpecialistProfile | null> {
  const supabase = createAdminClient()

  const [profileResult, loadResult, servicesResult] = await Promise.all([
    supabase
      .from("pf_specialist_profiles")
      .select("*, pf_platform_users ( id, email, full_name, avatar_url )")
      .eq("id", id)
      .single(),

    supabase
      .from("pf_requests")
      .select("id", { count: "exact", head: true })
      .eq("assigned_specialist_id", id)
      .in("status", ACTIVE_STATUSES),

    supabase
      .from("pf_specialist_services")
      .select("service_id")
      .eq("specialist_id", id)
      .eq("enabled", true),
  ])

  if (profileResult.error || !profileResult.data) return null

  const profile = profileResult.data as Record<string, unknown>
  const rawUser = profile.pf_platform_users
  const user = Array.isArray(rawUser) ? rawUser[0] : rawUser

  const currentLoad = loadResult.count ?? 0
  const enabledServices = (servicesResult.data ?? []).map(
    (row) => row.service_id as string
  )

  return mapSpecialistProfile(
    profile,
    user as Record<string, unknown> | null,
    currentLoad,
    enabledServices
  )
}

export async function createSpecialist(data: {
  userId: string
  displayName: string
  bio?: string
  timezone?: string
  maxConcurrent?: number
  serviceIds?: string[]
}): Promise<SpecialistProfile> {
  const supabase = createAdminClient()

  // Create the specialist profile
  const { data: profile, error: profileError } = await supabase
    .from("pf_specialist_profiles")
    .insert({
      user_id: data.userId,
      display_name: data.displayName,
      bio: data.bio ?? null,
      timezone: data.timezone ?? "America/New_York",
      max_concurrent: data.maxConcurrent ?? 3,
      is_active: true,
    })
    .select()
    .single()

  if (profileError || !profile) {
    throw new Error(profileError?.message ?? "Failed to create specialist profile")
  }

  // Promote the platform user to specialist admin_role
  await supabase
    .from("pf_platform_users")
    .update({ admin_role: "specialist" })
    .eq("id", data.userId)

  // Insert enabled services if provided
  if (data.serviceIds?.length) {
    const serviceRows = data.serviceIds.map((serviceId) => ({
      specialist_id: (profile as Record<string, unknown>).id as string,
      service_id: serviceId,
      enabled: true,
    }))

    const { error: servicesError } = await supabase
      .from("pf_specialist_services")
      .insert(serviceRows)

    if (servicesError) {
      console.error("Failed to insert specialist services:", servicesError.message)
    }
  }

  const typedProfile = profile as Record<string, unknown>
  return {
    id: typedProfile.id as string,
    userId: typedProfile.user_id as string,
    displayName: typedProfile.display_name as string,
    bio: (typedProfile.bio as string | null) ?? null,
    timezone: typedProfile.timezone as string,
    maxConcurrent: typedProfile.max_concurrent as number,
    isActive: typedProfile.is_active as boolean,
    createdAt: typedProfile.created_at as string,
    updatedAt: typedProfile.updated_at as string,
    currentLoad: 0,
    enabledServices: data.serviceIds ?? [],
  }
}

export async function updateSpecialist(
  id: string,
  data: Partial<{
    displayName: string
    bio: string | null
    timezone: string
    maxConcurrent: number
    isActive: boolean
    serviceIds: string[]
  }>
): Promise<void> {
  const supabase = createAdminClient()

  const update: Record<string, unknown> = {}
  if (data.displayName !== undefined) update.display_name = data.displayName
  if (data.bio !== undefined) update.bio = data.bio
  if (data.timezone !== undefined) update.timezone = data.timezone
  if (data.maxConcurrent !== undefined) update.max_concurrent = data.maxConcurrent
  if (data.isActive !== undefined) update.is_active = data.isActive

  const tasks: Promise<void>[] = []

  if (Object.keys(update).length > 0) {
    update.updated_at = new Date().toISOString()
    tasks.push(
      Promise.resolve(
        supabase
          .from("pf_specialist_profiles")
          .update(update)
          .eq("id", id)
      ).then(({ error }) => {
        if (error) throw new Error(error.message)
      })
    )
  }

  if (data.serviceIds !== undefined) {
    // Replace all service associations
    tasks.push(
      Promise.resolve(
        supabase
          .from("pf_specialist_services")
          .delete()
          .eq("specialist_id", id)
      ).then(async ({ error: deleteError }) => {
        if (deleteError) throw new Error(deleteError.message)

        if (data.serviceIds!.length > 0) {
          const rows = data.serviceIds!.map((serviceId) => ({
            specialist_id: id,
            service_id: serviceId,
            enabled: true,
          }))

          const { error: insertError } = await supabase
            .from("pf_specialist_services")
            .insert(rows)

          if (insertError) throw new Error(insertError.message)
        }
      })
    )
  }

  await Promise.all(tasks)
}

export async function canAssignToSpecialist(
  specialistId: string
): Promise<{ canAssign: boolean; currentLoad: number; maxConcurrent: number }> {
  const supabase = createAdminClient()

  const [profileResult, loadResult] = await Promise.all([
    supabase
      .from("pf_specialist_profiles")
      .select("max_concurrent, is_active")
      .eq("id", specialistId)
      .single(),

    supabase
      .from("pf_requests")
      .select("id", { count: "exact", head: true })
      .eq("assigned_specialist_id", specialistId)
      .in("status", ACTIVE_STATUSES),
  ])

  if (profileResult.error || !profileResult.data) {
    return { canAssign: false, currentLoad: 0, maxConcurrent: 0 }
  }

  const maxConcurrent = profileResult.data.max_concurrent as number
  const isActive = profileResult.data.is_active as boolean
  const currentLoad = loadResult.count ?? 0

  return {
    canAssign: isActive && currentLoad < maxConcurrent,
    currentLoad,
    maxConcurrent,
  }
}

// ── Mapper ────────────────────────────────────────────────────────────────────

function mapSpecialistProfile(
  profile: Record<string, unknown>,
  user: Record<string, unknown> | null,
  currentLoad: number,
  enabledServices: string[] | undefined
): SpecialistProfile {
  return {
    id: profile.id as string,
    userId: profile.user_id as string,
    displayName: profile.display_name as string,
    bio: (profile.bio as string | null) ?? null,
    timezone: profile.timezone as string,
    maxConcurrent: profile.max_concurrent as number,
    isActive: profile.is_active as boolean,
    createdAt: profile.created_at as string,
    updatedAt: profile.updated_at as string,
    currentLoad,
    enabledServices,
    user: user
      ? {
          email: user.email as string,
          fullName: (user.full_name as string | null) ?? null,
          avatarUrl: (user.avatar_url as string | null) ?? null,
        }
      : undefined,
  }
}

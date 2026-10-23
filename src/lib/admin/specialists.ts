import { db } from "@/lib/db"
import { pfSpecialistProfiles, pfSpecialistServices, pfPlatformUsers, pfRequests, users } from "@/lib/db/schema"
import { eq, inArray, asc } from "drizzle-orm"
import type { SpecialistProfile } from "@/types/admin"

const ACTIVE_STATUSES = ["in_progress", "active", "consultation_scheduled", "waiting_third_party", "review"] as const

export async function getSpecialists(): Promise<SpecialistProfile[]> {
  const profiles = await db
    .select({
      profile: pfSpecialistProfiles,
      userEmail: users.email,
      userName: pfPlatformUsers.displayName,
    })
    .from(pfSpecialistProfiles)
    .leftJoin(pfPlatformUsers, eq(pfSpecialistProfiles.userId, pfPlatformUsers.id))
    .leftJoin(users, eq(pfPlatformUsers.id, users.id))
    .orderBy(asc(pfSpecialistProfiles.displayName))

  const loadResults = await Promise.allSettled(
    profiles.map((p) =>
      db
        .select({ n: pfRequests.id })
        .from(pfRequests)
        .where(eq(pfRequests.assignedSpecialistId, p.profile.id))
        .then((rows) => rows.length),
    ),
  )

  return profiles.map(({ profile, userEmail, userName }, i) => ({
    id: profile.id,
    userId: profile.userId,
    displayName: profile.displayName,
    bio: profile.bio ?? null,
    timezone: profile.timezone,
    maxConcurrent: profile.maxConcurrent,
    isActive: profile.isActive,
    createdAt: profile.createdAt?.toISOString() ?? "",
    updatedAt: profile.updatedAt?.toISOString() ?? "",
    currentLoad: loadResults[i].status === "fulfilled" ? loadResults[i].value : 0,
    user: userEmail ? { email: userEmail, fullName: userName ?? null, avatarUrl: null } : undefined,
  }))
}

export async function getSpecialist(id: string): Promise<SpecialistProfile | null> {
  const [row] = await db
    .select({
      profile: pfSpecialistProfiles,
      userEmail: users.email,
      userName: pfPlatformUsers.displayName,
    })
    .from(pfSpecialistProfiles)
    .leftJoin(pfPlatformUsers, eq(pfSpecialistProfiles.userId, pfPlatformUsers.id))
    .leftJoin(users, eq(pfPlatformUsers.id, users.id))
    .where(eq(pfSpecialistProfiles.id, id))
    .limit(1)

  if (!row) return null

  const [loadRows, serviceRows] = await Promise.all([
    db.select({ id: pfRequests.id }).from(pfRequests).where(eq(pfRequests.assignedSpecialistId, id)),
    db
      .select({ serviceId: pfSpecialistServices.serviceId })
      .from(pfSpecialistServices)
      .where(eq(pfSpecialistServices.specialistId, id)),
  ])

  return {
    id: row.profile.id,
    userId: row.profile.userId,
    displayName: row.profile.displayName,
    bio: row.profile.bio ?? null,
    timezone: row.profile.timezone,
    maxConcurrent: row.profile.maxConcurrent,
    isActive: row.profile.isActive,
    createdAt: row.profile.createdAt?.toISOString() ?? "",
    updatedAt: row.profile.updatedAt?.toISOString() ?? "",
    currentLoad: loadRows.length,
    enabledServices: serviceRows.map((s) => s.serviceId),
    user: row.userEmail ? { email: row.userEmail, fullName: row.userName ?? null, avatarUrl: null } : undefined,
  }
}

export async function createSpecialist(data: {
  userId: string
  displayName: string
  bio?: string
  timezone?: string
  maxConcurrent?: number
  serviceIds?: string[]
}): Promise<SpecialistProfile> {
  const [profile] = await db
    .insert(pfSpecialistProfiles)
    .values({
      userId: data.userId,
      displayName: data.displayName,
      bio: data.bio ?? null,
      timezone: data.timezone ?? "America/New_York",
      maxConcurrent: data.maxConcurrent ?? 3,
      isActive: true,
    })
    .returning()

  await db.update(pfPlatformUsers).set({ adminRole: "specialist" }).where(eq(pfPlatformUsers.id, data.userId))

  if (data.serviceIds?.length) {
    await db.insert(pfSpecialistServices).values(
      data.serviceIds.map((serviceId) => ({ specialistId: profile.id, serviceId, enabled: true })),
    )
  }

  return {
    id: profile.id,
    userId: profile.userId,
    displayName: profile.displayName,
    bio: profile.bio ?? null,
    timezone: profile.timezone,
    maxConcurrent: profile.maxConcurrent,
    isActive: profile.isActive,
    createdAt: profile.createdAt?.toISOString() ?? "",
    updatedAt: profile.updatedAt?.toISOString() ?? "",
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
  }>,
): Promise<void> {
  const profileUpdate: Record<string, unknown> = {}
  if (data.displayName !== undefined) profileUpdate.displayName = data.displayName
  if (data.bio !== undefined) profileUpdate.bio = data.bio
  if (data.timezone !== undefined) profileUpdate.timezone = data.timezone
  if (data.maxConcurrent !== undefined) profileUpdate.maxConcurrent = data.maxConcurrent
  if (data.isActive !== undefined) profileUpdate.isActive = data.isActive

  const tasks: Promise<unknown>[] = []

  if (Object.keys(profileUpdate).length) {
    tasks.push(db.update(pfSpecialistProfiles).set(profileUpdate).where(eq(pfSpecialistProfiles.id, id)))
  }

  if (data.serviceIds !== undefined) {
    tasks.push(
      db
        .delete(pfSpecialistServices)
        .where(eq(pfSpecialistServices.specialistId, id))
        .then(async () => {
          if (data.serviceIds!.length) {
            await db.insert(pfSpecialistServices).values(
              data.serviceIds!.map((serviceId) => ({ specialistId: id, serviceId, enabled: true })),
            )
          }
        }),
    )
  }

  await Promise.all(tasks)
}

export async function canAssignToSpecialist(
  specialistId: string,
): Promise<{ canAssign: boolean; currentLoad: number; maxConcurrent: number }> {
  const [profile] = await db
    .select({ maxConcurrent: pfSpecialistProfiles.maxConcurrent, isActive: pfSpecialistProfiles.isActive })
    .from(pfSpecialistProfiles)
    .where(eq(pfSpecialistProfiles.id, specialistId))
    .limit(1)

  if (!profile) return { canAssign: false, currentLoad: 0, maxConcurrent: 0 }

  const loadRows = await db
    .select({ id: pfRequests.id })
    .from(pfRequests)
    .where(eq(pfRequests.assignedSpecialistId, specialistId))

  const currentLoad = loadRows.length

  return {
    canAssign: profile.isActive && currentLoad < profile.maxConcurrent,
    currentLoad,
    maxConcurrent: profile.maxConcurrent,
  }
}

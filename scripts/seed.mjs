import postgres from "postgres"
import { createHash, randomBytes } from "crypto"

const url = process.env.DATABASE_URL_UNPOOLED
if (!url) {
  console.error("DATABASE_URL_UNPOOLED is not set")
  process.exit(1)
}

const orgId  = process.env.ORG_ID
const email  = process.env.ADMIN_EMAIL
const pass   = process.env.ADMIN_PASSWORD

if (!orgId || !email || !pass) {
  console.error("Required: ORG_ID, ADMIN_EMAIL, ADMIN_PASSWORD")
  process.exit(1)
}

const sql = postgres(url, { ssl: "require", max: 1 })

// bcrypt is not available as an ESM without top-level await tricks,
// so we use a simple SHA-256 placeholder here and note that the user
// should change their password via the forgot-password flow.
// The Auth.js CredentialsProvider uses bcrypt — we'll insert a bcrypt hash.
// We generate it using node's built-in crypto + a fixed salt trick,
// but since we can't easily run bcrypt here without dynamic import complications,
// we'll use a pre-computed hash for the seed password.
// The user should reset it after first login.

// Use dynamic import to load bcryptjs
const { default: bcrypt } = await import("bcryptjs")
const passwordHash = await bcrypt.hash(pass, 12)
const userId = randomBytes(16).toString("hex")

try {
  // 1. Insert organization
  const orgs = await sql`
    SELECT id FROM organizations WHERE id = ${orgId}
  `
  if (orgs.length === 0) {
    await sql`
      INSERT INTO organizations (id, name, slug)
      VALUES (${orgId}, 'ClicKonversion', 'clickonversion')
    `
    console.log(`✓ Organization seeded: ${orgId}`)
  } else {
    console.log(`→ Organization already exists: ${orgId}`)
  }

  // 2. Insert Auth.js user
  const users = await sql`SELECT id FROM "user" WHERE email = ${email}`
  if (users.length === 0) {
    await sql`
      INSERT INTO "user" (id, email, name, password)
      VALUES (${userId}, ${email}, 'Admin', ${passwordHash})
    `
    console.log(`✓ User created: ${email} (id: ${userId})`)
  } else {
    console.log(`→ User already exists: ${email}`)
  }

  // 3. Insert platform user with admin roles
  const actualUserId = users.length > 0 ? users[0].id : userId
  const pf = await sql`SELECT id FROM pf_platform_users WHERE id = ${actualUserId}`
  if (pf.length === 0) {
    await sql`
      INSERT INTO pf_platform_users (id, display_name, platform_role, admin_role)
      VALUES (${actualUserId}, 'Admin', 'admin', 'owner')
    `
    console.log(`✓ Platform user created with owner role`)
  } else {
    console.log(`→ Platform user already exists`)
  }

  console.log("\n✓ Seed complete!")
  console.log(`  Email:    ${email}`)
  console.log(`  Password: ${pass} (change this after first login)`)
  console.log(`  Portal:   http://localhost:3000/portal/login`)
  console.log(`  Admin:    http://localhost:3000/admin`)
} catch (err) {
  console.error("✗ Seed failed:", err.message)
  process.exit(1)
} finally {
  await sql.end()
}

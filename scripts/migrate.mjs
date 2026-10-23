import postgres from "postgres"
import { readFileSync } from "fs"
import { join, dirname } from "path"
import { fileURLToPath } from "url"

const __dirname = dirname(fileURLToPath(import.meta.url))

const url = process.env.DATABASE_URL_UNPOOLED
if (!url) {
  console.error("DATABASE_URL_UNPOOLED is not set")
  process.exit(1)
}

const sql = postgres(url, { ssl: "require", max: 1 })

const migrationPath = join(__dirname, "../drizzle/0000_illegal_silhouette.sql")
const migrationSql = readFileSync(migrationPath, "utf-8")

// Drizzle separates statements with --> statement-breakpoint
const statements = migrationSql
  .split("--> statement-breakpoint")
  .map((s) => s.trim())
  .filter(Boolean)

console.log(`Applying ${statements.length} statements...`)

try {
  for (let i = 0; i < statements.length; i++) {
    const stmt = statements[i]
    process.stdout.write(`[${i + 1}/${statements.length}] `)
    const preview = stmt.slice(0, 60).replace(/\n/g, " ")
    process.stdout.write(`${preview}...\n`)
    try {
      await sql.unsafe(stmt)
    } catch (err) {
      if (err.code === "42P07" || err.code === "42P06" || err.code === "42710") {
        // Table/schema/type already exists — skip
        console.log(`  → Already exists, skipping`)
      } else {
        console.error(`  ✗ Error: ${err.message}`)
        throw err
      }
    }
  }
  console.log("\n✓ Migration complete!")
} catch (err) {
  console.error("\n✗ Migration failed:", err.message)
  process.exit(1)
} finally {
  await sql.end()
}

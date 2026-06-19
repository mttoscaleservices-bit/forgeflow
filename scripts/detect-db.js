const fs = require("fs")
const path = require("path")

const dbUrl = process.env.DATABASE_URL || ""
const schemaDir = path.join(__dirname, "..", "prisma")
const targetSchema = path.join(schemaDir, "schema.prisma")

let sourceSchema
if (dbUrl.startsWith("postgresql://") || dbUrl.startsWith("postgres://")) {
  sourceSchema = path.join(schemaDir, "schema.postgres.prisma")
  console.log("🐘 Detected PostgreSQL database")
} else {
  sourceSchema = path.join(schemaDir, "schema.sqlite.prisma")
  console.log("📁 Detected SQLite database")
}

if (fs.existsSync(sourceSchema)) {
  fs.copyFileSync(sourceSchema, targetSchema)
  console.log(`✅ Schema configured: ${path.basename(sourceSchema)}`)
} else {
  console.error(`❌ Schema file not found: ${sourceSchema}`)
  process.exit(1)
}

import "../shared/env";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import * as fs from "fs";
import { sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/node-postgres";
import { must } from "../shared/must";
const pgURL = must(process.env.PG_URL, "PG_URL is required");
const db = drizzle(pgURL);

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function seed() {
  const sqlFilePath = join(__dirname, "../server/db/seed.sql.data");
  const sqlContent = fs.readFileSync(sqlFilePath, "utf-8");

  try {
    if (
      (await (
        await db.execute(sql.raw("select 1 from workspace limit 1"))
      ).rowCount) === 1
    ) {
      console.log("Database already seeded.");
    } else {
      console.log("Seeding database...");
      await db.execute(sql.raw(sqlContent));
      console.log("✅ Seeding complete.");
    }
    process.exit(0);
  } catch (err) {
    console.error("❌ Seeding failed:", err);
    process.exit(1);
  }
}

await seed();

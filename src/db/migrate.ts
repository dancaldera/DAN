import { load } from "@std/dotenv";
import { query, closePool } from "./pool.ts";

async function runMigrations() {
  await load({ export: true });
  console.log("🔄 Running database migrations...");
  console.log("DB Config:", {
    host: Deno.env.get("PGHOST"),
    port: Deno.env.get("PGPORT"),
    user: Deno.env.get("PGUSER"),
    password: Deno.env.get("PGPASSWORD") ? "***" : "NOT SET",
    database: Deno.env.get("PGDATABASE")
  });

  try {
    await query(`
      CREATE TABLE IF NOT EXISTS todos (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        completed BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    console.log("✅ Todos table created or already exists");

    await query(`
      INSERT INTO todos (title, completed) 
      VALUES 
        ('Learn Deno', false),
        ('Build HTMX app', false),
        ('Deploy to production', false)
      ON CONFLICT DO NOTHING
    `);

    console.log("✅ Sample data inserted");
    console.log("🎉 Migrations completed successfully!");

  } catch (error) {
    console.error("❌ Migration failed:", error);
    throw error;
  } finally {
    await closePool();
  }
}

if (import.meta.main) {
  runMigrations().catch(console.error);
}
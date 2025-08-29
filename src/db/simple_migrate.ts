import { load } from "@std/dotenv";
import { Client } from "postgres";

async function simpleMigration() {
  await load({ export: true });
  
  console.log("🔄 Running simple database migration...");
  
  const client = new Client({
    hostname: Deno.env.get("PGHOST") ?? "127.0.0.1",
    port: Number(Deno.env.get("PGPORT") ?? 5432),
    user: Deno.env.get("PGUSER") ?? "deno",
    password: Deno.env.get("PGPASSWORD") ?? "",
    database: Deno.env.get("PGDATABASE") ?? "denodb",
  });

  try {
    await client.connect();
    console.log("✅ Connected to database");

    await client.queryObject(`
      CREATE TABLE IF NOT EXISTS todos (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        completed BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    console.log("✅ Todos table created or already exists");

    await client.queryObject(`
      INSERT INTO todos (title, completed) 
      VALUES 
        ('Learn Deno', false),
        ('Build HTMX app', false),
        ('Deploy to production', false)
      ON CONFLICT DO NOTHING
    `);

    console.log("✅ Sample data inserted");
    console.log("🎉 Migration completed successfully!");

  } catch (error) {
    console.error("❌ Migration failed:", error);
    throw error;
  } finally {
    await client.end();
  }
}

if (import.meta.main) {
  simpleMigration().catch(console.error);
}
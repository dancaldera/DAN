import { load } from "@std/dotenv";

// Ensure env vars are loaded before creating config
await load({ export: true });

export const DB_CONFIG = {
  hostname: Deno.env.get("PGHOST") ?? "127.0.0.1",
  port: Number(Deno.env.get("PGPORT") ?? 5432),
  user: Deno.env.get("PGUSER") ?? "deno",
  password: Deno.env.get("PGPASSWORD") ?? "",
  database: Deno.env.get("PGDATABASE") ?? "denodb",
};
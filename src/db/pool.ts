import { Client } from "postgres";
import { DB_CONFIG } from "../config/db.ts";

let client: Client | null = null;

async function getClient(): Promise<Client> {
  if (!client) {
    client = new Client(DB_CONFIG);
    await client.connect();
  }
  return client;
}

export async function query<T = unknown>(
  sql: string,
  params: unknown[] = [],
): Promise<T[]> {
  try {
    const dbClient = await getClient();
    const result = await dbClient.queryObject<T>(sql, params);
    return result.rows;
  } catch (error) {
    console.error("Database query error:", error);
    throw error;
  }
}

export async function closePool(): Promise<void> {
  if (client) {
    await client.end();
    client = null;
  }
}
import { drizzle } from "drizzle-orm/pg";
import { Pool } from "pg";
import * as schema from "./schema";
import dotenv from "dotenv";

dotenv.config();

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is not set");
}

const pool = new Pool({
  connectionString: connectionString,
});

export const db = drizzle(pool, { schema });

// Function to connect and disconnect (useful for testing or explicit management)
export async function connectDb() {
  console.log("Connecting to database...");
  try {
    await pool.connect();
    console.log("Database connected successfully.");
  } catch (error) {
    console.error("Failed to connect to database:", error);
    throw error;
  }
}

export async function disconnectDb() {
  console.log("Disconnecting from database...");
  await pool.end();
  console.log("Database disconnected.");
}

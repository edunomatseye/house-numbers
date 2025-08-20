import dotenv from "dotenv";

import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema.js";

dotenv.config();
const connectionString = process.env.DATABASE_URL;
console.log("Using DATABASE_URL:", connectionString);

if (!connectionString) {
  throw new Error("DATABASE_URL is not set");
}

const pool = new Pool({
  connectionString: connectionString,
});

export const db = drizzle(pool, {
  schema: schema,
  logger: true, // Enable logging for debugging
});

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

import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { seed } from "drizzle-seed";
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

export const db = drizzle(pool, {
  schema: schema,
  logger: true, // Enable logging for debugging
});

// Function to seed the database (if needed)
export async function seedDb() {
  console.log("Connecting to database...");
  try {
    await seed(db, { count: 100 });
    console.log("Database seeded successfully.");
  } catch (error) {
    console.error("Failed to seed database:", error);
    throw error;
  }
}
seedDb();

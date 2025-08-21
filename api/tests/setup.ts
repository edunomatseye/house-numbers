// tests/setup.ts
import * as dotenv from "dotenv";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import { db, disconnectDb, connectDb } from "../src/db";
import { Client } from "pg"; // Direct PG client for migrations
import { afterAll, beforeAll } from "vitest";

dotenv.config({ path: ".env.test", override: true }); // Ensure you have a .env.test file for test DB

const testDbUrl = process.env.DATABASE_URL;

if (!testDbUrl) {
  throw new Error("DATABASE_URL must be set in .env.test for tests.");
}

export async function setup() {
  const client = new Client({
    connectionString: testDbUrl,
  });

  await client.connect();

  // Ensure database is clean before running tests by dropping and recreating schema
  await client.query("DROP SCHEMA public CASCADE; CREATE SCHEMA public;");
  await client.end();

  // Run migrations
  await migrate(db, { migrationsFolder: "drizzle" });

  // Connect the main db instance after migrations
  await connectDb();
}

export async function teardown() {
  await disconnectDb();
}

// Global setup and teardown for Vitest
// Vitest calls these functions
beforeAll(async () => {
  await setup();
}, 60000); // 60 second timeout for setup

afterAll(async () => {
  await teardown();
}); // 60 second timeout for teardown

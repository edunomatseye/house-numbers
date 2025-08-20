import type { Config } from "drizzle-kit";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env" });

export default {
  schema: "./src/db/schema.ts",
  out: "./drizzle", // Directory for migration files
  dialect: "postgresql",
  dbCredentials: {
    url: "postgresql://user:password@db:5432/snippets_db",
  },
} satisfies Config;

import type { Config } from "drizzle-kit";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env" });

export default {
  schema: "./src/db/schema.ts",
  out: "./drizzle", // Directory for migration files
  dialect: "postgresql",
  dbCredentials: {
    url: "postgresql://user:password@localhost:5432/snippets_db",
    host: "localhost",
    user: "user",
    password: "password",
    database: "snippets_db",
    port: 5432,
  },
} satisfies Config;

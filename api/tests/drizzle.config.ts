import type { Config } from "drizzle-kit";
import * as dotenv from "dotenv";

dotenv.config({ path: "../.env.test" });

export default {
  schema: "src/db/schema.ts",
  out: "drizzle/", // Directory for migration files
  dialect: "postgresql",
  dbCredentials: {
    url: "postgresql://test_user:test_password@localhost:5433/test_snippets_db",
    host: "localhost",
    user: "test_user",
    password: "test_password",
    database: "test_snippets_db",
    port: 5433,
  },
} satisfies Config;

import type { Config } from "drizzle-kit";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env" });

export default {
  schema: "./src/db/schema/*",
  out: "./drizzle", // Directory for migration files
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.STUDIO_DATABASE_URL as string,
  },
} satisfies Config;

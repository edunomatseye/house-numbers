import { drizzle } from "drizzle-orm/node-postgres";
import { seed, reset } from "drizzle-seed";
import * as schema from "./schema.ts";

import dotenv from "dotenv";
dotenv.config();

export const db = drizzle(process.env.STUDIO_DATABASE_URL!);

// Function to seed the database (if needed)
export async function seedDb(seeding = true) {
  console.log("Trying to seed database...");
  try {
    seeding
      ? await seed(db, schema, { count: 100 }).refine((funcs) => ({
          snippets: {
            count: 100,
            columns: {
              text: funcs.loremIpsum({ sentencesCount: 5 }),
              summary: funcs.loremIpsum({ sentencesCount: 2 }),
              createdAt: funcs.timestamp(),
            },
          },
        }))
      : await reset(db, schema);
    console.log("Database seeded successfully.");
  } catch (error) {
    console.error("Failed to seed database:", error);
    throw error;
  }
}
seedDb().catch((error) => {
  console.error("Error during seeding:", error);
  process.exit(1);
});

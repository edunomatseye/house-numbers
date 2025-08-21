import { pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { v4 as uuidv4 } from "uuid";

export const snippets = pgTable("snippets", {
  id: text("id")
    .$defaultFn(() => uuidv4())
    .primaryKey(),
  text: text("text").notNull(),
  summary: text("summary").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type Snippet = typeof snippets.$inferSelect; // return type when queried
export type NewSnippet = typeof snippets.$inferInsert; // insert type

import { relations } from "drizzle-orm";
import {
  integer,
  pgTable,
  primaryKey,
  serial,
  text,
  timestamp,
} from "drizzle-orm/pg-core";
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

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: text("name"),
});
export const usersRelations = relations(users, ({ many }) => ({
  usersToGroups: many(usersToGroups),
}));
export type Users = typeof snippets.$inferSelect;
export type NewUsers = typeof snippets.$inferSelect;

export const groups = pgTable("groups", {
  id: serial("id").primaryKey(),
  name: text("name"),
});
export const groupsRelations = relations(groups, ({ many }) => ({
  usersToGroups: many(usersToGroups),
}));
export const usersToGroups = pgTable(
  "users_to_groups",
  {
    userId: integer("user_id")
      .notNull()
      .references(() => users.id),
    groupId: integer("group_id")
      .notNull()
      .references(() => groups.id),
  },
  (t) => [primaryKey({ columns: [t.userId, t.groupId] })]
);
export const usersToGroupsRelations = relations(usersToGroups, ({ one }) => ({
  group: one(groups, {
    fields: [usersToGroups.groupId],
    references: [groups.id],
  }),
  user: one(users, {
    fields: [usersToGroups.userId],
    references: [users.id],
  }),
}));

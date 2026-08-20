import { integer, pgTable, serial, text, timestamp, unique } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const usersTable = pgTable("allocation_users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const requestsTable = pgTable("allocation_requests", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull(),
  need: integer("need").notNull(),
  urgency: integer("urgency").notNull(),
  quantityNeeded: integer("quantity_needed").notNull(),
  submittedBy: integer("submitted_by").references(() => usersTable.id),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const votesTable = pgTable(
  "allocation_votes",
  {
    id: serial("id").primaryKey(),
    userId: integer("user_id").notNull().references(() => usersTable.id),
    requestId: integer("request_id").notNull().references(() => requestsTable.id),
    votedAt: timestamp("voted_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => ({
    oneVotePerMember: unique("allocation_votes_user_id_unique").on(table.userId),
  }),
);

export const insertRequestSchema = createInsertSchema(requestsTable).omit({
  id: true,
  createdAt: true,
});
export type InsertRequest = z.infer<typeof insertRequestSchema>;
export type AllocationUser = typeof usersTable.$inferSelect;
export type AllocationRequest = typeof requestsTable.$inferSelect;
export type AllocationVote = typeof votesTable.$inferSelect;
import { sql } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const transfers = sqliteTable("transfers", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  reference: text("reference").notNull().unique(),
  customerName: text("customer_name").notNull(),
  customerInitials: text("customer_initials").notNull(),
  destination: text("destination").notNull(),
  amountJod: integer("amount_jod").notNull(),
  purpose: text("purpose").notNull(),
  risk: text("risk", { enum: ["Low", "Medium", "High"] }).notNull(),
  status: text("status", { enum: ["Cleared", "Review"] }).notNull(),
  createdByEmail: text("created_by_email").notNull().default(""),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});

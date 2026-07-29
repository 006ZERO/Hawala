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

export const customers = sqliteTable("customers", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  reference: text("reference").notNull().unique(),
  fullName: text("full_name").notNull(),
  nationality: text("nationality").notNull(),
  idType: text("id_type", { enum: ["National ID", "Passport", "Residence permit"] }).notNull(),
  idNumberLast4: text("id_number_last4").notNull(),
  verificationStatus: text("verification_status", { enum: ["Verified", "Pending review"] }).notNull(),
  risk: text("risk", { enum: ["Low", "Medium", "High"] }).notNull(),
  createdByEmail: text("created_by_email").notNull(),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});

export const complianceCases = sqliteTable("compliance_cases", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  reference: text("reference").notNull().unique(),
  transferReference: text("transfer_reference").notNull(),
  customerName: text("customer_name").notNull(),
  caseType: text("case_type").notNull(),
  severity: text("severity", { enum: ["Low", "Medium", "High"] }).notNull(),
  status: text("status", { enum: ["Open", "Cleared", "Escalated"] }).notNull().default("Open"),
  riskScore: integer("risk_score").notNull(),
  reasons: text("reasons").notNull(),
  note: text("note").notNull().default(""),
  assignedToEmail: text("assigned_to_email").notNull().default(""),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});

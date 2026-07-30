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
  detectionMode: text("detection_mode").notNull().default("Rules + illustrative model"),
  ruleCodes: text("rule_codes").notNull().default("[]"),
  ruleVersion: text("rule_version").notNull().default("rules-3.4"),
  modelVersion: text("model_version").notNull().default("demo-risk-0.3"),
  evidenceProvenance: text("evidence_provenance").notNull().default("Synthetic demonstration dataset"),
  overrideReason: text("override_reason").notNull().default(""),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});

export const brokers = sqliteTable("brokers", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  reference: text("reference").notNull().unique(),
  legalName: text("legal_name").notNull(),
  tradingName: text("trading_name").notNull(),
  jurisdiction: text("jurisdiction").notNull(),
  city: text("city").notNull(),
  licenseNumberLast4: text("license_number_last4").notNull(),
  beneficialOwnerStatus: text("beneficial_owner_status", { enum: ["Verified", "Pending review"] }).notNull(),
  complianceOfficerEmail: text("compliance_officer_email").notNull(),
  corridors: text("corridors").notNull(),
  prefundedBalanceJod: integer("prefunded_balance_jod").notNull().default(0),
  netPositionJod: integer("net_position_jod").notNull().default(0),
  risk: text("risk", { enum: ["Low", "Medium", "High"] }).notNull().default("Low"),
  status: text("status", { enum: ["Pending", "Active", "Suspended"] }).notNull().default("Pending"),
  createdByEmail: text("created_by_email").notNull(),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});

export const settlementCycles = sqliteTable("settlement_cycles", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  reference: text("reference").notNull().unique(),
  cycleLabel: text("cycle_label").notNull(),
  grossAmountJod: integer("gross_amount_jod").notNull(),
  netAmountJod: integer("net_amount_jod").notNull(),
  status: text("status", { enum: ["Ready", "Settled", "Disputed"] }).notNull().default("Ready"),
  proofMode: text("proof_mode").notNull().default("Database audit record"),
  reconciliationNote: text("reconciliation_note").notNull().default(""),
  approvedByEmail: text("approved_by_email").notNull().default(""),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  settledAt: text("settled_at").notNull().default(""),
});

export const regulatoryFilings = sqliteTable("regulatory_filings", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  reference: text("reference").notNull().unique(),
  caseReference: text("case_reference").notNull(),
  filingType: text("filing_type").notNull().default("STR"),
  status: text("status", { enum: ["Draft", "Approved", "Simulated"] }).notNull().default("Draft"),
  narrative: text("narrative").notNull(),
  approvedByEmail: text("approved_by_email").notNull().default(""),
  demoReceipt: text("demo_receipt").notNull().default(""),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});

export const platformSettings = sqliteTable("platform_settings", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  key: text("key").notNull().unique(),
  value: text("value").notNull(),
  updatedByEmail: text("updated_by_email").notNull(),
  updatedAt: text("updated_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});

export const auditEvents = sqliteTable("audit_events", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  reference: text("reference").notNull().unique(),
  eventType: text("event_type").notNull(),
  entityType: text("entity_type").notNull(),
  entityReference: text("entity_reference").notNull(),
  action: text("action").notNull(),
  outcome: text("outcome").notNull(),
  metadata: text("metadata").notNull().default("{}"),
  actorEmail: text("actor_email").notNull(),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});

export const userRoles = sqliteTable("user_roles", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  email: text("email").notNull().unique(),
  role: text("role", { enum: ["Administrator", "ComplianceOfficer", "Operator", "Auditor"] }).notNull(),
  status: text("status", { enum: ["Active", "Suspended"] }).notNull().default("Active"),
  assignedByEmail: text("assigned_by_email").notNull(),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});

import { desc, eq } from "drizzle-orm";
import { getAuthorizedUser, type AppRole } from "../../authorization";
import { getDb } from "../../../db";
import {
  auditEvents,
  brokers,
  platformSettings,
  regulatoryFilings,
  settlementCycles,
  userRoles,
} from "../../../db/schema";

function reference(prefix: string) {
  return `${prefix}-${String(Date.now()).slice(-9)}`;
}

async function recordAudit(input: {
  eventType: string;
  entityType: string;
  entityReference: string;
  action: string;
  outcome?: string;
  metadata?: Record<string, unknown>;
  actorEmail: string;
}) {
  await getDb().insert(auditEvents).values({
    reference: reference("AUD"),
    eventType: input.eventType,
    entityType: input.entityType,
    entityReference: input.entityReference,
    action: input.action,
    outcome: input.outcome || "Succeeded",
    metadata: JSON.stringify(input.metadata || {}),
    actorEmail: input.actorEmail,
  });
}

export async function GET() {
  try {
    const user = await getAuthorizedUser();
    if (!user) return Response.json({ error: "Sign in is required to access operational records." }, { status: 401 });
    const db = getDb();
    const [brokerRows, settlementRows, filingRows, settingRows, auditRows, roleRows] = await Promise.all([
      db.select().from(brokers).orderBy(desc(brokers.id)).limit(100),
      db.select().from(settlementCycles).orderBy(desc(settlementCycles.id)).limit(50),
      db.select().from(regulatoryFilings).orderBy(desc(regulatoryFilings.id)).limit(100),
      db.select().from(platformSettings).orderBy(platformSettings.key).limit(100),
      db.select().from(auditEvents).orderBy(desc(auditEvents.id)).limit(100),
      user.role === "Administrator" ? db.select().from(userRoles).orderBy(userRoles.email).limit(100) : Promise.resolve([]),
    ]);
    return Response.json({
      brokers: brokerRows,
      settlements: settlementRows,
      filings: filingRows,
      settings: settingRows,
      auditEvents: auditRows,
      userRoles: roleRows,
      viewer: { email: user.email, displayName: user.displayName, role: user.role },
    });
  } catch (error) {
    return Response.json({ error: error instanceof Error ? error.message : "Unable to load operational records." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const user = await getAuthorizedUser();
    if (!user) return Response.json({ error: "Sign in is required to perform this action." }, { status: 401 });
    const payload = (await request.json()) as Record<string, unknown>;
    const action = String(payload.action || "");
    const db = getDb();
    const requireRole = (roles: AppRole[]) => roles.includes(user.role);

    if (action === "assign_role") {
      if (!requireRole(["Administrator"])) return Response.json({ error: "Administrator authority is required." }, { status: 403 });
      const email = String(payload.email || "").trim().toLowerCase();
      const role = String(payload.role || "") as AppRole;
      const status = payload.status === "Suspended" ? "Suspended" : "Active";
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return Response.json({ error: "A valid workspace user email is required." }, { status: 400 });
      if (!["Administrator", "ComplianceOfficer", "Operator", "Auditor"].includes(role)) return Response.json({ error: "A supported application role is required." }, { status: 400 });
      if (email === user.email.toLowerCase() && status === "Suspended") return Response.json({ error: "Administrators cannot suspend their own active session." }, { status: 400 });
      const [roleRecord] = await db.insert(userRoles).values({
        email,
        role,
        status,
        assignedByEmail: user.email,
      }).onConflictDoUpdate({
        target: userRoles.email,
        set: { role, status, assignedByEmail: user.email, updatedAt: new Date().toISOString() },
      }).returning();
      await recordAudit({
        eventType: "ACCESS_ADMINISTRATION",
        entityType: "UserRole",
        entityReference: email,
        action: `${status === "Active" ? "Assigned" : "Suspended"} ${role} access`,
        metadata: { role, status },
        actorEmail: user.email,
      });
      return Response.json({ userRole: roleRecord });
    }

    if (action === "onboard_broker") {
      if (!requireRole(["Administrator", "ComplianceOfficer"])) return Response.json({ error: "Administrator or compliance authority is required." }, { status: 403 });
      const legalName = String(payload.legalName || "").trim();
      const tradingName = String(payload.tradingName || "").trim();
      const jurisdiction = String(payload.jurisdiction || "").trim();
      const city = String(payload.city || "").trim();
      const licenseNumber = String(payload.licenseNumber || "").replace(/\s+/g, "");
      const complianceOfficerEmail = String(payload.complianceOfficerEmail || "").trim();
      const corridors = Array.isArray(payload.corridors) ? payload.corridors.map(String) : [];
      if (!legalName || !tradingName || !jurisdiction || !city || licenseNumber.length < 4 || !complianceOfficerEmail || corridors.length === 0) {
        return Response.json({ error: "Legal name, trading name, jurisdiction, city, license, compliance officer, and corridor are required." }, { status: 400 });
      }
      const brokerReference = reference("BR");
      const [broker] = await db.insert(brokers).values({
        reference: brokerReference,
        legalName,
        tradingName,
        jurisdiction,
        city,
        licenseNumberLast4: licenseNumber.slice(-4),
        beneficialOwnerStatus: "Pending review",
        complianceOfficerEmail,
        corridors: JSON.stringify(corridors),
        prefundedBalanceJod: 0,
        netPositionJod: 0,
        risk: "Medium",
        status: "Pending",
        createdByEmail: user.email,
      }).returning();
      await recordAudit({
        eventType: "BROKER_ONBOARDING",
        entityType: "Broker",
        entityReference: brokerReference,
        action: "Created pending broker record",
        metadata: { jurisdiction, corridors, retainedLicenseCharacters: 4 },
        actorEmail: user.email,
      });
      return Response.json({ broker }, { status: 201 });
    }

    if (action === "settle_cycle") {
      if (!requireRole(["Administrator", "Operator"])) return Response.json({ error: "Administrator or settlement operator authority is required." }, { status: 403 });
      const grossAmountJod = Math.round(Number(payload.grossAmountJod));
      const netAmountJod = Math.round(Number(payload.netAmountJod));
      if (!Number.isInteger(grossAmountJod) || !Number.isInteger(netAmountJod) || grossAmountJod < 1 || netAmountJod < 1) {
        return Response.json({ error: "Valid gross and net amounts are required." }, { status: 400 });
      }
      const settlementReference = reference("SET");
      const now = new Date().toISOString();
      const [settlement] = await db.insert(settlementCycles).values({
        reference: settlementReference,
        cycleLabel: String(payload.cycleLabel || "Current demonstration cycle"),
        grossAmountJod,
        netAmountJod,
        status: "Settled",
        proofMode: String(payload.proofMode || "Database audit record"),
        reconciliationNote: String(payload.reconciliationNote || "Prefunding and bilateral positions reconciled."),
        approvedByEmail: user.email,
        settledAt: now,
      }).returning();
      await recordAudit({
        eventType: "SETTLEMENT",
        entityType: "SettlementCycle",
        entityReference: settlementReference,
        action: "Approved net settlement",
        metadata: { grossAmountJod, netAmountJod, proofMode: settlement.proofMode },
        actorEmail: user.email,
      });
      return Response.json({ settlement }, { status: 201 });
    }

    if (action === "prepare_filing") {
      if (!requireRole(["Administrator", "ComplianceOfficer"])) return Response.json({ error: "Administrator or compliance authority is required." }, { status: 403 });
      const caseReference = String(payload.caseReference || "").trim();
      const narrative = String(payload.narrative || "").trim();
      const status = payload.status === "Simulated" ? "Simulated" : payload.status === "Approved" ? "Approved" : "Draft";
      if (!caseReference || !narrative) return Response.json({ error: "Case reference and regulatory narrative are required." }, { status: 400 });
      const filingReference = reference("STR");
      const receipt = status === "Simulated" ? reference("STR-DEMO") : "";
      const [filing] = await db.insert(regulatoryFilings).values({
        reference: filingReference,
        caseReference,
        filingType: "STR",
        status,
        narrative,
        approvedByEmail: status === "Draft" ? "" : user.email,
        demoReceipt: receipt,
      }).returning();
      await recordAudit({
        eventType: "REGULATORY_FILING",
        entityType: "Filing",
        entityReference: filingReference,
        action: status === "Draft" ? "Saved filing draft" : status === "Approved" ? "Approved filing for configured connector" : "Simulated approved submission",
        metadata: { caseReference, status, transmittedExternally: false },
        actorEmail: user.email,
      });
      return Response.json({ filing }, { status: 201 });
    }

    if (action === "save_settings") {
      if (!requireRole(["Administrator"])) return Response.json({ error: "Administrator authority is required." }, { status: 403 });
      const values = payload.values && typeof payload.values === "object" ? payload.values as Record<string, unknown> : {};
      const updated = [];
      for (const [key, value] of Object.entries(values)) {
        const [setting] = await db.insert(platformSettings).values({
          key,
          value: JSON.stringify(value),
          updatedByEmail: user.email,
          updatedAt: new Date().toISOString(),
        }).onConflictDoUpdate({
          target: platformSettings.key,
          set: { value: JSON.stringify(value), updatedByEmail: user.email, updatedAt: new Date().toISOString() },
        }).returning();
        updated.push(setting);
      }
      await recordAudit({
        eventType: "CONFIGURATION",
        entityType: "PlatformSettings",
        entityReference: "POLICY-CURRENT",
        action: "Updated compliance configuration",
        metadata: { keys: Object.keys(values) },
        actorEmail: user.email,
      });
      return Response.json({ settings: updated });
    }

    if (action === "dispute_settlement") {
      if (!requireRole(["Administrator", "Operator", "ComplianceOfficer"])) return Response.json({ error: "An operational or compliance role is required." }, { status: 403 });
      const settlementReference = String(payload.reference || "").trim();
      const note = String(payload.note || "").trim();
      if (!settlementReference || !note) return Response.json({ error: "Settlement reference and dispute note are required." }, { status: 400 });
      const [settlement] = await db.update(settlementCycles).set({
        status: "Disputed",
        reconciliationNote: note,
      }).where(eq(settlementCycles.reference, settlementReference)).returning();
      if (!settlement) return Response.json({ error: "Settlement cycle not found." }, { status: 404 });
      await recordAudit({
        eventType: "SETTLEMENT_DISPUTE",
        entityType: "SettlementCycle",
        entityReference: settlementReference,
        action: "Opened reconciliation dispute",
        metadata: { note },
        actorEmail: user.email,
      });
      return Response.json({ settlement });
    }

    return Response.json({ error: "Unsupported operational action." }, { status: 400 });
  } catch (error) {
    return Response.json({ error: error instanceof Error ? error.message : "Unable to complete operational action." }, { status: 500 });
  }
}

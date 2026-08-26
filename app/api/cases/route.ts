import { desc, eq } from "drizzle-orm";
import { getAuthorizedUser } from "../../authorization";
import { getDb } from "../../../db";
import { auditEvents, complianceCases } from "../../../db/schema";

export async function GET() {
  try {
    const user = await getAuthorizedUser();
    if (!user) return Response.json({ error: "Sign in is required to access compliance cases." }, { status: 401 });
    const cases = await getDb().select().from(complianceCases).orderBy(desc(complianceCases.id)).limit(100);
    return Response.json({ cases });
  } catch {
    return Response.json({ error: "Unable to load cases." }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const user = await getAuthorizedUser(["Administrator", "ComplianceOfficer"]);
    if (!user) return Response.json({ error: "An active compliance role is required to decide a case." }, { status: 403 });
    const payload = (await request.json()) as { reference?: string; status?: "Cleared" | "Escalated"; note?: string; overrideReason?: string };
    const reference = payload.reference?.trim() ?? "";
    const note = payload.note?.trim() ?? "";
    if (!reference || !payload.status || !["Cleared", "Escalated"].includes(payload.status) || !note) {
      return Response.json({ error: "A case, decision, and review note are required." }, { status: 400 });
    }
    const [updatedCase] = await getDb().update(complianceCases).set({
      status: payload.status,
      note,
      overrideReason: payload.overrideReason?.trim() || "",
      assignedToEmail: user.email,
      updatedAt: new Date().toISOString(),
    }).where(eq(complianceCases.reference, reference)).returning();
    if (!updatedCase) return Response.json({ error: "Case not found." }, { status: 404 });
    await getDb().insert(auditEvents).values({
      reference: `AUD-${String(Date.now()).slice(-9)}`,
      eventType: "CASE_DECISION",
      entityType: "ComplianceCase",
      entityReference: reference,
      action: `${payload.status} case with human decision`,
      outcome: "Succeeded",
      metadata: JSON.stringify({
        riskScore: updatedCase.riskScore,
        ruleVersion: updatedCase.ruleVersion,
        modelVersion: updatedCase.modelVersion,
        overrideRecorded: Boolean(payload.overrideReason?.trim()),
      }),
      actorEmail: user.email,
    });
    return Response.json({ case: updatedCase });
  } catch {
    return Response.json({ error: "Unable to update case." }, { status: 500 });
  }
}

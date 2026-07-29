import { desc, eq } from "drizzle-orm";
import { getChatGPTUser } from "../../chatgpt-auth";
import { getDb } from "../../../db";
import { complianceCases } from "../../../db/schema";

export async function GET() {
  try {
    const user = await getChatGPTUser();
    if (!user) return Response.json({ error: "Sign in is required to access compliance cases." }, { status: 401 });
    const cases = await getDb().select().from(complianceCases).orderBy(desc(complianceCases.id)).limit(100);
    return Response.json({ cases });
  } catch (error) {
    return Response.json({ error: error instanceof Error ? error.message : "Unable to load cases." }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const user = await getChatGPTUser();
    if (!user) return Response.json({ error: "Sign in is required to decide a compliance case." }, { status: 401 });
    const payload = (await request.json()) as { reference?: string; status?: "Cleared" | "Escalated"; note?: string };
    const reference = payload.reference?.trim() ?? "";
    const note = payload.note?.trim() ?? "";
    if (!reference || !payload.status || !["Cleared", "Escalated"].includes(payload.status) || !note) {
      return Response.json({ error: "A case, decision, and review note are required." }, { status: 400 });
    }
    const [updatedCase] = await getDb().update(complianceCases).set({
      status: payload.status,
      note,
      assignedToEmail: user.email,
      updatedAt: new Date().toISOString(),
    }).where(eq(complianceCases.reference, reference)).returning();
    if (!updatedCase) return Response.json({ error: "Case not found." }, { status: 404 });
    return Response.json({ case: updatedCase });
  } catch (error) {
    return Response.json({ error: error instanceof Error ? error.message : "Unable to update case." }, { status: 500 });
  }
}

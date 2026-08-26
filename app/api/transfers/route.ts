import { desc } from "drizzle-orm";
import { getAuthorizedUser } from "../../authorization";
import { getDb } from "../../../db";
import { auditEvents, transfers } from "../../../db/schema";

function initialsFor(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase() || "NC";
}

function routeError(error: unknown) {
  const message = error instanceof Error ? error.message : "Unexpected error";
  if (message.includes("no such table") || message.includes("transfers")) {
    return "The transfer ledger is not initialized yet. Deploy the generated D1 migration before using this endpoint.";
  }
  return "Unable to access the transfer ledger.";
}

async function authenticatedUser() {
  const user = await getAuthorizedUser();
  if (!user) {
    return null;
  }
  return user;
}

export async function GET() {
  try {
    const user = await authenticatedUser();
    if (!user) return Response.json({ error: "Sign in is required to access the transfer ledger." }, { status: 401 });

    const rows = await getDb()
      .select()
      .from(transfers)
      .orderBy(desc(transfers.id))
      .limit(100);

    return Response.json({ transfers: rows, viewer: { email: user.email, displayName: user.displayName } });
  } catch (error) {
    return Response.json({ error: routeError(error) }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const user = await getAuthorizedUser(["Administrator", "Operator", "ComplianceOfficer"]);
    if (!user) return Response.json({ error: "An active operator or compliance role is required to record a transfer." }, { status: 403 });

    const payload = (await request.json()) as {
      customerName?: string;
      destination?: string;
      amountJod?: number;
      purpose?: string;
    };
    const customerName = payload.customerName?.trim() ?? "";
    const destination = payload.destination?.trim() ?? "";
    const amountJod = Math.round(Number(payload.amountJod));
    const purpose = payload.purpose?.trim() ?? "";

    if (!customerName || !destination || !purpose || !Number.isInteger(amountJod) || amountJod < 1) {
      return Response.json({ error: "Customer, destination, purpose, and a valid amount are required." }, { status: 400 });
    }

    const risk = amountJod >= 3000 ? "Medium" : "Low";
    const status = amountJod >= 3000 ? "Review" : "Cleared";
    const reference = `HW-${String(Date.now()).slice(-8)}`;
    const [transfer] = await getDb()
      .insert(transfers)
      .values({
        reference,
        customerName,
        customerInitials: initialsFor(customerName),
        destination,
        amountJod,
        purpose,
        risk,
        status,
        createdByEmail: user.email,
      })
      .returning();
    await getDb().insert(auditEvents).values({
      reference: `AUD-${String(Date.now()).slice(-9)}`,
      eventType: "TRANSFER",
      entityType: "Transfer",
      entityReference: reference,
      action: "Recorded and screened transfer",
      outcome: status,
      metadata: JSON.stringify({ destination, amountJod, purpose, risk, screeningMode: "Synthetic demonstration rules" }),
      actorEmail: user.email,
    });

    return Response.json({ transfer }, { status: 201 });
  } catch (error) {
    return Response.json({ error: routeError(error) }, { status: 500 });
  }
}

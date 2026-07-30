import { getAuthorizedUser } from "../../../authorization";
import { getDb } from "../../../../db";
import { auditEvents } from "../../../../db/schema";

function reference(prefix: string) {
  return `${prefix}-${String(Date.now()).slice(-9)}`;
}

export async function POST(request: Request) {
  try {
    const user = await getAuthorizedUser(["Administrator", "ComplianceOfficer", "Operator"]);
    if (!user) return Response.json({ error: "Authorized operational access is required." }, { status: 401 });
    const payload = (await request.json()) as Record<string, unknown>;
    const subjectName = String(payload.subjectName || "").trim();
    const requestReference = String(payload.requestReference || reference("SCR-DEMO")).trim();
    if (subjectName.length < 3) return Response.json({ error: "A subject name of at least three characters is required." }, { status: 400 });

    const normalized = subjectName.toLocaleLowerCase("en");
    const illustrativeCandidate = normalized.includes("samira") || normalized.includes("khalil");
    const response = {
      environment: "simulation",
      provider: null,
      transmittedExternally: false,
      requestReference,
      providerReference: null,
      datasetVersion: "synthetic-screening-2026-07",
      datasetFreshness: "Demonstration snapshot; not valid for real compliance decisions",
      result: illustrativeCandidate ? "Potential match" : "No synthetic candidate",
      candidates: illustrativeCandidate ? [{
        candidateReference: "SYN-PEP-0042",
        category: "PEP",
        score: 0.78,
        matchedAttributes: ["name-token"],
        disposition: "Human review required",
      }] : [],
      limitations: [
        "No sanctions or PEP provider was contacted.",
        "No licensed list data was used.",
        "The response is a deterministic test fixture, not a legal conclusion.",
      ],
    };

    await getDb().insert(auditEvents).values({
      reference: reference("AUD"),
      eventType: "INTEGRATION_SIMULATION",
      entityType: "ScreeningRequest",
      entityReference: requestReference,
      action: "Executed synthetic screening adapter contract",
      outcome: "Succeeded",
      metadata: JSON.stringify({ transmittedExternally: false, result: response.result, candidateCount: response.candidates.length }),
      actorEmail: user.email,
    });
    return Response.json(response);
  } catch (error) {
    return Response.json({ error: error instanceof Error ? error.message : "Unable to execute screening simulation." }, { status: 500 });
  }
}


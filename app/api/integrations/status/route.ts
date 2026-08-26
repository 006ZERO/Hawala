import { getAuthorizedUser } from "../../../authorization";

export async function GET() {
  const user = await getAuthorizedUser();
  if (!user) return Response.json({ error: "Sign in is required." }, { status: 401 });
  return Response.json({
    environment: "private demonstration",
    productionReady: false,
    integrations: [
      { capability: "Sanctions / PEP", state: "Adapter contract + synthetic fixture", live: false, dependency: "Licensed provider contract, credentials, validation, SLA" },
      { capability: "Identity / KYB", state: "Workflow specification", live: false, dependency: "Approved vendor, lawful data schedule, credentials" },
      { capability: "Payment rail", state: "Prefunding and reconciliation records", live: false, dependency: "Licensed sponsor, safeguarding accounts, approved rail" },
      { capability: "CBJ / AML reporting", state: "Human-approved draft and simulated receipt", live: false, dependency: "Authority pathway, schema, credentials, test environment" },
      { capability: "Distributed ledger", state: "Optional architecture", live: false, dependency: "Multi-party governance case; not required for settlement" },
    ],
  });
}


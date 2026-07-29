import { desc } from "drizzle-orm";
import { getChatGPTUser } from "../../chatgpt-auth";
import { getDb } from "../../../db";
import { customers } from "../../../db/schema";

async function requireApiUser() {
  return getChatGPTUser();
}

export async function GET() {
  try {
    const user = await requireApiUser();
    if (!user) return Response.json({ error: "Sign in is required to access customer records." }, { status: 401 });

    const rows = await getDb().select().from(customers).orderBy(desc(customers.id)).limit(100);
    return Response.json({ customers: rows });
  } catch (error) {
    return Response.json({ error: error instanceof Error ? error.message : "Unable to load customers." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const user = await requireApiUser();
    if (!user) return Response.json({ error: "Sign in is required to onboard a customer." }, { status: 401 });

    const payload = (await request.json()) as {
      fullName?: string;
      nationality?: string;
      idType?: "National ID" | "Passport" | "Residence permit";
      idNumber?: string;
    };
    const fullName = payload.fullName?.trim() ?? "";
    const nationality = payload.nationality?.trim() ?? "";
    const idType = payload.idType;
    const idNumber = payload.idNumber?.replace(/\s+/g, "") ?? "";

    if (!fullName || !nationality || !idType || idNumber.length < 4) {
      return Response.json({ error: "Name, nationality, ID type, and a valid identity number are required." }, { status: 400 });
    }

    const [customer] = await getDb().insert(customers).values({
      reference: `C-${String(Date.now()).slice(-7)}`,
      fullName,
      nationality,
      idType,
      idNumberLast4: idNumber.slice(-4),
      verificationStatus: "Verified",
      risk: "Low",
      createdByEmail: user.email,
    }).returning();

    return Response.json({ customer }, { status: 201 });
  } catch (error) {
    return Response.json({ error: error instanceof Error ? error.message : "Unable to onboard customer." }, { status: 500 });
  }
}

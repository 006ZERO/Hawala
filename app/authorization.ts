import { eq } from "drizzle-orm";
import { env } from "cloudflare:workers";
import { getDb } from "../db";
import { userRoles } from "../db/schema";
import { getChatGPTUser } from "./chatgpt-auth";

export type AppRole = "Administrator" | "ComplianceOfficer" | "Operator" | "Auditor";

export async function getAuthorizedUser(allowedRoles?: AppRole[]) {
  const user = await getChatGPTUser();
  if (!user) return null;
  const db = getDb();
  let [roleRecord] = await db.select().from(userRoles).where(eq(userRoles.email, user.email)).limit(1);

  if (!roleRecord) {
    const [existingRole] = await db.select().from(userRoles).limit(1);
    const runtimeEnv = env as typeof env & { HAWALA_BOOTSTRAP_ADMIN_EMAIL?: string };
    const bootstrapAdminEmail = runtimeEnv.HAWALA_BOOTSTRAP_ADMIN_EMAIL?.trim().toLowerCase();
    if (!existingRole && bootstrapAdminEmail && user.email.toLowerCase() === bootstrapAdminEmail) {
      [roleRecord] = await db.insert(userRoles).values({
        email: user.email,
        role: "Administrator",
        status: "Active",
        assignedByEmail: user.email,
      }).returning();
    }
  }

  if (!roleRecord || roleRecord.status !== "Active") return null;
  if (allowedRoles && !allowedRoles.includes(roleRecord.role)) return null;
  return { ...user, role: roleRecord.role };
}

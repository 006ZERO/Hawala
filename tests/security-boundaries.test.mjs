import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const readSource = (path) => readFile(new URL(`../${path}`, import.meta.url), "utf8");

test("administrator bootstrap requires an explicitly configured email", async () => {
  const source = await readSource("app/authorization.ts");

  assert.match(source, /HAWALA_BOOTSTRAP_ADMIN_EMAIL/);
  assert.match(source, /bootstrapAdminEmail\s*&&\s*user\.email\.toLowerCase\(\)\s*===\s*bootstrapAdminEmail/);
  assert.doesNotMatch(source, /if\s*\(!existingRole\)\s*\{\s*\[roleRecord\]\s*=\s*await db\.insert/s);
});

test("the screening adapter remains visibly synthetic and offline", async () => {
  const source = await readSource("app/api/integrations/screening/route.ts");

  assert.match(source, /environment:\s*"simulation"/);
  assert.match(source, /transmittedExternally:\s*false/);
  assert.match(source, /No sanctions or PEP provider was contacted/);
});

test("local deployment metadata and commercial materials stay ignored", async () => {
  const ignoreFile = await readSource(".gitignore");

  for (const entry of ["/.openai/", "/commercial/", "/pilot/", ".env*"]) {
    assert.ok(ignoreFile.includes(entry), `${entry} must remain ignored`);
  }
});

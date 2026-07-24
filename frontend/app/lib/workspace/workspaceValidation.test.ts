import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import test from "node:test";
import { WorkspaceValidation } from "./workspaceValidation.ts";
const files = ["workspaceValidation.test.ts", "workspaceValidation.ts",
  "workspaceValidationCategories.ts", "workspaceValidationGates.ts",
  "workspaceValidationInventory.ts", "workspaceValidationOutcomes.ts",
  "workspaceValidationRules.ts", "workspaceValidationTypes.ts"];
test("WS-1:4 has exactly eight Validation artifacts", () => {
  assert.deepEqual(readdirSync(new URL(".", import.meta.url)).filter((file) => files.includes(file)).sort(), files);
});
test("WS-1:4 rules, categories, and gates are complete and unique", () => {
  assert.equal(WorkspaceValidation.identity.id, "WS-1:4/WorkspaceValidation");
  assert.deepEqual([WorkspaceValidation.categories.length, WorkspaceValidation.rules.length,
    WorkspaceValidation.gates.length, WorkspaceValidation.outcomes.length], [24, 43, 16, 4]);
  assert.equal(new Set(WorkspaceValidation.rules.map(({ id }) => id)).size, 43);
  assert.equal(new Set(WorkspaceValidation.gates.map(({ id }) => id)).size, 16);
  assert.equal(WorkspaceValidation.gates.every(({ outcome }) => outcome === "Pass"), true);
});
test("WS-1:4 is Model-only, deterministic, and side-effect free", () => {
  const source = readFileSync(new URL("./workspaceValidation.ts", import.meta.url), "utf8");
  assert.equal(source.includes("./workspaceRegistry"), false);
  assert.equal(WorkspaceValidation.upstreamDependencies.length, 1);
  assert.equal(WorkspaceValidation.report.readiness, "ReadyForManifest");
  assert.equal(WorkspaceValidation.externalSideEffects, false);
});

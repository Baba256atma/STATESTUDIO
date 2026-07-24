import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import test from "node:test";
import { ExecutiveHomeWorkspaceValidation } from "./executiveHomeWorkspaceValidation.ts";

const files = ["executiveHomeWorkspaceValidation.test.ts",
  "executiveHomeWorkspaceValidation.ts", "executiveHomeWorkspaceValidationCategories.ts",
  "executiveHomeWorkspaceValidationGates.ts", "executiveHomeWorkspaceValidationInventory.ts",
  "executiveHomeWorkspaceValidationOutcomes.ts", "executiveHomeWorkspaceValidationRules.ts",
  "executiveHomeWorkspaceValidationTypes.ts"];

test("WS-2:4 consists of exactly eight Validation artifacts", () => {
  assert.deepEqual(readdirSync(new URL(".", import.meta.url))
    .filter((file) => files.includes(file)).sort(), files);
});

test("WS-2:4 publishes unique complete rules, categories, and gates", () => {
  const validation = ExecutiveHomeWorkspaceValidation;
  assert.equal(validation.identity.id, "WS-2:4/ExecutiveHomeWorkspaceValidation");
  assert.deepEqual([validation.categories.length, validation.rules.length,
    validation.gates.length, validation.outcomes.length], [27, 74, 20, 4]);
  assert.equal(new Set(validation.categories.map(({ id }) => id)).size, 27);
  assert.equal(new Set(validation.rules.map(({ id }) => id)).size, 74);
  assert.equal(new Set(validation.gates.map(({ id }) => id)).size, 20);
});

test("WS-2:4 covers required references and boundary rejection", () => {
  const names = new Set(ExecutiveHomeWorkspaceValidation.rules.map(({ name }) => name));
  assert.equal(names.has("Executive Overview Exists"), true);
  assert.equal(names.has("Dashboard Reference Exists"), true);
  assert.equal(names.has("Workspace Launcher Reference Exists"), true);
  assert.equal(names.has("Card Collection Exists"), true);
  assert.equal(names.has("Recommendation AI Absence"), true);
  assert.equal(names.has("Notification Delivery Absence"), true);
  assert.equal(names.has("Runtime Absent"), true);
  assert.equal(ExecutiveHomeWorkspaceValidation.report.boundaryViolationsDetected, 0);
});

test("WS-2:4 is Model-only and ready for Manifest", () => {
  const validation = ExecutiveHomeWorkspaceValidation;
  const source = readFileSync(new URL("./executiveHomeWorkspaceValidation.ts", import.meta.url), "utf8");
  assert.equal(source.includes("./executiveHomeWorkspaceRegistry"), false);
  assert.deepEqual(validation.upstreamDependencies,
    ["WS-2:3 Executive Home Workspace Model"]);
  assert.equal(validation.report.mandatoryRulesPassed, true);
  assert.equal(validation.report.mandatoryGatesPassed, true);
  assert.equal(validation.runtimeValidation, false);
  assert.equal(validation.readiness, "ReadyForManifest");
});

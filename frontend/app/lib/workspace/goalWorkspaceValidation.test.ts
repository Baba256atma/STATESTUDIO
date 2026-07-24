import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import test from "node:test";
import { GoalWorkspaceValidation } from "./goalWorkspaceValidation.ts";

const files = ["goalWorkspaceValidation.test.ts", "goalWorkspaceValidation.ts",
  "goalWorkspaceValidationCategories.ts", "goalWorkspaceValidationGates.ts",
  "goalWorkspaceValidationIdentity.ts", "goalWorkspaceValidationOutcomes.ts",
  "goalWorkspaceValidationRules.ts", "goalWorkspaceValidationTargets.ts"];

test("WS-3:4 consists of exactly eight Validation artifacts", () => {
  assert.deepEqual(readdirSync(new URL(".", import.meta.url))
    .filter((file) => files.includes(file)).sort(), files);
});

test("WS-3:4 publishes complete canonical validation collections", () => {
  const validation = GoalWorkspaceValidation;
  assert.equal(validation.identity.id, "WS-3:4/GoalWorkspaceValidation");
  assert.equal(validation.identity.namespace, "nexora.workspace.goal.validation");
  assert.deepEqual([validation.categories.length, validation.targets.length,
    validation.outcomes.length, validation.severities.length,
    validation.gates.length], [15, 16, 5, 5, 16]);
  assert.equal(validation.rules.length, 109);
  assert.equal(validation.summary.validationStatus, "Pass");
  assert.equal(validation.readiness, "ReadyForManifest");
});

test("WS-3:4 identities are unique, ordered, immutable, and passing", () => {
  const collections = [GoalWorkspaceValidation.categories, GoalWorkspaceValidation.targets,
    GoalWorkspaceValidation.rules, GoalWorkspaceValidation.outcomes,
    GoalWorkspaceValidation.severities, GoalWorkspaceValidation.gates];
  const records = collections.flat();
  assert.equal(new Set(records.map(({ id }) => id)).size, records.length);
  assert.equal(records.every(Object.isFrozen), true);
  assert.equal(GoalWorkspaceValidation.gates.every(({ outcome }) => outcome === "Pass"), true);
});

test("WS-3:4 preserves sources and contains no prohibited behavior", () => {
  const validation = GoalWorkspaceValidation;
  assert.equal(validation.targets[0]?.source, validation.foundation);
  assert.equal(validation.targets[1]?.source, validation.registry);
  assert.equal(validation.targets[2]?.source, validation.model);
  const source = readFileSync(new URL("./goalWorkspaceValidation.ts", import.meta.url), "utf8");
  assert.equal(source.includes("goalWorkspaceManifest"), false);
  assert.deepEqual(validation.upstreamDependencies, [
    "WS-3:1 Goal Workspace Foundation", "WS-3:2 Goal Workspace Registry",
    "WS-3:3 Goal Workspace Model",
  ]);
  assert.equal(validation.runtimeValidation, false);
  assert.equal(validation.businessLogic, false);
  assert.equal(validation.persistence, false);
  assert.equal(validation.ui, false);
});

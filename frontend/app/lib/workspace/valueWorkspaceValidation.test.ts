import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import test from "node:test";
import { ValueWorkspaceValidation } from "./valueWorkspaceValidation.ts";

const files = [
  "valueWorkspaceValidation.test.ts",
  "valueWorkspaceValidation.ts",
  "valueWorkspaceValidationCategories.ts",
  "valueWorkspaceValidationGates.ts",
  "valueWorkspaceValidationIdentity.ts",
  "valueWorkspaceValidationOutcomes.ts",
  "valueWorkspaceValidationRules.ts",
  "valueWorkspaceValidationTargets.ts",
];

test("WS-9:4 consists of exactly eight Validation artifacts", () => {
  assert.deepEqual(
    readdirSync(new URL(".", import.meta.url))
      .filter((file) => files.includes(file)).sort(),
    files,
  );
});

test("WS-9:4 publishes exactly 48 immutable rules", () => {
  const validation = ValueWorkspaceValidation;
  assert.equal(validation.identity.id, "WS-9:4/ValueWorkspaceValidation");
  assert.equal(
    validation.identity.namespace,
    "nexora.workspace.value.validation",
  );
  assert.equal(validation.readiness, "ReadyForManifest");
  assert.equal(validation.rules.length, 48);
  assert.equal(validation.rules.every(Object.isFrozen), true);
  assert.equal(new Set(validation.rules.map(({ id }) => id)).size, 48);
});

test("WS-9:4 collections and guarantees are complete", () => {
  const validation = ValueWorkspaceValidation;
  assert.deepEqual(
    [
      validation.categories.length,
      validation.targets.length,
      validation.outcomes.length,
      validation.gates.length,
      validation.guarantees.length,
    ],
    [16, 16, 4, 10, 8],
  );
  assert.equal(
    validation.gates.every(({ declaredOutcome }) => declaredOutcome === "Pass"),
    true,
  );
});

test("WS-9:4 consumes only Foundation, Registry, and Model", () => {
  const validation = ValueWorkspaceValidation;
  const source = readFileSync(
    new URL("./valueWorkspaceValidation.ts", import.meta.url),
    "utf8",
  );
  assert.equal(source.includes("valueWorkspaceManifest"), false);
  assert.deepEqual(validation.upstreamDependencies, [
    "WS-9:1 Value Workspace Foundation",
    "WS-9:2 Value Workspace Registry",
    "WS-9:3 Value Workspace Model",
  ]);
  assert.equal(validation.executableValidators, false);
  assert.equal(validation.runtime, false);
  assert.equal(validation.roiCalculation, false);
  assert.equal(validation.businessLogic, false);
});

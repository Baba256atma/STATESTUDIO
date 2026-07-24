import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import test from "node:test";
import { DecisionWorkspaceV7Validation } from "./decisionWorkspaceV7Validation.ts";

const files = [
  "decisionWorkspaceV7Validation.test.ts",
  "decisionWorkspaceV7Validation.ts",
  "decisionWorkspaceV7ValidationCategories.ts",
  "decisionWorkspaceV7ValidationGates.ts",
  "decisionWorkspaceV7ValidationIdentity.ts",
  "decisionWorkspaceV7ValidationOutcomes.ts",
  "decisionWorkspaceV7ValidationRules.ts",
  "decisionWorkspaceV7ValidationTargets.ts",
];

test("WS-7:4 consists of exactly eight collision-safe Validation artifacts", () => {
  assert.deepEqual(
    readdirSync(new URL(".", import.meta.url))
      .filter((file) => files.includes(file))
      .sort(),
    files,
  );
});

test("WS-7:4 publishes exactly 48 immutable validation rules", () => {
  const validation = DecisionWorkspaceV7Validation;
  assert.equal(validation.identity.id, "WS-7:4/DecisionWorkspaceValidation");
  assert.equal(
    validation.identity.namespace,
    "nexora.workspace.decision.validation",
  );
  assert.equal(validation.identity.version, "1.0.0");
  assert.equal(validation.readiness, "ReadyForManifest");
  assert.equal(validation.rules.length, 48);
  assert.equal(validation.rules.every(Object.isFrozen), true);
  assert.equal(new Set(validation.rules.map(({ id }) => id)).size, 48);
});

test("WS-7:4 collections and guarantees are complete", () => {
  const validation = DecisionWorkspaceV7Validation;
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
  assert.equal(
    validation.guarantees.every(({ state }) => state === "Guaranteed"),
    true,
  );
});

test("WS-7:4 consumes only WS-7 Foundation, Registry, and Model", () => {
  const validation = DecisionWorkspaceV7Validation;
  const source = readFileSync(
    new URL("./decisionWorkspaceV7Validation.ts", import.meta.url),
    "utf8",
  );
  assert.equal(source.includes("decisionWorkspaceV7Manifest"), false);
  assert.deepEqual(validation.upstreamDependencies, [
    "WS-7:1 Decision Workspace Foundation",
    "WS-7:2 Decision Workspace Registry",
    "WS-7:3 Decision Workspace Model",
  ]);
  assert.equal(validation.executableValidators, false);
  assert.equal(validation.runtime, false);
  assert.equal(validation.decisionExecution, false);
  assert.equal(validation.businessLogic, false);
});

import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import test from "node:test";
import { ProblemWorkspaceValidation } from "./problemWorkspaceValidation.ts";

const files = [
  "problemWorkspaceValidation.test.ts",
  "problemWorkspaceValidation.ts",
  "problemWorkspaceValidationCategories.ts",
  "problemWorkspaceValidationGates.ts",
  "problemWorkspaceValidationIdentity.ts",
  "problemWorkspaceValidationOutcomes.ts",
  "problemWorkspaceValidationRules.ts",
  "problemWorkspaceValidationTargets.ts",
];

test("WS-6:4 consists of exactly eight Validation artifacts", () => {
  assert.deepEqual(
    readdirSync(new URL(".", import.meta.url))
      .filter((file) => files.includes(file))
      .sort(),
    files,
  );
});

test("WS-6:4 publishes exactly 48 immutable rules", () => {
  const validation = ProblemWorkspaceValidation;
  assert.equal(validation.identity.id, "WS-6:4/ProblemWorkspaceValidation");
  assert.equal(
    validation.identity.namespace,
    "nexora.workspace.problem.validation",
  );
  assert.equal(validation.identity.version, "1.0.0");
  assert.equal(validation.readiness, "ReadyForManifest");
  assert.equal(validation.rules.length, 48);
  assert.equal(validation.rules.every(Object.isFrozen), true);
  assert.equal(new Set(validation.rules.map(({ id }) => id)).size, 48);
});

test("WS-6:4 collections and guarantees are complete", () => {
  const validation = ProblemWorkspaceValidation;
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
    validation.gates.every(({ outcome }) => outcome === "Pass"),
    true,
  );
  assert.equal(
    validation.guarantees.every(({ state }) => state === "Guaranteed"),
    true,
  );
});

test("WS-6:4 consumes only Foundation, Registry, and Model", () => {
  const validation = ProblemWorkspaceValidation;
  const source = readFileSync(
    new URL("./problemWorkspaceValidation.ts", import.meta.url),
    "utf8",
  );
  assert.equal(source.includes("problemWorkspaceManifest"), false);
  assert.deepEqual(validation.upstreamDependencies, [
    "WS-6:1 Problem Workspace Foundation",
    "WS-6:2 Problem Workspace Registry",
    "WS-6:3 Problem Workspace Model",
  ]);
  assert.equal(validation.runtimeValidationEngine, false);
  assert.equal(validation.problemSolving, false);
  assert.equal(validation.persistence, false);
  assert.equal(validation.businessLogic, false);
});

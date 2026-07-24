import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import test from "node:test";
import { DecisionWorkspaceValidation } from "./decisionWorkspaceValidation.ts";

const files = [
  "decisionWorkspaceValidation.test.ts",
  "decisionWorkspaceValidation.ts",
  "decisionWorkspaceValidationCategories.ts",
  "decisionWorkspaceValidationGates.ts",
  "decisionWorkspaceValidationIdentity.ts",
  "decisionWorkspaceValidationOutcomes.ts",
  "decisionWorkspaceValidationRules.ts",
  "decisionWorkspaceValidationTargets.ts",
];

test("WS-4:4 consists of exactly eight Validation artifacts", () => {
  assert.deepEqual(
    readdirSync(new URL(".", import.meta.url))
      .filter((file) => files.includes(file))
      .sort(),
    files,
  );
});

test("WS-4:4 publishes complete canonical validation collections", () => {
  const validation = DecisionWorkspaceValidation;
  assert.equal(validation.identity.id, "WS-4:4/DecisionWorkspaceValidation");
  assert.equal(
    validation.identity.namespace,
    "nexora.workspace.decision.validation",
  );
  assert.equal(validation.identity.version, "1.0.0");
  assert.equal(validation.identity.status, "Validation");
  assert.equal(validation.readiness, "ReadyForManifest");
  assert.deepEqual(
    [
      validation.categories.length,
      validation.targets.length,
      validation.outcomes.length,
      validation.severities.length,
      validation.gates.length,
    ],
    [15, 16, 5, 5, 15],
  );
  assert.equal(validation.summary.ruleCount, validation.rules.length);
  assert.equal(validation.summary.validationStatus, "Pass");
});

test("WS-4:4 identities are unique, ordered, immutable, and passing", () => {
  const validation = DecisionWorkspaceValidation;
  const collections = [
    validation.categories,
    validation.targets,
    validation.rules,
    validation.outcomes,
    validation.severities,
    validation.gates,
  ];
  const records = collections.flat();
  assert.equal(new Set(records.map(({ id }) => id)).size, records.length);
  assert.equal(records.every(Object.isFrozen), true);
  assert.equal(
    validation.gates.every(({ outcome }) => outcome === "Pass"),
    true,
  );
  assert.deepEqual(
    validation.gates.map(({ order }) => order),
    validation.gates.map((_, index) => index + 1),
  );
});

test("WS-4:4 preserves sources and contains no prohibited behavior", () => {
  const validation = DecisionWorkspaceValidation;
  assert.equal(validation.targets[0]?.source, validation.foundation);
  assert.equal(validation.targets[1]?.source, validation.registry);
  assert.equal(validation.targets[2]?.source, validation.model);
  const source = readFileSync(
    new URL("./decisionWorkspaceValidation.ts", import.meta.url),
    "utf8",
  );
  assert.equal(source.includes("decisionWorkspaceManifest"), false);
  assert.deepEqual(validation.upstreamDependencies, [
    "WS-4:1 Decision Workspace Foundation",
    "WS-4:2 Decision Workspace Registry",
    "WS-4:3 Decision Workspace Model",
  ]);
  assert.equal(validation.runtimeValidation, false);
  assert.equal(validation.businessLogic, false);
  assert.equal(validation.persistence, false);
  assert.equal(validation.ui, false);
});

import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import test from "node:test";
import { ScenarioWorkspaceValidation } from "./scenarioWorkspaceValidation.ts";

const files = [
  "scenarioWorkspaceValidation.test.ts",
  "scenarioWorkspaceValidation.ts",
  "scenarioWorkspaceValidationCategories.ts",
  "scenarioWorkspaceValidationGates.ts",
  "scenarioWorkspaceValidationIdentity.ts",
  "scenarioWorkspaceValidationOutcomes.ts",
  "scenarioWorkspaceValidationRules.ts",
  "scenarioWorkspaceValidationTargets.ts",
];

test("WS-5:4 consists of exactly eight Validation artifacts", () => {
  assert.deepEqual(
    readdirSync(new URL(".", import.meta.url))
      .filter((file) => files.includes(file))
      .sort(),
    files,
  );
});

test("WS-5:4 publishes complete canonical validation collections", () => {
  const validation = ScenarioWorkspaceValidation;
  assert.equal(validation.identity.id, "WS-5:4/ScenarioWorkspaceValidation");
  assert.equal(
    validation.identity.namespace,
    "nexora.workspace.scenario.validation",
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

test("WS-5:4 identities are unique, ordered, immutable, and passing", () => {
  const validation = ScenarioWorkspaceValidation;
  const records = [
    validation.categories,
    validation.targets,
    validation.rules,
    validation.outcomes,
    validation.severities,
    validation.gates,
  ].flat();
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

test("WS-5:4 preserves sources and contains no prohibited behavior", () => {
  const validation = ScenarioWorkspaceValidation;
  assert.equal(validation.targets[0]?.source, validation.foundation);
  assert.equal(validation.targets[1]?.source, validation.registry);
  assert.equal(validation.targets[2]?.source, validation.model);
  const source = readFileSync(
    new URL("./scenarioWorkspaceValidation.ts", import.meta.url),
    "utf8",
  );
  assert.equal(source.includes("scenarioWorkspaceManifest"), false);
  assert.deepEqual(validation.upstreamDependencies, [
    "WS-5:1 Scenario Workspace Foundation",
    "WS-5:2 Scenario Workspace Registry",
    "WS-5:3 Scenario Workspace Model",
  ]);
  assert.equal(validation.runtimeValidation, false);
  assert.equal(validation.simulationEngine, false);
  assert.equal(validation.predictionEngine, false);
  assert.equal(validation.businessLogic, false);
});

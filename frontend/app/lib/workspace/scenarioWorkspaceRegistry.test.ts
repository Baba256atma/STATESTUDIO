import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import test from "node:test";
import { ScenarioWorkspaceRegistry } from "./scenarioWorkspaceRegistry.ts";

const files = [
  "scenarioWorkspaceCapabilityRegistry.ts",
  "scenarioWorkspaceContractRegistry.ts",
  "scenarioWorkspaceIdentityRegistry.ts",
  "scenarioWorkspaceLifecycleRegistry.ts",
  "scenarioWorkspaceRegistry.test.ts",
  "scenarioWorkspaceRegistry.ts",
  "scenarioWorkspaceResponsibilityRegistry.ts",
  "scenarioWorkspaceScenarioTypeRegistry.ts",
];

test("WS-5:2 consists of exactly eight Registry artifacts", () => {
  assert.deepEqual(
    readdirSync(new URL(".", import.meta.url))
      .filter((file) => files.includes(file))
      .sort(),
    files,
  );
});

test("WS-5:2 publishes complete canonical registries", () => {
  const registry = ScenarioWorkspaceRegistry;
  assert.equal(registry.identity.id, "WS-5:2/ScenarioWorkspaceRegistry");
  assert.equal(registry.identity.namespace, "nexora.workspace.scenario.registry");
  assert.equal(registry.identity.version, "1.0.0");
  assert.equal(registry.identity.status, "Registry");
  assert.equal(registry.readiness, "ReadyForModel");
  assert.deepEqual(
    [
      registry.responsibilities.length,
      registry.capabilities.length,
      registry.scenarioTypes.length,
      registry.lifecycle.length,
      registry.contracts.length,
      registry.boundaries.length,
    ],
    [10, 12, 12, 8, 12, 15],
  );
});

test("WS-5:2 identifiers and keys are globally unique and immutable", () => {
  const records = [
    ScenarioWorkspaceRegistry.responsibilities,
    ScenarioWorkspaceRegistry.capabilities,
    ScenarioWorkspaceRegistry.scenarioTypes,
    ScenarioWorkspaceRegistry.lifecycle,
    ScenarioWorkspaceRegistry.contracts,
    ScenarioWorkspaceRegistry.boundaries,
  ].flat();
  assert.equal(new Set(records.map(({ id }) => id)).size, records.length);
  assert.equal(new Set(records.map(({ key }) => key)).size, records.length);
  assert.equal(records.every(Object.isFrozen), true);
});

test("WS-5:2 consumes only Foundation and preserves references", () => {
  const registry = ScenarioWorkspaceRegistry;
  assert.equal(registry.contracts[0].source, registry.foundation.contracts[0]);
  assert.equal(
    registry.capabilities[0].source,
    registry.foundation.capabilities[0],
  );
  const source = readFileSync(
    new URL("./scenarioWorkspaceRegistry.ts", import.meta.url),
    "utf8",
  );
  assert.equal(source.includes("scenarioWorkspaceModel"), false);
  assert.deepEqual(registry.upstreamDependencies, [
    "WS-5:1 Scenario Workspace Foundation",
  ]);
  assert.equal(registry.runtime, false);
  assert.equal(registry.simulationEngine, false);
  assert.equal(registry.predictionEngine, false);
  assert.equal(registry.businessLogic, false);
});

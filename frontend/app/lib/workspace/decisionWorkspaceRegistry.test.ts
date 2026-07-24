import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import test from "node:test";
import { DecisionWorkspaceRegistry } from "./decisionWorkspaceRegistry.ts";

const files = [
  "decisionWorkspaceCapabilityRegistry.ts",
  "decisionWorkspaceContractRegistry.ts",
  "decisionWorkspaceDecisionTypeRegistry.ts",
  "decisionWorkspaceIdentityRegistry.ts",
  "decisionWorkspaceLifecycleRegistry.ts",
  "decisionWorkspaceRegistry.test.ts",
  "decisionWorkspaceRegistry.ts",
  "decisionWorkspaceResponsibilityRegistry.ts",
];

test("WS-4:2 consists of exactly eight Registry artifacts", () => {
  assert.deepEqual(
    readdirSync(new URL(".", import.meta.url))
      .filter((file) => files.includes(file))
      .sort(),
    files,
  );
});

test("WS-4:2 publishes complete canonical registries", () => {
  const registry = DecisionWorkspaceRegistry;
  assert.equal(registry.identity.id, "WS-4:2/DecisionWorkspaceRegistry");
  assert.equal(registry.identity.namespace, "nexora.workspace.decision.registry");
  assert.equal(registry.identity.version, "1.0.0");
  assert.equal(registry.identity.status, "Registry");
  assert.equal(registry.readiness, "ReadyForModel");
  assert.deepEqual(
    [
      registry.responsibilities.length,
      registry.capabilities.length,
      registry.decisionTypes.length,
      registry.lifecycle.length,
      registry.contracts.length,
      registry.boundaries.length,
    ],
    [10, 12, 12, 8, 12, 14],
  );
});

test("WS-4:2 identifiers and keys are globally unique and immutable", () => {
  const records = [
    DecisionWorkspaceRegistry.responsibilities,
    DecisionWorkspaceRegistry.capabilities,
    DecisionWorkspaceRegistry.decisionTypes,
    DecisionWorkspaceRegistry.lifecycle,
    DecisionWorkspaceRegistry.contracts,
    DecisionWorkspaceRegistry.boundaries,
  ].flat();
  assert.equal(new Set(records.map(({ id }) => id)).size, records.length);
  assert.equal(new Set(records.map(({ key }) => key)).size, records.length);
  assert.equal(records.every(Object.isFrozen), true);
});

test("WS-4:2 consumes only Foundation and preserves references", () => {
  const registry = DecisionWorkspaceRegistry;
  assert.equal(registry.contracts[0].source, registry.foundation.contracts[0]);
  assert.equal(
    registry.capabilities[0].source,
    registry.foundation.capabilities[0],
  );
  const source = readFileSync(
    new URL("./decisionWorkspaceRegistry.ts", import.meta.url),
    "utf8",
  );
  assert.equal(source.includes("decisionWorkspaceModel"), false);
  assert.deepEqual(registry.upstreamDependencies, [
    "WS-4:1 Decision Workspace Foundation",
  ]);
  assert.equal(registry.runtime, false);
  assert.equal(registry.businessLogic, false);
  assert.equal(registry.persistence, false);
  assert.equal(registry.ui, false);
});

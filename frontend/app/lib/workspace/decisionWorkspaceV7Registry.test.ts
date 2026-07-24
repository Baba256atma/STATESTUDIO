import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import test from "node:test";
import { DecisionWorkspaceV7Registry } from "./decisionWorkspaceV7Registry.ts";

const files = [
  "decisionWorkspaceV7CapabilityRegistry.ts",
  "decisionWorkspaceV7ConstraintImpactRegistry.ts",
  "decisionWorkspaceV7GovernanceRegistry.ts",
  "decisionWorkspaceV7IdentityRegistry.ts",
  "decisionWorkspaceV7OptionRegistry.ts",
  "decisionWorkspaceV7Registry.test.ts",
  "decisionWorkspaceV7Registry.ts",
  "decisionWorkspaceV7TaxonomyRegistry.ts",
];

test("WS-7:2 consists of exactly eight collision-safe Registry artifacts", () => {
  assert.deepEqual(
    readdirSync(new URL(".", import.meta.url))
      .filter((file) => files.includes(file))
      .sort(),
    files,
  );
});

test("WS-7:2 publishes all canonical Decision registries", () => {
  const registry = DecisionWorkspaceV7Registry;
  assert.equal(registry.identity.id, "WS-7:2/DecisionWorkspaceRegistry");
  assert.equal(
    registry.identity.namespace,
    "nexora.workspace.decision.registry",
  );
  assert.equal(registry.identity.version, "1.0.0");
  assert.equal(registry.readiness, "ReadyForModel");
  assert.deepEqual(
    [
      registry.taxonomy.categories.length,
      registry.taxonomy.types.length,
      registry.taxonomy.statuses.length,
      registry.taxonomy.priorities.length,
      registry.taxonomy.confidenceLevels.length,
      registry.constraints.length,
      registry.impacts.length,
      registry.optionTypes.length,
    ],
    [15, 10, 8, 5, 5, 10, 12, 7],
  );
});

test("WS-7:2 identifiers and keys are globally unique", () => {
  const registry = DecisionWorkspaceV7Registry;
  const records = [
    registry.taxonomy.categories,
    registry.taxonomy.types,
    registry.taxonomy.statuses,
    registry.taxonomy.priorities,
    registry.taxonomy.confidenceLevels,
    registry.constraints,
    registry.impacts,
    registry.optionTypes,
    registry.capabilities,
    registry.responsibilities,
    registry.lifecycle,
    registry.boundaries,
  ].flat();
  assert.equal(new Set(records.map(({ id }) => id)).size, records.length);
  assert.equal(new Set(records.map(({ key }) => key)).size, records.length);
  assert.equal(records.every(Object.isFrozen), true);
});

test("WS-7:2 consumes only WS-7:1 Foundation and contains no runtime", () => {
  const registry = DecisionWorkspaceV7Registry;
  const source = readFileSync(
    new URL("./decisionWorkspaceV7Registry.ts", import.meta.url),
    "utf8",
  );
  assert.equal(source.includes("decisionWorkspaceV7Model"), false);
  assert.equal(source.includes("./decisionWorkspaceFoundation"), false);
  assert.deepEqual(registry.upstreamDependencies, [
    "WS-7:1 Decision Workspace Foundation",
  ]);
  assert.equal(registry.runtime, false);
  assert.equal(registry.aiReasoning, false);
  assert.equal(registry.persistence, false);
  assert.equal(registry.businessLogic, false);
});

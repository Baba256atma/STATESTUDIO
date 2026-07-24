import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import test from "node:test";
import { ValueWorkspaceRegistry } from "./valueWorkspaceRegistry.ts";

const files = [
  "valueWorkspaceCapabilityRegistry.ts",
  "valueWorkspaceEvidenceImpactRegistry.ts",
  "valueWorkspaceGovernanceRegistry.ts",
  "valueWorkspaceIdentityRegistry.ts",
  "valueWorkspaceOutcomeRoiRegistry.ts",
  "valueWorkspaceRegistry.test.ts",
  "valueWorkspaceRegistry.ts",
  "valueWorkspaceTaxonomyRegistry.ts",
];

test("WS-9:2 consists of exactly eight Registry artifacts", () => {
  assert.deepEqual(
    readdirSync(new URL(".", import.meta.url))
      .filter((file) => files.includes(file))
      .sort(),
    files,
  );
});

test("WS-9:2 publishes complete canonical vocabularies", () => {
  const registry = ValueWorkspaceRegistry;
  assert.equal(registry.identity.id, "WS-9:2/ValueWorkspaceRegistry");
  assert.equal(registry.identity.namespace, "nexora.workspace.value.registry");
  assert.equal(registry.readiness, "ReadyForModel");
  assert.deepEqual(
    [
      registry.valueCategories.length,
      registry.valueDimensions.length,
      registry.outcomeTypes.length,
      registry.roiTypes.length,
      registry.measurementTypes.length,
      registry.evidenceTypes.length,
      registry.impactDomains.length,
      registry.capabilities.length,
      registry.responsibilities.length,
      registry.lifecycle.length,
      registry.boundaries.length,
    ],
    [15, 12, 8, 7, 10, 10, 10, 11, 11, 8, 9],
  );
});

test("WS-9:2 registry identities are globally unique and immutable", () => {
  const registry = ValueWorkspaceRegistry;
  const records = [
    registry.valueCategories,
    registry.valueDimensions,
    registry.outcomeTypes,
    registry.roiTypes,
    registry.measurementTypes,
    registry.evidenceTypes,
    registry.impactDomains,
    registry.capabilities,
    registry.responsibilities,
    registry.lifecycle,
    registry.boundaries,
  ].flat();
  assert.equal(new Set(records.map(({ id }) => id)).size, records.length);
  assert.equal(new Set(records.map(({ key }) => key)).size, records.length);
  assert.equal(records.every(Object.isFrozen), true);
});

test("WS-9:2 consumes only Foundation and has no prohibited imports", () => {
  const source = readFileSync(
    new URL("./valueWorkspaceRegistry.ts", import.meta.url),
    "utf8",
  );
  assert.equal(source.includes("valueWorkspaceModel"), false);
  assert.deepEqual(ValueWorkspaceRegistry.upstreamDependencies, [
    "WS-9:1 Value Workspace Foundation",
  ]);
});

test("WS-9:2 contains no executable or business behavior", () => {
  const registry = ValueWorkspaceRegistry;
  assert.equal(registry.runtime, false);
  assert.equal(registry.valueCalculation, false);
  assert.equal(registry.roiCalculation, false);
  assert.equal(registry.financialAnalysis, false);
  assert.equal(registry.workflowExecution, false);
  assert.equal(registry.businessLogic, false);
});

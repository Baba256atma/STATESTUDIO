import assert from "node:assert/strict";
import test from "node:test";
import * as publicApi from "./executiveIntentResolutionIndex.ts";
import { ExecutiveIntentResolutionContracts, ExecutiveIntentResolutionFoundation, ExecutiveIntentResolutionMetadata, ExecutiveIntentResolutionRegistry, getExecutiveIntentResolutionFoundation, getExecutiveIntentResolutionMetadata, getExecutiveIntentResolutionRegistry } from "./executiveIntentResolutionIndex.ts";

const registryGroups = Object.values(ExecutiveIntentResolutionRegistry);

test("foundation aggregates immutable contracts, registry, metadata, and types", () => {
  assert.equal(ExecutiveIntentResolutionFoundation.contracts, ExecutiveIntentResolutionContracts);
  assert.equal(ExecutiveIntentResolutionFoundation.registry, ExecutiveIntentResolutionRegistry);
  assert.equal(ExecutiveIntentResolutionFoundation.metadata, ExecutiveIntentResolutionMetadata);
  assert.equal(ExecutiveIntentResolutionFoundation.types.length, 17);
  assert.equal(Object.isFrozen(ExecutiveIntentResolutionFoundation), true);
  assert.equal(Object.isFrozen(ExecutiveIntentResolutionFoundation.types), true);
});

test("all ten architectural contracts are complete and immutable", () => {
  assert.equal(ExecutiveIntentResolutionContracts.length, 10);
  assert.equal(Object.isFrozen(ExecutiveIntentResolutionContracts), true);
  assert.equal(ExecutiveIntentResolutionContracts.every(Object.isFrozen), true);
  assert.equal(new Set(ExecutiveIntentResolutionContracts.map(({ id }) => id)).size, 10);
});

test("registry groups are complete and deeply immutable", () => {
  assert.deepEqual(registryGroups.map(({ length }) => length), [15, 5, 17, 13, 10, 7, 4, 4, 7]);
  assert.equal(Object.isFrozen(ExecutiveIntentResolutionRegistry), true);
  assert.equal(registryGroups.every(Object.isFrozen), true);
  assert.equal(registryGroups.flat().every(Object.isFrozen), true);
  const identifiers = registryGroups.flat().map(({ id }) => id);
  assert.equal(new Set(identifiers).size, identifiers.length);
});

test("required intent, domain, capability, output, and lifecycle metadata is registered", () => {
  assert.deepEqual(ExecutiveIntentResolutionRegistry.intentTypes.map(({ name }) => name), ["Analysis", "Recommendation", "Planning", "Prediction", "Simulation", "Monitoring", "Explanation", "Comparison", "Investigation", "Optimization", "Forecast", "Validation", "DecisionSupport", "Reporting", "GeneralInquiry"]);
  assert.equal(ExecutiveIntentResolutionRegistry.domains.some(({ name }) => name === "BusinessHealth"), true);
  assert.equal(ExecutiveIntentResolutionRegistry.capabilities.some(({ name }) => name === "Prioritize"), true);
  assert.equal(ExecutiveIntentResolutionRegistry.outputExpectations.some(({ name }) => name === "DecisionBrief"), true);
  assert.deepEqual(ExecutiveIntentResolutionRegistry.lifecycleStages.map(({ name }) => name), ["Received", "Normalized", "Classified", "Resolved", "Validated", "Approved", "Released"]);
});

test("metadata identifies the deterministic ENG-3:1 foundation", () => {
  assert.equal(Object.isFrozen(ExecutiveIntentResolutionMetadata), true);
  assert.equal(ExecutiveIntentResolutionMetadata.platformId, "ENG-3:1");
  assert.equal(ExecutiveIntentResolutionMetadata.namespace, "nexora.engine.executive.intent-resolution.foundation");
  assert.equal(ExecutiveIntentResolutionMetadata.status, "FoundationDefined");
  assert.equal(ExecutiveIntentResolutionMetadata.metadataOnly, true);
});

test("helpers return canonical immutable references", () => {
  assert.equal(getExecutiveIntentResolutionFoundation(), ExecutiveIntentResolutionFoundation);
  assert.equal(getExecutiveIntentResolutionRegistry(), ExecutiveIntentResolutionRegistry);
  assert.equal(getExecutiveIntentResolutionMetadata(), ExecutiveIntentResolutionMetadata);
  assert.deepEqual(getExecutiveIntentResolutionFoundation(), getExecutiveIntentResolutionFoundation());
});

test("public index exposes only seven approved stable APIs", () => {
  assert.deepEqual(Object.keys(publicApi).sort(), [
    "ExecutiveIntentResolutionFoundation", "ExecutiveIntentResolutionContracts",
    "ExecutiveIntentResolutionRegistry", "ExecutiveIntentResolutionMetadata",
    "getExecutiveIntentResolutionFoundation", "getExecutiveIntentResolutionRegistry",
    "getExecutiveIntentResolutionMetadata",
  ].sort());
});

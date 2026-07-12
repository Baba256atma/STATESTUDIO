import assert from "node:assert/strict";
import test from "node:test";
import * as publicApi from "./executiveRequestIntentRegistryIndex.ts";
import { ExecutiveIntentRegistry, ExecutiveRequestCategoryRegistry, ExecutiveRequestClassificationRegistry, ExecutiveRequestContextRegistry, ExecutiveRequestIntentRegistryManifest, ExecutiveRequestPriorityRegistry, ExecutiveRequestScopeRegistry, ExecutiveRequestSourceRegistry, ExecutiveRequestStatusRegistry, getExecutiveRequestIntentRegistryManifest, getExecutiveRequestRegistrySummary } from "./executiveRequestIntentRegistryIndex.ts";

const registries = [
  ExecutiveRequestCategoryRegistry, ExecutiveIntentRegistry, ExecutiveRequestPriorityRegistry,
  ExecutiveRequestStatusRegistry, ExecutiveRequestScopeRegistry, ExecutiveRequestSourceRegistry,
  ExecutiveRequestClassificationRegistry, ExecutiveRequestContextRegistry,
] as const;

test("all eight canonical registries are complete and immutable", () => {
  assert.deepEqual(registries.map(({ length }) => length), [10, 10, 5, 6, 7, 6, 10, 6]);
  assert.equal(registries.every(Object.isFrozen), true);
  assert.equal(registries.flat().every(Object.isFrozen), true);
});

test("manifest aggregates canonical registries without duplication", () => {
  assert.equal(Object.isFrozen(ExecutiveRequestIntentRegistryManifest), true);
  assert.equal(Object.isFrozen(ExecutiveRequestIntentRegistryManifest.metadata), true);
  assert.equal(Object.isFrozen(ExecutiveRequestIntentRegistryManifest.inventory), true);
  assert.equal(Object.isFrozen(ExecutiveRequestIntentRegistryManifest.summary), true);
  assert.equal(ExecutiveRequestIntentRegistryManifest.inventory.length, 8);
  ExecutiveRequestIntentRegistryManifest.inventory.forEach((item, index) => assert.equal(item.entries, registries[index]));
});

test("registry identifiers and group identifiers are unique", () => {
  const entries = registries.flat();
  assert.equal(new Set(entries.map(({ id }) => id)).size, entries.length);
  assert.equal(new Set(ExecutiveRequestIntentRegistryManifest.inventory.map(({ groupId }) => groupId)).size, 8);
});

test("namespace and version metadata are consistent", () => {
  const { approvedNamespace, version } = ExecutiveRequestIntentRegistryManifest;
  assert.equal(registries.flat().every((entry) => entry.namespace === approvedNamespace), true);
  assert.equal(registries.flat().every((entry) => entry.version === version), true);
  assert.equal(ExecutiveRequestIntentRegistryManifest.inventory.every((item) => item.namespace === approvedNamespace), true);
});

test("summary and helpers are deterministic", () => {
  const summary = getExecutiveRequestRegistrySummary();
  assert.equal(summary.registryCount, 8);
  assert.equal(summary.entryCount, 60);
  assert.equal(summary.phase, "ENG-2:2");
  assert.equal(getExecutiveRequestIntentRegistryManifest(), ExecutiveRequestIntentRegistryManifest);
  assert.equal(getExecutiveRequestRegistrySummary(), ExecutiveRequestIntentRegistryManifest.summary);
});

test("public API is exact and stable", () => {
  assert.deepEqual(Object.keys(publicApi).sort(), [
    "ExecutiveRequestCategoryRegistry", "ExecutiveIntentRegistry",
    "ExecutiveRequestPriorityRegistry", "ExecutiveRequestStatusRegistry",
    "ExecutiveRequestScopeRegistry", "ExecutiveRequestSourceRegistry",
    "ExecutiveRequestClassificationRegistry", "ExecutiveRequestContextRegistry",
    "ExecutiveRequestIntentRegistryManifest", "getExecutiveRequestIntentRegistryManifest",
    "getExecutiveRequestRegistrySummary",
  ].sort());
});

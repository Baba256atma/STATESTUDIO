import assert from "node:assert/strict";
import test from "node:test";
import * as publicApi from "./executiveOperationsSuiteManifestIndex.ts";
import { ExecutiveOperationsSuiteManifest, ExecutiveOperationsSuiteManifestNamespace, ExecutiveOperationsSuiteManifestRegistry, ExecutiveOperationsSuiteManifestStatus, getExecutiveOperationsSuiteCompatibility, getExecutiveOperationsSuiteDependencyMap, getExecutiveOperationsSuiteManifest, getExecutiveOperationsSuiteManifestInventory, getExecutiveOperationsSuiteManifestMetadata, getExecutiveOperationsSuiteManifestSummary } from "./executiveOperationsSuiteManifestIndex.ts";
import { ExecutiveOperationsSuiteValidationMetadata } from "./executiveOperationsSuiteValidationIndex.ts";

const sections = ["metadata", "foundation", "registry", "validation", "inventory", "dependencyMap", "compatibility", "publicApi", "architecture", "boundaries", "summary"];

test("manifest exists with exactly the required sections", () => {
  assert.ok(ExecutiveOperationsSuiteManifest);
  assert.deepEqual(Object.keys(ExecutiveOperationsSuiteManifest), sections);
  assert.equal(Object.isFrozen(ExecutiveOperationsSuiteManifest), true);
});
test("component registry contains Foundation, Registry, and Validation", () => {
  assert.equal(ExecutiveOperationsSuiteManifestRegistry.length, 3);
  assert.deepEqual(ExecutiveOperationsSuiteManifestRegistry.map((entry) => entry.role), ["Foundation", "Registry", "Validation"]);
  assert.equal(ExecutiveOperationsSuiteManifestRegistry.every(Object.isFrozen), true);
});
test("inventory counts are complete and validation count is derived", () => {
  const inventory = getExecutiveOperationsSuiteManifestInventory();
  assert.deepEqual({ platforms: inventory.platformCount, phases: inventory.phaseCount, foundations: inventory.foundationCount, registries: inventory.registryCount, components: inventory.componentCount }, { platforms: 9, phases: 9, foundations: 10, registries: 9, components: 3 });
  assert.equal(inventory.validationRuleCount, ExecutiveOperationsSuiteValidationMetadata.validationCount);
});
test("dependency map preserves canonical phase order", () => {
  const dependencies = getExecutiveOperationsSuiteDependencyMap();
  assert.equal(dependencies.length, 9);
  assert.deepEqual(dependencies.map((entry) => entry.phaseId), ["OPS-1", "OPS-2", "OPS-3", "OPS-4", "OPS-5", "OPS-6", "OPS-7", "OPS-8", "OPS-9"]);
  assert.deepEqual(dependencies[8]?.consumes, ["OPS-1", "OPS-2", "OPS-3", "OPS-4", "OPS-5", "OPS-6", "OPS-7", "OPS-8"]);
});
test("compatibility preserves dependency and monitoring mappings", () => {
  const compatibility = getExecutiveOperationsSuiteCompatibility();
  assert.equal(compatibility.length, 9);
  assert.equal(compatibility.find((entry) => entry.platformId === "dependency")?.foundationSection, "monitoring");
  assert.equal(compatibility.find((entry) => entry.platformId === "monitoring")?.foundationSection, "dashboard");
});
test("metadata, public API inventory, and summary are consistent", () => {
  assert.equal(getExecutiveOperationsSuiteManifestMetadata().namespace, ExecutiveOperationsSuiteManifestNamespace);
  assert.equal(ExecutiveOperationsSuiteManifestStatus.releaseStatus, "Draft");
  assert.equal(ExecutiveOperationsSuiteManifest.publicApi.internalApisExposed, false);
  assert.equal(ExecutiveOperationsSuiteManifest.publicApi.foundation.length > 0, true);
  assert.equal(getExecutiveOperationsSuiteManifestSummary().readinessState, "ReadyForPlatformAggregation");
});
test("helpers return frozen deterministic structures", () => {
  assert.equal(getExecutiveOperationsSuiteManifest(), ExecutiveOperationsSuiteManifest);
  for (const value of [getExecutiveOperationsSuiteManifestMetadata(), getExecutiveOperationsSuiteManifestInventory(), getExecutiveOperationsSuiteManifestSummary(), getExecutiveOperationsSuiteDependencyMap(), getExecutiveOperationsSuiteCompatibility()]) assert.equal(Object.isFrozen(value), true);
  assert.deepEqual(getExecutiveOperationsSuiteManifest(), getExecutiveOperationsSuiteManifest());
});
test("nested structures and boundaries are immutable", () => {
  assert.equal(Object.isFrozen(ExecutiveOperationsSuiteManifest.registry), true);
  assert.equal(Object.isFrozen(ExecutiveOperationsSuiteManifest.validation), true);
  assert.equal(Object.isFrozen(ExecutiveOperationsSuiteManifest.publicApi), true);
  assert.equal(Object.isFrozen(ExecutiveOperationsSuiteManifest.publicApi.foundation), true);
  assert.equal(Object.isFrozen(ExecutiveOperationsSuiteManifest.boundaries), true);
});
test("public exports are stable and contain no runtime or mutation APIs", () => {
  const keys = Object.keys(publicApi);
  for (const required of ["ExecutiveOperationsSuiteManifest", "ExecutiveOperationsSuiteManifestRegistry", "getExecutiveOperationsSuiteManifest", "getExecutiveOperationsSuiteDependencyMap"]) assert.ok(keys.includes(required));
  assert.equal(keys.some((key) => /run|execute|validate|certif|freeze|register|update|remove|internal|test/i.test(key)), false);
});

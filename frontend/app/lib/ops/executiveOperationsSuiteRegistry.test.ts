import assert from "node:assert/strict";
import test from "node:test";
import * as publicApi from "./executiveOperationsSuiteRegistryIndex.ts";
import { ExecutiveOperationsSuitePhaseRegistry, ExecutiveOperationsSuitePlatformRegistry, ExecutiveOperationsSuiteRegistryManifest, ExecutiveOperationsSuiteRegistryMetadata, ExecutiveOperationsSuiteRegistryNamespace, getExecutiveOperationsSuitePhaseById, getExecutiveOperationsSuitePhaseRegistry, getExecutiveOperationsSuitePlatformById, getExecutiveOperationsSuitePlatformRegistry, getExecutiveOperationsSuiteRegistryManifest, getExecutiveOperationsSuiteRegistryMetadata } from "./executiveOperationsSuiteRegistryIndex.ts";

const platformIds = ["execution", "task", "workflow", "project", "resource", "scheduling", "dependency", "automation", "monitoring"];
const phaseIds = ["OPS-1", "OPS-2", "OPS-3", "OPS-4", "OPS-5", "OPS-6", "OPS-7", "OPS-8", "OPS-9"];

test("registries contain exactly nine unique canonical entries", () => {
  assert.equal(ExecutiveOperationsSuitePlatformRegistry.length, 9);
  assert.equal(ExecutiveOperationsSuitePhaseRegistry.length, 9);
  assert.equal(new Set(ExecutiveOperationsSuitePlatformRegistry.map((entry) => entry.platformId)).size, 9);
  assert.equal(new Set(ExecutiveOperationsSuitePhaseRegistry.map((entry) => entry.phaseId)).size, 9);
});

test("registry order and ownership map OPS-1 through OPS-9", () => {
  assert.deepEqual(ExecutiveOperationsSuitePlatformRegistry.map((entry) => entry.platformId), platformIds);
  assert.deepEqual(ExecutiveOperationsSuitePhaseRegistry.map((entry) => entry.phaseId), phaseIds);
  ExecutiveOperationsSuitePlatformRegistry.forEach((entry, index) => {
    assert.equal(entry.phaseId, phaseIds[index]);
    assert.equal(entry.order, index + 1);
    assert.equal(ExecutiveOperationsSuitePhaseRegistry[index]?.platformId, entry.platformId);
  });
});

test("deterministic exact lookups return entries or undefined", () => {
  assert.equal(getExecutiveOperationsSuitePlatformById("project")?.phaseId, "OPS-4");
  assert.equal(getExecutiveOperationsSuitePhaseById("OPS-6")?.platformId, "scheduling");
  assert.equal(getExecutiveOperationsSuitePlatformById("Project"), undefined);
  assert.equal(getExecutiveOperationsSuitePlatformById("unknown"), undefined);
  assert.equal(getExecutiveOperationsSuitePhaseById("ops-6"), undefined);
  assert.equal(getExecutiveOperationsSuitePhaseById("OPS-10"), undefined);
});

test("metadata and manifest are internally consistent", () => {
  assert.equal(ExecutiveOperationsSuiteRegistryMetadata.namespace, ExecutiveOperationsSuiteRegistryNamespace);
  assert.equal(ExecutiveOperationsSuiteRegistryMetadata.platformCount, 9);
  assert.equal(ExecutiveOperationsSuiteRegistryManifest.platformCount, 9);
  assert.equal(ExecutiveOperationsSuiteRegistryManifest.phaseCount, 9);
  assert.deepEqual(ExecutiveOperationsSuiteRegistryManifest.canonicalPhaseOrder, phaseIds);
  assert.deepEqual(ExecutiveOperationsSuiteRegistryManifest.canonicalPlatformOrder, platformIds);
});

test("foundation sections preserve OPS-10:1 compatibility mappings", () => {
  const dependency = getExecutiveOperationsSuitePlatformById("dependency");
  const monitoring = getExecutiveOperationsSuitePlatformById("monitoring");
  assert.equal(dependency?.phaseId, "OPS-7");
  assert.equal(dependency?.name, "Executive Dependency Intelligence");
  assert.equal(dependency?.foundationSection, "monitoring");
  assert.equal(monitoring?.phaseId, "OPS-9");
  assert.equal(monitoring?.name, "Executive Execution Monitoring Platform");
  assert.equal(monitoring?.foundationSection, "dashboard");
  assert.equal(ExecutiveOperationsSuiteRegistryManifest.foundationSectionMap.monitoring, "dashboard");
});

test("top-level and nested registry structures are immutable", () => {
  assert.equal(Object.isFrozen(ExecutiveOperationsSuitePlatformRegistry), true);
  assert.equal(Object.isFrozen(ExecutiveOperationsSuitePhaseRegistry), true);
  assert.equal(Object.isFrozen(ExecutiveOperationsSuiteRegistryManifest), true);
  assert.equal(ExecutiveOperationsSuitePlatformRegistry.every(Object.isFrozen), true);
  assert.equal(ExecutiveOperationsSuitePhaseRegistry.every((entry) => Object.isFrozen(entry) && Object.isFrozen(entry.owns) && Object.isFrozen(entry.consumes) && Object.isFrozen(entry.provides)), true);
  assert.equal(Object.isFrozen(ExecutiveOperationsSuiteRegistryManifest.foundationSectionMap), true);
});

test("helper APIs return canonical deterministic references", () => {
  assert.equal(getExecutiveOperationsSuitePlatformRegistry(), ExecutiveOperationsSuitePlatformRegistry);
  assert.equal(getExecutiveOperationsSuitePhaseRegistry(), ExecutiveOperationsSuitePhaseRegistry);
  assert.equal(getExecutiveOperationsSuiteRegistryManifest(), ExecutiveOperationsSuiteRegistryManifest);
  assert.equal(getExecutiveOperationsSuiteRegistryMetadata(), ExecutiveOperationsSuiteRegistryMetadata);
  assert.deepEqual(getExecutiveOperationsSuiteRegistryManifest(), getExecutiveOperationsSuiteRegistryManifest());
});

test("public index exposes only the approved registry surface", () => {
  const keys = Object.keys(publicApi);
  for (const required of ["ExecutiveOperationsSuitePlatformRegistry", "ExecutiveOperationsSuitePhaseRegistry", "ExecutiveOperationsSuiteRegistryManifest", "getExecutiveOperationsSuitePlatformById", "getExecutiveOperationsSuitePhaseById"]) assert.ok(keys.includes(required));
  assert.equal(keys.some((key) => /registerPlatform|unregisterPlatform|updateRegistry|addPhase|removePhase|replaceRegistry/.test(key)), false);
  assert.equal(keys.some((key) => /internal|test/i.test(key)), false);
});

test("phase dependency metadata remains frozen and upstream-only", () => {
  ExecutiveOperationsSuitePhaseRegistry.forEach((entry) => {
    assert.equal(entry.consumes.every((phaseId) => Number(phaseId.slice(4)) < entry.order), true);
    assert.equal(entry.owns.length, 1);
  });
  assert.deepEqual(getExecutiveOperationsSuitePhaseById("OPS-9")?.consumes, ["OPS-1", "OPS-2", "OPS-3", "OPS-4", "OPS-5", "OPS-6", "OPS-7", "OPS-8"]);
});

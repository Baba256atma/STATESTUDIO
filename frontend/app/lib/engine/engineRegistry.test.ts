import assert from "node:assert/strict";
import test from "node:test";
import * as publicApi from "./engineRegistryIndex.ts";
import { ExecutiveEngineCapabilityRegistry, ExecutiveEngineComponentRegistry, ExecutiveEngineCurrentLifecycle, ExecutiveEngineDependencyRegistry, ExecutiveEngineLifecycleRegistry, ExecutiveEngineRegistryManifest, ExecutiveEngineRegistryMetadata, getExecutiveEngineCapabilityRegistry, getExecutiveEngineRegistryManifest } from "./engineRegistryIndex.ts";

test("all engine registries and aggregate manifest exist", () => {
  assert.equal(ExecutiveEngineCapabilityRegistry.length, 8);
  assert.equal(ExecutiveEngineComponentRegistry.length, 9);
  assert.equal(ExecutiveEngineDependencyRegistry.length, 4);
  assert.equal(ExecutiveEngineLifecycleRegistry.length, 5);
  assert.ok(ExecutiveEngineRegistryManifest);
});

test("registries, entries, and nested manifest structures are immutable", () => {
  for (const registry of [ExecutiveEngineCapabilityRegistry, ExecutiveEngineComponentRegistry, ExecutiveEngineDependencyRegistry, ExecutiveEngineLifecycleRegistry]) {
    assert.equal(Object.isFrozen(registry), true);
    assert.equal(registry.every(Object.isFrozen), true);
  }
  assert.equal(Object.isFrozen(ExecutiveEngineRegistryManifest), true);
  assert.equal(Object.isFrozen(ExecutiveEngineRegistryManifest.metadata), true);
  assert.equal(Object.isFrozen(ExecutiveEngineCurrentLifecycle), true);
});

test("each registry has unique deterministic identifiers", () => {
  for (const registry of [ExecutiveEngineCapabilityRegistry, ExecutiveEngineComponentRegistry, ExecutiveEngineDependencyRegistry, ExecutiveEngineLifecycleRegistry]) {
    assert.equal(new Set(registry.map((entry) => entry.id)).size, registry.length);
  }
  assert.deepEqual(ExecutiveEngineLifecycleRegistry.map((entry) => entry.order), [1, 2, 3, 4, 5]);
});

test("dependencies contain only approved public layers", () => {
  assert.deepEqual(ExecutiveEngineDependencyRegistry.map((entry) => entry.id), ["CORE", "CORE-TEN", "BUS", "OPS"]);
  assert.equal(ExecutiveEngineDependencyRegistry.every((entry) => entry.dependencyType === "PublicApi" && !entry.circularDependencyAllowed), true);
});

test("lifecycle metadata identifies ENG-1:2 as active and metadata-only", () => {
  assert.deepEqual(ExecutiveEngineLifecycleRegistry.map((entry) => entry.id), ["planned", "active", "certified", "frozen", "released"]);
  assert.equal(ExecutiveEngineCurrentLifecycle.phaseId, "ENG-1:2");
  assert.equal(ExecutiveEngineCurrentLifecycle.status, "active");
  assert.equal(ExecutiveEngineCurrentLifecycle.metadataOnly, true);
});

test("manifest counts and references are complete", () => {
  assert.equal(ExecutiveEngineRegistryManifest.capabilityRegistry, ExecutiveEngineCapabilityRegistry);
  assert.equal(ExecutiveEngineRegistryManifest.componentRegistry, ExecutiveEngineComponentRegistry);
  assert.equal(ExecutiveEngineRegistryManifest.dependencyRegistry, ExecutiveEngineDependencyRegistry);
  assert.equal(ExecutiveEngineRegistryManifest.lifecycleRegistry, ExecutiveEngineLifecycleRegistry);
  assert.equal(ExecutiveEngineRegistryMetadata.capabilityCount, 8);
  assert.equal(ExecutiveEngineRegistryMetadata.componentCount, 9);
});

test("helper APIs return canonical deterministic references", () => {
  assert.equal(getExecutiveEngineCapabilityRegistry(), ExecutiveEngineCapabilityRegistry);
  assert.equal(getExecutiveEngineRegistryManifest(), ExecutiveEngineRegistryManifest);
  assert.deepEqual(getExecutiveEngineRegistryManifest(), getExecutiveEngineRegistryManifest());
});

test("public registry API contains no runtime processing surface", () => {
  const keys = Object.keys(publicApi);
  for (const required of ["ExecutiveEngineCapabilityRegistry", "ExecutiveEngineComponentRegistry", "ExecutiveEngineDependencyRegistry", "ExecutiveEngineLifecycleRegistry", "ExecutiveEngineRegistryManifest", "getExecutiveEngineCapabilityRegistry", "getExecutiveEngineRegistryManifest"]) assert.ok(keys.includes(required));
  assert.equal(keys.some((key) => /execute|reason|plan|orchestrat|route|process|register|update|remove|runtime|service/i.test(key)), false);
});

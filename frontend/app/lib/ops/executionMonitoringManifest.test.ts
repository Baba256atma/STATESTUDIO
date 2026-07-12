import assert from "node:assert/strict";
import test from "node:test";
import { ExecutionMonitoringPlatformDependencyMap, ExecutionMonitoringPlatformPhaseRegistry, ExecutionMonitoringPlatformPublicSurface, buildExecutionMonitoringManifest, validateExecutionMonitoringManifest } from "./executionMonitoringManifestIndex.ts";

test("phase registry represents all OPS-9 phases", () => {
  assert.equal(Object.isFrozen(ExecutionMonitoringPlatformPhaseRegistry), true);
  assert.deepEqual(ExecutionMonitoringPlatformPhaseRegistry.map((phase) => phase.phaseId), ["OPS-9:1", "OPS-9:2", "OPS-9:3", "OPS-9:4"]);
  assert.equal(ExecutionMonitoringPlatformPhaseRegistry.every((phase) => Object.isFrozen(phase.metadata)), true);
});

test("dependency map represents internal and cross-platform relationships", () => {
  assert.equal(Object.isFrozen(ExecutionMonitoringPlatformDependencyMap), true);
  assert.equal(ExecutionMonitoringPlatformDependencyMap.length, 14);
  assert.equal(ExecutionMonitoringPlatformDependencyMap.filter((entry) => entry.scope === "CrossPlatformCompatibility").length, 7);
});

test("public API surface represents every consumed layer", () => {
  assert.equal(Object.isFrozen(ExecutionMonitoringPlatformPublicSurface), true);
  assert.equal(ExecutionMonitoringPlatformPublicSurface.length, 29);
  assert.deepEqual(new Set(ExecutionMonitoringPlatformPublicSurface.map((entry) => entry.phaseId)), new Set(["OPS-9:1", "OPS-9:2", "OPS-9:3", "OPS-9:4"]));
});

test("builds the complete immutable manifest", () => {
  const manifest = buildExecutionMonitoringManifest();
  assert.equal(Object.isFrozen(manifest), true);
  assert.equal(manifest.descriptor.platformId, "OPS-9:1");
  assert.equal(manifest.summary.phaseCount, 4);
  assert.equal(manifest.releaseReadinessMetadata.readinessState, "Ready");
});

test("manifest validation returns PASS", () => {
  const validation = validateExecutionMonitoringManifest();
  assert.equal(Object.isFrozen(validation), true);
  assert.equal(validation.status, "PASS");
  assert.equal(validation.failedChecks, 0);
  assert.equal(validation.totalChecks, 9);
});

test("outputs are deterministic and metadata-only", () => {
  assert.deepEqual(buildExecutionMonitoringManifest(), buildExecutionMonitoringManifest());
  assert.deepEqual(validateExecutionMonitoringManifest(), validateExecutionMonitoringManifest());
  assert.equal(buildExecutionMonitoringManifest().metadataOnly, true);
});

test("public manifest API remains restricted and stable", async () => {
  const publicApi = await import("./executionMonitoringManifestIndex.ts");
  assert.deepEqual(Object.keys(publicApi).sort(), ["ExecutionMonitoringPlatformDependencyMap", "ExecutionMonitoringPlatformPhaseRegistry", "ExecutionMonitoringPlatformPublicSurface", "buildExecutionMonitoringManifest", "validateExecutionMonitoringManifest"].sort());
});

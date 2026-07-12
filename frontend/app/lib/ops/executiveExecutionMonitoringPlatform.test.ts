import assert from "node:assert/strict";
import test from "node:test";
import { buildExecutionMonitoringManifest } from "./executionMonitoringManifestIndex.ts";
import { getExecutionMonitoringValidationSummary } from "./executionMonitoringValidationIndex.ts";
import { ExecutiveExecutionMonitoringPlatform, ExecutiveExecutionMonitoringPlatformMetadata, ExecutiveExecutionMonitoringPlatformRegistry, ExecutiveExecutionMonitoringPlatformSummary, getExecutiveExecutionMonitoringPlatform, getExecutiveExecutionMonitoringPlatformMetadata, getExecutiveExecutionMonitoringPlatformSummary } from "./executiveExecutionMonitoringPlatformIndex.ts";

test("publishes the immutable platform registry", () => {
  assert.equal(Object.isFrozen(ExecutiveExecutionMonitoringPlatformRegistry), true);
  assert.equal(ExecutiveExecutionMonitoringPlatformRegistry.platformId, "OPS-9:1");
  assert.equal(ExecutiveExecutionMonitoringPlatformRegistry.releaseStatus, "Released");
});

test("publishes complete platform metadata", () => {
  assert.equal(Object.isFrozen(ExecutiveExecutionMonitoringPlatformMetadata), true);
  assert.equal(ExecutiveExecutionMonitoringPlatformMetadata.publicApiCount, 29);
  assert.equal(ExecutiveExecutionMonitoringPlatformMetadata.releaseReadiness, "Ready");
  assert.equal(ExecutiveExecutionMonitoringPlatformMetadata.consumedPhases.length, 4);
});

test("publishes the complete frozen namespace", () => {
  assert.equal(Object.isFrozen(ExecutiveExecutionMonitoringPlatform), true);
  for (const key of ["foundation", "registry", "model", "validation", "manifest", "metadata"] as const) {
    assert.ok(key in ExecutiveExecutionMonitoringPlatform);
    assert.equal(Object.isFrozen(ExecutiveExecutionMonitoringPlatform[key]), true);
  }
});

test("platform helpers return canonical frozen references", () => {
  assert.equal(getExecutiveExecutionMonitoringPlatform(), ExecutiveExecutionMonitoringPlatform);
  assert.equal(getExecutiveExecutionMonitoringPlatformMetadata(), ExecutiveExecutionMonitoringPlatformMetadata);
  assert.equal(getExecutiveExecutionMonitoringPlatformSummary(), ExecutiveExecutionMonitoringPlatformSummary);
  assert.equal(Object.isFrozen(getExecutiveExecutionMonitoringPlatformSummary()), true);
});

test("platform outputs are deterministic and metadata-only", () => {
  assert.deepEqual(getExecutiveExecutionMonitoringPlatform(), getExecutiveExecutionMonitoringPlatform());
  assert.deepEqual(getExecutiveExecutionMonitoringPlatformMetadata(), getExecutiveExecutionMonitoringPlatformMetadata());
  assert.deepEqual(getExecutiveExecutionMonitoringPlatformSummary(), getExecutiveExecutionMonitoringPlatformSummary());
  assert.equal(ExecutiveExecutionMonitoringPlatform.metadataOnly, true);
});

test("maintains manifest linkage", () => {
  const manifest = buildExecutionMonitoringManifest();
  assert.equal(ExecutiveExecutionMonitoringPlatform.metadata.manifestSummary.phaseCount, manifest.summary.phaseCount);
  assert.equal(ExecutiveExecutionMonitoringPlatform.manifest.buildExecutionMonitoringManifest().descriptor.platformId, "OPS-9:1");
});

test("maintains validation linkage", () => {
  assert.equal(ExecutiveExecutionMonitoringPlatform.metadata.validationSummary.status, getExecutionMonitoringValidationSummary().status);
  assert.equal(ExecutiveExecutionMonitoringPlatform.validation.validateExecutiveExecutionMonitoringPlatform().status, "PASS");
});

test("keeps the approved public API stable", async () => {
  const publicApi = await import("./executiveExecutionMonitoringPlatformIndex.ts");
  assert.deepEqual(Object.keys(publicApi).sort(), [
    "ExecutiveExecutionMonitoringPlatform", "ExecutiveExecutionMonitoringPlatformCompatibility",
    "ExecutiveExecutionMonitoringPlatformIdentity", "ExecutiveExecutionMonitoringPlatformMetadata",
    "ExecutiveExecutionMonitoringPlatformRegistry", "ExecutiveExecutionMonitoringPlatformRelease",
    "ExecutiveExecutionMonitoringPlatformSummary", "getExecutiveExecutionMonitoringPlatform",
    "getExecutiveExecutionMonitoringPlatformMetadata", "getExecutiveExecutionMonitoringPlatformSummary",
  ].sort());
});

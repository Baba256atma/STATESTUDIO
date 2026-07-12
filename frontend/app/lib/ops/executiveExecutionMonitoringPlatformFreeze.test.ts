import assert from "node:assert/strict";
import test from "node:test";
import { ExecutiveExecutionMonitoringPlatformCertifiedPhaseRegistry, ExecutiveExecutionMonitoringPlatformFreezeCompatibility, ExecutiveExecutionMonitoringPlatformFreezeRegistry, ExecutiveExecutionMonitoringPlatformRegressionMetadata, buildExecutiveExecutionMonitoringPlatformFreezeManifest, getExecutiveExecutionMonitoringPlatformFreezeStatus, getExecutiveExecutionMonitoringPlatformFreezeSummary, runExecutiveExecutionMonitoringPlatformFreeze, validateExecutiveExecutionMonitoringPlatformFreeze } from "./executiveExecutionMonitoringPlatformFreezeIndex.ts";

test("publishes the frozen registry", () => {
  assert.equal(Object.isFrozen(ExecutiveExecutionMonitoringPlatformFreezeRegistry), true);
  assert.equal(ExecutiveExecutionMonitoringPlatformFreezeRegistry.freezeId, "OPS-9:8");
  assert.equal(ExecutiveExecutionMonitoringPlatformCertifiedPhaseRegistry.length, 7);
});
test("publishes complete freeze compatibility", () => {
  assert.equal(Object.isFrozen(ExecutiveExecutionMonitoringPlatformFreezeCompatibility), true);
  assert.equal(ExecutiveExecutionMonitoringPlatformFreezeCompatibility.internal.length, 7);
  assert.equal(ExecutiveExecutionMonitoringPlatformFreezeCompatibility.crossPlatform.length, 7);
});
test("builds the immutable freeze manifest", () => {
  const manifest = buildExecutiveExecutionMonitoringPlatformFreezeManifest();
  assert.equal(Object.isFrozen(manifest), true);
  assert.equal(manifest.freezeIdentity.freezeStatus, "Frozen");
  assert.equal(manifest.releaseReadinessState, "Ready");
});
test("freeze validation returns PASS", () => {
  const validation = validateExecutiveExecutionMonitoringPlatformFreeze();
  assert.equal(validation.status, "PASS");
  assert.equal(validation.failedChecks, 0);
});
test("freeze runner passes all nineteen checks", () => {
  const result = runExecutiveExecutionMonitoringPlatformFreeze();
  assert.equal(result.overallFreezeStatus, "PASS");
  assert.equal(result.failed, 0);
  assert.equal(result.totalChecks, 19);
});
test("exports are immutable and deterministic", () => {
  assert.equal(Object.isFrozen(runExecutiveExecutionMonitoringPlatformFreeze()), true);
  assert.deepEqual(buildExecutiveExecutionMonitoringPlatformFreezeManifest(), buildExecutiveExecutionMonitoringPlatformFreezeManifest());
  assert.deepEqual(runExecutiveExecutionMonitoringPlatformFreeze(), runExecutiveExecutionMonitoringPlatformFreeze());
  assert.deepEqual(getExecutiveExecutionMonitoringPlatformFreezeSummary(), getExecutiveExecutionMonitoringPlatformFreezeSummary());
});
test("publishes release, extension, and regression metadata", () => {
  const manifest = buildExecutiveExecutionMonitoringPlatformFreezeManifest();
  assert.equal(manifest.publicApiFreezeStatus, "Frozen");
  assert.equal(manifest.extensionPolicy.status, "Locked");
  assert.equal(ExecutiveExecutionMonitoringPlatformRegressionMetadata.length, 15);
});
test("keeps the approved public API stable", async () => {
  const publicApi = await import("./executiveExecutionMonitoringPlatformFreezeIndex.ts");
  assert.deepEqual(Object.keys(publicApi).sort(), [
    "ExecutiveExecutionMonitoringPlatformCertifiedPhaseRegistry", "ExecutiveExecutionMonitoringPlatformFreezeCompatibility",
    "ExecutiveExecutionMonitoringPlatformFreezeRegistry", "ExecutiveExecutionMonitoringPlatformRegressionMetadata",
    "ExecutiveExecutionMonitoringPlatformRegressionSummary", "buildExecutiveExecutionMonitoringPlatformFreezeManifest",
    "getExecutiveExecutionMonitoringPlatformFreezeStatus", "getExecutiveExecutionMonitoringPlatformFreezeSummary",
    "runExecutiveExecutionMonitoringPlatformFreeze", "validateExecutiveExecutionMonitoringPlatformFreeze",
  ].sort());
  assert.equal(getExecutiveExecutionMonitoringPlatformFreezeStatus(), "PASS");
});

import assert from "node:assert/strict";
import test from "node:test";
import { ExecutiveExecutionMonitoringPlatformCertificationRegistry, ExecutiveExecutionMonitoringPlatformCompatibility, buildExecutiveExecutionMonitoringPlatformCertificationManifest, certifyExecutiveExecutionMonitoringPlatform, getExecutiveExecutionMonitoringCertificationSummary, getExecutiveExecutionMonitoringPlatformCertification, runExecutiveExecutionMonitoringPlatformCertification } from "./executiveExecutionMonitoringPlatformCertificationIndex.ts";

test("publishes the certification registry", () => {
  assert.equal(Object.isFrozen(ExecutiveExecutionMonitoringPlatformCertificationRegistry), true);
  assert.equal(ExecutiveExecutionMonitoringPlatformCertificationRegistry.certifiedPhases.length, 6);
  assert.equal(ExecutiveExecutionMonitoringPlatformCertificationRegistry.certificationStatus, "PASS");
});

test("publishes complete compatibility metadata", () => {
  assert.equal(Object.isFrozen(ExecutiveExecutionMonitoringPlatformCompatibility), true);
  assert.equal(ExecutiveExecutionMonitoringPlatformCompatibility.internal.length, 6);
  assert.equal(ExecutiveExecutionMonitoringPlatformCompatibility.crossPlatform.length, 7);
  assert.equal(ExecutiveExecutionMonitoringPlatformCompatibility.crossPlatform.some((entry) => entry.target === "OPS-8 Automation Platform"), true);
});

test("builds the immutable certification manifest", () => {
  const manifest = buildExecutiveExecutionMonitoringPlatformCertificationManifest();
  assert.equal(Object.isFrozen(manifest), true);
  assert.equal(manifest.certifiedPhases.length, 6);
  assert.equal(manifest.releaseReadiness.status, "Ready");
  assert.equal(manifest.manifestSummary.publicApiCount, 29);
});

test("certification helpers return PASS", () => {
  assert.equal(certifyExecutiveExecutionMonitoringPlatform(), "PASS");
  assert.equal(getExecutiveExecutionMonitoringPlatformCertification().status, "PASS");
  assert.equal(getExecutiveExecutionMonitoringCertificationSummary().certificationStatus, "PASS");
});

test("certification runner passes all fifteen checks", () => {
  const result = runExecutiveExecutionMonitoringPlatformCertification();
  assert.equal(Object.isFrozen(result), true);
  assert.equal(result.status, "PASS");
  assert.equal(result.failedChecks, 0);
  assert.equal(result.totalChecks, 15);
});

test("exports are immutable and deterministic", () => {
  assert.equal(Object.isFrozen(buildExecutiveExecutionMonitoringPlatformCertificationManifest()), true);
  assert.equal(Object.isFrozen(runExecutiveExecutionMonitoringPlatformCertification().checks), true);
  assert.deepEqual(buildExecutiveExecutionMonitoringPlatformCertificationManifest(), buildExecutiveExecutionMonitoringPlatformCertificationManifest());
  assert.deepEqual(runExecutiveExecutionMonitoringPlatformCertification(), runExecutiveExecutionMonitoringPlatformCertification());
  assert.deepEqual(getExecutiveExecutionMonitoringCertificationSummary(), getExecutiveExecutionMonitoringCertificationSummary());
});

test("keeps the approved public API stable", async () => {
  const publicApi = await import("./executiveExecutionMonitoringPlatformCertificationIndex.ts");
  assert.deepEqual(Object.keys(publicApi).sort(), [
    "ExecutiveExecutionMonitoringPlatformCertificationRegistry", "ExecutiveExecutionMonitoringPlatformCompatibility",
    "buildExecutiveExecutionMonitoringPlatformCertificationManifest", "certifyExecutiveExecutionMonitoringPlatform",
    "getExecutiveExecutionMonitoringCertificationSummary", "getExecutiveExecutionMonitoringPlatformCertification",
    "runExecutiveExecutionMonitoringPlatformCertification",
  ].sort());
});

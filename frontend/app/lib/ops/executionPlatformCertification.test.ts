import assert from "node:assert/strict";
import test from "node:test";

import {
  buildExecutionPlatformCertificationManifest,
  ExecutionPlatformCertificationRegistry,
  ExecutionPlatformCompatibility,
  getExecutionPlatformCertificationSummary,
  runExecutionPlatformCertification,
} from "./executionPlatformCertificationIndex.ts";

test("certification manifest builds", () => {
  const manifest = buildExecutionPlatformCertificationManifest();

  assert.equal(Object.isFrozen(manifest), true);
  assert.equal(manifest.certifiedPhases.length, 6);
  assert.equal(manifest.publicApiStatus, "Stable");
});

test("certification runner returns PASS", () => {
  const result = runExecutionPlatformCertification();

  assert.equal(result.overallStatus, "PASS");
  assert.equal(result.failed, 0);
  assert.equal(result.totalChecks, 8);
});

test("registry integrity", () => {
  assert.equal(Object.isFrozen(ExecutionPlatformCertificationRegistry), true);
  assert.equal(ExecutionPlatformCertificationRegistry.length, 6);
});

test("compatibility metadata integrity", () => {
  assert.equal(Object.isFrozen(ExecutionPlatformCompatibility), true);
  assert.equal(ExecutionPlatformCompatibility.length, 6);
});

test("deterministic behavior", () => {
  assert.deepEqual(
    buildExecutionPlatformCertificationManifest(),
    buildExecutionPlatformCertificationManifest(),
  );
  assert.deepEqual(
    runExecutionPlatformCertification(),
    runExecutionPlatformCertification(),
  );
  assert.deepEqual(
    getExecutionPlatformCertificationSummary(),
    getExecutionPlatformCertificationSummary(),
  );
});

test("immutable exports", () => {
  assert.equal(Object.isFrozen(buildExecutionPlatformCertificationManifest()), true);
  assert.equal(Object.isFrozen(runExecutionPlatformCertification()), true);
});

test("public API stability", () => {
  assert.equal(
    buildExecutionPlatformCertificationManifest().certificationStatus,
    "PASS",
  );
  assert.equal(
    getExecutionPlatformCertificationSummary().overallStatus,
    "PASS",
  );
});

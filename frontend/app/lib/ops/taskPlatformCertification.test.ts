import assert from "node:assert/strict";
import test from "node:test";

import { ExecutiveOperationsPublicIndexId } from "./executiveOperationsPublicIndex.ts";
import {
  buildTaskPlatformCertificationManifest,
  getTaskPlatformCertificationSummary,
  runTaskPlatformCertification,
  TaskPlatformCertificationRegistry,
  TaskPlatformCompatibility,
} from "./taskPlatformCertificationIndex.ts";

test("certification manifest builds", () => {
  const manifest = buildTaskPlatformCertificationManifest();

  assert.equal(Object.isFrozen(manifest), true);
  assert.equal(manifest.certifiedPhases.length, 6);
  assert.equal(manifest.publicApiStatus, "Stable");
});

test("certification runner returns PASS", () => {
  const result = runTaskPlatformCertification();

  assert.equal(result.overallStatus, "PASS");
  assert.equal(result.failed, 0);
  assert.equal(result.totalChecks, 8);
});

test("registry integrity", () => {
  assert.equal(Object.isFrozen(TaskPlatformCertificationRegistry), true);
  assert.equal(TaskPlatformCertificationRegistry.length, 6);
});

test("compatibility metadata integrity", () => {
  assert.equal(Object.isFrozen(TaskPlatformCompatibility), true);
  assert.equal(TaskPlatformCompatibility.length, 6);
});

test("deterministic behavior", () => {
  assert.deepEqual(
    buildTaskPlatformCertificationManifest(),
    buildTaskPlatformCertificationManifest(),
  );
  assert.deepEqual(
    runTaskPlatformCertification(),
    runTaskPlatformCertification(),
  );
  assert.deepEqual(
    getTaskPlatformCertificationSummary(),
    getTaskPlatformCertificationSummary(),
  );
});

test("immutable exports", () => {
  assert.equal(Object.isFrozen(buildTaskPlatformCertificationManifest()), true);
  assert.equal(Object.isFrozen(runTaskPlatformCertification()), true);
});

test("public API stability", () => {
  assert.equal(
    buildTaskPlatformCertificationManifest().certificationStatus,
    "PASS",
  );
  assert.equal(
    getTaskPlatformCertificationSummary().overallStatus,
    "PASS",
  );
});

test("compatibility with OPS-1 public platform", () => {
  assert.equal(ExecutiveOperationsPublicIndexId, "OPS-1:9");
  assert.equal(
    TaskPlatformCompatibility[0]?.target,
    "OPS-1 Public Platform",
  );
});

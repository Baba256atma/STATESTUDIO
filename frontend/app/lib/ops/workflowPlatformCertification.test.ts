import assert from "node:assert/strict";
import test from "node:test";

import { ExecutiveOperationsPublicIndexId } from "./executiveOperationsPublicIndex.ts";
import { ExecutiveTaskIntelligencePublicIndexId } from "./executiveTaskIntelligencePublicIndex.ts";
import {
  buildWorkflowPlatformCertificationManifest,
  getWorkflowPlatformCertificationSummary,
  runWorkflowPlatformCertification,
  WorkflowPlatformCertificationRegistry,
  WorkflowPlatformCompatibility,
} from "./workflowPlatformCertificationIndex.ts";

test("certification manifest builds", () => {
  const manifest = buildWorkflowPlatformCertificationManifest();

  assert.equal(Object.isFrozen(manifest), true);
  assert.equal(manifest.certifiedPhases.length, 6);
  assert.equal(manifest.publicApiStatus, "Stable");
});

test("certification runner returns PASS", () => {
  const result = runWorkflowPlatformCertification();

  assert.equal(result.overallStatus, "PASS");
  assert.equal(result.failed, 0);
  assert.equal(result.totalChecks, 9);
});

test("registry integrity", () => {
  assert.equal(Object.isFrozen(WorkflowPlatformCertificationRegistry), true);
  assert.equal(WorkflowPlatformCertificationRegistry.length, 7);
});

test("task compatibility certification exists", () => {
  assert.equal(
    WorkflowPlatformCertificationRegistry.some(
      (entry) => entry.category === "TaskCompatibility",
    ),
    true,
  );
  assert.equal(
    buildWorkflowPlatformCertificationManifest().manifestSummary.taskCompatibilityStatus,
    "PASS",
  );
});

test("compatibility metadata integrity", () => {
  assert.equal(Object.isFrozen(WorkflowPlatformCompatibility), true);
  assert.equal(WorkflowPlatformCompatibility.length, 6);
});

test("deterministic behavior", () => {
  assert.deepEqual(
    buildWorkflowPlatformCertificationManifest(),
    buildWorkflowPlatformCertificationManifest(),
  );
  assert.deepEqual(
    runWorkflowPlatformCertification(),
    runWorkflowPlatformCertification(),
  );
  assert.deepEqual(
    getWorkflowPlatformCertificationSummary(),
    getWorkflowPlatformCertificationSummary(),
  );
});

test("immutable exports", () => {
  assert.equal(Object.isFrozen(buildWorkflowPlatformCertificationManifest()), true);
  assert.equal(Object.isFrozen(runWorkflowPlatformCertification()), true);
});

test("public API stability", () => {
  assert.equal(
    buildWorkflowPlatformCertificationManifest().certificationStatus,
    "PASS",
  );
  assert.equal(
    getWorkflowPlatformCertificationSummary().overallStatus,
    "PASS",
  );
});

test("compatibility with OPS-1 and OPS-2 public platforms", () => {
  assert.equal(ExecutiveOperationsPublicIndexId, "OPS-1:9");
  assert.equal(ExecutiveTaskIntelligencePublicIndexId, "OPS-2:9");
  assert.equal(
    WorkflowPlatformCompatibility[0]?.target,
    "OPS-1 Public Platform",
  );
  assert.equal(
    WorkflowPlatformCompatibility[1]?.target,
    "OPS-2 Task Intelligence Public Platform",
  );
});

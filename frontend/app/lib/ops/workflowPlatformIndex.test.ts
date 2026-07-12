import assert from "node:assert/strict";
import test from "node:test";

import { ExecutiveOperationsPublicIndexId } from "./executiveOperationsPublicIndex.ts";
import { ExecutiveTaskIntelligencePublicIndexId } from "./executiveTaskIntelligencePublicIndex.ts";
import {
  ExecutiveWorkflowIntelligencePlatform,
  ExecutiveWorkflowIntelligencePlatformPublicRegistry,
  ExecutiveWorkflowIntelligencePlatformReleaseSummary,
  validateWorkflowPlatformIndex,
} from "./workflowPlatformIndex.ts";

test("namespace exists", () => {
  assert.ok(ExecutiveWorkflowIntelligencePlatform);
});

test("namespace includes foundation, metadata, model, validation, manifest, publicIndex", () => {
  assert.ok("foundation" in ExecutiveWorkflowIntelligencePlatform);
  assert.ok("metadata" in ExecutiveWorkflowIntelligencePlatform);
  assert.ok("model" in ExecutiveWorkflowIntelligencePlatform);
  assert.ok("validation" in ExecutiveWorkflowIntelligencePlatform);
  assert.ok("manifest" in ExecutiveWorkflowIntelligencePlatform);
  assert.ok("publicIndex" in ExecutiveWorkflowIntelligencePlatform);
});

test("public registry is complete", () => {
  assert.equal(
    ExecutiveWorkflowIntelligencePlatformPublicRegistry.totalExportCount >= 22,
    true,
  );
  assert.equal(
    ExecutiveWorkflowIntelligencePlatformPublicRegistry.publicApiStatus,
    "Stable",
  );
});

test("release summary is complete", () => {
  assert.equal(
    ExecutiveWorkflowIntelligencePlatformReleaseSummary.platformId,
    "OPS-3:1",
  );
  assert.equal(ExecutiveWorkflowIntelligencePlatformReleaseSummary.phaseCount, 4);
  assert.equal(
    ExecutiveWorkflowIntelligencePlatformReleaseSummary.taskCompatibilityStatus,
    "PASS",
  );
  assert.equal(
    ExecutiveWorkflowIntelligencePlatformReleaseSummary.releaseReadiness,
    "Ready",
  );
});

test("validation returns PASS", () => {
  const validation = validateWorkflowPlatformIndex();
  assert.equal(validation.status, "PASS");
  assert.equal(validation.failedChecks, 0);
});

test("task compatibility is represented", () => {
  assert.equal(
    ExecutiveWorkflowIntelligencePlatform.publicIndex.releaseSummary.taskCompatibilityStatus,
    "PASS",
  );
  assert.equal(
    ExecutiveWorkflowIntelligencePlatform.manifest.buildWorkflowPlatformManifest()
      .taskCompatibilitySummary.ops2DependencyRepresented,
    true,
  );
});

test("namespace is immutable", () => {
  assert.equal(Object.isFrozen(ExecutiveWorkflowIntelligencePlatform), true);
});

test("output is deterministic", () => {
  assert.deepEqual(
    ExecutiveWorkflowIntelligencePlatformReleaseSummary,
    ExecutiveWorkflowIntelligencePlatformReleaseSummary,
  );
  assert.deepEqual(validateWorkflowPlatformIndex(), validateWorkflowPlatformIndex());
});

test("public API is stable", () => {
  assert.equal(ExecutiveWorkflowIntelligencePlatform.metadataOnly, true);
  assert.equal(ExecutiveWorkflowIntelligencePlatform.immutable, true);
  assert.equal(ExecutiveWorkflowIntelligencePlatform.deterministic, true);
});

test("compatibility with OPS-1 and OPS-2 public platforms", () => {
  assert.equal(ExecutiveOperationsPublicIndexId, "OPS-1:9");
  assert.equal(ExecutiveTaskIntelligencePublicIndexId, "OPS-2:9");
  assert.deepEqual(
    ExecutiveWorkflowIntelligencePlatform.foundation.WorkflowIntelligenceIdentity.dependencySources,
    ["OPS-1:9", "OPS-2:9"],
  );
});

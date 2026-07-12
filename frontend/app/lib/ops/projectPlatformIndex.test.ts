import assert from "node:assert/strict";
import test from "node:test";

import { ExecutiveOperationsPublicIndexId } from "./executiveOperationsPublicIndex.ts";
import {
  ExecutiveTaskIntelligencePublicIndexId,
} from "./executiveTaskIntelligencePublicIndex.ts";
import {
  ExecutiveWorkflowIntelligencePublicIndexId,
} from "./executiveWorkflowIntelligencePublicIndex.ts";
import {
  ExecutiveProjectExecutionPlatform,
  ExecutiveProjectExecutionPlatformPublicRegistry,
  ExecutiveProjectExecutionPlatformReleaseSummary,
  validateProjectPlatformIndex,
} from "./projectPlatformIndex.ts";

test("namespace integrity", () => {
  assert.ok(ExecutiveProjectExecutionPlatform);
  assert.ok("foundation" in ExecutiveProjectExecutionPlatform);
  assert.ok("metadata" in ExecutiveProjectExecutionPlatform);
  assert.ok("model" in ExecutiveProjectExecutionPlatform);
  assert.ok("validation" in ExecutiveProjectExecutionPlatform);
  assert.ok("manifest" in ExecutiveProjectExecutionPlatform);
  assert.ok("publicIndex" in ExecutiveProjectExecutionPlatform);
});

test("immutable exports", () => {
  assert.equal(Object.isFrozen(ExecutiveProjectExecutionPlatform), true);
  assert.equal(
    Object.isFrozen(ExecutiveProjectExecutionPlatform.publicIndex),
    true,
  );
});

test("deterministic output", () => {
  assert.deepEqual(
    ExecutiveProjectExecutionPlatformReleaseSummary,
    ExecutiveProjectExecutionPlatformReleaseSummary,
  );
  assert.deepEqual(validateProjectPlatformIndex(), validateProjectPlatformIndex());
});

test("public API stability", () => {
  assert.equal(
    ExecutiveProjectExecutionPlatformPublicRegistry.totalExportCount >= 22,
    true,
  );
  assert.equal(
    ExecutiveProjectExecutionPlatformPublicRegistry.publicApiStatus,
    "Stable",
  );
  assert.equal(ExecutiveProjectExecutionPlatform.metadataOnly, true);
});

test("compatibility with OPS-1, OPS-2, OPS-3, and OPS-4:1 through OPS-4:5", () => {
  assert.equal(ExecutiveOperationsPublicIndexId, "OPS-1:9");
  assert.equal(ExecutiveTaskIntelligencePublicIndexId, "OPS-2:9");
  assert.equal(ExecutiveWorkflowIntelligencePublicIndexId, "OPS-3:9");
  assert.equal(
    ExecutiveProjectExecutionPlatform.foundation.ProjectExecutionIdentity
      .dependencySources.includes("OPS-2:9"),
    true,
  );
  assert.equal(
    ExecutiveProjectExecutionPlatform.foundation.ProjectExecutionIdentity
      .dependencySources.includes("OPS-3:9"),
    true,
  );
});

test("release summary complete", () => {
  assert.equal(ExecutiveProjectExecutionPlatformReleaseSummary.platformId, "OPS-4:1");
  assert.equal(ExecutiveProjectExecutionPlatformReleaseSummary.phaseCount, 4);
  assert.equal(
    ExecutiveProjectExecutionPlatformReleaseSummary.releaseReadiness,
    "Ready",
  );
  assert.equal(
    ExecutiveProjectExecutionPlatformReleaseSummary.taskCompatibilityStatus,
    "PASS",
  );
  assert.equal(
    ExecutiveProjectExecutionPlatformReleaseSummary.workflowCompatibilityStatus,
    "PASS",
  );
});

test("validation returns PASS", () => {
  const validation = validateProjectPlatformIndex();
  assert.equal(validation.status, "PASS");
  assert.equal(validation.failedChecks, 0);
});


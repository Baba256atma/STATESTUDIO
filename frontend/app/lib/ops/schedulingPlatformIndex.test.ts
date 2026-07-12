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
  ExecutiveProjectExecutionPublicIndexId,
} from "./executiveProjectExecutionPublicIndex.ts";
import {
  ExecutiveResourceIntelligencePublicIndexId,
} from "./executiveResourceIntelligencePublicIndex.ts";
import {
  ExecutiveSchedulingPlatform,
  ExecutiveSchedulingPlatformPublicRegistry,
  ExecutiveSchedulingPlatformReleaseSummary,
  validateSchedulingPlatformIndex,
} from "./schedulingPlatformIndex.ts";

test("namespace integrity", () => {
  assert.ok(ExecutiveSchedulingPlatform);
  assert.ok("foundation" in ExecutiveSchedulingPlatform);
  assert.ok("metadata" in ExecutiveSchedulingPlatform);
  assert.ok("model" in ExecutiveSchedulingPlatform);
  assert.ok("validation" in ExecutiveSchedulingPlatform);
  assert.ok("manifest" in ExecutiveSchedulingPlatform);
  assert.ok("publicIndex" in ExecutiveSchedulingPlatform);
});

test("immutable exports", () => {
  assert.equal(Object.isFrozen(ExecutiveSchedulingPlatform), true);
  assert.equal(Object.isFrozen(ExecutiveSchedulingPlatform.publicIndex), true);
});

test("deterministic output", () => {
  assert.deepEqual(
    ExecutiveSchedulingPlatformReleaseSummary,
    ExecutiveSchedulingPlatformReleaseSummary,
  );
  assert.deepEqual(
    validateSchedulingPlatformIndex(),
    validateSchedulingPlatformIndex(),
  );
});

test("public API stability", () => {
  assert.equal(
    ExecutiveSchedulingPlatformPublicRegistry.totalExportCount >= 22,
    true,
  );
  assert.equal(
    ExecutiveSchedulingPlatformPublicRegistry.publicApiStatus,
    "Stable",
  );
  assert.equal(ExecutiveSchedulingPlatform.metadataOnly, true);
});

test("compatibility with OPS-1 through OPS-6:5", () => {
  assert.equal(ExecutiveOperationsPublicIndexId, "OPS-1:9");
  assert.equal(ExecutiveTaskIntelligencePublicIndexId, "OPS-2:9");
  assert.equal(ExecutiveWorkflowIntelligencePublicIndexId, "OPS-3:9");
  assert.equal(ExecutiveProjectExecutionPublicIndexId, "OPS-4:9");
  assert.equal(ExecutiveResourceIntelligencePublicIndexId, "OPS-5:9");
  assert.equal(
    ExecutiveSchedulingPlatform.foundation.SchedulingIntelligenceIdentity.dependencySources.includes(
      "OPS-2:9",
    ),
    true,
  );
  assert.equal(
    ExecutiveSchedulingPlatform.foundation.SchedulingIntelligenceIdentity.dependencySources.includes(
      "OPS-3:9",
    ),
    true,
  );
  assert.equal(
    ExecutiveSchedulingPlatform.foundation.SchedulingIntelligenceIdentity.dependencySources.includes(
      "OPS-4:9",
    ),
    true,
  );
  assert.equal(
    ExecutiveSchedulingPlatform.foundation.SchedulingIntelligenceIdentity.dependencySources.includes(
      "OPS-5:9",
    ),
    true,
  );
});

test("release summary complete", () => {
  assert.equal(ExecutiveSchedulingPlatformReleaseSummary.platformId, "OPS-6:1");
  assert.equal(ExecutiveSchedulingPlatformReleaseSummary.phaseCount, 4);
  assert.equal(ExecutiveSchedulingPlatformReleaseSummary.releaseReadiness, "Ready");
  assert.equal(
    ExecutiveSchedulingPlatformReleaseSummary.taskCompatibilityStatus,
    "PASS",
  );
  assert.equal(
    ExecutiveSchedulingPlatformReleaseSummary.workflowCompatibilityStatus,
    "PASS",
  );
  assert.equal(
    ExecutiveSchedulingPlatformReleaseSummary.projectCompatibilityStatus,
    "PASS",
  );
  assert.equal(
    ExecutiveSchedulingPlatformReleaseSummary.resourceCompatibilityStatus,
    "PASS",
  );
});

test("validation returns PASS", () => {
  const validation = validateSchedulingPlatformIndex();
  assert.equal(validation.status, "PASS");
  assert.equal(validation.failedChecks, 0);
});

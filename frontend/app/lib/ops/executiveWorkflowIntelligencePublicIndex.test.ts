import assert from "node:assert/strict";
import test from "node:test";

import { ExecutiveOperationsPublicIndexId } from "./executiveOperationsPublicIndex.ts";
import { ExecutiveTaskIntelligencePublicIndexId } from "./executiveTaskIntelligencePublicIndex.ts";
import {
  ExecutiveWorkflowIntelligencePlatformPublicFoundation,
  ExecutiveWorkflowIntelligencePublicApiRegistry,
  ExecutiveWorkflowIntelligencePublicIndexId,
  ExecutiveWorkflowIntelligencePublicIndexStatus,
  getExecutiveWorkflowIntelligencePublicApiRegistry,
  getExecutiveWorkflowIntelligencePublicFoundation,
  getExecutiveWorkflowIntelligencePublicMetadata,
  getExecutiveWorkflowIntelligenceReleaseSummary,
} from "./executiveWorkflowIntelligencePublicIndex.ts";

test("namespace integrity", () => {
  assert.ok(ExecutiveWorkflowIntelligencePlatformPublicFoundation);
  assert.ok("foundation" in ExecutiveWorkflowIntelligencePlatformPublicFoundation);
  assert.ok("metadata" in ExecutiveWorkflowIntelligencePlatformPublicFoundation);
  assert.ok("model" in ExecutiveWorkflowIntelligencePlatformPublicFoundation);
  assert.ok("validation" in ExecutiveWorkflowIntelligencePlatformPublicFoundation);
  assert.ok("manifest" in ExecutiveWorkflowIntelligencePlatformPublicFoundation);
  assert.ok("platform" in ExecutiveWorkflowIntelligencePlatformPublicFoundation);
  assert.ok("certification" in ExecutiveWorkflowIntelligencePlatformPublicFoundation);
  assert.ok("freeze" in ExecutiveWorkflowIntelligencePlatformPublicFoundation);
  assert.ok("publicIndex" in ExecutiveWorkflowIntelligencePlatformPublicFoundation);
});

test("public metadata integrity", () => {
  const metadata = getExecutiveWorkflowIntelligencePublicMetadata();

  assert.equal(metadata.publicIndexId, "OPS-3:9");
  assert.equal(metadata.platformId, "OPS-3:1");
  assert.equal(metadata.status.releaseStatus, "Released");
  assert.equal(Object.isFrozen(metadata), true);
});

test("release summary", () => {
  const summary = getExecutiveWorkflowIntelligenceReleaseSummary();

  assert.equal(summary.platformId, "OPS-3:1");
  assert.equal(summary.phaseCount, 8);
  assert.equal(summary.certificationStatus, "PASS");
  assert.equal(summary.freezeStatus, "PASS");
  assert.equal(summary.taskCompatibilityStatus, "PASS");
  assert.equal(summary.releaseReadiness, "Ready");
});

test("public registry", () => {
  assert.equal(
    ExecutiveWorkflowIntelligencePublicApiRegistry.totalExportCount >= 35,
    true,
  );
  assert.equal(ExecutiveWorkflowIntelligencePublicApiRegistry.publicApiStatus, "Stable");
  assert.equal(
    getExecutiveWorkflowIntelligencePublicApiRegistry().publicIndexApis.length,
    12,
  );
});

test("immutable exports", () => {
  assert.equal(Object.isFrozen(ExecutiveWorkflowIntelligencePlatformPublicFoundation), true);
  assert.equal(Object.isFrozen(ExecutiveWorkflowIntelligencePublicApiRegistry), true);
});

test("deterministic behavior", () => {
  assert.deepEqual(
    getExecutiveWorkflowIntelligencePublicFoundation(),
    getExecutiveWorkflowIntelligencePublicFoundation(),
  );
  assert.deepEqual(
    getExecutiveWorkflowIntelligencePublicMetadata(),
    getExecutiveWorkflowIntelligencePublicMetadata(),
  );
  assert.deepEqual(
    getExecutiveWorkflowIntelligenceReleaseSummary(),
    getExecutiveWorkflowIntelligenceReleaseSummary(),
  );
});

test("stable public API", () => {
  assert.equal(ExecutiveWorkflowIntelligencePublicIndexId, "OPS-3:9");
  assert.equal(ExecutiveWorkflowIntelligencePublicIndexStatus.certificationStatus, "Certified");
  assert.equal(ExecutiveWorkflowIntelligencePublicIndexStatus.freezeStatus, "Frozen");
  assert.equal(ExecutiveWorkflowIntelligencePlatformPublicFoundation.immutable, true);
});

test("OPS-2 task compatibility", () => {
  assert.equal(
    ExecutiveWorkflowIntelligencePlatformPublicFoundation.freeze.WorkflowPlatformTaskCompatibility
      .length,
    2,
  );
  assert.equal(
    ExecutiveWorkflowIntelligencePlatformPublicFoundation.publicIndex.releaseSummary
      .taskCompatibilityStatus,
    "PASS",
  );
});

test("compatibility with OPS-1 and all OPS-3 phases", () => {
  assert.equal(ExecutiveOperationsPublicIndexId, "OPS-1:9");
  assert.equal(ExecutiveTaskIntelligencePublicIndexId, "OPS-2:9");
  assert.deepEqual(
    ExecutiveWorkflowIntelligencePlatformPublicFoundation.foundation.WorkflowIntelligenceIdentity
      .dependencySources,
    ["OPS-1:9", "OPS-2:9"],
  );
  assert.equal(
    ExecutiveWorkflowIntelligencePlatformPublicFoundation.certification
      .buildWorkflowPlatformCertificationManifest().certifiedPhases.length,
    6,
  );
  assert.equal(
    ExecutiveWorkflowIntelligencePlatformPublicFoundation.freeze
      .buildWorkflowPlatformFreezeManifest().certifiedPhaseRegistry.length,
    7,
  );
});

import assert from "node:assert/strict";
import test from "node:test";

import { ExecutiveOperationsPublicIndexId } from "./executiveOperationsPublicIndex.ts";
import { ExecutiveTaskIntelligencePublicIndexId } from "./executiveTaskIntelligencePublicIndex.ts";
import { ExecutiveWorkflowIntelligencePublicIndexId } from "./executiveWorkflowIntelligencePublicIndex.ts";
import { ExecutiveProjectExecutionPublicIndexId } from "./executiveProjectExecutionPublicIndex.ts";
import { ExecutiveResourceIntelligencePublicIndexId } from "./executiveResourceIntelligencePublicIndex.ts";
import {
  ExecutiveSchedulingIntelligencePlatformPublicFoundation,
  ExecutiveSchedulingPublicApiRegistry,
  ExecutiveSchedulingPublicIndexId,
  ExecutiveSchedulingPublicIndexStatus,
  getExecutiveSchedulingPublicApiRegistry,
  getExecutiveSchedulingPublicFoundation,
  getExecutiveSchedulingPublicMetadata,
  getExecutiveSchedulingReleaseSummary,
} from "./executiveSchedulingPublicIndex.ts";

test("public namespace completeness", () => {
  assert.ok(ExecutiveSchedulingIntelligencePlatformPublicFoundation);
  assert.ok("foundation" in ExecutiveSchedulingIntelligencePlatformPublicFoundation);
  assert.ok("metadata" in ExecutiveSchedulingIntelligencePlatformPublicFoundation);
  assert.ok("model" in ExecutiveSchedulingIntelligencePlatformPublicFoundation);
  assert.ok("validation" in ExecutiveSchedulingIntelligencePlatformPublicFoundation);
  assert.ok("manifest" in ExecutiveSchedulingIntelligencePlatformPublicFoundation);
  assert.ok("platform" in ExecutiveSchedulingIntelligencePlatformPublicFoundation);
  assert.ok("certification" in ExecutiveSchedulingIntelligencePlatformPublicFoundation);
  assert.ok("freeze" in ExecutiveSchedulingIntelligencePlatformPublicFoundation);
  assert.ok("publicIndex" in ExecutiveSchedulingIntelligencePlatformPublicFoundation);
});

test("immutable namespace", () => {
  assert.equal(Object.isFrozen(ExecutiveSchedulingIntelligencePlatformPublicFoundation), true);
  assert.equal(Object.isFrozen(ExecutiveSchedulingPublicApiRegistry), true);
});

test("metadata correctness", () => {
  const metadata = getExecutiveSchedulingPublicMetadata();

  assert.equal(metadata.publicIndexId, "OPS-6:9");
  assert.equal(metadata.platformId, "OPS-6:1");
  assert.equal(metadata.status.releaseStatus, "Released");
  assert.equal(Object.isFrozen(metadata), true);
});

test("registry correctness", () => {
  assert.equal(ExecutiveSchedulingPublicApiRegistry.totalExportCount >= 46, true);
  assert.equal(ExecutiveSchedulingPublicApiRegistry.publicApiStatus, "Stable");
  assert.equal(getExecutiveSchedulingPublicApiRegistry().publicIndexApis.length, 12);
});

test("release summary", () => {
  const summary = getExecutiveSchedulingReleaseSummary();

  assert.equal(summary.platformId, "OPS-6:1");
  assert.equal(summary.phaseCount, 8);
  assert.equal(summary.certificationStatus, "PASS");
  assert.equal(summary.freezeStatus, "PASS");
  assert.equal(summary.taskCompatibilityStatus, "PASS");
  assert.equal(summary.workflowCompatibilityStatus, "PASS");
  assert.equal(summary.projectCompatibilityStatus, "PASS");
  assert.equal(summary.resourceCompatibilityStatus, "PASS");
  assert.equal(summary.releaseReadiness, "Ready");
});

test("helper APIs", () => {
  assert.deepEqual(
    getExecutiveSchedulingPublicFoundation(),
    ExecutiveSchedulingIntelligencePlatformPublicFoundation,
  );
  assert.deepEqual(
    getExecutiveSchedulingPublicApiRegistry(),
    ExecutiveSchedulingPublicApiRegistry,
  );
  assert.equal(getExecutiveSchedulingPublicMetadata().metadataOnly, true);
});

test("deterministic output", () => {
  assert.deepEqual(
    getExecutiveSchedulingPublicFoundation(),
    getExecutiveSchedulingPublicFoundation(),
  );
  assert.deepEqual(
    getExecutiveSchedulingPublicMetadata(),
    getExecutiveSchedulingPublicMetadata(),
  );
  assert.deepEqual(
    getExecutiveSchedulingReleaseSummary(),
    getExecutiveSchedulingReleaseSummary(),
  );
});

test("public API stability", () => {
  assert.equal(ExecutiveSchedulingPublicIndexId, "OPS-6:9");
  assert.equal(ExecutiveSchedulingPublicIndexStatus.certificationStatus, "Certified");
  assert.equal(ExecutiveSchedulingPublicIndexStatus.freezeStatus, "Frozen");
  assert.equal(ExecutiveSchedulingIntelligencePlatformPublicFoundation.immutable, true);
});

test("compatibility with OPS-1, OPS-2, OPS-3, OPS-4, OPS-5, and OPS-6", () => {
  assert.equal(ExecutiveOperationsPublicIndexId, "OPS-1:9");
  assert.equal(ExecutiveTaskIntelligencePublicIndexId, "OPS-2:9");
  assert.equal(ExecutiveWorkflowIntelligencePublicIndexId, "OPS-3:9");
  assert.equal(ExecutiveProjectExecutionPublicIndexId, "OPS-4:9");
  assert.equal(ExecutiveResourceIntelligencePublicIndexId, "OPS-5:9");
  assert.deepEqual(
    ExecutiveSchedulingIntelligencePlatformPublicFoundation.foundation
      .SchedulingIntelligenceIdentity.dependencySources,
    ["OPS-1:9", "OPS-2:9", "OPS-3:9", "OPS-4:9", "OPS-5:9"],
  );
  assert.equal(
    ExecutiveSchedulingIntelligencePlatformPublicFoundation.certification
      .buildExecutiveSchedulingPlatformCertificationManifest().certifiedPhases.length,
    6,
  );
  assert.equal(
    ExecutiveSchedulingIntelligencePlatformPublicFoundation.freeze
      .buildExecutiveSchedulingPlatformFreezeManifest().certifiedPhaseRegistry.length,
    7,
  );
});

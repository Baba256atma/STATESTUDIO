import assert from "node:assert/strict";
import test from "node:test";

import { ExecutiveOperationsPublicIndexId } from "./executiveOperationsPublicIndex.ts";
import {
  ExecutiveTaskIntelligencePlatformPublicFoundation,
  ExecutiveTaskIntelligencePublicApiRegistry,
  ExecutiveTaskIntelligencePublicIndexId,
  ExecutiveTaskIntelligencePublicIndexStatus,
  getExecutiveTaskIntelligencePublicApiRegistry,
  getExecutiveTaskIntelligencePublicFoundation,
  getExecutiveTaskIntelligencePublicMetadata,
  getExecutiveTaskIntelligenceReleaseSummary,
} from "./executiveTaskIntelligencePublicIndex.ts";

test("namespace integrity", () => {
  assert.ok(ExecutiveTaskIntelligencePlatformPublicFoundation);
  assert.ok("foundation" in ExecutiveTaskIntelligencePlatformPublicFoundation);
  assert.ok("metadata" in ExecutiveTaskIntelligencePlatformPublicFoundation);
  assert.ok("model" in ExecutiveTaskIntelligencePlatformPublicFoundation);
  assert.ok("validation" in ExecutiveTaskIntelligencePlatformPublicFoundation);
  assert.ok("manifest" in ExecutiveTaskIntelligencePlatformPublicFoundation);
  assert.ok("platform" in ExecutiveTaskIntelligencePlatformPublicFoundation);
  assert.ok("certification" in ExecutiveTaskIntelligencePlatformPublicFoundation);
  assert.ok("freeze" in ExecutiveTaskIntelligencePlatformPublicFoundation);
  assert.ok("publicIndex" in ExecutiveTaskIntelligencePlatformPublicFoundation);
});

test("public metadata integrity", () => {
  const metadata = getExecutiveTaskIntelligencePublicMetadata();

  assert.equal(metadata.publicIndexId, "OPS-2:9");
  assert.equal(metadata.platformId, "OPS-2:1");
  assert.equal(metadata.status.releaseStatus, "Released");
  assert.equal(Object.isFrozen(metadata), true);
});

test("release summary", () => {
  const summary = getExecutiveTaskIntelligenceReleaseSummary();

  assert.equal(summary.platformId, "OPS-2:1");
  assert.equal(summary.phaseCount, 8);
  assert.equal(summary.certificationStatus, "PASS");
  assert.equal(summary.freezeStatus, "PASS");
  assert.equal(summary.releaseReadiness, "Ready");
});

test("public registry", () => {
  assert.equal(
    ExecutiveTaskIntelligencePublicApiRegistry.totalExportCount >= 34,
    true,
  );
  assert.equal(ExecutiveTaskIntelligencePublicApiRegistry.publicApiStatus, "Stable");
  assert.equal(
    getExecutiveTaskIntelligencePublicApiRegistry().publicIndexApis.length,
    12,
  );
});

test("immutable exports", () => {
  assert.equal(Object.isFrozen(ExecutiveTaskIntelligencePlatformPublicFoundation), true);
  assert.equal(Object.isFrozen(ExecutiveTaskIntelligencePublicApiRegistry), true);
});

test("deterministic behavior", () => {
  assert.deepEqual(
    getExecutiveTaskIntelligencePublicFoundation(),
    getExecutiveTaskIntelligencePublicFoundation(),
  );
  assert.deepEqual(
    getExecutiveTaskIntelligencePublicMetadata(),
    getExecutiveTaskIntelligencePublicMetadata(),
  );
  assert.deepEqual(
    getExecutiveTaskIntelligenceReleaseSummary(),
    getExecutiveTaskIntelligenceReleaseSummary(),
  );
});

test("stable public API", () => {
  assert.equal(ExecutiveTaskIntelligencePublicIndexId, "OPS-2:9");
  assert.equal(ExecutiveTaskIntelligencePublicIndexStatus.certificationStatus, "Certified");
  assert.equal(ExecutiveTaskIntelligencePublicIndexStatus.freezeStatus, "Frozen");
  assert.equal(ExecutiveTaskIntelligencePlatformPublicFoundation.immutable, true);
});

test("compatibility with OPS-1 and all OPS-2 phases", () => {
  assert.equal(ExecutiveOperationsPublicIndexId, "OPS-1:9");
  assert.equal(
    ExecutiveTaskIntelligencePlatformPublicFoundation.foundation.TaskIntelligenceIdentity.dependencySource,
    "OPS-1:9",
  );
  assert.equal(
    ExecutiveTaskIntelligencePlatformPublicFoundation.certification.buildTaskPlatformCertificationManifest()
      .certifiedPhases.length,
    6,
  );
  assert.equal(
    ExecutiveTaskIntelligencePlatformPublicFoundation.freeze.buildTaskPlatformFreezeManifest()
      .certifiedPhaseRegistry.length,
    7,
  );
});

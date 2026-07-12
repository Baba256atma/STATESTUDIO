import assert from "node:assert/strict";
import test from "node:test";

import {
  ExecutiveOperationsPlatformPublicFoundation,
  ExecutiveOperationsPublicApiRegistry,
  ExecutiveOperationsPublicIndexDescription,
  ExecutiveOperationsPublicIndexId,
  ExecutiveOperationsPublicIndexName,
  ExecutiveOperationsPublicIndexNamespace,
  ExecutiveOperationsPublicIndexStatus,
  ExecutiveOperationsPublicIndexVersion,
  getExecutiveOperationsPublicApiRegistry,
  getExecutiveOperationsPublicFoundation,
  getExecutiveOperationsPublicMetadata,
  getExecutiveOperationsReleaseSummary,
} from "./executiveOperationsPublicIndex.ts";

test("namespace integrity", () => {
  const foundation = getExecutiveOperationsPublicFoundation();

  assert.equal(ExecutiveOperationsPublicIndexId, "OPS-1:9");
  assert.equal(ExecutiveOperationsPublicIndexVersion, "1.0.0");
  assert.equal(
    ExecutiveOperationsPublicIndexNamespace,
    "nexora.ops.executive-operations.public-index",
  );
  assert.equal(
    ExecutiveOperationsPublicIndexName,
    "Executive Operations Public Index",
  );
  assert.equal(
    ExecutiveOperationsPublicIndexDescription,
    "Final canonical public entry point for the Executive Operations Platform.",
  );
  assert.ok("foundation" in foundation);
  assert.ok("metadata" in foundation);
  assert.ok("model" in foundation);
  assert.ok("validation" in foundation);
  assert.ok("manifest" in foundation);
  assert.ok("platform" in foundation);
  assert.ok("certification" in foundation);
  assert.ok("freeze" in foundation);
  assert.ok("publicIndex" in foundation);
});

test("public metadata integrity", () => {
  const metadata = getExecutiveOperationsPublicMetadata();

  assert.equal(Object.isFrozen(metadata), true);
  assert.equal(metadata.platformId, "OPS-1:1");
  assert.equal(metadata.status.releaseStatus, "Released");
});

test("release summary", () => {
  const summary = getExecutiveOperationsReleaseSummary();

  assert.equal(summary.phaseCount, 6);
  assert.equal(summary.validationStatus, "PASS");
  assert.equal(summary.manifestStatus, "PASS");
  assert.equal(summary.certificationStatus, "PASS");
  assert.equal(summary.freezeStatus, "PASS");
  assert.equal(summary.releaseReadiness, "Ready");
});

test("public registry", () => {
  assert.equal(Object.isFrozen(ExecutiveOperationsPublicApiRegistry), true);
  assert.equal(ExecutiveOperationsPublicApiRegistry.foundationApis.length > 0, true);
  assert.equal(ExecutiveOperationsPublicApiRegistry.metadataApis.length > 0, true);
  assert.equal(ExecutiveOperationsPublicApiRegistry.modelApis.length > 0, true);
  assert.equal(ExecutiveOperationsPublicApiRegistry.validationApis.length > 0, true);
  assert.equal(ExecutiveOperationsPublicApiRegistry.manifestApis.length > 0, true);
  assert.equal(ExecutiveOperationsPublicApiRegistry.platformApis.length > 0, true);
  assert.equal(
    ExecutiveOperationsPublicApiRegistry.certificationApis.length > 0,
    true,
  );
  assert.equal(ExecutiveOperationsPublicApiRegistry.freezeApis.length > 0, true);
});

test("immutable exports", () => {
  assert.equal(Object.isFrozen(ExecutiveOperationsPlatformPublicFoundation), true);
  assert.equal(ExecutiveOperationsPlatformPublicFoundation.metadataOnly, true);
  assert.equal(ExecutiveOperationsPlatformPublicFoundation.immutable, true);
});

test("deterministic behavior", () => {
  assert.deepEqual(
    getExecutiveOperationsPublicFoundation(),
    getExecutiveOperationsPublicFoundation(),
  );
  assert.deepEqual(
    getExecutiveOperationsPublicApiRegistry(),
    getExecutiveOperationsPublicApiRegistry(),
  );
  assert.deepEqual(
    getExecutiveOperationsReleaseSummary(),
    getExecutiveOperationsReleaseSummary(),
  );
});

test("stable public API", () => {
  assert.equal(
    ExecutiveOperationsPublicIndexStatus.certificationStatus,
    "Certified",
  );
  assert.equal(ExecutiveOperationsPublicIndexStatus.freezeStatus, "Frozen");
  assert.equal(ExecutiveOperationsPublicIndexStatus.releaseStatus, "Released");
});

test("compatibility with all OPS-1 phases", () => {
  const foundation = getExecutiveOperationsPublicFoundation();

  assert.ok("ExecutiveExecutionFoundation" in foundation.foundation);
  assert.ok("ExecutionPlatformMetadata" in foundation.metadata);
  assert.ok("ExecutionTaskModel" in foundation.model);
  assert.ok("runExecutionValidation" in foundation.validation);
  assert.ok("buildExecutionPlatformManifest" in foundation.manifest);
  assert.ok("ExecutiveOperationsPlatform" in foundation.platform);
  assert.ok("runExecutionPlatformCertification" in foundation.certification);
  assert.ok("runExecutionPlatformFreeze" in foundation.freeze);
});

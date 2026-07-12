import assert from "node:assert/strict";
import test from "node:test";

import {
  ExecutiveDependencyIntelligencePlatformPublicFoundation,
  ExecutiveDependencyPublicApiRegistry,
  ExecutiveDependencyPublicIndexId,
  ExecutiveDependencyPublicIndexStatus,
  getExecutiveDependencyPublicApiRegistry,
  getExecutiveDependencyPublicFoundation,
  getExecutiveDependencyPublicMetadata,
  getExecutiveDependencyReleaseSummary,
} from "./executiveDependencyPublicIndex.ts";

test("public namespace completeness", () => {
  assert.ok(ExecutiveDependencyIntelligencePlatformPublicFoundation);
  assert.ok("foundation" in ExecutiveDependencyIntelligencePlatformPublicFoundation);
  assert.ok("registry" in ExecutiveDependencyIntelligencePlatformPublicFoundation);
  assert.ok("model" in ExecutiveDependencyIntelligencePlatformPublicFoundation);
  assert.ok("validation" in ExecutiveDependencyIntelligencePlatformPublicFoundation);
  assert.ok("manifest" in ExecutiveDependencyIntelligencePlatformPublicFoundation);
  assert.ok("platform" in ExecutiveDependencyIntelligencePlatformPublicFoundation);
  assert.ok("certification" in ExecutiveDependencyIntelligencePlatformPublicFoundation);
  assert.ok("freeze" in ExecutiveDependencyIntelligencePlatformPublicFoundation);
  assert.ok("publicIndex" in ExecutiveDependencyIntelligencePlatformPublicFoundation);
});

test("immutable namespace", () => {
  assert.equal(Object.isFrozen(ExecutiveDependencyIntelligencePlatformPublicFoundation), true);
  assert.equal(Object.isFrozen(ExecutiveDependencyPublicApiRegistry), true);
});

test("metadata correctness", () => {
  const metadata = getExecutiveDependencyPublicMetadata();

  assert.equal(metadata.publicIndexId, "OPS-7:9");
  assert.equal(metadata.platformId, "OPS-7:1");
  assert.equal(metadata.status.releaseStatus, "Released");
  assert.equal(Object.isFrozen(metadata), true);
});

test("public registry correctness", () => {
  assert.equal(ExecutiveDependencyPublicApiRegistry.totalExportCount, 85);
  assert.equal(ExecutiveDependencyPublicApiRegistry.publicApiStatus, "Stable");
  assert.equal(getExecutiveDependencyPublicApiRegistry().publicIndexApis.length, 12);
});

test("helper APIs", () => {
  assert.deepEqual(
    getExecutiveDependencyPublicFoundation(),
    ExecutiveDependencyIntelligencePlatformPublicFoundation,
  );
  assert.deepEqual(
    getExecutiveDependencyPublicApiRegistry(),
    ExecutiveDependencyPublicApiRegistry,
  );
  assert.equal(getExecutiveDependencyPublicMetadata().metadataOnly, true);
});

test("release summary", () => {
  const summary = getExecutiveDependencyReleaseSummary();

  assert.equal(summary.platformId, "OPS-7:1");
  assert.equal(summary.phaseCount, 8);
  assert.equal(summary.certificationStatus, "PASS");
  assert.equal(summary.freezeStatus, "PASS");
  assert.equal(summary.publicApiStatus, "Stable");
  assert.equal(summary.releaseReadiness, "Ready");
});

test("deterministic outputs", () => {
  assert.deepEqual(
    getExecutiveDependencyPublicFoundation(),
    getExecutiveDependencyPublicFoundation(),
  );
  assert.deepEqual(
    getExecutiveDependencyPublicMetadata(),
    getExecutiveDependencyPublicMetadata(),
  );
  assert.deepEqual(
    getExecutiveDependencyReleaseSummary(),
    getExecutiveDependencyReleaseSummary(),
  );
});

test("public API stability", () => {
  assert.equal(ExecutiveDependencyPublicIndexId, "OPS-7:9");
  assert.equal(ExecutiveDependencyPublicIndexStatus.certificationStatus, "Certified");
  assert.equal(ExecutiveDependencyPublicIndexStatus.freezeStatus, "Frozen");
  assert.equal(ExecutiveDependencyIntelligencePlatformPublicFoundation.immutable, true);
});

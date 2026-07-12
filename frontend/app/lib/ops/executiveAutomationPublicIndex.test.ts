import assert from "node:assert/strict";
import test from "node:test";

import {
  ExecutiveAutomationPlatformPublicFoundation,
  ExecutiveAutomationPublicApiRegistry,
  ExecutiveAutomationPublicIndexId,
  ExecutiveAutomationPublicIndexStatus,
  getExecutiveAutomationPublicApiRegistry,
  getExecutiveAutomationPublicFoundation,
  getExecutiveAutomationPublicMetadata,
  getExecutiveAutomationReleaseSummary,
} from "./executiveAutomationPublicIndex.ts";

test("public namespace completeness", () => {
  assert.ok(ExecutiveAutomationPlatformPublicFoundation);
  assert.ok("foundation" in ExecutiveAutomationPlatformPublicFoundation);
  assert.ok("registry" in ExecutiveAutomationPlatformPublicFoundation);
  assert.ok("model" in ExecutiveAutomationPlatformPublicFoundation);
  assert.ok("validation" in ExecutiveAutomationPlatformPublicFoundation);
  assert.ok("manifest" in ExecutiveAutomationPlatformPublicFoundation);
  assert.ok("platform" in ExecutiveAutomationPlatformPublicFoundation);
  assert.ok("certification" in ExecutiveAutomationPlatformPublicFoundation);
  assert.ok("freeze" in ExecutiveAutomationPlatformPublicFoundation);
  assert.ok("publicIndex" in ExecutiveAutomationPlatformPublicFoundation);
});

test("immutable namespace", () => {
  assert.equal(Object.isFrozen(ExecutiveAutomationPlatformPublicFoundation), true);
  assert.equal(Object.isFrozen(ExecutiveAutomationPublicApiRegistry), true);
});

test("metadata correctness", () => {
  const metadata = getExecutiveAutomationPublicMetadata();

  assert.equal(metadata.publicIndexId, "OPS-8:9");
  assert.equal(metadata.platformId, "OPS-8:1");
  assert.equal(metadata.status.releaseStatus, "Released");
  assert.equal(Object.isFrozen(metadata), true);
});

test("public registry correctness", () => {
  assert.equal(ExecutiveAutomationPublicApiRegistry.totalExportCount, 62);
  assert.equal(ExecutiveAutomationPublicApiRegistry.publicApiStatus, "Stable");
  assert.equal(getExecutiveAutomationPublicApiRegistry().publicIndexApis.length, 12);
});

test("helper APIs", () => {
  assert.deepEqual(
    getExecutiveAutomationPublicFoundation(),
    ExecutiveAutomationPlatformPublicFoundation,
  );
  assert.deepEqual(
    getExecutiveAutomationPublicApiRegistry(),
    ExecutiveAutomationPublicApiRegistry,
  );
  assert.equal(getExecutiveAutomationPublicMetadata().metadataOnly, true);
});

test("release summary", () => {
  const summary = getExecutiveAutomationReleaseSummary();

  assert.equal(summary.platformId, "OPS-8:1");
  assert.equal(summary.phaseCount, 8);
  assert.equal(summary.certificationStatus, "PASS");
  assert.equal(summary.freezeStatus, "PASS");
  assert.equal(summary.publicApiStatus, "Stable");
  assert.equal(summary.releaseReadiness, "Ready");
});

test("deterministic outputs", () => {
  assert.deepEqual(
    getExecutiveAutomationPublicFoundation(),
    getExecutiveAutomationPublicFoundation(),
  );
  assert.deepEqual(
    getExecutiveAutomationPublicMetadata(),
    getExecutiveAutomationPublicMetadata(),
  );
  assert.deepEqual(
    getExecutiveAutomationReleaseSummary(),
    getExecutiveAutomationReleaseSummary(),
  );
});

test("public API stability", () => {
  assert.equal(ExecutiveAutomationPublicIndexId, "OPS-8:9");
  assert.equal(ExecutiveAutomationPublicIndexStatus.certificationStatus, "Certified");
  assert.equal(ExecutiveAutomationPublicIndexStatus.freezeStatus, "Frozen");
  assert.equal(ExecutiveAutomationPlatformPublicFoundation.immutable, true);
});

import assert from "node:assert/strict";
import test from "node:test";

import {
  ExecutiveBusinessHealthPlatformPublicFoundation,
  ExecutiveBusinessHealthPublicApiRegistry,
  ExecutiveBusinessHealthPublicIndexDescription,
  ExecutiveBusinessHealthPublicIndexId,
  ExecutiveBusinessHealthPublicIndexName,
  ExecutiveBusinessHealthPublicIndexNamespace,
  ExecutiveBusinessHealthPublicIndexStatus,
  ExecutiveBusinessHealthPublicIndexVersion,
  ExecutiveBusinessHealthPlatformFreezeResult,
  getExecutiveBusinessHealthPublicApiRegistry,
  getExecutiveBusinessHealthPublicFoundation,
  getExecutiveBusinessHealthPublicMetadata,
  getExecutiveBusinessHealthReleaseSummary,
} from "./executiveBusinessHealthPublicIndex.ts";

test("public foundation aggregates every BUS-32 namespace", () => {
  const foundation = getExecutiveBusinessHealthPublicFoundation();
  assert.equal(ExecutiveBusinessHealthPublicIndexId, "BUS-32:9");
  assert.equal(ExecutiveBusinessHealthPublicIndexVersion, "1.0.0");
  assert.equal(
    ExecutiveBusinessHealthPublicIndexName,
    "Executive Business Health Public Index",
  );
  assert.equal(
    ExecutiveBusinessHealthPublicIndexDescription,
    "Final canonical public entry point for the Executive Business Health Intelligence Platform.",
  );
  assert.equal(
    ExecutiveBusinessHealthPublicIndexNamespace,
    "nexora.bus.executive-business-health.public-index",
  );
  assert.ok("contracts" in foundation);
  assert.ok("registry" in foundation);
  assert.ok("model" in foundation);
  assert.ok("validation" in foundation);
  assert.ok("manifest" in foundation);
  assert.ok("platform" in foundation);
  assert.ok("certification" in foundation);
  assert.ok("freeze" in foundation);
  assert.ok("publicIndex" in foundation);
});

test("public registry is complete and metadata is immutable", () => {
  const metadata = getExecutiveBusinessHealthPublicMetadata();
  assert.equal(Object.isFrozen(metadata), true);
  assert.equal(Object.isFrozen(ExecutiveBusinessHealthPublicApiRegistry), true);
  assert.equal(
    ExecutiveBusinessHealthPublicApiRegistry.exportedNamespaces.length,
    9,
  );
  assert.equal(ExecutiveBusinessHealthPublicApiRegistry.exportedApis.length, 12);
  assert.equal(metadata.status.releaseStatus, "Released");
});

test("release summary is deterministic", () => {
  assert.deepEqual(
    getExecutiveBusinessHealthReleaseSummary(),
    getExecutiveBusinessHealthReleaseSummary(),
  );
  assert.equal(getExecutiveBusinessHealthReleaseSummary().certificationStatus, "PASS");
  assert.equal(getExecutiveBusinessHealthReleaseSummary().releaseStatus, "RELEASED");
  assert.equal(getExecutiveBusinessHealthReleaseSummary().freezeStatus, "FROZEN");
});

test("public exports are correct and helper APIs are deterministic", () => {
  assert.equal(
    getExecutiveBusinessHealthPublicFoundation(),
    ExecutiveBusinessHealthPlatformPublicFoundation,
  );
  assert.equal(
    getExecutiveBusinessHealthPublicApiRegistry(),
    ExecutiveBusinessHealthPublicApiRegistry,
  );
  assert.equal(ExecutiveBusinessHealthPublicIndexStatus.certificationStatus, "Certified");
  assert.equal(ExecutiveBusinessHealthPublicIndexStatus.freezeStatus, "Frozen");
  assert.equal(ExecutiveBusinessHealthPublicIndexStatus.releaseStatus, "Released");
});

test("public API surface is stable and no runtime behavior exists", () => {
  assert.equal(ExecutiveBusinessHealthPlatformFreezeResult.certified, true);
  assert.equal(ExecutiveBusinessHealthPlatformFreezeResult.frozen, true);
  assert.equal(ExecutiveBusinessHealthPlatformFreezeResult.released, true);
  assert.equal(
    ExecutiveBusinessHealthPlatformPublicFoundation.metadataOnly,
    true,
  );
  assert.equal(
    ExecutiveBusinessHealthPlatformPublicFoundation.immutable,
    true,
  );
});

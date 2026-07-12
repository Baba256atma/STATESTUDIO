import assert from "node:assert/strict";
import test from "node:test";

import {
  ExecutiveBusinessIntelligencePlatformFreezeResult,
  ExecutiveBusinessIntelligencePlatformPublicFoundation,
  ExecutiveBusinessIntelligencePublicApiRegistry,
  ExecutiveBusinessIntelligencePublicIndexDescription,
  ExecutiveBusinessIntelligencePublicIndexId,
  ExecutiveBusinessIntelligencePublicIndexName,
  ExecutiveBusinessIntelligencePublicIndexNamespace,
  ExecutiveBusinessIntelligencePublicIndexStatus,
  ExecutiveBusinessIntelligencePublicIndexVersion,
  getExecutiveBusinessIntelligencePublicApiRegistry,
  getExecutiveBusinessIntelligencePublicFoundation,
  getExecutiveBusinessIntelligencePublicMetadata,
  getExecutiveBusinessIntelligenceReleaseSummary,
} from "./executiveBusinessIntelligencePublicIndex.ts";

test("public foundation aggregates every BUS-34 namespace", () => {
  const foundation = getExecutiveBusinessIntelligencePublicFoundation();

  assert.equal(ExecutiveBusinessIntelligencePublicIndexId, "BUS-34:9");
  assert.equal(ExecutiveBusinessIntelligencePublicIndexVersion, "1.0.0");
  assert.equal(
    ExecutiveBusinessIntelligencePublicIndexName,
    "Executive Business Intelligence Public Index",
  );
  assert.equal(
    ExecutiveBusinessIntelligencePublicIndexDescription,
    "Final canonical public entry point for the unified Executive Business Intelligence Platform.",
  );
  assert.equal(
    ExecutiveBusinessIntelligencePublicIndexNamespace,
    "nexora.bus.executive-business-intelligence.public-index",
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

test("public API registry is complete and public metadata is immutable", () => {
  const metadata = getExecutiveBusinessIntelligencePublicMetadata();

  assert.equal(Object.isFrozen(metadata), true);
  assert.equal(
    Object.isFrozen(ExecutiveBusinessIntelligencePublicApiRegistry),
    true,
  );
  assert.equal(
    ExecutiveBusinessIntelligencePublicApiRegistry.exportedNamespaces.length,
    9,
  );
  assert.equal(
    ExecutiveBusinessIntelligencePublicApiRegistry.exportedApis.length,
    12,
  );
  assert.equal(metadata.status.releaseStatus, "Released");
});

test("release summary is deterministic and helper APIs are deterministic", () => {
  assert.deepEqual(
    getExecutiveBusinessIntelligenceReleaseSummary(),
    getExecutiveBusinessIntelligenceReleaseSummary(),
  );
  assert.equal(
    getExecutiveBusinessIntelligenceReleaseSummary().certificationStatus,
    "PASS",
  );
  assert.equal(
    getExecutiveBusinessIntelligenceReleaseSummary().releaseStatus,
    "RELEASED",
  );
  assert.equal(
    getExecutiveBusinessIntelligenceReleaseSummary().freezeStatus,
    "FROZEN",
  );
  assert.equal(
    getExecutiveBusinessIntelligencePublicFoundation(),
    ExecutiveBusinessIntelligencePlatformPublicFoundation,
  );
  assert.equal(
    getExecutiveBusinessIntelligencePublicApiRegistry(),
    ExecutiveBusinessIntelligencePublicApiRegistry,
  );
});

test("public exports are correct", () => {
  assert.equal(
    ExecutiveBusinessIntelligencePublicIndexStatus.certificationStatus,
    "Certified",
  );
  assert.equal(
    ExecutiveBusinessIntelligencePublicIndexStatus.freezeStatus,
    "Frozen",
  );
  assert.equal(
    ExecutiveBusinessIntelligencePublicIndexStatus.releaseStatus,
    "Released",
  );
});

test("no runtime behavior exists", () => {
  assert.equal(ExecutiveBusinessIntelligencePlatformFreezeResult.certified, true);
  assert.equal(ExecutiveBusinessIntelligencePlatformFreezeResult.frozen, true);
  assert.equal(ExecutiveBusinessIntelligencePlatformFreezeResult.released, true);
  assert.equal(
    ExecutiveBusinessIntelligencePlatformPublicFoundation.metadataOnly,
    true,
  );
  assert.equal(
    ExecutiveBusinessIntelligencePlatformPublicFoundation.immutable,
    true,
  );
});

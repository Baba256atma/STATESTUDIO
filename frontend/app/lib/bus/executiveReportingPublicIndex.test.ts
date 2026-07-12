import assert from "node:assert/strict";
import test from "node:test";

import {
  ExecutiveReportingPlatformFreezeResult,
  ExecutiveReportingPlatformPublicFoundation,
  ExecutiveReportingPublicApiRegistry,
  ExecutiveReportingPublicIndexDescription,
  ExecutiveReportingPublicIndexId,
  ExecutiveReportingPublicIndexName,
  ExecutiveReportingPublicIndexNamespace,
  ExecutiveReportingPublicIndexStatus,
  ExecutiveReportingPublicIndexVersion,
  getExecutiveReportingPublicApiRegistry,
  getExecutiveReportingPublicFoundation,
  getExecutiveReportingPublicMetadata,
  getExecutiveReportingReleaseSummary,
} from "./executiveReportingPublicIndex.ts";

test("public foundation aggregates every BUS-33 namespace", () => {
  const foundation = getExecutiveReportingPublicFoundation();
  assert.equal(ExecutiveReportingPublicIndexId, "BUS-33:9");
  assert.equal(ExecutiveReportingPublicIndexVersion, "1.0.0");
  assert.equal(
    ExecutiveReportingPublicIndexName,
    "Executive Reporting Public Index",
  );
  assert.equal(
    ExecutiveReportingPublicIndexDescription,
    "Final canonical public entry point for the Executive Reporting Intelligence Platform.",
  );
  assert.equal(
    ExecutiveReportingPublicIndexNamespace,
    "nexora.bus.executive-reporting.public-index",
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
  const metadata = getExecutiveReportingPublicMetadata();
  assert.equal(Object.isFrozen(metadata), true);
  assert.equal(Object.isFrozen(ExecutiveReportingPublicApiRegistry), true);
  assert.equal(ExecutiveReportingPublicApiRegistry.exportedNamespaces.length, 9);
  assert.equal(ExecutiveReportingPublicApiRegistry.exportedApis.length, 12);
  assert.equal(metadata.status.releaseStatus, "Released");
});

test("release summary is deterministic and helper APIs are deterministic", () => {
  assert.deepEqual(
    getExecutiveReportingReleaseSummary(),
    getExecutiveReportingReleaseSummary(),
  );
  assert.equal(getExecutiveReportingReleaseSummary().certificationStatus, "PASS");
  assert.equal(getExecutiveReportingReleaseSummary().releaseStatus, "RELEASED");
  assert.equal(getExecutiveReportingReleaseSummary().freezeStatus, "FROZEN");
  assert.equal(
    getExecutiveReportingPublicFoundation(),
    ExecutiveReportingPlatformPublicFoundation,
  );
  assert.equal(
    getExecutiveReportingPublicApiRegistry(),
    ExecutiveReportingPublicApiRegistry,
  );
});

test("public exports are correct", () => {
  assert.equal(
    ExecutiveReportingPublicIndexStatus.certificationStatus,
    "Certified",
  );
  assert.equal(ExecutiveReportingPublicIndexStatus.freezeStatus, "Frozen");
  assert.equal(ExecutiveReportingPublicIndexStatus.releaseStatus, "Released");
});

test("no runtime behavior exists", () => {
  assert.equal(ExecutiveReportingPlatformFreezeResult.certified, true);
  assert.equal(ExecutiveReportingPlatformFreezeResult.frozen, true);
  assert.equal(ExecutiveReportingPlatformFreezeResult.released, true);
  assert.equal(ExecutiveReportingPlatformPublicFoundation.metadataOnly, true);
  assert.equal(ExecutiveReportingPlatformPublicFoundation.immutable, true);
});

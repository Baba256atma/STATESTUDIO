import assert from "node:assert/strict";
import test from "node:test";

import {
  ExecutiveReportingPlatformFreezeDescription,
  ExecutiveReportingPlatformFreezeFoundation,
  ExecutiveReportingPlatformFreezeId,
  ExecutiveReportingPlatformFreezeManifest,
  ExecutiveReportingPlatformFreezeMetadata,
  ExecutiveReportingPlatformFreezeName,
  ExecutiveReportingPlatformFreezeResult,
  ExecutiveReportingPlatformFreezeSummary,
  ExecutiveReportingPlatformFreezeVersion,
  buildExecutiveReportingPlatformFreeze,
  getExecutiveReportingPlatformCompatibility,
  getExecutiveReportingPlatformFreeze,
  getExecutiveReportingPlatformFreezeMetadata,
  getExecutiveReportingPlatformFreezeSummary,
  getExecutiveReportingPlatformReleaseMetadata,
} from "./executiveReportingPlatformFreezeIndex.ts";

test("freeze metadata builds successfully", () => {
  const built = buildExecutiveReportingPlatformFreeze();
  assert.equal(ExecutiveReportingPlatformFreezeId, "BUS-33:8");
  assert.equal(ExecutiveReportingPlatformFreezeVersion, "1.0.0");
  assert.equal(
    ExecutiveReportingPlatformFreezeName,
    "Executive Reporting Platform Freeze",
  );
  assert.equal(
    ExecutiveReportingPlatformFreezeDescription,
    "Canonical metadata-only freeze and release layer for the Executive Reporting Intelligence Platform.",
  );
  assert.equal(built.metadata.freezeId, "BUS-33:8");
});

test("release status is Certified, Frozen, Released and certification metadata exists", () => {
  const release = getExecutiveReportingPlatformReleaseMetadata();
  assert.equal(Object.isFrozen(release), true);
  assert.equal(release.certificationStatus, "PASS");
  assert.equal(release.certificationVersion, "1.0.0");
  assert.equal(release.releaseStatus, "RELEASED");
  assert.equal(release.freezeStatus, "FROZEN");
});

test("dependency metadata and compatibility metadata are complete", () => {
  const compatibility = getExecutiveReportingPlatformCompatibility();
  const freeze = getExecutiveReportingPlatformFreeze();
  assert.equal(compatibility.compatibilityStatus, "Compatible");
  assert.equal(compatibility.extensionPolicy.length, 4);
  assert.equal(freeze.dependencies.manifest.id, "BUS-33:5");
  assert.equal(freeze.dependencies.certification.id, "BUS-33:7");
});

test("helper APIs are deterministic and freeze result is immutable", () => {
  assert.deepEqual(
    getExecutiveReportingPlatformFreeze(),
    buildExecutiveReportingPlatformFreeze(),
  );
  assert.equal(
    getExecutiveReportingPlatformFreezeMetadata(),
    ExecutiveReportingPlatformFreezeMetadata,
  );
  assert.equal(
    getExecutiveReportingPlatformFreezeSummary(),
    ExecutiveReportingPlatformFreezeSummary,
  );
  assert.equal(Object.isFrozen(ExecutiveReportingPlatformFreezeResult), true);
  assert.equal(ExecutiveReportingPlatformFreezeSummary.dependencyCount, 4);
  assert.equal(ExecutiveReportingPlatformFreezeSummary.platformDependencyCount, 4);
});

test("public exports are correct and no runtime behavior exists", () => {
  assert.equal(ExecutiveReportingPlatformFreezeResult.certified, true);
  assert.equal(ExecutiveReportingPlatformFreezeResult.frozen, true);
  assert.equal(ExecutiveReportingPlatformFreezeResult.released, true);
  assert.equal(Object.isFrozen(ExecutiveReportingPlatformFreezeFoundation), true);
  assert.equal(
    ExecutiveReportingPlatformFreezeManifest.manifestMetadata.metadataOnly,
    true,
  );
});

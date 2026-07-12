import assert from "node:assert/strict";
import test from "node:test";

import {
  ExecutiveBusinessIntelligencePlatformFreezeDescription,
  ExecutiveBusinessIntelligencePlatformFreezeFoundation,
  ExecutiveBusinessIntelligencePlatformFreezeId,
  ExecutiveBusinessIntelligencePlatformFreezeManifest,
  ExecutiveBusinessIntelligencePlatformFreezeMetadata,
  ExecutiveBusinessIntelligencePlatformFreezeName,
  ExecutiveBusinessIntelligencePlatformFreezeResult,
  ExecutiveBusinessIntelligencePlatformFreezeSummary,
  ExecutiveBusinessIntelligencePlatformFreezeVersion,
  buildExecutiveBusinessIntelligencePlatformFreeze,
  getExecutiveBusinessIntelligencePlatformCompatibility,
  getExecutiveBusinessIntelligencePlatformFreeze,
  getExecutiveBusinessIntelligencePlatformFreezeMetadata,
  getExecutiveBusinessIntelligencePlatformFreezeSummary,
  getExecutiveBusinessIntelligencePlatformReleaseMetadata,
} from "./executiveBusinessIntelligencePlatformFreezeIndex.ts";

test("freeze metadata builds successfully", () => {
  const built = buildExecutiveBusinessIntelligencePlatformFreeze();
  assert.equal(ExecutiveBusinessIntelligencePlatformFreezeId, "BUS-34:8");
  assert.equal(ExecutiveBusinessIntelligencePlatformFreezeVersion, "1.0.0");
  assert.equal(
    ExecutiveBusinessIntelligencePlatformFreezeName,
    "Executive Business Intelligence Platform Freeze",
  );
  assert.equal(
    ExecutiveBusinessIntelligencePlatformFreezeDescription,
    "Canonical metadata-only freeze and release layer for the Executive Business Intelligence Platform.",
  );
  assert.equal(built.metadata.freezeId, "BUS-34:8");
});

test("release status is Certified, Frozen, Released and certification metadata exists", () => {
  const release = getExecutiveBusinessIntelligencePlatformReleaseMetadata();
  assert.equal(Object.isFrozen(release), true);
  assert.equal(release.certificationStatus, "PASS");
  assert.equal(release.certificationVersion, "1.0.0");
  assert.equal(release.releaseStatus, "RELEASED");
  assert.equal(release.freezeStatus, "FROZEN");
});

test("dependency metadata and compatibility metadata are complete", () => {
  const compatibility = getExecutiveBusinessIntelligencePlatformCompatibility();
  const freeze = getExecutiveBusinessIntelligencePlatformFreeze();
  assert.equal(compatibility.compatibilityStatus, "Compatible");
  assert.equal(compatibility.extensionPolicy.length, 4);
  assert.equal(freeze.dependencies.manifest.id, "BUS-34:5");
  assert.equal(freeze.dependencies.certification.id, "BUS-34:7");
});

test("helper APIs are deterministic and freeze result is immutable", () => {
  assert.deepEqual(
    getExecutiveBusinessIntelligencePlatformFreeze(),
    buildExecutiveBusinessIntelligencePlatformFreeze(),
  );
  assert.equal(
    getExecutiveBusinessIntelligencePlatformFreezeMetadata(),
    ExecutiveBusinessIntelligencePlatformFreezeMetadata,
  );
  assert.equal(
    getExecutiveBusinessIntelligencePlatformFreezeSummary(),
    ExecutiveBusinessIntelligencePlatformFreezeSummary,
  );
  assert.equal(Object.isFrozen(ExecutiveBusinessIntelligencePlatformFreezeResult), true);
  assert.equal(ExecutiveBusinessIntelligencePlatformFreezeSummary.dependencyCount, 4);
  assert.equal(
    ExecutiveBusinessIntelligencePlatformFreezeSummary.platformDependencyCount,
    4,
  );
});

test("public exports are correct and no runtime behavior exists", () => {
  assert.equal(ExecutiveBusinessIntelligencePlatformFreezeResult.certified, true);
  assert.equal(ExecutiveBusinessIntelligencePlatformFreezeResult.frozen, true);
  assert.equal(ExecutiveBusinessIntelligencePlatformFreezeResult.released, true);
  assert.equal(
    Object.isFrozen(ExecutiveBusinessIntelligencePlatformFreezeFoundation),
    true,
  );
  assert.equal(
    ExecutiveBusinessIntelligencePlatformFreezeManifest.manifestMetadata.metadataOnly,
    true,
  );
});

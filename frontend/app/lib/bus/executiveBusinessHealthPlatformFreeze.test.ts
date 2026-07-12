import assert from "node:assert/strict";
import test from "node:test";

import {
  ExecutiveBusinessHealthPlatformFreezeDescription,
  ExecutiveBusinessHealthPlatformFreezeFoundation,
  ExecutiveBusinessHealthPlatformFreezeId,
  ExecutiveBusinessHealthPlatformFreezeManifest,
  ExecutiveBusinessHealthPlatformFreezeMetadata,
  ExecutiveBusinessHealthPlatformFreezeName,
  ExecutiveBusinessHealthPlatformFreezeResult,
  ExecutiveBusinessHealthPlatformFreezeSummary,
  ExecutiveBusinessHealthPlatformFreezeVersion,
  buildExecutiveBusinessHealthPlatformFreeze,
  getExecutiveBusinessHealthPlatformCompatibility,
  getExecutiveBusinessHealthPlatformFreeze,
  getExecutiveBusinessHealthPlatformFreezeMetadata,
  getExecutiveBusinessHealthPlatformFreezeSummary,
  getExecutiveBusinessHealthPlatformReleaseMetadata,
} from "./executiveBusinessHealthPlatformFreezeIndex.ts";

test("freeze metadata builds successfully", () => {
  const built = buildExecutiveBusinessHealthPlatformFreeze();
  assert.equal(ExecutiveBusinessHealthPlatformFreezeId, "BUS-32:8");
  assert.equal(ExecutiveBusinessHealthPlatformFreezeVersion, "1.0.0");
  assert.equal(
    ExecutiveBusinessHealthPlatformFreezeName,
    "Executive Business Health Platform Freeze",
  );
  assert.equal(
    ExecutiveBusinessHealthPlatformFreezeDescription,
    "Canonical metadata-only freeze and release layer for the Executive Business Health Intelligence Platform.",
  );
  assert.equal(built.metadata.freezeId, "BUS-32:8");
});

test("release metadata is immutable and certification metadata is present", () => {
  const release = getExecutiveBusinessHealthPlatformReleaseMetadata();
  assert.equal(Object.isFrozen(release), true);
  assert.equal(release.certificationStatus, "PASS");
  assert.equal(release.certificationVersion, "1.0.0");
  assert.equal(release.releaseStatus, "RELEASED");
  assert.equal(release.freezeStatus, "FROZEN");
});

test("compatibility and dependency metadata are complete", () => {
  const compatibility = getExecutiveBusinessHealthPlatformCompatibility();
  const freeze = getExecutiveBusinessHealthPlatformFreeze();
  assert.equal(compatibility.compatibilityStatus, "Compatible");
  assert.equal(compatibility.extensionPolicy.length, 4);
  assert.equal(freeze.dependencies.manifest.id, "BUS-32:5");
  assert.equal(freeze.dependencies.certification.id, "BUS-32:7");
});

test("helper APIs are deterministic and freeze summary is correct", () => {
  assert.deepEqual(
    getExecutiveBusinessHealthPlatformFreeze(),
    buildExecutiveBusinessHealthPlatformFreeze(),
  );
  assert.equal(
    getExecutiveBusinessHealthPlatformFreezeMetadata(),
    ExecutiveBusinessHealthPlatformFreezeMetadata,
  );
  assert.equal(getExecutiveBusinessHealthPlatformFreezeSummary(), ExecutiveBusinessHealthPlatformFreezeSummary);
  assert.equal(ExecutiveBusinessHealthPlatformFreezeSummary.dependencyCount, 4);
  assert.equal(ExecutiveBusinessHealthPlatformFreezeSummary.platformDependencyCount, 4);
});

test("public exports are correct and no runtime behavior exists", () => {
  assert.equal(ExecutiveBusinessHealthPlatformFreezeResult.certified, true);
  assert.equal(ExecutiveBusinessHealthPlatformFreezeResult.frozen, true);
  assert.equal(ExecutiveBusinessHealthPlatformFreezeResult.released, true);
  assert.equal(Object.isFrozen(ExecutiveBusinessHealthPlatformFreezeFoundation), true);
  assert.equal(
    ExecutiveBusinessHealthPlatformFreezeManifest.manifestMetadata.metadataOnly,
    true,
  );
});

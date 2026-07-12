import assert from "node:assert/strict";
import test from "node:test";

import {
  ExecutiveBusinessHealthManifest,
  ExecutiveBusinessHealthManifestDescription,
  ExecutiveBusinessHealthManifestFoundation,
  ExecutiveBusinessHealthManifestId,
  ExecutiveBusinessHealthManifestMetadata,
  ExecutiveBusinessHealthManifestName,
  ExecutiveBusinessHealthManifestVersion,
  buildExecutiveBusinessHealthManifest,
  getExecutiveBusinessHealthDependencyMetadata,
  getExecutiveBusinessHealthManifest,
  getExecutiveBusinessHealthManifestMetadata,
  getExecutiveBusinessHealthManifestSummary,
  getExecutiveBusinessHealthPublicApiInventory,
} from "./executiveBusinessHealthManifestIndex.ts";

test("manifest builds successfully", () => {
  const built = buildExecutiveBusinessHealthManifest();
  assert.equal(ExecutiveBusinessHealthManifestId, "BUS-32:5");
  assert.equal(ExecutiveBusinessHealthManifestVersion, "1.0.0");
  assert.equal(
    ExecutiveBusinessHealthManifestName,
    "Executive Business Health Intelligence Manifest",
  );
  assert.equal(
    ExecutiveBusinessHealthManifestDescription,
    "Canonical metadata-only manifest layer for executive business health intelligence.",
  );
  assert.equal(built, ExecutiveBusinessHealthManifest);
});

test("manifest metadata is immutable and architecture metadata is complete", () => {
  assert.equal(Object.isFrozen(ExecutiveBusinessHealthManifestMetadata), true);
  assert.equal(
    ExecutiveBusinessHealthManifest.architecture.registry.registryId,
    "BUS-32:2",
  );
  assert.equal(
    ExecutiveBusinessHealthManifest.architecture.model.id,
    "BUS-32:3",
  );
  assert.equal(
    ExecutiveBusinessHealthManifest.architecture.validation.id,
    "BUS-32:4",
  );
});

test("all dependency metadata exists and public api inventory is deterministic", () => {
  assert.equal(getExecutiveBusinessHealthDependencyMetadata().length, 4);
  assert.equal(getExecutiveBusinessHealthPublicApiInventory().length, 11);
  assert.equal(
    getExecutiveBusinessHealthPublicApiInventory()[0],
    "ExecutiveBusinessHealthContractId",
  );
});

test("helper APIs are deterministic and manifest summary is correct", () => {
  assert.equal(getExecutiveBusinessHealthManifest(), ExecutiveBusinessHealthManifest);
  assert.equal(
    getExecutiveBusinessHealthManifestMetadata(),
    ExecutiveBusinessHealthManifestMetadata,
  );
  assert.equal(getExecutiveBusinessHealthManifestSummary().domainCount, 13);
  assert.equal(getExecutiveBusinessHealthManifestSummary().dimensionCount, 6);
  assert.equal(getExecutiveBusinessHealthManifestSummary().capabilityCount, 6);
  assert.equal(getExecutiveBusinessHealthManifestSummary().indicatorCount, 12);
});

test("public exports are correct and no runtime behavior exists", () => {
  assert.equal(ExecutiveBusinessHealthManifestFoundation.metadataOnly, true);
  assert.equal(Object.isFrozen(ExecutiveBusinessHealthManifestFoundation), true);
  assert.equal(typeof ExecutiveBusinessHealthManifest.release, "object");
  assert.equal(
    ExecutiveBusinessHealthManifest.release.releaseReadiness.ready,
    true,
  );
});

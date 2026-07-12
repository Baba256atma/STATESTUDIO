import assert from "node:assert/strict";
import test from "node:test";

import {
  ExecutiveBusinessIntelligenceManifest,
  ExecutiveBusinessIntelligenceManifestDescription,
  ExecutiveBusinessIntelligenceManifestFoundation,
  ExecutiveBusinessIntelligenceManifestId,
  ExecutiveBusinessIntelligenceManifestMetadata,
  ExecutiveBusinessIntelligenceManifestName,
  ExecutiveBusinessIntelligenceManifestVersion,
  buildExecutiveBusinessIntelligenceManifest,
  getExecutiveBusinessIntelligenceDependencyMetadata,
  getExecutiveBusinessIntelligenceManifest,
  getExecutiveBusinessIntelligenceManifestMetadata,
  getExecutiveBusinessIntelligenceManifestSummary,
  getExecutiveBusinessIntelligencePublicApiInventory,
} from "./executiveBusinessIntelligenceManifestIndex.ts";

test("manifest builds successfully", () => {
  const built = buildExecutiveBusinessIntelligenceManifest();
  assert.equal(ExecutiveBusinessIntelligenceManifestId, "BUS-34:5");
  assert.equal(ExecutiveBusinessIntelligenceManifestVersion, "1.0.0");
  assert.equal(
    ExecutiveBusinessIntelligenceManifestName,
    "Executive Business Intelligence Manifest",
  );
  assert.equal(
    ExecutiveBusinessIntelligenceManifestDescription,
    "Canonical metadata-only manifest layer for executive business intelligence.",
  );
  assert.equal(built, ExecutiveBusinessIntelligenceManifest);
});

test("manifest metadata is immutable and dependencies are complete", () => {
  assert.equal(Object.isFrozen(ExecutiveBusinessIntelligenceManifestMetadata), true);
  assert.equal(
    ExecutiveBusinessIntelligenceManifest.architecture.registry.registryId,
    "BUS-34:2",
  );
  assert.equal(
    ExecutiveBusinessIntelligenceManifest.architecture.model.id,
    "BUS-34:3",
  );
  assert.equal(
    ExecutiveBusinessIntelligenceManifest.architecture.validation.id,
    "BUS-34:4",
  );
  assert.equal(getExecutiveBusinessIntelligenceDependencyMetadata().length, 4);
});

test("platform references are complete and public api inventory is deterministic", () => {
  assert.equal(
    ExecutiveBusinessIntelligenceManifest.businessIntelligenceCoverage.platforms.length,
    11,
  );
  assert.equal(getExecutiveBusinessIntelligencePublicApiInventory().length, 11);
  assert.equal(
    getExecutiveBusinessIntelligencePublicApiInventory()[0],
    "ExecutiveBusinessIntelligenceContractId",
  );
});

test("helper APIs are deterministic and manifest summary is correct", () => {
  assert.equal(
    getExecutiveBusinessIntelligenceManifest(),
    ExecutiveBusinessIntelligenceManifest,
  );
  assert.equal(
    getExecutiveBusinessIntelligenceManifestMetadata(),
    ExecutiveBusinessIntelligenceManifestMetadata,
  );
  const summary = getExecutiveBusinessIntelligenceManifestSummary();
  assert.equal(summary.domainCount, 11);
  assert.equal(summary.capabilityCount, 11);
  assert.equal(summary.platformCount, 11);
  assert.equal(summary.namespaceCount, 4);
  assert.equal(summary.integrationCount, 1);
  assert.equal(summary.validationCheckCount, 20);
});

test("public exports are correct and no runtime behavior exists", () => {
  assert.equal(ExecutiveBusinessIntelligenceManifestFoundation.metadataOnly, true);
  assert.equal(Object.isFrozen(ExecutiveBusinessIntelligenceManifestFoundation), true);
  assert.equal(typeof ExecutiveBusinessIntelligenceManifest.release, "object");
  assert.equal(
    ExecutiveBusinessIntelligenceManifest.release.releaseReadiness.ready,
    true,
  );
});

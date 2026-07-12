import assert from "node:assert/strict";
import test from "node:test";

import {
  ExecutiveReportingManifest,
  ExecutiveReportingManifestDescription,
  ExecutiveReportingManifestFoundation,
  ExecutiveReportingManifestId,
  ExecutiveReportingManifestMetadata,
  ExecutiveReportingManifestName,
  ExecutiveReportingManifestVersion,
  buildExecutiveReportingManifest,
  getExecutiveReportingDependencyMetadata,
  getExecutiveReportingManifest,
  getExecutiveReportingManifestMetadata,
  getExecutiveReportingManifestSummary,
  getExecutiveReportingPublicApiInventory,
} from "./executiveReportingManifestIndex.ts";

test("manifest builds successfully", () => {
  const built = buildExecutiveReportingManifest();
  assert.equal(ExecutiveReportingManifestId, "BUS-33:5");
  assert.equal(ExecutiveReportingManifestVersion, "1.0.0");
  assert.equal(
    ExecutiveReportingManifestName,
    "Executive Reporting Intelligence Manifest",
  );
  assert.equal(
    ExecutiveReportingManifestDescription,
    "Canonical metadata-only manifest layer for executive reporting intelligence.",
  );
  assert.equal(built, ExecutiveReportingManifest);
});

test("manifest metadata is immutable and dependencies are complete", () => {
  assert.equal(Object.isFrozen(ExecutiveReportingManifestMetadata), true);
  assert.equal(ExecutiveReportingManifest.architecture.registry.registryId, "BUS-33:2");
  assert.equal(ExecutiveReportingManifest.architecture.model.id, "BUS-33:3");
  assert.equal(ExecutiveReportingManifest.architecture.validation.id, "BUS-33:4");
  assert.equal(getExecutiveReportingDependencyMetadata().length, 4);
});

test("public api inventory is deterministic and helper APIs are deterministic", () => {
  assert.equal(getExecutiveReportingPublicApiInventory().length, 11);
  assert.equal(
    getExecutiveReportingPublicApiInventory()[0],
    "ExecutiveReportingContractId",
  );
  assert.equal(getExecutiveReportingManifest(), ExecutiveReportingManifest);
  assert.equal(
    getExecutiveReportingManifestMetadata(),
    ExecutiveReportingManifestMetadata,
  );
});

test("summary is correct", () => {
  const summary = getExecutiveReportingManifestSummary();
  assert.equal(summary.categoryCount, 15);
  assert.equal(summary.audienceCount, 9);
  assert.equal(summary.formatCount, 7);
  assert.equal(summary.templateCount, 4);
  assert.equal(summary.definitionCount, 4);
  assert.equal(summary.validationCheckCount, 20);
});

test("public exports are correct and no runtime behavior exists", () => {
  assert.equal(ExecutiveReportingManifestFoundation.metadataOnly, true);
  assert.equal(Object.isFrozen(ExecutiveReportingManifestFoundation), true);
  assert.equal(typeof ExecutiveReportingManifest.release, "object");
  assert.equal(ExecutiveReportingManifest.release.releaseReadiness.ready, true);
});

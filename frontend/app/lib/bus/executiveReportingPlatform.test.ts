import assert from "node:assert/strict";
import test from "node:test";

import {
  ExecutiveReportingPlatform,
  ExecutiveReportingPlatformDescription,
  ExecutiveReportingPlatformFoundation,
  ExecutiveReportingPlatformId,
  ExecutiveReportingPlatformMetadata,
  ExecutiveReportingPlatformName,
  ExecutiveReportingPlatformNamespace,
  ExecutiveReportingPlatformVersion,
  buildExecutiveReportingPlatform,
  getExecutiveReportingPlatform,
  getExecutiveReportingPlatformDependencies,
  getExecutiveReportingPlatformMetadata,
  getExecutiveReportingPlatformPublicApi,
  getExecutiveReportingPlatformSummary,
} from "./executiveReportingPlatformIndex.ts";

test("platform builds successfully", () => {
  const built = buildExecutiveReportingPlatform();
  assert.equal(ExecutiveReportingPlatformId, "BUS-33:6");
  assert.equal(ExecutiveReportingPlatformVersion, "1.0.0");
  assert.equal(
    ExecutiveReportingPlatformName,
    "Executive Reporting Intelligence Platform",
  );
  assert.equal(
    ExecutiveReportingPlatformDescription,
    "Canonical metadata-only platform layer for executive reporting intelligence.",
  );
  assert.equal(
    ExecutiveReportingPlatformNamespace,
    "nexora.bus.executive-reporting.platform",
  );
  assert.equal(built.metadata.platformId, "BUS-33:6");
});

test("platform metadata is immutable and namespace aggregates all previous phases", () => {
  assert.equal(Object.isFrozen(ExecutiveReportingPlatformMetadata), true);
  assert.ok(ExecutiveReportingPlatform.contracts);
  assert.ok(ExecutiveReportingPlatform.registry);
  assert.ok(ExecutiveReportingPlatform.model);
  assert.ok(ExecutiveReportingPlatform.validation);
  assert.ok(ExecutiveReportingPlatform.manifest);
});

test("dependency metadata and public api inventory are deterministic", () => {
  assert.equal(getExecutiveReportingPlatformDependencies().length, 4);
  assert.equal(getExecutiveReportingPlatformPublicApi().exportedNamespaces.length, 5);
  assert.equal(
    getExecutiveReportingPlatformPublicApi().publicContracts.length,
    11,
  );
});

test("helper APIs are deterministic and platform summary is correct", () => {
  assert.equal(getExecutiveReportingPlatform(), ExecutiveReportingPlatform);
  assert.equal(
    getExecutiveReportingPlatformMetadata(),
    ExecutiveReportingPlatformMetadata,
  );
  assert.equal(getExecutiveReportingPlatformSummary().namespaceCount, 5);
  assert.equal(getExecutiveReportingPlatformSummary().dependencyCount, 4);
  assert.equal(getExecutiveReportingPlatformSummary().publicApiCount, 11);
});

test("public exports are correct and no runtime behavior exists", () => {
  assert.equal(ExecutiveReportingPlatformFoundation.metadataOnly, true);
  assert.equal(Object.isFrozen(ExecutiveReportingPlatformFoundation), true);
  assert.equal(typeof ExecutiveReportingPlatform.contracts, "object");
  assert.equal(typeof ExecutiveReportingPlatform.registry, "object");
  assert.equal(typeof ExecutiveReportingPlatform.model, "object");
  assert.equal(typeof ExecutiveReportingPlatform.validation, "object");
  assert.equal(typeof ExecutiveReportingPlatform.manifest, "object");
});

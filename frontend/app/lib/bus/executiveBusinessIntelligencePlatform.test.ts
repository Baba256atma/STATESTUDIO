import assert from "node:assert/strict";
import test from "node:test";

import {
  ExecutiveBusinessIntelligencePlatform,
  ExecutiveBusinessIntelligencePlatformDescription,
  ExecutiveBusinessIntelligencePlatformFoundation,
  ExecutiveBusinessIntelligencePlatformId,
  ExecutiveBusinessIntelligencePlatformMetadata,
  ExecutiveBusinessIntelligencePlatformName,
  ExecutiveBusinessIntelligencePlatformNamespace,
  ExecutiveBusinessIntelligencePlatformVersion,
  buildExecutiveBusinessIntelligencePlatform,
  getExecutiveBusinessIntelligencePlatform,
  getExecutiveBusinessIntelligencePlatformDependencies,
  getExecutiveBusinessIntelligencePlatformMetadata,
  getExecutiveBusinessIntelligencePlatformPublicApi,
  getExecutiveBusinessIntelligencePlatformSummary,
} from "./executiveBusinessIntelligencePlatformIndex.ts";

test("platform builds successfully", () => {
  const built = buildExecutiveBusinessIntelligencePlatform();
  assert.equal(ExecutiveBusinessIntelligencePlatformId, "BUS-34:6");
  assert.equal(ExecutiveBusinessIntelligencePlatformVersion, "1.0.0");
  assert.equal(
    ExecutiveBusinessIntelligencePlatformName,
    "Executive Business Intelligence Platform",
  );
  assert.equal(
    ExecutiveBusinessIntelligencePlatformDescription,
    "Canonical metadata-only platform layer for executive business intelligence.",
  );
  assert.equal(
    ExecutiveBusinessIntelligencePlatformNamespace,
    "nexora.bus.executive-business-intelligence.platform",
  );
  assert.equal(built.metadata.platformId, "BUS-34:6");
});

test("platform metadata is immutable and namespace aggregates all previous phases", () => {
  assert.equal(Object.isFrozen(ExecutiveBusinessIntelligencePlatformMetadata), true);
  assert.ok(ExecutiveBusinessIntelligencePlatform.contracts);
  assert.ok(ExecutiveBusinessIntelligencePlatform.registry);
  assert.ok(ExecutiveBusinessIntelligencePlatform.model);
  assert.ok(ExecutiveBusinessIntelligencePlatform.validation);
  assert.ok(ExecutiveBusinessIntelligencePlatform.manifest);
});

test("dependency metadata and public api inventory are deterministic", () => {
  assert.equal(getExecutiveBusinessIntelligencePlatformDependencies().length, 4);
  assert.equal(
    getExecutiveBusinessIntelligencePlatformPublicApi().exportedNamespaces.length,
    5,
  );
  assert.equal(
    getExecutiveBusinessIntelligencePlatformPublicApi().publicContracts.length,
    11,
  );
});

test("helper APIs are deterministic and platform summary is correct", () => {
  assert.equal(
    getExecutiveBusinessIntelligencePlatform(),
    ExecutiveBusinessIntelligencePlatform,
  );
  assert.equal(
    getExecutiveBusinessIntelligencePlatformMetadata(),
    ExecutiveBusinessIntelligencePlatformMetadata,
  );
  assert.equal(getExecutiveBusinessIntelligencePlatformSummary().namespaceCount, 5);
  assert.equal(getExecutiveBusinessIntelligencePlatformSummary().dependencyCount, 4);
  assert.equal(getExecutiveBusinessIntelligencePlatformSummary().publicApiCount, 11);
});

test("public exports are correct and no runtime behavior exists", () => {
  assert.equal(ExecutiveBusinessIntelligencePlatformFoundation.metadataOnly, true);
  assert.equal(Object.isFrozen(ExecutiveBusinessIntelligencePlatformFoundation), true);
  assert.equal(typeof ExecutiveBusinessIntelligencePlatform.contracts, "object");
  assert.equal(typeof ExecutiveBusinessIntelligencePlatform.registry, "object");
  assert.equal(typeof ExecutiveBusinessIntelligencePlatform.model, "object");
  assert.equal(typeof ExecutiveBusinessIntelligencePlatform.validation, "object");
  assert.equal(typeof ExecutiveBusinessIntelligencePlatform.manifest, "object");
});

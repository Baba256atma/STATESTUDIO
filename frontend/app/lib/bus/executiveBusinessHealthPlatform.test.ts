import assert from "node:assert/strict";
import test from "node:test";

import {
  ExecutiveBusinessHealthPlatform,
  ExecutiveBusinessHealthPlatformDescription,
  ExecutiveBusinessHealthPlatformFoundation,
  ExecutiveBusinessHealthPlatformId,
  ExecutiveBusinessHealthPlatformMetadata,
  ExecutiveBusinessHealthPlatformName,
  ExecutiveBusinessHealthPlatformNamespace,
  ExecutiveBusinessHealthPlatformVersion,
  buildExecutiveBusinessHealthPlatform,
  getExecutiveBusinessHealthPlatform,
  getExecutiveBusinessHealthPlatformDependencies,
  getExecutiveBusinessHealthPlatformMetadata,
  getExecutiveBusinessHealthPlatformPublicApi,
  getExecutiveBusinessHealthPlatformSummary,
} from "./executiveBusinessHealthPlatformIndex.ts";

test("platform builds successfully", () => {
  const built = buildExecutiveBusinessHealthPlatform();
  assert.equal(ExecutiveBusinessHealthPlatformId, "BUS-32:6");
  assert.equal(ExecutiveBusinessHealthPlatformVersion, "1.0.0");
  assert.equal(
    ExecutiveBusinessHealthPlatformName,
    "Executive Business Health Intelligence Platform",
  );
  assert.equal(
    ExecutiveBusinessHealthPlatformDescription,
    "Canonical metadata-only platform layer for executive business health intelligence.",
  );
  assert.equal(
    ExecutiveBusinessHealthPlatformNamespace,
    "nexora.bus.executive-business-health.platform",
  );
  assert.equal(built.metadata.platformId, "BUS-32:6");
});

test("platform metadata is immutable and namespace aggregates previous phases", () => {
  assert.equal(Object.isFrozen(ExecutiveBusinessHealthPlatformMetadata), true);
  assert.ok(ExecutiveBusinessHealthPlatform.contracts);
  assert.ok(ExecutiveBusinessHealthPlatform.registry);
  assert.ok(ExecutiveBusinessHealthPlatform.model);
  assert.ok(ExecutiveBusinessHealthPlatform.validation);
  assert.ok(ExecutiveBusinessHealthPlatform.manifest);
});

test("dependency metadata and public api inventory are deterministic", () => {
  assert.equal(getExecutiveBusinessHealthPlatformDependencies().length, 4);
  assert.equal(getExecutiveBusinessHealthPlatformPublicApi().exportedNamespaces.length, 5);
  assert.equal(
    getExecutiveBusinessHealthPlatformPublicApi().publicContracts.length,
    11,
  );
});

test("helper APIs are deterministic and platform summary is correct", () => {
  assert.equal(getExecutiveBusinessHealthPlatform(), ExecutiveBusinessHealthPlatform);
  assert.equal(
    getExecutiveBusinessHealthPlatformMetadata(),
    ExecutiveBusinessHealthPlatformMetadata,
  );
  assert.equal(getExecutiveBusinessHealthPlatformSummary().namespaceCount, 5);
  assert.equal(getExecutiveBusinessHealthPlatformSummary().dependencyCount, 4);
  assert.equal(getExecutiveBusinessHealthPlatformSummary().publicApiCount, 11);
});

test("public exports are correct and no runtime behavior exists", () => {
  assert.equal(ExecutiveBusinessHealthPlatformFoundation.metadataOnly, true);
  assert.equal(Object.isFrozen(ExecutiveBusinessHealthPlatformFoundation), true);
  assert.equal(typeof ExecutiveBusinessHealthPlatform.contracts, "object");
  assert.equal(typeof ExecutiveBusinessHealthPlatform.registry, "object");
  assert.equal(typeof ExecutiveBusinessHealthPlatform.model, "object");
  assert.equal(typeof ExecutiveBusinessHealthPlatform.validation, "object");
  assert.equal(typeof ExecutiveBusinessHealthPlatform.manifest, "object");
});

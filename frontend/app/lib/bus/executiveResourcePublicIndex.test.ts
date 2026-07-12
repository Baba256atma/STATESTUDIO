import assert from "node:assert/strict";
import test from "node:test";

import {
  EXECUTIVE_RESOURCE_CERTIFICATION_STATUS,
  EXECUTIVE_RESOURCE_FREEZE_STATUS,
  EXECUTIVE_RESOURCE_INTELLIGENCE_PUBLIC_METADATA,
  EXECUTIVE_RESOURCE_PUBLIC_API_ID,
  EXECUTIVE_RESOURCE_PUBLIC_API_NAMESPACE,
  EXECUTIVE_RESOURCE_PUBLIC_API_REGISTRY,
  EXECUTIVE_RESOURCE_PUBLIC_API_STATUS,
  EXECUTIVE_RESOURCE_PUBLIC_API_VERSION,
  EXECUTIVE_RESOURCE_RELEASE_STATUS,
  ExecutiveResourceIntelligencePlatform,
  ExecutiveResourcePublicFoundation,
} from "./executiveResourcePublicIndex.ts";

test("all BUS-31 phases are publicly exported", () => {
  assert.ok(ExecutiveResourceIntelligencePlatform.contracts);
  assert.ok(ExecutiveResourceIntelligencePlatform.registry);
  assert.ok(ExecutiveResourceIntelligencePlatform.model);
  assert.ok(ExecutiveResourceIntelligencePlatform.validation);
  assert.ok(ExecutiveResourceIntelligencePlatform.manifest);
  assert.ok(ExecutiveResourceIntelligencePlatform.platform);
  assert.ok(ExecutiveResourceIntelligencePlatform.certification);
  assert.ok(ExecutiveResourceIntelligencePlatform.freeze);
});

test("namespace and public API registry integrity", () => {
  assert.equal(EXECUTIVE_RESOURCE_PUBLIC_API_ID, "executive-resource-public-api-registry");
  assert.equal(
    EXECUTIVE_RESOURCE_PUBLIC_API_NAMESPACE,
    "nexora.bus.executive-resource.public-index",
  );
  assert.equal(EXECUTIVE_RESOURCE_PUBLIC_API_VERSION, "1.0.0");
  assert.equal(EXECUTIVE_RESOURCE_PUBLIC_API_STATUS, "PUBLIC");
  assert.equal(EXECUTIVE_RESOURCE_PUBLIC_API_REGISTRY.exportedPhases.length, 8);
  assert.equal(EXECUTIVE_RESOURCE_PUBLIC_API_REGISTRY.exportedNamespaces.length, 8);
});

test("certification, freeze, and platform metadata are present", () => {
  assert.equal(EXECUTIVE_RESOURCE_INTELLIGENCE_PUBLIC_METADATA.certificationStatus, "PASS");
  assert.equal(EXECUTIVE_RESOURCE_INTELLIGENCE_PUBLIC_METADATA.freezeStatus, "FROZEN");
  assert.equal(EXECUTIVE_RESOURCE_INTELLIGENCE_PUBLIC_METADATA.releaseStatus, "RELEASED");
  assert.equal(EXECUTIVE_RESOURCE_CERTIFICATION_STATUS, "PASS");
  assert.equal(EXECUTIVE_RESOURCE_FREEZE_STATUS, "FROZEN");
  assert.equal(EXECUTIVE_RESOURCE_RELEASE_STATUS, "RELEASED");
});

test("immutable public namespace and aggregate public foundation integrity", () => {
  assert.equal(Object.isFrozen(ExecutiveResourceIntelligencePlatform), true);
  assert.equal(Object.isFrozen(EXECUTIVE_RESOURCE_PUBLIC_API_REGISTRY), true);
  assert.equal(Object.isFrozen(EXECUTIVE_RESOURCE_INTELLIGENCE_PUBLIC_METADATA), true);
  assert.equal(Object.isFrozen(ExecutiveResourcePublicFoundation), true);
  assert.equal(ExecutiveResourcePublicFoundation.metadata.metadataOnly, true);
  assert.equal(ExecutiveResourcePublicFoundation.metadata.immutable, true);
});

test("deterministic public API with zero runtime behavior", () => {
  assert.equal(typeof ExecutiveResourceIntelligencePlatform.contracts, "object");
  assert.equal(typeof ExecutiveResourceIntelligencePlatform.registry, "object");
  assert.equal(typeof ExecutiveResourceIntelligencePlatform.model, "object");
  assert.equal(typeof ExecutiveResourceIntelligencePlatform.validation, "object");
  assert.equal(typeof ExecutiveResourceIntelligencePlatform.manifest, "object");
  assert.equal(typeof ExecutiveResourceIntelligencePlatform.platform, "object");
  assert.equal(typeof ExecutiveResourceIntelligencePlatform.certification, "object");
  assert.equal(typeof ExecutiveResourceIntelligencePlatform.freeze, "object");
});

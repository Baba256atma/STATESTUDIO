import assert from "node:assert/strict";
import test from "node:test";

import {
  EXECUTIVE_RESOURCE,
  EXECUTIVE_RESOURCE_ALLOCATION,
  EXECUTIVE_RESOURCE_CATEGORIES,
  EXECUTIVE_RESOURCE_CONTRACT_REGISTRY,
  EXECUTIVE_RESOURCE_PLATFORM_DESCRIPTION,
  EXECUTIVE_RESOURCE_PLATFORM_ID,
  EXECUTIVE_RESOURCE_PLATFORM_NAME,
  EXECUTIVE_RESOURCE_PLATFORM_NAMESPACE,
  EXECUTIVE_RESOURCE_PLATFORM_VERSION,
  EXECUTIVE_RESOURCE_PUBLIC_APIS,
  ExecutiveResourceContractFoundation,
  ExecutiveResourceContracts,
  ExecutiveResourcePublicFoundation,
} from "./executiveResourceIndex.ts";

test("publishes immutable exports", () => {
  assert.equal(EXECUTIVE_RESOURCE_PLATFORM_ID, "BUS-31");
  assert.equal(EXECUTIVE_RESOURCE_PLATFORM_NAME, "Executive Resource Intelligence Platform");
  assert.equal(EXECUTIVE_RESOURCE_PLATFORM_NAMESPACE, "nexora.bus.executive-resource");
  assert.equal(EXECUTIVE_RESOURCE_PLATFORM_VERSION, "1.0.0");
  assert.equal(
    EXECUTIVE_RESOURCE_PLATFORM_DESCRIPTION,
    "Canonical metadata-only contract foundation for executive resource intelligence.",
  );
  assert.equal(Object.isFrozen(ExecutiveResourceContracts), true);
});

test("publishes namespace integrity and metadata completeness", () => {
  assert.equal(
    EXECUTIVE_RESOURCE_CONTRACT_REGISTRY.namespace,
    "nexora.bus.executive-resource",
  );
  assert.equal(EXECUTIVE_RESOURCE_CONTRACT_REGISTRY.platform.platformNamespace, "nexora.bus.executive-resource");
  assert.equal(EXECUTIVE_RESOURCE.resourceMetadata.metadataOnly, true);
  assert.equal(EXECUTIVE_RESOURCE_ALLOCATION.metadata.metadataOnly, true);
});

test("publishes contract integrity", () => {
  assert.equal(EXECUTIVE_RESOURCE_CATEGORIES.length, 16);
  assert.equal(EXECUTIVE_RESOURCE_CONTRACT_REGISTRY.contractTypes.length, 11);
  assert.equal(EXECUTIVE_RESOURCE_CONTRACT_REGISTRY.publicApis, EXECUTIVE_RESOURCE_PUBLIC_APIS);
});

test("publishes deterministic public API", () => {
  assert.equal(EXECUTIVE_RESOURCE_PUBLIC_APIS.length, 9);
  assert.equal(
    EXECUTIVE_RESOURCE_PUBLIC_APIS.includes("ExecutiveResourceContractFoundation"),
    true,
  );
  assert.equal(Object.isFrozen(EXECUTIVE_RESOURCE_PUBLIC_APIS), true);
});

test("publishes immutable contract foundation", () => {
  assert.equal(ExecutiveResourceContractFoundation.resource.metadataOnly, true);
  assert.equal(ExecutiveResourceContractFoundation.validation.summary.valid, true);
  assert.equal(Object.isFrozen(ExecutiveResourceContractFoundation), true);
  assert.equal(Object.isFrozen(ExecutiveResourcePublicFoundation), true);
});

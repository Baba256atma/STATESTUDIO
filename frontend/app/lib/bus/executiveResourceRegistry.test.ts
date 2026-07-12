import assert from "node:assert/strict";
import test from "node:test";

import {
  EXECUTIVE_RESOURCE_ALLOCATION_REGISTRY,
  EXECUTIVE_RESOURCE_AVAILABILITY_REGISTRY,
  EXECUTIVE_RESOURCE_CAPACITY_REGISTRY,
  EXECUTIVE_RESOURCE_CATEGORY_REGISTRY,
  EXECUTIVE_RESOURCE_CLASSIFICATION_REGISTRY,
  EXECUTIVE_RESOURCE_CONSTRAINT_REGISTRY,
  EXECUTIVE_RESOURCE_LIFECYCLE_REGISTRY,
  EXECUTIVE_RESOURCE_OWNER_REGISTRY,
  EXECUTIVE_RESOURCE_PLATFORM_REGISTRY,
  EXECUTIVE_RESOURCE_REGISTRY,
  EXECUTIVE_RESOURCE_REGISTRY_PUBLIC_APIS,
  EXECUTIVE_RESOURCE_REGISTRY_VALIDATION,
  EXECUTIVE_RESOURCE_TYPE_REGISTRY,
  EXECUTIVE_RESOURCE_UTILIZATION_REGISTRY,
  ExecutiveResourceRegistryFoundation,
  ExecutiveResourceRegistryPublicFoundation,
} from "./executiveResourceRegistryIndex.ts";

test("publishes immutable platform registry", () => {
  assert.equal(EXECUTIVE_RESOURCE_PLATFORM_REGISTRY.platformId, "BUS-31");
  assert.equal(EXECUTIVE_RESOURCE_PLATFORM_REGISTRY.platformStatus, "Published");
  assert.equal(
    EXECUTIVE_RESOURCE_PLATFORM_REGISTRY.platformNamespace,
    "nexora.bus.executive-resource",
  );
  assert.equal(Object.isFrozen(EXECUTIVE_RESOURCE_PLATFORM_REGISTRY), true);
});

test("publishes registry integrity", () => {
  assert.equal(EXECUTIVE_RESOURCE_REGISTRY.resources.length, 1);
  assert.equal(EXECUTIVE_RESOURCE_CATEGORY_REGISTRY.categories.length, 16);
  assert.equal(EXECUTIVE_RESOURCE_TYPE_REGISTRY.types.length, 1);
  assert.equal(EXECUTIVE_RESOURCE_OWNER_REGISTRY.owners.length, 1);
  assert.equal(EXECUTIVE_RESOURCE_ALLOCATION_REGISTRY.allocations.length, 1);
  assert.equal(EXECUTIVE_RESOURCE_CAPACITY_REGISTRY.capacities.length, 1);
  assert.equal(EXECUTIVE_RESOURCE_UTILIZATION_REGISTRY.utilizations.length, 1);
  assert.equal(EXECUTIVE_RESOURCE_AVAILABILITY_REGISTRY.availabilityEntries.length, 1);
  assert.equal(EXECUTIVE_RESOURCE_CONSTRAINT_REGISTRY.constraints.length, 1);
  assert.equal(EXECUTIVE_RESOURCE_LIFECYCLE_REGISTRY.lifecycleEntries.length, 1);
  assert.equal(EXECUTIVE_RESOURCE_CLASSIFICATION_REGISTRY.classifications.length, 1);
});

test("publishes namespace-consistent metadata", () => {
  assert.equal(
    EXECUTIVE_RESOURCE_REGISTRY.metadata.registryNamespace,
    "nexora.bus.executive-resource.registry",
  );
  assert.equal(
    EXECUTIVE_RESOURCE_TYPE_REGISTRY.metadata.registryNamespace,
    EXECUTIVE_RESOURCE_REGISTRY.metadata.registryNamespace,
  );
  assert.equal(
    EXECUTIVE_RESOURCE_PLATFORM_REGISTRY.platformMetadata.createdBy,
    "BUS-31:2",
  );
});

test("publishes aggregate registry integrity", () => {
  assert.equal(EXECUTIVE_RESOURCE_REGISTRY_VALIDATION.validationStatus, "PASS");
  assert.equal(
    EXECUTIVE_RESOURCE_REGISTRY_VALIDATION.validationSummary.categoryCount,
    16,
  );
  assert.equal(
    ExecutiveResourceRegistryFoundation.validationRegistry,
    EXECUTIVE_RESOURCE_REGISTRY_VALIDATION,
  );
  assert.equal(Object.isFrozen(ExecutiveResourceRegistryFoundation), true);
});

test("publishes deterministic public API", () => {
  assert.equal(EXECUTIVE_RESOURCE_REGISTRY_PUBLIC_APIS.length, 14);
  assert.equal(
    EXECUTIVE_RESOURCE_REGISTRY_PUBLIC_APIS.includes("ExecutiveResourceRegistryFoundation"),
    true,
  );
  assert.equal(Object.isFrozen(EXECUTIVE_RESOURCE_REGISTRY_PUBLIC_APIS), true);
  assert.equal(Object.isFrozen(ExecutiveResourceRegistryPublicFoundation), true);
});

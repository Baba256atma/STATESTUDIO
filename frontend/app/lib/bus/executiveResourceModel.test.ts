import assert from "node:assert/strict";
import test from "node:test";

import {
  EXECUTIVE_RESOURCE_ALLOCATION_MODELS,
  EXECUTIVE_RESOURCE_AVAILABILITY_MODELS,
  EXECUTIVE_RESOURCE_CAPACITY_MODELS,
  EXECUTIVE_RESOURCE_CATEGORY_MODELS,
  EXECUTIVE_RESOURCE_CLASSIFICATION_MODELS,
  EXECUTIVE_RESOURCE_CONSTRAINT_MODELS,
  EXECUTIVE_RESOURCE_LIFECYCLE_MODELS,
  EXECUTIVE_RESOURCE_MODEL_DESCRIPTION,
  EXECUTIVE_RESOURCE_MODEL_ID,
  EXECUTIVE_RESOURCE_MODEL_METADATA,
  EXECUTIVE_RESOURCE_MODEL_NAMESPACE,
  EXECUTIVE_RESOURCE_MODEL_PUBLIC_APIS,
  EXECUTIVE_RESOURCE_MODEL_STATUS,
  EXECUTIVE_RESOURCE_MODEL_VERSION,
  EXECUTIVE_RESOURCE_MODELS,
  EXECUTIVE_RESOURCE_OWNER_MODELS,
  EXECUTIVE_RESOURCE_PLATFORM_MODEL,
  EXECUTIVE_RESOURCE_TYPE_MODELS,
  EXECUTIVE_RESOURCE_UTILIZATION_MODELS,
  ExecutiveResourceModelFoundation,
  ExecutiveResourceModelPublicFoundation,
} from "./executiveResourceModelIndex.ts";

test("publishes immutable model exports", () => {
  assert.equal(EXECUTIVE_RESOURCE_MODEL_ID, "executive-resource-model-foundation");
  assert.equal(EXECUTIVE_RESOURCE_MODEL_VERSION, "1.0.0");
  assert.equal(EXECUTIVE_RESOURCE_MODEL_NAMESPACE, "nexora.bus.executive-resource.model");
  assert.equal(EXECUTIVE_RESOURCE_MODEL_STATUS, "Published");
  assert.equal(
    EXECUTIVE_RESOURCE_MODEL_DESCRIPTION,
    "Canonical metadata-only structural model for executive resource intelligence.",
  );
});

test("publishes model integrity", () => {
  assert.equal(EXECUTIVE_RESOURCE_MODELS.length, 1);
  assert.equal(EXECUTIVE_RESOURCE_CATEGORY_MODELS.length, 16);
  assert.equal(EXECUTIVE_RESOURCE_TYPE_MODELS.length, 1);
  assert.equal(EXECUTIVE_RESOURCE_OWNER_MODELS.length, 1);
  assert.equal(EXECUTIVE_RESOURCE_ALLOCATION_MODELS.length, 1);
  assert.equal(EXECUTIVE_RESOURCE_CAPACITY_MODELS.length, 1);
  assert.equal(EXECUTIVE_RESOURCE_UTILIZATION_MODELS.length, 1);
  assert.equal(EXECUTIVE_RESOURCE_AVAILABILITY_MODELS.length, 1);
  assert.equal(EXECUTIVE_RESOURCE_CONSTRAINT_MODELS.length, 1);
  assert.equal(EXECUTIVE_RESOURCE_LIFECYCLE_MODELS.length, 1);
  assert.equal(EXECUTIVE_RESOURCE_CLASSIFICATION_MODELS.length, 1);
});

test("publishes aggregate foundation integrity", () => {
  assert.equal(ExecutiveResourceModelFoundation.resources, EXECUTIVE_RESOURCE_MODELS);
  assert.equal(ExecutiveResourceModelFoundation.categories, EXECUTIVE_RESOURCE_CATEGORY_MODELS);
  assert.equal(ExecutiveResourceModelFoundation.types, EXECUTIVE_RESOURCE_TYPE_MODELS);
  assert.equal(ExecutiveResourceModelFoundation.owners, EXECUTIVE_RESOURCE_OWNER_MODELS);
  assert.equal(ExecutiveResourceModelFoundation.allocations, EXECUTIVE_RESOURCE_ALLOCATION_MODELS);
  assert.equal(ExecutiveResourceModelFoundation.capacity, EXECUTIVE_RESOURCE_CAPACITY_MODELS);
  assert.equal(
    ExecutiveResourceModelFoundation.utilization,
    EXECUTIVE_RESOURCE_UTILIZATION_MODELS,
  );
  assert.equal(
    ExecutiveResourceModelFoundation.availability,
    EXECUTIVE_RESOURCE_AVAILABILITY_MODELS,
  );
  assert.equal(
    ExecutiveResourceModelFoundation.constraints,
    EXECUTIVE_RESOURCE_CONSTRAINT_MODELS,
  );
  assert.equal(ExecutiveResourceModelFoundation.lifecycle, EXECUTIVE_RESOURCE_LIFECYCLE_MODELS);
  assert.equal(
    ExecutiveResourceModelFoundation.classifications,
    EXECUTIVE_RESOURCE_CLASSIFICATION_MODELS,
  );
});

test("publishes namespace consistency and dependency metadata", () => {
  assert.equal(
    EXECUTIVE_RESOURCE_PLATFORM_MODEL.platformNamespace,
    "nexora.bus.executive-resource",
  );
  assert.equal(
    EXECUTIVE_RESOURCE_MODEL_METADATA.modelNamespace,
    "nexora.bus.executive-resource.model",
  );
  assert.equal(EXECUTIVE_RESOURCE_MODEL_METADATA.modelDependencies.length, 2);
  assert.equal(EXECUTIVE_RESOURCE_MODEL_METADATA.modelConsumers.length, 3);
});

test("publishes deterministic public API", () => {
  assert.equal(EXECUTIVE_RESOURCE_MODEL_PUBLIC_APIS.length, 19);
  assert.equal(
    EXECUTIVE_RESOURCE_MODEL_PUBLIC_APIS.includes("ExecutiveResourceModelFoundation"),
    true,
  );
  assert.equal(Object.isFrozen(ExecutiveResourceModelFoundation), true);
  assert.equal(Object.isFrozen(ExecutiveResourceModelPublicFoundation), true);
  assert.equal(ExecutiveResourceModelFoundation.metadata.metadataOnly, true);
});

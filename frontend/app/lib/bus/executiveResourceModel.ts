import {
  EXECUTIVE_RESOURCE_CONTRACT_REGISTRY,
  EXECUTIVE_RESOURCE_PLATFORM_DESCRIPTION,
  EXECUTIVE_RESOURCE_PLATFORM_ID,
  EXECUTIVE_RESOURCE_PLATFORM_NAME,
  EXECUTIVE_RESOURCE_PLATFORM_NAMESPACE,
  EXECUTIVE_RESOURCE_PLATFORM_VERSION,
} from "./executiveResourceIndex.ts";
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
  EXECUTIVE_RESOURCE_TYPE_REGISTRY,
  EXECUTIVE_RESOURCE_UTILIZATION_REGISTRY,
} from "./executiveResourceRegistryIndex.ts";
import type {
  ExecutiveResourceAllocationModel,
  ExecutiveResourceAvailabilityModel,
  ExecutiveResourceCapacityModel,
  ExecutiveResourceCategoryModel,
  ExecutiveResourceClassificationModel,
  ExecutiveResourceConstraintModel,
  ExecutiveResourceLifecycleModel,
  ExecutiveResourceModel,
  ExecutiveResourceModelBundle,
  ExecutiveResourceModelMetadata,
  ExecutiveResourceModelStatus,
  ExecutiveResourceOwnerModel,
  ExecutiveResourcePlatformModel,
  ExecutiveResourceTypeModel,
  ExecutiveResourceUtilizationModel,
} from "./executiveResourceModelTypes.ts";

export const EXECUTIVE_RESOURCE_MODEL_ID = "executive-resource-model-foundation" as const;

export const EXECUTIVE_RESOURCE_MODEL_VERSION = "1.0.0" as const;

export const EXECUTIVE_RESOURCE_MODEL_NAMESPACE = "nexora.bus.executive-resource.model" as const;

export const EXECUTIVE_RESOURCE_MODEL_STATUS: ExecutiveResourceModelStatus = "Published";

export const EXECUTIVE_RESOURCE_MODEL_DESCRIPTION =
  "Canonical metadata-only structural model for executive resource intelligence." as const;

export const EXECUTIVE_RESOURCE_PLATFORM_MODEL: ExecutiveResourcePlatformModel = Object.freeze({
  platformId: EXECUTIVE_RESOURCE_PLATFORM_ID,
  platformName: EXECUTIVE_RESOURCE_PLATFORM_NAME,
  platformNamespace: EXECUTIVE_RESOURCE_PLATFORM_NAMESPACE,
  platformVersion: EXECUTIVE_RESOURCE_PLATFORM_VERSION,
  platformStatus: EXECUTIVE_RESOURCE_MODEL_STATUS,
  platformDescription: EXECUTIVE_RESOURCE_PLATFORM_DESCRIPTION,
  platformMetadata: Object.freeze({
    modelLayer: "BUS-31:3",
    createdBy: "BUS-31:3",
    metadataOnly: true,
    immutable: true,
  }),
  metadataOnly: true,
  immutable: true,
});

export const EXECUTIVE_RESOURCE_MODELS: readonly ExecutiveResourceModel[] = Object.freeze(
  EXECUTIVE_RESOURCE_REGISTRY.resources.map((resource) =>
    Object.freeze({
      modelId: "executive-resource-model",
      resourceId: resource.resourceId,
      resourceCode: resource.resourceCode,
      resourceName: resource.resourceName,
      resourceCategory: resource.resourceCategory,
      resourceType: resource.resourceType,
      resourceStatus: resource.resourceStatus,
      resourceMetadata: resource.resourceMetadata,
      metadataOnly: true,
      immutable: true,
    }),
  ),
);

export const EXECUTIVE_RESOURCE_CATEGORY_MODELS: readonly ExecutiveResourceCategoryModel[] =
  Object.freeze(
    EXECUTIVE_RESOURCE_CATEGORY_REGISTRY.categories.map((category) =>
      Object.freeze({
        categoryId: category.categoryId,
        categoryName: category.categoryName,
        categoryDescription: category.categoryDescription,
        metadata: category.metadata,
        metadataOnly: true,
        immutable: true,
      }),
    ),
  );

export const EXECUTIVE_RESOURCE_TYPE_MODELS: readonly ExecutiveResourceTypeModel[] = Object.freeze(
  EXECUTIVE_RESOURCE_TYPE_REGISTRY.types.map((typeEntry) =>
    Object.freeze({
      typeId: typeEntry.typeId,
      typeCode: typeEntry.typeCode,
      typeName: typeEntry.typeName,
      typeDescription: typeEntry.typeDescription,
      metadata: typeEntry.metadata,
      metadataOnly: true,
      immutable: true,
    }),
  ),
);

export const EXECUTIVE_RESOURCE_OWNER_MODELS: readonly ExecutiveResourceOwnerModel[] =
  Object.freeze(
    EXECUTIVE_RESOURCE_OWNER_REGISTRY.owners.map((owner) =>
      Object.freeze({
        ownerId: owner.ownerId,
        ownerType: owner.ownerType,
        ownerReference: owner.ownerReference,
        ownerName: owner.ownerName,
        metadata: owner.metadata,
        metadataOnly: true,
        immutable: true,
      }),
    ),
  );

export const EXECUTIVE_RESOURCE_ALLOCATION_MODELS: readonly ExecutiveResourceAllocationModel[] =
  Object.freeze(
    EXECUTIVE_RESOURCE_ALLOCATION_REGISTRY.allocations.map((allocation) =>
      Object.freeze({
        allocationId: allocation.allocationId,
        resourceId: allocation.resourceId,
        allocationType: allocation.allocationType,
        allocationStatus: allocation.allocationStatus,
        allocationScope: allocation.allocationScope,
        metadata: allocation.metadata,
        metadataOnly: true,
        immutable: true,
      }),
    ),
  );

export const EXECUTIVE_RESOURCE_CAPACITY_MODELS: readonly ExecutiveResourceCapacityModel[] =
  Object.freeze(
    EXECUTIVE_RESOURCE_CAPACITY_REGISTRY.capacities.map((capacity) =>
      Object.freeze({
        capacityId: capacity.capacityId,
        resourceId: capacity.resourceId,
        capacityType: capacity.capacityType,
        capacityStatus: capacity.capacityStatus,
        metadata: capacity.metadata,
        metadataOnly: true,
        immutable: true,
      }),
    ),
  );

export const EXECUTIVE_RESOURCE_UTILIZATION_MODELS: readonly ExecutiveResourceUtilizationModel[] =
  Object.freeze(
    EXECUTIVE_RESOURCE_UTILIZATION_REGISTRY.utilizations.map((utilization) =>
      Object.freeze({
        utilizationId: utilization.utilizationId,
        resourceId: utilization.resourceId,
        utilizationCategory: utilization.utilizationCategory,
        utilizationStatus: utilization.utilizationStatus,
        metadata: utilization.metadata,
        metadataOnly: true,
        immutable: true,
      }),
    ),
  );

export const EXECUTIVE_RESOURCE_AVAILABILITY_MODELS: readonly ExecutiveResourceAvailabilityModel[] =
  Object.freeze(
    EXECUTIVE_RESOURCE_AVAILABILITY_REGISTRY.availabilityEntries.map((availability) =>
      Object.freeze({
        availabilityId: availability.availabilityId,
        resourceId: availability.resourceId,
        availabilityStatus: availability.availabilityStatus,
        availabilityCategory: availability.availabilityCategory,
        metadata: availability.metadata,
        metadataOnly: true,
        immutable: true,
      }),
    ),
  );

export const EXECUTIVE_RESOURCE_CONSTRAINT_MODELS: readonly ExecutiveResourceConstraintModel[] =
  Object.freeze(
    EXECUTIVE_RESOURCE_CONSTRAINT_REGISTRY.constraints.map((constraint) =>
      Object.freeze({
        constraintId: constraint.constraintId,
        constraintName: constraint.constraintName,
        constraintCategory: constraint.constraintCategory,
        constraintSeverity: constraint.constraintSeverity,
        metadata: constraint.metadata,
        metadataOnly: true,
        immutable: true,
      }),
    ),
  );

export const EXECUTIVE_RESOURCE_LIFECYCLE_MODELS: readonly ExecutiveResourceLifecycleModel[] =
  Object.freeze(
    EXECUTIVE_RESOURCE_LIFECYCLE_REGISTRY.lifecycleEntries.map((lifecycle) =>
      Object.freeze({
        lifecycleId: lifecycle.lifecycleId,
        lifecycleStage: lifecycle.lifecycleStage,
        lifecycleStatus: lifecycle.lifecycleStatus,
        metadata: lifecycle.metadata,
        metadataOnly: true,
        immutable: true,
      }),
    ),
  );

export const EXECUTIVE_RESOURCE_CLASSIFICATION_MODELS: readonly ExecutiveResourceClassificationModel[] =
  Object.freeze(
    EXECUTIVE_RESOURCE_CLASSIFICATION_REGISTRY.classifications.map((classification) =>
      Object.freeze({
        classificationId: classification.classificationId,
        classificationName: classification.classificationName,
        classificationLevel: classification.classificationLevel,
        metadata: classification.metadata,
        metadataOnly: true,
        immutable: true,
      }),
    ),
  );

export const EXECUTIVE_RESOURCE_MODEL_METADATA: ExecutiveResourceModelMetadata = Object.freeze({
  modelId: EXECUTIVE_RESOURCE_MODEL_ID,
  modelVersion: EXECUTIVE_RESOURCE_MODEL_VERSION,
  modelNamespace: EXECUTIVE_RESOURCE_MODEL_NAMESPACE,
  modelStatus: EXECUTIVE_RESOURCE_MODEL_STATUS,
  modelDescription: EXECUTIVE_RESOURCE_MODEL_DESCRIPTION,
  modelDependencies: Object.freeze([
    "BUS-31:1 Executive Resource Intelligence Contracts",
    "BUS-31:2 Executive Resource Registry",
  ]),
  modelConsumers: Object.freeze([
    "BUS-31:4 Validation",
    "APP Executive Intelligence",
    "LAY Executive Layer",
  ]),
  modelCompatibility: Object.freeze([
    `contract-platform:${EXECUTIVE_RESOURCE_CONTRACT_REGISTRY.platform.platformId}`,
    `registry-platform:${EXECUTIVE_RESOURCE_PLATFORM_REGISTRY.platformId}`,
    `registry-public-api-count:${EXECUTIVE_RESOURCE_REGISTRY_PUBLIC_APIS.length}`,
    "metadata-only",
    "public-api-only",
    "deterministic",
  ]),
  modelMetadata: Object.freeze({
    version: EXECUTIVE_RESOURCE_PLATFORM_VERSION,
    tags: Object.freeze(["resource", "model", "metadata-only"]),
    labels: Object.freeze(["bus-31", "model"]),
    metadataOnly: true,
    immutable: true,
  }),
  metadataOnly: true,
  immutable: true,
});

export const ExecutiveResourceModelFoundation: ExecutiveResourceModelBundle = Object.freeze({
  platform: EXECUTIVE_RESOURCE_PLATFORM_MODEL,
  resources: EXECUTIVE_RESOURCE_MODELS,
  categories: EXECUTIVE_RESOURCE_CATEGORY_MODELS,
  types: EXECUTIVE_RESOURCE_TYPE_MODELS,
  owners: EXECUTIVE_RESOURCE_OWNER_MODELS,
  allocations: EXECUTIVE_RESOURCE_ALLOCATION_MODELS,
  capacity: EXECUTIVE_RESOURCE_CAPACITY_MODELS,
  utilization: EXECUTIVE_RESOURCE_UTILIZATION_MODELS,
  availability: EXECUTIVE_RESOURCE_AVAILABILITY_MODELS,
  constraints: EXECUTIVE_RESOURCE_CONSTRAINT_MODELS,
  lifecycle: EXECUTIVE_RESOURCE_LIFECYCLE_MODELS,
  classifications: EXECUTIVE_RESOURCE_CLASSIFICATION_MODELS,
  metadata: EXECUTIVE_RESOURCE_MODEL_METADATA,
  metadataOnly: true,
  immutable: true,
});

export const EXECUTIVE_RESOURCE_MODEL_PUBLIC_APIS = Object.freeze([
  "EXECUTIVE_RESOURCE_MODEL_ID",
  "EXECUTIVE_RESOURCE_MODEL_VERSION",
  "EXECUTIVE_RESOURCE_MODEL_NAMESPACE",
  "EXECUTIVE_RESOURCE_MODEL_STATUS",
  "EXECUTIVE_RESOURCE_MODEL_DESCRIPTION",
  "EXECUTIVE_RESOURCE_PLATFORM_MODEL",
  "EXECUTIVE_RESOURCE_MODELS",
  "EXECUTIVE_RESOURCE_CATEGORY_MODELS",
  "EXECUTIVE_RESOURCE_TYPE_MODELS",
  "EXECUTIVE_RESOURCE_OWNER_MODELS",
  "EXECUTIVE_RESOURCE_ALLOCATION_MODELS",
  "EXECUTIVE_RESOURCE_CAPACITY_MODELS",
  "EXECUTIVE_RESOURCE_UTILIZATION_MODELS",
  "EXECUTIVE_RESOURCE_AVAILABILITY_MODELS",
  "EXECUTIVE_RESOURCE_CONSTRAINT_MODELS",
  "EXECUTIVE_RESOURCE_LIFECYCLE_MODELS",
  "EXECUTIVE_RESOURCE_CLASSIFICATION_MODELS",
  "EXECUTIVE_RESOURCE_MODEL_METADATA",
  "ExecutiveResourceModelFoundation",
] as const);

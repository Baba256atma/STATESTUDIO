import {
  EXECUTIVE_RESOURCE,
  EXECUTIVE_RESOURCE_ALLOCATION,
  EXECUTIVE_RESOURCE_AVAILABILITY,
  EXECUTIVE_RESOURCE_CAPACITY,
  EXECUTIVE_RESOURCE_CATEGORIES,
  EXECUTIVE_RESOURCE_CLASSIFICATION,
  EXECUTIVE_RESOURCE_CONSTRAINT,
  EXECUTIVE_RESOURCE_LIFECYCLE,
  EXECUTIVE_RESOURCE_OWNER,
  EXECUTIVE_RESOURCE_PLATFORM_DESCRIPTION,
  EXECUTIVE_RESOURCE_PLATFORM_ID,
  EXECUTIVE_RESOURCE_PLATFORM_NAME,
  EXECUTIVE_RESOURCE_PLATFORM_NAMESPACE,
  EXECUTIVE_RESOURCE_PLATFORM_STATUS,
  EXECUTIVE_RESOURCE_PLATFORM_VERSION,
  EXECUTIVE_RESOURCE_TYPE,
  EXECUTIVE_RESOURCE_UTILIZATION,
} from "./executiveResourceIndex.ts";
import type {
  ExecutiveResourceCategoryEntry,
  ExecutiveResourceCategoryRegistry,
  ExecutiveResourcePlatformRegistry,
  ExecutiveResourcePlatformRegistryMetadata,
  ExecutiveResourceRegistry,
  ExecutiveResourceRegistryBundle,
  ExecutiveResourceRegistryMetadata,
  ExecutiveResourceRegistryValidation,
  ExecutiveResourceRegistryValidationSummary,
  ExecutiveResourceTypeRegistry,
  ExecutiveResourceOwnerRegistry,
  ExecutiveResourceAllocationRegistry,
  ExecutiveResourceCapacityRegistry,
  ExecutiveResourceUtilizationRegistry,
  ExecutiveResourceAvailabilityRegistry,
  ExecutiveResourceConstraintRegistry,
  ExecutiveResourceLifecycleRegistry,
  ExecutiveResourceClassificationRegistry,
} from "./executiveResourceRegistryTypes.ts";

const createMetadata = (description: string): ExecutiveResourceRegistryMetadata =>
  Object.freeze({
    registryVersion: "1.0.0",
    registryNamespace: "nexora.bus.executive-resource.registry",
    registryStatus: "Published",
    registryDescription: description,
    registryDependencies: Object.freeze([
      "BUS-31:1 Executive Resource Intelligence Contracts",
    ]),
    registryConsumers: Object.freeze([
      "BUS-31:3 Resource Model",
      "APP Executive Intelligence",
      "LAY Executive Layer",
    ]),
    registryCompatibility: Object.freeze([
      "metadata-only",
      "public-api-only",
      "deterministic",
      "immutable",
    ]),
    registryMetadata: Object.freeze({
      version: EXECUTIVE_RESOURCE_PLATFORM_VERSION,
      tags: Object.freeze(["resource", "registry", "metadata-only"]),
      labels: Object.freeze(["bus-31", "registry"]),
      metadataOnly: true,
      immutable: true,
    }),
    metadataOnly: true,
    immutable: true,
  });

const platformMetadata: ExecutiveResourcePlatformRegistryMetadata = Object.freeze({
  createdBy: "BUS-31:2",
  consumers: Object.freeze([
    "BUS-31:3 Resource Model",
    "APP Executive Intelligence",
    "LAY Executive Layer",
  ]),
  dependencies: Object.freeze([
    "BUS-31:1 Executive Resource Intelligence Contracts",
  ]),
  compatibility: Object.freeze([
    "metadata-only",
    "public-api-only",
    "deterministic",
    "immutable",
  ]),
  metadataOnly: true,
  immutable: true,
});

const categoryEntries: readonly ExecutiveResourceCategoryEntry[] = Object.freeze(
  EXECUTIVE_RESOURCE_CATEGORIES.map((category) =>
    Object.freeze({
      categoryId: `resource-category-${category.toLowerCase()}` as const,
      categoryName: category,
      categoryDescription: `${category} resource classification metadata.`,
      metadata: Object.freeze({
        version: EXECUTIVE_RESOURCE_PLATFORM_VERSION,
        tags: Object.freeze(["resource-category", category.toLowerCase()]),
        labels: Object.freeze(["bus-31", "registry"]),
        metadataOnly: true,
        immutable: true,
      }),
      metadataOnly: true,
      immutable: true,
    }),
  ),
);

export const EXECUTIVE_RESOURCE_PLATFORM_REGISTRY: ExecutiveResourcePlatformRegistry =
  Object.freeze({
    platformId: EXECUTIVE_RESOURCE_PLATFORM_ID,
    platformName: EXECUTIVE_RESOURCE_PLATFORM_NAME,
    platformNamespace: EXECUTIVE_RESOURCE_PLATFORM_NAMESPACE,
    platformVersion: EXECUTIVE_RESOURCE_PLATFORM_VERSION,
    platformStatus:
      EXECUTIVE_RESOURCE_PLATFORM_STATUS === "Foundation" ? "Published" : "Archived",
    platformDescription: EXECUTIVE_RESOURCE_PLATFORM_DESCRIPTION,
    platformMetadata,
    metadataOnly: true,
    immutable: true,
  });

export const EXECUTIVE_RESOURCE_REGISTRY: ExecutiveResourceRegistry = Object.freeze({
  registryId: "executive-resource-registry",
  resources: Object.freeze([EXECUTIVE_RESOURCE]),
  metadata: createMetadata("Canonical registry for executive resource entries."),
  metadataOnly: true,
  immutable: true,
});

export const EXECUTIVE_RESOURCE_CATEGORY_REGISTRY: ExecutiveResourceCategoryRegistry =
  Object.freeze({
    registryId: "executive-resource-category-registry",
    categories: categoryEntries,
    metadata: createMetadata("Canonical registry for executive resource category entries."),
    metadataOnly: true,
    immutable: true,
  });

export const EXECUTIVE_RESOURCE_TYPE_REGISTRY: ExecutiveResourceTypeRegistry = Object.freeze({
  registryId: "executive-resource-type-registry",
  types: Object.freeze([EXECUTIVE_RESOURCE_TYPE]),
  metadata: createMetadata("Canonical registry for executive resource type entries."),
  metadataOnly: true,
  immutable: true,
});

export const EXECUTIVE_RESOURCE_OWNER_REGISTRY: ExecutiveResourceOwnerRegistry = Object.freeze({
  registryId: "executive-resource-owner-registry",
  owners: Object.freeze([EXECUTIVE_RESOURCE_OWNER]),
  metadata: createMetadata("Canonical registry for executive resource owner entries."),
  metadataOnly: true,
  immutable: true,
});

export const EXECUTIVE_RESOURCE_ALLOCATION_REGISTRY: ExecutiveResourceAllocationRegistry =
  Object.freeze({
    registryId: "executive-resource-allocation-registry",
    allocations: Object.freeze([EXECUTIVE_RESOURCE_ALLOCATION]),
    metadata: createMetadata("Canonical registry for executive resource allocation entries."),
    metadataOnly: true,
    immutable: true,
  });

export const EXECUTIVE_RESOURCE_CAPACITY_REGISTRY: ExecutiveResourceCapacityRegistry =
  Object.freeze({
    registryId: "executive-resource-capacity-registry",
    capacities: Object.freeze([EXECUTIVE_RESOURCE_CAPACITY]),
    metadata: createMetadata("Canonical registry for executive resource capacity entries."),
    metadataOnly: true,
    immutable: true,
  });

export const EXECUTIVE_RESOURCE_UTILIZATION_REGISTRY: ExecutiveResourceUtilizationRegistry =
  Object.freeze({
    registryId: "executive-resource-utilization-registry",
    utilizations: Object.freeze([EXECUTIVE_RESOURCE_UTILIZATION]),
    metadata: createMetadata("Canonical registry for executive resource utilization entries."),
    metadataOnly: true,
    immutable: true,
  });

export const EXECUTIVE_RESOURCE_AVAILABILITY_REGISTRY: ExecutiveResourceAvailabilityRegistry =
  Object.freeze({
    registryId: "executive-resource-availability-registry",
    availabilityEntries: Object.freeze([EXECUTIVE_RESOURCE_AVAILABILITY]),
    metadata: createMetadata("Canonical registry for executive resource availability entries."),
    metadataOnly: true,
    immutable: true,
  });

export const EXECUTIVE_RESOURCE_CONSTRAINT_REGISTRY: ExecutiveResourceConstraintRegistry =
  Object.freeze({
    registryId: "executive-resource-constraint-registry",
    constraints: Object.freeze([EXECUTIVE_RESOURCE_CONSTRAINT]),
    metadata: createMetadata("Canonical registry for executive resource constraint entries."),
    metadataOnly: true,
    immutable: true,
  });

export const EXECUTIVE_RESOURCE_LIFECYCLE_REGISTRY: ExecutiveResourceLifecycleRegistry =
  Object.freeze({
    registryId: "executive-resource-lifecycle-registry",
    lifecycleEntries: Object.freeze([EXECUTIVE_RESOURCE_LIFECYCLE]),
    metadata: createMetadata("Canonical registry for executive resource lifecycle entries."),
    metadataOnly: true,
    immutable: true,
  });

export const EXECUTIVE_RESOURCE_CLASSIFICATION_REGISTRY: ExecutiveResourceClassificationRegistry =
  Object.freeze({
    registryId: "executive-resource-classification-registry",
    classifications: Object.freeze([EXECUTIVE_RESOURCE_CLASSIFICATION]),
    metadata: createMetadata("Canonical registry for executive resource classification entries."),
    metadataOnly: true,
    immutable: true,
  });

export const EXECUTIVE_RESOURCE_REGISTRY_VALIDATION_SUMMARY: ExecutiveResourceRegistryValidationSummary =
  Object.freeze({
    resourceCount: EXECUTIVE_RESOURCE_REGISTRY.resources.length,
    categoryCount: EXECUTIVE_RESOURCE_CATEGORY_REGISTRY.categories.length,
    typeCount: EXECUTIVE_RESOURCE_TYPE_REGISTRY.types.length,
    ownerCount: EXECUTIVE_RESOURCE_OWNER_REGISTRY.owners.length,
    allocationCount: EXECUTIVE_RESOURCE_ALLOCATION_REGISTRY.allocations.length,
    capacityCount: EXECUTIVE_RESOURCE_CAPACITY_REGISTRY.capacities.length,
    utilizationCount: EXECUTIVE_RESOURCE_UTILIZATION_REGISTRY.utilizations.length,
    availabilityCount: EXECUTIVE_RESOURCE_AVAILABILITY_REGISTRY.availabilityEntries.length,
    constraintCount: EXECUTIVE_RESOURCE_CONSTRAINT_REGISTRY.constraints.length,
    lifecycleCount: EXECUTIVE_RESOURCE_LIFECYCLE_REGISTRY.lifecycleEntries.length,
    classificationCount: EXECUTIVE_RESOURCE_CLASSIFICATION_REGISTRY.classifications.length,
    metadataOnly: true,
    immutable: true,
  });

export const EXECUTIVE_RESOURCE_REGISTRY_VALIDATION: ExecutiveResourceRegistryValidation =
  Object.freeze({
    validationStatus: "PASS",
    validationSummary: EXECUTIVE_RESOURCE_REGISTRY_VALIDATION_SUMMARY,
    metadata: Object.freeze({
      version: EXECUTIVE_RESOURCE_PLATFORM_VERSION,
      tags: Object.freeze(["resource-registry-validation"]),
      labels: Object.freeze(["bus-31", "validation"]),
      metadataOnly: true,
      immutable: true,
    }),
    metadataOnly: true,
    immutable: true,
  });

export const EXECUTIVE_RESOURCE_REGISTRY_PUBLIC_APIS = Object.freeze([
  "EXECUTIVE_RESOURCE_PLATFORM_REGISTRY",
  "EXECUTIVE_RESOURCE_REGISTRY",
  "EXECUTIVE_RESOURCE_CATEGORY_REGISTRY",
  "EXECUTIVE_RESOURCE_TYPE_REGISTRY",
  "EXECUTIVE_RESOURCE_OWNER_REGISTRY",
  "EXECUTIVE_RESOURCE_ALLOCATION_REGISTRY",
  "EXECUTIVE_RESOURCE_CAPACITY_REGISTRY",
  "EXECUTIVE_RESOURCE_UTILIZATION_REGISTRY",
  "EXECUTIVE_RESOURCE_AVAILABILITY_REGISTRY",
  "EXECUTIVE_RESOURCE_CONSTRAINT_REGISTRY",
  "EXECUTIVE_RESOURCE_LIFECYCLE_REGISTRY",
  "EXECUTIVE_RESOURCE_CLASSIFICATION_REGISTRY",
  "EXECUTIVE_RESOURCE_REGISTRY_VALIDATION",
  "ExecutiveResourceRegistryFoundation",
] as const);

export const ExecutiveResourceRegistryFoundation: ExecutiveResourceRegistryBundle =
  Object.freeze({
    platformRegistry: EXECUTIVE_RESOURCE_PLATFORM_REGISTRY,
    resourceRegistry: EXECUTIVE_RESOURCE_REGISTRY,
    categoryRegistry: EXECUTIVE_RESOURCE_CATEGORY_REGISTRY,
    typeRegistry: EXECUTIVE_RESOURCE_TYPE_REGISTRY,
    ownerRegistry: EXECUTIVE_RESOURCE_OWNER_REGISTRY,
    allocationRegistry: EXECUTIVE_RESOURCE_ALLOCATION_REGISTRY,
    capacityRegistry: EXECUTIVE_RESOURCE_CAPACITY_REGISTRY,
    utilizationRegistry: EXECUTIVE_RESOURCE_UTILIZATION_REGISTRY,
    availabilityRegistry: EXECUTIVE_RESOURCE_AVAILABILITY_REGISTRY,
    constraintRegistry: EXECUTIVE_RESOURCE_CONSTRAINT_REGISTRY,
    lifecycleRegistry: EXECUTIVE_RESOURCE_LIFECYCLE_REGISTRY,
    classificationRegistry: EXECUTIVE_RESOURCE_CLASSIFICATION_REGISTRY,
    validationRegistry: EXECUTIVE_RESOURCE_REGISTRY_VALIDATION,
    publicApis: EXECUTIVE_RESOURCE_REGISTRY_PUBLIC_APIS,
    metadataOnly: true,
    immutable: true,
  });

import type {
  ExecutiveResource,
  ExecutiveResourceAllocation,
  ExecutiveResourceAvailability,
  ExecutiveResourceCapacity,
  ExecutiveResourceCategory,
  ExecutiveResourceClassification,
  ExecutiveResourceConstraint,
  ExecutiveResourceLifecycle,
  ExecutiveResourceMetadata,
  ExecutiveResourceOwner,
  ExecutiveResourcePlatformId,
  ExecutiveResourcePlatformName,
  ExecutiveResourcePlatformNamespace,
  ExecutiveResourcePlatformStatus,
  ExecutiveResourcePlatformVersion,
  ExecutiveResourceType,
  ExecutiveResourceUtilization,
} from "./executiveResourceIndex.ts";

export type ExecutiveResourceRegistryStatus = "Published" | "Frozen" | "Archived";

export type ExecutiveResourcePlatformRegistryMetadata = Readonly<{
  readonly createdBy: "BUS-31:2";
  readonly consumers: readonly string[];
  readonly dependencies: readonly string[];
  readonly compatibility: readonly string[];
  readonly metadataOnly: true;
  readonly immutable: true;
}>;

export type ExecutiveResourcePlatformRegistry = Readonly<{
  readonly platformId: ExecutiveResourcePlatformId;
  readonly platformName: ExecutiveResourcePlatformName;
  readonly platformNamespace: ExecutiveResourcePlatformNamespace;
  readonly platformVersion: ExecutiveResourcePlatformVersion;
  readonly platformStatus: ExecutiveResourceRegistryStatus;
  readonly platformDescription: string;
  readonly platformMetadata: ExecutiveResourcePlatformRegistryMetadata;
  readonly metadataOnly: true;
  readonly immutable: true;
}>;

export type ExecutiveResourceRegistryMetadata = Readonly<{
  readonly registryVersion: "1.0.0";
  readonly registryNamespace: "nexora.bus.executive-resource.registry";
  readonly registryStatus: ExecutiveResourceRegistryStatus;
  readonly registryDescription: string;
  readonly registryDependencies: readonly string[];
  readonly registryConsumers: readonly string[];
  readonly registryCompatibility: readonly string[];
  readonly registryMetadata: ExecutiveResourceMetadata;
  readonly metadataOnly: true;
  readonly immutable: true;
}>;

export type ExecutiveResourceRegistry = Readonly<{
  readonly registryId: "executive-resource-registry";
  readonly resources: readonly ExecutiveResource[];
  readonly metadata: ExecutiveResourceRegistryMetadata;
  readonly metadataOnly: true;
  readonly immutable: true;
}>;

export type ExecutiveResourceCategoryEntry = Readonly<{
  readonly categoryId: `resource-category-${string}`;
  readonly categoryName: ExecutiveResourceCategory;
  readonly categoryDescription: string;
  readonly metadata: ExecutiveResourceMetadata;
  readonly metadataOnly: true;
  readonly immutable: true;
}>;

export type ExecutiveResourceCategoryRegistry = Readonly<{
  readonly registryId: "executive-resource-category-registry";
  readonly categories: readonly ExecutiveResourceCategoryEntry[];
  readonly metadata: ExecutiveResourceRegistryMetadata;
  readonly metadataOnly: true;
  readonly immutable: true;
}>;

export type ExecutiveResourceTypeRegistry = Readonly<{
  readonly registryId: "executive-resource-type-registry";
  readonly types: readonly ExecutiveResourceType[];
  readonly metadata: ExecutiveResourceRegistryMetadata;
  readonly metadataOnly: true;
  readonly immutable: true;
}>;

export type ExecutiveResourceOwnerRegistry = Readonly<{
  readonly registryId: "executive-resource-owner-registry";
  readonly owners: readonly ExecutiveResourceOwner[];
  readonly metadata: ExecutiveResourceRegistryMetadata;
  readonly metadataOnly: true;
  readonly immutable: true;
}>;

export type ExecutiveResourceAllocationRegistry = Readonly<{
  readonly registryId: "executive-resource-allocation-registry";
  readonly allocations: readonly ExecutiveResourceAllocation[];
  readonly metadata: ExecutiveResourceRegistryMetadata;
  readonly metadataOnly: true;
  readonly immutable: true;
}>;

export type ExecutiveResourceCapacityRegistry = Readonly<{
  readonly registryId: "executive-resource-capacity-registry";
  readonly capacities: readonly ExecutiveResourceCapacity[];
  readonly metadata: ExecutiveResourceRegistryMetadata;
  readonly metadataOnly: true;
  readonly immutable: true;
}>;

export type ExecutiveResourceUtilizationRegistry = Readonly<{
  readonly registryId: "executive-resource-utilization-registry";
  readonly utilizations: readonly ExecutiveResourceUtilization[];
  readonly metadata: ExecutiveResourceRegistryMetadata;
  readonly metadataOnly: true;
  readonly immutable: true;
}>;

export type ExecutiveResourceAvailabilityRegistry = Readonly<{
  readonly registryId: "executive-resource-availability-registry";
  readonly availabilityEntries: readonly ExecutiveResourceAvailability[];
  readonly metadata: ExecutiveResourceRegistryMetadata;
  readonly metadataOnly: true;
  readonly immutable: true;
}>;

export type ExecutiveResourceConstraintRegistry = Readonly<{
  readonly registryId: "executive-resource-constraint-registry";
  readonly constraints: readonly ExecutiveResourceConstraint[];
  readonly metadata: ExecutiveResourceRegistryMetadata;
  readonly metadataOnly: true;
  readonly immutable: true;
}>;

export type ExecutiveResourceLifecycleRegistry = Readonly<{
  readonly registryId: "executive-resource-lifecycle-registry";
  readonly lifecycleEntries: readonly ExecutiveResourceLifecycle[];
  readonly metadata: ExecutiveResourceRegistryMetadata;
  readonly metadataOnly: true;
  readonly immutable: true;
}>;

export type ExecutiveResourceClassificationRegistry = Readonly<{
  readonly registryId: "executive-resource-classification-registry";
  readonly classifications: readonly ExecutiveResourceClassification[];
  readonly metadata: ExecutiveResourceRegistryMetadata;
  readonly metadataOnly: true;
  readonly immutable: true;
}>;

export type ExecutiveResourceRegistryValidationSummary = Readonly<{
  readonly resourceCount: number;
  readonly categoryCount: number;
  readonly typeCount: number;
  readonly ownerCount: number;
  readonly allocationCount: number;
  readonly capacityCount: number;
  readonly utilizationCount: number;
  readonly availabilityCount: number;
  readonly constraintCount: number;
  readonly lifecycleCount: number;
  readonly classificationCount: number;
  readonly metadataOnly: true;
  readonly immutable: true;
}>;

export type ExecutiveResourceRegistryValidation = Readonly<{
  readonly validationStatus: "PASS" | "FAIL";
  readonly validationSummary: ExecutiveResourceRegistryValidationSummary;
  readonly metadata: ExecutiveResourceMetadata;
  readonly metadataOnly: true;
  readonly immutable: true;
}>;

export type ExecutiveResourceRegistryBundle = Readonly<{
  readonly platformRegistry: ExecutiveResourcePlatformRegistry;
  readonly resourceRegistry: ExecutiveResourceRegistry;
  readonly categoryRegistry: ExecutiveResourceCategoryRegistry;
  readonly typeRegistry: ExecutiveResourceTypeRegistry;
  readonly ownerRegistry: ExecutiveResourceOwnerRegistry;
  readonly allocationRegistry: ExecutiveResourceAllocationRegistry;
  readonly capacityRegistry: ExecutiveResourceCapacityRegistry;
  readonly utilizationRegistry: ExecutiveResourceUtilizationRegistry;
  readonly availabilityRegistry: ExecutiveResourceAvailabilityRegistry;
  readonly constraintRegistry: ExecutiveResourceConstraintRegistry;
  readonly lifecycleRegistry: ExecutiveResourceLifecycleRegistry;
  readonly classificationRegistry: ExecutiveResourceClassificationRegistry;
  readonly validationRegistry: ExecutiveResourceRegistryValidation;
  readonly publicApis: readonly string[];
  readonly metadataOnly: true;
  readonly immutable: true;
}>;

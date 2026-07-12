import type {
  ExecutiveResourceCategory,
  ExecutiveResourceMetadata,
  ExecutiveResourcePlatformDescription,
  ExecutiveResourcePlatformId,
  ExecutiveResourcePlatformName,
  ExecutiveResourcePlatformNamespace,
  ExecutiveResourcePlatformVersion,
  ExecutiveResourceStatus,
} from "./executiveResourceIndex.ts";
import type {
  ExecutiveResourceCategoryEntry,
  ExecutiveResourceRegistryStatus,
} from "./executiveResourceRegistryIndex.ts";

export type ExecutiveResourceModelStatus = ExecutiveResourceRegistryStatus;

export type ExecutiveResourcePlatformModelMetadata = Readonly<{
  readonly modelLayer: "BUS-31:3";
  readonly createdBy: "BUS-31:3";
  readonly metadataOnly: true;
  readonly immutable: true;
}>;

export type ExecutiveResourcePlatformModel = Readonly<{
  readonly platformId: ExecutiveResourcePlatformId;
  readonly platformName: ExecutiveResourcePlatformName;
  readonly platformNamespace: ExecutiveResourcePlatformNamespace;
  readonly platformVersion: ExecutiveResourcePlatformVersion;
  readonly platformStatus: ExecutiveResourceModelStatus;
  readonly platformDescription: ExecutiveResourcePlatformDescription;
  readonly platformMetadata: ExecutiveResourcePlatformModelMetadata;
  readonly metadataOnly: true;
  readonly immutable: true;
}>;

export type ExecutiveResourceModel = Readonly<{
  readonly modelId: "executive-resource-model";
  readonly resourceId: `executive-resource-${string}`;
  readonly resourceCode: `RESOURCE-${string}`;
  readonly resourceName: string;
  readonly resourceCategory: ExecutiveResourceCategory;
  readonly resourceType: string;
  readonly resourceStatus: ExecutiveResourceStatus;
  readonly resourceMetadata: ExecutiveResourceMetadata;
  readonly metadataOnly: true;
  readonly immutable: true;
}>;

export type ExecutiveResourceCategoryModel = Readonly<{
  readonly categoryId: ExecutiveResourceCategoryEntry["categoryId"];
  readonly categoryName: ExecutiveResourceCategoryEntry["categoryName"];
  readonly categoryDescription: string;
  readonly metadata: ExecutiveResourceMetadata;
  readonly metadataOnly: true;
  readonly immutable: true;
}>;

export type ExecutiveResourceTypeModel = Readonly<{
  readonly typeId: `resource-type-${string}`;
  readonly typeCode: `RESOURCE-TYPE-${string}`;
  readonly typeName: string;
  readonly typeDescription: string;
  readonly metadata: ExecutiveResourceMetadata;
  readonly metadataOnly: true;
  readonly immutable: true;
}>;

export type ExecutiveResourceOwnerModel = Readonly<{
  readonly ownerId: `resource-owner-${string}`;
  readonly ownerType: string;
  readonly ownerReference: string;
  readonly ownerName: string;
  readonly metadata: ExecutiveResourceMetadata;
  readonly metadataOnly: true;
  readonly immutable: true;
}>;

export type ExecutiveResourceAllocationModel = Readonly<{
  readonly allocationId: `resource-allocation-${string}`;
  readonly resourceId: `executive-resource-${string}`;
  readonly allocationType: string;
  readonly allocationStatus: string;
  readonly allocationScope: string;
  readonly metadata: ExecutiveResourceMetadata;
  readonly metadataOnly: true;
  readonly immutable: true;
}>;

export type ExecutiveResourceCapacityModel = Readonly<{
  readonly capacityId: `resource-capacity-${string}`;
  readonly resourceId: `executive-resource-${string}`;
  readonly capacityType: string;
  readonly capacityStatus: string;
  readonly metadata: ExecutiveResourceMetadata;
  readonly metadataOnly: true;
  readonly immutable: true;
}>;

export type ExecutiveResourceUtilizationModel = Readonly<{
  readonly utilizationId: `resource-utilization-${string}`;
  readonly resourceId: `executive-resource-${string}`;
  readonly utilizationCategory: string;
  readonly utilizationStatus: string;
  readonly metadata: ExecutiveResourceMetadata;
  readonly metadataOnly: true;
  readonly immutable: true;
}>;

export type ExecutiveResourceAvailabilityModel = Readonly<{
  readonly availabilityId: `resource-availability-${string}`;
  readonly resourceId: `executive-resource-${string}`;
  readonly availabilityStatus: string;
  readonly availabilityCategory: string;
  readonly metadata: ExecutiveResourceMetadata;
  readonly metadataOnly: true;
  readonly immutable: true;
}>;

export type ExecutiveResourceConstraintModel = Readonly<{
  readonly constraintId: `resource-constraint-${string}`;
  readonly constraintName: string;
  readonly constraintCategory: string;
  readonly constraintSeverity: string;
  readonly metadata: ExecutiveResourceMetadata;
  readonly metadataOnly: true;
  readonly immutable: true;
}>;

export type ExecutiveResourceLifecycleModel = Readonly<{
  readonly lifecycleId: `resource-lifecycle-${string}`;
  readonly lifecycleStage: string;
  readonly lifecycleStatus: string;
  readonly metadata: ExecutiveResourceMetadata;
  readonly metadataOnly: true;
  readonly immutable: true;
}>;

export type ExecutiveResourceClassificationModel = Readonly<{
  readonly classificationId: `resource-classification-${string}`;
  readonly classificationName: string;
  readonly classificationLevel: string;
  readonly metadata: ExecutiveResourceMetadata;
  readonly metadataOnly: true;
  readonly immutable: true;
}>;

export type ExecutiveResourceModelMetadata = Readonly<{
  readonly modelId: "executive-resource-model-foundation";
  readonly modelVersion: "1.0.0";
  readonly modelNamespace: "nexora.bus.executive-resource.model";
  readonly modelStatus: ExecutiveResourceModelStatus;
  readonly modelDescription: string;
  readonly modelDependencies: readonly string[];
  readonly modelConsumers: readonly string[];
  readonly modelCompatibility: readonly string[];
  readonly modelMetadata: ExecutiveResourceMetadata;
  readonly metadataOnly: true;
  readonly immutable: true;
}>;

export type ExecutiveResourceModelBundle = Readonly<{
  readonly platform: ExecutiveResourcePlatformModel;
  readonly resources: readonly ExecutiveResourceModel[];
  readonly categories: readonly ExecutiveResourceCategoryModel[];
  readonly types: readonly ExecutiveResourceTypeModel[];
  readonly owners: readonly ExecutiveResourceOwnerModel[];
  readonly allocations: readonly ExecutiveResourceAllocationModel[];
  readonly capacity: readonly ExecutiveResourceCapacityModel[];
  readonly utilization: readonly ExecutiveResourceUtilizationModel[];
  readonly availability: readonly ExecutiveResourceAvailabilityModel[];
  readonly constraints: readonly ExecutiveResourceConstraintModel[];
  readonly lifecycle: readonly ExecutiveResourceLifecycleModel[];
  readonly classifications: readonly ExecutiveResourceClassificationModel[];
  readonly metadata: ExecutiveResourceModelMetadata;
  readonly metadataOnly: true;
  readonly immutable: true;
}>;

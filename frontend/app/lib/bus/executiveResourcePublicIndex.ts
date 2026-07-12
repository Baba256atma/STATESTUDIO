export {
  EXECUTIVE_RESOURCE,
  EXECUTIVE_RESOURCE_ALLOCATION,
  EXECUTIVE_RESOURCE_ALLOCATION_TYPES,
  EXECUTIVE_RESOURCE_AVAILABILITY,
  EXECUTIVE_RESOURCE_AVAILABILITY_CATEGORIES,
  EXECUTIVE_RESOURCE_AVAILABILITY_STATUSES,
  EXECUTIVE_RESOURCE_CAPACITY,
  EXECUTIVE_RESOURCE_CAPACITY_STATUSES,
  EXECUTIVE_RESOURCE_CAPACITY_TYPES,
  EXECUTIVE_RESOURCE_CATEGORIES,
  EXECUTIVE_RESOURCE_CLASSIFICATION,
  EXECUTIVE_RESOURCE_CLASSIFICATION_LEVELS,
  EXECUTIVE_RESOURCE_CONSTRAINT,
  EXECUTIVE_RESOURCE_CONSTRAINT_CATEGORIES,
  EXECUTIVE_RESOURCE_CONSTRAINT_SEVERITIES,
  EXECUTIVE_RESOURCE_CONTRACT_REGISTRY,
  EXECUTIVE_RESOURCE_LIFECYCLE,
  EXECUTIVE_RESOURCE_LIFECYCLE_STATUSES,
  EXECUTIVE_RESOURCE_LIFECYCLE_STAGES,
  EXECUTIVE_RESOURCE_OWNER,
  EXECUTIVE_RESOURCE_OWNER_TYPES,
  EXECUTIVE_RESOURCE_PLATFORM,
  EXECUTIVE_RESOURCE_PLATFORM_DESCRIPTION,
  EXECUTIVE_RESOURCE_PLATFORM_ID,
  EXECUTIVE_RESOURCE_PLATFORM_NAME,
  EXECUTIVE_RESOURCE_PLATFORM_NAMESPACE,
  EXECUTIVE_RESOURCE_PLATFORM_STATUS,
  EXECUTIVE_RESOURCE_PLATFORM_VERSION,
  EXECUTIVE_RESOURCE_PUBLIC_APIS,
  EXECUTIVE_RESOURCE_STATUSES,
  EXECUTIVE_RESOURCE_TYPE,
  EXECUTIVE_RESOURCE_UTILIZATION,
  EXECUTIVE_RESOURCE_UTILIZATION_CATEGORIES,
  EXECUTIVE_RESOURCE_UTILIZATION_STATUSES,
  ExecutiveResourceContractFoundation,
  ExecutiveResourceContractTypes,
  ExecutiveResourceContracts,
  ExecutiveResourcePublicFoundation as ExecutiveResourceContractPublicFoundation,
  EXECUTIVE_RESOURCE_VALIDATION_RESULT as EXECUTIVE_RESOURCE_CONTRACT_VALIDATION_RESULT,
} from "./executiveResourceIndex.ts";
export type {
  ExecutiveResourceAllocation,
  ExecutiveResourceAllocationId,
  ExecutiveResourceAllocationScope,
  ExecutiveResourceAllocationStatus,
  ExecutiveResourceAllocationType,
  ExecutiveResourceAvailability,
  ExecutiveResourceAvailabilityCategory,
  ExecutiveResourceAvailabilityId,
  ExecutiveResourceAvailabilityStatus,
  ExecutiveResourceCapacity,
  ExecutiveResourceCapacityId,
  ExecutiveResourceCapacityStatus,
  ExecutiveResourceCapacityType,
  ExecutiveResourceCategory,
  ExecutiveResourceClassification,
  ExecutiveResourceClassificationId,
  ExecutiveResourceClassificationLevel,
  ExecutiveResourceCode,
  ExecutiveResourceConstraint,
  ExecutiveResourceConstraintCategory,
  ExecutiveResourceConstraintId,
  ExecutiveResourceConstraintSeverity,
  ExecutiveResourceContractRegistry,
  ExecutiveResourceId,
  ExecutiveResourceLifecycle,
  ExecutiveResourceLifecycleId,
  ExecutiveResourceLifecycleStage,
  ExecutiveResourceLifecycleStatus,
  ExecutiveResourceMetadata,
  ExecutiveResourceOwner,
  ExecutiveResourceOwnerId,
  ExecutiveResourceOwnerType,
  ExecutiveResourcePlatformDescription,
  ExecutiveResourcePlatformId,
  ExecutiveResourcePlatformName,
  ExecutiveResourcePlatformNamespace,
  ExecutiveResourcePlatformVersion,
  ExecutiveResourceStatus,
  ExecutiveResourceType,
  ExecutiveResourceTypeCode,
  ExecutiveResourceTypeId,
  ExecutiveResourceUtilization,
  ExecutiveResourceUtilizationCategory,
  ExecutiveResourceUtilizationId,
  ExecutiveResourceUtilizationStatus,
  ResourceValidationError,
  ResourceValidationResult,
  ResourceValidationSummary,
  ResourceValidationWarning,
  ExecutiveResourcePlatform as ExecutiveResourceContractPlatform,
  ExecutiveResourcePlatformStatus as ExecutiveResourceContractPlatformStatus,
  ExecutiveResourceValidationSeverity as ExecutiveResourceContractValidationSeverity,
} from "./executiveResourceTypes.ts";
export * from "./executiveResourceRegistryIndex.ts";
export * from "./executiveResourceModelIndex.ts";
export * from "./executiveResourceValidationIndex.ts";
export * from "./executiveResourceManifestIndex.ts";
export * from "./executiveResourcePlatformIndex.ts";
export * from "./executiveResourceCertificationIndex.ts";
export * from "./executiveResourcePlatformFreezeIndex.ts";

import * as contracts from "./executiveResourceIndex.ts";
import * as registry from "./executiveResourceRegistryIndex.ts";
import * as model from "./executiveResourceModelIndex.ts";
import * as validation from "./executiveResourceValidationIndex.ts";
import * as manifest from "./executiveResourceManifestIndex.ts";
import * as platform from "./executiveResourcePlatformIndex.ts";
import * as certification from "./executiveResourceCertificationIndex.ts";
import * as freeze from "./executiveResourcePlatformFreezeIndex.ts";
import {
  EXECUTIVE_RESOURCE_PLATFORM_ID,
  EXECUTIVE_RESOURCE_PLATFORM_NAME,
  EXECUTIVE_RESOURCE_PLATFORM_NAMESPACE,
  EXECUTIVE_RESOURCE_PLATFORM_VERSION,
} from "./executiveResourceIndex.ts";
import {
  EXECUTIVE_RESOURCE_CERTIFICATION_STATUS,
} from "./executiveResourceCertificationIndex.ts";
import {
  EXECUTIVE_RESOURCE_FREEZE_STATUS,
  EXECUTIVE_RESOURCE_RELEASE_STATUS,
} from "./executiveResourcePlatformFreezeIndex.ts";

export const EXECUTIVE_RESOURCE_PUBLIC_API_ID =
  "executive-resource-public-api-registry" as const;

export const EXECUTIVE_RESOURCE_PUBLIC_API_VERSION = "1.0.0" as const;

export const EXECUTIVE_RESOURCE_PUBLIC_API_NAMESPACE =
  "nexora.bus.executive-resource.public-index" as const;

export const EXECUTIVE_RESOURCE_PUBLIC_API_STATUS = "PUBLIC" as const;

export type ExecutiveResourcePublicApiRegistry = Readonly<{
  readonly publicApiId: typeof EXECUTIVE_RESOURCE_PUBLIC_API_ID;
  readonly publicApiVersion: typeof EXECUTIVE_RESOURCE_PUBLIC_API_VERSION;
  readonly publicApiNamespace: typeof EXECUTIVE_RESOURCE_PUBLIC_API_NAMESPACE;
  readonly publicApiStatus: typeof EXECUTIVE_RESOURCE_PUBLIC_API_STATUS;
  readonly exportedPhases: readonly [
    "BUS-31:1",
    "BUS-31:2",
    "BUS-31:3",
    "BUS-31:4",
    "BUS-31:5",
    "BUS-31:6",
    "BUS-31:7",
    "BUS-31:8",
  ];
  readonly exportedNamespaces: readonly [
    "executiveResourceIndex",
    "executiveResourceRegistryIndex",
    "executiveResourceModelIndex",
    "executiveResourceValidationIndex",
    "executiveResourceManifestIndex",
    "executiveResourcePlatformIndex",
    "executiveResourceCertificationIndex",
    "executiveResourcePlatformFreezeIndex",
  ];
  readonly compatibility: readonly string[];
  readonly metadata: Readonly<{
    readonly description: string;
    readonly createdBy: "BUS-31:9";
    readonly metadataOnly: true;
    readonly immutable: true;
  }>;
  readonly metadataOnly: true;
  readonly immutable: true;
}>;

export const EXECUTIVE_RESOURCE_INTELLIGENCE_PUBLIC_METADATA = Object.freeze({
  platformId: EXECUTIVE_RESOURCE_PLATFORM_ID,
  platformName: EXECUTIVE_RESOURCE_PLATFORM_NAME,
  platformNamespace: EXECUTIVE_RESOURCE_PLATFORM_NAMESPACE,
  platformVersion: EXECUTIVE_RESOURCE_PLATFORM_VERSION,
  platformStatus: "Published",
  releaseStatus: EXECUTIVE_RESOURCE_RELEASE_STATUS,
  certificationStatus: EXECUTIVE_RESOURCE_CERTIFICATION_STATUS,
  freezeStatus: EXECUTIVE_RESOURCE_FREEZE_STATUS,
  publicApiStatus: EXECUTIVE_RESOURCE_PUBLIC_API_STATUS,
  metadata: Object.freeze({
    description:
      "Final canonical public export surface for the Executive Resource Intelligence Platform.",
    createdBy: "BUS-31:9",
    metadataOnly: true,
    immutable: true,
  }),
  metadataOnly: true,
  immutable: true,
} as const);

export const EXECUTIVE_RESOURCE_PUBLIC_API_REGISTRY: ExecutiveResourcePublicApiRegistry =
  Object.freeze({
    publicApiId: EXECUTIVE_RESOURCE_PUBLIC_API_ID,
    publicApiVersion: EXECUTIVE_RESOURCE_PUBLIC_API_VERSION,
    publicApiNamespace: EXECUTIVE_RESOURCE_PUBLIC_API_NAMESPACE,
    publicApiStatus: EXECUTIVE_RESOURCE_PUBLIC_API_STATUS,
    exportedPhases: Object.freeze([
      "BUS-31:1",
      "BUS-31:2",
      "BUS-31:3",
      "BUS-31:4",
      "BUS-31:5",
      "BUS-31:6",
      "BUS-31:7",
      "BUS-31:8",
    ] as const),
    exportedNamespaces: Object.freeze([
      "executiveResourceIndex",
      "executiveResourceRegistryIndex",
      "executiveResourceModelIndex",
      "executiveResourceValidationIndex",
      "executiveResourceManifestIndex",
      "executiveResourcePlatformIndex",
      "executiveResourceCertificationIndex",
      "executiveResourcePlatformFreezeIndex",
    ] as const),
    compatibility: Object.freeze([
      "metadata-only",
      "public-api-only",
      "deterministic",
      "immutable",
      `platform:${EXECUTIVE_RESOURCE_PLATFORM_NAMESPACE}`,
    ]),
    metadata: Object.freeze({
      description: "Final public API registry for Executive Resource Intelligence.",
      createdBy: "BUS-31:9",
      metadataOnly: true,
      immutable: true,
    }),
    metadataOnly: true,
    immutable: true,
  });

export const ExecutiveResourcePublicFoundation = Object.freeze({
  platform: Object.freeze({ ...platform }),
  registry: Object.freeze({ ...registry }),
  model: Object.freeze({ ...model }),
  validation: Object.freeze({ ...validation }),
  manifest: Object.freeze({ ...manifest }),
  certification: Object.freeze({ ...certification }),
  freeze: Object.freeze({ ...freeze }),
  publicApi: EXECUTIVE_RESOURCE_PUBLIC_API_REGISTRY,
  metadata: EXECUTIVE_RESOURCE_INTELLIGENCE_PUBLIC_METADATA,
  metadataOnly: true,
  immutable: true,
});

export const ExecutiveResourceIntelligencePlatform = Object.freeze({
  contracts: Object.freeze({ ...contracts }),
  registry: Object.freeze({ ...registry }),
  model: Object.freeze({ ...model }),
  validation: Object.freeze({ ...validation }),
  manifest: Object.freeze({ ...manifest }),
  platform: Object.freeze({ ...platform }),
  certification: Object.freeze({ ...certification }),
  freeze: Object.freeze({ ...freeze }),
  metadata: EXECUTIVE_RESOURCE_INTELLIGENCE_PUBLIC_METADATA,
  publicApiRegistry: EXECUTIVE_RESOURCE_PUBLIC_API_REGISTRY,
  metadataOnly: true,
  immutable: true,
});

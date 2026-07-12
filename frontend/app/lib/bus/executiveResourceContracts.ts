import type {
  ExecutiveResource,
  ExecutiveResourceAllocation,
  ExecutiveResourceAllocationType,
  ExecutiveResourceAvailability,
  ExecutiveResourceAvailabilityCategory,
  ExecutiveResourceAvailabilityStatus,
  ExecutiveResourceCapacity,
  ExecutiveResourceCapacityStatus,
  ExecutiveResourceCapacityType,
  ExecutiveResourceCategory,
  ExecutiveResourceClassification,
  ExecutiveResourceClassificationLevel,
  ExecutiveResourceConstraint,
  ExecutiveResourceConstraintCategory,
  ExecutiveResourceConstraintSeverity,
  ExecutiveResourceContractRegistry,
  ExecutiveResourceLifecycle,
  ExecutiveResourceLifecycleStage,
  ExecutiveResourceLifecycleStatus,
  ExecutiveResourceMetadata,
  ExecutiveResourceOwner,
  ExecutiveResourceOwnerType,
  ExecutiveResourcePlatform,
  ExecutiveResourcePlatformDescription,
  ExecutiveResourcePlatformId,
  ExecutiveResourcePlatformName,
  ExecutiveResourcePlatformNamespace,
  ExecutiveResourcePlatformStatus,
  ExecutiveResourcePlatformVersion,
  ExecutiveResourceStatus,
  ExecutiveResourceType,
  ExecutiveResourceUtilization,
  ExecutiveResourceUtilizationCategory,
  ExecutiveResourceUtilizationStatus,
  ResourceValidationResult,
} from "./executiveResourceTypes.ts";

export const EXECUTIVE_RESOURCE_PLATFORM_ID: ExecutiveResourcePlatformId = "BUS-31";

export const EXECUTIVE_RESOURCE_PLATFORM_NAME: ExecutiveResourcePlatformName =
  "Executive Resource Intelligence Platform";

export const EXECUTIVE_RESOURCE_PLATFORM_NAMESPACE: ExecutiveResourcePlatformNamespace =
  "nexora.bus.executive-resource";

export const EXECUTIVE_RESOURCE_PLATFORM_VERSION: ExecutiveResourcePlatformVersion = "1.0.0";

export const EXECUTIVE_RESOURCE_PLATFORM_DESCRIPTION: ExecutiveResourcePlatformDescription =
  "Canonical metadata-only contract foundation for executive resource intelligence.";

export const EXECUTIVE_RESOURCE_PLATFORM_STATUS: ExecutiveResourcePlatformStatus = "Foundation";

const defaultMetadata = (): ExecutiveResourceMetadata =>
  Object.freeze({
    version: EXECUTIVE_RESOURCE_PLATFORM_VERSION,
    tags: Object.freeze(["resource", "metadata-only"]),
    labels: Object.freeze(["bus-31", "foundation"]),
    metadataOnly: true,
    immutable: true,
  });

export const EXECUTIVE_RESOURCE_CATEGORIES: readonly ExecutiveResourceCategory[] = Object.freeze([
  "Human",
  "Financial",
  "Physical",
  "Digital",
  "Technology",
  "Equipment",
  "Facility",
  "Inventory",
  "Information",
  "Knowledge",
  "Time",
  "Capacity",
  "Service",
  "Vendor",
  "Partner",
  "Other",
] as const);

export const EXECUTIVE_RESOURCE_STATUSES: readonly ExecutiveResourceStatus[] = Object.freeze([
  "Draft",
  "Active",
  "Reserved",
  "Archived",
] as const);

export const EXECUTIVE_RESOURCE_OWNER_TYPES: readonly ExecutiveResourceOwnerType[] = Object.freeze([
  "Organization",
  "BusinessUnit",
  "Division",
  "Department",
  "Team",
  "Position",
  "Executive",
  "Project",
  "Portfolio",
] as const);

export const EXECUTIVE_RESOURCE_ALLOCATION_TYPES: readonly ExecutiveResourceAllocationType[] =
  Object.freeze([
    "Dedicated",
    "Shared",
    "Reserved",
    "Temporary",
    "Strategic",
    "Operational",
    "Emergency",
  ] as const);

export const EXECUTIVE_RESOURCE_CAPACITY_TYPES: readonly ExecutiveResourceCapacityType[] =
  Object.freeze([
    "Throughput",
    "Volume",
    "Headcount",
    "Budget",
    "Time",
  ] as const);

export const EXECUTIVE_RESOURCE_CAPACITY_STATUSES: readonly ExecutiveResourceCapacityStatus[] =
  Object.freeze([
    "Available",
    "Constrained",
    "Reserved",
    "Retired",
  ] as const);

export const EXECUTIVE_RESOURCE_UTILIZATION_CATEGORIES: readonly ExecutiveResourceUtilizationCategory[] =
  Object.freeze([
    "Planned",
    "Allocated",
    "Consumed",
    "Idle",
  ] as const);

export const EXECUTIVE_RESOURCE_UTILIZATION_STATUSES: readonly ExecutiveResourceUtilizationStatus[] =
  Object.freeze([
    "OnTrack",
    "AtRisk",
    "Exceeded",
    "Idle",
  ] as const);

export const EXECUTIVE_RESOURCE_AVAILABILITY_STATUSES: readonly ExecutiveResourceAvailabilityStatus[] =
  Object.freeze([
    "Available",
    "Limited",
    "Unavailable",
    "Reserved",
  ] as const);

export const EXECUTIVE_RESOURCE_AVAILABILITY_CATEGORIES: readonly ExecutiveResourceAvailabilityCategory[] =
  Object.freeze([
    "Operational",
    "Strategic",
    "Maintenance",
    "Emergency",
  ] as const);

export const EXECUTIVE_RESOURCE_CONSTRAINT_CATEGORIES: readonly ExecutiveResourceConstraintCategory[] =
  Object.freeze([
    "Budget",
    "Capacity",
    "Compliance",
    "Schedule",
    "Dependency",
    "Policy",
  ] as const);

export const EXECUTIVE_RESOURCE_CONSTRAINT_SEVERITIES: readonly ExecutiveResourceConstraintSeverity[] =
  Object.freeze([
    "Low",
    "Medium",
    "High",
    "Critical",
  ] as const);

export const EXECUTIVE_RESOURCE_LIFECYCLE_STAGES: readonly ExecutiveResourceLifecycleStage[] =
  Object.freeze([
    "Planned",
    "Requested",
    "Available",
    "Allocated",
    "Active",
    "Reserved",
    "Maintenance",
    "Retired",
    "Archived",
  ] as const);

export const EXECUTIVE_RESOURCE_LIFECYCLE_STATUSES: readonly ExecutiveResourceLifecycleStatus[] =
  Object.freeze([
    "Pending",
    "Active",
    "Paused",
    "Closed",
  ] as const);

export const EXECUTIVE_RESOURCE_CLASSIFICATION_LEVELS: readonly ExecutiveResourceClassificationLevel[] =
  Object.freeze([
    "Core",
    "Strategic",
    "Operational",
    "Restricted",
  ] as const);

export const EXECUTIVE_RESOURCE_PLATFORM: ExecutiveResourcePlatform = Object.freeze({
  platformId: EXECUTIVE_RESOURCE_PLATFORM_ID,
  platformName: EXECUTIVE_RESOURCE_PLATFORM_NAME,
  platformNamespace: EXECUTIVE_RESOURCE_PLATFORM_NAMESPACE,
  platformVersion: EXECUTIVE_RESOURCE_PLATFORM_VERSION,
  platformDescription: EXECUTIVE_RESOURCE_PLATFORM_DESCRIPTION,
  platformStatus: EXECUTIVE_RESOURCE_PLATFORM_STATUS,
  platformMetadata: defaultMetadata(),
  metadataOnly: true,
  immutable: true,
});

export const EXECUTIVE_RESOURCE: ExecutiveResource = Object.freeze({
  resourceId: "executive-resource-enterprise-capacity",
  resourceCode: "RESOURCE-ENTERPRISE-CAPACITY",
  resourceName: "Enterprise Capacity Resource",
  resourceDescription: "Canonical executive resource metadata contract.",
  resourceCategory: "Capacity",
  resourceType: "Strategic Capacity",
  resourceStatus: "Active",
  resourceMetadata: defaultMetadata(),
  metadataOnly: true,
  immutable: true,
});

export const EXECUTIVE_RESOURCE_TYPE: ExecutiveResourceType = Object.freeze({
  typeId: "resource-type-strategic-capacity",
  typeCode: "RESOURCE-TYPE-STRATEGIC-CAPACITY",
  typeName: "Strategic Capacity",
  typeDescription: "Canonical executive resource type metadata contract.",
  metadata: defaultMetadata(),
  metadataOnly: true,
  immutable: true,
});

export const EXECUTIVE_RESOURCE_OWNER: ExecutiveResourceOwner = Object.freeze({
  ownerId: "resource-owner-enterprise-strategy",
  ownerType: "Executive",
  ownerReference: "executive-position-chief-executive-officer",
  ownerName: "Enterprise Strategy Office",
  metadata: defaultMetadata(),
  metadataOnly: true,
  immutable: true,
});

export const EXECUTIVE_RESOURCE_ALLOCATION: ExecutiveResourceAllocation = Object.freeze({
  allocationId: "resource-allocation-enterprise-strategy",
  resourceId: "executive-resource-enterprise-capacity",
  allocationType: "Strategic",
  allocationStatus: "Active",
  allocationScope: "Enterprise",
  metadata: defaultMetadata(),
  metadataOnly: true,
  immutable: true,
});

export const EXECUTIVE_RESOURCE_CAPACITY: ExecutiveResourceCapacity = Object.freeze({
  capacityId: "resource-capacity-enterprise-capacity",
  resourceId: "executive-resource-enterprise-capacity",
  capacityType: "Throughput",
  capacityStatus: "Available",
  metadata: defaultMetadata(),
  metadataOnly: true,
  immutable: true,
});

export const EXECUTIVE_RESOURCE_UTILIZATION: ExecutiveResourceUtilization = Object.freeze({
  utilizationId: "resource-utilization-enterprise-capacity",
  resourceId: "executive-resource-enterprise-capacity",
  utilizationCategory: "Allocated",
  utilizationStatus: "OnTrack",
  metadata: defaultMetadata(),
  metadataOnly: true,
  immutable: true,
});

export const EXECUTIVE_RESOURCE_AVAILABILITY: ExecutiveResourceAvailability = Object.freeze({
  availabilityId: "resource-availability-enterprise-capacity",
  resourceId: "executive-resource-enterprise-capacity",
  availabilityStatus: "Available",
  availabilityCategory: "Strategic",
  metadata: defaultMetadata(),
  metadataOnly: true,
  immutable: true,
});

export const EXECUTIVE_RESOURCE_CONSTRAINT: ExecutiveResourceConstraint = Object.freeze({
  constraintId: "resource-constraint-budget-ceiling",
  constraintName: "Budget Ceiling",
  constraintCategory: "Budget",
  constraintSeverity: "Medium",
  metadata: defaultMetadata(),
  metadataOnly: true,
  immutable: true,
});

export const EXECUTIVE_RESOURCE_LIFECYCLE: ExecutiveResourceLifecycle = Object.freeze({
  lifecycleId: "resource-lifecycle-enterprise-capacity",
  lifecycleStage: "Active",
  lifecycleStatus: "Active",
  metadata: defaultMetadata(),
  metadataOnly: true,
  immutable: true,
});

export const EXECUTIVE_RESOURCE_CLASSIFICATION: ExecutiveResourceClassification = Object.freeze({
  classificationId: "resource-classification-strategic-core",
  classificationName: "Strategic Core",
  classificationLevel: "Strategic",
  metadata: defaultMetadata(),
  metadataOnly: true,
  immutable: true,
});

export const EXECUTIVE_RESOURCE_VALIDATION_RESULT: ResourceValidationResult = Object.freeze({
  errors: Object.freeze([]),
  warnings: Object.freeze([]),
  summary: Object.freeze({
    valid: true,
    errorCount: 0,
    warningCount: 0,
    metadataOnly: true,
    immutable: true,
  }),
  metadataOnly: true,
  immutable: true,
});

export const EXECUTIVE_RESOURCE_PUBLIC_APIS = Object.freeze([
  "EXECUTIVE_RESOURCE_PLATFORM_ID",
  "EXECUTIVE_RESOURCE_PLATFORM_NAME",
  "EXECUTIVE_RESOURCE_PLATFORM_NAMESPACE",
  "EXECUTIVE_RESOURCE_PLATFORM_VERSION",
  "EXECUTIVE_RESOURCE_PLATFORM_DESCRIPTION",
  "EXECUTIVE_RESOURCE_CONTRACT_REGISTRY",
  "ExecutiveResourceContracts",
  "ExecutiveResourceContractTypes",
  "ExecutiveResourceContractFoundation",
] as const);

export const EXECUTIVE_RESOURCE_CONTRACT_REGISTRY: ExecutiveResourceContractRegistry = Object.freeze({
  platform: EXECUTIVE_RESOURCE_PLATFORM,
  contractVersion: "1.0.0",
  namespace: "nexora.bus.executive-resource",
  contractTypes: Object.freeze([
    "ExecutiveResource",
    "ExecutiveResourceType",
    "ExecutiveResourceOwner",
    "ExecutiveResourceAllocation",
    "ExecutiveResourceCapacity",
    "ExecutiveResourceUtilization",
    "ExecutiveResourceAvailability",
    "ExecutiveResourceConstraint",
    "ExecutiveResourceLifecycle",
    "ExecutiveResourceClassification",
    "ResourceValidationResult",
  ]),
  categories: EXECUTIVE_RESOURCE_CATEGORIES,
  ownerTypes: EXECUTIVE_RESOURCE_OWNER_TYPES,
  allocationTypes: EXECUTIVE_RESOURCE_ALLOCATION_TYPES,
  lifecycleStages: EXECUTIVE_RESOURCE_LIFECYCLE_STAGES,
  publicApis: EXECUTIVE_RESOURCE_PUBLIC_APIS,
  metadataOnly: true,
  immutable: true,
});

export const ExecutiveResourceContracts = Object.freeze({
  platformId: EXECUTIVE_RESOURCE_PLATFORM_ID,
  platformName: EXECUTIVE_RESOURCE_PLATFORM_NAME,
  platformNamespace: EXECUTIVE_RESOURCE_PLATFORM_NAMESPACE,
  platformVersion: EXECUTIVE_RESOURCE_PLATFORM_VERSION,
  platformDescription: EXECUTIVE_RESOURCE_PLATFORM_DESCRIPTION,
  platformStatus: EXECUTIVE_RESOURCE_PLATFORM_STATUS,
  metadataOnly: true,
  immutable: true,
});

export const ExecutiveResourceContractTypes = Object.freeze({
  resourceCategories: EXECUTIVE_RESOURCE_CATEGORIES,
  resourceStatuses: EXECUTIVE_RESOURCE_STATUSES,
  ownerTypes: EXECUTIVE_RESOURCE_OWNER_TYPES,
  allocationTypes: EXECUTIVE_RESOURCE_ALLOCATION_TYPES,
  capacityTypes: EXECUTIVE_RESOURCE_CAPACITY_TYPES,
  capacityStatuses: EXECUTIVE_RESOURCE_CAPACITY_STATUSES,
  utilizationCategories: EXECUTIVE_RESOURCE_UTILIZATION_CATEGORIES,
  utilizationStatuses: EXECUTIVE_RESOURCE_UTILIZATION_STATUSES,
  availabilityStatuses: EXECUTIVE_RESOURCE_AVAILABILITY_STATUSES,
  availabilityCategories: EXECUTIVE_RESOURCE_AVAILABILITY_CATEGORIES,
  constraintCategories: EXECUTIVE_RESOURCE_CONSTRAINT_CATEGORIES,
  constraintSeverities: EXECUTIVE_RESOURCE_CONSTRAINT_SEVERITIES,
  lifecycleStages: EXECUTIVE_RESOURCE_LIFECYCLE_STAGES,
  lifecycleStatuses: EXECUTIVE_RESOURCE_LIFECYCLE_STATUSES,
  classificationLevels: EXECUTIVE_RESOURCE_CLASSIFICATION_LEVELS,
  metadataOnly: true,
  immutable: true,
});

export const ExecutiveResourceContractFoundation = Object.freeze({
  contracts: ExecutiveResourceContracts,
  contractTypes: ExecutiveResourceContractTypes,
  contractRegistry: EXECUTIVE_RESOURCE_CONTRACT_REGISTRY,
  resource: EXECUTIVE_RESOURCE,
  resourceType: EXECUTIVE_RESOURCE_TYPE,
  resourceOwner: EXECUTIVE_RESOURCE_OWNER,
  resourceAllocation: EXECUTIVE_RESOURCE_ALLOCATION,
  resourceCapacity: EXECUTIVE_RESOURCE_CAPACITY,
  resourceUtilization: EXECUTIVE_RESOURCE_UTILIZATION,
  resourceAvailability: EXECUTIVE_RESOURCE_AVAILABILITY,
  resourceConstraint: EXECUTIVE_RESOURCE_CONSTRAINT,
  resourceLifecycle: EXECUTIVE_RESOURCE_LIFECYCLE,
  resourceClassification: EXECUTIVE_RESOURCE_CLASSIFICATION,
  validation: EXECUTIVE_RESOURCE_VALIDATION_RESULT,
  metadataOnly: true,
  immutable: true,
});

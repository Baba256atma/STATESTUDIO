export type ExecutiveResourcePlatformId = "BUS-31";

export type ExecutiveResourcePlatformVersion = "1.0.0";

export type ExecutiveResourcePlatformNamespace = "nexora.bus.executive-resource";

export type ExecutiveResourcePlatformName = "Executive Resource Intelligence Platform";

export type ExecutiveResourcePlatformDescription =
  "Canonical metadata-only contract foundation for executive resource intelligence.";

export type ExecutiveResourcePlatformStatus = "Foundation";

export type ExecutiveResourceCategory =
  | "Human"
  | "Financial"
  | "Physical"
  | "Digital"
  | "Technology"
  | "Equipment"
  | "Facility"
  | "Inventory"
  | "Information"
  | "Knowledge"
  | "Time"
  | "Capacity"
  | "Service"
  | "Vendor"
  | "Partner"
  | "Other";

export type ExecutiveResourceStatus = "Draft" | "Active" | "Reserved" | "Archived";

export type ExecutiveResourceOwnerType =
  | "Organization"
  | "BusinessUnit"
  | "Division"
  | "Department"
  | "Team"
  | "Position"
  | "Executive"
  | "Project"
  | "Portfolio";

export type ExecutiveResourceAllocationType =
  | "Dedicated"
  | "Shared"
  | "Reserved"
  | "Temporary"
  | "Strategic"
  | "Operational"
  | "Emergency";

export type ExecutiveResourceAllocationStatus =
  | "Planned"
  | "Allocated"
  | "Active"
  | "Released";

export type ExecutiveResourceAllocationScope =
  | "Enterprise"
  | "BusinessUnit"
  | "Program"
  | "Project"
  | "Operational";

export type ExecutiveResourceCapacityType =
  | "Throughput"
  | "Volume"
  | "Headcount"
  | "Budget"
  | "Time";

export type ExecutiveResourceCapacityStatus = "Available" | "Constrained" | "Reserved" | "Retired";

export type ExecutiveResourceUtilizationCategory =
  | "Planned"
  | "Allocated"
  | "Consumed"
  | "Idle";

export type ExecutiveResourceUtilizationStatus = "OnTrack" | "AtRisk" | "Exceeded" | "Idle";

export type ExecutiveResourceAvailabilityStatus =
  | "Available"
  | "Limited"
  | "Unavailable"
  | "Reserved";

export type ExecutiveResourceAvailabilityCategory =
  | "Operational"
  | "Strategic"
  | "Maintenance"
  | "Emergency";

export type ExecutiveResourceConstraintCategory =
  | "Budget"
  | "Capacity"
  | "Compliance"
  | "Schedule"
  | "Dependency"
  | "Policy";

export type ExecutiveResourceConstraintSeverity = "Low" | "Medium" | "High" | "Critical";

export type ExecutiveResourceLifecycleStage =
  | "Planned"
  | "Requested"
  | "Available"
  | "Allocated"
  | "Active"
  | "Reserved"
  | "Maintenance"
  | "Retired"
  | "Archived";

export type ExecutiveResourceLifecycleStatus = "Pending" | "Active" | "Paused" | "Closed";

export type ExecutiveResourceClassificationLevel =
  | "Core"
  | "Strategic"
  | "Operational"
  | "Restricted";

export type ExecutiveResourceValidationSeverity = "Error" | "Warning";

export type ExecutiveResourceId = `executive-resource-${string}`;

export type ExecutiveResourceCode = `RESOURCE-${string}`;

export type ExecutiveResourceTypeId = `resource-type-${string}`;

export type ExecutiveResourceTypeCode = `RESOURCE-TYPE-${string}`;

export type ExecutiveResourceOwnerId = `resource-owner-${string}`;

export type ExecutiveResourceAllocationId = `resource-allocation-${string}`;

export type ExecutiveResourceCapacityId = `resource-capacity-${string}`;

export type ExecutiveResourceUtilizationId = `resource-utilization-${string}`;

export type ExecutiveResourceAvailabilityId = `resource-availability-${string}`;

export type ExecutiveResourceConstraintId = `resource-constraint-${string}`;

export type ExecutiveResourceLifecycleId = `resource-lifecycle-${string}`;

export type ExecutiveResourceClassificationId = `resource-classification-${string}`;

export type ExecutiveResourceMetadata = Readonly<{
  readonly version: ExecutiveResourcePlatformVersion;
  readonly tags: readonly string[];
  readonly labels: readonly string[];
  readonly metadataOnly: true;
  readonly immutable: true;
}>;

export type ExecutiveResourcePlatform = Readonly<{
  readonly platformId: ExecutiveResourcePlatformId;
  readonly platformName: ExecutiveResourcePlatformName;
  readonly platformNamespace: ExecutiveResourcePlatformNamespace;
  readonly platformVersion: ExecutiveResourcePlatformVersion;
  readonly platformDescription: ExecutiveResourcePlatformDescription;
  readonly platformStatus: ExecutiveResourcePlatformStatus;
  readonly platformMetadata: ExecutiveResourceMetadata;
  readonly metadataOnly: true;
  readonly immutable: true;
}>;

export type ExecutiveResource = Readonly<{
  readonly resourceId: ExecutiveResourceId;
  readonly resourceCode: ExecutiveResourceCode;
  readonly resourceName: string;
  readonly resourceDescription: string;
  readonly resourceCategory: ExecutiveResourceCategory;
  readonly resourceType: string;
  readonly resourceStatus: ExecutiveResourceStatus;
  readonly resourceMetadata: ExecutiveResourceMetadata;
  readonly metadataOnly: true;
  readonly immutable: true;
}>;

export type ExecutiveResourceType = Readonly<{
  readonly typeId: ExecutiveResourceTypeId;
  readonly typeCode: ExecutiveResourceTypeCode;
  readonly typeName: string;
  readonly typeDescription: string;
  readonly metadata: ExecutiveResourceMetadata;
  readonly metadataOnly: true;
  readonly immutable: true;
}>;

export type ExecutiveResourceOwner = Readonly<{
  readonly ownerId: ExecutiveResourceOwnerId;
  readonly ownerType: ExecutiveResourceOwnerType;
  readonly ownerReference: string;
  readonly ownerName: string;
  readonly metadata: ExecutiveResourceMetadata;
  readonly metadataOnly: true;
  readonly immutable: true;
}>;

export type ExecutiveResourceAllocation = Readonly<{
  readonly allocationId: ExecutiveResourceAllocationId;
  readonly resourceId: ExecutiveResourceId;
  readonly allocationType: ExecutiveResourceAllocationType;
  readonly allocationStatus: ExecutiveResourceAllocationStatus;
  readonly allocationScope: ExecutiveResourceAllocationScope;
  readonly metadata: ExecutiveResourceMetadata;
  readonly metadataOnly: true;
  readonly immutable: true;
}>;

export type ExecutiveResourceCapacity = Readonly<{
  readonly capacityId: ExecutiveResourceCapacityId;
  readonly resourceId: ExecutiveResourceId;
  readonly capacityType: ExecutiveResourceCapacityType;
  readonly capacityStatus: ExecutiveResourceCapacityStatus;
  readonly metadata: ExecutiveResourceMetadata;
  readonly metadataOnly: true;
  readonly immutable: true;
}>;

export type ExecutiveResourceUtilization = Readonly<{
  readonly utilizationId: ExecutiveResourceUtilizationId;
  readonly resourceId: ExecutiveResourceId;
  readonly utilizationCategory: ExecutiveResourceUtilizationCategory;
  readonly utilizationStatus: ExecutiveResourceUtilizationStatus;
  readonly metadata: ExecutiveResourceMetadata;
  readonly metadataOnly: true;
  readonly immutable: true;
}>;

export type ExecutiveResourceAvailability = Readonly<{
  readonly availabilityId: ExecutiveResourceAvailabilityId;
  readonly resourceId: ExecutiveResourceId;
  readonly availabilityStatus: ExecutiveResourceAvailabilityStatus;
  readonly availabilityCategory: ExecutiveResourceAvailabilityCategory;
  readonly metadata: ExecutiveResourceMetadata;
  readonly metadataOnly: true;
  readonly immutable: true;
}>;

export type ExecutiveResourceConstraint = Readonly<{
  readonly constraintId: ExecutiveResourceConstraintId;
  readonly constraintName: string;
  readonly constraintCategory: ExecutiveResourceConstraintCategory;
  readonly constraintSeverity: ExecutiveResourceConstraintSeverity;
  readonly metadata: ExecutiveResourceMetadata;
  readonly metadataOnly: true;
  readonly immutable: true;
}>;

export type ExecutiveResourceLifecycle = Readonly<{
  readonly lifecycleId: ExecutiveResourceLifecycleId;
  readonly lifecycleStage: ExecutiveResourceLifecycleStage;
  readonly lifecycleStatus: ExecutiveResourceLifecycleStatus;
  readonly metadata: ExecutiveResourceMetadata;
  readonly metadataOnly: true;
  readonly immutable: true;
}>;

export type ExecutiveResourceClassification = Readonly<{
  readonly classificationId: ExecutiveResourceClassificationId;
  readonly classificationName: string;
  readonly classificationLevel: ExecutiveResourceClassificationLevel;
  readonly metadata: ExecutiveResourceMetadata;
  readonly metadataOnly: true;
  readonly immutable: true;
}>;

export type ResourceValidationError = Readonly<{
  readonly code: `resource-validation-error-${string}`;
  readonly message: string;
  readonly severity: "Error";
  readonly metadataOnly: true;
  readonly immutable: true;
}>;

export type ResourceValidationWarning = Readonly<{
  readonly code: `resource-validation-warning-${string}`;
  readonly message: string;
  readonly severity: "Warning";
  readonly metadataOnly: true;
  readonly immutable: true;
}>;

export type ResourceValidationSummary = Readonly<{
  readonly valid: boolean;
  readonly errorCount: number;
  readonly warningCount: number;
  readonly metadataOnly: true;
  readonly immutable: true;
}>;

export type ResourceValidationResult = Readonly<{
  readonly errors: readonly ResourceValidationError[];
  readonly warnings: readonly ResourceValidationWarning[];
  readonly summary: ResourceValidationSummary;
  readonly metadataOnly: true;
  readonly immutable: true;
}>;

export type ExecutiveResourceContractRegistry = Readonly<{
  readonly platform: ExecutiveResourcePlatform;
  readonly contractVersion: "1.0.0";
  readonly namespace: "nexora.bus.executive-resource";
  readonly contractTypes: readonly string[];
  readonly categories: readonly ExecutiveResourceCategory[];
  readonly ownerTypes: readonly ExecutiveResourceOwnerType[];
  readonly allocationTypes: readonly ExecutiveResourceAllocationType[];
  readonly lifecycleStages: readonly ExecutiveResourceLifecycleStage[];
  readonly publicApis: readonly string[];
  readonly metadataOnly: true;
  readonly immutable: true;
}>;

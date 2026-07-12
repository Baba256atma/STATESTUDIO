export type ResourceIdentity = string;

export type ResourceCategory =
  | "Human"
  | "Team"
  | "Department"
  | "AIAgent"
  | "Software"
  | "Hardware"
  | "Equipment"
  | "Vehicle"
  | "Budget"
  | "FinancialAccount"
  | "Facility"
  | "Workspace"
  | "License"
  | "Vendor"
  | "Service"
  | "CloudResource"
  | "Database"
  | "API"
  | "Time"
  | "Material"
  | "Inventory";

export interface ResourceCapability {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly category: ResourceCategory;
  readonly status: "Defined" | "Cataloged";
  readonly metadata: ResourceMetadata;
}

export interface ResourceOwnership {
  readonly ownerType: string;
  readonly ownerReference: string;
  readonly accountabilityMetadata: readonly string[];
}

export interface ResourceAvailability {
  readonly availabilityStatus: "Available" | "Reserved" | "Conditional";
  readonly availabilityWindowMetadata: readonly string[];
}

export interface ResourceCapacity {
  readonly capacityDescriptor: string;
  readonly unitOfMeasure: string;
  readonly planningMetadata: readonly string[];
}

export interface ResourceCost {
  readonly costCategory: string;
  readonly budgetingMetadata: readonly string[];
  readonly financialControlsMetadata: readonly string[];
}

export interface ResourceLocation {
  readonly locationType: string;
  readonly locationReference: string;
  readonly accessMetadata: readonly string[];
}

export interface ResourceSkill {
  readonly skillCategory: string;
  readonly skillDescriptors: readonly string[];
}

export interface ResourceClassification {
  readonly classificationType: string;
  readonly classificationLevel: string;
  readonly classificationMetadata: readonly string[];
}

export interface ResourceMetadata {
  readonly platformId: string;
  readonly platformVersion: string;
  readonly releaseStage: "Draft";
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministic: true;
  readonly sourceDependencies: readonly ["OPS-1:9", "OPS-2:9", "OPS-3:9", "OPS-4:9"];
  readonly tags: readonly string[];
}

export interface ResourceDescriptor {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly category: ResourceCategory;
  readonly ownership: ResourceOwnership;
  readonly availability: ResourceAvailability;
  readonly capacity: ResourceCapacity;
  readonly cost: ResourceCost;
  readonly location: ResourceLocation;
  readonly skill: ResourceSkill;
  readonly classification: ResourceClassification;
  readonly metadata: ResourceMetadata;
}

export interface PlatformMetadata {
  readonly platformId: string;
  readonly platformName: string;
  readonly platformNamespace: string;
  readonly platformVersion: string;
  readonly platformDescription: string;
  readonly platformArchitecturalLevel: string;
  readonly platformStatus: "Draft";
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministic: true;
}

export interface FoundationMetadata {
  readonly platformScope: string;
  readonly consumedPlatforms: readonly string[];
  readonly publicApiSurface: readonly string[];
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministic: true;
}

export interface ValidationMetadata {
  readonly totalChecks: number;
  readonly status: "PASS" | "FAIL";
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministic: true;
}

export interface ManifestMetadata {
  readonly compatibilityVersion: string;
  readonly dependencyCount: number;
  readonly publicApiCount: number;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministic: true;
}

export interface PublicApiMetadata {
  readonly name: string;
  readonly exportPath: string;
  readonly kind: "Type" | "Constant" | "Object" | "Function";
  readonly stability: "Stable";
  readonly description: string;
}


export type ExecutiveObjectiveCategory =
  | "Growth"
  | "Financial"
  | "Customer"
  | "Operational Excellence"
  | "Innovation"
  | "Transformation"
  | "People"
  | "Risk"
  | "Sustainability"
  | "Custom";

export type ExecutiveKeyResultCategory =
  | "Revenue"
  | "Cost"
  | "Efficiency"
  | "Quality"
  | "Delivery"
  | "Customer"
  | "Risk"
  | "Capability"
  | "Compliance"
  | "Custom";

export type ExecutiveOkrStrategicHorizon = "Quarterly" | "Annual" | "Multi-Year" | "Long-Term";

export type ExecutiveOkrLifecycleState = "Draft" | "Candidate" | "Approved" | "Active" | "Deprecated" | "Archived";

export type ExecutiveOkrMetadata = Readonly<{
  readonly metadataId: string;
  readonly metadataOnly: boolean;
  readonly immutable: boolean;
}>;

export type ExecutiveObjectiveOwner = Readonly<{
  readonly ownerId: string;
  readonly ownerName: string;
  readonly ownerRole: string;
  readonly metadataOnly: boolean;
}>;

export type ExecutiveKeyResultMeasurementMetadata = Readonly<{
  readonly measurementId: string;
  readonly measurementDescription: string;
  readonly valueFree: boolean;
  readonly metadataOnly: boolean;
}>;

export type ExecutiveObjective = Readonly<{
  readonly objectiveId: string;
  readonly objectiveName: string;
  readonly objectiveDescription: string;
  readonly objectiveCategory: ExecutiveObjectiveCategory;
  readonly businessDomain: string;
  readonly executiveOwner: ExecutiveObjectiveOwner;
  readonly strategicHorizon: ExecutiveOkrStrategicHorizon;
  readonly reviewCadence: string;
  readonly linkedKeyResultIds: readonly string[];
  readonly linkedKpiIds: readonly string[];
  readonly governanceReference: string;
  readonly lifecycleState: ExecutiveOkrLifecycleState;
  readonly metadata: ExecutiveOkrMetadata;
  readonly metadataOnly: boolean;
  readonly immutable: boolean;
}>;

export type ExecutiveKeyResult = Readonly<{
  readonly keyResultId: string;
  readonly keyResultName: string;
  readonly keyResultDescription: string;
  readonly keyResultCategory: ExecutiveKeyResultCategory;
  readonly parentObjectiveId: string;
  readonly linkedKpiIds: readonly string[];
  readonly measurementMetadata: ExecutiveKeyResultMeasurementMetadata;
  readonly targetReference: string;
  readonly businessDomain: string;
  readonly owner: ExecutiveObjectiveOwner;
  readonly reviewCadence: string;
  readonly governanceReference: string;
  readonly lifecycleState: ExecutiveOkrLifecycleState;
  readonly metadata: ExecutiveOkrMetadata;
  readonly metadataOnly: boolean;
  readonly immutable: boolean;
}>;

export type ExecutiveOkrDefinitionRegistry = Readonly<{
  readonly platformId: "BUS-14";
  readonly platformName: "Executive OKR Definition Platform";
  readonly version: "1.0.0";
  readonly foundationPlatformId: "BUS-13";
  readonly kpiFreezeDependency: "BUS-12";
  readonly objectives: readonly ExecutiveObjective[];
  readonly keyResults: readonly ExecutiveKeyResult[];
  readonly objectiveCategories: readonly ExecutiveObjectiveCategory[];
  readonly keyResultCategories: readonly ExecutiveKeyResultCategory[];
  readonly strategicHorizons: readonly ExecutiveOkrStrategicHorizon[];
  readonly lifecycleStates: readonly ExecutiveOkrLifecycleState[];
  readonly kpiLinkageIds: readonly string[];
  readonly publicApis: readonly string[];
  readonly metadataOnly: boolean;
  readonly immutable: boolean;
}>;

export type ExecutiveOkrDefinitionManifest = Readonly<{
  readonly platformId: "BUS-14";
  readonly platformName: "Executive OKR Definition Platform";
  readonly version: "1.0.0";
  readonly foundationPlatformId: "BUS-13";
  readonly kpiFreezeDependency: "BUS-12";
  readonly foundationAvailable: boolean;
  readonly kpiFreezeAvailable: boolean;
  readonly objectiveCount: number;
  readonly keyResultCount: number;
  readonly objectiveCategoryCount: number;
  readonly keyResultCategoryCount: number;
  readonly strategicHorizonCount: number;
  readonly lifecycleStateCount: number;
  readonly kpiLinkageCount: number;
  readonly publicApis: readonly string[];
  readonly certificationStatus: "Definition Platform Certified";
  readonly deterministicFingerprint: string;
}>;

export type ExecutiveOkrDefinitionValidation = Readonly<{
  readonly valid: boolean;
  readonly errors: readonly string[];
  readonly warnings: readonly string[];
}>;

export type ExecutiveOkrDefinitionPlatform = Readonly<{
  readonly registry: ExecutiveOkrDefinitionRegistry;
  readonly manifest: ExecutiveOkrDefinitionManifest;
  readonly validation: ExecutiveOkrDefinitionValidation;
}>;

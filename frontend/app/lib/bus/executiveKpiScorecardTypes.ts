export type ExecutiveKpiScorecardCategory =
  | "Executive"
  | "Corporate"
  | "Strategic"
  | "Operational"
  | "Financial"
  | "Risk"
  | "Project"
  | "Department"
  | "Portfolio"
  | "Custom";

export type ExecutiveKpiScorecardHierarchyLevel =
  | "Root"
  | "Parent"
  | "Child"
  | "Standalone";

export type ExecutiveKpiScorecardVisibilityLevel =
  | "Executive Only"
  | "Management"
  | "Department"
  | "Organization"
  | "Public Internal"
  | "Restricted";

export type ExecutiveKpiScorecardLifecycleState =
  | "Draft"
  | "Candidate"
  | "Approved"
  | "Active"
  | "Deprecated"
  | "Archived";

export type ExecutiveKpiScorecardOwner = Readonly<{
  readonly ownerId: string;
  readonly ownerName: string;
  readonly ownerRole: string;
  readonly metadataOnly: boolean;
}>;

export type ExecutiveKpiScorecardVisibilityMetadata = Readonly<{
  readonly visibilityId: string;
  readonly visibilityLevel: ExecutiveKpiScorecardVisibilityLevel;
  readonly metadataOnly: boolean;
}>;

export type ExecutiveKpiScorecardMetadata = Readonly<{
  readonly metadataId: string;
  readonly metadataOnly: boolean;
  readonly immutable: boolean;
}>;

export type ExecutiveKpiScorecard = Readonly<{
  readonly scorecardId: string;
  readonly scorecardName: string;
  readonly scorecardDescription: string;
  readonly scorecardCategory: ExecutiveKpiScorecardCategory;
  readonly businessDomain: string;
  readonly executiveOwner: ExecutiveKpiScorecardOwner;
  readonly supportedKpiIds: readonly string[];
  readonly hierarchyLevel: ExecutiveKpiScorecardHierarchyLevel;
  readonly parentScorecardId: string | null;
  readonly childScorecardIds: readonly string[];
  readonly visibilityMetadata: ExecutiveKpiScorecardVisibilityMetadata;
  readonly reviewCadence: string;
  readonly governanceReferenceId: string;
  readonly lifecycleState: ExecutiveKpiScorecardLifecycleState;
  readonly metadata: ExecutiveKpiScorecardMetadata;
  readonly metadataOnly: boolean;
  readonly immutable: boolean;
}>;

export type ExecutiveKpiScorecardRegistry = Readonly<{
  readonly platformId: "BUS-6";
  readonly platformName: "Executive KPI Scorecard Platform";
  readonly version: "1.0.0";
  readonly foundationPlatformId: "BUS-1";
  readonly definitionPlatformId: "BUS-2";
  readonly sourceMappingPlatformId: "BUS-3";
  readonly targetPlatformId: "BUS-4";
  readonly governancePlatformId: "BUS-5";
  readonly scorecards: readonly ExecutiveKpiScorecard[];
  readonly categories: readonly ExecutiveKpiScorecardCategory[];
  readonly hierarchyLevels: readonly ExecutiveKpiScorecardHierarchyLevel[];
  readonly visibilityLevels: readonly ExecutiveKpiScorecardVisibilityLevel[];
  readonly lifecycleStates: readonly ExecutiveKpiScorecardLifecycleState[];
  readonly publicApis: readonly string[];
  readonly metadataOnly: boolean;
  readonly immutable: boolean;
}>;

export type ExecutiveKpiScorecardManifest = Readonly<{
  readonly platformId: "BUS-6";
  readonly platformName: "Executive KPI Scorecard Platform";
  readonly version: "1.0.0";
  readonly foundationPlatformId: "BUS-1";
  readonly definitionPlatformId: "BUS-2";
  readonly sourceMappingPlatformId: "BUS-3";
  readonly targetPlatformId: "BUS-4";
  readonly governancePlatformId: "BUS-5";
  readonly foundationAvailable: boolean;
  readonly definitionsAvailable: boolean;
  readonly sourceMappingsAvailable: boolean;
  readonly targetsAvailable: boolean;
  readonly governanceAvailable: boolean;
  readonly scorecardCount: number;
  readonly categoryCount: number;
  readonly hierarchyLevelCount: number;
  readonly visibilityLevelCount: number;
  readonly lifecycleStateCount: number;
  readonly publicApis: readonly string[];
  readonly certificationStatus: "Scorecard Foundation Certified";
  readonly deterministicFingerprint: string;
}>;

export type ExecutiveKpiScorecardValidation = Readonly<{
  readonly valid: boolean;
  readonly errors: readonly string[];
  readonly warnings: readonly string[];
}>;

export type ExecutiveKpiScorecardPlatform = Readonly<{
  readonly registry: ExecutiveKpiScorecardRegistry;
  readonly manifest: ExecutiveKpiScorecardManifest;
  readonly validation: ExecutiveKpiScorecardValidation;
}>;

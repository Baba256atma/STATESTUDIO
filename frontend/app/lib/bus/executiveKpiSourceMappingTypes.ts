export type ExecutiveKpiSourceType =
  | "Manual Entry"
  | "CSV Upload"
  | "Spreadsheet"
  | "Database"
  | "API"
  | "ERP"
  | "CRM"
  | "Finance System"
  | "Project System"
  | "Operational System"
  | "External Benchmark";

export type ExecutiveKpiCoverageLevel = "Complete" | "Partial" | "Missing" | "Unknown";

export type ExecutiveKpiFreshnessExpectation =
  | "Real Time"
  | "Hourly"
  | "Daily"
  | "Weekly"
  | "Monthly"
  | "Quarterly"
  | "Manual"
  | "Unknown";

export type ExecutiveKpiSourceMappingLifecycleState =
  | "Draft"
  | "Candidate"
  | "Approved"
  | "Active"
  | "Deprecated"
  | "Archived";

export type ExecutiveKpiSourceOwnerMetadata = Readonly<{
  readonly ownerId: string;
  readonly ownerName: string;
  readonly ownerRole: string;
  readonly ownershipScope: "Platform" | "Domain" | "Workspace" | "Project";
}>;

export type ExecutiveKpiSourceField = Readonly<{
  readonly fieldId: string;
  readonly fieldName: string;
  readonly description: string;
  readonly metadataOnly: boolean;
}>;

export type ExecutiveKpiMappingConfidenceMetadata = Readonly<{
  readonly confidenceId: string;
  readonly confidenceLevel: "Declared" | "Candidate" | "Reviewed" | "Unknown";
  readonly metadataOnly: boolean;
}>;

export type ExecutiveKpiSourceGovernanceMetadata = Readonly<{
  readonly governanceId: string;
  readonly stewardshipRequired: boolean;
  readonly reviewRequired: boolean;
  readonly metadataOnly: boolean;
}>;

export type ExecutiveKpiSourceMapping = Readonly<{
  readonly mappingId: string;
  readonly kpiId: string;
  readonly sourceType: ExecutiveKpiSourceType;
  readonly sourceName: string;
  readonly sourceDescription: string;
  readonly sourceOwner: ExecutiveKpiSourceOwnerMetadata;
  readonly sourceDomain: string;
  readonly requiredFields: readonly ExecutiveKpiSourceField[];
  readonly optionalFields: readonly ExecutiveKpiSourceField[];
  readonly freshnessExpectation: ExecutiveKpiFreshnessExpectation;
  readonly coverageLevel: ExecutiveKpiCoverageLevel;
  readonly mappingConfidence: ExecutiveKpiMappingConfidenceMetadata;
  readonly lifecycleState: ExecutiveKpiSourceMappingLifecycleState;
  readonly governanceMetadata: ExecutiveKpiSourceGovernanceMetadata;
  readonly metadataOnly: boolean;
  readonly immutable: boolean;
}>;

export type ExecutiveKpiSourceMappingRegistry = Readonly<{
  readonly platformId: "BUS-3";
  readonly platformName: "Executive KPI Source Mapping Platform";
  readonly version: "1.0.0";
  readonly foundationPlatformId: "BUS-1";
  readonly definitionPlatformId: "BUS-2";
  readonly mappings: readonly ExecutiveKpiSourceMapping[];
  readonly sourceTypes: readonly ExecutiveKpiSourceType[];
  readonly coverageLevels: readonly ExecutiveKpiCoverageLevel[];
  readonly freshnessExpectations: readonly ExecutiveKpiFreshnessExpectation[];
  readonly lifecycleStates: readonly ExecutiveKpiSourceMappingLifecycleState[];
  readonly publicApis: readonly string[];
  readonly metadataOnly: boolean;
  readonly immutable: boolean;
}>;

export type ExecutiveKpiSourceMappingManifest = Readonly<{
  readonly platformId: "BUS-3";
  readonly platformName: "Executive KPI Source Mapping Platform";
  readonly version: "1.0.0";
  readonly foundationPlatformId: "BUS-1";
  readonly definitionPlatformId: "BUS-2";
  readonly foundationAvailable: boolean;
  readonly definitionsAvailable: boolean;
  readonly mappingCount: number;
  readonly sourceTypeCount: number;
  readonly coverageLevelCount: number;
  readonly freshnessExpectationCount: number;
  readonly lifecycleStateCount: number;
  readonly publicApis: readonly string[];
  readonly certificationStatus: "Source Mapping Foundation Certified";
  readonly deterministicFingerprint: string;
}>;

export type ExecutiveKpiSourceMappingValidation = Readonly<{
  readonly valid: boolean;
  readonly errors: readonly string[];
  readonly warnings: readonly string[];
}>;

export type ExecutiveKpiSourceMappingPlatform = Readonly<{
  readonly registry: ExecutiveKpiSourceMappingRegistry;
  readonly manifest: ExecutiveKpiSourceMappingManifest;
  readonly validation: ExecutiveKpiSourceMappingValidation;
}>;

export type ExecutiveKpiTargetType =
  | "Strategic Target"
  | "Operational Target"
  | "Compliance Target"
  | "Quality Target"
  | "Growth Target"
  | "Financial Target"
  | "Risk Target"
  | "Project Target"
  | "Custom Target";

export type ExecutiveKpiThresholdPolicy =
  | "Minimum"
  | "Maximum"
  | "Target Range"
  | "Exact Target"
  | "Observation Only";

export type ExecutiveKpiTolerancePolicy = "None" | "Low" | "Medium" | "High" | "Custom";

export type ExecutiveKpiMeasurementPeriod =
  | "Daily"
  | "Weekly"
  | "Monthly"
  | "Quarterly"
  | "Semiannual"
  | "Annual"
  | "Rolling"
  | "Custom";

export type ExecutiveKpiReviewCadence =
  | "Continuous"
  | "Daily"
  | "Weekly"
  | "Monthly"
  | "Quarterly"
  | "On Demand";

export type ExecutiveKpiTargetLifecycleState =
  | "Draft"
  | "Candidate"
  | "Approved"
  | "Active"
  | "Deprecated"
  | "Archived";

export type ExecutiveKpiTargetOwner = Readonly<{
  readonly ownerId: string;
  readonly ownerName: string;
  readonly ownerRole: string;
  readonly ownershipScope: "Platform" | "Domain" | "Workspace" | "Project";
}>;

export type ExecutiveKpiEffectiveDateMetadata = Readonly<{
  readonly effectiveDateId: string;
  readonly datePolicy: "Declared" | "Planned" | "Unspecified";
  readonly metadataOnly: boolean;
}>;

export type ExecutiveKpiExpirationMetadata = Readonly<{
  readonly expirationId: string;
  readonly expirationPolicy: "Declared" | "Open Ended" | "Unspecified";
  readonly metadataOnly: boolean;
}>;

export type ExecutiveKpiTargetGovernanceMetadata = Readonly<{
  readonly governanceId: string;
  readonly stewardshipRequired: boolean;
  readonly reviewRequired: boolean;
  readonly metadataOnly: boolean;
}>;

export type ExecutiveKpiTarget = Readonly<{
  readonly targetId: string;
  readonly kpiId: string;
  readonly targetName: string;
  readonly targetDescription: string;
  readonly targetOwner: ExecutiveKpiTargetOwner;
  readonly targetCategory: string;
  readonly measurementPeriod: ExecutiveKpiMeasurementPeriod;
  readonly reviewCadence: ExecutiveKpiReviewCadence;
  readonly targetDirection: string;
  readonly targetType: ExecutiveKpiTargetType;
  readonly thresholdPolicy: ExecutiveKpiThresholdPolicy;
  readonly tolerancePolicy: ExecutiveKpiTolerancePolicy;
  readonly effectiveDateMetadata: ExecutiveKpiEffectiveDateMetadata;
  readonly expirationMetadata: ExecutiveKpiExpirationMetadata;
  readonly lifecycleState: ExecutiveKpiTargetLifecycleState;
  readonly governanceMetadata: ExecutiveKpiTargetGovernanceMetadata;
  readonly metadataOnly: boolean;
  readonly immutable: boolean;
}>;

export type ExecutiveKpiTargetRegistry = Readonly<{
  readonly platformId: "BUS-4";
  readonly platformName: "Executive KPI Target & Threshold Platform";
  readonly version: "1.0.0";
  readonly foundationPlatformId: "BUS-1";
  readonly definitionPlatformId: "BUS-2";
  readonly sourceMappingPlatformId: "BUS-3";
  readonly targets: readonly ExecutiveKpiTarget[];
  readonly targetTypes: readonly ExecutiveKpiTargetType[];
  readonly thresholdPolicies: readonly ExecutiveKpiThresholdPolicy[];
  readonly tolerancePolicies: readonly ExecutiveKpiTolerancePolicy[];
  readonly measurementPeriods: readonly ExecutiveKpiMeasurementPeriod[];
  readonly reviewCadences: readonly ExecutiveKpiReviewCadence[];
  readonly lifecycleStates: readonly ExecutiveKpiTargetLifecycleState[];
  readonly publicApis: readonly string[];
  readonly metadataOnly: boolean;
  readonly immutable: boolean;
}>;

export type ExecutiveKpiTargetManifest = Readonly<{
  readonly platformId: "BUS-4";
  readonly platformName: "Executive KPI Target & Threshold Platform";
  readonly version: "1.0.0";
  readonly foundationPlatformId: "BUS-1";
  readonly definitionPlatformId: "BUS-2";
  readonly sourceMappingPlatformId: "BUS-3";
  readonly foundationAvailable: boolean;
  readonly definitionsAvailable: boolean;
  readonly sourceMappingsAvailable: boolean;
  readonly targetCount: number;
  readonly targetTypeCount: number;
  readonly thresholdPolicyCount: number;
  readonly tolerancePolicyCount: number;
  readonly measurementPeriodCount: number;
  readonly reviewCadenceCount: number;
  readonly lifecycleStateCount: number;
  readonly publicApis: readonly string[];
  readonly certificationStatus: "Target Foundation Certified";
  readonly deterministicFingerprint: string;
}>;

export type ExecutiveKpiTargetValidation = Readonly<{
  readonly valid: boolean;
  readonly errors: readonly string[];
  readonly warnings: readonly string[];
}>;

export type ExecutiveKpiTargetPlatform = Readonly<{
  readonly registry: ExecutiveKpiTargetRegistry;
  readonly manifest: ExecutiveKpiTargetManifest;
  readonly validation: ExecutiveKpiTargetValidation;
}>;

export type ExecutiveStrategicAlignmentCategory =
  | "Mission"
  | "Vision"
  | "Strategic Objective"
  | "Business Goal"
  | "Initiative"
  | "Transformation"
  | "Operational Excellence"
  | "Growth"
  | "Innovation"
  | "Customer Success"
  | "Risk Reduction"
  | "Custom";

export type ExecutiveAlignmentStrengthLevel = "Primary" | "Strong" | "Supporting" | "Indirect" | "Informational";

export type ExecutiveStrategicHorizon = "Immediate" | "Quarterly" | "Annual" | "Multi-Year" | "Long-Term";

export type ExecutiveStrategicAlignmentLifecycleState =
  | "Draft"
  | "Candidate"
  | "Approved"
  | "Active"
  | "Deprecated"
  | "Archived";

export type ExecutiveKpiStrategicAlignmentMetadata = Readonly<{
  readonly metadataId: string;
  readonly metadataOnly: boolean;
  readonly immutable: boolean;
}>;

export type ExecutiveKpiStrategicAlignment = Readonly<{
  readonly alignmentId: string;
  readonly kpiId: string;
  readonly strategicObjectiveId: string;
  readonly businessGoalId: string;
  readonly initiativeId: string;
  readonly strategicTheme: string;
  readonly alignmentCategory: ExecutiveStrategicAlignmentCategory;
  readonly alignmentStrength: ExecutiveAlignmentStrengthLevel;
  readonly strategicHorizon: ExecutiveStrategicHorizon;
  readonly executiveOwner: string;
  readonly businessDomain: string;
  readonly reviewCadence: string;
  readonly governanceReferenceId: string;
  readonly scorecardReferenceId: string;
  readonly insightReferenceIds: readonly string[];
  readonly lifecycleState: ExecutiveStrategicAlignmentLifecycleState;
  readonly metadata: ExecutiveKpiStrategicAlignmentMetadata;
  readonly metadataOnly: boolean;
  readonly immutable: boolean;
}>;

export type ExecutiveKpiStrategicAlignmentRegistry = Readonly<{
  readonly platformId: "BUS-8";
  readonly platformName: "Executive KPI Strategic Alignment Platform";
  readonly version: "1.0.0";
  readonly foundationPlatformId: "BUS-1";
  readonly definitionPlatformId: "BUS-2";
  readonly sourceMappingPlatformId: "BUS-3";
  readonly targetPlatformId: "BUS-4";
  readonly governancePlatformId: "BUS-5";
  readonly scorecardPlatformId: "BUS-6";
  readonly insightPlatformId: "BUS-7";
  readonly alignments: readonly ExecutiveKpiStrategicAlignment[];
  readonly categories: readonly ExecutiveStrategicAlignmentCategory[];
  readonly strengthLevels: readonly ExecutiveAlignmentStrengthLevel[];
  readonly strategicHorizons: readonly ExecutiveStrategicHorizon[];
  readonly lifecycleStates: readonly ExecutiveStrategicAlignmentLifecycleState[];
  readonly publicApis: readonly string[];
  readonly metadataOnly: boolean;
  readonly immutable: boolean;
}>;

export type ExecutiveKpiStrategicAlignmentManifest = Readonly<{
  readonly platformId: "BUS-8";
  readonly platformName: "Executive KPI Strategic Alignment Platform";
  readonly version: "1.0.0";
  readonly foundationPlatformId: "BUS-1";
  readonly definitionPlatformId: "BUS-2";
  readonly sourceMappingPlatformId: "BUS-3";
  readonly targetPlatformId: "BUS-4";
  readonly governancePlatformId: "BUS-5";
  readonly scorecardPlatformId: "BUS-6";
  readonly insightPlatformId: "BUS-7";
  readonly foundationAvailable: boolean;
  readonly definitionsAvailable: boolean;
  readonly sourceMappingsAvailable: boolean;
  readonly targetsAvailable: boolean;
  readonly governanceAvailable: boolean;
  readonly scorecardsAvailable: boolean;
  readonly insightsAvailable: boolean;
  readonly alignmentCount: number;
  readonly categoryCount: number;
  readonly strengthLevelCount: number;
  readonly strategicHorizonCount: number;
  readonly lifecycleStateCount: number;
  readonly publicApis: readonly string[];
  readonly certificationStatus: "Strategic Alignment Platform Certified";
  readonly deterministicFingerprint: string;
}>;

export type ExecutiveKpiStrategicAlignmentValidation = Readonly<{
  readonly valid: boolean;
  readonly errors: readonly string[];
  readonly warnings: readonly string[];
}>;

export type ExecutiveKpiStrategicAlignmentPlatform = Readonly<{
  readonly registry: ExecutiveKpiStrategicAlignmentRegistry;
  readonly manifest: ExecutiveKpiStrategicAlignmentManifest;
  readonly validation: ExecutiveKpiStrategicAlignmentValidation;
}>;

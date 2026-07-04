export type ExecutiveKpiInsightCategory =
  | "Performance Signal"
  | "Risk Signal"
  | "Opportunity Signal"
  | "Execution Signal"
  | "Strategic Alignment Signal"
  | "Resource Signal"
  | "Customer Signal"
  | "Financial Signal"
  | "Operational Signal"
  | "Governance Signal"
  | "Custom Signal";

export type ExecutiveKpiInsightSeverityLevel =
  | "Critical"
  | "High"
  | "Medium"
  | "Low"
  | "Informational";

export type ExecutiveKpiInsightConfidenceLevel =
  | "Very High"
  | "High"
  | "Medium"
  | "Low"
  | "Unknown";

export type ExecutiveKpiInsightAudienceLevel =
  | "CEO"
  | "Executive Team"
  | "Board"
  | "Department Head"
  | "Project Manager"
  | "Analyst"
  | "Advisor"
  | "Custom";

export type ExecutiveKpiInsightLifecycleState =
  | "Draft"
  | "Candidate"
  | "Approved"
  | "Active"
  | "Deprecated"
  | "Archived";

export type ExecutiveKpiInsightMetadata = Readonly<{
  readonly metadataId: string;
  readonly metadataOnly: boolean;
  readonly immutable: boolean;
}>;

export type ExecutiveKpiInsight = Readonly<{
  readonly insightId: string;
  readonly insightName: string;
  readonly insightDescription: string;
  readonly insightCategory: ExecutiveKpiInsightCategory;
  readonly relatedKpiIds: readonly string[];
  readonly relatedScorecardIds: readonly string[];
  readonly intendedAudience: ExecutiveKpiInsightAudienceLevel;
  readonly severityLevel: ExecutiveKpiInsightSeverityLevel;
  readonly confidenceLevel: ExecutiveKpiInsightConfidenceLevel;
  readonly businessDomain: string;
  readonly executiveRelevance: string;
  readonly governanceReferenceId: string;
  readonly lifecycleState: ExecutiveKpiInsightLifecycleState;
  readonly metadata: ExecutiveKpiInsightMetadata;
  readonly metadataOnly: boolean;
  readonly immutable: boolean;
}>;

export type ExecutiveKpiInsightRegistry = Readonly<{
  readonly platformId: "BUS-7";
  readonly platformName: "Executive KPI Insight Metadata Platform";
  readonly version: "1.0.0";
  readonly foundationPlatformId: "BUS-1";
  readonly definitionPlatformId: "BUS-2";
  readonly sourceMappingPlatformId: "BUS-3";
  readonly targetPlatformId: "BUS-4";
  readonly governancePlatformId: "BUS-5";
  readonly scorecardPlatformId: "BUS-6";
  readonly insights: readonly ExecutiveKpiInsight[];
  readonly categories: readonly ExecutiveKpiInsightCategory[];
  readonly severityLevels: readonly ExecutiveKpiInsightSeverityLevel[];
  readonly confidenceLevels: readonly ExecutiveKpiInsightConfidenceLevel[];
  readonly audienceLevels: readonly ExecutiveKpiInsightAudienceLevel[];
  readonly lifecycleStates: readonly ExecutiveKpiInsightLifecycleState[];
  readonly publicApis: readonly string[];
  readonly metadataOnly: boolean;
  readonly immutable: boolean;
}>;

export type ExecutiveKpiInsightManifest = Readonly<{
  readonly platformId: "BUS-7";
  readonly platformName: "Executive KPI Insight Metadata Platform";
  readonly version: "1.0.0";
  readonly foundationPlatformId: "BUS-1";
  readonly definitionPlatformId: "BUS-2";
  readonly sourceMappingPlatformId: "BUS-3";
  readonly targetPlatformId: "BUS-4";
  readonly governancePlatformId: "BUS-5";
  readonly scorecardPlatformId: "BUS-6";
  readonly foundationAvailable: boolean;
  readonly definitionsAvailable: boolean;
  readonly sourceMappingsAvailable: boolean;
  readonly targetsAvailable: boolean;
  readonly governanceAvailable: boolean;
  readonly scorecardsAvailable: boolean;
  readonly insightCount: number;
  readonly categoryCount: number;
  readonly severityLevelCount: number;
  readonly confidenceLevelCount: number;
  readonly audienceLevelCount: number;
  readonly lifecycleStateCount: number;
  readonly publicApis: readonly string[];
  readonly certificationStatus: "Insight Metadata Foundation Certified";
  readonly deterministicFingerprint: string;
}>;

export type ExecutiveKpiInsightValidation = Readonly<{
  readonly valid: boolean;
  readonly errors: readonly string[];
  readonly warnings: readonly string[];
}>;

export type ExecutiveKpiInsightPlatform = Readonly<{
  readonly registry: ExecutiveKpiInsightRegistry;
  readonly manifest: ExecutiveKpiInsightManifest;
  readonly validation: ExecutiveKpiInsightValidation;
}>;

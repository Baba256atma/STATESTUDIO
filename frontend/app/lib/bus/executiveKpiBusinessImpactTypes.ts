export type ExecutiveBusinessImpactCategory =
  | "Revenue"
  | "Cost"
  | "Margin"
  | "Cash Flow"
  | "Customer"
  | "Operational Efficiency"
  | "Resource Capacity"
  | "Risk Exposure"
  | "Execution Speed"
  | "Strategic Progress"
  | "Quality"
  | "Growth"
  | "Custom";

export type ExecutiveBusinessImpactDimension =
  | "Financial Impact"
  | "Operational Impact"
  | "Customer Impact"
  | "Strategic Impact"
  | "Risk Impact"
  | "Resource Impact"
  | "Execution Impact"
  | "Market Impact"
  | "Organizational Impact"
  | "Custom Impact";

export type ExecutiveBusinessImpactHorizon = "Immediate" | "Short Term" | "Quarterly" | "Annual" | "Multi-Year" | "Long Term";

export type ExecutiveBusinessImpactConfidenceLevel = "Very High" | "High" | "Medium" | "Low" | "Unknown";

export type ExecutiveBusinessImpactLifecycleState = "Draft" | "Candidate" | "Approved" | "Active" | "Deprecated" | "Archived";

export type ExecutiveKpiBusinessImpactMetadata = Readonly<{
  readonly metadataId: string;
  readonly metadataOnly: boolean;
  readonly immutable: boolean;
}>;

export type ExecutiveKpiBusinessImpact = Readonly<{
  readonly impactId: string;
  readonly kpiId: string;
  readonly impactName: string;
  readonly impactDescription: string;
  readonly impactCategory: ExecutiveBusinessImpactCategory;
  readonly impactDimension: ExecutiveBusinessImpactDimension;
  readonly businessDomain: string;
  readonly affectedAudience: string;
  readonly impactHorizon: ExecutiveBusinessImpactHorizon;
  readonly confidenceLevel: ExecutiveBusinessImpactConfidenceLevel;
  readonly strategicAlignmentReferenceId: string;
  readonly governanceReferenceId: string;
  readonly lifecycleState: ExecutiveBusinessImpactLifecycleState;
  readonly metadata: ExecutiveKpiBusinessImpactMetadata;
  readonly metadataOnly: boolean;
  readonly immutable: boolean;
}>;

export type ExecutiveKpiBusinessImpactRegistry = Readonly<{
  readonly platformId: "BUS-9";
  readonly platformName: "Executive KPI Business Impact Metadata Platform";
  readonly version: "1.0.0";
  readonly foundationPlatformId: "BUS-1";
  readonly definitionPlatformId: "BUS-2";
  readonly sourceMappingPlatformId: "BUS-3";
  readonly targetPlatformId: "BUS-4";
  readonly governancePlatformId: "BUS-5";
  readonly scorecardPlatformId: "BUS-6";
  readonly insightPlatformId: "BUS-7";
  readonly strategicAlignmentPlatformId: "BUS-8";
  readonly impacts: readonly ExecutiveKpiBusinessImpact[];
  readonly categories: readonly ExecutiveBusinessImpactCategory[];
  readonly dimensions: readonly ExecutiveBusinessImpactDimension[];
  readonly horizons: readonly ExecutiveBusinessImpactHorizon[];
  readonly confidenceLevels: readonly ExecutiveBusinessImpactConfidenceLevel[];
  readonly lifecycleStates: readonly ExecutiveBusinessImpactLifecycleState[];
  readonly publicApis: readonly string[];
  readonly metadataOnly: boolean;
  readonly immutable: boolean;
}>;

export type ExecutiveKpiBusinessImpactManifest = Readonly<{
  readonly platformId: "BUS-9";
  readonly platformName: "Executive KPI Business Impact Metadata Platform";
  readonly version: "1.0.0";
  readonly foundationPlatformId: "BUS-1";
  readonly definitionPlatformId: "BUS-2";
  readonly sourceMappingPlatformId: "BUS-3";
  readonly targetPlatformId: "BUS-4";
  readonly governancePlatformId: "BUS-5";
  readonly scorecardPlatformId: "BUS-6";
  readonly insightPlatformId: "BUS-7";
  readonly strategicAlignmentPlatformId: "BUS-8";
  readonly foundationAvailable: boolean;
  readonly definitionsAvailable: boolean;
  readonly sourceMappingsAvailable: boolean;
  readonly targetsAvailable: boolean;
  readonly governanceAvailable: boolean;
  readonly scorecardsAvailable: boolean;
  readonly insightsAvailable: boolean;
  readonly strategicAlignmentsAvailable: boolean;
  readonly impactCount: number;
  readonly categoryCount: number;
  readonly dimensionCount: number;
  readonly horizonCount: number;
  readonly confidenceLevelCount: number;
  readonly lifecycleStateCount: number;
  readonly publicApis: readonly string[];
  readonly certificationStatus: "Business Impact Metadata Platform Certified";
  readonly deterministicFingerprint: string;
}>;

export type ExecutiveKpiBusinessImpactValidation = Readonly<{
  readonly valid: boolean;
  readonly errors: readonly string[];
  readonly warnings: readonly string[];
}>;

export type ExecutiveKpiBusinessImpactPlatform = Readonly<{
  readonly registry: ExecutiveKpiBusinessImpactRegistry;
  readonly manifest: ExecutiveKpiBusinessImpactManifest;
  readonly validation: ExecutiveKpiBusinessImpactValidation;
}>;

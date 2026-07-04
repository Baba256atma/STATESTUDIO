export type ExecutiveKpiGovernanceCategory =
  | "Corporate"
  | "Strategic"
  | "Operational"
  | "Financial"
  | "Risk"
  | "Compliance"
  | "Project"
  | "Departmental"
  | "Enterprise"
  | "Custom";

export type ExecutiveKpiCriticalityLevel =
  | "Critical"
  | "High"
  | "Medium"
  | "Low"
  | "Informational";

export type ExecutiveKpiComplianceLevel =
  | "Mandatory"
  | "Regulated"
  | "Internal"
  | "Recommended"
  | "Optional";

export type ExecutiveKpiGovernanceReviewPolicy =
  | "Continuous"
  | "Monthly"
  | "Quarterly"
  | "Semiannual"
  | "Annual"
  | "On Demand";

export type ExecutiveKpiChangeControlPolicy =
  | "Strict"
  | "Controlled"
  | "Managed"
  | "Flexible"
  | "Experimental";

export type ExecutiveKpiGovernanceLifecycleState =
  | "Draft"
  | "Candidate"
  | "Approved"
  | "Active"
  | "Deprecated"
  | "Archived";

export type ExecutiveKpiGovernanceRoleMetadata = Readonly<{
  readonly roleId: string;
  readonly displayName: string;
  readonly responsibility: string;
  readonly metadataOnly: boolean;
}>;

export type ExecutiveKpiRetentionPolicyMetadata = Readonly<{
  readonly retentionPolicyId: string;
  readonly retentionClass: "Standard" | "Extended" | "Permanent" | "Unspecified";
  readonly metadataOnly: boolean;
}>;

export type ExecutiveKpiDocumentationRequirement = Readonly<{
  readonly documentationRequirementId: string;
  readonly required: boolean;
  readonly documentationClass: "Definition" | "Source" | "Target" | "Governance" | "Unspecified";
  readonly metadataOnly: boolean;
}>;

export type ExecutiveKpiGovernanceMetadata = Readonly<{
  readonly metadataId: string;
  readonly metadataOnly: boolean;
  readonly immutable: boolean;
}>;

export type ExecutiveKpiGovernance = Readonly<{
  readonly governanceId: string;
  readonly kpiId: string;
  readonly businessOwner: ExecutiveKpiGovernanceRoleMetadata;
  readonly executiveOwner: ExecutiveKpiGovernanceRoleMetadata;
  readonly technicalSteward: ExecutiveKpiGovernanceRoleMetadata;
  readonly dataSteward: ExecutiveKpiGovernanceRoleMetadata;
  readonly approvalAuthority: ExecutiveKpiGovernanceRoleMetadata;
  readonly reviewAuthority: ExecutiveKpiGovernanceRoleMetadata;
  readonly governanceCategory: ExecutiveKpiGovernanceCategory;
  readonly complianceLevel: ExecutiveKpiComplianceLevel;
  readonly criticalityLevel: ExecutiveKpiCriticalityLevel;
  readonly changeControlPolicy: ExecutiveKpiChangeControlPolicy;
  readonly reviewPolicy: ExecutiveKpiGovernanceReviewPolicy;
  readonly retentionPolicy: ExecutiveKpiRetentionPolicyMetadata;
  readonly documentationRequirement: ExecutiveKpiDocumentationRequirement;
  readonly lifecycleState: ExecutiveKpiGovernanceLifecycleState;
  readonly governanceMetadata: ExecutiveKpiGovernanceMetadata;
  readonly metadataOnly: boolean;
  readonly immutable: boolean;
}>;

export type ExecutiveKpiGovernanceRegistry = Readonly<{
  readonly platformId: "BUS-5";
  readonly platformName: "Executive KPI Governance Platform";
  readonly version: "1.0.0";
  readonly foundationPlatformId: "BUS-1";
  readonly definitionPlatformId: "BUS-2";
  readonly sourceMappingPlatformId: "BUS-3";
  readonly targetPlatformId: "BUS-4";
  readonly governance: readonly ExecutiveKpiGovernance[];
  readonly governanceCategories: readonly ExecutiveKpiGovernanceCategory[];
  readonly complianceLevels: readonly ExecutiveKpiComplianceLevel[];
  readonly criticalityLevels: readonly ExecutiveKpiCriticalityLevel[];
  readonly reviewPolicies: readonly ExecutiveKpiGovernanceReviewPolicy[];
  readonly changeControlPolicies: readonly ExecutiveKpiChangeControlPolicy[];
  readonly lifecycleStates: readonly ExecutiveKpiGovernanceLifecycleState[];
  readonly publicApis: readonly string[];
  readonly metadataOnly: boolean;
  readonly immutable: boolean;
}>;

export type ExecutiveKpiGovernanceManifest = Readonly<{
  readonly platformId: "BUS-5";
  readonly platformName: "Executive KPI Governance Platform";
  readonly version: "1.0.0";
  readonly foundationPlatformId: "BUS-1";
  readonly definitionPlatformId: "BUS-2";
  readonly sourceMappingPlatformId: "BUS-3";
  readonly targetPlatformId: "BUS-4";
  readonly foundationAvailable: boolean;
  readonly definitionsAvailable: boolean;
  readonly sourceMappingsAvailable: boolean;
  readonly targetsAvailable: boolean;
  readonly governanceCount: number;
  readonly governanceCategoryCount: number;
  readonly complianceLevelCount: number;
  readonly criticalityLevelCount: number;
  readonly reviewPolicyCount: number;
  readonly changeControlPolicyCount: number;
  readonly lifecycleStateCount: number;
  readonly publicApis: readonly string[];
  readonly certificationStatus: "Governance Foundation Certified";
  readonly deterministicFingerprint: string;
}>;

export type ExecutiveKpiGovernanceValidation = Readonly<{
  readonly valid: boolean;
  readonly errors: readonly string[];
  readonly warnings: readonly string[];
}>;

export type ExecutiveKpiGovernancePlatform = Readonly<{
  readonly registry: ExecutiveKpiGovernanceRegistry;
  readonly manifest: ExecutiveKpiGovernanceManifest;
  readonly validation: ExecutiveKpiGovernanceValidation;
}>;

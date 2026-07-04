export type ExecutiveKpiCategory =
  | "Financial"
  | "Operational"
  | "Customer"
  | "Sales"
  | "Marketing"
  | "Project"
  | "Resource"
  | "Risk"
  | "Strategic"
  | "Growth"
  | "Quality"
  | "Execution";

export type ExecutiveKpiDirection =
  | "Higher Is Better"
  | "Lower Is Better"
  | "Target Range"
  | "Neutral Observation";

export type ExecutiveKpiLifecycleState =
  | "Draft"
  | "Candidate"
  | "Approved"
  | "Active"
  | "Deprecated"
  | "Archived";

export type ExecutiveKpiUnitType =
  | "Currency"
  | "Count"
  | "Percentage"
  | "Ratio"
  | "Duration"
  | "Index"
  | "Textual";

export type ExecutiveKpiOwnerMetadata = Readonly<{
  readonly ownerId: string;
  readonly ownerName: string;
  readonly ownerRole: string;
  readonly ownershipScope: "Platform" | "Domain" | "Workspace" | "Project";
}>;

export type ExecutiveKpiSourceRequirement = Readonly<{
  readonly requirementId: string;
  readonly sourceType: "Declared" | "Integrated" | "Derived Metadata" | "Manual Metadata";
  readonly required: boolean;
  readonly metadataOnly: boolean;
}>;

export type ExecutiveKpiConfidenceRequirement = Readonly<{
  readonly requirementId: string;
  readonly confidenceType: "Declared Confidence" | "Source Confidence" | "Governance Confidence";
  readonly required: boolean;
  readonly metadataOnly: boolean;
}>;

export type ExecutiveKpiGovernanceMetadata = Readonly<{
  readonly governanceId: string;
  readonly stewardshipRequired: boolean;
  readonly reviewRequired: boolean;
  readonly metadataOnly: boolean;
}>;

export type ExecutiveKpiDefinition = Readonly<{
  readonly kpiId: string;
  readonly name: string;
  readonly description: string;
  readonly category: ExecutiveKpiCategory;
  readonly owner: ExecutiveKpiOwnerMetadata;
  readonly businessDomain: string;
  readonly unitType: ExecutiveKpiUnitType;
  readonly direction: ExecutiveKpiDirection;
  readonly lifecycleState: ExecutiveKpiLifecycleState;
  readonly sourceRequirement: ExecutiveKpiSourceRequirement;
  readonly confidenceRequirement: ExecutiveKpiConfidenceRequirement;
  readonly governanceMetadata: ExecutiveKpiGovernanceMetadata;
  readonly metadataOnly: boolean;
  readonly immutable: boolean;
}>;

export type ExecutiveKpiCategoryDeclaration = Readonly<{
  readonly category: ExecutiveKpiCategory;
  readonly description: string;
  readonly metadataOnly: boolean;
}>;

export type ExecutiveKpiDefinitionRegistry = Readonly<{
  readonly platformId: "BUS-2";
  readonly platformName: "Executive KPI Definition Platform";
  readonly version: "1.0.0";
  readonly foundationPlatformId: "BUS-1";
  readonly definitions: readonly ExecutiveKpiDefinition[];
  readonly categories: readonly ExecutiveKpiCategoryDeclaration[];
  readonly directions: readonly ExecutiveKpiDirection[];
  readonly lifecycleStates: readonly ExecutiveKpiLifecycleState[];
  readonly publicApis: readonly string[];
  readonly metadataOnly: boolean;
  readonly immutable: boolean;
}>;

export type ExecutiveKpiDefinitionManifest = Readonly<{
  readonly platformId: "BUS-2";
  readonly platformName: "Executive KPI Definition Platform";
  readonly version: "1.0.0";
  readonly foundationPlatformId: "BUS-1";
  readonly foundationAvailable: boolean;
  readonly definitionCount: number;
  readonly categoryCount: number;
  readonly directionCount: number;
  readonly lifecycleStateCount: number;
  readonly publicApis: readonly string[];
  readonly certificationStatus: "Definition Foundation Certified";
  readonly deterministicFingerprint: string;
}>;

export type ExecutiveKpiDefinitionValidation = Readonly<{
  readonly valid: boolean;
  readonly errors: readonly string[];
  readonly warnings: readonly string[];
}>;

export type ExecutiveKpiDefinitionPlatform = Readonly<{
  readonly registry: ExecutiveKpiDefinitionRegistry;
  readonly manifest: ExecutiveKpiDefinitionManifest;
  readonly validation: ExecutiveKpiDefinitionValidation;
}>;

export type ExecutiveOkrAlignmentCategory =
  | "Strategic"
  | "Operational"
  | "Financial"
  | "Customer"
  | "Innovation"
  | "Transformation"
  | "Cross-Functional"
  | "Portfolio"
  | "Program"
  | "Custom";

export type ExecutiveOkrAlignmentStrength = "Primary" | "Strong" | "Supporting" | "Indirect" | "Informational";

export type ExecutiveOkrDependencyType = "Requires" | "Supports" | "Influences" | "References" | "Independent";

export type ExecutiveOkrStrategicTheme =
  | "Growth"
  | "Efficiency"
  | "Innovation"
  | "Customer Success"
  | "Risk Reduction"
  | "Digital Transformation"
  | "Operational Excellence"
  | "Custom";

export type ExecutiveOkrAlignmentLifecycleState = "Draft" | "Candidate" | "Approved" | "Active" | "Deprecated" | "Archived";

export type ExecutiveOkrAlignmentMetadata = Readonly<{
  readonly metadataId: string;
  readonly metadataOnly: boolean;
  readonly immutable: boolean;
}>;

export type ExecutiveOkrAlignment = Readonly<{
  readonly alignmentId: string;
  readonly alignmentName: string;
  readonly alignmentDescription: string;
  readonly sourceObjectiveId: string;
  readonly targetObjectiveId: string;
  readonly keyResultId: string;
  readonly linkedKpiIds: readonly string[];
  readonly strategicTheme: ExecutiveOkrStrategicTheme;
  readonly initiative: string;
  readonly alignmentCategory: ExecutiveOkrAlignmentCategory;
  readonly alignmentStrength: ExecutiveOkrAlignmentStrength;
  readonly dependencyType: ExecutiveOkrDependencyType;
  readonly businessDomain: string;
  readonly executiveOwner: string;
  readonly governanceReference: string;
  readonly lifecycleState: ExecutiveOkrAlignmentLifecycleState;
  readonly metadata: ExecutiveOkrAlignmentMetadata;
  readonly metadataOnly: boolean;
  readonly immutable: boolean;
}>;

export type ExecutiveOkrAlignmentRegistry = Readonly<{
  readonly platformId: "BUS-15";
  readonly platformName: "Executive OKR Alignment Platform";
  readonly version: "1.0.0";
  readonly foundationPlatformId: "BUS-13";
  readonly definitionPlatformId: "BUS-14";
  readonly kpiFreezeDependency: "BUS-12";
  readonly alignments: readonly ExecutiveOkrAlignment[];
  readonly categories: readonly ExecutiveOkrAlignmentCategory[];
  readonly strengthLevels: readonly ExecutiveOkrAlignmentStrength[];
  readonly dependencyTypes: readonly ExecutiveOkrDependencyType[];
  readonly strategicThemes: readonly ExecutiveOkrStrategicTheme[];
  readonly lifecycleStates: readonly ExecutiveOkrAlignmentLifecycleState[];
  readonly publicApis: readonly string[];
  readonly metadataOnly: boolean;
  readonly immutable: boolean;
}>;

export type ExecutiveOkrAlignmentManifest = Readonly<{
  readonly platformId: "BUS-15";
  readonly platformName: "Executive OKR Alignment Platform";
  readonly version: "1.0.0";
  readonly foundationPlatformId: "BUS-13";
  readonly definitionPlatformId: "BUS-14";
  readonly kpiFreezeDependency: "BUS-12";
  readonly foundationAvailable: boolean;
  readonly definitionsAvailable: boolean;
  readonly kpiFreezeAvailable: boolean;
  readonly alignmentCount: number;
  readonly categoryCount: number;
  readonly strengthLevelCount: number;
  readonly dependencyTypeCount: number;
  readonly strategicThemeCount: number;
  readonly lifecycleStateCount: number;
  readonly publicApis: readonly string[];
  readonly certificationStatus: "Alignment Platform Certified";
  readonly deterministicFingerprint: string;
}>;

export type ExecutiveOkrAlignmentValidation = Readonly<{
  readonly valid: boolean;
  readonly errors: readonly string[];
  readonly warnings: readonly string[];
}>;

export type ExecutiveOkrAlignmentPlatform = Readonly<{
  readonly registry: ExecutiveOkrAlignmentRegistry;
  readonly manifest: ExecutiveOkrAlignmentManifest;
  readonly validation: ExecutiveOkrAlignmentValidation;
}>;

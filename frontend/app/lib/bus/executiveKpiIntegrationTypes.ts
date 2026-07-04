export type ExecutiveKpiIntegrationCategory =
  | "Foundation"
  | "Definition"
  | "Source Mapping"
  | "Targeting"
  | "Governance"
  | "Scorecard"
  | "Insight Metadata"
  | "Strategic Alignment"
  | "Business Impact"
  | "Reporting"
  | "Compatibility"
  | "Public API"
  | "Consumer Contract";

export type ExecutiveKpiIntegrationLifecycleState = "Draft" | "Candidate" | "Approved" | "Active" | "Deprecated" | "Archived" | "Frozen";

export type ExecutiveKpiCompatibilityStatus = "Compatible" | "Consumer Safe" | "Future Compatible" | "Metadata Only";

export type ExecutiveKpiIntegrationMetadata = Readonly<{
  readonly metadataId: string;
  readonly metadataOnly: boolean;
  readonly immutable: boolean;
}>;

export type ExecutiveKpiIntegrationPhase = Readonly<{
  readonly integrationId: string;
  readonly platformName: string;
  readonly phaseId: string;
  readonly phaseName: string;
  readonly phaseStatus: string;
  readonly phaseDependencyIds: readonly string[];
  readonly requiredPublicApis: readonly string[];
  readonly providedPublicApis: readonly string[];
  readonly compatibilityStatus: ExecutiveKpiCompatibilityStatus;
  readonly consumerLayer: string;
  readonly integrationCategory: ExecutiveKpiIntegrationCategory;
  readonly lifecycleState: ExecutiveKpiIntegrationLifecycleState;
  readonly metadata: ExecutiveKpiIntegrationMetadata;
  readonly metadataOnly: boolean;
  readonly immutable: boolean;
}>;

export type ExecutiveKpiIntegrationDependency = Readonly<{
  readonly dependencyId: string;
  readonly phaseId: string;
  readonly dependsOnPhaseIds: readonly string[];
  readonly dependencyType: "Public API" | "Metadata Contract" | "Compatibility Contract";
  readonly metadataOnly: boolean;
}>;

export type ExecutiveKpiCompatibilityEntry = Readonly<{
  readonly compatibilityId: string;
  readonly targetLayer: string;
  readonly compatibilityStatus: ExecutiveKpiCompatibilityStatus;
  readonly description: string;
  readonly metadataOnly: boolean;
  readonly immutable: boolean;
}>;

export type ExecutiveKpiConsumerEntry = Readonly<{
  readonly consumerId: string;
  readonly consumerName: string;
  readonly consumerLayer: string;
  readonly consumptionBoundary: "Public API Only";
  readonly metadataOnly: boolean;
  readonly immutable: boolean;
}>;

export type ExecutiveKpiIntegrationRegistry = Readonly<{
  readonly platformId: "BUS-11";
  readonly platformName: "Executive KPI Integration Platform";
  readonly version: "1.0.0";
  readonly integratedPhaseIds: readonly string[];
  readonly phases: readonly ExecutiveKpiIntegrationPhase[];
  readonly dependencies: readonly ExecutiveKpiIntegrationDependency[];
  readonly categories: readonly ExecutiveKpiIntegrationCategory[];
  readonly consumers: readonly ExecutiveKpiConsumerEntry[];
  readonly lifecycleStates: readonly ExecutiveKpiIntegrationLifecycleState[];
  readonly publicApis: readonly string[];
  readonly metadataOnly: boolean;
  readonly immutable: boolean;
}>;

export type ExecutiveKpiIntegrationManifest = Readonly<{
  readonly platformId: "BUS-11";
  readonly platformName: "Executive KPI Integration Platform";
  readonly version: "1.0.0";
  readonly bus1Available: boolean;
  readonly bus2Available: boolean;
  readonly bus3Available: boolean;
  readonly bus4Available: boolean;
  readonly bus5Available: boolean;
  readonly bus6Available: boolean;
  readonly bus7Available: boolean;
  readonly bus8Available: boolean;
  readonly bus9Available: boolean;
  readonly bus10Available: boolean;
  readonly phaseCount: number;
  readonly dependencyCount: number;
  readonly compatibilityCount: number;
  readonly consumerCount: number;
  readonly categoryCount: number;
  readonly lifecycleStateCount: number;
  readonly publicApis: readonly string[];
  readonly certificationStatus: "Integration Platform Certified";
  readonly deterministicFingerprint: string;
}>;

export type ExecutiveKpiIntegrationValidation = Readonly<{
  readonly valid: boolean;
  readonly errors: readonly string[];
  readonly warnings: readonly string[];
}>;

export type ExecutiveKpiIntegrationPlatform = Readonly<{
  readonly registry: ExecutiveKpiIntegrationRegistry;
  readonly compatibilityMatrix: readonly ExecutiveKpiCompatibilityEntry[];
  readonly manifest: ExecutiveKpiIntegrationManifest;
  readonly validation: ExecutiveKpiIntegrationValidation;
}>;

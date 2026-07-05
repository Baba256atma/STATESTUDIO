export type ExecutiveStrategyLifecycle = "Draft" | "Candidate" | "Approved" | "Active" | "Archived";
export type ExecutiveStrategyStatus = "Proposed" | "Defined" | "Aligned" | "Validated" | "Frozen";
export type ExecutiveStrategyPriority = "Critical" | "High" | "Medium" | "Future" | "Optional";
export type ExecutiveStrategyHorizon = "Quarterly" | "Annual" | "Multi-Year" | "Long-Term";
export type ExecutiveStrategyCategory =
  | "Growth"
  | "Financial"
  | "Operational"
  | "Customer"
  | "Innovation"
  | "Transformation"
  | "Risk"
  | "Sustainability"
  | "Portfolio";

export type ExecutiveStrategyMetadata = Readonly<{
  readonly metadataId: string;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly namespace: "executive.strategy";
  readonly domainIdentity: "Executive Strategy Domain";
}>;

export type ExecutiveStrategyOwner = Readonly<{
  readonly ownerId: string;
  readonly ownerName: string;
  readonly ownerRole: string;
  readonly metadataOnly: true;
  readonly immutable: true;
}>;

export type ExecutiveStrategyStakeholder = Readonly<{
  readonly stakeholderId: string;
  readonly stakeholderName: string;
  readonly stakeholderRole: string;
  readonly metadataOnly: true;
  readonly immutable: true;
}>;

export type ExecutiveStrategicRiskReference = Readonly<{
  readonly riskReferenceId: string;
  readonly riskName: string;
  readonly metadataOnly: true;
  readonly immutable: true;
}>;

export type ExecutiveStrategicKpiReference = Readonly<{
  readonly kpiReferenceId: string;
  readonly kpiName: string;
  readonly sourcePlatformId: "BUS";
  readonly metadataOnly: true;
  readonly immutable: true;
}>;

export type ExecutiveStrategicOkrReference = Readonly<{
  readonly okrReferenceId: string;
  readonly okrName: string;
  readonly sourcePlatformId: "BUS-OKR";
  readonly metadataOnly: true;
  readonly immutable: true;
}>;

export type ExecutiveStrategicDependency = Readonly<{
  readonly dependencyId: string;
  readonly dependencyName: string;
  readonly dependencyType: "Requires" | "Supports" | "References";
  readonly metadataOnly: true;
  readonly immutable: true;
}>;

export type ExecutiveStrategicAssumption = Readonly<{
  readonly assumptionId: string;
  readonly assumptionName: string;
  readonly metadataOnly: true;
  readonly immutable: true;
}>;

export type ExecutiveStrategicConstraint = Readonly<{
  readonly constraintId: string;
  readonly constraintName: string;
  readonly metadataOnly: true;
  readonly immutable: true;
}>;

export type ExecutiveStrategicOpportunity = Readonly<{
  readonly opportunityId: string;
  readonly opportunityName: string;
  readonly metadataOnly: true;
  readonly immutable: true;
}>;

export type ExecutiveStrategicMilestone = Readonly<{
  readonly milestoneId: string;
  readonly milestoneName: string;
  readonly horizon: ExecutiveStrategyHorizon;
  readonly metadataOnly: true;
  readonly immutable: true;
}>;

export type ExecutiveStrategicRoadmap = Readonly<{
  readonly roadmapId: string;
  readonly roadmapName: string;
  readonly milestoneIds: readonly string[];
  readonly metadataOnly: true;
  readonly immutable: true;
}>;

export type ExecutiveStrategicProgram = Readonly<{
  readonly programId: string;
  readonly programName: string;
  readonly metadataOnly: true;
  readonly immutable: true;
}>;

export type ExecutiveStrategicInitiative = Readonly<{
  readonly initiativeId: string;
  readonly initiativeName: string;
  readonly programId: string;
  readonly metadataOnly: true;
  readonly immutable: true;
}>;

export type ExecutiveStrategicPillar = Readonly<{
  readonly pillarId: string;
  readonly pillarName: string;
  readonly category: ExecutiveStrategyCategory;
  readonly metadataOnly: true;
  readonly immutable: true;
}>;

export type ExecutiveStrategicObjective = Readonly<{
  readonly objectiveId: string;
  readonly objectiveName: string;
  readonly category: ExecutiveStrategyCategory;
  readonly priority: ExecutiveStrategyPriority;
  readonly horizon: ExecutiveStrategyHorizon;
  readonly linkedKpiReferenceIds: readonly string[];
  readonly linkedOkrReferenceIds: readonly string[];
  readonly metadataOnly: true;
  readonly immutable: true;
}>;

export type ExecutiveStrategicTheme = Readonly<{
  readonly themeId: string;
  readonly themeName: string;
  readonly category: ExecutiveStrategyCategory;
  readonly metadataOnly: true;
  readonly immutable: true;
}>;

export type ExecutiveStrategy = Readonly<{
  readonly strategyId: string;
  readonly strategyName: string;
  readonly strategyDescription: string;
  readonly category: ExecutiveStrategyCategory;
  readonly priority: ExecutiveStrategyPriority;
  readonly horizon: ExecutiveStrategyHorizon;
  readonly lifecycle: ExecutiveStrategyLifecycle;
  readonly status: ExecutiveStrategyStatus;
  readonly themeIds: readonly string[];
  readonly objectiveIds: readonly string[];
  readonly pillarIds: readonly string[];
  readonly initiativeIds: readonly string[];
  readonly roadmapIds: readonly string[];
  readonly assumptionIds: readonly string[];
  readonly constraintIds: readonly string[];
  readonly opportunityIds: readonly string[];
  readonly riskReferenceIds: readonly string[];
  readonly owner: ExecutiveStrategyOwner;
  readonly stakeholders: readonly ExecutiveStrategyStakeholder[];
  readonly metadata: ExecutiveStrategyMetadata;
  readonly metadataOnly: true;
  readonly immutable: true;
}>;

export type ExecutiveStrategyEntityDefinition = Readonly<{
  readonly entityId: string;
  readonly entityName: string;
  readonly contractName: string;
  readonly description: string;
  readonly metadataOnly: true;
  readonly immutable: true;
}>;

export type ExecutiveStrategyDependency = Readonly<{
  readonly dependencyId: "Executive KPI Platform Freeze" | "Executive OKR Platform Freeze";
  readonly compatible: boolean;
  readonly implementationRequired: false;
}>;

export type ExecutiveStrategyConsumer = Readonly<{
  readonly consumerId: string;
  readonly consumerName: string;
  readonly metadataOnly: true;
}>;

export type ExecutiveStrategyPublicApi = Readonly<{
  readonly apiName: string;
  readonly stable: true;
  readonly runtime: false;
}>;

export type ExecutiveStrategyExtensionPolicy = Readonly<{
  readonly policyId: "executive-strategy-foundation-extension-policy";
  readonly extensionMode: "additive-only";
  readonly foundationMutationAllowed: false;
  readonly runtimeExecutionAllowed: false;
  readonly businessLogicAllowed: false;
  readonly strategyExecutionAllowed: false;
  readonly orchestrationAllowed: false;
}>;

export type ExecutiveStrategyReleaseMetadata = Readonly<{
  readonly releaseId: "BUS-17";
  readonly releaseStage: "Foundation";
  readonly metadataOnly: true;
  readonly immutable: true;
}>;

export type ExecutiveStrategyCompatibility = Readonly<{
  readonly compatibilityId: string;
  readonly targetPlatform: string;
  readonly compatibilityStatus: "Compatible" | "Consumer Safe" | "Metadata Only";
  readonly metadataOnly: true;
  readonly immutable: true;
}>;

export type ExecutiveStrategyPlatformIdentity = Readonly<{
  readonly platformName: "Executive Strategy Platform";
  readonly platformId: "BUS-17";
  readonly version: "1.0.0";
  readonly description: string;
  readonly status: "Foundation";
  readonly domainIdentity: "Executive Strategy Domain";
  readonly namespace: "executive.strategy";
  readonly releaseMetadata: ExecutiveStrategyReleaseMetadata;
}>;

export type ExecutiveStrategyPlatformRegistry = Readonly<{
  readonly identity: ExecutiveStrategyPlatformIdentity;
  readonly entities: readonly ExecutiveStrategyEntityDefinition[];
  readonly strategyTypes: readonly string[];
  readonly statuses: readonly ExecutiveStrategyStatus[];
  readonly priorities: readonly ExecutiveStrategyPriority[];
  readonly lifecycles: readonly ExecutiveStrategyLifecycle[];
  readonly publicApis: readonly ExecutiveStrategyPublicApi[];
  readonly dependencies: readonly ExecutiveStrategyDependency[];
  readonly extensionPolicy: ExecutiveStrategyExtensionPolicy;
  readonly consumers: readonly ExecutiveStrategyConsumer[];
  readonly compatibility: readonly ExecutiveStrategyCompatibility[];
}>;

export type ExecutiveStrategyPlatformManifest = Readonly<{
  readonly identity: ExecutiveStrategyPlatformIdentity;
  readonly domainDefinition: readonly ExecutiveStrategyEntityDefinition[];
  readonly publicApis: readonly ExecutiveStrategyPublicApi[];
  readonly dependencies: readonly ExecutiveStrategyDependency[];
  readonly extensionPolicy: ExecutiveStrategyExtensionPolicy;
  readonly compatibility: readonly ExecutiveStrategyCompatibility[];
  readonly kpiFreezeAvailable: boolean;
  readonly okrFreezeAvailable: boolean;
  readonly certificationStatus: "Foundation Certified";
  readonly deterministicFingerprint: string;
}>;

export type ExecutiveStrategyPlatformValidation = Readonly<{
  readonly valid: boolean;
  readonly errors: readonly string[];
  readonly warnings: readonly string[];
}>;

export type ExecutiveStrategyPlatform = Readonly<{
  readonly registry: ExecutiveStrategyPlatformRegistry;
  readonly manifest: ExecutiveStrategyPlatformManifest;
  readonly validation: ExecutiveStrategyPlatformValidation;
}>;

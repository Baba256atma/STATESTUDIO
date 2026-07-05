import type {
  ExecutiveStrategyCategory,
  ExecutiveStrategyHorizon,
  ExecutiveStrategyLifecycle,
  ExecutiveStrategyMetadata,
  ExecutiveStrategyOwner,
  ExecutiveStrategyPriority,
  ExecutiveStrategicKpiReference,
  ExecutiveStrategicOkrReference,
  ExecutiveStrategicRiskReference,
  ExecutiveStrategyStakeholder,
  ExecutiveStrategyStatus,
} from "./executiveStrategyIndex.ts";

export type ExecutiveStrategyVersion = Readonly<{
  readonly versionId: string;
  readonly versionLabel: string;
  readonly semanticVersion: "1.0.0";
  readonly metadataOnly: true;
  readonly immutable: true;
}>;

export type ExecutiveStrategyIdentity = Readonly<{
  readonly strategyId: string;
  readonly strategyKey: string;
  readonly metadataOnly: true;
  readonly immutable: true;
}>;

export type ExecutiveStrategyName = Readonly<{
  readonly shortName: string;
  readonly displayName: string;
  readonly metadataOnly: true;
  readonly immutable: true;
}>;

export type ExecutiveStrategyMission = Readonly<{
  readonly missionId: string;
  readonly missionStatement: string;
  readonly metadataOnly: true;
  readonly immutable: true;
}>;

export type ExecutiveStrategyVision = Readonly<{
  readonly visionId: string;
  readonly visionStatement: string;
  readonly metadataOnly: true;
  readonly immutable: true;
}>;

export type ExecutiveStrategicIntent = Readonly<{
  readonly intentId: string;
  readonly intentStatement: string;
  readonly metadataOnly: true;
  readonly immutable: true;
}>;

export type ExecutiveStrategicScope = Readonly<{
  readonly scopeId: string;
  readonly scopeStatement: string;
  readonly metadataOnly: true;
  readonly immutable: true;
}>;

export type ExecutiveStrategicPurpose = Readonly<{
  readonly purposeId: string;
  readonly purposeStatement: string;
  readonly metadataOnly: true;
  readonly immutable: true;
}>;

export type ExecutiveStrategicContext = Readonly<{
  readonly contextId: string;
  readonly contextStatement: string;
  readonly metadataOnly: true;
  readonly immutable: true;
}>;

export type ExecutiveStrategySuccessCriteria = Readonly<{
  readonly criteriaId: string;
  readonly criteriaStatement: string;
  readonly metadataOnly: true;
  readonly immutable: true;
}>;

export type ExecutiveStrategyDefinition = Readonly<{
  readonly identity: ExecutiveStrategyIdentity;
  readonly name: ExecutiveStrategyName;
  readonly description: string;
  readonly mission: ExecutiveStrategyMission;
  readonly vision: ExecutiveStrategyVision;
  readonly strategicIntent: ExecutiveStrategicIntent;
  readonly strategicScope: ExecutiveStrategicScope;
  readonly strategicPurpose: ExecutiveStrategicPurpose;
  readonly strategicContext: ExecutiveStrategicContext;
  readonly timeHorizon: ExecutiveStrategyHorizon;
  readonly category: ExecutiveStrategyCategory;
  readonly priority: ExecutiveStrategyPriority;
  readonly status: ExecutiveStrategyStatus;
  readonly lifecycle: ExecutiveStrategyLifecycle;
  readonly owner: ExecutiveStrategyOwner;
  readonly sponsor: ExecutiveStrategyOwner;
  readonly stakeholders: readonly ExecutiveStrategyStakeholder[];
  readonly assumptions: readonly string[];
  readonly constraints: readonly string[];
  readonly successCriteria: readonly ExecutiveStrategySuccessCriteria[];
  readonly riskReferences: readonly ExecutiveStrategicRiskReference[];
  readonly kpiReferences: readonly ExecutiveStrategicKpiReference[];
  readonly okrReferences: readonly ExecutiveStrategicOkrReference[];
  readonly metadata: ExecutiveStrategyMetadata;
  readonly version: ExecutiveStrategyVersion;
  readonly metadataOnly: true;
  readonly immutable: true;
}>;

export type ExecutiveStrategyDefinitionDependency = Readonly<{
  readonly dependencyId: "BUS-17 Executive Strategy Foundation" | "Executive KPI Platform Freeze" | "Executive OKR Platform Freeze";
  readonly compatible: boolean;
  readonly implementationRequired: false;
}>;

export type ExecutiveStrategyDefinitionExtensionPolicy = Readonly<{
  readonly policyId: "executive-strategy-definition-extension-policy";
  readonly extensionMode: "additive-only";
  readonly definitionMutationAllowed: false;
  readonly runtimeExecutionAllowed: false;
  readonly planningAllowed: false;
  readonly simulationAllowed: false;
  readonly businessLogicAllowed: false;
}>;

export type ExecutiveStrategyDefinitionPublicApi = Readonly<{
  readonly apiName: string;
  readonly stable: true;
  readonly runtime: false;
}>;

export type ExecutiveStrategyDefinitionManifest = Readonly<{
  readonly platformId: "BUS-18";
  readonly platformName: "Executive Strategy Definition Platform";
  readonly version: "1.0.0";
  readonly foundationPlatformId: "BUS-17";
  readonly strategyDefinitionCount: number;
  readonly categoryCount: number;
  readonly statusCount: number;
  readonly priorityCount: number;
  readonly lifecycleCount: number;
  readonly versionCount: number;
  readonly ownerCount: number;
  readonly publicApis: readonly string[];
  readonly kpiFreezeAvailable: boolean;
  readonly okrFreezeAvailable: boolean;
  readonly strategyFoundationAvailable: boolean;
  readonly certificationStatus: "Definition Platform Certified";
  readonly deterministicFingerprint: string;
}>;

export type ExecutiveStrategyDefinitionRegistry = Readonly<{
  readonly platformId: "BUS-18";
  readonly platformName: "Executive Strategy Definition Platform";
  readonly version: "1.0.0";
  readonly foundationPlatformId: "BUS-17";
  readonly kpiFreezeDependency: "BUS-12";
  readonly okrFreezeDependency: "BUS-16";
  readonly strategyDefinitions: readonly ExecutiveStrategyDefinition[];
  readonly categories: readonly ExecutiveStrategyCategory[];
  readonly statuses: readonly ExecutiveStrategyStatus[];
  readonly priorities: readonly ExecutiveStrategyPriority[];
  readonly lifecycles: readonly ExecutiveStrategyLifecycle[];
  readonly versions: readonly ExecutiveStrategyVersion[];
  readonly owners: readonly ExecutiveStrategyOwner[];
  readonly publicApis: readonly string[];
  readonly extensionPolicy: ExecutiveStrategyDefinitionExtensionPolicy;
  readonly metadataOnly: true;
  readonly immutable: true;
}>;

export type ExecutiveStrategyDefinitionValidation = Readonly<{
  readonly valid: boolean;
  readonly errors: readonly string[];
  readonly warnings: readonly string[];
}>;

export type ExecutiveStrategyDefinitionPlatform = Readonly<{
  readonly registry: ExecutiveStrategyDefinitionRegistry;
  readonly manifest: ExecutiveStrategyDefinitionManifest;
  readonly validation: ExecutiveStrategyDefinitionValidation;
}>;

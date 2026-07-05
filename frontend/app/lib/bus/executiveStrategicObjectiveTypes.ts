import type {
  ExecutiveStrategyCategory,
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
import type { ExecutiveStrategyVersion } from "./executiveStrategyDefinitionIndex.ts";

export type ExecutiveStrategicObjectiveIdentity = Readonly<{
  readonly objectiveId: string;
  readonly objectiveKey: string;
  readonly metadataOnly: true;
  readonly immutable: true;
}>;

export type ExecutiveStrategicObjectiveName = Readonly<{
  readonly shortName: string;
  readonly displayName: string;
  readonly metadataOnly: true;
  readonly immutable: true;
}>;

export type ExecutiveStrategicObjectivePurpose = Readonly<{
  readonly purposeId: string;
  readonly purposeStatement: string;
  readonly metadataOnly: true;
  readonly immutable: true;
}>;

export type ExecutiveStrategicObjectiveScope = Readonly<{
  readonly scopeId: string;
  readonly scopeStatement: string;
  readonly metadataOnly: true;
  readonly immutable: true;
}>;

export type ExecutiveStrategicObjectiveSuccessCriteria = Readonly<{
  readonly criteriaId: string;
  readonly criteriaStatement: string;
  readonly metadataOnly: true;
  readonly immutable: true;
}>;

export type ExecutiveStrategicObjectiveDependency = Readonly<{
  readonly dependencyId: string;
  readonly targetObjectiveId: string;
  readonly dependencyType: "Requires" | "Supports" | "References";
  readonly metadataOnly: true;
  readonly immutable: true;
}>;

export type ExecutiveStrategicObjectiveRelationshipType =
  | "StrategyToObjective"
  | "ObjectiveToStrategy"
  | "ThemeToObjective"
  | "ObjectiveToTheme"
  | "ParentObjectiveToChildObjective"
  | "ObjectiveToKpiReference"
  | "ObjectiveToOkrReference"
  | "ObjectiveToRiskReference"
  | "ObjectiveToDependency";

export type ExecutiveStrategicObjectiveRelationship = Readonly<{
  readonly relationshipId: string;
  readonly relationshipType: ExecutiveStrategicObjectiveRelationshipType;
  readonly sourceId: string;
  readonly targetId: string;
  readonly metadataOnly: true;
  readonly immutable: true;
}>;

export type ExecutiveStrategicObjective = Readonly<{
  readonly identity: ExecutiveStrategicObjectiveIdentity;
  readonly name: ExecutiveStrategicObjectiveName;
  readonly description: string;
  readonly purpose: ExecutiveStrategicObjectivePurpose;
  readonly scope: ExecutiveStrategicObjectiveScope;
  readonly category: ExecutiveStrategyCategory;
  readonly priority: ExecutiveStrategyPriority;
  readonly status: ExecutiveStrategyStatus;
  readonly lifecycle: ExecutiveStrategyLifecycle;
  readonly owner: ExecutiveStrategyOwner;
  readonly sponsor: ExecutiveStrategyOwner;
  readonly stakeholders: readonly ExecutiveStrategyStakeholder[];
  readonly parentObjectiveId: string | null;
  readonly childObjectiveIds: readonly string[];
  readonly strategyReferenceIds: readonly string[];
  readonly themeReferenceIds: readonly string[];
  readonly kpiReferences: readonly ExecutiveStrategicKpiReference[];
  readonly okrReferences: readonly ExecutiveStrategicOkrReference[];
  readonly riskReferences: readonly ExecutiveStrategicRiskReference[];
  readonly dependencies: readonly ExecutiveStrategicObjectiveDependency[];
  readonly assumptions: readonly string[];
  readonly constraints: readonly string[];
  readonly successCriteria: readonly ExecutiveStrategicObjectiveSuccessCriteria[];
  readonly metadata: ExecutiveStrategyMetadata;
  readonly version: ExecutiveStrategyVersion;
  readonly metadataOnly: true;
  readonly immutable: true;
}>;

export type ExecutiveStrategicObjectivePlatformDependency = Readonly<{
  readonly dependencyId:
    | "BUS-17 Executive Strategy Foundation"
    | "BUS-18 Executive Strategy Definition Platform"
    | "BUS-19 Executive Strategic Themes Platform"
    | "Executive KPI Platform Freeze"
    | "Executive OKR Platform Freeze";
  readonly compatible: boolean;
  readonly implementationRequired: false;
}>;

export type ExecutiveStrategicObjectiveExtensionPolicy = Readonly<{
  readonly policyId: "executive-strategic-objective-extension-policy";
  readonly extensionMode: "additive-only";
  readonly objectiveMutationAllowed: false;
  readonly runtimeExecutionAllowed: false;
  readonly initiativeManagementAllowed: false;
  readonly roadmapManagementAllowed: false;
  readonly planningAllowed: false;
  readonly businessLogicAllowed: false;
}>;

export type ExecutiveStrategicObjectiveManifest = Readonly<{
  readonly platformId: "BUS-20";
  readonly platformName: "Executive Strategic Objectives Platform";
  readonly version: "1.0.0";
  readonly foundationPlatformId: "BUS-17";
  readonly definitionPlatformId: "BUS-18";
  readonly themePlatformId: "BUS-19";
  readonly objectiveCount: number;
  readonly categoryCount: number;
  readonly statusCount: number;
  readonly priorityCount: number;
  readonly lifecycleCount: number;
  readonly ownerCount: number;
  readonly versionCount: number;
  readonly relationshipCount: number;
  readonly publicApis: readonly string[];
  readonly strategyFoundationAvailable: boolean;
  readonly strategyDefinitionsAvailable: boolean;
  readonly strategicThemesAvailable: boolean;
  readonly kpiFreezeAvailable: boolean;
  readonly okrFreezeAvailable: boolean;
  readonly certificationStatus: "Strategic Objectives Platform Certified";
  readonly deterministicFingerprint: string;
}>;

export type ExecutiveStrategicObjectiveRegistry = Readonly<{
  readonly platformId: "BUS-20";
  readonly platformName: "Executive Strategic Objectives Platform";
  readonly version: "1.0.0";
  readonly foundationPlatformId: "BUS-17";
  readonly definitionPlatformId: "BUS-18";
  readonly themePlatformId: "BUS-19";
  readonly kpiFreezeDependency: "BUS-12";
  readonly okrFreezeDependency: "BUS-16";
  readonly objectives: readonly ExecutiveStrategicObjective[];
  readonly categories: readonly ExecutiveStrategyCategory[];
  readonly statuses: readonly ExecutiveStrategyStatus[];
  readonly priorities: readonly ExecutiveStrategyPriority[];
  readonly lifecycles: readonly ExecutiveStrategyLifecycle[];
  readonly owners: readonly ExecutiveStrategyOwner[];
  readonly versions: readonly ExecutiveStrategyVersion[];
  readonly relationships: readonly ExecutiveStrategicObjectiveRelationship[];
  readonly publicApis: readonly string[];
  readonly extensionPolicy: ExecutiveStrategicObjectiveExtensionPolicy;
  readonly metadataOnly: true;
  readonly immutable: true;
}>;

export type ExecutiveStrategicObjectiveValidation = Readonly<{
  readonly valid: boolean;
  readonly errors: readonly string[];
  readonly warnings: readonly string[];
}>;

export type ExecutiveStrategicObjectivesPlatform = Readonly<{
  readonly registry: ExecutiveStrategicObjectiveRegistry;
  readonly manifest: ExecutiveStrategicObjectiveManifest;
  readonly validation: ExecutiveStrategicObjectiveValidation;
}>;

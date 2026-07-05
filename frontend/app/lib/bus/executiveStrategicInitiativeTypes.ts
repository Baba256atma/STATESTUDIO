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

export type ExecutiveStrategicInitiativeIdentity = Readonly<{
  readonly initiativeId: string;
  readonly initiativeKey: string;
  readonly metadataOnly: true;
  readonly immutable: true;
}>;

export type ExecutiveStrategicInitiativeName = Readonly<{
  readonly shortName: string;
  readonly displayName: string;
  readonly metadataOnly: true;
  readonly immutable: true;
}>;

export type ExecutiveStrategicInitiativePurpose = Readonly<{
  readonly purposeId: string;
  readonly purposeStatement: string;
  readonly metadataOnly: true;
  readonly immutable: true;
}>;

export type ExecutiveStrategicInitiativeScope = Readonly<{
  readonly scopeId: string;
  readonly scopeStatement: string;
  readonly metadataOnly: true;
  readonly immutable: true;
}>;

export type ExecutiveStrategicInitiativeSuccessCriteria = Readonly<{
  readonly criteriaId: string;
  readonly criteriaStatement: string;
  readonly metadataOnly: true;
  readonly immutable: true;
}>;

export type ExecutiveStrategicInitiativeDependency = Readonly<{
  readonly dependencyId: string;
  readonly targetInitiativeId: string;
  readonly dependencyType: "Requires" | "Supports" | "References";
  readonly metadataOnly: true;
  readonly immutable: true;
}>;

export type ExecutiveStrategicInitiativeMilestone = Readonly<{
  readonly milestoneId: string;
  readonly milestoneName: string;
  readonly milestoneDescription: string;
  readonly milestoneType: "Readiness" | "Coordination" | "Delivery" | "Validation";
  readonly metadataOnly: true;
  readonly immutable: true;
}>;

export type ExecutiveStrategicInitiativeDeliverable = Readonly<{
  readonly deliverableId: string;
  readonly deliverableName: string;
  readonly deliverableDescription: string;
  readonly metadataOnly: true;
  readonly immutable: true;
}>;

export type ExecutiveStrategicInitiativeRelationshipType =
  | "StrategyToInitiative"
  | "InitiativeToStrategy"
  | "ThemeToInitiative"
  | "InitiativeToTheme"
  | "ObjectiveToInitiative"
  | "InitiativeToObjective"
  | "ParentInitiativeToChildInitiative"
  | "InitiativeToKpiReference"
  | "InitiativeToOkrReference"
  | "InitiativeToRiskReference"
  | "InitiativeToDependency"
  | "InitiativeToMilestone";

export type ExecutiveStrategicInitiativeRelationship = Readonly<{
  readonly relationshipId: string;
  readonly relationshipType: ExecutiveStrategicInitiativeRelationshipType;
  readonly sourceId: string;
  readonly targetId: string;
  readonly metadataOnly: true;
  readonly immutable: true;
}>;

export type ExecutiveStrategicInitiative = Readonly<{
  readonly identity: ExecutiveStrategicInitiativeIdentity;
  readonly name: ExecutiveStrategicInitiativeName;
  readonly description: string;
  readonly purpose: ExecutiveStrategicInitiativePurpose;
  readonly scope: ExecutiveStrategicInitiativeScope;
  readonly category: ExecutiveStrategyCategory;
  readonly priority: ExecutiveStrategyPriority;
  readonly status: ExecutiveStrategyStatus;
  readonly lifecycle: ExecutiveStrategyLifecycle;
  readonly owner: ExecutiveStrategyOwner;
  readonly sponsor: ExecutiveStrategyOwner;
  readonly stakeholders: readonly ExecutiveStrategyStakeholder[];
  readonly parentInitiativeId: string | null;
  readonly childInitiativeIds: readonly string[];
  readonly strategyReferenceIds: readonly string[];
  readonly themeReferenceIds: readonly string[];
  readonly objectiveReferenceIds: readonly string[];
  readonly kpiReferences: readonly ExecutiveStrategicKpiReference[];
  readonly okrReferences: readonly ExecutiveStrategicOkrReference[];
  readonly riskReferences: readonly ExecutiveStrategicRiskReference[];
  readonly dependencies: readonly ExecutiveStrategicInitiativeDependency[];
  readonly milestones: readonly ExecutiveStrategicInitiativeMilestone[];
  readonly deliverables: readonly ExecutiveStrategicInitiativeDeliverable[];
  readonly successCriteria: readonly ExecutiveStrategicInitiativeSuccessCriteria[];
  readonly assumptions: readonly string[];
  readonly constraints: readonly string[];
  readonly metadata: ExecutiveStrategyMetadata;
  readonly version: ExecutiveStrategyVersion;
  readonly metadataOnly: true;
  readonly immutable: true;
}>;

export type ExecutiveStrategicInitiativePlatformDependency = Readonly<{
  readonly dependencyId:
    | "BUS-17 Executive Strategy Foundation"
    | "BUS-18 Executive Strategy Definition Platform"
    | "BUS-19 Executive Strategic Themes Platform"
    | "BUS-20 Executive Strategic Objectives Platform"
    | "Executive KPI Platform Freeze"
    | "Executive OKR Platform Freeze";
  readonly compatible: boolean;
  readonly implementationRequired: false;
}>;

export type ExecutiveStrategicInitiativeExtensionPolicy = Readonly<{
  readonly policyId: "executive-strategic-initiative-extension-policy";
  readonly extensionMode: "additive-only";
  readonly initiativeMutationAllowed: false;
  readonly runtimeExecutionAllowed: false;
  readonly roadmapSchedulingAllowed: false;
  readonly monitoringAllowed: false;
  readonly planningAllowed: false;
  readonly businessLogicAllowed: false;
}>;

export type ExecutiveStrategicInitiativeManifest = Readonly<{
  readonly platformId: "BUS-21";
  readonly platformName: "Executive Strategic Initiatives Platform";
  readonly version: "1.0.0";
  readonly foundationPlatformId: "BUS-17";
  readonly definitionPlatformId: "BUS-18";
  readonly themePlatformId: "BUS-19";
  readonly objectivePlatformId: "BUS-20";
  readonly initiativeCount: number;
  readonly categoryCount: number;
  readonly statusCount: number;
  readonly priorityCount: number;
  readonly lifecycleCount: number;
  readonly ownerCount: number;
  readonly versionCount: number;
  readonly milestoneCount: number;
  readonly relationshipCount: number;
  readonly publicApis: readonly string[];
  readonly strategyFoundationAvailable: boolean;
  readonly strategyDefinitionsAvailable: boolean;
  readonly strategicThemesAvailable: boolean;
  readonly strategicObjectivesAvailable: boolean;
  readonly kpiFreezeAvailable: boolean;
  readonly okrFreezeAvailable: boolean;
  readonly certificationStatus: "Strategic Initiatives Platform Certified";
  readonly deterministicFingerprint: string;
}>;

export type ExecutiveStrategicInitiativeRegistry = Readonly<{
  readonly platformId: "BUS-21";
  readonly platformName: "Executive Strategic Initiatives Platform";
  readonly version: "1.0.0";
  readonly foundationPlatformId: "BUS-17";
  readonly definitionPlatformId: "BUS-18";
  readonly themePlatformId: "BUS-19";
  readonly objectivePlatformId: "BUS-20";
  readonly kpiFreezeDependency: "BUS-12";
  readonly okrFreezeDependency: "BUS-16";
  readonly initiatives: readonly ExecutiveStrategicInitiative[];
  readonly categories: readonly ExecutiveStrategyCategory[];
  readonly statuses: readonly ExecutiveStrategyStatus[];
  readonly priorities: readonly ExecutiveStrategyPriority[];
  readonly lifecycles: readonly ExecutiveStrategyLifecycle[];
  readonly owners: readonly ExecutiveStrategyOwner[];
  readonly versions: readonly ExecutiveStrategyVersion[];
  readonly milestones: readonly ExecutiveStrategicInitiativeMilestone[];
  readonly relationships: readonly ExecutiveStrategicInitiativeRelationship[];
  readonly publicApis: readonly string[];
  readonly extensionPolicy: ExecutiveStrategicInitiativeExtensionPolicy;
  readonly metadataOnly: true;
  readonly immutable: true;
}>;

export type ExecutiveStrategicInitiativeValidation = Readonly<{
  readonly valid: boolean;
  readonly errors: readonly string[];
  readonly warnings: readonly string[];
}>;

export type ExecutiveStrategicInitiativesPlatform = Readonly<{
  readonly registry: ExecutiveStrategicInitiativeRegistry;
  readonly manifest: ExecutiveStrategicInitiativeManifest;
  readonly validation: ExecutiveStrategicInitiativeValidation;
}>;

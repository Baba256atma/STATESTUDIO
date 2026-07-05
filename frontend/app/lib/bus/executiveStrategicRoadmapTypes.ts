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

export type ExecutiveStrategicRoadmapIdentity = Readonly<{
  readonly roadmapId: string;
  readonly roadmapKey: string;
  readonly metadataOnly: true;
  readonly immutable: true;
}>;

export type ExecutiveStrategicRoadmapName = Readonly<{
  readonly shortName: string;
  readonly displayName: string;
  readonly metadataOnly: true;
  readonly immutable: true;
}>;

export type ExecutiveStrategicRoadmapPurpose = Readonly<{
  readonly purposeId: string;
  readonly purposeStatement: string;
  readonly metadataOnly: true;
  readonly immutable: true;
}>;

export type ExecutiveStrategicRoadmapScope = Readonly<{
  readonly scopeId: string;
  readonly scopeStatement: string;
  readonly metadataOnly: true;
  readonly immutable: true;
}>;

export type ExecutiveStrategicRoadmapTimeHorizon = Readonly<{
  readonly horizonId: string;
  readonly horizonLabel: string;
  readonly horizonSpan: "Near-Term" | "Mid-Term" | "Long-Term";
  readonly metadataOnly: true;
  readonly immutable: true;
}>;

export type ExecutiveStrategicRoadmapPhase = Readonly<{
  readonly phaseId: string;
  readonly phaseName: string;
  readonly phaseDescription: string;
  readonly phaseType: "Foundation" | "Enablement" | "Acceleration" | "Coordination" | "Scale" | "Validation";
  readonly sequenceOrder: number;
  readonly metadataOnly: true;
  readonly immutable: true;
}>;

export type ExecutiveStrategicRoadmapSequence = Readonly<{
  readonly sequenceId: string;
  readonly fromPhaseId: string;
  readonly toPhaseId: string;
  readonly sequenceType: "Precedes" | "Enables" | "Coordinates";
  readonly sequenceOrder: number;
  readonly metadataOnly: true;
  readonly immutable: true;
}>;

export type ExecutiveStrategicRoadmapDependency = Readonly<{
  readonly dependencyId: string;
  readonly targetRoadmapId: string;
  readonly dependencyType: "Requires" | "Supports" | "References";
  readonly metadataOnly: true;
  readonly immutable: true;
}>;

export type ExecutiveStrategicRoadmapMilestone = Readonly<{
  readonly milestoneId: string;
  readonly milestoneName: string;
  readonly milestoneDescription: string;
  readonly milestoneType: "Readiness" | "Transition" | "Delivery" | "Validation";
  readonly metadataOnly: true;
  readonly immutable: true;
}>;

export type ExecutiveStrategicRoadmapSuccessCriteria = Readonly<{
  readonly criteriaId: string;
  readonly criteriaStatement: string;
  readonly metadataOnly: true;
  readonly immutable: true;
}>;

export type ExecutiveStrategicRoadmapRelationshipType =
  | "StrategyToRoadmap"
  | "RoadmapToStrategy"
  | "ThemeToRoadmap"
  | "RoadmapToTheme"
  | "ObjectiveToRoadmap"
  | "RoadmapToObjective"
  | "InitiativeToRoadmap"
  | "RoadmapToInitiative"
  | "RoadmapToKpiReference"
  | "RoadmapToOkrReference"
  | "RoadmapToRiskReference"
  | "RoadmapToDependency"
  | "RoadmapToMilestone"
  | "RoadmapToPhase";

export type ExecutiveStrategicRoadmapRelationship = Readonly<{
  readonly relationshipId: string;
  readonly relationshipType: ExecutiveStrategicRoadmapRelationshipType;
  readonly sourceId: string;
  readonly targetId: string;
  readonly metadataOnly: true;
  readonly immutable: true;
}>;

export type ExecutiveStrategicRoadmap = Readonly<{
  readonly identity: ExecutiveStrategicRoadmapIdentity;
  readonly name: ExecutiveStrategicRoadmapName;
  readonly description: string;
  readonly purpose: ExecutiveStrategicRoadmapPurpose;
  readonly scope: ExecutiveStrategicRoadmapScope;
  readonly category: ExecutiveStrategyCategory;
  readonly priority: ExecutiveStrategyPriority;
  readonly status: ExecutiveStrategyStatus;
  readonly lifecycle: ExecutiveStrategyLifecycle;
  readonly owner: ExecutiveStrategyOwner;
  readonly sponsor: ExecutiveStrategyOwner;
  readonly stakeholders: readonly ExecutiveStrategyStakeholder[];
  readonly timeHorizon: ExecutiveStrategicRoadmapTimeHorizon;
  readonly phases: readonly ExecutiveStrategicRoadmapPhase[];
  readonly sequence: readonly ExecutiveStrategicRoadmapSequence[];
  readonly dependencies: readonly ExecutiveStrategicRoadmapDependency[];
  readonly strategyReferenceIds: readonly string[];
  readonly themeReferenceIds: readonly string[];
  readonly objectiveReferenceIds: readonly string[];
  readonly initiativeReferenceIds: readonly string[];
  readonly kpiReferences: readonly ExecutiveStrategicKpiReference[];
  readonly okrReferences: readonly ExecutiveStrategicOkrReference[];
  readonly riskReferences: readonly ExecutiveStrategicRiskReference[];
  readonly milestones: readonly ExecutiveStrategicRoadmapMilestone[];
  readonly successCriteria: readonly ExecutiveStrategicRoadmapSuccessCriteria[];
  readonly assumptions: readonly string[];
  readonly constraints: readonly string[];
  readonly metadata: ExecutiveStrategyMetadata;
  readonly version: ExecutiveStrategyVersion;
  readonly metadataOnly: true;
  readonly immutable: true;
}>;

export type ExecutiveStrategicRoadmapPlatformDependency = Readonly<{
  readonly dependencyId:
    | "BUS-17 Executive Strategy Foundation"
    | "BUS-18 Executive Strategy Definition Platform"
    | "BUS-19 Executive Strategic Themes Platform"
    | "BUS-20 Executive Strategic Objectives Platform"
    | "BUS-21 Executive Strategic Initiatives Platform"
    | "Executive KPI Platform Freeze"
    | "Executive OKR Platform Freeze";
  readonly compatible: boolean;
  readonly implementationRequired: false;
}>;

export type ExecutiveStrategicRoadmapExtensionPolicy = Readonly<{
  readonly policyId: "executive-strategic-roadmap-extension-policy";
  readonly extensionMode: "additive-only";
  readonly roadmapMutationAllowed: false;
  readonly runtimeExecutionAllowed: false;
  readonly schedulingAllowed: false;
  readonly calendarLogicAllowed: false;
  readonly simulationAllowed: false;
  readonly businessLogicAllowed: false;
}>;

export type ExecutiveStrategicRoadmapManifest = Readonly<{
  readonly platformId: "BUS-22";
  readonly platformName: "Executive Strategic Roadmaps Platform";
  readonly version: "1.0.0";
  readonly foundationPlatformId: "BUS-17";
  readonly definitionPlatformId: "BUS-18";
  readonly themePlatformId: "BUS-19";
  readonly objectivePlatformId: "BUS-20";
  readonly initiativePlatformId: "BUS-21";
  readonly roadmapCount: number;
  readonly phaseCount: number;
  readonly milestoneCount: number;
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
  readonly strategicObjectivesAvailable: boolean;
  readonly strategicInitiativesAvailable: boolean;
  readonly kpiFreezeAvailable: boolean;
  readonly okrFreezeAvailable: boolean;
  readonly certificationStatus: "Strategic Roadmaps Platform Certified";
  readonly deterministicFingerprint: string;
}>;

export type ExecutiveStrategicRoadmapRegistry = Readonly<{
  readonly platformId: "BUS-22";
  readonly platformName: "Executive Strategic Roadmaps Platform";
  readonly version: "1.0.0";
  readonly foundationPlatformId: "BUS-17";
  readonly definitionPlatformId: "BUS-18";
  readonly themePlatformId: "BUS-19";
  readonly objectivePlatformId: "BUS-20";
  readonly initiativePlatformId: "BUS-21";
  readonly kpiFreezeDependency: "BUS-12";
  readonly okrFreezeDependency: "BUS-16";
  readonly roadmaps: readonly ExecutiveStrategicRoadmap[];
  readonly phases: readonly ExecutiveStrategicRoadmapPhase[];
  readonly milestones: readonly ExecutiveStrategicRoadmapMilestone[];
  readonly categories: readonly ExecutiveStrategyCategory[];
  readonly statuses: readonly ExecutiveStrategyStatus[];
  readonly priorities: readonly ExecutiveStrategyPriority[];
  readonly lifecycles: readonly ExecutiveStrategyLifecycle[];
  readonly owners: readonly ExecutiveStrategyOwner[];
  readonly versions: readonly ExecutiveStrategyVersion[];
  readonly relationships: readonly ExecutiveStrategicRoadmapRelationship[];
  readonly publicApis: readonly string[];
  readonly extensionPolicy: ExecutiveStrategicRoadmapExtensionPolicy;
  readonly metadataOnly: true;
  readonly immutable: true;
}>;

export type ExecutiveStrategicRoadmapValidation = Readonly<{
  readonly valid: boolean;
  readonly errors: readonly string[];
  readonly warnings: readonly string[];
}>;

export type ExecutiveStrategicRoadmapsPlatform = Readonly<{
  readonly registry: ExecutiveStrategicRoadmapRegistry;
  readonly manifest: ExecutiveStrategicRoadmapManifest;
  readonly validation: ExecutiveStrategicRoadmapValidation;
}>;

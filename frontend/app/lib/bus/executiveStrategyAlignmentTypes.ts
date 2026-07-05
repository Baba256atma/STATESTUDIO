import type {
  ExecutiveStrategyLifecycle,
  ExecutiveStrategyMetadata,
  ExecutiveStrategyOwner,
  ExecutiveStrategyPriority,
  ExecutiveStrategicKpiReference,
  ExecutiveStrategicOkrReference,
  ExecutiveStrategicRiskReference,
  ExecutiveStrategyStakeholder,
} from "./executiveStrategyIndex.ts";
import type { ExecutiveStrategyVersion } from "./executiveStrategyDefinitionIndex.ts";

export type ExecutiveStrategyAlignmentType =
  | "StrategyThemeAlignment"
  | "StrategyObjectiveAlignment"
  | "StrategyExecutionAlignment";

export type ExecutiveStrategyAlignmentStatus =
  | "Declared"
  | "Mapped"
  | "Aligned"
  | "Validated"
  | "Frozen";

export type ExecutiveStrategyAlignmentIdentity = Readonly<{
  readonly alignmentId: string;
  readonly alignmentKey: string;
  readonly metadataOnly: true;
  readonly immutable: true;
}>;

export type ExecutiveStrategyAlignmentName = Readonly<{
  readonly shortName: string;
  readonly displayName: string;
  readonly metadataOnly: true;
  readonly immutable: true;
}>;

export type ExecutiveStrategyAlignmentScope = Readonly<{
  readonly scopeId: string;
  readonly scopeStatement: string;
  readonly metadataOnly: true;
  readonly immutable: true;
}>;

export type ExecutiveStrategyAlignmentPurpose = Readonly<{
  readonly purposeId: string;
  readonly purposeStatement: string;
  readonly metadataOnly: true;
  readonly immutable: true;
}>;

export type ExecutiveStrategyAlignmentContext = Readonly<{
  readonly contextId: string;
  readonly contextStatement: string;
  readonly metadataOnly: true;
  readonly immutable: true;
}>;

export type ExecutiveStrategyAlignmentEvidence = Readonly<{
  readonly evidenceId: string;
  readonly evidenceName: string;
  readonly evidenceDescription: string;
  readonly evidenceType: "Traceability" | "Dependency" | "ReferenceCoverage" | "Governance";
  readonly metadataOnly: true;
  readonly immutable: true;
}>;

export type ExecutiveStrategyAlignmentConstraint = Readonly<{
  readonly constraintId: string;
  readonly constraintName: string;
  readonly constraintDescription: string;
  readonly constraintType: "Governance" | "Capacity" | "Sequencing" | "Scope";
  readonly metadataOnly: true;
  readonly immutable: true;
}>;

export type ExecutiveStrategyAlignmentDependency = Readonly<{
  readonly dependencyId: string;
  readonly dependencyName: string;
  readonly dependencyDescription: string;
  readonly dependencyType: "Requires" | "Supports" | "References";
  readonly metadataOnly: true;
  readonly immutable: true;
}>;

export type ExecutiveStrategyAlignmentRelationshipType =
  | "StrategyToTheme"
  | "ThemeToStrategy"
  | "StrategyToObjective"
  | "ObjectiveToStrategy"
  | "StrategyToInitiative"
  | "InitiativeToStrategy"
  | "StrategyToRoadmap"
  | "RoadmapToStrategy"
  | "ThemeToObjective"
  | "ObjectiveToTheme"
  | "ThemeToInitiative"
  | "InitiativeToTheme"
  | "ObjectiveToInitiative"
  | "InitiativeToObjective"
  | "ObjectiveToRoadmap"
  | "RoadmapToObjective"
  | "InitiativeToRoadmap"
  | "RoadmapToInitiative"
  | "StrategyToKpiReference"
  | "StrategyToOkrReference"
  | "AlignmentToEvidence"
  | "AlignmentToConstraint"
  | "AlignmentToRisk"
  | "AlignmentToDependency";

export type ExecutiveStrategyAlignmentRelationship = Readonly<{
  readonly relationshipId: string;
  readonly relationshipType: ExecutiveStrategyAlignmentRelationshipType;
  readonly sourceId: string;
  readonly targetId: string;
  readonly metadataOnly: true;
  readonly immutable: true;
}>;

export type ExecutiveStrategyAlignment = Readonly<{
  readonly identity: ExecutiveStrategyAlignmentIdentity;
  readonly name: ExecutiveStrategyAlignmentName;
  readonly description: string;
  readonly alignmentType: ExecutiveStrategyAlignmentType;
  readonly alignmentStatus: ExecutiveStrategyAlignmentStatus;
  readonly lifecycle: ExecutiveStrategyLifecycle;
  readonly priority: ExecutiveStrategyPriority;
  readonly owner: ExecutiveStrategyOwner;
  readonly sponsor: ExecutiveStrategyOwner;
  readonly stakeholders: readonly ExecutiveStrategyStakeholder[];
  readonly scope: ExecutiveStrategyAlignmentScope;
  readonly purpose: ExecutiveStrategyAlignmentPurpose;
  readonly context: ExecutiveStrategyAlignmentContext;
  readonly strategyReferenceIds: readonly string[];
  readonly themeReferenceIds: readonly string[];
  readonly objectiveReferenceIds: readonly string[];
  readonly initiativeReferenceIds: readonly string[];
  readonly roadmapReferenceIds: readonly string[];
  readonly kpiReferences: readonly ExecutiveStrategicKpiReference[];
  readonly okrReferences: readonly ExecutiveStrategicOkrReference[];
  readonly evidence: readonly ExecutiveStrategyAlignmentEvidence[];
  readonly constraints: readonly ExecutiveStrategyAlignmentConstraint[];
  readonly assumptions: readonly string[];
  readonly risks: readonly ExecutiveStrategicRiskReference[];
  readonly dependencies: readonly ExecutiveStrategyAlignmentDependency[];
  readonly metadata: ExecutiveStrategyMetadata;
  readonly version: ExecutiveStrategyVersion;
  readonly metadataOnly: true;
  readonly immutable: true;
}>;

export type ExecutiveStrategyAlignmentPlatformDependency = Readonly<{
  readonly dependencyId:
    | "BUS-17 Executive Strategy Foundation"
    | "BUS-18 Executive Strategy Definition Platform"
    | "BUS-19 Executive Strategic Themes Platform"
    | "BUS-20 Executive Strategic Objectives Platform"
    | "BUS-21 Executive Strategic Initiatives Platform"
    | "BUS-22 Executive Strategic Roadmaps Platform"
    | "Executive KPI Platform Freeze"
    | "Executive OKR Platform Freeze";
  readonly compatible: boolean;
  readonly implementationRequired: false;
}>;

export type ExecutiveStrategyAlignmentExtensionPolicy = Readonly<{
  readonly policyId: "executive-strategy-alignment-extension-policy";
  readonly extensionMode: "additive-only";
  readonly alignmentMutationAllowed: false;
  readonly runtimeExecutionAllowed: false;
  readonly scoringAllowed: false;
  readonly monitoringAllowed: false;
  readonly simulationAllowed: false;
  readonly businessLogicAllowed: false;
}>;

export type ExecutiveStrategyAlignmentManifest = Readonly<{
  readonly platformId: "BUS-23";
  readonly platformName: "Executive Strategy Alignment Platform";
  readonly version: "1.0.0";
  readonly foundationPlatformId: "BUS-17";
  readonly definitionPlatformId: "BUS-18";
  readonly themePlatformId: "BUS-19";
  readonly objectivePlatformId: "BUS-20";
  readonly initiativePlatformId: "BUS-21";
  readonly roadmapPlatformId: "BUS-22";
  readonly alignmentCount: number;
  readonly alignmentTypeCount: number;
  readonly alignmentStatusCount: number;
  readonly priorityCount: number;
  readonly lifecycleCount: number;
  readonly ownerCount: number;
  readonly versionCount: number;
  readonly evidenceCount: number;
  readonly constraintCount: number;
  readonly dependencyCount: number;
  readonly relationshipCount: number;
  readonly publicApis: readonly string[];
  readonly strategyFoundationAvailable: boolean;
  readonly strategyDefinitionsAvailable: boolean;
  readonly strategicThemesAvailable: boolean;
  readonly strategicObjectivesAvailable: boolean;
  readonly strategicInitiativesAvailable: boolean;
  readonly strategicRoadmapsAvailable: boolean;
  readonly kpiFreezeAvailable: boolean;
  readonly okrFreezeAvailable: boolean;
  readonly certificationStatus: "Strategy Alignment Platform Certified";
  readonly deterministicFingerprint: string;
}>;

export type ExecutiveStrategyAlignmentRegistry = Readonly<{
  readonly platformId: "BUS-23";
  readonly platformName: "Executive Strategy Alignment Platform";
  readonly version: "1.0.0";
  readonly foundationPlatformId: "BUS-17";
  readonly definitionPlatformId: "BUS-18";
  readonly themePlatformId: "BUS-19";
  readonly objectivePlatformId: "BUS-20";
  readonly initiativePlatformId: "BUS-21";
  readonly roadmapPlatformId: "BUS-22";
  readonly kpiFreezeDependency: "BUS-12";
  readonly okrFreezeDependency: "BUS-16";
  readonly alignments: readonly ExecutiveStrategyAlignment[];
  readonly alignmentTypes: readonly ExecutiveStrategyAlignmentType[];
  readonly alignmentStatuses: readonly ExecutiveStrategyAlignmentStatus[];
  readonly priorities: readonly ExecutiveStrategyPriority[];
  readonly lifecycles: readonly ExecutiveStrategyLifecycle[];
  readonly evidence: readonly ExecutiveStrategyAlignmentEvidence[];
  readonly constraints: readonly ExecutiveStrategyAlignmentConstraint[];
  readonly dependencies: readonly ExecutiveStrategyAlignmentDependency[];
  readonly owners: readonly ExecutiveStrategyOwner[];
  readonly versions: readonly ExecutiveStrategyVersion[];
  readonly relationships: readonly ExecutiveStrategyAlignmentRelationship[];
  readonly publicApis: readonly string[];
  readonly extensionPolicy: ExecutiveStrategyAlignmentExtensionPolicy;
  readonly metadataOnly: true;
  readonly immutable: true;
}>;

export type ExecutiveStrategyAlignmentValidation = Readonly<{
  readonly valid: boolean;
  readonly errors: readonly string[];
  readonly warnings: readonly string[];
}>;

export type ExecutiveStrategyAlignmentPlatform = Readonly<{
  readonly registry: ExecutiveStrategyAlignmentRegistry;
  readonly manifest: ExecutiveStrategyAlignmentManifest;
  readonly validation: ExecutiveStrategyAlignmentValidation;
}>;

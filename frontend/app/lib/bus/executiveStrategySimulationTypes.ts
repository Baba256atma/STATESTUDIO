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

export type ExecutiveStrategySimulationProfile =
  | "ScenarioDefinitionProfile"
  | "DependencyImpactProfile"
  | "OutcomeVisibilityProfile";

export type ExecutiveStrategySimulationCategory =
  | "Growth"
  | "Operational"
  | "Innovation";

export type ExecutiveStrategySimulationStatus =
  | "Defined"
  | "Prepared"
  | "Validated"
  | "Frozen";

export type ExecutiveStrategySimulationIdentity = Readonly<{
  readonly simulationId: string;
  readonly simulationKey: string;
  readonly metadataOnly: true;
  readonly immutable: true;
}>;

export type ExecutiveStrategySimulationName = Readonly<{
  readonly shortName: string;
  readonly displayName: string;
  readonly metadataOnly: true;
  readonly immutable: true;
}>;

export type ExecutiveStrategySimulationPurpose = Readonly<{
  readonly purposeId: string;
  readonly purposeStatement: string;
  readonly metadataOnly: true;
  readonly immutable: true;
}>;

export type ExecutiveStrategySimulationScope = Readonly<{
  readonly scopeId: string;
  readonly scopeStatement: string;
  readonly metadataOnly: true;
  readonly immutable: true;
}>;

export type ExecutiveStrategySimulationScenarioDefinition = Readonly<{
  readonly scenarioId: string;
  readonly scenarioName: string;
  readonly scenarioDescription: string;
  readonly scenarioType: "Expansion" | "Resilience" | "Integration";
  readonly metadataOnly: true;
  readonly immutable: true;
}>;

export type ExecutiveStrategySimulationAssumption = Readonly<{
  readonly assumptionId: string;
  readonly assumptionName: string;
  readonly assumptionDescription: string;
  readonly metadataOnly: true;
  readonly immutable: true;
}>;

export type ExecutiveStrategySimulationConstraint = Readonly<{
  readonly constraintId: string;
  readonly constraintName: string;
  readonly constraintDescription: string;
  readonly constraintType: "Governance" | "Capacity" | "Sequencing" | "Scope";
  readonly metadataOnly: true;
  readonly immutable: true;
}>;

export type ExecutiveStrategySimulationOutcomeDefinition = Readonly<{
  readonly outcomeId: string;
  readonly outcomeName: string;
  readonly outcomeDescription: string;
  readonly outcomeCategory: "Coverage" | "Readiness" | "Risk" | "Integration";
  readonly metadataOnly: true;
  readonly immutable: true;
}>;

export type ExecutiveStrategySimulationEvidence = Readonly<{
  readonly evidenceId: string;
  readonly evidenceName: string;
  readonly evidenceDescription: string;
  readonly evidenceType: "Traceability" | "Dependency" | "ReferenceCoverage" | "Governance";
  readonly metadataOnly: true;
  readonly immutable: true;
}>;

export type ExecutiveStrategySimulationDependency = Readonly<{
  readonly dependencyId: string;
  readonly dependencyName: string;
  readonly dependencyDescription: string;
  readonly dependencyType: "Requires" | "Supports" | "References";
  readonly metadataOnly: true;
  readonly immutable: true;
}>;

export type ExecutiveStrategySimulationRelationshipType =
  | "StrategyToSimulation"
  | "SimulationToStrategy"
  | "ThemeToSimulation"
  | "SimulationToTheme"
  | "ObjectiveToSimulation"
  | "SimulationToObjective"
  | "InitiativeToSimulation"
  | "SimulationToInitiative"
  | "RoadmapToSimulation"
  | "SimulationToRoadmap"
  | "MonitoringToSimulation"
  | "SimulationToMonitoring"
  | "SimulationToKpiReference"
  | "SimulationToOkrReference"
  | "SimulationToRiskReference"
  | "SimulationToAssumption"
  | "SimulationToConstraint"
  | "SimulationToOutcome"
  | "SimulationToEvidence"
  | "SimulationToDependency";

export type ExecutiveStrategySimulationRelationship = Readonly<{
  readonly relationshipId: string;
  readonly relationshipType: ExecutiveStrategySimulationRelationshipType;
  readonly sourceId: string;
  readonly targetId: string;
  readonly metadataOnly: true;
  readonly immutable: true;
}>;

export type ExecutiveStrategySimulation = Readonly<{
  readonly identity: ExecutiveStrategySimulationIdentity;
  readonly name: ExecutiveStrategySimulationName;
  readonly description: string;
  readonly profile: ExecutiveStrategySimulationProfile;
  readonly category: ExecutiveStrategySimulationCategory;
  readonly status: ExecutiveStrategySimulationStatus;
  readonly lifecycle: ExecutiveStrategyLifecycle;
  readonly priority: ExecutiveStrategyPriority;
  readonly purpose: ExecutiveStrategySimulationPurpose;
  readonly scope: ExecutiveStrategySimulationScope;
  readonly scenario: ExecutiveStrategySimulationScenarioDefinition;
  readonly assumptions: readonly ExecutiveStrategySimulationAssumption[];
  readonly constraints: readonly ExecutiveStrategySimulationConstraint[];
  readonly outcomes: readonly ExecutiveStrategySimulationOutcomeDefinition[];
  readonly evidence: readonly ExecutiveStrategySimulationEvidence[];
  readonly dependencies: readonly ExecutiveStrategySimulationDependency[];
  readonly owner: ExecutiveStrategyOwner;
  readonly stakeholders: readonly ExecutiveStrategyStakeholder[];
  readonly strategyReferenceIds: readonly string[];
  readonly themeReferenceIds: readonly string[];
  readonly objectiveReferenceIds: readonly string[];
  readonly initiativeReferenceIds: readonly string[];
  readonly roadmapReferenceIds: readonly string[];
  readonly monitoringReferenceIds: readonly string[];
  readonly kpiReferences: readonly ExecutiveStrategicKpiReference[];
  readonly okrReferences: readonly ExecutiveStrategicOkrReference[];
  readonly riskReferences: readonly ExecutiveStrategicRiskReference[];
  readonly metadata: ExecutiveStrategyMetadata;
  readonly version: ExecutiveStrategyVersion;
  readonly metadataOnly: true;
  readonly immutable: true;
}>;

export type ExecutiveStrategySimulationPlatformDependency = Readonly<{
  readonly dependencyId:
    | "BUS-17 Executive Strategy Foundation"
    | "BUS-18 Executive Strategy Definition Platform"
    | "BUS-19 Executive Strategic Themes Platform"
    | "BUS-20 Executive Strategic Objectives Platform"
    | "BUS-21 Executive Strategic Initiatives Platform"
    | "BUS-22 Executive Strategic Roadmaps Platform"
    | "BUS-23 Executive Strategy Alignment Platform"
    | "BUS-24 Executive Strategy Monitoring Platform"
    | "Executive KPI Platform Freeze"
    | "Executive OKR Platform Freeze";
  readonly compatible: boolean;
  readonly implementationRequired: false;
}>;

export type ExecutiveStrategySimulationExtensionPolicy = Readonly<{
  readonly policyId: "executive-strategy-simulation-extension-policy";
  readonly extensionMode: "additive-only";
  readonly simulationMutationAllowed: false;
  readonly runtimeExecutionAllowed: false;
  readonly predictionAllowed: false;
  readonly optimizationAllowed: false;
  readonly orchestrationAllowed: false;
  readonly businessLogicAllowed: false;
}>;

export type ExecutiveStrategySimulationManifest = Readonly<{
  readonly platformId: "BUS-25";
  readonly platformName: "Executive Strategy Simulation Platform";
  readonly version: "1.0.0";
  readonly foundationPlatformId: "BUS-17";
  readonly definitionPlatformId: "BUS-18";
  readonly themePlatformId: "BUS-19";
  readonly objectivePlatformId: "BUS-20";
  readonly initiativePlatformId: "BUS-21";
  readonly roadmapPlatformId: "BUS-22";
  readonly alignmentPlatformId: "BUS-23";
  readonly monitoringPlatformId: "BUS-24";
  readonly simulationCount: number;
  readonly profileCount: number;
  readonly categoryCount: number;
  readonly statusCount: number;
  readonly priorityCount: number;
  readonly lifecycleCount: number;
  readonly scenarioCount: number;
  readonly outcomeCount: number;
  readonly assumptionCount: number;
  readonly constraintCount: number;
  readonly evidenceCount: number;
  readonly dependencyCount: number;
  readonly ownerCount: number;
  readonly versionCount: number;
  readonly relationshipCount: number;
  readonly publicApis: readonly string[];
  readonly strategyFoundationAvailable: boolean;
  readonly strategyDefinitionsAvailable: boolean;
  readonly strategicThemesAvailable: boolean;
  readonly strategicObjectivesAvailable: boolean;
  readonly strategicInitiativesAvailable: boolean;
  readonly strategicRoadmapsAvailable: boolean;
  readonly strategyAlignmentAvailable: boolean;
  readonly strategyMonitoringAvailable: boolean;
  readonly kpiFreezeAvailable: boolean;
  readonly okrFreezeAvailable: boolean;
  readonly certificationStatus: "Strategy Simulation Platform Certified";
  readonly deterministicFingerprint: string;
}>;

export type ExecutiveStrategySimulationRegistry = Readonly<{
  readonly platformId: "BUS-25";
  readonly platformName: "Executive Strategy Simulation Platform";
  readonly version: "1.0.0";
  readonly foundationPlatformId: "BUS-17";
  readonly definitionPlatformId: "BUS-18";
  readonly themePlatformId: "BUS-19";
  readonly objectivePlatformId: "BUS-20";
  readonly initiativePlatformId: "BUS-21";
  readonly roadmapPlatformId: "BUS-22";
  readonly alignmentPlatformId: "BUS-23";
  readonly monitoringPlatformId: "BUS-24";
  readonly kpiFreezeDependency: "BUS-12";
  readonly okrFreezeDependency: "BUS-16";
  readonly simulations: readonly ExecutiveStrategySimulation[];
  readonly profiles: readonly ExecutiveStrategySimulationProfile[];
  readonly categories: readonly ExecutiveStrategySimulationCategory[];
  readonly statuses: readonly ExecutiveStrategySimulationStatus[];
  readonly priorities: readonly ExecutiveStrategyPriority[];
  readonly lifecycles: readonly ExecutiveStrategyLifecycle[];
  readonly scenarios: readonly ExecutiveStrategySimulationScenarioDefinition[];
  readonly outcomes: readonly ExecutiveStrategySimulationOutcomeDefinition[];
  readonly assumptions: readonly ExecutiveStrategySimulationAssumption[];
  readonly constraints: readonly ExecutiveStrategySimulationConstraint[];
  readonly evidence: readonly ExecutiveStrategySimulationEvidence[];
  readonly dependencies: readonly ExecutiveStrategySimulationDependency[];
  readonly owners: readonly ExecutiveStrategyOwner[];
  readonly versions: readonly ExecutiveStrategyVersion[];
  readonly relationships: readonly ExecutiveStrategySimulationRelationship[];
  readonly publicApis: readonly string[];
  readonly extensionPolicy: ExecutiveStrategySimulationExtensionPolicy;
  readonly metadataOnly: true;
  readonly immutable: true;
}>;

export type ExecutiveStrategySimulationValidation = Readonly<{
  readonly valid: boolean;
  readonly errors: readonly string[];
  readonly warnings: readonly string[];
}>;

export type ExecutiveStrategySimulationPlatform = Readonly<{
  readonly registry: ExecutiveStrategySimulationRegistry;
  readonly manifest: ExecutiveStrategySimulationManifest;
  readonly validation: ExecutiveStrategySimulationValidation;
}>;

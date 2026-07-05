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

export type ExecutiveStrategyMonitoringProfile =
  | "StrategicHealthProfile"
  | "ExecutionTraceProfile"
  | "IntegrationVisibilityProfile";

export type ExecutiveStrategyMonitoringDimension =
  | "AlignmentCoverage"
  | "ExecutionReadiness"
  | "RiskVisibility"
  | "ReferenceTraceability";

export type ExecutiveStrategyMonitoringCategory =
  | "Growth"
  | "Operational"
  | "Innovation";

export type ExecutiveStrategyMonitoringStatus =
  | "Defined"
  | "Configured"
  | "Validated"
  | "Frozen";

export type ExecutiveStrategyMonitoringIdentity = Readonly<{
  readonly monitoringId: string;
  readonly monitoringKey: string;
  readonly metadataOnly: true;
  readonly immutable: true;
}>;

export type ExecutiveStrategyMonitoringName = Readonly<{
  readonly shortName: string;
  readonly displayName: string;
  readonly metadataOnly: true;
  readonly immutable: true;
}>;

export type ExecutiveStrategyMonitoringScope = Readonly<{
  readonly scopeId: string;
  readonly scopeStatement: string;
  readonly metadataOnly: true;
  readonly immutable: true;
}>;

export type ExecutiveStrategyMonitoringPurpose = Readonly<{
  readonly purposeId: string;
  readonly purposeStatement: string;
  readonly metadataOnly: true;
  readonly immutable: true;
}>;

export type ExecutiveStrategyMonitoringCadence = Readonly<{
  readonly cadenceId: string;
  readonly cadenceName: string;
  readonly cadenceInterval: "Monthly" | "Quarterly" | "Milestone";
  readonly metadataOnly: true;
  readonly immutable: true;
}>;

export type ExecutiveStrategyMonitoringEventType = Readonly<{
  readonly eventTypeId: string;
  readonly eventTypeName: string;
  readonly eventCategory: "Review" | "DependencyCheck" | "TraceabilityUpdate" | "GovernanceCheckpoint";
  readonly metadataOnly: true;
  readonly immutable: true;
}>;

export type ExecutiveStrategyMonitoringThresholdDefinition = Readonly<{
  readonly thresholdId: string;
  readonly thresholdName: string;
  readonly thresholdDescription: string;
  readonly thresholdCategory: "Coverage" | "Readiness" | "Risk" | "Governance";
  readonly metadataOnly: true;
  readonly immutable: true;
}>;

export type ExecutiveStrategyMonitoringEvidenceReference = Readonly<{
  readonly evidenceId: string;
  readonly evidenceName: string;
  readonly evidenceDescription: string;
  readonly evidenceType: "Traceability" | "Dependency" | "ReferenceCoverage" | "Governance";
  readonly metadataOnly: true;
  readonly immutable: true;
}>;

export type ExecutiveStrategyMonitoringDependency = Readonly<{
  readonly dependencyId: string;
  readonly dependencyName: string;
  readonly dependencyDescription: string;
  readonly dependencyType: "Requires" | "Supports" | "References";
  readonly metadataOnly: true;
  readonly immutable: true;
}>;

export type ExecutiveStrategyMonitoringRelationshipType =
  | "StrategyToMonitoring"
  | "MonitoringToStrategy"
  | "ThemeToMonitoring"
  | "MonitoringToTheme"
  | "ObjectiveToMonitoring"
  | "MonitoringToObjective"
  | "InitiativeToMonitoring"
  | "MonitoringToInitiative"
  | "RoadmapToMonitoring"
  | "MonitoringToRoadmap"
  | "MonitoringToKpiReference"
  | "MonitoringToOkrReference"
  | "MonitoringToRiskReference"
  | "MonitoringToEvidence"
  | "MonitoringToDependency"
  | "MonitoringToCadence"
  | "MonitoringToEventType"
  | "MonitoringToThresholdDefinition";

export type ExecutiveStrategyMonitoringRelationship = Readonly<{
  readonly relationshipId: string;
  readonly relationshipType: ExecutiveStrategyMonitoringRelationshipType;
  readonly sourceId: string;
  readonly targetId: string;
  readonly metadataOnly: true;
  readonly immutable: true;
}>;

export type ExecutiveStrategyMonitoring = Readonly<{
  readonly identity: ExecutiveStrategyMonitoringIdentity;
  readonly name: ExecutiveStrategyMonitoringName;
  readonly description: string;
  readonly profile: ExecutiveStrategyMonitoringProfile;
  readonly scope: ExecutiveStrategyMonitoringScope;
  readonly purpose: ExecutiveStrategyMonitoringPurpose;
  readonly dimension: ExecutiveStrategyMonitoringDimension;
  readonly category: ExecutiveStrategyMonitoringCategory;
  readonly status: ExecutiveStrategyMonitoringStatus;
  readonly lifecycle: ExecutiveStrategyLifecycle;
  readonly priority: ExecutiveStrategyPriority;
  readonly owner: ExecutiveStrategyOwner;
  readonly stakeholders: readonly ExecutiveStrategyStakeholder[];
  readonly cadence: ExecutiveStrategyMonitoringCadence;
  readonly eventTypes: readonly ExecutiveStrategyMonitoringEventType[];
  readonly thresholdDefinitions: readonly ExecutiveStrategyMonitoringThresholdDefinition[];
  readonly evidence: readonly ExecutiveStrategyMonitoringEvidenceReference[];
  readonly dependencies: readonly ExecutiveStrategyMonitoringDependency[];
  readonly strategyReferenceIds: readonly string[];
  readonly themeReferenceIds: readonly string[];
  readonly objectiveReferenceIds: readonly string[];
  readonly initiativeReferenceIds: readonly string[];
  readonly roadmapReferenceIds: readonly string[];
  readonly kpiReferences: readonly ExecutiveStrategicKpiReference[];
  readonly okrReferences: readonly ExecutiveStrategicOkrReference[];
  readonly riskReferences: readonly ExecutiveStrategicRiskReference[];
  readonly metadata: ExecutiveStrategyMetadata;
  readonly version: ExecutiveStrategyVersion;
  readonly metadataOnly: true;
  readonly immutable: true;
}>;

export type ExecutiveStrategyMonitoringPlatformDependency = Readonly<{
  readonly dependencyId:
    | "BUS-17 Executive Strategy Foundation"
    | "BUS-18 Executive Strategy Definition Platform"
    | "BUS-19 Executive Strategic Themes Platform"
    | "BUS-20 Executive Strategic Objectives Platform"
    | "BUS-21 Executive Strategic Initiatives Platform"
    | "BUS-22 Executive Strategic Roadmaps Platform"
    | "BUS-23 Executive Strategy Alignment Platform"
    | "Executive KPI Platform Freeze"
    | "Executive OKR Platform Freeze";
  readonly compatible: boolean;
  readonly implementationRequired: false;
}>;

export type ExecutiveStrategyMonitoringExtensionPolicy = Readonly<{
  readonly policyId: "executive-strategy-monitoring-extension-policy";
  readonly extensionMode: "additive-only";
  readonly monitoringMutationAllowed: false;
  readonly runtimeExecutionAllowed: false;
  readonly eventProcessingAllowed: false;
  readonly thresholdEvaluationAllowed: false;
  readonly simulationAllowed: false;
  readonly businessLogicAllowed: false;
}>;

export type ExecutiveStrategyMonitoringManifest = Readonly<{
  readonly platformId: "BUS-24";
  readonly platformName: "Executive Strategy Monitoring Platform";
  readonly version: "1.0.0";
  readonly foundationPlatformId: "BUS-17";
  readonly definitionPlatformId: "BUS-18";
  readonly themePlatformId: "BUS-19";
  readonly objectivePlatformId: "BUS-20";
  readonly initiativePlatformId: "BUS-21";
  readonly roadmapPlatformId: "BUS-22";
  readonly alignmentPlatformId: "BUS-23";
  readonly monitoringCount: number;
  readonly profileCount: number;
  readonly dimensionCount: number;
  readonly categoryCount: number;
  readonly statusCount: number;
  readonly priorityCount: number;
  readonly lifecycleCount: number;
  readonly cadenceCount: number;
  readonly eventCount: number;
  readonly thresholdCount: number;
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
  readonly kpiFreezeAvailable: boolean;
  readonly okrFreezeAvailable: boolean;
  readonly certificationStatus: "Strategy Monitoring Platform Certified";
  readonly deterministicFingerprint: string;
}>;

export type ExecutiveStrategyMonitoringRegistry = Readonly<{
  readonly platformId: "BUS-24";
  readonly platformName: "Executive Strategy Monitoring Platform";
  readonly version: "1.0.0";
  readonly foundationPlatformId: "BUS-17";
  readonly definitionPlatformId: "BUS-18";
  readonly themePlatformId: "BUS-19";
  readonly objectivePlatformId: "BUS-20";
  readonly initiativePlatformId: "BUS-21";
  readonly roadmapPlatformId: "BUS-22";
  readonly alignmentPlatformId: "BUS-23";
  readonly kpiFreezeDependency: "BUS-12";
  readonly okrFreezeDependency: "BUS-16";
  readonly monitorings: readonly ExecutiveStrategyMonitoring[];
  readonly profiles: readonly ExecutiveStrategyMonitoringProfile[];
  readonly dimensions: readonly ExecutiveStrategyMonitoringDimension[];
  readonly categories: readonly ExecutiveStrategyMonitoringCategory[];
  readonly statuses: readonly ExecutiveStrategyMonitoringStatus[];
  readonly priorities: readonly ExecutiveStrategyPriority[];
  readonly lifecycles: readonly ExecutiveStrategyLifecycle[];
  readonly cadences: readonly ExecutiveStrategyMonitoringCadence[];
  readonly events: readonly ExecutiveStrategyMonitoringEventType[];
  readonly thresholds: readonly ExecutiveStrategyMonitoringThresholdDefinition[];
  readonly evidence: readonly ExecutiveStrategyMonitoringEvidenceReference[];
  readonly dependencies: readonly ExecutiveStrategyMonitoringDependency[];
  readonly owners: readonly ExecutiveStrategyOwner[];
  readonly versions: readonly ExecutiveStrategyVersion[];
  readonly relationships: readonly ExecutiveStrategyMonitoringRelationship[];
  readonly publicApis: readonly string[];
  readonly extensionPolicy: ExecutiveStrategyMonitoringExtensionPolicy;
  readonly metadataOnly: true;
  readonly immutable: true;
}>;

export type ExecutiveStrategyMonitoringValidation = Readonly<{
  readonly valid: boolean;
  readonly errors: readonly string[];
  readonly warnings: readonly string[];
}>;

export type ExecutiveStrategyMonitoringPlatform = Readonly<{
  readonly registry: ExecutiveStrategyMonitoringRegistry;
  readonly manifest: ExecutiveStrategyMonitoringManifest;
  readonly validation: ExecutiveStrategyMonitoringValidation;
}>;

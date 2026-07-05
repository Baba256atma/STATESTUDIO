import type {
  ExecutiveStrategyCompatibility,
  ExecutiveStrategyConsumer,
  ExecutiveStrategyDependency,
  ExecutiveStrategyEntityDefinition,
  ExecutiveStrategyExtensionPolicy,
  ExecutiveStrategyPlatformIdentity,
  ExecutiveStrategyPlatformRegistry,
  ExecutiveStrategyPriority,
  ExecutiveStrategyPublicApi,
  ExecutiveStrategyReleaseMetadata,
  ExecutiveStrategyStatus,
  ExecutiveStrategyLifecycle,
} from "./executiveStrategyTypes.ts";

export const EXECUTIVE_STRATEGY_RELEASE_METADATA: ExecutiveStrategyReleaseMetadata = Object.freeze({
  releaseId: "BUS-17",
  releaseStage: "Foundation",
  metadataOnly: true,
  immutable: true,
});

export const EXECUTIVE_STRATEGY_PLATFORM_IDENTITY: ExecutiveStrategyPlatformIdentity = Object.freeze({
  platformName: "Executive Strategy Platform",
  platformId: "BUS-17",
  version: "1.0.0",
  description: "Immutable metadata foundation for the Executive Strategy Platform.",
  status: "Foundation",
  domainIdentity: "Executive Strategy Domain",
  namespace: "executive.strategy",
  releaseMetadata: EXECUTIVE_STRATEGY_RELEASE_METADATA,
});

export const EXECUTIVE_STRATEGY_ENTITY_REGISTRY: readonly ExecutiveStrategyEntityDefinition[] = Object.freeze([
  Object.freeze({ entityId: "strategy", entityName: "Strategy", contractName: "ExecutiveStrategy", description: "Canonical strategy aggregate contract.", metadataOnly: true, immutable: true }),
  Object.freeze({ entityId: "strategic-theme", entityName: "Strategic Theme", contractName: "ExecutiveStrategicTheme", description: "Canonical strategic theme contract.", metadataOnly: true, immutable: true }),
  Object.freeze({ entityId: "strategic-objective", entityName: "Strategic Objective", contractName: "ExecutiveStrategicObjective", description: "Canonical strategic objective contract.", metadataOnly: true, immutable: true }),
  Object.freeze({ entityId: "strategic-pillar", entityName: "Strategic Pillar", contractName: "ExecutiveStrategicPillar", description: "Canonical strategic pillar contract.", metadataOnly: true, immutable: true }),
  Object.freeze({ entityId: "strategic-initiative", entityName: "Strategic Initiative", contractName: "ExecutiveStrategicInitiative", description: "Canonical strategic initiative contract.", metadataOnly: true, immutable: true }),
  Object.freeze({ entityId: "strategic-program", entityName: "Strategic Program", contractName: "ExecutiveStrategicProgram", description: "Canonical strategic program contract.", metadataOnly: true, immutable: true }),
  Object.freeze({ entityId: "strategic-roadmap", entityName: "Strategic Roadmap", contractName: "ExecutiveStrategicRoadmap", description: "Canonical strategic roadmap contract.", metadataOnly: true, immutable: true }),
  Object.freeze({ entityId: "strategic-milestone", entityName: "Strategic Milestone", contractName: "ExecutiveStrategicMilestone", description: "Canonical strategic milestone contract.", metadataOnly: true, immutable: true }),
  Object.freeze({ entityId: "strategic-dependency", entityName: "Strategic Dependency", contractName: "ExecutiveStrategicDependency", description: "Canonical strategic dependency contract.", metadataOnly: true, immutable: true }),
  Object.freeze({ entityId: "strategic-assumption", entityName: "Strategic Assumption", contractName: "ExecutiveStrategicAssumption", description: "Canonical strategic assumption contract.", metadataOnly: true, immutable: true }),
  Object.freeze({ entityId: "strategic-constraint", entityName: "Strategic Constraint", contractName: "ExecutiveStrategicConstraint", description: "Canonical strategic constraint contract.", metadataOnly: true, immutable: true }),
  Object.freeze({ entityId: "strategic-opportunity", entityName: "Strategic Opportunity", contractName: "ExecutiveStrategicOpportunity", description: "Canonical strategic opportunity contract.", metadataOnly: true, immutable: true }),
  Object.freeze({ entityId: "strategic-risk-reference", entityName: "Strategic Risk Reference", contractName: "ExecutiveStrategicRiskReference", description: "Canonical strategic risk reference contract.", metadataOnly: true, immutable: true }),
  Object.freeze({ entityId: "strategic-kpi-reference", entityName: "Strategic KPI Reference", contractName: "ExecutiveStrategicKpiReference", description: "Canonical strategic KPI reference contract.", metadataOnly: true, immutable: true }),
  Object.freeze({ entityId: "strategic-okr-reference", entityName: "Strategic OKR Reference", contractName: "ExecutiveStrategicOkrReference", description: "Canonical strategic OKR reference contract.", metadataOnly: true, immutable: true }),
  Object.freeze({ entityId: "strategic-owner", entityName: "Strategic Owner", contractName: "ExecutiveStrategyOwner", description: "Canonical strategic owner contract.", metadataOnly: true, immutable: true }),
  Object.freeze({ entityId: "strategic-stakeholder", entityName: "Strategic Stakeholder", contractName: "ExecutiveStrategyStakeholder", description: "Canonical strategic stakeholder contract.", metadataOnly: true, immutable: true }),
] as const);

export const EXECUTIVE_STRATEGY_TYPE_REGISTRY: readonly string[] = Object.freeze([
  "Strategy",
  "Strategic Theme",
  "Strategic Objective",
  "Strategic Pillar",
  "Strategic Initiative",
  "Strategic Program",
  "Strategic Roadmap",
  "Strategic Milestone",
  "Strategic Dependency",
  "Strategic Assumption",
  "Strategic Constraint",
  "Strategic Opportunity",
  "Strategic Risk Reference",
  "Strategic KPI Reference",
  "Strategic OKR Reference",
  "Strategic Owner",
  "Strategic Stakeholder",
] as const);

export const EXECUTIVE_STRATEGY_STATUS_REGISTRY: readonly ExecutiveStrategyStatus[] = Object.freeze([
  "Proposed",
  "Defined",
  "Aligned",
  "Validated",
  "Frozen",
] as const);

export const EXECUTIVE_STRATEGY_PRIORITY_REGISTRY: readonly ExecutiveStrategyPriority[] = Object.freeze([
  "Critical",
  "High",
  "Medium",
  "Future",
  "Optional",
] as const);

export const EXECUTIVE_STRATEGY_LIFECYCLE_REGISTRY: readonly ExecutiveStrategyLifecycle[] = Object.freeze([
  "Draft",
  "Candidate",
  "Approved",
  "Active",
  "Archived",
] as const);

export const EXECUTIVE_STRATEGY_PUBLIC_APIS: readonly ExecutiveStrategyPublicApi[] = Object.freeze([
  Object.freeze({ apiName: "ExecutiveStrategyFoundation", stable: true, runtime: false }),
  Object.freeze({ apiName: "getExecutiveStrategyPlatform", stable: true, runtime: false }),
  Object.freeze({ apiName: "getExecutiveStrategyManifest", stable: true, runtime: false }),
  Object.freeze({ apiName: "validateExecutiveStrategyPlatform", stable: true, runtime: false }),
  Object.freeze({ apiName: "listExecutiveStrategyEntities", stable: true, runtime: false }),
  Object.freeze({ apiName: "listExecutiveStrategyPublicApis", stable: true, runtime: false }),
] as const);

export const EXECUTIVE_STRATEGY_DEPENDENCIES: readonly ExecutiveStrategyDependency[] = Object.freeze([
  Object.freeze({ dependencyId: "Executive KPI Platform Freeze", compatible: true, implementationRequired: false }),
  Object.freeze({ dependencyId: "Executive OKR Platform Freeze", compatible: true, implementationRequired: false }),
] as const);

export const EXECUTIVE_STRATEGY_EXTENSION_POLICY: ExecutiveStrategyExtensionPolicy = Object.freeze({
  policyId: "executive-strategy-foundation-extension-policy",
  extensionMode: "additive-only",
  foundationMutationAllowed: false,
  runtimeExecutionAllowed: false,
  businessLogicAllowed: false,
  strategyExecutionAllowed: false,
  orchestrationAllowed: false,
});

export const EXECUTIVE_STRATEGY_CONSUMERS: readonly ExecutiveStrategyConsumer[] = Object.freeze([
  Object.freeze({ consumerId: "app-strategy-consumer", consumerName: "APP Strategy Consumer", metadataOnly: true }),
  Object.freeze({ consumerId: "lay-strategy-consumer", consumerName: "LAY Strategy Consumer", metadataOnly: true }),
  Object.freeze({ consumerId: "ops-strategy-consumer", consumerName: "OPS Strategy Consumer", metadataOnly: true }),
  Object.freeze({ consumerId: "bus-okr-strategy-consumer", consumerName: "BUS OKR Strategy Consumer", metadataOnly: true }),
] as const);

export const EXECUTIVE_STRATEGY_COMPATIBILITY: readonly ExecutiveStrategyCompatibility[] = Object.freeze([
  Object.freeze({ compatibilityId: "kpi-freeze-compatibility", targetPlatform: "Executive KPI Platform Freeze", compatibilityStatus: "Compatible", metadataOnly: true, immutable: true }),
  Object.freeze({ compatibilityId: "okr-freeze-compatibility", targetPlatform: "Executive OKR Platform Freeze", compatibilityStatus: "Compatible", metadataOnly: true, immutable: true }),
  Object.freeze({ compatibilityId: "strategy-consumer-safety", targetPlatform: "Metadata-only consumers", compatibilityStatus: "Consumer Safe", metadataOnly: true, immutable: true }),
  Object.freeze({ compatibilityId: "strategy-foundation-boundary", targetPlatform: "Foundation-only architecture", compatibilityStatus: "Metadata Only", metadataOnly: true, immutable: true }),
] as const);

export const EXECUTIVE_STRATEGY_PLATFORM_REGISTRY: ExecutiveStrategyPlatformRegistry = Object.freeze({
  identity: EXECUTIVE_STRATEGY_PLATFORM_IDENTITY,
  entities: EXECUTIVE_STRATEGY_ENTITY_REGISTRY,
  strategyTypes: EXECUTIVE_STRATEGY_TYPE_REGISTRY,
  statuses: EXECUTIVE_STRATEGY_STATUS_REGISTRY,
  priorities: EXECUTIVE_STRATEGY_PRIORITY_REGISTRY,
  lifecycles: EXECUTIVE_STRATEGY_LIFECYCLE_REGISTRY,
  publicApis: EXECUTIVE_STRATEGY_PUBLIC_APIS,
  dependencies: EXECUTIVE_STRATEGY_DEPENDENCIES,
  extensionPolicy: EXECUTIVE_STRATEGY_EXTENSION_POLICY,
  consumers: EXECUTIVE_STRATEGY_CONSUMERS,
  compatibility: EXECUTIVE_STRATEGY_COMPATIBILITY,
});

export function listExecutiveStrategyEntities(): readonly ExecutiveStrategyEntityDefinition[] {
  return EXECUTIVE_STRATEGY_ENTITY_REGISTRY;
}

export function listExecutiveStrategyPublicApis(): readonly ExecutiveStrategyPublicApi[] {
  return EXECUTIVE_STRATEGY_PUBLIC_APIS;
}

import {
  EXECUTIVE_STRATEGY_LIFECYCLE_REGISTRY,
  EXECUTIVE_STRATEGY_PRIORITY_REGISTRY,
  EXECUTIVE_STRATEGY_STATUS_REGISTRY,
  type ExecutiveStrategyCategory,
  type ExecutiveStrategyMetadata,
  type ExecutiveStrategyOwner,
} from "./executiveStrategyIndex.ts";
import type { ExecutiveStrategyVersion } from "./executiveStrategyDefinitionIndex.ts";
import type {
  ExecutiveStrategicObjective,
  ExecutiveStrategicObjectiveDependency,
  ExecutiveStrategicObjectiveExtensionPolicy,
  ExecutiveStrategicObjectivePlatformDependency,
  ExecutiveStrategicObjectiveRegistry,
  ExecutiveStrategicObjectiveRelationship,
} from "./executiveStrategicObjectiveTypes.ts";

const OBJECTIVE_CATEGORIES: readonly ExecutiveStrategyCategory[] = Object.freeze([
  "Growth",
  "Operational",
  "Innovation",
  "Transformation",
] as const);

const OBJECTIVE_OWNERS: readonly ExecutiveStrategyOwner[] = Object.freeze([
  Object.freeze({ ownerId: "objective-growth-owner", ownerName: "Chief Strategy Officer", ownerRole: "Objective Owner", metadataOnly: true, immutable: true }),
  Object.freeze({ ownerId: "objective-operations-owner", ownerName: "Chief Operating Officer", ownerRole: "Objective Sponsor", metadataOnly: true, immutable: true }),
  Object.freeze({ ownerId: "objective-innovation-owner", ownerName: "Chief Innovation Officer", ownerRole: "Objective Sponsor", metadataOnly: true, immutable: true }),
] as const);

const OBJECTIVE_VERSIONS: readonly ExecutiveStrategyVersion[] = Object.freeze([
  Object.freeze({ versionId: "objective-version-v1-growth", versionLabel: "Growth Objective Definition", semanticVersion: "1.0.0", metadataOnly: true, immutable: true }),
  Object.freeze({ versionId: "objective-version-v1-resilience", versionLabel: "Resilience Objective Definition", semanticVersion: "1.0.0", metadataOnly: true, immutable: true }),
  Object.freeze({ versionId: "objective-version-v1-innovation", versionLabel: "Innovation Objective Definition", semanticVersion: "1.0.0", metadataOnly: true, immutable: true }),
] as const);

function metadata(metadataId: string): ExecutiveStrategyMetadata {
  return Object.freeze({
    metadataId,
    metadataOnly: true,
    immutable: true,
    namespace: "executive.strategy",
    domainIdentity: "Executive Strategy Domain",
  });
}

function dependency(
  dependencyId: string,
  targetObjectiveId: string,
  dependencyType: ExecutiveStrategicObjectiveDependency["dependencyType"]
): ExecutiveStrategicObjectiveDependency {
  return Object.freeze({
    dependencyId,
    targetObjectiveId,
    dependencyType,
    metadataOnly: true,
    immutable: true,
  });
}

export const EXECUTIVE_STRATEGIC_OBJECTIVES: readonly ExecutiveStrategicObjective[] = Object.freeze([
  Object.freeze({
    identity: Object.freeze({ objectiveId: "objective-expand-profitable-revenue", objectiveKey: "expand-profitable-revenue", metadataOnly: true, immutable: true }),
    name: Object.freeze({ shortName: "Expand Profitable Revenue", displayName: "Expand Profitable Revenue Objective", metadataOnly: true, immutable: true }),
    description: "Canonical strategic objective for profitable top-line expansion.",
    purpose: Object.freeze({ purposeId: "purpose-expand-profitable-revenue", purposeStatement: "Translate growth strategy into a stable executive objective contract.", metadataOnly: true, immutable: true }),
    scope: Object.freeze({ scopeId: "scope-expand-profitable-revenue", scopeStatement: "Commercial growth, pricing discipline, and value realization scope.", metadataOnly: true, immutable: true }),
    category: "Growth",
    priority: "Critical",
    status: "Aligned",
    lifecycle: "Approved",
    owner: OBJECTIVE_OWNERS[0],
    sponsor: OBJECTIVE_OWNERS[1],
    stakeholders: Object.freeze([
      Object.freeze({ stakeholderId: "objective-growth-finance", stakeholderName: "Finance Leadership", stakeholderRole: "Stakeholder", metadataOnly: true, immutable: true }),
      Object.freeze({ stakeholderId: "objective-growth-commercial", stakeholderName: "Commercial Leadership", stakeholderRole: "Stakeholder", metadataOnly: true, immutable: true }),
    ]),
    parentObjectiveId: null,
    childObjectiveIds: Object.freeze(["objective-accelerate-innovation-throughput"]),
    strategyReferenceIds: Object.freeze(["strategy-profitable-growth"]),
    themeReferenceIds: Object.freeze(["theme-sustainable-growth"]),
    kpiReferences: Object.freeze([
      Object.freeze({ kpiReferenceId: "executive-financial-health", kpiName: "Executive Financial Health", sourcePlatformId: "BUS", metadataOnly: true, immutable: true }),
    ]),
    okrReferences: Object.freeze([
      Object.freeze({ okrReferenceId: "objective-profitable-growth", okrName: "Profitable Growth Objective", sourcePlatformId: "BUS-OKR", metadataOnly: true, immutable: true }),
    ]),
    riskReferences: Object.freeze([
      Object.freeze({ riskReferenceId: "risk-growth-volatility", riskName: "Growth volatility risk reference", metadataOnly: true, immutable: true }),
    ]),
    dependencies: Object.freeze([
      dependency("dependency-growth-to-resilience", "objective-strengthen-operational-adaptability", "Requires"),
    ]),
    assumptions: Object.freeze(["objective-growth-demand-stability", "objective-growth-pricing-discipline"]),
    constraints: Object.freeze(["objective-growth-capital-discipline", "objective-growth-channel-focus"]),
    successCriteria: Object.freeze([
      Object.freeze({ criteriaId: "criteria-growth-objective-clarity", criteriaStatement: "Objective remains stable and referenceable for later initiative layers.", metadataOnly: true, immutable: true }),
      Object.freeze({ criteriaId: "criteria-growth-objective-alignment", criteriaStatement: "Objective preserves strategy, KPI, and OKR linkage consistency.", metadataOnly: true, immutable: true }),
    ]),
    metadata: metadata("objective-expand-profitable-revenue-metadata"),
    version: OBJECTIVE_VERSIONS[0],
    metadataOnly: true,
    immutable: true,
  }),
  Object.freeze({
    identity: Object.freeze({ objectiveId: "objective-strengthen-operational-adaptability", objectiveKey: "strengthen-operational-adaptability", metadataOnly: true, immutable: true }),
    name: Object.freeze({ shortName: "Strengthen Operational Adaptability", displayName: "Strengthen Operational Adaptability Objective", metadataOnly: true, immutable: true }),
    description: "Canonical strategic objective for resilient operational adaptability.",
    purpose: Object.freeze({ purposeId: "purpose-strengthen-operational-adaptability", purposeStatement: "Represent operational resilience as a durable strategic objective contract.", metadataOnly: true, immutable: true }),
    scope: Object.freeze({ scopeId: "scope-strengthen-operational-adaptability", scopeStatement: "Operating model resilience, cross-functional readiness, and operating adaptability.", metadataOnly: true, immutable: true }),
    category: "Operational",
    priority: "High",
    status: "Defined",
    lifecycle: "Approved",
    owner: OBJECTIVE_OWNERS[1],
    sponsor: OBJECTIVE_OWNERS[0],
    stakeholders: Object.freeze([
      Object.freeze({ stakeholderId: "objective-resilience-ops", stakeholderName: "Operations Leadership", stakeholderRole: "Stakeholder", metadataOnly: true, immutable: true }),
      Object.freeze({ stakeholderId: "objective-resilience-risk", stakeholderName: "Risk Leadership", stakeholderRole: "Stakeholder", metadataOnly: true, immutable: true }),
    ]),
    parentObjectiveId: null,
    childObjectiveIds: Object.freeze([]),
    strategyReferenceIds: Object.freeze(["strategy-operational-resilience"]),
    themeReferenceIds: Object.freeze(["theme-operational-resilience"]),
    kpiReferences: Object.freeze([
      Object.freeze({ kpiReferenceId: "executive-operational-readiness", kpiName: "Executive Operational Readiness", sourcePlatformId: "BUS", metadataOnly: true, immutable: true }),
    ]),
    okrReferences: Object.freeze([
      Object.freeze({ okrReferenceId: "objective-operational-excellence", okrName: "Operational Excellence Objective", sourcePlatformId: "BUS-OKR", metadataOnly: true, immutable: true }),
    ]),
    riskReferences: Object.freeze([
      Object.freeze({ riskReferenceId: "risk-resilience-disruption", riskName: "Resilience disruption risk reference", metadataOnly: true, immutable: true }),
    ]),
    dependencies: Object.freeze([]),
    assumptions: Object.freeze(["objective-resilience-change-readiness", "objective-resilience-process-discipline"]),
    constraints: Object.freeze(["objective-resilience-capacity", "objective-resilience-sequencing"]),
    successCriteria: Object.freeze([
      Object.freeze({ criteriaId: "criteria-resilience-objective-clarity", criteriaStatement: "Operational objective remains machine-readable and stable.", metadataOnly: true, immutable: true }),
      Object.freeze({ criteriaId: "criteria-resilience-objective-linkage", criteriaStatement: "Operational objective preserves resilience strategy and OKR references.", metadataOnly: true, immutable: true }),
    ]),
    metadata: metadata("objective-strengthen-operational-adaptability-metadata"),
    version: OBJECTIVE_VERSIONS[1],
    metadataOnly: true,
    immutable: true,
  }),
  Object.freeze({
    identity: Object.freeze({ objectiveId: "objective-accelerate-innovation-throughput", objectiveKey: "accelerate-innovation-throughput", metadataOnly: true, immutable: true }),
    name: Object.freeze({ shortName: "Accelerate Innovation Throughput", displayName: "Accelerate Innovation Throughput Objective", metadataOnly: true, immutable: true }),
    description: "Canonical child objective for innovation throughput and strategic adaptability.",
    purpose: Object.freeze({ purposeId: "purpose-accelerate-innovation-throughput", purposeStatement: "Capture innovation throughput as a child strategic objective beneath growth expansion.", metadataOnly: true, immutable: true }),
    scope: Object.freeze({ scopeId: "scope-accelerate-innovation-throughput", scopeStatement: "Innovation enablement, experimentation velocity, and scaling readiness.", metadataOnly: true, immutable: true }),
    category: "Innovation",
    priority: "Medium",
    status: "Defined",
    lifecycle: "Candidate",
    owner: OBJECTIVE_OWNERS[2],
    sponsor: OBJECTIVE_OWNERS[0],
    stakeholders: Object.freeze([
      Object.freeze({ stakeholderId: "objective-innovation-product", stakeholderName: "Innovation Leadership", stakeholderRole: "Stakeholder", metadataOnly: true, immutable: true }),
      Object.freeze({ stakeholderId: "objective-innovation-transform", stakeholderName: "Transformation Leadership", stakeholderRole: "Stakeholder", metadataOnly: true, immutable: true }),
    ]),
    parentObjectiveId: "objective-expand-profitable-revenue",
    childObjectiveIds: Object.freeze([]),
    strategyReferenceIds: Object.freeze(["strategy-profitable-growth", "strategy-operational-resilience"]),
    themeReferenceIds: Object.freeze(["theme-sustainable-growth", "theme-innovation-engine"]),
    kpiReferences: Object.freeze([
      Object.freeze({ kpiReferenceId: "executive-financial-health", kpiName: "Executive Financial Health", sourcePlatformId: "BUS", metadataOnly: true, immutable: true }),
      Object.freeze({ kpiReferenceId: "executive-operational-readiness", kpiName: "Executive Operational Readiness", sourcePlatformId: "BUS", metadataOnly: true, immutable: true }),
    ]),
    okrReferences: Object.freeze([
      Object.freeze({ okrReferenceId: "objective-profitable-growth", okrName: "Profitable Growth Objective", sourcePlatformId: "BUS-OKR", metadataOnly: true, immutable: true }),
      Object.freeze({ okrReferenceId: "objective-operational-excellence", okrName: "Operational Excellence Objective", sourcePlatformId: "BUS-OKR", metadataOnly: true, immutable: true }),
    ]),
    riskReferences: Object.freeze([
      Object.freeze({ riskReferenceId: "risk-innovation-focus", riskName: "Innovation focus risk reference", metadataOnly: true, immutable: true }),
    ]),
    dependencies: Object.freeze([
      dependency("dependency-innovation-to-resilience", "objective-strengthen-operational-adaptability", "Supports"),
    ]),
    assumptions: Object.freeze(["objective-innovation-adoption", "objective-innovation-capacity"]),
    constraints: Object.freeze(["objective-innovation-governance", "objective-innovation-bandwidth"]),
    successCriteria: Object.freeze([
      Object.freeze({ criteriaId: "criteria-innovation-objective-hierarchy", criteriaStatement: "Innovation objective preserves parent-child hierarchy integrity.", metadataOnly: true, immutable: true }),
      Object.freeze({ criteriaId: "criteria-innovation-objective-references", criteriaStatement: "Innovation objective preserves theme, KPI, OKR, and dependency linkage.", metadataOnly: true, immutable: true }),
    ]),
    metadata: metadata("objective-accelerate-innovation-throughput-metadata"),
    version: OBJECTIVE_VERSIONS[2],
    metadataOnly: true,
    immutable: true,
  }),
] as const);

export const EXECUTIVE_STRATEGIC_OBJECTIVE_RELATIONSHIPS: readonly ExecutiveStrategicObjectiveRelationship[] = Object.freeze([
  Object.freeze({ relationshipId: "strategy-profitable-growth-to-objective-growth", relationshipType: "StrategyToObjective", sourceId: "strategy-profitable-growth", targetId: "objective-expand-profitable-revenue", metadataOnly: true, immutable: true }),
  Object.freeze({ relationshipId: "objective-growth-to-strategy-profitable-growth", relationshipType: "ObjectiveToStrategy", sourceId: "objective-expand-profitable-revenue", targetId: "strategy-profitable-growth", metadataOnly: true, immutable: true }),
  Object.freeze({ relationshipId: "strategy-operational-resilience-to-objective-resilience", relationshipType: "StrategyToObjective", sourceId: "strategy-operational-resilience", targetId: "objective-strengthen-operational-adaptability", metadataOnly: true, immutable: true }),
  Object.freeze({ relationshipId: "objective-resilience-to-strategy-operational-resilience", relationshipType: "ObjectiveToStrategy", sourceId: "objective-strengthen-operational-adaptability", targetId: "strategy-operational-resilience", metadataOnly: true, immutable: true }),
  Object.freeze({ relationshipId: "strategy-profitable-growth-to-objective-innovation", relationshipType: "StrategyToObjective", sourceId: "strategy-profitable-growth", targetId: "objective-accelerate-innovation-throughput", metadataOnly: true, immutable: true }),
  Object.freeze({ relationshipId: "theme-growth-to-objective-growth", relationshipType: "ThemeToObjective", sourceId: "theme-sustainable-growth", targetId: "objective-expand-profitable-revenue", metadataOnly: true, immutable: true }),
  Object.freeze({ relationshipId: "objective-growth-to-theme-growth", relationshipType: "ObjectiveToTheme", sourceId: "objective-expand-profitable-revenue", targetId: "theme-sustainable-growth", metadataOnly: true, immutable: true }),
  Object.freeze({ relationshipId: "theme-resilience-to-objective-resilience", relationshipType: "ThemeToObjective", sourceId: "theme-operational-resilience", targetId: "objective-strengthen-operational-adaptability", metadataOnly: true, immutable: true }),
  Object.freeze({ relationshipId: "objective-resilience-to-theme-resilience", relationshipType: "ObjectiveToTheme", sourceId: "objective-strengthen-operational-adaptability", targetId: "theme-operational-resilience", metadataOnly: true, immutable: true }),
  Object.freeze({ relationshipId: "theme-innovation-to-objective-innovation", relationshipType: "ThemeToObjective", sourceId: "theme-innovation-engine", targetId: "objective-accelerate-innovation-throughput", metadataOnly: true, immutable: true }),
  Object.freeze({ relationshipId: "objective-growth-parent-to-innovation-child", relationshipType: "ParentObjectiveToChildObjective", sourceId: "objective-expand-profitable-revenue", targetId: "objective-accelerate-innovation-throughput", metadataOnly: true, immutable: true }),
  Object.freeze({ relationshipId: "objective-growth-to-kpi-financial-health", relationshipType: "ObjectiveToKpiReference", sourceId: "objective-expand-profitable-revenue", targetId: "executive-financial-health", metadataOnly: true, immutable: true }),
  Object.freeze({ relationshipId: "objective-resilience-to-kpi-operational-readiness", relationshipType: "ObjectiveToKpiReference", sourceId: "objective-strengthen-operational-adaptability", targetId: "executive-operational-readiness", metadataOnly: true, immutable: true }),
  Object.freeze({ relationshipId: "objective-growth-to-okr-profitable-growth", relationshipType: "ObjectiveToOkrReference", sourceId: "objective-expand-profitable-revenue", targetId: "objective-profitable-growth", metadataOnly: true, immutable: true }),
  Object.freeze({ relationshipId: "objective-resilience-to-okr-operational-excellence", relationshipType: "ObjectiveToOkrReference", sourceId: "objective-strengthen-operational-adaptability", targetId: "objective-operational-excellence", metadataOnly: true, immutable: true }),
  Object.freeze({ relationshipId: "objective-growth-to-risk-volatility", relationshipType: "ObjectiveToRiskReference", sourceId: "objective-expand-profitable-revenue", targetId: "risk-growth-volatility", metadataOnly: true, immutable: true }),
  Object.freeze({ relationshipId: "objective-innovation-to-risk-focus", relationshipType: "ObjectiveToRiskReference", sourceId: "objective-accelerate-innovation-throughput", targetId: "risk-innovation-focus", metadataOnly: true, immutable: true }),
  Object.freeze({ relationshipId: "objective-growth-to-dependency-resilience", relationshipType: "ObjectiveToDependency", sourceId: "objective-expand-profitable-revenue", targetId: "objective-strengthen-operational-adaptability", metadataOnly: true, immutable: true }),
  Object.freeze({ relationshipId: "objective-innovation-to-dependency-resilience", relationshipType: "ObjectiveToDependency", sourceId: "objective-accelerate-innovation-throughput", targetId: "objective-strengthen-operational-adaptability", metadataOnly: true, immutable: true }),
] as const);

export const EXECUTIVE_STRATEGIC_OBJECTIVE_PUBLIC_APIS: readonly string[] = Object.freeze([
  "ExecutiveStrategicObjectivesPlatform",
  "buildExecutiveStrategicObjective",
  "validateExecutiveStrategicObjective",
  "getExecutiveStrategicObjectivesManifest",
  "listExecutiveStrategicObjectives",
  "listExecutiveStrategicObjectivesPublicApis",
] as const);

export const EXECUTIVE_STRATEGIC_OBJECTIVE_DEPENDENCIES: readonly ExecutiveStrategicObjectivePlatformDependency[] = Object.freeze([
  Object.freeze({ dependencyId: "BUS-17 Executive Strategy Foundation", compatible: true, implementationRequired: false }),
  Object.freeze({ dependencyId: "BUS-18 Executive Strategy Definition Platform", compatible: true, implementationRequired: false }),
  Object.freeze({ dependencyId: "BUS-19 Executive Strategic Themes Platform", compatible: true, implementationRequired: false }),
  Object.freeze({ dependencyId: "Executive KPI Platform Freeze", compatible: true, implementationRequired: false }),
  Object.freeze({ dependencyId: "Executive OKR Platform Freeze", compatible: true, implementationRequired: false }),
] as const);

export const EXECUTIVE_STRATEGIC_OBJECTIVE_EXTENSION_POLICY: ExecutiveStrategicObjectiveExtensionPolicy = Object.freeze({
  policyId: "executive-strategic-objective-extension-policy",
  extensionMode: "additive-only",
  objectiveMutationAllowed: false,
  runtimeExecutionAllowed: false,
  initiativeManagementAllowed: false,
  roadmapManagementAllowed: false,
  planningAllowed: false,
  businessLogicAllowed: false,
});

export const EXECUTIVE_STRATEGIC_OBJECTIVE_REGISTRY: ExecutiveStrategicObjectiveRegistry = Object.freeze({
  platformId: "BUS-20",
  platformName: "Executive Strategic Objectives Platform",
  version: "1.0.0",
  foundationPlatformId: "BUS-17",
  definitionPlatformId: "BUS-18",
  themePlatformId: "BUS-19",
  kpiFreezeDependency: "BUS-12",
  okrFreezeDependency: "BUS-16",
  objectives: EXECUTIVE_STRATEGIC_OBJECTIVES,
  categories: OBJECTIVE_CATEGORIES,
  statuses: EXECUTIVE_STRATEGY_STATUS_REGISTRY,
  priorities: EXECUTIVE_STRATEGY_PRIORITY_REGISTRY,
  lifecycles: EXECUTIVE_STRATEGY_LIFECYCLE_REGISTRY,
  owners: OBJECTIVE_OWNERS,
  versions: OBJECTIVE_VERSIONS,
  relationships: EXECUTIVE_STRATEGIC_OBJECTIVE_RELATIONSHIPS,
  publicApis: EXECUTIVE_STRATEGIC_OBJECTIVE_PUBLIC_APIS,
  extensionPolicy: EXECUTIVE_STRATEGIC_OBJECTIVE_EXTENSION_POLICY,
  metadataOnly: true,
  immutable: true,
});

export function listExecutiveStrategicObjectives(): readonly ExecutiveStrategicObjective[] {
  return EXECUTIVE_STRATEGIC_OBJECTIVES;
}

export function listExecutiveStrategicObjectivesPublicApis(): readonly string[] {
  return EXECUTIVE_STRATEGIC_OBJECTIVE_PUBLIC_APIS;
}

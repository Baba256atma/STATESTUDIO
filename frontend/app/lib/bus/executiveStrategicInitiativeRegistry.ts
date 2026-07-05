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
  ExecutiveStrategicInitiative,
  ExecutiveStrategicInitiativeDependency,
  ExecutiveStrategicInitiativeDeliverable,
  ExecutiveStrategicInitiativeExtensionPolicy,
  ExecutiveStrategicInitiativeMilestone,
  ExecutiveStrategicInitiativePlatformDependency,
  ExecutiveStrategicInitiativeRegistry,
  ExecutiveStrategicInitiativeRelationship,
} from "./executiveStrategicInitiativeTypes.ts";

const INITIATIVE_CATEGORIES: readonly ExecutiveStrategyCategory[] = Object.freeze([
  "Growth",
  "Operational",
  "Innovation",
  "Transformation",
] as const);

const INITIATIVE_OWNERS: readonly ExecutiveStrategyOwner[] = Object.freeze([
  Object.freeze({ ownerId: "initiative-growth-owner", ownerName: "Chief Strategy Officer", ownerRole: "Initiative Owner", metadataOnly: true, immutable: true }),
  Object.freeze({ ownerId: "initiative-operations-owner", ownerName: "Chief Operating Officer", ownerRole: "Initiative Sponsor", metadataOnly: true, immutable: true }),
  Object.freeze({ ownerId: "initiative-innovation-owner", ownerName: "Chief Innovation Officer", ownerRole: "Initiative Sponsor", metadataOnly: true, immutable: true }),
] as const);

const INITIATIVE_VERSIONS: readonly ExecutiveStrategyVersion[] = Object.freeze([
  Object.freeze({ versionId: "initiative-version-v1-growth", versionLabel: "Growth Initiative Definition", semanticVersion: "1.0.0", metadataOnly: true, immutable: true }),
  Object.freeze({ versionId: "initiative-version-v1-resilience", versionLabel: "Resilience Initiative Definition", semanticVersion: "1.0.0", metadataOnly: true, immutable: true }),
  Object.freeze({ versionId: "initiative-version-v1-innovation", versionLabel: "Innovation Initiative Definition", semanticVersion: "1.0.0", metadataOnly: true, immutable: true }),
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
  targetInitiativeId: string,
  dependencyType: ExecutiveStrategicInitiativeDependency["dependencyType"]
): ExecutiveStrategicInitiativeDependency {
  return Object.freeze({
    dependencyId,
    targetInitiativeId,
    dependencyType,
    metadataOnly: true,
    immutable: true,
  });
}

function milestone(
  milestoneId: string,
  milestoneName: string,
  milestoneDescription: string,
  milestoneType: ExecutiveStrategicInitiativeMilestone["milestoneType"]
): ExecutiveStrategicInitiativeMilestone {
  return Object.freeze({
    milestoneId,
    milestoneName,
    milestoneDescription,
    milestoneType,
    metadataOnly: true,
    immutable: true,
  });
}

function deliverable(
  deliverableId: string,
  deliverableName: string,
  deliverableDescription: string
): ExecutiveStrategicInitiativeDeliverable {
  return Object.freeze({
    deliverableId,
    deliverableName,
    deliverableDescription,
    metadataOnly: true,
    immutable: true,
  });
}

const GROWTH_MILESTONES = Object.freeze([
  milestone("milestone-growth-readiness", "Growth Readiness", "Metadata checkpoint for profitable growth initiative readiness.", "Readiness"),
  milestone("milestone-growth-validation", "Growth Validation", "Metadata checkpoint for profitable growth initiative validation.", "Validation"),
] as const);

const RESILIENCE_MILESTONES = Object.freeze([
  milestone("milestone-resilience-coordination", "Resilience Coordination", "Metadata checkpoint for resilience coordination readiness.", "Coordination"),
  milestone("milestone-resilience-delivery", "Resilience Delivery", "Metadata checkpoint for resilience delivery alignment.", "Delivery"),
] as const);

const INNOVATION_MILESTONES = Object.freeze([
  milestone("milestone-innovation-readiness", "Innovation Readiness", "Metadata checkpoint for innovation initiative readiness.", "Readiness"),
  milestone("milestone-innovation-delivery", "Innovation Delivery", "Metadata checkpoint for innovation initiative delivery alignment.", "Delivery"),
] as const);

export const EXECUTIVE_STRATEGIC_INITIATIVES: readonly ExecutiveStrategicInitiative[] = Object.freeze([
  Object.freeze({
    identity: Object.freeze({ initiativeId: "initiative-commercial-value-architecture", initiativeKey: "commercial-value-architecture", metadataOnly: true, immutable: true }),
    name: Object.freeze({ shortName: "Commercial Value Architecture", displayName: "Commercial Value Architecture Initiative", metadataOnly: true, immutable: true }),
    description: "Canonical initiative for value architecture alignment supporting profitable revenue growth.",
    purpose: Object.freeze({ purposeId: "purpose-commercial-value-architecture", purposeStatement: "Represent a growth-aligned initiative as an immutable strategy execution-adjacent contract without executing it.", metadataOnly: true, immutable: true }),
    scope: Object.freeze({ scopeId: "scope-commercial-value-architecture", scopeStatement: "Commercial model alignment, value architecture, and growth coordination scope.", metadataOnly: true, immutable: true }),
    category: "Growth",
    priority: "Critical",
    status: "Aligned",
    lifecycle: "Approved",
    owner: INITIATIVE_OWNERS[0],
    sponsor: INITIATIVE_OWNERS[1],
    stakeholders: Object.freeze([
      Object.freeze({ stakeholderId: "initiative-growth-finance", stakeholderName: "Finance Leadership", stakeholderRole: "Stakeholder", metadataOnly: true, immutable: true }),
      Object.freeze({ stakeholderId: "initiative-growth-commercial", stakeholderName: "Commercial Leadership", stakeholderRole: "Stakeholder", metadataOnly: true, immutable: true }),
    ]),
    parentInitiativeId: null,
    childInitiativeIds: Object.freeze(["initiative-innovation-acceleration-lab"]),
    strategyReferenceIds: Object.freeze(["strategy-profitable-growth"]),
    themeReferenceIds: Object.freeze(["theme-sustainable-growth"]),
    objectiveReferenceIds: Object.freeze(["objective-expand-profitable-revenue"]),
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
      dependency("dependency-growth-initiative-to-resilience", "initiative-operating-model-resilience-hub", "Requires"),
    ]),
    milestones: GROWTH_MILESTONES,
    deliverables: Object.freeze([
      deliverable("deliverable-growth-architecture-map", "Growth Architecture Map", "Immutable metadata for value architecture alignment."),
      deliverable("deliverable-growth-governance-model", "Growth Governance Model", "Immutable metadata for growth governance alignment."),
    ]),
    successCriteria: Object.freeze([
      Object.freeze({ criteriaId: "criteria-growth-initiative-clarity", criteriaStatement: "Initiative remains stable and referenceable for roadmap layers.", metadataOnly: true, immutable: true }),
      Object.freeze({ criteriaId: "criteria-growth-initiative-linkage", criteriaStatement: "Initiative preserves strategy, objective, KPI, and OKR linkage consistency.", metadataOnly: true, immutable: true }),
    ]),
    assumptions: Object.freeze(["initiative-growth-demand-assumption", "initiative-growth-governance-assumption"]),
    constraints: Object.freeze(["initiative-growth-capital-constraint", "initiative-growth-focus-constraint"]),
    metadata: metadata("initiative-commercial-value-architecture-metadata"),
    version: INITIATIVE_VERSIONS[0],
    metadataOnly: true,
    immutable: true,
  }),
  Object.freeze({
    identity: Object.freeze({ initiativeId: "initiative-operating-model-resilience-hub", initiativeKey: "operating-model-resilience-hub", metadataOnly: true, immutable: true }),
    name: Object.freeze({ shortName: "Operating Model Resilience Hub", displayName: "Operating Model Resilience Hub Initiative", metadataOnly: true, immutable: true }),
    description: "Canonical initiative for resilient operating model coordination and adaptability.",
    purpose: Object.freeze({ purposeId: "purpose-operating-model-resilience-hub", purposeStatement: "Represent a resilience-aligned initiative contract without introducing coordination runtime behavior.", metadataOnly: true, immutable: true }),
    scope: Object.freeze({ scopeId: "scope-operating-model-resilience-hub", scopeStatement: "Operating adaptability, resilience coordination, and structural readiness scope.", metadataOnly: true, immutable: true }),
    category: "Operational",
    priority: "High",
    status: "Defined",
    lifecycle: "Approved",
    owner: INITIATIVE_OWNERS[1],
    sponsor: INITIATIVE_OWNERS[0],
    stakeholders: Object.freeze([
      Object.freeze({ stakeholderId: "initiative-resilience-ops", stakeholderName: "Operations Leadership", stakeholderRole: "Stakeholder", metadataOnly: true, immutable: true }),
      Object.freeze({ stakeholderId: "initiative-resilience-risk", stakeholderName: "Risk Leadership", stakeholderRole: "Stakeholder", metadataOnly: true, immutable: true }),
    ]),
    parentInitiativeId: null,
    childInitiativeIds: Object.freeze([]),
    strategyReferenceIds: Object.freeze(["strategy-operational-resilience"]),
    themeReferenceIds: Object.freeze(["theme-operational-resilience"]),
    objectiveReferenceIds: Object.freeze(["objective-strengthen-operational-adaptability"]),
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
    milestones: RESILIENCE_MILESTONES,
    deliverables: Object.freeze([
      deliverable("deliverable-resilience-operating-blueprint", "Resilience Operating Blueprint", "Immutable metadata for resilience operating blueprint alignment."),
      deliverable("deliverable-resilience-coordination-model", "Resilience Coordination Model", "Immutable metadata for resilience coordination model alignment."),
    ]),
    successCriteria: Object.freeze([
      Object.freeze({ criteriaId: "criteria-resilience-initiative-clarity", criteriaStatement: "Resilience initiative remains machine-readable and stable.", metadataOnly: true, immutable: true }),
      Object.freeze({ criteriaId: "criteria-resilience-initiative-linkage", criteriaStatement: "Resilience initiative preserves objective and operational linkage consistency.", metadataOnly: true, immutable: true }),
    ]),
    assumptions: Object.freeze(["initiative-resilience-change-assumption", "initiative-resilience-discipline-assumption"]),
    constraints: Object.freeze(["initiative-resilience-capacity-constraint", "initiative-resilience-sequencing-constraint"]),
    metadata: metadata("initiative-operating-model-resilience-hub-metadata"),
    version: INITIATIVE_VERSIONS[1],
    metadataOnly: true,
    immutable: true,
  }),
  Object.freeze({
    identity: Object.freeze({ initiativeId: "initiative-innovation-acceleration-lab", initiativeKey: "innovation-acceleration-lab", metadataOnly: true, immutable: true }),
    name: Object.freeze({ shortName: "Innovation Acceleration Lab", displayName: "Innovation Acceleration Lab Initiative", metadataOnly: true, immutable: true }),
    description: "Canonical child initiative for innovation throughput and structured experimentation metadata.",
    purpose: Object.freeze({ purposeId: "purpose-innovation-acceleration-lab", purposeStatement: "Capture innovation acceleration as a child initiative contract beneath growth architecture.", metadataOnly: true, immutable: true }),
    scope: Object.freeze({ scopeId: "scope-innovation-acceleration-lab", scopeStatement: "Innovation throughput, experimentation structure, and scaling readiness metadata scope.", metadataOnly: true, immutable: true }),
    category: "Innovation",
    priority: "Medium",
    status: "Defined",
    lifecycle: "Candidate",
    owner: INITIATIVE_OWNERS[2],
    sponsor: INITIATIVE_OWNERS[0],
    stakeholders: Object.freeze([
      Object.freeze({ stakeholderId: "initiative-innovation-product", stakeholderName: "Innovation Leadership", stakeholderRole: "Stakeholder", metadataOnly: true, immutable: true }),
      Object.freeze({ stakeholderId: "initiative-innovation-transform", stakeholderName: "Transformation Leadership", stakeholderRole: "Stakeholder", metadataOnly: true, immutable: true }),
    ]),
    parentInitiativeId: "initiative-commercial-value-architecture",
    childInitiativeIds: Object.freeze([]),
    strategyReferenceIds: Object.freeze(["strategy-profitable-growth", "strategy-operational-resilience"]),
    themeReferenceIds: Object.freeze(["theme-sustainable-growth", "theme-innovation-engine"]),
    objectiveReferenceIds: Object.freeze(["objective-expand-profitable-revenue", "objective-accelerate-innovation-throughput"]),
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
      dependency("dependency-innovation-initiative-to-resilience", "initiative-operating-model-resilience-hub", "Supports"),
    ]),
    milestones: INNOVATION_MILESTONES,
    deliverables: Object.freeze([
      deliverable("deliverable-innovation-experiment-catalog", "Innovation Experiment Catalog", "Immutable metadata for experiment structure alignment."),
      deliverable("deliverable-innovation-scale-readiness", "Innovation Scale Readiness Model", "Immutable metadata for innovation scaling readiness."),
    ]),
    successCriteria: Object.freeze([
      Object.freeze({ criteriaId: "criteria-innovation-initiative-hierarchy", criteriaStatement: "Innovation initiative preserves parent-child hierarchy integrity.", metadataOnly: true, immutable: true }),
      Object.freeze({ criteriaId: "criteria-innovation-initiative-linkage", criteriaStatement: "Innovation initiative preserves theme, objective, milestone, KPI, and OKR linkage.", metadataOnly: true, immutable: true }),
    ]),
    assumptions: Object.freeze(["initiative-innovation-adoption-assumption", "initiative-innovation-capacity-assumption"]),
    constraints: Object.freeze(["initiative-innovation-governance-constraint", "initiative-innovation-bandwidth-constraint"]),
    metadata: metadata("initiative-innovation-acceleration-lab-metadata"),
    version: INITIATIVE_VERSIONS[2],
    metadataOnly: true,
    immutable: true,
  }),
] as const);

export const EXECUTIVE_STRATEGIC_INITIATIVE_MILESTONES: readonly ExecutiveStrategicInitiativeMilestone[] = Object.freeze([
  ...GROWTH_MILESTONES,
  ...RESILIENCE_MILESTONES,
  ...INNOVATION_MILESTONES,
] as const);

export const EXECUTIVE_STRATEGIC_INITIATIVE_RELATIONSHIPS: readonly ExecutiveStrategicInitiativeRelationship[] = Object.freeze([
  Object.freeze({ relationshipId: "strategy-profitable-growth-to-initiative-growth", relationshipType: "StrategyToInitiative", sourceId: "strategy-profitable-growth", targetId: "initiative-commercial-value-architecture", metadataOnly: true, immutable: true }),
  Object.freeze({ relationshipId: "initiative-growth-to-strategy-profitable-growth", relationshipType: "InitiativeToStrategy", sourceId: "initiative-commercial-value-architecture", targetId: "strategy-profitable-growth", metadataOnly: true, immutable: true }),
  Object.freeze({ relationshipId: "strategy-operational-resilience-to-initiative-resilience", relationshipType: "StrategyToInitiative", sourceId: "strategy-operational-resilience", targetId: "initiative-operating-model-resilience-hub", metadataOnly: true, immutable: true }),
  Object.freeze({ relationshipId: "initiative-resilience-to-strategy-operational-resilience", relationshipType: "InitiativeToStrategy", sourceId: "initiative-operating-model-resilience-hub", targetId: "strategy-operational-resilience", metadataOnly: true, immutable: true }),
  Object.freeze({ relationshipId: "theme-growth-to-initiative-growth", relationshipType: "ThemeToInitiative", sourceId: "theme-sustainable-growth", targetId: "initiative-commercial-value-architecture", metadataOnly: true, immutable: true }),
  Object.freeze({ relationshipId: "initiative-growth-to-theme-growth", relationshipType: "InitiativeToTheme", sourceId: "initiative-commercial-value-architecture", targetId: "theme-sustainable-growth", metadataOnly: true, immutable: true }),
  Object.freeze({ relationshipId: "theme-resilience-to-initiative-resilience", relationshipType: "ThemeToInitiative", sourceId: "theme-operational-resilience", targetId: "initiative-operating-model-resilience-hub", metadataOnly: true, immutable: true }),
  Object.freeze({ relationshipId: "initiative-resilience-to-theme-resilience", relationshipType: "InitiativeToTheme", sourceId: "initiative-operating-model-resilience-hub", targetId: "theme-operational-resilience", metadataOnly: true, immutable: true }),
  Object.freeze({ relationshipId: "theme-innovation-to-initiative-innovation", relationshipType: "ThemeToInitiative", sourceId: "theme-innovation-engine", targetId: "initiative-innovation-acceleration-lab", metadataOnly: true, immutable: true }),
  Object.freeze({ relationshipId: "objective-growth-to-initiative-growth", relationshipType: "ObjectiveToInitiative", sourceId: "objective-expand-profitable-revenue", targetId: "initiative-commercial-value-architecture", metadataOnly: true, immutable: true }),
  Object.freeze({ relationshipId: "initiative-growth-to-objective-growth", relationshipType: "InitiativeToObjective", sourceId: "initiative-commercial-value-architecture", targetId: "objective-expand-profitable-revenue", metadataOnly: true, immutable: true }),
  Object.freeze({ relationshipId: "objective-resilience-to-initiative-resilience", relationshipType: "ObjectiveToInitiative", sourceId: "objective-strengthen-operational-adaptability", targetId: "initiative-operating-model-resilience-hub", metadataOnly: true, immutable: true }),
  Object.freeze({ relationshipId: "initiative-resilience-to-objective-resilience", relationshipType: "InitiativeToObjective", sourceId: "initiative-operating-model-resilience-hub", targetId: "objective-strengthen-operational-adaptability", metadataOnly: true, immutable: true }),
  Object.freeze({ relationshipId: "objective-innovation-to-initiative-innovation", relationshipType: "ObjectiveToInitiative", sourceId: "objective-accelerate-innovation-throughput", targetId: "initiative-innovation-acceleration-lab", metadataOnly: true, immutable: true }),
  Object.freeze({ relationshipId: "initiative-growth-parent-to-innovation-child", relationshipType: "ParentInitiativeToChildInitiative", sourceId: "initiative-commercial-value-architecture", targetId: "initiative-innovation-acceleration-lab", metadataOnly: true, immutable: true }),
  Object.freeze({ relationshipId: "initiative-growth-to-kpi-financial-health", relationshipType: "InitiativeToKpiReference", sourceId: "initiative-commercial-value-architecture", targetId: "executive-financial-health", metadataOnly: true, immutable: true }),
  Object.freeze({ relationshipId: "initiative-resilience-to-kpi-operational-readiness", relationshipType: "InitiativeToKpiReference", sourceId: "initiative-operating-model-resilience-hub", targetId: "executive-operational-readiness", metadataOnly: true, immutable: true }),
  Object.freeze({ relationshipId: "initiative-growth-to-okr-profitable-growth", relationshipType: "InitiativeToOkrReference", sourceId: "initiative-commercial-value-architecture", targetId: "objective-profitable-growth", metadataOnly: true, immutable: true }),
  Object.freeze({ relationshipId: "initiative-resilience-to-okr-operational-excellence", relationshipType: "InitiativeToOkrReference", sourceId: "initiative-operating-model-resilience-hub", targetId: "objective-operational-excellence", metadataOnly: true, immutable: true }),
  Object.freeze({ relationshipId: "initiative-growth-to-risk-volatility", relationshipType: "InitiativeToRiskReference", sourceId: "initiative-commercial-value-architecture", targetId: "risk-growth-volatility", metadataOnly: true, immutable: true }),
  Object.freeze({ relationshipId: "initiative-innovation-to-risk-focus", relationshipType: "InitiativeToRiskReference", sourceId: "initiative-innovation-acceleration-lab", targetId: "risk-innovation-focus", metadataOnly: true, immutable: true }),
  Object.freeze({ relationshipId: "initiative-growth-to-dependency-resilience", relationshipType: "InitiativeToDependency", sourceId: "initiative-commercial-value-architecture", targetId: "initiative-operating-model-resilience-hub", metadataOnly: true, immutable: true }),
  Object.freeze({ relationshipId: "initiative-innovation-to-dependency-resilience", relationshipType: "InitiativeToDependency", sourceId: "initiative-innovation-acceleration-lab", targetId: "initiative-operating-model-resilience-hub", metadataOnly: true, immutable: true }),
  Object.freeze({ relationshipId: "initiative-growth-to-milestone-readiness", relationshipType: "InitiativeToMilestone", sourceId: "initiative-commercial-value-architecture", targetId: "milestone-growth-readiness", metadataOnly: true, immutable: true }),
  Object.freeze({ relationshipId: "initiative-growth-to-milestone-validation", relationshipType: "InitiativeToMilestone", sourceId: "initiative-commercial-value-architecture", targetId: "milestone-growth-validation", metadataOnly: true, immutable: true }),
  Object.freeze({ relationshipId: "initiative-resilience-to-milestone-coordination", relationshipType: "InitiativeToMilestone", sourceId: "initiative-operating-model-resilience-hub", targetId: "milestone-resilience-coordination", metadataOnly: true, immutable: true }),
  Object.freeze({ relationshipId: "initiative-resilience-to-milestone-delivery", relationshipType: "InitiativeToMilestone", sourceId: "initiative-operating-model-resilience-hub", targetId: "milestone-resilience-delivery", metadataOnly: true, immutable: true }),
  Object.freeze({ relationshipId: "initiative-innovation-to-milestone-readiness", relationshipType: "InitiativeToMilestone", sourceId: "initiative-innovation-acceleration-lab", targetId: "milestone-innovation-readiness", metadataOnly: true, immutable: true }),
  Object.freeze({ relationshipId: "initiative-innovation-to-milestone-delivery", relationshipType: "InitiativeToMilestone", sourceId: "initiative-innovation-acceleration-lab", targetId: "milestone-innovation-delivery", metadataOnly: true, immutable: true }),
] as const);

export const EXECUTIVE_STRATEGIC_INITIATIVE_PUBLIC_APIS: readonly string[] = Object.freeze([
  "ExecutiveStrategicInitiativesPlatform",
  "buildExecutiveStrategicInitiative",
  "validateExecutiveStrategicInitiative",
  "getExecutiveStrategicInitiativesManifest",
  "listExecutiveStrategicInitiatives",
  "listExecutiveStrategicInitiativesPublicApis",
] as const);

export const EXECUTIVE_STRATEGIC_INITIATIVE_DEPENDENCIES: readonly ExecutiveStrategicInitiativePlatformDependency[] = Object.freeze([
  Object.freeze({ dependencyId: "BUS-17 Executive Strategy Foundation", compatible: true, implementationRequired: false }),
  Object.freeze({ dependencyId: "BUS-18 Executive Strategy Definition Platform", compatible: true, implementationRequired: false }),
  Object.freeze({ dependencyId: "BUS-19 Executive Strategic Themes Platform", compatible: true, implementationRequired: false }),
  Object.freeze({ dependencyId: "BUS-20 Executive Strategic Objectives Platform", compatible: true, implementationRequired: false }),
  Object.freeze({ dependencyId: "Executive KPI Platform Freeze", compatible: true, implementationRequired: false }),
  Object.freeze({ dependencyId: "Executive OKR Platform Freeze", compatible: true, implementationRequired: false }),
] as const);

export const EXECUTIVE_STRATEGIC_INITIATIVE_EXTENSION_POLICY: ExecutiveStrategicInitiativeExtensionPolicy = Object.freeze({
  policyId: "executive-strategic-initiative-extension-policy",
  extensionMode: "additive-only",
  initiativeMutationAllowed: false,
  runtimeExecutionAllowed: false,
  roadmapSchedulingAllowed: false,
  monitoringAllowed: false,
  planningAllowed: false,
  businessLogicAllowed: false,
});

export const EXECUTIVE_STRATEGIC_INITIATIVE_REGISTRY: ExecutiveStrategicInitiativeRegistry = Object.freeze({
  platformId: "BUS-21",
  platformName: "Executive Strategic Initiatives Platform",
  version: "1.0.0",
  foundationPlatformId: "BUS-17",
  definitionPlatformId: "BUS-18",
  themePlatformId: "BUS-19",
  objectivePlatformId: "BUS-20",
  kpiFreezeDependency: "BUS-12",
  okrFreezeDependency: "BUS-16",
  initiatives: EXECUTIVE_STRATEGIC_INITIATIVES,
  categories: INITIATIVE_CATEGORIES,
  statuses: EXECUTIVE_STRATEGY_STATUS_REGISTRY,
  priorities: EXECUTIVE_STRATEGY_PRIORITY_REGISTRY,
  lifecycles: EXECUTIVE_STRATEGY_LIFECYCLE_REGISTRY,
  owners: INITIATIVE_OWNERS,
  versions: INITIATIVE_VERSIONS,
  milestones: EXECUTIVE_STRATEGIC_INITIATIVE_MILESTONES,
  relationships: EXECUTIVE_STRATEGIC_INITIATIVE_RELATIONSHIPS,
  publicApis: EXECUTIVE_STRATEGIC_INITIATIVE_PUBLIC_APIS,
  extensionPolicy: EXECUTIVE_STRATEGIC_INITIATIVE_EXTENSION_POLICY,
  metadataOnly: true,
  immutable: true,
});

export function listExecutiveStrategicInitiatives(): readonly ExecutiveStrategicInitiative[] {
  return EXECUTIVE_STRATEGIC_INITIATIVES;
}

export function listExecutiveStrategicInitiativesPublicApis(): readonly string[] {
  return EXECUTIVE_STRATEGIC_INITIATIVE_PUBLIC_APIS;
}

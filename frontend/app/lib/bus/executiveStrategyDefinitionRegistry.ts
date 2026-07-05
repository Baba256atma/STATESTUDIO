import {
  EXECUTIVE_STRATEGY_LIFECYCLE_REGISTRY,
  EXECUTIVE_STRATEGY_PRIORITY_REGISTRY,
  EXECUTIVE_STRATEGY_STATUS_REGISTRY,
  type ExecutiveStrategyCategory,
  type ExecutiveStrategyMetadata,
  type ExecutiveStrategyOwner,
} from "./executiveStrategyIndex.ts";
import type {
  ExecutiveStrategyDefinition,
  ExecutiveStrategyDefinitionDependency,
  ExecutiveStrategyDefinitionExtensionPolicy,
  ExecutiveStrategyDefinitionRegistry,
  ExecutiveStrategyVersion,
} from "./executiveStrategyDefinitionTypes.ts";

const STRATEGY_DEFINITION_CATEGORIES: readonly ExecutiveStrategyCategory[] = Object.freeze([
  "Growth",
  "Operational",
  "Innovation",
  "Financial",
] as const);

const STRATEGY_VERSIONS: readonly ExecutiveStrategyVersion[] = Object.freeze([
  Object.freeze({ versionId: "strategy-definition-v1", versionLabel: "Initial Definition", semanticVersion: "1.0.0", metadataOnly: true, immutable: true }),
  Object.freeze({ versionId: "strategy-definition-v1-ops", versionLabel: "Operational Definition", semanticVersion: "1.0.0", metadataOnly: true, immutable: true }),
] as const);

const STRATEGY_OWNERS: readonly ExecutiveStrategyOwner[] = Object.freeze([
  Object.freeze({ ownerId: "chief-strategy-officer", ownerName: "Chief Strategy Officer", ownerRole: "Executive Owner", metadataOnly: true, immutable: true }),
  Object.freeze({ ownerId: "chief-operating-officer", ownerName: "Chief Operating Officer", ownerRole: "Executive Sponsor", metadataOnly: true, immutable: true }),
  Object.freeze({ ownerId: "chief-innovation-officer", ownerName: "Chief Innovation Officer", ownerRole: "Executive Sponsor", metadataOnly: true, immutable: true }),
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

export const EXECUTIVE_STRATEGY_DEFINITIONS: readonly ExecutiveStrategyDefinition[] = Object.freeze([
  Object.freeze({
    identity: Object.freeze({ strategyId: "strategy-profitable-growth", strategyKey: "profitable-growth", metadataOnly: true, immutable: true }),
    name: Object.freeze({ shortName: "Profitable Growth", displayName: "Profitable Growth Strategy", metadataOnly: true, immutable: true }),
    description: "Canonical executive strategy definition for profitable growth.",
    mission: Object.freeze({ missionId: "mission-profitable-growth", missionStatement: "Grow revenue with disciplined value creation.", metadataOnly: true, immutable: true }),
    vision: Object.freeze({ visionId: "vision-profitable-growth", visionStatement: "Build durable long-term growth visibility.", metadataOnly: true, immutable: true }),
    strategicIntent: Object.freeze({ intentId: "intent-profitable-growth", intentStatement: "Align executive choices around sustainable growth.", metadataOnly: true, immutable: true }),
    strategicScope: Object.freeze({ scopeId: "scope-profitable-growth", scopeStatement: "Enterprise growth posture across financial and commercial domains.", metadataOnly: true, immutable: true }),
    strategicPurpose: Object.freeze({ purposeId: "purpose-profitable-growth", purposeStatement: "Define the growth direction as metadata for future strategy layers.", metadataOnly: true, immutable: true }),
    strategicContext: Object.freeze({ contextId: "context-profitable-growth", contextStatement: "Strategy definition references KPI and OKR contracts without executing them.", metadataOnly: true, immutable: true }),
    timeHorizon: "Annual",
    category: "Growth",
    priority: "Critical",
    status: "Defined",
    lifecycle: "Approved",
    owner: STRATEGY_OWNERS[0],
    sponsor: STRATEGY_OWNERS[1],
    stakeholders: Object.freeze([
      Object.freeze({ stakeholderId: "finance-stakeholder", stakeholderName: "Finance Leadership", stakeholderRole: "Stakeholder", metadataOnly: true, immutable: true }),
      Object.freeze({ stakeholderId: "sales-stakeholder", stakeholderName: "Commercial Leadership", stakeholderRole: "Stakeholder", metadataOnly: true, immutable: true }),
    ]),
    assumptions: Object.freeze(["assumption-profitable-growth-demand", "assumption-profitable-growth-discipline"]),
    constraints: Object.freeze(["constraint-profitable-growth-capital", "constraint-profitable-growth-governance"]),
    successCriteria: Object.freeze([
      Object.freeze({ criteriaId: "criteria-profitable-growth-visibility", criteriaStatement: "Strategy definition is referenceable by future strategy layers.", metadataOnly: true, immutable: true }),
      Object.freeze({ criteriaId: "criteria-profitable-growth-alignment", criteriaStatement: "Strategy references KPI and OKR definitions consistently.", metadataOnly: true, immutable: true }),
    ]),
    riskReferences: Object.freeze([
      Object.freeze({ riskReferenceId: "risk-profitable-growth-execution", riskName: "Growth execution risk reference", metadataOnly: true, immutable: true }),
    ]),
    kpiReferences: Object.freeze([
      Object.freeze({ kpiReferenceId: "executive-financial-health", kpiName: "Executive Financial Health", sourcePlatformId: "BUS", metadataOnly: true, immutable: true }),
    ]),
    okrReferences: Object.freeze([
      Object.freeze({ okrReferenceId: "objective-profitable-growth", okrName: "Profitable Growth Objective", sourcePlatformId: "BUS-OKR", metadataOnly: true, immutable: true }),
    ]),
    metadata: metadata("strategy-profitable-growth-metadata"),
    version: STRATEGY_VERSIONS[0],
    metadataOnly: true,
    immutable: true,
  }),
  Object.freeze({
    identity: Object.freeze({ strategyId: "strategy-operational-resilience", strategyKey: "operational-resilience", metadataOnly: true, immutable: true }),
    name: Object.freeze({ shortName: "Operational Resilience", displayName: "Operational Resilience Strategy", metadataOnly: true, immutable: true }),
    description: "Canonical executive strategy definition for operational resilience.",
    mission: Object.freeze({ missionId: "mission-operational-resilience", missionStatement: "Strengthen operational resilience through aligned executive definitions.", metadataOnly: true, immutable: true }),
    vision: Object.freeze({ visionId: "vision-operational-resilience", visionStatement: "Maintain a resilient operating model over time.", metadataOnly: true, immutable: true }),
    strategicIntent: Object.freeze({ intentId: "intent-operational-resilience", intentStatement: "Provide a stable executive definition for resilience-focused strategies.", metadataOnly: true, immutable: true }),
    strategicScope: Object.freeze({ scopeId: "scope-operational-resilience", scopeStatement: "Operations and transformation domains with cross-functional references.", metadataOnly: true, immutable: true }),
    strategicPurpose: Object.freeze({ purposeId: "purpose-operational-resilience", purposeStatement: "Prepare downstream strategy layers with a resilient operating model contract.", metadataOnly: true, immutable: true }),
    strategicContext: Object.freeze({ contextId: "context-operational-resilience", contextStatement: "Definition layer provides structure only and avoids execution behavior.", metadataOnly: true, immutable: true }),
    timeHorizon: "Multi-Year",
    category: "Operational",
    priority: "High",
    status: "Aligned",
    lifecycle: "Approved",
    owner: STRATEGY_OWNERS[1],
    sponsor: STRATEGY_OWNERS[2],
    stakeholders: Object.freeze([
      Object.freeze({ stakeholderId: "ops-stakeholder", stakeholderName: "Operations Leadership", stakeholderRole: "Stakeholder", metadataOnly: true, immutable: true }),
      Object.freeze({ stakeholderId: "innovation-stakeholder", stakeholderName: "Innovation Leadership", stakeholderRole: "Stakeholder", metadataOnly: true, immutable: true }),
    ]),
    assumptions: Object.freeze(["assumption-operational-resilience-change", "assumption-operational-resilience-adoption"]),
    constraints: Object.freeze(["constraint-operational-resilience-capacity", "constraint-operational-resilience-timeline"]),
    successCriteria: Object.freeze([
      Object.freeze({ criteriaId: "criteria-operational-resilience-structure", criteriaStatement: "Strategy definition remains stable and machine-readable.", metadataOnly: true, immutable: true }),
      Object.freeze({ criteriaId: "criteria-operational-resilience-references", criteriaStatement: "Strategy references operational KPI and OKR metadata consistently.", metadataOnly: true, immutable: true }),
    ]),
    riskReferences: Object.freeze([
      Object.freeze({ riskReferenceId: "risk-operational-resilience-disruption", riskName: "Operational disruption risk reference", metadataOnly: true, immutable: true }),
    ]),
    kpiReferences: Object.freeze([
      Object.freeze({ kpiReferenceId: "executive-operational-readiness", kpiName: "Executive Operational Readiness", sourcePlatformId: "BUS", metadataOnly: true, immutable: true }),
    ]),
    okrReferences: Object.freeze([
      Object.freeze({ okrReferenceId: "objective-operational-excellence", okrName: "Operational Excellence Objective", sourcePlatformId: "BUS-OKR", metadataOnly: true, immutable: true }),
    ]),
    metadata: metadata("strategy-operational-resilience-metadata"),
    version: STRATEGY_VERSIONS[1],
    metadataOnly: true,
    immutable: true,
  }),
] as const);

export const EXECUTIVE_STRATEGY_DEFINITION_PUBLIC_APIS: readonly string[] = Object.freeze([
  "ExecutiveStrategyDefinitionPlatform",
  "buildExecutiveStrategyDefinition",
  "validateExecutiveStrategyDefinition",
  "getExecutiveStrategyDefinitionManifest",
  "listExecutiveStrategyDefinitions",
  "listExecutiveStrategyDefinitionPublicApis",
] as const);

export const EXECUTIVE_STRATEGY_DEFINITION_DEPENDENCIES: readonly ExecutiveStrategyDefinitionDependency[] = Object.freeze([
  Object.freeze({ dependencyId: "BUS-17 Executive Strategy Foundation", compatible: true, implementationRequired: false }),
  Object.freeze({ dependencyId: "Executive KPI Platform Freeze", compatible: true, implementationRequired: false }),
  Object.freeze({ dependencyId: "Executive OKR Platform Freeze", compatible: true, implementationRequired: false }),
] as const);

export const EXECUTIVE_STRATEGY_DEFINITION_EXTENSION_POLICY: ExecutiveStrategyDefinitionExtensionPolicy = Object.freeze({
  policyId: "executive-strategy-definition-extension-policy",
  extensionMode: "additive-only",
  definitionMutationAllowed: false,
  runtimeExecutionAllowed: false,
  planningAllowed: false,
  simulationAllowed: false,
  businessLogicAllowed: false,
});

export const EXECUTIVE_STRATEGY_DEFINITION_REGISTRY: ExecutiveStrategyDefinitionRegistry = Object.freeze({
  platformId: "BUS-18",
  platformName: "Executive Strategy Definition Platform",
  version: "1.0.0",
  foundationPlatformId: "BUS-17",
  kpiFreezeDependency: "BUS-12",
  okrFreezeDependency: "BUS-16",
  strategyDefinitions: EXECUTIVE_STRATEGY_DEFINITIONS,
  categories: STRATEGY_DEFINITION_CATEGORIES,
  statuses: EXECUTIVE_STRATEGY_STATUS_REGISTRY,
  priorities: EXECUTIVE_STRATEGY_PRIORITY_REGISTRY,
  lifecycles: EXECUTIVE_STRATEGY_LIFECYCLE_REGISTRY,
  versions: STRATEGY_VERSIONS,
  owners: STRATEGY_OWNERS,
  publicApis: EXECUTIVE_STRATEGY_DEFINITION_PUBLIC_APIS,
  extensionPolicy: EXECUTIVE_STRATEGY_DEFINITION_EXTENSION_POLICY,
  metadataOnly: true,
  immutable: true,
});

export function listExecutiveStrategyDefinitions(): readonly ExecutiveStrategyDefinition[] {
  return EXECUTIVE_STRATEGY_DEFINITIONS;
}

export function listExecutiveStrategyDefinitionPublicApis(): readonly string[] {
  return EXECUTIVE_STRATEGY_DEFINITION_PUBLIC_APIS;
}

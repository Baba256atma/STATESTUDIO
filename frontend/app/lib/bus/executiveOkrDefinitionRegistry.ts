import type {
  ExecutiveKeyResult,
  ExecutiveKeyResultCategory,
  ExecutiveObjective,
  ExecutiveObjectiveCategory,
  ExecutiveOkrDefinitionRegistry,
  ExecutiveOkrLifecycleState,
  ExecutiveOkrStrategicHorizon,
} from "./executiveOkrDefinitionTypes.ts";

export const EXECUTIVE_OBJECTIVE_CATEGORIES: readonly ExecutiveObjectiveCategory[] = Object.freeze([
  "Growth",
  "Financial",
  "Customer",
  "Operational Excellence",
  "Innovation",
  "Transformation",
  "People",
  "Risk",
  "Sustainability",
  "Custom",
] as const);

export const EXECUTIVE_KEY_RESULT_CATEGORIES: readonly ExecutiveKeyResultCategory[] = Object.freeze([
  "Revenue",
  "Cost",
  "Efficiency",
  "Quality",
  "Delivery",
  "Customer",
  "Risk",
  "Capability",
  "Compliance",
  "Custom",
] as const);

export const EXECUTIVE_OKR_STRATEGIC_HORIZONS: readonly ExecutiveOkrStrategicHorizon[] = Object.freeze([
  "Quarterly",
  "Annual",
  "Multi-Year",
  "Long-Term",
] as const);

export const EXECUTIVE_OKR_LIFECYCLE_STATES: readonly ExecutiveOkrLifecycleState[] = Object.freeze([
  "Draft",
  "Candidate",
  "Approved",
  "Active",
  "Deprecated",
  "Archived",
] as const);

export const EXECUTIVE_OKR_KPI_LINKAGE_IDS: readonly string[] = Object.freeze([
  "executive-financial-health",
  "executive-operational-readiness",
] as const);

export const EXECUTIVE_OBJECTIVES: readonly ExecutiveObjective[] = Object.freeze([
  Object.freeze({
    objectiveId: "objective-profitable-growth",
    objectiveName: "Profitable Growth Objective",
    objectiveDescription: "Metadata definition for an executive profitable growth objective.",
    objectiveCategory: "Growth",
    businessDomain: "Finance",
    executiveOwner: Object.freeze({ ownerId: "finance-owner", ownerName: "Finance Owner", ownerRole: "Executive Sponsor", metadataOnly: true }),
    strategicHorizon: "Annual",
    reviewCadence: "Quarterly",
    linkedKeyResultIds: Object.freeze(["kr-financial-health-visibility"] as const),
    linkedKpiIds: Object.freeze(["executive-financial-health"] as const),
    governanceReference: "financial-health-governance",
    lifecycleState: "Draft",
    metadata: Object.freeze({ metadataId: "profitable-growth-objective-metadata", metadataOnly: true, immutable: true }),
    metadataOnly: true,
    immutable: true,
  }),
  Object.freeze({
    objectiveId: "objective-operational-excellence",
    objectiveName: "Operational Excellence Objective",
    objectiveDescription: "Metadata definition for an executive operational excellence objective.",
    objectiveCategory: "Operational Excellence",
    businessDomain: "Operations",
    executiveOwner: Object.freeze({ ownerId: "operations-owner", ownerName: "Operations Owner", ownerRole: "Executive Sponsor", metadataOnly: true }),
    strategicHorizon: "Quarterly",
    reviewCadence: "Monthly",
    linkedKeyResultIds: Object.freeze(["kr-operational-readiness-visibility"] as const),
    linkedKpiIds: Object.freeze(["executive-operational-readiness"] as const),
    governanceReference: "operational-readiness-governance",
    lifecycleState: "Draft",
    metadata: Object.freeze({ metadataId: "operational-excellence-objective-metadata", metadataOnly: true, immutable: true }),
    metadataOnly: true,
    immutable: true,
  }),
] as const);

export const EXECUTIVE_KEY_RESULTS: readonly ExecutiveKeyResult[] = Object.freeze([
  Object.freeze({
    keyResultId: "kr-financial-health-visibility",
    keyResultName: "Financial Health Visibility Key Result",
    keyResultDescription: "Metadata definition for a financial health visibility key result.",
    keyResultCategory: "Revenue",
    parentObjectiveId: "objective-profitable-growth",
    linkedKpiIds: Object.freeze(["executive-financial-health"] as const),
    measurementMetadata: Object.freeze({ measurementId: "financial-health-kr-measurement", measurementDescription: "Value-free measurement metadata for financial health.", valueFree: true, metadataOnly: true }),
    targetReference: "financial-health-target-reference",
    businessDomain: "Finance",
    owner: Object.freeze({ ownerId: "finance-owner", ownerName: "Finance Owner", ownerRole: "Executive Steward", metadataOnly: true }),
    reviewCadence: "Quarterly",
    governanceReference: "financial-health-governance",
    lifecycleState: "Draft",
    metadata: Object.freeze({ metadataId: "financial-health-key-result-metadata", metadataOnly: true, immutable: true }),
    metadataOnly: true,
    immutable: true,
  }),
  Object.freeze({
    keyResultId: "kr-operational-readiness-visibility",
    keyResultName: "Operational Readiness Visibility Key Result",
    keyResultDescription: "Metadata definition for an operational readiness visibility key result.",
    keyResultCategory: "Efficiency",
    parentObjectiveId: "objective-operational-excellence",
    linkedKpiIds: Object.freeze(["executive-operational-readiness"] as const),
    measurementMetadata: Object.freeze({ measurementId: "operational-readiness-kr-measurement", measurementDescription: "Value-free measurement metadata for operational readiness.", valueFree: true, metadataOnly: true }),
    targetReference: "operational-readiness-target-reference",
    businessDomain: "Operations",
    owner: Object.freeze({ ownerId: "operations-owner", ownerName: "Operations Owner", ownerRole: "Executive Steward", metadataOnly: true }),
    reviewCadence: "Monthly",
    governanceReference: "operational-readiness-governance",
    lifecycleState: "Draft",
    metadata: Object.freeze({ metadataId: "operational-readiness-key-result-metadata", metadataOnly: true, immutable: true }),
    metadataOnly: true,
    immutable: true,
  }),
] as const);

export const EXECUTIVE_OKR_DEFINITION_PUBLIC_APIS: readonly string[] = Object.freeze([
  "ExecutiveOkrDefinitionPlatform",
  "getExecutiveOkrDefinitionPlatform",
  "getExecutiveOkrDefinitionManifest",
  "validateExecutiveOkrDefinitions",
  "listExecutiveObjectives",
  "listExecutiveKeyResults",
  "listExecutiveObjectiveCategories",
  "listExecutiveKeyResultCategories",
  "listExecutiveStrategicHorizons",
  "listExecutiveOkrLifecycleStates",
] as const);

export const EXECUTIVE_OKR_DEFINITION_REGISTRY: ExecutiveOkrDefinitionRegistry = Object.freeze({
  platformId: "BUS-14",
  platformName: "Executive OKR Definition Platform",
  version: "1.0.0",
  foundationPlatformId: "BUS-13",
  kpiFreezeDependency: "BUS-12",
  objectives: EXECUTIVE_OBJECTIVES,
  keyResults: EXECUTIVE_KEY_RESULTS,
  objectiveCategories: EXECUTIVE_OBJECTIVE_CATEGORIES,
  keyResultCategories: EXECUTIVE_KEY_RESULT_CATEGORIES,
  strategicHorizons: EXECUTIVE_OKR_STRATEGIC_HORIZONS,
  lifecycleStates: EXECUTIVE_OKR_LIFECYCLE_STATES,
  kpiLinkageIds: EXECUTIVE_OKR_KPI_LINKAGE_IDS,
  publicApis: EXECUTIVE_OKR_DEFINITION_PUBLIC_APIS,
  metadataOnly: true,
  immutable: true,
});

export function listExecutiveObjectives(): readonly ExecutiveObjective[] {
  return EXECUTIVE_OBJECTIVES;
}

export function listExecutiveKeyResults(): readonly ExecutiveKeyResult[] {
  return EXECUTIVE_KEY_RESULTS;
}

export function listExecutiveObjectiveCategories(): readonly ExecutiveObjectiveCategory[] {
  return EXECUTIVE_OBJECTIVE_CATEGORIES;
}

export function listExecutiveKeyResultCategories(): readonly ExecutiveKeyResultCategory[] {
  return EXECUTIVE_KEY_RESULT_CATEGORIES;
}

export function listExecutiveStrategicHorizons(): readonly ExecutiveOkrStrategicHorizon[] {
  return EXECUTIVE_OKR_STRATEGIC_HORIZONS;
}

export function listExecutiveOkrLifecycleStates(): readonly ExecutiveOkrLifecycleState[] {
  return EXECUTIVE_OKR_LIFECYCLE_STATES;
}

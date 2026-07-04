import type {
  ExecutiveKpiCategory,
  ExecutiveKpiCategoryDeclaration,
  ExecutiveKpiDefinition,
  ExecutiveKpiDefinitionRegistry,
  ExecutiveKpiDirection,
  ExecutiveKpiLifecycleState,
} from "./executiveKpiDefinitionTypes.ts";

export const EXECUTIVE_KPI_CATEGORIES: readonly ExecutiveKpiCategoryDeclaration[] = Object.freeze([
  Object.freeze({ category: "Financial", description: "Financial KPI metadata category.", metadataOnly: true }),
  Object.freeze({ category: "Operational", description: "Operational KPI metadata category.", metadataOnly: true }),
  Object.freeze({ category: "Customer", description: "Customer KPI metadata category.", metadataOnly: true }),
  Object.freeze({ category: "Sales", description: "Sales KPI metadata category.", metadataOnly: true }),
  Object.freeze({ category: "Marketing", description: "Marketing KPI metadata category.", metadataOnly: true }),
  Object.freeze({ category: "Project", description: "Project KPI metadata category.", metadataOnly: true }),
  Object.freeze({ category: "Resource", description: "Resource KPI metadata category.", metadataOnly: true }),
  Object.freeze({ category: "Risk", description: "Risk KPI metadata category.", metadataOnly: true }),
  Object.freeze({ category: "Strategic", description: "Strategic KPI metadata category.", metadataOnly: true }),
  Object.freeze({ category: "Growth", description: "Growth KPI metadata category.", metadataOnly: true }),
  Object.freeze({ category: "Quality", description: "Quality KPI metadata category.", metadataOnly: true }),
  Object.freeze({ category: "Execution", description: "Execution KPI metadata category.", metadataOnly: true }),
] as const);

export const EXECUTIVE_KPI_DIRECTIONS: readonly ExecutiveKpiDirection[] = Object.freeze([
  "Higher Is Better",
  "Lower Is Better",
  "Target Range",
  "Neutral Observation",
] as const);

export const EXECUTIVE_KPI_LIFECYCLE_STATES: readonly ExecutiveKpiLifecycleState[] = Object.freeze([
  "Draft",
  "Candidate",
  "Approved",
  "Active",
  "Deprecated",
  "Archived",
] as const);

export const EXECUTIVE_KPI_DEFINITIONS: readonly ExecutiveKpiDefinition[] = Object.freeze([
  Object.freeze({
    kpiId: "executive-financial-health",
    name: "Executive Financial Health",
    description: "Metadata definition for executive financial health.",
    category: "Financial",
    owner: Object.freeze({ ownerId: "finance-owner", ownerName: "Finance Owner", ownerRole: "Executive Steward", ownershipScope: "Domain" }),
    businessDomain: "Finance",
    unitType: "Index",
    direction: "Higher Is Better",
    lifecycleState: "Draft",
    sourceRequirement: Object.freeze({ requirementId: "financial-source-requirement", sourceType: "Declared", required: true, metadataOnly: true }),
    confidenceRequirement: Object.freeze({ requirementId: "financial-confidence-requirement", confidenceType: "Declared Confidence", required: true, metadataOnly: true }),
    governanceMetadata: Object.freeze({ governanceId: "financial-governance", stewardshipRequired: true, reviewRequired: true, metadataOnly: true }),
    metadataOnly: true,
    immutable: true,
  }),
  Object.freeze({
    kpiId: "executive-operational-readiness",
    name: "Executive Operational Readiness",
    description: "Metadata definition for executive operational readiness.",
    category: "Operational",
    owner: Object.freeze({ ownerId: "operations-owner", ownerName: "Operations Owner", ownerRole: "Executive Steward", ownershipScope: "Domain" }),
    businessDomain: "Operations",
    unitType: "Index",
    direction: "Higher Is Better",
    lifecycleState: "Draft",
    sourceRequirement: Object.freeze({ requirementId: "operational-source-requirement", sourceType: "Declared", required: true, metadataOnly: true }),
    confidenceRequirement: Object.freeze({ requirementId: "operational-confidence-requirement", confidenceType: "Governance Confidence", required: true, metadataOnly: true }),
    governanceMetadata: Object.freeze({ governanceId: "operational-governance", stewardshipRequired: true, reviewRequired: true, metadataOnly: true }),
    metadataOnly: true,
    immutable: true,
  }),
] as const);

export const EXECUTIVE_KPI_DEFINITION_PUBLIC_APIS: readonly string[] = Object.freeze([
  "ExecutiveKpiDefinitionPlatform",
  "getExecutiveKpiDefinitionPlatform",
  "getExecutiveKpiDefinitionManifest",
  "validateExecutiveKpiDefinitions",
  "listExecutiveKpiDefinitions",
  "listExecutiveKpiCategories",
  "listExecutiveKpiLifecycleStates",
  "listExecutiveKpiDirections",
] as const);

export const EXECUTIVE_KPI_DEFINITION_REGISTRY: ExecutiveKpiDefinitionRegistry = Object.freeze({
  platformId: "BUS-2",
  platformName: "Executive KPI Definition Platform",
  version: "1.0.0",
  foundationPlatformId: "BUS-1",
  definitions: EXECUTIVE_KPI_DEFINITIONS,
  categories: EXECUTIVE_KPI_CATEGORIES,
  directions: EXECUTIVE_KPI_DIRECTIONS,
  lifecycleStates: EXECUTIVE_KPI_LIFECYCLE_STATES,
  publicApis: EXECUTIVE_KPI_DEFINITION_PUBLIC_APIS,
  metadataOnly: true,
  immutable: true,
});

export function listExecutiveKpiDefinitions(): readonly ExecutiveKpiDefinition[] {
  return EXECUTIVE_KPI_DEFINITIONS;
}

export function listExecutiveKpiCategories(): readonly ExecutiveKpiCategoryDeclaration[] {
  return EXECUTIVE_KPI_CATEGORIES;
}

export function listExecutiveKpiLifecycleStates(): readonly ExecutiveKpiLifecycleState[] {
  return EXECUTIVE_KPI_LIFECYCLE_STATES;
}

export function listExecutiveKpiDirections(): readonly ExecutiveKpiDirection[] {
  return EXECUTIVE_KPI_DIRECTIONS;
}

export function listExecutiveKpiCategoryNames(): readonly ExecutiveKpiCategory[] {
  return Object.freeze(EXECUTIVE_KPI_CATEGORIES.map((entry) => entry.category));
}

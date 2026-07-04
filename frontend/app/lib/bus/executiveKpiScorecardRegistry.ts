import type {
  ExecutiveKpiScorecard,
  ExecutiveKpiScorecardCategory,
  ExecutiveKpiScorecardHierarchyLevel,
  ExecutiveKpiScorecardLifecycleState,
  ExecutiveKpiScorecardRegistry,
  ExecutiveKpiScorecardVisibilityLevel,
} from "./executiveKpiScorecardTypes.ts";

export const EXECUTIVE_KPI_SCORECARD_CATEGORIES: readonly ExecutiveKpiScorecardCategory[] = Object.freeze([
  "Executive",
  "Corporate",
  "Strategic",
  "Operational",
  "Financial",
  "Risk",
  "Project",
  "Department",
  "Portfolio",
  "Custom",
] as const);

export const EXECUTIVE_KPI_SCORECARD_HIERARCHY_LEVELS: readonly ExecutiveKpiScorecardHierarchyLevel[] = Object.freeze([
  "Root",
  "Parent",
  "Child",
  "Standalone",
] as const);

export const EXECUTIVE_KPI_SCORECARD_VISIBILITY_LEVELS: readonly ExecutiveKpiScorecardVisibilityLevel[] = Object.freeze([
  "Executive Only",
  "Management",
  "Department",
  "Organization",
  "Public Internal",
  "Restricted",
] as const);

export const EXECUTIVE_KPI_SCORECARD_LIFECYCLE_STATES: readonly ExecutiveKpiScorecardLifecycleState[] = Object.freeze([
  "Draft",
  "Candidate",
  "Approved",
  "Active",
  "Deprecated",
  "Archived",
] as const);

export const EXECUTIVE_KPI_SCORECARDS: readonly ExecutiveKpiScorecard[] = Object.freeze([
  Object.freeze({
    scorecardId: "executive-finance-scorecard",
    scorecardName: "Executive Finance Scorecard",
    scorecardDescription: "Metadata grouping for executive finance KPIs.",
    scorecardCategory: "Financial",
    businessDomain: "Finance",
    executiveOwner: Object.freeze({ ownerId: "finance-scorecard-owner", ownerName: "Finance Scorecard Owner", ownerRole: "Executive Owner", metadataOnly: true }),
    supportedKpiIds: Object.freeze(["executive-financial-health"] as const),
    hierarchyLevel: "Standalone",
    parentScorecardId: null,
    childScorecardIds: Object.freeze([] as const),
    visibilityMetadata: Object.freeze({ visibilityId: "finance-scorecard-visibility", visibilityLevel: "Executive Only", metadataOnly: true }),
    reviewCadence: "Quarterly",
    governanceReferenceId: "financial-health-governance",
    lifecycleState: "Draft",
    metadata: Object.freeze({ metadataId: "finance-scorecard-metadata", metadataOnly: true, immutable: true }),
    metadataOnly: true,
    immutable: true,
  }),
  Object.freeze({
    scorecardId: "executive-operations-scorecard",
    scorecardName: "Executive Operations Scorecard",
    scorecardDescription: "Metadata grouping for executive operations KPIs.",
    scorecardCategory: "Operational",
    businessDomain: "Operations",
    executiveOwner: Object.freeze({ ownerId: "operations-scorecard-owner", ownerName: "Operations Scorecard Owner", ownerRole: "Executive Owner", metadataOnly: true }),
    supportedKpiIds: Object.freeze(["executive-operational-readiness"] as const),
    hierarchyLevel: "Standalone",
    parentScorecardId: null,
    childScorecardIds: Object.freeze([] as const),
    visibilityMetadata: Object.freeze({ visibilityId: "operations-scorecard-visibility", visibilityLevel: "Management", metadataOnly: true }),
    reviewCadence: "Monthly",
    governanceReferenceId: "operational-readiness-governance",
    lifecycleState: "Draft",
    metadata: Object.freeze({ metadataId: "operations-scorecard-metadata", metadataOnly: true, immutable: true }),
    metadataOnly: true,
    immutable: true,
  }),
] as const);

export const EXECUTIVE_KPI_SCORECARD_PUBLIC_APIS: readonly string[] = Object.freeze([
  "ExecutiveKpiScorecardPlatform",
  "getExecutiveKpiScorecardPlatform",
  "getExecutiveKpiScorecardManifest",
  "validateExecutiveKpiScorecards",
  "listExecutiveKpiScorecards",
  "listExecutiveScorecardCategories",
  "listExecutiveScorecardHierarchyLevels",
  "listExecutiveScorecardVisibilityLevels",
  "listExecutiveScorecardLifecycleStates",
] as const);

export const EXECUTIVE_KPI_SCORECARD_REGISTRY: ExecutiveKpiScorecardRegistry = Object.freeze({
  platformId: "BUS-6",
  platformName: "Executive KPI Scorecard Platform",
  version: "1.0.0",
  foundationPlatformId: "BUS-1",
  definitionPlatformId: "BUS-2",
  sourceMappingPlatformId: "BUS-3",
  targetPlatformId: "BUS-4",
  governancePlatformId: "BUS-5",
  scorecards: EXECUTIVE_KPI_SCORECARDS,
  categories: EXECUTIVE_KPI_SCORECARD_CATEGORIES,
  hierarchyLevels: EXECUTIVE_KPI_SCORECARD_HIERARCHY_LEVELS,
  visibilityLevels: EXECUTIVE_KPI_SCORECARD_VISIBILITY_LEVELS,
  lifecycleStates: EXECUTIVE_KPI_SCORECARD_LIFECYCLE_STATES,
  publicApis: EXECUTIVE_KPI_SCORECARD_PUBLIC_APIS,
  metadataOnly: true,
  immutable: true,
});

export function listExecutiveKpiScorecards(): readonly ExecutiveKpiScorecard[] {
  return EXECUTIVE_KPI_SCORECARDS;
}

export function listExecutiveScorecardCategories(): readonly ExecutiveKpiScorecardCategory[] {
  return EXECUTIVE_KPI_SCORECARD_CATEGORIES;
}

export function listExecutiveScorecardHierarchyLevels(): readonly ExecutiveKpiScorecardHierarchyLevel[] {
  return EXECUTIVE_KPI_SCORECARD_HIERARCHY_LEVELS;
}

export function listExecutiveScorecardVisibilityLevels(): readonly ExecutiveKpiScorecardVisibilityLevel[] {
  return EXECUTIVE_KPI_SCORECARD_VISIBILITY_LEVELS;
}

export function listExecutiveScorecardLifecycleStates(): readonly ExecutiveKpiScorecardLifecycleState[] {
  return EXECUTIVE_KPI_SCORECARD_LIFECYCLE_STATES;
}

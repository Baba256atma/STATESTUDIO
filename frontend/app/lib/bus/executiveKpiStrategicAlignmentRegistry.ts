import type {
  ExecutiveAlignmentStrengthLevel,
  ExecutiveKpiStrategicAlignment,
  ExecutiveKpiStrategicAlignmentRegistry,
  ExecutiveStrategicAlignmentCategory,
  ExecutiveStrategicAlignmentLifecycleState,
  ExecutiveStrategicHorizon,
} from "./executiveKpiStrategicAlignmentTypes.ts";

export const EXECUTIVE_STRATEGIC_ALIGNMENT_CATEGORIES: readonly ExecutiveStrategicAlignmentCategory[] = Object.freeze([
  "Mission",
  "Vision",
  "Strategic Objective",
  "Business Goal",
  "Initiative",
  "Transformation",
  "Operational Excellence",
  "Growth",
  "Innovation",
  "Customer Success",
  "Risk Reduction",
  "Custom",
] as const);

export const EXECUTIVE_ALIGNMENT_STRENGTH_LEVELS: readonly ExecutiveAlignmentStrengthLevel[] = Object.freeze([
  "Primary",
  "Strong",
  "Supporting",
  "Indirect",
  "Informational",
] as const);

export const EXECUTIVE_STRATEGIC_HORIZONS: readonly ExecutiveStrategicHorizon[] = Object.freeze([
  "Immediate",
  "Quarterly",
  "Annual",
  "Multi-Year",
  "Long-Term",
] as const);

export const EXECUTIVE_STRATEGIC_ALIGNMENT_LIFECYCLE_STATES: readonly ExecutiveStrategicAlignmentLifecycleState[] =
  Object.freeze(["Draft", "Candidate", "Approved", "Active", "Deprecated", "Archived"] as const);

export const EXECUTIVE_KPI_STRATEGIC_ALIGNMENTS: readonly ExecutiveKpiStrategicAlignment[] = Object.freeze([
  Object.freeze({
    alignmentId: "financial-health-growth-alignment",
    kpiId: "executive-financial-health",
    strategicObjectiveId: "strategic-objective-financial-resilience",
    businessGoalId: "business-goal-profitable-growth",
    initiativeId: "initiative-capital-discipline",
    strategicTheme: "Financial Resilience",
    alignmentCategory: "Strategic Objective",
    alignmentStrength: "Primary",
    strategicHorizon: "Annual",
    executiveOwner: "Finance Owner",
    businessDomain: "Finance",
    reviewCadence: "Quarterly",
    governanceReferenceId: "financial-health-governance",
    scorecardReferenceId: "executive-finance-scorecard",
    insightReferenceIds: Object.freeze(["financial-health-performance-signal"] as const),
    lifecycleState: "Draft",
    metadata: Object.freeze({ metadataId: "financial-alignment-metadata", metadataOnly: true, immutable: true }),
    metadataOnly: true,
    immutable: true,
  }),
  Object.freeze({
    alignmentId: "operational-readiness-excellence-alignment",
    kpiId: "executive-operational-readiness",
    strategicObjectiveId: "strategic-objective-operational-excellence",
    businessGoalId: "business-goal-execution-reliability",
    initiativeId: "initiative-operating-model-readiness",
    strategicTheme: "Operational Excellence",
    alignmentCategory: "Operational Excellence",
    alignmentStrength: "Strong",
    strategicHorizon: "Quarterly",
    executiveOwner: "Operations Owner",
    businessDomain: "Operations",
    reviewCadence: "Monthly",
    governanceReferenceId: "operational-readiness-governance",
    scorecardReferenceId: "executive-operations-scorecard",
    insightReferenceIds: Object.freeze(["operational-readiness-execution-signal"] as const),
    lifecycleState: "Draft",
    metadata: Object.freeze({ metadataId: "operational-alignment-metadata", metadataOnly: true, immutable: true }),
    metadataOnly: true,
    immutable: true,
  }),
] as const);

export const EXECUTIVE_KPI_STRATEGIC_ALIGNMENT_PUBLIC_APIS: readonly string[] = Object.freeze([
  "ExecutiveKpiStrategicAlignmentPlatform",
  "getExecutiveKpiStrategicAlignmentPlatform",
  "getExecutiveKpiStrategicAlignmentManifest",
  "validateExecutiveKpiStrategicAlignments",
  "listExecutiveKpiStrategicAlignments",
  "listExecutiveStrategicAlignmentCategories",
  "listExecutiveAlignmentStrengthLevels",
  "listExecutiveStrategicHorizons",
  "listExecutiveStrategicAlignmentLifecycleStates",
] as const);

export const EXECUTIVE_KPI_STRATEGIC_ALIGNMENT_REGISTRY: ExecutiveKpiStrategicAlignmentRegistry = Object.freeze({
  platformId: "BUS-8",
  platformName: "Executive KPI Strategic Alignment Platform",
  version: "1.0.0",
  foundationPlatformId: "BUS-1",
  definitionPlatformId: "BUS-2",
  sourceMappingPlatformId: "BUS-3",
  targetPlatformId: "BUS-4",
  governancePlatformId: "BUS-5",
  scorecardPlatformId: "BUS-6",
  insightPlatformId: "BUS-7",
  alignments: EXECUTIVE_KPI_STRATEGIC_ALIGNMENTS,
  categories: EXECUTIVE_STRATEGIC_ALIGNMENT_CATEGORIES,
  strengthLevels: EXECUTIVE_ALIGNMENT_STRENGTH_LEVELS,
  strategicHorizons: EXECUTIVE_STRATEGIC_HORIZONS,
  lifecycleStates: EXECUTIVE_STRATEGIC_ALIGNMENT_LIFECYCLE_STATES,
  publicApis: EXECUTIVE_KPI_STRATEGIC_ALIGNMENT_PUBLIC_APIS,
  metadataOnly: true,
  immutable: true,
});

export function listExecutiveKpiStrategicAlignments(): readonly ExecutiveKpiStrategicAlignment[] {
  return EXECUTIVE_KPI_STRATEGIC_ALIGNMENTS;
}

export function listExecutiveStrategicAlignmentCategories(): readonly ExecutiveStrategicAlignmentCategory[] {
  return EXECUTIVE_STRATEGIC_ALIGNMENT_CATEGORIES;
}

export function listExecutiveAlignmentStrengthLevels(): readonly ExecutiveAlignmentStrengthLevel[] {
  return EXECUTIVE_ALIGNMENT_STRENGTH_LEVELS;
}

export function listExecutiveStrategicHorizons(): readonly ExecutiveStrategicHorizon[] {
  return EXECUTIVE_STRATEGIC_HORIZONS;
}

export function listExecutiveStrategicAlignmentLifecycleStates(): readonly ExecutiveStrategicAlignmentLifecycleState[] {
  return EXECUTIVE_STRATEGIC_ALIGNMENT_LIFECYCLE_STATES;
}

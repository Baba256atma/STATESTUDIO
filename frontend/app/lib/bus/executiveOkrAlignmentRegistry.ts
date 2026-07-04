import type {
  ExecutiveOkrAlignment,
  ExecutiveOkrAlignmentCategory,
  ExecutiveOkrAlignmentLifecycleState,
  ExecutiveOkrAlignmentRegistry,
  ExecutiveOkrAlignmentStrength,
  ExecutiveOkrDependencyType,
  ExecutiveOkrStrategicTheme,
} from "./executiveOkrAlignmentTypes.ts";

export const EXECUTIVE_OKR_ALIGNMENT_CATEGORIES: readonly ExecutiveOkrAlignmentCategory[] = Object.freeze([
  "Strategic",
  "Operational",
  "Financial",
  "Customer",
  "Innovation",
  "Transformation",
  "Cross-Functional",
  "Portfolio",
  "Program",
  "Custom",
] as const);

export const EXECUTIVE_OKR_ALIGNMENT_STRENGTH_LEVELS: readonly ExecutiveOkrAlignmentStrength[] = Object.freeze([
  "Primary",
  "Strong",
  "Supporting",
  "Indirect",
  "Informational",
] as const);

export const EXECUTIVE_OKR_DEPENDENCY_TYPES: readonly ExecutiveOkrDependencyType[] = Object.freeze([
  "Requires",
  "Supports",
  "Influences",
  "References",
  "Independent",
] as const);

export const EXECUTIVE_OKR_STRATEGIC_THEMES: readonly ExecutiveOkrStrategicTheme[] = Object.freeze([
  "Growth",
  "Efficiency",
  "Innovation",
  "Customer Success",
  "Risk Reduction",
  "Digital Transformation",
  "Operational Excellence",
  "Custom",
] as const);

export const EXECUTIVE_OKR_ALIGNMENT_LIFECYCLE_STATES: readonly ExecutiveOkrAlignmentLifecycleState[] = Object.freeze([
  "Draft",
  "Candidate",
  "Approved",
  "Active",
  "Deprecated",
  "Archived",
] as const);

export const EXECUTIVE_OKR_ALIGNMENTS: readonly ExecutiveOkrAlignment[] = Object.freeze([
  Object.freeze({
    alignmentId: "alignment-profitable-growth-to-financial-health",
    alignmentName: "Profitable Growth to Financial Health Alignment",
    alignmentDescription: "Metadata relationship between profitable growth and its financial health key result.",
    sourceObjectiveId: "objective-profitable-growth",
    targetObjectiveId: "objective-operational-excellence",
    keyResultId: "kr-financial-health-visibility",
    linkedKpiIds: Object.freeze(["executive-financial-health"] as const),
    strategicTheme: "Growth",
    initiative: "capital-discipline-initiative",
    alignmentCategory: "Financial",
    alignmentStrength: "Primary",
    dependencyType: "Supports",
    businessDomain: "Finance",
    executiveOwner: "Finance Owner",
    governanceReference: "financial-health-governance",
    lifecycleState: "Draft",
    metadata: Object.freeze({ metadataId: "profitable-growth-alignment-metadata", metadataOnly: true, immutable: true }),
    metadataOnly: true,
    immutable: true,
  }),
  Object.freeze({
    alignmentId: "alignment-operational-excellence-to-readiness",
    alignmentName: "Operational Excellence to Readiness Alignment",
    alignmentDescription: "Metadata relationship between operational excellence and operational readiness.",
    sourceObjectiveId: "objective-operational-excellence",
    targetObjectiveId: "objective-profitable-growth",
    keyResultId: "kr-operational-readiness-visibility",
    linkedKpiIds: Object.freeze(["executive-operational-readiness"] as const),
    strategicTheme: "Operational Excellence",
    initiative: "operating-model-readiness-initiative",
    alignmentCategory: "Operational",
    alignmentStrength: "Strong",
    dependencyType: "Influences",
    businessDomain: "Operations",
    executiveOwner: "Operations Owner",
    governanceReference: "operational-readiness-governance",
    lifecycleState: "Draft",
    metadata: Object.freeze({ metadataId: "operational-excellence-alignment-metadata", metadataOnly: true, immutable: true }),
    metadataOnly: true,
    immutable: true,
  }),
] as const);

export const EXECUTIVE_OKR_ALIGNMENT_PUBLIC_APIS: readonly string[] = Object.freeze([
  "ExecutiveOkrAlignmentPlatform",
  "getExecutiveOkrAlignmentPlatform",
  "getExecutiveOkrAlignmentManifest",
  "validateExecutiveOkrAlignments",
  "listExecutiveOkrAlignments",
  "listExecutiveAlignmentCategories",
  "listExecutiveAlignmentStrengthLevels",
  "listExecutiveDependencyTypes",
  "listExecutiveStrategicThemes",
  "listExecutiveOkrAlignmentLifecycleStates",
] as const);

export const EXECUTIVE_OKR_ALIGNMENT_REGISTRY: ExecutiveOkrAlignmentRegistry = Object.freeze({
  platformId: "BUS-15",
  platformName: "Executive OKR Alignment Platform",
  version: "1.0.0",
  foundationPlatformId: "BUS-13",
  definitionPlatformId: "BUS-14",
  kpiFreezeDependency: "BUS-12",
  alignments: EXECUTIVE_OKR_ALIGNMENTS,
  categories: EXECUTIVE_OKR_ALIGNMENT_CATEGORIES,
  strengthLevels: EXECUTIVE_OKR_ALIGNMENT_STRENGTH_LEVELS,
  dependencyTypes: EXECUTIVE_OKR_DEPENDENCY_TYPES,
  strategicThemes: EXECUTIVE_OKR_STRATEGIC_THEMES,
  lifecycleStates: EXECUTIVE_OKR_ALIGNMENT_LIFECYCLE_STATES,
  publicApis: EXECUTIVE_OKR_ALIGNMENT_PUBLIC_APIS,
  metadataOnly: true,
  immutable: true,
});

export function listExecutiveOkrAlignments(): readonly ExecutiveOkrAlignment[] {
  return EXECUTIVE_OKR_ALIGNMENTS;
}

export function listExecutiveAlignmentCategories(): readonly ExecutiveOkrAlignmentCategory[] {
  return EXECUTIVE_OKR_ALIGNMENT_CATEGORIES;
}

export function listExecutiveAlignmentStrengthLevels(): readonly ExecutiveOkrAlignmentStrength[] {
  return EXECUTIVE_OKR_ALIGNMENT_STRENGTH_LEVELS;
}

export function listExecutiveDependencyTypes(): readonly ExecutiveOkrDependencyType[] {
  return EXECUTIVE_OKR_DEPENDENCY_TYPES;
}

export function listExecutiveStrategicThemes(): readonly ExecutiveOkrStrategicTheme[] {
  return EXECUTIVE_OKR_STRATEGIC_THEMES;
}

export function listExecutiveOkrAlignmentLifecycleStates(): readonly ExecutiveOkrAlignmentLifecycleState[] {
  return EXECUTIVE_OKR_ALIGNMENT_LIFECYCLE_STATES;
}

import type {
  ExecutiveBusinessImpactCategory,
  ExecutiveBusinessImpactConfidenceLevel,
  ExecutiveBusinessImpactDimension,
  ExecutiveBusinessImpactHorizon,
  ExecutiveBusinessImpactLifecycleState,
  ExecutiveKpiBusinessImpact,
  ExecutiveKpiBusinessImpactRegistry,
} from "./executiveKpiBusinessImpactTypes.ts";

export const EXECUTIVE_BUSINESS_IMPACT_CATEGORIES: readonly ExecutiveBusinessImpactCategory[] = Object.freeze([
  "Revenue",
  "Cost",
  "Margin",
  "Cash Flow",
  "Customer",
  "Operational Efficiency",
  "Resource Capacity",
  "Risk Exposure",
  "Execution Speed",
  "Strategic Progress",
  "Quality",
  "Growth",
  "Custom",
] as const);

export const EXECUTIVE_BUSINESS_IMPACT_DIMENSIONS: readonly ExecutiveBusinessImpactDimension[] = Object.freeze([
  "Financial Impact",
  "Operational Impact",
  "Customer Impact",
  "Strategic Impact",
  "Risk Impact",
  "Resource Impact",
  "Execution Impact",
  "Market Impact",
  "Organizational Impact",
  "Custom Impact",
] as const);

export const EXECUTIVE_BUSINESS_IMPACT_HORIZONS: readonly ExecutiveBusinessImpactHorizon[] = Object.freeze([
  "Immediate",
  "Short Term",
  "Quarterly",
  "Annual",
  "Multi-Year",
  "Long Term",
] as const);

export const EXECUTIVE_BUSINESS_IMPACT_CONFIDENCE_LEVELS: readonly ExecutiveBusinessImpactConfidenceLevel[] =
  Object.freeze(["Very High", "High", "Medium", "Low", "Unknown"] as const);

export const EXECUTIVE_BUSINESS_IMPACT_LIFECYCLE_STATES: readonly ExecutiveBusinessImpactLifecycleState[] =
  Object.freeze(["Draft", "Candidate", "Approved", "Active", "Deprecated", "Archived"] as const);

export const EXECUTIVE_KPI_BUSINESS_IMPACTS: readonly ExecutiveKpiBusinessImpact[] = Object.freeze([
  Object.freeze({
    impactId: "financial-health-margin-impact",
    kpiId: "executive-financial-health",
    impactName: "Financial Health Margin Impact",
    impactDescription: "Metadata declaration for a possible margin-oriented business impact dimension.",
    impactCategory: "Margin",
    impactDimension: "Financial Impact",
    businessDomain: "Finance",
    affectedAudience: "Executive Team",
    impactHorizon: "Annual",
    confidenceLevel: "Unknown",
    strategicAlignmentReferenceId: "financial-health-growth-alignment",
    governanceReferenceId: "financial-health-governance",
    lifecycleState: "Draft",
    metadata: Object.freeze({ metadataId: "financial-impact-metadata", metadataOnly: true, immutable: true }),
    metadataOnly: true,
    immutable: true,
  }),
  Object.freeze({
    impactId: "operational-readiness-execution-impact",
    kpiId: "executive-operational-readiness",
    impactName: "Operational Readiness Execution Impact",
    impactDescription: "Metadata declaration for a possible execution-oriented business impact dimension.",
    impactCategory: "Execution Speed",
    impactDimension: "Operational Impact",
    businessDomain: "Operations",
    affectedAudience: "Department Head",
    impactHorizon: "Quarterly",
    confidenceLevel: "Unknown",
    strategicAlignmentReferenceId: "operational-readiness-excellence-alignment",
    governanceReferenceId: "operational-readiness-governance",
    lifecycleState: "Draft",
    metadata: Object.freeze({ metadataId: "operational-impact-metadata", metadataOnly: true, immutable: true }),
    metadataOnly: true,
    immutable: true,
  }),
] as const);

export const EXECUTIVE_KPI_BUSINESS_IMPACT_PUBLIC_APIS: readonly string[] = Object.freeze([
  "ExecutiveKpiBusinessImpactPlatform",
  "getExecutiveKpiBusinessImpactPlatform",
  "getExecutiveKpiBusinessImpactManifest",
  "validateExecutiveKpiBusinessImpacts",
  "listExecutiveKpiBusinessImpacts",
  "listExecutiveBusinessImpactCategories",
  "listExecutiveBusinessImpactDimensions",
  "listExecutiveBusinessImpactHorizons",
  "listExecutiveBusinessImpactConfidenceLevels",
  "listExecutiveBusinessImpactLifecycleStates",
] as const);

export const EXECUTIVE_KPI_BUSINESS_IMPACT_REGISTRY: ExecutiveKpiBusinessImpactRegistry = Object.freeze({
  platformId: "BUS-9",
  platformName: "Executive KPI Business Impact Metadata Platform",
  version: "1.0.0",
  foundationPlatformId: "BUS-1",
  definitionPlatformId: "BUS-2",
  sourceMappingPlatformId: "BUS-3",
  targetPlatformId: "BUS-4",
  governancePlatformId: "BUS-5",
  scorecardPlatformId: "BUS-6",
  insightPlatformId: "BUS-7",
  strategicAlignmentPlatformId: "BUS-8",
  impacts: EXECUTIVE_KPI_BUSINESS_IMPACTS,
  categories: EXECUTIVE_BUSINESS_IMPACT_CATEGORIES,
  dimensions: EXECUTIVE_BUSINESS_IMPACT_DIMENSIONS,
  horizons: EXECUTIVE_BUSINESS_IMPACT_HORIZONS,
  confidenceLevels: EXECUTIVE_BUSINESS_IMPACT_CONFIDENCE_LEVELS,
  lifecycleStates: EXECUTIVE_BUSINESS_IMPACT_LIFECYCLE_STATES,
  publicApis: EXECUTIVE_KPI_BUSINESS_IMPACT_PUBLIC_APIS,
  metadataOnly: true,
  immutable: true,
});

export function listExecutiveKpiBusinessImpacts(): readonly ExecutiveKpiBusinessImpact[] {
  return EXECUTIVE_KPI_BUSINESS_IMPACTS;
}

export function listExecutiveBusinessImpactCategories(): readonly ExecutiveBusinessImpactCategory[] {
  return EXECUTIVE_BUSINESS_IMPACT_CATEGORIES;
}

export function listExecutiveBusinessImpactDimensions(): readonly ExecutiveBusinessImpactDimension[] {
  return EXECUTIVE_BUSINESS_IMPACT_DIMENSIONS;
}

export function listExecutiveBusinessImpactHorizons(): readonly ExecutiveBusinessImpactHorizon[] {
  return EXECUTIVE_BUSINESS_IMPACT_HORIZONS;
}

export function listExecutiveBusinessImpactConfidenceLevels(): readonly ExecutiveBusinessImpactConfidenceLevel[] {
  return EXECUTIVE_BUSINESS_IMPACT_CONFIDENCE_LEVELS;
}

export function listExecutiveBusinessImpactLifecycleStates(): readonly ExecutiveBusinessImpactLifecycleState[] {
  return EXECUTIVE_BUSINESS_IMPACT_LIFECYCLE_STATES;
}

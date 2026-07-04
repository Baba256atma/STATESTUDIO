import type {
  ExecutiveKpiInsight,
  ExecutiveKpiInsightAudienceLevel,
  ExecutiveKpiInsightCategory,
  ExecutiveKpiInsightConfidenceLevel,
  ExecutiveKpiInsightLifecycleState,
  ExecutiveKpiInsightRegistry,
  ExecutiveKpiInsightSeverityLevel,
} from "./executiveKpiInsightTypes.ts";

export const EXECUTIVE_KPI_INSIGHT_CATEGORIES: readonly ExecutiveKpiInsightCategory[] = Object.freeze([
  "Performance Signal",
  "Risk Signal",
  "Opportunity Signal",
  "Execution Signal",
  "Strategic Alignment Signal",
  "Resource Signal",
  "Customer Signal",
  "Financial Signal",
  "Operational Signal",
  "Governance Signal",
  "Custom Signal",
] as const);

export const EXECUTIVE_KPI_INSIGHT_SEVERITY_LEVELS: readonly ExecutiveKpiInsightSeverityLevel[] = Object.freeze([
  "Critical",
  "High",
  "Medium",
  "Low",
  "Informational",
] as const);

export const EXECUTIVE_KPI_INSIGHT_CONFIDENCE_LEVELS: readonly ExecutiveKpiInsightConfidenceLevel[] = Object.freeze([
  "Very High",
  "High",
  "Medium",
  "Low",
  "Unknown",
] as const);

export const EXECUTIVE_KPI_INSIGHT_AUDIENCE_LEVELS: readonly ExecutiveKpiInsightAudienceLevel[] = Object.freeze([
  "CEO",
  "Executive Team",
  "Board",
  "Department Head",
  "Project Manager",
  "Analyst",
  "Advisor",
  "Custom",
] as const);

export const EXECUTIVE_KPI_INSIGHT_LIFECYCLE_STATES: readonly ExecutiveKpiInsightLifecycleState[] = Object.freeze([
  "Draft",
  "Candidate",
  "Approved",
  "Active",
  "Deprecated",
  "Archived",
] as const);

export const EXECUTIVE_KPI_INSIGHTS: readonly ExecutiveKpiInsight[] = Object.freeze([
  Object.freeze({
    insightId: "financial-health-performance-signal",
    insightName: "Financial Health Performance Signal",
    insightDescription: "Metadata declaration for a possible financial KPI performance signal.",
    insightCategory: "Financial Signal",
    relatedKpiIds: Object.freeze(["executive-financial-health"] as const),
    relatedScorecardIds: Object.freeze(["executive-finance-scorecard"] as const),
    intendedAudience: "Executive Team",
    severityLevel: "Medium",
    confidenceLevel: "Unknown",
    businessDomain: "Finance",
    executiveRelevance: "Indicates possible executive relevance metadata for financial health.",
    governanceReferenceId: "financial-health-governance",
    lifecycleState: "Draft",
    metadata: Object.freeze({ metadataId: "financial-insight-metadata", metadataOnly: true, immutable: true }),
    metadataOnly: true,
    immutable: true,
  }),
  Object.freeze({
    insightId: "operational-readiness-execution-signal",
    insightName: "Operational Readiness Execution Signal",
    insightDescription: "Metadata declaration for a possible operational readiness execution signal.",
    insightCategory: "Execution Signal",
    relatedKpiIds: Object.freeze(["executive-operational-readiness"] as const),
    relatedScorecardIds: Object.freeze(["executive-operations-scorecard"] as const),
    intendedAudience: "Department Head",
    severityLevel: "Medium",
    confidenceLevel: "Unknown",
    businessDomain: "Operations",
    executiveRelevance: "Indicates possible executive relevance metadata for operational readiness.",
    governanceReferenceId: "operational-readiness-governance",
    lifecycleState: "Draft",
    metadata: Object.freeze({ metadataId: "operational-insight-metadata", metadataOnly: true, immutable: true }),
    metadataOnly: true,
    immutable: true,
  }),
] as const);

export const EXECUTIVE_KPI_INSIGHT_PUBLIC_APIS: readonly string[] = Object.freeze([
  "ExecutiveKpiInsightPlatform",
  "getExecutiveKpiInsightPlatform",
  "getExecutiveKpiInsightManifest",
  "validateExecutiveKpiInsights",
  "listExecutiveKpiInsights",
  "listExecutiveKpiInsightCategories",
  "listExecutiveKpiInsightSeverityLevels",
  "listExecutiveKpiInsightConfidenceLevels",
  "listExecutiveKpiInsightAudienceLevels",
  "listExecutiveKpiInsightLifecycleStates",
] as const);

export const EXECUTIVE_KPI_INSIGHT_REGISTRY: ExecutiveKpiInsightRegistry = Object.freeze({
  platformId: "BUS-7",
  platformName: "Executive KPI Insight Metadata Platform",
  version: "1.0.0",
  foundationPlatformId: "BUS-1",
  definitionPlatformId: "BUS-2",
  sourceMappingPlatformId: "BUS-3",
  targetPlatformId: "BUS-4",
  governancePlatformId: "BUS-5",
  scorecardPlatformId: "BUS-6",
  insights: EXECUTIVE_KPI_INSIGHTS,
  categories: EXECUTIVE_KPI_INSIGHT_CATEGORIES,
  severityLevels: EXECUTIVE_KPI_INSIGHT_SEVERITY_LEVELS,
  confidenceLevels: EXECUTIVE_KPI_INSIGHT_CONFIDENCE_LEVELS,
  audienceLevels: EXECUTIVE_KPI_INSIGHT_AUDIENCE_LEVELS,
  lifecycleStates: EXECUTIVE_KPI_INSIGHT_LIFECYCLE_STATES,
  publicApis: EXECUTIVE_KPI_INSIGHT_PUBLIC_APIS,
  metadataOnly: true,
  immutable: true,
});

export function listExecutiveKpiInsights(): readonly ExecutiveKpiInsight[] {
  return EXECUTIVE_KPI_INSIGHTS;
}

export function listExecutiveKpiInsightCategories(): readonly ExecutiveKpiInsightCategory[] {
  return EXECUTIVE_KPI_INSIGHT_CATEGORIES;
}

export function listExecutiveKpiInsightSeverityLevels(): readonly ExecutiveKpiInsightSeverityLevel[] {
  return EXECUTIVE_KPI_INSIGHT_SEVERITY_LEVELS;
}

export function listExecutiveKpiInsightConfidenceLevels(): readonly ExecutiveKpiInsightConfidenceLevel[] {
  return EXECUTIVE_KPI_INSIGHT_CONFIDENCE_LEVELS;
}

export function listExecutiveKpiInsightAudienceLevels(): readonly ExecutiveKpiInsightAudienceLevel[] {
  return EXECUTIVE_KPI_INSIGHT_AUDIENCE_LEVELS;
}

export function listExecutiveKpiInsightLifecycleStates(): readonly ExecutiveKpiInsightLifecycleState[] {
  return EXECUTIVE_KPI_INSIGHT_LIFECYCLE_STATES;
}

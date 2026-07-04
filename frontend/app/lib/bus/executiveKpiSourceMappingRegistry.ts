import type {
  ExecutiveKpiCoverageLevel,
  ExecutiveKpiFreshnessExpectation,
  ExecutiveKpiSourceMapping,
  ExecutiveKpiSourceMappingLifecycleState,
  ExecutiveKpiSourceMappingRegistry,
  ExecutiveKpiSourceType,
} from "./executiveKpiSourceMappingTypes.ts";

export const EXECUTIVE_KPI_SOURCE_TYPES: readonly ExecutiveKpiSourceType[] = Object.freeze([
  "Manual Entry",
  "CSV Upload",
  "Spreadsheet",
  "Database",
  "API",
  "ERP",
  "CRM",
  "Finance System",
  "Project System",
  "Operational System",
  "External Benchmark",
] as const);

export const EXECUTIVE_KPI_COVERAGE_LEVELS: readonly ExecutiveKpiCoverageLevel[] = Object.freeze([
  "Complete",
  "Partial",
  "Missing",
  "Unknown",
] as const);

export const EXECUTIVE_KPI_FRESHNESS_EXPECTATIONS: readonly ExecutiveKpiFreshnessExpectation[] = Object.freeze([
  "Real Time",
  "Hourly",
  "Daily",
  "Weekly",
  "Monthly",
  "Quarterly",
  "Manual",
  "Unknown",
] as const);

export const EXECUTIVE_KPI_SOURCE_MAPPING_LIFECYCLE_STATES: readonly ExecutiveKpiSourceMappingLifecycleState[] = Object.freeze([
  "Draft",
  "Candidate",
  "Approved",
  "Active",
  "Deprecated",
  "Archived",
] as const);

export const EXECUTIVE_KPI_SOURCE_MAPPINGS: readonly ExecutiveKpiSourceMapping[] = Object.freeze([
  Object.freeze({
    mappingId: "financial-health-finance-system-source",
    kpiId: "executive-financial-health",
    sourceType: "Finance System",
    sourceName: "Finance System Metadata Source",
    sourceDescription: "Metadata declaration for a possible finance system source.",
    sourceOwner: Object.freeze({ ownerId: "finance-source-owner", ownerName: "Finance Source Owner", ownerRole: "Source Steward", ownershipScope: "Domain" }),
    sourceDomain: "Finance",
    requiredFields: Object.freeze([
      Object.freeze({ fieldId: "finance-period-field", fieldName: "Finance Period", description: "Metadata field declaration for period alignment.", metadataOnly: true }),
    ] as const),
    optionalFields: Object.freeze([
      Object.freeze({ fieldId: "finance-segment-field", fieldName: "Finance Segment", description: "Metadata field declaration for optional segmentation.", metadataOnly: true }),
    ] as const),
    freshnessExpectation: "Monthly",
    coverageLevel: "Partial",
    mappingConfidence: Object.freeze({ confidenceId: "financial-source-confidence", confidenceLevel: "Declared", metadataOnly: true }),
    lifecycleState: "Draft",
    governanceMetadata: Object.freeze({ governanceId: "financial-source-governance", stewardshipRequired: true, reviewRequired: true, metadataOnly: true }),
    metadataOnly: true,
    immutable: true,
  }),
  Object.freeze({
    mappingId: "operational-readiness-operational-system-source",
    kpiId: "executive-operational-readiness",
    sourceType: "Operational System",
    sourceName: "Operational System Metadata Source",
    sourceDescription: "Metadata declaration for a possible operational system source.",
    sourceOwner: Object.freeze({ ownerId: "operations-source-owner", ownerName: "Operations Source Owner", ownerRole: "Source Steward", ownershipScope: "Domain" }),
    sourceDomain: "Operations",
    requiredFields: Object.freeze([
      Object.freeze({ fieldId: "operations-unit-field", fieldName: "Operations Unit", description: "Metadata field declaration for operational unit alignment.", metadataOnly: true }),
    ] as const),
    optionalFields: Object.freeze([
      Object.freeze({ fieldId: "operations-region-field", fieldName: "Operations Region", description: "Metadata field declaration for optional regional context.", metadataOnly: true }),
    ] as const),
    freshnessExpectation: "Weekly",
    coverageLevel: "Partial",
    mappingConfidence: Object.freeze({ confidenceId: "operational-source-confidence", confidenceLevel: "Declared", metadataOnly: true }),
    lifecycleState: "Draft",
    governanceMetadata: Object.freeze({ governanceId: "operational-source-governance", stewardshipRequired: true, reviewRequired: true, metadataOnly: true }),
    metadataOnly: true,
    immutable: true,
  }),
] as const);

export const EXECUTIVE_KPI_SOURCE_MAPPING_PUBLIC_APIS: readonly string[] = Object.freeze([
  "ExecutiveKpiSourceMappingPlatform",
  "getExecutiveKpiSourceMappingPlatform",
  "getExecutiveKpiSourceMappingManifest",
  "validateExecutiveKpiSourceMappings",
  "listExecutiveKpiSourceMappings",
  "listExecutiveKpiSourceTypes",
  "listExecutiveKpiCoverageLevels",
  "listExecutiveKpiFreshnessExpectations",
  "listExecutiveKpiSourceMappingLifecycleStates",
] as const);

export const EXECUTIVE_KPI_SOURCE_MAPPING_REGISTRY: ExecutiveKpiSourceMappingRegistry = Object.freeze({
  platformId: "BUS-3",
  platformName: "Executive KPI Source Mapping Platform",
  version: "1.0.0",
  foundationPlatformId: "BUS-1",
  definitionPlatformId: "BUS-2",
  mappings: EXECUTIVE_KPI_SOURCE_MAPPINGS,
  sourceTypes: EXECUTIVE_KPI_SOURCE_TYPES,
  coverageLevels: EXECUTIVE_KPI_COVERAGE_LEVELS,
  freshnessExpectations: EXECUTIVE_KPI_FRESHNESS_EXPECTATIONS,
  lifecycleStates: EXECUTIVE_KPI_SOURCE_MAPPING_LIFECYCLE_STATES,
  publicApis: EXECUTIVE_KPI_SOURCE_MAPPING_PUBLIC_APIS,
  metadataOnly: true,
  immutable: true,
});

export function listExecutiveKpiSourceMappings(): readonly ExecutiveKpiSourceMapping[] {
  return EXECUTIVE_KPI_SOURCE_MAPPINGS;
}

export function listExecutiveKpiSourceTypes(): readonly ExecutiveKpiSourceType[] {
  return EXECUTIVE_KPI_SOURCE_TYPES;
}

export function listExecutiveKpiCoverageLevels(): readonly ExecutiveKpiCoverageLevel[] {
  return EXECUTIVE_KPI_COVERAGE_LEVELS;
}

export function listExecutiveKpiFreshnessExpectations(): readonly ExecutiveKpiFreshnessExpectation[] {
  return EXECUTIVE_KPI_FRESHNESS_EXPECTATIONS;
}

export function listExecutiveKpiSourceMappingLifecycleStates(): readonly ExecutiveKpiSourceMappingLifecycleState[] {
  return EXECUTIVE_KPI_SOURCE_MAPPING_LIFECYCLE_STATES;
}

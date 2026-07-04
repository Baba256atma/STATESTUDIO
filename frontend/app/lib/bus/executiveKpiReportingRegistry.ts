import type {
  ExecutiveKpiReport,
  ExecutiveKpiReportAudience,
  ExecutiveKpiReportSection,
  ExecutiveKpiReportType,
  ExecutiveKpiReportingCadence,
  ExecutiveKpiReportingFormat,
  ExecutiveKpiReportingLifecycleState,
  ExecutiveKpiReportingRegistry,
} from "./executiveKpiReportingTypes.ts";

export const EXECUTIVE_KPI_REPORT_TYPES: readonly ExecutiveKpiReportType[] = Object.freeze([
  "Executive Summary",
  "Board Report",
  "Management Report",
  "Department Report",
  "Financial KPI Report",
  "Operational KPI Report",
  "Risk KPI Report",
  "Project KPI Report",
  "Strategic Progress Report",
  "Custom Report",
] as const);

export const EXECUTIVE_KPI_REPORT_SECTIONS: readonly ExecutiveKpiReportSection[] = Object.freeze([
  "Overview",
  "KPI Summary",
  "Scorecard Summary",
  "Strategic Alignment",
  "Business Impact",
  "Risk Signals",
  "Opportunity Signals",
  "Governance Notes",
  "Appendix",
  "Custom Section",
] as const);

export const EXECUTIVE_KPI_REPORT_AUDIENCES: readonly ExecutiveKpiReportAudience[] = Object.freeze([
  "CEO",
  "Executive Team",
  "Board",
  "Department Head",
  "Project Manager",
  "Finance Team",
  "Operations Team",
  "Advisor",
  "Custom",
] as const);

export const EXECUTIVE_KPI_REPORTING_CADENCES: readonly ExecutiveKpiReportingCadence[] = Object.freeze([
  "Daily",
  "Weekly",
  "Monthly",
  "Quarterly",
  "Annual",
  "On Demand",
  "Event Based",
] as const);

export const EXECUTIVE_KPI_REPORTING_FORMATS: readonly ExecutiveKpiReportingFormat[] = Object.freeze([
  "Dashboard View",
  "PDF",
  "Slide Deck",
  "Email Summary",
  "Workspace Brief",
  "Data Export",
  "Narrative Brief",
  "Custom Format",
] as const);

export const EXECUTIVE_KPI_REPORTING_LIFECYCLE_STATES: readonly ExecutiveKpiReportingLifecycleState[] = Object.freeze([
  "Draft",
  "Candidate",
  "Approved",
  "Active",
  "Deprecated",
  "Archived",
] as const);

export const EXECUTIVE_KPI_REPORTS: readonly ExecutiveKpiReport[] = Object.freeze([
  Object.freeze({
    reportId: "executive-financial-health-summary-report",
    reportName: "Executive Financial Health Summary Report",
    reportDescription: "Metadata declaration for a possible executive financial health report structure.",
    reportType: "Financial KPI Report",
    reportSection: "KPI Summary",
    relatedKpiIds: Object.freeze(["executive-financial-health"] as const),
    relatedScorecardIds: Object.freeze(["executive-finance-scorecard"] as const),
    intendedAudience: "Executive Team",
    reportingCadence: "Quarterly",
    reportingFormat: "Narrative Brief",
    businessDomain: "Finance",
    governanceReferenceId: "financial-health-governance",
    lifecycleState: "Draft",
    metadata: Object.freeze({ metadataId: "financial-reporting-metadata", metadataOnly: true, immutable: true }),
    metadataOnly: true,
    immutable: true,
  }),
  Object.freeze({
    reportId: "operational-readiness-management-report",
    reportName: "Operational Readiness Management Report",
    reportDescription: "Metadata declaration for a possible operational readiness report structure.",
    reportType: "Operational KPI Report",
    reportSection: "Scorecard Summary",
    relatedKpiIds: Object.freeze(["executive-operational-readiness"] as const),
    relatedScorecardIds: Object.freeze(["executive-operations-scorecard"] as const),
    intendedAudience: "Department Head",
    reportingCadence: "Monthly",
    reportingFormat: "Workspace Brief",
    businessDomain: "Operations",
    governanceReferenceId: "operational-readiness-governance",
    lifecycleState: "Draft",
    metadata: Object.freeze({ metadataId: "operational-reporting-metadata", metadataOnly: true, immutable: true }),
    metadataOnly: true,
    immutable: true,
  }),
] as const);

export const EXECUTIVE_KPI_REPORTING_PUBLIC_APIS: readonly string[] = Object.freeze([
  "ExecutiveKpiReportingPlatform",
  "getExecutiveKpiReportingPlatform",
  "getExecutiveKpiReportingManifest",
  "validateExecutiveKpiReporting",
  "listExecutiveKpiReports",
  "listExecutiveKpiReportTypes",
  "listExecutiveKpiReportSections",
  "listExecutiveKpiReportAudiences",
  "listExecutiveKpiReportingCadences",
  "listExecutiveKpiReportingFormats",
  "listExecutiveKpiReportingLifecycleStates",
] as const);

export const EXECUTIVE_KPI_REPORTING_REGISTRY: ExecutiveKpiReportingRegistry = Object.freeze({
  platformId: "BUS-10",
  platformName: "Executive KPI Reporting Metadata Platform",
  version: "1.0.0",
  foundationPlatformId: "BUS-1",
  definitionPlatformId: "BUS-2",
  sourceMappingPlatformId: "BUS-3",
  targetPlatformId: "BUS-4",
  governancePlatformId: "BUS-5",
  scorecardPlatformId: "BUS-6",
  insightPlatformId: "BUS-7",
  strategicAlignmentPlatformId: "BUS-8",
  businessImpactPlatformId: "BUS-9",
  reports: EXECUTIVE_KPI_REPORTS,
  reportTypes: EXECUTIVE_KPI_REPORT_TYPES,
  reportSections: EXECUTIVE_KPI_REPORT_SECTIONS,
  audiences: EXECUTIVE_KPI_REPORT_AUDIENCES,
  cadences: EXECUTIVE_KPI_REPORTING_CADENCES,
  formats: EXECUTIVE_KPI_REPORTING_FORMATS,
  lifecycleStates: EXECUTIVE_KPI_REPORTING_LIFECYCLE_STATES,
  publicApis: EXECUTIVE_KPI_REPORTING_PUBLIC_APIS,
  metadataOnly: true,
  immutable: true,
});

export function listExecutiveKpiReports(): readonly ExecutiveKpiReport[] {
  return EXECUTIVE_KPI_REPORTS;
}

export function listExecutiveKpiReportTypes(): readonly ExecutiveKpiReportType[] {
  return EXECUTIVE_KPI_REPORT_TYPES;
}

export function listExecutiveKpiReportSections(): readonly ExecutiveKpiReportSection[] {
  return EXECUTIVE_KPI_REPORT_SECTIONS;
}

export function listExecutiveKpiReportAudiences(): readonly ExecutiveKpiReportAudience[] {
  return EXECUTIVE_KPI_REPORT_AUDIENCES;
}

export function listExecutiveKpiReportingCadences(): readonly ExecutiveKpiReportingCadence[] {
  return EXECUTIVE_KPI_REPORTING_CADENCES;
}

export function listExecutiveKpiReportingFormats(): readonly ExecutiveKpiReportingFormat[] {
  return EXECUTIVE_KPI_REPORTING_FORMATS;
}

export function listExecutiveKpiReportingLifecycleStates(): readonly ExecutiveKpiReportingLifecycleState[] {
  return EXECUTIVE_KPI_REPORTING_LIFECYCLE_STATES;
}

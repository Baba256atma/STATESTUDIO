export type ExecutiveKpiReportType =
  | "Executive Summary"
  | "Board Report"
  | "Management Report"
  | "Department Report"
  | "Financial KPI Report"
  | "Operational KPI Report"
  | "Risk KPI Report"
  | "Project KPI Report"
  | "Strategic Progress Report"
  | "Custom Report";

export type ExecutiveKpiReportSection =
  | "Overview"
  | "KPI Summary"
  | "Scorecard Summary"
  | "Strategic Alignment"
  | "Business Impact"
  | "Risk Signals"
  | "Opportunity Signals"
  | "Governance Notes"
  | "Appendix"
  | "Custom Section";

export type ExecutiveKpiReportAudience =
  | "CEO"
  | "Executive Team"
  | "Board"
  | "Department Head"
  | "Project Manager"
  | "Finance Team"
  | "Operations Team"
  | "Advisor"
  | "Custom";

export type ExecutiveKpiReportingCadence = "Daily" | "Weekly" | "Monthly" | "Quarterly" | "Annual" | "On Demand" | "Event Based";

export type ExecutiveKpiReportingFormat =
  | "Dashboard View"
  | "PDF"
  | "Slide Deck"
  | "Email Summary"
  | "Workspace Brief"
  | "Data Export"
  | "Narrative Brief"
  | "Custom Format";

export type ExecutiveKpiReportingLifecycleState = "Draft" | "Candidate" | "Approved" | "Active" | "Deprecated" | "Archived";

export type ExecutiveKpiReportingMetadata = Readonly<{
  readonly metadataId: string;
  readonly metadataOnly: boolean;
  readonly immutable: boolean;
}>;

export type ExecutiveKpiReport = Readonly<{
  readonly reportId: string;
  readonly reportName: string;
  readonly reportDescription: string;
  readonly reportType: ExecutiveKpiReportType;
  readonly reportSection: ExecutiveKpiReportSection;
  readonly relatedKpiIds: readonly string[];
  readonly relatedScorecardIds: readonly string[];
  readonly intendedAudience: ExecutiveKpiReportAudience;
  readonly reportingCadence: ExecutiveKpiReportingCadence;
  readonly reportingFormat: ExecutiveKpiReportingFormat;
  readonly businessDomain: string;
  readonly governanceReferenceId: string;
  readonly lifecycleState: ExecutiveKpiReportingLifecycleState;
  readonly metadata: ExecutiveKpiReportingMetadata;
  readonly metadataOnly: boolean;
  readonly immutable: boolean;
}>;

export type ExecutiveKpiReportingRegistry = Readonly<{
  readonly platformId: "BUS-10";
  readonly platformName: "Executive KPI Reporting Metadata Platform";
  readonly version: "1.0.0";
  readonly foundationPlatformId: "BUS-1";
  readonly definitionPlatformId: "BUS-2";
  readonly sourceMappingPlatformId: "BUS-3";
  readonly targetPlatformId: "BUS-4";
  readonly governancePlatformId: "BUS-5";
  readonly scorecardPlatformId: "BUS-6";
  readonly insightPlatformId: "BUS-7";
  readonly strategicAlignmentPlatformId: "BUS-8";
  readonly businessImpactPlatformId: "BUS-9";
  readonly reports: readonly ExecutiveKpiReport[];
  readonly reportTypes: readonly ExecutiveKpiReportType[];
  readonly reportSections: readonly ExecutiveKpiReportSection[];
  readonly audiences: readonly ExecutiveKpiReportAudience[];
  readonly cadences: readonly ExecutiveKpiReportingCadence[];
  readonly formats: readonly ExecutiveKpiReportingFormat[];
  readonly lifecycleStates: readonly ExecutiveKpiReportingLifecycleState[];
  readonly publicApis: readonly string[];
  readonly metadataOnly: boolean;
  readonly immutable: boolean;
}>;

export type ExecutiveKpiReportingManifest = Readonly<{
  readonly platformId: "BUS-10";
  readonly platformName: "Executive KPI Reporting Metadata Platform";
  readonly version: "1.0.0";
  readonly foundationPlatformId: "BUS-1";
  readonly definitionPlatformId: "BUS-2";
  readonly sourceMappingPlatformId: "BUS-3";
  readonly targetPlatformId: "BUS-4";
  readonly governancePlatformId: "BUS-5";
  readonly scorecardPlatformId: "BUS-6";
  readonly insightPlatformId: "BUS-7";
  readonly strategicAlignmentPlatformId: "BUS-8";
  readonly businessImpactPlatformId: "BUS-9";
  readonly foundationAvailable: boolean;
  readonly definitionsAvailable: boolean;
  readonly sourceMappingsAvailable: boolean;
  readonly targetsAvailable: boolean;
  readonly governanceAvailable: boolean;
  readonly scorecardsAvailable: boolean;
  readonly insightsAvailable: boolean;
  readonly strategicAlignmentsAvailable: boolean;
  readonly businessImpactsAvailable: boolean;
  readonly reportCount: number;
  readonly reportTypeCount: number;
  readonly reportSectionCount: number;
  readonly audienceCount: number;
  readonly cadenceCount: number;
  readonly formatCount: number;
  readonly lifecycleStateCount: number;
  readonly publicApis: readonly string[];
  readonly certificationStatus: "Reporting Metadata Platform Certified";
  readonly deterministicFingerprint: string;
}>;

export type ExecutiveKpiReportingValidation = Readonly<{
  readonly valid: boolean;
  readonly errors: readonly string[];
  readonly warnings: readonly string[];
}>;

export type ExecutiveKpiReportingPlatform = Readonly<{
  readonly registry: ExecutiveKpiReportingRegistry;
  readonly manifest: ExecutiveKpiReportingManifest;
  readonly validation: ExecutiveKpiReportingValidation;
}>;

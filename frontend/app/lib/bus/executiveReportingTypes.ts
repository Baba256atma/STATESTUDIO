type ExecutiveReportingMetadata = Readonly<{
  readonly contractVersion: "1.0.0";
  readonly tags: readonly string[];
  readonly labels: readonly string[];
  readonly metadataOnly: true;
  readonly immutable: true;
}>;

export type ExecutiveReportId = `executive-report-${string}`;

export type ExecutiveReportCategory =
  | "Executive Summary"
  | "Strategy"
  | "Performance"
  | "Finance"
  | "Revenue"
  | "Portfolio"
  | "Operations"
  | "Customer"
  | "People"
  | "Resources"
  | "Risk"
  | "Business Health"
  | "Growth"
  | "Innovation"
  | "Governance";

export type ExecutiveReportAudience =
  | "CEO"
  | "Executive Team"
  | "Board"
  | "Department Leader"
  | "Investor"
  | "Operations"
  | "Finance"
  | "Strategy"
  | "Custom";

export type ExecutiveReportPriority = "Critical" | "High" | "Normal" | "Low";

export type ExecutiveReportStatus = "Draft" | "Ready" | "Published" | "Archived";

export type ExecutiveReportFormat =
  | "Dashboard"
  | "PDF"
  | "Presentation"
  | "Spreadsheet"
  | "Web"
  | "API"
  | "Print";

export type ExecutiveReportSection = Readonly<{
  readonly id: `executive-report-section-${string}`;
  readonly name: string;
  readonly description: string;
  readonly category: ExecutiveReportCategory;
  readonly metadata: ExecutiveReportingMetadata;
  readonly metadataOnly: true;
  readonly immutable: true;
}>;

export type ExecutiveReportTemplate = Readonly<{
  readonly id: `executive-report-template-${string}`;
  readonly name: string;
  readonly description: string;
  readonly sections: readonly ExecutiveReportSection[];
  readonly audience: ExecutiveReportAudience;
  readonly format: ExecutiveReportFormat;
  readonly metadata: ExecutiveReportingMetadata;
  readonly metadataOnly: true;
  readonly immutable: true;
}>;

export type ExecutiveReportDefinition = Readonly<{
  readonly id: ExecutiveReportId;
  readonly name: string;
  readonly description: string;
  readonly template: ExecutiveReportTemplate;
  readonly priority: ExecutiveReportPriority;
  readonly status: ExecutiveReportStatus;
  readonly metadata: ExecutiveReportingMetadata;
  readonly metadataOnly: true;
  readonly immutable: true;
}>;

export type ExecutiveReportingProfile = Readonly<{
  readonly id: `executive-reporting-profile-${string}`;
  readonly name: string;
  readonly description: string;
  readonly reports: readonly ExecutiveReportDefinition[];
  readonly templates: readonly ExecutiveReportTemplate[];
  readonly metadata: ExecutiveReportingMetadata;
  readonly metadataOnly: true;
  readonly immutable: true;
}>;

export type ExecutiveReportingSummary = Readonly<{
  readonly profileId: ExecutiveReportingProfile["id"];
  readonly description: string;
  readonly reports: readonly ExecutiveReportId[];
  readonly metadata: ExecutiveReportingMetadata;
  readonly metadataOnly: true;
  readonly immutable: true;
}>;

export type ExecutiveReportingContract = Readonly<{
  readonly profile: ExecutiveReportingProfile;
  readonly summary: ExecutiveReportingSummary;
  readonly metadataOnly: true;
  readonly immutable: true;
}>;

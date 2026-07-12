import {
  ExecutiveReportingContractDescription,
  ExecutiveReportingContractId,
  ExecutiveReportingContractVersion,
  type ExecutiveReportAudience,
  type ExecutiveReportCategory,
  type ExecutiveReportDefinition,
  type ExecutiveReportFormat,
  type ExecutiveReportPriority,
  type ExecutiveReportSection,
  type ExecutiveReportStatus,
  type ExecutiveReportTemplate,
  type ExecutiveReportingProfile,
} from "./executiveReportingIndex.ts";

const registryMetadata = Object.freeze({
  contractId: ExecutiveReportingContractId,
  contractVersion: ExecutiveReportingContractVersion,
  contractDescription: ExecutiveReportingContractDescription,
  registryId: "BUS-33:2",
  registryVersion: "1.0.0",
  registryNamespace: "nexora.bus.executive-reporting.registry",
  description: "Canonical metadata-only registry layer for executive reporting intelligence.",
  tags: Object.freeze(["executive-reporting", "registry", "metadata-only"]),
  labels: Object.freeze(["bus-33", "foundation"]),
  metadataOnly: true,
  immutable: true,
} as const);

const createMetadata = (tag: string) =>
  Object.freeze({
    contractVersion: ExecutiveReportingContractVersion,
    tags: Object.freeze(["executive-reporting", tag]),
    labels: Object.freeze(["bus-33", "registry"]),
    metadataOnly: true,
    immutable: true,
  } as const);

export const ExecutiveReportingRegistryMetadata = registryMetadata;

export const ExecutiveReportCategoryRegistry = Object.freeze([
  "Executive Summary",
  "Strategy",
  "Performance",
  "Finance",
  "Revenue",
  "Portfolio",
  "Operations",
  "Customer",
  "People",
  "Resources",
  "Risk",
  "Business Health",
  "Growth",
  "Innovation",
  "Governance",
] as const satisfies readonly ExecutiveReportCategory[]);

export const ExecutiveReportAudienceRegistry = Object.freeze([
  "CEO",
  "Executive Team",
  "Board",
  "Department Leader",
  "Investor",
  "Operations",
  "Finance",
  "Strategy",
  "Custom",
] as const satisfies readonly ExecutiveReportAudience[]);

export const ExecutiveReportPriorityRegistry = Object.freeze([
  "Critical",
  "High",
  "Normal",
  "Low",
] as const satisfies readonly ExecutiveReportPriority[]);

export const ExecutiveReportStatusRegistry = Object.freeze([
  "Draft",
  "Ready",
  "Published",
  "Archived",
] as const satisfies readonly ExecutiveReportStatus[]);

export const ExecutiveReportFormatRegistry = Object.freeze([
  "Dashboard",
  "PDF",
  "Presentation",
  "Spreadsheet",
  "Web",
  "API",
  "Print",
] as const satisfies readonly ExecutiveReportFormat[]);

export const ExecutiveReportSectionRegistry = Object.freeze([
  Object.freeze({
    id: "executive-report-section-enterprise-summary",
    name: "Enterprise Summary",
    description: "Executive summary section covering enterprise-level highlights.",
    category: "Executive Summary" as const,
    metadata: createMetadata("section"),
    metadataOnly: true,
    immutable: true,
  }),
  Object.freeze({
    id: "executive-report-section-strategy-overview",
    name: "Strategy Overview",
    description: "Section describing strategic priorities and progress metadata.",
    category: "Strategy" as const,
    metadata: createMetadata("section"),
    metadataOnly: true,
    immutable: true,
  }),
  Object.freeze({
    id: "executive-report-section-financial-performance",
    name: "Financial Performance",
    description: "Section describing financial reporting metadata for executive review.",
    category: "Finance" as const,
    metadata: createMetadata("section"),
    metadataOnly: true,
    immutable: true,
  }),
  Object.freeze({
    id: "executive-report-section-revenue-outlook",
    name: "Revenue Outlook",
    description: "Section describing revenue reporting metadata and outlook framing.",
    category: "Revenue" as const,
    metadata: createMetadata("section"),
    metadataOnly: true,
    immutable: true,
  }),
  Object.freeze({
    id: "executive-report-section-operational-health",
    name: "Operational Health",
    description: "Section describing operational performance and service health metadata.",
    category: "Operations" as const,
    metadata: createMetadata("section"),
    metadataOnly: true,
    immutable: true,
  }),
  Object.freeze({
    id: "executive-report-section-risk-governance",
    name: "Risk and Governance",
    description: "Section describing governance posture and executive risk metadata.",
    category: "Governance" as const,
    metadata: createMetadata("section"),
    metadataOnly: true,
    immutable: true,
  }),
  Object.freeze({
    id: "executive-report-section-business-health",
    name: "Business Health Review",
    description: "Section describing overall business health intelligence metadata.",
    category: "Business Health" as const,
    metadata: createMetadata("section"),
    metadataOnly: true,
    immutable: true,
  }),
] as const satisfies readonly ExecutiveReportSection[]);

const sectionById = Object.freeze({
  enterpriseSummary: ExecutiveReportSectionRegistry[0],
  strategyOverview: ExecutiveReportSectionRegistry[1],
  financialPerformance: ExecutiveReportSectionRegistry[2],
  revenueOutlook: ExecutiveReportSectionRegistry[3],
  operationalHealth: ExecutiveReportSectionRegistry[4],
  riskGovernance: ExecutiveReportSectionRegistry[5],
  businessHealth: ExecutiveReportSectionRegistry[6],
} as const);

export const ExecutiveReportTemplateRegistry = Object.freeze([
  Object.freeze({
    id: "executive-report-template-ceo-weekly-brief",
    name: "CEO Weekly Brief",
    description: "Template for concise weekly executive reporting to the CEO.",
    sections: Object.freeze([
      sectionById.enterpriseSummary,
      sectionById.strategyOverview,
      sectionById.operationalHealth,
    ]),
    audience: "CEO" as const,
    format: "Dashboard" as const,
    metadata: createMetadata("template"),
    metadataOnly: true,
    immutable: true,
  }),
  Object.freeze({
    id: "executive-report-template-board-quarterly-review",
    name: "Board Quarterly Review",
    description: "Template for quarterly board-level reporting metadata.",
    sections: Object.freeze([
      sectionById.enterpriseSummary,
      sectionById.financialPerformance,
      sectionById.riskGovernance,
    ]),
    audience: "Board" as const,
    format: "Presentation" as const,
    metadata: createMetadata("template"),
    metadataOnly: true,
    immutable: true,
  }),
  Object.freeze({
    id: "executive-report-template-finance-monthly-pack",
    name: "Finance Monthly Pack",
    description: "Template for monthly finance executive reporting metadata.",
    sections: Object.freeze([
      sectionById.financialPerformance,
      sectionById.revenueOutlook,
      sectionById.businessHealth,
    ]),
    audience: "Finance" as const,
    format: "Spreadsheet" as const,
    metadata: createMetadata("template"),
    metadataOnly: true,
    immutable: true,
  }),
  Object.freeze({
    id: "executive-report-template-strategy-committee-review",
    name: "Strategy Committee Review",
    description: "Template for periodic strategy governance and execution review.",
    sections: Object.freeze([
      sectionById.strategyOverview,
      sectionById.businessHealth,
      sectionById.riskGovernance,
    ]),
    audience: "Strategy" as const,
    format: "PDF" as const,
    metadata: createMetadata("template"),
    metadataOnly: true,
    immutable: true,
  }),
] as const satisfies readonly ExecutiveReportTemplate[]);

const templateById = Object.freeze({
  ceoWeeklyBrief: ExecutiveReportTemplateRegistry[0],
  boardQuarterlyReview: ExecutiveReportTemplateRegistry[1],
  financeMonthlyPack: ExecutiveReportTemplateRegistry[2],
  strategyCommitteeReview: ExecutiveReportTemplateRegistry[3],
} as const);

export const ExecutiveReportDefinitionRegistry = Object.freeze([
  Object.freeze({
    id: "executive-report-ceo-enterprise-brief",
    name: "CEO Enterprise Brief",
    description: "Executive definition for the CEO enterprise briefing report.",
    template: templateById.ceoWeeklyBrief,
    priority: "Critical" as const,
    status: "Ready" as const,
    metadata: createMetadata("definition"),
    metadataOnly: true,
    immutable: true,
  }),
  Object.freeze({
    id: "executive-report-board-governance-review",
    name: "Board Governance Review",
    description: "Executive definition for board governance and performance review.",
    template: templateById.boardQuarterlyReview,
    priority: "High" as const,
    status: "Published" as const,
    metadata: createMetadata("definition"),
    metadataOnly: true,
    immutable: true,
  }),
  Object.freeze({
    id: "executive-report-finance-performance-pack",
    name: "Finance Performance Pack",
    description: "Executive definition for finance performance and revenue review.",
    template: templateById.financeMonthlyPack,
    priority: "High" as const,
    status: "Ready" as const,
    metadata: createMetadata("definition"),
    metadataOnly: true,
    immutable: true,
  }),
  Object.freeze({
    id: "executive-report-strategy-health-review",
    name: "Strategy Health Review",
    description: "Executive definition for strategy execution and business health review.",
    template: templateById.strategyCommitteeReview,
    priority: "Normal" as const,
    status: "Draft" as const,
    metadata: createMetadata("definition"),
    metadataOnly: true,
    immutable: true,
  }),
] as const satisfies readonly ExecutiveReportDefinition[]);

export const ExecutiveReportingProfileRegistry = Object.freeze([
  Object.freeze({
    id: "executive-reporting-profile-enterprise-core",
    name: "Enterprise Core Reporting",
    description: "Canonical executive reporting profile for core enterprise audiences.",
    reports: Object.freeze([
      ExecutiveReportDefinitionRegistry[0],
      ExecutiveReportDefinitionRegistry[1],
      ExecutiveReportDefinitionRegistry[2],
      ExecutiveReportDefinitionRegistry[3],
    ]),
    templates: ExecutiveReportTemplateRegistry,
    metadata: createMetadata("profile"),
    metadataOnly: true,
    immutable: true,
  }),
] as const satisfies readonly ExecutiveReportingProfile[]);

export const getExecutiveReportCategories = () => ExecutiveReportCategoryRegistry;

export const getExecutiveReportAudiences = () => ExecutiveReportAudienceRegistry;

export const getExecutiveReportPriorities = () => ExecutiveReportPriorityRegistry;

export const getExecutiveReportStatuses = () => ExecutiveReportStatusRegistry;

export const getExecutiveReportFormats = () => ExecutiveReportFormatRegistry;

export const getExecutiveReportSections = () => ExecutiveReportSectionRegistry;

export const getExecutiveReportTemplates = () => ExecutiveReportTemplateRegistry;

export const getExecutiveReportDefinitions = () => ExecutiveReportDefinitionRegistry;

export const getExecutiveReportingProfiles = () => ExecutiveReportingProfileRegistry;

export const getExecutiveReportTemplatesByAudience = (
  audience: ExecutiveReportAudience,
) =>
  Object.freeze(
    ExecutiveReportTemplateRegistry.filter((template) => template.audience === audience),
  ) as readonly ExecutiveReportTemplate[];

export const getExecutiveReportDefinitionsByCategory = (
  category: ExecutiveReportCategory,
) =>
  Object.freeze(
    ExecutiveReportDefinitionRegistry.filter((definition) =>
      definition.template.sections.some((section) => section.category === category),
    ),
  ) as readonly ExecutiveReportDefinition[];

export const ExecutiveReportingRegistryFoundation = Object.freeze({
  metadata: ExecutiveReportingRegistryMetadata,
  categories: ExecutiveReportCategoryRegistry,
  audiences: ExecutiveReportAudienceRegistry,
  priorities: ExecutiveReportPriorityRegistry,
  statuses: ExecutiveReportStatusRegistry,
  formats: ExecutiveReportFormatRegistry,
  sections: ExecutiveReportSectionRegistry,
  templates: ExecutiveReportTemplateRegistry,
  definitions: ExecutiveReportDefinitionRegistry,
  profiles: ExecutiveReportingProfileRegistry,
  getExecutiveReportCategories,
  getExecutiveReportAudiences,
  getExecutiveReportPriorities,
  getExecutiveReportStatuses,
  getExecutiveReportFormats,
  getExecutiveReportSections,
  getExecutiveReportTemplates,
  getExecutiveReportDefinitions,
  getExecutiveReportingProfiles,
  getExecutiveReportTemplatesByAudience,
  getExecutiveReportDefinitionsByCategory,
  metadataOnly: true,
  immutable: true,
} as const);

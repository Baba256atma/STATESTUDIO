export type ExecutiveRevenuePlatformId = "BUS-29";

export type ExecutiveRevenuePlatformVersion = "1.0.0";

export type ExecutiveRevenuePlatformStage = "Foundation";

export type RevenueSourceCategory =
  | "Product"
  | "Service"
  | "Subscription"
  | "License"
  | "Consulting"
  | "Marketplace"
  | "Advertising"
  | "Partnership"
  | "Other";

export type RevenueStatus = "Draft" | "Active" | "Archived" | "Deprecated";

export type RevenueForecastType = "Monthly" | "Quarterly" | "Annual" | "Rolling" | "Scenario";

export type RevenueRiskSeverity = "Low" | "Medium" | "High" | "Critical";

export type RevenueOpportunityPriority = "Low" | "Medium" | "High" | "Strategic";

export type RevenueMetricType =
  | "TotalRevenue"
  | "RecurringRevenue"
  | "MonthlyRevenue"
  | "AnnualRevenue"
  | "AverageRevenuePerCustomer"
  | "RevenueGrowth"
  | "GrossRevenue"
  | "NetRevenue"
  | "ExpansionRevenue"
  | "ChurnRevenue";

export type RevenueStreamType = "Recurring" | "NonRecurring" | "Hybrid";

export type RevenueOpportunityCategory =
  | "Expansion"
  | "Pricing"
  | "Retention"
  | "Acquisition"
  | "Partnership"
  | "MarketEntry"
  | "Optimization"
  | "Other";

export type RevenueImpactLevel = "Low" | "Medium" | "High" | "Strategic";

export type RevenueConfidenceLevel = "Low" | "Medium" | "High";

export type RevenueRiskImpactCategory =
  | "RevenueLoss"
  | "MarginPressure"
  | "CustomerChurn"
  | "MarketContraction"
  | "OperationalConstraint"
  | "ComplianceExposure"
  | "Other";

export type RevenueSummaryStatus = "OnTrack" | "AtRisk" | "OffTrack" | "Watch";

export type RevenueDriverType =
  | "Pricing"
  | "CustomerAcquisition"
  | "Retention"
  | "Upsell"
  | "CrossSell"
  | "ProductMix"
  | "MarketExpansion"
  | "SalesCapacity"
  | "CustomerSatisfaction";

export type ExecutiveRevenuePlatform = Readonly<{
  readonly platformId: ExecutiveRevenuePlatformId;
  readonly platformName: "Executive Revenue Intelligence Platform";
  readonly platformCode: "EXEC_REVENUE";
  readonly platformVersion: ExecutiveRevenuePlatformVersion;
  readonly platformStage: ExecutiveRevenuePlatformStage;
  readonly metadataOnly: true;
  readonly immutable: true;
}>;

export type RevenueSource = Readonly<{
  readonly id: `revenue-source-${string}`;
  readonly code: `REV-SRC-${string}`;
  readonly name: string;
  readonly description: string;
  readonly category: RevenueSourceCategory;
  readonly owner: string;
  readonly status: RevenueStatus;
  readonly tags: readonly string[];
  readonly metadataOnly: true;
  readonly immutable: true;
}>;

export type RevenueStream = Readonly<{
  readonly streamId: `revenue-stream-${string}`;
  readonly sourceId: RevenueSource["id"];
  readonly streamType: RevenueStreamType;
  readonly businessUnit: string;
  readonly product: string;
  readonly customerSegment: string;
  readonly market: string;
  readonly currency: string;
  readonly status: RevenueStatus;
  readonly metadataOnly: true;
  readonly immutable: true;
}>;

export type RevenueMetric = Readonly<{
  readonly metricId: `revenue-metric-${string}`;
  readonly metricType: RevenueMetricType;
  readonly name: string;
  readonly description: string;
  readonly owner: string;
  readonly status: RevenueStatus;
  readonly tags: readonly string[];
  readonly metadataOnly: true;
  readonly immutable: true;
}>;

export type RevenueDriver = Readonly<{
  readonly driverId: `revenue-driver-${string}`;
  readonly driverType: RevenueDriverType;
  readonly name: string;
  readonly description: string;
  readonly owner: string;
  readonly status: RevenueStatus;
  readonly tags: readonly string[];
  readonly metadataOnly: true;
  readonly immutable: true;
}>;

export type RevenueOpportunity = Readonly<{
  readonly opportunityId: `revenue-opportunity-${string}`;
  readonly title: string;
  readonly category: RevenueOpportunityCategory;
  readonly expectedImpact: RevenueImpactLevel;
  readonly confidence: RevenueConfidenceLevel;
  readonly priority: RevenueOpportunityPriority;
  readonly owner: string;
  readonly status: RevenueStatus;
  readonly metadataOnly: true;
  readonly immutable: true;
}>;

export type RevenueRisk = Readonly<{
  readonly riskId: `revenue-risk-${string}`;
  readonly title: string;
  readonly severity: RevenueRiskSeverity;
  readonly likelihood: RevenueConfidenceLevel;
  readonly impactCategory: RevenueRiskImpactCategory;
  readonly owner: string;
  readonly mitigationReference: string;
  readonly metadataOnly: true;
  readonly immutable: true;
}>;

export type RevenueForecast = Readonly<{
  readonly forecastId: `revenue-forecast-${string}`;
  readonly forecastType: RevenueForecastType;
  readonly period: string;
  readonly baseline: number;
  readonly projectedRevenue: number;
  readonly confidence: RevenueConfidenceLevel;
  readonly assumptions: readonly string[];
  readonly status: RevenueStatus;
  readonly metadataOnly: true;
  readonly immutable: true;
}>;

export type RevenueTarget = Readonly<{
  readonly targetId: `revenue-target-${string}`;
  readonly period: string;
  readonly targetRevenue: number;
  readonly actualRevenue: number;
  readonly variance: number;
  readonly status: RevenueStatus;
  readonly metadataOnly: true;
  readonly immutable: true;
}>;

export type RevenueSummary = Readonly<{
  readonly summaryId: `revenue-summary-${string}`;
  readonly reportingPeriod: string;
  readonly totalRevenue: number;
  readonly growthRate: number;
  readonly targetAchievement: number;
  readonly forecastAccuracy: number;
  readonly overallStatus: RevenueSummaryStatus;
  readonly metadataOnly: true;
  readonly immutable: true;
}>;

export type ExecutiveRevenueContractRegistry = Readonly<{
  readonly platform: ExecutiveRevenuePlatform;
  readonly contractVersion: "1.0.0";
  readonly namespace: "nexora.bus.executive-revenue";
  readonly contractTypes: readonly string[];
  readonly enumerations: Readonly<{
    readonly revenueSourceCategories: readonly RevenueSourceCategory[];
    readonly revenueStatuses: readonly RevenueStatus[];
    readonly revenueForecastTypes: readonly RevenueForecastType[];
    readonly revenueRiskSeverities: readonly RevenueRiskSeverity[];
    readonly revenueOpportunityPriorities: readonly RevenueOpportunityPriority[];
    readonly revenueMetricTypes: readonly RevenueMetricType[];
    readonly metadataOnly: true;
    readonly immutable: true;
  }>;
  readonly publicApis: readonly string[];
  readonly metadataOnly: true;
  readonly immutable: true;
}>;

export const ExecutiveRevenuePlatformName = "Executive Revenue Intelligence Platform" as const;

export const ExecutiveRevenuePlatformDescription =
  "Canonical metadata-only contract foundation for executive revenue intelligence." as const;

export const ExecutiveRevenueContractVersion = "1.0.0" as const;

export const ExecutiveRevenueContractNamespace = "nexora.bus.executive-revenue" as const;

export const RevenueSourceCategories: readonly RevenueSourceCategory[] = Object.freeze([
  "Product",
  "Service",
  "Subscription",
  "License",
  "Consulting",
  "Marketplace",
  "Advertising",
  "Partnership",
  "Other",
] as const);

export const RevenueStatuses: readonly RevenueStatus[] = Object.freeze([
  "Draft",
  "Active",
  "Archived",
  "Deprecated",
] as const);

export const RevenueForecastTypes: readonly RevenueForecastType[] = Object.freeze([
  "Monthly",
  "Quarterly",
  "Annual",
  "Rolling",
  "Scenario",
] as const);

export const RevenueRiskSeverities: readonly RevenueRiskSeverity[] = Object.freeze([
  "Low",
  "Medium",
  "High",
  "Critical",
] as const);

export const RevenueOpportunityPriorities: readonly RevenueOpportunityPriority[] = Object.freeze([
  "Low",
  "Medium",
  "High",
  "Strategic",
] as const);

export const RevenueMetricTypes: readonly RevenueMetricType[] = Object.freeze([
  "TotalRevenue",
  "RecurringRevenue",
  "MonthlyRevenue",
  "AnnualRevenue",
  "AverageRevenuePerCustomer",
  "RevenueGrowth",
  "GrossRevenue",
  "NetRevenue",
  "ExpansionRevenue",
  "ChurnRevenue",
] as const);

export const ExecutiveRevenueContracts: ExecutiveRevenuePlatform = Object.freeze({
  platformId: "BUS-29",
  platformName: ExecutiveRevenuePlatformName,
  platformCode: "EXEC_REVENUE",
  platformVersion: "1.0.0",
  platformStage: "Foundation",
  metadataOnly: true,
  immutable: true,
});

export const ExecutiveRevenueContractTypes = Object.freeze({
  ExecutiveRevenuePlatform: "ExecutiveRevenuePlatform",
  RevenueSource: "RevenueSource",
  RevenueStream: "RevenueStream",
  RevenueMetric: "RevenueMetric",
  RevenueDriver: "RevenueDriver",
  RevenueOpportunity: "RevenueOpportunity",
  RevenueRisk: "RevenueRisk",
  RevenueForecast: "RevenueForecast",
  RevenueTarget: "RevenueTarget",
  RevenueSummary: "RevenueSummary",
  metadataOnly: true,
  immutable: true,
});

export const ExecutiveRevenueContractRegistry: ExecutiveRevenueContractRegistry = Object.freeze({
  platform: ExecutiveRevenueContracts,
  contractVersion: "1.0.0",
  namespace: ExecutiveRevenueContractNamespace,
  contractTypes: Object.freeze([
    "ExecutiveRevenuePlatform",
    "RevenueSource",
    "RevenueStream",
    "RevenueMetric",
    "RevenueDriver",
    "RevenueOpportunity",
    "RevenueRisk",
    "RevenueForecast",
    "RevenueTarget",
    "RevenueSummary",
  ] as const),
  enumerations: Object.freeze({
    revenueSourceCategories: RevenueSourceCategories,
    revenueStatuses: RevenueStatuses,
    revenueForecastTypes: RevenueForecastTypes,
    revenueRiskSeverities: RevenueRiskSeverities,
    revenueOpportunityPriorities: RevenueOpportunityPriorities,
    revenueMetricTypes: RevenueMetricTypes,
    metadataOnly: true,
    immutable: true,
  }),
  publicApis: Object.freeze([
    "ExecutiveRevenueContracts",
    "ExecutiveRevenueContractRegistry",
    "ExecutiveRevenueContractTypes",
  ] as const),
  metadataOnly: true,
  immutable: true,
});

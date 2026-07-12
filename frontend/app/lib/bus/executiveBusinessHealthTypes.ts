type ExecutiveBusinessHealthMetadata = Readonly<{
  readonly contractVersion: "1.0.0";
  readonly tags: readonly string[];
  readonly labels: readonly string[];
  readonly metadataOnly: true;
  readonly immutable: true;
}>;

export type ExecutiveBusinessHealthDomainId =
  | "Executive"
  | "Strategy"
  | "Finance"
  | "Revenue"
  | "Portfolio"
  | "Operations"
  | "Customer"
  | "People"
  | "Resources"
  | "Risk"
  | "Growth"
  | "Innovation"
  | "Governance";

export type ExecutiveBusinessHealthStatus =
  | "Excellent"
  | "Healthy"
  | "Stable"
  | "Warning"
  | "Critical";

export type ExecutiveBusinessHealthTrend =
  | "Improving"
  | "Stable"
  | "Declining"
  | "Unknown";

export type ExecutiveBusinessHealthSeverity =
  | "None"
  | "Low"
  | "Moderate"
  | "High"
  | "Severe";

export type ExecutiveBusinessHealthScoreRange = Readonly<{
  readonly minimum: number;
  readonly maximum: number;
}>;

export type ExecutiveBusinessHealthIndicator = Readonly<{
  readonly id: `executive-business-health-indicator-${string}`;
  readonly name: string;
  readonly description: string;
  readonly domain: ExecutiveBusinessHealthDomainId;
  readonly weight: number;
  readonly scoreRange: ExecutiveBusinessHealthScoreRange;
  readonly severity: ExecutiveBusinessHealthSeverity;
  readonly trend: ExecutiveBusinessHealthTrend;
  readonly metadata: ExecutiveBusinessHealthMetadata;
  readonly metadataOnly: true;
  readonly immutable: true;
}>;

export type ExecutiveBusinessHealthCapability = Readonly<{
  readonly id: `executive-business-health-capability-${string}`;
  readonly name: string;
  readonly description: string;
  readonly indicators: readonly ExecutiveBusinessHealthIndicator[];
  readonly metadata: ExecutiveBusinessHealthMetadata;
  readonly metadataOnly: true;
  readonly immutable: true;
}>;

export type ExecutiveBusinessHealthDimension = Readonly<{
  readonly id: `executive-business-health-dimension-${string}`;
  readonly name: string;
  readonly description: string;
  readonly capabilities: readonly ExecutiveBusinessHealthCapability[];
  readonly metadata: ExecutiveBusinessHealthMetadata;
  readonly metadataOnly: true;
  readonly immutable: true;
}>;

export type ExecutiveBusinessHealthProfile = Readonly<{
  readonly id: `executive-business-health-profile-${string}`;
  readonly name: string;
  readonly description: string;
  readonly dimensions: readonly ExecutiveBusinessHealthDimension[];
  readonly metadata: ExecutiveBusinessHealthMetadata;
  readonly metadataOnly: true;
  readonly immutable: true;
}>;

export type ExecutiveBusinessHealthSummary = Readonly<{
  readonly profileId: ExecutiveBusinessHealthProfile["id"];
  readonly description: string;
  readonly domains: readonly ExecutiveBusinessHealthDomainId[];
  readonly metadata: ExecutiveBusinessHealthMetadata;
  readonly metadataOnly: true;
  readonly immutable: true;
}>;

export type ExecutiveBusinessHealthContract = Readonly<{
  readonly profile: ExecutiveBusinessHealthProfile;
  readonly summary: ExecutiveBusinessHealthSummary;
  readonly metadataOnly: true;
  readonly immutable: true;
}>;

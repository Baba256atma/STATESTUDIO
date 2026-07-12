type ExecutiveBusinessIntelligenceMetadata = Readonly<{
  readonly contractVersion: "1.0.0";
  readonly tags: readonly string[];
  readonly labels: readonly string[];
  readonly metadataOnly: true;
  readonly immutable: true;
}>;

export type ExecutiveBusinessIntelligenceDomain =
  | "Strategy"
  | "KPI"
  | "Risk"
  | "Scenario"
  | "Decision"
  | "Portfolio"
  | "Finance"
  | "Revenue"
  | "Resource"
  | "Business Health"
  | "Reporting";

export type ExecutiveBusinessIntelligenceCapability = Readonly<{
  readonly id: `executive-business-intelligence-capability-${string}`;
  readonly name: string;
  readonly description: string;
  readonly domain: ExecutiveBusinessIntelligenceDomain;
  readonly metadata: ExecutiveBusinessIntelligenceMetadata;
  readonly metadataOnly: true;
  readonly immutable: true;
}>;

export type ExecutiveBusinessIntelligencePlatformReference = Readonly<{
  readonly id: `executive-business-platform-${string}`;
  readonly name: string;
  readonly description: string;
  readonly namespace: string;
  readonly version: string;
  readonly metadata: ExecutiveBusinessIntelligenceMetadata;
  readonly metadataOnly: true;
  readonly immutable: true;
}>;

export type ExecutiveBusinessIntelligenceDependency = Readonly<{
  readonly id: `executive-business-intelligence-dependency-${string}`;
  readonly source: string;
  readonly target: string;
  readonly relationship: string;
  readonly metadata: ExecutiveBusinessIntelligenceMetadata;
  readonly metadataOnly: true;
  readonly immutable: true;
}>;

export type ExecutiveBusinessIntelligenceNamespace = Readonly<{
  readonly id: `executive-business-intelligence-namespace-${string}`;
  readonly name: string;
  readonly description: string;
  readonly platforms: readonly ExecutiveBusinessIntelligencePlatformReference[];
  readonly metadata: ExecutiveBusinessIntelligenceMetadata;
  readonly metadataOnly: true;
  readonly immutable: true;
}>;

export type ExecutiveBusinessIntelligenceProfile = Readonly<{
  readonly id: `executive-business-intelligence-profile-${string}`;
  readonly name: string;
  readonly description: string;
  readonly capabilities: readonly ExecutiveBusinessIntelligenceCapability[];
  readonly platforms: readonly ExecutiveBusinessIntelligencePlatformReference[];
  readonly namespaces: readonly ExecutiveBusinessIntelligenceNamespace[];
  readonly metadata: ExecutiveBusinessIntelligenceMetadata;
  readonly metadataOnly: true;
  readonly immutable: true;
}>;

export type ExecutiveBusinessIntelligenceSummary = Readonly<{
  readonly profileId: ExecutiveBusinessIntelligenceProfile["id"];
  readonly description: string;
  readonly supportedDomains: readonly ExecutiveBusinessIntelligenceDomain[];
  readonly supportedPlatforms: readonly ExecutiveBusinessIntelligencePlatformReference["id"][];
  readonly metadata: ExecutiveBusinessIntelligenceMetadata;
  readonly metadataOnly: true;
  readonly immutable: true;
}>;

export type ExecutiveBusinessIntelligenceContract = Readonly<{
  readonly profile: ExecutiveBusinessIntelligenceProfile;
  readonly summary: ExecutiveBusinessIntelligenceSummary;
  readonly metadataOnly: true;
  readonly immutable: true;
}>;

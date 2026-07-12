export type ExecutiveOrganizationPlatformStatus = "Published" | "Certified" | "Released";

export type ExecutiveOrganizationPlatform = Readonly<{
  readonly platformId: "BUS-30";
  readonly platformName: "Executive Organization Intelligence Platform";
  readonly platformNamespace: "nexora.bus.executive-organization";
  readonly platformVersion: "1.0.0";
  readonly platformStatus: ExecutiveOrganizationPlatformStatus;
  readonly platformDescription: string;
  readonly platformMetadata: Readonly<{
    readonly createdBy: "BUS-30:6";
    readonly platformLayer: "Platform";
    readonly metadataOnly: true;
    readonly immutable: true;
  }>;
  readonly metadataOnly: true;
  readonly immutable: true;
}>;

export type ExecutiveOrganizationPlatformDependency = Readonly<{
  readonly dependencyId:
    | "BUS-30:1"
    | "BUS-30:2"
    | "BUS-30:3"
    | "BUS-30:4"
    | "BUS-30:5";
  readonly dependencyName: string;
  readonly dependencyVersion: "1.0.0";
  readonly dependencyType:
    | "Contracts"
    | "Registry"
    | "Model"
    | "Validation"
    | "Manifest";
  readonly dependencyStatus: "Available";
  readonly metadata: Readonly<{
    readonly createdBy: "BUS-30:6";
    readonly metadataOnly: true;
    readonly immutable: true;
  }>;
  readonly metadataOnly: true;
  readonly immutable: true;
}>;

export type ExecutiveOrganizationPlatformCompatibility = Readonly<{
  readonly compatibilityVersion: "1.0.0";
  readonly supportedPlatformVersion: "1.0.0";
  readonly compatibilityStatus: "Compatible";
  readonly metadata: Readonly<{
    readonly createdBy: "BUS-30:6";
    readonly metadataOnly: true;
    readonly immutable: true;
  }>;
  readonly metadataOnly: true;
  readonly immutable: true;
}>;

export type ExecutiveOrganizationPlatformConsumer = Readonly<{
  readonly consumerId: `executive-organization-platform-consumer-${string}`;
  readonly consumerName: string;
  readonly consumerCategory:
    | "BUS"
    | "OPS"
    | "APP"
    | "LAY"
    | "CORE"
    | "ExecutiveAdvisor"
    | "ExecutiveDashboard"
    | "ExecutiveScenarioEngine";
  readonly metadata: Readonly<{
    readonly createdBy: "BUS-30:6";
    readonly metadataOnly: true;
    readonly immutable: true;
  }>;
  readonly metadataOnly: true;
  readonly immutable: true;
}>;

export type ExecutiveOrganizationPlatformExtensionPolicy = Readonly<{
  readonly extensionPolicyId: "executive-organization-platform-extension-policy";
  readonly policyVersion: "1.0.0";
  readonly supportedExtensions: readonly string[];
  readonly compatibilityRequirements: readonly string[];
  readonly metadata: Readonly<{
    readonly createdBy: "BUS-30:6";
    readonly metadataOnly: true;
    readonly immutable: true;
  }>;
  readonly metadataOnly: true;
  readonly immutable: true;
}>;

export type ExecutiveOrganizationPlatformSummary = Readonly<{
  readonly componentCount: number;
  readonly dependencyCount: number;
  readonly consumerCount: number;
  readonly platformStatus: ExecutiveOrganizationPlatformStatus;
  readonly metadata: Readonly<{
    readonly createdBy: "BUS-30:6";
    readonly metadataOnly: true;
    readonly immutable: true;
  }>;
  readonly metadataOnly: true;
  readonly immutable: true;
}>;

export type ExecutiveOrganizationPlatformMetadata = Readonly<{
  readonly platformNamespace: "nexora.bus.executive-organization.platform";
  readonly platformVersion: "1.0.0";
  readonly platformStatus: ExecutiveOrganizationPlatformStatus;
  readonly platformDescription: string;
  readonly platformDependencies: readonly string[];
  readonly platformConsumers: readonly string[];
  readonly platformCompatibility: readonly string[];
  readonly metadataOnly: true;
  readonly immutable: true;
}>;

export type ExecutiveOrganizationPlatformBundle = Readonly<{
  readonly identity: ExecutiveOrganizationPlatform;
  readonly contracts: Readonly<Record<string, unknown>>;
  readonly registry: Readonly<Record<string, unknown>>;
  readonly model: Readonly<Record<string, unknown>>;
  readonly validation: Readonly<Record<string, unknown>>;
  readonly manifest: Readonly<Record<string, unknown>>;
  readonly dependencies: readonly ExecutiveOrganizationPlatformDependency[];
  readonly compatibility: ExecutiveOrganizationPlatformCompatibility;
  readonly extensionPolicy: ExecutiveOrganizationPlatformExtensionPolicy;
  readonly consumers: readonly ExecutiveOrganizationPlatformConsumer[];
  readonly summary: ExecutiveOrganizationPlatformSummary;
  readonly metadata: ExecutiveOrganizationPlatformMetadata;
  readonly publicApis: readonly string[];
  readonly metadataOnly: true;
  readonly immutable: true;
}>;

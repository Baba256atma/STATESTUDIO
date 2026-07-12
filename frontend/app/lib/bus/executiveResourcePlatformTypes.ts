export type ExecutiveResourcePlatformStatus = "Published" | "Certified" | "Released";

export type ExecutiveResourcePlatform = Readonly<{
  readonly platformId: "BUS-31";
  readonly platformName: "Executive Resource Intelligence Platform";
  readonly platformNamespace: "nexora.bus.executive-resource";
  readonly platformVersion: "1.0.0";
  readonly platformStatus: ExecutiveResourcePlatformStatus;
  readonly platformDescription: string;
  readonly platformMetadata: Readonly<{
    readonly createdBy: "BUS-31:6";
    readonly platformLayer: "Platform";
    readonly metadataOnly: true;
    readonly immutable: true;
  }>;
  readonly metadataOnly: true;
  readonly immutable: true;
}>;

export type ExecutiveResourcePlatformDependency = Readonly<{
  readonly dependencyId:
    | "BUS-31:1"
    | "BUS-31:2"
    | "BUS-31:3"
    | "BUS-31:4"
    | "BUS-31:5";
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
    readonly createdBy: "BUS-31:6";
    readonly metadataOnly: true;
    readonly immutable: true;
  }>;
  readonly metadataOnly: true;
  readonly immutable: true;
}>;

export type ExecutiveResourcePlatformCompatibility = Readonly<{
  readonly compatibilityVersion: "1.0.0";
  readonly supportedPlatformVersion: "1.0.0";
  readonly compatibilityStatus: "Compatible";
  readonly metadata: Readonly<{
    readonly createdBy: "BUS-31:6";
    readonly metadataOnly: true;
    readonly immutable: true;
  }>;
  readonly metadataOnly: true;
  readonly immutable: true;
}>;

export type ExecutiveResourcePlatformConsumer = Readonly<{
  readonly consumerId: `executive-resource-platform-consumer-${string}`;
  readonly consumerName: string;
  readonly consumerCategory:
    | "BUS"
    | "OPS"
    | "APP"
    | "LAY"
    | "CORE"
    | "ExecutiveAdvisor"
    | "ExecutiveDashboard"
    | "ExecutiveScenarioEngine"
    | "ExecutivePlanning"
    | "ExecutiveAllocation";
  readonly metadata: Readonly<{
    readonly createdBy: "BUS-31:6";
    readonly metadataOnly: true;
    readonly immutable: true;
  }>;
  readonly metadataOnly: true;
  readonly immutable: true;
}>;

export type ExecutiveResourcePlatformExtensionPolicy = Readonly<{
  readonly extensionPolicyId: "executive-resource-platform-extension-policy";
  readonly policyVersion: "1.0.0";
  readonly supportedExtensions: readonly string[];
  readonly compatibilityRequirements: readonly string[];
  readonly metadata: Readonly<{
    readonly createdBy: "BUS-31:6";
    readonly metadataOnly: true;
    readonly immutable: true;
  }>;
  readonly metadataOnly: true;
  readonly immutable: true;
}>;

export type ExecutiveResourcePlatformSummary = Readonly<{
  readonly componentCount: number;
  readonly dependencyCount: number;
  readonly consumerCount: number;
  readonly platformStatus: ExecutiveResourcePlatformStatus;
  readonly metadata: Readonly<{
    readonly createdBy: "BUS-31:6";
    readonly metadataOnly: true;
    readonly immutable: true;
  }>;
  readonly metadataOnly: true;
  readonly immutable: true;
}>;

export type ExecutiveResourcePlatformMetadata = Readonly<{
  readonly platformNamespace: "nexora.bus.executive-resource.platform";
  readonly platformVersion: "1.0.0";
  readonly platformStatus: ExecutiveResourcePlatformStatus;
  readonly platformDescription: string;
  readonly platformDependencies: readonly string[];
  readonly platformConsumers: readonly string[];
  readonly platformCompatibility: readonly string[];
  readonly metadataOnly: true;
  readonly immutable: true;
}>;

export type ExecutiveResourcePlatformBundle = Readonly<{
  readonly identity: ExecutiveResourcePlatform;
  readonly contracts: Readonly<Record<string, unknown>>;
  readonly registry: Readonly<Record<string, unknown>>;
  readonly model: Readonly<Record<string, unknown>>;
  readonly validation: Readonly<Record<string, unknown>>;
  readonly manifest: Readonly<Record<string, unknown>>;
  readonly dependencies: readonly ExecutiveResourcePlatformDependency[];
  readonly compatibility: ExecutiveResourcePlatformCompatibility;
  readonly extensionPolicy: ExecutiveResourcePlatformExtensionPolicy;
  readonly consumers: readonly ExecutiveResourcePlatformConsumer[];
  readonly summary: ExecutiveResourcePlatformSummary;
  readonly metadata: ExecutiveResourcePlatformMetadata;
  readonly publicApis: readonly string[];
  readonly metadataOnly: true;
  readonly immutable: true;
}>;

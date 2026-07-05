export type BusinessDependencyClassification =
  | "architecture"
  | "platform"
  | "shared-service"
  | "public-api"
  | "manifest"
  | "validation"
  | "certification"
  | "compatibility"
  | "extension"
  | "future";

export type BusinessDependencyDirection = "source-to-target";

export type BusinessDependencyMetadata = Readonly<{
  readonly dependencyMapId: "BUS-ARCH-3";
  readonly architectureId: "BUS-ARCH";
  readonly version: "1.0.0";
  readonly purpose: string;
  readonly metadataOnly: boolean;
  readonly immutable: boolean;
}>;

export type BusinessDependencyRule = Readonly<{
  readonly ruleId: string;
  readonly description: string;
  readonly required: boolean;
  readonly metadataOnly: boolean;
  readonly immutable: boolean;
}>;

export type BusinessPlatformDependency = Readonly<{
  readonly dependencyId: string;
  readonly sourcePlatformId: string;
  readonly targetPlatformId: string;
  readonly dependencyType: BusinessDependencyClassification;
  readonly direction: BusinessDependencyDirection;
  readonly allowedPublicApiSurface: readonly string[];
  readonly consumerRole: string;
  readonly providerRole: string;
  readonly restrictionRules: readonly BusinessDependencyRule[];
  readonly certificationRequirement: string;
  readonly metadataOnly: boolean;
  readonly immutable: boolean;
}>;

export type BusinessPlatformConsumer = Readonly<{
  readonly consumerId: string;
  readonly platformId: string;
  readonly consumesPlatformId: string;
  readonly allowedPublicApiSurface: readonly string[];
  readonly consumerRole: string;
  readonly metadataOnly: boolean;
  readonly immutable: boolean;
}>;

export type BusinessPlatformProvider = Readonly<{
  readonly providerId: string;
  readonly platformId: string;
  readonly providesToPlatformId: string;
  readonly allowedPublicApiSurface: readonly string[];
  readonly providerRole: string;
  readonly metadataOnly: boolean;
  readonly immutable: boolean;
}>;

export type BusinessSuiteDependencyMap = Readonly<{
  readonly architectureId: "BUS-ARCH";
  readonly version: "1.0.0";
  readonly dependencyCatalog: readonly BusinessPlatformDependency[];
  readonly consumerCatalog: readonly BusinessPlatformConsumer[];
  readonly providerCatalog: readonly BusinessPlatformProvider[];
  readonly allowedDependencies: readonly BusinessPlatformDependency[];
  readonly forbiddenDependencies: readonly BusinessPlatformDependency[];
  readonly knownPlatformIds: readonly string[];
  readonly dependencyCategories: readonly BusinessDependencyClassification[];
  readonly metadata: BusinessDependencyMetadata;
  readonly deterministicFingerprint: string;
}>;

export type BusinessSuiteDependencyValidation = Readonly<{
  readonly valid: boolean;
  readonly errors: readonly string[];
  readonly warnings: readonly string[];
}>;

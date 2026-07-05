export type BusinessApiVisibility = "public";
export type BusinessApiStabilityLevel = "stable" | "certification-ready" | "future";
export type BusinessCompatibilityClass = "backward-compatible" | "additive-only" | "certification-required";

export type BusinessApiMetadata = Readonly<{
  readonly apiPolicyId: "BUS-ARCH-4";
  readonly architectureId: "BUS-ARCH";
  readonly version: "1.0.0";
  readonly purpose: string;
  readonly metadataOnly: boolean;
  readonly immutable: boolean;
}>;

export type BusinessPublicApi = Readonly<{
  readonly apiId: string;
  readonly owningPlatformId: string;
  readonly visibility: BusinessApiVisibility;
  readonly consumerScope: readonly string[];
  readonly stabilityLevel: BusinessApiStabilityLevel;
  readonly version: "1.0.0";
  readonly compatibilityClass: BusinessCompatibilityClass;
  readonly extensionSupport: boolean;
  readonly certificationRequirement: string;
  readonly metadataOnly: boolean;
  readonly immutable: boolean;
}>;

export type BusinessApiSurface = Readonly<{
  readonly surfaceId: string;
  readonly platformId: string;
  readonly publicApiIds: readonly string[];
  readonly visibility: BusinessApiVisibility;
  readonly metadataOnly: boolean;
  readonly immutable: boolean;
}>;

export type BusinessApiConsumer = Readonly<{
  readonly permissionId: string;
  readonly consumerPlatformId: string;
  readonly providerPlatformId: string;
  readonly allowedApiIds: readonly string[];
  readonly permissionScope: "certified-public-api";
  readonly metadataOnly: boolean;
  readonly immutable: boolean;
}>;

export type BusinessExtensionPoint = Readonly<{
  readonly extensionPointId: string;
  readonly owningPlatformId: string;
  readonly supportedApiId: string;
  readonly compatibilityClass: BusinessCompatibilityClass;
  readonly certificationRequired: boolean;
  readonly metadataOnly: boolean;
  readonly immutable: boolean;
}>;

export type BusinessExtensionPolicy = Readonly<{
  readonly policyId: string;
  readonly rules: readonly string[];
  readonly futurePlatformRegistration: "allowed-with-certification";
  readonly backwardCompatibilityRequired: boolean;
  readonly metadataOnly: boolean;
  readonly immutable: boolean;
}>;

export type BusinessCompatibilityPolicy = Readonly<{
  readonly policyId: string;
  readonly compatibilityClass: BusinessCompatibilityClass;
  readonly guarantee: string;
  readonly certificationRequired: boolean;
  readonly metadataOnly: boolean;
  readonly immutable: boolean;
}>;

export type BusinessVersionPolicy = Readonly<{
  readonly policyId: string;
  readonly majorVersionRule: string;
  readonly minorVersionRule: string;
  readonly patchVersionRule: string;
  readonly deprecationLifecycle: string;
  readonly certificationLifecycle: string;
  readonly metadataOnly: boolean;
  readonly immutable: boolean;
}>;

export type BusinessSuiteApiPolicyManifest = Readonly<{
  readonly architectureId: "BUS-ARCH";
  readonly version: "1.0.0";
  readonly publicApiCatalog: readonly BusinessPublicApi[];
  readonly apiSurfaceCatalog: readonly BusinessApiSurface[];
  readonly extensionCatalog: readonly BusinessExtensionPoint[];
  readonly compatibilityPolicy: readonly BusinessCompatibilityPolicy[];
  readonly versionPolicy: BusinessVersionPolicy;
  readonly deprecationPolicy: BusinessVersionPolicy;
  readonly consumerPermissionCatalog: readonly BusinessApiConsumer[];
  readonly extensionPolicy: BusinessExtensionPolicy;
  readonly metadata: BusinessApiMetadata;
  readonly deterministicFingerprint: string;
}>;

export type BusinessSuiteApiPolicyValidation = Readonly<{
  readonly valid: boolean;
  readonly errors: readonly string[];
  readonly warnings: readonly string[];
}>;

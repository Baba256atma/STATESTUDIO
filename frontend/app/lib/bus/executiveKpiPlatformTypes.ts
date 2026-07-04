export type ExecutiveKpiPlatformLifecycle = Readonly<{
  readonly status: "Foundation";
  readonly state: "Immutable";
  readonly certificationStatus: "BUS-1 Foundation";
}>;

export type ExecutiveKpiDependency = Readonly<{
  readonly dependencyId: "CORE" | "DS" | "INT" | "KNL" | "APP" | "LAY" | "OPS";
  readonly compatible: boolean;
  readonly implementationRequired: false;
}>;

export type ExecutiveKpiConsumer = Readonly<{
  readonly consumerId: string;
  readonly name: string;
  readonly metadataOnly: boolean;
}>;

export type ExecutiveKpiCapability = Readonly<{
  readonly capabilityId: string;
  readonly name: string;
  readonly description: string;
  readonly declarationOnly: boolean;
}>;

export type ExecutiveKpiPublicApi = Readonly<{
  readonly apiName: string;
  readonly stable: boolean;
  readonly runtime: false;
}>;

export type ExecutiveKpiReleaseMetadata = Readonly<{
  readonly releaseId: "BUS-1";
  readonly releaseStage: "Foundation";
  readonly metadataOnly: boolean;
  readonly immutable: boolean;
}>;

export type ExecutiveKpiExtensionPolicy = Readonly<{
  readonly policyId: string;
  readonly extensionMode: "additive-only";
  readonly foundationMutationAllowed: false;
  readonly runtimeExecutionAllowed: false;
  readonly businessLogicAllowed: false;
}>;

export type ExecutiveKpiPlatformRegistry = Readonly<{
  readonly platformName: "Executive KPI Platform";
  readonly platformId: "BUS-1";
  readonly version: "1.0.0";
  readonly description: string;
  readonly lifecycle: ExecutiveKpiPlatformLifecycle;
  readonly dependencies: readonly ExecutiveKpiDependency[];
  readonly consumers: readonly ExecutiveKpiConsumer[];
  readonly capabilities: readonly ExecutiveKpiCapability[];
  readonly publicApis: readonly ExecutiveKpiPublicApi[];
  readonly releaseMetadata: ExecutiveKpiReleaseMetadata;
  readonly extensionPolicy: ExecutiveKpiExtensionPolicy;
}>;

export type ExecutiveKpiPlatformManifest = Readonly<{
  readonly platform: "Executive KPI Platform";
  readonly platformId: "BUS-1";
  readonly version: "1.0.0";
  readonly phase: "BUS-1";
  readonly capabilities: readonly ExecutiveKpiCapability[];
  readonly dependencies: readonly ExecutiveKpiDependency[];
  readonly consumers: readonly ExecutiveKpiConsumer[];
  readonly publicApis: readonly ExecutiveKpiPublicApi[];
  readonly certificationStatus: "Foundation Certified";
  readonly releaseMetadata: ExecutiveKpiReleaseMetadata;
  readonly deterministicFingerprint: string;
}>;

export type ExecutiveKpiPlatformValidation = Readonly<{
  readonly valid: boolean;
  readonly errors: readonly string[];
  readonly warnings: readonly string[];
}>;

export type ExecutiveKpiPlatform = Readonly<{
  readonly registry: ExecutiveKpiPlatformRegistry;
  readonly manifest: ExecutiveKpiPlatformManifest;
  readonly validation: ExecutiveKpiPlatformValidation;
}>;

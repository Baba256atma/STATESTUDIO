export type ExecutiveOkrPlatformLifecycle = Readonly<{
  readonly status: "Foundation";
  readonly state: "Immutable";
  readonly certificationStatus: "BUS-13 Foundation";
}>;

export type ExecutiveOkrDependency = Readonly<{
  readonly dependencyId: "CORE" | "DS" | "INT" | "KNL" | "APP" | "LAY" | "OPS" | "EVE" | "BUS Executive KPI Platform";
  readonly compatible: boolean;
  readonly implementationRequired: false;
}>;

export type ExecutiveOkrConsumer = Readonly<{
  readonly consumerId: string;
  readonly name: string;
  readonly metadataOnly: boolean;
}>;

export type ExecutiveOkrCapability = Readonly<{
  readonly capabilityId: string;
  readonly name: string;
  readonly description: string;
  readonly declarationOnly: boolean;
}>;

export type ExecutiveOkrPublicApi = Readonly<{
  readonly apiName: string;
  readonly stable: boolean;
  readonly runtime: false;
}>;

export type ExecutiveOkrExtensionPolicy = Readonly<{
  readonly policyId: string;
  readonly extensionMode: "additive-only";
  readonly foundationMutationAllowed: false;
  readonly runtimeExecutionAllowed: false;
  readonly businessLogicAllowed: false;
  readonly okrScoringAllowed: false;
  readonly progressCalculationAllowed: false;
}>;

export type ExecutiveOkrReleaseMetadata = Readonly<{
  readonly releaseId: "BUS-13";
  readonly releaseStage: "Foundation";
  readonly metadataOnly: boolean;
  readonly immutable: boolean;
}>;

export type ExecutiveOkrPlatformRegistry = Readonly<{
  readonly platformName: "Executive OKR Platform";
  readonly platformId: "BUS-13";
  readonly version: "1.0.0";
  readonly description: string;
  readonly lifecycle: ExecutiveOkrPlatformLifecycle;
  readonly dependencies: readonly ExecutiveOkrDependency[];
  readonly consumers: readonly ExecutiveOkrConsumer[];
  readonly capabilities: readonly ExecutiveOkrCapability[];
  readonly publicApis: readonly ExecutiveOkrPublicApi[];
  readonly releaseMetadata: ExecutiveOkrReleaseMetadata;
  readonly extensionPolicy: ExecutiveOkrExtensionPolicy;
  readonly kpiPlatformFreezeDependency: "Executive KPI Platform Freeze";
}>;

export type ExecutiveOkrPlatformManifest = Readonly<{
  readonly platform: "Executive OKR Platform";
  readonly platformId: "BUS-13";
  readonly version: "1.0.0";
  readonly phase: "BUS-13";
  readonly capabilities: readonly ExecutiveOkrCapability[];
  readonly dependencies: readonly ExecutiveOkrDependency[];
  readonly consumers: readonly ExecutiveOkrConsumer[];
  readonly publicApis: readonly ExecutiveOkrPublicApi[];
  readonly kpiFreezeAvailable: boolean;
  readonly kpiFreezeState: "Certified Frozen Released" | "Unavailable";
  readonly certificationStatus: "Foundation Certified";
  readonly releaseMetadata: ExecutiveOkrReleaseMetadata;
  readonly deterministicFingerprint: string;
}>;

export type ExecutiveOkrPlatformValidation = Readonly<{
  readonly valid: boolean;
  readonly errors: readonly string[];
  readonly warnings: readonly string[];
}>;

export type ExecutiveOkrPlatform = Readonly<{
  readonly registry: ExecutiveOkrPlatformRegistry;
  readonly manifest: ExecutiveOkrPlatformManifest;
  readonly validation: ExecutiveOkrPlatformValidation;
}>;

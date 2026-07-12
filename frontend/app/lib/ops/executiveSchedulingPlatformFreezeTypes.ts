export type ExecutiveSchedulingPlatformFreezeStatus = "PASS" | "FAIL";

export type ExecutiveSchedulingPlatformFreezeCategory =
  | "Foundation"
  | "Registry"
  | "Model"
  | "Validation"
  | "Manifest"
  | "Platform"
  | "Certification"
  | "Compatibility"
  | "PublicApi"
  | "Immutability"
  | "Determinism"
  | "Compliance"
  | "ExtensionPolicy"
  | "Regression"
  | "ReleaseReadiness"
  | "Freeze";

export interface ExecutiveSchedulingPlatformFreezeEntry {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly category: ExecutiveSchedulingPlatformFreezeCategory;
  readonly status: ExecutiveSchedulingPlatformFreezeStatus;
  readonly metadataOnly: true;
}

export interface ExecutiveSchedulingPlatformFreezeRegistryEntry {
  readonly phaseId: string;
  readonly phaseName: string;
  readonly phaseVersion: string;
  readonly certificationStatus: "PASS";
  readonly frozen: true;
  readonly metadataOnly: true;
}

export interface ExecutiveSchedulingPlatformFreezeCompatibilityEntry {
  readonly target: string;
  readonly freezeStatus: "Frozen";
  readonly description: string;
  readonly metadataOnly: true;
}

export interface ExecutiveSchedulingPlatformRegressionEntry {
  readonly id: string;
  readonly scope: string;
  readonly stabilityStatus: "Stable";
  readonly description: string;
  readonly metadataOnly: true;
}

export interface ExecutiveSchedulingPlatformFreezeManifest {
  readonly freezeIdentity: {
    readonly freezeId: string;
    readonly freezeName: string;
    readonly freezeVersion: string;
    readonly freezeStatus: "Frozen";
    readonly releaseStatus: "Released";
  };
  readonly platformIdentity: {
    readonly platformId: string;
    readonly platformName: string;
    readonly platformNamespace: string;
    readonly platformDescription: string;
    readonly platformVersion: string;
    readonly platformArchitecturalLevel: string;
    readonly platformStatus: string;
    readonly dependencySources: readonly string[];
    readonly dependencyVersions: readonly string[];
    readonly releaseStage: string;
    readonly metadataOnly: true;
    readonly immutable: true;
    readonly deterministic: true;
  };
  readonly certifiedPlatformReference: {
    readonly platformId: string;
    readonly certificationVersion: string;
    readonly freezeStatus: "Frozen";
    readonly metadataOnly: true;
    readonly immutable: true;
  };
  readonly certificationReference: {
    readonly certificationStatus: "PASS" | "FAIL";
    readonly totalChecks: number;
    readonly metadataOnly: true;
    readonly immutable: true;
    readonly deterministic: true;
  };
  readonly certifiedPhaseRegistry: readonly ExecutiveSchedulingPlatformFreezeRegistryEntry[];
  readonly freezeRegistryMetadata: {
    readonly freezeRegistryId: string;
    readonly freezeRegistryVersion: string;
    readonly phaseCount: number;
    readonly freezeStatus: "Frozen";
    readonly metadataOnly: true;
    readonly immutable: true;
  };
  readonly schedulingCompatibilityMetadata: readonly ExecutiveSchedulingPlatformFreezeCompatibilityEntry[];
  readonly taskCompatibilityMetadata: readonly ExecutiveSchedulingPlatformFreezeCompatibilityEntry[];
  readonly workflowCompatibilityMetadata: readonly ExecutiveSchedulingPlatformFreezeCompatibilityEntry[];
  readonly projectCompatibilityMetadata: readonly ExecutiveSchedulingPlatformFreezeCompatibilityEntry[];
  readonly resourceCompatibilityMetadata: readonly ExecutiveSchedulingPlatformFreezeCompatibilityEntry[];
  readonly freezeCompatibilityMetadata: {
    readonly freezeCompatibilityId: string;
    readonly freezeCompatibilityVersion: string;
    readonly compatibilityCount: number;
    readonly metadataOnly: true;
    readonly immutable: true;
  };
  readonly regressionMetadata: readonly ExecutiveSchedulingPlatformRegressionEntry[];
  readonly regressionMetadataSummary: {
    readonly regressionId: string;
    readonly regressionVersion: string;
    readonly regressionCount: number;
    readonly metadataOnly: true;
    readonly immutable: true;
  };
  readonly validationSummary: {
    readonly validationStatus: "PASS" | "FAIL";
    readonly manifestStatus: "PASS" | "FAIL";
    readonly certificationStatus: "PASS" | "FAIL";
    readonly metadataOnly: true;
    readonly immutable: true;
  };
  readonly releaseSummary: {
    readonly releaseReadiness: "Ready" | "Blocked";
    readonly publicApiStatus: "Stable";
    readonly architectureCompleteness: "Complete";
    readonly metadataOnly: true;
    readonly immutable: true;
  };
  readonly publicApiFreezeStatus: "Frozen";
  readonly extensionPolicy: {
    readonly status: "Locked";
    readonly publicApiOnly: true;
    readonly metadataOnly: true;
  };
  readonly releaseReadinessState: "Ready";
  readonly deterministicSummary: {
    readonly deterministic: true;
    readonly metadataOnly: true;
    readonly immutable: true;
  };
  readonly metadataOnlySummary: {
    readonly metadataOnly: true;
    readonly immutable: true;
    readonly publicApiStable: true;
  };
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministic: true;
}

export interface ExecutiveSchedulingPlatformFreezeResult {
  readonly totalChecks: number;
  readonly passed: number;
  readonly failed: number;
  readonly freezeEntries: readonly ExecutiveSchedulingPlatformFreezeEntry[];
  readonly overallFreezeStatus: "PASS" | "FAIL";
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministic: true;
}

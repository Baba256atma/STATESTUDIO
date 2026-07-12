export type ExecutiveDependencyFreezeStatus = "PASS" | "FAIL";

export type ExecutiveDependencyFreezeCategory =
  | "Foundation"
  | "Registry"
  | "Model"
  | "Validation"
  | "Manifest"
  | "Platform"
  | "Certification"
  | "Compatibility"
  | "PublicApi"
  | "Determinism"
  | "Immutability"
  | "Compliance"
  | "ExtensionPolicy"
  | "Regression"
  | "ReleaseReadiness"
  | "Freeze";

export interface ExecutiveDependencyFreezeDescriptor {
  readonly freezeId: string;
  readonly freezeName: string;
  readonly freezeVersion: string;
  readonly platformId: string;
  readonly certificationVersion: string;
  readonly freezeStatus: "Frozen";
  readonly releaseStatus: "Released";
  readonly readonlyStatus: "Readonly";
  readonly deterministicStatus: "Deterministic";
  readonly metadataOnlyStatus: "MetadataOnly";
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministic: true;
}

export interface ExecutiveDependencyFreezeEntry {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly category: ExecutiveDependencyFreezeCategory;
  readonly status: ExecutiveDependencyFreezeStatus;
  readonly metadataOnly: true;
}

export interface ExecutiveDependencyPhaseFreezeEntry {
  readonly phaseId: string;
  readonly phaseName: string;
  readonly phaseVersion: string;
  readonly certificationStatus: "PASS";
  readonly frozen: true;
  readonly metadataOnly: true;
}

export interface ExecutiveDependencyFreezeCompatibilityEntry {
  readonly target: string;
  readonly compatibilityStatus: "Compatible";
  readonly certificationDependency: "PASS";
  readonly manifestDependency: "Complete";
  readonly publicApiCompatibility: "Stable";
  readonly freezeCompatibility: "Frozen";
  readonly metadataOnly: true;
}

export interface ExecutiveDependencyRegressionEntry {
  readonly id: string;
  readonly scope: string;
  readonly stabilityStatus: "Stable";
  readonly description: string;
  readonly metadataOnly: true;
}

export interface ExecutiveDependencyExtensionPolicy {
  readonly status: "Locked";
  readonly publicApiOnly: true;
  readonly metadataOnly: true;
}

export interface ExecutiveDependencyRegressionSummary {
  readonly regressionId: string;
  readonly regressionVersion: string;
  readonly regressionCount: number;
  readonly metadataOnly: true;
  readonly immutable: true;
}

export interface ExecutiveDependencyReleaseSummary {
  readonly releaseReadiness: "Ready" | "Blocked";
  readonly publicApiStatus: "Stable";
  readonly architectureCompleteness: "Complete";
  readonly certificationStatus: "PASS" | "FAIL";
  readonly metadataOnly: true;
  readonly immutable: true;
}

export interface ExecutiveDependencyFreezeManifest {
  readonly platformIdentity: {
    readonly platformId: string;
    readonly platformName: string;
    readonly platformNamespace: string;
    readonly platformVersion: string;
    readonly description: string;
    readonly releaseStatus: string;
    readonly metadataOnly: true;
    readonly immutable: true;
    readonly deterministic: true;
  };
  readonly freezeIdentity: ExecutiveDependencyFreezeDescriptor;
  readonly certificationReference: {
    readonly certificationStatus: "PASS" | "FAIL";
    readonly totalChecks: number;
    readonly metadataOnly: true;
    readonly immutable: true;
    readonly deterministic: true;
  };
  readonly freezeRegistry: {
    readonly freezeId: string;
    readonly freezeName: string;
    readonly freezeVersion: string;
    readonly platformId: string;
    readonly certificationVersion: string;
    readonly freezeStatus: "Frozen";
    readonly releaseStatus: "Released";
    readonly readonlyStatus: "Readonly";
    readonly deterministicStatus: "Deterministic";
    readonly metadataOnlyStatus: "MetadataOnly";
    readonly metadataOnly: true;
    readonly immutable: true;
    readonly deterministic: true;
  };
  readonly certifiedPhaseRegistry: readonly ExecutiveDependencyPhaseFreezeEntry[];
  readonly compatibilityMetadata: {
    readonly internal: readonly ExecutiveDependencyFreezeCompatibilityEntry[];
    readonly crossPlatform: readonly ExecutiveDependencyFreezeCompatibilityEntry[];
    readonly metadataOnly: true;
    readonly immutable: true;
    readonly deterministic: true;
  };
  readonly validationSummary: {
    readonly validationStatus: "PASS" | "FAIL";
    readonly manifestStatus: "PASS" | "FAIL";
    readonly certificationStatus: "PASS" | "FAIL";
    readonly metadataOnly: true;
    readonly immutable: true;
  };
  readonly releaseSummary: ExecutiveDependencyReleaseSummary;
  readonly extensionPolicy: ExecutiveDependencyExtensionPolicy;
  readonly regressionSummary: ExecutiveDependencyRegressionSummary;
  readonly regressionMetadata: readonly ExecutiveDependencyRegressionEntry[];
  readonly publicApiFreezeStatus: "Frozen";
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

export interface ExecutiveDependencyFreezeSummary {
  readonly totalChecks: number;
  readonly passed: number;
  readonly failed: number;
  readonly overallFreezeStatus: "PASS" | "FAIL";
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministic: true;
}

export interface ExecutiveDependencyFreezeResult {
  readonly totalChecks: number;
  readonly passed: number;
  readonly failed: number;
  readonly freezeEntries: readonly ExecutiveDependencyFreezeEntry[];
  readonly overallFreezeStatus: "PASS" | "FAIL";
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministic: true;
}

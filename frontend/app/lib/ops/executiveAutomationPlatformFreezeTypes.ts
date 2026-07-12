export type ExecutiveAutomationFreezeStatus = "PASS" | "FAIL";

export type ExecutiveAutomationFreezeCategory =
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

export interface ExecutiveAutomationFreezeDescriptor {
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

export interface ExecutiveAutomationFreezeEntry {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly category: ExecutiveAutomationFreezeCategory;
  readonly status: ExecutiveAutomationFreezeStatus;
  readonly metadataOnly: true;
}

export interface ExecutiveAutomationPhaseFreezeEntry {
  readonly phaseId: string;
  readonly phaseName: string;
  readonly phaseVersion: string;
  readonly certificationStatus: "PASS";
  readonly frozen: true;
  readonly metadataOnly: true;
}

export interface ExecutiveAutomationFreezeCompatibilityEntry {
  readonly target: string;
  readonly compatibilityStatus: "Compatible";
  readonly certificationDependency: "PASS";
  readonly manifestDependency: "Complete";
  readonly publicApiCompatibility: "Stable";
  readonly freezeCompatibility: "Frozen";
  readonly metadataOnly: true;
}

export interface ExecutiveAutomationRegressionEntry {
  readonly id: string;
  readonly scope: string;
  readonly stabilityStatus: "Stable";
  readonly description: string;
  readonly metadataOnly: true;
}

export interface ExecutiveAutomationExtensionPolicy {
  readonly status: "Locked";
  readonly publicApiOnly: true;
  readonly metadataOnly: true;
}

export interface ExecutiveAutomationRegressionSummary {
  readonly regressionId: string;
  readonly regressionVersion: string;
  readonly regressionCount: number;
  readonly metadataOnly: true;
  readonly immutable: true;
}

export interface ExecutiveAutomationReleaseSummary {
  readonly releaseReadiness: "Ready" | "Blocked";
  readonly publicApiStatus: "Stable";
  readonly architectureCompleteness: "Complete";
  readonly certificationStatus: "PASS" | "FAIL";
  readonly metadataOnly: true;
  readonly immutable: true;
}

export interface ExecutiveAutomationFreezeManifest {
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
  readonly freezeIdentity: ExecutiveAutomationFreezeDescriptor;
  readonly certificationReference: {
    readonly certificationStatus: "PASS" | "FAIL";
    readonly totalChecks: number;
    readonly metadataOnly: true;
    readonly immutable: true;
    readonly deterministic: true;
  };
  readonly freezeRegistry: ExecutiveAutomationFreezeDescriptor;
  readonly certifiedPhaseRegistry: readonly ExecutiveAutomationPhaseFreezeEntry[];
  readonly compatibilityMetadata: {
    readonly internal: readonly ExecutiveAutomationFreezeCompatibilityEntry[];
    readonly crossPlatform: readonly ExecutiveAutomationFreezeCompatibilityEntry[];
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
  readonly releaseSummary: ExecutiveAutomationReleaseSummary;
  readonly extensionPolicy: ExecutiveAutomationExtensionPolicy;
  readonly regressionSummary: ExecutiveAutomationRegressionSummary;
  readonly regressionMetadata: readonly ExecutiveAutomationRegressionEntry[];
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

export interface ExecutiveAutomationFreezeSummary {
  readonly totalChecks: number;
  readonly passed: number;
  readonly failed: number;
  readonly overallFreezeStatus: "PASS" | "FAIL";
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministic: true;
}

export interface ExecutiveAutomationFreezeResult {
  readonly totalChecks: number;
  readonly passed: number;
  readonly failed: number;
  readonly freezeEntries: readonly ExecutiveAutomationFreezeEntry[];
  readonly overallFreezeStatus: "PASS" | "FAIL";
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministic: true;
}

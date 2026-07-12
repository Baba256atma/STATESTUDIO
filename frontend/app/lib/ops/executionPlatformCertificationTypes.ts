export type ExecutionPlatformCertificationCategory =
  | "Foundation"
  | "Registry"
  | "Model"
  | "Validation"
  | "Manifest"
  | "PlatformIndex"
  | "Compatibility"
  | "Immutability"
  | "Determinism";

export type ExecutionPlatformCertificationLevel =
  | "Platform"
  | "Phase"
  | "PublicApi";

export interface ExecutionPlatformCertificationEntry {
  readonly certificationId: string;
  readonly certificationVersion: string;
  readonly certificationDateMetadata: string;
  readonly certificationScope: string;
  readonly certificationStatus: "PASS" | "FAIL";
  readonly category: ExecutionPlatformCertificationCategory;
  readonly level: ExecutionPlatformCertificationLevel;
  readonly metadataOnly: true;
}

export interface ExecutionPlatformCompatibilityEntry {
  readonly target: string;
  readonly compatibilityStatus: "Compatible";
  readonly description: string;
  readonly metadataOnly: true;
}

export interface ExecutionPlatformCertificationSummary {
  readonly totalChecks: number;
  readonly passed: number;
  readonly failed: number;
  readonly overallStatus: "PASS" | "FAIL";
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministic: true;
}

export interface ExecutionPlatformCertificationResult {
  readonly totalChecks: number;
  readonly passed: number;
  readonly failed: number;
  readonly certificationEntries: readonly ExecutionPlatformCertificationEntry[];
  readonly overallStatus: "PASS" | "FAIL";
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministic: true;
}

export interface ExecutionPlatformCertificationManifest {
  readonly platformIdentity: {
    readonly platformId: string;
    readonly platformName: string;
    readonly platformVersion: string;
  };
  readonly certifiedPhases: readonly string[];
  readonly certificationRegistry: readonly ExecutionPlatformCertificationEntry[];
  readonly certificationRegistryMetadata: {
    readonly certificationRegistryId: string;
    readonly certificationRegistryVersion: string;
    readonly certificationScope: string;
    readonly certificationStatus: "PASS";
    readonly entryCount: number;
    readonly metadataOnly: true;
    readonly immutable: true;
  };
  readonly compatibilityMatrix: readonly ExecutionPlatformCompatibilityEntry[];
  readonly compatibilityMetadata: {
    readonly compatibilityMatrixId: string;
    readonly compatibilityVersion: string;
    readonly compatibilityCount: number;
    readonly metadataOnly: true;
    readonly immutable: true;
  };
  readonly publicApiStatus: "Stable";
  readonly validationSummary: {
    readonly validationStatus: "PASS" | "FAIL";
    readonly manifestStatus: "PASS" | "FAIL";
    readonly releaseReadiness: "Ready" | "Blocked";
    readonly metadataOnly: true;
    readonly immutable: true;
  };
  readonly manifestSummary: {
    readonly phaseCount: number;
    readonly dependencyCount: number;
    readonly publicApiCount: number;
    readonly metadataOnly: true;
    readonly immutable: true;
  };
  readonly certificationStatus: "PASS" | "FAIL";
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministic: true;
}

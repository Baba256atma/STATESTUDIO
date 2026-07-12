export type ResourcePlatformCertificationCategory =
  | "Foundation"
  | "RegistryMetadata"
  | "Model"
  | "Validation"
  | "Manifest"
  | "PlatformIndex"
  | "Compatibility"
  | "Immutability"
  | "Determinism";

export type ResourcePlatformCertificationLevel =
  | "Platform"
  | "Phase"
  | "PublicApi";

export interface ResourcePlatformCertificationEntry {
  readonly certificationId: string;
  readonly certificationVersion: string;
  readonly certificationDateMetadata: string;
  readonly certificationScope: string;
  readonly certificationStatus: "PASS" | "FAIL";
  readonly category: ResourcePlatformCertificationCategory;
  readonly level: ResourcePlatformCertificationLevel;
  readonly metadataOnly: true;
}

export interface ResourcePlatformCompatibilityEntry {
  readonly target: string;
  readonly compatibilityStatus: "Compatible";
  readonly description: string;
  readonly metadataOnly: true;
}

export interface ResourcePlatformCertificationSummary {
  readonly totalChecks: number;
  readonly passed: number;
  readonly failed: number;
  readonly overallStatus: "PASS" | "FAIL";
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministic: true;
}

export interface ResourcePlatformCertificationResult {
  readonly totalChecks: number;
  readonly passed: number;
  readonly failed: number;
  readonly certificationEntries: readonly ResourcePlatformCertificationEntry[];
  readonly overallStatus: "PASS" | "FAIL";
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministic: true;
}

export interface ResourcePlatformCertificationManifest {
  readonly platformIdentity: {
    readonly platformId: string;
    readonly platformName: string;
    readonly platformVersion: string;
  };
  readonly certifiedPhases: readonly string[];
  readonly certificationRegistry: readonly ResourcePlatformCertificationEntry[];
  readonly certificationRegistryMetadata: {
    readonly certificationRegistryId: string;
    readonly certificationRegistryVersion: string;
    readonly certificationScope: string;
    readonly certificationStatus: "PASS";
    readonly entryCount: number;
    readonly metadataOnly: true;
    readonly immutable: true;
  };
  readonly compatibilityMatrix: readonly ResourcePlatformCompatibilityEntry[];
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

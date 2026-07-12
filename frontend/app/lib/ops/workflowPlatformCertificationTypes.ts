export type WorkflowPlatformCertificationCategory =
  | "Foundation"
  | "RegistryMetadata"
  | "Model"
  | "Validation"
  | "Manifest"
  | "PlatformIndex"
  | "TaskCompatibility"
  | "Compatibility"
  | "Immutability"
  | "Determinism";

export type WorkflowPlatformCertificationLevel =
  | "Platform"
  | "Phase"
  | "PublicApi";

export interface WorkflowPlatformCertificationEntry {
  readonly certificationId: string;
  readonly certificationVersion: string;
  readonly certificationDateMetadata: string;
  readonly certificationScope: string;
  readonly certificationStatus: "PASS" | "FAIL";
  readonly category: WorkflowPlatformCertificationCategory;
  readonly level: WorkflowPlatformCertificationLevel;
  readonly metadataOnly: true;
}

export interface WorkflowPlatformCompatibilityEntry {
  readonly target: string;
  readonly compatibilityStatus: "Compatible";
  readonly description: string;
  readonly metadataOnly: true;
}

export interface WorkflowPlatformCertificationSummary {
  readonly totalChecks: number;
  readonly passed: number;
  readonly failed: number;
  readonly overallStatus: "PASS" | "FAIL";
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministic: true;
}

export interface WorkflowPlatformCertificationResult {
  readonly totalChecks: number;
  readonly passed: number;
  readonly failed: number;
  readonly certificationEntries: readonly WorkflowPlatformCertificationEntry[];
  readonly overallStatus: "PASS" | "FAIL";
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministic: true;
}

export interface WorkflowPlatformCertificationManifest {
  readonly platformIdentity: {
    readonly platformId: string;
    readonly platformName: string;
    readonly platformVersion: string;
  };
  readonly certifiedPhases: readonly string[];
  readonly certificationRegistry: readonly WorkflowPlatformCertificationEntry[];
  readonly certificationRegistryMetadata: {
    readonly certificationRegistryId: string;
    readonly certificationRegistryVersion: string;
    readonly certificationScope: string;
    readonly certificationStatus: "PASS";
    readonly entryCount: number;
    readonly metadataOnly: true;
    readonly immutable: true;
  };
  readonly compatibilityMatrix: readonly WorkflowPlatformCompatibilityEntry[];
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
    readonly taskCompatibilityStatus: "PASS" | "FAIL";
    readonly metadataOnly: true;
    readonly immutable: true;
  };
  readonly certificationStatus: "PASS" | "FAIL";
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministic: true;
}

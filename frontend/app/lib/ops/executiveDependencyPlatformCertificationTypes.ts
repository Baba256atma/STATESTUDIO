export type ExecutiveDependencyCertificationStatus = "PASS" | "FAIL";

export interface ExecutiveDependencyCertificationDescriptor {
  readonly certificationId: string;
  readonly certificationName: string;
  readonly certificationVersion: string;
  readonly platformId: string;
  readonly platformVersion: string;
  readonly certificationStatus: ExecutiveDependencyCertificationStatus;
  readonly releaseReadiness: "Ready" | "Blocked";
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministic: true;
}

export interface ExecutiveDependencyCompatibilitySummary {
  readonly internalCompatibilityStatus: "PASS" | "FAIL";
  readonly crossPlatformCompatibilityStatus: "PASS" | "FAIL";
  readonly metadataOnly: true;
  readonly immutable: true;
}

export interface ExecutiveDependencyReleaseReadiness {
  readonly status: "Ready" | "Blocked";
  readonly publicApiStatus: "Stable";
  readonly certificationStatus: ExecutiveDependencyCertificationStatus;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministic: true;
}

export interface ExecutiveDependencyCertificationSummary {
  readonly certificationStatus: ExecutiveDependencyCertificationStatus;
  readonly totalChecks: number;
  readonly passedChecks: number;
  readonly failedChecks: number;
  readonly releaseReadiness: "Ready" | "Blocked";
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministic: true;
}

export interface ExecutiveDependencyCertificationResult {
  readonly totalChecks: number;
  readonly passedChecks: number;
  readonly failedChecks: number;
  readonly status: ExecutiveDependencyCertificationStatus;
  readonly checks: readonly {
    readonly id: string;
    readonly name: string;
    readonly category:
      | "Foundation"
      | "Registry"
      | "Model"
      | "Validation"
      | "Manifest"
      | "Platform"
      | "Namespace"
      | "Metadata"
      | "Compatibility"
      | "PublicApi"
      | "Determinism"
      | "Immutability"
      | "Compliance"
      | "ReleaseReadiness";
    readonly status: ExecutiveDependencyCertificationStatus;
    readonly metadataOnly: true;
  }[];
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministic: true;
}

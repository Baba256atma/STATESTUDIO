export type ExecutiveAutomationCertificationStatus = "PASS" | "FAIL";

export interface ExecutiveAutomationCertificationDescriptor {
  readonly certificationId: string;
  readonly certificationName: string;
  readonly certificationVersion: string;
  readonly platformId: string;
  readonly platformVersion: string;
  readonly certificationStatus: ExecutiveAutomationCertificationStatus;
  readonly releaseReadiness: "Ready" | "Blocked";
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministic: true;
}

export interface ExecutiveAutomationCompatibilitySummary {
  readonly internalCompatibilityStatus: "PASS" | "FAIL";
  readonly crossPlatformCompatibilityStatus: "PASS" | "FAIL";
  readonly metadataOnly: true;
  readonly immutable: true;
}

export interface ExecutiveAutomationReleaseReadiness {
  readonly status: "Ready" | "Blocked";
  readonly publicApiStatus: "Stable";
  readonly certificationStatus: ExecutiveAutomationCertificationStatus;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministic: true;
}

export interface ExecutiveAutomationCertificationSummary {
  readonly certificationStatus: ExecutiveAutomationCertificationStatus;
  readonly totalChecks: number;
  readonly passedChecks: number;
  readonly failedChecks: number;
  readonly releaseReadiness: "Ready" | "Blocked";
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministic: true;
}

export interface ExecutiveAutomationCertificationResult {
  readonly totalChecks: number;
  readonly passedChecks: number;
  readonly failedChecks: number;
  readonly status: ExecutiveAutomationCertificationStatus;
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
    readonly status: ExecutiveAutomationCertificationStatus;
    readonly metadataOnly: true;
  }[];
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministic: true;
}

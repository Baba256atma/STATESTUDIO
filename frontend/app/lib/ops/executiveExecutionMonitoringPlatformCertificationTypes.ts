export type ExecutiveExecutionMonitoringCertificationStatus = "PASS" | "FAIL";

export interface ExecutiveExecutionMonitoringCertificationDescriptor {
  readonly certificationId: string;
  readonly certificationName: string;
  readonly certificationVersion: string;
  readonly platformId: string;
  readonly platformVersion: string;
  readonly certificationStatus: ExecutiveExecutionMonitoringCertificationStatus;
  readonly releaseReadiness: "Ready" | "Blocked";
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministic: true;
}

export interface ExecutiveExecutionMonitoringCompatibilitySummary {
  readonly internalCompatibilityStatus: ExecutiveExecutionMonitoringCertificationStatus;
  readonly crossPlatformCompatibilityStatus: ExecutiveExecutionMonitoringCertificationStatus;
  readonly metadataOnly: true;
  readonly immutable: true;
}

export interface ExecutiveExecutionMonitoringReleaseReadiness {
  readonly status: "Ready" | "Blocked";
  readonly publicApiStatus: "Stable";
  readonly certificationStatus: ExecutiveExecutionMonitoringCertificationStatus;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministic: true;
}

export interface ExecutiveExecutionMonitoringCertificationSummary {
  readonly certificationStatus: ExecutiveExecutionMonitoringCertificationStatus;
  readonly totalChecks: number;
  readonly passedChecks: number;
  readonly failedChecks: number;
  readonly releaseReadiness: "Ready" | "Blocked";
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministic: true;
}

export interface ExecutiveExecutionMonitoringCertificationResult {
  readonly totalChecks: number;
  readonly passedChecks: number;
  readonly failedChecks: number;
  readonly status: ExecutiveExecutionMonitoringCertificationStatus;
  readonly checks: readonly Readonly<{
    id: string;
    name: string;
    category: "Foundation" | "Registry" | "Model" | "Validation" | "Manifest" | "Platform" | "Namespace" | "Metadata" | "Compatibility" | "PublicApi" | "Determinism" | "Immutability" | "Compliance" | "ReleaseReadiness";
    status: ExecutiveExecutionMonitoringCertificationStatus;
    metadataOnly: true;
  }>[];
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministic: true;
}

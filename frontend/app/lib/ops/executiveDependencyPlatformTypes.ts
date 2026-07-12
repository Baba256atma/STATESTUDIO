export interface ExecutiveDependencyPlatformDescriptor {
  readonly platformId: string;
  readonly platformName: string;
  readonly platformNamespace: string;
  readonly platformVersion: string;
  readonly description: string;
  readonly releaseStatus: "Draft" | "Released";
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministic: true;
}

export interface ExecutiveDependencyPlatformCompatibilitySummary {
  readonly internalPhaseCount: number;
  readonly crossPlatformCompatibilityCount: number;
  readonly compatibilityStatus: "PASS" | "FAIL";
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministic: true;
}

export interface ExecutiveDependencyPlatformReleaseSummary {
  readonly platformId: string;
  readonly platformVersion: string;
  readonly phaseCount: number;
  readonly validationStatus: "PASS" | "FAIL";
  readonly manifestStatus: "PASS" | "FAIL";
  readonly publicApiStatus: "Stable";
  readonly releaseReadiness: "Ready" | "Blocked";
  readonly certificationState: "Pending";
  readonly architectureCompleteness: "Complete";
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministic: true;
}

export interface ExecutiveDependencyPlatformMetadata {
  readonly platformIdentity: ExecutiveDependencyPlatformDescriptor;
  readonly consumedPhases: readonly string[];
  readonly publicApiCount: number;
  readonly manifestSummary: {
    readonly phaseCount: number;
    readonly dependencyCount: number;
    readonly publicApiCount: number;
    readonly compatibilityStatus: "PASS" | "FAIL";
    readonly metadataOnly: true;
    readonly immutable: true;
    readonly deterministic: true;
  };
  readonly validationSummary: {
    readonly totalChecks: number;
    readonly passedChecks: number;
    readonly failedChecks: number;
    readonly status: "PASS" | "FAIL";
    readonly metadataOnly: true;
    readonly immutable: true;
    readonly deterministic: true;
  };
  readonly compatibilitySummary: ExecutiveDependencyPlatformCompatibilitySummary;
  readonly releaseReadiness: "Ready" | "Blocked";
  readonly deterministicStatus: "Deterministic";
  readonly immutableStatus: "Immutable";
  readonly metadataOnlyStatus: "MetadataOnly";
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministic: true;
}

export interface ExecutiveDependencyPlatformSummary {
  readonly releaseSummary: ExecutiveDependencyPlatformReleaseSummary;
  readonly compatibilitySummary: ExecutiveDependencyPlatformCompatibilitySummary;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministic: true;
}

export interface ExecutiveDependencyPlatformNamespace {
  readonly foundation: object;
  readonly registry: object;
  readonly model: object;
  readonly validation: object;
  readonly manifest: object;
  readonly metadata: ExecutiveDependencyPlatformMetadata;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministic: true;
}

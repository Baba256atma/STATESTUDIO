export type TaskPlatformFreezeCategory =
  | "Certification"
  | "Regression"
  | "Compatibility"
  | "Manifest"
  | "PublicApi"
  | "Immutability"
  | "Determinism";

export interface TaskPlatformFreezeEntry {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly category: TaskPlatformFreezeCategory;
  readonly status: "PASS" | "FAIL";
  readonly metadataOnly: true;
}

export interface TaskPlatformFreezeRegistryEntry {
  readonly phaseId: string;
  readonly phaseName: string;
  readonly phaseVersion: string;
  readonly certificationStatus: "PASS";
  readonly frozen: true;
  readonly metadataOnly: true;
}

export interface TaskPlatformFreezeCompatibilityEntry {
  readonly target: string;
  readonly freezeStatus: "Frozen";
  readonly description: string;
  readonly metadataOnly: true;
}

export interface TaskPlatformRegressionEntry {
  readonly id: string;
  readonly scope: string;
  readonly stabilityStatus: "Stable";
  readonly description: string;
  readonly metadataOnly: true;
}

export interface TaskPlatformFreezeManifest {
  readonly freezeIdentity: {
    readonly freezeId: string;
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
    readonly architecturalLevel: string;
    readonly dependencySource: string;
    readonly dependencyVersion: string;
    readonly releaseStage: string;
    readonly metadataOnly: true;
    readonly immutable: true;
    readonly deterministic: true;
  };
  readonly certifiedPhaseRegistry: readonly TaskPlatformFreezeRegistryEntry[];
  readonly freezeRegistryMetadata: {
    readonly freezeRegistryId: string;
    readonly freezeRegistryVersion: string;
    readonly phaseCount: number;
    readonly freezeStatus: "Frozen";
    readonly metadataOnly: true;
    readonly immutable: true;
  };
  readonly compatibilityMetadata: readonly TaskPlatformFreezeCompatibilityEntry[];
  readonly freezeCompatibilityMetadata: {
    readonly freezeCompatibilityId: string;
    readonly freezeCompatibilityVersion: string;
    readonly compatibilityCount: number;
    readonly metadataOnly: true;
    readonly immutable: true;
  };
  readonly regressionMetadata: readonly TaskPlatformRegressionEntry[];
  readonly regressionMetadataSummary: {
    readonly regressionId: string;
    readonly regressionVersion: string;
    readonly regressionCount: number;
    readonly metadataOnly: true;
    readonly immutable: true;
  };
  readonly certificationDependency: {
    readonly platformIdentity: {
      readonly platformId: string;
      readonly platformName: string;
      readonly platformVersion: string;
    };
    readonly certifiedPhases: readonly string[];
    readonly certificationRegistry: readonly unknown[];
    readonly certificationRegistryMetadata: {
      readonly certificationRegistryId: string;
      readonly certificationRegistryVersion: string;
      readonly certificationScope: string;
      readonly certificationStatus: "PASS";
      readonly entryCount: number;
      readonly metadataOnly: true;
      readonly immutable: true;
    };
    readonly compatibilityMatrix: readonly unknown[];
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
  };
  readonly publicApiFreezeStatus: "Frozen";
  readonly extensionPolicy: {
    readonly status: "Locked";
    readonly publicApiOnly: true;
    readonly metadataOnly: true;
  };
  readonly releaseReadinessState: "Ready";
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministic: true;
}

export interface TaskPlatformFreezeResult {
  readonly totalChecks: number;
  readonly passed: number;
  readonly failed: number;
  readonly freezeEntries: readonly TaskPlatformFreezeEntry[];
  readonly overallFreezeStatus: "PASS" | "FAIL";
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministic: true;
}

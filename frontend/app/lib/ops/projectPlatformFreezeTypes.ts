export type ProjectPlatformFreezeCategory =
  | "Certification"
  | "Regression"
  | "Compatibility"
  | "Manifest"
  | "PublicApi"
  | "Immutability"
  | "Determinism";

export interface ProjectPlatformFreezeEntry {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly category: ProjectPlatformFreezeCategory;
  readonly status: "PASS" | "FAIL";
  readonly metadataOnly: true;
}

export interface ProjectPlatformFreezeRegistryEntry {
  readonly phaseId: string;
  readonly phaseName: string;
  readonly phaseVersion: string;
  readonly certificationStatus: "PASS";
  readonly frozen: true;
  readonly metadataOnly: true;
}

export interface ProjectPlatformFreezeCompatibilityEntry {
  readonly target: string;
  readonly freezeStatus: "Frozen";
  readonly description: string;
  readonly metadataOnly: true;
}

export interface ProjectPlatformRegressionEntry {
  readonly id: string;
  readonly scope: string;
  readonly stabilityStatus: "Stable";
  readonly description: string;
  readonly metadataOnly: true;
}

export interface ProjectPlatformFreezeManifest {
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
    readonly dependencySources: readonly string[];
    readonly dependencyVersions: readonly string[];
    readonly releaseStage: string;
    readonly metadataOnly: true;
    readonly immutable: true;
    readonly deterministic: true;
  };
  readonly certifiedPhaseRegistry: readonly ProjectPlatformFreezeRegistryEntry[];
  readonly freezeRegistryMetadata: {
    readonly freezeRegistryId: string;
    readonly freezeRegistryVersion: string;
    readonly phaseCount: number;
    readonly freezeStatus: "Frozen";
    readonly metadataOnly: true;
    readonly immutable: true;
  };
  readonly projectCompatibilityMetadata: readonly ProjectPlatformFreezeCompatibilityEntry[];
  readonly taskCompatibilityMetadata: readonly ProjectPlatformFreezeCompatibilityEntry[];
  readonly workflowCompatibilityMetadata: readonly ProjectPlatformFreezeCompatibilityEntry[];
  readonly freezeCompatibilityMetadata: {
    readonly freezeCompatibilityId: string;
    readonly freezeCompatibilityVersion: string;
    readonly compatibilityCount: number;
    readonly metadataOnly: true;
    readonly immutable: true;
  };
  readonly regressionMetadata: readonly ProjectPlatformRegressionEntry[];
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

export interface ProjectPlatformFreezeResult {
  readonly totalChecks: number;
  readonly passed: number;
  readonly failed: number;
  readonly freezeEntries: readonly ProjectPlatformFreezeEntry[];
  readonly overallFreezeStatus: "PASS" | "FAIL";
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministic: true;
}


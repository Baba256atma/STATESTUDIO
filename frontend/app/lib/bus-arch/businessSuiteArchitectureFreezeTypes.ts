export type BusinessArchitectureCertification = Readonly<{
  readonly certificationId: string;
  readonly status: "PASS" | "FAIL";
  readonly gates: readonly string[];
  readonly diagnostics: readonly string[];
  readonly metadataOnly: boolean;
  readonly immutable: boolean;
}>;

export type BusinessArchitectureRegression = Readonly<{
  readonly regressionId: string;
  readonly status: "PASS" | "FAIL";
  readonly phaseResults: readonly string[];
  readonly diagnostics: readonly string[];
  readonly metadataOnly: boolean;
  readonly immutable: boolean;
}>;

export type BusinessArchitectureFreeze = Readonly<{
  readonly freezeId: string;
  readonly status: "PASS" | "FAIL";
  readonly certificationStatus: "Certified" | "Not Certified";
  readonly freezeStatus: "Frozen" | "Not Frozen";
  readonly releaseStatus: "Released" | "Not Released";
  readonly certifiedPhaseIds: readonly string[];
  readonly publicApiCatalog: readonly string[];
  readonly metadataOnly: boolean;
  readonly immutable: boolean;
}>;

export type BusinessArchitectureRelease = Readonly<{
  readonly releaseId: string;
  readonly architectureId: "BUS-ARCH";
  readonly architectureName: string;
  readonly version: "1.0.0";
  readonly releaseState: "Certified, Frozen, Released";
  readonly releaseDateMetadata: string;
  readonly metadataOnly: boolean;
  readonly immutable: boolean;
}>;

export type BusinessArchitectureCompatibility = Readonly<{
  readonly compatibilityId: string;
  readonly targetId: string;
  readonly targetName: string;
  readonly classification: "phase" | "future-platform";
  readonly compatible: boolean;
  readonly requirements: readonly string[];
  readonly metadataOnly: boolean;
  readonly immutable: boolean;
}>;

export type BusinessArchitectureFreezeMetadata = Readonly<{
  readonly freezePhaseId: "BUS-ARCH-6";
  readonly architectureId: "BUS-ARCH";
  readonly version: "1.0.0";
  readonly purpose: string;
  readonly metadataOnly: boolean;
  readonly immutable: boolean;
}>;

export type BusinessSuiteArchitectureFreezeManifest = Readonly<{
  readonly architectureIdentity: Readonly<{
    readonly architectureId: "BUS-ARCH";
    readonly architectureName: string;
    readonly version: "1.0.0";
  }>;
  readonly certifiedPhaseRegistry: readonly string[];
  readonly releaseMetadata: BusinessArchitectureRelease;
  readonly compatibilityMatrix: readonly BusinessArchitectureCompatibility[];
  readonly publicApiCatalog: readonly string[];
  readonly certificationStatus: BusinessArchitectureCertification;
  readonly freezeStatus: BusinessArchitectureFreeze;
  readonly metadata: BusinessArchitectureFreezeMetadata;
  readonly deterministicFingerprint: string;
}>;

export type ExecutiveKpiPlatformFreezeStatus = "Certified" | "Frozen" | "Released" | "Failed";

export type ExecutiveKpiPlatformIdentity = Readonly<{
  readonly platformId: "BUS";
  readonly platformName: "Executive KPI Platform";
  readonly version: "1.0.0";
  readonly certificationPhaseId: "BUS-12";
  readonly state: "Certified Frozen Released";
  readonly metadataOnly: boolean;
  readonly immutable: boolean;
}>;

export type ExecutiveKpiPlatformPhaseEntry = Readonly<{
  readonly phaseId:
    | "BUS-1"
    | "BUS-2"
    | "BUS-3"
    | "BUS-4"
    | "BUS-5"
    | "BUS-6"
    | "BUS-7"
    | "BUS-8"
    | "BUS-9"
    | "BUS-10"
    | "BUS-11"
    | "BUS-12";
  readonly phaseName: string;
  readonly order: number;
  readonly status: ExecutiveKpiPlatformFreezeStatus;
  readonly metadataOnly: boolean;
  readonly immutable: boolean;
}>;

export type ExecutiveKpiPlatformPublicApiEntry = Readonly<{
  readonly apiName: string;
  readonly phaseId: ExecutiveKpiPlatformPhaseEntry["phaseId"];
  readonly stable: boolean;
  readonly metadataOnly: boolean;
}>;

export type ExecutiveKpiPlatformCompatibilityEntry = Readonly<{
  readonly compatibilityId: string;
  readonly targetLayer: string;
  readonly compatibilityStatus: "Compatible" | "Consumer Safe" | "Future Compatible" | "Metadata Only";
  readonly metadataOnly: boolean;
  readonly immutable: boolean;
}>;

export type ExecutiveKpiPlatformExtensionPolicy = Readonly<{
  readonly allowsFutureBusPhases: boolean;
  readonly requiresPublicApiConsumption: boolean;
  readonly allowsKpiComputation: false;
  readonly allowsRuntimeExecution: false;
  readonly allowsPersistence: false;
  readonly policyId: "executive-kpi-metadata-extension-policy";
  readonly metadataOnly: boolean;
  readonly immutable: boolean;
}>;

export type ExecutiveKpiPlatformReleaseMetadata = Readonly<{
  readonly releaseId: "executive-kpi-platform-freeze";
  readonly releaseName: "Executive KPI Platform Certification & Freeze";
  readonly releaseVersion: "BUS-12";
  readonly releaseDateMetadata: "deterministic-release-metadata";
  readonly certificationStatus: "Certified";
  readonly freezeStatus: "Frozen";
  readonly releaseStatus: "Released";
  readonly metadataOnly: boolean;
  readonly immutable: boolean;
}>;

export type ExecutiveKpiPlatformCertificationGate = Readonly<{
  readonly gateId: string;
  readonly gateName: string;
  readonly passed: boolean;
  readonly diagnostics: readonly string[];
}>;

export type ExecutiveKpiPlatformCertificationResult = Readonly<{
  readonly status: "PASS" | "FAIL";
  readonly gates: readonly ExecutiveKpiPlatformCertificationGate[];
  readonly diagnostics: readonly string[];
  readonly metadataOnly: boolean;
  readonly deterministic: boolean;
}>;

export type ExecutiveKpiPlatformRegressionEntry = Readonly<{
  readonly regressionId: string;
  readonly phaseId: ExecutiveKpiPlatformPhaseEntry["phaseId"];
  readonly coveredPublicApis: readonly string[];
  readonly status: "PASS" | "FAIL";
  readonly metadataOnly: boolean;
}>;

export type ExecutiveKpiPlatformRegressionResult = Readonly<{
  readonly status: "PASS" | "FAIL";
  readonly entries: readonly ExecutiveKpiPlatformRegressionEntry[];
  readonly totalEntries: number;
  readonly passedEntries: number;
  readonly failedEntries: number;
  readonly metadataOnly: boolean;
}>;

export type ExecutiveKpiPlatformFreezeManifest = Readonly<{
  readonly platformIdentity: ExecutiveKpiPlatformIdentity;
  readonly phaseRegistry: readonly ExecutiveKpiPlatformPhaseEntry[];
  readonly publicApiRegistry: readonly ExecutiveKpiPlatformPublicApiEntry[];
  readonly compatibilityMatrix: readonly ExecutiveKpiPlatformCompatibilityEntry[];
  readonly extensionPolicy: ExecutiveKpiPlatformExtensionPolicy;
  readonly releaseMetadata: ExecutiveKpiPlatformReleaseMetadata;
  readonly certificationGateCount: number;
  readonly regressionEntryCount: number;
  readonly deterministicFingerprint: string;
  readonly metadataOnly: boolean;
  readonly immutable: boolean;
}>;

export type ExecutiveKpiPlatformFreezeState = Readonly<{
  readonly status: "PASS" | "FAIL";
  readonly finalState: "Certified Frozen Released" | "Certification Failed";
  readonly manifest: ExecutiveKpiPlatformFreezeManifest;
  readonly certification: ExecutiveKpiPlatformCertificationResult;
  readonly regression: ExecutiveKpiPlatformRegressionResult;
  readonly frozenPhaseIds: readonly string[];
  readonly publicApis: readonly string[];
  readonly metadataOnly: boolean;
  readonly immutable: boolean;
}>;

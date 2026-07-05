export type ExecutiveOkrPlatformFreezeStatus = "Certified" | "Frozen" | "Released" | "Failed";

export type ExecutiveOkrPlatformIdentity = Readonly<{
  readonly platformId: "BUS-OKR";
  readonly platformName: "Executive OKR Platform";
  readonly version: "1.0.0";
  readonly certificationPhaseId: "BUS-16";
  readonly state: "Certified Frozen Released";
  readonly metadataOnly: boolean;
  readonly immutable: boolean;
}>;

export type ExecutiveOkrPlatformPhaseId =
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
  | "BUS-12"
  | "BUS-13"
  | "BUS-14"
  | "BUS-15"
  | "BUS-16";

export type ExecutiveOkrPlatformPhaseEntry = Readonly<{
  readonly phaseId: ExecutiveOkrPlatformPhaseId;
  readonly phaseName: string;
  readonly order: number;
  readonly status: ExecutiveOkrPlatformFreezeStatus;
  readonly metadataOnly: boolean;
  readonly immutable: boolean;
}>;

export type ExecutiveOkrPlatformPublicApiEntry = Readonly<{
  readonly apiName: string;
  readonly phaseId: ExecutiveOkrPlatformPhaseId;
  readonly stable: boolean;
  readonly metadataOnly: boolean;
}>;

export type ExecutiveOkrPlatformDependencyEntry = Readonly<{
  readonly dependencyId: string;
  readonly sourcePhaseId: ExecutiveOkrPlatformPhaseId;
  readonly required: boolean;
  readonly metadataOnly: boolean;
  readonly immutable: boolean;
}>;

export type ExecutiveOkrPlatformConsumerEntry = Readonly<{
  readonly consumerId: string;
  readonly consumerName: string;
  readonly scope: "metadata-only";
  readonly metadataOnly: boolean;
  readonly immutable: boolean;
}>;

export type ExecutiveOkrPlatformExtensionPolicy = Readonly<{
  readonly policyId: "executive-okr-platform-freeze-extension-policy";
  readonly allowsFutureBusPhases: boolean;
  readonly requiresPublicApiConsumption: boolean;
  readonly allowsOkrExecution: false;
  readonly allowsRuntimeExecution: false;
  readonly allowsPersistence: false;
  readonly allowsNetwork: false;
  readonly metadataOnly: boolean;
  readonly immutable: boolean;
}>;

export type ExecutiveOkrPlatformCompatibility = Readonly<{
  readonly compatibilityId: string;
  readonly targetLayer: string;
  readonly compatibilityStatus: "Compatible" | "Consumer Safe" | "Future Compatible" | "Metadata Only";
  readonly metadataOnly: boolean;
  readonly immutable: boolean;
}>;

export type ExecutiveOkrPlatformRelease = Readonly<{
  readonly releaseId: "executive-okr-platform-freeze";
  readonly releaseName: "Executive OKR Platform Certification & Freeze";
  readonly releaseVersion: "BUS-16";
  readonly certificationTimestamp: "deterministic-certification-metadata";
  readonly certificationStatus: "Certified";
  readonly freezeStatus: "Frozen";
  readonly releaseStatus: "Released";
  readonly metadataOnly: boolean;
  readonly immutable: boolean;
}>;

export type ExecutiveOkrPlatformCertificationGate = Readonly<{
  readonly gateId: string;
  readonly gateName: string;
  readonly passed: boolean;
  readonly diagnostics: readonly string[];
}>;

export type ExecutiveOkrPlatformCertification = Readonly<{
  readonly status: "PASS" | "FAIL";
  readonly gates: readonly ExecutiveOkrPlatformCertificationGate[];
  readonly diagnostics: readonly string[];
  readonly metadataOnly: boolean;
  readonly deterministic: boolean;
}>;

export type ExecutiveOkrPlatformRegressionEntry = Readonly<{
  readonly regressionId: string;
  readonly phaseId: ExecutiveOkrPlatformPhaseId;
  readonly coveredPublicApis: readonly string[];
  readonly status: "PASS" | "FAIL";
  readonly metadataOnly: boolean;
}>;

export type ExecutiveOkrPlatformRegression = Readonly<{
  readonly status: "PASS" | "FAIL";
  readonly entries: readonly ExecutiveOkrPlatformRegressionEntry[];
  readonly totalEntries: number;
  readonly passedEntries: number;
  readonly failedEntries: number;
  readonly metadataOnly: boolean;
}>;

export type ExecutiveOkrPlatformFreezeMetadata = Readonly<{
  readonly platformId: "BUS-OKR";
  readonly phaseId: "BUS-16";
  readonly version: "1.0.0";
  readonly state: "Certified Frozen Released";
  readonly metadataOnly: boolean;
  readonly immutable: boolean;
}>;

export type ExecutiveOkrPlatformFreezeManifest = Readonly<{
  readonly platformIdentity: ExecutiveOkrPlatformIdentity;
  readonly phaseRegistry: readonly ExecutiveOkrPlatformPhaseEntry[];
  readonly publicApiRegistry: readonly ExecutiveOkrPlatformPublicApiEntry[];
  readonly dependencyRegistry: readonly ExecutiveOkrPlatformDependencyEntry[];
  readonly consumerRegistry: readonly ExecutiveOkrPlatformConsumerEntry[];
  readonly compatibilityMatrix: readonly ExecutiveOkrPlatformCompatibility[];
  readonly extensionPolicy: ExecutiveOkrPlatformExtensionPolicy;
  readonly releaseMetadata: ExecutiveOkrPlatformRelease;
  readonly certificationGateCount: number;
  readonly regressionEntryCount: number;
  readonly deterministicFingerprint: string;
  readonly metadataOnly: boolean;
  readonly immutable: boolean;
}>;

export type ExecutiveOkrPlatformFreezeState = Readonly<{
  readonly status: "PASS" | "FAIL";
  readonly finalState: "Certified Frozen Released" | "Certification Failed";
  readonly manifest: ExecutiveOkrPlatformFreezeManifest;
  readonly certification: ExecutiveOkrPlatformCertification;
  readonly regression: ExecutiveOkrPlatformRegression;
  readonly frozenPhaseIds: readonly ExecutiveOkrPlatformPhaseId[];
  readonly publicApis: readonly string[];
  readonly metadataOnly: boolean;
  readonly immutable: boolean;
}>;

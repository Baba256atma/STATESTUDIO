export type ExecutiveStrategyPlatformFreezeStatus = "Certified" | "Frozen" | "Released" | "Failed";

export type ExecutiveStrategyPlatformIdentity = Readonly<{
  readonly platformId: "BUS-STRAT";
  readonly platformName: "Executive Strategy Platform";
  readonly version: "1.0.0";
  readonly certificationPhaseId: "BUS-26";
  readonly state: "Certified Frozen Released";
  readonly metadataOnly: boolean;
  readonly immutable: boolean;
}>;

export type ExecutiveStrategyPlatformPhaseEntry = Readonly<{
  readonly phaseId:
    | "BUS-17"
    | "BUS-18"
    | "BUS-19"
    | "BUS-20"
    | "BUS-21"
    | "BUS-22"
    | "BUS-23"
    | "BUS-24"
    | "BUS-25"
    | "BUS-26";
  readonly phaseName: string;
  readonly order: number;
  readonly status: ExecutiveStrategyPlatformFreezeStatus;
  readonly metadataOnly: boolean;
  readonly immutable: boolean;
}>;

export type ExecutiveStrategyPlatformPublicApiEntry = Readonly<{
  readonly apiName: string;
  readonly phaseId: ExecutiveStrategyPlatformPhaseEntry["phaseId"];
  readonly stable: boolean;
  readonly metadataOnly: boolean;
}>;

export type ExecutiveStrategyPlatformDependencyEntry = Readonly<{
  readonly dependencyId: string;
  readonly sourcePhaseId: ExecutiveStrategyPlatformPhaseEntry["phaseId"];
  readonly targetPlatform: string;
  readonly dependencyStatus: "Compatible" | "Certified" | "Metadata Only";
  readonly metadataOnly: boolean;
  readonly immutable: boolean;
}>;

export type ExecutiveStrategyPlatformConsumerEntry = Readonly<{
  readonly consumerId: string;
  readonly consumerName: string;
  readonly consumerType: "Current" | "Future";
  readonly metadataOnly: boolean;
  readonly immutable: boolean;
}>;

export type ExecutiveStrategyPlatformCompatibilityEntry = Readonly<{
  readonly compatibilityId: string;
  readonly targetPlatform: string;
  readonly compatibilityStatus: "Compatible" | "Consumer Safe" | "Future Compatible" | "Metadata Only";
  readonly metadataOnly: boolean;
  readonly immutable: boolean;
}>;

export type ExecutiveStrategyPlatformExtensionPolicy = Readonly<{
  readonly allowsFutureBusPhases: boolean;
  readonly requiresPublicApiConsumption: boolean;
  readonly allowsStrategyExecution: false;
  readonly allowsRuntimeExecution: false;
  readonly allowsPersistence: false;
  readonly allowsSimulationExecution: false;
  readonly policyId: "executive-strategy-platform-freeze-extension-policy";
  readonly metadataOnly: boolean;
  readonly immutable: boolean;
}>;

export type ExecutiveStrategyPlatformReleaseMetadata = Readonly<{
  readonly releaseId: "executive-strategy-platform-freeze";
  readonly releaseName: "Executive Strategy Platform Certification & Freeze";
  readonly releaseVersion: "BUS-26";
  readonly releaseDateMetadata: "deterministic-release-metadata";
  readonly certificationStatus: "Certified";
  readonly freezeStatus: "Frozen";
  readonly releaseStatus: "Released";
  readonly metadataOnly: boolean;
  readonly immutable: boolean;
}>;

export type ExecutiveStrategyPlatformCertificationGate = Readonly<{
  readonly gateId: string;
  readonly gateName: string;
  readonly passed: boolean;
  readonly diagnostics: readonly string[];
}>;

export type ExecutiveStrategyPlatformCertificationResult = Readonly<{
  readonly status: "PASS" | "FAIL";
  readonly gates: readonly ExecutiveStrategyPlatformCertificationGate[];
  readonly diagnostics: readonly string[];
  readonly metadataOnly: boolean;
  readonly deterministic: boolean;
}>;

export type ExecutiveStrategyPlatformRegressionEntry = Readonly<{
  readonly regressionId: string;
  readonly phaseId: ExecutiveStrategyPlatformPhaseEntry["phaseId"];
  readonly coveredPublicApis: readonly string[];
  readonly status: "PASS" | "FAIL";
  readonly metadataOnly: boolean;
}>;

export type ExecutiveStrategyPlatformRegressionResult = Readonly<{
  readonly status: "PASS" | "FAIL";
  readonly entries: readonly ExecutiveStrategyPlatformRegressionEntry[];
  readonly totalEntries: number;
  readonly passedEntries: number;
  readonly failedEntries: number;
  readonly metadataOnly: boolean;
}>;

export type ExecutiveStrategyPlatformFreezeManifest = Readonly<{
  readonly platformIdentity: ExecutiveStrategyPlatformIdentity;
  readonly phaseRegistry: readonly ExecutiveStrategyPlatformPhaseEntry[];
  readonly publicApiRegistry: readonly ExecutiveStrategyPlatformPublicApiEntry[];
  readonly dependencyRegistry: readonly ExecutiveStrategyPlatformDependencyEntry[];
  readonly consumerRegistry: readonly ExecutiveStrategyPlatformConsumerEntry[];
  readonly compatibilityMatrix: readonly ExecutiveStrategyPlatformCompatibilityEntry[];
  readonly extensionPolicy: ExecutiveStrategyPlatformExtensionPolicy;
  readonly releaseMetadata: ExecutiveStrategyPlatformReleaseMetadata;
  readonly certificationGateCount: number;
  readonly regressionEntryCount: number;
  readonly deterministicFingerprint: string;
  readonly metadataOnly: boolean;
  readonly immutable: boolean;
}>;

export type ExecutiveStrategyPlatformFreezeState = Readonly<{
  readonly status: "PASS" | "FAIL";
  readonly finalState: "Certified Frozen Released" | "Certification Failed";
  readonly manifest: ExecutiveStrategyPlatformFreezeManifest;
  readonly certification: ExecutiveStrategyPlatformCertificationResult;
  readonly regression: ExecutiveStrategyPlatformRegressionResult;
  readonly frozenPhaseIds: readonly string[];
  readonly publicApis: readonly string[];
  readonly metadataOnly: boolean;
  readonly immutable: boolean;
}>;

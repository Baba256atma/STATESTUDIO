export type ExecutiveLayerConnectionFreezeStatus = "PASS" | "FAIL";

export type ExecutiveLayerConnectionPhaseRegistryEntry = Readonly<{
  readonly phaseId: string;
  readonly name: string;
  readonly required: boolean;
  readonly certified: boolean;
}>;

export type ExecutiveLayerConnectionPublicApiEntry = Readonly<{
  readonly apiName: string;
  readonly phaseId: string;
  readonly stable: boolean;
}>;

export type ExecutiveLayerConnectionReleaseMetadata = Readonly<{
  readonly platformId: string;
  readonly platformVersion: "LAY-CONN-12";
  readonly releaseStage: "Certified Frozen Release";
  readonly metadataOnly: boolean;
  readonly immutable: boolean;
}>;

export type ExecutiveLayerConnectionCompatibilityEntry = Readonly<{
  readonly platformId: string;
  readonly compatible: boolean;
  readonly required: boolean;
  readonly mode: "certified" | "metadata-only";
  readonly notes: readonly string[];
}>;

export type ExecutiveLayerConnectionCompatibilityMatrix = readonly ExecutiveLayerConnectionCompatibilityEntry[];

export type ExecutiveLayerConnectionExtensionPolicy = Readonly<{
  readonly policyId: string;
  readonly extensionMode: "additive-only";
  readonly certifiedPhaseMutationAllowed: boolean;
  readonly runtimeBehaviorAllowed: boolean;
  readonly orchestrationAllowed: boolean;
  readonly executionLogicAllowed: boolean;
}>;

export type ExecutiveLayerConnectionCertificationGate = Readonly<{
  readonly gateId: string;
  readonly passed: boolean;
  readonly diagnostics: readonly string[];
}>;

export type ExecutiveLayerConnectionCertificationResult = Readonly<{
  readonly status: ExecutiveLayerConnectionFreezeStatus;
  readonly gates: readonly ExecutiveLayerConnectionCertificationGate[];
  readonly diagnostics: readonly string[];
}>;

export type ExecutiveLayerConnectionCertification = ExecutiveLayerConnectionCertificationResult;

export type ExecutiveLayerConnectionRegressionEntry = Readonly<{
  readonly phaseId: string;
  readonly passed: boolean;
  readonly diagnostics: readonly string[];
}>;

export type ExecutiveLayerConnectionRegression = Readonly<{
  readonly status: ExecutiveLayerConnectionFreezeStatus;
  readonly entries: readonly ExecutiveLayerConnectionRegressionEntry[];
  readonly diagnostics: readonly string[];
}>;

export type ExecutiveLayerConnectionFreezeState = Readonly<{
  readonly platformId: string;
  readonly status: "Frozen" | "Not Frozen";
  readonly certificationStatus: ExecutiveLayerConnectionFreezeStatus;
  readonly regressionStatus: ExecutiveLayerConnectionFreezeStatus;
  readonly immutable: boolean;
  readonly declaration: string;
}>;

export type ExecutiveLayerConnectionFreezeManifest = Readonly<{
  readonly platformId: string;
  readonly platformVersion: "LAY-CONN-12";
  readonly certifiedPhases: readonly ExecutiveLayerConnectionPhaseRegistryEntry[];
  readonly publicApis: readonly ExecutiveLayerConnectionPublicApiEntry[];
  readonly compatibilityMatrix: ExecutiveLayerConnectionCompatibilityMatrix;
  readonly dependencies: readonly string[];
  readonly extensionPolicy: ExecutiveLayerConnectionExtensionPolicy;
  readonly releaseMetadata: ExecutiveLayerConnectionReleaseMetadata;
  readonly certificationResult: ExecutiveLayerConnectionCertificationResult;
  readonly freezeState: ExecutiveLayerConnectionFreezeState;
  readonly deterministicFingerprint: string;
}>;

export type ExecutiveLayerConnectionPlatformFreeze = Readonly<{
  readonly platformId: string;
  readonly releaseMetadata: ExecutiveLayerConnectionReleaseMetadata;
  readonly phaseRegistry: readonly ExecutiveLayerConnectionPhaseRegistryEntry[];
  readonly publicApiRegistry: readonly ExecutiveLayerConnectionPublicApiEntry[];
  readonly compatibilityMatrix: ExecutiveLayerConnectionCompatibilityMatrix;
  readonly extensionPolicy: ExecutiveLayerConnectionExtensionPolicy;
}>;

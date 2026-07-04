export type ExecutiveJudgmentPlatformFreezeStatus = "PASS" | "FAIL";

export type ExecutiveJudgmentPlatformFreezeIdentity = Readonly<{
  platformId: "APP-JUDGE";
  platformName: "Executive Judgment Platform";
  platformVersion: "APP-JUDGE-10";
  releaseVersion: "executive-judgment-platform.freeze.v1";
  certified: true;
  frozen: true;
  released: true;
  metadataOnly: true;
}>;

export type ExecutiveJudgmentPlatformFreezePhase = Readonly<{
  phaseId:
    | "APP-JUDGE-1"
    | "APP-JUDGE-2"
    | "APP-JUDGE-3"
    | "APP-JUDGE-4"
    | "APP-JUDGE-5"
    | "APP-JUDGE-6"
    | "APP-JUDGE-7"
    | "APP-JUDGE-8"
    | "APP-JUDGE-9"
    | "APP-JUDGE-10";
  title: string;
  order: number;
  status: "certified" | "frozen";
  metadataOnly: true;
}>;

export type ExecutiveJudgmentPlatformFreezePublicApi = Readonly<{
  apiName: string;
  phaseId: ExecutiveJudgmentPlatformFreezePhase["phaseId"];
  stable: true;
  metadataOnly: true;
}>;

export type ExecutiveJudgmentPlatformCompatibilityEntry = Readonly<{
  target: string;
  compatibility: "compatible" | "future-compatible";
  boundary: "public-api" | "metadata-contract" | "future-extension";
  runtimeDependency: false;
}>;

export type ExecutiveJudgmentPlatformExtensionPolicy = Readonly<{
  allowsNewEngines: false;
  allowsNewJudgmentLogic: false;
  allowsRecommendations: false;
  allowsCoaching: false;
  allowsExplanationLogic: false;
  allowsLlmCalls: false;
  allowsUiBehavior: false;
  allowsStorageWrites: false;
  allowsNetworkCalls: false;
  requiresReadOnlyCertification: true;
  policy: "certified-frozen-metadata-only";
}>;

export type ExecutiveJudgmentPlatformFreezeManifest = Readonly<{
  platformIdentity: ExecutiveJudgmentPlatformFreezeIdentity;
  certifiedComponents: readonly ExecutiveJudgmentPlatformFreezePhase[];
  certifiedApis: readonly ExecutiveJudgmentPlatformFreezePublicApi[];
  certifiedPipeline: readonly string[];
  dependencyMatrix: readonly Readonly<{ phaseId: string; consumes: readonly string[] }>[];
  compatibilityMatrix: readonly ExecutiveJudgmentPlatformCompatibilityEntry[];
  extensionPolicy: ExecutiveJudgmentPlatformExtensionPolicy;
  releaseMetadata: Readonly<{
    declaration: "CERTIFIED_FROZEN_RELEASED";
    nextPhase: "Nexora Executive Intelligence Architecture Integration";
    deterministic: true;
    immutable: true;
    metadataOnly: true;
  }>;
  manifestFingerprint: string;
}>;

export type ExecutiveJudgmentPlatformCertificationGate = Readonly<{
  gateId: string;
  description: string;
  passed: boolean;
}>;

export type ExecutiveJudgmentPlatformCertificationResult = Readonly<{
  status: ExecutiveJudgmentPlatformFreezeStatus;
  gates: readonly ExecutiveJudgmentPlatformCertificationGate[];
  diagnostics: readonly string[];
  metadataOnly: true;
}>;

export type ExecutiveJudgmentPlatformRegressionEntry = Readonly<{
  regressionId: string;
  description: string;
  passed: boolean;
  metadataOnly: true;
}>;

export type ExecutiveJudgmentPlatformRegressionResult = Readonly<{
  status: ExecutiveJudgmentPlatformFreezeStatus;
  entries: readonly ExecutiveJudgmentPlatformRegressionEntry[];
  total: number;
  passed: number;
  failed: number;
  metadataOnly: true;
}>;

export type ExecutiveJudgmentPlatformFreezeState = Readonly<{
  status: ExecutiveJudgmentPlatformFreezeStatus;
  manifest: ExecutiveJudgmentPlatformFreezeManifest;
  certification: ExecutiveJudgmentPlatformCertificationResult;
  regression: ExecutiveJudgmentPlatformRegressionResult;
  declaration: "CERTIFIED_FROZEN_RELEASED";
  metadataOnly: true;
}>;

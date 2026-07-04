import type { ExecutiveContextCertificationStatus, ExecutiveContextRegressionResult } from "./executiveContextCertificationIndex.ts";

export type ExecutiveContextPlatformIdentity = Readonly<{
  platformId: "nexora-executive-context-platform";
  platformName: "Nexora Executive Context Platform";
  layerId: "APP-CTX";
  version: "APP-CTX-4";
  releaseStage: "frozen";
  metadataOnly: true;
  runtimeBehavior: false;
}>;

export type ExecutiveContextPlatformPhaseRegistryEntry = Readonly<{
  phaseId: "APP-CTX-1" | "APP-CTX-2" | "APP-CTX-3" | "APP-CTX-4";
  title: string;
  status: "certified" | "frozen";
  order: number;
  metadataOnly: true;
}>;

export type ExecutiveContextPlatformPublicApiEntry = Readonly<{
  apiName: string;
  phaseId: ExecutiveContextPlatformPhaseRegistryEntry["phaseId"];
  category: "builder" | "query" | "certification" | "freeze";
  stable: true;
  metadataOnly: true;
}>;

export type ExecutiveContextPlatformCompatibilityEntry = Readonly<{
  targetLayer: string;
  targetName: string;
  compatibility: "compatible" | "consumer-compatible" | "future-compatible";
  boundary: "public-api" | "metadata-contract" | "future-extension";
  notes: string;
  runtimeDependency: false;
}>;

export type ExecutiveContextPlatformExtensionPolicy = Readonly<{
  allowsNewContextSections: true;
  allowsNewInspectionUtilities: true;
  allowsExecutiveReasoning: false;
  allowsRecommendations: false;
  allowsDecisionEngine: false;
  allowsJudgment: false;
  allowsScenarioGeneration: false;
  allowsSimulationExecution: false;
  allowsPlanning: false;
  allowsOptimization: false;
  allowsRanking: false;
  allowsScoring: false;
  allowsInference: false;
  allowsLlmPrompting: false;
  allowsAiLogic: false;
  allowsAutomaticAnalysis: false;
  allowsRuntimeExecution: false;
  allowsRuntimeMutation: false;
  requiresPublicApiConsumption: true;
  policy: "immutable-context-metadata-only";
}>;

export type ExecutiveContextPlatformReleaseMetadata = Readonly<{
  releaseId: "app-ctx-executive-context-platform-freeze";
  releaseName: "APP-CTX Executive Context Platform Freeze";
  releaseVersion: "APP-CTX-4";
  certificationDependency: "APP-CTX-3";
  regressionDependency: "APP-CTX regression";
  immutable: true;
  deterministic: true;
}>;

export type ExecutiveContextPlatformManifest = Readonly<{
  platformIdentity: ExecutiveContextPlatformIdentity;
  phaseRegistry: readonly ExecutiveContextPlatformPhaseRegistryEntry[];
  publicApiRegistry: readonly ExecutiveContextPlatformPublicApiEntry[];
  compatibilityMatrix: readonly ExecutiveContextPlatformCompatibilityEntry[];
  extensionPolicy: ExecutiveContextPlatformExtensionPolicy;
  releaseMetadata: ExecutiveContextPlatformReleaseMetadata;
  certificationDependency: ExecutiveContextCertificationStatus;
  regressionDependency: ExecutiveContextCertificationStatus;
  fingerprint: string;
  immutable: true;
  deterministic: true;
  metadataOnly: true;
}>;

export type ExecutiveContextPlatformFreezeState = Readonly<{
  status: ExecutiveContextCertificationStatus;
  manifest: ExecutiveContextPlatformManifest;
  certificationStatus: ExecutiveContextCertificationStatus;
  regression: ExecutiveContextRegressionResult;
  checks: readonly Readonly<{
    checkId: string;
    passed: boolean;
    description: string;
  }>[];
}>;

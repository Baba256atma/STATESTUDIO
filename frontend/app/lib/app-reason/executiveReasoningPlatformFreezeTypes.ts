import type { ExecutiveReasoningCertificationStatus, ExecutiveReasoningRegressionResult } from "./executiveReasoningCertificationIndex.ts";

export type ExecutiveReasoningPlatformIdentity = Readonly<{
  platformId: "nexora-executive-reasoning-platform";
  platformName: "Nexora Executive Reasoning Platform";
  layerId: "APP-REASON";
  version: "APP-REASON-4";
  releaseStage: "frozen";
  metadataOnly: true;
  runtimeBehavior: false;
}>;

export type ExecutiveReasoningPlatformPhaseRegistryEntry = Readonly<{
  phaseId: "APP-REASON-1" | "APP-REASON-2" | "APP-REASON-3" | "APP-REASON-4";
  title: string;
  status: "certified" | "frozen";
  order: number;
  metadataOnly: true;
}>;

export type ExecutiveReasoningPlatformPublicApiEntry = Readonly<{
  apiName: string;
  phaseId: ExecutiveReasoningPlatformPhaseRegistryEntry["phaseId"];
  category: "foundation" | "query" | "certification" | "freeze";
  stable: true;
  metadataOnly: true;
}>;

export type ExecutiveReasoningPlatformCompatibilityEntry = Readonly<{
  targetLayer: string;
  targetName: string;
  compatibility: "compatible" | "consumer-compatible" | "future-compatible";
  boundary: "public-api" | "metadata-contract" | "future-extension";
  notes: string;
  runtimeDependency: false;
}>;

export type ExecutiveReasoningPlatformExtensionPolicy = Readonly<{
  allowsNewReasoningContracts: true;
  allowsNewInspectionUtilities: true;
  allowsExecutiveReasoningExecution: false;
  allowsRecommendations: false;
  allowsDecisionMaking: false;
  allowsJudgment: false;
  allowsPlanning: false;
  allowsOptimization: false;
  allowsRanking: false;
  allowsScoring: false;
  allowsInference: false;
  allowsAnalysis: false;
  allowsSimulation: false;
  allowsScenarioGeneration: false;
  allowsLlmPrompting: false;
  allowsAiLogic: false;
  allowsAutomaticConclusions: false;
  allowsRuntimeExecution: false;
  allowsRuntimeMutation: false;
  requiresPublicApiConsumption: true;
  policy: "immutable-reasoning-metadata-only";
}>;

export type ExecutiveReasoningPlatformReleaseMetadata = Readonly<{
  releaseId: "app-reason-executive-reasoning-platform-freeze";
  releaseName: "APP-REASON Executive Reasoning Platform Freeze";
  releaseVersion: "APP-REASON-4";
  certificationDependency: "APP-REASON-3";
  regressionDependency: "APP-REASON regression";
  immutable: true;
  deterministic: true;
}>;

export type ExecutiveReasoningPlatformManifest = Readonly<{
  platformIdentity: ExecutiveReasoningPlatformIdentity;
  phaseRegistry: readonly ExecutiveReasoningPlatformPhaseRegistryEntry[];
  publicApiRegistry: readonly ExecutiveReasoningPlatformPublicApiEntry[];
  compatibilityMatrix: readonly ExecutiveReasoningPlatformCompatibilityEntry[];
  extensionPolicy: ExecutiveReasoningPlatformExtensionPolicy;
  releaseMetadata: ExecutiveReasoningPlatformReleaseMetadata;
  certificationDependency: ExecutiveReasoningCertificationStatus;
  regressionDependency: ExecutiveReasoningCertificationStatus;
  fingerprint: string;
  immutable: true;
  deterministic: true;
  metadataOnly: true;
}>;

export type ExecutiveReasoningPlatformFreezeState = Readonly<{
  status: ExecutiveReasoningCertificationStatus;
  manifest: ExecutiveReasoningPlatformManifest;
  certificationStatus: ExecutiveReasoningCertificationStatus;
  regression: ExecutiveReasoningRegressionResult;
  checks: readonly Readonly<{
    checkId: string;
    passed: boolean;
    description: string;
  }>[];
}>;

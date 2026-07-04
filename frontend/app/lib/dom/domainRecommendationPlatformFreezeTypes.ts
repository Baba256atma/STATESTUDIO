import type {
  DomainRecommendationCertificationStatus,
  DomainRecommendationRegressionResult,
} from "./domainRecommendationCertificationIndex.ts";

export type DomainRecommendationFreezeStatus = "PASS" | "FAIL";

export type DomainRecommendationPlatformIdentity = Readonly<{
  platformId: "nexora-domain-recommendation-contract-platform";
  platformName: "Nexora Domain Recommendation Contract Platform";
  layerId: "DOM";
  phaseId: "DOM-7";
  version: "DOM-7:4";
  releaseStage: "frozen";
  metadataOnly: true;
  runtimeBehavior: false;
  recommendationGeneration: false;
}>;

export type DomainRecommendationPhaseRegistryEntry = Readonly<{
  phaseId: "DOM-7:1" | "DOM-7:2" | "DOM-7:3" | "DOM-7:4";
  title: string;
  status: "certified" | "frozen";
  order: number;
  behaviorAdded: boolean;
  metadataOnly: true;
}>;

export type DomainRecommendationPublicApiEntry = Readonly<{
  apiName: string;
  phaseId: DomainRecommendationPhaseRegistryEntry["phaseId"];
  category: "foundation" | "query" | "certification" | "freeze";
  stable: true;
  metadataOnly: true;
}>;

export type DomainRecommendationCompatibilityEntry = Readonly<{
  targetLayer: string;
  targetName: string;
  compatibility: "compatible" | "consumer-compatible" | "future-compatible";
  boundary: "public-api" | "metadata-contract" | "future-extension";
  notes: string;
  runtimeDependency: false;
}>;

export type DomainRecommendationExtensionPolicy = Readonly<{
  allowsNewRecommendationPackages: true;
  allowsNewQueryUtilities: false;
  allowsRecommendationEngine: false;
  allowsExecutiveJudgment: false;
  allowsReasoningEngine: false;
  allowsDecisionMaking: false;
  allowsLlmPrompting: false;
  allowsAiLogic: false;
  allowsRuntimeInference: false;
  allowsSimulation: false;
  allowsPlanning: false;
  allowsOptimization: false;
  allowsRanking: false;
  allowsScoring: false;
  allowsRuntimeExecution: false;
  allowsRuntimeStateMutation: false;
  requiresPublicApiConsumption: true;
  requiresCertificationForMutation: true;
  policy: "metadata-extension-only";
}>;

export type DomainRecommendationReleaseMetadata = Readonly<{
  releaseId: "dom-7-recommendation-contract-platform-freeze";
  releaseName: "DOM-7 Domain Recommendation Contract Platform Freeze";
  releaseVersion: "DOM-7:4";
  certificationDependency: "DOM-7:3";
  regressionDependency: "DOM-7 regression";
  immutable: true;
  deterministic: true;
}>;

export type DomainRecommendationPlatformFreezeManifest = Readonly<{
  platformIdentity: DomainRecommendationPlatformIdentity;
  phaseRegistry: readonly DomainRecommendationPhaseRegistryEntry[];
  publicApiRegistry: readonly DomainRecommendationPublicApiEntry[];
  compatibilityMatrix: readonly DomainRecommendationCompatibilityEntry[];
  extensionPolicy: DomainRecommendationExtensionPolicy;
  releaseMetadata: DomainRecommendationReleaseMetadata;
  certificationStatus: DomainRecommendationCertificationStatus;
  regressionStatus: DomainRecommendationFreezeStatus;
  fingerprint: string;
  immutable: true;
  deterministic: true;
  metadataOnly: true;
}>;

export type DomainRecommendationFreezeResult = Readonly<{
  status: DomainRecommendationFreezeStatus;
  manifest: DomainRecommendationPlatformFreezeManifest;
  certificationStatus: DomainRecommendationCertificationStatus;
  regression: DomainRecommendationRegressionResult;
  checks: readonly Readonly<{
    checkId: string;
    passed: boolean;
    description: string;
  }>[];
}>;

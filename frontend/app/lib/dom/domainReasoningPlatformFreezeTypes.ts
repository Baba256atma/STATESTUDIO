import type {
  DomainReasoningCertificationStatus,
  DomainReasoningRegressionResult,
} from "./domainReasoningCertificationIndex.ts";

export type DomainReasoningFreezeStatus = "PASS" | "FAIL";

export type DomainReasoningPlatformIdentity = Readonly<{
  platformId: "nexora-domain-reasoning-contract-platform";
  platformName: "Nexora Domain Reasoning Contract Platform";
  layerId: "DOM";
  phaseId: "DOM-6";
  version: "DOM-6:4";
  releaseStage: "frozen";
  metadataOnly: true;
  runtimeBehavior: false;
  reasoningExecution: false;
}>;

export type DomainReasoningPhaseRegistryEntry = Readonly<{
  phaseId: "DOM-6:1" | "DOM-6:2" | "DOM-6:3" | "DOM-6:4";
  title: string;
  status: "certified" | "frozen";
  order: number;
  behaviorAdded: boolean;
  metadataOnly: true;
}>;

export type DomainReasoningPublicApiEntry = Readonly<{
  apiName: string;
  phaseId: DomainReasoningPhaseRegistryEntry["phaseId"];
  category: "foundation" | "query" | "certification" | "freeze";
  stable: true;
  metadataOnly: true;
}>;

export type DomainReasoningCompatibilityEntry = Readonly<{
  targetLayer: string;
  targetName: string;
  compatibility: "compatible" | "consumer-compatible" | "future-compatible";
  boundary: "public-api" | "metadata-contract" | "future-extension";
  notes: string;
  runtimeDependency: false;
}>;

export type DomainReasoningExtensionPolicy = Readonly<{
  allowsNewReasoningPackages: true;
  allowsNewQueryUtilities: false;
  allowsReasoningEngine: false;
  allowsExecutiveJudgment: false;
  allowsRecommendations: false;
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

export type DomainReasoningReleaseMetadata = Readonly<{
  releaseId: "dom-6-reasoning-contract-platform-freeze";
  releaseName: "DOM-6 Domain Reasoning Contract Platform Freeze";
  releaseVersion: "DOM-6:4";
  certificationDependency: "DOM-6:3";
  regressionDependency: "DOM-6 regression";
  immutable: true;
  deterministic: true;
}>;

export type DomainReasoningPlatformFreezeManifest = Readonly<{
  platformIdentity: DomainReasoningPlatformIdentity;
  phaseRegistry: readonly DomainReasoningPhaseRegistryEntry[];
  publicApiRegistry: readonly DomainReasoningPublicApiEntry[];
  compatibilityMatrix: readonly DomainReasoningCompatibilityEntry[];
  extensionPolicy: DomainReasoningExtensionPolicy;
  releaseMetadata: DomainReasoningReleaseMetadata;
  certificationStatus: DomainReasoningCertificationStatus;
  regressionStatus: DomainReasoningFreezeStatus;
  fingerprint: string;
  immutable: true;
  deterministic: true;
  metadataOnly: true;
}>;

export type DomainReasoningFreezeResult = Readonly<{
  status: DomainReasoningFreezeStatus;
  manifest: DomainReasoningPlatformFreezeManifest;
  certificationStatus: DomainReasoningCertificationStatus;
  regression: DomainReasoningRegressionResult;
  checks: readonly Readonly<{
    checkId: string;
    passed: boolean;
    description: string;
  }>[];
}>;

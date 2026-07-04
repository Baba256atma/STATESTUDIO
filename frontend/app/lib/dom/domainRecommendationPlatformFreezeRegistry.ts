import {
  DOMAIN_RECOMMENDATION_CERTIFICATION_PUBLIC_APIS,
  DOMAIN_RECOMMENDATION_QUERY_PUBLIC_APIS,
} from "./domainRecommendationCertificationIndex.ts";
import { DOMAIN_RECOMMENDATION_PUBLIC_APIS } from "./domainRecommendationIndex.ts";
import type {
  DomainRecommendationExtensionPolicy,
  DomainRecommendationPhaseRegistryEntry,
  DomainRecommendationPlatformIdentity,
  DomainRecommendationPublicApiEntry,
  DomainRecommendationReleaseMetadata,
} from "./domainRecommendationPlatformFreezeTypes.ts";

export const DOMAIN_RECOMMENDATION_PLATFORM_IDENTITY: DomainRecommendationPlatformIdentity = Object.freeze({
  platformId: "nexora-domain-recommendation-contract-platform",
  platformName: "Nexora Domain Recommendation Contract Platform",
  layerId: "DOM",
  phaseId: "DOM-7",
  version: "DOM-7:4",
  releaseStage: "frozen",
  metadataOnly: true,
  runtimeBehavior: false,
  recommendationGeneration: false,
});

export const DOMAIN_RECOMMENDATION_PHASE_REGISTRY: readonly DomainRecommendationPhaseRegistryEntry[] = Object.freeze([
  Object.freeze({
    phaseId: "DOM-7:1",
    title: "Domain Recommendation Contract Foundation",
    status: "certified",
    order: 1,
    behaviorAdded: false,
    metadataOnly: true,
  }),
  Object.freeze({
    phaseId: "DOM-7:2",
    title: "Domain Recommendation Query Layer",
    status: "certified",
    order: 2,
    behaviorAdded: false,
    metadataOnly: true,
  }),
  Object.freeze({
    phaseId: "DOM-7:3",
    title: "Domain Recommendation Certification & Export Layer",
    status: "certified",
    order: 3,
    behaviorAdded: false,
    metadataOnly: true,
  }),
  Object.freeze({
    phaseId: "DOM-7:4",
    title: "Domain Recommendation Platform Freeze",
    status: "frozen",
    order: 4,
    behaviorAdded: false,
    metadataOnly: true,
  }),
]);

export const DOMAIN_RECOMMENDATION_RELEASE_METADATA: DomainRecommendationReleaseMetadata = Object.freeze({
  releaseId: "dom-7-recommendation-contract-platform-freeze",
  releaseName: "DOM-7 Domain Recommendation Contract Platform Freeze",
  releaseVersion: "DOM-7:4",
  certificationDependency: "DOM-7:3",
  regressionDependency: "DOM-7 regression",
  immutable: true,
  deterministic: true,
});

export const DOMAIN_RECOMMENDATION_EXTENSION_POLICY: DomainRecommendationExtensionPolicy = Object.freeze({
  allowsNewRecommendationPackages: true,
  allowsNewQueryUtilities: false,
  allowsRecommendationEngine: false,
  allowsExecutiveJudgment: false,
  allowsReasoningEngine: false,
  allowsDecisionMaking: false,
  allowsLlmPrompting: false,
  allowsAiLogic: false,
  allowsRuntimeInference: false,
  allowsSimulation: false,
  allowsPlanning: false,
  allowsOptimization: false,
  allowsRanking: false,
  allowsScoring: false,
  allowsRuntimeExecution: false,
  allowsRuntimeStateMutation: false,
  requiresPublicApiConsumption: true,
  requiresCertificationForMutation: true,
  policy: "metadata-extension-only",
});

const FREEZE_PUBLIC_APIS = Object.freeze([
  "DomainRecommendationPlatformFreeze",
  "buildDomainRecommendationPlatformFreezeManifest",
  "isDomainRecommendationPlatformFreezeManifestValid",
  "runDomainRecommendationPlatformFreeze",
  "getDomainRecommendationPlatformFreezeState",
  "getDomainRecommendationPlatformCompatibilityMatrix",
  "isDomainRecommendationCompatibilityMatrixValid",
  "listDomainRecommendationPlatformPhases",
  "listDomainRecommendationPlatformPublicApis",
] as const);

function apiEntry(
  apiName: string,
  phaseId: DomainRecommendationPublicApiEntry["phaseId"],
  category: DomainRecommendationPublicApiEntry["category"]
): DomainRecommendationPublicApiEntry {
  return Object.freeze({
    apiName,
    phaseId,
    category,
    stable: true,
    metadataOnly: true,
  });
}

export const DOMAIN_RECOMMENDATION_PUBLIC_API_REGISTRY: readonly DomainRecommendationPublicApiEntry[] = Object.freeze([
  ...DOMAIN_RECOMMENDATION_PUBLIC_APIS.map((apiName) => apiEntry(apiName, "DOM-7:1", "foundation")),
  ...DOMAIN_RECOMMENDATION_QUERY_PUBLIC_APIS.map((apiName) => apiEntry(apiName, "DOM-7:2", "query")),
  ...DOMAIN_RECOMMENDATION_CERTIFICATION_PUBLIC_APIS.map((apiName) => apiEntry(apiName, "DOM-7:3", "certification")),
  ...FREEZE_PUBLIC_APIS.map((apiName) => apiEntry(apiName, "DOM-7:4", "freeze")),
]);

export function listDomainRecommendationPlatformPhases(): readonly DomainRecommendationPhaseRegistryEntry[] {
  return DOMAIN_RECOMMENDATION_PHASE_REGISTRY;
}

export function listDomainRecommendationPlatformPublicApis(): readonly DomainRecommendationPublicApiEntry[] {
  return DOMAIN_RECOMMENDATION_PUBLIC_API_REGISTRY;
}

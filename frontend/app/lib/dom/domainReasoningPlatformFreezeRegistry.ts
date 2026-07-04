import {
  DOMAIN_REASONING_CERTIFICATION_PUBLIC_APIS,
  DOMAIN_REASONING_QUERY_PUBLIC_APIS,
} from "./domainReasoningCertificationIndex.ts";
import { DOMAIN_REASONING_PUBLIC_APIS } from "./domainReasoningIndex.ts";
import type {
  DomainReasoningExtensionPolicy,
  DomainReasoningPhaseRegistryEntry,
  DomainReasoningPlatformIdentity,
  DomainReasoningPublicApiEntry,
  DomainReasoningReleaseMetadata,
} from "./domainReasoningPlatformFreezeTypes.ts";

export const DOMAIN_REASONING_PLATFORM_IDENTITY: DomainReasoningPlatformIdentity = Object.freeze({
  platformId: "nexora-domain-reasoning-contract-platform",
  platformName: "Nexora Domain Reasoning Contract Platform",
  layerId: "DOM",
  phaseId: "DOM-6",
  version: "DOM-6:4",
  releaseStage: "frozen",
  metadataOnly: true,
  runtimeBehavior: false,
  reasoningExecution: false,
});

export const DOMAIN_REASONING_PHASE_REGISTRY: readonly DomainReasoningPhaseRegistryEntry[] = Object.freeze([
  Object.freeze({
    phaseId: "DOM-6:1",
    title: "Domain Reasoning Contract Foundation",
    status: "certified",
    order: 1,
    behaviorAdded: false,
    metadataOnly: true,
  }),
  Object.freeze({
    phaseId: "DOM-6:2",
    title: "Domain Reasoning Query Layer",
    status: "certified",
    order: 2,
    behaviorAdded: false,
    metadataOnly: true,
  }),
  Object.freeze({
    phaseId: "DOM-6:3",
    title: "Domain Reasoning Certification & Export Layer",
    status: "certified",
    order: 3,
    behaviorAdded: false,
    metadataOnly: true,
  }),
  Object.freeze({
    phaseId: "DOM-6:4",
    title: "Domain Reasoning Platform Freeze",
    status: "frozen",
    order: 4,
    behaviorAdded: false,
    metadataOnly: true,
  }),
]);

export const DOMAIN_REASONING_RELEASE_METADATA: DomainReasoningReleaseMetadata = Object.freeze({
  releaseId: "dom-6-reasoning-contract-platform-freeze",
  releaseName: "DOM-6 Domain Reasoning Contract Platform Freeze",
  releaseVersion: "DOM-6:4",
  certificationDependency: "DOM-6:3",
  regressionDependency: "DOM-6 regression",
  immutable: true,
  deterministic: true,
});

export const DOMAIN_REASONING_EXTENSION_POLICY: DomainReasoningExtensionPolicy = Object.freeze({
  allowsNewReasoningPackages: true,
  allowsNewQueryUtilities: false,
  allowsReasoningEngine: false,
  allowsExecutiveJudgment: false,
  allowsRecommendations: false,
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
  "DomainReasoningPlatformFreeze",
  "buildDomainReasoningPlatformFreezeManifest",
  "isDomainReasoningPlatformFreezeManifestValid",
  "runDomainReasoningPlatformFreeze",
  "getDomainReasoningPlatformFreezeState",
  "getDomainReasoningPlatformCompatibilityMatrix",
  "isDomainReasoningCompatibilityMatrixValid",
  "listDomainReasoningPlatformPhases",
  "listDomainReasoningPlatformPublicApis",
] as const);

function apiEntry(
  apiName: string,
  phaseId: DomainReasoningPublicApiEntry["phaseId"],
  category: DomainReasoningPublicApiEntry["category"]
): DomainReasoningPublicApiEntry {
  return Object.freeze({
    apiName,
    phaseId,
    category,
    stable: true,
    metadataOnly: true,
  });
}

export const DOMAIN_REASONING_PUBLIC_API_REGISTRY: readonly DomainReasoningPublicApiEntry[] = Object.freeze([
  ...DOMAIN_REASONING_PUBLIC_APIS.map((apiName) => apiEntry(apiName, "DOM-6:1", "foundation")),
  ...DOMAIN_REASONING_QUERY_PUBLIC_APIS.map((apiName) => apiEntry(apiName, "DOM-6:2", "query")),
  ...DOMAIN_REASONING_CERTIFICATION_PUBLIC_APIS.map((apiName) => apiEntry(apiName, "DOM-6:3", "certification")),
  ...FREEZE_PUBLIC_APIS.map((apiName) => apiEntry(apiName, "DOM-6:4", "freeze")),
]);

export function listDomainReasoningPlatformPhases(): readonly DomainReasoningPhaseRegistryEntry[] {
  return DOMAIN_REASONING_PHASE_REGISTRY;
}

export function listDomainReasoningPlatformPublicApis(): readonly DomainReasoningPublicApiEntry[] {
  return DOMAIN_REASONING_PUBLIC_API_REGISTRY;
}

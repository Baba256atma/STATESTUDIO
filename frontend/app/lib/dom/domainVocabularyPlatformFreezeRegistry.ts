import {
  DOMAIN_VOCABULARY_CERTIFICATION_PUBLIC_APIS,
  DOMAIN_VOCABULARY_QUERY_PUBLIC_APIS,
} from "./domainVocabularyCertificationIndex.ts";
import { DOMAIN_VOCABULARY_PUBLIC_APIS } from "./domainVocabularyIndex.ts";
import type {
  DomainVocabularyExtensionPolicy,
  DomainVocabularyPhaseRegistryEntry,
  DomainVocabularyPlatformIdentity,
  DomainVocabularyPublicApiEntry,
  DomainVocabularyReleaseMetadata,
} from "./domainVocabularyPlatformFreezeTypes.ts";

export const DOMAIN_VOCABULARY_PLATFORM_IDENTITY: DomainVocabularyPlatformIdentity = Object.freeze({
  platformId: "nexora-domain-vocabulary-platform",
  platformName: "Nexora Domain Vocabulary Platform",
  layerId: "DOM",
  phaseId: "DOM-2",
  version: "DOM-2:4",
  releaseStage: "frozen",
  metadataOnly: true,
  runtimeBehavior: false,
});

export const DOMAIN_VOCABULARY_PHASE_REGISTRY: readonly DomainVocabularyPhaseRegistryEntry[] = Object.freeze([
  Object.freeze({
    phaseId: "DOM-2:1",
    title: "Vocabulary Foundation",
    status: "certified",
    order: 1,
    behaviorAdded: false,
    metadataOnly: true,
  }),
  Object.freeze({
    phaseId: "DOM-2:2",
    title: "Vocabulary Query Layer",
    status: "certified",
    order: 2,
    behaviorAdded: false,
    metadataOnly: true,
  }),
  Object.freeze({
    phaseId: "DOM-2:3",
    title: "Vocabulary Certification & Export Layer",
    status: "certified",
    order: 3,
    behaviorAdded: false,
    metadataOnly: true,
  }),
  Object.freeze({
    phaseId: "DOM-2:4",
    title: "Vocabulary Platform Freeze",
    status: "frozen",
    order: 4,
    behaviorAdded: false,
    metadataOnly: true,
  }),
]);

export const DOMAIN_VOCABULARY_RELEASE_METADATA: DomainVocabularyReleaseMetadata = Object.freeze({
  releaseId: "dom-2-vocabulary-platform-freeze",
  releaseName: "DOM-2 Domain Vocabulary Platform Freeze",
  releaseVersion: "DOM-2:4",
  certificationDependency: "DOM-2:3",
  regressionDependency: "DOM-2 regression",
  immutable: true,
  deterministic: true,
});

export const DOMAIN_VOCABULARY_EXTENSION_POLICY: DomainVocabularyExtensionPolicy = Object.freeze({
  allowsNewVocabularyPackages: true,
  allowsNewQueryUtilities: false,
  allowsRuntimeInference: false,
  allowsAiLogic: false,
  allowsFuzzyMatching: false,
  requiresPublicApiConsumption: true,
  requiresCertificationForMutation: true,
  policy: "metadata-extension-only",
});

const FREEZE_PUBLIC_APIS = Object.freeze([
  "DomainVocabularyPlatformFreeze",
  "buildDomainVocabularyPlatformFreezeManifest",
  "runDomainVocabularyPlatformFreeze",
  "getDomainVocabularyPlatformFreezeState",
  "getDomainVocabularyPlatformCompatibilityMatrix",
] as const);

function apiEntry(
  apiName: string,
  phaseId: DomainVocabularyPublicApiEntry["phaseId"],
  category: DomainVocabularyPublicApiEntry["category"]
): DomainVocabularyPublicApiEntry {
  return Object.freeze({
    apiName,
    phaseId,
    category,
    stable: true,
    metadataOnly: true,
  });
}

export const DOMAIN_VOCABULARY_PUBLIC_API_REGISTRY: readonly DomainVocabularyPublicApiEntry[] = Object.freeze([
  ...DOMAIN_VOCABULARY_PUBLIC_APIS.map((apiName) => apiEntry(apiName, "DOM-2:1", "foundation")),
  ...DOMAIN_VOCABULARY_QUERY_PUBLIC_APIS.map((apiName) => apiEntry(apiName, "DOM-2:2", "query")),
  ...DOMAIN_VOCABULARY_CERTIFICATION_PUBLIC_APIS.map((apiName) =>
    apiEntry(apiName, "DOM-2:3", "certification")
  ),
  ...FREEZE_PUBLIC_APIS.map((apiName) => apiEntry(apiName, "DOM-2:4", "freeze")),
]);

export function listDomainVocabularyPlatformPhases(): readonly DomainVocabularyPhaseRegistryEntry[] {
  return DOMAIN_VOCABULARY_PHASE_REGISTRY;
}

export function listDomainVocabularyPlatformPublicApis(): readonly DomainVocabularyPublicApiEntry[] {
  return DOMAIN_VOCABULARY_PUBLIC_API_REGISTRY;
}

import { DOMAIN_FOUNDATION_PUBLIC_APIS } from "./domainFoundationIndex.ts";
import { listDomainVocabularyPlatformPublicApis } from "./domainVocabularyPlatformFreezeIndex.ts";
import { listDomainOntologyPlatformPublicApis } from "./domainOntologyPlatformFreezeIndex.ts";
import { listDomainKpiPlatformPublicApis } from "./domainKpiPlatformFreezeIndex.ts";
import {
  DOMAIN_REGULATION_CERTIFICATION_PUBLIC_APIS,
  DOMAIN_REGULATION_QUERY_PUBLIC_APIS,
} from "./domainRegulationCertificationIndex.ts";
import { listDomainReasoningPlatformPublicApis } from "./domainReasoningPlatformFreezeIndex.ts";
import { listDomainRecommendationPlatformPublicApis } from "./domainRecommendationPlatformFreezeIndex.ts";
import type {
  DomainExpertisePlatformExtensionPolicy,
  DomainExpertisePlatformIdentity,
  DomainExpertisePlatformPhaseRegistryEntry,
  DomainExpertisePlatformPublicApiEntry,
  DomainExpertisePlatformRegistryEntry,
  DomainExpertisePlatformReleaseMetadata,
} from "./domainExpertisePlatformFreezeTypes.ts";

export const DOMAIN_EXPERTISE_PLATFORM_IDENTITY: DomainExpertisePlatformIdentity = Object.freeze({
  platformId: "nexora-domain-expertise-platform",
  platformName: "Nexora Domain Expertise Platform",
  layerId: "DOM",
  version: "DOM-8",
  releaseStage: "frozen",
  metadataOnly: true,
  runtimeBehavior: false,
  domainFunctionality: false,
});

export const DOMAIN_EXPERTISE_PHASE_REGISTRY: readonly DomainExpertisePlatformPhaseRegistryEntry[] = Object.freeze([
  Object.freeze({ phaseId: "DOM-1", title: "Domain Foundation", status: "frozen", order: 1, metadataOnly: true, behaviorAdded: false }),
  Object.freeze({ phaseId: "DOM-2", title: "Vocabulary Platform", status: "frozen", order: 2, metadataOnly: true, behaviorAdded: false }),
  Object.freeze({ phaseId: "DOM-3", title: "Ontology Platform", status: "frozen", order: 3, metadataOnly: true, behaviorAdded: false }),
  Object.freeze({ phaseId: "DOM-4", title: "KPI Platform", status: "frozen", order: 4, metadataOnly: true, behaviorAdded: false }),
  Object.freeze({ phaseId: "DOM-5", title: "Regulation Platform", status: "frozen", order: 5, metadataOnly: true, behaviorAdded: false }),
  Object.freeze({ phaseId: "DOM-6", title: "Reasoning Contract Platform", status: "frozen", order: 6, metadataOnly: true, behaviorAdded: false }),
  Object.freeze({ phaseId: "DOM-7", title: "Recommendation Contract Platform", status: "frozen", order: 7, metadataOnly: true, behaviorAdded: false }),
  Object.freeze({ phaseId: "DOM-8", title: "Domain Expertise Platform Certification & Freeze", status: "frozen", order: 8, metadataOnly: true, behaviorAdded: false }),
]);

export const DOMAIN_EXPERTISE_PLATFORM_REGISTRY: readonly DomainExpertisePlatformRegistryEntry[] = Object.freeze([
  Object.freeze({ platformId: "DOM-1", platformName: "Domain Foundation", publicFacade: "DomainFoundation", certification: "frozen", metadataOnly: true, runtimeDependency: false }),
  Object.freeze({ platformId: "DOM-2", platformName: "Vocabulary Platform", publicFacade: "DomainVocabularyPlatformFreeze", certification: "frozen", metadataOnly: true, runtimeDependency: false }),
  Object.freeze({ platformId: "DOM-3", platformName: "Ontology Platform", publicFacade: "DomainOntologyPlatformFreeze", certification: "frozen", metadataOnly: true, runtimeDependency: false }),
  Object.freeze({ platformId: "DOM-4", platformName: "KPI Platform", publicFacade: "DomainKpiPlatformFreeze", certification: "frozen", metadataOnly: true, runtimeDependency: false }),
  Object.freeze({ platformId: "DOM-5", platformName: "Regulation Platform", publicFacade: "DomainRegulationCertificationLayer", certification: "frozen", metadataOnly: true, runtimeDependency: false }),
  Object.freeze({ platformId: "DOM-6", platformName: "Reasoning Contract Platform", publicFacade: "DomainReasoningPlatformFreeze", certification: "frozen", metadataOnly: true, runtimeDependency: false }),
  Object.freeze({ platformId: "DOM-7", platformName: "Recommendation Contract Platform", publicFacade: "DomainRecommendationPlatformFreeze", certification: "frozen", metadataOnly: true, runtimeDependency: false }),
]);

export const DOMAIN_EXPERTISE_RELEASE_METADATA: DomainExpertisePlatformReleaseMetadata = Object.freeze({
  releaseId: "dom-8-domain-expertise-platform-freeze",
  releaseName: "DOM-8 Domain Expertise Platform Certification & Freeze",
  releaseVersion: "DOM-8",
  certificationDependency: "DOM-1 through DOM-7",
  regressionDependency: "DOM platform regression",
  immutable: true,
  deterministic: true,
});

export const DOMAIN_EXPERTISE_EXTENSION_POLICY: DomainExpertisePlatformExtensionPolicy = Object.freeze({
  allowsNewDomainPlatforms: true,
  allowsDomainFunctionality: false,
  allowsReasoning: false,
  allowsRecommendations: false,
  allowsOntologyBehavior: false,
  allowsVocabularyBehavior: false,
  allowsKpiBehavior: false,
  allowsComplianceBehavior: false,
  allowsRuntimeExecution: false,
  allowsInference: false,
  allowsAiLogic: false,
  allowsSimulation: false,
  allowsPlanning: false,
  allowsDecisionMaking: false,
  allowsUiBehavior: false,
  allowsPersistence: false,
  allowsNetworking: false,
  allowsDatabaseAccess: false,
  requiresPublicApiConsumption: true,
  requiresFreezeCertification: true,
  policy: "metadata-platform-extension-only",
});

const DOM_8_PUBLIC_APIS = Object.freeze([
  "DomainExpertisePlatformFreeze",
  "buildDomainExpertisePlatformManifest",
  "isDomainExpertisePlatformManifestValid",
  "runDomainExpertisePlatformCertification",
  "runDomainExpertisePlatformRegression",
  "runDomainExpertisePlatformFreeze",
  "getDomainExpertisePlatformFreezeState",
  "getDomainExpertisePlatformCompatibilityMatrix",
  "isDomainExpertisePlatformCompatibilityMatrixValid",
  "listDomainExpertisePlatformPhases",
  "listDomainExpertisePlatformRegistry",
  "listDomainExpertisePlatformPublicApis",
] as const);

function apiEntry(
  apiName: string,
  sourcePlatform: DomainExpertisePlatformPublicApiEntry["sourcePlatform"],
  category: DomainExpertisePlatformPublicApiEntry["category"]
): DomainExpertisePlatformPublicApiEntry {
  return Object.freeze({ apiName, sourcePlatform, category, stable: true, metadataOnly: true });
}

export const DOMAIN_EXPERTISE_PUBLIC_API_REGISTRY: readonly DomainExpertisePlatformPublicApiEntry[] = Object.freeze([
  ...DOMAIN_FOUNDATION_PUBLIC_APIS.map((apiName) => apiEntry(apiName, "DOM-1", "foundation")),
  ...listDomainVocabularyPlatformPublicApis().map((entry) => apiEntry(entry.apiName, "DOM-2", "platform-freeze")),
  ...listDomainOntologyPlatformPublicApis().map((entry) => apiEntry(entry.apiName, "DOM-3", "platform-freeze")),
  ...listDomainKpiPlatformPublicApis().map((entry) => apiEntry(entry.apiName, "DOM-4", "platform-freeze")),
  ...DOMAIN_REGULATION_QUERY_PUBLIC_APIS.map((apiName) => apiEntry(apiName, "DOM-5", "certification")),
  ...DOMAIN_REGULATION_CERTIFICATION_PUBLIC_APIS.map((apiName) => apiEntry(apiName, "DOM-5", "certification")),
  ...listDomainReasoningPlatformPublicApis().map((entry) => apiEntry(entry.apiName, "DOM-6", "platform-freeze")),
  ...listDomainRecommendationPlatformPublicApis().map((entry) => apiEntry(entry.apiName, "DOM-7", "platform-freeze")),
  ...DOM_8_PUBLIC_APIS.map((apiName) => apiEntry(apiName, "DOM-8", "dom-freeze")),
]);

export function listDomainExpertisePlatformPhases(): readonly DomainExpertisePlatformPhaseRegistryEntry[] {
  return DOMAIN_EXPERTISE_PHASE_REGISTRY;
}

export function listDomainExpertisePlatformRegistry(): readonly DomainExpertisePlatformRegistryEntry[] {
  return DOMAIN_EXPERTISE_PLATFORM_REGISTRY;
}

export function listDomainExpertisePlatformPublicApis(): readonly DomainExpertisePlatformPublicApiEntry[] {
  return DOMAIN_EXPERTISE_PUBLIC_API_REGISTRY;
}

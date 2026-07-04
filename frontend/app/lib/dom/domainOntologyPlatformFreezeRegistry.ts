import {
  DOMAIN_ONTOLOGY_CERTIFICATION_PUBLIC_APIS,
  DOMAIN_ONTOLOGY_QUERY_PUBLIC_APIS,
} from "./domainOntologyCertificationIndex.ts";
import { DOMAIN_ONTOLOGY_PUBLIC_APIS } from "./domainOntologyIndex.ts";
import type {
  DomainOntologyExtensionPolicy,
  DomainOntologyPhaseRegistryEntry,
  DomainOntologyPlatformIdentity,
  DomainOntologyPublicApiEntry,
  DomainOntologyReleaseMetadata,
} from "./domainOntologyPlatformFreezeTypes.ts";

export const DOMAIN_ONTOLOGY_PLATFORM_IDENTITY: DomainOntologyPlatformIdentity = Object.freeze({
  platformId: "nexora-domain-ontology-platform",
  platformName: "Nexora Domain Ontology Platform",
  layerId: "DOM",
  phaseId: "DOM-3",
  version: "DOM-3:4",
  releaseStage: "frozen",
  metadataOnly: true,
  runtimeBehavior: false,
});

export const DOMAIN_ONTOLOGY_PHASE_REGISTRY: readonly DomainOntologyPhaseRegistryEntry[] = Object.freeze([
  Object.freeze({
    phaseId: "DOM-3:1",
    title: "Ontology Foundation",
    status: "certified",
    order: 1,
    behaviorAdded: false,
    metadataOnly: true,
  }),
  Object.freeze({
    phaseId: "DOM-3:2",
    title: "Ontology Query Layer",
    status: "certified",
    order: 2,
    behaviorAdded: false,
    metadataOnly: true,
  }),
  Object.freeze({
    phaseId: "DOM-3:3",
    title: "Ontology Certification & Export Layer",
    status: "certified",
    order: 3,
    behaviorAdded: false,
    metadataOnly: true,
  }),
  Object.freeze({
    phaseId: "DOM-3:4",
    title: "Ontology Platform Freeze",
    status: "frozen",
    order: 4,
    behaviorAdded: false,
    metadataOnly: true,
  }),
]);

export const DOMAIN_ONTOLOGY_RELEASE_METADATA: DomainOntologyReleaseMetadata = Object.freeze({
  releaseId: "dom-3-ontology-platform-freeze",
  releaseName: "DOM-3 Domain Ontology Platform Freeze",
  releaseVersion: "DOM-3:4",
  certificationDependency: "DOM-3:3",
  regressionDependency: "DOM-3 regression",
  immutable: true,
  deterministic: true,
});

export const DOMAIN_ONTOLOGY_EXTENSION_POLICY: DomainOntologyExtensionPolicy = Object.freeze({
  allowsNewOntologyPackages: true,
  allowsNewQueryUtilities: false,
  allowsRuntimeInference: false,
  allowsRuntimeGraphReasoning: false,
  allowsAiLogic: false,
  allowsFuzzyMatching: false,
  requiresPublicApiConsumption: true,
  requiresCertificationForMutation: true,
  policy: "metadata-extension-only",
});

const FREEZE_PUBLIC_APIS = Object.freeze([
  "DomainOntologyPlatformFreeze",
  "buildDomainOntologyPlatformFreezeManifest",
  "isDomainOntologyPlatformFreezeManifestValid",
  "runDomainOntologyPlatformFreeze",
  "getDomainOntologyPlatformFreezeState",
  "getDomainOntologyPlatformCompatibilityMatrix",
] as const);

function apiEntry(
  apiName: string,
  phaseId: DomainOntologyPublicApiEntry["phaseId"],
  category: DomainOntologyPublicApiEntry["category"]
): DomainOntologyPublicApiEntry {
  return Object.freeze({
    apiName,
    phaseId,
    category,
    stable: true,
    metadataOnly: true,
  });
}

export const DOMAIN_ONTOLOGY_PUBLIC_API_REGISTRY: readonly DomainOntologyPublicApiEntry[] = Object.freeze([
  ...DOMAIN_ONTOLOGY_PUBLIC_APIS.map((apiName) => apiEntry(apiName, "DOM-3:1", "foundation")),
  ...DOMAIN_ONTOLOGY_QUERY_PUBLIC_APIS.map((apiName) => apiEntry(apiName, "DOM-3:2", "query")),
  ...DOMAIN_ONTOLOGY_CERTIFICATION_PUBLIC_APIS.map((apiName) =>
    apiEntry(apiName, "DOM-3:3", "certification")
  ),
  ...FREEZE_PUBLIC_APIS.map((apiName) => apiEntry(apiName, "DOM-3:4", "freeze")),
]);

export function listDomainOntologyPlatformPhases(): readonly DomainOntologyPhaseRegistryEntry[] {
  return DOMAIN_ONTOLOGY_PHASE_REGISTRY;
}

export function listDomainOntologyPlatformPublicApis(): readonly DomainOntologyPublicApiEntry[] {
  return DOMAIN_ONTOLOGY_PUBLIC_API_REGISTRY;
}

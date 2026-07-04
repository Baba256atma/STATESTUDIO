import {
  DOMAIN_KPI_CERTIFICATION_PUBLIC_APIS,
  DOMAIN_KPI_QUERY_PUBLIC_APIS,
} from "./domainKpiCertificationIndex.ts";
import { DOMAIN_KPI_PUBLIC_APIS } from "./domainKpiIndex.ts";
import type {
  DomainKpiExtensionPolicy,
  DomainKpiPhaseRegistryEntry,
  DomainKpiPlatformIdentity,
  DomainKpiPublicApiEntry,
  DomainKpiReleaseMetadata,
} from "./domainKpiPlatformFreezeTypes.ts";

export const DOMAIN_KPI_PLATFORM_IDENTITY: DomainKpiPlatformIdentity = Object.freeze({
  platformId: "nexora-domain-kpi-contract-platform",
  platformName: "Nexora Domain KPI Contract Platform",
  layerId: "DOM",
  phaseId: "DOM-4",
  version: "DOM-4:4",
  releaseStage: "frozen",
  metadataOnly: true,
  runtimeBehavior: false,
});

export const DOMAIN_KPI_PHASE_REGISTRY: readonly DomainKpiPhaseRegistryEntry[] = Object.freeze([
  Object.freeze({
    phaseId: "DOM-4:1",
    title: "KPI Contract Foundation",
    status: "certified",
    order: 1,
    behaviorAdded: false,
    metadataOnly: true,
  }),
  Object.freeze({
    phaseId: "DOM-4:2",
    title: "KPI Query Layer",
    status: "certified",
    order: 2,
    behaviorAdded: false,
    metadataOnly: true,
  }),
  Object.freeze({
    phaseId: "DOM-4:3",
    title: "KPI Certification & Export Layer",
    status: "certified",
    order: 3,
    behaviorAdded: false,
    metadataOnly: true,
  }),
  Object.freeze({
    phaseId: "DOM-4:4",
    title: "KPI Platform Freeze",
    status: "frozen",
    order: 4,
    behaviorAdded: false,
    metadataOnly: true,
  }),
]);

export const DOMAIN_KPI_RELEASE_METADATA: DomainKpiReleaseMetadata = Object.freeze({
  releaseId: "dom-4-kpi-contract-platform-freeze",
  releaseName: "DOM-4 Domain KPI Contract Platform Freeze",
  releaseVersion: "DOM-4:4",
  certificationDependency: "DOM-4:3",
  regressionDependency: "DOM-4 regression",
  immutable: true,
  deterministic: true,
});

export const DOMAIN_KPI_EXTENSION_POLICY: DomainKpiExtensionPolicy = Object.freeze({
  allowsNewKpiPackages: true,
  allowsNewQueryUtilities: false,
  allowsKpiCalculationEngine: false,
  allowsRuntimeMetricEvaluation: false,
  allowsRuntimeInference: false,
  allowsAiLogic: false,
  allowsSemanticMatching: false,
  requiresPublicApiConsumption: true,
  requiresCertificationForMutation: true,
  policy: "metadata-extension-only",
});

const FREEZE_PUBLIC_APIS = Object.freeze([
  "DomainKpiPlatformFreeze",
  "buildDomainKpiPlatformFreezeManifest",
  "isDomainKpiPlatformFreezeManifestValid",
  "runDomainKpiPlatformFreeze",
  "getDomainKpiPlatformFreezeState",
  "getDomainKpiPlatformCompatibilityMatrix",
] as const);

function apiEntry(
  apiName: string,
  phaseId: DomainKpiPublicApiEntry["phaseId"],
  category: DomainKpiPublicApiEntry["category"]
): DomainKpiPublicApiEntry {
  return Object.freeze({
    apiName,
    phaseId,
    category,
    stable: true,
    metadataOnly: true,
  });
}

export const DOMAIN_KPI_PUBLIC_API_REGISTRY: readonly DomainKpiPublicApiEntry[] = Object.freeze([
  ...DOMAIN_KPI_PUBLIC_APIS.map((apiName) => apiEntry(apiName, "DOM-4:1", "foundation")),
  ...DOMAIN_KPI_QUERY_PUBLIC_APIS.map((apiName) => apiEntry(apiName, "DOM-4:2", "query")),
  ...DOMAIN_KPI_CERTIFICATION_PUBLIC_APIS.map((apiName) => apiEntry(apiName, "DOM-4:3", "certification")),
  ...FREEZE_PUBLIC_APIS.map((apiName) => apiEntry(apiName, "DOM-4:4", "freeze")),
]);

export function listDomainKpiPlatformPhases(): readonly DomainKpiPhaseRegistryEntry[] {
  return DOMAIN_KPI_PHASE_REGISTRY;
}

export function listDomainKpiPlatformPublicApis(): readonly DomainKpiPublicApiEntry[] {
  return DOMAIN_KPI_PUBLIC_API_REGISTRY;
}

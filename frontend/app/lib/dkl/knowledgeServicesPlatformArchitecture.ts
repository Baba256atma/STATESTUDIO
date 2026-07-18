/**
 * DKL-7:6 — Knowledge Services Platform Architecture.
 *
 * Phase chain and Foundation/Registry/Model/Validation/Manifest/Service
 * surfaces reached through Manifest by canonical reference.
 *
 * Ownership: owned exclusively by DKL-7:6.
 */

import {
  getKnowledgeServicesManifestInventoryCount,
  KnowledgeServicesManifest,
  KnowledgeServicesManifestId,
  KnowledgeServicesManifestStatus,
  KnowledgeServicesManifestVersion,
} from "./knowledgeServicesManifest.ts";
import type {
  KnowledgeServicesPlatformCapabilitySurface,
  KnowledgeServicesPlatformContractSurface,
  KnowledgeServicesPlatformPhaseReference,
  KnowledgeServicesPlatformServiceSurface,
} from "./knowledgeServicesPlatformTypes.ts";

const manifest = KnowledgeServicesManifest;
const validation = manifest.validation;
const model = validation.model;
const registry = model.registry;
const foundation = registry.foundation;

const phase = (
  phaseId: string,
  stage: string,
  version: string,
  completionStatus: string,
  predecessor: string | null,
  successor: string | null,
  path: string,
  role: string,
  completed: boolean,
  order: number,
): KnowledgeServicesPlatformPhaseReference =>
  Object.freeze({
    phaseId,
    stage,
    version,
    completionStatus,
    predecessor,
    successor,
    canonicalReferencePath: path,
    architectureRole: role,
    runtimeBehavior: "None" as const,
    completed,
    deterministicOrder: order,
  });

/** Nine DKL-7 phases: six completed through Platform, three future. */
export const KnowledgeServicesPlatformPhases: readonly KnowledgeServicesPlatformPhaseReference[] =
  Object.freeze([
    phase(
      foundation.foundationId,
      "Foundation",
      foundation.foundationVersion,
      foundation.foundationStatus,
      "DKL-6:9/KnowledgeRepositoryPublicIndex",
      registry.identity.registryId,
      "Platform.manifest.validation.model.registry.foundation",
      "Foundation",
      true,
      1,
    ),
    phase(
      registry.identity.registryId,
      "Registry",
      registry.identity.registryVersion,
      registry.status,
      foundation.foundationId,
      model.identity.modelId,
      "Platform.manifest.validation.model.registry",
      "Registry",
      true,
      2,
    ),
    phase(
      model.identity.modelId,
      "Model",
      model.identity.modelVersion,
      model.status,
      registry.identity.registryId,
      validation.identity.validationId,
      "Platform.manifest.validation.model",
      "Model",
      true,
      3,
    ),
    phase(
      validation.identity.validationId,
      "Validation",
      validation.identity.validationVersion,
      validation.status,
      model.identity.modelId,
      KnowledgeServicesManifestId,
      "Platform.manifest.validation",
      "Validation",
      true,
      4,
    ),
    phase(
      KnowledgeServicesManifestId,
      "Manifest",
      KnowledgeServicesManifestVersion,
      KnowledgeServicesManifestStatus,
      validation.identity.validationId,
      "DKL-7:6/KnowledgeServicesPlatform",
      "Platform.manifest",
      "Manifest",
      true,
      5,
    ),
    phase(
      "DKL-7:6/KnowledgeServicesPlatform",
      "Platform",
      "1.0.0",
      "PlatformComplete",
      KnowledgeServicesManifestId,
      "DKL-7:7/KnowledgeServicesCertification",
      "Platform",
      "Platform",
      true,
      6,
    ),
    phase(
      "DKL-7:7/KnowledgeServicesCertification",
      "Certification",
      "Future",
      "Declared",
      "DKL-7:6/KnowledgeServicesPlatform",
      "DKL-7:8/KnowledgeServicesFreeze",
      "Future/Certification",
      "Certification",
      false,
      7,
    ),
    phase(
      "DKL-7:8/KnowledgeServicesFreeze",
      "Freeze",
      "Future",
      "Declared",
      "DKL-7:7/KnowledgeServicesCertification",
      "DKL-7:9/KnowledgeServicesPublicIndex",
      "Future/Freeze",
      "Freeze",
      false,
      8,
    ),
    phase(
      "DKL-7:9/KnowledgeServicesPublicIndex",
      "PublicIndex",
      "Future",
      "Declared",
      "DKL-7:8/KnowledgeServicesFreeze",
      null,
      "Future/PublicIndex",
      "PublicIndex",
      false,
      9,
    ),
  ]);

export const KnowledgeServicesPlatformChainIds = Object.freeze({
  manifestId: KnowledgeServicesManifestId,
  manifestVersion: KnowledgeServicesManifestVersion,
  validationId: validation.identity.validationId,
  modelId: model.identity.modelId,
  registryId: registry.identity.registryId,
  foundationId: foundation.foundationId,
  dkl6PublicIndexId: manifest.identity.dkl6PublicIndexId,
});

/** Foundation surface — canonical references only. */
export const KnowledgeServicesPlatformFoundationSurface = Object.freeze({
  surfaceId: "DKL-7:6/FoundationSurface",
  identity: foundation.identity,
  ownership: registry.ownership,
  boundaries: registry.boundaries,
  lifecycle: registry.lifecycle,
  contracts: registry.contracts,
  capabilities: registry.capabilities,
  dependencyIdentity: manifest.identity.dkl6PublicIndexId,
  preservedByReference: true as const,
  metadataOnly: true as const,
});

/** Registry surface — canonical references only. */
export const KnowledgeServicesPlatformRegistrySurface = Object.freeze({
  surfaceId: "DKL-7:6/RegistrySurface",
  services: registry.services,
  capabilities: registry.capabilities,
  contracts: registry.contracts,
  requestCategories: registry.requestCategories,
  responseCategories: registry.responseCategories,
  accessModes: registry.accessModes,
  mutationModeCount: 0 as const,
  serviceCapabilityRelationships: registry.relationships,
  preservedByReference: true as const,
  metadataOnly: true as const,
});

/** Model surface — canonical references only. */
export const KnowledgeServicesPlatformModelSurface = Object.freeze({
  surfaceId: "DKL-7:6/ModelSurface",
  model,
  requests: model.requests,
  responses: model.responses,
  results: model.results,
  contexts: model.contexts,
  references: model.references,
  relationships: model.relationships,
  guarantees: model.guarantees,
  inventory: model.inventory,
  requestModelCount: model.inventory.requestModelCount,
  responseModelCount: model.inventory.responseModelCount,
  resultModelCount: model.inventory.resultModelCount,
  contextModelCount: model.inventory.contextModelCount,
  referenceModelCount: model.inventory.referenceModelCount,
  graphModelCount: model.inventory.graphModelCount,
  relationshipCount: model.inventory.relationshipCount,
  modelGuaranteeCount: Object.keys(model.guarantees).length,
  totalInventoryCount: model.inventory.totalEntryCount,
  preservedByReference: true as const,
  metadataOnly: true as const,
});

/** Validation surface — canonical references only. */
export const KnowledgeServicesPlatformValidationSurface = Object.freeze({
  surfaceId: "DKL-7:6/ValidationSurface",
  validation,
  groupCount: validation.inventory.groupCount,
  ruleCount: validation.inventory.ruleCount,
  evidenceCount: validation.inventory.evidenceCount,
  resultCount: validation.inventory.resultCount,
  passCount: validation.inventory.passCount,
  failCount: validation.inventory.failCount,
  notApplicableCount: validation.inventory.notApplicableCount,
  findingCount: validation.inventory.findingCount,
  guaranteeCount: validation.inventory.guaranteeCount,
  overallResult: validation.overallResult,
  preservedByReference: true as const,
  metadataOnly: true as const,
});

/** Manifest surface — canonical references only. */
export const KnowledgeServicesPlatformManifestSurface = Object.freeze({
  surfaceId: "DKL-7:6/ManifestSurface",
  manifest,
  sectionCount: manifest.inventory.sectionCount,
  dependencyCount: manifest.dependencies.length,
  compatibilityCount: manifest.compatibility.length,
  guaranteeCount: manifest.guarantees.length,
  publicApiCount: manifest.publicApi.length,
  inventoryCount: getKnowledgeServicesManifestInventoryCount(),
  readiness: manifest.readiness,
  preservedByReference: true as const,
  metadataOnly: true as const,
});

/** Twelve platform service declarations (architectural availability only). */
export const KnowledgeServicesPlatformServices: readonly KnowledgeServicesPlatformServiceSurface[] =
  Object.freeze(
    manifest.services.map((service, index) =>
      Object.freeze({
        serviceId: service.serviceId,
        serviceName: service.serviceName,
        capabilityReference: service.capabilityReference,
        contractReference: service.contractReference,
        requestModelReference: service.requestModelReference,
        responseModelReference: service.responseModelReference,
        resultModelReference: service.resultModelReference,
        accessModeReference: service.accessModeReference,
        readOnly: true as const,
        validationStatus: "Pass" as const,
        manifestStatus: "ManifestComplete" as const,
        platformAvailability: "PlatformAvailable" as const,
        runtimeImplementationStatus: "NotProvidedByPlatform" as const,
        deterministicOrder: index + 1,
      }),
    ),
  );

/** Twelve capability platform surfaces. */
export const KnowledgeServicesPlatformCapabilities: readonly KnowledgeServicesPlatformCapabilitySurface[] =
  Object.freeze(
    manifest.capabilities.map((capability, index) =>
      Object.freeze({
        capabilityId: capability.capabilityId,
        name: capability.capabilityName,
        owningPhase: "DKL-7:1" as const,
        serviceRelationship: capability.serviceRelationship,
        contractRelationship: "DKL-7:1/KnowledgeServiceCapability",
        readOnly: true as const,
        validationResult: "Pass" as const,
        platformAvailability: "PlatformAvailable" as const,
        runtimeBehavior: "None" as const,
        deterministicOrder: index + 1,
      }),
    ),
  );

/** Eleven contract platform surfaces. */
export const KnowledgeServicesPlatformContracts: readonly KnowledgeServicesPlatformContractSurface[] =
  Object.freeze(
    manifest.contracts.map((contract, index) =>
      Object.freeze({
        contractId: contract.contractId,
        contractName: contract.contractName,
        ownership: "DKL-7" as const,
        readOnly: true as const,
        relatedServices: contract.serviceReferences,
        relatedCapabilities: contract.capabilityReferences,
        lifecycleStage: "Registered" as const,
        validationStatus: "Pass" as const,
        platformAvailability: "PlatformAvailable" as const,
        runtimeBehavior: "None" as const,
        deterministicOrder: index + 1,
      }),
    ),
  );

export const KnowledgeServicesPlatformOwnership = Object.freeze({
  ownershipId: "DKL-7:6/Ownership",
  ownedCount: manifest.ownership.ownedCount,
  nonOwnedCount: manifest.ownership.nonOwnedCount,
  ownedReferences: manifest.ownership.ownedReferences,
  nonOwnedReferences: manifest.ownership.nonOwnedReferences,
  preservedByReference: true as const,
  ownershipExpanded: false as const,
  metadataOnly: true as const,
});

export const KnowledgeServicesPlatformBoundaries = Object.freeze({
  boundariesId: "DKL-7:6/Boundaries",
  prohibitedSurfaces: manifest.boundaries,
  prohibitedSurfaceCount: manifest.boundaries.length,
  architectureAvailabilityDoesNotAuthorize: Object.freeze([
    "service execution",
    "repository access",
    "database access",
    "persistence",
    "search execution",
    "graph traversal",
    "graph algorithms",
    "timeline processing",
    "evidence scoring",
    "AI summarization",
    "inference",
    "mutation",
    "networking",
    "REST",
    "HTTP",
    "MCP transport",
    "SDK transport",
    "authentication",
    "authorization",
    "routing",
    "dispatch",
    "runtime validation",
    "Engine reasoning",
    "Advisor behavior",
    "Scene behavior",
    "UI behavior",
  ] as const),
  weakenedProhibitions: false as const,
  preservedByReference: true as const,
  metadataOnly: true as const,
});

export const KnowledgeServicesPlatformObservedCounts = Object.freeze({
  ownedResponsibilityCount: manifest.ownership.ownedCount,
  nonOwnedResponsibilityCount: manifest.ownership.nonOwnedCount,
  prohibitedSurfaceCount: manifest.boundaries.length,
  serviceCount: registry.services.length,
  capabilityCount: registry.capabilities.length,
  contractCount: registry.contracts.length,
  lifecycleStageCount: registry.lifecycle.length,
  requestCategoryCount: registry.requestCategories.length,
  responseCategoryCount: registry.responseCategories.length,
  accessModeCount: registry.accessModes.length,
  mutationModeCount: 0 as const,
  serviceCapabilityRelationshipCount: registry.relationships.length,
  modelInventoryCount: model.inventory.totalEntryCount,
  requestModelCount: model.inventory.requestModelCount,
  responseModelCount: model.inventory.responseModelCount,
  resultModelCount: model.inventory.resultModelCount,
  contextModelCount: model.inventory.contextModelCount,
  referenceModelCount: model.inventory.referenceModelCount,
  graphModelCount: model.inventory.graphModelCount,
  relationshipCount: model.inventory.relationshipCount,
  modelGuaranteeCount: Object.keys(model.guarantees).length,
  validationGroupCount: validation.inventory.groupCount,
  validationRuleCount: validation.inventory.ruleCount,
  validationEvidenceCount: validation.inventory.evidenceCount,
  validationResultCount: validation.inventory.resultCount,
  validationPassCount: validation.inventory.passCount,
  validationFailCount: validation.inventory.failCount,
  validationGuaranteeCount: validation.inventory.guaranteeCount,
  manifestSectionCount: manifest.inventory.sectionCount,
  manifestDependencyCount: manifest.dependencies.length,
  manifestCompatibilityCount: manifest.compatibility.length,
  manifestGuaranteeCount: manifest.guarantees.length,
  manifestPublicApiCount: manifest.publicApi.length,
  manifestInventoryCount: getKnowledgeServicesManifestInventoryCount(),
});

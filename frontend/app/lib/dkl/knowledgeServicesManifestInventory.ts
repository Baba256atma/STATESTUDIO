/**
 * DKL-7:5 — Knowledge Services Manifest Inventory.
 *
 * Canonical inventories, architecture phases, ownership, boundaries, services,
 * capabilities, contracts, models, and validation profile — by reference counts.
 *
 * Ownership: owned exclusively by DKL-7:5.
 */

import {
  getKnowledgeServicesValidationSummary,
  KnowledgeServicesValidation,
  KnowledgeServicesValidationId,
  KnowledgeServicesValidationVersion,
} from "./knowledgeServicesValidation.ts";
import type {
  KnowledgeServicesManifestArchitecturePhase,
  KnowledgeServicesManifestBoundaryDeclaration,
  KnowledgeServicesManifestCapabilityDeclaration,
  KnowledgeServicesManifestContractDeclaration,
  KnowledgeServicesManifestOwnershipDeclaration,
  KnowledgeServicesManifestServiceDeclaration,
} from "./knowledgeServicesManifestTypes.ts";

const validation = KnowledgeServicesValidation;
const model = validation.model;
const registry = model.registry;
const foundation = registry.foundation;
const validationSummary = getKnowledgeServicesValidationSummary();

const phase = (
  phaseId: string,
  phaseName: string,
  stage: string,
  version: string,
  status: string,
  predecessor: string | null,
  successor: string | null,
  path: string,
  role: string,
  completed: boolean,
  order: number,
): KnowledgeServicesManifestArchitecturePhase =>
  Object.freeze({
    phaseId,
    phaseName,
    stage,
    version,
    status,
    directPredecessor: predecessor,
    directSuccessor: successor,
    canonicalReferencePath: path,
    architectureRole: role,
    runtimeBehavior: "None" as const,
    completed,
    deterministicOrder: order,
  });

/** Completed and future DKL-7 phase chain. */
export const KnowledgeServicesManifestArchitecturePhases: readonly KnowledgeServicesManifestArchitecturePhase[] =
  Object.freeze([
    phase(
      "DKL-7:1/KnowledgeServicesFoundation",
      "Knowledge Services Foundation",
      "Foundation",
      foundation.foundationVersion,
      foundation.foundationStatus,
      "DKL-6:9/KnowledgeRepositoryPublicIndex",
      "DKL-7:2/KnowledgeServicesRegistry",
      "Validation.model.registry.foundation",
      "Foundation",
      true,
      1,
    ),
    phase(
      "DKL-7:2/KnowledgeServicesRegistry",
      "Knowledge Services Registry",
      "Registry",
      registry.identity.registryVersion,
      registry.status,
      "DKL-7:1/KnowledgeServicesFoundation",
      "DKL-7:3/KnowledgeServicesModel",
      "Validation.model.registry",
      "Registry",
      true,
      2,
    ),
    phase(
      "DKL-7:3/KnowledgeServicesModel",
      "Knowledge Services Model",
      "Model",
      model.identity.modelVersion,
      model.status,
      "DKL-7:2/KnowledgeServicesRegistry",
      "DKL-7:4/KnowledgeServicesValidation",
      "Validation.model",
      "Model",
      true,
      3,
    ),
    phase(
      "DKL-7:4/KnowledgeServicesValidation",
      "Knowledge Services Validation",
      "Validation",
      KnowledgeServicesValidationVersion,
      validation.status,
      "DKL-7:3/KnowledgeServicesModel",
      "DKL-7:5/KnowledgeServicesManifest",
      "Validation",
      "Validation",
      true,
      4,
    ),
    phase(
      "DKL-7:5/KnowledgeServicesManifest",
      "Knowledge Services Manifest",
      "Manifest",
      "1.0.0",
      "ManifestComplete",
      "DKL-7:4/KnowledgeServicesValidation",
      "DKL-7:6/KnowledgeServicesPlatform",
      "Manifest",
      "Manifest",
      true,
      5,
    ),
    phase(
      "DKL-7:6/KnowledgeServicesPlatform",
      "Knowledge Services Platform",
      "Platform",
      "Future",
      "Declared",
      "DKL-7:5/KnowledgeServicesManifest",
      "DKL-7:7/KnowledgeServicesCertification",
      "Future/Platform",
      "Platform",
      false,
      6,
    ),
    phase(
      "DKL-7:7/KnowledgeServicesCertification",
      "Knowledge Services Certification",
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
      "Knowledge Services Freeze",
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
      "Knowledge Services Public Index",
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

/** Ownership preserved by Foundation reference through Validation chain. */
export const KnowledgeServicesManifestOwnership: KnowledgeServicesManifestOwnershipDeclaration =
  Object.freeze({
    ownershipId: "DKL-7:5/Ownership",
    ownedCount: registry.ownership.ownedCount,
    nonOwnedCount: registry.ownership.nonOwnedCount,
    ownedReferences: registry.ownership.foundationOwns,
    nonOwnedReferences: registry.ownership.foundationDoesNotOwn,
    sourcePhase: "DKL-7:1",
    preservedByReference: true,
    metadataOnly: true,
  });

/** Boundaries preserved by Foundation/Registry reference. */
export const KnowledgeServicesManifestBoundaries: readonly KnowledgeServicesManifestBoundaryDeclaration[] =
  Object.freeze(
    registry.boundaries.map((boundary, index) =>
      Object.freeze({
        boundaryId: boundary.id,
        surface: boundary.surface,
        category: boundary.classification,
        ownership: "DKL-7" as const,
        enforcementStage: "ArchitectureDeclaration" as const,
        compatibilityRelevance: true as const,
        foundationReference: boundary.foundationReference,
        prohibited: true as const,
        deterministicOrder: index + 1,
      }),
    ),
  );

const requestByService = (serviceId: string) =>
  model.requests.find((r) => r.serviceReference === serviceId);

const responseByRequest = (requestModelId: string | undefined) =>
  model.responses.find(
    (r) => r.originatingRequestModelReference === requestModelId,
  );

/** Twelve service declarations referencing Registry/Model entries. */
export const KnowledgeServicesManifestServices: readonly KnowledgeServicesManifestServiceDeclaration[] =
  Object.freeze(
    registry.services.map((service, index) => {
      const request = requestByService(service.id);
      const response = responseByRequest(request?.modelId);
      const capability = registry.capabilities.find(
        (c) => c.capabilityId === service.capabilityId,
      );
      return Object.freeze({
        serviceId: service.id,
        serviceName: service.name,
        capabilityReference: capability?.id ?? service.capabilityId,
        contractReference: request?.contractReference ?? "",
        requestModelReference: request?.modelId ?? "",
        responseModelReference: response?.modelId ?? "",
        resultModelReference: request?.resultShapeDeclaration ?? "",
        accessModeReference: request?.accessModeReference ?? "",
        readOnly: true as const,
        serviceStatus: "Registered" as const,
        runtimeImplementationStatus: "NotImplementedByManifest" as const,
        deterministicOrder: index + 1,
      });
    }),
  );

/** Twelve capability declarations by Registry reference. */
export const KnowledgeServicesManifestCapabilities: readonly KnowledgeServicesManifestCapabilityDeclaration[] =
  Object.freeze(
    registry.capabilities.map((capability, index) =>
      Object.freeze({
        capabilityId: capability.capabilityId,
        capabilityName: capability.name,
        serviceRelationship:
          capability.supportedServiceIds[0] ??
          `DKL-7:2/Service/${capability.capabilityId}`,
        ownership: "DKL-7" as const,
        readOnly: true as const,
        architectureStatus: "Registered" as const,
        sourcePhase: "DKL-7:1" as const,
        canonicalReference: capability.foundationReference,
        deterministicOrder: index + 1,
      }),
    ),
  );

/** Eleven contract declarations by Registry reference. */
export const KnowledgeServicesManifestContracts: readonly KnowledgeServicesManifestContractDeclaration[] =
  Object.freeze(
    registry.contracts.map((contract, index) =>
      Object.freeze({
        contractId: contract.contractId,
        contractName: contract.name,
        ownership: "DKL-7" as const,
        readOnly: true as const,
        serviceReferences: Object.freeze(
          KnowledgeServicesManifestServices.filter(
            (s) => s.contractReference === contract.id,
          ).map((s) => s.serviceId),
        ),
        capabilityReferences: Object.freeze(
          registry.capabilities.map((c) => c.id),
        ),
        lifecycleState: "Registered" as const,
        sourcePhase: "DKL-7:1" as const,
        canonicalReference: contract.foundationReference,
        deterministicOrder: index + 1,
      }),
    ),
  );

/** Model inventory profile by Validation → Model reference. */
export const KnowledgeServicesManifestModelProfile = Object.freeze({
  profileId: "DKL-7:5/ModelProfile",
  modelId: model.identity.modelId,
  modelVersion: model.identity.modelVersion,
  modelStatus: model.status,
  requestModelCount: model.inventory.requestModelCount,
  responseModelCount: model.inventory.responseModelCount,
  resultModelCount: model.inventory.resultModelCount,
  contextModelCount: model.inventory.contextModelCount,
  referenceModelCount: model.inventory.referenceModelCount,
  graphModelCount: model.inventory.graphModelCount,
  relationshipCount: model.inventory.relationshipCount,
  modelGuaranteeCount: Object.keys(model.guarantees).length,
  totalModelInventoryCount: model.inventory.totalEntryCount,
  preservedByReference: true as const,
  metadataOnly: true as const,
});

/** Validation profile by canonical Validation reference. */
export const KnowledgeServicesManifestValidationProfile = Object.freeze({
  profileId: "DKL-7:5/ValidationProfile",
  validationId: KnowledgeServicesValidationId,
  validationVersion: KnowledgeServicesValidationVersion,
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
  readinessBeforeManifest: validation.readiness,
  preservedByReference: true as const,
  reexecuted: false as const,
  metadataOnly: true as const,
});

export const KnowledgeServicesManifestChainIds = Object.freeze({
  validationId: KnowledgeServicesValidationId,
  modelId: model.identity.modelId,
  registryId: registry.identity.registryId,
  foundationId: foundation.foundationId,
  dkl6PublicIndexId: "DKL-6:9/KnowledgeRepositoryPublicIndex",
});

export const KnowledgeServicesManifestObservedCounts = Object.freeze({
  ownedResponsibilityCount: registry.ownership.ownedCount,
  nonOwnedResponsibilityCount: registry.ownership.nonOwnedCount,
  prohibitedSurfaceCount: registry.boundaries.length,
  serviceCount: registry.services.length,
  capabilityCount: registry.capabilities.length,
  contractCount: registry.contracts.length,
  lifecycleStageCount: registry.lifecycle.length,
  requestCategoryCount: registry.requestCategories.length,
  responseCategoryCount: registry.responseCategories.length,
  accessModeCount: registry.accessModes.length,
  mutationModeCount: validationSummary.mutationModeCount,
  serviceCapabilityRelationshipCount: registry.relationships.length,
  modelInventoryCount: model.inventory.totalEntryCount,
  validationGroupCount: validation.inventory.groupCount,
  validationRuleCount: validation.inventory.ruleCount,
  validationEvidenceCount: validation.inventory.evidenceCount,
  validationResultCount: validation.inventory.resultCount,
  requestModelCount: model.inventory.requestModelCount,
  responseModelCount: model.inventory.responseModelCount,
  resultModelCount: model.inventory.resultModelCount,
  contextModelCount: model.inventory.contextModelCount,
  referenceModelCount: model.inventory.referenceModelCount,
  graphModelCount: model.inventory.graphModelCount,
  relationshipCount: model.inventory.relationshipCount,
  modelGuaranteeCount: Object.keys(model.guarantees).length,
  validationPassCount: validation.inventory.passCount,
  validationFailCount: validation.inventory.failCount,
  validationFindingCount: validation.inventory.findingCount,
});

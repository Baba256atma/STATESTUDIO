/**
 * DKL-7:3 — Knowledge Services Model.
 *
 * Canonical immutable model layer for Nexora Knowledge Services.
 * Consumes DKL-7:2 only through its canonical registry public surface.
 * Metadata-only. Model-only. Runtime-free.
 *
 * Ownership: owned exclusively by DKL-7:3.
 *
 * Public exports (exactly 13):
 *   KnowledgeServicesModel
 *   KnowledgeServicesModelId
 *   KnowledgeServicesModelName
 *   KnowledgeServicesModelVersion
 *   KnowledgeServicesModelNamespace
 *   KnowledgeServicesModelStatus
 *   KnowledgeServicesRequestModels
 *   KnowledgeServicesResponseModels
 *   KnowledgeServicesResultModels
 *   KnowledgeServicesContextModels
 *   KnowledgeServicesModelRelationships
 *   getKnowledgeServicesModelSummary()
 *   getKnowledgeServicesModelInventoryCount()
 */

import {
  KnowledgeServicesRegistry,
  KnowledgeServicesRegistryId,
  KnowledgeServicesRegistryVersion,
} from "./knowledgeServicesRegistry.ts";
import {
  KnowledgeServicesContextModelInventory,
  KnowledgeServicesContextModels,
} from "./knowledgeServicesContextModels.ts";
import type {
  KnowledgeServicesModelIdentity,
  KnowledgeServicesModelInventory,
  KnowledgeServicesModelMetadata,
  KnowledgeServicesModelSummary,
} from "./knowledgeServicesModelTypes.ts";
import {
  KnowledgeServicesModelRelationshipInventory,
  KnowledgeServicesModelRelationships,
} from "./knowledgeServicesRelationshipModels.ts";
import {
  KnowledgeServicesRequestModelInventory,
  KnowledgeServicesRequestModels,
} from "./knowledgeServicesRequestModels.ts";
import {
  KnowledgeServicesResponseModelInventory,
  KnowledgeServicesResponseModels,
} from "./knowledgeServicesResponseModels.ts";
import {
  KnowledgeServicesResultModelInventory,
  KnowledgeServicesResultModels,
} from "./knowledgeServicesResultModels.ts";

export const KnowledgeServicesModelId =
  "DKL-7:3/KnowledgeServicesModel" as const;

export const KnowledgeServicesModelName = "Knowledge Services Model" as const;

export const KnowledgeServicesModelVersion = "1.0.0" as const;

export const KnowledgeServicesModelNamespace =
  "nexora.dkl.knowledge-services.model" as const;

export const KnowledgeServicesModelStatus = "ModelComplete" as const;

export {
  KnowledgeServicesRequestModels,
  KnowledgeServicesResponseModels,
  KnowledgeServicesResultModels,
  KnowledgeServicesContextModels,
  KnowledgeServicesModelRelationships,
};

/**
 * Counting rule for getKnowledgeServicesModelInventoryCount():
 * request models + response models + result models + context models +
 * reference models + graph models + model relationships.
 */
const COUNTING_RULE =
  "requestModelCount + responseModelCount + resultModelCount + contextModelCount + referenceModelCount + graphModelCount + relationshipCount";

const identity: KnowledgeServicesModelIdentity = Object.freeze({
  modelId: KnowledgeServicesModelId,
  modelName: KnowledgeServicesModelName,
  modelVersion: KnowledgeServicesModelVersion,
  modelNamespace: KnowledgeServicesModelNamespace,
  layer: "Data Knowledge Layer",
  phase: "DKL-7",
  stage: "Model",
  sourcePhase: "DKL-7:3",
  owner: "DKL-7 Knowledge Services",
  status: KnowledgeServicesModelStatus,
  readiness: "ReadyForValidation",
  registryId: KnowledgeServicesRegistryId,
  registryVersion: KnowledgeServicesRegistryVersion,
  foundationId: KnowledgeServicesRegistry.foundation.foundationId,
  metadataOnly: true,
  immutable: true,
});

const metadata: KnowledgeServicesModelMetadata = Object.freeze({
  metadataId: "DKL-7:3/KnowledgeServicesModelMetadata",
  modelId: KnowledgeServicesModelId,
  description:
    "Canonical immutable architectural models representing Knowledge Service requests, responses, results, contexts, and relationships.",
  metadataOnly: true,
  declarationOnly: true,
  runtimeBehavior: false,
  transportNeutral: true,
  persistenceNeutral: true,
  immutable: true,
  deterministic: true,
});

const inventory: KnowledgeServicesModelInventory = Object.freeze({
  inventoryId: "DKL-7:3/KnowledgeServicesModelInventory",
  requestModelCount: KnowledgeServicesRequestModelInventory.modelCount,
  responseModelCount: KnowledgeServicesResponseModelInventory.modelCount,
  resultModelCount: KnowledgeServicesResultModelInventory.modelCount,
  contextModelCount: KnowledgeServicesContextModelInventory.contextCount,
  referenceModelCount: KnowledgeServicesContextModelInventory.referenceCount,
  graphModelCount: KnowledgeServicesContextModelInventory.graphModelCount,
  relationshipCount:
    KnowledgeServicesModelRelationshipInventory.relationshipCount,
  totalEntryCount:
    KnowledgeServicesRequestModelInventory.modelCount +
    KnowledgeServicesResponseModelInventory.modelCount +
    KnowledgeServicesResultModelInventory.modelCount +
    KnowledgeServicesContextModelInventory.contextCount +
    KnowledgeServicesContextModelInventory.referenceCount +
    KnowledgeServicesContextModelInventory.graphModelCount +
    KnowledgeServicesModelRelationshipInventory.relationshipCount,
  countingRule: COUNTING_RULE,
  metadataOnly: true,
  immutable: true,
  deterministic: true,
});

const guarantees = Object.freeze({
  everyRequestModelReadOnly: true as const,
  everyRequestCategoryRegistered: true as const,
  everyResponseCategoryRegistered: true as const,
  everyServiceReferenceCanonical: true as const,
  everyCapabilityReferenceCanonical: true as const,
  everyContractReferenceCanonical: true as const,
  noMutationModeExists: true as const,
  noRequestExecutesItself: true as const,
  noResponsePerformsSerialization: true as const,
  noResultAccessesRepository: true as const,
  graphModelsContainNoAlgorithms: true as const,
  summaryModelsContainNoAiBehavior: true as const,
  referenceResolutionContainsNoInferenceEngine: true as const,
  businessObjectsReferencedNotOwned: true as const,
  modelsAreTransportNeutral: true as const,
  modelsArePersistenceNeutral: true as const,
  modelsAreImmutable: true as const,
  registryArchitecturePreservedByReference: true as const,
  modelRelationshipsAreDeterministic: true as const,
  readyForValidation: true as const,
});

/** Canonical immutable Knowledge Services Model aggregate. */
export const KnowledgeServicesModel = Object.freeze({
  identity,
  metadata,
  registry: KnowledgeServicesRegistry,
  requests: KnowledgeServicesRequestModels,
  responses: KnowledgeServicesResponseModels,
  results: KnowledgeServicesResultModels,
  contexts: Object.freeze({
    models: KnowledgeServicesContextModels,
    references: KnowledgeServicesContextModelInventory.references,
    graphModels: KnowledgeServicesContextModelInventory.graphModels,
    inventory: KnowledgeServicesContextModelInventory,
  }),
  references: KnowledgeServicesContextModelInventory.references,
  relationships: KnowledgeServicesModelRelationships,
  inventory,
  guarantees,
  status: KnowledgeServicesModelStatus,
  readiness: "ReadyForValidation" as const,
  nextPhase: "DKL-7:4 — Knowledge Services Validation",
  metadataOnly: true as const,
  runtimeBehavior: false as const,
  serviceExecution: false as const,
  repositoryAccess: false as const,
  searchExecution: false as const,
  graphTraversal: false as const,
  aiBehavior: false as const,
  createsKnowledge: false as const,
  modifiesKnowledge: false as const,
  performsExecutiveReasoning: false as const,
  immutable: true as const,
  deterministic: true as const,
});

/** Deterministic total public model inventory count. */
export function getKnowledgeServicesModelInventoryCount(): number {
  return KnowledgeServicesModel.inventory.totalEntryCount;
}

/** Deterministic immutable model summary. */
export function getKnowledgeServicesModelSummary(): KnowledgeServicesModelSummary {
  return Object.freeze({
    modelId: KnowledgeServicesModelId,
    version: KnowledgeServicesModelVersion,
    status: KnowledgeServicesModelStatus,
    registryId: KnowledgeServicesRegistryId,
    foundationId: KnowledgeServicesRegistry.foundation.foundationId,
    requestModelCount: KnowledgeServicesModel.inventory.requestModelCount,
    responseModelCount: KnowledgeServicesModel.inventory.responseModelCount,
    resultModelCount: KnowledgeServicesModel.inventory.resultModelCount,
    contextModelCount: KnowledgeServicesModel.inventory.contextModelCount,
    referenceModelCount: KnowledgeServicesModel.inventory.referenceModelCount,
    graphModelCount: KnowledgeServicesModel.inventory.graphModelCount,
    relationshipCount: KnowledgeServicesModel.inventory.relationshipCount,
    registeredServiceCount: KnowledgeServicesRegistry.services.length,
    registeredCapabilityCount: KnowledgeServicesRegistry.capabilities.length,
    registeredContractCount: KnowledgeServicesRegistry.contracts.length,
    approvedAccessModeCount: KnowledgeServicesRegistry.accessModes.length,
    mutationModeCount: 0 as const,
    readiness: "ReadyForValidation",
    metadataOnly: true,
    immutable: true,
    deterministic: true,
  });
}

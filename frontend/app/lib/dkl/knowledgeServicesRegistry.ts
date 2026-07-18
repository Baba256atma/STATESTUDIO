/**
 * DKL-7:2 — Knowledge Services Registry.
 *
 * Canonical immutable registry for the Knowledge Services architecture.
 * Consumes DKL-7:1 only through its canonical public foundation exports.
 * Metadata-only. Declaration-only. No service execution or runtime behavior.
 *
 * Ownership: owned exclusively by DKL-7:2.
 *
 * Public exports (exactly 10):
 *   KnowledgeServicesRegistry
 *   KnowledgeServicesRegistryId
 *   KnowledgeServicesRegistryName
 *   KnowledgeServicesRegistryVersion
 *   KnowledgeServicesRegistryNamespace
 *   KnowledgeServicesRegistryStatus
 *   KnowledgeServicesRegistryEntries
 *   KnowledgeServicesCapabilityRegistry
 *   getKnowledgeServicesRegistrySummary()
 *   getKnowledgeServicesRegistryInventoryCount()
 */

import {
  KnowledgeServicesFoundation,
  KnowledgeServicesFoundationId,
  KnowledgeServicesFoundationVersion,
} from "./knowledgeServicesFoundation.ts";
import { KnowledgeServicesCapabilityRegistry } from "./knowledgeServicesCapabilityRegistry.ts";
import { KnowledgeServicesContractRegistry } from "./knowledgeServicesContractRegistry.ts";
import { KnowledgeServicesLifecycleRegistry } from "./knowledgeServicesLifecycleRegistry.ts";
import { KnowledgeServicesOwnershipRegistry } from "./knowledgeServicesOwnershipRegistry.ts";
import { KnowledgeServicesRegistryEntries } from "./knowledgeServicesRegistryEntries.ts";
import type {
  KnowledgeServicesRegistryIdentity,
  KnowledgeServicesRegistryInventory,
  KnowledgeServicesRegistryMetadata,
  KnowledgeServicesRegistrySummary,
} from "./knowledgeServicesRegistryTypes.ts";

export const KnowledgeServicesRegistryId =
  "DKL-7:2/KnowledgeServicesRegistry" as const;

export const KnowledgeServicesRegistryName =
  "Knowledge Services Registry" as const;

export const KnowledgeServicesRegistryVersion = "1.0.0" as const;

export const KnowledgeServicesRegistryNamespace =
  "nexora.dkl.knowledge-services.registry" as const;

export const KnowledgeServicesRegistryStatus = "RegistryComplete" as const;

export {
  KnowledgeServicesRegistryEntries,
  KnowledgeServicesCapabilityRegistry,
};

const identity: KnowledgeServicesRegistryIdentity = Object.freeze({
  registryId: KnowledgeServicesRegistryId,
  registryName: KnowledgeServicesRegistryName,
  registryVersion: KnowledgeServicesRegistryVersion,
  registryNamespace: KnowledgeServicesRegistryNamespace,
  layer: "Data Knowledge Layer",
  phase: "DKL-7",
  stage: "Registry",
  sourcePhase: "DKL-7:2",
  owner: "DKL-7 Knowledge Services",
  status: KnowledgeServicesRegistryStatus,
  readiness: "ReadyForModel",
  foundationId: KnowledgeServicesFoundationId,
  foundationVersion: KnowledgeServicesFoundationVersion,
  metadataOnly: true,
  immutable: true,
});

const metadata: KnowledgeServicesRegistryMetadata = Object.freeze({
  metadataId: "DKL-7:2/KnowledgeServicesRegistryMetadata",
  registryId: KnowledgeServicesRegistryId,
  description:
    "Canonical immutable registry of Knowledge Services architecture declared by DKL-7:1.",
  categoryCount: 10,
  metadataOnly: true,
  declarationOnly: true,
  runtimeBehavior: false,
  immutable: true,
  deterministic: true,
});

const inventory: KnowledgeServicesRegistryInventory = Object.freeze({
  inventoryId: "DKL-7:2/KnowledgeServicesRegistryInventory",
  categoryCounts: Object.freeze({
    service: KnowledgeServicesRegistryEntries.serviceCount,
    capability: KnowledgeServicesCapabilityRegistry.capabilityCount,
    contract: KnowledgeServicesContractRegistry.contractCount,
    lifecycle: KnowledgeServicesLifecycleRegistry.stageCount,
    ownership:
      KnowledgeServicesOwnershipRegistry.ownedCount +
      KnowledgeServicesOwnershipRegistry.nonOwnedCount,
    boundary: KnowledgeServicesOwnershipRegistry.prohibitedSurfaceCount,
    requestCategory: KnowledgeServicesRegistryEntries.requestCategoryCount,
    responseCategory: KnowledgeServicesRegistryEntries.responseCategoryCount,
    accessMode: KnowledgeServicesRegistryEntries.accessModeCount,
    relationship: KnowledgeServicesRegistryEntries.relationshipCount,
  }),
  totalEntryCount:
    KnowledgeServicesRegistryEntries.serviceCount +
    KnowledgeServicesCapabilityRegistry.capabilityCount +
    KnowledgeServicesContractRegistry.contractCount +
    KnowledgeServicesLifecycleRegistry.stageCount +
    KnowledgeServicesOwnershipRegistry.ownedCount +
    KnowledgeServicesOwnershipRegistry.nonOwnedCount +
    KnowledgeServicesOwnershipRegistry.prohibitedSurfaceCount +
    KnowledgeServicesRegistryEntries.requestCategoryCount +
    KnowledgeServicesRegistryEntries.responseCategoryCount +
    KnowledgeServicesRegistryEntries.accessModeCount +
    KnowledgeServicesRegistryEntries.relationshipCount,
  prohibitedMutationModes:
    KnowledgeServicesRegistryEntries.prohibitedMutationModes,
  metadataOnly: true,
  immutable: true,
  deterministic: true,
});

/** Canonical immutable Knowledge Services Registry aggregate. */
export const KnowledgeServicesRegistry = Object.freeze({
  identity,
  metadata,
  /**
   * Canonical DKL-7:1 Foundation preserved by reference.
   * Additive gateway fields live on Foundation itself for chain consumers.
   */
  foundation: KnowledgeServicesFoundation,
  services: KnowledgeServicesRegistryEntries.services,
  capabilities: KnowledgeServicesCapabilityRegistry.capabilities,
  contracts: KnowledgeServicesContractRegistry.contracts,
  lifecycle: KnowledgeServicesLifecycleRegistry.stages,
  ownership: Object.freeze({
    owns: KnowledgeServicesOwnershipRegistry.owns,
    doesNotOwn: KnowledgeServicesOwnershipRegistry.doesNotOwn,
    ownedCount: KnowledgeServicesOwnershipRegistry.ownedCount,
    nonOwnedCount: KnowledgeServicesOwnershipRegistry.nonOwnedCount,
    foundationOwns: KnowledgeServicesOwnershipRegistry.foundationOwns,
    foundationDoesNotOwn:
      KnowledgeServicesOwnershipRegistry.foundationDoesNotOwn,
  }),
  boundaries: KnowledgeServicesOwnershipRegistry.boundaries,
  requestCategories: KnowledgeServicesRegistryEntries.requestCategories,
  responseCategories: KnowledgeServicesRegistryEntries.responseCategories,
  accessModes: KnowledgeServicesRegistryEntries.accessModes,
  relationships: KnowledgeServicesRegistryEntries.relationships,
  inventory,
  status: KnowledgeServicesRegistryStatus,
  readiness: "ReadyForModel" as const,
  guarantees: Object.freeze({
    everyServiceRegisteredOnce: true as const,
    everyFoundationCapabilityPreserved: true as const,
    everyFoundationContractRegistered: true as const,
    knowledgeServicesRemainReadOnly: true as const,
    noRepositoryImplementationOwnership: true as const,
    noTransportOrAuthenticationOwnership: true as const,
    noReasoningOrDecisions: true as const,
    deterministicMetadata: true as const,
    immutableCollections: true as const,
    singleCanonicalRegistry: true as const,
    noDkl6InternalImports: true as const,
    noRuntimeBehavior: true as const,
  }),
  nextPhase: "DKL-7:3 — Knowledge Services Model",
  metadataOnly: true as const,
  runtimeBehavior: false as const,
  serviceExecution: false as const,
  createsKnowledge: false as const,
  modifiesKnowledge: false as const,
  performsExecutiveReasoning: false as const,
  immutable: true as const,
  deterministic: true as const,
});

/** Deterministic total inventory entry count. */
export function getKnowledgeServicesRegistryInventoryCount(): number {
  return KnowledgeServicesRegistry.inventory.totalEntryCount;
}

/** Deterministic immutable registry summary. */
export function getKnowledgeServicesRegistrySummary(): KnowledgeServicesRegistrySummary {
  return Object.freeze({
    registryId: KnowledgeServicesRegistryId,
    version: KnowledgeServicesRegistryVersion,
    status: KnowledgeServicesRegistryStatus,
    foundationId: KnowledgeServicesFoundationId,
    foundationVersion: KnowledgeServicesFoundationVersion,
    serviceCount: KnowledgeServicesRegistry.services.length,
    capabilityCount: KnowledgeServicesRegistry.capabilities.length,
    contractCount: KnowledgeServicesRegistry.contracts.length,
    lifecycleCount: KnowledgeServicesRegistry.lifecycle.length,
    ownedResponsibilityCount: KnowledgeServicesRegistry.ownership.ownedCount,
    nonOwnedResponsibilityCount:
      KnowledgeServicesRegistry.ownership.nonOwnedCount,
    prohibitedSurfaceCount: KnowledgeServicesRegistry.boundaries.length,
    requestCategoryCount: KnowledgeServicesRegistry.requestCategories.length,
    responseCategoryCount: KnowledgeServicesRegistry.responseCategories.length,
    accessModeCount: KnowledgeServicesRegistry.accessModes.length,
    relationshipCount: KnowledgeServicesRegistry.relationships.length,
    totalEntryCount: KnowledgeServicesRegistry.inventory.totalEntryCount,
    readiness: "ReadyForModel",
    metadataOnly: true,
    immutable: true,
    deterministic: true,
  });
}

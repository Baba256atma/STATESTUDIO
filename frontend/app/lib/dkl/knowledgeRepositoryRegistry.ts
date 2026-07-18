/**
 * DKL-6:2 — Knowledge Repository Registry.
 *
 * Canonical immutable registry layer for the Nexora Knowledge Repository.
 * Consumes only the official public surface of DKL-6:1 Foundation.
 * Metadata-only. Declaration-only. No persistence, storage, or runtime.
 *
 * Ownership: owned exclusively by DKL-6:2.
 *
 * Public exports (exactly 8):
 *   KnowledgeRepositoryRegistry
 *   KnowledgeRepositoryRegistryId
 *   KnowledgeRepositoryRegistryVersion
 *   KnowledgeRepositoryRegistryName
 *   KnowledgeRepositoryRegistryNamespace
 *   KnowledgeRepositoryRegistryStatus
 *   getKnowledgeRepositoryRegistrySummary()
 *   getKnowledgeRepositoryRegistryEntryCount()
 */

import {
  KnowledgeRepositoryFoundation,
  KnowledgeRepositoryFoundationId,
  KnowledgeRepositoryFoundationVersion,
} from "./knowledgeRepositoryFoundation.ts";
import { KnowledgeRepositoryComponentEntries } from "./knowledgeRepositoryComponentRegistry.ts";
import {
  KnowledgeRepositoryCapabilityEntries,
  KnowledgeRepositoryContractEntries,
  KnowledgeRepositoryLifecycleEntries,
  KnowledgeRepositoryPolicyEntries,
  KnowledgeRepositoryRetentionPolicyEntries,
} from "./knowledgeRepositoryPolicyRegistry.ts";
import type {
  KnowledgeRepositoryRegistryIdentityDescriptor,
  KnowledgeRepositoryRegistrySummaryDescriptor,
} from "./knowledgeRepositoryRegistryTypes.ts";
import {
  KnowledgeRepositoryIndexDeclarationEntries,
  KnowledgeRepositoryRetrievalDeclarationEntries,
  KnowledgeRepositorySnapshotTypeEntries,
} from "./knowledgeRepositorySnapshotRegistry.ts";
import {
  KnowledgeRepositoryRecordTypeEntries,
  KnowledgeRepositoryTypeEntries,
} from "./knowledgeRepositoryTypeRegistry.ts";
import {
  KnowledgeRepositoryArchiveStateEntries,
  KnowledgeRepositoryHistoryEventTypeEntries,
  KnowledgeRepositoryVersionTypeEntries,
} from "./knowledgeRepositoryVersionRegistry.ts";

export const KnowledgeRepositoryRegistryId =
  "DKL-6:2/KnowledgeRepositoryRegistry" as const;

export const KnowledgeRepositoryRegistryVersion = "1.0.0" as const;

export const KnowledgeRepositoryRegistryName =
  "Knowledge Repository Registry" as const;

export const KnowledgeRepositoryRegistryNamespace =
  "nexora.dkl.repository.registry" as const;

export const KnowledgeRepositoryRegistryStatus = "Registered" as const;

const identity: KnowledgeRepositoryRegistryIdentityDescriptor = Object.freeze({
  registryId: KnowledgeRepositoryRegistryId,
  registryName: KnowledgeRepositoryRegistryName,
  registryVersion: KnowledgeRepositoryRegistryVersion,
  registryNamespace: KnowledgeRepositoryRegistryNamespace,
  phase: "DKL-6:2",
  owner: "DKL-6",
  status: KnowledgeRepositoryRegistryStatus,
  readiness: "ReadyForDKL6Model",
  metadataOnly: true,
  immutable: true,
});

const REGISTRY_GROUP_COUNT = 16;

/** Canonical immutable Knowledge Repository Registry aggregate. */
export const KnowledgeRepositoryRegistry = Object.freeze({
  identity,
  repositoryTypes: KnowledgeRepositoryTypeEntries,
  components: KnowledgeRepositoryComponentEntries,
  knowledgeRecordTypes: KnowledgeRepositoryRecordTypeEntries,
  versionTypes: KnowledgeRepositoryVersionTypeEntries,
  snapshotTypes: KnowledgeRepositorySnapshotTypeEntries,
  historyEventTypes: KnowledgeRepositoryHistoryEventTypeEntries,
  archiveStates: KnowledgeRepositoryArchiveStateEntries,
  retentionPolicies: KnowledgeRepositoryRetentionPolicyEntries,
  indexDeclarations: KnowledgeRepositoryIndexDeclarationEntries,
  retrievalDeclarations: KnowledgeRepositoryRetrievalDeclarationEntries,
  capabilities: KnowledgeRepositoryCapabilityEntries,
  contracts: KnowledgeRepositoryContractEntries,
  lifecycle: KnowledgeRepositoryLifecycleEntries,
  policies: KnowledgeRepositoryPolicyEntries,
  ownership: KnowledgeRepositoryFoundation.ownership,
  boundaries: KnowledgeRepositoryFoundation.boundaries,
  foundation: Object.freeze({
    foundationId: KnowledgeRepositoryFoundationId,
    foundationVersion: KnowledgeRepositoryFoundationVersion,
    foundationNamespace: KnowledgeRepositoryFoundation.namespace,
    foundationStatus: KnowledgeRepositoryFoundation.status,
    soleArchitecturalDependency: true as const,
    referencedThroughPublicFoundation: true as const,
  }),
  guarantees: Object.freeze({
    uniqueIdentifiers: true as const,
    deterministicOrdering: true as const,
    immutableEntries: true as const,
    metadataOnly: true as const,
    runtimeBehaviorNone: true as const,
    noPhysicalStorageTechnology: true as const,
    noPersistence: true as const,
    noRepositoryRuntime: true as const,
  }),
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});

/** Deterministic total entry count derived from registry contents. */
export function getKnowledgeRepositoryRegistryEntryCount(): number {
  return (
    KnowledgeRepositoryRegistry.repositoryTypes.length +
    KnowledgeRepositoryRegistry.components.length +
    KnowledgeRepositoryRegistry.knowledgeRecordTypes.length +
    KnowledgeRepositoryRegistry.versionTypes.length +
    KnowledgeRepositoryRegistry.snapshotTypes.length +
    KnowledgeRepositoryRegistry.historyEventTypes.length +
    KnowledgeRepositoryRegistry.archiveStates.length +
    KnowledgeRepositoryRegistry.retentionPolicies.length +
    KnowledgeRepositoryRegistry.indexDeclarations.length +
    KnowledgeRepositoryRegistry.retrievalDeclarations.length +
    KnowledgeRepositoryRegistry.capabilities.length +
    KnowledgeRepositoryRegistry.contracts.length +
    KnowledgeRepositoryRegistry.lifecycle.length +
    KnowledgeRepositoryRegistry.policies.length
  );
}

/** Deterministic immutable registry summary. */
export function getKnowledgeRepositoryRegistrySummary(): KnowledgeRepositoryRegistrySummaryDescriptor {
  return Object.freeze({
    registryId: KnowledgeRepositoryRegistryId,
    version: KnowledgeRepositoryRegistryVersion,
    namespace: KnowledgeRepositoryRegistryNamespace,
    status: KnowledgeRepositoryRegistryStatus,
    foundationDependencyId: KnowledgeRepositoryFoundationId,
    foundationDependencyVersion: KnowledgeRepositoryFoundationVersion,
    registryGroupCount: REGISTRY_GROUP_COUNT,
    totalEntryCount: getKnowledgeRepositoryRegistryEntryCount(),
    repositoryTypeCount: KnowledgeRepositoryRegistry.repositoryTypes.length,
    componentCount: KnowledgeRepositoryRegistry.components.length,
    knowledgeRecordTypeCount:
      KnowledgeRepositoryRegistry.knowledgeRecordTypes.length,
    versionTypeCount: KnowledgeRepositoryRegistry.versionTypes.length,
    snapshotTypeCount: KnowledgeRepositoryRegistry.snapshotTypes.length,
    historyEventTypeCount: KnowledgeRepositoryRegistry.historyEventTypes.length,
    archiveStateCount: KnowledgeRepositoryRegistry.archiveStates.length,
    retentionPolicyCount: KnowledgeRepositoryRegistry.retentionPolicies.length,
    indexDeclarationCount: KnowledgeRepositoryRegistry.indexDeclarations.length,
    retrievalDeclarationCount:
      KnowledgeRepositoryRegistry.retrievalDeclarations.length,
    capabilityCount: KnowledgeRepositoryRegistry.capabilities.length,
    contractCount: KnowledgeRepositoryRegistry.contracts.length,
    lifecycleCount: KnowledgeRepositoryRegistry.lifecycle.length,
    policyCount: KnowledgeRepositoryRegistry.policies.length,
    readiness: "ReadyForDKL6Model",
    metadataOnly: true,
    immutable: true,
    deterministic: true,
  });
}

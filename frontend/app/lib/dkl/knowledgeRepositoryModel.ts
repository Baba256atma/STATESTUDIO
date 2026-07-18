/**
 * DKL-6:3 — Knowledge Repository Model.
 *
 * Canonical immutable logical model layer for the Nexora Knowledge Repository.
 * Consumes only DKL-6:1 Foundation and DKL-6:2 Registry public surfaces.
 * Metadata-only. Model-only. No persistence, storage, or runtime behavior.
 *
 * Ownership: owned exclusively by DKL-6:3.
 *
 * Public exports (exactly 8):
 *   KnowledgeRepositoryModel
 *   KnowledgeRepositoryModelId
 *   KnowledgeRepositoryModelVersion
 *   KnowledgeRepositoryModelName
 *   KnowledgeRepositoryModelNamespace
 *   KnowledgeRepositoryModelStatus
 *   getKnowledgeRepositoryModelSummary()
 *   getKnowledgeRepositoryModelCount()
 */

import {
  KnowledgeRepositoryFoundation,
  KnowledgeRepositoryFoundationId,
  KnowledgeRepositoryFoundationVersion,
} from "./knowledgeRepositoryFoundation.ts";
import {
  KnowledgeRepositoryArchiveModelDescriptor,
  KnowledgeRepositoryArchiveStates,
  KnowledgeRepositoryHistoryModelInventory,
} from "./knowledgeRepositoryHistoryModels.ts";
import type {
  KnowledgeRepositoryModelIdentityDescriptor,
  KnowledgeRepositoryModelSummaryDescriptor,
  RegistryTraceabilityEntry,
} from "./knowledgeRepositoryModelTypes.ts";
import {
  KnowledgeRepositoryIndexModelInventory,
  KnowledgeRepositoryModelRelationships,
  KnowledgeRepositoryRetentionModelInventory,
  KnowledgeRepositoryRetrievalModelInventory,
} from "./knowledgeRepositoryPolicyModels.ts";
import {
  KnowledgeRepositoryAggregateStructureDescriptor,
  KnowledgeRepositoryBaseRecordModelDescriptor,
  KnowledgeRepositoryIdentityModelDescriptor,
  KnowledgeRepositoryRecordModelInventory,
} from "./knowledgeRepositoryRecordModels.ts";
import {
  KnowledgeRepositoryRegistry,
  KnowledgeRepositoryRegistryId,
  KnowledgeRepositoryRegistryVersion,
} from "./knowledgeRepositoryRegistry.ts";
import { KnowledgeRepositorySnapshotModelInventory } from "./knowledgeRepositorySnapshotModels.ts";
import { KnowledgeRepositoryVersionModelInventory } from "./knowledgeRepositoryVersionModels.ts";

export const KnowledgeRepositoryModelId =
  "DKL-6:3/KnowledgeRepositoryModel" as const;

export const KnowledgeRepositoryModelVersion = "1.0.0" as const;

export const KnowledgeRepositoryModelName =
  "Knowledge Repository Model" as const;

export const KnowledgeRepositoryModelNamespace =
  "nexora.dkl.repository.model" as const;

export const KnowledgeRepositoryModelStatus = "Modeled" as const;

const identity: KnowledgeRepositoryModelIdentityDescriptor = Object.freeze({
  modelId: KnowledgeRepositoryModelId,
  modelName: KnowledgeRepositoryModelName,
  modelVersion: KnowledgeRepositoryModelVersion,
  modelNamespace: KnowledgeRepositoryModelNamespace,
  phase: "DKL-6:3",
  owner: "DKL-6",
  status: KnowledgeRepositoryModelStatus,
  readiness: "ReadyForDKL6Validation",
  metadataOnly: true,
  immutable: true,
});

const repository = Object.freeze({
  aggregate: KnowledgeRepositoryAggregateStructureDescriptor,
  identityModel: KnowledgeRepositoryIdentityModelDescriptor,
  baseRecordContract: KnowledgeRepositoryBaseRecordModelDescriptor,
  sections: Object.freeze([
    "identity",
    "records",
    "versions",
    "snapshots",
    "history",
    "archive",
    "retention",
    "indexes",
    "retrieval",
    "metadata",
    "relationships",
    "lifecycle",
    "ownership",
    "boundaries",
  ] as const),
});

const archiveModel = Object.freeze({
  model: KnowledgeRepositoryArchiveModelDescriptor,
  supportedStates: KnowledgeRepositoryArchiveStates,
});

const registryTraceability: readonly RegistryTraceabilityEntry[] = Object.freeze([
  Object.freeze({
    group: "RepositoryTypes",
    registrySection: "repositoryTypes",
    entryCount: KnowledgeRepositoryRegistry.repositoryTypes.length,
    modeled: true as const,
    deterministicOrder: 1,
  }),
  Object.freeze({
    group: "Components",
    registrySection: "components",
    entryCount: KnowledgeRepositoryRegistry.components.length,
    modeled: true as const,
    deterministicOrder: 2,
  }),
  Object.freeze({
    group: "KnowledgeRecordTypes",
    registrySection: "knowledgeRecordTypes",
    entryCount: KnowledgeRepositoryRegistry.knowledgeRecordTypes.length,
    modeled: true as const,
    deterministicOrder: 3,
  }),
  Object.freeze({
    group: "VersionTypes",
    registrySection: "versionTypes",
    entryCount: KnowledgeRepositoryRegistry.versionTypes.length,
    modeled: true as const,
    deterministicOrder: 4,
  }),
  Object.freeze({
    group: "SnapshotTypes",
    registrySection: "snapshotTypes",
    entryCount: KnowledgeRepositoryRegistry.snapshotTypes.length,
    modeled: true as const,
    deterministicOrder: 5,
  }),
  Object.freeze({
    group: "HistoryEventTypes",
    registrySection: "historyEventTypes",
    entryCount: KnowledgeRepositoryRegistry.historyEventTypes.length,
    modeled: true as const,
    deterministicOrder: 6,
  }),
  Object.freeze({
    group: "ArchiveStates",
    registrySection: "archiveStates",
    entryCount: KnowledgeRepositoryRegistry.archiveStates.length,
    modeled: true as const,
    deterministicOrder: 7,
  }),
  Object.freeze({
    group: "RetentionPolicies",
    registrySection: "retentionPolicies",
    entryCount: KnowledgeRepositoryRegistry.retentionPolicies.length,
    modeled: true as const,
    deterministicOrder: 8,
  }),
  Object.freeze({
    group: "IndexDeclarations",
    registrySection: "indexDeclarations",
    entryCount: KnowledgeRepositoryRegistry.indexDeclarations.length,
    modeled: true as const,
    deterministicOrder: 9,
  }),
  Object.freeze({
    group: "RetrievalDeclarations",
    registrySection: "retrievalDeclarations",
    entryCount: KnowledgeRepositoryRegistry.retrievalDeclarations.length,
    modeled: true as const,
    deterministicOrder: 10,
  }),
  Object.freeze({
    group: "FoundationCapabilities",
    registrySection: "capabilities",
    entryCount: KnowledgeRepositoryRegistry.capabilities.length,
    modeled: true as const,
    deterministicOrder: 11,
  }),
  Object.freeze({
    group: "FoundationContracts",
    registrySection: "contracts",
    entryCount: KnowledgeRepositoryRegistry.contracts.length,
    modeled: true as const,
    deterministicOrder: 12,
  }),
  Object.freeze({
    group: "FoundationLifecycle",
    registrySection: "lifecycle",
    entryCount: KnowledgeRepositoryRegistry.lifecycle.length,
    modeled: true as const,
    deterministicOrder: 13,
  }),
  Object.freeze({
    group: "FoundationPolicies",
    registrySection: "policies",
    entryCount: KnowledgeRepositoryRegistry.policies.length,
    modeled: true as const,
    deterministicOrder: 14,
  }),
]);

const lifecycle = Object.freeze({
  states: KnowledgeRepositoryFoundation.lifecycle.states,
  stateCount: KnowledgeRepositoryFoundation.lifecycle.stateCount,
  source: KnowledgeRepositoryFoundationId,
  executableTransitions: false as const,
});

/** Canonical immutable Knowledge Repository Model aggregate. */
export const KnowledgeRepositoryModel = Object.freeze({
  identity,
  repository,
  recordModels: KnowledgeRepositoryRecordModelInventory,
  versionModels: KnowledgeRepositoryVersionModelInventory,
  snapshotModels: KnowledgeRepositorySnapshotModelInventory,
  historyModels: KnowledgeRepositoryHistoryModelInventory,
  archiveModel,
  retentionModels: KnowledgeRepositoryRetentionModelInventory,
  indexModels: KnowledgeRepositoryIndexModelInventory,
  retrievalModels: KnowledgeRepositoryRetrievalModelInventory,
  relationships: KnowledgeRepositoryModelRelationships,
  registryTraceability,
  lifecycle,
  ownership: KnowledgeRepositoryFoundation.ownership,
  boundaries: KnowledgeRepositoryFoundation.boundaries,
  readiness: "ReadyForDKL6Validation" as const,
  dependencies: Object.freeze({
    foundationId: KnowledgeRepositoryFoundationId,
    foundationVersion: KnowledgeRepositoryFoundationVersion,
    registryId: KnowledgeRepositoryRegistryId,
    registryVersion: KnowledgeRepositoryRegistryVersion,
    consumesPublicSurfacesOnly: true as const,
  }),
  guarantees: Object.freeze({
    metadataOnly: true as const,
    immutable: true as const,
    deterministic: true as const,
    storageAgnostic: true as const,
    technologyNeutral: true as const,
    runtimeFree: true as const,
    noPersistence: true as const,
    noQueryExecution: true as const,
    noIndexConstruction: true as const,
    noRetrievalExecution: true as const,
    noMutationApis: true as const,
  }),
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});

/** Deterministic total model count derived from inventories. */
export function getKnowledgeRepositoryModelCount(): number {
  return (
    1 + // identity model
    1 + // repository aggregate
    KnowledgeRepositoryModel.recordModels.length +
    KnowledgeRepositoryModel.versionModels.length +
    KnowledgeRepositoryModel.snapshotModels.length +
    KnowledgeRepositoryModel.historyModels.length +
    1 + // archive model
    KnowledgeRepositoryModel.retentionModels.length +
    KnowledgeRepositoryModel.indexModels.length +
    KnowledgeRepositoryModel.retrievalModels.length
  );
}

/** Deterministic immutable model summary. */
export function getKnowledgeRepositoryModelSummary(): KnowledgeRepositoryModelSummaryDescriptor {
  return Object.freeze({
    modelId: KnowledgeRepositoryModelId,
    version: KnowledgeRepositoryModelVersion,
    name: KnowledgeRepositoryModelName,
    namespace: KnowledgeRepositoryModelNamespace,
    status: KnowledgeRepositoryModelStatus,
    foundationDependencyId: KnowledgeRepositoryFoundationId,
    registryDependencyId: KnowledgeRepositoryRegistryId,
    repositoryAggregateCount: 1,
    recordModelCount: KnowledgeRepositoryModel.recordModels.length,
    versionModelCount: KnowledgeRepositoryModel.versionModels.length,
    snapshotModelCount: KnowledgeRepositoryModel.snapshotModels.length,
    historyModelCount: KnowledgeRepositoryModel.historyModels.length,
    archiveModelCount: 1,
    retentionModelCount: KnowledgeRepositoryModel.retentionModels.length,
    indexModelCount: KnowledgeRepositoryModel.indexModels.length,
    retrievalModelCount: KnowledgeRepositoryModel.retrievalModels.length,
    relationshipCount: KnowledgeRepositoryModel.relationships.length,
    lifecycleCount: KnowledgeRepositoryModel.lifecycle.stateCount,
    registryTraceabilityCount: KnowledgeRepositoryModel.registryTraceability.length,
    totalModelCount: getKnowledgeRepositoryModelCount(),
    readiness: "ReadyForDKL6Validation",
    metadataOnly: true,
    immutable: true,
    deterministic: true,
  });
}

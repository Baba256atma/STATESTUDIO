/**
 * DKL-6:3 — Knowledge Repository History Models.
 *
 * Eight history event models and the canonical archive model.
 * Declarations only — no event sourcing or archive execution.
 *
 * Ownership: owned exclusively by DKL-6:3.
 */

import { KnowledgeRepositoryRegistry } from "./knowledgeRepositoryRegistry.ts";
import type {
  ArchiveStateName,
  KnowledgeRepositoryModelDescriptor,
} from "./knowledgeRepositoryModelTypes.ts";

const HISTORY_BASE_FIELDS = Object.freeze([
  "eventId",
  "eventType",
  "subjectReference",
  "repositoryReference",
  "versionReference",
  "lifecycleState",
  "status",
  "metadataReference",
] as const);

const ARCHIVE_FIELDS = Object.freeze([
  "archiveId",
  "subjectReference",
  "archiveState",
  "versionReference",
  "retentionPolicyReference",
  "previousState",
  "nextState",
  "status",
  "metadataReference",
] as const);

const historyRef = (name: string): string => {
  const entry = KnowledgeRepositoryRegistry.historyEventTypes.find(
    (item) => item.name === name,
  );
  return entry?.id ?? `DKL-6:2/HistoryEventType/${name}`;
};

const componentRef = (name: string): string => {
  const entry = KnowledgeRepositoryRegistry.components.find(
    (item) => item.name === name,
  );
  return entry?.id ?? `DKL-6:2/Component/${name}`;
};

const historyDescriptor = (
  modelId: string,
  modelName: string,
  eventTypeName: string,
  description: string,
  deterministicOrder: number,
): KnowledgeRepositoryModelDescriptor =>
  Object.freeze({
    modelId,
    modelName,
    modelCategory: "HistoryEventModel",
    description,
    registryGroup: "HistoryEventType",
    registryEntryReference: historyRef(eventTypeName),
    owner: "DKL-6" as const,
    status: "Modeled" as const,
    metadataOnly: true as const,
    runtimeBehavior: "None" as const,
    fields: HISTORY_BASE_FIELDS,
    deterministicOrder,
  });

export const CreatedHistoryEventModel: KnowledgeRepositoryModelDescriptor =
  historyDescriptor(
    "DKL-6:3/Model/CreatedHistoryEvent",
    "CreatedHistoryEventModel",
    "Created",
    "History event model for repository content creation.",
    1,
  );

export const ValidatedHistoryEventModel: KnowledgeRepositoryModelDescriptor =
  historyDescriptor(
    "DKL-6:3/Model/ValidatedHistoryEvent",
    "ValidatedHistoryEventModel",
    "Validated",
    "History event model for validated repository content.",
    2,
  );

export const StoredHistoryEventModel: KnowledgeRepositoryModelDescriptor =
  historyDescriptor(
    "DKL-6:3/Model/StoredHistoryEvent",
    "StoredHistoryEventModel",
    "Stored",
    "History event model for logically stored repository content.",
    3,
  );

export const VersionedHistoryEventModel: KnowledgeRepositoryModelDescriptor =
  historyDescriptor(
    "DKL-6:3/Model/VersionedHistoryEvent",
    "VersionedHistoryEventModel",
    "Versioned",
    "History event model for versioned repository content.",
    4,
  );

export const RetrievedHistoryEventModel: KnowledgeRepositoryModelDescriptor =
  historyDescriptor(
    "DKL-6:3/Model/RetrievedHistoryEvent",
    "RetrievedHistoryEventModel",
    "Retrieved",
    "History event model for retrieved repository content.",
    5,
  );

export const ArchivedHistoryEventModel: KnowledgeRepositoryModelDescriptor =
  historyDescriptor(
    "DKL-6:3/Model/ArchivedHistoryEvent",
    "ArchivedHistoryEventModel",
    "Archived",
    "History event model for archived repository content.",
    6,
  );

export const RestoredHistoryEventModel: KnowledgeRepositoryModelDescriptor =
  historyDescriptor(
    "DKL-6:3/Model/RestoredHistoryEvent",
    "RestoredHistoryEventModel",
    "Restored",
    "History event model for restored repository content.",
    7,
  );

export const FrozenHistoryEventModel: KnowledgeRepositoryModelDescriptor =
  historyDescriptor(
    "DKL-6:3/Model/FrozenHistoryEvent",
    "FrozenHistoryEventModel",
    "Frozen",
    "History event model for frozen repository content.",
    8,
  );

/** Ordered canonical history event model inventory. */
export const KnowledgeRepositoryHistoryModelInventory: readonly KnowledgeRepositoryModelDescriptor[] =
  Object.freeze([
    CreatedHistoryEventModel,
    ValidatedHistoryEventModel,
    StoredHistoryEventModel,
    VersionedHistoryEventModel,
    RetrievedHistoryEventModel,
    ArchivedHistoryEventModel,
    RestoredHistoryEventModel,
    FrozenHistoryEventModel,
  ]);

/** Supported archive states corresponding exactly to DKL-6:2. */
export const KnowledgeRepositoryArchiveStates: readonly ArchiveStateName[] =
  Object.freeze(
    KnowledgeRepositoryRegistry.archiveStates.map(
      (entry) => entry.name as ArchiveStateName,
    ),
  );

/** Canonical archive model descriptor. */
export const KnowledgeRepositoryArchiveModelDescriptor: KnowledgeRepositoryModelDescriptor =
  Object.freeze({
    modelId: "DKL-6:3/Model/RepositoryArchive",
    modelName: "KnowledgeRepositoryArchiveModel",
    modelCategory: "ArchiveModel",
    description:
      "Canonical immutable archive model for repository archive state declarations.",
    registryGroup: "ArchiveState",
    registryEntryReference: componentRef("RepositoryArchive"),
    owner: "DKL-6" as const,
    status: "Modeled" as const,
    metadataOnly: true as const,
    runtimeBehavior: "None" as const,
    fields: ARCHIVE_FIELDS,
    deterministicOrder: 1,
  });

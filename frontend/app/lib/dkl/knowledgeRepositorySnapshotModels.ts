/**
 * DKL-6:3 — Knowledge Repository Snapshot Models.
 *
 * Six immutable snapshot model declarations. No generation or time-travel.
 *
 * Ownership: owned exclusively by DKL-6:3.
 */

import { KnowledgeRepositoryRegistry } from "./knowledgeRepositoryRegistry.ts";
import type { KnowledgeRepositoryModelDescriptor } from "./knowledgeRepositoryModelTypes.ts";

const SNAPSHOT_BASE_FIELDS = Object.freeze([
  "snapshotId",
  "snapshotType",
  "repositoryReference",
  "subjectReferences",
  "versionReferences",
  "contextReference",
  "lifecycleState",
  "status",
  "metadataReference",
] as const);

const snapshotRef = (name: string): string => {
  const entry = KnowledgeRepositoryRegistry.snapshotTypes.find(
    (item) => item.name === name,
  );
  return entry?.id ?? `DKL-6:2/SnapshotType/${name}`;
};

const descriptor = (
  modelId: string,
  modelName: string,
  snapshotTypeName: string,
  description: string,
  extraFields: readonly string[],
  deterministicOrder: number,
): KnowledgeRepositoryModelDescriptor =>
  Object.freeze({
    modelId,
    modelName,
    modelCategory: "SnapshotModel",
    description,
    registryGroup: "SnapshotType",
    registryEntryReference: snapshotRef(snapshotTypeName),
    owner: "DKL-6" as const,
    status: "Modeled" as const,
    metadataOnly: true as const,
    runtimeBehavior: "None" as const,
    fields: Object.freeze([...SNAPSHOT_BASE_FIELDS, ...extraFields]),
    deterministicOrder,
  });

export const CurrentSnapshotModel: KnowledgeRepositoryModelDescriptor =
  descriptor(
    "DKL-6:3/Model/CurrentSnapshot",
    "CurrentSnapshotModel",
    "CurrentSnapshot",
    "Logical snapshot model for the current repository declaration.",
    Object.freeze([]),
    1,
  );

export const PointInTimeSnapshotModel: KnowledgeRepositoryModelDescriptor =
  descriptor(
    "DKL-6:3/Model/PointInTimeSnapshot",
    "PointInTimeSnapshotModel",
    "PointInTimeSnapshot",
    "Logical snapshot model that may declare a logical time reference.",
    Object.freeze(["logicalTimeReference"]),
    2,
  );

export const DecisionSnapshotModel: KnowledgeRepositoryModelDescriptor =
  descriptor(
    "DKL-6:3/Model/DecisionSnapshot",
    "DecisionSnapshotModel",
    "DecisionSnapshot",
    "Logical snapshot model that may declare a decision reference.",
    Object.freeze(["decisionReference"]),
    3,
  );

export const OperationalSnapshotModel: KnowledgeRepositoryModelDescriptor =
  descriptor(
    "DKL-6:3/Model/OperationalSnapshot",
    "OperationalSnapshotModel",
    "OperationalSnapshot",
    "Logical snapshot model that may declare an operational context reference.",
    Object.freeze(["operationalContextReference"]),
    4,
  );

export const HistoricalSnapshotModel: KnowledgeRepositoryModelDescriptor =
  descriptor(
    "DKL-6:3/Model/HistoricalSnapshot",
    "HistoricalSnapshotModel",
    "HistoricalSnapshot",
    "Logical snapshot model that may declare a history reference.",
    Object.freeze(["historyReference"]),
    5,
  );

export const FrozenSnapshotModel: KnowledgeRepositoryModelDescriptor = descriptor(
  "DKL-6:3/Model/FrozenSnapshot",
  "FrozenSnapshotModel",
  "FrozenSnapshot",
  "Logical snapshot model with immutable status metadata.",
  Object.freeze(["immutableStatusMetadata"]),
  6,
);

/** Ordered canonical snapshot model inventory. */
export const KnowledgeRepositorySnapshotModelInventory: readonly KnowledgeRepositoryModelDescriptor[] =
  Object.freeze([
    CurrentSnapshotModel,
    PointInTimeSnapshotModel,
    DecisionSnapshotModel,
    OperationalSnapshotModel,
    HistoricalSnapshotModel,
    FrozenSnapshotModel,
  ]);

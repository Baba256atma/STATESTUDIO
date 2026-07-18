/**
 * DKL-6:3 — Knowledge Repository Version Models.
 *
 * Six immutable version model declarations. No version calculation or mutation.
 *
 * Ownership: owned exclusively by DKL-6:3.
 */

import { KnowledgeRepositoryRegistry } from "./knowledgeRepositoryRegistry.ts";
import type { KnowledgeRepositoryModelDescriptor } from "./knowledgeRepositoryModelTypes.ts";

const VERSION_BASE_FIELDS = Object.freeze([
  "versionId",
  "versionType",
  "subjectReference",
  "previousVersionReference",
  "nextVersionReference",
  "reason",
  "status",
  "lifecycleState",
  "metadataReference",
] as const);

const versionRef = (name: string): string => {
  const entry = KnowledgeRepositoryRegistry.versionTypes.find(
    (item) => item.name === name,
  );
  return entry?.id ?? `DKL-6:2/VersionType/${name}`;
};

const descriptor = (
  modelId: string,
  modelName: string,
  versionTypeName: string,
  description: string,
  deterministicOrder: number,
): KnowledgeRepositoryModelDescriptor =>
  Object.freeze({
    modelId,
    modelName,
    modelCategory: "VersionModel",
    description,
    registryGroup: "VersionType",
    registryEntryReference: versionRef(versionTypeName),
    owner: "DKL-6" as const,
    status: "Modeled" as const,
    metadataOnly: true as const,
    runtimeBehavior: "None" as const,
    fields: VERSION_BASE_FIELDS,
    deterministicOrder,
  });

export const InitialVersionModel: KnowledgeRepositoryModelDescriptor = descriptor(
  "DKL-6:3/Model/InitialVersion",
  "InitialVersionModel",
  "InitialVersion",
  "Logical version model for an initial repository version with no previous version.",
  1,
);

export const RevisionVersionModel: KnowledgeRepositoryModelDescriptor = descriptor(
  "DKL-6:3/Model/RevisionVersion",
  "RevisionVersionModel",
  "RevisionVersion",
  "Logical version model for a revision that references a previous version.",
  2,
);

export const CorrectionVersionModel: KnowledgeRepositoryModelDescriptor =
  descriptor(
    "DKL-6:3/Model/CorrectionVersion",
    "CorrectionVersionModel",
    "CorrectionVersion",
    "Logical version model for a correction that references the corrected version.",
    3,
  );

export const SupersededVersionModel: KnowledgeRepositoryModelDescriptor =
  descriptor(
    "DKL-6:3/Model/SupersededVersion",
    "SupersededVersionModel",
    "SupersededVersion",
    "Logical version model indicating replacement by another version.",
    4,
  );

export const HistoricalVersionModel: KnowledgeRepositoryModelDescriptor =
  descriptor(
    "DKL-6:3/Model/HistoricalVersion",
    "HistoricalVersionModel",
    "HistoricalVersion",
    "Logical version model representing retained historical state.",
    5,
  );

export const FrozenVersionModel: KnowledgeRepositoryModelDescriptor = descriptor(
  "DKL-6:3/Model/FrozenVersion",
  "FrozenVersionModel",
  "FrozenVersion",
  "Logical version model representing an immutable released state.",
  6,
);

/** Ordered canonical version model inventory. */
export const KnowledgeRepositoryVersionModelInventory: readonly KnowledgeRepositoryModelDescriptor[] =
  Object.freeze([
    InitialVersionModel,
    RevisionVersionModel,
    CorrectionVersionModel,
    SupersededVersionModel,
    HistoricalVersionModel,
    FrozenVersionModel,
  ]);

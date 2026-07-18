/**
 * DKL-6:2 — Knowledge Repository Version Registry.
 *
 * Version types, history event types, and archive states.
 * Declarations only — no version calculation, event sourcing, or archive ops.
 *
 * Ownership: owned exclusively by DKL-6:2.
 */

import type { KnowledgeRepositoryRegistryEntry } from "./knowledgeRepositoryRegistryTypes.ts";

const entry = (
  id: string,
  name: string,
  group: KnowledgeRepositoryRegistryEntry["group"],
  description: string,
  deterministicOrder: number,
): KnowledgeRepositoryRegistryEntry =>
  Object.freeze({
    id,
    name,
    group,
    description,
    owner: "DKL-6" as const,
    status: "Registered" as const,
    runtimeBehavior: "None" as const,
    deterministicOrder,
  });

/** Exact version type vocabulary. */
export const KnowledgeRepositoryVersionTypeEntries: readonly KnowledgeRepositoryRegistryEntry[] =
  Object.freeze([
    entry(
      "DKL-6:2/VersionType/InitialVersion",
      "InitialVersion",
      "VersionType",
      "Logical version type for the first declared repository version.",
      1,
    ),
    entry(
      "DKL-6:2/VersionType/RevisionVersion",
      "RevisionVersion",
      "VersionType",
      "Logical version type for a revised repository version.",
      2,
    ),
    entry(
      "DKL-6:2/VersionType/CorrectionVersion",
      "CorrectionVersion",
      "VersionType",
      "Logical version type for a corrected repository version.",
      3,
    ),
    entry(
      "DKL-6:2/VersionType/SupersededVersion",
      "SupersededVersion",
      "VersionType",
      "Logical version type for a superseded repository version.",
      4,
    ),
    entry(
      "DKL-6:2/VersionType/HistoricalVersion",
      "HistoricalVersion",
      "VersionType",
      "Logical version type for a historically retained repository version.",
      5,
    ),
    entry(
      "DKL-6:2/VersionType/FrozenVersion",
      "FrozenVersion",
      "VersionType",
      "Logical version type for a frozen repository version.",
      6,
    ),
  ]);

/** Exact history event vocabulary — not event sourcing. */
export const KnowledgeRepositoryHistoryEventTypeEntries: readonly KnowledgeRepositoryRegistryEntry[] =
  Object.freeze([
    entry(
      "DKL-6:2/HistoryEventType/Created",
      "Created",
      "HistoryEventType",
      "History vocabulary entry for repository content creation.",
      1,
    ),
    entry(
      "DKL-6:2/HistoryEventType/Validated",
      "Validated",
      "HistoryEventType",
      "History vocabulary entry for validated repository content.",
      2,
    ),
    entry(
      "DKL-6:2/HistoryEventType/Stored",
      "Stored",
      "HistoryEventType",
      "History vocabulary entry for logically stored repository content.",
      3,
    ),
    entry(
      "DKL-6:2/HistoryEventType/Versioned",
      "Versioned",
      "HistoryEventType",
      "History vocabulary entry for versioned repository content.",
      4,
    ),
    entry(
      "DKL-6:2/HistoryEventType/Retrieved",
      "Retrieved",
      "HistoryEventType",
      "History vocabulary entry for retrieved repository content.",
      5,
    ),
    entry(
      "DKL-6:2/HistoryEventType/Archived",
      "Archived",
      "HistoryEventType",
      "History vocabulary entry for archived repository content.",
      6,
    ),
    entry(
      "DKL-6:2/HistoryEventType/Restored",
      "Restored",
      "HistoryEventType",
      "History vocabulary entry for restored repository content.",
      7,
    ),
    entry(
      "DKL-6:2/HistoryEventType/Frozen",
      "Frozen",
      "HistoryEventType",
      "History vocabulary entry for frozen repository content.",
      8,
    ),
  ]);

/** Exact archive state vocabulary — no archive operations. */
export const KnowledgeRepositoryArchiveStateEntries: readonly KnowledgeRepositoryRegistryEntry[] =
  Object.freeze([
    entry(
      "DKL-6:2/ArchiveState/Active",
      "Active",
      "ArchiveState",
      "Archive state declaring active repository content.",
      1,
    ),
    entry(
      "DKL-6:2/ArchiveState/PendingArchive",
      "PendingArchive",
      "ArchiveState",
      "Archive state declaring content pending archive.",
      2,
    ),
    entry(
      "DKL-6:2/ArchiveState/Archived",
      "Archived",
      "ArchiveState",
      "Archive state declaring archived repository content.",
      3,
    ),
    entry(
      "DKL-6:2/ArchiveState/RestorationPending",
      "RestorationPending",
      "ArchiveState",
      "Archive state declaring restoration pending.",
      4,
    ),
    entry(
      "DKL-6:2/ArchiveState/Restored",
      "Restored",
      "ArchiveState",
      "Archive state declaring restored repository content.",
      5,
    ),
    entry(
      "DKL-6:2/ArchiveState/PermanentlyRetained",
      "PermanentlyRetained",
      "ArchiveState",
      "Archive state declaring permanently retained content.",
      6,
    ),
    entry(
      "DKL-6:2/ArchiveState/Frozen",
      "Frozen",
      "ArchiveState",
      "Archive state declaring frozen repository content.",
      7,
    ),
  ]);

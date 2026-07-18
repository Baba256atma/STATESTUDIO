/**
 * DKL-6:2 — Knowledge Repository Snapshot Registry.
 *
 * Snapshot types, index declarations, and retrieval declarations.
 * Logical vocabulary only — no generation, indexing, or query execution.
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

/** Exact snapshot type vocabulary. */
export const KnowledgeRepositorySnapshotTypeEntries: readonly KnowledgeRepositoryRegistryEntry[] =
  Object.freeze([
    entry(
      "DKL-6:2/SnapshotType/CurrentSnapshot",
      "CurrentSnapshot",
      "SnapshotType",
      "Logical snapshot type for the current repository declaration.",
      1,
    ),
    entry(
      "DKL-6:2/SnapshotType/PointInTimeSnapshot",
      "PointInTimeSnapshot",
      "SnapshotType",
      "Logical snapshot type for a point-in-time repository declaration.",
      2,
    ),
    entry(
      "DKL-6:2/SnapshotType/DecisionSnapshot",
      "DecisionSnapshot",
      "SnapshotType",
      "Logical snapshot type for decision-context repository declaration.",
      3,
    ),
    entry(
      "DKL-6:2/SnapshotType/OperationalSnapshot",
      "OperationalSnapshot",
      "SnapshotType",
      "Logical snapshot type for operational repository declaration.",
      4,
    ),
    entry(
      "DKL-6:2/SnapshotType/HistoricalSnapshot",
      "HistoricalSnapshot",
      "SnapshotType",
      "Logical snapshot type for historical repository declaration.",
      5,
    ),
    entry(
      "DKL-6:2/SnapshotType/FrozenSnapshot",
      "FrozenSnapshot",
      "SnapshotType",
      "Logical snapshot type for a frozen repository declaration.",
      6,
    ),
  ]);

/** Exact index declaration vocabulary — no physical index technology. */
export const KnowledgeRepositoryIndexDeclarationEntries: readonly KnowledgeRepositoryRegistryEntry[] =
  Object.freeze([
    entry(
      "DKL-6:2/IndexDeclaration/IdentityIndex",
      "IdentityIndex",
      "IndexDeclarationType",
      "Logical index declaration keyed by repository identity.",
      1,
    ),
    entry(
      "DKL-6:2/IndexDeclaration/ObjectTypeIndex",
      "ObjectTypeIndex",
      "IndexDeclarationType",
      "Logical index declaration keyed by object type.",
      2,
    ),
    entry(
      "DKL-6:2/IndexDeclaration/RelationshipIndex",
      "RelationshipIndex",
      "IndexDeclarationType",
      "Logical index declaration keyed by relationship.",
      3,
    ),
    entry(
      "DKL-6:2/IndexDeclaration/TimeIndex",
      "TimeIndex",
      "IndexDeclarationType",
      "Logical index declaration keyed by time.",
      4,
    ),
    entry(
      "DKL-6:2/IndexDeclaration/VersionIndex",
      "VersionIndex",
      "IndexDeclarationType",
      "Logical index declaration keyed by version.",
      5,
    ),
    entry(
      "DKL-6:2/IndexDeclaration/SourceIndex",
      "SourceIndex",
      "IndexDeclarationType",
      "Logical index declaration keyed by source.",
      6,
    ),
    entry(
      "DKL-6:2/IndexDeclaration/OwnerIndex",
      "OwnerIndex",
      "IndexDeclarationType",
      "Logical index declaration keyed by owner.",
      7,
    ),
    entry(
      "DKL-6:2/IndexDeclaration/StatusIndex",
      "StatusIndex",
      "IndexDeclarationType",
      "Logical index declaration keyed by status.",
      8,
    ),
  ]);

/** Exact retrieval declaration vocabulary — no retrieval execution. */
export const KnowledgeRepositoryRetrievalDeclarationEntries: readonly KnowledgeRepositoryRegistryEntry[] =
  Object.freeze([
    entry(
      "DKL-6:2/RetrievalDeclaration/RetrieveByIdentity",
      "RetrieveByIdentity",
      "RetrievalDeclarationType",
      "Retrieval contract declaration for identity-based logical retrieval.",
      1,
    ),
    entry(
      "DKL-6:2/RetrievalDeclaration/RetrieveByObjectType",
      "RetrieveByObjectType",
      "RetrievalDeclarationType",
      "Retrieval contract declaration for object-type logical retrieval.",
      2,
    ),
    entry(
      "DKL-6:2/RetrievalDeclaration/RetrieveByRelationship",
      "RetrieveByRelationship",
      "RetrievalDeclarationType",
      "Retrieval contract declaration for relationship logical retrieval.",
      3,
    ),
    entry(
      "DKL-6:2/RetrievalDeclaration/RetrieveByTime",
      "RetrieveByTime",
      "RetrievalDeclarationType",
      "Retrieval contract declaration for time-based logical retrieval.",
      4,
    ),
    entry(
      "DKL-6:2/RetrievalDeclaration/RetrieveByVersion",
      "RetrieveByVersion",
      "RetrievalDeclarationType",
      "Retrieval contract declaration for version-based logical retrieval.",
      5,
    ),
    entry(
      "DKL-6:2/RetrievalDeclaration/RetrieveBySource",
      "RetrieveBySource",
      "RetrievalDeclarationType",
      "Retrieval contract declaration for source-based logical retrieval.",
      6,
    ),
    entry(
      "DKL-6:2/RetrievalDeclaration/RetrieveByOwner",
      "RetrieveByOwner",
      "RetrievalDeclarationType",
      "Retrieval contract declaration for owner-based logical retrieval.",
      7,
    ),
    entry(
      "DKL-6:2/RetrievalDeclaration/RetrieveByStatus",
      "RetrieveByStatus",
      "RetrievalDeclarationType",
      "Retrieval contract declaration for status-based logical retrieval.",
      8,
    ),
  ]);

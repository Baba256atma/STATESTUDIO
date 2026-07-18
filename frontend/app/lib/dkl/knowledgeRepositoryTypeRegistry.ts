/**
 * DKL-6:2 — Knowledge Repository Type Registry.
 *
 * Logical repository classifications and knowledge record type declarations.
 * No physical storage technology. No detailed model fields.
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

/** Logical repository classifications only. */
export const KnowledgeRepositoryTypeEntries: readonly KnowledgeRepositoryRegistryEntry[] =
  Object.freeze([
    entry(
      "DKL-6:2/RepositoryType/OrganizationalKnowledgeRepository",
      "OrganizationalKnowledgeRepository",
      "RepositoryType",
      "Logical repository classification for organization-wide validated knowledge.",
      1,
    ),
    entry(
      "DKL-6:2/RepositoryType/BusinessKnowledgeRepository",
      "BusinessKnowledgeRepository",
      "RepositoryType",
      "Logical repository classification for business-domain validated knowledge.",
      2,
    ),
    entry(
      "DKL-6:2/RepositoryType/OperationalKnowledgeRepository",
      "OperationalKnowledgeRepository",
      "RepositoryType",
      "Logical repository classification for operational validated knowledge.",
      3,
    ),
    entry(
      "DKL-6:2/RepositoryType/DecisionKnowledgeRepository",
      "DecisionKnowledgeRepository",
      "RepositoryType",
      "Logical repository classification for decision-context validated knowledge.",
      4,
    ),
    entry(
      "DKL-6:2/RepositoryType/HistoricalKnowledgeRepository",
      "HistoricalKnowledgeRepository",
      "RepositoryType",
      "Logical repository classification for historically retained validated knowledge.",
      5,
    ),
    entry(
      "DKL-6:2/RepositoryType/ReferenceKnowledgeRepository",
      "ReferenceKnowledgeRepository",
      "RepositoryType",
      "Logical repository classification for reference and catalog knowledge.",
      6,
    ),
    entry(
      "DKL-6:2/RepositoryType/ArchivedKnowledgeRepository",
      "ArchivedKnowledgeRepository",
      "RepositoryType",
      "Logical repository classification for archived validated knowledge.",
      7,
    ),
  ]);

/** Knowledge record type declarations only — detailed models belong to DKL-6:3. */
export const KnowledgeRepositoryRecordTypeEntries: readonly KnowledgeRepositoryRegistryEntry[] =
  Object.freeze([
    entry(
      "DKL-6:2/KnowledgeRecordType/KnowledgeObjectRecord",
      "KnowledgeObjectRecord",
      "KnowledgeRecordType",
      "Declaration for a knowledge object record stored logically in the repository.",
      1,
    ),
    entry(
      "DKL-6:2/KnowledgeRecordType/BusinessObjectRecord",
      "BusinessObjectRecord",
      "KnowledgeRecordType",
      "Declaration for a business object record stored logically in the repository.",
      2,
    ),
    entry(
      "DKL-6:2/KnowledgeRecordType/RelationshipRecord",
      "RelationshipRecord",
      "KnowledgeRecordType",
      "Declaration for a relationship record stored logically in the repository.",
      3,
    ),
    entry(
      "DKL-6:2/KnowledgeRecordType/EvidenceRecord",
      "EvidenceRecord",
      "KnowledgeRecordType",
      "Declaration for an evidence record stored logically in the repository.",
      4,
    ),
    entry(
      "DKL-6:2/KnowledgeRecordType/ValidationRecord",
      "ValidationRecord",
      "KnowledgeRecordType",
      "Declaration for a validation record stored logically in the repository.",
      5,
    ),
    entry(
      "DKL-6:2/KnowledgeRecordType/DecisionContextRecord",
      "DecisionContextRecord",
      "KnowledgeRecordType",
      "Declaration for a decision-context record stored logically in the repository.",
      6,
    ),
    entry(
      "DKL-6:2/KnowledgeRecordType/RepositoryMetadataRecord",
      "RepositoryMetadataRecord",
      "KnowledgeRecordType",
      "Declaration for a repository metadata record.",
      7,
    ),
  ]);

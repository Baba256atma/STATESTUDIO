/**
 * DKL-6:1 — Knowledge Repository Contracts.
 *
 * Canonical repository contracts for identity, versioning, snapshots, archives,
 * retrieval, and metadata. Contract definitions only — no persistence,
 * no database access, no storage adapters.
 *
 * Ownership: owned exclusively by DKL-6:1.
 */

import type {
  RepositoryCapabilityDescriptor,
  RepositoryContractDescriptor,
} from "./knowledgeRepositoryFoundationTypes.ts";

const capability = (
  capabilityId: RepositoryCapabilityDescriptor["capabilityId"],
  name: string,
  description: string,
): RepositoryCapabilityDescriptor =>
  Object.freeze({
    capabilityId,
    name,
    description,
    metadataOnly: true as const,
    implemented: false as const,
  });

const contract = (
  contractId: string,
  contractName: string,
  description: string,
  fields: readonly string[],
): RepositoryContractDescriptor =>
  Object.freeze({
    contractId,
    contractName,
    description,
    fields: Object.freeze([...fields]),
    metadataOnly: true as const,
    immutable: true as const,
  });

export const KNOWLEDGE_REPOSITORY_CAPABILITIES: readonly RepositoryCapabilityDescriptor[] =
  Object.freeze([
    capability(
      "RepositoryIdentity",
      "Repository Identity",
      "Canonical identity of a logical knowledge repository.",
    ),
    capability(
      "RepositoryVersioning",
      "Repository Versioning",
      "Logical versioning of repository contents and metadata.",
    ),
    capability(
      "SnapshotSupport",
      "Snapshot Support",
      "Point-in-time logical snapshot declarations.",
    ),
    capability(
      "ArchiveSupport",
      "Archive Support",
      "Logical archival declarations for repository contents.",
    ),
    capability(
      "HistorySupport",
      "History Support",
      "Historical lineage and supersession declarations.",
    ),
    capability(
      "MetadataManagement",
      "Metadata Management",
      "Repository metadata structure and ownership declarations.",
    ),
    capability(
      "RetrievalContract",
      "Retrieval Contract",
      "Logical retrieval request and response contracts.",
    ),
    capability(
      "RepositoryPolicies",
      "Repository Policies",
      "Immutable policy declarations governing repository behavior.",
    ),
    capability(
      "LifecycleManagement",
      "Lifecycle Management",
      "Lifecycle state declarations for repository contents.",
    ),
  ]);

export const KNOWLEDGE_REPOSITORY_CONTRACTS: readonly RepositoryContractDescriptor[] =
  Object.freeze([
    contract(
      "DKL-6:1/RepositoryIdentity",
      "Repository Identity",
      "Identity of a logical knowledge repository instance.",
      Object.freeze([
        "repositoryId",
        "repositoryName",
        "repositoryNamespace",
        "owner",
        "sourcePhase",
        "version",
        "status",
      ]),
    ),
    contract(
      "DKL-6:1/RepositoryVersion",
      "Repository Version",
      "Logical version descriptor for repository contents.",
      Object.freeze([
        "versionId",
        "repositoryId",
        "versionLabel",
        "precedingVersionId",
        "createdDeclaration",
        "owner",
      ]),
    ),
    contract(
      "DKL-6:1/RepositorySnapshot",
      "Repository Snapshot",
      "Point-in-time logical snapshot of repository contents.",
      Object.freeze([
        "snapshotId",
        "repositoryId",
        "versionId",
        "scope",
        "capturedDeclaration",
        "owner",
      ]),
    ),
    contract(
      "DKL-6:1/RepositoryArchive",
      "Repository Archive",
      "Logical archive declaration for repository contents.",
      Object.freeze([
        "archiveId",
        "repositoryId",
        "versionId",
        "reason",
        "archivedDeclaration",
        "owner",
      ]),
    ),
    contract(
      "DKL-6:1/RepositoryMetadata",
      "Repository Metadata",
      "Structural metadata describing repository contents.",
      Object.freeze([
        "metadataId",
        "repositoryId",
        "knowledgeReferences",
        "validationReferences",
        "provenance",
        "owner",
      ]),
    ),
    contract(
      "DKL-6:1/RetrievalRequest",
      "Retrieval Request",
      "Logical retrieval request contract — no query execution.",
      Object.freeze([
        "requestId",
        "repositoryId",
        "versionId",
        "scope",
        "consumer",
        "purpose",
      ]),
    ),
    contract(
      "DKL-6:1/RetrievalResult",
      "Retrieval Result",
      "Logical retrieval result contract — no result materialization.",
      Object.freeze([
        "resultId",
        "requestId",
        "status",
        "knowledgeReferences",
        "limitations",
        "owner",
      ]),
    ),
    contract(
      "DKL-6:1/RepositoryBoundary",
      "Repository Boundary",
      "Boundary declaration separating repository logic from storage engines.",
      Object.freeze([
        "boundaryId",
        "repositoryId",
        "prohibitedTechnologies",
        "ownedSurfaces",
        "owner",
      ]),
    ),
  ]);

/** Canonical immutable Knowledge Repository contracts and capabilities. */
export const KnowledgeRepositoryContracts = Object.freeze({
  contractsId: "DKL-6:1/KnowledgeRepositoryContracts",
  sourcePhase: "DKL-6:1" as const,
  capabilities: KNOWLEDGE_REPOSITORY_CAPABILITIES,
  capabilityCount: KNOWLEDGE_REPOSITORY_CAPABILITIES.length,
  contracts: KNOWLEDGE_REPOSITORY_CONTRACTS,
  contractCount: KNOWLEDGE_REPOSITORY_CONTRACTS.length,
  definition: Object.freeze({
    knowledgeRepository:
      "The canonical logical storage model of validated organizational knowledge. Declares repository identity, versioning, snapshots, archives, retrieval contracts, and policies without specifying physical storage technology.",
  }),
  notes: Object.freeze({
    metadataOnly: true,
    noPersistenceImplementation: true,
    noDatabaseAccess: true,
    noStorageAdapters: true,
    noQueryExecution: true,
    noIndexingImplementation: true,
    noCaching: true,
    noSearchAlgorithms: true,
    noAi: true,
    noVectorOrGraphDatabaseLogic: true,
  }),
  metadataOnly: true,
  immutable: true,
  deterministic: true,
});

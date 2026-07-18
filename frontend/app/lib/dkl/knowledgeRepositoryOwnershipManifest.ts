/**
 * DKL-6:5 — Knowledge Repository Ownership Manifest.
 *
 * Ownership and boundary declarations for the Knowledge Repository architecture.
 * Metadata only.
 *
 * Ownership: owned exclusively by DKL-6:5.
 */

import type {
  KnowledgeRepositoryManifestBoundary,
  KnowledgeRepositoryManifestOwnershipEntry,
} from "./knowledgeRepositoryManifestTypes.ts";

const owned = (
  id: string,
  responsibility: string,
): KnowledgeRepositoryManifestOwnershipEntry =>
  Object.freeze({
    id,
    responsibility,
    ownership: "Owned" as const,
    owner: "DKL-6" as const,
    runtimeBehavior: "None" as const,
  });

const notOwned = (
  id: string,
  responsibility: string,
): KnowledgeRepositoryManifestOwnershipEntry =>
  Object.freeze({
    id,
    responsibility,
    ownership: "NotOwned" as const,
    owner: "DKL-6" as const,
    runtimeBehavior: "None" as const,
  });

const boundary = (
  id: string,
  name: string,
  description: string,
): KnowledgeRepositoryManifestBoundary =>
  Object.freeze({
    id,
    name,
    description,
    status: "Preserved" as const,
    owner: "DKL-6" as const,
    enforcementType: "Architectural" as const,
    runtimeBehavior: "None" as const,
  });

/** Responsibilities owned by DKL-6. */
export const KnowledgeRepositoryManifestOwnedResponsibilities: readonly KnowledgeRepositoryManifestOwnershipEntry[] =
  Object.freeze([
    owned("DKL-6:5/Ownership/Owned/Foundation", "Repository Foundation"),
    owned("DKL-6:5/Ownership/Owned/Registry", "Repository Registry"),
    owned("DKL-6:5/Ownership/Owned/LogicalModels", "Repository Logical Models"),
    owned(
      "DKL-6:5/Ownership/Owned/ArchitecturalValidation",
      "Repository Architectural Validation",
    ),
    owned("DKL-6:5/Ownership/Owned/Manifest", "Repository Manifest"),
    owned("DKL-6:5/Ownership/Owned/Identity", "Repository Identity"),
    owned(
      "DKL-6:5/Ownership/Owned/VersionVocabulary",
      "Repository Version Vocabulary",
    ),
    owned(
      "DKL-6:5/Ownership/Owned/SnapshotVocabulary",
      "Repository Snapshot Vocabulary",
    ),
    owned(
      "DKL-6:5/Ownership/Owned/HistoryVocabulary",
      "Repository History Vocabulary",
    ),
    owned(
      "DKL-6:5/Ownership/Owned/ArchiveVocabulary",
      "Repository Archive Vocabulary",
    ),
    owned(
      "DKL-6:5/Ownership/Owned/RetentionVocabulary",
      "Repository Retention Vocabulary",
    ),
    owned(
      "DKL-6:5/Ownership/Owned/IndexDeclarations",
      "Repository Index Declarations",
    ),
    owned(
      "DKL-6:5/Ownership/Owned/RetrievalDeclarations",
      "Repository Retrieval Declarations",
    ),
    owned(
      "DKL-6:5/Ownership/Owned/MetadataContracts",
      "Repository Metadata Contracts",
    ),
  ]);

/** Responsibilities explicitly not owned by DKL-6. */
export const KnowledgeRepositoryManifestNonOwnedResponsibilities: readonly KnowledgeRepositoryManifestOwnershipEntry[] =
  Object.freeze([
    notOwned("DKL-6:5/Ownership/NotOwned/PhysicalStorage", "Physical Storage"),
    notOwned("DKL-6:5/Ownership/NotOwned/DatabaseEngines", "Database Engines"),
    notOwned("DKL-6:5/Ownership/NotOwned/SQL", "SQL"),
    notOwned(
      "DKL-6:5/Ownership/NotOwned/GraphDatabaseRuntime",
      "Graph Database Runtime",
    ),
    notOwned(
      "DKL-6:5/Ownership/NotOwned/VectorDatabaseRuntime",
      "Vector Database Runtime",
    ),
    notOwned(
      "DKL-6:5/Ownership/NotOwned/SearchEngineRuntime",
      "Search Engine Runtime",
    ),
    notOwned("DKL-6:5/Ownership/NotOwned/CacheRuntime", "Cache Runtime"),
    notOwned("DKL-6:5/Ownership/NotOwned/Filesystem", "Filesystem"),
    notOwned("DKL-6:5/Ownership/NotOwned/NetworkTransport", "Network Transport"),
    notOwned("DKL-6:5/Ownership/NotOwned/ApiGateway", "API Gateway"),
    notOwned(
      "DKL-6:5/Ownership/NotOwned/NeaChannelIntegration",
      "NEA Channel Integration",
    ),
    notOwned(
      "DKL-6:5/Ownership/NotOwned/BusinessObjectConstruction",
      "Business Object Construction",
    ),
    notOwned(
      "DKL-6:5/Ownership/NotOwned/KnowledgeContentValidation",
      "Knowledge Content Validation",
    ),
    notOwned(
      "DKL-6:5/Ownership/NotOwned/ExecutiveReasoning",
      "Executive Reasoning",
    ),
    notOwned(
      "DKL-6:5/Ownership/NotOwned/ExecutiveDecisions",
      "Executive Decisions",
    ),
    notOwned("DKL-6:5/Ownership/NotOwned/AdvisorBehavior", "Advisor Behavior"),
    notOwned("DKL-6:5/Ownership/NotOwned/SceneRendering", "Scene Rendering"),
    notOwned("DKL-6:5/Ownership/NotOwned/UserInterface", "User Interface"),
  ]);

/** Exactly eighteen boundary declarations. */
export const KnowledgeRepositoryManifestBoundaries: readonly KnowledgeRepositoryManifestBoundary[] =
  Object.freeze([
    boundary(
      "DKL-6:5/Boundary/NoPersistenceImplementation",
      "NoPersistenceImplementation",
      "Repository architecture declares no persistence implementation.",
    ),
    boundary(
      "DKL-6:5/Boundary/NoDatabaseCoupling",
      "NoDatabaseCoupling",
      "Repository architecture declares no database coupling.",
    ),
    boundary(
      "DKL-6:5/Boundary/NoStorageEngineCoupling",
      "NoStorageEngineCoupling",
      "Repository architecture declares no storage-engine coupling.",
    ),
    boundary(
      "DKL-6:5/Boundary/NoQueryExecution",
      "NoQueryExecution",
      "Repository architecture declares no query execution.",
    ),
    boundary(
      "DKL-6:5/Boundary/NoRetrievalExecution",
      "NoRetrievalExecution",
      "Repository architecture declares no retrieval execution.",
    ),
    boundary(
      "DKL-6:5/Boundary/NoIndexExecution",
      "NoIndexExecution",
      "Repository architecture declares no index execution.",
    ),
    boundary(
      "DKL-6:5/Boundary/NoSnapshotExecution",
      "NoSnapshotExecution",
      "Repository architecture declares no snapshot execution.",
    ),
    boundary(
      "DKL-6:5/Boundary/NoVersionExecution",
      "NoVersionExecution",
      "Repository architecture declares no version execution.",
    ),
    boundary(
      "DKL-6:5/Boundary/NoArchiveExecution",
      "NoArchiveExecution",
      "Repository architecture declares no archive execution.",
    ),
    boundary(
      "DKL-6:5/Boundary/NoRetentionExecution",
      "NoRetentionExecution",
      "Repository architecture declares no retention execution.",
    ),
    boundary(
      "DKL-6:5/Boundary/NoFilesystemAccess",
      "NoFilesystemAccess",
      "Repository architecture declares no filesystem access.",
    ),
    boundary(
      "DKL-6:5/Boundary/NoNetworkAccess",
      "NoNetworkAccess",
      "Repository architecture declares no network access.",
    ),
    boundary(
      "DKL-6:5/Boundary/NoExternalServiceAccess",
      "NoExternalServiceAccess",
      "Repository architecture declares no external service access.",
    ),
    boundary(
      "DKL-6:5/Boundary/NoAIBehavior",
      "NoAIBehavior",
      "Repository architecture declares no AI behavior.",
    ),
    boundary(
      "DKL-6:5/Boundary/NoEngineReasoning",
      "NoEngineReasoning",
      "Repository architecture declares no Executive Engine reasoning.",
    ),
    boundary(
      "DKL-6:5/Boundary/NoAdvisorBehavior",
      "NoAdvisorBehavior",
      "Repository architecture declares no Advisor behavior.",
    ),
    boundary(
      "DKL-6:5/Boundary/NoSceneBehavior",
      "NoSceneBehavior",
      "Repository architecture declares no Scene behavior.",
    ),
    boundary(
      "DKL-6:5/Boundary/NoUIBehavior",
      "NoUIBehavior",
      "Repository architecture declares no UI behavior.",
    ),
  ]);

export const KnowledgeRepositoryOwnershipManifest = Object.freeze({
  owned: KnowledgeRepositoryManifestOwnedResponsibilities,
  notOwned: KnowledgeRepositoryManifestNonOwnedResponsibilities,
  ownedCount: KnowledgeRepositoryManifestOwnedResponsibilities.length,
  notOwnedCount: KnowledgeRepositoryManifestNonOwnedResponsibilities.length,
  boundaries: KnowledgeRepositoryManifestBoundaries,
  boundaryCount: KnowledgeRepositoryManifestBoundaries.length,
  metadataOnly: true as const,
  immutable: true as const,
});

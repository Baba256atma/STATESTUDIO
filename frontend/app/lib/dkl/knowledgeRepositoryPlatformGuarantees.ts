/**
 * DKL-6:6 — Knowledge Repository Platform Guarantees.
 *
 * Exactly eighteen platform guarantees and eighteen boundary declarations.
 * Evidence references point to canonical public metadata.
 *
 * Ownership: owned exclusively by DKL-6:6.
 */

import { KnowledgeRepositoryFoundationId } from "./knowledgeRepositoryFoundation.ts";
import { KnowledgeRepositoryManifestId } from "./knowledgeRepositoryManifest.ts";
import { KnowledgeRepositoryModelId } from "./knowledgeRepositoryModel.ts";
import { KnowledgeRepositoryRegistryId } from "./knowledgeRepositoryRegistry.ts";
import { KnowledgeRepositoryValidationId } from "./knowledgeRepositoryValidation.ts";
import type {
  KnowledgeRepositoryPlatformBoundary,
  KnowledgeRepositoryPlatformGuarantee,
} from "./knowledgeRepositoryPlatformTypes.ts";

const PLATFORM_ID = "DKL-6:6/KnowledgeRepositoryPlatform" as const;

const guarantee = (
  id: string,
  name: string,
  description: string,
  evidenceReferences: readonly string[],
): KnowledgeRepositoryPlatformGuarantee =>
  Object.freeze({
    id,
    name,
    description,
    evidenceReferences: Object.freeze([...evidenceReferences]),
    status: "Guaranteed" as const,
    owner: "DKL-6" as const,
    runtimeBehavior: "None" as const,
  });

const boundary = (
  id: string,
  name: string,
  description: string,
): KnowledgeRepositoryPlatformBoundary =>
  Object.freeze({
    id,
    name,
    description,
    status: "Preserved" as const,
    owner: "DKL-6" as const,
    enforcementType: "Architectural" as const,
    runtimeBehavior: "None" as const,
  });

/** Exactly eighteen platform guarantees. */
export const KnowledgeRepositoryPlatformGuarantees: readonly KnowledgeRepositoryPlatformGuarantee[] =
  Object.freeze([
    guarantee(
      "DKL-6:6/Guarantee/CanonicalPlatformIdentityGuarantee",
      "CanonicalPlatformIdentityGuarantee",
      "Platform identity is canonical and stable.",
      Object.freeze([PLATFORM_ID]),
    ),
    guarantee(
      "DKL-6:6/Guarantee/OrderedSectionGuarantee",
      "OrderedSectionGuarantee",
      "Platform sections are ordered foundation through platform.",
      Object.freeze([PLATFORM_ID]),
    ),
    guarantee(
      "DKL-6:6/Guarantee/CanonicalReferenceGuarantee",
      "CanonicalReferenceGuarantee",
      "Platform preserves canonical references to completed phases.",
      Object.freeze([
        KnowledgeRepositoryFoundationId,
        KnowledgeRepositoryRegistryId,
        KnowledgeRepositoryModelId,
        KnowledgeRepositoryValidationId,
        KnowledgeRepositoryManifestId,
      ]),
    ),
    guarantee(
      "DKL-6:6/Guarantee/FoundationIntegrityGuarantee",
      "FoundationIntegrityGuarantee",
      "Foundation integrity is preserved by canonical reference.",
      Object.freeze([KnowledgeRepositoryFoundationId]),
    ),
    guarantee(
      "DKL-6:6/Guarantee/RegistryIntegrityGuarantee",
      "RegistryIntegrityGuarantee",
      "Registry integrity is preserved by canonical reference.",
      Object.freeze([KnowledgeRepositoryRegistryId]),
    ),
    guarantee(
      "DKL-6:6/Guarantee/ModelIntegrityGuarantee",
      "ModelIntegrityGuarantee",
      "Model integrity is preserved by canonical reference.",
      Object.freeze([KnowledgeRepositoryModelId]),
    ),
    guarantee(
      "DKL-6:6/Guarantee/ValidationIntegrityGuarantee",
      "ValidationIntegrityGuarantee",
      "Validation integrity is preserved by canonical reference.",
      Object.freeze([KnowledgeRepositoryValidationId]),
    ),
    guarantee(
      "DKL-6:6/Guarantee/ManifestIntegrityGuarantee",
      "ManifestIntegrityGuarantee",
      "Manifest integrity is preserved by canonical reference.",
      Object.freeze([KnowledgeRepositoryManifestId]),
    ),
    guarantee(
      "DKL-6:6/Guarantee/OwnershipIntegrityGuarantee",
      "OwnershipIntegrityGuarantee",
      "Ownership integrity remains intact across the platform.",
      Object.freeze([KnowledgeRepositoryManifestId, PLATFORM_ID]),
    ),
    guarantee(
      "DKL-6:6/Guarantee/BoundaryIntegrityGuarantee",
      "BoundaryIntegrityGuarantee",
      "Architectural boundaries remain preserved on the platform.",
      Object.freeze([KnowledgeRepositoryManifestId, PLATFORM_ID]),
    ),
    guarantee(
      "DKL-6:6/Guarantee/DependencyIntegrityGuarantee",
      "DependencyIntegrityGuarantee",
      "Approved public-surface dependencies remain complete.",
      Object.freeze([PLATFORM_ID, KnowledgeRepositoryManifestId]),
    ),
    guarantee(
      "DKL-6:6/Guarantee/TraceabilityIntegrityGuarantee",
      "TraceabilityIntegrityGuarantee",
      "Traceability from model through registry and foundation is preserved.",
      Object.freeze([KnowledgeRepositoryModelId, KnowledgeRepositoryRegistryId]),
    ),
    guarantee(
      "DKL-6:6/Guarantee/ImmutabilityGuarantee",
      "ImmutabilityGuarantee",
      "Platform and prior-phase aggregates are immutable.",
      Object.freeze([
        KnowledgeRepositoryFoundationId,
        KnowledgeRepositoryRegistryId,
        KnowledgeRepositoryModelId,
        KnowledgeRepositoryValidationId,
        KnowledgeRepositoryManifestId,
        PLATFORM_ID,
      ]),
    ),
    guarantee(
      "DKL-6:6/Guarantee/DeterminismGuarantee",
      "DeterminismGuarantee",
      "Platform summaries and counts are deterministic.",
      Object.freeze([PLATFORM_ID, KnowledgeRepositoryManifestId]),
    ),
    guarantee(
      "DKL-6:6/Guarantee/TechnologyNeutralityGuarantee",
      "TechnologyNeutralityGuarantee",
      "Platform remains storage-technology neutral.",
      Object.freeze([PLATFORM_ID, KnowledgeRepositoryManifestId]),
    ),
    guarantee(
      "DKL-6:6/Guarantee/RuntimeProhibitionGuarantee",
      "RuntimeProhibitionGuarantee",
      "No repository runtime, AI, Engine, Advisor, Scene, or UI behavior exists.",
      Object.freeze([PLATFORM_ID, KnowledgeRepositoryValidationId]),
    ),
    guarantee(
      "DKL-6:6/Guarantee/PlatformCompletenessGuarantee",
      "PlatformCompletenessGuarantee",
      "Platform composition of DKL-6:1 through DKL-6:5 is complete.",
      Object.freeze([PLATFORM_ID, KnowledgeRepositoryManifestId]),
    ),
    guarantee(
      "DKL-6:6/Guarantee/CertificationReadinessGuarantee",
      "CertificationReadinessGuarantee",
      "Platform is ready for DKL-6:7 Repository Certification.",
      Object.freeze([PLATFORM_ID]),
    ),
  ]);

/** Exactly eighteen platform boundary declarations. */
export const KnowledgeRepositoryPlatformBoundaries: readonly KnowledgeRepositoryPlatformBoundary[] =
  Object.freeze([
    boundary(
      "DKL-6:6/Boundary/NoPersistenceImplementation",
      "NoPersistenceImplementation",
      "Platform declares no persistence implementation.",
    ),
    boundary(
      "DKL-6:6/Boundary/NoDatabaseCoupling",
      "NoDatabaseCoupling",
      "Platform declares no database coupling.",
    ),
    boundary(
      "DKL-6:6/Boundary/NoStorageEngineCoupling",
      "NoStorageEngineCoupling",
      "Platform declares no storage-engine coupling.",
    ),
    boundary(
      "DKL-6:6/Boundary/NoQueryExecution",
      "NoQueryExecution",
      "Platform declares no query execution.",
    ),
    boundary(
      "DKL-6:6/Boundary/NoRetrievalExecution",
      "NoRetrievalExecution",
      "Platform declares no retrieval execution.",
    ),
    boundary(
      "DKL-6:6/Boundary/NoIndexExecution",
      "NoIndexExecution",
      "Platform declares no index execution.",
    ),
    boundary(
      "DKL-6:6/Boundary/NoVersionExecution",
      "NoVersionExecution",
      "Platform declares no version execution.",
    ),
    boundary(
      "DKL-6:6/Boundary/NoSnapshotExecution",
      "NoSnapshotExecution",
      "Platform declares no snapshot execution.",
    ),
    boundary(
      "DKL-6:6/Boundary/NoHistoryExecution",
      "NoHistoryExecution",
      "Platform declares no history execution.",
    ),
    boundary(
      "DKL-6:6/Boundary/NoArchiveExecution",
      "NoArchiveExecution",
      "Platform declares no archive execution.",
    ),
    boundary(
      "DKL-6:6/Boundary/NoRetentionExecution",
      "NoRetentionExecution",
      "Platform declares no retention execution.",
    ),
    boundary(
      "DKL-6:6/Boundary/NoFilesystemAccess",
      "NoFilesystemAccess",
      "Platform declares no filesystem access.",
    ),
    boundary(
      "DKL-6:6/Boundary/NoNetworkAccess",
      "NoNetworkAccess",
      "Platform declares no network access.",
    ),
    boundary(
      "DKL-6:6/Boundary/NoExternalServiceAccess",
      "NoExternalServiceAccess",
      "Platform declares no external service access.",
    ),
    boundary(
      "DKL-6:6/Boundary/NoAIBehavior",
      "NoAIBehavior",
      "Platform declares no AI behavior.",
    ),
    boundary(
      "DKL-6:6/Boundary/NoEngineReasoning",
      "NoEngineReasoning",
      "Platform declares no Executive Engine reasoning.",
    ),
    boundary(
      "DKL-6:6/Boundary/NoAdvisorOrSceneBehavior",
      "NoAdvisorOrSceneBehavior",
      "Platform declares no Advisor or Scene behavior.",
    ),
    boundary(
      "DKL-6:6/Boundary/NoUIBehavior",
      "NoUIBehavior",
      "Platform declares no UI behavior.",
    ),
  ]);

export const KnowledgeRepositoryPlatformGuaranteeManifest = Object.freeze({
  guarantees: KnowledgeRepositoryPlatformGuarantees,
  guaranteeCount: KnowledgeRepositoryPlatformGuarantees.length,
  boundaries: KnowledgeRepositoryPlatformBoundaries,
  boundaryCount: KnowledgeRepositoryPlatformBoundaries.length,
  metadataOnly: true as const,
  immutable: true as const,
});

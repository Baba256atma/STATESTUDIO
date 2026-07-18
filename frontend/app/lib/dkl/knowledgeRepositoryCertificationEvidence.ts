/**
 * DKL-6:7 — Knowledge Repository Certification Evidence.
 *
 * Exactly sixteen accepted evidence entries and phase public API inventory.
 * Evidence from canonical public aggregates and summaries only.
 *
 * Ownership: owned exclusively by DKL-6:7.
 */

import { KnowledgeRepositoryFoundationId } from "./knowledgeRepositoryFoundation.ts";
import { KnowledgeRepositoryManifestId } from "./knowledgeRepositoryManifest.ts";
import { KnowledgeRepositoryModelId } from "./knowledgeRepositoryModel.ts";
import {
  KnowledgeRepositoryPlatform,
  KnowledgeRepositoryPlatformId,
} from "./knowledgeRepositoryPlatform.ts";
import { KnowledgeRepositoryRegistryId } from "./knowledgeRepositoryRegistry.ts";
import { KnowledgeRepositoryValidationId } from "./knowledgeRepositoryValidation.ts";
import type {
  KnowledgeRepositoryCertificationEvidence,
  KnowledgeRepositoryCertificationPublicApiPhase,
} from "./knowledgeRepositoryCertificationTypes.ts";

const CERTIFICATION_ID = "DKL-6:7/KnowledgeRepositoryCertification" as const;
const CERTIFICATION_PUBLIC_API_COUNT = 8 as const;

const evidence = (
  id: string,
  name: string,
  sourceIdentity: string,
  sourceReference: string,
  evidenceType: string,
): KnowledgeRepositoryCertificationEvidence =>
  Object.freeze({
    id,
    name,
    sourceIdentity,
    sourceReference,
    evidenceType,
    accepted: true as const,
    owner: "DKL-6" as const,
    runtimeBehavior: "None" as const,
  });

/** Exactly sixteen accepted certification evidence entries. */
export const KnowledgeRepositoryCertificationEvidenceEntries: readonly KnowledgeRepositoryCertificationEvidence[] =
  Object.freeze([
    evidence(
      "DKL-6:7/Evidence/FoundationIdentityEvidence",
      "FoundationIdentityEvidence",
      KnowledgeRepositoryFoundationId,
      "KnowledgeRepositoryPlatform.foundation.foundationId",
      "Identity",
    ),
    evidence(
      "DKL-6:7/Evidence/FoundationInventoryEvidence",
      "FoundationInventoryEvidence",
      KnowledgeRepositoryFoundationId,
      "KnowledgeRepositoryPlatform.acceptances.inventory",
      "Inventory",
    ),
    evidence(
      "DKL-6:7/Evidence/RegistryIdentityEvidence",
      "RegistryIdentityEvidence",
      KnowledgeRepositoryRegistryId,
      "KnowledgeRepositoryPlatform.registry.identity.registryId",
      "Identity",
    ),
    evidence(
      "DKL-6:7/Evidence/RegistryInventoryEvidence",
      "RegistryInventoryEvidence",
      KnowledgeRepositoryRegistryId,
      "KnowledgeRepositoryPlatform.acceptances.inventory.registryEntries",
      "Inventory",
    ),
    evidence(
      "DKL-6:7/Evidence/ModelIdentityEvidence",
      "ModelIdentityEvidence",
      KnowledgeRepositoryModelId,
      "KnowledgeRepositoryPlatform.model.identity.modelId",
      "Identity",
    ),
    evidence(
      "DKL-6:7/Evidence/ModelInventoryEvidence",
      "ModelInventoryEvidence",
      KnowledgeRepositoryModelId,
      "KnowledgeRepositoryPlatform.acceptances.inventory.models",
      "Inventory",
    ),
    evidence(
      "DKL-6:7/Evidence/ValidationIdentityEvidence",
      "ValidationIdentityEvidence",
      KnowledgeRepositoryValidationId,
      "KnowledgeRepositoryPlatform.validation.identity.validationId",
      "Identity",
    ),
    evidence(
      "DKL-6:7/Evidence/ValidationPassEvidence",
      "ValidationPassEvidence",
      KnowledgeRepositoryValidationId,
      "KnowledgeRepositoryPlatform.acceptances.validation",
      "ValidationResult",
    ),
    evidence(
      "DKL-6:7/Evidence/ManifestIdentityEvidence",
      "ManifestIdentityEvidence",
      KnowledgeRepositoryManifestId,
      "KnowledgeRepositoryPlatform.manifest.identity.manifestId",
      "Identity",
    ),
    evidence(
      "DKL-6:7/Evidence/ManifestCompletenessEvidence",
      "ManifestCompletenessEvidence",
      KnowledgeRepositoryManifestId,
      "KnowledgeRepositoryPlatform.acceptances.manifest",
      "Completeness",
    ),
    evidence(
      "DKL-6:7/Evidence/PlatformIdentityEvidence",
      "PlatformIdentityEvidence",
      KnowledgeRepositoryPlatformId,
      "KnowledgeRepositoryPlatform.identity.platformId",
      "Identity",
    ),
    evidence(
      "DKL-6:7/Evidence/PlatformCompositionEvidence",
      "PlatformCompositionEvidence",
      KnowledgeRepositoryPlatformId,
      "KnowledgeRepositoryPlatform.sections+components",
      "Composition",
    ),
    evidence(
      "DKL-6:7/Evidence/PlatformReadinessEvidence",
      "PlatformReadinessEvidence",
      KnowledgeRepositoryPlatformId,
      "KnowledgeRepositoryPlatform.readinessGates",
      "Readiness",
    ),
    evidence(
      "DKL-6:7/Evidence/BoundaryPreservationEvidence",
      "BoundaryPreservationEvidence",
      KnowledgeRepositoryPlatformId,
      "KnowledgeRepositoryPlatform.boundaries",
      "Boundary",
    ),
    evidence(
      "DKL-6:7/Evidence/ImmutabilityEvidence",
      "ImmutabilityEvidence",
      KnowledgeRepositoryPlatformId,
      "Object.isFrozen(KnowledgeRepositoryPlatform)",
      "Immutability",
    ),
    evidence(
      "DKL-6:7/Evidence/RuntimeProhibitionEvidence",
      "RuntimeProhibitionEvidence",
      KnowledgeRepositoryPlatformId,
      "KnowledgeRepositoryPlatform.runtimeProhibitions",
      "RuntimeProhibition",
    ),
  ]);

/** Phase public API inventory including Certification. */
export const KnowledgeRepositoryCertificationPublicApis: readonly KnowledgeRepositoryCertificationPublicApiPhase[] =
  Object.freeze([
    Object.freeze({
      id: "DKL-6:7/PublicApi/Foundation",
      phase: "DKL-6:1",
      sourceIdentity: KnowledgeRepositoryFoundationId,
      publicApiCount: 6,
      owner: "DKL-6" as const,
      runtimeBehavior: "None" as const,
    }),
    Object.freeze({
      id: "DKL-6:7/PublicApi/Registry",
      phase: "DKL-6:2",
      sourceIdentity: KnowledgeRepositoryRegistryId,
      publicApiCount: 8,
      owner: "DKL-6" as const,
      runtimeBehavior: "None" as const,
    }),
    Object.freeze({
      id: "DKL-6:7/PublicApi/Model",
      phase: "DKL-6:3",
      sourceIdentity: KnowledgeRepositoryModelId,
      publicApiCount: 8,
      owner: "DKL-6" as const,
      runtimeBehavior: "None" as const,
    }),
    Object.freeze({
      id: "DKL-6:7/PublicApi/Validation",
      phase: "DKL-6:4",
      sourceIdentity: KnowledgeRepositoryValidationId,
      publicApiCount: 8,
      owner: "DKL-6" as const,
      runtimeBehavior: "None" as const,
    }),
    Object.freeze({
      id: "DKL-6:7/PublicApi/Manifest",
      phase: "DKL-6:5",
      sourceIdentity: KnowledgeRepositoryManifestId,
      publicApiCount: 8,
      owner: "DKL-6" as const,
      runtimeBehavior: "None" as const,
    }),
    Object.freeze({
      id: "DKL-6:7/PublicApi/Platform",
      phase: "DKL-6:6",
      sourceIdentity: KnowledgeRepositoryPlatformId,
      publicApiCount: 8,
      owner: "DKL-6" as const,
      runtimeBehavior: "None" as const,
    }),
    Object.freeze({
      id: "DKL-6:7/PublicApi/Certification",
      phase: "DKL-6:7",
      sourceIdentity: CERTIFICATION_ID,
      publicApiCount: CERTIFICATION_PUBLIC_API_COUNT,
      owner: "DKL-6" as const,
      runtimeBehavior: "None" as const,
    }),
  ]);

export const KnowledgeRepositoryCertificationEvidenceManifest = Object.freeze({
  evidence: KnowledgeRepositoryCertificationEvidenceEntries,
  evidenceCount: KnowledgeRepositoryCertificationEvidenceEntries.length,
  publicApis: KnowledgeRepositoryCertificationPublicApis,
  platformReference: KnowledgeRepositoryPlatform,
  metadataOnly: true as const,
  immutable: true as const,
});

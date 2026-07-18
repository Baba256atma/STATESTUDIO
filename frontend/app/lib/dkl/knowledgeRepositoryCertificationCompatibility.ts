/**
 * DKL-6:7 — Knowledge Repository Certification Compatibility.
 *
 * Exactly fourteen CertifiedCompatible declarations. Metadata only.
 *
 * Ownership: owned exclusively by DKL-6:7.
 */

import { KnowledgeRepositoryFoundationId } from "./knowledgeRepositoryFoundation.ts";
import { KnowledgeRepositoryManifestId } from "./knowledgeRepositoryManifest.ts";
import { KnowledgeRepositoryModelId } from "./knowledgeRepositoryModel.ts";
import { KnowledgeRepositoryPlatformId } from "./knowledgeRepositoryPlatform.ts";
import { KnowledgeRepositoryRegistryId } from "./knowledgeRepositoryRegistry.ts";
import { KnowledgeRepositoryValidationId } from "./knowledgeRepositoryValidation.ts";
import type { KnowledgeRepositoryCertificationCompatibility } from "./knowledgeRepositoryCertificationTypes.ts";

const compatibility = (
  id: string,
  name: string,
  target: string,
  evidenceReferences: readonly string[],
): KnowledgeRepositoryCertificationCompatibility =>
  Object.freeze({
    id,
    name,
    target,
    evidenceReferences: Object.freeze([...evidenceReferences]),
    status: "CertifiedCompatible" as const,
    owner: "DKL-6" as const,
    runtimeBehavior: "None" as const,
  });

/** Exactly fourteen compatibility certifications. */
export const KnowledgeRepositoryCertificationCompatibilityEntries: readonly KnowledgeRepositoryCertificationCompatibility[] =
  Object.freeze([
    compatibility(
      "DKL-6:7/Compatibility/CertifiedCompatibleWithDKL5ValidatedKnowledge",
      "CertifiedCompatibleWithDKL5ValidatedKnowledge",
      "DKL-5 Validated Knowledge",
      Object.freeze([KnowledgeRepositoryFoundationId, KnowledgeRepositoryPlatformId]),
    ),
    compatibility(
      "DKL-6:7/Compatibility/CertifiedCompatibleWithRepositoryFoundation",
      "CertifiedCompatibleWithRepositoryFoundation",
      "DKL-6:1 Foundation",
      Object.freeze([KnowledgeRepositoryFoundationId]),
    ),
    compatibility(
      "DKL-6:7/Compatibility/CertifiedCompatibleWithRepositoryRegistry",
      "CertifiedCompatibleWithRepositoryRegistry",
      "DKL-6:2 Registry",
      Object.freeze([KnowledgeRepositoryRegistryId]),
    ),
    compatibility(
      "DKL-6:7/Compatibility/CertifiedCompatibleWithRepositoryModel",
      "CertifiedCompatibleWithRepositoryModel",
      "DKL-6:3 Model",
      Object.freeze([KnowledgeRepositoryModelId]),
    ),
    compatibility(
      "DKL-6:7/Compatibility/CertifiedCompatibleWithRepositoryValidation",
      "CertifiedCompatibleWithRepositoryValidation",
      "DKL-6:4 Validation",
      Object.freeze([KnowledgeRepositoryValidationId]),
    ),
    compatibility(
      "DKL-6:7/Compatibility/CertifiedCompatibleWithRepositoryManifest",
      "CertifiedCompatibleWithRepositoryManifest",
      "DKL-6:5 Manifest",
      Object.freeze([KnowledgeRepositoryManifestId]),
    ),
    compatibility(
      "DKL-6:7/Compatibility/CertifiedCompatibleWithRepositoryPlatform",
      "CertifiedCompatibleWithRepositoryPlatform",
      "DKL-6:6 Platform",
      Object.freeze([KnowledgeRepositoryPlatformId]),
    ),
    compatibility(
      "DKL-6:7/Compatibility/CertifiedCompatibleWithFutureFreeze",
      "CertifiedCompatibleWithFutureFreeze",
      "DKL-6:8 Freeze",
      Object.freeze([KnowledgeRepositoryPlatformId]),
    ),
    compatibility(
      "DKL-6:7/Compatibility/CertifiedCompatibleWithFuturePublicIndex",
      "CertifiedCompatibleWithFuturePublicIndex",
      "Future Public Index",
      Object.freeze([KnowledgeRepositoryPlatformId]),
    ),
    compatibility(
      "DKL-6:7/Compatibility/CertifiedCompatibleWithDKL7KnowledgeServices",
      "CertifiedCompatibleWithDKL7KnowledgeServices",
      "DKL-7 Knowledge Services",
      Object.freeze([KnowledgeRepositoryPlatformId]),
    ),
    compatibility(
      "DKL-6:7/Compatibility/CertifiedMetadataBackwardCompatible",
      "CertifiedMetadataBackwardCompatible",
      "Metadata Extension",
      Object.freeze([KnowledgeRepositoryManifestId, KnowledgeRepositoryPlatformId]),
    ),
    compatibility(
      "DKL-6:7/Compatibility/CertifiedAdditiveExtensionCompatible",
      "CertifiedAdditiveExtensionCompatible",
      "Additive Extension",
      Object.freeze([KnowledgeRepositoryPlatformId]),
    ),
    compatibility(
      "DKL-6:7/Compatibility/CertifiedStorageTechnologyNeutral",
      "CertifiedStorageTechnologyNeutral",
      "Storage Neutrality",
      Object.freeze([KnowledgeRepositoryPlatformId]),
    ),
    compatibility(
      "DKL-6:7/Compatibility/CertifiedPublicSurfaceDependencyOnly",
      "CertifiedPublicSurfaceDependencyOnly",
      "Public Surfaces",
      Object.freeze([KnowledgeRepositoryPlatformId]),
    ),
  ]);

export const KnowledgeRepositoryCertificationCompatibilityManifest = Object.freeze({
  compatibility: KnowledgeRepositoryCertificationCompatibilityEntries,
  compatibilityCount: KnowledgeRepositoryCertificationCompatibilityEntries.length,
  metadataOnly: true as const,
  immutable: true as const,
});

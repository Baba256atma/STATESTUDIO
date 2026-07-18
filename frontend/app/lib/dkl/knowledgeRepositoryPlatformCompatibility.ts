/**
 * DKL-6:6 — Knowledge Repository Platform Compatibility.
 *
 * Exactly fourteen compatibility declarations. Metadata only.
 *
 * Ownership: owned exclusively by DKL-6:6.
 */

import type { KnowledgeRepositoryPlatformCompatibility } from "./knowledgeRepositoryPlatformTypes.ts";

const compatibility = (
  id: string,
  name: string,
  target: string,
  description: string,
): KnowledgeRepositoryPlatformCompatibility =>
  Object.freeze({
    id,
    name,
    target,
    description,
    status: "Compatible" as const,
    owner: "DKL-6" as const,
    runtimeBehavior: "None" as const,
  });

/** Exactly fourteen platform compatibility declarations. */
export const KnowledgeRepositoryPlatformCompatibilityEntries: readonly KnowledgeRepositoryPlatformCompatibility[] =
  Object.freeze([
    compatibility(
      "DKL-6:6/Compatibility/CompatibleWithDKL5ValidatedKnowledge",
      "CompatibleWithDKL5ValidatedKnowledge",
      "DKL-5 Validated Knowledge",
      "Compatible with DKL-5 validated knowledge via Public Index.",
    ),
    compatibility(
      "DKL-6:6/Compatibility/CompatibleWithRepositoryFoundation",
      "CompatibleWithRepositoryFoundation",
      "DKL-6:1 Foundation",
      "Compatible with Knowledge Repository Foundation.",
    ),
    compatibility(
      "DKL-6:6/Compatibility/CompatibleWithRepositoryRegistry",
      "CompatibleWithRepositoryRegistry",
      "DKL-6:2 Registry",
      "Compatible with Knowledge Repository Registry.",
    ),
    compatibility(
      "DKL-6:6/Compatibility/CompatibleWithRepositoryModel",
      "CompatibleWithRepositoryModel",
      "DKL-6:3 Model",
      "Compatible with Knowledge Repository Model.",
    ),
    compatibility(
      "DKL-6:6/Compatibility/CompatibleWithRepositoryValidation",
      "CompatibleWithRepositoryValidation",
      "DKL-6:4 Validation",
      "Compatible with Knowledge Repository Validation.",
    ),
    compatibility(
      "DKL-6:6/Compatibility/CompatibleWithRepositoryManifest",
      "CompatibleWithRepositoryManifest",
      "DKL-6:5 Manifest",
      "Compatible with Knowledge Repository Manifest.",
    ),
    compatibility(
      "DKL-6:6/Compatibility/CompatibleWithFutureCertification",
      "CompatibleWithFutureCertification",
      "DKL-6:7 Certification",
      "Architecturally ready for future Repository Certification.",
    ),
    compatibility(
      "DKL-6:6/Compatibility/CompatibleWithFutureFreeze",
      "CompatibleWithFutureFreeze",
      "Future Freeze",
      "Architecturally ready for future Repository Freeze.",
    ),
    compatibility(
      "DKL-6:6/Compatibility/CompatibleWithFuturePublicIndex",
      "CompatibleWithFuturePublicIndex",
      "Future Public Index",
      "Architecturally ready for future Repository Public Index.",
    ),
    compatibility(
      "DKL-6:6/Compatibility/CompatibleWithDKL7KnowledgeServices",
      "CompatibleWithDKL7KnowledgeServices",
      "DKL-7 Knowledge Services",
      "Architectural readiness for DKL-7 Knowledge Services only. No DKL-7 import.",
    ),
    compatibility(
      "DKL-6:6/Compatibility/MetadataBackwardCompatible",
      "MetadataBackwardCompatible",
      "Metadata Extension",
      "Supports backward-compatible metadata extension.",
    ),
    compatibility(
      "DKL-6:6/Compatibility/AdditiveExtensionCompatible",
      "AdditiveExtensionCompatible",
      "Additive Extension",
      "Supports additive architectural extension only.",
    ),
    compatibility(
      "DKL-6:6/Compatibility/StorageTechnologyNeutral",
      "StorageTechnologyNeutral",
      "Storage Neutrality",
      "Storage-technology neutral; no physical storage coupling.",
    ),
    compatibility(
      "DKL-6:6/Compatibility/PublicSurfaceDependencyOnly",
      "PublicSurfaceDependencyOnly",
      "Public Surfaces",
      "Depends only on approved public surfaces.",
    ),
  ]);

export const KnowledgeRepositoryPlatformCompatibilityManifest = Object.freeze({
  compatibility: KnowledgeRepositoryPlatformCompatibilityEntries,
  compatibilityCount: KnowledgeRepositoryPlatformCompatibilityEntries.length,
  metadataOnly: true as const,
  immutable: true as const,
});

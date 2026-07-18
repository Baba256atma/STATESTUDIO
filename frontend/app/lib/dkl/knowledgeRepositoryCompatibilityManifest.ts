/**
 * DKL-6:5 — Knowledge Repository Compatibility Manifest.
 *
 * Exactly twelve compatibility declarations. Metadata only.
 *
 * Ownership: owned exclusively by DKL-6:5.
 */

import type { KnowledgeRepositoryManifestCompatibility } from "./knowledgeRepositoryManifestTypes.ts";

const compatibility = (
  id: string,
  compatibilityTarget: string,
  description: string,
): KnowledgeRepositoryManifestCompatibility =>
  Object.freeze({
    id,
    compatibilityTarget,
    description,
    status: "Compatible" as const,
    owner: "DKL-6" as const,
    runtimeBehavior: "None" as const,
  });

/** Exactly twelve compatibility declarations. */
export const KnowledgeRepositoryManifestCompatibilityEntries: readonly KnowledgeRepositoryManifestCompatibility[] =
  Object.freeze([
    compatibility(
      "DKL-6:5/Compatibility/CompatibleWithDKL5ValidatedKnowledge",
      "CompatibleWithDKL5ValidatedKnowledge",
      "Compatible with DKL-5 validated knowledge consumed through the Public Index.",
    ),
    compatibility(
      "DKL-6:5/Compatibility/CompatibleWithDKL6Foundation",
      "CompatibleWithDKL6Foundation",
      "Compatible with DKL-6:1 Knowledge Repository Foundation.",
    ),
    compatibility(
      "DKL-6:5/Compatibility/CompatibleWithDKL6Registry",
      "CompatibleWithDKL6Registry",
      "Compatible with DKL-6:2 Knowledge Repository Registry.",
    ),
    compatibility(
      "DKL-6:5/Compatibility/CompatibleWithDKL6Model",
      "CompatibleWithDKL6Model",
      "Compatible with DKL-6:3 Knowledge Repository Model.",
    ),
    compatibility(
      "DKL-6:5/Compatibility/CompatibleWithDKL6Validation",
      "CompatibleWithDKL6Validation",
      "Compatible with DKL-6:4 Knowledge Repository Validation.",
    ),
    compatibility(
      "DKL-6:5/Compatibility/CompatibleWithFutureRepositoryPlatform",
      "CompatibleWithFutureRepositoryPlatform",
      "Compatible with future DKL-6:6 Repository Platform.",
    ),
    compatibility(
      "DKL-6:5/Compatibility/CompatibleWithFutureRepositoryCertification",
      "CompatibleWithFutureRepositoryCertification",
      "Compatible with future Repository Certification.",
    ),
    compatibility(
      "DKL-6:5/Compatibility/CompatibleWithFutureRepositoryFreeze",
      "CompatibleWithFutureRepositoryFreeze",
      "Compatible with future Repository Freeze.",
    ),
    compatibility(
      "DKL-6:5/Compatibility/CompatibleWithFutureRepositoryPublicIndex",
      "CompatibleWithFutureRepositoryPublicIndex",
      "Compatible with future Repository Public Index.",
    ),
    compatibility(
      "DKL-6:5/Compatibility/StorageTechnologyNeutral",
      "StorageTechnologyNeutral",
      "Storage-technology neutral; no physical storage coupling.",
    ),
    compatibility(
      "DKL-6:5/Compatibility/BackwardCompatibleMetadataExtension",
      "BackwardCompatibleMetadataExtension",
      "Supports backward-compatible metadata extension only.",
    ),
    compatibility(
      "DKL-6:5/Compatibility/PublicSurfaceDependencyOnly",
      "PublicSurfaceDependencyOnly",
      "Depends only on approved public surfaces.",
    ),
  ]);

export const KnowledgeRepositoryCompatibilityManifest = Object.freeze({
  compatibility: KnowledgeRepositoryManifestCompatibilityEntries,
  compatibilityCount: KnowledgeRepositoryManifestCompatibilityEntries.length,
  metadataOnly: true as const,
  immutable: true as const,
});

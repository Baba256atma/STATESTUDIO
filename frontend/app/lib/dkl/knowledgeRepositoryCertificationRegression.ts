/**
 * DKL-6:7 — Knowledge Repository Certification Regression.
 *
 * Exactly twelve Protected regression protection declarations.
 * Metadata only — no runtime monitors.
 *
 * Ownership: owned exclusively by DKL-6:7.
 */

import { KnowledgeRepositoryFoundationId } from "./knowledgeRepositoryFoundation.ts";
import { KnowledgeRepositoryManifestId } from "./knowledgeRepositoryManifest.ts";
import { KnowledgeRepositoryModelId } from "./knowledgeRepositoryModel.ts";
import { KnowledgeRepositoryPlatformId } from "./knowledgeRepositoryPlatform.ts";
import { KnowledgeRepositoryRegistryId } from "./knowledgeRepositoryRegistry.ts";
import { KnowledgeRepositoryValidationId } from "./knowledgeRepositoryValidation.ts";
import type { KnowledgeRepositoryCertificationRegression } from "./knowledgeRepositoryCertificationTypes.ts";

const protection = (
  id: string,
  name: string,
  protectedSubject: string,
  expectedInvariant: string,
  evidenceReferences: readonly string[],
): KnowledgeRepositoryCertificationRegression =>
  Object.freeze({
    id,
    name,
    protectedSubject,
    expectedInvariant,
    evidenceReferences: Object.freeze([...evidenceReferences]),
    status: "Protected" as const,
    owner: "DKL-6" as const,
    runtimeBehavior: "None" as const,
  });

/** Exactly twelve regression protections. */
export const KnowledgeRepositoryCertificationRegressionProtections: readonly KnowledgeRepositoryCertificationRegression[] =
  Object.freeze([
    protection(
      "DKL-6:7/Regression/FoundationIdentityRegressionProtection",
      "FoundationIdentityRegressionProtection",
      KnowledgeRepositoryFoundationId,
      "Foundation identity remains DKL-6:1/KnowledgeRepositoryFoundation",
      Object.freeze([KnowledgeRepositoryFoundationId]),
    ),
    protection(
      "DKL-6:7/Regression/RegistryIdentityRegressionProtection",
      "RegistryIdentityRegressionProtection",
      KnowledgeRepositoryRegistryId,
      "Registry identity remains DKL-6:2/KnowledgeRepositoryRegistry",
      Object.freeze([KnowledgeRepositoryRegistryId]),
    ),
    protection(
      "DKL-6:7/Regression/ModelIdentityRegressionProtection",
      "ModelIdentityRegressionProtection",
      KnowledgeRepositoryModelId,
      "Model identity remains DKL-6:3/KnowledgeRepositoryModel",
      Object.freeze([KnowledgeRepositoryModelId]),
    ),
    protection(
      "DKL-6:7/Regression/ValidationIdentityRegressionProtection",
      "ValidationIdentityRegressionProtection",
      KnowledgeRepositoryValidationId,
      "Validation identity remains DKL-6:4/KnowledgeRepositoryValidation",
      Object.freeze([KnowledgeRepositoryValidationId]),
    ),
    protection(
      "DKL-6:7/Regression/ManifestIdentityRegressionProtection",
      "ManifestIdentityRegressionProtection",
      KnowledgeRepositoryManifestId,
      "Manifest identity remains DKL-6:5/KnowledgeRepositoryManifest",
      Object.freeze([KnowledgeRepositoryManifestId]),
    ),
    protection(
      "DKL-6:7/Regression/PlatformIdentityRegressionProtection",
      "PlatformIdentityRegressionProtection",
      KnowledgeRepositoryPlatformId,
      "Platform identity remains DKL-6:6/KnowledgeRepositoryPlatform",
      Object.freeze([KnowledgeRepositoryPlatformId]),
    ),
    protection(
      "DKL-6:7/Regression/PublicApiCountRegressionProtection",
      "PublicApiCountRegressionProtection",
      KnowledgeRepositoryPlatformId,
      "Public API totals remain 46 through Platform and 54 through Certification",
      Object.freeze([KnowledgeRepositoryPlatformId]),
    ),
    protection(
      "DKL-6:7/Regression/OwnershipRegressionProtection",
      "OwnershipRegressionProtection",
      KnowledgeRepositoryManifestId,
      "Owned and non-owned responsibility counts remain 14 and 18",
      Object.freeze([KnowledgeRepositoryManifestId]),
    ),
    protection(
      "DKL-6:7/Regression/BoundaryRegressionProtection",
      "BoundaryRegressionProtection",
      KnowledgeRepositoryPlatformId,
      "Eighteen platform boundaries remain Preserved",
      Object.freeze([KnowledgeRepositoryPlatformId]),
    ),
    protection(
      "DKL-6:7/Regression/DependencyRegressionProtection",
      "DependencyRegressionProtection",
      KnowledgeRepositoryPlatformId,
      "Fifteen architectural Compatible dependencies remain intact",
      Object.freeze([KnowledgeRepositoryPlatformId]),
    ),
    protection(
      "DKL-6:7/Regression/ImmutabilityRegressionProtection",
      "ImmutabilityRegressionProtection",
      KnowledgeRepositoryPlatformId,
      "Canonical platform and prior-phase aggregates remain frozen",
      Object.freeze([KnowledgeRepositoryPlatformId]),
    ),
    protection(
      "DKL-6:7/Regression/RuntimeProhibitionRegressionProtection",
      "RuntimeProhibitionRegressionProtection",
      KnowledgeRepositoryPlatformId,
      "Runtime prohibitions remain true for persistence, query, AI, and UI",
      Object.freeze([KnowledgeRepositoryPlatformId]),
    ),
  ]);

export const KnowledgeRepositoryCertificationRegressionManifest = Object.freeze({
  protections: KnowledgeRepositoryCertificationRegressionProtections,
  protectionCount: KnowledgeRepositoryCertificationRegressionProtections.length,
  metadataOnly: true as const,
  immutable: true as const,
});

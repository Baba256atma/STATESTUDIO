/**
 * DKL-6:6 — Knowledge Repository Platform Dependencies.
 *
 * Exactly fifteen architectural dependency declarations.
 * Declared metadata only — no source import inspection.
 *
 * Ownership: owned exclusively by DKL-6:6.
 */

import { KnowledgeRepositoryFoundationId } from "./knowledgeRepositoryFoundation.ts";
import { KnowledgeRepositoryManifestId } from "./knowledgeRepositoryManifest.ts";
import { KnowledgeRepositoryModelId } from "./knowledgeRepositoryModel.ts";
import { KnowledgeRepositoryRegistryId } from "./knowledgeRepositoryRegistry.ts";
import { KnowledgeRepositoryValidationId } from "./knowledgeRepositoryValidation.ts";
import type { KnowledgeRepositoryPlatformDependency } from "./knowledgeRepositoryPlatformTypes.ts";

const PLATFORM_ID = "DKL-6:6/KnowledgeRepositoryPlatform" as const;

const dep = (
  id: string,
  consumer: string,
  provider: string,
  providerIdentity: string,
  approvedSurface: string,
): KnowledgeRepositoryPlatformDependency =>
  Object.freeze({
    id,
    consumer,
    provider,
    providerIdentity,
    approvedSurface,
    dependencyType: "Architectural" as const,
    compatibilityStatus: "Compatible" as const,
    owner: "DKL-6" as const,
    runtimeBehavior: "None" as const,
  });

/** Exactly fifteen platform dependency declarations. */
export const KnowledgeRepositoryPlatformDependencies: readonly KnowledgeRepositoryPlatformDependency[] =
  Object.freeze([
    dep(
      "DKL-6:6/Dependency/Platform-Foundation",
      "DKL-6:6",
      "Foundation public surface",
      KnowledgeRepositoryFoundationId,
      "knowledgeRepositoryFoundation.ts",
    ),
    dep(
      "DKL-6:6/Dependency/Platform-Registry",
      "DKL-6:6",
      "Registry public surface",
      KnowledgeRepositoryRegistryId,
      "knowledgeRepositoryRegistry.ts",
    ),
    dep(
      "DKL-6:6/Dependency/Platform-Model",
      "DKL-6:6",
      "Model public surface",
      KnowledgeRepositoryModelId,
      "knowledgeRepositoryModel.ts",
    ),
    dep(
      "DKL-6:6/Dependency/Platform-Validation",
      "DKL-6:6",
      "Validation public surface",
      KnowledgeRepositoryValidationId,
      "knowledgeRepositoryValidation.ts",
    ),
    dep(
      "DKL-6:6/Dependency/Platform-Manifest",
      "DKL-6:6",
      "Manifest public surface",
      KnowledgeRepositoryManifestId,
      "knowledgeRepositoryManifest.ts",
    ),
    dep(
      "DKL-6:6/Dependency/Registry-Foundation",
      "DKL-6:2",
      "Foundation public surface",
      KnowledgeRepositoryFoundationId,
      "knowledgeRepositoryFoundation.ts",
    ),
    dep(
      "DKL-6:6/Dependency/Model-Foundation",
      "DKL-6:3",
      "Foundation public surface",
      KnowledgeRepositoryFoundationId,
      "knowledgeRepositoryFoundation.ts",
    ),
    dep(
      "DKL-6:6/Dependency/Model-Registry",
      "DKL-6:3",
      "Registry public surface",
      KnowledgeRepositoryRegistryId,
      "knowledgeRepositoryRegistry.ts",
    ),
    dep(
      "DKL-6:6/Dependency/Validation-Foundation",
      "DKL-6:4",
      "Foundation public surface",
      KnowledgeRepositoryFoundationId,
      "knowledgeRepositoryFoundation.ts",
    ),
    dep(
      "DKL-6:6/Dependency/Validation-Registry",
      "DKL-6:4",
      "Registry public surface",
      KnowledgeRepositoryRegistryId,
      "knowledgeRepositoryRegistry.ts",
    ),
    dep(
      "DKL-6:6/Dependency/Validation-Model",
      "DKL-6:4",
      "Model public surface",
      KnowledgeRepositoryModelId,
      "knowledgeRepositoryModel.ts",
    ),
    dep(
      "DKL-6:6/Dependency/Manifest-Foundation",
      "DKL-6:5",
      "Foundation public surface",
      KnowledgeRepositoryFoundationId,
      "knowledgeRepositoryFoundation.ts",
    ),
    dep(
      "DKL-6:6/Dependency/Manifest-Registry",
      "DKL-6:5",
      "Registry public surface",
      KnowledgeRepositoryRegistryId,
      "knowledgeRepositoryRegistry.ts",
    ),
    dep(
      "DKL-6:6/Dependency/Manifest-Model",
      "DKL-6:5",
      "Model public surface",
      KnowledgeRepositoryModelId,
      "knowledgeRepositoryModel.ts",
    ),
    dep(
      "DKL-6:6/Dependency/Manifest-Validation",
      "DKL-6:5",
      "Validation public surface",
      KnowledgeRepositoryValidationId,
      "knowledgeRepositoryValidation.ts",
    ),
  ]);

export const KnowledgeRepositoryPlatformDependencyManifest = Object.freeze({
  dependencies: KnowledgeRepositoryPlatformDependencies,
  dependencyCount: KnowledgeRepositoryPlatformDependencies.length,
  platformId: PLATFORM_ID,
  metadataOnly: true as const,
  immutable: true as const,
});

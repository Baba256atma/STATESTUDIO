/**
 * DKL-6:5 — Knowledge Repository Dependency Manifest.
 *
 * Exactly eleven architectural dependency declarations.
 * Declared metadata only — no source import inspection.
 *
 * Ownership: owned exclusively by DKL-6:5.
 */

import { KnowledgeRepositoryFoundationId } from "./knowledgeRepositoryFoundation.ts";
import { KnowledgeRepositoryModelId } from "./knowledgeRepositoryModel.ts";
import { KnowledgeRepositoryRegistryId } from "./knowledgeRepositoryRegistry.ts";
import { KnowledgeRepositoryValidationId } from "./knowledgeRepositoryValidation.ts";
import type { KnowledgeRepositoryManifestDependency } from "./knowledgeRepositoryManifestTypes.ts";

const MANIFEST_ID = "DKL-6:5/KnowledgeRepositoryManifest" as const;

const dep = (
  id: string,
  consumer: string,
  provider: string,
  providerIdentity: string,
  approvedSurface: string,
): KnowledgeRepositoryManifestDependency =>
  Object.freeze({
    id,
    consumer,
    provider,
    providerIdentity,
    dependencyType: "Architectural" as const,
    approvedSurface,
    status: "Compatible" as const,
    owner: "DKL-6" as const,
    runtimeBehavior: "None" as const,
  });

/** Exactly eleven dependency declarations. */
export const KnowledgeRepositoryManifestDependencies: readonly KnowledgeRepositoryManifestDependency[] =
  Object.freeze([
    dep(
      "DKL-6:5/Dependency/6-1-on-DKL5-PublicIndex",
      "DKL-6:1",
      "DKL-5 Public Index",
      "DKL-5:9/KnowledgeValidationPublicIndex",
      "knowledgeValidationPublicIndex.ts",
    ),
    dep(
      "DKL-6:5/Dependency/6-2-on-6-1",
      "DKL-6:2",
      "DKL-6:1 public surface",
      KnowledgeRepositoryFoundationId,
      "knowledgeRepositoryFoundation.ts",
    ),
    dep(
      "DKL-6:5/Dependency/6-3-on-6-1",
      "DKL-6:3",
      "DKL-6:1 public surface",
      KnowledgeRepositoryFoundationId,
      "knowledgeRepositoryFoundation.ts",
    ),
    dep(
      "DKL-6:5/Dependency/6-3-on-6-2",
      "DKL-6:3",
      "DKL-6:2 public surface",
      KnowledgeRepositoryRegistryId,
      "knowledgeRepositoryRegistry.ts",
    ),
    dep(
      "DKL-6:5/Dependency/6-4-on-6-1",
      "DKL-6:4",
      "DKL-6:1 public surface",
      KnowledgeRepositoryFoundationId,
      "knowledgeRepositoryFoundation.ts",
    ),
    dep(
      "DKL-6:5/Dependency/6-4-on-6-2",
      "DKL-6:4",
      "DKL-6:2 public surface",
      KnowledgeRepositoryRegistryId,
      "knowledgeRepositoryRegistry.ts",
    ),
    dep(
      "DKL-6:5/Dependency/6-4-on-6-3",
      "DKL-6:4",
      "DKL-6:3 public surface",
      KnowledgeRepositoryModelId,
      "knowledgeRepositoryModel.ts",
    ),
    dep(
      "DKL-6:5/Dependency/6-5-on-6-1",
      "DKL-6:5",
      "DKL-6:1 public surface",
      KnowledgeRepositoryFoundationId,
      "knowledgeRepositoryFoundation.ts",
    ),
    dep(
      "DKL-6:5/Dependency/6-5-on-6-2",
      "DKL-6:5",
      "DKL-6:2 public surface",
      KnowledgeRepositoryRegistryId,
      "knowledgeRepositoryRegistry.ts",
    ),
    dep(
      "DKL-6:5/Dependency/6-5-on-6-3",
      "DKL-6:5",
      "DKL-6:3 public surface",
      KnowledgeRepositoryModelId,
      "knowledgeRepositoryModel.ts",
    ),
    dep(
      "DKL-6:5/Dependency/6-5-on-6-4",
      "DKL-6:5",
      "DKL-6:4 public surface",
      KnowledgeRepositoryValidationId,
      "knowledgeRepositoryValidation.ts",
    ),
  ]);

export const KnowledgeRepositoryDependencyManifest = Object.freeze({
  dependencies: KnowledgeRepositoryManifestDependencies,
  dependencyCount: KnowledgeRepositoryManifestDependencies.length,
  consumerManifestId: MANIFEST_ID,
  metadataOnly: true as const,
  immutable: true as const,
});

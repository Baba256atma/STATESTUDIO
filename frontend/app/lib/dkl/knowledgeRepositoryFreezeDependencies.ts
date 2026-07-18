/**
 * DKL-6:8 — Knowledge Repository Freeze Dependencies.
 *
 * Declares exactly twenty-one dependency locks.
 * Metadata only. No runtime behavior.
 *
 * Ownership: owned exclusively by DKL-6:8.
 */

import type { KnowledgeRepositoryFreezeDependencyLock } from "./knowledgeRepositoryFreezeTypes.ts";

function lock(
  id: string,
  consumer: string,
  provider: string,
  approvedPublicSurface: string,
  protectedProviderIdentity: string,
): KnowledgeRepositoryFreezeDependencyLock {
  return Object.freeze({
    id,
    consumer,
    provider,
    approvedPublicSurface,
    protectedProviderIdentity,
    status: "Locked" as const,
    owner: "DKL-6" as const,
    runtimeBehavior: "None" as const,
  });
}

export const KnowledgeRepositoryFreezeDependencyLocks: readonly KnowledgeRepositoryFreezeDependencyLock[] =
  Object.freeze([
    lock(
      "DKL-6:8/Dep/RegistryToFoundationLock",
      "DKL-6:2 Knowledge Repository Registry",
      "DKL-6:1 Knowledge Repository Foundation",
      "knowledgeRepositoryFoundation.ts",
      "DKL-6:1/KnowledgeRepositoryFoundation",
    ),
    lock(
      "DKL-6:8/Dep/ModelToFoundationLock",
      "DKL-6:3 Knowledge Repository Model",
      "DKL-6:1 Knowledge Repository Foundation",
      "knowledgeRepositoryFoundation.ts",
      "DKL-6:1/KnowledgeRepositoryFoundation",
    ),
    lock(
      "DKL-6:8/Dep/ModelToRegistryLock",
      "DKL-6:3 Knowledge Repository Model",
      "DKL-6:2 Knowledge Repository Registry",
      "knowledgeRepositoryRegistry.ts",
      "DKL-6:2/KnowledgeRepositoryRegistry",
    ),
    lock(
      "DKL-6:8/Dep/ValidationToFoundationLock",
      "DKL-6:4 Knowledge Repository Validation",
      "DKL-6:1 Knowledge Repository Foundation",
      "knowledgeRepositoryFoundation.ts",
      "DKL-6:1/KnowledgeRepositoryFoundation",
    ),
    lock(
      "DKL-6:8/Dep/ValidationToRegistryLock",
      "DKL-6:4 Knowledge Repository Validation",
      "DKL-6:2 Knowledge Repository Registry",
      "knowledgeRepositoryRegistry.ts",
      "DKL-6:2/KnowledgeRepositoryRegistry",
    ),
    lock(
      "DKL-6:8/Dep/ValidationToModelLock",
      "DKL-6:4 Knowledge Repository Validation",
      "DKL-6:3 Knowledge Repository Model",
      "knowledgeRepositoryModel.ts",
      "DKL-6:3/KnowledgeRepositoryModel",
    ),
    lock(
      "DKL-6:8/Dep/ManifestToFoundationLock",
      "DKL-6:5 Knowledge Repository Manifest",
      "DKL-6:1 Knowledge Repository Foundation",
      "knowledgeRepositoryFoundation.ts",
      "DKL-6:1/KnowledgeRepositoryFoundation",
    ),
    lock(
      "DKL-6:8/Dep/ManifestToRegistryLock",
      "DKL-6:5 Knowledge Repository Manifest",
      "DKL-6:2 Knowledge Repository Registry",
      "knowledgeRepositoryRegistry.ts",
      "DKL-6:2/KnowledgeRepositoryRegistry",
    ),
    lock(
      "DKL-6:8/Dep/ManifestToModelLock",
      "DKL-6:5 Knowledge Repository Manifest",
      "DKL-6:3 Knowledge Repository Model",
      "knowledgeRepositoryModel.ts",
      "DKL-6:3/KnowledgeRepositoryModel",
    ),
    lock(
      "DKL-6:8/Dep/ManifestToValidationLock",
      "DKL-6:5 Knowledge Repository Manifest",
      "DKL-6:4 Knowledge Repository Validation",
      "knowledgeRepositoryValidation.ts",
      "DKL-6:4/KnowledgeRepositoryValidation",
    ),
    lock(
      "DKL-6:8/Dep/PlatformToFoundationLock",
      "DKL-6:6 Knowledge Repository Platform",
      "DKL-6:1 Knowledge Repository Foundation",
      "knowledgeRepositoryFoundation.ts",
      "DKL-6:1/KnowledgeRepositoryFoundation",
    ),
    lock(
      "DKL-6:8/Dep/PlatformToRegistryLock",
      "DKL-6:6 Knowledge Repository Platform",
      "DKL-6:2 Knowledge Repository Registry",
      "knowledgeRepositoryRegistry.ts",
      "DKL-6:2/KnowledgeRepositoryRegistry",
    ),
    lock(
      "DKL-6:8/Dep/PlatformToModelLock",
      "DKL-6:6 Knowledge Repository Platform",
      "DKL-6:3 Knowledge Repository Model",
      "knowledgeRepositoryModel.ts",
      "DKL-6:3/KnowledgeRepositoryModel",
    ),
    lock(
      "DKL-6:8/Dep/PlatformToValidationLock",
      "DKL-6:6 Knowledge Repository Platform",
      "DKL-6:4 Knowledge Repository Validation",
      "knowledgeRepositoryValidation.ts",
      "DKL-6:4/KnowledgeRepositoryValidation",
    ),
    lock(
      "DKL-6:8/Dep/PlatformToManifestLock",
      "DKL-6:6 Knowledge Repository Platform",
      "DKL-6:5 Knowledge Repository Manifest",
      "knowledgeRepositoryManifest.ts",
      "DKL-6:5/KnowledgeRepositoryManifest",
    ),
    lock(
      "DKL-6:8/Dep/CertificationToPlatformLock",
      "DKL-6:7 Knowledge Repository Certification",
      "DKL-6:6 Knowledge Repository Platform",
      "knowledgeRepositoryPlatform.ts",
      "DKL-6:6/KnowledgeRepositoryPlatform",
    ),
    lock(
      "DKL-6:8/Dep/CertificationToFoundationEvidenceLock",
      "DKL-6:7 Knowledge Repository Certification",
      "DKL-6:1 Knowledge Repository Foundation",
      "knowledgeRepositoryFoundation.ts",
      "DKL-6:1/KnowledgeRepositoryFoundation",
    ),
    lock(
      "DKL-6:8/Dep/CertificationToRegistryEvidenceLock",
      "DKL-6:7 Knowledge Repository Certification",
      "DKL-6:2 Knowledge Repository Registry",
      "knowledgeRepositoryRegistry.ts",
      "DKL-6:2/KnowledgeRepositoryRegistry",
    ),
    lock(
      "DKL-6:8/Dep/CertificationToModelEvidenceLock",
      "DKL-6:7 Knowledge Repository Certification",
      "DKL-6:3 Knowledge Repository Model",
      "knowledgeRepositoryModel.ts",
      "DKL-6:3/KnowledgeRepositoryModel",
    ),
    lock(
      "DKL-6:8/Dep/CertificationToValidationEvidenceLock",
      "DKL-6:7 Knowledge Repository Certification",
      "DKL-6:4 Knowledge Repository Validation",
      "knowledgeRepositoryValidation.ts",
      "DKL-6:4/KnowledgeRepositoryValidation",
    ),
    lock(
      "DKL-6:8/Dep/CertificationToManifestEvidenceLock",
      "DKL-6:7 Knowledge Repository Certification",
      "DKL-6:5 Knowledge Repository Manifest",
      "knowledgeRepositoryManifest.ts",
      "DKL-6:5/KnowledgeRepositoryManifest",
    ),
  ]);

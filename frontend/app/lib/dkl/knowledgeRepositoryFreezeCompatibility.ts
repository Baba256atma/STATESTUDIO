/**
 * DKL-6:8 — Knowledge Repository Freeze Compatibility.
 *
 * Declares exactly fourteen compatibility locks.
 * Metadata only. No runtime behavior.
 *
 * Ownership: owned exclusively by DKL-6:8.
 */

import type { KnowledgeRepositoryFreezeCompatibilityLock } from "./knowledgeRepositoryFreezeTypes.ts";

function lock(
  id: string,
  name: string,
  compatibilityTarget: string,
  protectedInvariant: string,
): KnowledgeRepositoryFreezeCompatibilityLock {
  return Object.freeze({
    id,
    name,
    compatibilityTarget,
    protectedInvariant,
    status: "Locked" as const,
    owner: "DKL-6" as const,
    runtimeBehavior: "None" as const,
  });
}

export const KnowledgeRepositoryFreezeCompatibilityLocks: readonly KnowledgeRepositoryFreezeCompatibilityLock[] =
  Object.freeze([
    lock(
      "DKL-6:8/Compat/DKL5ValidatedKnowledgeCompatibilityLock",
      "DKL5ValidatedKnowledgeCompatibilityLock",
      "DKL-5 Validated Knowledge",
      "DKL-6 remains compatible with DKL-5 validated knowledge contracts by architectural reference only",
    ),
    lock(
      "DKL-6:8/Compat/FoundationCompatibilityLock",
      "FoundationCompatibilityLock",
      "DKL-6:1 Knowledge Repository Foundation",
      "Foundation identity, contracts, and public surface remain stable under Freeze",
    ),
    lock(
      "DKL-6:8/Compat/RegistryCompatibilityLock",
      "RegistryCompatibilityLock",
      "DKL-6:2 Knowledge Repository Registry",
      "Registry vocabulary and inventory remain stable under Freeze",
    ),
    lock(
      "DKL-6:8/Compat/ModelCompatibilityLock",
      "ModelCompatibilityLock",
      "DKL-6:3 Knowledge Repository Model",
      "Model contracts and relationships remain stable under Freeze",
    ),
    lock(
      "DKL-6:8/Compat/ValidationCompatibilityLock",
      "ValidationCompatibilityLock",
      "DKL-6:4 Knowledge Repository Validation",
      "Validation rules and gates remain stable under Freeze",
    ),
    lock(
      "DKL-6:8/Compat/ManifestCompatibilityLock",
      "ManifestCompatibilityLock",
      "DKL-6:5 Knowledge Repository Manifest",
      "Manifest inventory and completeness remain stable under Freeze",
    ),
    lock(
      "DKL-6:8/Compat/PlatformCompatibilityLock",
      "PlatformCompatibilityLock",
      "DKL-6:6 Knowledge Repository Platform",
      "Platform composition and readiness remain stable under Freeze",
    ),
    lock(
      "DKL-6:8/Compat/CertificationCompatibilityLock",
      "CertificationCompatibilityLock",
      "DKL-6:7 Knowledge Repository Certification",
      "Certification criteria, gates, and Certified result remain stable under Freeze",
    ),
    lock(
      "DKL-6:8/Compat/FuturePublicIndexCompatibilityLock",
      "FuturePublicIndexCompatibilityLock",
      "DKL-6:9 Knowledge Repository Public Index",
      "Frozen architecture remains compatible with a future Public Index phase",
    ),
    lock(
      "DKL-6:8/Compat/FutureDKL7KnowledgeServicesCompatibilityLock",
      "FutureDKL7KnowledgeServicesCompatibilityLock",
      "DKL-7 Knowledge Services",
      "Frozen architecture remains architecturally compatible with future DKL-7 without importing DKL-7",
    ),
    lock(
      "DKL-6:8/Compat/MetadataBackwardCompatibilityLock",
      "MetadataBackwardCompatibilityLock",
      "DKL-6 Metadata Surfaces",
      "Existing metadata identities and semantics remain backward-compatible",
    ),
    lock(
      "DKL-6:8/Compat/AdditiveExtensionCompatibilityLock",
      "AdditiveExtensionCompatibilityLock",
      "DKL-6 Extension Policy",
      "Only additive compatible extensions are permitted after Freeze",
    ),
    lock(
      "DKL-6:8/Compat/StorageTechnologyNeutralityLock",
      "StorageTechnologyNeutralityLock",
      "Technology Neutrality",
      "No storage, database, or persistence technology coupling is introduced",
    ),
    lock(
      "DKL-6:8/Compat/PublicSurfaceDependencyLock",
      "PublicSurfaceDependencyLock",
      "DKL-6 Public Surfaces",
      "Cross-phase dependencies remain limited to approved public surfaces",
    ),
  ]);

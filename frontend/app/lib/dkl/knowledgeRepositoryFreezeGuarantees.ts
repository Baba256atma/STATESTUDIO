/**
 * DKL-6:8 — Knowledge Repository Freeze Guarantees and Gates.
 *
 * Declares exactly twenty-two guarantees and sixteen Freeze gates.
 * Metadata only. No runtime behavior.
 *
 * Ownership: owned exclusively by DKL-6:8.
 */

import type {
  KnowledgeRepositoryFreezeGate,
  KnowledgeRepositoryFreezeGuarantee,
} from "./knowledgeRepositoryFreezeTypes.ts";

function guarantee(
  id: string,
  name: string,
  description: string,
  evidenceReferences: readonly string[],
): KnowledgeRepositoryFreezeGuarantee {
  return Object.freeze({
    id,
    name,
    description,
    evidenceReferences: Object.freeze([...evidenceReferences]),
    status: "Guaranteed" as const,
    owner: "DKL-6" as const,
    runtimeBehavior: "None" as const,
  });
}

function gate(
  id: string,
  name: string,
  evidenceReferences: readonly string[],
): KnowledgeRepositoryFreezeGate {
  return Object.freeze({
    id,
    name,
    evidenceReferences: Object.freeze([...evidenceReferences]),
    status: "Pass" as const,
    owner: "DKL-6" as const,
    runtimeBehavior: "None" as const,
  });
}

export const KnowledgeRepositoryFreezeGuarantees: readonly KnowledgeRepositoryFreezeGuarantee[] =
  Object.freeze([
    guarantee(
      "DKL-6:8/Guarantee/CanonicalFreezeIdentityGuarantee",
      "CanonicalFreezeIdentityGuarantee",
      "Freeze identity, version, namespace, and baseline remain canonical and immutable",
      ["DKL-6:8/Identity"],
    ),
    guarantee(
      "DKL-6:8/Guarantee/FreezeScopeGuarantee",
      "FreezeScopeGuarantee",
      "Exactly eight ordered scope sections cover foundation through freeze",
      ["DKL-6:8/Scope"],
    ),
    guarantee(
      "DKL-6:8/Guarantee/FrozenComponentRegistryGuarantee",
      "FrozenComponentRegistryGuarantee",
      "Exactly eight frozen components are Certified, Frozen, and Stable",
      ["DKL-6:8/Components"],
    ),
    guarantee(
      "DKL-6:8/Guarantee/CertificationAcceptanceGuarantee",
      "CertificationAcceptanceGuarantee",
      "Canonical Certification remains Certified with 18/18 criteria and 15/15 gates",
      ["DKL-6:7/KnowledgeRepositoryCertification"],
    ),
    guarantee(
      "DKL-6:8/Guarantee/FoundationStabilityGuarantee",
      "FoundationStabilityGuarantee",
      "Foundation counts and contracts remain stable under Freeze",
      ["DKL-6:1/KnowledgeRepositoryFoundation", "DKL-6:8/CanonicalCounts"],
    ),
    guarantee(
      "DKL-6:8/Guarantee/RegistryStabilityGuarantee",
      "RegistryStabilityGuarantee",
      "Registry inventory remains stable under Freeze",
      ["DKL-6:2/KnowledgeRepositoryRegistry", "DKL-6:8/CanonicalCounts"],
    ),
    guarantee(
      "DKL-6:8/Guarantee/ModelStabilityGuarantee",
      "ModelStabilityGuarantee",
      "Model inventory remains stable under Freeze",
      ["DKL-6:3/KnowledgeRepositoryModel", "DKL-6:8/CanonicalCounts"],
    ),
    guarantee(
      "DKL-6:8/Guarantee/ValidationStabilityGuarantee",
      "ValidationStabilityGuarantee",
      "Validation results remain stable under Freeze",
      ["DKL-6:4/KnowledgeRepositoryValidation", "DKL-6:8/CanonicalCounts"],
    ),
    guarantee(
      "DKL-6:8/Guarantee/ManifestStabilityGuarantee",
      "ManifestStabilityGuarantee",
      "Manifest completeness remains stable under Freeze",
      ["DKL-6:5/KnowledgeRepositoryManifest", "DKL-6:8/CanonicalCounts"],
    ),
    guarantee(
      "DKL-6:8/Guarantee/PlatformStabilityGuarantee",
      "PlatformStabilityGuarantee",
      "Platform composition remains stable under Freeze",
      ["DKL-6:6/KnowledgeRepositoryPlatform", "DKL-6:8/CanonicalCounts"],
    ),
    guarantee(
      "DKL-6:8/Guarantee/CertificationStabilityGuarantee",
      "CertificationStabilityGuarantee",
      "Certification result remains stable under Freeze",
      ["DKL-6:7/KnowledgeRepositoryCertification"],
    ),
    guarantee(
      "DKL-6:8/Guarantee/OwnershipLockGuarantee",
      "OwnershipLockGuarantee",
      "Ownership remains Locked to DKL-6 across Freeze scope and components",
      ["DKL-6:8/Core/OwnershipLock"],
    ),
    guarantee(
      "DKL-6:8/Guarantee/BoundaryLockGuarantee",
      "BoundaryLockGuarantee",
      "Eighteen boundary locks remain Locked and CertifiedPreserved",
      ["DKL-6:8/BoundaryLocks"],
    ),
    guarantee(
      "DKL-6:8/Guarantee/DependencyLockGuarantee",
      "DependencyLockGuarantee",
      "Twenty-one dependency locks remain Locked to approved public surfaces",
      ["DKL-6:8/DependencyLocks"],
    ),
    guarantee(
      "DKL-6:8/Guarantee/CompatibilityLockGuarantee",
      "CompatibilityLockGuarantee",
      "Fourteen compatibility locks remain Locked",
      ["DKL-6:8/CompatibilityLocks"],
    ),
    guarantee(
      "DKL-6:8/Guarantee/PublicApiLockGuarantee",
      "PublicApiLockGuarantee",
      "Frozen public API inventory totals 62 and may only grow additively",
      ["DKL-6:8/PublicApis"],
    ),
    guarantee(
      "DKL-6:8/Guarantee/ExtensionPolicyGuarantee",
      "ExtensionPolicyGuarantee",
      "Only AdditiveCompatibleExtension is allowed; BreakingChange is prohibited",
      ["DKL-6:8/ExtensionLocks"],
    ),
    guarantee(
      "DKL-6:8/Guarantee/RegressionProtectionGuarantee",
      "RegressionProtectionGuarantee",
      "Fourteen regression locks protect identities, counts, ownership, boundaries, and runtime prohibition",
      ["DKL-6:8/RegressionLocks"],
    ),
    guarantee(
      "DKL-6:8/Guarantee/ImmutabilityGuarantee",
      "ImmutabilityGuarantee",
      "Freeze aggregate and nested structures are deeply frozen and mutation-resistant",
      ["DKL-6:8/Aggregate"],
    ),
    guarantee(
      "DKL-6:8/Guarantee/DeterminismGuarantee",
      "DeterminismGuarantee",
      "Freeze metadata is deterministic across executions with no randomness or timestamps",
      ["DKL-6:8/Aggregate"],
    ),
    guarantee(
      "DKL-6:8/Guarantee/RuntimeProhibitionGuarantee",
      "RuntimeProhibitionGuarantee",
      "No persistence, storage, database, query, retrieval, indexing, versioning, snapshot, history, archive, retention, AI, Engine, Advisor, Scene, or UI runtime exists",
      ["DKL-6:8/BoundaryLocks"],
    ),
    guarantee(
      "DKL-6:8/Guarantee/PublicIndexReadinessGuarantee",
      "PublicIndexReadinessGuarantee",
      "Freeze readiness is ReadyForDKL6PublicIndex",
      ["DKL-6:8/Result"],
    ),
  ]);

export const KnowledgeRepositoryFreezeGates: readonly KnowledgeRepositoryFreezeGate[] =
  Object.freeze([
    gate("DKL-6:8/Gate/FreezeIdentityGate", "FreezeIdentityGate", [
      "DKL-6:8/Identity",
    ]),
    gate("DKL-6:8/Gate/FreezeScopeGate", "FreezeScopeGate", ["DKL-6:8/Scope"]),
    gate(
      "DKL-6:8/Gate/FrozenComponentRegistryGate",
      "FrozenComponentRegistryGate",
      ["DKL-6:8/Components"],
    ),
    gate(
      "DKL-6:8/Gate/CertificationAcceptanceGate",
      "CertificationAcceptanceGate",
      ["DKL-6:7/KnowledgeRepositoryCertification"],
    ),
    gate(
      "DKL-6:8/Gate/CanonicalCountPreservationGate",
      "CanonicalCountPreservationGate",
      ["DKL-6:8/CanonicalCounts", "DKL-6:7/Evidence"],
    ),
    gate("DKL-6:8/Gate/CompatibilityLockGate", "CompatibilityLockGate", [
      "DKL-6:8/CompatibilityLocks",
    ]),
    gate("DKL-6:8/Gate/DependencyLockGate", "DependencyLockGate", [
      "DKL-6:8/DependencyLocks",
    ]),
    gate("DKL-6:8/Gate/CoreLockGate", "CoreLockGate", ["DKL-6:8/CoreLocks"]),
    gate("DKL-6:8/Gate/ExtensionLockGate", "ExtensionLockGate", [
      "DKL-6:8/ExtensionLocks",
    ]),
    gate("DKL-6:8/Gate/BoundaryLockGate", "BoundaryLockGate", [
      "DKL-6:8/BoundaryLocks",
    ]),
    gate("DKL-6:8/Gate/PublicApiLockGate", "PublicApiLockGate", [
      "DKL-6:8/PublicApis",
    ]),
    gate("DKL-6:8/Gate/RegressionLockGate", "RegressionLockGate", [
      "DKL-6:8/RegressionLocks",
    ]),
    gate("DKL-6:8/Gate/ImmutabilityGate", "ImmutabilityGate", [
      "DKL-6:8/Aggregate",
    ]),
    gate("DKL-6:8/Gate/DeterminismGate", "DeterminismGate", [
      "DKL-6:8/Aggregate",
    ]),
    gate("DKL-6:8/Gate/RuntimeProhibitionGate", "RuntimeProhibitionGate", [
      "DKL-6:8/BoundaryLocks",
    ]),
    gate(
      "DKL-6:8/Gate/PublicIndexReadinessGate",
      "PublicIndexReadinessGate",
      ["DKL-6:8/Result"],
    ),
  ]);

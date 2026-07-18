/**
 * DKL-6:8 — Knowledge Repository Freeze Locks.
 *
 * Declares core, extension, boundary, regression, and public API locks.
 * Metadata only. No runtime behavior.
 *
 * Ownership: owned exclusively by DKL-6:8.
 */

import type {
  KnowledgeRepositoryFreezeBoundaryLock,
  KnowledgeRepositoryFreezeCoreLock,
  KnowledgeRepositoryFreezeExtensionLock,
  KnowledgeRepositoryFreezePublicApiPhase,
  KnowledgeRepositoryFreezeRegressionLock,
} from "./knowledgeRepositoryFreezeTypes.ts";

function core(
  id: string,
  name: string,
  protectedSubject: string,
  protectedInvariant: string,
  evidenceReferences: readonly string[],
): KnowledgeRepositoryFreezeCoreLock {
  return Object.freeze({
    id,
    name,
    protectedSubject,
    protectedInvariant,
    evidenceReferences: Object.freeze([...evidenceReferences]),
    status: "Locked" as const,
    owner: "DKL-6" as const,
    runtimeBehavior: "None" as const,
  });
}

function extension(
  id: string,
  name: string,
  extensionPolicy: string,
): KnowledgeRepositoryFreezeExtensionLock {
  return Object.freeze({
    id,
    name,
    extensionPolicy,
    allowedChangeType: "AdditiveCompatibleExtension" as const,
    prohibitedChangeType: "BreakingChange" as const,
    status: "Locked" as const,
    owner: "DKL-6" as const,
    runtimeBehavior: "None" as const,
  });
}

function boundary(
  id: string,
  name: string,
): KnowledgeRepositoryFreezeBoundaryLock {
  return Object.freeze({
    id,
    name,
    status: "Locked" as const,
    preservationStatus: "CertifiedPreserved" as const,
    owner: "DKL-6" as const,
    runtimeBehavior: "None" as const,
  });
}

function regression(
  id: string,
  protectedSubject: string,
  expectedInvariant: string,
  evidenceReferences: readonly string[],
): KnowledgeRepositoryFreezeRegressionLock {
  return Object.freeze({
    id,
    protectedSubject,
    expectedInvariant,
    evidenceReferences: Object.freeze([...evidenceReferences]),
    status: "Locked" as const,
    owner: "DKL-6" as const,
    runtimeBehavior: "None" as const,
  });
}

export const KnowledgeRepositoryFreezeCoreLocks: readonly KnowledgeRepositoryFreezeCoreLock[] =
  Object.freeze([
    core(
      "DKL-6:8/Core/IdentityLock",
      "IdentityLock",
      "DKL-6:8/KnowledgeRepositoryFreeze",
      "Freeze identity remains DKL-6:8/KnowledgeRepositoryFreeze",
      ["DKL-6:8/Identity", "DKL-6:7/KnowledgeRepositoryCertification"],
    ),
    core(
      "DKL-6:8/Core/VersionLock",
      "VersionLock",
      "Freeze Version",
      "Freeze version remains 1.0.0",
      ["DKL-6:8/Identity"],
    ),
    core(
      "DKL-6:8/Core/NamespaceLock",
      "NamespaceLock",
      "Freeze Namespace",
      "Namespace remains nexora.dkl.repository.freeze",
      ["DKL-6:8/Identity"],
    ),
    core(
      "DKL-6:8/Core/OwnershipLock",
      "OwnershipLock",
      "DKL-6 Ownership",
      "All frozen components remain owned by DKL-6",
      ["DKL-6:8/Scope", "DKL-6:8/Components"],
    ),
    core(
      "DKL-6:8/Core/BoundaryLock",
      "BoundaryLock",
      "Runtime and Persistence Boundaries",
      "Certified architectural boundaries remain Locked and CertifiedPreserved",
      ["DKL-6:7/BoundaryCertifications", "DKL-6:6/Boundaries"],
    ),
    core(
      "DKL-6:8/Core/DependencyLock",
      "DependencyLock",
      "Public Surface Dependencies",
      "Approved public-surface dependency graph remains Locked",
      ["DKL-6:8/DependencyLocks"],
    ),
    core(
      "DKL-6:8/Core/RegistryInventoryLock",
      "RegistryInventoryLock",
      "Knowledge Repository Registry Inventory",
      "Registry remains 103 entries across 16 groups",
      ["DKL-6:2/KnowledgeRepositoryRegistry", "DKL-6:7/Evidence"],
    ),
    core(
      "DKL-6:8/Core/ModelInventoryLock",
      "ModelInventoryLock",
      "Knowledge Repository Model Inventory",
      "Model remains 52 models, 13 relationships, 14 registry traceability groups",
      ["DKL-6:3/KnowledgeRepositoryModel", "DKL-6:7/Evidence"],
    ),
    core(
      "DKL-6:8/Core/ValidationResultLock",
      "ValidationResultLock",
      "Knowledge Repository Validation Result",
      "Validation remains 40/40 rules and 10/10 gates",
      ["DKL-6:4/KnowledgeRepositoryValidation", "DKL-6:7/Evidence"],
    ),
    core(
      "DKL-6:8/Core/ManifestCompletenessLock",
      "ManifestCompletenessLock",
      "Knowledge Repository Manifest Completeness",
      "Manifest remains Complete with 12/12 completeness gates",
      ["DKL-6:5/KnowledgeRepositoryManifest", "DKL-6:7/Evidence"],
    ),
    core(
      "DKL-6:8/Core/PlatformCompositionLock",
      "PlatformCompositionLock",
      "Knowledge Repository Platform Composition",
      "Platform remains Complete with 14/14 readiness gates",
      ["DKL-6:6/KnowledgeRepositoryPlatform", "DKL-6:7/Evidence"],
    ),
    core(
      "DKL-6:8/Core/CertificationResultLock",
      "CertificationResultLock",
      "Knowledge Repository Certification Result",
      "Certification remains Certified with 18/18 criteria and 15/15 gates",
      ["DKL-6:7/KnowledgeRepositoryCertification"],
    ),
  ]);

export const KnowledgeRepositoryFreezeExtensionLocks: readonly KnowledgeRepositoryFreezeExtensionLock[] =
  Object.freeze([
    extension(
      "DKL-6:8/Ext/NoBreakingIdentityChanges",
      "NoBreakingIdentityChanges",
      "Identities may not be renamed, removed, or semantically weakened",
    ),
    extension(
      "DKL-6:8/Ext/NoBreakingPublicApiRemovals",
      "NoBreakingPublicApiRemovals",
      "Frozen public APIs may not be removed or renamed",
    ),
    extension(
      "DKL-6:8/Ext/NoRegistryEntryMutation",
      "NoRegistryEntryMutation",
      "Registry entries may not be mutated; additive entries only if policy allows",
    ),
    extension(
      "DKL-6:8/Ext/NoModelContractMutation",
      "NoModelContractMutation",
      "Model contracts may not be mutated; additive contracts only if policy allows",
    ),
    extension(
      "DKL-6:8/Ext/NoValidationRuleRemoval",
      "NoValidationRuleRemoval",
      "Validation rules may not be removed or weakened",
    ),
    extension(
      "DKL-6:8/Ext/NoBoundaryWeakening",
      "NoBoundaryWeakening",
      "Architectural boundaries may not be weakened",
    ),
    extension(
      "DKL-6:8/Ext/NoRuntimeBehaviorIntroduction",
      "NoRuntimeBehaviorIntroduction",
      "Runtime behavior may not be introduced into frozen architecture",
    ),
    extension(
      "DKL-6:8/Ext/AdditiveExtensionsOnly",
      "AdditiveExtensionsOnly",
      "Only AdditiveCompatibleExtension changes are permitted after Freeze",
    ),
  ]);

export const KnowledgeRepositoryFreezeBoundaryLocks: readonly KnowledgeRepositoryFreezeBoundaryLock[] =
  Object.freeze([
    boundary("DKL-6:8/Boundary/NoPersistenceImplementation", "NoPersistenceImplementation"),
    boundary("DKL-6:8/Boundary/NoDatabaseCoupling", "NoDatabaseCoupling"),
    boundary("DKL-6:8/Boundary/NoStorageEngineCoupling", "NoStorageEngineCoupling"),
    boundary("DKL-6:8/Boundary/NoQueryExecution", "NoQueryExecution"),
    boundary("DKL-6:8/Boundary/NoRetrievalExecution", "NoRetrievalExecution"),
    boundary("DKL-6:8/Boundary/NoIndexExecution", "NoIndexExecution"),
    boundary("DKL-6:8/Boundary/NoVersionExecution", "NoVersionExecution"),
    boundary("DKL-6:8/Boundary/NoSnapshotExecution", "NoSnapshotExecution"),
    boundary("DKL-6:8/Boundary/NoHistoryExecution", "NoHistoryExecution"),
    boundary("DKL-6:8/Boundary/NoArchiveExecution", "NoArchiveExecution"),
    boundary("DKL-6:8/Boundary/NoRetentionExecution", "NoRetentionExecution"),
    boundary("DKL-6:8/Boundary/NoFilesystemAccess", "NoFilesystemAccess"),
    boundary("DKL-6:8/Boundary/NoNetworkAccess", "NoNetworkAccess"),
    boundary("DKL-6:8/Boundary/NoExternalServiceAccess", "NoExternalServiceAccess"),
    boundary("DKL-6:8/Boundary/NoAIBehavior", "NoAIBehavior"),
    boundary("DKL-6:8/Boundary/NoEngineReasoning", "NoEngineReasoning"),
    boundary("DKL-6:8/Boundary/NoAdvisorOrSceneBehavior", "NoAdvisorOrSceneBehavior"),
    boundary("DKL-6:8/Boundary/NoUIBehavior", "NoUIBehavior"),
  ]);

export const KnowledgeRepositoryFreezeRegressionLocks: readonly KnowledgeRepositoryFreezeRegressionLock[] =
  Object.freeze([
    regression(
      "DKL-6:8/Regression/FoundationIdentityRegressionLock",
      "DKL-6:1/KnowledgeRepositoryFoundation",
      "Foundation identity remains DKL-6:1/KnowledgeRepositoryFoundation",
      ["DKL-6:1/KnowledgeRepositoryFoundation", "DKL-6:7/Evidence"],
    ),
    regression(
      "DKL-6:8/Regression/RegistryIdentityRegressionLock",
      "DKL-6:2/KnowledgeRepositoryRegistry",
      "Registry identity remains DKL-6:2/KnowledgeRepositoryRegistry",
      ["DKL-6:2/KnowledgeRepositoryRegistry", "DKL-6:7/Evidence"],
    ),
    regression(
      "DKL-6:8/Regression/ModelIdentityRegressionLock",
      "DKL-6:3/KnowledgeRepositoryModel",
      "Model identity remains DKL-6:3/KnowledgeRepositoryModel",
      ["DKL-6:3/KnowledgeRepositoryModel", "DKL-6:7/Evidence"],
    ),
    regression(
      "DKL-6:8/Regression/ValidationIdentityRegressionLock",
      "DKL-6:4/KnowledgeRepositoryValidation",
      "Validation identity remains DKL-6:4/KnowledgeRepositoryValidation",
      ["DKL-6:4/KnowledgeRepositoryValidation", "DKL-6:7/Evidence"],
    ),
    regression(
      "DKL-6:8/Regression/ManifestIdentityRegressionLock",
      "DKL-6:5/KnowledgeRepositoryManifest",
      "Manifest identity remains DKL-6:5/KnowledgeRepositoryManifest",
      ["DKL-6:5/KnowledgeRepositoryManifest", "DKL-6:7/Evidence"],
    ),
    regression(
      "DKL-6:8/Regression/PlatformIdentityRegressionLock",
      "DKL-6:6/KnowledgeRepositoryPlatform",
      "Platform identity remains DKL-6:6/KnowledgeRepositoryPlatform",
      ["DKL-6:6/KnowledgeRepositoryPlatform", "DKL-6:7/Evidence"],
    ),
    regression(
      "DKL-6:8/Regression/CertificationIdentityRegressionLock",
      "DKL-6:7/KnowledgeRepositoryCertification",
      "Certification identity remains DKL-6:7/KnowledgeRepositoryCertification",
      ["DKL-6:7/KnowledgeRepositoryCertification"],
    ),
    regression(
      "DKL-6:8/Regression/FreezeIdentityRegressionLock",
      "DKL-6:8/KnowledgeRepositoryFreeze",
      "Freeze identity remains DKL-6:8/KnowledgeRepositoryFreeze",
      ["DKL-6:8/Identity"],
    ),
    regression(
      "DKL-6:8/Regression/PublicApiCountRegressionLock",
      "DKL-6 Public API Inventory",
      "Frozen public API total remains 62 (6+8+8+8+8+8+8+8)",
      ["DKL-6:8/PublicApis"],
    ),
    regression(
      "DKL-6:8/Regression/InventoryCountRegressionLock",
      "DKL-6 Canonical Inventories",
      "Foundation, Registry, Model, Validation, Manifest, Platform, and Certification counts remain unchanged",
      ["DKL-6:8/CanonicalCounts", "DKL-6:7/Evidence"],
    ),
    regression(
      "DKL-6:8/Regression/OwnershipRegressionLock",
      "DKL-6 Ownership",
      "All frozen components remain owned by DKL-6",
      ["DKL-6:8/Components"],
    ),
    regression(
      "DKL-6:8/Regression/BoundaryRegressionLock",
      "DKL-6 Boundaries",
      "Eighteen boundary locks remain Locked and CertifiedPreserved",
      ["DKL-6:8/BoundaryLocks", "DKL-6:7/BoundaryCertifications"],
    ),
    regression(
      "DKL-6:8/Regression/DependencyRegressionLock",
      "DKL-6 Dependencies",
      "Twenty-one dependency locks remain Locked to approved public surfaces",
      ["DKL-6:8/DependencyLocks"],
    ),
    regression(
      "DKL-6:8/Regression/RuntimeProhibitionRegressionLock",
      "Runtime Prohibition",
      "Runtime behavior remains None across Freeze scope and components",
      ["DKL-6:8/Scope", "DKL-6:8/Components"],
    ),
  ]);

export const KnowledgeRepositoryFreezePublicApiInventory: readonly KnowledgeRepositoryFreezePublicApiPhase[] =
  Object.freeze([
    Object.freeze({
      id: "DKL-6:8/PublicApi/DKL-6:1",
      phase: "DKL-6:1",
      sourceIdentity: "DKL-6:1/KnowledgeRepositoryFoundation",
      publicApiCount: 6,
      owner: "DKL-6" as const,
      runtimeBehavior: "None" as const,
    }),
    Object.freeze({
      id: "DKL-6:8/PublicApi/DKL-6:2",
      phase: "DKL-6:2",
      sourceIdentity: "DKL-6:2/KnowledgeRepositoryRegistry",
      publicApiCount: 8,
      owner: "DKL-6" as const,
      runtimeBehavior: "None" as const,
    }),
    Object.freeze({
      id: "DKL-6:8/PublicApi/DKL-6:3",
      phase: "DKL-6:3",
      sourceIdentity: "DKL-6:3/KnowledgeRepositoryModel",
      publicApiCount: 8,
      owner: "DKL-6" as const,
      runtimeBehavior: "None" as const,
    }),
    Object.freeze({
      id: "DKL-6:8/PublicApi/DKL-6:4",
      phase: "DKL-6:4",
      sourceIdentity: "DKL-6:4/KnowledgeRepositoryValidation",
      publicApiCount: 8,
      owner: "DKL-6" as const,
      runtimeBehavior: "None" as const,
    }),
    Object.freeze({
      id: "DKL-6:8/PublicApi/DKL-6:5",
      phase: "DKL-6:5",
      sourceIdentity: "DKL-6:5/KnowledgeRepositoryManifest",
      publicApiCount: 8,
      owner: "DKL-6" as const,
      runtimeBehavior: "None" as const,
    }),
    Object.freeze({
      id: "DKL-6:8/PublicApi/DKL-6:6",
      phase: "DKL-6:6",
      sourceIdentity: "DKL-6:6/KnowledgeRepositoryPlatform",
      publicApiCount: 8,
      owner: "DKL-6" as const,
      runtimeBehavior: "None" as const,
    }),
    Object.freeze({
      id: "DKL-6:8/PublicApi/DKL-6:7",
      phase: "DKL-6:7",
      sourceIdentity: "DKL-6:7/KnowledgeRepositoryCertification",
      publicApiCount: 8,
      owner: "DKL-6" as const,
      runtimeBehavior: "None" as const,
    }),
    Object.freeze({
      id: "DKL-6:8/PublicApi/DKL-6:8",
      phase: "DKL-6:8",
      sourceIdentity: "DKL-6:8/KnowledgeRepositoryFreeze",
      publicApiCount: 8,
      owner: "DKL-6" as const,
      runtimeBehavior: "None" as const,
    }),
  ]);

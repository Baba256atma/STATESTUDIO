/**
 * DKL-7:8 — Knowledge Services Freeze Locks.
 *
 * Exactly twelve immutable architectural metadata locks.
 * No runtime enforcement. No mutexes. No filesystem locks.
 *
 * Ownership: owned exclusively by DKL-7:8.
 */

import type { KnowledgeServicesFreezeLock } from "./knowledgeServicesFreezeTypes.ts";

const lock = (
  lockId: string,
  lockName: string,
  lockType: KnowledgeServicesFreezeLock["lockType"],
  lockScope: KnowledgeServicesFreezeLock["lockScope"],
  protectedSubject: string,
  protectedBaselineReferences: readonly string[],
  allowedChangeType: string,
  prohibitedChangeType: string,
  order: number,
): KnowledgeServicesFreezeLock =>
  Object.freeze({
    lockId,
    lockName,
    lockType,
    lockScope,
    protectedSubject,
    protectedBaselineReferences: Object.freeze([...protectedBaselineReferences]),
    allowedChangeType,
    prohibitedChangeType,
    compatibilityRequirement: "Compatible",
    certificationRequirement: "Certified Pass",
    publicIndexRelevance: "RequiredBeforePublicIndex",
    lockStatus: "Locked" as const,
    runtimeEnforcement: false as const,
    deterministicOrder: order,
  });

/** Exactly twelve architectural Freeze locks. */
export const KnowledgeServicesFreezeLocks: readonly KnowledgeServicesFreezeLock[] =
  Object.freeze([
    lock(
      "LOCK-KS-PUBLIC-API",
      "PublicApiLock",
      "PublicApiLock",
      "PublicApi",
      "Frozen public API identities",
      Object.freeze(["DKL-7:8/Baseline/CertificationInventory"]),
      "AdditiveVersionedExportOnly",
      "IncompatiblePublicApiIdentityChange",
      1,
    ),
    lock(
      "LOCK-KS-DEPENDENCY-CHAIN",
      "DependencyChainLock",
      "DependencyChainLock",
      "Dependency",
      "Canonical dependency chain",
      Object.freeze(["DKL-7:8/Baseline/CanonicalDependencyChain"]),
      "None",
      "ChainBypassOrDirectionChange",
      2,
    ),
    lock(
      "LOCK-KS-OWNERSHIP",
      "OwnershipLock",
      "OwnershipLock",
      "Ownership",
      "DKL-7 ownership boundaries 6/24",
      Object.freeze([
        "DKL-7:8/Baseline/FoundationIdentity",
        "DKL-7:8/Baseline/FoundationOwnership",
      ]),
      "None",
      "OwnershipExpansionOrTransfer",
      3,
    ),
    lock(
      "LOCK-KS-BOUNDARY",
      "BoundaryLock",
      "BoundaryLock",
      "Boundary",
      "29 prohibited surfaces",
      Object.freeze(["DKL-7:8/Baseline/FoundationBoundary"]),
      "None",
      "BoundaryWeakening",
      4,
    ),
    lock(
      "LOCK-KS-SERVICE-INVENTORY",
      "ServiceInventoryLock",
      "ServiceInventoryLock",
      "Inventory",
      "12 registered services",
      Object.freeze([
        "DKL-7:8/Baseline/RegistryService",
        "DKL-7:8/Baseline/RegistryAccessMode",
      ]),
      "AdditiveMetadataOnly",
      "ServiceRemovalOrIdChange",
      5,
    ),
    lock(
      "LOCK-KS-CAPABILITY-INVENTORY",
      "CapabilityInventoryLock",
      "CapabilityInventoryLock",
      "Inventory",
      "12 registered capabilities",
      Object.freeze(["DKL-7:8/Baseline/RegistryCapability"]),
      "AdditiveMetadataOnly",
      "CapabilityRemovalOrIdChange",
      6,
    ),
    lock(
      "LOCK-KS-CONTRACT-INVENTORY",
      "ContractInventoryLock",
      "ContractInventoryLock",
      "Inventory",
      "11 registered contracts",
      Object.freeze(["DKL-7:8/Baseline/RegistryContract"]),
      "AdditiveMetadataOnly",
      "ContractRemovalOrIdChange",
      7,
    ),
    lock(
      "LOCK-KS-MODEL-INVENTORY",
      "ModelInventoryLock",
      "ModelInventoryLock",
      "Inventory",
      "Model inventory 79 and relationships 28",
      Object.freeze([
        "DKL-7:8/Baseline/ModelInventory",
        "DKL-7:8/Baseline/ModelRelationship",
      ]),
      "AdditiveMetadataOnly",
      "ModelInventoryReductionOrBreakingChange",
      8,
    ),
    lock(
      "LOCK-KS-VALIDATION-STATE",
      "ValidationStateLock",
      "ValidationStateLock",
      "Validation",
      "Validation 48 Pass / 0 Fail",
      Object.freeze(["DKL-7:8/Baseline/ValidationPassState"]),
      "AdditiveEvidenceOnly",
      "PassStateRegression",
      9,
    ),
    lock(
      "LOCK-KS-COMPATIBILITY",
      "CompatibilityLock",
      "CompatibilityLock",
      "Compatibility",
      "Compatible declarations and consumer paths",
      Object.freeze(["DKL-7:8/Baseline/CompatibilityState"]),
      "AdditiveCompatibleDeclarationsOnly",
      "IncompatibleConsumerBypass",
      10,
    ),
    lock(
      "LOCK-KS-RUNTIME-PROHIBITION",
      "RuntimeProhibitionLock",
      "RuntimeProhibitionLock",
      "Runtime",
      "Absent runtime Knowledge Service behavior",
      Object.freeze([
        "DKL-7:8/Baseline/MutationMode",
        "DKL-7:8/Baseline/RuntimeProhibition",
      ]),
      "None",
      "RuntimeBehaviorOrMutationModes",
      11,
    ),
    lock(
      "LOCK-KS-CERTIFICATION-BASELINE",
      "CertificationBaselineLock",
      "CertificationBaselineLock",
      "Certification",
      "Certification gates, inventories 447/527/137",
      Object.freeze([
        "DKL-7:8/Baseline/ManifestInventory",
        "DKL-7:8/Baseline/PlatformInventory",
        "DKL-7:8/Baseline/CertificationInventory",
        "DKL-7:8/Baseline/CertificationGateState",
      ]),
      "VersionedReCertificationOnly",
      "UnversionedBaselineCountChange",
      12,
    ),
  ]);

export const KnowledgeServicesFreezeAllLocksActive =
  KnowledgeServicesFreezeLocks.every((item) => item.lockStatus === "Locked");

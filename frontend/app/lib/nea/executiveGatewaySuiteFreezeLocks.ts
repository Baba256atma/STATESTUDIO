/**
 * NEA-8:8 — Executive Gateway Suite Freeze Locks.
 *
 * Immutable declarative architectural locks for certified Executive Gateway Suite.
 * Locks describe protection only. No runtime enforcement.
 *
 * Ownership: owned exclusively by NEA-8:8.
 */

import { ExecutiveGatewaySuiteCertificationId } from "./executiveGatewaySuiteCertification.ts";
import type {
  ExecutiveGatewaySuiteFreezeLock,
  ExecutiveGatewaySuiteFreezeLockId,
} from "./executiveGatewaySuiteFreezeTypes.ts";

const lock = (
  id: ExecutiveGatewaySuiteFreezeLockId,
  name: string,
  description: string,
  rationale: string,
  order: number,
): ExecutiveGatewaySuiteFreezeLock =>
  Object.freeze({
    id,
    name,
    description,
    state: "Locked" as const,
    rationale,
    executesRuntime: false as const,
    metadataOnly: true as const,
    immutable: true as const,
    deterministicOrder: order,
  });

/**
 * Exactly eighteen architectural freeze locks.
 * Declarative only — no runtime freeze logic.
 */
export const ExecutiveGatewaySuiteFreezeLocks: readonly ExecutiveGatewaySuiteFreezeLock[] =
  Object.freeze([
    lock(
      "FoundationLock",
      "Foundation Lock",
      "NEA-8:1 Foundation contracts and readiness are permanently frozen.",
      "Protects executiveGatewaySuiteFoundation.ts through Certification reference.",
      1,
    ),
    lock(
      "RegistryLock",
      "Registry Lock",
      "NEA-8:2 Registry collections and public surface are permanently frozen.",
      "Protects executiveGatewaySuiteRegistry.ts through Certification reference.",
      2,
    ),
    lock(
      "ModelLock",
      "Model Lock",
      "NEA-8:3 Domain models and schema descriptors are permanently frozen.",
      "Protects executiveGatewaySuiteModel.ts through Certification reference.",
      3,
    ),
    lock(
      "ValidationLock",
      "Validation Lock",
      "NEA-8:4 Validation rules and ownership boundaries are permanently frozen.",
      "Protects executiveGatewaySuiteValidation.ts through Certification reference.",
      4,
    ),
    lock(
      "ManifestLock",
      "Manifest Lock",
      "NEA-8:5 Manifest inventory and readiness are permanently frozen.",
      "Protects executiveGatewaySuiteManifest.ts through Certification reference.",
      5,
    ),
    lock(
      "PlatformLock",
      "Platform Lock",
      "NEA-8:6 Platform composition and namespace are permanently frozen.",
      "Protects executiveGatewaySuitePlatform.ts through Certification reference.",
      6,
    ),
    lock(
      "CertificationLock",
      "Certification Lock",
      "NEA-8:7 Certification gates and Pass outcome are permanently frozen.",
      "Protects executiveGatewaySuiteCertification.ts Pass baseline.",
      7,
    ),
    lock(
      "SuiteCompositionLock",
      "Suite Composition Lock",
      "Seven-component suite composition remains permanently frozen and metadata-only.",
      `Protects ${ExecutiveGatewaySuiteCertificationId}/platform/namespace/suiteComponents.`,
      8,
    ),
    lock(
      "ComponentIdentityLock",
      "Component Identity Lock",
      "Component identities for NEA-1 through NEA-7 remain permanently frozen.",
      `Protects ${ExecutiveGatewaySuiteCertificationId}/platform/namespace/registry/collections/componentIdentities.`,
      9,
    ),
    lock(
      "NamespaceLock",
      "Namespace Lock",
      "Platform namespace composition order and section count are permanently frozen.",
      `Protects ${ExecutiveGatewaySuiteCertificationId}/platform/namespace.`,
      10,
    ),
    lock(
      "PublicSurfaceLock",
      "Public Surface Lock",
      "Eight-export public surfaces across Foundation through Certification are frozen.",
      "Protects NEA-8:1–NEA-8:7 public exports.",
      11,
    ),
    lock(
      "MetadataLock",
      "Metadata Lock",
      "Canonical metadata identity and readiness values are permanently frozen.",
      "Protects Certification and Platform metadata.",
      12,
    ),
    lock(
      "InventoryLock",
      "Inventory Lock",
      "Derived inventory counts remain Certification-sourced and non-reconstructed.",
      "Protects Certification summary inventories (532 / 820).",
      13,
    ),
    lock(
      "OwnershipLock",
      "Ownership Lock",
      "Phase ownership boundaries remain unique and non-overlapping.",
      "Protects ownership declarations across the Suite chain.",
      14,
    ),
    lock(
      "DependencyLock",
      "Dependency Lock",
      "Dependency direction Certification → Platform → … → Foundation is frozen.",
      "Protects phase dependency chain direction.",
      15,
    ),
    lock(
      "CompatibilityLock",
      "Compatibility Lock",
      "Compatibility declarations remain Compatible and permanently frozen.",
      "Protects Freeze compatibility catalog baseline.",
      16,
    ),
    lock(
      "ArchitectureLock",
      "Architecture Lock",
      "Complete Foundation through Certification architecture remains permanently frozen.",
      "Protects composed Suite architecture completeness.",
      17,
    ),
    lock(
      "ReleaseLock",
      "Release Lock",
      "Freeze release baseline is permanent until a major-version successor.",
      "Protects NEA-8:8 Freeze release for Public Index consumers.",
      18,
    ),
  ]);

export const ExecutiveGatewaySuiteFreezeLockedLockCount =
  ExecutiveGatewaySuiteFreezeLocks.filter(
    (item) => item.state === "Locked",
  ).length;

export const ExecutiveGatewaySuiteFreezeAllLocksActive =
  ExecutiveGatewaySuiteFreezeLockedLockCount ===
  ExecutiveGatewaySuiteFreezeLocks.length;

/** Canonical immutable freeze lock catalog. */
export const ExecutiveGatewaySuiteFreezeLockCatalog = Object.freeze({
  catalogId: "NEA-8:8/FreezeLockCatalog",
  sourcePhase: "NEA-8:8" as const,
  certificationId: ExecutiveGatewaySuiteCertificationId,
  locks: ExecutiveGatewaySuiteFreezeLocks,
  lockCount: ExecutiveGatewaySuiteFreezeLocks.length,
  lockedLockCount: ExecutiveGatewaySuiteFreezeLockedLockCount,
  allLocksActive: ExecutiveGatewaySuiteFreezeAllLocksActive,
  executesRuntime: false as const,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});

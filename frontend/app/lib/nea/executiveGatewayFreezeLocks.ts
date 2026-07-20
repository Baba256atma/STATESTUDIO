/**
 * NEA-1:8 — Executive Gateway Freeze Locks.
 *
 * Immutable declarative architectural locks for the certified Executive Gateway.
 * Locks describe protection only. No runtime enforcement.
 *
 * Ownership: owned exclusively by NEA-1:8.
 */

import { ExecutiveGatewayCertificationId } from "./executiveGatewayCertification.ts";
import type {
  ExecutiveGatewayFreezeLock,
  ExecutiveGatewayFreezeLockId,
} from "./executiveGatewayFreezeTypes.ts";

const lock = (
  lockId: ExecutiveGatewayFreezeLockId,
  lockName: string,
  description: string,
  protectedSurface: string,
  order: number,
): ExecutiveGatewayFreezeLock =>
  Object.freeze({
    lockId,
    lockName,
    description,
    protectedSurface,
    status: "Locked" as const,
    protectionLevel: "Permanent" as const,
    executesRuntime: false as const,
    metadataOnly: true as const,
    immutable: true as const,
    deterministicOrder: order,
  });

/**
 * Exactly sixteen architectural freeze locks.
 * Declarative only — no runtime freeze logic.
 */
export const ExecutiveGatewayFreezeLocks: readonly ExecutiveGatewayFreezeLock[] =
  Object.freeze([
    lock(
      "FoundationLock",
      "Foundation Lock",
      "NEA-1:1 Foundation contracts and readiness are permanently frozen.",
      "executiveGatewayFoundation.ts",
      1,
    ),
    lock(
      "RegistryLock",
      "Registry Lock",
      "NEA-1:2 Registry collections and public surface are permanently frozen.",
      "executiveGatewayRegistry.ts",
      2,
    ),
    lock(
      "ModelLock",
      "Model Lock",
      "NEA-1:3 Domain models and schema descriptors are permanently frozen.",
      "executiveGatewayModel.ts",
      3,
    ),
    lock(
      "ValidationLock",
      "Validation Lock",
      "NEA-1:4 Validation rules and ownership boundaries are permanently frozen.",
      "executiveGatewayValidation.ts",
      4,
    ),
    lock(
      "ManifestLock",
      "Manifest Lock",
      "NEA-1:5 Manifest inventory and readiness are permanently frozen.",
      "executiveGatewayManifest.ts",
      5,
    ),
    lock(
      "PlatformLock",
      "Platform Lock",
      "NEA-1:6 Platform composition and namespace are permanently frozen.",
      "executiveGatewayPlatform.ts",
      6,
    ),
    lock(
      "CertificationLock",
      "Certification Lock",
      "NEA-1:7 Certification gates and Pass outcome are permanently frozen.",
      "executiveGatewayCertification.ts",
      7,
    ),
    lock(
      "NamespaceLock",
      "Namespace Lock",
      "Platform namespace composition order and section count are permanently frozen.",
      `${ExecutiveGatewayCertificationId}/platform/namespace`,
      8,
    ),
    lock(
      "PublicSurfaceLock",
      "Public Surface Lock",
      "Eight-export public surfaces across Foundation through Certification are frozen.",
      "NEA-1:1–NEA-1:7 public exports",
      9,
    ),
    lock(
      "MetadataLock",
      "Metadata Lock",
      "Canonical metadata identity and readiness values are permanently frozen.",
      "Certification and Platform metadata",
      10,
    ),
    lock(
      "InventoryLock",
      "Inventory Lock",
      "Derived inventory counts remain Certification-sourced and non-reconstructed.",
      "Certification summary inventories",
      11,
    ),
    lock(
      "OwnershipLock",
      "Ownership Lock",
      "Phase ownership boundaries remain unique and non-overlapping.",
      "Ownership declarations",
      12,
    ),
    lock(
      "DependencyLock",
      "Dependency Lock",
      "Dependency direction Certification → Platform → … → Foundation is frozen.",
      "Phase dependency chain",
      13,
    ),
    lock(
      "CompatibilityLock",
      "Compatibility Lock",
      "Compatibility declarations are permanently locked for Public Index consumers.",
      "Freeze compatibility catalog",
      14,
    ),
    lock(
      "ArchitectureLock",
      "Architecture Lock",
      "Certified architecture baseline cannot be replaced or reconstructed.",
      "Executive Gateway architecture",
      15,
    ),
    lock(
      "ReleaseLock",
      "Release Lock",
      "Freeze release baseline is permanent until a major-version successor.",
      "NEA-1:8 Freeze release",
      16,
    ),
  ]);

export const ExecutiveGatewayFreezeLockedLockCount =
  ExecutiveGatewayFreezeLocks.filter((item) => item.status === "Locked")
    .length;

export const ExecutiveGatewayFreezeAllLocksActive =
  ExecutiveGatewayFreezeLockedLockCount ===
  ExecutiveGatewayFreezeLocks.length;

/** Canonical immutable freeze lock catalog. */
export const ExecutiveGatewayFreezeLockCatalog = Object.freeze({
  catalogId: "NEA-1:8/FreezeLockCatalog",
  sourcePhase: "NEA-1:8" as const,
  certificationId: ExecutiveGatewayCertificationId,
  locks: ExecutiveGatewayFreezeLocks,
  lockCount: ExecutiveGatewayFreezeLocks.length,
  lockedLockCount: ExecutiveGatewayFreezeLockedLockCount,
  allLocksActive: ExecutiveGatewayFreezeAllLocksActive,
  executesRuntime: false as const,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});

/**
 * NEA-4:8 — Security Gateway Freeze Locks.
 *
 * Immutable declarative architectural locks for certified Security Gateway.
 * Locks describe protection only. No runtime enforcement.
 *
 * Ownership: owned exclusively by NEA-4:8.
 */

import { SecurityGatewayCertificationId } from "./securityGatewayCertification.ts";
import type {
  SecurityGatewayFreezeLock,
  SecurityGatewayFreezeLockId,
} from "./securityGatewayFreezeTypes.ts";

const lock = (
  lockId: SecurityGatewayFreezeLockId,
  lockName: string,
  description: string,
  protectedSurface: string,
  order: number,
): SecurityGatewayFreezeLock =>
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
 * Exactly seventeen architectural freeze locks.
 * Declarative only — no runtime freeze logic.
 */
export const SecurityGatewayFreezeLocks: readonly SecurityGatewayFreezeLock[] =
  Object.freeze([
    lock(
      "FoundationLock",
      "Foundation Lock",
      "NEA-4:1 Foundation contracts and readiness are permanently frozen.",
      "securityGatewayFoundation.ts",
      1,
    ),
    lock(
      "RegistryLock",
      "Registry Lock",
      "NEA-4:2 Registry collections and public surface are permanently frozen.",
      "securityGatewayRegistry.ts",
      2,
    ),
    lock(
      "ModelLock",
      "Model Lock",
      "NEA-4:3 Domain models and schema descriptors are permanently frozen.",
      "securityGatewayModel.ts",
      3,
    ),
    lock(
      "ValidationLock",
      "Validation Lock",
      "NEA-4:4 Validation rules and ownership boundaries are permanently frozen.",
      "securityGatewayValidation.ts",
      4,
    ),
    lock(
      "ManifestLock",
      "Manifest Lock",
      "NEA-4:5 Manifest inventory and readiness are permanently frozen.",
      "securityGatewayManifest.ts",
      5,
    ),
    lock(
      "PlatformLock",
      "Platform Lock",
      "NEA-4:6 Platform composition and namespace are permanently frozen.",
      "securityGatewayPlatform.ts",
      6,
    ),
    lock(
      "CertificationLock",
      "Certification Lock",
      "NEA-4:7 Certification gates and Pass outcome are permanently frozen.",
      "securityGatewayCertification.ts",
      7,
    ),
    lock(
      "SecurityIdentityLock",
      "Security Identity Lock",
      "Security identity registry remains permanently frozen and metadata-only.",
      `${SecurityGatewayCertificationId}/platform/namespace/registry/collections/securityIdentities`,
      8,
    ),
    lock(
      "SecurityPolicyLock",
      "Security Policy Lock",
      "Security policy registry remains permanently frozen and metadata-only.",
      `${SecurityGatewayCertificationId}/platform/namespace/registry/collections/securityPolicies`,
      9,
    ),
    lock(
      "PermissionLock",
      "Permission Lock",
      "Permission registry remains permanently frozen without evaluation behavior.",
      `${SecurityGatewayCertificationId}/platform/namespace/registry/collections/permissions`,
      10,
    ),
    lock(
      "NamespaceLock",
      "Namespace Lock",
      "Platform namespace composition order and section count are permanently frozen.",
      `${SecurityGatewayCertificationId}/platform/namespace`,
      11,
    ),
    lock(
      "PublicSurfaceLock",
      "Public Surface Lock",
      "Eight-export public surfaces across Foundation through Certification are frozen.",
      "NEA-4:1–NEA-4:7 public exports",
      12,
    ),
    lock(
      "MetadataLock",
      "Metadata Lock",
      "Canonical metadata identity and readiness values are permanently frozen.",
      "Certification and Platform metadata",
      13,
    ),
    lock(
      "InventoryLock",
      "Inventory Lock",
      "Derived inventory counts remain Certification-sourced and non-reconstructed.",
      "Certification summary inventories",
      14,
    ),
    lock(
      "DependencyLock",
      "Dependency Lock",
      "Dependency direction Certification → Platform → … → Foundation is frozen.",
      "Phase dependency chain",
      15,
    ),
    lock(
      "CompatibilityLock",
      "Compatibility Lock",
      "Compatibility declarations are permanently locked for Public Index consumers.",
      "Freeze compatibility catalog",
      16,
    ),
    lock(
      "ReleaseLock",
      "Release Lock",
      "Freeze release baseline is permanent until a major-version successor.",
      "NEA-4:8 Freeze release",
      17,
    ),
  ]);

export const SecurityGatewayFreezeLockedLockCount =
  SecurityGatewayFreezeLocks.filter((item) => item.status === "Locked").length;

export const SecurityGatewayFreezeAllLocksActive =
  SecurityGatewayFreezeLockedLockCount === SecurityGatewayFreezeLocks.length;

/** Canonical immutable freeze lock catalog. */
export const SecurityGatewayFreezeLockCatalog = Object.freeze({
  catalogId: "NEA-4:8/FreezeLockCatalog",
  sourcePhase: "NEA-4:8" as const,
  certificationId: SecurityGatewayCertificationId,
  locks: SecurityGatewayFreezeLocks,
  lockCount: SecurityGatewayFreezeLocks.length,
  lockedLockCount: SecurityGatewayFreezeLockedLockCount,
  allLocksActive: SecurityGatewayFreezeAllLocksActive,
  executesRuntime: false as const,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});

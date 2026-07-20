/**
 * NEA-5:8 — Gateway Routing Freeze Locks.
 *
 * Immutable declarative architectural locks for certified Gateway Routing.
 * Locks describe protection only. No runtime enforcement.
 *
 * Ownership: owned exclusively by NEA-5:8.
 */

import { GatewayRoutingCertificationId } from "./gatewayRoutingCertification.ts";
import type {
  GatewayRoutingFreezeLock,
  GatewayRoutingFreezeLockId,
} from "./gatewayRoutingFreezeTypes.ts";

const lock = (
  lockId: GatewayRoutingFreezeLockId,
  lockName: string,
  description: string,
  protectedSurface: string,
  order: number,
): GatewayRoutingFreezeLock =>
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
export const GatewayRoutingFreezeLocks: readonly GatewayRoutingFreezeLock[] =
  Object.freeze([
    lock(
      "FoundationLock",
      "Foundation Lock",
      "NEA-5:1 Foundation contracts and readiness are permanently frozen.",
      "gatewayRoutingFoundation.ts",
      1,
    ),
    lock(
      "RegistryLock",
      "Registry Lock",
      "NEA-5:2 Registry collections and public surface are permanently frozen.",
      "gatewayRoutingRegistry.ts",
      2,
    ),
    lock(
      "ModelLock",
      "Model Lock",
      "NEA-5:3 Domain models and schema descriptors are permanently frozen.",
      "gatewayRoutingModel.ts",
      3,
    ),
    lock(
      "ValidationLock",
      "Validation Lock",
      "NEA-5:4 Validation rules and ownership boundaries are permanently frozen.",
      "gatewayRoutingValidation.ts",
      4,
    ),
    lock(
      "ManifestLock",
      "Manifest Lock",
      "NEA-5:5 Manifest inventory and readiness are permanently frozen.",
      "gatewayRoutingManifest.ts",
      5,
    ),
    lock(
      "PlatformLock",
      "Platform Lock",
      "NEA-5:6 Platform composition and namespace are permanently frozen.",
      "gatewayRoutingPlatform.ts",
      6,
    ),
    lock(
      "CertificationLock",
      "Certification Lock",
      "NEA-5:7 Certification gates and Pass outcome are permanently frozen.",
      "gatewayRoutingCertification.ts",
      7,
    ),
    lock(
      "RouteIdentityLock",
      "Route Identity Lock",
      "Route identity registry remains permanently frozen and metadata-only.",
      `${GatewayRoutingCertificationId}/platform/namespace/registry/collections/routeIdentities`,
      8,
    ),
    lock(
      "RouteDefinitionLock",
      "Route Definition Lock",
      "Route Definition domain model remains permanently frozen and metadata-only.",
      `${GatewayRoutingCertificationId}/platform/namespace/model/domainModels`,
      9,
    ),
    lock(
      "NamespaceLock",
      "Namespace Lock",
      "Platform namespace composition order and section count are permanently frozen.",
      `${GatewayRoutingCertificationId}/platform/namespace`,
      10,
    ),
    lock(
      "PublicSurfaceLock",
      "Public Surface Lock",
      "Eight-export public surfaces across Foundation through Certification are frozen.",
      "NEA-5:1–NEA-5:7 public exports",
      11,
    ),
    lock(
      "MetadataLock",
      "Metadata Lock",
      "Canonical metadata identity and readiness values are permanently frozen.",
      "Certification and Platform metadata",
      12,
    ),
    lock(
      "InventoryLock",
      "Inventory Lock",
      "Derived inventory counts remain Certification-sourced and non-reconstructed.",
      "Certification summary inventories",
      13,
    ),
    lock(
      "OwnershipLock",
      "Ownership Lock",
      "Phase ownership boundaries remain unique and non-overlapping.",
      "Ownership declarations",
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
      "NEA-5:8 Freeze release",
      17,
    ),
  ]);

export const GatewayRoutingFreezeLockedLockCount =
  GatewayRoutingFreezeLocks.filter((item) => item.status === "Locked").length;

export const GatewayRoutingFreezeAllLocksActive =
  GatewayRoutingFreezeLockedLockCount === GatewayRoutingFreezeLocks.length;

/** Canonical immutable freeze lock catalog. */
export const GatewayRoutingFreezeLockCatalog = Object.freeze({
  catalogId: "NEA-5:8/FreezeLockCatalog",
  sourcePhase: "NEA-5:8" as const,
  certificationId: GatewayRoutingCertificationId,
  locks: GatewayRoutingFreezeLocks,
  lockCount: GatewayRoutingFreezeLocks.length,
  lockedLockCount: GatewayRoutingFreezeLockedLockCount,
  allLocksActive: GatewayRoutingFreezeAllLocksActive,
  executesRuntime: false as const,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});

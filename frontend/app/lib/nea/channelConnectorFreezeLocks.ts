/**
 * NEA-2:8 — Channel Connectors Freeze Locks.
 *
 * Immutable declarative architectural locks for the certified Channel Connectors.
 * Locks describe protection only. No runtime enforcement.
 *
 * Ownership: owned exclusively by NEA-2:8.
 */

import { ChannelConnectorCertificationId } from "./channelConnectorCertification.ts";
import type {
  ChannelConnectorFreezeLock,
  ChannelConnectorFreezeLockId,
} from "./channelConnectorFreezeTypes.ts";

const lock = (
  lockId: ChannelConnectorFreezeLockId,
  lockName: string,
  description: string,
  protectedSurface: string,
  order: number,
): ChannelConnectorFreezeLock =>
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
export const ChannelConnectorFreezeLocks: readonly ChannelConnectorFreezeLock[] =
  Object.freeze([
    lock(
      "FoundationLock",
      "Foundation Lock",
      "NEA-2:1 Foundation contracts and readiness are permanently frozen.",
      "channelConnectorFoundation.ts",
      1,
    ),
    lock(
      "RegistryLock",
      "Registry Lock",
      "NEA-2:2 Registry collections and public surface are permanently frozen.",
      "channelConnectorRegistry.ts",
      2,
    ),
    lock(
      "ModelLock",
      "Model Lock",
      "NEA-2:3 Domain models and schema descriptors are permanently frozen.",
      "channelConnectorModel.ts",
      3,
    ),
    lock(
      "ValidationLock",
      "Validation Lock",
      "NEA-2:4 Validation rules and ownership boundaries are permanently frozen.",
      "channelConnectorValidation.ts",
      4,
    ),
    lock(
      "ManifestLock",
      "Manifest Lock",
      "NEA-2:5 Manifest inventory and readiness are permanently frozen.",
      "channelConnectorManifest.ts",
      5,
    ),
    lock(
      "PlatformLock",
      "Platform Lock",
      "NEA-2:6 Platform composition and namespace are permanently frozen.",
      "channelConnectorPlatform.ts",
      6,
    ),
    lock(
      "CertificationLock",
      "Certification Lock",
      "NEA-2:7 Certification gates and Pass outcome are permanently frozen.",
      "channelConnectorCertification.ts",
      7,
    ),
    lock(
      "ConnectorIdentityLock",
      "Connector Identity Lock",
      "Connector identity registry remains permanently frozen and metadata-only.",
      `${ChannelConnectorCertificationId}/platform/namespace/registry/collections/identities`,
      8,
    ),
    lock(
      "NamespaceLock",
      "Namespace Lock",
      "Platform namespace composition order and section count are permanently frozen.",
      `${ChannelConnectorCertificationId}/platform/namespace`,
      9,
    ),
    lock(
      "PublicSurfaceLock",
      "Public Surface Lock",
      "Eight-export public surfaces across Foundation through Certification are frozen.",
      "NEA-2:1–NEA-2:7 public exports",
      10,
    ),
    lock(
      "MetadataLock",
      "Metadata Lock",
      "Canonical metadata identity and readiness values are permanently frozen.",
      "Certification and Platform metadata",
      11,
    ),
    lock(
      "InventoryLock",
      "Inventory Lock",
      "Derived inventory counts remain Certification-sourced and non-reconstructed.",
      "Certification summary inventories",
      12,
    ),
    lock(
      "OwnershipLock",
      "Ownership Lock",
      "Phase ownership boundaries remain unique and non-overlapping.",
      "Ownership declarations",
      13,
    ),
    lock(
      "DependencyLock",
      "Dependency Lock",
      "Dependency direction Certification → Platform → … → Foundation is frozen.",
      "Phase dependency chain",
      14,
    ),
    lock(
      "CompatibilityLock",
      "Compatibility Lock",
      "Compatibility declarations are permanently locked for Public Index consumers.",
      "Freeze compatibility catalog",
      15,
    ),
    lock(
      "ReleaseLock",
      "Release Lock",
      "Freeze release baseline is permanent until a major-version successor.",
      "NEA-2:8 Freeze release",
      16,
    ),
  ]);

export const ChannelConnectorFreezeLockedLockCount =
  ChannelConnectorFreezeLocks.filter((item) => item.status === "Locked")
    .length;

export const ChannelConnectorFreezeAllLocksActive =
  ChannelConnectorFreezeLockedLockCount ===
  ChannelConnectorFreezeLocks.length;

/** Canonical immutable freeze lock catalog. */
export const ChannelConnectorFreezeLockCatalog = Object.freeze({
  catalogId: "NEA-2:8/FreezeLockCatalog",
  sourcePhase: "NEA-2:8" as const,
  certificationId: ChannelConnectorCertificationId,
  locks: ChannelConnectorFreezeLocks,
  lockCount: ChannelConnectorFreezeLocks.length,
  lockedLockCount: ChannelConnectorFreezeLockedLockCount,
  allLocksActive: ChannelConnectorFreezeAllLocksActive,
  executesRuntime: false as const,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});

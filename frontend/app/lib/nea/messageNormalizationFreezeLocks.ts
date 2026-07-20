/**
 * NEA-6:8 — Message Normalization Freeze Locks.
 *
 * Immutable declarative architectural locks for certified Message Normalization.
 * Locks describe protection only. No runtime enforcement.
 *
 * Ownership: owned exclusively by NEA-6:8.
 */

import { MessageNormalizationCertificationId } from "./messageNormalizationCertification.ts";
import type {
  MessageNormalizationFreezeLock,
  MessageNormalizationFreezeLockId,
} from "./messageNormalizationFreezeTypes.ts";

const lock = (
  lockId: MessageNormalizationFreezeLockId,
  lockName: string,
  description: string,
  protectedSurface: string,
  order: number,
): MessageNormalizationFreezeLock =>
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
export const MessageNormalizationFreezeLocks: readonly MessageNormalizationFreezeLock[] =
  Object.freeze([
    lock(
      "FoundationLock",
      "Foundation Lock",
      "NEA-6:1 Foundation contracts and readiness are permanently frozen.",
      "messageNormalizationFoundation.ts",
      1,
    ),
    lock(
      "RegistryLock",
      "Registry Lock",
      "NEA-6:2 Registry collections and public surface are permanently frozen.",
      "messageNormalizationRegistry.ts",
      2,
    ),
    lock(
      "ModelLock",
      "Model Lock",
      "NEA-6:3 Domain models and schema descriptors are permanently frozen.",
      "messageNormalizationModel.ts",
      3,
    ),
    lock(
      "ValidationLock",
      "Validation Lock",
      "NEA-6:4 Validation rules and ownership boundaries are permanently frozen.",
      "messageNormalizationValidation.ts",
      4,
    ),
    lock(
      "ManifestLock",
      "Manifest Lock",
      "NEA-6:5 Manifest inventory and readiness are permanently frozen.",
      "messageNormalizationManifest.ts",
      5,
    ),
    lock(
      "PlatformLock",
      "Platform Lock",
      "NEA-6:6 Platform composition and namespace are permanently frozen.",
      "messageNormalizationPlatform.ts",
      6,
    ),
    lock(
      "CertificationLock",
      "Certification Lock",
      "NEA-6:7 Certification gates and Pass outcome are permanently frozen.",
      "messageNormalizationCertification.ts",
      7,
    ),
    lock(
      "ExecutiveMessageLock",
      "Executive Message Lock",
      "Canonical Executive Message contract remains permanently frozen and metadata-only.",
      `${MessageNormalizationCertificationId}/platform/namespace/foundation/contracts/executiveMessage`,
      8,
    ),
    lock(
      "MessageIdentityRegistryLock",
      "Message Identity Registry Lock",
      "Message identity registry remains permanently frozen and metadata-only.",
      `${MessageNormalizationCertificationId}/platform/namespace/registry/collections/messageIdentities`,
      9,
    ),
    lock(
      "PayloadRegistryLock",
      "Payload Registry Lock",
      "Payload registry remains permanently frozen and metadata-only.",
      `${MessageNormalizationCertificationId}/platform/namespace/registry/collections/payloads`,
      10,
    ),
    lock(
      "NamespaceLock",
      "Namespace Lock",
      "Platform namespace composition order and section count are permanently frozen.",
      `${MessageNormalizationCertificationId}/platform/namespace`,
      11,
    ),
    lock(
      "PublicSurfaceLock",
      "Public Surface Lock",
      "Eight-export public surfaces across Foundation through Certification are frozen.",
      "NEA-6:1–NEA-6:7 public exports",
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
      "OwnershipLock",
      "Ownership Lock",
      "Phase ownership boundaries remain unique and non-overlapping.",
      "Ownership declarations",
      15,
    ),
    lock(
      "DependencyLock",
      "Dependency Lock",
      "Dependency direction Certification → Platform → … → Foundation is frozen.",
      "Phase dependency chain",
      16,
    ),
    lock(
      "ReleaseLock",
      "Release Lock",
      "Freeze release baseline is permanent until a major-version successor.",
      "NEA-6:8 Freeze release",
      17,
    ),
  ]);

export const MessageNormalizationFreezeLockedLockCount =
  MessageNormalizationFreezeLocks.filter(
    (item) => item.status === "Locked",
  ).length;

export const MessageNormalizationFreezeAllLocksActive =
  MessageNormalizationFreezeLockedLockCount ===
  MessageNormalizationFreezeLocks.length;

/** Canonical immutable freeze lock catalog. */
export const MessageNormalizationFreezeLockCatalog = Object.freeze({
  catalogId: "NEA-6:8/FreezeLockCatalog",
  sourcePhase: "NEA-6:8" as const,
  certificationId: MessageNormalizationCertificationId,
  locks: MessageNormalizationFreezeLocks,
  lockCount: MessageNormalizationFreezeLocks.length,
  lockedLockCount: MessageNormalizationFreezeLockedLockCount,
  allLocksActive: MessageNormalizationFreezeAllLocksActive,
  executesRuntime: false as const,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});

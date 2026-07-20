/**
 * NEA-3:8 — Session & Conversation Freeze Locks.
 *
 * Immutable declarative architectural locks for certified Session & Conversation.
 * Locks describe protection only. No runtime enforcement.
 *
 * Ownership: owned exclusively by NEA-3:8.
 */

import { SessionConversationCertificationId } from "./sessionConversationCertification.ts";
import type {
  SessionConversationFreezeLock,
  SessionConversationFreezeLockId,
} from "./sessionConversationFreezeTypes.ts";

const lock = (
  lockId: SessionConversationFreezeLockId,
  lockName: string,
  description: string,
  protectedSurface: string,
  order: number,
): SessionConversationFreezeLock =>
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
export const SessionConversationFreezeLocks: readonly SessionConversationFreezeLock[] =
  Object.freeze([
    lock(
      "FoundationLock",
      "Foundation Lock",
      "NEA-3:1 Foundation contracts and readiness are permanently frozen.",
      "sessionConversationFoundation.ts",
      1,
    ),
    lock(
      "RegistryLock",
      "Registry Lock",
      "NEA-3:2 Registry collections and public surface are permanently frozen.",
      "sessionConversationRegistry.ts",
      2,
    ),
    lock(
      "ModelLock",
      "Model Lock",
      "NEA-3:3 Domain models and schema descriptors are permanently frozen.",
      "sessionConversationModel.ts",
      3,
    ),
    lock(
      "ValidationLock",
      "Validation Lock",
      "NEA-3:4 Validation rules and ownership boundaries are permanently frozen.",
      "sessionConversationValidation.ts",
      4,
    ),
    lock(
      "ManifestLock",
      "Manifest Lock",
      "NEA-3:5 Manifest inventory and readiness are permanently frozen.",
      "sessionConversationManifest.ts",
      5,
    ),
    lock(
      "PlatformLock",
      "Platform Lock",
      "NEA-3:6 Platform composition and namespace are permanently frozen.",
      "sessionConversationPlatform.ts",
      6,
    ),
    lock(
      "CertificationLock",
      "Certification Lock",
      "NEA-3:7 Certification gates and Pass outcome are permanently frozen.",
      "sessionConversationCertification.ts",
      7,
    ),
    lock(
      "SessionIdentityLock",
      "Session Identity Lock",
      "Session identity registry remains permanently frozen and metadata-only.",
      `${SessionConversationCertificationId}/platform/namespace/registry/collections/sessionIdentities`,
      8,
    ),
    lock(
      "ConversationIdentityLock",
      "Conversation Identity Lock",
      "Conversation identity registry remains permanently frozen and metadata-only.",
      `${SessionConversationCertificationId}/platform/namespace/registry/collections/conversationIdentities`,
      9,
    ),
    lock(
      "NamespaceLock",
      "Namespace Lock",
      "Platform namespace composition order and section count are permanently frozen.",
      `${SessionConversationCertificationId}/platform/namespace`,
      10,
    ),
    lock(
      "PublicSurfaceLock",
      "Public Surface Lock",
      "Eight-export public surfaces across Foundation through Certification are frozen.",
      "NEA-3:1–NEA-3:7 public exports",
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
      "NEA-3:8 Freeze release",
      17,
    ),
  ]);

export const SessionConversationFreezeLockedLockCount =
  SessionConversationFreezeLocks.filter((item) => item.status === "Locked")
    .length;

export const SessionConversationFreezeAllLocksActive =
  SessionConversationFreezeLockedLockCount ===
  SessionConversationFreezeLocks.length;

/** Canonical immutable freeze lock catalog. */
export const SessionConversationFreezeLockCatalog = Object.freeze({
  catalogId: "NEA-3:8/FreezeLockCatalog",
  sourcePhase: "NEA-3:8" as const,
  certificationId: SessionConversationCertificationId,
  locks: SessionConversationFreezeLocks,
  lockCount: SessionConversationFreezeLocks.length,
  lockedLockCount: SessionConversationFreezeLockedLockCount,
  allLocksActive: SessionConversationFreezeAllLocksActive,
  executesRuntime: false as const,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});

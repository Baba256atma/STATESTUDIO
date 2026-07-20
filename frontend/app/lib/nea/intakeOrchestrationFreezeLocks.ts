/**
 * NEA-7:8 — Intake Orchestration Freeze Locks.
 *
 * Immutable declarative architectural locks for certified Intake Orchestration.
 * Locks describe protection only. No runtime enforcement.
 *
 * Ownership: owned exclusively by NEA-7:8.
 */

import { IntakeOrchestrationCertificationId } from "./intakeOrchestrationCertification.ts";
import type {
  IntakeOrchestrationFreezeLock,
  IntakeOrchestrationFreezeLockId,
} from "./intakeOrchestrationFreezeTypes.ts";

const lock = (
  lockId: IntakeOrchestrationFreezeLockId,
  lockName: string,
  description: string,
  protectedSurface: string,
  order: number,
): IntakeOrchestrationFreezeLock =>
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
export const IntakeOrchestrationFreezeLocks: readonly IntakeOrchestrationFreezeLock[] =
  Object.freeze([
    lock(
      "FoundationLock",
      "Foundation Lock",
      "NEA-7:1 Foundation contracts and readiness are permanently frozen.",
      "intakeOrchestrationFoundation.ts",
      1,
    ),
    lock(
      "RegistryLock",
      "Registry Lock",
      "NEA-7:2 Registry collections and public surface are permanently frozen.",
      "intakeOrchestrationRegistry.ts",
      2,
    ),
    lock(
      "ModelLock",
      "Model Lock",
      "NEA-7:3 Domain models and schema descriptors are permanently frozen.",
      "intakeOrchestrationModel.ts",
      3,
    ),
    lock(
      "ValidationLock",
      "Validation Lock",
      "NEA-7:4 Validation rules and ownership boundaries are permanently frozen.",
      "intakeOrchestrationValidation.ts",
      4,
    ),
    lock(
      "ManifestLock",
      "Manifest Lock",
      "NEA-7:5 Manifest inventory and readiness are permanently frozen.",
      "intakeOrchestrationManifest.ts",
      5,
    ),
    lock(
      "PlatformLock",
      "Platform Lock",
      "NEA-7:6 Platform composition and namespace are permanently frozen.",
      "intakeOrchestrationPlatform.ts",
      6,
    ),
    lock(
      "CertificationLock",
      "Certification Lock",
      "NEA-7:7 Certification gates and Pass outcome are permanently frozen.",
      "intakeOrchestrationCertification.ts",
      7,
    ),
    lock(
      "ExecutiveIntakePackageLock",
      "Executive Intake Package Lock",
      "Canonical Executive Intake Package contract remains permanently frozen and metadata-only.",
      `${IntakeOrchestrationCertificationId}/platform/namespace/foundation/contracts/executiveIntakePackage`,
      8,
    ),
    lock(
      "IntakeIdentityRegistryLock",
      "Intake Identity Registry Lock",
      "Intake identity registry remains permanently frozen and metadata-only.",
      `${IntakeOrchestrationCertificationId}/platform/namespace/registry/collections/intakeIdentities`,
      9,
    ),
    lock(
      "ReferenceRegistryLock",
      "Reference Registry Lock",
      "Reference type registry remains permanently frozen and metadata-only.",
      `${IntakeOrchestrationCertificationId}/platform/namespace/registry/collections/referenceTypes`,
      10,
    ),
    lock(
      "NamespaceLock",
      "Namespace Lock",
      "Platform namespace composition order and section count are permanently frozen.",
      `${IntakeOrchestrationCertificationId}/platform/namespace`,
      11,
    ),
    lock(
      "PublicSurfaceLock",
      "Public Surface Lock",
      "Eight-export public surfaces across Foundation through Certification are frozen.",
      "NEA-7:1–NEA-7:7 public exports",
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
      "NEA-7:8 Freeze release",
      17,
    ),
  ]);

export const IntakeOrchestrationFreezeLockedLockCount =
  IntakeOrchestrationFreezeLocks.filter(
    (item) => item.status === "Locked",
  ).length;

export const IntakeOrchestrationFreezeAllLocksActive =
  IntakeOrchestrationFreezeLockedLockCount ===
  IntakeOrchestrationFreezeLocks.length;

/** Canonical immutable freeze lock catalog. */
export const IntakeOrchestrationFreezeLockCatalog = Object.freeze({
  catalogId: "NEA-7:8/FreezeLockCatalog",
  sourcePhase: "NEA-7:8" as const,
  certificationId: IntakeOrchestrationCertificationId,
  locks: IntakeOrchestrationFreezeLocks,
  lockCount: IntakeOrchestrationFreezeLocks.length,
  lockedLockCount: IntakeOrchestrationFreezeLockedLockCount,
  allLocksActive: IntakeOrchestrationFreezeAllLocksActive,
  executesRuntime: false as const,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});

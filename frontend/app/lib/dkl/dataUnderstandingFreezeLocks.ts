/**
 * DKL-3:8 — Data Understanding Freeze Locks.
 *
 * Immutable freeze lock declarations. Metadata only — locks describe
 * protection; they do not enforce it at runtime.
 *
 * Ownership: owned exclusively by DKL-3:8.
 */

import type { FreezeLock } from "./dataUnderstandingFreezeTypes.ts";

const lock = (
  lockId: string,
  lockName: string,
  description: string,
  protectedSurface: string,
  sourcePhase: string,
  readinessImpact: string,
): FreezeLock =>
  Object.freeze({
    lockId,
    lockName,
    description,
    protectedSurface,
    sourcePhase,
    protectionLevel: "Permanent" as const,
    status: "Locked" as const,
    readinessImpact,
  });

const LOCKS: readonly FreezeLock[] = Object.freeze([
  lock(
    "LOCK-FOUNDATION",
    "FoundationLock",
    "DKL-3:1 Foundation public APIs and readiness are permanently frozen.",
    "dataUnderstandingFoundation.ts",
    "DKL-3:1",
    "Blocks Public Index if Foundation identity drifts.",
  ),
  lock(
    "LOCK-REGISTRY",
    "RegistryLock",
    "DKL-3:2 Registry inventories and public APIs are permanently frozen.",
    "dataUnderstandingRegistry.ts",
    "DKL-3:2",
    "Blocks Public Index if Registry inventories drift.",
  ),
  lock(
    "LOCK-MODEL",
    "ModelLock",
    "DKL-3:3 Model kinds and schema descriptors are permanently frozen.",
    "dataUnderstandingModel.ts",
    "DKL-3:3",
    "Blocks Public Index if Model descriptors drift.",
  ),
  lock(
    "LOCK-VALIDATION",
    "ValidationLock",
    "DKL-3:4 Validation rules and ownership boundaries are permanently frozen.",
    "dataUnderstandingValidation.ts",
    "DKL-3:4",
    "Blocks Public Index if Validation rule catalog drifts.",
  ),
  lock(
    "LOCK-MANIFEST",
    "ManifestLock",
    "DKL-3:5 Manifest inventories and readiness are permanently frozen.",
    "dataUnderstandingManifest.ts",
    "DKL-3:5",
    "Blocks Public Index if Manifest inventories drift.",
  ),
  lock(
    "LOCK-PLATFORM",
    "PlatformLock",
    "DKL-3:6 Platform namespace sections and public APIs are permanently frozen.",
    "dataUnderstandingPlatform.ts",
    "DKL-3:6",
    "Blocks Public Index if Platform namespace drifts.",
  ),
  lock(
    "LOCK-CERTIFICATION",
    "CertificationLock",
    "DKL-3:7 Certification gates and ReadyForFreeze status are permanently frozen.",
    "dataUnderstandingCertification.ts",
    "DKL-3:7",
    "Blocks Public Index if Certification gates drift.",
  ),
  lock(
    "LOCK-DEPENDENCY",
    "DependencyLock",
    "Approved dependencies limited to Pipeline, DKL-2, and DKL-3:1–7 public APIs.",
    "DataUnderstandingPlatformDependencies / Certification dependencies",
    "DKL-3:6",
    "Blocks Public Index if forbidden dependencies appear.",
  ),
  lock(
    "LOCK-COMPATIBILITY",
    "CompatibilityLock",
    "Compatibility declarations forbid BO/KG and restrict DKL-4 to reference-only.",
    "Platform and Certification compatibility",
    "DKL-3:7",
    "Blocks Public Index if compatibility claims expand into DKL-4 execution.",
  ),
  lock(
    "LOCK-OWNERSHIP",
    "OwnershipLock",
    "Ownership owns/doesNotOwn declarations remain complete and non-overlapping.",
    "DataUnderstandingOwnership",
    "DKL-3:1",
    "Blocks Public Index if ownership boundaries collapse.",
  ),
  lock(
    "LOCK-BOUNDARY",
    "BoundaryLock",
    "Boundaries forbid BO, Knowledge Graph, persistence, AI, Engine, and UI.",
    "DataUnderstandingBoundaries",
    "DKL-3:1",
    "Blocks Public Index if forbidden processing is claimed.",
  ),
  lock(
    "LOCK-PUBLIC-API",
    "PublicApiLock",
    "Seven certified phases publish exactly fifty-six public APIs (7×8).",
    "DKL-3:1 through DKL-3:7 public exports",
    "DKL-3:7",
    "Blocks Public Index if public API surfaces drift.",
  ),
  lock(
    "LOCK-EXTENSION",
    "ExtensionLock",
    "Additive extensions require a future major migration after Public Index.",
    "DKL-3 extension surface",
    "DKL-3:8",
    "Blocks silent extension of frozen architecture.",
  ),
  lock(
    "LOCK-VERSION",
    "VersionLock",
    "Platform and phase versions remain 1.0.0 for the frozen release.",
    "DKL-3 version identifiers",
    "DKL-3:8",
    "Blocks Public Index if version identifiers drift.",
  ),
  lock(
    "LOCK-RELEASE",
    "ReleaseLock",
    "Release metadata declares Frozen, Stable, and ReadyForPublicIndex.",
    "DKL-3:8 freeze identity and summary",
    "DKL-3:8",
    "Blocks Public Index if release metadata is incomplete.",
  ),
  lock(
    "LOCK-READY-FOR-PUBLIC-INDEX",
    "ReadyForPublicIndex",
    "Certified ReadyForFreeze implies ReadyForPublicIndex after freeze.",
    "DKL-3:7 Certification / DKL-3:8 Freeze",
    "DKL-3:8",
    "Blocks Public Index until ReadyForPublicIndex is declared.",
  ),
]);

/** Canonical immutable freeze locks. */
export const DataUnderstandingFreezeLocks = Object.freeze({
  locksId: "DKL-3:8/FreezeLocks",
  sourcePhase: "DKL-3:8",
  locks: LOCKS,
  lockCount: LOCKS.length,
  lockedLockCount: LOCKS.length,
  allLocked: true,
  metadataOnly: true,
  freezeOnly: true,
  immutable: true,
  deterministic: true,
});

/**
 * RTC-1:8 — Executive Context Freeze Lock.
 *
 * Canonical Runtime lock and twelve architectural locks.
 * Lock identities remain stable across the release.
 *
 * Ownership: owned exclusively by RTC-1:8.
 */

import { ExecutiveContextRuntimeCertification } from "./executiveContextRuntimeCertification.ts";

/** Canonical immutable Runtime lock identifier. */
export const EXECUTIVE_CONTEXT_RUNTIME_LOCK =
  "RTC-1-EXECUTIVE-CONTEXT-RUNTIME-LOCKED" as const;

/** Architectural lock name. */
export type ExecutiveContextArchitecturalLockName =
  | "FoundationLocked"
  | "RegistryLocked"
  | "ModelLocked"
  | "ValidationLocked"
  | "ManifestLocked"
  | "PlatformLocked"
  | "CertificationLocked"
  | "RuntimeIdentityLocked"
  | "PublicContractsLocked"
  | "CompatibilityLocked"
  | "MetadataLocked"
  | "ReleaseLocked";

/** Architectural lock declaration. */
export interface ExecutiveContextArchitecturalLock {
  readonly lockId: string;
  readonly lockName: ExecutiveContextArchitecturalLockName;
  readonly displayName: string;
  readonly order: number;
  readonly lockStatus: "Locked";
  readonly mutationAllowed: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}

const architecturalLock = (
  lockName: ExecutiveContextArchitecturalLockName,
  displayName: string,
  order: number,
): ExecutiveContextArchitecturalLock =>
  Object.freeze({
    lockId: `RTC-1:8/ArchitecturalLock/${String(order).padStart(2, "0")}`,
    lockName,
    displayName,
    order,
    lockStatus: "Locked" as const,
    mutationAllowed: false as const,
    metadataOnly: true as const,
    immutable: true as const,
  });

/** Exactly twelve architectural locks. */
export const ExecutiveContextArchitecturalLocks = Object.freeze([
  architecturalLock("FoundationLocked", "Foundation Locked", 1),
  architecturalLock("RegistryLocked", "Registry Locked", 2),
  architecturalLock("ModelLocked", "Model Locked", 3),
  architecturalLock("ValidationLocked", "Validation Locked", 4),
  architecturalLock("ManifestLocked", "Manifest Locked", 5),
  architecturalLock("PlatformLocked", "Platform Locked", 6),
  architecturalLock("CertificationLocked", "Certification Locked", 7),
  architecturalLock("RuntimeIdentityLocked", "Runtime Identity Locked", 8),
  architecturalLock("PublicContractsLocked", "Public Contracts Locked", 9),
  architecturalLock("CompatibilityLocked", "Compatibility Locked", 10),
  architecturalLock("MetadataLocked", "Metadata Locked", 11),
  architecturalLock("ReleaseLocked", "Release Locked", 12),
] as const);

export const ExecutiveContextArchitecturalLockNames = Object.freeze([
  "FoundationLocked",
  "RegistryLocked",
  "ModelLocked",
  "ValidationLocked",
  "ManifestLocked",
  "PlatformLocked",
  "CertificationLocked",
  "RuntimeIdentityLocked",
  "PublicContractsLocked",
  "CompatibilityLocked",
  "MetadataLocked",
  "ReleaseLocked",
] as const satisfies readonly ExecutiveContextArchitecturalLockName[]);

/**
 * Canonical Runtime lock artifact.
 * Uniquely represents the frozen release.
 */
export const ExecutiveContextFreezeLock = Object.freeze({
  lockIdentifier: EXECUTIVE_CONTEXT_RUNTIME_LOCK,
  name: "Executive Context Runtime Architecture Lock",
  description:
    "Permanent immutable lock for the certified Executive Context Runtime release.",
  sourceCertification: ExecutiveContextRuntimeCertification.identity.id,
  status: "Locked" as const,
  frozen: true as const,
  mutationAllowed: false as const,
  permanent: true as const,
  oneLockPerRelease: true as const,
  architecturalLocks: ExecutiveContextArchitecturalLocks,
  architecturalLockCount: ExecutiveContextArchitecturalLocks.length,
  version: "1.0.0" as const,
  metadataOnly: true as const,
  immutable: true as const,
} as const);

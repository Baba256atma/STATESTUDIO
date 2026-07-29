/**
 * EX-1:8 — Executive Stage Architectural Locks.
 *
 * Canonical Stage lock and twelve architectural locks.
 * Lock identities remain stable across the release.
 *
 * Ownership: owned exclusively by EX-1:8.
 */

import { ExecutiveStageCertification } from "./executiveStageCertification.ts";

/** Canonical immutable Stage lock identifier. */
export const EXECUTIVE_STAGE_LOCK = "EX-1-EXECUTIVE-STAGE-LOCKED" as const;

/** Architectural lock name. */
export type ExecutiveStageArchitecturalLockName =
  | "Identity Lock"
  | "Architecture Lock"
  | "Registry Lock"
  | "Model Lock"
  | "Validation Lock"
  | "Manifest Lock"
  | "Platform Lock"
  | "Certification Lock"
  | "Runtime Compatibility Lock"
  | "Public API Lock"
  | "Dependency Lock"
  | "Release Lock";

/** Architectural lock declaration. */
export interface ExecutiveStageArchitecturalLock {
  readonly lockId: string;
  readonly lockName: ExecutiveStageArchitecturalLockName;
  readonly order: number;
  readonly lockStatus: "Locked";
  readonly mutationAllowed: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}

const architecturalLock = (
  lockName: ExecutiveStageArchitecturalLockName,
  order: number,
): ExecutiveStageArchitecturalLock =>
  Object.freeze({
    lockId: `EX-1:8/ArchitecturalLock/${String(order).padStart(2, "0")}`,
    lockName,
    order,
    lockStatus: "Locked" as const,
    mutationAllowed: false as const,
    metadataOnly: true as const,
    immutable: true as const,
  });

/** Exactly twelve architectural locks. */
export const ExecutiveStageArchitecturalLocks = Object.freeze([
  architecturalLock("Identity Lock", 1),
  architecturalLock("Architecture Lock", 2),
  architecturalLock("Registry Lock", 3),
  architecturalLock("Model Lock", 4),
  architecturalLock("Validation Lock", 5),
  architecturalLock("Manifest Lock", 6),
  architecturalLock("Platform Lock", 7),
  architecturalLock("Certification Lock", 8),
  architecturalLock("Runtime Compatibility Lock", 9),
  architecturalLock("Public API Lock", 10),
  architecturalLock("Dependency Lock", 11),
  architecturalLock("Release Lock", 12),
] as const);

export const ExecutiveStageArchitecturalLockNames = Object.freeze([
  "Identity Lock",
  "Architecture Lock",
  "Registry Lock",
  "Model Lock",
  "Validation Lock",
  "Manifest Lock",
  "Platform Lock",
  "Certification Lock",
  "Runtime Compatibility Lock",
  "Public API Lock",
  "Dependency Lock",
  "Release Lock",
] as const satisfies readonly ExecutiveStageArchitecturalLockName[]);

/**
 * Canonical Stage lock artifact.
 * Uniquely represents the frozen release.
 */
export const ExecutiveStageFreezeLock = Object.freeze({
  lockIdentifier: EXECUTIVE_STAGE_LOCK,
  name: "Executive Stage Architecture Lock",
  description:
    "Permanent immutable lock for the certified Executive Stage release.",
  sourceCertification: ExecutiveStageCertification.identity.id,
  requiresCertifiedStatus: true as const,
  certificationFreezeProgressionStatus:
    ExecutiveStageCertification.freezeProgressionStatus,
  status: "Locked" as const,
  oneLockPerRelease: true as const,
  mutationAllowed: false as const,
  architecturalLocks: ExecutiveStageArchitecturalLocks,
  architecturalLockCount: ExecutiveStageArchitecturalLocks.length,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
} as const);

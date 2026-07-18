/**
 * DKL-1:8 — Data Knowledge Foundation Freeze.
 *
 * Metadata-only type definitions and deterministic helpers for the DKL
 * Foundation freeze platform. Everything is derived from the official public
 * APIs of DKL-1:1 through DKL-1:7. No I/O, no reflection, no side effects, no
 * source or Git inspection.
 */

export type FreezeStatus = "FROZEN";

export type FreezeStability = "STABLE";

export type FreezeReadiness = "ReadyForPublicIndex";

export type FreezeProtectionLevel = "STRICT" | "PERMANENT";

export type FreezeLockStatus = "LOCKED";

export type FreezeSourcePhase =
  | "DKL-1:1"
  | "DKL-1:2"
  | "DKL-1:3"
  | "DKL-1:4"
  | "DKL-1:5"
  | "DKL-1:6"
  | "DKL-1:7";

export interface FreezeLockDescriptor {
  readonly id: string;
  readonly name: string;
  readonly target: string;
  readonly protectionLevel: FreezeProtectionLevel;
  readonly status: FreezeLockStatus;
  readonly reason: string;
  readonly sourcePhase: FreezeSourcePhase;
}

export interface FreezeLockInput {
  readonly id: string;
  readonly name: string;
  readonly target: string;
  readonly protectionLevel: FreezeProtectionLevel;
  readonly reason: string;
  readonly sourcePhase: FreezeSourcePhase;
}

export interface FreezePublicApiInventory {
  readonly foundation: number;
  readonly registry: number;
  readonly model: number;
  readonly validation: number;
  readonly manifest: number;
  readonly platform: number;
  readonly certification: number;
  readonly total: number;
}

export interface FreezeRegistryDescriptor {
  readonly frozenPhases: readonly FreezeSourcePhase[];
  readonly frozenPhaseCount: number;
  readonly frozenPublicApis: FreezePublicApiInventory;
  readonly frozenPublicApiCount: number;
  readonly frozenModelCount: number;
  readonly frozenRegistryComponentCount: number;
  readonly frozenValidationRuleCount: number;
  readonly frozenManifestPhaseCount: number;
  readonly frozenPlatformSectionCount: number;
  readonly frozenCertificationGateCount: number;
  readonly frozenInventory: Readonly<Record<string, unknown>>;
  readonly frozenBaselines: Readonly<Record<string, number>>;
  readonly metadataOnly: true;
  readonly immutable: true;
}

export interface FreezeCompatibilityGuarantees {
  readonly metadataOnly: true;
  readonly runtimeFree: true;
  readonly deepFrozen: true;
  readonly deterministic: true;
  readonly publicApiStable: true;
  readonly ownershipProtected: true;
  readonly dependencyProtected: true;
  readonly canonicalReferencesPreserved: true;
  readonly regressionProtected: true;
  readonly readyForPublicIndex: true;
}

export interface FreezeCompatibilityDescriptor {
  readonly compatibilityId: "DKL-1:8-COMPAT";
  readonly certifiedPhases: readonly FreezeSourcePhase[];
  readonly foundationCompatible: true;
  readonly registryCompatible: true;
  readonly modelCompatible: true;
  readonly validationCompatible: true;
  readonly manifestCompatible: true;
  readonly platformCompatible: true;
  readonly certificationCompatible: true;
  readonly guarantees: FreezeCompatibilityGuarantees;
  readonly metadataOnly: true;
  readonly immutable: true;
}

export interface FreezeManifestDescriptor {
  readonly freezeId: "DKL-1:8";
  readonly name: "Data Knowledge Foundation Freeze";
  readonly namespace: "nexora.dkl.foundation.freeze";
  readonly version: "1.0.0";
  readonly frozenPhases: number;
  readonly frozenApiCount: number;
  readonly frozenModelCount: number;
  readonly frozenRegistryCount: number;
  readonly frozenValidationCount: number;
  readonly frozenPlatformCount: number;
  readonly frozenCertificationCount: number;
  readonly compatibility: FreezeCompatibilityDescriptor;
  readonly locks: readonly FreezeLockDescriptor[];
  readonly freezeStatus: FreezeStatus;
  readonly stability: FreezeStability;
  readonly readiness: FreezeReadiness;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministic: true;
}

export interface FreezeSummaryDescriptor {
  readonly freezeId: "DKL-1:8";
  readonly frozenPhases: number;
  readonly frozenApis: number;
  readonly lockCount: number;
  readonly compatibilityCount: number;
  readonly freezeStatus: FreezeStatus;
  readonly readiness: FreezeReadiness;
  readonly stability: FreezeStability;
  readonly metadataOnly: true;
  readonly immutable: true;
}

export interface DataKnowledgeFoundationFreezeDescriptor {
  readonly registry: FreezeRegistryDescriptor;
  readonly compatibility: FreezeCompatibilityDescriptor;
  readonly locks: readonly FreezeLockDescriptor[];
  readonly manifest: FreezeManifestDescriptor;
  readonly summary: FreezeSummaryDescriptor;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministic: true;
}

/**
 * Build a frozen, deterministic freeze lock from static metadata. Every lock is
 * LOCKED by construction.
 */
export const createFreezeLock = (input: FreezeLockInput): FreezeLockDescriptor =>
  Object.freeze({
    id: input.id,
    name: input.name,
    target: input.target,
    protectionLevel: input.protectionLevel,
    status: "LOCKED" as const,
    reason: input.reason,
    sourcePhase: input.sourcePhase,
  });

/**
 * Deterministic deep-frozen predicate over plain metadata structures.
 * Reads only enumerable own values; performs no reflection over source code.
 */
export const isDeeplyFrozen = (value: unknown): boolean => {
  if (value === null || typeof value !== "object") {
    return true;
  }
  if (!Object.isFrozen(value)) {
    return false;
  }
  for (const nested of Object.values(value as Record<string, unknown>)) {
    if (!isDeeplyFrozen(nested)) {
      return false;
    }
  }
  return true;
};

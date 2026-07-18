/**
 * DKL-2:8 — Freeze Extension Locks and Guarantees.
 *
 * Eight immutable extension locks that protect the frozen DKL-2 surfaces, and
 * twelve immutable freeze guarantees backed by DKL-2:7 certification evidence.
 * Every lock is Locked with explicit, limited exceptions; every guarantee is
 * Guaranteed.
 *
 * Ownership: owned exclusively by DKL-2:8.
 * Dependency rules: depends only on the DKL-2:8 freeze types. Guarantee evidence
 * ids reference the canonical DKL-2:7 certification evidence inventory.
 */

import {
  CANONICAL_COMPLETE_PLATFORM_EXPORT,
  type ExtensionLock,
  type FreezeGuarantee,
  type FreezeGuaranteesContainer,
  type FreezeLocksContainer,
} from "./dataSourceKnowledgeFreezeTypes.ts";

const ADDITIVE_EXCEPTION = "Additive, identifier-preserving extensions are permitted.";
const MIGRATION_EXCEPTION = "Changes require a future versioned major migration.";

const lockEntries: readonly ExtensionLock[] = Object.freeze([
  Object.freeze<ExtensionLock>({
    lockId: "IdentityLock",
    name: "Identity Lock",
    description: "Canonical platform, phase, and namespace identities are frozen.",
    protectedSurface: "DKL-2 canonical identities",
    policy: "Existing identities must not change.",
    status: "Locked",
    exceptions: Object.freeze([MIGRATION_EXCEPTION]),
  }),
  Object.freeze<ExtensionLock>({
    lockId: "RegistryIdentifierLock",
    name: "Registry Identifier Lock",
    description: "Existing registry entry identifiers are frozen and cannot be renamed.",
    protectedSurface: "dataSourceKnowledgeRegistryPlatform.ts registry identifiers",
    policy: "Existing registry identifiers must not change or be repurposed.",
    status: "Locked",
    exceptions: Object.freeze([ADDITIVE_EXCEPTION, MIGRATION_EXCEPTION]),
  }),
  Object.freeze<ExtensionLock>({
    lockId: "ModelIdentifierLock",
    name: "Model Identifier Lock",
    description: "Existing model identifiers are frozen and cannot be renamed.",
    protectedSurface: "dataSourceRegistryModelPlatform.ts model identifiers",
    policy: "Existing model identifiers must not change or be repurposed.",
    status: "Locked",
    exceptions: Object.freeze([ADDITIVE_EXCEPTION, MIGRATION_EXCEPTION]),
  }),
  Object.freeze<ExtensionLock>({
    lockId: "ValidationRuleLock",
    name: "Validation Rule Lock",
    description: "The forty certified validation rules and their identifiers are frozen.",
    protectedSurface: "dataSourceKnowledgeValidationRunner.ts validation rules",
    policy: "Existing validation rule identifiers and semantics must not change.",
    status: "Locked",
    exceptions: Object.freeze([ADDITIVE_EXCEPTION, MIGRATION_EXCEPTION]),
  }),
  Object.freeze<ExtensionLock>({
    lockId: "OwnershipBoundaryLock",
    name: "Ownership Boundary Lock",
    description: "Per-phase ownership boundaries are frozen and protected.",
    protectedSurface: "DKL-2 ownership boundaries",
    policy: "Ownership must not silently move between phases.",
    status: "Locked",
    exceptions: Object.freeze([MIGRATION_EXCEPTION]),
  }),
  Object.freeze<ExtensionLock>({
    lockId: "DependencyBoundaryLock",
    name: "Dependency Boundary Lock",
    description: "The forward-only, cycle-free, public-API-only dependency graph is frozen.",
    protectedSurface: "DKL-2 dependency graph",
    policy: "New dependencies require explicit later certification.",
    status: "Locked",
    exceptions: Object.freeze([
      "New dependencies are permitted only with explicit later certification.",
    ]),
  }),
  Object.freeze<ExtensionLock>({
    lockId: "PublicApiRemovalLock",
    name: "Public API Removal Lock",
    description: "The frozen runtime public export surface (52 exports) cannot be reduced.",
    protectedSurface: "DKL-2:1..2:7 runtime public exports",
    policy: "Existing public exports must not be removed.",
    status: "Locked",
    exceptions: Object.freeze([ADDITIVE_EXCEPTION, MIGRATION_EXCEPTION]),
  }),
  Object.freeze<ExtensionLock>({
    lockId: "PublicIndexNamingLock",
    name: "Public Index Naming Lock",
    description:
      `The DKL-2:9 Public Index must expose exactly one canonical complete-platform object named ` +
      `${CANONICAL_COMPLETE_PLATFORM_EXPORT}; the DKL-2:2 registry root must be exposed only via a ` +
      `clearly named section or alias.`,
    protectedSurface: "DKL-2:9 public-index naming strategy",
    policy: "One canonical complete-platform name; no indistinguishable duplicate export.",
    status: "Locked",
    exceptions: Object.freeze([
      "The exact registry section property name may be selected in DKL-2:9 if unambiguous.",
    ]),
  }),
]);

const guaranteeEntries: readonly FreezeGuarantee[] = Object.freeze([
  Object.freeze<FreezeGuarantee>({
    guaranteeId: "CertifiedBeforeFreeze",
    name: "Certified Before Freeze",
    description: "The complete DKL-2 platform was certified before this freeze.",
    evidenceIds: Object.freeze(["EV-2-6-PLATFORM", "EV-2-4-VALIDATION"]),
    status: "Guaranteed",
  }),
  Object.freeze<FreezeGuarantee>({
    guaranteeId: "MetadataOnly",
    name: "Metadata Only",
    description: "The frozen architecture is metadata-only.",
    evidenceIds: Object.freeze(["EV-METADATA-ONLY"]),
    status: "Guaranteed",
  }),
  Object.freeze<FreezeGuarantee>({
    guaranteeId: "RuntimeFree",
    name: "Runtime Free",
    description: "The frozen architecture contains no runtime behavior.",
    evidenceIds: Object.freeze(["EV-METADATA-ONLY"]),
    status: "Guaranteed",
  }),
  Object.freeze<FreezeGuarantee>({
    guaranteeId: "Deterministic",
    name: "Deterministic",
    description: "All frozen surfaces are deterministic and stable across access.",
    evidenceIds: Object.freeze(["EV-METADATA-ONLY"]),
    status: "Guaranteed",
  }),
  Object.freeze<FreezeGuarantee>({
    guaranteeId: "DeeplyImmutable",
    name: "Deeply Immutable",
    description: "All frozen public objects are deeply frozen.",
    evidenceIds: Object.freeze(["EV-DEEP-IMMUTABILITY"]),
    status: "Guaranteed",
  }),
  Object.freeze<FreezeGuarantee>({
    guaranteeId: "StableIdentifiers",
    name: "Stable Identifiers",
    description: "All canonical identifiers are stable and frozen.",
    evidenceIds: Object.freeze(["EV-REGISTRY-ENTRIES"]),
    status: "Guaranteed",
  }),
  Object.freeze<FreezeGuarantee>({
    guaranteeId: "ProtectedOwnership",
    name: "Protected Ownership",
    description: "Per-phase ownership boundaries remain protected.",
    evidenceIds: Object.freeze(["EV-METADATA-ONLY"]),
    status: "Guaranteed",
  }),
  Object.freeze<FreezeGuarantee>({
    guaranteeId: "PublicApiStability",
    name: "Public API Stability",
    description: "The frozen runtime public export surface is stable.",
    evidenceIds: Object.freeze(["EV-PRIOR-EXPORTS", "EV-2-6-EXPORTS"]),
    status: "Guaranteed",
  }),
  Object.freeze<FreezeGuarantee>({
    guaranteeId: "ForwardOnlyDependencies",
    name: "Forward Only Dependencies",
    description: "The DKL-2 dependency graph is forward-only.",
    evidenceIds: Object.freeze(["EV-FORWARD-ONLY"]),
    status: "Guaranteed",
  }),
  Object.freeze<FreezeGuarantee>({
    guaranteeId: "CycleFreeArchitecture",
    name: "Cycle Free Architecture",
    description: "The DKL-2 dependency graph is acyclic.",
    evidenceIds: Object.freeze(["EV-CYCLE-FREE"]),
    status: "Guaranteed",
  }),
  Object.freeze<FreezeGuarantee>({
    guaranteeId: "PublicSurfaceControlled",
    name: "Public Surface Controlled",
    description: "The DKL-2:2 / DKL-2:6 public-surface ambiguity is controlled.",
    evidenceIds: Object.freeze(["EV-PUBLIC-SURFACE-AMBIGUITY"]),
    status: "Guaranteed",
  }),
  Object.freeze<FreezeGuarantee>({
    guaranteeId: "ReadyForPublicIndex",
    name: "Ready For Public Index",
    description: "The frozen platform is ready for the DKL-2:9 Public Index.",
    evidenceIds: Object.freeze(["EV-METADATA-ONLY", "EV-PUBLIC-API-ONLY"]),
    status: "Guaranteed",
  }),
]);

const lockById: ReadonlyMap<string, ExtensionLock> = new Map(
  lockEntries.map((lock) => [lock.lockId, lock]),
);

const guaranteeById: ReadonlyMap<string, FreezeGuarantee> = new Map(
  guaranteeEntries.map((guarantee) => [guarantee.guaranteeId, guarantee]),
);

export const DataSourceKnowledgeFreezeLocks: FreezeLocksContainer =
  Object.freeze<FreezeLocksContainer>({
    kind: "FreezeLocks",
    locks: lockEntries,
    getLockById: (lockId: string): ExtensionLock | undefined => lockById.get(lockId),
    metadataOnly: true,
    immutable: true,
  });

export const DataSourceKnowledgeFreezeGuarantees: FreezeGuaranteesContainer =
  Object.freeze<FreezeGuaranteesContainer>({
    kind: "FreezeGuarantees",
    guarantees: guaranteeEntries,
    getGuaranteeById: (guaranteeId: string): FreezeGuarantee | undefined =>
      guaranteeById.get(guaranteeId),
    metadataOnly: true,
    immutable: true,
  });

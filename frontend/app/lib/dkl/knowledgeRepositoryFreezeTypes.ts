/**
 * DKL-6:8 — Knowledge Repository Freeze Types.
 *
 * Readonly contracts for the canonical Knowledge Repository Freeze.
 * Metadata only. No runtime behavior.
 *
 * Ownership: owned exclusively by DKL-6:8.
 */

export type KnowledgeRepositoryFreezeStatus = "Frozen";
export type KnowledgeRepositoryFreezeCertificationStatus = "Certified";
export type KnowledgeRepositoryFreezeStability = "StableAndFrozen";
export type KnowledgeRepositoryFreezeReadiness =
  | "ReadyForDKL6PublicIndex"
  | "Blocked";
export type KnowledgeRepositoryFreezeLockStatus = "Locked" | "Unlocked";

export type KnowledgeRepositoryFreezeScopeName =
  | "foundation"
  | "registry"
  | "model"
  | "validation"
  | "manifest"
  | "platform"
  | "certification"
  | "freeze";

export type KnowledgeRepositoryFreezeScope = Readonly<{
  id: string;
  name: KnowledgeRepositoryFreezeScopeName;
  sourceIdentity: string;
  sourceVersion: string;
  sourceStatus: string;
  order: number;
  included: true;
  certified: true;
  frozen: true;
  stable: true;
  owner: "DKL-6";
  runtimeBehavior: "None";
}>;

export type KnowledgeRepositoryFrozenComponent = Readonly<{
  id: string;
  name: string;
  sourceIdentity: string;
  sourceVersion: string;
  namespace: string;
  sourceStatus: string;
  certificationStatus: "Certified";
  freezeStatus: "Frozen";
  stability: "Stable";
  owner: "DKL-6";
  runtimeBehavior: "None";
}>;

export type KnowledgeRepositoryFreezeCompatibilityLock = Readonly<{
  id: string;
  name: string;
  compatibilityTarget: string;
  protectedInvariant: string;
  status: "Locked";
  owner: "DKL-6";
  runtimeBehavior: "None";
}>;

export type KnowledgeRepositoryFreezeDependencyLock = Readonly<{
  id: string;
  consumer: string;
  provider: string;
  approvedPublicSurface: string;
  protectedProviderIdentity: string;
  status: "Locked";
  owner: "DKL-6";
  runtimeBehavior: "None";
}>;

export type KnowledgeRepositoryFreezeCoreLock = Readonly<{
  id: string;
  name: string;
  protectedSubject: string;
  protectedInvariant: string;
  evidenceReferences: readonly string[];
  status: "Locked";
  owner: "DKL-6";
  runtimeBehavior: "None";
}>;

export type KnowledgeRepositoryFreezeExtensionLock = Readonly<{
  id: string;
  name: string;
  extensionPolicy: string;
  allowedChangeType: "AdditiveCompatibleExtension";
  prohibitedChangeType: "BreakingChange";
  status: "Locked";
  owner: "DKL-6";
  runtimeBehavior: "None";
}>;

export type KnowledgeRepositoryFreezeBoundaryLock = Readonly<{
  id: string;
  name: string;
  status: "Locked";
  preservationStatus: "CertifiedPreserved";
  owner: "DKL-6";
  runtimeBehavior: "None";
}>;

export type KnowledgeRepositoryFreezeRegressionLock = Readonly<{
  id: string;
  protectedSubject: string;
  expectedInvariant: string;
  evidenceReferences: readonly string[];
  status: "Locked";
  owner: "DKL-6";
  runtimeBehavior: "None";
}>;

export type KnowledgeRepositoryFreezeGuarantee = Readonly<{
  id: string;
  name: string;
  description: string;
  evidenceReferences: readonly string[];
  status: "Guaranteed";
  owner: "DKL-6";
  runtimeBehavior: "None";
}>;

export type KnowledgeRepositoryFreezeGate = Readonly<{
  id: string;
  name: string;
  evidenceReferences: readonly string[];
  status: "Pass";
  owner: "DKL-6";
  runtimeBehavior: "None";
}>;

export type KnowledgeRepositoryFreezePublicApiPhase = Readonly<{
  id: string;
  phase: string;
  sourceIdentity: string;
  publicApiCount: number;
  owner: "DKL-6";
  runtimeBehavior: "None";
}>;

export type KnowledgeRepositoryFreezeResult = Readonly<{
  status: "Frozen";
  certificationStatus: "Certified";
  baseline: "DKL-6-LOCKED";
  stability: "StableAndFrozen";
  totalLocks: number;
  lockedCount: number;
  unlockedCount: number;
  blockingIssueCount: 0;
  readiness: "ReadyForDKL6PublicIndex";
}>;

export interface KnowledgeRepositoryFreezeIdentityDescriptor {
  readonly freezeId: "DKL-6:8/KnowledgeRepositoryFreeze";
  readonly freezeName: "Knowledge Repository Freeze";
  readonly freezeVersion: string;
  readonly freezeNamespace: "nexora.dkl.repository.freeze";
  readonly phase: "DKL-6:8";
  readonly owner: "DKL-6";
  readonly status: "Frozen";
  readonly certificationStatus: "Certified";
  readonly baseline: "DKL-6-LOCKED";
  readonly stability: "StableAndFrozen";
  readonly readiness: "ReadyForDKL6PublicIndex";
  readonly metadataOnly: true;
  readonly immutable: true;
}

export interface KnowledgeRepositoryFreezeSummaryDescriptor {
  readonly freezeId: "DKL-6:8/KnowledgeRepositoryFreeze";
  readonly version: string;
  readonly name: "Knowledge Repository Freeze";
  readonly namespace: "nexora.dkl.repository.freeze";
  readonly status: "Frozen";
  readonly certificationStatus: "Certified";
  readonly baseline: "DKL-6-LOCKED";
  readonly stability: "StableAndFrozen";
  readonly certificationIdentity: string;
  readonly freezeScopeCount: number;
  readonly frozenComponentCount: number;
  readonly compatibilityLockCount: number;
  readonly dependencyLockCount: number;
  readonly coreLockCount: number;
  readonly extensionLockCount: number;
  readonly boundaryLockCount: number;
  readonly regressionLockCount: number;
  readonly guaranteeCount: number;
  readonly gateCount: number;
  readonly passedGateCount: number;
  readonly failedGateCount: number;
  readonly publicApiCount: number;
  readonly lockedCount: number;
  readonly unlockedCount: number;
  readonly blockingIssueCount: number;
  readonly readiness: "ReadyForDKL6PublicIndex";
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministic: true;
}

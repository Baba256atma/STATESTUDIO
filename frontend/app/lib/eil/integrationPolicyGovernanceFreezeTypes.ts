/**
 * EIL-5:8 — Integration Policy & Governance Freeze Types.
 *
 * Readonly contracts and closed vocabularies for Integration Policy & Governance Freeze.
 * Metadata-only. No runtime freeze enforcement.
 *
 * Ownership: owned exclusively by EIL-5:8.
 */

/** Freeze status for EIL-5:8. */
export type PolicyGovernanceFreezeStatus = "Frozen";

/** Immediate downstream readiness — Public Index only. */
export type PolicyGovernanceFreezeReadinessState = "ReadyForPublicIndex";

/** Canonical platform lock key. */
export type PolicyGovernanceFreezePlatformLockKey =
  "EIL-5-INTEGRATION-POLICY-GOVERNANCE-LOCKED";

/** Closed architectural-lock vocabulary. */
export type PolicyGovernanceFreezeArchitecturalLockKey =
  | "Identity"
  | "Namespace"
  | "Version"
  | "Dependency"
  | "Inventory"
  | "Compatibility"
  | "Platform"
  | "Certification"
  | "Metadata"
  | "PublicSurface"
  | "DeterministicOrdering"
  | "Readiness";

/** Closed lock-scope vocabulary. */
export type PolicyGovernanceFreezeLockScope =
  | "Canonical"
  | "Identity"
  | "Namespace"
  | "Version"
  | "Dependency"
  | "Inventory"
  | "Compatibility"
  | "Platform"
  | "Certification"
  | "Metadata"
  | "PublicSurface"
  | "DeterministicOrdering"
  | "Readiness";

/** Closed baseline-phase vocabulary. */
export type PolicyGovernanceFreezeBaselinePhase =
  | "EIL-5:1"
  | "EIL-5:2"
  | "EIL-5:3"
  | "EIL-5:4"
  | "EIL-5:5"
  | "EIL-5:6"
  | "EIL-5:7"
  | "EIL-5:8";

/** Closed compatibility-scope vocabulary. */
export type PolicyGovernanceFreezeCompatibilityScope =
  | "Foundation"
  | "Registry"
  | "Model"
  | "Validation"
  | "Manifest"
  | "Platform"
  | "Certification"
  | "Forward"
  | "Namespace"
  | "Version";

/** Closed extension-policy vocabulary. */
export type PolicyGovernanceFreezeExtensionKey =
  | "PublicIndexExtensionOnly"
  | "NoFrozenMetadataMutation"
  | "AdditiveEvolutionOnly"
  | "BackwardCompatibilityPreservation"
  | "CanonicalIdentityPreservation"
  | "NamespacePreservation"
  | "DependencyPreservation"
  | "InventoryPreservation";

/** Closed ownership vocabulary. */
export type PolicyGovernanceFreezeOwnership =
  | "EIL-5:8"
  | "EIL-5 Integration Policy & Governance Freeze";

/** Closed release-state vocabulary. */
export type PolicyGovernanceFreezeReleaseState = "FrozenBaseline";

/** Canonical freeze identity. */
export interface IntegrationPolicyGovernanceFreezeIdentity {
  readonly phaseId: "EIL-5:8";
  readonly canonicalId: "EIL-5:8/IntegrationPolicyGovernanceFreeze";
  readonly name: "Integration Policy & Governance Freeze";
  readonly version: "1.0.0";
  readonly namespace: "nexora.eil.integration-policy-governance.freeze";
  readonly layer: "EIL";
  readonly platform: "EIL-5";
  readonly phaseType: "Freeze";
  readonly status: PolicyGovernanceFreezeStatus;
  readonly readiness: PolicyGovernanceFreezeReadinessState;
  readonly certificationDependency: "EIL-5:7/IntegrationPolicyGovernanceCertification";
  readonly certificationEntryPoint: "integrationPolicyGovernanceCertification.ts";
  readonly description: string;
  readonly metadataOnly: true;
  readonly immutable: true;
}

/** Freeze lock declaration. */
export interface IntegrationPolicyGovernanceFreezeLock {
  readonly lockId: `EIL-5:8/Lock/${string}`;
  readonly canonicalKey: string;
  readonly lockName: string;
  readonly description: string;
  readonly scope: PolicyGovernanceFreezeLockScope;
  readonly sourceReference: string;
  readonly namespace: "nexora.eil.integration-policy-governance.freeze";
  readonly version: "1.0.0";
  readonly certificationReference: "EIL-5:7/IntegrationPolicyGovernanceCertification";
  readonly platformReference: "EIL-5:6/IntegrationPolicyGovernancePlatform";
  readonly releaseState: PolicyGovernanceFreezeReleaseState;
  readonly ownership: PolicyGovernanceFreezeOwnership;
  readonly ordinal: number;
  readonly tags: readonly string[];
  readonly isCanonicalPlatformLock: boolean;
  readonly runtimeEnforced: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}

/** Freeze baseline declaration. */
export interface IntegrationPolicyGovernanceFreezeBaseline {
  readonly baselineId: `EIL-5:8/Baseline/${PolicyGovernanceFreezeBaselinePhase}`;
  readonly sourcePhase: PolicyGovernanceFreezeBaselinePhase;
  readonly version: "1.0.0";
  readonly namespace: string;
  readonly readiness: string;
  readonly status: string;
  readonly description: string;
  readonly ownership: PolicyGovernanceFreezeOwnership;
  readonly ordinal: number;
  readonly tags: readonly string[];
  readonly metadataOnly: true;
  readonly immutable: true;
}

/** Freeze compatibility declaration. */
export interface IntegrationPolicyGovernanceFreezeCompatibility {
  readonly compatibilityId: `EIL-5:8/Compatibility/${string}`;
  readonly scope: PolicyGovernanceFreezeCompatibilityScope;
  readonly canonicalKey: string;
  readonly canonicalName: string;
  readonly description: string;
  readonly ordinal: number;
  readonly tags: readonly string[];
  readonly runtimeValidated: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}

/** Freeze extension policy declaration. */
export interface IntegrationPolicyGovernanceFreezeExtension {
  readonly extensionId: `EIL-5:8/Extension/${PolicyGovernanceFreezeExtensionKey}`;
  readonly canonicalKey: PolicyGovernanceFreezeExtensionKey;
  readonly canonicalName: string;
  readonly description: string;
  readonly ownership: PolicyGovernanceFreezeOwnership;
  readonly ordinal: number;
  readonly tags: readonly string[];
  readonly runtimeEnforced: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}

/** Freeze inventory. */
export interface IntegrationPolicyGovernanceFreezeInventory {
  readonly inventoryId: "EIL-5:8/Inventory";
  readonly lockCount: number;
  readonly baselineCount: number;
  readonly compatibilityCount: number;
  readonly extensionCount: number;
  readonly canonicalPlatformLockCount: 1;
  readonly totalFreezeEntryCount: number;
  readonly countsDerivedFromCollections: true;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministic: true;
}

/** Freeze collections. */
export interface IntegrationPolicyGovernanceFreezeCollections {
  readonly collectionsId: "EIL-5:8/Collections";
  readonly sourcePhase: "EIL-5:8";
  readonly locks: readonly IntegrationPolicyGovernanceFreezeLock[];
  readonly baselines: readonly IntegrationPolicyGovernanceFreezeBaseline[];
  readonly compatibility: readonly IntegrationPolicyGovernanceFreezeCompatibility[];
  readonly extensions: readonly IntegrationPolicyGovernanceFreezeExtension[];
  readonly lockCount: number;
  readonly baselineCount: number;
  readonly compatibilityCount: number;
  readonly extensionCount: number;
  readonly totalFreezeEntryCount: number;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministic: true;
}

/** Freeze summary. */
export interface IntegrationPolicyGovernanceFreezeSummary {
  readonly freezeId: "EIL-5:8/IntegrationPolicyGovernanceFreeze";
  readonly version: "1.0.0";
  readonly name: "Integration Policy & Governance Freeze";
  readonly namespace: "nexora.eil.integration-policy-governance.freeze";
  readonly status: PolicyGovernanceFreezeStatus;
  readonly readiness: PolicyGovernanceFreezeReadinessState;
  readonly certificationId: "EIL-5:7/IntegrationPolicyGovernanceCertification";
  readonly canonicalPlatformLockKey: PolicyGovernanceFreezePlatformLockKey;
  readonly lockCount: number;
  readonly baselineCount: number;
  readonly compatibilityCount: number;
  readonly extensionCount: number;
  readonly totalFreezeEntryCount: number;
  readonly nextPhase: "EIL-5:9 — Integration Policy & Governance Public Index";
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministic: true;
}

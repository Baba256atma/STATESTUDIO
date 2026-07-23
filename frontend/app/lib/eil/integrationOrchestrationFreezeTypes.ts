/**
 * EIL-4:8 — Integration Orchestration Freeze Types.
 *
 * Readonly contracts and closed vocabularies for Integration Orchestration Freeze.
 * Metadata-only. No runtime freeze enforcement.
 *
 * Ownership: owned exclusively by EIL-4:8.
 */

/** Freeze status for EIL-4:8. */
export type OrchestrationFreezeStatus = "Frozen";

/** Immediate downstream readiness — Public Index only. */
export type OrchestrationFreezeReadinessState = "ReadyForPublicIndex";

/** Canonical platform lock key. */
export type OrchestrationFreezePlatformLockKey =
  "EIL-4-INTEGRATION-ORCHESTRATION-LOCKED";

/** Closed architectural-lock vocabulary. */
export type OrchestrationFreezeArchitecturalLockKey =
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
export type OrchestrationFreezeLockScope =
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
export type OrchestrationFreezeBaselinePhase =
  | "EIL-4:1"
  | "EIL-4:2"
  | "EIL-4:3"
  | "EIL-4:4"
  | "EIL-4:5"
  | "EIL-4:6"
  | "EIL-4:7"
  | "EIL-4:8";

/** Closed compatibility-scope vocabulary. */
export type OrchestrationFreezeCompatibilityScope =
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
export type OrchestrationFreezeExtensionKey =
  | "PublicIndexExtensionOnly"
  | "NoFrozenMetadataMutation"
  | "AdditiveEvolutionOnly"
  | "BackwardCompatibilityPreservation"
  | "CanonicalIdentityPreservation"
  | "NamespacePreservation"
  | "DependencyPreservation"
  | "InventoryPreservation";

/** Closed ownership vocabulary. */
export type OrchestrationFreezeOwnership =
  | "EIL-4:8"
  | "EIL-4 Integration Orchestration Freeze";

/** Closed release-state vocabulary. */
export type OrchestrationFreezeReleaseState = "FrozenBaseline";

/** Canonical freeze identity. */
export interface IntegrationOrchestrationFreezeIdentity {
  readonly phaseId: "EIL-4:8";
  readonly canonicalId: "EIL-4:8/IntegrationOrchestrationFreeze";
  readonly name: "Integration Orchestration Freeze";
  readonly version: "1.0.0";
  readonly namespace: "nexora.eil.integration-orchestration.freeze";
  readonly layer: "EIL";
  readonly platform: "EIL-4";
  readonly phaseType: "Freeze";
  readonly status: OrchestrationFreezeStatus;
  readonly readiness: OrchestrationFreezeReadinessState;
  readonly certificationDependency: "EIL-4:7/IntegrationOrchestrationCertification";
  readonly certificationEntryPoint: "integrationOrchestrationCertification.ts";
  readonly description: string;
  readonly metadataOnly: true;
  readonly immutable: true;
}

/** Freeze lock declaration. */
export interface IntegrationOrchestrationFreezeLock {
  readonly lockId: `EIL-4:8/Lock/${string}`;
  readonly canonicalKey: string;
  readonly lockName: string;
  readonly description: string;
  readonly scope: OrchestrationFreezeLockScope;
  readonly sourceReference: string;
  readonly namespace: "nexora.eil.integration-orchestration.freeze";
  readonly version: "1.0.0";
  readonly certificationReference: "EIL-4:7/IntegrationOrchestrationCertification";
  readonly platformReference: "EIL-4:6/IntegrationOrchestrationPlatform";
  readonly releaseState: OrchestrationFreezeReleaseState;
  readonly ownership: OrchestrationFreezeOwnership;
  readonly ordinal: number;
  readonly tags: readonly string[];
  readonly isCanonicalPlatformLock: boolean;
  readonly runtimeEnforced: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}

/** Freeze baseline declaration. */
export interface IntegrationOrchestrationFreezeBaseline {
  readonly baselineId: `EIL-4:8/Baseline/${OrchestrationFreezeBaselinePhase}`;
  readonly sourcePhase: OrchestrationFreezeBaselinePhase;
  readonly version: "1.0.0";
  readonly namespace: string;
  readonly readiness: string;
  readonly status: string;
  readonly description: string;
  readonly ownership: OrchestrationFreezeOwnership;
  readonly ordinal: number;
  readonly tags: readonly string[];
  readonly metadataOnly: true;
  readonly immutable: true;
}

/** Freeze compatibility declaration. */
export interface IntegrationOrchestrationFreezeCompatibility {
  readonly compatibilityId: `EIL-4:8/Compatibility/${string}`;
  readonly scope: OrchestrationFreezeCompatibilityScope;
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
export interface IntegrationOrchestrationFreezeExtension {
  readonly extensionId: `EIL-4:8/Extension/${OrchestrationFreezeExtensionKey}`;
  readonly canonicalKey: OrchestrationFreezeExtensionKey;
  readonly canonicalName: string;
  readonly description: string;
  readonly ownership: OrchestrationFreezeOwnership;
  readonly ordinal: number;
  readonly tags: readonly string[];
  readonly runtimeEnforced: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}

/** Freeze inventory. */
export interface IntegrationOrchestrationFreezeInventory {
  readonly inventoryId: "EIL-4:8/Inventory";
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
export interface IntegrationOrchestrationFreezeCollections {
  readonly collectionsId: "EIL-4:8/Collections";
  readonly sourcePhase: "EIL-4:8";
  readonly locks: readonly IntegrationOrchestrationFreezeLock[];
  readonly baselines: readonly IntegrationOrchestrationFreezeBaseline[];
  readonly compatibility: readonly IntegrationOrchestrationFreezeCompatibility[];
  readonly extensions: readonly IntegrationOrchestrationFreezeExtension[];
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
export interface IntegrationOrchestrationFreezeSummary {
  readonly freezeId: "EIL-4:8/IntegrationOrchestrationFreeze";
  readonly version: "1.0.0";
  readonly name: "Integration Orchestration Freeze";
  readonly namespace: "nexora.eil.integration-orchestration.freeze";
  readonly status: OrchestrationFreezeStatus;
  readonly readiness: OrchestrationFreezeReadinessState;
  readonly certificationId: "EIL-4:7/IntegrationOrchestrationCertification";
  readonly canonicalPlatformLockKey: OrchestrationFreezePlatformLockKey;
  readonly lockCount: number;
  readonly baselineCount: number;
  readonly compatibilityCount: number;
  readonly extensionCount: number;
  readonly totalFreezeEntryCount: number;
  readonly nextPhase: "EIL-4:9 — Integration Orchestration Public Index";
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministic: true;
}

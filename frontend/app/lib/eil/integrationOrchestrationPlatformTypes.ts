/**
 * EIL-4:6 — Integration Orchestration Platform Types.
 *
 * Readonly contracts and closed vocabularies for the Integration Orchestration Platform.
 * Metadata-only. No runtime behavior.
 *
 * Ownership: owned exclusively by EIL-4:6.
 */

/** Platform status for EIL-4:6. */
export type OrchestrationPlatformStatus = "Platform";

/** Immediate downstream readiness — Certification only. */
export type OrchestrationPlatformReadinessState = "ReadyForCertification";

/** Closed guarantee-key vocabulary. */
export type OrchestrationPlatformGuaranteeKey =
  | "CanonicalComposition"
  | "DeterministicIdentity"
  | "ImmutableMetadata"
  | "InventoryIntegrity"
  | "DependencyIntegrity"
  | "CompatibilityIntegrity"
  | "NamespaceIntegrity"
  | "ArchitecturalCompleteness"
  | "MetadataOnlyArchitecture"
  | "AggregateEntryPointIntegrity"
  | "ReadinessIntegrity"
  | "ReleaseConsistency";

/** Closed compatibility-scope vocabulary. */
export type OrchestrationPlatformCompatibilityScope =
  | "Foundation"
  | "Registry"
  | "Model"
  | "Validation"
  | "Manifest"
  | "Forward"
  | "Version"
  | "Namespace"
  | "Release"
  | "Architecture";

/** Closed ownership vocabulary. */
export type OrchestrationPlatformOwnership =
  | "EIL-4:6"
  | "EIL-4 Integration Orchestration Platform";

/** Canonical platform identity. */
export interface IntegrationOrchestrationPlatformIdentity {
  readonly phaseId: "EIL-4:6";
  readonly canonicalId: "EIL-4:6/IntegrationOrchestrationPlatform";
  readonly name: "Integration Orchestration Platform";
  readonly version: "1.0.0";
  readonly namespace: "nexora.eil.integration-orchestration.platform";
  readonly layer: "EIL";
  readonly platform: "EIL-4";
  readonly phaseType: "Platform";
  readonly status: OrchestrationPlatformStatus;
  readonly readiness: OrchestrationPlatformReadinessState;
  readonly manifestDependency: "EIL-4:5/IntegrationOrchestrationManifest";
  readonly manifestEntryPoint: "integrationOrchestrationManifest.ts";
  readonly description: string;
  readonly metadataOnly: true;
  readonly immutable: true;
}

/** Platform composition descriptor. */
export interface IntegrationOrchestrationPlatformComposition {
  readonly compositionId: "EIL-4:6/Composition";
  readonly platformIdentity: "EIL-4:6/IntegrationOrchestrationPlatform";
  readonly canonicalArchitecture: "EIL-4:5/Architecture";
  readonly foundationReference: string;
  readonly registryReference: string;
  readonly modelReference: string;
  readonly validationReference: string;
  readonly manifestReference: "EIL-4:5/IntegrationOrchestrationManifest";
  readonly ownership: OrchestrationPlatformOwnership;
  readonly namespace: "nexora.eil.integration-orchestration.platform";
  readonly version: "1.0.0";
  readonly releaseLineage: readonly string[];
  readonly architecturalScope: readonly string[];
  readonly duplicatesUpstreamContents: false;
  readonly ordinal: number;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministic: true;
}

/** Platform inventory descriptor. */
export interface IntegrationOrchestrationPlatformInventory {
  readonly inventoryId: "EIL-4:6/Inventory";
  readonly manifestInventoryTotal: number;
  readonly architectureManifestCount: number;
  readonly dependencyManifestCount: number;
  readonly compatibilityManifestCount: number;
  readonly validationSummaryCount: number;
  readonly platformMetadataCount: number;
  readonly aggregatePublicExports: number;
  readonly total: number;
  readonly countsDerivedFromManifest: true;
  readonly hardcodedCounts: false;
  readonly duplicatesUpstreamCollections: false;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministic: true;
}

/** Platform guarantee declaration. */
export interface IntegrationOrchestrationPlatformGuarantee {
  readonly guaranteeId: `EIL-4:6/Guarantee/${OrchestrationPlatformGuaranteeKey}`;
  readonly key: OrchestrationPlatformGuaranteeKey;
  readonly canonicalName: string;
  readonly description: string;
  readonly ownership: OrchestrationPlatformOwnership;
  readonly ordinal: number;
  readonly tags: readonly string[];
  readonly runtimeEnforced: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}

/** Platform compatibility declaration. */
export interface IntegrationOrchestrationPlatformCompatibility {
  readonly compatibilityId: `EIL-4:6/Compatibility/${string}`;
  readonly scope: OrchestrationPlatformCompatibilityScope;
  readonly canonicalKey: string;
  readonly canonicalName: string;
  readonly description: string;
  readonly ordinal: number;
  readonly tags: readonly string[];
  readonly runtimeValidated: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}

/** Platform readiness descriptor. */
export interface OrchestrationPlatformReadiness {
  readonly readinessId: "EIL-4:6/Readiness";
  readonly status: OrchestrationPlatformStatus;
  readonly readiness: OrchestrationPlatformReadinessState;
  readonly nextPhase: "EIL-4:7 — Integration Orchestration Certification";
  readonly claimsRuntimeReady: false;
  readonly claimsFrozen: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}

/** Platform collections envelope. */
export interface IntegrationOrchestrationPlatformCollections {
  readonly collectionsId: "EIL-4:6/Collections";
  readonly sourcePhase: "EIL-4:6";
  readonly composition: IntegrationOrchestrationPlatformComposition;
  readonly inventory: IntegrationOrchestrationPlatformInventory;
  readonly guarantees: readonly IntegrationOrchestrationPlatformGuarantee[];
  readonly compatibility: readonly IntegrationOrchestrationPlatformCompatibility[];
  readonly guaranteeCount: number;
  readonly compatibilityCount: number;
  readonly manifestInventoryTotal: number;
  readonly total: number;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministic: true;
}

/** Platform summary descriptor. */
export interface IntegrationOrchestrationPlatformSummary {
  readonly platformId: "EIL-4:6/IntegrationOrchestrationPlatform";
  readonly version: "1.0.0";
  readonly name: "Integration Orchestration Platform";
  readonly namespace: "nexora.eil.integration-orchestration.platform";
  readonly status: OrchestrationPlatformStatus;
  readonly readiness: OrchestrationPlatformReadinessState;
  readonly manifestId: "EIL-4:5/IntegrationOrchestrationManifest";
  readonly guaranteeCount: number;
  readonly compatibilityCount: number;
  readonly manifestInventoryTotal: number;
  readonly total: number;
  readonly architecturalCompleteness: true;
  readonly nextPhase: "EIL-4:7 — Integration Orchestration Certification";
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministic: true;
}

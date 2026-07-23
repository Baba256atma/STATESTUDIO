/**
 * EIL-1:6 — Integration Platform Types.
 *
 * Readonly contracts and closed vocabularies for the Integration Platform.
 * Metadata-only. No runtime behavior.
 *
 * Ownership: owned exclusively by EIL-1:6.
 */

/** Platform status for EIL-1:6. */
export type IntegrationPlatformStatus = "Platform";

/** Immediate downstream readiness — Certification only. */
export type IntegrationPlatformReadiness = "ReadyForCertification";

/** Closed guarantee-key vocabulary. */
export type IntegrationPlatformGuaranteeKey =
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
export type IntegrationPlatformCompatibilityScope =
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
export type IntegrationPlatformOwnership =
  | "EIL-1:6"
  | "EIL-1 Integration Platform";

/** Canonical platform identity. */
export interface IntegrationPlatformIdentityDescriptor {
  readonly phaseId: "EIL-1:6";
  readonly canonicalId: "EIL-1:6/IntegrationPlatform";
  readonly name: "Integration Platform";
  readonly version: "1.0.0";
  readonly namespace: "nexora.eil.integration.platform";
  readonly layer: "EIL";
  readonly platform: "EIL-1";
  readonly phaseType: "Platform";
  readonly status: IntegrationPlatformStatus;
  readonly readiness: IntegrationPlatformReadiness;
  readonly manifestDependency: "EIL-1:5/IntegrationManifest";
  readonly manifestEntryPoint: "integrationManifest.ts";
  readonly description: string;
  readonly metadataOnly: true;
  readonly immutable: true;
}

/** Platform composition descriptor. */
export interface IntegrationPlatformCompositionDescriptor {
  readonly compositionId: "EIL-1:6/Composition";
  readonly platformIdentity: "EIL-1:6/IntegrationPlatform";
  readonly canonicalArchitecture: "EIL-1:5/Architecture";
  readonly foundationReference: string;
  readonly registryReference: string;
  readonly modelReference: string;
  readonly validationReference: string;
  readonly manifestReference: "EIL-1:5/IntegrationManifest";
  readonly ownership: IntegrationPlatformOwnership;
  readonly namespace: "nexora.eil.integration.platform";
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
export interface IntegrationPlatformInventoryDescriptor {
  readonly inventoryId: "EIL-1:6/Inventory";
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
export interface IntegrationPlatformGuarantee {
  readonly guaranteeId: `EIL-1:6/Guarantee/${IntegrationPlatformGuaranteeKey}`;
  readonly key: IntegrationPlatformGuaranteeKey;
  readonly canonicalName: string;
  readonly description: string;
  readonly ownership: IntegrationPlatformOwnership;
  readonly ordinal: number;
  readonly tags: readonly string[];
  readonly runtimeEnforced: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}

/** Platform compatibility declaration. */
export interface IntegrationPlatformCompatibilityDeclaration {
  readonly compatibilityId: `EIL-1:6/Compatibility/${string}`;
  readonly scope: IntegrationPlatformCompatibilityScope;
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
export interface IntegrationPlatformReadinessDescriptor {
  readonly readinessId: "EIL-1:6/Readiness";
  readonly status: IntegrationPlatformStatus;
  readonly readiness: IntegrationPlatformReadiness;
  readonly nextPhase: "EIL-1:7 — Integration Certification";
  readonly claimsRuntimeReady: false;
  readonly claimsFrozen: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}

/** Platform collections envelope. */
export interface IntegrationPlatformCollectionsDescriptor {
  readonly collectionsId: "EIL-1:6/Collections";
  readonly sourcePhase: "EIL-1:6";
  readonly composition: IntegrationPlatformCompositionDescriptor;
  readonly inventory: IntegrationPlatformInventoryDescriptor;
  readonly guarantees: readonly IntegrationPlatformGuarantee[];
  readonly compatibility: readonly IntegrationPlatformCompatibilityDeclaration[];
  readonly guaranteeCount: number;
  readonly compatibilityCount: number;
  readonly manifestInventoryTotal: number;
  readonly total: number;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministic: true;
}

/** Aggregate platform summary. */
export interface IntegrationPlatformSummaryDescriptor {
  readonly platformId: "EIL-1:6/IntegrationPlatform";
  readonly version: "1.0.0";
  readonly name: "Integration Platform";
  readonly namespace: "nexora.eil.integration.platform";
  readonly status: IntegrationPlatformStatus;
  readonly readiness: IntegrationPlatformReadiness;
  readonly manifestId: "EIL-1:5/IntegrationManifest";
  readonly guaranteeCount: number;
  readonly compatibilityCount: number;
  readonly manifestInventoryTotal: number;
  readonly total: number;
  readonly architecturalCompleteness: true;
  readonly nextPhase: "EIL-1:7 — Integration Certification";
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministic: true;
}

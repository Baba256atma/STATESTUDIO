/**
 * EIL-3:6 — Integration Routing Platform Types.
 *
 * Readonly contracts and closed vocabularies for the Integration Routing Platform.
 * Metadata-only. No runtime behavior.
 *
 * Ownership: owned exclusively by EIL-3:6.
 */

/** Platform status for EIL-3:6. */
export type RoutingPlatformStatus = "Platform";

/** Immediate downstream readiness — Certification only. */
export type RoutingPlatformReadinessState = "ReadyForCertification";

/** Closed guarantee-key vocabulary. */
export type RoutingPlatformGuaranteeKey =
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
export type RoutingPlatformCompatibilityScope =
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
export type RoutingPlatformOwnership =
  | "EIL-3:6"
  | "EIL-3 Integration Routing Platform";

/** Canonical platform identity. */
export interface RoutingPlatformIdentity {
  readonly phaseId: "EIL-3:6";
  readonly canonicalId: "EIL-3:6/IntegrationRoutingPlatform";
  readonly name: "Integration Routing Platform";
  readonly version: "1.0.0";
  readonly namespace: "nexora.eil.integration-routing.platform";
  readonly layer: "EIL";
  readonly platform: "EIL-3";
  readonly phaseType: "Platform";
  readonly status: RoutingPlatformStatus;
  readonly readiness: RoutingPlatformReadinessState;
  readonly manifestDependency: "EIL-3:5/IntegrationRoutingManifest";
  readonly manifestEntryPoint: "integrationRoutingManifest.ts";
  readonly description: string;
  readonly metadataOnly: true;
  readonly immutable: true;
}

/** Platform composition descriptor. */
export interface RoutingPlatformComposition {
  readonly compositionId: "EIL-3:6/Composition";
  readonly platformIdentity: "EIL-3:6/IntegrationRoutingPlatform";
  readonly canonicalArchitecture: "EIL-3:5/Architecture";
  readonly foundationReference: string;
  readonly registryReference: string;
  readonly modelReference: string;
  readonly validationReference: string;
  readonly manifestReference: "EIL-3:5/IntegrationRoutingManifest";
  readonly ownership: RoutingPlatformOwnership;
  readonly namespace: "nexora.eil.integration-routing.platform";
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
export interface RoutingPlatformInventory {
  readonly inventoryId: "EIL-3:6/Inventory";
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
export interface RoutingPlatformGuarantee {
  readonly guaranteeId: `EIL-3:6/Guarantee/${RoutingPlatformGuaranteeKey}`;
  readonly key: RoutingPlatformGuaranteeKey;
  readonly canonicalName: string;
  readonly description: string;
  readonly ownership: RoutingPlatformOwnership;
  readonly ordinal: number;
  readonly tags: readonly string[];
  readonly runtimeEnforced: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}

/** Platform compatibility declaration. */
export interface RoutingPlatformCompatibilityDeclaration {
  readonly compatibilityId: `EIL-3:6/Compatibility/${string}`;
  readonly scope: RoutingPlatformCompatibilityScope;
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
export interface RoutingPlatformReadiness {
  readonly readinessId: "EIL-3:6/Readiness";
  readonly status: RoutingPlatformStatus;
  readonly readiness: RoutingPlatformReadinessState;
  readonly nextPhase: "EIL-3:7 — Integration Routing Certification";
  readonly claimsRuntimeReady: false;
  readonly claimsFrozen: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}

/** Platform collections envelope. */
export interface RoutingPlatformCollections {
  readonly collectionsId: "EIL-3:6/Collections";
  readonly sourcePhase: "EIL-3:6";
  readonly composition: RoutingPlatformComposition;
  readonly inventory: RoutingPlatformInventory;
  readonly guarantees: readonly RoutingPlatformGuarantee[];
  readonly compatibility: readonly RoutingPlatformCompatibilityDeclaration[];
  readonly guaranteeCount: number;
  readonly compatibilityCount: number;
  readonly manifestInventoryTotal: number;
  readonly total: number;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministic: true;
}

/** Platform summary descriptor. */
export interface RoutingPlatformSummary {
  readonly platformId: "EIL-3:6/IntegrationRoutingPlatform";
  readonly version: "1.0.0";
  readonly name: "Integration Routing Platform";
  readonly namespace: "nexora.eil.integration-routing.platform";
  readonly status: RoutingPlatformStatus;
  readonly readiness: RoutingPlatformReadinessState;
  readonly manifestId: "EIL-3:5/IntegrationRoutingManifest";
  readonly guaranteeCount: number;
  readonly compatibilityCount: number;
  readonly manifestInventoryTotal: number;
  readonly total: number;
  readonly architecturalCompleteness: true;
  readonly nextPhase: "EIL-3:7 — Integration Routing Certification";
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministic: true;
}

/**
 * EIL-2:6 — Integration Connector Platform Types.
 *
 * Readonly contracts and closed vocabularies for the Integration Connector Platform.
 * Metadata-only. No runtime behavior.
 *
 * Ownership: owned exclusively by EIL-2:6.
 */

/** Platform status for EIL-2:6. */
export type IntegrationConnectorPlatformStatus = "Platform";

/** Immediate downstream readiness — Certification only. */
export type IntegrationConnectorPlatformReadiness = "ReadyForCertification";

/** Closed guarantee-key vocabulary. */
export type IntegrationConnectorPlatformGuaranteeKey =
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
export type IntegrationConnectorPlatformCompatibilityScope =
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
export type IntegrationConnectorPlatformOwnership =
  | "EIL-2:6"
  | "EIL-2 Integration Connector Platform";

/** Canonical platform identity. */
export interface IntegrationConnectorPlatformIdentityDescriptor {
  readonly phaseId: "EIL-2:6";
  readonly canonicalId: "EIL-2:6/IntegrationConnectorPlatform";
  readonly name: "Integration Connector Platform";
  readonly version: "1.0.0";
  readonly namespace: "nexora.eil.integration-connector.platform";
  readonly layer: "EIL";
  readonly platform: "EIL-2";
  readonly phaseType: "Platform";
  readonly status: IntegrationConnectorPlatformStatus;
  readonly readiness: IntegrationConnectorPlatformReadiness;
  readonly manifestDependency: "EIL-2:5/IntegrationConnectorManifest";
  readonly manifestEntryPoint: "integrationConnectorManifest.ts";
  readonly description: string;
  readonly metadataOnly: true;
  readonly immutable: true;
}

/** Platform composition descriptor. */
export interface IntegrationConnectorPlatformCompositionDescriptor {
  readonly compositionId: "EIL-2:6/Composition";
  readonly platformIdentity: "EIL-2:6/IntegrationConnectorPlatform";
  readonly canonicalArchitecture: "EIL-2:5/Architecture";
  readonly foundationReference: string;
  readonly registryReference: string;
  readonly modelReference: string;
  readonly validationReference: string;
  readonly manifestReference: "EIL-2:5/IntegrationConnectorManifest";
  readonly ownership: IntegrationConnectorPlatformOwnership;
  readonly namespace: "nexora.eil.integration-connector.platform";
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
export interface IntegrationConnectorPlatformInventoryDescriptor {
  readonly inventoryId: "EIL-2:6/Inventory";
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
export interface IntegrationConnectorPlatformGuarantee {
  readonly guaranteeId: `EIL-2:6/Guarantee/${IntegrationConnectorPlatformGuaranteeKey}`;
  readonly key: IntegrationConnectorPlatformGuaranteeKey;
  readonly canonicalName: string;
  readonly description: string;
  readonly ownership: IntegrationConnectorPlatformOwnership;
  readonly ordinal: number;
  readonly tags: readonly string[];
  readonly runtimeEnforced: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}

/** Platform compatibility declaration. */
export interface IntegrationConnectorPlatformCompatibilityDeclaration {
  readonly compatibilityId: `EIL-2:6/Compatibility/${string}`;
  readonly scope: IntegrationConnectorPlatformCompatibilityScope;
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
export interface IntegrationConnectorPlatformReadinessDescriptor {
  readonly readinessId: "EIL-2:6/Readiness";
  readonly status: IntegrationConnectorPlatformStatus;
  readonly readiness: IntegrationConnectorPlatformReadiness;
  readonly nextPhase: "EIL-2:7 — Integration Connector Certification";
  readonly claimsRuntimeReady: false;
  readonly claimsFrozen: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}

/** Platform collections envelope. */
export interface IntegrationConnectorPlatformCollectionsDescriptor {
  readonly collectionsId: "EIL-2:6/Collections";
  readonly sourcePhase: "EIL-2:6";
  readonly composition: IntegrationConnectorPlatformCompositionDescriptor;
  readonly inventory: IntegrationConnectorPlatformInventoryDescriptor;
  readonly guarantees: readonly IntegrationConnectorPlatformGuarantee[];
  readonly compatibility: readonly IntegrationConnectorPlatformCompatibilityDeclaration[];
  readonly guaranteeCount: number;
  readonly compatibilityCount: number;
  readonly manifestInventoryTotal: number;
  readonly total: number;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministic: true;
}

/** Platform summary descriptor. */
export interface IntegrationConnectorPlatformSummaryDescriptor {
  readonly platformId: "EIL-2:6/IntegrationConnectorPlatform";
  readonly version: "1.0.0";
  readonly name: "Integration Connector Platform";
  readonly namespace: "nexora.eil.integration-connector.platform";
  readonly status: IntegrationConnectorPlatformStatus;
  readonly readiness: IntegrationConnectorPlatformReadiness;
  readonly manifestId: "EIL-2:5/IntegrationConnectorManifest";
  readonly guaranteeCount: number;
  readonly compatibilityCount: number;
  readonly manifestInventoryTotal: number;
  readonly total: number;
  readonly architecturalCompleteness: true;
  readonly nextPhase: "EIL-2:7 — Integration Connector Certification";
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministic: true;
}

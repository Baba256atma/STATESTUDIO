/**
 * EIL-5:6 — Integration Policy & Governance Platform Types.
 *
 * Readonly contracts and closed vocabularies for the Integration Policy & Governance Platform.
 * Metadata-only. No runtime behavior.
 *
 * Ownership: owned exclusively by EIL-5:6.
 */

/** Platform status for EIL-5:6. */
export type PolicyGovernancePlatformStatus = "Platform";

/** Immediate downstream readiness — Certification only. */
export type PolicyGovernancePlatformReadinessState = "ReadyForCertification";

/** Closed guarantee-key vocabulary. */
export type PolicyGovernancePlatformGuaranteeKey =
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
export type PolicyGovernancePlatformCompatibilityScope =
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
export type PolicyGovernancePlatformOwnership =
  | "EIL-5:6"
  | "EIL-5 Integration Policy & Governance Platform";

/** Canonical platform identity. */
export interface IntegrationPolicyGovernancePlatformIdentity {
  readonly phaseId: "EIL-5:6";
  readonly canonicalId: "EIL-5:6/IntegrationPolicyGovernancePlatform";
  readonly name: "Integration Policy & Governance Platform";
  readonly version: "1.0.0";
  readonly namespace: "nexora.eil.integration-policy-governance.platform";
  readonly layer: "EIL";
  readonly platform: "EIL-5";
  readonly phaseType: "Platform";
  readonly status: PolicyGovernancePlatformStatus;
  readonly readiness: PolicyGovernancePlatformReadinessState;
  readonly manifestDependency: "EIL-5:5/IntegrationPolicyGovernanceManifest";
  readonly manifestEntryPoint: "integrationPolicyGovernanceManifest.ts";
  readonly description: string;
  readonly metadataOnly: true;
  readonly immutable: true;
}

/** Platform composition descriptor. */
export interface IntegrationPolicyGovernancePlatformComposition {
  readonly compositionId: "EIL-5:6/Composition";
  readonly platformIdentity: "EIL-5:6/IntegrationPolicyGovernancePlatform";
  readonly canonicalArchitecture: "EIL-5:5/Architecture";
  readonly foundationReference: string;
  readonly registryReference: string;
  readonly modelReference: string;
  readonly validationReference: string;
  readonly manifestReference: "EIL-5:5/IntegrationPolicyGovernanceManifest";
  readonly ownership: PolicyGovernancePlatformOwnership;
  readonly namespace: "nexora.eil.integration-policy-governance.platform";
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
export interface IntegrationPolicyGovernancePlatformInventory {
  readonly inventoryId: "EIL-5:6/Inventory";
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
export interface IntegrationPolicyGovernancePlatformGuarantee {
  readonly guaranteeId: `EIL-5:6/Guarantee/${PolicyGovernancePlatformGuaranteeKey}`;
  readonly key: PolicyGovernancePlatformGuaranteeKey;
  readonly canonicalName: string;
  readonly description: string;
  readonly ownership: PolicyGovernancePlatformOwnership;
  readonly ordinal: number;
  readonly tags: readonly string[];
  readonly runtimeEnforced: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}

/** Platform compatibility declaration. */
export interface IntegrationPolicyGovernancePlatformCompatibility {
  readonly compatibilityId: `EIL-5:6/Compatibility/${string}`;
  readonly scope: PolicyGovernancePlatformCompatibilityScope;
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
export interface PolicyGovernancePlatformReadiness {
  readonly readinessId: "EIL-5:6/Readiness";
  readonly status: PolicyGovernancePlatformStatus;
  readonly readiness: PolicyGovernancePlatformReadinessState;
  readonly nextPhase: "EIL-5:7 — Integration Policy & Governance Certification";
  readonly claimsRuntimeReady: false;
  readonly claimsFrozen: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}

/** Platform collections envelope. */
export interface IntegrationPolicyGovernancePlatformCollections {
  readonly collectionsId: "EIL-5:6/Collections";
  readonly sourcePhase: "EIL-5:6";
  readonly composition: IntegrationPolicyGovernancePlatformComposition;
  readonly inventory: IntegrationPolicyGovernancePlatformInventory;
  readonly guarantees: readonly IntegrationPolicyGovernancePlatformGuarantee[];
  readonly compatibility: readonly IntegrationPolicyGovernancePlatformCompatibility[];
  readonly guaranteeCount: number;
  readonly compatibilityCount: number;
  readonly manifestInventoryTotal: number;
  readonly total: number;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministic: true;
}

/** Platform summary descriptor. */
export interface IntegrationPolicyGovernancePlatformSummary {
  readonly platformId: "EIL-5:6/IntegrationPolicyGovernancePlatform";
  readonly version: "1.0.0";
  readonly name: "Integration Policy & Governance Platform";
  readonly namespace: "nexora.eil.integration-policy-governance.platform";
  readonly status: PolicyGovernancePlatformStatus;
  readonly readiness: PolicyGovernancePlatformReadinessState;
  readonly manifestId: "EIL-5:5/IntegrationPolicyGovernanceManifest";
  readonly guaranteeCount: number;
  readonly compatibilityCount: number;
  readonly manifestInventoryTotal: number;
  readonly total: number;
  readonly architecturalCompleteness: true;
  readonly nextPhase: "EIL-5:7 — Integration Policy & Governance Certification";
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministic: true;
}

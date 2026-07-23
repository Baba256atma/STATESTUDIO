/**
 * EIL-1:5 — Integration Manifest Types.
 *
 * Readonly contracts and closed vocabularies for the Integration Manifest.
 * Metadata-only. No runtime behavior.
 *
 * Ownership: owned exclusively by EIL-1:5.
 */

/** Manifest status for EIL-1:5. */
export type IntegrationManifestStatus = "Manifest";

/** Immediate downstream readiness — Platform only. */
export type IntegrationManifestReadiness = "ReadyForPlatform";

/** Closed source-phase vocabulary for lineage references. */
export type IntegrationManifestSourcePhase =
  | "EIL-1:1"
  | "EIL-1:2"
  | "EIL-1:3"
  | "EIL-1:4"
  | "EIL-1:5";

/** Closed compatibility-scope vocabulary. */
export type IntegrationManifestCompatibilityScope =
  | "Foundation"
  | "Registry"
  | "Model"
  | "Validation"
  | "Forward"
  | "Version"
  | "Namespace"
  | "Architecture";

/** Closed ownership vocabulary. */
export type IntegrationManifestOwnership =
  | "EIL-1:5"
  | "EIL-1 Integration Manifest";

/** Canonical manifest identity. */
export interface IntegrationManifestIdentityDescriptor {
  readonly phaseId: "EIL-1:5";
  readonly canonicalId: "EIL-1:5/IntegrationManifest";
  readonly name: "Integration Manifest";
  readonly version: "1.0.0";
  readonly namespace: "nexora.eil.integration.manifest";
  readonly layer: "EIL";
  readonly platform: "EIL-1";
  readonly phaseType: "Manifest";
  readonly status: IntegrationManifestStatus;
  readonly readiness: IntegrationManifestReadiness;
  readonly validationDependency: "EIL-1:4/IntegrationValidation";
  readonly validationEntryPoint: "integrationValidation.ts";
  readonly description: string;
  readonly metadataOnly: true;
  readonly immutable: true;
}

/** Architecture manifesto descriptor. */
export interface IntegrationArchitectureManifestDescriptor {
  readonly architectureId: "EIL-1:5/Architecture";
  readonly platformIdentity: "EIL-1";
  readonly architectureIdentity: "EIL-1:5/IntegrationManifest";
  readonly namespace: "nexora.eil.integration.manifest";
  readonly version: "1.0.0";
  readonly status: IntegrationManifestStatus;
  readonly readiness: IntegrationManifestReadiness;
  readonly canonicalReferences: readonly string[];
  readonly sourcePhases: readonly IntegrationManifestSourcePhase[];
  readonly ownership: IntegrationManifestOwnership;
  readonly architecturalScope: readonly string[];
  readonly releaseLineage: readonly string[];
  readonly ordinal: number;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministic: true;
}

/** Inventory manifesto descriptor with derived counts. */
export interface IntegrationInventoryManifestDescriptor {
  readonly inventoryId: "EIL-1:5/Inventory";
  readonly foundationContractCount: number;
  readonly foundationCapabilityCount: number;
  readonly foundationResponsibilityCount: number;
  readonly lifecycleStateCount: number;
  readonly registryEntryCount: number;
  readonly domainModelCount: number;
  readonly relationshipModelCount: number;
  readonly topologyModelCount: number;
  readonly validationRuleCount: number;
  readonly validationCategoryCount: number;
  readonly validationFindingCount: number;
  readonly publicExportCount: number;
  readonly totalInventoryCount: number;
  readonly countsDerivedFromUpstream: true;
  readonly hardcodedCounts: false;
  readonly duplicatesUpstreamCollections: false;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministic: true;
}

/** Dependency manifesto descriptor. */
export interface IntegrationDependencyManifestDescriptor {
  readonly dependencyId: "EIL-1:5/Dependency";
  readonly upstreamDependency: "EIL-1:4/IntegrationValidation";
  readonly dependencyDirection: "Validation → Manifest";
  readonly aggregateEntryPoint: "integrationValidation.ts";
  readonly dependencyScope: "ValidationPublicSurfaceOnly";
  readonly allowedImports: readonly string[];
  readonly prohibitedImports: readonly string[];
  readonly architecturalBoundaries: readonly string[];
  readonly phaseDependencyCount: 1;
  readonly laterEilPhaseImport: false;
  readonly validationInternalImport: false;
  readonly modelDirectImport: false;
  readonly registryDirectImport: false;
  readonly foundationDirectImport: false;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministic: true;
}

/** Compatibility declaration entry. */
export interface IntegrationCompatibilityDeclaration {
  readonly compatibilityId: `EIL-1:5/Compatibility/${string}`;
  readonly scope: IntegrationManifestCompatibilityScope;
  readonly canonicalKey: string;
  readonly canonicalName: string;
  readonly description: string;
  readonly sourcePhase: IntegrationManifestSourcePhase;
  readonly ordinal: number;
  readonly tags: readonly string[];
  readonly runtimeValidated: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}

/** Compatibility manifesto descriptor. */
export interface IntegrationCompatibilityManifestDescriptor {
  readonly compatibilityManifestId: "EIL-1:5/CompatibilityManifest";
  readonly declarations: readonly IntegrationCompatibilityDeclaration[];
  readonly declarationCount: number;
  readonly runtimeValidated: false;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministic: true;
}

/** Manifest readiness descriptor. */
export interface IntegrationManifestReadinessDescriptor {
  readonly readinessId: "EIL-1:5/Readiness";
  readonly status: IntegrationManifestStatus;
  readonly readiness: IntegrationManifestReadiness;
  readonly nextPhase: "EIL-1:6 — Integration Platform";
  readonly claimsRuntimeReady: false;
  readonly claimsReadyForCertification: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}

/** Aggregate inventory envelope. */
export interface IntegrationManifestInventory {
  readonly inventoryId: "EIL-1:5/ManifestInventory";
  readonly foundationContractCount: number;
  readonly registryEntryCount: number;
  readonly domainModelCount: number;
  readonly validationRuleCount: number;
  readonly totalInventoryCount: number;
  readonly countsDerivedFromCollections: true;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministic: true;
}

/** Aggregate manifest summary. */
export interface IntegrationManifestSummaryDescriptor {
  readonly manifestId: "EIL-1:5/IntegrationManifest";
  readonly version: "1.0.0";
  readonly name: "Integration Manifest";
  readonly namespace: "nexora.eil.integration.manifest";
  readonly status: IntegrationManifestStatus;
  readonly readiness: IntegrationManifestReadiness;
  readonly validationId: "EIL-1:4/IntegrationValidation";
  readonly validationStatus: "Validation";
  readonly dependencySummary: string;
  readonly compatibilitySummary: string;
  readonly foundationContractCount: number;
  readonly registryEntryCount: number;
  readonly domainModelCount: number;
  readonly validationRuleCount: number;
  readonly totalInventoryCount: number;
  readonly architecturalCompleteness: true;
  readonly nextPhase: "EIL-1:6 — Integration Platform";
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministic: true;
}

/**
 * EIL-2:5 — Integration Connector Manifest Types.
 *
 * Readonly contracts and closed vocabularies for the Integration Connector Manifest.
 * Metadata-only. No runtime behavior.
 *
 * Ownership: owned exclusively by EIL-2:5.
 */

/** Manifest status for EIL-2:5. */
export type IntegrationConnectorManifestStatus = "Manifest";

/** Immediate downstream readiness — Platform only. */
export type IntegrationConnectorManifestReadiness = "ReadyForPlatform";

/** Closed source-phase vocabulary for lineage references. */
export type IntegrationConnectorManifestSourcePhase =
  | "EIL-2:1"
  | "EIL-2:2"
  | "EIL-2:3"
  | "EIL-2:4"
  | "EIL-2:5";

/** Closed compatibility-scope vocabulary. */
export type IntegrationConnectorManifestCompatibilityScope =
  | "Foundation"
  | "Registry"
  | "Model"
  | "Validation"
  | "Forward"
  | "Version"
  | "Namespace"
  | "Architecture";

/** Closed ownership vocabulary. */
export type IntegrationConnectorManifestOwnership =
  | "EIL-2:5"
  | "EIL-2 Integration Connector Manifest";

/** Canonical manifest identity. */
export interface IntegrationConnectorManifestIdentityDescriptor {
  readonly phaseId: "EIL-2:5";
  readonly canonicalId: "EIL-2:5/IntegrationConnectorManifest";
  readonly name: "Integration Connector Manifest";
  readonly version: "1.0.0";
  readonly namespace: "nexora.eil.integration-connector.manifest";
  readonly layer: "EIL";
  readonly platform: "EIL-2";
  readonly phaseType: "Manifest";
  readonly status: IntegrationConnectorManifestStatus;
  readonly readiness: IntegrationConnectorManifestReadiness;
  readonly validationDependency: "EIL-2:4/IntegrationConnectorValidation";
  readonly validationEntryPoint: "integrationConnectorValidation.ts";
  readonly description: string;
  readonly metadataOnly: true;
  readonly immutable: true;
}

/** Architecture manifesto descriptor. */
export interface IntegrationConnectorArchitectureManifestDescriptor {
  readonly architectureId: "EIL-2:5/Architecture";
  readonly platformIdentity: "EIL-2";
  readonly architectureIdentity: "EIL-2:5/IntegrationConnectorManifest";
  readonly namespace: "nexora.eil.integration-connector.manifest";
  readonly version: "1.0.0";
  readonly status: IntegrationConnectorManifestStatus;
  readonly readiness: IntegrationConnectorManifestReadiness;
  readonly canonicalReferences: readonly string[];
  readonly sourcePhases: readonly IntegrationConnectorManifestSourcePhase[];
  readonly ownership: IntegrationConnectorManifestOwnership;
  readonly architecturalScope: readonly string[];
  readonly releaseLineage: readonly string[];
  readonly ordinal: number;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministic: true;
}

/** Inventory manifesto descriptor with derived counts. */
export interface IntegrationConnectorInventoryManifestDescriptor {
  readonly inventoryId: "EIL-2:5/Inventory";
  readonly foundationCategoryCount: number;
  readonly foundationContractCount: number;
  readonly foundationCapabilityCount: number;
  readonly foundationResponsibilityCount: number;
  readonly lifecycleStateCount: number;
  readonly registryEntryCount: number;
  readonly domainModelCount: number;
  readonly relationshipModelCount: number;
  readonly endpointModelCount: number;
  readonly protocolModelCount: number;
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
export interface IntegrationConnectorDependencyManifestDescriptor {
  readonly dependencyId: "EIL-2:5/Dependency";
  readonly upstreamDependency: "EIL-2:4/IntegrationConnectorValidation";
  readonly dependencyDirection: "Validation → Manifest";
  readonly aggregateEntryPoint: "integrationConnectorValidation.ts";
  readonly dependencyScope: "ValidationPublicSurfaceOnly";
  readonly allowedImports: readonly string[];
  readonly prohibitedImports: readonly string[];
  readonly architecturalBoundaries: readonly string[];
  readonly phaseDependencyCount: 1;
  readonly laterEil2PhaseImport: false;
  readonly validationInternalImport: false;
  readonly modelDirectImport: false;
  readonly registryDirectImport: false;
  readonly foundationDirectImport: false;
  readonly eil1Dependency: false;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministic: true;
}

/** Compatibility declaration entry. */
export interface IntegrationConnectorCompatibilityDeclaration {
  readonly compatibilityId: `EIL-2:5/Compatibility/${string}`;
  readonly scope: IntegrationConnectorManifestCompatibilityScope;
  readonly canonicalKey: string;
  readonly canonicalName: string;
  readonly description: string;
  readonly sourcePhase: IntegrationConnectorManifestSourcePhase;
  readonly ordinal: number;
  readonly tags: readonly string[];
  readonly runtimeValidated: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}

/** Compatibility manifesto descriptor. */
export interface IntegrationConnectorCompatibilityManifestDescriptor {
  readonly compatibilityManifestId: "EIL-2:5/CompatibilityManifest";
  readonly declarations: readonly IntegrationConnectorCompatibilityDeclaration[];
  readonly declarationCount: number;
  readonly runtimeValidated: false;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministic: true;
}

/** Manifest readiness descriptor. */
export interface IntegrationConnectorManifestReadinessDescriptor {
  readonly readinessId: "EIL-2:5/Readiness";
  readonly status: IntegrationConnectorManifestStatus;
  readonly readiness: IntegrationConnectorManifestReadiness;
  readonly nextPhase: "EIL-2:6 — Integration Connector Platform";
  readonly claimsRuntimeReady: false;
  readonly claimsReadyForCertification: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}

/** Manifest collections descriptor. */
export interface IntegrationConnectorManifestCollectionsDescriptor {
  readonly collectionsId: "EIL-2:5/Collections";
  readonly sourcePhase: "EIL-2:5";
  readonly architecture: IntegrationConnectorArchitectureManifestDescriptor;
  readonly inventory: IntegrationConnectorInventoryManifestDescriptor;
  readonly dependency: IntegrationConnectorDependencyManifestDescriptor;
  readonly compatibility: IntegrationConnectorCompatibilityManifestDescriptor;
  readonly compatibilityDeclarationCount: number;
  readonly foundationCategoryCount: number;
  readonly registryEntryCount: number;
  readonly domainModelCount: number;
  readonly validationRuleCount: number;
  readonly totalInventoryCount: number;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministic: true;
}

/** Manifest inventory envelope. */
export interface IntegrationConnectorManifestInventory {
  readonly inventoryId: "EIL-2:5/ManifestInventory";
  readonly foundationCategoryCount: number;
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
export interface IntegrationConnectorManifestSummaryDescriptor {
  readonly manifestId: "EIL-2:5/IntegrationConnectorManifest";
  readonly version: "1.0.0";
  readonly name: "Integration Connector Manifest";
  readonly namespace: "nexora.eil.integration-connector.manifest";
  readonly status: IntegrationConnectorManifestStatus;
  readonly readiness: IntegrationConnectorManifestReadiness;
  readonly validationId: "EIL-2:4/IntegrationConnectorValidation";
  readonly validationStatus: "Validation";
  readonly dependencySummary: string;
  readonly compatibilitySummary: string;
  readonly foundationCategoryCount: number;
  readonly registryEntryCount: number;
  readonly domainModelCount: number;
  readonly validationRuleCount: number;
  readonly totalInventoryCount: number;
  readonly architecturalCompleteness: true;
  readonly nextPhase: "EIL-2:6 — Integration Connector Platform";
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministic: true;
}

/**
 * EIL-3:5 — Integration Routing Manifest Types.
 *
 * Readonly contracts and closed vocabularies for the Integration Routing Manifest.
 * Metadata-only. No runtime behavior.
 *
 * Ownership: owned exclusively by EIL-3:5.
 */

/** Manifest status for EIL-3:5. */
export type RoutingManifestStatus = "Manifest";

/** Immediate downstream readiness — Platform only. */
export type RoutingManifestReadinessState = "ReadyForPlatform";

/** Closed source-phase vocabulary for lineage references. */
export type RoutingManifestSourcePhase =
  | "EIL-3:1"
  | "EIL-3:2"
  | "EIL-3:3"
  | "EIL-3:4"
  | "EIL-3:5";

/** Closed compatibility-scope vocabulary. */
export type RoutingManifestCompatibilityScope =
  | "Foundation"
  | "Registry"
  | "Model"
  | "Validation"
  | "Forward"
  | "Version"
  | "Namespace"
  | "Architecture";

/** Closed ownership vocabulary. */
export type RoutingManifestOwnership =
  | "EIL-3:5"
  | "EIL-3 Integration Routing Manifest";

/** Canonical manifest identity. */
export interface RoutingManifestIdentity {
  readonly phaseId: "EIL-3:5";
  readonly canonicalId: "EIL-3:5/IntegrationRoutingManifest";
  readonly name: "Integration Routing Manifest";
  readonly version: "1.0.0";
  readonly namespace: "nexora.eil.integration-routing.manifest";
  readonly layer: "EIL";
  readonly platform: "EIL-3";
  readonly phaseType: "Manifest";
  readonly status: RoutingManifestStatus;
  readonly readiness: RoutingManifestReadinessState;
  readonly validationDependency: "EIL-3:4/IntegrationRoutingValidation";
  readonly validationEntryPoint: "integrationRoutingValidation.ts";
  readonly description: string;
  readonly metadataOnly: true;
  readonly immutable: true;
}

/** Architecture manifesto descriptor. */
export interface RoutingArchitectureManifest {
  readonly architectureId: "EIL-3:5/Architecture";
  readonly platformIdentity: "EIL-3";
  readonly architectureIdentity: "EIL-3:5/IntegrationRoutingManifest";
  readonly namespace: "nexora.eil.integration-routing.manifest";
  readonly version: "1.0.0";
  readonly status: RoutingManifestStatus;
  readonly readiness: RoutingManifestReadinessState;
  readonly canonicalReferences: readonly string[];
  readonly sourcePhases: readonly RoutingManifestSourcePhase[];
  readonly ownership: RoutingManifestOwnership;
  readonly architecturalScope: readonly string[];
  readonly releaseLineage: readonly string[];
  readonly ordinal: number;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministic: true;
}

/** Inventory manifesto descriptor with derived counts. */
export interface RoutingInventoryManifest {
  readonly inventoryId: "EIL-3:5/Inventory";
  readonly foundationCategoryCount: number;
  readonly foundationContractCount: number;
  readonly foundationCapabilityCount: number;
  readonly foundationResponsibilityCount: number;
  readonly lifecycleStateCount: number;
  readonly registryEntryCount: number;
  readonly domainModelCount: number;
  readonly relationshipModelCount: number;
  readonly topologyModelCount: number;
  readonly lifecycleModelCount: number;
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
export interface RoutingDependencyManifest {
  readonly dependencyId: "EIL-3:5/Dependency";
  readonly upstreamDependency: "EIL-3:4/IntegrationRoutingValidation";
  readonly dependencyDirection: "Validation → Manifest";
  readonly aggregateEntryPoint: "integrationRoutingValidation.ts";
  readonly dependencyScope: "ValidationPublicSurfaceOnly";
  readonly allowedImports: readonly string[];
  readonly prohibitedImports: readonly string[];
  readonly architecturalBoundaries: readonly string[];
  readonly phaseDependencyCount: 1;
  readonly laterEil3PhaseImport: false;
  readonly validationInternalImport: false;
  readonly modelDirectImport: false;
  readonly registryDirectImport: false;
  readonly foundationDirectImport: false;
  readonly previousEilPlatformDependency: false;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministic: true;
}

/** Compatibility declaration entry. */
export interface RoutingCompatibilityDeclaration {
  readonly compatibilityId: `EIL-3:5/Compatibility/${string}`;
  readonly scope: RoutingManifestCompatibilityScope;
  readonly canonicalKey: string;
  readonly canonicalName: string;
  readonly description: string;
  readonly sourcePhase: RoutingManifestSourcePhase;
  readonly ordinal: number;
  readonly tags: readonly string[];
  readonly runtimeValidated: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}

/** Compatibility manifesto descriptor. */
export interface RoutingCompatibilityManifest {
  readonly compatibilityManifestId: "EIL-3:5/CompatibilityManifest";
  readonly declarations: readonly RoutingCompatibilityDeclaration[];
  readonly declarationCount: number;
  readonly runtimeValidated: false;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministic: true;
}

/** Manifest collections descriptor. */
export interface RoutingManifestCollections {
  readonly collectionsId: "EIL-3:5/Collections";
  readonly sourcePhase: "EIL-3:5";
  readonly architecture: RoutingArchitectureManifest;
  readonly inventory: RoutingInventoryManifest;
  readonly dependency: RoutingDependencyManifest;
  readonly compatibility: RoutingCompatibilityManifest;
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
export interface RoutingManifestInventory {
  readonly inventoryId: "EIL-3:5/ManifestInventory";
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
export interface RoutingManifestSummary {
  readonly manifestId: "EIL-3:5/IntegrationRoutingManifest";
  readonly version: "1.0.0";
  readonly name: "Integration Routing Manifest";
  readonly namespace: "nexora.eil.integration-routing.manifest";
  readonly status: RoutingManifestStatus;
  readonly readiness: RoutingManifestReadinessState;
  readonly validationId: "EIL-3:4/IntegrationRoutingValidation";
  readonly validationStatus: "Validation";
  readonly dependencySummary: string;
  readonly compatibilitySummary: string;
  readonly foundationCategoryCount: number;
  readonly registryEntryCount: number;
  readonly domainModelCount: number;
  readonly validationRuleCount: number;
  readonly totalInventoryCount: number;
  readonly architecturalCompleteness: true;
  readonly nextPhase: "EIL-3:6 — Integration Routing Platform";
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministic: true;
}

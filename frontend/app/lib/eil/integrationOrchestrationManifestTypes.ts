/**
 * EIL-4:5 — Integration Orchestration Manifest Types.
 *
 * Readonly contracts and closed vocabularies for the Integration Orchestration Manifest.
 * Metadata-only. No runtime behavior.
 *
 * Ownership: owned exclusively by EIL-4:5.
 */

/** Manifest status for EIL-4:5. */
export type OrchestrationManifestStatus = "Manifest";

/** Immediate downstream readiness — Platform only. */
export type OrchestrationManifestReadinessState = "ReadyForPlatform";

/** Closed source-phase vocabulary for lineage references. */
export type OrchestrationManifestSourcePhase =
  | "EIL-4:1"
  | "EIL-4:2"
  | "EIL-4:3"
  | "EIL-4:4"
  | "EIL-4:5";

/** Closed compatibility-scope vocabulary. */
export type OrchestrationManifestCompatibilityScope =
  | "Foundation"
  | "Registry"
  | "Model"
  | "Validation"
  | "Forward"
  | "Version"
  | "Namespace"
  | "Architecture";

/** Closed ownership vocabulary. */
export type OrchestrationManifestOwnership =
  | "EIL-4:5"
  | "EIL-4 Integration Orchestration Manifest";

/** Canonical manifest identity. */
export interface IntegrationOrchestrationManifestIdentity {
  readonly phaseId: "EIL-4:5";
  readonly canonicalId: "EIL-4:5/IntegrationOrchestrationManifest";
  readonly name: "Integration Orchestration Manifest";
  readonly version: "1.0.0";
  readonly namespace: "nexora.eil.integration-orchestration.manifest";
  readonly layer: "EIL";
  readonly platform: "EIL-4";
  readonly phaseType: "Manifest";
  readonly status: OrchestrationManifestStatus;
  readonly readiness: OrchestrationManifestReadinessState;
  readonly validationDependency: "EIL-4:4/IntegrationOrchestrationValidation";
  readonly validationEntryPoint: "integrationOrchestrationValidation.ts";
  readonly description: string;
  readonly metadataOnly: true;
  readonly immutable: true;
}

/** Architecture manifesto descriptor. */
export interface IntegrationOrchestrationArchitectureManifest {
  readonly architectureId: "EIL-4:5/Architecture";
  readonly platformIdentity: "EIL-4";
  readonly architectureIdentity: "EIL-4:5/IntegrationOrchestrationManifest";
  readonly namespace: "nexora.eil.integration-orchestration.manifest";
  readonly version: "1.0.0";
  readonly status: OrchestrationManifestStatus;
  readonly readiness: OrchestrationManifestReadinessState;
  readonly canonicalReferences: readonly string[];
  readonly sourcePhases: readonly OrchestrationManifestSourcePhase[];
  readonly ownership: OrchestrationManifestOwnership;
  readonly architecturalScope: readonly string[];
  readonly releaseLineage: readonly string[];
  readonly ordinal: number;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministic: true;
}

/** Inventory manifesto descriptor with derived counts. */
export interface IntegrationOrchestrationInventoryManifest {
  readonly inventoryId: "EIL-4:5/Inventory";
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
export interface IntegrationOrchestrationDependencyManifest {
  readonly dependencyId: "EIL-4:5/Dependency";
  readonly upstreamDependency: "EIL-4:4/IntegrationOrchestrationValidation";
  readonly dependencyDirection: "Validation → Manifest";
  readonly aggregateEntryPoint: "integrationOrchestrationValidation.ts";
  readonly dependencyScope: "ValidationPublicSurfaceOnly";
  readonly allowedImports: readonly string[];
  readonly prohibitedImports: readonly string[];
  readonly architecturalBoundaries: readonly string[];
  readonly phaseDependencyCount: 1;
  readonly laterEil4PhaseImport: false;
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
export interface OrchestrationCompatibilityDeclaration {
  readonly compatibilityId: `EIL-4:5/Compatibility/${string}`;
  readonly scope: OrchestrationManifestCompatibilityScope;
  readonly canonicalKey: string;
  readonly canonicalName: string;
  readonly description: string;
  readonly sourcePhase: OrchestrationManifestSourcePhase;
  readonly ordinal: number;
  readonly tags: readonly string[];
  readonly runtimeValidated: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}

/** Compatibility manifesto descriptor. */
export interface IntegrationOrchestrationCompatibilityManifest {
  readonly compatibilityManifestId: "EIL-4:5/CompatibilityManifest";
  readonly declarations: readonly OrchestrationCompatibilityDeclaration[];
  readonly declarationCount: number;
  readonly runtimeValidated: false;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministic: true;
}

/** Manifest collections descriptor. */
export interface IntegrationOrchestrationManifestCollections {
  readonly collectionsId: "EIL-4:5/Collections";
  readonly sourcePhase: "EIL-4:5";
  readonly architecture: IntegrationOrchestrationArchitectureManifest;
  readonly inventory: IntegrationOrchestrationInventoryManifest;
  readonly dependency: IntegrationOrchestrationDependencyManifest;
  readonly compatibility: IntegrationOrchestrationCompatibilityManifest;
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
export interface IntegrationOrchestrationManifestInventory {
  readonly inventoryId: "EIL-4:5/ManifestInventory";
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
export interface IntegrationOrchestrationManifestSummary {
  readonly manifestId: "EIL-4:5/IntegrationOrchestrationManifest";
  readonly version: "1.0.0";
  readonly name: "Integration Orchestration Manifest";
  readonly namespace: "nexora.eil.integration-orchestration.manifest";
  readonly status: OrchestrationManifestStatus;
  readonly readiness: OrchestrationManifestReadinessState;
  readonly validationId: "EIL-4:4/IntegrationOrchestrationValidation";
  readonly validationStatus: "Validation";
  readonly dependencySummary: string;
  readonly compatibilitySummary: string;
  readonly foundationCategoryCount: number;
  readonly registryEntryCount: number;
  readonly domainModelCount: number;
  readonly validationRuleCount: number;
  readonly totalInventoryCount: number;
  readonly architecturalCompleteness: true;
  readonly nextPhase: "EIL-4:6 — Integration Orchestration Platform";
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministic: true;
}

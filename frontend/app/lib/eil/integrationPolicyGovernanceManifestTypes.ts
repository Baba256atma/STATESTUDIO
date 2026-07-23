/**
 * EIL-5:5 — Integration Policy & Governance Manifest Types.
 *
 * Readonly contracts and closed vocabularies for the Integration Policy & Governance Manifest.
 * Metadata-only. No runtime behavior.
 *
 * Ownership: owned exclusively by EIL-5:5.
 */

/** Manifest status for EIL-5:5. */
export type PolicyGovernanceManifestStatus = "Manifest";

/** Immediate downstream readiness — Platform only. */
export type PolicyGovernanceManifestReadinessState = "ReadyForPlatform";

/** Closed source-phase vocabulary for lineage references. */
export type PolicyGovernanceManifestSourcePhase =
  | "EIL-5:1"
  | "EIL-5:2"
  | "EIL-5:3"
  | "EIL-5:4"
  | "EIL-5:5";

/** Closed compatibility-scope vocabulary. */
export type PolicyGovernanceManifestCompatibilityScope =
  | "Foundation"
  | "Registry"
  | "Model"
  | "Validation"
  | "Forward"
  | "Version"
  | "Namespace"
  | "Architecture";

/** Closed ownership vocabulary. */
export type PolicyGovernanceManifestOwnership =
  | "EIL-5:5"
  | "EIL-5 Integration Policy & Governance Manifest";

/** Canonical manifest identity. */
export interface IntegrationPolicyGovernanceManifestIdentity {
  readonly phaseId: "EIL-5:5";
  readonly canonicalId: "EIL-5:5/IntegrationPolicyGovernanceManifest";
  readonly name: "Integration Policy & Governance Manifest";
  readonly version: "1.0.0";
  readonly namespace: "nexora.eil.integration-policy-governance.manifest";
  readonly layer: "EIL";
  readonly platform: "EIL-5";
  readonly phaseType: "Manifest";
  readonly status: PolicyGovernanceManifestStatus;
  readonly readiness: PolicyGovernanceManifestReadinessState;
  readonly validationDependency: "EIL-5:4/IntegrationPolicyGovernanceValidation";
  readonly validationEntryPoint: "integrationPolicyGovernanceValidation.ts";
  readonly description: string;
  readonly metadataOnly: true;
  readonly immutable: true;
}

/** Architecture manifesto descriptor. */
export interface IntegrationPolicyGovernanceArchitectureManifest {
  readonly architectureId: "EIL-5:5/Architecture";
  readonly platformIdentity: "EIL-5";
  readonly architectureIdentity: "EIL-5:5/IntegrationPolicyGovernanceManifest";
  readonly namespace: "nexora.eil.integration-policy-governance.manifest";
  readonly version: "1.0.0";
  readonly status: PolicyGovernanceManifestStatus;
  readonly readiness: PolicyGovernanceManifestReadinessState;
  readonly canonicalReferences: readonly string[];
  readonly sourcePhases: readonly PolicyGovernanceManifestSourcePhase[];
  readonly ownership: PolicyGovernanceManifestOwnership;
  readonly architecturalScope: readonly string[];
  readonly releaseLineage: readonly string[];
  readonly ordinal: number;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministic: true;
}

/** Inventory manifesto descriptor with derived counts. */
export interface IntegrationPolicyGovernanceInventoryManifest {
  readonly inventoryId: "EIL-5:5/Inventory";
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
export interface IntegrationPolicyGovernanceDependencyManifest {
  readonly dependencyId: "EIL-5:5/Dependency";
  readonly upstreamDependency: "EIL-5:4/IntegrationPolicyGovernanceValidation";
  readonly dependencyDirection: "Validation → Manifest";
  readonly aggregateEntryPoint: "integrationPolicyGovernanceValidation.ts";
  readonly dependencyScope: "ValidationPublicSurfaceOnly";
  readonly allowedImports: readonly string[];
  readonly prohibitedImports: readonly string[];
  readonly architecturalBoundaries: readonly string[];
  readonly phaseDependencyCount: 1;
  readonly laterEil5PhaseImport: false;
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
export interface PolicyGovernanceCompatibilityDeclaration {
  readonly compatibilityId: `EIL-5:5/Compatibility/${string}`;
  readonly scope: PolicyGovernanceManifestCompatibilityScope;
  readonly canonicalKey: string;
  readonly canonicalName: string;
  readonly description: string;
  readonly sourcePhase: PolicyGovernanceManifestSourcePhase;
  readonly ordinal: number;
  readonly tags: readonly string[];
  readonly runtimeValidated: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}

/** Compatibility manifesto descriptor. */
export interface IntegrationPolicyGovernanceCompatibilityManifest {
  readonly compatibilityManifestId: "EIL-5:5/CompatibilityManifest";
  readonly declarations: readonly PolicyGovernanceCompatibilityDeclaration[];
  readonly declarationCount: number;
  readonly runtimeValidated: false;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministic: true;
}

/** Manifest collections descriptor. */
export interface IntegrationPolicyGovernanceManifestCollections {
  readonly collectionsId: "EIL-5:5/Collections";
  readonly sourcePhase: "EIL-5:5";
  readonly architecture: IntegrationPolicyGovernanceArchitectureManifest;
  readonly inventory: IntegrationPolicyGovernanceInventoryManifest;
  readonly dependency: IntegrationPolicyGovernanceDependencyManifest;
  readonly compatibility: IntegrationPolicyGovernanceCompatibilityManifest;
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
export interface IntegrationPolicyGovernanceManifestInventory {
  readonly inventoryId: "EIL-5:5/ManifestInventory";
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
export interface IntegrationPolicyGovernanceManifestSummary {
  readonly manifestId: "EIL-5:5/IntegrationPolicyGovernanceManifest";
  readonly version: "1.0.0";
  readonly name: "Integration Policy & Governance Manifest";
  readonly namespace: "nexora.eil.integration-policy-governance.manifest";
  readonly status: PolicyGovernanceManifestStatus;
  readonly readiness: PolicyGovernanceManifestReadinessState;
  readonly validationId: "EIL-5:4/IntegrationPolicyGovernanceValidation";
  readonly validationStatus: "Validation";
  readonly dependencySummary: string;
  readonly compatibilitySummary: string;
  readonly foundationCategoryCount: number;
  readonly registryEntryCount: number;
  readonly domainModelCount: number;
  readonly validationRuleCount: number;
  readonly totalInventoryCount: number;
  readonly architecturalCompleteness: true;
  readonly nextPhase: "EIL-5:6 — Integration Policy & Governance Platform";
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministic: true;
}

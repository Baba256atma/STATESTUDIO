/**
 * NEA-8:3 — Executive Gateway Suite Model Types.
 *
 * Strongly typed immutable domain model contracts for the Executive Gateway Suite.
 * Consumes Registry declarations by reference only. Metadata-only.
 *
 * Ownership: owned exclusively by NEA-8:3.
 */

/** Model status for NEA-8:3. */
export type ExecutiveGatewaySuiteModelStatus = "Model";

/** Immediate downstream readiness — Validation only. */
export type ExecutiveGatewaySuiteModelReadiness = "ReadyForValidation";

/** Canonical domain model kind identifiers — exactly twenty. */
export type ExecutiveGatewaySuiteModelKind =
  | "SuiteIdentity"
  | "SuiteComponent"
  | "SuiteComponentIdentity"
  | "SuiteComposition"
  | "SuiteDependency"
  | "SuiteCapability"
  | "SuiteContract"
  | "SuiteLifecycle"
  | "SuitePolicy"
  | "SuiteInventory"
  | "SuiteMetadata"
  | "SuiteStatus"
  | "SuiteVersion"
  | "SuiteReadiness"
  | "SuiteRelationship"
  | "SuiteValidationTarget"
  | "SuitePlatformReference"
  | "SuitePublicApiInventory"
  | "SuiteSummary"
  | "ExecutiveGatewaySuite";

/** Model-phase lifecycle states for domain model artifacts. */
export type ExecutiveGatewaySuiteModelLifecycleState =
  | "Declared"
  | "Composed"
  | "Verified"
  | "Published"
  | "Referenced"
  | "Retired";

/** Registry collection names referenced by models. */
export type ExecutiveGatewaySuiteRegistryCollectionName =
  | "components"
  | "componentIdentities"
  | "dependencies"
  | "statuses"
  | "contracts"
  | "lifecycleEntries"
  | "capabilities"
  | "registryPolicies"
  | "publicApiInventory";

/** Domain model kind descriptor. */
export interface ExecutiveGatewaySuiteModelKindDescriptor {
  readonly modelKind: ExecutiveGatewaySuiteModelKind;
  readonly modelName: string;
  readonly description: string;
  readonly registryCollections: readonly ExecutiveGatewaySuiteRegistryCollectionName[];
  readonly fieldCount: number;
  readonly composesModels: readonly ExecutiveGatewaySuiteModelKind[];
  readonly executesRuntime: false;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministicOrder: number;
}

/** Model relationship declaration. */
export interface ExecutiveGatewaySuiteModelRelationship {
  readonly relationshipId: string;
  readonly relationshipName: string;
  readonly sourceModelKind: ExecutiveGatewaySuiteModelKind;
  readonly targetModelKind: ExecutiveGatewaySuiteModelKind;
  readonly cardinality: "one-to-one" | "one-to-many" | "many-to-one";
  readonly required: boolean;
  readonly description: string;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministicOrder: number;
}

/**
 * Suite Component Model — structure only.
 * Projected from Registry component registrations.
 */
export interface SuiteComponentModel {
  readonly modelKind: "SuiteComponent";
  readonly componentId: string;
  readonly componentName: string;
  readonly stageId: string;
  readonly publicIndexId: string;
  readonly publicIndexVersion: string;
  readonly publicIndexNamespace: string;
  readonly publicApiCount: number;
  readonly publicPlatform: unknown;
  readonly registryComponentRef: string;
  readonly ownership: "Referenced";
  readonly executesRuntime: false;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministicOrder: number;
}

/**
 * Suite Component Identity Model — structure only.
 * Projected from Registry component identities.
 */
export interface SuiteComponentIdentityModel {
  readonly modelKind: "SuiteComponentIdentity";
  readonly componentId: string;
  readonly componentName: string;
  readonly namespace: string;
  readonly version: string;
  readonly releaseStatus: string;
  readonly certificationStatus: string;
  readonly freezeStatus: string;
  readonly consumerReadiness: string;
  readonly registryIdentityRef: string;
  readonly executesRuntime: false;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministicOrder: number;
}

/**
 * Suite Platform Reference Model — Public Index platform by Registry reference.
 */
export interface SuitePlatformReferenceModel {
  readonly modelKind: "SuitePlatformReference";
  readonly componentId: string;
  readonly publicIndexId: string;
  readonly publicPlatform: unknown;
  readonly registryComponentRef: string;
  readonly preservesCanonicalReference: true;
  readonly executesRuntime: false;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministicOrder: number;
}

/** Canonical model identity. */
export interface ExecutiveGatewaySuiteModelIdentity {
  readonly modelId: string;
  readonly modelName: string;
  readonly modelVersion: string;
  readonly modelNamespace: string;
  readonly layer: "NEA";
  readonly phase: "NEA-8:3";
  readonly stage: "Model";
  readonly sourcePhase: "NEA-8:3";
  readonly owner: string;
  readonly status: ExecutiveGatewaySuiteModelStatus;
  readonly readiness: ExecutiveGatewaySuiteModelReadiness;
  readonly registryId: string;
  readonly registryVersion: string;
  readonly suiteName: "Executive Gateway Suite";
  readonly description: string;
  readonly metadataOnly: true;
  readonly immutable: true;
}

/** Deterministic model summary. */
export interface ExecutiveGatewaySuiteModelSummary {
  readonly modelId: string;
  readonly version: string;
  readonly name: string;
  readonly namespace: string;
  readonly layer: "NEA";
  readonly phase: "NEA-8:3";
  readonly status: ExecutiveGatewaySuiteModelStatus;
  readonly readiness: ExecutiveGatewaySuiteModelReadiness;
  readonly registryId: string;
  readonly suiteName: "Executive Gateway Suite";
  readonly domainModelCount: number;
  readonly suiteComponentModelCount: number;
  readonly relationshipCount: number;
  readonly lifecycleStateCount: number;
  readonly ownershipCount: number;
  readonly nonOwnershipCount: number;
  readonly prohibitedSurfaceCount: number;
  readonly publicApiInventoryTotal: number;
  readonly publicExportCount: number;
  readonly sectionCount: number;
  readonly nextPhase: string;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministic: true;
}

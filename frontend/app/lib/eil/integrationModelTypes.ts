/**
 * EIL-1:3 — Integration Model Types.
 *
 * Readonly contracts and closed vocabularies for the Integration Model.
 * Metadata-only. No runtime enforcement.
 *
 * Ownership: owned exclusively by EIL-1:3.
 */

/** Model status for EIL-1:3. */
export type IntegrationModelStatus = "Model";

/** Immediate downstream readiness — Validation only. */
export type IntegrationModelReadiness = "ReadyForValidation";

/** Closed domain-model category vocabulary. */
export type IntegrationModelCategory =
  | "IntegrationModel"
  | "IntegrationDomain"
  | "IntegrationParticipant"
  | "IntegrationPlatform"
  | "IntegrationContract"
  | "IntegrationCapability"
  | "IntegrationResponsibility"
  | "IntegrationLifecycle"
  | "IntegrationTopology"
  | "IntegrationBoundary"
  | "IntegrationDependency"
  | "IntegrationRoute"
  | "IntegrationExchange"
  | "IntegrationContext"
  | "IntegrationOwnership"
  | "IntegrationCompatibility";

/** Closed relationship-type vocabulary. */
export type IntegrationRelationshipType =
  | "owns"
  | "consumes"
  | "produces"
  | "coordinates"
  | "references"
  | "dependsOn"
  | "compatibleWith"
  | "belongsTo"
  | "participatesIn"
  | "mappedTo"
  | "composedOf"
  | "extends";

/** Closed topology-node vocabulary. */
export type IntegrationTopologyNodeKind =
  | "PlatformNode"
  | "IntegrationNode"
  | "ProducerNode"
  | "ConsumerNode"
  | "CoordinationNode"
  | "BoundaryNode"
  | "RoutingNode"
  | "CompatibilityNode";

/** Closed lifecycle-state vocabulary inherited from Foundation via Registry. */
export type IntegrationModelLifecycleState =
  | "Declared"
  | "Designed"
  | "Verified"
  | "Certified"
  | "Frozen"
  | "Released"
  | "Deprecated"
  | "Retired";

/** Closed model ownership vocabulary. */
export type IntegrationModelOwnership = "EIL-1:3" | "EIL-1 Integration Model";

/** Immutable registry reference — never duplicates registry values. */
export interface IntegrationRegistryReference {
  readonly registryId: "EIL-1:2/IntegrationRegistry";
  readonly registryNamespace: "nexora.eil.integration.registry";
  readonly entryPoint: "integrationRegistry.ts";
  readonly collection:
    | "types"
    | "contracts"
    | "capabilities"
    | "responsibilities"
    | "lifecycleCoverage"
    | "categories"
    | "collections";
  readonly entryKey: string;
  readonly preservesCanonicalReference: true;
  readonly duplicatesRegistryValue: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}

/** Base immutable domain model descriptor. */
export interface IntegrationDomainModel {
  readonly modelId: `EIL-1:3/Model/${string}`;
  readonly canonicalKey: string;
  readonly canonicalName: string;
  readonly description: string;
  readonly category: IntegrationModelCategory;
  readonly sourceRegistryReference: IntegrationRegistryReference;
  readonly ownership: IntegrationModelOwnership;
  readonly lifecycle: IntegrationModelLifecycleState;
  readonly version: "1.0.0";
  readonly ordinal: number;
  readonly tags: readonly string[];
  readonly executesRuntime: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}

/** Immutable relationship model. */
export interface IntegrationRelationshipModel {
  readonly relationshipId: `EIL-1:3/Relationship/${string}`;
  readonly relationshipType: IntegrationRelationshipType;
  readonly canonicalKey: string;
  readonly canonicalName: string;
  readonly description: string;
  readonly sourceModelKey: string;
  readonly targetModelKey: string;
  readonly sourceRegistryReference: IntegrationRegistryReference;
  readonly ownership: IntegrationModelOwnership;
  readonly lifecycle: IntegrationModelLifecycleState;
  readonly version: "1.0.0";
  readonly ordinal: number;
  readonly tags: readonly string[];
  readonly resolvesRuntime: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}

/** Immutable topology model. */
export interface IntegrationTopologyModel {
  readonly topologyId: `EIL-1:3/Topology/${string}`;
  readonly nodeKind: IntegrationTopologyNodeKind;
  readonly canonicalKey: string;
  readonly canonicalName: string;
  readonly description: string;
  readonly sourceRegistryReference: IntegrationRegistryReference;
  readonly ownership: IntegrationModelOwnership;
  readonly lifecycle: IntegrationModelLifecycleState;
  readonly version: "1.0.0";
  readonly ordinal: number;
  readonly tags: readonly string[];
  readonly graphEngine: false;
  readonly routingEngine: false;
  readonly visualization: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}

/** Immutable lifecycle model mapping. */
export interface IntegrationLifecycleModel {
  readonly lifecycleModelId: `EIL-1:3/Lifecycle/${IntegrationModelLifecycleState}`;
  readonly state: IntegrationModelLifecycleState;
  readonly canonicalKey: string;
  readonly canonicalName: string;
  readonly description: string;
  readonly sourceRegistryReference: IntegrationRegistryReference;
  readonly ownership: IntegrationModelOwnership;
  readonly version: "1.0.0";
  readonly ordinal: number;
  readonly tags: readonly string[];
  readonly executesTransitions: false;
  readonly runtimeStateMachine: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}

/** Immutable dependency model. */
export interface IntegrationDependencyModel {
  readonly dependencyModelId: "EIL-1:3/Dependency/RegistryOnly";
  readonly registryOnly: true;
  readonly registryId: "EIL-1:2/IntegrationRegistry";
  readonly entryPoint: "integrationRegistry.ts";
  readonly laterEilPhaseImport: false;
  readonly foundationDirectImport: false;
  readonly registryInternalImport: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}

/** Immutable boundary model. */
export interface IntegrationBoundaryModel {
  readonly boundaryModelId: "EIL-1:3/Boundary/Model";
  readonly owns: readonly string[];
  readonly doesNotOwn: readonly string[];
  readonly metadataOnly: true;
  readonly immutable: true;
}

/** Immutable platform model descriptor. */
export interface IntegrationPlatformModel {
  readonly platformModelId: "EIL-1:3/Platform/IntegrationModel";
  readonly status: IntegrationModelStatus;
  readonly readiness: IntegrationModelReadiness;
  readonly metadataOnly: true;
  readonly immutable: true;
}

/** Aggregate model inventory. */
export interface IntegrationModelInventory {
  readonly inventoryId: "EIL-1:3/Inventory";
  readonly domainModelCount: number;
  readonly relationshipCount: number;
  readonly topologyCount: number;
  readonly lifecycleCount: number;
  readonly totalModelEntryCount: number;
  readonly countsDerivedFromCollections: true;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministic: true;
}

/** Canonical model identity descriptor. */
export interface IntegrationModelIdentityDescriptor {
  readonly phaseId: "EIL-1:3";
  readonly canonicalId: "EIL-1:3/IntegrationModel";
  readonly name: "Integration Model";
  readonly version: "1.0.0";
  readonly namespace: "nexora.eil.integration.model";
  readonly layer: "EIL";
  readonly platform: "EIL-1";
  readonly phaseType: "Model";
  readonly status: IntegrationModelStatus;
  readonly readiness: IntegrationModelReadiness;
  readonly registryDependency: "EIL-1:2/IntegrationRegistry";
  readonly registryEntryPoint: "integrationRegistry.ts";
  readonly description: string;
  readonly metadataOnly: true;
  readonly immutable: true;
}

/** Aggregate model summary. */
export interface IntegrationModelSummaryDescriptor {
  readonly modelId: "EIL-1:3/IntegrationModel";
  readonly version: "1.0.0";
  readonly name: "Integration Model";
  readonly namespace: "nexora.eil.integration.model";
  readonly status: IntegrationModelStatus;
  readonly readiness: IntegrationModelReadiness;
  readonly registryId: "EIL-1:2/IntegrationRegistry";
  readonly domainModelCount: number;
  readonly relationshipCount: number;
  readonly topologyCount: number;
  readonly lifecycleCount: number;
  readonly totalModelEntryCount: number;
  readonly nextPhase: "EIL-1:4 — Integration Validation";
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministic: true;
}

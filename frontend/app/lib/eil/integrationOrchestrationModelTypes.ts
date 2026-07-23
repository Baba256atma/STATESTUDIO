/**
 * EIL-4:3 — Integration Orchestration Model Types.
 *
 * Readonly contracts and closed vocabularies for the Integration Orchestration Model.
 * Metadata-only. No runtime enforcement.
 *
 * Ownership: owned exclusively by EIL-4:3.
 */

/** Model status for EIL-4:3. */
export type OrchestrationModelStatus = "Model";

/** Immediate downstream readiness — Validation only. */
export type OrchestrationModelReadiness = "ReadyForValidation";

/** Closed domain-model category vocabulary. */
export type OrchestrationDomainModelKey =
  | "Orchestration"
  | "Flow"
  | "FlowStep"
  | "Transition"
  | "Trigger"
  | "Dependency"
  | "State"
  | "Completion"
  | "Failure"
  | "Recovery"
  | "Compensation"
  | "Approval"
  | "RouteReference"
  | "ConnectorReference"
  | "ExecutionContext"
  | "OrchestrationBoundary";

/** Closed relationship-type vocabulary. */
export type OrchestrationRelationshipType =
  | "owns"
  | "references"
  | "dependsOn"
  | "compatibleWith"
  | "mappedTo"
  | "composedOf"
  | "belongsTo"
  | "transitionsTo"
  | "triggeredBy"
  | "coordinates"
  | "recoversFrom"
  | "extends";

/** Closed topology-model vocabulary. */
export type OrchestrationTopologyKey =
  | "Linear"
  | "Sequential"
  | "Parallel"
  | "Tree"
  | "Mesh"
  | "Hub"
  | "Composite"
  | "Executive";

/** Closed lifecycle-state vocabulary. */
export type OrchestrationModelLifecycleState =
  | "Declared"
  | "Designed"
  | "Verified"
  | "Certified"
  | "Frozen"
  | "Released"
  | "Deprecated"
  | "Retired";

/** Closed model ownership vocabulary. */
export type OrchestrationModelOwnership =
  | "EIL-4:3"
  | "EIL-4 Integration Orchestration Model";

/** Immutable registry reference — never duplicates registry values. */
export interface OrchestrationRegistryReference {
  readonly registryId: "EIL-4:2/IntegrationOrchestrationRegistry";
  readonly registryNamespace: "nexora.eil.integration-orchestration.registry";
  readonly entryPoint: "integrationOrchestrationRegistry.ts";
  readonly collection:
    | "categories"
    | "contracts"
    | "capabilities"
    | "responsibilities"
    | "lifecycleCoverage"
    | "ownershipCoverage"
    | "collections";
  readonly entryKey: string;
  readonly preservesCanonicalReference: true;
  readonly duplicatesRegistryValue: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}

/** Base immutable domain model descriptor. */
export interface IntegrationOrchestrationDomainModel {
  readonly modelId: `EIL-4:3/Model/${OrchestrationDomainModelKey}`;
  readonly canonicalKey: OrchestrationDomainModelKey;
  readonly canonicalName: string;
  readonly description: string;
  readonly ownership: OrchestrationModelOwnership;
  readonly lifecycle: OrchestrationModelLifecycleState;
  readonly sourceRegistryReference: OrchestrationRegistryReference;
  readonly sourceReference: string;
  readonly version: "1.0.0";
  readonly ordinal: number;
  readonly tags: readonly string[];
  readonly executesRuntime: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}

/** Immutable relationship model. */
export interface IntegrationOrchestrationRelationshipModel {
  readonly relationshipId: `EIL-4:3/Relationship/${string}`;
  readonly relationshipType: OrchestrationRelationshipType;
  readonly canonicalKey: string;
  readonly canonicalName: string;
  readonly description: string;
  readonly sourceModel: OrchestrationDomainModelKey;
  readonly targetModel: OrchestrationDomainModelKey;
  readonly ownership: OrchestrationModelOwnership;
  readonly lifecycle: OrchestrationModelLifecycleState;
  readonly sourceRegistryReference: OrchestrationRegistryReference;
  readonly sourceReference: string;
  readonly version: "1.0.0";
  readonly ordinal: number;
  readonly tags: readonly string[];
  readonly resolvesRuntime: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}

/** Immutable topology model. */
export interface IntegrationOrchestrationTopologyModel {
  readonly topologyModelId: `EIL-4:3/Topology/${OrchestrationTopologyKey}`;
  readonly canonicalKey: OrchestrationTopologyKey;
  readonly canonicalName: string;
  readonly description: string;
  readonly ownership: OrchestrationModelOwnership;
  readonly lifecycle: OrchestrationModelLifecycleState;
  readonly sourceRegistryReference: OrchestrationRegistryReference;
  readonly sourceReference: string;
  readonly version: "1.0.0";
  readonly ordinal: number;
  readonly tags: readonly string[];
  readonly graphEngine: false;
  readonly orchestrationEngine: false;
  readonly visualization: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}

/** Immutable lifecycle mapping model. */
export interface IntegrationOrchestrationLifecycleModel {
  readonly lifecycleModelId: `EIL-4:3/Lifecycle/${OrchestrationModelLifecycleState}`;
  readonly canonicalKey: OrchestrationModelLifecycleState;
  readonly canonicalName: string;
  readonly description: string;
  readonly ownership: OrchestrationModelOwnership;
  readonly lifecycle: OrchestrationModelLifecycleState;
  readonly sourceRegistryReference: OrchestrationRegistryReference;
  readonly sourceReference: string;
  readonly version: "1.0.0";
  readonly ordinal: number;
  readonly tags: readonly string[];
  readonly executesTransitions: false;
  readonly runtimeStateMachine: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}

/** Canonical model identity descriptor. */
export interface IntegrationOrchestrationModelIdentity {
  readonly phaseId: "EIL-4:3";
  readonly canonicalId: "EIL-4:3/IntegrationOrchestrationModel";
  readonly name: "Integration Orchestration Model";
  readonly version: "1.0.0";
  readonly namespace: "nexora.eil.integration-orchestration.model";
  readonly layer: "EIL";
  readonly platform: "EIL-4";
  readonly phaseType: "Model";
  readonly status: OrchestrationModelStatus;
  readonly readiness: OrchestrationModelReadiness;
  readonly registryDependency: "EIL-4:2/IntegrationOrchestrationRegistry";
  readonly registryEntryPoint: "integrationOrchestrationRegistry.ts";
  readonly description: string;
  readonly metadataOnly: true;
  readonly immutable: true;
}

/** Aggregate model collections. */
export interface IntegrationOrchestrationModelCollections {
  readonly collectionsId: "EIL-4:3/Collections";
  readonly sourcePhase: "EIL-4:3";
  readonly domains: readonly IntegrationOrchestrationDomainModel[];
  readonly relationships: readonly IntegrationOrchestrationRelationshipModel[];
  readonly topologies: readonly IntegrationOrchestrationTopologyModel[];
  readonly lifecycles: readonly IntegrationOrchestrationLifecycleModel[];
  readonly domainModelCount: number;
  readonly relationshipCount: number;
  readonly topologyCount: number;
  readonly lifecycleCount: number;
  readonly totalModelEntryCount: number;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministic: true;
}

/** Aggregate model inventory. */
export interface IntegrationOrchestrationModelInventory {
  readonly inventoryId: "EIL-4:3/Inventory";
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

/** Aggregate model summary. */
export interface IntegrationOrchestrationModelSummary {
  readonly modelId: "EIL-4:3/IntegrationOrchestrationModel";
  readonly version: "1.0.0";
  readonly name: "Integration Orchestration Model";
  readonly namespace: "nexora.eil.integration-orchestration.model";
  readonly status: OrchestrationModelStatus;
  readonly readiness: OrchestrationModelReadiness;
  readonly registryId: "EIL-4:2/IntegrationOrchestrationRegistry";
  readonly domainModelCount: number;
  readonly relationshipCount: number;
  readonly topologyCount: number;
  readonly lifecycleCount: number;
  readonly totalModelEntryCount: number;
  readonly nextPhase: "EIL-4:4 — Integration Orchestration Validation";
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministic: true;
}

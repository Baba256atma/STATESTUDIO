/**
 * EIL-4:1 — Integration Orchestration Foundation Types.
 *
 * Readonly contracts and closed vocabularies for the Integration Orchestration Platform.
 * Metadata-only. No runtime orchestration enforcement.
 *
 * Ownership: owned exclusively by EIL-4:1.
 */

export type OrchestrationFoundationStatus = "Foundation";

export type OrchestrationFoundationReadiness = "ReadyForRegistry";

export type OrchestrationLifecycleState =
  | "Declared"
  | "Designed"
  | "Verified"
  | "Certified"
  | "Frozen"
  | "Released"
  | "Deprecated"
  | "Retired";

export type OrchestrationCategoryKey =
  | "SequentialFlow"
  | "ParallelFlow"
  | "ConditionalFlow"
  | "EventDrivenFlow"
  | "ScheduledFlow"
  | "ApprovalFlow"
  | "RecoveryFlow"
  | "CompensationFlow"
  | "CompositeFlow"
  | "ExecutiveFlow";

export type OrchestrationContractName =
  | "OrchestrationContract"
  | "FlowContract"
  | "StepContract"
  | "TransitionContract"
  | "TriggerContract"
  | "DependencyContract"
  | "CompletionContract"
  | "FailureContract"
  | "StateContract"
  | "MetadataContract";

export type OrchestrationCapabilityId =
  | "FlowDescription"
  | "StepDescription"
  | "DependencyDeclaration"
  | "TransitionDescription"
  | "StateDescription"
  | "TriggerDeclaration"
  | "CompletionDeclaration"
  | "FailureDeclaration"
  | "InventorySupport"
  | "OrchestrationReadiness";

export type OrchestrationResponsibilityId =
  | "PreserveOrchestrationIdentity"
  | "PreserveArchitecturalBoundaries"
  | "PublishOrchestrationMetadata"
  | "PreserveDependencyDirection"
  | "PreserveCompatibility"
  | "PreserveDeterministicInventories"
  | "SupportFutureRuntimePlatforms"
  | "PreserveArchitecturalConsistency";

/** Canonical orchestration foundation identity. */
export interface OrchestrationIdentity {
  readonly foundationId: "EIL-4:1/IntegrationOrchestrationFoundation";
  readonly foundationName: "Integration Orchestration Foundation";
  readonly foundationVersion: "1.0.0";
  readonly foundationNamespace: "nexora.eil.integration-orchestration.foundation";
  readonly layer: "EIL";
  readonly platform: "EIL-4";
  readonly phaseId: "EIL-4:1";
  readonly phaseType: "Foundation";
  readonly owner: "EIL-4 Integration Orchestration Foundation";
  readonly status: OrchestrationFoundationStatus;
  readonly readiness: OrchestrationFoundationReadiness;
  readonly description: string;
  readonly metadataOnly: true;
  readonly immutable: true;
}

/** Immutable orchestration category declaration. */
export interface OrchestrationCategory {
  readonly categoryId: `EIL-4:1/Category/${OrchestrationCategoryKey}`;
  readonly categoryKey: OrchestrationCategoryKey;
  readonly canonicalName: string;
  readonly description: string;
  readonly runtimeImplemented: false;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministicOrder: number;
}

/** Immutable orchestration contract declaration. */
export interface OrchestrationContract {
  readonly contractId: `EIL-4:1/Contract/${OrchestrationContractName}`;
  readonly contractName: OrchestrationContractName;
  readonly canonicalName: string;
  readonly description: string;
  readonly fields: readonly string[];
  readonly runtimeBehavior: "None";
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministicOrder: number;
}

/** Descriptive orchestration capability declaration. */
export interface OrchestrationCapability {
  readonly capabilityId: `EIL-4:1/Capability/${OrchestrationCapabilityId}`;
  readonly capabilityKey: OrchestrationCapabilityId;
  readonly capabilityName: string;
  readonly description: string;
  readonly ownedByEil4: true;
  readonly executesRuntime: false;
  readonly performsOrchestration: false;
  readonly performsNetworking: false;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministicOrder: number;
}

/** Descriptive orchestration responsibility declaration. */
export interface OrchestrationResponsibility {
  readonly responsibilityId: OrchestrationResponsibilityId;
  readonly responsibilityName: string;
  readonly description: string;
  readonly ownedByEil4: true;
  readonly executesRuntime: false;
  readonly performsBusinessLogic: false;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministicOrder: number;
}

/** Lifecycle catalog declaration. */
export interface OrchestrationLifecycle {
  readonly lifecycleId: "EIL-4:1/IntegrationOrchestrationLifecycle";
  readonly sourcePhase: "EIL-4:1";
  readonly states: readonly OrchestrationLifecycleState[];
  readonly stateCount: number;
  readonly transitions: Readonly<
    Record<OrchestrationLifecycleState, readonly OrchestrationLifecycleState[]>
  >;
  readonly currentState: "Verified";
  readonly foundationReadiness: OrchestrationFoundationReadiness;
  readonly executesTransitions: false;
  readonly runtimeStateMachine: false;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministic: true;
}

/** Deterministic foundation summary. */
export interface OrchestrationFoundationSummary {
  readonly foundationId: "EIL-4:1/IntegrationOrchestrationFoundation";
  readonly version: "1.0.0";
  readonly name: "Integration Orchestration Foundation";
  readonly namespace: "nexora.eil.integration-orchestration.foundation";
  readonly status: OrchestrationFoundationStatus;
  readonly readiness: OrchestrationFoundationReadiness;
  readonly orchestrationCategoryCount: number;
  readonly contractCount: number;
  readonly capabilityCount: number;
  readonly responsibilityCount: number;
  readonly lifecycleStateCount: number;
  readonly ownershipCount: number;
  readonly nonOwnershipCount: number;
  readonly terminologyCount: number;
  readonly sectionCount: number;
  readonly nextPhase: string;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministic: true;
}

/** Deterministic foundation inventory. */
export interface OrchestrationFoundationInventory {
  readonly inventoryId: "EIL-4:1/Inventory";
  readonly orchestrationCategoryCount: number;
  readonly contractCount: number;
  readonly capabilityCount: number;
  readonly responsibilityCount: number;
  readonly lifecycleStateCount: number;
  readonly totalFoundationEntryCount: number;
  readonly countsDerivedFromCollections: true;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministic: true;
}

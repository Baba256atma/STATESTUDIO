export type ExecutiveOrchestrationRegistryOwner = "ENG-8";
export type ExecutiveOrchestrationRegistryVersion = "1.0.0";
export type ExecutiveOrchestrationRegistryPhase = "ENG-8:2";
export type ExecutiveOrchestrationRegistryNamespace =
  "nexora.engine.executive.orchestration.registry";

export type ExecutiveOrchestrationRegistryEntryKind =
  | "Component"
  | "CoordinationTarget"
  | "Capability"
  | "LifecycleStage"
  | "Dependency"
  | "Responsibility"
  | "ExecutionMode"
  | "RoutingRelationship";

export type ExecutiveOrchestrationRegistryStatus =
  | "Registered"
  | "Stable"
  | "ReadyForModel";

export type ExecutiveOrchestrationExecutionMode =
  | "Sequential"
  | "Parallel"
  | "Conditional"
  | "Synchronized"
  | "Aggregated"
  | "Handoff";

export type ExecutiveOrchestrationRoutingDirection =
  | "Forward"
  | "Handoff"
  | "External";

export type ExecutiveOrchestrationOwnershipRole =
  | "PrimaryOwner"
  | "SupportingParticipant";

export type ExecutiveOrchestrationComponentId =
  | "pipeline-orchestrator"
  | "engine-coordinator"
  | "dependency-coordinator"
  | "execution-sequence-coordinator"
  | "parallel-coordination-descriptor"
  | "context-propagation-coordinator"
  | "result-aggregator"
  | "completion-coordinator"
  | "failure-routing-coordinator"
  | "advisor-handoff-coordinator"
  | "bus-coordination-gateway"
  | "ops-coordination-gateway";

export type ExecutiveOrchestrationCoordinationTargetId =
  | "executive-request"
  | "intent-resolution"
  | "context-assembly"
  | "planning"
  | "reasoning"
  | "decision"
  | "bus-platforms"
  | "ops-platforms"
  | "advisor";

export type ExecutiveOrchestrationCapabilityId =
  | "sequential-orchestration"
  | "parallel-orchestration"
  | "dependency-resolution"
  | "result-aggregation"
  | "failure-propagation"
  | "completion-synchronization"
  | "advisor-routing"
  | "pipeline-coordination";

export type ExecutiveOrchestrationLifecycleStageId =
  | "Idle"
  | "ReceiveRequest"
  | "PreparePipeline"
  | "ResolveDependencies"
  | "CoordinateExecution"
  | "AggregateResults"
  | "PrepareResponse"
  | "Complete";

export type ExecutiveOrchestrationDependencyId =
  | "eng-1-public-api"
  | "eng-2-public-api"
  | "eng-3-public-api"
  | "eng-4-public-api"
  | "eng-5-public-api"
  | "eng-6-public-api"
  | "eng-7-public-api"
  | "bus-public-apis"
  | "ops-public-apis"
  | "advisor-public-apis";

export type ExecutiveOrchestrationResponsibilityId =
  | "pipeline-orchestration"
  | "execution-ordering"
  | "component-coordination"
  | "context-propagation"
  | "dependency-coordination"
  | "parallel-execution-declaration"
  | "sequential-execution-declaration"
  | "result-aggregation"
  | "completion-routing"
  | "failure-routing"
  | "advisor-handoff"
  | "engine-synchronization";

export type ExecutiveOrchestrationRegistryEntryId =
  | `eng-8-comp-${ExecutiveOrchestrationComponentId}`
  | `eng-8-coord-${ExecutiveOrchestrationCoordinationTargetId}`
  | `eng-8-cap-${ExecutiveOrchestrationCapabilityId}`
  | `eng-8-life-${ExecutiveOrchestrationLifecycleStageId}`
  | `eng-8-dep-${ExecutiveOrchestrationDependencyId}`
  | `eng-8-resp-${ExecutiveOrchestrationResponsibilityId}`
  | `eng-8-mode-${ExecutiveOrchestrationExecutionMode}`
  | `eng-8-route-${string}`;

export interface ExecutiveOrchestrationResponsibilityOwnership {
  readonly responsibilityId: ExecutiveOrchestrationResponsibilityId;
  readonly role: ExecutiveOrchestrationOwnershipRole;
  readonly metadataOnly: true;
  readonly immutable: true;
}

export interface ExecutiveOrchestrationComponentEntry {
  readonly id: `eng-8-comp-${ExecutiveOrchestrationComponentId}`;
  readonly componentId: ExecutiveOrchestrationComponentId;
  readonly name: string;
  readonly description: string;
  readonly kind: "Component";
  readonly ownedResponsibilities: readonly ExecutiveOrchestrationResponsibilityOwnership[];
  readonly coordinationTargets: readonly ExecutiveOrchestrationCoordinationTargetId[];
  readonly supportedCapabilities: readonly ExecutiveOrchestrationCapabilityId[];
  readonly executionModes: readonly ExecutiveOrchestrationExecutionMode[];
  readonly lifecycleParticipation: readonly ExecutiveOrchestrationLifecycleStageId[];
  readonly dependencyIds: readonly ExecutiveOrchestrationDependencyId[];
  readonly status: "Registered";
  readonly metadataOnly: true;
  readonly runtimeFree: true;
  readonly immutable: true;
}

export interface ExecutiveOrchestrationCoordinationEntry {
  readonly id: `eng-8-coord-${ExecutiveOrchestrationCoordinationTargetId}`;
  readonly targetId: ExecutiveOrchestrationCoordinationTargetId;
  readonly name: string;
  readonly category: "EngineStage" | "BusinessPlatform" | "OperationsPlatform" | "ResponseSurface";
  readonly sourcePhase: string;
  readonly allowedInboundRelationships: readonly ExecutiveOrchestrationCoordinationTargetId[];
  readonly allowedOutboundRelationships: readonly ExecutiveOrchestrationCoordinationTargetId[];
  readonly supportedExecutionModes: readonly ExecutiveOrchestrationExecutionMode[];
  readonly requiredPublicSurface: string;
  readonly status: "Registered";
  readonly kind: "CoordinationTarget";
  readonly metadataOnly: true;
  readonly runtimeFree: true;
  readonly immutable: true;
}

export interface ExecutiveOrchestrationCapabilityEntry {
  readonly id: `eng-8-cap-${ExecutiveOrchestrationCapabilityId}`;
  readonly capabilityId: ExecutiveOrchestrationCapabilityId;
  readonly name: string;
  readonly description: string;
  readonly kind: "Capability";
  readonly ownerComponentId: ExecutiveOrchestrationComponentId;
  readonly supportedTargetIds: readonly ExecutiveOrchestrationCoordinationTargetId[];
  readonly supportedExecutionModes: readonly ExecutiveOrchestrationExecutionMode[];
  readonly requiredDependencyIds: readonly ExecutiveOrchestrationDependencyId[];
  readonly lifecycleStageIds: readonly ExecutiveOrchestrationLifecycleStageId[];
  readonly metadataOnly: true;
  readonly runtimeFree: true;
  readonly immutable: true;
  readonly status: "Registered";
}

export interface ExecutiveOrchestrationLifecycleEntry {
  readonly id: `eng-8-life-${ExecutiveOrchestrationLifecycleStageId}`;
  readonly stageId: ExecutiveOrchestrationLifecycleStageId;
  readonly name: string;
  readonly sequence: number;
  readonly description: string;
  readonly previousStageId: ExecutiveOrchestrationLifecycleStageId | null;
  readonly nextStageId: ExecutiveOrchestrationLifecycleStageId | null;
  readonly participatingComponentIds: readonly ExecutiveOrchestrationComponentId[];
  readonly allowedCapabilityIds: readonly ExecutiveOrchestrationCapabilityId[];
  readonly terminal: boolean;
  readonly kind: "LifecycleStage";
  readonly status: "Registered";
  readonly metadataOnly: true;
  readonly runtimeFree: true;
  readonly immutable: true;
}

export interface ExecutiveOrchestrationDependencyEntry {
  readonly id: `eng-8-dep-${ExecutiveOrchestrationDependencyId}`;
  readonly dependencyId: ExecutiveOrchestrationDependencyId;
  readonly name: string;
  readonly category: "EnginePublicApi" | "BusinessPublicApi" | "OperationsPublicApi" | "AdvisorPublicApi";
  readonly namespace: string;
  readonly relationship: "AllowedPublicDependency";
  readonly required: boolean;
  readonly allowedUsage: readonly string[];
  readonly forbiddenUsage: readonly string[];
  readonly publicApiOnly: true;
  readonly runtimeInvocationAllowed: false;
  readonly kind: "Dependency";
  readonly status: "Registered";
  readonly metadataOnly: true;
  readonly runtimeFree: true;
  readonly immutable: true;
}

export interface ExecutiveOrchestrationExecutionModeEntry {
  readonly id: `eng-8-mode-${ExecutiveOrchestrationExecutionMode}`;
  readonly modeId: ExecutiveOrchestrationExecutionMode;
  readonly name: string;
  readonly description: string;
  readonly kind: "ExecutionMode";
  readonly status: "Registered";
  readonly metadataOnly: true;
  readonly runtimeFree: true;
  readonly immutable: true;
  readonly executesMode: false;
}

export interface ExecutiveOrchestrationRoutingEntry {
  readonly id: ExecutiveOrchestrationRegistryEntryId;
  readonly name: string;
  readonly sourceTargetId: ExecutiveOrchestrationCoordinationTargetId;
  readonly destinationTargetId: ExecutiveOrchestrationCoordinationTargetId;
  readonly direction: ExecutiveOrchestrationRoutingDirection;
  readonly kind: "RoutingRelationship";
  readonly status: "Registered";
  readonly metadataOnly: true;
  readonly runtimeFree: true;
  readonly immutable: true;
  readonly executesRouting: false;
}

export interface ExecutiveOrchestrationResponsibilityEntry {
  readonly id: `eng-8-resp-${ExecutiveOrchestrationResponsibilityId}`;
  readonly responsibilityId: ExecutiveOrchestrationResponsibilityId;
  readonly name: string;
  readonly primaryOwnerComponentId: ExecutiveOrchestrationComponentId;
  readonly supportingComponentIds: readonly ExecutiveOrchestrationComponentId[];
  readonly kind: "Responsibility";
  readonly status: "Registered";
  readonly metadataOnly: true;
  readonly runtimeFree: true;
  readonly immutable: true;
}

export type ExecutiveOrchestrationRegistryEntry =
  | ExecutiveOrchestrationComponentEntry
  | ExecutiveOrchestrationCoordinationEntry
  | ExecutiveOrchestrationCapabilityEntry
  | ExecutiveOrchestrationLifecycleEntry
  | ExecutiveOrchestrationDependencyEntry
  | ExecutiveOrchestrationExecutionModeEntry
  | ExecutiveOrchestrationRoutingEntry
  | ExecutiveOrchestrationResponsibilityEntry;

export interface ExecutiveOrchestrationRegistryMetadata {
  readonly id: "ENG-8:2";
  readonly name: "Executive Orchestration Registry Platform";
  readonly version: ExecutiveOrchestrationRegistryVersion;
  readonly namespace: ExecutiveOrchestrationRegistryNamespace;
  readonly status: "Stable";
  readonly architectureMode: "MetadataOnly";
  readonly immutability: "DeeplyFrozen";
  readonly runtimeBehavior: "None";
  readonly owner: ExecutiveOrchestrationRegistryOwner;
  readonly previousPhase: "ENG-8:1";
  readonly nextPhase: "ENG-8:3";
  readonly readiness: "ReadyForModel";
  readonly metadataOnly: true;
  readonly runtimeFree: true;
  readonly deterministic: true;
  readonly immutable: true;
  readonly deeplyFrozen: true;
  readonly readyForModel: true;
}

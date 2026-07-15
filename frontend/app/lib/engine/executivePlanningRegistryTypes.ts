export type ExecutivePlanningRegistryEntryId = string;
export type ExecutivePlanningRegistryOwner = "ENG-5";
export type ExecutivePlanningRegistryVersion = "1.0.0";
export type ExecutivePlanningRegistryPhase = "ENG-5:2";
export type ExecutivePlanningRegistryNamespace = "nexora.engine.executive.planning.registry";

export type ExecutivePlanningRegistryStatus = "Defined" | "Active" | "Frozen" | "Deprecated";

export type ExecutivePlanningRegistryCategory =
  | "PlanType"
  | "StepType"
  | "DependencyType"
  | "GraphNodeType"
  | "GraphEdgeType"
  | "PriorityLevel"
  | "ParallelPlanningMode"
  | "RetryPlanningStrategy";

export type ExecutivePlanningObjectType =
  | "Plan"
  | "Step"
  | "Dependency"
  | "GraphNode"
  | "GraphEdge"
  | "Priority"
  | "ParallelMode"
  | "RetryStrategy";

export type ExecutivePlanningPlanTypeName =
  | "Analysis Plan"
  | "Decision Plan"
  | "Recommendation Plan"
  | "Scenario Plan"
  | "Execution Preparation Plan"
  | "Monitoring Plan"
  | "Recovery Plan"
  | "Escalation Plan";

export type ExecutivePlanningStepTypeName =
  | "Input Acquisition Step"
  | "Context Preparation Step"
  | "Analysis Step"
  | "Comparison Step"
  | "Validation Step"
  | "Decision Evaluation Step"
  | "Recommendation Preparation Step"
  | "Execution Preparation Step"
  | "Monitoring Preparation Step"
  | "Output Assembly Step";

export type ExecutivePlanningDependencyTypeName =
  | "Data Dependency"
  | "Context Dependency"
  | "Sequential Dependency"
  | "Conditional Dependency"
  | "Validation Dependency"
  | "Decision Dependency"
  | "Resource Dependency"
  | "Temporal Dependency"
  | "Output Dependency";

export type ExecutivePlanningGraphNodeTypeName =
  | "Plan Node"
  | "Step Node"
  | "Decision Node"
  | "Validation Node"
  | "Gateway Node"
  | "Output Node";

export type ExecutivePlanningGraphEdgeTypeName =
  | "Sequence Edge"
  | "Dependency Edge"
  | "Conditional Edge"
  | "Parallel Edge"
  | "Validation Edge"
  | "Retry Edge"
  | "Escalation Edge";

export type ExecutivePlanningPriorityLevelName =
  | "Critical"
  | "High"
  | "Normal"
  | "Low"
  | "Deferred";

export type ExecutivePlanningParallelModeName =
  | "Sequential Only"
  | "Parallel Eligible"
  | "Parallel Preferred"
  | "Parallel Required"
  | "Mutually Exclusive";

export type ExecutivePlanningRetryStrategyName =
  | "No Retry"
  | "Immediate Retry"
  | "Deferred Retry"
  | "Retry with Validation"
  | "Retry with Alternate Step"
  | "Escalate After Failure";

export type ExecutivePlanningDependencyDirection = "Forward" | "Bidirectional";

export type ExecutivePlanningRegistryLifecycleStage =
  | "Created"
  | "Validated"
  | "Prepared"
  | "Frozen"
  | "Released";

export type ExecutivePlanningRegistryVisibility = true | false;

export interface ExecutivePlanningRegistryEntryBase {
  readonly id: ExecutivePlanningRegistryEntryId;
  readonly name: string;
  readonly description: string;
  readonly category: ExecutivePlanningRegistryCategory;
  readonly status: ExecutivePlanningRegistryStatus;
  readonly owner: ExecutivePlanningRegistryOwner;
  readonly lifecycleStages: readonly ExecutivePlanningRegistryLifecycleStage[];
  readonly public: true;
  readonly metadataOnly: true;
  readonly runtimeFree: true;
}

export interface ExecutivePlanningRegistryPlatformMetadata {
  readonly platformId: "ENG-5:2";
  readonly name: "Executive Planning Registry Platform";
  readonly version: ExecutivePlanningRegistryVersion;
  readonly namespace: ExecutivePlanningRegistryNamespace;
  readonly description: string;
  readonly status: Readonly<{
    registry: "Registry";
    metadataOnly: "MetadataOnly";
    runtimeFree: "RuntimeFree";
    immutable: "Immutable";
    deterministic: "Deterministic";
  }>;
  readonly dependencyOnEng51: "executivePlanningIndex.ts";
  readonly ownership: "ENG-5";
  readonly metadataOnly: true;
  readonly runtimeFree: true;
  readonly deterministic: true;
  readonly readinessForModel: "ReadyForModel";
  readonly nextPhase: "ENG-5:3";
  readonly planTypeCount: 8;
  readonly stepTypeCount: 10;
  readonly dependencyTypeCount: 9;
  readonly graphNodeCount: 6;
  readonly graphEdgeCount: 7;
  readonly priorityCount: 5;
  readonly parallelModeCount: 5;
  readonly retryStrategyCount: 6;
  readonly totalRegistryEntryCount: 56;
}

export interface ExecutivePlanTypeEntry extends ExecutivePlanningRegistryEntryBase {
  readonly category: "PlanType";
  readonly objectType: "Plan";
  readonly purpose: string;
  readonly supportedPlanningCapabilities: readonly string[];
  readonly expectedPlanningOutputs: readonly string[];
}

export interface ExecutivePlanningStepTypeEntry extends ExecutivePlanningRegistryEntryBase {
  readonly category: "StepType";
  readonly objectType: "Step";
  readonly consumesMetadata: readonly string[];
  readonly producesMetadata: readonly string[];
  readonly mayDependOnPreviousSteps: boolean;
  readonly mayParticipateInParallelPlanning: boolean;
  readonly retryMetadataAllowed: boolean;
  readonly ownershipBoundary: "PlanningMetadataOnly";
}

export interface ExecutivePlanningDependencyTypeEntry extends ExecutivePlanningRegistryEntryBase {
  readonly category: "DependencyType";
  readonly objectType: "Dependency";
  readonly sourceRelationshipMeaning: string;
  readonly targetRelationshipMeaning: string;
  readonly direction: ExecutivePlanningDependencyDirection;
  readonly criticalitySupport: boolean;
  readonly optionalitySupport: boolean;
  readonly ownershipBoundary: "PlanningMetadataOnly";
}

export interface ExecutivePlanningGraphNodeTypeEntry extends ExecutivePlanningRegistryEntryBase {
  readonly category: "GraphNodeType";
  readonly objectType: "GraphNode";
  readonly graphRole: string;
  readonly supportedRelationships: readonly string[];
}

export interface ExecutivePlanningGraphEdgeTypeEntry extends ExecutivePlanningRegistryEntryBase {
  readonly category: "GraphEdgeType";
  readonly objectType: "GraphEdge";
  readonly graphRole: string;
  readonly supportedRelationships: readonly string[];
}

export interface ExecutivePlanningPriorityLevelEntry extends ExecutivePlanningRegistryEntryBase {
  readonly category: "PriorityLevel";
  readonly objectType: "Priority";
  readonly rank: number;
  readonly escalationRelevance: boolean;
}

export interface ExecutivePlanningParallelModeEntry extends ExecutivePlanningRegistryEntryBase {
  readonly category: "ParallelPlanningMode";
  readonly objectType: "ParallelMode";
  readonly planningEligibility: string;
}

export interface ExecutivePlanningRetryStrategyEntry extends ExecutivePlanningRegistryEntryBase {
  readonly category: "RetryPlanningStrategy";
  readonly objectType: "RetryStrategy";
  readonly retryMetadataPurpose: string;
}

export type ExecutivePlanningRegistryLookupEntry =
  | ExecutivePlanTypeEntry
  | ExecutivePlanningStepTypeEntry
  | ExecutivePlanningDependencyTypeEntry
  | ExecutivePlanningGraphNodeTypeEntry
  | ExecutivePlanningGraphEdgeTypeEntry
  | ExecutivePlanningPriorityLevelEntry
  | ExecutivePlanningParallelModeEntry
  | ExecutivePlanningRetryStrategyEntry;

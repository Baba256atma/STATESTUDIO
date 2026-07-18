export type ExecutiveOrchestrationOwner = "ENG-8";
export type ExecutiveOrchestrationVersion = "1.0.0";
export type ExecutiveOrchestrationPhase = "ENG-8:1";
export type ExecutiveOrchestrationNamespace =
  "nexora.engine.executive.orchestration.foundation";

export type ExecutiveOrchestrationLifecycleStageId =
  | "Idle"
  | "ReceiveRequest"
  | "PreparePipeline"
  | "ResolveDependencies"
  | "CoordinateExecution"
  | "AggregateResults"
  | "PrepareResponse"
  | "Complete";

export type ExecutiveOrchestrationCapabilityId =
  | "sequential-orchestration"
  | "parallel-orchestration"
  | "dependency-resolution"
  | "result-aggregation"
  | "failure-propagation"
  | "completion-synchronization"
  | "advisor-routing"
  | "pipeline-coordination";

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

export interface ExecutiveOrchestrationResponsibility {
  readonly id: ExecutiveOrchestrationResponsibilityId;
  readonly name: string;
  readonly description: string;
  readonly status: "Defined";
  readonly owner: ExecutiveOrchestrationOwner;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly runtimeFree: true;
  readonly executesOrchestration: false;
}

export interface ExecutiveOrchestrationCoordinationTarget {
  readonly id: ExecutiveOrchestrationCoordinationTargetId;
  readonly name: string;
  readonly description: string;
  readonly classification: "EnginePhase" | "ExternalPlatform" | "Advisor";
  readonly status: "Declared";
  readonly owner: ExecutiveOrchestrationOwner;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly runtimeIntegration: "Prohibited";
}

export interface ExecutiveOrchestrationLifecycleStage {
  readonly id: ExecutiveOrchestrationLifecycleStageId;
  readonly name: string;
  readonly description: string;
  readonly order: number;
  readonly status: "Defined";
  readonly owner: ExecutiveOrchestrationOwner;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly runtimeFree: true;
  readonly executesStage: false;
}

export interface ExecutiveOrchestrationCapability {
  readonly id: ExecutiveOrchestrationCapabilityId;
  readonly name: string;
  readonly description: string;
  readonly status: "Defined";
  readonly owner: ExecutiveOrchestrationOwner;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly runtimeFree: true;
  readonly implementsCapability: false;
}

export interface ExecutiveOrchestrationDependencyRules {
  readonly allowed: readonly string[];
  readonly forbidden: readonly string[];
  readonly direction: "ForwardOnly";
  readonly publicApiOnly: true;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly runtimeFree: true;
}

export interface ExecutiveOrchestrationBoundary {
  readonly definesOrchestrationArchitectureOnly: true;
  readonly performsOrchestration: false;
  readonly performsScheduling: false;
  readonly performsAsyncExecution: false;
  readonly performsQueuing: false;
  readonly performsStateManagement: false;
  readonly performsBusinessLogic: false;
  readonly performsDecisionSelection: false;
  readonly performsReasoning: false;
  readonly performsPlanning: false;
  readonly performsPersistence: false;
  readonly performsVisualization: false;
}

export interface ExecutiveOrchestrationFoundationMetadata {
  readonly platformId: "ENG-8:1";
  readonly name: "Executive Orchestration Foundation";
  readonly version: ExecutiveOrchestrationVersion;
  readonly namespace: ExecutiveOrchestrationNamespace;
  readonly description: string;
  readonly phase: ExecutiveOrchestrationPhase;
  readonly owner: ExecutiveOrchestrationOwner;
  readonly nextPhase: "ENG-8:2";
  readonly readiness: "ReadyForRegistry";
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministic: true;
  readonly runtimeFree: true;
}

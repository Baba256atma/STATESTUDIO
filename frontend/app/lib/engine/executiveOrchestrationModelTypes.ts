export type ExecutiveOrchestrationModelOwner = "ENG-8";
export type ExecutiveOrchestrationModelVersion = "1.0.0";
export type ExecutiveOrchestrationModelPhase = "ENG-8:3";
export type ExecutiveOrchestrationModelNamespace =
  "nexora.engine.executive.orchestration.model";

export type ExecutiveOrchestrationModelId =
  | "eng-8-model-request"
  | "eng-8-model-plan"
  | "eng-8-model-execution-stage"
  | "eng-8-model-coordination-route"
  | "eng-8-model-dependency-chain"
  | "eng-8-model-execution-group"
  | "eng-8-model-advisor-handoff";

export type ExecutiveOrchestrationModelKind =
  | "Request"
  | "Plan"
  | "ExecutionStage"
  | "CoordinationRoute"
  | "DependencyChain"
  | "ExecutionGroup"
  | "AdvisorHandoff";

export type ExecutiveOrchestrationModelExecutionMode =
  | "Sequential"
  | "Parallel"
  | "Conditional"
  | "Synchronized"
  | "Aggregated"
  | "Handoff";

export type ExecutiveOrchestrationModelStatus =
  | "Defined"
  | "Stable"
  | "ReadyForValidation";

export interface ExecutiveOrchestrationModelDescriptor {
  readonly id: ExecutiveOrchestrationModelId;
  readonly kind: ExecutiveOrchestrationModelKind;
  readonly name: string;
  readonly description: string;
  readonly namespace: ExecutiveOrchestrationModelNamespace;
  readonly owner: ExecutiveOrchestrationModelOwner;
  readonly sourcePhase: ExecutiveOrchestrationModelPhase;
  readonly version: ExecutiveOrchestrationModelVersion;
  readonly fields: readonly string[];
  readonly registryDependencies: readonly string[];
  readonly modelDependencies: readonly ExecutiveOrchestrationModelId[];
  readonly status: "Defined";
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly runtimeFree: true;
  readonly executesOrchestration: false;
}

export interface ExecutiveOrchestrationModelRegistryEntry {
  readonly id: ExecutiveOrchestrationModelId;
  readonly kind: ExecutiveOrchestrationModelKind;
  readonly name: string;
  readonly description: string;
  readonly status: "Registered";
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly runtimeFree: true;
}

export interface ExecutiveOrchestrationModelRelationship {
  readonly id: string;
  readonly source: ExecutiveOrchestrationModelKind;
  readonly destination: ExecutiveOrchestrationModelKind;
  readonly direction: "Forward";
  readonly description: string;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly executesRelationship: false;
}

export interface ExecutiveOrchestrationModelMetadata {
  readonly id: "ENG-8:3";
  readonly name: "Executive Orchestration Model Platform";
  readonly version: ExecutiveOrchestrationModelVersion;
  readonly namespace: ExecutiveOrchestrationModelNamespace;
  readonly status: "Stable";
  readonly architectureMode: "MetadataOnly";
  readonly immutability: "DeeplyFrozen";
  readonly runtimeBehavior: "None";
  readonly owner: ExecutiveOrchestrationModelOwner;
  readonly previousPhase: "ENG-8:2";
  readonly nextPhase: "ENG-8:4";
  readonly readiness: "ReadyForValidation";
  readonly metadataOnly: true;
  readonly runtimeFree: true;
  readonly deterministic: true;
  readonly immutable: true;
  readonly deeplyFrozen: true;
  readonly readyForValidation: true;
}

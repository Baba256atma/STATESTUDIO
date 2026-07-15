export type ExecutiveDecisionOwner = "ENG-7";
export type ExecutiveDecisionVersion = "1.0.0";
export type ExecutiveDecisionPhase = "ENG-7:1";
export type ExecutiveDecisionNamespace =
  "nexora.engine.executive.decision.foundation";

export interface ExecutiveDecisionCapability {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly status: "Defined";
  readonly owner: ExecutiveDecisionOwner;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly runtimeFree: true;
  readonly aiFree: true;
}

export interface ExecutiveDecisionDomain {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly status: "Defined";
  readonly owner: ExecutiveDecisionOwner;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly runtimeFree: true;
}

export interface ExecutiveDecisionLifecycle {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly order: number;
  readonly status: "Defined";
  readonly owner: ExecutiveDecisionOwner;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly runtimeFree: true;
}

export interface ExecutiveDecisionOwnership {
  readonly owner: ExecutiveDecisionOwner;
  readonly owns: readonly string[];
  readonly neverOwns: readonly string[];
  readonly reasoningOwner: "ENG-6";
  readonly planningOwner: "ENG-5";
  readonly orchestrationOwner: "ENG-8";
  readonly executionOwner: "OPS";
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministic: true;
  readonly runtimeFree: true;
}

export interface ExecutiveDecisionOutput {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly fields: readonly string[];
  readonly status: "Defined";
  readonly owner: ExecutiveDecisionOwner;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly runtimeFree: true;
}

export interface ExecutiveDecisionBoundary {
  readonly producesDecisionsOnly: true;
  readonly performsReasoning: false;
  readonly performsPlanning: false;
  readonly performsOrchestration: false;
  readonly performsExecution: false;
  readonly performsVisualization: false;
  readonly performsPersistence: false;
  readonly performsAiInference: false;
  readonly performsScoring: false;
}

export interface ExecutiveDecisionFoundationMetadata {
  readonly platformId: "ENG-7:1";
  readonly name: "Executive Decision Engine Foundation";
  readonly version: ExecutiveDecisionVersion;
  readonly namespace: ExecutiveDecisionNamespace;
  readonly description: string;
  readonly phase: ExecutiveDecisionPhase;
  readonly owner: ExecutiveDecisionOwner;
  readonly nextPhase: "ENG-7:2";
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministic: true;
  readonly runtimeFree: true;
  readonly aiFree: true;
}

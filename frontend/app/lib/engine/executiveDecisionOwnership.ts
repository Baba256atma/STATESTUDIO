import type { ExecutiveDecisionOwnership } from "./executiveDecisionFoundationTypes.ts";

/**
 * ENG-7 ownership map — decision architecture only.
 */
export const ExecutiveDecisionOwnershipMap = Object.freeze({
  owner: "ENG-7",
  platform: "Executive Decision Engine",
  foundationPhase: "ENG-7:1",
  layer: "ExecutiveEngine",
  owns: Object.freeze([
    "executive decision metadata",
    "decision contracts",
    "decision publication",
    "decision lifecycle",
  ] as const),
  neverOwns: Object.freeze([
    "request understanding",
    "intent resolution",
    "context",
    "planning",
    "reasoning",
    "orchestration",
    "advisor",
    "scene",
    "persistence",
    "execution",
  ] as const),
  reasoningOwner: "ENG-6",
  planningOwner: "ENG-5",
  orchestrationOwner: "ENG-8",
  executionOwner: "OPS",
  boundary: Object.freeze({
    producesDecisionsOnly: true,
    performsReasoning: false,
    performsPlanning: false,
    performsOrchestration: false,
    performsExecution: false,
    performsVisualization: false,
    performsPersistence: false,
    performsAiInference: false,
    performsScoring: false,
  } as const),
  rules: Object.freeze([
    Object.freeze({
      id: "eng-7-ownership-decisions-only",
      rule: "ENG-7 owns only executive decision architecture and never duplicates ENG-2 through ENG-6, ENG-8, BUS, OPS, or CORE responsibilities.",
      status: "Protected",
    } as const),
    Object.freeze({
      id: "eng-7-ownership-no-reasoning",
      rule: "Reasoning remains owned by ENG-6.",
      status: "Protected",
    } as const),
    Object.freeze({
      id: "eng-7-ownership-no-orchestration",
      rule: "Orchestration remains owned by ENG-8.",
      status: "Protected",
    } as const),
    Object.freeze({
      id: "eng-7-ownership-no-execution",
      rule: "Execution remains owned by OPS.",
      status: "Protected",
    } as const),
  ] as const),
  metadataOnly: true,
  immutable: true,
  deterministic: true,
  runtimeFree: true,
  aiFree: true,
} as const satisfies ExecutiveDecisionOwnership & {
  readonly platform: "Executive Decision Engine";
  readonly foundationPhase: "ENG-7:1";
  readonly layer: "ExecutiveEngine";
  readonly boundary: Readonly<{
    producesDecisionsOnly: true;
    performsReasoning: false;
    performsPlanning: false;
    performsOrchestration: false;
    performsExecution: false;
    performsVisualization: false;
    performsPersistence: false;
    performsAiInference: false;
    performsScoring: false;
  }>;
  readonly rules: readonly Readonly<{
    id: string;
    rule: string;
    status: "Protected";
  }>[];
  readonly aiFree: true;
});

import type {
  ExecutiveOrchestrationCoordinationTarget,
  ExecutiveOrchestrationResponsibility,
} from "./executiveOrchestrationFoundationTypes.ts";

const responsibility = (
  id: ExecutiveOrchestrationResponsibility["id"],
  name: string,
  description: string,
) => Object.freeze({
  id,
  name,
  description,
  status: "Defined",
  owner: "ENG-8",
  metadataOnly: true,
  immutable: true,
  runtimeFree: true,
  executesOrchestration: false,
} as const satisfies ExecutiveOrchestrationResponsibility);

const target = (
  id: ExecutiveOrchestrationCoordinationTarget["id"],
  name: string,
  description: string,
  classification: ExecutiveOrchestrationCoordinationTarget["classification"],
) => Object.freeze({
  id,
  name,
  description,
  classification,
  status: "Declared",
  owner: "ENG-8",
  metadataOnly: true,
  immutable: true,
  runtimeIntegration: "Prohibited",
} as const satisfies ExecutiveOrchestrationCoordinationTarget);

/**
 * Immutable responsibility and coordination-target contract for ENG-8:1.
 */
export const ExecutiveOrchestrationResponsibilityContract = Object.freeze({
  id: "ENG-8:1-responsibility-contract",
  name: "Executive Orchestration Responsibility Contract",
  description:
    "Declares orchestration responsibilities and coordination targets without performing orchestration.",
  owns: Object.freeze([
    "executive orchestration",
    "pipeline coordination",
    "engine coordination",
    "BUS coordination",
    "OPS coordination",
    "Advisor coordination",
    "execution sequencing",
    "dependency ordering",
    "parallel execution capability declarations",
    "completion aggregation",
    "failure propagation contracts",
    "result routing",
  ] as const),
  neverOwns: Object.freeze([
    "runtime orchestration execution",
    "scheduling engines",
    "workflow processors",
    "state management",
    "asynchronous execution",
    "retries",
    "queues",
    "event buses",
    "business logic",
    "decision selection",
    "reasoning",
    "planning",
    "persistence",
    "visualization",
  ] as const),
  responsibilities: Object.freeze([
    responsibility(
      "pipeline-orchestration",
      "Pipeline orchestration",
      "Declares architectural ownership of executive pipeline orchestration.",
    ),
    responsibility(
      "execution-ordering",
      "Execution ordering",
      "Declares deterministic execution-ordering contracts without scheduling work.",
    ),
    responsibility(
      "component-coordination",
      "Component coordination",
      "Declares component coordination boundaries across executive engine phases.",
    ),
    responsibility(
      "context-propagation",
      "Context propagation",
      "Declares context-propagation contracts without mutating runtime context.",
    ),
    responsibility(
      "dependency-coordination",
      "Dependency coordination",
      "Declares dependency-coordination architecture for orchestration consumers.",
    ),
    responsibility(
      "parallel-execution-declaration",
      "Parallel execution declaration",
      "Declares parallel execution capability metadata without running parallel work.",
    ),
    responsibility(
      "sequential-execution-declaration",
      "Sequential execution declaration",
      "Declares sequential execution capability metadata without running sequential work.",
    ),
    responsibility(
      "result-aggregation",
      "Result aggregation",
      "Declares result-aggregation contracts without aggregating runtime results.",
    ),
    responsibility(
      "completion-routing",
      "Completion routing",
      "Declares completion-routing contracts without routing runtime completions.",
    ),
    responsibility(
      "failure-routing",
      "Failure routing",
      "Declares failure-routing contracts without handling runtime failures.",
    ),
    responsibility(
      "advisor-handoff",
      "Advisor handoff",
      "Declares Advisor handoff contracts without generating Advisor messages.",
    ),
    responsibility(
      "engine-synchronization",
      "Engine synchronization",
      "Declares engine-synchronization contracts without synchronizing runtime state.",
    ),
  ] as const),
  coordinationTargets: Object.freeze([
    target(
      "executive-request",
      "Executive Request",
      "Coordination target for ENG-2 executive request surfaces.",
      "EnginePhase",
    ),
    target(
      "intent-resolution",
      "Intent Resolution",
      "Coordination target for ENG-3 intent resolution surfaces.",
      "EnginePhase",
    ),
    target(
      "context-assembly",
      "Context Assembly",
      "Coordination target for ENG-4 context assembly surfaces.",
      "EnginePhase",
    ),
    target(
      "planning",
      "Planning",
      "Coordination target for ENG-5 planning surfaces.",
      "EnginePhase",
    ),
    target(
      "reasoning",
      "Reasoning",
      "Coordination target for ENG-6 reasoning surfaces.",
      "EnginePhase",
    ),
    target(
      "decision",
      "Decision",
      "Coordination target for ENG-7 decision surfaces.",
      "EnginePhase",
    ),
    target(
      "bus-platforms",
      "BUS Platforms",
      "Coordination target for BUS public API platforms only.",
      "ExternalPlatform",
    ),
    target(
      "ops-platforms",
      "OPS Platforms",
      "Coordination target for OPS public API platforms only.",
      "ExternalPlatform",
    ),
    target(
      "advisor",
      "Advisor",
      "Coordination target for Advisor public API surfaces only.",
      "Advisor",
    ),
  ] as const),
  metadataOnly: true,
  immutable: true,
  deterministic: true,
  runtimeFree: true,
} as const);

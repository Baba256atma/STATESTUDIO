import {
  ExecutiveOrchestrationFoundation,
  ExecutiveOrchestrationResponsibilityContract,
} from "./executiveOrchestrationFoundation.ts";
import type {
  ExecutiveOrchestrationCoordinationEntry,
  ExecutiveOrchestrationCoordinationTargetId,
  ExecutiveOrchestrationExecutionMode,
  ExecutiveOrchestrationExecutionModeEntry,
  ExecutiveOrchestrationRoutingEntry,
} from "./executiveOrchestrationRegistryTypes.ts";

const target = (
  targetId: ExecutiveOrchestrationCoordinationTargetId,
  name: string,
  category: ExecutiveOrchestrationCoordinationEntry["category"],
  sourcePhase: string,
  allowedInboundRelationships: readonly ExecutiveOrchestrationCoordinationTargetId[],
  allowedOutboundRelationships: readonly ExecutiveOrchestrationCoordinationTargetId[],
  supportedExecutionModes: readonly ExecutiveOrchestrationExecutionMode[],
  requiredPublicSurface: string,
) => Object.freeze({
  id: `eng-8-coord-${targetId}` as const,
  targetId,
  name,
  category,
  sourcePhase,
  allowedInboundRelationships: Object.freeze([...allowedInboundRelationships]),
  allowedOutboundRelationships: Object.freeze([...allowedOutboundRelationships]),
  supportedExecutionModes: Object.freeze([...supportedExecutionModes]),
  requiredPublicSurface,
  status: "Registered",
  kind: "CoordinationTarget",
  metadataOnly: true,
  runtimeFree: true,
  immutable: true,
} as const satisfies ExecutiveOrchestrationCoordinationEntry);

/**
 * Canonical coordination-target registry aligned with ENG-8:1 targets.
 * Forward direction is declared metadata only.
 */
export const ExecutiveOrchestrationCoordinationRegistry = Object.freeze([
  target(
    "executive-request",
    "Executive Request",
    "EngineStage",
    "ENG-2",
    Object.freeze([] as const),
    Object.freeze(["intent-resolution"] as const),
    Object.freeze(["Sequential"] as const),
    "executiveRequestIntentPublicIndex.ts",
  ),
  target(
    "intent-resolution",
    "Intent Resolution",
    "EngineStage",
    "ENG-3",
    Object.freeze(["executive-request"] as const),
    Object.freeze(["context-assembly"] as const),
    Object.freeze(["Sequential"] as const),
    "executiveIntentResolutionPublicIndex.ts",
  ),
  target(
    "context-assembly",
    "Context Assembly",
    "EngineStage",
    "ENG-4",
    Object.freeze(["intent-resolution"] as const),
    Object.freeze(["planning"] as const),
    Object.freeze(["Sequential", "Synchronized"] as const),
    "executiveContextAssemblyPublicIndex.ts",
  ),
  target(
    "planning",
    "Planning",
    "EngineStage",
    "ENG-5",
    Object.freeze(["context-assembly"] as const),
    Object.freeze(["reasoning"] as const),
    Object.freeze(["Sequential", "Conditional"] as const),
    "executivePlanningPublicIndex.ts",
  ),
  target(
    "reasoning",
    "Reasoning",
    "EngineStage",
    "ENG-6",
    Object.freeze(["planning"] as const),
    Object.freeze(["decision"] as const),
    Object.freeze(["Sequential"] as const),
    "executiveReasoningPublicIndex.ts",
  ),
  target(
    "decision",
    "Decision",
    "EngineStage",
    "ENG-7",
    Object.freeze(["reasoning"] as const),
    Object.freeze(["bus-platforms", "ops-platforms", "advisor"] as const),
    Object.freeze(["Sequential", "Conditional", "Handoff"] as const),
    "executiveDecisionPublicIndex.ts",
  ),
  target(
    "bus-platforms",
    "BUS Platforms",
    "BusinessPlatform",
    "BUS",
    Object.freeze(["decision"] as const),
    Object.freeze(["advisor"] as const),
    Object.freeze(["Parallel", "Conditional", "Aggregated"] as const),
    "BUS Public APIs",
  ),
  target(
    "ops-platforms",
    "OPS Platforms",
    "OperationsPlatform",
    "OPS",
    Object.freeze(["decision"] as const),
    Object.freeze(["advisor"] as const),
    Object.freeze(["Parallel", "Conditional", "Aggregated"] as const),
    "OPS Public APIs",
  ),
  target(
    "advisor",
    "Advisor",
    "ResponseSurface",
    "Advisor",
    Object.freeze(["decision", "bus-platforms", "ops-platforms"] as const),
    Object.freeze([] as const),
    Object.freeze(["Handoff"] as const),
    "Advisor Public APIs",
  ),
] as const);

const mode = (
  modeId: ExecutiveOrchestrationExecutionMode,
  name: string,
  description: string,
) => Object.freeze({
  id: `eng-8-mode-${modeId}` as const,
  modeId,
  name,
  description,
  kind: "ExecutionMode",
  status: "Registered",
  metadataOnly: true,
  runtimeFree: true,
  immutable: true,
  executesMode: false,
} as const satisfies ExecutiveOrchestrationExecutionModeEntry);

export const ExecutiveOrchestrationExecutionModeRegistry = Object.freeze([
  mode("Sequential", "Sequential", "Declares sequential orchestration mode without executing sequences."),
  mode("Parallel", "Parallel", "Declares parallel orchestration mode without executing parallel work."),
  mode("Conditional", "Conditional", "Declares conditional orchestration mode without evaluating conditions."),
  mode("Synchronized", "Synchronized", "Declares synchronized orchestration mode without synchronizing runtime state."),
  mode("Aggregated", "Aggregated", "Declares aggregated orchestration mode without aggregating runtime results."),
  mode("Handoff", "Handoff", "Declares handoff orchestration mode without performing handoffs."),
] as const);

const route = (
  key: string,
  name: string,
  sourceTargetId: ExecutiveOrchestrationCoordinationTargetId,
  destinationTargetId: ExecutiveOrchestrationCoordinationTargetId,
  direction: ExecutiveOrchestrationRoutingEntry["direction"],
) => Object.freeze({
  id: `eng-8-route-${key}` as const,
  name,
  sourceTargetId,
  destinationTargetId,
  direction,
  kind: "RoutingRelationship",
  status: "Registered",
  metadataOnly: true,
  runtimeFree: true,
  immutable: true,
  executesRouting: false,
} as const satisfies ExecutiveOrchestrationRoutingEntry);

/**
 * Declared forward orchestration routing relationships. Metadata only.
 */
export const ExecutiveOrchestrationRoutingRegistry = Object.freeze([
  route("request-to-intent", "Executive Request → Intent Resolution", "executive-request", "intent-resolution", "Forward"),
  route("intent-to-context", "Intent Resolution → Context Assembly", "intent-resolution", "context-assembly", "Forward"),
  route("context-to-planning", "Context Assembly → Planning", "context-assembly", "planning", "Forward"),
  route("planning-to-reasoning", "Planning → Reasoning", "planning", "reasoning", "Forward"),
  route("reasoning-to-decision", "Reasoning → Decision", "reasoning", "decision", "Forward"),
  route("decision-to-bus", "Decision → BUS Platforms", "decision", "bus-platforms", "External"),
  route("decision-to-ops", "Decision → OPS Platforms", "decision", "ops-platforms", "External"),
  route("decision-to-advisor", "Decision → Advisor", "decision", "advisor", "Handoff"),
] as const);

export const ExecutiveOrchestrationCoordinationRegistryFoundationAlignment = Object.freeze({
  foundationId: ExecutiveOrchestrationFoundation.id,
  foundationTargetCount: ExecutiveOrchestrationResponsibilityContract.coordinationTargets.length,
  registeredTargetCount: 9,
  forwardPipeline: Object.freeze([
    "Executive Request",
    "Intent Resolution",
    "Context Assembly",
    "Planning",
    "Reasoning",
    "Decision",
    "BUS / OPS coordination where required",
    "Advisor handoff",
  ] as const),
  metadataOnly: true,
  immutable: true,
} as const);

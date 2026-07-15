import { ExecutivePlanningLifecycle } from "./executivePlanningIndex.ts";
import type {
  ExecutivePlanningGraphEdgeTypeEntry,
  ExecutivePlanningGraphNodeTypeEntry,
  ExecutivePlanningRegistryLifecycleStage,
} from "./executivePlanningRegistryTypes.ts";

const lifecycleStages = Object.freeze(
  ExecutivePlanningLifecycle.map(({ name }) => name) as ExecutivePlanningRegistryLifecycleStage[],
);

const graphNode = (
  key: string,
  name: ExecutivePlanningGraphNodeTypeEntry["name"],
  description: string,
  graphRole: string,
  supportedRelationships: readonly string[],
) => Object.freeze({
  id: `eng-5-graph-node-${key}`,
  name,
  description,
  category: "GraphNodeType",
  objectType: "GraphNode",
  status: "Active",
  owner: "ENG-5",
  graphRole,
  supportedRelationships: Object.freeze([...supportedRelationships]),
  lifecycleStages,
  public: true,
  metadataOnly: true,
  runtimeFree: true,
} as const satisfies ExecutivePlanningGraphNodeTypeEntry);

const graphEdge = (
  key: string,
  name: ExecutivePlanningGraphEdgeTypeEntry["name"],
  description: string,
  graphRole: string,
  supportedRelationships: readonly string[],
) => Object.freeze({
  id: `eng-5-graph-edge-${key}`,
  name,
  description,
  category: "GraphEdgeType",
  objectType: "GraphEdge",
  status: "Active",
  owner: "ENG-5",
  graphRole,
  supportedRelationships: Object.freeze([...supportedRelationships]),
  lifecycleStages,
  public: true,
  metadataOnly: true,
  runtimeFree: true,
} as const satisfies ExecutivePlanningGraphEdgeTypeEntry);

export const ExecutivePlanningGraphNodeRegistry = Object.freeze([
  graphNode(
    "plan",
    "Plan Node",
    "Graph node vocabulary for representing a plan artifact in planning metadata.",
    "PlanContainer",
    Object.freeze(["contains-steps", "emits-outputs"]),
  ),
  graphNode(
    "step",
    "Step Node",
    "Graph node vocabulary for representing a planning step artifact.",
    "PlanStep",
    Object.freeze(["sequence", "depends-on", "produces-output"]),
  ),
  graphNode(
    "decision",
    "Decision Node",
    "Graph node vocabulary for representing decision-evaluation planning points.",
    "DecisionPoint",
    Object.freeze(["conditional-branch", "decision-dependency"]),
  ),
  graphNode(
    "validation",
    "Validation Node",
    "Graph node vocabulary for representing validation planning checkpoints.",
    "ValidationCheckpoint",
    Object.freeze(["validation-edge", "gate-next-step"]),
  ),
  graphNode(
    "gateway",
    "Gateway Node",
    "Graph node vocabulary for representing parallel or exclusive planning gateways.",
    "PlanningGateway",
    Object.freeze(["parallel-edge", "mutually-exclusive"]),
  ),
  graphNode(
    "output",
    "Output Node",
    "Graph node vocabulary for representing planning output assembly points.",
    "PlanningOutput",
    Object.freeze(["receives-step-output", "publishes-plan-output"]),
  ),
] as const);

export const ExecutivePlanningGraphEdgeRegistry = Object.freeze([
  graphEdge(
    "sequence",
    "Sequence Edge",
    "Graph edge vocabulary for ordered succession between planning nodes.",
    "SequentialFlow",
    Object.freeze(["step-to-step", "plan-to-step"]),
  ),
  graphEdge(
    "dependency",
    "Dependency Edge",
    "Graph edge vocabulary for dependency metadata between planning nodes.",
    "DependencyFlow",
    Object.freeze(["data-dependency", "context-dependency", "resource-dependency"]),
  ),
  graphEdge(
    "conditional",
    "Conditional Edge",
    "Graph edge vocabulary for conditional planning relationships.",
    "ConditionalFlow",
    Object.freeze(["decision-to-step", "conditional-dependency"]),
  ),
  graphEdge(
    "parallel",
    "Parallel Edge",
    "Graph edge vocabulary for parallel-eligible planning relationships.",
    "ParallelFlow",
    Object.freeze(["gateway-to-step", "parallel-branch"]),
  ),
  graphEdge(
    "validation",
    "Validation Edge",
    "Graph edge vocabulary for validation checkpoints in planning graphs.",
    "ValidationFlow",
    Object.freeze(["step-to-validation", "validation-to-step"]),
  ),
  graphEdge(
    "retry",
    "Retry Edge",
    "Graph edge vocabulary for retry-planning metadata relationships.",
    "RetryFlow",
    Object.freeze(["failure-to-retry-step", "retry-strategy-attachment"]),
  ),
  graphEdge(
    "escalation",
    "Escalation Edge",
    "Graph edge vocabulary for escalation-planning metadata relationships.",
    "EscalationFlow",
    Object.freeze(["failure-to-escalation", "escalation-plan-link"]),
  ),
] as const);

const nodeIndex = Object.freeze(
  Object.fromEntries(ExecutivePlanningGraphNodeRegistry.map((entry) => [entry.id, entry])) as Readonly<
    Record<string, ExecutivePlanningGraphNodeTypeEntry | undefined>
  >,
);
const edgeIndex = Object.freeze(
  Object.fromEntries(ExecutivePlanningGraphEdgeRegistry.map((entry) => [entry.id, entry])) as Readonly<
    Record<string, ExecutivePlanningGraphEdgeTypeEntry | undefined>
  >,
);

export const getExecutivePlanningGraphNodeById = (
  id: string,
): ExecutivePlanningGraphNodeTypeEntry | undefined => nodeIndex[id];
export const getExecutivePlanningGraphEdgeById = (
  id: string,
): ExecutivePlanningGraphEdgeTypeEntry | undefined => edgeIndex[id];
export const getExecutivePlanningGraphRegistries = () => Object.freeze({
  nodes: ExecutivePlanningGraphNodeRegistry,
  edges: ExecutivePlanningGraphEdgeRegistry,
  metadataOnly: true,
  immutable: true,
  deterministic: true,
} as const);

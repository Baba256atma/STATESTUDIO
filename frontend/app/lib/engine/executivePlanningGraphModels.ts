import { ExecutivePlanningLifecycle } from "./executivePlanningIndex.ts";
import type {
  ExecutivePlanningGraphModelDescriptor,
  ExecutivePlanningModelLifecycleStage,
} from "./executivePlanningModelTypes.ts";

const lifecycleStages = Object.freeze(
  ExecutivePlanningLifecycle.map(({ name }) => name) as ExecutivePlanningModelLifecycleStage[],
);

const graphModel = (
  key: string,
  name: string,
  description: string,
) => Object.freeze({
  id: `eng-5-model-graph-${key}`,
  name,
  description,
  category: "Graph",
  owner: "ENG-5",
  version: "1.0.0",
  status: "Active",
  compatibleNodeRegistry: "ExecutivePlanningGraphNodeRegistry",
  compatibleEdgeRegistry: "ExecutivePlanningGraphEdgeRegistry",
  supportedLifecycleStages: lifecycleStages,
  metadataOnly: true,
  runtimeFree: true,
  public: true,
} as const satisfies ExecutivePlanningGraphModelDescriptor);

export const ExecutivePlanningGraphModels = Object.freeze([
  graphModel(
    "planning-graph",
    "PlanningGraph",
    "Canonical model describing a planning graph as declarative metadata without graph instances.",
  ),
  graphModel(
    "planning-node",
    "PlanningNode",
    "Canonical model describing a planning graph node as vocabulary-aligned metadata.",
  ),
  graphModel(
    "planning-edge",
    "PlanningEdge",
    "Canonical model describing a planning graph edge as relationship metadata only.",
  ),
  graphModel(
    "planning-gateway",
    "PlanningGateway",
    "Canonical model describing a planning gateway for parallel or exclusive branch metadata.",
  ),
  graphModel(
    "planning-flow",
    "PlanningFlow",
    "Canonical model describing planning flow relationships without traversal or execution.",
  ),
  graphModel(
    "planning-topology",
    "PlanningTopology",
    "Canonical model describing planning topology metadata without pathfinding or sorting.",
  ),
] as const);

const graphIndex = Object.freeze(
  Object.fromEntries(ExecutivePlanningGraphModels.map((model) => [model.id, model])) as Readonly<
    Record<string, ExecutivePlanningGraphModelDescriptor | undefined>
  >,
);

export const getExecutivePlanningGraphModels = () => ExecutivePlanningGraphModels;
export const getExecutivePlanningGraphModel = (
  id: string,
): ExecutivePlanningGraphModelDescriptor | undefined => graphIndex[id];

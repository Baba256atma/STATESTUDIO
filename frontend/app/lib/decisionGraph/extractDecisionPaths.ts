import type {
  DecisionGraphNodeType,
  StrategicDecisionGraph,
  StrategicDecisionGraphNode,
  StrategicDecisionPath,
} from "./strategicDecisionGraphTypes.ts";

const PATH_ORDER: DecisionGraphNodeType[] = [
  "signal",
  "risk",
  "memory",
  "scenario",
  "comparison",
  "recommendation",
  "confidence",
  "monitoring",
  "narrative",
];

function typeRank(type: DecisionGraphNodeType): number {
  return PATH_ORDER.indexOf(type);
}

function severityRank(node: StrategicDecisionGraphNode): number {
  if (node.severity === "critical") return 4;
  if (node.severity === "high") return 3;
  if (node.severity === "medium") return 2;
  if (node.severity === "low") return 1;
  return 0;
}

function bestNode(nodes: StrategicDecisionGraphNode[], type: DecisionGraphNodeType): StrategicDecisionGraphNode | null {
  return nodes
    .filter((node) => node.type === type)
    .sort((left, right) => {
      if (severityRank(right) !== severityRank(left)) return severityRank(right) - severityRank(left);
      if ((right.confidence ?? 0) !== (left.confidence ?? 0)) return (right.confidence ?? 0) - (left.confidence ?? 0);
      return left.id.localeCompare(right.id);
    })[0] ?? null;
}

function unique(values: string[]): string[] {
  const seen = new Set<string>();
  const result: string[] = [];
  for (const value of values) {
    if (!value || seen.has(value)) continue;
    seen.add(value);
    result.push(value);
  }
  return result;
}

export function extractDecisionPaths(params: {
  graph: StrategicDecisionGraph;
}): StrategicDecisionPath[] {
  const graph = params.graph;
  const primaryNodes = PATH_ORDER
    .map((type) => bestNode(graph.nodes, type))
    .filter((node): node is StrategicDecisionGraphNode => Boolean(node));
  const primaryNodeIds = unique(primaryNodes.map((node) => node.id));

  if (!primaryNodeIds.length) return [];

  const first = primaryNodes[0];
  const last = primaryNodes[primaryNodes.length - 1];
  const headline = `${first.title} -> ${last.title}`;
  const executiveSummary = `${first.title} establishes the decision context that leads toward ${last.title}.`;

  return [{
    id: `decision_path_${primaryNodeIds.join("_")}`,
    nodeIds: primaryNodeIds,
    headline,
    executiveSummary,
  }].sort((left, right) => {
    const leftTypes = left.nodeIds
      .map((id) => graph.nodes.find((node) => node.id === id)?.type)
      .filter((type): type is DecisionGraphNodeType => Boolean(type));
    const rightTypes = right.nodeIds
      .map((id) => graph.nodes.find((node) => node.id === id)?.type)
      .filter((type): type is DecisionGraphNodeType => Boolean(type));
    const leftRank = leftTypes.reduce((sum, type) => sum + typeRank(type), 0);
    const rightRank = rightTypes.reduce((sum, type) => sum + typeRank(type), 0);
    return leftRank - rightRank;
  });
}

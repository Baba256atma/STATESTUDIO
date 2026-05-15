import type {
  StrategicDecisionGraph,
  StrategicDecisionGraphNode,
  StrategicDecisionPath,
} from "./strategicDecisionGraphTypes.ts";

function nodeById(graph: StrategicDecisionGraph, nodeId: string): StrategicDecisionGraphNode | null {
  return graph.nodes.find((node) => node.id === nodeId) ?? null;
}

export function buildDecisionPathNarrative(params: {
  graph: StrategicDecisionGraph;
  path: StrategicDecisionPath;
}): string {
  const nodes = params.path.nodeIds
    .map((id) => nodeById(params.graph, id))
    .filter((node): node is StrategicDecisionGraphNode => Boolean(node));
  const risk = nodes.find((node) => node.type === "risk" || node.type === "signal");
  const scenario = nodes.find((node) => node.type === "scenario");
  const recommendation = nodes.find((node) => node.type === "recommendation");
  const monitoring = nodes.find((node) => node.type === "monitoring");

  if (risk && scenario && recommendation && monitoring) {
    return `${risk.title} is driving ${scenario.title}, which supports ${recommendation.title} and should be followed through ${monitoring.title}.`;
  }
  if (risk && recommendation) {
    return `${risk.title} provides the operating pressure behind ${recommendation.title}.`;
  }
  if (recommendation && monitoring) {
    return `${recommendation.title} should be reviewed alongside ${monitoring.title}.`;
  }
  return params.path.executiveSummary;
}

export function buildDecisionGraphHeadline(graph: StrategicDecisionGraph): string {
  const recommendation = graph.nodes.find((node) => node.type === "recommendation");
  const risk = graph.nodes.find((node) => node.type === "risk" || node.type === "signal");
  if (risk && recommendation) return `${risk.title} -> ${recommendation.title}`;
  if (recommendation) return recommendation.title;
  if (risk) return risk.title;
  return "No strategic decision path is available yet.";
}

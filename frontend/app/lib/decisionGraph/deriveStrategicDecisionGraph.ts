import type { DecisionConfidence } from "../confidence/decisionConfidenceTypes.ts";
import type { DecisionRecommendation } from "../decision/decisionRecommendationTypes.ts";
import type { DomainScenario } from "../domain/domainScenarioTypes.ts";
import type { ExecutiveInsight } from "../intelligence/executiveInsightTypes.ts";
import type { StrategicMemoryRecord } from "../memory/strategicMemoryTypes.ts";
import type { ExecutiveMonitoringSignal } from "../monitoring/executiveMonitoringTypes.ts";
import type { ExecutiveNarrative } from "../narrative/narrativeSynthesisTypes.ts";
import type { ScenarioComparison } from "../scenario/scenarioCompareTypes.ts";
import { buildDecisionGraphHeadline, buildDecisionPathNarrative } from "./decisionGraphNarratives.ts";
import { deriveDecisionGraphEdges } from "./deriveDecisionGraphEdges.ts";
import { extractDecisionPaths } from "./extractDecisionPaths.ts";
import { mapIntelligenceToDecisionNodes } from "./mapIntelligenceToDecisionNodes.ts";
import type {
  StrategicDecisionGraph,
  StrategicDecisionGraphOverlayState,
} from "./strategicDecisionGraphTypes.ts";

const DETERMINISTIC_CREATED_AT = 0;

function unique(values: unknown[]): string[] {
  const seen = new Set<string>();
  const result: string[] = [];
  for (const value of values) {
    const text = String(value ?? "").trim();
    if (!text || seen.has(text)) continue;
    seen.add(text);
    result.push(text);
  }
  return result;
}

function logDecisionGraph(graph: StrategicDecisionGraph, debug?: boolean): void {
  if (!debug) return;
  const runtime = globalThis as typeof globalThis & {
    process?: { env?: { NODE_ENV?: string } };
  };
  if (runtime.process?.env?.NODE_ENV !== "development") return;
  const primaryPathLength = extractDecisionPaths({ graph })[0]?.nodeIds.length ?? 0;
  console.debug("[Nexora][StrategicDecisionGraph]", {
    nodeCount: graph.nodes.length,
    edgeCount: graph.edges.length,
    primaryPathLength,
    headline: graph.headline ?? null,
    dedupeCount: graph.nodes.length + graph.edges.length,
  });
}

export function deriveStrategicDecisionGraph(params: {
  executiveInsights?: ExecutiveInsight[];
  scenarios?: DomainScenario[];
  comparisons?: ScenarioComparison[];
  recommendations?: DecisionRecommendation[];
  confidenceSignals?: DecisionConfidence[];
  monitoringSignals?: ExecutiveMonitoringSignal[];
  strategicMemory?: StrategicMemoryRecord[];
  narratives?: ExecutiveNarrative[];
  debug?: boolean;
}): StrategicDecisionGraph {
  const nodes = mapIntelligenceToDecisionNodes(params);
  const edges = deriveDecisionGraphEdges({ ...params, nodes });
  const baseGraph: StrategicDecisionGraph = {
    id: "strategic_decision_graph_v1",
    nodes,
    edges,
    createdAt: DETERMINISTIC_CREATED_AT,
  };
  const paths = extractDecisionPaths({ graph: baseGraph });
  const graph: StrategicDecisionGraph = {
    ...baseGraph,
    headline: buildDecisionGraphHeadline(baseGraph),
    executiveSummary: paths[0] ? buildDecisionPathNarrative({ graph: baseGraph, path: paths[0] }) : "No strategic decision path is available yet.",
  };
  logDecisionGraph(graph, params.debug);
  return graph;
}

export function buildStrategicDecisionGraphOverlayState(params: {
  graph: StrategicDecisionGraph;
}): StrategicDecisionGraphOverlayState {
  const graph = params.graph;
  const primaryPath = extractDecisionPaths({ graph })[0] ?? null;
  return {
    graphId: graph.id,
    headline: graph.headline ?? "No strategic decision path is available yet.",
    executiveSummary: graph.executiveSummary ?? "No strategic decision path is available yet.",
    primaryPathNodeIds: primaryPath?.nodeIds ?? [],
    relatedObjectIds: unique(graph.nodes.flatMap((node) => node.relatedObjectIds ?? [])),
  };
}

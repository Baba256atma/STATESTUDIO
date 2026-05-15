import type { DecisionConfidence } from "../confidence/decisionConfidenceTypes.ts";
import type { DecisionRecommendation } from "../decision/decisionRecommendationTypes.ts";
import type { DomainScenario } from "../domain/domainScenarioTypes.ts";
import type { ExecutiveInsight } from "../intelligence/executiveInsightTypes.ts";
import type { ExecutiveMonitoringSignal } from "../monitoring/executiveMonitoringTypes.ts";
import type { ExecutiveNarrative } from "../narrative/narrativeSynthesisTypes.ts";
import type { ScenarioComparison } from "../scenario/scenarioCompareTypes.ts";
import type {
  StrategicDecisionGraphEdge,
  StrategicDecisionGraphNode,
} from "./strategicDecisionGraphTypes.ts";

function normalizeIdPart(value: unknown): string {
  return String(value ?? "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
}

function nodeId(type: StrategicDecisionGraphNode["type"], sourceId: unknown): string {
  return `decision_graph_${type}_${normalizeIdPart(sourceId) || "unknown"}`;
}

function edgeId(sourceNodeId: string, targetNodeId: string, label: string): string {
  return `decision_edge_${normalizeIdPart(sourceNodeId)}_${normalizeIdPart(targetNodeId)}_${normalizeIdPart(label)}`;
}

function objectOverlap(left?: string[], right?: string[]): number {
  if (!left?.length || !right?.length) return 0;
  const rightSet = new Set(right);
  return left.filter((id) => rightSet.has(id)).length;
}

function edge(params: {
  sourceNodeId: string;
  targetNodeId: string;
  label: string;
  weight: number;
  rationale: string;
}): StrategicDecisionGraphEdge {
  return {
    id: edgeId(params.sourceNodeId, params.targetNodeId, params.label),
    sourceNodeId: params.sourceNodeId,
    targetNodeId: params.targetNodeId,
    label: params.label,
    weight: Math.round(Math.min(1, Math.max(0, params.weight)) * 100) / 100,
    rationale: params.rationale,
  };
}

function hasNode(nodes: Map<string, StrategicDecisionGraphNode>, nodeIdValue: string): boolean {
  return nodes.has(nodeIdValue);
}

function addEdge(
  edges: Map<string, StrategicDecisionGraphEdge>,
  nodes: Map<string, StrategicDecisionGraphNode>,
  item: StrategicDecisionGraphEdge,
): void {
  if (item.sourceNodeId === item.targetNodeId) return;
  if (!hasNode(nodes, item.sourceNodeId) || !hasNode(nodes, item.targetNodeId)) return;
  const current = edges.get(item.id);
  if (!current || (item.weight ?? 0) > (current.weight ?? 0)) {
    edges.set(item.id, item);
  }
}

function relatedScenarioIdsFromRecommendation(recommendation: DecisionRecommendation): string[] {
  return Array.isArray(recommendation.relatedScenarioIds) ? recommendation.relatedScenarioIds : [];
}

function relatedNarrativeSources(narrative: ExecutiveNarrative): string[] {
  return [
    ...narrative.relatedInsightIds,
    ...(narrative.relatedScenarioIds ?? []),
  ];
}

export function deriveDecisionGraphEdges(params: {
  nodes: StrategicDecisionGraphNode[];
  executiveInsights?: ExecutiveInsight[];
  scenarios?: DomainScenario[];
  comparisons?: ScenarioComparison[];
  recommendations?: DecisionRecommendation[];
  confidenceSignals?: DecisionConfidence[];
  monitoringSignals?: ExecutiveMonitoringSignal[];
  narratives?: ExecutiveNarrative[];
}): StrategicDecisionGraphEdge[] {
  const nodes = new Map(params.nodes.map((node) => [node.id, node]));
  const edges = new Map<string, StrategicDecisionGraphEdge>();
  const insights = params.executiveInsights ?? [];
  const scenarios = params.scenarios ?? [];
  const recommendations = params.recommendations ?? [];

  for (const insight of insights) {
    const sourceNodeId = nodeId(insight.category === "risk" || insight.category === "fragility" || insight.category === "dependency" ? "risk" : "signal", insight.id);
    for (const scenario of scenarios) {
      const targetNodeId = nodeId("scenario", scenario.id);
      const overlap = objectOverlap(insight.affectedObjectIds, scenario.affectedObjectIds ?? scenario.relatedObjectIds);
      if (!overlap) continue;
      addEdge(edges, nodes, edge({
        sourceNodeId,
        targetNodeId,
        label: "informs scenario",
        weight: 0.55 + Math.min(0.35, overlap * 0.12),
        rationale: `${insight.title} informs ${scenario.title} through shared operating pressure.`,
      }));
    }
  }

  for (const comparison of params.comparisons ?? []) {
    const comparisonNodeId = nodeId("comparison", comparison.id);
    for (const scenarioId of [comparison.scenarioAId, comparison.scenarioBId]) {
      addEdge(edges, nodes, edge({
        sourceNodeId: nodeId("scenario", scenarioId),
        targetNodeId: comparisonNodeId,
        label: "compared in",
        weight: 0.74,
        rationale: `${scenarioId} is part of the executive comparison ${comparison.comparisonTitle}.`,
      }));
    }
    if (comparison.recommendedScenarioId) {
      for (const recommendation of recommendations.filter((item) => relatedScenarioIdsFromRecommendation(item).includes(comparison.recommendedScenarioId ?? ""))) {
        addEdge(edges, nodes, edge({
          sourceNodeId: comparisonNodeId,
          targetNodeId: nodeId("recommendation", recommendation.id),
          label: "supports recommendation",
          weight: 0.84,
          rationale: `${comparison.comparisonTitle} supports ${recommendation.title}.`,
        }));
      }
    }
  }

  for (const recommendation of recommendations) {
    const recommendationNodeId = nodeId("recommendation", recommendation.id);
    for (const scenarioId of relatedScenarioIdsFromRecommendation(recommendation)) {
      addEdge(edges, nodes, edge({
        sourceNodeId: nodeId("scenario", scenarioId),
        targetNodeId: recommendationNodeId,
        label: "leads to recommendation",
        weight: 0.8,
        rationale: `${scenarioId} creates decision context for ${recommendation.title}.`,
      }));
    }
    for (const scenario of scenarios) {
      if (relatedScenarioIdsFromRecommendation(recommendation).includes(scenario.id)) continue;
      const overlap = objectOverlap(recommendation.affectedObjectIds, scenario.affectedObjectIds ?? scenario.relatedObjectIds);
      if (!overlap) continue;
      addEdge(edges, nodes, edge({
        sourceNodeId: nodeId("scenario", scenario.id),
        targetNodeId: recommendationNodeId,
        label: "supports focus",
        weight: 0.48 + Math.min(0.24, overlap * 0.08),
        rationale: `${scenario.title} shares decision context with ${recommendation.title}.`,
      }));
    }
  }

  for (const confidence of params.confidenceSignals ?? []) {
    if (!confidence.relatedRecommendationId) continue;
    addEdge(edges, nodes, edge({
      sourceNodeId: nodeId("recommendation", confidence.relatedRecommendationId),
      targetNodeId: nodeId("confidence", confidence.id),
      label: "confidence support",
      weight: confidence.confidenceScore,
      rationale: `${confidence.rationale} supports confidence in the recommendation.`,
    }));
  }

  for (const signal of params.monitoringSignals ?? []) {
    const monitoringNodeId = nodeId("monitoring", signal.id);
    for (const recommendation of recommendations) {
      const overlap = objectOverlap(signal.relatedObjectIds, recommendation.affectedObjectIds);
      if (!overlap) continue;
      addEdge(edges, nodes, edge({
        sourceNodeId: nodeId("recommendation", recommendation.id),
        targetNodeId: monitoringNodeId,
        label: "monitor outcome",
        weight: 0.62 + Math.min(0.22, overlap * 0.08),
        rationale: `${signal.title} monitors the operating pressure behind ${recommendation.title}.`,
      }));
    }
  }

  for (const narrative of params.narratives ?? []) {
    const narrativeNodeId = nodeId("narrative", narrative.id);
    for (const sourceId of relatedNarrativeSources(narrative)) {
      const possibleNodes = params.nodes.filter((item) => item.sourceId === sourceId);
      for (const item of possibleNodes) {
        addEdge(edges, nodes, edge({
          sourceNodeId: item.id,
          targetNodeId: narrativeNodeId,
          label: "synthesized into narrative",
          weight: 0.68,
          rationale: `${item.title} contributes to the executive narrative.`,
        }));
      }
    }
  }

  return Array.from(edges.values()).sort((left, right) => {
    if ((right.weight ?? 0) !== (left.weight ?? 0)) return (right.weight ?? 0) - (left.weight ?? 0);
    return left.id.localeCompare(right.id);
  });
}

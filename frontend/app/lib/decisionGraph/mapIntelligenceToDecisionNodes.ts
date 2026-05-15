import type { DecisionConfidence } from "../confidence/decisionConfidenceTypes.ts";
import type { DecisionRecommendation } from "../decision/decisionRecommendationTypes.ts";
import type { DomainScenario } from "../domain/domainScenarioTypes.ts";
import type { ExecutiveInsight } from "../intelligence/executiveInsightTypes.ts";
import type { StrategicMemoryRecord } from "../memory/strategicMemoryTypes.ts";
import type { ExecutiveMonitoringSignal } from "../monitoring/executiveMonitoringTypes.ts";
import type { ExecutiveNarrative } from "../narrative/narrativeSynthesisTypes.ts";
import type { ScenarioComparison } from "../scenario/scenarioCompareTypes.ts";
import type {
  DecisionGraphNodeType,
  DecisionGraphSeverity,
  StrategicDecisionGraphNode,
} from "./strategicDecisionGraphTypes.ts";

const DETERMINISTIC_CREATED_AT = 0;

function normalizeIdPart(value: unknown): string {
  return String(value ?? "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
}

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

function clampConfidence(value: unknown): number | undefined {
  if (typeof value !== "number" || !Number.isFinite(value)) return undefined;
  return Math.round(Math.min(1, Math.max(0, value)) * 100) / 100;
}

function severityFromPriority(value: unknown): DecisionGraphSeverity | undefined {
  if (value === "critical" || value === "high" || value === "medium" || value === "low") return value;
  return undefined;
}

function severityFromConfidence(confidence: DecisionConfidence): DecisionGraphSeverity {
  if (confidence.confidenceLevel === "low") return "high";
  if (confidence.confidenceLevel === "moderate") return "medium";
  return "low";
}

function nodeId(type: DecisionGraphNodeType, sourceId: unknown): string {
  return `decision_graph_${type}_${normalizeIdPart(sourceId) || "unknown"}`;
}

function node(params: {
  type: DecisionGraphNodeType;
  sourceId: string;
  title: string;
  summary?: string;
  relatedObjectIds?: string[];
  confidence?: number;
  severity?: DecisionGraphSeverity;
  createdAt?: number;
}): StrategicDecisionGraphNode {
  return {
    id: nodeId(params.type, params.sourceId),
    type: params.type,
    title: params.title,
    ...(params.summary ? { summary: params.summary } : {}),
    ...(params.relatedObjectIds?.length ? { relatedObjectIds: unique(params.relatedObjectIds) } : {}),
    sourceId: params.sourceId,
    ...(typeof params.confidence === "number" ? { confidence: params.confidence } : {}),
    ...(params.severity ? { severity: params.severity } : {}),
    createdAt: params.createdAt ?? DETERMINISTIC_CREATED_AT,
  };
}

function typeRank(type: DecisionGraphNodeType): number {
  const rank: Record<DecisionGraphNodeType, number> = {
    signal: 1,
    risk: 2,
    memory: 3,
    scenario: 4,
    comparison: 5,
    recommendation: 6,
    confidence: 7,
    monitoring: 8,
    narrative: 9,
  };
  return rank[type];
}

function severityRank(severity: DecisionGraphSeverity | undefined): number {
  if (severity === "critical") return 4;
  if (severity === "high") return 3;
  if (severity === "medium") return 2;
  if (severity === "low") return 1;
  return 0;
}

function dedupeAndSort(nodes: StrategicDecisionGraphNode[]): StrategicDecisionGraphNode[] {
  const byKey = new Map<string, StrategicDecisionGraphNode>();
  for (const item of nodes) {
    const key = `${item.type}|${item.sourceId ?? item.id}`;
    const current = byKey.get(key);
    if (!current || severityRank(item.severity) > severityRank(current.severity)) {
      byKey.set(key, item);
    }
  }
  return Array.from(byKey.values()).sort((left, right) => {
    if (typeRank(left.type) !== typeRank(right.type)) return typeRank(left.type) - typeRank(right.type);
    if (severityRank(right.severity) !== severityRank(left.severity)) return severityRank(right.severity) - severityRank(left.severity);
    if (left.createdAt !== right.createdAt) return left.createdAt - right.createdAt;
    return left.id.localeCompare(right.id);
  });
}

export function mapIntelligenceToDecisionNodes(params: {
  executiveInsights?: ExecutiveInsight[];
  scenarios?: DomainScenario[];
  comparisons?: ScenarioComparison[];
  recommendations?: DecisionRecommendation[];
  confidenceSignals?: DecisionConfidence[];
  monitoringSignals?: ExecutiveMonitoringSignal[];
  strategicMemory?: StrategicMemoryRecord[];
  narratives?: ExecutiveNarrative[];
}): StrategicDecisionGraphNode[] {
  const nodes: StrategicDecisionGraphNode[] = [];

  for (const insight of params.executiveInsights ?? []) {
    nodes.push(node({
      type: insight.category === "risk" || insight.category === "fragility" || insight.category === "dependency" ? "risk" : "signal",
      sourceId: insight.id,
      title: insight.title,
      summary: insight.summary,
      relatedObjectIds: insight.affectedObjectIds,
      confidence: clampConfidence(insight.confidence),
      severity: insight.severity,
      createdAt: insight.createdAt,
    }));
  }
  for (const scenario of params.scenarios ?? []) {
    nodes.push(node({
      type: "scenario",
      sourceId: scenario.id,
      title: scenario.title,
      summary: scenario.executiveSummary || scenario.description,
      relatedObjectIds: scenario.affectedObjectIds ?? scenario.relatedObjectIds,
      confidence: clampConfidence(scenario.confidence),
      severity: scenario.severity,
      createdAt: scenario.createdAt,
    }));
  }
  for (const comparison of params.comparisons ?? []) {
    nodes.push(node({
      type: "comparison",
      sourceId: comparison.id,
      title: comparison.comparisonTitle,
      summary: comparison.executiveSummary,
      relatedObjectIds: [],
      confidence: clampConfidence(0.5 + Math.max(-0.4, Math.min(0.4, comparison.confidenceDelta / 100))),
      createdAt: comparison.createdAt,
    }));
  }
  for (const recommendation of params.recommendations ?? []) {
    nodes.push(node({
      type: "recommendation",
      sourceId: recommendation.id,
      title: recommendation.title,
      summary: recommendation.summary,
      relatedObjectIds: recommendation.affectedObjectIds,
      confidence: clampConfidence(recommendation.confidence),
      severity: recommendation.priority,
      createdAt: recommendation.createdAt,
    }));
  }
  for (const confidence of params.confidenceSignals ?? []) {
    nodes.push(node({
      type: "confidence",
      sourceId: confidence.id,
      title: `${confidence.confidenceLevel.replace(/_/g, " ")} confidence`,
      summary: confidence.rationale,
      relatedObjectIds: [],
      confidence: clampConfidence(confidence.confidenceScore),
      severity: severityFromConfidence(confidence),
      createdAt: confidence.createdAt,
    }));
  }
  for (const signal of params.monitoringSignals ?? []) {
    nodes.push(node({
      type: "monitoring",
      sourceId: signal.id,
      title: signal.title,
      summary: signal.summary,
      relatedObjectIds: signal.relatedObjectIds,
      confidence: clampConfidence(signal.confidence),
      severity: severityFromPriority(signal.monitoringStatus),
      createdAt: signal.createdAt,
    }));
  }
  for (const record of params.strategicMemory ?? []) {
    nodes.push(node({
      type: "memory",
      sourceId: record.id,
      title: record.title,
      summary: record.summary,
      relatedObjectIds: record.relatedObjectIds,
      confidence: clampConfidence(record.confidence),
      severity: record.severity,
      createdAt: record.lastObservedAt,
    }));
  }
  for (const narrative of params.narratives ?? []) {
    nodes.push(node({
      type: "narrative",
      sourceId: narrative.id,
      title: narrative.headline,
      summary: narrative.summary,
      relatedObjectIds: narrative.relatedObjectIds,
      confidence: clampConfidence(narrative.confidence),
      severity: narrative.tone === "urgent" ? "critical" : narrative.tone === "cautionary" ? "high" : narrative.tone === "strategic" ? "medium" : "low",
      createdAt: narrative.createdAt,
    }));
  }

  return dedupeAndSort(nodes);
}

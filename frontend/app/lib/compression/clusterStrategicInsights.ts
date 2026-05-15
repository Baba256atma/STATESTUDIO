import type { DecisionConfidence } from "../confidence/decisionConfidenceTypes.ts";
import type { DecisionRecommendation } from "../decision/decisionRecommendationTypes.ts";
import type { ExecutiveInsight } from "../intelligence/executiveInsightTypes.ts";
import type { StrategicMemoryRecord } from "../memory/strategicMemoryTypes.ts";
import type { ExecutiveMonitoringSignal } from "../monitoring/executiveMonitoringTypes.ts";
import type { TimelineIntelligence } from "../timeline/timelineIntelligenceTypes.ts";
import type {
  StrategicCompressionPriority,
  StrategicInsightCluster,
} from "./strategicCompressionTypes.ts";

type Signal = {
  id: string;
  focus: string;
  relatedObjectIds: string[];
  priorityScore: number;
  domainId?: string;
  confidenceLevel?: DecisionConfidence["confidenceLevel"];
  scenarioIds?: string[];
};

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

function priorityFromScore(score: number): StrategicCompressionPriority {
  if (score >= 76) return "critical";
  if (score >= 54) return "high";
  if (score >= 28) return "medium";
  return "low";
}

function priorityScoreForPriority(priority: DecisionRecommendation["priority"]): number {
  if (priority === "critical") return 92;
  if (priority === "high") return 74;
  if (priority === "medium") return 48;
  return 22;
}

function priorityScoreForMemory(record: StrategicMemoryRecord): number {
  const severity = record.severity === "critical" ? 86 : record.severity === "high" ? 68 : record.severity === "medium" ? 42 : 22;
  return Math.min(100, severity + Math.min(18, (record.recurrenceCount ?? 1) * 4));
}

function priorityScoreForMonitoring(signal: ExecutiveMonitoringSignal): number {
  const status = signal.monitoringStatus === "critical" ? 88 : signal.monitoringStatus === "elevated" ? 70 : signal.monitoringStatus === "watch" ? 44 : 20;
  return Math.min(100, Math.round(status * 0.65 + signal.urgencyScore * 35));
}

function signalKey(signal: Signal): string {
  const objectPart = signal.relatedObjectIds.slice(0, 2).sort().join("_");
  const focusPart = normalizeIdPart(signal.focus).split("_").slice(0, 3).join("_");
  return `${signal.domainId ?? "general"}|${objectPart || focusPart || "global"}`;
}

function strongerConfidence(left?: DecisionConfidence["confidenceLevel"], right?: DecisionConfidence["confidenceLevel"]): DecisionConfidence["confidenceLevel"] | undefined {
  const rank = { low: 1, moderate: 2, high: 3, very_high: 4 } as const;
  if (!left) return right;
  if (!right) return left;
  return rank[right] > rank[left] ? right : left;
}

function collectSignals(params: {
  executiveInsights?: ExecutiveInsight[];
  monitoringSignals?: ExecutiveMonitoringSignal[];
  recommendations?: DecisionRecommendation[];
  timelineIntelligence?: TimelineIntelligence[];
  strategicMemory?: StrategicMemoryRecord[];
  confidenceSignals?: DecisionConfidence[];
}): Signal[] {
  const signals: Signal[] = [];
  for (const insight of params.executiveInsights ?? []) {
    signals.push({
      id: insight.id,
      focus: insight.recommendedFocus ?? insight.title,
      relatedObjectIds: insight.affectedObjectIds,
      priorityScore: insight.priorityScore,
      domainId: insight.domainId,
    });
  }
  for (const signal of params.monitoringSignals ?? []) {
    signals.push({
      id: signal.id,
      focus: signal.recommendedAttention ?? signal.title,
      relatedObjectIds: signal.relatedObjectIds,
      priorityScore: priorityScoreForMonitoring(signal),
      domainId: signal.domainId,
    });
  }
  for (const recommendation of params.recommendations ?? []) {
    signals.push({
      id: recommendation.id,
      focus: recommendation.recommendedFocus ?? recommendation.title,
      relatedObjectIds: recommendation.affectedObjectIds,
      priorityScore: priorityScoreForPriority(recommendation.priority),
      domainId: recommendation.domainId,
      scenarioIds: recommendation.relatedScenarioIds,
    });
  }
  for (const item of params.timelineIntelligence ?? []) {
    signals.push({
      id: item.id,
      focus: item.recommendedAttention ?? item.title,
      relatedObjectIds: item.relatedObjectIds,
      priorityScore: Math.round(item.momentumScore * 100),
      domainId: item.domainId,
    });
  }
  for (const record of params.strategicMemory ?? []) {
    signals.push({
      id: record.id,
      focus: record.title,
      relatedObjectIds: record.relatedObjectIds,
      priorityScore: priorityScoreForMemory(record),
      domainId: record.domainId,
      scenarioIds: record.relatedScenarioIds,
    });
  }
  for (const confidence of params.confidenceSignals ?? []) {
    signals.push({
      id: confidence.id,
      focus: confidence.relatedRecommendationId ?? "decision confidence",
      relatedObjectIds: [],
      priorityScore: Math.round(confidence.confidenceScore * 100),
      domainId: confidence.domainId,
      confidenceLevel: confidence.confidenceLevel,
    });
  }
  return signals;
}

export function clusterStrategicInsights(params: {
  executiveInsights?: ExecutiveInsight[];
  monitoringSignals?: ExecutiveMonitoringSignal[];
  recommendations?: DecisionRecommendation[];
  timelineIntelligence?: TimelineIntelligence[];
  strategicMemory?: StrategicMemoryRecord[];
  confidenceSignals?: DecisionConfidence[];
}): StrategicInsightCluster[] {
  const signals = collectSignals(params);
  const clusters = new Map<string, StrategicInsightCluster & { score: number }>();
  for (const signal of signals) {
    const key = signalKey(signal);
    const current = clusters.get(key);
    const nextScore = Math.max(current?.score ?? 0, signal.priorityScore);
    const relatedObjectIds = unique([...(current?.relatedObjectIds ?? []), ...signal.relatedObjectIds]);
    const signalIds = unique([...(current?.signalIds ?? []), signal.id]);
    const scenarioIds = unique([...(current?.scenarioIds ?? []), ...(signal.scenarioIds ?? [])]);
    clusters.set(key, {
      id: `strategic_cluster_${normalizeIdPart(key)}`,
      signalIds,
      scenarioIds,
      relatedObjectIds,
      focus: current?.focus ?? signal.focus,
      ...(current?.domainId || signal.domainId ? { domainId: current?.domainId ?? signal.domainId } : {}),
      priority: priorityFromScore(Math.min(100, nextScore + Math.min(12, signalIds.length * 2))),
      confidenceLevel: strongerConfidence(current?.confidenceLevel, signal.confidenceLevel),
      score: nextScore,
    });
  }
  return Array.from(clusters.values())
    .sort((left, right) => {
      const rank = { critical: 4, high: 3, medium: 2, low: 1 };
      if (rank[right.priority] !== rank[left.priority]) return rank[right.priority] - rank[left.priority];
      if (right.signalIds.length !== left.signalIds.length) return right.signalIds.length - left.signalIds.length;
      return left.id.localeCompare(right.id);
    })
    .map(({ score, ...cluster }) => cluster);
}

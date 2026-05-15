import type { DecisionConfidence } from "../confidence/decisionConfidenceTypes.ts";
import type { StrategicCompressedInsight } from "../compression/strategicCompressionTypes.ts";
import type { DecisionRecommendation } from "../decision/decisionRecommendationTypes.ts";
import type { StrategicMemoryRecord } from "../memory/strategicMemoryTypes.ts";
import type { ExecutiveMonitoringSignal } from "../monitoring/executiveMonitoringTypes.ts";
import type { TimelineIntelligence } from "../timeline/timelineIntelligenceTypes.ts";
import type {
  ExecutiveAlertLevel,
  ExecutiveAlertState,
} from "./executiveAlertTypes.ts";

function clamp01(value: number): number {
  return Math.min(1, Math.max(0, Number.isFinite(value) ? value : 0));
}

function priorityScore(priority: StrategicCompressedInsight["priority"] | DecisionRecommendation["priority"] | undefined): number {
  if (priority === "critical") return 1;
  if (priority === "high") return 0.76;
  if (priority === "medium") return 0.46;
  if (priority === "low") return 0.18;
  return 0;
}

function timelineScore(item: TimelineIntelligence | null | undefined): number {
  if (!item) return 0;
  const trend =
    item.trend === "critical" ? 1 :
    item.trend === "degrading" ? 0.78 :
    item.trend === "volatile" ? 0.64 :
    item.trend === "stable" ? 0.2 :
    0.1;
  return clamp01(trend * 0.55 + item.momentumScore * 0.45);
}

function memoryScore(record: StrategicMemoryRecord | null | undefined): number {
  if (!record) return 0;
  const recurrence = Math.min(1, (record.recurrenceCount ?? 1) / 4);
  const severity = record.severity === "critical" ? 1 : record.severity === "high" ? 0.78 : record.severity === "medium" ? 0.44 : 0.18;
  return clamp01(recurrence * 0.45 + severity * 0.55);
}

function monitoringScore(signal: ExecutiveMonitoringSignal | null | undefined): number {
  if (!signal) return 0;
  const status = signal.monitoringStatus === "critical" ? 1 : signal.monitoringStatus === "elevated" ? 0.74 : signal.monitoringStatus === "watch" ? 0.42 : 0.08;
  const trendBonus = signal.trend === "degrading" ? 0.1 : signal.trend === "volatile" ? 0.06 : signal.trend === "improving" ? -0.12 : 0;
  return clamp01(status * 0.62 + signal.urgencyScore * 0.38 + trendBonus);
}

function confidenceAdjustment(confidence: DecisionConfidence | null | undefined): number {
  if (!confidence) return 0;
  if (confidence.confidenceLevel === "very_high") return 0.08;
  if (confidence.confidenceLevel === "high") return 0.04;
  if (confidence.confidenceLevel === "low") return -0.1;
  return 0;
}

export function alertLevelFromEscalation(score: number): ExecutiveAlertLevel {
  if (score >= 0.82) return "critical";
  if (score >= 0.64) return "urgent";
  if (score >= 0.38) return "attention";
  return "info";
}

export function alertStateFromInputs(params: {
  level: ExecutiveAlertLevel;
  timeline?: TimelineIntelligence | null;
  monitoring?: ExecutiveMonitoringSignal | null;
}): ExecutiveAlertState {
  if (params.monitoring?.trend === "improving") return "stabilizing";
  if (params.level === "info" && params.timeline?.trend === "stable") return "resolved";
  if (params.level === "info") return "monitoring";
  if (params.level === "critical" || params.level === "urgent") return "active";
  return "new";
}

export function scoreExecutiveEscalation(params: {
  compressedInsight?: StrategicCompressedInsight | null;
  monitoring?: ExecutiveMonitoringSignal | null;
  memory?: StrategicMemoryRecord | null;
  timeline?: TimelineIntelligence | null;
  recommendation?: DecisionRecommendation | null;
  confidence?: DecisionConfidence | null;
}): number {
  const values = [
    priorityScore(params.compressedInsight?.priority),
    monitoringScore(params.monitoring),
    memoryScore(params.memory),
    timelineScore(params.timeline),
    priorityScore(params.recommendation?.priority),
  ];
  const strongest = Math.max(...values);
  const average = values.reduce((sum, value) => sum + value, 0) / values.length;
  return Math.round(clamp01(strongest * 0.7 + average * 0.3 + confidenceAdjustment(params.confidence)) * 100) / 100;
}

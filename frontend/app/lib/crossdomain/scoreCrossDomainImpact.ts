import type { ExecutiveAlert } from "../alerts/executiveAlertTypes.ts";
import type { StrategicCompressedInsight } from "../compression/strategicCompressionTypes.ts";
import type { ExecutiveInsight } from "../intelligence/executiveInsightTypes.ts";
import type { ExecutiveMonitoringSignal } from "../monitoring/executiveMonitoringTypes.ts";
import type {
  CrossDomainSeverity,
} from "./crossDomainTypes.ts";

function clamp01(value: number): number {
  return Math.min(1, Math.max(0, Number.isFinite(value) ? value : 0));
}

function severityWeight(value: string | undefined): number {
  if (value === "critical") return 1;
  if (value === "high" || value === "urgent") return 0.76;
  if (value === "medium" || value === "attention" || value === "elevated") return 0.48;
  if (value === "low" || value === "watch" || value === "info") return 0.22;
  return 0;
}

export function crossDomainSeverityFromScore(score: number): CrossDomainSeverity {
  if (score >= 0.82) return "critical";
  if (score >= 0.62) return "high";
  if (score >= 0.34) return "medium";
  return "low";
}

export function scoreCrossDomainImpact(params: {
  relatedObjectCount?: number;
  executiveInsights?: ExecutiveInsight[];
  monitoringSignals?: ExecutiveMonitoringSignal[];
  compressedInsights?: StrategicCompressedInsight[];
  alerts?: ExecutiveAlert[];
  ruleConfidence?: number;
}): number {
  const relatedObjectCount = Math.min(1, Math.max(0, (params.relatedObjectCount ?? 0) / 5));
  const insightSignal = Math.max(0, ...(params.executiveInsights ?? []).map((insight) => severityWeight(insight.severity)));
  const monitoringSignal = Math.max(0, ...(params.monitoringSignals ?? []).map((signal) => severityWeight(signal.monitoringStatus)));
  const compressedSignal = Math.max(0, ...(params.compressedInsights ?? []).map((insight) => severityWeight(insight.priority)));
  const alertSignal = Math.max(0, ...(params.alerts ?? []).map((alert) => severityWeight(alert.level)));
  const ruleConfidence = params.ruleConfidence ?? 0.5;
  return Math.round(clamp01(
    relatedObjectCount * 0.12 +
    insightSignal * 0.2 +
    monitoringSignal * 0.2 +
    compressedSignal * 0.22 +
    alertSignal * 0.18 +
    ruleConfidence * 0.08
  ) * 100) / 100;
}

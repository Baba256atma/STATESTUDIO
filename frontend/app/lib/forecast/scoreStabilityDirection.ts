import type { ExecutiveAlert } from "../alerts/executiveAlertTypes.ts";
import type { DecisionConfidence } from "../confidence/decisionConfidenceTypes.ts";
import type { EnterpriseFragilityZone } from "../fragilityMap/enterpriseFragilityMapTypes.ts";
import type { StrategicIntervention } from "../intervention/strategicInterventionTypes.ts";
import type { StrategicMemoryRecord } from "../memory/strategicMemoryTypes.ts";
import type { ExecutiveMonitoringSignal } from "../monitoring/executiveMonitoringTypes.ts";
import type { DecisionReviewRecord } from "../review/decisionReviewTypes.ts";
import type { TimelineIntelligence } from "../timeline/timelineIntelligenceTypes.ts";
import type {
  StabilityDirectionScore,
  StabilityForecastDirection,
} from "./executiveStabilityForecastTypes.ts";

function clamp01(value: number): number {
  return Math.round(Math.min(1, Math.max(0, Number.isFinite(value) ? value : 0)) * 100) / 100;
}

function average(values: number[]): number {
  if (!values.length) return 0;
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function alertPressure(alerts?: ExecutiveAlert[]): number {
  const rank = { critical: 1, urgent: 0.82, attention: 0.55, info: 0.18 };
  return Math.max(0, ...(alerts ?? []).map((alert) => rank[alert.level]));
}

function timelinePressure(items?: TimelineIntelligence[]): number {
  return average((items ?? []).map((item) => {
    if (item.trend === "critical") return 1;
    if (item.trend === "degrading") return 0.82;
    if (item.trend === "volatile") return 0.68;
    if (item.trend === "stable") return 0.28;
    return 0.12;
  }));
}

function monitoringPressure(signals?: ExecutiveMonitoringSignal[]): number {
  return average((signals ?? []).map((signal) => {
    if (signal.monitoringStatus === "critical") return 1;
    if (signal.monitoringStatus === "elevated") return 0.78;
    if (signal.monitoringStatus === "watch") return 0.45;
    return 0.16;
  }));
}

function fragilityPressure(zones?: EnterpriseFragilityZone[]): number {
  return Math.max(0, ...(zones ?? []).map((zone) => (
    (zone.propagationIntensity * 0.35) + ((zone.systemicReach ?? 0) * 0.35) + ((zone.fragilityScore / 100) * 0.3)
  )));
}

function interventionRelief(interventions?: StrategicIntervention[]): number {
  return Math.max(0, ...(interventions ?? []).map((item) => item.propagationReductionPotential ?? 0));
}

function recurrencePressure(memory?: StrategicMemoryRecord[]): number {
  return Math.min(1, (memory ?? []).reduce((sum, item) => sum + (item.recurrenceCount ?? 1), 0) / 10);
}

function reviewRelief(records?: DecisionReviewRecord[]): number {
  const top = (records ?? [])[0] ?? null;
  if (!top) return 0;
  if (top.reviewStatus === "stabilized" || top.reviewStatus === "resolved") return 0.72;
  if (top.reviewStatus === "monitoring") return 0.42;
  return 0;
}

function confidenceConsistency(signals?: DecisionConfidence[]): number {
  const values = (signals ?? []).map((item) => item.confidenceScore);
  if (!values.length) return 0.5;
  const avg = average(values);
  const spread = Math.max(...values) - Math.min(...values);
  return clamp01(avg - spread * 0.35);
}

function directionFromScores(params: {
  pressure: number;
  relief: number;
  consistency: number;
  volatileEvidence: boolean;
}): StabilityForecastDirection {
  const net = params.pressure - params.relief;
  if (params.volatileEvidence && Math.abs(net) < 0.22) return "uncertain";
  if (params.volatileEvidence && params.pressure >= 0.58) return "volatile";
  if (net >= 0.34) return "degrading";
  if (net <= -0.2) return "improving";
  if (params.consistency < 0.42) return "uncertain";
  return "stable";
}

export function scoreStabilityDirection(params: {
  timelineIntelligence?: TimelineIntelligence[];
  monitoringSignals?: ExecutiveMonitoringSignal[];
  strategicMemory?: StrategicMemoryRecord[];
  interventions?: StrategicIntervention[];
  fragilityZones?: EnterpriseFragilityZone[];
  decisionReviews?: DecisionReviewRecord[];
  confidenceSignals?: DecisionConfidence[];
  alerts?: ExecutiveAlert[];
}): StabilityDirectionScore {
  const pressure = clamp01(
    timelinePressure(params.timelineIntelligence) * 0.22 +
      monitoringPressure(params.monitoringSignals) * 0.2 +
      fragilityPressure(params.fragilityZones) * 0.24 +
      recurrencePressure(params.strategicMemory) * 0.12 +
      alertPressure(params.alerts) * 0.22
  );
  const relief = clamp01(
    interventionRelief(params.interventions) * 0.58 +
      reviewRelief(params.decisionReviews) * 0.42
  );
  const consistency = confidenceConsistency(params.confidenceSignals);
  const volatileEvidence = Boolean(
    (params.timelineIntelligence ?? []).some((item) => item.trend === "volatile") ||
      (params.monitoringSignals ?? []).some((item) => item.trend === "volatile") ||
      (params.alerts ?? []).some((item) => item.level === "urgent" || item.level === "critical")
  );
  const direction = directionFromScores({ pressure, relief, consistency, volatileEvidence });
  const confidence = clamp01(0.36 + consistency * 0.28 + Math.abs(pressure - relief) * 0.28 - (volatileEvidence ? 0.1 : 0));

  return {
    direction,
    score: clamp01(pressure - relief + 0.5),
    confidence,
  };
}

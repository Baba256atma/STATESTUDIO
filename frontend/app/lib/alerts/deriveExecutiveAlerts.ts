import type { DecisionConfidence } from "../confidence/decisionConfidenceTypes.ts";
import type { StrategicCompressedInsight } from "../compression/strategicCompressionTypes.ts";
import type { DecisionRecommendation } from "../decision/decisionRecommendationTypes.ts";
import type { StrategicMemoryRecord } from "../memory/strategicMemoryTypes.ts";
import type { ExecutiveMonitoringSignal } from "../monitoring/executiveMonitoringTypes.ts";
import type { TimelineIntelligence } from "../timeline/timelineIntelligenceTypes.ts";
import {
  buildExecutiveAlertRationale,
  buildExecutiveAlertSummary,
  buildExecutiveAlertTitle,
  buildRecommendedAlertAttention,
} from "./executiveAlertNarratives.ts";
import {
  alertLevelFromEscalation,
  alertStateFromInputs,
  scoreExecutiveEscalation,
} from "./scoreExecutiveEscalation.ts";
import { suppressExecutiveAlerts } from "./suppressExecutiveAlerts.ts";
import type {
  ExecutiveAlert,
  ExecutiveAlertOverlayState,
} from "./executiveAlertTypes.ts";

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

function topMemory(records: StrategicMemoryRecord[]): StrategicMemoryRecord | null {
  return records.slice().sort((left, right) => {
    if ((right.recurrenceCount ?? 1) !== (left.recurrenceCount ?? 1)) return (right.recurrenceCount ?? 1) - (left.recurrenceCount ?? 1);
    return left.id.localeCompare(right.id);
  })[0] ?? null;
}

function topConfidence(records: DecisionConfidence[]): DecisionConfidence | null {
  return records.slice().sort((left, right) => {
    if (right.confidenceScore !== left.confidenceScore) return right.confidenceScore - left.confidenceScore;
    return left.id.localeCompare(right.id);
  })[0] ?? null;
}

function escalationReason(params: {
  compressedInsight?: StrategicCompressedInsight | null;
  monitoring?: ExecutiveMonitoringSignal | null;
  memory?: StrategicMemoryRecord | null;
  timeline?: TimelineIntelligence | null;
}): string {
  if (params.compressedInsight?.priority === "critical") return "critical compressed executive pressure";
  if (params.monitoring?.monitoringStatus === "critical") return "critical monitoring instability";
  if ((params.memory?.recurrenceCount ?? 1) >= 3) return "persistent strategic recurrence";
  if (params.timeline?.trend === "degrading" || params.timeline?.trend === "critical") return "degrading timeline momentum";
  return "current executive monitoring context";
}

function alertFromInputs(params: {
  domainId?: string;
  compressedInsight?: StrategicCompressedInsight | null;
  monitoring?: ExecutiveMonitoringSignal | null;
  memory?: StrategicMemoryRecord | null;
  timeline?: TimelineIntelligence | null;
  recommendation?: DecisionRecommendation | null;
  confidence?: DecisionConfidence | null;
}): ExecutiveAlert | null {
  const score = scoreExecutiveEscalation(params);
  const level = alertLevelFromEscalation(score);
  if (level === "info" && params.monitoring?.monitoringStatus !== "watch") return null;

  const focus =
    params.compressedInsight?.executiveFocus ??
    params.monitoring?.recommendedAttention ??
    params.recommendation?.recommendedFocus ??
    params.timeline?.recommendedAttention ??
    params.memory?.title ??
    "operational pressure";
  const reason = escalationReason(params);
  const relatedObjectIds = unique([
    ...(params.compressedInsight?.relatedObjectIds ?? []),
    ...(params.monitoring?.relatedObjectIds ?? []),
    ...(params.memory?.relatedObjectIds ?? []),
    ...(params.timeline?.relatedObjectIds ?? []),
    ...(params.recommendation?.affectedObjectIds ?? []),
  ]);
  const relatedInsightIds = unique([
    ...(params.compressedInsight?.supportingInsightIds ?? []),
    params.monitoring?.id,
    params.timeline?.id,
    params.memory?.id,
    params.confidence?.id,
  ]);
  const relatedScenarioIds = unique([
    ...(params.compressedInsight?.supportingScenarioIds ?? []),
    ...(params.recommendation?.relatedScenarioIds ?? []),
    ...(params.memory?.relatedScenarioIds ?? []),
  ]);

  return {
    id: `executive_alert_${normalizeIdPart(params.domainId ?? params.compressedInsight?.domainId ?? params.monitoring?.domainId ?? "general")}_${normalizeIdPart(level)}_${normalizeIdPart(focus)}`,
    title: buildExecutiveAlertTitle({ level, focus }),
    summary: buildExecutiveAlertSummary({ level, focus }),
    level,
    relatedObjectIds,
    ...(relatedInsightIds.length ? { relatedInsightIds } : {}),
    ...(relatedScenarioIds.length ? { relatedScenarioIds } : {}),
    rationale: buildExecutiveAlertRationale({ level, reason }),
    confidence: Math.round(Math.min(0.96, Math.max(0.22, params.confidence?.confidenceScore ?? params.monitoring?.confidence ?? score)) * 100) / 100,
    escalationReason: reason,
    recommendedAttention: buildRecommendedAlertAttention({ level, focus }),
    ...(params.domainId ?? params.compressedInsight?.domainId ?? params.monitoring?.domainId ? { domainId: params.domainId ?? params.compressedInsight?.domainId ?? params.monitoring?.domainId } : {}),
    createdAt: DETERMINISTIC_CREATED_AT,
  };
}

function logAlert(alert: ExecutiveAlert, debug?: boolean, suppressionState = "active"): void {
  if (!debug) return;
  const runtime = globalThis as typeof globalThis & {
    process?: { env?: { NODE_ENV?: string } };
  };
  if (runtime.process?.env?.NODE_ENV !== "development") return;
  console.debug("[Nexora][ExecutiveAlert]", {
    alertLevel: alert.level,
    escalationReason: alert.escalationReason ?? null,
    confidence: alert.confidence ?? null,
    relatedObjects: alert.relatedObjectIds,
    suppressionState,
  });
}

export function deriveExecutiveAlerts(params: {
  domainId?: string;
  compressedInsights?: StrategicCompressedInsight[];
  monitoringSignals?: ExecutiveMonitoringSignal[];
  strategicMemory?: StrategicMemoryRecord[];
  timelineIntelligence?: TimelineIntelligence[];
  recommendations?: DecisionRecommendation[];
  confidenceSignals?: DecisionConfidence[];
  previousAlerts?: ExecutiveAlert[];
  debug?: boolean;
}): ExecutiveAlert[] {
  const compressedInsights = Array.isArray(params.compressedInsights) ? params.compressedInsights.slice() : [];
  const monitoringSignals = Array.isArray(params.monitoringSignals) ? params.monitoringSignals.slice() : [];
  const strategicMemory = Array.isArray(params.strategicMemory) ? params.strategicMemory.slice() : [];
  const timelineIntelligence = Array.isArray(params.timelineIntelligence) ? params.timelineIntelligence.slice() : [];
  const recommendations = Array.isArray(params.recommendations) ? params.recommendations.slice() : [];
  const confidenceSignals = Array.isArray(params.confidenceSignals) ? params.confidenceSignals.slice() : [];

  if (!compressedInsights.length && !monitoringSignals.length && !strategicMemory.length && !timelineIntelligence.length && !recommendations.length && !confidenceSignals.length) {
    return [];
  }

  const candidates: ExecutiveAlert[] = [];
  const primary = alertFromInputs({
    domainId: params.domainId,
    compressedInsight: compressedInsights[0] ?? null,
    monitoring: monitoringSignals[0] ?? null,
    memory: topMemory(strategicMemory),
    timeline: timelineIntelligence[0] ?? null,
    recommendation: recommendations[0] ?? null,
    confidence: topConfidence(confidenceSignals),
  });
  if (primary) candidates.push(primary);

  for (const monitoring of monitoringSignals.slice(1, 3)) {
    const alert = alertFromInputs({
      domainId: params.domainId,
      monitoring,
      confidence: topConfidence(confidenceSignals),
    });
    if (alert) candidates.push(alert);
  }

  const alerts = suppressExecutiveAlerts({
    alerts: candidates,
    previousAlerts: params.previousAlerts,
  });
  for (const alert of alerts.slice(0, 3)) logAlert(alert, params.debug);
  return alerts;
}

export function buildExecutiveAlertOverlayState(params: {
  alerts: ExecutiveAlert[];
}): ExecutiveAlertOverlayState {
  const alerts = Array.isArray(params.alerts) ? params.alerts : [];
  const top = alerts[0] ?? null;
  const state = top
    ? alertStateFromInputs({ level: top.level })
    : "resolved";
  return {
    ...(top ? { topAlertId: top.id } : {}),
    level: top?.level ?? "info",
    state,
    executiveSummary: top?.summary ?? "No executive alert requires attention right now.",
    relatedObjectIds: unique(alerts.flatMap((alert) => alert.relatedObjectIds)),
    activeAlertCount: alerts.length,
  };
}

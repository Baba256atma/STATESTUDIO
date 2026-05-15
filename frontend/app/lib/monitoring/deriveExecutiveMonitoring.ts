import type { DomainFragilityScore } from "../domain/domainFragilityScoring.ts";
import type { DomainPropagationHint } from "../domain/domainPropagationHints.ts";
import type { DomainScenario } from "../domain/domainScenarioTypes.ts";
import type { DecisionRecommendation } from "../decision/decisionRecommendationTypes.ts";
import type { StrategicMemoryRecord } from "../memory/strategicMemoryTypes.ts";
import type { TimelineIntelligence } from "../timeline/timelineIntelligenceTypes.ts";
import {
  buildMonitoringAttention,
  buildMonitoringSummary,
  buildMonitoringTitle,
} from "./monitoringNarratives.ts";
import {
  lifecycleFromMonitoring,
  monitoringStatusFromUrgency,
  monitoringTrendFromInputs,
  scoreMonitoringUrgency,
} from "./scoreMonitoringUrgency.ts";
import type {
  ExecutiveMonitoringOverlayState,
  ExecutiveMonitoringSignal,
  MonitoringLifecycle,
  MonitoringStatus,
} from "./executiveMonitoringTypes.ts";

const DETERMINISTIC_CREATED_AT = 0;
const MAX_MONITORING_SIGNALS = 5;

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

function confidenceFrom(values: Array<number | undefined>): number {
  const usable = values.filter((value): value is number => typeof value === "number" && Number.isFinite(value));
  if (!usable.length) return 0.35;
  const average = usable.reduce((sum, value) => sum + value, 0) / usable.length;
  return Math.round(Math.min(0.96, Math.max(0.18, average)) * 100) / 100;
}

function topFragility(scores: DomainFragilityScore[]): DomainFragilityScore | null {
  return scores
    .slice()
    .sort((left, right) => {
      if (right.score !== left.score) return right.score - left.score;
      return left.objectId.localeCompare(right.objectId);
    })[0] ?? null;
}

function focusFrom(params: {
  timeline?: TimelineIntelligence | null;
  memory?: StrategicMemoryRecord | null;
  recommendation?: DecisionRecommendation | null;
  scenario?: DomainScenario | null;
  fragility?: DomainFragilityScore | null;
}): string {
  return params.recommendation?.recommendedFocus ??
    params.timeline?.recommendedAttention ??
    params.memory?.title ??
    params.scenario?.recommendedFocus ??
    params.scenario?.title ??
    params.fragility?.objectId ??
    "operational pressure";
}

function signal(params: {
  source: string;
  domainId?: string;
  focus: string;
  relatedObjectIds: string[];
  timeline?: TimelineIntelligence | null;
  memory?: StrategicMemoryRecord | null;
  recommendation?: DecisionRecommendation | null;
  scenario?: DomainScenario | null;
  propagationHints?: DomainPropagationHint[];
  fragility?: DomainFragilityScore | null;
}): ExecutiveMonitoringSignal {
  const urgencyScore = scoreMonitoringUrgency({
    timeline: params.timeline,
    memory: params.memory,
    recommendation: params.recommendation,
    propagationHints: params.propagationHints,
    fragility: params.fragility,
  });
  const monitoringStatus = monitoringStatusFromUrgency(urgencyScore);
  const trend = monitoringTrendFromInputs({
    timeline: params.timeline,
    memory: params.memory,
    recommendation: params.recommendation,
    fragility: params.fragility,
  });
  return {
    id: `monitoring_${normalizeIdPart(params.domainId ?? "general")}_${normalizeIdPart(params.source)}_${normalizeIdPart(params.focus)}`,
    title: buildMonitoringTitle({ status: monitoringStatus, focus: params.focus }),
    summary: buildMonitoringSummary({ status: monitoringStatus, trend, focus: params.focus }),
    relatedObjectIds: unique(params.relatedObjectIds),
    monitoringStatus,
    trend,
    confidence: confidenceFrom([
      params.timeline?.confidence,
      params.memory?.confidence,
      params.recommendation?.confidence,
      params.scenario?.confidence,
      urgencyScore,
    ]),
    urgencyScore,
    recommendedAttention: buildMonitoringAttention({ status: monitoringStatus, trend, focus: params.focus }),
    ...(params.domainId ? { domainId: params.domainId } : {}),
    createdAt: DETERMINISTIC_CREATED_AT,
  };
}

function dedupeSignals(signals: ExecutiveMonitoringSignal[]): ExecutiveMonitoringSignal[] {
  const byId = new Map<string, ExecutiveMonitoringSignal>();
  for (const item of signals) {
    const existing = byId.get(item.id);
    if (!existing || item.urgencyScore > existing.urgencyScore) byId.set(item.id, item);
  }
  return Array.from(byId.values()).sort((left, right) => {
    if (right.urgencyScore !== left.urgencyScore) return right.urgencyScore - left.urgencyScore;
    return left.id.localeCompare(right.id);
  });
}

function logMonitoring(signal: ExecutiveMonitoringSignal, lifecycle: MonitoringLifecycle, debug?: boolean): void {
  if (!debug) return;
  const runtime = globalThis as typeof globalThis & {
    process?: { env?: { NODE_ENV?: string } };
  };
  if (runtime.process?.env?.NODE_ENV !== "development") return;
  console.debug("[Nexora][ExecutiveMonitoring]", {
    monitoringStatus: signal.monitoringStatus,
    urgencyScore: signal.urgencyScore,
    lifecycle,
    trend: signal.trend ?? null,
    relatedObjects: signal.relatedObjectIds,
  });
}

export function deriveExecutiveMonitoringSignals(params: {
  domainId?: string;
  timelineIntelligence?: TimelineIntelligence[];
  strategicMemory?: StrategicMemoryRecord[];
  recommendations?: DecisionRecommendation[];
  scenarios?: DomainScenario[];
  propagationHints?: DomainPropagationHint[];
  fragilityScores?: DomainFragilityScore[];
  debug?: boolean;
}): ExecutiveMonitoringSignal[] {
  const timeline = Array.isArray(params.timelineIntelligence) ? params.timelineIntelligence.slice() : [];
  const memory = Array.isArray(params.strategicMemory) ? params.strategicMemory.slice() : [];
  const recommendations = Array.isArray(params.recommendations) ? params.recommendations.slice() : [];
  const scenarios = Array.isArray(params.scenarios) ? params.scenarios.slice() : [];
  const propagationHints = Array.isArray(params.propagationHints) ? params.propagationHints.slice() : [];
  const fragilityScores = Array.isArray(params.fragilityScores) ? params.fragilityScores.slice() : [];

  if (!timeline.length && !memory.length && !recommendations.length && !scenarios.length && !propagationHints.length && !fragilityScores.length) {
    return [];
  }

  const topTimeline = timeline[0] ?? null;
  const topMemory = memory
    .slice()
    .sort((left, right) => {
      if ((right.recurrenceCount ?? 1) !== (left.recurrenceCount ?? 1)) return (right.recurrenceCount ?? 1) - (left.recurrenceCount ?? 1);
      return left.id.localeCompare(right.id);
    })[0] ?? null;
  const topRecommendation = recommendations[0] ?? null;
  const topScenario = scenarios[0] ?? null;
  const fragile = topFragility(fragilityScores);
  const focus = focusFrom({
    timeline: topTimeline,
    memory: topMemory,
    recommendation: topRecommendation,
    scenario: topScenario,
    fragility: fragile,
  });
  const commonObjects = unique([
    ...(topTimeline?.relatedObjectIds ?? []),
    ...(topMemory?.relatedObjectIds ?? []),
    ...(topRecommendation?.affectedObjectIds ?? []),
    ...(topScenario?.affectedObjectIds ?? []),
    ...(topScenario?.relatedObjectIds ?? []),
    ...(fragile ? [fragile.objectId] : []),
    ...propagationHints.slice(0, 4).flatMap((hint) => [hint.sourceObjectId, hint.targetObjectId]),
  ]);

  const signals: ExecutiveMonitoringSignal[] = [
    signal({
      source: "operational_state",
      domainId: params.domainId ?? topTimeline?.domainId ?? topMemory?.domainId ?? topRecommendation?.domainId ?? topScenario?.domainId,
      focus,
      relatedObjectIds: commonObjects,
      timeline: topTimeline,
      memory: topMemory,
      recommendation: topRecommendation,
      scenario: topScenario,
      propagationHints,
      fragility: fragile,
    }),
  ];

  if (topMemory && (topMemory.recurrenceCount ?? 1) >= 2) {
    signals.push(signal({
      source: "strategic_memory",
      domainId: params.domainId ?? topMemory.domainId,
      focus: topMemory.title,
      relatedObjectIds: topMemory.relatedObjectIds,
      memory: topMemory,
      propagationHints,
    }));
  }

  if (fragile && fragile.level !== "stable") {
    signals.push(signal({
      source: "fragility",
      domainId: params.domainId,
      focus: `${fragile.objectId} fragility`,
      relatedObjectIds: [fragile.objectId],
      propagationHints,
      fragility: fragile,
    }));
  }

  const sorted = dedupeSignals(signals).slice(0, MAX_MONITORING_SIGNALS);
  for (const item of sorted.slice(0, 3)) {
    logMonitoring(item, lifecycleFromMonitoring({
      status: item.monitoringStatus,
      trend: item.trend,
      recurrenceCount: topMemory?.recurrenceCount,
    }), params.debug);
  }
  return sorted;
}

export function buildExecutiveMonitoringOverlayState(params: {
  signals: ExecutiveMonitoringSignal[];
}): ExecutiveMonitoringOverlayState {
  const signals = Array.isArray(params.signals) ? params.signals : [];
  const top = signals[0] ?? null;
  const monitoringStatus: MonitoringStatus = top?.monitoringStatus ?? "stable";
  const lifecycle = lifecycleFromMonitoring({
    status: monitoringStatus,
    trend: top?.trend,
    recurrenceCount: signals.length > 1 ? 2 : 1,
  });
  return {
    ...(top ? { topSignalId: top.id } : {}),
    monitoringStatus,
    lifecycle,
    urgencyScore: top?.urgencyScore ?? 0,
    relatedObjectIds: unique(signals.flatMap((item) => item.relatedObjectIds)),
    executiveSummary: top?.summary ?? "No executive monitoring signal is active yet.",
  };
}

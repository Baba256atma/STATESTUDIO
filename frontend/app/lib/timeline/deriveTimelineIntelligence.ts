import type { DomainFragilityScore } from "../domain/domainFragilityScoring.ts";
import type { DomainPropagationHint } from "../domain/domainPropagationHints.ts";
import type { DomainScenario } from "../domain/domainScenarioTypes.ts";
import type { DomainTimelineFrame } from "../domain/domainTimelinePropagation.ts";
import type { DecisionRecommendation } from "../decision/decisionRecommendationTypes.ts";
import type { ExecutiveInsight } from "../intelligence/executiveInsightTypes.ts";
import {
  buildExecutiveImpact,
  buildRecommendedTimelineAttention,
  buildTimelineSummary,
  buildTimelineTitle,
} from "./timelineNarratives.ts";
import {
  scoreTimelineMomentum,
  stageFromTimelineTrend,
  trendFromTimelineMomentum,
} from "./scoreTimelineMomentum.ts";
import type {
  TimelineIntelligence,
  TimelineIntelligenceOverlayState,
  TimelineMemorySnapshot,
  TimelineStage,
  TimelineTrend,
} from "./timelineIntelligenceTypes.ts";

const DETERMINISTIC_CREATED_AT = 0;
const MAX_TIMELINE_INTELLIGENCE = 5;

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

function focusFromInputs(params: {
  insights: ExecutiveInsight[];
  recommendations: DecisionRecommendation[];
  scenarios: DomainScenario[];
  fragilityScores: DomainFragilityScore[];
}): string {
  return params.recommendations[0]?.recommendedFocus ??
    params.insights[0]?.recommendedFocus ??
    params.insights[0]?.title ??
    params.scenarios[0]?.recommendedFocus ??
    params.scenarios[0]?.title ??
    params.fragilityScores[0]?.objectId ??
    "current operational pressure";
}

function relatedObjectIdsFor(params: {
  insights: ExecutiveInsight[];
  recommendations: DecisionRecommendation[];
  scenarios: DomainScenario[];
  propagationHints: DomainPropagationHint[];
  fragilityScores: DomainFragilityScore[];
}): string[] {
  return unique([
    ...(params.recommendations[0]?.affectedObjectIds ?? []),
    ...(params.insights[0]?.affectedObjectIds ?? []),
    ...(params.scenarios[0]?.affectedObjectIds ?? []),
    ...(params.scenarios[0]?.relatedObjectIds ?? []),
    ...params.propagationHints.slice(0, 3).flatMap((hint) => [hint.sourceObjectId, hint.targetObjectId]),
    ...params.fragilityScores.slice(0, 2).map((score) => score.objectId),
  ]);
}

function historyFromFrames(frames: DomainTimelineFrame[]): DomainPropagationHint[] {
  return frames.flatMap((frame) =>
    frame.activePropagationEvents.map((event) => ({
      sourceObjectId: event.sourceObjectId,
      targetObjectId: event.targetObjectId,
      propagationStrength: event.propagationStrength,
      propagationType: event.propagationType === "capacity" ? "dependency" : event.propagationType,
    }))
  );
}

function confidenceFrom(params: {
  momentumScore: number;
  insights: ExecutiveInsight[];
  recommendations: DecisionRecommendation[];
  scenarios: DomainScenario[];
}): number {
  const signals = [
    params.insights[0]?.confidence,
    params.recommendations[0]?.confidence,
    params.scenarios[0]?.confidence,
    params.momentumScore,
  ].filter((value): value is number => typeof value === "number" && Number.isFinite(value));
  if (!signals.length) return 0.35;
  const average = signals.reduce((sum, value) => sum + value, 0) / signals.length;
  return Math.round(Math.min(0.96, Math.max(0.18, average)) * 100) / 100;
}

function logTimelineIntelligence(params: {
  item: TimelineIntelligence;
  timelineStage: TimelineStage;
  debug?: boolean;
}): void {
  if (!params.debug) return;
  const runtime = globalThis as typeof globalThis & {
    process?: { env?: { NODE_ENV?: string } };
  };
  if (runtime.process?.env?.NODE_ENV !== "development") return;
  console.debug("[Nexora][TimelineIntelligence]", {
    trend: params.item.trend,
    momentumScore: params.item.momentumScore,
    executiveImpact: params.item.executiveImpact ?? null,
    timelineStage: params.timelineStage,
    relatedObjects: params.item.relatedObjectIds,
  });
}

export function deriveTimelineIntelligence(params: {
  domainId?: string;
  insights?: ExecutiveInsight[];
  recommendations?: DecisionRecommendation[];
  scenarios?: DomainScenario[];
  propagationHints?: DomainPropagationHint[];
  propagationFrames?: DomainTimelineFrame[];
  fragilityScores?: DomainFragilityScore[];
  memory?: TimelineMemorySnapshot | null;
  debug?: boolean;
}): TimelineIntelligence[] {
  const insights = Array.isArray(params.insights) ? params.insights.slice() : [];
  const recommendations = Array.isArray(params.recommendations) ? params.recommendations.slice() : [];
  const scenarios = Array.isArray(params.scenarios) ? params.scenarios.slice() : [];
  const propagationHints = [
    ...(Array.isArray(params.propagationHints) ? params.propagationHints : []),
    ...historyFromFrames(Array.isArray(params.propagationFrames) ? params.propagationFrames : []),
  ];
  const fragilityScores = Array.isArray(params.fragilityScores) ? params.fragilityScores.slice() : [];

  if (!insights.length && !recommendations.length && !scenarios.length && !propagationHints.length && !fragilityScores.length) {
    return [];
  }

  const focus = focusFromInputs({ insights, recommendations, scenarios, fragilityScores });
  const momentumScore = scoreTimelineMomentum({
    insights,
    recommendations,
    scenarios,
    propagationHints,
    fragilityScores,
    memory: params.memory,
  });
  const trend = trendFromTimelineMomentum({
    momentumScore,
    insights,
    recommendations,
    propagationHints,
    memory: params.memory,
  });
  const timelineStage = stageFromTimelineTrend({
    trend,
    momentumScore,
    hasRecommendations: recommendations.length > 0,
  });
  const item: TimelineIntelligence = {
    id: `timeline_intel_${normalizeIdPart(params.domainId ?? "general")}_${normalizeIdPart(trend)}_${normalizeIdPart(focus)}`,
    title: buildTimelineTitle({ trend, focus }),
    summary: buildTimelineSummary({ trend, focus }),
    relatedObjectIds: relatedObjectIdsFor({ insights, recommendations, scenarios, propagationHints, fragilityScores }),
    trend,
    momentumScore,
    confidence: confidenceFrom({ momentumScore, insights, recommendations, scenarios }),
    executiveImpact: buildExecutiveImpact({ trend, focus }),
    recommendedAttention: buildRecommendedTimelineAttention({ trend, focus }),
    ...(params.domainId ? { domainId: params.domainId } : {}),
    createdAt: DETERMINISTIC_CREATED_AT,
  };

  logTimelineIntelligence({ item, timelineStage, debug: params.debug });
  return [item].slice(0, MAX_TIMELINE_INTELLIGENCE);
}

export function buildTimelineIntelligenceOverlayState(params: {
  intelligence: TimelineIntelligence[];
}): TimelineIntelligenceOverlayState {
  const intelligence = Array.isArray(params.intelligence) ? params.intelligence : [];
  const top = intelligence[0] ?? null;
  const trend: TimelineTrend = top?.trend ?? "stable";
  const timelineStage = stageFromTimelineTrend({
    trend,
    momentumScore: top?.momentumScore ?? 0,
    hasRecommendations: Boolean(top),
  });
  return {
    ...(top ? { topTimelineIntelligenceId: top.id } : {}),
    trend,
    timelineStage,
    momentumScore: top?.momentumScore ?? 0,
    relatedObjectIds: unique(intelligence.flatMap((item) => item.relatedObjectIds)),
    executiveSummary: top?.summary ?? "No timeline intelligence is available yet.",
  };
}

export function buildTimelineMemorySnapshot(params: {
  previous?: TimelineIntelligence | null;
  recommendation?: DecisionRecommendation | null;
  propagationHints?: DomainPropagationHint[];
}): TimelineMemorySnapshot {
  const hints = Array.isArray(params.propagationHints) ? params.propagationHints : [];
  const previousPropagationIntensity = hints.length
    ? hints.reduce((sum, hint) => sum + hint.propagationStrength, 0) / hints.length
    : undefined;
  return {
    ...(params.previous?.trend ? { previousTrend: params.previous.trend } : {}),
    ...(params.recommendation?.priority ? { previousRecommendationPriority: params.recommendation.priority } : {}),
    ...(typeof previousPropagationIntensity === "number" ? { previousPropagationIntensity } : {}),
  };
}

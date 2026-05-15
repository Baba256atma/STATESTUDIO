import type { DomainFragilityScore } from "../domain/domainFragilityScoring.ts";
import type { DomainPropagationHint } from "../domain/domainPropagationHints.ts";
import type { DomainScenario } from "../domain/domainScenarioTypes.ts";
import type { ExecutiveInsight } from "../intelligence/executiveInsightTypes.ts";
import type { DecisionRecommendation } from "../decision/decisionRecommendationTypes.ts";
import type {
  TimelineMemorySnapshot,
  TimelineStage,
  TimelineTrend,
} from "./timelineIntelligenceTypes.ts";

function clamp01(value: unknown): number {
  const number = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(number)) return 0;
  return Math.min(1, Math.max(0, number));
}

function severityWeight(value: unknown): number {
  if (value === "critical") return 1;
  if (value === "high") return 0.75;
  if (value === "medium") return 0.45;
  if (value === "low") return 0.2;
  return 0.25;
}

function priorityWeight(value: unknown): number {
  if (value === "critical") return 1;
  if (value === "high") return 0.72;
  if (value === "medium") return 0.42;
  if (value === "low") return 0.18;
  return 0.25;
}

export function scoreTimelineMomentum(params: {
  insights?: ExecutiveInsight[];
  recommendations?: DecisionRecommendation[];
  scenarios?: DomainScenario[];
  propagationHints?: DomainPropagationHint[];
  fragilityScores?: DomainFragilityScore[];
  memory?: TimelineMemorySnapshot | null;
}): number {
  const insights = Array.isArray(params.insights) ? params.insights : [];
  const recommendations = Array.isArray(params.recommendations) ? params.recommendations : [];
  const scenarios = Array.isArray(params.scenarios) ? params.scenarios : [];
  const propagationHints = Array.isArray(params.propagationHints) ? params.propagationHints : [];
  const fragilityScores = Array.isArray(params.fragilityScores) ? params.fragilityScores : [];

  const topInsight = insights[0] ?? null;
  const topRecommendation = recommendations[0] ?? null;
  const maxFragility = fragilityScores.reduce((max, score) => Math.max(max, score.score / 100), 0);
  const propagationIntensity = propagationHints.length
    ? propagationHints.reduce((sum, hint) => sum + clamp01(hint.propagationStrength), 0) / propagationHints.length
    : 0;
  const propagationReach = Math.min(1, new Set(propagationHints.flatMap((hint) => [hint.sourceObjectId, hint.targetObjectId])).size / 8);
  const scenarioPressure = scenarios.reduce((max, scenario) => Math.max(max, severityWeight(scenario.severity) * clamp01(scenario.confidence)), 0);
  const insightPressure = topInsight
    ? severityWeight(topInsight.severity) * clamp01(topInsight.confidence) * Math.min(1, topInsight.priorityScore / 100)
    : 0;
  const recommendationPressure = topRecommendation
    ? priorityWeight(topRecommendation.priority) * clamp01(topRecommendation.confidence)
    : 0;
  const previousIntensity = clamp01(params.memory?.previousPropagationIntensity);
  const drift = propagationIntensity > previousIntensity ? Math.min(0.18, propagationIntensity - previousIntensity) : 0;

  const raw =
    insightPressure * 0.26 +
    recommendationPressure * 0.2 +
    maxFragility * 0.18 +
    propagationIntensity * 0.15 +
    propagationReach * 0.1 +
    scenarioPressure * 0.08 +
    drift;

  return Math.round(clamp01(raw) * 100) / 100;
}

export function trendFromTimelineMomentum(params: {
  momentumScore: number;
  insights?: ExecutiveInsight[];
  recommendations?: DecisionRecommendation[];
  propagationHints?: DomainPropagationHint[];
  memory?: TimelineMemorySnapshot | null;
}): TimelineTrend {
  const momentum = clamp01(params.momentumScore);
  const topInsight = (params.insights ?? [])[0] ?? null;
  const topRecommendation = (params.recommendations ?? [])[0] ?? null;
  const propagationHints = params.propagationHints ?? [];
  const averagePropagation = propagationHints.length
    ? propagationHints.reduce((sum, hint) => sum + clamp01(hint.propagationStrength), 0) / propagationHints.length
    : 0;
  const previousIntensity = clamp01(params.memory?.previousPropagationIntensity);

  if (topInsight?.severity === "critical" || topRecommendation?.priority === "critical" || momentum >= 0.82) return "critical";
  if (averagePropagation > previousIntensity + 0.12 || momentum >= 0.62) return "degrading";
  if (params.memory?.previousTrend === "critical" && momentum < 0.42) return "improving";
  if (momentum >= 0.42 && averagePropagation > 0.35 && averagePropagation < 0.72) return "volatile";
  if (momentum <= 0.22 && params.memory?.previousTrend === "degrading") return "improving";
  return "stable";
}

export function stageFromTimelineTrend(params: {
  trend: TimelineTrend;
  momentumScore: number;
  hasRecommendations?: boolean;
}): TimelineStage {
  if (params.trend === "critical" || params.momentumScore >= 0.75) return "active_risk";
  if (params.trend === "degrading" || params.trend === "volatile") return "emerging_pressure";
  if (params.trend === "improving") return "stabilization";
  if (params.hasRecommendations) return "monitoring";
  return "early_signal";
}

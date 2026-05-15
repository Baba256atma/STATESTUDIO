import type { DomainScenarioComparison } from "../domain/domainScenarioComparison.ts";
import type { DecisionRecommendation } from "../decision/decisionRecommendationTypes.ts";
import type { ExecutiveInsight } from "../intelligence/executiveInsightTypes.ts";
import type { StrategicMemoryRecord } from "../memory/strategicMemoryTypes.ts";
import type { ExecutiveMonitoringSignal } from "../monitoring/executiveMonitoringTypes.ts";
import type { ScenarioComparison } from "../scenario/scenarioCompareTypes.ts";
import type { TimelineIntelligence } from "../timeline/timelineIntelligenceTypes.ts";
import {
  buildConfidenceRationale,
  confidenceLevelFromScore,
  summarizeConfidence,
} from "./confidenceNarratives.ts";
import { deriveUncertaintyFactors } from "./deriveUncertaintyFactors.ts";
import { scoreDecisionConfidence } from "./scoreDecisionConfidence.ts";
import type {
  DecisionConfidence,
  DecisionConfidenceOverlayState,
} from "./decisionConfidenceTypes.ts";

const DETERMINISTIC_CREATED_AT = 0;
const MAX_CONFIDENCE_RECORDS = 5;

function normalizeIdPart(value: unknown): string {
  return String(value ?? "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
}

function unique(values: unknown[], limit = 4): string[] {
  const seen = new Set<string>();
  const result: string[] = [];
  for (const value of values) {
    const text = String(value ?? "").trim();
    if (!text || seen.has(text)) continue;
    seen.add(text);
    result.push(text);
    if (result.length >= limit) break;
  }
  return result;
}

function comparisonHasDirection(comparison: ScenarioComparison | DomainScenarioComparison): boolean {
  if ("comparisonSummary" in comparison) return Boolean(comparison.recommendation);
  return Boolean(comparison.recommendedScenarioId);
}

function supportingSignals(params: {
  recommendation?: DecisionRecommendation | null;
  timelineIntelligence: TimelineIntelligence[];
  strategicMemory: StrategicMemoryRecord[];
  executiveInsights: ExecutiveInsight[];
  monitoringSignals: ExecutiveMonitoringSignal[];
  scenarioComparisons: Array<ScenarioComparison | DomainScenarioComparison>;
}): string[] {
  const values: string[] = [];
  if ((params.recommendation?.confidence ?? 0) >= 0.72) values.push("Recommendation evidence is internally consistent.");
  if (params.timelineIntelligence.some((item) => item.trend === "stable" || item.trend === "improving")) values.push("Timeline behavior is stable or improving.");
  if (params.strategicMemory.some((record) => (record.recurrenceCount ?? 1) >= 2 && (record.confidence ?? 0) >= 0.65)) values.push("Strategic memory provides repeated operational evidence.");
  if (params.executiveInsights.some((insight) => insight.confidence >= 0.72)) values.push("Executive insight confidence is strong.");
  if (params.monitoringSignals.some((signal) => signal.monitoringStatus === "stable" || signal.monitoringStatus === "watch")) values.push("Monitoring state remains controlled.");
  if (params.scenarioComparisons.some(comparisonHasDirection)) {
    values.push("Scenario comparison provides directional separation.");
  }
  return unique(values);
}

function logDecisionConfidence(record: DecisionConfidence, debug?: boolean): void {
  if (!debug) return;
  const runtime = globalThis as typeof globalThis & {
    process?: { env?: { NODE_ENV?: string } };
  };
  if (runtime.process?.env?.NODE_ENV !== "development") return;
  console.debug("[Nexora][DecisionConfidence]", {
    confidenceLevel: record.confidenceLevel,
    confidenceScore: record.confidenceScore,
    uncertaintyFactors: record.uncertaintyFactors ?? [],
    relatedRecommendation: record.relatedRecommendationId ?? null,
    signalConsistency: record.supportingSignals?.length ?? 0,
  });
}

export function deriveDecisionConfidence(params: {
  domainId?: string;
  recommendations?: DecisionRecommendation[];
  timelineIntelligence?: TimelineIntelligence[];
  strategicMemory?: StrategicMemoryRecord[];
  executiveInsights?: ExecutiveInsight[];
  monitoringSignals?: ExecutiveMonitoringSignal[];
  scenarioComparisons?: Array<ScenarioComparison | DomainScenarioComparison>;
  debug?: boolean;
}): DecisionConfidence[] {
  const recommendations = Array.isArray(params.recommendations) ? params.recommendations.slice() : [];
  const timelineIntelligence = Array.isArray(params.timelineIntelligence) ? params.timelineIntelligence.slice() : [];
  const strategicMemory = Array.isArray(params.strategicMemory) ? params.strategicMemory.slice() : [];
  const executiveInsights = Array.isArray(params.executiveInsights) ? params.executiveInsights.slice() : [];
  const monitoringSignals = Array.isArray(params.monitoringSignals) ? params.monitoringSignals.slice() : [];
  const scenarioComparisons = Array.isArray(params.scenarioComparisons) ? params.scenarioComparisons.slice() : [];

  if (!recommendations.length && !timelineIntelligence.length && !strategicMemory.length && !executiveInsights.length && !monitoringSignals.length && !scenarioComparisons.length) {
    return [];
  }

  const uncertaintyFactors = deriveUncertaintyFactors({
    timelineIntelligence,
    strategicMemory,
    monitoringSignals,
    scenarioComparisons,
  });
  const baseRecommendation = recommendations[0] ?? null;
  const records = (recommendations.length ? recommendations : [null]).slice(0, MAX_CONFIDENCE_RECORDS).map((recommendation) => {
    const score = scoreDecisionConfidence({
      recommendation,
      timelineIntelligence,
      strategicMemory,
      executiveInsights,
      monitoringSignals,
      scenarioComparisons,
      uncertaintyFactors,
    });
    const level = confidenceLevelFromScore(score);
    const focus = recommendation?.recommendedFocus ?? recommendation?.title ?? baseRecommendation?.recommendedFocus ?? "current recommendation";
    const support = supportingSignals({
      recommendation,
      timelineIntelligence,
      strategicMemory,
      executiveInsights,
      monitoringSignals,
      scenarioComparisons,
    });
    return {
      id: `decision_confidence_${normalizeIdPart(params.domainId ?? recommendation?.domainId ?? "general")}_${normalizeIdPart(recommendation?.id ?? focus)}`,
      ...(recommendation?.id ? { relatedRecommendationId: recommendation.id } : {}),
      confidenceLevel: level,
      confidenceScore: score,
      rationale: buildConfidenceRationale({
        level,
        focus,
        supportingSignalCount: support.length,
        uncertaintyCount: uncertaintyFactors.length,
      }),
      uncertaintyFactors,
      supportingSignals: support,
      ...(params.domainId || recommendation?.domainId ? { domainId: params.domainId ?? recommendation?.domainId } : {}),
      createdAt: DETERMINISTIC_CREATED_AT,
    } satisfies DecisionConfidence;
  }).sort((left, right) => {
    if (right.confidenceScore !== left.confidenceScore) return right.confidenceScore - left.confidenceScore;
    return left.id.localeCompare(right.id);
  });

  for (const record of records.slice(0, 3)) logDecisionConfidence(record, params.debug);
  return records;
}

export function buildDecisionConfidenceOverlayState(params: {
  confidence: DecisionConfidence[];
}): DecisionConfidenceOverlayState {
  const confidence = Array.isArray(params.confidence) ? params.confidence : [];
  const top = confidence[0] ?? null;
  const uncertaintyFactors = unique(confidence.flatMap((item) => item.uncertaintyFactors ?? []));
  const supportingSignals = unique(confidence.flatMap((item) => item.supportingSignals ?? []));
  return {
    ...(top ? { topConfidenceId: top.id } : {}),
    confidenceLevel: top?.confidenceLevel ?? "low",
    confidenceScore: top?.confidenceScore ?? 0,
    uncertaintyFactors,
    supportingSignals,
    executiveSummary: top
      ? summarizeConfidence({
          level: top.confidenceLevel,
          score: top.confidenceScore,
          uncertaintyFactors: top.uncertaintyFactors,
        })
      : "No decision confidence signal is available yet.",
  };
}

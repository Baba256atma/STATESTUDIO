import type { DecisionConfidence } from "../confidence/decisionConfidenceTypes.ts";
import type { DecisionRecommendation } from "../decision/decisionRecommendationTypes.ts";
import type { EnterpriseFragilityZone } from "../fragilityMap/enterpriseFragilityMapTypes.ts";
import type { StrategicIntervention } from "../intervention/strategicInterventionTypes.ts";
import type { StrategicMemoryRecord } from "../memory/strategicMemoryTypes.ts";
import type { ExecutiveMonitoringSignal } from "../monitoring/executiveMonitoringTypes.ts";
import type { TimelineIntelligence } from "../timeline/timelineIntelligenceTypes.ts";
import {
  deriveLessonsLearned,
  deriveStrategicHindsight,
} from "./deriveStrategicHindsight.ts";
import type {
  DecisionEvolutionChange,
  DecisionReviewOverlayState,
  DecisionReviewRecord,
  DecisionReviewStatus,
} from "./decisionReviewTypes.ts";
import {
  buildDecisionReviewRationale,
  buildDecisionReviewSummary,
  buildDecisionReviewTitle,
} from "./reviewNarratives.ts";
import { trackDecisionEvolution } from "./trackDecisionEvolution.ts";

const DETERMINISTIC_CREATED_AT = 0;
const MAX_REVIEW_RECORDS = 5;

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

function average(values: unknown[]): number | undefined {
  const numbers = values.filter((value): value is number => typeof value === "number" && Number.isFinite(value));
  if (!numbers.length) return undefined;
  return Math.round((numbers.reduce((sum, value) => sum + Math.min(1, Math.max(0, value)), 0) / numbers.length) * 100) / 100;
}

function focusFor(params: {
  currentRecommendations?: DecisionRecommendation[];
  previousRecommendations?: DecisionRecommendation[];
  currentInterventions?: StrategicIntervention[];
  strategicMemory?: StrategicMemoryRecord[];
}): string {
  return params.currentRecommendations?.[0]?.recommendedFocus ??
    params.currentRecommendations?.[0]?.title ??
    params.currentInterventions?.[0]?.title ??
    params.previousRecommendations?.[0]?.title ??
    params.strategicMemory?.[0]?.title ??
    "Strategic decision";
}

function statusFromChanges(params: {
  changes: DecisionEvolutionChange[];
  currentMonitoringSignals?: ExecutiveMonitoringSignal[];
  currentFragilityZones?: EnterpriseFragilityZone[];
  currentRecommendations?: DecisionRecommendation[];
}): DecisionReviewStatus {
  if (params.changes.some((change) => change.type === "recommendation_changed")) return "superseded";
  if (params.changes.some((change) => change.type === "fragility_changed" && change.currentState === "reduced")) return "stabilized";
  if ((params.currentMonitoringSignals ?? []).some((signal) => signal.monitoringStatus === "stable" || signal.monitoringStatus === "watch")) return "monitoring";
  if (!(params.currentRecommendations ?? []).length && !(params.currentFragilityZones ?? []).length) return "resolved";
  return "active";
}

function relatedScenarioIds(params: {
  changes: DecisionEvolutionChange[];
  currentRecommendations?: DecisionRecommendation[];
  previousRecommendations?: DecisionRecommendation[];
  timelineIntelligence?: TimelineIntelligence[];
}): string[] {
  return unique([
    ...(params.currentRecommendations ?? []).flatMap((item) => item.relatedScenarioIds ?? []),
    ...(params.previousRecommendations ?? []).flatMap((item) => item.relatedScenarioIds ?? []),
  ]);
}

function logDecisionReview(record: DecisionReviewRecord, changes: DecisionEvolutionChange[], debug?: boolean): void {
  if (!debug) return;
  const runtime = globalThis as typeof globalThis & {
    process?: { env?: { NODE_ENV?: string } };
  };
  if (runtime.process?.env?.NODE_ENV !== "development") return;
  const confidenceChange = changes.find((change) => change.type === "confidence_changed");
  console.debug("[Nexora][DecisionReview]", {
    reviewStatus: record.reviewStatus,
    previousState: record.previousState ?? null,
    currentState: record.currentState ?? null,
    confidenceDrift: confidenceChange?.confidenceDrift ?? 0,
    relatedRecommendations: record.relatedRecommendationIds ?? [],
  });
}

export function deriveDecisionReviews(params: {
  previousRecommendations?: DecisionRecommendation[];
  currentRecommendations?: DecisionRecommendation[];
  previousConfidenceSignals?: DecisionConfidence[];
  currentConfidenceSignals?: DecisionConfidence[];
  previousMonitoringSignals?: ExecutiveMonitoringSignal[];
  currentMonitoringSignals?: ExecutiveMonitoringSignal[];
  previousFragilityZones?: EnterpriseFragilityZone[];
  currentFragilityZones?: EnterpriseFragilityZone[];
  previousInterventions?: StrategicIntervention[];
  currentInterventions?: StrategicIntervention[];
  timelineIntelligence?: TimelineIntelligence[];
  strategicMemory?: StrategicMemoryRecord[];
  previousRecords?: DecisionReviewRecord[];
  now?: number;
  debug?: boolean;
}): DecisionReviewRecord[] {
  const changes = trackDecisionEvolution(params);
  const focus = focusFor(params);
  const reviewStatus = statusFromChanges({
    changes,
    currentMonitoringSignals: params.currentMonitoringSignals,
    currentFragilityZones: params.currentFragilityZones,
    currentRecommendations: params.currentRecommendations,
  });
  if (!changes.length && !(params.currentRecommendations ?? []).length && !(params.currentInterventions ?? []).length) {
    return [];
  }

  const relatedRecommendationIds = unique([
    ...changes.flatMap((change) => change.relatedRecommendationIds),
    ...(params.currentRecommendations ?? []).map((item) => item.id),
    ...(params.previousRecommendations ?? []).map((item) => item.id),
  ]);
  const relatedObjectIds = unique([
    ...changes.flatMap((change) => change.relatedObjectIds),
    ...(params.currentRecommendations ?? []).flatMap((item) => item.affectedObjectIds),
    ...(params.currentInterventions ?? []).flatMap((item) => item.relatedObjectIds),
    ...(params.currentFragilityZones ?? []).flatMap((item) => item.relatedObjectIds),
    ...(params.currentMonitoringSignals ?? []).flatMap((item) => item.relatedObjectIds),
  ]);
  const previousState = changes[0]?.previousState;
  const currentState = changes[0]?.currentState;
  const confidence = average([
    ...(params.currentRecommendations ?? []).map((item) => item.confidence),
    ...(params.currentConfidenceSignals ?? []).map((item) => item.confidenceScore),
    ...(params.currentMonitoringSignals ?? []).map((item) => item.confidence),
    ...(params.currentInterventions ?? []).map((item) => item.confidence),
  ]);
  const lessonsLearned = unique([
    ...deriveStrategicHindsight({ changes }),
    ...deriveLessonsLearned({ changes }),
  ]);
  const scenarioIds = relatedScenarioIds({ ...params, changes });
  const record: DecisionReviewRecord = {
    id: `decision_review_${normalizeIdPart(focus)}_${normalizeIdPart(reviewStatus)}`,
    title: buildDecisionReviewTitle({ status: reviewStatus, focus }),
    summary: buildDecisionReviewSummary({ status: reviewStatus, previousState, currentState }),
    ...(relatedRecommendationIds.length ? { relatedRecommendationIds } : {}),
    ...(scenarioIds.length ? { relatedScenarioIds: scenarioIds } : {}),
    ...(relatedObjectIds.length ? { relatedObjectIds } : {}),
    ...(previousState ? { previousState } : {}),
    ...(currentState ? { currentState } : {}),
    reviewStatus,
    ...(typeof confidence === "number" ? { confidence } : {}),
    rationale: buildDecisionReviewRationale({
      status: reviewStatus,
      confidenceDrift: changes.find((change) => change.type === "confidence_changed")?.confidenceDrift,
    }),
    ...(lessonsLearned.length ? { lessonsLearned } : {}),
    createdAt: DETERMINISTIC_CREATED_AT,
    updatedAt: typeof params.now === "number" ? params.now : DETERMINISTIC_CREATED_AT,
  };

  logDecisionReview(record, changes, params.debug);
  const merged = [record, ...(params.previousRecords ?? [])];
  const deduped = new Map<string, DecisionReviewRecord>();
  for (const item of merged) {
    const current = deduped.get(item.id);
    if (!current || (item.updatedAt ?? item.createdAt) >= (current.updatedAt ?? current.createdAt)) {
      deduped.set(item.id, item);
    }
  }
  return Array.from(deduped.values()).sort((left, right) => {
    const rank: Record<DecisionReviewStatus, number> = {
      active: 5,
      superseded: 4,
      stabilized: 3,
      monitoring: 2,
      resolved: 1,
    };
    if (rank[right.reviewStatus] !== rank[left.reviewStatus]) return rank[right.reviewStatus] - rank[left.reviewStatus];
    return left.id.localeCompare(right.id);
  }).slice(0, MAX_REVIEW_RECORDS);
}

export function buildDecisionReviewOverlayState(params: {
  records: DecisionReviewRecord[];
}): DecisionReviewOverlayState {
  const records = Array.isArray(params.records) ? params.records : [];
  const top = records[0] ?? null;
  return {
    ...(top ? { topReviewId: top.id } : {}),
    status: top?.reviewStatus ?? "monitoring",
    headline: top?.title ?? "No decision review record is available yet.",
    executiveSummary: top?.summary ?? "Nexora is waiting for enough decision evidence to form a review record.",
    relatedObjectIds: unique(records.flatMap((record) => record.relatedObjectIds ?? [])),
  };
}

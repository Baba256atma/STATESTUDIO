import type { ExecutiveAlert } from "../alerts/executiveAlertTypes.ts";
import type { DecisionConfidence } from "../confidence/decisionConfidenceTypes.ts";
import type { EnterpriseFragilityZone } from "../fragilityMap/enterpriseFragilityMapTypes.ts";
import type { StrategicIntervention } from "../intervention/strategicInterventionTypes.ts";
import type { StrategicMemoryRecord } from "../memory/strategicMemoryTypes.ts";
import type { ExecutiveMonitoringSignal } from "../monitoring/executiveMonitoringTypes.ts";
import type { DecisionReviewRecord } from "../review/decisionReviewTypes.ts";
import type { TimelineIntelligence } from "../timeline/timelineIntelligenceTypes.ts";
import { deriveForecastUncertaintyFactors } from "./deriveForecastUncertaintyFactors.ts";
import type {
  ExecutiveStabilityForecast,
  ExecutiveStabilityForecastOverlayState,
  StabilityForecastDirection,
} from "./executiveStabilityForecastTypes.ts";
import { scoreStabilityDirection } from "./scoreStabilityDirection.ts";
import {
  buildForecastRationale,
  buildStabilityForecastSummary,
  buildStabilityForecastTitle,
} from "./stabilityForecastNarratives.ts";

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

function focusFor(params: {
  monitoringSignals?: ExecutiveMonitoringSignal[];
  interventions?: StrategicIntervention[];
  fragilityZones?: EnterpriseFragilityZone[];
  timelineIntelligence?: TimelineIntelligence[];
  alerts?: ExecutiveAlert[];
}): string {
  return params.alerts?.[0]?.recommendedAttention ??
    params.monitoringSignals?.[0]?.recommendedAttention ??
    params.interventions?.[0]?.title ??
    params.fragilityZones?.[0]?.title ??
    params.timelineIntelligence?.[0]?.recommendedAttention ??
    params.timelineIntelligence?.[0]?.title ??
    "Operational stability";
}

function stabilizeDirection(params: {
  candidate: StabilityForecastDirection;
  previousForecast?: ExecutiveStabilityForecast | null;
  uncertaintyFactors: string[];
  materialShift: boolean;
}): StabilityForecastDirection {
  const previous = params.previousForecast?.direction;
  if (!previous || previous === params.candidate) return params.candidate;
  if (params.uncertaintyFactors.length >= 2) return "uncertain";
  if (!params.materialShift) return previous;
  return params.candidate;
}

function materialShift(params: {
  currentScore: number;
  previousForecast?: ExecutiveStabilityForecast | null;
}): boolean {
  const previousConfidence = params.previousForecast?.confidence;
  if (typeof previousConfidence !== "number") return true;
  return Math.abs(params.currentScore - previousConfidence) >= 0.16;
}

function collectDomainIds(params: {
  interventions?: StrategicIntervention[];
  fragilityZones?: EnterpriseFragilityZone[];
  timelineIntelligence?: TimelineIntelligence[];
  monitoringSignals?: ExecutiveMonitoringSignal[];
  alerts?: ExecutiveAlert[];
}): string[] {
  return unique([
    ...(params.interventions ?? []).flatMap((item) => item.domainIds ?? []),
    ...(params.fragilityZones ?? []).flatMap((item) => item.domainIds ?? []),
    ...(params.timelineIntelligence ?? []).map((item) => item.domainId),
    ...(params.monitoringSignals ?? []).map((item) => item.domainId),
    ...(params.alerts ?? []).map((item) => item.domainId),
  ]);
}

function logForecast(forecast: ExecutiveStabilityForecast, debug?: boolean): void {
  if (!debug) return;
  const runtime = globalThis as typeof globalThis & {
    process?: { env?: { NODE_ENV?: string } };
  };
  if (runtime.process?.env?.NODE_ENV !== "development") return;
  console.debug("[Nexora][ExecutiveStabilityForecast]", {
    direction: forecast.direction,
    confidence: forecast.confidence,
    uncertaintyFactors: forecast.uncertaintyFactors ?? [],
    monitoringFocus: forecast.monitoringFocus ?? null,
    relatedObjects: forecast.relatedObjectIds,
  });
}

export function deriveExecutiveStabilityForecast(params: {
  timelineIntelligence?: TimelineIntelligence[];
  monitoringSignals?: ExecutiveMonitoringSignal[];
  strategicMemory?: StrategicMemoryRecord[];
  interventions?: StrategicIntervention[];
  fragilityZones?: EnterpriseFragilityZone[];
  decisionReviews?: DecisionReviewRecord[];
  confidenceSignals?: DecisionConfidence[];
  alerts?: ExecutiveAlert[];
  previousForecast?: ExecutiveStabilityForecast | null;
  debug?: boolean;
}): ExecutiveStabilityForecast | null {
  const hasEvidence = Boolean(
    (params.timelineIntelligence ?? []).length ||
      (params.monitoringSignals ?? []).length ||
      (params.strategicMemory ?? []).length ||
      (params.interventions ?? []).length ||
      (params.fragilityZones ?? []).length ||
      (params.decisionReviews ?? []).length ||
      (params.confidenceSignals ?? []).length ||
      (params.alerts ?? []).length
  );
  if (!hasEvidence) return null;

  const scored = scoreStabilityDirection(params);
  const uncertaintyFactors = deriveForecastUncertaintyFactors(params);
  const direction = stabilizeDirection({
    candidate: scored.direction,
    previousForecast: params.previousForecast,
    uncertaintyFactors,
    materialShift: materialShift({
      currentScore: scored.confidence,
      previousForecast: params.previousForecast,
    }),
  });
  const focus = focusFor(params);
  const relatedObjectIds = unique([
    ...(params.timelineIntelligence ?? []).flatMap((item) => item.relatedObjectIds),
    ...(params.monitoringSignals ?? []).flatMap((item) => item.relatedObjectIds),
    ...(params.interventions ?? []).flatMap((item) => item.relatedObjectIds),
    ...(params.fragilityZones ?? []).flatMap((item) => item.relatedObjectIds),
    ...(params.decisionReviews ?? []).flatMap((item) => item.relatedObjectIds ?? []),
    ...(params.alerts ?? []).flatMap((item) => item.relatedObjectIds),
  ]);
  const relatedZoneIds = unique((params.fragilityZones ?? []).map((zone) => zone.id));
  const relatedRecommendationIds = unique([
    ...(params.interventions ?? []).flatMap((item) => item.targetZoneIds ?? []),
    ...(params.decisionReviews ?? []).flatMap((item) => item.relatedRecommendationIds ?? []),
    ...(params.confidenceSignals ?? []).map((item) => item.relatedRecommendationId),
  ]);
  const forecast: ExecutiveStabilityForecast = {
    id: `executive_stability_forecast_${normalizeIdPart(direction)}_${normalizeIdPart(focus)}`,
    title: buildStabilityForecastTitle({ direction, focus }),
    summary: buildStabilityForecastSummary({ direction, focus }),
    direction,
    relatedObjectIds,
    ...(relatedZoneIds.length ? { relatedZoneIds } : {}),
    ...(relatedRecommendationIds.length ? { relatedRecommendationIds } : {}),
    confidence: scored.confidence,
    ...(uncertaintyFactors.length ? { uncertaintyFactors } : {}),
    monitoringFocus: focus,
    executiveRationale: buildForecastRationale({ direction }),
    ...(collectDomainIds(params).length ? { domainIds: collectDomainIds(params) } : {}),
    createdAt: DETERMINISTIC_CREATED_AT,
  };

  logForecast(forecast, params.debug);
  return forecast;
}

export function buildExecutiveStabilityForecastOverlayState(params: {
  forecast: ExecutiveStabilityForecast | null;
}): ExecutiveStabilityForecastOverlayState {
  const forecast = params.forecast;
  return {
    ...(forecast ? { topForecastId: forecast.id } : {}),
    direction: forecast?.direction ?? "uncertain",
    headline: forecast?.title ?? "No stability outlook is available yet.",
    executiveSummary: forecast?.summary ?? "Nexora is waiting for enough evidence to form a near-term stability outlook.",
    monitoringFocus: forecast?.monitoringFocus ?? "Maintain current executive monitoring.",
    confidence: forecast?.confidence ?? 0,
  };
}

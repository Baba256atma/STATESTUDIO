import type { ExecutiveStabilityForecast } from "../forecast/executiveStabilityForecastTypes.ts";
import type { EnterpriseFragilityZone } from "../fragilityMap/enterpriseFragilityMapTypes.ts";
import type { ExecutiveMonitoringSignal } from "../monitoring/executiveMonitoringTypes.ts";
import type { DecisionReviewRecord } from "../review/decisionReviewTypes.ts";
import type { StabilityBaseline } from "./strategicDriftTypes.ts";

const DETERMINISTIC_CREATED_AT = 0;

function clamp01(value: number): number {
  return Math.round(Math.min(1, Math.max(0, Number.isFinite(value) ? value : 0)) * 100) / 100;
}

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

function addBaseline(map: Map<string, StabilityBaseline>, baseline: StabilityBaseline): void {
  const key = baseline.relatedObjectIds.slice().sort().join("|") || baseline.id;
  const current = map.get(key);
  if (!current || baseline.stabilityScore > current.stabilityScore) {
    map.set(key, baseline);
  }
}

export function deriveStabilityBaseline(params: {
  decisionReviews?: DecisionReviewRecord[];
  forecasts?: ExecutiveStabilityForecast[];
  monitoringSignals?: ExecutiveMonitoringSignal[];
  fragilityZones?: EnterpriseFragilityZone[];
}): StabilityBaseline[] {
  const baselines = new Map<string, StabilityBaseline>();

  for (const review of params.decisionReviews ?? []) {
    if (review.reviewStatus !== "stabilized" && review.reviewStatus !== "resolved") continue;
    const relatedObjectIds = unique(review.relatedObjectIds ?? []);
    if (!relatedObjectIds.length) continue;
    addBaseline(baselines, {
      id: `stability_baseline_review_${normalizeIdPart(review.id)}`,
      relatedObjectIds,
      relatedZoneIds: [],
      sourceIds: [review.id],
      baselineStrength: review.reviewStatus === "resolved" ? 0.84 : 0.76,
      stabilityScore: clamp01((review.confidence ?? 0.7) * (review.reviewStatus === "resolved" ? 0.95 : 0.86)),
      domainIds: [],
      createdAt: DETERMINISTIC_CREATED_AT,
    });
  }

  for (const forecast of params.forecasts ?? []) {
    if (forecast.direction !== "improving" && forecast.direction !== "stable") continue;
    const relatedObjectIds = unique(forecast.relatedObjectIds);
    if (!relatedObjectIds.length) continue;
    addBaseline(baselines, {
      id: `stability_baseline_forecast_${normalizeIdPart(forecast.id)}`,
      relatedObjectIds,
      relatedZoneIds: unique(forecast.relatedZoneIds ?? []),
      sourceIds: [forecast.id],
      baselineStrength: forecast.direction === "improving" ? 0.72 : 0.68,
      stabilityScore: clamp01((forecast.confidence ?? 0.6) * (forecast.direction === "improving" ? 0.9 : 0.82)),
      domainIds: unique(forecast.domainIds ?? []),
      createdAt: DETERMINISTIC_CREATED_AT,
    });
  }

  for (const signal of params.monitoringSignals ?? []) {
    if (signal.monitoringStatus !== "stable" || signal.trend === "degrading" || signal.trend === "volatile") continue;
    const relatedObjectIds = unique(signal.relatedObjectIds);
    if (!relatedObjectIds.length) continue;
    addBaseline(baselines, {
      id: `stability_baseline_monitoring_${normalizeIdPart(signal.id)}`,
      relatedObjectIds,
      relatedZoneIds: [],
      sourceIds: [signal.id],
      baselineStrength: 0.62,
      stabilityScore: clamp01((signal.confidence ?? 0.55) * 0.82),
      domainIds: unique([signal.domainId]),
      createdAt: DETERMINISTIC_CREATED_AT,
    });
  }

  for (const zone of params.fragilityZones ?? []) {
    if (zone.propagationIntensity > 0.25 || zone.fragilityScore > 35) continue;
    const relatedObjectIds = unique(zone.relatedObjectIds);
    if (!relatedObjectIds.length) continue;
    addBaseline(baselines, {
      id: `stability_baseline_zone_${normalizeIdPart(zone.id)}`,
      relatedObjectIds,
      relatedZoneIds: [zone.id],
      sourceIds: [zone.id],
      baselineStrength: 0.58,
      stabilityScore: clamp01(1 - Math.max(zone.propagationIntensity, zone.fragilityScore / 100)),
      domainIds: unique(zone.domainIds ?? []),
      createdAt: DETERMINISTIC_CREATED_AT,
    });
  }

  return Array.from(baselines.values()).sort((left, right) => {
    if (right.stabilityScore !== left.stabilityScore) return right.stabilityScore - left.stabilityScore;
    return left.id.localeCompare(right.id);
  });
}

import type { EnterpriseCoordinationInsight } from "../coordination/enterpriseCoordinationTypes.ts";
import type { ExecutiveStabilityForecast } from "../forecast/executiveStabilityForecastTypes.ts";
import type { EnterpriseFragilityZone } from "../fragilityMap/enterpriseFragilityMapTypes.ts";
import type { StrategicIntervention } from "../intervention/strategicInterventionTypes.ts";
import type { StrategicMemoryRecord } from "../memory/strategicMemoryTypes.ts";
import type { ExecutiveMonitoringSignal } from "../monitoring/executiveMonitoringTypes.ts";
import type { DecisionReviewRecord } from "../review/decisionReviewTypes.ts";
import { deriveStabilityBaseline } from "./deriveStabilityBaseline.ts";
import {
  buildDriftAttentionGuidance,
  buildStrategicDriftExecutiveImpact,
  buildStrategicDriftSummary,
  buildStrategicDriftTitle,
} from "./strategicDriftNarratives.ts";
import type {
  StabilityBaseline,
  StrategicDriftOverlayState,
  StrategicDriftSignal,
  StrategicDriftType,
} from "./strategicDriftTypes.ts";
import { scoreStrategicDriftIntensity } from "./scoreStrategicDriftIntensity.ts";

const DETERMINISTIC_CREATED_AT = 0;
const MAX_DRIFT_SIGNALS = 6;

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

function overlaps(left: string[], right: string[]): boolean {
  const set = new Set(left);
  return right.some((value) => set.has(value));
}

function findBaseline(baselines: StabilityBaseline[], relatedObjectIds: string[]): StabilityBaseline | null {
  return baselines.find((baseline) => overlaps(baseline.relatedObjectIds, relatedObjectIds)) ?? null;
}

function classifyCandidates(params: {
  forecasts?: ExecutiveStabilityForecast[];
  monitoringSignals?: ExecutiveMonitoringSignal[];
  fragilityZones?: EnterpriseFragilityZone[];
  interventions?: StrategicIntervention[];
  coordinationInsights?: EnterpriseCoordinationInsight[];
  strategicMemory?: StrategicMemoryRecord[];
}): Array<{
  driftType: StrategicDriftType;
  relatedObjectIds: string[];
  relatedZoneIds?: string[];
  domainIds?: string[];
}> {
  const candidates: Array<{
    driftType: StrategicDriftType;
    relatedObjectIds: string[];
    relatedZoneIds?: string[];
    domainIds?: string[];
  }> = [];

  for (const forecast of params.forecasts ?? []) {
    if (forecast.direction === "degrading" || forecast.direction === "volatile") {
      candidates.push({
        driftType: forecast.direction === "degrading" ? "stability_regression" : "propagation_expansion",
        relatedObjectIds: forecast.relatedObjectIds,
        relatedZoneIds: forecast.relatedZoneIds,
        domainIds: forecast.domainIds,
      });
    }
    if (forecast.direction === "uncertain" && (forecast.uncertaintyFactors ?? []).length >= 2) {
      candidates.push({
        driftType: "confidence_erosion",
        relatedObjectIds: forecast.relatedObjectIds,
        relatedZoneIds: forecast.relatedZoneIds,
        domainIds: forecast.domainIds,
      });
    }
  }

  for (const signal of params.monitoringSignals ?? []) {
    if (signal.trend === "degrading" || signal.trend === "volatile" || signal.monitoringStatus === "critical") {
      candidates.push({
        driftType: signal.monitoringStatus === "critical" ? "monitoring_gap" : "stability_regression",
        relatedObjectIds: signal.relatedObjectIds,
        domainIds: unique([signal.domainId]),
      });
    }
  }

  for (const zone of params.fragilityZones ?? []) {
    if (zone.propagationIntensity >= 0.58 || zone.fragilityScore >= 68 || zone.zoneType === "critical_corridor") {
      candidates.push({
        driftType: zone.propagationIntensity >= 0.64 ? "propagation_expansion" : "fragility_reemergence",
        relatedObjectIds: zone.relatedObjectIds,
        relatedZoneIds: [zone.id],
        domainIds: zone.domainIds,
      });
    }
  }

  for (const coordination of params.coordinationInsights ?? []) {
    if ((coordination.coordinationComplexity ?? 0) >= 0.58 || (coordination.synchronizationRisk ?? 0) >= 0.48) {
      candidates.push({
        driftType: "coordination_decay",
        relatedObjectIds: coordination.relatedObjectIds,
        domainIds: coordination.relatedDomainIds,
      });
    }
  }

  for (const intervention of params.interventions ?? []) {
    if ((intervention.priority === "high" || intervention.priority === "critical") && (intervention.propagationReductionPotential ?? 0.5) < 0.45) {
      candidates.push({
        driftType: "intervention_decay",
        relatedObjectIds: intervention.relatedObjectIds,
        relatedZoneIds: intervention.targetZoneIds,
        domainIds: intervention.domainIds,
      });
    }
  }

  for (const memory of params.strategicMemory ?? []) {
    if ((memory.recurrenceCount ?? 0) < 3) continue;
    candidates.push({
      driftType: memory.category === "monitoring" ? "monitoring_gap" :
        memory.category === "propagation" ? "propagation_expansion" :
        memory.category === "recommendation" ? "intervention_decay" :
        memory.category === "dependency" ? "coordination_decay" :
        "fragility_reemergence",
      relatedObjectIds: memory.relatedObjectIds,
      domainIds: unique([memory.domainId]),
    });
  }

  return candidates;
}

function logDrift(signal: StrategicDriftSignal, baseline: StabilityBaseline | null, debug?: boolean): void {
  if (!debug) return;
  const runtime = globalThis as typeof globalThis & {
    process?: { env?: { NODE_ENV?: string } };
  };
  if (runtime.process?.env?.NODE_ENV !== "development") return;
  console.debug("[Nexora][StrategicDrift]", {
    driftType: signal.driftType,
    driftIntensity: signal.driftIntensity,
    stabilityDeviation: signal.stabilityDeviation ?? 0,
    relatedObjects: signal.relatedObjectIds,
    baselineReference: baseline?.id ?? null,
  });
}

export function deriveStrategicDriftSignals(params: {
  forecasts?: ExecutiveStabilityForecast[];
  previousForecasts?: ExecutiveStabilityForecast[];
  monitoringSignals?: ExecutiveMonitoringSignal[];
  previousMonitoringSignals?: ExecutiveMonitoringSignal[];
  fragilityZones?: EnterpriseFragilityZone[];
  previousFragilityZones?: EnterpriseFragilityZone[];
  interventions?: StrategicIntervention[];
  coordinationInsights?: EnterpriseCoordinationInsight[];
  strategicMemory?: StrategicMemoryRecord[];
  decisionReviews?: DecisionReviewRecord[];
  baselines?: StabilityBaseline[];
  debug?: boolean;
}): StrategicDriftSignal[] {
  const baselines = params.baselines ?? deriveStabilityBaseline({
    decisionReviews: params.decisionReviews,
    forecasts: params.previousForecasts,
    monitoringSignals: params.previousMonitoringSignals,
    fragilityZones: params.previousFragilityZones,
  });
  const candidates = classifyCandidates(params);
  const signals: StrategicDriftSignal[] = [];

  for (const candidate of candidates) {
    const relatedObjectIds = unique(candidate.relatedObjectIds);
    if (!relatedObjectIds.length) continue;
    const baseline = findBaseline(baselines, relatedObjectIds);
    const scored = scoreStrategicDriftIntensity({
      driftType: candidate.driftType,
      relatedObjectIds,
      baseline,
      forecasts: params.forecasts,
      monitoringSignals: params.monitoringSignals,
      fragilityZones: params.fragilityZones,
      interventions: params.interventions,
      coordinationInsights: params.coordinationInsights,
      strategicMemory: params.strategicMemory,
    });
    if (scored.driftIntensity < 0.34 && scored.stabilityDeviation < 0.22) continue;
    const relatedZoneIds = unique(candidate.relatedZoneIds ?? []);
    const domainIds = unique(candidate.domainIds ?? []);
    const signal: StrategicDriftSignal = {
      id: `strategic_drift_${normalizeIdPart(candidate.driftType)}_${normalizeIdPart(relatedObjectIds.join("_"))}`,
      title: buildStrategicDriftTitle({
        driftType: candidate.driftType,
        relatedObjectIds,
      }),
      summary: buildStrategicDriftSummary({
        driftType: candidate.driftType,
        relatedObjectIds,
      }),
      driftType: candidate.driftType,
      relatedObjectIds,
      ...(relatedZoneIds.length ? { relatedZoneIds } : {}),
      driftIntensity: scored.driftIntensity,
      stabilityDeviation: scored.stabilityDeviation,
      confidence: scored.confidence,
      executiveImpact: buildStrategicDriftExecutiveImpact({ driftType: candidate.driftType }),
      recommendedAttention: buildDriftAttentionGuidance({
        driftType: candidate.driftType,
        relatedObjectIds,
      }),
      ...(domainIds.length ? { domainIds } : {}),
      createdAt: DETERMINISTIC_CREATED_AT,
    };
    logDrift(signal, baseline, params.debug);
    signals.push(signal);
  }

  const deduped = new Map<string, StrategicDriftSignal>();
  for (const signal of signals) {
    const key = `${signal.driftType}|${signal.relatedObjectIds.slice().sort().join("|")}`;
    const current = deduped.get(key);
    if (!current || signal.driftIntensity > current.driftIntensity) {
      deduped.set(key, signal);
    }
  }

  return Array.from(deduped.values()).sort((left, right) => {
    if (right.driftIntensity !== left.driftIntensity) return right.driftIntensity - left.driftIntensity;
    if ((right.stabilityDeviation ?? 0) !== (left.stabilityDeviation ?? 0)) return (right.stabilityDeviation ?? 0) - (left.stabilityDeviation ?? 0);
    return left.id.localeCompare(right.id);
  }).slice(0, MAX_DRIFT_SIGNALS);
}

export function buildStrategicDriftOverlayState(params: {
  signals: StrategicDriftSignal[];
}): StrategicDriftOverlayState {
  const signals = Array.isArray(params.signals) ? params.signals : [];
  const top = signals[0] ?? null;
  return {
    ...(top ? { topSignalId: top.id } : {}),
    headline: top?.title ?? "No strategic drift is visible yet.",
    executiveSummary: top?.summary ?? "Nexora is waiting for enough evidence to identify gradual operational deviation.",
    driftType: top?.driftType ?? "stability_regression",
    relatedObjectIds: unique(signals.flatMap((signal) => signal.relatedObjectIds)),
    driftIntensity: top?.driftIntensity ?? 0,
  };
}

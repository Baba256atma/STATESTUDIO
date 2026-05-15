import type { EnterpriseCoordinationInsight } from "../coordination/enterpriseCoordinationTypes.ts";
import type { StrategicDriftSignal } from "../drift/strategicDriftTypes.ts";
import type { ExecutiveStabilityForecast } from "../forecast/executiveStabilityForecastTypes.ts";
import type { EnterpriseFragilityZone } from "../fragilityMap/enterpriseFragilityMapTypes.ts";
import type { StrategicIntervention } from "../intervention/strategicInterventionTypes.ts";
import type { ExecutiveMonitoringSignal } from "../monitoring/executiveMonitoringTypes.ts";
import type { ExecutiveDecisionReadiness } from "../readiness/executiveDecisionReadinessTypes.ts";
import type { OrganizationalResilienceSignal } from "../resilience/organizationalResilienceTypes.ts";
import type { DecisionReviewRecord } from "../review/decisionReviewTypes.ts";
import {
  buildAdaptationExecutiveImpact,
  buildAdaptationGuidance,
  buildAdaptationSummary,
  buildAdaptationTitle,
} from "./adaptationNarratives.ts";
import { detectAdaptationBottlenecks } from "./detectAdaptationBottlenecks.ts";
import type {
  EnterpriseAdaptationOverlayState,
  EnterpriseAdaptationSignal,
} from "./enterpriseAdaptationTypes.ts";
import { scoreEnterpriseFlexibility } from "./scoreEnterpriseFlexibility.ts";

const DETERMINISTIC_CREATED_AT = 0;
const MAX_ADAPTATION_SIGNALS = 6;

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

function overlaps(ids: string[], values: string[]): boolean {
  const set = new Set(ids);
  return values.some((value) => set.has(value));
}

function collectCandidateObjectSets(params: {
  resilienceSignals?: OrganizationalResilienceSignal[];
  readinessSignals?: ExecutiveDecisionReadiness[];
  interventions?: StrategicIntervention[];
  forecasts?: ExecutiveStabilityForecast[];
  monitoringSignals?: ExecutiveMonitoringSignal[];
  fragilityZones?: EnterpriseFragilityZone[];
}): string[][] {
  const sets = [
    ...(params.resilienceSignals ?? []).map((item) => item.relatedObjectIds),
    ...(params.readinessSignals ?? []).map((item) => item.relatedObjectIds),
    ...(params.interventions ?? []).map((item) => item.relatedObjectIds),
    ...(params.forecasts ?? []).map((item) => item.relatedObjectIds),
    ...(params.monitoringSignals ?? []).map((item) => item.relatedObjectIds),
    ...(params.fragilityZones ?? []).map((item) => item.relatedObjectIds),
  ].map((ids) => unique(ids).sort()).filter((ids) => ids.length > 0);
  const deduped = new Map<string, string[]>();
  for (const set of sets) deduped.set(set.join("|"), set);
  return Array.from(deduped.values());
}

function collectDomainIds(params: {
  relatedObjectIds: string[];
  resilienceSignals?: OrganizationalResilienceSignal[];
  forecasts?: ExecutiveStabilityForecast[];
  interventions?: StrategicIntervention[];
  fragilityZones?: EnterpriseFragilityZone[];
  coordinationInsights?: EnterpriseCoordinationInsight[];
}): string[] {
  return unique([
    ...(params.resilienceSignals ?? []).filter((item) => overlaps(params.relatedObjectIds, item.relatedObjectIds)).flatMap((item) => item.domainIds ?? []),
    ...(params.forecasts ?? []).filter((item) => overlaps(params.relatedObjectIds, item.relatedObjectIds)).flatMap((item) => item.domainIds ?? []),
    ...(params.interventions ?? []).filter((item) => overlaps(params.relatedObjectIds, item.relatedObjectIds)).flatMap((item) => item.domainIds ?? []),
    ...(params.fragilityZones ?? []).filter((item) => overlaps(params.relatedObjectIds, item.relatedObjectIds)).flatMap((item) => item.domainIds ?? []),
    ...(params.coordinationInsights ?? []).filter((item) => overlaps(params.relatedObjectIds, item.relatedObjectIds)).flatMap((item) => item.relatedDomainIds ?? []),
  ]);
}

function logAdaptation(signal: EnterpriseAdaptationSignal, bottleneckCount: number, debug?: boolean): void {
  if (!debug) return;
  const runtime = globalThis as typeof globalThis & {
    process?: { env?: { NODE_ENV?: string } };
  };
  if (runtime.process?.env?.NODE_ENV !== "development") return;
  console.debug("[Nexora][EnterpriseAdaptation]", {
    adaptationState: signal.adaptationState,
    flexibilityScore: signal.flexibilityScore ?? 0,
    adaptationCapacity: signal.adaptationCapacity ?? 0,
    bottleneckCount,
    relatedZones: signal.relatedZoneIds ?? [],
  });
}

export function deriveEnterpriseAdaptationSignals(params: {
  resilienceSignals?: OrganizationalResilienceSignal[];
  readinessSignals?: ExecutiveDecisionReadiness[];
  interventions?: StrategicIntervention[];
  coordinationInsights?: EnterpriseCoordinationInsight[];
  monitoringSignals?: ExecutiveMonitoringSignal[];
  forecasts?: ExecutiveStabilityForecast[];
  fragilityZones?: EnterpriseFragilityZone[];
  driftSignals?: StrategicDriftSignal[];
  decisionReviews?: DecisionReviewRecord[];
  debug?: boolean;
}): EnterpriseAdaptationSignal[] {
  const candidates = collectCandidateObjectSets(params);
  const signals = candidates.map((relatedObjectIds): EnterpriseAdaptationSignal => {
    const bottlenecks = detectAdaptationBottlenecks({
      relatedObjectIds,
      fragilityZones: params.fragilityZones,
      coordinationInsights: params.coordinationInsights,
      monitoringSignals: params.monitoringSignals,
      driftSignals: params.driftSignals,
      resilienceSignals: params.resilienceSignals,
    });
    const scored = scoreEnterpriseFlexibility({
      relatedObjectIds,
      interventions: params.interventions,
      coordinationInsights: params.coordinationInsights,
      monitoringSignals: params.monitoringSignals,
      forecasts: params.forecasts,
      fragilityZones: params.fragilityZones,
      resilienceSignals: params.resilienceSignals,
      driftSignals: params.driftSignals,
      decisionReviews: params.decisionReviews,
    });
    const relatedZoneIds = unique([
      ...bottlenecks.flatMap((item) => item.relatedZoneIds ?? []),
      ...(params.fragilityZones ?? []).filter((zone) => overlaps(relatedObjectIds, zone.relatedObjectIds)).map((zone) => zone.id),
    ]);
    const signal: EnterpriseAdaptationSignal = {
      id: `enterprise_adaptation_${normalizeIdPart(scored.adaptationState)}_${normalizeIdPart(relatedObjectIds.join("_"))}`,
      title: buildAdaptationTitle({
        adaptationState: scored.adaptationState,
        relatedObjectIds,
      }),
      summary: buildAdaptationSummary({
        adaptationState: scored.adaptationState,
        relatedObjectIds,
      }),
      adaptationState: scored.adaptationState,
      relatedObjectIds,
      ...(relatedZoneIds.length ? { relatedZoneIds } : {}),
      flexibilityScore: scored.flexibilityScore,
      adaptationCapacity: scored.adaptationCapacity,
      coordinationAdaptability: scored.coordinationAdaptability,
      executiveImpact: buildAdaptationExecutiveImpact({ adaptationState: scored.adaptationState }),
      recommendedFocus: buildAdaptationGuidance({
        adaptationState: scored.adaptationState,
        bottleneckLabels: bottlenecks.map((item) => item.label),
        relatedObjectIds,
      }),
      confidence: scored.confidence,
      ...(collectDomainIds({ ...params, relatedObjectIds }).length ? { domainIds: collectDomainIds({ ...params, relatedObjectIds }) } : {}),
      createdAt: DETERMINISTIC_CREATED_AT,
    };
    logAdaptation(signal, bottlenecks.length, params.debug);
    return signal;
  });

  const deduped = new Map<string, EnterpriseAdaptationSignal>();
  for (const signal of signals) {
    const key = `${signal.adaptationState}|${signal.relatedObjectIds.slice().sort().join("|")}`;
    const current = deduped.get(key);
    if (!current || (signal.flexibilityScore ?? 0) > (current.flexibilityScore ?? 0)) deduped.set(key, signal);
  }

  return Array.from(deduped.values()).sort((left, right) => {
    if ((right.flexibilityScore ?? 0) !== (left.flexibilityScore ?? 0)) return (right.flexibilityScore ?? 0) - (left.flexibilityScore ?? 0);
    if ((right.confidence ?? 0) !== (left.confidence ?? 0)) return (right.confidence ?? 0) - (left.confidence ?? 0);
    return left.id.localeCompare(right.id);
  }).slice(0, MAX_ADAPTATION_SIGNALS);
}

export function buildEnterpriseAdaptationOverlayState(params: {
  signals: EnterpriseAdaptationSignal[];
}): EnterpriseAdaptationOverlayState {
  const signals = Array.isArray(params.signals) ? params.signals : [];
  const top = signals[0] ?? null;
  const bottleneckCount = signals.filter((signal) => signal.adaptationState === "rigid" || signal.adaptationState === "strained").length;
  return {
    ...(top ? { topSignalId: top.id } : {}),
    headline: top?.title ?? "No enterprise adaptation signal is visible yet.",
    executiveSummary: top?.summary ?? "Nexora is waiting for enough evidence to assess enterprise adaptability.",
    adaptationState: top?.adaptationState ?? "adjusting",
    relatedObjectIds: unique(signals.flatMap((signal) => signal.relatedObjectIds)),
    bottleneckCount,
  };
}

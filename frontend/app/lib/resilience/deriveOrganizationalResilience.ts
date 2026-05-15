import type { EnterpriseCoordinationInsight } from "../coordination/enterpriseCoordinationTypes.ts";
import type { DecisionConfidence } from "../confidence/decisionConfidenceTypes.ts";
import type { StrategicDriftSignal } from "../drift/strategicDriftTypes.ts";
import type { ExecutiveStabilityForecast } from "../forecast/executiveStabilityForecastTypes.ts";
import type { EnterpriseFragilityZone } from "../fragilityMap/enterpriseFragilityMapTypes.ts";
import type { StrategicIntervention } from "../intervention/strategicInterventionTypes.ts";
import type { StrategicMemoryRecord } from "../memory/strategicMemoryTypes.ts";
import type { ExecutiveMonitoringSignal } from "../monitoring/executiveMonitoringTypes.ts";
import type { DecisionReviewRecord } from "../review/decisionReviewTypes.ts";
import { detectResilienceClusters } from "./detectResilienceClusters.ts";
import type {
  OrganizationalResilienceOverlayState,
  OrganizationalResilienceSignal,
} from "./organizationalResilienceTypes.ts";
import {
  buildResilienceExecutiveImpact,
  buildResilienceStrengtheningGuidance,
  buildResilienceSummary,
  buildResilienceTitle,
} from "./resilienceNarratives.ts";
import { scoreOrganizationalResilience } from "./scoreOrganizationalResilience.ts";

const DETERMINISTIC_CREATED_AT = 0;
const MAX_RESILIENCE_SIGNALS = 6;

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

function logResilience(signal: OrganizationalResilienceSignal, debug?: boolean): void {
  if (!debug) return;
  const runtime = globalThis as typeof globalThis & {
    process?: { env?: { NODE_ENV?: string } };
  };
  if (runtime.process?.env?.NODE_ENV !== "development") return;
  console.debug("[Nexora][OrganizationalResilience]", {
    resilienceState: signal.resilienceState,
    resilienceScore: signal.resilienceScore,
    recoveryCapacity: signal.recoveryCapacity ?? 0,
    adaptationCapacity: signal.adaptationCapacity ?? 0,
    relatedZones: signal.relatedZoneIds ?? [],
  });
}

export function deriveOrganizationalResilienceSignals(params: {
  interventions?: StrategicIntervention[];
  monitoringSignals?: ExecutiveMonitoringSignal[];
  forecasts?: ExecutiveStabilityForecast[];
  fragilityZones?: EnterpriseFragilityZone[];
  coordinationInsights?: EnterpriseCoordinationInsight[];
  decisionReviews?: DecisionReviewRecord[];
  confidenceSignals?: DecisionConfidence[];
  strategicMemory?: StrategicMemoryRecord[];
  driftSignals?: StrategicDriftSignal[];
  debug?: boolean;
}): OrganizationalResilienceSignal[] {
  const clusters = detectResilienceClusters(params);
  const signals = clusters.map((cluster): OrganizationalResilienceSignal => {
    const scored = scoreOrganizationalResilience({
      relatedObjectIds: cluster.relatedObjectIds,
      recoveryCapacity: cluster.recoveryCapacity,
      adaptationCapacity: cluster.adaptationCapacity,
      interventions: params.interventions,
      monitoringSignals: params.monitoringSignals,
      forecasts: params.forecasts,
      fragilityZones: params.fragilityZones,
      coordinationInsights: params.coordinationInsights,
      strategicMemory: params.strategicMemory,
      decisionReviews: params.decisionReviews,
      driftSignals: params.driftSignals,
    });
    const signal: OrganizationalResilienceSignal = {
      id: `organizational_resilience_${normalizeIdPart(scored.resilienceState)}_${normalizeIdPart(cluster.relatedObjectIds.join("_"))}`,
      title: buildResilienceTitle({
        resilienceState: scored.resilienceState,
        relatedObjectIds: cluster.relatedObjectIds,
      }),
      summary: buildResilienceSummary({
        resilienceState: scored.resilienceState,
        relatedObjectIds: cluster.relatedObjectIds,
      }),
      resilienceState: scored.resilienceState,
      relatedObjectIds: cluster.relatedObjectIds,
      ...(cluster.relatedZoneIds.length ? { relatedZoneIds: cluster.relatedZoneIds } : {}),
      resilienceScore: scored.resilienceScore,
      recoveryCapacity: scored.recoveryCapacity,
      adaptationCapacity: scored.adaptationCapacity,
      executiveImpact: buildResilienceExecutiveImpact({
        resilienceState: scored.resilienceState,
      }),
      recommendedFocus: buildResilienceStrengtheningGuidance({
        resilienceState: scored.resilienceState,
        relatedObjectIds: cluster.relatedObjectIds,
      }),
      confidence: scored.confidence,
      ...(cluster.domainIds.length ? { domainIds: cluster.domainIds } : {}),
      createdAt: DETERMINISTIC_CREATED_AT,
    };
    logResilience(signal, params.debug);
    return signal;
  });

  const deduped = new Map<string, OrganizationalResilienceSignal>();
  for (const signal of signals) {
    const key = `${signal.resilienceState}|${signal.relatedObjectIds.slice().sort().join("|")}`;
    const current = deduped.get(key);
    if (!current || signal.resilienceScore > current.resilienceScore) {
      deduped.set(key, signal);
    }
  }

  return Array.from(deduped.values()).sort((left, right) => {
    if (right.resilienceScore !== left.resilienceScore) return right.resilienceScore - left.resilienceScore;
    if ((right.confidence ?? 0) !== (left.confidence ?? 0)) return (right.confidence ?? 0) - (left.confidence ?? 0);
    return left.id.localeCompare(right.id);
  }).slice(0, MAX_RESILIENCE_SIGNALS);
}

export function buildOrganizationalResilienceOverlayState(params: {
  signals: OrganizationalResilienceSignal[];
}): OrganizationalResilienceOverlayState {
  const signals = Array.isArray(params.signals) ? params.signals : [];
  const top = signals[0] ?? null;
  return {
    ...(top ? { topSignalId: top.id } : {}),
    headline: top?.title ?? "No organizational resilience signal is visible yet.",
    executiveSummary: top?.summary ?? "Nexora is waiting for enough recovery evidence to assess resilience.",
    resilienceState: top?.resilienceState ?? "stable",
    relatedObjectIds: unique(signals.flatMap((signal) => signal.relatedObjectIds)),
    resilienceScore: top?.resilienceScore ?? 0,
  };
}

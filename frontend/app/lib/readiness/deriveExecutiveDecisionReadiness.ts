import type { EnterpriseCoordinationInsight } from "../coordination/enterpriseCoordinationTypes.ts";
import type { DecisionConfidence } from "../confidence/decisionConfidenceTypes.ts";
import type { DecisionRecommendation } from "../decision/decisionRecommendationTypes.ts";
import type { DomainScenario } from "../domain/domainScenarioTypes.ts";
import type { StrategicDriftSignal } from "../drift/strategicDriftTypes.ts";
import type { ExecutiveStabilityForecast } from "../forecast/executiveStabilityForecastTypes.ts";
import type { EnterpriseFragilityZone } from "../fragilityMap/enterpriseFragilityMapTypes.ts";
import type { StrategicIntervention } from "../intervention/strategicInterventionTypes.ts";
import type { ExecutiveMonitoringSignal } from "../monitoring/executiveMonitoringTypes.ts";
import type { OrganizationalResilienceSignal } from "../resilience/organizationalResilienceTypes.ts";
import { detectDecisionBlockers } from "./detectDecisionBlockers.ts";
import type {
  ExecutiveDecisionReadiness,
  ExecutiveDecisionReadinessOverlayState,
} from "./executiveDecisionReadinessTypes.ts";
import {
  buildReadinessRationale,
  buildReadinessSummary,
  buildReadinessTitle,
  buildTimingGuidance,
  readinessStateFromInputs,
} from "./readinessNarratives.ts";
import {
  scoreCoordinationReadiness,
  scoreDecisionUncertainty,
  scoreMonitoringMaturity,
} from "./scoreDecisionUncertainty.ts";

const DETERMINISTIC_CREATED_AT = 0;
const MAX_READINESS_SIGNALS = 6;

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

function collectCandidateObjectSets(params: {
  recommendations?: DecisionRecommendation[];
  scenarios?: DomainScenario[];
  resilienceSignals?: OrganizationalResilienceSignal[];
  forecasts?: ExecutiveStabilityForecast[];
  monitoringSignals?: ExecutiveMonitoringSignal[];
}): string[][] {
  const sets = [
    ...(params.recommendations ?? []).map((item) => item.affectedObjectIds),
    ...(params.scenarios ?? []).map((item) => item.relatedObjectIds),
    ...(params.resilienceSignals ?? []).map((item) => item.relatedObjectIds),
    ...(params.forecasts ?? []).map((item) => item.relatedObjectIds),
    ...(params.monitoringSignals ?? []).map((item) => item.relatedObjectIds),
  ].map((ids) => unique(ids).sort()).filter((ids) => ids.length > 0);
  const deduped = new Map<string, string[]>();
  for (const set of sets) deduped.set(set.join("|"), set);
  return Array.from(deduped.values());
}

function overlaps(ids: string[], values: string[]): boolean {
  const set = new Set(ids);
  return values.some((value) => set.has(value));
}

function confidenceFor(params: {
  relatedObjectIds: string[];
  confidenceSignals?: DecisionConfidence[];
  recommendations?: DecisionRecommendation[];
}): number {
  const recommendationIds = (params.recommendations ?? [])
    .filter((item) => overlaps(params.relatedObjectIds, item.affectedObjectIds))
    .map((item) => item.id);
  const matchingConfidence = (params.confidenceSignals ?? []).filter((signal) =>
    !signal.relatedRecommendationId || recommendationIds.includes(signal.relatedRecommendationId)
  );
  const confidenceScores = [
    ...matchingConfidence.map((signal) => signal.confidenceScore),
    ...(params.recommendations ?? []).filter((item) => overlaps(params.relatedObjectIds, item.affectedObjectIds)).map((item) => item.confidence),
  ];
  if (!confidenceScores.length) return 0.34;
  return clamp01(Math.max(...confidenceScores));
}

function logReadiness(readiness: ExecutiveDecisionReadiness, debug?: boolean): void {
  if (!debug) return;
  const runtime = globalThis as typeof globalThis & {
    process?: { env?: { NODE_ENV?: string } };
  };
  if (runtime.process?.env?.NODE_ENV !== "development") return;
  console.debug("[Nexora][DecisionReadiness]", {
    readinessState: readiness.readinessState,
    uncertaintyLevel: readiness.uncertaintyLevel ?? 0,
    blockers: readiness.blockers ?? [],
    monitoringMaturity: readiness.monitoringMaturity ?? 0,
    coordinationReadiness: readiness.coordinationReadiness ?? 0,
  });
}

export function deriveExecutiveDecisionReadiness(params: {
  recommendations?: DecisionRecommendation[];
  scenarios?: DomainScenario[];
  confidenceSignals?: DecisionConfidence[];
  monitoringSignals?: ExecutiveMonitoringSignal[];
  forecasts?: ExecutiveStabilityForecast[];
  fragilityZones?: EnterpriseFragilityZone[];
  coordinationInsights?: EnterpriseCoordinationInsight[];
  interventions?: StrategicIntervention[];
  driftSignals?: StrategicDriftSignal[];
  resilienceSignals?: OrganizationalResilienceSignal[];
  debug?: boolean;
}): ExecutiveDecisionReadiness[] {
  const candidateSets = collectCandidateObjectSets(params);
  const readiness = candidateSets.map((relatedObjectIds): ExecutiveDecisionReadiness => {
    const confidenceScore = confidenceFor({
      relatedObjectIds,
      confidenceSignals: params.confidenceSignals,
      recommendations: params.recommendations,
    });
    const uncertaintyLevel = scoreDecisionUncertainty({
      relatedObjectIds,
      confidenceSignals: params.confidenceSignals,
      monitoringSignals: params.monitoringSignals,
      forecasts: params.forecasts,
      fragilityZones: params.fragilityZones,
      coordinationInsights: params.coordinationInsights,
      driftSignals: params.driftSignals,
    });
    const coordinationReadiness = scoreCoordinationReadiness({
      relatedObjectIds,
      coordinationInsights: params.coordinationInsights,
    });
    const monitoringMaturity = scoreMonitoringMaturity({
      relatedObjectIds,
      monitoringSignals: params.monitoringSignals,
    });
    const blockers = detectDecisionBlockers({
      relatedObjectIds,
      confidenceSignals: params.confidenceSignals,
      forecasts: params.forecasts,
      fragilityZones: params.fragilityZones,
      coordinationInsights: params.coordinationInsights,
      driftSignals: params.driftSignals,
      resilienceSignals: params.resilienceSignals,
    });
    const resilienceScore = Math.max(0, ...(params.resilienceSignals ?? [])
      .filter((signal) => overlaps(relatedObjectIds, signal.relatedObjectIds))
      .map((signal) => signal.resilienceScore));
    const interventionReadiness = Math.max(0, ...(params.interventions ?? [])
      .filter((item) => overlaps(relatedObjectIds, item.relatedObjectIds))
      .map((item) => item.propagationReductionPotential ?? 0.35));
    const readinessScore = clamp01(
      confidenceScore * 0.26 +
        monitoringMaturity * 0.22 +
        coordinationReadiness * 0.16 +
        (1 - uncertaintyLevel) * 0.18 +
        resilienceScore * 0.12 +
        interventionReadiness * 0.06
    );
    const readinessState = readinessStateFromInputs({
      readinessScore,
      uncertaintyLevel,
      blockerCount: blockers.filter((blocker) => blocker.severity === "high" || blocker.severity === "critical").length,
    });
    const relatedRecommendations = (params.recommendations ?? []).filter((item) => overlaps(relatedObjectIds, item.affectedObjectIds));
    const relatedScenarios = (params.scenarios ?? []).filter((item) => overlaps(relatedObjectIds, item.relatedObjectIds));
    const domainIds = unique([
      ...relatedRecommendations.map((item) => item.domainId),
      ...relatedScenarios.map((item) => item.domainId),
      ...(params.forecasts ?? []).filter((item) => overlaps(relatedObjectIds, item.relatedObjectIds)).flatMap((item) => item.domainIds ?? []),
      ...(params.resilienceSignals ?? []).filter((item) => overlaps(relatedObjectIds, item.relatedObjectIds)).flatMap((item) => item.domainIds ?? []),
    ]);
    const signal: ExecutiveDecisionReadiness = {
      id: `executive_decision_readiness_${normalizeIdPart(readinessState)}_${normalizeIdPart(relatedObjectIds.join("_"))}`,
      title: buildReadinessTitle({ readinessState, relatedObjectIds }),
      summary: buildReadinessSummary({ readinessState, relatedObjectIds }),
      readinessState,
      relatedObjectIds,
      ...(relatedRecommendations.length ? { relatedRecommendationIds: unique(relatedRecommendations.map((item) => item.id)) } : {}),
      ...(relatedScenarios.length ? { relatedScenarioIds: unique(relatedScenarios.map((item) => item.id)) } : {}),
      confidenceScore,
      uncertaintyLevel,
      coordinationReadiness,
      monitoringMaturity,
      executiveRationale: buildReadinessRationale({
        readinessState,
        blockerCount: blockers.length,
      }),
      ...(blockers.length ? { blockers: blockers.map((blocker) => blocker.label) } : {}),
      recommendedFocus: buildTimingGuidance({
        readinessState,
        blockerLabels: blockers.map((blocker) => blocker.label),
      }),
      ...(domainIds.length ? { domainIds } : {}),
      createdAt: DETERMINISTIC_CREATED_AT,
    };
    logReadiness(signal, params.debug);
    return signal;
  });

  return readiness.sort((left, right) => {
    const stateWeight = { ready: 4, ready_for_review: 3, developing: 2, limited: 1, not_ready: 0 };
    if (stateWeight[right.readinessState] !== stateWeight[left.readinessState]) return stateWeight[right.readinessState] - stateWeight[left.readinessState];
    if ((right.confidenceScore ?? 0) !== (left.confidenceScore ?? 0)) return (right.confidenceScore ?? 0) - (left.confidenceScore ?? 0);
    return left.id.localeCompare(right.id);
  }).slice(0, MAX_READINESS_SIGNALS);
}

export function buildExecutiveDecisionReadinessOverlayState(params: {
  readiness: ExecutiveDecisionReadiness[];
}): ExecutiveDecisionReadinessOverlayState {
  const readiness = Array.isArray(params.readiness) ? params.readiness : [];
  const top = readiness[0] ?? null;
  return {
    ...(top ? { topReadinessId: top.id } : {}),
    headline: top?.title ?? "No decision readiness signal is available yet.",
    executiveSummary: top?.summary ?? "Nexora is waiting for enough evidence to assess executive decision timing.",
    readinessState: top?.readinessState ?? "developing",
    relatedObjectIds: unique(readiness.flatMap((item) => item.relatedObjectIds)),
    blockerCount: readiness.reduce((sum, item) => sum + (item.blockers?.length ?? 0), 0),
  };
}

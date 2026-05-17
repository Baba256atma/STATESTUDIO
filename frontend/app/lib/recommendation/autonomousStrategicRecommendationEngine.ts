/**
 * D7:5:1 — Autonomous strategic recommendation engine (advisory-only, non-executing).
 */

import type {
  GenerateStrategicRecommendationsInput,
  GenerateStrategicRecommendationsResult,
  RecommendationPanelContract,
  StrategicRecommendationSnapshot,
  StrategicRecommendationState,
} from "./strategicRecommendationTypes.ts";
import {
  NON_EXECUTION_DISCLAIMER,
  RECOMMENDATION_UNCERTAINTY_DISCLAIMER,
  buildRecommendationContentFingerprint,
  guardGenerateStrategicRecommendations,
  guardRecommendationExecutiveSemantics,
} from "./recommendationGuards.ts";
import {
  calculateInterventionRiskScore,
  calculateRecommendationConfidenceScore,
  calculateStabilizationLeverageScore,
  classifyStrategicRecommendationLabel,
  deriveStrategicRecommendations,
  identifyCriticalInterventionZones,
  identifyResilienceSupportZones,
  identifyStabilizationRecommendationZones,
} from "./recommendationGenerationModel.ts";
import { analyzeInterventionImpact } from "./interventionImpactAnalysis.ts";
import { analyzeExecutiveRecommendationInfluence } from "./executiveRecommendationIntelligence.ts";
import { buildExecutiveRecommendationSemantics } from "./executiveRecommendationSemantics.ts";
import { CANONICAL_REGION_LABELS } from "../simulation/topology/operationalUniverseClassification.ts";
import { logRecommendationDev } from "./recommendationDevLog.ts";

function stableStringify(value: unknown): string {
  if (value === null || value === undefined) return "null";
  if (typeof value !== "object") return JSON.stringify(value);
  if (Array.isArray(value)) return `[${value.map((v) => stableStringify(v)).join(",")}]`;
  const record = value as Record<string, unknown>;
  const keys = Object.keys(record).sort();
  return `{${keys.map((k) => `${JSON.stringify(k)}:${stableStringify(record[k])}`).join(",")}}`;
}

function recommendationBuiltAt(tick: number): string {
  return new Date(Date.UTC(2026, 0, 1) + tick * 1000).toISOString();
}

function clamp01Stress(n: number): number {
  if (!Number.isFinite(n)) return 0;
  return Math.min(1, Math.max(0, n));
}

export function buildRecommendationPanelContract(input: {
  snapshot: StrategicRecommendationSnapshot;
}): RecommendationPanelContract {
  const regionLabel = (id: string) =>
    CANONICAL_REGION_LABELS[id as keyof typeof CANONICAL_REGION_LABELS] ?? id;

  const viewHint =
    input.snapshot.state.interventionImpactRecords.length > 2
      ? "intervention_heatmap"
      : input.snapshot.state.criticalInterventionZones.length > 0
        ? "executive_recommendation_dashboard"
        : input.snapshot.state.strategicRecommendationLabel === "stabilizing"
          ? "stabilization_opportunity_panel"
          : input.snapshot.state.activeRecommendations.length > 3
            ? "recommendation_timeline"
            : "recommendation_overlay";

  return Object.freeze({
    recommendationStateId: input.snapshot.recommendationStateId,
    topologyId: input.snapshot.topologyId,
    recommendationConfidenceScore: input.snapshot.state.recommendationConfidenceScore,
    strategicRecommendationLabel: input.snapshot.state.strategicRecommendationLabel,
    uncertaintyDisclaimer: input.snapshot.state.uncertaintyDisclaimer,
    nonExecutionDisclaimer: input.snapshot.state.nonExecutionDisclaimer,
    recommendations: Object.freeze(
      input.snapshot.state.activeRecommendations.slice(0, 16).map((rec) =>
        Object.freeze({
          recommendationId: rec.recommendationId,
          label: rec.affectedRegionIds.map(regionLabel).join(" · "),
          recommendationState: rec.recommendationState,
          recommendationStrength: rec.recommendationStrength,
        })
      )
    ),
    interventionSummaries: Object.freeze(
      input.snapshot.state.interventionImpactRecords.map((r) => r.explanation)
    ),
    headline: input.snapshot.semantics.headline,
    viewHint,
  });
}

/**
 * Generate strategic executive recommendations (read-only; never auto-executes).
 */
export function generateStrategicRecommendations(
  input: GenerateStrategicRecommendationsInput
): GenerateStrategicRecommendationsResult {
  const topology = input.topology;
  const tick = Math.floor(Number(input.tick ?? input.recommendationContext?.tick) || 0);
  const recommendationStateId = String(
    input.recommendationStateId ?? `strategic-recommendation::${topology.topologyId}::${tick}`
  ).trim();

  const recommendationLeverageFactor = clamp01Stress(
    (input.simulationEvents?.length ?? 0) * 0.004 +
      (input.recommendationContext?.recommendationLeverageFactor ?? 0)
  );
  const interventionStressFactor = clamp01Stress(
    input.recommendationContext?.interventionStressFactor ?? 0
  );

  logRecommendationDev("Recommendation", {
    recommendationStateId,
    topologyId: topology.topologyId,
    tick,
    foresightLabel: input.foresightState.predictiveForesightLabel,
    adaptationLabel: input.adaptationState.predictiveAdaptationLabel,
  });

  const activeRecommendations = deriveStrategicRecommendations({
    topology,
    foresightState: input.foresightState,
    adaptationState: input.adaptationState,
    preventionState: input.preventionState,
    recoveryOpportunityState: input.recoveryOpportunityState,
    cascadeState: input.cascadeState,
    trajectoryState: input.trajectoryState,
    divergenceState: input.divergenceState,
    resilienceState: input.resilienceState,
    momentumState: input.momentumState,
    equilibriumState: input.equilibriumState,
    recommendationLeverageFactor,
    interventionStressFactor,
  });

  const recommendationConfidenceScore = calculateRecommendationConfidenceScore({
    recommendations: activeRecommendations,
    foresightState: input.foresightState,
    adaptationState: input.adaptationState,
  });

  const stabilizationLeverageScore = calculateStabilizationLeverageScore({
    recommendations: activeRecommendations,
    recoveryOpportunityState: input.recoveryOpportunityState,
    preventionState: input.preventionState,
  });

  const interventionRiskScore = calculateInterventionRiskScore({
    recommendations: activeRecommendations,
    cascadeState: input.cascadeState,
    trajectoryState: input.trajectoryState,
  });

  const interventionImpactRecords = analyzeInterventionImpact({
    topology,
    recommendations: activeRecommendations,
    preventionState: input.preventionState,
    recoveryOpportunityState: input.recoveryOpportunityState,
    cascadeState: input.cascadeState,
  });

  const executiveRecommendationInfluenceRecords = analyzeExecutiveRecommendationInfluence({
    recommendations: activeRecommendations,
    trajectoryState: input.trajectoryState,
    momentumState: input.momentumState,
    equilibriumState: input.equilibriumState,
    recoveryOpportunityState: input.recoveryOpportunityState,
  });

  const foresightFingerprint = stableStringify({
    label: input.foresightState.predictiveForesightLabel,
    preparedness: input.foresightState.strategicPreparednessScore,
  });
  const adaptationFingerprint = stableStringify({
    label: input.adaptationState.predictiveAdaptationLabel,
    adaptive: input.adaptationState.adaptiveResilienceScore,
  });
  const preventionFingerprint = stableStringify({
    label: input.preventionState.predictivePreventionLabel,
    interruption: input.preventionState.collapseInterruptionScore,
  });

  const pendingFingerprint = buildRecommendationContentFingerprint({
    topologyFingerprint: topology.fingerprint,
    foresightFingerprint,
    adaptationFingerprint,
    preventionFingerprint,
    tick,
  });

  const guard = guardGenerateStrategicRecommendations({
    topologyId: topology.topologyId,
    regionIds: topology.operationalRegions.map((r) => r.regionId),
    recommendations: activeRecommendations,
    priorRecommendationFingerprints: input.priorRecommendationFingerprints,
    pendingFingerprint,
    recommendationConfidenceScore,
    stabilizationLeverageScore,
  });
  if (!guard.ok) return { ok: false, guard };

  const strategicRecommendationLabel = classifyStrategicRecommendationLabel({
    recommendationConfidenceScore,
    stabilizationLeverageScore,
    interventionRiskScore,
  });

  const state: StrategicRecommendationState = Object.freeze({
    activeRecommendations: Object.freeze(activeRecommendations),
    interventionImpactRecords,
    executiveRecommendationInfluenceRecords,
    stabilizationRecommendationZones: identifyStabilizationRecommendationZones(activeRecommendations),
    criticalInterventionZones: identifyCriticalInterventionZones(
      activeRecommendations,
      input.preventionState
    ),
    resilienceSupportZones: identifyResilienceSupportZones(
      activeRecommendations,
      input.recoveryOpportunityState
    ),
    recommendationConfidenceScore,
    stabilizationLeverageScore,
    interventionRiskScore,
    strategicRecommendationLabel,
    uncertaintyDisclaimer: RECOMMENDATION_UNCERTAINTY_DISCLAIMER,
    nonExecutionDisclaimer: NON_EXECUTION_DISCLAIMER,
  });

  const semantics = buildExecutiveRecommendationSemantics({ state });
  const semanticsGuard = guardRecommendationExecutiveSemantics({
    headline: semantics.headline,
    summary: semantics.summary,
  });
  if (!semanticsGuard.ok) return { ok: false, guard: semanticsGuard };

  const fingerprint = stableStringify({
    content: pendingFingerprint,
    recommendationStateId,
    strategicRecommendationLabel,
    recommendationConfidenceScore,
    stabilizationLeverageScore,
  });

  const snapshot: StrategicRecommendationSnapshot = Object.freeze({
    recommendationStateId,
    topologyId: topology.topologyId,
    foresightStateId: `executive-foresight::${topology.topologyId}::${tick}`,
    tick,
    state,
    semantics: Object.freeze({
      ...semantics,
      recommendationSummaries: Object.freeze([...semantics.recommendationSummaries]),
      interventionSummaries: Object.freeze([...semantics.interventionSummaries]),
      influenceSummaries: Object.freeze([...semantics.influenceSummaries]),
      bullets: Object.freeze([...semantics.bullets]),
    }),
    fingerprint,
    builtAt: recommendationBuiltAt(tick),
  });

  const panelContract = buildRecommendationPanelContract({ snapshot });

  return { ok: true, snapshot, panelContract };
}

export function freezeStrategicRecommendationSnapshot(
  snapshot: StrategicRecommendationSnapshot
): StrategicRecommendationSnapshot {
  return Object.freeze({
    ...snapshot,
    state: Object.freeze({
      ...snapshot.state,
      activeRecommendations: Object.freeze(
        snapshot.state.activeRecommendations.map((r) => Object.freeze({ ...r }))
      ),
      interventionImpactRecords: Object.freeze(
        snapshot.state.interventionImpactRecords.map((r) => Object.freeze({ ...r }))
      ),
      executiveRecommendationInfluenceRecords: Object.freeze(
        snapshot.state.executiveRecommendationInfluenceRecords.map((r) =>
          Object.freeze({ ...r })
        )
      ),
      stabilizationRecommendationZones: Object.freeze([
        ...snapshot.state.stabilizationRecommendationZones,
      ]),
      criticalInterventionZones: Object.freeze([...snapshot.state.criticalInterventionZones]),
      resilienceSupportZones: Object.freeze([...snapshot.state.resilienceSupportZones]),
    }),
    semantics: Object.freeze({ ...snapshot.semantics }),
  });
}

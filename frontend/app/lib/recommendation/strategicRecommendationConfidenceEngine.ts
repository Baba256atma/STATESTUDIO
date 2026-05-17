/**
 * D7:5:2 — Strategic recommendation confidence engine (immutable, non-mutating).
 */

import type {
  EvaluateRecommendationConfidenceInput,
  EvaluateRecommendationConfidenceResult,
  RecommendationConfidencePanelContract,
  RecommendationConfidenceSnapshot,
  RecommendationConfidenceState,
} from "./recommendationConfidenceTypes.ts";
import {
  CONFIDENCE_UNCERTAINTY_DISCLAIMER,
  buildConfidenceContentFingerprint,
  guardEvaluateRecommendationConfidence,
  guardConfidenceExecutiveSemantics,
} from "./confidenceGuards.ts";
import {
  calculateEvidenceStabilityScore,
  calculateOverallConfidenceScore,
  calculatePredictiveConsistencyScore,
  calculateUncertaintyAmplificationScore,
  classifyRecommendationConfidenceLabel,
  deriveRecommendationConfidenceSignals,
  identifyStableRecommendationZones,
  identifyUncertaintyZones,
} from "./confidenceScoringModel.ts";
import { analyzeRecommendationUncertainty } from "./recommendationUncertaintyAnalysis.ts";
import { analyzeEvidenceStrength } from "./evidenceStrengthIntelligence.ts";
import { buildExecutiveRecommendationConfidenceSemantics } from "./executiveRecommendationConfidenceSemantics.ts";
import { CANONICAL_REGION_LABELS } from "../simulation/topology/operationalUniverseClassification.ts";
import { logConfidenceDev } from "./confidenceDevLog.ts";

function stableStringify(value: unknown): string {
  if (value === null || value === undefined) return "null";
  if (typeof value !== "object") return JSON.stringify(value);
  if (Array.isArray(value)) return `[${value.map((v) => stableStringify(v)).join(",")}]`;
  const record = value as Record<string, unknown>;
  const keys = Object.keys(record).sort();
  return `{${keys.map((k) => `${JSON.stringify(k)}:${stableStringify(record[k])}`).join(",")}}`;
}

function confidenceBuiltAt(tick: number): string {
  return new Date(Date.UTC(2026, 0, 1) + tick * 1000).toISOString();
}

function clamp01Stress(n: number): number {
  if (!Number.isFinite(n)) return 0;
  return Math.min(1, Math.max(0, n));
}

export function buildRecommendationConfidencePanelContract(input: {
  snapshot: RecommendationConfidenceSnapshot;
}): RecommendationConfidencePanelContract {
  const regionLabel = (id: string) =>
    CANONICAL_REGION_LABELS[id as keyof typeof CANONICAL_REGION_LABELS] ?? id;

  const viewHint =
    input.snapshot.state.recommendationUncertaintyRecords.length > 2
      ? "uncertainty_heatmap"
      : input.snapshot.state.evidenceStrengthRecords.length > 2
        ? "evidence_strength_panel"
        : input.snapshot.state.recommendationConfidenceLabel === "volatile"
          ? "predictive_confidence_timeline"
          : input.snapshot.state.uncertaintyZones.length > 0
            ? "executive_certainty_dashboard"
            : "recommendation_confidence_overlay";

  return Object.freeze({
    confidenceStateId: input.snapshot.confidenceStateId,
    topologyId: input.snapshot.topologyId,
    overallConfidenceScore: input.snapshot.state.overallConfidenceScore,
    recommendationConfidenceLabel: input.snapshot.state.recommendationConfidenceLabel,
    uncertaintyDisclaimer: input.snapshot.state.uncertaintyDisclaimer,
    signals: Object.freeze(
      input.snapshot.state.activeConfidenceSignals.slice(0, 16).map((signal) =>
        Object.freeze({
          recommendationId: signal.recommendationId,
          label: signal.affectedRegionIds.map(regionLabel).join(" · "),
          confidenceState: signal.confidenceState,
          evidenceStrength: signal.evidenceStrength,
        })
      )
    ),
    uncertaintySummaries: Object.freeze(
      input.snapshot.state.recommendationUncertaintyRecords.map((r) => r.explanation)
    ),
    headline: input.snapshot.semantics.headline,
    viewHint,
  });
}

/**
 * Evaluate strategic recommendation confidence (read-only; does not fabricate certainty).
 */
export function evaluateRecommendationConfidence(
  input: EvaluateRecommendationConfidenceInput
): EvaluateRecommendationConfidenceResult {
  const topology = input.topology;
  const tick = Math.floor(Number(input.tick ?? input.confidenceContext?.tick) || 0);
  const confidenceStateId = String(
    input.confidenceStateId ?? `recommendation-confidence::${topology.topologyId}::${tick}`
  ).trim();

  const confidenceLeverageFactor = clamp01Stress(
    (input.simulationEvents?.length ?? 0) * 0.004 +
      (input.confidenceContext?.confidenceLeverageFactor ?? 0)
  );
  const ambiguityStressFactor = clamp01Stress(input.confidenceContext?.ambiguityStressFactor ?? 0);

  logConfidenceDev("RecommendationConfidence", {
    confidenceStateId,
    topologyId: topology.topologyId,
    tick,
    recommendationLabel: input.recommendationState.strategicRecommendationLabel,
    foresightLabel: input.foresightState.predictiveForesightLabel,
  });

  const activeConfidenceSignals = deriveRecommendationConfidenceSignals({
    recommendationState: input.recommendationState,
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
    confidenceLeverageFactor,
    ambiguityStressFactor,
  });

  const overallConfidenceScore = calculateOverallConfidenceScore({
    signals: activeConfidenceSignals,
    recommendationState: input.recommendationState,
  });

  const evidenceStabilityScore = calculateEvidenceStabilityScore({
    trajectoryState: input.trajectoryState,
    divergenceState: input.divergenceState,
    equilibriumState: input.equilibriumState,
  });

  const predictiveConsistencyScore = calculatePredictiveConsistencyScore({
    divergenceState: input.divergenceState,
    trajectoryState: input.trajectoryState,
    foresightState: input.foresightState,
  });

  const uncertaintyAmplificationScore = calculateUncertaintyAmplificationScore({
    divergenceState: input.divergenceState,
    cascadeState: input.cascadeState,
    trajectoryState: input.trajectoryState,
  });

  const recommendationUncertaintyRecords = analyzeRecommendationUncertainty({
    topology,
    signals: activeConfidenceSignals,
    recommendationState: input.recommendationState,
    foresightState: input.foresightState,
    recoveryOpportunityState: input.recoveryOpportunityState,
    divergenceState: input.divergenceState,
    cascadeState: input.cascadeState,
    trajectoryState: input.trajectoryState,
    momentumState: input.momentumState,
    equilibriumState: input.equilibriumState,
  });

  const evidenceStrengthRecords = analyzeEvidenceStrength({
    signals: activeConfidenceSignals,
    recommendationState: input.recommendationState,
    foresightState: input.foresightState,
    recoveryOpportunityState: input.recoveryOpportunityState,
    divergenceState: input.divergenceState,
    trajectoryState: input.trajectoryState,
    resilienceState: input.resilienceState,
    equilibriumState: input.equilibriumState,
  });

  const recommendationFingerprint = stableStringify({
    label: input.recommendationState.strategicRecommendationLabel,
    confidence: input.recommendationState.recommendationConfidenceScore,
    count: input.recommendationState.activeRecommendations.length,
  });
  const foresightFingerprint = stableStringify({
    label: input.foresightState.predictiveForesightLabel,
    preparedness: input.foresightState.strategicPreparednessScore,
  });
  const divergenceFingerprint = stableStringify({
    fragmentation: input.divergenceState.futureFragmentationScore,
    label: input.divergenceState.multiFutureDivergenceLabel,
  });

  const pendingFingerprint = buildConfidenceContentFingerprint({
    topologyFingerprint: topology.fingerprint,
    recommendationFingerprint,
    foresightFingerprint,
    divergenceFingerprint,
    tick,
  });

  const guard = guardEvaluateRecommendationConfidence({
    topologyId: topology.topologyId,
    regionIds: topology.operationalRegions.map((r) => r.regionId),
    signals: activeConfidenceSignals,
    priorConfidenceFingerprints: input.priorConfidenceFingerprints,
    pendingFingerprint,
    overallConfidenceScore,
    evidenceStabilityScore,
  });
  if (!guard.ok) return { ok: false, guard };

  const recommendationConfidenceLabel = classifyRecommendationConfidenceLabel({
    overallConfidenceScore,
    uncertaintyAmplificationScore,
    evidenceStabilityScore,
  });

  const state: RecommendationConfidenceState = Object.freeze({
    activeConfidenceSignals: Object.freeze(activeConfidenceSignals),
    recommendationUncertaintyRecords,
    evidenceStrengthRecords,
    uncertaintyZones: identifyUncertaintyZones(activeConfidenceSignals, input.foresightState),
    stableRecommendationZones: identifyStableRecommendationZones(
      activeConfidenceSignals,
      input.recommendationState
    ),
    overallConfidenceScore,
    evidenceStabilityScore,
    predictiveConsistencyScore,
    uncertaintyAmplificationScore,
    recommendationConfidenceLabel,
    uncertaintyDisclaimer: CONFIDENCE_UNCERTAINTY_DISCLAIMER,
  });

  const semantics = buildExecutiveRecommendationConfidenceSemantics({ state });
  const semanticsGuard = guardConfidenceExecutiveSemantics({
    headline: semantics.headline,
    summary: semantics.summary,
  });
  if (!semanticsGuard.ok) return { ok: false, guard: semanticsGuard };

  const fingerprint = stableStringify({
    content: pendingFingerprint,
    confidenceStateId,
    recommendationConfidenceLabel,
    overallConfidenceScore,
    evidenceStabilityScore,
  });

  const snapshot: RecommendationConfidenceSnapshot = Object.freeze({
    confidenceStateId,
    topologyId: topology.topologyId,
    recommendationStateId: `strategic-recommendation::${topology.topologyId}::${tick}`,
    tick,
    state,
    semantics: Object.freeze({
      ...semantics,
      confidenceSummaries: Object.freeze([...semantics.confidenceSummaries]),
      uncertaintySummaries: Object.freeze([...semantics.uncertaintySummaries]),
      evidenceSummaries: Object.freeze([...semantics.evidenceSummaries]),
      bullets: Object.freeze([...semantics.bullets]),
    }),
    fingerprint,
    builtAt: confidenceBuiltAt(tick),
  });

  const panelContract = buildRecommendationConfidencePanelContract({ snapshot });

  return { ok: true, snapshot, panelContract };
}

export function freezeRecommendationConfidenceSnapshot(
  snapshot: RecommendationConfidenceSnapshot
): RecommendationConfidenceSnapshot {
  return Object.freeze({
    ...snapshot,
    state: Object.freeze({
      ...snapshot.state,
      activeConfidenceSignals: Object.freeze(
        snapshot.state.activeConfidenceSignals.map((s) => Object.freeze({ ...s }))
      ),
      recommendationUncertaintyRecords: Object.freeze(
        snapshot.state.recommendationUncertaintyRecords.map((r) => Object.freeze({ ...r }))
      ),
      evidenceStrengthRecords: Object.freeze(
        snapshot.state.evidenceStrengthRecords.map((r) => Object.freeze({ ...r }))
      ),
      uncertaintyZones: Object.freeze([...snapshot.state.uncertaintyZones]),
      stableRecommendationZones: Object.freeze([...snapshot.state.stableRecommendationZones]),
    }),
    semantics: Object.freeze({ ...snapshot.semantics }),
  });
}

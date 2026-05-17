/**
 * D7:5:2 — Recommendation confidence scoring modeling.
 */

import type { StrategicRecommendationState } from "./strategicRecommendationTypes.ts";
import type { PredictiveExecutiveForesightState } from "../simulation/predictive/executiveForesightTypes.ts";
import type { PredictiveStrategicAdaptationState } from "../simulation/predictive/strategicAdaptationTypes.ts";
import type { PredictiveCollapsePreventionState } from "../simulation/predictive/collapsePreventionTypes.ts";
import type { PredictiveCascadeState } from "../simulation/predictive/cascadingConsequenceTypes.ts";
import type { PredictiveRecoveryOpportunityState } from "../simulation/predictive/recoveryOpportunityTypes.ts";
import type { EnterpriseEquilibriumState } from "../simulation/equilibrium/equilibriumTypes.ts";
import type { EnterpriseMomentumState } from "../simulation/momentum/operationalMomentumTypes.ts";
import type { HumanSystemResilienceState } from "../simulation/resilience/humanSystemResilienceTypes.ts";
import type { MultiFutureDivergenceState } from "../simulation/predictive/multiFutureDivergenceTypes.ts";
import type { PredictiveTrajectoryState } from "../simulation/predictive/futureTrajectoryTypes.ts";
import type {
  RecommendationConfidenceSignal,
  RecommendationConfidenceStateLabel,
  RecommendationConfidenceState,
} from "./recommendationConfidenceTypes.ts";
import { logConfidenceDev } from "./confidenceDevLog.ts";

function clamp01(n: number): number {
  if (!Number.isFinite(n)) return 0;
  return Number(Math.min(1, Math.max(0, n)).toFixed(4));
}

function confidenceStateFromScores(
  evidence: number,
  stability: number,
  uncertainty: number
): RecommendationConfidenceStateLabel {
  if (uncertainty >= 0.72) return "volatile";
  if (uncertainty >= 0.58 && evidence < 0.45) return "low";
  if (evidence >= 0.62 && stability >= 0.55 && uncertainty < 0.4) return "high";
  if (evidence >= 0.48 && stability >= 0.4) return "moderate";
  if (uncertainty >= 0.45) return "uncertain";
  return "low";
}

export function deriveRecommendationConfidenceSignals(input: {
  recommendationState: StrategicRecommendationState;
  foresightState: PredictiveExecutiveForesightState;
  adaptationState: PredictiveStrategicAdaptationState;
  preventionState: PredictiveCollapsePreventionState;
  recoveryOpportunityState: PredictiveRecoveryOpportunityState;
  cascadeState: PredictiveCascadeState;
  trajectoryState: PredictiveTrajectoryState;
  divergenceState: MultiFutureDivergenceState;
  resilienceState: HumanSystemResilienceState;
  momentumState: EnterpriseMomentumState;
  equilibriumState: EnterpriseEquilibriumState;
  confidenceLeverageFactor?: number;
  ambiguityStressFactor?: number;
}): RecommendationConfidenceSignal[] {
  const signals: RecommendationConfidenceSignal[] = [];
  const leverage = clamp01(input.confidenceLeverageFactor ?? 0);
  const ambiguity = clamp01(input.ambiguityStressFactor ?? 0);

  const globalStability = clamp01(
    (1 - input.trajectoryState.trajectoryVolatilityScore) * 0.3 +
      input.divergenceState.futureConvergenceScore * 0.25 +
      input.equilibriumState.equilibriumScore * 0.25 +
      input.resilienceState.enterpriseResilienceScore * 0.2
  );
  const globalUncertainty = clamp01(
    input.divergenceState.futureFragmentationScore * 0.35 +
      input.trajectoryState.trajectoryVolatilityScore * 0.3 +
      input.cascadeState.cascadeAmplificationScore * 0.2 +
      ambiguity * 0.15
  );

  for (const rec of input.recommendationState.activeRecommendations) {
    const inUncertaintyZone = rec.affectedRegionIds.some((r) =>
      input.foresightState.longHorizonRiskZones.includes(r)
    );
    const inStableZone = rec.affectedRegionIds.some((r) =>
      input.foresightState.futureReadinessZones.includes(r) ||
      input.recommendationState.stabilizationRecommendationZones.includes(r)
    );

    const evidenceBase = clamp01(
      rec.recommendationStrength * 0.35 +
        input.recommendationState.recommendationConfidenceScore * 0.25 +
        input.foresightState.strategicPreparednessScore * 0.2 +
        (inStableZone ? 0.15 : 0) +
        leverage * 0.1
    );
    const stabilityBase = clamp01(
      globalStability * 0.5 +
        (inStableZone ? 0.25 : 0) +
        input.recoveryOpportunityState.stabilizationPotentialScore * 0.15
    );
    const uncertaintyBase = clamp01(
      globalUncertainty * 0.4 +
        (inUncertaintyZone ? 0.25 : 0) +
        (input.momentumState.momentumTrendLabel === "accelerating_failure" ? 0.2 : 0)
    );

    const drivers: string[] = [];
    if (globalStability >= 0.5) drivers.push("evidence_stability");
    if (globalUncertainty >= 0.45) drivers.push("predictive_uncertainty");
    if (input.resilienceState.enterpriseResilienceScore >= 0.4) {
      drivers.push("resilience_backed");
    }
    if (input.divergenceState.futureFragmentationScore >= 0.45) {
      drivers.push("future_divergence");
    }

    const confidenceState = confidenceStateFromScores(
      evidenceBase,
      stabilityBase,
      uncertaintyBase
    );
    const evidenceStrength = clamp01(
      evidenceBase * 0.5 + stabilityBase * 0.35 + (1 - uncertaintyBase) * 0.15
    );

    signals.push(
      Object.freeze({
        recommendationId: rec.recommendationId,
        affectedRegionIds: Object.freeze([...rec.affectedRegionIds]),
        confidenceState,
        evidenceStrength,
        dominantConfidenceDrivers: Object.freeze([...new Set(drivers)].sort()),
        executiveLabel: `Recommendation confidence for ${rec.recommendationId} reflects grounded evidence under current operational conditions`,
      })
    );
  }

  if (
    input.recoveryOpportunityState.recoveryOpportunityLabel === "accelerating" ||
    input.recoveryOpportunityState.recoveryOpportunityLabel === "stabilizing"
  ) {
    if (input.divergenceState.futureFragmentationScore >= 0.4) {
      const recoveryRec = input.recommendationState.activeRecommendations.find((r) =>
        r.recommendationId.includes("recovery")
      );
      if (recoveryRec) {
        const idx = signals.findIndex((s) => s.recommendationId === recoveryRec.recommendationId);
        if (idx >= 0) {
          signals[idx] = Object.freeze({
            ...signals[idx]!,
            confidenceState: "moderate",
            evidenceStrength: clamp01(
              input.recoveryOpportunityState.recoveryAccelerationScore * 0.45 +
                (1 - input.divergenceState.futureFragmentationScore) * 0.35
            ),
            dominantConfidenceDrivers: Object.freeze([
              "recovery_improvement",
              "divergence_uncertainty",
            ]),
            executiveLabel:
              "Recovery opportunity exists although future divergence may limit recommendation confidence",
          });
        }
      }
    }
  }

  if (signals.length === 0) {
    signals.push(
      Object.freeze({
        recommendationId: "confidence::enterprise-uncertain",
        affectedRegionIds: Object.freeze(["logistics"]),
        confidenceState: "uncertain",
        evidenceStrength: 0.35,
        dominantConfidenceDrivers: Object.freeze(["insufficient_evidence"]),
        executiveLabel:
          "Limited evidence may weaken overall recommendation confidence under current conditions",
      })
    );
  }

  logConfidenceDev("RecommendationConfidence", { signalCount: signals.length });
  return signals.sort((a, b) => a.recommendationId.localeCompare(b.recommendationId));
}

export function calculateOverallConfidenceScore(input: {
  signals: readonly RecommendationConfidenceSignal[];
  recommendationState: StrategicRecommendationState;
}): number {
  const high = input.signals.filter(
    (s) => s.confidenceState === "high" || s.confidenceState === "moderate"
  );
  const score = clamp01(
    (high.length / Math.max(1, input.signals.length)) * 0.4 +
      input.recommendationState.recommendationConfidenceScore * 0.35 +
      high.reduce((sum, s) => sum + s.evidenceStrength, 0) /
        Math.max(1, high.length || 1) *
        0.25
  );
  logConfidenceDev("ConfidenceScore", { overallConfidenceScore: score });
  return score;
}

export function calculateEvidenceStabilityScore(input: {
  trajectoryState: PredictiveTrajectoryState;
  divergenceState: MultiFutureDivergenceState;
  equilibriumState: EnterpriseEquilibriumState;
}): number {
  const score = clamp01(
    (1 - input.trajectoryState.trajectoryVolatilityScore) * 0.35 +
      input.divergenceState.futureConvergenceScore * 0.35 +
      input.equilibriumState.equilibriumScore * 0.3
  );
  logConfidenceDev("EvidenceStrength", { evidenceStabilityScore: score });
  return score;
}

export function calculatePredictiveConsistencyScore(input: {
  divergenceState: MultiFutureDivergenceState;
  trajectoryState: PredictiveTrajectoryState;
  foresightState: PredictiveExecutiveForesightState;
}): number {
  const score = clamp01(
    input.divergenceState.futureConvergenceScore * 0.4 +
      (1 - input.divergenceState.futureFragmentationScore) * 0.35 +
      (1 - input.trajectoryState.trajectoryDivergenceScore) * 0.15 +
      input.foresightState.futureReadinessScore * 0.1
  );
  logConfidenceDev("ConfidenceScore", { predictiveConsistencyScore: score });
  return score;
}

export function calculateUncertaintyAmplificationScore(input: {
  divergenceState: MultiFutureDivergenceState;
  cascadeState: PredictiveCascadeState;
  trajectoryState: PredictiveTrajectoryState;
}): number {
  const score = clamp01(
    input.divergenceState.futureFragmentationScore * 0.4 +
      input.cascadeState.cascadeAmplificationScore * 0.3 +
      input.trajectoryState.trajectoryVolatilityScore * 0.3
  );
  logConfidenceDev("Uncertainty", { uncertaintyAmplificationScore: score });
  return score;
}

export function identifyUncertaintyZones(
  signals: readonly RecommendationConfidenceSignal[],
  foresightState: PredictiveExecutiveForesightState
): readonly string[] {
  const zones = new Set<string>(foresightState.longHorizonRiskZones);
  for (const signal of signals) {
    if (
      signal.confidenceState === "uncertain" ||
      signal.confidenceState === "volatile" ||
      signal.confidenceState === "low"
    ) {
      for (const r of signal.affectedRegionIds) zones.add(r);
    }
  }
  return Object.freeze([...zones].sort());
}

export function identifyStableRecommendationZones(
  signals: readonly RecommendationConfidenceSignal[],
  recommendationState: StrategicRecommendationState
): readonly string[] {
  const zones = new Set<string>(recommendationState.resilienceSupportZones);
  for (const signal of signals) {
    if (signal.confidenceState === "high" || signal.confidenceState === "moderate") {
      for (const r of signal.affectedRegionIds) zones.add(r);
    }
  }
  return Object.freeze([...zones].sort());
}

export function classifyRecommendationConfidenceLabel(input: {
  overallConfidenceScore: number;
  uncertaintyAmplificationScore: number;
  evidenceStabilityScore: number;
}): RecommendationConfidenceState["recommendationConfidenceLabel"] {
  if (input.uncertaintyAmplificationScore >= 0.7) return "volatile";
  if (input.uncertaintyAmplificationScore >= 0.55) return "uncertain";
  if (input.overallConfidenceScore >= 0.62 && input.evidenceStabilityScore >= 0.5) {
    return "high";
  }
  if (input.overallConfidenceScore >= 0.45) return "moderate";
  if (input.overallConfidenceScore >= 0.3) return "low";
  return "low";
}

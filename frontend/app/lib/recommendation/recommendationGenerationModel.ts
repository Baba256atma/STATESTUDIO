/**
 * D7:5:1 — Strategic recommendation generation modeling.
 */

import type { PredictiveExecutiveForesightState } from "../simulation/predictive/executiveForesightTypes.ts";
import type { PredictiveStrategicAdaptationState } from "../simulation/predictive/strategicAdaptationTypes.ts";
import type { PredictiveCollapsePreventionState } from "../simulation/predictive/collapsePreventionTypes.ts";
import type { PredictiveCascadeState } from "../simulation/predictive/cascadingConsequenceTypes.ts";
import type { PredictiveRecoveryOpportunityState } from "../simulation/predictive/recoveryOpportunityTypes.ts";
import type { EnterpriseEquilibriumState } from "../simulation/equilibrium/equilibriumTypes.ts";
import type { EnterpriseMomentumState } from "../simulation/momentum/operationalMomentumTypes.ts";
import type { HumanSystemResilienceState } from "../simulation/resilience/humanSystemResilienceTypes.ts";
import type { OperationalUniverseTopology } from "../simulation/topology/topologyTypes.ts";
import type { MultiFutureDivergenceState } from "../simulation/predictive/multiFutureDivergenceTypes.ts";
import type { PredictiveTrajectoryState } from "../simulation/predictive/futureTrajectoryTypes.ts";
import type {
  StrategicRecommendationSignal,
  StrategicRecommendationStateLabel,
  StrategicRecommendationState,
} from "./strategicRecommendationTypes.ts";
import { logRecommendationDev } from "./recommendationDevLog.ts";

function clamp01(n: number): number {
  if (!Number.isFinite(n)) return 0;
  return Number(Math.min(1, Math.max(0, n)).toFixed(4));
}

function recommendationStateFromScores(
  preventive: number,
  stabilizing: number,
  adaptive: number
): StrategicRecommendationStateLabel {
  if (preventive >= 0.72) return "critical";
  if (preventive >= 0.58 && stabilizing < 0.45) return "preventive";
  if (stabilizing >= 0.58) return "stabilizing";
  if (adaptive >= 0.55) return "adaptive";
  return "informational";
}

export function deriveStrategicRecommendations(input: {
  topology: OperationalUniverseTopology;
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
  recommendationLeverageFactor?: number;
  interventionStressFactor?: number;
}): StrategicRecommendationSignal[] {
  const recommendations: StrategicRecommendationSignal[] = [];
  const leverage = clamp01(input.recommendationLeverageFactor ?? 0);
  const stress = clamp01(input.interventionStressFactor ?? 0);

  const dependencyPressureCluster =
    input.preventionState.criticalThresholdProximityScore >= 0.5 ||
    input.cascadeState.cascadeAmplificationScore >= 0.45;

  const weakRecoveryCoordination =
    input.recoveryOpportunityState.recoveryOpportunityLabel === "fragile" ||
    input.recoveryOpportunityState.recoveryOpportunityLabel === "limited";

  for (const region of input.topology.operationalRegions) {
    const inCritical = input.preventionState.criticalCollapseZones.includes(region.regionId);
    const inStabilization = input.recoveryOpportunityState.stabilizationOpportunityZones.includes(
      region.regionId
    );
    const inForesightRisk = input.foresightState.longHorizonRiskZones.includes(region.regionId);
    const inAdaptationFragile = input.adaptationState.adaptationFragilityZones.includes(
      region.regionId
    );

    const preventiveBase = clamp01(
      (inCritical ? 0.3 : 0) +
        (inForesightRisk ? 0.2 : 0) +
        input.preventionState.criticalThresholdProximityScore * 0.25 +
        stress * 0.15
    );
    const stabilizingBase = clamp01(
      (inStabilization ? 0.25 : 0) +
        input.recoveryOpportunityState.stabilizationPotentialScore * 0.25 +
        input.equilibriumState.equilibriumScore * 0.2 +
        leverage * 0.1
    );
    const adaptiveBase = clamp01(
      input.adaptationState.adaptiveResilienceScore * 0.25 +
        input.resilienceState.enterpriseResilienceScore * 0.2 +
        (inStabilization ? 0.15 : 0)
    );

    const drivers: string[] = [];
    if (inCritical) drivers.push("collapse_proximity");
    if (inAdaptationFragile) drivers.push("adaptation_fragility");
    if (inStabilization) drivers.push("stabilization_opportunity");

    const recommendationState = recommendationStateFromScores(
      preventiveBase,
      stabilizingBase,
      adaptiveBase
    );
    const recommendationStrength = clamp01(
      preventiveBase * 0.35 + stabilizingBase * 0.35 + adaptiveBase * 0.3
    );

    if (recommendationStrength < 0.28 && recommendationState === "informational") continue;

    recommendations.push(
      Object.freeze({
        recommendationId: `recommendation::${region.regionId}`,
        affectedRegionIds: Object.freeze([region.regionId]),
        recommendationState,
        recommendationStrength,
        dominantRecommendationDrivers: Object.freeze([...new Set(drivers)].sort()),
        executiveLabel: `Grounded strategic actions may support ${region.label} operational stability`,
      })
    );
  }

  if (dependencyPressureCluster && weakRecoveryCoordination) {
    recommendations.push(
      Object.freeze({
        recommendationId: "recommendation::dependency-concentration",
        affectedRegionIds: Object.freeze(["logistics", "manufacturing"].sort()),
        recommendationState: "preventive",
        recommendationStrength: clamp01(
          input.preventionState.criticalThresholdProximityScore * 0.45 +
            input.cascadeState.cascadeAmplificationScore * 0.35 +
            stress * 0.1
        ),
        dominantRecommendationDrivers: Object.freeze([
          "dependency_pressure",
          "recovery_coordination",
        ]),
        executiveLabel:
          "High dependency pressure with weak recovery coordination may warrant reducing dependency concentration across logistics and manufacturing",
      })
    );
  }

  if (
    input.resilienceState.enterpriseResilienceScore >= 0.4 &&
    (input.momentumState.momentumTrendLabel === "recovering" ||
      input.momentumState.momentumTrendLabel === "stabilizing")
  ) {
    recommendations.push(
      Object.freeze({
        recommendationId: "recommendation::recovery-synchronization",
        affectedRegionIds: Object.freeze(
          [...input.recoveryOpportunityState.resilienceAccelerationZones].sort().slice(0, 4)
        ),
        recommendationState: "stabilizing",
        recommendationStrength: clamp01(
          input.resilienceState.enterpriseResilienceScore * 0.4 +
            input.recoveryOpportunityState.recoveryAccelerationScore * 0.35 +
            leverage * 0.1
        ),
        dominantRecommendationDrivers: Object.freeze([
          "resilience_trend",
          "momentum_stabilization",
        ]),
        executiveLabel:
          "Improving resilience trends with stabilizing momentum may support accelerating recovery synchronization",
      })
    );
  }

  if (input.foresightState.longHorizonRiskZones.length > 0) {
    recommendations.push(
      Object.freeze({
        recommendationId: "recommendation::logistics-coordination",
        affectedRegionIds: Object.freeze(["logistics", "manufacturing"].sort()),
        recommendationState: "stabilizing",
        recommendationStrength: clamp01(
          0.5 + input.foresightState.longHorizonRiskScore * 0.25
        ),
        dominantRecommendationDrivers: Object.freeze([
          "logistics_coordination",
          "dependency_pressure",
        ]),
        executiveLabel:
          "Prioritizing logistics coordination stabilization may reduce future dependency-pressure amplification across manufacturing recovery systems",
      })
    );
  }

  for (const gap of input.foresightState.executivePreparationGapRecords.slice(0, 2)) {
    recommendations.push(
      Object.freeze({
        recommendationId: `recommendation::prep-gap::${gap.recordId}`,
        affectedRegionIds: Object.freeze([gap.regionId]),
        recommendationState: gap.gapSeverity >= 0.6 ? "critical" : "preventive",
        recommendationStrength: clamp01(gap.gapSeverity),
        dominantRecommendationDrivers: Object.freeze([gap.gapType]),
        executiveLabel: gap.explanation.replace(
          /may need|may lag|may require/gi,
          "may benefit from executive review to"
        ),
      })
    );
  }

  if (input.divergenceState.futureFragmentationScore >= 0.45) {
    recommendations.push(
      Object.freeze({
        recommendationId: "recommendation::equilibrium-restoration",
        affectedRegionIds: Object.freeze(
          [...input.divergenceState.fragmentedFutureZones].sort().slice(0, 3)
        ),
        recommendationState: "adaptive",
        recommendationStrength: clamp01(input.divergenceState.futureFragmentationScore * 0.75),
        dominantRecommendationDrivers: Object.freeze(["future_fragmentation", "equilibrium"]),
        executiveLabel:
          "Equilibrium restoration actions may reduce fragmented future divergence across operational domains",
      })
    );
  }

  if (recommendations.length === 0) {
    recommendations.push(
      Object.freeze({
        recommendationId: "recommendation::enterprise-informational",
        affectedRegionIds: Object.freeze(["logistics"]),
        recommendationState: "informational",
        recommendationStrength: 0.35,
        dominantRecommendationDrivers: Object.freeze(["limited_recommendation_signal"]),
        executiveLabel:
          "Limited strategic recommendation signals may emerge; continued executive monitoring is advisable",
      })
    );
  }

  logRecommendationDev("Recommendation", { recommendationCount: recommendations.length });
  return recommendations.sort((a, b) => a.recommendationId.localeCompare(b.recommendationId));
}

export function calculateRecommendationConfidenceScore(input: {
  recommendations: readonly StrategicRecommendationSignal[];
  foresightState: PredictiveExecutiveForesightState;
  adaptationState: PredictiveStrategicAdaptationState;
}): number {
  const grounded = input.recommendations.filter(
    (r) => r.recommendationState !== "informational"
  );
  const score = clamp01(
    (grounded.length / Math.max(1, input.recommendations.length)) * 0.4 +
      input.foresightState.strategicPreparednessScore * 0.3 +
      input.adaptationState.adaptiveResilienceScore * 0.3
  );
  logRecommendationDev("StrategicAction", { recommendationConfidenceScore: score });
  return score;
}

export function calculateStabilizationLeverageScore(input: {
  recommendations: readonly StrategicRecommendationSignal[];
  recoveryOpportunityState: PredictiveRecoveryOpportunityState;
  preventionState: PredictiveCollapsePreventionState;
}): number {
  const stabilizing = input.recommendations.filter(
    (r) => r.recommendationState === "stabilizing" || r.recommendationState === "preventive"
  );
  const score = clamp01(
    (stabilizing.length / Math.max(1, input.recommendations.length)) * 0.35 +
      input.recoveryOpportunityState.stabilizationPotentialScore * 0.35 +
      input.preventionState.collapseInterruptionScore * 0.3
  );
  logRecommendationDev("StabilizationAdvice", { stabilizationLeverageScore: score });
  return score;
}

export function calculateInterventionRiskScore(input: {
  recommendations: readonly StrategicRecommendationSignal[];
  cascadeState: PredictiveCascadeState;
  trajectoryState: PredictiveTrajectoryState;
}): number {
  const critical = input.recommendations.filter(
    (r) => r.recommendationState === "critical" || r.recommendationState === "preventive"
  );
  const score = clamp01(
    (critical.length / Math.max(1, input.recommendations.length)) * 0.4 +
      input.cascadeState.cascadeAmplificationScore * 0.3 +
      input.trajectoryState.trajectoryVolatilityScore * 0.3
  );
  logRecommendationDev("Intervention", { interventionRiskScore: score });
  return score;
}

export function identifyStabilizationRecommendationZones(
  recommendations: readonly StrategicRecommendationSignal[]
): readonly string[] {
  const zones = new Set<string>();
  for (const rec of recommendations) {
    if (
      rec.recommendationState === "stabilizing" ||
      rec.recommendationState === "preventive" ||
      rec.recommendationState === "adaptive"
    ) {
      for (const r of rec.affectedRegionIds) zones.add(r);
    }
  }
  return Object.freeze([...zones].sort());
}

export function identifyCriticalInterventionZones(
  recommendations: readonly StrategicRecommendationSignal[],
  preventionState: PredictiveCollapsePreventionState
): readonly string[] {
  const zones = new Set<string>(preventionState.criticalCollapseZones);
  for (const rec of recommendations) {
    if (rec.recommendationState === "critical" || rec.recommendationState === "preventive") {
      for (const r of rec.affectedRegionIds) zones.add(r);
    }
  }
  return Object.freeze([...zones].sort());
}

export function identifyResilienceSupportZones(
  recommendations: readonly StrategicRecommendationSignal[],
  recoveryOpportunityState: PredictiveRecoveryOpportunityState
): readonly string[] {
  const zones = new Set<string>(recoveryOpportunityState.resilienceAccelerationZones);
  for (const rec of recommendations) {
    if (rec.recommendationState === "stabilizing" || rec.recommendationState === "adaptive") {
      for (const r of rec.affectedRegionIds) zones.add(r);
    }
  }
  return Object.freeze([...zones].sort());
}

export function classifyStrategicRecommendationLabel(input: {
  recommendationConfidenceScore: number;
  stabilizationLeverageScore: number;
  interventionRiskScore: number;
}): StrategicRecommendationState["strategicRecommendationLabel"] {
  if (input.interventionRiskScore >= 0.7) return "critical";
  if (input.interventionRiskScore >= 0.55) return "preventive";
  if (
    input.stabilizationLeverageScore >= 0.58 &&
    input.recommendationConfidenceScore >= 0.45
  ) {
    return "stabilizing";
  }
  if (input.recommendationConfidenceScore >= 0.45) return "adaptive";
  return "informational";
}

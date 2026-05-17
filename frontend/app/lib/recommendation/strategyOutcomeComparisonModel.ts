/**
 * D7:5:4 — Strategy-outcome comparison modeling.
 */

import type { ExecutiveTradeoffState } from "./tradeoffAnalysisTypes.ts";
import type { StrategicRecommendationState } from "./strategicRecommendationTypes.ts";
import type { RecommendationConfidenceState } from "./recommendationConfidenceTypes.ts";
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
  ExecutiveMultiStrategyState,
  StrategyComparisonSignal,
  StrategyComparisonStateLabel,
  StrategyPathwayRecord,
} from "./multiStrategyComparisonTypes.ts";
import { logStrategyComparisonDev } from "./comparisonDevLog.ts";

function clamp01(n: number): number {
  if (!Number.isFinite(n)) return 0;
  return Number(Math.min(1, Math.max(0, n)).toFixed(4));
}

function comparisonStateFromProfile(
  stabilization: number,
  adaptability: number,
  volatility: number
): StrategyComparisonStateLabel {
  if (volatility >= 0.72) return "volatile";
  if (stabilization >= 0.62 && adaptability < 0.4) return "recovery_focused";
  if (adaptability >= 0.58 && volatility >= 0.45) return "adaptive";
  if (volatility >= 0.55 && stabilization < 0.45) return "risk_heavy";
  if (Math.abs(stabilization - adaptability) < 0.15) return "balanced";
  return stabilization > adaptability ? "recovery_focused" : "adaptive";
}

export function deriveStrategyComparisonSignals(input: {
  recommendationState: StrategicRecommendationState;
  confidenceState: RecommendationConfidenceState;
  foresightState: PredictiveExecutiveForesightState;
  tradeoffState: ExecutiveTradeoffState;
  adaptationState: PredictiveStrategicAdaptationState;
  preventionState: PredictiveCollapsePreventionState;
  recoveryOpportunityState: PredictiveRecoveryOpportunityState;
  divergenceState: MultiFutureDivergenceState;
  cascadeState: PredictiveCascadeState;
  trajectoryState: PredictiveTrajectoryState;
  resilienceState: HumanSystemResilienceState;
  momentumState: EnterpriseMomentumState;
  equilibriumState: EnterpriseEquilibriumState;
  comparisonLeverageFactor?: number;
  divergenceStressFactor?: number;
}): StrategyComparisonSignal[] {
  const leverage = clamp01(input.comparisonLeverageFactor ?? 0);
  const stress = clamp01(input.divergenceStressFactor ?? 0);

  const strategyAStabilization = clamp01(
    input.preventionState.collapseInterruptionScore * 0.35 +
      input.recoveryOpportunityState.stabilizationPotentialScore * 0.35 +
      input.equilibriumState.equilibriumScore * 0.2 +
      leverage * 0.1
  );
  const strategyAAdaptability = clamp01(0.25 + (1 - input.adaptationState.strategicFlexibilityScore) * 0.35);
  const strategyAVolatility = clamp01(
    input.trajectoryState.trajectoryVolatilityScore * 0.3 + stress * 0.2
  );

  const strategyBStabilization = clamp01(input.adaptationState.adaptiveResilienceScore * 0.4);
  const strategyBAdaptability = clamp01(
    input.adaptationState.strategicFlexibilityScore * 0.45 +
      input.resilienceState.enterpriseResilienceScore * 0.35
  );
  const strategyBVolatility = clamp01(
    input.divergenceState.futureFragmentationScore * 0.4 +
      input.cascadeState.cascadeAmplificationScore * 0.35 +
      stress * 0.15
  );

  const strategyCStabilization = clamp01(
    (strategyAStabilization + strategyBStabilization) / 2
  );
  const strategyCAdaptability = clamp01(
    (strategyAAdaptability + strategyBAdaptability) / 2 + 0.1
  );
  const strategyCVolatility = clamp01(
    (strategyAVolatility + strategyBVolatility) / 2 * 0.85
  );

  const stabilizationRegions =
    input.recommendationState.stabilizationRecommendationZones.length > 0
      ? [...input.recommendationState.stabilizationRecommendationZones].sort().slice(0, 4)
      : ["logistics", "manufacturing"];
  const costRegions =
    input.tradeoffState.operationalCostZones.length > 0
      ? [...input.tradeoffState.operationalCostZones].sort().slice(0, 4)
      : ["logistics"];
  const benefitRegions =
    input.tradeoffState.benefitZones.length > 0
      ? [...input.tradeoffState.benefitZones].sort().slice(0, 4)
      : ["manufacturing", "customer_systems"];

  const comparisons: StrategyComparisonSignal[] = [
    Object.freeze({
      strategyId: "strategy-a",
      strategyLabel: "Strategy A: stabilization-first",
      affectedRegionIds: Object.freeze(stabilizationRegions),
      comparisonState: comparisonStateFromProfile(
        strategyAStabilization,
        strategyAAdaptability,
        strategyAVolatility
      ),
      comparisonStrength: clamp01(strategyAStabilization * 0.5 + (1 - strategyAVolatility) * 0.5),
      dominantComparisonDrivers: Object.freeze([
        "stabilization_first",
        "fragility_reduction",
        "slower_adaptability",
      ]),
      executiveLabel:
        "Stabilization-first pathway may lower fragility although operational agility may slow",
    }),
    Object.freeze({
      strategyId: "strategy-b",
      strategyLabel: "Strategy B: aggressive restructuring",
      affectedRegionIds: Object.freeze(costRegions),
      comparisonState: comparisonStateFromProfile(
        strategyBStabilization,
        strategyBAdaptability,
        strategyBVolatility
      ),
      comparisonStrength: clamp01(strategyBAdaptability * 0.45 + strategyBStabilization * 0.35),
      dominantComparisonDrivers: Object.freeze([
        "aggressive_restructuring",
        "faster_adaptation",
        "short_term_instability",
      ]),
      executiveLabel:
        "Aggressive restructuring may improve adaptability although short-term instability exposure may rise",
    }),
    Object.freeze({
      strategyId: "strategy-c",
      strategyLabel: "Strategy C: balanced coordination optimization",
      affectedRegionIds: Object.freeze(benefitRegions),
      comparisonState: comparisonStateFromProfile(
        strategyCStabilization,
        strategyCAdaptability,
        strategyCVolatility
      ),
      comparisonStrength: clamp01(
        (strategyCStabilization + strategyCAdaptability) / 2
      ),
      dominantComparisonDrivers: Object.freeze([
        "balanced_coordination",
        "moderate_resilience",
        "moderate_flexibility",
      ]),
      executiveLabel:
        "Balanced coordination optimization may offer moderate resilience and flexibility across pathways",
    }),
  ];

  logStrategyComparisonDev("CompetingStrategies", { strategyCount: comparisons.length });
  return comparisons.sort((a, b) => a.strategyId.localeCompare(b.strategyId));
}

export function analyzeStrategyPathways(input: {
  comparisons: readonly StrategyComparisonSignal[];
  adaptationState: PredictiveStrategicAdaptationState;
  recoveryOpportunityState: PredictiveRecoveryOpportunityState;
  preventionState: PredictiveCollapsePreventionState;
}): readonly StrategyPathwayRecord[] {
  const records: StrategyPathwayRecord[] = [];

  const strategyA = input.comparisons.find((s) => s.strategyId === "strategy-a");
  if (strategyA) {
    records.push(
      Object.freeze({
        recordId: "pathway::strategy-a-stabilization",
        strategyId: strategyA.strategyId,
        pathwayType: "stabilization_focused",
        pathwayStrength: Number(Math.min(0.92, strategyA.comparisonStrength * 0.85).toFixed(4)),
        explanation:
          "Strategy A reduces dependency fragility across logistics recovery systems although operational agility may slow.",
        contributingStrategyIds: Object.freeze([strategyA.strategyId]),
      })
    );
    records.push(
      Object.freeze({
        recordId: "pathway::strategy-a-fragility",
        strategyId: strategyA.strategyId,
        pathwayType: "fragility_reduction",
        pathwayStrength: Number(
          Math.min(0.92, input.preventionState.criticalThresholdProximityScore * 0.7).toFixed(4)
        ),
        explanation:
          "Stabilization-first actions may concentrate on fragility reduction in critical operational zones.",
        contributingStrategyIds: Object.freeze([strategyA.strategyId]),
      })
    );
  }

  const strategyB = input.comparisons.find((s) => s.strategyId === "strategy-b");
  if (strategyB) {
    records.push(
      Object.freeze({
        recordId: "pathway::strategy-b-adaptive",
        strategyId: strategyB.strategyId,
        pathwayType: "flexibility_focused",
        pathwayStrength: Number(Math.min(0.92, strategyB.comparisonStrength * 0.8).toFixed(4)),
        explanation:
          "Strategy B improves adaptability although coordination volatility may increase near term.",
        contributingStrategyIds: Object.freeze([strategyB.strategyId]),
      })
    );
    records.push(
      Object.freeze({
        recordId: "pathway::strategy-b-resilience",
        strategyId: strategyB.strategyId,
        pathwayType: "resilience_optimization",
        pathwayStrength: Number(
          Math.min(0.92, input.adaptationState.adaptiveResilienceScore * 0.85).toFixed(4)
        ),
        explanation:
          "Aggressive restructuring may optimize long-term resilience at the cost of short-term stability.",
        contributingStrategyIds: Object.freeze([strategyB.strategyId]),
      })
    );
  }

  const strategyC = input.comparisons.find((s) => s.strategyId === "strategy-c");
  if (strategyC) {
    records.push(
      Object.freeze({
        recordId: "pathway::strategy-c-balanced",
        strategyId: strategyC.strategyId,
        pathwayType: "equilibrium_restoration",
        pathwayStrength: Number(Math.min(0.92, strategyC.comparisonStrength * 0.75).toFixed(4)),
        explanation:
          "Balanced coordination may restore equilibrium with moderate recovery acceleration and flexibility.",
        contributingStrategyIds: Object.freeze([strategyC.strategyId]),
      })
    );
    records.push(
      Object.freeze({
        recordId: "pathway::strategy-c-recovery",
        strategyId: strategyC.strategyId,
        pathwayType: "recovery_acceleration",
        pathwayStrength: Number(
          Math.min(0.92, input.recoveryOpportunityState.recoveryAccelerationScore * 0.7).toFixed(4)
        ),
        explanation:
          "Moderate recovery acceleration may accompany balanced pathway choices without extreme tradeoffs.",
        contributingStrategyIds: Object.freeze([strategyC.strategyId]),
      })
    );
  }

  logStrategyComparisonDev("StrategyComparison", { pathwayRecordCount: records.length });
  return Object.freeze(records.sort((a, b) => a.recordId.localeCompare(b.recordId)));
}

export function calculateComparisonStabilityScore(input: {
  comparisons: readonly StrategyComparisonSignal[];
  confidenceState: RecommendationConfidenceState;
}): number {
  const balanced = input.comparisons.filter(
    (s) => s.comparisonState === "balanced" || s.comparisonState === "recovery_focused"
  );
  const score = clamp01(
    (balanced.length / Math.max(1, input.comparisons.length)) * 0.4 +
      input.confidenceState.predictiveConsistencyScore * 0.35 +
      input.confidenceState.evidenceStabilityScore * 0.25
  );
  logStrategyComparisonDev("FutureComparison", { comparisonStabilityScore: score });
  return score;
}

export function calculatePathwayDivergenceScore(input: {
  comparisons: readonly StrategyComparisonSignal[];
  divergenceState: MultiFutureDivergenceState;
}): number {
  const divergent = input.comparisons.filter(
    (s) => s.comparisonState === "volatile" || s.comparisonState === "risk_heavy" || s.comparisonState === "adaptive"
  );
  const score = clamp01(
    (divergent.length / Math.max(1, input.comparisons.length)) * 0.4 +
      input.divergenceState.futureFragmentationScore * 0.35 +
      input.divergenceState.futureVolatilityScore * 0.25
  );
  logStrategyComparisonDev("FutureComparison", { pathwayDivergenceScore: score });
  return score;
}

export function calculateResilienceRiskAsymmetryScore(input: {
  comparisons: readonly StrategyComparisonSignal[];
  resilienceState: HumanSystemResilienceState;
  preventionState: PredictiveCollapsePreventionState;
}): number {
  const recoveryFocused = input.comparisons.filter((s) => s.comparisonState === "recovery_focused");
  const riskHeavy = input.comparisons.filter((s) => s.comparisonState === "risk_heavy");
  const score = clamp01(
    Math.abs(recoveryFocused.length - riskHeavy.length) / Math.max(1, input.comparisons.length) *
      0.35 +
      input.resilienceState.enterpriseResilienceScore * 0.35 +
      input.preventionState.criticalThresholdProximityScore * 0.3
  );
  logStrategyComparisonDev("PathwayEvaluation", { resilienceRiskAsymmetryScore: score });
  return score;
}

export function identifyDivergenceStrategyZones(
  comparisons: readonly StrategyComparisonSignal[],
  divergenceState: MultiFutureDivergenceState
): readonly string[] {
  const zones = new Set<string>(divergenceState.fragmentedFutureZones);
  for (const s of comparisons) {
    if (s.comparisonState === "volatile" || s.comparisonState === "risk_heavy") {
      for (const r of s.affectedRegionIds) zones.add(r);
    }
  }
  return Object.freeze([...zones].sort());
}

export function identifyBalancedStrategyZones(
  comparisons: readonly StrategyComparisonSignal[]
): readonly string[] {
  const zones = new Set<string>();
  for (const s of comparisons) {
    if (s.comparisonState === "balanced" || s.comparisonState === "recovery_focused") {
      for (const r of s.affectedRegionIds) zones.add(r);
    }
  }
  return Object.freeze([...zones].sort());
}

export function classifyExecutiveComparisonLabel(input: {
  comparisonStabilityScore: number;
  pathwayDivergenceScore: number;
  divergenceState: MultiFutureDivergenceState;
}): ExecutiveMultiStrategyState["executiveComparisonLabel"] {
  if (input.pathwayDivergenceScore >= 0.7) return "fragmented";
  if (input.pathwayDivergenceScore >= 0.55) return "volatile";
  if (
    input.divergenceState.futureConvergenceScore >= 0.55 &&
    input.comparisonStabilityScore >= 0.5 &&
    input.pathwayDivergenceScore < 0.55
  ) {
    return "convergent";
  }
  if (input.comparisonStabilityScore >= 0.55) return "balanced";
  return "divergent";
}
